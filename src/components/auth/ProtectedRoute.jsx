// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Spinner, Center } from "@chakra-ui/react";
import { useStudioColors } from "../public/studio";

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdminUser, loading } = useAuth();
  const colors = useStudioColors();

  if (loading) {
    return (
      <Center h="100vh" bg={colors.bg}>
        <Spinner size="xl" color={colors.text} thickness="3px" />
      </Center>
    );
  }

  if (!currentUser || !isAdminUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
