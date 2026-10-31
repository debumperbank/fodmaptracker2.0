#!/usr/bin/env python3
"""Validates the Fodmap-Tracker articles.

- Every article parses as YAML frontmatter and has the required fields.
- Recipes use the structured ingredient, step and fodmap_per_serving schema (see README).
- The 4 language versions of each recipe have identical amounts, units, groups, step counts,
  per-serving amounts and statuses.
- No numeric low-FODMAP thresholds anywhere (Monash terms forbid reuse of their data):
  * fodmap_per_serving entries may only have name, amount, unit, status (no low_fodmap_limit);
  * no frontmatter key containing "limit";
  * no body sentence (outside the ingredient list, method and sources) that combines a
    quantity (g, ml, cup, tbsp, slices, ...) with threshold wording (low, Monash, tot, up to,
    jusqu'à, bis, grens, limit, standard serve, ...);
  * no table column for a Monash/low-FODMAP serving size.
- The Markdown body has as many ingredient lines and steps as the frontmatter.
Usage: python3 scripts/check_recipes.py   (needs PyYAML)
"""
import datetime, os, re, sys, yaml
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "articles")
LANGS = ["nl", "en", "fr", "de"]
REQ = ["title", "slug", "lang", "date", "author", "reading_time_minutes", "summary", "tags", "category"]
REC = ["servings", "prep_time", "cook_time", "ingredients", "steps", "fodmap_per_serving"]
STATUS = {"low", "portie-telt", "onzeker", "vermijden", "swap"}
FPS_KEYS = {"name", "amount", "unit", "status"}
UNIT = (r"(?:g|gram|grams|ml|kop|koppen|cups?|tass?es?|Tassen?|el|tl|EL|TL|tbsp|tsp|eetlepels?|theelepels?|"
        r"tablespoons?|teaspoons?|c\. à s\.|c\. à c\.|cuill[eè]res?(?: à (?:soupe|café))?|Esslöffel|Teelöffel|"
        r"sneetjes?|slices?|tranches?|Scheiben?|blikjes?|cans?|canettes?|Dosen?|olijven|olives|Oliven)")
NUM_UNIT = re.compile(r"(?<![\w/])(?:\d+(?:[.,]\d+)?(?:\s?[½¼¾])?|\d+/\d+|[½¼¾])\s*" + UNIT + r"(?=\W|$)")
THRESH = re.compile(r"(?i)\b(?:low|pauvres?|monash|grens|limiet|limits?|limite|grenze|standaardportie|standard serve|"
                    r"portion standard|standardportion|tot|up to|jusqu|bis|maximaal|maximum|max|vanaf|à partir|ab)\b")
SKIP_SEC = re.compile(r"(?i)^(ingrediënten|ingredients|ingrédients|zutaten|bereiding|method|préparation|zubereitung|bronnen|sources|quellen)\b")
TAB_HEAD = re.compile(r"(?i)^\|.*(monash|low-fodmap[- ]port|low-fodmap serve|portion pauvre|limit|grens|grenze)")
def walk_keys(o, path=""):
    if isinstance(o, dict):
        for k, v in o.items():
            yield f"{path}.{k}", k
            yield from walk_keys(v, f"{path}.{k}")
    elif isinstance(o, list):
        for i, v in enumerate(o): yield from walk_keys(v, f"{path}[{i}]")
def check_thresholds(p, fm, body):
    for path, k in walk_keys(fm):
        if "limit" in str(k).lower(): err(f"{p}: frontmatter key {path} not allowed (no numeric thresholds)")
    texts = [("summary", str(fm.get("summary", "")))]
    for sec in re.split(r"\n(?=## )", "\n" + body):
        head = sec.strip().split("\n", 1)[0].lstrip("# ").strip()
        if SKIP_SEC.match(head): continue
        texts.append((head, sec))
    for where, t in texts:
        for line in t.split("\n"):
            if TAB_HEAD.match(line): err(f"{p} [{where}]: threshold column in table: {line.strip()[:80]}")
            if line.startswith("|"): continue
            for sent in re.split(r"(?<=[.!?;:])\s+", line):
                if NUM_UNIT.search(sent) and THRESH.search(sent):
                    err(f"{p} [{where}]: possible numeric threshold: {sent.strip()[:120]}")
errors = []
def err(msg): errors.append(msg)
def load(path):
    txt = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", txt, re.S)
    if not m: err(f"{path}: no frontmatter"); return None, ""
    return yaml.safe_load(m.group(1)), m.group(2)
