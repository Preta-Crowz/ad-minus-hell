import { BitUpgradeState } from "../game-mechanics";
import { GameDatabase } from "../secret-formula/game-database";

import { Quotes } from "./quotes";

import { deepmergeAll, matchOnlyDeepmerge } from "@/utility/deepmerge";

export const Slabdrill = {
  displayName: "Slabdrill",
  possessiveName: "Slabdrill's",
  // Fragmentation of Slabdrill: Hell is a Cursed Reality
  get isCursed() {
    return player.celestials.slabdrill.isCursed || Hell.isInside;
  },
  get isUnlocked() {
    return Slabdrill.isCursed || Slabdrill.isDestroyed;
  },
  get isDestroyed() {
    return player.celestials.slabdrill.isDestroyed;
  },
  get currentStage() {
    return player.celestials.slabdrill.stage;
  },
  get power() {
    return player.celestials.slabdrill.serpentinePower;
  },
  get cores() {
    return player.celestials.slabdrill.core.chaosCores;
  },
  get powerCap() {
    return Decimal.pow10(this.cores);
  },
  powerPerSecond(diff) {
    return (this.powerCap.sub(this.power)).times(
      new Decimal(1).sub(Decimal.pow(2, new Decimal(0).sub(diff).div(1000).div(666))));
  },
  get coreActive() {
    return player.celestials.slabdrill.core.isActive;
  },
  get huntChance() {
    return Decimal.pow10(-this.cores).times(Decimal.pow10(this.currentStage)).times(
      player.antimatter.max(10).log10().log10().pow(3).add(1)).div(10000).times(
      SlabdrillUnlocks.dilation.isUnlocked ? 16 : 1).times(
      SlabdrillUnlocks.reality.isUnlocked ? Slabdrill.slabPowers.chaosCores().times(66) : 1).toNumber();
  },
  get huntInterval() {
    return 1000 * Math.pow(0.75, this.currentStage);
  },
  slabPowers: {
    adMult: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : DC.D2.pow(Slabdrill.power.pow(0.5)),
    dbMult: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : Slabdrill.power.max(1).log10().add(1).pow(4),
    galMult: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : Slabdrill.power.max(1).log10().pow(2).div(100).add(1),
    adPow: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : Slabdrill.power.max(1).log10().div(100).add(1),
    ipMult: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : DC.D2.pow(Slabdrill.power.div(100).add(1).pow(0.4)),
    idMult: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : DC.D2.pow(Slabdrill.power.div(1000).add(1).pow(0.5)),
    repSpeed: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : Slabdrill.power.div(1e6).add(1).pow(2),
    tdMult: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : DC.D2.pow(Slabdrill.power.div(1e7).add(1).pow(0.3)),
    epMult: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : DC.D2.pow(Slabdrill.power.div(1e9).add(1).pow(0.4)),
    infMult: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : Slabdrill.power.div(1e10).add(1).pow(0.75),
    dtMult: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : Slabdrill.power.div(1e12).add(1).pow(2),
    chaosCores: () => player.dilation.active || !Slabdrill.isCursed ? DC.D1 : Slabdrill.power.div(1e15).add(1).log10().add(1).pow(7)
  },
  realityWarp() {
    player.disablePostReality = true;
    Endgame.resetNoReward();
    disChargeAllPerkUpgrades();
    disChargeAll();
    disChargeAllBreakUpgrades();
    disChargeAllEternityUpgrades();
    player.endgame.overcharge.allowComplex = false;
    AutomatorBackend.stop();
    clearCelestialRuns();
    player.celestials.slabdrill.isCursed = true;
    recalculateAllGlyphs();
    Tab.dimensions.antimatter.show(false);
  },
  warpToPelleDomain() {
    if (Slabdrill.isCursed && Slabdrill.currentStage < SlabdrillUnlocks.all.length) return;
    player.celestials.slabdrill.isCursed = false;
    player.celestials.slabdrill.isDestroyed = true;
    clearCelestialRuns();
    player.disablePostReality = false;
    player.celestials.slabdrill.core.chaosCores = 0;
    player.celestials.slabdrill.serpentinePower = DC.D0;
    for (let alch = 0; alch < 5; alch++) {
      player.celestials.ra.alchemy[alch].bestPreDoom = 0;
      player.celestials.ra.alchemy[alch].amount = DC.D0;
    }
    player.celestials.ra.alchemy[10].bestPreDoom = 0;
    player.celestials.ra.alchemy[10].amount = DC.D0;
    player.celestials.effarig.relicShards = DC.D0;
    Endgame.resetNoReward(true);
    player.endgame.overcharge.allowComplex = true;
    recalculateAllGlyphs();
    AutomatorBackend.stop();
    Tab.dimensions.antimatter.show(false);
    GameEnd.creditsEverClosed = true;
    player.antimatter = Decimal.pow10(1e100);
  },
  advanceLayer() {
    player.celestials.slabdrill.stage++;
  },
  // A strike is only encountered once the previous one is done, so a requirement already met beforehand
  // (e.g. Replicanti unlocked before Strike 5) must still trigger when its stage becomes current
  checkStrikeCatchUp() {
    if (!Slabdrill.isCursed || Slabdrill.coreActive) return;
    const stage = Slabdrill.currentStage;
    if (stage === 3 && player.break) {
      Slabdrill.advanceLayer();
      GameCache.tickSpeedMultDecrease.invalidate();
      GameCache.dimensionMultDecrease.invalidate();
      Glyphs.refreshActive();
      for (const type of GlyphInfo.basicGlyphTypes) Glyphs.addToInventory(GlyphGenerator.omniGlyph(type));
      Slabdrill.quotes.breakInfinity.show();
    } else if (stage === 4 && InfinityChallenge(4).isCompleted) {
      Slabdrill.advanceLayer();
      Slabdrill.quotes.infinityChallengeFour.show();
    } else if (stage === 5 && player.replicanti.unl) {
      player.endgame.ethereal.power = DC.D0;
      player.endgame.ethereal.sector = DC.D1;
      Slabdrill.advanceLayer();
      player.replicanti.chance = DC.D1.div(1000);
      Slabdrill.quotes.replicanti.show();
    } else if (stage === 7 && TimeStudy(181).isBought) {
      Slabdrill.advanceLayer();
      Glyphs.refreshActive();
      Slabdrill.quotes.timeStudy181.show();
    } else if (stage === 8 && EternityChallenge(10).completions >= 1) {
      Slabdrill.advanceLayer();
      Glyphs.refreshActive();
      Slabdrill.quotes.eternityChallengeTen.show();
    } else if (stage === 9 && player.dilation.active) {
      Slabdrill.advanceLayer();
      Glyphs.refreshActive();
      Slabdrill.quotes.dilation.show();
    }
  },
  enterCore(coreJump = false) {
    const snapshot = deepmergeAll([{}, player]);
    // Nested snapshots would otherwise grow the save exponentially each entry
    delete snapshot.celestials.slabdrill.records;
    delete snapshot.celestials.alpha.records;
    // Hell's stash holds the whole other world and its options are shared, so neither may be snapshotted or rolled back
    delete snapshot.hell;
    delete snapshot.options;
    player.celestials.slabdrill.records = snapshot;
    finishProcessReality({ reset: true });
    Lazy.invalidateAll();
    player.celestials.slabdrill.core.isActive = true;
    player.break = true;
    Tab.dimensions.antimatter.show(!coreJump);
  },
  exitCore() {
    player.celestials.slabdrill.core.isActive = false;
    finishProcessReality({ reset: true });
    // The snapshot predates the hunt, so Slabdrill's own progress must survive the restore
    const kept = {
      core: { ...player.celestials.slabdrill.core },
      stage: player.celestials.slabdrill.stage,
      serpentinePower: player.celestials.slabdrill.serpentinePower,
      unlockBits: player.celestials.slabdrill.unlockBits,
    };
    player = matchOnlyDeepmerge(player.celestials.slabdrill.records, player, "eternityChalls");
    Object.assign(player.celestials.slabdrill, kept);
    delete player.celestials.slabdrill.records;
    player.celestials.slabdrill.records = {};
    GameStorage.loadPlayerObject(player);
    for (let a = 0; a < 8; a++) {
      if (player.auto.antimatterDims.all[a].isUnlocked) {
        Currency.antimatter.add(new Decimal(Autobuyer.antimatterDimension(a+1).cost));
        Autobuyer.antimatterDimension(a+1).purchase();
      }
    }
    Lazy.invalidateAll();
  },
  get layerReqs() {
    return ["Perform a Dimension Boost", "Create a Galaxy", "Reach Infinity", "Break Infinity", "Complete Infinity Challenge 4",
            "Unlock Replicanti", "Reach Eternity", "Purchase Time Study 181", "Complete Eternity Challenge 10", "Dilate Time",
            "Reach Reality"];
  },
  get nextLayer() {
    return this.layerReqs[this.currentStage];
  },
  quotes: Quotes.slabdrill,
  symbol: "⁹δ"
};

class SlabdrillUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.slabdrill.unlockBits; }
  set bits(value) { player.celestials.slabdrill.unlockBits = value; }

  get requirement() {
    return this.config.requirement;
  }

  get name() {
    return this.config.name;
  }

  get nerfDescription() {
    return this.config.nerfDescription;
  }

  get buffDescription() {
    return this.config.buffDescription;
  }

  get isUnlocked() {
    return player.celestials.slabdrill.stage >= this.requirement && Slabdrill.isCursed;
  }
}

export const SlabdrillUnlocks = mapGameDataToObject(
  GameDatabase.celestials.slabdrill.unlocks,
  config => new SlabdrillUnlockState(config)
);
