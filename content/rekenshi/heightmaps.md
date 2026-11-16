---
title: Loading a Modded Heightmap
description: Load a mod-owned fullmap.tif through reKenshi without replacing Kenshi's vanilla heightmap.
publish: true
---

Kenshi normally loads `fullmap.tif` from a hard-coded location. A reKenshi file
rebind can load a mod-owned copy instead, keeping the original file intact.
This adapts the project's tutorial; original instructions and screenshots are on
[[credits#rekenshi-and-kenshilib-sources|Credits]].

## Prerequisites

Install **reKenshi 0.2.2 or newer** and confirm its version in the main menu.
Use [[rekenshi/overview|the current installation overview]] for the
installer/compatible-executable distinction; the tutorial's minimum version
is not a claim that every game build works.
Keep backups and use a separate test mod.

## Find the original path

Enable **Log file I/O**, restart Kenshi, then load a new game or save.
Exit and search `FileIOLog.txt` for `fullmap.tif`.
The source captures **`data\newland/land\fullmap.tif`**.
Keep the mixed separators exactly as logged on the build you are using.
The screenshots and detailed logging steps are on
[[rekenshi/finding-file-paths|Finding File Paths]].

## Create an enabled mod

Create a new FCS mod, called **Heightmap mod** in this example.
The mod's `.mod` file is needed for reKenshi to detect the enabled package even
when the package has no meaningful FCS record changes. Close the FCS afterward.

![A heightmap mod created in the FCS mod list](assets/rekenshi/fcs-heightmap-mod.png)

At the root of the mod folder, create `RE_Kenshi.json`.

![RE_Kenshi.json placed in the heightmap mod's root folder](assets/rekenshi/heightmap-config-folder.png)

```json
{
  "FileRebinds": {
    "data\\newland/land\\fullmap.tif": "$(modroot \"Heightmap mod\")/fullmap.tif"
  }
}
```

Replace **Heightmap mod** with the real enabled mod name if yours differs.
`modroot` resolves the mod folder without assuming a Workshop folder number;
`\\` and `\"` are JSON escaping, not extra characters in the runtime path.

## Add the replacement heightmap

Copy the original `fullmap.tif` into the mod folder, then edit **the copy**.
Do not overwrite the original vanilla heightmap.

![Completed heightmap mod folder containing fullmap.tif and its configuration](assets/rekenshi/heightmap-source-folder.png)

The mod folder now contains its `.mod` file, `RE_Kenshi.json`, and
`fullmap.tif`. Enable the mod in Kenshi's normal mod list and test it.
The tutorial does not specify a complete image-editing/export recipe, so none
is invented here.

Users need the required reKenshi version as well as your mod. With that
dependency installed, they install/subscribe to and enable the mod normally.
See [[rekenshi/file-rebinding|File Rebinding]] for path matching, JSON
validation, and replacement-file checks.

> [!note] Heightmap-loader compatibility needs attention
> reKenshi also offers compressed and uncompressed loaders. The source tutorial
> does not document every interaction with custom heightmaps. Keep track of the
> selected [[rekenshi/features#heightmap-loading|loader mode]] while testing;
> do not claim that every compression/configuration combination is verified.

This workflow has not been independently retested in Kenshi.
