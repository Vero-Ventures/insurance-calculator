import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartIslandComponent } from './chart-island.component';

describe('ChartIslandComponent', () => {
  let component: ChartIslandComponent;
  let fixture: ComponentFixture<ChartIslandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartIslandComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartIslandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
