#!/bin/sh
sleep 5 # wait a few seconds so the terminal isn't always the first capture
while (true) do
    DATE=$(date +"%Y-%m-%d")
    TIME=$(date +"%H-%M-%S")
    FULL_FILE="./static/img/screens/full/$DATE--$TIME.png"
    THUMB_FILE="./static/img/screens/thumbs/$DATE--$TIME.png"

    screencapture -x "$FULL_FILE" > /dev/null 2>&1

    if [ -f "$FULL_FILE" ]
    then
        cp "$FULL_FILE" "./static/img/screens/thumbs"
        sips -Z 200 "$THUMB_FILE" > /dev/null 2>&1
        if [ -f "$THUMB_FILE" ]
        then
            ls ./static/img/screens/thumbs > ./static/img/screens/screens-list.txt # recreate the list of files every time
            printf "." # a little feedback in the shell so you can see that this is running
        else
            printf "#" # file failed to copy -- this never seems to happen
        fi
    else
        printf "?" # screen capture failed -- this seems to happen often, but it may be when machine is asleep or similar
    fi

    # TODO: something to cull old screen caps

    sleep 300
done
