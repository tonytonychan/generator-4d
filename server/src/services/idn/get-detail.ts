import { load } from 'cheerio';

const get_detail = async (htmlText: string) => {
  const $ = load(htmlText);
  const havep23 = htmlText.includes('PRIZE123');
  const all_td = $('td');
  const result: { [k: string]: string } = {};

  const loop_arr: [string, number, number][] = [
    ['4D', 19, 16],
    ['3D', 35, 29],
    ['2D Depan', 51, 42],
    ['2D Tengah', 67, 55],
    ['2D Belakang', 83, 68],
    ['50-50', 99, 81],
    ['Colok Bebas', 115, 94],
    ['Colok Bebas 2D', 131, 107],
    ['Macau Shio', 147, 120],
    ['Dasar', 163, 133],
    ['Silang Homo', 179, 146],
    ['Colok Jitu', 195, 159],
    ['Kembang Kempis', 211, 172],
    ['Kombinasi', 227, 185],
    ['Colok Naga', 243, 198],
    ['Shio', 259, 211],
    ['Tengah Tepi', 275, 224],
    ['Total Omset', 289, 235],
  ];

  loop_arr.forEach(iteration => {
    const lost = $(all_td[havep23 ? iteration[1] : iteration[2]])
      .text()
      .trim()
      .replace(/,/g, '');

    if (+lost) result[iteration[0]] = lost;
  });

  return result;
};

export default get_detail;
