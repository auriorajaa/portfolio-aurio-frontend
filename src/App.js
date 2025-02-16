import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  Link,
  VStack,
  HStack,
  Grid,
  GridItem,
  Image,
  Badge,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  keyframes,
  chakra,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  List,
  ListItem,
  ListIcon,
  useColorMode,
  useColorModeValue,
  useListStyles,
  useToast,
  shouldForwardProp,
} from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import {
  FiArrowUp,
  FiDownload,
  FiMenu,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiExternalLink,
  FiStar,
  FiChevronRight,
  FiCodepen,
  FiCheck,
  FiCode,
  FiUsers,
  FiLayers,
  FiCalendar,
  FiBookOpen,
  FiAward,
  FiBriefcase,
  FiCoffee,
  FiSun,
  FiMoon,
  FiSend,
} from "react-icons/fi";
import emailjs from "@emailjs/browser";

// Create a custom motion component that will be used for animations
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

// Timeline Component for Education Section
const TimelineItem = ({
  title,
  period,
  gpa,
  major,
  description,
  achievements,
  logo,
}) => {
  const bgColor = useColorModeValue("white", "#121212");
  const textPrimary = useColorModeValue("gray.800", "#EAEAEA");
  const textSecondary = useColorModeValue("gray.600", "#B0B0B0");
  const borderColor = useColorModeValue("gray.200", "#292929");

  return (
    <Box
      position="relative"
      mb={10}
      display="flex"
      flexDirection={{ base: "column", md: "row" }} // ✅ **Mobile: column, Desktop: row**
      alignItems={{ base: "center", md: "flex-start" }}
      gap={4}
    >
      {/* ✅ Logo di atas di mobile, sejajar di desktop */}
      {logo && (
        <Image
          src={logo}
          alt={`${title} Logo`}
          boxSize={{ base: "80px", md: "120px" }} // ✅ Ukuran logo tetap responsif
          objectFit="contain"
          borderRadius="md"
          bg="white"
          px={2}
          py={1}
          border="1px solid"
          borderColor={borderColor}
          flexShrink={0}
          mb={{ base: 3, md: 0 }} // ✅ Beri jarak di mobile agar tidak terlalu dekat
        />
      )}

      {/* ✅ Detail Pendidikan */}
      <ChakraBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        flex="1"
        textAlign={{ base: "center", md: "left" }} // ✅ Pusatkan teks di mobile
      >
        {/* ✅ Nama Institusi */}
        <Heading
          as="h3"
          size="md"
          mb={2}
          color={textPrimary}
          whiteSpace="normal"
          wordBreak="break-word"
          maxWidth="100%"
        >
          {title}
        </Heading>

        {/* ✅ Jurusan (Hanya tampil jika ada data) */}
        {major && (
          <Text fontWeight="semibold" color={textSecondary} mb={1}>
            Major: {major}
          </Text>
        )}

        <Text fontWeight="semibold" color={textSecondary} mb={1}>
          {period}
        </Text>
        <Text fontWeight="bold" color={textPrimary} mb={2}>
          GPA: {gpa}
        </Text>

        {/* ✅ Deskripsi tetap wrap dengan baik */}
        <Text
          color={textSecondary}
          mb={3}
          whiteSpace="normal"
          wordBreak="break-word"
          maxWidth="100%"
        >
          {description}
        </Text>

        {/* ✅ Achievements wrap dengan baik */}
        <HStack
          spacing={2}
          flexWrap="wrap"
          justify={{ base: "center", md: "flex-start" }}
          maxWidth="100%"
        >
          {achievements.map((achievement, index) => (
            <Badge
              key={index}
              color={textSecondary}
              mb={1}
              whiteSpace="normal"
              wordBreak="break-word"
              textAlign="center"
            >
              {achievement}
            </Badge>
          ))}
        </HStack>
      </ChakraBox>
    </Box>
  );
};

