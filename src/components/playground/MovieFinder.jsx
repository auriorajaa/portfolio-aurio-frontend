import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Search, Star, X } from "lucide-react";
import {
  getMovieDetails,
  getMovieGenres,
  getMovieImageUrl,
  searchMovies,
} from "../../services/movieService";
import { getPublicApiMessage } from "../../services/publicApi";
import { useStudioColors } from "../public/studio";

const MovieFinder = () => {
  const colors = useStudioColors();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("popularity.desc");
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const searchRef = useRef(null);
  const searchTimerRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    getMovieGenres({ signal: controller.signal })
      .then(setGenres)
      .catch(() => setGenres([]));
    return () => {
      controller.abort();
      window.clearTimeout(searchTimerRef.current);
    };
  }, []);

  const loadMovies = async () => {
    searchRef.current?.abort();
    const controller = new AbortController();
    searchRef.current = controller;
    setStatus("loading");
    setError("");
    try {
      const result = await searchMovies({
        query,
        genre,
        sort,
        signal: controller.signal,
      });
      const withImages = await Promise.all(
        result
          .slice(0, 16)
          .map(async (movie) => ({
            ...movie,
            posterUrl: await getMovieImageUrl(movie.posterPath, {
              signal: controller.signal,
            }),
          })),
      );
      setMovies(withImages);
      setStatus(withImages.length ? "success" : "empty");
    } catch (requestError) {
      if (requestError.code === "ABORTED") return;
      setMovies([]);
      setStatus("error");
      setError(
        getPublicApiMessage(
          requestError,
          "Movie search is not available right now.",
        ),
      );
    }
  };

  const scheduleSearch = () => {
    window.clearTimeout(searchTimerRef.current);
    searchTimerRef.current = window.setTimeout(loadMovies, 250);
  };

  const clear = () => {
    searchRef.current?.abort();
    setQuery("");
    setGenre("");
    setMovies([]);
    setError("");
    setStatus("idle");
  };

  const openDetails = async (movie) => {
    detailsRef.current?.abort();
    const controller = new AbortController();
    detailsRef.current = controller;
    setDetailsLoading(true);
    setDetailsError("");
    setSelectedMovie(movie);
    onOpen();
    try {
      const detail = await getMovieDetails(movie.id, {
        signal: controller.signal,
      });
      const posterUrl = await getMovieImageUrl(detail.posterPath, {
        size: "w780",
        signal: controller.signal,
      });
      setSelectedMovie({ ...detail, posterUrl });
    } catch (requestError) {
      if (requestError.code !== "ABORTED")
        setDetailsError(
          getPublicApiMessage(requestError, "Could not load movie details."),
        );
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    detailsRef.current?.abort();
    onClose();
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
            Movie Finder
          </Text>
          <Text mt={2} fontSize="14px" color={colors.muted}>
            Find a movie by title, genre, or mood.
          </Text>
        </Box>
        <Text fontSize="12px" color={colors.muted}>
          Movie data and images by TMDB
        </Text>
      </Flex>

      <Grid
        templateColumns={{ base: "1fr", md: "minmax(0, 1fr) 180px 180px auto" }}
        gap={3}
        alignItems="end"
      >
        <Box>
          <Text
            mb={2}
            fontSize="11px"
            fontWeight="700"
            color={colors.muted}
            textTransform="uppercase"
          >
            Title
          </Text>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && scheduleSearch()}
            placeholder="Try a movie title"
          />
        </Box>
        <Box>
          <Text
            mb={2}
            fontSize="11px"
            fontWeight="700"
            color={colors.muted}
            textTransform="uppercase"
          >
            Genre
          </Text>
          <Select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All genres</option>
            {genres.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
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
            Sort
          </Text>
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popularity.desc">Popular</option>
            <option value="vote_average.desc">Top rated</option>
            <option value="primary_release_date.desc">Latest</option>
          </Select>
        </Box>
        <HStack>
          <Button
            onClick={scheduleSearch}
            variant="studio"
            leftIcon={<Search size={14} />}
            isLoading={status === "loading"}
          >
            Search
          </Button>
          <Button
            onClick={clear}
            variant="studioGhost"
            aria-label="Clear movie search"
          >
            <X size={15} />
          </Button>
        </HStack>
      </Grid>

      {status === "error" && (
        <Alert mt={5} status="error" variant="left-accent" fontSize="13px">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {status === "empty" && (
        <Box
          mt={6}
          py={10}
          textAlign="center"
          border="1px solid"
          borderColor={colors.border}
          bg={colors.surface}
        >
          <Text fontWeight="700">No movies found.</Text>
          <Text mt={2} fontSize="13px" color={colors.muted}>
            Try another title or filter.
          </Text>
        </Box>
      )}
      {status === "idle" && (
        <Box
          mt={6}
          py={10}
          textAlign="center"
          border="1px solid"
          borderColor={colors.border}
          bg={colors.surface}
        >
          <Text fontWeight="700">Search for a movie.</Text>
          <Text mt={2} fontSize="13px" color={colors.muted}>
            Use the filters above to get started.
          </Text>
        </Box>
      )}
      {status === "loading" && (
        <SimpleGrid mt={6} columns={{ base: 2, md: 3, xl: 4 }} gap={4}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Box key={index}>
              <Skeleton aspectRatio="2 / 3" />
              <Skeleton mt={3} h="18px" />
              <Skeleton mt={2} h="12px" w="60%" />
            </Box>
          ))}
        </SimpleGrid>
      )}
      {status === "success" && (
        <SimpleGrid
          mt={6}
          columns={{ base: 2, md: 3, xl: 4 }}
          gap={{ base: 3, md: 5 }}
        >
          {movies.map((movie) => (
            <Box
              key={movie.id}
              border="1px solid"
              borderColor={colors.border}
              overflow="hidden"
            >
              <Box aspectRatio="2 / 3" bg={colors.surfaceSolid}>
                {movie.posterUrl ? (
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Flex
                    h="100%"
                    align="center"
                    justify="center"
                    p={4}
                    textAlign="center"
                  >
                    <Text fontSize="12px" color={colors.muted}>
                      No poster
                    </Text>
                  </Flex>
                )}
              </Box>
              <Box
                p={{ base: 3, md: 4 }}
                display="flex"
                flexDirection="column"
                minH="150px"
              >
                <Text fontSize="14px" fontWeight="800" noOfLines={2}>
                  {movie.title}
                </Text>

                <HStack mt={2} spacing={2} fontSize="12px">
                  <Text>{movie.year}</Text>
                  <Text>•</Text>
                  <Star size={12} fill="currentColor" />
                  <Text>{movie.rating}</Text>
                </HStack>

                <Button
                  mt="auto"
                  pt={0}
                  w="100%"
                  size="sm"
                  variant="studioGhost"
                  onClick={() => openDetails(movie)}
                >
                  View details
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <Text mt={6} fontSize="11px" color={colors.muted}>
        Movie data and images by TMDB.
      </Text>

      <Modal
        isOpen={isOpen}
        onClose={closeDetails}
        size="4xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay bg={colors.overlay} backdropFilter="blur(12px)" />
        <ModalContent
          bg={colors.surfaceAlt}
          color={colors.text}
          border="1px solid"
          borderColor={colors.border}
          borderRadius="0"
          overflow="hidden"
          mx={3}
        >
          <ModalHeader fontSize="20px">
            {selectedMovie?.title || "Movie details"}
          </ModalHeader>
          <ModalCloseButton aria-label="Close movie details" />
          <ModalBody pb={6}>
            {detailsError && (
              <Alert
                mb={5}
                status="error"
                variant="left-accent"
                fontSize="13px"
              >
                <AlertIcon />
                {detailsError}
              </Alert>
            )}
            <Grid
              templateColumns={{ base: "1fr", md: "240px minmax(0, 1fr)" }}
              gap={6}
            >
              <Box bg={colors.surface} minH={{ base: "300px", md: "360px" }}>
                {detailsLoading ? (
                  <Skeleton h="100%" minH="360px" />
                ) : selectedMovie?.posterUrl ? (
                  <Image
                    src={selectedMovie.posterUrl}
                    alt={selectedMovie.title}
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                ) : (
                  <Flex h="100%" minH="300px" align="center" justify="center">
                    <Text color={colors.muted}>No poster</Text>
                  </Flex>
                )}
              </Box>
              <Box>
                <HStack spacing={2} color={colors.muted} fontSize="13px">
                  <Text>{selectedMovie?.year}</Text>
                  <Text>•</Text>
                  <Star size={13} fill="currentColor" />
                  <Text>{selectedMovie?.rating}</Text>
                  {selectedMovie?.runtime && (
                    <>
                      <Text>•</Text>
                      <Text>{selectedMovie.runtime} min</Text>
                    </>
                  )}
                </HStack>
                <Text
                  mt={5}
                  fontSize="14px"
                  lineHeight="1.75"
                  color={colors.muted}
                >
                  {selectedMovie?.overview}
                </Text>
                {selectedMovie?.genres?.length > 0 && (
                  <HStack mt={5} spacing={2} flexWrap="wrap">
                    {selectedMovie.genres.map((item) => (
                      <Box
                        key={item.id || item.name}
                        px={2}
                        py={1}
                        border="1px solid"
                        borderColor={colors.border}
                        fontSize="12px"
                      >
                        {item.name || item}
                      </Box>
                    ))}
                  </HStack>
                )}
              </Box>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MovieFinder;
