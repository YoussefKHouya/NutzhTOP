import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/CodeBlock";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: ({ children, ...props }) => {
      // MDX usually renders <pre><code class="language-...">...</code></pre>
      // We wrap it into our CodeBlock for pinning/copy behavior.
      // If it isn't a code block, fallback to normal pre.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const child: any = Array.isArray(children) ? children[0] : children;
      const code = child?.props?.children;
      const className = child?.props?.className as string | undefined;
      const lang = className?.startsWith("language-") ? className.replace("language-", "") : undefined;

      if (typeof code === "string") {
        return <CodeBlock code={code} lang={lang} />;
      }
      return <pre {...props}>{children}</pre>;
    },
    ...components,
  };
}
