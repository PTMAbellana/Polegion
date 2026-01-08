# Research Exports Guide

This guide explains the adaptive learning export endpoints and how to interpret their fields for analysis.

## Endpoints
- GET `/api/adaptive/qlearning/export`: JSON export containing both in-memory Q-table and persisted Q-values.
- GET `/api/adaptive/qlearning/export.csv`: CSV export of persisted Q-values only.
- GET `/api/adaptive/qlearning/transitions.csv`: CSV export of adaptive state transitions with cohort, reward, epsilon.

## Fields
- `state_key`: Encoded learning state derived from mastery level, difficulty level, streaks, and attempts (e.g., `M2_D3_C1_W0`).
- `action`: The pedagogical action associated with the state (e.g., `increase_difficulty`, `maintain_difficulty`).
- `q_value`: Learned Q-value for the `(state_key, action)` pair after Bellman updates.
- `updated_at`: Timestamp of last persistence for the Q-value.
- `cohortMode`: Experiment cohort in effect during export: `adaptive` or `control`.
- `inMemoryQTable`: Current Q-values stored by the running service (may include states not yet persisted).
- `persistedQValues`: Rows from the `adaptive_q_values` table (survive restarts).

## Notes
- In control mode (`ADAPTIVE_MODE=control`), action selection is fixed to `maintain_difficulty`; transitions include `cohort_mode=control` for analysis.
- Persisted Q-values are loaded lazily into memory during action selection; expect convergence as more transitions occur.
- Use `adaptive_state_transitions` for detailed per-attempt data: action, reward, epsilon, q_value after update, correctness, and cohort.

## Suggested Analyses
- Compare average `q_value` per action across cohorts.
- Track Q-value changes over time using `updated_at`.
- Correlate `q_value` improvements with `epsilon` decay and mastery gains using transitions.
- Compare transitions by `cohort_mode` to evaluate effect sizes; analyze `reward` distributions and `epsilon` decay patterns.

