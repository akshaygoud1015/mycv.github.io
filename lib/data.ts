/**
 * SINGLE SOURCE OF TRUTH
 * ----------------------
 * Every word of content on the site comes from this file. Nothing here is
 * invented — it is all drawn from the resume, rewritten for the web.
 *
 * TO UPDATE THE SITE: edit this file. No component needs to change.
 */

export const profile = {
  name: 'Akshay Merugu',
  first: 'AKSHAY',
  last: 'MERUGU',
  role: 'Software Engineer',
  // One-line positioning, shown under the hero name.
  tagline: 'Backend systems, authentication, and applied machine learning.',
  // Longer statement, shown in the SIGNAL section.
  statement: [
    'I build the parts of software that have to be correct — authentication flows, service boundaries, relational schemas — and the parts that have to be intelligent: retrieval systems, forecasting pipelines, tooling that turns raw signal into a decision.',
    'Recently that has meant standing up a multi-tenant OIDC authentication layer from scratch, auditing a six-repository marketplace for security gaps that were already in production, and shipping a containerized ML pipeline that forecasts market volatility from price action and public attention.',
  ],
  degree: 'M.S. Computer Science',
  status: 'Full-Stack Developer Intern @ Holiday Channel',
  /** Third chip under the hero tagline. */
  focus: 'Backend · Auth · Applied ML',
} as const;

/** The identity block in SIGNAL. Change `availability` when it stops being true. */
export const identity = {
  degreeLine: 'M.S. Computer Science · UAB',
  focusLine: 'Backend · Authentication · ML',
  availability: 'open to opportunities',
} as const;

/** Closing section copy. */
export const uplink = {
  leadTop: 'Building something that',
  leadBottom: 'has to be',
  leadAccent: 'correct',
  note: 'I am most useful where authentication, data, and machine learning meet production. If that is the problem in front of you, get in touch.',
} as const;

export const footerNote = 'Next.js · WebGL · hand-written GLSL — no templates';

export const contact = {
  email: 'akshaygoud1015@gmail.com',
  phone: '(659) 281-6570',
  phoneHref: 'tel:+16592816570',
  github: 'https://github.com/akshaygoud1015',
  githubHandle: 'github.com/akshaygoud1015',
  linkedin: 'https://www.linkedin.com/in/akshay-merugu-0b9953212/',
  linkedinHandle: 'in/akshay-merugu',
  resume: 'akshay-merugu-resume.pdf',
} as const;

/** Headline metrics. Each one is traceable to a line on the resume. */
export const metrics = [
  { value: '3.9', unit: '/ 4.0', label: 'Graduate GPA', note: 'M.S. Computer Science, UAB' },
  { value: '6', unit: 'repos', label: 'Mapped in a platform audit', note: 'Data flow, auth gaps, dependencies' },
  { value: '2', unit: 'services', label: 'Backend platforms from zero', note: 'NestJS BFF · Flask production platform' },
  { value: '7', unit: 'day', label: 'Volatility forecast horizon', note: 'Crypto risk-regime ML pipeline' },
] as const;

export type Section = {
  id: string;
  index: string;
  code: string;
  human: string;
};

export const sections: Section[] = [
  { id: 'index', index: '00', code: 'INDEX', human: 'Top' },
  { id: 'signal', index: '01', code: 'SIGNAL', human: 'About' },
  { id: 'deploy', index: '02', code: 'DEPLOY', human: 'Experience' },
  { id: 'builds', index: '03', code: 'BUILDS', human: 'Projects' },
  { id: 'stack', index: '04', code: 'STACK', human: 'Skills' },
  { id: 'record', index: '05', code: 'RECORD', human: 'Education' },
  { id: 'uplink', index: '06', code: 'UPLINK', human: 'Contact' },
];

export type Role = {
  org: string;
  title: string;
  kind: string;
  start: string;
  end: string;
  period: string;
  current: boolean;
  summary: string;
  bullets: { head: string; body: string }[];
  stack: string[];
};

