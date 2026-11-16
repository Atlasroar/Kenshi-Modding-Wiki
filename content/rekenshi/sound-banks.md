---
title: Sound Banks
description: A work-in-progress reKenshi workflow for identifying Wwise events and loading a mod-owned sound bank.
publish: true
---

> [!warning] Work in progress
> The source explicitly describes unfinished sound-modding documentation.
> It uses **Wwise 2014.1.3** and recommends **44.1 kHz WAV** audio.
> Do not assume a current Wwise version produces a bank compatible with Kenshi.
> The workflow below has not been independently retested.

Some original screenshots show **2014.1.6**, rather than the text's **2014.1.3**
recommendation. This source inconsistency is not confirmation that their
generated banks are interchangeable.

Kenshi uses Wwise for audio. reKenshi can load a `.bnk` sound bank to add sounds
or replace existing events. The source links and original screenshots are on
[[credits#rekenshi-and-kenshilib-sources|Credits]]; tool references are collected
there rather than linked out from this guide.

## Identify an event

In reKenshi's **Debug Log** tab, enable audio ID/event/switch/state logging.
Trigger the relevant sound in-game. The source says identifiers are printed
the first time they are used; capture the event name that you need.

![Audio-event logging controls in reKenshi's Debug Log tab](assets/rekenshi/audio-logging.png)

![Audio identifiers and events printed in the debug log](assets/rekenshi/audio-events.png)

Do not leave these diagnostics running for ordinary play: logging and viewing
the Debug Log can reduce performance.

## Create the Wwise project and event

1. In the source-compatible Wwise version, create a project.
2. Import your audio into the **Actor-Mixer Hierarchy > Default Work Unit**.
3. Under **Events**, create an **Empty Event** in the Default Work Unit.
4. Name it exactly like the Kenshi event you intend to replace or add. The
   tutorial uses **Hover**, triggered by hovering over main-menu buttons.
5. With the Event Editor open, return to **Audio** and drag the sound onto the
   event's action panel.

![Creating the Wwise project](assets/rekenshi/wwise-project.png)

![Importing a sound into the Actor-Mixer hierarchy](assets/rekenshi/wwise-import.png)

![Creating an empty event](assets/rekenshi/wwise-event.png)

![Naming the event Hover to match the game's event](assets/rekenshi/wwise-event-name.png)

![Adding the audio sample to the event's actions](assets/rekenshi/wwise-event-sound.png)

## Generate a bank

Under **SoundBanks**, create a bank in the Default Work Unit.
Open its SoundBank Editor, return to **Events**, and drag the event into the
bank's hierarchy inclusion panel. Then generate the bank for the current
Windows platform.

![Creating a sound bank](assets/rekenshi/wwise-bank.png)

![Opening the SoundBank Editor](assets/rekenshi/wwise-bank-editor.png)

![Adding the event to the bank's inclusion panel](assets/rekenshi/wwise-bank-event.png)

![Generating the bank for the current platform](assets/rekenshi/wwise-generate.png)

The source's default output location is
`Documents\WwiseProjects\<Project Name>\GeneratedSoundBanks\Windows`.
Copy the resulting `.bnk` into your enabled Kenshi mod folder.

## Tell reKenshi to load it

Create or extend `RE_Kenshi.json` at the root of the mod. This example uses a
mod named **sound_test** and a bank named **New_SoundBank.bnk**:

```json
{
  "SoundBanks": ["$(modroot \"sound_test\")/New_SoundBank.bnk"]
}
```

Use your actual mod and bank names. When combining this with `FileRebinds`,
keep both properties in **one valid JSON object**, not two pasted documents.

![Mod folder containing the bank and RE_Kenshi.json example](assets/rekenshi/sound-bank-config.png)

Enable the mod, trigger the event, and confirm the intended sound is used.
The source does not finish documenting the full JSON schema, event-discovery
edge cases, or every Wwise limitation. Those gaps remain unverified; this is
not a complete audio-engine reference.
