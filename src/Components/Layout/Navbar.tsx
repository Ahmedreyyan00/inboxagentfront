"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "../Common/LanguageSwitcher";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { NavbarTranslations } from "@/transalations/LandingPageTranslations";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = NavbarTranslations[currentLanguage as "en" | "fr"];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b-2 border-slate-700">
      <div className="max-w-6xl mx-auto container flex h-20 items-center justify-between">
        <Link href="/">
          <Image
            src="/assets/smartle-logo.avif"
            alt="logo"
            width={100}
            height={100}
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-6 font-medium">
          {t.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:bg-slate-800 rounded-lg px-3 py-2 text-slate-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          <Button
            className="p-6 border-2 border-slate-600 text-slate-200 hover:bg-slate-800 transition-colors hover:shadow-sm"
            asChild
          >
            <Link href="/login">{t.login}</Link>
          </Button>
          <Button
            className="p-6 bg-blue-600 hover:bg-blue-700 text-white transition-colors hover:shadow-sm"
            asChild
          >
            <Link href="/login">{t.tryFree}</Link>
          </Button>
          <LanguageSwitcher />
        </div>

        <button
          className="md:hidden p-2 transition-colors hover:bg-slate-800 rounded-lg text-slate-200 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t-2 border-slate-700 bg-slate-800">
          <nav className="flex flex-col p-4 space-y-4 font-medium">
            {t.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:bg-slate-700 rounded-lg px-3 py-2 text-slate-200 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              className="p-6 border-2 border-slate-600 text-slate-200 hover:bg-slate-700 transition-colors hover:shadow-sm"
              asChild
            >
              <Link href="/login">{t.login}</Link>
            </Button>
            <Button
              className="p-6 bg-blue-600 hover:bg-blue-700 text-white transition-colors hover:shadow-sm"
              asChild
            >
              <Link href="/signup">{t.tryFree}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
