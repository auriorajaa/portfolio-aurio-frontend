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
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";

const ArrayInput = ({
  value = [],
  onChange,
  label,
  placeholder = "Add item",
}) => {
  const [inputValue, setInputValue] = useState("");

  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const itemBg = useColorModeValue("#f7f7f7", "#3a3b3c");
  const focusBorder = useColorModeValue("#3b5998", "#5b7ec8");

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
        <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
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
            size="md"
            fontSize="13px"
            borderRadius="2px"
            _hover={{ borderColor: focusBorder }}
            _focus={{
              borderColor: focusBorder,
              boxShadow: `0 0 0 1px ${focusBorder}`,
            }}
          />
          <Button
            onClick={handleAdd}
            leftIcon={<AddIcon boxSize={3} />}
            size="sm"
            h="36px"
            fontSize="12px"
            variant="facebook"
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
                bg={itemBg}
                borderRadius="2px"
                justify="space-between"
                border="1px solid"
                borderColor={borderColor}
              >
                <Text fontSize="13px" flex={1}>
                  {item}
                </Text>
                <IconButton
                  icon={<DeleteIcon boxSize={3} />}
                  size="sm"
                  h="24px"
                  bg="#ffebee"
                  color="#d32f2f"
                  variant="ghost"
                  onClick={() => handleRemove(index)}
                  aria-label="Remove item"
                  _hover={{ bg: "#ffcdd2" }}
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
