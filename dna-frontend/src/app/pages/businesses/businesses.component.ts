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
  ],
  templateUrl: './businesses.component.html',
  styleUrl: './businesses.component.scss',
})
export class BusinessesComponent {
  activeItemIndex = 0;
}
