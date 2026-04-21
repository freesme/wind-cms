# Repository Guidelines

## Project Structure & Module Organization
`app/admin/service`, `app/app/service`, and `app/core/service` are the Kratos services in this repo. Each service follows the same layout: `cmd/server` for startup code, `configs` for runtime config, and `internal` for business logic and data access. Put shared libraries in `pkg/`. Keep protobuf sources in `api/protos`, generated API artifacts in `api/gen`, SQL seed/demo data in `sql/`, and deployment helpers in `scripts/`.

## Build, Test, and Development Commands
Use the root `Makefile` for repo-wide tasks:

- `make dep`: download Go module dependencies.
- `make test`: run `go test ./...` across the repository.
- `make cover`: generate `coverage.out`.
- `make lint`: run `golangci-lint`.
- `make api` / `make openapi` / `make ts`: regenerate protobuf, OpenAPI, and TypeScript clients from `api/`.
- `make build`: regenerate APIs and build all services.
- `make docker-libs` or `make docker-up`: start dependencies only, or the full Docker stack.

For one service, work from its directory, for example `cd app/core/service && make run` or `make build`. Run `make ent` and `make wire` there after schema or dependency-injection changes.

## Coding Style & Naming Conventions
Format Go code with `gofmt` and keep `golangci-lint run` clean before opening a PR. Follow standard Go naming: lowercase package names, `PascalCase` for exported identifiers, `camelCase` for internal helpers, and descriptive `snake_case` filenames when a file spans one concern, such as `user_repo.go`. Do not hand-edit generated code under `api/gen` or `internal/data/ent`; regenerate it. YAML files are linted with `.yamllint`, so prefer quoted strings where appropriate.

## Testing Guidelines
Keep tests next to the code they validate and name them `*_test.go`. Prefer table-driven tests for service and utility packages. Run `make test` before pushing, and use targeted runs while iterating, for example `go test ./app/core/service/internal/data -run TestUserRepo`. No numeric coverage gate is defined, but changes should maintain or improve coverage in touched packages.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit prefixes such as `feat:` and `fix:`; keep that format and write short imperative subjects. PRs should describe the affected service or package, mention config, schema, or generated-code updates, and list the validation commands you ran. Include screenshots only when API docs or admin/app-facing behavior changes.

## Configuration & Generated Assets
Treat `.env` files, Docker Compose settings, and service configs as environment-specific; never commit secrets. When changing protobufs, Ent schemas, or Wire providers, commit the regenerated outputs in the same change so the branch stays buildable.
