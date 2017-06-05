import messages from './messages_define';
import { LOCALE } from '../constants/GlobalConstants';

const definedMessages = {};

messages.forEach(m => {
  const id = m.id;
  definedMessages[id] = m;
});

export function getLocaleText(obj, locale) {
  if (locale === LOCALE.EN) {
    return obj.english_name;
  } else if (locale === LOCALE.TW) {
    return obj.chinese_name;
  } else if (locale === LOCALE.CN) {
    return obj.s_chinese_name
  }
  return obj.chinese_name;
}

export function getLocaleMessages(locale) {
  const localeMessages = {};
  let key = 'defaultMessage';
  if (locale === LOCALE.EN) {
    key = 'en';
  } else if (locale === LOCALE.CN) {
    key = 'cn';
  }

  messages.forEach(m => {
    const id = m.id;
    localeMessages[id] = m[key];
  });

  return localeMessages;
}

const defaultMessages = getLocaleMessages(LOCALE.TW);

export function getMessage(messageId) {
  return definedMessages[messageId];
}

export default defaultMessages;

export { definedMessages, defaultMessages };
