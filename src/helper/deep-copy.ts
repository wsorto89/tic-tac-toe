export const deepCopy: any = (arr: Array<any>) => arr.map(item => Array.isArray(item) ? deepCopy(item) : item);
