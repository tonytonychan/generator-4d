export function two_digit_generate_number_array() {
  const number_array = []

  for (let number = 0; number < 100; number++) {
    number_array.push(number < 10 ? `0${number}` : `${number}`)
  }

  return number_array
}

export function one_digit_generate_number_array() {
  const number_array = []

  for (let number = 0; number < 10; number++) {
    number_array.push(`${number}`)
  }

  return number_array
}
