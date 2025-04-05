export const apiConfig = {
  baseUrl: 'https://jsonplaceholder.typicode.com',
  endpoints: {
    posts: {
      base: '/posts',
      byId: (id: number) => `/posts/${id}`,
    },
    users: {
      base: '/users',
      byId: (id: number) => `/users/${id}`,
    }
  },
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

// Helper functions
export const getEndpoint = (path: string): string => {
  return `${apiConfig.baseUrl}${path}`;
};

export const getHeaders = (additionalHeaders?: Record<string, string>): Record<string, string> => {
  return {
    ...apiConfig.defaultHeaders,
    ...additionalHeaders
  };
};