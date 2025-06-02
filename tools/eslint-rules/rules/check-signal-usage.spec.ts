import { RuleTester } from '@typescript-eslint/rule-tester';
import { RULE_NAME, rule } from './check-signal-usage';

describe('check-signal-usage', () => {
  it('should pass', () => {
    expect.assertions(0);

    const ruleTester = new RuleTester();
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        {
          name: 'allow usage in string templates and methods',
          code: `
        import { input, computed } from '@angular/core';
        @Component({
            selector: 'app-example',
            template: '<div></div>'
        })
        export class ExampleComponent {
            readonly firstName = input<string>();
            readonly lastName = input<string>();
            readonly fullName = computed(() => {
                return \`\${this.firstName()} \${this.lastName()}\`;
            });
            readonly x = input<number>();
            readonly y = input<number>();

            constructor() {}

            sum(): number {
                return this.x() + this.y();
            }
        }`
        },
        {
          name: 'support set and update method calls',
          code: `
        import { input, computed } from '@angular/core';
        @Component({
            selector: 'app-example',
            template: '<div></div>'
        })
        export class ExampleComponent {
            readonly name = signal<string>();
            readonly x = signal<number>(0);

            constructor() {}

            setName(n: string): void {
                this.name.set(n);
            }

            increment(): void {
                this.x.update((value) => value + 1);
            }
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
        },
        {
          name: 'allowed usage, but not preferred - separate suggestion rule',
          code: `
        import { input, WritableSignal } from '@angular/core';
        @Component({
            selector: 'app-example',
            template: '<div></div>'
        })
        export class ExampleComponent {
            private readonly _firstName = signal<string>('');
            constructor() {}

            get firstName(): WritableSignal<string> {
                return this._firstName;
            }
        }`
        },
        {
          name: 'no template or templateUrl',
          code: `
        import { input, WritableSignal } from '@angular/core';
        @Component()
        export class ExampleComponent {
            readonly firstName = signal<string>('');
            constructor() {}
        }`
        },
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
        }
      ],
      invalid: [
        {
          name: 'disallow usage in ng-zorro-antd modal service',
          code: `
      import { input, Type } from '@angular/core';

      class TestComponent {
        readonly firstName = input<string>();
        constructor() {}
      }

      interface CreateInterface<T> {
        nzContent: Type<T>;
        nzComponentParams: Partial<T>;
      }
      class TestService {
        create<T>(params: CreateInterface<T>): Partial<T> {
          return params.parameters;
        }
      }

      export class HostComponent {
        readonly name = input<string>();
        constructor(private svc: TestService) {}

        open(): void {
          this.svc.create({
            nzContent: TestComponent,
            nzComponentParams: {
              firstName: this.name
            }
          });
        }
      }`,
          errors: [
            {
              messageId: 'signalNotInvoked',
              data: {
                signal: 'name'
              }
            }
          ]
        },
        {
          code: `
        import { input, computed } from '@angular/core';
        @Component({
            selector: 'app-example',
            template: '<div></div>'
        })
        export class ExampleComponent {
            readonly firstName = input<string>();
            readonly lastName = input<string>();
            readonly fullName = computed(() => {
                return \`\${this.firstName} \${this.lastName}\`;
            });
            constructor() {}
        }`,
          errors: [
            {
              messageId: 'signalNotInvoked',
              data: {
                signal: 'firstName'
              }
            },
            {
              messageId: 'signalNotInvoked',
              data: {
                signal: 'lastName'
              }
            }
          ]
        },
        {
          code: `
          import { input, computed } from '@angular/core';
          @Component({
              selector: 'app-example',
              template: '<div></div>'
          })
          export class ExampleComponent {
              readonly x = input<number>();
              readonly y = input<number>();
              constructor() {}
              sum(): number {
                return this.x + this.y();
              }
          }`,
          errors: [
            {
              messageId: 'signalNotInvoked',
              data: {
                signal: 'x'
              }
            }
          ]
        }
      ]
    });
  });
});
