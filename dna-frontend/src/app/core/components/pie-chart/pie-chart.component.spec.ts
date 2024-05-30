import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartComponent } from './pie-chart.component';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    component.value = [
      {
        label: 'name',
        value: '1',
      },
      {
        label: 'name',
        value: '2',
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the total value', () => {
    expect(component.total).toEqual(
      component.value.reduce((acc, item) => acc + parseFloat(item.value), 0)
    );
  });

  it('should return the names', () => {
    expect(component.names).toEqual(component.value.map(item => item.label));
  });

  it('should return the values', () => {
    expect(component.values).toEqual(
      component.value.map(item => parseFloat(item.value) / component.total)
    );
  });
});
