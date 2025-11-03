export const NavbarTranslations = {
  en: {
    links: [
      { href: "#welcome", label: "Welcome" },
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Plans & Prices" },
      { href: "#contact", label: "Contact Us" },
      { href: "#faqs", label: "FAQs" },
    ],
    login: "Client Login",
    tryFree: "Try for Free",
  },
  fr: {
    links: [
      { href: "#welcome", label: "Accueil" },
      { href: "#features", label: "Fonctionnalités" },
      { href: "#pricing", label: "Formules & Tarifs" },
      { href: "#contact", label: "Contactez-nous" },
      { href: "#faqs", label: "FAQs" },
    ],
    login: "Espace Client",
    tryFree: "Essayer Gratuitement",
  },
};

export const HeroTranslations = {
    en: {
        badge: "Reliability. Simplicity. Performance.",
        title: "And if your bills are collected all alone, without getting up the little finger?",
        description: "Don't waste time sifting through your emails. Let Smartle find, sort, and send your invoices.",
        trial_note: "🎁 Free Trial – No card required. Just a breath. 30 days free.",
        cta: "Start free trial"

    },
    fr: {
        badge: "Fiabilité. Simplicité. Performance.",
        title: "Et si tes factures se collectaient toutes seules, sans lever le petit doigt?",
        description: "Ne perds plus de temps à fouiller tes mails. Laisse Smartle trouver, trier et transmettre tes factures. ",
        trial_note: "🎁 Essai gratuit – Pas besoin de carte. Juste besoin de souffler. 30 jours offerts.",
        cta: "Lancer l'essai gratuit"
    }
}

export const FeaturesTranslations = {
    en: {
        items: [
            {
                image: "/assets/feature1.avif",
                title: "Do you spend hours chasing your bills?",
                description: "We'll take care of it for you. The result: no more rushing to send everything the night before the deadline."
            },
            {
                image: "/assets/feature2.avif",
                title: "Your accountant will love receiving your invoices … on time!",
                description: "As soon as you receive an invoice, your accountant receives it. It's as simple as that."
            }
        ],
        cta: "Start the free trial"
    },
    fr: {
        items: [
            {
                image: "/assets/feature1.avif",
                title: "Tu passes des heures à courir après tes factures ?",
                description: "On s’en occupe à ta place. Résultat : plus besoin de tout envoyer à la hâte la veille de la deadline."
            },
            {
                image: "/assets/feature2.avif",
                title: "Ton comptable va adorer recevoir tes factures… à l’heure !",
                description: "Dès qu’on récupère une facture, ton comptable la reçoit. C’est aussi simple que ça."
            }
        ],
        cta: "Lancer l'essai gratuit"
    }
};

export const WhySmartleTranslations = {
    en: {
        title: "Why do freelancers love Smartle?",
        paragraph:
            "Managing your invoices shouldn't be a chore. Smartle automates the retrieval, sorting, and sending of your invoices to save you valuable time every month—all while ensuring smooth, time-saving delivery to your accountant.",
        cta: "Start the free trial",
        benefits: [
            "You no longer have to look for your bills, Smartle does it for you",
            "You breathe, even as tax deadlines approach",
            "Your accountant receives everything, automatically and on time",
            "An interface designed to get straight to the point",
            "Your data remains safe, here in Europe.",
        ],
    },
    fr: {
        title: "Pourquoi les indépendants adorent Smartle ?",
        paragraph:
            "Gérer ses factures ne devrait pas être une corvée. Smartle automatise la récupération, le tri et l’envoi de tes factures pour te faire gagner un temps précieux chaque mois — tout en assurant une transmission fluide et sans retard à ton comptable.",
        cta: "Lancer l'essai gratuit",
        benefits: [
            "Tu ne cherches plus tes factures, Smartle le fait pour toi",
            "Tu respires, même à l’approche des deadlines fiscales",
            "Ton comptable reçoit tout, automatiquement et à temps",
            "Une interface pensée pour aller droit au but",
            "Tes données restent en sécurité, ici, en Europe.",
        ],
    },
};

export const HowSmartleWorksTranslations = {
    en: {
        title: "How does Smartle work?",
        cta: "Start the free trial",
        features: [
            {
                title: "Secure connection",
                description:
                    "Simply connect your email account. Smartle securely connects to it to only find emails containing invoices.",
            },
            {
                title: "Smart invoice recovery",
                description:
                    "Smartle automatically scans your inbox for relevant attachments. Thanks to its intelligent engine, it recognizes invoices with remarkable accuracy.",
            },
            {
                title: "Automated analysis and sorting",
                description:
                    "Invoices are analyzed to extract key data: amount, supplier, date, etc. They appear in your dashboard, ready to be tracked.",
            },
            {
                title: "Send to your accountant or your platform",
                description:
                    "Documents are automatically sent to your accountant or to platforms such as Billtobox, Winbooks, Odoo, etc.",
            },
        ],
    },
    fr: {
        title: "Comment fonctionne Smartle ?",
        cta: "Commencer l'essai gratuit",
        features: [
            {
                title: "Connexion sécurisée",
                description:
                    "Connecte simplement ta boîte mail. Smartle s’y relie de manière sécurisée pour repérer uniquement les e-mails contenant des factures.",
            },
            {
                title: "Récupération intelligente des factures",
                description:
                    "Smartle scanne automatiquement ta boîte mail à la recherche des pièces jointes pertinentes. Grâce à son moteur intelligent, il reconnaît les factures avec une précision redoutable",
            },
            {
                title: "Analyse et tri automatisés",
                description:
                    "Les factures sont analysées pour en extraire les données clés : montant, fournisseur, date,... Elles apparaissent dans ton tableau de bord, prêtes à être suivies.",
            },
            {
                title: "Envoi vers ton comptable ou ta plateforme",
                description:
                    "Les documents sont transmis automatiquement à ton comptable ou à des plateformes comme Billtobox, Winbooks, Odoo,…",
            },
        ],
    },
};

