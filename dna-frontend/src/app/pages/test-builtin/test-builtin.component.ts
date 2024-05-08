import { Component } from '@angular/core';
import { TextboxComponent } from 'app/core/components/textbox/textbox.component';
import { ErrorComponent } from 'app/core/components/error/error.component';
import { ButtonComponent } from 'app/core/components/button/button.component';
import { AppbarComponent } from 'app/core/components/appbar/appbar.component';
import { TabsComponent } from 'app/core/components/tabs/tabs.component';
import { SelectComponent } from 'app/core/components/select/select.component';
import { ProgressSegmentedComponent } from 'app/core/components/progress-segmented/progress-segmented.component';
import { PiechartComponent } from 'app/core/components/piechart/piechart.component';
import { BarchartComponent } from 'app/core/components/barchart/barchart.component';
import { AxesComponent } from 'app/core/components/axes/axes.component';
import { LinechartComponent } from 'app/core/components/linechart/linechart.component';
import { NotificationComponent } from 'app/core/components/notification/notification.component';
import { CheckboxBlockComponent } from 'app/core/components/checkbox-block/checkbox-block.component';
import { InputSliderComponent } from 'app/core/components/input-slider/input-slider.component';
import { TextareaComponent } from 'app/core/components/textarea/textarea.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';

@Component({
  selector: 'app-test-builtin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextboxComponent,
    ErrorComponent,
    ButtonComponent,
    AppbarComponent,
    TabsComponent,
    SelectComponent,
    ProgressSegmentedComponent,
    PiechartComponent,
    BarchartComponent,
    AxesComponent,
    LinechartComponent,
    NotificationComponent,
    CheckboxBlockComponent,
    InputSliderComponent,
    TextareaComponent,
  ],
  templateUrl: './test-builtin.component.html',
  styleUrl: './test-builtin.component.scss',
})
export class TestBuiltinComponent {
  formGroup = new FormGroup({
    textboxControlName: new FormControl('prefilled value'),
  });
  textInputLabel = "It's a label!";
  pageName = 'Testing page';
  validationError = new TuiValidationError('Error! Oh no!');
  buttonIcon = 'tuiIconSettings';
  buttonText = 'Press me!';
}
