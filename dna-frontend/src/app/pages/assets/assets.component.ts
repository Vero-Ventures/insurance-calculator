import { NgIf } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiNotificationModule } from '@taiga-ui/core';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { CalculatorComponent } from '../calculator/calculator.component';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { ValueCardComponent } from 'app/core/components/value-card/value-card.component';
import { LineChartComponent } from 'app/core/components/line-chart/line-chart.component';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiTabsModule,
    TuiNotificationModule,
    TuiButtonModule,
    HorizontalDividerComponent,
    NgIf,
    ValueCardComponent,
    CalculatorComponent,
    LineChartComponent,
  ],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsComponent {
  activeItemIndex = 0;

  totalInitialValue = {
    label: 'Total Initial Value ($)',
    value: '$1,000,000',
  };
  totalInsurableFutureValue = {
    label: 'Total Insurable Future Value ($)',
    value: '$1,000,000',
  };
}
