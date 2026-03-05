import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFilters, INITIAL_FILTERS, INITIAL_INDICATORS } from '../../hooks/useFilters';
import { apiRequest } from '../../api/apiClient';

vi.mock('../../api/apiClient');

describe('useFilters', () => {
  const mockIndicatorsData = {
    data: [
      {
        id: '1',
        value: '192.168.1.1',
        type: 'ip' as const,
        severity: 'high' as const,
        source: 'AbuseIPDB' as const,
        firstSeen: '2024-03-01T00:00:00.000Z',
        lastSeen: '2024-03-04T00:00:00.000Z',
        tags: ['malware'],
        confidence: 80,
      },
    ],
    total: 50,
    page: 1,
    totalPages: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default filters', () => {
      vi.mocked(apiRequest).mockResolvedValue(INITIAL_INDICATORS);
      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toEqual(INITIAL_FILTERS);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toEqual(INITIAL_INDICATORS);
    });

    it('should fetch data on mount', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      
      renderHook(() => useFilters());

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith({
          method: 'get',
          url: '/api/indicators',
          params: INITIAL_FILTERS,
          setLoading: expect.any(Function),
          setError: expect.any(Function),
        });
      });
    });
  });

  describe('handleFilterChange()', () => {
    it('should update filter value for non-search fields', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'severity', value: 'high' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      expect(result.current.filters.severity).toBe('high');
      expect(result.current.filters.page).toBe(1);
    });

    it('should update filter value for select elements', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'type', value: 'ip' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      expect(result.current.filters.type).toBe('ip');
    });

    it('should update filter value for input elements', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'source', value: 'VirusTotal' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.filters.source).toBe('VirusTotal');
    });

    it('should reset page to 1 when filter changes', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'severity', value: 'critical' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      expect(result.current.filters.page).toBe(1);
    });

    it('should trigger immediate fetch for non-search filters', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      vi.clearAllMocks();

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'severity', value: 'high' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({
              severity: 'high',
            }),
          })
        );
      });
    });

    it('should debounce search filter changes', async () => {
      vi.useFakeTimers();
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      vi.clearAllMocks();

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'search', value: 'malware' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(apiRequest).not.toHaveBeenCalled();

      await act(async () => {
        vi.runAllTimers();
      });

      expect(apiRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'malware',
          }),
        })
      );

      vi.useRealTimers();
    });

    it('should cancel previous debounced search when new search is typed', async () => {
      vi.useFakeTimers();
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      vi.clearAllMocks();

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'search', value: 'mal' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'search', value: 'malware' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(apiRequest).toHaveBeenCalledTimes(1);
      expect(apiRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'malware',
          }),
        })
      );

      vi.useRealTimers();
    });
  });

  describe('handlePaginationChange()', () => {
    it('should go to previous page', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handlePaginationChange({
          currentTarget: { dataset: { dir: 'next' } },
        } as unknown as React.MouseEvent<HTMLButtonElement>);
      });

      await waitFor(() => {
        expect(result.current.filters.page).toBe(2);
      });

      act(() => {
        result.current.handlePaginationChange({
          currentTarget: { dataset: { dir: 'prev' } },
        } as unknown as React.MouseEvent<HTMLButtonElement>);
      });

      await waitFor(() => {
        expect(result.current.filters.page).toBe(1);
      });
    });

    it('should go to next page', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handlePaginationChange({
          currentTarget: { dataset: { dir: 'next' } },
        } as unknown as React.MouseEvent<HTMLButtonElement>);
      });

      await waitFor(() => {
        expect(result.current.filters.page).toBe(2);
      });
    });

    it('should go to specific page number', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handlePaginationChange({
          currentTarget: { dataset: { dir: '5' } },
        } as unknown as React.MouseEvent<HTMLButtonElement>);
      });

      await waitFor(() => {
        expect(result.current.filters.page).toBe(5);
      });
    });

    it('should trigger fetch after pagination change', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      vi.clearAllMocks();

      act(() => {
        result.current.handlePaginationChange({
          currentTarget: { dataset: { dir: 'next' } },
        } as unknown as React.MouseEvent<HTMLButtonElement>);
      });

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({
              page: 2,
            }),
          })
        );
      });
    });

    it('should handle multiple pagination clicks', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handlePaginationChange({
          currentTarget: { dataset: { dir: 'next' } },
        } as unknown as React.MouseEvent<HTMLButtonElement>);
      });

      await waitFor(() => {
        expect(result.current.filters.page).toBe(2);
      });

      act(() => {
        result.current.handlePaginationChange({
          currentTarget: { dataset: { dir: 'next' } },
        } as unknown as React.MouseEvent<HTMLButtonElement>);
      });

      await waitFor(() => {
        expect(result.current.filters.page).toBe(3);
      });
    });
  });

  describe('handleSorting()', () => {
    it('should set sort field and order to Az on first click', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleSorting({
          currentTarget: { dataset: { sortid: 'severity' } },
        } as unknown as React.MouseEvent<HTMLHeadingElement, MouseEvent>);
      });

      expect(result.current.filters.sort).toBe('severity');
      expect(result.current.filters.order).toBe('Az');
    });

    it('should toggle order from Az to Za on second click', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleSorting({
          currentTarget: { dataset: { sortid: 'severity' } },
        } as unknown as React.MouseEvent<HTMLHeadingElement, MouseEvent>);
      });

      expect(result.current.filters.order).toBe('Az');

      act(() => {
        result.current.handleSorting({
          currentTarget: { dataset: { sortid: 'severity' } },
        } as unknown as React.MouseEvent<HTMLHeadingElement, MouseEvent>);
      });

      expect(result.current.filters.order).toBe('Za');
    });

    it('should toggle order from Za to Az on third click', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleSorting({
          currentTarget: { dataset: { sortid: 'value' } },
        } as unknown as React.MouseEvent<HTMLHeadingElement, MouseEvent>);
      });

      act(() => {
        result.current.handleSorting({
          currentTarget: { dataset: { sortid: 'value' } },
        } as unknown as React.MouseEvent<HTMLHeadingElement, MouseEvent>);
      });

      expect(result.current.filters.order).toBe('Za');

      act(() => {
        result.current.handleSorting({
          currentTarget: { dataset: { sortid: 'value' } },
        } as unknown as React.MouseEvent<HTMLHeadingElement, MouseEvent>);
      });

      expect(result.current.filters.order).toBe('Az');
    });

    it('should change sort field when clicking different column', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleSorting({
          currentTarget: { dataset: { sortid: 'severity' } },
        } as unknown as React.MouseEvent<HTMLHeadingElement, MouseEvent>);
      });

      expect(result.current.filters.sort).toBe('severity');

      act(() => {
        result.current.handleSorting({
          currentTarget: { dataset: { sortid: 'type' } },
        } as unknown as React.MouseEvent<HTMLHeadingElement, MouseEvent>);
      });

      expect(result.current.filters.sort).toBe('type');
    });

    it('should trigger fetch after sorting change', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      vi.clearAllMocks();

      act(() => {
        result.current.handleSorting({
          currentTarget: { dataset: { sortid: 'severity' } },
        } as unknown as React.MouseEvent<HTMLHeadingElement, MouseEvent>);
      });

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({
              sort: 'severity',
              order: 'Az',
            }),
          })
        );
      });
    });
  });

  describe('fetchFilters()', () => {
    it('should call apiRequest with correct parameters', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      vi.clearAllMocks();

      await act(async () => {
        await result.current.fetchFilters();
      });

      expect(apiRequest).toHaveBeenCalledWith({
        method: 'get',
        url: '/api/indicators',
        params: INITIAL_FILTERS,
        setLoading: expect.any(Function),
        setError: expect.any(Function),
      });
    });

    it('should update data state with API response', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      await waitFor(() => {
        expect(result.current.data).toEqual(mockIndicatorsData);
      });
    });

    it('should call apiRequest with updated filters', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      vi.clearAllMocks();

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'severity', value: 'critical' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({
              severity: 'critical',
            }),
          })
        );
      });
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network error';
      vi.mocked(apiRequest).mockImplementation(async ({ setError }) => {
        setError(errorMessage);
        throw new Error(errorMessage);
      });

      const { result } = renderHook(() => useFilters());

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });
    });

    it('should update loading state during fetch', async () => {
      let resolveApiRequest: (value: any) => void;
      const apiPromise = new Promise((resolve) => {
        resolveApiRequest = resolve;
      });

      let setLoadingFn: ((loading: boolean) => void) | null = null;

      vi.mocked(apiRequest).mockImplementation(async ({ setLoading }) => {
        setLoadingFn = setLoading;
        setLoading(true);
        const result = await apiPromise;
        setLoading(false);
        return result;
      });

      const { result } = renderHook(() => useFilters());

      await waitFor(() => {
        expect(setLoadingFn).not.toBeNull();
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        resolveApiRequest!(mockIndicatorsData);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('filters state', () => {
    it('should maintain all filter properties', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toHaveProperty('search');
      expect(result.current.filters).toHaveProperty('severity');
      expect(result.current.filters).toHaveProperty('source');
      expect(result.current.filters).toHaveProperty('type');
      expect(result.current.filters).toHaveProperty('page');
      expect(result.current.filters).toHaveProperty('limit');
    });

    it('should update multiple filters independently', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'severity', value: 'high' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'type', value: 'ip' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      expect(result.current.filters.severity).toBe('high');
      expect(result.current.filters.type).toBe('ip');
    });

    it('should preserve other filters when one changes', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'severity', value: 'high' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'type', value: 'ip' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      expect(result.current.filters.severity).toBe('high');
      expect(result.current.filters.search).toBe('');
      expect(result.current.filters.limit).toBe(20);
    });

    it('should reset to initial filters when clearFilters is called', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'severity', value: 'high' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'type', value: 'ip' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual(INITIAL_FILTERS);
    });

    it('should trigger fetch after clearFilters', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'severity', value: 'high' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      vi.clearAllMocks();

      act(() => {
        result.current.clearFilters();
      });

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            params: INITIAL_FILTERS,
          })
        );
      });
    });
  });

  describe('data state', () => {
    it('should initialize with empty data', () => {
      vi.mocked(apiRequest).mockResolvedValue(INITIAL_INDICATORS);
      const { result } = renderHook(() => useFilters());

      expect(result.current.data).toEqual(INITIAL_INDICATORS);
    });

    it('should update data after successful fetch', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      await waitFor(() => {
        expect(result.current.data).toEqual(mockIndicatorsData);
      });
    });

    it('should maintain data structure with pagination info', async () => {
      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      await waitFor(() => {
        expect(result.current.data).toHaveProperty('data');
        expect(result.current.data).toHaveProperty('total');
        expect(result.current.data).toHaveProperty('page');
        expect(result.current.data).toHaveProperty('totalPages');
      });
    });

    it('should update data when filters change', async () => {
      const filteredData = {
        ...mockIndicatorsData,
        total: 10,
        totalPages: 1,
      };

      vi.mocked(apiRequest).mockResolvedValue(mockIndicatorsData);
      const { result } = renderHook(() => useFilters());

      await waitFor(() => {
        expect(result.current.data.total).toBe(50);
      });

      vi.mocked(apiRequest).mockResolvedValue(filteredData);

      act(() => {
        result.current.handleFilterChange({
          target: { name: 'severity', value: 'critical' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      await waitFor(() => {
        expect(result.current.data.total).toBe(10);
      });
    });
  });
});