def isnum(x): return isinstance(x, (int, float)) and not isinstance(x, bool)
def check_recipe(p, fm, body):
    for k in REC:
        if k not in fm: err(f"{p}: missing {k}")
    for i, it in enumerate(fm.get("ingredients", [])):
        if not isinstance(it, dict): err(f"{p}: ingredient {i} is not an object"); continue
        extra = set(it) - {"name", "amount", "unit", "note", "group"}
        if extra: err(f"{p}: ingredient {i} has unknown keys {extra}")
        if not isinstance(it.get("name"), str) or not it["name"]: err(f"{p}: ingredient {i} has no name")
        if not isnum(it.get("amount")) or it["amount"] <= 0: err(f"{p}: ingredient {i} amount must be a positive number")
        if it.get("unit") not in ("g", "ml"): err(f"{p}: ingredient {i} unit must be g or ml")
    for i, s in enumerate(fm.get("steps", [])):
        if not isinstance(s, dict) or set(s) != {"title", "text"} or not all(isinstance(v, str) and v for v in s.values()):
            err(f"{p}: step {i} must be an object with title and text")
    for i, f in enumerate(fm.get("fodmap_per_serving", [])):
        if not isnum(f.get("amount")) or f.get("unit") not in ("g", "ml"): err(f"{p}: fodmap_per_serving {i} needs a numeric amount in g or ml")
        if f.get("status") not in STATUS: err(f"{p}: fodmap_per_serving {i} has unknown status {f.get('status')}")
        if set(f) != FPS_KEYS: err(f"{p}: fodmap_per_serving {i} keys must be exactly {sorted(FPS_KEYS)}, got {sorted(f)}")
    sec = re.split(r"\n## ", body)
    ing_lines = sum(len(re.findall(r"^- \d", s, re.M)) for s in sec[1:2])
    step_lines = sum(len(re.findall(r"^\d+\. \*\*", s, re.M)) for s in sec[2:3])
    if ing_lines != len(fm.get("ingredients", [])): err(f"{p}: body has {ing_lines} ingredient lines, frontmatter {len(fm.get('ingredients', []))}")
    if step_lines != len(fm.get("steps", [])): err(f"{p}: body has {step_lines} steps, frontmatter {len(fm.get('steps', []))}")
def signature(fm):
    groups, gmap = [], {}
    for it in fm["ingredients"]:
        g = it.get("group")
        groups.append(None if g is None else gmap.setdefault(g, len(gmap)))
    return {
        "servings": fm["servings"], "prep_time": fm["prep_time"], "cook_time": fm["cook_time"],
        "tags": fm["tags"], "category": fm["category"], "estimated_fields": fm.get("estimated_fields"),
        "ingredients": [(it["amount"], it["unit"], "note" in it) for it in fm["ingredients"]],
        "groups": groups, "step_count": len(fm["steps"]),
        "fodmap": [(f["amount"], f["unit"], f["status"]) for f in fm["fodmap_per_serving"]],
    }
n_files = n_rec = 0
for slug in sorted(os.listdir(ROOT)):
    d = os.path.join(ROOT, slug)
    if not os.path.isdir(d): continue
    sigs = {}
    for lang in LANGS:
        p = os.path.join(d, f"{lang}.md")
        if not os.path.exists(p): err(f"{slug}: missing {lang}.md"); continue
        fm, body = load(p); n_files += 1
        if fm is None: continue
        for k in REQ:
            if k not in fm: err(f"{p}: missing {k}")
        if fm.get("slug") != slug: err(f"{p}: slug mismatch")
        if fm.get("lang") != lang: err(f"{p}: lang mismatch")
        if not isinstance(fm.get("date"), datetime.date): err(f"{p}: date is not a date")
        image = fm.get("image")
        if image is not None:
            if not isinstance(image, str) or not image.startswith("/articles/items/") or not image.endswith(".webp"):
                err(f"{p}: image must point to /articles/items/*.webp")
            elif not os.path.exists(os.path.join(ROOT, "..", "..", "public", image.lstrip("/"))):
                err(f"{p}: image file does not exist: {image}")
            if not isinstance(fm.get("image_alt"), str) or not fm["image_alt"].strip():
                err(f"{p}: image_alt is required when image is set")
        check_thresholds(p, fm, body)
        if fm.get("category") == "recept":
            check_recipe(p, fm, body)
            try: sigs[lang] = signature(fm)
            except Exception as e: err(f"{p}: cannot build signature: {e}")
    if sigs:
        n_rec += 1
        base = sigs.get("nl")
        for lang, s in sigs.items():
            for k in s:
                if base and s[k] != base[k]: err(f"{slug}: {lang} differs from nl in {k}")
print(f"checked {n_files} files, {n_rec} recipes x {len(LANGS)} languages")
if errors:
    print("\n".join("ERROR " + e for e in errors)); sys.exit(1)
print("all checks passed")
