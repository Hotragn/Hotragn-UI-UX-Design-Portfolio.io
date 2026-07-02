/**
 * Hand-drawn CSS mockups that live inside the case-study cards.
 * Ported 1:1 from the original inline-styled skeletons; same visuals,
 * expressed as Tailwind utilities over the design tokens.
 */

function MockFrame({
  children,
  bodyClassName = "",
}: {
  children: React.ReactNode;
  bodyClassName?: string;
}) {
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-bar">
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className={`mock-body ${bodyClassName}`.trim()}>{children}</div>
    </div>
  );
}

export function MockPayPal() {
  return (
    <MockFrame>
      <div className="h-3 w-[38%] rounded-md bg-ink opacity-85" />
      <div className="h-[9px] w-[70%] rounded-md bg-line" />
      <div className="mt-1.5 grid grid-cols-2 gap-2.5">
        <div className="h-14 rounded-[10px] border border-solid border-line bg-forest-soft" />
        <div className="h-14 rounded-[10px] border border-solid border-line bg-paper-deep" />
      </div>
      <div className="h-[9px] w-[55%] rounded-md bg-line" />
      <div className="mt-1 h-[34px] w-[46%] rounded-full bg-accent opacity-90" />
    </MockFrame>
  );
}

export function MockRareRabbit() {
  return (
    <MockFrame>
      <div className="flex items-center gap-2.5">
        <div className="h-11 w-11 rounded-[10px] border border-solid border-line bg-paper-deep" />
        <div className="flex-1">
          <div className="mb-1.5 h-2.5 w-[60%] rounded-md bg-ink opacity-80" />
          <div className="h-2 w-[40%] rounded-md bg-line" />
        </div>
        <div className="h-3 w-9 rounded-md bg-forest opacity-70" />
      </div>
      <div className="flex items-center gap-2.5">
        <div className="h-11 w-11 rounded-[10px] border border-solid border-line bg-forest-soft" />
        <div className="flex-1">
          <div className="mb-1.5 h-2.5 w-[52%] rounded-md bg-ink opacity-80" />
          <div className="h-2 w-[34%] rounded-md bg-line" />
        </div>
        <div className="h-3 w-9 rounded-md bg-forest opacity-70" />
      </div>
      <div className="mt-1.5 flex h-[38px] items-center justify-center rounded-full bg-ink opacity-90">
        <div className="h-[9px] w-[40%] rounded-md bg-paper opacity-90" />
      </div>
    </MockFrame>
  );
}

export function MockNotion() {
  return (
    <MockFrame bodyClassName="items-center">
      <div className="mx-auto h-[30px] w-[52%] rounded-lg bg-ink opacity-85" />
      <div className="flex justify-center gap-2">
        <div className="h-4 w-[2px] bg-line" />
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        <div className="h-[26px] rounded-lg border border-solid border-line bg-forest-soft" />
        <div className="h-[26px] rounded-lg border border-solid border-line bg-paper-deep" />
        <div className="h-[26px] rounded-lg border border-solid border-line bg-paper-deep" />
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        <div className="h-[26px] rounded-lg border border-solid border-line bg-card" />
        <div className="h-[26px] rounded-lg border border-solid border-line bg-card" />
        <div className="h-[26px] rounded-lg border border-solid border-line bg-[#fdf1ec] dark:bg-[rgba(255,106,63,0.12)]" />
      </div>
    </MockFrame>
  );
}

export function MockFamilyFoundations() {
  return (
    <MockFrame>
      <div className="flex items-center gap-2.5">
        <div className="h-[38px] w-[38px] rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--gold),var(--accent))]" />
        <div className="flex-1">
          <div className="mb-1.5 h-2.5 w-[55%] rounded-md bg-ink opacity-80" />
          <div className="h-2 w-[38%] rounded-md bg-line" />
        </div>
      </div>
      <div className="h-[9px] w-[80%] rounded-md bg-line" />
      <div className="h-[9px] w-[64%] rounded-md bg-line" />
      <div className="mt-1 flex gap-2">
        <div className="h-7 flex-1 rounded-full border border-solid border-line bg-forest-soft" />
        <div className="h-7 flex-1 rounded-full bg-accent opacity-90" />
      </div>
      <div className="mt-0.5 h-[9px] w-[46%] rounded-md bg-forest opacity-50" />
    </MockFrame>
  );
}
