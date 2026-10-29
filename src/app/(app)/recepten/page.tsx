import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getCuratedRecipes, getRecipes, requireUser } from "@/lib/data";
import { menuMealNames, type MenuMealType } from "@/lib/types";

export const metadata={title:"Recepten"};

type RecipeSearchParams={q?:string;fase?:string;categorie?:string;bron?:string;message?:string;error?:string};
const categories=Object.entries(menuMealNames) as [MenuMealType,string][];

export default async function RecipesPage({searchParams}:{searchParams:Promise<RecipeSearchParams>}){
 const [{user},params]=await Promise.all([requireUser(),searchParams]);
 const query=(params.q??"").slice(0,120);
 const normalizedQuery=query.toLocaleLowerCase("nl-NL");
 const eliminationOnly=params.fase==="eliminatie";
 const category=categories.some(([value])=>value===params.categorie)?params.categorie as MenuMealType:"";
 const source=(params.bron??"").slice(0,100);
 const [recipes,curated]=await Promise.all([getRecipes(query),getCuratedRecipes()]);
 const sources=[...new Set(curated.map(recipe=>recipe.source_name))].sort((a,b)=>a.localeCompare(b,"nl-NL"));
 const suggestions=curated.filter(recipe=>(!query||`${recipe.title} ${recipe.summary}`.toLocaleLowerCase("nl-NL").includes(normalizedQuery))&&(!eliminationOnly||recipe.suitable_for_elimination)&&(!category||recipe.category===category)&&(!source||recipe.source_name===source));
 const hasFilters=Boolean(query||eliminationOnly||category||source);

 return <AppShell active="recepten" email={user.email??"Account"}>
  <header style={{marginBottom:20}}><div className="eyebrow">Ontdekken en bewaren</div><h1 className="page-title">Recepten</h1><p className="subtle">Blader door alle low-FODMAP-recepten of verfijn op wat jij vandaag zoekt.</p></header>
  {params.message&&<div className="notice">Het recept is verwijderd.</div>}{params.error&&<div className="notice notice-error">De actie is niet gelukt. Probeer het opnieuw.</div>}

  <section className="card recipe-filter-card">
   <form className="recipe-filter-grid" action="/recepten">
    <div className="field recipe-search-field"><label htmlFor="q">Zoeken</label><input id="q" name="q" defaultValue={query} maxLength={120} placeholder="Bijv. kip, ontbijt of chocolade…"/></div>
    <div className="field"><label htmlFor="categorie">Categorie</label><select id="categorie" name="categorie" defaultValue={category}><option value="">Alle categorieën</option>{categories.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div>
    <div className="field"><label htmlFor="bron">Bron</label><select id="bron" name="bron" defaultValue={source}><option value="">Alle bronnen</option>{sources.map(name=><option key={name} value={name}>{name}</option>)}</select></div>
    <label className="filter-check"><input type="checkbox" name="fase" value="eliminatie" defaultChecked={eliminationOnly}/> Geschikt voor eliminatiefase</label>
    <div className="recipe-filter-actions"><button className="btn" type="submit">Resultaten tonen</button>{hasFilters&&<Link className="btn btn-secondary" href="/recepten">Filters wissen</Link>}</div>
   </form>
  </section>

  <div className="section-heading recipe-section-heading"><div><div className="eyebrow">Alle bronrecepten</div><h2 className="page-title" style={{fontSize:27}}>{suggestions.length} recept{suggestions.length===1?"":"en"}</h2></div><span className="subtle">Scroll om alles te bekijken</span></div>
  {suggestions.length===0?<section className="card empty"><p>Geen recepten passen bij deze filters.</p><Link href="/recepten" style={{color:"var(--green)",fontWeight:700}}>Bekijk alle recepten →</Link></section>:<section className="recipe-grid">{suggestions.map(recipe=><article className="card recipe-card" key={recipe.id}><div><div className="eyebrow">{recipe.source_name} · {recipe.servings} porties{recipe.preparation_minutes?` · ${recipe.preparation_minutes} min`:""}</div><div className="recipe-badges">{recipe.suitable_for_elimination&&<span className="pill phase-pill">Eliminatiefase</span>}<span className="pill category-pill">{menuMealNames[recipe.category]}</span></div><h2 className="section-title" style={{fontSize:20,margin:"8px 0 5px"}}>{recipe.title}</h2><p className="subtle" style={{fontSize:13,margin:0}}>{recipe.summary}</p></div><Link className="btn btn-secondary" href={`/recepten/uitgelicht/${recipe.id}`}>Bekijk recept →</Link></article>)}</section>}

  <div className="section-heading own-recipes-heading"><div><div className="eyebrow">Jouw verzameling</div><h2 className="page-title" style={{fontSize:27}}>{recipes.length} eigen recept{recipes.length===1?"":"en"}</h2></div><Link className="btn" href="/recepten/nieuw">+ Nieuw recept</Link></div>
  {recipes.length===0?<section className="card empty"><p>{query?"Geen eigen recepten gevonden met deze zoekterm.":"Je hebt nog geen eigen recepten opgeslagen."}</p><Link href="/recepten/nieuw" style={{color:"var(--green)",fontWeight:700}}>Maak je eerste recept →</Link></section>:<section className="recipe-grid">{recipes.map(recipe=><article className="card recipe-card" key={recipe.id}><div><div className="eyebrow">Eigen recept · {recipe.servings} {recipe.servings===1?"persoon":"personen"}{recipe.preparation_minutes?` · ${recipe.preparation_minutes} min`:""}</div><h2 className="section-title" style={{fontSize:20,margin:"8px 0 5px"}}>{recipe.title}</h2>{recipe.description&&<p className="subtle" style={{fontSize:13,margin:0}}>{recipe.description}</p>}</div><Link className="btn btn-secondary" href={`/recepten/${recipe.id}`}>Bekijk recept →</Link></article>)}</section>}
  <p className="footer-note">Eigen recepten zijn persoonlijke notities. Bronadaptaties zijn geen medisch advies; portiegrootte en individuele tolerantie blijven bepalend.</p>
 </AppShell>;
}
