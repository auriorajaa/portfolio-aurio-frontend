import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  HStack,
  Progress,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowRight, RefreshCcw, Trophy } from "lucide-react";
import {
  FALLBACK_TRIVIA,
  TRIVIA_CATEGORIES,
  getTriviaQuestions,
} from "../../services/triviaService";
import { getPublicApiMessage } from "../../services/publicApi";
import { useStudioColors } from "../public/studio";

const TriviaArena = () => {
  const colors = useStudioColors();
  const [category, setCategory] = useState("0");
  const [difficulty, setDifficulty] = useState("any");
  const [amount, setAmount] = useState("5");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [fallbackNotice, setFallbackNotice] = useState("");
  const requestRef = useRef(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  const startQuiz = async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setStatus("loading");
    setError("");
    setFallbackNotice("");
    setQuestions([]);
    setSelected("");
    setCurrentIndex(0);
    setScore(0);
    try {
      const result = await getTriviaQuestions({
        category,
        difficulty,
        amount,
        signal: controller.signal,
      });
      setQuestions(result);
      setStatus("ready");
    } catch (requestError) {
      if (requestError.code === "ABORTED") return;
      setQuestions(
        FALLBACK_TRIVIA.slice(
          0,
          Math.min(Number(amount), FALLBACK_TRIVIA.length),
        ),
      );
      setStatus("ready");
      setFallbackNotice(
        "Live questions are unavailable. Try these local questions instead.",
      );
      setError(
        getPublicApiMessage(
          requestError,
          "Questions are not available right now.",
        ),
      );
    }
  };

  const current = questions[currentIndex];
  const answered = Boolean(selected);
  const finished = status === "ready" && !current;

  const chooseAnswer = (answer) => {
    if (answered) return;
    setSelected(answer);
    if (answer === current.answer) setScore((value) => value + 1);
  };

  const nextQuestion = () => {
    setCurrentIndex((value) => value + 1);
    setSelected("");
  };

  return (
    <Box
      border="1px solid"
      borderColor={colors.border}
      bg={colors.surfaceAlt}
      p={{ base: 4, md: 6 }}
    >
      <Flex
        justify="space-between"
        align="start"
        gap={4}
        flexWrap="wrap"
        mb={6}
      >
        <Box>
          <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="800">
            Trivia Arena
          </Text>
          <Text mt={2} fontSize="14px" color={colors.muted}>
            Pick a topic and test your score.
          </Text>
        </Box>
        <HStack spacing={2} color={colors.muted} fontSize="13px">
          <Trophy size={16} /> <Text>Local score only</Text>
        </HStack>
      </Flex>

      {status !== "ready" && (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} mb={4}>
          <Box>
            <Text
              mb={2}
              fontSize="11px"
              fontWeight="700"
              color={colors.muted}
              textTransform="uppercase"
            >
              Category
            </Text>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {TRIVIA_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Text
              mb={2}
              fontSize="11px"
              fontWeight="700"
              color={colors.muted}
              textTransform="uppercase"
            >
              Difficulty
            </Text>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="any">Any difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </Box>
          <Box>
            <Text
              mb={2}
              fontSize="11px"
              fontWeight="700"
              color={colors.muted}
              textTransform="uppercase"
            >
              Questions
            </Text>
            <Select value={amount} onChange={(e) => setAmount(e.target.value)}>
              <option value="5">5 questions</option>
              <option value="10">10 questions</option>
              <option value="15">15 questions</option>
            </Select>
          </Box>
        </SimpleGrid>
      )}

      {status === "loading" && (
        <Flex minH="180px" align="center" justify="center">
          <VStack spacing={3}>
            <Spinner color={colors.accent} />
            <Text fontSize="13px" color={colors.muted}>
              Loading questions...
            </Text>
          </VStack>
        </Flex>
      )}

      {error && !fallbackNotice && (
        <Alert mb={4} status="error" variant="left-accent" fontSize="13px">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {fallbackNotice && (
        <Alert mb={4} status="warning" variant="left-accent" fontSize="13px">
          <AlertIcon />
          {fallbackNotice}
        </Alert>
      )}

      {status !== "ready" && status !== "loading" && (
        <Button
          onClick={startQuiz}
          leftIcon={<Trophy size={15} />}
          variant="studio"
        >
          Start quiz
        </Button>
      )}

      {status === "ready" && current && (
        <VStack align="stretch" spacing={5}>
          <Box>
            <Flex
              justify="space-between"
              mb={2}
              fontSize="12px"
              color={colors.muted}
            >
              <Text>
                Question {currentIndex + 1} of {questions.length}
              </Text>
              <Text>Score: {score}</Text>
            </Flex>
            <Progress
              value={((currentIndex + 1) / questions.length) * 100}
              size="sm"
              colorScheme="gray"
              borderRadius="0"
            />
          </Box>
          <Text
            fontSize={{ base: "18px", md: "22px" }}
            fontWeight="800"
            lineHeight="1.3"
          >
            {current.question}
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
            {current.answers.map((answer) => {
              const correct = answered && answer === current.answer;
              const wrong = answered && answer === selected && !correct;
              return (
                <Button
                  key={answer}
                  variant={correct ? "studio" : "studioGhost"}
                  borderColor={wrong ? "#9f2436" : undefined}
                  color={wrong ? "#9f2436" : undefined}
                  onClick={() => chooseAnswer(answer)}
                  isDisabled={answered}
                  whiteSpace="normal"
                  h="auto"
                  minH="48px"
                  py={3}
                >
                  {answer}
                </Button>
              );
            })}
          </SimpleGrid>
          {answered && (
            <Flex
              justify="space-between"
              align="center"
              gap={3}
              flexWrap="wrap"
            >
              <Text
                fontSize="14px"
                fontWeight="700"
                color={selected === current.answer ? colors.text : "#9f2436"}
              >
                {selected === current.answer ? "Correct" : "Wrong"}
              </Text>
              <Button
                onClick={nextQuestion}
                variant="studio"
                rightIcon={<ArrowRight size={14} />}
              >
                {currentIndex + 1 === questions.length
                  ? "See score"
                  : "Next question"}
              </Button>
            </Flex>
          )}
        </VStack>
      )}

      {finished && (
        <VStack align="stretch" spacing={4} py={8} textAlign="center">
          <Trophy size={28} style={{ margin: "0 auto" }} />
          <Text fontSize="28px" fontWeight="800">
            Your score: {score} / {questions.length}
          </Text>
          <Text fontSize="14px" color={colors.muted}>
            {score === questions.length
              ? "Perfect score."
              : "Good try. You can play again."}
          </Text>
          <Button
            alignSelf="center"
            onClick={() => {
              setStatus("idle");
              setError("");
              setFallbackNotice("");
            }}
            variant="studio"
            leftIcon={<RefreshCcw size={14} />}
          >
            Play again
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default TriviaArena;
