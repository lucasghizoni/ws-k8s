# ws-k8s

Running mongo instance with Docker

```
docker run -p 27017:27017 --name some-mongo -v $(pwd)/data/db:/data/db -d mongo
```