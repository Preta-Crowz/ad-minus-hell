import { BitUpgradeState, RebuyableMechanicState } from "../game-mechanics";
import { DC } from "../constants";
import { GameDatabase } from "../secret-formula/game-database";

import { Quotes } from "./quotes";

export const Teresa = {
  timePoured: new Decimal(0),
  lastUnlock: "EC6RequireActive",
  get pouredAmountCap() {
    return ExpansionPack.teresaPack.isBought && !player.disablePostReality ? DC.BEMAX : new Decimal("1e30");
  },
  displayName: "Teresa",
  possessiveName: "Teresa's",
  get isUnlocked() {
    if (EndgameMilestone.celestialEarlyUnlock.isReached) return true;
    return Achievement(147).isUnlocked;
  },
  pourRM(diff, auto = false) {
    if (this.pouredAmount.gte(Teresa.pouredAmountCap)) return;
    const leftToCap = Teresa.pouredAmountCap.sub(this.pouredAmount);
    if (auto) {
      const autoPouredRM = Decimal.min(Currency.realityMachines.value.div(1000), leftToCap);
      this.pouredAmount = this.pouredAmount.add(autoPouredRM);
      Currency.realityMachines.subtract(autoPouredRM);
      this.checkForUnlocks();
      return;
    }
    this.timePoured = this.timePoured.add(diff);
    const rm = Currency.realityMachines.value;
    const rmPoured = Decimal.min(
      this.pouredAmount.plus(1e6).times(0.1).times(Decimal.pow(this.timePoured, 2)),
      rm,
      leftToCap
    );
    this.pouredAmount = this.pouredAmount.add(rmPoured);
    Currency.realityMachines.subtract(rmPoured);
    this.checkForUnlocks();
  },
  checkForUnlocks() {
    for (const info of TeresaUnlocks.all) {
      info.unlock();
    }
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.teresa.run = true;
  },
  rewardMultiplier(antimatter) {
    let effect = Decimal.max(Decimal.pow(antimatter.plus(1).log10().div(1.5e8), 12), 1);
    if (effect.gte(1e100)) effect = effect.mul(effect.div(1e100).pow(2));
    return GlitchRealityUpgrade(12).isBought ? effect.pow(1.05) : effect;
  },
  get pouredAmount() {
    return player.celestials.teresa.pouredAmount;
  },
  set pouredAmount(amount) {
    player.celestials.teresa.pouredAmount = amount;
  },
  get fill() {
    return Decimal.min(this.pouredAmount.add(1).log10().div(Teresa.pouredAmountCap.add(1).log10()), 1).toNumber();
  },
  get possibleFill() {
    return Decimal.min(
      Currency.realityMachines.value.plus(this.pouredAmount).add(1).log10().div(Teresa.pouredAmountCap.add(1).log10()),
      1
    ).toNumber();
  },
  get rmMultiplier() {
    return Decimal.max(new Decimal(250).times(Decimal.pow(this.pouredAmount.div(1e20), 0.1)), 1);
  },
  get runRewardMultiplier() {
    return this.rewardMultiplier(player.celestials.teresa.bestRunAM);
  },
  get isRunning() {
    return player.celestials.teresa.run;
  },
  get runCompleted() {
    return player.celestials.teresa.bestRunAM.gt(1);
  },
  get totalCharges() {
    return PerkShopUpgrade.addCharges.effectOrDefault(0);
  },
  get chargesLeft() {
    return this.totalCharges - player.celestials.teresa.charged.size;
  },
  get chargeModeOn() {
    return player.celestials.teresa.chargeMode;
  },
  quotes: Quotes.teresa,
  symbol: "Ϟ",

  reset() {
    player.celestials.teresa.run = false;
    player.celestials.teresa.bestRunAM = DC.D1;
    player.celestials.teresa.lastRepeatedMachines = DC.D0;
    player.celestials.teresa.lastRepeatediM = DC.D0;
    player.celestials.teresa.bestAMSet = [];
    if(MetaFabricatorUpgrade(8).isBought) return;
    player.celestials.teresa.pouredAmount = DC.D0;
    player.celestials.teresa.unlockBits = 0;
    player.celestials.teresa.perkShop = Array.repeat(DC.D0, 9);
    player.celestials.teresa.charged.clear();
    player.celestials.teresa.chargeMode = false;
  },
};

class PerkShopUpgradeState extends RebuyableMechanicState {
  constructor(config) {
    super(config);
    this.costCap = config.costCap;
  }

  get currency() {
    return this.id === 8 ? Currency.celestialPoints : Currency.perkPoints;
  }

  get boughtAmount() {
    return player.celestials.teresa.perkShop[this.id] ?? DC.D0;
  }

  set boughtAmount(value) {
    player.celestials.teresa.perkShop[this.id] = value;
  }

  get isCapped() {
    return Decimal.gte(this.cost, this.costCap());
  }

  get isAvailableForPurchase() {
    const otherReq = this.config.otherReq ? this.config.otherReq() : true;
    return this.currency.value.gte(this.cost) && otherReq;
  }

