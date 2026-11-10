---
title: Career-Ops
year: 2026
period: November 2026
role: Open Source Contributor
status: Merged contribution · PR #6719
summary: Contributed a Windows compatibility fix to an open-source AI job-search tool, replacing oversized command-line prompts with temporary instruction files and adding regression tests.
tags: JavaScript, TypeScript, Node.js, Windows, CLI, Testing, Open Source
links: Merged pull request|https://github.com/career-ops-hq/career-ops/pull/6719 ; Original issue|https://github.com/career-ops-hq/career-ops/issues/6583 ; Career-Ops repository|https://github.com/career-ops-hq/career-ops
order: 5
art: career-ops
hero: /projects/career-ops/cover.png
heroAlt: Editorial illustration of the Windows evaluation issue, showing an oversized command-line prompt being replaced with a temporary instruction file.
heroCaption: A simplified illustration of the contribution. The image is not a screenshot of Career-Ops or a benchmark result.
heroWidth: 1400
heroHeight: 780
---

## Overview

I started using [Career-Ops](https://github.com/career-ops-hq/career-ops) while looking for software engineering internships. It's an open-source, local-first tool that uses AI to help people evaluate job postings, tailor application materials, and organize their search. It prepares work for the candidate, but the actual application still needs a human to review and submit it.

Using a tool is one thing. Reading through its code and contributing a fix is another. In November 2026, I worked on a Windows-specific bug in its evaluation dashboard. The fix became my first merged pull request to the project: [#6719](https://github.com/career-ops-hq/career-ops/pull/6719).

This wasn't a product I built from scratch. Career-Ops is maintained by its original creator and a community of contributors. My part was a focused change to how the web interface prepares instructions for an AI command-line process, plus tests to make sure that change behaves correctly.

## The problem

Career-Ops lets users choose which parts of a job evaluation they want to run. A full evaluation worked on Windows, but selecting only some sections could cause the request to fail before the AI process even started.

The error was `spawn ENAMETOOLONG`.

At first glance, that sounds like a problem with spawning the CLI itself. The issue report [#6583](https://github.com/career-ops-hq/career-ops/issues/6583) traced it to something more specific: for a partial evaluation, the application assembled the selected instructions into one large prompt and passed that prompt as a command-line argument.

On Windows, the command line passed to `CreateProcess` has a length limit of 32,767 characters. The issue report measured partial-evaluation prompts at roughly 62,000 to 92,000 characters. By contrast, the full-evaluation prompt was much shorter because it referred to existing instruction files instead of inlining their contents.

That meant a smaller evaluation could actually fail when a full one succeeded. The feature itself wasn't asking for too much work; the process-launch boundary was carrying too much text.

```flow
# Before: instructions passed directly as an argument
Choose sections|partial evaluation -> Build prompt|inline all selected instructions -> CLI argument|tens of thousands of characters -> Windows|spawn ENAMETOOLONG
```

## Finding the right boundary

The easy-looking solution would have been to shorten the instructions. But the instructions were part of the evaluation behavior; arbitrarily cutting them down could change what the agent was being asked to do.

Instead, I changed where that text lived. The worker still needed the selected instructions, just not inside a single oversized command-line argument.

For a focused evaluation, the application now writes those instructions into a temporary file inside the worker's data directory. The CLI receives a short reference telling it which file to read. The actual instruction text stays out of the launch arguments.

```flow
# After: a short command with a file reference
Choose sections|partial evaluation -> Write file|selected instructions in instructions.md
Write file|selected instructions in instructions.md -> Build prompt|short file reference -> Start worker|CLI reads selected instructions
Start worker|CLI reads selected instructions -> Cleanup|remove temporary directory on close
```

The full-evaluation path doesn't need that extra file, so the existing full-run behavior remains unchanged.

## How I implemented it

The change touched the evaluation API route and introduced a small helper called `writeEvaluationInstructions`. It creates a unique temporary directory for each run, writes a UTF-8 instruction file, and returns both a short prompt reference and a cleanup function.

This is a short excerpt from the [merged helper](https://github.com/career-ops-hq/career-ops/pull/6719/files):

```js title="evaluation-instructions-file.mjs · excerpt"
const dir = fs.mkdtempSync(path.join(root, ".evaluation-instructions-"));
const file = path.join(dir, "instructions.md");

fs.writeFileSync(file, instructions, {
  encoding: "utf8",
  mode: 0o600,
});
```

The per-run directory matters because two evaluations could be running at once. Their instructions should never overwrite each other. The file is created with restrictive permissions, and its directory is removed when the child process closes or if setup fails.

The route uses the short file reference when building the prompt. That way, the prompt still tells the worker to use *only the sections selected by the user*, rather than loading the complete evaluation instructions by accident.

One detail I hadn't appreciated before working on this was that cleanup is part of a correct fix. A temporary file can solve the launch problem and still become a problem of its own if cancelled or failed runs leave instructions behind.

## Testing the change

I added regression tests for the instruction-file helper and for the route that launches evaluations. The tests cover more than whether a file can be written.

They check that partial selections produce short prompts, preserve the exact selected instructions, and don't accidentally include omitted sections. They also cover concurrent files and Unicode content, along with cleanup after normal process closure, cancellation, and error paths. Full evaluations are checked to make sure they don't create unnecessary instruction files.

I ran the focused tests on Windows using Node.js 24.19.0. All nine focused tests passed. I also started the larger test suite, but did not complete the entire run before opening the pull request. The process-level tests used simulated AI processes, so the PR did not establish end-to-end compatibility with every real CLI.

That limitation was part of the submitted review, not something I wanted to hide. A passing unit test and a successful end-to-end run establish different things.

## From pull request to merge

I opened [PR #6719](https://github.com/career-ops-hq/career-ops/pull/6719) as a draft so maintainers could weigh in on the approach. The change was connected to [issue #6583](https://github.com/career-ops-hq/career-ops/issues/6583), which documented the Windows failure and the unusually long prompts.

The pull request changed four files: the launch route, the new instruction-file helper, and two sets of tests. It was merged into Career-Ops on **November 9, 2026**.

One of the maintainers specifically mentioned that the regression tests covering process closure, cancellation, and errors helped make the change easier to trust. That was satisfying because those were exactly the cases I didn't want to ignore just to make the happy path pass.

The merged PR is the concrete record of the contribution. I can't claim to have implemented the rest of Career-Ops, nor can I claim a measured improvement in job-search outcomes from this fix.

## What I learned

The biggest lesson for me was that the failure wasn't really in the AI model. It was in the boundary between a web application and a process launched by the operating system.

Passing a string into a CLI seems harmless until the string grows large enough to hit a platform limit. Moving the instructions to a file changed almost nothing about what the worker was supposed to do, but it changed the transport mechanism enough to fix the problem.

I also learned how much real software engineering involves the less visible parts of an application: cancellation, process lifetime, cleanup, preserving existing behavior, and writing tests for the things users aren't supposed to notice.

Contributing to a codebase maintained by other developers made me more deliberate about scope. The goal wasn't to redesign the evaluation system or add another feature. It was to make one existing feature behave reliably on Windows and provide enough evidence for a maintainer to review it.

I'd like to keep contributing to open-source tools I actually use. This was a good first reminder that you don't need to own an entire product to make a useful improvement to it.
