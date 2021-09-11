# dra-analytics
The dra-analytics library consolidates all the metrics used in DRA in one place.

These libraries are normally included like this:

    import { Compactness, Equal, Graph, Minority, Partisan, Splitting } from '@dra2020/dra-analytics';

Then the various functions of the different sets are available under their appropriate symbol.

These are the main libraries:

- [Compactness](./docs/compactness.md): [TODO: Describe compactness library].
- [Equal](./docs/equal.md): [TODO: Describe equal population library].
- [Graph](./docs/graph.md): [TODO: Describe graph library].
- [Minority](./docs/minority.md): [TODO: Describe minority library].
- [Partisan](./docs/partisan.md): [TODO: Describe partisan library].
- [Splitting](./docs/splitting.md): [TODO: Describe splitting library].

There are also support Types and Utils libraries.

The analytics in DRA include metrics favored by, and build on the work of, [many scholars](./docs/attributions.md).

## Build status for master branch

[![CircleCI](https://circleci.com/gh/dra2020/dra-graph.svg?style=svg&circle-token=5c5fdd1ea8b6aa5fc80ec7657b805b3953c58e00)](https://circleci.com/gh/dra2020/dra-analytics)

## Repo contents

There are three packages that are part of this repo:

1. src: building dra-analytics.bundle.js, the production code <<< "bundle"?
2. cli: building cli.cs, a command line utility <<< TODO
3. test: automated test code run by jest

## Developing in this repo

```npm install``` install all dependencies

```npm run build``` build all bundles

```npm run test``` run automated jest tests
