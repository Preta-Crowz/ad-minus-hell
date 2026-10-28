<script>
import ConfirmationOptionsEntry from "@/components/modals/options/ConfirmationOptionsEntry";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "ConfirmationOptionsModal",
  components: {
    ModalWrapperOptions,
    ConfirmationOptionsEntry,
  },
  computed: {
    count() {
      return ConfirmationTypes.index.length;
    },
    noConfirmations() {
      return ConfirmationTypes.index.every(x => !x.isUnlocked());
    },
    isInHell() {
      return Hell.isInside;
    }
  }
};
</script>

<template>
  <ModalWrapperOptions class="c-modal-options__large">
    <template #header>
      Confirmation Options
    </template>
    <div
      v-if="isInHell"
      class="c-hell-options-note"
    >
      Confirmations are disabled inside of Hell.
    </div>
    <div
      class="c-modal-options__button-container"
      :class="{ 'c-hell-options-locked': isInHell }"
    >
      <span v-if="noConfirmations">
        You do not have anything that requires confirmation,
        but if you did it would appear here.
      </span>
      <ConfirmationOptionsEntry
        v-for="entryNumber in count"
        :key="entryNumber"
        :index="entryNumber - 1"
      />
    </div>
  </ModalWrapperOptions>
</template>

<style scoped>
.c-hell-options-locked {
  opacity: 0.5;
  pointer-events: none;
}

.c-hell-options-note {
  margin-bottom: 1rem;
}
</style>
