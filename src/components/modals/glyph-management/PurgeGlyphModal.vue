<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeGlyphModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    harsh: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    threshold() {
      return this.harsh ? 1 : 5;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return `This will Purge no Glyphs.`;
      if (this.glyphsDeleted === this.glyphsTotal) return `This will Purge all your Glyphs.`;
      return `${this.harsh ? `Harsh Purging` : `Purging`} will delete
        ${formatInt(this.glyphsDeleted)}/${formatInt(this.glyphsTotal)}
      of your Glyphs.`;
    },
    explanation() {
      const requiredBetterGlyphs = Math.max(this.harsh ? 1 : 5, Glyphs.normalGlyphCleanupReserve);
      const cleanupReserve = Glyphs.normalGlyphCleanupReserve;
      const purgeName = this.harsh ? "Harsh Purging" : "Purging";
      return `${purgeName} removes normal Glyphs only when at least ${formatInt(requiredBetterGlyphs)} same-type Glyphs
        with the same effects are better in every way. For Effarig, Reality, and Glitch Glyphs, it instead requires
        enough better same-type copies to match the highest equip limit across regular and Doomed Reality. Extra
        normal slots and the regular purge threshold do not increase the special Glyph cap.${cleanupReserve > 0
        ? ` At least ${formatInt(cleanupReserve)} normal Glyphs are kept for the highest equip capacity across both modes.`
        : ""}`;
    },
    topLabel() {
      return `You are about to ${this.harsh ? `Harsh Purge` : `Purge`} your Glyphs`;
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return Glyphs.inventory.filter(slot => slot !== null).length;
    },
    glyphsDeleted() {
      return Glyphs.autoClean(this.threshold, false);
    },
  },
  methods: {
    handleYesClick() {
      Glyphs.autoClean(this.threshold, true);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="autoClean"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      This could delete Glyphs in your inventory that are good enough that you might want to use them
      later. Purging will Purge Glyphs based on your Purge mode. Are you sure you want to do this?
      <br>
      <br>
      {{ explanation }}
    </div>
    <br>
    <div class="c-modal-hard-reset-danger">
      {{ extraMessage }}
    </div>
  </ModalWrapperChoice>
</template>
