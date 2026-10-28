import { Quotes } from "./quotes";

export const SquareCubic = {
  displayName: "SquareCubic",
  possessiveName: "SquareCubic's",
  get isUnlocked() {
    return false;
  },
  quotes: Quotes.squarecubic,
  symbol: "₂³"
};
