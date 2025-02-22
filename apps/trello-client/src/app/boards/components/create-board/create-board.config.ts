import { MatDialogConfig } from '@angular/material/dialog';

export const createBoardConfig: MatDialogConfig = {
  width: '700px',
  minHeight: '320px',
  hasBackdrop: true,
  enterAnimationDuration: '0.2s',
  exitAnimationDuration: '0.2s'
};

export enum ECreationBoardPlaceholders {
  TITLE = 'Please, provide at least 3 characters...'
}
