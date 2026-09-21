// Mock data for NyayaSaar landing page

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
];

export const howItWorksSteps = [
  {
    number: '01',
    title: 'Upload',
    description: 'Upload your legal document in PDF or text format.',
  },
  {
    number: '02',
    title: 'Understand',
    description: 'AI explains complicated legal language in simple, plain terms.',
  },
  {
    number: '03',
    title: 'Explore',
    description: 'Find important clauses and ask questions about your document.',
  },
  {
    number: '04',
    title: 'Navigate',
    description: 'Get general informational next steps and relevant references.',
  },
];

export const features = [
  {
    icon: 'FileText',
    title: 'AI Document Summary',
    description: 'Get a simple, structured overview of complicated legal documents in seconds.',
  },
  {
    icon: 'AlertTriangle',
    title: 'Important Clauses',
    description: 'Automatically surface clauses that may deserve your closer attention.',
  },
  {
    icon: 'MessageSquare',
    title: 'Ask Your Document',
    description: 'Ask questions in plain language and receive answers grounded in your document.',
  },
  {
    icon: 'GitCompare',
    title: 'Compare Documents',
    description: 'Understand the differences between two legal documents side by side.',
  },
];

export const DEMO_DOCUMENT = {
  documentId: 'sample-doc',
  id: 'sample-doc',
  fileName: 'Rental Agreement (Sample).pdf',
  fileSize: 124500,
  pageCount: 3,
  wordCount: 420,
  charCount: 2600,
  isSample: true,
  text: `RESIDENTIAL RENTAL AGREEMENT
This Rental Agreement is made and entered into on 1st October 2026, by and between the Landlord and the Tenant.
Clause 1: Property - The Landlord agrees to let out the residential apartment located at Flat 402, Green Valley Apartments.
Clause 2: Term of Agreement - The tenancy shall commence on 1st November 2026 and continue for an initial fixed term of eleven (11) months.
Clause 3: Rent - The Tenant agrees to pay monthly rent of INR 25,000 on or before the 5th day of each calendar month.
Clause 4: Security Deposit - The Tenant shall deposit with the Landlord an interest-free refundable security deposit of INR 75,000. Said deposit shall be refunded within thirty (30) days following peaceful handover of possession, subject to deductions for unpaid utilities or property damages beyond normal wear and tear.
Clause 5: Utility Bills - The Tenant shall pay all electricity, water, gas, and internet charges incurred during the tenancy period.
Clause 6: Maintenance Responsibilities - The Tenant shall keep the premises in good and clean condition. Routine minor repairs under INR 1,000 shall be the responsibility of the Tenant, while major structural repairs shall be borne by the Landlord upon written notice.
Clause 7: Restrictions - The Tenant shall not sublet or assign the premises without prior written permission of the Landlord.
Clause 8: Termination Condition - Either party may terminate this agreement by providing thirty (30) days prior written notice to the other party. In the event of default or breach of any terms herein, the non-defaulting party may terminate immediately without prejudice to any other remedies available under law.
Clause 9: Default and Deductions - In the event of default or breach of any covenants, applicable late charges and damages may be assessed against the security deposit.`,
};

export const mockDocument = {
  name: 'Rental Agreement.pdf',
  type: 'Rental Agreement',
  duration: '11 Months',
  deposit: '₹25,000',
  attentionPoints: ['Termination Clause', 'Security Deposit', 'Notice Period'],
  summary:
    'This is a fixed-term rental agreement for residential premises. The agreement includes standard clauses on rent, maintenance, and termination. Three clauses require your attention.',
  clauses: [
    {
      tag: 'Attention',
      title: 'Termination Clause',
      text: 'Either party may terminate this agreement with 30 days written notice. Early termination by tenant forfeits the security deposit.',
    },
    {
      tag: 'Standard',
      title: 'Rent Clause',
      text: 'Monthly rent of ₹15,000 is due on the 5th of each month. A late fee of ₹500 applies after the 10th.',
    },
    {
      tag: 'Attention',
      title: 'Notice Period',
      text: 'A minimum notice period of 30 days is required from both parties before vacating or reclaiming the property.',
    },
  ],
};

// ─── Dashboard mock data ───────────────────────────────────────────────────

export const recentDocuments = [
  {
    id: 'doc-1',
    name: 'Rental Agreement.pdf',
    type: 'Rental Agreement',
    uploadedAt: '18 Sep 2026',
    status: 'analyzed',
    attentionCount: 3,
    pages: 8,
  },
  {
    id: 'doc-2',
    name: 'Employment Contract.pdf',
    type: 'Employment Contract',
    uploadedAt: '15 Sep 2026',
    status: 'analyzed',
    attentionCount: 5,
    pages: 14,
  },
  {
    id: 'doc-3',
    name: 'Service Agreement.pdf',
    type: 'Service Agreement',
    uploadedAt: '10 Sep 2026',
    status: 'analyzed',
    attentionCount: 2,
    pages: 6,
  },
];

export const sidebarNavItems = [
  { label: 'Dashboard',         icon: 'LayoutDashboard', path: '/dashboard' },
  { label: 'My Documents',      icon: 'FolderOpen',      path: '/documents' },
  { label: 'Analyze Document',  icon: 'ScanText',        path: '/upload' },
  { label: 'Compare Documents', icon: 'GitCompare',      path: '/compare' },
  { label: 'Ask NyayaSaar',     icon: 'MessageSquare',   path: '/ask' },
  { label: 'Settings',          icon: 'Settings',        path: '/settings' },
];

export const dashboardActions = [
  {
    icon: 'ScanText',
    title: 'Analyze Document',
    description: 'Upload and understand any legal document.',
    path: '/upload',
    color: 'blue',
  },
  {
    icon: 'GitCompare',
    title: 'Compare Documents',
    description: 'Find differences between two agreements.',
    path: '/compare',
    color: 'violet',
  },
  {
    icon: 'MessageSquare',
    title: 'Ask NyayaSaar',
    description: 'Ask a question about your document.',
    path: '/ask',
    color: 'teal',
  },
];
