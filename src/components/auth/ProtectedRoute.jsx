// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Box, Spinner, Center } from "@chakra-ui/react";

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdminUser, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh" bg="#e9ebee">
        <Spinner size="xl" color="facebook.blue" thickness="4px" />
      </Center>
    );
  }

  if (!currentUser || !isAdminUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
