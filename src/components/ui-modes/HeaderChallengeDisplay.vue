<script>
import FailableEcText from "./FailableEcText";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "HeaderChallengeDisplay",
  components: {
    FailableEcText,
    PrimaryButton
  },
  data() {
    return {
      activityTokens: [],
      infinityUnlocked: false,
      showExit: false,
      exitText: "",
      resetCelestial: false,
      inPelle: false,
      inHell: false,
      hellSeenOutside: false,
      hellPhase: 0,
      hellText: "",
      hellTimers: [],
    };
  },
  beforeDestroy() {
    this.hellTimers.forEach(t => clearTimeout(t));
  },
  computed: {
    // hellPhase: 0 = short text only, 1 = full list shown, 2 = full list collapsing
    hellLongText() {
      const autobuyers = [2, 4, 6, 7].map(i => `${i}${["st", "nd", "rd"][i - 1] || "th"} Antimatter Dimension Autobuyer Challenge`);
      return [
        ...[1, 2, 3, 4, 5].map(i => `New Game Minus ${i}`),
        "the Transient Universe", "the Tangible Universe",
        "Teresa's Reality", "Effarig's Reality", "The Nameless Ones' Reality", "V's EX Reality", "Ra's Reality",
        "Lai'tela's Reality", "Glitch's Reality", "Alpha's Reality", "Cursed Reality",
        "Quantum Challenge 6", "Quantum Challenge 8",
        "Time Dilation", "Time Compression",
        "Eternity Challenge 12 (1/5)", "Infinity Challenge 3",
        ...autobuyers, "Automated Big Crunches Challenge",
        "The Void (Nullified)", "The Overcharge (Level 4)",
      ].join(" + ") + " in a Doomed Reality. Good luck.";
    },
    parts() {
      // We need activityToken for NC/IC/EC because plain check of WhateverChallenge.isRunning
      // won't trigger display update if we, say, switch from one challenge to another
        function universe(id, name, tab) {
          return {
            name: () => `the ${name} Universe`,
            isActive: token => token,
            activityToken: () => Universes.isIn(id),
            uniName: () => tab,
          };
        }
      function celestialReality(celestial, name, tab) {
        return {
          name: () => `${name} ${celestial.isRunningExtreme ? "EX" : ""} Reality`,
          isActive: token => token,
          activityToken: () => celestial.isRunning || celestial.isRunningExtreme,
          tabName: () => tab,
        };
      }
      return [
          universe(1, "Transient", "transient"),
          universe(2, "Tangible", "tangible"),
        celestialReality(Teresa, "Teresa's", "teresa"),
        celestialReality(Effarig, "Effarig's", "effarig"),
        celestialReality(Enslaved, "The Nameless Ones'", "enslaved"),
        celestialReality(V, "V's", "v"),
        celestialReality(Ra, "Ra's", "ra"),
        celestialReality(Laitela, "Lai'tela's", "laitela"),
        celestialReality(Glitch, "Glitch's", "glitch"),
          celestialReality(Alpha, "Alpha's", "alpha"),
        {
          name: () => "Time Dilation",
          isActive: token => token,
          activityToken: () => player.dilation.active
        },
        {
          name: token => `Eternity Challenge ${token}`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.eternity.current
        },
        {
          name: token => `Infinity Challenge ${token}`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.infinity.current
        },
        {
          name: token => `${NormalChallenge(token).config.name} Challenge`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.normal.current
        },
        {
          name: () => `The Void${LHC.nullifiedVoidRunning ? " (Nullified)" : ""}`,
          isActive: token => token,
          activityToken: () => LHC.voidRunning || LHC.nullifiedVoidRunning
        },
      ];
    },
    activeChallengeNames() {
      const names = [];
      for (let i = 0; i < this.activityTokens.length; i++) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        if (part.name(token).includes("Eternity Challenge")) {
          const currEC = player.challenge.eternity.current;
          const nextCompletion = EternityChallenge(currEC).completions + 1;
          let completionText = "";
          if (Enslaved.isRunning && currEC === 1) {
            completionText = `(${formatInt(nextCompletion)}/???)`;
          } else if (nextCompletion === 6) {
            completionText = `(already completed)`;
          } else {
            completionText = `(${formatInt(nextCompletion)}/${formatInt(5)})`;
          }
          names.push(`${part.name(token)} ${completionText}`);
        } else {
          names.push(part.name(token));
        }
      }
      return names;
    },
    isVisible() {
      return this.infinityUnlocked || this.activeChallengeNames.length > 0;
    },
    isInFailableEC() {
      return this.activeChallengeNames.some(str => str.match(/Eternity Challenge (4|12)/gu));
    },
    challengeDisplay() {
      if (this.inPelle && this.activeChallengeNames.length > 0) {
        return `${this.activeChallengeNames.join(" + ")} in a Doomed Reality. Good luck.`;
      }
      if (this.inPelle) return "a Doomed Reality. Good luck.";
      if (this.activeChallengeNames.length === 0) {
        return "the Antimatter Universe (no active challenges)";
      }
      return this.activeChallengeNames.join(" + ");
    },
  },
  methods: {
    update() {
      this.infinityUnlocked = PlayerProgress.infinityUnlocked();
      this.activityTokens = this.parts.map(part => part.activityToken());
      // Dilation in Pelle can't be left once entered, but we still want to allow leaving more nested challenges
      this.showExit = this.inPelle && player.dilation.active
        ? this.activeChallengeNames.length > 1
        : this.activeChallengeNames.length !== 0;
      this.exitText = this.exitDisplay();
      this.resetCelestial = player.options.retryCelestial;
      this.inPelle = Pelle.isDoomed;
      const nowInHell = Hell.isInside;
      if (nowInHell && !this.inHell && this.hellSeenOutside) this.startHellIntro();
      if (!nowInHell) {
        this.hellSeenOutside = true;
        this.hellPhase = 0;
        this.hellTimers.forEach(t => clearTimeout(t));
        this.hellTimers = [];
      }
      this.inHell = nowInHell;
      if (nowInHell) this.showExit = false;
    },
    startHellIntro() {
      this.hellPhase = 1;
      this.hellTimers.forEach(t => clearTimeout(t));
      const full = this.hellLongText;
      const target = "the Hell. Good luck.";
      this.hellText = full;
      const symbols = "!#$%&*+=?@^~<>/\\|0123456789";
      // Each character gets a random rank; characters are garbled in rank order as progress rises
      const makeScrambler = src => {
        const rankOf = [];
        Array.from({ length: src.length }, (_, i) => i)
          .sort(() => Math.random() - 0.5)
          .forEach((idx, r) => { rankOf[idx] = r; });
        return progress => {
          let out = "";
          for (let i = 0; i < src.length; i++) {
            out += src[i] === " " || rankOf[i] >= progress * src.length
              ? src[i]
              : symbols[Math.floor(Math.random() * symbols.length)];
          }
          return out;
        };
      };
      const garbleFull = makeScrambler(full);
      const garbleTarget = makeScrambler(target);
      const run = (ticks, ms, fn, done) => {
        let tick = 0;
        const id = setInterval(() => {
          tick++;
          fn(tick / ticks);
          if (tick < ticks) return;
          clearInterval(id);
          done();
        }, ms);
        this.hellTimers.push(id);
      };
      this.hellTimers = [setTimeout(() => {
        // Garbling takes 3s, then shrinking down to the length of the final text, then a slow reveal
        run(30, 100, p => { this.hellText = garbleFull(p); }, () => {
          this.hellPhase = 2;
          const excess = full.length - target.length;
          run(100, 50, p => {
            this.hellText = garbleFull(1).slice(0, Math.round(full.length - excess * p));
          }, () => {
            run(30, 100, p => { this.hellText = garbleTarget(1 - p); }, () => { this.hellPhase = 0; });
          });
        });
      }, 2000)];
    },
    // Process exit requests from the inside out; Challenges first, then dilation, then Celestial Reality. If the
    // relevant option is toggled, we pass a bunch of information over to a modal - otherwise we immediately exit
    exitButtonClicked() {
      let names, clickFn;
      const isEC = Player.anyChallenge instanceof EternityChallengeState;

      // Dilation and ECs can't be exited independently and we have a special dilation-exit modal, so we have
      // to treat that particular case differently. The dilation modal itself will account for EC state
      if (player.dilation.active && (!Player.isInAnyChallenge || isEC)) {
        if (player.options.confirmations.dilation) Modal.exitDilation.show();
        else startDilatedEternityRequest();
        return;
      }

      if (Player.isInAnyChallenge) {
        // Regex replacement is used to remove the "(X/Y)" which appears after ECs. The ternary statement is there
        // because this path gets called for NCs, ICs, and ECs
        const toExit = this.activeChallengeNames[this.activeChallengeNames.length - 1].replace(/\W+\(.*\)/u, "");
        names = { chall: toExit, normal: isEC ? "Eternity" : "Infinity" };
        clickFn = () => {
          const oldChall = Player.anyChallenge;
          Player.anyChallenge.exit(false);
          if (player.options.retryChallenge) oldChall.requestStart();
        };
      } else {
        names = { chall: this.activeChallengeNames[0], normal: "Reality" };
        clickFn = () => LHC.nullifiedVoidRunning ? exitNullifiedVoid() :
          (LHC.voidRunning ? exitTheVoid() :
          (player.universes.current !== 0 ? exitUniverse(player.universes.current) :
          (Alpha.isRunning ? Alpha.escapeTheMatrix() : beginProcessReality(getRealityProps(true)))));
      }

      if (player.options.confirmations.exitChallenge) {
        Modal.exitChallenge.show(
          {
            challengeName: names.chall,
            normalName: names.normal,
            hasHigherLayers: this.inPelle || this.activeChallengeNames.length > 1,
            exitFn: clickFn
          }
        );
      } else {
        clickFn();
      }
    },
    // Bring the player to the tab related to the innermost challenge
    textClicked() {
      if (this.activeChallengeNames.length === 0) return;

      // Iterating back-to-front and breaking ensures we get the innermost restriction
      let fullName = "", celestial = "", universe = "";
      for (let i = this.activityTokens.length - 1; i >= 0; i--) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        fullName = part.name(token);
        celestial = part.tabName?.();
        universe = part.uniName?.();
        break;
      }

      // Normal challenges are matched with an end-of-string metacharacter
      if (fullName.match(" Challenge$")) Tab.challenges.normal.show(true);
      else if (fullName.match("Infinity Challenge")) Tab.challenges.infinity.show(true);
      else if (fullName.match("Eternity Challenge")) Tab.challenges.eternity.show(true);
      else if (player.dilation.active) Tab.eternity.dilation.show(true);
      else if (LHC.voidRunning || LHC.nullifiedVoidRunning) Tab.endgame.collider.show(true);
      else if (universe) Tab.universes[universe].show(true);
      else Tab.celestials[celestial].show(true);
    },
    exitDisplay() {
      if (Player.isInAnyChallenge) return player.options.retryChallenge ? "Retry Challenge" : "Exit Challenge";
      if (player.dilation.active) return "Exit Dilation";
      if (LHC.voidRunning || LHC.nullifiedVoidRunning) return "Exit The Void";
      if (this.resetCelestial) return "Restart Reality";
      return "Exit Reality";
    },
    textClassObject() {
      return {
        "l-challenge-display": true,
        "l-challenge-display--clickable": this.activeChallengeNames.length !== 0,
      };
    }
  },
};
</script>

