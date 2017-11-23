# Build utility targets.

include Makefile.env

build:
	docker build -t ${CONTAINER_NAME}:${CONTAINER_TAG} .

run:
	docker run --rm -it \
		--env-file $$(pwd)/.env \
		-v $$(pwd)/dist:/usr/src/app/dist \
		-v $$(pwd)/src:/usr/src/app/src \
		-v $$(pwd)/test:/usr/src/app/test \
		--name ${CONTAINER_NAME} \
		${CONTAINER_NAME}

test:
	docker run --rm -it \
		--env-file $$(pwd)/.env \
        -v $$(pwd)/dist:/usr/src/app/dist \
		-v $$(pwd)/src:/usr/src/app/src \
		-v $$(pwd)/test:/usr/src/app/test \
        --name ${CONTAINER_NAME} \
        ${CONTAINER_NAME} \
        mocha

server:
	docker run --rm -it \
		--env-file $$(pwd)/.env \
        -v $$(pwd)/dist:/usr/src/app/dist \
		-v $$(pwd)/src:/usr/src/app/src \
		-v $$(pwd)/test:/usr/src/app/test \
        --name ${CONTAINER_NAME} \
        ${CONTAINER_NAME} \
        tail -f /dev/null

stop:
	docker stop ${CONTAINER_NAME}

clean:
	rm -rf dist

daemon:
	docker-compose daemon

up-api:
	docker-compose up api

shell:
	docker exec -it ${CONTAINER_NAME} /bin/bash

tail:
	docker logs ${CONTAINER_NAME}

cleanup:
	docker rm -v $$(docker ps --filter status=exited -q 2>/dev/null) 2>/dev/null
	docker rmi $$(docker images --filter dangling=true -q 2>/dev/null) 2>/dev/null
	docker volume rm $$(docker volume ls -qf dangling=true)

.PHONY: build up daemon stop cleanup shell tail test
