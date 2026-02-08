import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  Image,
  IconButton,
  Text,
  VStack,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { X } from "lucide-react";

const ActivityModal = ({ isOpen, onClose, activity }) => {
  const textColor = useColorModeValue("#333333", "#e4e6eb");
  const lightTextColor = useColorModeValue("#90949c", "#b0b3b8");
  const cardBg = useColorModeValue("white", "#242526");
  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const grayBg = useColorModeValue("#f7f7f7", "#242526");
  const linkBlue = useColorModeValue("#3b5998", "#5b7ec8");

  if (!activity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent bg={cardBg} borderRadius="2px" overflow="hidden">
        <ModalHeader
          bg={grayBg}
          borderBottom="1px solid"
          borderColor={borderColor}
          px={3}
          py={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="14px" fontWeight="bold" color={textColor}>
            Activity Details
          </Text>
          <IconButton
            icon={<X size={16} />}
            onClick={onClose}
            size="sm"
            aria-label="Close"
            bg={cardBg}
            color={linkBlue}
            border="1px solid"
            borderColor={borderColor}
            _hover={{ bg: grayBg }}
          />
        </ModalHeader>
        <ModalBody p={4}>
          <VStack spacing={3} align="stretch">
            {/* Activity Image */}
            {activity.image && (
              <Box
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
              >
                <Image
                  src={activity.image}
                  alt={activity.title}
                  w="100%"
                  h="auto"
                  maxH="400px"
                  objectFit="cover"
                />
              </Box>
            )}

            {/* Activity Title */}
            <Box>
              <Text fontSize="16px" fontWeight="bold" color={textColor} mb={1}>
                {activity.title}
              </Text>
              <Text fontSize="14px" color={linkBlue} mb={1}>
                {activity.role}
              </Text>
              <Text fontSize="13px" color={lightTextColor}>
                {activity.period}
              </Text>
            </Box>

            {/* Activity Description */}
            <Box
              bg={grayBg}
              p={3}
              borderRadius="2px"
              border="1px solid"
              borderColor={borderColor}
            >
              <Text fontSize="14px" fontWeight="bold" color={textColor} mb={2}>
                Description
              </Text>
              <Text fontSize="13px" color={textColor} lineHeight="1.6">
                {activity.description}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ActivityModal;
