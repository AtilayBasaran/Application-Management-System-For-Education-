import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesRegisterComponent } from './succes-register.component';

describe('SuccesRegisterComponent', () => {
  let component: SuccesRegisterComponent;
  let fixture: ComponentFixture<SuccesRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccesRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccesRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
