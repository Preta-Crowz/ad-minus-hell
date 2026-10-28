import { DC } from "./constants";
import { deepmergeAll } from "@/utility/deepmerge";
import { migrations } from "./storage/migrations";

// Hell is a second, separate save. Whichever world is not currently being played is stored in `player.hell.stash`,
// and entering or leaving Hell swaps the two. Only these top-level properties are shared between both worlds.
const SHARED_KEYS = ["options", "hell"];

// Starting powers of Infinity and Time Dimensions in NG-1, per tier
const NG1_INFINITY_POWERS = [1, 1, 1, 0.0000125, 0.01, 0.015, 0.01, 0.01];
const NG1_TIME_POWERS = [0.01, 0.03, 0.025, 0.02, 1e-5, 5e-6, 3e-6, 2e-6];

export const Hell = {
  get isInside() {
    return player.hell.isInside;
  },

  get hasVisited() {
    return this.isInside || player.hell.stash !== null;
  },

  get isPassiveSTDLocked() {
    return this.isInside && ((player.hell.unlockBits ?? 0) & 1) === 0;
  },

  get isOfflineLocked() {
    return this.isInside && ((player.hell.unlockBits ?? 0) & 2) === 0;
  },

  infinityDimensionPower(tier) {
    return this.isInside ? new Decimal(NG1_INFINITY_POWERS[tier - 1]) : DC.D1;
  },

  timeDimensionPower(tier) {
    if (!this.isInside) return DC.D1;
    const nerf = tier > 1 || !Achievement(12).isUnlocked ? 0.01 : 1;
    return new Decimal(NG1_TIME_POWERS[tier - 1]).times(nerf);
  },

  // NG-4: Time Dimensions are bought with antimatter, need a 1st Dimension, and have their own costs
  get timeDimensionCurrency() {
    return this.isInside ? Currency.antimatter : Currency.eternityPoints;
  },

  // Antimatter above the Infinity cap cannot be spent on Time Dimensions
  get timeDimensionBudget() {
    const value = this.timeDimensionCurrency.value;
    return this.isInside ? Decimal.min(value, DC.NUMMAX) : value;
  },

  get canBuyTimeDimensions() {
    return !this.isInside || AntimatterDimension(1).amount.gte(1);
  },

  timeDimensionCost(tier, bought) {
    return Decimal.pow(this.timeDimensionCostMults[tier], bought).times(this.timeDimensionBaseCosts[tier]);
  },

  get timeDimensionBaseCosts() {
    return [null, 10, 20, 40, 80, 160, 1e8, 1e12, 1e18];
  },

  get timeDimensionCostMults() {
    return [null, 1.5, 2, 3, 20, 150, 1e5, 3e6, 1e8];
  },

  // How many Time Dimensions can be bought in a row with the given amount of antimatter, and what that costs
  bulkTimeDimensions(tier, bought, budget) {
    const mult = this.timeDimensionCostMults[tier];
    const first = this.timeDimensionCost(tier, bought);
    if (budget.lt(first)) return { count: DC.D0, cost: DC.D0 };
    const count = budget.div(first).times(mult - 1).add(1).log10().div(Math.log10(mult)).floor();
    const cost = Decimal.pow(mult, count).sub(1).div(mult - 1).times(first);
    return { count, cost };
  },

  // NG-4: the Time Dilation penalty is stronger (exponent 0.7 instead of 0.75)
  get dilationExponentOffset() {
    return this.isInside ? -0.05 : 0;
  },

  // Ghost of Quantum (Big Rip): Infinity Challenges 2, 6, 7 and 8 run on top of the trapped challenge
  isBigRipChallenge(id) {
    return this.isInside && (id === 2 || id === 6 || id === 7 || id === 8);
  },

  // IC6 and IC8 also apply to Infinity and Time Dimensions (Antimatter Dimensions handle them already)
  get bigRipDimensionMultiplier() {
    if (!this.isInside) return DC.D1;
    return InfinityChallenge(8).effectValue.div(InfinityChallenge(6).effectValue);
  },

  // Challenges and Dilation that Hell forces on the player. Manual entering and exiting is disabled while any exist.
  get trappedInfinityChallenge() {
    return this.isInside ? 3 : 0;
  },

  get isTrappedInDilation() {
    return this.isInside;
  },

  get isTrapped() {
    return this.isInside && (this.trappedInfinityChallenge > 0 || this.isTrappedInDilation);
  },

  // Challenges Hell traps you in don't change the Infinity and Eternity goals; only a challenge started on top does
  get goalAntimatterChallenge() {
    const normal = NormalChallenge.current;
    if (normal) return normal;
    const infinity = InfinityChallenge.current;
    if (infinity && this.isInside && infinity.id === this.trappedInfinityChallenge) return undefined;
    return infinity;
  },

  get goalEternityChallenge() {
    const ec = EternityChallenge.current;
    return ec && this.isInside && ec.id === 12 ? undefined : ec;
  },

  // Normal Challenges Hell forces on the player (NG-5)
  get trappedNormalChallenges() {
    return this.isInside ? [2, 4, 6, 7, 12] : [];
  },

  // Hell ignores the Infinity-count requirement for Normal Challenges
  get normalChallengesAlwaysUnlocked() {
    return this.isInside;
  },

  // Completing or crunching out of a trap clears it, so it gets re-applied every tick
  enforceTraps() {
    if (!this.isInside) return;
    // Eternity and Reality resets would otherwise un-break Infinity and Eternity
    if (!player.break) player.break = true;
    if (!player.break2) player.break2 = true;
    if (player.challenge.infinity.current !== this.trappedInfinityChallenge) {
      player.challenge.infinity.current = this.trappedInfinityChallenge;
    }
    if (this.isTrappedInDilation && !player.dilation.active) player.dilation.active = true;
    if (this.isTrappedInTeresa && !player.celestials.teresa.run) player.celestials.teresa.run = true;
    if (this.isTrappedInEffarig && !player.celestials.effarig.run) player.celestials.effarig.run = true;
    if (this.isTrappedInNameless && !player.celestials.enslaved.run) player.celestials.enslaved.run = true;
    if (this.isTrappedInV && !player.celestials.v.run) player.celestials.v.run = true;
    if (this.isTrappedInLaitela && !player.celestials.laitela.run) player.celestials.laitela.run = true;
    if (this.isTrappedInV && !player.celestials.v.runExtreme) player.celestials.v.runExtreme = true;
    if (this.isTrappedInRa && !player.celestials.ra.run) player.celestials.ra.run = true;
    if (this.isTrappedInRa && !player.dimensionBoosts.eq(4)) player.dimensionBoosts = new Decimal(4);
    if (this.isTrappedInGlitch && !player.celestials.glitch.run) player.celestials.glitch.run = true;
    if (this.isTrappedInAlpha && !player.celestials.alpha.run) player.celestials.alpha.run = true;
    if (this.isTrappedInAlpha && !player.disablePostReality) player.disablePostReality = true;
    if (!player.compression.active) player.compression.active = true;
    // The Cursed Reality dimension limit reads this timer; 38000 allows all 8 Dimensions
    if (player.celestials.slabdrill.goodbyeTick !== 38000) player.celestials.slabdrill.goodbyeTick = 38000;
    if (!player.endgame.overcharge.isRunning) player.endgame.overcharge.isRunning = true;
    if (player.challenge.eternity.current !== 12) player.challenge.eternity.current = 12;
    this.forceCursedGlyphs();
    this.completeTrappedChallenges();
  },

  // Trapped challenges are marked as completed as soon as their goal is reached, without needing to leave them
  completeTrappedChallenges() {
    const maxAM = player.records.thisInfinity.maxAM;
    for (const id of this.trappedNormalChallenges) {
      const challenge = NormalChallenge(id);
      if (!challenge.isCompleted && maxAM.gte(challenge.goal)) challenge.complete();
    }
    if (this.trappedInfinityChallenge > 0) {
      const challenge = InfinityChallenge(this.trappedInfinityChallenge);
      if (!challenge.isCompleted && maxAM.gte(challenge.goal)) challenge.complete();
    }
    const ec = EternityChallenge(12);
    while (!ec.isFullyCompleted && ec.canBeCompleted) ec.addCompletion(false);
  },

  // Fragmentation of Alpha: Hell keeps Alpha's Reality running, with everything after Reality disabled.
  // Alpha's layers never advance inside Hell, so only its first layer's effects apply.
  get isTrappedInAlpha() {
    return this.isInside;
  },

  // Fragmentation of Glitch: Hell keeps Glitch's Reality running and forces Cursed Glyphs to stay equipped
  get isTrappedInGlitch() {
    return this.isInside;
  },

  forceCursedGlyphs() {
    if (!this.isTrappedInGlitch) return;
    const equipped = () => Glyphs.active.filter(g => g && g.type === "cursed").length;
    let guard = 10;
    while (equipped() < Glitch.forceGlyphs && guard-- > 0) {
      let glyph = Glyphs.inventory.find(g => g && g.type === "cursed");
      if (!glyph) {
        Glyphs.addToInventory(GlyphGenerator.cursedGlyph());
        glyph = Glyphs.inventory.find(g => g && g.type === "cursed");
      }
      if (!glyph) return;
      const before = equipped();
      Glyphs.equip(glyph, Glyphs.active.indexOf(null));
      if (equipped() === before) return;
    }
  },

  // Fragmentation of Lai'tela: Hell keeps Lai'tela's Reality running
  get isTrappedInLaitela() {
    return this.isInside;
  },

  // Higher Dimensions stop producing as antimatter grows: one tier is lost per 1e100 antimatter, keeping at least the 1st
  get laitelaMaxDimension() {
    const lost = Math.floor(Currency.antimatter.value.max(1).log10().toNumber() / 100);
    return Math.max(1, 8 - lost);
  },

  // Fragmentation of V: Hell keeps V's Reality running
  get isTrappedInV() {
    return this.isInside;
  },

  // Fragmentation of Ra: Hell keeps Ra's Reality running; Ra's Reality already stops Dimension Boosts
  // and fixes the Tickspeed multiplier, and Hell holds the Boost count at 4
  get isTrappedInRa() {
    return this.isInside;
  },

  // Fragmentation of The Nameless Ones: Hell keeps The Nameless Ones' Reality running
  get isTrappedInNameless() {
    return this.isInside;
  },

  // Fragmentation of Effarig: Hell keeps Effarig's Reality running
  get isTrappedInEffarig() {
    return this.isInside;
  },

  // Fragmentation of Teresa: Hell keeps Teresa's Reality running
  get isTrappedInTeresa() {
    return this.isInside;
  },

  // NG-5: game speed is reduced like in Eternity Challenge 12, improvable with Break Infinity upgrades
  get gameSpeedMult() {
    if (!this.isInside) return 1;
    let mult = 1 / 1000;
    if (BreakInfinityUpgrade.hellGameSpeed1.isBought) mult *= 10;
    if (BreakInfinityUpgrade.hellGameSpeed2.isBought) mult *= 10;
    return mult;
  },

  // NG-5: only 6 Dimensions of each kind; Infinity Dimensions are bought with antimatter and need a 1st Dimension
  get infinityDimensionCurrency() {
    return this.isInside ? Currency.antimatter : Currency.infinityPoints;
  },

  canBuyInfinityDimension(tier) {
    return tier <= 6 && AntimatterDimension(1).amount.gte(1);
  },

  get infinityDimensionBaseCosts() {
    return [null, 10, 100, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280];
  },

  get infinityDimensionCostMults() {
    return [null, 10, 100, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280];
  },

  // NG-4: Galaxies become Remote at 6 and each Remote Galaxy multiplies the requirement by 1.2 instead of 1.002
  get remoteGalaxyStart() {
    return new Decimal(6 + (BreakInfinityUpgrade.hellRemoteStart.isBought ? 14 : 0));
  },

  get remoteGalaxyBase() {
    return this.isInside ? 1.2 : 1.002;
  },

  // Antimatter Galaxies lose 70 from their base requirement
  get galaxyBaseCostReduction() {
    return this.isInside ? 70 : 0;
  },

  get noCostReductions() {
    return this.isInside && InfinityChallenge(9).isRunning;
  },

  // NG-2 Eternity Challenge goals as [initial exponent, exponent increase per completion]
  get ecGoals() {
    if (!this.isInside || Pelle.isDoomed) return {};
    return {
      1: [1800, 400], 2: [1125, 250], 3: [1025, 100], 4: [2575, 525], 5: [600, 300], 6: [850, 225],
      7: [1450, 530], 8: [2100, 500], 9: [2250, 300], 10: [2205, 175], 11: [35000, 3250], 12: [17000, 1500]
    };
  },

  isBreakUpgradeActive(upgrade) {
    return this.isInside && !this.noCostReductions && upgrade.isBought;
  },

  get dimboostCostDiscount() {
    return (this.isBreakUpgradeActive(BreakInfinityUpgrade.hellDimboostCost) ? 1 : 0) +
      (this.isBreakUpgradeActive(BreakInfinityUpgrade.hellDimboostCost2) ? 0.5 : 0);
  },

  get galaxyCostDiscount() {
    return (this.isBreakUpgradeActive(BreakInfinityUpgrade.hellGalaxyCost) ? 5 : 0) +
      (this.isBreakUpgradeActive(BreakInfinityUpgrade.hellGalaxyCost2) ? 3 : 0);
  },

  // NG-4: Dimension Boosts start at 10 Dimensions and cost 5 more per boost
  get dimboostBaseReduction() {
    return this.isInside ? 10 : 0;
  },

  get dimboostCostIncrease() {
    return this.isInside ? 5 : 0;
  },

  get galaxyStrengthMult() {
    return this.isInside && BreakInfinityUpgrade.hellGalaxyStrength.isBought ? 1.15 : 1;
  },

  get infinityDimensionCostDivisor() {
    return this.isInside && BreakInfinityUpgrade.hellIDCostDiv.isBought ? 50 : 1;
  },

  // NG-3: buying ten of a Dimension gives 1x instead of 2x as its base, and Normal Dimensions are 10x slower again
  get buyTenBase() {
    return this.isInside ? DC.D1 : DC.D2;
  },

  // NG-3: "Is this safe?" also multiplies Infinity Point gain by the square of your 8th Dimensions
  get ipAchievementMult() {
    if (!this.isInside || !Achievement(95).isEffectActive) return DC.D1;
    const amount = AntimatterDimension(8).amount;
    return amount.gt(5000) ? amount.pow(2) : DC.D1;
  },

  get ic3PerGalaxy() {
    return this.isInside ? 0.002 : 0.005;
  },

  get dimensionProductionMult() {
    return new Decimal(0.0001);
  },

  get infinityUpgradesPostDilation() {
    return this.isInside && (InfinityChallenge(9).isRunning || InfinityChallenge(9).isCompleted);
  },

  // IC10 running: cost increases are square-rooted; completed: reduced to the 0.9 power
  dimensionCostIncrease(value) {
    if (!this.isInside) return value;
    const base = Decimal.pow(value, 1.25);
    if (InfinityChallenge(10).isRunning) return Decimal.pow(base, 0.5);
    if (InfinityChallenge(10).isCompleted) return Decimal.pow(base, 0.9);
    return base;
  },

  tickspeedCostIncrease(value) {
    if (!this.isInside) return value;
    if (InfinityChallenge(10).isRunning) return Decimal.pow(value, 0.5);
    if (InfinityChallenge(10).isCompleted) {
      const galaxyEffect = 1 + Math.pow(Decimal.max(player.galaxies, 0).toNumber(), 0.7) / 10;
      return Decimal.pow(value, 0.9 / galaxyEffect);
    }
    return value;
  },

  get costIncreaseThreshold() {
    return this.isInside && InfinityChallenge(10).isRunning ? DC.D1 : DC.NUMMAX;
  },

  preconfigure(save) {
    this.applySquareCubic(save);
    this.applyNGMinus1(save);
    this.applyNGMinus2(save);
    return save;
  },

  applyNGMinus2(save) {
    save.challenge.infinity.current = 3;
    save.dilation.active = true;
  },

  applySquareCubic(save) {
    save.break = true;
    save.break2 = true;
  },

  applyNGMinus1(save) {
    save.galaxies = new Decimal(-1);
    save.dimensions.antimatter[0].bought = new Decimal(5);
    save.dimensions.antimatter[0].amount = new Decimal(5);
    save.infinities = new Decimal(990);
    save.infinitiesBanked = new Decimal(-1000);
    save.partInfinityPoint = -1e300;
    save.partInfinitied = -1e8;
    save.replicanti.interval = new Decimal(5000);
    save.achievementBits[1] |= 1 << 1;
    save.achievementBits[7] |= 1 << 4;
    save.eternities = new Decimal(-20);
    save.timestudy.theorem = new Decimal(-6);
    save.eternityChalls.eterc1 = -6;
    save.dilation.tachyonParticles = new Decimal(2000);
    save.dilation.rebuyables[2] = new Decimal(1);
  },

  // Re-applies the NG-1 starting values after a reset; each layer also restores those of the layers below it
  applyNGMinus1Reset(layer) {
    if (!this.isInside) return;
    player.galaxies = new Decimal(-1);
    const ad1 = player.dimensions.antimatter[0];
    ad1.bought = new Decimal(5);
    ad1.amount = new Decimal(5);
    if (layer === "infinity") return;

    player.infinities = new Decimal(990);
    player.partInfinityPoint = -1e300;
    player.partInfinitied = -1e8;
    player.replicanti.interval = new Decimal(5000);
    if (layer === "eternity") return;

    player.infinitiesBanked = new Decimal(-1000);
    player.achievementBits[1] |= 1 << 1;
    player.achievementBits[7] |= 1 << 4;
    player.eternities = new Decimal(-20);
    player.timestudy.theorem = new Decimal(-6);
    player.eternityChalls.eterc1 = -6;
    player.dilation.tachyonParticles = new Decimal(2000);
    player.dilation.rebuyables[2] = new Decimal(1);
  },

  createFreshSave() {
    const save = deepmergeAll([{}, Player.defaultStart]);
    save.records.gameCreatedTime = Date.now();
    // The defaults are already current; without this, migrations meant for old saves would run on them
    save.version = Math.max(...Object.keys(migrations.patches).map(Number));
    return this.preconfigure(save);
  },

  // Animations and confirmations are forced off inside Hell; the outside values are kept and restored on exit
  disableOptions(options) {
    const saved = {
      animations: { ...options.animations },
      confirmations: { ...options.confirmations }
    };
    for (const group of ["animations", "confirmations"]) {
      for (const key of Object.keys(options[group])) {
        if (typeof options[group][key] === "boolean") options[group][key] = false;
      }
    }
    return saved;
  },

  restoreOptions(options, saved) {
    if (!saved) return;
    Object.assign(options.animations, saved.animations);
    Object.assign(options.confirmations, saved.confirmations);
  },

  swapWorld() {
    const goingInside = !this.isInside;
    const leaving = deepmergeAll([{}, player]);
    for (const key of SHARED_KEYS) delete leaving[key];

    const incoming = player.hell.stash ?? this.createFreshSave();
    for (const key of SHARED_KEYS) incoming[key] = player[key];
    incoming.hell = {
      isInside: goingInside,
      stash: leaving,
      quoteBits: player.hell.quoteBits,
      unlockBits: player.hell.unlockBits ?? 0,
      savedOptions: goingInside ? this.disableOptions(incoming.options) : null
    };
    if (!goingInside) this.restoreOptions(incoming.options, player.hell.savedOptions);
    incoming.lastUpdate = Date.now();

    Modal.hideAll();
    GameStorage.loadPlayerObject(incoming);
    GameStorage.save(true);
    Tab.hell.gate.show(true);
  },

  // Erases the Hell world. Inside, a fresh Hell is loaded; outside, the stored Hell save is deleted
  reset() {
    if (!this.isInside) {
      player.hell.stash = null;
      GameStorage.save(true);
      return;
    }
    const incoming = this.createFreshSave();
    for (const key of SHARED_KEYS) incoming[key] = player[key];
    incoming.hell = {
      isInside: true,
      stash: player.hell.stash,
      quoteBits: player.hell.quoteBits,
      unlockBits: player.hell.unlockBits ?? 0,
      savedOptions: player.hell.savedOptions
    };
    incoming.lastUpdate = Date.now();

    Modal.hideAll();
    GameStorage.loadPlayerObject(incoming);
    GameStorage.save(true);
    Tab.hell.gate.show(true);
  },

  enter() {
    if (!this.isInside) this.swapWorld();
  },

  exit() {
    if (this.isInside) this.swapWorld();
  }
};
