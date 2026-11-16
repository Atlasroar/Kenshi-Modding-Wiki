---
title: FAQ & Common Problems
description: Version compatibility, missing DLLs, recruitment limits, Proton installation, and reKenshi bug-report privacy.
publish: true
---

The upstream FAQ is **work in progress**. This page combines it with the supplied
Steam guide and current installation notes, retaining their version boundaries
instead of promising universal compatibility.
[[credits#rekenshi-and-kenshilib-sources|Credits]] lists the original pages.

## Is a save import required?

The project FAQ says installing reKenshi itself does **not** require an import.
A separate plugin or ordinary mod can have different requirements.
The author's compatibility goal is broad support, not proof that every
combination of native plugins, UI changes, and game builds works together.

## Installer cannot find a DLL

Check that **all archive files were extracted together** rather than launching
one executable from an incomplete archive. The other common cause in the FAQ is
a missing **Microsoft Visual C++ x64 redistributable**. Official Microsoft
downloads are on [[credits#rekenshi-downloads-and-development-resources|Credits]].
Do not download replacement DLLs from unrelated DLL-download sites.

## Why does the game identify as 1.0.65?

The checked 0.3.5 release lists supported Steam/GOG **1.0.65 and 1.0.68** builds,
but reKenshi's compatibility setup is based on 1.0.65. For supported 1.0.68
installations, the installer creates a compatible executable under `RE_Kenshi`.
This is different from loading arbitrary native code against an unsupported
1.0.68 executable.

The documented `--norekenshi` launch argument starts vanilla 1.0.68 with reKenshi
disabled. Manual installation is documented for supported 1.0.65 builds only;
use the installer for the 1.0.68 compatibility setup.

## Cannot talk to recruits

In reKenshi settings, inspect **maximum squad size**, **maximum faction size**,
and **maximum squads**. An accidentally low override can stop recruitment.
Set the override appropriately, uncheck its checkbox, or return the slider to
**0** to use the normal/mod-provided value.

## The interface could not initialize

The supplied Steam guide suggests **borderless fullscreen** for the
`RE_Kenshi: Could not initialize UI` error. This is a community troubleshooting
step, not a confirmed cure for every cause. If it persists, record the exact
error, display mode, versions, and installed UI/renderer plugins.

## Linux and Steam Deck

Use the [[rekenshi/overview#install-through-proton-on-linux-or-steam-deck|Proton installation workflow]].
If the installer will not launch, check its Non-Steam Game entry and forced
Proton Experimental setting. If it cannot locate Kenshi, copy the executable
path from Steam's **Browse local files** instead of guessing hidden directories.

The supplied guide reports that reinstalling can sometimes complete after an
initial installer error. Preserve the actual error first; a second attempt is
an anecdotal workaround, not a reliable diagnosis. Verify success from the
in-game version/settings rather than only looking for a new executable.
Include **Linux/Steam Deck versus Windows** in support reports.

## Free camera and renderer plugins

The supplied guide's free-camera warning applies to **0.3.0/0.3.1**; it describes
restoration in **0.3.2** and an optional Freecam Rebuilt plugin. Do not carry the
old limitation forward as if it affected all releases.
Its ReShade advice is also version-specific; see the
[[rekenshi/overview#reshade-camera-changes-and-other-plugins|Overview]].

## Bug reports and privacy

The wiki prefers direct developer contact for installer bugs because installer
error reports alone may not contain enough information. Other routes include
the Nexus bug page, the issue tracker, and the in-game reporter. Contacts are on
[[credits#rekenshi-downloads-and-development-resources|Credits]].

When reporting a crash, include the reproducible steps, game/reKenshi versions,
platform, and relevant plugins. **General > Report Bug > UUID hash** gives the
identifier the developer uses to associate reports and previously sent dumps.
The wiki describes it as a hash of a randomly generated Windows installation
identifier, not a display of your account name.

> [!warning] A crash dump is different from an identifier
> An identifier's format does not guarantee that the associated report is
> anonymous. Crash dumps can contain identifying data. Review what you send,
> avoid posting private dumps publicly, and contact the developer directly about
> deletion requests. The in-game reporter also lacks the back-and-forth of a
> direct support conversation.

No troubleshooting step on this page has been independently retested in Kenshi.
