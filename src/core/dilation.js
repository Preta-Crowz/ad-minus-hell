import { RebuyableMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";
import FullScreenAnimationHandler from "./full-screen-animation-handler";
import { SpeedrunMilestones } from "./speedrun";

export function animateAndDilate() {
  FullScreenAnimationHandler.display("a-dilate", 2);
  setTimeout(() => {
    startDilatedEternity();
    if (Pelle.isDoomed) PelleStrikes.dilation.trigger();
  }, 1000);
}

// eslint-disable-next-line no-empty-function
export function animateAndUndilate(callback) {
  FullScreenAnimationHandler.display("a-undilate", 2);
  setTimeout(() => {
    eternity(false, false, { switchingDilation: true });
    if (callback) callback();
  }, 1000);
}

export function startDilatedEternityRequest() {
  if (Hell.isTrapped) return;
  if (!PlayerProgress.dilationUnlocked() || (Pelle.isDoomed && !Pelle.canDilateInPelle)) return;
  const playAnimation = player.options.animations.dilation && !FullScreenAnimationHandler.isDisplaying;
  if (player.dilation.active) {
    if (player.options.confirmations.dilation) {
      Modal.exitDilation.show();
    } else if (playAnimation) {
      animateAndUndilate();
    } else {
      eternity(false, false, { switchingDilation: true });
    }
  } else if (player.options.confirmations.dilation) {
    Modal.enterDilation.show();
  } else if (playAnimation) {
    animateAndDilate();
  } else {
    startDilatedEternity();
  }
}

export function startDilatedEternity(auto) {
  if (Hell.isTrapped) return false;
  if (!PlayerProgress.dilationUnlocked()) return false;
  if (GameEnd.creditsEverClosed) return false;
  if (player.dilation.active) {
    eternity(false, auto, { switchingDilation: true });
    return false;
  }
  Achievement(136).unlock();
  eternity(false, auto, { switchingDilation: true });
  player.dilation.active = true;
  if (Pelle.isDoomed) PelleStrikes.dilation.trigger();
  if (Slabdrill.isCursed && Slabdrill.currentStage === 9) {
    Slabdrill.advanceLayer();
    Glyphs.refreshActive();
    Slabdrill.quotes.dilation.show();
  }
  Glitch.quotes.dilation.show();
  return true;
}

const DIL_UPG_NAMES = [
  null, "dtGain", "galaxyThreshold", "tachyonGain", "doubleGalaxies", "tdMultReplicanti",
  "adMultDT", "ipMultDT", "timeStudySplit", "dilationPenalty", "ttGenerator",
  "dtGainPelle", "galaxyMultiplier", "tickspeedPower", "galaxyThresholdPelle", "flatDilationMult",
  "hellDilationPenalty", "hellDoubleGalaxies", "hellTdMultReplicanti"
];

export function buyDilationUpgrade(id, bulk = 1) {
  if (GameEnd.creditsEverClosed) return false;
  if (Pelle.isDoomed && !ChallengerUpgrade(9).isBought) {
    if (id === 3 && !PelleDestructionUpgrade.x3TPUpgrade.canBeApplied) return false;
    if (id === 7 && !PelleDestructionUpgrade.reenableIPDilationUpgrade.canBeApplied) return false;
  }
  // Upgrades 1-3 are rebuyable, and can be automatically bought in bulk with a perk shop upgrade
  const upgrade = DilationUpgrade[DIL_UPG_NAMES[id]];
  if (id > 3 && id < 11) {
    if (player.dilation.upgrades.has(id)) return false;
    if (!Currency.dilatedTime.purchase(upgrade.cost)) return false;
    player.dilation.upgrades.add(id);
    if (id === 4) player.dilation.totalTachyonGalaxies = player.dilation.totalTachyonGalaxies.mul(2);
  } else {
    const upgAmount = player.dilation.rebuyables[id];
    if (Currency.dilatedTime.lt(upgrade.cost) || upgAmount.gte(upgrade.purchaseCap)) return false;

    let buying = Decimal.affordGeometricSeries(Currency.dilatedTime.value,
      upgrade.config.initialCost, upgrade.config.increment, upgAmount);
    buying = Decimal.clampMax(buying, bulk);
    buying = Decimal.clampMax(buying, upgrade.purchaseCap.sub(upgAmount));
    const cost = Decimal.sumGeometricSeries(buying, upgrade.config.initialCost, upgrade.config.increment, upgAmount);
    Currency.dilatedTime.subtract(cost);
    player.dilation.rebuyables[id] = player.dilation.rebuyables[id].add(buying);
    if (id === 2) {
      if (!Perk.bypassTGReset.isBought || Pelle.isDoomed && !ChallengerUpgrade(9).isBought) Currency.dilatedTime.reset();
      player.dilation.nextThreshold = DC.E3;
      player.dilation.baseTachyonGalaxies = DC.D0;
      player.dilation.totalTachyonGalaxies = DC.D0;
    }

    if (id === 3 && !Pelle.isDisabled("tpMults")) {
      let retroactiveTPFactor = Effects.max(
        DC.D1,
        Perk.retroactiveTP1,
        Perk.retroactiveTP2,
        Perk.retroactiveTP3,
        Perk.retroactiveTP4
      );
      const allow = (Enslaved.isRunning && !Glitch.isRunning);
      const allowed = (allow || Glitch.augmentEffectActive(4));
      if (allowed) {
        retroactiveTPFactor = Decimal.pow(retroactiveTPFactor, Enslaved.tachyonNerf);
      }
      Currency.tachyonParticles.multiply(Decimal.pow(retroactiveTPFactor, buying));
    }
  }
  return true;
}

export function maxPurchaseDilationUpgrades() {
  if (Pelle.isDoomed) return false;
  const dtQuikBuy = Currency.dilatedTime.value.div(1000);
  // Insta buy everything costing up to 0.1% of DT, without even worrying about subtracting DT
  let didBuy = false;
  const UpgPurchased = player.dilation.rebuyables[1];
  player.dilation.rebuyables[1] = Decimal.max(player.dilation.rebuyables[1], dtQuikBuy.div(1e3).log(10).floor());
  if (UpgPurchased.neq(player.dilation.rebuyables[1])) didBuy = true;
  // eslint-disable-next-line max-len
  const tpUpgPurchased = Decimal.max(player.dilation.rebuyables[3], dtQuikBuy.div(1e4).log(20).floor()).sub(player.dilation.rebuyables[3]);
  player.dilation.rebuyables[3] = player.dilation.rebuyables[3].add(tpUpgPurchased);
  if (tpUpgPurchased.gt(0)) didBuy = didBuy || true;
  if (Perk.bypassTGReset.isBought) {
    // Just call the above function, since it handles caps and everything for us already
    didBuy = didBuy || buyDilationUpgrade(2, 123456);
  }

  function allrebuyablesLayer() {
    let bool = true;
    if (player.dilation.rebuyables[1].layer !== 0) bool = false;
    // eslint-disable-next-line max-len
    if (player.dilation.rebuyables[2].layer !== 0 ||
      player.dilation.rebuyables[1].gt(DilationUpgrade.galaxyThreshold.purchaseCap)) bool = false;
    if (player.dilation.rebuyables[3].layer !== 0) bool = false;
    return bool;
  }

  let didBuyLastIter = false;
  for (let i = 0; i < 50 && allrebuyablesLayer(); i++) {
    didBuyLastIter = buyDilationUpgrade(1, 1);
    if (Perk.bypassTGReset.isBought) {
      didBuyLastIter = didBuyLastIter || buyDilationUpgrade(2, 1);
    }
    didBuyLastIter = didBuyLastIter || buyDilationUpgrade(3, 1);
    didBuy = didBuy || didBuyLastIter;
  }
  didBuy = didBuy || buyDilationUpgrade(2, 1);
  return didBuy;
}

export function getTachyonGalaxyMult(thresholdUpgrade) {
  // This specifically needs to be an undefined check because sometimes thresholdUpgrade is zero
  const upgrade = thresholdUpgrade === undefined ? DilationUpgrade.galaxyThreshold.effectValue : thresholdUpgrade;
  const thresholdMult = (BreakEternityUpgrade.tgThresholdUncap.isBought && !player.disablePostReality)
    ? upgrade.times(3.65).add(Decimal.pow(upgrade, 0.001).times(0.35))
    : upgrade.times(3.65).add(0.35);
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect.eq(0) ? DC.D1 : glyphEffect;
  const pellePower = DilationUpgrade.galaxyThresholdPelle.canBeApplied
    ? DilationUpgrade.galaxyThresholdPelle.effectValue : DC.D1;
  const galacticPower = GalacticPowers.tachyonGalaxies.isUnlocked
    ? DC.D1.div(GalacticPowers.tachyonGalaxies.reward)
    : DC.D1;
  const power = new Decimal(pellePower).times(EndgameUpgrade(22).effectOrDefault(1)).times(galacticPower);
  return thresholdMult.mul(glyphReduction).add(1).pow(power);
}

export function getBaseTachyonGalaxyMult() {
  const upgrade = DilationUpgrade.galaxyThreshold.effectValue;
  const thresholdMult = (BreakEternityUpgrade.tgThresholdUncap.isBought && !player.disablePostReality)
    ? upgrade.times(3.65).add(Decimal.pow(upgrade, 0.001).times(0.35))
    : upgrade.times(3.65).add(0.35);
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect.eq(0) ? DC.D1 : glyphEffect;
  return thresholdMult.times(glyphReduction);
}

export function getTachyonGalaxyPowers() {
  const pellePower = DilationUpgrade.galaxyThresholdPelle.canBeApplied
    ? DilationUpgrade.galaxyThresholdPelle.effectValue : DC.D1;
  const galacticPower = GalacticPowers.tachyonGalaxies.isUnlocked
    ? DC.D1.div(GalacticPowers.tachyonGalaxies.reward)
    : DC.D1;
  return new Decimal(pellePower).times(EndgameUpgrade(22).effectOrDefault(1)).times(galacticPower);
}

export function getDilationGainPerSecond() {
  const nerfDivisor = Pelle.isDoomed && PelleDestructionUpgrade.disableDTNerf.canBeApplied ? 1 : 1e5;
  if (Pelle.isDoomed && !ChallengerUpgrade(9).isBought) {
    const tachyonEffect = Currency.tachyonParticles.value.pow(PelleRifts.paradox.milestones[1].effectOrDefault(1));
    let dtRate = new Decimal(tachyonEffect)
      .timesEffectsOf(DilationUpgrade.dtGain, DilationUpgrade.dtGainPelle, DilationUpgrade.flatDilationMult)
      .times(ShopPurchase.dilatedTimePurchases.currentMult.pow(0.5))
      .times(Pelle.specialGlyphEffect.dilation).div(nerfDivisor);
    if (PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied) {
      const replicantiDTMult = Decimal.clampMin(
        Decimal.log10(Replicanti.amount.add(1)).mul(getAdjustedGlyphEffect("replicationdtgain")), 1);
      dtRate = dtRate.times(getAdjustedGlyphEffect("dilationDT")).times(replicantiDTMult);
    }
    if (getAdjustedGlyphEffect("replicationdtgain").neq(0) && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) {
      dtRate = dtRate.pow(ReplicantiMultipliers.dtPow);
    }
    if (LHC.voidRunning) dtRate = dtRate.timesEffectOf(LHCNullUpgrade.dilatedTimeMult);
    return dtRate;
  }
  let dtRate = new Decimal(Currency.tachyonParticles.value)
    .timesEffectsOf(
      DilationUpgrade.dtGain,
      Achievement(132),
      Achievement(137),
      RealityUpgrade(1),
      AlchemyResource.dilation,
      Ra.unlocks.continuousTTBoost.effects.dilatedTime,
      Ra.unlocks.peakGamespeedDT,
      DilationUpgrade.dtGainPelle,
      DilationUpgrade.flatDilationMult
    ).times(Pelle.specialGlyphEffect.dilation).div(nerfDivisor);
  if(player.realities.lt(5))dtRate = dtRate.times(3);
  dtRate = dtRate.times(realityUGs.all[1].effectOrDefault(1));
  dtRate = dtRate.times(getAdjustedGlyphEffect("dilationDT"));
  dtRate = dtRate.times(ShopPurchase.dilatedTimePurchases.currentMult);
  dtRate = dtRate.times(
    Decimal.clampMin(Decimal.log10(Replicanti.amount.add(1)).mul(getAdjustedGlyphEffect("replicationdtgain")), 1));
  if (LHC.voidRunning) dtRate = dtRate.timesEffectOf(LHCNullUpgrade.dilatedTimeMult);
  if (getAdjustedGlyphEffect("replicationdtgain").neq(0) && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) {
    dtRate = dtRate.pow(ReplicantiMultipliers.dtPow);
  }
  if (ResurgenceUpgrade.curr2Surge.isBought && !player.disablePostReality && !Pelle.isDoomed) {
    dtRate = dtRate.pow(player.dilation.dilatedTime.max(1e10).log10().log10());
  }
  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(4));
  
  if (allowed && !dtRate.eq(0)) dtRate = Decimal.pow10(dtRate.plus(1).log10().pow(0.85).sub(1));
  if (V.isRunning) dtRate = dtRate.pow(0.5);
  if (V.isRunningExtreme) dtRate = dtRate.pow(0.2);
  if (Universes.isIn(1)) dtRate = Decimal.pow10(Decimal.pow(dtRate.max(10).log10(), 0.1));
  return dtRate;
}

