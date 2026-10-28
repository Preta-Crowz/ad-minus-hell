import TWEEN from "@tweenjs/tween.js";

import { DC } from "./core/constants";
import { deepmergeAll } from "@/utility/deepmerge";
import { DEV } from "@/env";
import { SpeedrunMilestones } from "./core/speedrun";
import { Cloud } from "./core/storage";
import { ElectronRuntime, SteamRuntime } from "@/steam";
import { supportedBrowsers } from "./supported-browsers";

if (GlobalErrorHandler.handled) {
  throw new Error("Initialization failed");
}
GlobalErrorHandler.cleanStart = true;

export function playerInfinityUpgradesOnReset() {
  const infinityUpgrades = new Set(
    ["timeMult", "dimMult", "timeMult2",
      "skipReset1", "skipReset2", "unspentBonus",
      "27Mult", "18Mult", "36Mult", "resetMult",
      "skipReset3", "passiveGen", "45Mult",
      "resetBoost", "galaxyBoost", "skipResetGalaxy",
      "ipOffline"]
  );

  const breakInfinityUpgrades = new Set(
    ["timeMult", "dimMult", "timeMult2",
      "skipReset1", "skipReset2", "unspentBonus",
      "27Mult", "18Mult", "36Mult", "resetMult",
      "skipReset3", "passiveGen", "45Mult",
      "resetBoost", "galaxyBoost", "skipResetGalaxy",
      "totalMult", "currentMult", "postGalaxy",
      "challengeMult", "achievementMult", "infinitiedMult",
      "infinitiedGeneration", "autoBuyerUpgrade", "autobuyMaxDimboosts",
      "ipOffline"]
  );

  if (PelleUpgrade.keepBreakInfinityUpgrades.canBeApplied) {
    player.infinityUpgrades = new Set([...player.infinityUpgrades].filter(u => breakInfinityUpgrades.has(u)));
    return;
  }

  if (PelleUpgrade.keepInfinityUpgrades.canBeApplied) {
    player.infinityUpgrades = new Set([...player.infinityUpgrades].filter(u => infinityUpgrades.has(u)));
    player.infinityRebuyables = [new Decimal(), new Decimal(), new Decimal()];
    GameCache.tickSpeedMultDecrease.invalidate();
    GameCache.dimensionMultDecrease.invalidate();
    return;
  }

  if ((RealityUpgrade(10).isBought && !Glitch.isRunning) || EternityMilestone.keepBreakUpgrades.isReached) {
    player.infinityUpgrades = breakInfinityUpgrades;
    player.infinityRebuyables = [new Decimal(8), new Decimal(7), new Decimal(10)];
  } else if (EternityMilestone.keepInfinityUpgrades.isReached) {
    player.infinityUpgrades = infinityUpgrades;
    player.infinityRebuyables = [new Decimal(), new Decimal(), new Decimal()];
  } else {
    player.infinityUpgrades.clear();
    player.infinityRebuyables = [new Decimal(), new Decimal(), new Decimal()];
  }

  if (Pelle.isDoomed) {
    player.infinityUpgrades.clear();
    player.infinityRebuyables = [new Decimal(), new Decimal(), new Decimal()];
  }

  GameCache.tickSpeedMultDecrease.invalidate();
  GameCache.dimensionMultDecrease.invalidate();
}

export function playerCelestialInfinityUpgradesOnReset() {
  const celestialInfinityUpgrades = new Set(
    ["gameSpeedMultCIP", "celDimPurchaseBoost", "alphaDecayStartBoost",
      "celDimBoostBuff", "celGalaxyBuff", "celestialMatterConversionBuff",
      "antimatterCelestialDimBuff", "cipGen", "buffedStart"]
  );

  const celestialBreakInfinityUpgrades = new Set(
    ["gameSpeedMultCIP", "celDimPurchaseBoost", "alphaDecayStartBoost",
      "celDimBoostBuff", "celGalaxyBuff", "celestialMatterConversionBuff",
      "antimatterCelestialDimBuff", "cipGen", "buffedStart",
      "autoCD1", "autoCD2", "autoCDPlus", "betterAuto", "bulkCelDimBoosts",
      "celInfGen", "celTickspeedCostMult", "celDimCostMult", "celDimPurchaseBuff",
      "celDimboostBuff"]
  );

  if (CelestialEternityUpgrade.startBreakInf.isBought) {
    player.endgame.celDimExpansion.celestialInfinityUpgrades = celestialBreakInfinityUpgrades;
    player.endgame.celDimExpansion.celestialInfinityRebuyables = [8, 7, 10, 10, 10, 10];
  } else if (CelestialEternityUpgrade.startInf.isBought) {
    player.endgame.celDimExpansion.celestialInfinityUpgrades = celestialInfinityUpgrades;
    player.endgame.celDimExpansion.celestialInfinityRebuyables = [0, 0, 0, 0, 0, 0];
  } else {
    player.endgame.celDimExpansion.celestialInfinityUpgrades.clear();
    player.endgame.celDimExpansion.celestialInfinityRebuyables = [0, 0, 0, 0, 0, 0];
  }

  GameCache.celestialTickSpeedMultDecrease.invalidate();
  GameCache.celestialDimensionMultDecrease.invalidate();
}

export function breakInfinity() {
  if (!Autobuyer.bigCrunch.hasMaxedInterval) return;
  if (InfinityChallenge.isRunning) return;
  for (const autobuyer of Autobuyers.all) {
    if (autobuyer.data.interval !== undefined) autobuyer.maxIntervalForFree();
  }
  // There's a potential migration edge case involving already-maxed autobuyers; this should give the achievement
  Achievement(61).tryUnlock();
  player.break = !player.break;
  TabNotification.ICUnlock.tryTrigger();
  EventHub.dispatch(player.break ? GAME_EVENT.BREAK_INFINITY : GAME_EVENT.FIX_INFINITY);
  GameUI.update();
  if (Alpha.isRunning && Alpha.currentStage === 5) {
    Alpha.advanceLayer();
    Alpha.quotes.breakInfinity.show();
  }
  if (player.break && Slabdrill.isCursed && Slabdrill.currentStage === 3) {
    Slabdrill.advanceLayer();
    GameCache.tickSpeedMultDecrease.invalidate();
    GameCache.dimensionMultDecrease.invalidate();
    Glyphs.refreshActive();
    for (const type of GlyphInfo.basicGlyphTypes) Glyphs.addToInventory(GlyphGenerator.omniGlyph(type));
    Slabdrill.quotes.breakInfinity.show();
  }
}

export function breakEternity() {
  player.break2 = !player.break2;
  EventHub.dispatch(GAME_EVENT.BREAK_ETERNITY);
  GameUI.update();
}

export function celestialBreakInfinity() {
  player.endgame.celDimExpansion.isBroken = !player.endgame.celDimExpansion.isBroken;
  EventHub.dispatch(GAME_EVENT.CELESTIAL_BREAK_INFINITY);
  GameUI.update();
}

export function gainedInfinityPoints() {
  const div = new Decimal(Effects.min(
    308,
    Achievement(103),
    TimeStudy(111)
  )).toNumber();
  if (Pelle.isDisabled("IPMults")) {
    let x = Decimal.add(1);
    x = x.times(preInfinityUGs.all[6].effectOrDefault(1));
    x = x.times(preInfinityUGs.all[7].effectOrDefault(1));

    x = x.times(breakInfinityUGs.all[0].effectOrDefault(1));
    x = x.times(breakInfinityUGs.all[1].effectOrDefault(1));
    x = x.times(breakInfinityUGs.all[3].effectOrDefault(1));

    x = x.times(GlitchRifts.alpha.milestones[3].effectOrDefault(1));

    let ip = Decimal.pow10(player.records.thisInfinity.maxAM.log10().div(div).sub(0.75))
      .timesEffectsOf(PelleRifts.vacuum)
      .times(Pelle.specialGlyphEffect.infinity).times(x);
    if (AlchemyResource.exponential.amount.gt(0) && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) {
      ip = ip.pow(ReplicantiMultipliers.ipPow);
    }
    if (ResurgenceUpgrade.ipSurge.isBought && !player.disablePostReality) ip = ip.min(Currency.antimatter.value);
    return ip.floor();
  }
  let ip = player.break
    ? Decimal.pow10(player.records.thisInfinity.maxAM.max(1).log10().div(div).sub(0.75))
    : new Decimal(308 / div);
  if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY) {
    ip = ip.min(DC.E200);
  }
  ip = ip.times(GameCache.totalIPMult.value).times(Hell.ipAchievementMult);

  ip = ip.timesEffectsOf(
    preInfinityUGs.all[6],
    preInfinityUGs.all[7],
    breakInfinityUGs.all[0],
    breakInfinityUGs.all[1],
    breakInfinityUGs.all[2],
    breakInfinityUGs.all[3],
    PelleRifts.vacuum
  ).times(Pelle.specialGlyphEffect.infinity);

  ip = ip.pow(MetaMilestone.metaProgress.effectOrDefault(1));


  if (Teresa.isRunning) {
    ip = ip.pow(0.55 * GlitchSpeedUpgrades.all[0].effectOrDefault(1));
  }
  if (V.isRunning) {
    ip = ip.pow(0.5 * GlitchSpeedUpgrades.all[0].effectOrDefault(1));
  }
  if (V.isRunningExtreme) {
    ip = ip.pow(0.01);
  }
  if (Laitela.isRunning) {
    ip = dilatedValueOf(ip, GlitchSpeedUpgrades.all[0].isBought);
  }
  if (GlyphAlteration.isAdded("infinity")) {
    ip = ip.pow(getSecondaryGlyphEffect("infinityIP"));
  }
  if (AlchemyResource.exponential.amount.gt(0) && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) {
    ip = ip.pow(ReplicantiMultipliers.ipPow);
  }
  if (ResurgenceUpgrade.ipSurge.isBought && !player.disablePostReality) ip = ip.min(Currency.antimatter.value);

  // If(ip.gt("ee50")) ip = ip.pow( ip.log10().div(1e50).pow(0.3).recip() );

  return ip.floor();
}

function totalEPMult() {
  return Pelle.isDisabled("EPMults")
    ? Pelle.specialGlyphEffect.time.timesEffectOf(PelleRifts.vacuum.milestones[2])
    : getAdjustedGlyphEffect("cursedEP")
      .times(ShopPurchase.EPPurchases.currentMult)
      .timesEffectsOf(
        EternityUpgrade.epMult,
        TimeStudy(61),
        TimeStudy(122),
        TimeStudy(121),
        TimeStudy(123),
        RealityUpgrade(12),
        GlyphEffect.epMult,
        PelleRifts.vacuum.milestones[2]
      ).mul(Pelle.specialGlyphEffect.time);
}

