import { randomChalk } from 'ody-utils'
import { Bet } from '../../models/bet'
import {
  one_digit_generate_number_array,
  two_digit_generate_number_array,
} from '../../utils/generate-array-number'
import Semalam from '../../models/semalam'

interface Generate4DArrrayParams {
  pasaran: string
  show_kembar: string
}

function hasInvalidChars(number: string, targetStr: string) {
  for (let i = 0; i < number.length; i++) {
    for (let j = 0; j < targetStr.length; j++) {
      if (targetStr[j].includes(number[i])) {
        return true
      }
    }
  }

  return false
}

const generate_4d_array = async ({
  pasaran,
  show_kembar,
}: Generate4DArrrayParams) => {
  const array_3d_to_check: any[] = []
  const array_4d_to_check: any[] = []
  const all_bet_data_2d: any[] = []
  const all_bet_data_3d: any[] = []
  const all_bet_data_4d: any[] = []
  const one_digit_number_array = one_digit_generate_number_array()
  const two_digit_number_array = two_digit_generate_number_array()

  const data_pasaran = await Bet.aggregate([
    {
      $match: {
        pasaran: pasaran,
      },
    },

    {
      $group: {
        _id: '$website',
        periode: { $max: '$periode' },
      },
    },
  ])

  for (const data of data_pasaran) {
    const bettingan2D = await Bet.find(
      { website: data._id, periode: data.periode, bet_type: '2D' },
      { _id: 0, bet_number: 1 }
    )
    const bettingan3D = await Bet.find(
      { website: data._id, periode: data.periode, bet_type: '3D' },
      { _id: 0, bet_number: 1 }
    )

    const bettingan4D = await Bet.find(
      { website: data._id, periode: data.periode, bet_type: '4D' },
      { _id: 0, bet_number: 1 }
    )

    const array_all_bet_2d = bettingan2D.map(item => item.bet_number)
    const array_all_bet_3d = bettingan3D.map(item => item.bet_number)
    const array_all_bet_4d = bettingan4D.map(item => item.bet_number)

    all_bet_data_2d.push(...array_all_bet_2d)
    all_bet_data_3d.push(...array_all_bet_3d)
    all_bet_data_4d.push(...array_all_bet_4d)
  }

  const generated_2d: any[] = []
  const generated_3d: any[] = []
  const generated_4d: any[] = []

  const matchesMap2D = new Map()
  const matchesMap3D = new Map()
  const matchesMap4D = new Map()

  //! FILTER 2D

  two_digit_number_array.forEach(number => {
    const matches = all_bet_data_2d.filter(item => item == number).length

    matchesMap2D.set(number, matches)
  })

  const sorted_from_matches_2d = [...matchesMap2D.entries()].sort(
    (a, b) => a[1] - b[1]
  )

  let pushed_2d_number_quantity = 0

  for (let i = 0; i < sorted_from_matches_2d.length; i++) {
    if (pushed_2d_number_quantity >= 50) {
      break
    }

    const current_number_index = sorted_from_matches_2d[i][0]

    if (current_number_index[0] !== current_number_index[1]) {
      generated_2d.push(current_number_index)
      pushed_2d_number_quantity++
    }
  }

  if (generated_2d.length < 3)
    throw new Error('Not enough data generated for 2D')

  //! FILTER 3D

  for (const item of generated_2d) {
    for (const item2 of one_digit_number_array) {
      array_3d_to_check.push(item2 + item)
    }
  }

  array_3d_to_check.forEach(number => {
    const matches = all_bet_data_3d.filter(item => item == number).length

    matchesMap3D.set(number, matches)
  })

  const sortedMatches3D = [...matchesMap3D.entries()].sort(
    (a, b) => a[1] - b[1]
  )

  let pushedCount3D = 0
  for (let i = 0; i < sortedMatches3D.length; i++) {
    if (pushedCount3D >= 100) {
      break
    }

    const currentNumber = sortedMatches3D[i][0]

    if (show_kembar === 'true') {
      generated_3d.push(currentNumber)
      pushedCount3D++
    } else {
      if (
        currentNumber[0] !== currentNumber[1] &&
        currentNumber[1] !== currentNumber[2] &&
        currentNumber[0] !== currentNumber[2]
      ) {
        generated_3d.push(currentNumber)
        pushedCount3D++
      }
    }
  }

  if (generated_3d.length < 3)
    throw new Error('Not enough data generated for 3D')

  //! FILTER 4D

  for (const item of generated_3d) {
    for (const item2 of one_digit_number_array) {
      array_4d_to_check.push(item2 + item)
    }
  }

  array_4d_to_check.forEach(number => {
    const matches = all_bet_data_4d.filter(item => item == number).length
    matchesMap4D.set(number, matches)
  })

  const sortedMatches4D = [...matchesMap4D.entries()].sort(
    (a, b) => a[1] - b[1]
  )

  let pushedCount4D = 0

  for (let i = 0; i < sortedMatches4D.length; i++) {
    if (pushedCount4D >= 9999) {
      break
    }

    const currentNumber = sortedMatches4D[i][0]

    if (show_kembar === 'true') {
      generated_4d.push(currentNumber)
      pushedCount4D++
    } else {
      if (
        currentNumber[0] !== currentNumber[1] &&
        currentNumber[1] !== currentNumber[2] &&
        currentNumber[2] !== currentNumber[3] &&
        currentNumber[0] !== currentNumber[2] &&
        currentNumber[0] !== currentNumber[3] &&
        currentNumber[1] !== currentNumber[3]
      ) {
        generated_4d.push(currentNumber)
        pushedCount4D++
      }
    }
  }

  if (!generated_4d.length) throw new Error('Not enough data generated for 4D')

  const result_semalam = await Semalam.findOne(
    { pasaran },
    { angka_keluar: 1, _id: 0 }
  )

  const angka_keluar = result_semalam?.angka_keluar

  if (!angka_keluar)
    throw new Error('Tidak bisa menemukan data keluaran semalam dari DB')

  const final_generated_number = []

  for (let i = 0; i < generated_4d.length; i++) {
    if (
      !hasInvalidChars(generated_4d[i], angka_keluar) &&
      final_generated_number.length < 10
    ) {
      final_generated_number.push(generated_4d[i])
    }
  }

  randomChalk(`Jumlah 4D yang tergenerated : `, final_generated_number.length)
  randomChalk(`Angka 4D yang tergenerated : `, final_generated_number)

  return final_generated_number
}

export default generate_4d_array
