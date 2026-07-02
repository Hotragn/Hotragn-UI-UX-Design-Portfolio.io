export function Footer({ variant = "home" }: { variant?: "home" | "case" }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <span>© {year} Hotragn Pettugani. Designed and hand-coded by me.</span>
        {variant === "home" ? (
          <span className="signoff">
            Toggle "Design notes" in the nav to see why this site looks the way it does.
          </span>
        ) : (
          <span>
            <a href="mailto:pettugani.h@northeastern.edu">pettugani.h@northeastern.edu</a>
          </span>
        )}
      </div>
    </footer>
  );
}
