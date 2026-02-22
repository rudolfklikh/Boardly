# @nx/workspace-no-nz-component-params

With the upgrade of `ng-zorro-ant` to `15.1.x`, `nzComponentParams` in the `ModalOptions` used by the `NzModalService` has officially been deprecated and is removed in version `16.x.x`. Instead, the `nzData` property is used to pass data to the modal component.

- Type: problem

## Alternative

`nzComponentParams` is typed as a `Partial<T>` where `T` is the type of the component being shown in the modal. The component params map to inputs and/or properties of the component and the modal service auto wires up and sets the properties on the component.

With `nzData`, passing data to the modal component no longer works this way. It requires the modal component to explicitly handle the data passed to it. The `nzData` property has its own data type independent of the component. The calling component sets the `nzData` property on the modal options. The modal component must retrieve the data using a new injection token, `NZ_MODAL_DATA`. The modal component is then responsible for extracting the data from the returned object and setting any properties it needs.

<details>
<summary>Passing data using nzComponentParams</summary>

##### loading-modal.component.ts

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'order-up-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.scss']
})
export class LoadingModalComponent {
  @Input()
  readonly modalTitle: string | undefined;
  @Input()
  readonly hasMessage: boolean = false;

  get modalMessage(): string {
    return this.hasMessage ? 'You will be redirected automatically.' : '';
  }
}
```

##### view.component.ts

```ts
import { Component } from '@angular/core';
import { LoadingModalComponent } from '@order-up/external-shared';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  openLoadingModal() {
    this.loadingModal = this.modalService.create<LoadingModalComponent>({
      nzContent: LoadingModalComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzFooter: null,
      nzComponentParams: { modalTitle: 'Loading...', hasMessage: false }
    });
  }
}
```

</details>

---

<details>
<summary>Passing data using nzData</summary>

##### loading-modal.component.ts

```ts
import { Component, inject } from '@angular/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

export interface LoadingModalComponentData {
  modalTitle?: string;
  hasMessage?: boolean;
}

@Component({
  selector: 'order-up-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.scss']
})
export class LoadingModalComponent {
  readonly modalTitle: string | undefined;
  readonly hasMessage: boolean = false;

  constructor() {
    const data = inject(NZ_MODAL_DATA) as LoadingModalComponentData;
    this.modalTitle = data.modalTitle;
    this.hasMessage = data.hasMessage ?? false;
  }

  get modalMessage(): string {
    return this.hasMessage ? 'You will be redirected automatically.' : '';
  }
}
```

##### view.component.ts

```ts
import { Component } from '@angular/core';
import {
  LoadingModalComponent,
  LoadingModalComponentData
} from '@order-up/external-shared';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  openLoadingModal() {
    this.loadingModal = this.modalService.create<
      LoadingModalComponent,
      LoadingModalComponentData
    >({
      nzContent: LoadingModalComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzFooter: null,
      nzData: { modalTitle: 'Loading...', hasMessage: false }
    });
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
    "@nx/workspace-no-nz-component-params": ["error"]
  }
}
```

#### ❌ Invalid Code

```ts
import { Component } from '@angular/core';
import { LoadingModalComponent } from '@order-up/external-shared';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  openLoadingModal() {
    this.loadingModal = this.modalService.create<LoadingModalComponent>({
      nzContent: LoadingModalComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzFooter: null,
      nzComponentParams: { modalTitle: 'Loading...', hasMessage: false }
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
    "@nx/workspace-no-nz-component-params": ["error"]
  }
}
```

#### ✅ Valid Code

```ts
import { Component } from '@angular/core';
import {
  LoadingModalComponent,
  LoadingModalComponentData
} from '@order-up/external-shared';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  openLoadingModal() {
    this.loadingModal = this.modalService.create<
      LoadingModalComponent,
      LoadingModalComponentData
    >({
      nzContent: LoadingModalComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzFooter: null,
      nzData: { modalTitle: 'Loading...', hasMessage: false }
    });
  }
}
```

</details>
