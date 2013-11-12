#!/usr/bin/env node
/**
 * An HTTP media server made specifically for the Wii U browser
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: 4/10/2013
 * License: MIT
 */

var http = require('http');
var path = require('path');

var accesslog = require('access-log');
var easyreq = require('easyreq');
var getopt = require('posix-getopt');

var package = require('./package.json');

function usage() {
  return [
    'usage: wiiu-media-server [options]',
    '',
    'An HTTP media server made specifically for the Wii U browser',
    '',
    'options',
    '  -d, --dir                 the dir out of which to server, env WIIUMEDIASERVER_DIR, defaults to cwd',
    '  -h, --help                print this message and exit',
    '  -H, --host <host>         the host address on which to listen, env WIIUMEDIASERVER_HOST defaults to ' + (opts.host || '0.0.0.0'),
    '  -p, --port <port>         the port on which to listen, env WIIUMEDIASERVER_PORT, defaults to ' + (opts.port || 8085),
    '  -u, --updates             check for available updates on npm',
    '  -v, --version             print the version number and exit'
  ].join('\n');
}

// command line arguments
var options = [
  'd:(dir)',
  'h(help)',
  'H:(host)',
  'p:(port)',
  'u(updates)',
  'v(version)'
].join('');
var parser = new getopt.BasicParser(options, process.argv);

var opts = {
  dir: process.env.WIIUMEDIASERVER_DIR || process.cwd(),
  host: process.env.WIIUMEDIASERVER_HOST,
  port: process.env.WIIUMEDIASERVER_PORT,
};
var option;
while ((option = parser.getopt()) !== undefined) {
  switch (option.option) {
    case 'd': opts.dir = option.optarg; break;
    case 'h': console.log(usage()); process.exit(0);
    case 'H': opts.host = option.optarg; break;
    case 'p': opts.port = option.optarg; break;
    case 'u': // check for updates
      require('latest').checkupdate(package, function(ret, msg) {
        console.log(msg);
        process.exit(ret);
      });
      return;
    case 'v': console.log(package.version); process.exit(0);
    default: console.error(usage()); process.exit(1); break;
  }
}
var args = process.argv.slice(parser.optind());

opts.host = args[1] || opts.host || '0.0.0.0';
opts.port = args[0] || opts.port || 8085;

process.chdir(opts.dir);

// start the server
http.createServer(onrequest).listen(opts.port, opts.host, listening);

function listening() {
  console.log('server started: http://%s:%d', opts.host, opts.port);
}

var sitestaticroute = require('static-route')(
  {
    dir: path.join(__dirname, 'site'),
    autoindex: false,
    logger: function() {},
    tryfiles: ['index.html']
  }
);
var mediastaticroute = require('static-route')(
  {
    autoindex: true,
    logger: function() {},
    slice: '/media',
    tryfiles: []
  }
);

function onrequest(req, res) {
  easyreq(req, res);
  accesslog(req, res);
  if (req.url.indexOf('/media') === 0)
    mediastaticroute(req, res);
  else
    sitestaticroute(req, res);
}
