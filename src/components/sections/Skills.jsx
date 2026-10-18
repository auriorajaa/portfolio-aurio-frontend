import React from "react";
import { Box, Flex, Grid, Text, VStack } from "@chakra-ui/react";
import { skillsData } from "../../data/portfolioData";
import { StudioSection, useStudioColors } from "../public/studio";

const SKILL_PHOTOS = [
  // Backend — server room
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=640&q=60",
  // Frontend — laptop with interface code
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=640&q=60",
  // Java — code on a screen
  "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=640&q=60",
  // Tools — circuit board
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=60",
];

const Skills = () => {
  const colors = useStudioColors();

  return (
    <StudioSection id="skills" title="Skills" band>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, minmax(0, 1fr))" }}
        gap={{ base: 6, md: 7 }}
        alignItems="stretch"
      >
        {skillsData.map((category, index) => (
          <Box
            key={category.category}
            display={{ base: "flex", lg: "grid" }}
            flexDirection="column"
            gridTemplateColumns={{ lg: "38% minmax(0, 1fr)" }}
            bg="#ffffff"
            border="1px solid"
            borderColor="#b9c9da"
            boxShadow="0 3px 10px rgba(18,58,99,0.12)"
            overflow="hidden"
            transition="box-shadow .16s ease"
            _hover={{ boxShadow: "0 8px 20px rgba(18,58,99,0.2)" }}
          >
            {/* Photo — left half on wide screens */}
            <Box
              position="relative"
              aspectRatio={{ base: "16 / 8", lg: "auto" }}
              minH={{ lg: "270px" }}
              overflow="hidden"
            >
              <img
                src={SKILL_PHOTOS[index % SKILL_PHOTOS.length]}
                alt={`${category.category} visual`}
                loading="lazy"
                decoding="async"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Box
                position="absolute"
                inset={0}
                bg="linear-gradient(180deg, rgba(9,24,42,0.02) 45%, rgba(9,24,42,0.62) 100%)"
              />
            </Box>

            {/* Category + list */}
            <Flex direction="column" flex="1">
              <Box px={{ base: 5, md: 6 }} pt={5} pb={3}>
                <Box w="36px" h="5px" bg={colors.accent} mb={3} />
                <Text
                  fontSize="19px"
                  fontWeight="700"
                  color={colors.heading}
                  textTransform="uppercase"
                  letterSpacing=".05em"
                >
                  {category.category}
                </Text>
              </Box>

              <VStack align="stretch" spacing={0} px={{ base: 5, md: 6 }} pb={4} flex="1">
                {category.skills.map((skill, skillIndex) => (
                  <Flex
                    key={skill}
                    align="center"
                    gap={3}
                    py="12px"
                    borderBottom={
                      skillIndex === category.skills.length - 1
                        ? "none"
                        : "1px solid"
                    }
                    borderColor={colors.borderSoft}
                  >
                    <Box
                      w="8px"
                      h="8px"
                      flexShrink={0}
                      bg={colors.accent}
                      boxShadow="inset 0 1px 0 rgba(255,255,255,0.4)"
                    />
                    <Text fontSize="16px" fontWeight="600" color={colors.text}>
                      {skill}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Flex>
          </Box>
        ))}
      </Grid>
    </StudioSection>
  );
};

export default Skills;
