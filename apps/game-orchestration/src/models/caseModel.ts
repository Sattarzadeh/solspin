import { CaseItem } from './caseItemModel';
import { CaseType } from '../enums/caseType';

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
