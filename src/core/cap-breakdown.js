const decimalPowerOfTen = exponent => Decimal.pow10(exponent);

const capEntry = (key, name, description, active, current, limitName, limit, currency = name, details = null) => ({
  key,
  currency,
  name,
  description,
  active,
  current,
  limitName,
  limit,
  details,
});

const production = () => AntimatterDimension(1).productionPerSecond;
const divinities = () => Currency.divinities.value;
const unnerfedCelestialMatter = () => Currency.unnerfedCelestialMatter.value;
const productionSoftcap = key => AntimatterDimension(1).productionSoftcapBreakdown
  ?.find(stage => stage.key === key);
const celestialMatterSoftcap = key => CelestialDimensions.softcapBreakdown
  ?.find(stage => stage.key === key);

const formatSoftcapEffect = detail => {
  let transformation;
  switch (detail.effectType) {
    case "log-power":
      transformation = `log10 power ${format(detail.power)} above ${format(detail.threshold)}`;
      break;
    case "double-log-power":
      transformation = `double-log power ${format(detail.power)} above ${format(detail.threshold)}`;
      break;
    case "slog-power":
      transformation = `slog × ${format(detail.power)} above ${format(detail.threshold)}`;
      break;
    case "ratio-power":
      transformation = `ratio power ${format(detail.power)} above ${format(detail.threshold)}`;
      break;
    case "power":
      transformation = `power ${format(detail.power)} above ${format(detail.threshold)}`;
      break;
    case "tickspeed-growth":
      return `×${format(detail.multiplier)} from ${format(detail.rate)}^(${format(detail.amount)} − ${format(detail.threshold)})`;
    case "completion-division":
      transformation = `excess completions ÷ ${format(detail.divisor)} above ${format(detail.threshold)}`;
      break;
    default:
      throw new Error(`Unknown softcap effect type: ${detail.effectType}`);
  }
  return transformation;
};

