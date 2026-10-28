import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";

class ChargedInfinityUpgradeState extends GameMechanicState {
  constructor(config, upgrade) {
    super(config);
    this._upgrade = upgrade;
  }

  get isEffectActive() {
    return this._upgrade.isBought && this._upgrade.isCharged;
  }
}

export class InfinityUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    if (config.charged) {
      this._chargedEffect = new ChargedInfinityUpgradeState(config.charged, this);
    }
  }

  get currency() {
    return Currency.infinityPoints;
  }

  get set() {
    return player.infinityUpgrades;
  }

  get isAvailableForPurchase() {
    return this.config.checkRequirement?.() ?? true;
  }

  get isEffectActive() {
    return this.isBought && !this.isCharged;
  }

  get chargedEffect() {
    return this._chargedEffect;
  }

  purchase() {
    if (super.purchase()) {
      // This applies the 4th column of infinity upgrades retroactively
      if (this.config.id.includes("skip")) skipResetsIfPossible();
      EventHub.dispatch(GAME_EVENT.INFINITY_UPGRADE_BOUGHT);
      return true;
    }
    if (this.canCharge) {
      this.charge();
      EventHub.dispatch(GAME_EVENT.INFINITY_UPGRADE_CHARGED);
      return true;
    }
    return false;
  }

  get hasChargeEffect() {
    return this.config.charged !== undefined;
  }

  get isCharged() {
    return player.celestials.ra.charged.has(this.id);
  }

  get canCharge() {
    let v = Ra.chargesLeft - 12;
    if(GlitchSpeedUpgrades.all[2].isBought) v++;

    if(Glitch.isRunning && v <= 0) return false;
    
    return this.isBought &&
      this.hasChargeEffect &&
      !this.isCharged &&
      Ra.chargesLeft !== 0 &&
      !Pelle.isDisabled("chargedInfinityUpgrades");
  }

  charge() {
    player.celestials.ra.charged.add(this.id);
  }

  disCharge() {
    player.celestials.ra.charged.delete(this.id);
  }
}

export function totalIPMult() {
  if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.INFINITY) {
    return DC.D1;
  }
  let ipMult = DC.D1
    .times(ShopPurchase.IPPurchases.currentMult)
    .timesEffectsOf(
      TimeStudy(41),
      TimeStudy(51),
      TimeStudy(141),
      TimeStudy(142),
      TimeStudy(143),
      Achievement(85),
      Achievement(93),
      Achievement(116),
      Achievement(125),
      Achievement(141).effects.ipGain,
      DilationUpgrade.ipMultDT,
      GlyphEffect.ipMult
    );
  // Once the first Ascension is reached, this upgrade becomes an exponent instead of a multiplier
  if (!Ascensions.ipA.isUnlocked) ipMult = ipMult.timesEffectOf(InfinityUpgrade.ipMult);
  ipMult = ipMult.times(Replicanti.amount.add(1).powEffectOf(AlchemyResource.exponential));
  if (LHC.voidRunning) ipMult = ipMult.timesEffectOf(LHCNullUpgrade.infinityPointMult);
  return ipMult;
}

export function disChargeAll() {
  const upgrades = [
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.dim18mult,
    InfinityUpgrade.dim36mult,
    InfinityUpgrade.resetBoost,
    InfinityUpgrade.buy10Mult,
    InfinityUpgrade.dim27mult,
    InfinityUpgrade.dim45mult,
    InfinityUpgrade.galaxyBoost,
    InfinityUpgrade.thisInfinityTimeMult,
    InfinityUpgrade.unspentIPMult,
    InfinityUpgrade.dimboostMult,
    InfinityUpgrade.ipGen
  ];
  for (const upgrade of upgrades) {
    if (upgrade.isCharged) {
      upgrade.disCharge();
    }
  }
  player.celestials.ra.disCharge = false;
  EventHub.dispatch(GAME_EVENT.INFINITY_UPGRADES_DISCHARGED);
}

export function tryChargeAll() {
  if (Ra.chargesLeft < 12) return;
  const upgrades = [
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.dim18mult,
    InfinityUpgrade.dim36mult,
    InfinityUpgrade.resetBoost,
    InfinityUpgrade.buy10Mult,
    InfinityUpgrade.dim27mult,
    InfinityUpgrade.dim45mult,
    InfinityUpgrade.galaxyBoost,
    InfinityUpgrade.thisInfinityTimeMult,
    InfinityUpgrade.unspentIPMult,
    InfinityUpgrade.dimboostMult,
    InfinityUpgrade.ipGen
  ];
  for (const upgrade of upgrades) {
    if (upgrade.canCharge) upgrade.charge();
  }
}

