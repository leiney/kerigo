export type PasswordValidationState = {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  match: boolean;
};

export const getPasswordValidation = (password: string, confirmPassword: string) => {
  const validation: PasswordValidationState = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    match: password.length > 0 && password === confirmPassword,
  };

  const passwordError = !password.length
    ? 'Password is required.'
    : !validation.length
      ? 'Password must be at least 8 characters long.'
      : !validation.uppercase
        ? 'Password must include at least one uppercase letter.'
        : !validation.number
          ? 'Password must include at least one number.'
          : '';

  const confirmPasswordError = !confirmPassword.length
    ? 'Please confirm your password.'
    : !validation.match
      ? 'Passwords do not match.'
      : '';

  return {
    validation,
    isValid: validation.length && validation.uppercase && validation.number && validation.match,
    passwordError,
    confirmPasswordError,
  };
};