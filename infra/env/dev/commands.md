```
kind create cluster --name ws-k8s --config ./kind-4-nodes.yml
kind load docker-image backend-api --name ws-k8s
kind load docker-image frontend-nextjs --name ws-k8s
```