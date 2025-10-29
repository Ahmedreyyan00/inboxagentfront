'use client'

import Link from 'next/link'
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react'
import clsx from 'clsx'
import { Container } from './Container'
import { NavLink } from './NavLink'
import { Button } from './Button'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { isValidLanguageCode } from '@/Utils/languageUtils'
import { LandingTranslations } from '@/transalations/CommonTransaltion'
import LanguageSwitcher from '@/Components/Common/LanguageSwitcher'


function MobileNavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <PopoverButton as={Link} href={href} className="block w-full p-2">
      {children}
    </PopoverButton>
  )
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0',
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0',
        )}
      />
    </svg>
  )
}

function MobileNavigation() {
  const language = useSelector((state: RootState) => state.language.activeLanguage)
  const currentLanguage = isValidLanguageCode(language) ? language : 'en'
  const t = LandingTranslations[currentLanguage]
  return (
    <Popover>
      <PopoverButton
        className="relative z-10 flex h-8 w-8 items-center justify-center focus:not-data-focus:outline-hidden"
        aria-label={t.navToggle}
      >
        {({ open }:any) => <MobileNavIcon open={open} />}
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 bg-slate-300/50 duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
      >
        <div className="flex justify-end mb-2"><LanguageSwitcher showLabel /></div>
        <MobileNavLink href="/">{t.navHome}</MobileNavLink>
        <MobileNavLink href="#features">{t.navFeatures}</MobileNavLink>
        <MobileNavLink href="#pricing">{t.navPricingPlans}</MobileNavLink>
        <MobileNavLink href="/contact">{t.navContactUs}</MobileNavLink>
        <MobileNavLink href="#faq">{t.navFaqs}</MobileNavLink>
        <hr className="m-2 border-slate-300/40" />
        <MobileNavLink href="/login">{t.navSignIn}</MobileNavLink>
      </PopoverPanel>
    </Popover>
  )
}

export function Header() {
  const language = useSelector((state: RootState) => state.language.activeLanguage)
  const currentLanguage = isValidLanguageCode(language) ? language : 'en'
  const t = LandingTranslations[currentLanguage]
  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label={t.homeAria} className='flex justify-center'>
            {/* <img src="/logo.svg" alt={t.logoAlt} width={100} height={100} /> */}
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <NavLink href="/">{t.navHome}</NavLink>
              <NavLink href="#features">{t.navFeatures}</NavLink>
              <NavLink href="#pricing">{t.navPricingPlans}</NavLink>
              <NavLink href="/contact">{t.navContactUs}</NavLink>
              <NavLink href="#faq">{t.navFaqs}</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <LanguageSwitcher className="hidden md:block" />
            <div className="hidden md:block">
              <NavLink href="/login">{t.navSignIn}</NavLink>
            </div>
            <Button href="/signup" color="blue">
              <span>
                {t.navGetStarted} <span className="hidden lg:inline">{t.navToday}</span>
              </span>
            </Button>
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  )
}
