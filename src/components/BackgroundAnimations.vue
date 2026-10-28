<script>
import BlobSnowflakes from "@/components/BlobSnowflakes";
import Hadrons from "@/components/tabs/large-hadron-collider/Hadrons";
import TachyonParticles from "@/components/tabs/time-dilation/TachyonParticles";
import MetaReset from "@/components/MetaReset";

export default {
  name: "BackgroundAnimations",
  components: {
    BlobSnowflakes,
    Hadrons,
    TachyonParticles,
    MetaReset
  },
  data() {
    return {
      animations: {
        blob: false,
        animateHadrons: false,
        animateTachyons: false,
        metaReset: false
      }
    };
  },
  methods: {
    update() {
      this.animations.blob = Theme.currentName() === "S11";
      this.animations.animateHadrons = player.options.animations.hadrons &&
        Tabs.current[this.$viewModel.subtab].name === "Large Hadron Collider";
      this.animations.animateTachyons = player.options.animations.tachyonParticles &&
        Tabs.current[this.$viewModel.subtab].name === "Time Dilation";
      this.animations.metaReset = MetaAnimation;
    }
  },
};
</script>

<template>
  <div
    id="ui-background-animations"
    class="l-background-animations"
  >
    <BlobSnowflakes v-if="animations.blob" />
    <Hadrons v-if="animations.animateHadrons" />
    <TachyonParticles v-if="animations.animateTachyons" />
    <MetaReset v-if="animations.metaReset"/>
  </div>
</template>

<style scoped>

</style>