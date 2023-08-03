#!/bin/sh

echo "Here is the env var"
echo $SENTRY_AUTH_TOKEN

sentry-cli login --auth-token $SENTRY_AUTH_TOKEN
