# Erpel Salon API Documentation

**Base URL:**
```
https://salon-api-production.up.railway.app/api
```

---

## 1. SERVICES

### GET /services
Menampilkan semua layanan salon.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Hair Cut & Styling",
    "description": "Professional haircut and styling services",
    "price": 75000,
    "deposit": 30000,
    "duration": "45 minutes",
    "category": "Hair",
    "image": "/haircut&styling.jpg"
  }
]
```

### POST /services
Menambahkan layanan baru.

**Body (JSON):**
```json
{
  "name": "Hair Coloring",
  "description": "Professional hair coloring services",
  "price": 250000,
  "deposit": 100000,
  "duration": "120 minutes",
  "category": "Hair",
  "image": "/haircoloring.jpg"
}
```

### PUT /services/{id}
Mengedit data layanan.

### DELETE /services/{id}
Menghapus layanan.

---

## 2. EMPLOYEES

### GET /employees
Menampilkan semua data karyawan.

### POST /employees
Menambahkan karyawan baru.

**Body (JSON):**
```json
{
  "name": "Siti",
  "position": "Hair Stylist",
  "phone": "08123456789"
}
```

### GET /employees/{id}
Menampilkan data karyawan berdasarkan ID.

### PUT /employees/{id}
Mengubah data karyawan.

### DELETE /employees/{id}
Menghapus karyawan.

---

## 3. ORDERS

### GET /orders
Menampilkan semua pesanan pelanggan.

### POST /orders
Menambahkan pesanan baru.



### PUT /orders/{id}
Mengupdate status pesanan.

### DELETE /orders/{id}
Menghapus pesanan.

---

## 4. PROGRESS

### GET /progress
Menampilkan progress pekerjaan salon.

### POST /progress
Menambah progress baru.

**Body (JSON):**
```json
{
  "order_id": 3,
  "status": "In Progress",
  "note": "Customer is being styled"
}
```

### PUT /progress/{id}
Mengupdate progress.

### DELETE /progress/{id}
Menghapus progress.

---

## 5. NOTIFICATIONS

### GET /notifications
Menampilkan semua notifikasi pelanggan.

### POST /notifications
Menambahkan notifikasi baru.

**Body (JSON):**
```json
{
  "user_id": 1,
  "message": "Your appointment is confirmed!"
}
```

### DELETE /notifications/{id}
Menghapus notifikasi.

---

## 6. USERS

### GET /users
Menampilkan semua pengguna.

### POST /users
Menambahkan pengguna baru (default role: customer).

**Body (JSON):**
```json
{
  "name": "Ahmad Firdaus",
  "email": "daus.mailbox@gmail.com",
  "password": "12345678"
}
```

### GET /users/{id}
Menampilkan detail user.

### PUT /users/{id}
Mengupdate data user.

### DELETE /users/{id}
Menghapus user.

---

## 7. AUTHENTICATION – RESET PASSWORD

### POST /forgot-password
Mengirimkan link reset password ke email.

**Body (JSON):**
```json
{ "email": "daus.mailbox@gmail.com" }
```

**Response:**
```json
{ "message": "We have emailed your password reset link!" }
```

### GET /reset-password/{token}?email={email}
Menampilkan halaman HTML form reset password.

### POST /reset-password
Mengganti password lama.

**Form Data:** `token`, `email`, `password`, `password_confirmation`

**Response:**
```json
{
  "message": "Password berhasil direset!",
  "email": "daus.mailbox@gmail.com"
}
```

---

REGISTER
Method: POST
Endpoint: /register

Deskripsi:
Mendaftarkan pengguna baru (default role: customer).

Request Body (JSON):
{
"name": "Ahmad Firdaus",
"email": "daus.mailbox@gmail.com",
"password": "12345678",
"phone": "08123456789"
}

Response (201 Created):
{
"message": "Registrasi berhasil",
"token": "1|0yQLlJz6xK1a23tGi3kHb9r2Pb4ZnXEqj3ycf3hvNfC8g4rJ",
"user": {
"id": 8,
"name": "Ahmad Firdaus",
"email": "daus.mailbox@gmail.com",
"phone": "08123456789",
"role": "customer",
"created_at": "2025-11-22T09:12:00.000000Z",
"updated_at": "2025-11-22T09:12:00.000000Z"
}
}

Error Response (400 Bad Request):
{
"message": "Email sudah terdaftar."
}

LOGIN
Method: POST
Endpoint: /login

Deskripsi:
Login pengguna berdasarkan email dan password, mengembalikan token autentikasi (Laravel Sanctum).

Request Body (JSON):
{
"email": "daus.mailbox@gmail.com",
"password": "12345678"
}

Response (200 OK):
{
"message": "Login berhasil",
"token": "1|MkjLARFSiUOC5qMZshGP8ynUXN5GnTV4Abr2wQTV9f2c01d6",
"user": {
"id": 5,
"name": "Daus Test",
"email": "daus.mailbox@gmail.com",
"phone": "08123456789",
"role": "customer",
"created_at": "2025-11-22T07:24:59.000000Z",
"updated_at": "2025-11-22T08:31:36.000000Z"
}
}

Error Response (401 Unauthorized):
{
"message": "Email atau password salah"
}

LOGOUT
Method: POST
Endpoint: /logout

Header:
Authorization: Bearer <token>

Deskripsi:
Menghapus semua token aktif user yang sedang login.

Response:
{
"message": "Logout berhasil"
}

### POST /login
**Body (JSON):**
```json
{
  "email": "daus.mailbox@gmail.com",
  "password": "12345678"
}
```

**Response:**
```json
{
  "message": "Login berhasil",
  "token": "..."
}
```

---

## 9. MAILTRAP SMTP CONFIG (.env)
```
MAIL_MAILER=smtp
MAIL_HOST=live.smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=api
MAIL_PASSWORD=a18a906a37b95c1fbf586ab9d76354e7
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@demomailtrap.co
MAIL_FROM_NAME="Erpel Salon"
```

---

## 10. ROUTES SUMMARY
```
GET /services
POST /services
PUT /services/{id}
DELETE /services/{id}

GET /employees
POST /employees
PUT /employees/{id}
DELETE /employees/{id}

GET /orders
POST /orders
PUT /orders/{id}
DELETE /orders/{id}

GET /progress
POST /progress
PUT /progress/{id}
DELETE /progress/{id}

GET /notifications
POST /notifications
DELETE /notifications/{id}

GET /users
POST /users
PUT /users/{id}
DELETE /users/{id}

POST /forgot-password
GET /reset-password/{token}?email={email}
POST /reset

