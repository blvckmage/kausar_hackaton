-- УДАЛИТЕ СТАРЫХ ПОЛЬЗОВАТЕЛЕЙ, ЧТОБЫ ИСПРАВИТЬ ОШИБКУ 500 (Broken Hash)
DELETE FROM auth.users WHERE email IN ('admin1@mentoria.kz', 'student1@mentoria.kz');
