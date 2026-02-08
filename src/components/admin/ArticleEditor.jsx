// src/components/admin/ArticleEditor.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Switch,
  HStack,
  Text,
  Wrap,
  useToast,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createArticle, updateArticle } from "../../services/articleService";
import { uploadImageWithProgress } from "../../services/cloudinaryService";
import ImageUpload from "../ui/ImageUpload";

const CATEGORIES = [
  { value: "technology", label: "Technology" },
  { value: "programming", label: "Programming" },
  { value: "web-development", label: "Web Development" },
  { value: "career", label: "Career" },
  { value: "tutorial", label: "Tutorial" },
  { value: "opinion", label: "Opinion" },
];

const ArticleEditor = ({ article, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    description: "",
    category: "technology",
    categoryLabel: "Technology",
    image: "",
    featured: false,
    visibility: "draft",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        excerpt: article.excerpt || "",
        description: article.description || "",
        category: article.category || "technology",
        categoryLabel: article.categoryLabel || "Technology",
        image: article.image || "",
        featured: article.featured || false,
        visibility: article.visibility || "draft",
        tags: article.tags || [],
      });
    }
  }, [article]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = CATEGORIES.find(
      (cat) => cat.value === e.target.value,
    );
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory.value,
      categoryLabel: selectedCategory.label,
    }));
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageChange = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Open confirmation dialog
    onOpen();
  };

  const confirmSave = async () => {
    setLoading(true);
    onClose();

    try {
      let finalFormData = { ...formData };

      // If image is base64, upload to Cloudinary first
      if (formData.image && formData.image.startsWith("data:")) {
        try {
          // Convert base64 to blob
          const response = await fetch(formData.image);
          const blob = await response.blob();
          const file = new File([blob], "article-image.jpg", {
            type: "image/jpeg",
          });

          // Upload to Cloudinary
          const uploadedUrl = await uploadImageWithProgress(
            file,
            (progress) => {
              // You could update a progress state here if needed
            },
          );

          finalFormData.image = uploadedUrl;
        } catch (uploadError) {
          throw new Error("Failed to upload image: " + uploadError.message);
        }
      }

      if (article) {
        await updateArticle(article.id, finalFormData);
        toast({
          title: "Success",
          description: "Article updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createArticle(finalFormData);
        toast({
          title: "Success",
          description: "Article created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save article",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      border="1px solid"
      borderColor="facebook.border"
      borderRadius="2px"
    >
      {/* Form Header */}
      <Box
        borderBottom="1px solid"
        borderColor="facebook.border"
        px={{ base: 3, md: 4 }}
        py={3}
      >
        <Text fontSize="13px" fontWeight="bold">
          {article ? "Edit Article" : "Create New Article"}
        </Text>
      </Box>

      {/* Form Content */}
      <Box px={{ base: 3, md: 4 }} py={4}>
        <VStack spacing={4} align="stretch">
          {/* Title Field */}
          <FormControl isRequired>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Title
            </FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter article title"
              fontSize="14px"
              size="md"
              _hover={{ borderColor: "facebook.blue" }}
              _focus={{
                borderColor: "facebook.blue",
                boxShadow: "0 0 0 1px #3b5998",
              }}
            />
          </FormControl>

          {/* Excerpt Field */}
          <FormControl isRequired>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Excerpt
            </FormLabel>
            <Textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Brief summary of the article"
              rows={3}
              fontSize="14px"
              _hover={{ borderColor: "facebook.blue" }}
              _focus={{
                borderColor: "facebook.blue",
                boxShadow: "0 0 0 1px #3b5998",
              }}
            />
          </FormControl>

          {/* Category Field */}
          <FormControl isRequired>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Category
            </FormLabel>
            <Select
              value={formData.category}
              onChange={handleCategoryChange}
              fontSize="13px"
              size="md"
              borderRadius="2px"
              _hover={{ borderColor: "facebook.blue" }}
              _focus={{
                borderColor: "facebook.blue",
                boxShadow: "0 0 0 1px #3b5998",
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Image Upload */}
          <ImageUpload
            label="Featured Image"
            value={formData.image}
            onChange={handleImageChange}
          />

          {/* Tags Field */}
          <FormControl>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Tags
            </FormLabel>
            <Stack direction={{ base: "column", sm: "row" }} spacing={2}>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                fontSize="14px"
                size="md"
                flex={1}
                _hover={{ borderColor: "facebook.blue" }}
                _focus={{
                  borderColor: "facebook.blue",
                  boxShadow: "0 0 0 1px #3b5998",
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                onClick={handleAddTag}
                variant="facebookGray"
                fontSize="12px"
                h="36px"
                px={3}
                w={{ base: "full", sm: "auto" }}
              >
                Add
              </Button>
            </Stack>

            {/* Tags Display */}
            {formData.tags.length > 0 && (
              <Wrap mt={2} spacing={2}>
                {formData.tags.map((tag) => (
                  <HStack
                    key={tag}
                    bg="facebook.paleBlue"
                    px={2}
                    py={1}
                    borderRadius="2px"
                    border="1px solid"
                    borderColor="facebook.border"
                    spacing={1}
                  >
                    <Text fontSize="12px">{tag}</Text>
                    <Box
                      as="button"
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      cursor="pointer"
                      display="flex"
                      alignItems="center"
                      _hover={{ opacity: 0.7 }}
                    >
                      <X size={14} color="#90949c" />
                    </Box>
                  </HStack>
                ))}
              </Wrap>
            )}
          </FormControl>

          {/* Featured Switch & Visibility */}
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <FormControl flex={1}>
              <HStack justify="space-between" align="center">
                <FormLabel
                  htmlFor="featured"
                  mb={0}
                  fontSize="13px"
                  fontWeight="bold"
                >
                  Mark as Featured
                </FormLabel>
                <Switch
                  id="featured"
                  isChecked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  colorScheme="blue"
                  size="sm"
                />
              </HStack>
            </FormControl>

            {/* Visibility Status */}
            <FormControl flex={1}>
              <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
                Visibility
              </FormLabel>
              <Select
                value={formData.visibility}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    visibility: e.target.value,
                  }))
                }
                fontSize="13px"
                size="md"
                borderRadius="2px"
                _hover={{ borderColor: "facebook.blue" }}
                _focus={{
                  borderColor: "facebook.blue",
                  boxShadow: "0 0 0 1px #3b5998",
                }}
              >
                <option value="draft">Draft</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Select>
            </FormControl>
          </Stack>

          {/* Content Editor */}
          <FormControl isRequired>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Content
            </FormLabel>
            <Box
              border="1px solid"
              borderColor="facebook.border"
              borderRadius="2px"
              sx={{
                ".quill": {
                  fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
                },
                ".ql-toolbar": {
                  borderColor: "facebook.border",
                  borderTopLeftRadius: "2px",
                  borderTopRightRadius: "2px",
                },
                ".ql-container": {
                  minHeight: "300px",
                  fontSize: "13px",
                  borderColor: "facebook.border",
                  borderBottomLeftRadius: "2px",
                  borderBottomRightRadius: "2px",
                  fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
                },
                ".ql-editor": {
                  minHeight: "300px",
                  fontSize: "13px",
                  lineHeight: "1.6",
                },
                ".ql-editor.ql-blank::before": {
                  fontSize: "13px",
                  color: "facebook.lightText",
                  fontStyle: "italic",
                },
              }}
            >
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={handleDescriptionChange}
                modules={quillModules}
              />
            </Box>
          </FormControl>
        </VStack>
      </Box>

      {/* Form Footer */}
      <Box
        borderTop="1px solid"
        borderColor="facebook.border"
        px={{ base: 3, md: 4 }}
        py={3}
      >
        <Stack
          direction={{ base: "column", sm: "row" }}
          spacing={2}
          justify="flex-end"
        >
          {onCancel && (
            <Button
              variant="facebookGray"
              onClick={onCancel}
              fontSize="13px"
              h="32px"
              px={4}
              w={{ base: "full", sm: "auto" }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="facebook"
            isLoading={loading}
            loadingText="Saving..."
            fontSize="13px"
            h="32px"
            px={4}
            w={{ base: "full", sm: "auto" }}
          >
            {article ? "Update Article" : "Create Article"}
          </Button>
        </Stack>
      </Box>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="2px" mx={4}>
            <AlertDialogHeader fontSize="14px" fontWeight="bold">
              Confirm {article ? "Update" : "Create"}
            </AlertDialogHeader>

            <AlertDialogBody fontSize="13px">
              Are you sure you want to {article ? "update" : "create"} this
              article?
              {formData.image &&
                formData.image.startsWith("data:") &&
                " The image will be uploaded to Cloudinary."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                size="md"
                fontSize="13px"
                variant="facebookGray"
              >
                Cancel
              </Button>
              <Button
                variant="facebook"
                onClick={confirmSave}
                ml={2}
                size="md"
                fontSize="13px"
                isLoading={loading}
              >
                {article ? "Update" : "Create"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ArticleEditor;
