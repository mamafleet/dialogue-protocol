const URLRecipient = new URLSearchParams(window.location.search).get('user');
if (URLRecipient) username.value = URLRecipient;

var getCurve = function (divA, divB) {
  var posnALeft = {
    x: divA.offsetLeft - 8,
    y: divA.offsetTop + divA.offsetHeight,
  };
  var posnARight = {
    x: divA.offsetLeft + divA.offsetWidth + 8,
    y: divA.offsetTop + divA.offsetHeight,
  };
  var posnBLeft = {
    x: divB.offsetLeft - 8,
    y: divB.offsetTop,
  };
  var posnBRight = {
    x: divB.offsetLeft + divB.offsetWidth + 8,
    y: divB.offsetTop,
  };

  const p = 1;
  const [a, b, c, d] = [0, 15, -15, 0];
  const ax = (posnALeft.x + posnARight.x) / 2;
  const ay = posnALeft.y + p;
  const bx = (posnBLeft.x + posnBRight.x) / 2;
  const by = posnBLeft.y - p;
  console.log(ax, bx, ay, by);

  var dStrLeft =
    "M" +
    ax +
    "," +
    ay +
    " " +
    "C" +
    (ax + a) +
    "," +
    (ay + b) +
    " " +
    (bx + c) +
    "," +
    (by + d) +
    " " +
    bx +
    "," +
    by;
  // console.log(dStrLeft);
  // arrowLeft.setAttribute("d", dStrLeft);
  return dStrLeft;
};

function readLines() {
  if (username.value == "")

  username.value = "praemium-cranium"
  history.pushState({}, null, `${window.location.pathname}?user=${username.value}`);
  wapi
    .read("translator", {}, username.value, "api.web10.app")
    .then((response) => displayTranslations(response.data))
    .catch((error) => console.log(error));
}

function displayTranslations(data) {
  svgbox.innerHTML = ""
  console.log(data);
  var html = "";
  for (const [count, line] of data.entries()) {
    html += displayEnglish(line["english"], count);
    html += displayLatin(line["latin"], count);
  }
  main.innerHTML = html;
  for (const [count, line] of data.entries()) {
    displayLinks(line["links"], count);
  }

}

function displayEnglish(line, count) {
  console.log(line);
  return `<div class ="english" id="english${count}">
              ${displayWords(line)}
          </div>`;
}
function displayLatin(line, count) {
  return `<div class ="latin" id="latin${count}">
              ${displayWords(line)}
          </div>`;
}

function displayWords(line) {
  var html = "";
  for (const [i, word] of line.split(" ").entries()) {
    html += `<div>${word}</div>`;
  }
  return html;
}


function displayLinks(line, count) {

  line = JSON.parse("[" + line + "]");
  for (const [i, link] of line.entries()) {
    var english = document.getElementById("english" + count).children[link[1]-1];
    var latin = document.getElementById("latin" + count).children[link[0]-1];
    const d = getCurve(english, latin);
    const color = "teal";
    svgbox.innerHTML += ` <g fill="none" stroke="${color}" stroke-width="1.50">
                          <path d = "${d}"/>
                      </g>`;
  }
  return;
}
const wapi = wapiInit("https://auth.web10.app");
readLines();