export function gainedEternityPoints() {
  const eternityPointPower = Ra.unlocks.eternityPointPower.effectOrDefault(1);
  let ep = DC.D5.pow(player.records.thisEternity.maxIP.plus(
    gainedInfinityPoints()).max(1).log10().div(Decimal.max(new Decimal(308).sub(PelleRifts.recursion.effectValue), eternityPointPower * 2)).sub(0.7))
    .times(totalEPMult()).max(1);
  ep = ep.times(eternityUGs.all[0].effectOrDefault(1));
  ep = ep.times(eternityUGs.all[4].effectOrDefault(1));
  ep = ep.times(realityUGs.all[0].effectOrDefault(1));
  if (LHC.voidRunning) ep = ep.timesEffectOf(LHCNullUpgrade.eternityPointMult);

  ep = ep.pow(MetaMilestone.metaProgress.effectOrDefault(1));

  if (Teresa.isRunning) {
    ep = ep.pow(0.55 * GlitchSpeedUpgrades.all[0].effectOrDefault(1));
  }
  if (V.isRunning) {
    ep = ep.pow(0.5 * GlitchSpeedUpgrades.all[0].effectOrDefault(1));
  }
  if (V.isRunningExtreme) {
    ep = ep.pow(0.01);
  }
  if (Laitela.isRunning) {
    ep = dilatedValueOf(ep, GlitchSpeedUpgrades.all[0].isBought);
  }
  if (GlyphAlteration.isAdded("time")) {
    ep = ep.pow(getSecondaryGlyphEffect("timeEP"));
  }
  ep = ep.pow(eternityPointPower);
  if (ResurgenceUpgrade.epSurge.isBought && !player.disablePostReality) ep = ep.min(Currency.antimatter.value);

  // If(ep.gt("ee50")) ep = ep.pow( ep.log10().div(1e50).pow(0.3).recip() );

  return ep.floor();
}

export function requiredIPForEP(epAmount) {
  return Decimal.pow10((Decimal.log10(Decimal.divide(epAmount, totalEPMult()), 5).times(308).plus(0.7)))
    .clampMin(Number.MAX_VALUE);
}

export function gainedGlyphLevel() {
  const glyphState = getGlyphLevelInputs();
  const rawLevel = glyphState.rawLevel.floor();
  const actualLevel = glyphState.actualLevel.floor();
  return {
    rawLevel,
    actualLevel
  };
}

export function gainedMetas() {
  let metas = DC.D1;

  metas = metas.mul(MetaFabricatorUpgrade(21).effectOrDefault(1));
  metas = metas.mul(Ra.unlocks.nullMetaBoost.effectOrDefault(1));
  metas = metas.mul(Ra.unlocks.canteMetaBoost.effectOrDefault(1));

  return metas;
}

export function gainedMetaRelays() {
  let mr = (MetaFabricatorUpgrade(23).isBought && !Pelle.isDoomed) ? Decimal.pow10(player.records.thisMeta.maxAM.log10().log10().div(10)).add(1) : DC.D1;
  mr = mr.add(Currency.metas.value);
  mr = mr.mul(MetaMilestone.metaSpeed.effectOrDefault(1));
  mr = mr.mul(MetaFabricatorUpgrade(13).effectOrDefault(1));
  mr = mr.mul(Ra.unlocks.nullMetaAntimatter.effectOrDefault(1));
  mr = mr.mul(Ra.unlocks.canteMetaBoost.effectOrDefault(1));
  mr = Decimal.pow(mr, Decimal.pow(2, player.celestials.pelle.divinities));

  return mr.floor();
}


export function resetChallengeStuff() {
  player.chall2Pow = DC.D1;
  player.chall3Pow = DC.D0_01;
  Currency.matter.reset();
  player.chall8TotalSacrifice = DC.D1;
  player.postC4Tier = 1;
}

export function ratePerMinute(amount, time) {
  return Decimal.divide(amount, time instanceof Decimal ? time.div(60 * 1000) : time / (60 * 1000));
}

// eslint-disable-next-line max-params
export function addInfinityTime(trueTime, time, realTime, ip, infinities) {
  let challenge = "";
  if (player.challenge.normal.current) challenge = `Normal Challenge ${player.challenge.normal.current}`;
  if (player.challenge.infinity.current) challenge = `Infinity Challenge ${player.challenge.infinity.current}`;
  player.records.recentInfinities.pop();
  player.records.recentInfinities.unshift([trueTime, time, realTime, ip, infinities, challenge]);
  GameCache.bestRunIPPM.invalidate();
}

export function addCelestialInfinityTime(time, realTime, cip, celInfinities) {
  player.records.recentCelestialInfinities.pop();
  player.records.recentCelestialInfinities.unshift([time, realTime, cip, celInfinities]);
  GameCache.bestRunCIPPM.invalidate();
}

export function resetCelestialInfinityRuns() {
  player.records.recentCelestialInfinities = Array.from(
    { length: 10 },
    () => [DC.E9E15, Number.MAX_VALUE, DC.D1, DC.D1]
  );
  GameCache.bestRunCIPPM.invalidate();
}

export function resetCondenseRuns() {
  player.records.recentCondenses = Array.from(
    { length: 10 },
    () => [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1]
  );
  GameCache.bestRunVSPM.invalidate();
}

export function addCelestialEternityTime(time, realTime, cep, celEternities) {
  player.records.recentCelestialEternities.pop();
  player.records.recentCelestialEternities.unshift([time, realTime, cep, celEternities]);
}

export function addCondenseTime(time, realTime, vs, condenses) {
  player.records.recentCondenses.pop();
  player.records.recentCondenses.unshift([time, realTime, vs, condenses]);
  GameCache.bestRunVSPM.invalidate();
}

export function addSupernovaTime(time, realTime, neb, supernovae) {
  player.records.recentSupernovae.pop();
  player.records.recentSupernovae.unshift([time, realTime, neb, supernovae]);
}

export function resetInfinityRuns() {
  player.records.recentInfinities = Array.from({ length: 10 }, () => [
    Number.MAX_VALUE,
    DC.BEMAX,
    DC.BEMAX,
    DC.D1,
    DC.D1,
    "",
  ]);
  GameCache.bestRunIPPM.invalidate();
}

export function resetRealityRuns() {
  player.records.recentRealities = Array.range(0, 10).map(() =>
    [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, DC.D1, "", DC.D0, DC.D0]);
}

// Player gains 50% of infinities they would get based on their best infinities/hour crunch if they have the
// milestone and turned on infinity autobuyer with 1 minute or less per crunch
export function getInfinitiedMilestoneReward(ms, considerMilestoneReached) {
  return Autobuyer.bigCrunch.autoInfinitiesAvailable(considerMilestoneReached)
    ? Decimal.floor(player.records.thisEternity.bestInfinitiesPerMs.times(ms).dividedBy(2))
    : DC.D0;
}

// eslint-disable-next-line max-params
export function addEternityTime(trueTime, time, realTime, ep, eternities) {
  let challenge = "";
  if (player.challenge.eternity.current) {
    const currEC = player.challenge.eternity.current;
    const ec = EternityChallenge(currEC);
    const challText = player.dilation.active ? "Dilated EC" : "Eternity Challenge";
    challenge = `${challText} ${currEC} (${formatInt(ec.completions)}/${formatInt(ec.maxCompletions)})`;
  } else if (player.dilation.active) challenge = "Time Dilation";
  // If we call this function outside of dilation, it uses the existing AM and produces an erroneous number
  const gainedTP = player.dilation.active ? getTachyonGain() : DC.D0;
  player.records.recentEternities.pop();
  player.records.recentEternities.unshift([trueTime, time, realTime, ep, eternities, challenge, gainedTP]);
  GameCache.averageRealTimePerEternity.invalidate();
}

export function resetEternityRuns() {
  player.records.recentEternities = Array.from({ length: 10 }, () => [
    Number.MAX_VALUE,
    DC.BEMAX,
    DC.BEMAX,
    DC.D1,
    DC.D1,
    "",
    DC.D0,
  ]);
  GameCache.averageRealTimePerEternity.invalidate();
}

// Player gains 50% of the eternities they would get if they continuously repeated their fastest eternity, if they
// have the auto-eternity milestone and turned on eternity autobuyer with 0 EP
export function getEternitiedMilestoneReward(ms, considerMilestoneReached) {
  return Autobuyer.eternity.autoEternitiesAvailable(considerMilestoneReached)
    ? Decimal.floor(player.records.thisReality.bestEternitiesPerMs.times(ms).dividedBy(2))
    : DC.D0;
}

function isOfflineEPGainEnabled() {
  return player.options.offlineProgress && !Autobuyer.bigCrunch.autoInfinitiesAvailable() &&
    !Autobuyer.eternity.autoEternitiesAvailable();
}

export function getOfflineEPGain(ms) {
  if (!EternityMilestone.autoEP.isReached || !isOfflineEPGainEnabled()) return DC.D0;
  return player.records.bestEternity.bestEPminReality.times(
    TimeSpan.fromMilliseconds(new Decimal(ms)).totalMinutes.div(4));
}

// Note: realities and ampFactor must be distinct because there are a few things farther up which only multiply
// reality count and none of the other things
// eslint-disable-next-line max-params
export function addRealityTime(trueTime, time, realTime, rm, level, realities, ampFactor, projIM) {
  let reality = "";
  const celestials = [Teresa, Effarig, Enslaved, V, Ra, Laitela];
  for (const cel of celestials) {
    if (cel.isRunning) reality = cel.displayName;
  }
  const shards = Effarig.shardsGained;
  player.records.recentRealities.pop();
  player.records.recentRealities.unshift([
    trueTime,
    time,
    realTime,
    rm.times(ampFactor),
    realities,
    reality,
    level,
    shards.mul(ampFactor),
    projIM,
  ]);
}


export function gainedInfinities() {
  if (EternityChallenge(4).isRunning || Pelle.isDisabled("InfinitiedMults")) return DC.D1;
  let infGain = Decimal.max(1, Achievement(87).effectOrDefault(1));

  infGain = infGain.timesEffectsOf(
    TimeStudy(32),
    RealityUpgrade(5),
    RealityUpgrade(7),
    Achievement(131).effects.infinitiesGain,
    Achievement(164),
    Ra.unlocks.continuousTTBoost.effects.infinity
  );
  infGain = infGain.times(getAdjustedGlyphEffect("infinityinfmult"));
  if (LHC.voidRunning) infGain = infGain.timesEffectOf(LHCNullUpgrade.infinityMult);
  infGain = infGain.powEffectOf(SingularityMilestone.infinitiedPow);
  if (ResurgenceUpgrade.curr1Surge.isBought && !player.disablePostReality) {
    infGain = infGain.pow(player.infinities.max(1e10).log10().log10());
  }
  return infGain;
}

export function gainedCelestialInfinities() {
  return DC.D1;
}

export function gainedCelestialInfinityPoints() {
  const div = 308 * CelestialEternityUpgrade.betterCIP.effectOrDefault(1) *
    CelestialEternityPlusUpgrade.betterCIPFormula.effectOrDefault(1);
  let cip = player.endgame.celDimExpansion.isBroken
    ? Decimal.pow10(player.records.thisCelestialInfinity.maxCM.add(1).log10().div(div).sub(0.75))
    : new Decimal(308 / div);
  cip = cip.times(GameCache.totalCIPMult.value);

  return cip.floor();
}

function totalCEPMult() {
  return CelestialEternityUpgrade.cepMult.effectOrDefault(1);
}

export function gainedCelestialEternityPoints() {
  let cep = DC.D5.pow(player.records.thisCelestialEternity.maxCIP.plus(
    gainedCelestialInfinityPoints()).add(1).log10().div(308).sub(0.7)).times(totalCEPMult());

  cep = cep.min(DC.E4000).times(Decimal.pow10(1000 / 3).pow(cep.max(1).log10().div(4000).max(1).log10()));

  return cep.floor();
}

export function gainedCondenses() {
  return DC.D1.timesEffectOf(Achievement(261));
}

