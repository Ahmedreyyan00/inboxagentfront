"use client"
import Image from 'next/image'
import backgroundImage from '../../../public/background-call-to-action.jpg'
import { Container } from './Container'
import { Button } from './Button'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { isValidLanguageCode } from '@/Utils/languageUtils'
import { LandingTranslations } from '@/transalations/CommonTransaltion'

export function CallToAction() {
  const language = useSelector((state: RootState) => state.language.activeLanguage)
  const currentLanguage = isValidLanguageCode(language) ? language : 'en'
  const t = LandingTranslations[currentLanguage]
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <Image
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          {/* <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">{t.ctaHeading}</h2> */}
          <p className="mt-4 text-lg tracking-tight text-white">
            {t.ctaSubtitle?.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < t.ctaSubtitle.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
          <Button href="/register" color="white" className="mt-10">
            {t.ctaButton}
          </Button>
        </div>
      </Container>
    </section>
  )
}
