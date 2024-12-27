import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { authModelState } from "../../../atoms/authModalAtom";
import { auth } from "../../../firebase/clientApp";
import { sendEmailVerification } from "firebase/auth";
import AuthInputs from "./AuthInput";
import OAuthButtons from "./OAuthButtons";
import ResetPassword from "./ResetPassword";

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModelState);
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleSendVerificationEmail = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Automatically close the modal when the user's email is verified
    if (user && user.emailVerified) {
      handleClose();
    }
  }, [user]);

  const renderVerificationContent = () => {
    if (!user || user.emailVerified) return null;

    return (
      <VStack spacing={4} width="100%">
        <Text textAlign="center">
          A verification email has been sent to {user.email}. Please click the
          link in the email to verify your account.
        </Text>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          If you don’t see the email, check your spam folder.
        </Text>
        <Button
          width="100%"
          variant="outline"
          onClick={handleSendVerificationEmail}
          isLoading={isLoading}
        >
          Resend Verification Email
        </Button>
        <Button
          width="100%"
          onClick={() => auth.signOut()}
          variant="ghost"
          colorScheme="red"
        >
          Logout
        </Button>
      </VStack>
    );
  };

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {!user && modalState.view === "login" && "Login"}
            {!user && modalState.view === "signup" && "Sign Up"}
            {!user && modalState.view === "resetPassword" && "Reset Password"}
            {user && !user.emailVerified && "Verify Your Email"}
          </ModalHeader>
          {/* Only show close button if email is verified */}
          {(!user || user.emailVerified) && <ModalCloseButton />}
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={6}
          >
            {!user ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                width="70%"
              >
                {modalState.view === "login" || modalState.view === "signup" ? (
                  <>
                    <OAuthButtons />
                    <Text color="gray.500" fontWeight={700} my={4}>
                      OR
                    </Text>
                    <AuthInputs />
                  </>
                ) : (
                  <ResetPassword />
                )}
              </Flex>
            ) : (
              renderVerificationContent()
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
