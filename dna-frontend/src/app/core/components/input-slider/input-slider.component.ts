import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiInputSliderModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-input-slider',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TuiInputSliderModule],
  templateUrl: './input-slider.component.html',
  styleUrl: './input-slider.component.scss',
})
export class InputSliderComponent {
  readonly testValue = 10;
  readonly min = 5;
  readonly max = 20;
  readonly sliderStep = 1;
  readonly steps = (this.max - this.min) / this.sliderStep;
  readonly quantum = 0.01;

  readonly hint = `Dragging slider change input by ${this.sliderStep}.\nBut you can type decimal number which is multiple of ${this.quantum}.`;

  testForm = new FormGroup({
    testValue: new FormControl(),
  });
}
