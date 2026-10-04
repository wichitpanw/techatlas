CREATE TABLE IF NOT EXISTS visit_totals (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO visit_totals (id, total) VALUES (1, 0);
CREATE TABLE IF NOT EXISTS visit_sessions (
  token TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS visit_sessions_created ON visit_sessions(created_at);
CREATE TRIGGER IF NOT EXISTS count_new_session
AFTER INSERT ON visit_sessions BEGIN
  UPDATE visit_totals SET total = total + 1 WHERE id = 1;
END;
