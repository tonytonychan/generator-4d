const return_plain_num = (rawNum: string) => {
  if (rawNum.includes('.')) rawNum = rawNum.split('.')[0];
  return +rawNum.replace(/,/g, '');
};

export { return_plain_num };
