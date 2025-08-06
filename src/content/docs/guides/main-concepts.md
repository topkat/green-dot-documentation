---
title: Key Concepts
description: Understanding the core concepts of Green Dot framework.
---

## Role-Based Architecture

In Green Dot, roles are designed to match your application's frontend interfaces. This means:

- Each role corresponds to a specific interface in your application
- For example, if you have an admin panel and a user-facing app, you would define two roles:
  - `admin` - for the admin panel interface
  - `appUser` - for the user-facing application
- All other rights / accesses are granted via permission system

### SDK Generation

The framework generates an SDK for the front-end to use. It's fully typed, cache and `React.Suspense` ready and can be imported in any project architecture.  
For better security, each role (thus each interface) gets its own dedicated SDK. This ensures proper separation of concerns:
  - `admin` services remain hidden from the `user` app SDK
  - Each interface only has access to its relevant endpoints
  - Access control is automatically enforced at the SDK level

Multiple backends and databases can be configured with any access role configuration, in the end everything will be merged into one SDK per interface

### Permission System


* roles and permissions are configured in `gd.config.ts`
* Permissions in Green Dot are **boolean properties on the user object**. They are injected automatically from your config.
* Each **role** as a corresponding **permission**. Example: `user.isAdmin` or `user.isAppUser`
* Anywhere when configuring access, you can have a string `'myRole'` config OR a full object with permissions: `{ role: 'myRole', hasEmailValidated: true }`

**Example:**

```ts
export const myService = svc({
    async main(ctx) {
        if(ctx.isAdmin) // Equivalent of `ctx.role === 'admin'`. Means the users has been connected with the admin dashboard
        if(ctx.isMyCustomRole) // this prop will be available if you have a role named `MyCustomRole`
        if(ctx.hasCustomPerm) // you can also check perms for better granularity
    }
})
```