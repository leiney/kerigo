const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') return false;
  return Object.prototype.toString.call(value) === '[object Object]';
};

const isFileLike = (value: unknown): value is File | Blob => {
  return (
    (typeof File !== 'undefined' && value instanceof File) ||
    (typeof Blob !== 'undefined' && value instanceof Blob)
  );
};

const isFileListLike = (value: unknown): value is FileList => {
  return typeof FileList !== 'undefined' && value instanceof FileList;
};

const appendValue = (formData: FormData, key: string, value: unknown) => {
  if (value === null || value === undefined || typeof value === 'function') {
    return;
  }

  

  if (isFileLike(value)) {
    formData.append(key, value);
    return;
  }

  if (isFileListLike(value)) {
    Array.from(value).forEach((file) => formData.append(`${key}[]`, file));
    return;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      formData.append(`${key}[]`, '');
      return;
    }

    if (value.every((item) => isFileLike(item))) {
      value.forEach((file) => formData.append(`${key}[]`, file as File | Blob));
      return;
    }

    if (value.every((item) => !isPlainObject(item) && !Array.isArray(item))) {
      value.forEach((item) => formData.append(`${key}[]`, String(item)));
      return;
    }

    value.forEach((item, index) => {
      appendFlattenedFormData(formData, item, `${key}[${index}]`);
    });
    return;
  }

  if (isPlainObject(value)) {
    Object.entries(value).forEach(([childKey, childValue]) => {
      appendFlattenedFormData(formData, childValue, key ? `${key}[${childKey}]` : childKey);
    });
    return;
  }

  formData.append(key, String(value));
};

export const appendFlattenedFormData = (
  formData: FormData,
  value: unknown,
  parentKey = ''
): FormData => {
  if (Array.isArray(value)) {
    appendValue(formData, parentKey, value);
    return formData;
  }

  if (isPlainObject(value)) {
    Object.entries(value).forEach(([key, childValue]) => {
      const nextKey = parentKey ? `${parentKey}[${key}]` : key;
      appendFlattenedFormData(formData, childValue, nextKey);
    });
    return formData;
  }

  if (parentKey) {
    appendValue(formData, parentKey, value);
  }

  return formData;
};

export const buildFlattenedFormData = (value: Record<string, unknown>): FormData => {
  const formData = new FormData();
  appendFlattenedFormData(formData, value);
  return formData;
};
