-- =====================================================================
--  Club Management System  |  MySQL 8.0.16+ (CHECK constraints are enforced from 8.0.16)
--  Structure only: no INSERT statements, no sample data.
--  Run order: users -> club_categories -> clubs -> club_memberships
--             -> events -> event_registrations -> attendance -> view
--
--  GENERAL POLICY: HISTORY IS PRESERVED
--    * Users are deactivated (users.account_status) and clubs are archived
--      (clubs.club_status); they are not deleted once they have history.
--    * Foreign keys to users, clubs and events are therefore RESTRICT, so a
--      row that has history cannot be deleted by accident.
--    * The only cascading delete left is attendance -> event_registrations
--      (an attendance record has no meaning without its registration).
-- =====================================================================

CREATE DATABASE IF NOT EXISTS club_management_system
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE club_management_system;

-- ---------------------------------------------------------------------
-- 1. users : accounts (students and administrators)
--    Do not DELETE users who have any history; set account_status to
--    'deactivated' (or 'suspended') instead.
-- ---------------------------------------------------------------------
CREATE TABLE users (
    user_id              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    full_name            VARCHAR(100)     NOT NULL,
    email                VARCHAR(255)     NOT NULL COMMENT 'Unique; comparison is case-insensitive',
    password_hash        VARCHAR(255)     NOT NULL COMMENT 'bcrypt/argon2 hash only, never plain text',
    registration_number  VARCHAR(50)      NULL     COMMENT 'Optional student ID / registration number',
    department           VARCHAR(100)     NULL     COMMENT 'Optional, free text',
    academic_year        TINYINT UNSIGNED NULL     COMMENT 'Optional year of study (1 = first year)',
    user_role            ENUM('student','admin')                  NOT NULL DEFAULT 'student',
    account_status       ENUM('active','suspended','deactivated') NOT NULL DEFAULT 'active',
    created_at           DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Registration date',
    updated_at           DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id),
    CONSTRAINT uq_users_email               UNIQUE (email),
    CONSTRAINT uq_users_registration_number UNIQUE (registration_number),
    CONSTRAINT chk_users_full_name     CHECK (CHAR_LENGTH(TRIM(full_name)) > 0),
    CONSTRAINT chk_users_email_format  CHECK (email LIKE '%_@_%'),
    CONSTRAINT chk_users_password_hash CHECK (CHAR_LENGTH(password_hash) > 0),
    CONSTRAINT chk_users_academic_year CHECK (academic_year IS NULL OR academic_year BETWEEN 1 AND 10),
    INDEX idx_users_full_name  (full_name),
    INDEX idx_users_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='User accounts: students and system administrators';

