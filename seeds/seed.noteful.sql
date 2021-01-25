BEGIN;

INSERT INTO noteful_folders (folder_name)
VALUES
    ('Important'),
    ('Super'),
    ('Spangley')
;

INSERT INTO noteful_notes (note_name, modified, folderId, content)
VALUES
    ('Dogs', now(), 1, 'Lorum ipsum....'),
    ('Birds', now(), 1, 'Lorum ipsum....'),
    ('Bears', now(), 1, 'Lorum ipsum....'),
    ('Lions', now(), 1, 'Lorum ipsum....'),
    ('Bats', now(), 1, 'Lorum ipsum....'),
    ('Cats', now(), 2, 'Lorum ipsum....'),
    ('Pigs', now(), 2, 'Lorum ipsum....'),
    ('Horses', now(), 2, 'Lorum ipsum....'),
    ('Elephants', now(), 2, 'Lorum ipsum....'),
    ('Turtles', now(), 2, 'Lorum ipsum....'),
    ('Zebras', now(), 3, 'Lorum ipsum....'),
    ('Tigers', now(), 3, 'Lorum ipsum....'),
    ('Wolves', now(), 3, 'Lorum ipsum....'),
    ('Monkeys', now(), 3, 'Lorum ipsum....')
;

COMMIT;
