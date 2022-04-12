import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngApplicationComponent } from './eng-application.component';

describe('EngApplicationComponent', () => {
  let component: EngApplicationComponent;
  let fixture: ComponentFixture<EngApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
