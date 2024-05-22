import { CaseItem } from "../models/case_item_model";
import { Case } from "../models/case_model";
import { CaseType } from "../enums/caseType";


const mockCsgoCaseItem1: CaseItem = {
    price: 10.5,
    probability: 0.05, // 5%
    item_id: 1,
    item_type: 'weapon',
    item_name: 'AK-47 | Redline',
    image_url: 'https://example.com/ak47_redline.png',
    number_range: { start: 0, end: 4999 },
    rarity: 'covert',
    is_stattrak: true,
    is_souvenir: false,
    item_wear: 'Field-Tested'
};

const mockCsgoCaseItem2: CaseItem = {
    price: 15,
    probability: 0.10, // 10%
    item_id: 2,
    item_type: 'weapon',
    item_name: 'AWP | Asiimov',
    image_url: 'https://example.com/awp_asiimov.png',
    number_range: { start: 5000, end: 14999 },
    rarity: 'classified',
    is_stattrak: false,
    is_souvenir: true,
    item_wear: 'Minimal Wear'
};

const mockCsgoCaseItem3: CaseItem = {
    price: 5,
    probability: 0.20, // 20%
    item_id: 3,
    item_type: 'weapon',
    item_name: 'Desert Eagle | Blaze',
    image_url: 'https://example.com/deagle_blaze.png',
    number_range: { start: 15000, end: 34999 },
    rarity: 'restricted',
    is_stattrak: false,
    is_souvenir: false,
    item_wear: 'Factory New'
};

const mockNftCaseItem1: CaseItem = {
    price: 20,
    probability: 0.01, // 1%
    item_id: 4,
    item_type: 'nft',
    item_name: 'CryptoPunk #1234',
    image_url: 'https://example.com/cryptopunk_1234.png',
    number_range: { start: 35000, end: 35999 },
    rarity: 'legendary'
};

const mockNftCaseItem2: CaseItem = {
    price: 18,
    probability: 0.05, // 5%
    item_id: 5,
    item_type: 'nft',
    item_name: 'Bored Ape #5678',
    image_url: 'https://example.com/boredape_5678.png',
    number_range: { start: 36000, end: 40999 },
    rarity: 'epic'
};

const mockNftCaseItem3: CaseItem = {
    price: 12,
    probability: 0.59, // 59%
    item_id: 6,
    item_type: 'nft',
    item_name: 'Art Block #9012',
    image_url: 'https://example.com/artblock_9012.png',
    number_range: { start: 41000, end: 99999 },
    rarity: 'common'
};

const mockCase: Case = {
    case_type: CaseType.CSGO,
    case_name: 'test-case',
    case_price: 2.5,
    image_url: 'https://example.com/bravo_case.png',
    case_hash: 'abc123def456',
    items: [
        mockCsgoCaseItem1,
        mockCsgoCaseItem2,
        mockCsgoCaseItem3,
        mockNftCaseItem1,
        mockNftCaseItem2,
        mockNftCaseItem3
    ],
    item_prefix_sums: [
        4999, 
        14999, 
        34999, 
        35999, 
        40999, 
        99999  
    ]
};

export {
    mockCsgoCaseItem1,
    mockCsgoCaseItem2,
    mockCsgoCaseItem3,
    mockNftCaseItem1,
    mockNftCaseItem2,
    mockNftCaseItem3,
    mockCase
};