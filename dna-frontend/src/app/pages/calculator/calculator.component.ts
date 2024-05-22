import { NgIf } from '@angular/common';
import { Component, Inject, Input, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { AppbarComponent } from 'app/core/components/appbar/appbar.component';
import { BottomBarComponent } from 'app/core/components/bottom-bar/bottom-bar.component';
import { SupabaseService } from 'app/core/services/supabase.service';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [NgIf, AppbarComponent, BottomBarComponent],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
})
export class CalculatorComponent {
  @Input() clientId: number = 0;
  pageName: string;

  constructor(
    @Inject(TuiDialogService)
    private readonly dialog: TuiDialogService,
    private readonly supabase: SupabaseService,
    private readonly router: Router,
    private readonly zone: NgZone,
    private readonly route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['id'];
    });
    this.pageName = this.getPageName();
  }

  toTitleCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  getPageName(): string {
    return this.toTitleCase(this.route.snapshot.title?.split(' | ')[1] || '');
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
