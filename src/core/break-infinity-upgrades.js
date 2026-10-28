import { GameMechanicState, RebuyableMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { SpeedrunMilestones } from "./speedrun";

class ChargedBreakInfinityUpgradeState extends GameMechanicState {
  constructor(config, upgrade) {
    super(config);
    this._upgrade = upgrade;
  }

  get isEffectActive() {
    return this._upgrade.isBought && this._upgrade.isCharged;
  }
}

const chargeableBreakUpgrades = () => [
  BreakInfinityUpgrade.totalAMMult,
  BreakInfinityUpgrade.currentAMMult,
  BreakInfinityUpgrade.galaxyBoost,
  BreakInfinityUpgrade.infinitiedMult,
  BreakInfinityUpgrade.achievementMult,
  BreakInfinityUpgrade.slowestChallengeMult,
  BreakInfinityUpgrade.infinitiedGen,
  BreakInfinityUpgrade.autobuyMaxDimboosts,
  BreakInfinityUpgrade.autobuyerSpeed
];

export function tryChargeAllBreakUpgrades() {
  if (player.endgame.overcharge.chargesLeft.infinite < 9) return;
  for (const upgrade of chargeableBreakUpgrades()) {
    if (upgrade.canCharge) upgrade.charge();
  }
}

export function disChargeAllBreakUpgrades() {
  const overcharge = player.endgame.overcharge;
  for (const upgrade of chargeableBreakUpgrades()) {
    if (upgrade.isCharged) upgrade.disCharge();
  }
  overcharge.charged.infinite.clear();
  overcharge.chargesLeft.infinite = overcharge.completions.bi;
  overcharge.discharge.infinite = false;
}

export class BreakInfinityUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    if (config.charged) {
      this._chargedEffect = new ChargedBreakInfinityUpgradeState(config.charged, this);
    }
  }

  get currency() {
    return Currency.infinityPoints;
  }

  get set() {
    return player.infinityUpgrades;
  }

  get isEffectActive() {
    return this.isBought && !this.isCharged;
  }

  get isAvailableForPurchase() {
    return !this.config.hellOnly || Hell.isInside;
  }

  get chargedEffect() {
    return this._chargedEffect;
  }

  purchase() {
    if (super.purchase()) return true;
    if (this.canCharge) {
      this.charge();
      return true;
    }
    return false;
  }

  get hasChargeEffect() {
    return this.config.charged !== undefined && Ascensions.ocA.isUnlocked;
  }

  get isCharged() {
    return player.endgame.overcharge.charged.infinite.has(this.id);
  }

  get canCharge() {
    return this.isBought &&
      this.hasChargeEffect &&
      !this.isCharged &&
      player.endgame.overcharge.chargesLeft.infinite !== 0;
  }

  charge() {
    player.endgame.overcharge.charged.infinite.add(this.id);
  }

  disCharge() {
    player.endgame.overcharge.charged.infinite.delete(this.id);
  }

  onPurchased() {
    if (this.id === "postGalaxy") {
      SpeedrunMilestones(7).tryComplete();
      PelleStrikes.powerGalaxies.trigger();
      if (Alpha.isRunning && Alpha.currentStage === 6) {
        Alpha.advanceLayer();
        Alpha.quotes.powerGalaxies.show();
      }
    }
    if (BreakInfinityUpgrade.all.filter(u => u.isBought).length ===
      (BreakInfinityUpgrade.all.length - player.infinityRebuyables.length) &&
      BreakInfinityUpgrade.all.filter(u => u.isCapped).length === player.infinityRebuyables.length &&
      Alpha.isRunning && Alpha.currentStage === 7) {
      InfinityDimensions.fullReset();
      Alpha.advanceLayer();
      Alpha.quotes.allBreakUpgrades.show();
    }
  }
}

class RebuyableBreakInfinityUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.infinityPoints;
  }

  get boughtAmount() {
    return player.infinityRebuyables[this.id];
  }

  set boughtAmount(value) {
    player.infinityRebuyables[this.id] = value;
  }

  get isCapped() {
    return this.boughtAmount.gte(this.config.maxUpgrades);
  }

  onPurchased() {
    this.config.onPurchased?.();
    if (BreakInfinityUpgrade.all.filter(u => u.isBought).length ===
      (BreakInfinityUpgrade.all.length - player.infinityRebuyables.length) &&
      BreakInfinityUpgrade.all.filter(u => u.isCapped).length === player.infinityRebuyables.length &&
      Alpha.isRunning && Alpha.currentStage === 7) {
      InfinityDimensions.fullReset();
      Alpha.advanceLayer();
      Alpha.quotes.allBreakUpgrades.show();
    }
  }
}

export const BreakInfinityUpgrade = mapGameDataToObject(
  GameDatabase.infinity.breakUpgrades,
  config => (config.rebuyable
    ? new RebuyableBreakInfinityUpgradeState(config)
    : new BreakInfinityUpgradeState(config))
);

// Hell-only upgrades are kept out of `all` so completion checks (Alpha, Pelle) are unaffected
BreakInfinityUpgrade.hellUpgrades = BreakInfinityUpgrade.all.filter(u => u.config.hellOnly);
BreakInfinityUpgrade.all = BreakInfinityUpgrade.all.filter(u => !u.config.hellOnly);
