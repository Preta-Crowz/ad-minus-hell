<script>
export default {
  name: "SpeedrunMilestoneCompare",
  props: {
    milestone: {
      type: Object,
      required: true
    },
    currTime: {
      type: [Number, Object],
      required: false,
      default: 0,
    },
    refTime: {
      type: [Number, Object],
      required: false,
      default: 0,
    },
    bestTime: {
      type: [Number, Object],
      required: true,
    },
    runIndices: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      realTime: 0,
    };
  },
  computed: {
    classObject() {
      const currTime = new Decimal(this.currTime ?? 0);
      const refTime = new Decimal(this.refTime ?? 0);
      const bestTime = new Decimal(this.bestTime ?? 0);
      const hasTime = currTime.gt(0) && refTime.gt(0);
      return {
        "l-speedrun-milestone-entry": true,
        "l-milestone-slow": hasTime && currTime.gt(refTime),
        "l-milestone-fast": hasTime && currTime.lt(refTime),
        "l-milestone-fastest": hasTime && currTime.lt(bestTime),
      };
    },
  },
  methods: {
    update() {
      this.realTime = new Decimal(player.records.realTimePlayed);
    },
    timeString(ms, showGap) {
      const time = new Decimal(ms ?? 0);
      const currTime = new Decimal(this.currTime ?? 0);
      const referenceTime = currTime.gt(0) ? currTime : new Decimal(this.realTime);
      const timeStr = TimeSpan.fromMilliseconds(time).toStringShort(true, true);
      const diff = referenceTime.minus(time);
      let gapStr = TimeSpan.fromMilliseconds(diff.abs()).toStringShort(true, true);
      gapStr = `${referenceTime.gt(time) ? "-" : "+"}${gapStr}`;
      return time.gt(0)
        ? `${timeStr}${showGap ? ` (${gapStr})` : ""}`
        : "Not reached yet";
    },
    timeStyle(time) {
      const times = [this.currTime, this.refTime, this.bestTime]
        .map(value => new Decimal(value ?? 0))
        .filter(value => value.gt(0));
      const fastestTime = times.length ? times.reduce((fastest, value) => Decimal.min(fastest, value)) : undefined;
      const isFastest = fastestTime !== undefined && new Decimal(time ?? 0).eq(fastestTime);
      return {
        color: "var(--color-text)",
        opacity: isFastest ? 1 : 0.85,
        "font-weight": isFastest ? "bold" : null,
      };
    }
  }
};
</script>

<template>
  <div :class="classObject">
    <span class="l-milestone-title">{{ milestone.name }}</span>
    <span :style="timeStyle(currTime)">Current run: {{ timeString(currTime) }}</span>
    <span
      v-if="refTime"
      :style="timeStyle(refTime)"
    >
      Run {{ runIndices[0] }}: {{ timeString(refTime, true) }}
    </span>
    <span :style="timeStyle(bestTime)">Best ({{ runIndices[1] }}): {{ timeString(bestTime, true) }}</span>
  </div>
</template>

<style scoped>
.l-milestone-title {
  font-size: 1.3rem;
  text-decoration: underline;
}

.l-milestone-slow {
  background-color: var(--color-bad);
}

.l-milestone-fast {
  background-color: var(--color-good);
}

.l-milestone-fastest {
  background-color: var(--color-celestials);
}
</style>
