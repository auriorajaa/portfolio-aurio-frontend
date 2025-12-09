// src/data/portfolioData.js
export const personalInfo = {
  name: "Aurio Rajaa",
  title: "Software Engineer",
  email: "mr.auriorajaa@gmail.com",
  github: "https://github.com/auriorajaa",
  linkedin: "https://linkedin.com/in/auriorajaa",
  location: "Jakarta, Indonesia",
  bio: "Backend developer specializing in Spring Boot and Java ecosystem. Building robust RESTful APIs and microservices. Also experienced with Django and modern frontend technologies like React and Next.js.",
};

// Formal Education (Degree Programs)
export const educationData = [
  {
    title: "Polytechnic State of Jakarta",
    period: "2022 - Present",
    gpa: "3.50/4.0",
    major: "Informatics Engineering",
    degree: "Bachelor's Applied Science",
    status: "Current",
    type: "formal",
    description:
      "Pursuing a 4-year Applied Bachelor's degree focusing on practical software engineering. Studying advanced web programming, software architecture, database systems, and modern development practices.",
    achievements: [],
    courses: [
      "Web Programming",
      "Data Structures & Algorithms",
      "Database Management",
      "Software Engineering",
      "Mobile Development",
      "Cloud Computing",
    ],
    logo: "https://upload.wikimedia.org/wikipedia/id/1/16/Logo_Politeknik_Negeri_Jakarta.jpg",
    color: "blue",
  },
  {
    title: "University of Indonesia IT Program (CCIT-FTUI)",
    period: "2022 - 2024",
    gpa: "3.40/4.0",
    major: "Software Engineering",
    degree: "Diploma",
    status: "Completed",
    type: "formal",
    description:
      "Completed a 2-year intensive Diploma program specializing in software development fundamentals. Gained strong foundation in Java programming, Android development, and software engineering principles.",
    achievements: ["3rd Place, Huawei Cloud Computing National Competition"],
    courses: [
      "Java Programming",
      "Android Development",
      "Web Development",
      "Data Structures",
      "Database Systems",
      "Object-Oriented Programming",
    ],
    logo: "https://ugc.production.linktr.ee/kCHG0PVQMqOZi8NZ4cUi_xQINymaf0G7A8EAG",
    color: "purple",
  },
];

// Certifications & Bootcamps
export const certificationsData = [
  {
    title: "Bangkit Academy - Studi Independen (MSIB)",
    period: "July 2024 - December 2024",
    score: "89/100",
    major: "Cloud Computing Learning Path",
    status: "Completed",
    type: "bootcamp",
    description:
      "Intensive 6-month industry-led bootcamp by Google, Tokopedia, Gojek & Traveloka. Specialized in backend API development, machine learning integration with Google Cloud Platform, and production-grade cloud architecture.",
    achievements: [
      "Top Graduate Performance (89/100)",
      "Capstone Project: SmartFit: AI-Powered Outfit Advisor & Personal Color Analysis",
    ],
    skills: [
      "Google Cloud Platform",
      "Backend API Development",
      "ML Integration",
      "Docker & Kubernetes",
      "CI/CD Pipeline",
      "Cloud Architecture",
    ],
    logo: "https://files.klob.id/public/mig01/l32ovhf5/channels4_profile.jpg",
    color: "green",
  },
];

// Combined for statistics
export const allEducation = [...educationData, ...certificationsData];

export const experienceData = [
  {
    id: 1,
    company: "Lapis AI",
    position: "Full-Stack Developer",
    period: "March 2025 – June 2025",
    location: "Remote",
    type: "Project-based",
    description: [
      "Collaborated with Politeknik Negeri Jakarta on a semester-long case study project to build a financial fraud detection platform",
      "Developed web interface using Next.js and TypeScript with responsive design and intuitive user experience",
      "Built backend APIs for secure transaction data processing and real-time fraud detection",
      "Integrated machine learning models to detect credit card fraud patterns and analyze financial news sentiment",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Python",
      "Machine Learning",
      "REST API",
      "PostgreSQL",
    ],
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd8qo9qDztSBaKj3LILH_nASuBxJMXTowRfg&s",
  },
  {
    id: 2,
    company: "Bank Indonesia",
    position: "Software Engineer Intern",
    period: "August 2025 – November 2025",
    location: "Jakarta",
    type: "Full-time",
    description: [
      "Developed Work Inspection Report (Berita Acara Pemeriksaan Pekerjaan) Generator web application to digitalize document creation processes, reducing manual work time and improving consistency across the Innovation and Data Digitalization Department (DIDD)",
      "Built full-stack solution using Spring Boot for backend RESTFUL APIs and Next.js for responsive frontend interface",
      "Implemented document management features including form-based data entry, document history tracking, and recovery system for accidentally deleted files",
      "Designed and optimized Microsoft SQL Server database schema to handle structured Work Inspection Report document data and user management",
    ],
    technologies: [
      "Spring Boot",
      "Next.js",
      "Microsoft SQL Server",
      "TypeScript",
      "Java",
      "Tailwind CSS",
    ],
    logo: "https://images.seeklogo.com/logo-png/62/1/bank-indonesia-logo-png_seeklogo-622136.png",
  },
];

