export const personalInfo = {
  name: "Aurio Rajaa",
  title: "Software Engineer",
  email: "mr.auriorajaa@gmail.com",
  github: "https://github.com/auriorajaa",
  linkedin: "https://linkedin.com/in/auriorajaa",
  location: "Jakarta, Indonesia",
  bio: "Java developer focused on building backend using Spring Boot. Experienced in creating modern and responsive user interfaces, using React or Next.js. Currently studying at Polytechnic State of Jakarta.",
};

export const educationData = [
  {
    title: "Polytechnic State of Jakarta",
    period: "2022 - Present",
    gpa: "3.50/4.0",
    major: "Informatics Engineering",
    status: "Current",
    description:
      "Studied the theoretical foundations of Informatics Engineering, including web programming and core computer science principles.",
    achievements: [],
    logo: "https://upload.wikimedia.org/wikipedia/id/1/16/Logo_Politeknik_Negeri_Jakarta.jpg",
    color: "blue",
  },
  {
    title: "University of Indonesia IT Program (CCIT-FTUI)",
    period: "2022 - 2024",
    gpa: "3.40/4.0",
    major: "Software Engineering",
    status: "Completed",
    description:
      "Focused on Java programming, Android Java, web programming, data structures, databases, and other software development fundamentals.",
    achievements: ["3rd Place, Huawei Cloud Computing National Competition"],
    logo: "https://ugc.production.linktr.ee/kCHG0PVQMqOZi8NZ4cUi_xQINymaf0G7A8EAG",
    color: "purple",
  },
  {
    title: "Bangkit Academy - Studi Independen (MSIB)",
    period: "July 2024 - December 2024",
    gpa: "89/100",
    major: "Cloud Computing",
    status: "Completed",
    description:
      "Learned backend API development, integrating machine learning with Google Cloud Services, and various cloud computing practices.",
    achievements: [],
    logo: "https://files.klob.id/public/mig01/l32ovhf5/channels4_profile.jpg",
    color: "green",
  },
];

export const experienceData = [
  {
    id: 1,
    company: "Bank Indonesia",
    position: "Software Engineer Intern",
    period: "August 2025 – December 2025",
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
  {
    id: 2,
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
    logo: "https://media.licdn.com/dms/image/v2/D560BAQH3FwcWS8ixYw/company-logo_200_200/company-logo_200_200/0/1692457716166?e=1764806400&v=beta&t=bdRHALfTrtAFg8fgomj6myVbivClbJVXw0QDKDWZ_AY",
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
    category: "Backend Development",
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
    category: "Frontend Development",
    skills: [
      "React.js",
      "Next.js",
      "Bootstrap",
      "Tailwind CSS",
      "Responsive Design",
    ],
  },
  {
    category: "Java Development",
    skills: [
      "Core Java",
      "Spring Framework",
      "Java Swing",
      "Native Android Java",
    ],
  },
  {
    category: "Tools & Workflow",
    skills: [
      "Git & GitHub",
      "Google Cloud Services",
      "Technical Documentation",
    ],
  },
];

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
