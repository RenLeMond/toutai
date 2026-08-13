'use client';

import React, { useMemo, useState } from 'react';
import { Button, FormControl, Select, Text, View } from 'reshaped';
import MathComponent from '@/components/math-component';
import {
  CLASS_STAMPS,
  dynasties,
  dynastyOptions,
  formatDynastyProbability,
  getClassOptions,
  getDynastyClassProbability,
  getDynastyProbabilityExplanation,
  getDynastyProbabilityFormula
} from '@/lib/dynasty-rebirth';

function DynastyCalculator() {
  const [dynastyId, setDynastyId] = useState('');
  const [classId, setClassId] = useState('');
  const [probability, setProbability] = useState<number | null>(null);

  const classOptions = useMemo(
    () => (dynastyId ? getClassOptions(dynastyId) : []),
    [dynastyId]
  );

  const selectedDynasty = dynasties.find(d => d.id === dynastyId);
  const selectedClass = selectedDynasty?.classes.find(c => c.id === classId);

  const handleCalculate = () => {
    if (!dynastyId || !classId) return;
    setProbability(getDynastyClassProbability(dynastyId, classId));
  };

  return (
    <View gap={4}>
      <View paddingBlock={4} direction={{ s: 'column', m: 'row' }} gap={4}>
        <View.Item columns={{ s: 12, m: 5 }}>
          <FormControl>
            <FormControl.Label>朝代</FormControl.Label>
            <Select
              name="dynasty"
              placeholder="选择朝代"
              options={dynastyOptions}
              value={dynastyId}
              onChange={event => {
                setDynastyId(String(event.value));
                setClassId('');
                setProbability(null);
              }}
            />
          </FormControl>
        </View.Item>
        <View.Item columns={{ s: 12, m: 5 }}>
          <FormControl>
            <FormControl.Label>阶级</FormControl.Label>
            <Select
              name="class"
              placeholder="选择阶级"
              options={classOptions}
              value={classId}
              disabled={!dynastyId}
              onChange={event => {
                setClassId(String(event.value));
                setProbability(null);
              }}
            />
          </FormControl>
        </View.Item>
        <View.Item columns={{ s: 12, m: 2 }}>
          <View paddingTop={{ s: 0, m: 6 }}>
            <Button
              color="primary"
              onClick={handleCalculate}
              fullWidth
              disabled={!dynastyId || !classId}
            >
              计算
            </Button>
          </View>
        </View.Item>
      </View>
      {probability !== null && selectedDynasty && selectedClass && (
        <View gap={2} paddingBlock={4}>
          <Text variant="body-2">
            投胎在{' '}
            <span className="font-medium text-primary">
              {selectedDynasty.name}
            </span>
            ，身为
            <span className="font-medium text-primary">
              {selectedClass.name}
            </span>
            （{CLASS_STAMPS[selectedClass.level].name}）的概率为{' '}
            <span className="font-medium text-primary">
              {formatDynastyProbability(probability)}
            </span>
          </Text>
          <Text variant="body-3" color="neutral-faded">
            该朝权重：国祚 {selectedDynasty.duration} 年 × 代表人口{' '}
            {selectedDynasty.popWan} 万 = {selectedDynasty.weight}（占比{' '}
            {(selectedDynasty.dynastyProb * 100).toPrecision(3)}%）
          </Text>
          <MathComponent formula={getDynastyProbabilityFormula()} />
          <MathComponent formula={getDynastyProbabilityExplanation()} />
        </View>
      )}
    </View>
  );
}

export default DynastyCalculator;
