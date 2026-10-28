import * as ADNotations from "adnot-beport-small";

import { AutomatorPanels } from "@/components/tabs/automator/AutomatorDocs";
import { GlyphInfo } from "@/core/secret-formula/reality/core-glyph-info";

import { AUTOMATOR_MODE, AUTOMATOR_TYPE } from "./automator/automator-backend";
import { deepmergeAll } from "@/utility/deepmerge";
import { GlyphTypes } from "./glyph-effects";

export function isEndgameAvailable() {
  const totalEndgameAntimatter = player.celestials.pelle.records.totalEndgameAntimatter ?? DC.D0;
  return totalEndgameAntimatter.add(1).log10().gte(9e15);
}

function updateEndgameRecords() {
  player.records.permanent ??= {};
  player.records.permanent.maxCP ??= DC.D0;
  player.records.permanent.maxDP ??= DC.D0;
  player.records.bestEndgame.bestCPmin =
    player.records.bestEndgame.bestCPmin.max(player.records.thisEndgame.bestCPmin);
  player.records.bestEndgame.bestDPmin =
    player.records.bestEndgame.bestDPmin.max(player.records.thisEndgame.bestDPmin);
  player.records.bestEndgame.time = Decimal.min(player.records.thisEndgame.time, player.records.bestEndgame.time);
  if (player.records.thisEndgame.realTime < player.records.bestEndgame.realTime) {
    player.records.bestEndgame.realTime = Math.max(player.records.thisEndgame.realTime, 1);
  }
  if (gainedCelestialPoints().gt(player.records.permanent.maxCP)) player.records.permanent.maxCP = gainedCelestialPoints();
  if (gainedDoomedParticles().gt(player.records.permanent.maxDP)) player.records.permanent.maxDP = gainedDoomedParticles();
}

export function getTesseractEndgameMultiplier() {
  const effectiveCount = Tesseracts.effectiveCount;
  const tesseractBase = Decimal.min(effectiveCount, 1000)
    .times(Decimal.max(effectiveCount.max(1).log10().sub(2), 1))
    .add(1)
    .log10();
  return Decimal.pow(tesseractBase, Decimal.log10(player.endgames.add(1))).add(1).floor();
}

function giveEndgameRewards() {
  let endgameMultiplier = DC.D1.times((ExpansionPack.enslavedPack.isBought && !player.disablePostReality)
    ? getTesseractEndgameMultiplier()
    : 1).times(Math.pow(1.33, Alpha.currentStage));
  if (DivinityMilestone.firstDivine.isReached && !player.disablePostReality) endgameMultiplier = endgameMultiplier.times(10);
  endgameMultiplier = endgameMultiplier.times(DivineDimensions.conversionFormula1);
  Currency.celestialPoints.add(gainedCelestialPoints());
  Currency.doomedParticles.add(gainedDoomedParticles());
  updateEndgameRecords();
  Currency.endgames.add(endgameMultiplier);
  addEndgameTime(
    player.records.thisEndgame.time,
    player.records.thisEndgame.realTime,
    gainedCelestialPoints(),
    gainedDoomedParticles(),
    endgameMultiplier
  );
}

function lockRedundantChallengerUpgrades() {
  for (const upgrade of ChallengerUpgrades.all) {
    if (upgrade.isUseless) player.glitch.challengerUpgradeLockbits |= (1 << upgrade.id);
  }
}

