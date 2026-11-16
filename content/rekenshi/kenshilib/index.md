---
title: KenshiLib Overview
description: The role, development prerequisites, compatibility precautions, and licensing of KenshiLib native plugins.
publish: true
---

KenshiLib reconstructs Kenshi's C++ structures and exposes access to variables,
method calls, and hooks through a version-independent API. This is an interface
for supported builds, not a guarantee that every future game binary or arbitrary
plugin ABI is compatible.

The wiki introduces development of **KenshiLib/reKenshi plugins** and details
of the library's implementation. Its substantive tutorial is
[[rekenshi/kenshilib/hooks|Function Hooks]].
The [[rekenshi/overview|reKenshi Overview]] instead covers installing the loader
and enabling plugins as a player. Source documentation and development resources
are listed on [[credits#rekenshi-and-kenshilib-sources|Credits]].

## Start from a plugin example

The project README and supplied Steam guide recommend the **KenshiLib Examples**
repository. Its companion dependency repository supplies includes and
precompiled libraries. Developing a plugin does not, by itself, require
building the whole reKenshi or KenshiLib project.

The checked source documents these requirements:

- A Visual Studio environment with the **Visual C++ 2010 x64 compiler/toolchain**.
  Using a newer IDE is different from changing the compiler ABI.
- KenshiLib's `Include` directory and **Boost 1.60.0** includes.
- KenshiLib and OgreMain `.lib` inputs, with matching precompiled dependencies.
- **Release** mode; the source warns that Debug builds are broken.

Use the dependency versions documented for the release you target rather than
substituting current Boost/Ogre/compiler versions blindly.
The README's separate full-library build instructions mention Visual Studio
2019 or newer as the host IDE, potentially the VS2010 SP1 update, and the
**multihook** variant of MinHook. Those are not instructions to replace the
plugin hook API with another detouring library.

## Compatibility habits

Use **KenshiLib's own hook system** so multiple plugins can hook the same
function compatibly. Other detouring libraries can interfere with its chain.

Keep UI work on the appropriate UI thread. The source warns that most MyGUI
functions are not thread-safe; calling them from worker threads can produce
intermittent crashes.

When exporting functions for other plugins, the source suggests a **Preload
Plugin** so exports exist before dependants load. Its preload setup documentation
is unfinished, so no complete manifest or load-order recipe is invented here.

## Understand the licensing

KenshiLib's core code is **GPLv3** and includes third-party components with
additional terms. The README warns that KenshiLib plugins generally need to be
distributed under GPLv3 as well. Check the actual code and dependency licenses
before distributing a plugin; do not assume that a data-only FCS mod and a
native linked plugin have identical obligations.

## Next steps and limits

Read [[rekenshi/kenshilib/hooks|Function Hooks]] for forwarding stubs,
`GetRealAddress()`, hook chains, member-function calling conventions, and the
upstream warning about structure/class returns by value.

The source wiki is small; this is not a complete SDK reference or a validated
build tutorial. No native plugin was compiled or tested in Kenshi as part of
this documentation import.
