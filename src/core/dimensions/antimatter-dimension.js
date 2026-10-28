import { DC } from "../constants";

import { DimensionState } from "./dimension";

// Multiplier applied to all Antimatter Dimensions, regardless of tier. This is cached using a Lazy
// and invalidated every update.
export function antimatterDimensionCommonMultiplier() {
  let multiplier = DC.D1;

  multiplier = multiplier.times(Achievements.power);
  multiplier = multiplier.times(ShopPurchase.dimPurchases.currentMult);
  multiplier = multiplier.times(ShopPurchase.allDimPurchases.currentMult);

  if (!EternityChallenge(9).isRunning) {
    multiplier = multiplier.times(Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate).max(1));
  }
  multiplier = multiplier.timesEffectsOf(
    BreakInfinityUpgrade.totalAMMult,
    BreakInfinityUpgrade.currentAMMult,
    BreakInfinityUpgrade.achievementMult,
    BreakInfinityUpgrade.slowestChallengeMult,
    Hell.infinityUpgradesPostDilation ? null : InfinityUpgrade.totalTimeMult,
    Hell.infinityUpgradesPostDilation ? null : InfinityUpgrade.thisInfinityTimeMult,
    Achievement(48),
    Achievement(56),
    Achievement(65),
    Achievement(73),
    Achievement(74),
    Achievement(76),
    Achievement(84),
    Achievement(91),
    Achievement(92),
    TimeStudy(91),
    TimeStudy(101),
    TimeStudy(161),
    TimeStudy(193),
    InfinityChallenge(3),
    InfinityChallenge(3).reward,
    InfinityChallenge(8),
    EternityChallenge(10),
    AlchemyResource.dimensionality,
    PelleUpgrade.antimatterDimensionMult,
    preInfinityUGs.all[0],
    preInfinityUGs.all[1],
    preInfinityUGs.all[2]
  );

  multiplier = multiplier.dividedByEffectOf(InfinityChallenge(6));
  multiplier = multiplier.times(getAdjustedGlyphEffect("powermult"));
  multiplier = multiplier.times(Currency.realityMachines.value.powEffectOf(AlchemyResource.force));
  if (LHC.voidRunning) multiplier = multiplier.timesEffectOf(LHCNullUpgrade.antimatterDimensionMult);

  if (Pelle.isDoomed && !PelleDestructionUpgrade.disableADNerf.canBeApplied) multiplier = multiplier.dividedBy(10);
  if (Alpha.isRunning) multiplier = multiplier.div(Currency.antimatter.value.add(1).log10().times(125).max(1));

  return multiplier;
}

export function getDimensionFinalMultiplierUncached(tier) {
  if (tier < 1 || tier > 9) throw new Error(`Invalid Antimatter Dimension tier ${tier}`);
  if (Slabdrill.isCursed && tier > Math.max(Math.min(Math.floor((player.celestials.slabdrill.goodbyeTick - 30000) / 1000), 10), 2) - 1) return DC.D1;
  if (NormalChallenge(10).isRunning && tier > 6) return DC.D1;
  const isEternityChallenge11 = EternityChallenge(11).isRunning;
  let multiplier = DC.D1;
  let ec11Multiplier;
  if (isEternityChallenge11) {
    multiplier = Currency.infinityPower.value.pow(
      InfinityDimensions.powerConversionRate
    ).max(1).times(DimBoost.multiplierToNDTier(tier));

    if (V.isRunningExtreme) {
      multiplier = multiplier.pow(0.001);
    }
    
    multiplier = multiplier.pow(V.rageDimPower);
        ec11Multiplier = multiplier;
      } else {
        multiplier = applyNDMultipliers(multiplier, tier);
        multiplier = applyNDPowers(multiplier, tier);
  }

  if (player.dilation.active || (PelleStrikes.dilation.hasStrike && !PelleStrikes.dilation.isDestroyed())) {
    multiplier = dilatedValueOf(multiplier.pow(getAdjustedGlyphEffect("dilationpow")));
  } else if (Enslaved.isRunning) {
    multiplier = dilatedValueOf(multiplier);
  }
  if (Hell.infinityUpgradesPostDilation) {
    multiplier = multiplier.timesEffectsOf(
      InfinityUpgrade.totalTimeMult,
      InfinityUpgrade.thisInfinityTimeMult,
      tier < 9 ? AntimatterDimension(tier).infinityUpgrade : null
    );
  }
  multiplier = multiplier.timesEffectOf(DilationUpgrade.ndMultDT);
  
  multiplier = applyNDNerfs(multiplier, tier);
  if (Hell.isInside && tier < 9) multiplier = multiplier.times(Hell.dimensionProductionMult);
  if (LHC.voidRunning) {
    multiplier = multiplier.pow(Currency.nullParticles.value.max(1).log10().div(5).add(1).pow(5));
  }

  if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) {
    multiplier = multiplier.pow(Achievements.powerConv(Achievements.power));
  }

  // This power effect goes intentionally after all the nerf effects and shouldn't be moved before them
  if (AlchemyResource.inflation.isUnlocked && multiplier.gte(AlchemyResource.inflation.effectValue)) {
    multiplier = multiplier.pow(1.05);
  }
  multiplier = multiplier.pow(NormalChallenge(2).chargedEffect);
  if (tier % 2 === 0) multiplier = multiplier.pow(NormalChallenge(12).chargedEffect);
  if (tier === 1) multiplier = dilateMultiplier(multiplier, NormalChallenge(3).chargedEffect);
  if (player.endgame.overcharge.isRunning) {
    multiplier = dilateMultiplier(multiplier, Ascension.overchargePenalty);
  }
  if (player.compression.active) {
    multiplier = compressedMultiplier(multiplier);
  }
  multiplier = multiplier.timesEffectsOf(CompressionUpgrade.adMultTR, CompressionUpgrade.adBigMultTR);
  if (Universes.isIn(1)) {
    multiplier = dilateMultiplier(multiplier, Decimal.pow(0.1,
      Decimal.pow(0.9, Currency.relativisticParticles.value.max(10).log10().log10().pow(2))));
  }
  if (tier === 9) multiplier = multiplier.max(10).log10().timesEffectOf(DualityUpgrade(30));
  if (tier === 9 && Slabdrill.isCursed) {
    multiplier = multiplier.pow(Math.max(((player.celestials.slabdrill.goodbyeTick - 120000) / 30000) + 1, 1));
  }
  
  return isEternityChallenge11 ? Decimal.max(multiplier, ec11Multiplier) : multiplier;
}

