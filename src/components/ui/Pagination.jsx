// src/components/ui/Pagination.jsx
import React from "react";
import { HStack, Text, IconButton } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <HStack justify="center" spacing={2} py={3}>
      <IconButton
        icon={<ChevronLeft size={14} />}
        size="xs"
        variant="facebookGray"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        aria-label="Previous page"
        h="24px"
        minW="24px"
      />

      <Text fontSize="11px" color="facebook.text" px={2}>
        {currentPage} / {totalPages}
      </Text>

      <IconButton
        icon={<ChevronRight size={14} />}
        size="xs"
        variant="facebookGray"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        aria-label="Next page"
        h="24px"
        minW="24px"
      />
    </HStack>
  );
};

export default Pagination;
