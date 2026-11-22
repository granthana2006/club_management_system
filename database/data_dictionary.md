# Club Management System – Data Dictionary

## 1. Database Overview

| Item | Details |
|---|---|
| **Project name** | Club Management System |
| **Database name** | `club_management_system` |
| **Purpose** | Stores the data for a college club platform: user accounts, club categories and clubs, membership requests and approvals, club leadership, club events, event registrations, and attendance records. |
| **Technology** | MySQL 8.0.16 or later (the script requires 8.0.16+ because CHECK constraints are only enforced from that version) |
| **Storage engine** | InnoDB (all tables) |
| **Character set / collation** | `utf8mb4` / `utf8mb4_0900_ai_ci` (database and all tables) |
| **Script contents** | Structure only. The script contains no `INSERT` statements and no sample data. |

**Structure summary**

- **7 tables:** `users`, `club_categories`, `clubs`, `club_memberships`, `events`, `event_registrations`, `attendance`.
- **1 view:** `v_event_overview` (a view is a saved query, not a physical table).
- **11 foreign keys**, **7 unique constraints**, **14 CHECK constraints**, **1 generated column**, and **22 indexes** in addition to the 7 primary keys.
- Two junction-style tables, `club_memberships` and `event_registrations`, connect users to clubs and users to events.

---

## 2. Table of Contents

