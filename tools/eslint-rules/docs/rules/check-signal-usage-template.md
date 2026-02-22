# @nx/workspace-check-signal-usage-template

Signals should always be invoked when used in a template.

- Type: problem

> **_NOTE:_** While this is a template check, the rule needs to be executed against the component `.ts` file so that it can identify any signals created by the component.

## Why

Signals require invocation to get the value the signal contains. Without invoking, the signal container is what is referenced. This leads to problems in things like conditionals. Typically, what is wanted is to evaluate the value of the signal but the signal itself is evaluated which is always truthy.

## Rule Options

The rule does not have any configuration options.

## Usage Examples

<details>
<summary>❌ - Toggle examples of <strong>incorrect</strong> code for this rule</summary>

#### Default Config

```json
{
  "rules": {
    "@nx/workspace-check-signal-usage-template": ["error"]
  }
}
```

#### ❌ Invalid Code

```ts
import { Component, signal } from '@angular/core';
@Component({
  selector: 'app-example',
  template: `@if (isLoaded) {
    <div></div>
  }`
})
export class Example {
  readonly isLoaded = signal<boolean>(false);

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
    "@nx/workspace-check-signal-usage-template": ["error"]
  }
}
```

#### ✅ Valid Code

```ts
import { Component, signal } from '@angular/core';
@Component({
  selector: 'app-example',
  template: `@if (isLoaded()) {
    <div></div>
  }`
})
export class Example {
  readonly isLoaded = signal<boolean>(false);

  constructor() {}
}
```

</details>
