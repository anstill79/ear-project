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
  if (data[ear][freq][0] < 50 && data[ear][freq][0] !== null) {
    //SALresults[ear][freq][0] = null;
    SALresults[ear][freq][2] = '⚠️';
    SALresults[ear][freq][1] = "Initial result is lower than 50dB. Traditional masking may be a better choice for this frequency. The SAL value is displayed in case traditional masking is not viable due to opposite ear severity.";
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
      SALresults[ear][freq][2] = '⚠️';
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
  const targetComment = document.getElementById('result_modal_content');
  targetComment.innerText = "";
  const title = document.createElement('span');
  const content = document.createElement('span');
  const div = document.createElement('div');
  div.classList.add('spacer');
  title.innerText = SALresults[ear][freq][3];
  title.classList.add('card-title');
  content.innerText = SALresults[ear][freq][1];
  content.classList.add('card-content');
  targetComment.appendChild(title);
  targetComment.appendChild(div);

  targetComment.appendChild(content);
}


function generateHelpText() {

  const yo = "";

  const content = `When should you use SAL? 
  
  SAL is useful when traditional masking approaches are likely to overmask and lead to masking dilemma. Bilateral conductive hearing losses with large unmasked air-bone gaps are the most common use case for SAL. 

  How does it work? 
        
  AL uses normative data based on each audiometer and normal subjects. Each audiometer likely has different maximum outputs for bone-conduction (BC) narrow-band noise (NBN) at each freqeuncy. The SAL procedure asks you to set channel 2 to the maximum level per NBN using the BC oscillator placed on the patient's forehead. The max output will vary by frequency (usually between 40-60dB). You can use the default norms if needed but it is likely better to establish specific norms for your booth. The masking noise will cause the AC thresholds to increase if the ear has conductive loss. The amount of increase (unmasked AC vs masked AC) will guide you on the estimated level of the BC threshold.


How do I do the test?

  Measure unmasked AC thresholds 500Hz-4kHz and mark them down. Place the bone oscillator on the forehead and present NBN masking through it at the max level of channel 2 then remeasure AC thresholds and mark them down. Use the values displayed in the results section as the masked BC thresholds. 
  
How do I create my own norms?

  Test air-conduction on a few normal subjects at 500Hz, 1kHz, 2kHz, and 4kHz in each ear (unilateral is also fine). Retest the same subjects at the same frequencies via AC but place the BC oscillator on the forehead and set channel 2 routed to BC with NBN signal at the highest output allowed by the machine. Subtract the unmasked threshold from the masked threshold to get the shift value for each frequency. Average the shift values across your subjects to get the norm value for that frequency. 

Why does it give me a masked BC threshold below the unmasked BC threshold?

  The calculation doesn't take the unmasked BC threshold into account. If you receive a result that is better (lower) than your unmasked threshold just use the unmasked value as the masked value. The fact that the value is better than unmasked suggests that your unmasked value can be trusted to represent cochlear function for that ear.

What do I do if I reach the limits of the equipment before a masked response is obtained?

  This can happen when the loss is mixed and the best unmasked BC thresolds are near the moderate range of hearing loss. Try another AC transducer to see if there is higher output. If that doesn't help then you may need to stick with "masking dilemma".`




}
