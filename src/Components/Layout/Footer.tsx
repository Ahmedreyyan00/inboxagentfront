"use client";

import Section from "../Landing/Common/Section";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { FooterTranslations } from "@/transalations/LandingPageTranslations";

const Footer = () => {
    const language = useSelector(
        (state: RootState) => state.language.activeLanguage
    );
    const currentLanguage = isValidLanguageCode(language) ? language : "en";
    const t = FooterTranslations[currentLanguage as "en" | "fr"];

    return (
        <div className="bg-blue-950">
            <div className="h-80 md:h-40 lg:h-50"></div>
            <Section className="pt-20 max-w-7xl mx-auto">
                <div className="flex flex-col gap-4 p-10 md:flex-row md:gap-8 bg-white rounded-xl">
                    <div className="flex-1">
                        <Link href="/">
                            <Image
                                src="/assets/smartle-logo.avif"
                                alt="logo"
                                width={100}
                                height={100}
                                className="w-50"
                            />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {t.sections.map((section) => (
                            <div key={section.title} className="space-y-3">
                                <h4 className="font-semibold">{section.title}</h4>
                                <ul className="space-y-2 text-sm font-medium">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="container flex flex-col gap-4 py-6 md:flex-row md:justify-between">
                    <p className="text-sm text-white/50">{t.copyright}</p>
                </div>
            </Section>
        </div>
    );
};

export default Footer;
