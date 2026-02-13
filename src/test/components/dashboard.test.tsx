import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../../components/Dashboard";
import { apiRequest } from "../../api/apiClient";

// Mock the API module
vi.mock("../../api/apiClient", () => ({
  apiRequest: vi.fn(),
}));

// Define mock data outside test functions
const mockIndicatorsData = {
  data: [
    {
      id: "1",
      value: "192.168.1.1",
      type: "ip",
      severity: "high",
      confidence: 85,
      source: "AbuseIPDB",
      firstSeen: "2023-01-15T10:30:00Z",
      lastSeen: "2023-02-20T14:45:00Z",
      tags: ["scanner", "brute-force"],
    },
    {
      id: "2",
      value: "malicious-domain.com",
      type: "domain",
      severity: "critical",
      confidence: 95,
      source: "VirusTotal",
      firstSeen: "2023-01-10T08:15:00Z",
      lastSeen: "2023-02-22T11:20:00Z",
      tags: ["phishing", "c2"],
    },
    {
      id: "3",
      value: "https://fake-login.com/portal",
      type: "url",
      severity: "medium",
      confidence: 75,
      source: "PhishTank",
      firstSeen: "2023-02-01T09:45:00Z",
      lastSeen: "2023-02-21T16:30:00Z",
      tags: ["credential", "phishing"],
    },
  ],
  total: 3,
  page: 1,
  totalPages: 1,
};

describe("Dashboard Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();

    // Mock API response
    (apiRequest as any).mockResolvedValue(mockIndicatorsData);

    // Render the dashboard component before each test
    render(<Dashboard />);
  });

  it("should display indicators data correctly", async () => {
    // Wait for data to load
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "/api/indicators",
        }),
      );
    });

    // Check if indicators are displayed
    expect(screen.getByText("192.168.1.1")).toBeInTheDocument();
    expect(screen.getByText("malicious-domain.com")).toBeInTheDocument();
    expect(
      screen.getByText("https://fake-login.com/portal"),
    ).toBeInTheDocument();
  });

  it("should filter results using the search filter", async () => {
    const user = userEvent.setup();
    const searchTerm = "192.168.1.1";

    // Find the search input and button
    const searchInput = screen.getByTestId("search-input");

    // Type in the search box and press enter
    await user.type(searchInput, `${searchTerm}{enter}`);

    // Verify search results contain the search term
    const resultsContainer = await screen.findByText(searchTerm);
    expect(resultsContainer).toBeInTheDocument();

    // Clear search
    const clearButton = screen.getByTestId("clear-filters-button");
    await user.click(clearButton);

    // Verify search was cleared
    expect(searchInput).toHaveValue("");
  });

  it("should filter by severity selection", async () => {
    const user = userEvent.setup();

    // Open severity dropdown
    const severitySelect = screen.getByTestId("severity-select");
    await user.click(severitySelect);

    // Select "High" severity
    const highOption = screen.getByTestId("severity-option-high");
    await user.click(highOption);

    // Verify filter is applied
    const filterTag = screen.getByTestId("severity-select");
    expect(filterTag).toHaveTextContent("High");

    // Verify results are filtered
    const resultsContainer = await screen.findByText("high");
    expect(resultsContainer).toBeInTheDocument();
  });

  it("should filter by types selection", async () => {
    const user = userEvent.setup();

    // Open types dropdown
    const typesSelect = screen.getByTestId("types-select");
    await user.click(typesSelect);

    // Select "Error" type
    const errorOption = screen.getByTestId("type-option-url");
    await user.click(errorOption);

    // Verify filter is applied
    const filterTag = screen.getByTestId("types-select");
    expect(filterTag).toHaveTextContent("URL");

    // Verify results are filtered
    const resultsContainer = await screen.findByText("url");
    expect(resultsContainer).toBeInTheDocument();
  });

  it("should navigate through pagination", async () => {
    const user = userEvent.setup();

    // Verify initial page is 1
    const currentPage = screen.getByTestId("current-page");
    expect(currentPage).toHaveTextContent("1");

    // Go to next page
    const nextPageButton = screen.getByTestId("next-page");
    await user.click(nextPageButton);

    // After clicking next, wait for page 2 to become the current page
    const page2 = await screen.findByTestId("page-2");
    expect(page2).toHaveTextContent("2");

    // Go to page 3
    const page3Button = screen.getByTestId("page-3");
    await user.click(page3Button);

    // After clicking page 3, wait for it to become the current page
    const page3 = await screen.findByTestId("page-3");
    expect(page3).toHaveTextContent("3");
  });
});
