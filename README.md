# MatteoLullo.it

Applicativo Nuxt + Vue con Tailwind CSS per il sito personale
`matteolullo.it`.

Il progetto genera un sito statico pubblicabile su Tophost caricando il
contenuto di `.output/public`.

### Sviluppo locale

Usa la versione Node indicata nel file `.nvmrc`:

```bash
nvm install
nvm use
```

Installa le dipendenze con Yarn:

```bash
yarn install
```

Avvia il server locale:

```bash
yarn dev
```

Il sito locale viene servito da Nuxt, di solito su:

```bash
http://localhost:3000
```

La rotta dei progetti e tool personali è:

```bash
http://localhost:3000/prj/
```

### Qualità codice e pre-commit

Il progetto usa:

- ESLint per il controllo del codice Nuxt/Vue.
- Prettier per la formattazione.
- Husky per bloccare il commit se i controlli falliscono.

Controllo completo:

```bash
yarn quality
```

Questo comando esegue:

```bash
yarn lint
yarn format:check
yarn build
```

Quando fai un commit:

```bash
git commit -m "messaggio"
```

Husky lancia automaticamente `yarn quality`. Se lint, formattazione o build
falliscono, il commit viene fermato.

### Build statica per Tophost

Genera il sito statico con:

```bash
yarn build
```

Il risultato da caricare via FTP su Tophost è:

```bash
.output/public
```

Carica il contenuto di quella cartella nella root pubblica del sito Tophost,
così `www.matteolullo.it` troverà il file `index.html` generato.

Gli asset pubblici vanno messi in `public/`: per esempio
`public/img/io-def.png`, `public/img/io-corporate.jpeg`, `public/img/bg-r.jpg`
e `public/doc/Matteo_Lullo_CV.pdf`.

### Deploy automatico con GitHub Actions

Puoi far fare la build a GitHub e pubblicare automaticamente su Tophost via
FTP a ogni push su `main`.

Il workflow è già presente in:

```bash
.github/workflows/deploy.yml
```

Il workflow parte automaticamente quando fai push su `main`. Puoi anche
lanciarlo a mano da GitHub nella tab `Actions`, perché è abilitato
`workflow_dispatch`.

La pipeline fa:

```bash
yarn install --frozen-lockfile
yarn quality
```

Poi carica via FTP il contenuto di:

```bash
.output/public
```

Il deploy è diviso in due parti:

- carica la root del sito escludendo `prj/**`;
- carica solo i file generati in `.output/public/prj/` dentro la cartella
  remota `prj/`.

Il deploy usa `lftp` direttamente dal runner GitHub, con upload incrementale e
senza cancellazione dei file remoti non presenti nel build. Questo serve a non
cancellare gli altri tool già presenti via FTP dentro `/prj/`.

Su GitHub aggiungi i secret in:

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

Devono essere `Repository secrets`, non `Variables`. Se vengono inseriti come
variabili, il workflow li vede vuoti e il deploy fallisce con un errore tipo
`Input required and not supplied: server`.

Secret richiesti:

```text
TOPHOST_FTP_SERVER
TOPHOST_FTP_USERNAME
TOPHOST_FTP_PASSWORD
TOPHOST_FTP_DIR
```

Secret opzionali, utili se il provider richiede un protocollo o una porta
diversi:

```text
TOPHOST_FTP_PROTOCOL
TOPHOST_FTP_PORT
```

Valori tipici:

```text
TOPHOST_FTP_PROTOCOL=ftp
TOPHOST_FTP_PORT=21
```

Oppure, se Tophost richiede FTPS:

```text
TOPHOST_FTP_PROTOCOL=ftps
TOPHOST_FTP_PORT=21
```

`TOPHOST_FTP_DIR` dipende dalla cartella pubblica indicata da Tophost, spesso
la root FTP del dominio o una cartella tipo `/htdocs/`. Deve finire con `/`,
perché il workflow usa anche `${TOPHOST_FTP_DIR}prj/` per aggiornare la pagina
dei progetti senza toccare il resto della cartella.

Se il deploy fallisce con `ETIMEDOUT` sulla porta `21`, significa che GitHub
non riesce ad aprire la connessione FTP verso il server indicato. In quel caso
controlla nel pannello Tophost che host, protocollo e porta siano quelli
corretti. Se il servizio fosse solo SFTP, questo workflow va cambiato perché
ora è configurato per FTP/FTPS tramite `lftp`.

Dopo aver configurato i secret:

```bash
git add .
git commit -m "Add Tophost deploy workflow"
git push origin main
```

### Licenza

Il codice del progetto è rilasciato sotto licenza MIT. Può essere usato, copiato, modificato e distribuito secondo i termini indicati nel file `LICENSE`.

I contenuti personali non sono inclusi nella licenza MIT, salvo indicazione diversa. Questo include immagini, fotografie, CV, biografia, testi personali, nome, nickname, loghi e asset di branding collegati a Matteo Lullo / Reddohige.
