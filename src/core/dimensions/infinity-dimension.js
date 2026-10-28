import { DC } from "../constants";

import { DimensionState } from "./dimension";

export function infinityDimensionCommonMultiplier() {
  let mult = new Decimal(ShopPurchase.allDimPurchases.currentMult)
    .timesEffectsOf(
      Achievement(75),
      TimeStudy(82),
      TimeStudy(92),
      TimeStudy(162),
      InfinityChallenge(1).reward,
      InfinityChallenge(6).reward,
      EternityChallenge(4).reward,
      EternityChallenge(9).reward,
      EternityUpgrade.idMultEP,
      EternityUpgrade.idMultEternities,
      EternityUpgrade.idMultICRecords,
      AlchemyResource.dimensionality,
      ImaginaryUpgrade(8),
      PelleRifts.recursion.milestones[1]
    );

  if (Replicanti.areUnlocked && Replicanti.amount.gt(1)) {
    mult = mult.times(replicantiMult());
  }
  if (LHC.voidRunning) mult = mult.timesEffectOf(LHCNullUpgrade.infinityDimensionMult);

  mult = mult.powEffectsOf(
    EternityUpgrade.idMultEP.chargedEffect,
    EternityUpgrade.idMultEternities.chargedEffect,
    EternityUpgrade.idMultICRecords.chargedEffect
  );
  mult = mult.pow(NormalChallenge(2).chargedEffect);

  return mult;
}

export function toggleAllInfDims() {
  const areEnabled = Autobuyer.infinityDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.infinityDimension(i).isActive = !areEnabled;
  }
}

class InfinityDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.infinity, tier);
    const UNLOCK_REQUIREMENTS = [
      undefined,
      DC.E1100,
      DC.E1900,
      DC.E2400,
      DC.E10500,
      DC.E30000,
      DC.E45000,
      DC.E54000,
      DC.E60000,
    ];
    this._unlockRequirement = UNLOCK_REQUIREMENTS[tier];
    const COST_MULTS = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30];
    this._costMultiplier = COST_MULTS[tier];
    const POWER_MULTS = [null, 50, 30, 10, 5, 5, 5, 5, 5];
    this._powerMultiplier = POWER_MULTS[tier];
    const BASE_COSTS = [null, 1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280];
    this._baseCost = new Decimal(BASE_COSTS[tier]);
    this.ipRequirement = BASE_COSTS[1];
  }

  /** @returns {Decimal} */
  get cost() { return Hell.isInside ? this.hellCost : this.data.cost; }
  /** @param {Decimal} value */
  set cost(value) { this.data.cost = value; }

  // NG-5: Infinity Dimensions are bought with antimatter
  get hellCost() {
    return Decimal.pow(this.costMultiplier, this.purchases).times(Hell.infinityDimensionBaseCosts[this.tier]);
  }

  get baseAmount() {
    return this.data.baseAmount;
  }

  set baseAmount(value) {
    this.data.baseAmount = value;
  }

  get isUnlocked() {
    if (Hell.isInside) return this.tier <= 6;
    return this.data.isUnlocked;
  }

  set isUnlocked(value) {
    this.data.isUnlocked = value;
  }

  get amRequirement() {
    return this._unlockRequirement;
  }

  get antimatterRequirementReached() {
    return player.records.thisEternity.maxAM.gte(this.amRequirement);
  }

  get hasIPUnlock() {
    return this.tier === 1 && !PlayerProgress.eternityUnlocked();
  }

  get ipRequirementReached() {
    return !this.hasIPUnlock || Currency.infinityPoints.value.gte(this.ipRequirement);
  }

  get canUnlock() {
    if (Hell.isInside && this.tier > 6) return false;
    return (Perk.bypassIDAntimatter.canBeApplied || this.antimatterRequirementReached) &&
      this.ipRequirementReached;
  }

  get isAvailableForPurchase() {
    if (Hell.isInside && !Hell.canBuyInfinityDimension(this.tier)) return false;
    return InfinityDimensions.canBuy() && this.isUnlocked && this.isAffordable && !this.isCapped;
  }

  get isAffordable() {
    return Hell.infinityDimensionCurrency.gte(this.cost);
  }

  get rateOfChange() {
    const tier = this.tier;
    let toGain = DC.D0;
    if (tier === 8) {
      // We need a extra 10x here (since ID8 production is per-second and
      // other ID production is per-10-seconds).
      EternityChallenge(7).reward.applyEffect(v => toGain = v.times(10));
      if (EternityChallenge(7).isRunning) EternityChallenge(7).applyEffect(v => toGain = v.times(10));
    } else {
      toGain = InfinityDimension(tier + 1).productionPerSecond;
    }
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get productionPerSecond() {
    if (EternityChallenge(2).isRunning ||     EternityChallenge(10).isRunning || Universes.isIn(2) ||
      (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension && !GlitchRealityUpgrades.all[8].isBought)) {
      return DC.D0;
    }
    if (Hell.isInside && this.tier > 6) return DC.D0;
    let production = this.amount;
    if (Hell.isInside) production = production.div(100);
    if (EternityChallenge(11).isRunning) {

      if (V.isRunningExtreme) {
        production = production.pow(0.001);
      }
      
      production = production.pow(V.rageDimPower);
      return production;
    }
    if (EternityChallenge(7).isRunning) {
      production = production.times(GameCache.tickspeedPerSecond.value);
    }
    return production.times(this.multiplier);
  }

  get multiplier() {
    const tier = this.tier;
    if (EternityChallenge(11).isRunning) return DC.D1;
    let mult = GameCache.infinityDimensionCommonMultiplier.value
      .timesEffectsOf(
        tier === 1 ? Achievement(94) : null,
        tier === 4 ? TimeStudy(72) : null,
        tier === 1 ? EternityChallenge(2).reward : null
      );
    const bought = this.baseAmount.div(10);
    mult = mult.times(Decimal.pow(this.powerMultiplier, Decimal.floor( tier === 8 ? bought.min(Decimal.pow(1e15, TimeStudy(403).effectOrDefault(1))) : bought)));
    mult = mult.times(Hell.infinityDimensionPower(tier));


    if (tier === 1) {
      mult = mult.times(PelleRifts.decay.milestones[0].effectOrDefault(1));
    }


    mult = mult.pow(getAdjustedGlyphEffect("infinitypow"));
    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));
    mult = mult.pow(getAdjustedGlyphEffect("curseddimensions"));
    mult = mult.powEffectOf(AlchemyResource.infinity);
    mult = mult.pow(Ra.momentumValue);
    mult = mult.powEffectOf(PelleRifts.paradox);
    mult = mult.powEffectOf(SingularityMilestone.dimensionPow);
    mult = mult.pow(PerkShopUpgrade.infinityPow.effectOrDefault(1));
    mult = mult.pow(MetaFabricatorUpgrades.all[1].effectOrDefault(1));
    mult = mult.powEffectsOf(Ra.unlocks.allDimPowTT, Ra.unlocks.infinityDimPower);
    if (ExpansionPack.pellePack.isBought && !player.disablePostReality) {
      mult = mult.pow(Decimal.pow(Decimal.log10(player.records.bestEndgame.galaxies.max(1)).div(100), 1.5).add(1));
    }

    if (player.dilation.active || (PelleStrikes.dilation.hasStrike && !PelleStrikes.dilation.isDestroyed())) {
      mult = dilatedValueOf(mult);
    }

    mult = mult.pow(V.rageDimPower);

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    }
    if (V.isRunning && !(Hell.isInside && V.isRunningExtreme)) {
      mult = mult.pow(0.5);
    }

    if (V.isRunningExtreme) {
      mult = mult.pow(0.001);
    }

    if(Glitch.isRunning) mult = mult.pow(Glitch.IDnerf);
    mult = mult.times(Hell.bigRipDimensionMultiplier);

    if (!Pelle.joined && PelleStrikes.powerGalaxies.hasStrike && !PelleStrikes.powerGalaxies.isDestroyed()) {
      mult = mult.pow(0.5);
    }
    if (Replicanti.areUnlocked && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) {
      mult = mult.pow(ReplicantiMultipliers.idPow);
    }
    if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) {
      mult = mult.pow(Achievements.powerConv(Achievement(75).effectOrDefault(1)));
    }

    if (Universes.isIn(1)) {
      mult = dilateMultiplier(mult, Decimal.pow(0.1,
        Decimal.pow(0.9, Currency.relativisticParticles.value.max(10).log10().log10().pow(2))));
    }

    if (player.compression.active) {
      mult = compressedMultiplier(mult);
    }
    if (Hell.isInside) mult = dilateMultiplier(mult, Ascension.overchargePenalty);

    if (mult.gte(InfinityDimensions.OVERFLOW)) {
      mult = Decimal.pow(10, Decimal.pow(
        mult.log10().div(Decimal.log10(InfinityDimensions.OVERFLOW)),
        1 / InfinityDimensions.compressionMagnitude
      ).times(Decimal.log10(InfinityDimensions.OVERFLOW)));
    }
    if (mult.gte(InfinityDimensions.OVERFLOW_SQUARED)) {
      mult = Decimal.pow(10, Decimal.pow(
        mult.log10().div(Decimal.log10(InfinityDimensions.OVERFLOW_SQUARED)),
        1 / InfinityDimensions.compressionMag2
      ).times(Decimal.log10(InfinityDimensions.OVERFLOW_SQUARED)));
    }

    return mult;
  }

  get isProducing() {
    const tier = this.tier;
    if (EternityChallenge(2).isRunning ||
      EternityChallenge(10).isRunning ||
      Universes.isIn(2) ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension && !GlitchRealityUpgrades.all[8].isBought)) {
      return false;
    }
    return this.amount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    let costMult = new Decimal(Hell.isInside ? Hell.infinityDimensionCostMults[this.tier] : this._costMultiplier);
    EternityChallenge(12).reward.applyEffect(v => costMult = Decimal.pow(costMult, v));
    const reduced = costMult.div(Hell.infinityDimensionCostDivisor);
    return Hell.isInside ? reduced.max(2) : reduced;
  }

  get powerMultiplier() {
    return new Decimal(this._powerMultiplier)
      .times(this._tier === 8 ? GlyphInfo.infinity.sacrificeInfo.effect() : new Decimal(1))
      .pow(ImaginaryUpgrade(14).effectOrDefault(1))
      .powEffectOf(SingularityMilestone.perPurchaseDimMult);
  }

  get purchases() {
    // Because each ID purchase gives 10 IDs
    return this.data.baseAmount.div(10);
  }

  get purchaseCap() {
    const allow = (Enslaved.isRunning && !Glitch.isRunning);
    const allowed = (allow || Glitch.augmentEffectActive(3));
    
    if (allowed) {
      return DC.D1;
    }
    return InfinityDimensions.capIncrease.add(this.tier === 8
      ? DC.BEMAX
      : InfinityDimensions.HARDCAP_PURCHASES);
  }

  get isCapped() {
    return this.purchases.gte(this.purchaseCap);
  }

  get hardcapIPAmount() {
    return this._baseCost.times(Decimal.pow(this.costMultiplier, this.purchaseCap));
  }

  resetAmount() {
    this.amount = new Decimal(this.baseAmount);
  }

  fullReset() {
    this.cost = new Decimal(this.baseCost);
    this.amount = DC.D0;
    this.bought = DC.D0;
    this.baseAmount = DC.D0;
    this.isUnlocked = false;
  }

  unlock() {
    if (this.isUnlocked) return true;
    if (!this.canUnlock) return false;
    this.isUnlocked = true;
    EventHub.dispatch(GAME_EVENT.INFINITY_DIMENSION_UNLOCKED, this.tier);
    if (this.tier === 1 && !PlayerProgress.eternityUnlocked()) {
      Tab.dimensions.infinity.show();
    }
    if (this.tier === 8 && Alpha.isRunning && Alpha.currentStage === 10) {
      Alpha.advanceLayer();
      Alpha.quotes.eighthInfinityDimension.show();
    }
    return true;
  }

  // Only ever called from manual actions
  buySingle() {
    if (!this.isUnlocked) return this.unlock();
    if (!this.isAvailableForPurchase) return false;
    if (ImaginaryUpgrade(15).isLockingMechanics) {
      const lockString = this.tier === 1
        ? "purchase a 1st Infinity Dimension"
        : "purchase a Dimension which will produce 1st IDs";
      ImaginaryUpgrade(15).tryShowWarningModal(lockString);
      return false;
    }

    if (Hell.isInside) Hell.infinityDimensionCurrency.subtract(this.cost);
    else {
      Currency.infinityPoints.purchase(this.cost);
      this.cost = Decimal.round(this.cost.times(this.costMultiplier));
    }
    // Because each ID purchase gives 10 IDs
    this.amount = this.amount.plus(10);
    this.baseAmount = this.baseAmount.add(10);

    if (EternityChallenge(8).isRunning) {
      player.eterc8ids -= 1;
    }

    return true;
  }

  buyMax(auto) {
    if (!this.isAvailableForPurchase) return false;
    if (ImaginaryUpgrade(15).isLockingMechanics) {
      const lockString = this.tier === 1
        ? "purchase a 1st Infinity Dimension"
        : "purchase a Dimension which will produce 1st IDs";
      if (!auto) ImaginaryUpgrade(15).tryShowWarningModal(lockString);
      return false;
    }

    let purchasesUntilHardcap = this.purchaseCap.sub(this.purchases);
    if (EternityChallenge(8).isRunning) {
      purchasesUntilHardcap = Decimal.clampMax(purchasesUntilHardcap, player.eterc8ids);
    }

    const currency = Hell.isInside ? Hell.infinityDimensionCurrency : Currency.infinityPoints;
    const costScaling = new LinearCostScaling(
      currency.value,
      this.cost,
      this.costMultiplier,
      purchasesUntilHardcap
    );

    if (costScaling.purchases.lte(0)) return false;

    if (Hell.isInside) {
      currency.subtract(costScaling.totalCost);
    } else {
      if (Currency.infinityPoints.lt("ee15")) Currency.infinityPoints.purchase(costScaling.totalCost);
      this.cost = this.cost.times(costScaling.totalCostMultiplier);
    }
    this.bought = this.bought.plus(costScaling.purchases);
    // Because each ID purchase gives 10 IDs
    this.amount = this.amount.plus(costScaling.purchases.times(10));
    this.baseAmount = DC.E1.times(costScaling.purchases).add(this.baseAmount);

    if (EternityChallenge(8).isRunning) {
      player.eterc8ids -= costScaling.purchases.toNumber();
    }
    return true;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {InfinityDimensionState}
 */
export const InfinityDimension = InfinityDimensionState.createAccessor();

export const InfinityDimensions = {
  /**
   * @type {InfinityDimensionState[]}
   */
  all: InfinityDimension.index.compact(),
  HARDCAP_PURCHASES: new Decimal(2000000),

  get OVERFLOW() {
    if (!PlayerProgress.endgameUnlocked()) return DC.E1E15;
    return DC.E1E15.powEffectsOf(EndgameMastery(92));
  },

  get OVERFLOW_SQUARED() {
    return DC.ENUMMAX;
  },

  get compressionMagnitude() {
    if (!PlayerProgress.endgameUnlocked()) return 10;
    const packReduction = ExpansionPack.enslavedPack.isBought && !player.disablePostReality
      ? Decimal.log10(Tesseracts.effectiveCount.add(1)).max(1).reciprocal().pow(0.2)
      : DC.D1;
    let reduction = Effects.product(EndgameMastery(82), EndgameUpgrade(2)).times(packReduction);
    if (!player.disablePostReality) {
      reduction = reduction.times(AlphaUnlocks.infinityChallenges.effects.buff.effectOrDefault(1));
    }
    return Decimal.max(reduction.times(10), 2)
      .sub(Decimal.max(new Decimal(0.2).sub(reduction).times(5), 0)).toNumber();
  },

  get compressionMag2() {
    return 10;
  },

  unlockNext() {
    if (InfinityDimension(8).isUnlocked) return;
    this.next().unlock();
  },

  next() {
    if (InfinityDimension(8).isUnlocked)
      throw "All Infinity Dimensions are unlocked";
    return this.all.first(dim => !dim.isUnlocked);
  },

  resetAmount() {
    Currency.infinityPower.reset();
    for (const dimension of InfinityDimensions.all) {
      dimension.resetAmount();
    }
  },

  fullReset() {
    for (const dimension of InfinityDimensions.all) {
      dimension.fullReset();
    }
  },

  get capIncrease() {
    return Decimal.floor(Tesseracts.capIncrease());
  },

  get totalDimCap() {
    return this.HARDCAP_PURCHASES.add(this.capIncrease).mul(Ra.unlocks.nullInfCap.effectOrDefault(1));
  },

  canBuy() {
    return !EternityChallenge(2).isRunning && !Universes.isIn(2) &&
      !EternityChallenge(10).isRunning &&
      (!EternityChallenge(8).isRunning || player.eterc8ids > 0);
  },

  canAutobuy() {
    return this.canBuy() && !EternityChallenge(8).isRunning;
  },

  tick(diff) {
    if (Hell.isInside) {
      // NG-5: only 6 Dimensions, each producing the Dimension two tiers below it
      for (let tier = 6; tier > 2; tier--) {
        InfinityDimension(tier).produceDimensions(InfinityDimension(tier - 2), diff.div(10));
      }
      if (EternityChallenge(7).isRunning) {
        InfinityDimension(1).produceDimensions(AntimatterDimension(7), diff);
        InfinityDimension(2).produceDimensions(AntimatterDimension(7), diff);
      } else {
        InfinityDimension(1).produceCurrency(Currency.infinityPower, diff);
        InfinityDimension(2).produceCurrency(Currency.infinityPower, diff);
      }
      return;
    }
    for (let tier = 8; tier > 1; tier--) {
      InfinityDimension(tier).produceDimensions(InfinityDimension(tier - 1), diff.div(10));
    }

    if (EternityChallenge(7).isRunning) {
      if (!NormalChallenge(10).isRunning) {
        InfinityDimension(1).produceDimensions(AntimatterDimension(7), diff);
      }
    } else {
      InfinityDimension(1).produceCurrency(Currency.infinityPower, diff);
    }

    player.requirementChecks.reality.maxID1 = player.requirementChecks.reality.maxID1
      .clampMin(InfinityDimension(1).amount);
  },

  tryAutoUnlock() {
    if (!EternityMilestone.autoUnlockID.isReached || InfinityDimension(8).isUnlocked) return;
    for (const dimension of this.all) {
      // If we cannot unlock this one, we can't unlock the rest, either
      if (!dimension.unlock()) break;
    }
  },

  // Called from "Max All" UI buttons and nowhere else
  buyMax() {
    // Try to unlock dimensions
    const unlockedDimensions = this.all.filter(dimension => dimension.unlock());

    // Try to buy single from the highest affordable new dimensions
    unlockedDimensions.slice().reverse().forEach(dimension => {
      if (dimension.purchases.eq(0)) dimension.buySingle();
    });

    // Try to buy max from the lowest dimension (since lower dimensions have bigger multiplier per purchase)
    unlockedDimensions.forEach(dimension => dimension.buyMax(false));
  },

  get powerConversionRate() {
    const rate = getAdjustedGlyphEffect("infinityrate").add(7)
      .add(PelleUpgrade.infConversion.effectOrDefault(DC.D0)).add(GlitchRifts.beta.milestones[0].effectOrDefault(DC.D0)
      .add(GlitchRifts.beta.milestones[1].effectOrDefault(DC.D0))).mul(PelleRifts.paradox.milestones[2].effectOrDefault(DC.D1).max(1));
    return rate.powEffectOf(Ra.unlocks.spaceTheoremIPowConversion);
  }
};
