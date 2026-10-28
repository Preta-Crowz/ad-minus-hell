<script>
import AutosaveIntervalSlider from "./AutosaveIntervalSlider";
import OpenModalHotkeysButton from "@/components/OpenModalHotkeysButton";
import OptionsButton from "@/components/OptionsButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import SaveFileName from "./SaveFileName";
import { STEAM } from "@/env";

export default {
  name: "OptionsSavingTab",
  components: {
    AutosaveIntervalSlider,
    OpenModalHotkeysButton,
    OptionsButton,
    PrimaryToggleButton,
    SaveFileName
  },
  data() {
    return {
      cloudAvailable: false,
      isSteam: STEAM,
      cloudEnabled: false,
      forceCloudOverwrite: false,
      showCloudModal: false,
      hideGoogleName: false,
      loggedIn: false,
      userName: "",
      syncSaveIntervals: false,
      showTimeSinceSave: false,
      canSpeedrun: false,
      inSpeedrun: false,
      creditsClosed: false,
      canModifySeed: false,
    };
  },
  computed: {
    modalTooltip() {
      return `The game will detect certain situations where you might not want to overwrite your cloud save, and show
        you a modal with more information if this is ON.`;
    },
    overwriteTooltip() {
      if (this.showCloudModal) return "This setting does nothing since the modal is being shown.";
      return this.forceCloudOverwrite
        ? `Your local save will always overwrite your cloud save no matter what.`
        : `Save conflicts will prevent your local save from being saved to the cloud.`;
    },
  },
  watch: {
    syncSaveIntervals(newValue) {
      player.options.syncSaveIntervals = newValue;
    },
    cloudEnabled(newValue) {
      player.options.cloudEnabled = newValue;
    },
    forceCloudOverwrite(newValue) {
      player.options.forceCloudOverwrite = newValue;
    },
    showCloudModal(newValue) {
      player.options.showCloudModal = newValue;
    },
    hideGoogleName(newValue) {
      player.options.hideGoogleName = newValue;
    },
    showTimeSinceSave(newValue) {
      player.options.showTimeSinceSave = newValue;
    },
  },
  methods: {
    update() {
      const options = player.options;
      this.cloudAvailable = Cloud.isAvailable;
      this.cloudEnabled = options.cloudEnabled;
      this.forceCloudOverwrite = options.forceCloudOverwrite;
      this.showCloudModal = options.showCloudModal;
      this.hideGoogleName = options.hideGoogleName;
      this.loggedIn = Cloud.loggedIn;
      this.userName = this.loggedIn ? Cloud.user.displayName : "";
      this.syncSaveIntervals = options.syncSaveIntervals;
      this.showTimeSinceSave = options.showTimeSinceSave;
      this.canSpeedrun = player.speedrun.isUnlocked;
      this.inSpeedrun = player.speedrun.isActive;
      this.canModifySeed = Speedrun.canModifySeed();
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
    importAsFile(event) {
      // This happens if the file dialog is canceled instead of a file being selected
      if (event.target.files.length === 0) return;

      const reader = new FileReader();
      reader.onload = function() {
        // File importing behavior should use the behavior on the existing and to-be-overwritten save instead of the
        // settings in the to-be-imported save. This is largely because the former is more easily edited by the player,
        // and in contrast with the import-as-string case which allows the player to choose.
        // Note: Do not move this into GameStorage.import, as this would cause the offline progress choice in the text
        // import modal (the only other place GameStorage.import is called) to always be overridden
        GameStorage.offlineEnabled = player.options.offlineProgress;
        GameStorage.offlineTicks = player.options.offlineTicks;
        GameStorage.import(reader.result);
      };
      reader.readAsText(event.target.files[0]);
    },
    openSeedModal() {
      if (this.canModifySeed) {
        Modal.modifySeed.show();
      } else {
        Modal.message.show(`You cannot modify your seed any more. Glyph RNG has already been used to generate
          at least one Glyph on this run.`);
      }
    }
  }
};
</script>

<template>
  <div class="l-options-tab">
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameStorage.export()"
        >
          Export save
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.import.show()"
        >
          Import save
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.hardReset.show()"
        >
          RESET THE GAME
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameStorage.save(false, true)"
        >
          Save game
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.loadGame.show()"
        >
          Choose save
        </OptionsButton>
        <AutosaveIntervalSlider
          :min="10"
          :max="60"
          :interval="1"
        />
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameStorage.exportAsFile()"
        >
          Export save as file
        </OptionsButton>
        <OptionsButton
          class="c-file-import-button"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        >
          <input
            class="c-file-import"
            type="file"
            accept=".txt"
            @change="importAsFile"
          >
          <label for="file">Import save from file</label>
        </OptionsButton>
        <PrimaryToggleButton
          v-model="showTimeSinceSave"
          class="o-primary-btn--option l-options-grid__button"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          label="Display time since save:"
        />
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.backupWindows.show()"
        >
          Open Automatic Save Backup Menu
        </OptionsButton>
        <SaveFileName />
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          v-if="canSpeedrun"
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.enterSpeedrun.show()"
        >
          Start Speedrun
        </OptionsButton>
        <OptionsButton
          v-if="inSpeedrun"
          :class="{
            'o-pelle-disabled-pointer': creditsClosed,
            'o-primary-btn--disabled': !canModifySeed
          }"
          @click="openSeedModal()"
        >
          Change Glyph RNG Seed
        </OptionsButton>
      </div>
      <OpenModalHotkeysButton />
      <div v-if="cloudAvailable" class="l-options-grid__row">
        <h2 class="c-cloud-options-header">
          <span v-if="loggedIn && hideGoogleName">Logged in to Google <i>(name hidden)</i></span>
          <span v-else-if="loggedIn">Logged in as {{ userName }}</span>
          <span v-else>Not logged in</span>
        </h2>
      </div>
      <div v-if="cloudAvailable && loggedIn" class="l-options-grid__row">
        <span>{{ cloudEnabled ? "Cloud saving will occur automatically every 10 minutes." : "Cloud saving is disabled on this save." }}</span>
      </div>
      <div v-if="cloudAvailable && !isSteam" class="l-options-grid__row">
        <OptionsButton
          v-if="loggedIn"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameOptions.logout()"
        >
          Disconnect Google Account
        </OptionsButton>
        <OptionsButton
          v-else
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameOptions.login()"
        >
          Login with Google to enable Cloud Saving
        </OptionsButton>
        <PrimaryToggleButton
          v-if="loggedIn"
          v-model="hideGoogleName"
          class="o-primary-btn--option l-options-grid__button"
          label="Hide Google Account name:"
        />
      </div>
      <template v-if="cloudAvailable && loggedIn">
        <div class="l-options-grid__row">
          <OptionsButton
            :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
            onclick="GameOptions.cloudSave()"
          >
            Cloud save
          </OptionsButton>
          <OptionsButton
            :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
            onclick="GameOptions.cloudLoad()"
          >
            Cloud load
          </OptionsButton>
          <PrimaryToggleButton
            v-model="syncSaveIntervals"
            class="o-primary-btn--option l-options-grid__button"
            label="Force local save before cloud saving:"
          />
        </div>
        <div class="l-options-grid__row">
          <PrimaryToggleButton
            v-model="cloudEnabled"
            class="o-primary-btn--option l-options-grid__button"
            :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
            label="Automatic cloud saving:"
          />
          <PrimaryToggleButton
            v-model="showCloudModal"
            v-tooltip="modalTooltip"
            class="o-primary-btn--option l-options-grid__button"
            label="Show modal on possible save conflict:"
          />
          <PrimaryToggleButton
            v-model="forceCloudOverwrite"
            v-tooltip="overwriteTooltip"
            class="o-primary-btn--option l-options-grid__button"
            label="Force cloud saving despite conflicts:"
          />
        </div>
      </template>
    </div>
    </div>
</template>
