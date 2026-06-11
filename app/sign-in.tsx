import { useAuth, useSignIn } from "@clerk/expo";
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
} from "@/lib/auth-errors";
import { finalizeAuthNavigation } from "@/lib/clerk";

export default function SignInScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signIn, errors, fetchStatus } = useSignIn();
  const { signInWithOAuth, socialError, clearSocialError, setSocialError } =
    useSocialAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMode, setVerificationMode] = useState<
    "email_code" | "client_trust"
  >("email_code");

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

  const clerkEmailError =
    getClerkFieldMessage(errors.fields.identifier) ??
    getClerkFieldMessage(errors.fields.password);
  const displayedEmailError = emailError ?? clerkEmailError;
  const displayedVerificationError =
    verificationError ?? getClerkFieldMessage(errors.fields.code);
  const globalError = getClerkGlobalMessage(errors.global);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(null);
    clearSocialError();
  };

  const finalizeSignIn = async () => {
    const { error } = await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          return;
        }

        setVerificationVisible(false);
        finalizeAuthNavigation(router, decorateUrl);
      },
    });

    if (error) {
      setVerificationError(error.message ?? "Could not complete sign in.");
    }
  };

  const handleSignIn = async () => {
    setEmailError(null);
    clearSocialError();

    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    const { error } = await signIn.create({ identifier: email.trim() });

    if (error) {
      setEmailError(error.message ?? "Sign in failed. Please try again.");
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
      return;
    }

    if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        const { error: sendError } = await signIn.mfa.sendEmailCode();

        if (sendError) {
          setVerificationError(
            sendError.message ?? "Could not send verification code.",
          );
          return;
        }

        setVerificationMode("client_trust");
        setVerificationError(null);
        setVerificationVisible(true);
        return;
      }
    }

    const { error: sendError } = await signIn.emailCode.sendCode();

    if (sendError) {
      setEmailError(
        sendError.message ?? "Could not send verification code.",
      );
      return;
    }

    setVerificationMode("email_code");
    setVerificationError(null);
    setVerificationVisible(true);
  };

  const handleVerify = async (code: string) => {
    setIsVerifying(true);
    setVerificationError(null);

    const { error } =
      verificationMode === "client_trust"
        ? await signIn.mfa.verifyEmailCode({ code })
        : await signIn.emailCode.verifyCode({ code });

    if (error) {
      setVerificationError(
        error.message ?? "Invalid code. Please try again.",
      );
      setIsVerifying(false);
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
    } else {
      setVerificationError("Sign in is not complete yet. Please try again.");
    }

    setIsVerifying(false);
  };

  const handleCloseVerification = () => {
    setVerificationVisible(false);
    setVerificationError(null);
  };

  return (
    <AuthScreenLayout
      title="Welcome back"
      subtitle="Continue your language journey ✨"
      primaryButtonLabel="Sign In"
      footerText="Don't have an account?"
      footerLinkLabel="Sign up"
      footerHref={"/sign-up" as Href}
      onPrimaryPress={handleSignIn}
      isLoading={isLoading}
      socialError={socialError ?? globalError}
      onGooglePress={() => signInWithOAuth("oauth_google")}
      onApplePress={() => signInWithOAuth("oauth_apple")}
      onFacebookPress={() =>
        setSocialError("Facebook sign-in is not enabled for this app.")
      }
      verificationModal={{
        visible: verificationVisible,
        onClose: handleCloseVerification,
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
    </AuthScreenLayout>
  );
}
