const domains = [
  { name: "Threats, Attacks, and Vulnerabilities", short: "Threats", progress: 82 },
  { name: "Security Architecture", short: "Architecture", progress: 75 },
  { name: "Security Implementation", short: "Implementation", progress: 68 },
  { name: "Security Operations", short: "Operations", progress: 71 },
  { name: "Security Program Management and Oversight", short: "Governance", progress: 64 },
];

const studyPlanItems = [
  { title: "2.1 Secure Architecture Concepts", time: "20 min", done: true },
  { title: "2.2 Security Models", time: "20 min", done: true },
  { title: "2.3 Security Solutions", time: "30 min", done: false },
  { title: "2.4 Resilience and High Availability", time: "20 min", done: false },
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
  ["3.8", "data", "A company must keep customer records within a specific country.", "Data sovereignty", ["Data masking", "Data tokenization", "Data deduplication"], "Data sovereignty concerns legal and regulatory control based on where data is stored or processed."],
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

const heatmapItems = [
  ["1.1 Controls", "heat-high"],
  ["2.2 Threat Vectors", "heat-high"],
  ["2.4 Indicators", "heat-mid"],
  ["3.1 Architecture", "heat-mid"],
  ["3.4 IAM", "heat-high"],
  ["4.2 Monitoring", "heat-high"],
  ["4.4 Incident Response", "heat-low"],
  ["5.2 Risk", "heat-low"],
];

const studyNotes = [
  "Contain first, then eradicate and recover. Preserve evidence before destructive actions.",
  "RPO is acceptable data loss measured in time. RTO is acceptable restoration time.",
  "RBAC maps permissions to job roles. ABAC evaluates attributes like user, device, action, and location.",
  "Tokenization replaces sensitive data with lookup tokens. Masking hides part of the value for display.",
  "ALE = SLE x ARO. SLE includes asset value and exposure factor.",
];

let currentQuestion = 0;
let answeredCount = 0;
let correctCount = 0;
let currentCard = 0;
let cardFlipped = false;

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
}

function renderDomains() {
  document.querySelector("#domainList").innerHTML = domains
    .map(
      (domain, index) => `
        <div class="domain-row">
          <div class="domain-top">
            <span>${index + 1}. ${domain.name}</span>
            <span>${domain.progress}%</span>
          </div>
          <div class="progress-track" aria-hidden="true"><span style="width:${domain.progress}%"></span></div>
        </div>
      `,
    )
    .join("");

  document.querySelector("#domainRings").innerHTML = domains
    .map(
      (domain) => `
        <div class="domain-ring">
          <div class="mini-ring" style="--value:${domain.progress}"><span>${domain.progress}%</span></div>
          <small>${domain.short}</small>
        </div>
      `,
    )
    .join("");
}

function renderStudyPlan() {
  const markup = studyPlanItems
    .map(
      (item, index) => `
        <li>
          <label>
            <input type="checkbox" ${item.done ? "checked" : ""} />
            <span>${index + 1}. ${item.title}</span>
          </label>
          <span>${item.time}</span>
        </li>
      `,
    )
    .join("");

  document.querySelector("#dashboardStudyPlan").innerHTML = markup;
  document.querySelector("#studyPlanList").innerHTML = markup;
}

function renderQuestion() {
  const question = questionBank[currentQuestion];
  document.querySelector("#questionCounter").textContent = `Question ${currentQuestion + 1} of ${questionBank.length}`;
  document.querySelector("#questionObjective").textContent = question.objective;
  document.querySelector("#questionDomain").textContent = question.domain;
  document.querySelector("#questionText").textContent = question.text;
  document.querySelector("#explanation").textContent = "Choose an answer to reveal the explanation.";
  document.querySelector("#quizScore").textContent = `${correctCount}/${answeredCount || 0}`;

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

  answeredCount += 1;
  if (index === question.correct) correctCount += 1;

  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;
    button.classList.toggle("correct", buttonIndex === question.correct);
    button.classList.toggle("incorrect", buttonIndex === index && index !== question.correct);
  });

  document.querySelector("#quizScore").textContent = `${correctCount}/${answeredCount}`;
  document.querySelector("#explanation").textContent = question.explanation;
}

