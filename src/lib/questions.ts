export type Question = {
  questionText: string;
  options: string[];
  correctAnswer: string;
};

export const initialQuestions: Question[] = [
  {
    questionText: "What does CVE stand for?",
    options: [
      "Common Vulnerabilities and Exposures",
      "Critical Vulnerability Enumeration",
      "Common Vector Engine",
      "Cybersecurity Vulnerability Exception",
    ],
    correctAnswer: "Common Vulnerabilities and Exposures",
  },
  {
    questionText: "Which type of encryption uses a single key for both encryption and decryption?",
    options: [
      "Asymmetric Encryption",
      "Symmetric Encryption",
      "Public Key Encryption",
      "Hashing",
    ],
    correctAnswer: "Symmetric Encryption",
  },
  {
    questionText: "What is the OWASP Top 10?",
    options: [
      "A list of the 10 most profitable hacking tools",
      "A list of the 10 most critical web application security risks",
      "A list of the top 10 cybersecurity companies",
      "A ranking of the 10 best firewalls",
    ],
    correctAnswer: "A list of the 10 most critical web application security risks",
  },
  {
    questionText: "What is a 'Zero-Day Attack'?",
    options: [
      "An attack that happens on the first day of the month",
      "An attack that takes zero days to execute",
      "An attack that exploits a previously unknown vulnerability",
      "An attack with zero impact",
    ],
    correctAnswer: "An attack that exploits a previously unknown vulnerability",
  },
  {
    questionText: "What is the primary purpose of a hash value in cybersecurity?",
    options: [
      "To encrypt data so it can be decrypted later",
      "To create a unique, fixed-size output for verifying data integrity",
      "To hide data within an image file",
      "To generate a private key for asymmetric encryption",
    ],
    correctAnswer: "To create a unique, fixed-size output for verifying data integrity",
  },
  {
    questionText: "Which of these is a social engineering technique?",
    options: [
        "SQL Injection",
        "Cross-Site Scripting (XSS)",
        "Phishing",
        "Denial-of-Service (DoS)",
    ],
    correctAnswer: "Phishing",
  },
  {
      questionText: "In the context of security teams, what is a 'Purple Team'?",
      options: [
          "A team that only works on government contracts.",
          "A team of freelance hackers.",
          "A team that combines offensive (Red Team) and defensive (Blue Team) strategies.",
          "A team that specializes in breaking physical security.",
      ],
      correctAnswer: "A team that combines offensive (Red Team) and defensive (Blue Team) strategies.",
  }
];
