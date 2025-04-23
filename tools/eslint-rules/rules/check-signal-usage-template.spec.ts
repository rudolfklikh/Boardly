import { RuleTester } from '@typescript-eslint/rule-tester';
import path from 'path';
import { RULE_NAME, rule } from './check-signal-usage-template';

describe('check-signal-usage-template', () => {
  it('should pass', () => {
    expect.assertions(0);

    const ruleTester = new RuleTester();
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        {
          name: 'incorrect templateUrl - caught by compiler',
          code: `
            import { input, WritableSignal } from '@angular/core';
            @Component({
              templateUrl: 'bad-file.html'
            })
            export class ExampleComponent {
                readonly firstName = signal<string>('');
                constructor() {}
            }`
        },
        {
          name: 'signal invoked in template',
          code: `
            import { Component, signal } from '@angular/core';
            @Component({
              selector: 'app-example',
              template: \`@if (isLoaded()) {
                <div></div>
              }\`
            })
            export class Example {
              readonly isLoaded = signal<boolean>(false);
    
              constructor() {}
            }`
        }
      ],
      invalid: [
        {
          code: `
              import { input } from '@angular/core';
              @Component({
                  selector: 'app-example',
                  template: '<div *ngIf="x > 0"></div>'
              })
              export class ExampleComponent {
                  readonly x = input<number>();
                  constructor() {}
              }`,
          errors: [
            {
              messageId: 'signalNotInvokedTemplate',
              data: {
                signal: 'x'
              }
            }
          ]
        },
        {
          code: `
              import { input } from '@angular/core';
              @Component({
                  selector: 'app-example',
                  template: '<div>{{ x }}</div>'
              })
              export class ExampleComponent {
                  readonly x = input<number>();
                  constructor() {}
              }`,
          errors: [
            {
              messageId: 'signalNotInvokedTemplate',
              data: {
                signal: 'x'
              }
            }
          ]
        },
        {
          filename: path.join(__dirname, 'test.ts'),
          code: `
              import { input } from '@angular/core';
              @Component({
                  selector: 'app-example',
                  templateUrl: 'check-signal-usage-template.html'
              })
              export class ExampleComponent {
                  readonly x = input<number>();
                  constructor() {}
              }`,
          errors: [
            {
              messageId: 'signalNotInvokedTemplate',
              data: {
                signal: 'x'
              }
            }
          ]
        },
        {
          name: 'signal not invoked in template control flow',
          code: `
            import { Component, signal } from '@angular/core';
            @Component({
              selector: 'app-example',
              template: '@if (isLoaded) { <div></div>}'
            })
            export class Example {
              readonly isLoaded = signal<boolean>(false);
    
              constructor() {}
            }`,
          errors: [
            {
              messageId: 'signalNotInvokedTemplate',
              data: {
                signal: 'isLoaded'
              }
            }
          ]
        }
      ]
    });
  });
});
