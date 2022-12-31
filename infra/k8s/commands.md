```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

kubectl apply -f ./configs/mongo-secret.yml
kubectl apply -f ./configs/mongo-configmap.yml
kubectl apply -f ./configs/redis-configmap.yml
kubectl apply -f ./configs/backend-api-secret.yml

kubectl apply -f ./services/redis.yml
kubectl apply -f ./services/mongo.yml
kubectl apply -f ./services/backend-api.yml
kubectl apply -f ./ingress.yml
```