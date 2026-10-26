export interface RuleParams {
  [key: string]: any;
}

export interface CellItem {
  id: string;
  value: number | string;
  display: string;
  isTarget?: boolean;
}

export type RuleFunction = (
  val: number | string,
  params: RuleParams,
  item?: CellItem
) => boolean;

export interface PoolConfig {
  type: 'range' | 'explicit';
  from?: number;
  to?: number;
  items?: CellItem[];
}
