function get_random_data(array: any[]) {
  const random_data: number[] = [];

  while (random_data.length < 3) {
    const random_index = Math.floor(Math.random() * array.length);
    const random_element = array[random_index];

    const thirdChar = random_element[2]; // Get the third character
    const fourthChar = random_element[3]; // Get the fourth character

    // Check if third and fourth characters are not the same
    if (thirdChar !== fourthChar && !random_data.includes(random_element)) {
      random_data.push(random_element);
    }
  }

  return random_data;
}

export default get_random_data;
