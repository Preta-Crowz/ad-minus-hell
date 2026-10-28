import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";
import FullScreenAnimationHandler from "./full-screen-animation-handler";

export function disChargeAllEternityUpgrades() {
  const overcharge = player.endgame.overcharge;
  for (const upgrade of chargeableEternityUpgrades()) {
    if (upgrade.isCharged) upgrade.disCharge();
  }
  overcharge.charged.eternal.clear();
  overcharge.chargesLeft.eternal = overcharge.completions.eter;
  overcharge.discharge.eternal = false;
  EventHub.dispatch(GAME_EVENT.ETERNITY_UPGRADES_DISCHARGED);
}

function giveEternityRewards(auto) {
  player.records.bestEternity.time = Decimal.min(player.records.thisEternity.time, player.records.bestEternity.time);
  Currency.eternityPoints.add(gainedEternityPoints());

  const newEternities = gainedEternities();

  if (Currency.eternities.eq(0) && newEternities.lte(10)) {
    Tab.dimensions.time.show();
  }

  Currency.eternities.add(newEternities);

  if (EternityChallenge.isRunning && Player.hasEternityChallengeGoal) {
    const challenge = EternityChallenge.current;
    challenge.addCompletion(false);
    if (Perk.studyECBulk.isBought) {
      let completionCount = 0;
      while (!challenge.isFullyCompleted && challenge.canBeCompleted) {
        challenge.addCompletion(false);
        completionCount++;
      }
      AutomatorData.lastECCompletionCount = completionCount;
      if (Enslaved.isRunning && completionCount > 5) EnslavedProgress.ec1.giveProgress();
    }
    player.challenge.eternity.requirementBits &= ~(1 << challenge.id);
    respecTimeStudies(auto);
  }

  addEternityTime(
    player.records.thisEternity.trueTime,
    player.records.thisEternity.time,
    player.records.thisEternity.realTime,
    gainedEternityPoints(),
    newEternities
  );

  player.records.thisReality.bestEternitiesPerMs = player.records.thisReality.bestEternitiesPerMs.clampMin(
    newEternities.div(Decimal.clampMin(33, player.records.thisEternity.realTime))
  );
  player.records.bestEternity.bestEPminReality =
    player.records.bestEternity.bestEPminReality.max(player.records.thisEternity.bestEPmin);

  player.records.bestEternity.trueTime = Math.min(player.records.bestEternity.trueTime, player.records.thisEternity.trueTime);
  const bankedInfinityEffects = [Achievement(131).effects.bankedInfinitiesGain];
  if (!Pelle.isDoomed || PelleDestructionUpgrade.timestudy191.canBeApplied) {
    bankedInfinityEffects.push(TimeStudy(191));
  }
  Currency.infinitiesBanked.value = Currency.infinitiesBanked.value.plusEffectsOf(...bankedInfinityEffects);

  if (Effarig.isRunning && !Hell.isInside && !EffarigUnlock.eternity.isUnlocked) {
    EffarigUnlock.eternity.unlock();
    EffarigUnlock.infinity.unlock();
    beginProcessReality(getRealityProps(true));
  }
}

export function eternityAnimation() {
  FullScreenAnimationHandler.display("a-eternify", 3);
}

