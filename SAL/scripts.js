function exportTextBlob() {
 
  //format a little blob showing unmasked, masked, shift, and recommended SAL value. 
  
}

function toggleInfo() {

const infoo = document.getElementById('Info'); 
 if (infoo.style.display === "none") {infoo.style.display = "block"} else {
infoo.style.display = "none"}
}


const thresholds = {

  unMasked: {
    R500: [null],
    R1000: [null],
    R2000: [null],
    R4000: [null],
    L500: [null],
    L1000: [null],
    L2000: [null],
    L4000: [null],
  },
  Masked: {
    R500: [null],
    R1000: [null],
    R2000: [null],
    R4000: [null],
    L500: [null],
    L1000: [null],
    L2000: [null],
    L4000: [null],
  }
};

const norms = {
  //500Hz
  A: [40],
  //1000Hz
  B: [50],
  //2000Hz
  C: [45],
  //4000Hz
  D: [50]
}

//takes in OG thresh and new thresh and outputs masked value for plotting. 
function calcThresh(id) {

  //get argument = id of element then query selector for it and partner to put into variables. 
  const target = document.getElementById(id);
  const buddy = document.getElementById("un" + id);

  //take id and strip 'masked' word and attach 'result word'. Think it returns a new str
  const result = document.getElementById(id.replace("masked", "").concat("result"));
  //const resultName = id.replace("masked", "").concat("result");

  const unmasked = buddy.value;
  const masked = target.value;

  if (masked.length === 0 || unmasked.length === 0) {
    return
  } else {

    let norm = '';

    if (id.includes('500')) {
      norm = norms.A
    } else if (id.includes('1000')) {
      norm = norms.B
    } else if (id.includes('2000')) {
      norm = norms.C
    } else if (id.includes('4000')) {
      norm = norms.D
    }
    //shift amount
    const shift = masked - unmasked;

    let SAL = norm - shift;

    if (SAL < 0) {
      SAL = 0
    }

    result.innerText = `${SAL} dB`;

  }
}

const localNorms = {
  A: "",
  B: "",
  C: "",
  D: ""
}

window.localStorage.setItem('localNorms', localNorms);


function grabNewCustomNorms() {
  //gets custom norms from page. Sets customs to the local storage then finishes by updating the app formula
  /*   
    localStorage.clear();
    return; */

  const five = document.getElementById("norm500");
  const one = document.getElementById("norm1000");
  const two = document.getElementById("norm2000");
  const four = document.getElementById("norm4000");
  const message = "Norms updated from input boxes on screen. ";

  const localNorms = {
    A: five.value,
    B: one.value,
    C: two.value,
    D: four.value
  };

  //should only overwrite data when given an input from the screen
  if (!localNorms.A) {} else {
    localStorage.setItem("localNorms.A", localNorms.A);
  }
  if (!localNorms.B) {} else {
    localStorage.setItem("localNorms.B", localNorms.B);
  }
  if (!localNorms.C) {} else {
    localStorage.setItem("localNorms.C", localNorms.C);
  }
  if (!localNorms.D) {} else {
    localStorage.setItem("localNorms.D", localNorms.D);
  }
  //commenting out because it may not be JSON safe?
  //const timeStamp = new Date().toLocaleString();
  //localStorage.setItem("localNorms.timeStamp", timeStamp);

  //calls load fx to put custom values into the app formula
  pushCustomNorms(localNorms.A, localNorms.B, localNorms.C, localNorms.D, message);
}

function grabOldCustomNorms() {
  //grabs localStorage values

  //checks for existence of local values 
  const aA = window.localStorage.getItem('localNorms.A');
  const bB = window.localStorage.getItem('localNorms.B');
  const cC = window.localStorage.getItem('localNorms.C');
  const dD = window.localStorage.getItem('localNorms.D');
  const message = "Norms loaded from local storage. "
pushCustomNorms(aA, bB, cC, dD, message);

}

function pushCustomNorms(five, one, two, four, message) {
  //takes in custom norms from earlier script and updates them into app formula
  //if empty value it leaves the target untouched

  let alertFlag = 0;

  if (!five) {
    alertFlag++
  } else {
    norms.A.splice(0, 1, parseInt(five))
  }
  if (!one) {
    alertFlag++
  } else {
    norms.B.splice(0, 1, parseInt(one))
  }
  if (!two) {
    alertFlag++
  } else {
    norms.C.splice(0, 1, parseInt(two))
  }
  if (!four) {
    alertFlag++
  } else {
    norms.D.splice(0, 1, parseInt(four))
  }
  if (alertFlag < 1) {} else {
    window.alert(`${message} ${alertFlag} of your custom norms ${alertFlag > 1 ? "were" : "was"} empty. Default norms or previously-entered custom norms applied to the empty frequencies.`);
  }
  //loads values to the screen
  fillNormTable(norms.A, norms.B, norms.C, norms.D);
}

function setMin(id) {
  //sets the masked min starting value to at least that of the unmasked. 
  //get argument = id of element then query selector for it and partner to put into variables. 
  const target = document.getElementById(id);
  const targetVal = target.value;
  const buddyName = id.replace("un", "");
  const buddy = document.getElementById(buddyName);

  buddy.setAttribute("min", targetVal);
  //this updates the result in case it was set and then the unmasked was changed later. 
  calcThresh(buddyName);
}

function fillNormTable(A, B, C, D) {
  const five = document.getElementById("normData500cell");
  const one = document.getElementById("normData1kcell");
  const two = document.getElementById("normData2kcell");
  const four = document.getElementById("normData4kcell");
  const target = document.getElementById("update-norm-time");
  const timeStamp = new Date().toLocaleString();

  five.innerText = A;
  one.innerText = B;
  two.innerText = C;
  four.innerText = D;
  target.innerText = timeStamp;
}

fillNormTable(norms.A, norms.B, norms.C, norms.D);

