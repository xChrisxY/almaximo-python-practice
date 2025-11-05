# 🧱 AlMáximo Backend

Proyecto **Django** con arquitectura **MTV** y **API REST** (Django REST Framework) para la gestión de productos y proveedores.  
Incluye integración con **TailwindCSS** para los estilos front-end.

---

## 🚀 Requisitos

- 🐍 Python **3.12+**
- 🗄️ MySQL **8+**
- 📦 pip (gestor de paquetes de Python)
- 🧰 virtualenv (opcional pero recomendado)
- 🎨 *[opcional]* Node.js (solo si deseas recompilar el CSS de Tailwind)

---

## ⚙️ Instalación paso a paso

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/<tu_usuario>/almaximo-backend.git
cd almaximo-backend
```

### 2️⃣ Crear y activar un entorno virtual

```bash
python3 -m venv venv
source venv/bin/activate  # En Linux/macOS
venv\Scripts\activate     # En Windows
```


### 3️⃣ Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4️⃣ Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto con el siguiente contenido:


```env

DB_NAME=almaximodb
DB_USER=django_user
DB_PASSWORD=password123
DB_HOST=127.0.0.1
DB_PORT=3306

SECRET_KEY=tu_clave_django
DEBUG=True
```

### 5️⃣ Crear base de datos y usuario en MySQL
Ejecuta el script incluido para crear la base de datos, usuario y datos iniciales:

```bash
mysql -u root -p < init_db.sql
```

### 6️⃣ Aplicar migraciones

```bash

python manage.py makemigrations
python manage.py migrate
```

### 7️⃣ Crear un superusuario

```bash
python manage.py createsuperuser
```

### 8️⃣ Ejecutar el servidor

```bash
python manage.py runserver
```

Accede en tu navegador a 👉
http://127.0.0.1:8000/

🧱 Estructura del proyecto

```csharp
almaximo-backend/
│
├── products/                  # App principal
│   ├── models.py              # Modelos de base de datos
│   ├── views.py               # Vistas Django (MTV)
│   ├── api/                   # API REST (DRF)
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── templates/             # Templates HTML
│   └── static/                # Archivos estáticos (CSS, JS, Tailwind)
│
├── manage.py
├── requirements.txt
├── init_db.sql
├── README.md
└── .gitignore
```

### 🧩 Datos iniciales
La tabla ProductType se llena automáticamente con categorías base al crear la BD mediante init_db.sql:

|id|name|description|
|---|---|---|
|1|Limpieza|Productos de limpieza|
|2|Electrónica|Dispositivos y accesorios|
|3|Oficina|Material de oficina|

📦 API Endpoints (REST)

|Método|Endpoint|Descripción|
|---|---|---|
|**GET**|`/api/products/`|Listar productos|
|**POST**|`/api/products/`|Crear producto|
|**GET**|`/api/products/{id}/`|Consultar producto|
|**PUT / PATCH**|`/api/products/{id}/`|Actualizar producto|
|**DELETE**|`/api/products/{id}/`|Eliminar producto|
|**GET**|`/api/supplier/`|Listar proveedores|
|**POST**|`/api/supplier/`|Crear proveedor|
|**GET**|`/api/supplier/{id}/`|Consultar proveedor|
|**PUT / PATCH**|`/api/supplier/{id}/`|Actualizar proveedor|
|**DELETE**|`/api/supplier/{id}/`|Eliminar proveedor|


### ⚡ Script SQL (init_db.sql)


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
```

⚠️ No se crean tablas manualmente. Django las genera con python manage.py migrate.
Este script solo crea la BD, el usuario y los registros iniciales.