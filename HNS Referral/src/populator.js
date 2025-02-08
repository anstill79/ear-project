// import {
//   doc,
//   setDoc,
//   addDoc,
//   collection,
//   updateDoc,
//   getDocs,
// } from "firebase/firestore";
// import { db } from "./db.js";
// import { auth } from "./auth.js";

let dataObj = {
  Audiogram: [],
  Timing: [],
  Age: [],
  Guidance: {},
};

let newDataObj = {
  "----Select a result-----": {},
  //list keys to create the primary Select list
  "Sudden Sensorineural Hearing Loss": {
    Definition:
      "Sudden hearing loss of 30dB or more over 3 contiguous frequencies",
    Timing: {
      "0-6 Weeks": "On-call HNS for steroids",
      "Over 6 Weeks": "Too late for steroids. MRI to rule out tumor. Offer HA",
    },
  },
  "Unilateral Tinnitus, Constant": {
    Definition: "Constant ringing or other sound in one ear.",
    Timing: {
      "0-6 Months": "If still constant after 6 months, MRI to rule out tumor",
      "Over 6 Months": "MRI to rule out tumor",
    },
  },
  "Asymmetrical Sensorineural Hearing Loss": {
    Definition:
      "Asymmetry of 15dB or more at 3 contiguous frequencies, or 30dB at 1 frequency. Ignore interoctaves and 8kHz.",
    Age: {
      "Under 75": "MRI to rule out tumor",
      "Over 75": "Too old for MRI. Offer HA",
    },
  },
  "Conductive Component, Significant, Absent Reflexes": {
    Definition: "Air-bone gap greater than 30dB with absent ipsi reflexes.",
    Guidance:
      "Offer HNS referral for surgery, or hearing aid if not interested in surgery.",
  },
  "Conductive Component, Minor, Absent Reflexes": {
    Definition: "Air-bone gap smaller than 30dB with absent ipsi reflexes.",
    Guidance:
      "Not large enough for surgery. Offer HA and audiogram monitoring.",
  },
  "Conductive Component with Present Reflexes": {
    Definition:
      "Present ipsi reflexes with air-bone gap in the same ear or with negative bone conduction thresholds",
    Guidance:
      "Order VEMP testing. If positive, refer to HNS. If negative, HA or monitoring",
  },
  "Middle Ear Effusion": {
    Definition:
      "Conductive hearing loss with flat tympanogram(s) with normal canal volume.",
    Age: {
      Pediatric: "Repeat audiogram in 3 months. If still present, refer to HNS",
      Adult:
        "If present with URI, refer to PCP. Else, flonase and repeat audiogram in 3 months",
    },
  },
};

export function populateFirstSelect() {
  audiogram_result.innerHTML = "";
  const keys = Object.keys(newDataObj);
  keys.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    audiogram_result.appendChild(option);
  });
}
populateFirstSelect();

export function populateSecondarySelects() {
  guidance_text.innerHTML = "";
  const primary = audiogram_result.value;
  definition.querySelector(
    "span"
  ).innerText = `Definition: ${newDataObj[primary].Definition}`;
  const secondary = newDataObj[primary];
  const timingFirstOption = document.createElement("option");
  const ageFirstOption = document.createElement("option");
  timing_result.innerHTML = "";
  timing_result_wrapper.style.opacity = "0.3";
  age_result.innerHTML = "";
  age_result_wrapper.style.opacity = "0.3";
  if (secondary.Timing) {
    timing_result_wrapper.style.opacity = "1";
    timing_result.style.fontStyle = "Normal";
    timingFirstOption.value = "----Select an option----";
    timingFirstOption.textContent = "----Select an option----";
    timing_result.appendChild(timingFirstOption);
    const keys = Object.keys(secondary.Timing);
    keys.forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = key;
      timing_result.appendChild(option);
    });
  } else {
    timing_result_wrapper.style.opacity = "0.3";
    timingFirstOption.value = "Not applicable";
    timingFirstOption.textContent = "Not applicable";
    timing_result.style.fontStyle = "Italic";
    timing_result.appendChild(timingFirstOption);
  }
  if (secondary.Age) {
    age_result_wrapper.style.opacity = "1";
    age_result.style.fontStyle = "Normal";
    ageFirstOption.value = "----Select an option----";
    ageFirstOption.textContent = "----Select an option----";
    age_result.appendChild(ageFirstOption);
    const keys = Object.keys(secondary.Age);
    keys.forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = key;
      age_result.appendChild(option);
    });
  } else {
    age_result_wrapper.style.opacity = "0.3";
    ageFirstOption.value = "Not applicable";
    ageFirstOption.textContent = "Not applicable";
    age_result.appendChild(ageFirstOption);
    age_result.style.fontStyle = "Italic";
  }
  if (secondary.Guidance) {
    giveGuidance(secondary.Guidance);
  }
}

export function evaluateSecondarySelect() {
  const primary = audiogram_result.value;
  if (this.value === "Not applicable") {
    return;
  }
  if (this.value === "----Select an option----") {
    guidance_text.innerHTML = "";
    return;
  }
  const secondary = this.value;
  if (this.id === "timing_result") {
    giveGuidance(newDataObj[primary].Timing[secondary]);
  }
  if (this.id === "age_result") {
    giveGuidance(newDataObj[primary].Age[secondary]);
  }
}

function giveGuidance(guidance) {
  guidance_text.innerHTML = "";
  const p = document.createElement("p");
  p.innerText = guidance;
  guidance_text.appendChild(p);
  guidance_text.style.border = "1px solid black";
}
