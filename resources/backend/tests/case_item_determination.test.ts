// src/services/CaseItemDeterminationService.test.ts

import { CaseItemDeterminationService } from '../services/case_item_determination_service';
import { Case } from '../models/case_model';
import { CaseItem } from '../models/case_item_model';

const mockCaseItems: CaseItem[] = [
    {
      price: 10,
      probability: 0.5,
      item_id: 1,
      item_type: 'nft',
      item_name: 'Common NFT',
      image_url: 'http://example.com/images/common-nft.jpg',
      number_range: { min: 0, max: 49999 },
      rarity: 'Common'
    },
    {
      price: 50,
      probability: 0.3,
      item_id: 2,
      item_type: 'nft',
      item_name: 'Uncommon NFT',
      image_url: 'http://example.com/images/uncommon-nft.jpg',
      number_range: { min: 50000, max: 79999 },
      rarity: 'Uncommon'
    },
    {
      price: 100,
      probability: 0.15,
      item_id: 3,
      item_type: 'nft',
      item_name: 'Rare NFT',
      image_url: 'http://example.com/images/rare-nft.jpg',
      number_range: { min: 80000, max: 94999 },
      rarity: 'Rare'
    },
    {
      price: 200,
      probability: 0.05,
      item_id: 4,
      item_type: 'nft',
      item_name: 'Epic NFT',
      image_url: 'http://example.com/images/epic-nft.jpg',
      number_range: { min: 95000, max: 99999 },
      rarity: 'Epic'
    }
  ];
  
  const mockCase: Case = {
    case_type: 'nft',
    case_name: 'Test NFT Case',
    case_price: 100,
    case_hash: 'hash-test-1',
    image_url: 'http://example.com/images/test-nft-case.jpg',
    items: mockCaseItems,
    item_prefix_sums: [49999, 79999, 94999, 99999],
  };

describe('CaseItemDeterminationService', () => {
  let service: CaseItemDeterminationService;

  beforeEach(() => {
    service = new CaseItemDeterminationService();
  });

  it('should return the correct item for a given roll number', () => {
    let rollNumber = 30;
    let item = service.determineItem(rollNumber, mockCase);
    expect(item).toEqual(mockCaseItems[0]);
    rollNumber = 51000;
    item = service.determineItem(rollNumber, mockCase);
    expect(item).toEqual(mockCaseItems[1]);

    rollNumber = 81000;
    item = service.determineItem(rollNumber, mockCase);
    expect(item).toEqual(mockCaseItems[2]);

    rollNumber = 95000;
    item = service.determineItem(rollNumber, mockCase);
    expect(item).toEqual(mockCaseItems[3]);
  });

  it('should return the last item for a roll number at the upper bound', () => {
    const rollNumber = 99999;
    const item = service.determineItem(rollNumber, mockCase);
    expect(item).toEqual(mockCaseItems[3]);
  });

  it('should handle roll numbers at the lower bound', () => {
    const rollNumber = 0;
    const item = service.determineItem(rollNumber, mockCase);
    expect(item).toEqual(mockCaseItems[0]);
  });
});
