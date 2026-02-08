// src/components/ui/ImageUpload.jsx
import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Image,
  VStack,
  Text,
  Progress,
  IconButton,
  HStack,
  Input,
  FormControl,
  FormLabel,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  uploadImageWithProgress,
  validateImageFile,
} from "../../services/cloudinaryService";

const ImageUpload = ({
  value,
  onChange,
  label = "Image",
  previewHeight = "200px",
  immediateUpload = false, // Set to false to delay upload until parent saves
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState(value || "");
  const fileInputRef = useRef(null);
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const lightTextColor = useColorModeValue("gray.500", "gray.400");
  const toast = useToast();

  // Update local state when prop changes
  React.useEffect(() => {
    setImageUrl(value || "");
  }, [value]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file, 5);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (immediateUpload) {
      // Upload immediately (for existing behavior compatibility)
      try {
        setUploading(true);
        setUploadProgress(0);

        const url = await uploadImageWithProgress(file, (progress) => {
          setUploadProgress(progress);
        });

        setImageUrl(url);
        if (onChange) onChange(url);

        toast({
          title: "Success",
          description: "Image uploaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload image",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    } else {
      // Convert to base64 for preview only (upload will happen on save)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImageUrl(base64String);
        if (onChange) onChange(base64String);
      };
      reader.readAsDataURL(file);

      toast({
        title: "Image Selected",
        description: "Image will be uploaded when you save",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
  };

  const handleUrlBlur = () => {
    // Only call onChange when user finishes typing (blur event)
    if (onChange && imageUrl !== value) {
      onChange(imageUrl);
    }
  };

  const handleRemove = () => {
    setImageUrl("");
    if (onChange) onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormControl>
      <FormLabel fontSize="13px" fontWeight="bold" mb={1}>
        {label}
      </FormLabel>
      <VStack align="stretch" spacing={2}>
        {imageUrl && (
          <Box position="relative">
            <Image
              src={imageUrl}
              alt={label}
              maxH={previewHeight}
              objectFit="cover"
              borderRadius="2px"
              border="1px solid"
              borderColor={borderColor}
            />
            <HStack position="absolute" top={2} right={2} spacing={1}>
              <IconButton
                icon={<EditIcon boxSize={2.5} />}
                size="sm"
                h="24px"
                colorScheme="blue"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Replace image"
              />
              <IconButton
                icon={<DeleteIcon boxSize={2.5} />}
                size="sm"
                h="24px"
                colorScheme="red"
                onClick={handleRemove}
                aria-label="Remove image"
              />
            </HStack>
          </Box>
        )}

        {uploading && (
          <Box>
            <Text fontSize="12px" mb={1}>
              Uploading... {Math.round(uploadProgress)}%
            </Text>
            <Progress value={uploadProgress} size="sm" colorScheme="blue" />
          </Box>
        )}

        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          display="none"
        />

        {!imageUrl && (
          <Button
            onClick={() => fileInputRef.current?.click()}
            isLoading={uploading}
            loadingText="Uploading..."
            colorScheme="blue"
            variant="outline"
            size="sm"
            h="36px"
            fontSize="12px"
            borderRadius="2px"
          >
            Upload Image
          </Button>
        )}

        <Input
          placeholder="Or paste image URL"
          value={imageUrl}
          onChange={handleUrlChange}
          onBlur={handleUrlBlur}
          size="sm"
          fontSize="13px"
          borderRadius="2px"
          borderColor={borderColor}
        />

        <Text fontSize="12px" color={lightTextColor}>
          {immediateUpload
            ? "Upload an image or paste a URL. Max 5MB."
            : "Select an image (uploaded on save) or paste a URL. Max 5MB."}
        </Text>
      </VStack>
    </FormControl>
  );
};

export default ImageUpload;
