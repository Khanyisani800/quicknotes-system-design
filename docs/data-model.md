Markdown
# QuickNotes Data Model Document

## Database Selection Justification

We selected a Relational SQL Database (PostgreSQL) over NoSQL for QuickNotes because it requires strong structured relationships between users, notes, and tags (one-to-many and many-to-many), providing strong ACID guarantees for transactional consistency.

---

## Entities & Schemas

1. **`users`**: Represents registered users.
   * `id`: BIGSERIAL (Primary Key)
   * `email`: VARCHAR(255) (Unique, Not Null)
   * `password_hash`: VARCHAR(255) (Not Null)
   * `created_at`: TIMESTAMP WITH TIME ZONE (Default: NOW())

2. **`notes`**: Represents note entries.
   * `id`: BIGSERIAL (Primary Key)
   * `user_id`: BIGINT (Foreign Key referencing `users(id)` ON DELETE CASCADE)
   * `title`: VARCHAR(100) (Not Null)
   * `body`: TEXT
   * `created_at`: TIMESTAMP WITH TIME ZONE (Default: NOW())
   * `updated_at`: TIMESTAMP WITH TIME ZONE (Default: NOW())

3. **`tags`**: Categorization tags for notes.
   * `id`: BIGSERIAL (Primary Key)
   * `name`: VARCHAR(50) (Unique, Not Null)

4. **`note_tags`**: Junction table for the Many-to-Many relationship between `notes` and `tags`.
   * `note_id`: BIGINT (Foreign Key referencing `notes(id)` ON DELETE CASCADE)
   * `tag_id`: BIGINT (Foreign Key referencing `tags(id)` ON DELETE CASCADE)
   * Primary Key: (`note_id`, `tag_id`)

---

## Relationships Explanation

* **One-to-Many (`users` -> `notes`)**: One user can create multiple notes. Each note belongs to exactly one user.
* **Many-to-Many (`notes` <-> `tags`)**: A single note can have multiple tags, and a single tag can be assigned across multiple notes using the `note_tags` junction table.

---

## SQL DDL (CREATE TABLE Statements)

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE note_tags (
    note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);

INSERT INTO notes (user_id, title, body)
VALUES (1, 'Grocery List', 'Buy milk, eggs, and coffee')
RETURNING id, title, created_at;

SELECT id, title, body, created_at 
FROM notes 
WHERE user_id = 1 
ORDER BY created_at DESC;

SELECT n.id, n.title, n.body, t.name AS tag_name
FROM notes n
JOIN note_tags nt ON n.id = nt.note_id
JOIN tags t ON nt.tag_id = t.id
WHERE n.user_id = 1;

CREATE INDEX idx_notes_user_id_created_at ON notes(user_id, created_at DESC);


