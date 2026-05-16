# API Documentation - Salon Booking System

Dokumentasi API untuk sistem booking salon.

## Base URL
```
http://127.0.0.1:8000/api
```

## Authentication
Beberapa endpoint memerlukan autentikasi menggunakan Laravel Sanctum.

**Cara pakai:**
1. Login untuk dapat token
2. Tambahkan header: `Authorization: Bearer {token}`

---

## Daftar Endpoint

### 1. Test Endpoint
```
GET /api/test
```
**Response:**
```json
{
  "message": "API is working",
  "timestamp": "2026-04-13 15:30:00",
  "environment": "local"
}
```

---

### 2. Authentication

#### Login
```
POST /api/login
```
**Request:**
```json
{
  "email": "admin@salon.com",
  "password": "password"
}
```
**Response:**
```json
{
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin Salon",
      "email": "admin@salon.com",
      "role": "admin"
    },
    "token": "1|abc123..."
  }
}
```

#### Register
```
POST /api/register
```
**Request:**
```json
{
  "name": "Ahmad",
  "email": "ahmad@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "081234567890"
}
```

#### Logout
```
POST /api/logout
```
**Header:** `Authorization: Bearer {token}`

#### Forgot Password
```
POST /api/forgot-password
```
**Request:**
```json
{
  "email": "ahmad@example.com"
}
```

---

### 3. Services (Layanan)

#### List Semua Layanan
```
GET /api/services
```
**Response:**
```json
{
  "message": "Daftar layanan",
  "data": [
    {
      "id": 1,
      "name": "Hair Cut",
      "price": 75000,
      "duration_minutes": 30,
      "deposit_percentage": 30,
      "is_active": true,
      "employees": [...]
    }
  ]
}
```

#### Detail Layanan
```
GET /api/services/{id}
```

#### Buat Layanan (Auth Required)
```
POST /api/services
```
**Header:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Hair Cut",
  "price": 75000,
  "duration_minutes": 30,
  "deposit_percentage": 30,
  "description": "Potong rambut profesional",
  "employee_ids": [1, 2]
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Ya | Nama layanan |
| price | integer | Ya | Harga dalam Rupiah |
| duration_minutes | integer | Ya | Durasi dalam menit |
| deposit_percentage | integer | Tidak | Persentase deposit (0-100, default: 30) |
| description | text | Tidak | Deskripsi layanan |
| employee_ids | array | Tidak | ID karyawan yang bisa melayani |

#### Update Layanan
```
PUT /api/services/{id}
```
**Request:** Sama seperti POST, semua field optional

#### Hapus Layanan
```
DELETE /api/services/{id}
```

---

### 4. Employees (Karyawan)

#### List Semua Karyawan
```
GET /api/employees
```
**Response:**
```json
{
  "message": "Daftar karyawan",
  "data": [
    {
      "id": 1,
      "name": "Sarah",
      "phone": "081111111111",
      "email": "sarah@salon.com",
      "is_active": true,
      "services": [...],
      "schedules": [...]
    }
  ]
}
```

#### Detail Karyawan
```
GET /api/employees/{id}
```

#### Tambah Karyawan (Auth Required)
```
POST /api/employees
```
**Request:**
```json
{
  "name": "Sarah",
  "phone": "081111111111",
  "email": "sarah@salon.com",
  "service_ids": [1, 2, 3],
  "schedules": [
    {
      "day_of_week": 1,
      "start_time": "09:00",
      "end_time": "17:00"
    }
  ]
}
```

**day_of_week:** 0= Minggu, 1= Senin, ..., 6= Sabtu

#### Update Karyawan
```
PUT /api/employees/{id}
```

#### Hapus Karyawan
```
DELETE /api/employees/{id}
```

---

### 5. Orders (Pesanan)

#### List Semua Pesanan
```
GET /api/orders
```
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status_id | integer | Filter by status |
| date | date | Filter by tanggal (YYYY-MM-DD) |
| start_date | date | Filter range awal |
| end_date | date | Filter range akhir |
| search | string | Cari booking_code/user_name |
| per_page | integer | Items per page (default: 15) |
| sort_by | string | Field sorting (default: created_at) |
| sort_order | string | asc/desc (default: desc) |

**Contoh:**
```
GET /api/orders?status_id=1&date=2026-04-15
```

#### Detail Pesanan
```
GET /api/orders/{id}
```

#### Buat Pesanan Baru (Auth Required)
```
POST /api/orders
```
**Request:**
```json
{
  "user_name": "Ahmad",
  "user_phone": "081234567890",
  "user_email": "ahmad@example.com",
  "order_date": "2026-04-15",
  "order_time": "10:00:00",
  "status_id": 1,
  "notes": "Booking pertama",
  "deposit_percentage": 30,
  "user_id": 1,
  "items": [
    {
      "service_id": 1,
      "employee_id": 1,
      "price": 75000,
      "duration_minutes": 30
    },
    {
      "service_id": 2,
      "employee_id": 1,
      "price": 150000,
      "duration_minutes": 60
    }
  ]
}
```

**Response:**
```json
{
  "message": "Pesanan berhasil dibuat",
  "data": {
    "id": 1,
    "booking_code": "SALON-ABC12345",
    "user_name": "Ahmad",
    "order_date": "2026-04-15",
    "status_id": 1,
    "total_price": 225000,
    "deposit_amount": 67500,
    "items": [...]
  }
}
```

#### Update Pesanan
```
PUT /api/orders/{id}
```

#### Hapus Pesanan
```
DELETE /api/orders/{id}
```

