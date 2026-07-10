export function scrollElementWithinContainer(
  element: HTMLElement,
  container: HTMLElement,
  behavior: ScrollBehavior = 'smooth',
): void {
  const nextScrollTop =
    container.scrollTop +
    (element.getBoundingClientRect().top - container.getBoundingClientRect().top)

  container.scrollTo({ top: nextScrollTop, behavior })
}