function applyNDMultipliers(mult, tier) {
  let multiplier = mult.times(GameCache.antimatterDimensionCommonMultiplier.value);
  if (tier < 9) multiplier = multiplier.timesEffectOf(Achievement(72));

  let buy10Value;
  if (Laitela.continuumActive) {
    buy10Value = AntimatterDimension(tier).continuumValue;
  } else {
    buy10Value = Decimal.floor(AntimatterDimension(tier).bought.div(10));
  }

  if (!Ascensions.b10mA.isUnlocked) {
    multiplier = multiplier.times(Decimal.pow(AntimatterDimensions.buyTenMultiplier, buy10Value));
  }
  multiplier = multiplier.times(DimBoost.multiplierToNDTier(tier));

  const postDilationInfinity = Hell.infinityUpgradesPostDilation;
  let infinitiedMult = DC.D1.timesEffectsOf(
    postDilationInfinity ? null : AntimatterDimension(tier).infinityUpgrade || null,
    BreakInfinityUpgrade.infinitiedMult
  );
  infinitiedMult = infinitiedMult.pow(TimeStudy(31).effectOrDefault(1));
  multiplier = multiplier.times(infinitiedMult);

  if (tier === 1) {
    multiplier = multiplier
      .timesEffectsOf(
        InfinityUpgrade.unspentIPMult,
        InfinityUpgrade.unspentIPMult.chargedEffect,
        Achievement(28),
        Achievement(31),
        Achievement(68),
        Achievement(71),
        Achievement(11),
        !Ascensions.sacA.isUnlocked ? TimeStudy(234) : null,
        GlitchRifts.alpha.milestones[0],
        preInfinityUGs.all[3]
      );
      if (tier < 9) multiplier = multiplier.timesEffectOf(Achievement(72));
  }
  if (tier === 8 && !Ascensions.sacA.isUnlocked) {
    multiplier = multiplier.times(Sacrifice.totalBoost);
    multiplier = multiplier.times(GlitchRifts.alpha.milestones[1].effectOrDefault(1));
  }
  multiplier = multiplier.timesEffectsOf(
    tier === 2 ? Achievement(12) : null,
    tier >= 3 && tier <= 8 ? Achievement(13) : null,
    tier === 4 ? Achievement(14) : null,
    tier >= 5 && tier <= 8 ? Achievement(15) : null,
    tier === 6 ? Achievement(16) : null,
    tier === 7 ? Achievement(17) : null,
    tier === 8 ? Achievement(23) : null,
    tier < 8 ? Achievement(34) : null,
    tier <= 4 ? Achievement(64) : null,
    (tier < 8 && !Ascensions.sacA.isUnlocked) ? TimeStudy(71) : null,
    (tier === 8 && !Ascensions.sacA.isUnlocked) ? TimeStudy(214) : null,
    tier > 1 && tier < 8 ? InfinityChallenge(8).reward : null
  );
  if (Achievement(43).isUnlocked) {
    multiplier = multiplier.times(1 + tier / 100);
  }
  
  multiplier = multiplier.clampMin(1);
  if (ExpansionPack.pellePack.isBought && !player.disablePostReality) {
    multiplier = multiplier.pow(Decimal.pow(Decimal.log10(player.records.bestEndgame.galaxies.max(1)).div(100), 1.5).add(1));
  }
  
  return multiplier;
}

function applyNDPowers(mult, tier) {
  let multiplier = mult;
  const glyphPowMultiplier = new Decimal(getAdjustedGlyphEffect("powerpow"));
  const glyphEffarigPowMultiplier = getAdjustedGlyphEffect("effarigdimensions");

  if (InfinityChallenge(4).isRunning && player.postC4Tier !== tier) multiplier = multiplier.pow(InfinityChallenge(4).effectValue);
  if (InfinityChallenge(4).isCompleted) multiplier = multiplier.pow(InfinityChallenge(4).reward.effectValue);

  multiplier = multiplier.pow(MetaFabricatorUpgrades.all[1].effectOrDefault(1));

  multiplier = multiplier.pow(glyphPowMultiplier.times(glyphEffarigPowMultiplier).times(Ra.momentumValue));

  multiplier = multiplier
    .powEffectsOf(
      AntimatterDimension(tier).infinityUpgrade.chargedEffect,
      InfinityUpgrade.totalTimeMult.chargedEffect,
      InfinityUpgrade.thisInfinityTimeMult.chargedEffect,
      Achievement(18),
      AlchemyResource.power,
      Achievement(183),
      PelleRifts.paradox,
      SingularityMilestone.dimensionPow,
      PelleRifts.glitch,
      Achievement(205),
      Ra.unlocks.repAD,
      Ra.unlocks.nullDamagedMRGain,
      Ra.unlocks.allDimPowTT,
      BreakInfinityUpgrade.totalAMMult.chargedEffect,
      BreakInfinityUpgrade.currentAMMult.chargedEffect,
      BreakInfinityUpgrade.infinitiedMult.chargedEffect,
      BreakInfinityUpgrade.achievementMult.chargedEffect,
      BreakInfinityUpgrade.slowestChallengeMult.chargedEffect
    );

  if (Ascensions.dbA.isUnlocked) multiplier = multiplier.pow(DimBoost.powerToND);

  if (Ascensions.b10mA.isUnlocked) {
    const bought = Laitela.continuumActive
      ? AntimatterDimension(tier).continuumValue
      : Decimal.floor(AntimatterDimension(tier).bought.div(10));
    multiplier = multiplier.pow(AntimatterDimensions.buyOoMPower.times(bought.max(1).log10()).add(1));
  }

  if (Ascensions.sacA.isUnlocked) {
    if (tier === 8) multiplier = multiplier.pow(Sacrifice.totalPower);
    if (tier < 8) multiplier = multiplier.powEffectOf(TimeStudy(71));
    if (tier === 8) multiplier = multiplier.powEffectOf(TimeStudy(214));
    if (tier === 1) multiplier = multiplier.powEffectOf(TimeStudy(234));
  }

  multiplier = multiplier.pow(getAdjustedGlyphEffect("curseddimensions"));

  if(isInCelestialReality()) multiplier = multiplier.pow(getAdjustedGlyphEffect("glitchADCelPow"));

  multiplier = multiplier.pow(TimeStudy(401).effectOrDefault(1));

  multiplier = multiplier.pow(VUnlocks.adPow.effectOrDefault(1));

  if (!Pelle.joined && PelleStrikes.infinity.hasStrike && !PelleStrikes.infinity.isDestroyed()) multiplier = multiplier.pow(0.5);

  return multiplier;
}

