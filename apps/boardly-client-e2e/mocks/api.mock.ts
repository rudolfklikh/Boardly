import type { BrowserContext } from '@playwright/test';

const mockUserData = {
  email: 'test@gmail.com',
  username: 'TestTest',
  id: '694d3a303c933fc8df17cdef',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NGQzYTMwM2M5MzNmYzhkZjE3Y2RlZiIsImVtYWlsIjoiY2xhcmNoaWtAZ21haWwuY29tIiwiaWF0IjoxNzY2NjY5NDYwfQ.LvCgfPufTwxGelzBwmgd9LtrKXDK4ml4cFtAToKUqOU'
};

export async function setupUserAuthMocks(context: Readonly<BrowserContext>) {
  await context.route('*/**/api/users/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUserData)
    });
  });

  await context.route('*/**/api/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUserData)
    });
  });
}