  onPurchased() {
    if (this.id === 0) {
      GameCache.staticGlyphWeights.invalidate();
    }
    if (this.id === 1) {
      Autobuyer.reality.bumpAmount(2);
    }
    // Give a single music glyph
    if (this.id === 4 && (!Pelle.isDoomed || PelleDestructionUpgrade.teresaShop.canBeApplied)) {
      if (GameCache.glyphInventorySpace.value === 0) {
        // Refund the perk point if they didn't actually get a glyph
        Currency.perkPoints.add(1);
        GameUI.notify.error("You have no empty inventory space!");
      } else {
        Glyphs.addToInventory(GlyphGenerator.musicGlyph());
        GameUI.notify.success("Created a Music Glyph");
      }
    }
    // Fill the inventory with music glyphs
    if (this.id === 5 && (!Pelle.isDoomed || PelleDestructionUpgrade.teresaShop.canBeApplied)) {
      const toCreate = GameCache.glyphInventorySpace.value;
      for (let count = 0; count < toCreate; count++) Glyphs.addToInventory(GlyphGenerator.musicGlyph());
      GameUI.notify.success(`Created ${quantifyInt("Music Glyph", toCreate)}`);
    }
  }

  get viewCharge() {
    return (Teresa.chargeModeOn || this.isCharged || ui.view.shiftDown) && this.ableToCharge &&
      ExpansionPack.teresaPack.isBought && !player.disablePostReality;
  }

  get ableToCharge() {
    return this.id <= 4;
  }

  get isCharged() {
    return player.celestials.teresa.charged.has(this.id);
  }

  get canCharge() {
    return !this.isCharged && Teresa.chargesLeft > 0 && this.ableToCharge &&
      this.boughtAmount.gte(this.chargeRequirement);
  }

  get chargeRequirement() {
    return [20, 20, 14, 6, 0][this.id];
  }

  get chargedValue() {
    return this.viewCharge ? this.chargedEffect() : this.effectValue;
  }

  chargedEffect() {
    return this.config.chargedEffect?.();
  }

  preChargedEffect() {
    return this.config.preChargedEffect?.();
  }

  get displayEffect() {
    return Boolean(this.config.formatEffect) && (!this.viewCharge || this.config.showEffectAfterCharge);
  }

  charge() {
    if (!this.canCharge) return;
    player.celestials.teresa.charged.add(this.id);
    if (this.id === 0) GameCache.staticGlyphWeights.invalidate();
    GameUI.update();
  }

  disCharge() {
    player.celestials.teresa.charged.delete(this.id);
    if (this.id === 0) GameCache.staticGlyphWeights.invalidate();
    GameUI.update();
  }
}

export function tryChargeAllPerkUpgrades() {
  if (Teresa.chargesLeft < 5) return;
  const upgrades = [
    PerkShopUpgrade.glyphLevel,
    PerkShopUpgrade.rmMult,
    PerkShopUpgrade.bulkDilation,
    PerkShopUpgrade.autoSpeed,
    PerkShopUpgrade.musicGlyph
  ];
  for (const upgrade of upgrades) {
    if (upgrade.canCharge) upgrade.charge();
  }
}

export function disChargeAllPerkUpgrades() {
  const upgrades = [
    PerkShopUpgrade.glyphLevel,
    PerkShopUpgrade.rmMult,
    PerkShopUpgrade.bulkDilation,
    PerkShopUpgrade.autoSpeed,
    PerkShopUpgrade.musicGlyph
  ];
  for (const upgrade of upgrades) {
    if (upgrade.isCharged) upgrade.disCharge();
  }
  player.celestials.teresa.disCharge = false;
}

class TeresaUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.teresa.unlockBits; }
  set bits(value) { player.celestials.teresa.unlockBits = value; }

  get price() {
    return this.config.price;
  }

  get pelleDisabled() {
    if (ChallengerUpgrade(12).isBought) return false;
    const isDisabledInDoomed = this.config.isDisabledInDoomed;
    return Pelle.isDoomed && Boolean(typeof isDisabledInDoomed === "function"
      ? isDisabledInDoomed()
      : isDisabledInDoomed);
  }

  get isEffectActive() {
    return !this.pelleDisabled;
  }

  get canBeUnlocked() {
    return !this.isUnlocked && Teresa.pouredAmount.gte(this.price);
  }

  get description() {
    return typeof this.config.description === "function" ? this.config.description() : this.config.description;
  }

  onUnlock() {
    this.config.onUnlock?.();
  }
}

export const TeresaUnlocks = mapGameDataToObject(
  GameDatabase.celestials.teresa.unlocks,
  config => new TeresaUnlockState(config)
);

export const PerkShopUpgrade = mapGameDataToObject(
  GameDatabase.celestials.perkShop,
  config => new PerkShopUpgradeState(config)
);

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.teresa.isOpen) Teresa.quotes.initial.show();
});

EventHub.logic.on(GAME_EVENT.GAME_LOAD, () => Teresa.checkForUnlocks());
