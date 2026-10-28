import { DC } from "../../constants";
import { DimensionState } from "../../dimensions/dimension";

/**
 * Constants for easily adjusting values
 */

const INTERVAL_COST_MULT = DC.D5;
const POWER_DM_COST_MULT = DC.E1;
const POWER_DE_COST_MULTS = [1.65, 1.6, 1.55, 1.5, 1.45, 1.4, 1.35, 1.3];

const INTERVAL_START_COST = DC.E1;
const POWER_DM_START_COST = DC.E1;
const POWER_DE_START_COST = DC.E1;

const INTERVAL_PER_UPGRADE = 0.92;

// No constant for interval since it's tied to a milestone
export const POWER_DM_PER_ASCENSION = new Decimal(500);
export const POWER_DE_PER_ASCENSION = new Decimal(500);

const COST_MULT_PER_TIER = 1200;

let hasWarnedAboutDarkEnergySaturation = false;

function addDarkEnergyProduction(production, source) {
  if (!Decimal.isFinite(production)) {
    if (!hasWarnedAboutDarkEnergySaturation) {
      // eslint-disable-next-line no-console
      console.warn(`Dark Matter Dimensions reached the Decimal limit while producing Dark Energy (${source}).`);
      hasWarnedAboutDarkEnergySaturation = true;
    }
    Currency.darkEnergy.value = DC.BEMAX;
    return;
  }
  const nextDarkEnergy = Currency.darkEnergy.value.plus(production);
  if (!Decimal.isFinite(nextDarkEnergy)) {
    if (!hasWarnedAboutDarkEnergySaturation) {
      // eslint-disable-next-line no-console
      console.warn(`Dark Matter Dimensions reached the Decimal limit while producing Dark Energy (${source}).`,
        production.toString());
      hasWarnedAboutDarkEnergySaturation = true;
    }
    Currency.darkEnergy.value = DC.BEMAX;
    return;
  }
  Currency.darkEnergy.value = nextDarkEnergy;
}

export class DarkMatterDimensionState extends DimensionState {

  static get dimensionCount() {
    return 8;
  }

  constructor(tier) {
    // eslint-disable-next-line no-debugger, max-statements-per-line
    super(() => player.celestials.laitela.dimensions, tier);
  }

  // Does not include DM, only DE per second
  get productionPerSecond() { return this.powerDE.mul(DC.E3.div(this.interval)); }

  get unlockUpgrade() {
    // The 15th Imaginary Upgrade unlocked Laitela and the 1st DMD
    const upgradeId = ((this.tier - 1) % 4) + (Math.floor((this.tier - 1) / 4) * 11) + 15;
    return ImaginaryUpgrade(upgradeId);
  }

  get isUnlocked() {
    if (EndgameMilestone.celestialEarlyUnlock.isReached && this.tier === 1) return true;
    return this.unlockUpgrade.isBought;
  }

  get ascensions() {
    return this.data.ascensionCount;
  }

  get intervalPurchaseCap() {
    return DC.E1;
  }

  get rawInterval() {
    const perUpgrade = INTERVAL_PER_UPGRADE;
    const tierFactor = Decimal.pow(4, this.tier - 1);
    return tierFactor.mul(DC.E3).mul(Decimal.pow(perUpgrade, this.data.intervalUpgrades))
      .mul(Decimal.pow(SingularityMilestone.ascensionIntervalScaling.effectOrDefault(1200), this.ascensions))
      .mul(SingularityMilestone.darkDimensionIntervalReduction.effectOrDefault(1));
  }

  get interval() {
    return Decimal.clampMin(this.intervalPurchaseCap, this.rawInterval);
  }

  static get commonDarkMult() {
    return DC.D1.timesEffectsOf(
      SingularityMilestone.darkFromTesseracts,
      SingularityMilestone.darkFromGlyphLevel,
      SingularityMilestone.darkFromTheorems,
      SingularityMilestone.darkFromDM4,
      SingularityMilestone.darkFromGamespeed,
      SingularityMilestone.darkFromDilatedTime,
      SingularityMilestone.darkFromCelestialMatter,
      SingularityMilestone.darkFromGalacticPower
    );
  }

  get powerDMPerAscension() {
    return SingularityMilestone.improvedAscensionDM.effectOrDefault(DC.D0).add(POWER_DM_PER_ASCENSION);
  }

  get powerDEPerAscension() {
    return Hadrons.darkEnergyAscensionBoost.add(POWER_DE_PER_ASCENSION);
  }

