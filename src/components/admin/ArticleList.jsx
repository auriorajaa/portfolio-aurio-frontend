// src/components/admin/ArticleList.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  Badge,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Select,
  Spinner,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Share2 } from "lucide-react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import {
  getAllArticles,
  deleteArticle,
  updateArticle,
} from "../../services/articleService";
import { useNavigate } from "react-router-dom";
import Pagination from "../ui/Pagination";

const ArticleList = ({ onEdit, onView, refresh }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const toast = useToast();

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await getAllArticles();
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load articles",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
    // eslint-disable-next-line
  }, [refresh]);

  useEffect(() => {
    let sorted = [...articles];

    switch (sortBy) {
      case "date":
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "featured":
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredArticles(sorted);
    setCurrentPage(1);
  }, [sortBy, articles]);

  const handleDelete = async () => {
    try {
      await deleteArticle(deleteId);
      toast({
        title: "Success",
        description: "Article deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      loadArticles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    onOpen();
  };

  const handleVisibilityChange = async (articleId, newStatus) => {
    try {
      const article = articles.find((a) => a.id === articleId);
      await updateArticle(articleId, { ...article, visibility: newStatus });
      toast({
        title: "Success",
        description: `Article visibility changed to ${newStatus}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      loadArticles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVisit = (slug) => {
    navigate(`/article/${slug}`);
  };

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="facebook.blue" />
      </Center>
    );
  }

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );

  return (
    <Box>
      <Stack
        direction={{ base: "column", sm: "row" }}
        mb={3}
        justify="space-between"
        spacing={2}
      >
        <Text fontSize="13px">Total: {filteredArticles.length} articles</Text>
        <Select
          w={{ base: "full", sm: "150px" }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          size="sm"
          fontSize="13px"
        >
          <option value="date">Sort by Date</option>
          <option value="featured">Featured First</option>
          <option value="title">Sort by Title</option>
        </Select>
      </Stack>

      {filteredArticles.length === 0 ? (
        <Box
          p={6}
          textAlign="center"
          borderRadius="2px"
          border="1px solid"
          borderColor="facebook.border"
        >
          <Text fontSize="13px" color="facebook.lightText">
            No articles yet. Create your first article!
          </Text>
        </Box>
      ) : (
        <>
          <VStack spacing={0} align="stretch">
            {currentArticles.map((article, idx) => (
              <Box
                key={article.id}
                px={3}
                py={2}
                borderBottom={
                  idx !== currentArticles.length - 1 ? "1px solid" : "none"
                }
                borderColor="facebook.border"
              >
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={3}
                  align={{ base: "start", md: "start" }}
                >
                  {article.image && (
                    <Box
                      flexShrink={0}
                      w={{ base: "100%", md: "80px" }}
                      h="80px"
                      border="1px solid"
                      borderColor="facebook.border"
                      overflow="hidden"
                    >
                      <Image
                        src={article.image}
                        alt={article.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    </Box>
                  )}
                  <VStack align="start" flex={1} spacing={1}>
                    <HStack flexWrap="wrap">
                      <Text
                        fontSize="14px"
                        fontWeight="bold"
                        color="facebook.blue"
                      >
                        {article.title}
                      </Text>
                      {article.featured && (
                        <Badge bg="#f7f7a3" color="#333" fontSize="9px" px={1}>
                          Featured
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="13px" noOfLines={1}>
                      {article.excerpt}
                    </Text>
                    <HStack
                      fontSize="12px"
                      color="facebook.lightText"
                      spacing={1}
                      flexWrap="wrap"
                    >
                      <Badge
                        bg="facebook.paleBlue"
                        color="facebook.text"
                        fontSize="9px"
                      >
                        {article.categoryLabel}
                      </Badge>
                      <Text>•</Text>
                      <Text>{new Date(article.date).toLocaleDateString()}</Text>
                      <Text>•</Text>
                      <Text>{article.readTime}</Text>
                    </HStack>
                    <Select
                      size="sm"
                      fontSize="9px"
                      h="24px"
                      w="70px"
                      value={article.visibility || "public"}
                      onChange={(e) =>
                        handleVisibilityChange(article.id, e.target.value)
                      }
                      borderRadius="2px"
                      borderColor={
                        article.visibility === "draft"
                          ? "orange.300"
                          : article.visibility === "private"
                            ? "red.300"
                            : "green.300"
                      }
                      _hover={{ cursor: "pointer" }}
                    >
                      <option value="public">Public</option>
                      <option value="draft">Draft</option>
                      <option value="private">Private</option>
                    </Select>
                  </VStack>
                  <Box
                    alignSelf={{ base: "flex-end", md: "flex-start" }}
                    w={{ base: "full", md: "auto" }}
                  >
                    <HStack
                      spacing={1}
                      justify={{ base: "flex-end", md: "flex-start" }}
                    >
                      {/* Share Popover with Portal to prevent clipping in Admin Modals */}
                      <Popover isLazy placement="bottom-end">
                        <PopoverTrigger>
                          <IconButton
                            icon={<Share2 size={12} />}
                            size="sm"
                            variant="facebookGray"
                            aria-label="Share"
                            h="32px"
                            minW="32px"
                            title="Share article"
                          />
                        </PopoverTrigger>
                        <Portal>
                          <PopoverContent
                            border="1px solid"
                            borderColor="facebook.border"
                            borderRadius="2px"
                            boxShadow="0 2px 8px rgba(0,0,0,0.15)"
                            minW="140px"
                            w="140px"
                            _focus={{ boxShadow: "none" }}
                            zIndex={2000}
                          >
                            <PopoverBody p={1}>
                              <VStack spacing={0.5} align="stretch">
                                <FacebookShareButton
                                  url={`${window.location.origin}/article/${article.slug}`}
                                  quote={article.title}
                                >
                                  <HStack
                                    spacing={1}
                                    p={1}
                                    _hover={{ bg: "facebook.paleBlue" }}
                                    cursor="pointer"
                                  >
                                    <FacebookIcon size={20} round />
                                    <Text fontSize="12px">Facebook</Text>
                                  </HStack>
                                </FacebookShareButton>
                                <TwitterShareButton
                                  url={`${window.location.origin}/article/${article.slug}`}
                                  title={article.title}
                                >
                                  <HStack
                                    spacing={1}
                                    p={1}
                                    _hover={{ bg: "facebook.paleBlue" }}
                                    cursor="pointer"
                                  >
                                    <TwitterIcon size={20} round />
                                    <Text fontSize="12px">Twitter</Text>
                                  </HStack>
                                </TwitterShareButton>
                                <LinkedinShareButton
                                  url={`${window.location.origin}/article/${article.slug}`}
                                  title={article.title}
                                  summary={article.excerpt}
                                >
                                  <HStack
                                    spacing={1}
                                    p={1}
                                    _hover={{ bg: "facebook.paleBlue" }}
                                    cursor="pointer"
                                  >
                                    <LinkedinIcon size={20} round />
                                    <Text fontSize="12px">LinkedIn</Text>
                                  </HStack>
                                </LinkedinShareButton>
                                <WhatsappShareButton
                                  url={`${window.location.origin}/article/${article.slug}`}
                                  title={article.title}
                                >
                                  <HStack
                                    spacing={1}
                                    p={1}
                                    _hover={{ bg: "facebook.paleBlue" }}
                                    cursor="pointer"
                                  >
                                    <WhatsappIcon size={20} round />
                                    <Text fontSize="12px">WhatsApp</Text>
                                  </HStack>
                                </WhatsappShareButton>
                              </VStack>
                            </PopoverBody>
                          </PopoverContent>
                        </Portal>
                      </Popover>

                      <IconButton
                        icon={<ExternalLinkIcon boxSize={3} />}
                        size="sm"
                        variant="facebookGray"
                        onClick={() => handleVisit(article.slug)}
                        aria-label="Visit"
                        h="32px"
                        minW="32px"
                        title="Visit article page"
                      />
                      <IconButton
                        icon={<EditIcon boxSize={3} />}
                        size="sm"
                        variant="facebookGray"
                        onClick={() => onEdit(article)}
                        aria-label="Edit"
                        h="32px"
                        minW="32px"
                      />
                      <IconButton
                        icon={<DeleteIcon boxSize={3} />}
                        size="sm"
                        bg="#ffebee"
                        color="#d32f2f"
                        onClick={() => openDeleteDialog(article.id)}
                        aria-label="Delete"
                        h="32px"
                        minW="32px"
                        _hover={{ bg: "#ffcdd2" }}
                      />
                    </HStack>
                  </Box>
                </Stack>
              </Box>
            ))}
          </VStack>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="2px">
            <AlertDialogHeader fontSize="14px" fontWeight="bold">
              Delete Article
            </AlertDialogHeader>

            <AlertDialogBody fontSize="13px">
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="facebookGray"
                fontSize="13px"
              >
                Cancel
              </Button>
              <Button
                variant="facebook"
                bg="#d32f2f"
                _hover={{ bg: "#b71c1c" }}
                onClick={handleDelete}
                ml={3}
                fontSize="13px"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ArticleList;
