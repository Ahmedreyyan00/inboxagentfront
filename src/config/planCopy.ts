export type PlanCopy = {
  name?: string;
  price?: string;
  billing?: string;
  duration?: string;
  tagline?: string;
  features?: string[];
  cta?: string;
  label?: string;
};

export type LanguageCode = "en" | "fr" | "nl";

// Map of language -> planId -> copy overrides
export const PLAN_COPY: Record<LanguageCode, Record<string, PlanCopy>> = {
  fr: {
    // Free Trial
    "6891e67325307e6307b05415": {
      name: "Trial",
      price: "Free",
      duration: "30 jours",
      tagline: "Pour tester tranquillement avant de s’engager.",
      features: [
        "Jusqu’à 20 factures",
        "Envoi auto vers ton comptable",
        "Dashboard de suivi",
        "Données stockées en Europe",
        "1 boîte de messagerie",
      ],
      cta: "Lancer l'essai gratuit",
    },
    // Starter
    "6891e68d25307e6307b05419": {
      name: "Starter",
      price: "14,99€",
      billing: "/mois",
      tagline: "Pour automatiser l’essentiel, sans prise de tête",
      features: [
        "Jusqu’à 50 factures / mois",
        "Envoi auto vers ton comptable",
        "Dashboard de suivi",
        "Données stockées en Europe",
        "1 boîte de messagerie",
      ],
      cta: "Choisir ce plan",
    },
    // Professional
    "6891e69625307e6307b0541b": {
      name: "Professional",
      label: "BEST-SELLER",
      price: "24,99€",
      billing: "/mois",
      tagline: "Pour les pros qui veulent aller plus loin.",
      features: [
        "Jusqu’à 200 factures / mois",
        "Envoi auto vers ton comptable",
        "Dashboard de suivi",
        "Données stockées en Europe",
        "2 boîtes de messagerie",
      ],
      cta: "Choisir ce plan",
    },
    // Business
    "6891e69d25307e6307b0541d": {
      name: "Business",
      price: "49,99€",
      billing: "/mois",
      tagline:
        "Pensé pour les utilisateurs avancés et les structures en croissance.",
      features: [
        "Jusqu’à 500 factures / mois",
        "Détection multilingue",
        "Envoi auto vers ton comptable",
        "Dashboard de suivi",
        "Données stockées en Europe",
        "jusqu'à 5 boîtes de messagerie",
        "Support premium",
      ],
      cta: "Choisir ce plan",
    },
  },
  en: {
    // Free Trial
    "6891e67325307e6307b05415": {
      name: "Trial",
      price: "Free",
      duration: "30 days",
      tagline: "Test peacefully before committing.",
      features: [
        "Up to 20 invoices",
        "Automatic sending to your accountant",
        "Tracking dashboard",
        "Data stored in Europe",
        "1 mailbox",
      ],
      cta: "Start free trial",
    },
    // Starter
    "6891e68d25307e6307b05419": {
      name: "Starter",
      price: "€14.99",
      billing: "/month",
      tagline: "Automate the essentials, hassle-free.",
      features: [
        "Up to 50 invoices / month",
        "Automatic sending to your accountant",
        "Tracking dashboard",
        "Data stored in Europe",
        "1 mailbox",
      ],
      cta: "Choose this plan",
    },
    // Professional
    "6891e69625307e6307b0541b": {
      name: "Professional",
      label: "BEST-SELLER",
      price: "€24.99",
      billing: "/month",
      tagline: "For pros who want to go further.",
      features: [
        "Up to 200 invoices / month",
        "Automatic sending to your accountant",
        "Tracking dashboard",
        "Data stored in Europe",
        "2 mailboxes",
      ],
      cta: "Choose this plan",
    },
    // Business
    "6891e69d25307e6307b0541d": {
      name: "Business",
      price: "€49.99",
      billing: "/month",
      tagline: "Designed for advanced users and growing teams.",
      features: [
        "Up to 500 invoices / month",
        "Multilingual detection",
        "Automatic sending to your accountant",
        "Tracking dashboard",
        "Data stored in Europe",
        "Up to 5 mailboxes",
        "Premium support",
      ],
      cta: "Choose this plan",
    },
  },
  nl: {
    // Free Trial
    "6891e67325307e6307b05415": {
      name: "Proef",
      price: "Gratis",
      duration: "30 dagen",
      tagline: "Test rustig voordat je je committeert.",
      features: [
        "Tot 20 facturen",
        "Automatisch naar je accountant verzenden",
        "Dashboard voor overzicht",
        "Gegevens opgeslagen in Europa",
        "1 mailbox",
      ],
      cta: "Start gratis proef",
    },
    // Starter
    "6891e68d25307e6307b05419": {
      name: "Starter",
      price: "€14,99",
      billing: "/maand",
      tagline: "Automatiseer het essentiële, zonder gedoe.",
      features: [
        "Tot 50 facturen / maand",
        "Automatisch naar je accountant verzenden",
        "Dashboard voor overzicht",
        "Gegevens opgeslagen in Europa",
        "1 mailbox",
      ],
      cta: "Kies dit plan",
    },
    // Professional
    "6891e69625307e6307b0541b": {
      name: "Professional",
      label: "BEST-SELLER",
      price: "€24,99",
      billing: "/maand",
      tagline: "Voor professionals die verder willen gaan.",
      features: [
        "Tot 200 facturen / maand",
        "Automatisch naar je accountant verzenden",
        "Dashboard voor overzicht",
        "Gegevens opgeslagen in Europa",
        "2 mailboxen",
      ],
      cta: "Kies dit plan",
    },
    // Business
    "6891e69d25307e6307b0541d": {
      name: "Business",
      price: "€49,99",
      billing: "/maand",
      tagline: "Voor gevorderde gebruikers en groeiende teams.",
      features: [
        "Tot 500 facturen / maand",
        "Meertalige detectie",
        "Automatisch naar je accountant verzenden",
        "Dashboard voor overzicht",
        "Gegevens opgeslagen in Europa",
        "Tot 5 mailboxen",
        "Premium support",
      ],
      cta: "Kies dit plan",
    },
  },
};

export function getPlanCopy(
  planId: string,
  language: LanguageCode
): PlanCopy | undefined {
  return PLAN_COPY[language]?.[planId];
}


