<script>
import BigCrunchButton from "../BigCrunchButton";
import CursedHeader from "../CursedHeader";
import DivinityButton from "../DivinityButton";
import HeaderBlackHole from "../HeaderBlackHole";
import HeaderChallengeDisplay from "../HeaderChallengeDisplay";
import HeaderChallengeEffects from "../HeaderChallengeEffects";
import HeaderPrestigeGroup from "../HeaderPrestigeGroup";
import NewsTicker from "../NewsTicker";
import NullifyButton from "../NullifyButton";

import GameSpeedDisplay from "@/components/GameSpeedDisplay";


export default {
  name: "ModernUi",
  components: {
    BigCrunchButton,
    CursedHeader,
    DivinityButton,
    NullifyButton,
    HeaderChallengeDisplay,
    HeaderChallengeEffects,
    NewsTicker,
    HeaderBlackHole,
    HeaderPrestigeGroup,
    GameSpeedDisplay,
  },
  data() {
    return {
      bigCrunch: false,
      cursedCore: false,
      divine: false,
      nullify: false,
      hasReality: false,
    };
  },
  computed: {
    news() {
      return this.$viewModel.news && !this.cursedCore;
    },
    topMargin() {
      if (this.cursedCore) return "width: 100%; margin-left: 0";
      return this.$viewModel.news ? "" : "margin-top: 3.9rem";
    },
    bottomBorder() {
      return this.cursedCore ? "" : "border-bottom: 0.1rem solid var(--color-good)";
    }
  },
  methods: {
    update() {
      const crunchButtonVisible = !player.break && Player.canCrunch;
      this.divine = Pelle.isDoomed && player.antimatter.gte(DC.ENUMMAX);
      this.nullify = Currency.nullMatter.value.gte(DC.NUMMAX) && !player.endgame.largeHadronCollider.void.nullified;
      this.cursedCore = Slabdrill.coreActive;
      this.bigCrunch = crunchButtonVisible && Time.bestInfinityRealTime.totalMinutes.gt(1);
      this.hasReality = PlayerProgress.realityUnlocked();
    },
    handleClick() {
      if (PlayerProgress.infinityUnlocked()) manualBigCrunchResetRequest();
      else Modal.bigCrunch.show();
    }
  },
};
</script>

<template>
  <div id="page">
    <link
      rel="stylesheet"
      type="text/css"
      href="stylesheets/new-ui-styles.css"
    >
    <div
      class="game-container"
      :style="topMargin"
    >
      <NewsTicker
        v-if="news"
      />
      <BigCrunchButton v-if="!cursedCore" />
      <DivinityButton v-if="!cursedCore" />
      <NullifyButton v-if="!cursedCore" />
      <div
        v-if="!bigCrunch && !divine && !nullify"
        class="tab-container"
      >
        <HeaderPrestigeGroup />
        <div
          class="information-header"
          :style="bottomBorder"
        >
          <HeaderChallengeDisplay v-if="!cursedCore" />
          <HeaderChallengeEffects v-if="!cursedCore" />
          <GameSpeedDisplay v-if="hasReality && !cursedCore" />
          <br v-if="hasReality && !cursedCore">
          <HeaderBlackHole v-if="!cursedCore" />
          <CursedHeader v-if="cursedCore" />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
