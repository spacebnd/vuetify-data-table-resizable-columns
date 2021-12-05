#!/usr/bin/env bash

set -e

repo_uri="https://x-access-token:${GH_DEPLOY_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

cd "$GITHUB_WORKSPACE"
npm ci
npm run build:demo

cd src/demo/dist
git init
git config user.name "$GITHUB_ACTOR"
git config user.email "spacebndx@gmail.com"
git add -A -f
git commit -m "deploy demo"
git push -f "$repo_uri" master:gh-pages