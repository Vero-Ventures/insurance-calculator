import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { AdvisorBarComponent } from 'app/core/components/advisor-bar/advisor-bar.component';
import { ChatInputComponent } from 'app/core/components/chat-input/chat-input.component';
import { ChatboxComponent } from 'app/core/components/chatbox/chatbox.component';

@Component({
  selector: 'app-advisor',
  standalone: true,
  imports: [AdvisorBarComponent, ChatboxComponent, ChatInputComponent, NgFor],
  templateUrl: './advisor.component.html',
  styleUrl: './advisor.component.scss',
})
export class AdvisorComponent {
  messages = [
    {
      side: 'right',
      author: 'You',
      contents: 'Question?',
    },
    {
      side: 'left',
      author: 'Robo-Advisor',
      contents: 'Answer.',
    },
  ];
}
