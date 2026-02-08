import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  VStack,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { Award } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import CertificateModal from "../ui/CertificateModal";

const Achievements = () => {
  const { portfolioData } = usePortfolio();
  const achievements = portfolioData.achievements || [];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCert, setSelectedCert] = useState(null);
  const cardBg = useColorModeValue("white", "#242526");
  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const textColor = useColorModeValue("#333333", "#e4e6eb");
  const lightTextColor = useColorModeValue("#90949c", "#b0b3b8");
  const grayBg = useColorModeValue("#f7f7f7", "#242526");
  const iconColor = useColorModeValue("#3b5998", "#5b7ec8");

  const handleOpen = (achievement) => {
    setSelectedCert(achievement);
    onOpen();
  };

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2px"
      mb={4}
      id="achievements"
    >
      {/* Section Header */}
      <Flex
        borderBottom="1px solid"
        borderColor={borderColor}
        px={3}
        py={2}
        align="center"
        gap={2}
        bg={grayBg}
      >
        <Award size={14} color={iconColor} />
        <Text fontSize="14px" fontWeight="bold" color={textColor}>
          Achievements & Certificates
        </Text>
      </Flex>

      {/* Achievements Items */}
      <VStack spacing={0} align="stretch">
        {[...achievements].reverse().map((achievement, idx) => (
          <Box
            key={achievement.id}
            px={3}
            py={3}
            borderBottom={
              idx !== achievements.length - 1 ? "1px solid" : "none"
            }
            borderColor={borderColor}
            cursor="pointer"
            _hover={{ bg: grayBg }}
            onClick={() => handleOpen(achievement)}
          >
            <Flex gap={3}>
              <Box
                flexShrink={0}
                w="60px"
                h="60px"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
              >
                <Image
                  src={achievement.image}
                  alt={achievement.title}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              </Box>

              <Box flex="1">
                <Flex align="center" gap={1} mb={1}>
                  <Award size={11} color={iconColor} />
                  <Text fontSize="12px" color={iconColor} fontWeight="bold">
                    CERTIFICATE
                  </Text>
                </Flex>
                <Text
                  fontSize="14px"
                  fontWeight="bold"
                  color={textColor}
                  lineHeight="1.3"
                >
                  {achievement.title}
                </Text>
                <Text fontSize="13px" color={lightTextColor}>
                  {achievement.issuer} · {achievement.date}
                </Text>
                <Text fontSize="12px" color={iconColor} mt={1}>
                  Click to view certificate
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </VStack>

      {selectedCert && (
        <CertificateModal
          isOpen={isOpen}
          onClose={onClose}
          image={selectedCert.image}
          title={selectedCert.title}
        />
      )}
    </Box>
  );
};

export default Achievements;
