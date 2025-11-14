// src/components/ui/AchievementCard.js
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
  VStack,
  HStack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiAward, FiCalendar, FiMaximize2, FiTrendingUp } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MotionBox = motion(Box);

const AchievementCard = ({ achievement }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");
  const textPrimary = useColorModeValue("gray.900", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentGradient = useColorModeValue(
    "linear(135deg, brand.400, teal.400, blue.500)",
    "linear(135deg, brand.500, teal.500, blue.600)"
  );
  const ribbonBg = useColorModeValue("yellow.400", "yellow.500");
  const overlayGradient = useColorModeValue(
    "linear(135deg, rgba(56, 178, 172, 0.1), rgba(59, 130, 246, 0.1))",
    "linear(135deg, rgba(56, 178, 172, 0.2), rgba(59, 130, 246, 0.2))"
  );

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        width="100%"
        h="100%"
      >
        <Box
          position="relative"
          borderRadius="xl"
          overflow="hidden"
          bg={cardBg}
          display="flex"
          flexDirection="column"
          height="100%"
          transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          cursor="pointer"
          role="group"
          _hover={{
            transform: "translateY(-8px) rotateX(2deg)",
            shadow: "2xl",
          }}
          transformStyle="preserve-3d"
          onClick={onOpen}
        >
          {/* Decorative Top Border with Gradient */}
          <Box
            h="4px"
            bgGradient={accentGradient}
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              bgGradient: accentGradient,
              filter: "blur(8px)",
              opacity: 0.6,
            }}
          />

          {/* Award Badge - Floating on top right */}
          <Box
            position="absolute"
            top={4}
            right={4}
            zIndex={10}
            bg={ribbonBg}
            color="gray.900"
            p={2}
            borderRadius="full"
            boxShadow="lg"
            transform="rotate(12deg)"
            transition="all 0.3s ease"
            _groupHover={{
              transform: "rotate(0deg) scale(1.1)",
            }}
          >
            <Icon as={FiAward} boxSize={5} />
          </Box>

          {/* Image Section with 3D effect */}
          <Box
            position="relative"
            width="100%"
            overflow="hidden"
            bg="gray.900"
            p={6}
            minH="220px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {/* Background Pattern */}
            <Box
              position="absolute"
              inset={0}
              bgGradient={overlayGradient}
              opacity={0.4}
            />

            {/* Animated Circles */}
            <Box
              position="absolute"
              top="-20%"
              left="-20%"
              w="140%"
              h="140%"
              bgGradient="radial(circle, brand.400 0%, transparent 70%)"
              opacity={0.1}
              transition="all 0.6s ease"
              _groupHover={{
                transform: "scale(1.2) rotate(45deg)",
                opacity: 0.15,
              }}
            />

            {/* Certificate Image */}
            <Box
              position="relative"
              zIndex={2}
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              _groupHover={{
                transform: "scale(1.05) translateZ(20px)",
              }}
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
                  maxHeight: "180px",
                  filter: "drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.3))",
                }}
              />
            </Box>

            {/* Expand Icon - Bottom Right */}
            <Box
              position="absolute"
              bottom={3}
              right={3}
              zIndex={3}
              bg="blackAlpha.700"
              backdropFilter="blur(10px)"
              p={2}
              borderRadius="lg"
              display="flex"
              alignItems="center"
              gap={1}
              opacity={0}
              transform="translateY(10px)"
              transition="all 0.3s ease"
              _groupHover={{
                opacity: 1,
                transform: "translateY(0)",
              }}
            >
              <Icon as={FiMaximize2} color="white" boxSize={3.5} />
              <Text
                color="white"
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="wide"
              >
                VIEW
              </Text>
            </Box>
          </Box>

          {/* Content Section */}
          <VStack
            p={5}
            spacing={3}
            align="stretch"
            flex="1"
            bg={cardBg}
            position="relative"
          >
            {/* Issuer Badge */}
            <HStack spacing={2}>
              <Icon as={FiTrendingUp} color="brand.500" boxSize={4} />
              <Badge
                colorScheme="brand"
                fontSize="xs"
                px={2}
                py={0.5}
                borderRadius="md"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {achievement.issuer}
              </Badge>
            </HStack>

            {/* Title */}
            <Heading
              as="h3"
              color={textPrimary}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.3"
              fontWeight="bold"
              noOfLines={2}
              minH="48px"
              letterSpacing="-0.01em"
            >
              {achievement.title}
            </Heading>

            {/* Date with Icon */}
            <HStack
              spacing={2}
              color={textSecondary}
              fontSize="sm"
              fontWeight="600"
              pt={2}
              borderTopWidth="1px"
              borderColor={borderColor}
            >
              <Icon as={FiCalendar} boxSize={4} />
              <Text>{achievement.date}</Text>
            </HStack>

            {/* Decorative Corner */}
            <Box
              position="absolute"
              bottom={0}
              right={0}
              w="80px"
              h="80px"
              bgGradient={accentGradient}
              opacity={0.05}
              borderTopLeftRadius="full"
              transition="all 0.4s ease"
              _groupHover={{
                opacity: 0.1,
                w: "100px",
                h: "100px",
              }}
            />
          </VStack>

          {/* Shine effect on hover */}
          <Box
            position="absolute"
            top="-50%"
            left="-50%"
            w="200%"
            h="200%"
            bgGradient="linear(45deg, transparent 30%, whiteAlpha.200 50%, transparent 70%)"
            transform="translateX(-100%)"
            transition="transform 0.6s ease"
            _groupHover={{
              transform: "translateX(100%)",
            }}
            pointerEvents="none"
          />
        </Box>
      </MotionBox>

      {/* Modal for full-size image */}
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered>
        <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.800" />
        <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh">
          <ModalCloseButton
            color="white"
            bg="blackAlpha.600"
            _hover={{ bg: "blackAlpha.800" }}
            size="lg"
            borderRadius="full"
            zIndex={10}
          />
          <ModalBody p={0}>
            <Box
              position="relative"
              w="100%"
              h="100%"
              display="flex"
              flexDirection="column"
              bg="gray.900"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="2xl"
            >
              {/* Header Info */}
              <VStack
                spacing={2}
                p={6}
                bg="blackAlpha.600"
                backdropFilter="blur(20px)"
                borderBottomWidth="1px"
                borderColor="whiteAlpha.200"
              >
                <HStack spacing={3}>
                  <Icon as={FiAward} color="yellow.400" boxSize={6} />
                  <Heading
                    as="h3"
                    fontSize={{ base: "lg", md: "xl" }}
                    color="white"
                    textAlign="center"
                  >
                    {achievement.title}
                  </Heading>
                </HStack>
                <HStack spacing={4} fontSize="sm" color="gray.300">
                  <Text fontWeight="600">{achievement.issuer}</Text>
                  <Text>•</Text>
                  <Text>{achievement.date}</Text>
                </HStack>
              </VStack>

              {/* Image Container */}
              <Box
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={8}
                position="relative"
              >
                {/* Decorative Background */}
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient={overlayGradient}
                  opacity={0.2}
                />

                <Image
                  src={
                    achievement.image ||
                    "https://via.placeholder.com/400x280?text=Certificate"
                  }
                  alt={achievement.title}
                  maxH="70vh"
                  maxW="100%"
                  objectFit="contain"
                  borderRadius="xl"
                  boxShadow="2xl"
                  position="relative"
                  zIndex={1}
                />
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AchievementCard;
