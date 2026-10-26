import { describe, it, expect } from 'vitest';
import {
  isPrime,
  isMultipleOf,
  isFactorOf,
  isSquare,
  isCube,
  isEven,
  isOdd,
  isBetween,
  isGreaterThan,
  isLessThan,
  isCommonMultiple,
  isEquivalentFraction,
  getRule,
  evaluateItem,
  computeTargets
} from '../index';
import type { CellItem } from '../types';

describe('Math Rules', () => {
  it('correctly identifies prime numbers up to 100', () => {
    expect(isPrime(1, {})).toBe(false);
    expect(isPrime(0, {})).toBe(false);
    expect(isPrime(-7, {})).toBe(false);
    expect(isPrime(2, {})).toBe(true);
    expect(isPrime(3, {})).toBe(true);
    expect(isPrime(4, {})).toBe(false);
    expect(isPrime(5, {})).toBe(true);
    expect(isPrime(9, {})).toBe(false);
    expect(isPrime(13, {})).toBe(true);
    expect(isPrime(25, {})).toBe(false);
    expect(isPrime(97, {})).toBe(true);
    expect(isPrime(100, {})).toBe(false);

    // Count primes in 1..100 (exactly 25 primes)
    let primeCount = 0;
    for (let i = 1; i <= 100; i++) {
      if (isPrime(i, {})) primeCount++;
    }
    expect(primeCount).toBe(25);
  });

  it('correctly identifies multiples', () => {
    expect(isMultipleOf(6, { factor: 3 })).toBe(true);
    expect(isMultipleOf(7, { factor: 3 })).toBe(false);
    expect(isMultipleOf(28, { factor: 7 })).toBe(true);
    expect(isMultipleOf(29, { factor: 7 })).toBe(false);
  });

  it('correctly identifies factors', () => {
    expect(isFactorOf(1, { number: 24 })).toBe(true);
    expect(isFactorOf(2, { number: 24 })).toBe(true);
    expect(isFactorOf(3, { number: 24 })).toBe(true);
    expect(isFactorOf(4, { number: 24 })).toBe(true);
    expect(isFactorOf(5, { number: 24 })).toBe(false);
    expect(isFactorOf(6, { number: 24 })).toBe(true);
    expect(isFactorOf(8, { number: 24 })).toBe(true);
    expect(isFactorOf(12, { number: 24 })).toBe(true);
    expect(isFactorOf(24, { number: 24 })).toBe(true);
    expect(isFactorOf(48, { number: 24 })).toBe(false);
  });

  it('correctly identifies square numbers in 1..100', () => {
    const squares: number[] = [];
    for (let i = 1; i <= 100; i++) {
      if (isSquare(i, {})) squares.push(i);
    }
    expect(squares).toEqual([1, 4, 9, 16, 25, 36, 49, 64, 81, 100]);
  });

  it('correctly identifies cube numbers in 1..100', () => {
    const cubes: number[] = [];
    for (let i = 1; i <= 100; i++) {
      if (isCube(i, {})) cubes.push(i);
    }
    expect(cubes).toEqual([1, 8, 27, 64]);
  });

  it('correctly evaluates even and odd parity', () => {
    expect(isEven(2, {})).toBe(true);
    expect(isEven(3, {})).toBe(false);
    expect(isOdd(3, {})).toBe(true);
    expect(isOdd(4, {})).toBe(false);
  });

  it('correctly checks bounds with between', () => {
    expect(isBetween(15, { min: 10, max: 20 })).toBe(true);
    expect(isBetween(10, { min: 10, max: 20 })).toBe(true);
    expect(isBetween(20, { min: 10, max: 20 })).toBe(true);
    expect(isBetween(9, { min: 10, max: 20 })).toBe(false);
    expect(isBetween(21, { min: 10, max: 20 })).toBe(false);
  });

  it('evaluates greater_than and less_than', () => {
    expect(isGreaterThan(55, { value: 50 })).toBe(true);
    expect(isGreaterThan(50, { value: 50 })).toBe(false);
    expect(isLessThan(45, { value: 50 })).toBe(true);
    expect(isLessThan(50, { value: 50 })).toBe(false);
  });

  it('correctly identifies common multiples', () => {
    expect(isCommonMultiple(15, { factors: [3, 5] })).toBe(true);
    expect(isCommonMultiple(30, { factors: [3, 5] })).toBe(true);
    expect(isCommonMultiple(10, { factors: [3, 5] })).toBe(false);
    expect(isCommonMultiple(12, { factors: [3, 5] })).toBe(false);
  });

  it('identifies equivalent fractions', () => {
    const params = { numerator: 1, denominator: 2 };
    expect(isEquivalentFraction('1/2', params, { id: 'c1', value: '1/2', display: '1/2' })).toBe(true);
    expect(isEquivalentFraction('2/4', params, { id: 'c2', value: '2/4', display: '2/4' })).toBe(true);
    expect(isEquivalentFraction('3/6', params, { id: 'c3', value: '3/6', display: '3/6' })).toBe(true);
    expect(isEquivalentFraction('2/3', params, { id: 'c4', value: '2/3', display: '2/3' })).toBe(false);
  });
});

describe('Registry and Helpers', () => {
  it('throws on unknown rule', () => {
    expect(() => getRule('non_existent_rule')).toThrowError(/not registered/);
  });

  it('computes target IDs from items', () => {
    const items: CellItem[] = [
      { id: 't1', value: 2, display: '2' },
      { id: 't2', value: 4, display: '4' },
      { id: 't3', value: 5, display: '5' },
      { id: 't4', value: 9, display: '9' }
    ];

    const primeIds = computeTargets('prime', {}, items);
    expect(primeIds).toEqual(['t1', 't3']);

    const squareIds = computeTargets('square', {}, items);
    expect(squareIds).toEqual(['t2', 't4']);
  });

  it('evaluates items using evaluateItem', () => {
    const item: CellItem = { id: 'cell-7', value: 7, display: '7' };
    expect(evaluateItem('prime', {}, item)).toBe(true);
    expect(evaluateItem('even', {}, item)).toBe(false);
  });
});
