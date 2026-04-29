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
    require('id="loginView"' in INDEX, "login view is missing")
    require('id="loginForm"' in INDEX, "login form is missing")
    require('id="currentUserName"' in INDEX, "current user display is missing")
    require('id="logoutButton"' in INDEX, "logout button is missing")

    require('const USER_KEY = "secplus-study-current-user";' in APP, "current-user storage key is missing")
    require('function getUserStorageKey(username)' in APP, "user-scoped storage key helper is missing")
    require('localStorage.setItem(getUserStorageKey(currentUser.username)' in APP, "progress is not saved per user")
    require('function loginUser(' in APP, "login function is missing")
    require('function logoutUser(' in APP, "logout function is missing")
    require('function requireLogin()' in APP, "login gate is missing")
    require('migrateLegacyProgress' in APP, "legacy progress migration is missing")
    require('LEGACY_MIGRATED_KEY' in APP, "legacy progress should only migrate once")

    require('themeToggle' not in APP, "theme toggle JS should be removed")
    require('securityPlusTheme' not in APP, "theme preference storage should be removed")
    require('data-theme' not in CSS, "theme attribute styles should be removed")
    require('Light mode enabled' not in INDEX, "light theme settings text should be removed")
    require('id="themeToggle"' not in INDEX, "theme toggle control should be removed")
    require('#f5f7fa' not in CSS[:800], "light root palette should be removed")

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
