// src/components/admin/AchievementForm.jsx
import React, { useState, useEffect } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  HStack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import ImageUpload from "../ui/ImageUpload";
import { uploadImageWithProgress } from "../../services/cloudinaryService";

const AchievementForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.issuer || !formData.date) {
      toast({
        title: "Validation Error",
        description: "Title, issuer, and date are required fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    onOpen();
  };

  const confirmSave = async () => {
    setLoading(true);
    onClose();

    try {
      let finalFormData = { ...formData };

      if (formData.image && formData.image.startsWith("data:")) {
        const response = await fetch(formData.image);
        const blob = await response.blob();
        const file = new File([blob], "achievement-image.jpg", {
          type: "image/jpeg",
        });
        const uploadedUrl = await uploadImageWithProgress(file);
        finalFormData.image = uploadedUrl;
      }

      onSave(finalFormData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save achievement",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={3} align="stretch">
        <FormControl isRequired>
          <FormLabel fontSize="11px" fontWeight="bold" mb={1}>
            Achievement Title
          </FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Best Paper Award"
            size="sm"
            fontSize="11px"
            borderRadius="2px"
            borderColor="facebook.border"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="11px" fontWeight="bold" mb={1}>
            Issuer/Organization
          </FormLabel>
          <Input
            name="issuer"
            value={formData.issuer}
            onChange={handleInputChange}
            placeholder="e.g. IEEE Conference"
            size="sm"
            fontSize="11px"
            borderRadius="2px"
            borderColor="facebook.border"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="11px" fontWeight="bold" mb={1}>
            Date
          </FormLabel>
          <Input
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            placeholder="e.g. January 2024"
            size="sm"
            fontSize="11px"
            borderRadius="2px"
            borderColor="facebook.border"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="11px" fontWeight="bold" mb={1}>
            Description
          </FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the achievement"
            rows={3}
            size="sm"
            fontSize="11px"
            borderRadius="2px"
            borderColor="facebook.border"
          />
        </FormControl>

        <ImageUpload
          label="Certificate Image"
          value={formData.image}
          onChange={handleImageChange}
        />

        <HStack spacing={3} pt={3}>
          <Button
            type="submit"
            variant="facebook"
            size="sm"
            h="28px"
            fontSize="11px"
            flex={1}
            isLoading={loading}
          >
            Save
          </Button>
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              flex={1}
              size="sm"
              h="28px"
              fontSize="11px"
              borderColor="facebook.border"
              borderRadius="2px"
            >
              Cancel
            </Button>
          )}
        </HStack>
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="2px">
            <AlertDialogHeader fontSize="12px" fontWeight="bold">
              Confirm Save
            </AlertDialogHeader>
            <AlertDialogBody fontSize="11px">
              Are you sure you want to save this achievement?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                size="sm"
                fontSize="11px"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={confirmSave}
                ml={2}
                size="sm"
                fontSize="11px"
                isLoading={loading}
              >
                Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </form>
  );
};

export default AchievementForm;
