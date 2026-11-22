# Database Normalization -- Club Management System

## 1. Introduction to Database Normalization

### 1.1 What is Database Normalization?

Database normalization is the process of organizing data in a relational
database to reduce unnecessary data duplication and improve data
integrity.

It involves dividing data into multiple related tables and establishing
relationships between them using primary keys and foreign keys.

Normalization follows a set of rules called **Normal Forms (NF)**. The
most commonly used normal forms in basic database design are:

1.  First Normal Form (1NF)
2.  Second Normal Form (2NF)
3.  Third Normal Form (3NF)

Each normal form introduces additional requirements that help improve
the structure of a database.

### 1.2 Why is Normalization Important?

Normalization is important because it helps maintain a well-organized
and reliable database.

Its main benefits include:

-   **Reduces data redundancy:** Avoids storing the same information
    repeatedly in multiple records.
-   **Improves data consistency:** Ensures that information is
    maintained in a centralized and consistent manner.
-   **Prevents insertion anomalies:** Makes it possible to insert
    information without requiring unrelated information to be available.
-   **Prevents update anomalies:** Reduces the possibility of updating
    the same information in multiple places.
-   **Prevents deletion anomalies:** Ensures that deleting one record
    does not unintentionally remove unrelated information.
-   **Improves maintainability:** Makes the database easier to
    understand, manage, and modify.

### 1.3 Importance of Normalization in the Club Management System

The Club Management System manages different types of information,
including:

-   User accounts belonging to students and administrators.
-   Club categories and club details.
-   Student memberships in different clubs.
-   Events organized by clubs.
-   Student registrations for events.
-   Attendance records for registered students.

If all this information were stored in a single large table, the same
student, club, and event information would have to be repeated across
multiple records.

This could lead to unnecessary duplication and data inconsistencies.

To avoid these problems, the database separates information into seven
related tables:

1.  `users`
2.  `club_categories`
3.  `clubs`
4.  `club_memberships`
5.  `events`
6.  `event_registrations`
7.  `attendance`

These tables represent different entities and relationships within the
system.

The following sections explain how the database design relates to 1NF,
2NF, and 3NF.

------------------------------------------------------------------------

## 2. Unnormalized Form (UNF)

### 2.1 What is Unnormalized Form?

Unnormalized Form (UNF) refers to a database structure that does not
satisfy the requirements of First Normal Form.

In an unnormalized database:

-   A column may contain multiple values.
-   Repeating groups of information may exist.
-   The same information may be unnecessarily duplicated.
-   Data may be difficult to search, update, and maintain.

An unnormalized structure is generally unsuitable for managing complex
relationships between different entities.

### 2.2 Illustrative Example for the Club Management System

Consider a hypothetical design in which student details, club details,
memberships, events, registrations, and attendance information are
stored in a single table.

The following is an illustrative example of how such a table might look:

  --------------------------------------------------------------------------
  Student ID  Student     Club        Events       Registered   Attendance
              Name        Details                  Students     
  ----------- ----------- ----------- ------------ ------------ ------------
  101         Rahul       Coding      Hackathon,   Rahul,       Present,
                          Club, Music Workshop     Priya, Aman  Absent
                          Club                                  

  102         Priya       Coding Club Hackathon,   Rahul,       Absent,
                                      Workshop     Priya, Aman  Present
  --------------------------------------------------------------------------

This example is hypothetical and does not represent the actual original
database structure.

### 2.3 Problems with the Unnormalized Design

The hypothetical design has several problems:

**1. Repeating Groups**

A student may belong to multiple clubs and participate in multiple
events. Storing these values together in one column creates repeating
groups.

**2. Data Redundancy**

Club names, event details, and student information may be repeated
across multiple records.

**3. Insertion Anomaly**

A new club may not be easily inserted unless a student membership record
is also available.

**4. Update Anomaly**

If a club's name changes, the same information may need to be updated in
several records. Missing an update could result in inconsistent
information.

**5. Deletion Anomaly**

Deleting the only record containing information about a particular event
could unintentionally remove the event information itself.

### 2.4 Need for Normalization

To solve these problems, the database should separate information
according to the entities and relationships it represents.

For example:

-   Student information should be maintained separately from club
    information.
-   Club membership information should be stored in a dedicated table.
-   Event information should be separated from student registrations.
-   Attendance information should be maintained separately from
    registration information.

This separation forms the foundation for applying the normal forms.

------------------------------------------------------------------------

## 3. First Normal Form (1NF)

### 3.1 Definition of First Normal Form

A table is in First Normal Form (1NF) when it satisfies the following
conditions:

1.  Each column contains atomic values.
2.  Each record can be uniquely identified.
3.  There are no repeating groups.
4.  There are no multivalued columns containing multiple independent
    values in a single field.

An atomic value is a single value that is treated as one unit for the
purpose of the database design.

For example, storing multiple club names in one column is not
appropriate for a properly structured membership database.

Instead, each membership should be represented by an individual record.

### 3.2 1NF Analysis of the Actual Database

The Club Management System is designed using seven separate tables. Each
table represents a particular entity or relationship.

The following analysis explains how each table supports First Normal
Form.

#### 3.2.1 users Table

The `users` table stores information about students and administrators.

Its columns include:

-   `user_id`
-   `full_name`
-   `email`
-   `password_hash`
-   `registration_number`
-   `department`
-   `academic_year`
-   `user_role`
-   `account_status`
-   `created_at`
-   `updated_at`

**How it supports 1NF:**

-   Each record represents one user account.
-   Each column is designed to hold a single value.
-   User information is not stored as repeating groups.
-   `user_id` uniquely identifies each record through the primary key.

Optional information such as `department`, `academic_year`, and
`registration_number` can contain NULL values when unavailable. NULL
does not represent a repeating group.