export function eternityResetRequest() {
  if (!Player.canEternity) return;
  if (GameEnd.creditsEverClosed) return;

  if((!breakInfinityUGs.all[0].config.hasFailed() && !breakInfinityUGs.all[0].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked())){
    Modal.message.show(`you will fail glitch challenge ${breakInfinityUGs.all[0].config.name} <br> which is to ${breakInfinityUGs.all[0].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  else if((!breakInfinityUGs.all[1].config.hasFailed() && !breakInfinityUGs.all[1].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked())){
    Modal.message.show(`you will fail glitch challenge ${breakInfinityUGs.all[1].config.name} <br> which is to ${breakInfinityUGs.all[1].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  else if((!eternityUGs.all[0].config.hasFailed() && !eternityUGs.all[0].isBought) && (player.options.confirmations.glitchCL && 
 !PlayerProgress.metaUnlocked())){
    Modal.message.show(`you will fail glitch challenge ${eternityUGs.all[0].config.name} <br> which is to ${eternityUGs.all[0].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }

  askEternityConfirmation();
}

export function eternity(force, auto, specialConditions = {}) {
  if (specialConditions.switchingDilation && !Player.canEternity) {
    // eslint-disable-next-line no-param-reassign
    force = true;
  }
  // We define this variable so we can use it in checking whether to give
  // the secret achievement for respec without studies.
  // Annoyingly, we need to check for studies right here; giveEternityRewards removes studies if we're in an EC,
  // so doing the check later doesn't give us the initial state of having studies or not.
  const noStudies = player.timestudy.studies.length === 0;
  if (!force) {
    if (!Player.canEternity) return false;
    if (RealityUpgrade(10).isLockingMechanics) {
      RealityUpgrade(10).tryShowWarningModal();
      return false;
    }
    if (RealityUpgrade(12).isLockingMechanics && EternityChallenge(1).isRunning) {
      RealityUpgrade(12).tryShowWarningModal();
      return false;
    }
    EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_BEFORE);
    giveEternityRewards(auto);
    player.requirementChecks.reality.noEternities = false;
  }

  if (player.dilation.active) rewardTP();

  // This needs to be after the dilation check for the "can gain TP" check in rewardTP to be correct.
  if (force) {
    player.challenge.eternity.current = 0;
  }

  initializeChallengeCompletions();
  initializeResourcesAfterEternity();

  if (!MetaMilestone.glyphKeep.isReached && !EternityMilestone.keepAutobuyers.isReached &&
    !(Pelle.isDoomed && PelleUpgrade.keepAutobuyers.canBeApplied) &&
    !(LHC.voidRunning && LHCNullUpgrade.alwaysBroken.isBought)) {
    // Fix infinity because it can only break after big crunch autobuyer interval is maxed
    player.break = false;
  }

  player.challenge.eternity.current = 0;
  if (!specialConditions.enteringEC && (!Pelle.isDoomed || PelleStrikes.dilation.isDestroyed())) {
    player.dilation.active = false;
  }
  resetInfinityRuns();
  InfinityDimensions.fullReset();
  Replicanti.reset();
  resetChallengeStuff();
  AntimatterDimensions.reset();

  if (!specialConditions.enteringEC && player.respec) {
    if (noStudies) {
      SecretAchievement(34).unlock();
    }
    respecTimeStudies(auto);
    player.respec = false;
  }

  Currency.infinityPoints.reset();
  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  resetTimeDimensions();
  resetTickspeed();
  playerInfinityUpgradesOnReset();
  AchievementTimers.marathon2.reset();
  applyEU1();
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisEternity.maxAM = DC.D0;
  Currency.antimatter.reset();
  ECTimeStudyState.invalidateCachedRequirements();
  Hell.applyNGMinus1Reset("eternity");

  PelleStrikes.eternity.trigger();

  if (Alpha.isRunning && Alpha.currentStage === 11) {
    Alpha.advanceLayer();
    Alpha.quotes.eternity.show();
  }

  for (let challenge = 1; challenge < 13; challenge++) {
    if (Alpha.isRunning && Alpha.currentStage === 16 && EternityChallenge(challenge).completions >= 1) {
      Alpha.advanceLayer();
      Alpha.quotes.firstEternityChall.show();
    }
    if (Alpha.isRunning && Alpha.currentStage === 17 && EternityChallenge(challenge).completions >= 5) {
      Alpha.advanceLayer();
      Alpha.quotes.bulkEternityChall.show();
    }
  }

  if (Alpha.isRunning && Alpha.currentStage === 19 && EternityChallenge(10).completions >= 1) {
    Alpha.advanceLayer();
    Alpha.quotes.eternityChallTen.show();
  }

  if (Alpha.isRunning && Alpha.currentStage === 22 && EternityChallenge(11).completions >= 5) {
    Alpha.advanceLayer();
    Alpha.quotes.completeEternityChallEleven.show();
  }

  if (Alpha.isRunning && Alpha.currentStage === 24 && Currency.tachyonParticles.gt(0)) {
    Alpha.advanceLayer();
    Alpha.quotes.dilatedEternity.show();
  }
  if (Slabdrill.isCursed && Slabdrill.currentStage === 6) {
    Slabdrill.advanceLayer();
    Glyphs.refreshActive();
    Slabdrill.quotes.eternity.show();
  }
  if (Slabdrill.isCursed && Slabdrill.currentStage === 8 && EternityChallenge(10).completions >= 1) {
    Slabdrill.advanceLayer();
    Glyphs.refreshActive();
    Slabdrill.quotes.eternityChallengeTen.show();
  }

  EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_AFTER);
  return true;
}

// eslint-disable-next-line no-empty-function
export function animateAndEternity(callback) {
  if (!Player.canEternity) return false;
  const hasAnimation = !FullScreenAnimationHandler.isDisplaying &&
    !RealityUpgrade(10).isLockingMechanics &&
    !(RealityUpgrade(12).isLockingMechanics && EternityChallenge(1).isRunning) &&
    ((player.dilation.active && player.options.animations.dilation) ||
    (!player.dilation.active && player.options.animations.eternity));

  if (hasAnimation) {
    if (player.dilation.active) {
      animateAndUndilate(callback);
    } else {
      eternityAnimation();
      setTimeout(() => {
        eternity();
        if (callback) callback();
      }, 2250);
    }
  } else {
    eternity();
    if (callback) callback();
  }
  return hasAnimation;
}

export function initializeChallengeCompletions(isReality) {
  if (!(LHC.voidRunning && LHCNullUpgrade.ncComp.isBought)) NormalChallenges.clearCompletions();
  if (!PelleUpgrade.keepInfinityChallenges.canBeApplied && !(LHC.voidRunning && LHCNullUpgrade.icComp.isBought)) {
    InfinityChallenges.clearCompletions();
  }
  if (!isReality && EternityMilestone.keepAutobuyers.isReached || Pelle.isDoomed) {
    NormalChallenges.completeAll();
  }
  if (Achievement(133).isEffectActive) InfinityChallenges.completeAll();
  player.challenge.normal.current = 0;
  player.challenge.infinity.current = 0;
}

export function initializeResourcesAfterEternity() {
  player.sacrificed = DC.D0;
  Currency.infinities.reset();
  player.records.bestInfinity.time = DC.BEMAX;
  player.records.bestInfinity.realTime = DC.BEMAX;
  player.records.thisInfinity.time = DC.D0;
  player.records.thisInfinity.lastBuyTime = DC.D0;
  player.records.thisInfinity.realTime = DC.D0;
  player.dimensionBoosts = (EternityMilestone.keepInfinityUpgrades.isReached) ? DC.D4 : DC.D0;
  player.galaxies = (EternityMilestone.keepInfinityUpgrades.isReached) ? DC.D1 : DC.D0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.IPMultPurchases = DC.D0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  player.records.thisEternity.time = DC.D0;
  player.records.thisEternity.realTime = DC.D0;
  player.totalTickGained = DC.D0;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  Player.resetRequirements("eternity");
}

export function applyEU1() {
  if (player.eternityUpgrades.size < 3 && Perk.autounlockEU1.canBeApplied) {
    for (const id of [1, 2, 3]) player.eternityUpgrades.add(id);
  }
}

// We want this to be checked before any EP-related autobuyers trigger, but we need to call this from the autobuyer
// code since those run asynchronously from gameLoop
export function applyEU2() {
  if (player.eternityUpgrades.size < 6 && Perk.autounlockEU2.canBeApplied) {
    const secondRow = EternityUpgrade.all.filter(u => u.id > 3);
    for (const upgrade of secondRow) {
      if (player.eternityPoints.gte(upgrade.cost / 1e10)) player.eternityUpgrades.add(upgrade.id);
    }
  }
}

function askEternityConfirmation() {
  if (player.dilation.active && player.options.confirmations.dilation) {
    Modal.exitDilation.show();
  } else if (player.options.confirmations.eternity) {
    Modal.eternity.show();
  } else {
    animateAndEternity();
  }
}

export function gainedEternities() {
  if (Pelle.isDisabled("eternityMults")) {
    const eternities = PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied
      ? new Decimal(getAdjustedGlyphEffect("timeetermult"))
      : new Decimal(1);
    let result = LHC.voidRunning ? eternities.timesEffectOf(LHCNullUpgrade.eternityMult) : eternities;
    if (ResurgenceUpgrade.curr1Surge.isBought && !player.disablePostReality) {
      result = result.pow(player.eternities.max(1e10).log10().log10());
    }
    return result;
  }
  let eternities = new Decimal(getAdjustedGlyphEffect("timeetermult"))
    .timesEffectsOf(RealityUpgrade(3), Achievement(113))
    .pow(AlchemyResource.eternity.effectValue);
  if (LHC.voidRunning) eternities = eternities.timesEffectOf(LHCNullUpgrade.eternityMult);
  if (ResurgenceUpgrade.curr1Surge.isBought && !player.disablePostReality) {
    eternities = eternities.pow(player.eternities.max(1e10).log10().log10());
  }
  return eternities;
}

export class EternityMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    if (Pelle.isDoomed && this.config.givenByPelle) {
      if (ChallengerUpgrade(5).isBought) return Currency.eternities.gte(this.config.eternities);
      return this.config.givenByPelle();
    }
    return Currency.eternities.gte(this.config.eternities);
  }
}
export const EternityMilestone = mapGameDataToObject(
  GameDatabase.eternity.milestones,
  config => (config.isBaseResource
    ? new EternityMilestoneState(config)
    : new EternityMilestoneState(config))
);

class ChargedEternityUpgradeState extends GameMechanicState {
  constructor(config, upgrade) {
    super(config);
    this._upgrade = upgrade;
  }

  get isEffectActive() {
    return this._upgrade.isBought && this._upgrade.isCharged;
  }
}

class EternityUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    if (config.charged) {
      this._chargedEffect = new ChargedEternityUpgradeState(config.charged, this);
    }
  }

  get currency() {
    return Currency.eternityPoints;
  }

  get set() {
    return player.eternityUpgrades;
  }

  get isEffectActive() {
    return this.isBought && !this.isCharged;
  }

  get chargedEffect() {
    return this._chargedEffect;
  }

  purchase() {
    if (super.purchase()) {
      EventHub.dispatch(GAME_EVENT.ETERNITY_UPGRADE_BOUGHT);
      return true;
    }
    if (this.canCharge) {
      this.charge();
      EventHub.dispatch(GAME_EVENT.ETERNITY_UPGRADE_CHARGED);
      return true;
    }
    return false;
  }

  get hasChargeEffect() {
    return this.config.charged !== undefined && Ascensions.oc2A.isUnlocked;
  }

  get isCharged() {
    return player.endgame.overcharge.charged.eternal.has(this.id);
  }

  get canCharge() {
    return this.isBought &&
      this.hasChargeEffect &&
      !this.isCharged &&
      player.endgame.overcharge.chargesLeft.eternal !== 0;
  }

  charge() {
    player.endgame.overcharge.charged.eternal.add(this.id);
  }

  disCharge() {
    player.endgame.overcharge.charged.eternal.delete(this.id);
  }

  onPurchased() {
    if (this.id === 3 && Alpha.isRunning && Alpha.currentStage === 14) {
      Alpha.advanceLayer();
      Alpha.quotes.infinityChallTimeBoost.show();
    }
  }
}

const chargeableEternityUpgrades = () => [
  EternityUpgrade.idMultEP,
  EternityUpgrade.idMultEternities,
  EternityUpgrade.idMultICRecords,
  EternityUpgrade.tdMultAchs,
  EternityUpgrade.tdMultTheorems,
  EternityUpgrade.tdMultRealTime
];

export function tryChargeAllEternityUpgrades() {
  if (player.endgame.overcharge.chargesLeft.eternal < 6) return;
  for (const upgrade of chargeableEternityUpgrades()) {
    if (upgrade.canCharge) upgrade.charge();
  }
}

class EPMultiplierState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(player.epmultUpgrades));
    this.cachedEffectValue = new Lazy(() => DC.D5.pow(player.epmultUpgrades));
  }

  get isAffordable() {
    if (ChallengerUpgrade(7).isBought) return Currency.eternityPoints.gte(this.cost);
    return !Pelle.isDoomed && Currency.eternityPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.epmultUpgrades;
  }

  set boughtAmount(value) {
    // Reality resets will make this bump amount negative, causing it to visually appear as 0 even when it isn't.
    // A dev migration fixes bad autobuyer states and this change ensures it doesn't happen again
    const diff = Decimal.max(value.sub(player.epmultUpgrades), 0);
    player.epmultUpgrades = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
    Autobuyer.eternity.bumpAmount(DC.D5.pow(diff));
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  purchase() {
    if (!this.isAffordable) return false;
    if(Currency.eternityPoints.lt('ee15')) Currency.eternityPoints.subtract(this.cost);
    this.boughtAmount = this.boughtAmount.add(1);
    return true;
  }

  // eslint-disable-next-line consistent-return
  costInv() {
    let tempVal = DC.D0;
    let bulk = DC.D1;
    let cur = Currency.eternityPoints.value.max(1);
    if (cur.gt(this.costIncreaseThresholds[3])) {
      cur = Decimal.log(cur.div(500), 1e3);
      return cur.add(Math.pow(1332, 1.2)).root(1.2).floor().max(1332);
      // eslint-disable-next-line no-else-return
    }
    if (cur.gt(this.costIncreaseThresholds[2])) {
      bulk = this.costIncreaseThresholds[2].div(500).log(500).floor();
      tempVal = (DC.E3).pow(bulk).times(500);
      cur = cur.div(tempVal).max(1 / 1e3);
      return bulk.add(cur.log(1e3).add(1)).floor();
    }
    if (cur.gt(this.costIncreaseThresholds[1])) {
      bulk = this.costIncreaseThresholds[1].div(500).log(100).floor();
      tempVal = (DC.E2.times(5)).pow(bulk).times(500);
      cur = cur.div(tempVal.max(1 / 500));
      return bulk.add(cur.log(500).add(1)).floor();
    }
    if (cur.gt(this.costIncreaseThresholds[0])) {
      bulk = this.costIncreaseThresholds[0].div(500).log(50).floor();
      tempVal = DC.E2.pow(bulk).times(500);
      cur = cur.div(tempVal.max(1 / 100));
      return bulk.add(cur.log(100).add(1)).floor();
    }
    return cur.div(500).max(1 / 50).log(50).add(1).floor();
  }

  buyMax(auto) {
    if (!this.isAffordable) return false;
    if (RealityUpgrade(15).isLockingMechanics) {
      if (!auto) RealityUpgrade(15).tryShowWarningModal();
      return false;
    }


    // Technically inaccurate, but it works fine (is it inaccurate tho???)
    // Should probably use hardcoded values but im lazy so no

    let bulk = Decimal.floor(this.costInv());
    if (bulk.lt(1)) return false;
    const price = this.costAfterCount(bulk.sub(1));
    bulk = bulk.sub(this.boughtAmount).max(0);

    if (bulk.eq(0)) return false;
    const V = Currency.eternityPoints.lt('ee15');
    if (V) Currency.eternityPoints.subtract(price);
    this.boughtAmount = this.boughtAmount.add(bulk);
    let i = 0;
    while (Currency.eternityPoints.gt(this.costAfterCount(this.boughtAmount)) &&
    i < 50 && this.boughtAmount.layer < 1) {
      this.boughtAmount = this.boughtAmount.add(1);
      if (V) Currency.eternityPoints.subtract(this.costAfterCount(this.boughtAmount.sub(1)));
      i += 1;
    }
    return true;
  }

  reset() {
    this.boughtAmount = DC.D0;
  }

  get costIncreaseThresholds() {
    return [DC.E100, DC.NUMMAX, DC.E1300, DC.E4000];
  }

  costAfterCount(count) {
    const costThresholds = EternityUpgrade.epMult.costIncreaseThresholds;
    const multPerUpgrade = [50, 100, 500, 1000];
    for (let i = 0; i < costThresholds.length; i++) {
      const cost = Decimal.pow(multPerUpgrade[i], count).times(500);
      if (cost.lt(costThresholds[i])) return cost;
    }
    // This formula is slightly weaker than base AD but who gives a fuck
    return DC.E3.pow(count.pow(1.2).sub(Math.pow(1332, 1.2))).times(500);
  }
}

export const EternityUpgrade = mapGameDataToObject(
  GameDatabase.eternity.upgrades,
  config => new EternityUpgradeState(config)
);

EternityUpgrade.epMult = new EPMultiplierState();
