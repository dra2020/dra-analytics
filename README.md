# dra-analytics

This repo & package consolidates all the metrics used in DRA analytics into one place.
It starts as v2, because v1 was delivered by a combination repos & packages:

- district-analytics
- dra-score
- dra-graph
- compactness, and
- racial voting

This repo & package can be integrated into other tools. A CLI is forthcoming.

The libraries here are normally included like this:

    import { Compactness, Equal, Graph, Minority, Partisan, Splitting } from '@dra2020/dra-analytics';

Then the various functions of the different sets are available under their appropriate symbol.

These are all the libraries:

- [Compactness](./docs/compactness.md): Various measures of compactness.
- [Equal](./docs/equal.md): Population deviation & 'roughly' equal population.
- [Graph](./docs/graph.md): Checks for contiguity & embeddedness.
- [Minority](./docs/minority.md): The opportunity for minorities to elect representatives of their choice and racially polarized voting analysis.
- [Partisan](./docs/partisan.md): Various measures of partisan bias & responsiveness, as well as support for rank-vote graphs and seats-votes curves.
- [Rate](./docs/rate.md): Normalization utilities as well as DRA-specific ratings.
- [Splitting](./docs/splitting.md): County- & district-splitting and COI splitting.

There are also supporting types in the [Types](./docs/Types.md) library and
supporting utilities in the [Utils](./docs/Utils.md) library.

The analytics in DRA include metrics favored by [many scholars](./docs/attributions.md).

## Build status for master branch

[![CircleCI](https://circleci.com/gh/dra2020/dra-graph.svg?style=svg&circle-token=5c5fdd1ea8b6aa5fc80ec7657b805b3953c58e00)](https://circleci.com/gh/dra2020/dra-analytics)

## Repo contents

There are three packages that are part of this repo:

1. lib: building dra-analytics.js, the production code
2. cli: building cli.cs, a command line utility <<< TODO
3. test: automated test code run by jest

## Developing in this repo

```npm install``` install all dependencies

```npm run build``` build all bundles

```npm run test``` run automated jest tests
