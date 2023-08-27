function remove_identical_4d(array: number[]) {
  const result = [];

  for (let i = 0; i < array.length; i++) {
    let is_identical = false;

    for (let j = 0; j < array.length; j++) {
      if (i !== j && array[i] === array[j]) {
        is_identical = true;
        break;
      }
    }

    if (!is_identical) {
      result.push(array[i]);
    }
  }

  return result;
}

export default remove_identical_4d;
