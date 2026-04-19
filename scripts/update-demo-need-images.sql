-- Run against an existing DB if you already applied schema.sql before these assets existed.
-- Requires frontend static files at /needs/*.png (Vite public/needs).

UPDATE needs SET image_url = '/needs/seed-winter-blankets.png'
WHERE id = 'ddddddd4-0000-0000-0000-000000000004';

UPDATE needs SET image_url = '/needs/seed-school-fees.png'
WHERE id = 'ddddddd1-0000-0000-0000-000000000001';

UPDATE needs SET image_url = '/needs/seed-hamza-textbooks.png'
WHERE id = 'ddddddd2-0000-0000-0000-000000000002';
