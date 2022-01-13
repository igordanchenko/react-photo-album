# React Photo Album Examples

Over here, you can find some basic examples demonstrating various React Photo Album usage scenarios.

## Running the Examples

```shell
cd <example>
npm install
npm run start
```

The run script starts a demo on port 3000 or the next available port if 3000 is in use.

## Using the Examples in Development

If you run an example project with link-installed `react-photo-album`, you will likely run into an "invalid hook call"
error:

```
Uncaught Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.
    at resolveDispatcher (react.development.js:1476:1)
    at Object.useState (react.development.js:1507:1)
    at PhotoAlbum (PhotoAlbum.tsx:58:1)
    at renderWithHooks (react-dom.development.js:14985:1)
    at mountIndeterminateComponent (react-dom.development.js:17811:1)
    at beginWork (react-dom.development.js:19049:1)
    at HTMLUnknownElement.callCallback (react-dom.development.js:3945:1)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:3994:1)
    at invokeGuardedCallback (react-dom.development.js:4056:1)
    at beginWork$1 (react-dom.development.js:23964:1)
```

This error is due to duplicate versions of `react` and `react-dom` dependencies across the project and the library
`node_modules`. A typical workaround for this issue is to add `react` and `react-dom` resolve aliases to the webpack
config. For example, here is how you'd solve it in a Next.js project:

```javascript
const path = require("path");

/** @type {import("next").NextConfig} */
module.exports = {
    reactStrictMode: true,

    webpack: (config) => {
        config.resolve.alias.react = path.resolve("node_modules", "react");
        config.resolve.alias["react-dom"] = path.resolve("node_modules", "react-dom");
        return config;
    },
};
```

However, `create-react-app` is particularly stingy about configs customization and `src` jail. One possible workaround
is to link-install `react` and `react-dom` as well:

```shell
cd <example>
npm install
npm link ../.. ../../node_modules/react ../../node_modules/react-dom
rm -rf node_modules/.cache
npm run start
```

Cleanup:

```shell
cd <example>
npm unlink --no-save react react-dom react-photo-album
npm unlink -g react react-dom react-photo-album
npm install
```

If you are aware of a more elegant solution, please let me know on GitHub! (p.s. I did try `craco`, `customize-cra` and
some other typical go-to's but as of the time of this writing, none of them worked for different reasons)
