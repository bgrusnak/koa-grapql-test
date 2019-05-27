.PHONY: docker
docker:
	docker-compose up

docker-start:
	docker-compose up  -d

docker-stop:
	docker-compose down

docker-restart:
	docker-compose down && docker-compose up -d

.PHONY: env
env:
	cp dev.env .env

.PHONY: web
web:
	npm start

.PHONY: migration
migration:
	@while [ -z "$$MIGRATION_NAME" ]; do \
		read -r -p "Enter Migration Name: " MIGRATION_NAME; \
	done ; \
	npx knex migrate:make "$$MIGRATION_NAME"

.PHONY: migrate
migrate:
	npx knex migrate:latest

.PHONY: migrate_down
migrate_down:
	npx knex migrate:rollback

.PHONY: seed
seed:
	npx knex seed:run