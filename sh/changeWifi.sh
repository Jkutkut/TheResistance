#!/bin/sh
dir="/dev/rfcomm0"

# while inotifywait -e modify $dir; do
while true; do
  if tail -n1 $dir | grep wifi; then
    echo "Hey!! wifi found"
  fi
done