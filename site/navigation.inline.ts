document.addEventListener("nav", () => {
  const menu = document.querySelector<HTMLDetailsElement>(".guide-menu")
  if (!menu) return

  const mobile = window.matchMedia("(max-width: 800px)")
  const update = () => {
    menu.open = !mobile.matches
  }
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && mobile.matches && menu.open) {
      menu.open = false
      menu.querySelector("summary")?.focus()
    }
  }
  update()
  mobile.addEventListener("change", update)
  menu.addEventListener("keydown", onKeydown)
  window.addCleanup(() => {
    mobile.removeEventListener("change", update)
    menu.removeEventListener("keydown", onKeydown)
  })
})

// Quartz bundles this module as browser-script text.
export default ""
