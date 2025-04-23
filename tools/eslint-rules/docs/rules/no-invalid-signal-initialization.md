# @nx/workspace-no-invalid-signal-initialization

Ensures that signals (`signal`, `computed`, `input`) are properly initialized by invoking them as functions.

- Type: problem

## Why

Without invoking them, signals are not properly initialized and instead the variable becomes an alias of the signal function used.

## Rule Options

The rule does not have any configuration options.

## Usage Examples

<details>
<summary>❌ - Toggle examples of <strong>incorrect</strong> code for this rule</summary>

#### Default Config

```json
{
  "rules": {
    "@nx/workspace-no-invalid-signal-initiation": ["error"]
  }
}
```

#### ❌ Invalid Code

```ts
import { Component, input, signal } from '@angular/core';
@Component({
  selector: 'app-example',
  template: '<div></div>'
})
export class Example {
  readonly name = signal<string>;
  readonly x = input.required<number>;

  constructor() {}
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
    "@nx/workspace-no-invalid-signal-initiation": ["error"]
  }
}
```

#### ✅ Valid Code

```ts
import { Component, input, signal } from '@angular/core';
@Component({
  selector: 'app-example',
  template: '<div></div>'
})
export class Example {
  readonly name = signal<string>('');
  readonly x = input.require<number>();

  constructor() {}
}
```

</details>
