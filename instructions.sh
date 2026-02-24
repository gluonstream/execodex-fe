#!/usr/bin/env bash
docker build -t moldovean/execodex-fe:latest .
docker push gluonstream/execodex-fe:latest
docker push moldovean/execodex-fe:latest
#kind load docker-image execodex-fe:latest --name s4v3
kubectl apply -k k8s
kubectl rollout restart deployment/execodex-fe -n execodex
