import { Component, Input } from '@angular/core';
import {
  TuiNotificationModule,
  tuiNotificationOptionsProvider,
} from '@taiga-ui/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [TuiNotificationModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  providers: [
    tuiNotificationOptionsProvider({
      icon: 'tuiIconHelpCircle',
      status: 'warning',
    }),
  ],
})
export class NotificationComponent {
  @Input() notification = '';
  onClose() {}
}
