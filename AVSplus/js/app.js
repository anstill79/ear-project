/* ── AVSplus – main app logic ─────────────────────────────────────────────
   No server. No build step. Resources loaded from js/resources.js.
   Open index.html directly in any browser.
────────────────────────────────────────────────────────────────────────── */

const state = {
  document: [],         // { resource, values, html }
  modalResource: null,
  modalDocIndex: null,
  dragSrcIndex: null,
};

// ── DOM refs ──────────────────────────────────────────────────────────────
const $resourceList = document.getElementById('resource-list');
const $docItems     = document.getElementById('doc-items');
const $emptyState   = document.getElementById('empty-state');
const $docCount     = document.getElementById('doc-count');
const $search       = document.getElementById('search');
const $btnBuild     = document.getElementById('btn-build');
const $btnClear     = document.getElementById('btn-clear');

const $configModal  = document.getElementById('config-modal');
const $modalIcon    = document.getElementById('modal-icon');
const $modalTitle   = document.getElementById('modal-title');
const $modalDesc    = document.getElementById('modal-desc');
const $modalBody    = document.getElementById('modal-body');
const $modalClose   = document.getElementById('modal-close');
const $modalCancel  = document.getElementById('modal-cancel');
const $modalSave    = document.getElementById('modal-save');

const $printModal   = document.getElementById('print-modal');
const $printBody    = document.getElementById('print-body');
const $printClose   = document.getElementById('print-modal-close');
const $printCancel  = document.getElementById('print-cancel');
const $btnPrintNow  = document.getElementById('btn-print-now');

const $toast        = document.getElementById('toast');
const $printable    = document.getElementById('printable');

// ── Bootstrap ─────────────────────────────────────────────────────────────
renderLibrary();
updateDocumentUI();

// ── Render resource library ───────────────────────────────────────────────
function renderLibrary() {
  const query = $search.value.toLowerCase().trim();
  const filtered = query
    ? RESOURCES.filter(r =>
        r.name.toLowerCase().includes(query) ||
        (r.description || '').toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query))
    : RESOURCES;

  // Group by category, preserving definition order within each group
  const groups = {};
  filtered.forEach(r => {
    if (!groups[r.category]) groups[r.category] = [];
    groups[r.category].push(r);
  });

  const inDoc = new Set(state.document.map(d => d.resource.id));

  let html = '';
  for (const [cat, items] of Object.entries(groups)) {
    html += `<div class="category-group">
      <div class="category-label">${esc(cat)}</div>`;
    items.forEach(r => {
      const dimmed = inDoc.has(r.id) ? ' in-doc' : '';
      html += `
        <div class="resource-item${dimmed}" data-id="${r.id}" role="button" tabindex="0"
             aria-label="Add ${esc(r.name)}">
          <span class="resource-icon">${r.icon}</span>
          <div class="resource-info">
            <div class="resource-name">${esc(r.name)}</div>
            <div class="resource-desc">${esc(r.description || '')}</div>
          </div>
          <span class="resource-badge badge-${r.type}">${r.type === 'form' ? 'Form' : 'Static'}</span>
          <button class="add-btn" tabindex="-1" aria-hidden="true">+</button>
        </div>`;
    });
    html += `</div>`;
  }

  if (!html) {
    html = `<div style="padding:20px;color:var(--c-muted);text-align:center;">No resources match your search.</div>`;
  }

  $resourceList.innerHTML = html;

  $resourceList.querySelectorAll('.resource-item').forEach(el => {
    el.addEventListener('click', () => handleResourceClick(parseInt(el.dataset.id)));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') handleResourceClick(parseInt(el.dataset.id));
    });
  });
}

$search.addEventListener('input', renderLibrary);

// ── Handle adding a resource ──────────────────────────────────────────────
function handleResourceClick(id) {
  const resource = RESOURCES.find(r => r.id === id);
  if (!resource) return;

  if (resource.type === 'static') {
    addToDocument(resource, {}, resource.content);
  } else {
    openConfigModal(resource, null, null);
  }
}

// ── Document management ───────────────────────────────────────────────────
function addToDocument(resource, values, html) {
  state.document.push({ resource, values, html });
  updateDocumentUI();
  toast(`"${resource.name}" added`);
}

function removeFromDocument(index) {
  state.document.splice(index, 1);
  updateDocumentUI();
}

function moveItem(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= state.document.length) return;
  [state.document[index], state.document[newIndex]] = [state.document[newIndex], state.document[index]];
  updateDocumentUI();
}

function updateDocumentUI() {
  const items = state.document;
  $docCount.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
  $btnBuild.disabled = items.length === 0;
  $emptyState.style.display = items.length === 0 ? '' : 'none';

  $docItems.querySelectorAll('.doc-item').forEach(el => el.remove());
  items.forEach((item, idx) => $docItems.appendChild(buildDocItemEl(item, idx)));

  renderLibrary();
}

