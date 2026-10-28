import { DC } from "../constants";

export const tabNotifications = {
  firstInfinity: {
    id: 0,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "upgrades"
      },
      {
        parent: "challenges",
        tab: "normal"
      },
      {
        parent: "statistics",
        tab: "multipliers"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() &&
      !PlayerProgress.infinityUnlocked(),
    events: [GAME_EVENT.BIG_CRUNCH_BEFORE]
  },
  breakInfinity: {
    id: 1,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "break"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && Autobuyer.bigCrunch.hasMaxedInterval
  },
  IDUnlock: {
    id: 2,
    tabsToHighLight: [
      {
        parent: "dimensions",
        tab: "infinity"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && !InfinityDimension(2).isUnlocked
  },
  ICUnlock: {
    id: 3,
    tabsToHighLight: [
      {
        parent: "challenges",
        tab: "infinity"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked()
  },
  replicanti: {
    id: 4,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "replicanti"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && Currency.infinityPoints.gte(DC.E140),
    events: [GAME_EVENT.BIG_CRUNCH_AFTER]
  },
  firstEternity: {
    id: 5,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "studies"
      },
      {
        parent: "eternity",
        tab: "milestones"
      },
      {
        parent: "eternity",
        tab: "upgrades"
      },
      {
        parent: "dimensions",
        tab: "time"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked(),
    events: [GAME_EVENT.ETERNITY_RESET_BEFORE]
  },
  dilationAfterUnlock: {
    id: 6,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "dilation"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked()
  },
  realityUnlock: {
    id: 7,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "studies"
      }
    ],
    condition: () => !PlayerProgress.realityUnlocked() && TimeStudy.reality.canBeBought,
    events: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION,
      GAME_EVENT.OFFLINE_CURRENCY_GAINED, GAME_EVENT.ACHIEVEMENT_UNLOCKED]
  },
  blackHoleUnlock: {
    id: 8,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "hole"
      }
    ],
    condition: () => !BlackHoles.areUnlocked && Currency.realityMachines.gte(100),
    events: [GAME_EVENT.REALITY_RESET_AFTER]
  },
  automatorUnlock: {
    id: 9,
    tabsToHighLight: [
      {
        parent: "automation",
        tab: "automator"
      }
    ],
    condition: () => Player.automatorUnlocked,
    events: [GAME_EVENT.REALITY_RESET_AFTER]
  },
  teresaUnlock: {
    id: 10,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "teresa"
      }
    ],
    condition: () => player.celestials.teresa.pouredAmount.eq(0) && Teresa.isUnlocked,
    events: [GAME_EVENT.REALITY_UPGRADE_BOUGHT]
  },
  alchemyUnlock: {
    id: 11,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "glyphs"
      },
      {
        parent: "reality",
        tab: "alchemy"
      }
    ],
    condition: () => player.celestials.ra.pets.effarig.level >= 2,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  newAutobuyer: {
    id: 12,
    tabsToHighLight: [
      {
        parent: "automation",
        tab: "autobuyers"
      },
    ],
    // Always externally triggered, but needs to be ignored in cel7 because they're unlocked differently
    condition: () => !Pelle.isDoomed,
  },
  imaginaryMachineUnlock: {
    id: 13,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "imag_upgrades"
      }
    ],
    condition: () => MachineHandler.isIMUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  laitelaUnlock: {
    id: 14,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "laitela"
      },
    ],
    // Always externally triggered
    condition: () => true && !PlayerProgress.metaUnlocked(),
  },
  pelleUnlock: {
    id: 15,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "pelle"
      },
    ],
    // Always externally triggered
    condition: () => true,
  },
  newGlyphCosmetic: {
    id: 16,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "glyphs",
      },
    ],
    // Always externally triggered
    condition: () => true,
  },
  ascension: {
    id: 17,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "ascension"
      }
    ],
    condition: () => true,
  },
  endgameUpgrades: {
    id: 20,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "upgrades"
      }
    ],
    // Always externally triggered
    condition: () => true,
  },
  hadrons: {
    id: 25,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "laitela"
      }
    ],
    // Always externally triggered
    condition: () => true,
  },
  hypercubes: {
    id: 29,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "hypercubes"
      }
    ],
    condition: () => true,
  },
  slabdrillUnlock: {
    id: 39,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      }
    ],
    condition: () => Slabdrill.isCursed,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeOne: {
    id: 40,
    tabsToHighLight: [
      { parent: "celestials", tab: "slabdrill" },
      { parent: "dimensions", tab: "celestial" }
    ],
    condition: () => SlabdrillUnlocks.dimboost.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeTwo: {
    id: 41,
    tabsToHighLight: [
      { parent: "celestials", tab: "slabdrill" },
      { parent: "reality", tab: "glyphs" }
    ],
    condition: () => SlabdrillUnlocks.galaxy.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeThree: {
    id: 42,
    tabsToHighLight: [
      { parent: "celestials", tab: "slabdrill" },
      { parent: "endgame", tab: "break-eternity" }
    ],
    condition: () => SlabdrillUnlocks.infinity.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeFour: {
    id: 43,
    tabsToHighLight: [
      { parent: "celestials", tab: "slabdrill" },
      { parent: "reality", tab: "glyphs" }
    ],
    condition: () => SlabdrillUnlocks.breakInfinity.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeFive: {
    id: 44,
    tabsToHighLight: [
      { parent: "celestials", tab: "slabdrill" },
      { parent: "celestials", tab: "laitela" }
    ],
    condition: () => SlabdrillUnlocks.infinityChallengeFour.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeSix: {
    id: 45,
    tabsToHighLight: [
      { parent: "celestials", tab: "slabdrill" },
      { parent: "endgame", tab: "ethereal" }
    ],
    condition: () => SlabdrillUnlocks.replicanti.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeSeven: {
    id: 46,
    tabsToHighLight: [
      { parent: "celestials", tab: "slabdrill" },
      { parent: "reality", tab: "glyphs" },
      { parent: "endgame", tab: "masteries" }
    ],
    condition: () => SlabdrillUnlocks.eternity.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeEight: {
    id: 47,
    tabsToHighLight: [
      { parent: "celestials", tab: "slabdrill" },
      { parent: "reality", tab: "glyphs" },
      { parent: "celestials", tab: "effarig" }
    ],
    condition: () => SlabdrillUnlocks.timeStudy181.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeNine: {
    id: 48,
    tabsToHighLight: [
      { parent: "celestials", tab: "slabdrill" },
      { parent: "reality", tab: "glyphs" },
      { parent: "achievements", tab: "normal" }
    ],
    condition: () => SlabdrillUnlocks.eternityChallengeTen.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeTen: {
    id: 49,
    tabsToHighLight: [
      { parent: "celestials", tab: "slabdrill" },
      { parent: "reality", tab: "glyphs" },
      { parent: "reality", tab: "alchemy" }
    ],
    condition: () => SlabdrillUnlocks.dilation.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeEleven: {
    id: 50,
    tabsToHighLight: [
      { parent: "celestials", tab: "slabdrill" },
      { parent: "dimensions", tab: "antimatter" }
    ],
    condition: () => SlabdrillUnlocks.reality.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  extendMasteries: {
    id: 52,
    tabsToHighLight: [
      { parent: "endgame", tab: "masteries" }
    ],
    // Always externally triggered
    condition: () => true,
  },
  extendSingularityMilestones: {
    id: 53,
    tabsToHighLight: [
      { parent: "celestials", tab: "laitela" }
    ],
    // Always externally triggered
    condition: () => true,
  },
  extendGalacticPowers: {
    id: 54,
    tabsToHighLight: [
      { parent: "endgame", tab: "power" }
    ],
    // Always externally triggered
    condition: () => true,
  },
};
