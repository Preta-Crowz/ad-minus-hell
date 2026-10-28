<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EnterHellModal",
  components: {
    ModalWrapperChoice,
  },
  methods: {
    handleYesClick() {
      Hell.enter();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      Enter the Gate
    </template>
    <div>
      The inside and outside of Hell are completely separated, except for (name will be chosen soon) upgrades and
      Fate Fragments (NYI).
      <br>
      <br>
      Nerfs can be found on the Information tab.
    </div>
    <template #confirm-text>
      Enter
    </template>
  </ModalWrapperChoice>
</template>
