git pull
git fetch --all

git checkout release || git checkout -b release origin/release
git merge --no-commit origin/main

git commit -m "Merged: main into release"
git push origin release