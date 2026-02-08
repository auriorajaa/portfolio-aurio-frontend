// src/components/ui/ArrayInput.jsx
import React, { useState } from "react";
import {
  VStack,
  HStack,
  Input,
  Button,
  IconButton,
  Text,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";

const ArrayInput = ({
  value = [],
  onChange,
  label,
  placeholder = "Add item",
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      const newArray = [...value, inputValue.trim()];
      onChange(newArray);
      setInputValue("");
    }
  };

  const handleRemove = (index) => {
    const newArray = value.filter((_, i) => i !== index);
    onChange(newArray);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <FormControl>
      {label && (
        <FormLabel fontSize="11px" fontWeight="bold" mb={1}>
          {label}
        </FormLabel>
      )}
      <VStack align="stretch" spacing={2}>
        <HStack spacing={2}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            size="sm"
            fontSize="11px"
            borderRadius="2px"
            borderColor="facebook.border"
          />
          <Button
            onClick={handleAdd}
            leftIcon={<AddIcon boxSize={2.5} />}
            size="xs"
            h="28px"
            fontSize="10px"
            colorScheme="blue"
            variant="outline"
            borderRadius="2px"
          >
            Add
          </Button>
        </HStack>

        {value.length > 0 && (
          <VStack align="stretch" spacing={1}>
            {value.map((item, index) => (
              <HStack
                key={index}
                px={2}
                py={1}
                bg="gray.50"
                borderRadius="2px"
                justify="space-between"
                border="1px solid"
                borderColor="facebook.border"
              >
                <Text fontSize="11px" flex={1}>
                  {item}
                </Text>
                <IconButton
                  icon={<DeleteIcon boxSize={2.5} />}
                  size="xs"
                  h="20px"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleRemove(index)}
                  aria-label="Remove item"
                />
              </HStack>
            ))}
          </VStack>
        )}
      </VStack>
    </FormControl>
  );
};

export default ArrayInput;
