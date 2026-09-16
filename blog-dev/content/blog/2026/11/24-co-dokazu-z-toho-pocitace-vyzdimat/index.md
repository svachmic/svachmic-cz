---
layout: post
title: "Co dokážu z toho počítače vyždímat"
description: "Před rokem vyšel Opus 4.5. Půl roku předtím jsem v podcastu říkal, že denně používám Cursor. Vášeň zůstala stejná. Stroj, ze kterého ji ždímám, se změnil."
date: "2026-11-24 10:00:00"
modified: "2026-11-24 10:00:00"
categories: "story"
tags: [czech, ai, agents, terraform, kubernetes]
author: "Michal Švácha"
---

*[PLACEHOLDER — header.jpg: tmavý široký záběr ve stylu blog-dev (fialový akcent #bb05fe). Návrh A: vlevo Terraform / GCS lifecycle YAML, vpravo terminál s agent session. Návrh B: čistý diagram lifecycle politiky (hot → nearline → archive) vedle screenshotu skills/hooks. Žádné firemní logo, žádná dětská fotka.]*

Dnes je to přesně rok, co Anthropic pustil [Opus 4.5][opus-45]. Půl roku předtím jsem seděl u Ivana Kutila v [Oblakadabra][oblakadabra] a říkal, že denně používám ChatGPT, Gemini a Cursor.

Když si ten rozhovor pustím teď, neslyším v něm architekturu, o které jsme se bavili. Slyším, jak malý byl ten odstavec o AI. A jak velká byla otázka, která s AI neměla skoro nic společného:

> Ok, tohle ten počítač umí, ale co já dokážu z toho počítače vyždímat?

Odkud ta věta je, jsem popsal zvlášť, na osobním blogu, v [Počítačích mého dětství][pocitace]. Tady mě zajímá, co z ní zbývá, když ji položíš na Terraform, GKE a agenty.

Ivanovi děkuju za pozvání. Rozhovor se jmenuje podle firmy, ve které jsem tehdy byl CTO. Už tam nejsem a o té firmě tenhle text není. Vracím se k němu kvůli knoflíkům. Ne kvůli logu.

## Terraform, lifecycle, GKE

Bavili jsme se o cloudu, ale zajímavé nebyly služby na slidech. Zajímavé bylo, kde se točí parametry.

Terraform od prvního dne. Ne protože je to best practice z Twitteru, ale protože bez něj v cloudu zapomeneš na zdroj, který tiše pálí peníze. Stav je kód, diff je review, destroy je záměr. Stejný instinkt jako nenechat si v infrastruktuře bordel z věcí, které „nějak jedou“.

Object storage se neškáluje tím, že koupíš větší disk. Škáluje se politikou.

<details class="peek">
  <summary>
    <span class="peek-label">Lifecycle</span>
    <span class="peek-teaser">dual-region → region → archive · ~40&nbsp;% pryč</span>
  </summary>
  <div class="peek-body">
    <ul>
      <li>0–30 dní: RAW v dual-region (reklamace, výpadek datacentra)</li>
      <li>po 30 dnech: jeden region — Belgie, tehdy nejlevnější v EU</li>
      <li>po 90 dnech: RAW do Archive / Coldline, číst se nemá</li>
      <li>zpracované objekty: dual-region → Nearline po 3 měsících</li>
      <li>náhledy a deriváty: Standard, protože skoro nic nežerou</li>
    </ul>
  </div>
</details>

Nic geniálního. Třídy uložení, TTL, přístupové vzorce. A zhruba 40 % nákladů pryč. To je parametrizace v čisté podobě: rozhodneš, *jak horká* která data jsou, a cloud to dodrží, i když ty spíš.

Stejné myšlení na síti. Pub/Sub a Eventarc ne proto, že „event-driven je moderní“, ale proto, že egress a ingress mezi regiony jsou knoflík, který na faktuře bolí. Když zpracování běží vedle dat, neplatíš za stěhování terabajtů.

Kubernetes jsem v tom rozhovoru nazval švýcarskými hodinkami s ruskou licencí. Pořád si za tím stojím. Nástroj, který umí hrozně moc, a proto ho začínajícímu týmu hned nedám do ruky.

<details class="peek">
  <summary>
    <span class="peek-label">GKE ~2016–2025</span>
    <span class="peek-teaser">certifikáty, Helm, requesty vs. usage, Autopilot</span>
  </summary>
  <div class="peek-body">
    <ul>
      <li>cert-manager: 7–8 YAML souborů a ruční Let's Encrypt → L7 LB s managed certifikátem, ~10 řádků</li>
      <li>Helm: pryč lokální Tiller, dneska chart a values</li>
      <li>HPA/CA škálují podle deklarovaných requestů, ne podle reálného usage</li>
      <li>Autopilot requesty řeší — a může ti pod přesunout na jiný uzel (downtime cca 5–10 s)</li>
    </ul>
  </div>
</details>

Baví mě na tom přesně to, co mě baví na infrastruktuře obecně: vědět, *který* knoflík sahá na *který* problém. Managed certifikát na L7 je správná odpověď, pokud nepotřebuješ ten cert-managerový stupeň kontroly. Autopilot je správná odpověď, pokud přežiješ reschedule. Pokud ne, není. To je práce, která mě baví. Ne „napsat YAML“. *Rozhodnout, jaký YAML.*

*[PLACEHOLDER — screenshot nebo krátký výřez: `google_storage_bucket_lifecycle` v Terraformu, nebo GCS lifecycle JSON. Případně dva sloupce YAML: cert-manager Issuer+Certificate vs. ManagedCertificate. Ne firemní dashboard, ne logo, ne názvy interních služeb.]*

## AI odstavec, který dnes zní jako vtip

A pak jsme se dostali k AI.

Řekl jsem, že ChatGPT, Gemini i Cursor pouštím denně. Na asociace, fakta, nápady, kód. LLM v produkci na věci, které dávaly smysl: sebrat nestrukturované komentáře ve třech jazycích a složit z nich brief; netahat 60MB JPEG/RAW ven z cloudu do cizího API, protože egress je drahý, takže Gemini/Imagen *vedle* bucketu; zkusit Veo 2 a zjistit, že použitelné je zhruba jedno video z osmi. A že by se na to možná hodil druhý agent, který to vyhodnotí — CrewAI jako hypotéza, ne jako pipeline.

<details class="peek">
  <summary>
    <span class="peek-label">Květen 2025</span>
    <span class="peek-teaser">Cursor, ChatGPT, Gemini, „možná CrewAI“</span>
  </summary>
  <div class="peek-body">
    <ul>
      <li>Cursor jako asistent při kódování — autocomplete s kontextem</li>
      <li>ChatGPT a Gemini na hledání asociací a faktů</li>
      <li>LLM na agregaci a překlad nestrukturovaných komentářů</li>
      <li>multimodální model vedle dat, protože egress mimo cloud bolí</li>
      <li>Veo 2: cca 1 z 8 použitelné</li>
      <li>druhý agent na evaluaci — spíš nápad než praxe</li>
    </ul>
  </div>
</details>

Nic z toho nebylo hloupé. Na jaře 2025 to bylo poctivé. Cursor mi pomáhal psát. ChatGPT mi pomáhal hledat. „Agent“ byl ještě věta v budoucím čase. Evaluační smyčka na generované video byla správný instinkt — jenom na to ještě nebyl stroj.

Půl roku nato vyšel Opus 4.5 a Anthropic k tomu napsal, že je to náhled na větší změnu v tom, *jak se práce dělá*. Rok od toho dne tu větu nemusím citovat. Žiju v ní.

## Parametrizace agentů

Nechci z toho dělat „tehdy jsme ještě programovali“. To by byla lež a trochu i urážka. Já jsem *nikdy* nemiloval psaní boilerplate. Miloval jsem skládání systému a hledání knoflíku, který z něj dostane víc.

Agenti mi tu část nesebrali. Sebrali mi část, která mě stejně nebavila.

Psát osm YAML souborů pro cert-manager mě nebavilo. Vědět, že chci managed certifikát na L7 a proč, mě bavilo. Dneska tu první půlku udělá agent a já pořád držím tu druhou. Spíš: držím ji na větší ploše. Můžu si za odpoledne nechat navrhnout šest variant lifecycle politiky, s hrubým modelem nákladů, a pořád musím rozhodnout, která je pravda o byznysu. Reklamace trvá 30 dní nebo 14? Dual-region je paranoia, nebo smlouva? To agent neví.

Stejně jako Autopilot může pod přesunout, agent může přepsat strom souborů. Proto se parametrizují *oni*.

<details class="peek">
  <summary>
    <span class="peek-label">Listopad 2026</span>
    <span class="peek-teaser">skills, hooky, MCP, kdy se zastavit</span>
  </summary>
  <div class="peek-body">
    <ul>
      <li>skills jako znovupoužitelné postupy — IaC pro způsob práce, ne pro cloud</li>
      <li>hooky jako policy: co se smí commitnout, co se musí otestovat, kdy fail-closed</li>
      <li>MCP jako IAM pro nástroje — ne všechny agentovy ruce patří do produkce</li>
      <li>kontext a instrukce jako values.yaml: co je invariant, co je jenom default</li>
      <li>stop-podmínky: kdy se má agent zeptat, místo aby „nějak jel dál“</li>
    </ul>
  </div>
</details>

V květnu 2025 byl Cursor spolujezdec. Dneska pouštím agenty, kteří jedou minuty až hodiny, sahají na soubory, testy, prohlížeč, tickety. Bottleneck není psaní. Bottleneck je specifikace, omezení a vkus — stejné tři věci, které rozhodují, jestli Terraform modul je infrastruktura, nebo jenom YAML, který se náhodou aplikoval.

*[PLACEHOLDER — screenshot: session s agentem, která skládá Terraform / skill / hook. Ideálně viditelné obojí: vygenerovaný lifecycle i instrukce, které ho držely v mantinelech. Tmavý terminál sedí k tématu blogu.]*

A jo, všechno se to hýbe hrozně rychle. Modely, nástroje, názvy, které za čtvrt roku nikdo nepoužívá. To není důvod k nostalgii po jarním Cursoru. To je důvod dělat to, co platí u GKE i u object storage: nesbírat nářadí, ale ptát se, co z něj ještě jde vyždímat.

## Pořád stejná otázka

Kdybych měl z toho rozhovoru nechat jednu větu a zbytek smazat, byla by to ta o vyždímaném počítači. Ne proto, že je chytře řečená. Protože je to popis práce, který přežil změnu stacku, změnu role i změnu toho, kdo ten kód ťuká do editoru.

AI mi tu větu nevzala. Zvětšila mi stroj, na který ji můžu položit.

Kdybyste si ten rozhovor měli pustit, pusťte si ho s tímhle. Ne jako tour po službách. Jako záznam člověka, který rád točí knoflíky — a ještě neví, že za rok a půl bude točit knoflíky u agentů. Železo a bedny jsou v [tom druhém textu][pocitace]. Tady končíme u YouTube.

*[PLACEHOLDER — volitelné: jednoduchá časová osa květen 2025 (podcast) → 24. 11. 2025 (Opus 4.5) → 24. 11. 2026 (tenhle text). Stačí typografie, nemusí to být grafika.]*

Původní díl má zhruba hodinu. Je na [YouTube][yt], [Spotify][spotify] i [Apple Podcasts][apple]. Tady pod článkem je ten první.

<div class="iframe-container">
  <iframe
    class="iframe-responsive"
    title="Oblakadabra #8 — rozhovor s Michalem Šváchou"
    src="https://www.youtube.com/embed/8rgXWvOtb84"
    referrerpolicy="no-referrer-when-downgrade"
    frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowFullscreen
  />
</div>

[opus-45]: https://www.anthropic.com/news/claude-opus-4-5
[oblakadabra]: https://podcasts.apple.com/us/podcast/oblakadabra/id1738482636
[pocitace]: https://blog.svachmic.cz/2026/09/20-pocitace-meho-detstvi/
[yt]: https://www.youtube.com/watch?v=8rgXWvOtb84
[spotify]: https://open.spotify.com/episode/1L398ZKlDlx5pp4oaHCLjV
[apple]: https://podcasts.apple.com/us/podcast/8-google-cloud-v-backbone-kdy%C5%BE-je-parametrizov%C3%A1n%C3%AD-v%C3%A1%C5%A1n%C3%AD/id1738482636?i=1000709533544
