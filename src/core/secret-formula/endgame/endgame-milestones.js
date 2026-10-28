export const endgameMilestones = {
  riftFill: {
    endgames: 1,
    reward: () => {
      const endgames = Currency.endgames.value;
      const riftBonus = Decimal.min(0.45, endgames.times(0.05)).toNumber();
      return `Rift Fill is ${formatPercents(0.05)} faster per Endgame, capping at ${formatPercents(Alpha.isDestroyed ? 0.9 : 0.45)} after ${formatInt(9)} Endgames ` + 
        (player.disablePostReality ? "(Destroyed)" : (endgames.gte(1)
         ? (endgames.gte(9) ? "(Capped: " : "(Currently: ") + `+${formatPercents(riftBonus + (Alpha.isDestroyed ? 0.45 : 0))})`
         : "(You have not yet reached this milestone)"));
    }
  },
  galGenAnimation: {
    endgames: 2,
    reward: () => {
      const endgames = Currency.endgames.value;
      const animationSpeed = Math.pow(1.2, endgames.min(40).div(2).floor().toNumber());
      return `Galaxy Generator Animations are ${formatX(1.2, 0, 1)} faster every ${formatInt(2)} Endgames, capping after ${formatInt(40)} Endgames ` + 
        (player.disablePostReality ? "(Destroyed)" : (endgames.gte(2)
         ? (endgames.gte(40) && !Alpha.isDestroyed ? "(Capped: " : "(Currently: ") + (Alpha.isDestroyed ? "Instant)" : `${formatX(animationSpeed, 2, 2)})`)
         : "(You have not yet reached this milestone)"));
    }
  },
  vReduction: {
    endgames: 3,
    reward: () => {
      return `Reduce the Realities requirement for unlocking V's Reality to ${formatInt(100)}`;
    }
  },
  fasterGalaxies: {
    endgames: 5,
    reward: "Unlock a new Galaxy Generator Upgrade"
  },
  achievementKeep: {
    endgames: 7,
    reward: "Keep Achievements on Endgame"
  },
  startRa: {
    endgames: 10,
    reward: () => {
      return `Start Endgames with all Ra Level ${formatInt(1)} Rewards`;
    }
  },
  celestialEarlyUnlock: {
    endgames: 15,
    reward: () => {
      return `Start Endgames with the first ${formatInt(6)} Celestials unlocked`;
    }
  },
  keepPerks: {
    endgames: 25,
    reward: "Keep Perk Tree on Endgame"
  },
  gameSpeedUncap: {
    endgames: 35,
    reward: () => {
      return `Remove the ${format(1e300, 2, 2)} Game Speed Hardcap`;
    }
  },
  bhAutos: {
    endgames: 50,
    reward: "Start with both Black Holes permanent"
  },
  startSac: {
    endgames: 100,
    reward: () => {
      return `Start with ${format(1e100, 2, 2)} Glyph Sacrifice of all types`;
    }
  },
  moreFasterGalaxies: {
    endgames: 200,
    reward: () => {
      const endgames = Currency.endgames.value;
      const galaxyProduction = Decimal.pow(10, endgames.div(200).min(50))
        .times(Decimal.pow(10, endgames.add(1).log10().sub(4).times(50).max(0)));
      return "Endgames boost Galaxy Production in Pelle " + 
        (player.disablePostReality ? "(Destroyed)" : (endgames.gte(200)
         ? `(Currently: ${formatX(galaxyProduction, 2, 2)})`
         : "(You have not yet reached this milestone)"));
    }
  },
  autobuyerEndgame: {
    endgames: 400,
    reward: "Unlock autobuyer for Endgames"
  },
  endgameAntimatter: {
    endgames: 1000,
    reward: () => {
      const endgames = Currency.endgames.value;
      const matterProductionPower = Decimal.min(endgames, 1e6)
        .times(Decimal.max(Decimal.log2(endgames.add(1)).sub(Math.log2(5e5)), 1))
        .add(1).log10().div(Pelle.isDoomed ? 80 : 200).add(1);
      return `Gain a power to ${player.universes.current === 2 ? "Matter" : "Antimatter"} Production based on Endgames, which is stronger in Pelle ` + 
        (player.disablePostReality ? "(Destroyed)" : (endgames.gte(1000)
         ? `(Currently: ${formatPow(matterProductionPower, 2, 3)})`
         : "(You have not yet reached this milestone)"));
    }
  },
  instabilityReduction: {
    endgames: 1000000,
    reward: () => {
      const endgames = Currency.endgames.value;
      const instabilityPower = Decimal.pow(endgames.add(1).log10().reciprocal(), 0.1);
      return "Endgames decrease the Galaxy Generator Instability Magnitude " + 
        (player.disablePostReality ? "(Destroyed)" : (endgames.gte(1000000)
         ? `(Currently: ${formatPow(instabilityPower, 2, 3)})`
         : "(You have not yet reached this milestone)"));
    }
  }
};
