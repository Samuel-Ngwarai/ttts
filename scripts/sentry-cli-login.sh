#!/bin/sh

echo $SENTRY_AUTH_TOKEN

sentry-cli login --auth-token $SENTRY_AUTH_TOKEN