function applyNDNerfs(mult, tier) {
  if (Effarig.isRunning) {
    mult = Effarig.multiplier(mult);
  }
  
  if (V.isRunning && !(Hell.isInside && V.isRunningExtreme)) {
    mult = mult.pow(0.5);
  }

  if (Glitch.isRunning) {
    mult = mult.pow(Glitch.ADnerf);
  }
  
  let mul = GlitchRealityUpgrades.all[4].effectOrDefault(DC.D1).pow(Glitch.decay.recip());

  if (Glitch.isRunning && !GlitchRealityUpgrades.all[4].isBought) mult = mult.mul(1e26);
  
  mult = mult.pow(GlitchRealityUpgrades.all[15].effectOrDefault(1));
  
  if (V.isRunningExtreme) {
    mult = mult.pow(0.001);
  }
  
  if(player.dilation.active && Pelle.isDoomed) mul = dilatedValueOf(mul);
  
  if(!V.isRunningExtreme) mult = mult.mul(mul);
  
  mult = mult.pow(V.rageDimPower);

  return mult;
}

function onBuyDimension(tier) {
  if (tier === 1) Tutorial.turnOffEffect(TUTORIAL_STATE.DIM1);
  if (tier === 2) Tutorial.turnOffEffect(TUTORIAL_STATE.DIM2);
  if (tier <= 8) Achievement(10 + tier).unlock();
  Achievement(23).tryUnlock();

  if (player.speedrun.isActive && !player.speedrun.hasStarted) Speedrun.startTimer();

  if (NormalChallenge(2).isRunning) player.chall2Pow = DC.D0;
  if (NormalChallenge(4).isRunning || InfinityChallenge(1).isRunning) {
    AntimatterDimensions.resetAmountUpToTier(tier - 1);
  }

  player.postC4Tier = tier;
  player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
  if (tier !== 8) player.requirementChecks.eternity.onlyAD8 = false;
  if (tier !== 1) player.requirementChecks.eternity.onlyAD1 = false;
  if (tier === 8) player.requirementChecks.infinity.noAD8 = false;
  if (tier === 9 && Slabdrill.isDestroyed) {
    player.celestials.slabdrill.hasBoughtNinthDimension = true;
    GameEnd.creditsEverClosed = false;
  }
  if (tier === 1) player.requirementChecks.eternity.noAD1 = false;
}

