# Erpel Salon API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
API menggunakan Laravel Sanctum. Sebagian besar endpoint membutuhkan token autentikasi.

### Cara Menggunakan Token
```http
Authorization: Bearer <your_token>
```

### Contoh Login & Penggunaan Token
```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@salon.com","password":"admin123"}'

# Response
{
  "message": "Login berhasil",
  "token": "1|xxx...",
  "user": {...}
}

# Gunakan token untuk request lain
curl http://localhost:8000/api/me \
  -H "Authorization: Bearer 1|xxx..."
```

---

## AUTHENTICATION

### 1. Register (Pendaftaran User Baru)
```http
POST /register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "081234567890"  // optional
}
```

**Response (201):**
```json
{
  "message": "Registrasi berhasil",
  "token": "3|xxx...",
  "user": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "membership": {
    "member_code": "MBR5",
    "level": "silver",
    "points": 0
  }
}
```

> Auto create: user, membership, customer profile

---

### 2. Login
```http
POST /login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@salon.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "message": "Login berhasil",
  "token": "1|xxx...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@salon.com",
    "role": "admin"
  }
}
```

---

### 3. Logout
```http
POST /logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logout berhasil"
}
```

---

### 4. Get Current User
```http
GET /me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {...},
  "is_admin": true,
  "is_staff": false
}
```

---

### 5. Forgot Password
```http
POST /forgot-password
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

## USER MANAGEMENT

### 6. Get All Users (Admin Only)
```http
GET /users
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@salon.com",
    "role": "admin",
    "phone": null
  },
  ...
]
```

---

### 7. Create User (Admin Only)
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "phone": "081234567890",
  "role": "customer"  // optional, default: customer
}
```

---

### 8. Get User by ID
```http
GET /users/{id}
Authorization: Bearer <token>
```

---

### 9. Update User
```http
PUT /users/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "081234567890"
}
```

---

### 10. Delete User
```http
DELETE /users/{id}
Authorization: Bearer <token>
```

---

## SERVICES

### 11. Get All Services
```http
GET /services
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Haircut",
    "price": 35000,
    "duration_minutes": 30,
    "description": "Potong rambut",
    "image": "services/haircut.jpg",
    "image_url": "http://localhost:8000/storage/services/haircut.jpg"
  },
  ...
]
```

**Note:** Use `image_url` directly in frontend img src. Images accessible via /storage/ symlink.

---

### 12. Create Service (Admin Only)
```http
POST /services
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Hair Treatment",
  "price": 150000,
  "duration_minutes": 60,
  "description": "Perawatan rambut"
}
```

---

### 13. Update Service
```http
PUT /services/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

---

### 14. Delete Service
```http
DELETE /services/{id}
Authorization: Bearer <token>
```

---

### 15. Get Service Image
```http
GET /services/{id}/image
```

---

## EMPLOYEES

### 16. Get All Employees
```http
GET /employees
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Stylist",
    "specialty": "Haircut",
    "phone": "081234567890",
    "is_active": true
  },
  ...
]
```

---

### 17. Create Employee (Admin Only)
```http
POST /employees
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Stylist",
  "specialty": "Coloring",
  "phone": "081234567890"
}
```

---

### 18. Update Employee
```http
PUT /employees/{id}
Authorization: Bearer <token>
```

---

### 19. Delete Employee
```http
DELETE /employees/{id}
Authorization: Bearer <token>
```

---

## ORDERS

### 20. Get All Orders
```http
GET /orders
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "order_number": "ERP-000001",
    "user_id": 1,
    "employee_id": 1,
    "service_id": 1,
    "booking_date": "2026-04-20",
    "booking_time": "10:00",
    "status": "confirmed",
    "total_price": 35000,
    "notes": null
  },
  ...
]
```

---

### 21. Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "service_id": 1,
  "employee_id": 1,
  "booking_date": "2026-04-20",
  "booking_time": "10:00",
  "notes": "Potong rambut pendek"
}
```

**Response (201):**
```json
{
  "message": "Order created",
  "data": {...}
}
```

---

### 22. Get Order by ID
```http
GET /orders/{id}
Authorization: Bearer <token>
```

---

