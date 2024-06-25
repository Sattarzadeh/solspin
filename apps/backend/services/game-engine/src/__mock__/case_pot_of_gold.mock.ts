import { CaseItem, Case, CaseOverview } from "@solspin/game-engine-types";
import { CaseType } from "../foundation/caseType";
import { randomUUID } from "crypto";

const mockCsgoCaseItem1: CaseItem = {
  price: 2998.81,
  probability: 0.012, // 1.20%
  item_id: 1,
  item_type: "weapon",
  item_name: "AK-47 | Gold Arabesque",
  image_url: "https://example.com/ak47_gold_arabesque.png",
  number_range: { start: 0, end: 11 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Minimal Wear",
};

const mockCsgoCaseItem2: CaseItem = {
  price: 2875.02,
  probability: 0.025, // 2.50%
  item_id: 2,
  item_type: "weapon",
  item_name: "M9 Bayonet | Lore",
  image_url: "https://example.com/m9_bayonet_lore.png",
  number_range: { start: 12, end: 36 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Minimal Wear",
};

const mockCsgoCaseItem3: CaseItem = {
  price: 2164.85,
  probability: 0.028, // 2.80%
  item_id: 3,
  item_type: "weapon",
  item_name: "Butterfly Knife | Tiger Tooth",
  image_url: "https://example.com/butterfly_knife_tiger_tooth.png",
  number_range: { start: 37, end: 64 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Minimal Wear",
};

const mockCsgoCaseItem4: CaseItem = {
  price: 2051.09,
  probability: 0.03, // 3.00%
  item_id: 4,
  item_type: "gloves",
  item_name: "Sport Gloves | Superconductor",
  image_url: "https://example.com/sport_gloves_superconductor.png",
  number_range: { start: 65, end: 94 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Field-Tested",
};

const mockCsgoCaseItem5: CaseItem = {
  price: 1830.57,
  probability: 0.045, // 4.50%
  item_id: 5,
  item_type: "weapon",
  item_name: "Butterfly Knife | Case Hardened",
  image_url: "https://example.com/butterfly_knife_case_hardened.png",
  number_range: { start: 95, end: 139 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Factory New",
};

const mockCsgoCaseItem6: CaseItem = {
  price: 1402.36,
  probability: 0.08, // 8.00%
  item_id: 6,
  item_type: "weapon",
  item_name: "Karambit | Blue Steel",
  image_url: "https://example.com/karambit_blue_steel.png",
  number_range: { start: 140, end: 219 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Factory New",
};

const mockCsgoCaseItem7: CaseItem = {
  price: 828.57,
  probability: 0.18, // 18.00%
  item_id: 7,
  item_type: "gloves",
  item_name: "Driver Gloves | Black Tie",
  image_url: "https://example.com/driver_gloves_black_tie.png",
  number_range: { start: 220, end: 399 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Minimal Wear",
};

const mockCsgoCaseItem8: CaseItem = {
  price: 552.38,
  probability: 0.455, // 45.50%
  item_id: 8,
  item_type: "weapon",
  item_name: "Talon Knife | Case Hardened",
  image_url: "https://example.com/talon_knife_case_hardened.png",
  number_range: { start: 400, end: 854 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Battle-Scarred",
};

const mockCsgoCaseItem9: CaseItem = {
  price: 417.49,
  probability: 1.345, // 134.50%
  item_id: 9,
  item_type: "weapon",
  item_name: "Stiletto Knife | Blue Steel",
  image_url: "https://example.com/stiletto_knife_blue_steel.png",
  number_range: { start: 855, end: 2199 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Minimal Wear",
};

const mockCsgoCaseItem10: CaseItem = {
  price: 331.86,
  probability: 3.89, // 389.00%
  item_id: 10,
  item_type: "weapon",
  item_name: "Survival Knife | Case Hardened",
  image_url: "https://example.com/survival_knife_case_hardened.png",
  number_range: { start: 2200, end: 6089 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Minimal Wear",
};

const mockCsgoCaseItem11: CaseItem = {
  price: 322.43,
  probability: 5.0, // 500.00%
  item_id: 11,
  item_type: "weapon",
  item_name: "Falchion Knife | Case Hardened",
  image_url: "https://example.com/falchion_knife_case_hardened.png",
  number_range: { start: 6090, end: 11089 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Factory New",
};

const mockCsgoCaseItem12: CaseItem = {
  price: 301.81,
  probability: 7.75, // 775.00%
  item_id: 12,
  item_type: "weapon",
  item_name: "Ursus Knife | Case Hardened",
  image_url: "https://example.com/ursus_knife_case_hardened.png",
  number_range: { start: 11090, end: 18639 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Field-Tested",
};

const mockCsgoCaseItem13: CaseItem = {
  price: 285.91,
  probability: 13.15, // 1315.00%
  item_id: 13,
  item_type: "weapon",
  item_name: "StatTrak™ Bowie Knife | Case Hardened",
  image_url: "https://example.com/bowie_knife_case_hardened.png",
  number_range: { start: 18640, end: 31789 },
  rarity: "extraordinary",
  is_stattrak: true,
  is_souvenir: false,
  item_wear: "Field-Tested",
};

const mockCsgoCaseItem14: CaseItem = {
  price: 256.86,
  probability: 16.0, // 1600.00%
  item_id: 14,
  item_type: "gloves",
  item_name: "Moto Gloves | Smoke Out",
  image_url: "https://example.com/moto_gloves_smoke_out.png",
  number_range: { start: 31790, end: 47789 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Field-Tested",
};

const mockCsgoCaseItem15: CaseItem = {
  price: 233.37,
  probability: 15.0, // 1500.00%
  item_id: 15,
  item_type: "weapon",
  item_name: "AK-47 | Jet Set",
  image_url: "https://example.com/ak47_jet_set.png",
  number_range: { start: 47790, end: 62789 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Factory New",
};

const mockCsgoCaseItem16: CaseItem = {
  price: 136.81,
  probability: 9.61, // 961.00%
  item_id: 16,
  item_type: "weapon",
  item_name: "Survival Knife | Night Stripe",
  image_url: "https://example.com/survival_knife_night_stripe.png",
  number_range: { start: 62790, end: 72399 },
  rarity: "extraordinary",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Battle-Scarred",
};

const mockCsgoCaseItem17: CaseItem = {
  price: 63.37,
  probability: 7.45, // 745.00%
  item_id: 17,
  item_type: "weapon",
  item_name: "StatTrak™ M4A1-S | Guardian",
  image_url: "https://example.com/m4a1s_guardian.png",
  number_range: { start: 72400, end: 79899 },
  rarity: "restricted",
  is_stattrak: true,
  is_souvenir: false,
  item_wear: "Battle-Scarred",
};

const mockCsgoCaseItem18: CaseItem = {
  price: 20.96,
  probability: 19.95, // 1995.00%
  item_id: 18,
  item_type: "weapon",
  item_name: "Tec-9 | Hades",
  image_url: "https://example.com/tec9_hades.png",
  number_range: { start: 79900, end: 99899 },
  rarity: "mil-spec",
  is_stattrak: false,
  is_souvenir: false,
  item_wear: "Factory New",
};

const mockCase: Case = {
  caseType: CaseType.CSGO,
  caseName: "pot-of-gold",
  casePrice: 220,
  caseId: randomUUID(),
  image_url: "https://example.com/bravo_case.png",
  caseHash: "abc123def456",
  items: [
    mockCsgoCaseItem1,
    mockCsgoCaseItem2,
    mockCsgoCaseItem3,
    mockCsgoCaseItem4,
    mockCsgoCaseItem5,
    mockCsgoCaseItem6,
    mockCsgoCaseItem7,
    mockCsgoCaseItem8,
    mockCsgoCaseItem9,
    mockCsgoCaseItem10,
    mockCsgoCaseItem11,
    mockCsgoCaseItem12,
    mockCsgoCaseItem13,
    mockCsgoCaseItem14,
    mockCsgoCaseItem15,
    mockCsgoCaseItem16,
    mockCsgoCaseItem17,
    mockCsgoCaseItem18,
  ],
  item_prefix_sums: [
    11, 36, 64, 94, 139, 219, 399, 854, 2199, 6089, 11089, 18639, 31789, 47789, 62789, 72399, 79899,
    99899,
  ],
};

export {
  mockCsgoCaseItem1,
  mockCsgoCaseItem2,
  mockCsgoCaseItem3,
  mockCsgoCaseItem4,
  mockCsgoCaseItem5,
  mockCsgoCaseItem6,
  mockCsgoCaseItem7,
  mockCsgoCaseItem8,
  mockCsgoCaseItem9,
  mockCsgoCaseItem10,
  mockCsgoCaseItem11,
  mockCsgoCaseItem12,
  mockCsgoCaseItem13,
  mockCsgoCaseItem14,
  mockCsgoCaseItem15,
  mockCsgoCaseItem16,
  mockCsgoCaseItem17,
  mockCsgoCaseItem18,
  mockCase,
};
