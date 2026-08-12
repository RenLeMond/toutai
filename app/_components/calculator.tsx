'use client';

import React, { useState } from 'react';
import { Button, FormControl, Select, Text, View } from 'reshaped';
import { calculateBirthProbability, provinceOptions } from '@/lib/rebirth';

type Gender = 'male' | 'female';
type Category = 'city' | 'countryside' | 'town';

function Calculator() {
  const [province, setProvince] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [order, setOrder] = useState('');
  const [probability, setProbability] = useState(0);
  const [population, setPopulation] = useState(0);

  const handleCalculate = () => {
    const { population, probability } = calculateBirthProbability(
      province,
      category as Category,
      gender as Gender,
      order
    );
    setProbability(probability);
    setPopulation(population);
  };

  return (
    <View>
      <View paddingBlock={4} direction={{ s: 'column', m: 'row' }} gap={4}>
        <View.Item key="province" columns={{ s: 12, m: 3 }}>
          <FormControl>
            <FormControl.Label>出生地</FormControl.Label>
            <Select
              name="province"
              placeholder="选择出生地"
              options={provinceOptions}
              onChange={event => setProvince(event.value)}
              attributes={{
                'aria-autocomplete': 'none'
              }}
            />
          </FormControl>
        </View.Item>
        <View.Item key="gender" columns={{ s: 12, m: 3 }}>
          <FormControl>
            <FormControl.Label>性别</FormControl.Label>
            <Select
              name="gender"
              placeholder="选择性别"
              options={[
                { label: '男孩', value: 'male' },
                { label: '女孩', value: 'female' }
              ]}
              onChange={event => setGender(event.value)}
              attributes={{
                'aria-autocomplete': 'none'
              }}
            />
          </FormControl>
        </View.Item>
        <View.Item key="category" columns={{ s: 12, m: 3 }}>
          <FormControl>
            <FormControl.Label>区域</FormControl.Label>
            <Select
              name="category"
              placeholder="选择区域"
              options={[
                { label: '城市', value: 'city' },
                { label: '乡村', value: 'countryside' },
                { label: '城镇', value: 'town' }
              ]}
              onChange={event => setCategory(event.value)}
              attributes={{
                'aria-autocomplete': 'none'
              }}
            />
          </FormControl>
        </View.Item>
        <View.Item key="order" columns={{ s: 12, m: 3 }}>
          <FormControl>
            <FormControl.Label>第几孩</FormControl.Label>
            <Select
              name="order"
              placeholder="选择第几孩"
              options={[
                { label: '第一孩', value: 'one' },
                { label: '第二孩', value: 'two' },
                { label: '第三孩', value: 'three' },
                { label: '第四孩', value: 'four' },
                { label: '第五孩及以上', value: 'five_plus' }
              ]}
              onChange={event => setOrder(event.value)}
              attributes={{
                'aria-autocomplete': 'none'
              }}
            />
          </FormControl>
        </View.Item>
      </View>
      <View paddingBlock={8} justify="center" direction="row">
        <View width={{ s: 48, m: 32 }}>
          <Button
            color="primary"
            fullWidth
            rounded
            onClick={handleCalculate}
            disabled={!province || !order || !category || !gender}
          >
            计算
          </Button>
        </View>
      </View>
      <View paddingBlock={6} justify="center" direction="column" align="center">
        <View direction="row">
          <Text variant="body-2">出生概率： </Text>
          <Text variant="body-2" color="primary" weight="medium">
            {probability ? `${(probability * 100).toFixed(5)}%` : '0%'}
          </Text>
        </View>
        <View direction="row" gap={1}>
          <Text variant="body-2">每年大约有</Text>
          <Text weight="medium" variant="body-2" color="primary">
            {population}
          </Text>
          <Text variant="body-2">个这样的新生儿</Text>
        </View>
      </View>
    </View>
  );
}

export default Calculator;
