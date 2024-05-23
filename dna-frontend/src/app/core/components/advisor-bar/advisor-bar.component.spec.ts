import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorBarComponent } from './advisor-bar.component';

describe('AdvisorBarComponent', () => {
  let component: AdvisorBarComponent;
  let fixture: ComponentFixture<AdvisorBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvisorBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvisorBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
