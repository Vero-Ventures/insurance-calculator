import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DebtEditComponent } from './debt-edit.component';

describe('DebtEditComponent', () => {
  let component: DebtEditComponent;
  let fixture: ComponentFixture<DebtEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtEditComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
