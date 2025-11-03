"use client"
import Image from "next/image";
import Link from "next/link";

import backgroundImage from "../../../public/background-faqs.jpg";
import { Container } from "./Container";
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { isValidLanguageCode } from '@/Utils/languageUtils'
import { LandingTranslations } from '@/transalations/CommonTransaltion'

interface FAQ {
  question: string
  answer: string
}


export function Faqs() {
  const language = useSelector((state: RootState) => state.language.activeLanguage)
  const currentLanguage = isValidLanguageCode(language) ? language : 'en'
  const t = LandingTranslations[currentLanguage]
  const faqs = t.faqs || []
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            {t.faqsHeading}
          </h2>
         
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column: readonly FAQ[], columnIndex: number) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq: FAQ, faqIndex: number) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg/7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-16 max-w-2xl text-center">
        <p className="mt-4 text-lg tracking-tight text-slate-700">
            {t.faqsSubtitle}
          </p>
          <p className="text-lg text-slate-700">
            <Link 
              href="/contact" 
              className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
                {t.faqsContactText}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
