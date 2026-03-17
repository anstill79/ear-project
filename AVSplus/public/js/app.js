/* ── AVSplus – main app logic ─────────────────────────────────────────────
   No build step. Vanilla JS (ES2022). Served by Express.
───────────────────────────────────────────────────────────────────────────── */

const state = {
  resources: [],        // all resources from API
  document: [],         // { resource, values, html } ordered list
  modalResource: null,  // resource being configured
  modalDocIndex: null,  // if editing existing doc item
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
(async function init() {
  try {
    const res = await fetch('/api/resources');
    state.resources = await res.json();
    renderLibrary(state.resources);
  } catch (e) {
    $resourceList.innerHTML = `<div style="padding:20px;color:#dc2626;">Failed to load resources: ${e.message}</div>`;
  }
})();

// ── Render resource library ───────────────────────────────────────────────
function renderLibrary(resources) {
  const query = $search.value.toLowerCase().trim();
  const filtered = query
    ? resources.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query))
    : resources;

  // Group by category
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
      const inDocClass = inDoc.has(r.id) ? ' in-doc' : '';
      html += `
        <div class="resource-item${inDocClass}" data-id="${r.id}" role="button" tabindex="0"
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

  // Events
  $resourceList.querySelectorAll('.resource-item').forEach(el => {
    el.addEventListener('click', () => handleResourceClick(parseInt(el.dataset.id)));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') handleResourceClick(parseInt(el.dataset.id));
    });
  });
}

$search.addEventListener('input', () => renderLibrary(state.resources));

// ── Handle adding a resource ──────────────────────────────────────────────
async function handleResourceClick(id) {
  const resource = state.resources.find(r => r.id === id);
  if (!resource) return;

  if (resource.type === 'static') {
    // Fetch full content on demand
    const data = await apiFetch(`/api/resources/${id}`);
    addToDocument(resource, {}, data.content);
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
  const tmp = state.document[index];
  state.document[index] = state.document[newIndex];
  state.document[newIndex] = tmp;
  updateDocumentUI();
}

function updateDocumentUI() {
  const items = state.document;
  $docCount.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
  $btnBuild.disabled = items.length === 0;
  $emptyState.style.display = items.length === 0 ? '' : 'none';

  // Re-render doc items
  const existing = $docItems.querySelectorAll('.doc-item');
  existing.forEach(el => el.remove());

  items.forEach((item, idx) => {
    const el = buildDocItemEl(item, idx);
    $docItems.appendChild(el);
  });

  // Refresh library to grey out already-added static items (optional)
  renderLibrary(state.resources);
}

function buildDocItemEl({ resource, values, html }, idx) {
  const div = document.createElement('div');
  div.className = 'doc-item';
  div.dataset.index = idx;
  div.draggable = true;

  const isConfigured = resource.type === 'form';
  const statusText = isConfigured
    ? '✓ Configured'
    : 'Static content';

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
    <div class="doc-item-status ${isConfigured ? 'configured' : ''}">${statusText}</div>`;

  // Button events
  div.querySelector('.btn-remove').addEventListener('click', () => removeFromDocument(idx));
  div.querySelectorAll('[data-move]').forEach(btn => {
    btn.addEventListener('click', () => moveItem(idx, parseInt(btn.dataset.move)));
  });
  const editBtn = div.querySelector('.btn-edit');
  if (editBtn) {
    editBtn.addEventListener('click', () => openConfigModal(resource, values, idx));
  }

  // Drag-and-drop
  div.addEventListener('dragstart', e => {
    state.dragSrcIndex = idx;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => div.style.opacity = '.4', 0);
  });
  div.addEventListener('dragend', () => { div.style.opacity = ''; });
  div.addEventListener('dragover', e => {
    e.preventDefault();
    div.classList.add('drag-over');
  });
  div.addEventListener('dragleave', () => div.classList.remove('drag-over'));
  div.addEventListener('drop', e => {
    e.preventDefault();
    div.classList.remove('drag-over');
    const src = state.dragSrcIndex;
    const dest = idx;
    if (src === null || src === dest) return;
    const [removed] = state.document.splice(src, 1);
    state.document.splice(dest, 0, removed);
    state.dragSrcIndex = null;
    updateDocumentUI();
  });

  return div;
}

$btnClear.addEventListener('click', () => {
  if (state.document.length === 0) return;
  if (!confirm('Clear all items from the document?')) return;
  state.document = [];
  updateDocumentUI();
});

