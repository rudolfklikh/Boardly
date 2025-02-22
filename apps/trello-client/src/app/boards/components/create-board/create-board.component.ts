import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { ECreationBoardPlaceholders } from './create-board.config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-board',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent
  ],
  templateUrl: './create-board.component.html',
  styleUrl: './create-board.component.scss'
})
export class CreateBoardComponent {
  protected readonly dialogRef = inject(MatDialogRef<CreateBoardComponent>);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly creationLabels = ECreationBoardPlaceholders;

  protected form = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]]
  });

  protected get title(): AbstractControl {
    return this.form.controls.title;
  }

  protected get isShowErrors(): boolean {
    return this.title.invalid && (this.title.dirty || this.title.touched);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.dialogRef.close(this.form.controls.title.value);
  }
}
