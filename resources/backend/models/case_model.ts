import {NftCaseItem, CsgoCaseItem} from "./case_item_model"

export interface Case {
    case_type: "nft" | "csgo";
    case_name: string;
    case_price: number;
    case_hash: string;
    image_url: string;
    items: Array<NftCaseItem|CsgoCaseItem>
    item_prefix_sums: Array<number>;

}