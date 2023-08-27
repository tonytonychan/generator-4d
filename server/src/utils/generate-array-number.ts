function generate_number_array() {
  const number_array = [];

  for (let number = 0; number < 100; number++) {
    number_array.push(number < 10 ? `0${number}` : `${number}`);
  }

  return number_array;
}

export default generate_number_array;