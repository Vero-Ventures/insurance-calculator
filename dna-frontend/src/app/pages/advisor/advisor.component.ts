import { Component } from '@angular/core';
import { AdvisorBarComponent } from 'app/core/components/advisor-bar/advisor-bar.component';
import { ChatInputComponent } from 'app/core/components/chat-input/chat-input.component';
import { ChatboxComponent } from 'app/core/components/chatbox/chatbox.component';

@Component({
  selector: 'app-advisor',
  standalone: true,
  imports: [AdvisorBarComponent, ChatboxComponent, ChatInputComponent],
  templateUrl: './advisor.component.html',
  styleUrl: './advisor.component.scss',
})
export class AdvisorComponent {}
