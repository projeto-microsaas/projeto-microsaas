#!/bin/bash
cd /Users/thais/Documents/projeto-microsaas || { echo "Directory not found"; exit 1; }
docker compose up --build