// Activity Card Component
const ActivityCard = ({ title, role, period, description, image }) => {
  const bgColor = useColorModeValue("white", "#121212");
  const cardBg = useColorModeValue("white", "#1A1A1A");
  const textPrimary = useColorModeValue("gray.800", "#EAEAEA");
  const textSecondary = useColorModeValue("gray.600", "#B0B0B0");
  const textBody = useColorModeValue("gray.700", "#D0D0D0");
  const borderColor = useColorModeValue("gray.200", "#292929");

  return (
    <ChakraBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      width="100%"
    >
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        w="100%"
        maxW="2048px" // ✅ Batasi maksimum agar tetap sesuai gambar
        mx="auto"
      >
        {/* ✅ Gambar - Tetap Full Tanpa Crop */}
        <Image
          src={image || "https://via.placeholder.com/2048x1536?text=Activity"}
          alt={title}
          w="100%"
          h="auto"
          objectFit="contain" // ✅ Pastikan gambar tidak terpotong
          aspectRatio="4/3" // ✅ Ikuti rasio gambar
        />

        {/* ✅ Konten - Menyesuaikan ukuran gambar */}
        <Box p={5}>
          <Heading
            color={textPrimary}
            as="h3"
            size="md"
            mb={2}
            whiteSpace="normal"
            overflowWrap="break-word"
            wordBreak="break-word"
            maxW="100%"
          >
            {title}
          </Heading>

          <Box mb={2}>
            <Badge
              color={textSecondary}
              fontSize="sm"
              py={1}
              maxW="100%"
              whiteSpace="normal"
              wordBreak="break-word"
              textAlign="left"
            >
              {role}
            </Badge>
          </Box>

          <Text
            fontSize="sm"
            color={textSecondary}
            mb={2}
            display="flex"
            alignItems="center"
            wordBreak="break-word"
          >
            <Box as={FiCalendar} display="inline-block" mr={1} flexShrink={0} />
            <span>{period}</span>
          </Text>

          <Text
            color={textSecondary}
            fontSize="sm"
            whiteSpace="normal"
            wordBreak="break-word"
            maxW="100%"
            noOfLines={4} // ✅ Batasi deskripsi agar tidak melebihi card
          >
            {description}
          </Text>
        </Box>
      </Box>
    </ChakraBox>
  );
};

