# Legal review required

The privacy-policy implementation is technically complete, but the following owner-supplied facts are not present in the repository and must be confirmed before production publication.

## Blocks production publication

- Full legal name of the controller (`LEGAL_CONTROLLER_NAME`).
- Public privacy and contact email (`LEGAL_PRIVACY_EMAIL`).

The build validation deliberately fails when any of these values is missing.

## Terms of Service publication remains pending

The bilingual Terms routes and route-based modal are implemented, but the
source documents are drafts. Missing contractual data does not block the
application build. Until every required value is approved, the Terms routes
display a localized "not published" notice instead of rendering the draft.
Before publishing the full document, set and legally review:

- service-provider legal name, legal form, registered address, VAT number and
  KRS/CEIDG registration details;
- contact, complaints, security, and illegal-content/abuse email addresses;
- payment term and notice period;
- post-termination export window, primary deletion period and backup retention;
- free pilot/beta liability cap;
- public Terms archive, technical requirements and support-policy URL or
  approved description.

The corresponding environment variables are listed in `.env.example`. Do not
use draft values merely to make the build pass.

## Product and contracting audit (2026-07-14)

- The reviewed repository is a bilingual public marketing site and lead intake
  endpoint. It has no account registration, authentication, organisation roles,
  MFA, application database, customer document storage, subscription checkout,
  invoicing or service-activation flow.
- The early-access form records a contact request and explicitly says that the
  product is in active development. Submitting it does not create an account,
  activate a pilot, accept an Order or form a paid contract. It therefore must
  not be repurposed as proof of Terms acceptance.
- Lead delivery uses configured Gmail SMTP. Optional CRM/email webhooks may also
  be enabled through environment variables; their actual production providers
  cannot be verified from this repository.
- Automated vendor requests, follow-ups, secure upload links, escalation,
  timelines and human verification are marketing descriptions and UI previews,
  not production application functions in this codebase.
- No AI provider or model-training implementation was found.
- No product storage, backup, export or deletion implementation was found.
- No payment processor, automatic renewal implementation, SLA, DPA, Security
  Policy or support tooling was found.

Before any account, paid plan, trial or actual pilot can be activated, add an
unchecked Terms checkbox at the contract-forming step and persist acceptance in
the same transaction as organisation/service activation. The acceptance record
must contain `termsVersion`, `termsLocale`, `acceptedAt` (UTC), user ID,
organisation ID, source (`signup`, `pilot` or `checkout`) and the rendered
document SHA-256 identifier exposed by the Terms renderer. Service activation
must fail atomically if that record cannot be saved.

## Owner decisions still required

1. Confirm that the service is exclusively B2B and approve the edge-case
   treatment of sole traders protected by mandatory law.
2. Decide whether subscriptions renew automatically and approve the exact
   cancellation and refund rules.
3. Approve support channels, operating hours, targets and whether any SLA is
   offered.
4. Approve all AI functions, data-use restrictions and the statement on model
   training before any AI functionality is launched.
5. Approve the illegal-content and abuse procedure.
6. Approve jurisdiction for customers outside Poland.
7. Approve which language controls when an Order does not resolve a conflict.
8. Approve the DPA scope and publish the verified subprocessor list.
9. Decide the notice process and lead time for material Terms changes.
10. Implement an archive endpoint before replacing version 1.0 after any
    customer has accepted it.

## Contract and operational review

- Confirm whether a Data Protection Officer has been appointed and set `LEGAL_DPO_DETAILS` if applicable.
- Confirm the Vercel plan, accepted Data Processing Addendum, transfer mechanism and production processing regions.
- Confirm whether the Gmail account is a managed Google Workspace account, the applicable data-processing terms and mailbox retention procedure.
- Approve and document a concrete retention schedule for unsuccessful pilot leads, correspondence, consent records and deployment logs. The policy currently uses purpose-based retention because no approved schedule exists in code or repository documentation.
- Verify the production values of `LEAD_CRM_WEBHOOK_URL` and `LEAD_EMAIL_WEBHOOK_URL`. If either is enabled, identify the provider, purpose, processing location, retention and transfer mechanism, publish a vendor list and set `LEGAL_VENDOR_LIST_URL`.
- Confirm the final production domain and set `NEXT_PUBLIC_SITE_URL` so canonical links do not use the Vercel preview fallback.
- Re-review this policy before launching accounts, authentication, customer document storage, automatic follow-ups, billing, support tooling or a production application database. None of those functions exists in the reviewed implementation.
