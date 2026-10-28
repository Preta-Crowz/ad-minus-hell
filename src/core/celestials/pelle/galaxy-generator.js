import { DC } from "../../constants";

import { RebuyableMechanicState } from "../../game-mechanics/rebuyable";

import { PelleRifts } from "./rifts";

export const GalaxyGenerator = {
  // This is used for a slightly annoying workaround in order to visually update the glyph tab when the rifts
  // are refilling and the single glyph slot (which was lost during the drain) becomes available again
  hasReturnedGlyphSlot: false,

  get generationCaps() {
    return PelleRifts.all
      .map(x => ({ rift: x.config.key, cap: x.config.galaxyGeneratorThreshold }))
      .sort((a, b) => Decimal.compare(a.cap, b.cap));
  },

  get spentGalaxies() {
    return player.celestials.pelle.galaxyGenerator.spentGalaxies;
  },

  get generatedGalaxies() {
    return player.celestials.pelle.galaxyGenerator.generatedGalaxies;
  },

  get galaxies() {
    const generator = player.celestials.pelle.galaxyGenerator;
    if (!(generator.unspentGalaxies instanceof Decimal)) {
      generator.unspentGalaxies = this.generatedGalaxies.sub(this.spentGalaxies).max(0);
    }
    return generator.unspentGalaxies;
  },

  get gainPerSecondPreCap() {
    let extraGain = DC.D1;
    if (EndgameMilestone.moreFasterGalaxies.isReached && !player.disablePostReality) {
      const endgames = Currency.endgames.value;
      extraGain = Decimal.pow(10, endgames.div(200).min(50))
        .times(Decimal.pow(10, endgames.add(1).log10().sub(4).times(50).max(0)));
    }
    let galaxyGen = new Decimal(GalaxyGeneratorUpgrades.additive.effectValue).timesEffectsOf(
      GalaxyGeneratorUpgrades.multiplicative,
      GalaxyGeneratorUpgrades.antimatterMult,
      GalaxyGeneratorUpgrades.IPMult,
      GalaxyGeneratorUpgrades.EPMult,
      GalaxyGeneratorUpgrades.RSMult,
      GalaxyGeneratorUpgrades.DTMult,
      HardChallengerUpgrade(1),
    ).times(extraGain)
      .powEffectsOf(GalaxyGeneratorUpgrades.remnantPow, GalaxyGeneratorUpgrades.exponential)
      .pow(Accelerators.cosmic.effectValue1)
      .pow(Universes.ephemeralLightToGalGen)
      .pow(GalacticPowers.galaxyGenerationEmpowerment.isUnlocked
        ? GalacticPowers.galaxyGenerationEmpowerment.reward
        : 1);
    if (galaxyGen.gt(10)) {
      galaxyGen = Decimal.pow10(galaxyGen.log10().powEffectOf(GalaxyGeneratorUpgrades.superExponential));
    }
    return galaxyGen;
  },

  get galGenInstability() {
    const packReduction = ExpansionPack.pellePack.isBought && !player.disablePostReality ? 1 : 0;
    const endgameReduction = PlayerProgress.endgameUnlocked()
      ? Effects.sum(EndgameMastery(122), EndgameUpgrade(12), EndgameMastery(181)).toNumber()
      : 0;
    const reduction = Effects.sum(Achievement(296)).toNumber() + endgameReduction + packReduction;
    const powerReduction = EndgameMilestone.instabilityReduction.isReached && !player.disablePostReality
      ? Decimal.pow(Currency.endgames.value.add(1).log10().reciprocal(), 0.1).toNumber()
      : 1;
    return Math.pow(10 - reduction, powerReduction);
  },

  get harshInstabilityStart() {
    return new Decimal(1e60);
  },

  harshGalGenInstabilityByGalaxies(currentGalaxies) {
    const extremePower = GalacticPowers.galGenInstability2.isUnlocked ? GalacticPowers.galGenInstability2.reward : 1;
    const logarithm = Decimal.log10(Decimal.clamp(currentGalaxies.div(this.harshInstabilityStart), 1, 1e50));
    const endgamePower = PlayerProgress.endgameUnlocked() ? Effects.product(EndgameUpgrade(14)) : 1;
    const power = logarithm.div(1000).times(endgamePower).times(1 / extremePower).toNumber();
    return Math.pow(1 + power, logarithm.toNumber());
  },

  get instabilityStart() {
    const delay = GalacticPowers.galGenInstability1.isUnlocked ? GalacticPowers.galGenInstability1.reward : DC.D1;
    return delay.times(1e10);
  },

  gainPerSecondPostCapByGalaxies(currentGalaxies) {
    if (!Pelle.hasGalaxyGenerator) return new Decimal(1);
    const instabilityPower = this.harshGalGenInstabilityByGalaxies(currentGalaxies);
    const instabilityStartRatio = Decimal.max(Decimal.pow(currentGalaxies.div(this.instabilityStart), 0.75), 1);
    return Decimal.max(1, Decimal.pow(Decimal.pow(this.galGenInstability, instabilityPower), Decimal.log10(instabilityStartRatio)));
  },

  get gainPerSecondPostCap() {
    const currentGalaxies = player.galaxies.add(this.galaxies);
    const projectedGalaxies = currentGalaxies.add(this.gainPerSecondPreCap);
    return this.gainPerSecondPostCapByGalaxies(projectedGalaxies);
  },

  get gainPerSecond() {
    if (!Pelle.hasGalaxyGenerator) return DC.D0;
    return this.gainPerSecondPreCap.div(this.gainPerSecondPostCap);
  },

  get capObj() {
    return this.generationCaps[player.celestials.pelle.galaxyGenerator.phase];
  },

  get generationCap() {
    return this.capObj ? this.capObj.cap : DC.BEMAX;
  },

  get capRift() {
    return PelleRifts[this.capObj?.rift];
  },

  get isCapped() {
    return Decimal.eq(this.generationCap, this.generatedGalaxies);
  },

  get sacrificeActive() {
    return player.celestials.pelle.galaxyGenerator.sacrificeActive;
  },

  startSacrifice() {
    player.celestials.pelle.galaxyGenerator.sacrificeActive = true;
  },

  loop(diff) {
    if (this.isCapped) {
      Pelle.quotes.galaxyGeneratorRifts.show();
    }
    if (this.sacrificeActive) {
      this.capRift.reducedTo = Decimal.max(Decimal.sub(this.capRift.reducedTo, (diff.div(1e3).mul(9))), 0).toNumber();
      if (this.capRift.reducedTo === 0) {
        player.celestials.pelle.galaxyGenerator.sacrificeActive = false;
        player.celestials.pelle.galaxyGenerator.phase++;

        const phase = player.celestials.pelle.galaxyGenerator.phase;
        if (phase === 1) {
          Pelle.quotes.galaxyGeneratorPhase1.show();
        } else if (phase === 5) {
          Pelle.quotes.galaxyGeneratorPhase4.show();
        }

        if (!this.capObj) {
          Pelle.quotes.end.show();
        }
      }
      PelleRifts.all.forEach(x => x.checkMilestoneStates());

      // Force-unequip glyphs when the player loses the respective milestone. We call the respec option as normally
      // except for one particular case - when we want to respec into protected slots but have no room to do so. In
      // that case, we force-respec into the inventory instead
      if (!PelleRifts.vacuum.milestones[0].canBeApplied && Glyphs.active.filter(g => g).length > 0) {
        Glyphs.unequipAll(player.options.respecIntoProtected && Glyphs.findFreeIndex(true) === -1);
        Glyphs.refreshActive();
      }

    }
    const generator = player.celestials.pelle.galaxyGenerator;
    const remaining = this.generationCap.sub(this.generatedGalaxies).max(0);
    const gain = Decimal.min(this.gainPerSecond.times(diff.div(1000)).max(0), remaining);
    const reachedCap = gain.gte(remaining);
    generator.generatedGalaxies = reachedCap ? this.generationCap : this.generatedGalaxies.add(gain);
    generator.unspentGalaxies = this.galaxies.add(gain);

    if (!this.capRift) {
      PelleRifts.all.forEach(r => r.reducedTo = diff.div(1e5).mul(9).add(r.reducedTo).clampMax(5).toNumber());
      if (PelleRifts.vacuum.milestones[0].canBeApplied && !this.hasReturnedGlyphSlot) {
        Glyphs.refreshActive();
        EventHub.dispatch(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED);
        this.hasReturnedGlyphSlot = true;
      }
    }
  }
};

