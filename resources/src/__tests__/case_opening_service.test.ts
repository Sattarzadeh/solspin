
import crypto from 'crypto';
import { CaseRollValueGenerator } from '../services/case_roll_value_generator'

describe('CaseRollValueGenerator', () => {
  let service: CaseRollValueGenerator;

  beforeEach(() => {
    service = new CaseRollValueGenerator();
  });

  it('should generate a valid client seed', () => {
    service['generateClientSeed']();
    const clientSeed = service['clientSeed'];
    expect(clientSeed).toBeDefined();
    expect(parseInt(clientSeed)).toBeGreaterThan(0);
  });

  it('should generate a valid server seed', () => {
    service['generateServerSeed']();
    const serverSeed = service['serverSeed'];
    expect(serverSeed).toBeDefined();
    expect(serverSeed).toHaveLength(32);
  });

  it('should generate a valid combined seed', () => {
    service['generateClientSeed']();
    service['generateServerSeed']();
    service['generateCombinedSeed']();
    const combinedSeed = service['combinedSeed'];
    expect(combinedSeed).toBeDefined();
    expect(combinedSeed).toHaveLength(64);
  });

  it('should generate a roll value within the expected range', () => {
    const rollValue = service.generateRollValue();
    expect(rollValue).toBeGreaterThanOrEqual(1);
    expect(rollValue).toBeLessThanOrEqual(99999);
  });

  it('should generate different roll values on subsequent calls', () => {
    const rollValue1 = service.generateRollValue();
    const rollValue2 = service.generateRollValue();
    expect(rollValue1).not.toBe(rollValue2);
  });
});