### 23. Update Order
```http
PUT /orders/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

---

### 24. Delete Order
```http
DELETE /orders/{id}
Authorization: Bearer <token>
```

---

### 25. Check Order Availability
```http
POST /orders/availability
Content-Type: application/json
```

**Request Body:**
```json
{
  "booking_date": "2026-04-20",
  "booking_time": "10:00",
  "employee_id": 1,
  "duration_minutes": 90
}
```

**Logic:**
- Mengecek apakah employee memiliki order aktif (status 1-4) pada waktu yang sama
- Order dengan status **completed (5)** atau **cancelled (6)** dilewati
- Jika estimasi selesai order (`booking_time + duration_minutes`) sudah lewat dari waktu sekarang, order tersebut tidak dianggap konflik
- Response menyertakan `estimated_end` dari order yang bentrok

**Response (200) — Available:**
```json
{
  "available": true,
  "conflicts": [],
  "estimated_end": null
}
```

**Response (200) — Not Available:**
```json
{
  "available": false,
  "conflicts": [
    {
      "order_id": 61,
      "customer": "Daus",
      "time": "09:00",
      "duration": 90,
      "estimated_end": "10:30"
    }
  ],
  "estimated_end": null
}
```

---

### 26. Update Order Status
```http
PATCH /orders/{id}/status
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Status values:** `pending`, `confirmed`, `processing`, `completed`, `cancelled`

---

### 27. Check In
```http
PATCH /orders/{id}/checkin
Authorization: Bearer <token>
```

---

### 28. Start Work
```http
PATCH /orders/{id}/start-work
Authorization: Bearer <token>
```

---

### 29. Complete Order
```http
PATCH /orders/{id}/complete
Authorization: Bearer <token>
```

---

### 30. Get QR Code
```http
GET /orders/{id}/qrcode
Authorization: Bearer <token>
```

---

### 31. Staff Availability
```http
GET /staff-availability
```

**Query Parameters:**
- `order_date` (required): 2026-05-17
- `order_time` (optional): 09:00 — waktu booking yang akan dicek
- `duration_minutes` (optional): 90 — durasi layanan yang akan dibooking

**Logic:**
- Staff dianggap **tidak available** jika ada order dengan status active (1=pending, 2=confirmed, 3=checked_in, 4=in_progress) yang waktunya overlap dengan `[order_time, order_time + duration_minutes]`
- **Pengecualian**: jika estimasi selesai (`order_time + duration`) sudah lewat dari waktu sekarang, staff **available** kembali
- **Pengecualian**: jika status order **complete (5)**, staff langsung **available** meski estimasi belum selesai

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Ani",
    "available": false,
    "conflicting_order": {
      "order_id": 61,
      "customer": "Daus",
      "time": "09:00",
      "duration": 90,
      "estimated_end": "10:30"
    }
  },
  {
    "id": 2,
    "name": "Budi",
    "available": true,
    "conflicting_order": null
  }
]
```

---

## CUSTOMER PROFILES

### 32. Get All Customer Profiles
```http
GET /customer-profiles
Authorization: Bearer <token>
```

**Query Parameters:**
- `user_id` (optional): Filter by user

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "birth_date": "1990-01-01",
    "gender": "male",
    "address": "Jl. Jalan No. 1",
    "city": "Banjarmasin",
    "postal_code": "70111",
    "emergency_contact": "081234567890",
    "emergency_name": "Jane Doe",
    "allergies": null,
    "preferred_stylist": null,
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@salon.com"
    }
  },
  ...
]
```

---

### 33. Create Customer Profile
```http
POST /customer-profiles
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "birth_date": "1990-01-01",
  "gender": "male",
  "address": "Jl. Jalan No. 1",
  "city": "Banjarmasin",
  "postal_code": "70111",
  "emergency_contact": "081234567890",
  "emergency_name": "Jane Doe",
  "allergies": "Tidak ada",
  "preferred_stylist": "John Stylist"
}
```

---

### 34. Get Customer Profile by ID
```http
GET /customer-profiles/{id}
Authorization: Bearer <token>
```

---

### 35. Update Customer Profile
```http
PUT /customer-profiles/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "birth_date": "1990-01-01",
  "gender": "male",
  "address": "Alamat baru"
}
```

---

### 36. Delete Customer Profile
```http
DELETE /customer-profiles/{id}
Authorization: Bearer <token>
```

---

## MEMBERSHIP

### 37. Get All Memberships
```http
GET /memberships
Authorization: Bearer <token>
```

---

### 38. Get Membership by User ID
```http
GET /memberships/user/{userId}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "member_code": "MBR1",
  "points": 100,
  "membership_level": "silver",
  "total_spent": 500000,
  "join_date": "2026-01-01",
  "is_active": true
}
```

---

### 39. Create Membership
```http
POST /memberships
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "points": 0,
  "membership_level": "silver"
}
```

---

