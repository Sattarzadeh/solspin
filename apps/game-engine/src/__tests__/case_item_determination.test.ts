// // src/services/case_item_determination_service.test.ts

// import { CaseItemDeterminationService } from '../services/case_item_determination_service';
// import { mockCase } from '../mock/case.mock';

// describe('CaseItemDeterminationService', () => {
//   let service: CaseItemDeterminationService;

//   beforeEach(() => {
//     service = new CaseItemDeterminationService();
//   });

//   it('should return the correct item for a given roll number', () => {
//     let rollNumber = 4999; // Within the range of the first item
//     let item = service.determineItem(rollNumber, mockCase);
//     expect(item).toEqual(mockCase.items[0]);

//     rollNumber = 5000; // Within the range of the second item
//     item = service.determineItem(rollNumber, mockCase);
//     expect(item).toEqual(mockCase.items[1]);

//     rollNumber = 15000; // Within the range of the third item
//     item = service.determineItem(rollNumber, mockCase);
//     expect(item).toEqual(mockCase.items[2]);

//     rollNumber = 35000; // Within the range of the fourth item
//     item = service.determineItem(rollNumber, mockCase);
//     expect(item).toEqual(mockCase.items[3]);

//     rollNumber = 36000; // Within the range of the fifth item
//     item = service.determineItem(rollNumber, mockCase);
//     expect(item).toEqual(mockCase.items[4]);

//     rollNumber = 41000; // Within the range of the sixth item
//     item = service.determineItem(rollNumber, mockCase);
//     expect(item).toEqual(mockCase.items[5]);
//   });

//   it('should return the last item for a roll number at the upper bound', () => {
//     const rollNumber = 99999; // Upper bound of the last item
//     const item = service.determineItem(rollNumber, mockCase);
//     expect(item).toEqual(mockCase.items[5]);
//   });

//   it('should handle roll numbers at the lower bound', () => {
//     const rollNumber = 0; // Lower bound of the first item
//     const item = service.determineItem(rollNumber, mockCase);
//     expect(item).toEqual(mockCase.items[0]);
//   });
// });
