const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'avsplus.db');

function initDb() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('static', 'form')),
      content TEXT,
      sort_order INTEGER DEFAULT 0,
      icon TEXT DEFAULT '📄'
    );

    CREATE TABLE IF NOT EXISTS resource_fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
      field_name TEXT NOT NULL,
      field_label TEXT NOT NULL,
      field_type TEXT NOT NULL CHECK(field_type IN ('text','textarea','select','number','date','checkbox','radio')),
      field_options TEXT,
      default_value TEXT,
      required INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS resource_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
      template TEXT NOT NULL
    );
  `);

  seed(db);
  return db;
}

function seed(db) {
  const count = db.prepare('SELECT COUNT(*) as c FROM resources').get().c;
  if (count > 0) return;

  const insertResource = db.prepare(`
    INSERT INTO resources (name, description, category, type, content, sort_order, icon)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertField = db.prepare(`
    INSERT INTO resource_fields (resource_id, field_name, field_label, field_type, field_options, default_value, required, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertTemplate = db.prepare(`
    INSERT INTO resource_templates (resource_id, template) VALUES (?, ?)
  `);

  const seedData = db.transaction(() => {

    // ── STATIC RESOURCES ──────────────────────────────────────────────────────

    const r1 = insertResource.run(
      'Hearing Aid Care & Maintenance',
      'Daily care tips and cleaning instructions for hearing aids',
      'Hearing Aids', 'static',
      `<h2>Hearing Aid Care &amp; Maintenance</h2>
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
<p class="tip"><strong>Tip:</strong> A hearing aid dehumidifier or drying kit used overnight can significantly reduce moisture-related repairs.</p>`,
      10, '🦻'
    );

    const r2 = insertResource.run(
      'Battery Safety & Replacement',
      'Guide to hearing aid battery types, replacement, and safe disposal',
      'Hearing Aids', 'static',
      `<h2>Battery Safety &amp; Replacement</h2>

<h3>Battery Sizes</h3>
<p>Hearing aid batteries come in four standard sizes, color-coded for easy identification:</p>
<table>
  <thead><tr><th>Size</th><th>Color</th><th>Typical Life</th></tr></thead>
  <tbody>
    <tr><td>10</td><td style="background:#fbbf24;padding:2px 8px;">Yellow</td><td>3–7 days</td></tr>
    <tr><td>312</td><td style="background:#a78bfa;padding:2px 8px;color:#fff;">Brown</td><td>5–10 days</td></tr>
    <tr><td>13</td><td style="background:#f87171;padding:2px 8px;">Orange</td><td>6–14 days</td></tr>
    <tr><td>675</td><td style="background:#60a5fa;padding:2px 8px;color:#fff;">Blue</td><td>9–20 days</td></tr>
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
<p class="tip"><strong>Important:</strong> Hearing aid batteries contain zinc and must not be placed in household trash. Drop used batteries at our office or any electronics recycling location.</p>`,
      20, '🔋'
    );

    const r3 = insertResource.run(
      'Communication Strategies',
      'Tips to improve communication for hearing aid users and their families',
      'Communication', 'static',
      `<h2>Communication Strategies</h2>
<p>Hearing aids are a powerful tool, but effective communication involves both the listener <em>and</em> the speaker. The following strategies can make a significant difference.</p>

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
<p>Ask your audiologist about features such as directional microphones, Bluetooth streaming, or remote microphones (e.g., Roger Pen, TV Connector) that can dramatically improve hearing in challenging situations.</p>`,
      30, '💬'
    );

    const r4 = insertResource.run(
      'Tinnitus Management Overview',
      'Overview of tinnitus, coping strategies, and sound therapy',
      'Tinnitus', 'static',
      `<h2>Tinnitus Management Overview</h2>
<p>Tinnitus is the perception of sound (ringing, buzzing, humming) without an external source. It is very common and, while not a disease itself, can significantly affect quality of life. The following approaches have been shown to help.</p>

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

<h3>When to Follow Up</h3>
<p class="tip">Contact us if your tinnitus suddenly worsens, becomes one-sided, or is accompanied by dizziness or hearing changes.</p>`,
      40, '🔔'
    );

    const r5 = insertResource.run(
      'Understanding Your Audiogram',
      'Plain-language explanation of what an audiogram shows and how to read it',
      'Education', 'static',
      `<h2>Understanding Your Audiogram</h2>
<p>An audiogram is a graph that shows how well you hear different pitches (frequencies) at different volume levels.</p>

<figure style="text-align:center;margin:1rem 0;">
  <svg viewBox="0 0 480 300" width="480" height="300" style="max-width:100%;border:1px solid #ccc;background:#fff;font-family:sans-serif;font-size:11px;">
    <!-- Grid -->
    <line x1="60" y1="20" x2="60" y2="260" stroke="#ddd"/>
    <line x1="120" y1="20" x2="120" y2="260" stroke="#ddd"/>
    <line x1="180" y1="20" x2="180" y2="260" stroke="#ddd"/>
    <line x1="240" y1="20" x2="240" y2="260" stroke="#ddd"/>
    <line x1="300" y1="20" x2="300" y2="260" stroke="#ddd"/>
    <line x1="360" y1="20" x2="360" y2="260" stroke="#ddd"/>
    <line x1="420" y1="20" x2="420" y2="260" stroke="#ddd"/>
    <line x1="60" y1="20" x2="460" y2="20" stroke="#ddd"/>
    <line x1="60" y1="60" x2="460" y2="60" stroke="#ddd"/>
    <line x1="60" y1="100" x2="460" y2="100" stroke="#ddd"/>
    <line x1="60" y1="140" x2="460" y2="140" stroke="#ddd"/>
    <line x1="60" y1="180" x2="460" y2="180" stroke="#ddd"/>
    <line x1="60" y1="220" x2="460" y2="220" stroke="#ddd"/>
    <line x1="60" y1="260" x2="460" y2="260" stroke="#ddd"/>
    <!-- Axes -->
    <line x1="60" y1="20" x2="60" y2="265" stroke="#333" stroke-width="2"/>
    <line x1="55" y1="260" x2="465" y2="260" stroke="#333" stroke-width="2"/>
    <!-- Y labels (dB HL) -->
    <text x="50" y="24" text-anchor="end">-10</text>
    <text x="50" y="64" text-anchor="end">10</text>
    <text x="50" y="104" text-anchor="end">30</text>
    <text x="50" y="144" text-anchor="end">50</text>
    <text x="50" y="184" text-anchor="end">70</text>
    <text x="50" y="224" text-anchor="end">90</text>
    <text x="50" y="264" text-anchor="end">110</text>
    <!-- X labels (Hz) -->
    <text x="60" y="278" text-anchor="middle">250</text>
    <text x="120" y="278" text-anchor="middle">500</text>
    <text x="180" y="278" text-anchor="middle">1k</text>
    <text x="240" y="278" text-anchor="middle">2k</text>
    <text x="300" y="278" text-anchor="middle">3k</text>
    <text x="360" y="278" text-anchor="middle">4k</text>
    <text x="420" y="278" text-anchor="middle">8k</text>
    <!-- Axis labels -->
    <text x="10" y="145" transform="rotate(-90,10,145)" text-anchor="middle" font-size="10">dB HL</text>
    <text x="260" y="295" text-anchor="middle" font-size="10">Frequency (Hz)</text>
    <!-- Shading: normal region -->
    <rect x="60" y="20" width="400" height="60" fill="#d1fae5" opacity="0.5"/>
    <text x="462" y="52" font-size="9" fill="#065f46">Normal</text>
    <!-- Right ear (O) -->
    <polyline points="60,80 120,90 180,110 240,130 300,150 360,160 420,170" fill="none" stroke="#3b82f6" stroke-width="2"/>
    <text x="60" y="77" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="120" y="87" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="180" y="107" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="240" y="127" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="300" y="147" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="360" y="157" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <text x="420" y="167" text-anchor="middle" fill="#3b82f6" font-size="13">O</text>
    <!-- Left ear (X) -->
    <polyline points="60,85 120,95 180,120 240,145 300,160 360,175 420,185" fill="none" stroke="#ef4444" stroke-width="2"/>
    <text x="60" y="82" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="120" y="92" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="180" y="117" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="240" y="142" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="300" y="157" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="360" y="172" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <text x="420" y="182" text-anchor="middle" fill="#ef4444" font-size="13">X</text>
    <!-- Legend -->
    <text x="100" y="295" fill="#3b82f6" font-size="10">O = Right Ear</text>
    <text x="250" y="295" fill="#ef4444" font-size="10">X = Left Ear</text>
  </svg>
  <figcaption style="font-size:0.85em;color:#666;">Sample audiogram showing mild-to-moderate sloping hearing loss</figcaption>
</figure>

<h3>How to Read It</h3>
<ul>
  <li><strong>Across the top (left → right):</strong> Frequency (pitch) in Hertz — low pitches on the left, high pitches on the right. Conversational speech occupies 500–4,000 Hz.</li>
  <li><strong>Down the side (top → bottom):</strong> Loudness in decibels (dB HL) — quieter sounds at the top, louder sounds at the bottom.</li>
  <li><strong>Each symbol</strong> shows the softest sound you could hear at that frequency during testing.</li>
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
</table>`,
      50, '📊'
    );

    const r6 = insertResource.run(
      'Noise Protection Guidelines',
      'Safe listening levels and hearing protection recommendations',
      'Education', 'static',
      `<h2>Noise Protection Guidelines</h2>
<p>Noise-induced hearing loss (NIHL) is permanent but 100% preventable. The risk depends on both <em>how loud</em> and <em>how long</em> you are exposed.</p>

<h3>Safe Exposure Levels (NIOSH Guidelines)</h3>
<table>
  <thead><tr><th>Sound Level</th><th>Example</th><th>Safe Duration / Day</th></tr></thead>
  <tbody>
    <tr><td>85 dB</td><td>Heavy traffic, lawnmower</td><td>8 hours</td></tr>
    <tr><td>88 dB</td><td>Motorcycle</td><td>4 hours</td></tr>
    <tr><td>91 dB</td><td>Shop tools</td><td>2 hours</td></tr>
    <tr><td>94 dB</td><td>Nightclub music</td><td>1 hour</td></tr>
    <tr><td>97 dB</td><td>Power saw</td><td>30 minutes</td></tr>
    <tr><td>100 dB</td><td>Jackhammer, concert</td><td>15 minutes</td></tr>
    <tr><td>110+ dB</td><td>Firearm, jet engine</td><td>&lt;2 minutes</td></tr>
  </tbody>
</table>

<h3>Types of Hearing Protection</h3>
<ul>
  <li><strong>Foam earplugs (NRR 29–33):</strong> Inexpensive, effective for most industrial and recreational noise.</li>
  <li><strong>Earmuffs (NRR 20–30):</strong> Easy to put on/remove; good for intermittent noise.</li>
  <li><strong>Custom earplugs:</strong> Molded to your ear for comfort and all-day wear — ask us about a referral.</li>
  <li><strong>Musician's earplugs:</strong> Reduce volume evenly across frequencies, preserving sound quality.</li>
</ul>

<h3>Day-to-Day Tips</h3>
<ul>
  <li>Follow the "60/60 rule" for personal audio: no more than 60% volume for no more than 60 minutes at a time.</li>
  <li>Distance matters — doubling your distance from a loud source reduces sound intensity by 6 dB.</li>
  <li>Allow your ears 18+ hours of quiet recovery after loud noise exposure.</li>
</ul>
<p class="tip"><strong>Remember:</strong> Once noise-induced hearing loss occurs, it cannot be reversed. Protect what you have.</p>`,
      60, '🛡️'
    );

    // ── FORM-BASED RESOURCES ──────────────────────────────────────────────────

    const r7id = insertResource.run(
      'Hearing Aid Fitting Summary',
      'Document the hearing aid(s) fit today including model, style, and program information',
      'Hearing Aids', 'form', null, 1, '⚙️'
    ).lastInsertRowid;

    const haFields = [
      ['patient_name',    'Patient Name',              'text',     null,                              '',          1, 1],
      ['fit_date',        'Fitting Date',               'date',     null,                              '',          1, 2],
      ['right_model',     'Right Ear — Model',          'text',     null,                              '',          0, 3],
      ['right_style',     'Right Ear — Style',          'select',   '["RIC/RITE","BTE","ITE","ITC","CIC","IIC","N/A"]', 'RIC/RITE', 0, 4],
      ['left_model',      'Left Ear — Model',           'text',     null,                              '',          0, 5],
      ['left_style',      'Left Ear — Style',           'select',   '["RIC/RITE","BTE","ITE","ITC","CIC","IIC","N/A"]', 'RIC/RITE', 0, 6],
      ['programs',        'Programs Loaded',            'textarea', null, 'Program 1: Everyday\nProgram 2: Noise\nProgram 3: Music', 0, 7],
      ['volume_default',  'Default Volume Setting',     'select',   '["Lowest","Low","Mid-Low","Mid","Mid-High","High","Highest"]', 'Mid', 0, 8],
      ['dome_type',       'Dome / Coupling Type',       'select',   '["Open dome","Closed dome","Power dome","Custom earmold","Slim tube","N/A"]', 'Open dome', 0, 9],
      ['app_name',        'Companion App (if any)',     'text',     null,                              '',          0, 10],
      ['next_steps',      'Next Steps / Notes',         'textarea', null,                              '',          0, 11],
    ];
    haFields.forEach(f => insertField.run(r7id, ...f));

    insertTemplate.run(r7id, `<h2>Hearing Aid Fitting Summary</h2>
<p><strong>Patient:</strong> {{patient_name}}&emsp;<strong>Date:</strong> {{fit_date}}</p>
<table>
  <thead><tr><th>Ear</th><th>Model</th><th>Style</th><th>Dome/Coupling</th></tr></thead>
  <tbody>
    <tr><td>Right (O)</td><td>{{right_model}}</td><td>{{right_style}}</td><td rowspan="2">{{dome_type}}</td></tr>
    <tr><td>Left (X)</td><td>{{left_model}}</td><td>{{left_style}}</td></tr>
  </tbody>
</table>
<h3>Programs</h3>
<pre style="white-space:pre-wrap;font-family:inherit;">{{programs}}</pre>
<p><strong>Default Volume:</strong> {{volume_default}}</p>
{{#app_name}}<p><strong>Companion App:</strong> {{app_name}}</p>{{/app_name}}
{{#next_steps}}<h3>Next Steps</h3><p style="white-space:pre-wrap;">{{next_steps}}</p>{{/next_steps}}`);

    const r8id = insertResource.run(
      'Follow-Up Schedule',
      'Set upcoming appointment dates and recommended check-in timeline',
      'Follow-Up', 'form', null, 2, '📅'
    ).lastInsertRowid;

    const fuFields = [
      ['next_appt',       'Next Appointment Date',     'date',     null,  '', 0, 1],
      ['next_appt_type',  'Appointment Type',          'select',   '["Hearing aid follow-up","Re-evaluation","Annual audiogram","Cerumen management","Tinnitus follow-up","Other"]', 'Hearing aid follow-up', 0, 2],
      ['appt_notes',      'Appointment Notes',         'textarea', null,  '', 0, 3],
      ['call_if',         'Call Us If…',               'textarea', null,  'Your hearing aids are not working as expected\nYou experience sudden changes in hearing\nYou have questions about your devices', 0, 4],
    ];
    fuFields.forEach(f => insertField.run(r8id, ...f));

    insertTemplate.run(r8id, `<h2>Follow-Up Schedule</h2>
{{#next_appt}}<p><strong>Next Appointment:</strong> {{next_appt}} &mdash; {{next_appt_type}}</p>{{/next_appt}}
{{#appt_notes}}<p>{{appt_notes}}</p>{{/appt_notes}}
<h3>Please Contact Our Office If:</h3>
<ul>{{#each call_if_lines}}<li>{{this}}</li>{{/each}}</ul>`);

    const r9id = insertResource.run(
      'Custom Care Instructions',
      'Enter personalized care instructions for this patient',
      'Follow-Up', 'form', null, 3, '✏️'
    ).lastInsertRowid;

    const ciFields = [
      ['heading',    'Section Heading',    'text',     null,  'Care Instructions', 1, 1],
      ['body',       'Instructions',       'textarea', null,  '', 1, 2],
      ['urgency',    'Priority Level',     'radio',    '["Routine","Important","Urgent"]', 'Routine', 0, 3],
    ];
    ciFields.forEach(f => insertField.run(r9id, ...f));

    insertTemplate.run(r9id, `<h2>{{heading}}</h2>
{{#urgency_not_routine}}<p class="tip"><strong>Priority: {{urgency}}</strong></p>{{/urgency_not_routine}}
<p style="white-space:pre-wrap;">{{body}}</p>`);

    const r10id = insertResource.run(
      'Medication / Treatment Reminder',
      'Document medications or treatments prescribed or recommended at this visit',
      'Follow-Up', 'form', null, 4, '💊'
    ).lastInsertRowid;

    const medFields = [
      ['med_name',    'Medication or Treatment Name', 'text',     null,  '', 1, 1],
      ['dosage',      'Dose / Frequency',             'text',     null,  '', 0, 2],
      ['duration',    'Duration',                     'text',     null,  '', 0, 3],
      ['instructions','Special Instructions',         'textarea', null,  '', 0, 4],
    ];
    medFields.forEach(f => insertField.run(r10id, ...f));

    insertTemplate.run(r10id, `<h2>Medication / Treatment: {{med_name}}</h2>
<table>
  <tbody>
    {{#dosage}}<tr><th style="text-align:left;padding-right:1rem;">Dose / Frequency</th><td>{{dosage}}</td></tr>{{/dosage}}
    {{#duration}}<tr><th style="text-align:left;padding-right:1rem;">Duration</th><td>{{duration}}</td></tr>{{/duration}}
  </tbody>
</table>
{{#instructions}}<p style="white-space:pre-wrap;">{{instructions}}</p>{{/instructions}}`);

    const r11id = insertResource.run(
      'Referral Information',
      'Document referrals made at this visit',
      'Referrals', 'form', null, 5, '📋'
    ).lastInsertRowid;

    const refFields = [
      ['referred_to',  'Referred To',           'text',     null,  '', 1, 1],
      ['specialty',    'Specialty / Reason',     'select',   '["ENT / Otolaryngology","Neurology","Vestibular rehab","Speech-Language Pathology","Cochlear implant evaluation","Primary care","Other"]', 'ENT / Otolaryngology', 0, 2],
      ['reason',       'Clinical Reason',        'textarea', null,  '', 0, 3],
      ['urgency',      'Urgency',                'radio',    '["Routine (within 3 months)","Soon (within 4 weeks)","Urgent (within 1 week)"]', 'Routine (within 3 months)', 0, 4],
    ];
    refFields.forEach(f => insertField.run(r11id, ...f));

    insertTemplate.run(r11id, `<h2>Referral</h2>
<p><strong>Referred to:</strong> {{referred_to}} &mdash; {{specialty}}</p>
<p><strong>Urgency:</strong> {{urgency}}</p>
{{#reason}}<p><strong>Reason:</strong> {{reason}}</p>{{/reason}}`);

  });

  seedData();
}

module.exports = { initDb };