### 40. Update Membership
```http
PUT /memberships/{id}
Authorization: Bearer <token>
```

---

### 41. Delete Membership
```http
DELETE /memberships/{id}
Authorization: Bearer <token>
```

---

## NOTIFICATIONS

### 42. Get All Notifications
```http
GET /notifications
Authorization: Bearer <token>
```

---

### 43. Create Notification
```http
POST /notifications
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "title": "Promo Baru",
  "message": "Diskon 50% untuk haircut",
  "type": "promo"
}
```

---

### 44. Get Notification by ID
```http
GET /notifications/{id}
Authorization: Bearer <token>
```

---

### 45. Update Notification
```http
PUT /notifications/{id}
Authorization: Bearer <token>
```

---

### 46. Delete Notification
```http
DELETE /notifications/{id}
Authorization: Bearer <token>
```

---

## CUSTOMER NOTIFICATIONS

### 47. Get Customer Notifications
```http
GET /customer-notifications
Authorization: Bearer <token>
```

---

### 48. Create Customer Notification
```http
POST /customer-notifications
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "title": "Reminder",
  "message": "Booking besok jam 10",
  "type": "reminder"
}
```

---

### 49. Send Customer Notification
```http
POST /customer-notifications/send
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "title": "Title",
  "message": "Message",
  "type": "reminder"
}
```

---

### 50. Send Reminder
```http
POST /customer-notifications/send-reminder
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "order_id": 1
}
```

---

### 51. Send Payment Reminder
```http
POST /customer-notifications/payment-reminder
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 1,
  "order_id": 1
}
```

---

### 52. Send Bulk Notification
```http
POST /customer-notifications/bulk
Authorization: Bearer <token>
Content-Type: application/json
```

---

## NOTIFICATION TEMPLATES

### 53. Get All Templates
```http
GET /notification-templates
Authorization: Bearer <token>
```

---

### 54. Create Template
```http
POST /notification-templates
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Booking Reminder",
  "type": "appointment_reminder",
  "channel": "whatsapp",
  "title": "Pengingat Jadwal {name}",
  "message": "Hai {name}, booking Anda untuk {service} pada {date} jam {time}. Kode booking: {booking_code}"
}
```

**Variabel yang Tersedia untuk Template:**

| Variabel | Keterangan | Tersedia di |
|----------|------------|-------------|
| `{name}` | Nama pelanggan | Semua tipe |
| `{service}` | Nama layanan | Semua tipe |
| `{date}` | Tanggal order (contoh: 16 May 2026) | Semua tipe |
| `{time}` | Jam order (contoh: 09:00) | Semua tipe |
| `{booking_code}` | Kode booking unik (contoh: SALON-260516-ABC123) | Semua tipe |
| `{price}` | Total harga (contoh: 150.000) | Semua tipe |
| `{location}` | Alamat salon (tetap) | Semua tipe |
| `{employee}` | Nama staff/karyawan | `appointment_reminder` |
| `{deposit}` | Jumlah deposit (contoh: 45.000) | `payment_reminder` |
| `{remaining_balance}` | Sisa pembayaran (contoh: 105.000) | `appointment_reminder` |

---

### 55. Get Template by ID
```http
GET /notification-templates/{id}
Authorization: Bearer <token>
```

---

### 56. Get Template by Type
```http
GET /notification-templates/type/{type}
Authorization: Bearer <token>
```

**Example:** `/notification-templates/type/reminder`

---

### 57. Update Template
```http
PUT /notification-templates/{id}
Authorization: Bearer <token>
```

---

### 58. Delete Template
```http
DELETE /notification-templates/{id}
Authorization: Bearer <token>
```

---

## PAYMENTS

### 59. Create Snap Token (Midtrans)
```http
POST /payments/snap
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "order_id": 1,
  "amount": 35000
}
```

**Response (200):**
```json
{
  "token": "xxx...",
  "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/xxx..."
}
```

---

### 60. Midtrans Webhook
```http
POST /midtrans/webhook
Content-Type: application/json
```

---

### 61. Create Invoice
```http
POST /create-invoice
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "order_id": 1
}
```

---

### 62. Test Snap Token
```http
POST /payments/snap-test
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 35000,
  "email": "customer@example.com",
  "description": "Haircut",
  "order_id": "ERP-000001"
}
```

---

## PROGRESS / WORK PROGRESS

### 63. Get All Progress
```http
GET /progress
Authorization: Bearer <token>
```

or

```http
GET /work-progress
Authorization: Bearer <token>
```

---

