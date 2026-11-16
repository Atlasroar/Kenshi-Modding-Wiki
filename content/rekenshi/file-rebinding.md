---
title: File Rebinding
description: Redirect hard-coded Kenshi file paths with RE_Kenshi.json without overwriting vanilla files.
publish: true
---

reKenshi can redirect a file-open path to another file, including paths that
ordinary FCS records cannot change. Create **`RE_Kenshi.json` in the root of an
enabled mod's folder**. Its `FileRebinds` object maps original paths to replacements.
The mod must be loaded; see [[rekenshi/heightmaps|the complete heightmap example]].

## Match the exact path

Paths are relative to the Kenshi installation root. A source key must match
what Kenshi actually uses, including its mixture of `/` and `\`. Do not
normalize the separators or invent a path from the folder layout.
Use [[rekenshi/finding-file-paths|file I/O logging]] to find the original string.

In JSON, a backslash must be escaped as `\\`. A double quote inside a string
must be escaped as `\"`. For example:

```json
{
  "FileRebinds": {
    "data\\newland/land\\fullmap.tif": "$(modroot \"Heightmap mod\")/fullmap.tif"
  }
}
```

Here the key represents the runtime path `data\newland/land\fullmap.tif`.
JSON escaping changes how it is written, not which runtime path it matches.

## Resolve a mod folder with modroot

`$(modroot "Heightmap mod")` resolves the root of the loaded mod named
**Heightmap mod**. Replace the name with the actual mod name, preserving the
JSON escaping shown above.
This avoids hard-coding a local `mods` folder or a Workshop numeric directory.

The replacement path can otherwise be written relative to the Kenshi root,
but that can make the configuration depend on a particular installation layout.
Put replacement files in your own mod instead of overwriting vanilla files.

## Check the configuration

Keep the file valid JSON: use quoted keys/strings, balance braces, and do not
leave a trailing comma after the last mapping. The project's schema and original
API page are listed on [[credits#rekenshi-and-kenshilib-sources|Credits]].

If rebinding fails, verify the mod is enabled, its name matches `modroot`, the
replacement file exists, and the key is copied exactly from the log.
Then check the [[rekenshi/features#heightmap-loading|heightmap loader settings]]
when the replacement is a heightmap. File rebinding is documented from
**reKenshi 0.2.2+**; do not assume older installations support it.

This source-based API explanation has not been independently tested in Kenshi.
