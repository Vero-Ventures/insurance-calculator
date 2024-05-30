import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TestPageComponent } from './test-page.component';

describe('TestPageComponent', () => {
  let component: TestPageComponent;
  let fixture: ComponentFixture<TestPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