#### Update Status Pesanan
```
PATCH /api/orders/{id}/status
```
**Request:**
```json
{
  "status_id": 2
}
```

**Status Order:**
| ID | Status | Keterangan |
|----|--------|------------|
| 1 | pending | Menunggu konfirmasi |
| 2 | confirmed | Sudah dikonfirmasi |
| 3 | checked_in | Sudah check-in |
| 4 | in_progress | Sedang dikerjakan |
| 5 | completed | Selesai |
| 6 | cancelled | Dibatalkan |

---

### 6. Order Progress (Progres Pesanan)

#### List Progres
```
GET /api/progress
```
**Query Parameters:**
- `order_id` - Filter by order
- `status` - Filter by status

#### Tambah Progres (Auth Required)
```
POST /api/progress
```
**Request:**
```json
{
  "order_id": 1,
  "status": "in_progress",
  "description": "Sedang mengerjakan hair coloring",
  "image": "https://example.com/image.jpg",
  "created_by": 1
}
```

#### Detail Progres
```
GET /api/progress/{id}
```

#### Update Progres
```
PUT /api/progress/{id}
```

#### Hapus Progres
```
DELETE /api/progress/{id}
```

---

### 7. Notifications (Notifikasi)

#### List Notifikasi
```
GET /api/notifications
```
**Query Parameters:**
- `user_id` - Filter by user
- `is_read` - Filter by read status (true/false)

#### Buat Notifikasi (Auth Required)
```
POST /api/notifications
```
**Request:**
```json
{
  "title": "Pesanan Dikonfirmasi",
  "message": "Pesanan Anda telah dikonfirmasi",
  "type": "success",
  "user_id": 1,
  "order_id": 1
}
```

**Type:** info, success, warning, error

#### Tandai Sudah Dibaca
```
PATCH /api/notifications/{id}/read
```

#### Tandai Semua Sudah Dibaca
```
PATCH /api/notifications/read-all
```

#### Update Notifikasi
```
PUT /api/notifications/{id}
```

#### Hapus Notifikasi
```
DELETE /api/notifications/{id}
```

---

### 8. Users (Pengguna)

#### List Semua User (Auth Required)
```
GET /api/users
```

#### Detail User
```
GET /api/users/{id}
```

#### Buat User (Auth Required)
```
POST /api/users
```
**Request:**
```json
{
  "name": "Ahmad",
  "email": "ahmad@example.com",
  "password": "password123",
  "phone": "081234567890",
  "role": "customer"
}
```

**Roles:** admin, staff, customer

#### Update User
```
PUT /api/users/{id}
```

#### Hapus User
```
DELETE /api/users/{id}
```

---

### 9. Payments (Pembayaran)

#### Buat Token Pembayaran (Auth Required)
```
POST /api/payments/snap
```
**Request:**
```json
{
  "order_id": 1
}
```
**Response:**
```json
{
  "message": "Token pembayaran berhasil dibuat",
  "data": {
    "snap_token": "abc123...",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/abc123...",
    "order": {...}
  }
}
```

#### Create Invoice (Alias)
```
POST /api/create-invoice
```
Sama seperti `/api/payments/snap`

#### Midtrans Webhook (Public)
```
POST /api/midtrans/webhook
```
Dipanggil otomatis oleh Midtrans setelah pembayaran.

#### Test Payment (Public)
```
POST /api/payments/snap-test
```
Test tanpa database.

---

## Relasi Database

### ERD (Entity Relationship Diagram)

```
users ─┬── orders ──── order_items ──── services
       │      │                            │
       │      ├── order_progress           │
       │      ├── order_logs               └── employee_services
       │      └── notifications                     │
       │                                            │
       └── notifications                     employees
                                                      │
                                                      ├── employee_schedules
                                                      └── employee_time_off

order_statuses ──── orders
```

### Tabel & Relasi

| Tabel | Relasi |
|-------|--------|
| `users` | hasMany: orders, notifications, orderProgress, orderLogs |
| `order_statuses` | hasMany: orders |
| `employees` | belongsToMany: services, hasMany: schedules, timeOffs, orderItems |
| `services` | belongsToMany: employees, hasMany: orderItems |
| `orders` | belongsTo: status, user; hasMany: items, progress, logs, notifications |
| `order_items` | belongsTo: order, service, employee |
| `order_progress` | belongsTo: order, createdBy(user) |
| `order_logs` | belongsTo: order, user |
| `notifications` | belongsTo: user, order |

---

## Response Format

### Success Response
```json
{
  "message": "Pesan sukses",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "message": "Daftar data",
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Error detail"]
  }
}
```

---

## Status Codes

| Code | Keterangan |
|------|------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

## Test Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@salon.com | password |
| Staff | staff@salon.com | password |
| Customer | customer@example.com | password |

---

## Contoh Request dengan cURL

### Login
```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@salon.com","password":"password"}'
```

### Get Services (tanpa auth)
```bash
curl http://127.0.0.1:8000/api/services
```

### Create Order (dengan auth)
```bash
curl -X POST http://127.0.0.1:8000/api/orders \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "Ahmad",
    "order_date": "2026-04-15",
    "status_id": 1,
    "items": [{"service_id": 1, "employee_id": 1, "price": 75000, "duration_minutes": 30}]
  }'
```

---

## Konfigurasi Environment

Tambahkan di `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=salon_db
DB_USERNAME=root
DB_PASSWORD=
DB_SOCKET=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock

# Midtrans (opsional)
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_IS_PRODUCTION=false
```