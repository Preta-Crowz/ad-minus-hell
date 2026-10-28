import { AutobuyerState } from "./autobuyer";

export class MetaUpgradeAutobuyerState extends AutobuyerState {
  get name() {
    return MetaFabricatorUpgrade(this.id).config.name;
  }

  get data() {
    return player.auto.metaUpgrades.all[this.id - 1];
  }

  get isUnlocked() {
    return DivinityMilestone.metaAutomation.isReached;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    MetaFabricatorUpgrade(this.id).bulkPurchase();
  }

  static get entryCount() { return 5; }
  static get autobuyerGroupName() { return "Meta Upgrade"; }
  static get isActive() { return player.auto.metaUpgrades.isActive; }
  static set isActive(value) { player.auto.metaUpgrades.isActive = value; }
}