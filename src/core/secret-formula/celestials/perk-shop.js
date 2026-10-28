function rebuyableCost(initialCost, increment, id) {
  return Decimal.mul(initialCost, Decimal.pow(increment, player.celestials.teresa.perkShop[id] ?? DC.D0));
}
function rebuyable(config) {
  const { id, otherReq, cap, costCap, description, formatEffect, formatCost } = config;
  return {
    id,
    cost: () => (config.cost ? config.cost() : rebuyableCost(config.initialCost, config.increment, config.id)),
    otherReq,
    cap,
    costCap,
    description,
    effect: () => config.effect?.(player.celestials.teresa.perkShop[config.id] ?? DC.D0),
    preChargedEffect: () => config.preChargedEffect?.(player.celestials.teresa.perkShop[config.id] ?? DC.D0),
    chargedEffect: () => config.chargedEffect?.(player.celestials.teresa.perkShop[config.id] ?? DC.D0),
    showEffectAfterCharge: config.showEffectAfterCharge,
    formatEffect,
    formatCost,
    rebuyable: true
  };
}

export const perkShop = {
  infinityPow: rebuyable({
    id: 6,
    initialCost: 1000000,
    increment: 10,
    description: () => `Increase infinity Dimensions by a power of ${format(0.05, 2, 2)}`,
    effect: bought =>  (bought.mul(0.05).add(1)),
    formatEffect: value => formatX(value, 2, 2),
    formatCost: value => format(value, 2, 2),
    costCap: () => (1000000000),
    cap: () => (1.3),
  }),
  maxGlyphLevel: rebuyable({
    id: 7,
    initialCost: 10000,
    increment: 1.22,
    description: () => `Increase max level of Glyphs by ${formatPercents(0.05, 2, 2)}`,
    effect: bought =>  Decimal.pow(1.05, bought),
    formatEffect: value => formatX(value, 2, 2),
    formatCost: value => format(value, 2 , 2),
    costCap: () => (1e300),
    cap: () => (1e300),
  }),
  glyphLevel: rebuyable({
    id: 0,
    initialCost: 1,
    increment: 2,
    description: () => PerkShopUpgrade.glyphLevel.viewCharge
      ? "Multiply pre-instability Glyph levels based on your highest-ever Glyph level"
      : `Increase pre-instability Glyph levels by ${formatPercents(0.05)}`,
    effect: bought => player.disablePostReality ? 1 : (PerkShopUpgrade.glyphLevel.isCharged
      ? PerkShopUpgrade.glyphLevel.chargedEffect()
      : PerkShopUpgrade.glyphLevel.preChargedEffect()),
    preChargedEffect: bought => Decimal.pow(1.05, bought).toNumber(),
    chargedEffect: () => Decimal.pow(player.records.bestEndgame.glyphLevel, 0.2).toNumber(),
    formatEffect: value => formatX(value, 2, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 1048576 : 2048),
    cap: () => PerkShopUpgrade.glyphLevel.isCharged
      ? Number.MAX_VALUE
      : (Ra.unlocks.perkShopIncrease.canBeApplied ? Decimal.pow(1.05, 20).toNumber() : Decimal.pow(1.05, 11).toNumber()),
    showEffectAfterCharge: true
  }),
  rmMult: rebuyable({
    id: 1,
    initialCost: 1,
    increment: 2,
    description: () => PerkShopUpgrade.rmMult.viewCharge
      ? `Multiply Reality Machine gain and cap based on ${player.universes.current === 2 ? "Matter" : "Antimatter"} amount`
      : "Double Reality Machine gain",
    effect: bought => player.disablePostReality ? DC.D1 : (PerkShopUpgrade.rmMult.isCharged
      ? PerkShopUpgrade.rmMult.chargedEffect()
      : PerkShopUpgrade.rmMult.preChargedEffect()),
    preChargedEffect: bought => Decimal.pow(2, bought),
    chargedEffect: () => Decimal.log10(player.antimatter.add(10)),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 1048576 : 2048),
    cap: () => PerkShopUpgrade.rmMult.isCharged
      ? Number.MAX_VALUE
      : (Ra.unlocks.perkShopIncrease.canBeApplied ? 1048576 : 2048),
    showEffectAfterCharge: true
  }),
  bulkDilation: rebuyable({
    id: 2,
    initialCost: 100,
    increment: 2,
    description: () => PerkShopUpgrade.bulkDilation.viewCharge
      ? "Dilation Autobuyers always buy max."
      : "Dilation autobuyers buy twice as many Dilation Upgrades at once.",
    effect: bought => player.disablePostReality ? 1 : (PerkShopUpgrade.bulkDilation.isCharged
      ? PerkShopUpgrade.bulkDilation.chargedEffect()
      : PerkShopUpgrade.bulkDilation.preChargedEffect()),
    preChargedEffect: bought => Decimal.pow(2, bought).toNumber(),
    chargedEffect: () => 1e300,
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 1638400 : 1600),
    cap: () => PerkShopUpgrade.bulkDilation.isCharged
      ? Number.MAX_VALUE
      : (Ra.unlocks.perkShopIncrease.canBeApplied ? 16384 : 16),
    showEffectAfterCharge: false,
  }),
  autoSpeed: rebuyable({
    id: 3,
    initialCost: 1000,
    increment: 2,
    description: () => PerkShopUpgrade.autoSpeed.viewCharge
      ? "Infinity Dimension, Time Dimension, Dilation, and Replicanti autobuyers are instant."
      : `Infinity Dimension, Time Dimension, Dilation,
      and Replicanti autobuyers are ${formatX(2)} faster.`,
    effect: bought => player.disablePostReality ? 1 : (PerkShopUpgrade.autoSpeed.isCharged
      ? PerkShopUpgrade.autoSpeed.chargedEffect()
      : PerkShopUpgrade.autoSpeed.preChargedEffect()),
    preChargedEffect: bought => Decimal.pow(2, bought).toNumber(),
    chargedEffect: () => 1e300,
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 64000 : 4000),
    cap: () => PerkShopUpgrade.autoSpeed.isCharged
      ? Number.MAX_VALUE
      : (Ra.unlocks.perkShopIncrease.canBeApplied ? 64 : 4),
    showEffectAfterCharge: false
  }),
  musicGlyph: rebuyable({
    id: 4,
    description: () => PerkShopUpgrade.musicGlyph.viewCharge
      ? "Unlock an Autobuyer to automatically purchase and purge Music Glyphs."
      : `Receive a Music Glyph of a random type that is ${formatPercents(0.8)} of your highest level.
      (Try clicking it!)`,
    cost: () => 1,
    formatCost: value => formatInt(value),
    costCap: () => Number.MAX_VALUE,
    cap: () => Number.MAX_VALUE,
    showEffectAfterCharge: false
  }),
  // Only appears with the perk shop increase upgrade
  fillMusicGlyph: rebuyable({
    id: 5,
    description: () => `Fill all empty slots in your inventory with Music Glyphs`,
    cost: () => Math.clampMin(GameCache.glyphInventorySpace.value, 1),
    otherReq: () => GameCache.glyphInventorySpace.value > 0,
    formatCost: value => formatInt(value),
    costCap: () => Number.MAX_VALUE,
    cap: () => Number.MAX_VALUE,
    showEffectAfterCharge: false
  }),
  addCharges: rebuyable({
    id: 8,
    initialCost: 1e10,
    increment: 1e10,
    description: "Unlock a new Charged Perk Upgrade",
    effect: bought => Math.floor(bought.toNumber()),
    formatEffect: value => formatInt(value),
    formatCost: value => format(value, 2),
    costCap: () => 1e60,
    cap: () => 5,
    showEffectAfterCharge: false
  }),
};
