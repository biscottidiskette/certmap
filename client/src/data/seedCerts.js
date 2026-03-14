// seedCerts.js
// Static seed data for the initial cert library.
// When a user fetches a new exam via the Fetch Exam feature,
// the returned object must match this schema exactly.
//
// Schema reference:
// id            — unique slug, kebab-case
// name          — short display name
// fullName      — full official certification name
// vendor        — issuing organisation
// track         — one of: red | blue | grc | management | cloud
// price         — USD, exam fee only (not course/training cost)
// examType      — hands-on | mcq | hybrid
// studyWeeks    — estimated weeks to prepare from zero baseline
// market        — 0-100 market recognition score
// difficulty    — 1-5 (1 = entry, 5 = expert)
// expires       — boolean, does the cert require renewal
// renewYears    — null if expires false, otherwise number of years
// roles         — array of job titles this cert supports
// track         — career track
// tags          — array of freeform descriptors for grading context
// description   — one or two sentence summary for grading prompt context

// SANS/GIAC price includes the mandatory training course + exam attempt
// Exam-only renewal attempts are significantly cheaper (~$979)

export const seedCerts = [
  {
    id: "comptia-sec-plus",
    name: "Security+",
    fullName: "CompTIA Security+",
    vendor: "CompTIA",
    track: "blue",
    price: 404,
    examType: "mcq",
    ecosystemLocked: false,
    studyWeeks: 8,
    market: 88,
    difficulty: 2,
    expires: true,
    renewYears: 3,
    roles: [
      "Security Analyst",
      "SOC Analyst Tier 1",
      "IT Security Specialist",
      "Systems Administrator"
    ],
    tags: ["blue", "entry-level", "mcq", "vendor-neutral", "baseline"],
    description: "Industry baseline certification. Widely required as a minimum bar by employers and government/DoD roles. MCQ only, no hands-on component."
  },
  {
    id: "comptia-cysa-plus",
    name: "CySA+",
    fullName: "CompTIA CySA+",
    vendor: "CompTIA",
    track: "blue",
    price: 404,
    examType: "mcq",
    ecosystemLocked: false,
    studyWeeks: 10,
    market: 72,
    difficulty: 3,
    expires: true,
    renewYears: 3,
    roles: [
      "SOC Analyst Tier 2",
      "Threat Intelligence Analyst",
      "Security Operations Analyst"
    ],
    tags: ["blue", "mid-level", "mcq", "threat-hunting", "defensive"],
    description: "Intermediate defensive security cert focused on threat detection and response. Sits naturally above Security+ in the blue team progression."
  },
  {
    id: "comptia-casp-plus",
    name: "CASP+",
    fullName: "CompTIA Advanced Security Practitioner",
    vendor: "CompTIA",
    track: "blue",
    price: 509,
    examType: "hybrid",
    ecosystemLocked: false,
    studyWeeks: 16,
    market: 65,
    difficulty: 4,
    expires: true,
    renewYears: 3,
    roles: [
      "Senior Security Engineer",
      "Security Architect",
      "Lead Security Analyst"
    ],
    tags: ["blue", "senior", "hybrid", "architecture", "enterprise"],
    description: "Advanced practitioner level cert targeting security architecture and enterprise risk. Less recognised than CISSP at senior level but more technical."
  },
  {
    id: "htb-cpts",
    name: "HTB CPTS",
    fullName: "HackTheBox Certified Penetration Testing Specialist",
    vendor: "HackTheBox",
    track: "red",
    price: 210,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 12,
    market: 72,
    difficulty: 4,
    expires: false,
    renewYears: null,
    roles: [
      "Penetration Tester",
      "Red Team Analyst",
      "Vulnerability Analyst"
    ],
    tags: ["red", "hands-on", "offensive", "mid-level", "practical"],
    description: "Highly regarded hands-on penetration testing cert from HackTheBox. Gaining strong traction in red team hiring. Practical exam format, no MCQ."
  },
  {
    id: "htb-cdsa",
    name: "HTB CDSA",
    fullName: "HackTheBox Certified Defensive Security Analyst",
    vendor: "HackTheBox",
    track: "blue",
    price: 210,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 10,
    market: 65,
    difficulty: 3,
    expires: false,
    renewYears: null,
    roles: [
      "SOC Analyst",
      "Threat Hunter",
      "Incident Responder"
    ],
    tags: ["blue", "hands-on", "defensive", "mid-level", "practical"],
    description: "Hands-on defensive security cert from HackTheBox. Practical exam covering SOC workflows, threat hunting, and incident response."
  },
  {
    id: "offsec-oscp",
    name: "OSCP",
    fullName: "Offensive Security Certified Professional",
    vendor: "OffSec",
    track: "red",
    price: 1499,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 16,
    market: 95,
    difficulty: 4,
    expires: false,
    renewYears: null,
    roles: [
      "Penetration Tester",
      "Red Team Operator",
      "Offensive Security Engineer"
    ],
    tags: ["red", "hands-on", "offensive", "industry-standard", "practical"],
    description: "The gold standard penetration testing certification. Consistently the most requested cert in red team job postings. Demanding 24-hour practical exam."
  },
  {
    id: "offsec-osda",
    name: "OSDA",
    fullName: "Offensive Security Defense Analyst",
    vendor: "OffSec",
    track: "blue",
    price: 1299,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 12,
    market: 60,
    difficulty: 3,
    expires: false,
    renewYears: null,
    roles: [
      "SOC Analyst",
      "Detection Engineer",
      "Threat Analyst"
    ],
    tags: ["blue", "hands-on", "defensive", "detection", "practical"],
    description: "OffSec's defensive counterpart to OSCP. Focuses on detection and analysis from an adversary-aware perspective. Less market recognition than OSCP but respected."
  },
  {
    id: "isc2-cissp",
    name: "CISSP",
    fullName: "Certified Information Systems Security Professional",
    vendor: "ISC2",
    track: "management",
    price: 749,
    examType: "mcq",
    ecosystemLocked: false,
    studyWeeks: 20,
    market: 96,
    difficulty: 5,
    expires: true,
    renewYears: 3,
    roles: [
      "CISO",
      "Security Manager",
      "Security Director",
      "Senior Security Architect"
    ],
    tags: ["management", "senior", "mcq", "enterprise", "leadership"],
    description: "The most recognised management-level security certification globally. Requires 5 years experience to certify. Strong signal for senior and leadership roles."
  },
  {
    id: "isaca-cism",
    name: "CISM",
    fullName: "Certified Information Security Manager",
    vendor: "ISACA",
    track: "management",
    price: 760,
    examType: "mcq",
    ecosystemLocked: false,
    studyWeeks: 16,
    market: 85,
    difficulty: 4,
    expires: true,
    renewYears: 3,
    roles: [
      "Security Manager",
      "IT Risk Manager",
      "Security Programme Manager"
    ],
    tags: ["management", "mid-senior", "mcq", "risk", "governance"],
    description: "Management-focused cert from ISACA targeting security programme management and governance. Frequently paired with or compared against CISSP."
  },
  {
    id: "sans-gcih",
    name: "GCIH",
    fullName: "GIAC Certified Incident Handler",
    vendor: "SANS/GIAC",
    track: "blue",
    price: 8750,
    examType: "mcq",
    ecosystemLocked: true,
    studyWeeks: 14,
    market: 80,
    difficulty: 3,
    expires: true,
    renewYears: 4,
    roles: [
      "Incident Responder",
      "SOC Analyst Tier 2",
      "Threat Hunter",
      "DFIR Analyst"
    ],
    tags: ["blue", "incident-response", "mcq", "dfir", "mid-level"],
    description: "Well recognised GIAC cert covering incident handling and response. SANS-backed credibility. Price includes mandatory proprietary training — exam is written against SANS course material exclusively."
  },
  {
    id: "sans-gcfa",
    name: "GCFA",
    fullName: "GIAC Certified Forensic Analyst",
    vendor: "SANS/GIAC",
    track: "blue",
    price: 8750,
    examType: "mcq",
    ecosystemLocked: true,
    studyWeeks: 14,
    market: 78,
    difficulty: 4,
    expires: true,
    renewYears: 4,
    roles: [
      "Digital Forensics Analyst",
      "DFIR Analyst",
      "Threat Hunter",
      "Incident Responder"
    ],
    tags: ["blue", "forensics", "mcq", "dfir", "mid-senior"],
    description: "GIAC forensics cert covering advanced incident response and digital forensics. Strong market signal in DFIR-focused roles. Price includes mandatory proprietary training — exam is written against SANS course material exclusively."
  },
  {
    id: "sans-grem",
    name: "GREM",
    fullName: "GIAC Reverse Engineering Malware",
    vendor: "SANS/GIAC",
    track: "red",
    price: 8750,
    examType: "mcq",
    ecosystemLocked: true,
    studyWeeks: 16,
    market: 82,
    difficulty: 5,
    expires: true,
    renewYears: 4,
    roles: [
      "Malware Analyst",
      "Reverse Engineer",
      "Threat Intelligence Analyst",
      "DFIR Analyst"
    ],
    tags: ["red", "malware", "reverse-engineering", "mcq", "expert"],
    description: "Elite GIAC cert in malware reverse engineering. One of the most respected technical certs in the industry. Price includes mandatory proprietary training — exam is written against SANS course material exclusively."
  },
  {
    id: "tcm-pmrp",
    name: "TCM PMRP",
    fullName: "TCM Security Practical Malware Research Professional",
    vendor: "TCM Security",
    track: "red",
    price: 499,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 10,
    market: 58,
    difficulty: 4,
    expires: false,
    renewYears: null,
    roles: [
      "Malware Analyst",
      "Reverse Engineer",
      "Threat Researcher",
      "SOC Analyst Tier 3"
    ],
    tags: ["red", "malware", "reverse-engineering", "hands-on", "practical"],
    description: "Practical malware analysis cert from TCM Security. Hands-on exam format. Growing market recognition, strong value proposition relative to GREM at a fraction of the cost."
  },
  {
    id: "offsec-osed",
    name: "OSED",
    fullName: "Offensive Security Exploit Developer",
    vendor: "OffSec",
    track: "red",
    price: 1499,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 20,
    market: 82,
    difficulty: 5,
    expires: false,
    renewYears: null,
    roles: [
      "Exploit Developer",
      "Vulnerability Researcher",
      "Red Team Operator",
      "Malware Developer"
    ],
    tags: ["red", "hands-on", "offensive", "exploit-dev", "expert"],
    description: "OffSec's exploit development certification covering Windows userland exploits, SEH overflows, and custom shellcode. One of the most technically demanding certs in the industry."
  },
  {
    id: "offsec-osep",
    name: "OSEP",
    fullName: "Offensive Security Experienced Penetration Tester",
    vendor: "OffSec",
    track: "red",
    price: 1499,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 20,
    market: 80,
    difficulty: 5,
    expires: false,
    renewYears: null,
    roles: [
      "Senior Penetration Tester",
      "Red Team Operator",
      "Adversary Simulation Specialist"
    ],
    tags: ["red", "hands-on", "offensive", "evasion", "expert"],
    description: "Advanced OffSec cert focused on antivirus evasion, lateral movement, and complex attack chains. Natural progression after OSCP for red teamers targeting enterprise environments."
  },
  {
    id: "offsec-oswe",
    name: "OSWE",
    fullName: "Offensive Security Web Expert",
    vendor: "OffSec",
    track: "red",
    price: 1499,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 18,
    market: 78,
    difficulty: 5,
    expires: false,
    renewYears: null,
    roles: [
      "Web Application Penetration Tester",
      "Application Security Engineer",
      "Red Team Operator"
    ],
    tags: ["red", "hands-on", "offensive", "web", "expert"],
    description: "OffSec's advanced web application exploitation cert. Focuses on whitebox testing, source code review, and chaining vulnerabilities. Highly respected in appsec circles."
  },
  {
    id: "offsec-osee",
    name: "OSEE",
    fullName: "Offensive Security Exploitation Expert",
    vendor: "OffSec",
    track: "red",
    price: 5195,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 24,
    market: 78,
    difficulty: 5,
    expires: false,
    renewYears: null,
    roles: [
      "Exploit Developer",
      "Vulnerability Researcher",
      "Advanced Red Team Operator"
    ],
    tags: ["red", "hands-on", "offensive", "exploit-dev", "expert", "rare"],
    description: "The most advanced OffSec certification. Only available via in-person training at Black Hat. Covers kernel exploitation, heap exploitation, and browser exploits. Extremely rare."
  },
  {
    id: "zero-point-crto",
    name: "CRTO",
    fullName: "Certified Red Team Operator",
    vendor: "Zero Point Security",
    track: "red",
    price: 399,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 10,
    market: 74,
    difficulty: 3,
    expires: false,
    renewYears: null,
    roles: [
      "Red Team Operator",
      "Penetration Tester",
      "Adversary Simulation Analyst"
    ],
    tags: ["red", "hands-on", "offensive", "cobalt-strike", "mid-level"],
    description: "Highly practical red team cert from Zero Point Security using Cobalt Strike in a fully simulated enterprise environment. Excellent value and growing fast in red team hiring circles."
  },
  {
    id: "microsoft-az500",
    name: "AZ-500",
    fullName: "Microsoft Azure Security Technologies",
    vendor: "Microsoft",
    track: "cloud",
    price: 165,
    examType: "mcq",
    ecosystemLocked: false,
    studyWeeks: 10,
    market: 78,
    difficulty: 3,
    expires: true,
    renewYears: 1,
    roles: [
      "Cloud Security Engineer",
      "Azure Security Administrator",
      "Security Operations Analyst"
    ],
    tags: ["cloud", "mcq", "azure", "microsoft", "mid-level"],
    description: "Microsoft's security certification for Azure environments. Strong market demand driven by Azure's enterprise adoption. Annual renewal required via free online assessment."
  },
  {
    id: "aws-security-specialty",
    name: "AWS Security",
    fullName: "AWS Certified Security Specialty",
    vendor: "Amazon Web Services",
    track: "cloud",
    price: 300,
    examType: "mcq",
    ecosystemLocked: false,
    studyWeeks: 12,
    market: 82,
    difficulty: 4,
    expires: true,
    renewYears: 3,
    roles: [
      "Cloud Security Engineer",
      "AWS Security Architect",
      "Security Operations Engineer"
    ],
    tags: ["cloud", "mcq", "aws", "amazon", "mid-senior"],
    description: "AWS's specialist security certification. High market demand given AWS dominance in enterprise cloud. Covers IAM, encryption, logging, and incident response in AWS environments."
  },
  {
    id: "sektor7-ired",
    name: "Sektor7 RTO",
    fullName: "Sektor7 Malware Development Essentials / Intermediate",
    vendor: "Sektor7",
    track: "red",
    price: 500,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 6,
    market: 55,
    difficulty: 4,
    expires: false,
    renewYears: null,
    roles: [
      "Malware Developer",
      "Red Team Operator",
      "Exploit Developer"
    ],
    tags: ["red", "hands-on", "malware", "evasion", "course-cert"],
    description: "Sektor7 issues certificates of completion rather than proctored exams. Highly respected in red team and malware dev communities for technical depth. Not a traditional certification — will not appear as a job posting requirement but signals serious offensive capability."
  },
  {
    id: "maldev-academy",
    name: "MalDev Academy",
    fullName: "Malware Development Academy Certificate",
    vendor: "MalDev Academy",
    track: "red",
    price: 350,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 8,
    market: 52,
    difficulty: 4,
    expires: false,
    renewYears: null,
    roles: [
      "Malware Developer",
      "Red Team Operator",
      "Threat Researcher"
    ],
    tags: ["red", "hands-on", "malware", "evasion", "course-cert"],
    description: "MalDev Academy issues certificates of completion for its malware development curriculum. Growing community recognition in offensive security circles. Not a traditional proctored certification — signals advanced malware development capability rather than a formal credential."
  } ,
  {
    id: "tcm-papa",
    name: "TCM PAPA",
    fullName: "TCM Security Practical AI Pentesting Associate",
    vendor: "TCM Security",
    track: "red",
    price: 249,
    examType: "hands-on",
    ecosystemLocked: false,
    studyWeeks: 6,
    market: 45,
    difficulty: 3,
    expires: false,
    renewYears: null,
    roles: [
      "AI Security Researcher",
      "Penetration Tester",
      "Red Team Analyst"
    ],
    tags: ["red", "hands-on", "ai-security", "offensive", "entry-mid"],
    description: "TCM Security's practical AI pentesting certification. Covers offensive security techniques targeting AI and LLM-based systems. Newer cert in a rapidly growing niche with increasing market relevance."
  }
]