const softcaps = [
  capEntry(
    "free-tickspeed",
    "Free Tickspeed Upgrade Scaling",
    "Free Tickspeed upgrades above the threshold have reduced tick multiplier growth.",
    () => FreeTickspeed.amount.gt(FreeTickspeed.softcap),
    () => FreeTickspeed.amount,
    "Threshold",
    () => FreeTickspeed.softcap,
    "Tickspeed"
  ),
  capEntry(
    "doomed-ad-1",
    "Doomed Antimatter Dimension Production Softcap I",
    "Tier 1 production is softened with a square-root exponent while Doomed, before Compression, and below one Divinity.",
    () => !player.compression.active && Pelle.isDoomed && divinities() < 1 &&
      production().gt(decimalPowerOfTen(1e150)),
    production,
    "Threshold",
    () => decimalPowerOfTen(1e150),
    "Antimatter Production"
  ),
  capEntry(
    "doomed-ad-2",
    "Doomed Antimatter Dimension Production Softcap II",
    "Tier 1 production receives a second softcap while Doomed, before Compression, and below one Divinity.",
    () => !player.compression.active && Pelle.isDoomed && divinities() < 1 &&
      production().gt(decimalPowerOfTen(1e225)),
    production,
    "Threshold",
    () => decimalPowerOfTen(1e225),
    "Antimatter Production"
  ),
  capEntry(
    "normal-ad-1",
    "Antimatter Dimension Production Softcap I",
    "Tier 1 production is softened above this point outside Doomed, Overcharge, and Cursed Slabdrill states.",
    () => !Pelle.isDoomed && !player.endgame.overcharge.isRunning && !Slabdrill.isCursed &&
      production().gt(decimalPowerOfTen(1e200)),
    production,
    "Threshold",
    () => decimalPowerOfTen(1e200),
    "Antimatter Production"
  ),
  capEntry(
    "normal-ad-2",
    "Antimatter Dimension Production Softcap II",
    "Tier 1 production receives a second softcap outside Doomed, Overcharge, and Cursed Slabdrill states.",
    () => !Pelle.isDoomed && !player.endgame.overcharge.isRunning && !Slabdrill.isCursed &&
      production().gt(decimalPowerOfTen(1e260)),
    production,
    "Threshold",
    () => decimalPowerOfTen(1e260),
    "Antimatter Production"
  ),
  capEntry(
    "cursed-slabdrill-ad",
    "Cursed Slabdrill Antimatter Dimension Production Softcap",
    "Tier 1 production is softened above this point while Slabdrill is Cursed.",
    () => Slabdrill.isCursed && production().gt(decimalPowerOfTen(2e99)),
    production,
    "Threshold",
    () => decimalPowerOfTen(2e99),
    "Antimatter Production"
  ),
  capEntry(
    "overcharge-ad",
    "Overcharge Antimatter Dimension Production Softcap",
    "Tier 1 production is softened while Overcharge is running.",
    () => player.endgame.overcharge.isRunning && production().gt(1),
    production,
    "Threshold",
    () => new Decimal(1),
    "Antimatter Production"
  ),
  capEntry(
    "doomed-divinity-ad",
    "Divinity Antimatter Dimension Production Softcap",
    "Tier 1 production is softened while Doomed with at least one Divinity; at 1,000 Divinities the exponent uses log10(D)^D, increasing to log10(D)^(D*log10(D)) at 100,000 Divinities.",
    () => Pelle.isDoomed && divinities() >= 1 && production().gt(decimalPowerOfTen(9e15)),
    production,
    "Threshold",
    () => decimalPowerOfTen(9e15),
    "Antimatter Production"
  ),
  capEntry(
    "celestial-matter-softcap",
    "Celestial Matter Softcap",
    "Celestial Matter gains are softened above the dynamically scaled threshold.",
    () => unnerfedCelestialMatter().gt(CelestialDimensions.SOFTCAP),
    unnerfedCelestialMatter,
    "Threshold",
    () => CelestialDimensions.SOFTCAP,
    "Celestial Matter"
  ),
  capEntry(
    "celestial-matter-overflow",
    "Celestial Matter Overflow",
    "Celestial Matter above this threshold enters the overflow transformation.",
    () => unnerfedCelestialMatter().gt(CelestialDimensions.OVERFLOW),
    unnerfedCelestialMatter,
    "Threshold",
    () => CelestialDimensions.OVERFLOW,
    "Celestial Matter"
  ),
  capEntry(
    "doomed-ad-1e10",
    "Doomed Antimatter Dimension Production Log-Log Softcap",
    "Tier 1 production above 1e10 is transformed with a nested-log power while Doomed.",
    () => {
      production();
      return Boolean(productionSoftcap("doomed-ad-1e10"));
    },
    production,
    "Threshold",
    () => decimalPowerOfTen(10),
    "Antimatter Production"
  ),
  capEntry(
    "resurgence-synergy5-ad",
    "Resurgence Synergy 5 Antimatter Dimension Softcap",
    "Tier 1 production is reduced by the Synergy 5 power effect.",
    () => {
      production();
      return Boolean(productionSoftcap("resurgence-synergy5-ad"));
    },
    production,
    "Threshold",
    () => new Decimal(1),
    "Antimatter Production"
  ),
  capEntry(
    "nullified-void-ad",
    "Nullified Void Antimatter Dimension Softcap",
    "Tier 1 production above 10 is transformed by the Nullified Void softcap.",
    () => {
      production();
      return Boolean(productionSoftcap("nullified-void-ad"));
    },
    production,
    "Threshold",
    () => new Decimal(10),
    "Antimatter Production"
  ),
  capEntry(
    "celestial-matter-mass-overflow",
    "Celestial Matter Mass Overflow",
    "Celestial Matter above this threshold enters the mass-overflow transformation.",
    () => unnerfedCelestialMatter().gt(CelestialDimensions.MASS_OVERFLOW),
    unnerfedCelestialMatter,
    "Threshold",
    () => CelestialDimensions.MASS_OVERFLOW,
    "Celestial Matter"
  ),
];

const hardcaps = [
  capEntry(
    "antimatter-production",
    "Antimatter Dimension Production",
    "The current tier 1 production limit is selected by Alpha stage, Break state, LHC, and Doomed state.",
    () => true,
    production,
    "Production cap",
    () => AntimatterDimension(1).cappedProductionInNormalChallenges,
    "Antimatter Production"
  ),
  capEntry(
    "matter",
    "Matter",
    "Matter currency is clamped to this maximum.",
    () => true,
    () => Currency.matter.value,
    "Hardcap",
    () => DC.BEMAX
  ),
  capEntry(
    "reality-machines",
    "Reality Machines",
    "Reality Machine gains are limited by the current cap, including applicable upgrades and bonuses.",
    () => PlayerProgress.realityUnlocked(),
    () => Currency.realityMachines.value,
    "Hardcap",
    () => MachineHandler.hardcapRM
  ),
  capEntry(
    "imaginary-machines",
    "Imaginary Machines",
    "Imaginary Machine storage is limited by the lower of the current cap and hardcap.",
    () => MachineHandler.isIMUnlocked,
    () => Currency.imaginaryMachines.value,
    "Hardcap",
    () => MachineHandler.currentIMCap
  ),
  capEntry(
    "dual-machines",
    "Dual Machines",
    "Dual Machine storage is limited by the lower of the current cap and hardcap.",
    () => MachineHandler.isDMUnlocked,
    () => Currency.dualMachines.value,
    "Hardcap",
    () => MachineHandler.currentDMCap
  ),
  capEntry(
    "dark-matter",
    "Dark Matter",
    "Dark Matter currency is clamped to its dynamically scaled cap.",
    () => Laitela.isUnlocked &&
      (EndgameMilestone.celestialEarlyUnlock.isReached || ImaginaryUpgrade(15).isBought),
    () => Currency.darkMatter.value,
    "Hardcap",
    () => Laitela.darkMatterCap
  ),
  capEntry(
    "divine-matter",
    "Divine Matter",
    "Divine Matter is clamped to its Divine Star-based cap; the cap is removed by Divine Upgrade L4U5.",
    () => !DivinityUpgrade.divineL4U5.isBought,
    () => Currency.divineMatter.value,
    "Hardcap",
    () => DivineDimensions.HARDCAP
  ),
  capEntry(
    "celestial-matter-hardcap",
    "Celestial Matter",
    "The final Celestial Matter currency cap is removed when Celestial Dimension Expansion is broken.",
    () => !player.endgame.celDimExpansion.isBroken &&
      (Currency.unnerfedCelestialMatter.value.gt(0) ||
        CelestialDimensions.all.some(dimension => dimension.isUnlocked)),
    unnerfedCelestialMatter,
    "Hardcap",
    () => DC.NUMMAX
  ),
];