export const PricingTranslations = {
    en: {
        title: "Rates & Subscriptions",
        description: "4 formulas designed for all needs.",
        bestseller: "BESTSELLER",
        plans: [
            {
                name: "Free Trial",
                price: "$0",
                period: "30 days",
                description: "Perfect to discover Smartle",
                features: [
                    "Automatic invoice collection",
                    "Forwarding to your accountant",
                    "Email support",
                    "Simple and intuitive interface",
                ],
                cta: "Start for Free",
                popular: false
            },
            {
                name: "Starter",
                price: "$14.99",
                period: "per month",
                description: "To automate the essentials, without the hassle",
                features: [
                    "Up to 50 invoices / month",
                    "Auto-send to your accountant",
                    "Monitoring Dashboard",
                    "Data stored in Europe",
                    "1 mailbox",
                ],
                cta: "Start for Free",
                popular: false
            },
            {
                name: "Professional",
                price: "$29",
                period: "per month",
                description: "For freelancers and small businesses",
                features: [
                    "Unlimited automatic collection",
                    "Instant forwarding",
                    "Priority support",
                    "Advanced integrations",
                    "Detailed reports",
                    "Secure backups",
                ],
                cta: "Choose Pro",
                popular: true
            },
            {
                name: "Business",
                price: "$49.99",
                period: "per month",
                description: "Designed for advanced users and growing organizations.",
                features: [
                    "Up to 500 invoices / month",
                    "Multilingual detection",
                    "Auto-send to your accountant",
                    "Monitoring Dashboard",
                    "Data stored in Europe",
                    "up to 5 mailboxes",
                    "Premium Support",
                ],
                cta: "Contact Us",
                popular: false
            },
        ],
    },
    fr: {
        title: "Tarifs & Abonnements",
        description: "4 formules conçues pour tous les besoins.",
        bestseller: "LE PLUS POPULAIRE",
        plans: [
            {
                name: "Essai Gratuit",
                price: "€0",
                period: "30 jours",
                description: "Parfait pour découvrir Smartle",
                features: [
                    "Collecte automatique des factures",
                    "Transfert à votre comptable",
                    "Support par email",
                    "Interface simple et intuitive",
                ],
                cta: "Commencer gratuitement",
                popular: false
            },
            {
                name: "Starter",
                price: "€14.99",
                period: "par mois",
                description: "Pour automatiser l’essentiel, sans contrainte",
                features: [
                    "Jusqu’à 50 factures / mois",
                    "Envoi automatique au comptable",
                    "Tableau de bord de suivi",
                    "Données stockées en Europe",
                    "1 boîte mail",
                ],
                cta: "Commencer gratuitement",
                popular: false
            },
            {
                name: "Professionnel",
                price: "€29",
                period: "par mois",
                description: "Pour freelances et petites entreprises",
                features: [
                    "Collecte illimitée",
                    "Transfert instantané",
                    "Support prioritaire",
                    "Intégrations avancées",
                    "Rapports détaillés",
                    "Sauvegardes sécurisées",
                ],
                cta: "Choisir Pro",
                popular: true
            },
            {
                name: "Business",
                price: "€49.99",
                period: "par mois",
                description: "Conçu pour les utilisateurs avancés et les organisations en croissance.",
                features: [
                    "Jusqu’à 500 factures / mois",
                    "Détection multilingue",
                    "Envoi automatique au comptable",
                    "Tableau de bord de suivi",
                    "Données stockées en Europe",
                    "Jusqu’à 5 boîtes mail",
                    "Support Premium",
                ],
                cta: "Nous contacter",
                popular: false
            },
        ],
    },
};

