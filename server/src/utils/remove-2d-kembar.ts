function has_same_char(str: string) {
  for (let i = 1; i < str.length; i++) {
    if (str[i] !== str[0]) {
      return false;
    }
  }
  return true;
}

function remove_2d_kembar(arr: string[]) {
  const result = [];

  for (const item of arr) {
    if (!has_same_char(item)) {
      result.push(item);
    }
  }

  return result;
}

export default remove_2d_kembar;
