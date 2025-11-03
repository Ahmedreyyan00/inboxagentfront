'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Lottie from 'lottie-react'
import animAutomated from '@/Utils/Automated Analysis and Sorting.json'
import animInvoiceRecovery from '@/Utils/Inteligent invoice recovery.json'
import animSecure from '@/Utils/Secure connection.json'
import animSendToPlatforms from '@/Utils/Send to your Accountant or Your Platforms.json'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'
import backgroundImage from '../../../public/background-features.jpg'
import screenshotExpenses from '../../../public/screenshots/expenses.png'
import screenshotPayroll from '../../../public/screenshots/payroll.png'
import screenshotReporting from '../../../public/screenshots/reporting.png'
import screenshotVatReturns from '../../../public/screenshots/vat-returns.png'
import { Container } from './Container'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { isValidLanguageCode } from '@/Utils/languageUtils'
import { LandingTranslations } from '@/transalations/CommonTransaltion'

const features = [
  {
    title: 'Automated Analysis & Sorting',
    description:
      'AI analyzes incoming documents and auto-categorizes them for faster workflows.',
    image: animSecure ,
  },
  {
    title: 'Intelligent Invoice Recovery',
    description:
      'Recover missing invoices automatically with smart detection and reminders.',
    image: animInvoiceRecovery,
  },
  {
    title: 'Secure Connection',
    description:
      'Bank‑level security keeps your data encrypted in transit and at rest.',
    image: animAutomated,
  },
  {
    title: 'Send to Your Platforms',
    description:
      'Push records to your accountant or connected platforms in one click.',
    image: animSendToPlatforms,
  },
]

export function PrimaryFeatures() {
  const language = useSelector((state: RootState) => state.language.activeLanguage)
  const currentLanguage = isValidLanguageCode(language) ? language : 'en'
  const t = LandingTranslations[currentLanguage]
  const localizedFeatures = (t.primaryTabs || []).map((tab, idx) => ({
    title: tab.title,
    description: tab.description,
    image: features[idx]?.image || features[0].image,
  }))
  let [tabOrientation, setTabOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal',
  )

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      id="features"
      aria-label={t.primaryAria}
      className="relative overflow-hidden bg-blue-600 pt-20 pb-28 sm:py-32"
    >
      <Image
        className="absolute top-1/2 left-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
        unoptimized
      />
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            {t.primaryHeading}
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
            {t.primarySubheading}
          </p>
        </div>
        <TabGroup
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <TabList className="relative z-10 flex gap-x-4 px-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {(localizedFeatures.length ? localizedFeatures : features).map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6',
                        selectedIndex === featureIndex
                          ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10 lg:ring-inset'
                          : 'hover:bg-white/10 lg:hover:bg-white/5',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-lg data-selected:not-data-focus:outline-hidden',
                            selectedIndex === featureIndex
                              ? 'text-blue-600 lg:text-white'
                              : 'text-blue-100 hover:text-white lg:text-white',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === featureIndex
                            ? 'text-white'
                            : 'text-blue-100 group-hover:text-white',
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>
              <TabPanels className="lg:col-span-7">
                {(localizedFeatures.length ? localizedFeatures : features).map((feature) => (
                  <TabPanel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 -top-26 -bottom-17 bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
      <div
  className="
    mt-10
    w-[90%] max-w-[350px]
    sm:max-w-[500px]
    md:max-w-[700px]
    lg:mt-0 lg:w-full lg:max-w-none lg:mx-0
    overflow-hidden
    rounded-xl
    bg-slate-50
    shadow-xl shadow-blue-900/20
    mx-auto flex justify-center items-center
  "
>
  <Lottie
    animationData={feature.image as unknown as object}
    loop
    autoplay
    rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
    className="
      w-[80%] h-auto max-h-[45em]
      lg:w-[80%]
    "
  />
</div>

                  

                  </TabPanel>
                ))}
              </TabPanels>
            </>
          )}
        </TabGroup>
      </Container>
    </section>
  )
}
