import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  Eye,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Moon,
  Plus,
  RadioTower,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  Sun,
  Terminal,
  User,
} from "lucide-react";
import { logoutAdmin } from "../services/authService";
import { getAllArticles } from "../services/articleService";
import ArticleEditor from "../components/admin/ArticleEditor";
import ArticleList from "../components/admin/ArticleList";
import PersonalInfoEditor from "../components/admin/PersonalInfoEditor";
import ExperienceManager from "../components/admin/ExperienceManager";
import ProjectManager from "../components/admin/ProjectManager";
import EducationManager from "../components/admin/EducationManager";
import AchievementManager from "../components/admin/AchievementManager";
import ActivityManager from "../components/admin/ActivityManager";
import PortfolioDataManager from "../components/admin/PortfolioDataManager";
import { usePortfolio } from "../contexts/PortfolioContext";
import { RetroBadge, RetroPanel, useRetroColors } from "../components/ui/retro";

const MODULES = [
  {
    key: "overview",
    label: "Overview",
    code: "OVR",
    icon: LayoutDashboard,
    title: "Operations Overview",
    description: "Live portfolio inventory, publishing health, and shortcuts.",
  },
  {
    key: "profile",
    label: "Profile / SEO",
    code: "ID",
    icon: User,
    title: "Profile and SEO",
    description: "Identity, contact links, public bio, and search metadata.",
  },
  {
    key: "projects",
    label: "Projects",
    code: "PRJ",
    icon: FolderOpen,
    title: "Project Showcase Control",
    description: "Manage project records, links, highlights, images, and PDFs.",
  },
  {
    key: "articles",
    label: "Articles",
    code: "ART",
    icon: FileText,
    title: "Publishing Desk",
    description: "Draft, publish, preview, and share public writing.",
  },
  {
    key: "experience",
    label: "Experience",
    code: "EXP",
    icon: Briefcase,
    title: "Experience Timeline",
    description: "Maintain public work history and timeline entries.",
  },
  {
    key: "education",
    label: "Education",
    code: "EDU",
    icon: GraduationCap,
    title: "Education and Certifications",
    description: "Control formal education, courses, and credentials.",
  },
  {
    key: "achievements",
    label: "Achievements",
    code: "AWD",
    icon: Award,
    title: "Achievements Cabinet",
    description: "Manage awards, certificates, images, and issuers.",
  },
  {
    key: "activities",
    label: "Activities",
    code: "ACT",
    icon: Activity,
    title: "Activities and Organizations",
    description: "Curate organizations, roles, activities, and periods.",
  },
  {
    key: "data",
    label: "Data Console",
    code: "JSON",
    icon: Database,
    title: "Firebase Data Console",
    description: "Inspect, initialize, and repair portfolio JSON data.",
  },
];

const REQUIRED_PROFILE_FIELDS = [
  ["name", "Name"],
  ["title", "Title"],
  ["email", "Email"],
  ["bio", "Bio"],
  ["location", "Location"],
  ["seoTitle", "SEO title"],
  ["seoDescription", "SEO description"],
];

const formatDate = (value) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const countBy = (items, predicate) =>
  items.reduce((total, item) => (predicate(item) ? total + 1 : total), 0);

const AdminMetric = ({ label, value, hint, tone = "blue" }) => {
  const colors = useRetroColors();

  return (
    <Box
      border="1px solid"
      borderColor={colors.border}
      bg={colors.panelBg}
      px={3}
      py={2}
      boxShadow={colors.shadow}
      minH="76px"
    >
      <HStack justify="space-between" align="start" spacing={2}>
        <Box minW={0}>
          <Text
            fontSize="13px"
            color={colors.muted}
            fontWeight="bold"
            textTransform="uppercase"
          >
            {label}
          </Text>
          <Text fontSize="25px" fontWeight="bold" color={colors.text}>
            {value}
          </Text>
        </Box>
        <RetroBadge tone={tone}>Live</RetroBadge>
      </HStack>
      {hint && (
        <Text fontSize="14px" color={colors.muted} noOfLines={1}>
          {hint}
        </Text>
      )}
    </Box>
  );
};

