// ────────────────────────────────────────────────────────────────
//  STATE & STORAGE
// ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "secplus-study-progress-v4";

function defaultState() {
  return {
    quizResults: [],
    quizSessions: [],
    flashcardConfidence: {},
    labScores: [],
    pbqScores: [],
    studyPlanDone: {},
    streakDays: [],
    reviewQueue: [],
    examResults: [],
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
      state.quizResults = Array.isArray(state.quizResults) ? state.quizResults : [];
      state.quizSessions = Array.isArray(state.quizSessions) ? state.quizSessions : [];
      state.labScores = Array.isArray(state.labScores) ? state.labScores : [];
      state.pbqScores = Array.isArray(state.pbqScores) ? state.pbqScores : [];
      state.streakDays = Array.isArray(state.streakDays) ? state.streakDays : [];
      state.reviewQueue = Array.isArray(state.reviewQueue) ? state.reviewQueue : [];
      state.examResults = Array.isArray(state.examResults) ? state.examResults : [];
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
  } catch { /* quota exceeded */ }
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
  // ── Domain 1 (1.1–1.4) ──
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

  // ── Domain 2 (2.1–2.5) ──
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

  // ── Domain 3 (3.1–3.8) ──
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

  // ── Domain 4 (4.1–4.6) ──
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

  // ── Domain 5 (5.1–5.4) ──
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

  // ── NEW: 50 additional templates ──

  // Domain 3 additions (3.1–3.8)
  ["3.1", "architecture", "A switch separates voice and data traffic into distinct broadcast domains.", "VLAN", ["VPN", "VXLAN", "SD-WAN"], "VLANs logically segment network traffic without requiring separate physical switches."],
  ["3.1", "architecture", "A security appliance filters traffic between internal zones using layer-7 inspection.", "Next-generation firewall", ["Stateless packet filter", "Network address translation", "DNS resolver"], "NGFWs combine traditional firewall filtering with application awareness and deep packet inspection."],
  ["3.2", "cloud", "A company runs a private cloud on its own hardware and extends capacity into a public cloud during peak demand.", "Hybrid cloud", ["Community cloud", "Multicloud", "Edge computing"], "Hybrid cloud connects private infrastructure with public cloud resources for flexible scaling."],
  ["3.2", "cloud", "Code runs in response to events without provisioning or managing servers.", "Serverless computing", ["Container orchestration", "Bare-metal hosting", "Virtual desktop infrastructure"], "Serverless platforms execute functions on demand and abstract server management away from the developer."],
  ["3.3", "resilience", "A backup site has power and networking but no equipment; hardware is shipped after a disaster.", "Cold site", ["Hot site", "Warm site", "Mobile site"], "A cold site provides basic facilities without pre-installed equipment for the lowest cost."],
  ["3.3", "resilience", "A backup data center has fully replicated systems and can take over immediately.", "Hot site", ["Cold site", "Warm site", "Disk backup"], "A hot site maintains a real-time replica and can assume operations with minimal downtime."],
  ["3.3", "resilience", "The average time between system failures is tracked to plan replacements.", "Mean time between failures", ["Mean time to repair", "Recovery time objective", "Exposure factor"], "MTBF estimates expected operational time between failures for hardware reliability planning."],
  ["3.3", "resilience", "The average time to restore a failed component is measured and tracked.", "Mean time to repair", ["Mean time between failures", "Recovery point objective", "Annualized loss expectancy"], "MTTR measures how quickly a failed component can be restored to operation."],
  ["3.4", "identity", "A service checks whether a user account exists in a directory before granting access.", "Authentication", ["Authorization", "Auditing", "Accounting"], "Authentication verifies the identity of a user or system before granting access."],
  ["3.4", "identity", "After authenticating, a system checks what resources the user can access.", "Authorization", ["Authentication", "Identification", "Non-repudiation"], "Authorization determines the permissions and access levels granted to an authenticated identity."],
  ["3.4", "identity", "An employee's access accumulates over time as they change roles without cleanup.", "Privilege creep", ["Least privilege", "Separation of duties", "Job rotation"], "Privilege creep occurs when old permissions are not revoked as users move between roles."],
  ["3.5", "endpoint", "A policy enforcement agent checks device compliance before allowing network access.", "Network access control", ["Data loss prevention", "Intrusion detection system", "Web application firewall"], "NAC evaluates device health and compliance before granting network connectivity."],
  ["3.5", "endpoint", "A system encrypts the entire hard drive so data is unreadable without authentication.", "Full disk encryption", ["File-level encryption", "TLS", "IPSec"], "Full disk encryption protects data at rest on lost or stolen devices."],
  ["3.6", "network", "An email sender publishes a record listing which servers are authorized to send mail for the domain.", "SPF", ["DKIM", "DMARC", "DNSSEC"], "SPF specifies which mail servers are authorized to send email on behalf of a domain."],
  ["3.6", "network", "An email system adds a cryptographic signature to outgoing messages so recipients can verify the sender.", "DKIM", ["SPF", "DMARC", "HTTPS"], "DKIM signs outgoing email so recipients can verify the message was not tampered with in transit."],
  ["3.6", "network", "A policy tells receiving mail servers what to do when SPF or DKIM checks fail.", "DMARC", ["SPF", "DKIM", "DNSSEC"], "DMARC builds on SPF and DKIM to tell receivers how to handle authentication failures."],
  ["3.7", "application", "A web application allows users to embed a malicious link that executes when an admin clicks it.", "Cross-site request forgery", ["SQL injection", "Directory traversal", "Buffer overflow"], "CSRF tricks authenticated users into submitting unwanted requests to a vulnerable application."],
  ["3.7", "application", "Developers use parameterized queries to prevent untrusted input from modifying database commands.", "SQL injection prevention", ["XSS mitigation", "CSRF token", "Input fuzzing"], "Parameterized queries separate SQL logic from data, preventing injection attacks."],
  ["3.8", "data", "A security team destroys hard drives by exposing them to a strong magnetic field.", "Degaussing", ["Cryptographic erasure", "Physical shredding", "Reformatting"], "Degaussing uses strong magnetic fields to irreversibly erase data from magnetic media."],
  ["3.8", "data", "A process destroys encryption keys to make encrypted data permanently unreadable.", "Crypto-shredding", ["Degaussing", "Data masking", "Steganography"], "Crypto-shredding renders data unrecoverable by destroying the keys needed to decrypt it."],

  // Domain 4 additions (4.1–4.6)
  ["4.1", "operations", "A policy requires two authorized individuals to approve a sensitive action.", "Dual control", ["Separation of duties", "Job rotation", "Least privilege"], "Dual control requires two separate people to authorize critical operations."],
  ["4.1", "operations", "One person configures a new service and a different person approves it.", "Separation of duties", ["Dual control", "Job rotation", "Mandatory vacation"], "Separation of duties divides critical tasks among multiple people to prevent fraud."],
  ["4.1", "operations", "An employee is required to take consecutive days off so a replacement can review their work.", "Mandatory vacation", ["Job rotation", "Separation of duties", "Dual control"], "Mandatory vacation policies detect fraud or misuse by having someone else cover the role."],
  ["4.2", "monitoring", "A tool inspects packets and blocks traffic matching known attack signatures.", "Intrusion prevention system", ["Intrusion detection system", "SIEM", "DLP"], "An IPS actively blocks suspicious traffic, while an IDS only alerts on it."],
  ["4.2", "monitoring", "A monitoring tool checks file hashes to detect unauthorized changes to system files.", "File integrity monitoring", ["Network baseline", "Vulnerability scan", "Packet capture"], "FIM alerts when critical files are modified, indicating potential compromise."],
  ["4.2", "monitoring", "A security team captures and analyzes live network traffic to investigate an incident.", "Packet capture", ["Vulnerability scan", "Risk assessment", "Compliance audit"], "Packet capture allows analysts to inspect network conversations for indicators of compromise."],
  ["4.3", "vulnerability management", "A scanner finds 200 vulnerabilities and the team prioritizes critical and high-severity items first.", "Risk-based prioritization", ["Patch Tuesday", "CVE enumeration", "False positive reduction"], "Risk-based prioritization focuses remediation on vulnerabilities with the greatest potential impact."],
  ["4.3", "vulnerability management", "An authorized team attempts to exploit vulnerabilities to prove they are real.", "Penetration testing", ["Vulnerability scanning", "Risk assessment", "Compliance audit"], "Penetration testing actively exploits vulnerabilities to demonstrate their real-world impact."],
  ["4.4", "incident response", "A team creates playbooks, establishes communication channels, and trains staff before any incident occurs.", "Preparation", ["Detection", "Containment", "Recovery"], "Preparation establishes the tools, processes, and training needed before an incident."],
  ["4.4", "incident response", "An alert fires when an unusual process connects to a known command-and-control server.", "Detection", ["Containment", "Eradication", "Recovery"], "Detection identifies potential security events through alerts, logs, or observations."],
  ["4.4", "incident response", "The team isolates an infected workstation from the network to stop lateral movement.", "Containment", ["Eradication", "Recovery", "Lessons learned"], "Containment limits the spread and impact of an incident while preserving evidence."],
  ["4.5", "forensics", "An analyst creates a bit-for-bit copy of a drive and verifies the hash matches the original.", "Disk imaging", ["Memory capture", "Network forensics", "Log analysis"], "Disk imaging creates an exact forensic copy while preserving the original evidence."],
  ["4.5", "forensics", "A first responder captures the contents of RAM before powering off a compromised system.", "Memory forensics", ["Disk imaging", "Packet capture", "Registry analysis"], "Memory forensics captures volatile data that would be lost when the system is powered down."],
  ["4.5", "forensics", "Evidence is stored in a locked cabinet with controlled access and a sign-out log.", "Secure storage", ["Chain of custody", "Data minimization", "Key rotation"], "Physical security controls protect evidence from tampering or unauthorized access."],
  ["4.6", "automation", "A security tool automatically blocks traffic from IP addresses that triggered multiple alerts.", "Automated response", ["Manual review", "Change management", "Risk assessment"], "Automated response reduces dwell time by acting on indicators without human delay."],
  ["4.6", "automation", "A configuration management tool detects drift from the approved baseline and reverts changes.", "Desired state configuration", ["Manual hardening", "Ad hoc scripting", "Legacy deployment"], "Desired state configuration continuously enforces the approved system baseline."],
  ["4.6", "automation", "A playbook automatically enriches a phishing alert with sender reputation and URL analysis.", "SOAR enrichment", ["SIEM correlation", "Manual triage", "Threat hunting"], "SOAR playbooks automate investigation steps that would otherwise require manual analyst effort."],

  // Domain 5 additions (5.1–5.4)
  ["5.1", "governance", "A flexible recommendation suggests encrypting laptops but does not mandate it.", "Guideline", ["Policy", "Standard", "Procedure"], "Guidelines are optional recommendations, unlike mandatory standards or policies."],
  ["5.1", "governance", "Security responsibilities are assigned to data owners, custodians, and users.", "Data governance roles", ["Risk roles", "Compliance roles", "Change management roles"], "Data governance assigns accountability for classifying, handling, and protecting information."],
  ["5.1", "governance", "A senior executive is formally assigned accountability for security in their department.", "Risk owner", ["Data custodian", "Security analyst", "Auditor"], "A risk owner is accountable for managing and accepting risk within their area of responsibility."],
  ["5.2", "risk", "Management decides the remaining risk after controls are in place is tolerable.", "Risk acceptance", ["Risk avoidance", "Risk transfer", "Risk mitigation"], "Risk acceptance acknowledges that residual risk is within the organization's tolerance."],
  ["5.2", "risk", "An assessor multiplies asset value by exposure factor to find the loss from a single event.", "Single loss expectancy", ["Annualized loss expectancy", "Annual rate of occurrence", "Return on security investment"], "SLE equals asset value multiplied by exposure factor for one occurrence."],
  ["5.2", "risk", "A quantitative assessment estimates how often a flood could damage the data center each year.", "Annualized rate of occurrence", ["Single loss expectancy", "Exposure factor", "Risk appetite"], "ARO estimates the frequency of a threat event occurring within a year."],
  ["5.2", "risk", "A report categorizes findings as low, medium, high, and critical.", "Qualitative risk assessment", ["Quantitative risk assessment", "Business impact analysis", "Threat modeling"], "Qualitative assessment uses categories and subjective judgment rather than dollar amounts."],
  ["5.2", "risk", "A team identifies critical business processes and the maximum tolerable downtime for each.", "Business impact analysis", ["Risk assessment", "Vulnerability assessment", "Threat assessment"], "A BIA identifies critical functions and their availability requirements."],
  ["5.3", "third party", "A vendor agreement prohibits the provider from disclosing customer information.", "Non-disclosure agreement", ["Service level agreement", "Memorandum of understanding", "Business partner agreement"], "An NDA protects confidential information shared between parties."],
  ["5.3", "third party", "An assessment evaluates a vendor's security posture before signing a contract.", "Vendor risk assessment", ["Compliance audit", "Penetration test", "Internal audit"], "Vendor risk assessments evaluate third-party security before establishing a business relationship."],
  ["5.3", "third party", "A clause in the contract specifies who owns the data and what happens to it when the contract ends.", "Data ownership clause", ["Right to audit", "Force majeure", "Indemnification"], "Data ownership clauses clarify control and disposition of data throughout and after the engagement."],
  ["5.4", "compliance", "A framework requires organizations to notify affected individuals after a data breach.", "Breach notification", ["Data classification", "Incident response", "Risk acceptance"], "Breach notification laws mandate timely disclosure to individuals whose data was compromised."],
  ["5.4", "compliance", "A company classifies data as public, internal, confidential, and restricted.", "Data classification", ["Data minimization", "Data sovereignty", "Data masking"], "Data classification determines handling, storage, and access requirements based on sensitivity."],
  ["5.4", "compliance", "A healthcare organization must protect patient records under federal regulation.", "HIPAA", ["PCI DSS", "GDPR", "SOX"], "HIPAA establishes privacy and security requirements for protected health information."],
];

