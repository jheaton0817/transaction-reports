CREATE TABLE reports (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    file_name TEXT NOT NULL,
    total_income_pence BIGINT NOT NULL CHECK (total_income_pence >= 0),
    total_expenses_pence BIGINT NOT NULL CHECK (total_expenses_pence >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