export const Endgame = {
  challengersEssenceGain() {
    if (!Pelle.isDoomed || player.antimatter.lt(DC.E9E15) ||
      !player.celestials.pelle.records.totalAntimatter.gt(DC.PelleMax)) return DC.D0;
    return DC.D5.timesEffectsOf(
      HardChallengerUpgrade(0),
      HardChallengerUpgrade(3),
      GlitchSpeedUpgrade(6),
      HardChallengerUpgrade(7)
    );
  },
  hotkeyReset() {
    if (!Pelle.isDoomed || player.antimatter.lt(DC.E9E15)) return false;
    if (Slabdrill.isCursed) return false;
    if (Slabdrill.isDestroyed && !player.celestials.slabdrill.hasBoughtNinthDimension) return;
    this.newEndgame();
    return true;
  },
  resetNoReward(override = false) {
    if (Slabdrill.isCursed && !override) return;
    if (Slabdrill.isDestroyed && !player.celestials.slabdrill.hasBoughtNinthDimension && !override) return;
    lockRedundantChallengerUpgrades();
    GameEnd.creditsClosed = false;
    GameEnd.creditsEverClosed = false;
    player.isGameEnd = false;
    // We set this ASAP so that the AD tab is immediately recreated without END formatting, and any lag which could
    // happen is instead hidden by the overlay from the credits rollback
    player.celestials.pelle.doomed = false;

    // This is where we "confirm" a speedrun as completed and store all its information into the previous run prop
    // before resetting everything.
    const speedrun = player.speedrun;
    if (speedrun.isActive) {
      player.speedrun.previousRuns[player.records.fullGameCompletions + 1] = {
        isSegmented: speedrun.isSegmented,
        usedSTD: speedrun.usedSTD,
        startDate: speedrun.startDate,
        name: speedrun.name,
        offlineTimeUsed: speedrun.offlineTimeUsed,
        records: [...speedrun.records],
        achievementTimes: JSON.parse(JSON.stringify(speedrun.achievementTimes)),
        seedSelection: speedrun.seedSelection,
        initialSeed: speedrun.initialSeed,
      };

      // For the sake of keeping a bounded savefile size, we only keep a queue of the last 100 full runs. The earliest
      // this will feasibly become an issue from nonstop speedruns is around 2030; I guess we can revisit it at that
      // point if we really need to, but I suspect this limit should be high enough
      const prevRunIndices = Object.keys(speedrun.previousRuns).map(k => Number(k));
      if (prevRunIndices.length > 100) player.speedrun.previousRuns[prevRunIndices.min()] = undefined;
    }
    EventHub.dispatch(GAME_EVENT.ENDGAME_RESET_BEFORE);

    // Modify beaten-game quantities before doing a carryover reset
    if (player.endgame.respec) {
      respecEndgameMasteries();
      player.endgame.respec = false;
    }
    if (player.celestials.teresa.disCharge) {
      disChargeAllPerkUpgrades();
      player.celestials.teresa.disCharge = false;
    }
    if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ENDGAME) {
      player.disablePostReality = false;
      player.endgame.overcharge.allowComplex = true;
    }
    if (player.endgame.overcharge.discharge.infinite) {
      disChargeAllBreakUpgrades();
    }
    if (player.endgame.overcharge.discharge.eternal) {
      disChargeAllEternityUpgrades();
    }
    this.resetStuff();

    // Add Glyphs after other Glyphs are purged
    if (EndgameMastery(71).isBought) {
      for (let slotNum = 0; slotNum < Glyphs.activeSlotCount; slotNum++) {
        for (const type of GlyphInfo.basicGlyphTypes) Glyphs.addToInventory(GlyphGenerator.endgameGlyph(type));
      }
      if (EffarigUnlock.endgame?.canBeApplied) {
        Glyphs.addToInventory(GlyphGenerator.endgameGlyph("effarig"));
        Glyphs.addToInventory(GlyphGenerator.endgameGlyph("effarig"));
        Glyphs.addToInventory(GlyphGenerator.realityGlyph(new Decimal(AlchemyResource.reality.effectValue)));
        Glyphs.addToInventory(GlyphGenerator.realityGlyph(new Decimal(AlchemyResource.reality.effectValue)));
      }
    }
    EventHub.dispatch(GAME_EVENT.ENDGAME_RESET_AFTER);

    GameEnd.removeAdditionalEnd = true;
  },
  newEndgame() {
    if (Slabdrill.isCursed) return;
    if (Slabdrill.isDestroyed && !player.celestials.slabdrill.hasBoughtNinthDimension) return;
    lockRedundantChallengerUpgrades();
    const isRewardingEndgame = Pelle.isDoomed && player.antimatter.gte(DC.E9E15);
    const isPelleCompletion = isRewardingEndgame && player.celestials.pelle.records.totalAntimatter.gt(DC.PelleMax);
    const remnantsOnEndgame = isRewardingEndgame && !isPelleCompletion && Pelle.remnantsGain.gte(1)
      ? Pelle.cel.remnants.add(Pelle.remnantsGain)
      : DC.D0;
    const challengersEssenceOnEndgame = this.challengersEssenceGain();
    GameEnd.creditsClosed = false;
    GameEnd.creditsEverClosed = false;
    player.isGameEnd = false;
    // We set this ASAP so that the AD tab is immediately recreated without END formatting, and any lag which could
    // happen is instead hidden by the overlay from the credits rollback
    player.celestials.pelle.doomed = false;

    // This is where we "confirm" a speedrun as completed and store all its information into the previous run prop
    // before resetting everything.
    const speedrun = player.speedrun;
    if (speedrun.isActive) {
      player.speedrun.previousRuns[player.records.fullGameCompletions + 1] = {
        isSegmented: speedrun.isSegmented,
        usedSTD: speedrun.usedSTD,
        startDate: speedrun.startDate,
        name: speedrun.name,
        offlineTimeUsed: speedrun.offlineTimeUsed,
        records: [...speedrun.records],
        achievementTimes: JSON.parse(JSON.stringify(speedrun.achievementTimes)),
        seedSelection: speedrun.seedSelection,
        initialSeed: speedrun.initialSeed,
      };

      // For the sake of keeping a bounded savefile size, we only keep a queue of the last 100 full runs. The earliest
      // this will feasibly become an issue from nonstop speedruns is around 2030; I guess we can revisit it at that
      // point if we really need to, but I suspect this limit should be high enough
      const prevRunIndices = Object.keys(speedrun.previousRuns).map(k => Number(k));
      if (prevRunIndices.length > 100) player.speedrun.previousRuns[prevRunIndices.min()] = undefined;
    }
    EventHub.dispatch(GAME_EVENT.ENDGAME_RESET_BEFORE);

    // Modify beaten-game quantities before doing a carryover reset
    if (player.antimatter.gte(DC.E9E15)) {
      giveEndgameRewards();
      updateEndgameRecords();
      GlyphAppearanceHandler.unlockSet();
    }
    if (player.endgame.respec) {
      respecEndgameMasteries();
      player.endgame.respec = false;
    }
    if (player.celestials.teresa.disCharge) {
      disChargeAllPerkUpgrades();
      player.celestials.teresa.disCharge = false;
    }
    if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ENDGAME) {
      player.disablePostReality = false;
      player.endgame.overcharge.allowComplex = true;
      if (!EffarigUnlock.endgame?.isUnlocked) {
        EffarigUnlock.endgame?.unlock();
      }
      Effarig.quotes.beatEndgame.show();
    }
    if (player.endgame.overcharge.discharge.infinite) {
      disChargeAllBreakUpgrades();
    }
    if (player.endgame.overcharge.discharge.eternal) {
      disChargeAllEternityUpgrades();
    }
    this.resetStuff();

    // Add Glyphs after other Glyphs are purged
    if (EndgameMastery(71).isBought) {
      for (let slotNo = 0; slotNo < Glyphs.activeSlotCount; slotNo++) {
        for (const type of GlyphInfo.basicGlyphTypes) Glyphs.addToInventory(GlyphGenerator.endgameGlyph(type));
      }
      if (EffarigUnlock.endgame?.canBeApplied) {
        Glyphs.addToInventory(GlyphGenerator.endgameGlyph("effarig"));
        Glyphs.addToInventory(GlyphGenerator.endgameGlyph("effarig"));
        Glyphs.addToInventory(GlyphGenerator.realityGlyph(new Decimal(AlchemyResource.reality.effectValue)));
        Glyphs.addToInventory(GlyphGenerator.realityGlyph(new Decimal(AlchemyResource.reality.effectValue)));
      }
    }
    if (remnantsOnEndgame.gt(0)) Currency.remnants.add(remnantsOnEndgame);
    if (challengersEssenceOnEndgame.gt(0)) Currency.challengersEssence.add(challengersEssenceOnEndgame);
    if (isPelleCompletion) {
      player.pelleResets++;
      Achievement(188).unlock();
    }
    EventHub.dispatch(GAME_EVENT.ENDGAME_RESET_AFTER);

    // The ending animation ends at 12.5, although the value continues to increase after that. We set it to a bit above
    // 12.5 when we start the rollback animation to hide some of the unavoidable lag from all the reset functions
    GameEnd.removeAdditionalEnd = true;
    GameEnd.additionalEnd = 15;
    // Without the delay, this causes the saving (and its notification) to occur during the credits rollback
    if (!PlayerProgress.endgameUnlocked()) {
      setTimeout(() => GameStorage.save(), 10000);
    }
  },
  // Reset the game, but carry over some post-completion stats. We also call this when starting a speedrun, so make sure
  // any stats which are updated due to completion happen in startNewGame() instead of in here
  resetStuff() {
    let remains = 0;
    if (ImaginaryUpgrade(26).isAvailableForPurchase) remains += 67108864;
    if (ImaginaryUpgrade(27).isAvailableForPurchase) remains += 134217728;
    if (ImaginaryUpgrade(28).isAvailableForPurchase) remains += 268435456;
    if (ImaginaryUpgrade(29).isAvailableForPurchase) remains += 536870912;
    if (ImaginaryUpgrade(30).isAvailableForPurchase) remains += 1073741824;
    let darkremains = 0;
    if (ImaginaryUpgrade(26).isBought) darkremains += 67108864;
    if (ImaginaryUpgrade(27).isBought) darkremains += 134217728;
    if (ImaginaryUpgrade(28).isBought) darkremains += 268435456;
    if (ImaginaryUpgrade(29).isBought) darkremains += 536870912;
    if (ImaginaryUpgrade(30).isBought) darkremains += 1073741824;
    let maxPerkCharges = 0;
    maxPerkCharges = player.celestials.teresa.perkShop[8] ?? DC.D0;
    const infinityPow = player.celestials.teresa.perkShop[6];
    const maxGlyphLevel = player.celestials.teresa.perkShop[7] ?? DC.D0;
    let charge1 = 0;
    if (PerkShopUpgrade.all[0].isCharged || ExpansionPack.teresaPack.isBought) charge1 = player.celestials.teresa.perkShop[0];
    let charge2 = 0;
    if (PerkShopUpgrade.all[1].isCharged || ExpansionPack.teresaPack.isBought) charge2 = player.celestials.teresa.perkShop[1];
    let charge3 = 0;
    if (PerkShopUpgrade.all[2].isCharged || ExpansionPack.teresaPack.isBought) charge3 = player.celestials.teresa.perkShop[2];
    let charge4 = 0;
    if (PerkShopUpgrade.all[3].isCharged || ExpansionPack.teresaPack.isBought) charge4 = player.celestials.teresa.perkShop[3];
    let rowProtect = 0;
    rowProtect = player.reality.glyphs.protectedRows;
    let isAutoWeighed = player.celestials.effarig.autoAdjustGlyphWeights;
    Enslaved.autoReleaseSpeed = DC.D0;
    player.isGameEnd = false;
    Tab.dimensions.antimatter.show();
    AchievementTimers.marathon2.reset();
    if (!EndgameMilestone.achievementKeep.isReached) {
      lockAchievementsOnEndgame();
    }
    player.tutorialState = 0;
    player.tutorialActive = true;
    if (player.endgames.lte(50)) player.options.confirmations.glyphSelection = true;
    ui.view.newUI = player.options.newUI;
    ui.view.news = player.options.news.enabled;
    Themes.find(Theme.currentName()).set();
    Notations.all.find(n => n.name === player.options.notation).setAsCurrent();
    LNotations.find(player.options.lnotation).setAsCurrent(true);
    ADNotations.Settings.exponentCommas.min = 10 ** player.options.notationDigits.comma;
    ADNotations.Settings.exponentCommas.max = 10 ** player.options.notationDigits.notation;
    Currency.realities.reset();
    player.partSimulatedReality = DC.D0;
    Currency.realityMachines.reset();
    player.reality.maxRM = DC.D0;
    player.reality.imaginaryMachines = DC.D0;
    player.reality.iMCap = DC.D0;
    if (!Achievement(246)?.isUnlocked) {
      player.reality.glyphs.sac.power = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.infinity = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.time = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.replication = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.dilation = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.effarig = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.reality = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
    }
    player.reality.glyphs.undo = [];
    player.reality.glyphs.protectedRows = 0;
    Glyphs.deleteAllUnprotected();
    player.reality.glyphs.protectedRows = 2;
    Glyphs.unequipAll(true);
    player.reality.glyphs.protectedRows = 0;
    Glyphs.deleteAllUnprotected();
    for (const glyph of [...Glyphs.inventoryList]) {
      if (glyph.type !== "companion") Glyphs.removeFromInventory(glyph);
    }
    player.reality.glyphs.protectedRows = rowProtect;
    if (!ExpansionPack.effarigPack.isBought) {
      player.reality.glyphs.createdRealityGlyph = false;
    }
    player.reality.initialSeed = Math.floor(Date.now() * Math.random() + 1);
    player.reality.seed = 1;
    player.reality.secondGaussian = 1e6;
    player.reality.musicSeed = Math.floor(Date.now() * Math.random() + 0xBCDDECCB);
    player.reality.musicSecondGaussian = 1e6;
    if (!EndgameMastery(42).isBought) {
      player.reality.rebuyables = {
        1: DC.D0,
        2: DC.D0,
        3: DC.D0,
        4: DC.D0,
        5: DC.D0,
      };
      player.reality.upgradeBits = 0;
      player.reality.upgReqs = 0;
    }
    if (EndgameMastery(42).isBought) {
      player.reality.rebuyables = {
        1: DC.D1,
        2: DC.D1,
        3: DC.D1,
        4: DC.D1,
        5: DC.D1,
      };
    }
    if (!EndgameUpgrade(9).isBought) {
      player.reality.imaginaryUpgReqs = remains;
      player.reality.imaginaryUpgradeBits = darkremains;
      player.reality.imaginaryRebuyables = {
        1: DC.D0,
        2: DC.D0,
        3: DC.D0,
        4: DC.D0,
        5: DC.D0,
        6: DC.D0,
        7: DC.D0,
        8: DC.D0,
        9: DC.D0,
        10: DC.D0,
      };
    }
    player.reality.reqLock.reality = 0;
    player.reality.reqLock.imaginary = 0;
    if (!EndgameMilestone.keepPerks.isReached) {
      player.reality.perks = new Set();
    }
    player.reality.respec = false;
    player.reality.showGlyphSacrifice = false;
    player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.INVENTORY_MANAGEMENT;
    if (!ExpansionPack.vPack.isBought) {
      player.reality.autoAutoClean = false;
    }
    player.reality.perkPoints = EndgameUpgrade(6).isBought ? DC.E7 : DC.D0;
    player.reality.unlockedEC = 0;
    player.reality.autoEC = true;
    player.reality.lastAutoEC = DC.D0;
    player.reality.partEternitied = DC.D0;
    player.reality.autoAchieve = true;
    player.reality.gainedAutoAchievements = true;
    player.reality.achTimer = DC.D0;
    player.reality.hasCheckedFilter = false;
    if (!Achievement(246)?.isUnlocked) {
      player.reality.glyphs.sac.power = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.infinity = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.time = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.replication = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.dilation = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.effarig = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
      player.reality.glyphs.sac.reality = EndgameMilestone.startSac.isReached ? DC.E100 : DC.D0;
    }
    if (ImaginaryUpgrade(22).isBought) ImaginaryUpgrade(22).onPurchased();
    player.blackHole = Array.range(0, 2).map(id => ({
      id,
      intervalUpgrades: EndgameMilestone.bhAutos.isReached ? new Decimal(40) : DC.D0,
      powerUpgrades: DC.D0,
      durationUpgrades: EndgameMilestone.bhAutos.isReached ? new Decimal(40) : DC.D0,
      phase: DC.D0,
      active: false,
      unlocked: false,
      activations: DC.D0,
    }));
    player.blackHolePause = false;
    player.blackHoleAutoPauseMode = 0;
    player.blackHolePauseTime = DC.D0;
    player.blackHoleNegative = DC.D1;
    if (EndgameMastery(42).isBought) {
      player.blackHole[0].unlocked = true;
      player.blackHole[1].unlocked = true;
    }
    player.celestials.teresa.pouredAmount = Achievement(217)?.effectOrDefault(DC.D0) ?? DC.D0;
    if (!ExpansionPacks.areUnlocked) {
      player.celestials.teresa.quoteBits = 0;
      player.celestials.teresa.quotes = [];
    }
    player.celestials.teresa.unlockBits = Achievement(217)?.isUnlocked ? 63 : 0;
    player.celestials.teresa.run = false;
    if (!EndgameUpgrade(10).isBought) {
      player.celestials.teresa.bestRunAM = DC.D1;
      player.celestials.teresa.bestAMSet = [];
      player.celestials.teresa.lastRepeatedMachines = DC.D0;
    }
    player.celestials.teresa.perkShop = Array.repeat(DC.D0, 9);
    player.celestials.teresa.perkShop[0] = charge1;
    player.celestials.teresa.perkShop[1] = charge2;
    player.celestials.teresa.perkShop[2] = charge3;
    player.celestials.teresa.perkShop[3] = charge4;
    player.celestials.teresa.perkShop[6] = infinityPow;
    player.celestials.teresa.perkShop[7] = maxGlyphLevel;
    player.celestials.teresa.perkShop[8] = maxPerkCharges;
    if (!EffarigUnlock.maintainRS?.isUnlocked) {
      player.celestials.effarig.relicShards = EndgameUpgrade(6).isBought ? DC.E12 : DC.D0;
    }
    if (!Achievement(227)?.isUnlocked) {
      player.celestials.effarig.unlockBits = ExpansionPack.effarigPack.isBought ? 15 : 0;
    }
    player.celestials.effarig.run = false;
    if (!ExpansionPacks.areUnlocked) {
      player.celestials.effarig.quoteBits = 0;
      player.celestials.effarig.quotes = [];
    }
    player.celestials.effarig.glyphWeights.ep = 25;
    player.celestials.effarig.glyphWeights.repl = 25;
    player.celestials.effarig.glyphWeights.dt = 25;
    player.celestials.effarig.glyphWeights.eternities = 25;
    player.celestials.effarig.autoAdjustGlyphWeights = false;
    player.celestials.effarig.effarigTime = 0;
    player.celestials.effarig.effarigLayer = 0;
    player.celestials.enslaved.isStoring = false;
    player.celestials.enslaved.stored = DC.D0;
    player.celestials.enslaved.isStoringReal = false;
    player.celestials.enslaved.storedReal = DC.D0;
    player.celestials.enslaved.autoStoreReal = false;
    if (!ExpansionPack.raPack.isBought || player.disablePostReality) {
      player.celestials.enslaved.isAutoReleasing = false;
    }
    if (!ExpansionPacks.areUnlocked) {
      player.celestials.enslaved.quoteBits = 0;
      player.celestials.enslaved.quotes = [];
    }
    player.celestials.enslaved.unlocks = [];
    if (EndgameUpgrade(6).isBought) {
      player.celestials.enslaved.unlocks.push(0);
      player.celestials.enslaved.unlocks.push(1);
    }
    player.celestials.enslaved.run = false;
    if (!ExpansionPack.enslavedPack.isBought) {
      player.celestials.enslaved.completed = false;
    }
    player.celestials.enslaved.tesseracts = DC.D0;
    player.celestials.enslaved.hasSecretStudy = false;
    player.celestials.enslaved.feltEternity = false;
    player.celestials.enslaved.progressBits = 0;
    player.celestials.enslaved.hintBits = 0;
    player.celestials.enslaved.hintUnlockProgress = 0;
    player.celestials.enslaved.glyphHintsGiven = 0;
    player.celestials.enslaved.zeroHintTime = 0;
    Enslaved.autoReleaseTick = 0;
    player.celestials.v.run = false;
    if (!Achievement(218)?.isUnlocked) {
      player.celestials.v.unlockBits = ExpansionPack.vPack.isBought ? 1 : 0;
      if (!ExpansionPacks.areUnlocked) {
        player.celestials.v.quoteBits = 0;
        player.celestials.v.quotes = [];
      }
      player.celestials.v.runUnlocks = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      player.celestials.v.goalReductionSteps = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      player.celestials.v.runGlyphs = [[], [], [], [], [], [], [], [], []];
      player.celestials.v.runRecords = [DC.E1.neg(), DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0];
      player.celestials.v.wantsFlipped = true;
    }
    V.spaceTheorems = DC.D0;
    player.celestials.v.STSpent = DC.D0;
    if (Achievement(218)?.isUnlocked) {
      V.updateTotalRunUnlocks();
    }
    player.celestials.v.vTime = 0;
    player.celestials.v.vAuto = 0;
    player.celestials.v.vTotal = 0;
    player.celestials.v.vLayer = 0;
    if (!ExpansionPack.raPack.isBought) {
      player.celestials.ra.pets.teresa.level = 1;
      player.celestials.ra.pets.teresa.memories = DC.D0;
      player.celestials.ra.pets.teresa.memoryChunks = DC.D0;
      player.celestials.ra.pets.teresa.memoryUpgrades = 0;
      player.celestials.ra.pets.teresa.chunkUpgrades = 0;
      player.celestials.ra.pets.effarig.level = 1;
      player.celestials.ra.pets.effarig.memories = DC.D0;
      player.celestials.ra.pets.effarig.memoryChunks = DC.D0;
      player.celestials.ra.pets.effarig.memoryUpgrades = 0;
      player.celestials.ra.pets.effarig.chunkUpgrades = 0;
      player.celestials.ra.pets.enslaved.level = 1;
      player.celestials.ra.pets.enslaved.memories = DC.D0;
      player.celestials.ra.pets.enslaved.memoryChunks = DC.D0;
      player.celestials.ra.pets.enslaved.memoryUpgrades = 0;
      player.celestials.ra.pets.enslaved.chunkUpgrades = 0;
      player.celestials.ra.pets.v.level = 1;
      player.celestials.ra.pets.v.memories = DC.D0;
      player.celestials.ra.pets.v.memoryChunks = DC.D0;
      player.celestials.ra.pets.v.memoryUpgrades = 0;
      player.celestials.ra.pets.v.chunkUpgrades = 0;
      player.celestials.ra.petWithRemembrance = "";
    }
    if (!ExpansionPack.effarigPack.isBought) {
      player.celestials.ra.alchemy = Array.repeat(0, 24)
        .map(() => ({
          amount: DC.D0,
          bestPreDoom: DC.D0,
          reaction: false
        }));
      player.celestials.ra.highestRefinementValue.power = DC.D0;
      player.celestials.ra.highestRefinementValue.infinity = DC.D0;
      player.celestials.ra.highestRefinementValue.time = DC.D0;
      player.celestials.ra.highestRefinementValue.replication = DC.D0;
      player.celestials.ra.highestRefinementValue.dilation = DC.D0;
      player.celestials.ra.highestRefinementValue.effarig = DC.D0;
    }
    if (ExpansionPack.effarigPack.isBought && !player.disablePostReality) {
      for (const resource of player.celestials.ra.alchemy) {
        resource.amount = new Decimal(resource.bestPreDoom || 0);
      }
    }
    if (!ExpansionPacks.areUnlocked) {
      player.celestials.ra.quoteBits = 0;
      player.celestials.ra.quotes = [];
    }
    player.celestials.ra.momentumTime = DC.D0;
    if (!ExpansionPack.raPack.isBought) {
      player.celestials.ra.unlockBits = 0;
      player.celestials.ra.unlocks = [];
    }
    player.celestials.ra.run = false;
    if (!Achievement(223)?.isUnlocked) {
      player.celestials.ra.charged = new Set();
    }
    player.celestials.ra.disCharge = false;
    player.celestials.ra.peakGamespeed = DC.D1;
    player.celestials.laitela.darkMatter = DC.D0;
    player.celestials.laitela.unnerfedDarkMatter = DC.D0;
    player.celestials.laitela.maxDarkMatter = DC.D0;
    player.celestials.laitela.run = false;
    if (!ExpansionPacks.areUnlocked) {
      player.celestials.laitela.quoteBits = 0;
      player.celestials.laitela.quotes = [];
    }
    player.celestials.laitela.dimensions = Array.range(0, 8).map(() =>
      ({
        amount: DC.D0,
        intervalUpgrades: DC.D0,
        powerDMUpgrades: DC.D0,
        powerDEUpgrades: DC.D0,
        realDiff: DC.D0,
        timeSinceLastUpdate: 0,
        ascensionCount: DC.D0
      }));
    if (ImaginaryUpgrade(15).isBought) DarkMatterDimension(1).amount = DC.D1;
    if (ImaginaryUpgrade(16).isBought) DarkMatterDimension(2).amount = DC.D1;
    if (ImaginaryUpgrade(17).isBought) DarkMatterDimension(3).amount = DC.D1;
    if (ImaginaryUpgrade(18).isBought) DarkMatterDimension(4).amount = DC.D1;
    if (ImaginaryUpgrade(26).isBought) DarkMatterDimension(5).amount = DC.D1;
    if (ImaginaryUpgrade(27).isBought) DarkMatterDimension(6).amount = DC.D1;
    if (ImaginaryUpgrade(28).isBought) DarkMatterDimension(7).amount = DC.D1;
    if (ImaginaryUpgrade(29).isBought) DarkMatterDimension(8).amount = DC.D1;
    player.celestials.laitela.entropy = DC.D0;
    player.celestials.laitela.thisCompletion = new Decimal(3600);
    player.celestials.laitela.fastestCompletion = new Decimal(3600);
    player.celestials.laitela.difficultyTier = 0;
    player.celestials.laitela.upgrades = {};
    player.celestials.laitela.darkMatterMult = DC.D1;
    player.celestials.laitela.darkEnergy = DC.D0;
    player.celestials.laitela.singularities = ExpansionPack.laitelaPack.isBought ? DC.E1 : DC.D0;
    player.celestials.laitela.singularityCapIncreases = DC.D0;
    player.celestials.laitela.lastCheckedMilestones = DC.D0;
    player.celestials.pelle.doomed = false;
    player.celestials.pelle.upgrades = new Set();
    player.celestials.pelle.remnants = DC.D0;
    player.celestials.pelle.realityShards = DC.D0;
    player.celestials.pelle.records.totalEndgameAntimatter = DC.D0;
    player.celestials.pelle.records.totalRealityAntimatter = DC.D0;
    player.celestials.pelle.records.totalEternityAntimatter = DC.D0;
    player.celestials.pelle.records.totalInfinityAntimatter = DC.D0;
    player.celestials.pelle.records.totalInfinityPoints = DC.D0;
    player.celestials.pelle.records.totalEternityPoints = DC.D0;
    player.celestials.pelle.rebuyables.antimatterDimensionMult = DC.D0;
    player.celestials.pelle.rebuyables.timeSpeedMult = DC.D0;
    player.celestials.pelle.rebuyables.glyphLevels = DC.D0;
    player.celestials.pelle.rebuyables.infConversion = DC.D0;
    player.celestials.pelle.rebuyables.galaxyPower = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorAdditive = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorMultiplicative = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorAntimatterMult = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorIPMult = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorEPMult = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorRSMult = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorDTMult = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorRemnantPow = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorExponential = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorSuperExponential = DC.D0;
    player.celestials.pelle.rifts.vacuum.fill = DC.D0;
    player.celestials.pelle.rifts.vacuum.active = false;
    player.celestials.pelle.rifts.vacuum.reducedTo = 1;
    player.celestials.pelle.rifts.decay.fill = DC.D0;
    player.celestials.pelle.rifts.decay.active = false;
    player.celestials.pelle.rifts.decay.percentageSpent = 0;
    player.celestials.pelle.rifts.decay.reducedTo = 1;
    player.celestials.pelle.rifts.chaos.fill = DC.D0;
    player.celestials.pelle.rifts.chaos.active = false;
    player.celestials.pelle.rifts.chaos.reducedTo = 1;
    player.celestials.pelle.rifts.recursion.fill = DC.D0;
    player.celestials.pelle.rifts.recursion.active = false;
    player.celestials.pelle.rifts.recursion.reducedTo = 1;
    player.celestials.pelle.rifts.paradox.fill = DC.D0;
    player.celestials.pelle.rifts.paradox.active = false;
    player.celestials.pelle.rifts.paradox.reducedTo = 1;
    player.celestials.pelle.progressBits = 0;
    player.celestials.pelle.galaxyGenerator.unlocked = false;
    player.celestials.pelle.galaxyGenerator.spentGalaxies = DC.D0;
    player.celestials.pelle.galaxyGenerator.generatedGalaxies = DC.D0;
    player.celestials.pelle.galaxyGenerator.unspentGalaxies = DC.D0;
    player.celestials.pelle.galaxyGenerator.phase = 0;
    player.celestials.pelle.galaxyGenerator.sacrificeActive = false;
    player.celestials.pelle.collapsed.upgrades = false;
    player.celestials.pelle.collapsed.rifts = false;
    player.celestials.pelle.collapsed.galaxies = false;
    player.celestials.pelle.showBought = false;
    player.dilation.studies = [];
    player.dilation.active = false;
    player.dilation.upgrades.clear();
    player.dilation.rebuyables = {
      1: DC.D0,
      2: DC.D0,
      3: DC.D0,
      11: DC.D0,
      12: DC.D0,
      13: DC.D0
    };
    Currency.tachyonParticles.reset();
    player.dilation.nextThreshold = DC.E3;
    player.dilation.baseTachyonGalaxies = DC.D0;
    player.dilation.totalTachyonGalaxies = DC.D0;
    Currency.dilatedTime.reset();
    player.dilation.lastEP = DC.DM1;
    player.shownRuns.Reality = true;
    player.shownRuns.Eternity = true;
    player.shownRuns.Infinity = true;
    player.requirementChecks.infinity.maxAll = false;
    player.requirementChecks.infinity.noSacrifice = true;
    player.requirementChecks.infinity.noAD8 = true;
    player.requirementChecks.eternity.onlyAD1 = true;
    player.requirementChecks.eternity.onlyAD8 = true;
    player.requirementChecks.eternity.noAD1 = true;
    player.requirementChecks.eternity.noRG = true;
    player.requirementChecks.reality.noAM = true;
    player.requirementChecks.reality.noTriads = true;
    player.requirementChecks.reality.noPurchasedTT = true;
    player.requirementChecks.reality.noInfinities = true;
    player.requirementChecks.reality.noEternities = true;
    player.requirementChecks.reality.noContinuum = true;
    player.requirementChecks.reality.noCelMatter = !player.endgame.celestialMatterMultiplier.isActive;
    player.requirementChecks.reality.maxID1 = DC.D0;
    player.requirementChecks.reality.maxStudies = 0;
    player.requirementChecks.reality.maxGlyphs = 0;
    player.requirementChecks.reality.slowestBH = DC.D1;
    player.requirementChecks.endgame.noGlyphsDoomed = true;
    player.requirementChecks.endgame.onlyLowDims = true;
    player.requirementChecks.endgame.maxStudies = 0;
    player.requirementChecks.endgame.noContinuum = true;
    player.requirementChecks.endgame.noGlyphs = true;
    resetChallengeStuff();
    player.eternityChalls = {};
    player.reality.unlockedEC = 0;
    player.reality.lastAutoEC = DC.D0;
    player.challenge.eternity.current = 0;
    player.challenge.eternity.unlocked = 0;
    player.challenge.eternity.requirementBits = 0;
    Lazy.invalidateAll();
    ECTimeStudyState.invalidateCachedRequirements();
    player.IPMultPurchases = DC.D0;
    Currency.infinityPower.reset();
    player.postC4Tier = 0;
    Currency.timeShards.reset();
    Replicanti.reset(true);
    Currency.eternityPoints.reset();
    EternityUpgrade.epMult.reset();
    Currency.eternities.reset();
    if (EndgameMastery(42).isBought && !player.disablePostReality) {
      Currency.eternities.bumpTo(100);
    }
    player.eternityUpgrades.clear();
    player.totalTickGained = DC.D0;
    player.totalTickBought = DC.D0;
    Currency.timeTheorems.reset();
    resetEternityRuns();
    secondSoftReset(false);
    player.respec = false;
    player.eterc8ids = 50;
    player.eterc8repl = 40;
    player.auto.bigCrunch.mode = 0;
    player.auto.eternity.mode = 0;
    InfinityDimensions.fullReset();
    InfinityDimensions.resetAmount();
    fullResetTimeDimensions();
    resetTimeDimensions();
    player.buyUntil10 = true;
    player.sacrificed = DC.D0;
    playerInfinityUpgradesOnReset();
    Currency.infinityPoints.reset();
    resetInfinityRuns();
    Currency.infinities.reset();
    Currency.infinitiesBanked.reset();
    player.partInfinityPoint = 0;
    player.partInfinitied = 0;
    player.dimensionBoosts = DC.D0;
    player.galaxies = DC.D0;
    player.break = false;
    resetTickspeed();
    AntimatterDimensions.reset();
    Currency.antimatter.reset();
    CelestialDimensions.resetAmount();
    initializeChallengeCompletions(true);
    if (!EndgameMilestone.achievementKeep.isReached) {
      lockAchievementsOnEndgame();
    }
    Autobuyers.reset();
    player.records.totalTimePlayed = new Decimal(player.records.realTimePlayed);
    player.records.timePlayedAtBHUnlock = DC.E9E15;
    player.records.realTimeDoomed = DC.D0;
    player.records.totalEndgameAntimatter = DC.E1;
    player.records.totalRealityAntimatter = DC.E1;
    player.records.totalEternityAntimatter = DC.E1;
    player.records.totalInfinityAntimatter = DC.E1;
    player.records.recentInfinities = Array.range(0, 10).map(() =>
      [DC.E9E15, Number.MAX_VALUE, DC.D1, DC.D1, ""]);
    player.records.recentEternities = Array.range(0, 10).map(() =>
      [DC.E9E15, Number.MAX_VALUE, DC.D1, DC.D1, "", DC.D0]);
    player.records.recentRealities = Array.range(0, 10).map(() =>
      [DC.E9E15, Number.MAX_VALUE, DC.D1, DC.D1, "", 0, 0]);
    player.records.thisInfinity.time = DC.D0;
    player.records.thisInfinity.realTime = DC.D0;
    player.records.thisInfinity.lastBuyTime = DC.D0;
    player.records.thisInfinity.maxAM = DC.D0;
    player.records.thisInfinity.bestIPmin = DC.D0;
    player.records.thisInfinity.bestIPminVal = DC.D0;
    player.records.bestInfinity.time = DC.E9E15;
    player.records.bestInfinity.realTime = DC.BEMAX;
    player.records.bestInfinity.bestIPminEternity = DC.D0;
    player.records.bestInfinity.bestIPminReality = DC.D0;
    player.records.thisEternity.time = DC.D0;
    player.records.thisEternity.realTime = DC.D0;
    player.records.thisEternity.maxAM = DC.D0;
    player.records.thisEternity.maxIP = DC.D0;
    player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
    player.records.thisEternity.bestEPmin = DC.D0;
    player.records.thisEternity.bestEPminVal = DC.D0;
    player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
    player.records.bestEternity.time = DC.E9E15;
    player.records.bestEternity.realTime = DC.BEMAX;
    player.records.bestEternity.bestEPminReality = DC.D0;
    player.records.thisReality.time = DC.D0;
    player.records.thisReality.realTime = DC.D0;
    player.records.thisReality.maxAM = DC.D0;
    player.records.thisReality.maxIP = DC.D0;
    player.records.thisReality.maxEP = DC.D0;
    player.records.thisReality.bestEternitiesPerMs = DC.D0;
    player.records.thisReality.maxReplicanti = DC.D0;
    player.records.thisReality.maxDT = DC.D0;
    player.records.thisReality.bestRSmin = DC.D0;
    player.records.thisReality.bestRSminVal = DC.D0;
    player.records.thisReality.galaxies = DC.D0;
    player.records.bestReality.time = DC.E9E15;
    player.records.bestReality.realTime = DC.BEMAX;
    player.records.bestReality.glyphStrength = DC.D0;
    player.records.bestReality.RM = DC.D0;
    player.records.bestReality.RMSet = [];
    player.records.bestReality.RMmin = DC.D0;
    player.records.bestReality.RMminSet = [];
    player.records.bestReality.glyphLevel = DC.D0;
    player.records.bestReality.glyphLevelSet = [];
    player.records.bestReality.bestEP = DC.D0;
    player.records.bestReality.bestEPSet = [];
    player.records.bestReality.speedSet = [];
    player.records.bestReality.iMCapSet = [];
    player.records.bestReality.laitelaSet = [];
    player.records.thisEndgame.time = DC.D0;
    player.records.thisEndgame.realTime = 0;
    player.records.thisEndgame.peakGameSpeed = DC.D1;
    Glyphs.refreshActive();
    if (!player.auto.disableContinuum) {
      player.requirementChecks.reality.noContinuum = false;
      player.requirementChecks.endgame.noContinuum = false;
    }
    if (EndgameMilestone.keepPerks.isReached) {
      Achievement(146).unlock();
    }
    if (EndgameMastery(42).isBought) {
      Achievement(142).unlock();
      Achievement(144).unlock();
      Achievement(147).unlock();
    }
    if (EndgameMilestone.celestialEarlyUnlock.isReached) {
      DarkMatterDimension(1).amount = DC.D1;
    }
    if (Achievement(165).isUnlocked) {
      player.celestials.effarig.autoAdjustGlyphWeights = isAutoWeighed;
    }
    if (EternityMilestone.keepAutobuyers.isReached) {
      NormalChallenges.completeAll();
    }
    if ((RealityUpgrade(10).isBought || EndgameMastery(42).isBought) && !player.disablePostReality) applyRUPG10();
    if (TeresaUnlocks.startEU.canBeApplied) {
      for (const id of [1, 2, 3, 4, 5, 6]) player.eternityUpgrades.add(id);
    } else if (RealityUpgrade(14).isBought && !player.disablePostReality) {
      applyEU1();
    }
    tryChargeAll();
    tryChargeAllPerkUpgrades();
    tryChargeAllBreakUpgrades();
    tryChargeAllEternityUpgrades();
    AutomatorBackend.restart();
  }
};
function lockAchievementsOnEndgame() {
  for (const achievement of Achievements.preMeta) {
    achievement.lock();
  }
}
export class EndgameMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    return Currency.endgames.gte(this.config.endgames);
  }
}
export const EndgameMilestone = mapGameDataToObject(
  GameDatabase.endgame.milestones,
  config => (config.isBaseResource
    ? new EndgameMilestoneState(config)
    : new EndgameMilestoneState(config))
);