**Conclusion:** The table's structure supports 1NF, provided that actual
stored values follow the atomic-value requirement.

#### 3.2.2 club_categories Table

The `club_categories` table stores the different categories to which
clubs can belong.

Its columns include:

-   `category_id`
-   `category_name`
-   `description`

**How it supports 1NF:**

-   Each record represents one club category.
-   Each column contains a single category-related value.
-   Multiple categories are stored as separate records rather than as a
    list inside one column.
-   `category_id` uniquely identifies each record.

**Conclusion:** The table supports 1NF because it contains individual
category records without repeating groups.

#### 3.2.3 clubs Table

The `clubs` table stores information about individual clubs.

Its columns include:

-   `club_id`
-   `club_name`
-   `description`
-   `category_id`
-   `logo_url`
-   `club_status`
-   `created_by`
-   `created_at`
-   `updated_at`

**How it supports 1NF:**

-   Each record represents one club.
-   Each club has a unique `club_id`.
-   Club details are stored in individual columns.
-   The category is represented using `category_id`, rather than storing
    multiple categories in a single field.

**Conclusion:** The table supports 1NF because each record represents
one club and the design does not introduce repeating groups.

#### 3.2.4 club_memberships Table

The `club_memberships` table represents the relationship between users
and clubs.

Its columns include:

-   `membership_id`
-   `user_id`
-   `club_id`
-   `membership_role`
-   `membership_status`
-   `active_flag`
-   `requested_at`
-   `reviewed_at`
-   `reviewed_by`
-   `start_date`
-   `left_at`

**How it supports 1NF:**

-   Each record represents one membership request or membership history
    record.
-   Each membership is identified by `membership_id`.
-   Each row contains one user reference and one club reference.
-   Membership status and role are stored as individual values.
-   Multiple memberships are represented using separate rows rather than
    multiple club IDs in one column.

The `active_flag` column is a generated virtual column derived from
`membership_status`. It does not store an independently entered list of
values.

**Conclusion:** The table's structure supports 1NF because each
membership is represented by an individual record without repeating
groups.

#### 3.2.5 events Table

The `events` table stores information about events organized by clubs.

Its columns include:

-   `event_id`
-   `club_id`
-   `event_name`
-   `description`
-   `event_date`
-   `start_time`
-   `end_time`
-   `venue`
-   `max_capacity`
-   `event_status`
-   `created_by`
-   `created_at`
-   `updated_at`

**How it supports 1NF:**

-   Each record represents one event.
-   Each event is uniquely identified by `event_id`.
-   Event details are stored in separate columns.
-   The club associated with an event is represented through `club_id`.
-   Multiple events organized by the same club are represented by
    separate records.

**Conclusion:** The table supports 1NF because it contains individual
event records without repeating groups.

#### 3.2.6 event_registrations Table

The `event_registrations` table represents the relationship between
users and events.

Its columns include:

-   `registration_id`
-   `event_id`
-   `user_id`
-   `registration_status`
-   `registered_at`
-   `cancelled_at`

**How it supports 1NF:**

-   Each record represents one student's registration for one event.
-   Each record is uniquely identified by `registration_id`.
-   Each row contains one user reference and one event reference.
-   Registration status and timestamps are stored as individual values.
-   Multiple registrations are represented through separate records.

**Conclusion:** The table supports 1NF because each registration is
represented by an individual record.

#### 3.2.7 attendance Table

The `attendance` table stores attendance information for event
registrations.

Its columns include:

-   `attendance_id`
-   `registration_id`
-   `attendance_status`
-   `marked_at`
-   `marked_by`

**How it supports 1NF:**

-   Each record represents one attendance record.
-   Each record has a unique `attendance_id`.
-   Each attendance record refers to one event registration.
-   Attendance status and marking information are stored in separate
    columns.
-   Multiple attendance records are represented using separate rows.

The unique constraint on `registration_id` additionally ensures that a
registration can have at most one attendance record.

**Conclusion:** The table supports 1NF because its structure contains
individual attendance records without repeating groups.

### 3.3 Important Note About Atomicity

The SQL data types used in the database, such as `INT`, `VARCHAR`,
`DATE`, `TIME`, and `DATETIME`, help define the expected structure of
individual values.

However, SQL data types alone do not prove that the actual stored data
is atomic.

For example, a `VARCHAR` column could still contain a comma-separated
list of several club names.

Therefore, the database design provides separate columns for individual
attributes, but actual stored values must also follow the atomic-value
requirement of 1NF.

### 3.4 Conclusion of 1NF

Based on the table structures and declared primary keys, all seven
tables are designed to support First Normal Form.

Each table represents a specific entity or relationship, and the design
avoids repeating groups and multivalued columns.

Actual compliance also depends on ensuring that stored values remain
atomic.

------------------------------------------------------------------------

## 4. Second Normal Form (2NF)

### 4.1 Definition of Second Normal Form

A table is in Second Normal Form (2NF) when:

1.  It already satisfies First Normal Form.
2.  Every non-key attribute depends on the whole candidate key.
3.  There are no partial functional dependencies.

A partial dependency occurs when a non-key attribute depends on only
part of a composite candidate key instead of the entire key.

For example, consider a table with a composite candidate key consisting
of `student_id` and `club_id`.

If `student_name` depends only on `student_id`, rather than on the
complete combination of `student_id` and `club_id`, a partial dependency
exists.

To achieve 2NF, such dependencies must be eliminated.

### 4.2 Primary Keys and Candidate Keys

Before analyzing 2NF, it is important to understand the distinction
between primary keys and candidate keys.

-   **Primary Key:** The candidate key selected to uniquely identify
    records in a table.
-   **Candidate Key:** A minimal set of attributes that uniquely
    identifies each record.
-   **Alternate Key:** A candidate key that is not selected as the
    primary key.
-   **Composite Key:** A key consisting of two or more attributes.

