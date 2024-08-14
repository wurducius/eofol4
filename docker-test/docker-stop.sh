#!/bin/bash

RUNNING=$(docker ps -q -f ancestor=eofol4-test)
COUNT=${#RUNNING}

if [ $((COUNT)) != 0 ]; then
docker rm $(docker stop $RUNNING) > /dev/null
fi
