# @nx/workspace-check-signal-usage

Signals should always be invoked when used in a component.

- Type: problem

## Why

Signals require invocation to get the value the signal contains. Without invoking, the signal container is what is referenced. This leads to problems in things like conditionals. Typically, what is wanted is to evaluate the value of the signal but the signal itself is evaluated which is always truthy.

## Rule Options

The rule accepts an options object with the following properties:

```ts
interface Options {
  /**
   * Default: false
   */
  ignoreNzComponentParams: boolean;
}
```

## Usage Examples

<details>
<summary>❌ - Toggle examples of <strong>incorrect</strong> code for this rule</summary>

#### Default Config

```json
{
  "rules": {
    "@nx/workspace-check-signal-usage": ["error"]
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
  readonly isLoaded = signal<boolean>(false);

  constructor() {}

  doSomething() {
    if (isLoaded) {
      // isLoaded is always truthy
      // do something
    }
  }
}
```

---

#### Default Config

```json
{
  "rules": {
    "@nx/workspace-check-signal-usage": ["error"]
  }
}
```

#### ❌ Invalid Code

```ts
import { Component, Input, input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CloseTaskModalComponent } from '../close-task-modal/close-task-modal.component';
import { Associate, Task } from '@order-up/external-shared-schema';
import { Location } from '@order-up/shared-data-models';

@Component({
  selector: 'app-example',
  template: '<div></div>'
})
export class Example {
  @Input() readonly orderNumber: string = '';
  @Input() readonly storeNumber: string = '';
  readonly currentAssociate = input<Associate>();
  readonly currentLocation = input<Location>();

  constructor(private readonly modalService: NzModalService) {}

  openModal(task: Task) {
    return this.modalService.create({
      nzContent: CloseTaskModalComponent,
      nzWidth: 450,
      nzClosable: false,
      nzFooter: null,
      nzComponentParams: {
        currentAssociate: this.currentAssociate,
        currentLocation: this.currentLocation,
        task,
        orderNumber: this.orderNumber,
        storeNumber: this.storeNumber
      }
    });
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
    "@nx/workspace-check-signal-usage": ["error"]
  }
}
```

#### ✅ Valid Code

```ts
import { Component, signal } from '@angular/core';
@Component({
  selector: 'app-example',
  template: '<div></div>'
})
export class Example {
  readonly isLoaded = signal<boolean>(false);

  constructor() {}

  doSomething() {
    if (isLoaded()) {
      // checks the value of the signal
      // do something
    }
  }
}
```

---

### Custom Config

```json
{
  "rules": {
    "@nx/workspace-check-signal-usage": [
      "error",
      { "ignoreNzComponentParams": true }
    ]
  }
}
```

#### ✅ Valid Code

```ts
import { Component, Input, input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CloseTaskModalComponent } from '../close-task-modal/close-task-modal.component';
import { Associate, Task } from '@order-up/external-shared-schema';
import { Location } from '@order-up/shared-data-models';

@Component({
  selector: 'app-example',
  template: '<div></div>'
})
export class Example {
  @Input() readonly orderNumber: string = '';
  @Input() readonly storeNumber: string = '';
  readonly currentAssociate = input<Associate>();
  readonly currentLocation = input<Location>();

  constructor(private readonly modalService: NzModalService) {}

  openModal(task: Task) {
    return this.modalService.create({
      nzContent: CloseTaskModalComponent,
      nzWidth: 450,
      nzClosable: false,
      nzFooter: null,
      nzComponentParams: {
        currentAssociate: this.currentAssociate,
        currentLocation: this.currentLocation,
        task,
        orderNumber: this.orderNumber,
        storeNumber: this.storeNumber
      }
    });
  }
}
```

</details>