A UNIQUE constraint may establish an alternate candidate key when its
columns are non-NULL and uniquely identify every row.

However, a composite UNIQUE constraint does not automatically become a
composite primary key.

### 4.3 2NF Analysis of the Actual Database

#### 4.3.1 users Table

**Primary Key:** `user_id`

**Additional UNIQUE constraints:** - `email` - `registration_number`

The `email` column is NOT NULL and UNIQUE, so it also provides an
alternate candidate key.

The `registration_number` column is UNIQUE but nullable. MySQL permits
multiple NULL values in a UNIQUE column. Therefore, it is not a
candidate key for the entire table under the usual relational
definition.

**2NF Analysis:**

The table uses a single-column primary key, `user_id`.

The other attributes depend on the user identified by this key.

There cannot be a partial dependency on a single-column primary key
because there is no smaller subset of the primary key.

**Conclusion:** The table satisfies 2NF, assuming the declared keys
accurately represent the relevant business identifiers and no additional
candidate keys or functional dependencies introduce partial
dependencies.

#### 4.3.2 club_categories Table

**Primary Key:** `category_id`

**Additional UNIQUE constraint:** - `category_name`

Since `category_name` is NOT NULL and UNIQUE, it is an alternate
candidate key.

**2NF Analysis:**

The table has a single-column primary key.

The category description and category name are associated with the
category identified by `category_id`.

There is no possibility of a partial dependency on the single-column
primary key.

**Conclusion:** The table satisfies 2NF based on its declared key
structure.

#### 4.3.3 clubs Table

**Primary Key:** `club_id`

**Additional UNIQUE constraint:** - `club_name`

Since `club_name` is NOT NULL and UNIQUE, it is an alternate candidate
key.

**2NF Analysis:**

The table has a single-column primary key.

Attributes such as `club_name`, `description`, `category_id`,
`club_status`, and `created_by` are associated with the club identified
by `club_id`.

There cannot be a partial dependency on a single-column primary key.

**Conclusion:** The table satisfies 2NF based on its declared key
structure and the absence of additional partial dependencies.

#### 4.3.4 club_memberships Table

**Primary Key:** `membership_id`

**Composite UNIQUE constraint:**

`UNIQUE (user_id, club_id, active_flag)`

This constraint prevents duplicate active membership records for the
same user and club.

The generated `active_flag` behaves as follows:

-   `1` for pending or approved memberships.
-   `NULL` for rejected or left memberships.

Because MySQL allows multiple NULL values in a UNIQUE constraint,
multiple historical membership records for the same user and club are
permitted.

**Important distinction:**

The composite UNIQUE constraint is not the table's primary key.

Furthermore, because `active_flag` can be NULL, this composite
constraint does not uniquely identify every row in the table. It is
therefore a conditional uniqueness rule rather than a candidate key for
the complete relation.

**2NF Analysis:**

The declared primary key is the single-column attribute `membership_id`.

All membership-specific attributes are associated with the individual
membership record.

For example:

-   `membership_role` describes the role associated with a membership.
-   `membership_status` describes the current or historical state of
    that membership.
-   `requested_at` records when the membership was requested.
-   `reviewed_by` identifies the user who reviewed the request.

Since the primary key contains only one attribute, partial dependencies
on a subset of the primary key cannot occur.

**Conclusion:** The table satisfies 2NF based on its declared primary
key. The composite UNIQUE constraint serves a separate purpose of
enforcing conditional uniqueness.

#### 4.3.5 events Table

**Primary Key:** `event_id`

No additional UNIQUE constraints are declared.

**2NF Analysis:**

The table uses a single-column primary key.

Attributes such as `event_name`, `event_date`, `venue`, `max_capacity`,
and `event_status` are associated with the event identified by
`event_id`.

There is no possibility of a partial dependency on the single-column
primary key.

**Conclusion:** The table satisfies 2NF based on its declared key
structure.

#### 4.3.6 event_registrations Table

**Primary Key:** `registration_id`

**Composite UNIQUE constraint:**

`UNIQUE (event_id, user_id)`

This constraint ensures that a particular user can have only one
registration record for a particular event.

It prevents duplicate registration records while allowing the existing
registration to be cancelled and later reactivated.

**Important distinction:**

The composite UNIQUE constraint does not replace the declared primary
key.

However, both `event_id` and `user_id` are NOT NULL, and their
combination uniquely identifies every registration record. Therefore,
the combination is an alternate candidate key.

**2NF Analysis:**

The primary key is the single-column attribute `registration_id`.

The registration attributes depend on the individual registration
record.

For example:

-   `registration_status` describes the registration.
-   `registered_at` records the registration timestamp.
-   `cancelled_at` records the cancellation timestamp when applicable.

There is no partial dependency on the single-column primary key.

The alternate candidate key `(event_id, user_id)` also identifies one
registration record. Under the declared business rule of one
registration per user per event, registration-specific attributes depend
on the complete combination rather than on either foreign key
independently.

**Conclusion:** The table satisfies 2NF under the stated business rule
and declared uniqueness constraint.

#### 4.3.7 attendance Table

**Primary Key:** `attendance_id`

**Additional UNIQUE constraint:** - `registration_id`

Since `registration_id` is NOT NULL and UNIQUE, it is an alternate
candidate key.

This ensures that each event registration can have at most one
attendance record.

**2NF Analysis:**

The table has a single-column primary key.

Attributes such as `attendance_status`, `marked_at`, and `marked_by`
describe the attendance record identified by `attendance_id`.

There is no possibility of a partial dependency on the single-column
primary key.

**Conclusion:** The table satisfies 2NF based on its declared key
structure.

