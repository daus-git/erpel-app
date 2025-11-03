# TODO: Implement Deposit Payment System and Appointments Tab

## 1. Update Cart.vue Payment Logic
- [x] Modify `completeOrder` method to calculate deposit (40% of service price) and remaining payment for services
- [x] Keep full price for products (no deposit)
- [x] Add deposit and remaining payment fields to order structure
- [x] Ensure backward compatibility by making new fields optional

## 2. Update Order Data Structure
- [x] Modify order.json to include new fields: `deposit` (total deposit amount), `remainingPayment` (total remaining to pay)
- [x] Add sample orders with deposit info for testing

## 3. Add Appointments Tab to Admin Dashboard
- [x] Update `tabs` array in AdminDashboard.vue to include "appointments" tab
- [x] Import AdminAppointmentsTab component
- [x] Add conditional rendering for AdminAppointmentsTab in template

## 4. Create AdminAppointmentsTab Component
- [x] Create AdminAppointmentsTab.vue with table/list displaying:
  - Customer name
  - Service name
  - Remaining payment (service total - deposit)
  - Products to be paid at store (list products with full price)
  - Date and time
- [x] Filter orders: status "Pending Payment" or date >= today
- [x] Import orders data

## 5. Testing
- [x] Test payment flow with deposit system
- [x] Verify appointments tab displays correctly
- [x] Check calculations for remaining payments
- [x] Fix toLocaleString errors in AdminAppointmentsTab.vue
