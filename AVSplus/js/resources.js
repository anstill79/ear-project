/* ── AVSplus resource library ─────────────────────────────────────────────
   All resource data lives here. No server or database required.
   Add new resources by appending to the RESOURCES array.
────────────────────────────────────────────────────────────────────────── */

const RESOURCES = [

  // ── STATIC RESOURCES ────────────────────────────────────────────────────
  // type: 'static'  →  content is rendered directly, no user input needed.

  {
    id: 1,
    name: 'Hearing Aid Care & Maintenance',
    description: 'Daily care tips and cleaning instructions',
    category: 'Hearing Aids',
    type: 'static',
    icon: '🦻',
    sort_order: 10,
    fields: [],
    template: null,
    content: `
<h2>Hearing Aid Care &amp; Maintenance</h2>
<p>Proper care of your hearing aids will extend their life and ensure optimal performance.</p>

<h3>Daily Routine</h3>
<ul>
  <li>Wipe hearing aids with a soft, dry cloth each evening.</li>
  <li>Open the battery door overnight to conserve battery and allow moisture to escape.</li>
  <li>Store hearing aids in a dry, cool place away from pets and children.</li>
  <li>Never wear hearing aids while showering, swimming, or using a hair dryer.</li>
</ul>

<h3>Weekly Cleaning</h3>
<ul>
  <li>Use the brush provided to gently clear the microphone ports and sound openings.</li>
  <li>Inspect the tubing (if applicable) for cracks, discoloration, or blockage.</li>
  <li>Check the dome or earmold for wax buildup and replace as needed.</li>
</ul>

<h3>When to Seek Help</h3>
<p>Contact our office if you notice:</p>
<ul>
  <li>Reduced sound quality or volume</li>
  <li>Whistling or feedback that was not present before</li>
  <li>Physical damage to the casing</li>
</ul>
<p class="tip"><strong>Tip:</strong> A hearing aid dehumidifier or drying kit used overnight can significantly reduce moisture-related repairs.</p>`
  },

  {
    id: 2,
    name: 'Battery Safety & Replacement',
    description: 'Battery types, replacement steps, and safe disposal',
    category: 'Hearing Aids',
    type: 'static',
    icon: '🔋',
    sort_order: 20,
    fields: [],
    template: null,
    content: `
<h2>Battery Safety &amp; Replacement</h2>

<h3>Battery Sizes</h3>
<p>Hearing aid batteries come in four standard sizes, color-coded for easy identification:</p>
<table>
  <thead><tr><th>Size</th><th>Color</th><th>Typical Life</th></tr></thead>
  <tbody>
    <tr><td>10</td><td>Yellow</td><td>3–7 days</td></tr>
    <tr><td>312</td><td>Brown</td><td>5–10 days</td></tr>
    <tr><td>13</td><td>Orange</td><td>6–14 days</td></tr>
    <tr><td>675</td><td>Blue</td><td>9–20 days</td></tr>
  </tbody>
</table>

<h3>Replacing Batteries</h3>
<ol>
  <li>Wash and dry hands before handling batteries.</li>
  <li>Peel the sticker tab and wait 1 minute before inserting — this activates the battery.</li>
  <li>Open the battery door, remove the old battery, and insert the new one flat-side up.</li>
  <li>Close the door gently; never force it.</li>
</ol>

<h3>Rechargeable Hearing Aids</h3>
<p>If your hearing aids are rechargeable, place them in the charger each night. A full charge typically provides 18–24 hours of use.</p>

<h3>Safe Disposal</h3>
<p class="tip"><strong>Important:</strong> Hearing aid batteries contain zinc and must not be placed in household trash. Drop used batteries at our office or any electronics recycling location.</p>`
  },

  {
    id: 3,
    name: 'Communication Strategies',
    description: 'Tips for hearing aid users and their communication partners',
    category: 'Communication',
    type: 'static',
    icon: '💬',
    sort_order: 30,
    fields: [],
    template: null,
    content: `
<h2>Communication Strategies</h2>
<p>Hearing aids are a powerful tool, but effective communication involves both the listener <em>and</em> the speaker.</p>

<h3>For the Hearing Aid Wearer</h3>
<ul>
  <li>Face the speaker and watch their lips and facial expressions.</li>
  <li>Reduce background noise when possible (turn off the TV, move to a quieter room).</li>
  <li>Inform others of your hearing loss — most people are happy to accommodate.</li>
  <li>Ask for key information to be repeated or written down when needed.</li>
  <li>Take breaks; listening with hearing loss is mentally tiring.</li>
</ul>

<h3>For Family &amp; Communication Partners</h3>
<ul>
  <li>Get the listener's attention before speaking.</li>
  <li>Speak clearly and at a natural pace — shouting distorts speech.</li>
  <li>Keep your face visible; avoid covering your mouth or speaking from another room.</li>
  <li>Rephrase (don't just repeat) if you are not understood the first time.</li>
  <li>Be patient and supportive — better hearing is a process.</li>
</ul>

<h3>Difficult Listening Environments</h3>
<p>Ask your audiologist about directional microphones, Bluetooth streaming, or remote microphones (e.g., Roger Pen, TV Connector) that can dramatically improve hearing in challenging situations.</p>`
  },

  {
    id: 4,
    name: 'Tinnitus Management Overview',
    description: 'Overview of tinnitus, coping strategies, and sound therapy',
    category: 'Tinnitus',
    type: 'static',
    icon: '🔔',
    sort_order: 40,
    fields: [],
    template: null,
    content: `
<h2>Tinnitus Management Overview</h2>
<p>Tinnitus is the perception of sound (ringing, buzzing, humming) without an external source. It is very common and, while not a disease itself, can significantly affect quality of life.</p>

<h3>Understanding Your Tinnitus</h3>
<ul>
  <li>Tinnitus is usually a symptom, not a disease — identifying triggers is the first step.</li>
  <li>Common triggers include loud noise exposure, stress, caffeine, and poor sleep.</li>
  <li>It often improves once any underlying hearing loss is treated with hearing aids.</li>
</ul>

<h3>Sound Therapy</h3>
<p>Low-level background sound reduces the contrast between tinnitus and silence:</p>
<ul>
  <li>Use a white noise machine or fan at bedtime.</li>
  <li>Many hearing aids include a built-in tinnitus masking or sound therapy program — ask your audiologist to activate it.</li>
  <li>Free apps such as <em>ReSound Relief</em> or <em>Widex Zen</em> offer structured sound therapy.</li>
</ul>

<h3>Lifestyle &amp; Cognitive Strategies</h3>
<ul>
  <li>Practice relaxation techniques: deep breathing, progressive muscle relaxation, mindfulness.</li>
  <li>Protect remaining hearing — avoid further loud noise exposure.</li>
  <li>Consider cognitive behavioral therapy (CBT); it has the strongest evidence base for tinnitus distress.</li>
</ul>
<p class="tip">Contact us if your tinnitus suddenly worsens, becomes one-sided, or is accompanied by dizziness or hearing changes.</p>`
  },

  {
    id: 5,
    name: 'Understanding Your Audiogram',
    description: 'Plain-language explanation of the audiogram graph',
    category: 'Education',
    type: 'static',
    icon: '📊',
    sort_order: 50,
    fields: [],
    template: null,
    content: `
<h2>Understanding Your Audiogram</h2>
<p>An audiogram is a graph showing how well you hear different pitches (frequencies) at different volume levels.</p>

<figure style="text-align:center;margin:1rem 0;">
  <svg viewBox="0 0 480 300" width="480" height="300" style="max-width:100%;border:1px solid #ccc;background:#fff;font-family:sans-serif;font-size:11px;">
    <line x1="60" y1="20" x2="60" y2="260" stroke="#ddd"/><line x1="120" y1="20" x2="120" y2="260" stroke="#ddd"/>
    <line x1="180" y1="20" x2="180" y2="260" stroke="#ddd"/><line x1="240" y1="20" x2="240" y2="260" stroke="#ddd"/>
    <line x1="300" y1="20" x2="300" y2="260" stroke="#ddd"/><line x1="360" y1="20" x2="360" y2="260" stroke="#ddd"/>
    <line x1="420" y1="20" x2="420" y2="260" stroke="#ddd"/>
    <line x1="60" y1="20" x2="460" y2="20" stroke="#ddd"/><line x1="60" y1="60" x2="460" y2="60" stroke="#ddd"/>
    <line x1="60" y1="100" x2="460" y2="100" stroke="#ddd"/><line x1="60" y1="140" x2="460" y2="140" stroke="#ddd"/>
    <line x1="60" y1="180" x2="460" y2="180" stroke="#ddd"/><line x1="60" y1="220" x2="460" y2="220" stroke="#ddd"/>
    <line x1="60" y1="260" x2="460" y2="260" stroke="#ddd"/>
    <line x1="60" y1="20" x2="60" y2="265" stroke="#333" stroke-width="2"/>
    <line x1="55" y1="260" x2="465" y2="260" stroke="#333" stroke-width="2"/>
    <text x="50" y="24" text-anchor="end">-10</text><text x="50" y="64" text-anchor="end">10</text>
    <text x="50" y="104" text-anchor="end">30</text><text x="50" y="144" text-anchor="end">50</text>
    <text x="50" y="184" text-anchor="end">70</text><text x="50" y="224" text-anchor="end">90</text>
    <text x="50" y="264" text-anchor="end">110</text>
    <text x="60" y="278" text-anchor="middle">250</text><text x="120" y="278" text-anchor="middle">500</text>
    <text x="180" y="278" text-anchor="middle">1k</text><text x="240" y="278" text-anchor="middle">2k</text>
    <text x="300" y="278" text-anchor="middle">3k</text><text x="360" y="278" text-anchor="middle">4k</text>
    <text x="420" y="278" text-anchor="middle">8k</text>
    <text x="10" y="145" transform="rotate(-90,10,145)" text-anchor="middle" font-size="10">dB HL</text>
    <text x="260" y="295" text-anchor="middle" font-size="10">Frequency (Hz)</text>
    <rect x="60" y="20" width="400" height="60" fill="#d1fae5" opacity="0.5"/>
    <text x="462" y="52" font-size="9" fill="#065f46">Normal</text>
    <polyline points="60,80 120,90 180,110 240,130 300,150 360,160 420,170" fill="none" stroke="#3b82f6" stroke-width="2"/>
    <text x="60" y="77" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="120" y="87" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="180" y="107" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="240" y="127" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="300" y="147" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="360" y="157" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="420" y="167" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <polyline points="60,85 120,95 180,120 240,145 300,160 360,175 420,185" fill="none" stroke="#ef4444" stroke-width="2"/>
    <text x="60" y="82" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="120" y="92" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="180" y="117" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="240" y="142" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="300" y="157" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="360" y="172" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="420" y="182" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="100" y="295" fill="#3b82f6" font-size="10">O = Right Ear</text>
    <text x="250" y="295" fill="#ef4444" font-size="10">X = Left Ear</text>
  </svg>
  <figcaption style="font-size:0.85em;color:#666;">Sample audiogram showing mild-to-moderate sloping hearing loss</figcaption>
</figure>

<h3>How to Read It</h3>
<ul>
  <li><strong>Left → right:</strong> Frequency (pitch) in Hertz — low pitches left, high pitches right. Speech occupies 500–4,000 Hz.</li>
  <li><strong>Top → bottom:</strong> Loudness in decibels (dB HL) — quiet sounds at top, loud sounds at bottom.</li>
  <li><strong>Each symbol</strong> shows the softest sound you could hear at that frequency.</li>
</ul>

<h3>Degree of Hearing Loss</h3>
<table>
  <thead><tr><th>Range (dB HL)</th><th>Degree</th></tr></thead>
  <tbody>
    <tr><td>–10 to 25</td><td>Normal</td></tr>
    <tr><td>26 to 40</td><td>Mild</td></tr>
    <tr><td>41 to 55</td><td>Moderate</td></tr>
    <tr><td>56 to 70</td><td>Moderately Severe</td></tr>
    <tr><td>71 to 90</td><td>Severe</td></tr>
    <tr><td>91+</td><td>Profound</td></tr>
  </tbody>
</table>`
  },

  {
    id: 6,
    name: 'Noise Protection Guidelines',
    description: 'Safe listening levels and hearing protection recommendations',
    category: 'Education',
    type: 'static',
    icon: '🛡️',
    sort_order: 60,
    fields: [],
    template: null,
    content: `
<h2>Noise Protection Guidelines</h2>
<p>Noise-induced hearing loss (NIHL) is permanent but 100% preventable. Risk depends on both <em>how loud</em> and <em>how long</em> you are exposed.</p>

<h3>Safe Exposure Levels (NIOSH)</h3>
<table>
  <thead><tr><th>Sound Level</th><th>Example</th><th>Safe Duration / Day</th></tr></thead>
  <tbody>
    <tr><td>85 dB</td><td>Heavy traffic, lawnmower</td><td>8 hours</td></tr>
    <tr><td>91 dB</td><td>Shop tools</td><td>2 hours</td></tr>
    <tr><td>94 dB</td><td>Nightclub music</td><td>1 hour</td></tr>
    <tr><td>100 dB</td><td>Jackhammer, concert</td><td>15 minutes</td></tr>
    <tr><td>110+ dB</td><td>Firearm, jet engine</td><td>&lt;2 minutes</td></tr>
  </tbody>
</table>

<h3>Types of Hearing Protection</h3>
<ul>
  <li><strong>Foam earplugs (NRR 29–33):</strong> Inexpensive, effective for most noise.</li>
  <li><strong>Earmuffs (NRR 20–30):</strong> Easy to use; good for intermittent noise.</li>
  <li><strong>Custom earplugs:</strong> Molded to your ear for comfort and all-day wear.</li>
  <li><strong>Musician's earplugs:</strong> Reduce volume evenly, preserving sound quality.</li>
</ul>

<h3>Day-to-Day Tips</h3>
<ul>
  <li>Follow the "60/60 rule" for personal audio: no more than 60% volume for 60 minutes at a time.</li>
  <li>Doubling your distance from a loud source reduces sound intensity by 6 dB.</li>
  <li>Allow 18+ hours of quiet recovery after loud noise exposure.</li>
</ul>
<p class="tip"><strong>Remember:</strong> Once noise-induced hearing loss occurs, it cannot be reversed. Protect what you have.</p>`
  },

  // ── FORM-BASED RESOURCES ─────────────────────────────────────────────────
  // type: 'form'  →  fields[] drives the config modal; template is rendered
  // with the collected values using {{varname}} substitution.

  {
    id: 7,
    name: 'Hearing Aid Fitting Summary',
    description: 'Document the hearing aid(s) fit today',
    category: 'Hearing Aids',
    type: 'form',
    icon: '⚙️',
    sort_order: 1,
    content: null,
    fields: [
      { field_name: 'patient_name', field_label: 'Patient Name',          field_type: 'text',     field_options: null, default_value: '',          required: true  },
      { field_name: 'fit_date',     field_label: 'Fitting Date',          field_type: 'date',     field_options: null, default_value: '',          required: true  },
      { field_name: 'right_model',  field_label: 'Right Ear — Model',     field_type: 'text',     field_options: null, default_value: '',          required: false },
      { field_name: 'right_style',  field_label: 'Right Ear — Style',     field_type: 'select',   field_options: ['RIC/RITE','BTE','ITE','ITC','CIC','IIC','N/A'], default_value: 'RIC/RITE', required: false },
      { field_name: 'left_model',   field_label: 'Left Ear — Model',      field_type: 'text',     field_options: null, default_value: '',          required: false },
      { field_name: 'left_style',   field_label: 'Left Ear — Style',      field_type: 'select',   field_options: ['RIC/RITE','BTE','ITE','ITC','CIC','IIC','N/A'], default_value: 'RIC/RITE', required: false },
      { field_name: 'programs',     field_label: 'Programs Loaded',       field_type: 'textarea', field_options: null, default_value: 'Program 1: Everyday\nProgram 2: Noise\nProgram 3: Music', required: false },
      { field_name: 'volume_default',field_label:'Default Volume',        field_type: 'select',   field_options: ['Lowest','Low','Mid-Low','Mid','Mid-High','High','Highest'], default_value: 'Mid', required: false },
      { field_name: 'dome_type',    field_label: 'Dome / Coupling Type',  field_type: 'select',   field_options: ['Open dome','Closed dome','Power dome','Custom earmold','Slim tube','N/A'], default_value: 'Open dome', required: false },
      { field_name: 'app_name',     field_label: 'Companion App (if any)',field_type: 'text',     field_options: null, default_value: '',          required: false },
      { field_name: 'next_steps',   field_label: 'Next Steps / Notes',    field_type: 'textarea', field_options: null, default_value: '',          required: false },
    ],
    template: `<h2>Hearing Aid Fitting Summary</h2>
<p><strong>Patient:</strong> {{patient_name}}&emsp;<strong>Date:</strong> {{fit_date}}</p>
<table>
  <thead><tr><th>Ear</th><th>Model</th><th>Style</th><th>Dome / Coupling</th></tr></thead>
  <tbody>
    <tr><td>Right (O)</td><td>{{right_model}}</td><td>{{right_style}}</td><td rowspan="2">{{dome_type}}</td></tr>
    <tr><td>Left (X)</td><td>{{left_model}}</td><td>{{left_style}}</td></tr>
  </tbody>
</table>
<h3>Programs</h3>
<pre style="white-space:pre-wrap;font-family:inherit;margin:4px 0;">{{programs}}</pre>
<p><strong>Default Volume:</strong> {{volume_default}}</p>
{{#app_name}}<p><strong>Companion App:</strong> {{app_name}}</p>{{/app_name}}
{{#next_steps}}<h3>Next Steps</h3><p style="white-space:pre-wrap;">{{next_steps}}</p>{{/next_steps}}`
  },

  {
    id: 8,
    name: 'Follow-Up Schedule',
    description: 'Set upcoming appointment dates and reminders',
    category: 'Follow-Up',
    type: 'form',
    icon: '📅',
    sort_order: 2,
    content: null,
    fields: [
      { field_name: 'next_appt',      field_label: 'Next Appointment Date', field_type: 'date',     field_options: null, default_value: '', required: false },
      { field_name: 'next_appt_type', field_label: 'Appointment Type',      field_type: 'select',   field_options: ['Hearing aid follow-up','Re-evaluation','Annual audiogram','Cerumen management','Tinnitus follow-up','Other'], default_value: 'Hearing aid follow-up', required: false },
      { field_name: 'appt_notes',     field_label: 'Appointment Notes',     field_type: 'textarea', field_options: null, default_value: '', required: false },
      { field_name: 'call_if',        field_label: 'Call Us If…',           field_type: 'textarea', field_options: null, default_value: 'Your hearing aids are not working as expected\nYou experience sudden changes in hearing\nYou have questions about your devices', required: false },
    ],
    template: `<h2>Follow-Up Schedule</h2>
{{#next_appt}}<p><strong>Next Appointment:</strong> {{next_appt}} &mdash; {{next_appt_type}}</p>{{/next_appt}}
{{#appt_notes}}<p>{{appt_notes}}</p>{{/appt_notes}}
<h3>Please Contact Our Office If:</h3>
<ul>{{#each call_if_lines}}<li>{{this}}</li>{{/each}}</ul>`
  },

  {
    id: 9,
    name: 'Custom Care Instructions',
    description: 'Enter personalized care instructions for this patient',
    category: 'Follow-Up',
    type: 'form',
    icon: '✏️',
    sort_order: 3,
    content: null,
    fields: [
      { field_name: 'heading',  field_label: 'Section Heading', field_type: 'text',     field_options: null, default_value: 'Care Instructions', required: true  },
      { field_name: 'body',     field_label: 'Instructions',    field_type: 'textarea', field_options: null, default_value: '',                  required: true  },
      { field_name: 'urgency',  field_label: 'Priority Level',  field_type: 'radio',    field_options: ['Routine','Important','Urgent'],          default_value: 'Routine', required: false },
    ],
    template: `<h2>{{heading}}</h2>
{{#urgency_not_routine}}<p class="tip"><strong>Priority: {{urgency}}</strong></p>{{/urgency_not_routine}}
<p style="white-space:pre-wrap;">{{body}}</p>`
  },

  {
    id: 10,
    name: 'Medication / Treatment Reminder',
    description: 'Document medications or treatments from this visit',
    category: 'Follow-Up',
    type: 'form',
    icon: '💊',
    sort_order: 4,
    content: null,
    fields: [
      { field_name: 'med_name',     field_label: 'Medication or Treatment', field_type: 'text',     field_options: null, default_value: '', required: true  },
      { field_name: 'dosage',       field_label: 'Dose / Frequency',        field_type: 'text',     field_options: null, default_value: '', required: false },
      { field_name: 'duration',     field_label: 'Duration',                field_type: 'text',     field_options: null, default_value: '', required: false },
      { field_name: 'instructions', field_label: 'Special Instructions',    field_type: 'textarea', field_options: null, default_value: '', required: false },
    ],
    template: `<h2>Medication / Treatment: {{med_name}}</h2>
<table>
  <tbody>
    {{#dosage}}<tr><th style="text-align:left;padding-right:1rem;">Dose / Frequency</th><td>{{dosage}}</td></tr>{{/dosage}}
    {{#duration}}<tr><th style="text-align:left;padding-right:1rem;">Duration</th><td>{{duration}}</td></tr>{{/duration}}
  </tbody>
</table>
{{#instructions}}<p style="white-space:pre-wrap;">{{instructions}}</p>{{/instructions}}`
  },

  {
    id: 11,
    name: 'Referral Information',
    description: 'Document referrals made at this visit',
    category: 'Referrals',
    type: 'form',
    icon: '📋',
    sort_order: 5,
    content: null,
    fields: [
      { field_name: 'referred_to', field_label: 'Referred To',       field_type: 'text',     field_options: null, default_value: '', required: true  },
      { field_name: 'specialty',   field_label: 'Specialty / Reason', field_type: 'select',   field_options: ['ENT / Otolaryngology','Neurology','Vestibular rehab','Speech-Language Pathology','Cochlear implant evaluation','Primary care','Other'], default_value: 'ENT / Otolaryngology', required: false },
      { field_name: 'reason',      field_label: 'Clinical Reason',   field_type: 'textarea', field_options: null, default_value: '', required: false },
      { field_name: 'urgency',     field_label: 'Urgency',           field_type: 'radio',    field_options: ['Routine (within 3 months)','Soon (within 4 weeks)','Urgent (within 1 week)'], default_value: 'Routine (within 3 months)', required: false },
    ],
    template: `<h2>Referral</h2>
<p><strong>Referred to:</strong> {{referred_to}} &mdash; {{specialty}}</p>
<p><strong>Urgency:</strong> {{urgency}}</p>
{{#reason}}<p><strong>Reason:</strong> {{reason}}</p>{{/reason}}`
  },

];