export const experience: Role[] = [
  {
    org: 'Holiday Channel',
    title: 'Full-Stack Developer',
    kind: 'Intern',
    start: '2026-07',
    end: 'present',
    period: 'Jul 2026 — Present',
    current: true,
    summary:
      'Authentication and backend foundations for a multi-seller e-commerce marketplace.',
    bullets: [
      {
        head: 'Multi-tenant auth from a single OAuth application',
        body: 'Designed and implemented an authentication system on NestJS and Auth0 Organizations that serves both platform-admin and per-seller login flows from one OAuth application, running the full OIDC authorization-code flow with CSRF-safe state and nonce handling.',
      },
      {
        head: 'Surfaced live security gaps',
        body: 'Identified and flagged unauthenticated production API endpoints and a database credential exposed in a separate repository, then prioritized both for remediation.',
      },
      {
        head: 'Stood up the Backend-for-Frontend layer',
        body: 'Established a new NestJS service from scratch — scaffolding, dependencies, environment configuration — creating the foundation for the company’s BFF layer.',
      },
      {
        head: 'Mapped six repositories into one picture',
        body: 'Audited an e-commerce marketplace spanning a Next.js storefront, a Next.js API backend, a seller dashboard, and Supabase/Postgres migrations to document data flow, authentication gaps, and cross-service dependencies.',
      },
    ],
    stack: ['NestJS', 'Auth0', 'OIDC', 'OAuth 2.0', 'Next.js', 'Supabase', 'PostgreSQL', 'TypeScript'],
  },
  {
    org: 'Suraksha Child Development Center',
    title: 'Full-Stack Developer',
    kind: 'Freelance',
    start: '2024-01',
    end: '2025-01',
    period: 'Jan 2024 — Jan 2025',
    current: false,
    summary: 'A production platform owned end to end — schema, APIs, and shipped features.',
    bullets: [
      {
        head: 'Owned the platform end to end',
        body: 'Architected, deployed, and maintained a production web platform in Python with Flask, MySQL, and JavaScript — including the relational schema and the backend APIs behind user management and daily operational workflows.',
      },
      {
        head: 'Authentication built to hold',
        body: 'Designed secure authentication and role-based access workflows using bcrypt password hashing, session management, and administrator controls.',
      },
      {
        head: 'Scheduling that runs itself',
        body: 'Built appointment scheduling and service management modules with automated email notifications and booking confirmations, working directly with stakeholders to turn requirements into shipped features.',
      },
    ],
    stack: ['Python', 'Flask', 'MySQL', 'JavaScript', 'bcrypt', 'RBAC', 'SMTP'],
  },
];

export type Project = {
  id: string;
  index: string;
  name: string;
  date: string;
  kicker: string;
  tagline: string;
  body: string;
  pipeline: { step: string; detail: string }[];
  stack: string[];
  /**
   * TODO(akshay): if these projects have public repositories, replace `null`
   * with the URL, e.g. 'https://github.com/akshaygoud1015/doctalk'.
   * While null, the card links to the GitHub profile instead.
   */
  repo: string | null;
};

export const projects: Project[] = [
  {
    id: 'volatility',
    index: '01',
    name: 'Attention-Driven Crypto Volatility Forecasting',
    date: 'March 2026',
    kicker: 'Machine Learning · Time Series',
    tagline: 'Forecasting where risk goes next — from what the market does, and what the public looks up.',
    body: 'An end-to-end Python machine learning pipeline that forecasts 7-day cryptocurrency volatility and classifies market risk regimes by fusing price action with public-attention signals. Predictive features are engineered from Yahoo Finance market data and the Wikipedia Pageviews API — rolling volatility, trend indicators, attention metrics — then containerized with Docker and served through an interactive Streamlit interface for real-time analysis and model output visualization.',
    pipeline: [
      { step: 'INGEST', detail: 'Yahoo Finance · Wikipedia Pageviews API' },
      { step: 'ENGINEER', detail: 'Rolling volatility · trend · attention' },
      { step: 'TRAIN', detail: '7-day volatility forecast' },
      { step: 'CLASSIFY', detail: 'Market risk regimes' },
      { step: 'SERVE', detail: 'Docker · Streamlit' },
    ],
    stack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Docker', 'Streamlit'],
    repo: null,
  },
  {
    id: 'doctalk',
    index: '02',
    name: 'DocTalk',
    date: 'January 2026',
    kicker: 'RAG · Local Inference',
    tagline: 'Ask a PDF a question. Get an answer that never leaves the machine.',
    body: 'A retrieval-augmented generation system that turns PDF documents into a conversation. Ingestion and chunking pipelines feed a semantic vector index built on ChromaDB with Gemini embeddings, while Ollama-hosted LLaMA 3.2 models handle inference entirely locally — privacy-preserving by construction. Retrieval quality is tuned through semantic search and context-aware prompting.',
    pipeline: [
      { step: 'INGEST', detail: 'PDF document loader' },
      { step: 'CHUNK', detail: 'Semantic segmentation' },
      { step: 'EMBED', detail: 'Gemini embeddings → ChromaDB' },
      { step: 'RETRIEVE', detail: 'Semantic search · context-aware prompting' },
      { step: 'GENERATE', detail: 'Ollama · LLaMA 3.2, fully local' },
    ],
    stack: ['Python', 'RAG', 'ChromaDB', 'Gemini API', 'Ollama', 'LLaMA 3.2'],
    repo: null,
  },
];

