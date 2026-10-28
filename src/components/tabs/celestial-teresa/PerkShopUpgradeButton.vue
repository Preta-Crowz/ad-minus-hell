<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "PerkShopUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAvailableForPurchase: false,
      isCapped: false,
      isCharged: false,
      otherCurr: false,
      displayEffect: true,
      chargesLeft: 0,
      viewingCharge: false,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    classObject() {
      return {
        "o-teresa-shop-button": true,
        "o-teresa-shop-button--available": this.viewingCharge
          ? this.upgrade.canCharge
          : this.isAvailableForPurchase && !this.isCapped,
        "o-teresa-shop-button--capped": this.viewingCharge
          ? !this.upgrade.canCharge
          : this.isCapped || this.isCharged,
        "o-teresa-shop-button--pelle-disabled": this.isDoomed &&
          (this.upgrade === PerkShopUpgrade.musicGlyph || this.upgrade === PerkShopUpgrade.fillMusicGlyph)
      };
    },
    effectConfig() {
      return {
        effect: () => this.upgrade.chargedValue,
        formatEffect: this.upgrade.config.formatEffect
      };
    },
  },
  methods: {
    update() {
      this.isAvailableForPurchase = this.upgrade.isAvailableForPurchase;
      this.isCapped = this.upgrade.isCapped;
      this.isCharged = this.upgrade.isCharged;
      this.otherCurr = this.upgrade === PerkShopUpgrade.addCharges;
      this.displayEffect = this.upgrade.displayEffect;
      this.chargesLeft = Teresa.chargesLeft;
      this.viewingCharge = this.upgrade.viewCharge;
    },
    performActions() {
      if (!this.upgrade.viewCharge) this.upgrade.purchase();
      else if (this.upgrade.canCharge) this.upgrade.charge();
    }
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      :class="classObject"
      @click="performActions"
    >
      <DescriptionDisplay
        :config="upgrade.config"
        :length="70"
      />
      <span v-if="viewingCharge && !isCharged && !upgrade.canCharge">
        <br>
        {{ chargesLeft <= 0 ? "No charges available." : `Requires ${formatInt(upgrade.chargeRequirement)} purchases; you have ${formatInt(upgrade.boughtAmount)}.` }}
      </span>
      <br>
      <EffectDisplay
        v-if="displayEffect"
        :config="effectConfig"
      />
      <br>
      <CostDisplay
        v-if="!isCapped && !viewingCharge"
        :config="upgrade.config"
        :name="otherCurr ? 'Celestial Point' : 'Perk Point'"
      />
    </button>
  </div>
</template>

<style scoped>
.o-teresa-shop-button--pelle-disabled {
  text-decoration: line-through;
  cursor: auto;
}
</style>
