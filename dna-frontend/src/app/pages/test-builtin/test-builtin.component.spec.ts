import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBuiltinComponent } from './test-builtin.component';

describe('TestBuiltinComponent', () => {
  let component: TestBuiltinComponent;
  let fixture: ComponentFixture<TestBuiltinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestBuiltinComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestBuiltinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
