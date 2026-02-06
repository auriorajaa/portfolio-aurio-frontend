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
} from "@chakra-ui/react";
import { X } from "lucide-react";

const CertificateModal = ({ isOpen, onClose, image, title }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
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
            {title}
          </Text>
          <IconButton
            icon={<X size={16} />}
            onClick={onClose}
            variant="ghost"
            size="sm"
            aria-label="Close"
            _hover={{ bg: "facebook.border" }}
          />
        </ModalHeader>
        <ModalBody p={0}>
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