export const projects = [
  {
    id: 1,
    title: "Small Circle",
    description:
      "Small Circle is a native Android marketplace application that connects local buyers and sellers. Users can discover items based on location, chat with sellers, manage listings, and more.",
    tags: ["java", "firebase", "xml"],
    image:
      "https://repository-images.githubusercontent.com/876764928/95dd8a08-3549-47ac-8a7a-f432e21c4a9c",
    github: "https://github.com/auriorajaa/Small_Circle",
  },
  {
    id: 2,
    title: "Flick Share",
    description: "Modern Django web app for seamless Flickr content sharing",
    tags: ["django", "htmx", "postgres"],
    image:
      "https://repository-images.githubusercontent.com/916445698/7e074c95-7957-44ba-92a4-02111b197d63",
    github: "https://github.com/auriorajaa/flick_share",
  },
  {
    id: 3,
    title: "Upfront",
    description:
      "Upfront - a modern multi-vendor e-commerce platform with responsive design and seamless payment integration.",
    tags: ["django", "drf", "react", "restful-api", "bootstrap"],
    image:
      "https://repository-images.githubusercontent.com/924773634/84a90724-017a-49b7-b13a-68dce9cb92a9",
    github: "https://github.com/auriorajaa/django_react_ecommerce_frontend",
  },
  {
    id: 4,
    title: "Link Shortener",
    description:
      "A modern web application for shortening URLs built with Django REST Framework and React.js.",
    tags: ["django", "drf", "react", "chakra-ui", "restful-api"],
    image:
      "https://repository-images.githubusercontent.com/916945905/d54e97aa-e9a2-4c6f-b481-6695aa2cd4ea",
    github: "https://github.com/auriorajaa/link_shortener",
  },
  {
    id: 5,
    title: "Social Lib",
    description:
      "Social Lib is a small-scale social media project inspired by Twitter. It allows users to follow and unfollow other users, create text-only posts, edit their profiles, and search for other users.",
    tags: ["django", "drf", "react", "restful-api", "chakra-ui"],
    image:
      "https://repository-images.githubusercontent.com/915189640/7faab232-d2fa-4377-9dd6-fc0cc4f23ea2",
    github: "https://github.com/auriorajaa/social_lib",
  },
  {
    id: 6,
    title: "Smart Investment App Finder",
    description:
      "Smart Investment App Finder is a user-friendly web platform designed to help individuals—especially beginner investors—make smarter and more informed investment decisions.",
    tags: ["html", "tailwind-css", "javascript"],
    image:
      "https://repository-images.githubusercontent.com/829793467/a9390949-beef-4285-b7ce-6c536a91c4a8",
    github: "https://github.com/auriorajaa/web-penentuan-app-invest",
    website: "https://web-penentuan-app-invest.vercel.app/",
  },
];

export const achievements = [
  {
    id: 1,
    title: "3rd Place, Huawei AI Cloud Computing National Competition",
    issuer: "Huawei",
    date: "January 2024",
    image: "/sertif-huawei.png",
  },
  {
    id: 2,
    title: "MSIB Independent Study Participation Certificate",
    issuer: "Kampus Merdeka",
    date: "January 2025",
    image: "/sertif-msib-stupen.jpeg",
  },
  {
    id: 3,
    title: "Applied Machine Learning with Google Cloud Course",
    issuer: "Dicoding",
    date: "January 2025",
    image: "/sertif-applied-ml.png",
  },
  {
    id: 4,
    title: "Becoming Google Cloud Engineer Course",
    issuer: "Dicoding",
    date: "January 2025",
    image: "/sertif-becoming-cloud-engineer.jpeg",
  },
];

export const universityActivities = [
  {
    title: "Himpunan Mahasiswa TIK - Politeknik Negeri Jakarta",
    role: "Staff Mentorship for EXPECTIK (Department Orientation)",
    period: "20 December 2023 – 15 February 2024",
    description:
      "Responsible for supervising and mobilizing participants, handling permits, and relaying information from the academic and public relations departments.",
    image: "/EXPECTIK-2023.png",
  },
  {
    title: "Badan Eksekutif Mahasiswa - Politeknik Negeri Jakarta",
    role: "Staff for PNJ 2024 Olympic Competition (Photography Contest)",
    period: "5 May 2024 – 6 July 2024",
    description:
      "Responsible for planning, executing, and administrating the photography contest, coordinating with participants and judges.",
    image: "/OP-2024.png",
  },
  {
    title: "Himpunan Mahasiswa TIK - Politeknik Negeri Jakarta",
    role: "Head of Operations for EXPECTIK (Department Orientation)",
    period: "30 August 2024 – 11 November 2024",
    description:
      "Led and managed the operational aspects of the event, ensuring smooth logistics, coordination, and communication between teams and participants.",
    image: "/EXPECTIK-2024.png",
  },
];

