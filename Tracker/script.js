const output = document.getElementById('output');
let oldCoords = null;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, error);
  } else {
    output.innerHTML = "Ģeolokācija nav piejama šajā pārlūkprogrammā";
  }
}

function error(err) {
  output.innerHTML = `Nesanāca dabūt lokāciju: ERROR(${err.code}): ${err.message}`;
}

function showPosition(position) {
  // Set the threshold for coordinate changes
  const threshold = 0.00003;

  let id = null;
  let oldStatus;
  let status = "Nav kustība";
  let time = 0;

  const { latitude, longitude } = position.coords;

  output.innerHTML = "";
  output.innerHTML += `Pašreizējās koordinātes: La: ${latitude.toFixed(4)} | Lo: ${longitude.toFixed(4)}<br>`;

  if (oldCoords) {
    time = oldCoords.time + 1;
    const timeFormat = `${Math.floor(time / 3600)
      .toString()
      .padStart(2, '0')}:${Math.floor((time / 60) % 60)
      .toString()
      .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;

    oldStatus = oldCoords.status;
    id = oldCoords.id;
    const laDif = Math.abs(oldCoords.latitude - latitude);
    const loDif = Math.abs(oldCoords.longitude - longitude);

    output.innerHTML += `Starpība: La: ${laDif.toFixed(4)} | Lo: ${loDif.toFixed(4)}<br>`;

    if (laDif + loDif >= threshold) {
      output.innerHTML += `ir kustībā<br>`;
      time = 0;
      status = "Ir kustība";
    } else {
      output.innerHTML += `Nav kustības - ${timeFormat}<br>`;
    }
  }

  oldCoords = {
    latitude,
    longitude,
    time,
    status,
    id,
  };

  if (oldStatus !== status || status === 'Ir kustība') {
    oldCoords.id = null;
    sendLocationData(oldCoords).then((id) => {
      oldCoords.id = id;
    });
  } else {
    sendLocationData(oldCoords).then((id) => {
      oldCoords.id = id;
    });
  }
}

async function sendLocationData(oldCoords) {
  const uid = getCookie('uid');
  const name = getCookie('name');
  const { latitude, longitude, status, id } = oldCoords;
  let time = oldCoords.time;
  time = `${Math.floor(time / 3600)
    .toString()
    .padStart(2, '0')}:${Math.floor((time / 60) % 60)
    .toString()
    .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;

  const url = id
    ? `insertActivity.php?uid=${uid}&name=${name}&la=${latitude}&lo=${longitude}&status=${status}&time=${time}&id=${id}`
    : `insertActivity.php?uid=${uid}&name=${name}&la=${latitude}&lo=${longitude}&status=${status}&time=${time}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.response;
    } else {
      throw new Error('Kļuda datu nosūtīšanā.');
    }
  } catch (error) {
    console.error(error);
  }
}

function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
  const nameF = name + '=';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameF) === 0) {
      return cookie.substring(nameF.length, cookie.length);
    }
  }
  return '';
}

async function generateUID(callback) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueID = '';
  for (let i = 0; i < 32; i++) {
    uniqueID += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const response = await checkUID(uniqueID);
  if (response !== true) {
    generateUID(callback);
  } else {
    callback(uniqueID);
  }
}

async function checkUID(uid) {
  try {
    const response = await fetch(`parbaude.php?uid=${uid}`);
    if (response.ok) {
      const data = await response.json();
      return data.response;
    } else {
      throw new Error('Kļūda uid veidošanā.');
    }
  } catch (error) {
    console.error(error);
  }
}

function startUp() {
  const name = getCookie('name');
  const uid = getCookie('uid');
  if (!name && !uid) {
    const person = prompt('Ievadiet sev vārdu', '');
    if (person !== null) {
      setCookie('name', person, 365);
      generateUID(function (uniqueID) {
        setCookie('uid', uniqueID, 365);
        sendUserData();
      });
    } else {
      output.innerHTML = 'nav reģistrēts. Lūdzu pārlādējiet lapu.';
      return;
    }
  }

  const tracker = setInterval(getLocation, 1000);
  document.getElementById('title').innerHTML = '<b>Jūsu koordinātes:</b> <br>';
}

async function sendUserData() {
  const name = getCookie('name');
  const uid = getCookie('uid');
  try {
    const response = await fetch(`insertUser.php?uid=${uid}&name=${name}`);
    if (response.ok) {
      const data = await response.json();
      alert(data.response);
    } else {
      throw new Error('Kļūda datu nosūtīšanā.');
    }
  } catch (error) {
    console.error(error);
  }
}
