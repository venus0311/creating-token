export const generateNonce = (): string => {
  return crypto.randomUUID();
};
