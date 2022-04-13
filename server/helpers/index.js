import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghij", 10);

export const generateLinkAlias = () => {
  return nanoid();
};
