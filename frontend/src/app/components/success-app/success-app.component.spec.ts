import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessAppComponent } from './success-app.component';

describe('SuccessAppComponent', () => {
  let component: SuccessAppComponent;
  let fixture: ComponentFixture<SuccessAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
