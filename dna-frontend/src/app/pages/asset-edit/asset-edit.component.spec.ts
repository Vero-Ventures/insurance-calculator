import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AssetEditComponent } from './asset-edit.component';

describe('AssetEditComponent', () => {
  let component: AssetEditComponent;
  let fixture: ComponentFixture<AssetEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetEditComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