const questionVariants = [
  "Which answer best matches this Security+ SY0-701 scenario?",
  "What should a Security+ analyst identify in this situation?",
  "Which concept is being described?",
  "Which choice is the best fit for the stated requirement?",
];

const questionBank = questionTemplates.flatMap((template, templateIndex) => {
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

// ────────────────────────────────────────────────────────────────
//  PBQ SCENARIOS
// ────────────────────────────────────────────────────────────────

const pbqScenarios = [
  {
    id: "network-zones",
    title: "Place Controls in the Correct Network Zone",
    description: "A small business hosts a public website, internal file sharing, remote administration, and identity services. Choose the best zone for each item.",
    strategy: [
      "Public-facing services usually belong in a screened subnet.",
      "Administrative paths should be hardened and restricted.",
      "Identity and file services usually stay internal.",
    ],
    hint: "Internet-facing systems need isolation. Administrative access should pass through a hardened control point.",
    items: [
      { item: "Public web server", answer: "Screened subnet" },
      { item: "Internal file server", answer: "Internal LAN" },
      { item: "Privileged admin access", answer: "Jump server" },
      { item: "Identity provider", answer: "Internal LAN" },
    ],
    zones: ["Screened subnet", "Internal LAN", "Jump server", "Guest network"],
    perfectFeedback: "Perfect. Public services are isolated, admin access is controlled through a jump server, and internal services stay protected.",
    partialFeedback: "Score: {score}/4. Recheck public exposure, administrative access paths, and which services should remain internal.",
  },
  {
    id: "firewall-rules",
    title: "Order Firewall Rules from Most to Least Specific",
    description: "A firewall processes rules top to bottom. Place these rules in the correct order so traffic is filtered before hitting the default action.",
    strategy: [
      "More specific rules should be placed before more general ones.",
      "Explicit deny rules for sensitive subnets come before general allow rules.",
      "The default deny-all should always be last.",
    ],
    hint: "Think about what happens if a broad allow rule comes before a specific block. The broad rule would match first.",
    items: [
      { item: "Block all traffic from 10.0.0.0/8 to DMZ", answer: "1" },
      { item: "Allow HTTPS from any to web server", answer: "2" },
      { item: "Allow DNS from internal to any", answer: "3" },
      { item: "Deny all other traffic", answer: "4" },
    ],
    zones: ["1", "2", "3", "4"],
    perfectFeedback: "Correct order. Specific deny rules first, then service allows, then the catch-all default deny at the bottom.",
    partialFeedback: "Score: {score}/4. Remember: specific deny rules before general allow rules, and default deny always goes last.",
  },
  {
    id: "ir-phases",
    title: "Match Actions to Incident Response Phases",
    description: "Each action below belongs to a different IR phase. Assign each action to the correct phase.",
    strategy: [
      "Preparation happens before incidents. Detection identifies events. Containment limits spread.",
      "Eradication removes the root cause. Recovery restores normal ops. Lessons learned improves future response.",
    ],
    hint: "Preparation is proactive. Detection is reactive identification. Containment stops the bleeding. Eradication removes the cause.",
    items: [
      { item: "Install and configure a SIEM", answer: "Preparation" },
      { item: "SIEM alerts on unusual login pattern", answer: "Detection" },
      { item: "Isolate infected host from network", answer: "Containment" },
      { item: "Write after-action report and update playbook", answer: "Lessons learned" },
    ],
    zones: ["Preparation", "Detection", "Containment", "Eradication", "Recovery", "Lessons learned"],
    perfectFeedback: "All phases correctly identified. Understanding the IR lifecycle is critical for the exam.",
    partialFeedback: "Score: {score}/4. Preparation is before incidents, Detection identifies events, Containment limits spread, and Lessons learned comes last.",
  },
  {
    id: "certificate-types",
    title: "Match Certificate Types to Use Cases",
    description: "Match each scenario to the correct type of digital certificate.",
    strategy: [
      "Wildcard certificates cover a domain and all subdomains.",
      "Self-signed certificates are used internally where public trust is not needed.",
      "Code signing certificates authenticate software publishers.",
    ],
    hint: "Think about whether public trust is required. Internal services can use self-signed. Public web needs CA-signed.",
    items: [
      { item: "Secure *.example.com subdomains", answer: "Wildcard certificate" },
      { item: "Internal dev server with no public users", answer: "Self-signed certificate" },
      { item: "Software vendor proving download authenticity", answer: "Code signing certificate" },
      { item: "Public e-commerce checkout page", answer: "EV certificate" },
    ],
    zones: ["Wildcard certificate", "Self-signed certificate", "Code signing certificate", "EV certificate", "Root CA certificate"],
    perfectFeedback: "All matches correct. Certificate selection depends on scope, trust requirements, and validation level.",
    partialFeedback: "Score: {score}/4. Wildcard covers subdomains, self-signed is for internal use, code signing proves software origin, and EV provides highest assurance for public sites.",
  },
];

// ────────────────────────────────────────────────────────────────
//  LAB SCENARIOS
// ────────────────────────────────────────────────────────────────

const labScenarios = [
  {
    id: "suspicious-signin",
    eyebrow: "Incident Response",
    title: "Suspicious Sign-In",
    status: "Active Alert",
    description: "A user account shows impossible travel and suspicious MFA behavior. Choose the correct containment steps.",
    evidence: [
      "Impossible travel sign-in from Boston and Berlin within 11 minutes.",
      "MFA push accepted after five denied prompts.",
      "New inbox forwarding rule created for finance approvals.",
      "File server access spike from the same identity.",
    ],
    hint: "Contain the compromised identity, preserve evidence, and remove persistence. Avoid destructive recovery before evidence collection.",
    actions: [
      { text: "Revoke active sessions for the affected account", correct: true },
      { text: "Reset the account password and require MFA re-registration", correct: true },
      { text: "Preserve sign-in, mailbox, and file access logs", correct: true },
      { text: "Remove the suspicious inbox forwarding rule", correct: true },
      { text: "Wipe the file server before collecting evidence", correct: false },
      { text: "Ignore the MFA event because one approval was successful", correct: false },
    ],
    totalCorrect: 4,
    perfectFeedback: "Excellent containment. You revoked access, reset authentication, preserved evidence, and removed the forwarding rule before recovery.",
    partialFeedback: "Score: {score}/4. Strong incident response preserves evidence and contains the identity first. Avoid destructive recovery before evidence collection.",
  },
  {
    id: "malware-containment",
    eyebrow: "Malware Response",
    title: "Ransomware Containment",
    status: "Critical Alert",
    description: "Multiple workstations show encrypted files and a ransom note. Choose the correct containment and recovery steps.",
    evidence: [
      "Three accounting department PCs show .locked file extensions.",
      "A ransom note on each desktop demands cryptocurrency payment.",
      "Network monitoring shows outbound connections to a known C2 server.",
      "The file server shares accessed by these PCs also show encrypted files.",
    ],
    hint: "Isolate affected systems first, then preserve evidence and identify the vector. Never pay the ransom as a first response.",
    actions: [
      { text: "Disconnect affected workstations from the network", correct: true },
      { text: "Block the C2 server IP at the firewall", correct: true },
      { text: "Take memory captures before powering off affected systems", correct: true },
      { text: "Restore files from the last clean backup after eradication", correct: true },
      { text: "Pay the ransom immediately to recover files", correct: false },
      { text: "Reformat all affected PCs before investigating the attack vector", correct: false },
    ],
    totalCorrect: 4,
    perfectFeedback: "Textbook response. Isolate, block C2, preserve evidence, then restore from backups after eradication.",
    partialFeedback: "Score: {score}/4. Isolate first, block outbound C2, capture volatile evidence, and restore from backups — never pay ransoms blindly.",
  },
  {
    id: "access-control-audit",
    eyebrow: "Access Audit",
    title: "Access Control Review",
    status: "Audit Required",
    description: "An audit found users with excessive or inappropriate permissions. Identify the correct remediation actions.",
    evidence: [
      "A terminated contractor still has VPN access 30 days after departure.",
      "A marketing intern has domain admin privileges.",
      "A developer has write access to production database servers.",
      "The CEO's assistant can approve their own expense reports.",
    ],
    hint: "Follow least privilege and separation of duties. Revoke access for terminated users immediately.",
    actions: [
      { text: "Disable the terminated contractor's VPN and all accounts", correct: true },
      { text: "Remove domain admin from the intern and grant marketing-only access", correct: true },
      { text: "Separate developer write access from production systems", correct: true },
      { text: "Remove the assistant's self-approval for expense reports", correct: true },
      { text: "Grant the intern local admin on all workstations instead", correct: false },
      { text: "Leave the contractor account active in case they return", correct: false },
    ],
    totalCorrect: 4,
    perfectFeedback: "All violations corrected. Least privilege and separation of duties properly enforced.",
    partialFeedback: "Score: {score}/4. Revoke terminated access immediately, enforce least privilege, and maintain separation of duties.",
  },
  {
    id: "network-segmentation",
    eyebrow: "Network Security",
    title: "Segmentation Validation",
    status: "Review Needed",
    description: "A network audit reveals systems placed in incorrect zones. Identify which systems should move to which zone.",
    evidence: [
      "The HR database is accessible from the guest Wi-Fi network.",
      "A public web server sits on the internal LAN behind the firewall.",
      "The backup server shares a VLAN with the developer workstations.",
      "SCADA control systems are reachable from the corporate email server.",
    ],
    hint: "Isolate critical systems. Public-facing services go in a screened subnet. ICS/SCADA must be air-gapped or heavily segmented.",
    actions: [
      { text: "Move the HR database behind a separate internal segment with restricted access", correct: true },
      { text: "Move the public web server to a screened subnet (DMZ)", correct: true },
      { text: "Place the backup server on its own isolated VLAN", correct: true },
      { text: "Segment SCADA systems from the corporate network with a firewall or air gap", correct: true },
      { text: "Leave the HR database accessible from guest Wi-Fi for convenience", correct: false },
      { text: "Put SCADA and corporate systems on the same VLAN to simplify management", correct: false },
    ],
    totalCorrect: 4,
    perfectFeedback: "All systems correctly segmented. Critical data and ICS systems are now isolated from less trusted networks.",
    partialFeedback: "Score: {score}/4. Public services go in a screened subnet, sensitive data needs restricted segments, and ICS must be isolated from corporate networks.",
  },
];

// ────────────────────────────────────────────────────────────────
//  COMPUTED STATS
// ────────────────────────────────────────────────────────────────

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
    if (q.id % 4 !== 0) return;
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
  const corrected = new Set(
    state.quizResults.filter(r => r.correct).map(r => Math.floor(r.id / 4))
  );
  let count = 0;
  missed.forEach(tid => { if (!corrected.has(tid)) count++; });
  return count;
}

// ────────────────────────────────────────────────────────────────
//  SESSION STATE
// ────────────────────────────────────────────────────────────────

let currentQuestion = 0;
let sessionCorrect = 0;
let sessionAnswered = 0;
let sessionStartTs = Date.now();
let currentCard = 0;
let cardFlipped = false;
let reviewingWeakAreas = false;
let currentPbqScenario = 0;
let currentLabScenario = 0;

// Exam state
let examState = {
  active: false,
  questions: [],
  answers: [],
  currentIndex: 0,
  correct: 0,
  timer: null,
  timeRemaining: 0,
  isQuickExam: false,
};

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

  if (viewId === "dashboard") renderDashboard();
  if (viewId === "progress") renderProgress();
  if (viewId === "settings") renderSettings();
  if (viewId === "exams") renderExamStart();
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

  const streakEl = document.querySelector(".sidebar-card strong");
  if (streakEl) streakEl.textContent = `${streak} Day${streak !== 1 ? "s" : ""}`;

  const topStats = document.querySelectorAll(".top-stat");
  if (topStats[0]) topStats[0].textContent = streak;

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

  renderStudyPlan();

  const miniScores = document.querySelector(".quiz-card .mini-scores");
  if (miniScores) {
    miniScores.innerHTML = `
      <span>Last Score <strong>${last ? `${last.correct}/${last.total}` : "–"}</strong></span>
      <span>Best Score <strong>${best ? `${best.correct}/${best.total}` : "–"}</strong></span>
    `;
  }

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
      : `${flashcards.length - reviewed} cards remaining. Keep reviewing daily.`;
  }

  // Review queue count
  const rqEl = document.querySelector("#reviewQueueCount");
  if (rqEl) {
    const missed = getMissedQuestionCount();
    const total = state.reviewQueue.length + missed;
    rqEl.textContent = `Review queue: ${total} item${total !== 1 ? "s" : ""}`;
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

  document.querySelectorAll("[data-plan-index]").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const idx = Number(e.target.dataset.planIndex);
      state.studyPlanDone[idx] = e.target.checked;
      saveState();
    });
  });

  const doneCount = Object.values(state.studyPlanDone).filter(Boolean).length;
  const pill = document.querySelector(".status-pill");
  if (pill) pill.textContent = `${doneCount} / ${studyPlanItems.length} completed`;
}

