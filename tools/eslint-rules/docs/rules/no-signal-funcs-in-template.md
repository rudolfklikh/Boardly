# @nx/workspace-no-signal-funcs-in-template

Signal functions such as `set()` and `update()` should not be directly invoked in a template event binding. Instead, create a component method that makes the call on the signal and invoke the component method inside the template event binding.

- Type: suggestion

> **_NOTE:_** While this is a template check, the rule needs to be executed against the component `.ts` file so that it can identify any signals created by the component.

## Why

While there is not a technical reason why a signal should not be directly invoked in a template, doing so makes a number of things harder. There is now direct manipulation of state in both the component and the template. It makes it harder to write readable unit tests as it can be not clear why the signal function was invoked. It can also be less clear as to what is trying to be accomplished in the event.

## Rule Options

The rule does not have any configuration options.

## Usage Examples

<details>
<summary>❌ - Toggle examples of <strong>incorrect</strong> code for this rule</summary>

#### Default Config

```json
{
  "rules": {
    "@nx/workspace-no-signal-funcs-in-template": ["error"]
  }
}
```

#### ❌ Invalid Code

```ts
import { input } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '<div (click)="x.set(0)">Reset</div>'
})
export class ExampleComponent {
  readonly x = input<number>();
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
    "@nx/workspace-no-signal-funcs-in-template": ["error"]
  }
}
```

#### ✅ Valid Code

```ts
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
}
```

</details>
