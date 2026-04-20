# Contributing

Thanks for contributing to this project.

## Development setup

1. Install dependencies

```bash
npm install
```

2. Create the environment file

```bash
cp .env.example .env.local
```

3. Start PostgreSQL yourself or use Docker Compose

```bash
docker compose up --build
```

4. Run the project in development mode

```bash
npm run dev
```

## Before opening a pull request

Run these commands before opening a pull request:

```bash
npm run lint
npm run build
```

## Pull request guidelines

- Use a descriptive branch name such as `add-ci-workflow` or `fix-login-validation`
- Explain what changed and why
- If you change auth behavior, describe the impact on `login`, `forgot-iduser`, `forgot-password`, or `register`
- Do not commit real secrets into the repository
- Demo credentials in this repository are development-only examples

## Scope

Useful contribution areas include:

- improving reusable auth flows
- fixing validation or session handling
- improving documentation and setup
- adding tooling that makes the project easier to use as an open-source starter
