import {
  captureElementGriffelRules,
  captureGriffelRules,
  declarationsForProperty,
} from './captureGriffelRules';

const insertStyleSheet = (css: string): void => {
  const element = document.createElement('style');
  element.textContent = css;
  document.head.append(element);
};

describe('captureGriffelRules', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('captures rules inside and outside media blocks', () => {
    insertStyleSheet(`
      .fa1 { border-top-color: red; }
      .fb2 { color: blue; }
      @media (forced-colors: active) {
        .fa1 { border-top-color: Highlight; }
      }
    `);

    const captured = captureGriffelRules(document, ['fa1']);

    expect(captured).toEqual([
      {
        media: '',
        bucket: '',
        selector: '.fa1',
        declarations: { 'border-top-color': 'red' },
        cssText: expect.any(String),
      },
      {
        media: '(forced-colors: active)',
        bucket: '',
        selector: '.fa1',
        declarations: { 'border-top-color': 'Highlight' },
        cssText: expect.any(String),
      },
    ]);
  });

  it('ignores rules that target other atomic classes', () => {
    insertStyleSheet('.fa1 { color: red; } .fa10 { color: blue; }');

    expect(captureGriffelRules(document, ['fa1'])).toHaveLength(1);
  });

  it('captures every class an element carries', () => {
    insertStyleSheet('.fa1 { color: red; } .fb2 { border-top-color: blue; }');
    document.body.innerHTML = '<button class="fa1 fb2"></button>';
    const element = document.querySelector('button');

    const captured = captureElementGriffelRules(
      document,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element!
    );

    expect(captured.map(({ selector }) => selector)).toEqual(['.fa1', '.fb2']);
    expect(
      declarationsForProperty(captured, 'border-top-color').map(
        ({ selector }) => selector
      )
    ).toEqual(['.fb2']);
  });
});
