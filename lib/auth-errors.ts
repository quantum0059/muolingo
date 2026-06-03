const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();

  if (!trimmed) {
    return "Please enter your email address.";
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return "Please enter a valid email address.";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password.trim()) {
    return "Please enter your password.";
  }

  return null;
}

export function getClerkFieldMessage(
  field: { message?: string } | null | undefined,
): string | null {
  return field?.message ?? null;
}

export function getClerkGlobalMessage(
  global: { message?: string }[] | null | undefined,
): string | null {
  return global?.[0]?.message ?? null;
}
