import React from "react";
import {
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import { useStudioColors } from "../public/studio";

const CertificateModal = ({ isOpen, onClose, image, title }) => {
  const colors = useStudioColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
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
          <Text fontSize="17px" fontWeight="700" color={colors.text} noOfLines={1}>
            {title}
          </Text>
          <IconButton
            icon={<X size={16} />}
            onClick={onClose}
            size="sm"
            aria-label="Close"
            variant="studioGhost"
            flexShrink={0}
          />
        </ModalHeader>
        <ModalBody p={0} bg={colors.surface}>
          <Image
            src={image}
            alt={title}
            w="100%"
            h="auto"
            maxH="80vh"
            objectFit="contain"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CertificateModal;
