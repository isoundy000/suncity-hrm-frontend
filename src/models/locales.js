import { addLocaleData, IntlProvider } from 'react-intl';

import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

import { LOCALE } from '../constants/GlobalConstants';
import { getLocaleMessages } from '../locales/messages';

addLocaleData([...en, ...zh]);

export default {
  namespace: 'locales',
  state: {
    lang: LOCALE.TW,
    messages: getLocaleMessages(LOCALE.TW)
  },

  reducers: {
    switchLang(state, action){
      const messages = getLocaleMessages(action.payload.lang);
      return {
        lang: action.payload.lang,
        messages
      };
    }
  }
}