// ────────────────────────────────────────────────────────────────
//  RENDER: QUIZ
// ────────────────────────────────────────────────────────────────

function renderQuestion() {
  const question = questionBank[currentQuestion];
  document.querySelector("#questionCounter").textContent = reviewingWeakAreas
    ? `Review ${currentQuestion + 1} (weak areas)`
    : `Question ${currentQuestion + 1} of ${questionBank.length}`;
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
  if (buttons[0]?.disabled) return;

  sessionAnswered += 1;
  const isCorrect = index === question.correct;
  if (isCorrect) sessionCorrect += 1;

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

function getWeakAreaQuestionIds() {
  const missed = new Set(
    state.quizResults.filter(r => !r.correct).map(r => Math.floor(r.id / 4))
  );
  const corrected = new Set(
    state.quizResults.filter(r => r.correct).map(r => Math.floor(r.id / 4))
  );
  const stillWeak = new Set(state.reviewQueue);
  missed.forEach(tid => { if (!corrected.has(tid)) stillWeak.add(tid); });

  const ids = [];
  stillWeak.forEach(tid => {
    for (let v = 0; v < 4; v++) {
      const qid = tid * 4 + v;
      if (qid < questionBank.length) ids.push(qid);
    }
  });
  return ids.length > 0 ? ids : null;
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
  if (!state.streakDays.includes(today)) state.streakDays.push(today);
  if (!state.flashcardConfidence[currentCard]) {
    state.flashcardConfidence[currentCard] = { confidence: 0, lastReviewed: today };
  }
  state.flashcardConfidence[currentCard].lastReviewed = today;
  saveState();
}

// ────────────────────────────────────────────────────────────────
//  RENDER: PBQ
// ────────────────────────────────────────────────────────────────

function populatePbqSelect() {
  const sel = document.querySelector("#pbqScenarioSelect");
  sel.innerHTML = pbqScenarios.map((s, i) => `<option value="${i}">${s.title}</option>`).join("");
  sel.value = currentPbqScenario;
}

function renderPbq() {
  const scenario = pbqScenarios[currentPbqScenario];
  document.querySelector("#pbqEyebrow").textContent = `Scenario ${currentPbqScenario + 1} of ${pbqScenarios.length}`;
  document.querySelector("#pbqTitle").textContent = scenario.title;
  document.querySelector("#pbqDescription").textContent = scenario.description;
  document.querySelector("#pbqStrategy").innerHTML = scenario.strategy.map(s => `<li>${s}</li>`).join("");

  const table = document.querySelector("#pbqTable");
  table.innerHTML = scenario.items.map((item, index) => `
    <label class="pbq-row">
      <span>${item.item}</span>
      <select data-index="${index}" aria-label="Choice for ${item.item}">
        <option value="">Choose...</option>
        ${scenario.zones.map((zone) => `<option value="${zone}">${zone}</option>`).join("")}
      </select>
    </label>
  `).join("");

  document.querySelectorAll("#pbqTable select").forEach((select) => {
    select.addEventListener("change", updatePbqScore);
  });
  document.querySelector("#pbqScore").textContent = `0/${scenario.items.length}`;
  document.querySelector("#pbqFeedback").textContent = "";
}

function updatePbqScore() {
  const scenario = pbqScenarios[currentPbqScenario];
  const score = [...document.querySelectorAll("#pbqTable select")].filter(
    (select) => scenario.items[Number(select.dataset.index)].answer === select.value
  ).length;
  document.querySelector("#pbqScore").textContent = `${score}/${scenario.items.length}`;
}

function gradePbq() {
  const scenario = pbqScenarios[currentPbqScenario];
  const score = [...document.querySelectorAll("#pbqTable select")].filter(
    (select) => scenario.items[Number(select.dataset.index)].answer === select.value
  ).length;
  const feedback = document.querySelector("#pbqFeedback");

  state.pbqScores.push({ ts: Date.now(), scenario: scenario.id, score, total: scenario.items.length });
  saveState();

  if (score === scenario.items.length) {
    feedback.textContent = scenario.perfectFeedback;
  } else {
    feedback.textContent = scenario.partialFeedback.replace("{score}", score);
  }
}

// ────────────────────────────────────────────────────────────────
//  RENDER: LAB
// ────────────────────────────────────────────────────────────────

function populateLabSelect() {
  const sel = document.querySelector("#labScenarioSelect");
  sel.innerHTML = labScenarios.map((s, i) => `<option value="${i}">${s.title}</option>`).join("");
  sel.value = currentLabScenario;
}

function renderLabChecklist() {
  const scenario = labScenarios[currentLabScenario];
  document.querySelector("#labEyebrow").textContent = scenario.eyebrow;
  document.querySelector("#labTitle").textContent = scenario.title;
  document.querySelector("#labStatus").textContent = scenario.status;
  document.querySelector("#labDescription").textContent = scenario.description;
  document.querySelector("#labEvidence").innerHTML = scenario.evidence.map(e => `<li>${e}</li>`).join("");

  const checklist = document.querySelector("#labChecklist");
  checklist.innerHTML = "";
  scenario.actions.forEach((action, index) => {
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
  document.querySelector("#labScore").textContent = `0/${scenario.totalCorrect}`;
  document.querySelector("#labFeedback").textContent = "";
}

function selectedLabActions() {
  return [...document.querySelectorAll("#labChecklist input:checked")].map((input) => Number(input.dataset.index));
}

function updateLabScore() {
  const scenario = labScenarios[currentLabScenario];
  const selected = selectedLabActions();
  const correctSelected = selected.filter((index) => scenario.actions[index].correct).length;
  document.querySelector("#labScore").textContent = `${correctSelected}/${scenario.totalCorrect}`;
}

function gradeLab() {
  const scenario = labScenarios[currentLabScenario];
  const selected = selectedLabActions();
  const correctSelected = selected.filter((index) => scenario.actions[index].correct).length;
  const incorrectSelected = selected.filter((index) => !scenario.actions[index].correct).length;
  const missed = scenario.actions.filter((action, index) => action.correct && !selected.includes(index)).length;
  const score = Math.max(0, correctSelected - incorrectSelected);
  const feedback = document.querySelector("#labFeedback");

  state.labScores.push({ ts: Date.now(), scenario: scenario.id, score, total: scenario.totalCorrect });
  saveState();

  if (score === scenario.totalCorrect && missed === 0) {
    feedback.textContent = scenario.perfectFeedback;
  } else {
    feedback.textContent = scenario.partialFeedback.replace("{score}", score);
  }
}

// ────────────────────────────────────────────────────────────────
//  MOCK EXAM
// ────────────────────────────────────────────────────────────────

function renderExamStart() {
  document.querySelector("#examStart").style.display = "";
  document.querySelector("#examActive").style.display = "none";
  document.querySelector("#examResults").style.display = "none";

  const historyEl = document.querySelector("#examHistory");
  if (state.examResults.length === 0) {
    historyEl.innerHTML = "<p>No previous exams. Take your first mock exam above.</p>";
  } else {
    historyEl.innerHTML = state.examResults.slice().reverse().map((exam, i) => {
      const date = new Date(exam.ts).toLocaleDateString();
      const passLabel = exam.passed ? '<span style="color:var(--success)">PASS</span>' : '<span style="color:var(--danger)">FAIL</span>';
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border)">
        <span>${date} — ${exam.total} questions</span>
        <span>${exam.score}/${exam.total} (${exam.percentage}%) ${passLabel}</span>
      </div>`;
    }).join("");
  }
}

function startExam(count, isQuick) {
  examState.isQuickExam = isQuick;
  examState.active = true;
  examState.currentIndex = 0;
  examState.correct = 0;
  examState.answers = [];

  // Build question list
  let pool = [...questionBank];
  // Quick exam: focus on weak areas
  if (isQuick) {
    const weakIds = getWeakAreaQuestionIds();
    if (weakIds && weakIds.length >= count) {
      pool = weakIds.map(id => questionBank[id]);
    }
  }
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  examState.questions = pool.slice(0, count);
  examState.answers = new Array(count).fill(null);

  examState.timeRemaining = 90 * 60; // 90 minutes in seconds
  if (isQuick) examState.timeRemaining = 25 * 60; // 25 min for quick

  document.querySelector("#examStart").style.display = "none";
  document.querySelector("#examActive").style.display = "";
  document.querySelector("#examResults").style.display = "none";

  renderExamQuestion();
  startExamTimer();
}

function startExamTimer() {
  if (examState.timer) clearInterval(examState.timer);
  examState.timer = setInterval(() => {
    examState.timeRemaining--;
    const min = Math.floor(examState.timeRemaining / 60);
    const sec = examState.timeRemaining % 60;
    document.querySelector("#examTimer").textContent = `${min}:${sec.toString().padStart(2, "0")}`;

    if (examState.timeRemaining <= 0) {
      clearInterval(examState.timer);
      finishExam();
    }
  }, 1000);
}

function renderExamQuestion() {
  const q = examState.questions[examState.currentIndex];
  const total = examState.questions.length;
  document.querySelector("#examCounter").textContent = `Question ${examState.currentIndex + 1} / ${total}`;
  document.querySelector("#examQuestionCounter").textContent = `${examState.currentIndex + 1} / ${total}`;
  document.querySelector("#examQuestionObj").textContent = q.objective;
  document.querySelector("#examQuestionDomain").textContent = q.domain;
  document.querySelector("#examQuestionText").textContent = q.text;
  document.querySelector("#examExplanation").textContent = examState.answers[examState.currentIndex] !== null ? q.explanation : "Choose an answer to see the explanation.";
  document.querySelector("#examScoreDisplay").textContent = `${examState.correct}/${examState.currentIndex}`;

  const answersEl = document.querySelector("#examAnswers");
  answersEl.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.textContent = answer;

    if (examState.answers[examState.currentIndex] !== null) {
      button.disabled = true;
      button.classList.toggle("correct", index === q.correct);
      button.classList.toggle("incorrect", index === examState.answers[examState.currentIndex] && index !== q.correct);
    } else {
      button.addEventListener("click", () => examChooseAnswer(index));
    }
    answersEl.appendChild(button);
  });
}

function examChooseAnswer(index) {
  const q = examState.questions[examState.currentIndex];
  examState.answers[examState.currentIndex] = index;
  if (index === q.correct) examState.correct++;

  // Also record to quiz results
  state.quizResults.push({ id: q.id, correct: index === q.correct, ts: Date.now() });
  saveState();

  const answersEl = document.querySelector("#examAnswers");
  const buttons = answersEl.querySelectorAll(".answer-button");
  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;
    button.classList.toggle("correct", buttonIndex === q.correct);
    button.classList.toggle("incorrect", buttonIndex === index && index !== q.correct);
  });

  document.querySelector("#examExplanation").textContent = q.explanation;
  document.querySelector("#examScoreDisplay").textContent = `${examState.correct}/${examState.currentIndex + 1}`;
}

function finishExam() {
  if (examState.timer) clearInterval(examState.timer);
  examState.active = false;

  const total = examState.questions.length;
  // Count answered
  const answered = examState.answers.filter(a => a !== null).length;
  const correct = examState.correct;
  const percentage = Math.round((correct / total) * 100);
  // CompTIA scale: 100-900, passing 750 ≈ 83%
  const scaledScore = Math.round(100 + (correct / total) * 800);
  const passed = scaledScore >= 750;

  // Save exam result
  state.examResults.push({
    ts: Date.now(),
    total,
    answered,
    correct,
    percentage,
    scaledScore,
    passed,
    isQuick: examState.isQuickExam,
    domainBreakdown: computeExamDomainBreakdown(),
  });
  saveState();

  // Show results
  document.querySelector("#examActive").style.display = "none";
  document.querySelector("#examResults").style.display = "";

  document.querySelector("#examResultScore").textContent = `${percentage}% (${scaledScore}/900)`;
  document.querySelector("#examResultScore").style.color = passed ? "var(--success)" : "var(--danger)";
  document.querySelector("#examResultPassFail").textContent = passed ? "✓ PASSED" : "✗ FAILED (Need 750/900)";
  document.querySelector("#examResultPassFail").style.color = passed ? "var(--success)" : "var(--danger)";
  document.querySelector("#examResultDetails").textContent = `${correct} correct out of ${total} questions answered`;

  // Domain breakdown
  const breakdown = computeExamDomainBreakdown();
  document.querySelector("#examDomainBreakdown").innerHTML = `
    <p class="eyebrow">Per-Domain Breakdown</p>
    ${domainMap.map((d, i) => {
      const bd = breakdown[i] || { correct: 0, total: 0 };
      return `<div style="display:flex;justify-content:space-between;padding:0.3rem 0;border-bottom:1px solid var(--border)">
        <span>${d.name}</span>
        <span>${bd.correct}/${bd.total}</span>
      </div>`;
    }).join("")}
  `;
}

function computeExamDomainBreakdown() {
  return domainMap.map((d) => {
    let correct = 0, total = 0;
    examState.questions.forEach((q, i) => {
      if (d.objectives.includes(q.objective)) {
        total++;
        if (examState.answers[i] === q.correct) correct++;
      }
    });
    return { correct, total };
  });
}

// ────────────────────────────────────────────────────────────────
//  RENDER: PROGRESS
// ────────────────────────────────────────────────────────────────

function renderProgress() {
  const heatmap = computeHeatmap();
  document.querySelector("#heatmap").innerHTML = heatmap.map(h =>
    `<div class="heat-cell ${h.cls}" title="${h.pct}% mastered">${h.label}</div>`
  ).join("");

  const markup = state.notes.map((note) => `<li>${note}</li>`).join("");
  const dashNotes = document.querySelector("#dashboardNotes");
  const notesList = document.querySelector("#notesList");
  if (dashNotes) dashNotes.innerHTML = markup;
  if (notesList) notesList.innerHTML = markup;

  const domains = computeDomainProgress();
  document.querySelector("#domainRings").innerHTML = domains.map(d => `
    <div class="domain-ring">
      <div class="mini-ring" style="--value:${d.progress}"><span>${d.progress}%</span></div>
      <small>${d.short}</small>
    </div>
  `).join("");
}

function renderNotes() {
  const markup = state.notes.map((note) => `<li>${note}</li>`).join("");
  const dashNotes = document.querySelector("#dashboardNotes");
  const notesList = document.querySelector("#notesList");
  if (dashNotes) dashNotes.innerHTML = markup;
  if (notesList) notesList.innerHTML = markup;
}

// ────────────────────────────────────────────────────────────────
//  RENDER: SETTINGS
// ────────────────────────────────────────────────────────────────

function renderSettings() {
  const statsEl = document.querySelector("#settingsStats");
  if (statsEl) {
    const flashReviewed = Object.keys(state.flashcardConfidence).length;
    statsEl.innerHTML = `
      <div><strong>${state.quizResults.length}</strong> Questions answered</div>
      <div><strong>${state.quizSessions.length}</strong> Sessions completed</div>
      <div><strong>${state.examResults.length}</strong> Exams completed</div>
      <div><strong>${flashReviewed}</strong> Flashcards reviewed</div>
    `;
  }
}

function exportProgress() {
  const today = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `secplus-progress-${today}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      const base = defaultState();
      state = { ...base, ...imported };
      // Ensure arrays
      for (const key of ["quizResults", "quizSessions", "labScores", "pbqScores", "streakDays", "reviewQueue", "examResults"]) {
        if (!Array.isArray(state[key])) state[key] = [];
      }
      saveState();
      renderDashboard();
      renderSettings();
      alert("Progress imported successfully.");
    } catch {
      alert("Invalid file. Please select a valid progress JSON file.");
    }
  };
  reader.readAsText(file);
}

function resetProgress() {
  if (!confirm("This will permanently delete all your study progress. Are you sure?")) return;
  if (!confirm("Really delete everything? This cannot be undone.")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  saveState();
  currentQuestion = 0;
  sessionCorrect = 0;
  sessionAnswered = 0;
  renderDashboard();
  renderQuestion();
  renderSettings();
  renderProgress();
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

// Quiz navigation
document.querySelector("#nextQuestion").addEventListener("click", () => {
  if (reviewingWeakAreas) {
    const ids = getWeakAreaQuestionIds();
    if (ids && ids.length > 0) {
      currentQuestion = ids[Math.floor(Math.random() * ids.length)];
    } else {
      reviewingWeakAreas = false;
      currentQuestion = (currentQuestion + 1) % questionBank.length;
    }
  } else {
    currentQuestion = (currentQuestion + 1) % questionBank.length;
  }
  renderQuestion();
});

document.querySelector("#reviewQuestion").addEventListener("click", () => {
  const tid = Math.floor(questionBank[currentQuestion].id / 4);
  if (!state.reviewQueue.includes(tid)) {
    state.reviewQueue.push(tid);
    saveState();
  }
  document.querySelector("#explanation").textContent = "Saved to review queue. Use 'Review Weak Areas' to practice these questions.";
});

document.querySelector("#randomQuestion").addEventListener("click", () => {
  reviewingWeakAreas = false;
  currentQuestion = Math.floor(Math.random() * questionBank.length);
  renderQuestion();
});

document.querySelector("#resetQuiz").addEventListener("click", () => {
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
  reviewingWeakAreas = false;
  currentQuestion = 0;
  renderQuestion();
});

document.querySelector("#reviewWeakAreas").addEventListener("click", () => {
  const ids = getWeakAreaQuestionIds();
  if (!ids || ids.length === 0) {
    alert("No weak areas found. Answer some questions first!");
    return;
  }
  reviewingWeakAreas = true;
  currentQuestion = ids[Math.floor(Math.random() * ids.length)];
  sessionCorrect = 0;
  sessionAnswered = 0;
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

// PBQ
populatePbqSelect();
document.querySelector("#pbqScenarioSelect").addEventListener("change", (e) => {
  currentPbqScenario = Number(e.target.value);
  renderPbq();
});
document.querySelector("#showPbqHint").addEventListener("click", () => {
  const scenario = pbqScenarios[currentPbqScenario];
  document.querySelector("#pbqFeedback").textContent = scenario.hint;
});
document.querySelector("#gradePbq").addEventListener("click", gradePbq);
document.querySelector("#resetPbq").addEventListener("click", () => renderPbq());

// Lab
populateLabSelect();
document.querySelector("#labScenarioSelect").addEventListener("change", (e) => {
  currentLabScenario = Number(e.target.value);
  renderLabChecklist();
});
document.querySelector("#showHint").addEventListener("click", () => {
  const scenario = labScenarios[currentLabScenario];
  document.querySelector("#labFeedback").textContent = scenario.hint;
});
document.querySelector("#gradeLab").addEventListener("click", gradeLab);
document.querySelector("#resetLab").addEventListener("click", () => renderLabChecklist());

// Exams
document.querySelector("#startExam").addEventListener("click", () => startExam(90, false));
document.querySelector("#startQuickExam").addEventListener("click", () => startExam(25, true));
document.querySelector("#examNext").addEventListener("click", () => {
  if (examState.currentIndex < examState.questions.length - 1) {
    examState.currentIndex++;
    renderExamQuestion();
  } else {
    finishExam();
  }
});
document.querySelector("#examFinish").addEventListener("click", () => finishExam());
document.querySelector("#examBackToStart").addEventListener("click", () => renderExamStart());

// Settings
document.querySelector("#exportProgress").addEventListener("click", exportProgress);
document.querySelector("#importProgress").addEventListener("change", (e) => {
  if (e.target.files[0]) importProgress(e.target.files[0]);
});
document.querySelector("#resetProgress").addEventListener("click", resetProgress);

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
renderPbq();
renderLabChecklist();
renderNotes();
renderSettings();
applyTheme(localStorage.getItem("securityPlusTheme") || "light");
