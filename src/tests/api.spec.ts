import { test, expect } from '@playwright/test';
import { apiConfig, getEndpoint, getHeaders } from '../config/api.config';

test.describe('API Testing Examples', () => {
  test('GET request example', async ({ request }) => {
    // Making a GET request using config
    const response = await request.get(
      getEndpoint(apiConfig.endpoints.posts.byId(1)),
      { headers: getHeaders() }
    );
    
    // Verify response status
    expect(response.status()).toBe(200);
    
    // Parse response body
    const responseBody = await response.json();
    
    // Verify response structure
    expect(responseBody).toHaveProperty('id', 1);
    expect(responseBody).toHaveProperty('title');
    expect(responseBody).toHaveProperty('body');
    expect(responseBody).toHaveProperty('userId');
  });

  test('POST request example', async ({ request }) => {
    const postData = {
      title: 'Test Post',
      body: 'This is a test post body',
      userId: 1
    };

    // Making a POST request using config
    const response = await request.post(
      getEndpoint(apiConfig.endpoints.posts.base),
      {
        data: postData,
        headers: getHeaders()
      }
    );

    // Verify response status for successful creation
    expect(response.status()).toBe(201);

    // Verify response contains the data we sent
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('title', postData.title);
    expect(responseBody).toHaveProperty('body', postData.body);
    expect(responseBody).toHaveProperty('userId', postData.userId);
    expect(responseBody).toHaveProperty('id');
  });

  test('PUT request example', async ({ request }) => {
    const updateData = {
      id: 1,
      title: 'Updated Title',
      body: 'Updated body text',
      userId: 1
    };

    // Making a PUT request using config
    const response = await request.put(
      getEndpoint(apiConfig.endpoints.posts.byId(1)),
      {
        data: updateData,
        headers: getHeaders()
      }
    );

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify response contains updated data
    const responseBody = await response.json();
    expect(responseBody).toMatchObject(updateData);
  });

  test('DELETE request example', async ({ request }) => {
    // Making a DELETE request using config
    const response = await request.delete(
      getEndpoint(apiConfig.endpoints.posts.byId(1)),
      { headers: getHeaders() }
    );
    
    // Verify response status for successful deletion
    expect(response.status()).toBe(200);
  });

  test('Testing with query parameters', async ({ request }) => {
    // Making a GET request with query parameters using config
    const response = await request.get(
      getEndpoint(apiConfig.endpoints.posts.base),
      {
        params: {
          userId: 1,
          _limit: 3
        },
        headers: getHeaders()
      }
    );

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify response is an array with correct length
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeLessThanOrEqual(3);
    
    // Verify all posts belong to userId 1
    posts.forEach(post => {
      expect(post.userId).toBe(1);
    });
  });
});