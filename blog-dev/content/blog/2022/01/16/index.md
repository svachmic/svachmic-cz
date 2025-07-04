---
layout: post
title:  "Firestore a Firebase Storage rules snadno a rychle"
description: "Jak nastavit pravidla přístupu pro Firestore a Firebase Storage a strukturu dat tak, abychom se nestříleli do vlastní nohy."
date: "2022-01-16 18:00:00"
categories: "tutorial"
tags: [czech, firebase, firestore, acl]
author: "Michal Švácha"
---

Práce s Firebase je super, obzvlášť na hobby projekty. Je potřeba minimální nastavování infrastruktury, všechno funguje téměř out-of-the-box, máte k dispozici lokální emulátor většiny[^1] komponent Firebase a k tomu obří komunitu na [StackOverflow][so_community] a [Slacku][slack]. Co víc si přát?

[so_community]: https://stackoverflow.com/questions/tagged/firebase
[slack]: https://firebase.community/

Možná obecně "čas" na hobby projekty, ale to je mimo rozsah tohoto příspěvku...

[^1]: Compound queries do Firestore vyžadující nastavení indexů na kolekci lokálně projdou ale v produkci spadnou.

Prototypování jde od ruky, na všechno jsou SDKčka a dá se celkem rychle dostat z 0 na 1. Teda na 0.999 (~ téměř 1, ale ne tak docela). Poslední krok je po sobě uklidit předtím, než vám "běžný franta uživatel" udělá v datech totální paseku svým chováním ve vaší aplikaci. Nebo nedejbože nějaký floutek pokusí různé techniky k přístupu cizích dat. Jelikož je Firebase serverless platforma, spoustu byznys logiky je třeba implementovat na klientech. 

Například čtení uživatelského dokumentu z Firestore lze udělat takto:

```swift
db.collection("users")
    .whereField("id", isEqualTo: userId)
    .addSnapshotListener { (snapshot, _) in
        // procesování dat
    }
```

Pro dostání se z bodu A do bodu B je to fantazie - nemusím na všechno psát API endpointy, aplikace si s tím poradí. Chyba lávky. Nejenom, že si tímhle přečtu svoje data z databáze, já si tím dokonce přečtu **všechna** data z databáze.

> Firestore Rules vstoupily do místnosti.

## ❌ Zabezpečení kolekce uživatelů #1

Naštěstí tedy existuje způsob, jak data zabezpečit tak, aby byly přístupné jen jejich majitelům. Po přečtení několika článků v rámci [dokumentace][firestore_documentation] jsem přistoupil k jednoduchému řešení:

[firestore_documentation]: https://firebase.google.com/docs/firestore/security/overview

```javascript
rules_version = '2';
service cloud.firestore {
    match /databases/{database}/documents {
        match /users/{user} {
            allow read: if isSignedIn() 
              && request.auth.uid == resource.data.id;
        }
    }

    function isSignedIn() {
        return request.auth != null;
    }
}
```

Snažím se tu docílit toho, že když přistupuji k dokumentu v kolekci `users`, tak kontroluji, zda ID uživatele v tokenu odpovídá ID uloženému v dokumentu. Pro jednoduchost řekněme, že jeden dokument uživatele vypadá takto:

| Name    | Value  |
|:-------:|:------:|
| id      | string |
| email   | string |
| records | array  |

Jednoduchá řešení jsou krásná v tom, že jsou jednoduchá. Nicméně jak bylo krásné, tak bylo k ničemu. Proč? Protože k přečtení dokumentu a porovnání IDček nemá uživatel dostatečná práva...

<div style="width: 100%; height: 0; padding-bottom: 55%; position: relative">
  <iframe
    src="https://giphy.com/embed/d3mlE7uhX8KFgEmY"
    width="100%"
    height="100%"
    style="position: absolute"
    frameborder="0"
    class="giphy-embed"
    allowfullscreen
  ></iframe>
</div>
<p>
  <a href="https://giphy.com/gifs/culture--think-hmm-d3mlE7uhX8KFgEmY"
    >via GIPHY</a
  >
</p>

## ✅ Zabezpečení kolekce uživatelů #2

Zpátky na stromy! Tak co teď? Kde udělali soudruzi z NDR chybu? Ve struktuře dat! Problém je v tom, že ve skutečnosti je způsob, jak data (ne)číst a přitom zařídit správné nastavení ACL. Tak jak na to?

Vytvořit dokument v kolekci lze dvěma způsoby (příklad je z pohledu Node.js funkce):

```typescript
firestore().collection("users").add(newUser);
```

a nebo:

```typescript
firestore().collection("users").doc(newUserId).set(newUser);
```

První verze vytvoří dokument s automaticky vygenerovaném ID, druhý vytvoří dokument s daným ID. Druhý přístup má dva zásadní problémy:

1. Pokud předem nezkontrolujete (ne)existenci klíče v kolekci, přepíšete cokoliv co tam předtím bylo.
2. Vlastnoručně generovaná ID nemusí nutně mít lepší entropii (nebo kvalitu obecně) než automaticky generovaná.

První problém má jednoduché řešení (opět z pohledu Node.js funkce):

