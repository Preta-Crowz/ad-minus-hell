<script>
import BigCrunchButton from "../BigCrunchButton";
import CursedHeader from "../CursedHeader";
import DivinityButton from "../DivinityButton";
import GameHeader from "../GameHeader";
import NewsTicker from "../NewsTicker";
import NullifyButton from "../NullifyButton";

import ClassicSubtabBar from "./ClassicSubtabBar";
import ClassicTabBar from "./ClassicTabBar";
import EternityPointsHeader from "@/components/EternityPointsHeader";
import InfinityPointsHeader from "@/components/InfinityPointsHeader";

export default {
  name: "ClassicUi",
  components: {
    GameHeader,
    ClassicSubtabBar,
    ClassicTabBar,
    NewsTicker,
    InfinityPointsHeader,
    EternityPointsHeader,
    BigCrunchButton,
    CursedHeader,
    DivinityButton,
    NullifyButton
  },
  data() {
    return {
      bigCrunch: false,
      cursedCore: false,
      divine: false,
      nullify: false,
      smallCrunch: false,
    };
  },
  computed: {
    tab: () => Tabs.current,
    news() {
      return this.$viewModel.news;
    }
  },
  methods: {
    update() {
      const crunchButtonVisible = !player.break && Player.canCrunch;
      this.divine = Pelle.isDoomed && player.antimatter.gte(DC.ENUMMAX);
      this.nullify = Currency.nullMatter.value.gte(DC.NUMMAX) && !player.endgame.largeHadronCollider.void.nullified;
      this.cursedCore = Slabdrill.coreActive;
      this.bigCrunch = crunchButtonVisible && Time.bestInfinityRealTime.totalMinutes.gt(1);
    }
  },
};
</script>

<template>
  <div
    id="container"
    class="container c-old-ui l-old-ui"
  >
    <link
      rel="stylesheet"
      type="text/css"
      href="stylesheets/old-ui.css"
    >
    <BigCrunchButton />
    <DivinityButton />
    <NullifyButton />
    <template v-if="!bigCrunch && !divine && !nullify">
      <NewsTicker
        v-if="news"
        class="l-old-ui__news-bar"
      />
      <GameHeader
        v-if="!cursedCore"
        class="l-old-ui__header"
      />
      <CursedHeader v-else />
      <ClassicTabBar />
      <component
        :is="tab.config.before"
        v-if="tab.config.before"
      />
      <ClassicSubtabBar />
      <div class="l-old-ui__page">
        <slot />
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>
