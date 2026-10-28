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

import BackgroundAnimations from "@/components/BackgroundAnimations";
import GameUiComponentFixed from "@/components/GameUiComponentFixed";

import GameSpeedDisplay from "@/components/GameSpeedDisplay";

import { S12Windows } from "./windows";


export default {
  name: "S12Ui",
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

    GameUiComponentFixed,
    BackgroundAnimations,
  },
  data() {
    return {
      bigCrunch: false,
      cursedCore: false,
      divine: false,
      nullify: false,
      hasReality: false,
      tabName: "",
      S12Windows,
    };
  },
  computed: {
    news() {
      return this.$viewModel.news;
    },
    topPadding() {
      return this.$viewModel.news ? "" : "padding-top: 3.9rem";
    },
    isOldUi() {
      return !this.$viewModel.newUI;
    },
  },
  methods: {
    update() {
      const crunchButtonVisible = !player.break && Player.canCrunch;
      this.divine = Pelle.isDoomed && player.antimatter.gte(DC.ENUMMAX);
      this.nullify = Currency.nullMatter.value.gte(DC.NUMMAX) && !player.endgame.largeHadronCollider.void.nullified;
      this.cursedCore = Slabdrill.coreActive;
      this.bigCrunch = crunchButtonVisible && Time.bestInfinityRealTime.totalMinutes.gt(1);
      this.hasReality = PlayerProgress.realityUnlocked();
      this.tabName = Tabs.current[this.$viewModel.subtab].name;
    },
  },
};
</script>

<template>
  <div
    id="page"
    class="c-s12-window__outer"
    :class="S12Windows.isMinimised ? 'c-s12-window__outer--minimised' : ''"
  >
    <link
      rel="stylesheet"
      type="text/css"
      :href="isOldUi ? 'stylesheets/old-ui.css' : 'stylesheets/new-ui-styles.css'"
    >
    <span
      class="c-s12-close-button"
      @click="S12Windows.isMinimised = true"
    />
    <span class="c-modal__title">
      {{ tabName }}
    </span>
    <div
      class="game-container c-s12-window__inner"
      :class="isOldUi ? 'c-old-ui l-old-ui' : ''"
      :style="topPadding"
    >
      <GameUiComponentFixed />
      <BackgroundAnimations />
      <div class="c-s12-window__content-container">
        <NewsTicker
          v-if="news"
        />
        <BigCrunchButton />
        <DivinityButton />
        <NullifyButton />
        <div
          v-if="!bigCrunch && !divine && !nullify"
          class="tab-container"
        >
          <HeaderPrestigeGroup v-if="!cursedCore" />
          <div
            v-if="!cursedCore"
            class="information-header"
          >
            <HeaderChallengeDisplay />
            <HeaderChallengeEffects />
            <GameSpeedDisplay v-if="hasReality" />
            <br v-if="hasReality">
            <HeaderBlackHole />
          </div>
          <CursedHeader v-else />
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#page {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.5);
  background-image: var(--s12-background-gradient);
  margin-top: 0;
  padding: 2.4rem 1rem 1rem;

  -webkit-backdrop-filter: blur(1rem);

  backdrop-filter: blur(1rem);
}

.c-s12-window__outer {
  transition: opacity 0.3s, transform 0.4s, visibility 0.3s;

  transform-style: preserve-3d;
}

.c-s12-window__outer--minimised {
  visibility: hidden;
  opacity: 0;
  /* stylelint-disable-next-line unit-allowed-list */
  transform: rotateX(90deg) scale(0.7);
  pointer-events: none;
}

.c-s12-window__inner {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0;
  background-color: #111014;
  border: 0.15rem solid var(--s12-border-color);
  border-radius: 0.15rem;
  box-shadow: 0 0 0.4rem 0.2rem rgba(255, 255, 255, 0.5);
}

.c-old-ui.c-s12-window__inner {
  background-color: white;
}

.c-s12-window__content-container {
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  position: relative;

  scrollbar-gutter: stable both-edges;
}

.c-modal__title {
  font-family: "Segoe UI", Typewriter;
  color: black;
}
</style>
