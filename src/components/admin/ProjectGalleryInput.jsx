import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Input,
  Progress,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowDown,
  ArrowUp,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { validateMediaFile } from "../../services/cloudinaryService";
import { RetroBadge, useRetroColors } from "../ui/retro";

const createEmptyItem = (order) => ({
  id: `media-${Date.now()}-${order}`,
  type: "image",
  url: "",
  title: "",
  caption: "",
  alt: "",
  thumbnail: "",
  order,
});

const ProjectGalleryInput = ({ value = [], onChange }) => {
  const colors = useRetroColors();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [uploadProgress] = useState(0);

  const items = Array.isArray(value)
    ? value.map((item, index) => ({
        id: item.id || `media-${index}`,
        type: "image",
        url: item.url || "",
        title: item.title || "",
        caption: item.caption || "",
        alt: item.alt || "",
        thumbnail: item.thumbnail || "",
        order: Number.isFinite(Number(item.order)) ? Number(item.order) : index,
      }))
    : [];

  const emit = (next) => {
    onChange(
      next.map((item, index) => ({
        ...item,
        order: index,
      })),
    );
  };

  const updateItem = (id, patch) => {
    emit(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id) => {
    emit(items.filter((item) => item.id !== id));
  };

  const moveItem = (id, direction) => {
    const index = items.findIndex((item) => item.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    emit(next);
  };

  const handleAddUrl = () => {
    emit([...items, createEmptyItem(items.length)]);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateMediaFile(file, 12);
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

    const reader = new FileReader();
    reader.onloadend = () => {
      emit([
        ...items,
        {
          id: `media-${Date.now()}`,
          type: "image",
          url: reader.result,
          title: file.name.replace(/\.[^/.]+$/, ""),
          caption: "",
          alt: "",
          thumbnail: "",
          order: items.length,
        },
      ]);
      toast({
        title: "Image selected",
        description: "The image will upload to Cloudinary when you save.",
        status: "info",
        duration: 2200,
        isClosable: true,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <FormControl>
      <FormLabel>Project Showcase Media</FormLabel>
      <VStack spacing={2} align="stretch">
        <HStack spacing={2}>
          <Button
            leftIcon={<Plus size={13} />}
            onClick={handleAddUrl}
            variant="facebookGray"
            size="sm"
            h="30px"
          >
            Add URL
          </Button>
          <Button
            leftIcon={<Upload size={13} />}
            onClick={() => fileInputRef.current?.click()}
            variant="facebookGray"
            size="sm"
            h="30px"
          >
            Select File
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            display="none"
            onChange={handleFileSelect}
          />
        </HStack>

        {uploadProgress > 0 && (
          <Progress value={uploadProgress} size="sm" colorScheme="gray" />
        )}

        {items.length === 0 ? (
          <Box
            border="1px solid"
            borderColor={colors.borderSoft}
            p={3}
            bg={colors.panelAlt}
          >
            <Text fontSize="15px" color={colors.muted}>
              No showcase images yet. Existing project thumbnail will still be
              used as fallback.
            </Text>
          </Box>
        ) : (
          <VStack spacing={2} align="stretch">
            {items.map((item, index) => (
              <Box
                key={item.id}
                border="1px solid"
                borderColor={colors.border}
                bg={colors.panelBg}
                p={2}
              >
                <HStack align="start" spacing={3}>
                  <Box
                    w={{ base: "76px", md: "96px" }}
                    h="74px"
                    border="1px solid"
                    borderColor={colors.borderSoft}
                    bg={colors.panelAlt}
                    display="grid"
                    placeItems="center"
                    flexShrink={0}
                    overflow="hidden"
                  >
                    {item.url ? (
                      <Image
                        src={item.url}
                        alt={item.alt || item.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    ) : item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    ) : (
                      <ImageIcon size={28} color={colors.link} />
                    )}
                  </Box>

                  <VStack spacing={2} align="stretch" flex={1} minW={0}>
                    <HStack spacing={2} justify="space-between">
                      <HStack spacing={2}>
                        <RetroBadge tone="blue">image</RetroBadge>
                        <Text fontSize="14px" color={colors.muted}>
                          Slot {index + 1}
                        </Text>
                      </HStack>
                      <HStack spacing={1}>
                        <IconButton
                          icon={<ArrowUp size={13} />}
                          aria-label="Move up"
                          size="sm"
                          h="26px"
                          minW="26px"
                          variant="facebookGray"
                          onClick={() => moveItem(item.id, -1)}
                          isDisabled={index === 0}
                        />
                        <IconButton
                          icon={<ArrowDown size={13} />}
                          aria-label="Move down"
                          size="sm"
                          h="26px"
                          minW="26px"
                          variant="facebookGray"
                          onClick={() => moveItem(item.id, 1)}
                          isDisabled={index === items.length - 1}
                        />
                        <IconButton
                          icon={<Trash2 size={13} />}
                          aria-label="Remove media"
                          size="sm"
                          h="26px"
                          minW="26px"
                          bg="#f7d8dc"
                          color={colors.red}
                          onClick={() => removeItem(item.id)}
                        />
                      </HStack>
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                      <Input
                        value={item.title}
                        onChange={(e) =>
                          updateItem(item.id, { title: e.target.value })
                        }
                        placeholder="Image title"
                        size="sm"
                      />
                      <Input
                        value={item.url}
                        onChange={(e) =>
                          updateItem(item.id, {
                            url: e.target.value,
                            type: "image",
                          })
                        }
                        placeholder="Image URL"
                        size="sm"
                      />
                    </SimpleGrid>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                      <Input
                        value={item.thumbnail}
                        onChange={(e) =>
                          updateItem(item.id, { thumbnail: e.target.value })
                        }
                        placeholder="Thumbnail URL (optional)"
                        size="sm"
                      />
                      <Input
                        value={item.alt}
                        onChange={(e) =>
                          updateItem(item.id, { alt: e.target.value })
                        }
                        placeholder="Alt text"
                        size="sm"
                      />
                    </SimpleGrid>
                    <Textarea
                      value={item.caption}
                      onChange={(e) =>
                        updateItem(item.id, { caption: e.target.value })
                      }
                      placeholder="Caption"
                      rows={2}
                      size="sm"
                    />
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </FormControl>
  );
};

export default ProjectGalleryInput;
