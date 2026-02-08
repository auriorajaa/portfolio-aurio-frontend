// src/components/admin/ActivityManager.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  IconButton,
  Image,
  Spinner,
  Center,
  Badge,
  Stack,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  getPortfolioData,
  updateActivities,
} from "../../services/portfolioService";
import ActivityForm from "./ActivityForm";
import Pagination from "../ui/Pagination";

const ActivityManager = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 5;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioData();
      setActivities(data?.activities || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load activities",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedActivity(null);
    onOpen();
  };

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      const updated = activities.filter((a) => a.id !== id);
      await updateActivities(updated);
      setActivities(updated);
      toast({
        title: "Success",
        description: "Activity deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete activity",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = async (activityData) => {
    try {
      let updated;
      if (selectedActivity) {
        updated = activities.map((a) =>
          a.id === selectedActivity.id
            ? { ...activityData, id: selectedActivity.id }
            : a,
        );
      } else {
        const newActivity = { ...activityData, id: Date.now() };
        updated = [...activities, newActivity];
      }

      await updateActivities(updated);
      setActivities(updated);
      onClose();
      toast({
        title: "Success",
        description: selectedActivity
          ? "Activity updated successfully"
          : "Activity created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save activity",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center py={6}>
        <Spinner size="lg" color="facebook.blue" />
      </Center>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(activities.length / activitiesPerPage);
  const indexOfLast = currentPage * activitiesPerPage;
  const indexOfFirst = indexOfLast - activitiesPerPage;
  const currentActivities = activities.slice(indexOfFirst, indexOfLast);

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <Text fontSize="13px">Total: {activities.length} activities</Text>
        <Button
          leftIcon={<AddIcon boxSize={3} />}
          size="sm"
          variant="facebook"
          onClick={handleCreate}
          fontSize="12px"
          h="24px"
          px={2}
        >
          Add Activity
        </Button>
      </HStack>

      {activities.length === 0 ? (
        <Box
          p={6}
          textAlign="center"
          borderRadius="2px"
          border="1px solid"
          borderColor="facebook.border"
        >
          <Text fontSize="13px" color="facebook.lightText">
            No activities yet. Add your first activity!
          </Text>
        </Box>
      ) : (
        <>
          <VStack spacing={0} align="stretch">
            {currentActivities.map((activity, idx) => (
              <Box
                key={activity.id}
                px={3}
                py={2}
                borderBottom={
                  idx !== currentActivities.length - 1 ? "1px solid" : "none"
                }
                borderColor="facebook.border"
              >
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={3}
                  align={{ base: "start", md: "start" }}
                >
                  {activity.image && (
                    <Box
                      flexShrink={0}
                      w={{ base: "100%", md: "60px" }}
                      h="60px"
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
                  <VStack align="start" flex={1} spacing={1}>
                    <HStack flexWrap="wrap">
                      <Text
                        fontSize="14px"
                        fontWeight="bold"
                        color="facebook.blue"
                      >
                        {activity.title}
                      </Text>
                      {activity.role && (
                        <Badge
                          bg="facebook.paleBlue"
                          color="facebook.text"
                          fontSize="9px"
                        >
                          {activity.role}
                        </Badge>
                      )}
                    </HStack>
                    {activity.organization && (
                      <Text fontSize="13px">{activity.organization}</Text>
                    )}
                    <Text fontSize="12px" color="facebook.lightText">
                      {activity.period}
                    </Text>
                  </VStack>
                  <HStack
                    spacing={1}
                    alignSelf={{ base: "flex-end", md: "flex-start" }}
                  >
                    <IconButton
                      icon={<EditIcon boxSize={3} />}
                      size="sm"
                      variant="facebookGray"
                      onClick={() => handleEdit(activity)}
                      aria-label="Edit"
                      h="32px"
                      minW="32px"
                    />
                    <IconButton
                      icon={<DeleteIcon boxSize={3} />}
                      size="sm"
                      bg="#ffebee"
                      color="#d32f2f"
                      onClick={() => handleDelete(activity.id)}
                      aria-label="Delete"
                      h="32px"
                      minW="32px"
                      _hover={{ bg: "#ffcdd2" }}
                    />
                  </HStack>
                </Stack>
              </Box>
            ))}
          </VStack>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            {selectedActivity ? "Edit Activity" : "Add Activity"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ActivityForm
              data={selectedActivity}
              onSave={handleSave}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ActivityManager;
