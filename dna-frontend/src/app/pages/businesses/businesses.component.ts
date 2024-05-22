import { Component, Input } from '@angular/core';
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
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BusinessesStore } from './businesses.store';
import { ActivatedRoute } from '@angular/router';

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
  providers: [BusinessesStore],
  templateUrl: './businesses.component.html',
  styleUrl: './businesses.component.scss',
})
export class BusinessesComponent {
  mainActiveItemIndex = 0;
  @Input() clientId: number = 0;

  form = this.formBuilder.group({
    businesses: this.formBuilder.array([]),
  });

  valueList = [
    { label: 'EBITDA Contribution ($CAD)', value: '$600,000.00' },
    { label: 'Share Value ($CAD)', value: '$1,000,000' },
    { label: 'Liquidation Disparity ($CAD)', value: '$1,000,000' },
  ];
  vm$ = this.businessesStore.vm$;

  constructor(
    private formBuilder: FormBuilder,
    private businessesStore: BusinessesStore,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['id'];
    });
  }

  get businesses() {
    return this.form.controls['businesses'] as FormArray;
  }

  addBusiness() {
    const businessForm = this.formBuilder.group({
      name: new FormControl(), // String
      valuation: new FormControl(), // Number
    });
    this.businesses.push(businessForm);
  }

  deleteBusiness(index: number) {
    this.businesses.removeAt(index);
  }

  editBusiness(
    index: number,
    updatedValues: {
      name?: string;
      valuation?: number;
      ebitda?: number;
      apperciationRate?: number;
      term?: number;
    }
  ) {
    const currentBusiness = this.businesses.at(index) as FormGroup;
    if (updatedValues.name !== undefined) {
      currentBusiness.controls['name'].setValue(updatedValues.name);
    }
    if (updatedValues.valuation !== undefined) {
      currentBusiness.controls['valuation'].setValue(updatedValues.valuation);
    }
  }
}
