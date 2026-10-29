import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getRecipes, requireUser } from "@/lib/data";

export const metadata={title:"Recepten"};
export default async function RecipesPage({searchParams}:{searchParams:Promise<{q?:string;message?:string;error?:string}>}){
 const [{user},params]=await Promise.all([requireUser(),searchParams]);const query=(params.q??"").slice(0,120);const recipes=await getRecipes(query);
 return <AppShell active="recepten" email={user.email??"Account"}><header style={{marginBottom:20}}><div className="eyebrow">Jouw verzameling</div><h1 className="page-title">Recepten</h1><p className="subtle">Bewaar je eigen recepten, vind ze snel terug en voeg ze toe aan je weekmenu.</p></header>
 {params.message&&<div className="notice">Het recept is verwijderd.</div>}{params.error&&<div className="notice notice-error">De actie is niet gelukt. Probeer het opnieuw.</div>}
 <section className="card" style={{marginBottom:18}}><form className="search-row" action="/recepten"><label className="sr-only" htmlFor="q">Zoek op titel</label><input id="q" name="q" defaultValue={query} maxLength={120} placeholder="Zoek een recept op titel…"/><button className="btn" type="submit">Zoeken</button>{query&&<Link className="btn btn-secondary" href="/recepten">Wissen</Link>}</form></section>
 <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:14}}><h2 className="section-title" style={{margin:0}}>{query?`${recipes.length} resultaat${recipes.length===1?"":"en"}`:`${recipes.length} recept${recipes.length===1?"":"en"}`}</h2><Link className="btn" href="/recepten/nieuw">+ Nieuw recept</Link></div>
 {recipes.length===0?<section className="card empty"><p>{query?"Geen recepten gevonden met deze titel.":"Je hebt nog geen recepten opgeslagen."}</p><Link href="/recepten/nieuw" style={{color:"var(--green)",fontWeight:700}}>Maak je eerste recept →</Link></section>:<section className="recipe-grid">{recipes.map(recipe=><article className="card recipe-card" key={recipe.id}><div><div className="eyebrow">{recipe.servings} {recipe.servings===1?"persoon":"personen"}{recipe.preparation_minutes?` · ${recipe.preparation_minutes} min`:""}</div><h2 className="section-title" style={{fontSize:20,margin:"8px 0 5px"}}>{recipe.title}</h2>{recipe.description&&<p className="subtle" style={{fontSize:13,margin:0}}>{recipe.description}</p>}</div><Link className="btn btn-secondary" href={`/recepten/${recipe.id}`}>Bekijk recept →</Link></article>)}</section>}
 <p className="footer-note">Recepten zijn persoonlijke notities en bevatten nog geen gevalideerde FODMAP-beoordeling.</p></AppShell>;
}
