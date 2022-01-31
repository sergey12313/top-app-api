mongo_start:
		docker-compose -f docker-compose.mongo.dev.yml up --build -d
mongo_stop:
		docker-compose -f docker-compose.mongo.dev.yml down

prod:
		docker-compose  up --build -d