export function gainedDivineStars() {
  const div = EndgameMastery(231).effectOrDefault(308);
  let stars = Decimal.pow10(player.records.thisCondense.maxVM.add(1).log10().div(div).sub(0.75));
  stars = stars.timesEffectOf(DivinityUpgrade.divineL4U1.effects.stars);
  return stars.floor();
}

function totalNebMult() {
  return DC.D1;
}

export function gainedNebulae() {
  let nebulae = DC.D5.pow(player.records.thisSupernova.maxVS.plus(
    gainedDivineStars()).add(1).log10().div(308).sub(0.7)).times(totalNebMult());

  nebulae = nebulae.min(DC.E100).times(nebulae.div(DC.E100).max(1).pow(0.1));
  nebulae = nebulae.min(DC.E1000).times(nebulae.div(DC.E1000).max(1).pow(0.1));

  return nebulae.floor();
}

export function gainedCelestialPoints() {
  if (!player.break2) return DC.D1;
  let cp = player.celestials.pelle.records.totalEndgameAntimatter.add(1).log10().div(9e15);
  if (Achievement(297).isUnlocked && !player.disablePostReality) {
    const factor = 9e15 * (1e100 ** (0.5 ** player.celestials.pelle.divinities));
    cp = cp.times(Decimal.max(factor, player.celestials.pelle.records.totalEndgameAntimatter.add(1).log10()).div(factor));
  }
  cp = Alpha.isDestroyed ? cp : Decimal.max(Decimal.min(cp, DC.NUMMAX.sub(player.endgame.celestialPoints)), 0);
  cp = Decimal.pow(cp, Decimal.pow(2 * EndgameMastery(232).effectOrDefault(1), player.celestials.pelle.divinities));
  cp = cp.powEffectsOf(EndgameMastery(212));
  return cp.floor();
}

export function gainedDoomedParticles() {
  if (!player.break2) return DC.D1;
  let dp = Alpha.isDestroyed
    ? player.celestials.pelle.records.totalEndgameAntimatter.add(1).log10().div(9e15)
    : Decimal.max(Decimal.min(player.celestials.pelle.records.totalEndgameAntimatter.add(1).log10().div(9e15),
      new Decimal(1e100 - player.endgame.doomedParticles.toNumber())), 0);
  dp = Decimal.pow(dp, Decimal.pow(2, player.celestials.pelle.divinities));
  return dp.floor();
}

export function addEndgameTime(time, realTime, cp, dp, endgames) {
  player.records.recentEndgames.pop();
  player.records.recentEndgames.unshift([time, realTime, cp, dp, endgames]);
}

export function updateRefresh() {
  GameStorage.save();
  location.reload(true);
}

export const GAME_SPEED_EFFECT = {
  FIXED_SPEED: 1,
  TIME_GLYPH: 2,
  BLACK_HOLE: 3,
  TIME_STORAGE: 4,
  SINGULARITY_MILESTONE: 5,
  NERFS: 6,
  CELESTIAL_MATTER: 7
};

/**
  * @param {number[]?} effectsToConsider A list of various game speed changing effects to apply when calculating
  *   the game speed.  If left undefined, all effects will be applied.
  * @param {number?} blackHolesActiveOverride A numerical value which forces all black holes up to its specified index
  *   to be active for the purposes of game speed calculation. This is only used during offline black hole stuff.
  */
export function getGameSpeedupFactor(effectsToConsider, blackHolesActiveOverride) {
  let effects;
  if (effectsToConsider === undefined) {
    effects = [GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH, GAME_SPEED_EFFECT.BLACK_HOLE,
      GAME_SPEED_EFFECT.TIME_STORAGE, GAME_SPEED_EFFECT.SINGULARITY_MILESTONE, GAME_SPEED_EFFECT.NERFS,
      GAME_SPEED_EFFECT.CELESTIAL_MATTER];
  } else {
    effects = effectsToConsider;
  }

  if (effects.includes(GAME_SPEED_EFFECT.FIXED_SPEED) && !Hell.isInside) {
    if (EternityChallenge(12).isRunning) {
      return Decimal.mul(1 / 1000, dev.speedUp);
    }
    if (player.endgame.overcharge.isRunning || player.compression.active) return new Decimal(1 / 1000);
    if (player.universes.current >= 1 &&
      (player.universes.current === 1 || player.universes.current % 2 === 0)) return new Decimal(1 / 1000);
  }

  let factor = DC.D1;
  if (effects.includes(GAME_SPEED_EFFECT.BLACK_HOLE)) {
    if (BlackHoles.areNegative) {
      factor = factor.div(player.blackHoleNegative);
    } else if (!BlackHoles.arePaused) {
      for (const blackHole of BlackHoles.list) {
        if (!blackHole.isUnlocked) break;
        const isActive = blackHolesActiveOverride === undefined
          ? blackHole.isActive
          : blackHole.id <= blackHolesActiveOverride;
        if (!isActive) break;
        factor = factor.mul(blackHole.power.pow(BlackHoles.unpauseAccelerationFactor));
        factor = factor.mul(VUnlocks.achievementBH.effectOrDefault(1));
        if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) {
          factor = factor.pow(Achievements.powerConv(VUnlocks.achievementBH.effectOrDefault(1)));
        }
        if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) {
          factor = factor.pow(Achievements.powerConv(VUnlocks.achievementBH.effectOrDefault(1)));
        }
      }
    }
  }

  if (effects.includes(GAME_SPEED_EFFECT.SINGULARITY_MILESTONE)) {
    factor = factor.mul(SingularityMilestone.gamespeedFromSingularities.effectOrDefault(1));
  }

  if (effects.includes(GAME_SPEED_EFFECT.TIME_GLYPH)) {
    factor = factor.mul(getAdjustedGlyphEffect("timespeed"));
    factor = factor.pow(getAdjustedGlyphEffect("effarigblackhole"));
  }

  if (effects.includes(GAME_SPEED_EFFECT.CELESTIAL_MATTER)) {
    const celestialMatterExponent = CelestialDimensions.conversionExponent;
    if (player.endgame.celestialMatter.gt(0) && player.endgame.celestialMatterMultiplier.isActive) {
      factor = factor.mul(Decimal.pow(player.endgame.celestialMatter, celestialMatterExponent));
    }
    factor = factor.timesEffectOf(CelestialInfinityUpgrade.gameSpeedMultCIP);
  }

  factor = factor.mul(GlitchRifts.alpha.milestones[2].effectOrDefault(1));
  factor = factor.pow(VUnlocks.gamespeedPower.effectOrDefault(1));
  factor = factor.timesEffectOf(Ra.unlocks.gameSpeedTesseractBoost);
  factor = factor.powEffectOf(Ra.unlocks.gameSpeedImprovement);
  factor = factor.pow(MetaFabricatorUpgrades.all[2].effectOrDefault(1));


  if (Enslaved.isStoringGameTime && effects.includes(GAME_SPEED_EFFECT.TIME_STORAGE)) {
    const storedTimeWeight = (Ra.unlocks.autoPulseTime.canBeApplied || ExpansionPack.enslavedPack.isBought) &&
      !player.disablePostReality ? 0.99 : 1;
    factor = factor.mul(1 - storedTimeWeight).add(storedTimeWeight);
  }

  // These effects should always be active, but need to be disabled during offline black hole simulations because
  // otherwise it gets applied twice
  if (effects.includes(GAME_SPEED_EFFECT.NERFS)) {
    if (Effarig.isRunning) {
      if (factor.gt(1)) factor = Effarig.multiplier(factor);
    } else if (Laitela.isRunning && !GlitchRealityUpgrade(8).isBought) {
      const divisor = ExpansionPack.laitelaPack.isBought && !player.disablePostReality ? 5 : 10;
      const nerfModifier = Time.thisRealityRealTime.totalMinutes.div(divisor).clampMax(1);
      factor = factor.pow(nerfModifier);
    }
  }

  factor = factor.mul(PelleUpgrade.timeSpeedMult.effectValue);

  factor = factor.pow(MetaFabricatorUpgrade(3).effectOrDefault(1));
  if (EndgameUpgrade(7).isBought && !player.disablePostReality && player.endgame.celestialMatterMultiplier.isActive &&
    !Teresa.isRunning && !Effarig.isRunning && !Enslaved.isRunning && !V.isRunning && !Ra.isRunning &&
    !Laitela.isRunning && !Pelle.isDoomed) {
    factor = Decimal.max(factor, player.records.thisEndgame.peakGameSpeed);
  }
  // 1e-300 is now possible with max inverted BH, going below it would be possible with
  // an effarig glyph.
  if (player.pelleResets == 0) factor = Decimal.max(factor, 1e-300);

  // Applied last so no later effect (Dilation-like exponents, the peak speed floor) can undo the slowdown
  return factor.mul(Hell.gameSpeedMult);
}

export function getGameSpeedupForDisplay() {
  const speedFactor = GameCache.gameSpeed.value;
  if (
    Enslaved.isAutoReleasing &&
    Enslaved.canRelease(true) &&
    !BlackHoles.areNegative &&
    !Pelle.isDisabled("blackhole")
  ) {
    return Decimal.max(Enslaved.autoReleaseSpeed, speedFactor);
  }
  return speedFactor;
}

// Seperated for organisation - Very few things should need this
export function trueTimeMechanics(trueDiff) {
  if (!Hell.isPassiveSTDLocked) player.IAP.STDcoins = player.IAP.STDcoins.add(trueDiff / (1000 * 150));

  // Ra-Nameless auto-release stored time (once every 5 ticks)
  if (Enslaved.isAutoReleasing) {
    Enslaved.autoReleaseTick++;
  }
  if (Enslaved.autoReleaseTick >= 5) {
    Enslaved.autoReleaseTick = 0;
    Enslaved.useStoredTime(true);
    Enslaved.isReleaseTick = true;
  } else if (!Enslaved.isReleaseTick) {
    Enslaved.nextTickDiff = trueDiff;
  }

  if (Enslaved.isStoringRealTime) Autobuyers.trueTick();
  Tutorial.tutorialLoop();

  if (Achievement(165).isUnlocked && player.celestials.effarig.autoAdjustGlyphWeights) {
    autoAdjustGlyphWeights();
  }
}

