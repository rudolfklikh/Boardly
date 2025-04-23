# @nx/workspace-no-signals-in-getters

Signals should not be used in a getter (`get` method). Instead, either use the signal directly if no additional logic is needed, or use a `computed()` signal if additional logic is needed to create a derived value.

- Type: suggestion

## Why

Unlike with observables, where a common pattern is to use a private `BehaviorSubject` to set values and a public getter to expose it as an observable for use in the template or other locations, signals can be both set and read directly. Creating a private signal value and then exposing it through a getter provides no additional value and can lead to confusion as to what is being set.

In addition, if a signal is used in a getter to derive a value, a `computed()` signal should be used instead to benefit from signal change detection.

<details>
<summary>Example Observable Migration to Signals</summary>

##### Original Code

```ts
import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component()
export class ExampleComponent {
  private readonly _name = new BehaviorSubject<string>('');

  constructor() {}

  get name(): Observable<string> {
    return this._name.asObservable();
  }

  updateName(newName: string): void {
    this._name.next(newName);
  }
}
```

---

##### ❌ Incorrect Migration

```ts
import { Component, signal, WritableSignal } from '@angular/core';

@Component()
export class ExampleComponent {
  private readonly _name = new signal<string>('');

  constructor() {}

  get name(): WritableSignal<string> {
    return this._name;
  }

  updateName(newName: string): void {
    this._name.set(newName);
  }
}
```

---

##### ✅ Correct Migration

```ts
import { Component, signal } from '@angular/core';

@Component()
export class ExampleComponent {
  readonly name = new signal<string>('');

  constructor() {}

  updateName(newName: string): void {
    this.name.set(newName);
  }
}
```

</details>

## Rule Options

The rule does not have any configuration options.

## Usage Examples

<details>
<summary>❌ - Toggle examples of <strong>incorrect</strong> code for this rule</summary>

#### Default Config

```json
{
  "rules": {
    "@nx/workspace-no-signals-in-getters": ["error"]
  }
}
```

#### ❌ Invalid Code

```ts
import { Component, signal, WritableSignal } from '@angular/core';
@Component({
  selector: 'app-example',
  template: '<div></div>'
})
export class Example {
  private readonly _name = signal<string>('');

  constructor() {}

  get name(): WritableSignal<string> {
    return this._name;
  }
}
```

---

#### Default Config

```json
{
  "rules": {
    "@nx/workspace-no-signals-in-getters": ["error"]
  }
}
```

#### ❌ Invalid Code

```ts
import { Component, signal } from '@angular/core';
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
}
```

---

#### Default Config

```json
{
  "rules": {
    "@nx/workspace-no-signals-in-getters": ["error"]
  }
}
```

#### ❌ Invalid Code

```ts
import { Component, input } from '@angular/core';
@Component({
  selector: 'app-example',
  template: '<div></div>'
})
export class Example {
  readonly creationDate = input<DateTime>(DateTime.now());

  constructor() {}

  get timeSent(): Date {
    return this.creationDate().toJSDate();
  }
}
```

</details>

---

<details>
<summary>✅ - Toggle examples of <strong>correct</strong> code for this rule</summary>

### Default Config

```json
{
  "rules": {
    "@nx/workspace-no-signals-in-getters": ["error"]
  }
}
```

#### ✅ Valid Code

```ts
import { Component, signal, WritableSignal } from '@angular/core';
@Component({
  selector: 'app-example',
  template: '<div></div>'
})
export class Example {
  readonly name = signal<string>('');

  constructor() {}
}
```

---

#### Default Config

```json
{
  "rules": {
    "@nx/workspace-no-signals-in-getters": ["error"]
  }
}
```

#### ✅ Valid Code

```ts
import { Component, computed, signal } from '@angular/core';
@Component({
  selector: 'app-example',
  template: '<div></div>'
})
export class Example {
  readonly firstName = signal<string>('');
  readonly lastName = signal<string>('');
  readonly fullName = computed(() => {
    return this.firstName() + ' ' + this.lastName();
  });

  constructor() {}
}
```

---

#### Default Config

```json
{
  "rules": {
    "@nx/workspace-no-signals-in-getters": ["error"]
  }
}
```

#### ✅ Valid Code

```ts
import { Component, computed, input } from '@angular/core';
@Component({
  selector: 'app-example',
  template: '<div></div>'
})
export class Example {
  readonly creationDate = input<DateTime>(DateTime.now());
  readonly timeSent = computed(() => {
    return this.creationDate().toJSDate();
  });

  constructor() {}
}
```

</details>
