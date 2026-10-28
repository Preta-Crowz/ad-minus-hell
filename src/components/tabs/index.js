// Temporarily aggregate tab components here until GameUI is migrated to SFC
import AlchemyTab from "./alchemy/AlchemyTab";
import AscensionTab from "./ascension/AscensionTab";
import AlphaTab from "./celestial-alpha/AlphaTab";
import AntimatterDimensionsTab from "./antimatter-dimensions/AntimatterDimensionsTab";
import AutobuyersTab from "./autobuyers/AutobuyersTab";
import AutomatorTab from "./automator/AutomatorTab";
import BlackHoleTab from "./black-hole/BlackHoleTab";
import BreakInfinityTab from "./break-infinity/BreakInfinityTab";
import BreakEternityTab from "./break-eternity/BreakEternityTab";
import ChallengeRecordsTab from "./challenge-records/ChallengeRecordsTab";
import CelestialBreakInfinityTab from "./celestial-dimension-expansion/CelestialBreakInfinityTab";
import CelestialDimensionsTab from "./celestial-dimensions/CelestialDimensionsTab";
import CelestialEternityPlusUpgradesTab from "./celestial-dimension-expansion/CelestialEternityPlusUpgradesTab";
import CelestialEternityUpgradesTab from "./celestial-dimension-expansion/CelestialEternityUpgradesTab";
import CelestialInfinityUpgradesTab from "./celestial-dimension-expansion/CelestialInfinityUpgradesTab";
import CelestialNavigationTab from "./celestial-navigation/CelestialNavigationTab";
import DivineDimensionsTab from "./divine-dimensions/DivineDimensionsTab";
import DivinityMilestonesTab from "./divinity-milestones/DivinityMilestonesTab";
import DivinityUpgradesTab from "./divinity-upgrades/DivinityUpgradesTab";
import EffarigTab from "./celestial-effarig/EffarigTab";
import EndgameTab from "./endgame/EndgameTab";
import EndgameMasteriesTab from "./endgame-masteries/EndgameMasteriesTab";
import EndgameMilestonesTab from "./endgame-milestones/EndgameMilestonesTab";
import EndgameUpgradesTab from "./endgame-upgrades/EndgameUpgradesTab";
import EtherealTab from "./ethereal/EtherealTab";
import ExpansionPacksTab from "./endgame/ExpansionPacksTab";
import GalacticPowerTab from "./galactic-power/GalacticPowerTab";
import EnslavedTab from "./celestial-enslaved/EnslavedTab";
import EternityChallengesTab from "./eternity-challenges/EternityChallengesTab";
import EternityMilestonesTab from "./eternity-milestones/EternityMilestonesTab";
import EternityUpgradesTab from "./eternity-upgrades/EternityUpgradesTab";
import GlyphSetRecordsTab from "./glyph-set-records/GlyphSetRecordsTab";
import GlyphsTab from "./glyphs/GlyphsTab";
import DualityUpgradesTab from "./duality-upgrades/DualityUpgradesTab";
import ImaginaryUpgradesTab from "./imaginary-upgrades/ImaginaryUpgradesTab";
import InfinityChallengesTab from "./infinity-challenges/InfinityChallengesTab";
import InfinityDimensionsTab from "./infinity-dimensions/InfinityDimensionsTab";
import InfinityUpgradesTab from "./infinity-upgrades/InfinityUpgradesTab";
import HypercubesTab from "./hypercubes/HypercubesTab";
import LaitelaTab from "./celestial-laitela/LaitelaTab";
import LargeHadronColliderTab from "./large-hadron-collider/LargeHadronColliderTab";
import MultiplierBreakdownTab from "./statistics/MultiplierBreakdownTab";
import CapBreakdownTab from "./statistics/CapBreakdownTab";
import NormalAchievementsTab from "./normal-achievements/NormalAchievementsTab";
import NormalChallengesTab from "./normal-challenges/NormalChallengesTab";
import OptionsGameplayTab from "./options-gameplay/OptionsGameplayTab";
import OptionsSavingTab from "./options-saving/OptionsSavingTab";
import OptionsVisualTab from "./options-visual/OptionsVisualTab";
import PastPrestigeRunsTab from "./past-prestige-runs/PastPrestigeRunsTab";
import PelleTab from "./celestial-pelle/PelleTab";
import PelleDestructionTab from "./celestial-pelle/PelleDestructionTab";
import PerksTab from "./perks/PerksTab";
import PreviousSpeedrunTab from "./speedrun-milestones/PreviousSpeedrunTab";
import RaTab from "./celestial-ra/RaTab";
import RealityUpgradesTab from "./reality-upgrades/RealityUpgradesTab";
import ReplicantiTab from "./replicanti/ReplicantiTab";
import ResurgenceUpgradesTab from "./resurgence-upgrades/ResurgenceUpgradesTab";
import SecretAchievementTab from "./secret-achievements/SecretAchievementTab";
import ShopTab from "./shop/ShopTab";
import SlabdrillTab from "./celestial-slabdrill/SlabdrillTab";
import SpeedrunMilestonesTab from "./speedrun-milestones/SpeedrunMilestonesTab";
import StatisticsTab from "./statistics/StatisticsTab";
import TeresaTab from "./celestial-teresa/TeresaTab";
import TimeDilationTab from "./time-dilation/TimeDilationTab";
import TimeDimensionsTab from "./time-dimensions/TimeDimensionsTab";
import TimeCompressionTab from "./time-compression/TimeCompressionTab";
import TimeStudiesTab from "./time-studies/TimeStudiesTab";
import TangibleUniverseTab from "./tangible-universe/TangibleUniverseTab";
import TransientUniverseTab from "./transient-universe/TransientUniverseTab";
import HellGateTab from "./hell/HellGateTab";
import HellInformationTab from "./hell/HellInformationTab";
import HellGalaxyPointsTab from "./hell/HellGalaxyPointsTab";
import VTab from "./celestial-v/VTab";