const ModuleNavButton = ({ module, isActive, onClick }) => {
  const colors = useRetroColors();
  const Icon = module.icon;

  return (
    <Button
      onClick={onClick}
      justifyContent="flex-start"
      variant={isActive ? "facebook" : "facebookGray"}
      h="34px"
      w="100%"
      px={2}
      fontSize="15px"
      leftIcon={<Icon size={14} />}
      borderColor={isActive ? colors.linkDark : colors.border}
      title={module.description}
    >
      <HStack w="100%" justify="space-between" spacing={2}>
        <Text noOfLines={1}>{module.label}</Text>
        <Text fontSize="12px" opacity={0.72}>
          {module.code}
        </Text>
      </HStack>
    </Button>
  );
};

const StatusLine = ({ icon: Icon, label, value, tone = "blue" }) => {
  const colors = useRetroColors();

  return (
    <HStack
      justify="space-between"
      spacing={3}
      borderBottom="1px solid"
      borderColor={colors.borderSoft}
      py={2}
      _last={{ borderBottom: "0" }}
    >
      <HStack spacing={2} minW={0}>
        <Icon size={13} color={colors.link} />
        <Text fontSize="15px" color={colors.text} noOfLines={1}>
          {label}
        </Text>
      </HStack>
      <RetroBadge tone={tone}>{value}</RetroBadge>
    </HStack>
  );
};

const WorkbenchIntro = ({ module, actions, children }) => {
  const colors = useRetroColors();
  const Icon = module.icon;

  return (
    <Box>
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "start" }}
        spacing={3}
        px={3}
        py={3}
        borderBottom="1px solid"
        borderColor={colors.border}
        bg={colors.panelAlt}
      >
        <HStack spacing={3} align="start">
          <Box
            border="1px solid"
            borderColor={colors.border}
            bg={colors.panelBg}
            p={2}
            lineHeight="0"
          >
            <Icon size={18} color={colors.link} />
          </Box>
          <Box>
            <Text fontSize="18px" fontWeight="bold" color={colors.text}>
              {module.title}
            </Text>
            <Text fontSize="15px" color={colors.muted}>
              {module.description}
            </Text>
          </Box>
        </HStack>
        {actions && (
          <HStack spacing={2} flexWrap="wrap" justify="flex-end">
            {actions}
          </HStack>
        )}
      </Stack>
      <Box px={{ base: 2, md: 3 }} py={3}>
        {children}
      </Box>
    </Box>
  );
};

