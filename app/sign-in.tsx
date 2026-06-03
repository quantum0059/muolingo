import { type Href } from "expo-router";
import { useState } from "react";

import { AuthInputField } from "@/components/auth-input-field";
import { AuthScreenLayout } from "@/components/auth-screen-layout";

export default function SignInScreen() {
  const [email, setEmail] = useState("alex@gmail.com");

  return (
    <AuthScreenLayout
      title="Welcome back"
      subtitle="Continue your language journey ✨"
      primaryButtonLabel="Sign In"
      footerText="Don't have an account?"
      footerLinkLabel="Sign up"
      footerHref={"/sign-up" as Href}
    >
      <AuthInputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </AuthScreenLayout>
  );
}