export class GalaxyGeneratorUpgrade extends RebuyableMechanicState {
  get currency() {
    return this.config.currency();
  }

  get boughtAmount() {
    const amount = player.celestials.pelle.rebuyables[this.id];
    if (amount instanceof Decimal) return amount;
    const decimalAmount = new Decimal(amount);
    player.celestials.pelle.rebuyables[this.id] = decimalAmount;
    return decimalAmount;
  }

  set boughtAmount(value) {
    player.celestials.pelle.rebuyables[this.id] = value;
  }

  get isCustomEffect() { return true; }

  get effectValue() {
    return this.config.effect(this.boughtAmount);
  }

  purchase(bulk = false) {
    if (!bulk) return super.purchase();
    if (!this.canBeBought || GameEnd.creditsEverClosed) return false;

    if (this.id === "galaxyGeneratorMultiplicative") {
      const currency = this.currency.value;
      const newAmount = currency.max(1).log10().floor().add(1);
      if (newAmount.lte(this.boughtAmount)) return false;

      const price = Decimal.pow(10, newAmount.sub(1));
      this.boughtAmount = newAmount;
      this.currency.value = currency.sub(price).max(0);
      this.onPurchased();
      GameUI.update();
      return true;
    }

    const index = GalaxyGeneratorUpgrades.all.findIndex(upgrade => upgrade.id === this.id);
    const logBase = [3, 10, 10, 100, 1000, 1e10, 1e100, 10, 1e100, 2][index];
    const exponentScale = [1 / 3, 0.1, 1e7, 20000, 10, 1e90, 1, 1, 1, 50][index];
    const currency = this.currency.value;
    const scaledCurrency = ((index >= 2 && index <= 4) || index === 9
      ? currency.max(1).log10().div(exponentScale)
      : currency.div(exponentScale));
    let maxAmount;
    if (index === 6 || index === 8) {
      maxAmount = Decimal.sqrt(Decimal.log(scaledCurrency, logBase).times(2).add(0.25)).sub(0.5);
    } else {
      maxAmount = Decimal.log(scaledCurrency, logBase);
    }

    let newAmount = Decimal.floor(maxAmount).max(this.boughtAmount);
    let crossedDilationCap = false;
    if (index === 6) {
      newAmount = newAmount.min(20000);
      crossedDilationCap = newAmount.gte(20000);
      if (crossedDilationCap) {
        const postCapAmount = Decimal.log(currency.max(1).log10().div(2e10), 1.001).add(20000);
        newAmount = newAmount.max(postCapAmount);
      }
    }
    if (newAmount.lte(this.boughtAmount)) return false;

    let priceAmount = index === 6 ? newAmount.min(20000) : newAmount;
    if (index === 6 || index === 8) {
      priceAmount = Decimal.pow(logBase, priceAmount.add(0.5).pow(2).sub(0.25).div(2));
    } else {
      priceAmount = Decimal.pow(logBase, priceAmount);
    }
    const price = ((index >= 2 && index <= 4) || index === 9
      ? Decimal.pow10(priceAmount.times(exponentScale))
      : priceAmount.times(exponentScale));
    const adjustedPrice = index === 6 && crossedDilationCap
      ? Decimal.pow10(Decimal.pow(1.001, newAmount.sub(20000)).times(2e10))
      : price;

    this.boughtAmount = newAmount;
    this.currency.value = currency.sub(adjustedPrice).max(0);
    this.onPurchased();
    GameUI.update();
    return true;
  }
}

export const GalaxyGeneratorUpgrades = mapGameDataToObject(
  GameDatabase.celestials.pelle.galaxyGeneratorUpgrades,
  config => new GalaxyGeneratorUpgrade(config)
);
