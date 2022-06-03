const elemento = require('./esempio_function.js');

test('sottrae 2 a 1 deve risultare -1', () => {
  expect(elemento.sub(1, 2)).toBe(-1);
});
test('moltiplica 4 * 5 risultato 20', () => {
  expect(elemento.multi(4, 5)).toBe(20);
});
test('sommo 1 con 10, dovrebbe risultare 11, metto 10 cosi vedi un fallimento, come te.', () => {
  expect(elemento.sum(1, 10)).toBe(10);
});
