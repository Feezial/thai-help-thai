export function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="rise mb-5">
      <p className="text-[12px] font-medium tracking-wide text-blue">{subtitle}</p>
      <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-ink">{title}</h1>
    </header>
  );
}
