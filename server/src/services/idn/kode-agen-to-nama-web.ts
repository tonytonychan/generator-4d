import { KodeAgen } from '../../constants/kode-agen';
import { KodeAgenIDN } from '../../constants/kode-agen';
import { NamaWeb } from '../../constants/kode-agen';

const kode_agen_to_NamaWeb = (kodeAgen: KodeAgen) => {
  switch (kodeAgen) {
    case KodeAgenIDN.PUB:
      return NamaWeb.PUB;

    case KodeAgenIDN.SPACE:
      return NamaWeb.SPACE;

    case KodeAgenIDN.EDM:
      return NamaWeb.EDM;

    case KodeAgenIDN.BAR:
      return NamaWeb.BAR;

    case KodeAgenIDN.GAS:
      return NamaWeb.GAS;

    case KodeAgenIDN.GOOD:
      return NamaWeb.GOOD;

    case KodeAgenIDN.GM:
      return NamaWeb.GM;

    case KodeAgenIDN.WON:
      return NamaWeb.WON;

    case KodeAgenIDN.WINA:
      return NamaWeb.WINA;

/*     case KodeAgenIDN.BRAVO:
      return NamaWeb.BRAVO;

    case KodeAgenIDN.DELTA:
      return NamaWeb.DELTA;

    case KodeAgenIDN.ASEAN:
      return NamaWeb.ASEAN;

    case KodeAgenIDN.GAME:
      return NamaWeb.GAME;

    case KodeAgenIDN.DIVA:
      return NamaWeb.DIVA;

    case KodeAgenIDN.ALFA:
      return NamaWeb.ALFA;
 */
    default:
      return '';
  }
};

export default kode_agen_to_NamaWeb;
