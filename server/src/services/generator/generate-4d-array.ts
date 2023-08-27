import { Bet } from '../../models/bet';
import generate_number_array from '../../utils/generate-array-number';
import remove_2d_kembar from '../../utils/remove-2d-kembar';

interface Generate4DArrrayParams {
  pasaran: string;
  match_query: string;
}

const generate_4d_array = async ({
  pasaran,
  match_query,
}: Generate4DArrrayParams) => {
  const least_bet_2d_: string[] = [];
  const array_4d_to_check = [];
  const all_bet_data: any[] = [];
  const number_array = generate_number_array(); // ['1', '2', '3', '4]

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
  ]);

  for (const data of data_pasaran) {
    const bettingan = await Bet.find(
      { website: data._id, periode: data.periode },
      { _id: 0, bet_number: 1 }
    );

    const array_all_bet = bettingan.map(item => item.bet_number);

    all_bet_data.push(...array_all_bet);
  }

  number_array.forEach(number => {
    const matches = all_bet_data.filter(item => item == number).length;

    if (matches < +match_query) {
      least_bet_2d_.push(number);
    }
  });

  if (!least_bet_2d_.length)
    throw new Error(`Could not find least number for 2D`);

  const bet_2d_array = remove_2d_kembar(least_bet_2d_);

  const non_identical_number_array = remove_2d_kembar(number_array);

  if (bet_2d_array.length < 3)
    throw new Error('Not enough data generated for 2D');

  for (const item of bet_2d_array) {
    for (const item2 of non_identical_number_array) {
      array_4d_to_check.push(item2 + item);
    }
  }
  const generated_4d = [];

  for (let i = 0; i < array_4d_to_check.length; i++) {
    const current_item = array_4d_to_check[i];
    let is_duplicate = false;

    for (let j = 0; j < array_4d_to_check.length; j++) {
      if (i !== j && current_item === array_4d_to_check[j]) {
        is_duplicate = true;
        break;
      }
    }

    if (!is_duplicate) {
      generated_4d.push(current_item);
    }
  }

  return generated_4d;
};

export default generate_4d_array;
