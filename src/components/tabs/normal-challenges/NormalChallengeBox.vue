<script>
import ChallengeBox from "@/components/ChallengeBox";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "NormalChallengeBox",
  components: {
    ChallengeBox,
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    challenge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDoomed: false,
      isDisabled: false,
      isRunning: false,
      isCompleted: false,
      isBroken: false,
      isUnlocked: false,
      lockedAt: new Decimal(),
      reward: ""
    };
  },
  computed: {
    showingCharged() {
      return (ui.view.shiftDown || this.challenge.isCharged) && Ascensions.oc3A.isUnlocked &&
        player.endgame.overcharge.allowComplex && this.challenge.config.charged !== undefined;
    },
    descriptionDisplayConfig() {
      if (this.isUnlocked) {
        return this.challenge.config;
      }
      return {
        description: `Infinity ${formatInt(this.challenge.config.lockedAt)} times to unlock.`
      };
    },
    name() {
      return `C${this.challenge.id}`;
    },
    overrideLabel() {
      if (Hell.isInside && Hell.trappedNormalChallenges.includes(this.challenge.id)) return "Trapped";
      return this.isBroken ? "Broken" : "";
    },
  },
  methods: {
    update() {
      this.isDisabled = this.challenge.isDisabled;
      this.isUnlocked = this.challenge.isUnlocked;
      // This stops normal challenges from appearing like they're running during IC1
      this.isRunning = this.challenge.isOnlyActiveChallenge;
      this.lockedAt = this.challenge.config.lockedAt;
      this.isBroken = Enslaved.isRunning && Enslaved.BROKEN_CHALLENGES.includes(this.challenge.id);
      this.isCompleted = this.challenge.isCompleted && !this.isBroken;
      const reward = this.showingCharged ? this.challenge.config.charged.reward : this.challenge.config.reward;
      this.reward = typeof reward === "function" ? reward() : reward;
    }
  }
};
</script>

<template>
  <ChallengeBox
    :name="name"
    :is-unlocked="isUnlocked"
    :is-running="isRunning"
    :is-completed="isCompleted"
    :override-label="overrideLabel"
    :locked-at="lockedAt"
    class="c-challenge-box--normal"
    @start="challenge.requestStart()"
  >
    <template #top>
      <DescriptionDisplay :config="descriptionDisplayConfig" />
    </template>
    <template #bottom>
      <span :class="{ 'o-pelle-disabled': isDisabled }">Reward: {{ reward }}</span>
      <div v-if="showingCharged && challenge.config.charged.effect">
        <EffectDisplay
          br
          :config="challenge.config.charged"
        />
      </div>
    </template>
  </ChallengeBox>
</template>

<style scoped>

</style>
