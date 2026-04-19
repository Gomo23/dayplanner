#!/bin/bash
JENKINS_URL=$1
JENKINS_JOB=$2
JENKINS_USER=$3
JENKINS_TOKEN=$4

CRUMB=$(curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" \
  "$JENKINS_URL/crumbIssuer/api/json" | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print(d['crumbRequestField']+':'+d['crumb'])")

echo "Crumb fetched: $CRUMB"

curl -X POST "$JENKINS_URL/job/$JENKINS_JOB/build" \
  -u "$JENKINS_USER:$JENKINS_TOKEN" \
  -H "$CRUMB" \
  -w "\nHTTP Status: %{http_code}\n"
