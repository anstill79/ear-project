const express = require('express');
const path = require('path');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3737;

const db = initDb();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const apiRouter = require('./routes/api')(db);
app.use('/api', apiRouter);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AVSplus running at http://localhost:${PORT}`);
});
