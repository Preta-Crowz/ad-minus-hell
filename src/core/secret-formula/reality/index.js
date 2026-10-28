import { cosmeticGlyphs, GlyphInfo } from "./core-glyph-info";
import { perkConnections, perks } from "./perks";

import { automator } from "./automator";
import { dualityUpgrades } from "./duality-upgrades";
import { glyphCosmeticSets } from "./glyph-cosmetics";
import { glyphEffects } from "./glyph-effects";
import { glyphSacrifice } from "./glyph-sacrifices";
import { imaginaryUpgrades } from "./imaginary-upgrades";
import { realityUpgrades } from "./reality-upgrades";

export const reality = {
  automator,
  dualityUpgrades,
  cosmeticGlyphs,
  glyphCosmeticSets,
  glyphEffects,
  glyphSacrifice,
  GlyphInfo,
  imaginaryUpgrades,
  perks,
  perkConnections,
  upgrades: realityUpgrades
};
