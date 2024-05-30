import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BottomBarComponent } from './bottom-bar.component';

describe('BottomBarComponent', () => {
  let component: BottomBarComponent;
  let fixture: ComponentFixture<BottomBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomBarComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not disable back button', () => {
    expect(component.isBackButtonDisabled()).toBeFalse();
  });

  it('should not disable next button', () => {
    expect(component.isNextButtonDisabled()).toBeFalse();
  });

  it('should return the previous page name', () => {
    expect(component.getPreviousPageName()).toBe(
      component.pageList[component.getPageIndex() - 1]
    );
  });

  it('should return the next page name', () => {
    expect(component.getNextPageName()).toBe(
      component.pageList[component.getPageIndex() + 1]
    );
  });

  it('should go to the previous page', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    const previousPageName = component.getPreviousPageName();
    component.back();
    expect(router.navigate).toHaveBeenCalledWith([
      `/${previousPageName}/${component.clientId}`,
    ]);
  });

  it('should go to the next page', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    const nextPageName = component.getNextPageName();
    component.next();
    expect(router.navigate).toHaveBeenCalledWith([
      `/${nextPageName}/${component.clientId}`,
    ]);
  });
});
