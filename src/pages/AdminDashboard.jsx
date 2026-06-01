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
    title: "Portfolio Overview",
    description: "A compact view of content health, recent edits, and useful shortcuts.",
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
    title: "Projects",
    description: "Manage project records, links, highlights, images, and PDFs.",
  },
  {
    key: "articles",
    label: "Articles",
    code: "ART",
    icon: FileText,
    title: "Articles",
    description: "Draft, publish, preview, and share public writing.",
  },
  {
    key: "experience",
    label: "Experience",
    code: "EXP",
    icon: Briefcase,
    title: "Experience",
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
    title: "Achievements",
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
    title: "Portfolio Data",
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

const toneColor = (colors, tone) =>
  ({
    blue: colors.text,
    green: colors.green,
    amber: colors.amber,
    red: colors.red,
    gray: colors.muted,
  })[tone] || colors.text;

const AdminMetric = ({ label, value, hint, tone = "blue" }) => {
  const colors = useRetroColors();

  return (
    <Box
      border="1px solid"
      borderColor={colors.border}
      bg={colors.panelBg}
      borderRadius="20px"
      px={{ base: 3, md: 4 }}
      py={3}
      minH="106px"
    >
      <HStack justify="space-between" align="start" spacing={3}>
        <Text
          fontSize="11px"
          color={colors.muted}
          fontWeight="700"
          letterSpacing=".08em"
          textTransform="uppercase"
        >
          {label}
        </Text>
        <Box w="8px" h="8px" borderRadius="999px" bg={toneColor(colors, tone)} mt={1} />
      </HStack>
      <Text mt={3} fontSize={{ base: "28px", md: "34px" }} fontWeight="800" lineHeight="1">
        {value}
      </Text>
      {hint && (
        <Text mt={2} fontSize="13px" color={colors.muted} noOfLines={1}>
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
      variant="ghost"
      h="auto"
      w="100%"
      px={3}
      py={3}
      border="1px solid"
      borderColor={isActive ? colors.text : colors.borderSoft}
      borderRadius="18px"
      bg={isActive ? colors.text : "transparent"}
      color={isActive ? colors.pageBg : colors.text}
      _hover={{
        bg: isActive ? colors.text : colors.panelAlt,
        borderColor: colors.text,
      }}
      leftIcon={<Icon size={15} />}
      title={module.description}
    >
      <HStack w="100%" justify="space-between" spacing={2}>
        <Text noOfLines={1}>{module.label}</Text>
        <Text fontSize="11px" opacity={0.62}>
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
      py={3}
      _last={{ borderBottom: "0" }}
    >
      <HStack spacing={2} minW={0}>
        <Icon size={14} color={colors.muted} />
        <Text fontSize="14px" color={colors.text} noOfLines={1}>
          {label}
        </Text>
      </HStack>
      <RetroBadge tone={tone}>{value}</RetroBadge>
    </HStack>
  );
};

const AdminCard = ({ title, icon: Icon, badge, children, actions }) => {
  const colors = useRetroColors();

  return (
    <Box
      border="1px solid"
      borderColor={colors.border}
      bg={colors.panelBg}
      borderRadius="20px"
      overflow="hidden"
    >
      <HStack
        justify="space-between"
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor={colors.borderSoft}
      >
        <HStack spacing={2} minW={0}>
          {Icon && <Icon size={15} color={colors.muted} />}
          <Text fontSize="15px" fontWeight="700" noOfLines={1}>
            {title}
          </Text>
        </HStack>
        <HStack spacing={2} flexShrink={0}>
          {badge}
          {actions}
        </HStack>
      </HStack>
      <Box p={4}>{children}</Box>
    </Box>
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
        spacing={4}
        mb={5}
      >
        <HStack spacing={3} align="start">
          <Box
            border="1px solid"
            borderColor={colors.border}
            bg={colors.panelAlt}
            borderRadius="999px"
            p={2}
            lineHeight="0"
          >
            <Icon size={18} color={colors.text} />
          </Box>
          <Box>
            <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="800" lineHeight="1.15">
              {module.title}
            </Text>
            <Text mt={1} fontSize="14px" color={colors.muted} lineHeight="1.6">
              {module.description}
            </Text>
          </Box>
        </HStack>
        {actions && (
          <HStack spacing={2} flexWrap="wrap" justify={{ base: "flex-start", md: "flex-end" }}>
            {actions}
          </HStack>
        )}
      </Stack>
      {children}
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
    <VStack align="stretch" spacing={4}>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
        <AdminCard
          title="Site Health"
          icon={SearchCheck}
          badge={
            <RetroBadge tone={warnings.length ? "amber" : "green"}>
              {warnings.length ? "Review" : "Ready"}
            </RetroBadge>
          }
        >
          <VStack align="stretch" spacing={0}>
            {(warnings.length
              ? warnings
              : ["All critical profile and content checks passed."]
            ).map((warning) => (
              <HStack
                key={warning}
                py={2.5}
                borderBottom="1px solid"
                borderColor={colors.borderSoft}
                _last={{ borderBottom: "0" }}
                align="start"
              >
                {warnings.length ? (
                  <AlertTriangle size={15} color={colors.amber} />
                ) : (
                  <CheckCircle2 size={15} color={colors.green} />
                )}
                <Text fontSize="14px" color={colors.text} lineHeight="1.6">
                  {warning}
                </Text>
              </HStack>
            ))}
          </VStack>
        </AdminCard>

        <AdminCard title="Quick Actions" icon={Plus} badge={<RetroBadge>Admin</RetroBadge>}>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
            <Button leftIcon={<Plus size={14} />} variant="studio" onClick={handleCreateArticle}>
              New Article
            </Button>
            <Button leftIcon={<Plus size={14} />} variant="studioGhost" onClick={handleCreateProject}>
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
                    leftIcon={<Icon size={14} />}
                    variant="studioGhost"
                    onClick={() => setActiveModule(module.key)}
                  >
                    {module.label}
                  </Button>
                );
              })}
          </SimpleGrid>
        </AdminCard>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
        <AdminCard title="Recent Articles" icon={FileText}>
          <VStack align="stretch" spacing={0}>
            {(recentArticles.length
              ? recentArticles
              : [{ id: "empty", title: "No articles yet" }]
            ).map((article) => (
              <HStack
                key={article.id}
                justify="space-between"
                py={3}
                borderBottom="1px solid"
                borderColor={colors.borderSoft}
                _last={{ borderBottom: "0" }}
              >
                <Box minW={0}>
                  <Text fontSize="15px" fontWeight="700" noOfLines={1}>
                    {article.title}
                  </Text>
                  <Text fontSize="13px" color={colors.muted}>
                    {formatDate(article.date)}
                  </Text>
                </Box>
                {article.visibility && (
                  <RetroBadge tone={article.visibility === "public" ? "green" : "amber"}>
                    {article.visibility}
                  </RetroBadge>
                )}
              </HStack>
            ))}
          </VStack>
        </AdminCard>

        <AdminCard title="Recent Projects" icon={FolderOpen}>
          <VStack align="stretch" spacing={0}>
            {(recentProjects.length
              ? recentProjects
              : [{ id: "empty", title: "No projects yet" }]
            ).map((project) => (
              <HStack
                key={project.id}
                justify="space-between"
                py={3}
                borderBottom="1px solid"
                borderColor={colors.borderSoft}
                _last={{ borderBottom: "0" }}
              >
                <Box minW={0}>
                  <Text fontSize="15px" fontWeight="700" noOfLines={1}>
                    {project.title}
                  </Text>
                  <Text fontSize="13px" color={colors.muted} noOfLines={1}>
                    {project.role || project.period || "Showcase item"}
                  </Text>
                </Box>
                {project.gallery?.length > 0 && (
                  <RetroBadge tone="amber">{project.gallery.length} media</RetroBadge>
                )}
              </HStack>
            ))}
          </VStack>
        </AdminCard>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
        <AdminMetric label="Public" value={stats.publicArticles} hint="visible articles" tone="green" />
        <AdminMetric label="Drafts" value={stats.draftArticles} hint="article queue" tone="amber" />
        <AdminMetric label="Private" value={stats.privateArticles} hint="hidden articles" tone="gray" />
        <AdminMetric label="Featured" value={stats.featuredArticles} hint="highlighted posts" tone="blue" />
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
    "Portfolio studio loaded.",
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
  const navBg =
    colorMode === "light" ? "rgba(250,250,248,.88)" : "rgba(30,30,30,.88)";
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
    setLogLines((prev) => [`${stamp} - ${message}`, ...prev].slice(0, 8));
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
      derived.push(
        `${publicArticlesWithoutImage} public article(s) need images.`,
      );
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

  const openModule = (key) => {
    const module = MODULES.find((item) => item.key === key);
    setActiveModule(key);
    if (module) addLog(`Opened ${module.label}.`);
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
            setActiveModule={openModule}
            handleCreateArticle={handleCreateArticle}
            handleCreateProject={handleCreateProject}
          />
        );
      case "profile":
        return (
          <PersonalInfoEditor
            onDataChange={() => handleManagerChange("Profile")}
          />
        );
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
        return (
          <ExperienceManager
            onDataChange={() => handleManagerChange("Experience")}
          />
        );
      case "education":
        return (
          <EducationManager
            onDataChange={() => handleManagerChange("Education")}
          />
        );
      case "achievements":
        return (
          <AchievementManager
            onDataChange={() => handleManagerChange("Achievements")}
          />
        );
      case "activities":
        return (
          <ActivityManager
            onDataChange={() => handleManagerChange("Activities")}
          />
        );
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
        <Button leftIcon={<Plus size={14} />} size="sm" variant="studio" onClick={handleCreateArticle}>
          Article
        </Button>
        <Button leftIcon={<Plus size={14} />} size="sm" variant="studioGhost" onClick={handleCreateProject}>
          Project
        </Button>
      </>
    ),
    articles: (
      <Button leftIcon={<Plus size={14} />} size="sm" variant="studio" onClick={handleCreateArticle}>
        New Article
      </Button>
    ),
    projects: (
      <Button leftIcon={<Plus size={14} />} size="sm" variant="studio" onClick={handleCreateProject}>
        New Project
      </Button>
    ),
  };

  return (
    <Box minH="100vh" bg={colors.pageBg} color={colors.text} pb={8} overflowX="hidden">
      <Box maxW="1440px" w="100%" mx="auto" px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
        <Flex
          as="header"
          position="sticky"
          top={{ base: 3, md: 4 }}
          zIndex={20}
          justify="space-between"
          align={{ base: "stretch", lg: "center" }}
          direction={{ base: "column", lg: "row" }}
          gap={3}
          bg={navBg}
          border="1px solid"
          borderColor={colors.border}
          borderRadius={{ base: "24px", lg: "999px" }}
          px={{ base: 4, md: 5 }}
          py={3}
          backdropFilter="blur(20px)"
          boxShadow={colors.shadow}
        >
          <HStack spacing={3} minW={0}>
            <Box
              w="36px"
              h="36px"
              borderRadius="999px"
              bg={colors.text}
              color={colors.pageBg}
              display="grid"
              placeItems="center"
              flexShrink={0}
            >
              <ShieldCheck size={17} />
            </Box>
            <Box minW={0}>
              <Text fontSize="15px" fontWeight="800" lineHeight="1">
                aurio.work admin
              </Text>
              <Text mt={1} fontSize="12px" color={colors.muted} noOfLines={1}>
                Private portfolio studio
              </Text>
            </Box>
          </HStack>

          <Wrap spacing={2} justify={{ base: "flex-start", lg: "flex-end" }}>
            <WrapItem>
              <Button leftIcon={<Plus size={14} />} size="sm" variant="studio" onClick={handleCreateArticle}>
                Article
              </Button>
            </WrapItem>
            <WrapItem>
              <Button leftIcon={<Plus size={14} />} size="sm" variant="studioGhost" onClick={handleCreateProject}>
                Project
              </Button>
            </WrapItem>
            <WrapItem>
              <IconButton
                icon={<RefreshCw size={14} />}
                onClick={refreshDashboard}
                aria-label="Refresh admin data"
                variant="studioGhost"
                size="sm"
                isLoading={refreshing}
                title="Refresh Firebase and article data"
              />
            </WrapItem>
            <WrapItem>
              <IconButton
                icon={colorMode === "light" ? <Moon size={14} /> : <Sun size={14} />}
                onClick={toggleColorMode}
                aria-label="Toggle color mode"
                variant="studioGhost"
                size="sm"
                title={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
              />
            </WrapItem>
            <WrapItem>
              <Button leftIcon={<Eye size={14} />} size="sm" variant="studioGhost" onClick={() => navigate("/")}>
                Portfolio
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                leftIcon={<LogOut size={14} />}
                size="sm"
                variant="studioGhost"
                color={colors.red}
                borderColor={colors.red}
                onClick={handleLogout}
                _hover={{ bg: colors.red, color: colors.pageBg }}
              >
                Logout
              </Button>
            </WrapItem>
          </Wrap>
        </Flex>

        <Grid
          templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) 380px" }}
          gap={{ base: 6, lg: 8 }}
          alignItems="end"
          py={{ base: 10, md: 14 }}
          minW={0}
        >
          <Box>
            <HStack spacing={3} flexWrap="wrap" mb={5}>
              <RetroBadge>Private studio</RetroBadge>
              <Text fontSize="14px" color={colors.muted}>
                Firebase-authenticated workspace
              </Text>
            </HStack>
            <Text
              as="h1"
              fontSize={{ base: "42px", md: "56px" }}
              lineHeight=".98"
              fontWeight="800"
              letterSpacing="-0.02em"
              maxW={{ base: "calc(100vw - 32px)", md: "760px" }}
              overflowWrap="break-word"
            >
              Portfolio admin, rebuilt in the public studio language.
            </Text>
            <Text mt={5} fontSize={{ base: "15px", md: "17px" }} lineHeight="1.75" color={colors.muted} maxW="680px">
              Keep every portfolio surface up to date without losing context:
              content health, recent publishing, media coverage, profile data,
              and raw JSON stay close at hand.
            </Text>
          </Box>

          <SimpleGrid columns={2} spacing={3}>
            <AdminMetric label="Source" value={useFirebase ? "Live" : "Local"} hint="portfolio data" tone={useFirebase ? "green" : "amber"} />
            <AdminMetric label="Warnings" value={warnings.length} hint="health checks" tone={warnings.length ? "amber" : "green"} />
          </SimpleGrid>
        </Grid>

        <Box display={{ base: "block", xl: "none" }} mb={5} overflowX="auto" pb={2}>
          <HStack spacing={2} minW="max-content">
            {MODULES.map((module) => (
              <Button
                key={module.key}
                size="sm"
                variant={activeModule === module.key ? "studio" : "studioGhost"}
                onClick={() => openModule(module.key)}
              >
                {module.label}
              </Button>
            ))}
          </HStack>
        </Box>

        <Grid
          templateColumns={{ base: "1fr", xl: "250px minmax(0, 1fr) 300px" }}
          gap={5}
          alignItems="start"
          minW={0}
        >
          <Box display={{ base: "none", xl: "block" }} position="sticky" top="112px">
            <RetroPanel title="Sections" icon={LayoutDashboard} bodyProps={{ p: 3 }}>
              <VStack align="stretch" spacing={2}>
                {MODULES.map((module) => (
                  <ModuleNavButton
                    key={module.key}
                    module={module}
                    isActive={activeModule === module.key}
                    onClick={() => openModule(module.key)}
                  />
                ))}
              </VStack>
            </RetroPanel>
          </Box>

          <Box minW={0}>
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3} mb={5}>
              <AdminMetric label="Projects" value={stats.projects} hint="showcase records" />
              <AdminMetric label="Articles" value={stats.articles} hint={`${stats.draftArticles} draft`} tone="green" />
              <AdminMetric label="Work" value={stats.experiences} hint="timeline entries" />
              <AdminMetric label="Credentials" value={stats.credentials} hint="education + certs" tone="amber" />
              <AdminMetric label="Awards" value={stats.achievements} hint="achievement records" />
              <AdminMetric label="Media" value={stats.media} hint={`${stats.pdfs} PDF`} tone="amber" />
            </SimpleGrid>

            <RetroPanel bodyProps={{ p: { base: 4, md: 5 } }}>
              <WorkbenchIntro
                module={activeConfig}
                actions={moduleActions[activeModule]}
              >
                {renderWorkbench()}
              </WorkbenchIntro>
            </RetroPanel>
          </Box>

          <VStack align="stretch" spacing={4} minW={0}>
            <RetroPanel title="Publishing Health" icon={RadioTower} bodyProps={{ px: 4 }}>
              <StatusLine
                icon={CheckCircle2}
                label="Portfolio data"
                value={loading ? "Loading" : useFirebase ? "Firebase" : "Local"}
                tone={useFirebase ? "green" : "amber"}
              />
              <StatusLine icon={FileText} label="Published articles" value={stats.publicArticles} tone="green" />
              <StatusLine icon={Clock3} label="Draft queue" value={stats.draftArticles} tone={stats.draftArticles ? "amber" : "gray"} />
              <StatusLine icon={FolderOpen} label="Gallery fallbacks" value={galleryStats.imageOnlyFallbacks} tone={galleryStats.imageOnlyFallbacks ? "amber" : "green"} />
              <StatusLine icon={AlertTriangle} label="Health warnings" value={warnings.length} tone={warnings.length ? "amber" : "green"} />
            </RetroPanel>

            <RetroPanel title="Analytics" icon={BarChart3} bodyProps={{ p: 4 }}>
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <Text fontSize="14px" color={colors.text}>
                    Vercel Web Analytics
                  </Text>
                  <RetroBadge tone="green">Enabled</RetroBadge>
                </HStack>
                <Text fontSize="13px" lineHeight="1.65" color={colors.muted}>
                  Tracking is mounted globally. Real traffic reports stay inside
                  Vercel so no private token is exposed in this client.
                </Text>
                <Button
                  as={ChakraLink}
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  leftIcon={<ExternalLink size={14} />}
                  variant="studioGhost"
                  size="sm"
                  _hover={{ textDecoration: "none" }}
                >
                  Open Vercel
                </Button>
              </VStack>
            </RetroPanel>

            <RetroPanel title="Activity Log" icon={Terminal} bodyProps={{ p: 4 }}>
              <VStack align="stretch" spacing={0}>
                {logLines.map((line) => (
                  <Text
                    key={line}
                    fontSize="13px"
                    color={colors.muted}
                    py={2}
                    borderBottom="1px solid"
                    borderColor={colors.borderSoft}
                    _last={{ borderBottom: "0" }}
                  >
                    {line}
                  </Text>
                ))}
              </VStack>
            </RetroPanel>
          </VStack>
        </Grid>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay bg={colors.overlay} backdropFilter="blur(10px)" />
        <ModalContent maxH="90vh" overflowY="auto" mx={4}>
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

      <Modal isOpen={isViewOpen} onClose={onViewClose} size="4xl" isCentered>
        <ModalOverlay bg={colors.overlay} backdropFilter="blur(10px)" />
        <ModalContent maxH="90vh" overflowY="auto" mx={4}>
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
                    borderRadius="18px"
                    overflow="hidden"
                  >
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      style={{
                        width: "100%",
                        display: "block",
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
