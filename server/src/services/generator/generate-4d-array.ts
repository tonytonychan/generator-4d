import { Bet } from '../../models/bet'
import {
  one_digit_generate_number_array,
  two_digit_generate_number_array,
} from '../../utils/generate-array-number'
import remove_2d_kembar from '../../utils/remove-2d-kembar'

interface Generate4DArrrayParams {
  pasaran: string
  match_query: string
}

const generate_4d_array = async ({
  pasaran,
  match_query,
}: Generate4DArrrayParams) => {
  const least_bet_2d: string[] = []
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

  two_digit_number_array.forEach(number => {
    const matches = all_bet_data_2d.filter(item => item == number).length

    if (matches < +match_query) {
      least_bet_2d.push(number)
    }
  })

  if (!least_bet_2d.length)
    throw new Error(`Could not find least number for 2D`)

  const bet_2d_array = remove_2d_kembar(least_bet_2d)

  if (bet_2d_array.length < 3)
    throw new Error('Not enough data generated for 2D')

  for (const item of bet_2d_array) {
    for (const item2 of one_digit_number_array) {
      array_3d_to_check.push(item2 + item)
    }
  }

  const generated_3d: any[] = []

  array_3d_to_check.forEach(number => {
    const matches = all_bet_data_3d.filter(item => item == number).length

    if (matches <= 1) {
      generated_3d.push(number)
    }
  })

  if (generated_3d.length < 3)
    throw new Error('Not enough data generated for 3D')

  const generated_4d: any[] = []

  for (const item of generated_3d) {
    for (const item2 of one_digit_number_array) {
      array_4d_to_check.push(item2 + item)
    }
  }

  array_4d_to_check.forEach(number => {
    const matches = all_bet_data_4d.filter(item => item == number).length

    if (matches == 0) {
      generated_4d.push(number)
    }
  })

  if (!generated_4d.length) throw new Error('Not enough data generated for 4D')

  return generated_4d
}

export default generate_4d_array
