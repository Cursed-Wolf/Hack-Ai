// ============================================================
// PlaceIQ — Mock Data Layer
// 50 Students + 20 Companies for realistic demo scenarios
// ============================================================

const SKILL_POOL = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Express',
  'MongoDB', 'SQL', 'PostgreSQL', 'AWS', 'Azure', 'Docker', 'Kubernetes',
  'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask', 'Spring Boot',
  'TensorFlow', 'PyTorch', 'Machine Learning', 'Data Science', 'R',
  'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native',
  'GraphQL', 'Redis', 'Kafka', 'CI/CD', 'Git', 'Linux',
  'Figma', 'UI/UX', 'Tailwind CSS'
];

const BRANCHES = [
  'Computer Science', 'Information Technology', 'Electronics',
  'Mechanical', 'Electrical', 'Civil'
];

const PROJECT_POOL = [
  { name: 'E-Commerce Platform', tech: ['React', 'Node.js', 'MongoDB'], relevance: 85 },
  { name: 'Chat Application', tech: ['Socket.IO', 'Express', 'React'], relevance: 78 },
  { name: 'ML Image Classifier', tech: ['Python', 'TensorFlow', 'Flask'], relevance: 90 },
  { name: 'Portfolio Website', tech: ['React', 'Tailwind CSS'], relevance: 50 },
  { name: 'Task Manager API', tech: ['Node.js', 'Express', 'PostgreSQL'], relevance: 72 },
  { name: 'Weather Dashboard', tech: ['React', 'API Integration'], relevance: 55 },
  { name: 'Blockchain Wallet', tech: ['JavaScript', 'Node.js', 'Crypto'], relevance: 82 },
  { name: 'IoT Sensor Monitor', tech: ['Python', 'Flask', 'MQTT'], relevance: 68 },
  { name: 'Social Media Clone', tech: ['React', 'Node.js', 'MongoDB', 'Redis'], relevance: 88 },
  { name: 'Data Pipeline Tool', tech: ['Python', 'Kafka', 'PostgreSQL'], relevance: 80 },
  { name: 'Mobile Fitness App', tech: ['React Native', 'Firebase'], relevance: 65 },
  { name: 'CI/CD Dashboard', tech: ['Docker', 'Kubernetes', 'Go'], relevance: 85 },
  { name: 'Inventory System', tech: ['Java', 'Spring Boot', 'SQL'], relevance: 70 },
  { name: 'Video Streaming App', tech: ['Node.js', 'AWS', 'React'], relevance: 76 },
  { name: 'Resume Parser', tech: ['Python', 'NLP', 'Flask'], relevance: 92 },
];

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan',
  'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Kavya', 'Meera', 'Saanvi',
  'Isha', 'Aanya', 'Priya', 'Riya', 'Shreya', 'Rohan', 'Karan',
  'Dev', 'Neel', 'Raj', 'Pooja', 'Tanya', 'Neha', 'Rahul', 'Amit',
  'Sneha', 'Varun', 'Manish', 'Deepa', 'Suresh', 'Akash', 'Arnav',
  'Lakshmi', 'Tanvi', 'Harsha', 'Vikram', 'Arun', 'Diksha', 'Nikhil',
  'Pallavi', 'Yash', 'Zara', 'Kabir', 'Nisha', 'Siddharth'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Joshi',
  'Verma', 'Mehta', 'Rao', 'Nair', 'Iyer', 'Das', 'Choudhary', 'Malhotra',
  'Bhat', 'Kulkarni', 'Desai', 'Pillai', 'Saxena'
];

