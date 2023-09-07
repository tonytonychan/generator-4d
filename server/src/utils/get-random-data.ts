//! SEMUA PASTI KENA

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

//! RANDOM 
// function generate_random_data_array(array: any[]) {
//   const random_data_array: any[][] = [];
//   const outputLength = 20;

//   // Shuffle the input array randomly
//   const shuffledArray = array.slice(); // Copy the original array
//   for (let i = shuffledArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
//   }

//   // Generate the output array with a maximum length of 9
//   for (let i = 0; i < Math.min(outputLength, shuffledArray.length); i++) {
//     const firstElement = shuffledArray[i];
//     const remainingArray = shuffledArray.filter((e) => e !== firstElement);

//     const randomIndex1 = Math.floor(Math.random() * remainingArray.length);
//     const randomIndex2 = Math.floor(Math.random() * remainingArray.length);

//     const secondElement = remainingArray[randomIndex1];
//     const thirdElement = remainingArray[randomIndex2];

//     random_data_array.push([firstElement, secondElement, thirdElement]);
//   }

//   return random_data_array;
// }

export default generate_random_data_array
