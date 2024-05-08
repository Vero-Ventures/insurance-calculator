import { NgIf } from '@angular/common';
import { Component, Inject, NgZone, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { SupabaseService } from 'app/core/services/supabase.service';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [NgIf],
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
