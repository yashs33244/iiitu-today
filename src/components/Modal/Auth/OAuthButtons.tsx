import { Button, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);
  const hoverBg = useColorModeValue("gray.50", "#2A4365");
  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);

    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

  return (
    <Flex direction="column" width="100%" mb={4}>
      Only for IIIT UNA students
    </Flex>
  );
};
export default OAuthButtons;
