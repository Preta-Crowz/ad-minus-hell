<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "RemakeUpgrade",
  components: {
    PrimaryToggleButton,
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    HintText
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      canBeBought: false,
      isBought: false,
      isUseless: false,
      isPermanentlyLocked: false,
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-reality-upgrade-btn--useless": this.isUseless,
        "c-reality-upgrade-btn--bought": this.isBought && !this.isUseless,
        "c-reality-upgrade-btn--locked": this.isPermanentlyLocked,
        "c-reality-upgrade-btn--unavailable": !this.isBought && !this.canBeBought && !this.isPermanentlyLocked,
        "o-pelle-disabled": this.isUseless,
        "o-pelle-disabled-pointer": this.isUseless,
        "o-size": true,
      };
    },
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.canBeBought = upgrade.canBeBought;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isUseless = upgrade.isUseless || false;
      this.isPermanentlyLocked = upgrade.isPermanentlyLocked || false;
    },
  }
};
</script>

<template>
    <button
      :class="classObject"
      class="l-reality-upgrade-btn c-reality-upgrade-btn"
      style="width: 20rem; height: 13.5rem"
      @click.exact="upgrade.purchase()"
    >
      <HintText
        type="realityUpgrades"
        class="l-hint-text--reality-upgrade c-hint-text--reality-upgrade"
      >
        {{ upgrade.name }}
      </HintText>
      <span>
        <template v-if="config.descriptionParts">
          <span
            v-for="(part, index) in config.descriptionParts"
            :key="index"
            :class="{ 'o-pelle-disabled': part.conflict }"
          >
            {{ part.text.trim() }}{{ index < config.descriptionParts.length - 1 ? " " : "" }}
          </span>
        </template>
        <template v-else>
          <DescriptionDisplay :config="config" />
        </template>
        <div v-if="config.overlapNote">{{ config.overlapNote }}</div>
        <template>
          <EffectDisplay
            :config="config"
            br
          />
          <CostDisplay
            v-if="!isBought"
            :config="config"
            br
            name="Challengers Essence"
          />
        </template>
      </span>
    </button>
</template>

<style scoped>

.o-size{
  height: 160px;
}
  
</style>
