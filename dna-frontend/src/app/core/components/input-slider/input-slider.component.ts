import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiInputSliderModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-input-slider',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TuiInputSliderModule],
  templateUrl: './input-slider.component.html',
  styleUrl: './input-slider.component.scss',
})
export class InputSliderComponent {
  @Input() formControlName = 'inputSliderControlName';
  @Input() max = 10;
  @Input() min = 5;
  @Input() quantum = 1;
  @Input() label = '';
}
