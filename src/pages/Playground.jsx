import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowRight,
  Binary,
  Braces,
  CalendarClock,
  Check,
  Clipboard,
  Code2,
  Link2,
  Palette,
  RefreshCcw,
  Search,
  Trophy,
  Type,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import Header from "../components/layout/Header";
import { StudioPill, useStudioColors } from "../components/public/studio";
import { absoluteUrl, SITE_NAME } from "../utils/seo";
import TriviaArena from "../components/playground/TriviaArena";
import MovieFinder from "../components/playground/MovieFinder";

const DEFAULT_JSON = '{"name":"Aurio","skills":["Java","React"]}';
const DEFAULT_DATE = new Date().toISOString();

const TOOLS = [
  {
    id: "json",
    label: "JSON Formatter",
    note: "Format and check JSON.",
    icon: Braces,
  },
  {
    id: "text",
    label: "Text Analyzer",
    note: "Count words and characters.",
    icon: Type,
  },
  {
    id: "url",
    label: "URL Encoder",
    note: "Encode or decode URL text.",
    icon: Link2,
  },
  {
    id: "base64",
    label: "Base64 Converter",
    note: "Convert text to Base64.",
    icon: Binary,
  },
  {
    id: "date",
    label: "Date & Timestamp",
    note: "Convert dates and timestamps.",
    icon: CalendarClock,
  },
  {
    id: "color",
    label: "Color Converter",
    note: "Read HEX color values.",
    icon: Palette,
  },
  {
    id: "trivia",
    label: "Trivia Arena",
    note: "Play a quick quiz.",
    icon: Trophy,
  },
  {
    id: "movies",
    label: "Movie Finder",
    note: "Find a movie to watch.",
    icon: Search,
  },
];

const encodeBase64 = (value) => btoa(unescape(encodeURIComponent(value)));
const decodeBase64 = (value) => decodeURIComponent(escape(atob(value)));

const FieldLabel = ({ children }) => {
  const colors = useStudioColors();
  return (
    <Text
      mb={2}
      fontSize="11px"
      fontWeight="700"
      color={colors.muted}
      textTransform="uppercase"
      letterSpacing=".08em"
    >
      {children}
    </Text>
  );
};

const ToolShell = ({ title, description, children }) => {
  const colors = useStudioColors();
  return (
    <Box
      border="1px solid"
      borderColor={colors.border}
      bg={colors.surfaceAlt}
      p={{ base: 4, md: 6 }}
    >
      <Text
        fontSize={{ base: "20px", md: "24px" }}
        fontWeight="800"
        lineHeight="1.15"
      >
        {title}
      </Text>
      <Text mt={2} mb={6} fontSize="14px" color={colors.muted}>
        {description}
      </Text>
      {children}
    </Box>
  );
};

const CopyButton = ({ value }) => {
  const colors = useStudioColors();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast({
        title: "Copied",
        status: "success",
        duration: 1400,
        isClosable: true,
      });
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      toast({
        title: "Copy failed",
        status: "error",
        duration: 1800,
        isClosable: true,
      });
    }
  };
  return (
    <IconButton
      aria-label={copied ? "Copied" : "Copy output"}
      icon={copied ? <Check size={15} /> : <Clipboard size={15} />}
      variant="studioGhost"
      color={colors.muted}
      onClick={copy}
      isDisabled={!value}
      size="sm"
    />
  );
};

const OutputBox = ({ value, minH = "140px" }) => {
  const colors = useStudioColors();
  return (
    <Box position="relative">
      <FieldLabel>Output</FieldLabel>
      <Box
        minH={minH}
        p={4}
        pr={12}
        border="1px solid"
        borderColor={colors.border}
        bg={colors.surface}
        whiteSpace="pre-wrap"
        overflowWrap="anywhere"
        fontFamily="mono"
        fontSize="13px"
        lineHeight="1.65"
        color={value ? colors.text : colors.muted}
      >
        {value || "Your result will appear here."}
      </Box>
      <Box position="absolute" top="24px" right={2}>
        <CopyButton value={value} />
      </Box>
    </Box>
  );
};

const ToolButton = ({
  children,
  onClick,
  variant = "studio",
  leftIcon,
  rightIcon,
}) => (
  <Button
    size="sm"
    variant={variant}
    leftIcon={leftIcon}
    rightIcon={rightIcon}
    onClick={onClick}
  >
    {children}
  </Button>
);

