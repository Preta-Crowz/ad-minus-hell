<script>
export default {
  name: "EndgameButton",
  data() {
    return {
      canEndgame: false,
      showPelleGlow: false,
      gainedCP: 0,
      gainedDP: 0,
      gainedEssence: new Decimal(),
      isFlipped: false
    };
  },
  computed: {
    formatCPGain() {
      return `Celestial Points gained: ${format(this.gainedCP, 2)}`;
    },
    formatDPGain() {
      return `Doomed Particles gained: ${format(this.gainedDP, 2)}`;
    },
    classObject() {
      return {
        "c-endgame-button--unlocked": this.canEndgame,
        "c-endgame-button--locked": !this.canEndgame,
        "c-endgame-button--special": this.showPelleGlow,
      };
    }
  },
  methods: {
    update() {
      this.canEndgame = Pelle.isDoomed && player.antimatter.gte(DC.E9E15) &&
        !Slabdrill.isCursed && (!Slabdrill.isDestroyed || player.celestials.slabdrill.hasBoughtNinthDimension);
      this.showPelleGlow = true;
      this.isFlipped = player.universes.current === 2;
      this.gainedEssence.copyFrom(this.canEndgame ? Endgame.challengersEssenceGain() : DC.D0);
      if (!this.canEndgame) {
        this.gainedCP = 0;
        this.gainedDP = 0;
        return;
      }
      this.gainedCP = gainedCelestialPoints();
      this.gainedDP = gainedDoomedParticles();
    },
    handleClick() {
      if (this.canEndgame) Endgame.hotkeyReset();
    }
  }
};
</script>

<template>
  <div class="l-endgame-button">
    <button
      class="c-endgame-button infotooltip"
      :class="classObject"
      @click="handleClick"
    >
      <div class="l-endgame-button__contents">
        <template v-if="canEndgame">
          <div class="c-endgame-button__header">
            Enter the Endgame
          </div>
          <div>{{ formatCPGain }}</div>
          <div>{{ formatDPGain }}</div>
        </template>
        <template v-else>
          <div>
            Reach {{ format("e9e15", 2, 2) }} {{ isFlipped ? "Matter" : "Antimatter" }} to unlock the ability to Enter the Endgame
          </div>
        </template>
        <div
          v-if="canEndgame"
          class="infotooltiptext"
        >
          <div>Another End, and a New Beginning...</div>
          <div v-if="gainedEssence.gt(0)">{{ quantify("Challengers Essence", gainedEssence, 2) }}</div>
          <div v-else>Challengers Essence requires ee100 Antimatter in a Doomed Reality.</div>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>
