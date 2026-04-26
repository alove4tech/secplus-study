// ────────────────────────────────────────────────────────────────
//  STATE & STORAGE
// ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "secplus-study-progress-v3";

function defaultState() {
  return {
    quizResults: [],        // { id, correct, ts } per question answered
    quizSessions: [],       // { date, total, correct, duration } per reset/session
    flashcardConfidence: {},// { [cardIndex]: { confidence: 0-3, lastReviewed } }
    labScores: [],          // { ts, score, total }
    pbqScores: [],          // { ts, score, total }
    studyPlanDone: {},      // { [itemIndex]: true }
    streakDays: [],         // ISO date strings where flashcards were reviewed
    notes: [
      "Contain first, then eradicate and recover. Preserve evidence before destructive actions.",
      "RPO is acceptable data loss measured in time. RTO is acceptable restoration time.",
      "RBAC maps permissions to job roles. ABAC evaluates attributes like user, device, action, and location.",
      "Tokenization replaces sensitive data with lookup tokens. Masking hides part of the value for display.",
      "ALE = SLE x ARO. SLE includes asset value and exposure factor.",
    ],
  };
}

let state;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const base = defaultState();
      state = { ...base, ...parsed };
      // Ensure arrays
      state.quizResults = Array.isArray(state.quizResults) ? state.quizResults : [];
      state.quizSessions = Array.isArray(state.quizSessions) ? state.quizSessions : [];
      state.labScores = Array.isArray(state.labScores) ? state.labScores : [];
      state.pbqScores = Array.isArray(state.pbqScores) ? state.pbqScores : [];
      state.streakDays = Array.isArray(state.streakDays) ? state.streakDays : [];
    } else {
      state = defaultState();
    }
  } catch {
    state = defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded – silently fail */ }
}

// ────────────────────────────────────────────────────────────────
//  QUESTION DATA
// ────────────────────────────────────────────────────────────────

const domainMap = [
  { id: 1, name: "General Security Concepts", short: "General", objectives: ["1.1","1.2","1.3","1.4"], weight: 12 },
  { id: 2, name: "Threats, Attacks, and Vulnerabilities", short: "Threats", objectives: ["2.1","2.2","2.3","2.4","2.5"], weight: 22 },
  { id: 3, name: "Security Architecture", short: "Architecture", objectives: ["3.1","3.2","3.3","3.4","3.5","3.6","3.7","3.8"], weight: 18 },
  { id: 4, name: "Security Operations", short: "Operations", objectives: ["4.1","4.2","4.3","4.4","4.5","4.6"], weight: 28 },
  { id: 5, name: "Security Program Management and Oversight", short: "Governance", objectives: ["5.1","5.2","5.3","5.4"], weight: 20 },
];

const studyPlanItems = [
  { title: "1.1 – 1.2 Security Concepts & Controls", time: "25 min" },
  { title: "1.3 – 1.4 Change Management & Cryptography", time: "25 min" },
  { title: "2.1 – 2.2 Threat Actors & Vectors", time: "30 min" },
  { title: "2.3 – 2.5 Vulnerabilities & Mitigations", time: "30 min" },
  { title: "3.1 – 3.3 Architecture & Resilience", time: "25 min" },
  { title: "3.4 – 3.8 Identity, Endpoints, Network, App, Data", time: "35 min" },
  { title: "4.1 – 4.3 Operations & Vulnerability Management", time: "30 min" },
  { title: "4.4 – 4.6 Incident Response, Forensics & Automation", time: "30 min" },
  { title: "5.1 – 5.2 Governance & Risk", time: "25 min" },
  { title: "5.3 – 5.4 Third-Party & Compliance", time: "25 min" },
];

