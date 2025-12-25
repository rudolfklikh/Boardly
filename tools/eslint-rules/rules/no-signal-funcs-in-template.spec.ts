import { RuleTester } from '@typescript-eslint/rule-tester';
import { RULE_NAME, rule } from './no-signal-funcs-in-template';

const ruleTester = new RuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      name: 'no template defined',
      code: `
              import { input } from '@angular/core';
              @Component()
              export class ExampleComponent {
                  readonly x = input<number>();
                  constructor() {}
    
                  reset(): void {
                      this.x.set(0);
                  }
              }`
    },
    {
      name: 'use signal functions in component methods',
      code: `
              import { input } from '@angular/core';
              @Component({
                  selector: 'app-example',
                  template: '<div (click)="reset()">Reset</div>'
              })
              export class ExampleComponent {
                  readonly x = input<number>();
                  constructor() {}
    
                  reset(): void {
                      this.x.set(0);
                  }
              }`
    }
  ],
  invalid: [
    {
      code: `
              import { input } from '@angular/core';
              @Component({
                  selector: 'app-example',
                  template: '<div (click)="x.set(0)">Reset</div>'
              })
              export class ExampleComponent {
                  readonly x = input<number>();
                  constructor() {}
              }`,
      errors: [
        {
          messageId: 'signalFuncUsedInTemplate',
          data: {
            signal: 'x',
            func: 'set'
          }
        }
      ]
    }
  ]
});
