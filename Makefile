.PHONY: dev build update all frontend-dev backend-dev frontend-build backend-build \
        frontend-update backend-update clean

# ─── Development ───────────────────────────────────────────

dev: backend-dev frontend-dev          ## Run both servers concurrently

backend-dev:                           ## Start Go backend on :8080
	cd backend && go run ./cmd/server

frontend-dev:                          ## Start Next.js frontend on :3000
	cd frontend && bun run dev

# ─── Building ──────────────────────────────────────────────

build: backend-build frontend-build    ## Build both binaries

backend-build:                         ## Compile Go binary
	cd backend && go build -o bin/server ./cmd/server

frontend-build:                        ## Build Next.js static output
	cd frontend && bun run build

# ─── Updating Packages ─────────────────────────────────────

update: backend-update frontend-update ## Update all dependencies

backend-update:                        ## Tidy Go modules
	cd backend && go get -u ./... && go mod tidy

frontend-update:                       ## Update bun packages
	cd frontend && bunx bun-check-updates -u 2>/dev/null || bun update && bun install

# ─── Utilities ─────────────────────────────────────────────

clean:                                 ## Remove build artifacts
	rm -rf backend/bin frontend/.next frontend/node_modules

help:                                  ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