const questionTemplates = [
  ["1.1", "general security concept", "A login flow changes its required evidence based on device health, location, and user risk.", "Adaptive identity", ["Open authentication", "Static authorization", "Legacy federation"], "Adaptive identity is a zero trust concept that changes access decisions based on context and risk signals."],
  ["1.1", "general security concept", "A security team assumes every request is untrusted until identity, device, and context are verified.", "Zero trust", ["Implicit trust", "Security through obscurity", "Open trust"], "Zero trust removes implicit trust and continuously verifies access requests."],
  ["1.1", "general security concept", "A company wants to reduce the number of users and systems an attacker can reach after compromise.", "Threat scope reduction", ["Risk transference", "Data masking", "Non-repudiation"], "Threat scope reduction limits blast radius through segmentation, least privilege, and policy-driven access."],
  ["1.2", "control category", "A camera records activity in a data center after hours.", "Detective control", ["Preventive control", "Compensating control", "Directive control"], "Detective controls identify or record events, while preventive controls stop them before they occur."],
  ["1.2", "control category", "A firewall rule blocks inbound traffic to an administrative interface.", "Preventive control", ["Corrective control", "Deterrent control", "Detective control"], "Preventive controls stop unwanted activity before it succeeds."],
  ["1.2", "control category", "A restoration script rebuilds a server from a known-good image after compromise.", "Corrective control", ["Deterrent control", "Managerial control", "Directive control"], "Corrective controls restore systems or reduce impact after an event."],
  ["1.3", "change management", "A change advisory board wants to understand what services could break before approving a firewall change.", "Impact analysis", ["Backout plan", "Version control", "Maintenance window"], "Impact analysis identifies dependencies, risk, and business effect before implementing a change."],
  ["1.3", "change management", "An update fails and the team needs a documented way to return to the prior working state.", "Backout plan", ["Approval workflow", "Standard operating procedure", "Asset tag"], "A backout plan defines how to reverse a change if it causes problems."],
  ["1.4", "cryptography", "A user encrypts a message with a recipient's public key.", "Only the recipient's private key can decrypt it", ["Only the sender's public key can decrypt it", "Any certificate authority can decrypt it", "The same public key must decrypt it"], "Asymmetric encryption uses the recipient's public key for encryption and the matching private key for decryption."],
  ["1.4", "cryptography", "A team needs proof that a file was not modified after signing.", "Digital signature", ["Steganography", "Key escrow", "Tokenization"], "Digital signatures provide integrity, authentication, and non-repudiation for signed data."],
  ["1.4", "cryptography", "A database stores passwords using a one-way function with salts.", "Hashing", ["Symmetric encryption", "Asymmetric encryption", "Key stretching only"], "Hashing is one-way and is appropriate for password verification when combined with salts and strong algorithms."],
  ["1.4", "cryptography", "A company protects data at rest using the same secret key to encrypt and decrypt files.", "Symmetric encryption", ["Asymmetric encryption", "Hashing", "Digital signing"], "Symmetric encryption uses one shared secret key and is efficient for bulk data protection."],
  ["2.1", "threat actor", "An attacker has long-term funding, stealth, and a strategic political target.", "Nation-state", ["Script kiddie", "Hacktivist", "Insider threat"], "Nation-state actors commonly have advanced capability, resources, and strategic objectives."],
  ["2.1", "threat actor", "An employee copies customer records before leaving for a competitor.", "Insider threat", ["Supply chain attacker", "Unskilled attacker", "Competitor disclosure"], "Insider threats involve authorized users misusing access."],
  ["2.2", "threat vector", "A malicious update is distributed through a trusted vendor's software package.", "Supply chain attack", ["On-path attack", "Watering hole attack", "RFID cloning"], "Supply chain attacks compromise trusted vendors, dependencies, or update channels."],
  ["2.2", "threat vector", "An attacker places malicious code on a site frequently used by a target group.", "Watering hole attack", ["Smishing", "Password spraying", "Disassociation attack"], "Watering hole attacks compromise sites that intended victims are likely to visit."],
  ["2.2", "threat vector", "A message tricks a user into entering credentials on a fake login page.", "Phishing", ["Vishing", "Tailgating", "Prepending"], "Phishing uses deceptive electronic messages or sites to steal information or trigger actions."],
  ["2.2", "threat vector", "A text message asks a user to verify payroll information through a malicious link.", "Smishing", ["Vishing", "Pharming", "Whaling"], "Smishing is phishing performed through SMS or text messages."],
  ["2.3", "vulnerability", "A web form returns database errors when a single quote is submitted.", "SQL injection", ["Cross-site request forgery", "Directory traversal", "Race condition"], "SQL injection occurs when untrusted input is interpreted as database commands."],
  ["2.3", "vulnerability", "A site stores user input and later runs it as JavaScript in another user's browser.", "Stored XSS", ["Reflected DNS", "LDAP injection", "Buffer overflow"], "Stored cross-site scripting persists malicious script and serves it to later users."],
  ["2.3", "vulnerability", "An attacker accesses ../../etc/passwd through a poorly validated file parameter.", "Directory traversal", ["Privilege creep", "Cross-site request forgery", "Replay attack"], "Directory traversal abuses path manipulation to access files outside the intended directory."],
  ["2.3", "vulnerability", "A service copies more data into memory than the allocated buffer can hold.", "Buffer overflow", ["Integer hashing", "Token replay", "DNS tunneling"], "Buffer overflows can overwrite memory and may lead to crashes or code execution."],
  ["2.4", "indicator", "A user logs in from New York and five minutes later from Singapore.", "Impossible travel", ["Resource exhaustion", "Missing patch", "Blocked content"], "Impossible travel is an identity indicator showing geographically unrealistic authentication events."],
  ["2.4", "indicator", "A server suddenly uses all CPU while outbound traffic spikes.", "Resource consumption", ["Certificate pinning", "Legal hold", "Password spraying"], "Unexpected resource consumption can indicate malware, abuse, or compromise."],
  ["2.4", "indicator", "Security monitoring shows expected records are absent during the suspected attack window.", "Missing logs", ["False positive", "Geofencing", "Data masking"], "Missing logs can be an indicator that logging was disabled, tampered with, or misconfigured."],
  ["2.5", "mitigation", "A team needs to find known vulnerable services exposed to the internet.", "Vulnerability scanning", ["Hashing", "DLP watermarking", "Data sovereignty"], "Vulnerability scanning identifies known weaknesses, missing patches, and exposed services."],
  ["2.5", "mitigation", "Developers want to identify insecure source code patterns before release.", "Static application security testing", ["Dynamic DNS", "Network access control", "File integrity monitoring"], "SAST analyzes source or compiled code without running the application."],
  ["2.5", "mitigation", "A production web app is tested while running to find runtime flaws.", "Dynamic application security testing", ["Static code review", "Tokenization", "Federation"], "DAST tests a running application from the outside to find behavior and runtime vulnerabilities."],
  ["3.1", "architecture", "A design places public web servers in a separate network between the internet and internal LAN.", "Screened subnet", ["Honeynet", "Flat network", "Jump server"], "A screened subnet, often called a DMZ, separates public-facing services from internal networks."],
  ["3.1", "architecture", "A company wants to keep payment systems isolated from user workstations.", "Network segmentation", ["Open routing", "Password vaulting", "Data tokenization"], "Network segmentation separates systems to reduce attack paths and enforce policy."],
  ["3.1", "architecture", "A sensitive application is moved to its own fine-grained policy boundary inside the data center.", "Microsegmentation", ["Macro expansion", "Broadcast domain collapse", "Warm site"], "Microsegmentation applies granular traffic controls between workloads or application tiers."],
  ["3.2", "cloud", "A provider manages the application while the customer configures users and data.", "SaaS", ["IaaS", "PaaS", "On-premises"], "Software as a service provides a complete application managed by the provider."],
  ["3.2", "cloud", "A team deploys code to a managed runtime without managing the underlying servers.", "PaaS", ["SaaS", "IaaS", "Colocation"], "Platform as a service provides managed runtime and platform components for application deployment."],
  ["3.2", "cloud", "A company rents virtual machines, storage, and networks but manages the operating systems.", "IaaS", ["SaaS", "PaaS", "FaaS only"], "Infrastructure as a service provides compute, storage, and network building blocks."],
  ["3.3", "resilience", "A service must continue operating if one data center fails.", "High availability", ["Non-repudiation", "Data minimization", "Obfuscation"], "High availability designs reduce downtime through redundancy and failover."],
  ["3.3", "resilience", "A business can tolerate losing no more than 15 minutes of data.", "Recovery point objective", ["Recovery time objective", "Mean time to repair", "Mean time between failures"], "RPO defines the maximum acceptable data loss measured in time."],
  ["3.3", "resilience", "A business process must be restored within four hours after an outage.", "Recovery time objective", ["Recovery point objective", "Annualized loss expectancy", "Exposure factor"], "RTO defines the maximum acceptable time to restore a service."],
  ["3.4", "identity", "A user authenticates once and then accesses multiple trusted applications.", "Single sign-on", ["Password spraying", "Just-in-time compilation", "Security assertion blocking"], "SSO allows one authentication event to provide access to multiple trusted services."],
  ["3.4", "identity", "A cloud application trusts identity assertions from an enterprise identity provider.", "Federation", ["Hashing", "Tokenization", "Network bridging"], "Federation allows identity information to be shared across security domains."],
  ["3.4", "identity", "A user receives only the access required for a short maintenance window.", "Just-in-time permissions", ["Standing privilege", "Shared account", "Privilege creep"], "Just-in-time permissions reduce risk by granting elevated access only when needed."],
  ["3.5", "endpoint", "A tool correlates endpoint behavior, network activity, and identity signals for detection and response.", "XDR", ["NAT", "WPA3", "BGP"], "Extended detection and response correlates telemetry across multiple security layers."],
  ["3.5", "endpoint", "A mobile policy separates business data from personal data on the same device.", "Containerization", ["Jailbreaking", "Side loading", "RF shielding"], "Mobile containerization isolates corporate apps and data from personal space."],
  ["3.5", "endpoint", "A device proves its boot chain has not been tampered with before accessing resources.", "Attestation", ["Pharming", "Whaling", "Salting"], "Attestation verifies device integrity, often using hardware-backed measurements."],
  ["3.6", "network", "An organization wants encrypted wireless authentication using SAE.", "WPA3-Personal", ["WEP", "WPA2 with TKIP", "Open captive portal"], "WPA3-Personal uses SAE and improves protection compared with older personal wireless modes."],
  ["3.6", "network", "A business wants per-user wireless authentication tied to directory credentials.", "WPA3-Enterprise", ["WEP shared key", "Open Wi-Fi", "PSK-only mode"], "Enterprise wireless commonly uses 802.1X/RADIUS for individual authentication."],
  ["3.6", "network", "A DNS control validates signed responses to reduce spoofing risk.", "DNSSEC", ["DMARC", "DKIM", "SPF"], "DNSSEC adds integrity and origin authentication to DNS data with digital signatures."],
  ["3.7", "application", "A pipeline checks third-party libraries for known vulnerable versions.", "Software composition analysis", ["Business impact analysis", "Key escrow", "Port mirroring"], "SCA identifies vulnerable or risky open-source dependencies."],
  ["3.7", "application", "A web app issues a token that identifies a session after successful login.", "Session token", ["Salting string", "Data owner", "RPO marker"], "Session tokens maintain authenticated state and must be protected from theft and fixation."],
  ["3.7", "application", "Developers restrict what an input field accepts before processing it.", "Input validation", ["Open redirect", "Implicit deny removal", "Data remanence"], "Input validation reduces injection and malformed-input risk by enforcing expected values."],
  ["3.8", "data", "A system replaces sensitive values with non-sensitive substitutes while retaining a lookup vault.", "Tokenization", ["Hash collision", "Compression", "Steganography"], "Tokenization replaces sensitive data with tokens and stores the mapping securely."],
  ["3.8", "data", "A report hides all but the last four digits of an account number.", "Data masking", ["Data sovereignty", "Data remanence", "Data exfiltration"], "Data masking obscures sensitive values while preserving limited usability."],
  ["3.8", "data", "A company must keep customer records within a specific country.", "Data sovereignty", ["Data masking", "Data tokenization", "Data deduplication"], "Data sovereignty concerns legal and regulatory control based on where data is stored."],
  ["4.1", "operations", "An administrator performs maintenance through a hardened host that logs privileged access.", "Jump server", ["Honeypot", "Load balancer", "Proxy ARP"], "A jump server centralizes and controls administrative access to protected networks."],
  ["4.1", "operations", "A team grants access based on job function rather than assigning permissions directly to each user.", "Role-based access control", ["Rule-based access control", "Discretionary access control", "Mandatory access control"], "RBAC assigns permissions to roles that map to job responsibilities."],
  ["4.1", "operations", "Access is automatically allowed or denied based on attributes like device compliance and location.", "Attribute-based access control", ["Role-based access control", "Mandatory access control", "Time-of-check hashing"], "ABAC evaluates attributes about the subject, object, action, and environment."],
  ["4.2", "monitoring", "A system collects logs from many sources and correlates alerts.", "SIEM", ["SASE", "HSM", "SDN"], "A SIEM centralizes log collection, correlation, alerting, and reporting."],
  ["4.2", "monitoring", "A deception host is intentionally vulnerable to observe attacker behavior.", "Honeypot", ["Bastion host", "CASB", "Reverse proxy"], "Honeypots attract and monitor attacker activity without hosting production services."],
  ["4.2", "monitoring", "A baseline shows normal network traffic so anomalies are easier to detect.", "Network baseline", ["Risk register", "Certificate chain", "Key escrow"], "Baselines define expected behavior and help identify deviations."],
  ["4.3", "vulnerability management", "Patches are tested in staging before being deployed broadly.", "Patch management", ["Credential stuffing", "Geofencing", "Data masking"], "Patch management includes testing, deployment, and verification to reduce vulnerability risk."],
  ["4.3", "vulnerability management", "A scanner finding is confirmed manually before a ticket is created.", "Validation", ["Exemption", "Federation", "Obfuscation"], "Validation confirms that a vulnerability finding is real and relevant."],
  ["4.3", "vulnerability management", "A critical system cannot be patched, so compensating controls are documented for a limited time.", "Exception", ["Risk denial", "Implicit trust", "Unscoped finding"], "An exception documents a temporary approved deviation when normal remediation cannot occur immediately."],
  ["4.4", "incident response", "The team removes malware and closes the exploited vulnerability after containment.", "Eradication", ["Preparation", "Recovery", "Lessons learned"], "Eradication removes the cause of the incident after containment has limited damage."],
  ["4.4", "incident response", "The organization restores services and watches for signs of reinfection.", "Recovery", ["Detection", "Preparation", "Containment"], "Recovery returns systems to normal operation while monitoring for recurring issues."],
  ["4.4", "incident response", "The team documents what happened and improves playbooks after the incident.", "Lessons learned", ["Containment", "Eradication", "Triage"], "Lessons learned captures improvements after the incident response process."],
  ["4.5", "forensics", "An analyst records every person who handled evidence and when.", "Chain of custody", ["Right to audit", "Data masking", "Key rotation"], "Chain of custody preserves evidence integrity by documenting control and transfer."],
  ["4.5", "forensics", "A disk image is hashed before and after copying to prove it did not change.", "Integrity verification", ["Data minimization", "Degaussing", "Token rotation"], "Hash comparison verifies that forensic copies match the original evidence."],
  ["4.5", "forensics", "The most volatile evidence should be collected first.", "Order of volatility", ["Least privilege", "Implicit deny", "Risk tolerance"], "Order of volatility prioritizes evidence likely to disappear fastest, such as memory and network state."],
  ["4.6", "automation", "A script automatically disables accounts listed in an HR termination feed.", "User provisioning automation", ["DNS tunneling", "Static routing", "Key stretching"], "Automation can enforce onboarding and offboarding actions quickly and consistently."],
  ["4.6", "automation", "A security workflow automatically enriches an alert and opens a ticket.", "SOAR", ["SLA", "MOU", "HSM"], "SOAR automates and orchestrates security response workflows."],
  ["4.6", "automation", "Infrastructure is deployed from declarative configuration files.", "Infrastructure as code", ["Identity proofing", "Certificate pinning", "On-path routing"], "Infrastructure as code manages systems through versioned, repeatable definitions."],
  ["5.1", "governance", "A document states acceptable use of company systems.", "Acceptable use policy", ["Risk register", "Memorandum of understanding", "Certificate policy"], "An AUP defines acceptable and prohibited use of organizational resources."],
  ["5.1", "governance", "A document provides mandatory requirements for password length and complexity.", "Standard", ["Guideline", "Procedure", "Risk appetite"], "Standards define mandatory requirements that support policies."],
  ["5.1", "governance", "A step-by-step document explains how to onboard a new employee account.", "Procedure", ["Policy", "Guideline", "Risk register"], "Procedures give detailed steps for performing a task."],
  ["5.2", "risk", "A company buys cyber insurance to reduce financial exposure.", "Transfer", ["Avoid", "Accept", "Mitigate"], "Risk transfer shifts some financial impact to a third party, such as an insurer."],
  ["5.2", "risk", "A company stops offering a risky legacy service entirely.", "Avoid", ["Transfer", "Accept", "Mitigate"], "Risk avoidance eliminates the activity that creates the risk."],
  ["5.2", "risk", "A company deploys MFA to lower account takeover likelihood.", "Mitigate", ["Transfer", "Accept", "Avoid"], "Risk mitigation reduces likelihood or impact through controls."],
  ["5.2", "risk", "A risk calculation multiplies single loss expectancy by annualized rate of occurrence.", "Annualized loss expectancy", ["Exposure factor", "Recovery time objective", "Risk appetite"], "ALE equals SLE multiplied by ARO for quantitative risk analysis."],
  ["5.3", "third party", "A contract clause allows the customer to inspect a vendor's security controls.", "Right to audit", ["Data masking", "Tokenization", "Backout plan"], "Right to audit gives a customer permission to review vendor compliance and controls."],
  ["5.3", "third party", "A lightweight agreement documents shared expectations between two internal departments.", "MOU", ["SLA", "BIA", "RPO"], "A memorandum of understanding documents expectations without the same formality as a contract."],
  ["5.3", "third party", "A provider commits to measurable uptime and response targets.", "SLA", ["MOU", "NDA", "AUP"], "A service level agreement defines measurable service commitments."],
  ["5.4", "compliance", "A company keeps only the personal data required for a stated business purpose.", "Data minimization", ["Data hoarding", "Data remanence", "Data mirroring"], "Data minimization reduces privacy risk by collecting and retaining only necessary data."],
  ["5.4", "compliance", "A user asks an organization to remove personal data where legally allowed.", "Right to be forgotten", ["Right to audit", "Legal hold", "Chain of custody"], "The right to be forgotten is a privacy concept allowing deletion requests under certain laws."],
  ["5.4", "compliance", "A company must preserve relevant records because litigation is expected.", "Legal hold", ["Data masking", "Risk transfer", "Tokenization"], "A legal hold preserves information that may be relevant to legal proceedings."],
];

