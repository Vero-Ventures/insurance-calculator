import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiTextareaModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiTextareaModule,
    TuiButtonModule,
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent {
  promptForm = new FormGroup({
    prompt: new FormControl(),
  });

  get prompt(): string {
    return this.promptForm.controls['prompt'].value as string;
  }

  @Output() send = new EventEmitter();
}
