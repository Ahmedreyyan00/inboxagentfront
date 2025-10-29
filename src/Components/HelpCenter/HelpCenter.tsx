"use client";

import {
  FaChevronDown,
  FaPlay,
  FaCircleCheck,
  FaServer,
  FaEnvelope,
} from "react-icons/fa6";
import { FaRegCommentDots } from "react-icons/fa";
import { useState, useEffect } from "react";
import { faqsMapper, tutorialVideosMapper } from "@/Mapper/HelpCenterMapper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { HelpCenterTranslations } from "@/transalations/CommonTransaltion";
import ContactForm from "./ContactForm";

const HelpCenter = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Handle hash scrolling when component mounts
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#contact-form') {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        const element = document.getElementById('contact-form');
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, []);

  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const t = HelpCenterTranslations[language as "en" | "fr" | "nl"];
  const faqsTranslationMapper = faqsMapper.map(
    (faq) => faq[language as "en" | "fr" | "nl"]
  );

  return (
    <main id="main-content" className="flex-1 p-8 w-full">
      {/* Header */}
      <div id="page-header" className="mb-8">
        <h1 className="text-2xl mb-2" style={{ color: 'var(--card-accent)' }}>{t.HelpCenter}</h1>
        <p className="text-neutral-600 text-base">{t.helpCenterSubheading}</p>
      </div>

      {/* FAQs */}
      <section className="rounded-lg border-2 p-6 mb-8 shadow-sm" style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl" style={{ color: 'var(--card-accent)' }}>FAQs</h2>
          <div className="w-56">
            <input
              type="text"
              className="w-full p-2 border-2 rounded-lg text-sm"
              style={{ borderColor: 'var(--card-border-light)' }}
              placeholder={`${t.Search} FAQs ...`}
            />
          </div>
        </div>
        <p className="text-neutral-600 mb-4">{t.findQuickAnswers}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            `${t.invoicesAndForwarding}`,
            `${t.emailIntegration}`,
            `${t.accountAndBilling}`,
            `${t.automationSettings}`,
          ].map((label) => (
            <span
              key={label}
              className="px-3 py-1 rounded-full text-sm cursor-pointer transition-colors hover:shadow-sm"
              style={{ 
                backgroundColor: 'var(--card-bg-medium)',
                color: 'var(--card-accent)'
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="divide-y divide-neutral-100">
          {faqsTranslationMapper.map((faq, index) => (
            <div className="py-4" key={index}>
              <button
                onClick={() => toggleFaq(index)}
                className="flex items-center w-full justify-between text-left text-sm focus:outline-none"
                style={{ color: 'var(--card-accent)' }}
              >
                <span>{faq.question}</span>
                <FaChevronDown
                  className={`ml-2 transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  style={{ color: 'var(--card-accent)' }}
                />
              </button>
              {openIndex === index && (
                <div className="mt-3 text-neutral-600 text-sm">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Video Guides */}
      <section className="rounded-lg border-2 p-6 mb-8 shadow-sm" style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}>
        <h2 className="text-xl mb-3" style={{ color: 'var(--card-accent)' }}>{t.videoGuidesTitle}</h2>
        <p className="text-neutral-600 mb-4">{t.mostOfSmartle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tutorialVideosMapper.map((video, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden border-2 flex flex-col transition-colors hover:shadow-sm"
              style={{ borderColor: 'var(--card-border-light)', backgroundColor: 'var(--card-bg-medium)' }}
            >
              <div className="w-full h-36 flex items-center justify-center" style={{ backgroundColor: 'var(--card-accent)' }}>
                <span className="text-white text-base">{video.label}</span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-1" style={{ color: 'var(--card-accent)' }}>{video.title}</div>
                <div className="text-sm flex-1 mb-2" style={{ color: 'var(--card-accent)', opacity: 0.7 }}>
                  {video.description}
                </div>
                <button className="w-fit mt-auto px-3 py-1.5 rounded-lg border-2 flex items-center gap-2 text-sm transition-colors hover:shadow-sm"
                  style={{ 
                    borderColor: 'var(--card-accent)',
                    color: 'var(--card-accent)',
                    backgroundColor: 'white'
                  }}
                >
                  <FaPlay />
                  Watch
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

  

      {/* Contact Form Section */}
      <section id="contact-form" className="mb-8">
        <ContactForm />
      </section>
    </main>
  );
};

export default HelpCenter;
