import { Location, NgIf } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  TuiButtonModule,
  TuiDialogService,
  TuiNotificationModule,
} from '@taiga-ui/core';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { ActionBarComponent } from 'app/core/components/action-bar/action-bar.component';
import { BottomBarComponent } from 'app/core/components/bottom-bar/bottom-bar.component';
import { HeaderBarComponent } from 'app/core/components/header-bar/header-bar.component';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { Shareholder } from 'app/core/models/business.model';
import { BusinessesStore } from '../businesses/businesses.store';
import { take } from 'rxjs';

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
  providers: [BusinessesStore],
})
export class BusinessEditComponent implements OnInit, OnDestroy {
  @Input() businessId: number = 0;
  @Input() clientId: number = 0;
  activeItemIndex = 0;
  vm$ = this.businessesStore.vm$;
  readonly businessEditInformationForm = new FormGroup({
    name: new FormControl(),
    valuation: new FormControl(),
    ebitda: new FormControl(),
    appreciationRate: new FormControl(),
    term: new FormControl(),
  });
  readonly businessEditShareholdersForm = this.fb.group({
    shareholders: this.fb.array<Shareholder>([]),
  });

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private readonly businessesStore: BusinessesStore,
    private readonly fb: FormBuilder,
    private readonly zone: NgZone,
    private readonly route: ActivatedRoute,
    private readonly location: Location
  ) {
    this.route.params.subscribe(params => {
      this.businessId = +params['businessId'];
      this.clientId = +params['clientId'];
      this.businessesStore.getBusinesses(this.clientId);
      // This is necessary to first populate the form with the initial state and then the data from the db
      this.vm$.pipe(take(2)).subscribe(state => {
        const business = state.businesses.find(
          business => parseInt(business.id) === this.businessId
        );
        if (business) {
          this.businessEditInformationForm.patchValue(business);
        }
      });
    });
  }

  get shareholders(): FormArray {
    return this.businessEditShareholdersForm.get('shareholders') as FormArray;
  }

  ngOnInit() {
    this.businessEditInformationForm.valueChanges.subscribe(business => {
      this.vm$.pipe(take(1)).subscribe(state => {
        const foundBusiness = state.businesses.find(
          b => parseInt(b.id) === this.businessId
        );
        if (foundBusiness) {
          foundBusiness.name = business.name;
          foundBusiness.valuation = business.valuation;
          foundBusiness.ebitda = business.ebitda;
          foundBusiness.appreciationRate = business.appreciationRate;
          foundBusiness.term = business.term;
          this.businessesStore.setBusinesses(state.businesses);
        }
      });
    });
    this.businessEditShareholdersForm.valueChanges.subscribe(formData => {
      this.vm$.pipe(take(1)).subscribe(state => {
        const foundBusiness = state.businesses.find(
          b => parseInt(b.id) === this.businessId
        );
        if (foundBusiness) {
          foundBusiness.shareholders =
            (formData.shareholders as Shareholder[]) || [];
          this.businessesStore.setBusinesses(state.businesses);
        }
      });
    });
  }

  ngOnDestroy() {
    this.businessesStore.updateBusinesses(this.clientId);
  }

  onBlur() {
    this.businessesStore.updateBusinesses(this.clientId);
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
