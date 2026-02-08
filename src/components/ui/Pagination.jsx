// src/components/ui/Pagination.jsx
import React from "react";
import { HStack, Text, IconButton, useColorModeValue } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const textColor = useColorModeValue("#333333", "#e4e6eb");

  if (totalPages <= 1) return null;

  return (
    <HStack justify="center" spacing={2} py={3}>
      <IconButton
        icon={<ChevronLeft size={14} />}
        size="sm"
        variant="facebookGray"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        aria-label="Previous page"
        h="32px"
        minW="32px"
      />

      <Text fontSize="13px" color={textColor} px={2}>
        {currentPage} / {totalPages}
      </Text>

      <IconButton
        icon={<ChevronRight size={14} />}
        size="sm"
        variant="facebookGray"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        aria-label="Next page"
        h="32px"
        minW="32px"
      />
    </HStack>
  );
};

export default Pagination;
