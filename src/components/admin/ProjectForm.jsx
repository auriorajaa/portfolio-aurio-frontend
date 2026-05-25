// src/components/admin/ProjectForm.jsx
import React, { useState, useEffect } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  HStack,
  SimpleGrid,
  Select,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import ArrayInput from "../ui/ArrayInput";
import ImageUpload from "../ui/ImageUpload";
import {
  uploadImageWithProgress,
  uploadMediaWithProgress,
} from "../../services/cloudinaryService";
import ProjectGalleryInput from "./ProjectGalleryInput";
import { normalizeProject } from "../../utils/projectMedia";
import { generateSlug } from "../../utils/slugify";

const ProjectForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    role: "",
    period: "",
    status: "Published",
    tags: [],
    image: "",
    highlights: [],
    gallery: [],
    github: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setFormData(normalizeProject(data));
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && !prev.slug ? { slug: generateSlug(value) } : {}),
    }));
  };

  const handleImageChange = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Title and description are required fields",
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

      // If image is base64, upload to Cloudinary first
      if (formData.image && formData.image.startsWith("data:")) {
        const response = await fetch(formData.image);
        const blob = await response.blob();
        const file = new File([blob], "project-image.jpg", {
          type: "image/jpeg",
        });
        const uploadedUrl = await uploadImageWithProgress(file);
        finalFormData.image = uploadedUrl;
      }

      if (Array.isArray(formData.gallery) && formData.gallery.length > 0) {
        finalFormData.gallery = await Promise.all(
          formData.gallery.map(async (item, index) => {
            if (!item.url || !item.url.startsWith("data:")) {
              return { ...item, order: index };
            }

            const response = await fetch(item.url);
            const blob = await response.blob();
            const extension = item.type === "pdf" ? "pdf" : "jpg";
            const file = new File([blob], `project-media-${index}.${extension}`, {
              type: item.type === "pdf" ? "application/pdf" : blob.type || "image/jpeg",
            });
            const uploadedUrl = await uploadMediaWithProgress(file);
            return { ...item, url: uploadedUrl, order: index };
          }),
        );
      }

      finalFormData.slug =
        finalFormData.slug || generateSlug(finalFormData.title || "project");
      finalFormData.role = finalFormData.role || "Full-stack Developer";
      finalFormData.status = finalFormData.status || "Published";

      onSave(finalFormData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
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
            Project Title
          </FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Project name"
            size="md"
            fontSize="13px"
            borderRadius="2px"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
            Description
          </FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the project"
            rows={4}
            size="md"
            fontSize="13px"
            borderRadius="2px"
          />
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
          <FormControl>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              URL Slug
            </FormLabel>
            <Input
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="small-circle"
              size="md"
              fontSize="13px"
              borderRadius="0"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Role
            </FormLabel>
            <Input
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="Full-stack Developer"
              size="md"
              fontSize="13px"
              borderRadius="0"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Status
            </FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              size="md"
              fontSize="13px"
              borderRadius="0"
            >
              <option value="Published">Published</option>
              <option value="Featured">Featured</option>
              <option value="Archived">Archived</option>
              <option value="In Progress">In Progress</option>
            </Select>
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
            Period
          </FormLabel>
          <Input
            name="period"
            value={formData.period}
            onChange={handleInputChange}
            placeholder="2024 - 2025"
            size="md"
            fontSize="13px"
            borderRadius="0"
          />
        </FormControl>

        <ImageUpload
          label="Project Cover Image"
          value={formData.image}
          onChange={handleImageChange}
        />

        <HStack spacing={3}>
          <FormControl flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              GitHub URL
            </FormLabel>
            <Input
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              placeholder="https://github.com/..."
              size="md"
              fontSize="13px"
              borderRadius="2px"
            />
          </FormControl>

          <FormControl flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Live Website URL
            </FormLabel>
            <Input
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://project.com"
              size="md"
              fontSize="13px"
              borderRadius="2px"
            />
          </FormControl>
        </HStack>

        <ArrayInput
          label="Technologies/Tags"
          value={formData.tags}
          onChange={(val) => setFormData((prev) => ({ ...prev, tags: val }))}
          placeholder="Add a tag"
        />

        <ArrayInput
          label="Project Highlights"
          value={formData.highlights}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, highlights: val }))
          }
          placeholder="Add a highlight"
        />

        <ProjectGalleryInput
          value={formData.gallery}
          onChange={(val) => setFormData((prev) => ({ ...prev, gallery: val }))}
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
              Are you sure you want to save this project?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                size="sm"
                fontSize="13px"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={confirmSave}
                ml={2}
                size="sm"
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

export default ProjectForm;
