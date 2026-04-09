export const FILTER_OPTIONS = [
  '',
  'All',
  'Critical',
  'High',
  'Middle',
  'Low',
  'Active',
  'Done',
  'InProgress',
  'Archived',
] as const;

export type FilterOption = (typeof FILTER_OPTIONS)[number];
