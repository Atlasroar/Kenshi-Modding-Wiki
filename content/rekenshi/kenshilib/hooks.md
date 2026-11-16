---
title: Function Hooks
description: Resolve Kenshi function addresses and preserve compatible hook chains through KenshiLib.
publish: true
---

Function hooking, or detouring, intercepts calls to a compiled function so a
plugin can wrap or replace its behavior. KenshiLib exposes its API through
`core/Functions.h`. This page rewrites the upstream hook tutorial, checked against
that header; sources are on [[credits#rekenshi-and-kenshilib-sources|Credits]].

> [!warning] Native-code work
> Exact signatures, addresses, compiler settings, and calling conventions
> matter. These are API concepts, not a drop-in hook for every method, and no
> native plugin has been built or tested for this guide.

## Use the shared hook system

Use `KenshiLib::AddHook` rather than mixing a third-party detouring library
into the same functions. KenshiLib is designed to let multiple plugins hook
one function; an incompatible hook mechanism can break the chain.

The header also declares `QueueHook` and `ApplyQueuedHooks`. Queued hooks are
per module/DLL; `AddHook` installs immediately and is documented as higher
overhead. Check the returned `HookStatus` and handle failure in your plugin
rather than assuming a hook was installed.

## Resolve the real Kenshi address

A KenshiLib export for an internal game method can be a **forwarding stub in
`KenshiLib.dll`**, not the implementation in `Kenshi_x64.exe`. Hooking the stub
does not intercept every call to the actual game function.

For an internal Kenshi function, resolve the exported definition with
`KenshiLib::GetRealAddress()` before passing the target to `AddHook`.
The wiki's example uses `Character::getName`.

Do **not** apply `GetRealAddress()` indiscriminately to other modules. Ogre
methods live in `OgreMain_x64.dll`, for example. The wiki's rule of thumb is
that definitions in the `kenshi` include folder usually need resolution and
most other definitions do not.

The source warns that `GetRealAddress()` can fail when **whole program
optimization is disabled**, a common Debug-build difference. The README also
warns against Debug builds; see [[rekenshi/kenshilib/index|the Overview]].

## Constructors, destructors, and virtual methods

C++ does not let the ordinary address-of expression cover every method type
in the way a hook target needs. KenshiLib supplies hookable alternate definitions:

| Method type    | Hookable definition                |
| -------------- | ---------------------------------- |
| Constructor    | `_CONSTRUCTOR`                     |
| Destructor     | `_DESTRUCTOR`                      |
| Virtual method | `_NV_` followed by the method name |

Use the library's alternate definition rather than attempting to resolve an
ordinary virtual member pointer. The header explicitly warns that its
convenience `GetRealAddress`/`GetRealFunction` wrappers do not work with virtual
functions.

## Preserve the continuation chain

The function pointer returned for continuing a hook is not necessarily the
unmodified game function. If A is installed first and B second on the same
target, the source illustrates this chain:

```text
game call -> B's hook -> A's hook -> original implementation
```

Each hook can inspect/adjust arguments before continuing and inspect/adjust
the result afterward. Not calling the continuation can deliberately suppress
the downstream hooks as well as the original call. Calling it more than once
can repeat downstream work; that is not harmless by default.

Keep the continuation assigned to **your** hook. A call to B's continuation
enters A and the original; A's continuation enters the original. Neither means
"restart the entire chain." The upstream paragraph repeats a plugin label in
its final sentence; this explanation follows the stated chain instead of
repeating that typo.

## Match calling conventions and object context

Your detour and continuation must match the target's ABI and signature.
For a non-static member function, the source's pattern includes the object
pointer as the first explicit argument and passes it onward:

```cpp
void (*continueUpdate)(Actor* self, void* context);

void updateHook(Actor* self, void* context)
{
    continueUpdate(self, context);
}
```

`Actor` here is a **placeholder type**, not a claim that Kenshi exports this
particular class/method. Registration and error handling are intentionally
omitted: resolve a real supported target and match its full signature first.
Static functions do not need an added object pointer merely because they are
declared inside a class.

> [!warning] Returns by value are not fully documented
> The wiki leaves the hidden return-address argument ordering for
> structure/class returns as **TODO**. Do not copy the simple pointer/void
> pattern above onto those methods or invent an ABI recipe from that unfinished
> note.

A virtual implementation hook also affects derived classes that inherit that
implementation, but not a derived override that uses a different implementation.
KenshiLib's wiki says **VMT symbols are not currently exported**; it does not
provide a complete VMT-hooking procedure.

Return to the [[rekenshi/kenshilib/index|KenshiLib Overview]] or
[[rekenshi/index|reKenshi & KenshiLib]].
