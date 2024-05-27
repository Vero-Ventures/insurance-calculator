import { TuiLineHandler } from '@taiga-ui/addon-charts';
import { GRAPH_COLORS } from '../constants/graph.constant';

export const verticalLinesHandler: TuiLineHandler = (index, total) =>
  index === total ? 'none' : 'dashed';

export const horizontalLinesHandler: TuiLineHandler = (index, total) =>
  index === total ? 'none' : 'dashed';

export function createYearAxisXLabels(
  years: number,
  min: number | null = null,
  steps: number = 1
) {
  const start = min ? min : new Date().getFullYear();
  const labels = [];
  for (let i = 0; i < years; i += steps) {
    labels.push(`${start + i}`);
  }
  return labels;
}

export function createAxisYLabels(
  min: number,
  max: number,
  steps: number,
  includeMin: boolean = false,
  isPercent: boolean = false
) {
  const step = (max - min) / steps;
  const labels = [];
  const prefix = isPercent ? '%' : '$';
  for (let i = 0; i <= steps; i++) {
    if (i === 0 && !includeMin) {
      labels.push('');
    } else {
      labels.push(`${prefix}${(min + i * step).toFixed(2)}`);
    }
  }
  return labels;
}

export function getColor(index: number): string {
  return GRAPH_COLORS[index % GRAPH_COLORS.length];
}
