# React Photo Album Examples

Over here, you can find some basic examples demonstrating various React Photo
Album usage scenarios.

## Running the Examples

```shell
cd <example>
npm install
npm run dev
```

The run script starts a demo on port 5173 or the next available port if 5173 is
in use.

## Using the Examples in Development

1. Start the library build script:

   ```shell
   npm install
   npm run start
   ```

2. Link-install the library into one of the examples:

   ```shell
   cd <example>
   npm install
   npm link ../..
   npm run dev
   ```

3. Cleanup:

   ```shell
   cd <example>
   npm unlink --no-save react-photo-album
   npm unlink -g react-photo-album
   npm install
   ```
