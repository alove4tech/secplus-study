#!/usr/bin/env python3
"""Source-level regression checks for the static Security+ app."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = (ROOT / "index.html").read_text()
APP = (ROOT / "app.js").read_text()
CSS = (ROOT / "styles.css").read_text()


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def count_array_objects(array_name):
    match = re.search(rf"const {array_name} = \[(.*?)\n\];", APP, re.S)
    require(match is not None, f"{array_name} array is missing")
    return len(re.findall(r'\n  \{\n    id: "', match.group(1)))


def require_scenario_ids(array_name, expected_ids):
    match = re.search(rf"const {array_name} = \[(.*?)\n\];", APP, re.S)
    require(match is not None, f"{array_name} array is missing")
    content = match.group(1)
    for scenario_id in expected_ids:
        require(f'id: "{scenario_id}"' in content, f"{scenario_id} is missing from {array_name}")


def main():
    require('id="loginView"' not in INDEX, "login view should be removed")
    require('id="loginForm"' not in INDEX, "login form should be removed")
    require('id="loginName"' not in INDEX, "username field should be removed")
    require('id="loginPassword"' not in INDEX, "password field should be removed")
    require('id="loginPasswordConfirm"' not in INDEX, "password confirmation should be removed")
    require('id="logoutButton"' not in INDEX, "logout button should be removed")
    require('data-current-user-name' not in INDEX, "current-user display should be removed")
    require('Sign in to track your progress' not in INDEX, "login copy should be removed")
    require('Saved Profiles' not in INDEX, "saved profiles UI should be removed")

    require('secplus-study-current-user' not in APP, "current-user session storage should be removed")
    require('secplus-study-users-v1' not in APP, "saved-user profile storage should be removed")
    require('PASSWORD_ITERATIONS' not in APP, "password hashing config should be removed")
    require('getUserStorageKey' not in APP, "user-scoped storage helper should be removed")
    require('hashPassword' not in APP, "password hashing helper should be removed")
    require('verifyPassword' not in APP, "password verification helper should be removed")
    require('crypto.subtle' not in APP, "Web Crypto password derivation should be removed")
    require('hasPasswordCredential' not in APP, "saved-profile credential checks should be removed")
    require('loginUser' not in APP, "login function should be removed")
    require('logoutUser' not in APP, "logout function should be removed")
    require('requireLogin' not in APP, "login gate should be removed")
    require('loadState();\ninitializeStudyApp();' in APP, "app should initialize without a login gate")
    require('localStorage.getItem(LEGACY_STORAGE_KEY)' in APP, "progress should load from the shared local storage key")
    require('localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(state))' in APP, "progress should save to the shared local storage key")

    require('login-view' not in CSS, "login overlay styles should be removed")
    require('is-locked' not in CSS, "locked-app styles should be removed")
    require('is-authenticated' not in CSS, "authenticated-app styles should be removed")
    require('password-confirm' not in CSS, "password confirmation styles should be removed")
    require('saved-user' not in CSS, "saved-profile styles should be removed")

    require('themeToggle' not in APP, "theme toggle JS should be removed")
    require('securityPlusTheme' not in APP, "theme preference storage should be removed")
    require('data-theme' not in CSS, "theme attribute styles should be removed")
    require('Light mode enabled' not in INDEX, "light theme settings text should be removed")
    require('id="themeToggle"' not in INDEX, "theme toggle control should be removed")
    require('#f5f7fa' not in CSS[:800], "light root palette should be removed")

    readiness_match = re.search(r"\.readiness-ring \{(.*?)\n\}", CSS, re.S)
    require(readiness_match is not None, "readiness ring styles should exist")
    readiness_css = readiness_match.group(1)
    require('calc(var(--value) * 1%)' in readiness_css, "readiness ring should use --value for its conic fill")
    require(' 78%' not in readiness_css, "readiness ring should not have a hard-coded 78% fill")
    require('readinessEl.style.setProperty("--value", readiness)' in APP, "dashboard should set the readiness ring --value")

    require(count_array_objects("pbqScenarios") >= 8, "expected at least 8 PBQ scenarios")
    require(count_array_objects("labScenarios") >= 8, "expected at least 8 lab scenarios")
    require_scenario_ids("pbqScenarios", [
        "wireless-authentication",
        "risk-treatment",
        "log-triage",
        "cloud-shared-responsibility",
    ])
    require_scenario_ids("labScenarios", [
        "phishing-triage",
        "cloud-storage-exposure",
        "wireless-rogue-ap",
        "vulnerability-prioritization",
    ])

    print("All Security+ source checks passed.")


if __name__ == "__main__":
    main()
