function preFillWith(str, chr, len) {
  const tmpStr = new Array(len).join(chr).concat(str);
  return tmpStr.substring(tmpStr.length - len);
}

export function formatRailsTime(railsTime) {
  if(!railsTime) {
    return;
  }

  const date = new Date(railsTime);
  const year = date.getFullYear();

  const month = preFillWith(date.getMonth() + 1, '0', 2);
  const day = preFillWith(date.getDate(), '0', 2);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}
