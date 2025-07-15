# Playwright's Built-in iframe Handling Capabilities

Playwright provides robust, built-in iframe handling without requiring additional libraries. Here's a comprehensive guide to the available methods and approaches.

## Core iframe Handling Methods

### 1. FrameLocator (Recommended Approach)

The `frameLocator()` method is the modern, recommended way to interact with iframes:

**JavaScript/TypeScript:**
```javascript
// Locate element inside iframe
const locator = page.frameLocator('iframe').getByText('Submit');
await locator.click();
```

**Python:**
```python
# Locate element inside iframe
locator = page.frame_locator('iframe').get_by_text('Submit')
await locator.click()
```

### 2. Frame Objects

Access frame objects directly using `page.frame()`:

**JavaScript/TypeScript:**
```javascript
// Get frame by name attribute
const frame = page.frame('frame-login');

// Get frame by URL
const frame = page.frame({ url: /.*domain.*/ });

// Interact with the frame
await frame.fill('#username-input', 'John');
```

**Python:**
```python
# Get frame by name attribute
frame = page.frame('frame-login')

# Get frame by URL  
frame = page.frame(url=r'.*domain.*')

# Interact with the frame
await frame.fill('#username-input', 'John')
```

## Advanced iframe Handling

### Nested iframes

For deeply nested iframes:

```javascript
// Playwright automatically handles nested iframes
const locator = page
  .frameLocator('iframe.level1')
  .frameLocator('iframe.level2')
  .frameLocator('iframe.level3')
  .getByRole('button', { name: 'Submit' });

await locator.click();
```

### Converting Between Locator and FrameLocator

```javascript
// Convert Locator to FrameLocator
const frameLocator = page.locator('iframe').contentFrame();

// Convert FrameLocator to Locator
const locator = frameLocator.owner();
```

## Modular Approach for Complex Applications

For applications with multiple iframes, you can use a modular Page Object Model approach:

### Frame Mapping Strategy

```javascript
// Frame mapping object
const frameMapper = {
  loginPage: 'iframe[src="https://example.com/login"]',
  homePage: 'iframe[src="https://example.com/home"]',
  settingsPage: 'iframe[src="https://example.com/settings"]'
};

// Base page class
class BasePage {
  constructor(page, pageId) {
    this.page = page;
    this.pageId = pageId;
    this.iframe = this.getFrameLocator();
  }
  
  getFrameLocator() {
    const selector = frameMapper[this.pageId];
    if (!selector) {
      throw new Error(`Frame selector not found for pageId: ${this.pageId}`);
    }
    return this.page.frameLocator(selector);
  }
}

// Inheriting page objects
class LoginPage extends BasePage {
  constructor(page) {
    super(page, 'loginPage');
    this.usernameInput = this.iframe.getByRole('textbox', { name: /username/i });
    this.passwordInput = this.iframe.getByRole('textbox', { name: /password/i });
  }
}
```

## Multiple iframe Handling Approaches

### Approach 1: Using Frame by URL
```javascript
const frame = page.frame({
  url: "https://ui.vision/demo/webtest/frames/frame_1.html",
});
await frame.fill("input[name='mytext1']", "Hello");
```

### Approach 2: Using Frame Locator with CSS Selector
```javascript
const locator = page
  .frameLocator('frame[src="frame_1.html"]')
  .locator("input[name='mytext1']");
await locator.fill("Hello");
```

## FrameLocator Methods

FrameLocator provides all the standard locator methods:

- `getByRole()` - Locate by ARIA role
- `getByText()` - Locate by text content
- `getByLabel()` - Locate by label text
- `getByPlaceholder()` - Locate by placeholder
- `getByTestId()` - Locate by test ID
- `getByTitle()` - Locate by title attribute
- `getByAltText()` - Locate by alt text
- `locator()` - General CSS/XPath selector
- `frameLocator()` - For nested iframes

## Recent Enhancements

### Stagehand Integration (Latest Development)

Recent developments include advanced iframe handling through tools like **Stagehand**, which enhances Playwright's iframe capabilities:

- **Unified Tree Representation**: Creates a single accessibility tree across all frames
- **Global Unique IDs**: Ensures element uniqueness across different iframes  
- **Deep XPath Locator**: Handles nested iframe navigation automatically
- **CDP Session Management**: Improved Chrome DevTools Protocol handling

## Best Practices

### 1. Use FrameLocator for Modern Applications
```javascript
// Preferred approach
const submitButton = page.frameLocator('#my-frame').getByRole('button', { name: 'Submit' });
await submitButton.click();
```

### 2. Handle Frame Loading
```javascript
// Wait for frame to load
await page.frameLocator('iframe').locator('body').waitFor();
```

### 3. Error Handling
```javascript
try {
  const frame = page.frame('nonexistent-frame');
  if (frame) {
    await frame.click('#button');
  }
} catch (error) {
  console.log('Frame not found or interaction failed');
}
```

### 4. Strictness Mode
```javascript
// FrameLocators are strict by default
// This will throw if multiple frames match
await page.frameLocator('.result-frame').getByRole('button').click();

// Use .first() for multiple matches
await page.frameLocator('.result-frame').first().getByRole('button').click();
```

## Cross-Platform Support

Playwright's iframe handling works consistently across:
- **Node.js** (JavaScript/TypeScript)
- **Python**
- **Java**
- **C#/.NET**

## Key Advantages

1. **No Additional Libraries Required**: Everything is built into Playwright
2. **Auto-waiting**: Automatic waiting for frame content to load
3. **Retry Logic**: Built-in retry mechanisms for flaky iframe interactions
4. **Cross-browser Support**: Works across Chromium, Firefox, and WebKit
5. **Type Safety**: Full TypeScript support with intellisense
6. **Debugging Support**: Excellent debugging tools including trace viewer

## Conclusion

Playwright's built-in iframe handling is comprehensive and doesn't require external libraries. The `frameLocator()` method combined with the standard locator APIs provides a powerful, reliable way to interact with iframe content across all supported browsers and programming languages.