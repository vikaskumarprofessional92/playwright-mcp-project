interface IframeConfig {
  id: string;
  name?: string;
  description?: string;
}

export const config = {
  baseUrl: 'https://www.google.ca', // Replace with your actual base URL
  iframes: {
    main: {
      id: 'main-iframe',
      name: 'Main Content Frame',
      description: 'Primary content iframe'
    },
    navigation: {
      id: 'nav-iframe',
      name: 'Navigation Frame',
      description: 'Navigation menu iframe'
    }
    // Add more iframe configurations as needed
  }
} as const;

// Type-safe way to get iframe IDs
export const getIframeId = (key: keyof typeof config.iframes): string => {
  return config.iframes[key].id;
};

// Helper to get base URL
export const getBaseUrl = (): string => {
  return config.baseUrl;
};