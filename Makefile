.DEFAULT_GOAL:=help
COMPOSE=docker compose
EXECSVELTEKIT=$(COMPOSE) exec svelte-kit

## All commands available in the Makefile

##@ Helper
help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nAll commands available in the Makefile\n \nUsage:\n  make \033[36m<target>\033[0m\n"} /^[.a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


##@ Starting/stopping the project
start: ## Build and start the project
	make up-recreate db-reset db-fixtures

start-nocache: ## Build and start the project without cache
	build-no-chache up-recreate

up-recreate: ## Start the project and recreate the containers
	$(COMPOSE) up -d --remove-orphans --force-recreate --build

up: ## Start the project
	$(COMPOSE) up -d --remove-orphans

restart: ## Restart the project
	$(COMPOSE) restart

stop: ## Stop the project
	$(COMPOSE) stop

down: ## Stop the project and remove all containers
	$(COMPOSE) down

##@ SSH
ssh: ## SSH into the container
	$(EXECSVELTEKIT) bash

# Build
build-app: ## Build the app
	$(EXECSVELTEKIT) bun run build

preview-app: ## Run the app in preview mode
	$(EXECSVELTEKIT) bun run preview

##@ Linting
lint: ## Run the linter
	$(EXECSVELTEKIT) bun run lint

format: ## Run the formatter
	$(EXECSVELTEKIT) bun run format

##@ Bun
update: ## Update the project
	$(EXECSVELTEKIT) bunx npm-check-updates -i

##@ Logs
logs: ## Show the logs
	$(COMPOSE) logs

logs-app: ## Show the app logs
	$(COMPOSE) logs -f svelte-kit

##@ Tests
test: ## Run the tests
	bun run test

test-ui: ## Run the UI tests
	bunx playwright test --ui

test-install: ## Install the test dependencies
	bunx playwright install

##@ DB
db-push: ## Push the current schema to the database
	$(EXECSVELTEKIT) bunx drizzle-kit push:mysql --config=drizzle/drizzle.config.ts

db-reset: ## Reset the database
	make db-clear
	make db-migrate

db-clear: ## Pull the current schema from the database
	make db-drop
	make db-create

db-drop: ## Drop the database
	$(EXECSVELTEKIT) bun run db:drop

db-create: ## Create the database
	$(EXECSVELTEKIT) bun run db:create

db-migrate: ## Run latest migration
	$(EXECSVELTEKIT) bun run db:migrate

db-fixtures: ## Load fixtures
	$(EXECSVELTEKIT) bun run db:fixtures

db-drop-migration: ## Drop the latest migration from the database
	$(EXECSVELTEKIT) bunx drizzle-kit drop --config=drizzle/drizzle.config.ts

db-create-migration: ## Create a new migration
	$(EXECSVELTEKIT) bunx drizzle-kit generate --config=drizzle/drizzle.config.ts

##@ Utils
cmd: ## Run a command in the bun container
	$(EXECSVELTEKIT) bunx dotenvx run -f .env -f .env.local --overload -- $(filter-out $@,$(MAKECMDGOALS))

bun: ## Run a bun command
	$(EXECSVELTEKIT)  bunx dotenvx run -f .env -f .env.local --overload -- bun $(filter-out $@,$(MAKECMDGOALS))