import { db } from '../dbb/database';

export type Note = {
  id: number;
  title: string;
  content: string;
};

export const getAll = () =>
  db.getAllSync<Note>(
    'SELECT * FROM notes ORDER BY id DESC'
  );

export const create = (title: string, content: string) =>
  db.runSync(
    'INSERT INTO notes (title, content) VALUES (?, ?)',
    title,
    content
  );

export const update = (id: number, title: string, content: string) =>
  db.runSync(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?',
    title,
    content,
    id
  );

export const remove = (id: number) =>
  db.runSync(
    'DELETE FROM notes WHERE id = ?',
    id
  );