// mod
import entropy from "./glitch/entropy";
import GlitchChallengesTab from "./glitch/glitchchallengestab.vue";
import RemakeTab from "./remake/RemakeTab";

import GlitchTab from "./celestial-glitch/GlitchTab";

import ChaosDimensionsTab from "./chaos-dimensions/ChaosDimensionsTab";

// meta

import MetaFabricatorTab from "./meta/MetaFabricatorTab";
import MetaMilestonesTab from "./meta/MetaMilestonesTab";
import CanteTab from "./celestial-cante/CanteTab";
import NullTab from "./celestial-null/NullTab";

import AITab from "./april-fools/AITab";


const TabComponents = {
  AntimatterDimensionsTab,
  InfinityDimensionsTab,
  TimeDimensionsTab,
  CelestialDimensionsTab,
  DivineDimensionsTab,
  OptionsSavingTab,
  OptionsVisualTab,
  OptionsGameplayTab,
  StatisticsTab,
  ChallengeRecordsTab,
  CelestialBreakInfinityTab,
  CelestialEternityPlusUpgradesTab,
  CelestialEternityUpgradesTab,
  CelestialInfinityUpgradesTab,
  CelestialNavigationTab,
  DivinityMilestonesTab,
  DivinityUpgradesTab,
  PastPrestigeRunsTab,
  GlyphSetRecordsTab,
  SpeedrunMilestonesTab,
  PreviousSpeedrunTab,
  NormalAchievementsTab,
  SecretAchievementTab,
  TeresaTab,
  AlphaTab,
  SlabdrillTab,
  EffarigTab,
  EnslavedTab,
  VTab,
  RaTab,
  LaitelaTab,
  EndgameTab,
  BreakEternityTab,
  PelleDestructionTab,
  ExpansionPacksTab,
  EndgameMasteriesTab,
  EndgameMilestonesTab,
  EndgameUpgradesTab,
  GalacticPowerTab,
  EtherealTab,
  HypercubesTab,
  TimeCompressionTab,
  AscensionTab,
  LargeHadronColliderTab,
  PelleTab,
  AutobuyersTab,
  AutomatorTab,
  NormalChallengesTab,
  InfinityChallengesTab,
  EternityChallengesTab,
  InfinityUpgradesTab,
  BreakInfinityTab,
  ReplicantiTab,
  ResurgenceUpgradesTab,
  TimeStudiesTab,
  TangibleUniverseTab,
  TransientUniverseTab,
  HellGateTab,
  HellInformationTab,
  HellGalaxyPointsTab,
  EternityMilestonesTab,
  TimeDilationTab,
  GlyphsTab,
  RealityUpgradesTab,
  ImaginaryUpgradesTab,
  DualityUpgradesTab,
  PerksTab,
  BlackHoleTab,
  AlchemyTab,
  ShopTab,
  MultiplierBreakdownTab,
  CapBreakdownTab,
  entropy, // new stuff
  GlitchChallengesTab,
  RemakeTab,
  GlitchTab,
  ChaosDimensionsTab, // meta
  MetaFabricatorTab,
  MetaMilestonesTab,
  CanteTab,
  NullTab,

  AITab // the fools stuff
};

export default TabComponents;
