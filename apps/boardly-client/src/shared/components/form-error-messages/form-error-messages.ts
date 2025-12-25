import { Component, computed, input, signal } from '@angular/core';
import { type FieldTree, type ValidationError } from '@angular/forms/signals';
import type { Config } from '../../interfaces/form-error-messages.config';

@Component({
  selector: 'form-error-messages',
  templateUrl: './form-error-messages.html',
  styleUrl: './form-error-messages.scss'
})
export class FormErrorMessages {
  readonly #defaultConfig = signal({
    required: 'Enter value!'
  });
  readonly errors = input.required<ValidationError.WithField[]>();
  readonly control = input.required<FieldTree<unknown>>();
  readonly config = input<Config>();

  readonly showFieldNames = input(false);

  readonly errorMessages = computed(() => {
    const control = this.control()();
    if (control.invalid() && (control.dirty() || control.touched())) {
      return this.toErrorMessages(this.errors(), this.showFieldNames());
    }
    return [];
  });

  private toErrorMessages(
    errors: Readonly<ValidationError.WithField[]>,
    showFieldNames: boolean
  ): string[] {
    return errors.map((error) => {
      const prefix = showFieldNames ? this.toFieldName(error) + ': ' : '';

      const message =
        error.message ??
        this.toMessage(error, { ...this.#defaultConfig(), ...this.config() });
      return prefix + message;
    });
  }

  private toFieldName(error: ValidationError.WithField) {
    return error.fieldTree().name().split('.').at(-1);
  }

  private toMessage(error: Readonly<ValidationError>, config: Config): string {
    const message = config[error.kind];

    if (!message) {
      return error.kind ?? 'Validation Error';
    }

    const PLACEHOLDER_PATTERN =
      /\$(?<argIndex>[1-9]\d*)\s*-\s*(?<prop>[A-Za-z_]\w*)/g;
    const matches = [...message.matchAll(PLACEHOLDER_PATTERN)];

    if (!matches.length) {
      return message;
    }

    let replacedMessage = message;

    // eslint-disable-next-line functional/no-loop-statements
    for (const reg of matches) {
      const errorProp = reg[2] ?? '';
      replacedMessage = replacedMessage.replace(
        reg[0],
        (error as ValidationError & { [key: string]: string })[
          errorProp
        ] as string
      );
    }

    return replacedMessage;
  }
}
