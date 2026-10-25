const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Load the real catalog; image imports are irrelevant to these pure logic checks.
const source = readFileSync(join(__dirname, '../src/data.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const sandbox = { exports: {}, require: () => 'image-asset' };
vm.runInNewContext(compiled, sandbox);
const { parseBudget, picksWithinBudget, marketplaceUrl, products } = sandbox.exports;

test('budgets accept bounded whole rupiah amounts and reject malformed input', () => {
  assert.equal(parseBudget('50000'), 50000);
  assert.equal(parseBudget('100000000'), 100000000);
  for (const invalid of [
    '',
    '0',
    '49999',
    '100000001',
    '-50000',
    '1e6',
    '50000.5',
    'Rp50000',
    ' 50000',
    'Infinity',
  ])
    assert.equal(parseBudget(invalid), null, invalid);
});
test('sample shopping plans never exceed the chosen budget', () => {
  for (const budget of [50000, 59000, 99000, 129000, 250000, 500000, 1000000]) {
    const picks = picksWithinBudget(budget);
    assert.ok(picks.reduce((sum, product) => sum + product.price, 0) <= budget);
    assert.equal(new Set(picks.map((p) => p.id)).size, picks.length);
  }
  assert.equal(picksWithinBudget(500000).length, products.length);
});
test('marketplace links preserve the full search string on the expected host', () => {
  const query = 'sage & cream / lamp? # cozy';
  const shopee = new URL(marketplaceUrl('shopee', query));
  const tokopedia = new URL(marketplaceUrl('tokopedia', query));
  assert.equal(shopee.hostname, 'shopee.co.id');
  assert.equal(tokopedia.hostname, 'www.tokopedia.com');
  assert.equal(shopee.searchParams.get('keyword'), query);
  assert.equal(tokopedia.searchParams.get('q'), query);
  assert.equal(shopee.hash, '');
  assert.equal(tokopedia.hash, '');
});