-- ---------------------------------------------------------------------
-- 2. club_categories : lookup table for club categories
-- ---------------------------------------------------------------------
CREATE TABLE club_categories (
    category_id    SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_name  VARCHAR(100)      NOT NULL,
    description    VARCHAR(255)      NULL,

    PRIMARY KEY (category_id),
    CONSTRAINT uq_club_categories_name  UNIQUE (category_name),
    CONSTRAINT chk_club_categories_name CHECK (CHAR_LENGTH(TRIM(category_name)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='Club category lookup (rows are reference data, inserted later)';

-- ---------------------------------------------------------------------
-- 3. clubs
--    Do not DELETE clubs that have members or events; set club_status to
--    'archived' (or 'inactive') instead.
-- ---------------------------------------------------------------------
CREATE TABLE clubs (
    club_id      INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    club_name    VARCHAR(150)      NOT NULL,
    description  TEXT              NULL,
    category_id  SMALLINT UNSIGNED NOT NULL,
    logo_url     VARCHAR(500)      NULL COMMENT 'Optional logo/image path or URL',
    club_status  ENUM('active','inactive','archived') NOT NULL DEFAULT 'active',
    created_by   INT UNSIGNED      NOT NULL COMMENT 'User who created the club',
    created_at   DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Club creation date',
    updated_at   DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (club_id),
    CONSTRAINT uq_clubs_name UNIQUE (club_name),
    CONSTRAINT chk_clubs_name CHECK (CHAR_LENGTH(TRIM(club_name)) > 0),
    INDEX idx_clubs_category   (category_id),
    INDEX idx_clubs_status     (club_status),
    INDEX idx_clubs_created_by (created_by),
    FULLTEXT INDEX ft_clubs_search (club_name, description),
    CONSTRAINT fk_clubs_category
        FOREIGN KEY (category_id) REFERENCES club_categories (category_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_clubs_created_by
        FOREIGN KEY (created_by) REFERENCES users (user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='College clubs';

-- ---------------------------------------------------------------------
-- 4. club_memberships : user <-> club (many-to-many) + membership role,
--    request/approval workflow, and club leadership (membership_role)
--
--    LEADERSHIP MODEL
--      * Leadership is a role on an approved membership (membership_role).
--      * MULTIPLE LEADERS PER CLUB ARE PERMITTED, and one user may lead
--        several clubs. No single-leader restriction is imposed unless the
--        project requirements explicitly change.
--      * Promotion / demotion = UPDATE membership_role on the approved row.
--
--    EXPECTED STATE TRANSITIONS (performed by the backend)
--      request           : INSERT status 'pending' (reviewed_at, reviewed_by,
--                          start_date, left_at all NULL).
--      approve           : status 'approved', reviewed_at = now,
--                          reviewed_by = reviewer, start_date = start day.
--      reject            : status 'rejected', reviewed_at = now,
--                          reviewed_by = reviewer.
--      leave             : ONE UPDATE that sets status 'left', left_at = now
--                          AND membership_role = 'member'.
--                          A leader who leaves is demoted to 'member' in the
--                          same statement, so a departed member can never
--                          keep leadership. The row (and its history) stays.
--      withdraw pending  : DELETE the pending row (nothing to preserve).
--      re-join after     : INSERT a new 'pending' row; old 'rejected' / 'left'
--      rejected or left    rows are kept as history.
--    Backend rule not expressible as a constraint: keep at least one leader
--    per active club.
--
--    fk_memberships_reviewed_by deliberately declares no ON DELETE / ON UPDATE
--    clause: MySQL does not allow referential actions on a column that is used
--    in a CHECK constraint, and chk_memberships_status_dates below tests
--    reviewed_by. Omitting the actions makes MySQL apply its default, NO ACTION,
--    which InnoDB treats the same as RESTRICT: a user who reviewed a membership
--    cannot be deleted, and their user_id cannot be changed. User IDs are
--    surrogate keys and never change.
-- ---------------------------------------------------------------------
CREATE TABLE club_memberships (
    membership_id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id            INT UNSIGNED NOT NULL COMMENT 'The student who requested/holds the membership',
    club_id            INT UNSIGNED NOT NULL,
    membership_role    ENUM('member','leader') NOT NULL DEFAULT 'member'
                       COMMENT 'leader only while status = approved; reset to member when the member leaves',
    membership_status  ENUM('pending','approved','rejected','left') NOT NULL DEFAULT 'pending',
    -- Derived (virtual) column: 1 while the row is "active" (pending/approved), NULL otherwise.
    -- Combined with the UNIQUE key below it blocks duplicate active memberships, while still
    -- allowing history rows (rejected / left) and later re-requests.
    active_flag        TINYINT UNSIGNED GENERATED ALWAYS AS
                           (IF(membership_status IN ('pending','approved'), 1, NULL)) VIRTUAL
                           COMMENT 'Derived: 1 for pending/approved rows, NULL otherwise',
    requested_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Request date',
    reviewed_at        DATETIME     NULL COMMENT 'Approval or rejection date',
    reviewed_by        INT UNSIGNED NULL COMMENT 'User who approved or rejected the request',
    start_date         DATE         NULL COMMENT 'Membership start date (set on approval)',
    left_at            DATETIME     NULL COMMENT 'When the member left the club',

    PRIMARY KEY (membership_id),
    CONSTRAINT uq_memberships_one_active UNIQUE (user_id, club_id, active_flag),
    -- Plain single-column index kept for the user_id foreign key (the unique key above
    -- ends in a virtual column, so a dedicated plain index is the safe choice for the FK).
    INDEX idx_memberships_user        (user_id),
    INDEX idx_memberships_club_status (club_id, membership_status, membership_role),
    INDEX idx_memberships_reviewed_by (reviewed_by),
    CONSTRAINT fk_memberships_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_memberships_club
        FOREIGN KEY (club_id) REFERENCES clubs (club_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_memberships_reviewed_by
        FOREIGN KEY (reviewed_by) REFERENCES users (user_id),
    -- Status vs. review/start/leave fields.
    CONSTRAINT chk_memberships_status_dates CHECK (
           (membership_status = 'pending'
                AND reviewed_at IS NULL     AND reviewed_by IS NULL
                AND start_date  IS NULL     AND left_at     IS NULL)
        OR (membership_status = 'approved'
                AND reviewed_at IS NOT NULL AND reviewed_by IS NOT NULL
                AND start_date  IS NOT NULL AND left_at     IS NULL)
        OR (membership_status = 'rejected'
                AND reviewed_at IS NOT NULL AND reviewed_by IS NOT NULL
                AND start_date  IS NULL     AND left_at     IS NULL)
        OR (membership_status = 'left'
                AND reviewed_at IS NOT NULL AND reviewed_by IS NOT NULL
                AND start_date  IS NOT NULL AND left_at     IS NOT NULL)
    ),
    -- Only an approved (current) member can hold the leader role. Pending, rejected and
    -- left rows must be 'member', so a departed member never keeps leadership.
    CONSTRAINT chk_memberships_leader_status CHECK (
        membership_role = 'member' OR membership_status = 'approved'
    ),
    CONSTRAINT chk_memberships_review_order CHECK (
        reviewed_at IS NULL OR reviewed_at >= requested_at
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='Club membership requests, approvals, roles (member/leader) and history';

-- ---------------------------------------------------------------------
-- 5. events
--    Do not DELETE events that have registrations; cancel them instead
--    (event_status = 'cancelled').
--
--    TIME ASSUMPTION: events are same-day only (start_time and end_time on
--    event_date), so end_time must be later than start_time. Overnight or
--    multi-day events are not supported for now.
--
--    CAPACITY: max_capacity (NULL = unlimited) cannot be enforced reliably
--    by a CHECK constraint, because a check sees only one row and cannot
--    stop two concurrent registrations from both succeeding. THE BACKEND
--    MUST register inside a transaction and lock the event row (for example
--    SELECT ... FROM events WHERE event_id = ? FOR UPDATE), count the rows
--    with registration_status = 'registered', and insert/reactivate only if
--    the count is below max_capacity. v_event_overview exposes the current
--    registered_count and seats_remaining for display.
-- ---------------------------------------------------------------------
CREATE TABLE events (
    event_id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    club_id       INT UNSIGNED NOT NULL,
    event_name    VARCHAR(150) NOT NULL,
    description   TEXT         NULL,
    event_date    DATE         NOT NULL,
    start_time    TIME         NOT NULL,
    end_time      TIME         NOT NULL,
    venue         VARCHAR(200) NOT NULL,
    max_capacity  INT UNSIGNED NULL COMMENT 'NULL = no participant limit',
    event_status  ENUM('scheduled','cancelled') NOT NULL DEFAULT 'scheduled'
                  COMMENT 'upcoming/ongoing/completed are derived from date+time (see v_event_overview)',
    created_by    INT UNSIGNED NOT NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (event_id),
    INDEX idx_events_club_date   (club_id, event_date),
    INDEX idx_events_date_status (event_date, event_status),
    INDEX idx_events_created_by  (created_by),
    CONSTRAINT fk_events_club
        FOREIGN KEY (club_id) REFERENCES clubs (club_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_events_created_by
        FOREIGN KEY (created_by) REFERENCES users (user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_events_name       CHECK (CHAR_LENGTH(TRIM(event_name)) > 0),
    -- Same-day events only: the event must end later than it starts.
    CONSTRAINT chk_events_time_order CHECK (end_time > start_time),
    CONSTRAINT chk_events_capacity   CHECK (max_capacity IS NULL OR max_capacity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='Events organised by clubs';

-- ---------------------------------------------------------------------
-- 6. event_registrations : user <-> event (many-to-many)
--
--    ONE ROW PER STUDENT PER EVENT (UNIQUE event_id, user_id). Expected
--    backend behaviour:
--      cancel            : UPDATE SET registration_status = 'cancelled',
--                          cancelled_at = CURRENT_TIMESTAMP.
--      register again    : do NOT insert a second row. UPDATE the existing
--                          row in ONE statement:
--                            SET registration_status = 'registered',
--                                cancelled_at        = NULL,
--                                registered_at       = CURRENT_TIMESTAMP
--                          cancelled_at must be cleared in the same UPDATE,
--                          otherwise chk_registrations_status_dates rejects
--                          the change. registered_at is refreshed so it
--                          reflects the latest registration.
--      Re-registering must also pass the capacity check described on the
--      events table (transaction + row lock).
--    Do not DELETE registrations; cancel them. Users and events that have
--    registrations cannot be deleted (RESTRICT).
-- ---------------------------------------------------------------------
CREATE TABLE event_registrations (
    registration_id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    event_id             INT UNSIGNED NOT NULL,
    user_id              INT UNSIGNED NOT NULL,
    registration_status  ENUM('registered','cancelled') NOT NULL DEFAULT 'registered',
    registered_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Registration timestamp',
    cancelled_at         DATETIME     NULL COMMENT 'Set when registration_status = cancelled, NULL when registered',

    PRIMARY KEY (registration_id),
    CONSTRAINT uq_registrations_event_user UNIQUE (event_id, user_id),
    INDEX idx_registrations_user         (user_id),
    INDEX idx_registrations_event_status (event_id, registration_status),
    CONSTRAINT fk_registrations_event
        FOREIGN KEY (event_id) REFERENCES events (event_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_registrations_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_registrations_status_dates CHECK (
           (registration_status = 'registered' AND cancelled_at IS NULL)
        OR (registration_status = 'cancelled'  AND cancelled_at IS NOT NULL)
    ),
    CONSTRAINT chk_registrations_cancel_order CHECK (
        cancelled_at IS NULL OR cancelled_at >= registered_at
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='Student registrations for events (one row per student per event)';

-- ---------------------------------------------------------------------
-- 7. attendance : at most one record per registration (one-to-one, optional)
--    marked_at is the time attendance was ORIGINALLY recorded and is not
--    changed automatically when the record is edited.
--    The only CASCADE delete in the schema: an attendance record cannot
--    exist without its registration. Registrations themselves are not
--    deleted in normal operation (they are cancelled instead).
--    Backend rules: only mark attendance for registrations with status
--    'registered', and only by a leader of the event's club or an admin.
-- ---------------------------------------------------------------------
CREATE TABLE attendance (
    attendance_id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    registration_id    INT UNSIGNED NOT NULL,
    attendance_status  ENUM('present','absent') NOT NULL,
    marked_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                       COMMENT 'When attendance was originally recorded',
    marked_by          INT UNSIGNED NOT NULL COMMENT 'Club leader or admin who recorded attendance',

    PRIMARY KEY (attendance_id),
    CONSTRAINT uq_attendance_registration UNIQUE (registration_id),
    INDEX idx_attendance_marked_by (marked_by),
    CONSTRAINT fk_attendance_registration
        FOREIGN KEY (registration_id) REFERENCES event_registrations (registration_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_attendance_marked_by
        FOREIGN KEY (marked_by) REFERENCES users (user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='Attendance records for event registrations';

-- ---------------------------------------------------------------------
-- 8. (Optional convenience view) derived event lifecycle + seat counts.
--    Nothing is stored redundantly; it is computed on read.
--    registered_count / seats_remaining are for DISPLAY only; capacity must
--    still be enforced by the backend with a transaction and row lock
--    (see the comment on the events table).
-- ---------------------------------------------------------------------
CREATE VIEW v_event_overview AS
SELECT
    e.event_id,
    e.club_id,
    e.event_name,
    e.description,
    e.event_date,
    e.start_time,
    e.end_time,
    e.venue,
    e.max_capacity,
    e.event_status,
    CASE
        WHEN e.event_status = 'cancelled'                         THEN 'cancelled'
        WHEN NOW() <  TIMESTAMP(e.event_date, e.start_time)       THEN 'upcoming'
        WHEN NOW() <  TIMESTAMP(e.event_date, e.end_time)         THEN 'ongoing'
        ELSE 'completed'
    END AS lifecycle_status,
    COALESCE(rc.registered_count, 0) AS registered_count,
    CASE
        WHEN e.max_capacity IS NULL THEN NULL
        ELSE GREATEST(CAST(e.max_capacity AS SIGNED) - CAST(COALESCE(rc.registered_count, 0) AS SIGNED), 0)
    END AS seats_remaining
FROM events AS e
LEFT JOIN (
    SELECT event_id, COUNT(*) AS registered_count
    FROM event_registrations
    WHERE registration_status = 'registered'
    GROUP BY event_id
) AS rc ON rc.event_id = e.event_id;
