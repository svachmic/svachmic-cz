---
layout: post
title: "Co dokážu z toho počítače vyždímat"
description: "Před rokem vyšel Opus 4.5. Půl roku předtím jsem v podcastu říkal, že denně používám Cursor. Vášeň zůstala stejná. Stroj, ze kterého ji ždímám, se změnil."
date: "2026-11-24 10:00:00"
modified: "2026-11-24 10:00:00"
categories: "story"
tags: [czech, ai, agents, engineering]
author: "Michal Švácha"
---

*[PLACEHOLDER — header.jpg: tmavý široký záběr ve stylu blog-dev (fialový akcent #bb05fe). Návrh A: vlevo otevřená béžová bedna / RAM / IDE kabely, vpravo terminál s agentí session. Návrh B: záběr z podcastu oříznutý tak, aby na něm nebyl branding firmy. Návrh C: fotka z dětství u počítače, pokud existuje a nepoužije se v sérii na osobním blogu.]*

Dnes je to přesně rok, co Anthropic pustil [Opus 4.5][opus-45]. Půl roku předtím jsem seděl u Ivana Kutila v [Oblakadabra][oblakadabra] a říkal, že denně používám ChatGPT, Gemini a Cursor.

Když si ten rozhovor pustím teď, neslyším v něm architekturu, o které jsme se bavili. Slyším, jak malý byl ten odstavec o AI. A jak velká byla vášeň, která s AI neměla skoro nic společného.

> Ok, tohle ten počítač umí, ale co já dokážu z toho počítače vyždímat?

Tohle jsem řekl o dětství. Platí to pořád.

## Konfigurace, ne kód

V rozhovoru padne historka, kterou vyprávím pořád: ve čtyřech letech mě rodiče posadili před počítač, přišli za půl hodiny a ten počítač se formátoval. Zásluhu si za to neberu. Formativní bylo něco jiného.

Kluci se honili za míčem a moje ideální odpoledne bylo otevřít bednu a naučit se, jak udělat master-slave se dvěma harddisky. Ne programovat. Skládat. Která karta bude s kterým procesorem fungovat nejlíp, jaké RAMky, kolik musí mít cache. *Tohle ten počítač umí. Co z něj dokážu vyždímat?*

*[PLACEHOLDER — photo: já u počítače v dětství, nebo otevřená 486 / Athlon. Pokud do listopadu vyjde [Počítače mého dětství](https://blog.svachmic.cz/2026/09/20-pocitace-meho-detstvi/), odkázat sem a fotku neopakovat.]*

Na vejšce mě chytlo programování, to jo. Ale to, co dělám teď — a co mě na tom baví nejlíp — pořád víc sedí na tu klukovskou konfiguraci než na psaní aplikací. Terraform, lifecycle politiky, knoflíky v Kubernetes. Stejná otázka, jiný stroj.

Ivanovi děkuju za pozvání. Rozhovor se jmenuje podle firmy, ve které jsem tehdy byl CTO. Už tam nejsem a o té firmě tenhle text není. Vracím se k němu kvůli tomu, *jak* jsem v něm popsal práci. Ne kvůli *kde*.

## Co z toho rozhovoru chci podržet

Bavili jsme se o cloudu, ale zajímavé nebyly služby na slidech. Zajímavé bylo, kde jsem točil knoflíky.

Terraform od prvního dne. Ne protože je to best practice z Twitteru, ale protože bez něj v cloudu zapomeneš na zdroj, který ti tiše pálí peníze. Všecko přehledné, kódem dané, verze se dají spravovat. Stejný instinkt jako nenechat si v bedně bordel z karet, které „nějak jedou“.

Lifecycle na object storage. Prvních 30 dní dual-region, protože reklamace a výpadky jsou reálné. Pak jeden region. Pak archive. Zpracované věci jinam než RAW. Náhledy ať zůstanou ve standardu, stejně skoro nic nežerou. Nic geniálního. Parametrizace. A zhruba 40 % nákladů pryč.

Kubernetes jsem v tom rozhovoru nazval švýcarskými hodinkami s ruskou licencí. Pořád si za tím stojím. Nástroj, který umí hrozně moc, a proto ho začínajícímu týmu hned nedám do ruky. Baví mě na něm přesně to, co mě bavilo na železe: vědět, *který* knoflík sahá na *který* problém. Certifikáty, které dřív chtěly 7 YAML souborů, dneska 10 řádků. Autoscaling podle requestů, ne podle reálného usage. Autopilot, který ti pod rukama přehodí pod. To je práce, která mě baví. Ne „napsat YAML“. *Rozhodnout, jaký YAML.*

*[PLACEHOLDER — screenshot nebo krátký výřez: Terraform resource / GCS lifecycle JSON. Ne firemní dashboard, ne logo, ne názvy interních služeb. Jde o knoflíky, ne o produkt.]*

Tohle je jádro. Ne stack. Ne značka cloudu. Otázka z dětství položená infrastruktuře.

## AI odstavec, který dnes zní jako vtip

A pak jsme se dostali k AI.

Řekl jsem, že ChatGPT, Gemini i Cursor pouštím denně. Na asociace, fakta, nápady, kód. V práci se tehdy LLM používaly na věci, které dávaly smysl: sebrat komentáře ve třech jazycích a udělat z nich brief; netahat 60MB fotky ven z cloudu, protože egress je drahý; zkusit generovat video a zjistit, že použitelné je zhruba jedno z osmi. A že by se na to možná hodil druhý agent, který to vyhodnotí.

<details class="peek">
  <summary>
    <span class="peek-label">Květen 2025</span>
    <span class="peek-teaser">Cursor, ChatGPT, Gemini, „možná CrewAI“</span>
  </summary>
  <div class="peek-body">
    <ul>
      <li>Cursor jako asistent při kódování</li>
      <li>ChatGPT a Gemini na hledání asociací a faktů</li>
      <li>LLM na agregaci a překlad nestrukturovaných komentářů</li>
      <li>multimodální model vedle dat, protože egress mimo cloud bolí</li>
      <li>generované video: cca 1 z 8 použitelné</li>
      <li>druhý agent na evaluaci — spíš nápad než praxe</li>
    </ul>
  </div>
</details>

Nic z toho nebylo hloupé. Na jaře 2025 to bylo poctivé. Cursor mi pomáhal psát. ChatGPT mi pomáhal hledat. „Agent“ byl ještě věta v budoucím čase.

Půl roku nato vyšel Opus 4.5 a Anthropic k tomu napsal, že je to náhled na větší změnu v tom, *jak se práce dělá*. Rok od toho dne tu větu nemusím citovat. Žiju v ní.

## Stejná otázka, jiný stroj

Nechci z toho dělat „tehdy jsme ještě programovali“. To by byla lež a trochu i urážka. Já jsem *nikdy* nemiloval psaní boilerplate. Miloval jsem skládání systému a hledání knoflíku, který z něj dostane víc.

Agenti mi tu část nesebrali. Sebrali mi část, která mě stejně nebavila.

Psát osm YAML souborů pro cert-manager mě nebavilo. Vědět, že chci managed certifikát na L7 a proč, mě bavilo. Dneska tu první půlku udělá agent a já pořád držím tu druhou. Spíš: držím ji na větší ploše. Můžu si za odpoledne nechat navrhnout šest variant lifecycle politiky, s hrubým modelem nákladů, a pořád musím rozhodnout, která je pravda o byznysu. Reklamace trvá 30 dní nebo 14? Dual-region je paranoia, nebo smlouva? To agent neví. To je pořád ta samá práce, kvůli které jsem otevíral bednu.

*[PLACEHOLDER — screenshot: agentí session (Claude Code / Cursor agent), která něco skládá — Terraform, skill, hook, MCP. Ne „AI umí kód“, ale „já parametrizuju stroj, který parametrizuje stroj“. Tmavý terminál sedí k tématu blogu.]*

Rozdíl je v měřítku a v rychlosti. V květnu 2025 byl Cursor spolujezdec. Dneska pouštím agenty, kteří jedou minuty až hodiny, sahají na soubory, testy, prohlížeč, tickety. Parametrizuju *je*: skills, hooky, kontext, co smí a nesmí, kdy se mají zastavit a zeptat. Master-slave dvou disků, akorát disky teď přemýšlejí.

A jo, všechno se to hýbe hrozně rychle. Modely, nástroje, názvy, které za čtvrt roku nikdo nepoužívá. To není důvod k nostalgii po jarním Cursoru. To je důvod dělat to, co jsem dělal vždycky: nesbírat nářadí, ale ptát se, co z něj ještě jde vyždímat.

## Pořád to samé odpoledne

Kdybych měl z toho rozhovoru nechat jednu větu a zbytek smazat, byla by to ta o vyždímaném počítači. Ne proto, že je chytře řečená. Protože je to popis práce, který přežil změnu stacku, změnu role i změnu toho, kdo ten kód ťuká do editoru.

AI mi tu větu nevzala. Zvětšila mi stroj, na který ji můžu položit.

Kdybyste si ten rozhovor měli pustit, pusťte si ho s tímhle. Ne jako tour po službách. Jako záznam člověka, který rád točí knoflíky — a ještě neví, že za rok a půl bude točit knoflíky u agentů.

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
[yt]: https://www.youtube.com/watch?v=8rgXWvOtb84
[spotify]: https://open.spotify.com/episode/1L398ZKlDlx5pp4oaHCLjV
[apple]: https://podcasts.apple.com/us/podcast/8-google-cloud-v-backbone-kdy%C5%BE-je-parametrizov%C3%A1n%C3%AD-v%C3%A1%C5%A1n%C3%AD/id1738482636?i=1000709533544
