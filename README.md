# Midjourney Image Generator

Dette prosjektet er en Next.js-applikasjon som automatisk genererer bilder ved å bruke ChatGPT til å lage bildeprompter og Midjourney til å generere bildene. Applikasjonen fungerer på følgende måte:

1. **Generer en bildeprompt:** Applikasjonen sender en forespørsel til ChatGPT for å lage en bildeprompt basert på dokumentasjonen til Midjourney om hvordan bygge opp prompts for best mulig resultat.
2. **Generer bilde:** Prompten sendes til Midjourney, som genererer bildet/bildene basert på prompten.
3. **Vis bilde:** De genererte bildene mottas fra Midjourney, lagres og publiseres på frontend. Alle bildene som er generert vises på frontend.
4. **Automatiser prosessen:** Når et bilde er publisert, starter samme prosess på nytt automatisk uten noen manuell interaksjon i applikasjonen.

Applikasjonen er designet for å kjøre kontinuerlig og generere nye bilder så snart de forrige er publisert på frontend.


