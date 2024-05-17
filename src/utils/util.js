const generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function millisToMinutesAndSeconds(millis) {
  if (!millis) return

  let res = {
    hours: 0,
    minutes: 0,
    seconds: 0
  }

  let minutes = Math.floor(millis / 60000);
  if (minutes > 60) {
    const hours = Math.floor(millis / (60 * 60 * 1000))
    res.hours = hours
    minutes = minutes % 60
  }
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  res.minutes = minutes
  res.seconds = seconds

  return res
}

function formatTimeMinSecond(time) {
  if (!time) return

  const timeDetails = millisToMinutesAndSeconds(time)
  return timeDetails.minutes + " : " + (timeDetails.seconds < 10 ? '0' : '') + timeDetails.seconds;
}


function getIdFromUri(spotifyUri) {
  return spotifyUri.split(':').at(-1)
}

export { generateRandomString, sha256, base64encode, millisToMinutesAndSeconds, formatTimeMinSecond, getIdFromUri }