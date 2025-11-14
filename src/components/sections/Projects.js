import React, { useState } from "react";

import {
  Box,
  Container,
  VStack,
  Heading,
  keyframes,
  Text,
  useColorModeValue,
  SimpleGrid,
  HStack,
  Button,
} from "@chakra-ui/react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import ProjectCard from "../ui/ProjectCard";
import { projects } from "../../data/portfolioData";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");

  const floatingAnimation = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  `;

  const bgGradient = useColorModeValue(
    "linear(to-tr, teal.50, brand.50, blue.100)",
    "linear(to-tr, teal.900, brand.900, blue.900)"
  );

  const ITEMS_PER_PAGE_MOBILE = 3;

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter));

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    setShowAll(false);
  };

  const visibleMobileCount = showAll
    ? filteredProjects.length
    : ITEMS_PER_PAGE_MOBILE;

  const mobileProjects = filteredProjects.slice(0, visibleMobileCount);

  const handleShowLess = () => {
    setShowAll(false);
    setTimeout(() => {
      document
        .getElementById("projects")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "react", label: "React" },
    { key: "django", label: "Django" },
    { key: "java", label: "Java" },
  ];

  return (
    <Box
      as="section"
      id="projects"
      py={{ base: 12, md: 16, lg: 20 }}
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
    >
      {/* FLOATING BLOBS */}
      <Box
        position="absolute"
        top="10%"
        right="5%"
        w={{ base: "250px", md: "400px" }}
        h={{ base: "250px", md: "400px" }}
        bgGradient="radial(circle, teal.200 0%, transparent 70%)"
        opacity={useColorModeValue(0.35, 0.18)}
        borderRadius="full"
        filter="blur(80px)"
        animation={`${floatingAnimation} 13s ease-in-out infinite`}
      />

      <Box
        position="absolute"
        bottom="20%"
        left="10%"
        w={{ base: "200px", md: "350px" }}
        h={{ base: "200px", md: "350px" }}
        bgGradient="radial(circle, blue.200 0%, transparent 70%)"
        opacity={useColorModeValue(0.35, 0.18)}
        borderRadius="full"
        filter="blur(70px)"
        animation={`${floatingAnimation} 17s ease-in-out infinite reverse`}
      />

      <Container
        maxW="container.xl"
        px={{
          base: 4,
          sm: 6,
          md: 10,
          lg: 16,
          xl: 18,
        }}
      >
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          {/* TITLE */}
          <VStack spacing={4} textAlign="center" pt={{ base: 4, md: 6 }}>
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              color={textPrimary}
              fontWeight="bold"
            >
              Featured Projects
            </Heading>

            <Text
              color={textSecondary}
              maxW="700px"
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              lineHeight="1.8"
            >
              A selection of my recent work that highlights my technical
              expertise, creativity, and ability to solve real-world problems.
            </Text>
          </VStack>

          {/* FILTER BUTTONS */}
          <HStack
            spacing={{ base: 2, md: 3 }}
            wrap="wrap"
            justify="center"
            pt={2}
          >
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "solid" : "outline"}
                colorScheme="brand"
                onClick={() => handleFilterChange(filter.key)}
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "sm", md: "md" }}
                px={{ base: 5, md: 7 }}
                py={{ base: 4, md: 5 }}
                borderRadius="full"
                transition="all 0.2s ease-in-out"
              >
                {filter.label}
              </Button>
            ))}
          </HStack>

          {/* DESKTOP SWIPER (3 columns × 2 rows) */}
          <Box
            w="100%"
            display={{ base: "none", lg: "block" }}
            sx={{
              ".swiper": { paddingBottom: "50px" },
              ".swiper-pagination-bullet": {
                bg: "gray.300",
                opacity: 1,
              },
              ".swiper-pagination-bullet-active": {
                bg: "brand.500",
                width: "24px",
                borderRadius: "4px",
              },
            }}
          >
            <Swiper
              modules={[Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={{ clickable: true }}
              key={activeFilter}
            >
              {Array.from({
                length: Math.ceil(filteredProjects.length / 6),
              }).map((_, slideIndex) => (
                <SwiperSlide key={slideIndex}>
                  <Box
                    px={4}
                    display="grid"
                    gridTemplateColumns="repeat(3, 1fr)"
                    gridTemplateRows="repeat(2, 1fr)"
                    gap={6}
                  >
                    {filteredProjects
                      .slice(slideIndex * 6, slideIndex * 6 + 6)
                      .map((project, i) => (
                        <Box key={project.id} h="100%">
                          <ProjectCard project={project} delay={i * 0.1} />
                        </Box>
                      ))}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          {/* TABLET (2 columns × 2 rows per slide) */}
          <Box
            w="100%"
            display={{ base: "none", md: "block", lg: "none" }}
            sx={{
              ".swiper": { paddingBottom: "50px" },
              ".swiper-pagination-bullet": {
                bg: "gray.300",
                opacity: 1,
              },
              ".swiper-pagination-bullet-active": {
                bg: "brand.500",
                width: "24px",
                borderRadius: "4px",
              },
            }}
          >
            <Swiper
              modules={[Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={{ clickable: true }}
              key={activeFilter}
            >
              {Array.from({
                length: Math.ceil(filteredProjects.length / 4),
              }).map((_, slideIndex) => (
                <SwiperSlide key={slideIndex}>
                  <Box
                    px={4}
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gridTemplateRows="repeat(2, 1fr)"
                    gap={6}
                  >
                    {filteredProjects
                      .slice(slideIndex * 4, slideIndex * 4 + 4)
                      .map((project, i) => (
                        <Box key={project.id} h="100%">
                          <ProjectCard project={project} delay={i * 0.1} />
                        </Box>
                      ))}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          {/* MOBILE */}
          <Box w="100%" display={{ base: "block", md: "none" }}>
            <SimpleGrid columns={1} spacing={{ base: 6, md: 8 }} w="100%">
              {mobileProjects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  delay={i * 0.1}
                />
              ))}
            </SimpleGrid>

            {/* LOAD MORE */}
            {filteredProjects.length > ITEMS_PER_PAGE_MOBILE && (
              <HStack justify="center" mt={8}>
                <Button
                  colorScheme="brand"
                  size="md"
                  onClick={() =>
                    showAll ? handleShowLess() : setShowAll(true)
                  }
                  borderRadius="full"
                  px={{ base: 6, sm: 8 }}
                  py={{ base: 5, sm: 6 }}
                >
                  {showAll
                    ? "Show Less"
                    : `Load More (${
                        filteredProjects.length - ITEMS_PER_PAGE_MOBILE
                      } more)`}
                </Button>
              </HStack>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Projects;
