<template>
  <div class="c-stats-tab">
    <div class="l-cap-breakdown-selector">
      <label for="cap-breakdown-type">Show breakdown:</label>
      <select
        id="cap-breakdown-type"
        v-model="selectedType"
        class="c-cap-breakdown-select"
        @change="changeType"
      >
        <option value="softcaps">
          Softcap Breakdown
        </option>
        <option value="hardcaps">
          Hardcap Breakdown
        </option>
      </select>
      <label for="cap-breakdown-currency">Select currency:</label>
      <select
        id="cap-breakdown-currency"
        :value="selectedCurrency"
        class="c-cap-breakdown-select"
        @change="changeCurrency"
      >
        <option
          v-for="group in groups"
          :key="group.key"
          :value="group.key"
        >
          {{ group.name }}
        </option>
      </select>
    </div>
    <div v-if="selectedGroup" class="c-cap-breakdown-content">
      <h3>{{ selectedGroup.name }}</h3>
      <div class="c-cap-breakdown-table-container">
        <table class="c-cap-breakdown-table">
          <thead>
            <tr v-if="selectedType === 'softcaps'">
              <th scope="col">Active cap</th>
              <th scope="col">Before softcap</th>
              <th scope="col">Effect</th>
              <th scope="col">After softcap</th>
              <th scope="col">Threshold</th>
            </tr>
            <tr v-else>
              <th scope="col">Active cap</th>
              <th scope="col">Behavior</th>
              <th scope="col">Current value</th>
              <th scope="col">Threshold / limit</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cap in selectedGroup.entries"
              :key="cap.key"
            >
              <th scope="row">
                {{ cap.name }}
                <small v-if="selectedType === 'softcaps'">{{ cap.description }}</small>
              </th>
              <template v-if="selectedType === 'softcaps'">
                <td class="c-cap-breakdown-value">{{ cap.before || "—" }}</td>
                <td>{{ cap.effect || "—" }}</td>
                <td class="c-cap-breakdown-value">{{ cap.after || "—" }}</td>
                <td class="c-cap-breakdown-value">{{ cap.limit || "—" }}</td>
              </template>
              <template v-else>
                <td>{{ cap.description }}</td>
                <td class="c-cap-breakdown-value">{{ cap.current || "—" }}</td>
                <td class="c-cap-breakdown-value">
                  <template v-if="cap.limit">
                    {{ cap.limitName || "Limit" }}: {{ cap.limit }}
                  </template>
                  <template v-else>—</template>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p v-else>No {{ selectedType === "softcaps" ? "softcaps" : "hardcaps" }} are currently active.</p>
  </div>
</template>

<script>
import { getActiveCapBreakdowns } from "@/core/cap-breakdown";

const selectionState = {
  type: "softcaps",
  currencies: {
    softcaps: null,
    hardcaps: null,
  },
};

export default {
  name: "CapBreakdownTab",
  data() {
    return {
      selectedType: selectionState.type,
      selectedCurrencies: { ...selectionState.currencies },
      groups: [],
    };
  },
  computed: {
    selectedCurrency() {
      return this.selectedCurrencies[this.selectedType] ?? "";
    },
    selectedGroup() {
      return this.groups.find(group => group.key === this.selectedCurrency) ?? null;
    },
  },
  methods: {
    update() {
      this.refreshGroups();
    },
    changeType() {
      selectionState.type = this.selectedType;
      this.refreshGroups();
    },
    changeCurrency(event) {
      const currency = event.target.value;
      this.selectedCurrencies[this.selectedType] = currency;
      selectionState.currencies[this.selectedType] = currency;
    },
    refreshGroups() {
      this.groups = getActiveCapBreakdowns(this.selectedType);
      if (!this.groups.some(group => group.key === this.selectedCurrency)) {
        const currency = this.groups[0]?.key ?? null;
        this.selectedCurrencies[this.selectedType] = currency;
        selectionState.currencies[this.selectedType] = currency;
      }
    },
  },
};
</script>

<style scoped>
.l-cap-breakdown-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
}

.c-cap-breakdown-select {
  min-width: 24rem;
  height: 4rem;
  font-family: Typewriter;
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-text);
  background-color: var(--color-base);
  border: var(--var-border-width, 0.2rem) solid;
  border-radius: var(--var-border-radius, 0.5rem);
  cursor: pointer;
}

.c-cap-breakdown-content {
  width: 100%;
  max-width: 110rem;
  margin: 0 auto;
  color: var(--color-text);
  text-align: left;
}

.c-cap-breakdown-content h3 {
  margin: 1rem 0;
}

.c-cap-breakdown-table-container {
  width: 100%;
  overflow-x: auto;
}

.c-cap-breakdown-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.1rem;
}

.c-cap-breakdown-table th,
.c-cap-breakdown-table td {
  padding: 0.7rem 1rem;
  border-bottom: 1px solid currentColor;
  color: var(--color-text);
  opacity: 1;
  text-align: left;
  vertical-align: top;
}

.c-cap-breakdown-table th[scope="row"] {
  white-space: nowrap;
}

.c-cap-breakdown-table th[scope="row"] small {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.85em;
  font-weight: normal;
  white-space: normal;
}

.c-cap-breakdown-table .c-cap-breakdown-value {
  text-align: right;
  white-space: nowrap;
}
</style>
