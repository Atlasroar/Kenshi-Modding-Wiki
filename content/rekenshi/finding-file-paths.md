---
title: Finding File Paths
description: Use reKenshi's file I/O logger to capture exact rebinding keys and escape them for JSON.
publish: true
---

A rebind needs the exact string Kenshi uses to open the original file.
reKenshi's **Log file I/O** option records those strings.
The source workflow and screenshots are listed on
[[credits#rekenshi-and-kenshilib-sources|Credits]].

## Capture an actual file open

1. Open reKenshi settings and enable **Log file I/O**.
2. Cause the game to open the target file: load a save/new game, visit a relevant
   location, or load an object that uses it.
3. If the file is opened only at startup or is already cached, close and restart
   Kenshi with logging enabled, then reproduce the load.
4. Exit and open **`FileIOLog.txt` in the Kenshi installation root**.
5. Search for the filename and copy the original path exactly.

![reKenshi setting that enables file I/O logging](assets/rekenshi/log-file-io.png)

The logger records opens **after** it is enabled. Seeing nothing in the current
log is not proof that the game never uses the file.

![FileIOLog.txt in the Kenshi installation directory](assets/rekenshi/file-io-log-folder.png)

![Searching the file I/O log for the heightmap filename](assets/rekenshi/file-io-log-heightmap.png)

## Convert the path into a JSON string

The heightmap example logs `data\newland/land\fullmap.tif`. In a JSON key,
write it as `"data\\newland/land\\fullmap.tif"`. Keep the forward slashes and
backslashes in their original positions.

```json
{
  "FileRebinds": {
    "data\\newland/land\\fullmap.tif": "$(modroot \"Heightmap mod\")/fullmap.tif"
  }
}
```

Use [[rekenshi/file-rebinding|File Rebinding]] for the mapping and `modroot`
rules, or follow [[rekenshi/heightmaps|Loading a Modded Heightmap]].

Turn file I/O logging off after the test; it adds overhead and is not a routine
performance setting. The workflow has not been independently retested in Kenshi.
