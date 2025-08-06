---
title: green_dot Frontend Usage
description: This guide explains how to integrate and use the Green Dot SDK in your frontend application.
---

## General usage

You can:
* publish your generated SDKs packages via NPM (`npm run publishSdks`) or 
* reference them from local files if the backend and frontend are in the same repo OR if you use the `generateSdkConfig.copyFolderToLocationOnBuild` option in `gd.config.ts` to copy SDK files to local frontend repo


## SDK Initialization

The SDK needs to be initialized before use. Here's how to set it up:

```ts
import {$, initSdk} from 'appUserSDK'
import {QueryClient} from '@tanstack/react-query'

/** Query client has to be initiated in frontend and will allow request caching and the use of $.useQuery.myRequest (see below) */
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: 0 } } })

initSdk({
  // Required: Your project name
  projectName: 'myProject',
  
  // Required: Function to get device ID
  getDeviceId: () => getDeviceInfos()._id,

  // Required: Query client for caching requests
  getQueryClient: () => queryClient,

  // Required: Server configuration
  serverUrls: {
    backend: serverUrl,
    default: 'backend',
  },

  // Optional: Callback when user logs out
  onLogout: () => {
    // Clear session state
    getSessionState().setSession({ status: 'notAuthenticated' })
    // Clear localStorage except for essential items
    Object.keys(window.localStorage).forEach(k => {
      if (k !== 'deviceId' && k !== 'BANGK-language' && k !== 'BANGK-currency') {
        window.localStorage.removeItem(k)
      }
    })
  },

  // Optional: Callback when SDK is initialized
  onSdkInitialized: () => {/** TODO */ },

  // Optional: Local storage handlers, if not set, the cache will be used, which will reset state with each reload
  localStorageSet: (name, val) => localStorage.setItem(name, val),
  localStorageGet: name => localStorage.getItem(name),
  localStorageRemove: name => localStorage.removeItem(name),

  // Optional: Token configuration
  refreshTokenExpirationMinutes,
  refreshTokenErrorMessage: t('errors.wrongToken'),
  wrongTokenErrorMessage: t(`errors.refreshTokenError`),

  // Optional: Error handler
  onErrorCallback: backendErrHandler,
})
```

## Using the SDK

Once initialized, you can use the SDK to make **type-safe API calls**. The SDK automatically generates methods based on your backend routes:

```ts
// Example API calls async
async function myFn() {
  const userExists = await $.checkUserExists({ email: 'user@example.com' })
  const userData = await $.getUserProfile()
  console.log(userExists) // boolean
  console.log(userData) // type User
}

// In a react component
export function MyComponent() {

  const [ user ] = $.useQuery.getUserProfile() // uses React.Suspense and react-query under the hood

  return <div>Greetings {user.firstName}!</div>
}
```

## Tracker Integration

Tracker enable creating events in your database for anything like navigation, errors, apiCalls, clicks and any custom events (Post a github issue for any further documentation).

If you want to enable tracking functionality, initialize it after the SDK:

```ts
if (isTrackerEnabled) {
  initTrackerData({
    projectName,
    getDeviceId: () => getDeviceInfos()._id,
  })
  initTrackerListeners({ isDev: window.location.includes('localhost') })
}
```

## Features

- 🔄 Automatic token refresh handling
- 🗄️ Local storage management
- 🔒 Secure authentication
- 📱 Device tracking support
- 🚀 Fully Type-safe API calls
- 💾 Built-in caching with TanStack Query

## Best Practices

1. Always initialize the SDK before making any API calls
2. Handle the `onLogout` callback to properly clean up user data
3. Provide local storage handlers for consistent data management
4. Implement proper error handling using the `onErrorCallback`
5. Keep your device ID management consistent across the application

## Type Safety

The SDK provides full TypeScript support, giving you:
- Autocomplete for all API routes
- Type checking for request parameters
- Type inference for response data
- Compile-time error detection

## Error Handling

The SDK includes built-in error handling for:
- Token expiration
- Refresh token errors
- Network issues
- Backend errors

Custom error handling can be implemented through the `onErrorCallback` configuration.
