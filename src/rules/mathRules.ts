import type { RuleFunction } from './types';

export const isPrime: RuleFunction = (val) => {
  const n = typeof val === 'number' ? val : Number(val);
  if (isNaN(n) || n < 2 || !Number.isInteger(n)) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
};

export const isMultipleOf: RuleFunction = (val, params) => {
  const n = typeof val === 'number' ? val : Number(val);
  const factor = Number(params.factor);
  if (isNaN(n) || isNaN(factor) || factor === 0) return false;
  return n % factor === 0;
};

export const isFactorOf: RuleFunction = (val, params) => {
  const n = typeof val === 'number' ? val : Number(val);
  const target = Number(params.number);
  if (isNaN(n) || isNaN(target) || n === 0) return false;
  return target % n === 0;
};

export const isSquare: RuleFunction = (val) => {
  const n = typeof val === 'number' ? val : Number(val);
  if (isNaN(n) || n < 1 || !Number.isInteger(n)) return false;
  const s = Math.round(Math.sqrt(n));
  return s * s === n;
};

export const isCube: RuleFunction = (val) => {
  const n = typeof val === 'number' ? val : Number(val);
  if (isNaN(n) || n < 1 || !Number.isInteger(n)) return false;
  const c = Math.round(Math.cbrt(n));
  return c * c * c === n;
};

export const isEven: RuleFunction = (val) => {
  const n = typeof val === 'number' ? val : Number(val);
  if (isNaN(n) || !Number.isInteger(n)) return false;
  return n % 2 === 0;
};

export const isOdd: RuleFunction = (val) => {
  const n = typeof val === 'number' ? val : Number(val);
  if (isNaN(n) || !Number.isInteger(n)) return false;
  return Math.abs(n % 2) === 1;
};

export const isBetween: RuleFunction = (val, params) => {
  const n = typeof val === 'number' ? val : Number(val);
  const min = Number(params.min);
  const max = Number(params.max);
  if (isNaN(n) || isNaN(min) || isNaN(max)) return false;
  return n >= min && n <= max;
};

export const isGreaterThan: RuleFunction = (val, params) => {
  const n = typeof val === 'number' ? val : Number(val);
  const target = Number(params.value);
  if (isNaN(n) || isNaN(target)) return false;
  return n > target;
};

export const isLessThan: RuleFunction = (val, params) => {
  const n = typeof val === 'number' ? val : Number(val);
  const target = Number(params.value);
  if (isNaN(n) || isNaN(target)) return false;
  return n < target;
};

export const isCommonMultiple: RuleFunction = (val, params) => {
  const n = typeof val === 'number' ? val : Number(val);
  if (isNaN(n) || !Array.isArray(params.factors) || params.factors.length === 0) return false;
  return params.factors.every((f: number) => {
    const factor = Number(f);
    return factor !== 0 && n % factor === 0;
  });
};

export const isEvenUpTo: RuleFunction = (val, params) => {
  const n = typeof val === 'number' ? val : Number(val);
  const max = Number(params.max ?? 50);
  if (isNaN(n) || !Number.isInteger(n) || n > max) return false;
  return n % 2 === 0;
};

export const isOddUpTo: RuleFunction = (val, params) => {
  const n = typeof val === 'number' ? val : Number(val);
  const max = Number(params.max ?? 50);
  if (isNaN(n) || !Number.isInteger(n) || n > max) return false;
  return Math.abs(n % 2) === 1;
};

export const isPrimeUpTo: RuleFunction = (val, params) => {
  const n = typeof val === 'number' ? val : Number(val);
  const max = Number(params.max ?? 50);
  if (isNaN(n) || n > max) return false;
  return isPrime(n, params);
};
