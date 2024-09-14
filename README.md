# Well Defined CLI

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

## `transform-method`

Transform HTTP methods in a YAML OpenAPI spec.
