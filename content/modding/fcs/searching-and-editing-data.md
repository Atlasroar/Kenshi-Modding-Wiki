---
title: FCS Searches and Bulk Editing
description: Find objects by values and references, combine filters, and safely use bulk-editing tools.
publish: true
tags:
  - kenshi
  - modding
  - fcs
cssclasses:
  - page-kenshi
  - center-images
source_title: Using the FCS
source_revision: 92817
source_license: CC BY-SA 3.0 Unported (adapted text)
---

[[fcs/index|FCS guides]] · [[modding/fcs/using-the-fcs|Interface walkthrough]]

## Search by name or String ID

Type in Game World's search box to filter the selected category by object name
or String ID. This search is **not case-sensitive**; `dome`, for example, finds
building names containing that word.

![building-name search for dome](assets/fcs/search.png)

## Filter by a property

Property names are **case-sensitive**; search values are not. Use the property's
actual name from the object view.

| Operator    | Match                                                          |
| ----------- | -------------------------------------------------------------- |
| `=`         | Exact value.                                                   |
| `!=`        | Not equal to the value.                                        |
| `>` / `<`   | Numeric values or list counts above / below a threshold.       |
| `>=` / `<=` | Numeric values or list counts at or above / below a threshold. |
| `:`         | Text containing a value.                                       |
| `!:`        | Text not containing a value.                                   |
| `?`         | String matching a regular expression.                          |

For example, `can block = true` finds weapons whose `can block` property is true.

![exact property-value search](assets/fcs/equal-to.png)

![numeric comparison search](assets/fcs/greaterless-than.png)

Numeric comparisons also work on lists: `faction > 1` finds squads with more
than one entry in their faction reference list.

![faction reference-list count search](assets/fcs/greaterless-than2.png)

For dialogue, `text0 : Hello` searches a particular indexed text field.
`text : Hello` searches across `text0`, `text1`, and the other indices.

![dialogue text containing Hello](assets/fcs/contains.png)

Use `!:` for the inverse, such as descriptions that do not contain a word.
The source's example finds crossbow descriptions without `quality`.

![descriptions not containing quality](assets/fcs/notcontains.png)

Use `?` for regex matching. Regex learning and testing references are listed on
[[credits#fcs-tools-and-references|Credits]], not embedded as outbound guide links.

![a regular-expression search](assets/fcs/regex.png)

### Combine filters

Separate search terms with **`;`** to require multiple conditions. The source
example combines a building name containing `outpost` with a construction cost
above 100 building materials: `outpost; build materials > 100`.

![combined name and construction-cost filters](assets/fcs/combined-search.png)

### Follow references

The special properties **Ref**, **Type**, and **State** are case-sensitive:
they filter reference count _to_ the item, object type, and item state.

For a reference list named `things`, the following patterns are supported:

| Filter                           | Meaning                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| `things > 5`                     | More than five entries in the list; other numeric comparisons also work.                 |
| `things = item name`             | References a target with this name or String ID.                                         |
| `things.v0 = 4`                  | An entry's first reference value is 4; `v1` and `v2` address the other reference values. |
| `things.property = blah`         | A referenced item matches `property = blah`; special properties work here too.           |
| `dialogs.lines.lines.effect > 0` | Follow several reference lists recursively, then compare the final property.             |

Periods follow reference chains, not just fields on the starting object. The
source illustrates searching characters through their faction's anti-slavery
setting, and interior buildings through functionality and consumed-item values
above 500 cats.

The illustrated filters are `faction.anti slavery = true` and
`functionality.consumes.value > 500`.

![searching characters through faction properties](assets/fcs/recursive.png)

![searching through several reference lists](assets/fcs/recursive2.png)

## Set Field

Select the intended objects, right-click, and choose **Set Field** to change a
field across the selection. Numerical fields support multiplication, division,
addition, and subtraction as well as assignment. The tool also supports adding
and modifying reference values in bulk.

![Set Field on selected objects](assets/fcs/set-field.png)

![bulk reference-value editing](assets/fcs/set-field-2.png)

> [!warning] Review the selection
> Bulk operations affect the selected items, not just the object you inspected.
> Confirm the active mod, field, and selection before applying a change.

## Find and Replace

Use Game World's right-click menu on selected items to replace text or filename
fields. On dialogue items it affects **all lines in that dialogue**. The dialogue
window's version likewise operates on all its lines. Regex searches are optional.

## Spellcheck

The application toolbar checks **all items**; the navigation window's context
menu checks **selected items**. Spellcheck is also available in the conversation
editor.

![the toolbar spellcheck button](assets/fcs/spellcheckbar.png)

![spellcheck for selected items](assets/fcs/spellcheckcontext.png)

The dictionaries are `Dictionary.txt` and `Dictionary_custom.txt`. The supplied
dictionaries support English; for another language, amend or replace
`Dictionary.txt` with an appropriate word list.

Continue with [[modding/fcs/managing-mods|mod management]] and
[[modding/fcs/checking-mod-errors|error checking]].

This page's adapted text is **CC BY-SA 3.0 Unported**.
[[credits#using-the-fcs-text-license|Credits]] identifies the original article,
contributors, revision, license, and changes. Screenshot permissions and individual source files are listed in
[[credits#fcs-screenshot-credits|screenshot credits]].
