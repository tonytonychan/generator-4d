import axios from 'axios';
import { load } from 'cheerio';

const get_random_integers = async () => {
  const response = await axios(
    'https://www.random.org/integers/?num=3&min=1000&max=9999&col=1&base=10&format=html&rnd=new',
    {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        cookie:
          'RDOPRIVACY=%5Btrue%2Ctrue%2Ctrue%5D; __cflb=02DiuEMAZFhhWAbaKrF1fuSZexDk78uez6unCYS9ctFnK; __utmc=1; RDOSESSION=i1j52ii186mrtuk2dj8ui2n686; __utma=1.1965602450.1649840550.1650981975.1651059160.27; __utmz=1.1651059160.27.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utmt=1; __utmb=1.7.10.1651059160',
        Referer:
          'https://www.random.org/integers/?num=1&min=1000&max=9999&col=1&base=10&format=html&rnd=new',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    }
  );

  const $ = load(response.data);

  const randNum = $('pre')
    .text()
    .trim()
    .split('\n')
    .map(n => +n);

  return randNum;
};

export default get_random_integers;
