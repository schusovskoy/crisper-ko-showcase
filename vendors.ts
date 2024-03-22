///<reference path="./typings/browser.d.ts" />
///<reference path="./typings/userdefined.d.ts" />
///<reference path="./typings/leaflet.d.ts" />
///<reference path="./node_modules/reflect-metadata/reflect-metadata.d.ts" />

require("reflect-metadata");

window["$"] = window["jQuery"] = require("jquery");
require("jquery.inputmask");
window["IScroll"] = require("iscroll/build/iscroll-probe");

require("sammy");

window["ko"] = require("knockout");
require("leaflet");
require("leaflet.markercluster");