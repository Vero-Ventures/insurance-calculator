import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: {
              title: 'Test | Calculator',
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the page name', () => {
    expect(component.getPageName()).toBe('Calculator');
  });

  it('should sign out', () => {
    component.signOut();
    expect(component.signOut).toHaveBeenCalled();
  });

  it('should open a dialog', () => {
    component.open('Hello');
    expect(component.open).toHaveBeenCalled();
  });
});