### 64. Create Progress
```http
POST /progress
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "order_id": 1,
  "employee_id": 1,
  "status": "started",
  "notes": "Sedang bekerja"
}
```

---

### 65. Get Progress by ID
```http
GET /progress/{id}
Authorization: Bearer <token>
```

---

### 66. Update Progress
```http
PUT /progress/{id}
Authorization: Bearer <token>
```

---

### 67. Delete Progress
```http
DELETE /progress/{id}
Authorization: Bearer <token>
```

---

## UTILITY

### 68. Test API
```http
GET /test
```

**Response (200):**
```json
{
  "message": "API is working",
  "timestamp": "2026-04-19T04:44:00",
  "environment": "local"
}
```

---

## USER ROLES

| Role | Description |
|------|-------------|
| `admin` | Full access |
| `staff` | Limited access (manage orders, employees) |
| `customer` | Basic access (own orders, profile) |

---

## ORDER STATUS

| Status | Description |
|--------|-------------|
| `pending` | Menunggu konfirmasi |
| `confirmed` | Sudah dikonfirmasi |
| `processing` | Sedang进行处理 |
| `completed` | Selesai |
| `cancelled` | Dibatalkan |

---

## MEMBERSHIP LEVEL

| Level | Description |
|-------|-------------|
| `silver` | Default |
| `gold` | Setelah 500k+ total spent |
| `platinum` | Setelah 1jt+ total spent |

---

## TEST ACCOUNTS

| Email | Password | Role |
|-------|----------|------|
| admin@salon.com | admin123 | admin |
| staff@salon.com | staff123 | staff |
| test@test.com | password123 | customer |

---

## EMAILJS

### Kirim Email via EmailJS (Ambil dari Template Database)
```
POST /api/emailjs/send
Content-Type: application/json
```

**Request dengan Order ID (Otomatis Ambil Data):**
```json
{
  "order_id": 28,
  "email": "penerima@email.com",
  "type": "order_confirmation"
}
```

**Request Manual:**
```json
{
  "email": "penerima@email.com",
  "type": "order_confirmation",
  "data": {
    "name": "John Doe",
    "service": "Haircut",
    "date": "20-04-2026",
    "time": "10:00"
  }
}
```

**Parameter:**
- `order_id` (optional): ID order (ambil data otomatis dari order)
- `email` (required jika tidak ada order_id): Email penerima
- `type` (required): Jenis template (`order_confirmation`, `payment_reminder`, `appointment_reminder`, `promotion`, `general`)
- `data` (optional): Data untuk replace variabel dalam template

**Variabel Template (Otomatis dari Order):**

| Variabel | Keterangan |
|----------|------------|
| `{name}` | Nama pelanggan |
| `{service}` | Nama layanan |
| `{date}` | Tanggal order (contoh: 16 May 2026) |
| `{time}` | Jam order (contoh: 09:00) |
| `{booking_code}` | Kode booking unik |
| `{price}` | Total harga (contoh: 150.000) |
| `{location}` | Alamat salon |
| `{employee}` | Nama staff/karyawan (`appointment_reminder` / `reminder_h1` / `reminder_h1_hour` / `reminder_h15_minutes`) |
| `{deposit}` | Jumlah deposit (`payment_reminder`) |
| `{remaining_balance}` | Sisa pembayaran (`appointment_reminder` / reminder) |

**Response (200):**
```json
{
  "status": "sent",
  "email": "ahdfrds3@gmail.com",
  "subject": "Order Dikonfirmasi",
  "message": "Hai Ahmad Firdaus, order Anda untuk layanan Hair Cut telah dikonfirmasi untuk tanggal 20-04-2026 jam 09:00.",
  "order_id": 28
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "message": "Order tidak ditemukan" / "Template tidak ditemukan"
}
```

**Template Types:**
- `order_confirmation` - Konfirmasi order
- `payment_reminder` - Reminder pembayaran
- `appointment_reminder` - Reminder jadwal
- `promotion` - Promosi
- `general` - Pesan umum

**Catatan:**
- Jika ada `order_id`, data otomatis diambil dari pesanan ({name}, {service}, {date}, {time}, dll)
- Template pesan diambil dari tabel `notification_templates` di database
- Variabel dalam template menggunakan format `{variable_name}`

## NOTES

- Semua endpoint yang membutuhkan autentikasi ditandai dengan `Authorization: Bearer <token>`
- Untuk user biasa (non-admin), beberapa endpoint hanya bisa akses data sendiri
- Register otomatis membuat: user, membership, customer profile
- Password min 6 karakter
