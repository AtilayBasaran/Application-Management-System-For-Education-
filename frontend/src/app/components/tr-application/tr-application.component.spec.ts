import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrApplicationComponent } from './tr-application.component';

describe('TrApplicationComponent', () => {
  let component: TrApplicationComponent;
  let fixture: ComponentFixture<TrApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