export type SkillGroup = {
  code: string;
  label: string;
  items: string[];
  /** Marks the domains that define the practice, highlighted in the UI. */
  core?: boolean;
};

export const skills: SkillGroup[] = [
  {
    code: 'LANG',
    label: 'Languages',
    core: true,
    items: ['Python', 'Java', 'C++', 'C#', 'JavaScript', 'TypeScript', 'Kotlin', 'SQL', 'HTML5', 'CSS3'],
  },
  {
    code: 'SRV',
    label: 'Backend & Web',
    core: true,
    items: ['NestJS', 'Node.js', 'Next.js', 'Flask', 'FastAPI', 'Django', 'REST APIs', 'Vue.js', 'Streamlit'],
  },
  {
    code: 'SEC',
    label: 'Auth & Security',
    core: true,
    items: ['Auth0', 'OAuth 2.0 / OIDC', 'Role-based access control', 'Session management', 'bcrypt', 'CSRF protection'],
  },
  {
    code: 'ML',
    label: 'AI & Machine Learning',
    core: true,
    items: [
      'Scikit-learn', 'Pandas', 'NumPy', 'LLMs', 'RAG', 'ChromaDB', 'Gemini API', 'Ollama',
      'LLaMA', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Reinforcement Learning', 'Generative AI', 'MLOps',
    ],
  },
  {
    code: 'DATA',
    label: 'Databases',
    items: ['PostgreSQL', 'Supabase', 'MySQL', 'MongoDB', 'Redis', 'Amazon DynamoDB', 'Amazon RDS'],
  },
  {
    code: 'OPS',
    label: 'Cloud & DevOps',
    items: ['Docker', 'Git', 'GitHub', 'CI/CD', 'Linux', 'Unix Shell', 'Windows', 'Azure', 'Kafka', 'Power BI'],
  },
];

export type Education = {
  school: string;
  degree: string;
  field: string;
  period: string;
  gpa: string;
  coursework?: string[];
  url?: string;
};

export const education: Education[] = [
  {
    school: 'University of Alabama at Birmingham',
    degree: 'Master of Science',
    field: 'Computer Science',
    period: 'Aug 2024 — May 2026',
    gpa: '3.9 / 4.0',
    coursework: [
      'Machine Learning',
      'Advanced Algorithms',
      'Software Engineering',
      'Data Mining',
      'Database Systems',
    ],
    url: 'https://www.uab.edu/',
  },
  {
    school: 'CMR Institute of Technology',
    degree: 'Bachelor of Technology',
    field: 'Computer Science',
    period: 'Aug 2020 — Jun 2024',
    gpa: '3.3 / 4.0',
    url: 'https://cmritonline.ac.in/',
  },
];

export type Certification = {
  name: string;
  issuer: string;
  url: string;
};

export const certifications: Certification[] = [
  {
    name: 'Software Engineering Virtual Experience',
    issuer: 'J.P. Morgan Chase & Co.',
    url: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/J.P.%20Morgan/R5iK7HMxJGBgaSbvk_J.P.%20Morgan_tPkSbD355FRgzLDXp_1662643877901_completion_certificate.pdf',
  },
  {
    name: 'Developer Programme',
    issuer: 'Accenture Nordics',
    url: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Accenture%20Nordics/PxenP4rHNE6Bh4nQz_Accenture%20Nordics_tPkSbD355FRgzLDXp_1659630258973_completion_certificate.pdf',
  },
  {
    name: 'Cloud Computing using AWS',
    issuer: 'Udemy',
    url: 'https://www.udemy.com/certificate/UC-e6e9f760-fc43-4617-9422-6a29a5e8f434/',
  },
  {
    name: 'Programming Using Python — Elite',
    issuer: 'NPTEL',
    url: 'https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL22CS31S2353408202034101',
  },
];

/** Lines printed by the boot sequence, in order. */
export const bootLines = [
  { text: 'initializing runtime', tag: 'sys' },
  { text: 'mounting identity matrix', tag: 'sys' },
  { text: 'akshay.merugu — software engineer', tag: 'ok' },
  { text: 'linking experience :: 2 records', tag: 'sys' },
  { text: 'linking builds :: 2 records', tag: 'sys' },
  { text: 'neural field online', tag: 'ok' },
] as const;
