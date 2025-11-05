# 🧱 AlMáximo Backend

Proyecto Django con arquitectura **MTV** y API REST integrada para la gestión de productos y proveedores.

---

## 🚀 Requisitos

- Python 3.12+
- MySQL 8+
- pip (gestor de paquetes de Python)
- virtualenv (opcional pero recomendado)

---

## 🧩 Instalación paso a paso

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/<tu_usuario>/almaximo-backend.git
cd almaximo-backend
2️⃣ Crear y activar un entorno virtual
bash

Copiar código
python3 -m venv venv
source venv/bin/activate  # En Linux/macOS
venv\Scripts\activate     # En Windows
3️⃣ Instalar dependencias
bash

Copiar código
pip install -r requirements.txt
4️⃣ Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto con tus datos de conexión a MySQL:

env

Copiar código
DB_NAME=almaximodb
DB_USER=django_user
DB_PASSWORD=password123
DB_HOST=127.0.0.1
DB_PORT=3306
SECRET_KEY=tu_clave_django
DEBUG=True
5️⃣ Crear base de datos y usuario en MySQL
Ejecuta el script SQL incluido:

bash

Copiar código
mysql -u root -p < init_db.sql
6️⃣ Aplicar migraciones
bash

Copiar código
python manage.py makemigrations
python manage.py migrate
7️⃣ Crear un superusuario
bash

Copiar código
python manage.py createsuperuser
8️⃣ Ejecutar el servidor
bash

Copiar código
python manage.py runserver
Accede en tu navegador a:
➡️ http://127.0.0.1:8000/

🧱 Estructura del proyecto

Copiar código
almaximo-backend/
│
├── products/                  # App principal
│   ├── models.py              # Modelos de base de datos
│   ├── views.py               # Vistas Django
│   ├── api/                   # API REST (DRF)
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── templates/             # Templates HTML
│   └── static/                # Archivos estáticos (JS, CSS, Tailwind)
│
├── manage.py
├── requirements.txt
├── init_db.sql
├── README.md
└── .gitignore
🧩 Datos iniciales
La tabla ProductType se llena automáticamente con categorías base al crear la BD mediante init_db.sql:

id	name	description
1	Limpieza	Productos de limpieza
2	Electrónica	Dispositivos y accesorios
3	Oficina	Material de oficina

📦 API Endpoints
/api/products/ → Listar y crear productos

/api/products/<id>/ → Consultar / actualizar / eliminar producto

/api/supplier/ → Listar y crear proveedores

/api/supplier/<id>/ → Consultar / actualizar / eliminar proveedor

🛠️ Créditos
Desarrollado con ❤️ por Christopher Yahir Moreno
Python • Django • REST Framework • TailwindCSS


Copiar código

---

## 🧩 3️⃣ init_db.sql

Este script crea la base de datos, usuario, tablas (vía migraciones) y agrega registros iniciales:

```sql
-- Crear base de datos y usuario
CREATE DATABASE IF NOT EXISTS almaximodb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'django_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON almaximodb.* TO 'django_user'@'localhost';
FLUSH PRIVILEGES;

USE almaximodb;

-- Registros iniciales
INSERT INTO products_producttype (name, description)
VALUES 
  ('Limpieza', 'Productos de limpieza del hogar y oficina'),
  ('Electrónica', 'Dispositivos electrónicos y accesorios'),
  ('Oficina', 'Artículos y suministros de oficina');
⚠️ No creamos las tablas manualmente, Django las genera con python manage.py migrate.
Este script solo se encarga de crear la BD, usuario y datos iniciales.