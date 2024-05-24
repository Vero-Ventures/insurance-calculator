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
  defaultName = 'You';
  messages: Array<{ side: string; author: string; contents: string }> = [];

  addMessage(author: string, contents: string) {
    const side = author == 'Robo-Advisor' ? 'left' : 'right';
    this.messages.push({
      side: side,
      author: author,
      contents: contents,
    });
  }

  sendMessage(author: string, contents: string) {
    this.addMessage(author, contents);

    // TODO: Connect to LLM here and use addMessage when LLM responds
  }
}