export const FAQTranslations = {
    en: {
        title: "Frequently asked questions",
        faqs: [
            {
                question: "What is Smartle?",
                answer: "Smartle is an application that automatically retrieves invoices received in your mailbox, sorts them, analyzes them (amount, supplier, etc.) and sends them to your accountant or to your accounting platform."
            },
            {
                question: "What types of email accounts are compatible?",
                answer: "Currently, Smartle supports Gmail, Outlook, and custom IMAP connections. More providers will be added soon."
            },
            {
                question: "How is my data protected?",
                answer: "At Smartle, the security of your data is our top priority. We use the highest security standards: Secure authentication via compliant OAuth protocols, Encryption of credentials and sensitive data, Secure storage on encrypted servers, No data is accessible without authorization. Everything is designed to guarantee the confidentiality, integrity, and reliability of your information."
            },
            {
                question: "Can I try Smartle for free?",
                answer: "Yes, you get a 30-day free trial, no credit card required. This allows you to test all the features before subscribing."
            },
            {
                question: "Can I cancel at any time?",
                answer: "Of course. You can cancel your subscription at any time from your personal space. No commitment is required."
            },
            {
                question: "Does Smartle work with my accounting software?",
                answer: "Currently, Smartle transfers invoices via email. It is compatible with any tool that accepts the receipt of accounting documents by email (e.g., Odoo, Billtobox, Exact, etc.)."
            },
            {
                question: "I'm an accountant. Can I use Smartle for my clients?",
                answer: "Yes! Smartle is also designed for accountants. You can automatically receive invoices from your clients and save valuable time collecting documents."
            },
        ],
    },
    fr: {
        title: "Questions fréquentes",
        faqs: [
            {
                question: "Qu’est-ce que Smartle ?",
                answer: "Smartle est une application qui récupère automatiquement les factures reçues dans votre boîte mail, les trie, les analyse (montant, fournisseur…) et les envoie à votre comptable ou vers votre plateforme comptable.",
            },
            {
                question: "Quels types de comptes mails sont compatibles ?",
                answer: "Actuellement, Smartle est compatible avec Gmail, Outlook, et les connexions IMAP personnalisées. D'autres fournisseurs seront ajoutés prochainement."
            },
            {
                question: "Comment mes données sont-elles protégées ?",
                answer: "Chez Smartle, la sécurité de vos données est notre priorité absolue. Nous utilisons les normes de sécurité les plus élevées : Authentification sécurisée via des protocoles OAuth conformes, Chiffrement des identifiants et données sensibles, Stockage sécurisé sur des serveurs cryptés, Aucune donnée n’est accessible sans autorisation. Tout est pensé pour garantir la confidentialité, l'intégrité et la fiabilité de vos informations."
            },
            {
                question: "Puis-je essayer Smartle gratuitement ?",
                answer:
                    "Oui, vous bénéficiez d’un essai gratuit de 30 jours, sans carte bancaire. Cela vous permet de tester toutes les fonctionnalités avant de vous abonner.",
            },
            {
                question: "Smartle fonctionne-t-il avec mon logiciel comptable ?",
                answer:
                    "Actuellement, Smartle transfère les factures par e-mail. Il est compatible avec tout outil acceptant la réception de pièces comptables par mail (ex : Odoo, Billtobox, Exact...)."
            },
            {
                question: "Je suis comptable. Puis-je utiliser Smartle pour mes clients ?",
                answer:
                    "Oui ! Smartle est également pensé pour les comptables. Vous pouvez recevoir les factures de vos clients automatiquement et gagner un temps précieux dans la collecte de documents.",
            },
        ],
    },
};

export const BannerTranslations = {
  en: {
    title: "🔔 Stay informed about the latest news from Smartle",
    description:
      "Receive our upcoming updates, new features and improvements to optimize your accounting management, with ease.",
    placeholder: "example@gmail.com",
    cta: "Stay informed",
  },
  fr: {
    title: "🔔 Restez informé des dernières nouvelles de Smartle",
    description:
      "Recevez nos futures mises à jour, nouvelles fonctionnalités et améliorations pour optimiser votre gestion comptable en toute simplicité.",
    placeholder: "exemple@gmail.com",
    cta: "Rester informé",
  },
};

export const FooterTranslations = {
  en: {
    sections: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Demo", href: "#" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "FAQs", href: "#faqs" },
          { label: "Contact", href: "#" },
          { label: "Documentation", href: "#" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "#" },
          { label: "Blog", href: "#" },
          { label: "Careers", href: "#" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", href: "#" },
          { label: "Terms", href: "#" },
          { label: "GDPR", href: "#" },
        ],
      },
    ],
    copyright: `© ${new Date().getFullYear()} Smartle. All rights reserved.`,
  },
  fr: {
    sections: [
      {
        title: "Produit",
        links: [
          { label: "Fonctionnalités", href: "#features" },
          { label: "Tarifs", href: "#pricing" },
          { label: "Démo", href: "#" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "FAQs", href: "#faqs" },
          { label: "Contact", href: "#" },
          { label: "Documentation", href: "#" },
        ],
      },
      {
        title: "Entreprise",
        links: [
          { label: "À propos", href: "#" },
          { label: "Blog", href: "#" },
          { label: "Carrières", href: "#" },
        ],
      },
      {
        title: "Légal",
        links: [
          { label: "Confidentialité", href: "#" },
          { label: "Conditions", href: "#" },
          { label: "RGPD", href: "#" },
        ],
      },
    ],
    copyright: `© ${new Date().getFullYear()} Smartle. Tous droits réservés.`,
  },
};
