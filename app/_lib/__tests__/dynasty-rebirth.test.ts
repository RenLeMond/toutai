import { describe, expect, it } from 'vitest';

import {

  dynasties,

  getDynastyClassProbability,

  getDynastyProbabilityFormula,

  simulateDynastyBirth

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

});

