import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LegendItem } from 'app/core/models/legend.model';

@Component({
  selector: 'app-legend',
  standalone: true,
  imports: [NgFor],
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.scss',
})
export class LegendComponent {
  @Input() items: LegendItem[] = [];
}
