import type { RuleFunction, CellItem, RuleParams } from './types';
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
  isCommonMultiple
} from './mathRules';
import {
  isExplicitTarget,
  isInTargetList,
  isEquivalentFraction
} from './targetRules';

export const ruleRegistry: Record<string, RuleFunction> = {
  prime: isPrime,
  multiple_of: isMultipleOf,
  multiples: isMultipleOf,
  factor_of: isFactorOf,
  factors: isFactorOf,
  square: isSquare,
  squares: isSquare,
  cube: isCube,
  cubes: isCube,
  even: isEven,
  odd: isOdd,
  between: isBetween,
  greater_than: isGreaterThan,
  less_than: isLessThan,
  common_multiple: isCommonMultiple,
  explicit_target: isExplicitTarget,
  target_list: isInTargetList,
  equivalent_fraction: isEquivalentFraction
};

export function getRule(name: string): RuleFunction {
  const rule = ruleRegistry[name];
  if (!rule) {
    throw new Error(`Rule "${name}" is not registered in the rule engine.`);
  }
  return rule;
}

export function evaluateItem(
  ruleName: string,
  params: RuleParams,
  item: CellItem
): boolean {
  const rule = getRule(ruleName);
  return rule(item.value, params, item);
}

export function computeTargets(
  ruleName: string,
  params: RuleParams,
  items: CellItem[]
): string[] {
  const rule = getRule(ruleName);
  return items
    .filter((item) => rule(item.value, params, item))
    .map((item) => item.id);
}