// Separated out for organization; however this is also used in more than one spot in gameLoop() as well. Returns
// true if the rest of the game loop should be skipped
export function realTimeMechanics(realDiff) {

  if (!player.disablePostReality) Currency.riftForce.add(Glitch.riftForceGain.mul(Decimal.div(realDiff, 1000)));

  if (MetaFabricatorUpgrade(8).isBought && !Pelle.isDoomed && !player.disablePostReality) player.celestials.teresa.bestRunAM = player.celestials.teresa.bestRunAM.max(Currency.antimatter.value);

  if (!player.disablePostReality && realDiff.gt(0)) player.celestials.v.metaTheorems = player.celestials.v.metaTheorems.add(MetaFabricatorUpgrade(20).effectOrDefault(DC.D0).div(Decimal.div(1000, realDiff))).min(1000);
  V.updateTotalRunUnlocks();

  // Ra memory generation bypasses stored real time, but memory chunk generation is disabled when storing real time.
  // This is in order to prevent players from using time inside of Ra's reality for amplification as well
  Ra.memoryTick(realDiff, !Enslaved.isStoringRealTime && !player.disablePostReality);
  if (AlchemyResource.momentum.isUnlocked && !player.disablePostReality) {
    player.celestials.ra.momentumTime = player.celestials.ra.momentumTime.add(
      realDiff.times(Effects.product(Achievement(175), EndgameMastery(171), Achievement(222))));
  }

  if (MetaFabricatorUpgrade(17).isBought && !player.disablePostReality) {
    AlchemyResource.all.forEach(a => a.amount = Ra.alchemyResourceCap);
  }

  GameCache.divineDimensionCommonMultiplier.invalidate();
  if (!player.disablePostReality || LHC.voidRunning) DivineDimensions.tick(realDiff);
  if (!player.disablePostReality) {
    CelestialDimensions.tick(realDiff);
    if (!Pelle.isDoomed) DarkMatterDimensions.tick(realDiff);
  }

  if (EndgameUpgrade(8).isBought && !player.disablePostReality) {
    let endgameMult = DC.D1.times((ExpansionPack.enslavedPack.isBought && !player.disablePostReality)
      ? getTesseractEndgameMultiplier()
      : 1).times(Math.pow(1.33, Alpha.currentStage));
    if (DivinityMilestone.firstDivine.isReached && !player.disablePostReality) endgameMult = endgameMult.times(10);
    endgameMult = endgameMult.times(DivineDimensions.conversionFormula1);
    const timePerEndgame = Alpha.isDestroyed
      ? Decimal.clampMin(330, EndgameUpgrade(8).effectValue)
      : Decimal.clampMin(1000, EndgameUpgrade(8).effectValue);
    const endgameProgress = player.endgame.partEndgamed.plus(endgameMult.times(realDiff).div(timePerEndgame));
    const endgamesToAdd = endgameProgress.floor();
    Currency.endgames.add(endgamesToAdd);
    player.endgame.partEndgamed = endgameProgress.minus(endgamesToAdd);
  }

  if (!player.disablePostReality) {
    CanteReplicators.tick(realDiff);
    if (Null.isUnlocked) NullCycles.tick(realDiff);
    Currency.artificialMatter.add(CanteUpgrades.all[11].canBeApplied ? CanteReplicators.totalArtMatterGain().mul(realDiff.div(1000)) : 0);
    Currency.chaosMatter.add(CanteUpgrades.all[17].effectOrDefault(DC.D0).mul(realDiff.div(1000)));
  }

  if (Ethereal.isUnlocked) {
    Currency.etherealPower.add(getEtherealPowerGainPerSecond().times(realDiff).div(1000));
  }
  if (Ethereal.isStarPowerUnlocked) {
    Currency.starPower.add(getStarPowerGainPerSecond().times(realDiff).div(1000));
    for (let star = 0; star < 9; star++) {
      freeStarReset(star, realDiff);
    }
  }
  tryAdvanceSector();

  // When storing real time, skip everything else having to do with production once stats are updated
  if (Enslaved.isStoringRealTime || realityUGs.all[7].isBought) {
    if (Enslaved.isStoringRealTime) {
      player.records.realTimePlayed = player.records.realTimePlayed.add(realDiff);
      player.records.thisInfinity.realTime = player.records.thisInfinity.realTime.add(realDiff);
      player.records.thisEternity.realTime = player.records.thisEternity.realTime.add(realDiff);
      player.records.thisReality.realTime = player.records.thisReality.realTime.add(realDiff);
      player.records.thisCelestialInfinity.realTime += realDiff.toNumber();
      player.records.thisCelestialEternity.realTime += realDiff.toNumber();
      player.records.thisMeta.realTime = player.records.thisMeta.realTime.add(realDiff);
    }
    Enslaved.storeRealTime(realDiff);
    // Most autobuyers will only tick usefully on the very first tick, but this needs to be here in order to allow
    // the autobuyers unaffected by time storage to tick as well
    GameUI.update();
    if (realityUGs.all[7].isBought) {
      Autobuyers.tick();
      if (!player.disablePostReality) BlackHoles.updatePhases(realDiff);
      return false;
    }
    return true;
  }

  Autobuyers.tick();
  if (!player.disablePostReality) BlackHoles.updatePhases(realDiff);
  return false;
}

