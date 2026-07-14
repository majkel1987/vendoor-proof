---
title: "VendoorProof Privacy Policy"
locale: "en"
version: "1.0"
effective_date: "2026-07-13"
status: "published"
---

# Privacy Policy

**Version:** 1.0\
**Effective date:** 13 July 2026

## 1. Key information

This Policy explains how personal data is processed when you:

- visit the VendoorProof website;
- contact us or submit an early-access or pilot application;
- communicate with us about a possible pilot or business relationship.

The public website currently presents a product that is in development. It does not currently provide user accounts, sign-in, document uploads, billing, or automated vendor follow-ups. This Policy will be updated before any such functions are made available.

Using the website is not consent to every form of processing. Where consent is required, it is requested separately and may be withdrawn.

## 2. Controller and contact details

The controller is:

**{{controllerLegalName}}**\
General and privacy contact email: **[{{privacyEmail}}](mailto:{{privacyEmail}})**

In this Policy, the controller is referred to as "VendoorProof", "we", "us" or the "Controller".

## 3. Our role

We act as controller for data relating to website visitors, people who contact us, pilot applicants, prospective customers and representatives of organisations interested in VendoorProof.

The current public website does not accept customer vendor documents and does not operate as a processor for customer document workflows. If that service is launched, its processing terms and this Policy will be updated before customer data is accepted.

## 4. Personal data we process

Depending on how you use the website, we process:

- contact and professional details, including name, business email address, company, role and company type;
- information supplied in the pilot form, including vendor volume, current process, follow-up volume and the problem described by the applicant;
- consent status and the content of correspondence;
- campaign and referral details, including source, referrer and UTM parameters when present;
- technical information needed to deliver and protect the website, such as request time, IP address, browser or device information and diagnostic logs;
- page paths, referrers, approximate location, browser, operating system, device type and custom interaction events collected in aggregated form by Vercel Web Analytics;
- Core Web Vitals and related browser performance measurements collected by Vercel Speed Insights.

For abuse prevention, the form creates one-way hashes of the email address and IP address and holds rate-limit counters in the running server process for one hour. The website code does not persist those counters in a database.

## 5. Sources of data

Data comes directly from you, from your browser or device, from the organisation you represent, and from the technical providers used to deliver and measure the website.

## 6. Purposes and legal bases

| Purpose                                                  | Examples of data                                                               | Legal basis                                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Responding to an enquiry and arranging a pilot           | contact details, company details, form answers and correspondence              | Article 6(1)(b) GDPR where steps are taken at your request before a contract, otherwise Article 6(1)(f) GDPR |
| Contacting an applicant about early access               | email address, application details and consent record                          | Article 6(1)(a) GDPR where consent is requested                                                              |
| Operating, securing and diagnosing the website           | request data, IP address, hashes, logs and device information                  | Article 6(1)(f) GDPR, our legitimate interest in operating a secure and reliable service                     |
| Aggregated website analytics and performance improvement | page, referral, device, approximate location, interaction and performance data | Article 6(1)(f) GDPR, our legitimate interest in understanding and improving the website                     |
| Meeting legal obligations and handling claims            | relevant contact, contract and correspondence data                             | Article 6(1)(c) or Article 6(1)(f) GDPR, as applicable                                                       |

Before relying on legitimate interests, we consider whether those interests are overridden by your rights and freedoms.

## 7. Whether data is required

Providing data is voluntary, but the fields marked as required are necessary to submit a pilot application and allow us to respond. If you do not provide them, we cannot process the application.

## 8. Automation and decision-making

The website validates form fields, applies anti-spam and rate-limit rules, and sends a submitted application to the configured contact mailbox. It does not make solely automated decisions that produce legal or similarly significant effects for an individual.

## 9. Recipients and service providers

Personal data is available only where necessary to authorised people and the following providers used in the verified implementation:

| Provider                                            | Service and data involved                                                                  |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [Vercel](https://vercel.com)                        | website hosting, delivery, security logs, Web Analytics and Speed Insights                 |
| [Google Gmail](https://policies.google.com/privacy) | delivery and storage of pilot and contact emails through the configured Gmail SMTP account |

The application code can support separately configured CRM or email webhooks. No such webhook is configured in the reviewed local environment. A production build with one of those webhooks requires a verified public vendor or subprocessor list before it can be published.

{{vendorListLine}}

Processors acting on our behalf are expected to process data under applicable contractual and confidentiality obligations.

## 10. International transfers

Vercel and Google are providers established in the United States and may process data outside the European Economic Area. Where Chapter V GDPR applies, transfers must rely on a permitted mechanism, such as an adequacy decision, the EU-U.S. Data Privacy Framework for an eligible recipient, or the European Commission Standard Contractual Clauses with supplementary measures where required.

You may request information about the safeguards used by emailing [{{privacyEmail}}](mailto:{{privacyEmail}}).

## 11. Retention

We keep personal data only for as long as it is needed for the purpose described above and for any later period required by law or reasonably necessary for legal claims.

- unsuccessful or inactive pilot enquiries are removed when they are no longer needed for follow-up or validation of the pilot;
- correspondence is retained until the matter is resolved and then only while needed for legal, accounting or claim-related reasons;
- consent records are retained for as long as necessary to demonstrate the consent and honour its withdrawal;
- the in-memory form rate-limit counter expires after one hour;
- Vercel states that the daily visitor hash used by Web Analytics resets after 24 hours and that Web Analytics stores aggregated data rather than a cross-site browsing history.

The current website has no customer account database or document backup cycle. No backup retention period for customer documents is therefore stated in this Policy.

## 12. Your rights

Subject to GDPR conditions, you may have the right to access, rectify, erase, restrict or port your data, object to processing based on legitimate interests, withdraw consent at any time, and lodge a complaint with a supervisory authority.

Send requests to [{{privacyEmail}}](mailto:{{privacyEmail}}). We may ask for information reasonably needed to verify identity and clarify the request. Withdrawing consent does not affect processing carried out before withdrawal.

You may complain to the President of the Polish Personal Data Protection Office or to the competent authority in another EEA country.

## 13. Cookies and similar technologies

The reviewed website code does not set advertising or marketing cookies and does not use Google Analytics, Meta Pixel, Hotjar, PostHog, Microsoft Clarity, reCAPTCHA, YouTube embeds or a chat widget. It does not use local storage to track visitors or remember a language choice. The selected language is represented in the URL.

Vercel Web Analytics and Vercel Speed Insights are active. Vercel describes Web Analytics as cookieless, based on anonymised and aggregated data, with a visitor hash that resets daily. Speed Insights sends browser performance measurements to Vercel. These tools are used without an optional-cookie consent banner because the reviewed implementation does not store or access optional information on the user's device.

If optional cookies or similar technologies are added, they must remain disabled until any legally required consent is obtained. This Policy and a privacy-settings control will then be added before activation.

## 14. Security

The implementation uses encrypted HTTPS transport in production, server-side form validation, a honeypot, one-way hashes and rate limiting. Access to mail and deployment credentials is controlled through environment variables. No transmission or storage method is absolutely secure.

## 15. Children's data

VendoorProof is a B2B service for organisations and people acting professionally. It is not directed to children and we do not knowingly request children's data.

## 16. External links

The website may link to external services. Their operators are responsible for their own processing practices. Review their privacy information before providing data.

## 17. Changes to this Policy

We may update this Policy when the website, providers, law or processing practices change. The current version and effective date will be published here. Material changes will be communicated in an appropriate way.

## 18. Contact

Privacy questions, rights requests and general contact: [{{privacyEmail}}](mailto:{{privacyEmail}})

**{{controllerLegalName}}**
