# .ai — Dolce Vita

Repo-local AI configuration. Inherits from the workspace-level
[`bravobyte-ai`](../../bravobyte-ai) repo, which holds the canonical
personas, rules, playbooks, and templates.

| Path         | Purpose                                                              |
| ------------ | -------------------------------------------------------------------- |
| `commands/`  | Repo-specific persona overrides (none yet — uses workspace defaults) |
| `rules/`     | Repo-specific rules (added when patterns settle)                     |
| `playbooks/` | Repo-specific playbooks (none yet)                                   |
| `templates/` | Repo-specific templates (none yet)                                   |

When a rule or playbook is general enough to apply across BravoByte projects,
extract it to `bravobyte-ai/` rather than duplicating it here.
