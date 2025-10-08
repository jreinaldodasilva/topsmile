// backend/tests/unit/pagination.test.ts
import { paginate } from '../../../src/utils/validation/pagination';

describe('Pagination Utility', () => {
  it('calculates pagination metadata', () => {
    const result = paginate(100, 1, 10);
    
    expect(result).toEqual({
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10,
      hasNext: true,
      hasPrev: false,
      skip: 0
    });
  });

  it('handles last page', () => {
    const result = paginate(25, 3, 10);
    
    expect(result).toEqual({
      total: 25,
      page: 3,
      limit: 10,
      totalPages: 3,
      hasNext: false,
      hasPrev: true,
      skip: 20
    });
  });

  it('handles middle page', () => {
    const result = paginate(100, 5, 10);
    
    expect(result).toEqual({
      total: 100,
      page: 5,
      limit: 10,
      totalPages: 10,
      hasNext: true,
      hasPrev: true,
      skip: 40
    });
  });

  it('handles single page', () => {
    const result = paginate(5, 1, 10);
    
    expect(result).toEqual({
      total: 5,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
      skip: 0
    });
  });
});
