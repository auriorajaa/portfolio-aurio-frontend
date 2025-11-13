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
  IconButton,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProjectCard from "../ui/ProjectCard";
import { projects } from "../../data/portfolioData";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const chevronBg = useColorModeValue("white", "#112240");
  const chevronHoverBg = useColorModeValue("gray.50", "#1a2942");

  const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

  const bgGradient = useColorModeValue(
    "linear(to-tr, teal.50, brand.50, blue.100)",
    "linear(to-tr, teal.900, brand.900, blue.900)"
  );

  const ITEMS_PER_PAGE_DESKTOP = 6;
  const ITEMS_PER_PAGE_TABLET = 4;
  const ITEMS_PER_PAGE_MOBILE = 3;

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter));

  // Reset pagination when filter changes
  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    setCurrentPage(0);
    setShowAll(false);
  };

  // Desktop pagination
  const totalPagesDesktop = Math.ceil(
    filteredProjects.length / ITEMS_PER_PAGE_DESKTOP
  );
  const totalPagesTablet = Math.ceil(
    filteredProjects.length / ITEMS_PER_PAGE_TABLET
  );
  const startIndexDesktop = currentPage * ITEMS_PER_PAGE_DESKTOP;
  const endIndexDesktop = startIndexDesktop + ITEMS_PER_PAGE_DESKTOP;
  const startIndexTablet = currentPage * ITEMS_PER_PAGE_TABLET;
  const endIndexTablet = startIndexTablet + ITEMS_PER_PAGE_TABLET;
  const currentProjectsDesktop = filteredProjects.slice(
    startIndexDesktop,
    endIndexDesktop
  );
  const currentProjectsTablet = filteredProjects.slice(
    startIndexTablet,
    endIndexTablet
  );

  // Mobile pagination
  const visibleMobileCount = showAll
    ? filteredProjects.length
    : ITEMS_PER_PAGE_MOBILE;
  const mobileProjects = filteredProjects.slice(0, visibleMobileCount);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      // Scroll to projects section
      document
        .getElementById("projects")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextPage = () => {
    const totalPages =
      window.innerWidth >= 1024 ? totalPagesDesktop : totalPagesTablet;
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      // Scroll to projects section
      document
        .getElementById("projects")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleShowLess = () => {
    setShowAll(false);
    // Scroll to projects section
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
      {/* Decorative Blobs */}
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
          base: 4, // 1rem (mobile) → pas buat HP kecil
          sm: 6, // 1.5rem (sedikit lega di HP besar)
          md: 10, // 2.5rem (tablet biar gak nabrak tapi gak keluar layar)
          lg: 16, // 4rem (desktop normal)
          xl: 18, // 5rem (layar lebar)
        }}
      >
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          {/* Heading */}
          <VStack spacing={4} textAlign="center" pt={{ base: 4, md: 6 }}>
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
              color={textPrimary}
              fontWeight="bold"
            >
              Featured Projects
            </Heading>
            <Text
              color={textSecondary}
              maxW="700px"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.8"
            >
              A selection of my recent work that highlights my technical
              expertise, creativity, and ability to solve real-world problems.
            </Text>
          </VStack>

          {/* Filter Buttons */}
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

          {/* Desktop View with Chevron Navigation */}
          <Box
            w="100%"
            position="relative"
            display={{ base: "none", lg: "block" }}
          >
            {/* Left Chevron */}
            {currentPage > 0 && (
              <IconButton
                icon={<FiChevronLeft />}
                aria-label="Previous page"
                position="absolute"
                left={{ base: "-80px", xl: "-80px" }}
                top="50%"
                transform="translateY(-50%)"
                size="md"
                colorScheme="brand"
                variant="solid"
                bg={chevronBg}
                borderWidth="1px"
                borderColor="brand.500"
                color="brand.500"
                _hover={{
                  bg: chevronHoverBg,
                  transform: "translateY(-50%) scale(1.1)",
                }}
                onClick={handlePrevPage}
                zIndex={2}
                boxShadow="lg"
              />
            )}

            {/* Grid */}
            <SimpleGrid
              columns={3}
              spacing={{ base: 6, md: 8 }}
              w="100%"
              alignItems="stretch"
            >
              {currentProjectsDesktop.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  delay={i * 0.1}
                />
              ))}
            </SimpleGrid>

            {/* Right Chevron */}
            {currentPage < totalPagesDesktop - 1 && (
              <IconButton
                icon={<FiChevronRight />}
                aria-label="Next page"
                position="absolute"
                right={{ base: "-80px", xl: "-80px" }}
                top="50%"
                transform="translateY(-50%)"
                size="md"
                colorScheme="brand"
                variant="solid"
                bg={chevronBg}
                borderWidth="1px"
                borderColor="brand.500"
                color="brand.500"
                _hover={{
                  bg: chevronHoverBg,
                  transform: "translateY(-50%) scale(1.1)",
                }}
                onClick={handleNextPage}
                zIndex={2}
                boxShadow="lg"
              />
            )}

            {/* Page Indicator */}
            {totalPagesDesktop > 1 && (
              <HStack justify="center" mt={8} spacing={2}>
                {Array.from({ length: totalPagesDesktop }).map((_, index) => (
                  <Box
                    key={index}
                    w={currentPage === index ? "24px" : "8px"}
                    h="8px"
                    bg={currentPage === index ? "brand.500" : "gray.300"}
                    borderRadius="full"
                    transition="all 0.3s ease"
                    cursor="pointer"
                    onClick={() => setCurrentPage(index)}
                    _hover={{ bg: "brand.400" }}
                  />
                ))}
              </HStack>
            )}
          </Box>

          {/* Tablet View with Chevron Navigation (2 columns) */}
          <Box
            w="100%"
            position="relative"
            display={{ base: "none", md: "block", lg: "none" }}
          >
            {/* Left Chevron */}
            {currentPage > 0 && (
              <IconButton
                icon={<FiChevronLeft />}
                aria-label="Previous page"
                position="absolute"
                left="-50px"
                top="50%"
                transform="translateY(-50%)"
                size="lg"
                colorScheme="brand"
                variant="solid"
                bg={chevronBg}
                borderWidth="1px"
                borderColor="brand.500"
                color="brand.500"
                _hover={{
                  bg: chevronHoverBg,
                  transform: "translateY(-50%) scale(1.1)",
                }}
                onClick={handlePrevPage}
                zIndex={2}
                boxShadow="lg"
              />
            )}

            {/* Grid */}
            <SimpleGrid
              columns={2}
              spacing={{ base: 6, md: 8 }}
              w="100%"
              alignItems="stretch"
            >
              {currentProjectsTablet.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  delay={i * 0.1}
                />
              ))}
            </SimpleGrid>

            {/* Right Chevron */}
            {currentPage < totalPagesTablet - 1 && (
              <IconButton
                icon={<FiChevronRight />}
                aria-label="Next page"
                position="absolute"
                right="-50px"
                top="50%"
                transform="translateY(-50%)"
                size="lg"
                colorScheme="brand"
                variant="solid"
                bg={chevronBg}
                borderWidth="1px"
                borderColor="brand.500"
                color="brand.500"
                _hover={{
                  bg: chevronHoverBg,
                  transform: "translateY(-50%) scale(1.1)",
                }}
                onClick={handleNextPage}
                zIndex={2}
                boxShadow="lg"
              />
            )}

            {/* Page Indicator */}
            {totalPagesTablet > 1 && (
              <HStack justify="center" mt={8} spacing={2}>
                {Array.from({ length: totalPagesTablet }).map((_, index) => (
                  <Box
                    key={index}
                    w={currentPage === index ? "24px" : "8px"}
                    h="8px"
                    bg={currentPage === index ? "brand.500" : "gray.300"}
                    borderRadius="full"
                    transition="all 0.3s ease"
                    cursor="pointer"
                    onClick={() => setCurrentPage(index)}
                    _hover={{ bg: "brand.400" }}
                  />
                ))}
              </HStack>
            )}
          </Box>

          {/* Mobile View with Load More */}
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

            {/* Load More / Show Less Button */}
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
