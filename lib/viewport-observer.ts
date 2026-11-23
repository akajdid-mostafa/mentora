// An IntersectionObserver whose root is this document's own viewport, named
// outright. Every "is it on screen" question in the site goes through here.
//
// Left implicit, the root is the *top-level* page's viewport, and that breaks
// the moment the site is framed by another origin — a marketplace preview, a
// portfolio embed. The spec then ignores `rootMargin`, and the browser has to
// fetch the frame's position from the parent page, so callbacks arrive late and
// in batches: revealed sections stay blank as they scroll in, then a whole run
// of them appears at once. A Document root keeps every measurement inside this
// page. Browsers from before Document roots were allowed throw on it, and get
// the implicit root instead.
export function viewportObserver(
  callback: IntersectionObserverCallback,
  options: Omit<IntersectionObserverInit, "root"> = {},
) {
  try {
    return new IntersectionObserver(callback, { ...options, root: document });
  } catch {
    return new IntersectionObserver(callback, options);
  }
}