const questionVariants = [
  "Which answer best matches this Security+ SY0-701 scenario?",
  "What should a Security+ analyst identify in this situation?",
  "Which concept is being described?",
  "Which choice is the best fit for the stated requirement?",
];

const questionBank = questionTemplates.slice(0, 75).flatMap((template, templateIndex) => {
  const [objective, domain, scenario, correct, distractors, explanation] = template;
  return questionVariants.map((variant, variantIndex) => {
    const answers = [correct, ...distractors];
    const shift = (templateIndex + variantIndex) % answers.length;
    const rotatedAnswers = answers.slice(shift).concat(answers.slice(0, shift));
    return {
      id: templateIndex * 4 + variantIndex,
      objective,
      domain,
      text: `${scenario} ${variant}`,
      answers: rotatedAnswers,
      correct: rotatedAnswers.indexOf(correct),
      explanation: `${correct}: ${explanation}`,
    };
  });
});

const flashcards = [
  { type: "Term", front: "Zero Trust", back: "Continuously verifies identity, device, context, and authorization rather than trusting a network location by default." },
  { type: "Port", front: "TCP 443", back: "HTTPS. Expect encrypted web traffic protected by TLS certificates." },
  { type: "Control Type", front: "Detective Control", back: "Identifies or records an event after it occurs, such as logging, monitoring, or IDS alerts." },
  { type: "Protocol", front: "SAML", back: "XML-based federation protocol commonly used for enterprise single sign-on." },
  { type: "Risk Formula", front: "ALE", back: "Annualized loss expectancy equals SLE multiplied by ARO." },
  { type: "IR Phase", front: "Eradication", back: "Remove malware, close exploited vulnerabilities, and eliminate attacker persistence after containment." },
];

