import assert from 'node:assert/strict';
import test from 'node:test';
import pg from 'pg';
import '../config.js';

test('PostgreSQL date-only values remain date-only strings', () => {
  const parseDate = pg.types.getTypeParser(pg.types.builtins.DATE);

  assert.equal(parseDate('2026-09-23'), '2026-09-23');
});
