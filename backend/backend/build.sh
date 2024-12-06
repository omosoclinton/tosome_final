#!/usr/bin/env bash

# exit on error
set -o errexit

pip install -r ./backend/backend/requirements.txt

python ./backend/backend/manage.py collectstatic --no-input
python ./backend/backend/manage.py migrate

