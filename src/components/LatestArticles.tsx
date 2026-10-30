import Link from "next/link";
import { articleCopy } from "@/lib/article-copy";
import { articlePath, articlesIn, articlesPath } from "@/lib/articles";

export function LatestArticles() {
  const copy = articleCopy.nl;
  const articles = articlesIn("nl").slice(0, 4);
  return (
    <section style={{ marginTop: 28 }}>
      <div className="eyebrow">{copy.latestEyebrow}</div>
      <h2 className="page-title" style={{ fontSize: 32 }}>{copy.latestTitle}</h2>
      <p className="subtle" style={{ maxWidth: 560 }}>{copy.latestBody}</p>
      <div className="article-grid">
        {articles.map(article => (
          <Link className="card article-card" key={article.slug} href={articlePath(article.lang, article.slug)}>
            <span className="eyebrow">{article.category === "recept" ? copy.recipes : copy.guides}</span>
            <span className="section-title" style={{ display: "block", marginTop: 8 }}>{article.title}</span>
            <span className="subtle" style={{ display: "block", marginTop: 6, fontSize: 13 }}>{article.summary}</span>
          </Link>
        ))}
      </div>
      <p className="footer-note"><Link href={articlesPath("nl")} style={{ color: "var(--green)", fontWeight: 700 }}>{copy.allArticles} →</Link></p>
    </section>
  );
}
