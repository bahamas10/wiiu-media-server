WiiU Media Server
=================

An HTTP media server made specifically for the Wii U browser

Pre-Alpha
---------

This software is pre-alpha status.  It looks good, but nothing currently
plays on the WiiU as it lacks a LOT of codecs.

todo

- `ffmpeg` or similar for live transcoding of `.avi` and `.mkv` to `.mp4`
- Screenshots of the browser on the WiiU Controller and the TV
- YouTube video when it all works going over installation and usage

Installation
------------

    [sudo] npm install -g wiiu-media-server

Usage
-----

    $ wiiu-media-server
    server started: http://0.0.0.0:8085
    127.0.0.1 - - [12/Nov/2013:00:42:20 -0500] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36"

License
-------

MIT
