import { NgIf } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiDataListModule, TuiNotificationModule } from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputSliderModule,
  TuiSelectModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { CalculatorComponent } from '../calculator/calculator.component';
import { MultiValueCardComponent } from 'app/core/components/multi-value-card/multi-value-card.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputDateModule,
    TuiInputNumberModule,
    TuiInputSliderModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiTabsModule,
    TuiNotificationModule,
    NgIf,
    MultiValueCardComponent,
    CalculatorComponent,
  ],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsComponent {
  activeItemIndex = 0;
}