function resetDivinityStartingState() {
  Currency.antimatter.reset();
  AntimatterDimensions.reset();
  InfinityDimensions.fullReset();
  InfinityDimensions.resetAmount();
  Currency.timeShards.reset();
  fullResetTimeDimensions();
  resetTimeDimensions();
}

export function automaticDivinity() {
  const pelle = player.celestials.pelle;
  const maxBulk = DivinityMilestone.divinityOverdrive.isReached
    ? 1000
    : DivinityMilestone.bulkDivinity.isReached ? 100 : 1;
  for (let bulkCount = 0; bulkCount < maxBulk; bulkCount++) {
    const alreadyAwarded = pelle.lastAutoDivinity === pelle.divinities;
    if (!alreadyAwarded) {
      giveEndgameRewards();
      GlyphAppearanceHandler.unlockSet();
      pelle.divinities++;
    }
    resetDivinityStartingState();
    if (alreadyAwarded || bulkCount + 1 >= maxBulk ||
      !AntimatterDimension(1).productionPerSecond.gte(DC.ENUMMAX)) {
      break;
    }
  }
  delete pelle.lastAutoDivinity;
  return true;
}

export function divinityReset() {
  Endgame.newEndgame();
  player.celestials.pelle.divinities++;
  if (player.celestials.pelle.divinities === 3) {
    player.celestials.laitela.hadrons.light = player.celestials.laitela.hadrons.total;
    player.celestials.laitela.hadrons.dark = player.celestials.laitela.hadrons.total;
  }
  player.records.bestDoomedAntimatterThisDivinity = DC.E1;
  if (player.celestials.pelle.divinities === 1) Pelle.quotes.divinity.show();
  // Remove next update
  if (player.celestials.pelle.divinities === 22) {
    Modal.message.show(`You have reached the end of balanced content. You may go beyond this point,
      but content may be unbalanced and/or unimplemented.`, {}, 3);
  }
}

