# ws-k8s

Running mongo instance with Docker

```
docker run -p 27017:27017 -d --name some-mongo -e MONGO_INITDB_ROOT_USERNAME=username -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```
Running redis instance with Docker
```
docker run -p 6379:6379 --name some-redis -d redis
```
