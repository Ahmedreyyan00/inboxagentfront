"use client";

import { useState } from "react";
import {
  FaSpinner,
  FaEnvelope,
  FaUser,
  FaMessage,
  FaPhone,
  FaBuilding,
} from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { HelpCenterTranslations } from "@/transalations/CommonTransaltion";
import toast from "react-hot-toast";
import Api from "@/lib/Api";

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = HelpCenterTranslations[currentLanguage];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.contactFormNameRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.contactFormEmailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.contactFormEmailInvalid;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t.contactFormSubjectRequired;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.contactFormMessageRequired;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t.contactFormMessageMinLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      inquiryType: formData.inquiryType,
    };

    try {
      await Api.sendContactForm(payload);

      toast.success(t.contactFormSuccessMessage);

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "general",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast.error(t.contactFormErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border-2 shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}>
      {/* Header */}
      <div className="p-6 border-b-2" style={{ borderColor: 'var(--card-border-light)', backgroundColor: 'var(--card-bg-medium)' }}>
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-accent)' }}>
          {t.contactFormTitle}
        </h3>
        <p className="text-neutral-600">{t.contactFormSubtitle}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-accent)' }}>
              <FaUser className="inline mr-2" style={{ color: 'var(--card-accent)' }} />
              {t.contactFormName} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-3 border-2 rounded-lg transition-colors ${
                errors.name ? "border-red-500" : ""
              }`}
              style={{ borderColor: errors.name ? '#ef4444' : 'var(--card-border-light)' }}
              placeholder={t.contactFormNamePlaceholder}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-accent)' }}>
              <FaEnvelope className="inline mr-2" style={{ color: 'var(--card-accent)' }} />
              {t.contactFormEmail} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 border-2 rounded-lg transition-colors ${
                errors.email ? "border-red-500" : ""
              }`}
              style={{ borderColor: errors.email ? '#ef4444' : 'var(--card-border-light)' }}
              placeholder={t.contactFormEmailPlaceholder}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-accent)' }}>
              <FaBuilding className="inline mr-2" style={{ color: 'var(--card-accent)' }} />
              {t.contactFormCompany}
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full p-3 border-2 rounded-lg transition-colors"
              style={{ borderColor: 'var(--card-border-light)' }}
              placeholder={t.contactFormCompanyPlaceholder}
              disabled={isSubmitting}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-accent)' }}>
              <FaPhone className="inline mr-2" style={{ color: 'var(--card-accent)' }} />
              {t.contactFormPhone}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 border-2 rounded-lg transition-colors"
              style={{ borderColor: 'var(--card-border-light)' }}
              placeholder={t.contactFormPhonePlaceholder}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Inquiry Type */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-accent)' }}>
            {t.contactFormInquiryType} *
          </label>
          <select
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleInputChange}
            className="w-full p-3 border-2 rounded-lg transition-colors"
            style={{ borderColor: 'var(--card-border-light)' }}
            disabled={isSubmitting}
          >
            <option value="general">{t.contactFormInquiryGeneral}</option>
            <option value="sales">{t.contactFormInquirySales}</option>
            <option value="support">{t.contactFormInquirySupport}</option>
            <option value="billing">{t.contactFormInquiryBilling}</option>
            <option value="partnership">
              {t.contactFormInquiryPartnership}
            </option>
          </select>
        </div>

        {/* Subject */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-accent)' }}>
            {t.contactFormSubject} *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`w-full p-3 border-2 rounded-lg transition-colors ${
              errors.subject ? "border-red-500" : ""
            }`}
            style={{ borderColor: errors.subject ? '#ef4444' : 'var(--card-border-light)' }}
            placeholder={t.contactFormSubjectPlaceholder}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-accent)' }}>
            <FaMessage className="inline mr-2" style={{ color: 'var(--card-accent)' }} />
            {t.contactFormMessage} *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            className={`w-full p-3 border-2 rounded-lg transition-colors resize-none ${
              errors.message ? "border-red-500" : ""
            }`}
            style={{ borderColor: errors.message ? '#ef4444' : 'var(--card-border-light)' }}
            placeholder={t.contactFormMessagePlaceholder}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
          <p className="mt-1 text-sm text-neutral-500">
            {t.contactFormMessageHelp}
          </p>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 hover:shadow-sm"
            style={{ 
              backgroundColor: 'var(--card-accent)',
              borderColor: 'var(--card-accent)',
              color: 'white'
            }}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                {t.contactFormSubmitting}
              </>
            ) : (
              <>
                <FaEnvelope />
                {t.contactFormSubmit}
              </>
            )}
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--card-bg-medium)' }}>
          <p className="text-sm mb-2" style={{ color: 'var(--card-accent)' }}>
            {t.contactFormDirectContact}
          </p>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--card-accent)' }}>
            <FaEnvelope style={{ color: 'var(--card-accent)' }} />
            <a
              href="mailto:contact@smartle.be"
              className="transition-colors"
              style={{ color: 'var(--card-accent)' }}
            >
              contact@smartle.be
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
