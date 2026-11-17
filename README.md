# nCore – Open in Nuvio

Userscript, ami az nCore-on a filmekhez és sorozatokhoz két gombot tesz:

- **Nuvio logó** – megnyitja a címet a [Nuvio](https://github.com/NuvioMedia) appban az IMDb-azonosító alapján (`nuvio://meta?type=movie&id=tt…`).
- **StremHU ikon** – pontosan azt az nCore-torrentet nyitja meg Nuvióban a [StremHU Source](https://github.com/s4pp1/stremhu-source) addonon keresztül (`nuvio://meta?type=movie&id=stremhu-source:ncore:<torrent-id>`).

A torrentlistában és a torrent adatlapján is működik.

## Telepítés

1. Telepíts egy userscript-kezelőt:
   - **Asztali gép:** [Violentmonkey](https://violentmonkey.github.io/) vagy [Tampermonkey](https://www.tampermonkey.net/) (Chrome/Edge alatt a bővítményeknél a *Fejlesztői mód* is kell).
   - **Android:** lásd [lent](#android).
2. Nyisd meg: **[ncore-open-in-nuvio.user.js](https://raw.githubusercontent.com/emgeje/ncore-open-in-nuvio/main/ncore-open-in-nuvio.user.js)** – a kezelő felajánlja a telepítést.

A script a repóból automatikusan frissül.

### Android

Androidon a **Firefox** böngészőben fut a script, mert a Firefox támogatja a **Violentmonkey** kiegészítőt. A Chrome Androidon nem kezel kiegészítőket.

1. Telepítsd a [Firefoxot](https://play.google.com/store/apps/details?id=org.mozilla.firefox) a Play Áruházból.
2. Firefoxban: menü (⋮) → **Kiegészítők** → **Violentmonkey** → hozzáadás.
3. Firefoxban nyisd meg a [script linkjét](https://raw.githubusercontent.com/emgeje/ncore-open-in-nuvio/main/ncore-open-in-nuvio.user.js), és a Violentmonkey felajánlja a telepítést.
4. Az nCore-on a gombra koppintva a Firefox megkérdezi, hogy megnyissa-e a Nuviót – engedélyezd.

## Melyik sorok kapnak gombot

| Kategória | nCore kód | Típus |
| --- | --- | --- |
| Film SD / HD (HU és idegen) | `xvid`, `xvid_hun`, `hd`, `hd_hun` | film |
| Sorozat SD / HD (HU és idegen) | `xvidser`, `xvidser_hun`, `hdser`, `hdser_hun` | sorozat |
| XXX SD / HD | `xxx_xvid`, `xxx_hd` | film |

DVD-k, programok, játékok, zene, könyvek stb. nem kapnak gombot. Ha egy sor kategóriája nem olvasható ki, a script csak akkor tesz gombot, ha van IMDb-link, és a release névből (`S01`, `S01E05`, „évad”) dönti el, hogy sorozat-e.

## Követelmények

- **Nuvio**, ami kezeli a `nuvio://` linkeket (Android TV, macOS asztali kliens).
- **Windows alatt szükséges lehet egy registry-bejegyzés**, mert a Nuvio nem mindig regisztrálja a `nuvio://` linkeket – lásd [lent](#windows-nuvio-linkek-regisztrálása).
- A StremHU gombhoz a **StremHU Source** addon telepítve a Nuvióban, nCore-fiókkal.

A Nuvio a linkből az adatlapot nyitja meg, lejátszást nem indít automatikusan.

## Windows: nuvio:// linkek regisztrálása

A Windowsos Nuvio nem mindig regisztrálja magát a `nuvio://` linkekhez, ilyenkor a gombokra kattintva nem történik semmi.

**Ellenőrzés:** Win+R → `nuvio://meta?type=movie&id=tt0133093` → Enter. Ha megnyílik a Nuvio a Mátrix adatlapjával, nincs teendő.

**Ha nem nyílik meg:**

1. Töltsd le valamelyik registry-fájlt (a linkre jobb klikk → *Hivatkozás mentése másként*):
   - [`nuvio-protocol.reg`](https://raw.githubusercontent.com/emgeje/ncore-open-in-nuvio/main/windows/nuvio-protocol.reg) – a link elindítja a Nuviót. Ha a Nuvio már fut, **új példány** nyílik.
   - [`nuvio-protocol-restart.reg`](https://raw.githubusercontent.com/emgeje/ncore-open-in-nuvio/main/windows/nuvio-protocol-restart.reg) – a link bezárja a futó Nuviót, és a megadott címmel újranyitja. Az épp futó lejátszás megszakad, és egy pillanatra felvillanhat egy PowerShell-ablak.
2. A fájlok a `C:\Program Files\Nuvio\Nuvio.exe` útvonalat használják. Ha nálad máshol van (Start menü → jobb klikk a Nuvióra → *Fájl helyének megnyitása*), nyisd meg a fájlt Jegyzettömbben, és írd át. Az útvonalban a `\` jeleket duplán kell írni.
3. Ellenőrizd Jegyzettömbben, hogy a fájl első sora `Windows Registry Editor Version 5.00` – ha HTML-kódot látsz, a GitHub-oldalt mentetted el, nem a fájlt. Kattints duplán a fájlra, és engedélyezd a beírást. Rendszergazdai jog nem kell, csak a saját felhasználódra vonatkozik.
4. Próbáld újra a Win+R-es ellenőrzést.

A `restart` változatnál, ha a Nuvio nem záródik be, a folyamat neve nem `Nuvio` – a pontos nevet a Feladatkezelő *Részletek* fülén látod, ezt írd a `-Name` után.

**Eltávolítás:** Win+R → `regedit` → töröld a `HKEY_CURRENT_USER\Software\Classes\nuvio` kulcsot.

## Megjegyzés

Nem hivatalos projekt, nincs kapcsolatban az nCore, a Nuvio vagy a StremHU fejlesztőivel. A logók a saját tulajdonosaiké, és az eredeti repóikból töltődnek be.

## Licenc

MIT
