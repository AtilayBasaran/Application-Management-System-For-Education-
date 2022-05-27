import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HodApplicationComponent } from './hod-application.component';

describe('HodApplicationComponent', () => {
  let component: HodApplicationComponent;
  let fixture: ComponentFixture<HodApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HodApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HodApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
