import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { AuthInputField } from "@/components/auth-input-field";
import { AuthScreenLayout } from "@/components/auth-screen-layout";
import { useSocialAuth } from "@/hooks/use-social-auth";
import {
  getClerkFieldMessage,
  getClerkGlobalMessage,
  validateEmail,
  validatePassword,
} from "@/lib/auth-errors";
import { finalizeAuthNavigation } from "@/lib/clerk";
import { clearPendingSignup, markNewSignup } from "@/lib/posthog-identify";

export default function SignUpScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { signInWithOAuth, socialError, clearSocialError, setSocialError } =
    useSocialAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [isVerifying, setIsVerifying] = useState(false);

  const isLoading = fetchStatus === "fetching";

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6C47FF" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  const clerkEmailError = getClerkFieldMessage(errors.fields.emailAddress);
  const clerkPasswordError = getClerkFieldMessage(errors.fields.password);
  const displayedEmailError = emailError ?? clerkEmailError;
  const displayedPasswordError = passwordError ?? clerkPasswordError;
  const displayedVerificationError =
    verificationError ?? getClerkFieldMessage(errors.fields.code);
  const globalError = getClerkGlobalMessage(errors.global);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(null);
    clearSocialError();
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(null);
    clearSocialError();
  };

  const handleSignUp = async () => {
    setEmailError(null);
    setPasswordError(null);
    clearSocialError();

    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError) {
      setEmailError(emailValidationError);
    }

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
    }

    if (emailValidationError || passwordValidationError) {
      return;
    }

    const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      if (!errors.fields.emailAddress && !errors.fields.password) {
        setEmailError(error.message ?? "Sign up failed. Please try again.");
      }
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();

    if (sendError) {
      setEmailError(
        sendError.message ?? "Could not send verification code.",
      );
      return;
    }

    setVerificationError(null);
    setVerificationVisible(true);
  };

  const handleVerify = async (code: string) => {
    setIsVerifying(true);
    setVerificationError(null);

    const { error } = await signUp.verifications.verifyEmailCode({ code });

    if (error) {
      setVerificationError(
        error.message ?? "Invalid code. Please try again.",
      );
      setIsVerifying(false);
      return;
    }

    if (signUp.status === "complete") {
      markNewSignup();

      const { error: finalizeError } = await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }

          setVerificationVisible(false);
          finalizeAuthNavigation(router, decorateUrl);
        },
      });

      if (finalizeError) {
        clearPendingSignup();
        setVerificationError(
          finalizeError.message ?? "Could not complete sign up.",
        );
      }
    } else {
      setVerificationError("Sign up is not complete yet. Please try again.");
    }

    setIsVerifying(false);
  };

  const handleResendClose = () => {
    setVerificationVisible(false);
    setVerificationError(null);
  };

  return (
    <AuthScreenLayout
      title="Create your account"
      subtitle="Start your language journey today ✨"
      primaryButtonLabel="Sign Up"
      footerText="Already have an account?"
      footerLinkLabel="Log in"
      footerHref={"/sign-in" as Href}
      onPrimaryPress={handleSignUp}
      isLoading={isLoading}
      showCaptcha
      socialError={socialError ?? globalError}
      onGooglePress={() => signInWithOAuth("oauth_google")}
      onApplePress={() => signInWithOAuth("oauth_apple")}
      onFacebookPress={() =>
        setSocialError("Facebook sign-in is not enabled for this app.")
      }
      verificationModal={{
        visible: verificationVisible,
        onClose: handleResendClose,
        onVerify: handleVerify,
        isLoading: isVerifying,
        error: displayedVerificationError,
      }}
    >
      <AuthInputField
        label="Email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        error={displayedEmailError}
      />
      <AuthInputField
        label="Password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
        autoCapitalize="none"
        error={displayedPasswordError}
      />
    </AuthScreenLayout>
  );
}
