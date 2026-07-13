import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Locale } from "@/i18n/routing";
import { getPrivacyPolicyMarkdown } from "@/lib/privacy-policy";

type PrivacyPolicyContentProps = {
  locale: Locale;
};

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="text-foreground mt-12 scroll-mt-28 text-2xl font-semibold tracking-[-0.01em] first:mt-0 md:text-[1.75rem]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-foreground mt-8 text-xl font-semibold">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-foreground-muted mt-4 max-w-[76ch] text-[0.9375rem] leading-7 md:text-base md:leading-8">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="text-foreground-muted marker:text-primary mt-4 grid max-w-[76ch] list-disc gap-2 pl-5 text-[0.9375rem] leading-7 md:text-base">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-foreground-muted marker:text-primary mt-4 grid max-w-[76ch] list-decimal gap-2 pl-5 text-[0.9375rem] leading-7 marker:font-semibold md:text-base">
      {children}
    </ol>
  ),
  strong: ({ children }) => (
    <strong className="text-foreground font-semibold">{children}</strong>
  ),
  a: ({ href = "", children }) => {
    const external = href.startsWith("http://") || href.startsWith("https://");

    return (
      <a
        className="focus-ring text-primary decoration-primary/35 hover:text-primary-hover rounded-sm font-semibold underline underline-offset-4 transition-colors hover:decoration-current"
        href={href}
        rel={external ? "noopener noreferrer" : undefined}
        target={external ? "_blank" : undefined}
      >
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className="border-border mt-6 max-w-full overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[44rem] border-collapse text-left text-sm leading-6">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-surface-muted">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border-border text-foreground border-b px-4 py-3 font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-border/70 text-foreground-muted border-b px-4 py-3 align-top last:[tr:last-child_&]:border-b-0">
      {children}
    </td>
  ),
};

export function PrivacyPolicyContent({ locale }: PrivacyPolicyContentProps) {
  return (
    <article className="min-w-0">
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm]}
      >
        {getPrivacyPolicyMarkdown(locale)}
      </ReactMarkdown>
    </article>
  );
}
