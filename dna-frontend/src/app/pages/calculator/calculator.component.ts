import { NgIf } from '@angular/common';
import { Component, Inject, NgZone, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { SupabaseService } from 'app/core/services/supabase.service';
import { TextboxComponent } from 'app/core/components/textbox/textbox.component';
import { ErrorComponent } from 'app/core/components/error/error.component';
import { ButtonComponent } from 'app/core/components/button/button.component';
import { AppbarComponent } from 'app/core/components/appbar/appbar.component';
import { TabsComponent } from 'app/core/components/tabs/tabs.component';
import { DatalistComponent } from 'app/core/components/datalist/datalist.component';
import { ProgressSegmentedComponent } from 'app/core/components/progress-segmented/progress-segmented.component';
import { PiechartComponent } from 'app/core/components/piechart/piechart.component';
import { BarchartComponent } from 'app/core/components/barchart/barchart.component';
import { AxesComponent } from 'app/core/components/axes/axes.component';
import { LinechartComponent } from 'app/core/components/linechart/linechart.component';
import { NotificationComponent } from 'app/core/components/notification/notification.component';
import { CheckboxBlockComponent } from 'app/core/components/checkbox-block/checkbox-block.component';
import { InputSliderComponent } from 'app/core/components/input-slider/input-slider.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    NgIf,
    TextboxComponent,
    ErrorComponent,
    ButtonComponent,
    AppbarComponent,
    TabsComponent,
    DatalistComponent,
    ProgressSegmentedComponent,
    PiechartComponent,
    BarchartComponent,
    AxesComponent,
    LinechartComponent,
    NotificationComponent,
    CheckboxBlockComponent,
    InputSliderComponent,
  ],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
})
export class CalculatorComponent {
  userData = signal({});

  constructor(
    @Inject(TuiDialogService)
    private readonly dialog: TuiDialogService,
    private readonly supabase: SupabaseService,
    private readonly router: Router,
    private readonly zone: NgZone
  ) {
    this.supabase.currentUser.subscribe(user => {
      console.log(user);
      this.userData.set(user?.user_metadata?.['email']);
      console.log(this.userData());
    });
  }

  signOut() {
    this.supabase.signOut();
    this.zone.run(() => {
      this.router.navigate(['/auth']);
    });
  }

  open(message: string) {
    this.dialog.open(message).subscribe();
  }
}
