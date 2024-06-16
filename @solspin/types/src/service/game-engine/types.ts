interface BaseCaseItem {
  price: number;
  probability: number;
  item_id: number;
  item_type: string;
  item_name: string;
  image_url: string;
  number_range: object;
  rarity: string;
}
interface CsgoCaseItem extends BaseCaseItem {
  is_stattrak: boolean;
  is_souvenir: boolean;
  item_wear: string;
}

type NftCaseItem = BaseCaseItem;

export type CaseItem = CsgoCaseItem | NftCaseItem;

export enum CaseType {
  NFT = "nft",
  CSGO = "csgo",
}

interface BaseCase {
  caseType: CaseType;
  caseName: string;
  casePrice: number;
  caseId: string;
  image_url: string;
}

export interface Case extends BaseCase {
  caseHash: string;
  items: Array<CaseItem>;
  item_prefix_sums: Array<number>;
}

export interface CaseOverview extends BaseCase {}
