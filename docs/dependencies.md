# Dependencies

Notable dependencies of this project.

- [Package Dependencies](#package-dependencies)
- [Other Tools](#other-tools)
- [GitHub](#github)
- [Node](#node)

## Package Dependencies

These are NPM packages used to build the project.

see [package.json](../package.json)

### Fluent UI components

- `react`
- `react-dom`
- `@fluentui/react-components`
- `@fluentui/react-icons`

### Monaco

- `monaco-editor-webpack-plugin`
    - Editor

### TypeScript

- `typescript`
    - compile typescript to JavaScript

### Marked

- `marked`
    - Compile markdown for html statements as part of the build.

### Webpack

Build System to bundle website.

- `webpack`
- `webpack-cli`
- `clean-webpack-plugin`
- `copy-webpack-plugin`
- `html-webpack-plugin`
- `style-loader`
- `css-loader`
- `ts-loader`

### Webpack Local Development

- `webpack-dev-server`
- `webpack-bundle-analyzer`
- `office-addin-dev-certs`

### Other

- `openpgp`
    - PGP signatures are used to sign snips to indicate the author.

### Code Health

- `cspell`
- `eslint`
- `prettier`

### UI testing

- `playwright`




## Other Tools

### Inkscape

Inkscape transforms SVGs to PNGs for icons. This tool is only used on a developer machine to generate the PNGs.

Many icon SVGs come from the [Microsoft fluentui-system-icons repository](https://github.com/microsoft/fluentui-system-icons)


## GitHub

The website is built and hosted on GitHub using GitHub actions.

see [build.yml](../.github/workflows/build.yml)

## Node

Node is used extensively to build the Add-In static files.

## Ubuntu

Ubuntu is used as the operating system for the build machine.