### 4.4 Summary of 2NF Analysis

  -------------------------------------------------------------------------------------------------
  Table Name              Declared Primary    Additional Candidate Key /          2NF Status
                          Key                 Uniqueness Rule                     
  ----------------------- ------------------- ----------------------------------- -----------------
  `users`                 `user_id`           `email` is an alternate candidate   Satisfies
                                              key; nullable `registration_number` 
                                              is a conditional unique identifier  

  `club_categories`       `category_id`       `category_name`                     Satisfies

  `clubs`                 `club_id`           `club_name`                         Satisfies

  `club_memberships`      `membership_id`     Conditional uniqueness on           Satisfies
                                              `(user_id, club_id, active_flag)`   

  `events`                `event_id`          No additional UNIQUE constraint     Satisfies

  `event_registrations`   `registration_id`   `(event_id, user_id)`               Satisfies

  `attendance`            `attendance_id`     `registration_id`                   Satisfies
  -------------------------------------------------------------------------------------------------

### 4.5 Conclusion of 2NF

All seven tables use single-column primary keys.

A single-column primary key cannot have a partial dependency on a proper
subset of itself.

The additional UNIQUE constraints provide alternate candidate keys or
conditional uniqueness rules, depending on their NULL behavior.

Based on the declared key structure and the stated business assumptions,
the tables satisfy Second Normal Form.

------------------------------------------------------------------------

## 5. Third Normal Form (3NF)

### 5.1 Definition of Third Normal Form

A table is in Third Normal Form (3NF) when:

1.  It already satisfies Second Normal Form.
2.  It contains no problematic transitive dependencies of non-key
    attributes on candidate keys.

A transitive dependency occurs when a non-key attribute depends on
another non-key attribute instead of depending directly on a candidate
key.

In simple terms, non-key attributes should depend on the key, the whole
key, and nothing but the key.

For example, consider the following hypothetical table:

  Student ID   Department ID   Department Name
  ------------ --------------- ------------------
  101          10              Computer Science
  102          10              Computer Science

Suppose the functional dependencies are:

`student_id → department_id`

`department_id → department_name`

Therefore:

`student_id → department_name`

The department name depends on the student ID through the department ID.

This is a transitive dependency.

To avoid unnecessary duplication, department information can be
maintained in a separate department table.

### 5.2 3NF Analysis of the Actual Database

#### 5.2.1 users Table

**Primary Key:** `user_id`

**Alternate Candidate Key:** `email`

The `users` table stores user-related information in one central
location.

Its attributes include:

-   Personal information.
-   Login-related information.
-   User role.
-   Account status.
-   Registration and update timestamps.

**3NF Analysis:**

The table does not store separate club, event, membership, or attendance
details.

These details are maintained in their respective tables and refer to
users through `user_id`.

For example, a student's name and email are stored in the `users` table
rather than being repeated in every membership and event registration
record.

The declared keys establish the dependency:

`user_id → full_name, email, password_hash, registration_number, department, academic_year, user_role, account_status, created_at, updated_at`

The schema does not establish an additional non-key dependency among
these attributes.

For example, it does not declare that `department` determines
`academic_year` or `user_role`.

Such dependencies should not be assumed without additional business
rules.

**Conclusion:** The table appears to satisfy 3NF based on the declared
keys and the absence of established transitive dependencies.

#### 5.2.2 club_categories Table

**Primary Key:** `category_id`

**Alternate Candidate Key:** `category_name`

The `club_categories` table maintains category information separately
from club information.

**3NF Analysis:**

If category information were stored repeatedly in the `clubs` table, the
category name and description could be duplicated for every club
belonging to that category.

Instead, the category details are stored once in `club_categories`.

The `clubs` table references the category using `category_id`.

The functional dependency is:

`category_id → category_name, description`

The unique constraint on `category_name` also establishes:

`category_name → category_id, description`

The table does not establish a non-key attribute determining another
non-key attribute.

**Conclusion:** The table appears to satisfy 3NF because category
information is maintained independently and its non-key attributes
depend on its candidate keys.

#### 5.2.3 clubs Table

**Primary Key:** `club_id`

**Alternate Candidate Key:** `club_name`

The `clubs` table stores information about individual clubs.

**3NF Analysis:**

The table stores club-specific attributes such as:

-   Club name.
-   Description.
-   Category reference.
-   Logo information.
-   Club status.
-   Creator reference.
-   Creation and update timestamps.

The category name and description are not repeated in the `clubs` table.

Instead, the table stores `category_id` as a foreign key referencing
`club_categories`.

Similarly, creator information is not duplicated in the table. The
`created_by` column references the corresponding user in `users`.

The functional dependency is:

`club_id → club_name, description, category_id, logo_url, club_status, created_by, created_at, updated_at`

The unique club name also provides:

`club_name → club_id, description, category_id, logo_url, club_status, created_by, created_at, updated_at`

The schema does not establish that `category_id` determines `club_name`,
or that `created_by` determines the other club attributes.

**Conclusion:** The table appears to satisfy 3NF because club
information is maintained separately from category and user information,
with no additional transitive dependencies established by the schema.

#### 5.2.4 club_memberships Table

**Primary Key:** `membership_id`

The `club_memberships` table stores the relationship between users and
clubs.

It also maintains membership-specific information, including roles,
statuses, request timestamps, review details, and membership dates.

**3NF Analysis:**

The table references users and clubs using foreign keys:

-   `user_id` references `users`.
-   `club_id` references `clubs`.
-   `reviewed_by` references `users`.

Instead of storing the student's name, email, club name, or category
details in every membership record, the table stores the corresponding
identifiers.

This reduces duplication and keeps user and club information
centralized.

The primary-key dependency is:

`membership_id → user_id, club_id, membership_role, membership_status, active_flag, requested_at, reviewed_at, reviewed_by, start_date, left_at`

The generated `active_flag` requires special consideration.

It is calculated directly from `membership_status`:

`membership_status → active_flag`

