---
title: Creating Dialogue in the FCS
description: Build a player conversation, connect its package to an NPC, and test conditions, effects, and word swaps.
publish: true
tags:
  - kenshi
  - modding
  - dialogue
cssclasses:
  - page-kenshi
  - center-images
---

[[dialogue/index|Dialogue guides]] · [[modding/index|All modding guides]]

This walkthrough combines the dialogue instructions from the two supplied
Steam guides into one workflow. The goal is an NPC greeting with two player
responses, optional conditions and effects, and a package assigned to an NPC.

> [!info] Older interfaces
> The source screenshots show older FCS versions. Button names and layout may
> differ from your installation. These instructions summarize the source guides;
> they have not been independently retested in the current game.

## Prepare a test mod

Create a separate test mod, load the dependencies you need, and confirm that it
is **ACTIVE** before editing. Use the Changes panel to review what your mod
modifies and revert an unintended change. See
[[modding/fcs/complete-guide|The FCS - A Complete Guide]] for editor setup.

Choose an NPC you can reliably encounter in a new test game. For the
player-initiated conversation example, use a squad leader, as in the source
tutorial's barkeeper setup. Keep changes to the NPC and its squad isolated in
your test mod.

> [!warning] Shared dialogue
> Editing existing dialogue can affect every character that references it.
> Create your own package and dialogue for the experiment, and inspect references
> before changing shared content. Do not dismiss missing-reference errors just
> because an older tutorial described a patch-specific warning as harmless.

## Understand the objects

A **dialogue** is a tree: one root with child lines beneath it. A **dialogue
package** connects one or more dialogues to events and is assigned to a
character or through its squad. A package can also inherit other packages.

**Word Swaps** provide substitutions inside a single spoken line. **World
States** supply broader conditions, such as an important NPC's status.
The `_lines` category stores individual dialogue lines; it is not where you
need to begin writing a new conversation.

Use a package for this tutorial. It lets you attach a player-triggered
conversation without relying on a character's standalone dialogue field.

## Create a package and select its event

1. Expand **Dialogue Package** in Game World.
2. Create a **New Item** in the package list and give it a recognizable name,
   such as `Guide Conversation Package`.
3. Open the package and select **EV_PLAYER_TALK_TO_ME** in its Events list.
4. Choose **Add New** to create your own dialogue. **Add Dialogue** attaches
   an already-written dialogue instead; it does not make an independent copy.
5. Give the new dialogue a recognizable name, such as `Guide First Greeting`.

![Player-talk event selected in a new dialogue package](assets/dialogue/package-event.png)

Other events serve different purposes. The source exercises use
`EV_I_SEE_NEUTRAL_SQUAD` for sight-triggered examples; that is not a substitute
for the player-click conversation event used here.

Select the dialogue entry inside the package and set **monologue = False**
for a conversation with player replies. Leave **locked = False** for the first
test. A locked entry needs the appropriate unlock/discovery mechanism before
it can be selected.

If the conversation should work with enemies, review both the dialogue's
**Can talk to enemy** setting and its package entry's **for enemies** setting.
Do not assume changing one control changes the other.

## Write the root and player responses

1. In the dialogue window, choose **Add Root**; some source wording calls this
   Create ROOT.
2. Select the root and set **speaker = T_ME**. In this simple conversation,
   that is the NPC, not the player who clicked it.
3. Enter a greeting in **text0**, for example: `What do you need?`
4. Select the root, right-click it, and choose **Add Child**.
5. Set the child speaker to **T_TARGET_IF_PLAYER**, then enter a player reply
   in text0, such as `Tell me about this place.`
6. Select the root again and add a second player child, such as `Nothing. Goodbye.`

![Speaker selector on a dialogue root](assets/dialogue/root-speaker.png)

Player lines appear **red** in the source interface. If a reply has the wrong
speaker, it is not a player option simply because it sits beneath the greeting.

Add an NPC child beneath the first player response and set it back to `T_ME`.
This produces a basic alternating tree:

```text
NPC: What do you need?
  Player: Tell me about this place.
    NPC: A short answer about the location.
  Player: Nothing. Goodbye.
```

![NPC and player branches in a dialogue tree](assets/dialogue/dialogue-branches.png)

### Variations are not separate choices

The **text0, text1, text2, ...** fields provide alternative wording for one
line; the game chooses a variation. They do not create multiple player options.
Use separate child nodes for separate choices.

![Multiple text fields providing variations for one line](assets/dialogue/text-variations.png)

The source exercises also reuse a line by **Shift-dragging** it beneath another
branch. Treat that as shared dialogue structure, not an independent copy.
Keep the first conversation simple before introducing shared branches or loops.

## Add word swaps

Expand **Word Swaps** and examine an existing entry before making your own.
The source demonstrates tokens such as `/LAUGH/` and `/BARBARIAN/`. The token
uses the swap's name between slashes; do not include the slashes in the
object's name.

For a custom example, create a swap named `GUIDE_GREETING`, give its root
alternative text values, and use this in an NPC line:

```text
/GUIDE_GREETING/ What do you need?
```

Use uppercase names consistently and confirm that the swap exists. A swap
provides wording inside a **single line**, not a multi-line conversation branch.
The source also demonstrates multiple tokens in one line and swaps containing
short words or numbers.

![A word swap with several replacement text values](assets/dialogue/word-swap.png)

## Gate an option with conditions

Select the line you want to restrict, choose the relevant talker and condition,
choose an operator and value, then **Add** the condition to the list. Selecting
values in the controls alone is not the same as adding the check.

For yes/no checks, **1 = yes** and **0 = no**. Choose the talker deliberately:
checking the NPC's imprisonment state is different from checking the player's.
The source exercises use checks such as `DC_IS_IMPRISONED`, `DC_IS_KO`, and
`DC_SQUAD_SIZE`.