const OverviewWorkbench = ({
  stats,
  warnings,
  articles,
  projects,
  modules,
  setActiveModule,
  handleCreateArticle,
  handleCreateProject,
}) => {
  const colors = useRetroColors();
  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 4);
  const recentProjects = [...projects].slice(-4).reverse();

  return (
    <VStack align="stretch" spacing={3}>
      <SimpleGrid columns={{ base: 2, xl: 4 }} spacing={2}>
        <AdminMetric label="Projects" value={stats.projects} hint="Showcase records" />
        <AdminMetric
          label="Articles"
          value={stats.articles}
          hint={`${stats.publicArticles} public / ${stats.draftArticles} draft`}
          tone="green"
        />
        <AdminMetric
          label="Media"
          value={stats.media}
          hint={`${stats.pdfs} PDF showcase files`}
          tone="amber"
        />
        <AdminMetric
          label="Warnings"
          value={warnings.length}
          hint="Profile and content checks"
          tone={warnings.length ? "amber" : "green"}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={3}>
        <Box border="1px solid" borderColor={colors.border} bg={colors.panelBg}>
          <HStack
            justify="space-between"
            px={3}
            py={2}
            borderBottom="1px solid"
            borderColor={colors.border}
            bg={colors.headerBg}
          >
            <HStack spacing={2}>
              <SearchCheck size={14} color={colors.link} />
              <Text fontSize="16px" fontWeight="bold">
                Site Health
              </Text>
            </HStack>
            <RetroBadge tone={warnings.length ? "amber" : "green"}>
              {warnings.length ? "Review" : "Ready"}
            </RetroBadge>
          </HStack>
          <VStack align="stretch" spacing={0}>
            {(warnings.length ? warnings : ["All critical profile and content checks passed."]).map(
              (warning) => (
                <HStack
                  key={warning}
                  px={3}
                  py={2}
                  borderBottom="1px solid"
                  borderColor={colors.borderSoft}
                  _last={{ borderBottom: "0" }}
                  align="start"
                >
                  {warnings.length ? (
                    <AlertTriangle size={13} color={colors.amber} />
                  ) : (
                    <CheckCircle2 size={13} color={colors.green} />
                  )}
                  <Text fontSize="15px" color={colors.text}>
                    {warning}
                  </Text>
                </HStack>
              ),
            )}
          </VStack>
        </Box>

        <Box border="1px solid" borderColor={colors.border} bg={colors.panelBg}>
          <HStack
            justify="space-between"
            px={3}
            py={2}
            borderBottom="1px solid"
            borderColor={colors.border}
            bg={colors.headerBg}
          >
            <HStack spacing={2}>
              <Terminal size={14} color={colors.link} />
              <Text fontSize="16px" fontWeight="bold">
                Quick Commands
              </Text>
            </HStack>
            <RetroBadge>CTRL</RetroBadge>
          </HStack>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2} p={3}>
            <Button
              leftIcon={<Plus size={13} />}
              size="sm"
              variant="facebook"
              onClick={handleCreateArticle}
            >
              New Article
            </Button>
            <Button
              leftIcon={<Plus size={13} />}
              size="sm"
              variant="facebookGray"
              onClick={handleCreateProject}
            >
              New Project
            </Button>
            {modules
              .filter((module) => !["overview", "articles", "projects"].includes(module.key))
              .slice(0, 4)
              .map((module) => {
                const Icon = module.icon;
                return (
                  <Button
                    key={module.key}
                    leftIcon={<Icon size={13} />}
                    size="sm"
                    variant="facebookGray"
                    onClick={() => setActiveModule(module.key)}
                  >
                    {module.label}
                  </Button>
                );
              })}
          </SimpleGrid>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={3}>
        <Box border="1px solid" borderColor={colors.border} bg={colors.panelBg}>
          <HStack
            px={3}
            py={2}
            borderBottom="1px solid"
            borderColor={colors.border}
            bg={colors.headerBg}
          >
            <FileText size={14} color={colors.link} />
            <Text fontSize="16px" fontWeight="bold">
              Recent Articles
            </Text>
          </HStack>
          <VStack align="stretch" spacing={0}>
            {(recentArticles.length ? recentArticles : [{ id: "empty", title: "No articles yet" }]).map(
              (article) => (
                <HStack
                  key={article.id}
                  justify="space-between"
                  px={3}
                  py={2}
                  borderBottom="1px solid"
                  borderColor={colors.borderSoft}
                  _last={{ borderBottom: "0" }}
                >
                  <Box minW={0}>
                    <Text fontSize="15px" fontWeight="bold" noOfLines={1}>
                      {article.title}
                    </Text>
                    <Text fontSize="14px" color={colors.muted}>
                      {formatDate(article.date)}
                    </Text>
                  </Box>
                  {article.visibility && (
                    <RetroBadge
                      tone={article.visibility === "public" ? "green" : "amber"}
                    >
                      {article.visibility}
                    </RetroBadge>
                  )}
                </HStack>
              ),
            )}
          </VStack>
        </Box>

        <Box border="1px solid" borderColor={colors.border} bg={colors.panelBg}>
          <HStack
            px={3}
            py={2}
            borderBottom="1px solid"
            borderColor={colors.border}
            bg={colors.headerBg}
          >
            <FolderOpen size={14} color={colors.link} />
            <Text fontSize="16px" fontWeight="bold">
              Recent Projects
            </Text>
          </HStack>
          <VStack align="stretch" spacing={0}>
            {(recentProjects.length ? recentProjects : [{ id: "empty", title: "No projects yet" }]).map(
              (project) => (
                <HStack
                  key={project.id}
                  justify="space-between"
                  px={3}
                  py={2}
                  borderBottom="1px solid"
                  borderColor={colors.borderSoft}
                  _last={{ borderBottom: "0" }}
                >
                  <Box minW={0}>
                    <Text fontSize="15px" fontWeight="bold" noOfLines={1}>
                      {project.title}
                    </Text>
                    <Text fontSize="14px" color={colors.muted} noOfLines={1}>
                      {project.role || project.period || "Showcase item"}
                    </Text>
                  </Box>
                  {project.gallery?.length > 0 && (
                    <RetroBadge tone="amber">{project.gallery.length} media</RetroBadge>
                  )}
                </HStack>
              ),
            )}
          </VStack>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

