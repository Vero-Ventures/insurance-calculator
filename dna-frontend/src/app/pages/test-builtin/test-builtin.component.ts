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
import { LinechartComponent } from 'app/core/components/linechart/linechart.component';
import { NotificationComponent } from 'app/core/components/notification/notification.component';
import { CheckboxBlockComponent } from 'app/core/components/checkbox-block/checkbox-block.component';
import { InputSliderComponent } from 'app/core/components/input-slider/input-slider.component';
import { TextareaComponent } from 'app/core/components/textarea/textarea.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';
import { TuiPoint } from '@taiga-ui/core';

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
    selectControlName: new FormControl(),
    checkboxControlName: new FormControl(),
    inputSliderControlName: new FormControl(),
    textareaControlName: new FormControl("Yeah, it's a big ol textarea!"),
  });
  textInputLabel = "It's a label!";
  selectLabel = 'Choice your option';
  items = ['First Option', 'Second Option', 'Third Option'];
  checkboxLabel = 'Check me off';

  sliderInputLabel = 'Drag my handle to choose a number';
  max = 10;
  min = 2;
  quantum = 2;

  textareaLabel = 'Type something really long';

  pageName = 'Testing page';
  validationError = new TuiValidationError('Error! Oh no!');
  buttonIcon = 'tuiIconSettings';
  buttonText = 'Press me!';

  segmentBarMax = 8;
  segmentBarSegments = 8;
  segmentBarValue = 3;

  piechartValues = [20, 20, 35, 25];

  barchartValues = [
    [
      3660, 8281, 1069, 9034, 5797, 6918, 8495, 3234, 6204, 1392, 2088, 8637,
      8779,
    ],
    [
      3952, 3671, 3781, 5323, 3537, 4107, 2962, 3320, 8632, 4755, 9130, 1195,
      3574,
    ],
  ];
  barchartMax = 10000;
  barchartLabelsX = ['July 2025', 'August', 'September'];
  barchartLabelsY = ['0', '2500', '5000', '7500', '10000'];

  linechartValues: readonly TuiPoint[] = [
    [50, 50],
    [100, 75],
    [150, 50],
    [200, 150],
    [250, 155],
    [300, 190],
    [350, 90],
  ];
  linechartX = 0;
  linechartY = 0;
  linechartWidth = 400;
  linechartHeight = 200;
  linechartLabelsX = ['July 2025', 'August', 'September'];
  linechartLabelsY = ['0', '2500', '5000', '7500', '10000'];

  notification = 'This component warns you when something is wrong.';
}
