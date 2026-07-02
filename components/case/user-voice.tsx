/**
 * Short user quotes reconstructed from the testing sessions each case
 * study describes. They are paraphrases, and every card says so.
 */
export function UserVoice({ quotes }: { quotes: string[] }) {
  return (
    <div className="voices">
      {quotes.map((quote) => (
        <figure className="voice" key={quote}>
          <blockquote>
            <p style={{ margin: 0 }}>&ldquo;{quote}&rdquo;</p>
          </blockquote>
          <figcaption>Paraphrased from session notes</figcaption>
        </figure>
      ))}
    </div>
  );
}
