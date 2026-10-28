<script>
import NullUpgradeButton from "./NullUpgradeButton";

export default {
  name: "NullUpgradesTabComponent",
  components: {
    NullUpgradeButton
  },
  computed: {
    grid() {
      return [
        [
          LHCNullUpgrade.antimatterDimensionMult,
          LHCNullUpgrade.infinityPointMult,
          LHCNullUpgrade.infinityMult,
          LHCNullUpgrade.infinityDimensionMult,
          LHCNullUpgrade.replicantiSpeedMult,
        ],
        [
          LHCNullUpgrade.eternityPointMult,
          LHCNullUpgrade.timeDimensionMult,
          LHCNullUpgrade.eternityMult,
          LHCNullUpgrade.dilatedTimeMult,
          LHCNullUpgrade.tachyonParticleMult,
        ],
        [
          LHCNullUpgrade.ncComp,
          LHCNullUpgrade.alwaysBroken,
          LHCNullUpgrade.icComp,
          LHCNullUpgrade.repUnl,
          LHCNullUpgrade.eterMiles
        ],
        [
          LHCNullUpgrade.limerick1,
          LHCNullUpgrade.limerick2,
          LHCNullUpgrade.limerick3,
          LHCNullUpgrade.limerick4,
          LHCNullUpgrade.limerick5
        ]
      ];
    }
  },
  methods: {
    btnClassObject(column) {
      return {
        "l-null-upgrade-grid__cell": true,
        "o-null-upgrade-btn--multiplier": column === 1 || column === 2
      };
    },
    maxAll() {
      buyMaxNullUpgrades();
    },
    timeDisplayShort(time) {
      return timeDisplayShort(time);
    }
  }
};
</script>

<template>
  <div class="l-null-upgrades-tab">
    <button
      class="o-primary-btn"
      @click="maxAll"
    >
      Max all
    </button>
    <div class="l-null-upgrade-grid l-null-upgrades-tab__grid">
      <div
        v-for="(column, columnId) in grid"
        :key="columnId"
        class="l-null-upgrade-grid__row"
      >
        <NullUpgradeButton
          v-for="upgrade in column"
          :key="upgrade.id"
          :upgrade="upgrade"
          :class="btnClassObject(columnId)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
