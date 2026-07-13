# Legal review required

The privacy-policy implementation is technically complete, but the following owner-supplied facts are not present in the repository and must be confirmed before production publication.

## Blocks production publication

- Full legal name of the controller (`LEGAL_CONTROLLER_NAME`).
- Registered or business address (`LEGAL_REGISTERED_ADDRESS`).
- Registration or VAT number (`LEGAL_REGISTRATION_NUMBER`).
- Public privacy email and general contact email (`LEGAL_PRIVACY_EMAIL`, `LEGAL_CONTACT_EMAIL`).

The build validation deliberately fails when any of these values is missing.

## Contract and operational review

- Confirm whether a Data Protection Officer has been appointed and set `LEGAL_DPO_DETAILS` if applicable.
- Confirm the Vercel plan, accepted Data Processing Addendum, transfer mechanism and production processing regions.
- Confirm whether the Gmail account is a managed Google Workspace account, the applicable data-processing terms and mailbox retention procedure.
- Approve and document a concrete retention schedule for unsuccessful pilot leads, correspondence, consent records and deployment logs. The policy currently uses purpose-based retention because no approved schedule exists in code or repository documentation.
- Verify the production values of `LEAD_CRM_WEBHOOK_URL` and `LEAD_EMAIL_WEBHOOK_URL`. If either is enabled, identify the provider, purpose, processing location, retention and transfer mechanism, publish a vendor list and set `LEGAL_VENDOR_LIST_URL`.
- Confirm the final production domain and set `NEXT_PUBLIC_SITE_URL` so canonical links do not use the Vercel preview fallback.
- Re-review this policy before launching accounts, authentication, customer document storage, automatic follow-ups, billing, support tooling or a production application database. None of those functions exists in the reviewed implementation.
