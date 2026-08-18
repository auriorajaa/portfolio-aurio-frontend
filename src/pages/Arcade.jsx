import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Button, Container, Grid, HStack, Text } from "@chakra-ui/react";
import {
  Brain,
  Disc,
  Grid2X2,
  Hammer,
  Hash,
  Rabbit,
  Route,
  Swords,
  Zap,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import Header from "../components/layout/Header";
import { useStudioColors } from "../components/public/studio";
import { absoluteUrl, SITE_NAME } from "../utils/seo";
import Game2048 from "../components/arcade/2048Game";
import MemoryMatch from "../components/arcade/MemoryMatch";
import ReactionDodge from "../components/arcade/ReactionDodge";
import TicTacToe from "../components/arcade/TicTacToe";
import RockPaperScissors from "../components/arcade/RockPaperScissors";
import WhacAMole from "../components/arcade/WhacAMole";
import Snake from "../components/arcade/Snake";
import Pong from "../components/arcade/Pong";
import EndlessRunner from "../components/arcade/EndlessRunner";

const GAMES = [
  {
    id: "2048",
    label: "2048 Mini",
    note: "Color tiles",
    icon: Grid2X2,
    color: "#ffca3a",
    component: Game2048,
  },
  {
    id: "memory",
    label: "Memory Match",
    note: "Find pairs",
    icon: Brain,
    color: "#f15bb5",
    component: MemoryMatch,
  },
  {
    id: "dodge",
    label: "Reaction Dodge",
    note: "Move fast",
    icon: Zap,
    color: "#00bbf9",
    component: ReactionDodge,
  },
  {
    id: "tictactoe",
    label: "Tic-Tac-Toe",
    note: "Beat the computer",
    icon: Hash,
    color: "#00f5d4",
    component: TicTacToe,
  },
  {
    id: "rps",
    label: "Rock Paper Scissors",
    note: "Outsmart the computer",
    icon: Swords,
    color: "#9b5de5",
    component: RockPaperScissors,
  },
  {
    id: "whacamole",
    label: "Whac-a-Mole",
    note: "Quick reflexes",
    icon: Hammer,
    color: "#8ac926",
    component: WhacAMole,
  },
  {
    id: "snake",
    label: "Snake",
    note: "Classic grid game",
    icon: Route,
    color: "#0bbfa0",
    component: Snake,
  },
  {
    id: "pong",
    label: "Pong",
    note: "Beat the computer",
    icon: Disc,
    color: "#ff9f68",
    component: Pong,
  },
  {
    id: "runner",
    label: "Endless Runner",
    note: "Dodge and jump",
    icon: Rabbit,
    color: "#ff6b6b",
    component: EndlessRunner,
  },
];

class ArcadeGameBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return (
        <Box
          p={8}
          border="1px solid"
          borderColor={this.props.colors.border}
          textAlign="center"
        >
          <Text fontWeight="800">This game could not start.</Text>
          <Text mt={2} fontSize="13px" color={this.props.colors.muted}>
            Try another game.
          </Text>
        </Box>
      );
    return this.props.children;
  }
}