const labActions = [
  { text: "Revoke active sessions for the affected account", correct: true },
  { text: "Reset the account password and require MFA re-registration", correct: true },
  { text: "Preserve sign-in, mailbox, and file access logs", correct: true },
  { text: "Remove the suspicious inbox forwarding rule", correct: true },
  { text: "Wipe the file server before collecting evidence", correct: false },
  { text: "Ignore the MFA event because one approval was successful", correct: false },
];

const pbqItems = [
  { item: "Public web server", answer: "Screened subnet" },
  { item: "Internal file server", answer: "Internal LAN" },
  { item: "Privileged admin access", answer: "Jump server" },
  { item: "Identity provider", answer: "Internal LAN" },
];

const pbqZones = ["Screened subnet", "Internal LAN", "Jump server", "Guest network"];

// ────────────────────────────────────────────────────────────────
//  COMPUTED STATS
// ────────────────────────────────────────────────────────────────

function getDomainForObjective(obj) {
  const major = obj.split(".")[0];
  return domainMap.find(d => d.id === Number(major));
}

function computeDomainProgress() {
  return domainMap.map((d) => {
    const relevant = questionBank.filter(q => d.objectives.includes(q.objective));
    const uniqueIds = [...new Set(relevant.map(q => Math.floor(q.id / 4)))];
    const answered = uniqueIds.filter(tid =>
      state.quizResults.some(r => Math.floor(r.id / 4) === tid)
    );
    const correctOfAnswered = answered.filter(tid =>
      state.quizResults.some(r => Math.floor(r.id / 4) === tid && r.correct)
    );
    const pct = answered.length === 0 ? 0 : Math.round((correctOfAnswered.length / uniqueIds.length) * 100);
    return { ...d, progress: pct, answered: answered.length, total: uniqueIds.length };
  });
}