<template>
  <div
    v-if="isVisible || inHell"
    class="l-game-header__challenge-text"
    :class="{ 'l-game-header__challenge-text--hell': inHell && hellPhase !== 0 }"
  >
    <span
      v-if="inHell && hellPhase !== 0"
      class="l-challenge-display l-hell-long"
    >
      You are currently in {{ hellText }}
    </span>
    <span
      v-else-if="inHell"
      class="l-challenge-display l-hell-short"
    >
      You are currently in the Hell. Good luck.
    </span>
    <span
      v-else
      :class="textClassObject()"
      @click="textClicked"
    >
      You are currently in {{ challengeDisplay }}
    </span>
    <FailableEcText v-if="isInFailableEC" />
    <span class="l-padding-line" />
    <PrimaryButton
      v-if="showExit"
      @click="exitButtonClicked"
    >
      {{ exitText }}
    </PrimaryButton>
  </div>
</template>

<style scoped>
.l-game-header__challenge-text {
  display: flex;
  height: 2rem;
  top: 50%;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
  margin: 0.5rem;
}

.l-challenge-display {
  padding: 0.5rem;
  cursor: default;
}

.l-challenge-display--clickable {
  cursor: pointer;
  user-select: none;
}

.l-challenge-display--clickable:hover {
  text-decoration: underline;
}

.l-game-header__challenge-text--hell {
  height: auto;
  min-height: 2rem;
}

.l-hell-long {
  text-align: center;
}

.l-padding-line {
  padding: 0.3rem;
}
</style>
