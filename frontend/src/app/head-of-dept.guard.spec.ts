import { TestBed } from '@angular/core/testing';

import { HeadOfDeptGuard } from './head-of-dept.guard';

describe('HeadOfDeptGuard', () => {
  let guard: HeadOfDeptGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HeadOfDeptGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
