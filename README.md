# Well Defined CLI

[![NPM Version](https://img.shields.io/npm/v/%40welldefined%2Fcli)]()

Command line utilities for working with OpenAPI specs.

# Usage

```sh
npx @welldefined/cli [command] path-to-spec.yaml
```

Alternatively, install it globally with `npm`:

```sh
npm install @welldefined/cli -g
```

Then you can use it as `welldefined [command] [options]`.

# Utilities

## `merge`

Merges two or more YAML files. It treats $ref objects as distinct items in an array.

```sh
npx @welldefined/cli merge a.yml b.yml --output c.yaml
```

## `change-method`

Change HTTP methods in a YAML OpenAPI spec.

```sh
npx @welldefined/cli change-method path-to-spec.yaml --from post --to patch --endpoints "*/{id}" --output c.yaml
```

## `add-parameter`

Adds a parameter to endpoints in a YAML OpenAPI spec.

```sh
npx @welldefined/cli add-parameter path-to-spec.yaml --parameter '\$ref: "#/components/parameters/IdempotencyKey"' --methods post,patch,put
```
