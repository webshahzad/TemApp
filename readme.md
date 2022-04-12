# TEM Android app

- [React Native, TypeScript & ESLint](#react-native-typescript--eslint)
- [Reactronic](#reactronic)
- [Environment configs](#environment-configs)
- [Debugging](#debugging)
- [Building release artifact](#building-release-artifact)
- [Versioning](#versioning)

## React Native, TypeScript & ESLint

Android application is built with React Native. Follow [this tutorial](https://reactnative.dev/docs/environment-setup#:~:text=installing%20dependencies) to prepare environment for development.

Static code checking & compilation is performed with TypeScript.

Code style is enforced via ESLint.

## Reactronic

The app uses [Reactronic](https://github.com/nezaboodka/reactronic) as a state management library.

Following architecture is adopted: there is a global state object ([App.ts](./source/models/app/App.ts)), which is a root for all other business logic models. All components import it to use and/or modify some its properties. All the properties are recursively tracked by reactronic, so if some of them are modified by user input or HTTP response, this results in an automatic rerender.

## Environment configs

Non-secret environment-specific configs are stored in `env*.json` configs. Switching between configs is performed via `ENV` environment variable at build-time. 

Default configs for all environments are stored in [env.json](env.json). Each property could be overridden in a config for specific environment:
- [env.prod.json](env.prod.json)
- [env.qa.json](env.qa.json)
- [env.dev.json](env.dev.json) - this config is gitignored, so each developer can store different properties (e.g. API URL)

Configs overriding is skipped, when there is no match between `ENV` variable and `config.${ENV}.json` file.

There are other concerns which use `ENV` variable:
- Application artifact signing (so release `aab` artifact could be uploaded to Play Store)
- Firebase configs (`google-services.json`)
- Application version name
  - debug version is appended with `dev` postfix
  - `qa` version is appended with `qa` postfix

## Debugging

Application could be debugged via ADB on a real device, or on an emulator. Use `Install & Run` VSCode debugging task to build a debug apk, install it on a target Android, start a React Native packager and connect to it with a debugger.

If you've already got a debug apk installed on your target device, you can use `Attach` VSCode debugging task. Please note, that if debugging is not available, enable it in [in-app developer menu](https://reactnative.dev/docs/debugging#accessing-the-in-app-developer-menu).

## Building release artifact

To build a specific env-pointing release `apk` artifact, use:
- `npm run apk:qa`
- `npm run apk:prod`

Release `apk` would be placed here:
```
./android/app/build/outputs/apk/release/app-release.apk
```

To build a specific env-pointing release `aab` artifact and **upload it into Play Store**, use:
- `cd android && ./gradlew publishRelease --track internal` - immediately publish into Internal track
- `cd android && ./gradlew publishRelease --track alpha` - push an artifact for review into Alpha track. After review is done, it could be manually made available for testers. This artifact could be later promoted into production for general availability.

Currently CI/CD is configured to run the scripts above as manual tasks in pipeline, which is created over `release/...` branch.

## Versioning

Android apps are versioned with the following pair:
- Version name - visible to users. Example: 1.6.1.
- Version code - not visible to users. Example: 21.

Version name is a human-friendly string, which could be used to distinguish releases. Currently adopted approach uses a slightly modified SemVer model: `{major}.{minor}.{patch}`
- Major version is to be incremented when a major redesign & internal reimplementation occurs.
- Minor version is to be incremented when a new feature is added (e.g. adding Google Fit syncing resulted in incrementing a minor version).
- Patch version is to be incremented after some bugs found and hotfixes developed (so it cannot wait until next release with a new feature is ready).

Google Play uses version code to distinguish submitted builds. **It is forbidden to push multiple bundles with the same version code (even across different tracks).** 

### Release approach

That is why current approach of releasing new functionality is the following:

1. Merge feature-branch into master.
2. Increment minor version **and** version code (commit it into master).
3. Create a new release-branch.
4. Use it to publish a new build into QA env (Internal track).

After some bugs found & fixed:

5. Increment version code (and optionally patch version, commit it into master and the release-branch).
6. Create a new release for Internal track.

When it is decide to publish into production:

7. Increment version code, commit it into master and the release-branch.
8. Create a new release for Alpha track.

Versions management is entirely manual process. There are some helper scripts:
- `npm run version:major` - bumps major version **and** version code
- `npm run version:minor` - bumps minor version **and** version code
- `npm run version:patch` - bumps patch version **and** version code
- `npm run version:same` - bumps version code only

Incremented versions should be always committed into master, so version codes are not lost, and could be incremented in a monotonous way.