// "passDiff" is in ms. It is only unspecified when it's being called normally and not due to simulating time, in which
// case it uses the gap between now and the last time the function was called (capped at a day). This is on average
// equal to the update rate, but may be much larger if the game was unfocused or the device went to sleep for some time.
// eslint-disable-next-line complexity
export function gameLoop(passedDiff, options = {}) {
  PerformanceStats.start("Frame Time");
  PerformanceStats.start("Game Update");

  EventHub.dispatch(GAME_EVENT.GAME_TICK_BEFORE);
  Hell.enforceTraps();

  // In certain cases we want to allow the player to interact with the game's settings and tabs, but prevent any actual
  // resource generation from happening - in these cases, we have to make sure this all comes before the hibernation
  // check or else it'll attempt to run the game anyway
  if (Speedrun.isPausedAtStart() || GameEnd.creditsEverClosed) {
    GameUI.update();
    return;
  }
  const thisUpdate = Date.now();
  // Real-time credits roll once the 9th Dimension has been bought; they freeze all other progress
  const creditsRealDiff = Math.clamp(thisUpdate - player.lastUpdate, 1, 8.64e7);
  const creditsPeople = role => GameDatabase.endgameCredits.people.countWhere(
    x => (typeof x.roles === "number" ? x.roles === role : x.roles.includes(role)));
  if (player.celestials.slabdrill.hasBoughtNinthDimension && player.endgame.creditsTick < 13.01e6) {
    player.endgame.credits = true;
  }
  if (player.endgame.credits && (player.endgame.creditsTick < 13.01e6 ||
    (player.endgame.creditsTick >= 13.015e6 && player.endgame.creditsTick < 13.02e6))) {
    player.endgame.creditsTick += creditsRealDiff;
  }
  if (player.endgame.creditsTick >= 13.02e6) player.endgame.credits = false;
  const creditsRole = Math.floor(player.endgame.creditsTick / 1000000);
  const creditsPerson = Math.floor((player.endgame.creditsTick % 1000000) / 10000);
  const creditsInPerson = player.endgame.creditsTick % 10000;
  const nextRoleTick = (creditsRole + 1) * 1000000;
  const nextPersonTick = (Math.floor(player.endgame.creditsTick / 10000) + 1) * 10000;
  if (creditsRole === 0) {
    if (creditsPerson >= 2) player.endgame.creditsTick = nextRoleTick;
  } else if (creditsRole <= 11) {
    const limit = creditsRole === 11 ? 7000 : 4500;
    if (creditsInPerson >= limit) {
      player.endgame.creditsTick = creditsPerson >= creditsPeople(creditsRole) - 1
        ? nextRoleTick : nextPersonTick;
    }
  } else if (creditsRole === 12 && creditsPerson >= 1) {
    player.endgame.creditsTick = nextRoleTick;
  }
  const passDiff = passedDiff === undefined
    ? Math.clamp(thisUpdate - player.lastUpdate, 1, 8.64e7) : passedDiff;
    // This is really, really bad but we dont want 0 getting passed into every function on the fucking earth
  let diff = new Decimal(passDiff);
  const trueDiff = passDiff === undefined
    ? Math.clamp(thisUpdate - player.lastUpdate, 1, 8.64e7)
    : passDiff;
  // eslint-disable-next-line prefer-const
  let realDiff = new Decimal(trueDiff);
  if (player.endgame.credits) {
    diff = new Decimal(0);
    realDiff = new Decimal(0);
  }
  if (!GameStorage.ignoreBackupTimer) player.backupTimer += trueDiff;

  // For single ticks longer than a minute from the GameInterval loop, we assume that the device has gone to sleep or
  // hibernation - in those cases we stop the interval and simulate time instead. The gameLoop interval automatically
  // restarts itself at the end of the simulateTime call. This will not trigger for an unfocused game, as this seems to
  // result in a ~1 second tick rate for browsers.
  // Note that we have to explicitly call all the real-time mechanics with the existing value of realDiff, because
  // simply letting it run through simulateTime seems to result in it using zero
  if (player.options.hibernationCatchup && passDiff === undefined && trueDiff > 6e4) {
    GameIntervals.gameLoop.stop();
    simulateTime(trueDiff / 1000, true);
    trueTimeMechanics(trueDiff);
    realTimeMechanics(realDiff);
    return;
  }

  trueTimeMechanics(trueDiff);

  if (diff === undefined || Enslaved.isReleaseTick) {
    diff = new Decimal(Enslaved.nextTickDiff);
  }
  // Run all the functions which only depend on real time and not game time, skipping the rest of the loop if needed
  if (realTimeMechanics(realDiff)) return;
  autoBuyHypercubes();


  // We do these after autobuyers, since it's possible something there might
  // change a multiplier.
  GameCache.gameSpeed.invalidate();
  GameCache.tickspeedPerSecond.invalidate();
  GameCache.antimatterDimensionCommonMultiplier.invalidate();
  GameCache.antimatterDimensionFinalMultipliers.invalidate();
  GameCache.infinityDimensionCommonMultiplier.invalidate();
  GameCache.timeDimensionCommonMultiplier.invalidate();
  GameCache.totalIPMult.invalidate();

  const fixedSpeedActive = !Hell.isInside && (EternityChallenge(12).isRunning ||
    player.endgame.overcharge.isRunning || player.compression.active ||
    (player.universes.current >= 1 && (player.universes.current === 1 || player.universes.current % 2 === 0)));
  if (!Enslaved.isReleaseTick && !fixedSpeedActive) {
    let speedFactor;
    if (options.blackHoleSpeedup === undefined) {
      speedFactor = GameCache.gameSpeed.value;
    } else {
      // This is only called from simulateTime() and is calculated externally in order to avoid weirdness when game
      // speed is directly nerfed
      speedFactor = options.blackHoleSpeedup;
    }

    if (Enslaved.isStoringGameTime && !fixedSpeedActive) {
      // These variables are the actual game speed used and the game speed unaffected by time storage, respectively
      const reducedTimeFactor = GameCache.gameSpeed.value;
      const totalTimeFactor = getGameSpeedupFactor([GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH,
        GAME_SPEED_EFFECT.BLACK_HOLE, GAME_SPEED_EFFECT.SINGULARITY_MILESTONE, GAME_SPEED_EFFECT.CELESTIAL_MATTER]);
      const multiplicandFactor = EndgameUpgrade(7).isBought && !player.disablePostReality
        ? getGameSpeedupFactor()
        : totalTimeFactor.sub(reducedTimeFactor);
      const amplification = Ra.unlocks.improvedStoredTime.effects.gameTimeAmplification.effectOrDefault(1);
      const beforeStore = player.celestials.enslaved.stored;
      player.celestials.enslaved.stored = Decimal.clampMax(player.celestials.enslaved.stored
        .add(diff.times(multiplicandFactor).times(amplification)), Enslaved.timeCap);
      Enslaved.currentBlackHoleStoreAmountPerMs = (player.celestials.enslaved.stored.sub(beforeStore)).div(diff);
      speedFactor = reducedTimeFactor;
    }
    diff = diff.times(speedFactor);
  } else if (fixedSpeedActive) {
    diff = diff.times(GameCache.gameSpeed.value);
    Enslaved.currentBlackHoleStoreAmountPerMs = DC.D0;
  }
  player.celestials.ra.peakGamespeed = player.celestials.ra.peakGamespeed.clampMin(getGameSpeedupFactor());
  player.records.thisEndgame.peakGameSpeed = Decimal.max(
    player.records.thisEndgame.peakGameSpeed,
    getGameSpeedupFactor()
  );
  Enslaved.isReleaseTick = false;

  diff = new Decimal(diff);
  // These need to all be done consecutively in order to minimize the chance of a reset occurring between real time
  // updating and game time updating. This is only particularly noticeable when game speed is 1 and the player
  // expects to see identical numbers. We also don't increment the timers if the game has been beaten (Achievement 188)
  const isEndReached = false;
  if (!isEndReached) {
    player.records.realTimeDoomed = player.records.realTimeDoomed.add(realDiff);
    player.records.realTimePlayed = player.records.realTimePlayed.add(realDiff);
    player.records.totalTimePlayed = player.records.totalTimePlayed.add(diff);
    if (player.blackHole[0].unlocked) {
      player.records.timeSinceBHUnlock = player.records.timeSinceBHUnlock.add(diff);
    }
    player.records.thisInfinity.realTime = player.records.thisInfinity.realTime.add(realDiff);
    player.records.thisInfinity.time = player.records.thisInfinity.time.add(diff);
    player.records.thisEternity.realTime = player.records.thisEternity.realTime.add(realDiff);
    if (Enslaved.isRunning && Enslaved.feltEternity && !EternityChallenge(12).isRunning) {
      player.records.thisEternity.time = player.records.thisEternity.time.add(Currency.eternities.value.min((player.pelleResets > 0) ? 1e308 : 1e66));
    } else {
      player.records.thisEternity.time = player.records.thisEternity.time.add(diff);
    }
    player.records.thisReality.realTime = player.records.thisReality.realTime.add(realDiff);
    player.records.thisMeta.realTime = player.records.thisMeta.realTime.add(realDiff);
    player.records.thisReality.time = player.records.thisReality.time.add(diff);
    player.records.thisEndgame.realTime += realDiff.toNumber();
    player.records.thisEndgame.time = player.records.thisEndgame.time.add(diff);
    player.records.thisCelestialInfinity.realTime += realDiff.toNumber();
    player.records.thisCelestialInfinity.time = player.records.thisCelestialInfinity.time.add(diff);
    player.records.thisCelestialEternity.realTime += realDiff.toNumber();
    player.records.thisCelestialEternity.time = player.records.thisCelestialEternity.time.add(diff);
    player.records.thisCondense.realTime += realDiff.toNumber();
    player.records.thisCondense.time = player.records.thisCondense.time.add(diff);
    player.records.thisSupernova.realTime += realDiff.toNumber();
    player.records.thisSupernova.time = player.records.thisSupernova.time.add(diff);

    player.records.trueTimePlayed += trueDiff;
    player.records.thisInfinity.trueTime += trueDiff;
    player.records.thisEternity.trueTime += trueDiff;
    player.records.thisReality.trueTime += trueDiff;
    player.records.thisMeta.trueTime += trueDiff;
    player.records.thisMeta.time = player.records.thisMeta.time.add(diff);
  }

  DeltaTimeState.update(trueDiff, realDiff, diff);

  if (player.celestials.slabdrill.isWarping && player.celestials.slabdrill.warpTick < 2000) {
    player.celestials.slabdrill.warpTick += realDiff.toNumber();
  }
  if (player.celestials.slabdrill.isWarping && player.celestials.slabdrill.warpTick >= 2000 &&
    player.celestials.slabdrill.warpTick < 3000) {
    Quotes.slabdrill.curse.show();
    if (!ui.$viewModel.quotes.current) Quote.addToQueue(Quotes.slabdrill.curse);
  }
  if (player.celestials.slabdrill.isWarping && player.celestials.slabdrill.warpTick >= 3000 &&
    player.celestials.slabdrill.warpTick < 5000) {
    player.celestials.slabdrill.warpTick += realDiff.toNumber();
  }

  updateNormalAndInfinityChallenges(diff);

  const slab = player.celestials.slabdrill;
  if (slab.isGoodbye) {
    const realMs = new Decimal(realDiff).toNumber();
    if (slab.goodbyeTick < 1000 || (slab.goodbyeTick >= 3000 && slab.goodbyeTick < 8000) ||
      (slab.goodbyeTick >= 10000 && slab.goodbyeTick < 40000)) slab.goodbyeTick += realMs;
    if (slab.goodbyeTick >= 1000 && slab.goodbyeTick < 2000) {
      if (Slabdrill.isCursed && Slabdrill.currentStage === 10) Slabdrill.advanceLayer();
      if (!ui.$viewModel.quotes.current) Quote.addToQueue(Quotes.slabdrill.reality);
    }
    if (slab.goodbyeTick >= 8000 && slab.goodbyeTick < 9000 && !ui.$viewModel.quotes.current) {
      Quote.addToQueue(Quotes.slabdrill.glitch);
    }
  }
  if (slab.goodbyeTick >= 40000 && slab.goodbyeTick < 50000) {
    slab.isGoodbye = false;
    slab.goodbyeTick = 50000;
  }
  if (Slabdrill.isCursed && slab.goodbyeTick >= 50000) {
    const tickGain = new Decimal(realDiff).toNumber();
    slab.goodbyeTick = AntimatterDimension(9).amount.eq(0)
      ? Math.min(slab.goodbyeTick + tickGain, 120000)
      : slab.goodbyeTick + tickGain;
  }

  // IP generation is broken into a couple of places in gameLoop; changing that might change the
  // behavior of eternity farming.
  preProductionGenerateIP(diff);
  if (!player.disablePostReality) preProductionGenerateVS(realDiff);

  if (!Pelle.isDoomed || MetaFabricatorUpgrade(7)) {
    passivePrestigeGen();
  }

  applyAutoprestige(realDiff);
  updateImaginaryMachines(realDiff);
  updateDualMachines(realDiff);

  const uncountabilityGain = new Decimal(AlchemyResource.uncountability.effectValue)
    .times(Time.realDeltaTime.totalSeconds);
  Currency.realities.add(uncountabilityGain);
  Currency.perkPoints.add(uncountabilityGain.mul(GlitchRifts.gamma.milestones[1].effectOrDefault(1)));
  const masteryGain = new Decimal(EndgameMastery(11).effectOrDefault(0))
    .times(Time.realDeltaTime.totalSeconds.div(60));
  Currency.perkPoints.add(masteryGain);

  if (Perk.autocompleteEC1.canBeApplied) player.reality.lastAutoEC = player.reality.lastAutoEC.add(realDiff);

  EternityChallenge(12).tryFail();
  Achievements._power.invalidate();

  TimeDimensions.tick(diff);
  InfinityDimensions.tick(diff);
  AntimatterDimensions.tick(diff);
  if (DivinityMilestone.automaticDivinity.isReached && Pelle.isDoomed && Currency.antimatter.gte(DC.ENUMMAX) &&
    automaticDivinity()) {
    return;
  }
  GameCache.chaosDimensionCommonMultiplier.invalidate();
  ChaosDimensions.tick(realDiff);
  player.records.bestAntimatterExponentOutsideDoom = Decimal.max(
    Decimal.log10(Decimal.max(player.records.totalAntimatterOutsideDoom, 1)),
    player.records.bestAntimatterExponentOutsideDoom
  );

  const gain = Decimal.clampMin(FreeTickspeed.fromShards(Currency.timeShards.value).newAmount
    .sub(player.totalTickGained), 0);
  player.totalTickGained = player.totalTickGained.add(gain);

  updatePrestigeRates();
  tryCompleteInfinityChallenges();

  EternityChallenges.autoComplete.tick();

  NormalChallenges.tryChargeAll();

  replicantiLoop(diff);

  if (PlayerProgress.dilationUnlocked()) {
    Currency.dilatedTime.add(getDilationGainPerSecond().times(diff.div(1000)));
  }

  updateTachyonGalaxies();
  Currency.timeTheorems.add(getTTPerSecond().times(diff.div(1000)));
  Currency.endgameSkills.add(getESPerSecond().times(realDiff).div(1000));
  if (GalacticPower.isUnlocked) {
    Currency.galacticPower.add(getGalacticPowerGainPerSecond().times(realDiff).div(1000));
  }
  InfinityDimensions.tryAutoUnlock();

  // Unlocks dilation at a certain total TT count for free, but we add the cost first in order to make
  // sure that TT count doesn't go negative and that we can actually buy it. This technically bumps the max theorem
  // amount up as well, but at this point of the game 5k TT is insignificant to basically all other sources of TT.
  if (Ra.unlocks.autoUnlockDilation.canBeApplied &&
    Currency.timeTheorems.max.gte(TimeStudy.dilation.totalTimeTheoremRequirement) &&
    !isInCelestialReality() &&
    !Pelle.isDoomed) {
    Currency.timeTheorems.add(TimeStudy.dilation.cost);
    TimeStudy.dilation.purchase(true);
  }

  applyAutoUnlockPerks();
  if (GlyphSelection.active) GlyphSelection.update(gainedGlyphLevel());

  // There are some external checks which prevent excessive resource gain with Teresa-25; it may give TP outside of
  // dilation, but the TP gain function is also coded to behave differently if it's active
  const teresa1 = player.dilation.active && Ra.unlocks.autoTP.canBeApplied;
  const teresa25 = !isInCelestialReality() && Ra.unlocks.unlockDilationStartingTP.canBeApplied;
  if ((teresa1 || teresa25) && !Pelle.isDoomed) rewardTP();

  if (Enslaved.canTickHintTimer) {
    player.celestials.enslaved.hintUnlockProgress += Enslaved.isRunning ? realDiff.clampMax(1e10).toNumber()
      : realDiff.mul(0.4).clampMax(1e10).toNumber();
    if (player.celestials.enslaved.hintUnlockProgress > (TimeSpan.fromHours(5).totalMilliseconds.toNumber())) {
      EnslavedProgress.hintsUnlocked.giveProgress();
      Enslaved.quotes.hintUnlock.show();
    }
  }

  if (Slabdrill.isCursed) {
    Slabdrill.checkStrikeCatchUp();
    Currency.serpentinePower.add(Slabdrill.powerPerSecond(realDiff));
    const slabBoost = SlabdrillUnlocks.timeStudy181.isUnlocked
      ? Ra.unlocks.maxGlyphRarityAndShardSacrificeBoost.effectOrDefault(1)
      : 1;
    const sac = player.reality.glyphs.sac;
    if (Slabdrill.currentStage >= 2) sac.power = Slabdrill.power.pow(slabBoost);
    if (Slabdrill.currentStage >= 4) sac.infinity = Slabdrill.power.pow(slabBoost);
    if (Slabdrill.currentStage >= 6) sac.replication = Slabdrill.power.pow(slabBoost);
    if (Slabdrill.currentStage >= 8) sac.time = Slabdrill.power.pow(slabBoost);
    if (Slabdrill.currentStage >= 10) sac.dilation = Slabdrill.power.pow(slabBoost);
    if (SlabdrillUnlocks.timeStudy181.isUnlocked) {
      player.celestials.effarig.relicShards = Slabdrill.power.times(
        SlabdrillUnlocks.dilation.isUnlocked ? AlchemyResource.effarig.effectValue : 1);
    }
    if (SlabdrillUnlocks.dilation.isUnlocked) {
      for (let ca = 0; ca < 5; ca++) player.celestials.ra.alchemy[ca].amount = AlchemyResource.all[ca].cap;
      player.celestials.ra.alchemy[10].amount = AlchemyResource.all[10].cap;
    }
  }

  const hadrons = player.celestials.laitela.hadrons;
  const waves = player.compression.totalElectromagneticWaves.toNumber();
  hadrons.trueTotal = hadrons.total + waves;
  hadrons.totalLight = hadrons.light + waves;
  hadrons.totalDark = hadrons.dark + waves;
  hadrons.totalExotic = hadrons.exotic + waves;

  laitelaRealityTick(realDiff);
  if (DivinityMilestone.hadronEmpowerment.isReached && !Pelle.isDoomed) {
    if (player.antimatter.gte(Laitela.antimatterNeededToDestabilize)) {
      player.celestials.laitela.difficultyTier++;
      player.celestials.laitela.fastestCompletion = new Decimal(300);
    }
    if (player.celestials.laitela.difficultyTier >= 8) Laitela.hadronize();
  }
  Achievements.autoAchieveUpdate(diff);
  V.checkForUnlocks();
  V.tickExpansionPack(realDiff);
  AutomatorBackend.update(trueDiff);
  if (ExpansionPack.teresaPack.isBought && player.celestials.teresa.autoPour &&
    !player.disablePostReality && !EndgameUpgrade(10).isLockingMechanics) {
    Teresa.pourRM(realDiff, true);
  }
  Effarig.tickExpansionPackLayers(realDiff);
  Pelle.gameLoop(realDiff);
  if (DivinityMilestone.metaAutomation.isReached) {
    Currency.metaRelays.add(gainedMetaRelays().times(realDiff).div(100000));
  }
  GalaxyGenerator.loop(realDiff);
  GameEnd.gameLoop(trueDiff);
  LHC.gameLoop(trueDiff);
  Alpha.checkForStageCompletion();
  if (Ascension.isUnlocked) player.endgame.ascensionTimer += trueDiff;
  tryAscend();
  const oc = player.endgame.overcharge;
  oc.chargesLeft.infinite = oc.completions.bi - oc.charged.infinite.size;
  oc.chargesLeft.eternal = oc.completions.eter - oc.charged.eternal.size;
  oc.chargesLeft.complex = oc.completions.chall - oc.charged.complex.size;
  oc.chargesLeft.temporal = oc.completions.ts - oc.charged.temporal.size;
  if (PlayerProgress.compressionUnlocked()) {
    Currency.thermalRadiation.add(getThermalRadiationGainPerSecond().times(realDiff).div(1000));
  }
  updateElectromagneticWaves();

  if (LHC.nullifiedVoidRunning) {
    Currency.nullParticles.add(getNullParticleGainPerSecond().times(realDiff).div(1000));
  }
  if (Universes.isIn(1)) {
    Currency.relativisticParticles.add(getRelativisticParticlesPerSecond().times(realDiff).div(1000));
  }
  if (Universes.isIn(2)) {
    Currency.molecularMass.add(getMolecularMassPerSecond().times(realDiff).div(1000));
  }

  if (!Enslaved.canAmplify) {
    Enslaved.boostReality = false;
  }

  // Stopping these checks after CREDITS_START reduces lag and allows for the glyph customization modal to appear
  if (GameEnd.endState < END_STATE_MARKERS.CREDITS_START) {
    if (Tabs.current.isPermanentlyHidden) {
      const tab = Tabs.all.reverse().find(t => !t.isPermanentlyHidden && t.id !== 10);
      if (tab) tab.show(true);
      else [...Tab.dimensions.subtabs].reverse().find(t => !t.isPermanentlyHidden).show(true);
    }

    if (Tabs.current.subtabs.find(t => t.isOpen).isPermanentlyHidden) {
      [...Tab.dimensions.subtabs].reverse().find(t => !t.isPermanentlyHidden).show(true);
    }
  }
  const unnerfedCelestialMatter = player.endgame.unnerfedCelestialMatter;
  const uncapped = Decimal.min(unnerfedCelestialMatter, CelestialDimensions.SOFTCAP);
  const instability = Decimal.pow(
    Decimal.max(unnerfedCelestialMatter.div(CelestialDimensions.SOFTCAP), 1),
    1 / CelestialDimensions.softcapPow
  );
  const beforeOverflow = Decimal.min(uncapped.times(instability), CelestialDimensions.OVERFLOW);
  const afterOverflow = Decimal.pow(
    Decimal.max(uncapped.times(instability).div(CelestialDimensions.OVERFLOW), 1),
    1 / CelestialDimensions.OVERFLOW_MAG
  );
  const beforeMassOverflow = Decimal.min(beforeOverflow.times(afterOverflow), CelestialDimensions.MASS_OVERFLOW);
  const afterMassOverflow = Decimal.pow(
    Decimal.max(beforeOverflow.times(afterOverflow).div(CelestialDimensions.MASS_OVERFLOW), 1),
    1 / CelestialDimensions.MASS_OVERFLOW_MAG
  );
  const totalPending = player.endgame.celDimExpansion.isBroken
    ? beforeMassOverflow.times(afterMassOverflow)
    : Decimal.min(beforeMassOverflow.times(afterMassOverflow), DC.NUMMAX);
  CelestialDimensions.softcapBreakdown = [];
  if (unnerfedCelestialMatter.gt(CelestialDimensions.SOFTCAP)) {
    CelestialDimensions.softcapBreakdown.push({
      key: "celestial-matter-softcap",
      before: unnerfedCelestialMatter,
      after: uncapped.times(instability),
      effectType: "power",
      power: 1 / CelestialDimensions.softcapPow,
    });
  }
  if (uncapped.times(instability).gt(CelestialDimensions.OVERFLOW)) {
    CelestialDimensions.softcapBreakdown.push({
      key: "celestial-matter-overflow",
      before: uncapped.times(instability),
      after: beforeOverflow.times(afterOverflow),
      effectType: "power",
      power: 1 / CelestialDimensions.OVERFLOW_MAG,
    });
  }
  if (beforeOverflow.times(afterOverflow).gt(CelestialDimensions.MASS_OVERFLOW)) {
    CelestialDimensions.softcapBreakdown.push({
      key: "celestial-matter-mass-overflow",
      before: beforeOverflow.times(afterOverflow),
      after: beforeMassOverflow.times(afterMassOverflow),
      effectType: "power",
      power: 1 / CelestialDimensions.MASS_OVERFLOW_MAG,
    });
  }
  player.endgame.celestialMatter = totalPending;
  player.records.thisCelestialInfinity.maxCM = player.records.thisCelestialInfinity.maxCM.max(totalPending);
  player.records.thisCelestialEternity.maxCM = player.records.thisCelestialEternity.maxCM.max(totalPending);
  player.records.thisCelestialReality.maxCM = player.records.thisCelestialReality.maxCM.max(totalPending);
  player.records.totalCelMatter = player.records.totalCelMatter.max(totalPending);
  player.records.totalCelestialRealityCelMatter = player.records.totalCelestialRealityCelMatter.max(totalPending);
  player.records.totalCelestialEternityCelMatter = player.records.totalCelestialEternityCelMatter.max(totalPending);
  player.records.totalCelestialInfinityCelMatter = player.records.totalCelestialInfinityCelMatter.max(totalPending);

  player.records.bestEndgame.galaxies = Decimal.max(
    player.records.bestEndgame.galaxies,
    actualBaseGalaxies()
  );

  EventHub.dispatch(GAME_EVENT.GAME_TICK_AFTER);
  GameUI.update();
  player.lastUpdate = thisUpdate;
  PerformanceStats.end("Game Update");
}

