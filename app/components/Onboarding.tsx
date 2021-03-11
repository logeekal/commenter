import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  FormErrorMessage,
  Tooltip,
} from "@chakra-ui/react";
import API from "../service/service";
import { FC } from "react";
import { REQUEST_STATES } from "../utils/constants";
import { openAuthPopUp } from "../utils/";

export interface OnBoardingFormProps {
  mode: "signin" | "signup";
  onSuccess?: any;
}

export interface ErrorFormat {
  error: string;
  field: "email" | "name" | "password" | "confirm-password";
}

const OnBoardingForms: React.FC<OnBoardingFormProps> = ({
  mode,
  onSuccess,
}: OnBoardingFormProps) => {
  const [requestState, setRequestState] = React.useState(REQUEST_STATES.IDLE);
  const toast = useToast();

  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<ErrorFormat>();
  const [popupId, setPopupId] = React.useState<undefined | Window>();

  const handleSignup = async (e: any) => {
    e.preventDefault();
    let err = validate();
    console.log({ err });
    if (err) {
      console.log({ err });
      setError(err);
      return;
    }
    setRequestState(REQUEST_STATES.PENDING);
    console.log(e);
    const result = await API.signup(email, password, name);
    if (result.status === 200) {
      console.log(result.data);
      toast({
        title: "Account Succesfully Created.",
        description: "Please sign in to proceed",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setRequestState(REQUEST_STATES.SUCCESS);
    } else {
      toast({
        title: "Error",
        description: result.data,
        status: "error",
        isClosable: true,
      });
      setRequestState(REQUEST_STATES.ERROR);
    }
  };

  const handleSignin = async (e: any) => {
    try {
      e.preventDefault();
      const loggedInUserRequest = await API.login(email, password);
      if (loggedInUserRequest.status === 200) {
        toast({
          title: "logged In",
          status: "success",
          isClosable: true,
        });
        onSuccess(loggedInUserRequest.data);
      } else {
        console.log(loggedInUserRequest);
      }
    } catch (err) {
      setError({
        field: "password",
        error: "Invalid Credentials. Please try again",
      });
    }
  };

  const validate = () => {
    let err: ErrorFormat | undefined;
    if (password.length < 8) {
      err = {
        field: "password",
        error: "Password should be at least 8 character long.",
      };
    } else if (password !== confirmPassword) {
      err = {
        field: "confirm-password",
        error: "Password and Confirm password should match",
      };
    }
    return err;
  };

  useEffect(() => {
    if (popupId) {
      let popupInterval = setInterval(() => {
        try {
          let url = new URL(popupId.location.href);
          console.log({ url, search: url.searchParams.toString() });
          if (
            url.searchParams.get("result") &&
            popupId.location.origin === window.location.origin
          ) {
            let result = url.searchParams.get("result");
            console.log("got the url", result);
            popupId.close();
            if (result === "success") {
              window.location.reload();
            } else {
              setPopupId(undefined);
              setError({
                error:
                  "Some Error occured while Logging in. Please use some other method for logging in.",
                field: "email",
              });
            }
          }
        } catch (err) {
          return;
        }
      }, 200);

      return () => {
        try {
          popupId.onunload = function () {
            clearInterval(popupInterval);
            setPopupId(undefined);
          };
        } catch (err) {
          //err can be because of cross origin object
          console.log("In exception of unload");
          // clearInterval(popupInterval);
          // setPopupId(undefined);
        }
      };
    }
  }, [popupId]);

  const handleMessage = () => {};

  const handleOAuth = (platform: string) => {
    if (popupId) {
      popupId.close();
    }
    let authPopup = openAuthPopUp(platform, `auth/${platform}`);
    setPopupId(authPopup);
  };

  const handleComingSoon = (e) => {};

  return (
    <div>
      <form onSubmit={mode === "signin" ? handleSignin : handleSignup}>
        {mode === "signup" && (
          <React.Fragment>
            <FormControl id="name" isRequired>
              <FormLabel>Your Name</FormLabel>
              <Input
                type="name"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
            </FormControl>
          </React.Fragment>
        )}
        <FormControl id="email" isRequired>
          <FormLabel mt={mode === "signup" ? 5 : 0}>Email Address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl
          id="password"
          isRequired
          isInvalid={error && error.field === "password"}
        >
          <FormLabel mt={5}>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <FormErrorMessage>{error?.error}</FormErrorMessage>
        </FormControl>
        {mode === "signup" && (
          <React.Fragment>
            <FormControl
              id="confirm-password"
              isRequired
              isInvalid={error && error.field === "confirm-password"}
            >
              <FormLabel mt={5}>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e: any) => setConfirmPassword(e.target.value)}
              />
              <FormErrorMessage>{error?.error}</FormErrorMessage>
            </FormControl>
          </React.Fragment>
        )}
        <Button width="full" type="submit" mt={5}>
          {mode === "signin" ? "Sign in" : "Sign Up"}
        </Button>
      </form>
      <Box mt={10} with="full">
        <Tooltip hasArrow placement="left" >
          <Button
            width="full"
            bg="red.300"
            onClick={() => handleOAuth("google")}
          >
            Sign in with Google
          </Button>
        </Tooltip>
        <Tooltip hasArrow placement="left">
          <Button
            mt={4}
            width="full"
            bg="blue.500"
            color="white"
            onClick={() => handleOAuth("facebook")}
          >
            Sign in with Facebook
          </Button>
        </Tooltip>
        <Tooltip hasArrow placement="left">
          <Button
            mt={4}
            width="full"
            bg="grey"
            color="white"
            onClick={() => handleOAuth("github")}
          >
            Sign in with Github
          </Button>
        </Tooltip>
      </Box>
    </div>
  );
};

export interface OnBoardingProps {
  onSuccess: any;
}

const OnBoarding: FC<OnBoardingProps> = ({ onSuccess }: OnBoardingProps) => {
  return (
    <Tabs>
      <TabList>
        <Tab>Sign In</Tab>
        <Tab>Sign Up</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <OnBoardingForms mode="signin" onSuccess={onSuccess} />
        </TabPanel>
        <TabPanel>
          <OnBoardingForms mode="signup" onSuccess={onSuccess} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default OnBoarding;
