# Login Template

ตัวอย่างโปรเจกต์ Next.js สำหรับนำ flow login ไปใช้ซ้ำในงานอื่น โดยมีหน้าหลักที่มักต้องใช้ร่วมกันครบ:

- `เข้าสู่ระบบ`
- `ลืม iduser`
- `ลืมรหัสผ่าน`
- `ยังไม่มีบัญชี? สมัครสมาชิก`

## Release Notes

### v0.2.0

- เพิ่ม demo account ผ่าน env สำหรับเปิดใช้งานและทดสอบ flow ได้ทันที
- เพิ่ม auto-seed ผู้ใช้ตัวอย่างในฐานข้อมูลเมื่อกำหนด `DEMO_USER_PASSWORD`
- เพิ่ม `Dockerfile` และ `docker-compose.yml` สำหรับรัน app + PostgreSQL ได้เร็วขึ้น
- แสดงข้อมูล demo account บนหน้าแรกเมื่อกำหนด `NEXT_PUBLIC_DEMO_*`

## สิ่งที่มีใน template

- สมัครสมาชิกแล้วระบบสร้าง `iduser` อัตโนมัติ
- เข้าสู่ระบบด้วย `iduser + password`
- ค้นหา `iduser` จาก `ชื่อ + นามสกุล + เบอร์โทร`
- รีเซ็ตรหัสผ่านจาก `iduser + เบอร์โทร + รหัสผ่านใหม่`
- session แบบ cookie ฝั่ง server
- lock account ชั่วคราวเมื่อกรอกรหัสผ่านผิดหลายครั้ง
- auto-seed demo user จาก env
- Docker setup สำหรับ local development

## เริ่มใช้งาน

1. ติดตั้ง dependency

```bash
npm install
```

2. สร้างฐานข้อมูล PostgreSQL และตั้งค่า `.env.local`

```bash
cp .env.example .env.local
```

3. รันโปรเจกต์

```bash
npm run dev
```

## Demo Account

ค่า default ใน `.env.example`

- `iduser`: `GL0001`
- `password`: `DemoPass123`

เมื่อกำหนด `DEMO_USER_PASSWORD` ระบบจะ seed user นี้ให้อัตโนมัติในขั้น schema initialization

## Docker

รันทั้งแอปและ PostgreSQL:

```bash
docker compose up --build
```

จากนั้นเปิด `http://localhost:3000`

ถ้าต้องการหยุด:

```bash
docker compose down
```

## โครงสร้างสำคัญ

- `app/(auth)/login` หน้า login
- `app/(auth)/register` หน้าสมัครสมาชิก
- `app/(auth)/forgot-iduser` หน้า recover iduser
- `app/(auth)/forgot-password` หน้า reset password
- `lib/auth-store.ts` business logic และ database layer
- `docker-compose.yml` สำหรับเปิด app + db
- `Dockerfile` สำหรับ build app container

## หมายเหตุ

- template นี้ตั้งใจทำเป็นตัวอย่างสำหรับนำไปต่อยอด ไม่ได้ผูกกับ business เฉพาะระบบใด
- หากจะใช้ใน production ควรเพิ่ม email / OTP / audit log / rate limit ระดับ network และ validation ตาม requirement จริง
