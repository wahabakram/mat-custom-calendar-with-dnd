export const range = (input: Array<unknown> | number): number[] => {
  if (Array.isArray(input)) {
    return input.map((item, index) => index);
  }
  return new Array(input).fill(0).map((item, index) => index);
};

export const pull = <T>(input: T[], ...values: T[]): T[] => {
  for (let i = input.length - 1; i >= 0; i--) {
    const value = input[i];
    if (values.includes(value)) {
      input.splice(i, 1);
    }
  }
  return input;
};
