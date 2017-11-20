# Build utility targets.

CONTAINER_NAME=default-skill-name
CONTAINER_TAG=latest

build:
	docker build -t ${CONTAINER_NAME}:${CONTAINER_TAG} .

run:
	docker run --rm \
		-v $$(pwd)/dist:/usr/src/app/dist \
		--name ${CONTAINER_NAME} ${CONTAINER_NAME}

stop:
	docker stop ${OONTAINER_NAME}

daemon:
	docker-compose daemon

up-api:
	docker-compose up api

shell:
	docker exec -it ${CONTAINER_NAME} /bin/bash

tail:
	docker logs ${CONTAINER_NAME}

test:
	docker-compose exec  /bin/sh -c go test

cleanup:
	docker rm -v $$(docker ps --filter status=exited -q 2>/dev/null) 2>/dev/null
	docker rmi $$(docker images --filter dangling=true -q 2>/dev/null) 2>/dev/null
	docker volume rm $$(docker volume ls -qf dangling=true)

.PHONY: build up daemon stop cleanup shell tail test
