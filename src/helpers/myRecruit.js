export const formatTime = (time) => {
  const tmpTime = time.split(" ").join("").replace(/(\d{2,4})\/(\d{2})\/(\d{2})/, "$1/$2/$3 ");
  return tmpTime.length < 12 ? tmpTime : fillIt(tmpTime, '0', 22);
}

const fillIt = (str, chr, len) => {
  const tmpStr = new Array(len).join(chr).concat(str.replace(/^\s*/, ''));
  return tmpStr.substring(tmpStr.length - len);
}
