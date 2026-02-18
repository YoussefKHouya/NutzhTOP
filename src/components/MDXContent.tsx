import { MDXRemote } from "next-mdx-remote/rsc";
import { CodeBlock } from "@/components/CodeBlock";

const components = {
  pre: ({ children, ...props }: { children?: React.ReactNode }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const child: any = Array.isArray(children) ? children[0] : children;
    
    // Check if this is a code block (has <code> child)
    if (child?.type === "code" || child?.props?.className) {
      const code = child?.props?.children;
      const className = child?.props?.className as string | undefined;
      const lang = className?.startsWith("language-") ? className.replace("language-", "") : undefined;
      
      if (typeof code === "string") {
        return <CodeBlock code={code} lang={lang} className={className} />;
      }
    }
    
    // Fallback for non-code pre blocks
    return <pre {...props}>{children}</pre>;
  },
  p: (props: React.HTMLAttributes<HTMLDivElement>) => <div className="p-tag-content" {...props} />,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-center font-fustat text-2xl sm:text-4xl leading-tight my-6" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="animate-shine" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="animate-shine" {...props} />,
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    // Inline code (not in a pre block)
    if (!props.className?.startsWith("language-")) {
      return (
        <code className="inline-code bg-[#1e1e20] px-2 py-1 rounded-md text-sm font-mono border border-zinc-700/30" {...props} />
      );
    }
    // Code block code (handled by pre component)
    return <code {...props} />;
  },
};

export function MDXContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
