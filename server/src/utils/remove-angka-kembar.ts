function has_identical(str: string) {
  for (let i = 0; i < str.length - 1; i++) {
    if (str[i] !== str[i + 1]) {
      return false;
    }
  }
  return true;
}

function remove_angka_kembar(array: string[]) {
  let i = 0;
  while (i < array.length - 1) {
    if (has_identical(array[i])) {
      const current_element = array[i];
      let j = i + 1;
      while (
        j < array.length &&
        has_identical(array[j]) &&
        array[j] === current_element
      ) {
        j++;
      }
      array.splice(i, j - i);
    } else {
      i++;
    }
  }
}

export default remove_angka_kembar;
