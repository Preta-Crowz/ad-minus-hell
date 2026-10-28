<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import { hellInformationEntries } from "./hell-information-entries";

const resolve = prop => (typeof prop === "function" ? prop() : prop);

export default {
  name: "HellInformationTab",
  components: {
    CelestialQuoteHistory
  },
  data() {
    return {
      options: [],
      currentKey: player.options.hellInfoEntry,
      isOpen: false,
      lines: [],
    };
  },
  computed: {
    currentName() {
      return this.options.find(e => e.key === this.currentKey)?.name ?? "";
    }
  },
  watch: {
    currentKey(key) {
      // Ignore the transient null while no entry is available
      if (key) player.options.hellInfoEntry = key;
    }
  },
  methods: {
    select(key) {
      this.currentKey = key;
      this.isOpen = false;
    },
    update() {
      this.options = hellInformationEntries
        .filter(e => resolve(e.isActive))
        .map(e => ({ key: e.key, name: resolve(e.name), lines: e.lines }));
      if (!this.options.some(e => e.key === this.currentKey)) {
        this.currentKey = this.options[0]?.key ?? null;
      }
      const entry = this.options.find(e => e.key === this.currentKey);
      this.lines = entry ? entry.lines.map(resolve) : [];
    },
  }
};
</script>

<template>
  <div class="c-hell-info-tab">
    <CelestialQuoteHistory celestial="squarecubic" />
    <div class="c-hell-info-notice">
      All effects and mechanics of Hell apply only while you are inside of Hell.
    </div>
    <div class="l-hell-info-selector">
      <label>Show information:</label>
      <div class="l-hell-info-dropdown">
        <button
          class="c-hell-info-select"
          @click="isOpen = !isOpen"
        >
          {{ currentName }}
        </button>
        <div
          v-if="isOpen"
          class="c-hell-info-list"
        >
          <div
            v-for="option in options"
            :key="option.key"
            class="c-hell-info-option"
            :class="{ 'c-hell-info-option--active': option.key === currentKey }"
            @click="select(option.key)"
          >
            {{ option.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="c-hell-info-content">
      <div
        v-for="(line, index) in lines"
        :key="index"
        class="c-hell-info-line"
        v-html="line"
      />
    </div>
  </div>
</template>

<style scoped>
.c-hell-info-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
}

.c-hell-info-notice {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: bold;
  color: #b3120f;
  text-shadow: 0 0 1rem #b3120f;
  text-align: center;
}

.l-hell-info-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
}

.l-hell-info-dropdown {
  position: relative;
}

.c-hell-info-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 60rem;
  overflow-y: auto;
  background-color: var(--color-base);
  border: var(--var-border-width, 0.2rem) solid #b3120f;
  border-radius: var(--var-border-radius, 0.5rem);
}

.c-hell-info-option {
  padding: 0.6rem 1rem;
  font-family: Typewriter;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
  cursor: pointer;
}

.c-hell-info-option:hover,
.c-hell-info-option--active {
  background-color: #b3120f;
}

.c-hell-info-select {
  min-width: 32rem;
  height: 4rem;
  font-family: Typewriter;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
  background-color: var(--color-base);
  border: var(--var-border-width, 0.2rem) solid #b3120f;
  border-radius: var(--var-border-radius, 0.5rem);
  cursor: pointer;
}

.c-hell-info-content {
  width: 100%;
  max-width: 100rem;
  padding: 1rem 2rem;
  border: var(--var-border-width, 0.2rem) solid #b3120f;
  border-radius: var(--var-border-radius, 0.5rem);
}

.c-hell-info-line {
  margin: 0.5rem 0;
  font-size: 1.4rem;
  color: var(--color-text);
}
</style>