  get powerDM() {
    if (!this.isUnlocked) return DC.D0;
    let multi = Decimal.pow(1.15, this.data.powerDMUpgrades).mul(2).add(1)
      .times(Laitela.realityReward)
      .times(Laitela.darkMatterMult)
      .times(GameCache.commonDMDDarkMult.value)
      .times(Decimal.pow(this.powerDMPerAscension, this.ascensions)).mul(realityUG(10).effectOrDefault(1))
      .timesEffectsOf(SingularityMilestone.darkMatterMult, SingularityMilestone.multFromInfinitied).pow(GlitchRealityUpgrade(12).isBought ? 1.05 : 1)
      .times((ExpansionPack.laitelaPack.isBought && !player.disablePostReality)
        ? Decimal.max(Decimal.log10(Decimal.log10(player.antimatter.add(1)).add(1)),
          Decimal.log10(player.reality.imaginaryMachines.add(1)))
        : 1)
      .dividedBy(Decimal.pow(1e4, Decimal.pow(this.tier - 1, 0.5)));
    const softcapStart = Decimal.pow10(1.25e11);
    const softcapExponent = 0.9 + 0.1 * SingularityMilestone.weakenDMSoftcaps.effectOrDefault(0);
    multi = multi.min(softcapStart).times(Decimal.pow10(multi.div(softcapStart).max(1).log10().pow(softcapExponent)));
    const power = multi.powEffectsOf(SingularityMilestone.dmdSingPower, SingularityMilestone.annihilationDMDPower);
    return Decimal.isFinite(power) ? power : DC.BEMAX;
  }

  get powerDE() {
    if (!this.isUnlocked || (Pelle.isDoomed && !PelleDestructionUpgrade.singularityMilestones.canBeApplied)) return DC.D0;
    const supertier = [1, 1, 1, 1, 1, 5, 12, 54, 252];
    const tierFactor = Decimal.pow(15, (this.tier - 1) * supertier[this.tier]);
    let multi = this.data.powerDEUpgrades.div(10).add(1)
      .mul(Decimal.pow(1.005, this.data.powerDEUpgrades)).mul(tierFactor).div(1000)
      .times(GameCache.commonDMDDarkMult.value)
      .times(Decimal.pow(this.powerDEPerAscension, this.ascensions)).mul(realityUG(10).effectOrDefault(1))
      .times((ExpansionPack.laitelaPack.isBought && !player.disablePostReality)
        ? Decimal.pow(Decimal.log10(player.celestials.laitela.singularities.add(1)), 2)
        : 1)
      .timesEffectsOf(
        SingularityMilestone.darkEnergyMult,
        SingularityMilestone.realityDEMultiplier,
        SingularityMilestone.multFromInfinitied,
        SingularityMilestone.darkEnergyBoost
      ).mul(Laitela.realityRewardDE)
      .times(player.disablePostReality ? 1 : AlphaUnlocks.timestudy192.effects.buff.effectOrDefault(1));
    const softcapStart = Decimal.pow10(1.25e9);
    const softcapExponent = 0.9 + 0.1 * SingularityMilestone.weakenDMSoftcaps.effectOrDefault(0);
    multi = multi.min(softcapStart).times(Decimal.pow10(multi.div(softcapStart).max(1).log10().pow(softcapExponent)));
    const alphaReplicantiPower = !player.disablePostReality && Alpha.currentStage >= 21 && ResurgenceUpgrade.repSurge.isBought
      ? ReplicantiMultipliers.dePow
      : 1;
    const power = multi.pow(GlitchRealityUpgrade(12).isBought ? 1.05 : 1).pow(alphaReplicantiPower)
      .powEffectOf(SingularityMilestone.hadronDEPower).times(AlchemyResource.alter.effectValue);
    return Decimal.isFinite(power) ? power : DC.BEMAX;
  }

  get intervalAfterAscension() {
    const purchases = this.costScaleInterval.getMaxBought(this.data.intervalUpgrades, Currency.darkMatter.value, DC.D1);
    return Decimal.clampMin(this.intervalPurchaseCap, this.rawInterval.mul(Decimal.pow(INTERVAL_PER_UPGRADE, purchases))
      .mul(SingularityMilestone.ascensionIntervalScaling.effectOrDefault(1200)));
  }

