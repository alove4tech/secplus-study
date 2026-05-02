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


def count_flashcard_ids():
    match = re.search(r"const flashcards = \[(.*?)\n\];", APP, re.S)
    require(match is not None, "flashcards array is missing")
    return len(re.findall(r'id: "fc-', match.group(1)))


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

    require(count_flashcard_ids() >= 80, "expected a large flashcard pool of at least 80 cards")
    require('const DAILY_FLASHCARD_COUNT = 20;' in APP, "daily flashcard deck should contain 20 cards")
    require('const KNOWN_CARD_REVIEW_INTERVAL = 5;' in APP, "known cards should occasionally be rechecked")
    require('function buildDailyFlashcardDeck(' in APP, "daily flashcard deck builder is missing")
    require('function stableDailyScore(' in APP, "daily deterministic card scoring is missing")
    require('function getFlashcardRecord(' in APP, "flashcard progress helper is missing")
    require('function markFlashcard(status)' in APP, "flashcards should be markable as known or unknown")
    require('markFlashcard("known")' in APP, "known flashcard status should be persisted")
    require('markFlashcard("trouble")' in APP, "unknown flashcard status should be persisted")
    require('troubleCards' in APP and 'knownReviewCards' in APP, "daily deck should prioritize unknown cards and sometimes include known cards")
    require('id="markCardKnown"' in INDEX, "Known button is missing")
    require('id="markCardTrouble"' in INDEX, "Unknown button is missing")
    require('>Unknown</button>' in INDEX, "flashcard trouble button should be labeled Unknown")
    require('Still Trouble' not in INDEX and 'Still trouble' not in INDEX and 'Still gives trouble' not in APP, "old Still Trouble wording should be removed")
    require('id="flashcardDeckSummary"' in INDEX, "daily deck summary is missing")
    require('Daily set' in INDEX, "flashcard UI should describe daily sets")
    require('0 / 6' not in INDEX, "dashboard should not show stale 6-card flashcard count")
    require('0 / 100' in INDEX, "dashboard should reflect the large flashcard pool")

    require('A checklist, not an auto-generated lesson' in INDEX, "study plan should explain what it is")
    require('Check items off manually as you finish them' in INDEX, "study plan should explain how to complete items")
    require('Mark done after you complete that activity' in INDEX, "dashboard daily plan should explain completion")

    require('id="practiceDomainSelect"' in INDEX, "scenario practice should have a domain/objective selector")
    require('Practice one Daily Plan section at a time' in INDEX, "practice selector should explain Daily Plan alignment")
    require('data-practice-domain-filter' in INDEX, "practice selector should expose a hook for filter styling")
    require('objectives: ["1.1", "1.2"]' in APP, "study plan items should encode objective ranges for practice filtering")
    require('function renderPracticeDomainOptions()' in APP, "practice domain selector renderer is missing")
    require('function getSelectedPracticeQuestionIds(' in APP, "practice filtering helper is missing")
    require('function getSelectedPracticeTemplateIds(' in APP, "practice template filtering helper is missing")
    require('practiceDomainSelect' in APP, "practice domain selector should be wired in JavaScript")
    require('selectedPracticeObjectives' in APP, "selected objectives should drive practice sessions")
    require('.filter((id) => id !== null)' in APP, "practice filter should gracefully handle empty objective matches without dropping question 0")

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
