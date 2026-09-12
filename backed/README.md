# Stash Point Backend

Express + MongoDB replacement for the Appwrite backend.

## Implemented
- Email OTP signup/sign-in with hashed OTPs, expiry, attempt limits and resend cooldown.
- JWT authentication stored in an HTTP-only cookie.
- Current-user and logout endpoints.
- MongoDB user, OTP and file metadata models.
- Multipart file upload using Multer and local storage.
- File listing with ownership/sharing filters, search, type filter, sorting and pagination.
- Rename, share, delete and storage-usage APIs.
- Owner/shared-user authorization.
- Helmet, CORS, rate limiting and centralized error handling.

## Run

```bash
cd backed
npm install
cp .env.example .env
npm run dev
```

For production, replace the local `StorageService` implementation with an S3-compatible provider without changing the file controller contract.
