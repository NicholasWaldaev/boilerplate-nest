export const getValueFromString = (str: string, isIP = false) => {
  return str.split(isIP ? ':' : '.').pop();
};
