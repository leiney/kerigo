import { useState, useCallback } from 'react';

export const useAlphanumericInput = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

  const sanitize = useCallback((input: string) => {
    return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }, []);

  const handleChange = useCallback((updater: (value: string) => void) => {
    return (newValue: string) => {
      const sanitized = sanitize(String(newValue));
      updater(sanitized);
    };
  }, [sanitize]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End',
    ];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      return;
    }

    if (!/^[A-Za-z0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  }, []);

  return {
    value,
    setValue,
    sanitize,
    handleChange,
    handleKeyDown,
  };
};

export const alphanumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End',
  ];

  if (allowedKeys.includes(e.key)) {
    return;
  }

  if (e.ctrlKey || e.metaKey) {
    return;
  }

  if (!/^[A-Za-z0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizeAlphanumeric = (value: string): string => {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
};