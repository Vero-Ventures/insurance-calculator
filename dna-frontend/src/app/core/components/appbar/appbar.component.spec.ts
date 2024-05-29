import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppbarComponent } from './appbar.component';

describe('AppbarComponent', () => {
  let component: AppbarComponent;
  let fixture: ComponentFixture<AppbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should construct a route with a clientId', () => {
    expect(component.constructRoute('test')).toBe('/test/0');
  });

  it('should construct a route without a clientId', () => {
    expect(component.constructRouteWithoutClientId('test')).toBe('/test/');
  });
});
