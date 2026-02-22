import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'el-inline-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inline-form.component.html',
  styleUrls: ['./inline-form.component.scss'],
  standalone: true
})
export class InlineFormComponent {
  @Input() title: string = '';
  @Input() defaultText: string = 'Not defined';
  @Input() hasButton: boolean = false;
  @Input() buttonText: string = 'Submit';
  @Input() inputPlaceholder: string = '';
  @Input() inputType: string = 'input';
  @Output() handleSubmit = new EventEmitter<string>();

  isEditing: boolean = false;

  readonly #fb = inject(FormBuilder);

  form = this.#fb.group({
    title: ['']
  });

  activeEditing(): void {
    if (this.title) {
      this.form.patchValue({ title: this.title }, { emitEvent: false });
    }
    this.isEditing = true;
  }

  onSubmit(): void {
    if (this.form.value.title) {
      this.handleSubmit.emit(this.form.value.title);
    }
    this.isEditing = false;
    this.form.reset();
  }
}
