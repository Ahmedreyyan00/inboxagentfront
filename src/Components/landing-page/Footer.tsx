"use client"
import Link from 'next/link'
import { Container } from './Container'
import { NavLink } from './NavLink'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { isValidLanguageCode } from '@/Utils/languageUtils'
import { LandingTranslations } from '@/transalations/CommonTransaltion'

export function Footer() {
  const language = useSelector((state: RootState) => state.language.activeLanguage)
  const currentLanguage = isValidLanguageCode(language) ? language : 'en'
  const t = LandingTranslations[currentLanguage]
  return (
    <footer className="bg-slate-50">
      <Container>
        <div className="py-16">
          {/* Logo */}
          <div className="flex justify-center"> 
            {/* <img src="/logo.svg" alt="Logo" width={100} height={100} /> */}
          </div>
          
          {/* Main Navigation */}
          <nav className="mt-10 text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <NavLink href="#features">{t.footerFeatures}</NavLink>
              <NavLink href="#testimonials">{t.footerTestimonials}</NavLink>
              <NavLink href="#pricing">{t.footerPricing}</NavLink>
            </div>
          </nav>
        </div>
       
        {/* Bottom Section */}
        <div className="border-t border-slate-400/10 py-10">
          {/* Social Media Icons */}
          <div className="flex justify-center gap-x-6 mb-8">
            <Link href="#" className="group" aria-label="Smartle on X">
              <svg
                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700 transition-colors"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.728L12.5962 11.6137L17.7652 19.0075H15.6438L11.4257 12.9742V12.9738Z" />
              </svg>
            </Link>
            <Link href="#" className="group" aria-label="Smartle on GitHub">
              <svg
                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700 transition-colors"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
              </svg>
            </Link>
          </div>

          {/* Legal Links */}
          <nav className="flex flex-wrap justify-center gap-x-4 text-sm mb-6" aria-label="legal links">
            <Link href="/privacy" className="text-slate-500 hover:text-slate-900 transition-colors">
              {t.footerPrivacy}
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/terms" className="text-slate-500 hover:text-slate-900 transition-colors">
              {t.footerTerms}
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/gdpr" className="text-slate-500 hover:text-slate-900 transition-colors">
              {t.footerGDPR}
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-center text-sm text-slate-500">
            {typeof t.footerCopyright === 'function' ? t.footerCopyright(new Date().getFullYear()) : `Copyright © ${new Date().getFullYear()} Smartle. All rights reserved.`}
          </p>
        </div>
      </Container>
    </footer>
  )
}
