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
import { Activity } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import ActivityModal from "../ui/ActivityModal";

const Activities = () => {
  const { portfolioData } = usePortfolio();
  const universityActivities = portfolioData.activities || [];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Use theme colors
  const cardBg = useColorModeValue("white", "#242526");
  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const headerBg = useColorModeValue("#f7f7f7", "#242526");
  const hoverBg = useColorModeValue("#d8dfea", "#3a3b3c");
  const iconColor = useColorModeValue("#3b5998", "#5b7ec8");
  const lightTextColor = useColorModeValue("#90949c", "#b0b3b8");

  const handleOpen = (activity) => {
    setSelectedActivity(activity);
    onOpen();
  };

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2px"
      mb={4}
      id="activities"
    >
      {/* Section Header */}
      <Flex
        borderBottom="1px solid"
        borderColor={borderColor}
        px={3}
        py={2}
        align="center"
        gap={2}
        bg={headerBg}
      >
        <Activity size={14} color={iconColor} />
        <Text fontSize="14px" fontWeight="bold">
          Activities & Organizations
        </Text>
      </Flex>

      {/* Activities Items */}
      <VStack spacing={0} align="stretch">
        {[...universityActivities].reverse().map((activity, idx) => (
          <Box
            key={idx}
            px={3}
            py={3}
            borderBottom={
              idx !== universityActivities.length - 1 ? "1px solid" : "none"
            }
            borderColor={borderColor}
            cursor="pointer"
            _hover={{ bg: hoverBg }}
            onClick={() => handleOpen(activity)}
          >
            <Flex gap={3}>
              {activity.image && (
                <Box
                  flexShrink={0}
                  w="50px"
                  h="50px"
                  border="1px solid"
                  borderColor={borderColor}
                  overflow="hidden"
                >
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
              )}

              <Box flex="1">
                <Text fontSize="14px" fontWeight="bold">
                  {activity.title}
                </Text>
                <Text fontSize="13px" color={iconColor} mb={1}>
                  {activity.role}
                </Text>
                <Text fontSize="13px" color={lightTextColor} mb={1}>
                  {activity.period}
                </Text>
                <Text fontSize="13px" lineHeight="1.4" noOfLines={2}>
                  {activity.description}
                </Text>
                <Text fontSize="12px" color={iconColor} mt={1}>
                  Click to view details
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </VStack>

      {selectedActivity && (
        <ActivityModal
          isOpen={isOpen}
          onClose={onClose}
          activity={selectedActivity}
        />
      )}
    </Box>
  );
};

export default Activities;
