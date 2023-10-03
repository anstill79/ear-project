const inputs = document.querySelectorAll('input');
const resultsDisplay = document.querySelectorAll('.result');
const moreInfo = document.querySelectorAll('.info');
inputs.forEach(input => {
  input.addEventListener('change', doSAL);
});
moreInfo.forEach(info => {
  info.addEventListener('click', launchResult)
});
//[0] is initial, [1] is masked
const data = {
  R: {
    five: [null, null],
    one: [null, null],
    two: [null, null],
    four: [null, null],
  },
  L: {
    five: [null, null],
    one: [null, null],
    two: [null, null],
    four: [null, null],
  }
}

const shiftNorms = {
  five: 55,
  one: 60,
  two: 60,
  four: 60,
}
//[0] is result, [1] is comment, [2] is symbol, [3] is name for display in modal
const SALresults = {
  R: {
    five: [null, null, null, 'Right 500 Hz'],
    one: [null, null, null, 'Right 1000 Hz'],
    two: [null, null, null, 'Right 2000 Hz'],
    four: [null, null, null, 'Right 4000 Hz'],
  },
  L: {
    five: [null, null, null, 'Left 500 Hz'],
    one: [null, null, null, 'Left 1000 Hz'],
    two: [null, null, null, 'Left 2000 Hz'],
    four: [null, null, null, 'Left 4000 Hz'],
  }
}

function doSAL() {
  const id = this.id;
  const val = parseInt(this.value);
  const ear = id.charAt(0);
  let freq = "";
  if (id.includes('initial')) {
    freq = id.replace(`${ear}_initial_`, '');
    data[ear][freq][0] = val;
  } else if (id.includes('masked')) {
    freq = id.replace(`${ear}_masked_`, '');
    data[ear][freq][1] = val;
  }
  const targetResult = `${ear}_result_${freq}`;
  const targetInfo = `${ear}_info_${freq}`;
  //why do SAL in this case?
  if (data[ear][freq][0] < 50) {
    SALresults[ear][freq][0] = null;
    SALresults[ear][freq][2] = '⚠️';
    SALresults[ear][freq][1] = "Initial result is lower than 50dB. Traditional masking may be a better choice for this frequency.";
    setResultsToCell(ear, freq, targetResult, targetInfo);
    return;
  }
  if (data[ear][freq][0] > 85) {

    SALresults[ear][freq][2] = '⚠️';
    SALresults[ear][freq][1] = "Initial result is greater than 85dB. The limits of most equipment can be an issue here. The SAL value is displayed but use with caution.";
    if (typeof data[ear][freq][1] === 'number' && typeof data[ear][freq][0] === 'number') {
      const shift = data[ear][freq][1] - data[ear][freq][0];
      SALresults[ear][freq][0] = shiftNorms[freq] - shift;
    }
    setResultsToCell(ear, freq, targetResult, targetInfo);
    return;
  }


  if (data[ear][freq][0] && data[ear][freq][1]) {
    const maxAllowed = data[ear][freq][0] - shiftNorms[freq];
    const shift = data[ear][freq][1] - data[ear][freq][0];
    SALresults[ear][freq][0] = shiftNorms[freq] - shift;
    // if shift is larger than norm, just put it at initial minus norm
    if (shift > shiftNorms[freq]) {
      SALresults[ear][freq][0] = data[ear][freq][0] - shiftNorms[freq];
      SALresults[ear][freq][2] = '🤔';
      SALresults[ear][freq][1] = `The result is usable but the shift amount is too large. The displayed result uses norm the value instead of shift (norm at this frequency is ${shiftNorms[freq]}dB)`;
    } else {
      SALresults[ear][freq][1] = "Looks good. Use the displayed result.";
      SALresults[ear][freq][2] = '✅';
    }
    // technical error or typo. masked result is lower than initial result
    if (data[ear][freq][1] < data[ear][freq][0]) {
      SALresults[ear][freq][0] = '!';
      SALresults[ear][freq][1] = "The masked result is lower than initial result. Please check for technical error or typo.";
    }

  } else {
    //wipe out result if one of the inputs is empty
    SALresults[ear][freq][0] = null;
    SALresults[ear][freq][1] = null;
  }
  setResultsToCell(ear, freq, targetResult, targetInfo);
}

function setResultsToCell(ear, freq, targetResult, targetInfo) {
  resultsDisplay.forEach(result => {
    if (result.id === targetResult) {
      result.textContent = SALresults[ear][freq][0];
    }
  },
    moreInfo.forEach(info => {
      if (info.id === targetInfo) {
        info.textContent = SALresults[ear][freq][2];
      }
    }
    ))
}

const result_modal = document.getElementById("result_modal");

function closeResult(event) {
  if (event.target === result_modal) {
    result_modal.style.display = "none";
    result_modal.removeEventListener("click", closeResult);
  }
}

function launchResult(event) {
  result_modal.style.display = "block";
  result_modal.addEventListener("click", closeResult);
  const id = event.target.id;
  const ear = id.charAt(0);
  const freq = id.replace(`${ear}_info_`, '');
  const targetComment = document.getElementById('dialog_text')
  targetComment.innerText = `${SALresults[ear][freq][3]}: ${SALresults[ear][freq][1]}`;
}
