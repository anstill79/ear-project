const express = require('express');
const router = express.Router();

module.exports = function(db) {

  // GET /api/resources — list all resources with their fields
  router.get('/resources', (req, res) => {
    const resources = db.prepare(`
      SELECT id, name, description, category, type, sort_order, icon
      FROM resources ORDER BY category, sort_order, name
    `).all();

    const getFields = db.prepare(`
      SELECT id, field_name, field_label, field_type, field_options, default_value, required, sort_order
      FROM resource_fields WHERE resource_id = ? ORDER BY sort_order
    `);

    const result = resources.map(r => ({
      ...r,
      fields: r.type === 'form' ? getFields.all(r.id).map(f => ({
        ...f,
        field_options: f.field_options ? JSON.parse(f.field_options) : null,
        required: f.required === 1
      })) : []
    }));

    res.json(result);
  });

  // GET /api/resources/:id — single resource with content
  router.get('/resources/:id', (req, res) => {
    const r = db.prepare('SELECT * FROM resources WHERE id = ?').get(req.params.id);
    if (!r) return res.status(404).json({ error: 'Not found' });

    const fields = db.prepare(`
      SELECT id, field_name, field_label, field_type, field_options, default_value, required, sort_order
      FROM resource_fields WHERE resource_id = ? ORDER BY sort_order
    `).all(r.id).map(f => ({
      ...f,
      field_options: f.field_options ? JSON.parse(f.field_options) : null,
      required: f.required === 1
    }));

    const template = db.prepare('SELECT template FROM resource_templates WHERE resource_id = ?').get(r.id);

    res.json({ ...r, fields, template: template?.template || null });
  });

  // POST /api/render — render a form-based resource with provided values
  router.post('/render', (req, res) => {
    const { resource_id, values } = req.body;
    if (!resource_id) return res.status(400).json({ error: 'resource_id required' });

    const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(resource_id);
    if (!resource) return res.status(404).json({ error: 'Not found' });

    if (resource.type === 'static') {
      return res.json({ html: resource.content });
    }

    const tmplRow = db.prepare('SELECT template FROM resource_templates WHERE resource_id = ?').get(resource_id);
    if (!tmplRow) return res.status(404).json({ error: 'No template' });

    const html = renderTemplate(tmplRow.template, values || {});
    res.json({ html });
  });

  // POST /api/resources — create a new resource (for future expansion)
  router.post('/resources', (req, res) => {
    const { name, description, category, type, content, icon, sort_order } = req.body;
    if (!name || !category || !type) {
      return res.status(400).json({ error: 'name, category, type required' });
    }
    const result = db.prepare(`
      INSERT INTO resources (name, description, category, type, content, icon, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, description || '', category, type, content || null, icon || '📄', sort_order || 0);
    res.status(201).json({ id: result.lastInsertRowid });
  });

  return router;
};

// ── Template renderer ─────────────────────────────────────────────────────────
// Handles: {{var}}, {{#var}}...{{/var}}, {{#var_not_X}}...{{/var_not_X}},
//          {{#each lines_var}}...{{/each}}
function renderTemplate(template, values) {
  let out = template;

  // {{#each varname_lines}} ... {{/each}} — splits value on newlines
  out = out.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, key, body) => {
    const raw = values[key] || '';
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    return lines.map(line => body.replace(/\{\{this\}\}/g, escHtml(line))).join('');
  });

  // {{#varname_not_X}} ... {{/varname_not_X}} — show block when value != X
  out = out.replace(/\{\{#(\w+)_not_(\w+)\}\}([\s\S]*?)\{\{\/\1_not_\2\}\}/g, (_, key, notVal, body) => {
    const val = (values[key] || '').trim();
    return val && val.toLowerCase() !== notVal.toLowerCase() ? body : '';
  });

  // {{#varname}} ... {{/varname}} — conditional blocks
  out = out.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, key, body) => {
    return values[key] ? body : '';
  });

  // {{varname}} — simple substitution
  out = out.replace(/\{\{(\w+)\}\}/g, (_, key) => escHtml(values[key] || ''));

  return out;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
