import React from "react";
import {
  Box,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import { useStudioColors } from "../public/studio";

const ActivityModal = ({ isOpen, onClose, activity }) => {
  const colors = useStudioColors();

  if (!activity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay bg={colors.overlay} backdropFilter="blur(10px)" />
      <ModalContent
        bg={colors.surfaceAlt}
        border="1px solid"
        borderColor={colors.border}
        borderRadius="24px"
        overflow="hidden"
        mx={4}
      >
        <ModalHeader
          borderBottom="1px solid"
          borderColor={colors.borderSoft}
          px={5}
          py={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="17px" fontWeight="700" color={colors.text}>
            Activity details
          </Text>
          <IconButton
            icon={<X size={16} />}
            onClick={onClose}
            size="sm"
            aria-label="Close"
            variant="studioGhost"
          />
        </ModalHeader>

        <ModalBody p={{ base: 4, md: 5 }}>
          <VStack spacing={4} align="stretch">
            {activity.image && (
              <Box
                border="1px solid"
                borderColor={colors.border}
                overflow="hidden"
                borderRadius="18px"
              >
                <Image
                  src={activity.image}
                  alt={activity.title}
                  w="100%"
                  h="auto"
                  maxH="420px"
                  objectFit="cover"
                />
              </Box>
            )}

            <Box>
              <Text fontSize="22px" fontWeight="800" color={colors.text} lineHeight="1.15">
                {activity.title}
              </Text>
              <Text fontSize="15px" color={colors.text} mt={2}>
                {activity.role}
              </Text>
              <Text fontSize="14px" color={colors.muted} mt={1}>
                {activity.period}
              </Text>
            </Box>

            {activity.description && (
              <Box
                bg={colors.surface}
                p={{ base: 4, md: 5 }}
                borderRadius="20px"
                border="1px solid"
                borderColor={colors.borderSoft}
              >
                <Text
                  fontSize="12px"
                  fontWeight="700"
                  color={colors.muted}
                  letterSpacing=".08em"
                  textTransform="uppercase"
                  mb={3}
                >
                  Description
                </Text>
                <Text
                  fontSize="15px"
                  color={colors.text}
                  lineHeight="1.75"
                  whiteSpace="pre-line"
                >
                  {activity.description}
                </Text>
              </Box>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ActivityModal;
