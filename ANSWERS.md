# Lab 03 answers

## Mission 1
Config: runner is Playwright Test, baseURL http://127.0.0.1:4173, webServer starts `npm run start` and waits on /health, screenshot only on failure, trace kept on failure.
getByRole/getByTestId are better than XPath because they don't break when the layout or CSS changes.

A) A green smoke test only shows the page loads and the basic features work. It doesn't prove everything is correct.
B) Fixed sleeps are slow and flaky. Web-first assertions wait only as long as needed.
C) A quality gate blocks a merge when checks fail, so broken code doesn't reach main.

## Mission 2 - BUG-101 defect report
Steps: open the page, tick "Available bikes only".
Expected: 3 stations, Riverside Park (0 bikes) hidden.
Actual: still 4 stations, Riverside Park shown.
Fix: in public/app.js the filter was `s.bikes < 0`, changed to `s.bikes <= 0`.
Red screenshot: evidence/bug-101-red-failure.png

## Mission 4
Mocking the 503 makes the failure happen exactly once, every run. A real outage on a shared environment is random and other people are affected.

## Mission 6
When the CI gate is red: don't merge, read the report, fix the cause, push again.
Test recovery after a 503 because outages happen and users need a Retry that works.

Note: the workflow is written but I haven't run it on GitHub, so I can't claim the Actions check passed.
