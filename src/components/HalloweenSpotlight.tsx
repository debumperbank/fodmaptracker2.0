import Link from "next/link";
import type { CuratedRecipe } from "@/lib/types";

const halloweenTitles: Record<string, { title: string; image: string }> = {
  "Romige pompoen-saliepasta": { title: "Pompoenpasta uit het spookbos", image: "/halloween/pompoen-saliepasta.webp" },
  "Romige pompoen-saliegnocchi": { title: "Spookjesgnocchi met pompoen", image: "/halloween/pompoen-saliegnocchi.webp" },
  "Pompoen-wortelsoep": { title: "Heksenketel met pompoen en wortel", image: "/halloween/pompoen-wortelsoep.webp" },
};

export function HalloweenSpotlight({ recipes }: { recipes: CuratedRecipe[] }) {
  const featured = recipes.filter(recipe => halloweenTitles[recipe.title]).slice(0, 3);
  if (featured.length === 0) return null;
  return <section className="halloween-spotlight" aria-labelledby="halloween-title">
    <div className="eyebrow">Halloween bij Tolerio</div>
    <h2 id="halloween-title" className="page-title">Drie griezelig lekkere gerechten</h2>
    <p>Kindvriendelijke pompoenrecepten voor een gezellige avond. De normale portie- en fase-informatie blijft altijd leidend.</p>
    <div className="halloween-grid">{featured.map(recipe=>{const theme=halloweenTitles[recipe.title];return <article className="halloween-card" key={recipe.id}>
      <img src={theme.image} alt={`Halloweenpresentatie van ${recipe.title}`}/>
      <div><span className="pill">🎃 Halloween-tip</span><h3>{theme.title}</h3><p>{recipe.summary}</p><Link className="btn" href={`/recepten/uitgelicht/${recipe.id}`}>Bekijk recept →</Link></div>
    </article>})}</div>
  </section>;
}
