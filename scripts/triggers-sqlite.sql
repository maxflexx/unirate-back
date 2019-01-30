CREATE TRIGGER feedback_BEFORE_INSERT AFTER INSERT ON feedback FOR EACH ROW WHEN new.updated is NULL
BEGIN
    UPDATE feedback SET created = strftime('%s', 'now') WHERE id = new.id;
END;
CREATE TRIGGER feedback_BEFORE_UPDATE AFTER UPDATE ON feedback FOR EACH ROW
BEGIN
  UPDATE feedback SET updated = strftime('%s', 'now') WHERE id = new.id;
END;