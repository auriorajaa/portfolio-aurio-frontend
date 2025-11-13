import React from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiAward, FiCalendar, FiMaximize2 } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MotionBox = motion(Box);

const AchievementCard = ({ achievement }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "#112240");
  const textPrimary = useColorModeValue("gray.800", "#e6f1ff");
  const textSecondary = useColorModeValue("gray.600", "#b8bfd3ff");
  const borderColor = useColorModeValue("gray.200", "#1e3a5f");

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        width="100%"
      >
        <Box
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="xl"
          overflow="hidden"
          bg={cardBg}
          display="flex"
          flexDirection="column"
          height="100%"
          _hover={{
            transform: "translateY(-5px)",
            shadow: "2xl",
            borderColor: "brand.500",
          }}
          transition="all 0.3s ease-in-out"
        >
          {/* Image Section */}
          <Box
            position="relative"
            width="100%"
            pb="65%"
            bg="gray.900"
            overflow="hidden"
            cursor="pointer"
            onClick={onOpen}
            _hover={{ opacity: 0.9 }}
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              bgGradient="linear(to-br, brand.900, brand.700)"
              opacity="0.25"
              zIndex={1}
            />

            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={2}
              p={{ base: 3, md: 5 }}
            >
              <LazyLoadImage
                src={
                  achievement.image ||
                  "https://via.placeholder.com/400x280?text=Certificate"
                }
                alt={achievement.title}
                effect="blur"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "0.5rem",
                  filter: "drop-shadow(0px 4px 12px rgba(8, 145, 224, 0.35))",
                }}
              />
            </Box>

            {/* Overlay Icon */}
            <Box
              position="absolute"
              bottom="6px"
              right="6px"
              zIndex={3}
              bg="blackAlpha.600"
              p="5px"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FiMaximize2 color="white" size={16} />
            </Box>
          </Box>

          {/* Content */}
          <Box
            p={{ base: 4, md: 5 }}
            flex="1"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Heading
              as="h3"
              color={textPrimary}
              fontSize={{ base: "md", md: "lg" }}
              mb={{ base: 2, md: 3 }}
              lineHeight="1.3"
              fontWeight="bold"
              whiteSpace="normal"
              wordBreak="break-word"
              textAlign="left"
            >
              {achievement.title}
            </Heading>

            <Box mb={2}>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={textSecondary}
                display="flex"
                alignItems="center"
                lineHeight="1.5"
                noOfLines={2}
              >
                <Box
                  as={FiAward}
                  display="inline-block"
                  mr={2}
                  flexShrink={0}
                  fontSize={{ base: "sm", md: "md" }}
                />
                {achievement.issuer}
              </Text>
            </Box>

            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color={textSecondary}
              display="flex"
              alignItems="center"
              lineHeight="1.5"
            >
              <Box
                as={FiCalendar}
                display="inline-block"
                mr={2}
                flexShrink={0}
                fontSize={{ base: "sm", md: "md" }}
              />
              Issued at {achievement.date}
            </Text>
          </Box>
        </Box>
      </MotionBox>

      {/* Modal for full-size image */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" zIndex={10} />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={0}
          >
            <Box
              w="100%"
              maxH="85vh"
              overflow="hidden"
              borderRadius="lg"
              bg="blackAlpha.800"
              display="flex"
              justifyContent="center"
              alignItems="center"
              p={4}
            >
              <Image
                src={
                  achievement.image ||
                  "https://via.placeholder.com/400x280?text=Certificate"
                }
                alt={achievement.title}
                maxH="80vh"
                objectFit="contain"
                borderRadius="lg"
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AchievementCard;
