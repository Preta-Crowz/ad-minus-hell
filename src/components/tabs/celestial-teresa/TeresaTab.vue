<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import CustomizeableTooltip from "@/components/CustomizeableTooltip";
import GlyphSetPreview from "@/components/GlyphSetPreview";
import PerkShopUpgradeButton from "./PerkShopUpgradeButton";

export default {
  name: "TeresaTab",
  components: {
    GlyphSetPreview,
    PerkShopUpgradeButton,
    CelestialQuoteHistory,
    CustomizeableTooltip
  },
  data() {
    return {
      pour: false,
      time: new Date().getTime(),
      pouredAmount: new Decimal(0),
      isPouredAmountCapped: false,
      autoPour: false,
      hasAutoPour: false,
      rm: new Decimal(0),
      percentage: "",
      possibleFillPercentage: "",
      rmMult: 0,
      bestAM: new Decimal(0),
      bestAMSet: [],
      lastMachines: new Decimal(0),
      lastiM: new Decimal(),
      runReward: new Decimal(),
      perkPoints: new Decimal(),
      hasReality: false,
      hasEPGen: false,
      hasPerkShop: false,
      raisedPerkShop: false,
      chargeMode: false,
      chargeUnlocked: false,
      isRunning: false,
      canUnlockNextPour: false,
    };
  },
  computed: {
    sName(){
      if(player.options.themeModern == "S14") return "Ra-Teresa's";
      if(player.options.themeModern == "S16") return "Effarig-Teresa's";
      if(player.options.themeModern == "S17") return `The Nameless Teresa's`;
      if(player.options.themeModern == "S18") return `Lai'tela-Teresa's`;
      if(player.options.themeModern == "S19") return `Pelle-Teresa's`;
      if(player.options.themeModern == "S13") return "V-Teresa's";
      return "Teresa's";
    },
    sCel(){
      if(player.options.themeModern == "S14") return "Ra-Teresa";
      if(player.options.themeModern == "S16") return "Effarig-Teresa";
      if(player.options.themeModern == "S17") return `The Nameless Teresa'`;
      if(player.options.themeModern == "S18") return `Lai'tela-Teresa`;
      if(player.options.themeModern == "S19") return `Pelle-Teresa`;
      if(player.options.themeModern == "S13") return "V-Teresa";
      return "Teresa";
    },
    unlockInfos: () => TeresaUnlocks.all,
    pouredAmountCap: () => Teresa.pouredAmountCap,
    showRunReward() {
      return this.bestAM.gt(1);
    },
    upgrades() {
      const upgrades = [
        PerkShopUpgrade.glyphLevel,
        PerkShopUpgrade.rmMult,
        PerkShopUpgrade.bulkDilation,
        PerkShopUpgrade.autoSpeed,
        PerkShopUpgrade.musicGlyph,
      ];
      if (this.raisedPerkShop) upgrades.push(PerkShopUpgrade.fillMusicGlyph);
      if (this.chargeUnlocked) upgrades.push(PerkShopUpgrade.addCharges);
      if (realityUGs.all[12].isBought){
        upgrades.unshift(PerkShopUpgrade.infinityPow);
        upgrades.unshift(PerkShopUpgrade.maxGlyphLevel);
      }
      return upgrades;
    },
    runButtonClassObject() {
      return {
        "c-teresa-run-button__icon": true,
        "c-teresa-run-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    pourButtonClassObject() {
      return {
        "o-teresa-shop-button": true,
        "c-teresa-pour": true,
        "o-teresa-shop-button--available": !this.isPouredAmountCapped,
        "o-teresa-shop-button--capped": this.isPouredAmountCapped,
        "c-teresa-pour--unlock-available": this.canUnlockNextPour,
        "c-disabled-pour": this.isPouredAmountCapped
      };
    },
    pourText() {
      return this.isPouredAmountCapped ? "Filled" : "Pour RM";
    },
    autoText() {
      return this.autoPour ? "Auto ON" : "Auto OFF";
    },
    chargeDisplay() {
      return this.chargeUnlocked ? `Charge Upgrades: ${this.chargeMode ? "ON" : "OFF"}` : "Charge Upgrades: Locked";
    },
    chargeLockReason() {
      return ExpansionPack.teresaPack.isBought
        ? "Unavailable while Post-Reality mechanics are disabled."
        : "Requires Teresa's Expansion Pack.";
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[0].effects();
    },
    lastMachinesString() {
      return this.lastiM.eq(0)
        ? `${quantify("Reality Machine", this.lastMachines, 2)}`
        : `${quantify("Imaginary Machine", this.lastiM, 2)}`;
    },
    unlockInfoTooltipArrowStyle() {
      return {
        borderRight: "0.5rem solid var(--color-teresa--base)"
      };
    },
    isDoomed: () => Pelle.isDoomed && !ChallengerUpgrade(12).isBought,
  },
  methods: {
    update() {
      const now = new Date().getTime();
      if (this.pour) {
        if (EndgameUpgrade(10).isLockingMechanics) EndgameUpgrade(10).tryShowWarningModal();
        else {
          const diff = (now - this.time) / 1000;
          Teresa.pourRM(diff);
        }
      } else {
        Teresa.timePoured = new Decimal(0);
      }
      this.time = now;
      this.pouredAmount.copyFrom(player.celestials.teresa.pouredAmount);
      this.isPouredAmountCapped = this.pouredAmount.eq(this.pouredAmountCap);
      this.percentage = `${(Teresa.fill * 100).toFixed(2)}%`;
      this.possibleFillPercentage = `${(Teresa.possibleFill * 100).toFixed(2)}%`;
      this.rmMult = Teresa.rmMultiplier;
      this.hasReality = TeresaUnlocks.run.isUnlocked;
      this.hasEPGen = TeresaUnlocks.epGen.isUnlocked;
      this.hasPerkShop = TeresaUnlocks.shop.isUnlocked;
      this.chargeUnlocked = ExpansionPack.teresaPack.isBought && !player.disablePostReality;
      this.chargeMode = Teresa.chargeModeOn;
      this.hasAutoPour = ExpansionPack.teresaPack.isBought && !player.disablePostReality;
      this.autoPour = player.celestials.teresa.autoPour;
      this.raisedPerkShop = Ra.unlocks.perkShopIncrease.canBeApplied;
      this.bestAM.copyFrom(player.celestials.teresa.bestRunAM);
      this.bestAMSet = cloneDeep(Glyphs.copyForRecords(player.celestials.teresa.bestAMSet));
      this.lastMachines.copyFrom(player.celestials.teresa.lastRepeatedMachines);
      this.lastiM.copyFrom(player.celestials.teresa.lastRepeatediM);
      this.runReward.copyFrom(Teresa.runRewardMultiplier);
      this.perkPoints.copyFrom(Currency.perkPoints.value);
      this.rm.copyFrom(Currency.realityMachines);
      this.isRunning = Teresa.isRunning;
      this.canUnlockNextPour = TeresaUnlocks.all
        .filter(unlock => this.rm.plus(this.pouredAmount).gte(unlock.price) && !unlock.isUnlocked).length > 0;
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Teresa's", number: 0 });
    },
    unlockDescriptionHeight(unlockInfo) {
      const price = new Decimal(unlockInfo.price);
      const maxPrice = new Decimal(TeresaUnlocks[Teresa.lastUnlock].price);
      const pos = price.plus(1).log10().div(maxPrice.plus(1).log10()).toNumber();
      return `calc(${(100 * pos).toFixed(2)}% - 0.1rem)`;
    },
    hasUnlock(unlockInfo) {
      return unlockInfo.isUnlocked;
    },
    toggleAutoPour() {
      player.celestials.teresa.autoPour = !player.celestials.teresa.autoPour;
    },
    toggleChargeMode() {
      if (!this.chargeUnlocked) return;
      this.chargeMode = !this.chargeMode;
      player.celestials.teresa.chargeMode = this.chargeMode;
      GameUI.update();
    },
    unlockInfoTooltipClass(unlockInfo) {
      return {
        "c-teresa-unlock-description": true,
        "c-teresa-unlock-description--unlocked": this.hasUnlock(unlockInfo)
      };
    }
  }
};
</script>

<template>
  <div class="l-teresa-celestial-tab">
    <CelestialQuoteHistory celestial="teresa" />
    <div>
      You have {{ quantify("Reality Machine", rm, 2, 2) }}.
    </div>
    <div class="l-mechanics-container">
      <div
        v-if="hasReality"
        class="l-teresa-mechanic-container"
      >
        <div class="c-teresa-unlock c-teresa-run-button">
          <span :class="{ 'o-pelle-disabled': isDoomed }">
            Start {{sName}} Reality.
          </span>
          <div
            :class="runButtonClassObject"
            @click="startRun()"
          >
            Ϟ
          </div>
          {{ runDescription }}
          <br><br>
          <div>
            This Reality can be repeated for a stronger reward based on the antimatter gained within it.
            <br><br>
            <span v-if="showRunReward">
              Your record antimatter in {{sName}} Reality is {{ format(bestAM, 2) }},
              achieved with {{ lastMachinesString }}.
              <br><br>
              {{sCel}} Glyph Set used:
              <GlyphSetPreview
                text='Best Glyph Set'
                :text-hidden="true"
                :force-name-color="false"
                :glyphs="bestAMSet"
              />
            </span>
            <span v-else>
              You have not completed {{sName}} Reality yet.
            </span>
          </div>
        </div>
        <div
          v-if="showRunReward"
          class="c-teresa-unlock"
        >
        {{sName}} Reality reward: Glyph Sacrifice power {{ formatX(runReward, 2, 2) }}
        </div>
        <div
          v-if="hasEPGen"
          class="c-teresa-unlock"
        >
          <span :class="{ 'o-pelle-disabled': isDoomed }">
            Every second, you gain {{ formatPercents(0.01) }} of your peaked Eternity Points per minute this Reality.
          </span>
        </div>
      </div>
      <div class="l-rm-container l-teresa-mechanic-container">
        <button
          v-if="hasAutoPour"
          class="o-teresa-shop-button o-teresa-shop-button--available"
          @click="toggleAutoPour"
        >
          {{ autoText }}
        </button>
        <button
          :class="pourButtonClassObject"
          @mousedown="pour = true"
          @touchstart="pour = true"
          @mouseup="pour = false"
          @touchend="pour = false"
          @mouseleave="pour = false"
        >
          {{ pourText }}
        </button>
        <div class="c-rm-store">
          <div
            class="c-rm-store-inner c-rm-store-inner--light"
            :style="{ height: possibleFillPercentage}"
          />
          <div
            class="c-rm-store-inner"
            :style="{ height: percentage}"
          >
            <div class="c-rm-store-label">
              {{ formatX(rmMult, 2, 2) }} RM gain
              <br>
              {{ format(pouredAmount, 2, 2) }}/{{ format(pouredAmountCap, 2, 2) }}
            </div>
          </div>
          <CustomizeableTooltip
            v-for="unlockInfo in unlockInfos"
            :key="unlockInfo.id"
            content-class="c-teresa-unlock-description--hover-area"
            :bottom="unlockDescriptionHeight(unlockInfo)"
            right="0"
            mode="right"
            :show="true"
            :tooltip-arrow-style="unlockInfoTooltipArrowStyle"
            :tooltip-class="unlockInfoTooltipClass(unlockInfo)"
          >
            <template #mainContent>
              <div
                class="c-teresa-milestone-line"
                :class="{ 'c-teresa-milestone-line--unlocked': hasUnlock(unlockInfo) }"
              />
            </template>
            <template #tooltipContent>
              <b :class="{ 'o-pelle-disabled': unlockInfo.pelleDisabled }">
                {{ format(unlockInfo.price, 2, 2) }}: {{ unlockInfo.description }}
              </b>
            </template>
          </CustomizeableTooltip>
        </div>
      </div>
      <div
        v-if="hasPerkShop"
        class="c-teresa-shop"
      >
        <span class="o-teresa-pp">
          You have {{ quantify("Perk Point", perkPoints, 2, 0) }}.
        </span>
        <div class="c-teresa-charge-control">
          <PrimaryButton
            :enabled="chargeUnlocked"
            :class="{
              'o-primary-btn--charged-respec-active': chargeMode
            }"
            class="c-teresa-charge-toggle"
            @click="toggleChargeMode"
          >
            {{ chargeDisplay }}
          </PrimaryButton>
          <span
            v-if="!chargeUnlocked"
            class="c-teresa-charge-requirement"
          >
            {{ chargeLockReason }}
          </span>
        </div>
        <PerkShopUpgradeButton
          v-for="upgrade in upgrades"
          :key="upgrade.id"
          :upgrade="upgrade"
        />
        You can now modify the appearance of your Glyphs to look like Music Glyphs.
      </div>
      <div
        v-else
        class="l-rm-container-labels l-teresa-mechanic-container"
      />
    </div>
  </div>
</template>

<style scoped>
.c-disabled-pour {
  opacity: 0.8;
  pointer-events: none;
}

.c-teresa-charge-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
}

.c-teresa-charge-toggle {
  width: 100%;
  max-width: 20rem;
  min-height: 2.8rem;
  border: var(--var-border-width, 0.2rem) solid var(--color-teresa--base);
  color: var(--color-teresa--accent);
  line-height: 1.2;
  margin: 0.4rem 0;
  white-space: normal;
}

.c-teresa-charge-toggle:not(.o-primary-btn--disabled):hover {
  background-color: var(--color-teresa--base);
}

.c-teresa-charge-toggle.o-primary-btn--disabled {
  color: var(--color-text-inverted);
  background-color: var(--color-teresa--base);
  border-color: var(--color-teresa--base);
}

.c-teresa-charge-requirement {
  display: inline-block;
  max-width: 100%;
  text-align: center;
}
</style>
