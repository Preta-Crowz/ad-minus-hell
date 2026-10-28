const formatCost = c => format(c, 2);

const rebuyable = config => {
  const { id, description, cost, effect, formatEffect, currency, currencyLabel } = config;
  return {
    id,
    description,
    cost: () => cost(player.celestials.pelle.rebuyables[id]),
    formatCost,
    effect: (x = player.celestials.pelle.rebuyables[id]) => effect(x),
    formatEffect,
    currency,
    currencyLabel
  };
};

export const pelleGalaxyGeneratorUpgrades = {
  additive: rebuyable({
    id: "galaxyGeneratorAdditive",
    description: "Increase base Galaxy generation by 2",
    cost: x => Decimal.pow(3, x),
    effect: x => Decimal.pow(x.mul(2), DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 2 : 1),
    formatEffect: x => `${format(x, 2, 2)}/s`,
    currency: () => Currency.galaxyGeneratorGalaxies,
    currencyLabel: "Galaxy"
  }),
  multiplicative: rebuyable({
    id: "galaxyGeneratorMultiplicative",
    description: "Multiply Galaxy generation",
    cost: x => Decimal.pow(10, x),
    effect: x => Decimal.pow(DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 6.25 : 2.5, x),
    formatEffect: x => formatX(x, 2, 1),
    currency: () => Currency.galaxyGeneratorGalaxies,
    currencyLabel: "Galaxy"
  }),
  antimatterMult: rebuyable({
    id: "galaxyGeneratorAntimatterMult",
    description: "Multiply Galaxy generation",
    cost: x => Decimal.pow("1e100000000", Decimal.pow10(x)),
    effect: x => Decimal.pow(DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 4 : 2, x),
    formatEffect: x => formatX(x, 2),
    currency: () => Currency.antimatter,
    currencyLabel: "Antimatter"
  }),
  IPMult: rebuyable({
    id: "galaxyGeneratorIPMult",
    description: "Multiply Galaxy generation",
    cost: x => Decimal.pow("1e2000000", Decimal.pow10(x.mul(2))),
    effect: x => Decimal.pow(DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 4 : 2, x),
    formatEffect: x => formatX(x, 2),
    currency: () => Currency.infinityPoints,
    currencyLabel: "Infinity Point"
  }),
  EPMult: rebuyable({
    id: "galaxyGeneratorEPMult",
    description: "Multiply Galaxy generation",
    cost: x => Decimal.pow("1e10000", Decimal.pow10(x.mul(3))),
    effect: x => Decimal.pow(DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 4 : 2, x),
    formatEffect: x => formatX(x, 2),
    currency: () => Currency.eternityPoints,
    currencyLabel: "Eternity Point"
  }),
  RSMult: rebuyable({
    id: "galaxyGeneratorRSMult",
    description: "Multiply Galaxy generation",
    cost: x => new Decimal(1e100).times(Decimal.pow(1e10, x)),
    effect: x => Decimal.pow(DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 4 : 2, x),
    formatEffect: x => formatX(x, 2),
    currency: () => Currency.realityShards,
    currencyLabel: "Reality Shard"
  }),
  DTMult: rebuyable({
    id: "galaxyGeneratorDTMult",
    description: "Multiply Galaxy generation",
    cost: x => {
      const amount = new Decimal(x);
      if (amount.lte(20000)) {
        const boundedAmount = amount.clampMax(20000);
        const exponent = boundedAmount.times(boundedAmount.add(1)).div(2).add(boundedAmount);
        return new Decimal(1e100).times(Decimal.pow(1e100, exponent));
      }
      return Decimal.pow10(Decimal.pow(1.001, amount.sub(20000)).times(2e10));
    },
    effect: x => Decimal.pow(DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 4 : 2, x),
    formatEffect: x => formatX(x, 2),
    currency: () => Currency.dilatedTime,
    currencyLabel: "Dilated Time"
  }),
  remnantPow: rebuyable({
    id: "galaxyGeneratorRemnantPow",
    description: "Empower Galaxy generation",
    cost: x => new Decimal(10).times(Decimal.pow10(x)),
    effect: x => new Decimal(x).div(DivinityMilestone.hadronEmpowerment.isReached ? 240 : 400).add(1),
    formatEffect: x => formatPow(x, 2, 3),
    currency: () => Currency.remnants,
    currencyLabel: "Remnant"
  }),
  exponential: rebuyable({
    id: "galaxyGeneratorExponential",
    description: "Empower Galaxy generation",
    cost: x => {
      const amount = new Decimal(x);
      const exponent = amount.times(amount.add(1)).div(2).add(amount);
      return new Decimal(1e100).times(Decimal.pow(1e100, exponent));
    },
    effect: x => new Decimal(x).div(200).add(1),
    formatEffect: x => formatPow(x, 2, 3),
    currency: () => Currency.galaxyGeneratorGalaxies,
    currencyLabel: "Galaxy"
  }),
  superExponential: rebuyable({
    id: "galaxyGeneratorSuperExponential",
    description: "Dilate Galaxy generation",
    cost: x => Decimal.pow(1e100, Decimal.pow(2, x)),
    effect: x => new Decimal(x).div(1000).add(1),
    formatEffect: x => formatPow(x, 2, 3),
    currency: () => Currency.galaxyGeneratorGalaxies,
    currencyLabel: "Galaxy"
  }),
};