export function tachyonGainMultiplier() {
  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(4));
  
  if (Pelle.isDisabled("tpMults")) {
    let pelleTP = new Decimal(1);
    if (PelleDestructionUpgrade.x3TPUpgrade.canBeApplied) {
      pelleTP = pelleTP.timesEffectOf(DilationUpgrade.tachyonGain);
    }
    let multiplier = pelleTP.times(realityUGs.all[1].effectOrDefault(1))
      .timesEffectOf(Ra.unlocks.gameSpeedTachyonMult);
    if (LHC.voidRunning) multiplier = multiplier.timesEffectOf(LHCNullUpgrade.tachyonParticleMult);
    return multiplier;
  }
  const pow = allowed ? Enslaved.tachyonNerf : 1;
    let multiplier = Effects.product(
      DilationUpgrade.tachyonGain,
      GlyphSacrifice.dilation,
      Achievement(132),
      RealityUpgrade(4),
      RealityUpgrade(8),
      RealityUpgrade(15),
      Ra.unlocks.gameSpeedTachyonMult
    ).times(GlyphInfo.dilation.sacrificeInfo.effect()).times(realityUGs.all[1].effectOrDefault(1)).pow(pow).pow(V.isRunningExtreme ? 0.5 : 1);
  if (LHC.voidRunning) multiplier = multiplier.timesEffectOf(LHCNullUpgrade.tachyonParticleMult);
  return multiplier;
}

