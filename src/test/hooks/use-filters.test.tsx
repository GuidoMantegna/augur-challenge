import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFilters, INITIAL_FILTERS } from "../../hooks/useFilters";
import { apiRequest } from "../../api/apiClient";

// Mock the API request
vi.mock("../../api/apiClient", () => ({
  apiRequest: vi.fn(),
}));

describe("useFilters", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock successful API response
    (apiRequest as any).mockResolvedValue({
      data: [
        {
          id: "1",
          value: "test-indicator",
          type: "ip",
          severity: "high",
          confidence: 85,
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
    });
  });

  it("should initialize with default values", async () => {
    const { result } = renderHook(() => useFilters());

    // Initial state check
    expect(result.current.filters).toEqual(INITIAL_FILTERS);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    // Wait for the initial API call to complete
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleFilterChange", () => {
    it("should update search filter and set isSearch flag", async () => {
      const { result } = renderHook(() => useFilters());

      // Wait for initial API call
      await waitFor(() => expect(apiRequest).toHaveBeenCalledTimes(1));

      // Reset mock to track the next call
      vi.clearAllMocks();

      // Create a mock event for search input change
      const mockEvent = {
        target: {
          name: "search",
          value: "test query",
        },
      } as React.ChangeEvent<HTMLInputElement>;

      // Update the filter
      act(() => {
        result.current.handleFilterChange(mockEvent);
      });

      // Check if filter was updated
      expect(result.current.filters.search).toBe("test query");

      // Check that API was called with debounce
      await waitFor(
        () => {
          expect(apiRequest).toHaveBeenCalledWith(
            expect.objectContaining({
              params: expect.objectContaining({ search: "test query" }),
            }),
          );
        },
        { timeout: 1000 },
      );
    });

    it("should update severity filter without isSearch flag", async () => {
      const { result } = renderHook(() => useFilters());

      await waitFor(() => expect(apiRequest).toHaveBeenCalledTimes(1));
      vi.clearAllMocks();

      const mockEvent = {
        target: {
          name: "severity",
          value: "critical",
        },
      } as React.ChangeEvent<HTMLSelectElement>;

      act(() => {
        result.current.handleFilterChange(mockEvent);
      });

      expect(result.current.filters.severity).toBe("critical");

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({ severity: "critical" }),
          }),
        );
      });
    });
  });

  describe("handlePaginationChange", () => {
    it("should go to next page", async () => {
      const { result } = renderHook(() => useFilters());

      await waitFor(() => expect(apiRequest).toHaveBeenCalledTimes(1));
      vi.clearAllMocks();

      const mockEvent = {
        currentTarget: {
          dataset: {
            dir: "next",
          },
        },
      } as unknown as React.MouseEvent<HTMLButtonElement>;

      act(() => {
        result.current.handlePaginationChange(mockEvent);
      });

      expect(result.current.filters.page).toBe(2);

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({ page: 2 }),
          }),
        );
      });
    });

    it("should go to previous page", async () => {
      const { result } = renderHook(() => useFilters());

      // First set page to 2
      act(() => {
        result.current.filters.page = 2;
      });

      await waitFor(() => expect(apiRequest).toHaveBeenCalledTimes(1));
      vi.clearAllMocks();

      const mockEvent = {
        currentTarget: {
          dataset: {
            dir: "prev",
          },
        },
      } as unknown as React.MouseEvent<HTMLButtonElement>;

      act(() => {
        result.current.handlePaginationChange(mockEvent);
      });

      expect(result.current.filters.page).toBe(1);

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({ page: 1 }),
          }),
        );
      });
    });

    it("should go to specific page", async () => {
      const { result } = renderHook(() => useFilters());

      await waitFor(() => expect(apiRequest).toHaveBeenCalledTimes(1));
      vi.clearAllMocks();

      const mockEvent = {
        currentTarget: {
          dataset: {
            dir: "3",
          },
        },
      } as unknown as React.MouseEvent<HTMLButtonElement>;

      act(() => {
        result.current.handlePaginationChange(mockEvent);
      });

      expect(result.current.filters.page).toBe(3);

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({ page: 3 }),
          }),
        );
      });
    });
  });

  describe("handleSorting", () => {
    it("should toggle sort order from A-Z to Z-A", async () => {
      // Setup mock data with multiple items
      (apiRequest as any).mockResolvedValue({
        data: [
          { id: "1", value: "b-indicator", type: "ip", severity: "high" },
          { id: "2", value: "a-indicator", type: "domain", severity: "medium" },
          { id: "3", value: "c-indicator", type: "url", severity: "low" },
        ],
        total: 3,
        page: 1,
        totalPages: 1,
      });

      const { result } = renderHook(() => useFilters());

      await waitFor(() => expect(result.current.data.data.length).toBe(3));

      act(() => {
        result.current.handleSorting();
      });

      // Should be sorted Z-A
      expect(result.current.data.data[0]?.value).toBe("c-indicator");
      expect(result.current.data.data[1]?.value).toBe("b-indicator");
      expect(result.current.data.data[2]?.value).toBe("a-indicator");
      
      act(() => {
        result.current.handleSorting();
      });
      
      // Should be sorted A-Z
      expect(result.current.data.data[0]?.value).toBe("a-indicator");
      expect(result.current.data.data[1]?.value).toBe("b-indicator");
      expect(result.current.data.data[2]?.value).toBe("c-indicator");
    });
  });
});
