-- Rafiq database schema DDL snapshot.
-- Purpose: documentation/demo only. Use Drizzle migrations for real deployments.

CREATE TYPE user_role AS ENUM ('student', 'coach', 'super_admin');
CREATE TYPE grade_level AS ENUM ('first_sec', 'second_sec', 'third_sec');
CREATE TYPE egypt_city AS ENUM (
  'cairo',
  'giza',
  'alexandria',
  'dakahlia',
  'red_sea',
  'beheira',
  'fayoum',
  'gharbia',
  'ismailia',
  'monufia',
  'minya',
  'qalyubia',
  'new_valley',
  'suez',
  'aswan',
  'assiut',
  'beni_suef',
  'port_said',
  'damietta',
  'sharqia',
  'south_sinai',
  'kafr_el_sheikh',
  'matrouh',
  'luxor',
  'qena',
  'north_sinai',
  'sohag'
);
CREATE TYPE school_subject AS ENUM (
  'arabic',
  'english',
  'second_foreign_language',
  'math',
  'physics',
  'chemistry',
  'biology',
  'history',
  'geography',
  'statistics',
  'religion',
  'national_education'
);
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'done', 'missed');
CREATE TYPE session_status AS ENUM (
  'running',
  'paused',
  'completed',
  'cancelled'
);
CREATE TYPE lesson_weekday AS ENUM (
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday'
);
CREATE TYPE lesson_occurrence_status AS ENUM (
  'scheduled',
  'watched_on_time',
  'missed',
  'watched_late'
);

CREATE TABLE users (
  id serial PRIMARY KEY,
  full_name varchar(255) NOT NULL,
  phone varchar(32) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  role user_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE student_profiles (
  user_id integer PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  city egypt_city NOT NULL,
  parent_phone varchar(32) NOT NULL,
  grade_level grade_level NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE coach_assignments (
  id serial PRIMARY KEY,
  coach_id integer NOT NULL REFERENCES users(id),
  student_id integer NOT NULL REFERENCES users(id),
  assigned_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX coach_assignments_coach_student_uidx
  ON coach_assignments (coach_id, student_id);

CREATE TABLE subscription_packages (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  duration_days integer NOT NULL,
  price integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
  id serial PRIMARY KEY,
  student_id integer NOT NULL REFERENCES users(id),
  package_id integer NOT NULL REFERENCES subscription_packages(id),
  starts_at date NOT NULL,
  ends_at date NOT NULL,
  amount_paid integer NOT NULL,
  cancelled_at timestamptz,
  cancellation_reason text,
  cancelled_by integer REFERENCES users(id),
  created_by integer NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX subscriptions_active_student_dates_idx
  ON subscriptions (student_id, starts_at, ends_at)
  WHERE cancelled_at IS NULL;

CREATE INDEX subscriptions_active_ends_at_idx
  ON subscriptions (ends_at)
  WHERE cancelled_at IS NULL;

CREATE TABLE plans (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  student_id integer NOT NULL REFERENCES users(id),
  coach_id integer NOT NULL REFERENCES users(id),
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  notes text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX plans_student_id_idx ON plans (student_id);
CREATE INDEX plans_coach_created_at_idx ON plans (coach_id, created_at DESC);

CREATE TABLE tasks (
  id serial PRIMARY KEY,
  plan_id integer NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  note text,
  subject school_subject NOT NULL,
  due_at date NOT NULL,
  status task_status NOT NULL DEFAULT 'pending',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tasks_plan_due_at_idx ON tasks (plan_id, due_at);
CREATE INDEX tasks_plan_status_idx ON tasks (plan_id, status);
CREATE INDEX tasks_status_due_at_idx ON tasks (status, due_at);

CREATE TABLE task_sessions (
  id serial PRIMARY KEY,
  task_id integer NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  student_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  expected_end_at timestamptz,
  accumulated_seconds integer NOT NULL DEFAULT 0,
  last_started_at timestamptz,
  status session_status NOT NULL DEFAULT 'running',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX task_sessions_student_task_idx
  ON task_sessions (student_id, task_id);
CREATE INDEX task_sessions_status_expected_end_at_idx
  ON task_sessions (status, expected_end_at);

CREATE TABLE missed_task_resolutions (
  id serial PRIMARY KEY,
  task_id integer NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  resolved_by integer NOT NULL REFERENCES users(id),
  note varchar(1000) NOT NULL,
  resolved_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX missed_task_resolutions_task_uidx
  ON missed_task_resolutions (task_id);
CREATE INDEX missed_task_resolutions_resolved_by_idx
  ON missed_task_resolutions (resolved_by);

CREATE TABLE lessons (
  id serial PRIMARY KEY,
  student_id integer NOT NULL REFERENCES users(id),
  name varchar(255) NOT NULL,
  subject school_subject NOT NULL,
  weekday lesson_weekday NOT NULL,
  tracking_starts_on date NOT NULL DEFAULT ((now() AT TIME ZONE 'Africa/Cairo')::date),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX lessons_student_weekday_idx ON lessons (student_id, weekday);

CREATE TABLE lesson_occurrences (
  id serial PRIMARY KEY,
  lesson_id integer NOT NULL REFERENCES lessons(id),
  subscription_id integer REFERENCES subscriptions(id),
  student_id integer NOT NULL REFERENCES users(id),
  lesson_name varchar(255) NOT NULL,
  subject school_subject NOT NULL,
  scheduled_for_date date NOT NULL,
  scheduled_weekday lesson_weekday NOT NULL,
  status lesson_occurrence_status NOT NULL DEFAULT 'scheduled',
  watched_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX lesson_occurrences_lesson_date_uidx
  ON lesson_occurrences (lesson_id, scheduled_for_date);
CREATE INDEX lesson_occurrences_student_date_idx
  ON lesson_occurrences (student_id, scheduled_for_date);
CREATE INDEX lesson_occurrences_subscription_date_idx
  ON lesson_occurrences (subscription_id, scheduled_for_date);
CREATE INDEX lesson_occurrences_status_date_idx
  ON lesson_occurrences (status, scheduled_for_date);

CREATE TABLE missed_lesson_resolutions (
  id serial PRIMARY KEY,
  occurrence_id integer NOT NULL REFERENCES lesson_occurrences(id) ON DELETE CASCADE,
  resolved_by integer NOT NULL REFERENCES users(id),
  note varchar(1000) NOT NULL,
  resolved_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX missed_lesson_resolutions_occurrence_uidx
  ON missed_lesson_resolutions (occurrence_id);
CREATE INDEX missed_lesson_resolutions_resolved_by_idx
  ON missed_lesson_resolutions (resolved_by);
