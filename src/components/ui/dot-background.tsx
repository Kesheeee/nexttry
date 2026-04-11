export function DotBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.15,
      }}
    />
  );
}
