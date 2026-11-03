# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- Create issues with `gh issue create --title "..." --body "..."`.
- Read issues with `gh issue view <number> --json number,title,body,labels,comments`.
- List issues with `gh issue list --state open --json number,title,body,labels,comments`.
- Create sub-issues with `gh issue create --parent <parent> ...`; if unavailable, put `Part of #<parent>` at the top of the child body.
- Track blockers with GitHub issue dependencies (`--blocked-by` / `--add-blocked-by`). If unavailable, put `Blocked by: #<n>` at the top of the issue body.
- Comment with `gh issue comment <number> --body "..."`.
- Apply or remove labels with `gh issue edit <number> --add-label "..."` / `--remove-label "..."`.
- To close an issue, post an explanation, then run `gh issue close <number>`.

Infer the repo from `git remote -v`; `gh` does this automatically inside a clone. Before creating the first issue in a session, confirm the target with `gh repo view --json nameWithOwner`. File issues only in the user's own repo.

## Pull requests as a triage surface

**PRs as a request surface: no.** Set to `yes` only if this repo treats external PRs as feature requests.

When enabled, use `gh pr` equivalents to read, comment on, label, and close PRs. GitHub shares one number space across issues and PRs; check `gh pr view <number>` and then `gh issue view <number>` to identify a reference.

## When a skill says “publish to the issue tracker”

Create a GitHub issue. When it says “fetch the relevant ticket,” read that issue. Wayfinding maps use a `wayfinder:map` issue with child issues; use `wayfinder:<type>` labels for child tickets. Claim a ticket with `gh issue edit <n> --add-assignee @me`.
