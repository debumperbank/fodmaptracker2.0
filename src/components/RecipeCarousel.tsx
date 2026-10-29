"use client";

import Link from "next/link";
import { useRef } from "react";
import { menuMealNames, type CuratedRecipe, type Recipe } from "@/lib/types";

type Props=
 | {kind:"curated";recipes:CuratedRecipe[];label:string}
 | {kind:"own";recipes:Recipe[];label:string};

export function RecipeCarousel(props:Props){
 const track=useRef<HTMLDivElement>(null);
 const move=(direction:number)=>track.current?.scrollBy({left:direction*Math.min(track.current.clientWidth*.85,900),behavior:"smooth"});
 return <div className="carousel-shell" aria-label={props.label}>
  <div className="carousel-controls"><button type="button" className="carousel-button" onClick={()=>move(-1)} aria-label="Vorige recepten">←</button><button type="button" className="carousel-button" onClick={()=>move(1)} aria-label="Volgende recepten">→</button></div>
  <div className="recipe-carousel" ref={track} tabIndex={0}>
   {props.kind==="curated"?props.recipes.map(recipe=><article className="card recipe-card carousel-card" key={recipe.id}><div><div className="eyebrow">{recipe.source_name} · {recipe.servings} porties{recipe.preparation_minutes?` · ${recipe.preparation_minutes} min`:""}</div><div className="recipe-badges">{recipe.suitable_for_elimination&&<span className="pill phase-pill">Eliminatiefase</span>}<span className="pill category-pill">{menuMealNames[recipe.category]}</span></div><h3 className="section-title" style={{fontSize:20,margin:"8px 0 5px"}}>{recipe.title}</h3><p className="subtle" style={{fontSize:13,margin:0}}>{recipe.summary}</p></div><Link className="btn btn-secondary" href={`/recepten/uitgelicht/${recipe.id}`}>Bekijk recept →</Link></article>):props.recipes.map(recipe=><article className="card recipe-card carousel-card" key={recipe.id}><div><div className="eyebrow">Eigen recept · {recipe.servings} {recipe.servings===1?"persoon":"personen"}{recipe.preparation_minutes?` · ${recipe.preparation_minutes} min`:""}</div><h3 className="section-title" style={{fontSize:20,margin:"8px 0 5px"}}>{recipe.title}</h3>{recipe.description&&<p className="subtle" style={{fontSize:13,margin:0}}>{recipe.description}</p>}</div><Link className="btn btn-secondary" href={`/recepten/${recipe.id}`}>Bekijk recept →</Link></article>)}
  </div>
 </div>;
}