export const skillsData = [
  {
    category: "Backend",
    skills: [
      "Spring Boot REST API",
      "Django REST Framework",
      "API Design",
      "SQL & NoSQL Databases",
      "Authentication & Security",
      "Docker & Containerization",
    ],
  },
  {
    category: "Frontend",
    skills: [
      "React.js",
      "Next.js",
      "Bootstrap",
      "Tailwind CSS",
      "Responsive Design",
    ],
  },
  {
    category: "Java",
    skills: [
      "Core Java",
      "Spring Framework",
      "Java Swing",
      "Native Android Java",
    ],
  },
  {
    category: "Tools",
    skills: [
      "Git & GitHub",
      "Google Cloud Services",
      "Technical Documentation",
    ],
  },
];

// Detailed skill descriptions based on experience and education
export const skillDetails = {
  "Spring Boot REST API": {
    level: "Advanced",
    description:
      "Built production RESTful APIs for Bank Indonesia's document management system",
    context: "Primary backend framework for enterprise applications",
  },
  "Django REST Framework": {
    level: "Advanced",
    description:
      "Developed multiple full-stack projects including e-commerce and social platforms",
    context: "Experienced in DRF for rapid API development",
  },
  "API Design": {
    level: "Proficient",
    description:
      "Designed scalable REST APIs with proper architecture and documentation",
    context: "Focus on clean, maintainable API structures",
  },
  "SQL & NoSQL Databases": {
    level: "Proficient",
    description:
      "Worked with PostgreSQL, MySQL, Microsoft SQL Server, MongoDB, and Firebase",
    context: "Database design and optimization for various use cases",
  },
  "Authentication & Security": {
    level: "Proficient",
    description:
      "Implemented JWT authentication and secure data handling practices",
    context: "Security-first approach in backend development",
  },
  "Docker & Containerization": {
    level: "Intermediate",
    description:
      "Learned containerization through Bangkit Cloud Computing program",
    context: "Deployment and environment management",
  },
  "React.js": {
    level: "Advanced",
    description:
      "Built multiple responsive frontends with React and modern hooks",
    context: "Primary choice for interactive UI development",
  },
  "Next.js": {
    level: "Advanced",
    description:
      "Created production apps including financial fraud detection platform for Lapis AI",
    context: "Full-stack React framework with SSR capabilities",
  },
  Bootstrap: {
    level: "Proficient",
    description:
      "Used in e-commerce and various web projects for rapid prototyping",
    context: "Reliable framework for responsive layouts",
  },
  "Tailwind CSS": {
    level: "Advanced",
    description:
      "Preferred utility-first CSS framework for modern web applications",
    context: "Primary styling solution for recent projects",
  },
  "Responsive Design": {
    level: "Advanced",
    description: "All projects feature mobile-first, responsive interfaces",
    context: "Essential skill for modern web development",
  },
  "Core Java": {
    level: "Advanced",
    description:
      "Strong foundation from CCIT-FTUI and applied in Android and Spring projects",
    context: "Primary programming language with 3+ years experience",
  },
  "Spring Framework": {
    level: "Advanced",
    description: "Deep experience with Spring Boot and Spring ecosystem",
    context: "Go-to framework for enterprise Java applications",
  },
  "Java Swing": {
    level: "Intermediate",
    description: "Studied desktop application development at CCIT-FTUI",
    context: "Foundation in Java GUI development",
  },
  "Native Android Java": {
    level: "Proficient",
    description: "Built Small Circle marketplace app with Firebase integration",
    context: "Android development with Java and XML",
  },
  "Git & GitHub": {
    level: "Advanced",
    description:
      "Version control for all projects with collaborative workflows",
    context: "Essential tool for professional development",
  },
  "Google Cloud Services": {
    level: "Proficient",
    description: "Trained through Bangkit Academy program with ML integration",
    context: "Cloud computing and deployment expertise",
  },
  "Technical Documentation": {
    level: "Proficient",
    description: "Created comprehensive documentation for APIs and projects",
    context: "Clear communication of technical concepts",
  },
};

export const articlesData = [
  {
    id: 1,
    title: "Building Scalable Django Applications",
    excerpt:
      "Best practices for building scalable and maintainable Django applications with REST APIs.",
    date: "2024-01-15",
    readTime: "5 min read",
    tags: ["Django", "Backend", "REST API"],
  },
  {
    id: 2,
    title: "React Performance Optimization",
    excerpt:
      "Advanced techniques for optimizing React application performance and reducing bundle size.",
    date: "2024-01-10",
    readTime: "7 min read",
    tags: ["React", "Performance", "Frontend"],
  },
  {
    id: 3,
    title: "Cloud Computing Fundamentals",
    excerpt:
      "Understanding the core concepts of cloud computing and how to leverage cloud services effectively.",
    date: "2024-01-05",
    readTime: "6 min read",
    tags: ["Cloud", "AWS", "Google Cloud"],
  },
];
