import { DC } from "./constants";

export const MachineHandler = {
  get baseRMCap() { return DC.E1000; },

  get hardcapRM() {
    let hardcap = this.baseRMCap.times(ImaginaryUpgrade(6).effectOrDefault(1))
      .pow(VUnlocks.RMcap.effectOrDefault(1))
      .timesEffectOf(Ra.unlocks.realityMachineCap);
    if (ExpansionPack.teresaPack.isBought && !player.disablePostReality) {
      hardcap = hardcap.timesEffectOf(PerkShopUpgrade.rmMult);
      if (!Alpha.isDestroyed) hardcap = hardcap.times(Teresa.rmMultiplier);
    }
    hardcap = hardcap.times(ResurgenceUpgrade.rmSurge.isBought && !player.disablePostReality ? player.realities : 1)
      .powEffectOf(SingularityMilestone.rmCap)
      .powEffectOf(CompressionUpgrade.entanglementSplit);
    return hardcap;
  },

  get distanceToRMCap() {
    return this.hardcapRM.minus(Currency.realityMachines.value);
  },

  get realityMachineMultiplier() {
    return ShopPurchase.RMPurchases.currentMult.mul(Teresa.rmMultiplier).times(PerkShopUpgrade.rmMult.effectOrDefault(DC.D1))
      .times(getAdjustedGlyphEffect("effarigrm")).times(Achievement(167).effectOrDefault(1));
  },

  get uncappedRM() {
    let log10FinalEP = player.records.thisReality.maxEP.plus(gainedEternityPoints()).max(1).log10();
    if (!PlayerProgress.realityUnlocked()) {
      if (log10FinalEP.gt(8000)) log10FinalEP = new Decimal(8000);
      if (log10FinalEP.gt(6000)) log10FinalEP = log10FinalEP.sub((log10FinalEP.sub(6000)).times(0.75));
    }
    let rmGain = DC.E3.pow(log10FinalEP.div(4000).sub(1));
    // Increase base RM gain if <10 RM
    if (rmGain.gte(1) && rmGain.lt(10)) rmGain = (log10FinalEP).minus(26).mul(27).div(4000);
    rmGain = rmGain.times(this.realityMachineMultiplier).pow(MetaMilestone.metaProgress.effectOrDefault(1));
    rmGain = rmGain.times(ResurgenceUpgrade.rmSurge.isBought && !player.disablePostReality ? player.realities : 1);
    rmGain = rmGain.powEffectOf(CompressionUpgrade.entanglementSplit);
    return rmGain.floor();
  },

  get gainedRealityMachines() {
    return this.uncappedRM.clampMax(this.hardcapRM);
  },

  get isIMUnlocked() {
    return Currency.realityMachines.value.gte(this.hardcapRM) || Currency.imaginaryMachines.gt(0);
  },

  get baseIMCap() {
    if (Pelle.isDoomed) return new Decimal(1.6e15);
    const cap = Decimal.min(this.uncappedIM, this.hardcapIM);
    return Decimal.isFinite(cap) ? cap.min(DC.ENUMMAX) : DC.ENUMMAX;
  },

  get baseIMHardcap() {
    return DC.E1000;
  },

  get baseHardcapIM() {
    return this.baseIMHardcap.times(DualityUpgrade(6).effectOrDefault(1)).pow(
      EtherealStars.green.reward.times(DivineDimensions.conversionFormula2).timesEffectsOf(
        ResurgenceUpgrade.imSurge, ResurgenceUpgrade.machineSurge, CompressionUpgrade.entanglementSplit
      ));
  },

  get hardcapIM() {
    const baseHardcap = this.baseHardcapIM;
    if (!Alpha.isDestroyed) return baseHardcap;
    return baseHardcap.pow(this.uncappedIM.div(baseHardcap).add(1).log10().add(1).log10().add(1).log10().add(1));
  },

  get uncappedIM() {
    if (Pelle.isDoomed) return new Decimal(1.6e15);
    const uncappedRM = this.uncappedRM;
    const logRM = uncappedRM.add(1).log10();
    const uncappedIMBase = Decimal.pow(Decimal.clampMin(logRM.sub(1000), 0), 2)
      .times(Decimal.pow(Decimal.clampMin(logRM.sub(100000), 1), 0.2))
      .times(Decimal.pow(Decimal.clampMin(logRM.div(1e9), 1), Decimal.log10(logRM).div(7.5)));
    const uncappedIMPower = new Decimal(Effects.product(
      EndgameMastery(144), Ra.unlocks.imaginaryMachines, Ra.unlocks.imaginaryMachineEternityPower
    )).times(Decimal.max(Decimal.log10(logRM).sub(45), 0).div(10).add(1))
      .times(EtherealStars.green.reward)
      .times(DivineDimensions.conversionFormula2)
      .timesEffectsOf(ResurgenceUpgrade.imSurge, ResurgenceUpgrade.machineSurge, CompressionUpgrade.entanglementSplit);
    return uncappedIMBase.pow(uncappedIMPower);
  },

  get currentIMCap() {
    return Decimal.min(player.reality.iMCap.times(ImaginaryUpgrade(13).effectOrDefault(1)), this.hardcapIM);
  },

  // This is iM cap based on in-game values at that instant, may be lower than the actual cap
  get projectedIMCap() {
    return Decimal.min(this.baseIMCap.times(ImaginaryUpgrade(13).effectOrDefault(1)), this.hardcapIM);
  },

  // Use iMCap to store the base cap; applying multipliers separately avoids some design issues the 3xTP upgrade has
  updateIMCap() {
    if (this.uncappedRM.gte(this.baseRMCap) && !Pelle.isDoomed) {
      if (this.baseIMCap.gt(player.reality.iMCap)) {
        player.records.bestReality.iMCapSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
        player.reality.iMCap = this.baseIMCap;
      }
    }
  },

  // Time in seconds to reduce the missing amount by a factor of two
  get scaleTimeForIM() {
    return DC.D60.div(ImaginaryUpgrade(20).effectOrDefault(1));
  },

  gainedImaginaryMachines(diff) {
    return (this.currentIMCap.sub(Currency.imaginaryMachines.value)).times(DC.D1
      .sub(Decimal.pow(2, (new Decimal(0).sub(diff).div(1000).div(this.scaleTimeForIM)))));
  },

  estimateIMTimer(cost) {
    const imCap = this.currentIMCap;
    if (imCap.lte(cost)) return DC.BEMAX;
    const currentIM = Currency.imaginaryMachines.value;
    // This is doing log(a, 1/2) - log(b, 1/2) where a is % left to imCap of cost and b is % left to imCap of current
    // iM. log(1 - x, 1/2) should be able to estimate the time taken for iM to increase from 0 to imCap * x since every
    // fixed interval the difference between current iM to max iM should decrease by a factor of 1/2.
    return Decimal.max(0, Decimal.log(imCap.div(imCap.sub(cost)), 2).sub(Decimal.log(
      imCap.div(imCap.sub(currentIM)), 2))).times(this.scaleTimeForIM);
  },

  get isDMUnlocked() {
    return this.currentIMCap.gte(this.hardcapIM) || Currency.dualMachines.gt(0);
  },

  get baseDMCap() {
    const rmLog = Decimal.log10(Currency.realityMachines.value.add(1).log10().add(1));
    const uncappedRMScale = Decimal.log10(Decimal.log10(Decimal.log10(this.uncappedRM.add(1)).add(1)).add(1));
    const realityMachineScale = Decimal.clampMin(
      rmLog.sub(3).min(2).times(rmLog.div(5).max(1).pow(0.5)),
      1
    );
    const capScale = Decimal.clampMin(uncappedRMScale.sub(1.75).times(12).min(0.6).add(1), 1)
      .add(Decimal.clampMin(uncappedRMScale.sub(1.8).times(4).min(0.6), 0))
      .add(Decimal.clampMin(uncappedRMScale.sub(1.95).times(2), 0));
    const milestoneMult = DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 1.1 : 1;
    return Decimal.min(Decimal.pow(Decimal.clampMin(this.uncappedIM.add(1).log10().sub(1000), 0),
      realityMachineScale).times(capScale).times(milestoneMult).times(DivineDimensions.conversionFormula2)
      .timesEffectsOf(ResurgenceUpgrade.machineSurge, EndgameMastery(213), CompressionUpgrade.entanglementSplit)
      .timesEffectOf(EndgameMastery(223)), this.hardcapDM);
  },

  get hardcapDM() {
    return DC.E1000;
  },

  get currentDMCap() {
    return Decimal.min(player.reality.jMCap.times(DualityUpgrade(13).effectOrDefault(1)), this.hardcapDM);
  },

  get projectedDMCap() {
    return Decimal.min(this.baseDMCap.times(DualityUpgrade(13).effectOrDefault(1)), this.hardcapDM);
  },

  updateDMCap() {
    if (this.uncappedIM.gte(this.baseIMCap) && this.baseDMCap.gt(player.reality.jMCap)) {
      player.reality.jMCap = this.baseDMCap;
    }
  },

  get scaleTimeForDM() {
    return (600 / DualityUpgrade(20).effectOrDefault(1)) / (DivinityUpgrade.divineL1U10.isBought ? 2 : 1);
  },

  gainedDualMachines(diff) {
    return this.currentDMCap.sub(Currency.dualMachines.value).times(
      DC.D1.sub(Decimal.pow(2, new Decimal(0).sub(diff).div(1000).div(this.scaleTimeForDM)))
    );
  },

  estimateDMTimer(cost) {
    const dmCap = this.currentDMCap;
    if (dmCap.lte(cost)) return DC.BEMAX;
    const currentDM = Currency.dualMachines.value;
    return Decimal.max(0, Decimal.log(dmCap.div(dmCap.sub(cost)), 2).sub(
      Decimal.log(dmCap.div(dmCap.sub(currentDM)), 2)
    )).times(this.scaleTimeForDM);
  }
};
