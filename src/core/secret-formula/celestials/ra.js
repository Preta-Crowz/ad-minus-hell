export const ra = {
  pets: {
    teresa: {
      id: "teresa",
      name: "Teresa",
      color: "var(--color-ra-pet--teresa)",
      chunkGain: "Eternity Points",
      memoryGain: "current RM",
      requiredUnlock: () => undefined,
      rawMemoryChunksPerSecond: () => Decimal.pow(Currency.eternityPoints.value.add(1).log10().div(1e4), 3).mul(4),
      memoryProductionMultiplier: () => Ra.unlocks.teresaXP.effectOrDefault(new Decimal(1))
    },
    effarig: {
      id: "effarig",
      name: "Effarig",
      color: "var(--color-ra-pet--effarig)",
      chunkGain: "Relic Shards gained",
      memoryGain: "best Glyph level",
      requiredUnlock: () => Ra.unlocks.effarigUnlock,
      rawMemoryChunksPerSecond: () => Decimal.pow(Effarig.shardsGained, 0.1).mul(4),
      memoryProductionMultiplier: () => Ra.unlocks.effarigXP.effectOrDefault(new Decimal(1))
    },
    enslaved: {
      id: "enslaved",
      name: "The Nameless Ones",
      color: "var(--color-ra-pet--enslaved)",
      chunkGain: "Time Shards",
      memoryGain: "total time played",
      requiredUnlock: () => Ra.unlocks.enslavedUnlock,
      rawMemoryChunksPerSecond: () => Decimal.pow(Currency.timeShards.value.add(1).log10().div(3e5),
        ResurgenceUpgrade.memSurge.isBought ? 3 : 2).mul(4),
      memoryProductionMultiplier: () => Ra.unlocks.enslavedXP.effectOrDefault(new Decimal(1))
    },
    v: {
      id: "v",
      name: "V",
      color: "var(--color-ra-pet--v)",
      chunkGain: "Infinity Power",
      memoryGain: "total Memory levels",
      requiredUnlock: () => Ra.unlocks.vUnlock,
      rawMemoryChunksPerSecond: () => Decimal.pow(Currency.infinityPower.value.add(1).log10().div(1e7),
        ResurgenceUpgrade.memSurge.isBought ? 2.5 : 1.5).mul(4),
      memoryProductionMultiplier: () => Ra.unlocks.vXP.effectOrDefault(new Decimal(1))
    },
    glitchyfishys: {
      id: "glitchyfishys",// i dont want to make a migration just to change this to glitch
      name: "Glitch",
      color: "var(--color-ra-pet--glitch)",
      chunkGain: "current RM",
      memoryGain: "reality machines and antimatter",
      requiredUnlock: () => undefined,
      rawMemoryChunksPerSecond: () => Currency.realityMachines.value.add(1).log10().mul(10).pow(1.8),
      memoryProductionMultiplier: () => Ra.unlocks.glitchyfishysXP.effectOrDefault(new Decimal(1)).mul(
      Ra.unlocks.memroygain1.effectOrDefault(1) * Ra.unlocks.memroygain2.effectOrDefault(1) *
      Ra.unlocks.memroygain3.effectOrDefault(1) * Ra.unlocks.memroygain4.effectOrDefault(1) *
      Ra.unlocks.memroygain5.effectOrDefault(1))
    },
    cante: {
      id: "cante",
      name: "Cante",
      color: "#71c6f3",
      chunkGain: "Replicanti",
      memoryGain: "Replicanti Muliplier",
      requiredUnlock: () => MetaFabricatorUpgrade(25).isBought,
      rawMemoryChunksPerSecond: () => Currency.replicanti.value.add(10).log10().div(1e12).pow(0.8).mul(4),
      memoryProductionMultiplier: () => Ra.unlocks.canteXP.effectOrDefault(new Decimal(1))
    },
    null: {
      id: "null",
      name: "Null",
      color: "#909090",
      chunkGain: "Metas",
      memoryGain: "Null",
      requiredUnlock: () => MetaFabricatorUpgrade(25).isBought,
      rawMemoryChunksPerSecond: () => Currency.metas.value.add(10).log10().div(10).pow(1.5).mul(30),
      memoryProductionMultiplier: () => Ra.unlocks.nullXP.effectOrDefault(new Decimal(1))
    },
  },
  unlocks: {
    autoTP: {
      id: 0,
      reward: "Tachyon Particles are given immediately when Time Dilation is active",
      pet: "teresa",
      level: 1,
      displayIcon: `<span class="fas fa-atom"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raTeresa1.canBeApplied
    },
    chargedInfinityUpgrades: {
      id: 1,
      reward: () => `Unlock Charged Infinity Upgrades. You get one more maximum
        Charged Infinity Upgrade every ${formatInt(2)} levels`,
      effect: () => Math.min(12, Math.floor(Ra.pets.teresa.level / 2)),
      pet: "teresa",
      level: 2,
      displayIcon: `<span class="fas fa-infinity"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raTeresa2.canBeApplied
    },
    teresaXP: {
      id: 2,
      reward: "All Memory Chunks produce more Memories based on Reality Machines",
      effect: () => Currency.realityMachines.value.add(1).log10().div(100).sqrt(),
      pet: "teresa",
      level: 5,
      displayIcon: `Ϟ`
    },
    alteredGlyphs: {
      id: 3,
      reward: "Unlock Altered Glyphs, which grant new effects to Glyphs based on Glyph Sacrifice",
      pet: "teresa",
      level: 10,
      displayIcon: `<span class="fas fa-bolt"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raTeresa3.canBeApplied
    },
    effarigUnlock: {
      id: 4,
      reward: "Unlock Effarig's Memories",
      pet: "teresa",
      level: 8,
      displayIcon: `Ϙ`
    },
    perkShopIncrease: {
      id: 5,
      reward: "Purchase caps are raised in Teresa's Perk Point Shop",
      pet: "teresa",
      level: 15,
      displayIcon: `<span class="fas fa-project-diagram"></span>`
    },
    unlockDilationStartingTP: {
      id: 6,
      reward: `In non-Celestial Realities, gain Tachyon Particles as if you reached the square root of your total
        antimatter in Dilation. Any multipliers to TP gain are applied retroactively, even outside Dilation`,
      effect: () => player.records.totalAntimatter.pow(0.5),
      pet: "teresa",
      level: 25,
      displayIcon: `<i class="far fa-dot-circle"></i>`
    },
    extraGlyphChoicesAndRelicShardRarityAlwaysMax: {
      id: 7,
      reward: () => `Get ${formatX(2)} Glyph choices and the bonus to Glyph rarity from Relic Shards
        is always its maximum value (not from ARS perk)`,
      effect: 2,
      pet: "effarig",
      level: 1,
      displayIcon: `<i class="fas fa-grip-horizontal"></i>`
    },
    unlockGlyphAlchemy: {
      id: 8,
      reward: `Unlock Glyph Alchemy, which adds alchemical resources you can increase by Refining Glyphs. You unlock
        more resources through Effarig levels. Access through a new Reality tab.`,
      pet: "effarig",
      level: 2,
      displayIcon: `<span class="fas fa-vial"></span>`
    },
    effarigXP: {
      id: 9,
      reward: "All Memory Chunks produce more Memories based on highest Glyph level",
      effect: () => player.records.bestReality.glyphLevel.div(6000).add(1),
      pet: "effarig",
      level: 5,
      displayIcon: `<span class="fas fa-clone"></span>`
    },
    glyphEffectCount: {
      id: 10,
      reward: () => `Glyphs always have ${formatInt(4)} effects, and Effarig Glyphs can now have up to ${formatInt(7)}`,
      pet: "effarig",
      level: 10,
      displayIcon: `<span class="fas fa-braille"></span>`
    },
    enslavedUnlock: {
      id: 11,
      reward: "Unlock Nameless's Memories",
      pet: "effarig",
      level: 8,
      displayIcon: `<span class="c-ra-pet-milestones-effarig-link">\uf0c1</span>`
    },
    relicShardGlyphLevelBoost: {
      id: 12,
      reward: "Glyph level is increased based on Relic Shards gained",
      effect: () => Decimal.pow(Decimal.log10(Decimal.max(Effarig.shardsGained, 1)), 2).mul(100),
      pet: "effarig",
      level: 15,
      displayIcon: `<span class="fas fa-fire"></span>`
    },
    maxGlyphRarityAndShardSacrificeBoost: {
      id: 13,
      reward: () => `Glyphs are always generated with ${formatPercents(1)} rarity and
        Glyph Sacrifice gain is raised to a power based on Relic Shards`,
      effect: () => Effarig.maxRarityBoost.div(100).add(1),
      pet: "effarig",
      level: 25,
      displayIcon: `<i class="fas fa-ankh"></i>`
    },
    blackHolePowerAutobuyers: {
      id: 14,
      reward: "Unlock Black Hole power upgrade autobuyers",
      pet: "enslaved",
      level: 1,
      displayIcon: `<span class="fas fa-circle"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raNameless1.canBeApplied
    },
    improvedStoredTime: {
      id: 15,
      reward: "Stored game time is amplified and you can store more real time, increasing with Nameless levels",
      effects: {
        gameTimeAmplification: () => Decimal.pow(20, Math.clampMax(Ra.pets.enslaved.level, Ra.levelCap)),
        realTimeCap: () => Math.min(Ra.pets.enslaved.level, 16) * 1e3 * 3.6e3,
      },
      pet: "enslaved",
      level: 2,
      displayIcon: `<span class="fas fa-history"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raNameless2.canBeApplied
    },
    enslavedXP: {
      id: 16,
      reward: "All Memory Chunks produce more Memories based on total time played",
      effect: () => Decimal.log10(player.records.totalTimePlayed).div(175).add(1),
      pet: "enslaved",
      level: 5,
      displayIcon: `<span class="fas fa-stopwatch"></span>`
    },
    autoPulseTime: {
      id: 17,
      reward: () => `Black Hole charging now only uses ${formatPercents(0.99)} of your game speed and you can
        automatically discharge ${formatPercents(0.01)} of your stored game time every ${formatInt(5)} ticks.`,
      pet: "enslaved",
      level: 10,
      displayIcon: `<span class="fas fa-expand-arrows-alt"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raNameless3.canBeApplied
    },
    vUnlock: {
      id: 18,
      reward: "Unlock V's Memories",
      pet: "enslaved",
      level: 8,
      displayIcon: `⌬`
    },
    peakGamespeedDT: {
      id: 19,
      reward: "Gain more Dilated Time based on peak game speed in each Reality",
      effect: () => Decimal.max(Decimal.pow(Decimal.log10(player.celestials.ra.peakGamespeed).sub(90), 3), 1),
      pet: "enslaved",
      level: 15,
      displayIcon: `<span class="fas fa-tachometer-alt"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raNameless4.canBeApplied
    },
    allGamespeedGlyphs: {
      id: 20,
      reward: `All basic Glyphs gain the increased game speed effect from Time Glyphs,
        and Time Glyphs gain an additional effect`,
      pet: "enslaved",
      level: 25,
      displayIcon: `<span class="fas fa-clock"></span>`,
      onUnlock: () => {
        const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
        for (const glyph of allGlyphs) {
          Glyphs.applyGamespeed(glyph);
        }
      }
    },
    instantECAndRealityUpgradeAutobuyers: {
      id: 21,
      reward: "Rebuyable Reality upgrades are bought automatically and Auto-Eternity Challenges happen instantly",
      pet: "v",
      level: 1,
      displayIcon: `<span class="fas fa-sync-alt"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raV1.canBeApplied
    },
    autoUnlockDilation: {
      id: 22,
      reward: () => `In non-Celestial Realities, Time Dilation is unlocked automatically for free at
        ${formatInt(TimeStudy.dilation.totalTimeTheoremRequirement)} Time Theorems`,
      pet: "v",
      level: 2,
      displayIcon: `<span class="fas fa-fast-forward"></span>`
    },
    vXP: {
      id: 23,
      reward: "All Memory Chunks produce more Memories based on total Celestial levels.",
      effect: () => new Decimal(1 + Ra.totalPetLevel / 50),
      pet: "v",
      level: 5,
      displayIcon: `<span class="fas fa-book"></span>`
    },
    unlockHardV: {
      id: 24,
      reward: () => `Unlock Hard V-Achievements and unlock a Triad Study every ${formatInt(6)} levels.
        Triad Studies are located at the bottom of the Time Studies page`,
      effect: () => Math.min(Math.floor(Ra.pets.v.level / 6), 4),
      pet: "v",
      level: 6,
      displayIcon: `<span class="fas fa-trophy"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raV2.canBeApplied
    },
    continuousTTBoost: {
      id: 25,
      reward: "Time Theorems boost all forms of continuous non-dimension production",
      effects: {
        ttGen: () => Decimal.pow(10, Ra.theoremBoostFactor().mul(5)),
        eternity: () => Decimal.pow(10, Ra.theoremBoostFactor().mul(2)),
        infinity: () => Decimal.pow(10, Ra.theoremBoostFactor().mul(15)),
        replicanti: () => Decimal.pow(10, Ra.theoremBoostFactor().mul(20)),
        dilatedTime: () => Decimal.pow(10, Ra.theoremBoostFactor().mul(3)),
        memories: () => Ra.theoremBoostFactor().div(50).add(1),
        memoryChunks: () => Ra.theoremBoostFactor().div(50).add(1),
        autoPrestige: () => Ra.theoremBoostFactor().mul(2.4).add(1)
      },
      pet: "v",
      level: 10,
      displayIcon: `<span class="fas fa-university"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raV3.canBeApplied
    },
    achievementTTMult: {
      id: 26,
      reward: "Achievement multiplier applies to Time Theorem generation",
      effect: () => Achievements.power,
      pet: "v",
      level: 15,
      displayIcon: `<span class="fas fa-graduation-cap"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raV4.canBeApplied
    },
    achievementPower: {
      id: 27,
      reward: () => `Achievement multiplier is raised ${formatPow(1.5, 1, 1)}`,
      effect: 1.5,
      pet: "v",
      level: 25,
      displayIcon: `<i class="fab fa-buffer"></i>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raV5.canBeApplied
    },
    memroygain1: {
      id: 28,
      reward: () => `Increase memory gain by 10 times.`,
      effect: 10,
      pet: "glitchyfishys",
      level: 1,
      displayIcon: `<i class="far fa-brain"></i>`,
    },
    memroygain2: {
      id: 29,
      reward: () => `Increase memory gain by 15 times.`,
      effect: 15,
      pet: "glitchyfishys",
      level: 5,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    glitchyfishysXP: {
      id: 30,
      reward: () => `Increase all memory based on Reality Machines AND Antimatter.`,
      effect: () => Currency.realityMachines.value.pLog10().div(25).pow(0.18).mul(Currency.antimatter.value.pLog10().div(1e5).pow(0.18)),
      pet: "glitchyfishys",
      level: 10,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    memroygain3: {
      id: 31,
      reward: () => `Increase memory gain by 5 times.`,
      effect: 5,
      pet: "glitchyfishys",
      level: 15,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    memroygain4: {
      id: 32,
      reward: () => `Increase memory gain by 5 times.`,
      effect: 5,
      pet: "glitchyfishys",
      level: 25,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    memroygain5: {
      id: 33,
      reward: () => `Increase memory gain by 5 times.`,
      effect: 5,
      pet: "glitchyfishys",
      level: 30,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    StrongerAlchemy: {
      id: 34,
      reward: () => `Alchemy efficiency is greatly increased.`,
      effect: 5,
      pet: "glitchyfishys",
      level: 40,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    gainoutside: {
      id: 35,
      reward: () => `Gain Memory Chunks outside Ra's reality.`,
      effect: 1,
      pet: "glitchyfishys",
      level: 50,
      displayIcon: `<span class="fas fa-bolt"></span>`,
    },
    canteXP: {
      id: 36,
      reward: () => `Gain more memories based on Replicanti`,
      effect: () => Currency.replicanti.value.log10().pow(0.05),
      pet: "cante",
      level: 2,
      displayIcon: `Ξ`,
    },
    repMul: {
      id: 37,
      reward: () => `Gain a power to Replicanti speed based on Cante's memory level`,
      effect: () =>  Decimal.mul(1.1, Ra.pets.cante.level),
      pet: "cante",
      level: 5,
      displayIcon: `Ξ`,
    },
    repEffect: {
      id: 38,
      reward: () => `Increase the effectiveness of RGs by ${formatPercents(0.05)} per level`,
      effect: () => Decimal.pow(1.05, Ra.pets.cante.level - 15),
      pet: "cante",
      level: 15,
      displayIcon: `Ξ`,
    },
    repCap: {
      id: 39,
      reward: () => `Increase the cap of RGs based on Cante's level`,
      effect: () => Decimal.pow(Ra.pets.cante.level / 50, Ra.pets.cante.level / 50),
      pet: "cante",
      level: 50,
      displayIcon: `Ξ`,
    },
    canteUnlock: {
      id: 40,
      reward: () => `Unlock Cante, the Celestial of Replicanti`,
      pet: "cante",
      level: 150,
      displayIcon: `Ξ`,
    },
    canteMetaBoost: {
      id: 41,
      reward: () => `Replicanti boosts Meta gain`,
      pet: "cante",
      effect: () => Currency.replicanti.value.add(10).log10().pow(0.001),
      level: 200,
      displayIcon: `Ξ`,
    },
    repAD: {
      id: 49,
      reward: () => `Antimatter Dimensions power based on the Replicanti Multiplier to Infinity Dimensions`,
      pet: "cante",
      effect: () => replicantiMult().add(10).log10().log10().mul(0.01).add(1),
      level: 100,
      displayIcon: `Ξ`,
    },
    nullXP: {
      id: 42,
      reward: () => `Multiply Null and Cantes Memory Chunk gain by x${format(1.9,0,1)} per level`,
      effect: () => Decimal.pow(1.9, Ra.pets.null.level),
      pet: "null",
      level: 5,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullCharge: {
      id: 43,
      reward: () => `Distant Galaxy Scaling is delay based on Null's memory level`,
      effect: () => Decimal.mul(1000, Ra.pets.null.level),
      pet: "null",
      level: 15,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullInfCap: {
      id: 44,
      reward: () => `Infinity Dimension Hardcap is multiplied based on Null level`,
      effect: () => Decimal.pow(1.5, Ra.pets.null.level),
      pet: "null",
      level: 35,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullMetaAntimatter: {
      id: 45,
      reward: () => `Boost Meta Relay gain based on Antimatter and Null level`,
      effect: () => {
        let pow = (Decimal.pow(1.03, Ra.pets.null.level - 75).mul(0.01));
        return Currency.antimatter.value.log(1e5).pow(pow);
      },
      pet: "null",
      level: 75,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullMetaBoost: {
      id: 46,
      reward: () => `Gain 25% more Metas every null level past 125`,
      effect: () => Decimal.pow(1.25, Ra.pets.null.level - 125),
      pet: "null",
      level: 125,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullUnlock: {
      id: 47,
      reward: () => `Unlock Null, the Celestial of Void`,
      pet: "null",
      level: 150,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullDamagedMRGain: {
      id: 48,
      reward: () => `AD power based on Cante and Null Currencies`,
      effect: () => Currency.artificialMatter.value.pow(Currency.chaosMatter.value).mul(Currency.abyssalMatter.value.pow(Currency.corruptMatter.value)).add(10).log10().add(10).log10().add(10).log10(),
      pet: "null",
      level: 175,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullUpgrade4: {
      id: 50,
      reward: () => `Unlock the Celestial of Fragmentation (NYI)`,
      pet: "null",
      level: 200,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    eternityPointPower: {
      id: 51,
      reward: "Eternity Points are raised based on Teresa Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.teresa.level) / 100,
      pet: "teresa",
      level: 30,
      displayIcon: `<span class="fas fa-angle-up"></span>`,
      disabledByPelle: false
    },
    realityMachineCap: {
      id: 52,
      reward: "Reality Machine cap is raised based on Teresa Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.teresa.level) / 100,
      pet: "teresa",
      level: 40,
      displayIcon: `<span class="fas fa-arrow-turn-up"></span>`,
      disabledByPelle: false
    },
    celestialDimensionConversionPower: {
      id: 53,
      reward: "The Celestial Dimension Conversion Exponent is increased based on Teresa Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.teresa.level) / 200,
      pet: "teresa",
      level: 50,
      displayIcon: `<span class="fas fa-star"></span>`,
      disabledByPelle: false
    },
    chargeBoost: {
      id: 54,
      reward: "Charged Infinity Upgrades act as if your Teresa Level was twice as high",
      effect: () => player.disablePostReality ? 1 : 2,
      pet: "teresa",
      level: 65,
      displayIcon: `<span class="fas fa-bolt"></span>`,
      disabledByPelle: false
    },
    sacrificePower: {
      id: 55,
      reward: "Dimensional Sacrifice gain for all Glyphs is squared",
      effect: () => player.disablePostReality ? 1 : 2,
      pet: "teresa",
      level: 80,
      displayIcon: "Ω",
      disabledByPelle: false
    },
    imaginaryMachines: {
      id: 56,
      reward: "Imaginary Machines gain a power based on total Glyph Sacrifice amount",
      effect: () => {
        const sacrificeSum = new Decimal(player.reality.glyphs.sac.power)
          .add(player.reality.glyphs.sac.infinity)
          .add(player.reality.glyphs.sac.time)
          .add(player.reality.glyphs.sac.replication)
          .add(player.reality.glyphs.sac.dilation)
          .add(player.reality.glyphs.sac.effarig)
          .add(player.reality.glyphs.sac.reality);
        return player.disablePostReality ? 1 : 1 + Decimal.log10(Decimal.log10(sacrificeSum.add(1)).add(1)).div(20).toNumber();
      },
      pet: "teresa",
      level: 100,
      displayIcon: `<span class="fas fa-gear"></span>`,
      disabledByPelle: false
    },
    celestialDimensionPower: {
      id: 57,
      reward: "Endgames and Teresa level empower Celestial Dimensions",
      effect: () => {
        if (player.disablePostReality) return 1;
        const logEndgames = Decimal.log10(player.endgames.add(1));
        const teresaLevel = Ra.pets.teresa.level;
        const multiplier = Decimal.clamp(logEndgames.times(teresaLevel / 2000), 1, 1.5)
          .times(Decimal.max(logEndgames.times(teresaLevel / 3000), 1).pow(0.1));
        return multiplier.pow(5);
      },
      pet: "teresa",
      level: 125,
      displayIcon: `<span class="fas fa-award"></span>`,
      disabledByPelle: false
    },
    relicShardBoost: {
      id: 58,
      reward: "Relic Shard gain is boosted based on Effarig Level",
      effect: () => player.disablePostReality ? DC.D1 : Decimal.pow(10, Math.floor(Ra.pets.effarig.level)),
      pet: "effarig",
      level: 30,
      displayIcon: `<span class="fas fa-flask"></span>`,
      disabledByPelle: false
    },
    instabilityDelay: {
      id: 59,
      reward: "Relic Shards delay the first three levels of Glyph Instability",
      effect: () => player.disablePostReality ? 0 : Decimal.log10(player.celestials.effarig.relicShards.add(1)).times(10).toNumber(),
      pet: "effarig",
      level: 40,
      displayIcon: `<span class="fas fa-arrow-right"></span>`,
      disabledByPelle: false
    },
    rarityBuff: {
      id: 60,
      reward: "Maximum Glyph Rarity is increased based on Effarig Level",
      effect: () => player.disablePostReality ? 0 : Math.floor(Ra.pets.effarig.level) / 2,
      pet: "effarig",
      level: 50,
      displayIcon: `<span class="fas fa-dice"></span>`,
      disabledByPelle: false
    },
    glyphLevelBuff: {
      id: 61,
      reward: "Gain a small multiplier to Glyph Level based on Effarig Level which applies after Instability",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.effarig.level) / 1000,
      pet: "effarig",
      level: 65,
      displayIcon: `<span class="fas fa-chart-line"></span>`,
      disabledByPelle: false
    },
    alchemyCapIncrease: {
      id: 62,
      reward: "Effarig Level multiplies Glyph Alchemy cap",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.effarig.level) / 100,
      pet: "effarig",
      level: 80,
      displayIcon: `<span class="fas fa-flask-vial"></span>`,
      disabledByPelle: false
    },
    realityGlyphRarity: {
      id: 63,
      reward: "Effarig Level increases Reality Glyph rarity",
      effect: () => player.disablePostReality ? 0 : Math.floor(Ra.pets.effarig.level) / 5,
      pet: "effarig",
      level: 100,
      displayIcon: "Ϟ",
      disabledByPelle: false
    },
    glyphSlot: {
      id: 64,
      reward: "Gain another Glyph Slot",
      effect: 1,
      pet: "effarig",
      level: 125,
      displayIcon: `<span class="fas fa-plus"></span>`,
      disabledByPelle: false
    },
    gameSpeedImprovement: {
      id: 65,
      reward: "Game Speed gains a power based on Nameless Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.pow(Math.floor(Ra.pets.enslaved.level) / 100, 2),
      pet: "enslaved",
      level: 30,
      displayIcon: `<span class="fas fa-hourglass"></span>`,
      disabledByPelle: false
    },
    tickspeedPower: {
      id: 66,
      reward: "Gain a power to Tickspeed based on Nameless Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.enslaved.level) / 100,
      pet: "enslaved",
      level: 40,
      displayIcon: `<span class="fas fa-power-off"></span>`,
      disabledByPelle: false
    },
    gameSpeedTesseractBoost: {
      id: 67,
      reward: "Tesseracts boost Game Speed",
      effect: () => player.disablePostReality ? DC.D1 : Decimal.pow(10, Tesseracts.effectiveCount),
      pet: "enslaved",
      level: 50,
      displayIcon: `<span class="fas fa-forward"></span>`,
      disabledByPelle: false
    },
    gameSpeedTachyonMult: {
      id: 68,
      reward: "Peak Game Speed this Endgame multiplies Tachyon Particles gained",
      effect: () => player.disablePostReality ? DC.D1 : player.records.thisEndgame.peakGameSpeed,
      pet: "enslaved",
      level: 65,
      displayIcon: `<span class="fas fa-atom"></span>`,
      disabledByPelle: false
    },
    eternityGenBuff: {
      id: 69,
      reward: "Nameless Level boosts Eternity Generation",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.enslaved.level) / 100,
      pet: "enslaved",
      level: 80,
      displayIcon: "∆",
      disabledByPelle: false
    },
    imaginaryMachineEternityPower: {
      id: 70,
      reward: "Gain a power to Imaginary Machines based on Eternities",
      effect: () => player.disablePostReality ? 1 : 1 + Decimal.log10(Decimal.log10(player.eternities.add(1)).add(1)).div(20).toNumber(),
      pet: "enslaved",
      level: 100,
      displayIcon: `<span class="fas fa-lightbulb"></span>`,
      disabledByPelle: false
    },
    freeTesseractIncrease: {
      id: 71,
      reward: "Nameless Level increases the Free Tesseract Softcap starting threshold",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.enslaved.level) / 250,
      pet: "enslaved",
      level: 125,
      displayIcon: `<span class="fas fa-cubes"></span>`,
      disabledByPelle: false
    },
    achievementMultPower: {
      id: 72,
      reward: "Gain a power to Achievement Multiplier based on V Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.v.level) / 100,
      pet: "v",
      level: 30,
      displayIcon: `<span class="fas fa-medal"></span>`,
      disabledByPelle: false
    },
    allDimPowTT: {
      id: 73,
      reward: "Time Theorems empower the first three Dimension types",
      effect: () => player.disablePostReality ? DC.D1 : Decimal.pow(
        Decimal.log10(Decimal.log10(Currency.timeTheorems.value.add(1)).add(1)).div(10).add(1), 5),
      pet: "v",
      level: 40,
      displayIcon: `<span class="fas fa-brain"></span>`,
      disabledByPelle: false
    },
    triadBuff: {
      id: 74,
      reward: "Triad Studies are more powerful based on V Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.v.level) / 200,
      pet: "v",
      level: 50,
      displayIcon: `<span class="fas fa-3"></span>`,
      disabledByPelle: false
    },
    spaceTheoremIPowConversion: {
      id: 75,
      reward: "Space Theorems boost the Infinity Power Conversion Rate",
      effect: () => player.disablePostReality ? 1 : V.spaceTheorems.add(1).pow(0.05),
      pet: "v",
      level: 65,
      displayIcon: `<span class="fas fa-ranking-star"></span>`,
      disabledByPelle: false
    },
    spaceTheoremBoost: {
      id: 76,
      reward: "Space Theorems are boosted by V Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.v.level) / 200,
      pet: "v",
      level: 80,
      displayIcon: `<span class="fas fa-star"></span>`,
      disabledByPelle: false
    },
    spaceTheoremAchPower: {
      id: 77,
      reward: "Space Theorems empower Achievement Multiplier",
      effect: () => player.disablePostReality ? DC.D1 : V.spaceTheorems.add(1).log10().add(1),
      pet: "v",
      level: 100,
      displayIcon: `<span class="fas fa-award"></span>`,
      disabledByPelle: false
    },
    infinityDimPower: {
      id: 78,
      reward: "Gain a power to Infinity Dimensions based on V Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.v.level) / 40,
      pet: "v",
      level: 125,
      displayIcon: `<span class="fas fa-infinity"></span>`,
      disabledByPelle: false
    },
  }
};
