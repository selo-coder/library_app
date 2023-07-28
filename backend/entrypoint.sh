#!/bin/bash

exec gunicorn --config backend/gunicorn_conf.py --bind 0.0.0.0:5000 backend.app:app