#!/bin/bash

git pull
git fetch --all

git checkout release || git checkout -b release origin/release
git merge --no-commit origin/main

git push origin release

git checkout main
