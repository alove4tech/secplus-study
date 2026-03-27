export type Domain = {
  id: string;
  name: string;
  weight: string;
  description: string;
};

export type Flashcard = {
  id: number;
  domain: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  front: string;
  back: string;
};

export type Question = {
  id: number;
  domain: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type PbqScenario = {
  id: number;
  domain: string;
  topic: string;
  title: string;
  scenario: string;
  prompt: string;
  tasks: string[];
  solution: string[];
};

export const secPlusDomains: Domain[] = [
  {
    id: "general-security-concepts",
    name: "General Security Concepts",
    weight: "12%",
    description: "Core principles, security controls, resilience, and identity fundamentals.",
  },
  {
    id: "threats-vulnerabilities-mitigations",
    name: "Threats, Vulnerabilities, and Mitigations",
    weight: "22%",
    description: "Threat actors, attacks, weaknesses, social engineering, and defensive measures.",
  },
  {
    id: "security-architecture",
    name: "Security Architecture",
    weight: "18%",
    description: "Secure design across networks, systems, cloud, applications, and enterprise environments.",
  },
  {
    id: "security-operations",
    name: "Security Operations",
    weight: "28%",
    description: "Monitoring, response, hardening, recovery, scanning, logging, and operational defense.",
  },
  {
    id: "security-program-management-and-oversight",
    name: "Security Program Management and Oversight",
    weight: "20%",
    description: "Governance, risk, training, policy, compliance, and lifecycle management.",
  },
];

export const flashcards: Flashcard[] = [
  { id: 1, domain: "general-security-concepts", topic: "foundations", difficulty: "easy", front: "What does CIA stand for in cybersecurity?", back: "Confidentiality, Integrity, and Availability." },
  { id: 2, domain: "general-security-concepts", topic: "iam", difficulty: "easy", front: "Authentication vs authorization", back: "Authentication verifies identity. Authorization determines access permissions." },
  { id: 3, domain: "general-security-concepts", topic: "foundations", difficulty: "medium", front: "What is non-repudiation?", back: "Assurance that someone cannot credibly deny an action they performed." },
  { id: 4, domain: "general-security-concepts", topic: "iam", difficulty: "easy", front: "What is multifactor authentication?", back: "Authentication using at least two different factor types, such as password plus authenticator app." },
  { id: 5, domain: "general-security-concepts", topic: "iam", difficulty: "easy", front: "What is least privilege?", back: "Giving users and systems only the access required to perform their tasks." },
  { id: 6, domain: "general-security-concepts", topic: "governance", difficulty: "easy", front: "What is an acceptable use policy?", back: "A policy that defines how users are allowed to use company systems and resources." },
  { id: 7, domain: "threats-vulnerabilities-mitigations", topic: "social-engineering", difficulty: "easy", front: "Phishing vs spear phishing", back: "Phishing is broad and mass-sent. Spear phishing is tailored to a specific target." },
  { id: 8, domain: "threats-vulnerabilities-mitigations", topic: "vulnerabilities", difficulty: "medium", front: "What is a zero-day vulnerability?", back: "A vulnerability with no vendor patch available at the time it is discovered or exploited." },
  { id: 9, domain: "threats-vulnerabilities-mitigations", topic: "physical-security", difficulty: "easy", front: "What is tailgating?", back: "An unauthorized person follows an authorized person into a restricted area." },
  { id: 10, domain: "threats-vulnerabilities-mitigations", topic: "identity-attacks", difficulty: "medium", front: "What is credential stuffing?", back: "Using leaked username/password pairs to try logging into other services." },
  { id: 11, domain: "threats-vulnerabilities-mitigations", topic: "vulnerabilities", difficulty: "hard", front: "What is a buffer overflow?", back: "When more data is written to memory than allocated, potentially causing crashes or code execution." },
  { id: 12, domain: "threats-vulnerabilities-mitigations", topic: "application-security", difficulty: "medium", front: "What is input validation used for?", back: "To ensure incoming data is safe and expected, helping prevent attacks such as injection." },
  { id: 13, domain: "security-architecture", topic: "network-security", difficulty: "easy", front: "What is network segmentation?", back: "Dividing a network into smaller zones to reduce lateral movement and improve control." },
  { id: 14, domain: "security-architecture", topic: "network-security", difficulty: "easy", front: "What does a firewall do?", back: "Filters traffic according to configured rules, allowing or blocking communications." },
  { id: 15, domain: "security-architecture", topic: "cryptography", difficulty: "medium", front: "Symmetric vs asymmetric encryption", back: "Symmetric uses one shared key. Asymmetric uses a public/private key pair." },
  { id: 16, domain: "security-architecture", topic: "network-security", difficulty: "medium", front: "What is a DMZ?", back: "A network segment that hosts externally accessible systems while isolating them from the internal network." },
  { id: 17, domain: "security-architecture", topic: "iam", difficulty: "easy", front: "What is single sign-on?", back: "An authentication approach that lets a user access multiple systems after signing in once." },
  { id: 18, domain: "security-architecture", topic: "data-protection", difficulty: "medium", front: "What is tokenization?", back: "Replacing sensitive data with a non-sensitive token that maps back to the original value." },
  { id: 19, domain: "security-operations", topic: "monitoring", difficulty: "easy", front: "What is a SIEM used for?", back: "Aggregating and analyzing logs and events to support detection and investigation." },
  { id: 20, domain: "security-operations", topic: "incident-response", difficulty: "easy", front: "Containment in incident response", back: "Actions taken to limit the spread and impact of an incident." },
  { id: 21, domain: "security-operations", topic: "vulnerability-management", difficulty: "medium", front: "Vulnerability scan vs penetration test", back: "Scans identify weaknesses automatically; penetration tests actively attempt exploitation." },
  { id: 22, domain: "security-operations", topic: "incident-response", difficulty: "easy", front: "What is eradication?", back: "The incident response phase focused on removing malware, persistence, or root cause." },
  { id: 23, domain: "security-operations", topic: "hardening", difficulty: "medium", front: "What is a baseline?", back: "A known-good configuration or performance reference used for comparison." },
  { id: 24, domain: "security-operations", topic: "incident-response", difficulty: "medium", front: "What is a playbook?", back: "A documented set of steps for responding to a recurring security event or incident." },
  { id: 25, domain: "security-program-management-and-oversight", topic: "training", difficulty: "easy", front: "Purpose of security awareness training", back: "To reduce human risk by teaching users how to recognize and respond to threats." },
  { id: 26, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "easy", front: "Risk acceptance vs avoidance", back: "Acceptance means keeping a risk; avoidance means stopping the risky activity altogether." },
  { id: 27, domain: "security-program-management-and-oversight", topic: "governance", difficulty: "medium", front: "What is due diligence?", back: "The ongoing effort to monitor and review security practices and decisions." },
  { id: 28, domain: "security-program-management-and-oversight", topic: "governance", difficulty: "easy", front: "Policy vs procedure", back: "Policy defines high-level intent; procedure gives step-by-step instructions." },
  { id: 29, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "medium", front: "What is risk transfer?", back: "Shifting financial or operational impact to a third party, often through insurance or contracts." },
  { id: 30, domain: "security-program-management-and-oversight", topic: "data-protection", difficulty: "easy", front: "What is data classification?", back: "Categorizing data by sensitivity and required protection level." },
  { id: 31, domain: "security-architecture", topic: "cloud-security", difficulty: "medium", front: "What is the shared responsibility model?", back: "A cloud model where the provider secures some layers and the customer secures others depending on the service type." },
  { id: 32, domain: "security-operations", topic: "resilience", difficulty: "medium", front: "Recovery Time Objective (RTO)", back: "The target maximum time a system can be down before service is restored." },
  { id: 33, domain: "security-operations", topic: "resilience", difficulty: "medium", front: "Recovery Point Objective (RPO)", back: "The maximum acceptable amount of data loss measured in time." },
  { id: 34, domain: "threats-vulnerabilities-mitigations", topic: "malware", difficulty: "easy", front: "Ransomware", back: "Malware that encrypts data or blocks access and demands payment for restoration." },
  { id: 35, domain: "security-architecture", topic: "wireless-security", difficulty: "medium", front: "WPA3", back: "A modern wireless security standard with stronger protections than earlier WPA versions." },
  { id: 36, domain: "general-security-concepts", topic: "foundations", difficulty: "medium", front: "What is an implicit deny?", back: "The default rule of denying access unless it is explicitly allowed." },
];

export const practiceQuestions: Question[] = [
  { id: 1, domain: "general-security-concepts", topic: "iam", difficulty: "easy", question: "A company requires employees to use a password and a time-based code from an authenticator app to access email. Which security concept is this implementing?", options: ["Federation", "Multifactor authentication", "Single sign-on", "Role-based access control"], answer: 1, explanation: "A password is one factor and an authenticator code is another, making this multifactor authentication." },
  { id: 2, domain: "general-security-concepts", topic: "controls", difficulty: "easy", question: "Which control type is primarily intended to discourage an attacker rather than directly stop them?", options: ["Deterrent", "Corrective", "Compensating", "Detective"], answer: 0, explanation: "Deterrent controls are intended to discourage unwanted behavior before it happens." },
  { id: 3, domain: "general-security-concepts", topic: "foundations", difficulty: "easy", question: "Which term describes the assurance that data has not been altered without authorization?", options: ["Availability", "Integrity", "Confidentiality", "Privacy"], answer: 1, explanation: "Integrity means information remains accurate and unmodified except by authorized changes." },
  { id: 4, domain: "general-security-concepts", topic: "iam", difficulty: "easy", question: "Which access control model assigns permissions based on job function?", options: ["RBAC", "MAC", "DAC", "ABAC"], answer: 0, explanation: "Role-Based Access Control assigns permissions according to a user's role or job function." },
  { id: 5, domain: "threats-vulnerabilities-mitigations", topic: "social-engineering", difficulty: "easy", question: "An attacker sends an email crafted specifically for the finance manager and references a real vendor invoice. What type of attack is this?", options: ["Pharming", "Spear phishing", "Whaling", "Tailgating"], answer: 1, explanation: "The attack is targeted and personalized, which is characteristic of spear phishing." },
  { id: 6, domain: "threats-vulnerabilities-mitigations", topic: "network-security", difficulty: "medium", question: "Which mitigation best reduces the impact of a compromised user account moving laterally through a network?", options: ["Network segmentation", "Open guest Wi-Fi", "Disable logging", "Shared administrator accounts"], answer: 0, explanation: "Segmentation restricts access paths and limits lateral movement between systems and zones." },
  { id: 7, domain: "threats-vulnerabilities-mitigations", topic: "identity-attacks", difficulty: "medium", question: "What is the best description of credential stuffing?", options: ["Sending malicious USB drives", "Using leaked passwords across multiple sites", "Physically following a user into a building", "Flooding a system with ping requests"], answer: 1, explanation: "Credential stuffing uses stolen username/password pairs to attempt logins on different services." },
  { id: 8, domain: "threats-vulnerabilities-mitigations", topic: "application-security", difficulty: "medium", question: "A developer fails to sanitize user-supplied input in a web form. Which risk is increased the most?", options: ["SQL injection", "Shoulder surfing", "Tailgating", "Watering-hole attack"], answer: 0, explanation: "Improper input handling can allow injection attacks, including SQL injection." },
  { id: 9, domain: "security-architecture", topic: "network-security", difficulty: "easy", question: "Which technology is designed to inspect and filter traffic between internal and external networks based on configured rules?", options: ["Hypervisor", "Firewall", "Load balancer", "Proxy chain"], answer: 1, explanation: "Firewalls inspect and allow or block traffic based on rules and policy." },
  { id: 10, domain: "security-architecture", topic: "cryptography", difficulty: "medium", question: "Which encryption approach typically uses a public key to encrypt data and a private key to decrypt it?", options: ["Hashing", "Tokenization", "Asymmetric encryption", "Symmetric encryption"], answer: 2, explanation: "Asymmetric encryption uses a public/private key pair." },
  { id: 11, domain: "security-architecture", topic: "network-security", difficulty: "easy", question: "What is the main purpose of a DMZ?", options: ["To store backups offline", "To isolate public-facing systems from the internal network", "To replace firewalls", "To increase CPU availability"], answer: 1, explanation: "A DMZ hosts public-facing resources while reducing direct exposure of the internal network." },
  { id: 12, domain: "security-architecture", topic: "iam", difficulty: "easy", question: "Which technology lets users authenticate once and access multiple systems without repeated logins?", options: ["MFA", "SSO", "VPN", "DLP"], answer: 1, explanation: "Single sign-on allows one authentication event to grant access to multiple systems." },
  { id: 13, domain: "security-operations", topic: "incident-response", difficulty: "easy", question: "During incident response, which phase focuses on removing malware and affected artifacts from systems?", options: ["Preparation", "Containment", "Eradication", "Lessons learned"], answer: 2, explanation: "Eradication is when the malicious artifacts and root cause are removed." },
  { id: 14, domain: "security-operations", topic: "monitoring", difficulty: "easy", question: "What is the main purpose of a SIEM?", options: ["To replace backups", "To physically secure server rooms", "To aggregate and analyze security logs", "To issue SSL certificates"], answer: 2, explanation: "A SIEM collects and correlates logs and security events for visibility and detection." },
  { id: 15, domain: "security-operations", topic: "vulnerability-management", difficulty: "medium", question: "Which of the following best describes a vulnerability scan?", options: ["A manual exploit campaign against all systems", "An automated assessment for known weaknesses", "A backup validation test", "A full disaster recovery exercise"], answer: 1, explanation: "Vulnerability scans are generally automated checks for known weaknesses and exposures." },
  { id: 16, domain: "security-operations", topic: "resilience", difficulty: "easy", question: "What should happen immediately after containment and eradication are complete?", options: ["Accept the risk", "Recovery", "Policy review only", "Terminate all user accounts"], answer: 1, explanation: "Recovery restores systems and operations to normal while monitoring for recurrence." },
  { id: 17, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "easy", question: "A company decides not to launch a risky public service because the security exposure is too high. Which risk response does this represent?", options: ["Accept", "Transfer", "Avoid", "Mitigate"], answer: 2, explanation: "Avoidance means eliminating the risky activity rather than taking it on." },
  { id: 18, domain: "security-program-management-and-oversight", topic: "governance", difficulty: "easy", question: "Which document typically defines management's high-level intent and security expectations?", options: ["Policy", "Procedure", "Playbook", "Runbook"], answer: 0, explanation: "Policies describe management intent and high-level requirements." },
  { id: 19, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "medium", question: "Which risk treatment shifts the financial burden of a loss to another entity?", options: ["Transfer", "Mitigate", "Accept", "Avoid"], answer: 0, explanation: "Risk transfer shifts the impact through insurance or contractual arrangements." },
  { id: 20, domain: "security-program-management-and-oversight", topic: "data-protection", difficulty: "easy", question: "What is the primary purpose of data classification?", options: ["To improve internet speed", "To group users by department", "To determine how information should be handled and protected", "To replace encryption"], answer: 2, explanation: "Data classification helps organizations apply appropriate handling and protection based on sensitivity." },
  { id: 21, domain: "security-architecture", topic: "cloud-security", difficulty: "medium", question: "In a public cloud IaaS model, which responsibility typically remains with the customer?", options: ["Physical data center security", "Hypervisor patching", "Guest OS hardening", "Power redundancy"], answer: 2, explanation: "In IaaS, the customer is typically responsible for hardening and maintaining the guest operating systems and workloads." },
  { id: 22, domain: "security-operations", topic: "hardening", difficulty: "medium", question: "Which action best supports system hardening?", options: ["Installing unnecessary services", "Using default passwords", "Removing unused software and services", "Disabling patching"], answer: 2, explanation: "Removing unnecessary software and services reduces attack surface and is a core hardening practice." },
  { id: 23, domain: "threats-vulnerabilities-mitigations", topic: "malware", difficulty: "easy", question: "Which type of malware most commonly encrypts files and demands payment?", options: ["Spyware", "Ransomware", "Rootkit", "Logic bomb"], answer: 1, explanation: "Ransomware encrypts or locks access to data and demands payment for recovery." },
  { id: 24, domain: "security-architecture", topic: "wireless-security", difficulty: "medium", question: "Which wireless security option is generally the strongest choice for modern enterprise Wi-Fi?", options: ["WEP", "WPA", "WPA2-TKIP", "WPA3"], answer: 3, explanation: "WPA3 is the strongest modern choice among these options." },
  { id: 25, domain: "general-security-concepts", topic: "foundations", difficulty: "medium", question: "What does implicit deny mean in access control?", options: ["All traffic is allowed by default", "Access is denied unless explicitly permitted", "Only admins are denied", "Deny rules are optional"], answer: 1, explanation: "Implicit deny means the default stance is to deny access unless something explicitly allows it." },
  { id: 26, domain: "security-program-management-and-oversight", topic: "training", difficulty: "easy", question: "What is the main goal of security awareness training?", options: ["To replace technical controls", "To reduce human-related risk", "To eliminate all incidents", "To automate audits"], answer: 1, explanation: "Awareness training helps reduce the human risk element by teaching safer behavior and recognition of threats." },
  { id: 27, domain: "security-operations", topic: "resilience", difficulty: "hard", question: "A business can tolerate losing up to four hours of data after a disaster. Which metric is this describing?", options: ["RTO", "RPO", "MTTR", "SLA"], answer: 1, explanation: "RPO is the maximum tolerable amount of data loss measured in time." },
  { id: 28, domain: "security-operations", topic: "resilience", difficulty: "hard", question: "A service must be restored within two hours after an outage. Which metric is this describing?", options: ["RTO", "RPO", "MTBF", "ALE"], answer: 0, explanation: "RTO is the target time to restore the service after disruption." },
  { id: 29, domain: "security-architecture", topic: "data-protection", difficulty: "medium", question: "Which method replaces sensitive values with a mapped non-sensitive substitute?", options: ["Hashing", "Tokenization", "Salting", "Masking memory"], answer: 1, explanation: "Tokenization substitutes sensitive data with tokens that map back to the original values." },
  { id: 30, domain: "threats-vulnerabilities-mitigations", topic: "physical-security", difficulty: "easy", question: "A user holds the door open for an unauthorized person who then enters a secure room. What is this called?", options: ["Shoulder surfing", "Tailgating", "Impersonation", "Eliciting"], answer: 1, explanation: "Tailgating is unauthorized entry by following an authorized person into a restricted area." },
  { id: 31, domain: "general-security-concepts", topic: "controls", difficulty: "medium", question: "Which control would be considered compensating?", options: ["A replacement control that provides similar protection when the primary control is not feasible", "A warning banner", "A security camera used only as a deterrent", "An annual training newsletter"], answer: 0, explanation: "Compensating controls are alternate protections used when the preferred control cannot be implemented." },
  { id: 32, domain: "general-security-concepts", topic: "iam", difficulty: "medium", question: "Which factor category does a fingerprint scanner represent?", options: ["Something you know", "Somewhere you are", "Something you have", "Something you are"], answer: 3, explanation: "Biometrics such as fingerprints are something you are." },
  { id: 33, domain: "threats-vulnerabilities-mitigations", topic: "social-engineering", difficulty: "medium", question: "An attacker calls the help desk pretending to be an executive and pressures staff to reset a password immediately. This is an example of:", options: ["Pretexting", "Shoulder surfing", "Jamming", "Smishing"], answer: 0, explanation: "Pretexting involves creating a believable story or identity to manipulate a victim." },
  { id: 34, domain: "threats-vulnerabilities-mitigations", topic: "application-security", difficulty: "hard", question: "Which vulnerability is most directly associated with unsanitized user input being interpreted as commands by a backend database?", options: ["Cross-site scripting", "SQL injection", "Buffer overflow", "Race condition"], answer: 1, explanation: "SQL injection occurs when unsanitized input is passed into database queries." },
  { id: 35, domain: "threats-vulnerabilities-mitigations", topic: "malware", difficulty: "medium", question: "Which malware type is specifically designed to hide its presence while maintaining privileged access?", options: ["Worm", "Ransomware", "Rootkit", "Adware"], answer: 2, explanation: "Rootkits are designed to hide and maintain privileged access." },
  { id: 36, domain: "security-architecture", topic: "network-security", difficulty: "medium", question: "What is the primary security benefit of VLANs?", options: ["Increase CPU speed", "Reduce broadcast domains and segment traffic", "Encrypt all traffic automatically", "Replace access control lists"], answer: 1, explanation: "VLANs logically segment network traffic and reduce broadcast scope." },
  { id: 37, domain: "security-architecture", topic: "cryptography", difficulty: "hard", question: "Which cryptographic function is intended to provide integrity verification rather than confidentiality?", options: ["Hashing", "Encryption", "Tokenization", "Steganography"], answer: 0, explanation: "Hashing is commonly used to verify integrity by detecting changes to data." },
  { id: 38, domain: "security-architecture", topic: "cloud-security", difficulty: "medium", question: "Which cloud model gives customers the least responsibility for underlying infrastructure management?", options: ["IaaS", "PaaS", "SaaS", "Colocation"], answer: 2, explanation: "SaaS generally leaves the least infrastructure responsibility to the customer." },
  { id: 39, domain: "security-architecture", topic: "wireless-security", difficulty: "medium", question: "Which feature helps prevent unauthorized devices from joining a wireless network by requiring certificate-based authentication?", options: ["WPS", "802.1X", "MAC flooding", "Port mirroring"], answer: 1, explanation: "802.1X supports strong authentication, commonly with certificates via EAP methods." },
  { id: 40, domain: "security-operations", topic: "monitoring", difficulty: "medium", question: "Which log source would be most useful for identifying repeated failed login attempts against cloud services?", options: ["HVAC logs", "Authentication logs", "Printer status logs", "UPS battery logs"], answer: 1, explanation: "Authentication logs are the primary source for tracking login success and failure patterns." },
  { id: 41, domain: "security-operations", topic: "incident-response", difficulty: "medium", question: "What is the main purpose of lessons learned after an incident?", options: ["To assign blame", "To improve future response and controls", "To eliminate backups", "To skip recovery testing"], answer: 1, explanation: "Lessons learned are meant to improve procedures, controls, and preparedness for future incidents." },
  { id: 42, domain: "security-operations", topic: "vulnerability-management", difficulty: "medium", question: "Why is credentialed scanning often more accurate than non-credentialed scanning?", options: ["It uses fewer network packets", "It can inspect systems from the inside with authorized access", "It disables logging", "It automatically patches systems"], answer: 1, explanation: "Credentialed scans can inspect local configuration and patch states more deeply using authorized access." },
  { id: 43, domain: "security-operations", topic: "hardening", difficulty: "medium", question: "Which practice best supports secure configuration management?", options: ["Making undocumented changes directly in production", "Using approved baselines and change control", "Allowing local admins to configure anything", "Disabling audits to improve performance"], answer: 1, explanation: "Secure configuration management relies on baselines, review, and controlled change processes." },
  { id: 44, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "medium", question: "What does annualized loss expectancy estimate?", options: ["The probability of password reuse", "The yearly expected financial loss from a risk", "The mean time to recovery", "The number of incidents per department"], answer: 1, explanation: "ALE estimates the expected yearly financial loss associated with a particular risk." },
  { id: 45, domain: "security-program-management-and-oversight", topic: "governance", difficulty: "medium", question: "Which document is most likely to contain step-by-step instructions for onboarding a new employee securely?", options: ["Policy", "Procedure", "Standard", "Guideline"], answer: 1, explanation: "Procedures contain detailed step-by-step instructions for performing tasks." },
  { id: 46, domain: "security-program-management-and-oversight", topic: "data-protection", difficulty: "medium", question: "Which control is most directly associated with preventing unauthorized disclosure of data on lost laptops?", options: ["Full-disk encryption", "Load balancing", "Port aggregation", "Network address translation"], answer: 0, explanation: "Full-disk encryption protects stored data if the device is lost or stolen." },
  { id: 47, domain: "security-program-management-and-oversight", topic: "training", difficulty: "easy", question: "Which metric would best show whether phishing awareness training is improving user behavior?", options: ["Decrease in phishing simulation click rate", "Increase in printer usage", "Lower CPU temperature", "Reduction in cable length"], answer: 0, explanation: "A lower click rate on phishing simulations indicates better user recognition and safer behavior." },
  { id: 48, domain: "general-security-concepts", topic: "foundations", difficulty: "medium", question: "Which principle assumes that no user or device should be inherently trusted just because it is on the internal network?", options: ["Shared responsibility", "Zero trust", "Defense in depth", "Allow by default"], answer: 1, explanation: "Zero trust assumes no implicit trust based solely on location or network position." },
  { id: 49, domain: "general-security-concepts", topic: "controls", difficulty: "easy", question: "Which control is designed to discover and record unwanted activity after or as it occurs?", options: ["Detective", "Deterrent", "Directive", "Compensating"], answer: 0, explanation: "Detective controls identify and record activity, such as logs, sensors, and monitoring systems." },
  { id: 50, domain: "general-security-concepts", topic: "foundations", difficulty: "medium", question: "Which concept best describes using multiple overlapping safeguards so that the failure of one control does not expose the entire environment?", options: ["Implicit deny", "Defense in depth", "Separation of duties", "Non-repudiation"], answer: 1, explanation: "Defense in depth relies on layered security controls so one failure does not collapse protection." },
  { id: 51, domain: "general-security-concepts", topic: "iam", difficulty: "medium", question: "Which access control model makes decisions based on labels and clearances rather than owner choice or job role?", options: ["DAC", "RBAC", "MAC", "ABAC"], answer: 2, explanation: "Mandatory Access Control uses centrally enforced labels and clearances." },
  { id: 52, domain: "general-security-concepts", topic: "iam", difficulty: "medium", question: "A company grants access to a file only if the user is in HR, is connecting from headquarters, and is using a managed device. Which model is this?", options: ["RBAC", "ABAC", "DAC", "MAC"], answer: 1, explanation: "Attribute-Based Access Control uses characteristics such as department, location, and device state." },
  { id: 53, domain: "general-security-concepts", topic: "controls", difficulty: "easy", question: "Which control is intended to restore systems to normal after an incident or failure?", options: ["Corrective", "Preventive", "Deterrent", "Directive"], answer: 0, explanation: "Corrective controls help restore systems or processes after something has gone wrong." },
  { id: 54, domain: "general-security-concepts", topic: "foundations", difficulty: "medium", question: "Which principle helps prevent fraud by ensuring that one person cannot complete all parts of a sensitive process alone?", options: ["Job rotation", "Separation of duties", "Least functionality", "Implicit allow"], answer: 1, explanation: "Separation of duties reduces risk by splitting critical tasks among multiple people." },
  { id: 55, domain: "general-security-concepts", topic: "iam", difficulty: "easy", question: "Which factor is represented by a smart card used with a badge reader?", options: ["Something you know", "Something you are", "Somewhere you are", "Something you have"], answer: 3, explanation: "A smart card is a possession factor, meaning something you have." },
  { id: 56, domain: "threats-vulnerabilities-mitigations", topic: "social-engineering", difficulty: "easy", question: "An attacker sends a fraudulent text message containing a malicious link. What type of attack is this?", options: ["Vishing", "Smishing", "Pharming", "Tailgating"], answer: 1, explanation: "Smishing is phishing conducted through SMS or text messages." },
  { id: 57, domain: "threats-vulnerabilities-mitigations", topic: "social-engineering", difficulty: "easy", question: "An attacker calls employees pretending to be technical support in order to steal their credentials. What is this called?", options: ["Smishing", "Vishing", "Watering-hole", "Jamming"], answer: 1, explanation: "Vishing is phishing or fraud conducted over voice calls." },
  { id: 58, domain: "threats-vulnerabilities-mitigations", topic: "malware", difficulty: "medium", question: "Which malware type is designed to replicate and spread across networks without requiring a user to run an infected file?", options: ["Trojan", "Worm", "Adware", "Logic bomb"], answer: 1, explanation: "A worm is self-replicating malware that spreads automatically across systems or networks." },
  { id: 59, domain: "threats-vulnerabilities-mitigations", topic: "malware", difficulty: "medium", question: "Which malware disguises itself as legitimate software in order to trick users into installing it?", options: ["Worm", "Trojan", "Rootkit", "Spyware"], answer: 1, explanation: "A Trojan pretends to be legitimate software while hiding malicious functionality." },
  { id: 60, domain: "threats-vulnerabilities-mitigations", topic: "vulnerabilities", difficulty: "medium", question: "What is the primary purpose of a patch management program?", options: ["To increase bandwidth", "To reduce known vulnerabilities by applying updates", "To disable logging", "To create backup media"], answer: 1, explanation: "Patch management reduces exposure to known vulnerabilities by applying vendor fixes and updates." },
  { id: 61, domain: "threats-vulnerabilities-mitigations", topic: "application-security", difficulty: "medium", question: "Which vulnerability commonly occurs when a web application includes untrusted input in a web page without proper output encoding?", options: ["Cross-site scripting", "Buffer overflow", "Directory traversal", "Race condition"], answer: 0, explanation: "Cross-site scripting occurs when untrusted content is rendered in a victim's browser." },
  { id: 62, domain: "threats-vulnerabilities-mitigations", topic: "application-security", difficulty: "hard", question: "An application allows a user to request ../../etc/passwd and returns sensitive files outside the intended folder. What is this vulnerability?", options: ["SQL injection", "Directory traversal", "Cross-site request forgery", "Integer overflow"], answer: 1, explanation: "Directory traversal abuses path handling to access files outside the allowed directory." },
  { id: 63, domain: "threats-vulnerabilities-mitigations", topic: "wireless-attacks", difficulty: "medium", question: "Which attack captures a legitimate wireless handshake so the attacker can attempt offline password cracking?", options: ["Evil twin", "Bluejacking", "Handshake capture", "Wardriving"], answer: 2, explanation: "Handshake capture collects wireless authentication exchanges for later offline password attacks." },
  { id: 64, domain: "threats-vulnerabilities-mitigations", topic: "wireless-attacks", difficulty: "medium", question: "An attacker sets up a rogue wireless access point that impersonates a trusted network to lure users into connecting. What is this called?", options: ["Evil twin", "Jamming", "WPS", "Beaconing"], answer: 0, explanation: "An evil twin is a rogue AP designed to look like a legitimate wireless network." },
  { id: 65, domain: "threats-vulnerabilities-mitigations", topic: "physical-security", difficulty: "easy", question: "Which attack involves secretly observing a user entering a password or PIN?", options: ["Tailgating", "Shoulder surfing", "Eliciting", "Spoofing"], answer: 1, explanation: "Shoulder surfing is observing a victim's screen, keyboard, or keypad to capture sensitive information." },
  { id: 66, domain: "threats-vulnerabilities-mitigations", topic: "identity-attacks", difficulty: "medium", question: "Which attack attempts to trick a user into providing a one-time MFA code during a fake login process?", options: ["MFA fatigue attack", "Credential stuffing", "Directory traversal", "Bluejacking"], answer: 0, explanation: "MFA-focused phishing or fatigue attacks attempt to capture or abuse temporary authentication approvals." },
  { id: 67, domain: "security-architecture", topic: "network-security", difficulty: "medium", question: "Which technology is commonly used to provide secure remote access by creating an encrypted tunnel over an untrusted network?", options: ["DLP", "VPN", "NAT", "VLAN"], answer: 1, explanation: "A VPN creates an encrypted tunnel for secure remote communications over untrusted networks." },
  { id: 68, domain: "security-architecture", topic: "network-security", difficulty: "medium", question: "Which control inspects traffic at a deeper level and can identify and block malicious patterns rather than simply allowing or denying by port and protocol?", options: ["Layer 2 switch", "IDS/IPS", "UPS", "Load balancer"], answer: 1, explanation: "An IDS/IPS can inspect traffic for attack signatures or suspicious behavior beyond basic port filtering." },
  { id: 69, domain: "security-architecture", topic: "cloud-security", difficulty: "medium", question: "Which cloud service model gives developers a managed environment to deploy code without managing the underlying OS?", options: ["IaaS", "PaaS", "SaaS", "On-premises"], answer: 1, explanation: "Platform as a Service provides a managed application platform while abstracting much of the infrastructure." },
  { id: 70, domain: "security-architecture", topic: "data-protection", difficulty: "medium", question: "Which technology helps prevent sensitive data from leaving the organization through email, web uploads, or removable media?", options: ["DLP", "NAC", "RAID", "NTP"], answer: 0, explanation: "Data Loss Prevention tools monitor and control the movement of sensitive data." },
  { id: 71, domain: "security-architecture", topic: "cryptography", difficulty: "medium", question: "What is the primary purpose of a digital certificate?", options: ["To compress files", "To bind a public key to an identity", "To replace multifactor authentication", "To encrypt entire hard drives"], answer: 1, explanation: "A digital certificate ties a public key to an entity's identity through a trusted issuer." },
  { id: 72, domain: "security-architecture", topic: "cryptography", difficulty: "hard", question: "Which public key infrastructure component is responsible for revoking certificates before they expire?", options: ["CSR", "CA", "HSM", "SAN"], answer: 1, explanation: "The certificate authority manages issuance and revocation of certificates within the PKI." },
  { id: 73, domain: "security-architecture", topic: "wireless-security", difficulty: "easy", question: "Which feature should generally be disabled because it is known to weaken wireless security and can be abused in brute-force attacks?", options: ["802.1X", "WPS", "WPA3", "EAP-TLS"], answer: 1, explanation: "Wi-Fi Protected Setup is often disabled because its PIN-based mechanisms have been abused." },
  { id: 74, domain: "security-architecture", topic: "secure-design", difficulty: "medium", question: "What is the main goal of network access control (NAC)?", options: ["To provide backup power", "To ensure devices meet security requirements before or while connecting", "To replace VLANs", "To issue digital certificates"], answer: 1, explanation: "NAC evaluates device compliance and can restrict or deny access to noncompliant systems." },
  { id: 75, domain: "security-architecture", topic: "secure-design", difficulty: "medium", question: "Which concept isolates critical workloads in separate execution environments to reduce the risk of one compromised process affecting others?", options: ["Sandboxing", "Overclocking", "Load balancing", "Port forwarding"], answer: 0, explanation: "Sandboxing isolates code or workloads to limit the damage if one environment is compromised." },
  { id: 76, domain: "security-architecture", topic: "network-security", difficulty: "hard", question: "Which DNS security enhancement uses digital signatures to help validate that DNS responses have not been tampered with?", options: ["DNSSEC", "NAT", "SNMPv2", "ARP"], answer: 0, explanation: "DNSSEC adds authenticity and integrity protections to DNS data through digital signatures." },
  { id: 77, domain: "security-operations", topic: "incident-response", difficulty: "medium", question: "What is the main purpose of containment during an incident?", options: ["To permanently rebuild all systems", "To limit damage and prevent further spread", "To write new policies", "To conduct user training"], answer: 1, explanation: "Containment focuses on limiting impact and preventing the incident from spreading further." },
  { id: 78, domain: "security-operations", topic: "monitoring", difficulty: "medium", question: "What is the main advantage of centralized logging?", options: ["It eliminates the need for authentication", "It makes correlation, retention, and investigation easier", "It automatically patches systems", "It prevents all malware infections"], answer: 1, explanation: "Centralized logging improves visibility by collecting events in one place for monitoring and investigation." },
  { id: 79, domain: "security-operations", topic: "hardening", difficulty: "easy", question: "Which of the following is a core hardening step for servers and workstations?", options: ["Enabling unnecessary services", "Removing or disabling unused accounts and services", "Using vendor defaults everywhere", "Disabling antimalware"], answer: 1, explanation: "Removing unused accounts and services reduces the attack surface of a system." },
  { id: 80, domain: "security-operations", topic: "resilience", difficulty: "medium", question: "Which backup type copies only data changed since the last full backup?", options: ["Differential", "Incremental", "Snapshot", "Synthetic full"], answer: 0, explanation: "A differential backup copies changes since the most recent full backup." },
  { id: 81, domain: "security-operations", topic: "resilience", difficulty: "medium", question: "Which backup type copies only data changed since the last backup of any type?", options: ["Differential", "Incremental", "Archive", "Mirror"], answer: 1, explanation: "Incremental backups capture changes since the most recent backup, regardless of type." },
  { id: 82, domain: "security-operations", topic: "vulnerability-management", difficulty: "medium", question: "What is the main purpose of a vulnerability management program?", options: ["To replace incident response", "To identify, prioritize, remediate, and track weaknesses over time", "To increase software licensing costs", "To eliminate the need for patching"], answer: 1, explanation: "Vulnerability management is a continuous process of finding, assessing, remediating, and monitoring weaknesses." },
  { id: 83, domain: "security-operations", topic: "monitoring", difficulty: "hard", question: "A SOC analyst wants to detect unusual outbound traffic patterns from a workstation that may indicate command-and-control communication. Which source is most useful?", options: ["NetFlow or network traffic metadata", "Printer toner logs", "BIOS splash screen", "USB serial stickers"], answer: 0, explanation: "Network flow or traffic metadata is useful for identifying suspicious outbound connections and beaconing behavior." },
  { id: 84, domain: "security-operations", topic: "incident-response", difficulty: "medium", question: "Before taking a forensic image of a compromised drive, what is most important to preserve evidentiary integrity?", options: ["Install new software immediately", "Maintain chain of custody and document handling", "Disable all logging", "Let any user access the evidence"], answer: 1, explanation: "Chain of custody and careful documentation help preserve evidentiary integrity for investigations." },
  { id: 85, domain: "security-operations", topic: "hardening", difficulty: "medium", question: "What is allowlisting primarily used for?", options: ["Permitting only approved software or actions", "Encrypting all network packets", "Rotating backup tapes", "Increasing CPU utilization"], answer: 0, explanation: "Allowlisting restricts execution or actions to explicitly approved items." },
  { id: 86, domain: "security-operations", topic: "vulnerability-management", difficulty: "hard", question: "Which metric provides a standardized way to express the severity of a software vulnerability?", options: ["MTTR", "CVSS", "RTO", "SLE"], answer: 1, explanation: "The Common Vulnerability Scoring System provides a standardized severity score for vulnerabilities." },
  { id: 87, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "medium", question: "Which formula is used to calculate annualized loss expectancy?", options: ["ALE = SLE × ARO", "ALE = RTO + RPO", "ALE = MTTR ÷ ARO", "ALE = CIA × MFA"], answer: 0, explanation: "Annualized Loss Expectancy is calculated as Single Loss Expectancy multiplied by Annualized Rate of Occurrence." },
  { id: 88, domain: "security-program-management-and-oversight", topic: "governance", difficulty: "easy", question: "Which document provides mandatory, specific rules that support a policy, such as password length requirements?", options: ["Guideline", "Standard", "Whitepaper", "Memo"], answer: 1, explanation: "Standards provide mandatory and specific requirements that support policies." },
  { id: 89, domain: "security-program-management-and-oversight", topic: "governance", difficulty: "easy", question: "Which document offers recommended but non-mandatory advice on how to achieve a policy goal?", options: ["Guideline", "Procedure", "Standard", "Contract"], answer: 0, explanation: "Guidelines provide recommended best practices rather than mandatory requirements." },
  { id: 90, domain: "security-program-management-and-oversight", topic: "training", difficulty: "medium", question: "What is the primary purpose of periodic tabletop exercises?", options: ["To replace backups", "To walk through response plans and identify gaps", "To issue user badges", "To disable redundant systems"], answer: 1, explanation: "Tabletop exercises help teams rehearse plans and find weaknesses before a real incident occurs." },
  { id: 91, domain: "security-program-management-and-oversight", topic: "data-protection", difficulty: "medium", question: "Which principle says organizations should collect and retain only the data necessary for a defined purpose?", options: ["Data minimization", "Job rotation", "Segmentation", "Hash collision"], answer: 0, explanation: "Data minimization reduces privacy and security risk by limiting unnecessary data collection and retention." },
  { id: 92, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "medium", question: "Which role is typically responsible for deciding whether a system or data set is acceptable to operate at a given level of risk?", options: ["Data owner or system owner", "Receptionist", "Visitor", "Shipping clerk"], answer: 0, explanation: "Owners are typically accountable for decisions about acceptable risk and handling requirements." },
  { id: 93, domain: "security-program-management-and-oversight", topic: "governance", difficulty: "medium", question: "What is the primary purpose of an acceptable use policy?", options: ["To define permitted and prohibited use of organizational systems", "To provide source code", "To replace incident response", "To calculate ALE"], answer: 0, explanation: "An acceptable use policy tells users what is allowed and not allowed when using organizational resources." },
  { id: 94, domain: "security-program-management-and-oversight", topic: "training", difficulty: "medium", question: "Which control best supports preventing unauthorized disclosure of confidential information by employees who change jobs internally?", options: ["Periodic access reviews", "Disabling backups", "Removing all logs", "Installing a load balancer"], answer: 0, explanation: "Periodic access reviews help ensure privileges are adjusted appropriately when roles change." },
  { id: 95, domain: "general-security-concepts", topic: "controls", difficulty: "medium", question: "Which administrative control helps detect fraud and abuse by requiring different employees to perform the same critical job at different times?", options: ["Job rotation", "Tokenization", "DNSSEC", "RAID"], answer: 0, explanation: "Job rotation can expose irregularities by having different employees perform the same duties over time." },
  { id: 96, domain: "general-security-concepts", topic: "foundations", difficulty: "hard", question: "Which security objective is most directly supported by digital signatures?", options: ["Availability only", "Non-repudiation and integrity", "Compression efficiency", "Network segmentation"], answer: 1, explanation: "Digital signatures help verify integrity and support non-repudiation by tying a signed action to the signer." },
  { id: 97, domain: "threats-vulnerabilities-mitigations", topic: "vulnerabilities", difficulty: "hard", question: "A race condition vulnerability is most closely associated with which type of software weakness?", options: ["Timing and unexpected execution order", "Weak wireless signal", "Lack of backup power", "Unlabeled cables"], answer: 0, explanation: "Race conditions occur when timing or order of execution creates unsafe outcomes." },
  { id: 98, domain: "security-architecture", topic: "cryptography", difficulty: "medium", question: "Which type of cryptographic algorithm is commonly used for fast bulk encryption of large amounts of data?", options: ["Symmetric encryption", "Asymmetric encryption", "Hashing", "Steganography"], answer: 0, explanation: "Symmetric encryption is generally much faster and is commonly used for bulk data encryption." },
  { id: 99, domain: "security-operations", topic: "monitoring", difficulty: "medium", question: "What is the main purpose of baselining normal activity in a network or system?", options: ["To understand expected behavior and spot anomalies", "To eliminate access controls", "To disable updates", "To replace disaster recovery planning"], answer: 0, explanation: "Baselining defines normal behavior so unusual activity can be identified more effectively." },
  { id: 100, domain: "security-program-management-and-oversight", topic: "risk-management", difficulty: "hard", question: "An organization chooses to implement additional controls to reduce the likelihood and impact of a threat rather than avoid or transfer it. Which risk response is this?", options: ["Mitigate", "Accept", "Avoid", "Transfer"], answer: 0, explanation: "Risk mitigation means reducing the likelihood or impact of a risk through controls and safeguards." },
];

export const pbqScenarios: PbqScenario[] = [
  {
    id: 1,
    domain: "security-architecture",
    topic: "network-security",
    title: "Small office network segmentation",
    scenario: "A small business currently has staff laptops, guest Wi-Fi, printers, and an internal file server all on the same flat network. Management wants to reduce risk from lateral movement and keep guest devices away from business systems.",
    prompt: "Describe how you would redesign the network at a high level.",
    tasks: [
      "Separate guest devices from internal business systems",
      "Restrict printer access to only authorized internal users",
      "Reduce the blast radius of a compromised endpoint",
    ],
    solution: [
      "Create separate VLANs or segmented subnets for guests, user workstations, printers, and servers.",
      "Place guest Wi-Fi on its own isolated segment with internet-only access.",
      "Use firewall or ACL rules between segments to limit traffic to only what is needed.",
      "Restrict access to the file server to authorized internal workstation segments only.",
    ],
  },
  {
    id: 2,
    domain: "security-operations",
    topic: "incident-response",
    title: "Ransomware incident response",
    scenario: "Several users report they can no longer open files on a shared drive, and ransom notes are appearing in multiple folders. You suspect ransomware is spreading through the environment.",
    prompt: "List the immediate priorities for the first phase of response.",
    tasks: [
      "Limit spread",
      "Preserve evidence",
      "Prepare for recovery",
    ],
    solution: [
      "Contain affected systems by isolating infected hosts from the network.",
      "Disable compromised accounts or suspicious privileged sessions if needed.",
      "Preserve logs, alerts, and forensic evidence before wiping systems.",
      "Identify unaffected backups and verify their integrity before restoration.",
    ],
  },
  {
    id: 3,
    domain: "security-program-management-and-oversight",
    topic: "data-protection",
    title: "Laptop protection policy",
    scenario: "A company has had several traveling employees lose laptops in airports and hotels. Leadership wants a policy and technical response that reduces the chance of data exposure.",
    prompt: "Recommend the most important controls.",
    tasks: [
      "Protect data at rest",
      "Reduce unauthorized access risk",
      "Support recovery or response",
    ],
    solution: [
      "Require full-disk encryption on all company laptops.",
      "Enforce MFA and strong screen lock settings.",
      "Use mobile device management to support remote lock or wipe.",
      "Classify sensitive data and minimize local storage when possible.",
    ],
  },
];

export function getDomainLabel(domainId: string) {
  return secPlusDomains.find((domain) => domain.id === domainId)?.name ?? "All Domains";
}

export function shuffleArray<T>(items: T[]) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getTopics(domainId?: string) {
  const source = domainId && domainId !== "all"
    ? practiceQuestions.filter((question) => question.domain === domainId)
    : practiceQuestions;

  return Array.from(new Set(source.map((item) => item.topic))).sort();
}