Therefore, if `active_flag` is treated as an ordinary attribute in a
purely formal relational analysis, it introduces a non-key-to-non-key
dependency.

However, the SQL script defines it as a **VIRTUAL generated column**. It
is computed from `membership_status` rather than maintained as an
independently entered value.

Its purpose is to support the conditional UNIQUE constraint that
prevents duplicate active memberships while allowing historical
membership records.

Consequently, the generated column is a derived implementation attribute
rather than an independently maintained business fact.

This distinction should be considered when evaluating strict 3NF
compliance.

The remaining membership attributes are associated with the individual
membership record, subject to the business rules described in the SQL
script.

**Conclusion:** The base membership information is organized in a manner
consistent with 3NF. However, the virtual generated column introduces a
derived functional dependency that should be acknowledged in a strict
formal analysis.

#### 5.2.5 events Table

**Primary Key:** `event_id`

The `events` table stores information about events organized by clubs.

**3NF Analysis:**

The table contains event-specific attributes, including:

-   Event name.
-   Description.
-   Date and time.
-   Venue.
-   Capacity.
-   Event status.
-   Club reference.
-   Creator reference.

The table references the corresponding club using `club_id` and the
creator using `created_by`.

Club information is maintained in the `clubs` table, while user
information is maintained in the `users` table.

Therefore, the event table does not need to repeat club names, category
details, or creator names.

The functional dependency is:

`event_id → club_id, event_name, description, event_date, start_time, end_time, venue, max_capacity, event_status, created_by, created_at, updated_at`

The schema does not establish any additional functional dependencies
among non-key event attributes.

For example, it does not establish that the venue determines the event
date or that the club ID determines the event name.

**Conclusion:** The table appears to satisfy 3NF based on its declared
primary key, foreign keys, and the absence of established transitive
dependencies.

#### 5.2.6 event_registrations Table

**Primary Key:** `registration_id`

**Alternate Candidate Key:** `(event_id, user_id)`

The `event_registrations` table stores student registrations for events.

**3NF Analysis:**

The table separates registration information from both user information
and event information.

It references:

-   `event_id` from the `events` table.
-   `user_id` from the `users` table.

Student names, email addresses, event names, and event descriptions are
not duplicated in the registration table.

Instead, the corresponding IDs are stored as foreign keys.

The primary-key dependency is:

`registration_id → event_id, user_id, registration_status, registered_at, cancelled_at`

The alternate candidate key also establishes:

`(event_id, user_id) → registration_status, registered_at, cancelled_at`

This reflects the declared rule that one user can have only one
registration record for a particular event.

The schema does not establish an additional non-key dependency among the
registration-specific attributes.

**Conclusion:** The table appears to satisfy 3NF because registration
details are stored separately and depend on the declared candidate keys.

#### 5.2.7 attendance Table

**Primary Key:** `attendance_id`

**Alternate Candidate Key:** `registration_id`

The `attendance` table stores attendance information for event
registrations.

**3NF Analysis:**

The table separates attendance information from registration
information.

It references:

-   `registration_id` from `event_registrations`.
-   `marked_by` from `users`.

The student's name, event name, and registration details are not
duplicated in the attendance table.

Instead, the attendance record refers to the corresponding registration
using `registration_id`.

The primary-key dependency is:

`attendance_id → registration_id, attendance_status, marked_at, marked_by`

The UNIQUE constraint on `registration_id` also establishes:

`registration_id → attendance_status, marked_at, marked_by`

This means that each registration can have at most one attendance
record.

The schema does not establish an additional non-key dependency among the
attendance-specific attributes.

**Conclusion:** The table appears to satisfy 3NF because attendance
information is stored separately and depends on its candidate keys.

### 5.3 Important Design Decisions Supporting 3NF

The following design decisions help reduce transitive dependencies and
unnecessary duplication.

#### A. Separating Club Categories

Club category information is stored in `club_categories` rather than
being repeated in every club record.

The `clubs` table stores only `category_id` as a foreign key.

This ensures that category information is maintained centrally.

#### B. Separating Club Information from Membership Information

The `clubs` table stores club details, while `club_memberships` stores
the relationship between users and clubs.

This avoids repeating club details and student details in every
membership record.

It also allows multiple students to join the same club and one student
to join multiple clubs.

#### C. Separating Events from Event Registrations

The `events` table stores event details, while `event_registrations`
stores the relationship between users and events.

This prevents event information from being repeated for every registered
student.

It also allows one event to have multiple registrations and one user to
register for multiple events.

#### D. Separating Attendance from Event Registrations

The `attendance` table stores attendance information separately from
registration information.

The `registration_id` foreign key connects each attendance record to its
corresponding registration.

The UNIQUE constraint on `registration_id` ensures that at most one
attendance record exists for each registration.

This separation avoids storing attendance-related attributes directly in
every registration record.

#### E. Maintaining User Information Centrally

The `users` table acts as the central location for student and
administrator information.

Other tables reference users through foreign keys.

For example:

-   `clubs.created_by` references the user who created a club.
-   `club_memberships.user_id` references the student associated with a
    membership.
-   `club_memberships.reviewed_by` references the user who reviewed a
    membership.
-   `events.created_by` references the user who created an event.
-   `event_registrations.user_id` references the registered student.
-   `attendance.marked_by` references the user who recorded attendance.

This avoids repeatedly storing user information in multiple tables.

### 5.4 Conclusion of 3NF

The database follows a normalized structure in which different entities
and relationships are maintained in separate tables.

Most attributes depend directly on their declared candidate keys, and
the schema does not establish additional transitive dependencies among
the ordinary business attributes.

One special consideration is the virtual generated `active_flag` column
in `club_memberships`, which is functionally dependent on
`membership_status`.

Therefore, the base business data appears consistent with 3NF, while
strict formal analysis should acknowledge the derived-column dependency.

