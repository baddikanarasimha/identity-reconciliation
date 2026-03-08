import { Contact, LinkPrecedence } from '@prisma/client';
import { contactRepository } from '../repositories/contact.repository';
import {
  IdentifyRequest,
  ConsolidatedContact,
  IdentifyResponse,
  ValidationError,
} from '../types/contact.types';
import logger from '../utils/logger';

export class ContactService {
  /**
   * Main entry point: identify and reconcile contacts
   */
  async identify(request: IdentifyRequest): Promise<IdentifyResponse> {
    const { email, phoneNumber } = request;

    // Validate - at least one field required
    if (!email && !phoneNumber) {
      throw new ValidationError('At least one of email or phoneNumber must be provided');
    }

    logger.info(`Processing identify request: email=${email}, phone=${phoneNumber}`);

    // ── Step 1: Find all contacts matching email OR phoneNumber ───────────
    const matchingContacts = await contactRepository.findByEmailOrPhone(email, phoneNumber);

    // ── Step 2: No contacts found → create new PRIMARY ───────────────────
    if (matchingContacts.length === 0) {
      logger.info('No existing contacts found, creating new primary contact');
      const newContact = await contactRepository.create({
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
        linkPrecedence: LinkPrecedence.primary,
      });
      return this.buildResponse([newContact]);
    }

    // ── Step 3: Collect all primary IDs from the matches ──────────────────
    const primaryIds = this.extractPrimaryIds(matchingContacts);

    // ── Step 4: Fetch the FULL cluster for all matching primaries ─────────
    let allClusterContacts = await contactRepository.findAllLinkedContacts(primaryIds);

    // ── Step 5: Handle multiple-primary merge ────────────────────────────
    const distinctPrimaries = this.getPrimaryContacts(allClusterContacts);

    if (distinctPrimaries.length > 1) {
      // Sort by createdAt ascending – oldest is the true primary
      distinctPrimaries.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const truePrimary = distinctPrimaries[0];
      const toBeDowngraded = distinctPrimaries.slice(1);

      logger.info(
        `Multiple primaries found: [${distinctPrimaries.map((c) => c.id)}]. True primary: ${truePrimary.id}`
      );

      // Demote all newer primaries → secondary
      for (const contact of toBeDowngraded) {
        await contactRepository.demotePrimaryToSecondary(contact.id, truePrimary.id);
      }

      // Re-fetch the full cluster after merging
      allClusterContacts = await contactRepository.findAllLinkedContacts([truePrimary.id]);
    }

    // ── Step 6: Check if request contains NEW information ─────────────────
    const truePrimary = this.getPrimaryContacts(allClusterContacts)[0];

    const hasNewInfo = this.containsNewInformation(
      allClusterContacts,
      email ?? null,
      phoneNumber ?? null
    );

    if (hasNewInfo) {
      logger.info(`New information detected, creating secondary contact linked to id=${truePrimary.id}`);
      await contactRepository.create({
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
        linkedId: truePrimary.id,
        linkPrecedence: LinkPrecedence.secondary,
      });

      // Re-fetch again after creating the secondary
      allClusterContacts = await contactRepository.findAllLinkedContacts([truePrimary.id]);
    }

    return this.buildResponse(allClusterContacts);
  }

  // ─── Private Helpers ────────────────────────────────────────────────────

  /**
   * Extract all unique primary IDs from a list of contacts.
   * A contact is either itself a primary, or points to one via linkedId.
   */
  private extractPrimaryIds(contacts: Contact[]): number[] {
    const ids = new Set<number>();
    for (const c of contacts) {
      if (c.linkPrecedence === LinkPrecedence.primary) {
        ids.add(c.id);
      } else if (c.linkedId !== null) {
        ids.add(c.linkedId);
      }
    }
    return Array.from(ids);
  }

  /**
   * Get only primary contacts from a contact list
   */
  private getPrimaryContacts(contacts: Contact[]): Contact[] {
    return contacts.filter((c) => c.linkPrecedence === LinkPrecedence.primary);
  }

  /**
   * Determine if the incoming email/phone brings new data not seen in the cluster
   */
  private containsNewInformation(
    clusterContacts: Contact[],
    email: string | null,
    phoneNumber: string | null
  ): boolean {
    const existingEmails = new Set(
      clusterContacts.map((c) => c.email).filter(Boolean)
    );
    const existingPhones = new Set(
      clusterContacts.map((c) => c.phoneNumber).filter(Boolean)
    );

    const emailIsNew = email !== null && !existingEmails.has(email);
    const phoneIsNew = phoneNumber !== null && !existingPhones.has(phoneNumber);

    // Only create secondary if there's a genuinely new combination
    if (!emailIsNew && !phoneIsNew) return false;

    // Check if this exact combination already exists in the cluster
    const exactMatch = clusterContacts.find(
      (c) => c.email === email && c.phoneNumber === phoneNumber
    );

    return exactMatch === undefined;
  }

  /**
   * Build the final consolidated response from the full contact cluster
   */
  private buildResponse(contacts: Contact[]): IdentifyResponse {
    // Sort contacts: primaries first, then by creation date
    const sorted = [...contacts].sort((a, b) => {
      if (
        a.linkPrecedence === LinkPrecedence.primary &&
        b.linkPrecedence !== LinkPrecedence.primary
      )
        return -1;
      if (
        a.linkPrecedence !== LinkPrecedence.primary &&
        b.linkPrecedence === LinkPrecedence.primary
      )
        return 1;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    const primary = sorted.find((c) => c.linkPrecedence === LinkPrecedence.primary);

    if (!primary) {
      throw new Error('No primary contact found in cluster — data inconsistency');
    }

    // Collect unique emails (primary's email first)
    const emailsSet = new Set<string>();
    if (primary.email) emailsSet.add(primary.email);
    for (const c of sorted) {
      if (c.email) emailsSet.add(c.email);
    }

    // Collect unique phoneNumbers (primary's phone first)
    const phonesSet = new Set<string>();
    if (primary.phoneNumber) phonesSet.add(primary.phoneNumber);
    for (const c of sorted) {
      if (c.phoneNumber) phonesSet.add(c.phoneNumber);
    }

    const secondaryContactIds = sorted
      .filter((c) => c.linkPrecedence === LinkPrecedence.secondary)
      .map((c) => c.id);

  const consolidated: ConsolidatedContact = {
  primaryContatctId: primary.id,
  emails: Array.from(emailsSet),
  phoneNumbers: Array.from(phonesSet),
  secondaryContactIds,
};

    logger.info(`Identity reconciliation complete. Primary id=${primary.id}`);

    return { contact: consolidated };
  }
}

export const contactService = new ContactService();
