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
  useColorModeValue,
} from "@chakra-ui/react";
import { X } from "lucide-react";

const CertificateModal = ({ isOpen, onClose, image, title }) => {
  const cardBg = useColorModeValue("white", "#242526");
  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const textColor = useColorModeValue("#333333", "#e4e6eb");
  const grayBg = useColorModeValue("#f7f7f7", "#242526");
  const linkBlue = useColorModeValue("#3b5998", "#5b7ec8");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
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
            {title}
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
