/* ==========================================================================
   Site content. Every project, client site and role on bywadoo.life is
   rendered from this file, so this is the only place to edit.

   - featured: true      → shows on the home page under "Selected projects"
   - repo                → GitHub repo name; the site pulls its language,
                           stars and last update live from the GitHub API
   - tint                → card colour: blue | purple | pink | orange |
                           green | teal | indigo | yellow
   ========================================================================== */

window.SITE = {
  github: 'huzaib123',
  email: 'huzaibqayoom@gmail.com',

  projects: [
    {
      id: 'avt',
      name: 'Asset & Vulnerability Tracker',
      tagline: 'Track every asset and vulnerability until it is fixed.',
      summary: 'A security team lists its websites and servers, logs the vulnerabilities found on each, and tracks every one until it is fixed.',
      category: 'mern',
      tint: 'blue',
      featured: true,
      image: 'img/avt-dashboard.webp',
      imageAlt: 'Asset & Vulnerability Tracker dashboard showing open vulnerabilities by severity and status',
      repo: 'Asset-Vulnerability-Tracker',
      stack: ['React', 'Redux Toolkit', 'Express', 'MongoDB', 'Redis', 'Docker'],
      points: [
        'JWT sign-in with Admin and Analyst roles, enforced on the server',
        'Dashboard aggregation cached in Redis and cleared on every write',
        'Filters, search and pagination live in the URL; RTK Query refetches on change',
        'bcrypt, pinned JWT algorithm, NoSQL-injection filter, per-IP rate limits, strict CSP'
      ],
      stats: [['4', 'Docker services'], ['44', 'tests in CI'], ['16', 'API routes']],
      links: { code: 'https://github.com/huzaib123/Asset-Vulnerability-Tracker' }
    },
    {
      id: 'shs',
      name: 'Website Security Header Scanner',
      tagline: 'Grade any website’s security headers from A to F.',
      summary: 'Enter an address and a background worker checks its HTTPS setup and seven security headers, then grades it A to F with a one-line fix for each problem.',
      category: 'mern',
      tint: 'pink',
      featured: true,
      image: 'img/shs-result.webp',
      imageAlt: 'Security Header Scanner result page showing a grade C with failing and passing checks',
      repo: 'Security-Header-Scanner',
      stack: ['React', 'Express', 'BullMQ', 'Redis', 'MongoDB', 'Docker'],
      points: [
        'API answers 202 Accepted; a BullMQ worker in its own container does the fetching',
        'Redis result cache, in-flight lock and per-IP rate limit across containers',
        'SSRF guard inside the DNS lookup checks every redirect hop and blocks rebinding'
      ],
      stats: [['5', 'Docker services'], ['49', 'tests in CI'], ['8', 'checks per scan']],
      links: { code: 'https://github.com/huzaib123/Security-Header-Scanner' }
    },
    {
      id: 'receptionist',
      name: 'AI Receptionist',
      tagline: 'Voice and text assistant that routes 10+ customer intents.',
      summary: 'A voice and text assistant for businesses that understands what a customer wants and routes 10+ intents, built on LLM and speech APIs.',
      category: 'ai',
      tint: 'purple',
      featured: true,
      repo: 'AI-receptionist',
      stack: ['Python', 'LLM APIs', 'Speech APIs'],
      links: { demo: 'https://huzaib123.github.io/AI-receptionist/', code: 'https://github.com/huzaib123/AI-receptionist' }
    },
    {
      id: 'heart',
      name: 'Heart Disease Predictor',
      tagline: 'ML model served by a REST API with a web front end.',
      summary: 'A machine learning model that estimates heart disease risk, served by a REST API and used through a web front end.',
      category: 'ai',
      tint: 'orange',
      featured: true,
      repo: 'heart-disease-predictor',
      stack: ['Python', 'scikit-learn', 'REST API', 'JavaScript'],
      links: { live: 'https://heart-disease-predictor-1nir.onrender.com', code: 'https://github.com/huzaib123/heart-disease-predictor' }
    },
    {
      id: 'finance',
      name: 'Personal Finance Anomaly Monitor',
      tagline: 'Flags suspicious spending with an Isolation Forest.',
      summary: 'Flags unusual transactions in personal spending using an Isolation Forest model, with 85%+ accuracy.',
      category: 'ai',
      tint: 'green',
      repo: 'personal-finance-anomaly-monitor',
      stack: ['Python', 'scikit-learn'],
      links: { live: 'https://huzaib123.github.io/personal-finance-anomaly-monitor/', code: 'https://github.com/huzaib123/personal-finance-anomaly-monitor' }
    },
    {
      id: 'crop',
      name: 'Crop Yield Predictor',
      tagline: 'Yield model for 5+ crop types.',
      summary: 'A regression model that predicts yield for 5+ crop types from growing conditions.',
      category: 'ai',
      tint: 'teal',
      repo: 'Crop-Yield-Predictor-',
      stack: ['Python', 'scikit-learn'],
      links: { code: 'https://github.com/huzaib123/Crop-Yield-Predictor-' }
    },
    {
      id: 'gpa',
      name: 'GPA Calculator',
      tagline: 'Interactive tool for students.',
      summary: 'A quick, interactive GPA calculator for students.',
      category: 'web',
      tint: 'indigo',
      repo: 'gpa-calculator',
      stack: ['HTML', 'CSS', 'JavaScript'],
      links: { live: 'https://huzaib123.github.io/gpa-calculator/', code: 'https://github.com/huzaib123/gpa-calculator' }
    }
  ],

  categories: [
    { id: 'all', label: 'All' },
    { id: 'mern', label: 'MERN' },
    { id: 'ai', label: 'AI & ML' },
    { id: 'web', label: 'Web tools' }
  ],

  freelance: [
    {
      id: 'pyramid',
      name: 'Pyramid Golds',
      kind: 'E-commerce',
      summary: 'An e-commerce jewellery website for a real client, live and taking visitors today.',
      tint: 'yellow',
      repo: 'pyramidgolds',
      stack: ['HTML', 'CSS', 'JavaScript'],
      links: { live: 'https://pyramidgolds.in', code: 'https://github.com/huzaib123/pyramidgolds' }
    },
    {
      id: 'aksa',
      name: 'Aksa Resorts',
      kind: 'Hospitality',
      summary: 'A responsive website for a resort, built to look good and load fast on any phone.',
      tint: 'teal',
      repo: 'aksa-resorts',
      stack: ['HTML', 'CSS', 'JavaScript'],
      links: { live: 'https://huzaib123.github.io/aksa-resorts/' }
    },
    {
      id: 'firdoos',
      name: 'Firdoos',
      kind: 'Brand site',
      summary: 'A mobile-first brand website, designed for the phone first and scaled up from there.',
      tint: 'pink',
      repo: 'firdoos',
      stack: ['HTML', 'CSS'],
      links: { live: 'https://huzaib123.github.io/firdoos/' }
    }
  ],

  experience: [
    {
      when: 'Sept 2026 – now',
      role: 'AI/ML Intern',
      org: 'Emly Labs (SimplyPhi Software Solutions)',
      text: 'Working on an AI-driven bus management system for Kashmir.',
      current: true
    },
    {
      when: 'Ongoing',
      role: 'Freelance Web Developer',
      org: 'Client projects',
      text: 'Built and shipped live websites for Pyramid Golds, Aksa Resorts and Firdoos.',
      link: { href: 'freelance.html', label: 'See client work' }
    },
    {
      when: 'Oct 2023 – now',
      role: 'Senior Research Member & AI Contributor',
      org: 'Young Kashmir Research Society',
      text: 'Python data pipelines that cut reporting time by about 20%.'
    },
    {
      when: 'Graduating Jan 2027',
      role: 'Dual BSc (Hons) Computer Science, AI',
      org: 'Taylor’s University × UWE Bristol',
      text: 'Dean’s List 2025.'
    },
    {
      when: 'Certified',
      role: 'AWS Certified Cloud Practitioner',
      org: 'Amazon Web Services',
      text: 'Also: Generative AI with Google Gemini · Oracle Java Programming.'
    }
  ],

  stack: ['React', 'Redux Toolkit', 'RTK Query', 'Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'Mongoose', 'Redis', 'BullMQ', 'JWT', 'Docker', 'Docker Compose', 'nginx', 'GitHub Actions', 'AWS', 'Python', 'scikit-learn', 'FastAPI', 'Vitest']
};
