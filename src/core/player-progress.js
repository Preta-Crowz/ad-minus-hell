export class PlayerProgress {
  constructor(player) {
    this._player = player;
  }

  get isInfinityUnlocked() {
    return new Decimal(this._player.infinities).gt(0) || this.isEternityUnlocked;
  }

  get isEternityUnlocked() {
    return new Decimal(this._player.eternities).gt(0) || this.isRealityUnlocked;
  }

  get isRealityUnlocked() {
    return new Decimal(this._player.realities).gt(0) || this.isMetaUnlocked || this.isEndgameUnlocked;
  }

  get isEndgameUnlocked() {
    return this._player.endgames.gt(0);
  }

  get isCelestialInfinityUnlocked() {
    return new Decimal(this._player.endgame?.celDimExpansion?.celestialInfinities).gt(0) ||
      this.isCelestialEternityUnlocked;
  }

  get isCelestialEternityUnlocked() {
    return new Decimal(this._player.endgame?.celDimExpansion?.celestialEternities).gt(0);
  }

  get isDivinityUnlocked() {
    return this._player.celestials?.pelle?.divinities > 0;
  }

  get isCondenseUnlocked() {
    return new Decimal(this._player.celestials?.pelle?.divinity?.condenses).gt(0) || this.isSupernovaUnlocked;
  }

  get isSupernovaUnlocked() {
    return new Decimal(this._player.celestials?.pelle?.divinity?.supernovae).gt(0);
  }

  get isMetaUnlocked() {
    return new Decimal(this._player?.meta?.metas).gt(0);
  }

  get hasPelleCompletion() {
    return new Decimal(this._player?.pelleResets).gt(0);
  }

  get hasFullCompletion() {
    return this._player.records?.fullGameCompletions > 0;
  }

  static get current() {
    return new PlayerProgress(player);
  }

  static of(player) {
    return new PlayerProgress(player);
  }

  static infinityUnlocked() {
    return PlayerProgress.current.isInfinityUnlocked;
  }

  static hasBroken() {
    return player.break || this.isEternityUnlocked || this.isRealityUnlocked;
  }

  static replicantiUnlocked() {
    return Replicanti.areUnlocked || this.isEternityUnlocked;
  }

  static eternityUnlocked() {
    return PlayerProgress.current.isEternityUnlocked;
  }

  static dilationUnlocked() {
    return TimeStudy.dilation.isBought;
  }

  static realityUnlocked() {
    return PlayerProgress.current.isRealityUnlocked;
  }

  static endgameUnlocked() {
    return PlayerProgress.current.isEndgameUnlocked;
  }

  static compressionUnlocked() {
    return EndgameMastery.timeCompression.isBought;
  }

  static celestialInfinityUnlocked() {
    return PlayerProgress.current.isCelestialInfinityUnlocked;
  }

  static celestialEternityUnlocked() {
    return PlayerProgress.current.isCelestialEternityUnlocked;
  }

  static divinityUnlocked() {
    return PlayerProgress.current.isDivinityUnlocked;
  }

  static condenseUnlocked() {
    return PlayerProgress.current.isCondenseUnlocked;
  }

  static supernovaUnlocked() {
    return PlayerProgress.current.isSupernovaUnlocked;
  }

  static metaUnlocked() {
    return PlayerProgress.current.isMetaUnlocked;
  }

  static seenAlteredSpeed() {
    const ec12 = EternityChallenge(12);
    return this.realityUnlocked() || ec12.completions > 0 || ec12.isRunning;
  }

  static challengeCompleted() {
    return NormalChallenges.all.slice(1).some(c => c.isCompleted);
  }

  static infinityChallengeCompleted() {
    return InfinityChallenges.all.some(c => c.isCompleted);
  }
}
