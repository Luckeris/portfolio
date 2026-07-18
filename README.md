# Osobní Portfolio - Jakub Hluško

Zdrojový kód mé osobní vizitky na webu. Původně napsáno v Reactu/Next.js s Tailwindem, následně přepsáno do úplného základu (Vanilla HTML/CSS/JS) pro maximální rychlost a absenci jakýchkoliv buildovacích kroků.

Je to navržené tak, aby to bylo minimalistické, tmavé a inspirované terminálem.

## 🛠️ Tech stack

- **HTML5** (Sémantická struktura)
- **CSS3** (Nativní proměnné, `oklch` barevný prostor pro precizní barvy, responzivní design)
- **Vanilla JavaScript** (Logika pro efekt terminálového psaní a odkrývání prvků při scrollování pomocí `IntersectionObserver`)

## ✨ Zajímavosti kódu

- **Žádné externí knihovny:** Všechny animace a efekty jsou psané od nuly.
- **Terminal Hero:** Dynamicky generovaný textový výstup, který přesně simuluje reálnou prodlevu psaní v bash terminálu.
- **Respektuje systém:** Kód naslouchá na `prefers-reduced-motion`. Pokud má uživatel v OS vypnuté animace, terminál a scrollovací efekty se automaticky zruší a obsah se rovnou vypíše.

## 🚀 Jak to spustit

Stačí stáhnout repozitář, otevřít `index.html` v libovolném webovém prohlížeči a je to.

Nebo se podívej rovnou na živou verzi: **[https://luckeris.github.io/portfolio]**
