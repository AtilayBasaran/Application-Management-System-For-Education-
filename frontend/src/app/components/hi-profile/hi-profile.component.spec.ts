import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiProfileComponent } from './hi-profile.component';

describe('HiProfileComponent', () => {
  let component: HiProfileComponent;
  let fixture: ComponentFixture<HiProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
