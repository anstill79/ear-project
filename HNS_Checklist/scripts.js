
const referral = {
  tinnitus: {
    bilateral: [null],
    symmetric: [null],
    duration: [null, null],
    durationDays: [null],
    pulsatile: [null],
  },
  hearing: {
    symmetry: [null],
    ABG: [null],
  },
  immitance: {
    type: [null],
    reflexes: [null],
    perforation: [null]
  },
  symptoms: {
    pain: [null],
    drainage: [null],
    infection: [null],
    auralPressure: [null],
    dizzy: {
      complains: [null],
      vertigo: {
        present: [null],
        positional: [null],
        duration: [null]
      }
    }
  }
};

function setTinnitus(response, name, id) {
  if (response === 1) {
    referral.tinnitus.bilateral.splice(0, 1, 1)
  } else
  if (response === 2) {
    referral.tinnitus.bilateral.splice(0, 1, 0)
  }
  if (response === 3) {
    referral.tinnitus.pulsatile.splice(0, 1, 1)
  }
  if (response === 4) {
    referral.tinnitus.pulsatile.splice(0, 1, 0)
  }
  if (response === 5) {
    referral.tinnitus.symmetric.splice(0, 1, 1)
  }
  if (response === 6) {
    referral.tinnitus.symmetric.splice(0, 1, 0)
  }
}

//grabs days/weeks/months/years element and puts it into a variable
const durationTimeFrame = document.getElementById("durationTimeFrame");

//listener to update the data object when something is changed. days/weeks/months etc
durationTimeFrame.addEventListener("change", function() {

  const choice = durationTimeFrame.options[durationTimeFrame.selectedIndex].value;

  referral.tinnitus.duration.splice(1, 1, choice);
  convertToDays();

});

const durationNumber = document.getElementById("durationNumber");

//listener to update the data object when something is changed. numeric value
durationNumber.addEventListener("change", function() {

  const choice = durationNumber.value;

  referral.tinnitus.duration.splice(0, 1, choice);
  convertToDays();

});

//converts weeks/months/years to days so that one value can be targeted to determine algorithm flow for clinic.
function convertToDays() {
  const timeChoice = referral.tinnitus.duration[1];
  const duration = referral.tinnitus.duration[0];
  if (timeChoice === null || duration === null) {
    return
  } else

  if (timeChoice === "seconds" || timeChoice === "minutes") {
    referral.tinnitus.durationDays.splice(0, 1, "n/a");

  } else
  if (timeChoice === "days") {
    referral.tinnitus.durationDays.splice(0, 1, duration)
  } else
  if (timeChoice === "weeks") {
    referral.tinnitus.durationDays.splice(0, 1, duration * 7)
  } else
  if (timeChoice === "months") {
    referral.tinnitus.durationDays.splice(0, 1, duration * 30)
  } else
  if (timeChoice === "years") {
    referral.tinnitus.durationDays.splice(0, 1, duration * 365)
  }

  tinnitusRec();

}

const tinnRec = document.getElementById("tinnitusRec");

function tinnitusRec() {

  const bilat = referral.tinnitus.bilateral[0];
  const symm = referral.tinnitus.symmetric[0];
  const pulse = referral.tinnitus.pulsatile[0];
  const duration = referral.tinnitus.durationDays[0];
  
  //routine tinn
  if (bilat === 1 && symm === 1 && pulse === 0) {
		tinnRec.append("No HNS referral needed for tinnitus.");
  }
  //pulsatile but <6 mos
  if (pulse === 1 && duration < 180) {
		tinnRec.append("No HNS referral needed. Pulsatile ");
  }
}
