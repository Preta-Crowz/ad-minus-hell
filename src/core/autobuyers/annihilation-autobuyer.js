import { AutobuyerState } from "./autobuyer";

export class AnnihilationAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.annihilation;
  }

  get name() {
    return `Annihilation`;
  }

  get isUnlocked() {
    return SingularityMilestone.annihilationAutobuyer.canBeApplied;
  }

  get multiplier() {
    return this.data.multiplier;
  }

  get mode() {
    return this.data.mode;
  }

  set multiplier(value) {
    this.data.multiplier = value;
  }

  get bulk() {
    return 0;
  }

  get hasInput() {
    return true;
  }

  get inputType() {
    return "decimal";
  }

  get inputEntry() {
    return "multiplier";
  }

  tick() {
    const target = this.mode === 1 ? Laitela.darkMatterMult.times(this.multiplier) : this.multiplier;
    if (Laitela.darkMatterMultGain.gte(target)) {
      Laitela.annihilate();
    }
  }
}
