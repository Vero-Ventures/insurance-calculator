import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  // queryEndpoint = 'https://insurance-calculator-backend.onrender.com/api/v1/advisor/query';
  queryEndpoint = 'https://dna-backend-32fw.onrender.com/api/v1/advisor/query';

  defaultUsername = 'You';
  defaultAdvisorName = 'Robo-Advisor';
  messages: Array<{ side: string; author: string; contents: string }> = [];
  http: HttpClient;

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }

  addMessage(author: string, contents: string) {
    const side = author == this.defaultAdvisorName ? 'left' : 'right';
    this.messages.push({
      side: side,
      author: author,
      contents: contents,
    });
  }

  sendMessage(author: string, contents: string) {
    if (contents.trim().length == 0) {
      return;
    }

    this.addMessage(author, contents);

    this.http
      .post<ApiResponse>(this.queryEndpoint, {
        prompt: contents,
      })
      .subscribe(value => {
        console.log(value);
        this.addMessage(this.defaultAdvisorName, value.data);
      });
  }
}
type ApiResponse = {
  data: string;
};