const JsonTool = () => {
  const [input, setInput] = useState(DEFAULT_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
      setError("");
    } catch {
      setOutput("");
      setError("Invalid JSON. Check commas, quotes, and brackets.");
    }
  };
  return (
    <ToolShell
      title="JSON Formatter"
      description="Format JSON and find simple syntax errors."
    >
      <FieldLabel>Input</FieldLabel>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        minH="180px"
        fontFamily="mono"
        fontSize="13px"
        placeholder='{"name":"Alex"}'
      />
      <HStack mt={3} mb={6} spacing={2}>
        <ToolButton onClick={format} leftIcon={<Code2 size={14} />}>
          Format
        </ToolButton>
        <ToolButton
          variant="studioGhost"
          onClick={() => {
            setInput("");
            setOutput("");
            setError("");
          }}
          leftIcon={<RefreshCcw size={14} />}
        >
          Clear
        </ToolButton>
      </HStack>
      {error && (
        <Alert mb={5} status="error" variant="left-accent" fontSize="13px">
          <AlertIcon />
          {error}
        </Alert>
      )}
      <OutputBox value={output} />
    </ToolShell>
  );
};

const TextTool = () => {
  const colors = useStudioColors();
  const [input, setInput] = useState("");
  const stats = useMemo(() => {
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    return {
      words,
      characters: input.length,
      lines: input ? input.split(/\r?\n/).length : 0,
      time: words ? Math.max(1, Math.ceil(words / 200)) : 0,
    };
  }, [input]);
  return (
    <ToolShell
      title="Text Analyzer"
      description="Check words, characters, lines, and reading time."
    >
      <FieldLabel>Input</FieldLabel>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        minH="210px"
        placeholder="Type or paste text here."
      />
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2} mt={4}>
        {[
          ["Words", stats.words],
          ["Characters", stats.characters],
          ["Lines", stats.lines],
          ["Read time", stats.time + " min"],
        ].map(([label, value]) => {
          return (
            <Box
              key={label}
              border="1px solid"
              borderColor={colors.border}
              bg={colors.surface}
              p={3}
            >
              <Text
                fontSize="11px"
                color={colors.muted}
                textTransform="uppercase"
              >
                {label}
              </Text>
              <Text mt={1} fontSize="22px" fontWeight="800">
                {value}
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>
      <HStack mt={4}>
        <ToolButton
          variant="studioGhost"
          onClick={() => setInput("")}
          leftIcon={<RefreshCcw size={14} />}
        >
          Clear
        </ToolButton>
        <CopyButton value={input} />
      </HStack>
    </ToolShell>
  );
};

const ConvertTool = ({ type }) => {
  const [mode, setMode] = useState(type === "url" ? "encode" : "encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const title = type === "url" ? "URL Encoder" : "Base64 Converter";
  const description =
    type === "url"
      ? "Encode or decode text used in URLs."
      : "Convert plain text to Base64 and back.";
  const convert = () => {
    try {
      const result =
        type === "url"
          ? mode === "encode"
            ? encodeURIComponent(input)
            : decodeURIComponent(input)
          : mode === "encode"
            ? encodeBase64(input)
            : decodeBase64(input);
      setOutput(result);
      setError("");
    } catch {
      setOutput("");
      setError(
        type === "url"
          ? "This URL text cannot be decoded."
          : "This Base64 text is not valid.",
      );
    }
  };
  return (
    <ToolShell title={title} description={description}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mb={4}>
        <Box>
          <FieldLabel>Mode</FieldLabel>
          <Select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </Select>
        </Box>
        <Box>
          <FieldLabel>Input</FieldLabel>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={type === "url" ? "hello world" : "Type text here"}
          />
        </Box>
      </SimpleGrid>
      <HStack mb={6} spacing={2}>
        <ToolButton onClick={convert} leftIcon={<ArrowRight size={14} />}>
          Convert
        </ToolButton>
        <ToolButton
          variant="studioGhost"
          onClick={() => {
            setInput("");
            setOutput("");
            setError("");
          }}
          leftIcon={<RefreshCcw size={14} />}
        >
          Clear
        </ToolButton>
      </HStack>
      {error && (
        <Alert mb={5} status="error" variant="left-accent" fontSize="13px">
          <AlertIcon />
          {error}
        </Alert>
      )}
      <OutputBox value={output} minH="110px" />
    </ToolShell>
  );
};

const DateTool = () => {
  const [mode, setMode] = useState("date");
  const [input, setInput] = useState(DEFAULT_DATE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const convert = () => {
    const date =
      mode === "date" ? new Date(input) : new Date(Number(input) * 1000);
    if (Number.isNaN(date.getTime())) {
      setOutput("");
      setError("Enter a valid date or Unix timestamp.");
      return;
    }
    setError("");
    setOutput(
      mode === "date"
        ? String(Math.floor(date.getTime() / 1000))
        : date.toISOString(),
    );
  };
  return (
    <ToolShell
      title="Date & Timestamp"
      description="Convert dates and Unix timestamps."
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mb={4}>
        <Box>
          <FieldLabel>Mode</FieldLabel>
          <Select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="date">Date to timestamp</option>
            <option value="timestamp">Timestamp to date</option>
          </Select>
        </Box>
        <Box>
          <FieldLabel>Input</FieldLabel>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="2026-01-01"
          />
        </Box>
      </SimpleGrid>
      <HStack mb={6} spacing={2}>
        <ToolButton onClick={convert} leftIcon={<ArrowRight size={14} />}>
          Convert
        </ToolButton>
        <ToolButton
          variant="studioGhost"
          onClick={() => {
            setInput("");
            setOutput("");
            setError("");
          }}
          leftIcon={<RefreshCcw size={14} />}
        >
          Clear
        </ToolButton>
      </HStack>
      {error && (
        <Alert mb={5} status="error" variant="left-accent" fontSize="13px">
          <AlertIcon />
          {error}
        </Alert>
      )}
      <OutputBox value={output} minH="110px" />
    </ToolShell>
  );
};

const ColorTool = () => {
  const colors = useStudioColors();
  const [input, setInput] = useState("#2c2c2c");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const convert = () => {
    const clean = input.trim().replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(clean)) {
      setOutput("");
      setError("Use a 6-digit HEX color, like #2c2c2c.");
      return;
    }
    const n = parseInt(clean, 16);
    const rgb = { r: n >> 16, g: (n >> 8) & 255, b: n & 255 };
    const values = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
    const max = Math.max(...values);
    const min = Math.min(...values);
    const light = (max + min) / 2;
    const delta = max - min;
    let hue = 0;
    let saturation = 0;
    if (delta) {
      saturation = delta / (1 - Math.abs(2 * light - 1));
      if (max === values[0]) hue = ((values[1] - values[2]) / delta) % 6;
      else if (max === values[1]) hue = (values[2] - values[0]) / delta + 2;
      else hue = (values[0] - values[1]) / delta + 4;
      hue = Math.round(hue * 60);
      if (hue < 0) hue += 360;
    }
    setOutput(
      "HEX: #" +
        clean.toUpperCase() +
        "\nRGB: rgb(" +
        rgb.r +
        ", " +
        rgb.g +
        ", " +
        rgb.b +
        ")\nHSL: hsl(" +
        hue +
        ", " +
        Math.round(saturation * 100) +
        "%, " +
        Math.round(light * 100) +
        "%)",
    );
    setError("");
  };
  return (
    <ToolShell
      title="Color Converter"
      description="Convert a HEX color to RGB and HSL."
    >
      <FieldLabel>Input</FieldLabel>
      <Flex gap={3} align="end">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#2c2c2c"
        />
        <Box
          w="48px"
          h="40px"
          bg={input}
          border="1px solid"
          borderColor={colors.border}
          flexShrink={0}
        />
      </Flex>
      <HStack mt={3} mb={6} spacing={2}>
        <ToolButton onClick={convert} leftIcon={<Palette size={14} />}>
          Convert
        </ToolButton>
        <ToolButton
          variant="studioGhost"
          onClick={() => {
            setInput("");
            setOutput("");
            setError("");
          }}
          leftIcon={<RefreshCcw size={14} />}
        >
          Clear
        </ToolButton>
      </HStack>
      {error && (
        <Alert mb={5} status="error" variant="left-accent" fontSize="13px">
          <AlertIcon />
          {error}
        </Alert>
      )}
      <OutputBox value={output} minH="120px" />
    </ToolShell>
  );
};

const Challenge = () => {
  const colors = useStudioColors();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const questions = [
    {
      question: "Which tool turns spaces into URL-safe text?",
      options: ["URL Encoder", "Base64 Converter", "Text Analyzer"],
      answer: "URL Encoder",
    },
    {
      question: "Which format uses braces and key-value pairs?",
      options: ["JSON", "HEX", "Timestamp"],
      answer: "JSON",
    },
    {
      question: "Which value is a HEX color?",
      options: ["#2c2c2c", "1767225600", "hello world"],
      answer: "#2c2c2c",
    },
  ];
  const current = questions[step];
  const choose = (option) => {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) setScore((value) => value + 1);
  };
  return (
    <Box
      border="1px solid"
      borderColor={colors.border}
      bg={colors.surface}
      p={{ base: 4, md: 6 }}
    >
      <HStack justify="space-between" align="start" mb={4}>
        <HStack spacing={3}>
          <Trophy size={18} />
          <Box>
            <Text fontSize="18px" fontWeight="800">
              Toolbox Challenge
            </Text>
            <Text mt={1} fontSize="13px" color={colors.muted}>
              A quick question before you go.
            </Text>
          </Box>
        </HStack>
        <Text fontSize="12px" color={colors.muted}>
          Your score: {score}
        </Text>
      </HStack>
      <Text fontSize="15px" fontWeight="700" mb={4}>
        {current.question}
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2}>
        {current.options.map((option) => {
          const correct = selected && option === current.answer;
          const wrong = selected === option && option !== current.answer;
          return (
            <Button
              key={option}
              variant={correct ? "studio" : "studioGhost"}
              borderColor={wrong ? "#9f2436" : undefined}
              color={wrong ? "#9f2436" : undefined}
              onClick={() => choose(option)}
              isDisabled={Boolean(selected)}
              whiteSpace="normal"
              h="auto"
              minH="42px"
              py={2}
            >
              {option}
            </Button>
          );
        })}
      </SimpleGrid>
      {selected && (
        <Flex
          mt={4}
          justify="space-between"
          align="center"
          gap={3}
          flexWrap="wrap"
        >
          <Text
            fontSize="13px"
            color={selected === current.answer ? colors.text : colors.muted}
          >
            {selected === current.answer ? "Correct" : "Try again"}
          </Text>
          <ToolButton
            onClick={() => {
              setStep((value) => (value + 1) % questions.length);
              setSelected("");
            }}
            rightIcon={<ArrowRight size={14} />}
          >
            Next challenge
          </ToolButton>
        </Flex>
      )}
    </Box>
  );
};

const Playground = ({ isDownloading, handleDownload }) => {
  const colors = useStudioColors();
  const [activeTool, setActiveTool] = useState("json");
  const active = TOOLS.find((tool) => tool.id === activeTool) || TOOLS[0];
  const ActiveIcon = active.icon;
  const canonicalUrl = absoluteUrl("/playground");
  return (
    <Box minH="100vh" bg={colors.bg} color={colors.text}>
      <Helmet>
        <title>{"Playground | " + SITE_NAME}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta
          name="description"
          content="Simple browser tools for text, URLs, dates, colors, and JSON."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={"Playground | " + SITE_NAME} />
        <meta
          property="og:description"
          content="Simple browser tools for text, URLs, dates, colors, and JSON."
        />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>
      <Header isDownloading={isDownloading} handleDownload={handleDownload} />
      <Container
        maxW="1240px"
        px={{ base: 4, md: 6 }}
        pt={{ base: 24, md: 32 }}
        pb={{ base: 14, md: 20 }}
      >
        <Box
          border="1px solid"
          borderColor={colors.border}
          bg={colors.surfaceAlt}
          p={{ base: 5, md: 8 }}
          mb={{ base: 8, md: 12 }}
        >
          <Grid
            templateColumns={{
              base: "1fr",
              lg: "minmax(0, 1fr) minmax(360px, .85fr)",
            }}
            gap={{ base: 8, lg: 12 }}
            alignItems="center"
          >
            <Box>
              <Text
                as="h1"
                fontSize={{ base: "38px", md: "62px" }}
                fontWeight="800"
                lineHeight="1.02"
              >
                Try a tool. See a result.
              </Text>
              <Text
                mt={5}
                maxW="560px"
                fontSize={{ base: "15px", md: "17px" }}
                color={colors.muted}
                lineHeight="1.7"
              >
                Useful browser tools for quick tasks. Your input stays on this
                device.
              </Text>
              <HStack mt={6} spacing={3} flexWrap="wrap">
                <Button
                  as={RouterLink}
                  to="/"
                  variant="studioGhost"
                  leftIcon={<ArrowRight size={15} />}
                >
                  Back to portfolio
                </Button>
                <StudioPill tone="ghost">8 local tools</StudioPill>
              </HStack>
            </Box>
            <Box
              position="relative"
              minH={{ base: "220px", md: "260px" }}
              border="1px solid"
              borderColor={colors.border}
              bg={colors.surface}
              p={{ base: 4, md: 6 }}
              overflow="hidden"
            >
              <Flex justify="space-between" align="center" mb={5}>
                <HStack spacing={2}>
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing=".08em"
                  >
                    Local workspace
                  </Text>
                </HStack>
                <Text fontSize="11px" color={colors.muted}>
                  Ready
                </Text>
              </Flex>
              <Box
                border="1px solid"
                borderColor={colors.border}
                bg={colors.surfaceAlt}
                p={4}
                transform="rotate(-2deg)"
              >
                <HStack justify="space-between" mb={4}>
                  <HStack spacing={2}>
                    <Braces size={15} />
                    <Text fontSize="13px" fontWeight="700">
                      JSON Formatter
                    </Text>
                  </HStack>
                  <Text fontSize="11px" color={colors.muted}>
                    Input
                  </Text>
                </HStack>
                <Box h="10px" w="72%" bg={colors.border} mb={2} />
                <Box h="10px" w="48%" bg={colors.border} mb={5} />
                <HStack justify="space-between">
                  <Text fontSize="11px" color={colors.muted}>
                    Clear structure
                  </Text>
                  <Text fontSize="11px" fontWeight="700">
                    Ready to copy
                  </Text>
                </HStack>
              </Box>
              <Box
                position="absolute"
                right={{ base: 4, md: 8 }}
                bottom={{ base: 4, md: 7 }}
                border="1px solid"
                borderColor={colors.border}
                bg={colors.surfaceAlt}
                px={3}
                py={2}
                transform="rotate(3deg)"
              >
                <Text fontSize="11px" fontWeight="700">
                  No upload
                </Text>
              </Box>
            </Box>
          </Grid>
        </Box>
        <Box
          display={{ base: "block", lg: "none" }}
          mb={5}
          mx={{ base: -4, md: 0 }}
          px={{ base: 4, md: 0 }}
          overflowX="auto"
          overflowY="hidden"
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <HStack spacing={2} minW="max-content">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = tool.id === activeTool;
              return (
                <Button
                  key={tool.id}
                  variant={isActive ? "studio" : "studioGhost"}
                  leftIcon={<Icon size={15} />}
                  minH="42px"
                  px={3}
                  onClick={() => setActiveTool(tool.id)}
                  whiteSpace="nowrap"
                  fontSize="12px"
                >
                  {tool.label}
                </Button>
              );
            })}
          </HStack>
        </Box>
        <Grid
          templateColumns={{ base: "1fr", lg: "250px minmax(0, 1fr)" }}
          gap={{ base: 5, lg: 10 }}
          alignItems="start"
        >
          <Box display={{ base: "none", lg: "block" }}>
            <Text
              mb={3}
              fontSize="11px"
              fontWeight="700"
              color={colors.muted}
              textTransform="uppercase"
              letterSpacing=".08em"
            >
              Choose a tool
            </Text>
            <VStack align="stretch" spacing={2}>
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = tool.id === activeTool;
                return (
                  <Button
                    key={tool.id}
                    variant={isActive ? "studio" : "studioGhost"}
                    justifyContent="flex-start"
                    leftIcon={<Icon size={16} />}
                    h="auto"
                    minH="48px"
                    py={3}
                    whiteSpace="normal"
                    textAlign="left"
                    onClick={() => setActiveTool(tool.id)}
                  >
                    <Box textAlign="left">
                      <Text fontSize="13px" fontWeight="700">
                        {tool.label}
                      </Text>
                      <Text
                        fontSize="11px"
                        fontWeight="400"
                        opacity={isActive ? 0.78 : 0.66}
                      >
                        {tool.note}
                      </Text>
                    </Box>
                  </Button>
                );
              })}
            </VStack>
          </Box>
          <Box>
            <HStack mb={3} justify="space-between" align="center">
              <HStack spacing={2}>
                <ActiveIcon size={17} />
                <Text fontSize="13px" fontWeight="700">
                  {active.label}
                </Text>
              </HStack>
              <Text fontSize="11px" color={colors.muted}>
                Runs in your browser
              </Text>
            </HStack>
            {activeTool === "json" && <JsonTool />}
            {activeTool === "text" && <TextTool />}
            {activeTool === "url" && <ConvertTool type="url" />}
            {activeTool === "base64" && <ConvertTool type="base64" />}
            {activeTool === "date" && <DateTool />}
            {activeTool === "color" && <ColorTool />}
            {activeTool === "trivia" && <TriviaArena />}
            {activeTool === "movies" && <MovieFinder />}
          </Box>
        </Grid>{" "}
        <Box mt={{ base: 8, md: 12 }}>
          <Challenge />
        </Box>
      </Container>
    </Box>
  );
};

export default Playground;
