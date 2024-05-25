import { Component } from '@angular/core';
import { LandingCardComponent } from 'app/core/components/landing-card/landing-card.component';
import { ValueCardComponent } from 'app/core/components/value-card/value-card.component';
import { SubscriptionCardComponent } from 'app/core/components/subscription-card/subscription-card.component';
import { MultiValueCardComponent } from 'app/core/components/multi-value-card/multi-value-card.component';
import { ValueListCardComponent } from 'app/core/components/value-list-card/value-list-card.component';
import { BottomBarComponent } from 'app/core/components/bottom-bar/bottom-bar.component';
import { ActionItemComponent } from 'app/core/components/action-item/action-item.component';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [
    SubscriptionCardComponent,
    LandingCardComponent,
    ValueCardComponent,
    MultiValueCardComponent,
    ValueListCardComponent,
    BottomBarComponent,
    ActionItemComponent,
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss',
})
export class TestPageComponent {
  valueCard1 = { label: 'Age', value: '25' };
  valueCard2 = {
    label: 'Amount Insured for Income ($CAD)',
    value: '$1,000,000',
  };
  valueCards = [
    { label: 'Need', value: '$5,000,000' },
    { label: 'Want', value: '$2,000,000' },
  ];
  valueList = [
    { label: 'Amount ($)', value: '$600,000.00' },
    { label: 'Percentage (%)', value: '30.00%' },
    { label: 'Ideal Distribution (%)', value: '30.00%' },
    { label: 'Additional Required ($)', value: '$0.00' },
  ];
}
