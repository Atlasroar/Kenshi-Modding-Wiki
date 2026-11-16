document.addEventListener("nav", () => {
  const menu = document.querySelector<HTMLDetailsElement>(".guide-menu")
  const toggle = menu?.querySelector<HTMLElement>(".guide-menu-toggle")
  if (!menu || !toggle) return

  const mobile = window.matchMedia("(max-width: 800px)")
  const updateLayout = () => {
    menu.open = !mobile.matches
  }
  const closeMenu = () => {
    menu.open = false
    toggle.focus()
  }
  const onKeydown = (event: KeyboardEvent) => {
    if (mobile.matches && menu.open && event.key === "Escape") {
      event.preventDefault()
      closeMenu()
    }
  }
  const onClick = (event: MouseEvent) => {
    if (!mobile.matches || !menu.open || !(event.target instanceof Element)) return
    if (event.target.closest("a") || !menu.contains(event.target)) menu.open = false
  }

  updateLayout()
  mobile.addEventListener("change", updateLayout)
  menu.addEventListener("keydown", onKeydown)
  document.addEventListener("click", onClick)
  window.addCleanup(() => {
    mobile.removeEventListener("change", updateLayout)
    menu.removeEventListener("keydown", onKeydown)
    document.removeEventListener("click", onClick)
  })
})

// Quartz bundles this module as browser-script text.
export default ""
