// FMD Database — SQLite via better-sqlite3
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'fmd.db')

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db
  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  migrate(_db)
  return _db
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS shares (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      view_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at INTEGER NOT NULL
    );
  `)
}

// Share 관련
export interface ShareRow {
  id: string
  data: string
  created_at: number
  view_count: number
}

export const shareDb = {
  create(id: string, data: string): void {
    getDb()
      .prepare('INSERT INTO shares (id, data, created_at) VALUES (?, ?, ?)')
      .run(id, data, Date.now())
  },

  get(id: string): ShareRow | null {
    const row = getDb()
      .prepare('SELECT * FROM shares WHERE id = ?')
      .get(id) as ShareRow | undefined
    if (!row) return null
    // 조회수 증가
    getDb().prepare('UPDATE shares SET view_count = view_count + 1 WHERE id = ?').run(id)
    return row
  },

  list(limit = 50): ShareRow[] {
    return getDb()
      .prepare('SELECT * FROM shares ORDER BY created_at DESC LIMIT ?')
      .all(limit) as ShareRow[]
  },

  delete(id: string): void {
    getDb().prepare('DELETE FROM shares WHERE id = ?').run(id)
  },

  stats(): { total: number; totalViews: number } {
    const row = getDb()
      .prepare('SELECT COUNT(*) as total, COALESCE(SUM(view_count), 0) as totalViews FROM shares')
      .get() as { total: number; totalViews: number }
    return row
  },
}

// User 관련
export interface UserRow {
  id: string
  email: string
  password_hash: string
  role: 'user' | 'admin'
  created_at: number
}

export const userDb = {
  findByEmail(email: string): UserRow | null {
    return (getDb()
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as UserRow) || null
  },

  create(id: string, email: string, passwordHash: string, role: 'user' | 'admin' = 'user'): void {
    getDb()
      .prepare('INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(id, email, passwordHash, role, Date.now())
  },
}
