# Playwright MCP Project

A project to demonstrate Playwright MCP server usage with Jenkins pipeline.

## Prerequisites

- Node.js installed on your machine.
- npm (Node Package Manager) comes with Node.js.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/vikaskumarprofessional92/playwright-mcp-project.git
   cd playwright-mcp-project
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up the Playwright MCP server:
   - Ensure you have the MCP server configured in your `settings.json` as follows:
     ```json
     {
       "mcpServers": {
         "playwright": {
           "command": "npx",
           "args": [
             "@playwright/mcp@latest",
             "--vision"
           ]
         }
       }
     }
     ```

## Running Tests

To run the tests, use the following command:
```
npx playwright test
```

## Test Specifications

The test specifications can be found in the `src/tests/example.spec.ts` file. This file contains a test suite that includes a test case for opening a browser and navigating to the Google.ca website.

## Jenkins Integration

This project includes Jenkins pipeline configuration for continuous integration. The pipeline is configured to:
- Install dependencies
- Run tests
- Generate and publish test reports

## License

This project is licensed under the MIT License.
