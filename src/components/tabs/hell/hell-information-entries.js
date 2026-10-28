import wordShift from "@/core/word-shift";

// Each entry is one selectable page of the Information subtab.
// `name` and `lines` may be HTML strings or functions returning strings (evaluated every update).
// `isActive` may be a boolean or function; inactive entries are hidden from the selector.
export const hellInformationEntries = [
  {
    key: "squareCubic",
    name: () => `${wordShift.wordCycle(["Curse", "Fate", "Mercy"], true)} of ${wordShift.randomCrossWords("SquareCubic", 0.2)}`,
    isActive: true,
    lines: [
      "Multiple challenges and nerfs from lost time are applied; these can be checked in other entries.",
      "If a production is nerfed by several sources, every nerf is applied, except that being Dilated more than once only applies a single Dilation.",
      "You start with all tabs unlocked, but their contents are still locked until their conditions are met.",
      "All quotes are automatically skipped except for SquareCubic's.",
      "All animations and confirmations are disabled at the start.",
      "You start with Infinity and Eternity broken.",
      "Antimatter hardcap is disabled.",
      "Enabled challenges from Hell cannot be manually entered or exited; you are trapped.",
      "Unlock requirements that say not to start any challenge ignore challenges you are already trapped in.",
      "Unlock requirements that say to start a challenge are always counted as met inside Hell if you are already trapped in one.",
      "Challenges you are already trapped in are marked as completed as soon as their goal is met.",
      "Cursed Glyphs stay active regardless of Glyph disabling.",
      "Normal Challenges are unlocked regardless of your Infinities.",
      "When all Glyph slots are full, equipping a Cursed Glyph (including forced equips) gives a temporary extra slot, which is removed when the Glyph is unequipped.",
      "Passive STD generation is disabled until an upgrade is bought (NYI).",
      "Offline progression is disabled until an upgrade is bought (NYI)."
    ]
  },
  {
    key: "ngMinus1",
    name: "Remnant of First Minus (NG-1)",
    isActive: true,
    lines: [
      "<b>Dimensions</b>",
      "You start with -1 Antimatter Galaxies.",
      "Your first Antimatter Dimension is already bought 5 times.",
      "Normal Dimensions are 0.1x as powerful.",
      "The Dimension Multiplier Decrease starts at 11 instead of 10.",
      "Infinity Dimensions are weakened.",
      "Time Dimensions are weakened.",
      "&nbsp;",
      "<b>Infinity</b>",
      "You start with 990 Infinities and -1,000 Infinities in your bank.",
      "Your Infinity Point multiplier starts at 0.5x, and its first purchase costs 30 IP.",
      "Passive Infinity Point and Infinity generation counters start at -1e300 and -1e8, respectively.",
      "Replicanti starts with a 5-second interval, and Offline Production costs 5e11 IP to unlock.",
      "&nbsp;",
      "<b>Achievements</b>",
      () => {
        const achievement = wordShift.randomCrossWords("Spreading Cancer", 0.2);
        return `<s>Your Spreading Cancer counter starts at -9,990, so you need 10,000 Galaxy purchases in Cancer notation to unlock "${achievement}".</s>`;
      },
      "You start with Achievement 22 (Fake News) and Achievement 85 completed, but Achievement 85's reward is disabled.",
      "&nbsp;",
      "<b>Eternity</b>",
      "You start with -20 Eternities.",
      "You start with -6 Time Theorems.",
      "The initial Time Theorem cost in IP is 1e-13.",
      "You start with -6 completions of Eternity Challenge 1.",
      "&nbsp;",
      "<b>Dilation</b>",
      "You start with 2,000 total Tachyon Particles and one level of Dilation rebuyable 2.",
      "<i>These negative values are intended. Their effects apply even when the value is not positive.</i>"
    ]
  },
  {
    key: "ngMinus2",
    name: "Remnant of Second Minus (NG-2)",
    isActive: true,
    lines: [
      "<b>Dimensions</b>",
      () => `<s>You can perform ${wordShift.randomCrossWords("Galactic Sacrifice", 0.2)}.</s>`,
      "Your first Antimatter Galaxy requires far fewer 8th Dimensions.",
      "Antimatter Galaxy requirements scale differently, and Remote Galaxy scaling no longer exists.",
      "Supersonic scaling of Dimension Boost requirements no longer exists.",
      "Dimension Boosts and Antimatter Galaxies are affected differently by Infinity upgrades and Challenges.",
      "&nbsp;",
      "<b>Infinity</b>",
      "You are trapped in Infinity Challenge 3.",
      "<s>There are 2 additional Normal Challenges.</s>",
      "There are 2 additional Infinity Challenges.",
      "Several Infinity upgrades work differently, and additional Infinity upgrades exist.",
      "<s>Antimatter Galaxies increase your Infinity Point gain.</s>",
      "<s>Replicanti upgrades are cheaper.</s>",
      "&nbsp;",
      "<b>Achievements</b>",
      "Achievement rewards are much stronger.",
      "&nbsp;",
      "<b>Eternity</b>",
      "Eternity Challenges have different goals and requirements.",
      "Some Time Studies are much stronger.",
      "&nbsp;",
      "<b>Dilation</b>",
      "You are trapped in Time Dilation.",
      "Dilation affects Tickspeed differently, and has different upgrades and costs."
    ]
  },
  {
    key: "ngMinus3",
    name: "Remnant of Third Minus (NG-3)",
    isActive: true,
    lines: [
      "<b>Dimensions</b>",
      () => `<s>You can perform ${wordShift.randomCrossWords("Tickspeed Boosts", 0.2)}.</s>`,
      "Buying ten of a Dimension gives a much smaller multiplier.",
      "Normal Dimensions produce much more slowly.",
      "Tickspeed upgrades and Antimatter Galaxies are weaker.",
      "&nbsp;",
      "<b>Infinity</b>",
      "<s>There is 1 additional Normal Challenge and 4 additional Infinity Challenges.</s>",
      "Several Infinity upgrade costs and effects are changed.",
      () => `<s>${wordShift.randomCrossWords("Galaxy Points", 0.2)} are lost when you Infinity.</s>`,
      "&nbsp;",
      "<b>Achievements</b>",
      "Some achievement rewards work differently."
    ]
  },
  {
    key: "ngMinus4",
    name: "Remnant of Fourth Minus (NG-4)",
    isActive: true,
    lines: [
      "<b>Dimensions</b>",
      () => `<s>You can perform ${wordShift.randomCrossWords("Time Dimension Boosts", 0.2)}.</s>`,
      "Normal Dimensions and Time Dimensions produce even more slowly.",
      "Dimension Boost and Antimatter Galaxy requirements are changed.",
      "Time Dimensions are bought with antimatter instead of Eternity Points, and need a 1st Dimension to buy.",
      "Time Dimensions gain the Antimatter Dimension multiplier per purchase, and only the first 1.8e308 antimatter can be spent on them.",
      "Dimension cost increases are raised to the 1.25 power.",
      "Infinity Dimensions produce 100 times more slowly.",
      "Antimatter Galaxies become Remote much earlier and scale faster; a new Break Infinity upgrade delays this.",
      "&nbsp;",
      "<b>Infinity</b>",
      "<s>There is 1 additional Normal Challenge.</s>",
      () => `<s>${wordShift.randomCrossWords("Galaxy Points", 0.2)} replace Infinity Points as the currency for Autobuyer upgrades.</s>`,
      () => `<s>${wordShift.randomCrossWords("Galaxy", 0.2)} upgrades are changed, and more of them exist.</s>`,
      "&nbsp;",
      "<b>Achievements</b>",
      "<s>Some achievement rewards are changed to work with Time Dimension Boosts.</s>",
      "&nbsp;",
      "<b>Dilation</b>",
      "The Time Dilation penalty is stronger."
    ]
  },
  {
    key: "ngMinus5",
    name: "Remnant of Fifth Minus (NG-5)",
    isActive: true,
    lines: [
      "<b>Dimensions</b>",
      () => `<s>You can perform ${wordShift.randomCrossWords("Paradox Sacrifice", 0.2)}.</s>`,
      () => `<s>You can buy ${wordShift.randomCrossWords("Paradox Dimensions", 0.2)} and ${wordShift.randomCrossWords("Paradox Upgrades", 0.2)}.</s>`,
      "You only have 6 Dimensions of each kind.",
      "Each Dimension produces the Dimension two tiers below it.",
      "You are trapped in Normal Challenges 2, 4, 6, 7 and 12.",
      "Game speed is 1,000x slower like in Eternity Challenge 12, applied after all other game speed effects, but this can be improved with Break Infinity upgrades.",
      "&nbsp;",
      "<b>Infinity</b>",
      "Infinity Dimensions are bought with antimatter instead of Infinity Points, and need a 1st Dimension to buy.",
      "All Infinity Dimensions up to the 6th are unlocked from the start."
    ]
  },
  {
    key: "fragTeresa",
    name: "Fragmentation of Teresa",
    isActive: true,
    lines: [
      "You are trapped in Teresa's Reality.",
      "Glyph Time Theorem generation is disabled.",
      "You gain less Infinity Points and Eternity Points (x^0.55)."
    ]
  },
  {
    key: "fragEffarig",
    name: "Fragmentation of Effarig",
    isActive: true,
    lines: [
      "You are trapped in Effarig's Reality.",
      "All Dimension multipliers, game speed, and tickspeed are severely lowered, like Dilation.",
      "Infinity Power reduces the production and game speed penalties, and Time Shards reduce the tickspeed penalty.",
      "<s>Glyph levels are temporarily capped, rarity is unaffected.</s>"
    ]
  },
  {
    key: "fragEnslaved",
    name: "Fragmentation of The Nameless Ones",
    isActive: true,
    lines: [
      "You are trapped in The Nameless Ones' Reality.",
      "<s>Glyph levels are boosted to a minimum of 5,000.</s>",
      "Infinity, Time, and 8th Antimatter Dimension purchases are limited to 1 each.",
      "Antimatter Dimension multipliers are always Dilated.",
      "Time Study 192 (uncapped Replicanti) is locked.",
      "The Black Hole is disabled.",
      "Tachyon Particle and Dilated Time production are severely reduced.",
      "Time Theorem generation from Dilation Glyphs is disabled.",
      "Certain challenge goals are increased.",
      "Stored game time is discharged at a reduced effectiveness (exponent^0.55)."
    ]
  },
  {
    key: "fragV",
    name: "Fragmentation of V",
    isActive: true,
    lines: [
      "You are trapped in V's Reality.",
      "You are also trapped in V's Extreme Reality.",
      "<s>All Dimension multipliers, Eternity Point gain, Infinity Point gain, and Dilated Time gain per second are square-rooted.</s>",
      "Eternity Point gain, Infinity Point gain, and Dilated Time gain per second are square-rooted.",
      "All Dimension multipliers are raised to the power of 0.001.",
      "Dilated Time gain per second is additionally raised to the power of 0.2.",
      "Tachyon Particle multiplier is square-rooted.",
      "The Tickspeed is raised to the power of 0.00025.",
      "The Replicanti interval is squared, and then raised to the power of 32.",
      "Replicanti scaling past the cap is 32 times stronger.",
      "Chaos Cores no longer boost Tickspeed.",
      "Imaginary Dimension Boosts are disabled.",
      "The Exponential Glyph Alchemy effect is disabled."
    ]
  },
  {
    key: "fragRa",
    name: "Fragmentation of Ra",
    isActive: true,
    lines: [
      "You are trapped in Ra's Reality.",
      "You only have 4 Dimension Boosts and cannot gain any more.",
      "<s>The Tickspeed purchase multiplier is fixed at x1.125.</s>",
      "The Tickspeed purchase multiplier is capped at x1.125, and Infinity Challenge 3 still takes priority over it."
    ]
  },
  {
    key: "fragLaitela",
    name: "Fragmentation of Lai'tela",
    isActive: true,
    lines: [
      "You are trapped in Lai'tela's Reality.",
      "Infinity Point and Eternity Point gain are Dilated.",
      "<s>Game speed is reduced to 1 and gradually comes back over 10 minutes.</s>",
      "Black Hole storing, discharging, pulsing, and inversion are all disabled.",
      "Higher Dimensions stop producing as the Reality becomes more difficult: you lose one Dimension tier for every 1e100 antimatter you have."
    ]
  },
  {
    key: "fragPelle",
    name: "Fragmentation of Pelle",
    isActive: true,
    lines: [
      "You are trapped in a Doomed Reality.",
      "<b>Dimensions</b>",
      "Antimatter Dimension multiplier is divided by 10.",
      "All Galaxies are only 50% as effective.",
      "All Dimension and pre-Infinity Autobuyers are disabled until reacquired through Pelle.",
      "&nbsp;",
      "<b>Infinity</b>",
      "All pre-Doomed IP multipliers are disabled.",
      "IP generation based on fastest infinity speed is disabled.",
      "All pre-Doomed Replicanti speed multipliers are disabled.",
      "Replicanti slows down more drastically above 1.79e308.",
      "All Infinity and Eternity multipliers and generation are disabled.",
      "Infinity Upgrades cannot be charged.",
      "&nbsp;",
      "<b>Achievements</b>",
      "Achievement multiplier and many achievement rewards are disabled.",
      "All rewards which increase your starting resources except Achievement 21 are disabled.",
      "All rewards which prevent resources from being reset are disabled.",
      "&nbsp;",
      "<b>Eternity</b>",
      "Most Eternity Challenges are harder.",
      "All pre-Doomed EP multipliers are disabled.",
      "Automatic Infinity and Eternity Challenges are disabled.",
      "The Time Theorem Autobuyer is disabled.",
      "Eternity Upgrade to Time Dimensions based on days played is based on this Armageddon time.",
      "All pre-Doomed Time Theorem generation effects are disabled except the Dilation upgrade.",
      "Perk rewards which reduce unlock costs are disabled, excluding the ECR group.",
      "Triad Studies and Space Theorems are disabled.",
      "&nbsp;",
      "<b>Dilation</b>",
      "All pre-Doomed Dilated Time multipliers are disabled except the x2 buyable.",
      "All Tachyon Particle multipliers are disabled.",
      "All Automation related to Time Dilation or later is disabled.",
      "&nbsp;",
      "<b>Reality</b>",
      "Anything unlocked through a Pelle upgrade cannot be unlocked normally.",
      "Black Holes are disabled.",
      "Reality Upgrade \"Temporal Transcendence\" is disabled.",
      "Glyph equipping is disabled until reacquired.",
      "<s>Glyph levels are lowered and rarity is set to 0%.</s>",
      "Effects from Glyph Sacrifice, Alteration, and Alchemy are all disabled.",
      "Music Glyphs cannot be bought.",
      "Imaginary Upgrades are disabled excluding those relating to DMD's and Celestial unlocks.",
      "Continuum and Singularity rewards are disabled.",
      "&nbsp;",
      "<b>Celestials</b>",
      "<s>You cannot enter any other Celestial Realities.</s>",
      "All rewards from Effarig are disabled.",
      "All rewards from V are disabled.",
      "All features related to storing time are disabled.",
      "The Teresa Level 1 effect from Ra is disabled."
    ]
  },
  {
    key: "fragGlitch",
    name: "Fragmentation of Glitch",
    isActive: true,
    lines: [
      "You are trapped in Glitch's Reality.",
      "Antimatter Dimensions are raised to ^0.95.",
      "Infinity Dimensions are raised to ^0.15.",
      "Time Dimensions are raised to ^0.33.",
      "You only start with Break Infinity upgrades, and you cannot charge them.",
      "Some Reality and Celestial effects do not work.",
      "You are forced to have Cursed Glyphs equipped."
    ]
  },
  {
    key: "fragAlpha",
    name: "Fragmentation of Alpha",
    isActive: true,
    lines: [
      "You are trapped in Alpha's Reality.",
      "Everything unlocked or gained after reaching Reality for the first time is disabled.",
      "Alpha's layers can be completed, but completing one resets nothing; it only raises the layer so its nerfs apply.",
      "Celestial Dimensions and Cosmic Sector still work, but are severely nerfed.",
      "Most game-time based features become real-time based.",
      "The Achievement Multiplier and many Achievements are destroyed.",
      "Antimatter Dimension multipliers are divided by 125 times the exponent of your antimatter."
    ]
  },
  {
    key: "fragSlabdrill",
    name: "Fragmentation of Slabdrill",
    isActive: true,
    lines: [
      "You are trapped in a Cursed Reality.",
      "Glyph levels are capped based on your Serpentine Power, starting at level 0."
    ]
  },
  {
    key: "ghostQuantum",
    name: "Ghost of Quantum (NG+3: Big Rip)",
    isActive: true,
    lines: [
      "You are trapped in Big Rip, the paired challenge of Quantum Challenge 6 and Quantum Challenge 8.",
      "&nbsp;",
      "<b>Quantum Challenge 6</b>",
      "Infinity Challenges 2, 6, 7 and 8 are applied to Normal, Infinity, and Time Dimensions.",
      "Infinity Challenge 3 is applied to Normal Dimensions.",
      "Matter cannot surpass antimatter, or you fail the challenge.",
      () => `<s>You can't gain Dimension Boosts, but the multiplier per 10 ${wordShift.randomCrossWords("Meta Dimensions", 0.2)} bought is slightly stronger.</s>`,
      "&nbsp;",
      "<b>Quantum Challenge 8</b>",
      "Infinity and Time Dimensions are disabled.",
      () => `<s>${wordShift.randomCrossWords("Meta-Dimension", 0.2)} Boosts have no effect.</s>`
    ]
  },
  {
    key: "ghostVoid",
    name: "Ghost of Void",
    isActive: true,
    lines: [
      "You are trapped in the Void.",
      "<s>Ascension, Universes and Compression are disabled.</s>",
      "<s>You cannot enter Pelle's Reality.</s>",
      "Accelerator effects are disabled.",
      "&nbsp;",
      "<b>The Void</b>",
      "Null Upgrades are active, and you earn Null Matter instead of normal antimatter production.",
      "Null Particles raise your Antimatter Dimension multipliers to a power.",
      "&nbsp;",
      "<b>The Nullified Void</b>",
      "<s>Null Upgrades have no effect</s>, and you earn Null Particles instead.",
      "Antimatter Dimension production above 10 is severely softcapped (log10 ^0.01)."
    ]
  },
  {
    key: "ghostTransient",
    name: "Ghost of Transient",
    isActive: true,
    lines: [
      "You are trapped in the Transient Universe.",
      "Tickspeed and Time Dimensions are disabled.",
      "<s>Game Speed is fixed at 0.001.</s>",
      "Game Speed is 1,000x slower, like Eternity Challenge 12, applied after all other game speed effects.",
      "Tachyon Particle and Dilated Time gain are severely reduced (exponent^0.1).",
      "The tetration of your Antimatter generation is multiplied by 0.9.",
      "Antimatter and Infinity Dimensions are dilated by 0.1, which can be reduced with Relativistic Particles.",
      "Relativistic Particles are gained based on Antimatter and time spent inside this Universe."
    ]
  },
  {
    key: "ghostTangible",
    name: "Ghost of Tangible",
    isActive: true,
    lines: [
      "You are trapped in the Tangible Universe.",
      "<s>Antimatter Dimensions are translated into Matter Dimensions.</s>",
      "All other Dimension types are disabled, and <s>Lai'tela is disabled entirely</s>.",
      "<s>Game Speed is fixed at 0.001.</s>",
      "Game Speed is 1,000x slower, like Eternity Challenge 12, applied after all other game speed effects.",
      "The tetration of Antimatter is halved, then increased by 1.",
      "Antimatter generates Molecular Mass over time spent inside, which adds to the final tetration of Antimatter gain."
    ]
  },
  {
    key: "ghostOvercharge",
    name: "Ghost of Overcharge",
    isActive: true,
    lines: [
      "You are trapped in the Overcharge.",
      "You are trapped in Eternity Challenge 12.",
      "<s>Game Speed is fixed at 0.001.</s>",
      "Game Speed is 1,000x slower, like Eternity Challenge 12, applied after all other game speed effects.",
      "The tetration of Antimatter production is multiplied by 0.75.",
      "Tickspeed and all Dimension multipliers are dilated at Overcharge level 4<s>, more severely at higher Overcharge levels</s>.",
      "<s>Ascension, Universes and Compression are disabled.</s>"
    ]
  },
  {
    key: "ghostCompression",
    name: "Ghost of Compression",
    isActive: true,
    lines: [
      "You are trapped in Time Compression.",
      "<s>Game Speed is fixed at 0.001.</s>",
      "Game Speed is 1,000x slower, like Eternity Challenge 12, applied after all other game speed effects.",
      "The exponents of the first three Dimension types' multipliers and of the Tickspeed multiplier are reduced, based on Antimatter and time spent in Compression.",
      "Reaching Infinity while Compressed raises your Hawking Radiation based on your highest Antimatter.",
      "<s>Overcharge, Universes and the Void are disabled.</s>"
    ]
  }
];
