# Customer Authentication & Tracking System

## Overview
A complete customer authentication system has been implemented to allow users to register, login, and track their bookings and inquiries.

## Features Implemented

### 1. **Customer Registration**
- **URL**: `/customer/register`
- **API**: `POST /api/auth/register`
- Users can create an account with:
  - Name
  - Email
  - Password (minimum 6 characters)
  - Phone (optional)

### 2. **Customer Login**
- **URL**: `/customer/login`
- **API**: `POST /api/auth/customer-login`
- Secure login with email and password
- Redirects to customer dashboard after successful login

### 3. **Customer Dashboard**
- **URL**: `/customer/dashboard`
- **API**: `GET /api/customer/my-data`
- Displays:
  - **My Bookings**: All packages booked by the user with status (pending/confirmed/cancelled)
  - **My Inquiries**: All inquiries submitted with status (new/contacted/converted)
- Shows booking details:
  - Package name
  - Travel dates
  - Number of travellers
  - Total amount
  - Current status

### 4. **Database Models**
- **CustomerUser**: Stores customer account information
- **Booking**: Updated to include `userId` field
- **Inquiry**: Updated to include `userId` field

## How It Works

### For Customers:
1. **Register**: Visit `/customer/register` to create an account
2. **Login**: Visit `/customer/login` to sign in
3. **Book/Inquire**: When logged in, bookings and inquiries are automatically linked to your account
4. **Track**: Visit `/customer/dashboard` to see all your bookings and inquiries with their current status

### Status Meanings:

**Bookings:**
- `pending`: Awaiting confirmation
- `confirmed`: Booking approved by admin
- `cancelled`: Booking cancelled

**Inquiries:**
- `new`: Just submitted, not yet reviewed
- `contacted`: Admin has reached out
- `converted`: Inquiry converted to booking

## Next Steps (Optional Enhancements)

1. **Session Management**: Currently using basic authentication. Consider implementing full NextAuth session for customers
2. **Email Notifications**: Send emails when booking status changes
3. **Profile Management**: Allow customers to update their profile information
4. **Booking Cancellation**: Allow customers to cancel their own bookings
5. **Payment Integration**: Link customer accounts with payment history

## Testing

### Test Customer Registration:
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

### Test Customer Login:
```bash
POST /api/auth/customer-login
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Files Created/Modified

### New Files:
- `src/models/CustomerUser.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/customer-login/route.ts`
- `src/app/api/customer/my-data/route.ts`
- `src/components/forms/RegisterForm.tsx`
- `src/components/forms/CustomerLoginForm.tsx`
- `src/app/customer/register/page.tsx`
- `src/app/customer/login/page.tsx`
- `src/app/customer/dashboard/page.tsx`

### Modified Files:
- `src/models/Booking.ts` - Added `userId` field
- `src/models/Inquiry.ts` - Added `userId` field
- `src/auth.ts` - Added admin credentials provider ID

## Important Notes

⚠️ **TODO**: Update the checkout and inquiry submission APIs to automatically link the logged-in customer's ID when creating bookings/inquiries. This requires session management implementation.

For now, the system is ready to:
- Register new customers
- Allow customer login
- Display customer dashboard
- Track bookings and inquiries by userId

The next phase would be to integrate the customer session into the booking and inquiry creation flows.
