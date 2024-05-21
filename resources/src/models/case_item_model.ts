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
interface CsgoCaseItem extends BaseCaseItem{
    is_stattrak: boolean;
    is_souvenir: boolean;
    item_wear: string;
}

 type NftCaseItem = BaseCaseItem;

export type CaseItem = CsgoCaseItem | NftCaseItem


