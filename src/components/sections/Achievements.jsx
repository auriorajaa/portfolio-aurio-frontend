import React, { useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Award } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import CertificateModal from "../ui/CertificateModal";
import { RetroBadge, RetroPanel, useRetroColors } from "../ui/retro";

const Achievements = () => {
  const { portfolioData } = usePortfolio();
  const achievements = portfolioData.achievements || [];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCert, setSelectedCert] = useState(null);
  const colors = useRetroColors();

  const handleOpen = (achievement) => {
    setSelectedCert(achievement);
    onOpen();
  };

  return (
    <RetroPanel
      id="achievements"
      title="Achievements & Certificates"
      icon={Award}
      headerRight={<RetroBadge tone="amber">{achievements.length} awards</RetroBadge>}
      bodyProps={{ p: 0 }}
    >
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={0}>
        {[...achievements].reverse().map((achievement, idx) => (
          <Box
            key={achievement.id || `${achievement.title}-${idx}`}
            p={3}
            borderRight={{ base: "none", lg: idx % 2 === 0 ? "1px solid" : "none" }}
            borderBottom="1px solid"
            borderColor={colors.borderSoft}
            bg={idx % 2 === 0 ? colors.panelBg : colors.panelAlt}
            cursor="pointer"
            _hover={{ bg: colors.paleBlue }}
            onClick={() => handleOpen(achievement)}
          >
            <Flex gap={3}>
              <Box
                flexShrink={0}
                w="78px"
                h="64px"
                border="1px solid"
                borderColor={colors.border}
                overflow="hidden"
                bg={colors.panelBg}
              >
                <Image src={achievement.image} alt={achievement.title} w="100%" h="100%" objectFit="cover" />
              </Box>

              <VStack align="stretch" spacing={1} minW={0} flex={1}>
                <HStack spacing={1}>
                  <RetroBadge tone="amber">Certificate</RetroBadge>
                </HStack>
                <Text fontSize="13px" fontWeight="bold" color={colors.text} noOfLines={2}>
                  {achievement.title}
                </Text>
                <Text fontSize="12px" color={colors.link} fontWeight="bold">
                  {achievement.issuer}
                </Text>
                <Text fontSize="11px" color={colors.muted}>
                  {achievement.date}
                </Text>
              </VStack>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      {selectedCert && (
        <CertificateModal
          isOpen={isOpen}
          onClose={onClose}
          image={selectedCert.image}
          title={selectedCert.title}
        />
      )}
    </RetroPanel>
  );
};

export default Achievements;