// The repeatable 2xIP upgrade has an odd cost structure - it follows a shallow exponential (step *10) up to e3M, at
// which point it follows a steeper one (step *1e10) up to e6M before finally hardcapping. At the hardcap, there's
// an extra bump that increases the multiplier itself from e993k to e1M. All these numbers are specified in
// GameDatabase.infinity.upgrades.ipMult
class InfinityIPMultUpgrade extends GameMechanicState {
  get costIncreaseThreshold() {
    return typeof this.config.costIncreaseThreshold === "function"
      ? this.config.costIncreaseThreshold()
      : this.config.costIncreaseThreshold;
  }

  get costCap() {
    return typeof this.config.costCap === "function" ? this.config.costCap() : this.config.costCap;
  }

  get cost() {
    if (Ascensions.ipA.isUnlocked) return Decimal.pow10(Decimal.pow10(this.purchaseCount));
    if (this.purchaseCount.gte(this.purchasesAtIncrease)) {
      return this.costIncreaseThreshold.times(Decimal.pow(this.costIncrease, this.purchaseCount.sub(this.purchasesAtIncrease)));
    }
    return Decimal.pow(this.costIncrease, this.purchaseCount.add(1)).times(Hell.isInside ? 3 : 1);
  }

  get purchaseCount() {
    return player.IPMultPurchases;
  }

  get purchasesAtIncrease() {
    return this.costIncreaseThreshold.max(1).log10().sub(1);
  }

  get hasIncreasedCost() {
    return this.purchaseCount.gte(this.purchasesAtIncrease);
  }

  get costIncrease() {
    return this.hasIncreasedCost ? 1e10 : 10;
  }

  get isCapped() {
    if (Ascensions.ipA.isUnlocked) return this.cost.gte(this.costCap);
    return this.cost.gte(this.costCap) || player.IPMultPurchases.gt(3300000);
  }

  get isBought() {
    return this.isCapped;
  }

  get isRequirementSatisfied() {
    return Achievement(41).isUnlocked || Ascensions.ipA.isUnlocked;
  }

  get canBeBought() {
    if (Pelle.isDoomed && !ChallengerUpgrade(0).isBought && !PelleDestructionUpgrade.x2IPUpgrade.canBeApplied) return false;
    return !this.isCapped && Currency.infinityPoints.gte(this.cost) && this.isRequirementSatisfied;
  }

  // This is only ever called with amount = 1 or within buyMax under conditions that ensure the scaling doesn't
  // change mid-purchase
  purchase(amount = 1) {
    if (!this.canBeBought) return;
    if (!TimeStudy(181).isBought) {
      Autobuyer.bigCrunch.bumpAmount(DC.D2.pow(amount));
    }
    if (Ascensions.ipA.isUnlocked) {
      Currency.infinityPoints.subtract(Decimal.pow10(Decimal.pow10(player.IPMultPurchases.add(amount).sub(1))));
    } else {
      Currency.infinityPoints.subtract(Decimal.sumGeometricSeries(amount, this.cost, this.costIncrease, 0));
    }
    player.IPMultPurchases = player.IPMultPurchases.add(amount);
    GameUI.update();
  }

  buyMax() {
    if (!this.canBeBought) return;
    if (Ascensions.ipA.isUnlocked) {
      const purchases = Decimal.floor(Currency.infinityPoints.value.max(2).log10().log10())
        .sub(player.IPMultPurchases).add(1);
      if (purchases.lte(0)) return;
      this.purchase(purchases);
      return;
    }
    if (!this.hasIncreasedCost) {
      // Only allow IP below the softcap to be used
      const availableIP = Currency.infinityPoints.value.clampMax(this.costIncreaseThreshold);
      const purchases = Decimal.affordGeometricSeries(availableIP, this.cost, this.costIncrease, 0);
      if (purchases.lte(0)) return;
      this.purchase(purchases);
    }
    // Do not replace it with `if else` - it's specifically designed to process two sides of threshold separately
    // (for example, we have 1e4000000 IP and no mult - first it will go to (but not including) 1e3000000 and then
    // it will go in this part)
    if (this.hasIncreasedCost) {
      const availableIP = Currency.infinityPoints.value.clampMax(this.costCap);
      const purchases = Decimal.affordGeometricSeries(availableIP, this.cost, this.costIncrease, 0);
      if (purchases.lte(0)) return;
      this.purchase(purchases);
    }
  }
}

export const InfinityUpgrade = mapGameDataToObject(
  GameDatabase.infinity.upgrades,
  config => (config.id === "ipMult"
    ? new InfinityIPMultUpgrade(config)
    : new InfinityUpgradeState(config))
);
