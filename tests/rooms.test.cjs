const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
const cache = {};
function load(name) {
  if (cache[name]) return cache[name];
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src', name + '.ts'), 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    Math,
    Date,
    Promise,
    setTimeout,
    require: (id) => (id.startsWith('./') ? load(id.slice(2)) : 'asset'),
  });
  cache[name] = exports;
  return exports;
}
const { newProject, readSnapshot, emptySnapshot, planReady, itemTotal } = load('model');
const { createSaveQueue } = load('persistence');
const plain = (value) => JSON.parse(JSON.stringify(value));

test('same style and budget can belong to multiple independently named rooms', () => {
  const a = newProject('earthy', 1, 100);
  const b = newProject('earthy', 2, 100);
  assert.notEqual(a.id, b.id);
  assert.notEqual(a.name, b.name);
  assert.equal(a.budget, b.budget);
  const restored = readSnapshot(JSON.stringify({ ...emptySnapshot, projects: [a, b] }));
  assert.equal(restored.projects.length, 2);
});
test('legacy saved rooms and favorites migrate without replacing existing identities', () => {
  const restored = readSnapshot(
    JSON.stringify({
      favorites: ['lamp'],
      rooms: [{ id: 'cozy-250000', mood: 'cozy', budget: 250000, name: 'Cozy corner' }],
    }),
  );
  assert.equal(restored.version, 2);
  assert.equal(restored.projects[0].id, 'legacy-cozy-250000');
  assert.equal(restored.projects[0].name, 'Cozy corner');
  assert.equal(restored.projects[0].prepared, true);
  assert.ok(itemTotal(restored.projects[0].items) <= 250000);
  assert.deepEqual(plain(restored.favorites), ['lamp']);
});
test('an unfinished draft retains its inputs and reference preview across reload', () => {
  const p = {
    ...newProject('natural', 1),
    name: 'Studio',
    stage: 'style',
    budget: '',
    photos: ['data:image/jpeg;base64,YWJj'],
  };
  const restored = readSnapshot(JSON.stringify({ ...emptySnapshot, projects: [p] }));
  assert.deepEqual(plain(restored.projects[0]), plain(p));
  assert.equal(planReady(restored.projects[0]), false);
});
test('unsafe, unknown, or malformed local records are rejected instead of silently overwritten', () => {
  const p = newProject('cozy', 1);
  for (const data of [
    null,
    { version: 99, favorites: [], projects: [] },
    { ...emptySnapshot, projects: [p, p] },
    { ...emptySnapshot, projects: [{ ...p, items: ['unknown'] }] },
    { ...emptySnapshot, projects: [{ ...p, photos: ['https://remote/photo.jpg'] }] },
  ]) {
    assert.throws(() => readSnapshot(JSON.stringify(data)));
  }
  assert.throws(() => readSnapshot('{broken'));
});
test('a plan can only finish with a name, valid budget, and affordable chosen pieces', () => {
  const p = { ...newProject('earthy', 1), items: ['lamp', 'throw'], budget: '250000' };
  assert.equal(planReady(p), true);
  assert.equal(planReady({ ...p, name: '  ' }), false);
  assert.equal(planReady({ ...p, budget: '0' }), false);
  assert.equal(planReady({ ...p, budget: '50000' }), false);
  assert.equal(itemTotal(['lamp', 'lamp', 'throw', 'unknown']), 228000);
});
test('device writes stay ordered, and a failed write can recover on retry', async () => {
  const seen = [];
  let release;
  const blocked = new Promise((resolve) => {
    release = resolve;
  });
  const q = createSaveQueue(async (payload) => {
    if (payload === 'first') await blocked;
    seen.push(payload);
    if (payload === 'fail') throw Error('quota');
  });
  const first = q.enqueue('first');
  const second = q.enqueue('second');
  await Promise.resolve();
  assert.deepEqual(seen, []);
  release();
  assert.equal(await first, true);
  assert.equal(await second, true);
  assert.equal(await q.enqueue('fail'), false);
  assert.equal(await q.enqueue('retry'), true);
  assert.deepEqual(seen, ['first', 'second', 'fail', 'retry']);
});