export const NewGame = {
  restartGame() {
    // Hide the game for an additional five seconds while the functions trigger
    player.endgame.creditsTick = 13015000;

    // This is where we "confirm" a speedrun as completed and store all its information into the previous run prop
    // before resetting everything.
    /*const speedrun = player.speedrun;
    if (speedrun.isActive) {
      player.speedrun.previousRuns[player.records.fullGameCompletions + 1] = {
        isSegmented: speedrun.isSegmented,
        usedSTD: speedrun.usedSTD,
        startDate: speedrun.startDate,
        name: speedrun.name,
        offlineTimeUsed: speedrun.offlineTimeUsed,
        records: [...speedrun.records],
        achievementTimes: JSON.parse(JSON.stringify(speedrun.achievementTimes)),
        seedSelection: speedrun.seedSelection,
        initialSeed: speedrun.initialSeed,
      };

      // For the sake of keeping a bounded savefile size, we only keep a queue of the last 100 full runs. The earliest
      // this will feasibly become an issue from nonstop speedruns is around 2030; I guess we can revisit it at that
      // point if we really need to, but I suspect this limit should be high enough
      const prevRunIndices = Object.keys(speedrun.previousRuns).map(k => Number(k));
      if (prevRunIndices.length > 100) player.speedrun.previousRuns[prevRunIndices.min()] = undefined;
    }*/

    // Modify beaten-game quantities before doing a carryover reset
    setTimeout(() => player.endgame.fullCompletions++, 4000);
    setTimeout(() => this.restartWithCarryover(), 4000);

    // Without the delay, this causes the saving (and its notification) to occur during the credits rollback
    setTimeout(() => GameStorage.save(), 10000);
  },

  // Reset the game, but carry over some post-completion stats. We also call this when starting a speedrun, so make sure
  // any stats which are updated due to completion happen in startNewGame() instead of in here
  restartWithCarryover() {
    const backUpOptions = JSON.stringify(player.options);
    // This can't be JSONed as it contains sets
    const secretUnlocks = player.secretUnlocks;
    const secretAchievements = JSON.stringify(player.secretAchievementBits);
    // We don't backup the whole player.reality.automator object because it contains "state",
    // which could lead to some edge cases where it starts when it shouldn't (ie before it's unlocked)
    // It's easier to do something like this to avoid it entirely.
    const automatorConstants = JSON.stringify(player.reality.automator.constants);
    const automatorConstantSort = JSON.stringify(player.reality.automator.constantSortOrder);
    const automatorScripts = JSON.stringify(player.reality.automator.scripts);
    const endgameCompletions = player.endgame.fullCompletions;
    const fullCompletions = player.records.fullGameCompletions;
    const fullTimePlayed = player.records.previousRunRealTime.add(player.records.realTimePlayed);
    const glyphCosmetics = JSON.stringify(player.reality.glyphs.cosmetics);
    const speedrunRecords = JSON.stringify(player.speedrun.previousRuns);
    const hasSpeedrun = player.speedrun.isUnlocked;
    const presets = JSON.stringify(player.timestudy.presets);
    const companions = JSON.stringify(Glyphs.allGlyphs.filter(g => g.type === "companion"));
    Modal.hideAll();
    Quote.clearAll();
    GameStorage.hardReset();
    player.options = JSON.parse(backUpOptions);
    // We need to force this one to be true because otherwise the player will be unable to select their glyphs
    // until they can auto-reality
    player.options.confirmations.glyphSelection = true;
    player.secretUnlocks = secretUnlocks;
    player.secretAchievementBits = JSON.parse(secretAchievements);
    player.reality.automator.constants = JSON.parse(automatorConstants);
    player.reality.automator.constantSortOrder = JSON.parse(automatorConstantSort);
    player.reality.automator.scripts = JSON.parse(automatorScripts);
    player.endgame.fullCompletions = endgameCompletions;
    player.records.fullGameCompletions = fullCompletions;
    player.records.previousRunRealTime = fullTimePlayed;
    ui.view.newUI = player.options.newUI;
    ui.view.news = player.options.news.enabled;
    player.reality.glyphs.cosmetics = JSON.parse(glyphCosmetics);
    player.speedrun.previousRuns = JSON.parse(speedrunRecords);
    player.speedrun.isUnlocked = hasSpeedrun;
    player.timestudy.presets = JSON.parse(presets);
    JSON.parse(companions).forEach(g => {
      Glyphs.addToInventory(g);
    });
    Themes.find(Theme.currentName()).set();
    Notations.all.find(n => n.name === player.options.notation).setAsCurrent();
    ADNotations.Settings.exponentCommas.min = 10 ** player.options.notationDigits.comma;
    ADNotations.Settings.exponentCommas.max = 10 ** player.options.notationDigits.notation;
    player.lastUpdate = Date.now();
    Tab.dimensions.antimatter.show(true);
  }
};
