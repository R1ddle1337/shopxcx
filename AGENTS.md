# Repository Guidelines

## Project Structure & Module Organization
This repository is a WeChat Mini Program retail starter built with plain JavaScript, WXML, and WXSS. Root app entry files are `app.js`, `app.json`, and `app.wxss`. Main pages live under `pages/`, with subpackages such as `pages/goods/`, `pages/order/`, and `pages/user/`. Reusable UI belongs in `components/`; shared business requests belong in `services/`; mock and view-model data live in `model/`. Put common helpers in `utils/` or `common/`, shared styles in `style/`, and tab bar logic in `custom-tab-bar/`. Treat `miniprogram_npm/` as generated vendor code and do not edit it manually.

## Build, Test, and Development Commands
Run `npm install` once to install linting, formatting, and commit tools. Use `npm run lint` to auto-fix JavaScript style issues with ESLint. Use `npm run check` for the repository's custom ESLint validation script before opening a PR. Use `npm run prepare` after dependency changes to restore Husky hooks. Local runtime testing happens in WeChat DevTools: import the project, then run `Tools -> Build NPM` before previewing pages.

## Coding Style & Naming Conventions
Follow the existing style: 2-space indentation, single quotes, trailing commas, and small focused modules. Keep page and component directories in the Mini Program convention: `index.js`, `index.json`, `index.wxml`, and `index.wxss`. Use `camelCase` for variables and functions, PascalCase only for constructor-like abstractions, and lowercase-hyphen folder names for reusable components when appropriate. Name service files by action or domain, for example `fetchGoods.js` or `orderDetail.js`. Run ESLint and Prettier before committing.

## Testing Guidelines
There is no automated unit test framework configured in this snapshot; `npm test` is a placeholder and should not be relied on. Validate changes with `npm run lint`, `npm run check`, and manual verification in WeChat DevTools. For page changes, test navigation, pull-down refresh, tab switching, and empty/error states. If you add automated tests later, place them beside the feature as `*.test.js` and document the command in `package.json`.

## Commit & Pull Request Guidelines
Commit history is not available in this workspace copy, but `commitlint.config.js` extends `@commitlint/config-conventional`, so use Conventional Commits such as `feat: add coupon filter` or `fix: handle empty cart state`. Keep commits scoped to one concern. PRs should include a short summary, affected pages or components, linked issues, and screenshots or screen recordings for UI changes. Note any WeChat DevTools or mock-data setup needed for reviewers.
