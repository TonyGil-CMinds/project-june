import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const report = JSON.parse(await readFile(new URL('../src/data/capital-paciente.json', import.meta.url), 'utf8'));
const kpis = report.kpis[0];
const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);
const median = values => {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

assert.equal(kpis.total, 395);
assert.equal(kpis.n_listas, 82);
assert.equal(kpis.paises, 20);
assert.equal(kpis.n_indicadores, 1572);
assert.equal(report.points.length, kpis.total);
for (const point of report.points) {
  assert.equal(point.length, 3, 'Each anonymous point contains only stage, age and lane');
  assert.ok(Number.isInteger(point[0]) && point[0] >= 0 && point[0] < 3);
  assert.ok(Number.isInteger(point[1]) && point[1] >= 0 && point[1] <= 65);
  assert.ok(Number.isInteger(point[2]) && point[2] >= 0 && point[2] < 4);
}

assert.deepEqual(report.edad_etapa.map(row => row.n), [128, 166, 101]);
assert.deepEqual(report.edad_etapa.map(row => row.mediana), [1, 4, 9]);
report.edad_etapa.forEach((row, index) => {
  const points = report.points.filter(point => point[0] === index);
  assert.equal(points.length, row.n);
  assert.equal(median(points.map(point => point[1])), row.mediana);
  assert.equal(report.capital_etapa[index].etapa, row.etapa);
  assert.equal(report.capital_etapa[index].n, row.n);
});

assert.deepEqual(report.carriles.map(row => row.n), [39, 43, 55, 258]);
report.carriles.forEach((row, index) => assert.equal(report.points.filter(point => point[2] === index).length, row.n));
assert.equal(report.carriles[0].n + report.carriles[1].n, kpis.n_listas);
assert.equal(sum(report.carriles, 'n'), kpis.total);
assert.equal(sum(report.carriles, 'pct'), 100);
assert.equal(report.paises.length, kpis.paises);
assert.equal(sum(report.paises, 'n'), kpis.total);
assert.equal(sum(report.paises, 'n_listas'), kpis.n_listas);
assert.equal(sum(report.paises, 'n_amazonia'), kpis.n_amazonia);
assert.equal(sum(report.tipos_indicador, 'n'), kpis.n_indicadores);
assert.equal(sum(report.tipos_indicador, 'pct'), 99, 'Published whole percentages round to 99%');
for (const row of report.inclusion_traccion) assert.equal(row.con_n + row.sin_n, 267);
assert.equal(sum(report.inclusion_control, 'con_n') + sum(report.inclusion_control, 'sin_n'), 267);

assert.deepEqual(report.copy.sections.map(section => section.id), ['contexto', 'red', 'tiempo', 'capital', 'inclusion', 'evidencia', 'ciegos', 'carriles', 'listas']);
assert.equal(report.copy.thesis.length, 3);
assert.equal(report.copy.methodology.length, 11);
assert.ok(report.copy.methodology.some(item => item.label === 'Advertencias.' && item.body.includes('auto-reportado')));
assert.equal(new Set(report.fuentes.map(source => source.url)).size, report.fuentes.length);
for (const source of [...report.fuentes, ...report.contexto]) assert.equal(new URL(source.url).protocol, 'https:');
assert.ok(!Object.hasOwn(report, 'orgs'));
assert.ok(!Object.hasOwn(report, 'shortlist'));
assert.ok(!/"(?:nombre|email|correo|telefono|teléfono|contacto)"\s*:/.test(JSON.stringify(report)), 'The shipped report must not contain contact fields');

console.log('Capital paciente: anonymous points, aggregates, age medians, chapter coverage and source URLs verified.');
