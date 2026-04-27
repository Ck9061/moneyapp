export type CalcResult = {
  ck: string;
  lh: string;
  due: string;
};

export const calc = (value: number): CalcResult => {
  const total = Number(value) || 0;
  return {
    ck: (total * 0.07).toFixed(2),
    lh: (total * 0.02).toFixed(2),
    due: (total * 0.91).toFixed(2),
  };
};
