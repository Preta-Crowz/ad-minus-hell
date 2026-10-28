import { DC } from "../constants";

import { DimensionState } from "./dimension";

function checkForAlphaTimeDimensionCompletion() {
  if (Alpha.isRunning && Alpha.currentStage === 13 && TimeDimension(4).amount.gte(1)) {
    Alpha.advanceLayer();
    Alpha.quotes.fourthTimeDimension.show();
  } else if (Alpha.isRunning && Alpha.currentStage === 26 && TimeDimension(8).amount.gte(1)) {
    Alpha.advanceLayer();
    Alpha.quotes.eighthTimeDimension.show();
  }
}

export function buySingleTimeDimension(tier, auto = false) {
  const dim = TimeDimension(tier);
  if((!eternityUGs.all[1].config.hasFailed() && !eternityUGs.all[1].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && player.eternities.eq(1)){
    Modal.message.show(`you will fail glitch challenge ${eternityUGs.all[1].config.name} <br> which is to ${eternityUGs.all[1].config.requirement} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  if (tier > 4) {
    if (!TimeStudy.timeDimension(tier).isBought) return false;
    if (RealityUpgrade(13).isLockingMechanics && Currency.eternityPoints.gte(dim.cost)) {
      if (!auto) RealityUpgrade(13).tryShowWarningModal();
      return false;
    }
  }
  if (!Hell.canBuyTimeDimensions) return false;
  if (Hell.timeDimensionBudget.lt(dim.cost)) return false;
  
  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(3));
  
  if (allowed && dim.bought.gt(0)) return false;
  if (ImaginaryUpgrade(15).isLockingMechanics && EternityChallenge(7).completions > 0) {
    if (!auto) {
      ImaginaryUpgrade(15).tryShowWarningModal(`purchase a Time Dimension,
        which will produce Infinity Dimensions through EC7`);
    }
    return false;
  }

  Hell.timeDimensionCurrency.subtract(dim.cost);
  dim.amount = dim.amount.add(1);
  dim.bought = dim.bought.add(1);
  dim.cost = dim.nextCost(dim.bought);
  checkForAlphaTimeDimensionCompletion();
  return true;
}

export function resetTimeDimensions() {
  for (const dim of TimeDimensions.all) dim.amount = new Decimal(dim.bought);
  updateTimeDimensionCosts();
}

export function fullResetTimeDimensions() {
  for (const dim of TimeDimensions.all) {
    dim.cost = new Decimal(dim.baseCost);
    dim.amount = DC.D0;
    dim.bought = DC.D0;
  }
}

export function toggleAllTimeDims() {
  const areEnabled = Autobuyer.timeDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.timeDimension(i).isActive = !areEnabled;
  }
}

export function calcHighestPurchaseableTD(tier, currency) {
  const logC = currency.max(1).log10();
  const logBase = TimeDimension(tier)._baseCost.max(1).log10();
  let logMult = Decimal.log10(TimeDimension(tier)._costMultiplier);

  if (tier > 4 && currency.lt(DC.E6000)) {
    return Decimal.max(0, logC.sub(logBase).div(logMult)).floor();
  }

  if (currency.gte(DC.E6000)) {
    logMult = TimeDimension(tier)._costMultiplier.mul(tier <= 4 ? 2.2 : 1).max(1).log10();
    const preInc = Decimal.log10(DC.E6000).sub(logBase).div(logMult);
    const postInc = logC.sub(logBase).sub(6000).div(logMult).div(TimeDimensions.scalingPast1e6000).clampMin(0);
    return postInc.add(preInc).floor();
  }

  if (currency.lt(DC.NUMMAX)) {
    return Decimal.max(0, logC.sub(logBase).div(logMult).add(1)).floor();
  }

  if (currency.lt(DC.E1300)) {
    const preInc = Decimal.log10(DC.NUMMAX).sub(logBase).div(logMult).floor();
    logMult = TimeDimension(tier)._costMultiplier.mul(1.5).max(1).log10();
    const decCur = logC.sub(preInc.mul(logMult));
    const postInc = decCur.div(logMult).clampMin(0).floor();
    return Decimal.add(preInc, postInc);
  }

  if (currency.lt(DC.E6000)) {
    logMult = TimeDimension(tier)._costMultiplier.mul(1.5).max(1).log10();
    const preInc = Decimal.log10(DC.E1300).sub(logBase).div(logMult).floor();
    logMult = TimeDimension(tier)._costMultiplier.mul(2.2).max(1).log10();
    const decCur = logC.sub(preInc.mul(logMult));
    const postInc = decCur.div(logMult).clampMin(0).floor();
    return Decimal.add(preInc, postInc);
  }
  throw new Error("calcHighestPurchasableTD reached too far in code");
}

export function buyMaxTimeDimension(tier, portionToSpend = 1, isMaxAll = false) {
  if((!eternityUGs.all[1].config.hasFailed() && !eternityUGs.all[1].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked()) && player.eternities.eq(1)){
    Modal.message.show(`you will fail glitch challenge ${eternityUGs.all[1].config.name} <br> which is to ${eternityUGs.all[1].config.requirement} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  const canSpend = Hell.timeDimensionBudget.times(portionToSpend);
  const dim = TimeDimension(tier);
  if (!Hell.canBuyTimeDimensions) return false;
  if (canSpend.lt(dim.cost)) return false;

  if (tier > 4) {
    if (!TimeStudy.timeDimension(tier).isBought) return false;
    if (RealityUpgrade(13).isLockingMechanics) {
      if (!isMaxAll) RealityUpgrade(13).tryShowWarningModal();
      return false;
    }
  }
  if (ImaginaryUpgrade(15).isLockingMechanics && EternityChallenge(7).completions > 0) {
    if (!isMaxAll) {
      ImaginaryUpgrade(15).tryShowWarningModal(`purchase a Time Dimension,
        which will produce Infinity Dimensions through EC7`);
    }
    return false;
  }
  
  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(3));

  
  if (allowed) return buySingleTimeDimension(tier);
  if (Hell.isInside) {
    const bulk = Hell.bulkTimeDimensions(tier, dim.bought, canSpend);
    if (bulk.count.lte(0)) return false;
    Currency.antimatter.subtract(bulk.cost);
    dim.amount = dim.amount.add(bulk.count);
    dim.bought = dim.bought.add(bulk.count);
    checkForAlphaTimeDimensionCompletion();
    return true;
  }
  const pur = Decimal.sub(calcHighestPurchaseableTD(tier, canSpend), dim.bought).clampMin(0);
  const cost = dim.nextCost(pur.add(dim.bought).sub(1));
  if (pur.lte(0)) return false;
  if(Currency.eternityPoints.lt('ee15')) Currency.eternityPoints.subtract(cost);
  dim.amount = dim.amount.add(pur);
  dim.bought = dim.bought.add(pur);
  dim.cost = dim.nextCost(dim.bought);
  checkForAlphaTimeDimensionCompletion();
  return true;
}

export function maxAllTimeDimensions() {
  // Try to buy single from the highest affordable new dimensions
  for (let i = 8; i > 0 && TimeDimension(i).bought.eq(0); i--) {
    buySingleTimeDimension(i, true);
  }

  // Buy everything costing less than 1% of initial EP
  for (let i = 8; i > 0; i--) {
    buyMaxTimeDimension(i, 0.01, true);
  }

  // Loop buying the cheapest dimension possible; explicit infinite loops make me nervous
  const tierCheck = tier => (RealityUpgrade(13).isLockingMechanics ? tier < 5 : true);
  const purchasableDimensions = TimeDimensions.all.filter(d => d.isUnlocked && tierCheck(d.tier));
  for (let stop = 0; stop < 1000; stop++) {
    const cheapestDim = purchasableDimensions.reduce((a, b) => (b.cost.gte(a.cost) ? a : b));
    if (!buySingleTimeDimension(cheapestDim.tier, true)) break;
  }
}

export function timeDimensionCommonMultiplier() {
  let mult = new Decimal(ShopPurchase.allDimPurchases.currentMult)
    .timesEffectsOf(
      Achievement(105),
      Achievement(128),
      TimeStudy(93),
      TimeStudy(103),
      TimeStudy(151),
      TimeStudy(221),
      TimeStudy(301),
      EternityChallenge(1).reward,
      EternityChallenge(10).reward,
      EternityUpgrade.tdMultAchs,
      EternityUpgrade.tdMultTheorems,
      EternityUpgrade.tdMultRealTime,
      Replicanti.areUnlocked && Replicanti.amount.gt(1) && !DilationUpgrade.hellTdMultReplicanti.canBeApplied
        ? DilationUpgrade.tdMultReplicanti : null,
      Pelle.isDoomed ? null : RealityUpgrade(22),
      AlchemyResource.dimensionality,
      realityUGs.all[3],
      PelleRifts.chaos
    );
  if (LHC.voidRunning) mult = mult.timesEffectOf(LHCNullUpgrade.timeDimensionMult);

  mult = mult.powEffectsOf(
    EternityUpgrade.tdMultAchs.chargedEffect,
    EternityUpgrade.tdMultTheorems.chargedEffect,
    EternityUpgrade.tdMultRealTime.chargedEffect
  );
  mult = mult.pow(NormalChallenge(2).chargedEffect);

  if (EternityChallenge(9).isRunning) {
    mult = mult.times(
      Decimal.pow(
        // eslint-disable-next-line max-len
        Decimal.clampMin(Currency.infinityPower.value.max(1).pow(InfinityDimensions.powerConversionRate.div(7)).log2(), 1),
        4)
        .clampMin(1));
  }
  return mult;
}

export function updateTimeDimensionCosts() {
  for (let i = 1; i <= 8; i++) {
    const dim = TimeDimension(i);
    dim.cost = dim.nextCost(dim.bought);
  }
}

class TimeDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.time, tier);
    const BASE_COSTS = [null, DC.D1, DC.D5, DC.E2, DC.E3, DC.E2350, DC.E2650, DC.E3000, DC.E3350];
    this._baseCost = BASE_COSTS[tier];
    const COST_MULTS = [null, 3, 9, 27, 81, 24300, 72900, 218700, 656100].map(e => (e ? new Decimal(e) : null));
    this._costMultiplier = COST_MULTS[tier];
    // eslint-disable-next-line max-len
    const E6000_SCALING_AMOUNTS = [null, 7322, 4627, 3382, 2665, 833, 689, 562, 456].map(e => (e ? new Decimal(e) : null));
    this._e6000ScalingAmount = E6000_SCALING_AMOUNTS[tier];
    const COST_THRESHOLDS = [DC.NUMMAX, DC.E1300, DC.E6000];
    this._costIncreaseThresholds = COST_THRESHOLDS;
  }

  /** @returns {Decimal} */
  get cost() {
    return Hell.isInside ? Hell.timeDimensionCost(this._tier, this.bought) : this.data.cost;
  }

  /** @param {Decimal} value */
  set cost(value) { this.data.cost = value; }

  nextCost(bought) {
    if (this._tier > 4 && bought.lt(this.e6000ScalingAmount)) {
      const cost = Decimal.pow(this.costMultiplier, bought).times(this.baseCost);
      if (PelleRifts.paradox.milestones[0].canBeApplied) {
        return cost.div("1e2250").pow(0.5);
      }
      return cost;
    }

    const costMultIncreases = [1, 1.5, 2.2];
    for (let i = 0; i < this._costIncreaseThresholds.length; i++) {
      const cost = Decimal.pow(this.costMultiplier.mul(costMultIncreases[i]), bought).times(this.baseCost);
      if (cost.lt(this._costIncreaseThresholds[i])) return cost;
    }

    let base = this.costMultiplier;
    if (this._tier <= 4) base = base.mul(2.2);
    const exponent = this.e6000ScalingAmount.add((bought.sub(this.e6000ScalingAmount))
      .times(TimeDimensions.scalingPast1e6000));
    const cost = Decimal.pow(base, exponent).times(this.baseCost);

    if (PelleRifts.paradox.milestones[0].canBeApplied && this._tier > 4) {
      return cost.div("1e2250").pow(0.5);
    }
    return cost;
  }

  get isUnlocked() {
    return this._tier < 5 || TimeStudy.timeDimension(this._tier).isBought;
  }

  get isAvailableForPurchase() {
    if (Hell.isInside && this._tier > 6) return false;
    return this.isAffordable;
  }

  get isAffordable() {
    return Hell.timeDimensionBudget.gte(this.cost) && Hell.canBuyTimeDimensions;
  }

  get multiplier() {
    const tier = this._tier;

    if (EternityChallenge(11).isRunning) {
      let production = DC.D1;
      if (V.isRunningExtreme) {
        production = production.pow(0.001);
      }
      
      production = production.pow(V.rageDimPower);
      return production;
    }
    let mult = GameCache.timeDimensionCommonMultiplier.value
      .timesEffectsOf(
        tier === 1 ? TimeStudy(11) : null,
        tier === 3 ? TimeStudy(73) : null,
        tier === 4 ? TimeStudy(227) : null
      );

    const dim = TimeDimension(tier);
    const bought = tier === 8 ? Decimal.clampMax(dim.bought, 1e8) : Decimal.clampMax(dim.bought, 1e30);
    mult = mult.times(Decimal.pow(dim.powerMultiplier, bought));
    mult = mult.times(Hell.timeDimensionPower(tier));

      mult = mult.pow(getAdjustedGlyphEffect("timepow"));
      mult = mult.powEffectOf(Ra.unlocks.allDimPowTT);
    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));
    mult = mult.pow(getAdjustedGlyphEffect("curseddimensions"));
    mult = mult.powEffectOf(AlchemyResource.time);
    mult = mult.pow(Ra.momentumValue);
    mult = mult.pow(ImaginaryUpgrade(11).effectOrDefault(1));
    mult = mult.powEffectOf(PelleRifts.paradox);
    mult = mult.powEffectOf(SingularityMilestone.dimensionPow);
    mult = mult.pow(GlitchRifts.gamma.milestones[0].effectOrDefault(1));
    mult = mult.pow(MetaFabricatorUpgrades.all[1].effectOrDefault(1));
    if (ExpansionPack.pellePack.isBought && !player.disablePostReality) {
      mult = mult.pow(Decimal.pow(Decimal.log10(player.records.bestEndgame.galaxies.max(1)).div(100), 1.5).add(1));
    }

    if (player.dilation.active || (PelleStrikes.dilation.hasStrike && !PelleStrikes.dilation.isDestroyed())) {
      mult = dilatedValueOf(mult);
    }

    if (DilationUpgrade.hellTdMultReplicanti.canBeApplied && Replicanti.areUnlocked && Replicanti.amount.gt(1)) {
      mult = mult.timesEffectOf(DilationUpgrade.tdMultReplicanti);
    }

    if (V.isRunningExtreme) {
      mult = mult.pow(0.001);
    }
    
    mult = mult.pow(V.rageDimPower);

    if (Effarig.isRunning) mult = Effarig.multiplier(mult);
    
    if (V.isRunning && !(Hell.isInside && V.isRunningExtreme)) mult = mult.pow(0.5);

    if(Glitch.isRunning) mult = mult.pow(Glitch.TDnerf);
    mult = mult.times(Hell.bigRipDimensionMultiplier);

    if (DilationUpgrade.tdMultReplicanti.isBought && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) {
      mult = mult.pow(ReplicantiMultipliers.tdPow);
    }
    if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) {
      mult = mult.pow(Achievements.powerConv(EternityUpgrade.tdMultAchs.effectOrDefault(1)));
    }

    if (player.compression.active) {
      mult = compressedMultiplier(mult);
    }
    if (Hell.isInside) mult = dilateMultiplier(mult, Ascension.overchargePenalty);

    if (mult.gte(TimeDimensions.OVERFLOW)) {
      mult = Decimal.pow(10, Decimal.pow(
        mult.log10().div(Decimal.log10(TimeDimensions.OVERFLOW)),
        1 / TimeDimensions.compressionMagnitude
      ).times(Decimal.log10(TimeDimensions.OVERFLOW)));
    }
    if (mult.gte(TimeDimensions.OVERFLOW_SQUARED)) {
      mult = Decimal.pow(10, Decimal.pow(
        mult.log10().div(Decimal.log10(TimeDimensions.OVERFLOW_SQUARED)),
        1 / TimeDimensions.compressionMag2
      ).times(Decimal.log10(TimeDimensions.OVERFLOW_SQUARED)));
    }

    return mult;
  }

  get productionPerSecond() {
    if (Universes.isIn(1) || Universes.isIn(2) ||
      EternityChallenge(1).isRunning || EternityChallenge(10).isRunning ||
    (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension)) {
      return DC.D0;
    }
    if (EternityChallenge(11).isRunning) {
      return this.amount;
    }
    let production = this.amount.times(this.multiplier);
    if (EternityChallenge(7).isRunning) {
      production = production.times(GameCache.tickspeedPerSecond.value);
    }
    if (this._tier === 1 && !EternityChallenge(7).isRunning) {
      production = production.pow(getAdjustedGlyphEffect("timeshardpow"));
    }
    return production;
  }

  get rateOfChange() {
    const tier = this._tier;
    if (tier === 8) {
      return DC.D0;
    }
    const toGain = TimeDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get isProducing() {
    const tier = this.tier;
    if (Universes.isIn(1) || EternityChallenge(1).isRunning ||
      EternityChallenge(10).isRunning ||
      Universes.isIn(2) ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension)) {
      return false;
    }
    return this.amount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    return this._costMultiplier;
  }

  get powerMultiplier() {
    if (Hell.isInside) return AntimatterDimensions.buyTenMultiplier;
    return DC.D4
      .times(this._tier === 8 ? GlyphInfo.time.sacrificeInfo.effect() : new Decimal(1))
      .pow(ImaginaryUpgrade(14).effectOrDefault(1))
      .powEffectOf(SingularityMilestone.perPurchaseDimMult);
  }

  get e6000ScalingAmount() {
    return this._e6000ScalingAmount;
  }

  get costIncreaseThresholds() {
    return this._costIncreaseThresholds;
  }

  get requirementReached() {
    return this._tier < 5 ||
      (TimeStudy.timeDimension(this._tier).isAffordable && TimeStudy.timeDimension(this._tier - 1).isBought);
  }

  tryUnlock() {
    if (this.isUnlocked) return;
    TimeStudy.timeDimension(this._tier).purchase();
  }
}

