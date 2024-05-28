import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TotalNeedsComponent } from './total-needs.component';

describe('TotalNeedsComponent', () => {
  let component: TotalNeedsComponent;
  let fixture: ComponentFixture<TotalNeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalNeedsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: {
              title: 'Test',
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form array', () => {
    component.createNeed();
    expect(component.needs.length).toBe(1);
  });
});