The second guide illustrates a player-money condition using
**T_TARGET_IF_PLAYER** and **DC_PLAYERMONEY**. For an option intended to require
strictly more than 20,000 cats, use:

```text
T_TARGET_IF_PLAYER / DC_PLAYERMONEY / > / 20000
```

This excludes **19,999** and **20,000** cats; **20,001** passes this check.
If you want equality included, choose an appropriate inclusive operator
available in your FCS rather than treating `>` as inclusive.

![Player-money condition added to a player response](assets/dialogue/player-money-condition.png)

The screenshot uses a different threshold from the example above. Enter your
own intended value; copying the visual layout is not a substitute for checking it.

Line conditions control that line's availability. Conditions on the root can
prevent the conversation from opening, and the package has its own conditions.
Check all these levels when a conversation or option disappears.
See [[modding/dialogue/conditions-and-effects|Dialogue Condition & Effects]]
for the existing condition and talker reference.

## Add effects only after the tree works

Effects make a selected line do something beyond displaying text. Choose the
effect, configure its value when required, and add it to the effect list.
The source shows actions including joining a squad, attacking, trading, and
opening the character editor.

![A join-squad effect selected in the dialogue editor](assets/dialogue/dialogue-effect.png)

Start with one effect and verify which character it affects in game. Do not
assume changing the line's displayed speaker changes every effect's recipient.
Trading also needs an appropriately configured trader and vendor list; a
dialogue effect alone does not build that setup.

## Review availability and repetition

The package entry and individual lines expose controls that can make otherwise
correct dialogue appear unavailable:

| Setting          | What to review                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------- |
| chance permanent | The source describes the chance that a character has the assigned dialogue.              |
| chance temporary | The chance of using an available line/dialogue.                                          |
| repetition limit | How often it may repeat; review the selected line and the package entry.                 |
| score bonus      | Priority when multiple valid lines are available.                                        |
| target is type   | A target's fundamental role/type, not a replacement for every race or faction condition. |
| locked           | Whether the entry needs to be unlocked/discovered before selection.                      |

For the initial test, use **100** for both chance fields and avoid a once-only
restriction. This removes probability and prior-use restrictions from the
first debugging pass; other conditions must still pass.

![Repetition-limit options in the dialogue editor](assets/dialogue/repetition-limit.png)

The older guide lists VSHORT as about 20 in-game minutes, SHORT as 2 hours,
MEDIUM as 6 hours, LONG as 48 hours, and a one-week option. These are source
values, not an independently verified current-version timing guarantee.
Recheck both the entry and the line before concluding the event is broken.

![Dialogue-package properties used by the source exercises](assets/dialogue/package-properties.png)

## Assign the package to an NPC

Open the intended **Character** record. Select **dialogue package** in its
reference-list controls, choose **Add**, and select your new package.
Confirm that the package appears in the character's references.

![A custom dialogue package assigned to a character](assets/dialogue/npc-package.png)

The first source also attaches dialogue through a squad's leader setup.
Inspect the NPC's squad and existing packages so you know which definitions
the spawned character will actually use. A complete dialogue tree that is
never assigned to an encountered NPC cannot be tested by clicking unrelated NPCs.

Save the active mod, enable it for the game, and start a new test game with
the intended NPC available. The source's custom-bar/new-start example is a test
fixture, not a requirement to build a town for every conversation.

## Test and troubleshoot

- Confirm that clicking the intended NPC opens the greeting.
- Confirm that both separate player child nodes appear as choices.
- Check that the NPC reply appears under the correct player branch.
- Test a condition on both sides of its threshold, including equality.
- Repeat the interaction to check chance, repetition, and locked-state behavior.
- Verify effects on the intended character, then test any trader/AI prerequisites.
- Check that word swaps resolve rather than displaying a missing or incorrect token.

If nothing plays, work backwards: active/enabled mod, encountered NPC,
assigned package, correct event, unlocked entry, monologue setting, conditions,
chance, and repetition limits. Use the FCS Changes and Errors windows to inspect
data rather than repeatedly rewriting a tree that may not be connected.

For locating existing examples, see
[[modding/dialogue/find-specific-dialogue|How to Find Specific Dialogue]].

## Three-person conversations with the player

For a conversation between the player and two NPC interjectors, use a separate
**host** character that the player clicks to start talking. The host supplies
the opening line(s), but **cannot speak again once the speaker changes** and
**cannot be added as an interjector**.

Alternate each interjector line with player input; the interjectors cannot talk
directly to each other in this structure. A player reply such as
`[Continue listening]` lets the conversation proceed without adding spoken
player dialogue. Include an option to leave the conversation.

```text
Host: Opens the conversation.
  Interjector A: Speaks.
    Player: [Continue listening]
      Interjector B: Speaks.
        Player: [Leave]
    Player: [Leave]
```

Use **is character** to select specific interjector characters. Without that
restriction, another eligible NPC may be selected instead. The entire chain
breaks if a required NPC is unavailable to interject.

> [!warning] Effects act on the host
> In this structure, the imported note reports that all effects, including
> Join Squad Fast, apply to the host, not the current interjector. Verify the
> recipients in your test game before relying on an effect.

<span class="image-placeholder" role="note" data-image-index="1">Place relevant image here: Three speaker flow chart pic</span>

This section preserves the owner-cleared _Three Person Conversations with
Player_ note, including its reference to
<span class="pending-reference" role="note">Dialogue Structure Overlook (reference page not imported)</span>.
Its existing source terms are retained; these instructions have not been
independently verified.

Source descriptions, direct links to both Steam guides, screenshot permission,
and the imported note's attribution are on [[credits#dialogue-guide-sources|Credits]].