function updatePrestigeRates() {
  const currentIPmin = gainedInfinityPoints().div(Decimal.max(0.0005, Time.thisInfinityRealTime.totalMinutes));
  if (currentIPmin.gt(player.records.thisInfinity.bestIPmin) && Player.canCrunch) {
    player.records.thisInfinity.bestIPmin = currentIPmin;
    player.records.thisInfinity.bestIPminVal = gainedInfinityPoints();
  }

  const currentEPmin = gainedEternityPoints().dividedBy(Decimal.max(0.0005, Time.thisEternityRealTime.totalMinutes));
  if (currentEPmin.gt(player.records.thisEternity.bestEPmin) && Player.canEternity) {
    player.records.thisEternity.bestEPmin = currentEPmin;
    player.records.thisEternity.bestEPminVal = gainedEternityPoints();
  }

  const currentRSmin = Effarig.shardsGained.div(Decimal.max(0.0005, Time.thisRealityRealTime.totalMinutes));
  if (currentRSmin.gt(player.records.thisReality.bestRSmin && isRealityAvailable())) {
    player.records.thisReality.bestRSmin = currentRSmin;
    player.records.thisReality.bestRSminVal = Effarig.shardsGained;
  }

  const currentCEPmin = gainedCelestialEternityPoints().dividedBy(
    Decimal.clampMin(0.0005, Time.thisCelestialEternityRealTime.totalMinutes)
  );
  if (currentCEPmin.gt(player.records.thisCelestialEternity.bestCEPmin) &&
    Currency.celestialInfinityPoints.gte(DC.NUMMAX)) {
    player.records.thisCelestialEternity.bestCEPmin = currentCEPmin;
    player.records.thisCelestialEternity.bestCEPminVal = gainedCelestialEternityPoints();
  }

  const currentVSmin = gainedDivineStars().dividedBy(
    Decimal.clampMin(0.0005, Time.thisCondenseRealTime.totalMinutes)
  );
  if (currentVSmin.gt(player.records.thisCondense.bestVSmin) && Currency.divineMatter.gte(DC.NUMMAX)) {
    player.records.thisCondense.bestVSmin = currentVSmin;
    player.records.thisCondense.bestVSminVal = gainedDivineStars();
  }

  const currentNebmin = gainedNebulae().dividedBy(
    Decimal.clampMin(0.0005, Time.thisSupernovaRealTime.totalMinutes)
  );
  if (currentNebmin.gt(player.records.thisSupernova.bestNebmin) && Currency.divineStars.gte(DC.NUMMAX)) {
    player.records.thisSupernova.bestNebmin = currentNebmin;
    player.records.thisSupernova.bestNebminVal = gainedNebulae();
  }
}