function renderFlashcard() {
  const card = flashcards[currentCard];
  document.querySelector("#flashcardType").textContent = card.type;
  document.querySelector("#flashcardFront").textContent = card.front;
  document.querySelector("#flashcardBack").textContent = cardFlipped ? card.back : "";
  document.querySelector("#flashcardProgress").textContent = `${currentCard + 1}/${flashcards.length}`;
}

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

function renderPbq() {
  const table = document.querySelector("#pbqTable");
  table.innerHTML = pbqItems
    .map(
      (item, index) => `
        <label class="pbq-row">
          <span>${item.item}</span>
          <select data-index="${index}" aria-label="Zone for ${item.item}">
            <option value="">Choose zone</option>
            ${pbqZones.map((zone) => `<option value="${zone}">${zone}</option>`).join("")}
          </select>
        </label>
      `,
    )
    .join("");

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
  if (score === 4) {
    feedback.textContent = "Perfect. Public services are isolated, admin access is controlled through a jump server, and internal services stay protected.";
    return;
  }
  feedback.textContent = `Score: ${score}/4. Recheck public exposure, administrative access paths, and which services should remain internal.`;
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

  if (score === 4 && missed === 0) {
    feedback.textContent =
      "Excellent containment. You revoked access, reset authentication, preserved evidence, and removed the forwarding rule before recovery.";
    return;
  }

  feedback.textContent = `Score: ${score}/4. Strong incident response preserves evidence and contains the identity first. Avoid destructive recovery before evidence collection.`;
}

function renderHeatmap() {
  document.querySelector("#heatmap").innerHTML = heatmapItems.map(([label, className]) => `<div class="heat-cell ${className}">${label}</div>`).join("");
}

function renderNotes() {
  const markup = studyNotes.map((note) => `<li>${note}</li>`).join("");
  document.querySelector("#dashboardNotes").innerHTML = markup;
  document.querySelector("#notesList").innerHTML = markup;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("securityPlusTheme", theme);
  themeToggle.checked = theme === "dark";
  document.querySelector("#themeStatus").textContent = theme === "dark" ? "Dark mode enabled" : "Light mode enabled";
}

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
  answeredCount = 0;
  correctCount = 0;
  currentQuestion = 0;
  renderQuestion();
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
  });
});

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
  currentCard = (currentCard + 1) % flashcards.length;
  cardFlipped = false;
  renderFlashcard();
});

document.querySelector("#prevCard").addEventListener("click", () => {
  currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
  cardFlipped = false;
  renderFlashcard();
});

document.querySelector("#showHint").addEventListener("click", () => {
  document.querySelector("#labFeedback").textContent =
    "Hint: Contain the compromised identity, preserve evidence, and remove persistence. Avoid destructive recovery before evidence collection.";
});

document.querySelector("#gradeLab").addEventListener("click", gradeLab);

document.querySelector("#resetLab").addEventListener("click", () => {
  renderLabChecklist();
  document.querySelector("#labFeedback").textContent = "Lab reset. Select the containment actions you would take first.";
});

document.querySelector("#gradePbq").addEventListener("click", gradePbq);

document.querySelector("#showPbqHint").addEventListener("click", () => {
  document.querySelector("#pbqFeedback").textContent = "Hint: Internet-facing systems need isolation. Administrative access should pass through a hardened control point.";
});

document.querySelector("#resetPbq").addEventListener("click", () => {
  renderPbq();
  document.querySelector("#pbqFeedback").textContent = "PBQ reset. Choose a zone for each service, then grade your configuration.";
});

themeToggle.addEventListener("change", () => {
  applyTheme(themeToggle.checked ? "dark" : "light");
});

document.querySelector("#bankSize").textContent = questionBank.length;
document.querySelector("#practiceBankSize").textContent = questionBank.length;
renderDomains();
renderStudyPlan();
renderQuestion();
renderFlashcard();
renderLabChecklist();
renderPbq();
renderHeatmap();
renderNotes();
applyTheme(localStorage.getItem("securityPlusTheme") || "light");
document.querySelector("#labFeedback").textContent = "Select actions, use a hint if needed, then submit the lab for a debrief.";
document.querySelector("#pbqFeedback").textContent = "Choose a zone for each service, then grade your configuration.";
