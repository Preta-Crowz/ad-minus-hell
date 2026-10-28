import { AutomatorPanels } from "@/components/tabs/automator/AutomatorDocs";
import { GlyphInfo } from "./secret-formula/reality/core-glyph-info";
import { GlyphInfoVue } from "@/components/modals/options/SelectGlyphInfoDropdown";

import { AUTOMATOR_MODE, AUTOMATOR_TYPE } from "./automator/automator-backend";
import { DC } from "./constants";
import { deepmergeAll } from "@/utility/deepmerge";

function getGlyphTypes() {
  const v = { ...GlyphInfo };
  for (const item in GlyphInfo) {
    if (!GlyphInfo.glyphTypes.includes(item)) delete v[item];
  }
  return v;
}

// This is actually reassigned when importing saves
// eslint-disable-next-line prefer-const
window.player = {
  antimatter: DC.E1,
  dimensions: {
    antimatter: Array.range(0, 9).map(() => ({
      bought: DC.D0,
      costBumps: DC.D0,
      amount: DC.D0
    })),
    infinity: Array.range(0, 8).map(tier => ({
      isUnlocked: false,
      bought: DC.D0,
      amount: DC.D0,
      cost: [DC.E8, DC.E9, DC.E10, DC.E20, DC.E140, DC.E200, DC.E250, DC.E280][tier],
      baseAmount: DC.D0
    })),
    time: Array.range(0, 8).map(tier => ({
      cost: [DC.D1, DC.D5, DC.E2, DC.E3, DC.E2350, DC.E2650, DC.E3000, DC.E3350][tier],
      amount: DC.D0,
      bought: DC.D0
    })),
    celestial: Array.range(0, 9).map(tier => ({
      isUnlocked: false,
      bought: DC.D0,
      amount: DC.D0,
      cost: [DC.D1, DC.E1, DC.E2, DC.E4, DC.E10, DC.E30, DC.E100, DC.E300, new Decimal(Infinity)][tier],
      baseAmount: DC.D0
    })),
    divine: Array.range(0, 9).map(tier => ({
      bought: DC.D0,
      amount: DC.D0,
      cost: [DC.E1, DC.E3, DC.E6, DC.E10, DC.E15, DC.E21, DC.E28, DC.E36, new Decimal(Infinity)][tier],
      baseAmount: DC.D0
    })),
    chaos: Array.range(0, 12).map(() => ({
      bought: DC.D0,
      amount: DC.D0
    })),
  },
  buyUntil10: true,
  sacrificed: DC.D0,
  achievementBits: Array.repeat(0, 20),
  secretAchievementBits: Array.repeat(0, 5),
  infinityUpgrades: new Set(),
  infinityRebuyables: [new Decimal(), new Decimal(), new Decimal()],
  breakEternityUpgrades: new Set(),
  breakEternityRebuyables: Array.repeat(0, 10),
  challenge: {
    normal: {
      current: 0,
      bestTimes: Array.repeat(DC.BEMAX, 11),
      completedBits: 0,
    },
    infinity: {
      current: 0,
      bestTimes: Array.repeat(DC.BEMAX, 10),
      completedBits: 0,
    },
    eternity: {
      current: 0,
      unlocked: 0,
      requirementBits: 0,
    }
  },
  auto: {
    autobuyersOn: true,
    disableContinuum: false,
    endgame: {
      mode: 0,
      amountCP: DC.D1,
      amountDP: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighestCP: DC.D1,
      xHighestDP: DC.D1,
      isActive: false
    },
    endgameUpgrades: {
      all: Array.range(0, 5).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    metaUpgrades: {
      all: Array.range(0, 5).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    celestialCrunch: {
      mode: 0,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: true,
      lastTick: 0
    },
    celestialEternity: {
      mode: 0,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: true,
      lastTick: 0
    },
    celestialTickspeed: {
      mode: AUTOBUYER_MODE.BUY_SINGLE,
      isActive: true,
      lastTick: 0
    },
    celestialDimBoost: {
      limitCelDimBoosts: false,
      maxCelDimBoosts: 1,
      limitUntilCelGalaxies: false,
      celGalaxies: 10,
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0
    },
    celestialGalaxy: {
      limitCelGalaxies: false,
      maxCelGalaxies: 1,
      buyMax: false,
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0
    },
    celestialDims: {
      all: Array.range(0, 8).map(() => ({ isActive: false, lastTick: 0 })),
      isActive: true
    },
    divineDims: {
      all: Array.range(0, 8).map(() => ({ isActive: false, lastTick: 0 })),
      isActive: true
    },
    bulkSingularity: {
      isActive: false,
      lowerBound: 0.1,
      upperBound: 10,
      hasLowerBound: false,
      hasUpperBound: false
    },
    meta: {
      mode: 0,
      mr: DC.D1,
      xHighest: DC.D1,
      time: 1,
      isActive: false
    },
    reality: {
      mode: 0,
      rm: DC.D1,
      glyph: DC.D0,
      time: 0,
      shard: DC.D0,
      isActive: false
    },
    eternity: {
      mode: 0,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: false
    },
    bigCrunch: {
      cost: 1,
      interval: 150000,
      mode: 0,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: false,
      lastTick: 0
    },
    galaxy: {
      cost: 1,
      interval: 20000,
      limitGalaxies: false,
      maxGalaxies: new Decimal(1),
      buyMax: false,
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0
    },
    dimBoost: {
      cost: 1,
      interval: 4000,
      limitDimBoosts: false,
      maxDimBoosts: new Decimal(1),
      limitUntilGalaxies: false,
      galaxies: new Decimal(10),
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0
    },
    tickspeed: {
      isUnlocked: false,
      cost: 1,
      interval: 500,
      mode: AUTOBUYER_MODE.BUY_SINGLE,
      isActive: true,
      lastTick: 0,
      isBought: false
    },
    sacrifice: {
      multiplier: DC.D2,
      isActive: true
    },
    antimatterDims: {
      all: Array.range(0, 8).map(tier => ({
        isUnlocked: false,
        cost: 1,
        interval: [500, 600, 700, 800, 900, 1000, 1100, 1200][tier],
        bulk: 1,
        mode: AUTOBUYER_MODE.BUY_10,
        isActive: true,
        lastTick: 0,
        isBought: false
      })),
      isActive: true,
    },
    infinityDims: {
      all: Array.range(0, 8).map(() => ({
        isActive: true,
        lastTick: 0,
      })),
      isActive: true,
    },
    timeDims: {
      all: Array.range(0, 8).map(() => ({
        isActive: true,
        lastTick: 0,
      })),
      isActive: true,
    },
    chaosDims: {
      all: Array.range(0, 12).map(() => ({
        isActive: true,
        lastTick: 0,
      })),
      isActive: true,
    },
    canteRep: {
      all: Array.range(0, 10).map(() => ({
        isActive: true,
        lastTick: 0,
      })),
      isActive: true,
    },
    nullCyc: {
      all: Array.range(0, 16).map(() => ({
        isActive: true,
        lastTick: 0,
      })),
      isActive: true,
    },
    replicantiGalaxies: {
      isActive: true,
    },
    replicantiUpgrades: {
      all: Array.range(0, 3).map(() => ({
        isActive: true,
        lastTick: 0,
      })),
      isActive: true,
    },
    timeTheorems: {
      isActive: true,
    },
    dilationUpgrades: {
      all: Array.range(0, 6).map(() => ({
        isActive: true,
        lastTick: 0,
      })),
      isActive: true,
    },
    blackHolePower: {
      all: Array.range(0, 2).map(() => ({
        isActive: true,
      })),
      isActive: true,
    },
    realityUpgrades: {
      all: Array.range(0, 5).map(() => ({
        isActive: true,
      })),
      isActive: true,
    },
    imaginaryUpgrades: {
      all: Array.range(0, 10).map(() => ({
        isActive: true,
      })),
      isActive: true,
    },
    dualityUpgrades: {
      all: Array.range(0, 10).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    nrru: {
      isActive: true,
    },
    nriu: {
      isActive: true,
    },
    nrgu: {
      isActive: true,
    },
    gup: {
      all: Array.range(0, 4).map(() => ({
        isActive: true,
      })),
      isActive: true,
    },
    tess: {
      isActive: true,
    },
    darkMatterDims: {
      isActive: true,
      lastTick: 0,
    },
    ascension: {
      isActive: true,
      lastTick: 0,
    },
    annihilation: {
      isActive: false,
      multiplier: new Decimal(1.05),
      mode: 0,
    },
    pets: {
      teresa: {
        isActive: true,
        lastTick: 0,
        upgrades: Array.range(0, 3).map(() => ({
          isActive: true,
        })),
      },
      effarig: {
        isActive: true,
        lastTick: 0,
        upgrades: Array.range(0, 3).map(() => ({
          isActive: true,
        })),
      },
      enslaved: {
        isActive: true,
        lastTick: 0,
        upgrades: Array.range(0, 3).map(() => ({
          isActive: true,
        })),
      },
      v: {
        isActive: true,
        lastTick: 0,
        upgrades: Array.range(0, 3).map(() => ({
          isActive: true,
        })),
      },
      glitchyfishys: {
        isActive: true,
        lastTick: 0,
        upgrades: Array.range(0, 3).map(() => ({
          isActive: true,
        })),
      },
      cante: {
        isActive: true,
        lastTick: 0,
        upgrades: Array.range(0, 3).map(() => ({
          isActive: true,
        })),
      },
      null: {
        isActive: true,
        lastTick: 0,
        upgrades: Array.range(0, 3).map(() => ({
          isActive: true,
        })),
      },
    },
    galgenUpgrades: {
      all: Array.range(0, 10).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    pelleUpgrades: {
      all: Array.range(0, 6).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    galgenSac: { isActive: false },
    singularity: { isActive: true },
    singCap: { isActive: true },
    ipMultBuyer: { isActive: true },
    epMultBuyer: { isActive: true },
    cipMultBuyer: { isActive: false },
    nullUG: { isActive: true }
  },
  infinityPoints: DC.D0,
  infinities: DC.D0,
  infinitiesBanked: DC.D0,
  endgames: DC.D0,
  dimensionBoosts: DC.D0,
  galaxies: DC.D0,
  news: {
    // This is properly handled in NewsHandler.addSeenNews which adds properties as needed
    seen: {},
    specialTickerData: {
      uselessNewsClicks: 0,
      paperclips: 0,
      newsQueuePosition: 1000,
      eiffelTowerChapter: 0,
      storyChapter: 0,
      effarigChapter: 0,
      discordLevel: 1,
      dayOfEndgame: 0,
      celestialFuneralChapter: 0
    },
    totalSeen: 0,
  },
  lastUpdate: new Date().getTime(),
  backupTimer: 0,
  chall2Pow: DC.D1,
  chall3Pow: DC.D0_01,
  matter: DC.D1,
  chall9TickspeedCostBumps: DC.D0,
  chall8TotalSacrifice: DC.D1,
  ic2Count: 0,
  partInfinityPoint: 0,
  partInfinitied: 0,
  break: false,
  break2: false,
  universes: {
    current: 0,
    highestTransientAntimatter: DC.E1,
    relativisticParticles: DC.D0,
    ephemeralLight: DC.D0,
    highestTangibleMatter: DC.E1,
    molecularMass: DC.D0,
    stellarAugmenters: DC.D0
  },
  secretUnlocks: {
    themes: new Set(),
    viewSecretTS: false,
    cancerAchievements: false,
  },
  shownRuns: {
    Reality: true,
    Eternity: true,
    Infinity: true
  },
  requirementChecks: {
    infinity: {
      maxAll: false,
      noSacrifice: true,
      noAD8: true,
    },
    eternity: {
      onlyAD1: true,
      onlyAD8: true,
      noAD1: true,
      noRG: true,
    },
    reality: {
      noAM: true,
      noTriads: true,
      noPurchasedTT: true,
      noInfinities: true,
      noEternities: true,
      noContinuum: true,
      noCelMatter: true,
      maxID1: DC.D0,
      maxStudies: 0,
      maxGlyphs: 0,
      slowestBH: DC.D1,
    },
    meta: {
      noGlyphs: false,
      maxStudies: 0,
      noTriads: true,
    },
    endgame: {
      noGlyphsDoomed: true,
      onlyLowDims: true,
      maxStudies: 0,
      noContinuum: true,
      noGlyphs: true,
    },
    permanent: {
      emojiGalaxies: DC.D0,
      singleTickspeed: 0,
      perkTreeDragging: 0
    }
  },
  records: {
    gameCreatedTime: Date.now(),
    trueTimePlayed: 0,
    totalTimePlayed: DC.D0,
    timePlayedAtBHUnlock: DC.BEMAX,
    timeSinceBHUnlock: DC.D0,
    realTimePlayed: DC.D0,
    realTimeDoomed: DC.D0,
    fullGameCompletions: 0,
    previousRunRealTime: DC.D0,
    totalAntimatter: DC.E1,
    totalAntimatterOutsideDoom: DC.E1,
    bestAntimatterExponentOutsideDoom: DC.D0,
    bestDoomedAntimatterThisDivinity: DC.E1,
    totalEndgameAntimatter: DC.E1,
    totalRealityAntimatter: DC.E1,
    totalEternityAntimatter: DC.E1,
    totalInfinityAntimatter: DC.E1,
    totalCelMatter: DC.D0,
    totalCelestialRealityCelMatter: DC.D0,
    totalCelestialEternityCelMatter: DC.D0,
    totalCelestialInfinityCelMatter: DC.D0,
    totalDivineMatter: DC.E1,
    totalCondenseDivineMatter: DC.E1,
    totalSupernovaDivineMatter: DC.E1,
    recentInfinities: Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, DC.D1, ""]),
    recentEternities: Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, DC.D1, "", DC.D0]),
    recentRealities: Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, DC.D1, "", DC.D0, DC.D0]),
    recentMetas: Array.range(0, 10).map(() => [1e300, DC.BEMAX, DC.BEMAX, DC.D1, 1, ""]),
    recentEndgames: Array.range(0, 10).map(() => [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1, DC.D1]),
    recentCelestialInfinities: Array.range(0, 10).map(() => [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1]),
    recentCelestialEternities: Array.range(0, 10).map(() => [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1]),
    recentCondenses: Array.range(0, 10).map(() => [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1]),
    recentSupernovae: Array.range(0, 10).map(() => [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1]),
    thisInfinity: {
      time: DC.D0,
      realTime: DC.D0,
      trueTime: 0,
      lastBuyTime: DC.D0,
      maxAM: DC.D0,
      bestIPmin: DC.D0,
      bestIPminVal: DC.D0,
    },
    bestInfinity: {
      time: DC.BEMAX,
      realTime: DC.BEMAX,
      trueTime: 0,
      bestIPminEternity: DC.D0,
      bestIPminReality: DC.D0,
    },
    thisEternity: {
      time: DC.D0,
      realTime: DC.D0,
      trueTime: 0,
      maxAM: DC.D0,
      maxIP: DC.D0,
      bestIPMsWithoutMaxAll: DC.D0,
      bestEPmin: DC.D0,
      bestEPminVal: DC.D0,
      bestInfinitiesPerMs: DC.D0,
    },
    bestEternity: {
      time: DC.BEMAX,
      realTime: DC.BEMAX,
      trueTime: 0,
      bestEPminReality: DC.D0,
    },
    thisReality: {
      time: DC.D0,
      realTime: DC.D0,
      trueTime: 0,
      maxAM: DC.D0,
      maxIP: DC.D0,
      maxEP: DC.D0,
      bestEternitiesPerMs: DC.D0,
      maxReplicanti: DC.D0,
      maxDT: DC.D0,
      bestRSmin: DC.D0,
      bestRSminVal: DC.D0,
    },
    bestReality: {
      time: DC.BEMAX,
      realTime: DC.BEMAX,
      trueTime: 0,
      glyphStrength: DC.D0,
      RM: DC.D0,
      RMSet: [],
      RMmin: DC.D0,
      RMminSet: [],
      glyphLevel: DC.D0,
      glyphLevelSet: [],
      bestEP: DC.D0,
      bestEPSet: [],
      speedSet: [],
      iMCapSet: [],
      laitelaSet: [],
    },
    thisMeta: {
      time: DC.D0,
      realTime: DC.D0,
      trueTime: 0,
      maxAM: DC.D0,
      MR: DC.D0,
      bestMRmin: DC.D0,
      bestMRminVal: DC.D0,
    },
    bestMeta: {
      time: DC.BEMAX,
      realTime: DC.BEMAX,
      trueTime: 0,
      MR: DC.D0,
      MRmin: DC.D0,
    },
    thisEndgame: { time: DC.D0, realTime: 0, bestCPmin: DC.D0, bestDPmin: DC.D0, peakGameSpeed: DC.D1 },
    bestEndgame: {
      time: DC.BEMAX, realTime: Number.MAX_VALUE, bestCPmin: DC.D0, bestDPmin: DC.D0, glyphLevel: DC.D0, galaxies: DC.D0
    },
    permanent: {
      maxCP: DC.D0,
      maxDP: DC.D0,
    },
    thisCelestialInfinity: { time: DC.D0, realTime: 0, maxCM: DC.D0, bestCIPmin: DC.D0, bestCIPminVal: DC.D0 },
    bestCelestialInfinity: {
      time: DC.BEMAX, realTime: Number.MAX_VALUE, bestCIPminCelestialEternity: DC.D0, bestCIPminCelestialReality: DC.D0
    },
    thisCelestialEternity: {
      time: DC.D0, realTime: 0, maxCM: DC.D0, maxCIP: DC.D0, bestCEPmin: DC.D0, bestCEPminVal: DC.D0,
      bestCelestialInfinitiesPerMs: DC.D0
    },
    bestCelestialEternity: { time: DC.BEMAX, realTime: Number.MAX_VALUE, bestCEPminCelestialReality: DC.D0 },
    thisCelestialReality: { time: DC.D0, realTime: 0, maxCM: DC.D0, maxCIP: DC.D0, maxCEP: DC.D0, bestCelestialEternitiesPerMs: DC.D0 },
    thisCondense: { time: DC.D0, realTime: 0, maxVM: DC.D0, bestVSmin: DC.D0, bestVSminVal: DC.D0 },
    bestCondense: { time: DC.BEMAX, realTime: Number.MAX_VALUE, bestVSminSupernova: DC.D0 },
    thisSupernova: {
      time: DC.D0, realTime: 0, maxVM: DC.D0, maxVS: DC.D0, bestNebmin: DC.D0, bestNebminVal: DC.D0,
      bestCondensesPerMs: DC.D0
    },
    bestSupernova: {
      time: DC.BEMAX, realTime: Number.MAX_VALUE, bestNebminTotal: DC.D0, bestSupernovaePerMs: DC.D0, maxNeb: DC.D0,
      totalNeb: DC.D0
    },
  },
  speedrun: {
    isUnlocked: false,
    isActive: false,
    isSegmented: false,
    usedSTD: false,
    hasStarted: false,
    hideInfo: false,
    displayAllMilestones: false,
    startDate: 0,
    name: "",
    offlineTimeUsed: 0,
    // One spot for every entry in GameDatabase.speedrunMilestones (note: 1-indexed)
    records: Array.repeat(0, 26),
    achievementTimes: {},
    seedSelection: SPEEDRUN_SEED_STATE.FIXED,
    initialSeed: 0,
    previousRuns: {}
  },
  IPMultPurchases: DC.D0,
  version: 24,
  infinityPower: DC.D1,
  postC4Tier: 0,
  eternityPoints: DC.D0,
  eternities: DC.D0,
  eternityUpgrades: new Set(),
  epmultUpgrades: DC.D0,
  timeShards: DC.D0,
  totalTickGained: DC.D0,
  totalTickBought: DC.D0,
  replicanti: {
    unl: false,
    amount: DC.D0,
    chance: new Decimal(0.01),
    chanceCost: DC.E150,
    interval: DC.E3,
    intervalCost: DC.E140,
    boughtGalaxyCap: DC.D0,
    galaxies: DC.D0,
    galCost: DC.E170,
  },
  timestudy: {
    theorem: DC.D0,
    maxTheorem: DC.D0,
    amBought: DC.D0,
    ipBought: DC.D0,
    epBought: DC.D0,
    studies: [],
    shopMinimized: false,
    preferredPaths: [[], 0],
    presets: new Array(6).fill({
      name: "",
      studies: "",
    }),
  },
  eternityChalls: {},
  respec: false,
  eterc8ids: 50,
  eterc8repl: 40,
  dilation: {
    studies: [],
    active: false,
    tachyonParticles: DC.D0,
    dilatedTime: DC.D0,
    nextThreshold: DC.E3,
    baseTachyonGalaxies: DC.D0,
    totalTachyonGalaxies: DC.D0,
    upgrades: new Set(),
    rebuyables: {
      1: new Decimal(),
      2: new Decimal(),
      3: new Decimal(),
      11: new Decimal(),
      12: new Decimal(),
      13: new Decimal(),
      16: new Decimal(),
    },
    lastEP: DC.DM1,
  },
  realities: DC.D0,
  partSimulatedReality: DC.D0,
  reality: {
    realityMachines: DC.D0,
    maxRM: DC.D0,
    imaginaryMachines: DC.D0,
    iMCap: DC.D0,
    dualMachines: DC.D0,
    jMCap: DC.D0,
    glyphs: {
      active: [],
      inventory: [],
      sac: {
        power: DC.D0,
        infinity: DC.D0,
        time: DC.D0,
        replication: DC.D0,
        dilation: DC.D0,
        effarig: DC.D0,
        reality: DC.D0,
        glitch: DC.D0
      },
      undo: [],
      sets: new Array(8).fill({
        name: "",
        glyphs: [],
      }),
      protectedRows: 2,
      filter: {
        select: AUTO_GLYPH_SCORE.LOWEST_SACRIFICE,
        trash: AUTO_GLYPH_REJECT.SACRIFICE,
        simple: 0,
        types: Object.keys(getGlyphTypes())
          .filter(t => GlyphInfo.generatedGlyphTypes.includes(t))
          .mapToObject(t => t, t => ({
            rarity: new Decimal(),
            score: 0,
            effectCount: 0,
            specifiedMask: [],
            effectScores: [...Array(GlyphInfo[t].effectIDs.length).keys()].mapToObject(e => GlyphInfo[t].effectIDs[e], () => 0),
          })),
      },
      createdRealityGlyph: false,
      createdGlitchGlyph: false,
      cosmetics: {
        active: false,
        glowNotification: false,
        unlockedFromNG: [],
        symbolMap: {},
        colorMap: {},
      }
    },
    initialSeed: Math.floor(Date.now() * Math.random() + 1),
    // The seed value should get set from initialSeed upon unlocking reality, but we set it to 1 as a fallback in
    // case somehow it doesn't get set properly. Do not change this to 0, as a seed of 0 causes the game to hang
    seed: 1,
    secondGaussian: 1e6,
    musicSeed: Math.floor(Date.now() * Math.random() + 0xBCDDECCB),
    musicSecondGaussian: 1e6,
    rebuyables: {
      1: new Decimal(),
      2: new Decimal(),
      3: new Decimal(),
      4: new Decimal(),
      5: new Decimal(),
    },
    upgradeBits: 0,
    upgReqs: 0,
    imaginaryUpgradeBits: 0,
    imaginaryUpgReqs: 0,
    imaginaryRebuyables: {
      1: new Decimal(),
      2: new Decimal(),
      3: new Decimal(),
      4: new Decimal(),
      5: new Decimal(),
      6: new Decimal(),
      7: new Decimal(),
      8: new Decimal(),
      9: new Decimal(),
      10: new Decimal(),
    },
    dualityUpgradeBits: 0,
    dualityUpgReqs: 0,
    dualityRebuyables: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    },
    reqLock: {
      reality: 0,
      imaginary: 0,
      dual: 0,
    },
    perks: new Set(),
    respec: false,
    showGlyphSacrifice: false,
    showSidebarPanel: GLYPH_SIDEBAR_MODE.INVENTORY_MANAGEMENT,
    autoSort: 0,
    autoCollapse: false,
    autoAutoClean: true,
    applyFilterToPurge: false,
    moveGlyphsOnProtection: true,
    perkPoints: DC.D0,
    unlockedEC: 0,
    autoEC: true,
    lastAutoEC: DC.D0,
    partEternitied: DC.D0,
    autoAchieve: true,
    gainedAutoAchievements: true,
    automator: {
      state: {
        mode: AUTOMATOR_MODE.STOP,
        topLevelScript: 0,
        editorScript: 0,
        repeat: true,
        forceRestart: true,
        followExecution: true,
        stack: [],
      },
      scripts: {
      },
      constants: {},
      constantSortOrder: [],
      execTimer: 0,
      type: AUTOMATOR_TYPE.TEXT,
      forceUnlock: false,
      currentInfoPane: AutomatorPanels.INTRO_PAGE,
    },
    achTimer: new Decimal(),
    hasCheckedFilter: false,
  },
  blackHole: Array.range(0, 2).map(id => ({
    id,
    intervalUpgrades: DC.D0,
    powerUpgrades: DC.D0,
    durationUpgrades: DC.D0,
    phase: DC.D0,
    active: false,
    unlocked: false,
    activations: DC.D0,
  })),
  blackHolePause: false,
  blackHoleAutoPauseMode: 0,
  blackHolePauseTime: DC.D0,
  blackHoleNegative: DC.D1,
  celestials: {
    teresa: {
      pouredAmount: DC.D0,
      autoPour: false,
      quoteBits: 0,
      unlockBits: 0,
      run: false,
      bestRunAM: DC.D1,
      bestAMSet: [],
      perkShop: Array.repeat(DC.D0, 9),
      charged: new Set(),
      disCharge: false,
      chargeMode: false,
      lastRepeatedMachines: DC.D0,
      lastRepeatediM: DC.D0
    },
    effarig: {
      relicShards: DC.D0,
      unlockBits: 0,
      run: false,
      quoteBits: 0,
      glyphWeights: {
        ep: 25,
        repl: 25,
        dt: 25,
        eternities: 25
      },
      autoAdjustGlyphWeights: false,
      effarigTime: 0,
      effarigLayer: 0,
    },
    enslaved: {
      isStoring: false,
      stored: DC.D0,
      isStoringReal: false,
      storedReal: DC.D0,
      autoStoreReal: false,
      isAutoReleasing: false,
      quoteBits: 0,
      unlocks: [],
      run: false,
      completed: false,
      tesseracts: DC.D0,
      hasSecretStudy: false,
      feltEternity: false,
      progressBits: 0,
      hintBits: 0,
      hintUnlockProgress: 0,
      glyphHintsGiven: 0,
      zeroHintTime: 0
    },
    v: {
      unlockBits: 0,
      run: false,
      runExtreme: false,
      quoteBits: 0,
      runUnlocks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      goalReductionSteps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      STSpent: DC.D0,
      metaTheorems: DC.D0,
      upgrades: { 0: DC.D0 },
      runGlyphs: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
      // The -10 is for glyph count, as glyph count for V is stored internally as a negative number
      runRecords: [-10, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, 0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0],
      wantsHard: true,
      wantsExtreme: true,
      vTime: 0,
      vAuto: 0,
      vTotal: 0,
      vLayer: 0,
    },
    ra: {
      pets: {
        teresa: {
          level: 1,
          memories: DC.D0,
          memoryChunks: DC.D0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        effarig: {
          level: 1,
          memories: DC.D0,
          memoryChunks: DC.D0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        enslaved: {
          level: 1,
          memories: DC.D0,
          memoryChunks: DC.D0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        v: {
          level: 1,
          memories: DC.D0,
          memoryChunks: DC.D0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        glitchyfishys: { // I don't want to change this to glitch
          level: 1,
          memories: DC.D0,
          memoryChunks: DC.D0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        cante: {
          level: 1,
          memories: DC.D0,
          memoryChunks: DC.D0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        null: {
          level: 1,
          memories: DC.D0,
          memoryChunks: DC.D0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
      },
      alchemy: Array.repeat(0, 24)
        .map(() => ({
          amount: DC.D0,
          reaction: false
        })),
      highestRefinementValue: {
        power: DC.D0,
        infinity: DC.D0,
        time: DC.D0,
        replication: DC.D0,
        dilation: DC.D0,
        effarig: DC.D0
      },
      quoteBits: 0,
      momentumTime: DC.D0,
      unlocks: [],
      run: false,
      charged: new Set(),
      disCharge: false,
      peakGamespeed: DC.D1,
      petWithRemembrance: ""
    },
    laitela: {
      darkMatter: DC.D0,
      maxDarkMatter: DC.D0,
      run: false,
      quoteBits: 0,
      dimensions: Array.range(0, 8).map(() =>
        ({
          amount: DC.D0,
          intervalUpgrades: DC.D0,
          powerDMUpgrades: DC.D0,
          powerDEUpgrades: DC.D0,
          realDiff: DC.D0,
          ascensionCount: DC.D0
        })),
      entropy: DC.D0,
      thisCompletion: new Decimal(3600),
      fastestCompletion: new Decimal(3600),
      difficultyTier: 0,
      upgrades: {},
      darkMatterMult: DC.D1,
      darkEnergy: DC.D0,
      singularitySorting: {
        displayResource: 0,
        sortResource: 0,
        showCompleted: 0,
        sortOrder: 0,
      },
      singularities: DC.D0,
      singularityCapIncreases: DC.D0,
      lastCheckedMilestones: DC.D0,
      milestoneGlow: false,
      hadronizes: 0,
      hadrons: {
        total: 0,
        light: 0,
        dark: 0,
        exotic: 0,
        trueTotal: 0,
        totalLight: 0,
        totalDark: 0,
        totalExotic: 0
      }
    },
    pelle: {
      doomed: false,
      joined: false,
      upgrades: new Set(),
      remnants: DC.D0,
      realityShards: DC.D0,
      records: {
        totalAntimatter: DC.D0,
        totalInfinityPoints: DC.D0,
        totalEternityPoints: DC.D0,
        totalEndgameAntimatter: DC.E1,
      },
      rebuyables: {
        antimatterDimensionMult: DC.D0,
        timeSpeedMult: DC.D0,
        glyphLevels: DC.D0,
        infConversion: DC.D0,
        galaxyPower: DC.D0,
        galaxyGeneratorAdditive: DC.D0,
        galaxyGeneratorMultiplicative: DC.D0,
        galaxyGeneratorAntimatterMult: DC.D0,
        galaxyGeneratorIPMult: DC.D0,
        galaxyGeneratorEPMult: DC.D0,
        galaxyGeneratorRSMult: DC.D0,
        galaxyGeneratorDTMult: DC.D0,
        galaxyGeneratorRemnantPow: DC.D0,
        galaxyGeneratorExponential: DC.D0,
        galaxyGeneratorSuperExponential: DC.D0,
      },
      rifts: {
        vacuum: {
          fill: DC.D0,
          active: false,
          reducedTo: 1
        },
        decay: {
          fill: DC.D0,
          active: false,
          percentageSpent: 0,
          reducedTo: 1
        },
        chaos: {
          fill: DC.D0,
          active: false,
          reducedTo: 1
        },
        recursion: {
          fill: DC.D0,
          active: false,
          reducedTo: 1
        },
        paradox: {
          fill: DC.D0,
          active: false,
          reducedTo: 1
        },
        glitch: {
          fill: DC.D0,
          active: false,
          reducedTo: 1
        }
      },
      progressBits: 0,
      galaxyGenerator: {
        unlocked: false,
        spentGalaxies: DC.D0,
        generatedGalaxies: DC.D0,
        phase: 0,
        sacrificeActive: false
      },
      quoteBits: 0,
      collapsed: {
        upgrades: false,
        rifts: false,
        galaxies: false,
        destruction: [false, false, false, false, false, false, false, false]
      },
      showBought: false,
      divinities: 0,
      divinity: {
        divineMatter: DC.E1,
        divineEnergy: DC.D0,
        isProducingEnergy: false,
        condenses: DC.D0,
        divineStars: DC.D0,
        partCondensed: 0,
        supernovae: DC.D0,
        nebulae: DC.D0
      },
      divinityUpgrades: new Set(),
      divinityRebuyables: [0, 0, 0, 0],
      resurgenceUpgrades: new Set(),
    },
    slabdrill: {
      isWarping: false,
      warpTick: 0,
      isCursed: false,
      unlockBits: 0,
      quoteBits: 0,
      quotes: [],
      stage: 0,
      serpentinePower: DC.D0,
      isGoodbye: false,
      goodbyeTick: 0,
      isDestroyed: false,
      hasBoughtNinthDimension: false,
      core: {
        isActive: false,
        chaosCores: 0,
        lastFound: Date.now(),
      },
      records: {},
    },
    alpha: {
      unlockBits: 0,
      run: false,
      quoteBits: 0,
      quotes: [],
      stage: 0,
      records: {
        records: { totalEndgameAntimatter: DC.E1 },
      },
    },
    glitch: {
      quoteBits: 0,
      run: false,
      tier: 0,
      riftForce: DC.D0,
      chaosCores: DC.D0,
      plynia: DC.D0,
      augment: {
        effectbits: 0,
      },
      upgrades: {
        rebuyable: [DC.D0, DC.D0, DC.D0, DC.D0, DC.D0],
        unlockbits: 0,
        broughtbits: 0,
        speedunlockbits: 0,
        speedbroughtbits: 0,
      },
      collapsed: {
        forpower: false,
        forspeed: false
      },
      rifts: {
        alpha: {
          fill: 0,
          reducedTo: 1
        },
        beta: {
          fill: 0,
          reducedTo: 1
        },
        delta: {
          fill: 0,
          reducedTo: 1
        },
        gamma: {
          fill: 0,
          reducedTo: 1
        },
        epsilon: {
          fill: 0,
          reducedTo: 1
        },
      }
    },
    cante: {
      run: false,
      quoteBits: 0,
      artificialMatter: DC.D0,
      chaoticMatter: DC.D0,
      upgradeBits: 0,
      replicatorUnlockbits: 0,
      purges: 0,
      replicators: Array.range(0, 10).map(() => ({
        bought: DC.D0,
        amount: DC.D1
      }))
    },
    null: {
      run: false,
      isUnlocked: 0,
      quoteBits: 0,
      upgradeBits: 0,
      parallax: DC.D0,
      corrupt: DC.D0,
      abyssalMatter: DC.D0,
      corruptMatter: DC.D0,
      cycle: Array.range(0, 16).map(() => ({
        bought: DC.D0,
        amount: DC.D0
      }))
    }
  },
  endgame: {
    celestialPoints: DC.D0,
    doomedParticles: DC.D0,
    celestialMatter: DC.D0,
    unnerfedCelestialMatter: DC.D0,
    celestialMatterMultiplier: { isActive: true },
    pelleDestruction: {
      achievements: new Set(),
      upgrades: new Set(),
      realityUpgrades: new Set(),
      imaginaryUpgrades: new Set(),
      celestials: new Set(),
      perks: new Set(),
      alchemy: new Set(),
      strikes: new Set()
    },
    respec: false,
    galacticPower: DC.D0,
    rebuyables: { 1: DC.D0, 2: DC.D0, 3: DC.D0, 4: DC.D0, 5: DC.D0 },
    upgradeBits: 0,
    upgReqs: 0,
    reqLock: 0,
    partRealitied: DC.D0,
    partEndgamed: DC.D0,
    expansionPacks: { areUnlocked: false, boughtPacks: new Set() },
    ethereal: {
      power: DC.D0,
      sector: DC.D1,
      isExtended: false,
      stars: {
        red: DC.D0,
        orange: DC.D0,
        yellow: DC.D0,
        green: DC.D0,
        blue: DC.D0,
        purple: DC.D0,
        white: DC.D0,
        black: DC.D0,
        gray: DC.D0
      },
      isStarPowerUnlocked: false,
      starPower: DC.D0
    },
    hypercubes: { penteracts: 0, hexeracts: 0, hepteracts: 0, octeracts: 0 },
    celDimExpansion: {
      softcapsCollapsed: false,
      totalTickBought: DC.D0,
      dimBoosts: DC.D0,
      galaxies: DC.D0,
      celestialInfinities: DC.D0,
      celestialInfinityPoints: DC.D0,
      celestialInfinityUpgrades: new Set(),
      cipMultUpgrades: DC.D0,
      partCelestialInfinityPoint: DC.D0,
      partCelestialInfinitied: 0,
      isBreakUnlocked: false,
      isBroken: false,
      celestialInfinityRebuyables: [0, 0, 0, 0, 0, 0],
      celestialEternities: DC.D0,
      celestialEternityPoints: DC.D0,
      celestialEternityUpgrades: new Set(),
      cepMultUpgrades: DC.D0,
      celestialEternityRebuyables: [0, 0, 0],
      celestialEternityPlusUpgrades: new Set()
    },
    largeHadronCollider: {
      accelerators: {
        potency: { fill: 0, active: false },
        emptiness: { fill: 0, active: false },
        cosmic: { fill: 0, active: false }
      },
      powerCores: 1,
      void: {
        isRunning: false,
        highestAntimatter: DC.E1,
        nullMatter: DC.D0,
        upgrades: new Set(),
        rebuyables: Array.repeat(0, 10),
        nullified: false,
        nullParticles: DC.D0,
        mode: 0
      }
    },
    ascension: 0,
    ascensionTimer: 0,
    overcharge: {
      isRunning: false,
      level: 1,
      completions: { bi: 0, eter: 0, chall: 0, ts: 0 },
      charged: {
        infinite: new Set(),
        eternal: new Set(),
        complex: new Set(),
        temporal: new Set()
      },
      chargesLeft: { infinite: 0, eternal: 0, temporal: 0 },
      discharge: { infinite: false, eternal: false, temporal: false },
      allowComplex: true
    },
    credits: false,
    creditsTick: 0,
    fullCompletions: 0
  },
  endgameMasteries: {
    skills: DC.D0,
    maxSkills: DC.D0,
    ggBought: DC.D0,
    cpBought: DC.D0,
    dpBought: DC.D0,
    masteries: [],
    shopMinimized: false,
    preferredPaths: [[], [], []],
    presets: Array.range(0, 6).map(() => ({ name: "", masteries: "" })),
    permanentMasteries: []
  },
  compression: {
    active: false,
    hawkingRadiation: DC.D0,
    thermalRadiation: DC.D0,
    nextThreshold: DC.E3,
    baseElectromagneticWaves: DC.D0,
    totalElectromagneticWaves: DC.D0,
    upgrades: new Set(),
    rebuyables: { 1: 0, 2: 0, 3: 0 }
  },
  expanse: { elemental: { quoteBits: 0, quotes: [] } },
  isGameEnd: false,
  tabNotifications: new Set(),
  triggeredTabNotificationBits: 0,
  tutorialState: 0,
  tutorialActive: true,
  options: {
    news: {
      enabled: true,
      repeatBuffer: 40,
      AIChance: 0,
      ENDChance: 0.5,
      StoryChance: 0,
      MatureChance: 0,
      speed: 1,
      includeAnimated: true,
      onlyVisNews: false,
    },
    notation: "Mixed scientific",
    lnotation: "Stacked Scientific",
    notationDigits: {
      comma: 5,
      notation: 9
    },
    sidebarResourceID: 0,
    retryChallenge: false,
    retryCelestial: false,
    simpleHotkeysCelestialMode: false,
    showAllChallenges: false,
    cloudEnabled: true,
    hideGoogleName: false,
    showCloudModal: true,
    forceCloudOverwrite: false,
    syncSaveIntervals: true,
    hotkeys: true,
    themeClassic: "Normal",
    themeModern: "Normal",
    updateRate: 33,
    newUI: true,
    offlineProgress: true,
    loadBackupWithoutOffline: false,
    automaticTabSwitching: true,
    respecIntoProtected: false,
    offlineTicks: 1e5,
    hibernationCatchup: true,
    statTabResources: 0,
    multiplierTab: {
      currTab: 0,
      showAltGroup: false,
      replacePowers: false,
    },
    autosaveInterval: 30000,
    showTimeSinceSave: true,
    saveFileName: "",
    exportedFileCount: 0,
    hideCompletedAchievementRows: false,
    glyphTextColors: true,
    headerTextColored: false,
    showNewGlyphIcon: true,
    showUnequippedGlyphIcon: true,
    highContrastRarity: false,
    swapGlyphColors: false,
    hideAlterationEffects: false,
    ignoreGlyphEffects: true,
    ignoreGlyphLevel: true,
    ignoreGlyphRarity: true,
    glyphBG: GLYPH_BG_SETTING.AUTO,
    glyphBorders: true,
    showHintText: {
      showPercentage: true,
      achievements: true,
      achievementUnlockStates: true,
      challenges: true,
      studies: true,
      glyphEffectDots: true,
      realityUpgrades: true,
      perks: true,
      alchemy: true,
      glyphInfoType: GlyphInfoVue.types.NONE,
      showGlyphInfoByDefault: false,
    },
    animations: {
      bigCrunch: true,
      eternity: true,
      dilation: true,
      tachyonParticles: true,
      reality: true,
      meta: true,
      background: true,
      blobSnowflakes: 16,
      blobHole: false,
      hadrons: true
    },
    confirmations: {
      armageddon: true,
      sacrifice: true,
      challenges: true,
      exitChallenge: true,
      eternity: true,
      dilation: true,
      resetReality: true,
      meta: true,
      glyphReplace: true,
      glyphSacrifice: true,
      autoClean: true,
      sacrificeAll: true,
      glyphSelection: true,
      glyphUndo: true,
      deleteGlyphSetSave: true,
      glyphRefine: true,
      bigCrunch: true,
      replicantiGalaxy: true,
      antimatterGalaxy: true,
      dimensionBoost: true,
      switchAutomatorMode: true,
      respecIAP: true,
      glitchCL: true,
      compression: true,
      overcharge: true,
    },
    awayProgress: {
      antimatter: true,
      dimensionBoosts: true,
      antimatterGalaxies: true,
      infinities: true,
      infinityPoints: true,
      replicanti: true,
      replicantiGalaxies: true,
      eternities: true,
      eternityPoints: true,
      tachyonParticles: true,
      dilatedTime: true,
      tachyonGalaxies: true,
      timeTheorems: true,
      achievementCount: true,
      realities: true,
      realityMachines: true,
      imaginaryMachines: true,
      relicShards: true,
      darkMatter: true,
      darkEnergy: true,
      singularities: true,
      celestialMemories: true,
      blackHole: true,
      realityShards: true,
      riftForce: true,
      metas: true,
      metaRelays: true,
    },
    hiddenTabBits: 0,
    hiddenSubtabBits: Array.repeat(0, 12),
    lastOpenTab: 0,
    lastOpenSubtab: Array.repeat(0, 12),
    hellInfoEntry: "",
    perkLayout: 0,
    perkPhysicsEnabled: true,
    automatorEvents: {
      newestFirst: false,
      timestampType: 0,
      maxEntries: 200,
      clearOnReality: true,
      clearOnRestart: true,
    },
    invertTTgenDisplay: false,
    autoRealityForFilter: false,
  },
  IAP: {
    STDcoins: DC.D0,
    allDimPurchases: DC.D0,
    dimPurchases: DC.D0,
    dilatedTimePurchases: DC.D0,
    replicantiPurchases: DC.D0,
    IPPurchases: DC.D0,
    EPPurchases: DC.D0,
    RMPurchases: DC.D0,
    enabled: false,
    checkoutSession: {
      id: false,
    },
  },
  glitch: {
    preinfinity: {
      upgradebits: 0
    },
    breakinfinity: {
      upgradebits: 0
    },
    eternity: {
      upgradebits: 0
    },
    reality: {
      upgradebits: 0
    },
    challengersEssence: DC.D0,
    challengerUpgradebits: 0,
    challengerUpgradeLockbits: 0,
    hardChallengerUpgradebits: 0
  },
  pelleResets: 0,
  hell: {
    isInside: false,
    stash: null,
    quoteBits: 0,
    savedOptions: null,
    // Bit 0: passive STD generation, bit 1: offline progression (upgrades that set them are not implemented yet)
    unlockBits: 0,
  },
  meta: {
    metaRelays: DC.D0,
    metas: DC.D0,
    upgrades: {
      rebuyable: [DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0],
      metaBits: 0,
    },
  },
};

export const Player = {
  defaultStart: deepmergeAll([{}, player]),

  get isInMatterChallenge() {
    return NormalChallenge(11).isRunning || InfinityChallenge(6).isRunning;
  },

  get isInAntimatterChallenge() {
    return NormalChallenge.isRunning || InfinityChallenge.isRunning;
  },

  get antimatterChallenge() {
    return NormalChallenge.current || InfinityChallenge.current;
  },

  get isInAnyChallenge() {
    return this.isInAntimatterChallenge || EternityChallenge.isRunning;
  },

  get anyChallenge() {
    return this.antimatterChallenge || EternityChallenge.current;
  },

  get canCrunch() {
    if (Enslaved.isRunning && Enslaved.BROKEN_CHALLENGES.includes(NormalChallenge.current?.id)) return false;
    const challenge = Hell.goalAntimatterChallenge;
    const goal = challenge === undefined ? DC.NUMMAX : challenge.goal;
    return player.records.thisInfinity.maxAM.gte(goal);
  },

  get canEternity() {
    return player.records.thisEternity.maxIP.gte(Player.eternityGoal);
  },

  get canMeta() {
    return Currency.antimatter.gte(Player.metaGoal) && VUnlocks.metaReset.isUnlocked;
  },

  get metaGoal() {
    return DC.PREMETAMAX;
  },

  get bestRunIPPM() {
    return GameCache.bestRunIPPM.value;
  },

  get bestRunCIPPM() {
    return GameCache.bestRunCIPPM.value;
  },

  get bestRunVSPM() {
    return GameCache.bestRunVSPM.value;
  },

  get averageRealTimePerEternity() {
    return GameCache.averageRealTimePerEternity.value;
  },

  get tickSpeedMultDecrease() {
    return GameCache.tickSpeedMultDecrease.value;
  },

  get dimensionMultDecrease() {
    return GameCache.dimensionMultDecrease.value;
  },

  get celestialTickSpeedMultDecrease() {
    return GameCache.celestialTickSpeedMultDecrease.value;
  },

  get celestialDimensionMultDecrease() {
    return GameCache.celestialDimensionMultDecrease.value;
  },

  get divineDimensionMultDecrease() {
    return GameCache.divineDimensionMultDecrease.value;
  },

  get infinityGoal() {
    const challenge = Hell.goalAntimatterChallenge;
    return challenge === undefined ? DC.NUMMAX : challenge.goal;
  },

  get infinityLimit() {
    const challenge = NormalChallenge.current || InfinityChallenge.current;
    return challenge === undefined ? DC.BEMAX : challenge.goal;
  },

  get eternityGoal() {
    const ec = Hell.goalEternityChallenge;
    return ec ? ec.currentGoal : requiredIPForEP(1);
  },

  get hasAntimatterChallengeGoal() {
    return Hell.goalAntimatterChallenge !== undefined;
  },

  get hasEternityChallengeGoal() {
    return Hell.goalEternityChallenge !== undefined;
  },

  get automatorUnlocked() {
    return AutomatorPoints.totalPoints >= AutomatorPoints.pointsForAutomator || player.reality.automator.forceUnlock ||
      (LHC.voidRunning && LHCNullUpgrade.limerick5.isBought);
  },

  resetRequirements(key) {
    const glyphCount = player.requirementChecks.reality.maxGlyphs;
    // This switch case intentionally falls through because every lower layer should be reset as well
    switch (key) {
      case "meta":
        player.requirementChecks.meta = {
          noGlyphs: false,
          maxStudies: 1000,
          noTriads: false,
        };
        break;
      case "reality":
        player.requirementChecks.reality = {
          noAM: true,
          noTriads: true,
          noPurchasedTT: true,
          // Note that these two checks below are only used in row 2, which is in principle always before the "flow"
          // upgrades in row 3 which passively generate infinities/eternities. These upgrades won't cause a lockout
          // as these requirements are only invalidated on manual infinities or eternities.
          noInfinities: true,
          noEternities: true,
          noContinuum: player.auto.disableContinuum,
          noCelMatter: !player.endgame.celestialMatterMultiplier.isActive,
          maxID1: DC.D0,
          maxStudies: 0,
          // This only gets set to the correct value when Glyphs.updateMaxGlyphCount is called, which always happens
          // before this part of the code is reached in the Reality reset. Nevertheless, we want to keep its old value.
          maxGlyphs: glyphCount,
          slowestBH: BlackHoles.areNegative ? player.blackHoleNegative : DC.D1,
        };
      // eslint-disable-next-line no-fallthrough
      case "eternity":
        player.requirementChecks.eternity = {
          onlyAD1: true,
          onlyAD8: true,
          noAD1: true,
          noRG: true,
        };
      // eslint-disable-next-line no-fallthrough
      case "infinity":
        player.requirementChecks.infinity = {
          maxAll: false,
          noSacrifice: true,
          noAD8: true,
        };
        break;
      default:
        throw Error("Unrecognized prestige layer for requirement reset");
    }
  }
};

export function guardFromNaNValues(obj) {
  function isObject(ob) {
    return ob !== null && typeof ob === "object" && !(ob instanceof Decimal);
  }

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (key === "automator") continue;

    let value = obj[key];
    if (isObject(value)) {
      guardFromNaNValues(value);
      continue;
    }

    if (typeof value === "number") {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        // eslint-disable-next-line no-loop-func
        set: function guardedSetter(newValue) {
          if (newValue === null || newValue === undefined) {
            throw new Error("null/undefined player property assignment");
          }
          if (typeof newValue !== "number" && !(newValue instanceof Decimal)) {
            throw new Error("Non-Number assignment to Number player property");
          }
          if (!Decimal.isFinite(newValue)) {
            throw new Error("NaN player property assignment");
          }
          value = newValue;
        }
      });
    }

    if (value instanceof Decimal) {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        // eslint-disable-next-line no-loop-func
        set: function guardedSetter(newValue) {
          if (newValue === null || newValue === undefined) {
            throw new Error("null/undefined player property assignment");
          }
          if (!(newValue instanceof Decimal)) {
            throw new Error("Non-Decimal assignment to Decimal player property");
          }
          if (!isFinite(newValue.mag) || !isFinite(newValue.sign) || !isFinite(newValue.layer)) {
            throw new Error("NaN player property assignment");
          }
          value = newValue;
        }
      });
    }
  }
}
