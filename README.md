# SuperMQ

[![license][license]](LICENSE)
[![Build](https://github.com/absmach/supermq-docs/actions/workflows/pages.yaml/badge.svg?branch=main)](https://github.com/absmach/supermq-docs/actions/workflows/pages.yaml)

This repo collects the collaborative work on SuperMQ documentation.
The official documentation is hosted at [SuperMQ Docs page][docs].
Documentation is auto-generated from Markdown files in this repo.

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

> Additional practical information about SuperMQ system, news and tutorials can be found on the [SuperMQ blog][blog].

## Prerequisites

Ensure that you have [Docusaurus](https://docusaurus.io/docs/installation) installed on your system.

## Installation

Doc repo can be fetched from GitHub:

```bash
git clone git@github.com:/absmach/supermq-docs.git
```

Install the required dependencies using:

```bash
npm install
```

## Build

Build the documentation site using the following command:

```bash
npm run build
```

## Local Development

Use Docusaurus to serve documentation.

```bash
npm run serve
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Contributing

Thank you for your interest in SuperMQ and the desire to contribute!

1. Take a look at our [open issues](https://github.com/absmach/supermq-docs/issues). The [good-first-issue](https://github.com/absmach/supermq-docs/labels/good-first-issue) label is specifically for issues that are great for getting started.
2. Check out the [contribution guide](CONTRIBUTING.md) to learn more about our style and conventions.
3. Make your changes compatible with our workflow.

## Community

- [Matrix][matrix]
- [Twitter][twitter]

## License

[Apache-2.0](LICENSE)

[matrix]: https://matrix.to/#/#Mainflux_mainflux:gitter.im
[license]: https://img.shields.io/badge/license-Apache%20v2.0-blue.svg
[blog]: https://medium.com/abstract-machines-blog
[twitter]: https://twitter.com/absmach
[docs]: https://docs.magistrala.abstractmachines.fr
