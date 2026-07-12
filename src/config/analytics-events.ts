export const analyticsEvents = {
  landingViewed: "landing_viewed",
  navAnchorClicked: "nav_anchor_clicked",
  headerCtaClicked: "header_primary_cta_clicked",
  heroCtaClicked: "hero_primary_cta_clicked",
  workflowViewed: "workflow_section_viewed",
  workflowCtaClicked: "workflow_cta_clicked",
  roiCalculatorCompleted: "roi_calculator_completed",
  pilotCtaClicked: "pilot_cta_clicked",
  pilotFormStarted: "form_started",
  pilotFormSubmitted: "form_submitted",
  pilotFormFailed: "pilot_form_failed",
  pricingQuestionViewed: "pricing_question_viewed",
  pricingQuestionAnswered: "pricing_question_answered",
  callBooked: "call_booked",
  leadEmailEntered: "lead_email_entered",
  companyTypeSelected: "company_type_selected",
  vendorVolumeSelected: "vendor_volume_selected",
  currentProcessSelected: "current_process_selected",
  followUpVolumeSelected: "follow_up_volume_selected",
  calendarOpened: "calendar_opened",
  languageChanged: "language_changed",
  campaignSegmentChanged: "campaign_segment_changed",
  faqOpened: "faq_opened"
} as const;

export type AnalyticsEventName =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];
