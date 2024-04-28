export interface Cell {
  value: string;
  label: string;
  considerNormal: boolean | undefined;
  reasonImpairmentNotDueToSci: string | undefined;
  reasonImpairmentNotDueToSciSpecify: string | undefined;
  name: string;
  error: string | undefined;
}
