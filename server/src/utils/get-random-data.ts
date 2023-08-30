function generate_random_data_array(array: any[]) {
  const random_data_array: any[][] = []

  for (const item of array) {
    const firstElement = item
    const remainingArray = array.filter(e => e !== firstElement)

    const randomIndex1 = Math.floor(Math.random() * remainingArray.length)
    const randomIndex2 = Math.floor(Math.random() * remainingArray.length)

    const secondElement = remainingArray[randomIndex1]
    const thirdElement = remainingArray[randomIndex2]

    random_data_array.push([firstElement, secondElement, thirdElement])
  }

  return random_data_array
}

export default generate_random_data_array
