# Contributing

ขอบคุณที่ช่วยพัฒนาโปรเจกต์นี้

## Development setup

1. ติดตั้ง dependency

```bash
npm install
```

2. สร้างไฟล์ environment

```bash
cp .env.example .env.local
```

3. รัน PostgreSQL เอง หรือใช้ Docker Compose

```bash
docker compose up --build
```

4. รันโปรเจกต์ในโหมดพัฒนา

```bash
npm run dev
```

## Before opening a pull request

รันคำสั่งเหล่านี้ก่อนทุกครั้ง:

```bash
npm run lint
npm run build
```

## Pull request guidelines

- ใช้ branch name ที่สื่อความหมาย เช่น `add-ci-workflow` หรือ `fix-login-validation`
- อธิบายสิ่งที่เปลี่ยนและเหตุผลให้ชัดเจน
- ถ้าแก้ behavior ของ auth flow ให้ระบุผลกระทบกับ `login`, `forgot-iduser`, `forgot-password`, หรือ `register`
- อย่า commit secret จริงลง repo
- demo credentials ใน repo นี้มีไว้เพื่อการพัฒนาและตัวอย่างเท่านั้น

## Scope

เหมาะกับ contribution ประเภทนี้:

- ปรับปรุง reusable auth flow
- แก้ validation หรือ session handling
- ปรับเอกสารและ setup ให้เริ่มต้นง่ายขึ้น
- เพิ่ม tooling ที่ช่วยให้ public/open-source usage ดีขึ้น
