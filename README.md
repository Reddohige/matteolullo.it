# MatteoLullo.it

Applicativo Nuxt + Vue con Tailwind CSS.

### Sviluppo locale

Usa Node 22 o superiore compatibile con Nuxt:

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

### Build statica per Tophost

Genera il sito statico:

```bash
yarn generate
```

Carica via FTP il contenuto della cartella `.output/public` nella root del sito su Tophost.

Gli asset pubblici vanno messi in `public/`: per esempio `public/img/io-def.png`, `public/img/io-corporate.jpeg`, `public/img/bg-r.jpg` e `public/doc/Matteo_Lullo_CV.pdf`.

### Licenza

Il codice del progetto è rilasciato sotto licenza MIT. Può essere usato, copiato, modificato e distribuito secondo i termini indicati nel file `LICENSE`.

I contenuti personali non sono inclusi nella licenza MIT, salvo indicazione diversa. Questo include immagini, fotografie, CV, biografia, testi personali, nome, nickname, loghi e asset di branding collegati a Matteo Lullo / Reddohige.
