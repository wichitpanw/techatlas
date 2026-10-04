-- Retain the existing aggregate and sessions; throttle cleanup to once per day.
CREATE TABLE IF NOT EXISTS visit_maintenance (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  cleaned_at TEXT NOT NULL,
  admission_day TEXT NOT NULL DEFAULT '1970-01-01',
  admitted_today INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO visit_maintenance (id, cleaned_at)
VALUES (1, '1970-01-01 00:00:00');
CREATE TRIGGER IF NOT EXISTS limit_new_sessions_daily
AFTER INSERT ON visit_sessions BEGIN
  UPDATE visit_maintenance SET
    admitted_today = CASE WHEN admission_day = date('now') THEN admitted_today + 1 ELSE 1 END,
    admission_day = date('now')
  WHERE id = 1;
END;
