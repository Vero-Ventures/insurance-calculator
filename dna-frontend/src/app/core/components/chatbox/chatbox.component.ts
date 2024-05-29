import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.scss',
})
export class ChatboxComponent implements OnChanges {
  @Input() author = 'Robo-Advisor';
  @Input() contents = '';
  @Input() side = 'left';

  authorClass = '';
  contentsClass = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['side']) {
      this.updateClass();
    }
  }

  updateClass() {
    this.authorClass = `author ${this.side}`;
    this.contentsClass = `padding-vertical-s padding-horizontal-s contents-${this.side}`;
  }
}
