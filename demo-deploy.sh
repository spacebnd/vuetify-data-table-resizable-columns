#!/usr/bin/env sh

set -e
npm run build:demo
cd dist/demo
git init
git add -A
git commit -m 'deploy demo'
git push -f git@github.com:spacebnd/vuetify-data-table-resizable-columns.git master:gh-pages
cd ../..