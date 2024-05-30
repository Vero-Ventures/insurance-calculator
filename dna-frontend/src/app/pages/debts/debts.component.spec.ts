import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DebtsComponent } from './debts.component';

describe('DebtsComponent', () => {
  let component: DebtsComponent;
  let fixture: ComponentFixture<DebtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
