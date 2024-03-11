// ==UserScript==
// @name         Map Alarm
// @namespace    https://ekin.codes
// @version      1
// @description  Alarm goes on when the enemy approaches.
// @author       Ekin
// @match        https://earth4.manacube.com/
// @icon         https://earth4.manacube.com/favicon.ico
// ==/UserScript==

const allies = ["Banarszanyn", "Egehan07"];

const horizon = 1000;

const warning = {
  sound: new Audio("https://github.com/Xaszanyn/Map-Radar/raw/main/Map%20Warning.mp3"),
  threshold: 100,
};
const danger = {
  sound: new Audio("https://github.com/Xaszanyn/Map-Radar/raw/main/Map%20Danger.mp3"),
  threshold: 50,
};

let ignited = false;

let information = document.createElement("span");
information.style = `position: fixed; top: 10px; left: 60px; z-index: 1000; border: 3px solid black; border-radius: 7px; background-color: darkred; padding: 5px; color: white; font-family: sans-serif;`;
information.innerHTML = "-";
information = document.body.appendChild(information);

setInterval(async () => {
  let flag = false;

  let data = await fetch("https://earth4.manacube.com/tiles/players.json").then((response) => response.json());

  data.players.forEach((ally) => {
    if (allies.includes(ally.name)) {
      let shortest = horizon;

      data.players.forEach((enemy) => {
        if (!allies.includes(enemy.name)) {
          let distance = Math.sqrt((ally.x - enemy.x) ** 2 + (ally.z - enemy.z) ** 2);

          if (distance < shortest) {
            shortest = parseInt(distance);

            flag = distance < warning.threshold ? (distance < danger.threshold ? "danger" : "warning") : false;

            if (!ignited) {
              ignited = true;
              setTimeout(() => (ignited = false), 4500);
            }
          }
        }
      });

      information.innerHTML = "Shortest: " + shortest == horizon ? "1000+" : shortest;

      if (ignited && flag == "warning") warning.sound.play();
      else if (ignited && flag == "danger") danger.sound.play();
    }
  });
}, 1000);
