const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { createSeedData } = require('./seed');

const dataFilePath = path.join(__dirname, '..', 'data', 'app.json');

async function ensureDataFile(options = {}) {
  const { reset = false } = options;
  if (reset || !fs.existsSync(dataFilePath)) {
    await fsp.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fsp.writeFile(dataFilePath, `${JSON.stringify(createSeedData(), null, 2)}\n`, 'utf8');
  }
}

async function readState() {
  await ensureDataFile();
  return JSON.parse(await fsp.readFile(dataFilePath, 'utf8'));
}

async function writeState(state) {
  await fsp.writeFile(dataFilePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  return state;
}

async function updateState(mutator) {
  const state = await readState();
  const nextState = (await mutator(state)) || state;
  await writeState(nextState);
  return nextState;
}

const getCurrentUserId = (req) => req.headers['x-user-id'] || 'u-1000';

module.exports = {
  dataFilePath,
  ensureDataFile,
  readState,
  writeState,
  updateState,
  getCurrentUserId,
};
