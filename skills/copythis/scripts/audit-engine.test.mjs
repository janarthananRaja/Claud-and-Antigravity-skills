import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { extractBindings, extractMethods, extractControlTypes, runAudit } from './audit-engine.mjs';

test('extractBindings extracts formModel properties and rating keys', () => {
  const sampleHtml = `
    <input [(ngModel)]="formModel.student_name" />
    <select [ngModel]="formModel.primary_skill"></select>
    <button (click)="setScore('B_bat_cover_drive', 4)">L4</button>
  `;
  const bindings = extractBindings(sampleHtml);
  assert.deepEqual(Array.from(new Set(bindings)).sort(), [
    'B_bat_cover_drive',
    'primary_skill',
    'student_name'
  ]);
});

test('extractMethods extracts valid TS methods while excluding keywords and numbers', () => {
  const sampleTs = `
    export class SampleComponent {
      calculateProgress(): number { return 100; }
      async submitData() { return true; }
      private helperMethod(val: string) {}
      if (condition) {}
      switch (val) { case 0: { break; } }
    }
  `;
  const methods = extractMethods(sampleTs);
  assert.deepEqual(methods, ['calculateProgress', 'helperMethod', 'submitData']);
});

test('extractControlTypes detects rating controls, dropdowns, and text areas', () => {
  const html = `
    <div class="rating-pill">setScore('rating_field', 3)</div>
    <select [(ngModel)]="formModel.dropdown_field"></select>
    <textarea [(ngModel)]="formModel.notes_field"></textarea>
  `;
  const controls = extractControlTypes(html, ['rating_field', 'dropdown_field', 'notes_field']);
  assert.equal(controls['rating_field'], '4-Tier Rating Control (L1-L4/NS)');
  assert.equal(controls['dropdown_field'], 'Dropdown Select');
  assert.equal(controls['notes_field'], 'Text Area');
});

test('runAudit enforces mapping relation M for aliased fields and methods', () => {
  const tmpDir = path.resolve('./temp-audit-test');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const srcHtml = path.join(tmpDir, 'src.html');
  const dstHtml = path.join(tmpDir, 'dst.html');
  const srcTs = path.join(tmpDir, 'src.ts');
  const dstTs = path.join(tmpDir, 'dst.ts');

  fs.writeFileSync(srcHtml, '<input [(ngModel)]="formModel.sourceName" /><button (click)="setScore(\'battingSkill\', 4)">L4</button>');
  fs.writeFileSync(dstHtml, '<input [(ngModel)]="formModel.destName" /><button (click)="setScore(\'battingRating\', 4)">L4</button>');
  fs.writeFileSync(srcTs, 'submitFeedback() {}');
  fs.writeFileSync(dstTs, 'submitAssessment() {}');

  const mapping = {
    fieldMapping: {
      sourceName: 'destName',
      battingSkill: 'battingRating'
    },
    methodMapping: {
      submitFeedback: 'submitAssessment'
    }
  };

  const audit = runAudit({
    sourceHtml: srcHtml,
    sourceTs: srcTs,
    destHtml: dstHtml,
    destTs: dstTs,
    mapping
  });

  assert.equal(audit.summary.parity.unmappedSourceCount, 0);
  assert.equal(audit.summary.parity.unsupportedDestCount, 0);
  assert.equal(audit.summary.parity.unmappedMethodsCount, 0);
  assert.equal(audit.summary.parity.completenessGatePassed, true);
  assert.equal(audit.summary.parity.traceabilityGatePassed, true);
  assert.equal(audit.summary.parity.methodParityPassed, true);

  // Clean up
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
