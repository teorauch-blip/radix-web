import { getNavbarConfig } from '@/lib/data/web-config'
import { HeaderClient } from './header-client'

export async function Header() {
  const navbar = await getNavbarConfig()
  return (
    <HeaderClient
      navLinks={navbar.navLinks}
      ctaLabel={navbar.ctaLabel}
      ctaHref={navbar.ctaHref}
    />
  )
}