function passivePrestigeGen() {
  let eternitiedGain = 0;
  if (MetaFabricatorUpgrade(7).isBought || (RealityUpgrade(14).isBought && !Glitch.isRunning) || (EffarigUnlock.eternity.isUnlocked && !Glitch.isRunning)) {
    eternitiedGain = DC.D1.timesEffectsOf(
      Achievement(113),
      RealityUpgrade(3),
      RealityUpgrade(14)
    );
    eternitiedGain = Decimal.times(eternitiedGain, getAdjustedGlyphEffect("timeetermult"));
    eternitiedGain = new Decimal(Time.deltaTime).times(
      Decimal.pow(eternitiedGain, AlchemyResource.eternity.effectValue));
    eternitiedGain = eternitiedGain.powEffectOf(Ra.unlocks.eternityGenBuff);
    if (Pelle.isDoomed) eternitiedGain = MetaFabricatorUpgrade(7).isBought ? DC.D1 : DC.D0;
    player.reality.partEternitied = player.reality.partEternitied.plus(eternitiedGain);
    Currency.eternities.add(player.reality.partEternitied.floor());
    player.reality.partEternitied = player.reality.partEternitied.sub(player.reality.partEternitied.floor());
  }

  if (!EternityChallenge(4).isRunning && (!Glitch.isRunning || MetaFabricatorUpgrade(7).isBought)) {
    let infGen = DC.D0;
    if (BreakInfinityUpgrade.infinitiedGen.isBought) {
      // Multipliers are done this way to explicitly exclude ach87 and TS32
      infGen = infGen.plus(Time.deltaTimeMs.div(2).div(Decimal.clampMin(50, player.records.bestInfinity.time)));
      infGen = infGen.timesEffectsOf(
        RealityUpgrade(5),
        RealityUpgrade(7),
        Ra.unlocks.continuousTTBoost.effects.infinity
      );
      infGen = infGen.times(getAdjustedGlyphEffect("infinityinfmult"));
    }
    if (RealityUpgrade(11).isBought && (!Glitch.isRunning || MetaFabricatorUpgrade(7).isBought)) {
      infGen = infGen.plus(RealityUpgrade(11).effectValue.times(Time.deltaTime));
    }
    if (EffarigUnlock.eternity.isUnlocked && (!Glitch.isRunning || MetaFabricatorUpgrade(7).isBought)) {
      // We consider half of the eternities we gained above this tick
      // to have been gained before the infinities, and thus not to
      // count here. This gives us the desirable behavior that
      // infinities and eternities gained overall will be the same
      // for two ticks as for one tick of twice the length.
      infGen = infGen.plus(gainedInfinities().times(
        Currency.eternities.value.minus(eternitiedGain.div(2).floor())).times(Time.deltaTime));
    }
    if (Pelle.isDoomed) infGen = MetaFabricatorUpgrade(7).isBought ? DC.D1 : DC.D0;

    infGen = infGen.plus(player.partInfinitied);
    // The counter can start negative (Hell), in which case nothing is gained until it climbs back above 1
    if (infGen.gte(1)) {
      Currency.infinities.add(infGen.floor());
      player.partInfinitied = infGen.minus(infGen.floor()).toNumber();
    } else {
      player.partInfinitied = infGen.toNumber();
    }
  }
  if (ResurgenceUpgrade.ipSurge.isBought && !player.disablePostReality) {
    Currency.infinityPoints.value = Currency.antimatter.value;
  }
  if (ResurgenceUpgrade.epSurge.isBought && !player.disablePostReality) {
    Currency.eternityPoints.value = Currency.antimatter.value;
  }
}

// Applies all perks which automatically unlock things when passing certain thresholds, needs to be checked every tick
function applyAutoUnlockPerks() {
  if (!TimeDimension(8).isUnlocked && Perk.autounlockTD.canBeApplied) {
    for (let dim = 5; dim <= 8; ++dim) TimeStudy.timeDimension(dim).purchase();
  }
  if (Perk.autounlockDilation3.canBeApplied) buyDilationUpgrade(DilationUpgrade.ttGenerator.id);
  if (Perk.autounlockReality.canBeApplied) TimeStudy.reality.purchase(true);
  applyEU2();
}

function laitelaRealityTick(realDiff) {
  const laitelaInfo = player.celestials.laitela;
  if (!Laitela.isRunning) return;
  if (laitelaInfo.entropy.gte(0)) {
    laitelaInfo.entropy = laitelaInfo.entropy.add(realDiff.div(1e3).mul(Laitela.entropyGainPerSecond));
  }

  // Setting entropy to -1 on completion prevents the modal from showing up repeatedly
  if (laitelaInfo.entropy.gte(1)) {
    let completionText = `Lai'tela's Reality has been destabilized after ${Time.thisRealityRealTime.toStringShort()}.`;
    laitelaInfo.entropy = DC.DM1;
    const oldInfo = {
      fastestCompletion: laitelaInfo.fastestCompletion,
      difficultyTier: laitelaInfo.difficultyTier,
      realityReward: Laitela.realityReward
    };
    laitelaInfo.thisCompletion = Time.thisRealityRealTime.totalSeconds;
    laitelaInfo.fastestCompletion = laitelaInfo.thisCompletion.clampMax(laitelaInfo.fastestCompletion);
    clearCelestialRuns();
    const destabilising = Time.thisRealityRealTime.totalSeconds.lte(30);
    if (destabilising) {
      laitelaInfo.difficultyTier++;
      laitelaInfo.fastestCompletion = new Decimal(300);
      completionText += laitelaBeatText(Laitela.maxAllowedDimension + 1);
      for (const quote of Laitela.quotes.all) {
        if (quote.requirement) {
          quote.show();
        }
      }
    }
    if (Laitela.realityReward.gt(oldInfo.realityReward)) {
      completionText += `<br><br>Dark Matter Multiplier: ${formatX(oldInfo.realityReward, 2, 2)}
      ➜ ${formatX(Laitela.realityReward, 2, 2)}<br>Best Completion Time: `;
      const firstAttempt =
        oldInfo.fastestCompletion.eq(3600) || oldInfo.fastestCompletion.eq(300) && oldInfo.difficultyTier > 0;
      completionText += `${firstAttempt ? "None" : TimeSpan.fromSeconds(oldInfo.fastestCompletion).toStringShort()} ➜
        ${destabilising ? "Destabilized" : TimeSpan.fromSeconds(laitelaInfo.fastestCompletion).toStringShort()}
        <br>Highest Active Dimension: ${destabilising ? `${formatInt(8 - oldInfo.difficultyTier)} ➜` : ""}
          ${formatInt(8 - laitelaInfo.difficultyTier)}`;
      player.records.bestReality.laitelaSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    } else {
      completionText += ` You need to destabilize in faster than
        ${TimeSpan.fromSeconds(laitelaInfo.fastestCompletion).toStringShort()} to improve your multiplier.`;
    }
    if (Laitela.isFullyDestabilized) SpeedrunMilestones(24).tryComplete();
    Modal.message.show(completionText, {}, 2);
  }
}

function laitelaBeatText(disabledDim) {
  switch (disabledDim) {
    case 1: return `<br><br>Lai'tela's Reality will now completely disable production from all Dimensions.
        The Reality can still be entered, but further destabilization is no longer possible.
        For completely destabilizing the Reality, you also get an additional ${formatX(8)} to Dark Energy gain.`;
    case 2: return `<br><br>Lai'tela's Reality will now disable production from all 2nd Dimensions during
      future runs, but the reward will be ${formatInt(100)} times stronger than before. Completely destabilizing
      the Reality for the final Dimension will give you an additional ${formatX(8)} to Dark Energy gain.`;
    case 3: return `<br><br>Lai'tela's Reality will now disable production from all 3rd Dimensions during
        future runs, but the reward will be ${formatInt(100)} times stronger than before.`;
    case 8: return `<br><br>Lai'tela's Reality will now disable production from all 8th Dimensions during
        future runs, but the reward will be ${formatInt(100)} times stronger than before. This boost can be
        repeated for each remaining Dimension by reaching destabilization within ${formatInt(30)} seconds again.`;
    default: return `<br><br>Lai'tela's Reality will now disable production from all
        ${disabledDim}th Dimensions during future runs, but the reward will be
        ${formatInt(100)} times stronger than before.`;
  }
}

// This gives IP/EP/RM from the respective upgrades that reward the prestige currencies continuously
function applyAutoprestige(diff) {
  Currency.infinityPoints.add(MetaFabricatorUpgrade(7).isBought ? TimeStudy(181).effectValue : TimeStudy(181).effectOrDefault(0));

  if (TeresaUnlocks.epGen.canBeApplied || MetaFabricatorUpgrade(7).isBought) {
    Currency.eternityPoints.add(player.records.thisEternity.bestEPmin.times(MetaFabricatorUpgrade(7).isBought ? 1 : DC.D0_01)
      .times(GameCache.gameSpeed.value.times(diff.div(1000)))
      .timesEffectOf(Ra.unlocks.continuousTTBoost.effects.autoPrestige));
  }

  if (InfinityUpgrade.ipGen.isCharged || MetaFabricatorUpgrade(7).isBought) {
    const addedRM = MachineHandler.gainedRealityMachines
      .timesEffectsOf(InfinityUpgrade.ipGen.chargedEffect)
      .times(diff.div(1000));
    Currency.realityMachines.add(addedRM);
  }

  if (PelleRifts.chaos.milestones[2].canBeApplied) {
    Currency.eternityPoints.add(gainedEternityPoints().times(DC.D0_1).times(diff.div(1000)));
  }
}

function updateImaginaryMachines(diff) {
  MachineHandler.updateIMCap();
  Currency.imaginaryMachines.add(MachineHandler.gainedImaginaryMachines(diff));
}

function updateDualMachines(diff) {
  if (!MachineHandler.isDMUnlocked) return;
  MachineHandler.updateDMCap();
  Currency.dualMachines.add(MachineHandler.gainedDualMachines(diff));
}

function updateTachyonGalaxies() {
  const tachyonGalaxyMult = Effects.max(1, DilationUpgrade.doubleGalaxies).times(DilationUpgrade.hellDoubleGalaxies.effectOrDefault(1));
  const tachyonGalaxyThreshold = 1000;
  const galaxiesPerOoM = decimalInfinitesimalLogarithmSolution(getBaseTachyonGalaxyMult());
  player.dilation.baseTachyonGalaxies = Decimal.max(player.dilation.baseTachyonGalaxies,
    Decimal.floor(Currency.dilatedTime.value.dividedBy(1000).log10().times(galaxiesPerOoM)
      .div(getTachyonGalaxyPowers())).add(1));
  const thresholdMult = getTachyonGalaxyMult();
  player.dilation.nextThreshold = thresholdMult.eq(1)
    ? Currency.dilatedTime.value
    : DC.E3.times(thresholdMult.pow(player.dilation.baseTachyonGalaxies));
  player.dilation.totalTachyonGalaxies =
    Decimal.min(player.dilation.baseTachyonGalaxies.times(tachyonGalaxyMult), tachyonGalaxyThreshold)
      .add(Decimal.max(player.dilation.baseTachyonGalaxies.times(tachyonGalaxyMult).sub(tachyonGalaxyThreshold), 0)
        .div(tachyonGalaxyMult));

  let a = player.dilation.totalTachyonGalaxies.times(DilationUpgrade.galaxyMultiplier.effectValue);
  if (a.gt(500000)) a = a.div(a.div(500000).pow(0.8));

  player.dilation.totalTachyonGalaxies = a;
}

function updateElectromagneticWaves() {
  const waveMultiplier = Effects.max(1, CompressionUpgrade.doubleWaves);
  const thresholdMultiplier = getElectroWaveMult();
  player.compression.baseElectromagneticWaves = Decimal.max(
    player.compression.baseElectromagneticWaves,
    Decimal.floor(Decimal.log(Currency.thermalRadiation.value.div(1000), thresholdMultiplier)).add(1)
  );
  player.compression.nextThreshold = DC.E3.times(
    new Decimal(thresholdMultiplier).pow(player.compression.baseElectromagneticWaves)
  );
  player.compression.totalElectromagneticWaves = player.compression.baseElectromagneticWaves.times(waveMultiplier);
}

