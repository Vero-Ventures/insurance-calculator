import { Component, Inject, NgZone } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiValidationError } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDialogService,
  TuiErrorModule,
} from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { SupabaseService } from 'app/core/services/supabase.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiButtonModule,
    TuiErrorModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  signInForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  error: TuiValidationError | null = null;

  constructor(
    @Inject(TuiDialogService)
    private readonly dialog: TuiDialogService,
    private supabaseService: SupabaseService,
    private router: Router,
    private zone: NgZone
  ) {}

  showErrorMessage(message: string) {
    this.error = message ? new TuiValidationError(message) : null;
  }

  async onSignup(): Promise<void> {
    try {
      const email = this.signInForm.value.email as string;
      const password = this.signInForm.value.password as string;
      const response = await this.supabaseService.signUp(email, password);
      if (response.error) {
        throw new Error(response.error.message);
      }
      this.zone.run(() => {
        this.router.navigate(['/signup']);
      });
    } catch (error) {
      if (error instanceof Error) {
        this.showErrorMessage(error.message);
      }
    } finally {
      this.signInForm.reset();
    }
  }

  async onLogin(): Promise<void> {
    try {
      const email = this.signInForm.value.email as string;
      const password = this.signInForm.value.password as string;
      const response = await this.supabaseService.signIn(email, password);
      if (response.error) {
        throw new Error(response.error.message);
      }
      this.zone.run(() => {
        this.router.navigate(['/landing']);
      });
    } catch (error) {
      if (error instanceof Error) {
        this.showErrorMessage(error.message);
      }
    } finally {
      this.signInForm.reset();
    }
  }

  open(message: string) {
    this.dialog.open(message).subscribe();
  }
}
