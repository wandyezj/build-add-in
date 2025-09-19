# Localize Design

Allow multiple languages.

## Items

- Specify Languages to support
- Add setting to allow selection of language from dropdown.
- Pull out existing strings
- Allow replacement of strings with current local
- Translate strings with AI
- Detection of current Office Language
- Testing - verify all visible strings are localized

## Replacement Design

- Library option?
- Load big Json / TSV
- What are the keys and values?

### TSV

Single file with all translations.
Bundle the file with the code.
Create a global strings object that maps English strings to localized strings.
Populate the map with the local from the TSV

## Local Detection

[office.js localization](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/localization?tabs=jsonmanifest)

[Office.context.displayLanguage](https://learn.microsoft.com/en-us/javascript/api/office/office.context?view=common-js-preview#office-office-context-displaylanguage-member)

## Languages to Support

- Only support Left to Right languages so don't need to modify UI.
- Prioritize based on ability to translate and most likely users.
- Will only support a single variant of the language i.e. just en - skip variants en-us, en-gb


[Microsoft Office Supported Languages](https://support.microsoft.com/en-us/office/what-languages-is-office-available-in-26d30382-9fba-45dd-bf55-02ab03e2a7ec)

[Languages By Speakers](https://en.wikipedia.org/wiki/List_of_languages_by_total_number_of_speakers)

English, Chinese, Spanish, French, Portuguese, Russian, German, Japanese
Vietnamese, Turkish, Korean, Thai, Italian

[VS Code Localization Languages](https://github.com/microsoft/vscode-loc)

| Language                  | Visual Studio Code Language ID | MLCP Language Code          |
| ------------------------- | ------------------------------ | --------------------------- |
| **French**                | fr                             | French (fr-fr)              |
| **Italian**               | it                             | Italian (it-it)             |
| **German**                | de                             | German (de-de)              |
| **Spanish**               | es                             | Spanish (es-es)             |
| **Russian**               | ru                             | Russian (ru-ru)             |
| **Chinese (Simplified)**  | zh-cn                          | Chinese Simplified (zh-cn)  |
| **Chinese (Traditional)** | zh-tw                          | Chinese Traditional (zh-tw) |
| **Japanese**              | ja                             | Japanese (ja-jp)            |
| **Korean**                | ko                             | Korean (ko-kr)              |
| **Czech**                 | cs                             | Czech (cs-CZ)               |
| **Portuguese (Brazil)**   | pt-br                          | Portuguese (Brazil) (pt-br) |
| **Turkish**               | tr                             | Turkish (tr-tr)             |
| **Polish**                | pl                             | Polish (pl-pl)              |
| **Pseudo Language**       | qps-ploc                       | Pseudo (qps-ploc)           |

