/**
 * @abstract
 */
export class EndgameSkillPurchaseType {
  /**
  * @abstract
  */
  get amount() { throw new NotImplementedError(); }

  /**
  * @abstract
  */
  set amount(value) { throw new NotImplementedError(); }

  add(amount) { this.amount = this.amount.add(amount); }

  /**
  * @abstract
  */
  get currency() { throw new NotImplementedError(); }

  get cost() { return this.costBase.times(this.costIncrement.pow(this.amount)); }

  /**
   * @abstract
   */
  get costBase() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get costIncrement() { throw new NotImplementedError(); }

  get bulkPossible() {
    let amount = Decimal.affordGeometricSeries(this.currency.value, this.cost, this.costIncrement, 0);
    if (amount.gt(0) && !this.currency.gte(this.bulkCost(amount))) amount = amount.sub(1);
    const nextAmount = amount.plus(1);
    if (nextAmount.gt(amount) && this.currency.gte(this.bulkCost(nextAmount))) amount = nextAmount;
    return amount;
  }

  bulkCost(amount) {
    const purchaseCount = new Decimal(amount);
    const ratio = this.costIncrement;
    if (ratio.eq(1)) return this.cost.times(purchaseCount);
    return this.cost.times(ratio.pow(purchaseCount).sub(1)).div(ratio.sub(1));
  }

  purchase(bulk) {
    if (!this.canAfford) return false;
    let purchased = false;
    const amount = this.bulkPossible;
    const buyFn = cost => this.currency.purchase(cost);
    if (bulk && amount.gt(0) && buyFn(this.bulkCost(amount))) {
      Currency.endgameSkills.add(amount);
      this.add(amount);
      purchased = true;
    }
    if (buyFn(this.cost)) {
      Currency.endgameSkills.add(1);
      this.add(1);
      purchased = true;
    }
    return purchased;
  }

  get canAfford() {
    return this.currency.gte(this.cost) && player.endgames.gt(0);
  }

  reset() {
    this.amount = 0;
  }
}

EndgameSkillPurchaseType.gg = new class extends EndgameSkillPurchaseType {
  get amount() { return new Decimal(player.endgameMasteries.ggBought); }
  set amount(value) { player.endgameMasteries.ggBought = new Decimal(value); }

  get currency() { return Currency.galaxyGeneratorGalaxies; }
  get costBase() { return DC.E10; }
  get costIncrement() { return DualityUpgrade(27).isBought ? new Decimal(1.1) : DC.E2; }

}();

EndgameSkillPurchaseType.cp = new class extends EndgameSkillPurchaseType {
  get amount() { return new Decimal(player.endgameMasteries.cpBought); }
  set amount(value) { player.endgameMasteries.cpBought = new Decimal(value); }

  get currency() { return Currency.celestialPoints; }
  get costBase() { return DC.D1; }
  get costIncrement() { return DC.E1; }

}();

EndgameSkillPurchaseType.dp = new class extends EndgameSkillPurchaseType {
  get amount() { return new Decimal(player.endgameMasteries.dpBought); }
  set amount(value) { player.endgameMasteries.dpBought = new Decimal(value); }

  get currency() { return Currency.doomedParticles; }
  get costBase() { return DC.D1; }
  get costIncrement() { return DC.E1; }

}();

export const EndgameSkills = {
  checkForBuying(auto) {
    if (CelestialDimension(1).baseAmount.gt(0)) return true;
    if (!auto) Modal.message.show(`You need to buy at least ${formatInt(1)} Celestial Dimension before you can purchase
      Endgame Skills. You also need to be outside Doom to prevent
      ${player.universes.current === 2 ? "M" : "AM"} overflow.`, { closeEvent: GAME_EVENT.ENDGAME_RESET_AFTER });
    return false;
  },

  buyOne(auto = false, type) {
    if (!this.checkForBuying(auto)) return 0;
    if (!EndgameSkillPurchaseType[type].purchase(false)) return 0;
    return 1;
  },

  // This is only called via automation and there's no manual use-case, so we assume auto is true and simplify a bit
  buyOneOfEach() {
    if (!this.checkForBuying(true)) return 0;
    const esGG = this.buyOne(true, "gg");
    const esCP = this.buyOne(true, "cp");
    const esDP = this.buyOne(true, "dp");
    return esGG + esCP + esDP;
  },

  buyMax(auto = false) {
    if (!this.checkForBuying(auto)) return 0;
    const esGG = EndgameSkillPurchaseType.gg.purchase(true);
    const esCP = EndgameSkillPurchaseType.cp.purchase(true);
    const esDP = EndgameSkillPurchaseType.dp.purchase(true);
    return esGG + esCP + esDP;
  },

  totalPurchased() {
    return EndgameSkillPurchaseType.gg.amount
      .plus(EndgameSkillPurchaseType.cp.amount)
      .plus(EndgameSkillPurchaseType.dp.amount);
  },

  calculateEndgameMasteriesCost() {
    const list = EndgameMastery.permaMasteries.isBought
      ? EndgameMastery.boughtEM().filter(m => m.id >= 180 && m.id < 280)
      : EndgameMastery.boughtEM().filter(m => m.id < 280);
    let totalCost = list.map(em => em.cost).reduce(Number.sumReducer, 0);
    totalCost += masteryIncrease.entanglementCost();
    return totalCost;
  }
};
