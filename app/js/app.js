const data = {
  years: null,
  months: null,
  weeks: null,
  days: null,
  hours: null,
  minutes: null,
  seconds: null,
  savings: null,
  rupiah: null,
  koma: null,
  dailyCost: 20000, // in rupiah
  time: 1577811601000 // Epoch timestamp, since 01/01/2020
};

const progresses = [];
const radius = 25;
const circumference = radius * 2 * Math.PI;
const dom = {
  rupiah: document.getElementById("rupiah"),
  koma: document.getElementById("koma"),
  progresses: document.querySelectorAll(".progress[fraction]")
};

let lastRupiah = null;
let lastKoma = null;

init();

function init() {
  dom.progresses.forEach((progress, i) => {
    progresses[i] = {
      dom: {
        elem: dom.progresses[i],
        left: dom.progresses[i].querySelector(".left"),
        digits: dom.progresses[i].querySelector("h2")
      },
      fraction: progress.getAttribute("fraction"),
      offset: null,
      v: null
    };
  });

  update();
}

function update() {
  const now = Date.now();
  const seconds = (now - data.time) / 1000;
  data.years = seconds / 31556952;
  data.months = seconds / 2592000;
  data.weeks = seconds / 604800;
  data.days = seconds / 86400;
  data.hours = seconds / 3600;
  data.minutes = seconds / 60;
  data.seconds = seconds;
  data.savings = data.days * data.dailyCost;
  data.rupiah = Math.floor(data.savings)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  data.koma = (data.savings - Math.floor(data.savings))
    .toFixed(1)
    .split(".")[1];
  updatePies();
  if (lastRupiah !== data.rupiah) {
    lastRupiah = data.rupiah;
    dom.rupiah.innerText = data.rupiah;
  }
  if (lastKoma !== data.koma) {
    lastKoma = data.koma;
    dom.koma.innerText = data.koma;
  }
  requestAnimationFrame(update);
}

function updatePies() {
  progresses.forEach((progress, i) => {
    const value = data[progress.fraction];
    const complete = Math.floor(value);
    let v = complete.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (complete < 10) v = value.toFixed(2).replace(".", ",");
    if (complete < 1) v = value.toFixed(3).replace(".", ",");
    const percent = Math.round((value - complete) * 100 * 10) / 10;
    const offset = circumference - (percent / 100) * circumference;
    if (v !== progress.v) {
      progress.v = v;
      progress.dom.digits.innerText = v;
    }
    if (offset !== progress.offset) {
      progress.offset = offset;
      progress.dom.left.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" viewBox="0 0 100 100">
        <circle class="bg" r="${radius}" cx="50" cy="50" />
        <circle
          class="prog"
          r="${radius}"
          cx="50"
          cy="50"
          stroke-dasharray="${circumference} ${circumference}"
          stroke-dashoffset="${offset}"
        />
      </svg>`;
    }
  });
}