1. [Database Overview](#1-database-overview)
2. [Table of Contents](#2-table-of-contents)
3. [Table Documentation](#3-table-documentation)
   - [3.1 `users`](#31-users)
   - [3.2 `club_categories`](#32-club_categories)
   - [3.3 `clubs`](#33-clubs)
   - [3.4 `club_memberships`](#34-club_memberships)
   - [3.5 `events`](#35-events)
   - [3.6 `event_registrations`](#36-event_registrations)
   - [3.7 `attendance`](#37-attendance)
4. [Constraints and Validation Rules](#4-constraints-and-validation-rules)
5. [Index Documentation](#5-index-documentation)
6. [Table Relationships](#6-table-relationships)
7. [Generated Columns](#7-generated-columns)
8. [Database View: `v_event_overview`](#8-database-view-v_event_overview)
9. [Important Business Rules](#9-important-business-rules)
10. [Summary](#10-summary)

---

## 3. Table Documentation

**Notation used in the column tables**

- **Null?** shows `NOT NULL` (a value is required) or `NULL` (the column may be empty).
- **Key** uses PK (primary key), FK (foreign key) and UNIQUE. A composite unique key is shown with the other column(s) it includes.
- **Default** shows `—` when the script defines no default.

### 3.1 `users`

**Purpose:** Stores the accounts of everyone who uses the system, both students and administrators. It holds login information and optional profile details.

| Column | Data type | Null? | Default | Key | Description |
|---|---|---|---|---|---|
| `user_id` | INT UNSIGNED | NOT NULL | AUTO_INCREMENT | PK | Unique identifier of the user. |
| `full_name` | VARCHAR(100) | NOT NULL | — | | The user's full name. |
| `email` | VARCHAR(255) | NOT NULL | — | UNIQUE | Email address. Must be unique; the comparison is case-insensitive because of the collation. |
| `password_hash` | VARCHAR(255) | NOT NULL | — | | The hashed password (bcrypt/argon2 hash only, never plain text). |
| `registration_number` | VARCHAR(50) | NULL | — | UNIQUE | Optional student ID or registration number. Must be unique when provided. |
| `department` | VARCHAR(100) | NULL | — | | Optional department, stored as free text. |
| `academic_year` | TINYINT UNSIGNED | NULL | — | | Optional year of study (1 = first year). |
| `user_role` | ENUM('student','admin') | NOT NULL | `'student'` | | System-level role of the account. |
| `account_status` | ENUM('active','suspended','deactivated') | NOT NULL | `'active'` | | Current state of the account. |
| `created_at` | DATETIME | NOT NULL | `CURRENT_TIMESTAMP` | | Registration date and time. |
| `updated_at` | DATETIME | NOT NULL | `CURRENT_TIMESTAMP`, refreshed `ON UPDATE CURRENT_TIMESTAMP` | | Date and time the row was last changed. |

### 3.2 `club_categories`

**Purpose:** A lookup table that holds the list of club categories. The script comment notes that its rows are reference data inserted later.

| Column | Data type | Null? | Default | Key | Description |
|---|---|---|---|---|---|
| `category_id` | SMALLINT UNSIGNED | NOT NULL | AUTO_INCREMENT | PK | Unique identifier of the category. |
| `category_name` | VARCHAR(100) | NOT NULL | — | UNIQUE | Name of the category. Must be unique. |
| `description` | VARCHAR(255) | NULL | — | | Optional short description of the category. |

### 3.3 `clubs`

**Purpose:** Stores the college clubs. Each club belongs to one category and records the user who created it.

| Column | Data type | Null? | Default | Key | Description |
|---|---|---|---|---|---|
| `club_id` | INT UNSIGNED | NOT NULL | AUTO_INCREMENT | PK | Unique identifier of the club. |
| `club_name` | VARCHAR(150) | NOT NULL | — | UNIQUE | Name of the club. Must be unique. |
| `description` | TEXT | NULL | — | | Optional description of the club. |
| `category_id` | SMALLINT UNSIGNED | NOT NULL | — | FK → `club_categories.category_id` | The category the club belongs to. |
| `logo_url` | VARCHAR(500) | NULL | — | | Optional logo or image path/URL. |
| `club_status` | ENUM('active','inactive','archived') | NOT NULL | `'active'` | | Current state of the club. |
| `created_by` | INT UNSIGNED | NOT NULL | — | FK → `users.user_id` | The user who created the club. |
| `created_at` | DATETIME | NOT NULL | `CURRENT_TIMESTAMP` | | Club creation date and time. |
| `updated_at` | DATETIME | NOT NULL | `CURRENT_TIMESTAMP`, refreshed `ON UPDATE CURRENT_TIMESTAMP` | | Date and time the row was last changed. |

### 3.4 `club_memberships`

**Purpose:** Links users to clubs. Each row is a membership request and its outcome. The table records the request, who reviewed it, the membership role (`member` or `leader`, which is how club leadership is stored), when the membership started, and when the user left. Rejected and left rows are kept as history.

| Column | Data type | Null? | Default | Key | Description |
|---|---|---|---|---|---|
| `membership_id` | INT UNSIGNED | NOT NULL | AUTO_INCREMENT | PK | Unique identifier of the membership row. |
| `user_id` | INT UNSIGNED | NOT NULL | — | FK → `users.user_id`; part of UNIQUE `(user_id, club_id, active_flag)` | The student who requested or holds the membership. |
| `club_id` | INT UNSIGNED | NOT NULL | — | FK → `clubs.club_id`; part of UNIQUE `(user_id, club_id, active_flag)` | The club the membership is for. |
| `membership_role` | ENUM('member','leader') | NOT NULL | `'member'` | | Role in the club. `leader` is allowed only while the status is `approved`. |
| `membership_status` | ENUM('pending','approved','rejected','left') | NOT NULL | `'pending'` | | Stage of the membership request or membership. |
| `active_flag` | TINYINT UNSIGNED, VIRTUAL generated column | NULL | derived (not stored) | part of UNIQUE `(user_id, club_id, active_flag)` | Derived value: `1` for `pending` or `approved` rows, `NULL` for `rejected` or `left` rows. See [Section 7](#7-generated-columns). |
| `requested_at` | DATETIME | NOT NULL | `CURRENT_TIMESTAMP` | | Date and time of the membership request. |
| `reviewed_at` | DATETIME | NULL | — | | Date and time the request was approved or rejected. |
| `reviewed_by` | INT UNSIGNED | NULL | — | FK → `users.user_id` | The user who approved or rejected the request. |
| `start_date` | DATE | NULL | — | | Membership start date (set when the request is approved). |
| `left_at` | DATETIME | NULL | — | | Date and time the member left the club. |

### 3.5 `events`

**Purpose:** Stores the events organised by clubs, including the schedule, venue, optional capacity and cancellation state.

| Column | Data type | Null? | Default | Key | Description |
|---|---|---|---|---|---|
| `event_id` | INT UNSIGNED | NOT NULL | AUTO_INCREMENT | PK | Unique identifier of the event. |
| `club_id` | INT UNSIGNED | NOT NULL | — | FK → `clubs.club_id` | The club organising the event. |
| `event_name` | VARCHAR(150) | NOT NULL | — | | Name of the event. |
| `description` | TEXT | NULL | — | | Optional description of the event. |
| `event_date` | DATE | NOT NULL | — | | The date of the event. |
| `start_time` | TIME | NOT NULL | — | | Start time on the event date. |
| `end_time` | TIME | NOT NULL | — | | End time on the event date. Must be later than `start_time`. |
| `venue` | VARCHAR(200) | NOT NULL | — | | Where the event takes place. |
| `max_capacity` | INT UNSIGNED | NULL | — | | Maximum number of participants. `NULL` means no participant limit. |
| `event_status` | ENUM('scheduled','cancelled') | NOT NULL | `'scheduled'` | | Whether the event is still planned or has been cancelled. Upcoming, ongoing and completed are not stored; they are derived by the view (see [Section 8](#8-database-view-v_event_overview)). |
| `created_by` | INT UNSIGNED | NOT NULL | — | FK → `users.user_id` | The user who created the event. |
| `created_at` | DATETIME | NOT NULL | `CURRENT_TIMESTAMP` | | Date and time the event row was created. |
| `updated_at` | DATETIME | NOT NULL | `CURRENT_TIMESTAMP`, refreshed `ON UPDATE CURRENT_TIMESTAMP` | | Date and time the row was last changed. |

### 3.6 `event_registrations`

**Purpose:** Links students to events. There is one row per student per event; a cancelled registration stays as a row with status `cancelled`.

| Column | Data type | Null? | Default | Key | Description |
|---|---|---|---|---|---|
| `registration_id` | INT UNSIGNED | NOT NULL | AUTO_INCREMENT | PK | Unique identifier of the registration. |
| `event_id` | INT UNSIGNED | NOT NULL | — | FK → `events.event_id`; part of UNIQUE `(event_id, user_id)` | The event registered for. |
| `user_id` | INT UNSIGNED | NOT NULL | — | FK → `users.user_id`; part of UNIQUE `(event_id, user_id)` | The student who registered. |
| `registration_status` | ENUM('registered','cancelled') | NOT NULL | `'registered'` | | Whether the registration is active or cancelled. |
| `registered_at` | DATETIME | NOT NULL | `CURRENT_TIMESTAMP` | | Registration timestamp. |
| `cancelled_at` | DATETIME | NULL | — | | When the registration was cancelled. Empty while the status is `registered`. |

### 3.7 `attendance`

**Purpose:** Records whether a registered student was present or absent. A registration can have at most one attendance record.

| Column | Data type | Null? | Default | Key | Description |
|---|---|---|---|---|---|
| `attendance_id` | INT UNSIGNED | NOT NULL | AUTO_INCREMENT | PK | Unique identifier of the attendance record. |
| `registration_id` | INT UNSIGNED | NOT NULL | — | FK → `event_registrations.registration_id`; UNIQUE | The registration this attendance record belongs to. |
| `attendance_status` | ENUM('present','absent') | NOT NULL | — | | The attendance outcome. |
| `marked_at` | DATETIME | NOT NULL | `CURRENT_TIMESTAMP` | | When attendance was originally recorded. It is not updated automatically when the row is edited. |
| `marked_by` | INT UNSIGNED | NOT NULL | — | FK → `users.user_id` | The user (club leader or admin, per the script comment) who recorded the attendance. |

---

## 4. Constraints and Validation Rules

### 4.1 Primary key constraints

Each table has a single-column, auto-incrementing primary key. A primary key uniquely identifies each row and cannot be NULL or repeated.

| Table | Primary key column |
|---|---|
| `users` | `user_id` |
| `club_categories` | `category_id` |
| `clubs` | `club_id` |
| `club_memberships` | `membership_id` |
| `events` | `event_id` |
| `event_registrations` | `registration_id` |
| `attendance` | `attendance_id` |

### 4.2 Foreign key constraints

A foreign key makes sure a value in one table points to a row that really exists in another table. The ON DELETE and ON UPDATE rules decide what happens when the referenced (parent) row is deleted or its key changes.

| Constraint | Referencing table.column | Referenced table.column | ON DELETE | ON UPDATE |
|---|---|---|---|---|
| `fk_clubs_category` | `clubs.category_id` | `club_categories.category_id` | RESTRICT | CASCADE |
| `fk_clubs_created_by` | `clubs.created_by` | `users.user_id` | RESTRICT | CASCADE |
| `fk_memberships_user` | `club_memberships.user_id` | `users.user_id` | RESTRICT | CASCADE |
| `fk_memberships_club` | `club_memberships.club_id` | `clubs.club_id` | RESTRICT | CASCADE |
| `fk_memberships_reviewed_by` | `club_memberships.reviewed_by` | `users.user_id` | NO ACTION (MySQL default, no clause written in the script) | NO ACTION (MySQL default, no clause written in the script) |
| `fk_events_club` | `events.club_id` | `clubs.club_id` | RESTRICT | CASCADE |
| `fk_events_created_by` | `events.created_by` | `users.user_id` | RESTRICT | CASCADE |
| `fk_registrations_event` | `event_registrations.event_id` | `events.event_id` | RESTRICT | CASCADE |
| `fk_registrations_user` | `event_registrations.user_id` | `users.user_id` | RESTRICT | CASCADE |
| `fk_attendance_registration` | `attendance.registration_id` | `event_registrations.registration_id` | CASCADE | CASCADE |
| `fk_attendance_marked_by` | `attendance.marked_by` | `users.user_id` | RESTRICT | CASCADE |

**What the actions mean**

- **RESTRICT** (ON DELETE): a parent row cannot be deleted while child rows still refer to it.
- **CASCADE** (ON UPDATE): if a parent key value changes, the matching child values change with it.
- **CASCADE** (ON DELETE, `fk_attendance_registration` only): deleting a registration also deletes its attendance record. This is the only cascading delete in the database.
- **NO ACTION** (`fk_memberships_reviewed_by`): the script writes no ON DELETE / ON UPDATE clause for this key, so MySQL's default applies. In InnoDB, `NO ACTION` behaves like `RESTRICT`: a user who is recorded as a reviewer cannot be deleted, and that user's `user_id` cannot be changed.

### 4.3 Unique constraints

A unique constraint prevents the same value (or combination of values) from appearing in two rows.

| Constraint | Table | Column(s) | What it prevents |
|---|---|---|---|
| `uq_users_email` | `users` | `email` | Two accounts with the same email address (case-insensitive). |
| `uq_users_registration_number` | `users` | `registration_number` | Two users with the same registration number. Several users may have no registration number (NULL). |
| `uq_club_categories_name` | `club_categories` | `category_name` | Two categories with the same name. |
| `uq_clubs_name` | `clubs` | `club_name` | Two clubs with the same name. |
| `uq_memberships_one_active` | `club_memberships` | `user_id`, `club_id`, `active_flag` | A user having more than one pending or approved membership in the same club. Rejected and left rows are not affected (see [Section 7](#7-generated-columns)). |
| `uq_registrations_event_user` | `event_registrations` | `event_id`, `user_id` | A student having more than one registration row for the same event. |
| `uq_attendance_registration` | `attendance` | `registration_id` | More than one attendance record for the same registration. |

### 4.4 Check constraints

A CHECK constraint rejects any row whose values break the stated rule.

| Constraint | Table | Rule (in simple terms) |
|---|---|---|
| `chk_users_full_name` | `users` | `full_name` cannot be empty or only spaces. |
| `chk_users_email_format` | `users` | `email` must match the pattern `%_@_%`: at least one character, then `@`, then at least one more character. |
| `chk_users_password_hash` | `users` | `password_hash` cannot be an empty string. |
| `chk_users_academic_year` | `users` | `academic_year` must be empty (NULL) or a number from 1 to 10. |
| `chk_club_categories_name` | `club_categories` | `category_name` cannot be empty or only spaces. |
| `chk_clubs_name` | `clubs` | `club_name` cannot be empty or only spaces. |
| `chk_memberships_status_dates` | `club_memberships` | The review and date fields must match the membership status (table below). |
| `chk_memberships_leader_status` | `club_memberships` | A row can have `membership_role = 'leader'` only when `membership_status = 'approved'`. |
| `chk_memberships_review_order` | `club_memberships` | `reviewed_at` must be empty or not earlier than `requested_at`. |
| `chk_events_name` | `events` | `event_name` cannot be empty or only spaces. |
| `chk_events_time_order` | `events` | `end_time` must be later than `start_time`. |
| `chk_events_capacity` | `events` | `max_capacity` must be empty (no limit) or greater than 0. |
| `chk_registrations_status_dates` | `event_registrations` | A `registered` row must have `cancelled_at` empty; a `cancelled` row must have `cancelled_at` filled in. |
| `chk_registrations_cancel_order` | `event_registrations` | `cancelled_at` must be empty or not earlier than `registered_at`. |

**Detail of `chk_memberships_status_dates`**

| `membership_status` | `reviewed_at` | `reviewed_by` | `start_date` | `left_at` |
|---|---|---|---|---|
| `pending` | must be NULL | must be NULL | must be NULL | must be NULL |
| `approved` | must be NOT NULL | must be NOT NULL | must be NOT NULL | must be NULL |
| `rejected` | must be NOT NULL | must be NOT NULL | must be NULL | must be NULL |
| `left` | must be NOT NULL | must be NOT NULL | must be NOT NULL | must be NOT NULL |

The `attendance` table has no CHECK constraints.

### 4.5 Default values

| Table | Column | Default |
|---|---|---|
| `users` | `user_role` | `'student'` |
| `users` | `account_status` | `'active'` |
| `users` | `created_at` | `CURRENT_TIMESTAMP` |
| `users` | `updated_at` | `CURRENT_TIMESTAMP` (also refreshed on every update) |
| `clubs` | `club_status` | `'active'` |
| `clubs` | `created_at` | `CURRENT_TIMESTAMP` |
| `clubs` | `updated_at` | `CURRENT_TIMESTAMP` (also refreshed on every update) |
| `club_memberships` | `membership_role` | `'member'` |
| `club_memberships` | `membership_status` | `'pending'` |
| `club_memberships` | `requested_at` | `CURRENT_TIMESTAMP` |
| `events` | `event_status` | `'scheduled'` |
| `events` | `created_at` | `CURRENT_TIMESTAMP` |
| `events` | `updated_at` | `CURRENT_TIMESTAMP` (also refreshed on every update) |
| `event_registrations` | `registration_status` | `'registered'` |
| `event_registrations` | `registered_at` | `CURRENT_TIMESTAMP` |
| `attendance` | `marked_at` | `CURRENT_TIMESTAMP` (not refreshed on update) |

All primary keys also use `AUTO_INCREMENT`.

### 4.6 ENUM restrictions

An ENUM column accepts only the values listed for it.

| Table | Column | Allowed values |
|---|---|---|
| `users` | `user_role` | `student`, `admin` |
| `users` | `account_status` | `active`, `suspended`, `deactivated` |
| `clubs` | `club_status` | `active`, `inactive`, `archived` |
| `club_memberships` | `membership_role` | `member`, `leader` |
| `club_memberships` | `membership_status` | `pending`, `approved`, `rejected`, `left` |
| `events` | `event_status` | `scheduled`, `cancelled` |
| `event_registrations` | `registration_status` | `registered`, `cancelled` |
| `attendance` | `attendance_status` | `present`, `absent` |

### 4.7 Generated column rules

| Table | Column | Rule |
|---|---|---|
| `club_memberships` | `active_flag` | `IF(membership_status IN ('pending','approved'), 1, NULL)`, stored as a VIRTUAL column. Used in the unique key `uq_memberships_one_active`. Details in [Section 7](#7-generated-columns). |

---

## 5. Index Documentation

An index makes searches on the indexed column(s) faster. Primary key and unique constraints are also backed by indexes.

| Table | Index name | Type | Column(s) | Purpose |
|---|---|---|---|---|
| `users` | `PRIMARY` | Primary key | `user_id` | Identifies each user row. |
| `users` | `uq_users_email` | Unique | `email` | Enforces unique emails and speeds up lookup by email. |
| `users` | `uq_users_registration_number` | Unique | `registration_number` | Enforces unique registration numbers and speeds up lookup by them. |
| `users` | `idx_users_full_name` | Regular | `full_name` | Speeds up searching users by name. |
| `users` | `idx_users_department` | Regular | `department` | Speeds up filtering users by department. |
| `club_categories` | `PRIMARY` | Primary key | `category_id` | Identifies each category row. |
| `club_categories` | `uq_club_categories_name` | Unique | `category_name` | Enforces unique category names. |
| `clubs` | `PRIMARY` | Primary key | `club_id` | Identifies each club row. |
| `clubs` | `uq_clubs_name` | Unique | `club_name` | Enforces unique club names. |
| `clubs` | `idx_clubs_category` | Regular | `category_id` | Speeds up finding the clubs in a category (the `category_id` foreign key). |
| `clubs` | `idx_clubs_status` | Regular | `club_status` | Speeds up filtering clubs by status. |
| `clubs` | `idx_clubs_created_by` | Regular | `created_by` | Speeds up finding the clubs created by a user (the `created_by` foreign key). |
| `clubs` | `ft_clubs_search` | Full-text | `club_name`, `description` | Supports full-text searching of clubs by name and description. |
| `club_memberships` | `PRIMARY` | Primary key | `membership_id` | Identifies each membership row. |
| `club_memberships` | `uq_memberships_one_active` | Unique, composite | `user_id`, `club_id`, `active_flag` | Prevents duplicate pending/approved memberships for the same user and club. |
| `club_memberships` | `idx_memberships_user` | Regular | `user_id` | Speeds up finding all memberships of a user (the `user_id` foreign key). |
| `club_memberships` | `idx_memberships_club_status` | Regular, composite | `club_id`, `membership_status`, `membership_role` | Speeds up listing a club's members, pending requests or leaders. |
| `club_memberships` | `idx_memberships_reviewed_by` | Regular | `reviewed_by` | Speeds up finding the memberships reviewed by a user (the `reviewed_by` foreign key). |
| `events` | `PRIMARY` | Primary key | `event_id` | Identifies each event row. |
| `events` | `idx_events_club_date` | Regular, composite | `club_id`, `event_date` | Speeds up listing a club's events by date. |
| `events` | `idx_events_date_status` | Regular, composite | `event_date`, `event_status` | Speeds up finding events on a date or date range by status. |
| `events` | `idx_events_created_by` | Regular | `created_by` | Speeds up finding the events created by a user (the `created_by` foreign key). |
| `event_registrations` | `PRIMARY` | Primary key | `registration_id` | Identifies each registration row. |
| `event_registrations` | `uq_registrations_event_user` | Unique, composite | `event_id`, `user_id` | Prevents more than one registration row per student per event. |
| `event_registrations` | `idx_registrations_user` | Regular | `user_id` | Speeds up finding a user's registrations (the `user_id` foreign key). |
| `event_registrations` | `idx_registrations_event_status` | Regular, composite | `event_id`, `registration_status` | Speeds up counting or listing an event's registrations by status. |
| `attendance` | `PRIMARY` | Primary key | `attendance_id` | Identifies each attendance row. |
| `attendance` | `uq_attendance_registration` | Unique | `registration_id` | Allows at most one attendance record per registration. |
| `attendance` | `idx_attendance_marked_by` | Regular | `marked_by` | Speeds up finding the records marked by a user (the `marked_by` foreign key). |

---

## 6. Table Relationships

All relationships below are defined by the foreign keys in Section 4.2. "Many" means zero or more rows.

| # | Parent table | Child table | Foreign key | Cardinality | Purpose in the system |
|---|---|---|---|---|---|
| 1 | `club_categories` | `clubs` | `clubs.category_id` | One-to-many | Groups clubs into categories. Each club has exactly one category. |
| 2 | `users` | `clubs` | `clubs.created_by` | One-to-many | Records who created each club. |
| 3 | `users` | `club_memberships` | `club_memberships.user_id` | One-to-many | A user can have many membership rows (requests and history). |
| 4 | `clubs` | `club_memberships` | `club_memberships.club_id` | One-to-many | A club can have many membership rows. |
| 5 | `users` | `club_memberships` | `club_memberships.reviewed_by` | One-to-many (optional) | Records who approved or rejected a request. The column allows NULL (the CHECK constraint requires a reviewer once a request is approved, rejected or left). |
| 6 | `clubs` | `events` | `events.club_id` | One-to-many | A club organises many events; each event belongs to one club. |
| 7 | `users` | `events` | `events.created_by` | One-to-many | Records who created each event. |
| 8 | `events` | `event_registrations` | `event_registrations.event_id` | One-to-many | An event can have many registrations. |
| 9 | `users` | `event_registrations` | `event_registrations.user_id` | One-to-many | A user can register for many events. |
| 10 | `event_registrations` | `attendance` | `attendance.registration_id` | One-to-one (optional) | A registration has at most one attendance record, and may have none. The unique constraint on `attendance.registration_id` makes this one-to-one. |
| 11 | `users` | `attendance` | `attendance.marked_by` | One-to-many | Records who marked each attendance record. |

**Many-to-many relationships**

- **Users and clubs** are many-to-many through `club_memberships`: a user can be connected to many clubs and a club to many users. Because leadership is the `leader` value of `membership_role`, a club can have several leaders and a user can lead several clubs.
- **Users and events** are many-to-many through `event_registrations`: a user can register for many events and an event can have many registered users.

---

## 7. Generated Columns

The database has one generated column.

| Item | Details |
|---|---|
| **Table / column** | `club_memberships.active_flag` |
| **Data type** | TINYINT UNSIGNED |
| **Kind** | `GENERATED ALWAYS AS (...) VIRTUAL`. Its value is calculated when read and is not stored in the table. You cannot insert or update it directly. |
| **Expression** | `IF(membership_status IN ('pending','approved'), 1, NULL)` |
| **Resulting values** | `1` when the status is `pending` or `approved`; `NULL` when the status is `rejected` or `left`. |
| **Purpose** | Marks a membership row as "active" (a request waiting for review, or a current membership). |

**How it enforces uniqueness**

The unique constraint `uq_memberships_one_active` covers `(user_id, club_id, active_flag)`.

- Two active rows for the same user and club would both have `active_flag = 1`, so the combination `(user, club, 1)` would repeat and the second row is rejected.
- Rejected and left rows have `active_flag = NULL`. MySQL treats NULL values as different from each other in a unique key, so any number of rejected or left rows can exist for the same user and club.

The result: a user can have only one pending or approved membership in a club at a time, while their earlier rejected or left memberships remain as history and the user can request again later.

---

## 8. Database View: `v_event_overview`

`v_event_overview` is a **view**, not a physical table. It stores no data of its own; it is a saved query that is calculated each time it is read, and it has no keys, constraints or indexes of its own.

**Purpose:** give a ready-to-use overview of every event, including a derived lifecycle status, the number of registered participants, and the number of seats left.

**Source tables**

| Source | How it is used |
|---|---|
| `events` | The main table (`FROM events AS e`). The view returns one row per event. |
| `event_registrations` | Used in a subquery that counts the rows with `registration_status = 'registered'` for each `event_id`. It is joined to `events` with a `LEFT JOIN`, so events without registrations still appear. |

**Output columns**

| Column | Source / calculation | Description |
|---|---|---|
| `event_id` | `events.event_id` | Event identifier. |
| `club_id` | `events.club_id` | Club organising the event. |
| `event_name` | `events.event_name` | Event name. |
| `description` | `events.description` | Event description. |
| `event_date` | `events.event_date` | Event date. |
| `start_time` | `events.start_time` | Start time. |
| `end_time` | `events.end_time` | End time. |
| `venue` | `events.venue` | Event venue. |
| `max_capacity` | `events.max_capacity` | Maximum participants (NULL = no limit). |
| `event_status` | `events.event_status` | Stored status: `scheduled` or `cancelled`. |
| `lifecycle_status` | Calculated (see below) | Derived status: `cancelled`, `upcoming`, `ongoing` or `completed`. |
| `registered_count` | Calculated (see below) | Number of active registrations for the event. |
| `seats_remaining` | Calculated (see below) | Seats still available, or NULL when there is no limit. |

**Calculated fields**

- **`lifecycle_status`** is evaluated in this order:
  1. `cancelled`, if `event_status` is `'cancelled'`;
  2. `upcoming`, if the current time (`NOW()`) is before the event start (`event_date` combined with `start_time`);
  3. `ongoing`, if the current time is before the event end (`event_date` combined with `end_time`);
  4. `completed`, otherwise.
- **`registered_count`** is the number of `event_registrations` rows for the event whose `registration_status` is `'registered'`. Cancelled registrations are not counted. If the event has none, the value is `0`.
- **`seats_remaining`** is `NULL` when `max_capacity` is NULL (no limit). Otherwise it is `max_capacity - registered_count`, and never less than `0`.

**Notes**

- Because `lifecycle_status` uses `NOW()`, the result depends on the MySQL session time zone and changes as time passes.
- The view only reports counts. It does not enforce event capacity (see Section 9).

---

## 9. Important Business Rules

### 9.1 Rules enforced directly by the database

**Accounts, clubs and categories**

- Every user has a unique email (case-insensitive) in a basic `something@something` shape; a registration number, if given, is unique.
- A password hash cannot be empty. The database cannot check that the stored text really is a hash.
- User role, account status and club status can only hold the listed ENUM values.
- Club names and category names are unique and cannot be blank. Every club must have an existing category and an existing creating user.

**Membership**

- A user cannot have two pending or approved memberships in the same club (`uq_memberships_one_active`). Rejected and left rows may repeat, so history is preserved and a user can apply again.
- The status determines which fields must be filled in (`chk_memberships_status_dates`):
  - `pending`: no reviewer, review date, start date or leave date yet.
  - `approved`: reviewer, review date and start date are required; no leave date.
  - `rejected`: reviewer and review date are required; no start date or leave date.
  - `left`: reviewer, review date, start date and leave date are all required.
- Only an `approved` membership can have the `leader` role (`chk_memberships_leader_status`). Pending, rejected and left rows must have the role `member`. As a result, an update that sets the status to `left` while the role is still `leader` is rejected by the database.
- The review date cannot be earlier than the request date.
- **Multiple leaders are allowed.** No constraint limits the number of leaders per club or the number of clubs one user can lead.

**Events**

- An event must end later than it starts (`end_time > start_time`). Together with the single `event_date` column, this means the schema supports same-day events only.
- `max_capacity` is either empty (no limit) or greater than 0.
- Event status can only be `scheduled` or `cancelled`. Upcoming, ongoing and completed are derived by the view, not stored.

**Event registration**

- A student can have only one registration row per event (`uq_registrations_event_user`).
- A `registered` row must have no `cancelled_at`; a `cancelled` row must have a `cancelled_at`, and it cannot be earlier than `registered_at`. Because of this, when a cancelled registration is switched back to `registered`, `cancelled_at` must be cleared in the same update, or the database rejects the change.

**Attendance**

- A registration can have at most one attendance record (`uq_attendance_registration`).
- Attendance status can only be `present` or `absent`.
- `marked_at` is set once when the record is created and is not refreshed automatically when the record is edited.

**Historical record preservation (foreign-key rules)**

- Rows that other rows depend on cannot be deleted. Every foreign key to `users`, `clubs`, `club_categories` and `events` uses `RESTRICT`, except `club_memberships.reviewed_by`, which uses MySQL's default `NO ACTION` (equivalent to `RESTRICT` in InnoDB). For example, a user, club or event that has memberships, events or registrations referring to it cannot be deleted.
- The only cascading delete is from `event_registrations` to `attendance`: deleting a registration also deletes its attendance record.
- These rules block deletion only while dependent rows exist. The database does not force deactivation; it is the status columns (`users.account_status`, `clubs.club_status`, `events.event_status`) that allow records to be kept while being switched off.

### 9.2 Rules that require application (backend) logic

The SQL script does **not** enforce the following; the application must handle them.

| Area | Rule handled by the backend |
|---|---|
| Event capacity | Preventing registrations from exceeding `max_capacity`. The database stores the capacity, and the view shows the count and seats remaining, but nothing stops extra rows. The script comments state that the backend must use a transaction and row locking. |
| Re-registration | When a student cancels and registers again, the backend should update the existing row (status back to `registered`, `cancelled_at` cleared, `registered_at` refreshed) instead of inserting a new one. The unique key only blocks a second row; the update procedure itself is the application's job. |
| Membership transitions | Which status changes are allowed (for example pending to approved or rejected, approved to left). The CHECK constraint only validates that the fields match the status; it does not stop an unusual change, such as moving a `left` row back to `approved` if the fields are set accordingly. |
| Leaving as a leader | When a leader leaves, the backend must set the status to `left`, the role to `member` and `left_at` in one update, because the database rejects a `left` row that is still a leader. |
| Who may review or mark | Checking that the user approving or rejecting a membership, creating an event, or marking attendance is a leader of that club or an administrator. The database only checks that the referenced user exists (and that a reviewer is recorded when required). |
| Minimum leaders | Keeping at least one leader in a club. |
| Registration eligibility | Allowing registration only for scheduled events that have not ended, and for active accounts and clubs. |
| Attendance eligibility | Marking attendance only for registrations whose status is `registered`. |
| Passwords and email | Hashing passwords before storage and normalising emails. |
| Deactivation | Using `account_status`, `club_status` and `event_status` to retire records instead of deleting them. |
| Time zone | Choosing and applying a consistent time zone, since timestamps follow the MySQL session time zone. |

---

## 10. Summary

The `club_management_system` database consists of seven InnoDB tables, one view and no stored data.

| Item | Count |
|---|---|
| Tables | 7 |
| Views | 1 (`v_event_overview`) |
| Primary keys | 7 |
| Foreign keys | 11 (one uses MySQL's default `NO ACTION`; one cascades on delete) |
| Unique constraints | 7 |
| CHECK constraints | 14 |
| Generated columns | 1 (`club_memberships.active_flag`) |
| Indexes besides primary keys | 22 (7 unique, 14 regular, 1 full-text) |

How the design fits together:

- `users`, `club_categories`, `clubs` and `events` hold the main entities.
- `club_memberships` and `event_registrations` connect users to clubs and users to events, and keep history through their status columns.
- `attendance` records the outcome for each registration.
- Constraints enforce valid values, unique records, status-dependent fields, leadership only for approved members, and consistent registration and cancellation data.
- Foreign-key rules protect history by restricting deletions, with a cascade only for attendance.
- The backend remains responsible for capacity limits, permission checks, allowed status transitions and similar workflow rules.
