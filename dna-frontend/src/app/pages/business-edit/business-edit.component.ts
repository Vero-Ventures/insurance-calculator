import { Location, NgIf } from '@angular/common';
import { Component, Input, NgZone } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TuiButtonModule, TuiNotificationModule } from '@taiga-ui/core';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { ActionBarComponent } from 'app/core/components/action-bar/action-bar.component';
import { BottomBarComponent } from 'app/core/components/bottom-bar/bottom-bar.component';
import { HeaderBarComponent } from 'app/core/components/header-bar/header-bar.component';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';

@Component({
  selector: 'app-business-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputNumberModule,
    HorizontalDividerComponent,
    HeaderBarComponent,
    ActionBarComponent,
    BottomBarComponent,
    TuiTabsModule,
    NgIf,
    TuiButtonModule,
    TuiNotificationModule,
  ],
  templateUrl: './business-edit.component.html',
  styleUrl: './business-edit.component.scss',
})
export class BusinessEditComponent {
  activeItemIndex = 0;
  @Input() businessId: number = 0;
  @Input() clientId: number = 0;
  readonly businessEditInformationForm = new FormGroup({
    name: new FormControl(),
    valuation: new FormControl(),
    ebitda: new FormControl(),
    appreciationRate: new FormControl(),
    term: new FormControl(),
  });
  readonly businessEditShareholdersForm = new FormGroup({
    shareholders: new FormArray([]),
  });

  constructor(
    private zone: NgZone,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.businessId = +params['businessId'];
      this.clientId = +params['clientId'];
    });
  }

  get shareholders(): FormArray {
    return this.businessEditShareholdersForm.get('shareholders') as FormArray;
  }

  createShareholder(): FormGroup {
    return new FormGroup({
      name: new FormControl(),
      sharePercentage: new FormControl(),
      insuranceCoverage: new FormControl(),
      ebitdaContributionPercentage: new FormControl(),
    });
  }

  addShareholder() {
    this.shareholders.push(this.createShareholder());
  }

  removeShareholder(index: number) {
    this.shareholders.removeAt(index);
  }

  cancel() {
    this.zone.run(() => {
      this.location.back();
    });
  }

  save() {
    this.zone.run(() => {
      this.location.back();
    });
  }
}
