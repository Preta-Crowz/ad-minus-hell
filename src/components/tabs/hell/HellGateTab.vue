<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";

export default {
  name: "HellGateTab",
  components: {
    CelestialQuoteHistory
  },
  data() {
    return {
      isInside: false,
      hasVisited: false
    };
  },
  computed: {
    buttonText() {
      if (this.isInside) return "Leave Hell";
      return this.hasVisited ? "Return to Hell" : "Enter the Gate";
    }
  },
  methods: {
    update() {
      this.isInside = Hell.isInside;
      this.hasVisited = Hell.hasVisited;
    },
    toggleGate() {
      if (this.isInside) Hell.exit();
      else if (this.hasVisited) Hell.enter();
      else Modal.enterHell.show();
    },
    resetHell() {
      const message = this.isInside
        ? "This will erase all progress inside of Hell. Your progress outside is kept. Continue?"
        : "This will erase your saved Hell progress. Your progress outside is kept. Continue?";
      if (window.confirm(message)) Hell.reset();
    }
  }
};
</script>

<template>
  <div class="l-hell-tab">
    <CelestialQuoteHistory celestial="squarecubic" />
    <div class="c-hell-title">
      Gate to Hell
    </div>
    <div class="c-hell-text">
      <template v-if="isInside">
        You are inside of Hell. Your progress outside is kept safe until you leave.
      </template>
      <template v-else>
        The Gate to Hell awaits you... with something inside of it.
      </template>
    </div>
    <button
      class="o-hell-gate-btn"
      @click="toggleGate"
    >
      {{ buttonText }}
    </button>
    <button
      v-if="isInside || hasVisited"
      class="o-hell-gate-btn o-hell-reset-btn"
      @click="resetHell"
    >
      Reset Hell (temporary)
    </button>
  </div>
</template>

<style scoped>
.l-hell-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
}

.c-hell-title {
  font-size: 3rem;
  font-weight: bold;
  color: #b3120f;
  text-shadow: 0 0 1rem #b3120f;
}

.c-hell-text {
  margin-top: 1rem;
  font-size: 1.5rem;
}

.o-hell-gate-btn {
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  font-family: Typewriter, serif;
  font-size: 1.8rem;
  color: #ff3b30;
  background: #1a0000;
  border: 0.2rem solid #b3120f;
  border-radius: 0.5rem;
  cursor: pointer;
  transition-duration: 0.2s;
}

.o-hell-reset-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  font-size: 1.2rem;
}

.o-hell-gate-btn:hover {
  color: #fff;
  background: #b3120f;
  box-shadow: 0 0 1.5rem #b3120f;
}
</style>
