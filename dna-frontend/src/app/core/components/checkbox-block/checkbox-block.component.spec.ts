import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxBlockComponent } from './checkbox-block.component';

describe('CheckboxBlockComponent', () => {
  let component: CheckboxBlockComponent;
  let fixture: ComponentFixture<CheckboxBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