const activeSingularitySoftcaps = () => SingularityMilestone.all
  .map((milestone, index) => ({ milestone, index }))
  .filter(({ milestone }) => milestone.isUnlocked &&
    new Decimal(milestone.rawCompletions).gte(milestone.increaseThreshold))
  .map(({ milestone, index }) => ({
    key: `singularity-milestone-${index}`,
    currency: "Singularities",
    name: `Singularity Milestone ${index + 1}`,
    description: "Completions above this threshold count at one-third rate.",
    current: format(milestone.rawCompletions),
    limitName: "Threshold",
    limit: format(milestone.increaseThreshold),
    before: format(milestone.rawCompletions),
    effect: formatSoftcapEffect({
      before: milestone.rawCompletions,
      after: milestone.completions,
      effectType: "completion-division",
      divisor: 3,
      threshold: milestone.increaseThreshold,
    }),
    after: format(milestone.completions),
  }));

const activeDimensionCaps = (dimensions, name, currency) => dimensions
  .map((dimension, index) => ({ dimension, index }))
  .filter(({ dimension }) => dimension.isUnlocked &&
    new Decimal(dimension.purchaseCap).isFinite())
  .map(({ dimension, index }) => ({
    key: `${name}-${index + 1}`,
    currency,
    name: `${name} ${index + 1} Purchase Cap`,
    description: "The purchase limit for this dimension, including applicable cap increases.",
    current: format(dimension.purchases),
    limitName: "Hardcap",
    limit: format(dimension.purchaseCap),
  }));

export function getActiveCapBreakdowns(type) {
  if (type !== "softcaps" && type !== "hardcaps") {
    throw new Error(`Unknown cap breakdown type: ${type}`);
  }
  const entries = type === "softcaps" ? softcaps : hardcaps;
  const active = entries
    .filter(entry => entry.active())
    .map(entry => {
      const detail = entry.details?.() ?? productionSoftcap(entry.key) ??
        celestialMatterSoftcap(entry.key) ??
        (entry.key === "free-tickspeed" ? {
          before: FreeTickspeed.tickmult(),
          after: FreeTickspeed.multToNext,
          effectType: "tickspeed-growth",
          multiplier: FreeTickspeed.GROWTH_RATE.pow(FreeTickspeed.amount.sub(FreeTickspeed.softcap)),
          rate: FreeTickspeed.GROWTH_RATE,
          amount: FreeTickspeed.amount,
          threshold: FreeTickspeed.softcap,
        } : null);
      return {
        key: entry.key,
        currency: entry.currency,
        name: entry.name,
        description: entry.description,
        current: format(entry.current()),
        limitName: entry.limitName,
        limit: format(entry.limit()),
        ...(detail ? {
          before: format(detail.before),
          effect: formatSoftcapEffect({
          ...detail,
          threshold: detail.threshold ?? entry.limit(),
          }),
          after: format(detail.after),
        } : {}),
      };
    });

  if (type === "softcaps") {
    active.push(...activeSingularitySoftcaps());
  } else {
    active.push(...activeDimensionCaps(InfinityDimensions.all, "Infinity Dimension", "Infinity Dimensions"));
    active.push(...activeDimensionCaps(CelestialDimensions.all, "Celestial Dimension", "Celestial Dimensions"));
  }

  const grouped = new Map();
  for (const entry of active) {
    let group = grouped.get(entry.currency);
    if (!group) {
      group = { key: entry.currency, name: entry.currency, entries: [] };
      grouped.set(entry.currency, group);
    }
    group.entries.push(entry);
  }
  return Array.from(grouped.values());
}