const Arcade = ({ isDownloading, handleDownload }) => {
  const colors = useStudioColors();
  const [activeGame, setActiveGame] = useState("2048");
  const active = GAMES.find((game) => game.id === activeGame) || GAMES[0];
  const ActiveGame = active.component;
  const canonicalUrl = absoluteUrl("/arcade");
  return (
    <Box minH="100vh" bg={colors.bg} color={colors.text}>
      <Helmet>
        <title>{"Arcade | " + SITE_NAME}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta
          name="description"
          content="Small browser games for a quick break."
        />
        <meta property="og:title" content={"Arcade | " + SITE_NAME} />
        <meta
          property="og:description"
          content="Small browser games for a quick break."
        />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>
      <Header isDownloading={isDownloading} handleDownload={handleDownload} />
      <Container
        maxW="1080px"
        px={{ base: 4, md: 6 }}
        pt={{ base: 24, md: 32 }}
        pb={{ base: 14, md: 20 }}
      >
        <Box
          bg={colors.text}
          color={colors.surfaceAlt}
          p={{ base: 5, md: 8 }}
          position="relative"
          overflow="hidden"
          mb={{ base: 7, md: 10 }}
        >
          <Box
            position="absolute"
            right="-30px"
            top="-45px"
            w="150px"
            h="150px"
            borderRadius="full"
            bg="#f15bb5"
            opacity=".9"
          />
          <Box
            position="absolute"
            right="100px"
            bottom="-55px"
            w="130px"
            h="130px"
            borderRadius="full"
            bg="#00f5d4"
            opacity=".85"
          />
          <Box position="relative">
            <Text
              as="h1"
              fontSize={{ base: "38px", md: "62px" }}
              fontWeight="800"
              lineHeight="1.02"
              maxW="650px"
            >
              Small games for a quick break.
            </Text>
            <Text
              mt={4}
              maxW="560px"
              fontSize={{ base: "15px", md: "17px" }}
              opacity=".76"
              lineHeight="1.7"
            >
              Swipe, tap, drag, and try again. No sign-in. No high score table.
            </Text>
            <Button
              as={RouterLink}
              to="/"
              mt={6}
              bg={colors.surfaceAlt}
              color={colors.text}
              _hover={{ bg: "#ffca3a" }}
              variant="solid"
            >
              Back to portfolio
            </Button>
          </Box>
        </Box>
        <Grid
          templateColumns={{
            base: "repeat(3, minmax(0, 1fr))",
            md: "repeat(5, 1fr)",
          }}
          gap={{ base: 2, md: 3 }}
          mb={{ base: 6, md: 8 }}
        >
          {GAMES.map((game) => {
            const activeStyle = activeGame === game.id;
            return (
              <Button
                key={game.id}
                borderRadius={0}
                onClick={() => setActiveGame(game.id)}
                variant="unstyled"
                h="auto"
                minH={{ base: "62px", md: "70px" }}
                p={{ base: 2.5, md: 3 }}
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                whiteSpace="normal"
                textAlign="left"
                bg={activeStyle ? game.color : colors.surfaceAlt}
                color={activeStyle ? "#171717" : colors.text}
                border="2px solid"
                borderColor={activeStyle ? game.color : colors.border}
                transform={activeStyle ? "translateY(-3px)" : "none"}
                transition="all .2s"
                _hover={{
                  transform: "translateY(-3px)",
                  borderColor: game.color,
                }}
              >
                <Text
                  fontSize={{ base: "10px", md: "11px" }}
                  fontWeight="800"
                  opacity=".65"
                  lineHeight="1"
                  mb={1.5}
                >
                  {activeStyle ? "PLAYING" : "PLAY"}
                </Text>

                <Text
                  fontSize={{ base: "11px", md: "13px" }}
                  fontWeight="800"
                  lineHeight="1.2"
                >
                  {game.label}
                </Text>

                <Text
                  mt={0.5}
                  fontSize={{ base: "9px", md: "10px" }}
                  opacity=".65"
                  lineHeight="1.2"
                >
                  {game.note}
                </Text>
              </Button>
            );
          })}
        </Grid>
        <Box
          bg={colors.surfaceAlt}
          border="2px solid"
          borderColor={active.color}
          p={{ base: 4, md: 8 }}
          boxShadow={`8px 8px 0 ${active.color}`}
        >
          <HStack justify="space-between" mb={6}>
            <HStack spacing={2}>
              <Box w="10px" h="10px" borderRadius="full" bg={active.color} />
              <Text
                fontSize="12px"
                fontWeight="800"
                textTransform="uppercase"
                letterSpacing=".1em"
              >
                {active.label}
              </Text>
            </HStack>
            <Text fontSize="11px" color={colors.muted}>
              Local play
            </Text>
          </HStack>
          <ArcadeGameBoundary colors={colors} key={activeGame}>
            <ActiveGame />
          </ArcadeGameBoundary>
        </Box>
      </Container>
    </Box>
  );
};
export default Arcade;