// src/components/admin/AchievementManager.jsx
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
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  getPortfolioData,
  updateAchievements,
} from "../../services/portfolioService";
import AchievementForm from "./AchievementForm";
import Pagination from "../ui/Pagination";

const AchievementManager = () => {
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const achievementsPerPage = 5;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadAchievements();
    // eslint-disable-next-line
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioData();
      setAchievements(data?.achievements || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load achievements",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedAchievement(null);
    onOpen();
  };

  const handleEdit = (achievement) => {
    setSelectedAchievement(achievement);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this achievement?")) {
      return;
    }

    try {
      const updated = achievements.filter((a) => a.id !== id);
      await updateAchievements(updated);
      setAchievements(updated);
      toast({
        title: "Success",
        description: "Achievement deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete achievement",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = async (achievementData) => {
    try {
      let updated;
      if (selectedAchievement) {
        updated = achievements.map((a) =>
          a.id === selectedAchievement.id
            ? { ...achievementData, id: selectedAchievement.id }
            : a,
        );
      } else {
        const newAchievement = { ...achievementData, id: Date.now() };
        updated = [...achievements, newAchievement];
      }

      await updateAchievements(updated);
      setAchievements(updated);
      onClose();
      toast({
        title: "Success",
        description: selectedAchievement
          ? "Achievement updated successfully"
          : "Achievement created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save achievement",
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
  const totalPages = Math.ceil(achievements.length / achievementsPerPage);
  const indexOfLast = currentPage * achievementsPerPage;
  const indexOfFirst = indexOfLast - achievementsPerPage;
  const currentAchievements = achievements.slice(indexOfFirst, indexOfLast);

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <Text fontSize="11px" color="facebook.text">
          Total: {achievements.length} achievements
        </Text>
        <Button
          leftIcon={<AddIcon boxSize={3} />}
          size="xs"
          variant="facebook"
          onClick={handleCreate}
          fontSize="10px"
          h="22px"
          px={2}
        >
          Add Achievement
        </Button>
      </HStack>

      {achievements.length === 0 ? (
        <Box
          p={6}
          textAlign="center"
          bg="white"
          borderRadius="2px"
          border="1px solid"
          borderColor="facebook.border"
        >
          <Text fontSize="11px" color="facebook.lightText">
            No achievements yet. Add your first achievement!
          </Text>
        </Box>
      ) : (
        <>
          <VStack spacing={0} align="stretch">
            {currentAchievements.map((achievement, idx) => (
              <Box
                key={achievement.id}
                px={3}
                py={2}
                bg="white"
                borderBottom={
                  idx !== currentAchievements.length - 1 ? "1px solid" : "none"
                }
                borderColor="facebook.border"
              >
                <HStack spacing={3} align="start">
                  {achievement.image && (
                    <Box
                      flexShrink={0}
                      w="50px"
                      h="50px"
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
                  )}
                  <VStack align="start" flex={1} spacing={1}>
                    <Text
                      fontSize="12px"
                      fontWeight="bold"
                      color="facebook.blue"
                    >
                      {achievement.title}
                    </Text>
                    <Text fontSize="11px" color="facebook.text">
                      {achievement.issuer}
                    </Text>
                    <Text fontSize="10px" color="facebook.lightText">
                      {achievement.date}
                    </Text>
                  </VStack>
                  <HStack spacing={1}>
                    <IconButton
                      icon={<EditIcon boxSize={3} />}
                      size="xs"
                      variant="facebookGray"
                      onClick={() => handleEdit(achievement)}
                      aria-label="Edit"
                      h="24px"
                      minW="24px"
                    />
                    <IconButton
                      icon={<DeleteIcon boxSize={3} />}
                      size="xs"
                      bg="#ffebee"
                      color="#d32f2f"
                      onClick={() => handleDelete(achievement.id)}
                      aria-label="Delete"
                      h="24px"
                      minW="24px"
                      _hover={{ bg: "#ffcdd2" }}
                    />
                  </HStack>
                </HStack>
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
            {selectedAchievement ? "Edit Achievement" : "Add Achievement"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <AchievementForm
              data={selectedAchievement}
              onSave={handleSave}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AchievementManager;
