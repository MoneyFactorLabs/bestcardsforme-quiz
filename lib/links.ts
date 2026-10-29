// /go/ links are outbound affiliate redirects counted server-side. Next.js
// <Link> prefetching would serve the click from its cache without reaching
// the server, so these links opt out of prefetch.
export const isOutboundHref = (href: string) => href.startsWith("/go/");

export const linkPrefetch = (href: string) => (isOutboundHref(href) ? false : undefined);
