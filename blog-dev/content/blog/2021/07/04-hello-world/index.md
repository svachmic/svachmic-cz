---
layout: post
title:  "Hello World!"
description: "echo \"Hello World\" >> /dev/null"
date: "2021-07-04 18:00:00"
categories: "story"
tags: [czech, kotlin]
---

Nevím kdy jsem napsal svůj první "Hello World!" program. Asi to bylo na [gymplu][gymvod] v Pascalu na hodinách IVTčka. Nebo to mohla být jedna z prvních webových stránek co jsem bouchal v MS FrontPage nebo Dreamweaveru. Zato si ale pamatuju, kdy jsem napsal svůj zatím poslední Hello World, který je nasazený v produkci:

```kotlin
@GetMapping(
    value = ["/hello"],
    produces = [Constants.V1.json],
)
fun hello(principal: Principal): MessageDTO {
    val message = "Hello, ${principal.name}!"
    return MessageDTO(message)
}
```

Endpoint žije na naší core službě a používáme ho pro verifikaci nasazení nové služby v rámci systému. Pozdrav znamená, že základní potřeby nové služby byly uspokojeny. To jest:

- Networking - nová služba je nasazená ve správném segmentu VPC a dosáhne na core službu.
- Autentizace - nová služba se správně napojila na autentizační server a zavolala core službu se správným tokenem.
- Sanity check - nová služba má správné jméno.

Zkrátka to je takový integrační test. Ale ne všechny Hello World-y, které jsem kdy napsal měly účel - většina z nich byla jen první nadšení z nového jazyka po kterém následovalo smazání a návrat k práci. Stejně je ale na nové platformě, jazyku nebo frameworku něco magickýho - "vůně čerstvého projektu" - nikdo ještě nepoložil základy a já jsem ten první, kdo si tu něco vyryje do historie. Taková obdoba ["Kilroy was here"][kilroy]. A tenhle příspěvek je něco obdobného.

Můžete se ptát - co ten název? Inspirace je z Linuxu, tedy konkrétně `/dev/null`. Co to je a k čemu to slouží přenechám k vysvětlení [někomu jinému][linuxhint]. Ale ve zkratce tedy stejně jako do `/dev/null` odhazujeme vše, co nás nezajímá, já si do `/dev/svachmic` odložím vše, co shledám zajímavým a možná se k tomu někdy vrátím. A možná ne.

[gymvod]: https://gymvod.cz/
[kilroy]: https://en.wikipedia.org/wiki/Kilroy_was_here
[linuxhint]: https://linuxhint.com/what_is_dev_null/