function pick(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function rand(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---- Generate 50 Students ----
function generateStudents() {
  const students = [];
  for (let i = 1; i <= 50; i++) {
    const firstName = FIRST_NAMES[i - 1];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const branch = BRANCHES[i % BRANCHES.length];
    const skillCount = randInt(3, 8);
    const skills = pick(SKILL_POOL, skillCount);
    const projectCount = randInt(1, 4);
    const projects = pick(PROJECT_POOL, projectCount);
    const cgpa = rand(5.0, 9.8);
    const mockInterviews = randInt(0, 12);
    const resumeScore = randInt(30, 95);
    const lastActive = new Date(Date.now() - randInt(0, 15) * 86400000).toISOString();

    students.push({
      id: `STU-${String(i).padStart(3, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@university.edu`,
      branch,
      semester: randInt(5, 8),
      cgpa,
      skills,
      projects,
      mockInterviews,
      resumeScore,
      resumeText: generateResumeText(firstName, lastName, skills, projects, cgpa, branch),
      lastActive,
      appliedCompanies: [],
      memory: {
        pastRecommendations: [],
        applicationHistory: [],
        previousWeaknesses: []
      }
    });
  }
  return students;
}

function generateResumeText(first, last, skills, projects, cgpa, branch) {
  return `${first} ${last}\n${branch} Engineering\nCGPA: ${cgpa}\n\nSkills: ${skills.join(', ')}\n\nProjects:\n${projects.map(p => `- ${p.name} (${p.tech.join(', ')})`).join('\n')}\n\nObjective: Seeking a challenging role in software engineering to leverage my skills in ${skills.slice(0, 3).join(', ')}.`;
}

// ---- Generate 20 Companies ----
function generateCompanies() {
  const companies = [
    { name: 'Google', requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Go', 'Kubernetes'], minCGPA: 8.0, role: 'SDE Intern', ctc: '₹45 LPA', batch: 'Tier 1' },
    { name: 'Microsoft', requiredSkills: ['C++', 'Azure', 'TypeScript', 'React', 'SQL'], minCGPA: 7.5, role: 'Software Engineer', ctc: '₹40 LPA', batch: 'Tier 1' },
    { name: 'Amazon', requiredSkills: ['Java', 'AWS', 'Docker', 'CI/CD', 'Linux'], minCGPA: 7.0, role: 'SDE-1', ctc: '₹38 LPA', batch: 'Tier 1' },
    { name: 'Flipkart', requiredSkills: ['Java', 'Spring Boot', 'Kafka', 'Redis', 'SQL'], minCGPA: 7.0, role: 'Backend Developer', ctc: '₹30 LPA', batch: 'Tier 1' },
    { name: 'Infosys', requiredSkills: ['Java', 'Python', 'SQL', 'Git'], minCGPA: 6.0, role: 'Systems Engineer', ctc: '₹6 LPA', batch: 'Tier 3' },
    { name: 'TCS', requiredSkills: ['Java', 'Python', 'SQL', 'Linux'], minCGPA: 5.5, role: 'Assistant Engineer', ctc: '₹7 LPA', batch: 'Tier 3' },
    { name: 'Wipro', requiredSkills: ['Java', 'Python', 'Angular', 'SQL'], minCGPA: 5.5, role: 'Project Engineer', ctc: '₹6.5 LPA', batch: 'Tier 3' },
    { name: 'Adobe', requiredSkills: ['JavaScript', 'React', 'Node.js', 'GraphQL', 'TypeScript'], minCGPA: 7.5, role: 'Frontend Engineer', ctc: '₹32 LPA', batch: 'Tier 1' },
    { name: 'Deloitte', requiredSkills: ['Python', 'SQL', 'Data Science', 'R'], minCGPA: 7.0, role: 'Data Analyst', ctc: '₹12 LPA', batch: 'Tier 2' },
    { name: 'Goldman Sachs', requiredSkills: ['Java', 'Python', 'SQL', 'PostgreSQL', 'Docker'], minCGPA: 8.0, role: 'Technology Analyst', ctc: '₹35 LPA', batch: 'Tier 1' },
    { name: 'Razorpay', requiredSkills: ['Go', 'Kubernetes', 'Docker', 'PostgreSQL', 'Redis'], minCGPA: 7.0, role: 'Backend Engineer', ctc: '₹28 LPA', batch: 'Tier 2' },
    { name: 'Zomato', requiredSkills: ['React', 'Node.js', 'MongoDB', 'Redis', 'Kafka'], minCGPA: 6.5, role: 'Full Stack Developer', ctc: '₹22 LPA', batch: 'Tier 2' },
    { name: 'Swiggy', requiredSkills: ['Java', 'Spring Boot', 'Kafka', 'AWS', 'Docker'], minCGPA: 6.5, role: 'SDE', ctc: '₹24 LPA', batch: 'Tier 2' },
    { name: 'Paytm', requiredSkills: ['Java', 'React', 'Node.js', 'MongoDB'], minCGPA: 6.0, role: 'Software Developer', ctc: '₹16 LPA', batch: 'Tier 2' },
    { name: 'Accenture', requiredSkills: ['Java', 'Python', 'SQL', 'Azure'], minCGPA: 5.5, role: 'Associate Developer', ctc: '₹8 LPA', batch: 'Tier 3' },
    { name: 'Capgemini', requiredSkills: ['Java', 'Python', 'Angular', 'SQL', 'Git'], minCGPA: 5.5, role: 'Analyst', ctc: '₹7.5 LPA', batch: 'Tier 3' },
    { name: 'PhonePe', requiredSkills: ['Kotlin', 'React Native', 'Node.js', 'PostgreSQL'], minCGPA: 7.0, role: 'Mobile Developer', ctc: '₹26 LPA', batch: 'Tier 2' },
    { name: 'CRED', requiredSkills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Redis'], minCGPA: 7.5, role: 'Frontend Engineer', ctc: '₹30 LPA', batch: 'Tier 1' },
    { name: 'Atlassian', requiredSkills: ['Java', 'React', 'TypeScript', 'AWS', 'CI/CD'], minCGPA: 8.0, role: 'SDE', ctc: '₹42 LPA', batch: 'Tier 1' },
    { name: 'Meesho', requiredSkills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker'], minCGPA: 6.5, role: 'Backend Developer', ctc: '₹20 LPA', batch: 'Tier 2' },
  ];

  return companies.map((c, i) => {
    const deadlineDays = randInt(1, 30);
    return {
      id: `COMP-${String(i + 1).padStart(3, '0')}`,
      ...c,
      deadline: new Date(Date.now() + deadlineDays * 86400000).toISOString(),
      deadlineDays,
      slots: randInt(5, 50),
      description: `${c.name} is hiring for ${c.role}. Looking for candidates with ${c.requiredSkills.slice(0, 3).join(', ')} skills. Minimum CGPA: ${c.minCGPA}.`,
    };
  });
}

// Build and export stable datasets (generated once at startup)
export const students = generateStudents();
export const companies = generateCompanies();

export function getStudentById(id) {
  return students.find(s => s.id === id) || null;
}

export function getCompanyById(id) {
  return companies.find(c => c.id === id) || null;
}
