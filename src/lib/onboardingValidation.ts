const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toText = (value: unknown) => String(value ?? '').trim();

export const requiredTextError = (value: unknown, label: string) => {
  return toText(value) ? '' : `${label} is required.`;
};

export const selectionError = (value: unknown, label: string) => {
  return toText(value) ? '' : `Please select a ${label.toLowerCase()}.`;
};

export const emailError = (value: unknown, label = 'Email address') => {
  const text = toText(value);
  if (!text) return `${label} is required.`;
  return emailPattern.test(text) ? '' : 'Enter a valid email address.';
};

export const phoneError = (value: unknown, label = 'Phone number') => {
  const text = toText(value);
  if (!text) return `${label} is required.`;

  const phonePattern = /^\+254\d{9}$/;
  if (text.length !== 13 || !phonePattern.test(text)) {
    return 'Phone number must be in the format +254XXXXXXXXX (exactly 13 characters).';
  }

  return '';
};

export const alphanumericError = (value: unknown, label: string) => {
  const text = toText(value);
  if (!text) return `${label} is required.`;

  const pattern = /^[a-zA-Z0-9]+$/;
  if (!pattern.test(text)) {
    return `${label} must contain only alphanumeric characters (no spaces or special characters).`;
  }

  return '';
};


export const yearError = (value: unknown, label = 'Registration year') => {
  const text = toText(value);
  if (!text) return `${label} is required.`;

  const year = Number(text);
  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(year) || year < 1950 || year > currentYear + 1) {
    return `Enter a valid ${label.toLowerCase()}.`;
  }

  return '';
};

export const hasAttachments = (count: number) => count > 0;