const AdminDashboard = () => {
  const [activeModule, setActiveModule] = useState("overview");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [projectCreateSignal, setProjectCreateSignal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [logLines, setLogLines] = useState([
    "Session ready. Firebase auth verified.",
    "Command center shell online.",
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { portfolioData, loading, useFirebase, refreshPortfolioData } =
    usePortfolio();
  const colors = useRetroColors();
  const bgColor = useColorModeValue("#cfd7e2", "#0f151d");
  const personalInfo = useMemo(
    () => portfolioData?.personalInfo || {},
    [portfolioData?.personalInfo],
  );
  const projects = useMemo(
    () => portfolioData?.projects || [],
    [portfolioData?.projects],
  );
  const experiences = portfolioData?.experiences || [];
  const education = portfolioData?.education || [];
  const certifications = portfolioData?.certifications || [];
  const achievements = portfolioData?.achievements || [];
  const activities = portfolioData?.activities || [];

  const addLog = useCallback((message) => {
    const stamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setLogLines((prev) => [`${stamp} ${message}`, ...prev].slice(0, 8));
  }, []);

  const loadArticles = useCallback(async () => {
    try {
      setArticlesLoading(true);
      const list = await getAllArticles();
      setArticles(list);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin article data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setArticlesLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const galleryStats = useMemo(() => {
    return projects.reduce(
      (totals, project) => {
        const gallery = Array.isArray(project.gallery) ? project.gallery : [];
        return {
          media: totals.media + gallery.length + (project.image ? 1 : 0),
          pdfs: totals.pdfs + countBy(gallery, (item) => item.type === "pdf"),
          imageOnlyFallbacks:
            totals.imageOnlyFallbacks +
            (project.image && gallery.length === 0 ? 1 : 0),
        };
      },
      { media: 0, pdfs: 0, imageOnlyFallbacks: 0 },
    );
  }, [projects]);

  const articleStats = useMemo(
    () => ({
      publicArticles: countBy(
        articles,
        (article) => (article.visibility || "public") === "public",
      ),
      draftArticles: countBy(
        articles,
        (article) => article.visibility === "draft",
      ),
      privateArticles: countBy(
        articles,
        (article) => article.visibility === "private",
      ),
      featuredArticles: countBy(articles, (article) => article.featured),
    }),
    [articles],
  );

  const stats = useMemo(
    () => ({
      projects: projects.length,
      articles: articles.length,
      experiences: experiences.length,
      credentials: education.length + certifications.length,
      achievements: achievements.length,
      activities: activities.length,
      media: galleryStats.media,
      pdfs: galleryStats.pdfs,
      ...articleStats,
    }),
    [
      achievements.length,
      activities.length,
      articleStats,
      articles.length,
      certifications.length,
      education.length,
      experiences.length,
      galleryStats.media,
      galleryStats.pdfs,
      projects.length,
    ],
  );

  const warnings = useMemo(() => {
    const missingProfile = REQUIRED_PROFILE_FIELDS.filter(
      ([field]) => !personalInfo[field],
    ).map(([, label]) => `Profile missing ${label}.`);
    const projectsWithoutMedia = countBy(
      projects,
      (project) => !project.image && !project.gallery?.length,
    );
    const projectsWithoutSlug = countBy(projects, (project) => !project.slug);
    const publicArticlesWithoutImage = countBy(
      articles,
      (article) =>
        (article.visibility || "public") === "public" && !article.image,
    );
    const derived = [];

    if (projectsWithoutMedia) {
      derived.push(`${projectsWithoutMedia} project(s) need showcase media.`);
    }
    if (projectsWithoutSlug) {
      derived.push(`${projectsWithoutSlug} project(s) need slugs.`);
    }
    if (publicArticlesWithoutImage) {
      derived.push(`${publicArticlesWithoutImage} public article(s) need images.`);
    }
    if (!personalInfo.website) {
      derived.push("Canonical website field is empty.");
    }

    return [...missingProfile, ...derived].slice(0, 8);
  }, [articles, personalInfo, projects]);

  const activeConfig =
    MODULES.find((module) => module.key === activeModule) || MODULES[0];

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const refreshDashboard = async () => {
    try {
      setRefreshing(true);
      await Promise.all([refreshPortfolioData(), loadArticles()]);
      setRefreshKey((prev) => prev + 1);
      addLog("Data refresh complete.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateArticle = () => {
    setActiveModule("articles");
    setSelectedArticle(null);
    addLog("Opening article editor.");
    onOpen();
  };

  const handleCreateProject = () => {
    setActiveModule("projects");
    setProjectCreateSignal((prev) => prev + 1);
    addLog("Opening project editor.");
  };

  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    addLog(`Editing article: ${article.title || article.id}.`);
    onOpen();
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    addLog(`Previewing article: ${article.title || article.id}.`);
    onViewOpen();
  };

  const handleArticleSuccess = () => {
    onClose();
    setRefreshKey((prev) => prev + 1);
    loadArticles();
    addLog("Article changes saved.");
  };

  const handleManagerChange = (label) => {
    refreshPortfolioData();
    addLog(`${label} updated.`);
  };

  const renderWorkbench = () => {
    switch (activeModule) {
      case "overview":
        return (
          <OverviewWorkbench
            stats={stats}
            warnings={warnings}
            articles={articles}
            projects={projects}
            modules={MODULES}
            setActiveModule={setActiveModule}
            handleCreateArticle={handleCreateArticle}
            handleCreateProject={handleCreateProject}
          />
        );
      case "profile":
        return <PersonalInfoEditor onDataChange={() => handleManagerChange("Profile")} />;
      case "projects":
        return (
          <ProjectManager
            openCreateSignal={projectCreateSignal}
            onDataChange={() => handleManagerChange("Projects")}
          />
        );
      case "articles":
        return (
          <ArticleList
            onEdit={handleEditArticle}
            onView={handleViewArticle}
            refresh={refreshKey}
            articlesData={articles}
            externalLoading={articlesLoading}
            onDataChange={() => {
              loadArticles();
              addLog("Article list refreshed.");
            }}
          />
        );
      case "experience":
        return <ExperienceManager onDataChange={() => handleManagerChange("Experience")} />;
      case "education":
        return <EducationManager onDataChange={() => handleManagerChange("Education")} />;
      case "achievements":
        return (
          <AchievementManager
            onDataChange={() => handleManagerChange("Achievements")}
          />
        );
      case "activities":
        return <ActivityManager onDataChange={() => handleManagerChange("Activities")} />;
      case "data":
        return (
          <PortfolioDataManager
            onDataChange={() => handleManagerChange("Portfolio JSON")}
          />
        );
      default:
        return null;
    }
  };

  const moduleActions = {
    overview: (
      <>
        <Button
          leftIcon={<Plus size={13} />}
          size="sm"
          variant="facebook"
          onClick={handleCreateArticle}
        >
          Article
        </Button>
        <Button
          leftIcon={<Plus size={13} />}
          size="sm"
          variant="facebookGray"
          onClick={handleCreateProject}
        >
          Project
        </Button>
      </>
    ),
    articles: (
      <Button
        leftIcon={<Plus size={13} />}
        size="sm"
        variant="facebook"
        onClick={handleCreateArticle}
      >
        New Article
      </Button>
    ),
    projects: (
      <Button
        leftIcon={<Plus size={13} />}
        size="sm"
        variant="facebook"
        onClick={handleCreateProject}
      >
        New Project
      </Button>
    ),
  };

  return (
    <Box minH="100vh" bg={bgColor} py={{ base: 2, md: 3 }}>
      <Box maxW="1480px" mx="auto" px={{ base: 2, md: 4 }}>
        <Flex
          position="sticky"
          top="0"
          zIndex={20}
          justify="space-between"
          align={{ base: "stretch", lg: "center" }}
          direction={{ base: "column", lg: "row" }}
          gap={3}
          mb={3}
          bg={colors.panelBg}
          border="1px solid"
          borderColor={colors.border}
          px={3}
          py={3}
          boxShadow={colors.shadow}
        >
          <HStack spacing={2} align="start">
            <ShieldCheck size={18} color={colors.link} />
            <Box minW={0}>
              <Text fontSize="18px" fontWeight="bold" color={colors.link}>
                Site Control Center
              </Text>
              <Text fontSize="14px" color={colors.muted}>
                Firebase-authenticated portfolio command deck
              </Text>
            </Box>
          </HStack>
          <Wrap spacing={2} justify={{ base: "flex-start", lg: "flex-end" }}>
            <WrapItem>
              <Button
                leftIcon={<Plus size={13} />}
                size="sm"
                variant="facebook"
                onClick={handleCreateArticle}
              >
                Article
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                leftIcon={<Plus size={13} />}
                size="sm"
                variant="facebookGray"
                onClick={handleCreateProject}
              >
                Project
              </Button>
            </WrapItem>
            <WrapItem>
              <IconButton
                icon={<RefreshCw size={14} />}
                onClick={refreshDashboard}
                aria-label="Refresh admin data"
                variant="facebookGray"
                size="sm"
                h="32px"
                isLoading={refreshing}
                title="Refresh Firebase and article data"
              />
            </WrapItem>
            <WrapItem>
              <IconButton
                icon={
                  colorMode === "light" ? <Moon size={14} /> : <Sun size={14} />
                }
                onClick={toggleColorMode}
                aria-label="Toggle color mode"
                variant="facebookGray"
                size="sm"
                h="32px"
                title={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
              />
            </WrapItem>
            <WrapItem>
              <Button
                leftIcon={<Eye size={13} />}
                size="sm"
                variant="facebookGray"
                onClick={() => navigate("/")}
              >
                Portfolio
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                leftIcon={<LogOut size={13} />}
                size="sm"
                bg={colors.red}
                color="white"
                border="1px solid"
                borderColor={colors.red}
                onClick={handleLogout}
                _hover={{ opacity: 0.88 }}
              >
                Logout
              </Button>
            </WrapItem>
          </Wrap>
        </Flex>

        <Box display={{ base: "block", lg: "none" }} mb={3}>
          <Wrap spacing={2}>
            {MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <WrapItem key={module.key}>
                  <Button
                    size="sm"
                    variant={
                      activeModule === module.key ? "facebook" : "facebookGray"
                    }
                    leftIcon={<Icon size={13} />}
                    onClick={() => setActiveModule(module.key)}
                  >
                    {module.label}
                  </Button>
                </WrapItem>
              );
            })}
          </Wrap>
        </Box>

        <Grid
          templateColumns={{ base: "1fr", lg: "210px minmax(0, 1fr) 310px" }}
          gap={3}
          alignItems="start"
        >
          <Box display={{ base: "none", lg: "block" }} position="sticky" top="88px">
            <RetroPanel title="Modules" icon={LayoutDashboard} bodyProps={{ p: 2 }}>
              <VStack align="stretch" spacing={2}>
                {MODULES.map((module) => (
                  <ModuleNavButton
                    key={module.key}
                    module={module}
                    isActive={activeModule === module.key}
                    onClick={() => {
                      setActiveModule(module.key);
                      addLog(`Opened ${module.label}.`);
                    }}
                  />
                ))}
              </VStack>
            </RetroPanel>
          </Box>

          <Box minW={0}>
            <SimpleGrid columns={{ base: 2, md: 4, xl: 6 }} spacing={2} mb={3}>
              <AdminMetric label="Projects" value={stats.projects} hint="Showcase" />
              <AdminMetric
                label="Articles"
                value={stats.articles}
                hint={`${stats.draftArticles} draft`}
                tone="green"
              />
              <AdminMetric label="Work" value={stats.experiences} hint="Timeline" />
              <AdminMetric
                label="Credentials"
                value={stats.credentials}
                hint="Education + certs"
                tone="amber"
              />
              <AdminMetric
                label="Awards"
                value={stats.achievements}
                hint="Achievements"
              />
              <AdminMetric
                label="Media"
                value={stats.media}
                hint={`${stats.pdfs} PDF`}
                tone="amber"
              />
            </SimpleGrid>

            <RetroPanel title={activeConfig.title} icon={activeConfig.icon}>
              <WorkbenchIntro
                module={activeConfig}
                actions={moduleActions[activeModule]}
              >
                {renderWorkbench()}
              </WorkbenchIntro>
            </RetroPanel>
          </Box>

          <VStack align="stretch" spacing={3} minW={0}>
            <RetroPanel title="Live Status" icon={RadioTower} bodyProps={{ px: 3 }}>
              <StatusLine
                icon={CheckCircle2}
                label="Portfolio data"
                value={loading ? "Loading" : useFirebase ? "Firebase" : "Local"}
                tone={useFirebase ? "green" : "amber"}
              />
              <StatusLine
                icon={FileText}
                label="Published articles"
                value={stats.publicArticles}
                tone="green"
              />
              <StatusLine
                icon={Clock3}
                label="Draft queue"
                value={stats.draftArticles}
                tone={stats.draftArticles ? "amber" : "gray"}
              />
              <StatusLine
                icon={FolderOpen}
                label="Gallery fallbacks"
                value={galleryStats.imageOnlyFallbacks}
                tone={galleryStats.imageOnlyFallbacks ? "amber" : "green"}
              />
              <StatusLine
                icon={AlertTriangle}
                label="Health warnings"
                value={warnings.length}
                tone={warnings.length ? "amber" : "green"}
              />
            </RetroPanel>

            <RetroPanel title="Analytics" icon={BarChart3} bodyProps={{ p: 3 }}>
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text fontSize="15px" color={colors.text}>
                    Vercel Web Analytics
                  </Text>
                  <RetroBadge tone="green">Enabled</RetroBadge>
                </HStack>
                <Text fontSize="14px" color={colors.muted}>
                  Tracking is mounted globally. Real traffic reports stay inside
                  Vercel so no private token is exposed in this client.
                </Text>
                <Button
                  as={ChakraLink}
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  leftIcon={<ExternalLink size={13} />}
                  variant="facebookGray"
                  size="sm"
                  _hover={{ textDecoration: "none" }}
                >
                  Open Vercel
                </Button>
              </VStack>
            </RetroPanel>

            <RetroPanel title="Terminal Log" icon={Terminal} bodyProps={{ p: 0 }}>
              <Box
                bg={useColorModeValue("#10151b", "#090d12")}
                color="#d6f5d6"
                fontFamily="'Lucida Console', 'Courier New', monospace"
                fontSize="14px"
                minH="188px"
                px={3}
                py={2}
                overflow="hidden"
              >
                {logLines.map((line) => (
                  <Text key={line} fontFamily="inherit" color="inherit" mb={1}>
                    &gt; {line}
                  </Text>
                ))}
              </Box>
            </RetroPanel>
          </VStack>
        </Grid>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            {selectedArticle ? "Edit Article" : "Create New Article"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ArticleEditor
              article={selectedArticle}
              onSuccess={handleArticleSuccess}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isViewOpen} onClose={onViewClose} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>{selectedArticle?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedArticle && (
              <Box>
                {selectedArticle.image && (
                  <Box
                    mb={4}
                    border="1px solid"
                    borderColor={colors.border}
                    overflow="hidden"
                  >
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      style={{
                        width: "100%",
                        display: "block",
                        borderRadius: 0,
                      }}
                    />
                  </Box>
                )}
                <Box
                  dangerouslySetInnerHTML={{
                    __html: selectedArticle.description,
                  }}
                  sx={{
                    "& img": { maxW: "100%", h: "auto" },
                    "& p": { mb: 4 },
                    "& h1, & h2, & h3, & h4, & h5, & h6": { mb: 2, mt: 4 },
                  }}
                />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;