export function rewardTP() {
  Currency.tachyonParticles.bumpTo(getTP(player.records.thisEternity.maxAM, true));
  player.dilation.lastEP = Currency.eternityPoints.value;
}

// This function exists to apply Teresa-25 in a consistent way; TP multipliers can be very volatile and
// applying the reward only once upon unlock promotes min-maxing the upgrade by unlocking dilation with
// TP multipliers as large as possible. Applying the reward to a base TP value and letting the multipliers
// act dynamically on this fixed base value elsewhere solves that issue
export function getBaseTP(antimatter, requireEternity) {
  if (!Player.canEternity && requireEternity) return DC.D0;
  const am = (isInCelestialReality() || Pelle.isDoomed)
    ? antimatter
    : Ra.unlocks.unlockDilationStartingTP.effectOrDefault(antimatter);
  let baseTP = am.max(1).log10().div(400).pow(1.5);

  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(4));
  
  if (allowed) baseTP = baseTP.pow(Enslaved.tachyonNerf);
  return baseTP;
}

// Returns the TP that would be gained this run
export function getTP(antimatter, requireEternity) {
  let tp = getBaseTP(antimatter, requireEternity).times(tachyonGainMultiplier());
  if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) {
    tp = tp.pow(Achievements.powerConv(RealityUpgrade(8).effectOrDefault(1)));
  }
  if (ResurgenceUpgrade.curr2Surge.isBought && !player.disablePostReality && !Pelle.isDoomed) {
    tp = tp.pow(player.dilation.tachyonParticles.max(1e10).log10().log10());
  }
  if (Universes.isIn(1)) tp = Decimal.pow10(Decimal.pow(tp.max(10).log10(), 0.1));
  return tp;
}

