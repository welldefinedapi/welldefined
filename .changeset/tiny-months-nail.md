---
"@welldefined/cli": patch
---

Handle duplicate parameters in `add-parameter` command.
- Require `--force` to overwrite inline parameters where `name` and `in` fields match.