// Project Card Component
const ProjectCard = ({ title, description, tags, image, link, github }) => {
  const bgColor = useColorModeValue("white", "#121212");
  const cardBg = useColorModeValue("white", "#1A1A1A");
  const textPrimary = useColorModeValue("gray.800", "#EAEAEA");
  const textSecondary = useColorModeValue("gray.600", "#B0B0B0");
  const textBody = useColorModeValue("gray.700", "#D0D0D0");
  const borderColor = useColorModeValue("gray.200", "#292929");

  return (
    <ChakraBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Box
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        bg={cardBg}
        transition="all 0.3s"
        _hover={{
          transform: "translateY(-5px)",
          shadow: "lg",
        }}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        {/* Image Container */}
        <Box position="relative" overflow="hidden" role="group">
          <Image
            src={image}
            alt={title}
            w="100%"
            h="200px"
            objectFit="cover"
            transition="transform 0.5s"
            _groupHover={{ transform: "scale(1.05)" }}
          />
          {/* Overlay untuk GitHub & Live Demo */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.600"
            opacity="0"
            transition="all 0.3s"
            _groupHover={{ opacity: 1 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <HStack spacing={4} display="flex">
              {github && (
                <IconButton
                  as="a"
                  href={github}
                  target="_blank"
                  aria-label="GitHub"
                  icon={<FiGithub />}
                  color={textSecondary}
                  _hover={{ bg: "whiteAlpha.300" }}
                  variant="solid"
                  size="md"
                  borderRadius="full"
                />
              )}
              {link && (
                <IconButton
                  as="a"
                  href={link}
                  target="_blank"
                  aria-label="Live Demo"
                  icon={<FiExternalLink />}
                  color={textSecondary}
                  _hover={{ bg: "whiteAlpha.300" }}
                  variant="solid"
                  size="md"
                  borderRadius="full"
                />
              )}
            </HStack>
          </Box>
        </Box>

        {/* Project Info */}
        <Box p={5} flex="1" display="flex" flexDirection="column">
          <Heading as="h3" size="md" mb={2} color={textPrimary}>
            {title}
          </Heading>
          <Text mb={4} color={textBody} flex="1">
            {description}
          </Text>
          <HStack spacing={2} flexWrap="wrap" mt="auto">
            {tags.map((tag, index) => (
              <Badge key={index} bg={bgColor} color={textSecondary} mb={1}>
                {tag}
              </Badge>
            ))}
          </HStack>

          {/* GitHub & Live Demo Buttons Always Visible */}
          <HStack spacing={3} mt={4}>
            {github && (
              <Button
                as="a"
                href={github}
                target="_blank"
                size="sm"
                variant="outline"
                leftIcon={<FiGithub />}
                color={textPrimary}
                _hover={{ transform: "scale(1.05)" }}
                transition="all 0.2s ease-in-out"
              >
                GitHub
              </Button>
            )}
            {link && (
              <Button
                as="a"
                href={link}
                target="_blank"
                size="sm"
                variant="outline"
                leftIcon={<FiExternalLink />}
                color={textPrimary}
                _hover={{ transform: "scale(1.05)" }}
                transition="all 0.2s ease-in-out"
              >
                Live Demo
              </Button>
            )}
          </HStack>
        </Box>
      </Box>
    </ChakraBox>
  );
};

// Achievement Card Component
const AchievementCard = ({ title, issuer, date, image }) => {
  // Colors
  const bgColor = useColorModeValue("white", "#121212");
  const cardBg = useColorModeValue("white", "#1A1A1A");
  const textPrimary = useColorModeValue("gray.800", "#EAEAEA");
  const textSecondary = useColorModeValue("gray.600", "#B0B0B0");
  const textBody = useColorModeValue("gray.700", "#D0D0D0");
  const borderColor = useColorModeValue("gray.200", "#292929");

  return (
    <ChakraBox
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Box
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        height="100%"
        display="flex"
        flexDirection="column"
        bg={cardBg}
        position="relative"
      >
        {/* ✅ Background Overlay dengan Gradient Gelap */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="150px"
          bgGradient="linear(to-r, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2))" // ✅ Gradient yang cocok di dark mode
          opacity="0.8"
          zIndex="0"
        />

        {/* ✅ Subtle Pattern agar Background Tidak Kosong */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="150px"
          bgImage="url('https://www.transparenttextures.com/patterns/cubes.png')" // ✅ Pattern transparan yang clean
          opacity="0.05"
          zIndex="1"
        />

        {/* ✅ Gambar Utama dengan Subtle Glow */}
        <Image
          src={image || "https://via.placeholder.com/300x200?text=Certificate"}
          alt={title}
          w="100%"
          h="150px"
          objectFit="contain"
          position="relative"
          zIndex="2"
          filter="drop-shadow(0px 4px 10px rgba(255,255,255,0.1))" // ✅ Efek glow halus agar gambar lebih standout
        />

        {/* ✅ Konten */}
        <Box p={4} flex="1">
          <Heading color={textPrimary} as="h3" size="sm" mb={2}>
            {title}
          </Heading>
          <Text fontSize="sm" color={textBody} mb={1}>
            <Box as={FiAward} display="inline-block" mr={1} />
            {issuer}
          </Text>
          <Text fontSize="sm" color={textSecondary} mb={1}>
            <Box as={FiCalendar} display="inline-block" mr={1} />
            {date}
          </Text>
        </Box>
      </Box>
    </ChakraBox>
  );
};

// Skill Category Component
const SkillCategory = ({ category, skills }) => {
  const bgColor = useColorModeValue("white", "#121212"); // Deep black, bukan sekadar abu-abu
  const cardBg = useColorModeValue("white", "#1A1A1A"); // Elegan, clean black
  const textPrimary = useColorModeValue("gray.800", "#EAEAEA"); // Hampir putih, tetap nyaman di mata
  const textSecondary = useColorModeValue("gray.600", "#B0B0B0"); // Untuk sub-head, detail kecil
  const textBody = useColorModeValue("gray.700", "#D0D0D0"); // Untuk paragraf utama
  const borderColor = useColorModeValue("gray.200", "#292929"); // Halus, tidak terlalu kontras

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={5}
      bg={cardBg}
    >
      <Heading color={textPrimary} as="h3" size="md" mb={4}>
        {category}
      </Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={3}>
        {skills.map((skill, index) => (
          <List>
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon as={FiCheck} color="green.500" />
              {skill}
            </ListItem>
          </List>
        ))}
      </Grid>
    </Box>
  );
};

// Main App Component
const App = () => {
  // State for mobile menu
  const { isOpen, onOpen, onClose } = useDisclosure();
  const menuRef = useRef();

  // State for scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);

  // State for active filter in projects section
  const [activeFilter, setActiveFilter] = useState("all");

  const { colorMode, toggleColorMode } = useColorMode();

  // Colors
  const bgColor = useColorModeValue("white", "#121212"); // Deep black, bukan sekadar abu-abu
  const cardBg = useColorModeValue("white", "#1A1A1A"); // Elegan, clean black
  const textPrimary = useColorModeValue("gray.800", "#EAEAEA"); // Hampir putih, tetap nyaman di mata
  const textSecondary = useColorModeValue("gray.600", "#B0B0B0"); // Untuk sub-head, detail kecil
  const textBody = useColorModeValue("gray.700", "#D0D0D0"); // Untuk paragraf utama
  const borderColor = useColorModeValue("gray.200", "#292929"); // Halus, tidak terlalu kontras

  // Mock data for projects
  const projects = [
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
      // link: "#",
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
      // link: null,
      github: "https://github.com/auriorajaa/django_react_ecommerce_frontend",
    },

    {
      id: 4,
      title: "Link Shortener",
      description:
        "A modern web application for shortening URLs built with Django REST Framework and React.js. This project provides a simple and efficient way to create shortened URLs.",
      tags: ["django", "drf", "react", "chakra-ui", "restful-api"],
      image:
        "https://repository-images.githubusercontent.com/916945905/d54e97aa-e9a2-4c6f-b481-6695aa2cd4ea",
      // link: "#",
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
      // link: "#",
      github: "https://github.com/auriorajaa/social_lib",
    },
  ];

  // Filter projects based on active filter
  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.tags.includes(activeFilter));

  // Mock data for achievements
  const achievements = [
    {
      id: 1,
      title: "3rd Place, Huawei AI Cloud Computing National Competition",
      issuer: "Huawei",
      date: "Januari 2024",
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

  // Education timeline data
  const educationData = [
    {
      title: "University of Indonesia IT Program (CCIT-FTUI)",
      period: "2022 - 2024",
      gpa: "3.40/4.0",
      major: "Software Engineering",
      description:
        "Focused on Java programming, Android Java, web programming, data structures, databases, and other software development fundamentals.",
      achievements: ["3rd Place, Huawei Cloud Computing National Competition"],
      logo: "https://ugc.production.linktr.ee/kCHG0PVQMqOZi8NZ4cUi_xQINymaf0G7A8EAG",
    },
    {
      title: "Bangkit Academy - Studi Independen (MSIB)",
      period: "July 2024 - December 2024",
      gpa: "89/100",
      major: "Cloud Computing",
      description:
        "Learned backend API development, integrating machine learning with Google Cloud Services, and various cloud computing practices.",
      achievements: [],
      logo: "https://files.klob.id/public/mig01/l32ovhf5/channels4_profile.jpg",
    },
    {
      title: "Polytechnic State of Jakarta",
      period: "2022 - Present",
      gpa: "3.50/4.0",
      major: "Informatics Engineering",
      description:
        "Studied the theoretical foundations of Informatics Engineering, including web programming and core computer science principles.",
      achievements: [],
      logo: "https://upload.wikimedia.org/wikipedia/id/1/16/Logo_Politeknik_Negeri_Jakarta.jpg",
    },
  ];

  // University activities data
  const universityActivities = [
    {
      title: "Himpunan Mahasiswa TIK - Politeknik Negeri Jakarta",
      role: "Staff Mentorship for EXPECTIK (Department Orientation)",
      period: "20 December 2023 – 15 February 2024",
      description:
        "Responsible for supervising and mobilizing participants, handling permits, and relaying information from the academic and public relations departments. Acted as a platform for interaction and discussion among participants.",
      image: "/EXPECTIK-2023.png",
    },
    {
      title: "Badan Eksekutif Mahasiswa (BEM) - Politeknik Negeri Jakarta",
      role: "Staff for PNJ 2024 Olympic Competition (Photography Contest)",
      period: "5 May 2024 – 6 July 2024",
      description:
        "Responsible for planning, executing, and administrating the photography contest, coordinating with participants and judges, and providing key information throughout the competition.",
      image: "/OP-2024.png",
    },
    {
      title: "Himpunan Mahasiswa TIK - Politeknik Negeri Jakarta",
      role: "Head of Operations for EXPECTIK (Department Orientation)",
      period: "30 August 2024 – 11 November 2024",
      description:
        "Led and managed the operational aspects of the event, ensuring smooth logistics, coordination, and communication between teams and participants, and overseeing the overall execution of the event.",
      image: "/EXPECTIK-2024.png",
    },
  ];

  // Skills data
  const skillsData = [
    {
      category: "Backend Development",
      skills: [
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
        "Vue.js",
        "JavaScript/TypeScript",
        "Bootstrap",
        "Chakra-UI",
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
        "Agile Methodologies",
        "Google Cloud Services",
        "Technical Documentation",
      ],
    },
  ];

  // Handle scroll for progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const currentScroll = document.documentElement.scrollTop;
      const scrollPercentage = (currentScroll / totalScroll) * 100;
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Back to top button functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Animation for floating button
  const floatingAnimation = keyframes`
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  `;

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields correctly.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    // EmailJS configuration using environment variables
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    // Check if env variables are set
    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS environment variables are not set");
      toast({
        title: "Configuration Error",
        description:
          "Email service is not properly configured. Please contact the administrator.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    // Prepare template parameters
    const templateParams = {
      to_email: "mr.auriorajaa@gmail.com",
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      })
      .catch((err) => {
        console.error("FAILED...", err);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/CV_AurioRajaa.pdf";
    link.download = "CV_AurioRajaa.pdf";
    link.click();
  };

  return (
    <Box position="relative" bg={bgColor}>
      {/* Header/Navbar */}
      <Box
        as="header"
        position="sticky"
        top="0"
        width="100%"
        zIndex="1000"
        bg={cardBg}
        borderBottom="1px"
        borderColor={borderColor}
        backdropFilter="blur(10px)"
        boxShadow="md"
        transition="all 0.3s ease-in-out"
      >
        <Container maxW="container.xl">
          <Flex py={4} align="center" justify="space-between">
            <Heading as="h1" size="md" fontWeight="bold">
              AR.
            </Heading>

            {/* Desktop Navigation */}
            <HStack spacing={6} display={{ base: "none", md: "flex" }}>
              <Link href="#work" fontWeight="medium">
                Work
              </Link>
              <Link href="#activities" fontWeight="medium">
                Activities
              </Link>
              <Link href="#skills" fontWeight="medium">
                Skills
              </Link>
              <Link href="#achievements" fontWeight="medium">
                Achievements
              </Link>
              <Link href="#contact" fontWeight="medium">
                Contact
              </Link>
              <Button
                onClick={handleDownload}
                leftIcon={<FiDownload />}
                backgroundColor={bgColor}
                variant="outline"
                size="md"
                _hover={{
                  backgroundColor: bgColor,
                  transform: "scale(1.05)",
                }}
              >
                Download CV
              </Button>

              <IconButton
                icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
                aria-label="Toggle theme"
                onClick={toggleColorMode}
                variant="ghost"
                size="lg"
                _hover={{
                  transform: "scale(1.2)",
                }}
                transition="all 0.3s ease-in-out"
              />
            </HStack>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Open menu"
              icon={<FiMenu />}
              onClick={onOpen} // ✅ Buka menu dengan benar
              variant="ghost"
            />
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={cardBg} zIndex="overlay">
          {" "}
          {/* ✅ Pastikan Drawer muncul di atas header */}
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
            Menu
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="flex-start" onClick={onClose}>
              <Link href="#work" fontWeight="medium">
                Work
              </Link>
              <Link href="#activities" fontWeight="medium">
                Activities
              </Link>
              <Link href="#skills" fontWeight="medium">
                Skills
              </Link>
              <Link href="#achievements" fontWeight="medium">
                Achievements
              </Link>
              <Link href="#contact" fontWeight="medium">
                Contact
              </Link>

              {/* ✅ HStack untuk Download CV & Dark Mode Toggle */}
              <HStack spacing={3} w="full">
                <Button
                  onClick={handleDownload}
                  leftIcon={<FiDownload />}
                  backgroundColor={bgColor}
                  variant="outline"
                  size="md"
                  flex="1" // ✅ **Biar rapi & proporsional di mobile**
                  _hover={{
                    backgroundColor: bgColor,
                    transform: "scale(1.05)",
                  }}
                >
                  Download CV
                </Button>

                <IconButton
                  icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
                  aria-label="Toggle theme"
                  onClick={toggleColorMode}
                  variant="ghost"
                  size="md" // ✅ **Lebih kecil agar sejajar dengan button**
                  _hover={{
                    transform: "scale(1.2)",
                  }}
                  transition="all 0.3s ease-in-out"
                />
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Hero Section */}
      <Box
        as="section"
        minH="100vh"
        display="flex"
        pt={{ base: "70px", md: "140px" }}
        bg={bgColor}
      >
        <Container maxW="container.xl">
          <ChakraBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Grid
              templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
              gap={8}
              alignItems="center"
            >
              <GridItem>
                <VStack
                  spacing={5}
                  align={{ base: "center", lg: "flex-start" }}
                  textAlign={{ base: "center", lg: "left" }}
                >
                  <Text color={textSecondary} fontWeight="medium">
                    Hello, I'm
                  </Text>
                  <Heading
                    as="h1"
                    size="2xl"
                    fontWeight="bold"
                    lineHeight="shorter"
                  >
                    Aurio Rajaa
                  </Heading>
                  <Heading
                    as="h2"
                    size="md"
                    color={textBody}
                    fontWeight="medium"
                    letterSpacing="wider"
                  >
                    Software Engineer
                  </Heading>
                  <Text fontSize="md" color={textSecondary} maxW="600px">
                    Specialized in Django REST Framework backend and
                    React/Vue.js frontend development. Java enthusiast currently
                    studying at Polytechnic State of Jakarta with a passion for
                    creating elegant, scalable solutions.
                  </Text>

                  <HStack spacing={4} wrap="wrap">
                    <Button
                      as="a"
                      href="#work"
                      color={textPrimary}
                      backgroundColor={bgColor}
                      variant={"outline"}
                      size="md"
                      leftIcon={<FiCodepen />}
                      _hover={{
                        backgroundColor: bgColor,
                        transform: "scale(1.05)",
                      }}
                      _active={{
                        backgroundColor: bgColor,
                        transform: "scale(1)",
                      }}
                      _focus={{
                        boxShadow: "outline",
                      }}
                    >
                      View My Work
                    </Button>
                    <Button
                      as="a"
                      href="#contact"
                      color={textPrimary}
                      backgroundColor={bgColor}
                      variant={"outline"}
                      size="md"
                      leftIcon={<FiMail />}
                      _hover={{
                        backgroundColor: bgColor,
                        transform: "scale(1.05)",
                      }}
                      _active={{
                        backgroundColor: bgColor,
                        transform: "scale(1)",
                      }}
                      _focus={{
                        boxShadow: "outline",
                      }}
                    >
                      Contact Me
                    </Button>
                  </HStack>

                  <HStack spacing={4} pt={4}>
                    <IconButton
                      as="a"
                      href="https://github.com/auriorajaa"
                      target="_blank"
                      aria-label="GitHub"
                      icon={<FiGithub />}
                      color={textBody}
                      variant="ghost"
                      size="lg"
                      borderRadius="full"
                    />
                    <IconButton
                      as="a"
                      href="https://linkedin.com/in/auriorajaa"
                      target="_blank"
                      aria-label="LinkedIn"
                      icon={<FiLinkedin />}
                      color={textBody}
                      variant="ghost"
                      size="lg"
                      borderRadius="full"
                    />
                    <IconButton
                      as="a"
                      href="mailto:mr.auriorajaa@gmail.com"
                      aria-label="Email"
                      icon={<FiMail />}
                      color={textBody}
                      variant="ghost"
                      size="lg"
                      borderRadius="full"
                    />
                  </HStack>
                </VStack>
              </GridItem>
              <GridItem>
                <ChakraBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  textAlign="center"
                >
                  <Box
                    borderRadius="full"
                    overflow="hidden"
                    boxSize={{ base: "250px", md: "350px", lg: "400px" }}
                    mx="auto"
                    border="5px solid"
                    borderColor={borderColor}
                    boxShadow="xl"
                    position="relative"
                  >
                    <Image
                      src="/profilepic.jpg"
                      alt="Aurio Rajaa"
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                </ChakraBox>
              </GridItem>
            </Grid>
          </ChakraBox>
        </Container>
      </Box>

      {/* Education Section */}
      <Box as="section" id="education" py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading as="h2" size="xl" textAlign="center">
              Education Journey
            </Heading>
            <Box w="full" maxW="container.md" mx="auto">
              {educationData.map((item, index) => (
                <TimelineItem key={index} {...item} />
              ))}
            </Box>

            {/* Stats Section */}
            {/* <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={6}
              w="full"
              maxW="container.lg"
            >
              <Stat
                px={6}
                py={5}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                shadow="md"
              >
                <StatLabel fontWeight="medium" isTruncated>
                  Current Semester
                </StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold">
                  4th
                </StatNumber>
                <StatHelpText>2022-2024</StatHelpText>
              </Stat>

              <Stat
                px={6}
                py={5}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                shadow="md"
              >
                <StatLabel fontWeight="medium" isTruncated>
                  Projects Completed
                </StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold">
                  12+
                </StatNumber>
                <StatHelpText>Including course projects</StatHelpText>
              </Stat>

              <Stat
                px={6}
                py={5}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                shadow="md"
              >
                <StatLabel fontWeight="medium" isTruncated>
                  Hackathons
                </StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold">
                  3
                </StatNumber>
                <StatHelpText>Placed in top 3 twice</StatHelpText>
              </Stat>

              <Stat
                px={6}
                py={5}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                shadow="md"
              >
                <StatLabel fontWeight="medium" isTruncated>
                  Technical Workshops
                </StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold">
                  8
                </StatNumber>
                <StatHelpText>Conducted as mentor</StatHelpText>
              </Stat>
            </SimpleGrid> */}
          </VStack>
        </Container>
      </Box>

      {/* University Activities Section */}
      <Box as="section" id="activities" py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={10}>
            <Heading as="h2" size="xl" textAlign="center">
              University Activities
            </Heading>
            <Text
              maxW="container.md"
              textAlign="center"
              color={textSecondary}
              fontSize="lg"
            >
              My involvement in various activities at Polytechnic State of
              Jakarta has shaped my technical skills and leadership abilities.
            </Text>

            {/* ✅ Gunakan SimpleGrid untuk tata letak horizontal */}
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }} // ✅ 1 kolom di mobile, 2 di tablet, 3 di desktop
              spacing={6}
              w="100%"
            >
              {universityActivities.map((activity, index) => (
                <ActivityCard key={index} {...activity} />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Skills Section */}
      <Box as="section" id="skills" py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={10}>
            <Heading color={textPrimary} as="h2" size="xl" textAlign="center">
              Skills & Expertise
            </Heading>
            <Text
              maxW="container.md"
              textAlign="center"
              color={textSecondary}
              fontSize="lg"
            >
              My technical toolkit spans multiple domains with a focus on
              full-stack development and Java programming.
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
              {skillsData.map((category, index) => (
                <SkillCategory key={index} {...category} />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Projects Section */}
      <Box as="section" id="work" py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={10}>
            <Heading color={textPrimary} as="h2" size="xl" textAlign="center">
              Featured Projects
            </Heading>
            <Text
              maxW="container.md"
              textAlign="center"
              color={textSecondary}
              fontSize="lg"
            >
              A selection of my recent work, showcasing my technical skills and
              problem-solving abilities.
            </Text>

            {/* Project Filters */}
            <HStack spacing={4} py={4} wrap="wrap" justify="center">
              <Button
                variant={activeFilter === "all" ? "solid" : "ghost"}
                color={activeFilter === "all" ? textPrimary : textSecondary}
                onClick={() => setActiveFilter("all")}
                mb={{ base: 2, md: 0 }}
              >
                All
              </Button>
              <Button
                variant={activeFilter === "react" ? "solid" : "ghost"}
                color={activeFilter === "react" ? textPrimary : textSecondary}
                onClick={() => setActiveFilter("react")}
                mb={{ base: 2, md: 0 }}
              >
                React
              </Button>
              <Button
                variant={activeFilter === "django" ? "solid" : "ghost"}
                color={activeFilter === "django" ? textPrimary : textSecondary}
                onClick={() => setActiveFilter("django")}
                mb={{ base: 2, md: 0 }}
              >
                Django
              </Button>
              <Button
                variant={activeFilter === "java" ? "solid" : "ghost"}
                color={activeFilter === "java" ? textPrimary : textSecondary}
                onClick={() => setActiveFilter("java")}
                mb={{ base: 2, md: 0 }}
              >
                Java
              </Button>
            </HStack>

            {/* Projects Grid */}
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={6}
              w="100%"
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Achievements Section */}
      <Box as="section" id="achievements" py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={10}>
            <Heading color={textPrimary} as="h2" size="xl" textAlign="center">
              Certifications & Achievements
            </Heading>
            <Text
              maxW="container.md"
              textAlign="center"
              color={textSecondary}
              fontSize="lg"
            >
              Recognition of my dedication to continuous learning and
              professional growth.
            </Text>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={6}
              w="100%"
            >
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} {...achievement} />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box as="section" id="contact" py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
            <VStack spacing={6} align={{ base: "center", lg: "flex-start" }}>
              <Heading color={textPrimary} as="h2" size="xl">
                Let's Connect
              </Heading>
              <Text color={textSecondary} fontSize="lg" maxW="md">
                Interested in working together or have a question? Feel free to
                reach out through any of these channels.
              </Text>

              <List spacing={4} mt={4} w="full" maxW="md">
                <ListItem>
                  <HStack>
                    <Box as={FiMail} color={textSecondary} fontSize="xl" />
                    <Link
                      href="mailto:mr.auriorajaa@gmail.com
"
                      fontWeight="medium"
                    >
                      mr.auriorajaa@gmail.com
                    </Link>
                  </HStack>
                </ListItem>
                <ListItem>
                  <HStack>
                    <Box as={FiLinkedin} color={textSecondary} fontSize="xl" />
                    <Link
                      href="https://linkedin.com/in/auriorajaa"
                      isExternal
                      fontWeight="medium"
                    >
                      linkedin.com/in/auriorajaa
                    </Link>
                  </HStack>
                </ListItem>
                <ListItem>
                  <HStack>
                    <Box as={FiGithub} color={textSecondary} fontSize="xl" />
                    <Link
                      href="https://github.com/auriorajaa"
                      isExternal
                      fontWeight="medium"
                    >
                      github.com/auriorajaa
                    </Link>
                  </HStack>
                </ListItem>
              </List>
            </VStack>

            <Box borderWidth="2px" borderRadius="lg" p={6} bg={bgColor}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isInvalid={errors.name}>
                    <FormLabel htmlFor="name" srOnly>
                      Your Name
                    </FormLabel>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      size="lg"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.email}>
                    <FormLabel htmlFor="email" srOnly>
                      Your Email
                    </FormLabel>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Your Email"
                      size="lg"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.subject}>
                    <FormLabel htmlFor="subject" srOnly>
                      Subject
                    </FormLabel>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      size="lg"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.subject}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.message}>
                    <FormLabel htmlFor="message" srOnly>
                      Your Message
                    </FormLabel>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your Message"
                      size="lg"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.message}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    color={textPrimary}
                    variant="outline"
                    size="md"
                    width="full"
                    leftIcon={isLoading ? null : <FiMail />}
                    isLoading={isLoading}
                    loadingText="Sending..."
                    _hover={{
                      backgroundColor: bgColor,
                      transform: "scale(1.05)",
                    }}
                    _active={{
                      backgroundColor: bgColor,
                      transform: "scale(1)",
                    }}
                    _focus={{
                      boxShadow: "outline",
                    }}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </VStack>
              </form>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" py={10} bg={cardBg}>
        <Container maxW="container.xl">
          <VStack spacing={6}>
            <Text textAlign="center" color={textPrimary}>
              © {new Date().getFullYear()} Aurio Rajaa. All rights reserved.
            </Text>
            <Text fontSize="sm" color={textSecondary} textAlign="center">
              Designed and built with 💻 using React, Chakra UI, and Framer
              Motion
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Back to top button */}
      <IconButton
        icon={<FiArrowUp />}
        aria-label="Back to top"
        position="fixed"
        right="5"
        bottom="5"
        color={textPrimary}
        size="lg"
        isRound
        boxShadow="lg"
        display={scrollProgress > 20 ? "flex" : "none"}
        onClick={scrollToTop}
        zIndex="tooltip"
        as={motion.button}
        animation={`${floatingAnimation} 2s ease-in-out infinite`}
      />
    </Box>
  );
};

export default App;