Complete proof of 3NF also requires confirming that no additional
business-level functional dependencies exist beyond those established by
the schema and stated assumptions.

------------------------------------------------------------------------

## 6. Functional Dependencies

### 6.1 What are Functional Dependencies?

A functional dependency describes a relationship between attributes in a
database table.

If attribute `A` functionally determines attribute `B`, it is written
as:

`A → B`

This means that whenever two records have the same value of `A`, they
must also have the same value of `B`.

The attribute or group of attributes on the left side is called the
determinant.

For example:

`user_id → full_name`

This means that a particular user ID determines the corresponding user's
full name.

Functional dependencies are important in normalization because they help
identify candidate keys, partial dependencies, and transitive
dependencies.

### 6.2 Functional Dependencies in the Club Management System

The following dependencies are based on the declared primary keys,
applicable UNIQUE constraints, generated-column definition, and the
business rules stated in the SQL script.

#### 6.2.1 users Table

**Primary Key:** `user_id`

**Alternate Candidate Key:** `email`

Functional dependencies:

`user_id → full_name, email, password_hash, registration_number, department, academic_year, user_role, account_status, created_at, updated_at`

`email → user_id, full_name, password_hash, registration_number, department, academic_year, user_role, account_status, created_at, updated_at`

**Explanation:**

-   `user_id` uniquely identifies each user.
-   `email` is also unique and NOT NULL, so it can identify a user.
-   The remaining attributes describe the corresponding user account.

The nullable `registration_number` is UNIQUE, but because it permits
multiple NULL values, it is not treated as a candidate key for the
entire table.

#### 6.2.2 club_categories Table

**Primary Key:** `category_id`

**Alternate Candidate Key:** `category_name`

Functional dependencies:

`category_id → category_name, description`

`category_name → category_id, description`

**Explanation:**

-   `category_id` uniquely identifies a category.
-   `category_name` is also unique and NOT NULL.
-   The description belongs to the corresponding category.

#### 6.2.3 clubs Table

**Primary Key:** `club_id`

**Alternate Candidate Key:** `club_name`

Functional dependencies:

`club_id → club_name, description, category_id, logo_url, club_status, created_by, created_at, updated_at`

`club_name → club_id, description, category_id, logo_url, club_status, created_by, created_at, updated_at`

**Explanation:**

-   `club_id` uniquely identifies each club.
-   `club_name` is also unique and NOT NULL.
-   The remaining attributes describe the corresponding club.

The foreign key `category_id` references `club_categories`, while
`created_by` references `users`.

These foreign keys establish relationships but do not imply that either
attribute uniquely identifies a club.

#### 6.2.4 club_memberships Table

**Primary Key:** `membership_id`

**Conditional UNIQUE constraint:** `(user_id, club_id, active_flag)`

Functional dependencies:

`membership_id → user_id, club_id, membership_role, membership_status, active_flag, requested_at, reviewed_at, reviewed_by, start_date, left_at`

`membership_status → active_flag`

**Explanation:**

-   `membership_id` uniquely identifies each membership record.
-   The other membership attributes describe that particular membership.
-   `active_flag` is derived from `membership_status`.

The composite UNIQUE constraint:

`UNIQUE (user_id, club_id, active_flag)`

prevents duplicate active membership records for the same user and club.

However, it is not a candidate key for the entire table because
historical rows can have `active_flag = NULL`, and MySQL permits
multiple NULL values in a UNIQUE constraint.

Therefore, the following should not be treated as an unconditional
functional dependency across all membership records:

`(user_id, club_id, active_flag) → all other attributes`

It provides uniqueness for the non-NULL active membership combinations,
not for every row.

#### 6.2.5 events Table

**Primary Key:** `event_id`

Functional dependency:

`event_id → club_id, event_name, description, event_date, start_time, end_time, venue, max_capacity, event_status, created_by, created_at, updated_at`

**Explanation:**

-   `event_id` uniquely identifies each event.
-   The remaining attributes describe the event.
-   `club_id` references the club organizing the event.
-   `created_by` references the user who created it.

No additional UNIQUE constraint is declared for the event name.

Therefore, `event_name` should not be treated as a candidate key based
on the SQL script.

#### 6.2.6 event_registrations Table

**Primary Key:** `registration_id`

**Alternate Candidate Key:** `(event_id, user_id)`

Functional dependencies:

`registration_id → event_id, user_id, registration_status, registered_at, cancelled_at`

`(event_id, user_id) → registration_status, registered_at, cancelled_at`

**Explanation:**

-   `registration_id` uniquely identifies each registration.
-   The combination of `event_id` and `user_id` also uniquely identifies
    a registration.
-   The UNIQUE constraint prevents the same user from having multiple
    registration records for the same event.
-   Registration status and timestamps belong to the corresponding
    registration.

The combination `(event_id, user_id)` is an alternate candidate key, not
the declared primary key.

#### 6.2.7 attendance Table

**Primary Key:** `attendance_id`

**Alternate Candidate Key:** `registration_id`

Functional dependencies:

`attendance_id → registration_id, attendance_status, marked_at, marked_by`

`registration_id → attendance_status, marked_at, marked_by`

**Explanation:**

-   `attendance_id` uniquely identifies each attendance record.
-   `registration_id` is also unique and NOT NULL.
-   Therefore, each registration can have at most one attendance record.
-   Attendance status, marking timestamp, and marking user are
    associated with that record.

