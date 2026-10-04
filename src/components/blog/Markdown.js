import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const isExternal = (href = "") => /^https?:\/\//i.test(href);

/**
 * Renders a post body. Raw HTML in the Markdown is not rendered (react-markdown
 * skips it), so nothing typed in the dashboard can inject markup or scripts.
 */
export default function Markdown({ children, className = "" }) {
  return (
    <div className={`prose-brxel ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: label }) =>
            isExternal(href) ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ) : (
              <a href={href}>{label}</a>
            ),
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => <img src={typeof src === "string" ? src : ""} alt={alt || ""} loading="lazy" decoding="async" />,
          table: ({ children: rows }) => (
            <div className="prose-table">
              <table>{rows}</table>
            </div>
          ),
        }}
      >
        {children || ""}
      </ReactMarkdown>
    </div>
  );
}
