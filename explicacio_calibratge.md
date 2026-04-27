# Calibratge per correspondència de punts — explicació detallada

Aquest document explica pas a pas l'apartat 2.2.3 de la memòria, amb un nivell de detall pensat per a algú que no és matemàtic. L'objectiu és que entenguis **què està passant** i **per què cada pas té sentit**, no només les fórmules.

---

## 1. El problema en una frase

Tens dos sistemes de coordenades diferents — el de Motive i el d'Unity — i necessites una recepta automàtica que digui:

> "Aquest punt que Motive em diu que està a (1.10, 0.82, 2.30) en realitat correspon a aquesta posició a Unity: (0.7, 1.145, 0.365)."

Aquesta recepta és el que matemàticament en diuen una **transformació rígida**. "Rígida" vol dir que **no deforma res**: només gira i mou el núvol de punts, però no l'estira ni l'encongeix. És el que faries si agafessis un objecte amb la mà i el reposicionessis a una altra banda de la taula sense doblegar-lo.

---

## 2. Què és $R$ i què és $\mathbf{t}$

La transformació rígida té dues parts:

- **$R$** és una **rotació**. És una matriu de 3×3 (9 números) que diu *com cal girar el núvol de punts*. Imagina'l com el "comandament" que diu: "gira tot 30° a l'esquerra i 10° amunt".
- **$\mathbf{t}$** és una **translació**. És un vector de 3 components $(t_x, t_y, t_z)$ que diu *quant cal desplaçar el núvol després d'haver-lo girat*. És com dir: "ara mou-ho 50 cm cap a la dreta i 20 cm cap amunt".

La fórmula

$$\mathbf{p}_{\mathrm{unity}} = R\,\mathbf{p}_{\mathrm{motive}} + \mathbf{t}$$

es llegeix com una recepta de dos passos: **(1)** agafa el punt de Motive, **(2)** gira'l amb $R$ i **(3)** suma-li $\mathbf{t}$. El resultat és la posició equivalent a Unity.

### Per què 9 + 3 = 12 números?