  get adjustedStartingCost() {
    const tiers = [null, 0, 2, 5, 13, 108, 360, 1800, 9000];
    return Decimal.pow(COST_MULT_PER_TIER, tiers[this.tier]).mul(10)
      .mul(SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1));
  }

  get rawIntervalCost() {
    return Decimal.pow(this.intervalCostIncrease, this.data.intervalUpgrades)
      .times(this.adjustedStartingCost).times(INTERVAL_START_COST);
  }

  get intervalCost() {
    return this.costScaleInterval.calculateCost(this.data.intervalUpgrades);
  }

  get intervalCostIncrease() {
    return Decimal.pow(INTERVAL_COST_MULT, SingularityMilestone.intervalCostScalingReduction.effectOrDefault(1));
  }

  get rawPowerDMCost() {
    return Decimal.pow(this.powerDMCostIncrease, this.data.powerDMUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DM_START_COST);
  }

  get powerDMCost() {
    return this.rawPowerDMCost.floor();
  }

  get powerDMCostIncrease() {
    return POWER_DM_COST_MULT;
  }

  get rawPowerDECost() {
    return Decimal.pow(this.powerDECostIncrease, this.data.powerDEUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DE_START_COST);
  }

  get powerDECost() {
    return this.rawPowerDECost.floor();
  }

  get powerDECostIncrease() {
    return new Decimal(POWER_DE_COST_MULTS[this.tier - 1]);
  }

  get costScaleDE() {
    return new ExponentialCostScaling({
      baseCost: this.adjustedStartingCost.mul(SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1))
        .times(POWER_DE_START_COST),
      baseIncrease: this.powerDECostIncrease,
      costScale: new Decimal(100),
      scalingCostThreshold: new Decimal("ee6")
    });
  }

  get costScaleDM() {
    return new ExponentialCostScaling({
      baseCost: this.adjustedStartingCost.mul(SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1))
        .times(POWER_DM_START_COST),
      baseIncrease: this.powerDMCostIncrease,
      costScale: new Decimal(100),
      scalingCostThreshold: new Decimal("ee6")
    });
  }

  get costScaleInterval() {
    return new ExponentialCostScaling({
      baseCost: this.adjustedStartingCost.mul(SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1))
        .times(INTERVAL_START_COST),
      baseIncrease: this.intervalCostIncrease,
      costScale: new Decimal(100),
      scalingCostThreshold: new Decimal("ee6")
    });
  }

  get realDiff() {
    return this.data.realDiff;
  }

  set realDiff(ms) {
    this.data.realDiff = ms;
  }

  get canBuyInterval() {
    return Currency.darkMatter.gte(this.intervalCost) && this.interval.gt(this.intervalPurchaseCap);
  }

  get canBuyPowerDM() {
    return Currency.darkMatter.gte(this.powerDMCost);
  }

  get canBuyPowerDE() {
    return Currency.darkMatter.gte(this.powerDECost);
  }

  get maxIntervalPurchases() {
    return Decimal.ceil(Decimal.log10(this.intervalPurchaseCap.div(this.interval))
      .div(Decimal.log10(INTERVAL_PER_UPGRADE)));
  }

  buyManyInterval(x) {
    // eslint-disable-next-line max-len
    const calc = this.costScaleInterval.getMaxBought(this.data.intervalUpgrades, Currency.darkMatter.value, DC.D1);
    const quant = calc?.quantity;
    if (calc === null) return;
    if (Decimal.lte(x, quant.clampMax(this.maxIntervalPurchases))) {
      // eslint-disable-next-line max-len
      if (Currency.darkMatter.lt("ee15")) Currency.darkMatter.purchase(this.costScaleInterval.calculateCost(this.data.intervalUpgrades.add(x).sub(1)));
      this.data.intervalUpgrades = this.data.intervalUpgrades.add(x);
    }
    // eslint-disable-next-line max-len
    if (Currency.darkMatter.lt("ee15")) Currency.darkMatter.purchase(this.costScaleInterval.calculateCost(this.data.intervalUpgrades.add(quant).sub(1)));
    this.data.intervalUpgrades = this.data.intervalUpgrades.add(quant);
    // S this.data.intervalUpgrades
  }

  buyManyPowerDM(x) {
    const calc = this.costScaleDM.getMaxBought(this.data.powerDMUpgrades, Currency.darkMatter.value, DC.D1);
    if (calc === null) return;
    if (Decimal.lte(x, calc.quantity)) {
      if (Currency.darkMatter.lt("ee15")) Currency.darkMatter.purchase(this.costScaleDM.calculateCost(this.data.powerDMUpgrades.add(x).sub(1)));
      this.data.powerDMUpgrades = this.data.powerDMUpgrades.add(x);
    }
    if (Currency.darkMatter.lt("ee15")) Currency.darkMatter.purchase(this.costScaleDM.calculateCost(this.data.powerDMUpgrades.add(calc.quantity.sub(1))));
    this.data.powerDMUpgrades = this.data.powerDMUpgrades.add(calc.quantity);
    // S this.data.powerDMUpgrades
  }

  buyManyPowerDE(x) {
    const calc = this.costScaleDE.getMaxBought(this.data.powerDEUpgrades, Currency.darkMatter.value, DC.D1);
    if (calc === null) return;
    if (Decimal.lte(x, calc.quantity)) {
      if (Currency.darkMatter.lt("ee15")) Currency.darkMatter.purchase(this.costScaleDE.calculateCost(this.data.powerDEUpgrades.add(x).sub(1)));
      this.data.powerDEUpgrades = this.data.powerDEUpgrades.add(x);
    }
    if (Currency.darkMatter.lt("ee15")) Currency.darkMatter.purchase(this.costScaleDE.calculateCost(this.data.powerDEUpgrades.add(calc.quantity.sub(1))));
    this.data.powerDEUpgrades = this.data.powerDEUpgrades.add(calc.quantity);
    // S this.data.powerDEUpgrades
  }

  buyInterval() {
    return this.buyManyInterval(DC.D1);
  }

  buyPowerDM() {
    return this.buyManyPowerDM(DC.D1);
  }

  buyPowerDE() {
    return this.buyManyPowerDE(DC.D1);
  }

  ascend() {
    if (this.interval.gt(this.intervalPurchaseCap)) return;
    const gain = SingularityMilestone.ascensionIntervalScaling.effectValue;
    const raw = this.rawInterval;
    this.data.ascensionCount = this.data.ascensionCount.add(Decimal.log(raw.div(gain.mul(10)), gain).abs().floor());

    // Immediately buy as many interval upgrades as possible
    this.buyManyInterval(Infinity);
  }

  reset() {
    this.data.amount = DC.D1;
    this.data.intervalUpgrades = DC.D0;
    this.data.powerDMUpgrades = DC.D0;
    this.data.powerDEUpgrades = DC.D0;
    this.data.realDiff = DC.D0;
    this.data.ascensionCount = DC.D0;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {DarkMatterDimensionState}
 */
export const DarkMatterDimension = DarkMatterDimensionState.createAccessor();

export const DarkMatterDimensions = {
  /**
   * @type {DarkMatterDimension[]}
   */
  all: DarkMatterDimension.index.compact(),

  get highestUnlocked() {
    for (let tier = 8; tier >= 5; tier--) {
      if (DarkMatterDimension(tier).isUnlocked) return tier;
    }
    return 4;
  },

  get totalPowerDE() {
    let total = DC.D1;
    for (const dimension of this.all) total = total.times(dimension.powerDE);
    return total;
  },

  tick(realDiff) {
    if (!Laitela.isUnlocked) return;
    GameCache.commonDMDDarkMult.invalidate(); // Slightly faster
    for (let tier = 8; tier >= 1; tier--) {
      const dim = DarkMatterDimension(tier);
      if (!dim.isUnlocked) continue;
      dim.realDiff = dim.realDiff.add(realDiff);
      if (dim.interval.lt(dim.realDiff)) {
        const ticks = Decimal.floor(dim.realDiff.div(dim.interval));
        const productionDM = dim.amount.times(ticks).times(dim.powerDM);
        if (tier === 1) {
          Currency.darkMatter.add(productionDM);
        } else {
          const nextAmount = DarkMatterDimension(tier - 1).amount.plus(productionDM);
          DarkMatterDimension(tier - 1).amount = Decimal.isFinite(nextAmount) ? nextAmount : DC.BEMAX;
        }
        if (!SingularityMilestone.dmdMultBooster.isUnlocked) {
          addDarkEnergyProduction(ticks.mul(dim.powerDE), `tier ${tier}`);
        }
        dim.realDiff = dim.realDiff.sub(dim.interval.mul(ticks));
      }
    }
    if (SingularityMilestone.dmdMultBooster.isUnlocked) {
      addDarkEnergyProduction(this.totalPowerDE.times(realDiff.div(1000)), "multiplier");
    }
    if (SingularityMilestone.dim4Generation.canBeApplied && Laitela.annihilationUnlocked) {
      const highestUnlocked = this.highestUnlocked;
      DarkMatterDimension(highestUnlocked).amount = DarkMatterDimension(highestUnlocked).amount
        .plus(SingularityMilestone.dim4Generation.effectValue.mul(realDiff.div(1000)));
    }
  },

  reset() {
    for (const dimension of DarkMatterDimensions.all) {
      dimension.reset();
    }
    Currency.darkMatter.reset();
  },
};