function computeReadiness() {
  const total = questionBank.filter((q, i) => i % 4 === 0).length;
  const correct = new Set(
    state.quizResults.filter(r => r.correct).map(r => Math.floor(r.id / 4))
  ).size;
  if (state.quizResults.length === 0) return 0;
  return Math.round((correct / total) * 100);
}

function computeStreak() {
  const today = new Date().toISOString().slice(0, 10);
  let streak = 0;
  let d = new Date();
  while (true) {
    const iso = d.toISOString().slice(0, 10);
    if (state.streakDays.includes(iso)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function computeLastSession() {
  if (state.quizSessions.length === 0) return null;
  return state.quizSessions[state.quizSessions.length - 1];
}

function computeBestSession() {
  if (state.quizSessions.length === 0) return null;
  return state.quizSessions.reduce((best, s) =>
    (s.correct / s.total) > (best.correct / best.total) ? s : best
  );
}

function computeHeatmap() {
  const objCounts = {};
  questionBank.forEach(q => {
    if (q.id % 4 !== 0) return; // count unique templates only
    const obj = q.objective;
    if (!objCounts[obj]) objCounts[obj] = { total: 1, correct: 0 };
    else objCounts[obj].total++;
    const tid = Math.floor(q.id / 4);
    if (state.quizResults.some(r => Math.floor(r.id / 4) === tid && r.correct)) {
      objCounts[obj].correct++;
    }
  });

  const items = [
    "1.1 Controls", "1.2–1.4 Crypto & Change",
    "2.1–2.2 Threat Actors & Vectors", "2.3–2.5 Vulns & Mitigations",
    "3.1–3.3 Architecture & Resilience", "3.4–3.8 Identity, Endpoints & Data",
    "4.1–4.3 Operations & Vuln Mgmt", "4.4–4.6 IR, Forensics & Automation",
    "5.1–5.2 Governance & Risk", "5.3–5.4 Third Party & Compliance",
  ];

  const objectives = [
    ["1.1"],["1.2","1.3","1.4"],["2.1","2.2"],["2.3","2.4","2.5"],
    ["3.1","3.2","3.3"],["3.4","3.5","3.6","3.7","3.8"],
    ["4.1","4.2","4.3"],["4.4","4.5","4.6"],
    ["5.1","5.2"],["5.3","5.4"],
  ];

  return items.map((label, i) => {
    const objs = objectives[i];
    let total = 0, correct = 0;
    objs.forEach(obj => {
      const c = objCounts[obj];
      if (c) { total += c.total; correct += c.correct; }
    });
    const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
    let cls = "heat-low";
    if (pct >= 70) cls = "heat-high";
    else if (pct >= 40) cls = "heat-mid";
    return { label, cls, pct };
  });
}

function getMissedQuestionCount() {
  const missed = new Set(
    state.quizResults.filter(r => !r.correct).map(r => Math.floor(r.id / 4))
  );
  // remove ones later answered correctly
  const corrected = new Set(
    state.quizResults.filter(r => r.correct).map(r => Math.floor(r.id / 4))
  );
  let count = 0;
  missed.forEach(tid => { if (!corrected.has(tid)) count++; });
  return count;
}

// ────────────────────────────────────────────────────────────────
//  SESSION QUIZ STATE
// ────────────────────────────────────────────────────────────────

let currentQuestion = 0;
let sessionCorrect = 0;
let sessionAnswered = 0;
let sessionStartTs = Date.now();
let currentCard = 0;
let cardFlipped = false;

// ────────────────────────────────────────────────────────────────
//  VIEW MANAGEMENT
// ────────────────────────────────────────────────────────────────

const sidebar = document.querySelector(".sidebar");
const menuToggle = document.querySelector("#menuToggle");
const navButtons = document.querySelectorAll("[data-view]");
const viewLinks = document.querySelectorAll("[data-view-link]");
const themeToggle = document.querySelector("#themeToggle");

function setView(viewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewId);
  });
  sidebar.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Refresh view-specific data
  if (viewId === "dashboard") renderDashboard();
  if (viewId === "progress") renderProgress();
}

