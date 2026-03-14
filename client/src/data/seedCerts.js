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
    price: 979,
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
    description: "Well recognised GIAC cert covering incident handling and response. SANS-backed credibility. High cost relative to alternatives is a notable ROI consideration."
  },
  {
    id: "sans-gcfa",
    name: "GCFA",
    fullName: "GIAC Certified Forensic Analyst",
    vendor: "SANS/GIAC",
    track: "blue",
    price: 979,
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
    description: "GIAC forensics cert covering advanced incident response and digital forensics. Strong market signal in DFIR-focused roles. SANS pricing is a significant cost factor."
  },
  {
    id: "sans-grem",
    name: "GREM",
    fullName: "GIAC Reverse Engineering Malware",
    vendor: "SANS/GIAC",
    track: "red",
    price: 979,
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
    description: "Elite GIAC cert in malware reverse engineering. One of the most respected technical certs in the industry for malware and threat research roles."
  },
  {
    id: "tcm-pmrp",
    name: "TCM PMRP",
    fullName: "TCM Security Practical Malware Research Professional",
    vendor: "TCM Security",
    track: "red",
    price: 300,
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
  }
]