export function buyOneDimension(tier) {
  const dimension = AntimatterDimension(tier);
  if ((Laitela.continuumActive && tier !== 9) || !dimension.isAvailableForPurchase || !dimension.isAffordable) return false;
  if (tier === 9 && Slabdrill.isDestroyed && dimension.bought.gt(0)) return false;

  if ((!preInfinityUGs.all[3].config.hasFailed() && !preInfinityUGs.all[3].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && player.dimensionBoosts.eq(4) && player.galaxies.eq(0)) {
    if(dimension.bought.gt(0)) {
      Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[3].config.name} <br> which is to ${preInfinityUGs.all[3].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
      return;
    }
  }
  else if(((!preInfinityUGs.all[4].config.hasFailed() && !preInfinityUGs.all[4].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && tier != 1 && (tier == 2 ? AntimatterDimension(2).amount.gte(10) : true) && player.dimensionBoosts.eq(0) && player.galaxies.eq(1))){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[4].config.name} <br> which is to ${preInfinityUGs.all[4].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  else if(((!preInfinityUGs.all[5].config.hasFailed() && !preInfinityUGs.all[5].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && tier > 3 && (tier == 4 ? AntimatterDimension(4).amount.gte(20) : true) && player.dimensionBoosts.eq(0) && player.galaxies.eq(1))){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[5].config.name} <br> which is to ${preInfinityUGs.all[5].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }

  const cost = dimension.cost;

  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(3));
  
  if (tier === 8 && allowed && AntimatterDimension(8).bought.gt(0)) return false;

  if(dimension.currencyAmount.lt('ee15')) dimension.currencyAmount = dimension.currencyAmount.minus(cost);

  if (dimension.boughtBefore10.eq(9)) {
    dimension.challengeCostBump();
  }

  dimension.amount = dimension.amount.plus(1);
  dimension.bought = dimension.bought.add(1);

  if (tier === 1) {
    Achievement(28).tryUnlock();
  }

  onBuyDimension(tier);

  return true;
}

export function buyManyDimension(tier) {
  const dimension = AntimatterDimension(tier);
  if (tier === 9 && Slabdrill.isDestroyed) return buyOneDimension(9);
  if ((Laitela.continuumActive && tier !== 9) || !dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return false;
  const cost = dimension.costUntil10;

  if ((!preInfinityUGs.all[3].config.hasFailed() && !preInfinityUGs.all[3].isBought) && (player.options.confirmations.glitchCL && 
  !PlayerProgress.metaUnlocked()) && player.dimensionBoosts.eq(4) && player.galaxies.eq(0)) {
    if(dimension.bought.lt(1)) buyOneDimension(tier);
    return;
  }
  else if(((!preInfinityUGs.all[4].config.hasFailed() && !preInfinityUGs.all[4].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && tier != 1 && (tier == 2 ? AntimatterDimension(2).amount.gte(10) : true) && player.dimensionBoosts.eq(0) && player.galaxies.eq(1))){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[4].config.name} <br> which is to ${preInfinityUGs.all[4].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  else if(((!preInfinityUGs.all[5].config.hasFailed() && !preInfinityUGs.all[5].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && tier > 3 && (tier == 4 ? AntimatterDimension(4).amount.gte(20) : true) && player.dimensionBoosts.eq(0) && player.galaxies.eq(1))){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[5].config.name} <br> which is to ${preInfinityUGs.all[5].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }


  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(3));
  
  if (tier === 8 && allowed) return buyOneDimension(8);

  if(dimension.currencyAmount.lt('ee15')) dimension.currencyAmount = dimension.currencyAmount.minus(cost).max(0);
  dimension.challengeCostBump();
  dimension.amount = dimension.amount.plus(dimension.remainingUntil10);
  dimension.bought = dimension.bought.add(dimension.remainingUntil10);

  onBuyDimension(tier);

  return true;
}

export function buyAsManyAsYouCanBuy(tier) {
  const dimension = AntimatterDimension(tier);
  if (tier === 9 && Slabdrill.isDestroyed) return buyOneDimension(9);
  if ((Laitela.continuumActive && tier !== 9) || !dimension.isAvailableForPurchase || !dimension.isAffordable) return false;
  
  if ((!preInfinityUGs.all[3].config.hasFailed() && !preInfinityUGs.all[3].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && player.dimensionBoosts.eq(4) && player.galaxies.eq(0)) {
    if(dimension.bought.lt(1)) buyOneDimension(tier);
    return;
  }
  else if(((!preInfinityUGs.all[4].config.hasFailed() && !preInfinityUGs.all[4].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && tier != 1 && (tier == 2 ? AntimatterDimension(2).amount.gte(10) : true) && player.dimensionBoosts.eq(0) && player.galaxies.eq(1))){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[4].config.name} <br> which is to ${preInfinityUGs.all[4].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  else if(((!preInfinityUGs.all[5].config.hasFailed() && !preInfinityUGs.all[5].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && tier > 3 && (tier == 4 ? AntimatterDimension(4).amount.gte(20) : true) && player.dimensionBoosts.eq(0) && player.galaxies.eq(1))){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[5].config.name} <br> which is to ${preInfinityUGs.all[5].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }

  let howMany = dimension.howManyCanBuy;
  const cost = tier === 9
    ? dimension.cost.pow(Decimal.add(howMany, dimension.boughtBefore10))
    : dimension.cost.times(howMany);

  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(3));
  
  if (tier === 8 && allowed) return buyOneDimension(8);
  const adtotal = dimension.bought.add(howMany);
  
  if(dimension.currencyAmount.lt('ee15')) dimension.currencyAmount = dimension.currencyAmount.minus(cost).max(0);
  dimension.challengeCostBump();
  
  if(adtotal.gte(1e18)) {
    howMany = howMany.div(howMany.sub(1e18).log(Math.E)).max(1e18);
    dimension.amount = dimension.amount.add(howMany);
  dimension.bought = dimension.bought.add(howMany);

  }else{
    dimension.amount = dimension.amount.add(howMany);
    dimension.bought = dimension.bought.add(howMany);
  }
  onBuyDimension(tier);

  return true;
}

// This function doesn't do cost checking as challenges generally modify costs, it just buys and updates dimensions
function buyUntilTen(tier) {
  if (Laitela.continuumActive) return;
  const dimension = AntimatterDimension(tier);

  if ((!preInfinityUGs.all[3].config.hasFailed() && !preInfinityUGs.all[3].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && player.dimensionBoosts.eq(4) && player.galaxies.eq(0)) {
    if(dimension.bought.lt(1)) buyOneDimension(tier);
    return;
  }
  else if((!preInfinityUGs.all[4].config.hasFailed() && !preInfinityUGs.all[4].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && tier != 1 && (tier == 2 ? AntimatterDimension(tier).amount.gte(10) : true) && player.dimensionBoosts.eq(0) && player.galaxies.eq(1)){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[4].config.name} <br> which is to ${preInfinityUGs.all[4].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  else if(((!preInfinityUGs.all[5].config.hasFailed() && !preInfinityUGs.all[5].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && tier > 3 && (tier == 4 ? AntimatterDimension(4).amount.gte(20) : true) && player.dimensionBoosts.eq(0) && player.galaxies.eq(1))){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[5].config.name} <br> which is to ${preInfinityUGs.all[5].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }

  dimension.challengeCostBump();
  dimension.amount = Decimal.round(dimension.amount.plus(dimension.remainingUntil10));
  dimension.bought = dimension.bought.add(dimension.remainingUntil10);
  onBuyDimension(tier);
}

export function maxAll() {
  if (Laitela.continuumActive) return;

  player.requirementChecks.infinity.maxAll = true;

  for (let tier = 1; tier < 9; tier++) {
    buyMaxDimension(tier);
  }

  // Do this here because tickspeed might not have been unlocked before
  // (and maxAll might have unlocked it by buying dimensions).
  buyMaxTickSpeed();
}

export function buyMaxDimension(tier, bulk = Infinity) {
  const dimension = AntimatterDimension(tier);
  if (tier === 9 && Slabdrill.isDestroyed) {
    buyOneDimension(9);
    return;
  }
  if ((Laitela.continuumActive && tier !== 9) || !dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return;

  if((!preInfinityUGs.all[4].config.hasFailed() && !preInfinityUGs.all[4].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && tier >= 2 && player.galaxies.eq(1)){
    if(tier > 2) return
    if(dimension.bought.gte(10)) return;
    Decimal.clampMax(dimension.bought,10);
    bulk = Decimal.sub(1, dimension.bought.div(10));
  }

  if((!preInfinityUGs.all[5].config.hasFailed() && !preInfinityUGs.all[5].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && tier >= 4 && player.galaxies.eq(1)){
    if(tier > 4) return
    if(dimension.bought.gte(20)) return;
    Decimal.clampMax(dimension.bought,20);
    bulk = Decimal.sub(2, dimension.bought.div(10));
  }
  
  if ((!preInfinityUGs.all[3].config.hasFailed() && !preInfinityUGs.all[3].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && player.dimensionBoosts.eq(4) && player.galaxies.eq(0)) {
    if(dimension.bought.lt(1)) buyOneDimension(tier);
    return;
  }

  const cost = dimension.costUntil10;
  let bulkLeft = new Decimal(bulk);
  const goal = Player.infinityGoal;
  if (dimension.cost.gt(goal) && Player.isInAntimatterChallenge) return;

  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(3));
  
  if (tier === 8 && allowed) {
    buyOneDimension(8);
    return;
  }

  // Buy any remaining until 10 before attempting to bulk-buy
  if (dimension.currencyAmount.gte(cost)) {
    if(dimension.currencyAmount.lt('ee15')) dimension.currencyAmount = dimension.currencyAmount.minus(cost).max(0);
    buyUntilTen(tier);
    bulkLeft = bulkLeft.sub(1);
  }

  if (bulkLeft.lte(0)) return;

  // Buy in a while loop in order to properly trigger abnormal price increases
  if (NormalChallenge(9).isRunning || InfinityChallenge(5).isRunning) {
    while (dimension.isAffordableUntil10 && dimension.cost.lt(goal) && bulkLeft.gt(0)) {
      // We can use dimension.currencyAmount or Currency.antimatter here, they're the same,
      // but it seems safest to use dimension.currencyAmount for consistency.
      if(dimension.currencyAmount.lt('ee15')) dimension.currencyAmount = dimension.currencyAmount.minus(dimension.costUntil10).max(0);
      buyUntilTen(tier);
      bulkLeft = bulkLeft.sub(1);
    }
    return;
  }

  // This is the bulk-buy math, explicitly ignored if abnormal cost increases are active
  const maxBought = dimension.costScale.getMaxBought(
    Decimal.floor(dimension.bought.div(10)).add(dimension.costBumps), 
    dimension.currencyAmount,
    DC.E1
  );
  if (maxBought === null) {
    return;
  }
  let buying = maxBought.quantity;
  if (buying.gt(bulkLeft)) buying = new Decimal(bulkLeft);
  dimension.amount = dimension.amount.plus(buying.times(10)).round();
  dimension.bought = dimension.bought.add(buying.times(10));
  if(dimension.currencyAmount.lt('ee15')) dimension.currencyAmount = dimension.currencyAmount.minus(Decimal.pow10(maxBought.logPrice)).max(0);
}

class AntimatterDimensionState extends DimensionState {
  static get dimensionCount() { return 9; }

  constructor(tier) {
    super(() => player.dimensions.antimatter, tier);
    const BASE_COSTS = [null, DC.E1, DC.E2, DC.E4, DC.E6, DC.E9, DC.E13, DC.E18, DC.E24, DC.E100];
    this._baseCost = BASE_COSTS[tier];
    const BASE_COST_MULTIPLIERS = [null, DC.E3, DC.E4, DC.E5, DC.E6, DC.E8, DC.E10, DC.E12, DC.E15, DC.E10];
    this._baseCostMultiplier = BASE_COST_MULTIPLIERS[tier];
    // eslint-disable-next-line max-len
    const C6_BASE_COSTS = [null, DC.E1, DC.E2, DC.E2, DC.E2.times(5), DC.E3.times(2.5), DC.E4.times(2), DC.E5.times(2), DC.E6.times(4), Decimal.pow10(1000)];
    this._c6BaseCost = C6_BASE_COSTS[tier];
    // eslint-disable-next-line max-len
    const C6_BASE_COST_MULTIPLIERS = [null, DC.E3, DC.E3.times(5), DC.E4, DC.E4.times(1.2), DC.E4.times(1.8), DC.E4.times(2.6), DC.E4.times(3.2), DC.E4.times(4.2), Decimal.pow10(1000)];
    this._c6BaseCostMultiplier = C6_BASE_COST_MULTIPLIERS[tier];
  }

  /**
   * @returns {ExponentialCostScaling}
   */
  get costScale() {
    return new ExponentialCostScaling({
      baseCost: NormalChallenge(6).isRunning ? this._c6BaseCost : this._baseCost,
      baseIncrease: NormalChallenge(6).isRunning ? this._c6BaseCostMultiplier : this._baseCostMultiplier,
      costScale: Hell.dimensionCostIncrease(new Decimal(Player.dimensionMultDecrease)),
      scalingCostThreshold: Hell.costIncreaseThreshold
    });
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.costScale.calculateCost(this.bought.div(DC.E1).floor().add(this.costBumps));
  }

  /** @returns {number} */
  get costBumps() { return this.data.costBumps; }
  /** @param {number} value */
  set costBumps(value) { this.data.costBumps = value; }

  /**
   * @returns {number}
   */
  get boughtBefore10() {
    return this.bought.mod(10);
  }

  /**
   * @returns {number}
   */
  get remainingUntil10() {
    return DC.E1.sub(this.boughtBefore10);
  }

  /**
   * @returns {Decimal}
   */
  get costUntil10() {
    if (this.tier === 9) return this.cost.pow(Decimal.max(this.howManyCanBuy, 1).add(this.boughtBefore10));
    return this.cost.times(this.remainingUntil10);
  }

  get howManyCanBuy() {
    const ratio = this.currencyAmount.dividedBy(this.cost);
    const tierNineRatio = this.tier === 9
      ? (Slabdrill.isDestroyed
        ? (this.currencyAmount.gte(this.cost) ? DC.D1.sub(this.bought) : DC.D0)
        : this.currencyAmount.max(1).log10().div(this.cost.max(1).log10()).sub(this.boughtBefore10))
      : ratio;
    return Decimal.floor(Decimal.max(Decimal.min(tierNineRatio, DC.E1.sub(this.boughtBefore10)), 0));
  }

  /**
   * @returns {InfinityUpgrade}
   */
  get infinityUpgrade() {
    switch (this.tier) {
      case 1:
      case 8:
        return InfinityUpgrade.dim18mult;
      case 2:
      case 7:
        return InfinityUpgrade.dim27mult;
      case 3:
      case 6:
        return InfinityUpgrade.dim36mult;
      case 4:
      case 5:
        return InfinityUpgrade.dim45mult;
    }
    return false;
  }

  /**
   * @returns {Decimal}
   */
  get rateOfChange() {
    if (this.cappedProductionInNormalChallenges.gt('ee12')) return DC.D0;
    const tier = this.tier;
    if (tier === 9 ||
      (tier === 8 && player.celestials.slabdrill.goodbyeTick < 40000 && !Slabdrill.isDestroyed) ||
      (tier > 3 && EternityChallenge(3).isRunning) ||
      (tier > 6 && NormalChallenge(12).isRunning)) {
      return DC.D0;
    }

    let toGain;
    if (tier === 7 && EternityChallenge(7).isRunning) {
      toGain = InfinityDimension(1).productionPerSecond.times(10);
    } else if (NormalChallenge(12).isRunning) {
      toGain = AntimatterDimension(tier + 2).productionPerSecond;
    } else {
      toGain = AntimatterDimension(tier + 1).productionPerSecond;
    }
    return toGain.times(10).dividedBy(this.amount.max(1)).times(getGameSpeedupForDisplay());
  }

  /**
   * @returns {boolean}
   */
  get isProducing() {
    const tier = this.tier;
    if ((Slabdrill.isCursed && tier > Math.max(Math.min(Math.floor((player.celestials.slabdrill.goodbyeTick - 30000) / 1000), 10), 2) - 1) ||
      (EternityChallenge(3).isRunning && tier > 4) ||
      (NormalChallenge(10).isRunning && tier > 6) ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension)) {
      return false;
    }
    return this.totalAmount.gt(0);
  }

  /**
   * @returns {Decimal}
   */
  get currencyAmount() {
    return this.tier >= 3 && NormalChallenge(6).isRunning
      ? AntimatterDimension(this.tier - 2).amount
      : Currency.antimatter.value;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
    if (this.tier >= 3 && NormalChallenge(6).isRunning) AntimatterDimension(this.tier - 2).amount = value;
    else Currency.antimatter.value = value;
  }

  /**
   * @returns {number}
   */
  get continuumValue() {
    if (!this.isAvailableForPurchase) return DC.D0;
    if (this.tier === 9) return this.isAffordable ? DC.D1 : DC.D0;
    // Nameless limits dim 8 purchases to 1 only
    // Continuum should be no different
    const allow = (Enslaved.isRunning && !Glitch.isRunning);
    const allowed = (allow || Glitch.augmentEffectActive(3));
    
    if (this.tier === 8 && allowed) return DC.D1;
    // It's safe to use dimension.currencyAmount because this is
    // a dimension-only method (so don't just copy it over to tickspeed).
    // We need to use dimension.currencyAmount here because of different costs in NC6.
    const contVal = this.costScale.getContinuumValue(this.currencyAmount, DC.E1);
    return contVal ? contVal.times(Laitela.matterExtraPurchaseFactor) : DC.D0;
  }

  /**
   * @returns {number}
   */
  get continuumAmount() {
    if (!Laitela.continuumActive) return DC.D0;
    return this.continuumValue.floor();
  }

  /**
   * Continuum doesn't continually update dimension amount because that would require making the code
   * significantly messier to handle it properly. Instead an effective amount is calculated here, which
   * is only used for production and checking for boost/galaxy. Doesn't affect achievements.
   * Taking the max is kind of a hack but it seems to work in all cases. Obviously it works if
   * continuum isn't unlocked. If the dimension is being produced and the continuum is unlocked,
   * the dimension will be being produced in large numbers (since the save is endgame), so the amount
   * will be larger than the continuum and so the continuum is insignificant, which is fine.
   * If the dimension isn't being produced, the continuum will be at least the amount, so
   * the continuum will be used and that's fine. Note that when continuum is first unlocked,
   * both 8d amount and 8d continuum will be nonzero until the next infinity, so taking the sum
   * doesn't work.
   * @param {Decimal} value
   */
  get totalAmount() {
    return this.amount.max(this.continuumAmount.mul(10));
  }

  /**
    * @returns {boolean}
    */
  get isAffordable() {
    if (Laitela.continuumActive && this.tier !== 9) return false;
    if (!player.break && this.cost.gt(DC.NUMMAX)) return false;
    if (this.tier === 9) return this.cost.pow(this.boughtBefore10.add(1)).lte(this.currencyAmount);
    return this.cost.lte(this.currencyAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    if (!player.break && this.cost.gt(DC.NUMMAX)) return false;
    if (this.tier === 9) return this.cost.pow(10).lte(this.currencyAmount);
    return this.costUntil10.lte(this.currencyAmount);
  }

  get isAvailableForPurchase() {
    if (this.tier === 9 && !Slabdrill.isUnlocked) return false;
    if (Slabdrill.isCursed && this.tier > Math.max(Math.min(Math.floor((player.celestials.slabdrill.goodbyeTick - 30000) / 1000), 10), 2)) return false;
    if (this.tier > 6 && NormalChallenge(10).isRunning) return false;
    if (EternityMilestone.unlockAllND.isReached) return true;
    if (DimBoost.totalBoosts.add(4).lt(this.tier)) return false;
    if (!(this.tier === 1 || AntimatterDimension(this.tier - 1).totalAmount.gt(0))) return false;
    return true;
  }

  reset() {
    this.amount = DC.D0;
    this.bought = DC.D0;
    this.costBumps = DC.D0;
  }

  resetAmount() {
    this.amount = DC.D0;
  }

  challengeCostBump() {
    if (InfinityChallenge(5).isRunning) this.multiplyIC5Costs();
    else if (NormalChallenge(9).isRunning) this.multiplySameCosts();
  }

  multiplySameCosts() {
    for (const dimension of AntimatterDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (dimension.cost.e === this.cost.e) {
        dimension.costBumps = dimension.costBumps.add(1);
      }
    }
    if (Tickspeed.cost.e === this.cost.e) player.chall9TickspeedCostBumps = player.chall9TickspeedCostBumps.add(1);
  }

  multiplyIC5Costs() {
    for (const dimension of AntimatterDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (this.tier <= 4 && dimension.cost.lt(this.cost)) {
        dimension.costBumps = dimension.costBumps.add(1);
      } else if (this.tier >= 5 && dimension.cost.gt(this.cost)) {
        dimension.costBumps = dimension.costBumps.add(1);
      }
    }
  }

  get multiplier() {
    return GameCache.antimatterDimensionFinalMultipliers[this.tier-1].value;
  }

  get cappedProductionInNormalChallenges() {
    if (Hell.isInside) return DC.ENUMMAX;
    if (Alpha.isRunning && Alpha.currentStage < 3) return DC.E300;
    const postBreak = (player.break && !NormalChallenge.isRunning) ||
      InfinityChallenge.isRunning || Enslaved.isRunning;
    const trueHardcap = player.break2 ? (Pelle.isDoomed ? DC.ENUMMAX : LHC.breakingPoint) : DC.E9E15;
    return postBreak ? trueHardcap : DC.E315;
  }

  get productionPerSecond() {
    const tier = this.tier;
    if (Laitela.isRunning && tier > Laitela.maxAllowedDimension) return DC.D0;
    let amount = this.totalAmount;
    if (NormalChallenge(12).isRunning) {
      switch (tier) {
        case 2:
          amount = amount.pow(1.6);
          break;
        case 4:
          amount = amount.pow(1.4);
          break;
        case 6:
          amount = amount.pow(1.2);
          break;
        default:
          break;
      }
    }

    const tierOneSoftcapStages = [];
    const recordTierOneSoftcap = (key, before, effectType, power) => {
      if (tier === 1) {
        tierOneSoftcapStages.push({ key, before, after: production, effectType, power });
      }
    };
    let production = amount.times(this.multiplier).times(this.tier === 9 ? DC.D1 : GameCache.tickspeedPerSecond.value);
    if (NormalChallenge(2).isRunning) {
      production = production.times(player.chall2Pow);
    }
    if (tier === 1) {
      if (NormalChallenge(3).isRunning) production = production.times(player.chall3Pow);
      if (production.gt(10)) {
        const productionExponent = getAdjustedGlyphEffect("effarigantimatter")
          .timesEffectsOf(EndgameUpgrade(15), SingularityMilestone.antimatterExponentPower)
          .times(Pelle.isDoomed ? SingularityMilestone.singAMDoomDilation.effectOrDefault(1) : 1);
        production = Decimal.pow10(Decimal.pow(production.max(1).log10(), productionExponent));
      }
      if (!player.compression.active) {
        if (production.gt(Decimal.pow10(1e150)) && Pelle.isDoomed && player.celestials.pelle.divinities < 1) {
          const before = production;
          const log10 = production.log10();
          production = Decimal.pow10(Decimal.pow(log10.div(1e150), 0.5).times(1e150));
          recordTierOneSoftcap("doomed-ad-1", before, "log-power", 0.5);
        }
        if (production.gt(Decimal.pow10(1e225)) && Pelle.isDoomed && player.celestials.pelle.divinities < 1) {
          const before = production;
          const log10 = production.log10();
          production = Decimal.pow10(Decimal.pow(log10.div(1e225), 0.1).times(1e225));
          recordTierOneSoftcap("doomed-ad-2", before, "log-power", 0.1);
        }
        if (production.gt(1e10) && Pelle.isDoomed) {
          const before = production;
          const log10 = production.log10().log10();
          const power = DivinityUpgrade.divineL1U4.effectOrDefault(1) * Accelerators.cosmic.effectValue3;
          production = Decimal.pow10(Decimal.pow10(Decimal.pow(log10,
            power)));
          recordTierOneSoftcap("doomed-ad-1e10", before, "double-log-power", power);
        }
        if (production.gt(1) && ResurgenceUpgrade.synergy5.isBought && !player.disablePostReality) {
          const before = production;
          production = production.powEffectOf(ResurgenceUpgrade.synergy5);
          const power = ResurgenceUpgrade.synergy5.effectValue;
          if (Decimal.lt(power, 1)) {
            recordTierOneSoftcap("resurgence-synergy5-ad", before, "power", power);
          }
        }
        if (ResurgenceUpgrade.ipSurge.isBought && !player.disablePostReality) {
          production = production.times(gainedInfinityPoints().max(1));
        }
        if (ResurgenceUpgrade.epSurge.isBought && !player.disablePostReality) {
          production = production.times(gainedEternityPoints().max(1));
        }
        if (production.gt(Decimal.pow10(1e200)) && !Pelle.isDoomed &&
          !player.endgame.overcharge.isRunning && !Slabdrill.isCursed) {
          const before = production;
          const log10 = production.log10();
          const power = 1 / Accelerators.emptiness.effectValue3;
          production = Decimal.pow10(Decimal.pow(log10.div(1e200), power).times(1e200));
          recordTierOneSoftcap("normal-ad-1", before, "log-power", power);
        }
        if (production.gt(Decimal.pow10(1e260)) && !Pelle.isDoomed &&
          !player.endgame.overcharge.isRunning && !Slabdrill.isCursed) {
          const before = production;
          const log10 = production.log10();
          production = Decimal.pow10(Decimal.pow(log10.div(1e260), 0.01).times(1e260));
          recordTierOneSoftcap("normal-ad-2", before, "log-power", 0.01);
        }
        if (production.gt(10) && LHC.nullifiedVoidRunning) {
          const before = production;
          const log10 = production.log10();
          production = Decimal.pow10(Decimal.pow(log10, 0.01));
          recordTierOneSoftcap("nullified-void-ad", before, "log-power", 0.01);
        }
        if (production.gt(Decimal.pow10(2e99)) && Slabdrill.isCursed) {
          const before = production;
          const log10 = production.log10();
          production = Decimal.pow10(Decimal.pow(log10.div(2e99), 0.1).times(2e99));
          recordTierOneSoftcap("cursed-slabdrill-ad", before, "log-power", 0.1);
        }
        if (production.gt(1) && player.endgame.overcharge.isRunning) {
          const before = production;
          production = Decimal.tetrate(10, production.slog().times(0.75).toNumber());
          recordTierOneSoftcap("overcharge-ad", before, "slog-power", 0.75);
        }
        if (production.gt(1) && Universes.isIn(1)) {
          const before = production;
          production = Decimal.tetrate(10, production.slog().times(0.9).toNumber());
          recordTierOneSoftcap("transient-ad", before, "slog-power", 0.9);
        }
        if (production.gt(1) && Universes.isIn(2)) {
          const before = production;
          const slogPower = production.slog().times(0.5).add(1)
            .add(Currency.molecularMass.value.max(1).slog().div(2).sub(1).max(0));
          production = Decimal.tetrate(10, slogPower.toNumber());
          recordTierOneSoftcap("tangible-ad", before, "slog-power", 0.5);
        }
        if (production.gt(Decimal.pow10(9e15)) && Pelle.isDoomed && player.celestials.pelle.divinities >= 1) {
          const before = production;
          const log10 = production.log10();
          const divinities = player.celestials.pelle.divinities;
          let softcapExponent;
          if (divinities >= 1e5) {
            const log10Divinities = Decimal.log10(divinities);
            const power = Decimal.pow(log10Divinities, new Decimal(divinities).times(log10Divinities));
            softcapExponent = Decimal.div(0.16, power);
          } else if (divinities >= 1e3) {
            softcapExponent = Decimal.div(0.16, Decimal.pow(Decimal.log10(divinities), divinities));
          } else {
            softcapExponent = 0.16 / Math.pow(2, divinities);
          }
          production = Decimal.pow10(Decimal.pow(log10.div(9e15), softcapExponent).times(9e15));
          recordTierOneSoftcap("doomed-divinity-ad", before, "log-power", softcapExponent);
        }
      }
    }
    if (tier !== 1 && NormalChallenge(12).isCharged &&
      ((player.break && !NormalChallenge.isRunning) || InfinityChallenge.isRunning || Enslaved.isRunning)) {
      production = production.min(amount.times(this.multiplier)
        .times(NormalChallenge(2).isRunning ? player.chall2Pow : 1));
    } else {
      production = production.min(this.cappedProductionInNormalChallenges);
    }
    if (tier === 1) this.productionSoftcapBreakdown = tierOneSoftcapStages;
    return production;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {AntimatterDimensionState}
 */
export const AntimatterDimension = AntimatterDimensionState.createAccessor();

export const AntimatterDimensions = {
  /**
   * @type {AntimatterDimensionState[]}
   */
  all: AntimatterDimension.index.compact(),

  reset() {
    for (const dimension of AntimatterDimensions.all) {
      dimension.reset();
    }
    GameCache.dimensionMultDecrease.invalidate();
  },

  resetAmountUpToTier(maxTier) {
    for (const dimension of AntimatterDimensions.all.slice(0, maxTier)) {
      dimension.resetAmount();
    }
  },

  get buyTenMultiplier() {
    if (NormalChallenge(7).isRunning) return DC.D2.min(DimBoost.totalBoosts.div(5).add(1));

    let mult = Hell.buyTenBase.plusEffectsOf(
      Achievement(141).effects.buyTenMult,
      EternityChallenge(3).reward
    );
    mult = mult.timesEffectsOf(
      InfinityUpgrade.buy10Mult,
      Achievement(58)
    ).times(getAdjustedGlyphEffect("powerbuy10"));

    mult = mult.pow(getAdjustedGlyphEffect("effarigforgotten")).powEffectOf(InfinityUpgrade.buy10Mult.chargedEffect);
    mult = mult.pow(ImaginaryUpgrade(14).effectOrDefault(1));
    mult = mult.powEffectOf(SingularityMilestone.perPurchaseDimMult);

    return mult;
  },

  get buyOoMPower() {
    return this.buyTenMultiplier.max(10).log10().log10().div(100).times(NormalChallenge(7).chargedEffect);
  },

  tick(diff) {

    // Stop producing antimatter at Big Crunch goal because all the game elements
    // are hidden when pre-break Big Crunch button is on screen.
    const hasBigCrunchGoal = !player.break || Player.isInAntimatterChallenge;
    const pendAmount = AntimatterDimension(1).productionPerSecond;
    const antimatterHardcap = AntimatterDimension(1).cappedProductionInNormalChallenges;
    const produceCappedAntimatter = production => {
      const remaining = antimatterHardcap.sub(Currency.antimatter.value);
      if (remaining.lte(0) || !production.gt(0)) return;
      Currency.antimatter.add(Decimal.isFinite(production) ? production.min(remaining) : remaining);
    };
    const amountLost = Decimal.pow(pendAmount, 0.01);
    const amountGained = amountLost.eq(0) ? DC.D0 : pendAmount.div(amountLost);
    const conversionToNull = Decimal.log10(amountLost.max(1)).pow(
      Decimal.log10(Decimal.log10(amountLost.max(1)).max(1))
    );
    if (LHC.voidRunning) Currency.nullMatter.add(conversionToNull.times(diff).div(1000));
    if (hasBigCrunchGoal && Currency.antimatter.gte(Player.infinityGoal)) return;

    let maxTierProduced = EternityChallenge(3).isRunning ? 3 :
      ((player.celestials.slabdrill.goodbyeTick >= 40000 || Slabdrill.isDestroyed) ? 8 : 7);
    let nextTierOffset = 1;
    if (NormalChallenge(12).isRunning) {
      maxTierProduced--;
      nextTierOffset++;
    }
    for (let tier = maxTierProduced; tier >= 1; --tier) AntimatterDimension(tier + nextTierOffset).produceDimensions(AntimatterDimension(tier), diff.div(10));
    if (AntimatterDimension(1).amount.gt(0)) {
      player.requirementChecks.eternity.noAD1 = false;
    }
    if (!LHC.voidRunning) produceCappedAntimatter(AntimatterDimension(1).productionForDiff(diff));
    if (LHC.voidRunning) produceCappedAntimatter(amountGained.times(diff).div(1000));
    if (NormalChallenge(12).isRunning) {
      produceCappedAntimatter(AntimatterDimension(2).productionForDiff(diff));
    }
    // Production may overshoot the goal on the final tick of the challenge
    if (hasBigCrunchGoal) Currency.antimatter.dropTo(Player.infinityGoal);
  }
};
