import React, { useState } from "react";
import {
  Box,
  Flex,
  Image,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Activity } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import ActivityModal from "../ui/ActivityModal";
import { RetroPanel, useRetroColors } from "../ui/retro";

const Activities = () => {
  const { portfolioData } = usePortfolio();
  const universityActivities = portfolioData.activities || [];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const colors = useRetroColors();

  const handleOpen = (activity) => {
    setSelectedActivity(activity);
    onOpen();
  };

  return (
    <RetroPanel
      id="activities"
      title="Activities & Organizations"
      icon={Activity}
      // headerRight={<RetroBadge>{universityActivities.length} logs</RetroBadge>}
      bodyProps={{ p: 0 }}
    >
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={0}>
        {[...universityActivities].reverse().map((activity, idx) => (
          <Box
            key={`${activity.title}-${idx}`}
            p={3}
            borderRight={{ base: "none", lg: idx % 2 === 0 ? "1px solid" : "none" }}
            borderBottom="1px solid"
            borderColor={colors.borderSoft}
            bg={idx % 2 === 0 ? colors.panelBg : colors.panelAlt}
            cursor="pointer"
            _hover={{ bg: colors.paleBlue }}
            onClick={() => handleOpen(activity)}
          >
            <Flex gap={3}>
              {activity.image && (
                <Box
                  flexShrink={0}
                  w="78px"
                  h="64px"
                  border="1px solid"
                  borderColor={colors.border}
                  overflow="hidden"
                  bg={colors.panelBg}
                >
                  <Image src={activity.image} alt={activity.title} w="100%" h="100%" objectFit="cover" />
                </Box>
              )}

              <VStack align="stretch" spacing={1} minW={0} flex={1}>
                {/* <HStack spacing={1}>
                  <RetroBadge tone="green">Organization</RetroBadge>
                </HStack> */}
                <Text fontSize="16px" fontWeight="bold" color={colors.text} noOfLines={2}>
                  {activity.title}
                </Text>
                <Text fontSize="15px" color={colors.link} fontWeight="bold" noOfLines={1}>
                  {activity.role}
                </Text>
                <Text fontSize="14px" color={colors.muted}>
                  {activity.period}
                </Text>
                <Text fontSize="15px" color={colors.text} lineHeight="1.4" noOfLines={2}>
                  {activity.description}
                </Text>
              </VStack>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      {selectedActivity && (
        <ActivityModal isOpen={isOpen} onClose={onClose} activity={selectedActivity} />
      )}
    </RetroPanel>
  );
};

export default Activities;