```typescript
async userExists(id: string): Promise<boolean> {
    const userDocument = await firestore().collection("users").doc(id).get();
    return userDocument.exists;
}
```

Druhý problém je vyřešen díky Firebase Auth - každý uživatel bude mít unikátní UID generováno na podobném principu jako ID pro dokumenty (win-win).

Dobře a co teď s tím? Vezměme si předchozí nástřel a upravme jej podle posledních změn ve struktuře dat:

```javascript
match /users/{user} {
    allow read: if isSignedIn() && request.auth.uid == user;
}
```

A první boss je poražen! Dokonce už ani nemusíme dělat query `.whereField("id", isEqualTo: userId)` a přistupovat k dokumentu napřímo, jelikož uživatelovo ID je zároveň ID dokumentu. Fajn, tak co tam máme dál?

## Zabezpečení kolekce přiřazených záznamů

Další krok je zabezpečení kolekce se záznamy, které jsou přiřazeny uživatelům (malý počet - např. se může jednat o seznam zařízení, kde je uživatel přihlášen). V tabulce uvedené výše se jedná o položku `records` - pole s IDčkama záznamů v jiné tabulce. Poučen z předchozích nezdarů jsem nejprve zmigroval pole z interních IDček na ID jednotlivých dokumentů v kolekci `records`.

> ⚠️ POZOR! Firestore nabízí jako jeden z typů pro hodnoty v dokumentu `Reference`. Tento typ není pro naše účely vhodný, neboť se jedná o absolutní cestu k dokumentu. My potřebujeme **pouze** ID dokumentu.

Následně jsem přidal nové pravidlo:

```javascript
match /records/{record} {
    allow read: if isSignedIn() 
        && resource.id in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.records;
}
```

Přichází ale komplikace - jak tato data číst na klientech? Doteď jsme je četli takto:

```swift
db.collection("records")
    .whereField("id", in: recordIds)
    .addSnapshotListener { (snapshot, _) in
        // procesování dat
    }
```

Ale zase bychom se vraceli zpátky k tomu, že čteme **OBSAH** dokumentu. Pakliže se nachází v kolekci alespoň jeden dokument, ke kterému podle pravidel nemáme přístup, nemůžeme dělat query podle vnitřních hodnot. 

> "A teď jedna kontrolní soudruzi...jakpak se bude taková query chovat, když budeme porovnávat ID dokumentů, tedy nikoliv jejich obsah?"
> 
> Bingo.

```swift
db.collection("records")
    .whereField(FieldPath.documentID(), in: recordIds)
    .addSnapshotListener { (snapshot, _) in
        // procesování dat
    }
```

Překvapivě tohle vůbec není zmíněno v dokumentaci - zakopnul jsem o to náhodou na [StackOverflow][stackoverflow]. Co ale v dokumentaci je, je upozornění, že ve funkci `whereField:in:` je možno pouze vložit pole **o maximální délce 10**. To není moc a proto je třeba brát v potaz, zda není lepší pro větší počet přiřazených záznamů udělat subkolekci. V mém případě mi doména dovoluje použít pouze pole, neboť počet záznamů nepřekročí limit 10ti. Důležité ale teď je, že to jede a kolekce jsou zabezpečené. Druhý boss poražen. Čas na posledního.

[stackoverflow]: https://stackoverflow.com/a/52252264
[firestore_limitation]: https://firebase.google.com/docs/firestore/query-data/queries#query_limitations

## Zabezpečení dat ve Storage

Posledním dílkem skládačky je Firebase Storage - bucket na jakákoliv data, v mém případě na profilové obrázky. Opět jsem hrál trochu ping-pong s rozdělením dat do podsložek, než jsem přišel na to, co bude pro mé účely fungovat nejlíp. Iterace byly následující:

1. `/user_image/{id}/image.jpg`
2. `/{id}/user_image/image.jpg`
3. `/users/{id}/user_image/image.jpg`

Iterace 1 nevyhovala protože pro každý další typ souboru patřící uživateli by muselo být další pravidlo. Iterace 2 nevyhovovala protože kořen bucketu by se s počtem uživatelů znepřehlednil pro cokoliv jiného než privátní uživatelská data. Iterace 3 řeší oba problémy dostatečně dobře.

```javascript
rules_version = '2';
service firebase.storage {
    match /b/{bucket}/o {
        match /users/{user}/{filepath=**} {
            allow read, write: if isSignedIn() && request.auth.uid == user;
        }
    }

    function isSignedIn() {
        return request.auth != null;
    }
}
```

Jediný problém je, že teď si může uživatel do své složky nahrát cokoliv. Ale to je možná na další příspěvek. Ať si tam nahrává třeba Inception v 4K. Hlavně, že to nemůže měnit ostatním uživatelům.

Závěrem bych chtěl jen zmínit, že oceňuji, že tým Firebase releasnul fajn video o zabezpečení Firebase dat. Týden potom, co jsem to rozluštil sám. Ale tak říká se, že "the path is the destination", že ano.

<div class="iframe-container">
  <iframe
    class="iframe-responsive"
    title="What doesn't kill you makes you stronger."
    src="https://www.youtube.com/embed/TglPc74M3DM"
    frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowFullscreen
  />
</div>