### 6.3 Functional Dependency Summary

  ---------------------------------------------------------------------------------------------------------
  Table                   Primary Key         Additional Candidate    Important Dependency
                                              Key                     
  ----------------------- ------------------- ----------------------- -------------------------------------
  `users`                 `user_id`           `email`                 `user_id →` user attributes

  `club_categories`       `category_id`       `category_name`         `category_id → category attributes`

  `clubs`                 `club_id`           `club_name`             `club_id →` club attributes

  `club_memberships`      `membership_id`     None established by the `membership_id →` membership
                                              composite conditional   attributes
                                              UNIQUE constraint       

  `events`                `event_id`          None declared           `event_id →` event attributes

  `event_registrations`   `registration_id`   `(event_id, user_id)`   `(event_id, user_id) →` registration
                                                                      attributes

  `attendance`            `attendance_id`     `registration_id`       `registration_id →` attendance
                                                                      attributes
  ---------------------------------------------------------------------------------------------------------

**Note:** The functional dependencies shown above are justified by
declared keys and applicable uniqueness constraints. Additional semantic
dependencies should only be included when supported by explicit business
rules.

------------------------------------------------------------------------

## 7. Table-Wise Normalization Summary

The following table summarizes the normalization analysis of all seven
tables.

  ---------------------------------------------------------------------------------------------
  Table Name              1NF            2NF            3NF             Explanation
  ----------------------- -------------- -------------- --------------- -----------------------
  `users`                 Satisfies      Satisfies      Appears to      Individual user records
                                                        satisfy         are maintained using a
                                                                        single-column primary
                                                                        key. Email provides an
                                                                        alternate candidate
                                                                        key. No additional
                                                                        transitive dependencies
                                                                        are established by the
                                                                        schema.

  `club_categories`       Satisfies      Satisfies      Satisfies       Each record represents
                                                                        one category. Both
                                                                        `category_id` and
                                                                        `category_name`
                                                                        uniquely identify
                                                                        categories. Category
                                                                        details are maintained
                                                                        separately.

  `clubs`                 Satisfies      Satisfies      Appears to      Each record represents
                                                        satisfy         one club. Club
                                                                        information is
                                                                        separated from category
                                                                        and creator information
                                                                        through foreign keys.

  `club_memberships`      Satisfies      Satisfies      Requires        Membership records are
                                                        qualification   individually
                                                                        identified. The
                                                                        composite UNIQUE
                                                                        constraint enforces
                                                                        conditional uniqueness,
                                                                        not a composite
                                                                        candidate key. The
                                                                        virtual `active_flag`
                                                                        introduces a derived
                                                                        dependency on
                                                                        `membership_status`.

  `events`                Satisfies      Satisfies      Appears to      Each event is stored
                                                        satisfy         separately and
                                                                        references its
                                                                        organizing club and
                                                                        creator. No additional
                                                                        non-key dependencies
                                                                        are established by the
                                                                        schema.

  `event_registrations`   Satisfies      Satisfies      Appears to      Each registration is
                                                        satisfy         individually
                                                                        identified.
                                                                        `(event_id, user_id)`
                                                                        is an alternate
                                                                        candidate key.
                                                                        Registration
                                                                        information is
                                                                        separated from event
                                                                        and user information.

  `attendance`            Satisfies      Satisfies      Appears to      Each attendance record
                                                        satisfy         is individually
                                                                        identified.
                                                                        `registration_id` is an
                                                                        alternate candidate
                                                                        key, ensuring at most
                                                                        one attendance record
                                                                        per registration.
  ---------------------------------------------------------------------------------------------

### 7.1 Overall Interpretation

Based on the declared schema:

-   All seven tables are structured to support 1NF, subject to atomic
    stored values.
-   All seven tables satisfy 2NF based on their declared primary keys
    and applicable candidate keys.
-   The ordinary business attributes appear consistent with 3NF,
    provided no additional business-level functional dependencies exist.
-   The virtual generated `active_flag` in `club_memberships` requires
    special consideration in a strict formal 3NF evaluation.

Therefore, the database is designed with a strong 3NF-oriented
structure, although complete formal verification depends on the
underlying business rules and treatment of generated attributes.

------------------------------------------------------------------------

## 8. Database Design Considerations Supporting Normalization

In addition to normalization, the Club Management System uses several
database design mechanisms to maintain data integrity and improve
consistency.

### 8.1 Primary Keys

Every table has a primary key that uniquely identifies its records.

  Table                   Primary Key
  ----------------------- -------------------
  `users`                 `user_id`
  `club_categories`       `category_id`
  `clubs`                 `club_id`
  `club_memberships`      `membership_id`
  `events`                `event_id`
  `event_registrations`   `registration_id`
  `attendance`            `attendance_id`

Primary keys help prevent duplicate record identification and provide a
reliable way to reference records from other tables.

Most primary keys are generated automatically using `AUTO_INCREMENT`.

### 8.2 Foreign Keys

Foreign keys establish relationships between related tables and help
maintain referential integrity.

The following foreign-key relationships are defined:

  Foreign Key                      References
  -------------------------------- ---------------------------------------
  `clubs.category_id`              `club_categories.category_id`
  `clubs.created_by`               `users.user_id`
  `club_memberships.user_id`       `users.user_id`
  `club_memberships.club_id`       `clubs.club_id`
  `club_memberships.reviewed_by`   `users.user_id`
  `events.club_id`                 `clubs.club_id`
  `events.created_by`              `users.user_id`
  `event_registrations.event_id`   `events.event_id`
  `event_registrations.user_id`    `users.user_id`
  `attendance.registration_id`     `event_registrations.registration_id`
  `attendance.marked_by`           `users.user_id`

Foreign keys prevent records from referencing nonexistent parent
records.

They also support the separation of entities by allowing related
information to be retrieved through table relationships instead of
duplicated storage.

### 8.3 UNIQUE Constraints

UNIQUE constraints prevent duplicate values or combinations of values.