// ────────────────────────────────────────────────────────────────
//  RENDER: DASHBOARD
// ────────────────────────────────────────────────────────────────

function renderDashboard() {
  const readiness = computeReadiness();
  const domains = computeDomainProgress();
  const streak = computeStreak();
  const last = computeLastSession();
  const best = computeBestSession();

  // Readiness panel
  const readinessLabel = readiness >= 80 ? "Strong" : readiness >= 60 ? "Good" : readiness >= 40 ? "Building" : "Starting";
  const estScore = Math.round(readiness * 9);
  const readinessEl = document.querySelector(".readiness-ring");
  if (readinessEl) {
    readinessEl.style.setProperty("--value", readiness);
    readinessEl.innerHTML = `<span>${readiness}%<small>${readinessLabel}</small></span>`;
  }
  const readinessCopy = document.querySelector(".readiness-copy");
  if (readinessCopy) {
    readinessCopy.querySelector("h2").textContent = `${readiness}%`;
    const msg = readiness >= 80
      ? "Strong readiness. Keep reviewing weak areas to stay sharp."
      : readiness >= 50
      ? "You're on track. Keep focusing on weak areas to improve your score."
      : "Early stage. Work through the study plan and practice quizzes regularly.";
    readinessCopy.querySelector("p").textContent = msg;
    const stats = readinessCopy.querySelector(".readiness-stats");
    if (stats) {
      stats.innerHTML = `
        <span><strong>${estScore} / 900</strong> Estimated Score</span>
        <span><strong>${state.quizSessions.length}</strong> Sessions Completed</span>
        <span><strong>${state.quizResults.length}</strong> Questions Answered</span>
      `;
    }
  }

  // Streak
  const streakEl = document.querySelector(".sidebar-card strong");
  if (streakEl) streakEl.textContent = `${streak} Day${streak !== 1 ? "s" : ""}`;

  const topStats = document.querySelectorAll(".top-stat");
  if (topStats[0]) topStats[0].textContent = streak;

  // Domain progress
  document.querySelector("#domainList").innerHTML = domains.map((d, i) => `
    <div class="domain-row">
      <div class="domain-top">
        <span>${i + 1}. ${d.name}</span>
        <span>${d.progress}%</span>
      </div>
      <div class="progress-track" aria-hidden="true"><span style="width:${d.progress}%"></span></div>
    </div>
  `).join("");

  document.querySelector("#domainRings").innerHTML = domains.map(d => `
    <div class="domain-ring">
      <div class="mini-ring" style="--value:${d.progress}"><span>${d.progress}%</span></div>
      <small>${d.short}</small>
    </div>
  `).join("");

  // Study plan
  renderStudyPlan();

  // Quick quiz card
  const miniScores = document.querySelector(".quiz-card .mini-scores");
  if (miniScores) {
    miniScores.innerHTML = `
      <span>Last Score <strong>${last ? `${last.correct}/${last.total}` : "–"}</strong></span>
      <span>Best Score <strong>${best ? `${best.correct}/${best.total}` : "–"}</strong></span>
    `;
  }

  // Flashcard card
  const flashH2 = document.querySelector(".flash-card h2");
  if (flashH2) {
    const reviewed = Object.keys(state.flashcardConfidence).length;
    flashH2.textContent = `${reviewed} / ${flashcards.length}`;
  }
  const flashP = document.querySelector(".flash-card > p:last-of-type");
  if (flashP && flashP.previousElementSibling?.tagName === "H2") {
    const reviewed = Object.keys(state.flashcardConfidence).length;
    flashP.textContent = reviewed >= flashcards.length
      ? "All cards reviewed. Confidence levels are tracked in your progress."
      : `${flashcards.length - reviewed} cards remaining. Keep reviewing daily.";
  }

  // Missed questions card in exams
  const missed = getMissedQuestionCount();
  const missedCard = document.querySelector(".exam-card:nth-child(3) p:nth-child(3)");
  if (missedCard) {
    missedCard.textContent = missed > 0
      ? `${missed} topic${missed !== 1 ? "s" : ""} waiting for review from your quiz history.`
      : "No missed questions yet. Keep practicing!";
  }
}

// ────────────────────────────────────────────────────────────────
//  RENDER: STUDY PLAN
// ────────────────────────────────────────────────────────────────

function renderStudyPlan() {
  const markup = studyPlanItems.map((item, index) => `
    <li>
      <label>
        <input type="checkbox" ${state.studyPlanDone[index] ? "checked" : ""} data-plan-index="${index}" />
        <span>${index + 1}. ${item.title}</span>
      </label>
      <span>${item.time}</span>
    </li>
  `).join("");

  const dash = document.querySelector("#dashboardStudyPlan");
  const plan = document.querySelector("#studyPlanList");
  if (dash) dash.innerHTML = markup;
  if (plan) plan.innerHTML = markup;

  // Wire checkboxes
  document.querySelectorAll("[data-plan-index]").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const idx = Number(e.target.dataset.planIndex);
      state.studyPlanDone[idx] = e.target.checked;
      saveState();
    });
  });

  // Update status pill
  const doneCount = Object.values(state.studyPlanDone).filter(Boolean).length;
  const pill = document.querySelector(".status-pill");
  if (pill) pill.textContent = `${doneCount} / ${studyPlanItems.length} completed`;
}

// ────────────────────────────────────────────────────────────────
//  RENDER: QUIZ
// ────────────────────────────────────────────────────────────────

function renderQuestion() {
  const question = questionBank[currentQuestion];
  document.querySelector("#questionCounter").textContent = `Question ${currentQuestion + 1} of ${questionBank.length}`;
  document.querySelector("#questionObjective").textContent = question.objective;
  document.querySelector("#questionDomain").textContent = question.domain;
  document.querySelector("#questionText").textContent = question.text;
  document.querySelector("#explanation").textContent = "Choose an answer to reveal the explanation.";
  document.querySelector("#quizScore").textContent = `${sessionCorrect}/${sessionAnswered}`;

  const answers = document.querySelector("#answers");
  answers.innerHTML = "";
  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index));
    answers.appendChild(button);
  });
}

function chooseAnswer(index) {
  const question = questionBank[currentQuestion];
  const buttons = document.querySelectorAll(".answer-button");
  if (buttons[index].disabled) return;

  sessionAnswered += 1;
  const isCorrect = index === question.correct;
  if (isCorrect) sessionCorrect += 1;

  // Record result
  state.quizResults.push({ id: question.id, correct: isCorrect, ts: Date.now() });
  saveState();

  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;
    button.classList.toggle("correct", buttonIndex === question.correct);
    button.classList.toggle("incorrect", buttonIndex === index && index !== question.correct);
  });

  document.querySelector("#quizScore").textContent = `${sessionCorrect}/${sessionAnswered}`;
  document.querySelector("#explanation").textContent = question.explanation;
}

// ────────────────────────────────────────────────────────────────
//  RENDER: FLASHCARDS
// ────────────────────────────────────────────────────────────────

function renderFlashcard() {
  const card = flashcards[currentCard];
  document.querySelector("#flashcardType").textContent = card.type;
  document.querySelector("#flashcardFront").textContent = card.front;
  document.querySelector("#flashcardBack").textContent = cardFlipped ? card.back : "";
  document.querySelector("#flashcardProgress").textContent = `${currentCard + 1}/${flashcards.length}`;
}

function markFlashcardReviewed() {
  const today = new Date().toISOString().slice(0, 10);
  if (!state.streakDays.includes(today)) {
    state.streakDays.push(today);
  }
  if (!state.flashcardConfidence[currentCard]) {
    state.flashcardConfidence[currentCard] = { confidence: 0, lastReviewed: today };
  }
  state.flashcardConfidence[currentCard].lastReviewed = today;
  saveState();
}

// ────────────────────────────────────────────────────────────────
//  RENDER: LAB
// ────────────────────────────────────────────────────────────────

function renderLabChecklist() {
  const checklist = document.querySelector("#labChecklist");
  checklist.innerHTML = "";

  labActions.forEach((action, index) => {
    const label = document.createElement("label");
    label.className = "check-item";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.dataset.index = index;
    input.addEventListener("change", updateLabScore);

    const span = document.createElement("span");
    span.textContent = action.text;

    label.append(input, span);
    checklist.appendChild(label);
  });

  updateLabScore();
}

function selectedLabActions() {
  return [...document.querySelectorAll("#labChecklist input:checked")].map((input) => Number(input.dataset.index));
}

function updateLabScore() {
  const selected = selectedLabActions();
  const correctSelected = selected.filter((index) => labActions[index].correct).length;
  document.querySelector("#labScore").textContent = `${correctSelected}/4`;
}

function gradeLab() {
  const selected = selectedLabActions();
  const correctSelected = selected.filter((index) => labActions[index].correct).length;
  const incorrectSelected = selected.filter((index) => !labActions[index].correct).length;
  const missed = labActions.filter((action, index) => action.correct && !selected.includes(index)).length;
  const score = Math.max(0, correctSelected - incorrectSelected);
  const feedback = document.querySelector("#labFeedback");

  // Record lab score
  state.labScores.push({ ts: Date.now(), score, total: 4 });
  saveState();

  if (score === 4 && missed === 0) {
    feedback.textContent = "Excellent containment. You revoked access, reset authentication, preserved evidence, and removed the forwarding rule before recovery.";
    return;
  }

  feedback.textContent = `Score: ${score}/4. Strong incident response preserves evidence and contains the identity first. Avoid destructive recovery before evidence collection.`;
}

// ────────────────────────────────────────────────────────────────
//  RENDER: PBQ
// ────────────────────────────────────────────────────────────────

function renderPbq() {
  const table = document.querySelector("#pbqTable");
  table.innerHTML = pbqItems.map((item, index) => `
    <label class="pbq-row">
      <span>${item.item}</span>
      <select data-index="${index}" aria-label="Zone for ${item.item}">
        <option value="">Choose zone</option>
        ${pbqZones.map((zone) => `<option value="${zone}">${zone}</option>`).join("")}
      </select>
    </label>
  `).join("");

  document.querySelectorAll("#pbqTable select").forEach((select) => {
    select.addEventListener("change", updatePbqScore);
  });
  updatePbqScore();
}

function updatePbqScore() {
  const score = [...document.querySelectorAll("#pbqTable select")].filter((select) => pbqItems[Number(select.dataset.index)].answer === select.value).length;
  document.querySelector("#pbqScore").textContent = `${score}/4`;
}

function gradePbq() {
  const score = [...document.querySelectorAll("#pbqTable select")].filter((select) => pbqItems[Number(select.dataset.index)].answer === select.value).length;
  const feedback = document.querySelector("#pbqFeedback");

  // Record PBQ score
  state.pbqScores.push({ ts: Date.now(), score, total: 4 });
  saveState();

  if (score === 4) {
    feedback.textContent = "Perfect. Public services are isolated, admin access is controlled through a jump server, and internal services stay protected.";
    return;
  }
  feedback.textContent = `Score: ${score}/4. Recheck public exposure, administrative access paths, and which services should remain internal.`;
}

// ────────────────────────────────────────────────────────────────
//  RENDER: PROGRESS
// ────────────────────────────────────────────────────────────────

function renderProgress() {
  // Heatmap
  const heatmap = computeHeatmap();
  document.querySelector("#heatmap").innerHTML = heatmap.map(h =>
    `<div class="heat-cell ${h.cls}" title="${h.pct}% mastered">${h.label}</div>`
  ).join("");

  // Notes
  const markup = state.notes.map((note) => `<li>${note}</li>`).join("");
  const dashNotes = document.querySelector("#dashboardNotes");
  const notesList = document.querySelector("#notesList");
  if (dashNotes) dashNotes.innerHTML = markup;
  if (notesList) notesList.innerHTML = markup;

  // Domain rings
  const domains = computeDomainProgress();
  document.querySelector("#domainRings").innerHTML = domains.map(d => `
    <div class="domain-ring">
      <div class="mini-ring" style="--value:${d.progress}"><span>${d.progress}%</span></div>
      <small>${d.short}</small>
    </div>
  `).join("");
}

// ────────────────────────────────────────────────────────────────
//  RENDER: NOTES
// ────────────────────────────────────────────────────────────────

function renderNotes() {
  const markup = state.notes.map((note) => `<li>${note}</li>`).join("");
  const dashNotes = document.querySelector("#dashboardNotes");
  const notesList = document.querySelector("#notesList");
  if (dashNotes) dashNotes.innerHTML = markup;
  if (notesList) notesList.innerHTML = markup;
}

// ────────────────────────────────────────────────────────────────
//  THEME
// ────────────────────────────────────────────────────────────────

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("securityPlusTheme", theme);
  themeToggle.checked = theme === "dark";
  document.querySelector("#themeStatus").textContent = theme === "dark" ? "Dark mode enabled" : "Light mode enabled";
}

// ────────────────────────────────────────────────────────────────
//  EVENT LISTENERS
// ────────────────────────────────────────────────────────────────

navButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

viewLinks.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewLink));
});

menuToggle?.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Quiz
document.querySelector("#nextQuestion").addEventListener("click", () => {
  currentQuestion = (currentQuestion + 1) % questionBank.length;
  renderQuestion();
});

document.querySelector("#reviewQuestion").addEventListener("click", () => {
  document.querySelector("#explanation").textContent = "Saved to review. This question will appear again in your weak-area queue.";
});

document.querySelector("#randomQuestion").addEventListener("click", () => {
  currentQuestion = Math.floor(Math.random() * questionBank.length);
  renderQuestion();
});

document.querySelector("#resetQuiz").addEventListener("click", () => {
  // Save session before reset
  if (sessionAnswered > 0) {
    state.quizSessions.push({
      date: new Date().toISOString(),
      total: sessionAnswered,
      correct: sessionCorrect,
      duration: Math.round((Date.now() - sessionStartTs) / 1000),
    });
    saveState();
  }
  sessionCorrect = 0;
  sessionAnswered = 0;
  sessionStartTs = Date.now();
  currentQuestion = 0;
  renderQuestion();
});

// Confidence chips
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
  });
});

// Flashcards
document.querySelector("#flashcard").addEventListener("click", () => {
  cardFlipped = !cardFlipped;
  renderFlashcard();
});

document.querySelector("#flashcard").addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    cardFlipped = !cardFlipped;
    renderFlashcard();
  }
});

document.querySelector("#nextCard").addEventListener("click", () => {
  markFlashcardReviewed();
  currentCard = (currentCard + 1) % flashcards.length;
  cardFlipped = false;
  renderFlashcard();
});

document.querySelector("#prevCard").addEventListener("click", () => {
  currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
  cardFlipped = false;
  renderFlashcard();
});

// Lab
document.querySelector("#showHint").addEventListener("click", () => {
  document.querySelector("#labFeedback").textContent = "Hint: Contain the compromised identity, preserve evidence, and remove persistence. Avoid destructive recovery before evidence collection.";
});

document.querySelector("#gradeLab").addEventListener("click", gradeLab);

document.querySelector("#resetLab").addEventListener("click", () => {
  renderLabChecklist();
  document.querySelector("#labFeedback").textContent = "Lab reset. Select the containment actions you would take first.";
});

// PBQ
document.querySelector("#gradePbq").addEventListener("click", gradePbq);

document.querySelector("#showPbqHint").addEventListener("click", () => {
  document.querySelector("#pbqFeedback").textContent = "Hint: Internet-facing systems need isolation. Administrative access should pass through a hardened control point.";
});

document.querySelector("#resetPbq").addEventListener("click", () => {
  renderPbq();
  document.querySelector("#pbqFeedback").textContent = "PBQ reset. Choose a zone for each service, then grade your configuration.";
});

// Theme
themeToggle.addEventListener("change", () => {
  applyTheme(themeToggle.checked ? "dark" : "light");
});

// ────────────────────────────────────────────────────────────────
//  INIT
// ────────────────────────────────────────────────────────────────

loadState();

document.querySelector("#bankSize").textContent = questionBank.length;
document.querySelector("#practiceBankSize").textContent = questionBank.length;

renderDashboard();
renderStudyPlan();
renderQuestion();
renderFlashcard();
renderLabChecklist();
renderPbq();
renderNotes();
applyTheme(localStorage.getItem("securityPlusTheme") || "light");

document.querySelector("#labFeedback").textContent = "Select actions, use a hint if needed, then submit the lab for a debrief.";
document.querySelector("#pbqFeedback").textContent = "Choose a zone for each service, then grade your configuration.";
