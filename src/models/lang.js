import { LANG } from '../constants/GlobalConstants';
import { getLocaleMessages } from '../locales/messages';

export default {
  namespace: 'lang',
  state: {
    lang: LANG.TW,
  },

  reducers: {
    switchLang(state, { payload }){
      const { lang } = payload;
      return { ...state, lang };
    }
  }
}
