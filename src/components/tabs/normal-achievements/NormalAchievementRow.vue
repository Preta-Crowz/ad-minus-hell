<script>
import NormalAchievement from "./NormalAchievement";

export default {
  name: "NormalAchievementRow",
  components: {
    NormalAchievement
  },
  props: {
    row: {
      type: Array,
      required: true
    },
    isAchievementObscured: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isCompleted: false,
      isHidden: false
    };
  },
  computed: {
    classObject() {
      return {
        "l-achievement-grid__row": true,
        "c-achievement-grid__row--completed": this.isCompleted
      };
    },
    inRow(){
      return this.row.filter(x => x != undefined);
    },
  },
  methods: {
    update() {
      this.isCompleted = this.row.every(a => a ? a.isUnlocked : true );
      this.isHidden = this.isCompleted && player.options.hideCompletedAchievementRows;
    },
    specialObscured(achievement) {
      return achievement.id === 258 && !Achievement(258).isUnlocked;
    }
  }
};
</script>

<template>
  <div
    v-if="!isHidden"
    :class="classObject"
  >
    <normal-achievement
      v-for="(achievement, i) in inRow"
      :key="i"
      :achievement="achievement"
      :is-obscured="isAchievementObscured(achievement) || specialObscured(achievement)"
      class="l-achievement-grid__cell"
    />
  </div>
</template>
