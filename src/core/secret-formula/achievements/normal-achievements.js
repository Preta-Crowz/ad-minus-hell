/* eslint-disable max-len */
import { DC } from "../../constants";

export const normalAchievements = [
  {
    id: 11,
    name: "You gotta start somewhere",
    description: "Buy a 1st Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    reward: "Your Achievement multiplier to the 1st Antimatter Dimension is squared.",
    effect: () => Achievements.power,
  },
  {
    id: 12,
    name: "100 antimatter is a lot",
    description: "Buy a 2nd Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    reward: () => `Multiply the 2nd Antimatter Dimension by the Antimatter Exponent.${Hell.isInside
      ? " The 1st Time Dimension is no longer slowed down by the NG-4 nerf." : ""}`,
    effect: () => Currency.antimatter.value.add(1).log10(),
    effect: () => Currency.antimatter.value.add(1).log10(),
  },
  {
    id: 13,
    name: "Half life 3 CONFIRMED",
    description: "Buy a 3rd Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    reward: "The 3rd and higher Antimatter Dimensions are 30% stronger.",
    effect: 1.3,
  },
  {
    id: 14,
    name: "L4D: Left 4 Dimensions",
    description: "Buy a 4th Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    reward: "The 4th Antimatter Dimension is multiplied by 4.",
    effect: 4,
  },
  {
    id: 15,
    name: "5 Dimension Antimatter Punch",
    description: "Buy a 5th Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    reward: "The 5th and higher Antimatter Dimensions are doubled.",
    effect: 2,
  },
  {
    id: 16,
    name: "We couldn't afford 9",
    get description() {
      return Enslaved.isRunning
        ? "Buy a 6th Antimatter Dimension (they never amount to anything)"
        : "Buy a 6th Antimatter Dimension.";
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    reward: "Multiply the 6th Antimatter Dimension by 9.",
    effect: 9,
  },
  {
    id: 17,
    name: "Not a luck related achievement",
    description: "Buy a 7th Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    reward: "Multiply the 7th Antimatter Dimension by 7.",
    effect: 7,
  },
  {
    id: 18,
    name: "90 degrees to infinity",
    get description() {
      return Enslaved.isRunning
        ? "Buy an 8th Antimatter Dimension (don't get used to it)"
        : "Buy an 8th Antimatter Dimension.";
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    reward: "Multiply all Antimatter Dimensions by 1.57.",
    effect: 1.57,
  },
  {
    id: 21,
    name: "To infinity!",
    description: "Go Infinite.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${formatInt(100)} antimatter.`; },
    effect: 100
  },
  {
    id: 22,
    name: "FAKE NEWS!",
    get description() { return `Encounter ${formatInt(50)} different news messages.`; },
    checkRequirement: () => NewsHandler.uniqueTickersSeen >= 50,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER
  },
  {
    id: 23,
    name: "The 9th Dimension is a lie",
    get description() { return `Have exactly ${formatInt(99)} 8th Antimatter Dimensions.`; },
    checkRequirement: () => AntimatterDimension(8).amount.eq(99),
    get reward() { return `8th Antimatter Dimensions are ${formatPercents(new Decimal(0.1))} stronger.`; },
    effect: 1.1
  },
  {
    id: 24,
    name: "Antimatter Apocalypse",
    get description() { return `Get over ${format(DC.E80)} antimatter.`; },
    checkRequirement: () => Currency.antimatter.gte(DC.E80),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 25,
    name: "Boosting to the max",
    get description() { return `Buy ${formatInt(10)} Dimension Boosts.`; },
    checkRequirement: () => DimBoost.purchasedBoosts.gte(10),
    checkEvent: GAME_EVENT.DIMBOOST_AFTER
  },
  {
    id: 26,
    name: "You got past The Big Wall",
    description: "Buy an Antimatter Galaxy.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 27,
    name: "Double Galaxy",
    get description() { return `Buy ${formatInt(2)} Antimatter Galaxies.`; },
    checkRequirement: () => player.galaxies.gte(2),
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER
  },
  {
    id: 28,
    name: "There's no point in doing that...",
    get description() {
      return `Buy a single 1st Antimatter Dimension when you have over ${format(DC.E150)} of them.`;
    },
    checkRequirement: () => AntimatterDimension(1).amount.gte(DC.E150),
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `1st Antimatter Dimensions are ${formatPercents(new Decimal(0.1))} stronger.`; },
    effect: 1.1
  },
  {
    id: 31,
    name: "I forgot to nerf that",
    get description() { return `Get any Antimatter Dimension multiplier over ${formatX(DC.E31)}.`; },
    checkRequirement: () => AntimatterDimensions.all.some(x => x.multiplier.gte(DC.E31)),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `1st Antimatter Dimensions are ${formatPercents(new Decimal(0.05))} stronger.`; },
    effect: 1.05
  },
  {
    id: 32,
    name: "The Gods are pleased",
    get description() { return `Get over ${formatX(600)} from Dimensional Sacrifice outside of Challenge 8.`; },
    checkRequirement: () => !NormalChallenge(8).isOnlyActiveChallenge && Sacrifice.totalBoost.gte(600),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    get reward() {
      return `Dimensional Sacrifice is stronger.
      ${Sacrifice.getSacrificeDescription({ "Achievement32": false, "Achievement57": false, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": false, "Achievement88": false })}`;
    },
    effect: () => (Hell.isInside ? 1 : 0.1),
  },
  {
    id: 33,
    name: "That's a lot of infinites",
    get description() { return `Reach Infinity ${formatInt(10)} times.`; },
    checkRequirement: () => Currency.infinities.gte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 34,
    name: "You didn't need it anyway",
    description: "Infinity without having any 8th Antimatter Dimensions.",
    checkRequirement: () => AntimatterDimension(8).totalAmount.eq(0),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return Hell.isInside ? `Dimensions 1-7 are ${formatX(2)} stronger.`
        : `Dimensions 1-7 are ${formatPercents(new Decimal(0.02))} stronger.`;
    },
    effect: () => (Hell.isInside ? 2 : 1.02)
  },
  {
    id: 35,
    name: "Don't you dare sleep",
    get description() {
      return PlayerProgress.realityUnlocked()
        ? `Be offline for a period of over ${formatInt(6)} hours (real time).`
        : `Be offline for a period of over ${formatInt(6)} hours.`;
    },
    checkRequirement: () => Date.now() - new Decimal(player.lastUpdate).toNumber() >= 21600000,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE
  },
  {
    id: 36,
    name: "Claustrophobic",
    get description() {
      return `Infinity with just ${formatInt(1)} Antimatter Galaxy. (Your Antimatter Galaxies are reset on Infinity.)`;
    },
    checkRequirement: () => player.galaxies.eq(1),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Multiply starting tick speed by ${format(1.02, 2, 2)}.`; },
    effect: 1 / 1.02
  },
  {
    id: 37,
    name: "That's FAST!",
    get description() { return `Infinity in under ${formatInt(2)} hours.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalHours.lte(2),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${formatInt(5000)} antimatter.`; },
    effect: 5000
  },
  {
    id: 38,
    name: "I don't believe in Gods",
    get description() {
      return `Buy an Antimatter Galaxy without Dimensional Sacrificing.
        (Your Antimatter Galaxies are reset on Infinity.)`;
    },
    checkRequirement: () => player.requirementChecks.infinity.noSacrifice,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 41,
    name: "No DLC required",
    get description() { return `Buy ${formatInt(16)} Infinity Upgrades.`; },
    checkRequirement: () => player.infinityUpgrades.size >= 16,
    checkEvent: [
      GAME_EVENT.INFINITY_UPGRADE_BOUGHT,
      GAME_EVENT.REALITY_RESET_AFTER,
      GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT
    ],
    get reward() {
      return `Unlock two new Infinity Upgrades- ${formatX(2)} IP multiplier and offline IP generation.`;
    },
  },
  {
    id: 42,
    name: "Super Sanic",
    get description() {
      return `Have antimatter per second exceed your current antimatter above ${format(DC.E63)}.`;
    },
    checkRequirement: () =>
      Currency.antimatter.gte(DC.E63) &&
      Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 43,
    name: "How the antitables have turned..",
    description:
      "Get the 8th Antimatter Dimension multiplier to be highest, 7th Antimatter Dimension multiplier " +
      " second highest, etc.",
    checkRequirement: () => {
      const multipliers = Array.range(1, 8).map(tier => AntimatterDimension(tier).multiplier);
      for (let i = 0; i < multipliers.length - 1; i++) {
        if (multipliers[i].gte(multipliers[i + 1])) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Each Antimatter Dimension gains a boost proportional to tier
      (8th gets ${formatPercents(new Decimal(0.08))}, 7th gets ${formatPercents(new Decimal(0.07))}, etc.)`;
    }
  },
  {
    id: 44,
    name: "Over in 30 Seconds",
    get description() {
      return `Have antimatter per second exceed your current antimatter
      for ${formatInt(30)} consecutive seconds.`;
    },
    checkRequirement: () => AchievementTimers.marathon1
      .check(Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value), 30),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 45,
    name: "Faster than a potato",
    get description() { return `Get more than ${format(DC.E29)} ticks per second.`; },
    checkRequirement: () => Tickspeed.current.lte(1e-26),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Multiply starting tickspeed by ${formatX(1.02, 0, 2)}.`; },
    effect: 0.98
  },
  {
    id: 46,
    name: "Multidimensional",
    get description() { return `Reach ${format(DC.E12)} of all Antimatter Dimensions except the 8th.`; },
    checkRequirement: () => AntimatterDimension(7).amount.gte(1e12),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 47,
    name: "Daredevil",
    get description() { return `Complete ${formatInt(3)} Normal Challenges.`; },
    checkRequirement: () => NormalChallenges.all.countWhere(c => c.isCompleted) >= 3,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 48,
    name: "Antichallenged",
    get description() { return `Complete all ${formatInt(12)} Normal Challenges.`; },
    checkRequirement: () => NormalChallenges.all.countWhere(c => !c.isCompleted) === 0,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    get reward() { return `All Dimensions are ${formatPercents(new Decimal(0.1))} stronger.`; },
    effect: 1.1
  },
  {
    id: 51,
    name: "Limit Break",
    description: "Break Infinity.",
    checkRequirement: () => player.break,
    checkEvent: [GAME_EVENT.BREAK_INFINITY, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 52,
    name: "Age of Automation",
    description: "Max the interval for Antimatter Dimension and Tickspeed upgrade autobuyers.",
    checkRequirement: () => Autobuyer.antimatterDimension.zeroIndexed.concat(Autobuyer.tickspeed)
      .every(a => a.isUnlocked && a.hasMaxedInterval),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 53,
    name: "Definitely not worth it",
    description: "Max the intervals for all normal autobuyers.",
    // The upgradeable autobuyers are dimensions, tickspeed, dimension boost,
    // galaxy, and big crunch (the ones you get from normal challenges).
    // We don't count autobuyers which can be upgraded via e.g. perks as upgradeable.
    checkRequirement: () => Autobuyers.upgradeable
      .every(a => a.isUnlocked && a.hasMaxedInterval),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 54,
    name: "That's FASTER!",
    get description() { return `Infinity in ${formatInt(10)} minutes or less.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes.lte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${format(5e5)} antimatter.`; },
    effect: 5e5
  },
  {
    id: 55,
    name: "Forever isn't that long",
    get description() { return `Infinity in ${formatInt(1)} minute or less.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes.lte(1),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${format(5e10)} antimatter.`; },
    effect: 5e10
  },
  {
    id: 56,
    name: "Many Deaths",
    get description() {
      return `Complete the 2nd Antimatter Dimension Autobuyer Challenge in ${formatInt(3)} minutes or less.`;
    },
    checkRequirement: () => NormalChallenge(2).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes.lte(3),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `All Antimatter Dimensions are stronger in the first ${formatInt(3)} minutes of Infinities.`;
    },
    effect: () => new Decimal(6).div(Time.thisInfinity.totalMinutes.add(3)).max(1),
    effectCondition: () => Time.thisInfinity.totalMinutes.lt(3),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 57,
    name: "Gift from the Gods",
    get description() {
      return `Complete the 8th Antimatter Dimension Autobuyer Challenge in ${formatInt(3)} minutes or less.`;
    },
    checkRequirement: () => NormalChallenge(8).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes.lte(3),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `Dimensional Sacrifice is stronger.
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": false, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": false })}`;
    },
    effect: 0.1
  },
  {
    id: 58,
    name: "This is fine.",
    get description() { return `Complete the Tickspeed Autobuyer Challenge in ${formatInt(3)} minutes or less.`; },
    checkRequirement: () => NormalChallenge(9).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes.lte(3),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `Increase the multiplier for buying ${formatInt(10)} Antimatter Dimensions by +${formatPercents(new Decimal(0.01))}.`;
    },
    effect: 1.01
  },
  {
    id: 61,
    name: "Bulked Up",
    get description() {
      return `Get all of your Antimatter Dimension Autobuyer bulk amounts to
        ${formatInt(Autobuyer.antimatterDimension.bulkCap)}.`;
    },
    checkRequirement: () => Autobuyer.antimatterDimension.zeroIndexed.every(x => x.hasMaxedBulk),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT,
      GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
    reward: "Dimension Autobuyer bulks are unlimited."
  },
  {
    id: 62,
    name: "Oh, hey... You're still here?",
    get description() { return `Reach ${format(DC.E8)} Infinity Points per minute.`; },
    checkRequirement: () => Player.bestRunIPPM.gte(1e8),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 63,
    name: "A new beginning",
    description: "Begin generation of Infinity Power.",
    checkRequirement: () => Currency.infinityPower.gt(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 64,
    name: "Zero Deaths",
    description: "Get to Infinity without Dimension Boosts or Antimatter Galaxies while in a Normal Challenge.",
    checkRequirement: () => player.galaxies.eq(0) && DimBoost.purchasedBoosts.eq(0) && NormalChallenge.isRunning,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Antimatter Dimensions 1-4 are ${formatPercents(new Decimal(0.25))} stronger.`; },
    effect: 1.25
  },
  {
    id: 65,
    name: "Not-so-challenging",
    get description() { return `Get the sum of all of your Normal Challenge times under ${formatInt(3)} minutes.`; },
    checkRequirement: () => Time.challengeSum.totalMinutes.lt(3),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    get reward() {
      return `All Antimatter Dimensions are stronger in the first ${formatInt(3)} minutes of Infinities,
      but only in Challenges.`;
    },
    effect: () => (Player.isInAnyChallenge ? Decimal.max(new Decimal(4).div(Time.thisInfinity.totalMinutes.add(1)), 1) : 1),
    effectCondition: () => Player.isInAnyChallenge && Time.thisInfinity.totalMinutes.lt(3),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 66,
    name: "Faster than a squared potato",
    get description() { return `Get more than ${format(DC.E58)} ticks per second.`; },
    checkRequirement: () => Tickspeed.current.lte(1e-55),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Multiply starting tickspeed by ${formatX(1.02, 0, 2)}.`; },
    effect: 0.98
  },
  {
    id: 67,
    name: "Infinitely Challenging",
    description: "Complete an Infinity Challenge.",
    checkRequirement: () => InfinityChallenges.completed.length > 0,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 68,
    name: "You did this again just for the achievement right?",
    get description() {
      return `Complete the 3rd Antimatter Dimension Autobuyer Challenge in ${formatInt(10)} seconds or less.`;
    },
    checkRequirement: () => NormalChallenge(3).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalSeconds.lte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return Hell.isInside ? `1st Antimatter Dimensions are ${formatX(5)} stronger.`
        : `1st Antimatter Dimensions are ${formatPercents(new Decimal(0.5))} stronger.`;
    },
    effect: () => (Hell.isInside ? 5 : 1.5)
  },
  {
    id: 71,
    name: "ERROR 909: Dimension not found",
    description:
      `Get to Infinity with only a single 1st Antimatter Dimension without Dimension Boosts
      or Antimatter Galaxies, while in the 2nd Antimatter Dimension Autobuyer Challenge.`,
    checkRequirement: () =>
      NormalChallenge(2).isOnlyActiveChallenge &&
      AntimatterDimension(1).amount.eq(1) &&
      DimBoost.purchasedBoosts.eq(0) &&
      player.galaxies.eq(0),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `1st Antimatter Dimensions are ${formatInt(Hell.isInside ? 909 : 3)} times stronger.`; },
    effect: () => (Hell.isInside ? 909 : 3)
  },
  {
    id: 72,
    name: "Can't hold all these infinities",
    get description() {
      return `Get all first ${formatInt(8)} Antimatter Dimension multipliers over ${formatX(DC.NUMMAX, 1)}.`;
    },
    checkRequirement: () => AntimatterDimensions.all
      .filter(dimension => dimension.tier <= 8)
      .every(dimension => dimension.multiplier.gte(DC.NUMMAX)),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return Hell.isInside ? `All Antimatter Dimensions are ${formatX(10)} stronger.`
        : `All Antimatter Dimensions are ${formatPercents(new Decimal(0.1))} stronger.`;
    },
    effect: () => (Hell.isInside ? 10 : 1.1)
  },
  {
    id: 73,
    name: "THIS ACHIEVEMENT DOESN'T EXIST",
    get description() { return `Get ${formatPostBreak(DC.D9_9999E9999, 4)} antimatter.`; },
    checkRequirement: () => Currency.antimatter.gte(DC.D9_9999E9999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Antimatter Dimensions gain a multiplier based on current antimatter.",
    effect: () => Currency.antimatter.value.pow(Hell.isInside ? 0.0001 : 0.00002).plus(1),
    cap: DC.EE35,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 74,
    name: "Not a second lost",
    get description() { return `Get the sum of all best Normal Challenge times under ${formatInt(5)} seconds.`; },
    checkRequirement: () => Time.challengeSum.totalSeconds.lt(5),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    get reward() {
      return Hell.isInside ? `All Antimatter Dimensions are ${formatX(40)} stronger, but only in challenges.`
        : `All Antimatter Dimensions are ${formatPercents(new Decimal(0.4))} stronger, but only in challenges.`;
    },
    effect: () => (Hell.isInside ? 40 : 1.4),
    effectCondition: () => Player.isInAnyChallenge
  },
  {
    id: 75,
    name: "NEW DIMENSIONS???",
    description: "Unlock the 4th Infinity Dimension.",
    checkRequirement: () => InfinityDimension(4).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Your Achievement bonus affects Infinity Dimensions.",
    effect: () => Achievements.power
  },
  {
    id: 76,
    name: "An hour for each dimension",
    get description() { return `Play for ${formatInt(8)} Hours. ${PlayerProgress.metaUnlocked() ? "(in this Meta)" : ""}`; },
    checkRequirement: () => Time.thisMetaTime.totalHours.gte(8),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => `Extremely small multiplier to Antimatter Dimensions based on ${PlayerProgress.metaUnlocked() ? "time played in this Meta" : "time played"} .`,
    effect: () => Decimal.max(Decimal.pow(Time.thisMetaTime.totalHours.div(2), Hell.isInside ? 0.1 : 0.05), 1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 77,
    name: "I have over 27 Million (infinity) power",
    get description() { return `Reach ${format(27e6)} Infinity Power.`; },
    checkRequirement: () => Currency.infinityPower.gt(27e6),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 78,
    name: "Blink of an eye",
    get description() { return `Infinity in under ${formatInt(250)}ms.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMilliseconds.lte(250),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `Start with ${format(5e25)} antimatter.`;
    },
    effect: 5e25
  },
  {
    id: 81,
    name: "Game Design Is My Passion",
    get description() { return `Beat Infinity Challenge 5 in ${formatInt(15)} seconds or less.`; },
    checkRequirement: () => InfinityChallenge(5).isRunning && Time.thisInfinityRealTime.totalSeconds.lte(15),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE
  },
  {
    id: 82,
    name: "Anti-antichallenged",
    get description() { return `Complete all ${formatInt(8)} Infinity Challenges.`; },
    checkRequirement: () => InfinityChallenges.completed.length === 8,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER],
  },
  {
    id: 83,
    name: "YOU CAN GET 50 GALAXIES?!?!",
    get description() { return `Get ${formatInt(50)} Antimatter Galaxies.`; },
    checkRequirement: () => player.galaxies.gte(50),
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return `Tickspeed is just over ${formatPercents(new Decimal(0.05))} faster per Antimatter Galaxy.`; },
    effect: () => DC.D0_95.pow(player.galaxies),
    formatEffect: value => `${formatX(value.recip(), 2, 2)}`
  },
  {
    id: 84,
    name: "I got a few to spare",
    get description() { return `Reach ${formatPostBreak("1e35000")} antimatter.`; },
    checkRequirement: () => Currency.antimatter.gte("1e35000"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Antimatter Dimensions are stronger the more unspent antimatter you have.",
    effect: () => Currency.antimatter.value.pow(Hell.isInside ? 0.0002 : 0.00002).plus(1),
    cap: DC.EE35,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 85,
    name: "ALL YOUR IP ARE BELONG TO US",
    get description() { return `Big Crunch for ${format(DC.E150)} Infinity Points.`; },
    checkRequirement: () => gainedInfinityPoints().gte(DC.E150),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Additional ${formatX(4)} multiplier to Infinity Points.`; },
    effect: 4
  },
  {
    id: 86,
    name: "Do you even bend time bro?",
    get description() { return `Reach ${formatX(1000)} faster per Tickspeed upgrade.`; },
    checkRequirement: () => Tickspeed.multiplier.recip().gte(1000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `All Galaxies are ${formatPercents(new Decimal(0.01))} stronger.`; },
    effect: 1.01
  },
  {
    id: 87,
    name: "2 MILLION INFINITIES",
    get description() { return `Infinity ${format(DC.D2E6)} times.`; },
    checkRequirement: () => Currency.infinities.gt(DC.D2E6),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Infinities more than ${formatInt(2)} seconds long
      give ${formatX(500)} more Infinities.`;
    },
    effect: 500,
    effectCondition: () => Time.thisInfinity.totalSeconds.gt(2)
  },
  {
    id: 88,
    name: "Yet another infinity reference",
    get description() {
      return `Get a ${formatX(DC.NUMMAX, 1, 0)} multiplier in a single Dimensional Sacrifice.`;
    },
    checkRequirement: () => Sacrifice.nextBoost.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_BEFORE,
    get reward() {
      return `Dimensional Sacrifice is stronger.
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": true })}`;
    },
    effect: 0.1
  },
  {
    id: 91,
    name: "Ludicrous Speed",
    get description() {
      return `Big Crunch for ${format(DC.E200)} Infinity Points in ${formatInt(2)} seconds or less.`;
    },
    checkRequirement: () => gainedInfinityPoints().gte(DC.E200) && Time.thisInfinityRealTime.totalSeconds.lte(2),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `All Antimatter Dimensions are significantly stronger in the
      first ${formatInt(5)} seconds of Infinities.`;
    },
    effect: () => Decimal.max((new Decimal(5).sub(Time.thisInfinity.totalSeconds)).times(60), 1),
    effectCondition: () => Time.thisInfinity.totalSeconds.lt(5),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 92,
    name: "I brake for NOBODY!",
    get description() {
      return `Big Crunch for ${format(DC.E250)} Infinity Points in ${formatInt(20)} seconds or less.`;
    },
    checkRequirement: () => gainedInfinityPoints().gte(DC.E250) && Time.thisInfinityRealTime.totalSeconds.lte(20),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `All Antimatter Dimensions are significantly stronger in the
      first ${formatInt(60)} seconds of Infinities.`;
    },
    effect: () => Decimal.max((DC.D1.sub(Time.thisInfinity.totalMinutes)).times(100), 1),
    effectCondition: () => Time.thisInfinity.totalMinutes.lt(1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 93,
    name: "MAXIMUM OVERDRIVE",
    get description() { return `Big Crunch for ${format(DC.E300)} Infinity Points.`; },
    checkRequirement: () => gainedInfinityPoints().gte(DC.E300),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Additional ${formatX(4)} multiplier to Infinity Points.`; },
    effect: 4
  },
  {
    id: 94,
    name: "4.3333 minutes of Infinity",
    get description() { return `Reach ${format(DC.E260)} Infinity Power.`; },
    checkRequirement: () => Currency.infinityPower.gte(DC.E260),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Double Infinity Power gain.",
    effect: 2
  },
  {
    id: 95,
    name: "Is this safe?",
    get description() { return `Gain ${format(DC.NUMMAX, 1, 0)} Replicanti in ${formatInt(1)} hour.`; },
    get reward() {
      return Hell.isInside
        ? `You keep your Replicanti and ${formatInt(1)} Replicanti Galaxy on Infinity, and Infinity Point gain is
          multiplied by your 8th Dimensions squared above ${formatInt(5000)}.`
        : `You keep your Replicanti and ${formatInt(1)} Replicanti Galaxy on Infinity.`;
    },
    checkRequirement: () =>
      (Replicanti.amount.eq(DC.NUMMAX) || player.replicanti.galaxies.gt()) &&
      Time.thisInfinityRealTime.totalHours.lte(1),
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 96,
    name: "Time is relative",
    description: "Go Eternal.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 97,
    name: "Like jumping on a lego",
    get description() { return `Get the sum of Infinity Challenge times under ${format(6.66, 2, 2)} seconds.`; },
    checkRequirement: () => Time.infinityChallengeSum.totalSeconds.lt(6.66),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
  },
  {
    id: 98,
    name: "0 degrees from Infinity",
    description: "Unlock the 8th Infinity Dimension.",
    checkRequirement: () => InfinityDimension(8).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 101,
    name: "8 nobody got time for that",
    description: "Eternity without buying Antimatter Dimensions 1-7.",
    checkRequirement: () => player.requirementChecks.eternity.onlyAD8,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 102,
    name: "This mile took an eternity",
    description: "Get all Eternity milestones.",
    checkRequirement: () => EternityMilestone.all.every(m => m.isReached),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 103,
    name: "Tätä saavutusta ei ole olemassa II",
    get description() { return `Reach ${formatPostBreak(DC.D9_99999E999, 5, 0)} Infinity Points.`; },
    checkRequirement: () => Currency.infinityPoints.gte(new Decimal("1e1000")),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Make the Infinity Point formula better. log(x)/${formatInt(308)} ➜ log(x)/${formatFloat(307.8, 1)}`;
    },
    effect: 307.8
  },
  {
    id: 104,
    name: "That wasn't an eternity",
    get description() { return `Eternity in under ${formatInt(30)} seconds.`; },
    checkRequirement: () => Time.thisEternity.totalSeconds.lte(30),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() { return `Start Eternities with ${format(5e25)} Infinity Points.`; },
    effect: 5e25
  },
  {
    id: 105,
    name: "Infinite Time",
    get description() { return `Have ${formatInt(308)} Tickspeed upgrades from Time Dimensions.`; },
    checkRequirement: () => player.totalTickGained.gte(308),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Time Dimensions gain a multiplier based on tickspeed.",
    effect: () => GameCache.tickspeedPerSecond.value.pow(0.000005),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 106,
    name: "The swarm",
    get description() { return `Get ${formatInt(10)} Replicanti Galaxies in ${formatInt(15)} seconds.`; },
    checkRequirement: () => Replicanti.galaxies.total.gte(10) && Time.thisInfinity.totalSeconds.lte(15),
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 107,
    name: "Do you really need a guide for this?",
    get description() { return `Eternity with less than ${formatInt(10)} Infinities.`; },
    checkRequirement: () => Currency.infinities.lt(10),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 108,
    name: "We COULD afford 9",
    get description() { return `Eternity with exactly ${formatInt(9)} Replicanti.`; },
    checkRequirement: () => Replicanti.amount.round().eq(9),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 111,
    name: "Yo dawg, I heard you liked infinities...",
    get description() {
      return `Have all your Infinities in your past ${formatInt(10)} Infinities be at least
      ${format(DC.NUMMAX, 1, 0)} times higher Infinity Points than the previous one.`;
    },
    checkRequirement: () => {
      if (player.records.recentInfinities.some(i => i[0] === Number.MAX_VALUE)) return false;
      const infinities = player.records.recentInfinities.map(run => run[3]);
      for (let i = 0; i < infinities.length - 1; i++) {
        if (infinities[i].lt(infinities[i + 1].times(DC.NUMMAX))) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    reward: "Your antimatter doesn't reset on Dimension Boosts or Antimatter Galaxies."
  },
  {
    id: 112,
    name: "Never again",
    get description() { return `Get the sum of Infinity Challenge times below ${formatInt(750)}ms.`; },
    checkRequirement: () => Time.infinityChallengeSum.totalMilliseconds.lt(750),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 113,
    name: "Eternities are the new infinity",
    get description() { return `Eternity in under ${formatInt(250)}ms.`; },
    checkRequirement: () => Time.thisEternity.totalMilliseconds.lte(250),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() { return `Gain ${formatX(2)} more Eternities.`; },
    effect: 2,
  },
  {
    id: 114,
    name: "You're a mistake",
    description: "Fail an Eternity Challenge.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.CHALLENGE_FAILED,
    reward: "A fading sense of accomplishment.",
    effect: () => "Sense of accomplishment (fading)"
  },
  {
    id: 115,
    name: "I wish I had gotten 7 eternities",
    description: "Start an Infinity Challenge inside an Eternity Challenge.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 116,
    name: "Do I really need to infinity",
    get description() { return `Eternity with only ${formatInt(1)} Infinity.`; },
    checkRequirement: () => Currency.infinities.lte(1),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    reward: "Multiplier to Infinity Points based on Infinities.",
    effect: () => Decimal.pow(Currency.infinitiesTotal.value.clampMin(1), LOG10_2 / 4).powEffectOf(TimeStudy(31)),
    cap: () => Effarig.eternityCap,
    formatEffect: value => {
      // Since TS31 is already accounted for in the effect prop, we need to "undo" it to display the base value here
      const mult = formatX(value, 2, 2);
      return TimeStudy(31).canBeApplied
        ? `${formatX(value.pow(1 / TimeStudy(31).effectValue), 2, 1)} (After TS31: ${mult})`
        : mult;
    }
  },
  {
    id: 117,
    name: "Costco sells Dimboosts now!",
    get description() { return `Bulk buy ${formatInt(750)} Dimension Boosts at once.`; },
    checkRequirement: ([bulk]) => bulk.gte(750),
    checkEvent: GAME_EVENT.DIMBOOST_AFTER,
    get reward() {
      return `The multiplier from Dimension Boosts to Antimatter Dimensions is ${formatPercents(new Decimal(0.01))} higher.`;
    },
    effect: 1.01
  },
  {
    id: 118,
    name: "IT'S OVER 9000",
    get description() { return `Get a total Dimensional Sacrifice multiplier of ${formatPostBreak(DC.E9000)}.`; },
    checkRequirement: () => Sacrifice.totalBoost.gte(DC.E9000),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    reward: `Dimensional Sacrifice doesn't reset your Antimatter Dimensions
      and the Autobuyer activates every tick if turned on.`,
  },
  {
    id: 121,
    name: "Can you get infinite IP?",
    get description() { return `Reach ${formatPostBreak("1e30008")} Infinity Points.`; },
    checkRequirement: () => Currency.infinityPoints.gte(new Decimal("1e30008")),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 122,
    name: "You're already dead.",
    description: "Eternity without buying Antimatter Dimensions 2-8.",
    checkRequirement: () => player.requirementChecks.eternity.onlyAD1,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 123,
    name: "5 more eternities until the update",
    get description() { return `Complete ${formatInt(50)} unique Eternity Challenge tiers.`; },
    checkRequirement: () => EternityChallenges.completions >= 50,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER
  },
  {
    id: 124,
    name: "Long lasting relationship",
    get description() {
      return `Have your Infinity Power per second exceed your Infinity Power
      for ${formatInt(60)} consecutive seconds during a single Infinity.`;
    },
    checkRequirement: () => AchievementTimers.marathon2
      .check(
        !EternityChallenge(7).isRunning &&
        InfinityDimension(1).productionPerSecond.gt(Currency.infinityPower.value),
        60
      ),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 125,
    name: "Like feasting on a behind",
    get description() {
      return `Reach ${format(DC.E90)} Infinity Points without having any Infinities
      or any 1st Antimatter Dimensions in your current Eternity.`;
    },
    checkRequirement: () => Currency.infinityPoints.value.max(1).log10().gte(90) &&
      player.requirementChecks.eternity.noAD1 && Currency.infinities.eq(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Infinity Point multiplier based on time spent this Infinity.",
    effect() {
      const thisInfinity = Time.thisInfinity.totalSeconds.times(10).add(1).max(1);
      return DC.D2.pow(Decimal.log(thisInfinity, Math.E).times(Decimal.min(Decimal.pow(thisInfinity, 0.11), 500)));
    },
    cap: () => Effarig.eternityCap,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 126,
    name: "Popular music",
    get description() { return `Have ${formatInt(180)} times more Replicanti Galaxies than Antimatter Galaxies.`; },
    checkRequirement: () => Replicanti.galaxies.total.gte(player.galaxies.times(180)) && player.galaxies.gt(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Replicanti Galaxies divide your Replicanti by ${format(DC.NUMMAX, 1, 0)}
      instead of resetting them to ${formatInt(1)}.`;
    },
  },
  {
    id: 127,
    name: "But I wanted another prestige layer...",
    get description() { return `Reach ${format(DC.NUMMAX, 1, 0)} Eternity Points.`; },
    checkRequirement: () => Currency.eternityPoints.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 128,
    name: "What do I have to do to get rid of you",
    get description() { return `Reach ${formatPostBreak("1e22000")} Infinity Points without any Time Studies.`; },
    checkRequirement: () => Currency.infinityPoints.gte("1e22000") && player.timestudy.studies.length === 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Time Dimensions are multiplied by the number of Time Studies you have.",
    effect: () => Math.max(player.timestudy.studies.length, 1),
    formatEffect: value => `${formatX(value)}`
  },
  {
    id: 131,
    name: "No ethical consumption",
    get description() { return `Get ${format(DC.D2E9)} Banked Infinities.`; },
    checkRequirement: () => Currency.infinitiesBanked.gt(DC.D2E9),
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
    get reward() {
      return `You gain ${formatX(2)} times more Infinities and
      after Eternity you permanently keep ${formatPercents(0.05)} of your Infinities as Banked Infinities.`;
    },
    effects: {
      infinitiesGain: 2,
      bankedInfinitiesGain: () => Currency.infinities.value.times(0.05).floor()
    }
  },
  {
    id: 132,
    name: "Unique snowflakes",
    get description() {
      return `Have ${formatInt(569)} Antimatter Galaxies without gaining any
        Replicanti Galaxies in your current Eternity.`;
    },
    checkRequirement: () => player.galaxies.gte(569) && player.requirementChecks.eternity.noRG,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: "Gain a multiplier to Tachyon Particle and Dilated Time gain based on Antimatter Galaxies.",
    effect: () => Decimal.max(Decimal.pow(player.galaxies, 0.04), 1).times(1.22),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 133,
    name: "I never liked this infinity stuff anyway",
    get description() {
      return `Reach ${formatPostBreak(DC.E200000)} Infinity Points without
      buying any Infinity Dimensions or the ${formatX(2)} Infinity Point multiplier.`;
    },
    checkRequirement: () =>
      Array.dimensionTiers.map(InfinityDimension).every(dim => dim.baseAmount.eq(0)) &&
      player.IPMultPurchases.eq(DC.D0) &&
      Currency.infinityPoints.gte(DC.E200000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "You start Eternities with all Infinity Challenges unlocked and completed."
  },
  {
    id: 134,
    name: "When will it be enough?",
    get description() { return `Reach ${formatPostBreak(DC.E18000)} Replicanti.`; },
    checkRequirement: () => Replicanti.amount.gte(DC.E18000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `You gain Replicanti ${formatInt(2)} times faster under ${format(replicantiCap(), 1)} Replicanti.`;
    }
  },
  {
    id: 135,
    name: "Faster than a potato^286078",
    get description() { return `Get more than ${formatPostBreak("1e8296262")} ticks per second.`; },
    checkRequirement: () => Tickspeed.current.lte("1e-8296262"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 136,
    name: "I told you already, time is relative",
    description: "Dilate time.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 137,
    name: "Now you're thinking with dilation!",
    get description() {
      return `Get ${formatPostBreak("1e260000")} antimatter
      in ${formatInt(1)} minute or less while Dilated.`;
    },
    checkRequirement: () =>
      Currency.antimatter.gte("1e26000") &&
      Time.thisEternity.totalMinutes.lte(1) &&
      player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Gain ${formatX(2)} Dilated Time and Time Theorems while Dilated.`; },
    effect: () => (player.dilation.active ? 2 : 1),
  },
  {
    id: 138,
    name: "This is what I have to do to get rid of you.",
    get description() {
      return `Reach ${formatPostBreak("1e26000")} Infinity Points without any Time Studies while Dilated.`;
    },
    checkRequirement: () =>
      player.timestudy.studies.length === 0 &&
      player.dilation.active &&
      Currency.infinityPoints.gte("1e26000"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Removes the downsides from Time Study 131 and 133 in the Active and Idle Time Study paths."
  },
  {
    id: 141,
    name: "Snap back to reality",
    description: "Make a new Reality.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() {
      return `${formatX(4)} Infinity Point gain, and increase the multiplier for buying ${formatInt(10)}
      Antimatter Dimensions by +${format(0.1, 0, 1)}.`;
    },
    effects: {
      ipGain: 4,
      buyTenMult: 0.1
    }
  },
  {
    id: 142,
    name: "How does this work?",
    description: "Unlock the automator.",
    checkRequirement: () => Player.automatorUnlocked,
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_BOUGHT, GAME_EVENT.PERK_BOUGHT,
      GAME_EVENT.BLACK_HOLE_UNLOCKED],
    get reward() { return `Dimension Boosts are ${formatPercents(new Decimal(0.5))} stronger.`; },
    effect: 1.5,
  },
  {
    id: 143,
    name: "Yo dawg, I heard you liked reskins...",
    get description() {
      return `Have all your Eternities in your past ${formatInt(10)} Eternities be at least
      ${format(DC.NUMMAX, 1, 0)} times higher Eternity Points than the previous one.`;
    },
    checkRequirement: () => {
      if (player.records.recentEternities.some(i => i[0] === Number.MAX_VALUE)) return false;
      const eternities = player.records.recentEternities.map(run => run[3]);
      for (let i = 0; i < eternities.length - 1; i++) {
        if (eternities[i].lt(eternities[i + 1].times(DC.NUMMAX))) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    reward: "Galaxies no longer reset Dimension Boosts."
  },
  {
    id: 144,
    name: "Is this an Interstellar reference?",
    description: "Unlock the Black Hole.",
    checkRequirement: () => BlackHole(1).isUnlocked,
    checkEvent: GAME_EVENT.BLACK_HOLE_UNLOCKED,
  },
  {
    id: 145,
    name: "Are you sure these are the right way around?",
    description: "Have either Black Hole interval smaller than its duration.",
    checkRequirement: () => BlackHoles.list.some(bh => bh.interval.lt(bh.duration)),
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    get reward() { return `Black Hole intervals are ${formatPercents(new Decimal(0.1))} shorter.`; },
    effect: 0.9
  },
  {
    id: 146,
    name: "Perks of living",
    description: "Have all Perks bought.",
    checkRequirement: () => player.reality.perks.size === Perks.all.length,
    checkEvent: GAME_EVENT.PERK_BOUGHT,
    get reward() { return `+${formatPercents(new Decimal(0.01))} Glyph rarity.`; },
    effect: 1
  },
  {
    id: 147,
    name: "Master of Reality",
    description: "Have all Reality upgrades bought.",
    checkRequirement: () => RealityUpgrades.allBought,
    checkEvent: GAME_EVENT.REALITY_UPGRADE_BOUGHT,
    reward: "Unlock Teresa, the Celestial of Reality."
  },
  {
    id: 148,
    name: "Royal flush",
    description: "Reality with one of each basic Glyph type.",
    checkRequirement: () => GlyphInfo.basicGlyphTypes
      .every(type => Glyphs.activeList.some(g => g.type === type)),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: "Gained Glyph level is increased by number of distinct Glyph types equipped.",
    effect: () => (new Set(Glyphs.activeWithoutCompanion.map(g => g.type))).size,
    formatEffect: value => `+${formatInt(value)}`
  },
  {
    id: 151,
    name: "You really didn't need it anyway",
    get description() {
      return `Get ${formatInt(800)} Antimatter Galaxies without
      buying 8th Antimatter Dimensions in your current Infinity.`;
    },
    checkRequirement: () => player.galaxies.gte(800) && player.requirementChecks.infinity.noAD8,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: "Unlock V, the Celestial of Achievements."
  },
  {
    id: 152,
    name: "Y'all got any more of them Glyphs?",
    get description() { return `Have ${formatInt(100)} Glyphs in your inventory.`; },
    checkRequirement: () => Glyphs.inventoryList.length >= 100,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 153,
    name: "More like \"reallydoesn'tmatter\"",
    description: "Reality without producing antimatter.",
    checkRequirement: () => player.requirementChecks.reality.noAM,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
  },
  {
    id: 154,
    name: "I am speed",
    get description() { return `Reality in under ${formatInt(5)} seconds (game time).`; },
    checkRequirement: () => Time.thisReality.totalSeconds.lte(5),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return `${formatPercents(new Decimal(0.1))} chance each Reality of ${formatX(2)} Realities and Perk Points.`; },
    effect: 0.1
  },
  {
    id: 155,
    name: "NOW THATS AN ETERNITY",
    get description() { return `Play for ${formatFloat(5, 1)} billion years. ${PlayerProgress.metaUnlocked() ? "(in this Meta)" : ""}`; },
    checkRequirement: () => Time.thisMetaTime.totalYears.gt(5e9),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Black Hole durations are ${formatPercents(new Decimal(0.1))} longer.`; },
    effect: 1.1
  },
  {
    id: 156,
    name: "College Dropout",
    description: "Reality without buying Time Theorems.",
    checkRequirement: () => player.requirementChecks.reality.noPurchasedTT,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return `Gain ${formatX(2.5, 0, 1)} generated Time Theorems, and a free coupon to McDonalds™️.`; },
    effect: 2.5
  },
  {
    id: 157,
    name: "It's super effective!",
    get description() { return `Get a Glyph with ${formatInt(4)} effects.`; },
    checkRequirement: () => Glyphs.activeList.concat(Glyphs.inventoryList).map(
      glyph => glyph.effects.length).max().gte(4),
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 158,
    name: "Bruh, are you like, inside the hole?",
    description: "Make both Black Holes permanent.",
    checkRequirement: () => BlackHole(1).isPermanent && BlackHole(2).isPermanent,
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    get reward() { return `Black Hole power increased by ${formatPercents(new Decimal(0.1))}.`; },
    effect: 1.1
  },
  {
    id: 161,
    name: "that's where you're wrong kiddo",
    get description() { return `Get ${formatPostBreak(DC.E1E8)} antimatter while Dilated.`; },
    checkRequirement: () => Currency.antimatter.gte(DC.E1E8) && player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 162,
    name: "Reinstalled the game and rejoined the server",
    description: "Have every Time Study at once.",
    checkRequirement: () => player.timestudy.studies.length >= 58,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 163,
    name: "Actually, super easy! Barely an inconvenience!",
    get description() {
      return `Complete all the Eternity Challenges ${formatInt(5)} times with less than ${formatInt(1)}
      second (game time) in your current Reality.`;
    },
    checkRequirement: () => EternityChallenges.all.map(ec => ec.completions).min().gte(5) &&
      Time.thisReality.totalSeconds.lte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 164,
    name: "Infinity times two",
    get description() { return `Get ${format(DC.NUMMAX, 1)} Infinities.`; },
    checkRequirement: () => Currency.infinitiesTotal.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Gain ×${formatInt(1024)} more Infinities.`; },
    effect: 1024
  },
  {
    id: 165,
    name: "Perfectly balanced",
    get description() { return `Get a level ${formatInt(5000)} Glyph with all Glyph level factors equally weighted.`; },
    checkRequirement: () => gainedGlyphLevel().actualLevel.gte(5000) &&
      ["repl", "dt", "eternities"].every(
        i => player.celestials.effarig.glyphWeights[i] === player.celestials.effarig.glyphWeights.ep),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: "Unlock optimal automatic Glyph level factor adjustment."
  },
  {
    id: 166,
    name: "Nicenice.",
    get description() { return `Get a Glyph with level exactly ${formatInt(6969)} or over ${format(1e6)}`; },
    checkRequirement: () => gainedGlyphLevel().actualLevel.eq(6969) || gainedGlyphLevel().actualLevel.gte(1e6),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return `+${formatInt(69)} to Glyph level.`; },
    effect: 69
  },
  {
    id: 167,
    name: "Mr. Layer? Sorry, you're not on the list",
    get description() { return `Reach ${format(DC.NUMMAX, 1, 0)} Reality Machines.`; },
    checkRequirement: () => Currency.realityMachines.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Gain more Reality Machines based on your current Reality Machines.",
    effect: () => Decimal.clampMin(1, Currency.realityMachines.value.max(1).log2()),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 168,
    name: "Woah, we're halfway there",
    get description() { return `Get ${formatInt(50)} total Ra Celestial Memory levels.`; },
    checkRequirement: () => Ra.totalPetLevel >= 50,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Get ${formatPercents(new Decimal(0.5))} more memories.`; },
    effect: 1.5
  },
  {
    id: 171,
    name: "The god is delighted",
    description: "Sacrifice every sacrificable Glyph type at least once.",
    checkRequirement: () => Object.values(player.reality.glyphs.sac).filter(s => s.gt(0)).length > 6,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED,
    get reward() { return `Glyph sacrifice is ${formatX(2)} stronger.`; },
    effect: 2,
  },
  {
    id: 172,
    name: "Hitchhiker's Guide to Reality",
    get description() {
      return `Reality for ${format(DC.NUMMAX, 1)} Reality Machines without having
      any Charged Infinity Upgrades, having any equipped Glyphs, or buying any Triad Studies.`;
    },
    checkRequirement: () => MachineHandler.gainedRealityMachines.gte(Decimal.NUMBER_MAX_VALUE) &&
      player.celestials.ra.charged.size === 0 && Glyphs.activeWithoutCompanion.length === 0 &&
      player.requirementChecks.reality.noTriads,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
  },
  {
    id: 173,
    name: "Cet accomplissement n'existe pas III",
    get description() { return `Reach ${formatPostBreak(DC.D9_99999E999, 5, 0)} Reality Machines.`; },
    checkRequirement: () => player.reality.realityMachines.gte(DC.D9_99999E999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 174,
    name: "Don't you already have two of these?",
    description: "Get a Singularity.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.SINGULARITY_RESET_BEFORE
  },
  {
    id: 175,
    name: "The First Antihistorian",
    get description() { return `Get ${formatInt(25000)} of all Alchemy Resources.`; },
    checkRequirement: () => AlchemyResources.all.every(x => x.over25K),
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    get reward() {
      return `Synergism can go above ${formatPercents(new Decimal(1))} and Momentum increases ${formatX(10)} faster.`;
    },
    effect: 10,
  },
  {
    id: 176,
    name: "Mom counted to 3",
    description: "Annihilate your Dark Matter Dimensions.",
  },
  {
    id: 177,
    name: "This mile took a celestial",
    description: "Complete all Singularity Milestones in the first six rows at least once.",
    checkRequirement: () => SingularityMilestone.tesseractMultFromSingularities.completions.gt(0),
    checkEvent: GAME_EVENT.SINGULARITY_RESET_AFTER,
  },
  {
    id: 178,
    name: "Destroyer of Worlds",
    get description() { return `Get ${formatInt(100000)} Antimatter Galaxies.`; },
    checkRequirement: () => player.galaxies.gte(100000),
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return `All Galaxies are ${formatPercents(new Decimal(0.01))} stronger.`; },
    effect: 1.01
  },
  {
    id: 181,
    displayId: 666,
    name: "Antimatter Dimensions Eternal",
    description: "Doom your Reality.",
    checkRequirement: () => Pelle.isDoomed,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
  },
  {
    id: 182,
    name: "One more time",
    description: "Permanently gain back all Antimatter Dimension autobuyers.",
    checkRequirement: () => PelleUpgrade.antimatterDimAutobuyers1.canBeApplied &&
      PelleUpgrade.antimatterDimAutobuyers2.canBeApplied,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 183,
    name: "Déjà vOoM",
    description: "Complete Infinity Challenge 5 while Doomed.",
    checkRequirement: () => Pelle.isDoomed && InfinityChallenge(5).isCompleted,
    checkEvent: GAME_EVENT.INFINITY_CHALLENGE_COMPLETED,
    // Weirdly specific reward? Yes, its V's ST bonus because we forgot to disable it
    // when balancing Pelle and only realised too late.
    get reward() { return `All Antimatter Dimensions are raised to ${formatPow(1.0812403840463596, 0, 3)}`; },
    effect: 1.0812403840463596
  },
  {
    id: 184,
    name: "You're out!",
    description: "Encounter the third Pelle Strike.",
    checkRequirement: () => PelleStrikes.eternity.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED
  },
  {
    id: 185,
    name: "Four score and seven years ago",
    description: "Encounter the fourth Pelle Strike.",
    checkRequirement: () => PelleStrikes.ECs.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED
  },
  {
    id: 186,
    displayId: 181,
    name: "An unhealthy obsession",
    description: `Purchase Time Study 181 while Doomed.`,
  },
  {
    id: 187,
    name: "The One with Dilated Time",
    description: "Unlock Dilation while Doomed.",
    checkRequirement: () => PelleStrikes.dilation.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED,
    // We forgot to disable a singularity milestone while balancing Pelle; now it's disabled
    // and this upgrade has the same effect as it used to.
    get reward() {
      return `Increase the multiplier per repeatable Dilated Time
      multiplier upgrade by ${formatX(1.35, 0, 2)}.`;
    },
    effect: 1.35
  },
  {
    id: 188,
    name: "Can you fix the broken?",
    get description() { return `Reach ${formatPostBreak("ee100", 2)} Antimatter in a Doomed Reality.`; },
    checkRequirement: () => Currency.antimatter.value.gte("ee100") && Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 191,
    name: "I Think Something Is Broken",
    get description() { return `Start producing Chaos Cores`; },
    checkRequirement: () => Currency.chaosCores.gt(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 192,
    name: "A Blessing From The Lord",
    displayId: 777,
    get description() { return `Get a ${format("1e600")} Sacrifice multiplier from Teresa's Reality`; },
    checkRequirement: () => Teresa.runRewardMultiplier.gte("1e600"),
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    get reward() {
      return `Uncap Glyph Sacrifice and Glyph Rarity`;
    },
  },
  {
    id: 193,
    name: "Geting Extreme",
    get description() { return `Start V's Extreme reality`; },
    checkRequirement: () => V.isRunningExtreme,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 194,
    name: "Finally, I Can Get The Glitch Glyph",
    get description() { return `Create A Glitch Glyph`; },
  },
  {
    id: 195,
    name: "Wait there's no hard cap?",
    get description() { return `Reach ${format("ee50")} Antimatter outside a Doomed Reality`; },
    checkRequirement: () => Currency.antimatter.gte("ee50") && !Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 196,
    name: "Oh-oh, Livin' On A Prayer",
    get description() { return `Complete Revengeance twice`; },
    checkRequirement: () => player.celestials.v.runUnlocks[10] > 1,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 197,
    name: "I Think I'm Softlocked",
    get description() { return `Reset your EX-V Achievements`; },
  },
  {
    id: 198,
    name: "This Is Geting Meta",
    description: `Escape the confinements of the multiverse`,
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.META_RESET_AFTER,
  },
  {
    id: 201,
    name: "Again?",
    description: `Finish EX-V again?`,
    checkRequirement: () => player.celestials.v.runUnlocks[10] >= 4 && Currency.metas.gt(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 202,
    name: "No More Milestones",
    description: `meta 5 times`,
    checkRequirement: () => Currency.metas.gte(5),
    checkEvent: GAME_EVENT.META_RESET_AFTER,
  },
  {
    id: 203,
    name: "Speedruning",
    description: `get Meta Milestone 8`,
    checkRequirement: () => Time.bestMetaRealTime.totalMinutes.lte(5),
    checkEvent: GAME_EVENT.META_RESET_AFTER,
  },
  {
    id: 204,
    name: "You Can Stop Grinding Now",
    get description() { return `Meta ${format(1000)} times`; },
    checkRequirement: () => Currency.metas.gte(1000),
    reward: "You get a meta autobuyer",
    checkEvent: GAME_EVENT.META_RESET_AFTER,
  },
  {
    id: 205,
    name: "There's No Stoping You",
    get description() { return `Meta with only ${format(1)} first Antimatter Dimension`; },
    checkRequirement: () => AntimatterDimension(1).amount.eq(1),
    checkEvent: GAME_EVENT.META_RESET_BEFORE,
    get reward() {
      return `The first Antimater Dimension gain a power based on MR`;
    },
    effect: () => Currency.metaRelays.value.div(1e15).add(10).log10(),
    formatEffect: value => `${formatPow(value, 2, 2)}`
  },
  {
    id: 206,
    name: "We don't need more memories",
    get description() { return `Unlock new memories`; },
    checkRequirement: () => MetaFabricatorUpgrade(25).isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 207,
    name: "Get Replicated",
    get description() { return `Unlock Cante`; },
    checkRequirement: () => Ra.unlocks.canteUnlock.isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 208,
    name: "Is this real?",
    get description() { return `Get Artificial Matter`; },
    checkRequirement: () => Currency.artificialMatter.gt(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 211,
    name: "Things are getting Chaotic",
    get description() { return `Gain Chaotic Matter`; },
    checkRequirement: () => Currency.chaosMatter.gt(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 212,
    name: "Null and Void",
    get description() { return `Unlock Null`; },
    checkRequirement: () => Ra.unlocks.nullUnlock.isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 213,
    name: "Things are getting Corrupt",
    get description() { return `Gain Corrupt Matter`; },
    checkRequirement: () => Currency.corruptMatter.gt(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 214,
    name: "IT WILL NEVER BE ENOUGH.",
    get description() { return `Reach ${formatPostBreak("e1e10")} Replicanti.`; },
    checkRequirement: () => player.replicanti.amount.gte("e1e10"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(214).isUnlocked ? DC.D1 : Decimal.clamp(Replicanti.amount.add(1).log10().div(1e10), 0, 1))
  },
  {
    id: 215,
    name: "Domain Error",
    get description() { return `Reach ${format(DC.NUMMAX, 1, 0)} Celestial Points.`; },
    checkRequirement: () => Currency.celestialPoints.value.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(215).isUnlocked ? DC.D1 : Decimal.clamp(Currency.celestialPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 216,
    name: "Este logro no existe IV",
    get description() { return `Reach ${formatPostBreak(DC.D9_99999E999, 5, 0)} Imaginary Machines.`; },
    checkRequirement: () => player.reality.imaginaryMachines.gte(DC.D9_99999E999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Gain a small multiplier to Ethereal Power based on Imaginary Machines.`;
    },
    effect: () => (player.disablePostReality ? DC.D1 : Decimal.pow(Decimal.log10(player.reality.imaginaryMachines.add(1)).div(1000), 5).times(1000)),
    formatEffect: value => `${formatX(value, 3)}`,
    progress: () => (Achievement(216).isUnlocked ? DC.D1 : Decimal.clamp(Currency.imaginaryMachines.value.add(1).log10().div(1000), 0, 1))
  },
  {
    id: 217,
    name: "Why are we still here...",
    get description() { return `Reach ${format(1e12, 2, 2)} Endgames.`; },
    checkRequirement: () => player.endgames.gte(1e12),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Start Endgames with ${format(1e24, 2, 2)} filled Reality Machines`;
    },
    effect: () => (player.disablePostReality ? DC.D0 : Decimal.pow10(24)),
    progress: () => (Achievement(217).isUnlocked ? DC.D1 : Decimal.clamp(player.endgames.div(1e12), 0, 1))
  },
  {
    id: 218,
    name: "...just to suffer?",
    get description() { return `Reach ${formatPostBreak("ee50", 2)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} inside The Nameless Ones' Reality.`; },
    checkRequirement: () => Currency.antimatter.value.gte("ee50") && Enslaved.isRunning,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Keep V progression on Endgame.`;
    },
    progress: () => (Achievement(218).isUnlocked ? DC.D1 : (!Enslaved.isRunning ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().add(1).log10().div(50), 0, 1)))
  },
  {
    id: 221,
    name: "Light",
    get description() { return "Defeat Alpha."; },
    checkRequirement: () => Alpha.isRunning,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() {
      return "Unlock Celestial Dimension Expansion.";
    },
    progress: () => (Achievement(221).isUnlocked ? DC.D1 : (!Alpha.isRunning ? DC.DM1 : Decimal.clamp(Currency.eternityPoints.value.add(1).log10().div(4000), 0, 1)))
  },
  {
    id: 222,
    name: "Time is absolute",
    get description() {
      return `Have more Tachyon Particles than Dilated Time, with both exceeding ${format("1e5000", 2)}, ` +
        `or have Tachyon Particles exceed ${format("ee6", 2)} and Dilated Time exceed ${format("ee15", 2)}.`;
    },
    checkRequirement: () => (Currency.tachyonParticles.value.gt(Currency.dilatedTime.value) &&
      Currency.dilatedTime.value.gt("1e5000")) ||
      (Currency.tachyonParticles.value.gt("ee6") && Currency.dilatedTime.value.gt("ee15")),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Momentum increases ${formatX(10)} faster.`;
    },
    effect: () => (player.disablePostReality ? 1 : 10),
    progress: () => {
      if (Achievement(222).isUnlocked) return DC.D1;
      const existingProgress = Decimal.clamp(Currency.dilatedTime.value.add(1).log10().div(10000).min(0.5)
        .add(Currency.dilatedTime.value.lte("1e5000") ? DC.D0 : Currency.tachyonParticles.value.add(1).log10()
          .div(Currency.dilatedTime.value.add(1).log10().times(2)).min(0.5)), 0, 1);
      const alternativeProgress = Decimal.clamp(Decimal.min(
        Currency.tachyonParticles.value.add(1).log10().div(Decimal.log10("ee6")),
        Currency.dilatedTime.value.add(1).log10().div(Decimal.log10("ee15"))), 0, 1);
      return Decimal.max(existingProgress, alternativeProgress);
    }
  },
  {
    id: 223,
    name: "Power! Unlimited Power!",
    get description() { return `Have your Infinity Dimension purchase cap exceed ${format(DC.NUMMAX, 1, 0)}.`; },
    checkRequirement: () => InfinityDimensions.totalDimCap.gt(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Charged Upgrades will automatically recharge upon exiting a challenge that disabled them if you are able to charge every upgrade in their respective set.`;
    },
    progress: () => (Achievement(223).isUnlocked ? DC.D1 : Decimal.clamp(InfinityDimensions.totalDimCap.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 224,
    name: "Destroyer of Universes",
    get description() { return `Reach ${formatPostBreak(Decimal.pow10(1e100), 2)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} outside Pelle.`; },
    checkRequirement: () => Currency.antimatter.value.gte(Decimal.pow10(1e100)) && !Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Double the Celestial Matter Conversion Exponent.`;
    },
    effect: () => (player.disablePostReality ? 1 : 2),
    progress: () => (Achievement(224).isUnlocked ? DC.D1 : (Pelle.isDoomed ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().add(1).log10().div(100), 0, 1)))
  },
  {
    id: 225,
    name: "299792458m/s",
    description: "Uncap Celestial Matter.",
    checkRequirement: () => player.endgame.celDimExpansion.isBroken,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Reduce the Celestial Matter softcap magnitude by ${formatPercents(0.05)}.`;
    },
    effect: () => (player.disablePostReality ? 1 : 0.95),
    progress: () => (Achievement(225).isUnlocked ? DC.D1 : Decimal.clamp(player.endgame.celDimExpansion.celestialInfinityPoints.div(10000), 0, 1))
  },
  {
    id: 226,
    name: "Thirty thousand degrees",
    description: "Unlock Stars.",
    checkRequirement: () => player.endgame.ethereal.isExtended,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(226).isUnlocked ? DC.D1 : Decimal.clamp(player.endgame.ethereal.power.add(1).log10().div(25), 0, 1))
  },
  {
    id: 227,
    name: "How do these work???",
    description: "Obtain a Penteract.",
    checkRequirement: () => player.endgame.hypercubes.penteracts >= 1,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Unlock Effarig's second shop.`;
    },
    progress: () => (Achievement(227).isUnlocked ? DC.D1 : Decimal.clamp((DualityUpgrade(25).isBought ? new Decimal(0.75) : new Decimal(player.celestials.laitela.hadrons.dark).div(128).min(0.25).add(Hadrons.timeFactor.div(2000).min(0.25)).add(Currency.dualMachines.value.add(1).log10().div(80).min(0.25))).add(Currency.eternityPoints.value.add(1).log10().add(1).log10().div(420).min(0.25)), 0, 1))
  },
  {
    id: 228,
    name: "Look how far we've come",
    get description() { return `Reach ${formatPostBreak(DC.ENUMMAX, 2)} ${player.universes.current === 2 ? "Matter" : "Antimatter"}.`; },
    checkRequirement: () => player.antimatter.gte(DC.ENUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Unlock Divinity.`;
    },
    progress: () => (Achievement(228).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.add(1).log10().add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 231,
    name: "Grandmastery",
    get description() { return `Purchase ${formatInt(1000)} Endgame Skills.`; },
    checkRequirement: () => EndgameSkills.totalPurchased().gte(1000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Dilate ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Multipliers based on purchased Endgame Skills, which is stronger in Pelle.`;
    },
    effect: () => {
      if (player.disablePostReality) return DC.D1;
      const skills = EndgameSkills.totalPurchased();
      return Decimal.min(skills, 2000)
        .plus(Decimal.max(skills.div(2000).log2(), 0).times(1000))
        .div(Pelle.isDoomed ? 20000 : 100000)
        .plus(1);
    },
    formatEffect: value => `${formatPow(value, 2, 3)}`,
    progress: () => (Achievement(231).isUnlocked ? DC.D1 : Decimal.clamp(EndgameSkills.totalPurchased().div(1000), 0, 1))
  },
  {
    id: 232,
    name: "Millenium of peace",
    get description() { return `Obtain ${formatInt(1000)} Free Tesseracts.`; },
    checkRequirement: () => new Decimal(Tesseracts.extra).times(Tesseracts.totalMult).gte(1000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Gain a small power to Eternity Points based on Penteracts.`;
    },
    effect: () => (player.disablePostReality ? 1 : Decimal.log10(Penteracts.effectiveCount + 1).div(10).add(1).toNumber()),
    formatEffect: value => `${formatPow(value, 2, 3)}`,
    progress: () => (Achievement(232).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Tesseracts.extra).times(Tesseracts.totalMult).div(1000), 0, 1))
  },
  {
    id: 233,
    name: "End of an era",
    description: "Purchase all the Break Eternity Upgrades.",
    checkRequirement: () => BreakEternityUpgrade.all.filter(u => u.isCapped).length === 10 &&
      BreakEternityUpgrade.all.filter(u => u.isBought).length === 5,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Raise the ${player.universes.current === 2 ? "Matter" : "Antimatter"} Exponent to the power of ${format(1.4, 2, 1)}, but only inside Pelle.`;
    },
    effect: () => (player.disablePostReality || !Pelle.isDoomed ? 1 : 1.4),
    progress: () => (Achievement(233).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(BreakEternityUpgrade.all.filter(u => u.isCapped).length + BreakEternityUpgrade.all.filter(u => u.isBought).length).div(15), 0, 1))
  },
  {
    id: 234,
    name: "The One with Celestial Time",
    description: "Perform a Celestial Eternity.",
    checkRequirement: () => player.endgame.celDimExpansion.celestialEternities.gt(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(234).isUnlocked ? DC.D1 : Decimal.clamp(player.endgame.celDimExpansion.celestialInfinityPoints.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 235,
    name: "Never-ending Darkness",
    get description() { return `Hadronize Lai'tela's Reality ${formatInt(50)} times.`; },
    checkRequirement: () => Laitela.hadronizes >= 50,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `The time for Hadron effects to cap is halved.`;
    },
    effect: () => (player.disablePostReality ? 1 : 2),
    progress: () => (Achievement(235).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Laitela.hadronizes).div(50), 0, 1))
  },
  {
    id: 236,
    name: "Supernova",
    get description() { return `Get ${formatInt(500)} total Ra Celestial Memory levels.`; },
    checkRequirement: () => Ra.totalPetLevel >= 500,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Get ${formatX(500)} more memories.`; },
    effect: () => (player.disablePostReality ? 1 : 500),
    progress: () => (Achievement(236).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Ra.totalPetLevel).div(500), 0, 1))
  },
  {
    id: 237,
    name: "Equilibrium",
    description: "Have the first two Resurgence Upgrades bought.",
    checkRequirement: () => ResurgenceUpgrade.ipSurge.isBought && ResurgenceUpgrade.epSurge.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(237).isUnlocked ? DC.D1 : Decimal.clamp(Currency.divineEnergy.value.div(1e6), 0, 1))
  },
  {
    id: 238,
    name: "Age of Creation",
    description: "Unlock Hadron Continuum.",
    checkRequirement: () => DivinityMilestone.hadronEmpowerment.isReached,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(238).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.celestials.pelle.divinities).div(3), 0, 1))
  },
  {
    id: 241,
    name: "CERN",
    description: "Unlock the Large Hadron Collider.",
    checkRequirement: () => ExpansionPack.alphaPack.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(241).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(10).log10().log10().div(200), 0, 1))
  },
  {
    id: 242,
    name: "Infinity Mach III",
    description: "Condense your Divine Stars.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.CONDENSE_RESET_BEFORE,
    progress: () => (Achievement(242).isUnlocked ? DC.D1 : Decimal.clamp(Currency.divineMatter.value.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 243,
    name: "Journey's End",
    description: "Unlock Celestial Eternity Plus.",
    checkRequirement: () => Currency.celestialEternityPoints.gte(DC.E1000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(243).isUnlocked ? DC.D1 : Decimal.clamp(Currency.celestialEternityPoints.value.max(1).log10().div(1000), 0, 1))
  },
  {
    id: 244,
    name: "Hypernova",
    description: "Unlock all star types.",
    checkRequirement: () => EtherealStars.gray.isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(244).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(EtherealStars.all.filter(s => s.isUnlocked).length).div(9), 0, 1))
  },
  {
    id: 245,
    name: "Aleph Null",
    description: "Nullify the Void.",
    checkRequirement: () => player.endgame.largeHadronCollider.void.nullified,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(245).isUnlocked ? DC.D1 : Decimal.clamp(Currency.nullMatter.value.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 246,
    name: "Hyperthymesia",
    get description() { return `Get ${formatInt(1000)} total Ra Celestial Memory levels.`; },
    checkRequirement: () => Ra.totalPetLevel >= 1000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Keep Glyph Sacrifice on Endgame.`;
    },
    progress: () => (Achievement(246).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Ra.totalPetLevel).div(1000), 0, 1))
  },
  {
    id: 247,
    name: "Core Collapse",
    description: "Go Supernova.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.SUPERNOVA_RESET_BEFORE,
    get reward() {
      return `Reduce the time for Hadrons and Remnants of Alpha Decay to cap by ${formatPercents(0.5)}.`;
    },
    effect: () => (player.disablePostReality ? 1 : 2),
    progress: () => (Achievement(247).isUnlocked ? DC.D1 : Decimal.clamp(Currency.divineStars.value.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 248,
    name: "Limits of Reality",
    get description() { return `Reach ${formatPostBreak(DC.E4000, 2)} Celestial Points of Eternity.`; },
    checkRequirement: () => player.endgame.celDimExpansion.celestialEternityPoints.gte(DC.E4000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(248).isUnlocked ? DC.D1 : Decimal.clamp(player.endgame.celDimExpansion.celestialEternityPoints.add(1).log10().div(4000), 0, 1))
  },
  {
    id: 251,
    name: "Eternal Bondage",
    description: "Curse your Reality.",
    checkRequirement: () => Slabdrill.isCursed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(251).isUnlocked ? DC.D1 : Decimal.clamp(player.endgame.celDimExpansion.celestialEternityPoints.add(1).log10().div(4000), 0, 1))
  },
  {
    id: 252,
    name: "Broken Simulation",
    description: "Perform your first Dimboost in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.dimensionBoosts.gte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(252).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().div(12), 0, 1)))
  },
  {
    id: 253,
    name: "Cosmic Chains",
    description: "Create your first Galaxy in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.galaxies.gte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(253).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().div(130), 0, 1)))
  },
  {
    id: 254,
    name: "Altered Overload",
    description: "Reach Infinity in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.infinities.gte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(254).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)))
  },
  {
    id: 255,
    name: "Breaking Destruction",
    description: "Break Infinity in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.break && !Slabdrill.coreActive,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(255).isUnlocked ? DC.D1 : (!Slabdrill.isCursed || Slabdrill.coreActive ? DC.DM1 : Decimal.clamp(Decimal.log2(1500).sub(new Decimal(player.auto.bigCrunch.interval).div(100).log2()).div(Decimal.log2(1500)), 0, 1)))
  },
  {
    id: 256,
    name: "Eternal Slavery",
    description: "Reach Eternity in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.eternities.gte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(256).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(player.infinityPoints.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)))
  },
  {
    id: 257,
    name: "Amplified Suffering",
    description: "Dilate Time in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(257).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(new Decimal(EternityChallenge(11).completions).div(20).min(0.25).add(new Decimal(EternityChallenge(12).completions).div(20).min(0.25)).add(player.timestudy.maxTheorem.div(51600).min(0.25)).add(player.timestudy.theorem.div(20000).min(0.25)), 0, 1)))
  },
  {
    id: 258,
    name: "Hevipelle Counted to Nine",
    description: "Destroy Slabdrill.",
    checkRequirement: () => Slabdrill.isCursed && player.antimatter.gte(DC.ENUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Unlock the Ninth Dimension.",
    progress() {
      if (Achievement(258).isUnlocked) return DC.D1;
      if (Slabdrill.isCursed) {
        return Decimal.clamp(player.antimatter.add(1).log10().add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1);
      }
      return DC.DM1;
    }
  },
  {
    id: 261,
    name: ["False", "Deity", "Monarch"],
    description: "Become a Celestial.",
    checkRequirement: () => player.celestials.slabdrill.hasBoughtNinthDimension &&
      player.endgame.creditsTick > 0 && !player.endgame.credits,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Gain ${formatX(10)} more Condenses.`; },
    effect: () => (player.disablePostReality ? 1 : 10),
    progress() {
      if (Achievement(261).isUnlocked) return DC.D1;
      if (Slabdrill.isCursed) {
        return Decimal.clamp(player.antimatter.add(1).log10().add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1);
      }
      return DC.DM1;
    }
  },
  {
    id: 262,
    name: "The End is where we Begin",
    description: "Uncap Divine Matter.",
    checkRequirement: () => DivinityUpgrade.divineL4U5.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(262).isUnlocked ? DC.D1 : Decimal.clamp(player.celestials.pelle.divinity.nebulae.div(100), 0, 1))
  },
  {
    id: 263,
    name: "Our Prestige Layer is in another castle!",
    get description() { return `Reach ${format(DC.NUMMAX, 1, 0)} Dual Machines.`; },
    checkRequirement: () => Currency.dualMachines.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(263).isUnlocked ? DC.D1 : Decimal.clamp(Currency.dualMachines.value.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 264,
    name: "Dominion begins here",
    get description() { return `Collect ${formatInt(10)} Celestial Runes.`; },
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Unlock Your Reality.`;
    },
    progress: () => (Achievement(264).isUnlocked ? DC.D1 : Decimal.clamp(DC.D0.div(10), 0, 1))
  },
  {
    id: 265,
    name: "Blank Space",
    get description() { return `Obtain ${format(1e20, 2, 2)} Null Particles.`; },
    checkRequirement: () => Currency.nullParticles.gte(1e20),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(265).isUnlocked ? DC.D1 : Decimal.clamp(Currency.nullParticles.value.max(1).log10().div(20), 0, 1))
  },
  {
    id: 266,
    name: "Postmortal",
    description: "Ascend.",
    checkRequirement: () => player.endgame.ascension >= 1,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(266).isUnlocked ? DC.D1 : Decimal.clamp(Currency.divineEnergy.value.max(1).log10().div(66000).min(0.5).add(new Decimal(86400000).sub(Ascensions.ipA.timeRemaining).div(172800000).min(0.5)), 0, 1))
  },
  {
    id: 267,
    name: "Supreme Deity",
    get description() { return `Reach ${formatInt(10)} Divinities.`; },
    checkRequirement: () => player.celestials.pelle.divinities >= 10,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(267).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.celestials.pelle.divinities).div(10), 0, 1))
  },
  {
    id: 268,
    name: "True Power",
    description: "Unlock the Overcharge.",
    checkRequirement: () => player.endgame.ascension >= 6,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Automatically update record Teresa ${player.universes.current === 2 ? "Matter" : "Antimatter"} to your current ${player.universes.current === 2 ? "Matter" : "Antimatter"} amount.`;
    },
    progress: () => (Achievement(268).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.endgame.ascension).div(6), 0, 1))
  },
  {
    id: 271,
    name: "Multiversal Breach",
    description: "Unlock Universes.",
    checkRequirement: () => player.celestials.pelle.divinities >= 13,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(271).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.celestials.pelle.divinities).div(13), 0, 1))
  },
  {
    id: 272,
    name: "Don't make me tell you again... TIME IS RELATIVE",
    description: "Compress Time.",
    checkRequirement: () => player.compression.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(272).isUnlocked ? DC.D1 : Decimal.clamp(EndgameMastery.timeCompression.isBought ? 0.9999 : player.endgameMasteries.maxSkills.div(2e7).min(0.9998), 0, 1))
  },
  {
    id: 273,
    name: "Payoff",
    get description() { return `Complete ${formatInt(15)} Celestial Tasks.`; },
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Double Celestial Rune gain from all sources.`;
    },
    effect: 2,
    progress: () => (Achievement(273).isUnlocked ? DC.D1 : Decimal.clamp(DC.D0.div(15), 0, 1))
  },
  {
    id: 274,
    name: "Covalent Bonding",
    get description() { return `Obtain ${formatInt(200)} Hadrons.`; },
    checkRequirement: () => new Decimal(player.celestials.laitela.hadrons.trueTotal).gte(200),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(274).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.celestials.laitela.hadrons.trueTotal).div(200), 0, 1))
  },
  {
    id: 275,
    name: "Quantum Mechanics",
    description: "Purchase all the Entanglement Masteries.",
    checkRequirement: () => EndgameMastery.boughtEM().countWhere(e => e.id > 280 && e.id < 310) >= 9,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(275).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(EndgameMastery.boughtEM().countWhere(e => e.id > 280 && e.id < 310)).div(9), 0, 1))
  },
  {
    id: 276,
    name: "Claustrophilic",
    get description() { return `Reach ${formatPostBreak("1e100000000")} ${player.universes.current === 2 ? "matter" : "antimatter"} while Compressed.`; },
    checkRequirement: () => Currency.antimatter.value.add(1).log10().gte(1e8) && player.compression.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Gain ${formatX(2)} Thermal Radiation and Endgame Skills while Compressed.`;
    },
    effect: () => (player.disablePostReality ? 1 : (player.compression.active ? 2 : 1)),
    progress: () => (Achievement(276).isUnlocked ? DC.D1 : (!player.compression.active ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(1e8), 0, 1)))
  },
  {
    id: 277,
    name: "Diese Errungenschaft existiert nicht V",
    get description() { return `Reach ${formatPostBreak(DC.D9_99999E999, 5, 0)} Dual Machines.`; },
    checkRequirement: () => player.reality.dualMachines.gte(DC.D9_99999E999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Gain ${formatPow(1.5, 1, 1)} more Singularities.`;
    },
    effect: () => (player.disablePostReality ? 1 : 1.5),
    progress: () => (Achievement(277).isUnlocked ? DC.D1 : Decimal.clamp(player.reality.dualMachines.max(1).log10().div(1000), 0, 1))
  },
  {
    id: 278,
    name: "You shouldn't have done that",
    get description() { return `Obtain ${format(1e15, 2, 2)} Endgame Skills.`; },
    checkRequirement: () => player.endgameMasteries.skills.gte(1e15),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(278).isUnlocked ? DC.D1 : Decimal.clamp(player.endgameMasteries.skills.div(1e15), 0, 1))
  },
  {
    id: 281,
    visibilityRow: 18,
    name: "...For Now",
    description: "Purchase a 1st Dimension in Run 2.",
    checkRequirement: () => PlayerProgress.endgameUnlocked() && AntimatterDimension(1).amount.gte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(281).isUnlocked ? DC.D1 : Decimal.clamp(player.endgames.div(2).min(0.5).add(player.antimatter.max(1).log10().div(2).min(0.5)), 0, 1))
  },
  {
    id: 282,
    visibilityRow: 18,
    name: "Destiny",
    description: "Doom Your Reality in Run 2.",
    checkRequirement: () => PlayerProgress.endgameUnlocked() && Pelle.isDoomed,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    progress: () => (Achievement(282).isUnlocked ? DC.D1 : Decimal.clamp(player.endgames.div(2).min(0.5).add((ImaginaryUpgrade(25).isBought ? new Decimal(0.5) : Currency.imaginaryMachines.value.div(6.4e15).min(0.25).add((!Laitela.isRunning || Laitela.maxAllowedDimension !== 0 || Glyphs.activeWithoutCompanion.length > 1) ? DC.D0 : Currency.eternityPoints.value.add(1).log10().div(16000).min(0.25))).add(new Decimal(Achievements.prePelleRows.countWhere(r => r.every(a => a.isUnlocked))).div(68).min(0.25)).add(new Decimal(AlchemyResources.all.filter(x => x.over25K).length).div(84).min(0.25)).div(2)), 0, 1))
  },
  {
    id: 283,
    visibilityRow: 18,
    name: "Unstoppable",
    description: "Beat Doom in Run 2.",
    checkRequirement: () => PlayerProgress.endgameUnlocked() && Currency.antimatter.value.add(1).log10().gte(9e15) && Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Galaxies are ${formatPercents(0.1)} stronger.`;
    },
    effect: () => (player.disablePostReality ? 1 : 1.1),
    progress: () => (Achievement(283).isUnlocked ? DC.D1 : Decimal.clamp(player.endgames.div(2).min(0.5).add(!Pelle.isDoomed ? DC.D0 : player.antimatter.max(1).log10().div(18e15).min(0.5)), 0, 1))
  },
  {
    id: 284,
    visibilityRow: 18,
    name: "TIME. IS. RELATIVE.",
    description: "Break Eternity.",
    checkRequirement: () => player.break2,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(284).isUnlocked ? DC.D1 : Decimal.clamp(player.endgames.div(2).min(0.5).add(player.antimatter.max(1).log10().div(18e15).min(0.5)), 0, 1))
  },
  {
    id: 285,
    visibilityRow: 18,
    name: "System Error",
    description: "Endgame in under an hour.",
    checkRequirement: () => player.records.bestEndgame.realTime < 3600000,
    checkEvent: GAME_EVENT.ENDGAME_RESET_AFTER,
    progress: () => (Achievement(285).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(3600000).div(player.records.bestEndgame.realTime), 0, 1))
  },
  {
    id: 286,
    visibilityRow: 18,
    name: "At Long Last",
    description: "Regain all Achievements in Pelle.",
    checkRequirement: () => PelleAchievementUpgrade.all.filter(u => u.canBeApplied).length >= 33,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `You can equip up to ${formatInt(2)} Effarig and Reality Glyphs each.`;
    },
    progress: () => (Achievement(286).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(PelleAchievementUpgrade.all.filter(u => u.canBeApplied).length).div(33), 0, 1))
  },
  {
    id: 287,
    visibilityRow: 18,
    name: "Wait. That's illegal.",
    get description() { return `Own a Reality Glyph of level ${formatInt(25001)} or higher.`; },
    checkRequirement: () => Glyphs.inventoryList.filter(g => g.type === "reality" && g.level.gte(25001)).length > 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(287).isUnlocked ? DC.D1 : Decimal.clamp(player.records.totalAntimatter.add(1).log10().add(1).log10().div(100).min(0.5).add(new Decimal(player.records.bestReality.glyphLevel).div(150006).min(0.5)), 0, 1))
  },
  {
    id: 288,
    visibilityRow: 18,
    name: "...eons stacked on eons stacked on...",
    get description() { return `Have a game speed of ${format(DC.NUMMAX, 1)} with Celestial Matter toggled off.`; },
    checkRequirement: () => getGameSpeedupForDisplay().gte(DC.NUMMAX) && player.endgame.celestialMatterMultiplier.isActive === false,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(288).isUnlocked ? DC.D1 : (player.endgame.celestialMatterMultiplier.isActive ? DC.DM1 : Decimal.clamp(getGameSpeedupForDisplay().max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)))
  },
  {
    id: 291,
    visibilityRow: 19,
    name: "A Newer Beginning",
    description: "Begin generation of Galactic Power.",
    checkRequirement: () => GalacticPower.isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(291).isUnlocked ? DC.D1 : Decimal.clamp(Currency.singularities.value.add(1).log10().div(300), 0, 1))
  },
  {
    id: 292,
    visibilityRow: 19,
    name: "Reinstalled the game and rejoined the server... again",
    description: "Have every Endgame Mastery at once.",
    checkRequirement: () => player.endgameMasteries.masteries.length >= 39,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(292).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.endgameMasteries.masteries.length).div(39), 0, 1))
  },
  {
    id: 293,
    visibilityRow: 19,
    name: "Faster than a dilated potato",
    get description() { return `Get more than ${formatPostBreak("ee29", 2)} ticks per second.`; },
    checkRequirement: () => Tickspeed.current.log10().lte(-1e29),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(293).isUnlocked ? DC.D1 : Decimal.clamp(Tickspeed.current.log10().sub(3).neg().div(1e29), 0, 1))
  },
  {
    id: 294,
    visibilityRow: 19,
    name: "Hard Reset",
    description: "Disable all Pelle Nerfs.",
    checkRequirement: () => PelleAchievementUpgrade.all.filter(u => u.canBeApplied).length >= 33 &&
      PelleDestructionUpgrade.all.filter(u => u.canBeApplied).length >= 50 &&
      PelleRealityUpgrade.all.filter(u => u.canBeApplied).length >= 20 &&
      PelleImaginaryUpgrade.all.filter(u => u.canBeApplied).length >= 19 &&
      PelleCelestialUpgrade.all.filter(u => u.canBeApplied).length >= 21 &&
      PellePerkUpgrade.all.filter(u => u.canBeApplied).length >= 29 &&
      PelleAlchemyUpgrade.all.filter(u => u.canBeApplied).length >= 21,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Unlock Strike Disabling.`;
    },
    progress: () => (Achievement(294).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(PelleAchievementUpgrade.all.filter(u => u.canBeApplied).length).div(231).min(1 / 7).add(new Decimal(PelleDestructionUpgrade.all.filter(u => u.canBeApplied).length).div(350).min(1 / 7)).add(new Decimal(PelleRealityUpgrade.all.filter(u => u.canBeApplied).length).div(140).min(1 / 7)).add(new Decimal(PelleImaginaryUpgrade.all.filter(u => u.canBeApplied).length).div(133).min(1 / 7)).add(new Decimal(PelleCelestialUpgrade.all.filter(u => u.canBeApplied).length).div(147).min(1 / 7)).add(new Decimal(PellePerkUpgrade.all.filter(u => u.canBeApplied).length).div(203).min(1 / 7)).add(new Decimal(PelleAlchemyUpgrade.all.filter(u => u.canBeApplied).length).div(147).min(1 / 7)), 0, 1))
  },
  {
    id: 295,
    visibilityRow: 19,
    name: "Look to the Stars",
    description: "Enter the Ethereal.",
    checkRequirement: () => Ethereal.isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(295).isUnlocked ? DC.D1 : Decimal.clamp(Currency.galacticPower.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 296,
    visibilityRow: 19,
    name: "Full Control of the Dark",
    description: "Purchase the 8th Dark Matter Dimension.",
    checkRequirement: () => ImaginaryUpgrade(29).isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Decrease Galaxy Generator Instability by ${formatInt(2)}.`;
    },
    effect: () => (player.disablePostReality ? 0 : 2),
    progress: () => (Achievement(296).isUnlocked ? DC.D1 : Decimal.clamp(actualBaseGalaxiesWithoutGeneration().add(1).log10().div(150).min(0.5).add(Currency.imaginaryMachines.value.add(1).log10().div(400).min(0.5)), 0, 1))
  },
  {
    id: 297,
    visibilityRow: 19,
    name: "Gone...",
    description: "Destroy Pelle.",
    checkRequirement: () => PelleStrikeUpgrade.all.filter(u => u.canBeApplied).length >= 5,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Boost Celestial Point Gain.`;
    },
    progress: () => (Achievement(297).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(PelleStrikeUpgrade.all.filter(u => u.canBeApplied).length).div(5), 0, 1))
  },
  {
    id: 298,
    visibilityRow: 19,
    name: "...But Not Forgotten",
    get description() { return `Reach ${format(DC.NUMMAX, 1, 0)} Imaginary Machines.`; },
    checkRequirement: () => Currency.imaginaryMachines.value.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Gain a small multiplier to the Celestial Matter Conversion Exponent based on unnerfed Celestial Matter.`;
    },
    effect: () => (player.disablePostReality ? 1 : Decimal.pow(Decimal.log10(Currency.unnerfedCelestialMatter.value.add(1).log10().add(1)).add(1), 0.1)),
    formatEffect: value => `${formatX(value, 2, 3)}`,
    progress: () => (Achievement(298).isUnlocked ? DC.D1 : Decimal.clamp(Currency.imaginaryMachines.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 301,
    visibilityRow: 20,
    name: "Mistake?",
    get description() { return `Enter Alpha's Reality.`; },
    checkRequirement: () => Alpha.isRunning,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => (Achievement(301).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(PelleStrikeUpgrade.all.filter(u => u.canBeApplied).length).div(10).min(0.5).add(Currency.imaginaryMachines.value.add(1).log10().div(Decimal.log10(DC.NUMMAX).times(2)).min(0.5)), 0, 1))
  },
  {
    id: 302,
    visibilityRow: 20,
    name: "The Dark Crunch",
    get description() { return `Reach Infinity in Alpha's Reality.`; },
    checkRequirement: () => Alpha.isRunning,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `Alpha Decay increases ${formatX(1.1, 1, 1)} faster`;
    },
    effect: 1.1,
    progress: () => (Achievement(302).isUnlocked ? DC.D1 : (!Alpha.isRunning ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)))
  },
  {
    id: 303,
    visibilityRow: 20,
    name: "Never Gonna Stop",
    get description() { return `Reach Eternity in Alpha's Reality.`; },
    checkRequirement: () => Alpha.isRunning,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() {
      return `Alpha Decay speed is boosted based on Dual Machines.`;
    },
    effect: () => Decimal.max(Decimal.ln(Decimal.ln(Currency.dualMachines.value.add(1)).add(1)), 1),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => (Achievement(303).isUnlocked ? DC.D1 : (!Alpha.isRunning ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)))
  },
];
