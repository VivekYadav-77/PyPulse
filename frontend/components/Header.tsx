export default function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border-default bg-bg-secondary px-5 py-3">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-accent/40 bg-accent/10">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4 text-accent"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
          >
            <path d="M3 12h3.5l2-6 4 12 2.5-6H21" />
          </svg>
        </span>
        <span className="text-base font-semibold tracking-tight text-text-primary">
          PyPulse
        </span>
        <span className="ml-2 rounded-full border border-border-default bg-bg-tertiary px-2 py-0.5 font-mono text-xs text-text-muted">
          Python 3
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-text-muted">
        <a
          href="https://docs.python.org"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-accent"
        >
          Docs
        </a>
        <a
          href="https://github.com/VivekYadav-77"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-accent"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