Una transformació rígida en 3D té **6 graus de llibertat**:
- 3 per a la rotació (rotar al voltant de l'eix X, Y i Z).
- 3 per a la translació (moure en X, Y, Z).

Aleshores per què la matriu $R$ té 9 números? Perquè els 9 números no són independents: hi ha restriccions internes que imposen que sigui una rotació "vàlida" (les columnes han de ser perpendiculars i de longitud 1, i el determinant ha de ser +1). Al final, només 3 d'aquests 9 números són realment lliures.

---

## 3. Què tinc per estimar-ho

Per trobar $R$ i $\mathbf{t}$ no n'hi ha prou amb mirar el llistat: necessito **dades**. Concretament necessito **punts apariats**: punts que sé que són els mateixos vistos des dels dos sistemes.

Per això poso 4 marcadors a les cantonades de la taula. Tinc:

| Punt | Unity ($\mathbf{q}_i$) | Motive ($\mathbf{p}_i$) |
|------|------------------------|-------------------------|
| 1 | (0.7, 1.145, 0.365) | (1.10, 0.82, 2.30) |
| 2 | (-0.7, 1.145, 0.365) | (-0.30, 0.82, 2.30) |
| 3 | (0.7, 1.145, 1.035) | (1.10, 0.82, 1.60) |
| 4 | (-0.7, 1.145, 1.035) | (-0.30, 0.82, 1.60) |

(Els valors de Motive són inventats per a l'exemple — a la pràctica els llegeixo del sistema en aquell moment.)

A Unity els conec exactament perquè jo mateix he definit on són les cantonades de la taula virtual. A Motive els llegeixo de l'OptiTrack quan poso els marcadors físics damunt les quatre cantonades.

**El problema** és: trobar la $R$ i la $\mathbf{t}$ que, aplicades als $\mathbf{p}_i$, em donen el més a prop possible dels $\mathbf{q}_i$.

---

## 4. Per què és un problema de "mínims quadrats"

A la pràctica mai no és perfecte. Hi ha soroll a Motive, els marcadors mai no estan exactament a la cantonada teòrica, etc. Per tant, **no hi haurà cap $R, \mathbf{t}$ que faci coincidir tots els punts perfectament**.

El que faig és buscar les $R, \mathbf{t}$ que **minimitzen l'error total** segons aquesta fórmula:

$$\min_{R,\,\mathbf{t}} \;\sum_{i=1}^{N} \bigl\| R\,\mathbf{p}_i + \mathbf{t} - \mathbf{q}_i \bigr\|^2$$

Llegit en català: *"per a cada parell de punts, calcula la distància entre el punt de Motive transformat i el de Unity, eleva-la al quadrat, i suma-ho tot. Tria les $R, \mathbf{t}$ que facin aquesta suma més petita."*

### Per què al quadrat?

Tres motius:

1. **Penalitza més els errors grans**: un error de 5 cm dóna 25, però un error de 1 cm dóna només 1. Així s'evita una solució que tingui un sol punt molt mal alineat.
2. **Mai és negatiu**: si no quadrés, errors positius i negatius podrien cancel·lar-se i donar-te una "il·lusió" d'error zero.
3. **Té solució analítica tancada**: amb el quadrat el problema es pot resoldre en un sol pas, sense iteracions.

---

## 5. El truc del centroide

Aquí ve la idea més bonica del mètode. Tornem al problema:

> *Trobar $R$ i $\mathbf{t}$ alhora és complicat perquè estan acoblades.*

Què vol dir "acoblades"? Que si jo canvio l'origen del sistema, també em canvia la rotació òptima. Imagina que tens dos núvols de punts amb forma de cor, un al nord i un al sud. Si vols superposar-los necessites moure el del sud cap al nord (translació) i potser girar-lo (rotació). Però el centre exacte sobre el qual girar **depèn** d'on hagis decidit que és l'origen. Translació i rotació es contagien.

**El truc**: si primer **centro tots dos núvols a l'origen**, la translació desapareix del problema. Aleshores només he de buscar la rotació, que és una cosa molt més concreta.

### Com es centra un núvol?

Calculo el seu **centroide**, que no és més que la mitjana de tots els seus punts:

$$\bar{\mathbf{p}} = \frac{1}{N}\sum_{i=1}^{N} \mathbf{p}_i$$

Per als 4 punts de Motive de l'exemple:

$$\bar{\mathbf{p}} = \frac{(1.10) + (-0.30) + (1.10) + (-0.30)}{4},\;\;\frac{0.82 \cdot 4}{4},\;\;\frac{2.30 + 2.30 + 1.60 + 1.60}{4}$$

$$\bar{\mathbf{p}} = (0.40, \; 0.82, \; 1.95)$$

És el punt "mitjà" dels quatre marcadors a Motive. Faig el mateix per a Unity:

$$\bar{\mathbf{q}} = (0, \; 1.145, \; 0.7)$$

I ara **resto el centroide a tots els punts**:

| Punt | $\tilde{\mathbf{p}}_i = \mathbf{p}_i - \bar{\mathbf{p}}$ | $\tilde{\mathbf{q}}_i = \mathbf{q}_i - \bar{\mathbf{q}}$ |
|------|---|---|
| 1 | (0.70, 0.00, 0.35) | (0.7, 0, -0.335) |
| 2 | (-0.70, 0.00, 0.35) | (-0.7, 0, -0.335) |
| 3 | (0.70, 0.00, -0.35) | (0.7, 0, 0.335) |
| 4 | (-0.70, 0.00, -0.35) | (-0.7, 0, 0.335) |

Fixa-t'hi: ara els dos núvols estan **centrats a l'origen** (la suma de cada columna dóna zero) i tenen exactament la mateixa forma —un rectangle pla. L'única diferència és **com estan orientats**.

---

## 6. Trobar la rotació: l'algorisme de Kabsch

Ara que el problema s'ha simplificat a "quina rotació porta el primer rectangle al segon", l'**algorisme de Kabsch** ens dóna la resposta exacta en tres passos.

### Pas 1: la matriu $H$ (covariància creuada)

Construeixo una matriu de 3×3 fent una "barreja" entre els dos núvols centrats:

$$H = \sum_{i=1}^{N} \tilde{\mathbf{p}}_i \, \tilde{\mathbf{q}}_i^{\top}$$

El símbol $\tilde{\mathbf{q}}_i^{\top}$ vol dir "el vector $\tilde{\mathbf{q}}_i$ posat horitzontal en lloc de vertical". El producte $\tilde{\mathbf{p}}_i \tilde{\mathbf{q}}_i^{\top}$ és una matriu 3×3 que codifica com es relacionen les coordenades dels dos punts. Sumant aquestes matrius per tots els parells obtinc $H$, que conté **tota la informació sobre com els dos núvols estan girats l'un respecte de l'altre**.

Pensa-ho així: $H$ és com una "empremta digital" que captura la diferència d'orientació entre els dos núvols en una única matriu.

### Pas 2: la SVD

La **SVD** (descomposició en valors singulars) és una operació matemàtica molt potent: agafa qualsevol matriu i la descompon en tres matrius:

$$H = U \Sigma V^{\top}$$

Pots imaginar-t'ho així:
- **$U$** i **$V$** són dues rotacions (matrius ortogonals).
- **$\Sigma$** és una matriu diagonal amb tres números no negatius (els "valors singulars") que diuen *quant s'estira* en cada direcció.

És a dir, qualsevol transformació es pot descompondre en: girar → estirar/encongir → tornar a girar. Per al nostre problema, només ens interessen $U$ i $V$ — les rotacions — perquè volem ignorar qualsevol "estirament" (recorda: rígida vol dir sense estiraments).

A la pràctica no et cal calcular la SVD a mà; qualsevol llibreria (NumPy, MATLAB, Unity Mathematics) la fa per tu en una línia.

### Pas 3: la fórmula final

La rotació òptima és:

$$R = V D U^{\top}$$

on $D$ és gairebé la identitat:

$$D = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & \det(VU^{\top}) \end{pmatrix}$$

#### Per què aquesta $D$?

Aquí ve un detall subtil. La fórmula $R = VU^{\top}$ (sense la $D$) **gairebé sempre** funciona. Però hi ha un risc: a vegades el resultat surt amb determinant $-1$ en lloc de $+1$.

- $\det(R) = +1$ → **rotació pròpia** (com girar un objecte físic).
- $\det(R) = -1$ → **reflexió** (com un mirall: gira *i a més inverteix*).

Una reflexió és com si, en lloc de girar el cor, el reflectissis com en un mirall i et quedés un cor cap enrere. Això **mai no l'has volgut**, perquè no té cap sentit físic: no pots "reflectir" un núvol de marcadors d'OptiTrack.

La $D$ es posa exactament per detectar aquest cas: si $\det(VU^{\top}) = -1$, la $D$ inverteix el signe de l'última columna, cosa que converteix la reflexió en una rotació pròpia. Si $\det(VU^{\top}) = +1$, la $D$ és la identitat i no fa res.

És un guard de seguretat. En el nostre cas és especialment important perquè **estem treballant entre un sistema dextrogir (Motive) i un de levogir (Unity)** — sense aquesta correcció el càlcul podria voler "barrejar" la diferència de quiralitat dins de la rotació, cosa que no volem (la quiralitat ja l'hem corregit per separat invertint la X abans del calibratge).

---

## 7. Recuperar la translació

Una vegada tinc $R$, recupero $\mathbf{t}$ tornant a posar els centroides a lloc:

$$\mathbf{t} = \bar{\mathbf{q}} - R\,\bar{\mathbf{p}}$$

La intuïció: he girat el núvol de Motive amb $R$, i ara aquest núvol girat hauria d'estar centrat al centroide de Unity. La translació és exactament la diferència entre on és el centroide girat de Motive ($R \bar{\mathbf{p}}$) i on hauria d'estar (al centroide de Unity, $\bar{\mathbf{q}}$).

---

## 8. Verificació amb el nostre exemple

Provem amb els quatre punts de la taula. Abans del calibratge ja he aplicat la correcció de quiralitat (canvi de signe a la X), així que els punts de Motive corregits són:

| Punt | $\mathbf{p}_i$ corregit (Motive amb $-x$) | $\mathbf{q}_i$ (Unity) |
|------|---|---|
| 1 | (-1.10, 0.82, 2.30) | (0.7, 1.145, 0.365) |
| 2 | (0.30, 0.82, 2.30) | (-0.7, 1.145, 0.365) |
| 3 | (-1.10, 0.82, 1.60) | (0.7, 1.145, 1.035) |
| 4 | (0.30, 0.82, 1.60) | (-0.7, 1.145, 1.035) |

Centroides:
- $\bar{\mathbf{p}} = (-0.40, 0.82, 1.95)$
- $\bar{\mathbf{q}} = (0, 1.145, 0.7)$

Després de centrar, els dos núvols són rectangles. En aquest exemple inventat les seves orientacions ja són les mateixes (només cal una translació). $R$ sortiria pràcticament la identitat i $\mathbf{t} \approx \bar{\mathbf{q}} - \bar{\mathbf{p}} = (0.40, 0.325, -1.25)$.

A la realitat $R$ surt una mica diferent perquè la taula no estarà perfectament alineada amb els eixos d'OptiTrack, i els residuals (l'error que queda) són una mesura de la qualitat del calibratge.

---

## 9. Per què 4 punts i no 2 o 3?

Una transformació rígida en 3D té **6 graus de llibertat** (3 de rotació + 3 de translació). Cada parella de punts apariats em dóna **3 equacions** (una per a cada coordenada). Per tant:

- Amb **2 punts** tinc 6 equacions → just per resoldre, però sense marge per a soroll.
- Amb **3 punts** tinc 9 equacions → ja n'hi ha de més, però els 3 punts podrien estar gairebé alineats i fer el càlcul inestable.
- Amb **4 punts** tinc 12 equacions → solució estable + marge per estimar l'error.

A més, les 4 cantonades d'una taula formen un rectangle, és a dir, **els 4 punts són no degenerats** (no estan alineats ni són coplanars de manera ambigua — bé, són coplanars però defineixen un pla complet).

---

## 10. Resum del procediment

1. Capturo 4 parelles $(\mathbf{p}_i, \mathbf{q}_i)$ — Motive vs Unity.
2. Aplico la correcció de quiralitat ($p_x \to -p_x$).
3. Calculo els centroides $\bar{\mathbf{p}}$ i $\bar{\mathbf{q}}$.
4. Centro els dos núvols restant els centroides.
5. Construeixo $H = \sum \tilde{\mathbf{p}}_i \tilde{\mathbf{q}}_i^{\top}$.
6. Faig la SVD: $H = U \Sigma V^{\top}$.
7. Comprovo el signe de $\det(VU^{\top})$ i construeixo $D$.
8. Calculo $R = V D U^{\top}$.
9. Calculo $\mathbf{t} = \bar{\mathbf{q}} - R \bar{\mathbf{p}}$.
10. A partir d'aquí, transformo qualsevol punt nou amb $\mathbf{p}_{\mathrm{unity}} = R\,\mathbf{p}_{\mathrm{motive}} + \mathbf{t}$.

I això és tot. La part que sembla més complicada (la SVD) és, a la pràctica, una sola crida a una llibreria. La idea conceptual —centro, alineo, descentro— és la important.
