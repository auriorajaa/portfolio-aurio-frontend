import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Activity } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import ActivityModal from "../ui/ActivityModal";

const Activities = () => {
  const { portfolioData } = usePortfolio();
  const universityActivities = portfolioData.activities || [];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleOpen = (activity) => {
    setSelectedActivity(activity);
    onOpen();
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="facebook.border"
      borderRadius="2px"
      mb={4}
      id="activities"
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
        <Activity size={14} color="#3b5998" />
        <Text fontSize="12px" fontWeight="bold" color="facebook.text">
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
            borderColor="facebook.border"
            cursor="pointer"
            _hover={{ bg: "facebook.gray" }}
            onClick={() => handleOpen(activity)}
          >
            <Flex gap={3}>
              {activity.image && (
                <Box
                  flexShrink={0}
                  w="50px"
                  h="50px"
                  border="1px solid"
                  borderColor="facebook.border"
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
                <Text fontSize="12px" fontWeight="bold" color="facebook.text">
                  {activity.title}
                </Text>
                <Text fontSize="11px" color="facebook.linkBlue" mb={1}>
                  {activity.role}
                </Text>
                <Text fontSize="11px" color="facebook.lightText" mb={1}>
                  {activity.period}
                </Text>
                <Text
                  fontSize="11px"
                  color="facebook.text"
                  lineHeight="1.4"
                  noOfLines={2}
                >
                  {activity.description}
                </Text>
                <Text fontSize="10px" color="facebook.linkBlue" mt={1}>
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
