import { CaseItem } from "./case_item_model";
import { CaseType } from "../enums/caseType";


interface BaseCase {
    case_type: CaseType;
    case_name: string;
    case_price: number;
    image_url: string;
}

export interface Case extends BaseCase {
    case_hash: string;
    items: Array<CaseItem>;
    item_prefix_sums: Array<number>;
}

export interface CaseOverview extends BaseCase {}
