import { HeaderBar, type Account } from "@/components/site/header-bar";
import { nav } from "@/components/site/nav";

export type { Account };

/** The site's header. A server component, so the menus' counts are summed
 *  from the path and instructor records here, and the bar in the browser
 *  receives the words and figures rather than the records. */
export function SiteHeader({ account }: { account?: Account } = {}) {
  return <HeaderBar account={account} nav={nav} />;
}