/**
 * @function
 * @param {number} tier
 * @return {TimeDimensionState}
 */
export const TimeDimension = TimeDimensionState.createAccessor();

export const TimeDimensions = {
  /**
   * @type {TimeDimensionState[]}
   */
  all: TimeDimension.index.compact(),

  get OVERFLOW() {
    if (!PlayerProgress.endgameUnlocked()) return DC.E1E15;
    return DC.E1E15.powEffectsOf(EndgameMastery(93));
  },

  get OVERFLOW_SQUARED() {
    return Pelle.isDoomed
      ? Decimal.pow10(Decimal.pow(DC.NUMMAX,
        Decimal.pow(2, Decimal.clamp(player.celestials.pelle.divinities, 0, 8))
          .times(Math.max(2 - player.celestials.pelle.divinities / 2, 1))
          .times(Decimal.pow(1.5, Decimal.max(player.celestials.pelle.divinities - 8, 0)))))
      : DC.ENUMMAX;
  },

  get compressionMagnitude() {
    if (!PlayerProgress.endgameUnlocked()) return 10;
    let reduction = Effects.product(EndgameMastery(83), EndgameUpgrade(3));
    if (!player.disablePostReality) {
      reduction = reduction.times(AlphaUnlocks.ecCompletion1.effects.buff.effectOrDefault(1));
    }
    return Decimal.max(reduction.times(10), 2)
      .sub(Decimal.max(new Decimal(0.2).sub(reduction).times(5), 0)).toNumber();
  },

  get compressionMag2() {
    return 10;
  },

  get scalingPast1e6000() {
    return 4;
  },

  tick(diff) {
    if (Hell.isInside) {
      // NG-5: only 6 Dimensions, each producing the Dimension two tiers below it
      for (let tier = 6; tier > 2; tier--) {
        TimeDimension(tier).produceDimensions(TimeDimension(tier - 2), diff.div(10));
      }
      if (EternityChallenge(7).isRunning) {
        TimeDimension(1).produceDimensions(InfinityDimension(8), diff);
        TimeDimension(2).produceDimensions(InfinityDimension(8), diff);
      } else {
        TimeDimension(1).produceCurrency(Currency.timeShards, diff);
        TimeDimension(2).produceCurrency(Currency.timeShards, diff);
      }
      return;
    }
    for (let tier = 8; tier > 1; tier--) {
      TimeDimension(tier).produceDimensions(TimeDimension(tier - 1), diff.div(10));
    }

    if (EternityChallenge(7).isRunning) {
      TimeDimension(1).produceDimensions(InfinityDimension(8), diff);
    } else {
      TimeDimension(1).produceCurrency(Currency.timeShards, diff);
    }

    EternityChallenge(7).reward.applyEffect(production => {
      InfinityDimension(8).amount = InfinityDimension(8).amount.plus(production.times(diff.div(1000)));
    });
  }
};

export function tryUnlockTimeDimensions() {
  if (TimeDimension(8).isUnlocked) return;
  for (let tier = 5; tier <= 8; ++tier) {
    if (TimeDimension(tier).isUnlocked) continue;
    TimeDimension(tier).tryUnlock();
  }
}
