// src/components/admin/EducationManager.jsx
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
  Badge,
  Spinner,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  getPortfolioData,
  updateEducation,
  updateCertifications,
} from "../../services/portfolioService";
import EducationForm from "./EducationForm";
import Pagination from "../ui/Pagination";

const EducationManager = () => {
  const [educationList, setEducationList] = useState([]);
  const [certificationsList, setCertificationsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editType, setEditType] = useState("education"); // "education" or "certification"
  const [loading, setLoading] = useState(true);
  const [educationPage, setEducationPage] = useState(1);
  const [certificationPage, setCertificationPage] = useState(1);
  const itemsPerPage = 5;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioData();
      setEducationList(data?.education || []);
      setCertificationsList(data?.certifications || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load education data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (type) => {
    setSelectedItem(null);
    setEditType(type);
    onOpen();
  };

  const handleEdit = (item, type) => {
    setSelectedItem(item);
    setEditType(type);
    onOpen();
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      if (type === "education") {
        const updated = educationList.filter((item) => item.title !== id);
        await updateEducation(updated);
        setEducationList(updated);
      } else {
        const updated = certificationsList.filter((item) => item.title !== id);
        await updateCertifications(updated);
        setCertificationsList(updated);
      }
      toast({
        title: "Success",
        description: `${type === "education" ? "Education" : "Certification"} deleted successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = async (itemData) => {
    try {
      let updated;
      if (editType === "education") {
        if (selectedItem) {
          updated = educationList.map((item) =>
            item.title === selectedItem.title ? itemData : item,
          );
        } else {
          updated = [...educationList, itemData];
        }
        await updateEducation(updated);
        setEducationList(updated);
      } else {
        if (selectedItem) {
          updated = certificationsList.map((item) =>
            item.title === selectedItem.title ? itemData : item,
          );
        } else {
          updated = [...certificationsList, itemData];
        }
        await updateCertifications(updated);
        setCertificationsList(updated);
      }

      onClose();
      toast({
        title: "Success",
        description: selectedItem
          ? "Updated successfully"
          : "Created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderList = (list, type, currentPage, setCurrentPage) => {
    if (list.length === 0) {
      return (
        <Box
          p={6}
          textAlign="center"
          borderRadius="2px"
          border="1px solid"
          borderColor="facebook.border"
        >
          <Text fontSize="13px" color="facebook.lightText">
            No {type === "education" ? "education" : "certifications"} yet. Add
            your first one!
          </Text>
        </Box>
      );
    }

    // Pagination
    const totalPages = Math.ceil(list.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = list.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        <VStack spacing={2} align="stretch" mb={3}>
          {currentItems.map((item, index) => (
            <Box
              key={index}
              px={3}
              py={2}
              borderRadius="2px"
              border="1px solid"
              borderColor="facebook.border"
            >
              <HStack justify="space-between" align="start">
                <VStack align="start" flex={1} spacing={0.5}>
                  <Text fontSize="14px" fontWeight="bold" color="facebook.blue">
                    {item.title}
                  </Text>
                  <Text fontSize="13px">{item.major || item.degree}</Text>
                  <Text fontSize="12px" color="facebook.lightText">
                    {item.period}
                  </Text>
                  <HStack spacing={1.5} mt={1}>
                    <Badge
                      bg={item.type === "formal" ? "purple.100" : "green.100"}
                      color={
                        item.type === "formal" ? "purple.700" : "green.700"
                      }
                      fontSize="9px"
                      px={2}
                      py={0.5}
                      borderRadius="2px"
                    >
                      {item.type}
                    </Badge>
                    <Badge
                      bg="facebook.paleBlue"
                      color="facebook.blue"
                      fontSize="9px"
                      px={2}
                      py={0.5}
                      borderRadius="2px"
                    >
                      {item.status}
                    </Badge>
                  </HStack>
                </VStack>
                <HStack spacing={1}>
                  <IconButton
                    icon={<EditIcon boxSize={2.5} />}
                    size="sm"
                    h="24px"
                    variant="facebookGray"
                    onClick={() => handleEdit(item, type)}
                    aria-label="Edit"
                  />
                  <IconButton
                    icon={<DeleteIcon boxSize={2.5} />}
                    size="sm"
                    h="24px"
                    bg="#ffebee"
                    color="#d32f2f"
                    onClick={() => handleDelete(item.title, type)}
                    aria-label="Delete"
                    _hover={{ bg: "#ffcdd2" }}
                  />
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </>
    );
  };

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="facebook.blue" />
      </Center>
    );
  }

  return (
    <Box>
      <Tabs colorScheme="blue" size="sm">
        <TabList borderColor="facebook.border">
          <Tab
            fontSize="13px"
            fontWeight="bold"
            _selected={{ color: "facebook.blue", borderColor: "facebook.blue" }}
          >
            Formal Education ({educationList.length})
          </Tab>
          <Tab
            fontSize="13px"
            fontWeight="bold"
            _selected={{ color: "facebook.blue", borderColor: "facebook.blue" }}
          >
            Certifications & Bootcamps ({certificationsList.length})
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0} py={3}>
            <HStack justify="space-between" mb={3}>
              <Text fontSize="14px" fontWeight="bold">
                Formal Education
              </Text>
              <Button
                leftIcon={<AddIcon boxSize={2.5} />}
                variant="facebook"
                onClick={() => handleCreate("education")}
                size="sm"
                h="32px"
                fontSize="12px"
              >
                Add Education
              </Button>
            </HStack>
            {renderList(
              educationList,
              "education",
              educationPage,
              setEducationPage,
            )}
          </TabPanel>

          <TabPanel px={0} py={3}>
            <HStack justify="space-between" mb={3}>
              <Text fontSize="14px" fontWeight="bold">
                Certifications & Bootcamps
              </Text>
              <Button
                leftIcon={<AddIcon boxSize={2.5} />}
                variant="facebook"
                onClick={() => handleCreate("certification")}
                size="sm"
                h="32px"
                fontSize="12px"
              >
                Add Certification
              </Button>
            </HStack>
            {renderList(
              certificationsList,
              "certification",
              certificationPage,
              setCertificationPage,
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            {selectedItem ? "Edit" : "Add"}{" "}
            {editType === "education" ? "Education" : "Certification"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <EducationForm
              data={selectedItem}
              type={editType}
              onSave={handleSave}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EducationManager;