// Returns the amount of TP gained, subtracting out current TP; used for displaying gained TP, text on the
// "exit dilation" button (saying whether you need more antimatter), and in last 10 eternities
export function getTachyonGain(requireEternity) {
  return getTP(Currency.antimatter.value, requireEternity).minus(Currency.tachyonParticles.value).clampMin(0);
}

// Returns the minimum antimatter needed in order to gain more TP; used only for display purposes
export function getTachyonReq() {
  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(4));
  
  let effectiveTP = Currency.tachyonParticles.value.dividedBy(tachyonGainMultiplier());
  if (Universes.isIn(1)) {
    effectiveTP = Decimal.pow10(Decimal.pow(effectiveTP.max(10).log10(), 10));
  }
  if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) {
    effectiveTP = effectiveTP.pow(Achievements.powerConv(RealityUpgrade(8).effectOrDefault(1)).recip());
  }
  if (ResurgenceUpgrade.curr2Surge.isBought && !player.disablePostReality && !Pelle.isDoomed) {
    effectiveTP = effectiveTP.pow(DC.D1.div(player.dilation.tachyonParticles.max(1e10).log10().log10()));
  }
  if (allowed) effectiveTP = effectiveTP.pow(1 / Enslaved.tachyonNerf);
  return Decimal.pow10(
    effectiveTP
      .times(Math.pow(400, 1.5))
      .pow(2 / 3)
      .toNumber()
  );
}

