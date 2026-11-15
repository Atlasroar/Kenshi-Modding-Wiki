---
title: Writing and contribution guide
description: How to prepare a clear, attributed, and reviewable Kenshi modding article.
aliases:
  - contributing
publish: true
cssclasses:
  - page-kenshi
---

> [!infobox] Article field notes
>
> <dl>
> <dt>Scope</dt>
> <dd>Website contributions</dd>
> <dt>Format</dt>
> <dd>Markdown with Obsidian-compatible links</dd>
> <dt>Publication</dt>
> <dd>Explicit review and approval</dd>
> </dl>

A good guide answers one modding question and makes its steps repeatable.
This page is new website documentation; it is not an imported game guide.

Return to the [[index|field manual homepage]].

## Start with the outcome

Explain what the reader will change, which tools they need, and how they can
tell that the result worked. State the game or tool version when the behavior
depends on it.

Separate a confirmed result from a hypothesis. If a method is still being
investigated, say so instead of presenting it as established behavior.

> [!warning] Keep experiments reversible
> Work on a separate test mod and keep a backup before editing a save.
>
> > [!note] Record the context
> > Include the relevant load order and dependencies when they affect the result.

## Use links that survive publication

Use folder-qualified links such as `[[guides/contributing]]` when names could
be ambiguous. Link to a section using `[[guides/contributing#Publication checklist]]`.
Standard Markdown links are also supported.

Do not link directly to a drive on your computer. An attachment must be reviewed,
copied into the repository, and referenced using its published relative path.
Do not assume that a screenshot URL with an expiry parameter will keep working.

For the first 17-guide import, the owner requested visible image placeholders.
Keep each marker at the original image location until an approved replacement
is available. A **reference page not imported** notice records an out-of-batch
dependency; do not turn it into a guessed link or an empty article.

## Structure a guide

| Section         | What it should tell the reader                                   |
| --------------- | ---------------------------------------------------------------- |
| Goal            | The specific result the guide produces                           |
| Requirements    | Tools, versions, dependencies, and starting conditions           |
| Method          | Ordered actions, with screenshots only where they clarify a step |
| Verification    | Observable evidence that the change worked                       |
| Troubleshooting | Known failure modes and how to identify them                     |
| Sources         | Author credits, original references, and asset permissions       |

Use headings for long explanations, code blocks for file paths or data, and
tables for comparisons. Avoid layouts that require a wide desktop screen.

## Publication checklist

- [ ] The author has approved publication, with the original source credited.
- [ ] Text and media have appropriate reuse permissions.
- [ ] Private notes, account details, and local filesystem links are absent.
- [ ] Internal links and section anchors resolve; unavailable reference pages
      are explicitly marked.
- [ ] Screenshots resolve or have an explicitly approved, visible placeholder.
- [ ] The instructions distinguish tested behavior from open questions.
- [ ] The article remains readable on a narrow screen.

Setting `publish: true` makes a page eligible for the site build. It is not a
substitute for review: do not commit private material even with publication
disabled, because repository history can still expose it.
