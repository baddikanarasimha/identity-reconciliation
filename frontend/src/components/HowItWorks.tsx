export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Input Contact',
      description: 'Provide an email address, phone number, or both.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      number: '02',
      title: 'Find Matches',
      description: 'System searches for existing contacts with matching email or phone.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      number: '03',
      title: 'Reconcile',
      description: 'Oldest contact becomes primary. Others are linked as secondary.',
      color: 'from-pink-500 to-purple-500',
    },
    {
      number: '04',
      title: 'Respond',
      description: 'Returns unified profile with all emails, phones, and linked IDs.',
      color: 'from-rose-500 to-pink-500',
    },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
        How It Works
      </h3>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start gap-3">
            <div
              className={`w-7 h-7 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 mt-0.5`}
            >
              <span className="text-white text-[10px] font-bold">{step.number}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">{step.title}</p>
              <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
