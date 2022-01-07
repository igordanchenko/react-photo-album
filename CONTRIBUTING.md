# Contributing to React Photo Album

First off, thank you for your interest in React Photo Album! All contributions of all sizes are always welcome here.
Here are a few guidelines that will help you along the way.

## Code of Conduct

React Photo Album has adopted the [Contributor Covenant](https://www.contributor-covenant.org/) as its Code of Conduct,
and we expect project participants to adhere to it. Please read [the full text](/CODE_OF_CONDUCT.md) so that you can
understand what actions will and will not be tolerated.

## Sending a Pull Request

1. Fork the repository.

2. Clone the fork to your local machine and add upstream remote:

```shell
git clone https://github.com/<your username>/react-photo-album.git
cd react-photo-album
git remote add upstream https://github.com/igordanchenko/react-photo-album.git
```

3. Synchronize your local `main` branch with the upstream:

```shell
git checkout main
git pull upstream main
```

4. Install the dependencies with `npm`:

```shell
npm install
```

5. Create a new head branch:

```shell
git checkout -b feat/my-new-feature
```

6. Start auto-build script:

```shell
npm run start
```

7. Link your locally built `react-photo-album` version to your local project or one of the bundled examples:

```shell
# execute from react-photo-album directory
npm link

# execute from your local project directory
npm link react-photo-album
```

8. Make changes, run tests:

```shell
npm run test
```

9. Cleanup global link:

```shell
# execute from your local project directory
npm unlink --no-save react-photo-album

# execute from react-photo-album directory
npm unlink -g
```

10. Commit and push to your fork (make sure your commit message conforms to
    the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)):

```shell
git commit -m "feat: awesome new feature"
git push -u origin HEAD
```

11. Go to [the repository](https://github.com/igordanchenko/react-photo-album) and create a Pull Request.

## License

By contributing your code to the [react-photo-album](https://github.com/igordanchenko/react-photo-album) GitHub
repository, you agree to license your contribution under the [MIT license](/LICENSE).
