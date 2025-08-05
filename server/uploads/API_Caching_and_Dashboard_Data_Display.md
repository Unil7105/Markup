# API Caching and Dashboard Data Display

## Problem Description

Initially, the application was making an API request every time a page was opened, leading to unnecessary network calls. Additionally, after implementing local storage caching, the dashboard failed to display data. This was due to a combination of:

1.  **Redundant API Calls:** The `useEffect` hook in `useCompanyData.js` was triggering an API call on every component mount or when its `company` dependency changed, without checking for cached data.
2.  **Simulated Onboarding Audit:** The `OnBoarding.jsx` component was using a simulated audit with hardcoded data, rather than making a real API call and storing the actual response in `localStorage`.
3.  **Incorrect Data Access in Dashboard:** The dashboard (`index.jsx`) was expecting the API response data directly, but the actual API response (as seen in `result.json`) was nested under a `data` key.

## Key Concepts to Remember

*   **`useEffect` Hook Dependencies:** The `useEffect` hook in React re-runs its effect function whenever any of its dependencies change. If the dependency array is empty (`[]`), it runs only once after the initial render (on component mount). If dependencies are included, it re-runs when those dependencies change.
*   **Local Storage (`localStorage`):** A web storage API that allows JavaScript applications to store key-value pairs in a web browser with no expiration date. It's useful for caching data to reduce network requests and improve performance.
*   **API Response Structure:** Always verify the exact structure of your API responses. Data might be nested within parent keys (e.g., `response.data` instead of just `response`), and incorrect access paths will lead to `undefined` values and display issues.
*   **Data Flow in React Applications:** Understand how data flows through your components and hooks. Ensure that data fetched or processed in one part of the application is correctly passed or made available to other parts that depend on it.

## How to Fix It if It Happens Again

If you encounter similar issues with redundant API calls or data not displaying, follow these steps:

1.  **Identify the Source of API Calls:**
    *   Check `useEffect` hooks in your custom data fetching hooks (e.g., `useCompanyData.js`).
    *   Examine their dependency arrays. Are they causing unintended re-runs?

2.  **Implement or Verify Caching Logic:**
    *   In your API service functions (e.g., `getCompanyData.js`), implement a check for cached data in `localStorage` (or other caching mechanisms like `sessionStorage`, `IndexedDB`, or a state management library).
    *   If data is found, return it immediately.
    *   If not, make the API call and then store the successful response in the cache.

3.  **Ensure Data Persistence (if applicable):**
    *   If data needs to persist across sessions or page reloads, `localStorage` is a good choice.
    *   Make sure the data is being correctly `setItem` (stored) and `getItem` (retrieved) from `localStorage`.
    *   Remember to `JSON.stringify` data before storing and `JSON.parse` it after retrieving, as `localStorage` only stores strings.

4.  **Verify Data Structure and Access Paths:**
    *   Use `console.log(data)` immediately after fetching data (from API or cache) to inspect its exact structure.
    *   Adjust your component's data access paths accordingly (e.g., if `data` is `response.data`, then access `data.data.audit` instead of `data.audit`).
    *   Pay close attention to nested objects and arrays.

5.  **Check Onboarding/Initial Data Setup:**
    *   If your application has an onboarding or initial setup flow, ensure that the data collected during this process is correctly saved and made available to other parts of the application (e.g., setting `companyName` in `localStorage` after onboarding).
    *   Confirm that any simulated data calls are replaced with actual API calls when moving to a production-like environment.

By systematically checking these areas, you can diagnose and resolve issues related to API calls and data display in your React application.