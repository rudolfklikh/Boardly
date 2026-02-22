import { RuleTester } from '@typescript-eslint/rule-tester';
import { RULE_NAME, rule } from './no-signals-in-getters';

const ruleTester = new RuleTester();
ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      name: 'signals can be used in methods',
      code: `
        import {signal} from '@angular/core';
        @Component({
            selector: 'app-example',
            template: '<div></div>'
        })
        export class ExampleComponent {
            readonly x = signal<number>(0);
            readonly y = signal<number>(0);

            constructor() {}

            sum(): number {
                return this.x() + this.y();
            }
        }`
    },
    {
      code: `
        import { signal, WritableSignal } from '@angular/core';
        @Component({
            selector: 'app-example',
            template: '<div></div>'
        })
        export class Example {
            private readonly _name = signal<string>('');
            
            constructor() {}
            
            name(): WritableSignal<string> {
                return this._name;
            }
        }`
    }
  ],
  invalid: [
    {
      code: `
        import { signal, WritableSignal } from '@angular/core';
        @Component({
            selector: 'app-example',
            template: '<div></div>'
        })
        export class Example {
            private readonly _name = signal<string>();
            
            constructor() {}
            
            get name(): WritableSignal<string> {
                return this._name;
            }
        }`,
      errors: [
        {
          messageId: 'signalUsedInGetter',
          data: {
            signal: '_name'
          }
        }
      ]
    },
    {
      code: `
        import { signal, WritableSignal } from '@angular/core';
        @Component({
            selector: 'app-example',
            template: '<div></div>'
        })
        export class Example {
            private readonly _firstName = signal<string>('');
            private readonly _lastName = signal<string>('');
            
            constructor() {}
            
            get fullName(): string {
                return this._firstName() + ' ' + this._lastName();
            }
        }`,
      errors: [
        {
          messageId: 'signalUsedInGetter',
          data: {
            signal: '_firstName'
          }
        },
        {
          messageId: 'signalUsedInGetter',
          data: {
            signal: '_lastName'
          }
        }
      ]
    }
  ]
});
