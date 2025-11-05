CREATE DATABASE IF NOT EXISTS almaximodb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'django_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON almaximodb.* TO 'django_user'@'localhost';
FLUSH PRIVILEGES;

USE almaximodb;

INSERT INTO products_producttype (name, description)
VALUES 
  ('Limpieza', 'Productos de limpieza del hogar y oficina'),
  ('Electrónica', 'Dispositivos electrónicos y accesorios'),
  ('Oficina', 'Artículos y suministros de oficina');
