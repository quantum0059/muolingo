import { type Href } from "expo-router";
import { useState } from "react";

import { AuthInputField } from "@/components/auth-input-field";
import { AuthScreenLayout } from "@/components/auth-screen-layout";

export default function SignUpScreen() {
  const [email, setEmail] = useState("alex@gmail.com");
  const [password, setPassword] = useState("password123");

  return (
    <AuthScreenLayout
      title="Create your account"
      subtitle="Start your language journey today ✨"
      primaryButtonLabel="Sign Up"
      footerText="Already have an account?"
      footerLinkLabel="Log in"
      footerHref={"/sign-in" as Href}
    >
      <AuthInputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <AuthInputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
    </AuthScreenLayout>
  );
}