export function getDilationTimeEstimate(goal) {
  const currentDTGain = getDilationGainPerSecond();
  const rawDTGain = currentDTGain.times(getGameSpeedupForDisplay());
  const currentDT = Currency.dilatedTime.value;
  if (currentDTGain.eq(0)) return null;
  if (!ChallengerUpgrade(19).isBought && PelleRifts.paradox.isActive) {
    const drain = Pelle.riftDrainPercent;
    const goalNetRate = rawDTGain.minus(Decimal.multiply(goal, drain));
    const currNetRate = rawDTGain.minus(currentDT.times(drain));
    if (goalNetRate.lt(0)) return "Never affordable due to Rift drain";
    return TimeSpan.fromSeconds(currNetRate.div(goalNetRate).ln().div(drain)).toTimeEstimate();
  }
  return TimeSpan.fromSeconds(Decimal.sub(goal, currentDT)
    .div(rawDTGain)).toTimeEstimate();
}

export function dilationPenaltyExponent(pre = false) {
  const ex = player.celestials.pelle.galaxyGenerator.generatedGalaxies.add(1).log10().add(1).log10().div(4).max(0);
  return Decimal.min(Effects.product(DilationUpgrade.dilationPenalty)
  .mul(pre ? GlitchSpeedUpgrades.all[0].effectOrDefault(1) : 1).mul(0.75)
  .add(ex).add(GlitchRifts.delta.milestones[2].effectOrDefault(0))
  .add(DilationUpgrade.hellDilationPenalty.effectOrDefault(0)).add(Hell.dilationExponentOffset), 1);
}

export function dilatedValueOf(value, pre = false) {
  const log10 = value.eq(0) ? DC.D0 : value.log10();
  const dilationPenalty = dilationPenaltyExponent(pre);
  return Decimal.pow10(log10.abs().pow(dilationPenalty).times(Decimal.sign(log10)));
}

export function dilateMultiplier(value, mag) {
  if (value.lte(0)) return new Decimal(0);
  const log10 = value.log10();
  return Decimal.pow10(new Decimal(Decimal.sign(log10)).times(Decimal.pow(Decimal.abs(log10), mag)));
}

class DilationUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.dilatedTime;
  }

  get set() {
    return player.dilation.upgrades;
  }

  get isAvailableForPurchase() {
    if (this.config.hellOnly && !Hell.isInside) return false;
    return this.id !== 7 || !Pelle.isDoomed || ChallengerUpgrade(9).isBought ||
      PelleDestructionUpgrade.reenableIPDilationUpgrade.canBeApplied;
  }

  get isEffectActive() {
    return super.isEffectActive && this.isAvailableForPurchase;
  }

  onPurchased() {
    if (this.id === 4) player.dilation.totalTachyonGalaxies = player.dilation.totalTachyonGalaxies.mul(2);
    if (this.id === 10) {
      SpeedrunMilestones(15).tryComplete();
      if (Alpha.isRunning && Alpha.currentStage === 25) {
        Alpha.advanceLayer();
        Alpha.quotes.ttGen.show();
      }
    }
  }
}

class RebuyableDilationUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.dilatedTime;
  }

  get boughtAmount() {
    return player.dilation.rebuyables[this.id];
  }

  get isAvailableForPurchase() {
    if (this.config.hellOnly && !Hell.isInside) return false;
    return this.id !== 3 || !Pelle.isDoomed || ChallengerUpgrade(9).isBought ||
      PelleDestructionUpgrade.x3TPUpgrade.canBeApplied;
  }

  get isEffectActive() {
    return super.isEffectActive && this.isAvailableForPurchase;
  }

  set boughtAmount(value) {
    player.dilation.rebuyables[this.id] = value;
  }

  get isCapped() {
    return this.config.reachedCap();
  }

  get purchaseCap() {
    return this.config.purchaseCap();
  }

  purchase(bulk) {
    buyDilationUpgrade(this.config.id, bulk);
  }
}

export const DilationUpgrade = mapGameDataToObject(
  GameDatabase.eternity.dilation,
  config => (config.rebuyable
    ? new RebuyableDilationUpgradeState(config)
    : new DilationUpgradeState(config))
);

export const DilationUpgrades = {
  rebuyable: [
    DilationUpgrade.dtGain,
    DilationUpgrade.galaxyThreshold,
    DilationUpgrade.tachyonGain,
  ],
  fromId: id => DilationUpgrade.all.find(x => x.id === Number(id))
};
