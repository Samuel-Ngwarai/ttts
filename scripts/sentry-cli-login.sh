#!/bin/sh

source .env

sentry-cli login --auth-token $SENTRY_AUTH_TOKEN
