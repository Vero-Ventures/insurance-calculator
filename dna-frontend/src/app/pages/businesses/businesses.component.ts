import { Component } from '@angular/core';
import { CalculatorComponent } from '../calculator/calculator.component';
import { NgIf } from '@angular/common';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { TuiButtonModule } from '@taiga-ui/core';
import { LineChartComponent } from 'app/core/components/line-chart/line-chart.component';
import { ValueCardComponent } from 'app/core/components/value-card/value-card.component';
import { ValueListCardComponent } from 'app/core/components/value-list-card/value-list-card.component';

@Component({
  selector: 'app-businesses',
  standalone: true,
  imports: [
    CalculatorComponent,
    NgIf,
    TuiInputModule,
    TuiInputNumberModule,
    HorizontalDividerComponent,
    TuiTabsModule,
    TuiButtonModule,
    LineChartComponent,
    ValueCardComponent,
    ValueListCardComponent,
  ],
  templateUrl: './businesses.component.html',
  styleUrl: './businesses.component.scss',
})
export class BusinessesComponent {
  activeItemIndex = 0;

  valueList = [
    { label: 'EBITDA Contribution ($CAD)', value: '$600,000.00' },
    { label: 'Share Value ($CAD)', value: '$1,000,000' },
    { label: 'Liquidation Disparity ($CAD)', value: '$1,000,000' },
  ];
}
