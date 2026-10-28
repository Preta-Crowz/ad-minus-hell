<script>
import HeaderCenterContainer from "./prestige-header/HeaderCenterContainer";
import HeaderEternityContainer from "./prestige-header/HeaderEternityContainer";
import HeaderInfinityContainer from "./prestige-header/HeaderInfinityContainer";

export default {
  name: "HeaderPrestigeGroup",
  components: {
    HeaderCenterContainer,
    HeaderEternityContainer,
    HeaderInfinityContainer,
  },
  data() {
    return {
      inCursedCore: false
    };
  },
  methods: {
    update() {
      this.inCursedCore = Slabdrill.coreActive;
    }
  }
};
</script>

<template>
  <div
    class="c-prestige-info-blocks"
    :class="{ 'c-prestige-info-blocks--cursed': inCursedCore }"
  >
    <HeaderEternityContainer
      v-if="!inCursedCore"
      class="l-game-header__eternity"
    />
    <HeaderCenterContainer class="l-game-header__center" />
    <HeaderInfinityContainer
      v-if="!inCursedCore"
      class="l-game-header__infinity"
    />
  </div>
</template>

<style scoped>
.c-prestige-info-blocks.c-prestige-info-blocks--cursed {
  display: flex;
  justify-content: center;
  min-height: 0;
  background-color: transparent;
  text-align: center;
}
.c-prestige-info-blocks--cursed .l-game-header__center {
  width: 100%;
  text-align: center;
}
.c-prestige-info-blocks {
  background-color: rgba(0, 0, 0, 0.75);
  display: grid;
  grid-template-columns: minmax(22rem, 1fr) minmax(50rem, 2fr) minmax(22rem, 1fr);
  align-items: start;
  gap: 1rem;
  min-height: 21rem;
  height: auto;
  width: 100%;
  color: var(--color-text);
  position: sticky;
  z-index: 5;
  top: 0px
}

.l-game-header__eternity {
  position: static;
  width: auto;
  min-width: 0;
}

.l-game-header__center {
  position: static;
  width: auto;
  height: auto;
  min-width: 0;
}

.l-game-header__infinity {
  position: static;
  width: auto;
  min-width: 0;
}

@media screen and (max-width: 100rem) {
  .c-prestige-info-blocks {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .l-game-header__center {
    grid-column: 1 / -1;
    grid-row: 1;
  }

  .l-game-header__eternity {
    grid-column: 1;
    grid-row: 2;
  }

  .l-game-header__infinity {
    grid-column: 2;
    grid-row: 2;
  }
}

@media screen and (max-width: 55rem) {
  .c-prestige-info-blocks {
    grid-template-columns: minmax(0, 1fr);
  }

  .l-game-header__center,
  .l-game-header__eternity,
  .l-game-header__infinity {
    grid-column: 1;
  }

  .l-game-header__center {
    grid-row: 1;
  }

  .l-game-header__eternity {
    grid-row: 2;
  }

  .l-game-header__infinity {
    grid-row: 3;
  }

  .l-game-header__center :deep(.c-prestige-row) {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
