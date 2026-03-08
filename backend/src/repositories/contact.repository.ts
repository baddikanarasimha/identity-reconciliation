import { Contact, LinkPrecedence, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { CreateContactInput, UpdateContactInput } from '../types/contact.types';
import logger from '../utils/logger';

export class ContactRepository {
  /**
   * Find all contacts matching email OR phoneNumber (non-deleted)
   */
  async findByEmailOrPhone(
    email?: string | null,
    phoneNumber?: string | null
  ): Promise<Contact[]> {
    const conditions: Prisma.ContactWhereInput[] = [];

    if (email) {
      conditions.push({ email, deletedAt: null });
    }
    if (phoneNumber) {
      conditions.push({ phoneNumber, deletedAt: null });
    }

    if (conditions.length === 0) return [];

    const contacts = await prisma.contact.findMany({
      where: {
        OR: conditions,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });

    logger.debug(`Found ${contacts.length} contacts for email=${email}, phone=${phoneNumber}`);
    return contacts;
  }

  /**
   * Find all contacts in the same cluster (same primary)
   * including contacts linked to any of the given primary IDs
   */
  async findAllLinkedContacts(primaryIds: number[]): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { id: { in: primaryIds }, deletedAt: null },
          { linkedId: { in: primaryIds }, deletedAt: null },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    logger.debug(`Found ${contacts.length} linked contacts for primaryIds=${primaryIds}`);
    return contacts;
  }

  /**
   * Find a contact by its ID
   */
  async findById(id: number): Promise<Contact | null> {
    return prisma.contact.findFirst({
      where: { id, deletedAt: null },
    });
  }

  /**
   * Create a new contact
   */
  async create(data: CreateContactInput): Promise<Contact> {
    const contact = await prisma.contact.create({
      data: {
        email: data.email ?? null,
        phoneNumber: data.phoneNumber ?? null,
        linkedId: data.linkedId ?? null,
        linkPrecedence: data.linkPrecedence,
      },
    });

    logger.info(`Created new ${data.linkPrecedence} contact id=${contact.id}`);
    return contact;
  }

  /**
   * Update a contact by ID
   */
  async update(id: number, data: UpdateContactInput): Promise<Contact> {
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    logger.info(`Updated contact id=${id}`);
    return contact;
  }

  /**
   * Demote a primary contact to secondary and update all its secondaries
   * to point to the new primary. This is done in a transaction.
   */
  async demotePrimaryToSecondary(
    oldPrimaryId: number,
    newPrimaryId: number
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // 1. Update all contacts that were linked to oldPrimary → point to newPrimary
      await tx.contact.updateMany({
        where: {
          linkedId: oldPrimaryId,
          deletedAt: null,
        },
        data: {
          linkedId: newPrimaryId,
          updatedAt: new Date(),
        },
      });

      // 2. Demote the oldPrimary itself
      await tx.contact.update({
        where: { id: oldPrimaryId },
        data: {
          linkedId: newPrimaryId,
          linkPrecedence: LinkPrecedence.secondary,
          updatedAt: new Date(),
        },
      });
    });

    logger.info(
      `Demoted contact id=${oldPrimaryId} from primary to secondary, linked to id=${newPrimaryId}`
    );
  }

  /**
   * Check if a contact with exact same email+phone already exists under a primary
   */
  async findExactMatch(
    email?: string | null,
    phoneNumber?: string | null,
    primaryIds?: number[]
  ): Promise<Contact | null> {
    return prisma.contact.findFirst({
      where: {
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
        deletedAt: null,
        ...(primaryIds && primaryIds.length > 0
          ? {
              OR: [
                { id: { in: primaryIds } },
                { linkedId: { in: primaryIds } },
              ],
            }
          : {}),
      },
    });
  }
}

export const contactRepository = new ContactRepository();