// ── Configure modal ───────────────────────────────────────────────────────
async function openConfigModal(resource, existingValues, docIndex) {
  const data = await apiFetch(`/api/resources/${resource.id}`);
  state.modalResource = data;
  state.modalDocIndex = docIndex;

  $modalIcon.textContent = resource.icon;
  $modalTitle.textContent = resource.name;
  $modalDesc.textContent = resource.description || '';
  $modalSave.textContent = docIndex !== null ? '✓ Update' : '+ Add to Document';

  $modalBody.innerHTML = renderFormFields(data.fields, existingValues || {});

  // Attach radio button listeners (for real-time preview if needed)
  $configModal.classList.add('open');
  // Focus first input
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

$modalSave.addEventListener('click', async () => {
  const resource = state.modalResource;
  if (!resource) return;

  const values = collectFormValues($modalBody, resource.fields);

  // Validate required fields
  const missing = resource.fields.filter(f => f.required && !values[f.field_name]?.trim());
  if (missing.length) {
    toast(`Please fill in: ${missing.map(f => f.field_label).join(', ')}`, true);
    return;
  }

  // Render via API
  const { html } = await apiFetch('/api/render', 'POST', { resource_id: resource.id, values });

  if (state.modalDocIndex !== null) {
    state.document[state.modalDocIndex] = { resource, values, html };
    updateDocumentUI();
    toast(`"${resource.name}" updated`);
  } else {
    addToDocument(resource, values, html);
  }

  closeConfigModal();
});

function renderFormFields(fields, defaults) {
  return fields.map(f => {
    const val = defaults[f.field_name] ?? f.default_value ?? '';
    let input = '';

    if (f.field_type === 'textarea') {
      input = `<textarea name="${f.field_name}" rows="4" ${f.required ? 'required' : ''}>${esc(val)}</textarea>`;

    } else if (f.field_type === 'select') {
      const opts = (f.field_options || []).map(o =>
        `<option value="${esc(o)}" ${o === val ? 'selected' : ''}>${esc(o)}</option>`
      ).join('');
      input = `<select name="${f.field_name}" ${f.required ? 'required' : ''}>${opts}</select>`;

    } else if (f.field_type === 'radio') {
      const opts = (f.field_options || []).map((o, i) => `
        <label class="radio-option">
          <input type="radio" name="${f.field_name}" value="${esc(o)}" ${o === val ? 'checked' : ''}>
          ${esc(o)}
        </label>`).join('');
      input = `<div class="radio-group">${opts}</div>`;

    } else if (f.field_type === 'checkbox') {
      input = `<label class="radio-option">
        <input type="checkbox" name="${f.field_name}" ${val ? 'checked' : ''}> ${esc(f.field_label)}
      </label>`;

    } else {
      input = `<input type="${f.field_type}" name="${f.field_name}" value="${esc(val)}" ${f.required ? 'required' : ''} />`;
    }

    const labelHtml = f.field_type !== 'checkbox'
      ? `<label for="${f.field_name}">${esc(f.field_label)}${f.required ? ' <span class="req">*</span>' : ''}</label>`
      : '';

    return `<div class="field-group">${labelHtml}${input}</div>`;
  }).join('');
}

function collectFormValues(container, fields) {
  const values = {};
  fields.forEach(f => {
    if (f.field_type === 'radio') {
      const checked = container.querySelector(`input[name="${f.field_name}"]:checked`);
      values[f.field_name] = checked ? checked.value : '';
    } else if (f.field_type === 'checkbox') {
      const el = container.querySelector(`input[name="${f.field_name}"]`);
      values[f.field_name] = el?.checked ? 'true' : '';
    } else {
      const el = container.querySelector(`[name="${f.field_name}"]`);
      values[f.field_name] = el ? el.value : '';
    }
  });
  return values;
}

// ── Build & Print ─────────────────────────────────────────────────────────
$btnBuild.addEventListener('click', buildDocument);

function buildDocument() {
  const sections = state.document.map(({ html }) => `
    <section class="avs-section">${html}</section>`
  ).join('\n<hr class="section-divider">\n');

  const fullDoc = `
    <div class="print-page">
      <div class="avs-header" style="margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #2563eb;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div>
            <div style="font-size:22px;font-weight:800;color:#2563eb;">AVSplus</div>
            <div style="font-size:11px;color:#64748b;">After Visit Summary</div>
          </div>
          <div style="margin-left:auto;font-size:12px;color:#64748b;text-align:right;">
            <div>Date: <strong>${new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</strong></div>
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
  // Inject printable styles then print
  const style = document.createElement('style');
  style.id = '__avsprint';
  style.textContent = `
    @media print {
      body > *:not(#printable) { display: none !important; }
      #printable { display: block !important; }
      .avs-section { page-break-inside: avoid; margin-bottom: 24px; }
      .section-divider { border: none; border-top: 1px dashed #cbd5e1; margin: 20px 0; }
      table { width: 100%; border-collapse: collapse; margin: 8px 0; }
      th, td { padding: 6px 10px; border: 1px solid #e2e8f0; text-align: left; }
      th { background: #f1f5f9; }
      h2 { color: #1e40af; margin-bottom: 8px; }
      h3 { margin: 12px 0 6px; }
      p, li { line-height: 1.6; }
      ul, ol { padding-left: 1.4rem; }
      .tip { background: #fefce8; border-left: 3px solid #fde047; padding: 8px 12px; margin: 8px 0; }
      .avs-header { margin-bottom: 20px; padding-bottom: 14px; border-bottom: 2px solid #2563eb; }
    }`;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => style.remove(), 1000);
});

// ── Utility ───────────────────────────────────────────────────────────────
async function apiFetch(url, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let toastTimer;
function toast(msg, isError = false) {
  clearTimeout(toastTimer);
  $toast.textContent = msg;
  $toast.style.background = isError ? '#dc2626' : '#1e293b';
  $toast.classList.add('show');
  toastTimer = setTimeout(() => $toast.classList.remove('show'), 3000);
}

// Initial render
updateDocumentUI();
