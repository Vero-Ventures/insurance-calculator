import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressSegmentedComponent } from './progress-segmented.component';

describe('ProgressSegmentedComponent', () => {
  let component: ProgressSegmentedComponent;
  let fixture: ComponentFixture<ProgressSegmentedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressSegmentedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressSegmentedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
