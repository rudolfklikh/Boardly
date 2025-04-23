import { RuleTester } from '@typescript-eslint/rule-tester';
import { RULE_NAME, rule } from './no-invalid-signal-initialization';

describe('no-invalid-signal-initialization', () => {
  it('shoud pass', () => {
    expect.assertions(0);

    const ruleTester = new RuleTester();
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        {
          name: 'inputs and signals initialized properly',
          code: `
            import { input, computed } from '@angular/core';
            @Component({
                selector: 'app-example',
                template: '<div></div>'
            })
            export class ExampleComponent {
                readonly name = input<string>();
                readonly x = signal<number>(0);
    
                constructor() {}
            }`
        },
        {
          name: 'support required inputs',
          code: `
            import { input, computed } from '@angular/core';
            @Component({
                selector: 'app-example',
                template: '<div></div>'
            })
            export class ExampleComponent {
                readonly x = input.required<number>();
    
                constructor() {}
            }`
        }
      ],
      invalid: [
        {
          code: `
            import { input, signal } from '@angular/core';
            @Component({
                selector: 'app-example',
                template: '<div></div>'
            })
            export class Example {
                readonly name = input<string>;
                readonly x = signal<string>;
                readonly type = input.required<string>;
                constructor() {}
            }`,
          errors: [
            {
              messageId: 'signalNotInitializedProperly',
              data: {
                prop: 'name',
                func: 'input'
              }
            },
            {
              messageId: 'signalNotInitializedProperly',
              data: {
                prop: 'x',
                func: 'signal'
              }
            },
            {
              messageId: 'signalNotInitializedProperly',
              data: {
                prop: 'type',
                func: 'input'
              }
            }
          ]
        }
      ]
    });
  });
});