export function getTTPerSecond() {
  // All TT multipliers (note that this is equal to 1 pre-Ra)
  let ttMult = Effects.product(
    Ra.unlocks.continuousTTBoost.effects.ttGen,
    Ra.unlocks.achievementTTMult,
    Achievement(137),
    Achievement(156),
  );
  if (GlyphAlteration.isAdded("dilation")) ttMult = ttMult.mul(getSecondaryGlyphEffect("dilationTTgen"));

  // Glyph TT generation
  const glyphTT = Teresa.isRunning || Enslaved.isRunning || Glitch.isRunning || Pelle.isDoomed
    ? 0
    : new Decimal(getAdjustedGlyphEffect("dilationTTgen")).times(ttMult);

  // Dilation TT generation
  const dilationTT = DilationUpgrade.ttGenerator.isBought
    ? DilationUpgrade.ttGenerator.effectValue.times(Pelle.isDoomed ? 1 : ttMult)
    : DC.D0;

  // Lai'tela TT power
  let finalTT = dilationTT.add(glyphTT);
  if (finalTT.gt(1)) {
    finalTT = finalTT.pow(SingularityMilestone.theoremPowerFromSingularities.effectOrDefault(1));
    if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) {
      finalTT = finalTT.pow(Achievements.powerConv(Ra.unlocks.achievementTTMult.effectOrDefault(1)));
    }
    if (ResurgenceUpgrade.curr1Surge.isBought && !player.disablePostReality) {
      finalTT = finalTT.pow(player.timestudy.theorem.max(1e10).log10().log10());
    }
    finalTT = finalTT.powEffectOf(ResurgenceUpgrade.synergy1);
  }

  return finalTT;
}

export function getESPerSecond() {
  const esMult = DC.D1.timesEffectsOf(Achievement(276)).times(DivinityMilestone.serpentPower.isReached ? 10 : 1);
  const compressionES = CompressionUpgrade.esGenerator.isBought
    ? CompressionUpgrade.esGenerator.effectValue.times(esMult)
    : DC.D0;

  return compressionES;
}

// eslint-disable-next-line no-unused-vars
function recursiveTimeOut(fn, iterations, endFn) {
  fn(iterations);
  if (iterations === 0) endFn();
  else setTimeout(() => recursiveTimeOut(fn, iterations - 1, endFn), 0);
}

function afterSimulation(seconds, playerBefore) {
  if (seconds > 600) {
    const playerAfter = deepmergeAll([{}, player]);
    Modal.awayProgress.show({ playerBefore, playerAfter, seconds });
  }

  GameUI.notify.showBlackHoles = true;
}

export function simulateTime(seconds, real, fast) {
  // The game is simulated at a base 50ms update rate, with a maximum tick count based on the values of real and fast
  // - Calling with real === true will always simulate at full accuracy with no tick count reduction unless it would
  //   otherwise simulate with more ticks than offline progress would allow
  // - Calling with fast === true will only simulate it with a max of 50 ticks
  // - Otherwise, tick count will be limited to the offline tick count (which may be set externally during save import)
  // Tick count is never *increased*, and only ever decreased if needed.
  if (seconds < 0) return;
  let ticks = Math.floor(seconds * 20);
  GameUI.notify.showBlackHoles = false;

  // Limit the tick count (this also applies if the black hole is unlocked)
  const maxTicks = GameStorage.maxOfflineTicks(1000 * seconds, GameStorage.offlineTicks ?? player.options.offlineTicks);
  if (ticks > maxTicks && !fast) {
    ticks = maxTicks;
  } else if (ticks > 50 && !real && fast) {
    ticks = 50;
  }

  const playerStart = deepmergeAll([{}, player]);

  let totalGameTime;

  if (BlackHoles.areUnlocked && !BlackHoles.arePaused) {
    totalGameTime = BlackHoles.calculateGameTimeFromRealTime(seconds, BlackHoles.calculateSpeedups());
  } else {
    totalGameTime = GameCache.gameSpeed.value.mul(seconds);
  }

  const infinitiedMilestone = getInfinitiedMilestoneReward(totalGameTime.mul(1000));
  const eternitiedMilestone = getEternitiedMilestoneReward(totalGameTime.mul(1000));

  if (eternitiedMilestone.gt(0)) {
    Currency.eternities.add(eternitiedMilestone);
  } else if (infinitiedMilestone.gt(0)) {
    Currency.infinities.add(infinitiedMilestone);
  } else {
    Currency.eternityPoints.add(getOfflineEPGain(seconds * 1000));
  }

  if (InfinityUpgrade.ipOffline.isBought && player.options.offlineProgress) {
    Currency.infinityPoints.add(player.records.thisEternity.bestIPMsWithoutMaxAll.times(seconds * 500));
  }

  EventHub.dispatch(GAME_EVENT.OFFLINE_CURRENCY_GAINED);

  let remainingRealSeconds = seconds;
  // During async code the number of ticks remaining can go down suddenly
  // from "Speed up" which means tick length needs to go up, and thus
  // you can't just divide total time by total ticks to get tick length.
  // For example, suppose you had 6000 offline ticks, and called "Speed up"
  // 1000 ticks in, meaning that after "Speed up" there'd only be 1000 ticks more
  // (so 1000 + 1000 = 2000 ticks total). Dividing total time by total ticks would
  // use 1/6th of the total time before "Speed up" (1000 of 6000 ticks), and 1/2 after
  // (1000 of 2000 ticks). Short of some sort of magic user prediction to figure out
  // whether the user *will* press "Speed up" at some point, dividing remaining time
  // by remaining ticks seems like the best thing to do.
  let loopFn = i => {
    const diff = remainingRealSeconds / i;
    gameLoop(1000 * diff);
    remainingRealSeconds -= diff;
  };

  // Simulation code which accounts for BH cycles (segments where a BH is active doesn't use diff since it splits
  // up intervals based on real time instead in an effort to keep ticks all roughly equal in game time).
  // Black hole auto-pausing is entirely handled by the black hole phase advancement code (for actually pausing)
  // and calculateOfflineTick (for time calculation).
  if (BlackHoles.areUnlocked && !BlackHoles.arePaused) {
    loopFn = i => {
      const [realTickTime, blackHoleSpeedup] = BlackHoles.calculateOfflineTick(remainingRealSeconds,
        i, 0.0001);
      remainingRealSeconds -= realTickTime;
      gameLoop(1000 * realTickTime, { blackHoleSpeedup });
    };
  }

  // We don't show the offline modal here or bother with async if doing a fast simulation
  if (fast) {
    // Fast simulations happen when simulating between 10 and 50 seconds of offline time.
    // One easy way to get this is to autosave every 30 or 60 seconds, wait until the save timer
    // in the bottom-left hits 15 seconds, and refresh (without saving directly beforehand).
    GameIntervals.stop();
    // Fast simulations are always 50 ticks. They're done in this weird countdown way because
    // we want to be able to call the same function that we call when using async code (to avoid
    // duplicating functions), and that function expects a parameter saying how many ticks are remaining.
    for (let remaining = 50; remaining > 0; remaining--) {
      loopFn(remaining);
    }
    GameStorage.postLoadStuff();
    afterSimulation(seconds, playerStart);
  } else {
    const progress = {};
    ui.view.modal.progressBar = {};
    Async.run(loopFn,
      ticks,
      {
        batchSize: 1,
        maxTime: 60,
        sleepTime: 1,
        asyncEntry: doneSoFar => {
          GameIntervals.stop();
          ui.$viewModel.modal.progressBar = {
            label: "Offline Progress Simulation",
            info: `The game is being run at a lower accuracy in order to quickly calculate the resources you
              gained while you were away. See the How To Play entry on "Offline Progress" for technical details. If
              you are impatient and want to get back to the game sooner, you can click the "Speed up" button to
              simulate the rest of the time with half as many ticks (down to a minimum of ${formatInt(500)} ticks
              remaining). The "SKIP" button will instead use all the remaining offline time in ${formatInt(10)}
              ticks.`,
            progressName: "Ticks",
            current: doneSoFar,
            max: ticks,
            startTime: Date.now(),
            buttons: [{
              text: "Speed up",
              condition: (current, max) => max - current > 500,
              click: () => {
                const newRemaining = Math.clampMin(Math.floor(progress.remaining / 2), 500);
                // We subtract the number of ticks we skipped, which is progress.remaining - newRemaining.
                // This, and the below similar code in "SKIP", are needed or the progress bar to be accurate
                // (both with respect to the number of ticks it shows and with respect to how full it is).
                progress.maxIter -= progress.remaining - newRemaining;
                progress.remaining = newRemaining;
                // We update the progress bar max data (remaining will update automatically).
                ui.$viewModel.modal.progressBar.max = progress.maxIter;
              }
            },
            {
              text: "SKIP",
              condition: (current, max) => max - current > 10,
              click: () => {
                // We jump to 10 from the end (condition guarantees there are at least 10 left).
                // We subtract the number of ticks we skipped, which is progress.remaining - 10.
                progress.maxIter -= progress.remaining - 10;
                progress.remaining = 10;
              }
            }]
          };
        },
        asyncProgress: doneSoFar => {
          ui.$viewModel.modal.progressBar.current = doneSoFar;
        },
        asyncExit: () => {
          ui.$viewModel.modal.progressBar = undefined;
          // .postLoadStuff will restart GameIntervals
          GameStorage.postLoadStuff();
        },
        then: () => {
          afterSimulation(seconds, playerStart);
        },
        progress
      });
  }
}

window.onload = function() {
  const supportedBrowser = browserCheck();
  GameUI.initialized = supportedBrowser;
  ui.view.initialized = supportedBrowser;
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
  }, 500);
  if (!supportedBrowser) {
    GameIntervals.stop();
    document.getElementById("loading").style.display = "none";
    document.getElementById("browser-warning").style.display = "flex";
  }
};

window.onfocus = function() {
  setShiftKey(false);
};

window.onblur = function() {
  GameKeyboard.stopSpins();
};

export function setShiftKey(isDown) {
  ui.view.shiftDown = isDown;
}

export function setHoldingR(x) {
  Replicanti.galaxies.isPlayerHoldingR = x;
}

export function browserCheck() {
  return supportedBrowsers.test(navigator.userAgent);
}

export function init() {
  // eslint-disable-next-line no-console
  console.log("🌌 Antimatter Dimensions: Reality Update 🌌");
  if (DEV) {
    // eslint-disable-next-line no-console
    console.log("👨‍💻 Development Mode 👩‍💻");
  }
  ElectronRuntime.initialize();
  SteamRuntime.initialize();
  Cloud.init();
  GameStorage.load();
  Tabs.all.find(t => t.config.id === player.options.lastOpenTab).show(true);

  // Funny title
  document.title = `Antimatter Dimensions: ${titles[randomInt(0, titles.length++)]}`;
}

window.tweenTime = 0;
let lastFrame;
function animateTweens(time) {
  requestAnimationFrame(animateTweens);
  if (time === undefined || lastFrame === undefined) {
    lastFrame = time;
    return;
  }
  let delta = time - lastFrame;
  lastFrame = time;
  if (player.dilation.active) {
    delta /= Pelle.isDoomed ? 1.5 : 10;
  }
  tweenTime += delta;
  TWEEN.update(tweenTime);
}

animateTweens();

function randomInt(min = 0, max = 10) { return Math.floor(min + (Math.random() * (max - min))); };

var titles = ["Help me", "Now with upgrades", "The Antimatter update", "Uhhh, I think I broke something", "No don't do that", "Now with a 9th dimension",
  "THERE'S NEW CONTENT?!?!?!", "Also try minecraft", "You know what that means FISHHHHH", "Now with dimensions", "THE NEWS IS NOT FAKE", "Now's you chance to make [ANTIMATTER]",
  "That's bananas", "update in 5 hours", "Hevipelle is good at using GitHub :)", "The update that makes the game bad", " I'm poor now :(", "Nerf the galaxies plz",
  "Get more antimatter", "Can give me more galaxies please?", "NG+infinite", "How do I cheat", "When do the memes get added?", "How much is infinity?",
  "Never gonna give you up", "Hexa you need to slow down with all your mods!", "Stop looking at me", "Who is \"Royal\"?", "Join the Discord"];
