# Mainflux

![build][build]
[![license][license]](LICENSE)
[![chat][gitter-badge]][gitter]

This repo collects the collaborative work on Mainflux documentation.
The official documentation is hosted at [Mainflux Docs page][docs].
Documentation is auto-generated from Markdown files in this repo.

[MkDocs](https://www.mkdocs.org/) is used to serve the docs locally with different theming.

> Additional practical information about Mainflux system, news and tutorials can be found on the [Mainflux blog][blog].

## Prerequisites

Install [MkDocs](https://www.mkdocs.org/#installation)

```bash
pip install mkdocs
```

## Install

Doc repo can be fetched from GitHub:

```bash
git clone git@github.com:mainflux/docs.git
```

## Usage

Use MkDocs to serve documentation:

```bash
mkdocs serve
```

Then just point the browser to `http://127.0.0.1:8000`.

## Contributing

Thank you for your interest in Mainflux and the desire to contribute!

1. Take a look at our [open issues](https://github.com/mainflux/docs/issues). The [good-first-issue](https://github.com/mainflux/docs/labels/good-first-issue) label is specifically for issues that are great for getting started.
2. Check out the [contribution guide](CONTRIBUTING.md) to learn more about our style and conventions.
3. Make your changes compatible with our workflow.

## Community

- [Gitter][gitter]
- [Twitter][twitter]

## License

[Apache-2.0](LICENSE)

[gitter]: https://gitter.im/mainflux/mainflux?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[license]: https://img.shields.io/badge/license-Apache%20v2.0-blue.svg
[blog]: https://medium.com/mainflux-iot-platform
[twitter]: https://twitter.com/mainflux
[docs]: https://docs.mainflux.io
[build]: https://github.com/mainflux/docs/actions/workflows/main.yaml/badge.svg
