import { DC } from "../../constants";
import { Quotes } from "../quotes";

import { DarkMatterDimensions } from "./dmd";

export const Laitela = {
  displayName: "Lai'tela",
  possessiveName: "Lai'tela's",
  get celestial() {
    return player.celestials.laitela;
  },
  get isUnlocked() {
    if (EndgameMilestone.celestialEarlyUnlock.isReached) return true;
    return ImaginaryUpgrade(15).isBought;
  },
  initializeRun() {
    clearCelestialRuns();
    this.celestial.run = true;
  },
  get isRunning() {
    return this.celestial.run;
  },
  get difficultyTier() {
    return player.celestials.laitela.difficultyTier;
  },
  set difficultyTier(tier) {
    player.celestials.laitela.difficultyTier = tier;
  },
  get maxAllowedDimension() {
    if (Hell.isInside) return Hell.laitelaMaxDimension;
    return Glitch.isRunning ? Glitch.laitelamaxdim : 8 - this.difficultyTier;
  },
  get isFullyDestabilized() {
    return Laitela.maxAllowedDimension === 0;
  },
  get continuumUnlocked() {
    return ImaginaryUpgrade(15).isBought && (!Pelle.isDisabled("continuum") || PelleDestructionUpgrade.continuumBuff.canBeApplied);
  },
  get continuumActive() {
    return this.continuumUnlocked && !player.auto.disableContinuum;
  },
  setContinuum(x) {
    player.auto.disableContinuum = !x;
    // If continuum is now not disabled (i.e. is enabled) we update the relevant requirement check.
    if (!player.auto.disableContinuum) {
      player.requirementChecks.reality.noContinuum = false;
    }
  },
  get matterExtraPurchaseFactor() {
    if (Slabdrill.isCursed && SlabdrillUnlocks.infinityChallengeFour.isUnlocked) {
      return DC.D1.add(Slabdrill.power.max(1).log10().div(100));
    }
    if ((Pelle.isDoomed && !PelleDestructionUpgrade.continuumBuff.canBeApplied) || player.disablePostReality ||
      Universes.isIn(2)) return DC.D1;
    return Decimal.pow(Decimal.pow(Currency.darkMatter.max.add(1).max(1).log10().div(50), 0.4)
      .times(SingularityMilestone.continuumMult.effectOrDefault(DC.D0).add(1)).div(2).add(1),
    DualityUpgrade(14).effectOrDefault(1))
      .times(DualityUpgrade(11).effectOrDefault(1))
      .times(Hadrons.continuumMultiplier)
      .timesEffectsOf(SingularityMilestone.singContinuumBoost, BreakInfinityUpgrade.autobuyerSpeed.chargedEffect)
      .times(NormalChallenge(6).chargedEffect)
      .times(NormalChallenge(9).chargedEffect);
  },
  get hadronizes() {
    return this.celestial.hadronizes;
  },
  get realityReward() {
    const fullCompletion = Decimal.pow(100, 8).times(Decimal.pow(360 / 300, 2));
    const currentCompletion = Decimal.pow(100, this.difficultyTier)
      .times(Decimal.pow(player.celestials.laitela.fastestCompletion.recip().mul(360), 2)).clampMin(1);
    return Decimal.pow(currentCompletion, this.hadronizes + 1)
      .times(Decimal.pow(fullCompletion, this.hadronizes * (this.hadronizes + 1) / 2))
      .powEffectOf(DualityUpgrade(28));
  },
  get realityRewardDE() {
    const fullDestabilization = this.isFullyDestabilized ? Decimal.pow(8, this.hadronizes + 1) : DC.D1;
    return Decimal.pow(8, this.hadronizes * (this.hadronizes + 1) / 2)
      .times(fullDestabilization).powEffectOf(DualityUpgrade(28));
  },
  // Note that entropy goes from 0 to 1, with 1 being completion
  get entropyGainPerSecond() {
    if (Glitch.isRunning) return DC.D0;
    const maxSpeed = ExpansionPack.laitelaPack.isBought && !player.disablePostReality ? 1000 : 100;
    const hadronizeBump = this.hadronizes > 0 ? 1e12 : 1;
    const extraHadronizeBoost = DC.D1.times(Hadrons.entropyFormulaBoost)
      .times(DivinityMilestone.firstDivine.isReached ? Decimal.log10(player.records.bestEndgame.galaxies.max(1)) : 1)
      .times(Accelerators.potency.effectValue2)
      .times(DivinityMilestone.finalRebirth.isReached && !player.disablePostReality
        ? Time.thisEndgameRealTime.totalMinutes.pow(3).add(1)
        : 1)
      .timesEffectsOf(ResurgenceUpgrade.entropySurge, EndgameMastery(201), SingularityMilestone.continuumEntropyMult)
      .pow(Achievements.powerConv(EndgameMastery(201).effectOrDefault(1)));
    const hadronizeAntimatter = Decimal.pow(1000, this.hadronizes).times(hadronizeBump)
      .times(1e11).div(extraHadronizeBoost);
    return Decimal.clamp(Decimal.pow(Currency.antimatter.value.add(1).log10().div(hadronizeAntimatter), 2),
      0, maxSpeed).div(200);
  },
  get antimatterNeededToDestabilize() {
    const hadronizeBump = this.hadronizes > 0 ? 1e12 : 1;
    const extraHadronizeBoost = DC.D1.times(Hadrons.entropyFormulaBoost)
      .times(DivinityMilestone.firstDivine.isReached ? Decimal.log10(player.records.bestEndgame.galaxies.max(1)) : 1)
      .times(Accelerators.potency.effectValue2)
      .times(DivinityMilestone.finalRebirth.isReached && !player.disablePostReality
        ? Time.thisEndgameRealTime.totalMinutes.pow(3).add(1)
        : 1)
      .timesEffectsOf(ResurgenceUpgrade.entropySurge, EndgameMastery(201), SingularityMilestone.continuumEntropyMult)
      .pow(Achievements.powerConv(EndgameMastery(201).effectOrDefault(1)));
    const hadronizeAntimatter = Decimal.pow(1000, this.hadronizes).times(hadronizeBump)
      .times(1e11).div(extraHadronizeBoost);
    const root = this.maxAllowedDimension === 0 ? DC.BEMAX : 8 / this.maxAllowedDimension;
    return Decimal.pow10(hadronizeAntimatter).pow(Decimal.sqrt(20 / 3)).pow(root);
  },
  get darkMatterMultGain() {
    const extraPow = ExpansionPack.laitelaPack.isBought && !player.disablePostReality
      ? Decimal.pow(Decimal.log10(Decimal.log10(Currency.darkMatter.value.add(1)).add(1)).add(1).div(2), 2).add(1)
      : DC.D1;
    return Decimal.pow(
      Currency.darkMatter.value.dividedBy(this.annihilationDMRequirement)
        .plus(1).log10().pow(1.5).times(ImaginaryUpgrade(21).effectOrDefault(1)),
      extraPow
    );
  },
  get darkMatterMult() {
    return this.celestial.darkMatterMult;
  },
  get darkMatterMultRatio() {
    return (this.celestial.darkMatterMult.add(this.darkMatterMultGain)).div(this.celestial.darkMatterMult);
  },
  get darkMatterCap() {
    let baseCap = DC.NUMMAX;
    if (ImaginaryUpgrade(26).isBought) baseCap = DC.E1000;
    if (ImaginaryUpgrade(27).isBought) baseCap = DC.E4000;
    if (ImaginaryUpgrade(28).isBought) baseCap = DC.E20000;
    if (ImaginaryUpgrade(29).isBought) baseCap = DC.E100000;
    const realityReward = ExpansionPack.laitelaPack.isBought && !player.disablePostReality ? this.realityReward : DC.D1;
    return new Decimal(baseCap).times(EndgameUpgrade(4).effectOrDefault(1))
      .times(realityReward).times(Hadrons.darkMatterCapMultiplier).times(EtherealStars.white.reward)
      .powEffectOf(EndgameMastery(262))
      .max("ee100")
      .max(this.celestial.maxDarkMatter).max(this.celestial.darkMatter);
  },
  get annihilationUnlocked() {
    return ImaginaryUpgrade(19).isBought;
  },
  get annihilationDMRequirement() {
    return 1e60;
  },
  get canAnnihilate() {
    return Laitela.annihilationUnlocked && Currency.darkMatter.gte(this.annihilationDMRequirement);
  },
  annihilate(force) {
    if (!force && !this.canAnnihilate) return false;
    this.celestial.darkMatterMult = this.celestial.darkMatterMult.add(this.darkMatterMultGain);
    if (force || !DivinityMilestone.hadronEmpowerment.isReached) DarkMatterDimensions.reset();
    Laitela.quotes.annihilation.show();
    Achievement(176).unlock();
    return true;
  },
  // Max purchase interval, then DM, then DE, working highest tier down in each case. No reason for the order.
  maxAllDMDimensions(maxTier) {
    // Note that tier is 1-indexed
    const unlockedDimensions = DarkMatterDimensions.all
      .filter(d => d.isUnlocked && d.tier <= maxTier);
    for (let i = 0; i < unlockedDimensions.length; i++) {
      unlockedDimensions[i].buyManyInterval(Infinity);
    }
    for (let i = 0; i < unlockedDimensions.length; i++) {
      unlockedDimensions[i].buyManyPowerDM(Infinity);
    }
    for (let i = 0; i < unlockedDimensions.length; i++) {
      unlockedDimensions[i].buyManyPowerDE(Infinity);
    }
  },
  hadronize() {
    if (!this.isFullyDestabilized) return false;
    this.celestial.fastestCompletion = new Decimal(3600);
    this.celestial.difficultyTier = 0;
    this.celestial.hadronizes += 1;
    if (DualityUpgrade(15).isBought) {
      this.celestial.hadrons.total += 1;
      this.celestial.hadrons.light += 1;
    }
    if (DivinityMilestone.hadronEmpowerment.isReached) this.celestial.hadrons.dark += 1;
    return true;
  },
  reset() {
    this.annihilate(true);
    this.celestial.darkMatterMult = DC.D1;
    Currency.darkMatter.max = DC.D1;
    Currency.darkMatter.reset();
    Currency.singularities.reset();
    this.celestial.singularities = ExpansionPack.laitelaPack.isBought ? DC.E1 : DC.D0;
    if(!MetaFabricatorUpgrade(10).isBought) this.celestial.fastestCompletion = new Decimal(3600);
    if(!MetaFabricatorUpgrade(10).isBought) this.celestial.difficultyTier = 0;
    this.celestial.singularityCapIncreases = DC.D0;
  },
  quotes: Quotes.laitela,
  symbol: "ᛝ"
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.laitela.isOpen) Laitela.quotes.unlock.show();
});
