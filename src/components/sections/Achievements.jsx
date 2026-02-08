import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Award } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import CertificateModal from "../ui/CertificateModal";

const Achievements = () => {
  const { portfolioData } = usePortfolio();
  const achievements = portfolioData.achievements || [];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCert, setSelectedCert] = useState(null);

  const handleOpen = (achievement) => {
    setSelectedCert(achievement);
    onOpen();
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="facebook.border"
      borderRadius="2px"
      mb={4}
      id="achievements"
    >
      {/* Section Header */}
      <Flex
        borderBottom="1px solid"
        borderColor="facebook.border"
        px={3}
        py={2}
        align="center"
        gap={2}
        bg="facebook.gray"
      >
        <Award size={14} color="#3b5998" />
        <Text fontSize="12px" fontWeight="bold" color="facebook.text">
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
            borderColor="facebook.border"
            cursor="pointer"
            _hover={{ bg: "facebook.gray" }}
            onClick={() => handleOpen(achievement)}
          >
            <Flex gap={3}>
              <Box
                flexShrink={0}
                w="60px"
                h="60px"
                border="1px solid"
                borderColor="facebook.border"
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
                  <Award size={11} color="#3b5998" />
                  <Text
                    fontSize="10px"
                    color="facebook.linkBlue"
                    fontWeight="bold"
                  >
                    CERTIFICATE
                  </Text>
                </Flex>
                <Text
                  fontSize="12px"
                  fontWeight="bold"
                  color="facebook.text"
                  lineHeight="1.3"
                >
                  {achievement.title}
                </Text>
                <Text fontSize="11px" color="facebook.lightText">
                  {achievement.issuer} · {achievement.date}
                </Text>
                <Text fontSize="10px" color="facebook.linkBlue" mt={1}>
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
