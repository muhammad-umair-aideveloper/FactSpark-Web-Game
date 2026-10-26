import type { RuleFunction } from './types';

export const isExplicitTarget: RuleFunction = (_val, _params, item) => {
  return Boolean(item?.isTarget);
};

export const isInTargetList: RuleFunction = (_val, params, item) => {
  if (!item || !Array.isArray(params.targets)) return false;
  return params.targets.includes(item.id) || params.targets.includes(String(item.value));
};

export const isEquivalentFraction: RuleFunction = (_val, params, item) => {
  if (!item) return false;
  const targetNumerator = Number(params.numerator);
  const targetDenominator = Number(params.denominator);
  if (isNaN(targetNumerator) || isNaN(targetDenominator) || targetDenominator === 0) return false;
  const targetRatio = targetNumerator / targetDenominator;

  if (typeof item.value === 'number') {
    return Math.abs(item.value - targetRatio) < 0.00001;
  }
  if (typeof item.value === 'string' && item.value.includes('/')) {
    const [num, den] = item.value.split('/').map(Number);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return Math.abs(num / den - targetRatio) < 0.00001;
    }
  }
  return false;
};
