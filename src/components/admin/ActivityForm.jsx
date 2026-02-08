// src/components/admin/ActivityForm.jsx
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

const ActivityForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    organization: "",
    period: "",
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
    if (!formData.title || !formData.period) {
      toast({
        title: "Validation Error",
        description: "Title and period are required fields",
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
        const file = new File([blob], "activity-image.jpg", {
          type: "image/jpeg",
        });
        const uploadedUrl = await uploadImageWithProgress(file);
        finalFormData.image = uploadedUrl;
      }

      onSave(finalFormData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save activity",
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
          <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
            Activity Title
          </FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Student Council President"
            size="md"
            fontSize="13px"
            borderRadius="2px"
          />
        </FormControl>

        <HStack spacing={3}>
          <FormControl flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Role/Position
            </FormLabel>
            <Input
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g. President"
              size="md"
              fontSize="13px"
              borderRadius="2px"
            />
          </FormControl>

          <FormControl flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Organization
            </FormLabel>
            <Input
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              placeholder="e.g. Student Council"
              size="md"
              fontSize="13px"
              borderRadius="2px"
            />
          </FormControl>
        </HStack>

        <FormControl isRequired>
          <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
            Period
          </FormLabel>
          <Input
            name="period"
            value={formData.period}
            onChange={handleInputChange}
            placeholder="e.g. Jan 2023 - Dec 2023"
            size="md"
            fontSize="13px"
            borderRadius="2px"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
            Description
          </FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your role and achievements"
            rows={4}
            size="md"
            fontSize="13px"
            borderRadius="2px"
          />
        </FormControl>

        <ImageUpload
          label="Activity Image"
          value={formData.image}
          onChange={handleImageChange}
        />

        <HStack spacing={3} pt={3}>
          <Button
            type="submit"
            variant="facebook"
            size="md"
            h="36px"
            fontSize="13px"
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
              size="md"
              h="36px"
              fontSize="13px"
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
            <AlertDialogHeader fontSize="14px" fontWeight="bold">
              Confirm Save
            </AlertDialogHeader>
            <AlertDialogBody fontSize="13px">
              Are you sure you want to save this activity?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                size="md"
                fontSize="13px"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={confirmSave}
                ml={2}
                size="md"
                fontSize="13px"
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

export default ActivityForm;
