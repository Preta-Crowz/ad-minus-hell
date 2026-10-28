<script>
import { createEntryInfo } from "./breakdown-entry-info";
import MultiplierBreakdownEntry from "./MultiplierBreakdownEntry";

const MULT_TAB_OPTIONS = [
  { id: 0, key: "AM", text: "Antimatter Production" },
  { id: 1, key: "tickspeed", text: "Tickspeed" },
  { id: 2, key: "AD", text: "Antimatter Dimensions" },
  { id: 3, key: "IP", text: "Infinity Points" },
  { id: 4, key: "ID", text: "Infinity Dimensions" },
  { id: 5, key: "infinities", text: "Infinities" },
  { id: 6, key: "replicanti", text: "Replicanti Speed" },
  { id: 7, key: "EP", text: "Eternity Points" },
  { id: 8, key: "TD", text: "Time Dimensions" },
  { id: 9, key: "eternities", text: "Eternities" },
  { id: 10, key: "DT", text: "Dilated Time" },
  { id: 11, key: "gamespeed", text: "Game Speed" },
  { id: 12, key: "TP", text: "Tachyon Particles" },
  { id: 13, key: "galaxies", text: "Galaxies" },
  { id: 14, key: "tickspeedUpgrades", text: "Tickspeed Upgrades" },
];

export default {
  name: "MultiplierBreakdownTab",
  components: {
    MultiplierBreakdownEntry
  },
  data() {
    return {
      availableOptions: [],
      currentID: player.options.multiplierTab.currTab,
    };
  },
  computed: {
    currentKey() {
      return MULT_TAB_OPTIONS.find(opt => opt.id === this.currentID).key;
    },
    resource() {
      return createEntryInfo(`${this.currentKey}_total`);
    },
    resourceSymbols() {
      return GameDatabase.multiplierTabValues[this.currentKey].total.overlay;
    }
  },
  methods: {
    update() {
      this.availableOptions = MULT_TAB_OPTIONS.map(opt => ({
        ...opt,
        isActive: this.checkActiveKey(opt.key)
      })).filter(opt => opt.isActive);
      if (!this.availableOptions.some(option => option.id === this.currentID)) {
        this.currentID = this.availableOptions[0]?.id ?? 0;
        player.options.multiplierTab.currTab = this.currentID;
      }
    },
    checkActiveKey(key) {
      const act = GameDatabase.multiplierTabValues[key].total.isActive;
      return typeof act === "function" ? act() : act;
    },
    accessProp(prop) {
      return typeof prop === "function" ? prop() : prop;
    },
    changeSubtab() {
      player.options.multiplierTab.currTab = this.currentID;
    }
  }
};
</script>

<template>
  <div class="c-stats-tab">
    <div class="l-multiplier-selector">
      <label for="multiplier-breakdown-select">Show breakdown:</label>
      <select
        id="multiplier-breakdown-select"
        v-model.number="currentID"
        class="c-multiplier-breakdown-select"
        @change="changeSubtab"
      >
        <option
          v-for="option in availableOptions"
          :key="option.key"
          :value="option.id"
        >
          {{ option.text }}
        </option>
      </select>
    </div>
    <div class="c-list-container">
      <span
        v-for="symbol in resourceSymbols"
        :key="symbol"
      >
        <span
          class="c-symbol-overlay"
          v-html="symbol"
        />
      </span>
      <MultiplierBreakdownEntry
        :key="resource.key"
        :resource="resource"
        :is-root="true"
      />
      <div class="c-multiplier-tab-text-line">
        Note: Entries are only expandable if they contain multiple sources which can be different values.
        For example, any effects which affect all Dimensions of any type equally will not expand into a
        list of eight identical numbers.
        <br>
        <b>
          Some entries may cause lag if expanded out fully. Resizing happens over 200 ms (instead of instantly)
          in order to reduce possible adverse effects due to photosensitivity. This may cause some visual weirdness
          after prestige events.
        </b>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-list-container {
  position: relative;
  width: 100rem;
}

.l-multiplier-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
}

.c-multiplier-breakdown-select {
  min-width: 24rem;
  height: 4rem;
  font-family: Typewriter;
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-text);
  background-color: var(--color-base);
  border: var(--var-border-width, 0.2rem) solid;
  border-radius: var(--var-border-radius, 0.5rem);
  cursor: pointer;
}

.c-multiplier-tab-text-line {
  color: var(--color-text);
  font-size: 1.3rem;
}

.c-symbol-overlay {
  display: flex;
  width: 100%;
  height: 100%;
  top: -5%;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-size: 40rem;
  color: var(--color-text);
  text-shadow: 0 0 3rem;
  pointer-events: none;
  user-select: none;
  opacity: 0.2;
  z-index: 1;
}
</style>
