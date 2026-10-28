import { IntervaledAutobuyerState } from "./autobuyer";

export class DarkMatterDimensionAscensionAutobuyerState extends IntervaledAutobuyerState {
  get realTime() {
    return true;
  }

  get data() {
    return player.auto.ascension;
  }

  get name() {
    return `Dark Matter Dimension Ascension`;
  }

  get isUnlocked() {
    return SingularityMilestone.ascensionAutobuyers.canBeApplied;
  }

  get interval() {
    return 1000 * SingularityMilestone.darkAutobuyerSpeed.effectValue;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    super.tick();
    const maxTier = SingularityMilestone.ascensionAutobuyers.effectValue +
      SingularityMilestone.darkDimAscension5to8.effectValue;
    for (let i = 1; i <= maxTier; i++) {
      DarkMatterDimension(i).ascend();
    }
  }
}