function buildDocItemEl({ resource, values }, idx) {
  const div = document.createElement('div');
  div.className = 'doc-item';
  div.dataset.index = idx;
  div.draggable = true;

  div.innerHTML = `
    <div class="doc-item-header">
      <span class="drag-handle" title="Drag to reorder">⠿</span>
      <span class="doc-item-icon">${resource.icon}</span>
      <span class="doc-item-name">${esc(resource.name)}</span>
      <div class="doc-item-actions">
        ${resource.type === 'form' ? `<button class="btn-icon btn-edit" data-idx="${idx}">✏️ Edit</button>` : ''}
        <button class="btn-icon" data-move="-1" data-idx="${idx}" title="Move up">↑</button>
        <button class="btn-icon" data-move="1"  data-idx="${idx}" title="Move down">↓</button>
        <button class="btn-icon btn-remove" data-idx="${idx}" title="Remove">✕</button>
      </div>
    </div>
    <div class="doc-item-status ${resource.type === 'form' ? 'configured' : ''}">
      ${resource.type === 'form' ? '✓ Configured' : 'Static content'}
    </div>`;

  div.querySelector('.btn-remove').addEventListener('click', () => removeFromDocument(idx));
  div.querySelectorAll('[data-move]').forEach(btn =>
    btn.addEventListener('click', () => moveItem(idx, parseInt(btn.dataset.move))));
  div.querySelector('.btn-edit')?.addEventListener('click', () =>
    openConfigModal(resource, values, idx));

  // Drag-and-drop reordering
  div.addEventListener('dragstart', e => {
    state.dragSrcIndex = idx;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => div.style.opacity = '.4', 0);
  });
  div.addEventListener('dragend',  () => { div.style.opacity = ''; });
  div.addEventListener('dragover', e => { e.preventDefault(); div.classList.add('drag-over'); });
  div.addEventListener('dragleave',() => div.classList.remove('drag-over'));
  div.addEventListener('drop', e => {
    e.preventDefault();
    div.classList.remove('drag-over');
    const src = state.dragSrcIndex;
    if (src === null || src === idx) return;
    const [removed] = state.document.splice(src, 1);
    state.document.splice(idx, 0, removed);
    state.dragSrcIndex = null;
    updateDocumentUI();
  });

  return div;
}

$btnClear.addEventListener('click', () => {
  if (!state.document.length) return;
  if (!confirm('Clear all items from the document?')) return;
  state.document = [];
  updateDocumentUI();
});

// ── Configure modal ───────────────────────────────────────────────────────
function openConfigModal(resource, existingValues, docIndex) {
  state.modalResource = resource;
  state.modalDocIndex = docIndex;

  $modalIcon.textContent  = resource.icon;
  $modalTitle.textContent = resource.name;
  $modalDesc.textContent  = resource.description || '';
  $modalSave.textContent  = docIndex !== null ? '✓ Update' : '+ Add to Document';

  $modalBody.innerHTML = renderFormFields(resource.fields, existingValues || {});
  $configModal.classList.add('open');

  const first = $modalBody.querySelector('input, select, textarea');
  if (first) setTimeout(() => first.focus(), 50);
}

function closeConfigModal() {
  $configModal.classList.remove('open');
  state.modalResource = null;
  state.modalDocIndex = null;
}

$modalClose.addEventListener('click', closeConfigModal);
$modalCancel.addEventListener('click', closeConfigModal);
$configModal.addEventListener('click', e => { if (e.target === $configModal) closeConfigModal(); });

$modalSave.addEventListener('click', () => {
  const resource = state.modalResource;
  if (!resource) return;

  const values = collectFormValues($modalBody, resource.fields);

  const missing = resource.fields.filter(f => f.required && !values[f.field_name]?.trim());
  if (missing.length) {
    toast(`Please fill in: ${missing.map(f => f.field_label).join(', ')}`, true);
    return;
  }

  const html = renderTemplate(resource.template, values);

  if (state.modalDocIndex !== null) {
    state.document[state.modalDocIndex] = { resource, values, html };
    updateDocumentUI();
    toast(`"${resource.name}" updated`);
  } else {
    addToDocument(resource, values, html);
  }

  closeConfigModal();
});

