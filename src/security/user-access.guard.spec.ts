import { TestBed } from '@angular/core/testing';

import { UserAccessGuard } from './user-access.guard';

describe('UserAccessGuard', () => {
  let guard: UserAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
