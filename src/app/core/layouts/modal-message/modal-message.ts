import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IMessage } from '../../services/app-message-service';

@Component({
  selector: 'app-modal-message',
  imports: [MatDialogModule],
  templateUrl: './modal-message.html',
  styleUrl: './modal-message.scss',
})
export class ModalMessage {

  readonly message = inject<IMessage>(MAT_DIALOG_DATA);
  readonly ref = inject(MatDialogRef<ModalMessage>);

}