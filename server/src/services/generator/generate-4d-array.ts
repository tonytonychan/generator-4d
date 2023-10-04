import { randomChalk } from 'ody-utils'
import { Bet } from '../../models/bet'
import { one_digit_generate_number_array } from '../../utils/generate-array-number'
import Semalam from '../../models/semalam'

interface Generate4DArrrayParams {
  pasaran: string
  show_kembar: string
}

interface BetData {
  bet_number: number
  player_win: number
}

function calculate_array(
  data: BetData[]
): { bet_number: number; total_value: number }[] {
  const betTotals: { [key: number]: number } = {}

  data.forEach(item => {
    const { bet_number, player_win } = item

    if (betTotals[bet_number]) {
      betTotals[bet_number] += player_win
    } else {
      betTotals[bet_number] = player_win
    }
  })

  const result = Object.keys(betTotals).map(bet_number => ({
    bet_number: parseInt(bet_number),
    total_value: betTotals[parseInt(bet_number)],
  }))

  return result
}

function convert_number_to_string_arr(arr: number[]) {
  let stringArray = []

  for (let i = 0; i < arr.length; i++) {
    let number = arr[i]

    let stringValue = number < 10 ? `0${number}` : number.toString()

    stringArray.push(stringValue)
  }

  return stringArray
}

function had_previous_keluaran(number: string, targetStr: string) {
  for (let i = 0; i < number.length; i++) {
    for (let j = 0; j < targetStr.length; j++) {
      if (targetStr[j] === number[i]) {
        return true
      }
    }
  }

  return false
}

function make_sure_3d_string_arr(array: string[]) {
  for (let i = 0; i < array.length; i++) {
    const str = array[i]

    if (/^\d{2}$/.test(str)) {
      array[i] = '0' + str
    }
  }
}

function make_sure_4d_string_arr(array: string[]) {
  for (let i = 0; i < array.length; i++) {
    const str = array[i]

    if (/^\d{3}$/.test(str)) {
      array[i] = '0' + str
    }
  }
}

const generate_4d_array = async ({
  pasaran,
  show_kembar,
}: Generate4DArrrayParams) => {
  const array_3d_to_check: string[] = []
  const array_4d_to_check: string[] = []
  const all_bet_data_2d: BetData[] = []
  const all_bet_data_3d: number[] = []
  const all_bet_data_4d: number[] = []
  const one_digit_number_array = one_digit_generate_number_array()

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
      { _id: 0, bet_number: 1, player_win: 1 }
    )
    const bettingan3D = await Bet.find(
      { website: data._id, periode: data.periode, bet_type: '3D' },
      { _id: 0, bet_number: 1, player_win: 1 }
    )

    const bettingan4D = await Bet.find(
      { website: data._id, periode: data.periode, bet_type: '4D' },
      { _id: 0, bet_number: 1, player_win: 1 }
    )
    const array_all_bet_2d = bettingan2D.map(item => ({
      bet_number: item.bet_number,
      player_win: item.player_win,
    }))
    const array_all_bet_3d = bettingan3D.map(item => item.bet_number)
    const array_all_bet_4d = bettingan4D.map(item => item.bet_number)

    all_bet_data_2d.push(...array_all_bet_2d)
    all_bet_data_3d.push(...array_all_bet_3d)
    all_bet_data_4d.push(...array_all_bet_4d)
  }

  const result_array = calculate_array(all_bet_data_2d)

  const sorted_result_array = result_array.sort(
    (a, b) => a.total_value - b.total_value
  )

  const all_bet_data_2d_array = sorted_result_array.map(item => item.bet_number)

  const all_bet_data_2d_string = convert_number_to_string_arr(
    all_bet_data_2d_array
  )
  const all_bet_data_3d_string = convert_number_to_string_arr(all_bet_data_3d)
  make_sure_3d_string_arr(all_bet_data_3d_string)
  const all_bet_data_4d_string = convert_number_to_string_arr(all_bet_data_4d)
  make_sure_4d_string_arr(all_bet_data_4d_string)

  const generated_2d: any[] = []
  const generated_3d: any[] = []
  const generated_4d: any[] = []

  const matchesMap3D = new Map()
  const matchesMap4D = new Map()

  //! FILTER 2D

  let pushed_2d_number_quantity = 0

  for (let i = 0; i < all_bet_data_2d_string.length; i++) {
    if (pushed_2d_number_quantity >= 15) {
      break
    }

    if (all_bet_data_2d_string[i][0] !== all_bet_data_2d_string[i][1]) {
      generated_2d.push(all_bet_data_2d_string[i])
      pushed_2d_number_quantity++
    }
  }

  randomChalk({ generated_2d })

  //! FILTER 3D

  for (const item of generated_2d) {
    for (const item2 of one_digit_number_array) {
      array_3d_to_check.push(item2 + item)
    }
  }

  array_3d_to_check.forEach(number => {
    const matches = all_bet_data_3d_string.filter(
      item => item === number
    ).length

    matchesMap3D.set(number, matches)
  })

  const sorted_by_matches_3d = [...matchesMap3D.entries()].sort(
    (a, b) => a[1] - b[1]
  )

  const lowestMatches3D = sorted_by_matches_3d[0][1]
  console.log({ sorted_by_matches_3d })
  console.log({ lowestMatches3D })

  for (let i = 0; i < sorted_by_matches_3d.length; i++) {
    const currentNumber = sorted_by_matches_3d[i][0]
    const matches_3d = sorted_by_matches_3d[i][1]

    if (show_kembar === 'true') {
      if (matches_3d === lowestMatches3D) {
        generated_3d.push(currentNumber)
      }
    } else {
      if (matches_3d <= lowestMatches3D + 10) {
        if (
          currentNumber[0] !== currentNumber[1] &&
          currentNumber[1] !== currentNumber[2] &&
          currentNumber[0] !== currentNumber[2]
        ) {
          generated_3d.push(currentNumber)
        } else {
        }
      }
    }
  }

  console.log({ generated_3d })

  if (!generated_3d.length)
    throw new Error(
      `Data 3D tidak cukup untuk mencari angka yang tidak di-bet player `
    )

  //! FILTER 4D

  for (const item of generated_3d) {
    for (const item2 of one_digit_number_array) {
      array_4d_to_check.push(item2 + item)
    }
  }

  array_4d_to_check.forEach(number => {
    const matches = all_bet_data_4d_string.filter(
      item => item === number
    ).length
    matchesMap4D.set(number, matches)
  })

  const sortedMatches4D = [...matchesMap4D.entries()].sort(
    (a, b) => a[1] - b[1]
  )

  console.log({ sortedMatches4D })

  let pushedCount4D = 0

  for (let i = 0; i < sortedMatches4D.length; i++) {
    const currentNumber = sortedMatches4D[i][0]
    const matches_4d = sortedMatches4D[i][1]

    if (show_kembar === 'true') {
      if (matches_4d <= 0) {
        generated_4d.push(currentNumber)
        pushedCount4D++
      }
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

  console.log({ generated_4d })

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
    if (!had_previous_keluaran(generated_4d[i], angka_keluar)) {
      final_generated_number.push(generated_4d[i])
    }
  }

  if (!final_generated_number.length)
    throw new Error(
      'Semua angka yang tergenerated dari data semalam. tidak bisa mengenerate data'
    )

  randomChalk('4d yang tergenerated: ', final_generated_number)
  randomChalk(`Jumlah 4D yang tergenerated : `, final_generated_number.length)

  return final_generated_number
}

export default generate_4d_array
