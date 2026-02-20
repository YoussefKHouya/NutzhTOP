type SectionTitleProps = {
  title: string;
  className?: string;
};

export function SectionTitle({ title, className = "" }: SectionTitleProps) {
  return (
    <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center opacity-40 flex items-center justify-center font-upheavtt ${className}`.trim()}>
      <span className="w-8 md:w-16 h-px bg-gray-400 mr-4" />
      {title}
      <span className="w-8 md:w-16 h-px bg-gray-400 ml-4" />
    </h2>
  );
}
