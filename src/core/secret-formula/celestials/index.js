import { alchemyResources } from "./alchemy";
import { alphaUnlocks } from "./alpha";
import { divinityMilestones } from "./divinity-milestones";
import { divinityUpgrades } from "./divinity-upgrades";
import { effarigUnlocks } from "./effarig";
import { enslaved } from "./enslaved";
import { galaxyIcon } from "./navigation-sigils/galaxy-icon";
import { finalSigil } from "./navigation-sigils/final-sigil";
import { celestialNavigation } from "./navigation";
import { pelleGalaxyGeneratorUpgrades } from "./galaxy-generator";
import { pelleRifts } from "./rifts";
import { pelleStrikes } from "./strikes";
import { pelleUpgrades } from "./pelle-upgrades";
import {
  pelleAchievementEnabling,
  pelleAlchemyEnabling,
  pelleCelestialRewardEnabling,
  pelleDestructionUpgrades,
  pelleImaginaryUpgradeEnabling,
  pellePerkEnabling,
  pelleRealityUpgradeEnabling,
  pelleStrikeDisabling
} from "./pelle-destruction-upgrades";
import { perkShop } from "./perk-shop";
import { quotes } from "./quotes";
import { ra } from "./ra";
import { singularityMilestones } from "./singularity-milestones";
import { slabdrillUnlocks } from "./slabdrill";
import { teresa } from "./teresa";
import { v, vUpgrades } from "./v";
import { GlitchRifts } from "./glitchrift";
import { glitchRealityUpgrades } from "./glitchupgrades";
import { glitchSpeedUpgrades } from "./glitchspeed";
import { cante } from "./cante";
import { NullData } from "./null";
import { resurgenceUpgrades } from "./resurgence-upgrades";

export const celestials = {
  alpha: {
    unlocks: alphaUnlocks
  },
  slabdrill: {
    unlocks: slabdrillUnlocks
  },
  effarig: {
    unlocks: effarigUnlocks
  },
  alchemy: {
    resources: alchemyResources
  },
  pelle: {
    galaxyGeneratorUpgrades: pelleGalaxyGeneratorUpgrades,
    strikes: pelleStrikes,
    upgrades: pelleUpgrades,
    rifts: pelleRifts
  },
  pelleDestruction: {
    upgrades: pelleDestructionUpgrades,
    achievements: pelleAchievementEnabling,
    realityUpgrades: pelleRealityUpgradeEnabling,
    imaginaryUpgrades: pelleImaginaryUpgradeEnabling,
    celestials: pelleCelestialRewardEnabling,
    perks: pellePerkEnabling,
    alchemy: pelleAlchemyEnabling,
    strikes: pelleStrikeDisabling
  },
  descriptions: {},
  divinityMilestones,
  divinityUpgrades,
  navigation: celestialNavigation,
  navSigils: {
    ...galaxyIcon,
    ...finalSigil
  },
  resurgenceUpgrades,
  enslaved,
  perkShop,
  ra,
  singularityMilestones,
  teresa,
  quotes,
  v,
  vUpgrades,
  GlitchRifts,
  glitchRealityUpgrades,
  glitchSpeedUpgrades,
  cante,
  null: NullData
};