// ── Form field rendering ──────────────────────────────────────────────────
function renderFormFields(fields, defaults) {
  return fields.map(f => {
    const val = defaults[f.field_name] ?? f.default_value ?? '';
    let input = '';

    if (f.field_type === 'textarea') {
      input = `<textarea name="${f.field_name}" rows="4"${f.required ? ' required' : ''}>${esc(val)}</textarea>`;

    } else if (f.field_type === 'select') {
      const opts = (f.field_options || []).map(o =>
        `<option value="${esc(o)}"${o === val ? ' selected' : ''}>${esc(o)}</option>`
      ).join('');
      input = `<select name="${f.field_name}"${f.required ? ' required' : ''}>${opts}</select>`;

    } else if (f.field_type === 'radio') {
      const opts = (f.field_options || []).map(o => `
        <label class="radio-option">
          <input type="radio" name="${f.field_name}" value="${esc(o)}"${o === val ? ' checked' : ''}>
          ${esc(o)}
        </label>`).join('');
      input = `<div class="radio-group">${opts}</div>`;

    } else {
      // text, date, number, checkbox
      input = `<input type="${f.field_type}" name="${f.field_name}" value="${esc(val)}"${f.required ? ' required' : ''} />`;
    }

    const label = f.field_type !== 'checkbox'
      ? `<label>${esc(f.field_label)}${f.required ? ' <span class="req">*</span>' : ''}</label>`
      : '';

    return `<div class="field-group">${label}${input}</div>`;
  }).join('');
}

function collectFormValues(container, fields) {
  const values = {};
  fields.forEach(f => {
    if (f.field_type === 'radio') {
      const checked = container.querySelector(`input[name="${f.field_name}"]:checked`);
      values[f.field_name] = checked ? checked.value : '';
    } else if (f.field_type === 'checkbox') {
      values[f.field_name] = container.querySelector(`input[name="${f.field_name}"]`)?.checked ? 'true' : '';
    } else {
      values[f.field_name] = container.querySelector(`[name="${f.field_name}"]`)?.value ?? '';
    }
  });
  return values;
}

// ── Template renderer ─────────────────────────────────────────────────────
// Supports: {{var}}, {{#var}}...{{/var}}, {{#var_not_X}}...{{/var_not_X}},
//           {{#each var_lines}}...{{/each}}
function renderTemplate(template, values) {
  let out = template;

  // {{#each varname_lines}} ... {{/each}} — split value on newlines
  out = out.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, key, body) => {
    const lines = (values[key] || '').split('\n').map(l => l.trim()).filter(Boolean);
    return lines.map(line => body.replace(/\{\{this\}\}/g, esc(line))).join('');
  });

  // {{#var_not_X}} ... {{/var_not_X}}
  out = out.replace(/\{\{#(\w+)_not_(\w+)\}\}([\s\S]*?)\{\{\/\1_not_\2\}\}/g, (_, key, notVal, body) => {
    const val = (values[key] || '').trim();
    return val && val.toLowerCase() !== notVal.toLowerCase() ? body : '';
  });

  // {{#var}} ... {{/var}} — conditional block
  out = out.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, key, body) =>
    values[key] ? body : '');

  // {{var}} — interpolation
  out = out.replace(/\{\{(\w+)\}\}/g, (_, key) => esc(values[key] || ''));

  return out;
}

// ── Build & Print ─────────────────────────────────────────────────────────
$btnBuild.addEventListener('click', buildDocument);

function buildDocument() {
  const sections = state.document.map(({ html }) =>
    `<section class="avs-section">${html}</section>`
  ).join('\n<hr class="section-divider">\n');

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const fullDoc = `
    <div class="print-page">
      <div class="avs-header">
        <div style="display:flex;align-items:center;gap:12px;">
          <div>
            <div style="font-size:22px;font-weight:800;color:#2563eb;">AVSplus</div>
            <div style="font-size:11px;color:#64748b;">After Visit Summary</div>
          </div>
          <div style="margin-left:auto;font-size:12px;color:#64748b;text-align:right;">
            Date: <strong>${date}</strong>
          </div>
        </div>
      </div>
      ${sections}
    </div>`;

  $printBody.innerHTML = fullDoc;
  $printable.innerHTML = fullDoc;
  $printModal.classList.add('open');
}

$printClose.addEventListener('click', () => $printModal.classList.remove('open'));
$printCancel.addEventListener('click', () => $printModal.classList.remove('open'));
$printModal.addEventListener('click', e => { if (e.target === $printModal) $printModal.classList.remove('open'); });

$btnPrintNow.addEventListener('click', () => {
  const style = document.createElement('style');
  style.id = '__avsprint';
  style.textContent = `
    @media print {
      body > *:not(#printable) { display: none !important; }
      #printable { display: block !important; }
    }`;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => style.remove(), 1500);
});

// ── Utilities ─────────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let toastTimer;
function toast(msg, isError = false) {
  clearTimeout(toastTimer);
  $toast.textContent = msg;
  $toast.style.background = isError ? '#dc2626' : '#1e293b';
  $toast.classList.add('show');
  toastTimer = setTimeout(() => $toast.classList.remove('show'), 3000);
}
