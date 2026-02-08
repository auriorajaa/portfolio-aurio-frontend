// src/components/admin/EducationForm.jsx
import React, { useState, useEffect } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  HStack,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import ArrayInput from "../ui/ArrayInput";

const EducationForm = ({ data, type, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    period: "",
    gpa: "",
    major: "",
    degree: "",
    status: "Current",
    type: type === "education" ? "formal" : "bootcamp",
    description: "",
    achievements: [],
    courses: [],
    skills: [],
    logo: "",
    color: "blue",
    score: "",
  });
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onOpen();
  };

  const confirmSave = () => {
    setLoading(true);
    onClose();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={3} align="stretch">
        <FormControl isRequired>
          <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
            Institution/Program Name
          </FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="University or Program name"
            size="md"
            fontSize="13px"
            borderRadius="2px"
          />
        </FormControl>

        <HStack spacing={3}>
          <FormControl isRequired flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Period
            </FormLabel>
            <Input
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              placeholder="e.g. 2020 - 2024"
              size="md"
              fontSize="13px"
              borderRadius="2px"
            />
          </FormControl>

          <FormControl flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              {type === "education" ? "GPA" : "Score"}
            </FormLabel>
            <Input
              name={type === "education" ? "gpa" : "score"}
              value={type === "education" ? formData.gpa : formData.score}
              onChange={handleInputChange}
              placeholder={type === "education" ? "3.50/4.0" : "85/100"}
              size="md"
              fontSize="13px"
              borderRadius="2px"
            />
          </FormControl>
        </HStack>

        <HStack spacing={3}>
          <FormControl isRequired flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Major/Field
            </FormLabel>
            <Input
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              placeholder="Field of study"
              size="md"
              fontSize="13px"
              borderRadius="2px"
            />
          </FormControl>

          <FormControl flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Degree/Certificate
            </FormLabel>
            <Input
              name="degree"
              value={formData.degree}
              onChange={handleInputChange}
              placeholder="e.g. Bachelor's"
              size="md"
              fontSize="13px"
              borderRadius="2px"
            />
          </FormControl>
        </HStack>

        <HStack spacing={3}>
          <FormControl isRequired flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Status
            </FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              size="md"
              fontSize="13px"
              borderRadius="2px"
            >
              <option value="Current">Current</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </Select>
          </FormControl>

          <FormControl isRequired flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Type
            </FormLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              size="md"
              fontSize="13px"
              borderRadius="2px"
            >
              <option value="formal">Formal Education</option>
              <option value="bootcamp">Bootcamp/Certification</option>
            </Select>
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
            Logo URL
          </FormLabel>
          <Input
            name="logo"
            value={formData.logo}
            onChange={handleInputChange}
            placeholder="https://example.com/logo.png"
            size="md"
            fontSize="13px"
            borderRadius="2px"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
            Description
          </FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description"
            rows={3}
            size="md"
            fontSize="13px"
            borderRadius="2px"
          />
        </FormControl>

        <ArrayInput
          label="Achievements"
          value={formData.achievements}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, achievements: val }))
          }
          placeholder="Add an achievement"
        />

        <ArrayInput
          label={type === "education" ? "Courses" : "Skills Learned"}
          value={type === "education" ? formData.courses : formData.skills}
          onChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              [type === "education" ? "courses" : "skills"]: val,
            }))
          }
          placeholder={type === "education" ? "Add a course" : "Add a skill"}
        />

        <HStack spacing={3} pt={3}>
          <Button
            type="submit"
            variant="facebook"
            size="md"
            h="36px"
            fontSize="13px"
            flex={1}
            isLoading={loading}
          >
            Save
          </Button>
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              flex={1}
              size="md"
              h="36px"
              fontSize="13px"
              borderColor="facebook.border"
              borderRadius="2px"
            >
              Cancel
            </Button>
          )}
        </HStack>
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="2px">
            <AlertDialogHeader fontSize="14px" fontWeight="bold">
              Confirm Save
            </AlertDialogHeader>
            <AlertDialogBody fontSize="13px">
              Are you sure you want to save this
              {type === "education" ? " education" : " certification"}?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                size="md"
                fontSize="13px"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={confirmSave}
                ml={2}
                size="md"
                fontSize="13px"
                isLoading={loading}
              >
                Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </form>
  );
};

export default EducationForm;
