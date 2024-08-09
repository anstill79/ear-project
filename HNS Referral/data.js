// import { db } from "./db";

export let audiogramResultOptions = {
  count: 11,
  h27uzrk6kifg: [0, "Asymm.: 30_30_30 dB asymm. over 3 freq. (no interocts)"],
  hbvu82knmn8: [1, "Asymm.: 1 freq >= 30 dB asymm. (ignore 8kHz)"],
  hgx5y9f3fjqv: [2, "Asymm.: Word rec. >= 20% asymm."],
  hjo5e1wyk43n: [
    3,
    "Asymm: Not significantly large enough to meet other criteria.",
  ],
  hpmkn7f66ezl: [4, "ABG > 30 absent reflexes"],
  h7snmngmq7bq: [5, "ABG > 30 present reflexes"],
  htmfxbbsq6i: [6, "Pulsatile tinnitus"],
  hze5l88xw5da: [7, "Constant unilateral tinnitus"],
  h57i3mqae9am: [8, "Drainage"],
  hfv7habuo1rs: [9, "Asymm. 1 freq. => 30 dB"],
  h7e4lokp71x5: [10, "Asymm. 2 freq. => 15 dB"],
};

export let timingOptions = {
  count: 6,
  h4bs5o8e7g38: [0, "Weeks: 0 to 6"],
  hxpr2gkommu8: [1, "Months: 1.5 to 3"],
  hxqb1es55y: [2, "Months: 3 to 6"],
  hu14uai7ju5: [3, "Months: 6 to 12"],
  h9bvafyhtzhq: [4, "Years: 1+"],
  hfup2dtcsahn: [5, "Unknown"],
};

export let ageOptions = {
  count: 3,
  hvg5v9ghbfld: [0, "0-18"],
  hulsdhrnwfrs: [1, "19-70"],
  huga31csk7ws: [2, "Over 70"],
};

export const guidanceOptions = {
  // Asymm.: 30_30_30 dB asymm. over 3 freq. (no interocts). early onset
  h27uzrk6kifg_h4bs5o8e7g38_hvg5v9ghbfld: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  h27uzrk6kifg_h4bs5o8e7g38_hulsdhrnwfrs: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  h27uzrk6kifg_h4bs5o8e7g38_huga31csk7ws: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  // Asymm.: 30_30_30 dB asymm. over 3 freq. (no interocts). late onset
  h27uzrk6kifg_hxpr2gkommu8_hvg5v9ghbfld: `Audiologist orders MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 2 weeks
Hearing instruments as needed`,
  h27uzrk6kifg_hxpr2gkommu8_hulsdhrnwfrs: `Audiologist orders MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 2 weeks
Hearing instruments as needed`,
  h27uzrk6kifg_hxpr2gkommu8_huga31csk7ws: `Audiologist orders MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 2 weeks
Hearing instruments as needed`,
  // Asymm.: 1 freq >= 30 dB asymm. (ignore 8kHz).  onset doesn't matter
  hbvu82knmn8_h4bs5o8e7g38_hvg5v9ghbfld: `PCP orders MRI
No HNS visit indicated
Hearing instruments as needed
Monitor hearing annually`,
  hbvu82knmn8_h4bs5o8e7g38_hulsdhrnwfrs: `PCP orders MRI
No HNS visit indicated
Hearing instruments as needed
Monitor hearing annually`,
  hbvu82knmn8_h4bs5o8e7g38_huga31csk7ws: `Patient too old for MRI
No HNS visit indicated
Hearing instruments as needed
Monitor hearing annually`,
  // Asymm.: Word rec. >= 20% asymm. early onset
  hgx5y9f3fjqv_h4bs5o8e7g38_hvg5v9ghbfld: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  hgx5y9f3fjqv_h4bs5o8e7g38_hulsdhrnwfrs: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  hgx5y9f3fjqv_h4bs5o8e7g38_huga31csk7ws: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  // Asymm.: Word rec. >= 20% asymm. late onset
  hgx5y9f3fjqv_hxpr2gkommu8_hvg5v9ghbfld: `PCP orders MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 2 weeks
Hearing instruments as needed`,
  hgx5y9f3fjqv_hxpr2gkommu8_hulsdhrnwfrs: `PCP orders MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 2 weeks
Hearing instruments as needed`,
  hgx5y9f3fjqv_hxpr2gkommu8_huga31csk7ws: `Patient too old for MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 1 year
Hearing instruments as needed`,
  // Asymm: Not significantly large enough to meet other criteria.
  hjo5e1wyk43n_h4bs5o8e7g38_hvg5v9ghbfld: `No MRI indicated
No HNS visit indicated
Annual audiograms to monitor asymmetry, in case it grows.
  If asymmetry increases to meet HNS criteria for MRI or HNS consult, appropriate orders can be placed at that time.
Hearing instruments as needed`,
  hjo5e1wyk43n_h4bs5o8e7g38_hulsdhrnwfrs: `No MRI indicated
No HNS visit indicated
Annual audiograms to monitor asymmetry, in case it grows.
  If asymmetry increases to meet HNS criteria for MRI or HNS consult, appropriate orders can be placed at that time.
Hearing instruments as needed`,
  hjo5e1wyk43n_h4bs5o8e7g38_huga31csk7ws: `No MRI indicated
No HNS visit indicated
Annual audiograms to monitor asymmetry, in case it grows.
  If asymmetry increases to meet HNS criteria for MRI or HNS consult, appropriate orders can be placed at that time.
Hearing instruments as needed`,
};
