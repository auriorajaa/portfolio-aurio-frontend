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
} from "@chakra-ui/react";
import { X } from "lucide-react";

const ActivityModal = ({ isOpen, onClose, activity }) => {
  if (!activity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent bg="white" borderRadius="2px" overflow="hidden">
        <ModalHeader
          bg="facebook.gray"
          borderBottom="1px solid"
          borderColor="facebook.border"
          px={3}
          py={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="12px" fontWeight="bold" color="facebook.text">
            Activity Details
          </Text>
          <IconButton
            icon={<X size={14} />}
            onClick={onClose}
            size="xs"
            aria-label="Close"
            bg="white"
            color="facebook.blue"
            border="1px solid"
            borderColor="facebook.border"
            _hover={{ bg: "facebook.gray" }}
          />
        </ModalHeader>
        <ModalBody p={4}>
          <VStack spacing={3} align="stretch">
            {/* Activity Image */}
            {activity.image && (
              <Box
                border="1px solid"
                borderColor="facebook.border"
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
              <Text
                fontSize="14px"
                fontWeight="bold"
                color="facebook.text"
                mb={1}
              >
                {activity.title}
              </Text>
              <Text fontSize="12px" color="facebook.linkBlue" mb={1}>
                {activity.role}
              </Text>
              <Text fontSize="11px" color="facebook.lightText">
                {activity.period}
              </Text>
            </Box>

            {/* Activity Description */}
            <Box
              bg="facebook.gray"
              p={3}
              borderRadius="2px"
              border="1px solid"
              borderColor="facebook.border"
            >
              <Text
                fontSize="11px"
                fontWeight="bold"
                color="facebook.text"
                mb={2}
              >
                Description
              </Text>
              <Text fontSize="11px" color="facebook.text" lineHeight="1.6">
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
