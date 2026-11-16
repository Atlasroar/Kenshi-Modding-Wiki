---
title: reKenshi & KenshiLib
description: Installation, configuration, file rebinding, audio modding, and native plugin development.
publish: true
---

reKenshi extends Kenshi beyond ordinary FCS data editing. KenshiLib exposes game
structures and functions to native C++ plugins. They are related projects, but
installing and configuring a plugin is different from developing one.

## reKenshi

Start with the [[rekenshi/overview|reKenshi Overview]] for installation,
Steam Workshop plugins, settings, and the relationship between the projects.

- [[rekenshi/features|Features & Settings]] explains player options and advanced settings.
- [[rekenshi/faq|FAQ & Common Problems]] covers installation, recruits, versions, and bug reports.
- [[rekenshi/file-rebinding|File Rebinding]] introduces `RE_Kenshi.json` and exact path matching.
- [[rekenshi/finding-file-paths|Finding File Paths]] explains file I/O logging.
- [[rekenshi/heightmaps|Loading a Modded Heightmap]] applies rebinding to `fullmap.tif`.
- [[rekenshi/sound-banks|Sound Banks]] preserves the work-in-progress Wwise workflow.

## KenshiLib

The [[rekenshi/kenshilib/index|KenshiLib Overview]] introduces the library,
development dependencies, threading precautions, and licensing considerations.
[[rekenshi/kenshilib/hooks|Function Hooks]] explains address resolution,
compatible hook chains, calling conventions, and unfinished ABI details.

> [!warning] Source snapshots, not an in-game certification
> The project wikis and supplied Steam guide describe different releases.
> Version-specific limitations are labeled on the relevant pages. These
> instructions have not been independently retested in Kenshi.

Browse [[modding/index|the available modding guides]].
