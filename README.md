# dra-analytics

This repo & package consolidates all the metrics used in DRA analytics into one place.
It started as v2, because v1 was delivered by a combination repos & packages:

- district-analytics
- dra-score
- dra-graph
- compactness, and
- racial voting

The goals of this consolidation were to make the analytics code:

1. More transparent -- easier to show/explain
2. More maintainable -- easier to support
3. More general -- easier to re-use, because the DRA-specific parts are clearly isolated & there is a CLI

Because the partisan analytics can now be calculated at a command line, independent of any tool, you can compute
them for several elections, one at a time, and then generate statistics for them.

## Details

This repo & package can be integrated into other tools.
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

Supporting types are in the [Types](./docs/types.md) library and
supporting utilities are in the [Utils](./docs/utils.md) library.

The analytics in DRA include metrics favored by [many scholars](./docs/attributions.md).

A [command-line interface](./docs/cli.md) (CLI) was added in v3.

## Updates

- 12/18/21 -- Added multi-member district (MMD) support to makePopulationScorecard().

## Build status for master branch

[![CircleCI](https://circleci.com/gh/dra2020/dra-graph.svg?style=svg&circle-token=5c5fdd1ea8b6aa5fc80ec7657b805b3953c58e00)](https://circleci.com/gh/dra2020/dra-analytics)

## Repo contents

There are three packages that are part of this repo:

1. lib: building dra-analytics.js, the production code
2. cli: building dra-&lt;command&gt;.bundle.js, a set of command line utilities
3. test: automated test code run by jest

## Developing in this repo

```npm install``` install all dependencies

```npm run build``` build all bundles

```npm run buildpartisan``` build the partisan command

```npm run buildcompactness``` build the compactness command

```npm run buildsplitting``` build the splitting command

```npm run test``` run automated jest tests

Email questions to [feedback](mailto:feedback@davesredistricting.org?subject=dra-analytics).