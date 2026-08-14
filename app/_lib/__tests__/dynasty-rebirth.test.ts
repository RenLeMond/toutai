import { describe, expect, it } from 'vitest';

import {
  dynasties,
  getDynastyClassProbability,
  getDynastyProbabilityFormula,
  getFlavorLine,
  getClassDescription,
  simulateDynastyBirth,
  simulateEqualDynastyBirth,
  DYNASTY_FLAVORS,
  UNIVERSAL_FLAVORS
} from '@/lib/dynasty-rebirth';



describe('dynasty-rebirth', () => {

  it('dynasty probabilities sum to approximately 1', () => {

    const sum = dynasties.reduce((acc, d) => acc + d.dynastyProb, 0);

    expect(sum).toBeCloseTo(1, 5);

  });



  it('QING is much more likely than QIN', () => {

    const qin = dynasties.find(d => d.id === 'QIN');

    const qing = dynasties.find(d => d.id === 'QING');

    expect(qin).toBeDefined();

    expect(qing).toBeDefined();

    expect(qing!.dynastyProb).toBeGreaterThan(qin!.dynastyProb * 10);

  });



  it('getDynastyClassProbability uses dynasty weight and gender factor', () => {

    const qin = dynasties.find(d => d.id === 'QIN');

    const lord = qin?.classes.find(c => c.level === 1);

    expect(lord?.prob).toBe(0.001);

    expect(getDynastyClassProbability('QIN', lord!.id)).toBeCloseTo(

      qin!.dynastyProb * 0.001 * 0.5,

      10

    );

    expect(getDynastyClassProbability('missing', 'q_1')).toBe(0);

  });



  it('has 13 merged dynasties', () => {
    expect(dynasties).toHaveLength(13);
  });

  it('each dynasty has 6 classes whose probs sum to 1', () => {

    for (const dynasty of dynasties) {

      expect(dynasty.classes).toHaveLength(6);

      const sum = dynasty.classes.reduce((acc, c) => acc + c.prob, 0);

      expect(sum).toBeCloseTo(1, 5);

    }

  });



  it('getDynastyProbabilityFormula uses weighted dynasty model', () => {

    expect(getDynastyProbabilityFormula()).toBe(

      String.raw`\displaystyle{P = p_{\text{朝代}} \times p_{\text{阶级}} \times \frac{1}{2}}`

    );

  });



  it('simulateDynastyBirth returns a valid 6-tier result', () => {

    const result = simulateDynastyBirth();

    expect(result.classLevel).toBeGreaterThanOrEqual(1);

    expect(result.classLevel).toBeLessThanOrEqual(6);

    expect(result.dynastyId).toBeTruthy();

    expect(result.classId).toBeTruthy();

    expect(['male', 'female']).toContain(result.gender);

  });

  it('pairs merged class names with the matching source description', () => {
    const qin = dynasties.find(d => d.id === 'QIN');
    const qing = dynasties.find(d => d.id === 'QING');
    const xin = dynasties.find(d => d.id === 'XIN');
    const qinCommoner = qin?.classes.find(c => c.level === 5);
    const qinBottom = qin?.classes.find(c => c.level === 6);
    const qingCommoner = qing?.classes.find(c => c.level === 5);
    const qingBottom = qing?.classes.find(c => c.level === 6);
    const xinCommoner = xin?.classes.find(c => c.level === 5);

    expect(qinCommoner?.name).toBe('编户齐民');
    expect(qinCommoner?.desc).toContain('自耕');
    expect(qinCommoner?.desc).not.toContain('租种豪强');
    expect(qinBottom?.name).toBe('官工匠');
    expect(qinBottom?.desc).toContain('官府征发');
    expect(qinBottom?.desc).not.toContain('性命悬于一线');

    expect(qingCommoner?.name).toBe('自耕旗民');
    expect(qingCommoner?.desc).toContain('自耕');
    expect(qingCommoner?.desc).not.toContain('租种地主');
    expect(qingBottom?.name).toBe('匠役');
    expect(qingBottom?.desc).toContain('手工业者');
    expect(qingBottom?.desc).not.toContain('无地流民');

    expect(xinCommoner?.name).toBe('编户农民');
    expect(xinCommoner?.desc).not.toContain('绿林赤眉');
  });

  it('simulateEqualDynastyBirth returns valid result with or without targetLevel', () => {
    const randomResult = simulateEqualDynastyBirth();
    expect(randomResult.classLevel).toBeGreaterThanOrEqual(1);
    expect(randomResult.classLevel).toBeLessThanOrEqual(6);

    const l1Result = simulateEqualDynastyBirth(1);
    expect(l1Result.classLevel).toBe(1);

    const l2Result = simulateEqualDynastyBirth(2);
    expect(l2Result.classLevel).toBe(2);
  });

  it('getFlavorLine returns valid dynasty-specific or universal flavor strings', () => {
    // Test with dynastyId and level
    for (let level = 1; level <= 6; level++) {
      const line = getFlavorLine(level as 1 | 2 | 3 | 4 | 5 | 6, 'XIN');
      expect(typeof line).toBe('string');
      expect(line.length).toBeGreaterThan(0);
    }

    // Test fallback when no dynastyId is provided
    for (let level = 1; level <= 6; level++) {
      const line = getFlavorLine(level as 1 | 2 | 3 | 4 | 5 | 6);
      expect(UNIVERSAL_FLAVORS[level as 1 | 2 | 3 | 4 | 5 | 6]).toContain(line);
    }

    // Verify all 13 dynasties have flavor configurations
    for (const dynasty of dynasties) {
      expect(DYNASTY_FLAVORS[dynasty.id]).toBeDefined();
    }
  });

  it('getClassDescription returns random description from pool or falls back to desc', () => {
    const qin = dynasties.find(d => d.id === 'QIN')!;
    const royal = qin.classes[0];
    expect(royal.descriptions).toBeDefined();
    expect(royal.descriptions!.length).toBeGreaterThanOrEqual(2);

    const picked = getClassDescription(royal);
    expect(royal.descriptions).toContain(picked);

    // Fallback test
    const dummyClass = {
      id: 'dummy',
      name: '测试',
      level: 1 as const,
      prob: 1,
      desc: '基准描述'
    };
    expect(getClassDescription(dummyClass)).toBe('基准描述');
  });
});

