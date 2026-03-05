import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useIndicators } from '../../hooks/useIndicators';
import { apiRequest } from '../../api/apiClient';
import { toast } from 'react-toastify';

vi.mock('../../api/apiClient');
vi.mock('react-toastify');
vi.mock('../../../server/data.js', () => ({
  confidenceForSeverity: vi.fn((severity: string) => {
    const confidenceMap: Record<string, number> = {
      critical: 95,
      high: 80,
      medium: 60,
      low: 40,
    };
    return confidenceMap[severity] || 50;
  }),
  uuid: vi.fn(() => 'test-uuid-123'),
  randomDate: vi.fn(() => '2024-03-04T12:00:00.000Z'),
}));

describe('useIndicators', () => {
  const mockCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with empty form state', () => {
      const { result } = renderHook(() => useIndicators(mockCancel));

      expect(result.current.form).toEqual({
        source: '',
        type: '',
        value: '',
        severity: '',
        tags: [],
        id: '',
      });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.areFieldFull).toBe(false);
    });
  });

  describe('updateForm()', () => {
    it('should update form field with input value', () => {
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.updateForm({
          target: { name: 'value', value: '192.168.1.1' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.form.value).toBe('192.168.1.1');
    });

    it('should update form field with select value', () => {
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.updateForm({
          target: { name: 'severity', value: 'high' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      expect(result.current.form.severity).toBe('high');
    });

    it('should split tags by comma and trim whitespace', () => {
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.updateForm({
          target: { name: 'tags', value: 'malware, phishing, suspicious' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.form.tags).toEqual(['malware', 'phishing', 'suspicious']);
    });

    it('should handle single tag without comma', () => {
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.updateForm({
          target: { name: 'tags', value: 'malware' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.form.tags).toEqual(['malware']);
    });

    it('should update multiple fields sequentially', () => {
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.updateForm({
          target: { name: 'type', value: 'ip' },
        } as React.ChangeEvent<HTMLSelectElement>);
        result.current.updateForm({
          target: { name: 'source', value: 'AbuseIPDB' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      expect(result.current.form.type).toBe('ip');
      expect(result.current.form.source).toBe('AbuseIPDB');
    });
  });

  describe('formState (areFieldFull)', () => {
    it('should return false when form is empty', () => {
      const { result } = renderHook(() => useIndicators(mockCancel));

      expect(result.current.areFieldFull).toBe(false);
    });

    it('should return false when some fields are missing', () => {
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: '',
          tags: [],
          id: '',
        });
      });

      expect(result.current.areFieldFull).toBe(false);
    });

    it('should return false when tags array is empty', () => {
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: [],
          id: '',
        });
      });

      expect(result.current.areFieldFull).toBe(false);
    });

    it('should return true when all required fields are filled', () => {
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: '',
        });
      });

      expect(result.current.areFieldFull).toBe(true);
    });
  });

  describe('addIndicator()', () => {
    it('should show error toast when fields are not complete', async () => {
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: '',
          type: '',
          value: '',
          severity: '',
          tags: [],
          id: '',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'add');
      });

      expect(toast).toHaveBeenCalledWith('All fields are required', {
        type: 'error',
        toastId: 'indicator-error',
      });
      expect(apiRequest).not.toHaveBeenCalled();
    });

    it('should call apiRequest with POST method when adding new indicator', async () => {
      vi.mocked(apiRequest).mockResolvedValue(undefined);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: '',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'add');
      });

      expect(apiRequest).toHaveBeenCalledWith({
        method: 'post',
        url: '/api/indicators',
        data: expect.objectContaining({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: 'test-uuid-123',
          confidence: 80,
        }),
        setLoading: expect.any(Function),
        setError: expect.any(Function),
      });
      expect(mockCancel).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith('Indicator successfully added', {
        type: 'success',
        toastId: 'indicator-success',
      });
    });

    it('should call apiRequest with PUT method when editing indicator', async () => {
      vi.mocked(apiRequest).mockResolvedValue(undefined);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'VirusTotal',
          type: 'domain',
          value: 'malicious.com',
          severity: 'critical',
          tags: ['phishing'],
          id: 'existing-id-456',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'edit');
      });

      expect(apiRequest).toHaveBeenCalledWith({
        method: 'put',
        url: '/api/indicators',
        data: expect.objectContaining({
          source: 'VirusTotal',
          type: 'domain',
          value: 'malicious.com',
          severity: 'critical',
          tags: ['phishing'],
          id: 'existing-id-456',
          confidence: 95,
        }),
        setLoading: expect.any(Function),
        setError: expect.any(Function),
      });
      expect(mockCancel).toHaveBeenCalled();
    });

    it('should include generated timestamps in indicator data', async () => {
      vi.mocked(apiRequest).mockResolvedValue(undefined);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '10.0.0.1',
          severity: 'medium',
          tags: ['scanner'],
          id: '',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'add');
      });

      expect(apiRequest).toHaveBeenCalled();
      const callArgs = vi.mocked(apiRequest).mock.calls[0]![0];
      expect(callArgs.data).toHaveProperty('firstSeen');
      expect(callArgs.data).toHaveProperty('lastSeen');
      expect(callArgs.data.lastSeen).toBe('2024-03-04T12:00:00.000Z');
    });
  });

  describe('deleteIndicator()', () => {
    it('should call apiRequest with DELETE method', async () => {
      vi.mocked(apiRequest).mockResolvedValue(undefined);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: 'indicator-to-delete',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'delete');
      });

      expect(apiRequest).toHaveBeenCalledWith({
        method: 'delete',
        url: '/api/indicators/indicator-to-delete',
        setLoading: expect.any(Function),
        setError: expect.any(Function),
      });
      expect(mockCancel).toHaveBeenCalled();
    });

    it('should call deleteIndicator directly', async () => {
      vi.mocked(apiRequest).mockResolvedValue(undefined);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'VirusTotal',
          type: 'hash',
          value: 'abc123',
          severity: 'low',
          tags: ['test'],
          id: 'test-id-789',
        });
      });

      await act(async () => {
        await result.current.deleteIndicator();
      });

      expect(apiRequest).toHaveBeenCalledWith({
        method: 'delete',
        url: '/api/indicators/test-id-789',
        setLoading: expect.any(Function),
        setError: expect.any(Function),
      });
    });
  });

  describe('handleSubmit()', () => {
    it('should prevent default form submission', async () => {
      vi.mocked(apiRequest).mockResolvedValue(undefined);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: '',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'add');
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should call cancel callback after submission', async () => {
      vi.mocked(apiRequest).mockResolvedValue(undefined);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: '',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'add');
      });

      expect(mockCancel).toHaveBeenCalled();
    });

    it('should show success toast after submission', async () => {
      vi.mocked(apiRequest).mockResolvedValue(undefined);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: '',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'add');
      });

      expect(toast).toHaveBeenCalledWith('Indicator successfully added', {
        type: 'success',
        toastId: 'indicator-success',
      });
    });

    it('should handle add action', async () => {
      vi.mocked(apiRequest).mockResolvedValue(undefined);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: '',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'add');
      });

      expect(apiRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
        })
      );
    });

    it('should handle edit action', async () => {
      vi.mocked(apiRequest).mockResolvedValue(undefined);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'VirusTotal',
          type: 'url',
          value: 'http://malicious.com',
          severity: 'critical',
          tags: ['exploit'],
          id: 'edit-id-123',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'edit');
      });

      expect(apiRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          data: expect.objectContaining({
            id: 'edit-id-123',
          }),
        })
      );
    });

    it('should handle delete action', async () => {
      vi.mocked(apiRequest).mockResolvedValue(undefined);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: 'delete-id-456',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'delete');
      });

      expect(apiRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: '/api/indicators/delete-id-456',
        })
      );
    });

    it('should handle errors during submission', async () => {
      const mockError = new Error('API Error');
      vi.mocked(apiRequest).mockRejectedValue(mockError);
      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: '',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'add');
      });

      expect(apiRequest).toHaveBeenCalled();
      expect(mockCancel).toHaveBeenCalled();
    });
  });

  describe('Loading and Error States', () => {
    it('should update loading state during API call', async () => {
      let resolveApiRequest: () => void;
      const apiPromise = new Promise<void>((resolve) => {
        resolveApiRequest = resolve;
      });
      
      let setLoadingFn: ((loading: boolean) => void) | null = null;
      
      vi.mocked(apiRequest).mockImplementation(async ({ setLoading }) => {
        setLoadingFn = setLoading;
        setLoading(true);
        await apiPromise;
        setLoading(false);
      });

      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: '',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      act(() => {
        result.current.handleSubmit(mockEvent, 'add');
      });

      await waitFor(() => {
        expect(setLoadingFn).not.toBeNull();
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        resolveApiRequest!();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should update error state when API call fails', async () => {
      const errorMessage = 'Network error';
      vi.mocked(apiRequest).mockImplementation(async ({ setError }) => {
        setError(errorMessage);
        throw new Error(errorMessage);
      });

      const { result } = renderHook(() => useIndicators(mockCancel));

      act(() => {
        result.current.setForm({
          source: 'AbuseIPDB',
          type: 'ip',
          value: '192.168.1.1',
          severity: 'high',
          tags: ['malware'],
          id: '',
        });
      });

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent, 'add');
      });

      expect(result.current.error).toBe(errorMessage);
    });
  });
});
