# Localize

How to localize new strings. This needs to be done if any strings change.

If a string isn't localized for a language it defaults to English.

## Mark strings for translation

Only target UI strings. Wrap UI strings with a call to `loc`

Example:

```typescript
loc("English String")
```

## Run Translation Tooling

AI is used to do best effort language translation.

1. Extract the loc strings from code
    > npm run extract-loc
2. Copy and Paste [translate-prompt.txt](..\localize\translate-prompt.txt) to AI translator
3. Copy and Paste the AI translation output to [string.tsv](..\localize\strings.tsv)
4. Embed the loc languages
    > npm run embed-loc
5. Check that the files still make sense

note: it's tricky to spot check languages you aren't familiar with - so it's best effort.
