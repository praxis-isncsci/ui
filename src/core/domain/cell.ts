export interface Cell {
  value: string;
  label: string;
  considerNormal: boolean | null;
  reasonImpairmentNotDueToSci: string | null;
  reasonImpairmentNotDueToSciSpecify: string | null;
  name: string;
  error: string | null;
}
