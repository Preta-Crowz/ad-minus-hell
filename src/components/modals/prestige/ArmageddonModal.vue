<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ArmageddonModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isDoomed: false,
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
    },
    handleYesClick() {
      if (Pelle.isDoomed) return;
      Pelle.initializeRun();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    @confirm="handleYesClick"
  >
    <template #header>
      You are about to Doom your Reality
    </template>
    <div
      v-if="!isDoomed"
      class="c-modal-message__text"
    >
      Dooming your Reality will reset everything except Challenge records, Celestial progress and anything under
      the General and Reality header on the Statistics tab. You will not gain any rewards from your progress
      in your current Reality. Dooming your Reality will also purge most of your unprotected Glyphs and disable
      certain game mechanics.
      <br>
      <br>
      Are you sure you want to do this?
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      Reality is already Doomed. Endgame is the only reset available from here.
    </div>
  </ModalWrapperChoice>
</template>
