# Use the Playwright image version specified in package.json
FROM mcr.microsoft.com/playwright:v1.51.1-jammy

# Install Chromium browser (which has ARM support)
RUN apt-get update && apt-get install -y chromium-browser

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Verify browsers are installed
RUN npx playwright install-deps

# Set default command
CMD ["npm", "run", "test:ci"]