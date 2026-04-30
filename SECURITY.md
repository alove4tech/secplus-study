# Security Policy

## Reporting a Vulnerability

If you find a security issue in this project, please report it responsibly:

- Open a [GitHub issue](https://github.com/alove4tech/secplus-study/issues) and tag it as a security concern
- Or contact the maintainer directly through GitHub

Please do not publicly disclose vulnerabilities before a fix is available.

## Scope

This policy covers the static application code, GitHub Pages deployment configuration, Dockerfile, Docker Compose configuration, and nginx configuration in this repository. It does not cover third-party platforms or browser implementations — report those to the respective upstream projects.

## Data and Privacy

Security+ Command Center is a static browser app. There are no accounts, login sessions, passwords, databases, or telemetry.

All study progress is stored in the current browser's `localStorage` under `secplus-study-progress-v4`. No progress data is transmitted to GitHub Pages, the Docker/nginx server, or any application backend. Users can export, import, or reset progress from the app's Settings page.

Because progress is stored locally in the browser, anyone with access to that browser profile and site storage can view or modify the saved progress. Do not treat the local progress data as confidential or tamper-proof.