Important examples include:

  -----------------------------------------------------------------------------------
  Table                   UNIQUE Constraint                   Purpose
  ----------------------- ----------------------------------- -----------------------
  `users`                 `email`                             Prevents duplicate
                                                              email addresses.

  `users`                 `registration_number`               Prevents duplicate
                                                              non-NULL registration
                                                              numbers.

  `club_categories`       `category_name`                     Prevents duplicate
                                                              category names.

  `clubs`                 `club_name`                         Prevents duplicate club
                                                              names.

  `club_memberships`      `(user_id, club_id, active_flag)`   Prevents duplicate
                                                              active memberships for
                                                              the same user and club.

  `event_registrations`   `(event_id, user_id)`               Ensures one
                                                              registration record per
                                                              user per event.

  `attendance`            `registration_id`                   Ensures at most one
                                                              attendance record per
                                                              registration.
  -----------------------------------------------------------------------------------

UNIQUE constraints support data integrity by enforcing additional
identification and business rules.

They should not be confused with primary keys, particularly when a
UNIQUE constraint allows NULL values.

### 8.4 Lookup and Reference Tables

The `club_categories` table acts as a lookup or reference table.

Instead of storing category names repeatedly in the `clubs` table, each
club references a category through `category_id`.

This provides several benefits:

-   Reduces repeated category information.
-   Maintains consistent category names.
-   Makes category information easier to manage.
-   Allows multiple clubs to belong to the same category.

The `users` table also acts as a centralized reference for user
information used throughout the database.

### 8.5 Generated Columns

The `club_memberships` table contains a generated virtual column named
`active_flag`.

Its value is calculated using the following logic:

-   `1` when `membership_status` is `pending` or `approved`.
-   `NULL` when `membership_status` is `rejected` or `left`.

This generated column is used with the UNIQUE constraint:

`UNIQUE (user_id, club_id, active_flag)`

Its purpose is to prevent multiple active membership records for the
same user and club while allowing historical records to remain in the
database.

Because the column is virtual, its value is calculated rather than
independently stored.

It is therefore important to distinguish this implementation mechanism
from an ordinary business attribute when performing strict normalization
analysis.

### 8.6 Separation of Entities and Relationships

The database separates major entities and their relationships into
individual tables.

Examples include:

-   Users and clubs are maintained separately.
-   The many-to-many relationship between users and clubs is maintained
    in `club_memberships`.
-   Events are maintained separately from their registrations.
-   The many-to-many relationship between users and events is maintained
    in `event_registrations`.
-   Attendance information is maintained separately in `attendance`.

This design reduces unnecessary duplication and makes it easier to
manage each entity independently.

### 8.7 The v_event_overview Database View

The SQL script defines a view named `v_event_overview`.

This view combines information from the `events` table with calculated
registration statistics.

It provides information such as:

-   Event details.
-   Lifecycle status.
-   Registered participant count.
-   Remaining seats.

The view calculates the event lifecycle status using the event date,
start time, end time, and event status.

It also calculates the registered participant count using records from
`event_registrations` whose status is `registered`.

The remaining seats are calculated using the event capacity and
registered participant count.

**Importance for Normalization:**

A database view is a virtual representation of data retrieved from
underlying tables.

It does not create a new physical base table containing independently
maintained copies of the underlying data.

Therefore:

-   The view does not introduce a new physical entity.
-   The calculated values are derived from existing records.
-   The view does not independently change the normalization level of
    the underlying tables.
-   The underlying tables remain the primary structures considered
    during normalization analysis.

The view improves convenience by presenting related and calculated
information without requiring that these values be independently stored
in the base tables.

### 8.8 CHECK Constraints and Indexes

Normalization and data integrity are related concepts, but they are not
the same.

The SQL script uses CHECK constraints to enforce additional rules.

Examples include:

-   Ensuring that a user's full name is not empty.
-   Validating the academic year range.
-   Ensuring that club and event names are not empty.
-   Ensuring that an event ends after it starts.
-   Ensuring that event capacity is positive when specified.
-   Validating membership status and its related dates.
-   Ensuring that a departed leader does not retain the leader role.
-   Validating registration and cancellation timestamps.

These constraints prevent invalid combinations of values from being
inserted or updated.

The database also uses indexes to improve query performance.

Examples include indexes on:

-   User names and departments.
-   Club categories and statuses.
-   Membership users and club statuses.
-   Event dates and statuses.
-   Registration statuses.
-   Attendance marking users.

Indexes help retrieve records efficiently but do not, by themselves,
establish that a database is normalized.

Similarly, CHECK constraints enforce valid data conditions but do not
independently prove compliance with 1NF, 2NF, or 3NF.

Normalization focuses on the logical organization of data and its
functional dependencies, whereas constraints and indexes provide
additional integrity and performance benefits.

------------------------------------------------------------------------

## 9. Conclusion

The Club Management System database is designed using normalization
principles to organize information efficiently and reduce unnecessary
data duplication.

The seven tables separate user accounts, club categories, clubs,
memberships, events, event registrations, and attendance records into
distinct structures.

This separation ensures that information is maintained in appropriate
locations instead of being repeatedly stored across unrelated records.

The use of primary keys provides unique identification, while foreign
keys establish relationships and maintain referential integrity. UNIQUE
constraints enforce additional business rules and prevent duplicate
records. The lookup table and generated virtual column further support
consistency and efficient data organization.

Based on the declared schema, all seven tables are structured to support
First Normal Form and Second Normal Form. Their ordinary business
attributes also appear consistent with Third Normal Form.

One qualification is the virtual generated `active_flag` column in
`club_memberships`, which is derived from `membership_status` and
introduces a functional dependency that should be acknowledged in a
strict formal 3NF analysis.

Additionally, the SQL script defines the database structure but does not
contain sample records. Therefore, actual data atomicity and all
possible business-level functional dependencies cannot be independently
verified from the script alone.

Overall, the database demonstrates a well-organized,
normalization-oriented relational design that supports data consistency,
reduces redundancy, and provides a maintainable foundation for the Club
Management System.
