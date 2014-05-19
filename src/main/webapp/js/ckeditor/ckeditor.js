﻿/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */
(function () {
    if (window.CKEDITOR && window.CKEDITOR.dom)return;
    window.CKEDITOR || (window.CKEDITOR = function () {
        var a = {timestamp: "D3NA", version: "4.1.1", revision: "5a2a7e3", rnd: Math.floor(900 * Math.random()) + 100, _: {pending: []}, status: "unloaded", basePath: function () {
            var b = window.CKEDITOR_BASEPATH || "";
            if (!b)for (var a = document.getElementsByTagName("script"), d = 0; d < a.length; d++) {
                var c = a[d].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);
                if (c) {
                    b = c[1];
                    break
                }
            }
            -1 == b.indexOf(":/") && (b = 0 === b.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] + b : location.href.match(/^[^\?]*\/(?:)/)[0] +
                b);
            if (!b)throw'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
            return b
        }(), getUrl: function (b) {
            -1 == b.indexOf(":/") && 0 !== b.indexOf("/") && (b = this.basePath + b);
            this.timestamp && ("/" != b.charAt(b.length - 1) && !/[&?]t=/.test(b)) && (b += (0 <= b.indexOf("?") ? "&" : "?") + "t=" + this.timestamp);
            return b
        }, domReady: function () {
            function b() {
                try {
                    document.addEventListener ? (document.removeEventListener("DOMContentLoaded", b,
                        !1), a()) : document.attachEvent && "complete" === document.readyState && (document.detachEvent("onreadystatechange", b), a())
                } catch (d) {
                }
            }

            function a() {
                for (var b; b = d.shift();)b()
            }

            var d = [];
            return function (a) {
                d.push(a);
                "complete" === document.readyState && setTimeout(b, 1);
                if (1 == d.length)if (document.addEventListener)document.addEventListener("DOMContentLoaded", b, !1), window.addEventListener("load", b, !1); else if (document.attachEvent) {
                    document.attachEvent("onreadystatechange", b);
                    window.attachEvent("onload", b);
                    a = !1;
                    try {
                        a = !window.frameElement
                    } catch (e) {
                    }
                    if (document.documentElement.doScroll && a) {
                        var c = function () {
                            try {
                                document.documentElement.doScroll("left")
                            } catch (a) {
                                setTimeout(c, 1);
                                return
                            }
                            b()
                        };
                        c()
                    }
                }
            }
        }()}, c = window.CKEDITOR_GETURL;
        if (c) {
            var b = a.getUrl;
            a.getUrl = function (f) {
                return c.call(a, f) || b.call(a, f)
            }
        }
        return a
    }());
    CKEDITOR.event || (CKEDITOR.event = function () {
    }, CKEDITOR.event.implementOn = function (a) {
        var c = CKEDITOR.event.prototype, b;
        for (b in c)a[b] == void 0 && (a[b] = c[b])
    }, CKEDITOR.event.prototype = function () {
        function a(f) {
            var a = c(this);
            return a[f] || (a[f] = new b(f))
        }

        var c = function (b) {
            b = b.getPrivate && b.getPrivate() || b._ || (b._ = {});
            return b.events || (b.events = {})
        }, b = function (b) {
            this.name = b;
            this.listeners = []
        };
        b.prototype = {getListenerIndex: function (b) {
            for (var a = 0, d = this.listeners; a < d.length; a++)if (d[a].fn == b)return a;
            return-1
        }};
        return{define: function (b, e) {
            var d = a.call(this, b);
            CKEDITOR.tools.extend(d, e, true)
        }, on: function (b, e, d, c, l) {
            function i(a, h, n, p) {
                a = {name: b, sender: this, editor: a, data: h, listenerData: c, stop: n, cancel: p, removeListener: m};
                return e.call(d, a) === false ? false : a.data
            }

            function m() {
                r.removeListener(b, e)
            }

            var n = a.call(this, b);
            if (n.getListenerIndex(e) < 0) {
                n = n.listeners;
                d || (d = this);
                isNaN(l) && (l = 10);
                var r = this;
                i.fn = e;
                i.priority = l;
                for (var p = n.length - 1; p >= 0; p--)if (n[p].priority <= l) {
                    n.splice(p + 1, 0, i);
                    return{removeListener: m}
                }
                n.unshift(i)
            }
            return{removeListener: m}
        },
            once: function () {
                var b = arguments[1];
                arguments[1] = function (a) {
                    a.removeListener();
                    return b.apply(this, arguments)
                };
                return this.on.apply(this, arguments)
            }, capture: function () {
                CKEDITOR.event.useCapture = 1;
                var b = this.on.apply(this, arguments);
                CKEDITOR.event.useCapture = 0;
                return b
            }, fire: function () {
                var b = 0, a = function () {
                    b = 1
                }, d = 0, j = function () {
                    d = 1
                };
                return function (l, i, m) {
                    var n = c(this)[l], l = b, r = d;
                    b = d = 0;
                    if (n) {
                        var p = n.listeners;
                        if (p.length)for (var p = p.slice(0), g, h = 0; h < p.length; h++) {
                            if (n.errorProof)try {
                                g = p[h].call(this,
                                    m, i, a, j)
                            } catch (u) {
                            } else g = p[h].call(this, m, i, a, j);
                            g === false ? d = 1 : typeof g != "undefined" && (i = g);
                            if (b || d)break
                        }
                    }
                    i = d ? false : typeof i == "undefined" ? true : i;
                    b = l;
                    d = r;
                    return i
                }
            }(), fireOnce: function (b, a, d) {
                a = this.fire(b, a, d);
                delete c(this)[b];
                return a
            }, removeListener: function (b, a) {
                var d = c(this)[b];
                if (d) {
                    var j = d.getListenerIndex(a);
                    j >= 0 && d.listeners.splice(j, 1)
                }
            }, removeAllListeners: function () {
                var b = c(this), a;
                for (a in b)delete b[a]
            }, hasListeners: function (b) {
                return(b = c(this)[b]) && b.listeners.length > 0
            }}
    }());
    CKEDITOR.editor || (CKEDITOR.editor = function () {
        CKEDITOR._.pending.push([this, arguments]);
        CKEDITOR.event.call(this)
    }, CKEDITOR.editor.prototype.fire = function (a, c) {
        a in{instanceReady: 1, loaded: 1} && (this[a] = true);
        return CKEDITOR.event.prototype.fire.call(this, a, c, this)
    }, CKEDITOR.editor.prototype.fireOnce = function (a, c) {
        a in{instanceReady: 1, loaded: 1} && (this[a] = true);
        return CKEDITOR.event.prototype.fireOnce.call(this, a, c, this)
    }, CKEDITOR.event.implementOn(CKEDITOR.editor.prototype));
    CKEDITOR.env || (CKEDITOR.env = function () {
        var a = navigator.userAgent.toLowerCase(), c = window.opera, b = {ie: eval("/*@cc_on!@*/false"), opera: !!c && c.version, webkit: a.indexOf(" applewebkit/") > -1, air: a.indexOf(" adobeair/") > -1, mac: a.indexOf("macintosh") > -1, quirks: document.compatMode == "BackCompat", mobile: a.indexOf("mobile") > -1, iOS: /(ipad|iphone|ipod)/.test(a), isCustomDomain: function () {
            if (!this.ie)return false;
            var b = document.domain, a = window.location.hostname;
            return b != a && b != "[" + a + "]"
        }, secure: location.protocol ==
            "https:"};
        b.gecko = navigator.product == "Gecko" && !b.webkit && !b.opera;
        if (b.webkit)a.indexOf("chrome") > -1 ? b.chrome = true : b.safari = true;
        var f = 0;
        if (b.ie) {
            f = b.quirks || !document.documentMode ? parseFloat(a.match(/msie (\d+)/)[1]) : document.documentMode;
            b.ie9Compat = f == 9;
            b.ie8Compat = f == 8;
            b.ie7Compat = f == 7;
            b.ie6Compat = f < 7 || b.quirks
        }
        if (b.gecko) {
            var e = a.match(/rv:([\d\.]+)/);
            if (e) {
                e = e[1].split(".");
                f = e[0] * 1E4 + (e[1] || 0) * 100 + (e[2] || 0) * 1
            }
        }
        b.opera && (f = parseFloat(c.version()));
        b.air && (f = parseFloat(a.match(/ adobeair\/(\d+)/)[1]));
        b.webkit && (f = parseFloat(a.match(/ applewebkit\/(\d+)/)[1]));
        b.version = f;
        b.isCompatible = b.iOS && f >= 534 || !b.mobile && (b.ie && f > 6 || b.gecko && f >= 10801 || b.opera && f >= 9.5 || b.air && f >= 1 || b.webkit && f >= 522 || false);
        b.cssClass = "cke_browser_" + (b.ie ? "ie" : b.gecko ? "gecko" : b.opera ? "opera" : b.webkit ? "webkit" : "unknown");
        if (b.quirks)b.cssClass = b.cssClass + " cke_browser_quirks";
        if (b.ie) {
            b.cssClass = b.cssClass + (" cke_browser_ie" + (b.quirks || b.version < 7 ? "6" : b.version));
            if (b.quirks)b.cssClass = b.cssClass + " cke_browser_iequirks"
        }
        if (b.gecko)if (f <
            10900)b.cssClass = b.cssClass + " cke_browser_gecko18"; else if (f <= 11E3)b.cssClass = b.cssClass + " cke_browser_gecko19";
        if (b.air)b.cssClass = b.cssClass + " cke_browser_air";
        return b
    }());
    "unloaded" == CKEDITOR.status && function () {
        CKEDITOR.event.implementOn(CKEDITOR);
        CKEDITOR.loadFullCore = function () {
            if (CKEDITOR.status != "basic_ready")CKEDITOR.loadFullCore._load = 1; else {
                delete CKEDITOR.loadFullCore;
                var a = document.createElement("script");
                a.type = "text/javascript";
                a.src = CKEDITOR.basePath + "ckeditor.js";
                document.getElementsByTagName("head")[0].appendChild(a)
            }
        };
        CKEDITOR.loadFullCoreTimeout = 0;
        CKEDITOR.add = function (a) {
            (this._.pending || (this._.pending = [])).push(a)
        };
        (function () {
            CKEDITOR.domReady(function () {
                var a =
                    CKEDITOR.loadFullCore, c = CKEDITOR.loadFullCoreTimeout;
                if (a) {
                    CKEDITOR.status = "basic_ready";
                    a && a._load ? a() : c && setTimeout(function () {
                        CKEDITOR.loadFullCore && CKEDITOR.loadFullCore()
                    }, c * 1E3)
                }
            })
        })();
        CKEDITOR.status = "basic_loaded"
    }();
    CKEDITOR.dom = {};
    (function () {
        var a = [], c = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.opera ? "-o-" : CKEDITOR.env.ie ? "-ms-" : "";
        CKEDITOR.on("reset", function () {
            a = []
        });
        CKEDITOR.tools = {arrayCompare: function (b, a) {
            if (!b && !a)return true;
            if (!b || !a || b.length != a.length)return false;
            for (var e = 0; e < b.length; e++)if (b[e] != a[e])return false;
            return true
        }, clone: function (b) {
            var a;
            if (b && b instanceof Array) {
                a = [];
                for (var e = 0; e < b.length; e++)a[e] = CKEDITOR.tools.clone(b[e]);
                return a
            }
            if (b === null || typeof b != "object" ||
                b instanceof String || b instanceof Number || b instanceof Boolean || b instanceof Date || b instanceof RegExp)return b;
            a = new b.constructor;
            for (e in b)a[e] = CKEDITOR.tools.clone(b[e]);
            return a
        }, capitalize: function (b) {
            return b.charAt(0).toUpperCase() + b.substring(1).toLowerCase()
        }, extend: function (b) {
            var a = arguments.length, e, d;
            if (typeof(e = arguments[a - 1]) == "boolean")a--; else if (typeof(e = arguments[a - 2]) == "boolean") {
                d = arguments[a - 1];
                a = a - 2
            }
            for (var c = 1; c < a; c++) {
                var l = arguments[c], i;
                for (i in l)if (e === true || b[i] == void 0)if (!d ||
                    i in d)b[i] = l[i]
            }
            return b
        }, prototypedCopy: function (b) {
            var a = function () {
            };
            a.prototype = b;
            return new a
        }, copy: function (b) {
            var a = {}, e;
            for (e in b)a[e] = b[e];
            return a
        }, isArray: function (b) {
            return!!b && b instanceof Array
        }, isEmpty: function (b) {
            for (var a in b)if (b.hasOwnProperty(a))return false;
            return true
        }, cssVendorPrefix: function (b, a, e) {
            if (e)return c + b + ":" + a + ";" + b + ":" + a;
            e = {};
            e[b] = a;
            e[c + b] = a;
            return e
        }, cssStyleToDomStyle: function () {
            var b = document.createElement("div").style, a = typeof b.cssFloat != "undefined" ? "cssFloat" :
                typeof b.styleFloat != "undefined" ? "styleFloat" : "float";
            return function (b) {
                return b == "float" ? a : b.replace(/-./g, function (b) {
                    return b.substr(1).toUpperCase()
                })
            }
        }(), buildStyleHtml: function (b) {
            for (var b = [].concat(b), a, e = [], d = 0; d < b.length; d++)if (a = b[d])/@import|
            [
                {}
            ] /
            .
            test(a) ? e.push("<style>" + a + "</style>") : e.push('<link type="text/css" rel=stylesheet href="' + a + '">');
            return e.join("")
        }, htmlEncode: function (b) {
            return("" + b).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;")
        }, htmlEncodeAttr: function (b) {
            return b.replace(/"/g,
                "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }, getNextNumber: function () {
            var b = 0;
            return function () {
                return++b
            }
        }(), getNextId: function () {
            return"cke_" + this.getNextNumber()
        }, override: function (b, a) {
            var e = a(b);
            e.prototype = b.prototype;
            return e
        }, setTimeout: function (b, a, e, d, c) {
            c || (c = window);
            e || (e = c);
            return c.setTimeout(function () {
                d ? b.apply(e, [].concat(d)) : b.apply(e)
            }, a || 0)
        }, trim: function () {
            var b = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
            return function (a) {
                return a.replace(b, "")
            }
        }(), ltrim: function () {
            var b = /^[ \t\n\r]+/g;
            return function (a) {
                return a.replace(b, "")
            }
        }(), rtrim: function () {
            var b = /[ \t\n\r]+$/g;
            return function (a) {
                return a.replace(b, "")
            }
        }(), indexOf: function (b, a) {
            if (typeof a == "function")for (var e = 0, d = b.length; e < d; e++) {
                if (a(b[e]))return e
            } else {
                if (b.indexOf)return b.indexOf(a);
                e = 0;
                for (d = b.length; e < d; e++)if (b[e] === a)return e
            }
            return-1
        }, search: function (b, a) {
            var e = CKEDITOR.tools.indexOf(b, a);
            return e >= 0 ? b[e] : null
        }, bind: function (b, a) {
            return function () {
                return b.apply(a, arguments)
            }
        }, createClass: function (b) {
            var a = b.$,
                e = b.base, d = b.privates || b._, c = b.proto, b = b.statics;
            !a && (a = function () {
                e && this.base.apply(this, arguments)
            });
            if (d)var l = a, a = function () {
                var b = this._ || (this._ = {}), a;
                for (a in d) {
                    var f = d[a];
                    b[a] = typeof f == "function" ? CKEDITOR.tools.bind(f, this) : f
                }
                l.apply(this, arguments)
            };
            if (e) {
                a.prototype = this.prototypedCopy(e.prototype);
                a.prototype.constructor = a;
                a.base = e;
                a.baseProto = e.prototype;
                a.prototype.base = function () {
                    this.base = e.prototype.base;
                    e.apply(this, arguments);
                    this.base = arguments.callee
                }
            }
            c && this.extend(a.prototype,
                c, true);
            b && this.extend(a, b, true);
            return a
        }, addFunction: function (b, f) {
            return a.push(function () {
                return b.apply(f || this, arguments)
            }) - 1
        }, removeFunction: function (b) {
            a[b] = null
        }, callFunction: function (b) {
            var f = a[b];
            return f && f.apply(window, Array.prototype.slice.call(arguments, 1))
        }, cssLength: function () {
            var b = /^-?\d+\.?\d*px$/, a;
            return function (e) {
                a = CKEDITOR.tools.trim(e + "") + "px";
                return b.test(a) ? a : e || ""
            }
        }(), convertToPx: function () {
            var b;
            return function (a) {
                if (!b) {
                    b = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>',
                        CKEDITOR.document);
                    CKEDITOR.document.getBody().append(b)
                }
                if (!/%$/.test(a)) {
                    b.setStyle("width", a);
                    return b.$.clientWidth
                }
                return a
            }
        }(), repeat: function (b, a) {
            return Array(a + 1).join(b)
        }, tryThese: function () {
            for (var b, a = 0, e = arguments.length; a < e; a++) {
                var d = arguments[a];
                try {
                    b = d();
                    break
                } catch (c) {
                }
            }
            return b
        }, genKey: function () {
            return Array.prototype.slice.call(arguments).join("-")
        }, defer: function (b) {
            return function () {
                var a = arguments, e = this;
                window.setTimeout(function () {
                    b.apply(e, a)
                }, 0)
            }
        }, normalizeCssText: function (b, a) {
            var e = [], d, c = CKEDITOR.tools.parseCssText(b, true, a);
            for (d in c)e.push(d + ":" + c[d]);
            e.sort();
            return e.length ? e.join(";") + ";" : ""
        }, convertRgbToHex: function (b) {
            return b.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function (b, a, d, c) {
                b = [a, d, c];
                for (a = 0; a < 3; a++)b[a] = ("0" + parseInt(b[a], 10).toString(16)).slice(-2);
                return"#" + b.join("")
            })
        }, parseCssText: function (b, a, e) {
            var d = {};
            if (e) {
                e = new CKEDITOR.dom.element("span");
                e.setAttribute("style", b);
                b = CKEDITOR.tools.convertRgbToHex(e.getAttribute("style") ||
                    "")
            }
            if (!b || b == ";")return d;
            b.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function (b, e, c) {
                if (a) {
                    e = e.toLowerCase();
                    e == "font-family" && (c = c.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ","));
                    c = CKEDITOR.tools.trim(c)
                }
                d[e] = c
            });
            return d
        }, writeCssText: function (b, a) {
            var e, c = [];
            for (e in b)c.push(e + ":" + b[e]);
            a && c.sort();
            return c.join("; ")
        }, objectCompare: function (b, a, c) {
            var d;
            if (!b && !a)return true;
            if (!b || !a)return false;
            for (d in b)if (b[d] != a[d])return false;
            if (!c)for (d in a)if (b[d] !=
                a[d])return false;
            return true
        }, objectKeys: function (b) {
            var a = [], c;
            for (c in b)a.push(c);
            return a
        }, convertArrayToObject: function (b, a) {
            var c = {};
            arguments.length == 1 && (a = true);
            for (var d = 0, j = b.length; d < j; ++d)c[b[d]] = a;
            return c
        }}
    })();
    CKEDITOR.dtd = function () {
        var a = CKEDITOR.tools.extend, c = function (b, a) {
            for (var f = CKEDITOR.tools.clone(b), c = 1; c < arguments.length; c++) {
                var a = arguments[c], g;
                for (g in a)delete f[g]
            }
            return f
        }, b = {}, f = {}, e = {address: 1, article: 1, aside: 1, blockquote: 1, details: 1, div: 1, dl: 1, fieldset: 1, figure: 1, footer: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, header: 1, hgroup: 1, hr: 1, menu: 1, nav: 1, ol: 1, p: 1, pre: 1, section: 1, table: 1, ul: 1}, d = {command: 1, link: 1, meta: 1, noscript: 1, script: 1, style: 1}, j = {}, l = {"#": 1}, i = {center: 1, dir: 1, noframes: 1};
        a(b, {a: 1, abbr: 1, area: 1, audio: 1, b: 1, bdi: 1, bdo: 1, br: 1, button: 1, canvas: 1, cite: 1, code: 1, command: 1, datalist: 1, del: 1, dfn: 1, em: 1, embed: 1, i: 1, iframe: 1, img: 1, input: 1, ins: 1, kbd: 1, keygen: 1, label: 1, map: 1, mark: 1, meter: 1, noscript: 1, object: 1, output: 1, progress: 1, q: 1, ruby: 1, s: 1, samp: 1, script: 1, select: 1, small: 1, span: 1, strong: 1, sub: 1, sup: 1, textarea: 1, time: 1, u: 1, "var": 1, video: 1, wbr: 1}, l, {acronym: 1, applet: 1, basefont: 1, big: 1, font: 1, isindex: 1, strike: 1, style: 1, tt: 1});
        a(f, e, b, i);
        c = {a: c(b, {a: 1, button: 1}), abbr: b, address: f,
            area: j, article: a({style: 1}, f), aside: a({style: 1}, f), audio: a({source: 1, track: 1}, f), b: b, base: j, bdi: b, bdo: b, blockquote: f, body: f, br: j, button: c(b, {a: 1, button: 1}), canvas: b, caption: f, cite: b, code: b, col: j, colgroup: {col: 1}, command: j, datalist: a({option: 1}, b), dd: f, del: b, details: a({summary: 1}, f), dfn: b, div: a({style: 1}, f), dl: {dt: 1, dd: 1}, dt: f, em: b, embed: j, fieldset: a({legend: 1}, f), figcaption: f, figure: a({figcaption: 1}, f), footer: f, form: f, h1: b, h2: b, h3: b, h4: b, h5: b, h6: b, head: a({title: 1, base: 1}, d), header: f, hgroup: {h1: 1,
                h2: 1, h3: 1, h4: 1, h5: 1, h6: 1}, hr: j, html: a({head: 1, body: 1}, f, d), i: b, iframe: l, img: j, input: j, ins: b, kbd: b, keygen: j, label: b, legend: b, li: f, link: j, map: f, mark: b, menu: a({li: 1}, f), meta: j, meter: c(b, {meter: 1}), nav: f, noscript: a({link: 1, meta: 1, style: 1}, b), object: a({param: 1}, b), ol: {li: 1}, optgroup: {option: 1}, option: l, output: b, p: b, param: j, pre: b, progress: c(b, {progress: 1}), q: b, rp: b, rt: b, ruby: a({rp: 1, rt: 1}, b), s: b, samp: b, script: l, section: a({style: 1}, f), select: {optgroup: 1, option: 1}, small: b, source: j, span: b, strong: b, style: l,
            sub: b, summary: b, sup: b, table: {caption: 1, colgroup: 1, thead: 1, tfoot: 1, tbody: 1, tr: 1}, tbody: {tr: 1}, td: f, textarea: l, tfoot: {tr: 1}, th: f, thead: {tr: 1}, time: c(b, {time: 1}), title: l, tr: {th: 1, td: 1}, track: j, u: b, ul: {li: 1}, "var": b, video: a({source: 1, track: 1}, f), wbr: j, acronym: b, applet: a({param: 1}, f), basefont: j, big: b, center: f, dialog: j, dir: {li: 1}, font: b, isindex: j, noframes: f, strike: b, tt: b};
        a(c, {$block: a({audio: 1, dd: 1, dt: 1, li: 1, video: 1}, e, i), $blockLimit: {article: 1, aside: 1, audio: 1, body: 1, caption: 1, details: 1, dir: 1, div: 1, dl: 1,
            fieldset: 1, figure: 1, footer: 1, form: 1, header: 1, hgroup: 1, menu: 1, nav: 1, ol: 1, section: 1, table: 1, td: 1, th: 1, tr: 1, ul: 1, video: 1}, $cdata: {script: 1, style: 1}, $editable: {address: 1, article: 1, aside: 1, blockquote: 1, body: 1, details: 1, div: 1, fieldset: 1, footer: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, header: 1, hgroup: 1, nav: 1, p: 1, pre: 1, section: 1}, $empty: {area: 1, base: 1, basefont: 1, br: 1, col: 1, command: 1, dialog: 1, embed: 1, hr: 1, img: 1, input: 1, isindex: 1, keygen: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1}, $inline: b, $list: {dl: 1, ol: 1,
            ul: 1}, $listItem: {dd: 1, dt: 1, li: 1}, $nonBodyContent: a({body: 1, head: 1, html: 1}, c.head), $nonEditable: {applet: 1, audio: 1, button: 1, embed: 1, iframe: 1, map: 1, object: 1, option: 1, param: 1, script: 1, textarea: 1, video: 1}, $object: {applet: 1, audio: 1, button: 1, hr: 1, iframe: 1, img: 1, input: 1, object: 1, select: 1, table: 1, textarea: 1, video: 1}, $removeEmpty: {abbr: 1, acronym: 1, b: 1, bdi: 1, bdo: 1, big: 1, cite: 1, code: 1, del: 1, dfn: 1, em: 1, font: 1, i: 1, ins: 1, label: 1, kbd: 1, mark: 1, meter: 1, output: 1, q: 1, ruby: 1, s: 1, samp: 1, small: 1, span: 1, strike: 1, strong: 1,
            sub: 1, sup: 1, time: 1, tt: 1, u: 1, "var": 1}, $tabIndex: {a: 1, area: 1, button: 1, input: 1, object: 1, select: 1, textarea: 1}, $tableContent: {caption: 1, col: 1, colgroup: 1, tbody: 1, td: 1, tfoot: 1, th: 1, thead: 1, tr: 1}, $transparent: {a: 1, audio: 1, canvas: 1, del: 1, ins: 1, map: 1, noscript: 1, object: 1, video: 1}, $intermediate: {caption: 1, colgroup: 1, dd: 1, dt: 1, figcaption: 1, legend: 1, li: 1, optgroup: 1, option: 1, rp: 1, rt: 1, summary: 1, tbody: 1, td: 1, tfoot: 1, th: 1, thead: 1, tr: 1}});
        return c
    }();
    CKEDITOR.dom.event = function (a) {
        this.$ = a
    };
    CKEDITOR.dom.event.prototype = {getKey: function () {
        return this.$.keyCode || this.$.which
    }, getKeystroke: function () {
        var a = this.getKey();
        if (this.$.ctrlKey || this.$.metaKey)a = a + CKEDITOR.CTRL;
        this.$.shiftKey && (a = a + CKEDITOR.SHIFT);
        this.$.altKey && (a = a + CKEDITOR.ALT);
        return a
    }, preventDefault: function (a) {
        var c = this.$;
        c.preventDefault ? c.preventDefault() : c.returnValue = false;
        a && this.stopPropagation()
    }, stopPropagation: function () {
        var a = this.$;
        a.stopPropagation ? a.stopPropagation() : a.cancelBubble = true
    }, getTarget: function () {
        var a =
            this.$.target || this.$.srcElement;
        return a ? new CKEDITOR.dom.node(a) : null
    }, getPhase: function () {
        return this.$.eventPhase || 2
    }, getPageOffset: function () {
        var a = this.getTarget().getDocument().$;
        return{x: this.$.pageX || this.$.clientX + (a.documentElement.scrollLeft || a.body.scrollLeft), y: this.$.pageY || this.$.clientY + (a.documentElement.scrollTop || a.body.scrollTop)}
    }};
    CKEDITOR.CTRL = 1114112;
    CKEDITOR.SHIFT = 2228224;
    CKEDITOR.ALT = 4456448;
    CKEDITOR.EVENT_PHASE_CAPTURING = 1;
    CKEDITOR.EVENT_PHASE_AT_TARGET = 2;
    CKEDITOR.EVENT_PHASE_BUBBLING = 3;
    CKEDITOR.dom.domObject = function (a) {
        if (a)this.$ = a
    };
    CKEDITOR.dom.domObject.prototype = function () {
        var a = function (a, b) {
            return function (f) {
                typeof CKEDITOR != "undefined" && a.fire(b, new CKEDITOR.dom.event(f))
            }
        };
        return{getPrivate: function () {
            var a;
            if (!(a = this.getCustomData("_")))this.setCustomData("_", a = {});
            return a
        }, on: function (c) {
            var b = this.getCustomData("_cke_nativeListeners");
            if (!b) {
                b = {};
                this.setCustomData("_cke_nativeListeners", b)
            }
            if (!b[c]) {
                b = b[c] = a(this, c);
                this.$.addEventListener ? this.$.addEventListener(c, b, !!CKEDITOR.event.useCapture) : this.$.attachEvent &&
                    this.$.attachEvent("on" + c, b)
            }
            return CKEDITOR.event.prototype.on.apply(this, arguments)
        }, removeListener: function (a) {
            CKEDITOR.event.prototype.removeListener.apply(this, arguments);
            if (!this.hasListeners(a)) {
                var b = this.getCustomData("_cke_nativeListeners"), f = b && b[a];
                if (f) {
                    this.$.removeEventListener ? this.$.removeEventListener(a, f, false) : this.$.detachEvent && this.$.detachEvent("on" + a, f);
                    delete b[a]
                }
            }
        }, removeAllListeners: function () {
            var a = this.getCustomData("_cke_nativeListeners"), b;
            for (b in a) {
                var f = a[b];
                this.$.detachEvent ?
                    this.$.detachEvent("on" + b, f) : this.$.removeEventListener && this.$.removeEventListener(b, f, false);
                delete a[b]
            }
        }}
    }();
    (function (a) {
        var c = {};
        CKEDITOR.on("reset", function () {
            c = {}
        });
        a.equals = function (b) {
            try {
                return b && b.$ === this.$
            } catch (a) {
                return false
            }
        };
        a.setCustomData = function (b, a) {
            var e = this.getUniqueId();
            (c[e] || (c[e] = {}))[b] = a;
            return this
        };
        a.getCustomData = function (b) {
            var a = this.$["data-cke-expando"];
            return(a = a && c[a]) && b in a ? a[b] : null
        };
        a.removeCustomData = function (b) {
            var a = this.$["data-cke-expando"], a = a && c[a], e, d;
            if (a) {
                e = a[b];
                d = b in a;
                delete a[b]
            }
            return d ? e : null
        };
        a.clearCustomData = function () {
            this.removeAllListeners();
            var b = this.$["data-cke-expando"];
            b && delete c[b]
        };
        a.getUniqueId = function () {
            return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber())
        };
        CKEDITOR.event.implementOn(a)
    })(CKEDITOR.dom.domObject.prototype);
    CKEDITOR.dom.node = function (a) {
        return a ? new CKEDITOR.dom[a.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : a.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : a.nodeType == CKEDITOR.NODE_TEXT ? "text" : a.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : a.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](a) : this
    };
    CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject;
    CKEDITOR.NODE_ELEMENT = 1;
    CKEDITOR.NODE_DOCUMENT = 9;
    CKEDITOR.NODE_TEXT = 3;
    CKEDITOR.NODE_COMMENT = 8;
    CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11;
    CKEDITOR.POSITION_IDENTICAL = 0;
    CKEDITOR.POSITION_DISCONNECTED = 1;
    CKEDITOR.POSITION_FOLLOWING = 2;
    CKEDITOR.POSITION_PRECEDING = 4;
    CKEDITOR.POSITION_IS_CONTAINED = 8;
    CKEDITOR.POSITION_CONTAINS = 16;
    CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {appendTo: function (a, c) {
        a.append(this, c);
        return a
    }, clone: function (a, c) {
        var b = this.$.cloneNode(a), f = function (b) {
            b["data-cke-expando"] && (b["data-cke-expando"] = false);
            if (b.nodeType == CKEDITOR.NODE_ELEMENT) {
                c || b.removeAttribute("id", false);
                if (a)for (var b = b.childNodes, d = 0; d < b.length; d++)f(b[d])
            }
        };
        f(b);
        return new CKEDITOR.dom.node(b)
    }, hasPrevious: function () {
        return!!this.$.previousSibling
    }, hasNext: function () {
        return!!this.$.nextSibling
    }, insertAfter: function (a) {
        a.$.parentNode.insertBefore(this.$,
            a.$.nextSibling);
        return a
    }, insertBefore: function (a) {
        a.$.parentNode.insertBefore(this.$, a.$);
        return a
    }, insertBeforeMe: function (a) {
        this.$.parentNode.insertBefore(a.$, this.$);
        return a
    }, getAddress: function (a) {
        for (var c = [], b = this.getDocument().$.documentElement, f = this.$; f && f != b;) {
            var e = f.parentNode;
            e && c.unshift(this.getIndex.call({$: f}, a));
            f = e
        }
        return c
    }, getDocument: function () {
        return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument)
    }, getIndex: function (a) {
        var c = this.$, b = -1,
            f;
        if (!this.$.parentNode)return b;
        do if (!a || !(c != this.$ && c.nodeType == CKEDITOR.NODE_TEXT && (f || !c.nodeValue))) {
            b++;
            f = c.nodeType == CKEDITOR.NODE_TEXT
        } while (c = c.previousSibling);
        return b
    }, getNextSourceNode: function (a, c, b) {
        if (b && !b.call)var f = b, b = function (b) {
            return!b.equals(f)
        };
        var a = !a && this.getFirst && this.getFirst(), e;
        if (!a) {
            if (this.type == CKEDITOR.NODE_ELEMENT && b && b(this, true) === false)return null;
            a = this.getNext()
        }
        for (; !a && (e = (e || this).getParent());) {
            if (b && b(e, true) === false)return null;
            a = e.getNext()
        }
        return!a ||
            b && b(a) === false ? null : c && c != a.type ? a.getNextSourceNode(false, c, b) : a
    }, getPreviousSourceNode: function (a, c, b) {
        if (b && !b.call)var f = b, b = function (b) {
            return!b.equals(f)
        };
        var a = !a && this.getLast && this.getLast(), e;
        if (!a) {
            if (this.type == CKEDITOR.NODE_ELEMENT && b && b(this, true) === false)return null;
            a = this.getPrevious()
        }
        for (; !a && (e = (e || this).getParent());) {
            if (b && b(e, true) === false)return null;
            a = e.getPrevious()
        }
        return!a || b && b(a) === false ? null : c && a.type != c ? a.getPreviousSourceNode(false, c, b) : a
    }, getPrevious: function (a) {
        var c =
            this.$, b;
        do b = (c = c.previousSibling) && c.nodeType != 10 && new CKEDITOR.dom.node(c); while (b && a && !a(b));
        return b
    }, getNext: function (a) {
        var c = this.$, b;
        do b = (c = c.nextSibling) && new CKEDITOR.dom.node(c); while (b && a && !a(b));
        return b
    }, getParent: function (a) {
        var c = this.$.parentNode;
        return c && (c.nodeType == CKEDITOR.NODE_ELEMENT || a && c.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ? new CKEDITOR.dom.node(c) : null
    }, getParents: function (a) {
        var c = this, b = [];
        do b[a ? "push" : "unshift"](c); while (c = c.getParent());
        return b
    }, getCommonAncestor: function (a) {
        if (a.equals(this))return this;
        if (a.contains && a.contains(this))return a;
        var c = this.contains ? this : this.getParent();
        do if (c.contains(a))return c; while (c = c.getParent());
        return null
    }, getPosition: function (a) {
        var c = this.$, b = a.$;
        if (c.compareDocumentPosition)return c.compareDocumentPosition(b);
        if (c == b)return CKEDITOR.POSITION_IDENTICAL;
        if (this.type == CKEDITOR.NODE_ELEMENT && a.type == CKEDITOR.NODE_ELEMENT) {
            if (c.contains) {
                if (c.contains(b))return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
                if (b.contains(c))return CKEDITOR.POSITION_IS_CONTAINED +
                    CKEDITOR.POSITION_FOLLOWING
            }
            if ("sourceIndex"in c)return c.sourceIndex < 0 || b.sourceIndex < 0 ? CKEDITOR.POSITION_DISCONNECTED : c.sourceIndex < b.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING
        }
        for (var c = this.getAddress(), a = a.getAddress(), b = Math.min(c.length, a.length), f = 0; f <= b - 1; f++)if (c[f] != a[f]) {
            if (f < b)return c[f] < a[f] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
            break
        }
        return c.length < a.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED +
            CKEDITOR.POSITION_FOLLOWING
    }, getAscendant: function (a, c) {
        var b = this.$, f;
        if (!c)b = b.parentNode;
        for (; b;) {
            if (b.nodeName && (f = b.nodeName.toLowerCase(), typeof a == "string" ? f == a : f in a))return new CKEDITOR.dom.node(b);
            try {
                b = b.parentNode
            } catch (e) {
                b = null
            }
        }
        return null
    }, hasAscendant: function (a, c) {
        var b = this.$;
        if (!c)b = b.parentNode;
        for (; b;) {
            if (b.nodeName && b.nodeName.toLowerCase() == a)return true;
            b = b.parentNode
        }
        return false
    }, move: function (a, c) {
        a.append(this.remove(), c)
    }, remove: function (a) {
        var c = this.$, b = c.parentNode;
        if (b) {
            if (a)for (; a = c.firstChild;)b.insertBefore(c.removeChild(a), c);
            b.removeChild(c)
        }
        return this
    }, replace: function (a) {
        this.insertBefore(a);
        a.remove()
    }, trim: function () {
        this.ltrim();
        this.rtrim()
    }, ltrim: function () {
        for (var a; this.getFirst && (a = this.getFirst());) {
            if (a.type == CKEDITOR.NODE_TEXT) {
                var c = CKEDITOR.tools.ltrim(a.getText()), b = a.getLength();
                if (c) {
                    if (c.length < b) {
                        a.split(b - c.length);
                        this.$.removeChild(this.$.firstChild)
                    }
                } else {
                    a.remove();
                    continue
                }
            }
            break
        }
    }, rtrim: function () {
        for (var a; this.getLast && (a =
            this.getLast());) {
            if (a.type == CKEDITOR.NODE_TEXT) {
                var c = CKEDITOR.tools.rtrim(a.getText()), b = a.getLength();
                if (c) {
                    if (c.length < b) {
                        a.split(c.length);
                        this.$.lastChild.parentNode.removeChild(this.$.lastChild)
                    }
                } else {
                    a.remove();
                    continue
                }
            }
            break
        }
        if (!CKEDITOR.env.ie && !CKEDITOR.env.opera)(a = this.$.lastChild) && (a.type == 1 && a.nodeName.toLowerCase() == "br") && a.parentNode.removeChild(a)
    }, isReadOnly: function () {
        var a = this;
        this.type != CKEDITOR.NODE_ELEMENT && (a = this.getParent());
        if (a && typeof a.$.isContentEditable != "undefined")return!(a.$.isContentEditable ||
            a.data("cke-editable"));
        for (; a;) {
            if (a.data("cke-editable"))break;
            if (a.getAttribute("contentEditable") == "false")return true;
            if (a.getAttribute("contentEditable") == "true")break;
            a = a.getParent()
        }
        return!a
    }});
    CKEDITOR.dom.window = function (a) {
        CKEDITOR.dom.domObject.call(this, a)
    };
    CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject;
    CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {focus: function () {
        this.$.focus()
    }, getViewPaneSize: function () {
        var a = this.$.document, c = a.compatMode == "CSS1Compat";
        return{width: (c ? a.documentElement.clientWidth : a.body.clientWidth) || 0, height: (c ? a.documentElement.clientHeight : a.body.clientHeight) || 0}
    }, getScrollPosition: function () {
        var a = this.$;
        if ("pageXOffset"in a)return{x: a.pageXOffset || 0, y: a.pageYOffset || 0};
        a = a.document;
        return{x: a.documentElement.scrollLeft || a.body.scrollLeft || 0, y: a.documentElement.scrollTop ||
            a.body.scrollTop || 0}
    }, getFrame: function () {
        var a = this.$.frameElement;
        return a ? new CKEDITOR.dom.element.get(a) : null
    }});
    CKEDITOR.dom.document = function (a) {
        CKEDITOR.dom.domObject.call(this, a)
    };
    CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject;
    CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {type: CKEDITOR.NODE_DOCUMENT, appendStyleSheet: function (a) {
        if (this.$.createStyleSheet)this.$.createStyleSheet(a); else {
            var c = new CKEDITOR.dom.element("link");
            c.setAttributes({rel: "stylesheet", type: "text/css", href: a});
            this.getHead().append(c)
        }
    }, appendStyleText: function (a) {
        if (this.$.createStyleSheet) {
            var c = this.$.createStyleSheet("");
            c.cssText = a
        } else {
            var b = new CKEDITOR.dom.element("style", this);
            b.append(new CKEDITOR.dom.text(a, this));
            this.getHead().append(b)
        }
        return c ||
            b.$.sheet
    }, createElement: function (a, c) {
        var b = new CKEDITOR.dom.element(a, this);
        if (c) {
            c.attributes && b.setAttributes(c.attributes);
            c.styles && b.setStyles(c.styles)
        }
        return b
    }, createText: function (a) {
        return new CKEDITOR.dom.text(a, this)
    }, focus: function () {
        this.getWindow().focus()
    }, getActive: function () {
        return new CKEDITOR.dom.element(this.$.activeElement)
    }, getById: function (a) {
        return(a = this.$.getElementById(a)) ? new CKEDITOR.dom.element(a) : null
    }, getByAddress: function (a, c) {
        for (var b = this.$.documentElement, f =
            0; b && f < a.length; f++) {
            var e = a[f];
            if (c)for (var d = -1, j = 0; j < b.childNodes.length; j++) {
                var l = b.childNodes[j];
                if (!(c === true && l.nodeType == 3 && l.previousSibling && l.previousSibling.nodeType == 3)) {
                    d++;
                    if (d == e) {
                        b = l;
                        break
                    }
                }
            } else b = b.childNodes[e]
        }
        return b ? new CKEDITOR.dom.node(b) : null
    }, getElementsByTag: function (a, c) {
        if ((!CKEDITOR.env.ie || document.documentMode > 8) && c)a = c + ":" + a;
        return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(a))
    }, getHead: function () {
        var a = this.$.getElementsByTagName("head")[0];
        return a =
            a ? new CKEDITOR.dom.element(a) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), true)
    }, getBody: function () {
        return new CKEDITOR.dom.element(this.$.body)
    }, getDocumentElement: function () {
        return new CKEDITOR.dom.element(this.$.documentElement)
    }, getWindow: function () {
        var a = new CKEDITOR.dom.window(this.$.parentWindow || this.$.defaultView);
        return(this.getWindow = function () {
            return a
        })()
    }, write: function (a) {
        this.$.open("text/html", "replace");
        CKEDITOR.env.isCustomDomain() && (this.$.domain = document.domain);
        this.$.write(a);
        this.$.close()
    }});
    CKEDITOR.dom.nodeList = function (a) {
        this.$ = a
    };
    CKEDITOR.dom.nodeList.prototype = {count: function () {
        return this.$.length
    }, getItem: function (a) {
        if (a < 0 || a >= this.$.length)return null;
        return(a = this.$[a]) ? new CKEDITOR.dom.node(a) : null
    }};
    CKEDITOR.dom.element = function (a, c) {
        typeof a == "string" && (a = (c ? c.$ : document).createElement(a));
        CKEDITOR.dom.domObject.call(this, a)
    };
    CKEDITOR.dom.element.get = function (a) {
        return(a = typeof a == "string" ? document.getElementById(a) || document.getElementsByName(a)[0] : a) && (a.$ ? a : new CKEDITOR.dom.element(a))
    };
    CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node;
    CKEDITOR.dom.element.createFromHtml = function (a, c) {
        var b = new CKEDITOR.dom.element("div", c);
        b.setHtml(a);
        return b.getFirst().remove()
    };
    CKEDITOR.dom.element.setMarker = function (a, c, b, f) {
        var e = c.getCustomData("list_marker_id") || c.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id"), d = c.getCustomData("list_marker_names") || c.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
        a[e] = c;
        d[b] = 1;
        return c.setCustomData(b, f)
    };
    CKEDITOR.dom.element.clearAllMarkers = function (a) {
        for (var c in a)CKEDITOR.dom.element.clearMarkers(a, a[c], 1)
    };
    CKEDITOR.dom.element.clearMarkers = function (a, c, b) {
        var f = c.getCustomData("list_marker_names"), e = c.getCustomData("list_marker_id"), d;
        for (d in f)c.removeCustomData(d);
        c.removeCustomData("list_marker_names");
        if (b) {
            c.removeCustomData("list_marker_id");
            delete a[e]
        }
    };
    (function () {
        function a(b) {
            for (var a = 0, e = 0, d = c[b].length; e < d; e++)a = a + (parseInt(this.getComputedStyle(c[b][e]) || 0, 10) || 0);
            return a
        }

        CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {type: CKEDITOR.NODE_ELEMENT, addClass: function (b) {
            var a = this.$.className;
            a && (RegExp("(?:^|\\s)" + b + "(?:\\s|$)", "").test(a) || (a = a + (" " + b)));
            this.$.className = a || b
        }, removeClass: function (b) {
            var a = this.getAttribute("class");
            if (a) {
                b = RegExp("(?:^|\\s+)" + b + "(?=\\s|$)", "i");
                if (b.test(a))(a = a.replace(b, "").replace(/^\s+/, "")) ? this.setAttribute("class",
                    a) : this.removeAttribute("class")
            }
            return this
        }, hasClass: function (b) {
            return RegExp("(?:^|\\s+)" + b + "(?=\\s|$)", "").test(this.getAttribute("class"))
        }, append: function (b, a) {
            typeof b == "string" && (b = this.getDocument().createElement(b));
            a ? this.$.insertBefore(b.$, this.$.firstChild) : this.$.appendChild(b.$);
            return b
        }, appendHtml: function (b) {
            if (this.$.childNodes.length) {
                var a = new CKEDITOR.dom.element("div", this.getDocument());
                a.setHtml(b);
                a.moveChildren(this)
            } else this.setHtml(b)
        }, appendText: function (b) {
            this.$.text != void 0 ? this.$.text = this.$.text + b : this.append(new CKEDITOR.dom.text(b))
        }, appendBogus: function () {
            for (var b = this.getLast(); b && b.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(b.getText());)b = b.getPrevious();
            if (!b || !b.is || !b.is("br")) {
                b = CKEDITOR.env.opera ? this.getDocument().createText("") : this.getDocument().createElement("br");
                CKEDITOR.env.gecko && b.setAttribute("type", "_moz");
                this.append(b)
            }
        }, breakParent: function (b) {
            var a = new CKEDITOR.dom.range(this.getDocument());
            a.setStartAfter(this);
            a.setEndAfter(b);
            b = a.extractContents();
            a.insertNode(this.remove());
            b.insertAfterNode(this)
        }, contains: CKEDITOR.env.ie || CKEDITOR.env.webkit ? function (b) {
            var a = this.$;
            return b.type != CKEDITOR.NODE_ELEMENT ? a.contains(b.getParent().$) : a != b.$ && a.contains(b.$)
        } : function (b) {
            return!!(this.$.compareDocumentPosition(b.$) & 16)
        }, focus: function () {
            function b() {
                try {
                    this.$.focus()
                } catch (b) {
                }
            }

            return function (a) {
                a ? CKEDITOR.tools.setTimeout(b, 100, this) : b.call(this)
            }
        }(), getHtml: function () {
            var b = this.$.innerHTML;
            return CKEDITOR.env.ie ? b.replace(/<\?[^>]*>/g,
                "") : b
        }, getOuterHtml: function () {
            if (this.$.outerHTML)return this.$.outerHTML.replace(/<\?[^>]*>/, "");
            var b = this.$.ownerDocument.createElement("div");
            b.appendChild(this.$.cloneNode(true));
            return b.innerHTML
        }, getClientRect: function () {
            var b = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
            !b.width && (b.width = b.right - b.left);
            !b.height && (b.height = b.bottom - b.top);
            return b
        }, setHtml: function () {
            var b = function (b) {
                return this.$.innerHTML = b
            };
            return CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? function (b) {
                try {
                    return this.$.innerHTML =
                        b
                } catch (a) {
                    this.$.innerHTML = "";
                    var c = new CKEDITOR.dom.element("body", this.getDocument());
                    c.$.innerHTML = b;
                    for (c = c.getChildren(); c.count();)this.append(c.getItem(0));
                    return b
                }
            } : b
        }(), setText: function (b) {
            CKEDITOR.dom.element.prototype.setText = this.$.innerText != void 0 ? function (b) {
                return this.$.innerText = b
            } : function (b) {
                return this.$.textContent = b
            };
            return this.setText(b)
        }, getAttribute: function () {
            var b = function (b) {
                return this.$.getAttribute(b, 2)
            };
            return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ?
                function (b) {
                    switch (b) {
                        case "class":
                            b = "className";
                            break;
                        case "http-equiv":
                            b = "httpEquiv";
                            break;
                        case "name":
                            return this.$.name;
                        case "tabindex":
                            b = this.$.getAttribute(b, 2);
                            b !== 0 && this.$.tabIndex === 0 && (b = null);
                            return b;
                        case "checked":
                            b = this.$.attributes.getNamedItem(b);
                            return(b.specified ? b.nodeValue : this.$.checked) ? "checked" : null;
                        case "hspace":
                        case "value":
                            return this.$[b];
                        case "style":
                            return this.$.style.cssText;
                        case "contenteditable":
                        case "contentEditable":
                            return this.$.attributes.getNamedItem("contentEditable").specified ?
                                this.$.getAttribute("contentEditable") : null
                    }
                    return this.$.getAttribute(b, 2)
                } : b
        }(), getChildren: function () {
            return new CKEDITOR.dom.nodeList(this.$.childNodes)
        }, getComputedStyle: CKEDITOR.env.ie ? function (b) {
            return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(b)]
        } : function (b) {
            var a = this.getWindow().$.getComputedStyle(this.$, null);
            return a ? a.getPropertyValue(b) : ""
        }, getDtd: function () {
            var b = CKEDITOR.dtd[this.getName()];
            this.getDtd = function () {
                return b
            };
            return b
        }, getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag,
            getTabIndex: CKEDITOR.env.ie ? function () {
                var b = this.$.tabIndex;
                b === 0 && (!CKEDITOR.dtd.$tabIndex[this.getName()] && parseInt(this.getAttribute("tabindex"), 10) !== 0) && (b = -1);
                return b
            } : CKEDITOR.env.webkit ? function () {
                var b = this.$.tabIndex;
                if (b == void 0) {
                    b = parseInt(this.getAttribute("tabindex"), 10);
                    isNaN(b) && (b = -1)
                }
                return b
            } : function () {
                return this.$.tabIndex
            }, getText: function () {
                return this.$.textContent || this.$.innerText || ""
            }, getWindow: function () {
                return this.getDocument().getWindow()
            }, getId: function () {
                return this.$.id ||
                    null
            }, getNameAtt: function () {
                return this.$.name || null
            }, getName: function () {
                var b = this.$.nodeName.toLowerCase();
                if (CKEDITOR.env.ie && !(document.documentMode > 8)) {
                    var a = this.$.scopeName;
                    a != "HTML" && (b = a.toLowerCase() + ":" + b)
                }
                return(this.getName = function () {
                    return b
                })()
            }, getValue: function () {
                return this.$.value
            }, getFirst: function (b) {
                var a = this.$.firstChild;
                (a = a && new CKEDITOR.dom.node(a)) && (b && !b(a)) && (a = a.getNext(b));
                return a
            }, getLast: function (b) {
                var a = this.$.lastChild;
                (a = a && new CKEDITOR.dom.node(a)) && (b && !b(a)) &&
                (a = a.getPrevious(b));
                return a
            }, getStyle: function (b) {
                return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(b)]
            }, is: function () {
                var b = this.getName();
                if (typeof arguments[0] == "object")return!!arguments[0][b];
                for (var a = 0; a < arguments.length; a++)if (arguments[a] == b)return true;
                return false
            }, isEditable: function (b) {
                var a = this.getName();
                if (this.isReadOnly() || this.getComputedStyle("display") == "none" || this.getComputedStyle("visibility") == "hidden" || CKEDITOR.dtd.$nonEditable[a] || CKEDITOR.dtd.$empty[a] || this.is("a") &&
                    (this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount())return false;
                if (b !== false) {
                    b = CKEDITOR.dtd[a] || CKEDITOR.dtd.span;
                    return!(!b || !b["#"])
                }
                return true
            }, isIdentical: function (b) {
                var a = this.clone(0, 1), b = b.clone(0, 1);
                a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
                b.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
                if (a.$.isEqualNode) {
                    a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText);
                    b.$.style.cssText = CKEDITOR.tools.normalizeCssText(b.$.style.cssText);
                    return a.$.isEqualNode(b.$)
                }
                a = a.getOuterHtml();
                b = b.getOuterHtml();
                if (CKEDITOR.env.ie && CKEDITOR.env.version < 9 && this.is("a")) {
                    var c = this.getParent();
                    if (c.type == CKEDITOR.NODE_ELEMENT) {
                        c = c.clone();
                        c.setHtml(a);
                        a = c.getHtml();
                        c.setHtml(b);
                        b = c.getHtml()
                    }
                }
                return a == b
            }, isVisible: function () {
                var b = (this.$.offsetHeight || this.$.offsetWidth) && this.getComputedStyle("visibility") != "hidden", a, c;
                if (b && (CKEDITOR.env.webkit || CKEDITOR.env.opera)) {
                    a =
                        this.getWindow();
                    if (!a.equals(CKEDITOR.document.getWindow()) && (c = a.$.frameElement))b = (new CKEDITOR.dom.element(c)).isVisible()
                }
                return!!b
            }, isEmptyInlineRemoveable: function () {
                if (!CKEDITOR.dtd.$removeEmpty[this.getName()])return false;
                for (var b = this.getChildren(), a = 0, c = b.count(); a < c; a++) {
                    var d = b.getItem(a);
                    if (!(d.type == CKEDITOR.NODE_ELEMENT && d.data("cke-bookmark")) && (d.type == CKEDITOR.NODE_ELEMENT && !d.isEmptyInlineRemoveable() || d.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(d.getText())))return false
                }
                return true
            },
            hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function () {
                for (var b = this.$.attributes, a = 0; a < b.length; a++) {
                    var c = b[a];
                    switch (c.nodeName) {
                        case "class":
                            if (this.getAttribute("class"))return true;
                        case "data-cke-expando":
                            continue;
                        default:
                            if (c.specified)return true
                    }
                }
                return false
            } : function () {
                var b = this.$.attributes, a = b.length, c = {"data-cke-expando": 1, _moz_dirty: 1};
                return a > 0 && (a > 2 || !c[b[0].nodeName] || a == 2 && !c[b[1].nodeName])
            }, hasAttribute: function () {
                function b(b) {
                    b = this.$.attributes.getNamedItem(b);
                    return!(!b || !b.specified)
                }

                return CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? function (a) {
                    return a == "name" ? !!this.$.name : b.call(this, a)
                } : b
            }(), hide: function () {
                this.setStyle("display", "none")
            }, moveChildren: function (b, a) {
                var c = this.$, b = b.$;
                if (c != b) {
                    var d;
                    if (a)for (; d = c.lastChild;)b.insertBefore(c.removeChild(d), b.firstChild); else for (; d = c.firstChild;)b.appendChild(c.removeChild(d))
                }
            }, mergeSiblings: function () {
                function b(b, a, c) {
                    if (a && a.type == CKEDITOR.NODE_ELEMENT) {
                        for (var j = []; a.data("cke-bookmark") || a.isEmptyInlineRemoveable();) {
                            j.push(a);
                            a = c ? a.getNext() : a.getPrevious();
                            if (!a || a.type != CKEDITOR.NODE_ELEMENT)return
                        }
                        if (b.isIdentical(a)) {
                            for (var l = c ? b.getLast() : b.getFirst(); j.length;)j.shift().move(b, !c);
                            a.moveChildren(b, !c);
                            a.remove();
                            l && l.type == CKEDITOR.NODE_ELEMENT && l.mergeSiblings()
                        }
                    }
                }

                return function (a) {
                    if (a === false || CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a")) {
                        b(this, this.getNext(), true);
                        b(this, this.getPrevious())
                    }
                }
            }(), show: function () {
                this.setStyles({display: "", visibility: ""})
            }, setAttribute: function () {
                var b = function (b, a) {
                    this.$.setAttribute(b, a);
                    return this
                };
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function (a, c) {
                    a == "class" ? this.$.className = c : a == "style" ? this.$.style.cssText = c : a == "tabindex" ? this.$.tabIndex = c : a == "checked" ? this.$.checked = c : a == "contenteditable" ? b.call(this, "contentEditable", c) : b.apply(this, arguments);
                    return this
                } : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function (a, c) {
                    if (a == "src" && c.match(/^http:\/\//))try {
                        b.apply(this, arguments)
                    } catch (d) {
                    } else b.apply(this, arguments);
                    return this
                } : b
            }(), setAttributes: function (b) {
                for (var a in b)this.setAttribute(a, b[a]);
                return this
            }, setValue: function (b) {
                this.$.value = b;
                return this
            }, removeAttribute: function () {
                var b = function (b) {
                    this.$.removeAttribute(b)
                };
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function (b) {
                    b == "class" ? b = "className" : b == "tabindex" ? b = "tabIndex" : b == "contenteditable" && (b = "contentEditable");
                    this.$.removeAttribute(b)
                } : b
            }(), removeAttributes: function (b) {
                if (CKEDITOR.tools.isArray(b))for (var a = 0; a <
                    b.length; a++)this.removeAttribute(b[a]); else for (a in b)b.hasOwnProperty(a) && this.removeAttribute(a)
            }, removeStyle: function (b) {
                var a = this.$.style;
                if (!a.removeProperty && (b == "border" || b == "margin" || b == "padding")) {
                    var c = ["top", "left", "right", "bottom"], d;
                    b == "border" && (d = ["color", "style", "width"]);
                    for (var a = [], j = 0; j < c.length; j++)if (d)for (var l = 0; l < d.length; l++)a.push([b, c[j], d[l]].join("-")); else a.push([b, c[j]].join("-"));
                    for (b = 0; b < a.length; b++)this.removeStyle(a[b])
                } else {
                    a.removeProperty ? a.removeProperty(b) :
                        a.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(b));
                    this.$.style.cssText || this.removeAttribute("style")
                }
            }, setStyle: function (b, a) {
                this.$.style[CKEDITOR.tools.cssStyleToDomStyle(b)] = a;
                return this
            }, setStyles: function (b) {
                for (var a in b)this.setStyle(a, b[a]);
                return this
            }, setOpacity: function (b) {
                if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
                    b = Math.round(b * 100);
                    this.setStyle("filter", b >= 100 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + b + ")")
                } else this.setStyle("opacity", b)
            }, unselectable: function () {
                this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select",
                    "none"));
                if (CKEDITOR.env.ie || CKEDITOR.env.opera) {
                    this.setAttribute("unselectable", "on");
                    for (var b, a = this.getElementsByTag("*"), c = 0, d = a.count(); c < d; c++) {
                        b = a.getItem(c);
                        b.setAttribute("unselectable", "on")
                    }
                }
            }, getPositionedAncestor: function () {
                for (var b = this; b.getName() != "html";) {
                    if (b.getComputedStyle("position") != "static")return b;
                    b = b.getParent()
                }
                return null
            }, getDocumentPosition: function (b) {
                var a = 0, c = 0, d = this.getDocument(), j = d.getBody(), l = d.$.compatMode == "BackCompat";
                if (document.documentElement.getBoundingClientRect) {
                    var i =
                        this.$.getBoundingClientRect(), m = d.$.documentElement, n = m.clientTop || j.$.clientTop || 0, r = m.clientLeft || j.$.clientLeft || 0, p = true;
                    if (CKEDITOR.env.ie) {
                        p = d.getDocumentElement().contains(this);
                        d = d.getBody().contains(this);
                        p = l && d || !l && p
                    }
                    if (p) {
                        a = i.left + (!l && m.scrollLeft || j.$.scrollLeft);
                        a = a - r;
                        c = i.top + (!l && m.scrollTop || j.$.scrollTop);
                        c = c - n
                    }
                } else {
                    j = this;
                    for (d = null; j && !(j.getName() == "body" || j.getName() == "html");) {
                        a = a + (j.$.offsetLeft - j.$.scrollLeft);
                        c = c + (j.$.offsetTop - j.$.scrollTop);
                        if (!j.equals(this)) {
                            a = a + (j.$.clientLeft ||
                                0);
                            c = c + (j.$.clientTop || 0)
                        }
                        for (; d && !d.equals(j);) {
                            a = a - d.$.scrollLeft;
                            c = c - d.$.scrollTop;
                            d = d.getParent()
                        }
                        d = j;
                        j = (i = j.$.offsetParent) ? new CKEDITOR.dom.element(i) : null
                    }
                }
                if (b) {
                    j = this.getWindow();
                    d = b.getWindow();
                    if (!j.equals(d) && j.$.frameElement) {
                        b = (new CKEDITOR.dom.element(j.$.frameElement)).getDocumentPosition(b);
                        a = a + b.x;
                        c = c + b.y
                    }
                }
                if (!document.documentElement.getBoundingClientRect && CKEDITOR.env.gecko && !l) {
                    a = a + (this.$.clientLeft ? 1 : 0);
                    c = c + (this.$.clientTop ? 1 : 0)
                }
                return{x: a, y: c}
            }, scrollIntoView: function (b) {
                var a =
                    this.getParent();
                if (a) {
                    do {
                        (a.$.clientWidth && a.$.clientWidth < a.$.scrollWidth || a.$.clientHeight && a.$.clientHeight < a.$.scrollHeight) && !a.is("body") && this.scrollIntoParent(a, b, 1);
                        if (a.is("html")) {
                            var c = a.getWindow();
                            try {
                                var d = c.$.frameElement;
                                d && (a = new CKEDITOR.dom.element(d))
                            } catch (j) {
                            }
                        }
                    } while (a = a.getParent())
                }
            }, scrollIntoParent: function (b, a, c) {
                var d, j, l, i;

                function m(a, c) {
                    if (/body|html/.test(b.getName()))b.getWindow().$.scrollBy(a, c); else {
                        b.$.scrollLeft = b.$.scrollLeft + a;
                        b.$.scrollTop = b.$.scrollTop + c
                    }
                }

                function n(b, a) {
                    var c = {x: 0, y: 0};
                    if (!b.is(p ? "body" : "html")) {
                        var g = b.$.getBoundingClientRect();
                        c.x = g.left;
                        c.y = g.top
                    }
                    g = b.getWindow();
                    if (!g.equals(a)) {
                        g = n(CKEDITOR.dom.element.get(g.$.frameElement), a);
                        c.x = c.x + g.x;
                        c.y = c.y + g.y
                    }
                    return c
                }

                function r(b, a) {
                    return parseInt(b.getComputedStyle("margin-" + a) || 0, 10) || 0
                }

                !b && (b = this.getWindow());
                l = b.getDocument();
                var p = l.$.compatMode == "BackCompat";
                b instanceof CKEDITOR.dom.window && (b = p ? l.getBody() : l.getDocumentElement());
                l = b.getWindow();
                j = n(this, l);
                var g = n(b, l), h = this.$.offsetHeight;
                d = this.$.offsetWidth;
                var u = b.$.clientHeight, w = b.$.clientWidth;
                l = j.x - r(this, "left") - g.x || 0;
                i = j.y - r(this, "top") - g.y || 0;
                d = j.x + d + r(this, "right") - (g.x + w) || 0;
                j = j.y + h + r(this, "bottom") - (g.y + u) || 0;
                if (i < 0 || j > 0)m(0, a === true ? i : a === false ? j : i < 0 ? i : j);
                if (c && (l < 0 || d > 0))m(l < 0 ? l : d, 0)
            }, setState: function (b, a, c) {
                a = a || "cke";
                switch (b) {
                    case CKEDITOR.TRISTATE_ON:
                        this.addClass(a + "_on");
                        this.removeClass(a + "_off");
                        this.removeClass(a + "_disabled");
                        c && this.setAttribute("aria-pressed", true);
                        c && this.removeAttribute("aria-disabled");
                        break;
                    case CKEDITOR.TRISTATE_DISABLED:
                        this.addClass(a + "_disabled");
                        this.removeClass(a + "_off");
                        this.removeClass(a + "_on");
                        c && this.setAttribute("aria-disabled", true);
                        c && this.removeAttribute("aria-pressed");
                        break;
                    default:
                        this.addClass(a + "_off");
                        this.removeClass(a + "_on");
                        this.removeClass(a + "_disabled");
                        c && this.removeAttribute("aria-pressed");
                        c && this.removeAttribute("aria-disabled")
                }
            }, getFrameDocument: function () {
                var b = this.$;
                try {
                    b.contentWindow.document
                } catch (a) {
                    b.src = b.src
                }
                return b && new CKEDITOR.dom.document(b.contentWindow.document)
            },
            copyAttributes: function (b, a) {
                for (var c = this.$.attributes, a = a || {}, d = 0; d < c.length; d++) {
                    var j = c[d], l = j.nodeName.toLowerCase(), i;
                    if (!(l in a))if (l == "checked" && (i = this.getAttribute(l)))b.setAttribute(l, i); else if (j.specified || CKEDITOR.env.ie && j.nodeValue && l == "value") {
                        i = this.getAttribute(l);
                        if (i === null)i = j.nodeValue;
                        b.setAttribute(l, i)
                    }
                }
                if (this.$.style.cssText !== "")b.$.style.cssText = this.$.style.cssText
            }, renameNode: function (b) {
                if (this.getName() != b) {
                    var a = this.getDocument(), b = new CKEDITOR.dom.element(b,
                        a);
                    this.copyAttributes(b);
                    this.moveChildren(b);
                    this.getParent() && this.$.parentNode.replaceChild(b.$, this.$);
                    b.$["data-cke-expando"] = this.$["data-cke-expando"];
                    this.$ = b.$
                }
            }, getChild: function () {
                function b(b, a) {
                    var c = b.childNodes;
                    if (a >= 0 && a < c.length)return c[a]
                }

                return function (a) {
                    var c = this.$;
                    if (a.slice)for (; a.length > 0 && c;)c = b(c, a.shift()); else c = b(c, a);
                    return c ? new CKEDITOR.dom.node(c) : null
                }
            }(), getChildCount: function () {
                return this.$.childNodes.length
            }, disableContextMenu: function () {
                this.on("contextmenu",
                    function (b) {
                        b.data.getTarget().hasClass("cke_enable_context_menu") || b.data.preventDefault()
                    })
            }, getDirection: function (b) {
                return b ? this.getComputedStyle("direction") || this.getDirection() || this.getParent() && this.getParent().getDirection(1) || this.getDocument().$.dir || "ltr" : this.getStyle("direction") || this.getAttribute("dir")
            }, data: function (b, a) {
                b = "data-" + b;
                if (a === void 0)return this.getAttribute(b);
                a === false ? this.removeAttribute(b) : this.setAttribute(b, a);
                return null
            }, getEditor: function () {
                var b = CKEDITOR.instances,
                    a, c;
                for (a in b) {
                    c = b[a];
                    if (c.element.equals(this) && c.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO)return c
                }
                return null
            }});
        var c = {width: ["border-left-width", "border-right-width", "padding-left", "padding-right"], height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]};
        CKEDITOR.dom.element.prototype.setSize = function (b, c, e) {
            if (typeof c == "number") {
                if (e && (!CKEDITOR.env.ie || !CKEDITOR.env.quirks))c = c - a.call(this, b);
                this.setStyle(b, c + "px")
            }
        };
        CKEDITOR.dom.element.prototype.getSize = function (b, c) {
            var e = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(b)], this.$["client" + CKEDITOR.tools.capitalize(b)]) || 0;
            c && (e = e - a.call(this, b));
            return e
        }
    })();
    CKEDITOR.dom.documentFragment = function (a) {
        a = a || CKEDITOR.document;
        this.$ = a.type == CKEDITOR.NODE_DOCUMENT ? a.$.createDocumentFragment() : a
    };
    CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {type: CKEDITOR.NODE_DOCUMENT_FRAGMENT, insertAfterNode: function (a) {
        a = a.$;
        a.parentNode.insertBefore(this.$, a.nextSibling)
    }}, !0, {append: 1, appendBogus: 1, getFirst: 1, getLast: 1, getParent: 1, getNext: 1, getPrevious: 1, appendTo: 1, moveChildren: 1, insertBefore: 1, insertAfterNode: 1, replace: 1, trim: 1, type: 1, ltrim: 1, rtrim: 1, getDocument: 1, getChildCount: 1, getChild: 1, getChildren: 1});
    (function () {
        function a(a, b) {
            var c = this.range;
            if (this._.end)return null;
            if (!this._.start) {
                this._.start = 1;
                if (c.collapsed) {
                    this.end();
                    return null
                }
                c.optimize()
            }
            var d, n = c.startContainer;
            d = c.endContainer;
            var r = c.startOffset, p = c.endOffset, g, h = this.guard, u = this.type, f = a ? "getPreviousSourceNode" : "getNextSourceNode";
            if (!a && !this._.guardLTR) {
                var k = d.type == CKEDITOR.NODE_ELEMENT ? d : d.getParent(), e = d.type == CKEDITOR.NODE_ELEMENT ? d.getChild(p) : d.getNext();
                this._.guardLTR = function (a, b) {
                    return(!b || !k.equals(a)) && (!e || !a.equals(e)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(c.root))
                }
            }
            if (a && !this._.guardRTL) {
                var F = n.type == CKEDITOR.NODE_ELEMENT ? n : n.getParent(), D = n.type == CKEDITOR.NODE_ELEMENT ? r ? n.getChild(r - 1) : null : n.getPrevious();
                this._.guardRTL = function (a, b) {
                    return(!b || !F.equals(a)) && (!D || !a.equals(D)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(c.root))
                }
            }
            var B = a ? this._.guardRTL : this._.guardLTR;
            g = h ? function (a, b) {
                return B(a, b) === false ? false : h(a, b)
            } : B;
            if (this.current)d = this.current[f](false, u, g); else {
                if (a)d.type ==
                    CKEDITOR.NODE_ELEMENT && (d = p > 0 ? d.getChild(p - 1) : g(d, true) === false ? null : d.getPreviousSourceNode(true, u, g)); else {
                    d = n;
                    if (d.type == CKEDITOR.NODE_ELEMENT && !(d = d.getChild(r)))d = g(n, true) === false ? null : n.getNextSourceNode(true, u, g)
                }
                d && g(d) === false && (d = null)
            }
            for (; d && !this._.end;) {
                this.current = d;
                if (!this.evaluator || this.evaluator(d) !== false) {
                    if (!b)return d
                } else if (b && this.evaluator)return false;
                d = d[f](false, u, g)
            }
            this.end();
            return this.current = null
        }

        function c(b) {
            for (var c, d = null; c = a.call(this, b);)d = c;
            return d
        }

        CKEDITOR.dom.walker = CKEDITOR.tools.createClass({$: function (a) {
            this.range = a;
            this._ = {}
        }, proto: {end: function () {
            this._.end = 1
        }, next: function () {
            return a.call(this)
        }, previous: function () {
            return a.call(this, 1)
        }, checkForward: function () {
            return a.call(this, 0, 1) !== false
        }, checkBackward: function () {
            return a.call(this, 1, 1) !== false
        }, lastForward: function () {
            return c.call(this)
        }, lastBackward: function () {
            return c.call(this, 1)
        }, reset: function () {
            delete this.current;
            this._ = {}
        }}});
        var b = {block: 1, "list-item": 1, table: 1, "table-row-group": 1,
            "table-header-group": 1, "table-footer-group": 1, "table-row": 1, "table-column-group": 1, "table-column": 1, "table-cell": 1, "table-caption": 1};
        CKEDITOR.dom.element.prototype.isBlockBoundary = function (a) {
            a = a ? CKEDITOR.tools.extend({}, CKEDITOR.dtd.$block, a || {}) : CKEDITOR.dtd.$block;
            return this.getComputedStyle("float") == "none" && b[this.getComputedStyle("display")] || a[this.getName()]
        };
        CKEDITOR.dom.walker.blockBoundary = function (a) {
            return function (b) {
                return!(b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary(a))
            }
        };
        CKEDITOR.dom.walker.listItemBoundary =
            function () {
                return this.blockBoundary({br: 1})
            };
        CKEDITOR.dom.walker.bookmark = function (a, b) {
            function c(a) {
                return a && a.getName && a.getName() == "span" && a.data("cke-bookmark")
            }

            return function (d) {
                var n, r;
                n = d && d.type != CKEDITOR.NODE_ELEMENT && (r = d.getParent()) && c(r);
                n = a ? n : n || c(d);
                return!!(b ^ n)
            }
        };
        CKEDITOR.dom.walker.whitespaces = function (a) {
            return function (b) {
                var c;
                b && b.type == CKEDITOR.NODE_TEXT && (c = !CKEDITOR.tools.trim(b.getText()) || CKEDITOR.env.webkit && b.getText() == "​");
                return!!(a ^ c)
            }
        };
        CKEDITOR.dom.walker.invisible =
            function (a) {
                var b = CKEDITOR.dom.walker.whitespaces();
                return function (c) {
                    if (b(c))c = 1; else {
                        c.type == CKEDITOR.NODE_TEXT && (c = c.getParent());
                        c = !c.$.offsetHeight
                    }
                    return!!(a ^ c)
                }
            };
        CKEDITOR.dom.walker.nodeType = function (a, b) {
            return function (c) {
                return!!(b ^ c.type == a)
            }
        };
        CKEDITOR.dom.walker.bogus = function (a) {
            function b(a) {
                return!e(a) && !d(a)
            }

            return function (c) {
                var d = !CKEDITOR.env.ie ? c.is && c.is("br") : c.getText && f.test(c.getText());
                if (d) {
                    d = c.getParent();
                    c = c.getNext(b);
                    d = d.isBlockBoundary() && (!c || c.type == CKEDITOR.NODE_ELEMENT &&
                        c.isBlockBoundary())
                }
                return!!(a ^ d)
            }
        };
        var f = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/, e = CKEDITOR.dom.walker.whitespaces(), d = CKEDITOR.dom.walker.bookmark();
        CKEDITOR.dom.element.prototype.getBogus = function () {
            var a = this;
            do a = a.getPreviousSourceNode(); while (d(a) || e(a) || a.type == CKEDITOR.NODE_ELEMENT && a.getName()in CKEDITOR.dtd.$inline && !(a.getName()in CKEDITOR.dtd.$empty));
            return a && (!CKEDITOR.env.ie ? a.is && a.is("br") : a.getText && f.test(a.getText())) ? a : false
        }
    })();
    CKEDITOR.dom.range = function (a) {
        this.endOffset = this.endContainer = this.startOffset = this.startContainer = null;
        this.collapsed = true;
        var c = a instanceof CKEDITOR.dom.document;
        this.document = c ? a : a.getDocument();
        this.root = c ? a.getBody() : a
    };
    (function () {
        function a() {
            var a = false, b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark(true), g = CKEDITOR.dom.walker.bogus();
            return function (h) {
                if (c(h) || b(h))return true;
                if (g(h) && !a)return a = true;
                return h.type == CKEDITOR.NODE_TEXT && (h.hasAscendant("pre") || CKEDITOR.tools.trim(h.getText()).length) || h.type == CKEDITOR.NODE_ELEMENT && !h.is(d) ? false : true
            }
        }

        function c(a) {
            var b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark(1);
            return function (g) {
                return c(g) || b(g) ? true : !a && j(g) ||
                    g.type == CKEDITOR.NODE_ELEMENT && g.is(CKEDITOR.dtd.$removeEmpty)
            }
        }

        function b(a) {
            return!l(a) && !i(a)
        }

        var f = function (a) {
            a.collapsed = a.startContainer && a.endContainer && a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset
        }, e = function (a, b, c, g) {
            a.optimizeBookmark();
            var h = a.startContainer, d = a.endContainer, f = a.startOffset, k = a.endOffset, e, j;
            if (d.type == CKEDITOR.NODE_TEXT)d = d.split(k); else if (d.getChildCount() > 0)if (k >= d.getChildCount()) {
                d = d.append(a.document.createText(""));
                j = true
            } else d = d.getChild(k);
            if (h.type == CKEDITOR.NODE_TEXT) {
                h.split(f);
                h.equals(d) && (d = h.getNext())
            } else if (f)if (f >= h.getChildCount()) {
                h = h.append(a.document.createText(""));
                e = true
            } else h = h.getChild(f).getPrevious(); else {
                h = h.append(a.document.createText(""), 1);
                e = true
            }
            var f = h.getParents(), k = d.getParents(), l, i, q;
            for (l = 0; l < f.length; l++) {
                i = f[l];
                q = k[l];
                if (!i.equals(q))break
            }
            for (var m = c, s, A, v, o = l; o < f.length; o++) {
                s = f[o];
                m && !s.equals(h) && (A = m.append(s.clone()));
                for (s = s.getNext(); s;) {
                    if (s.equals(k[o]) || s.equals(d))break;
                    v = s.getNext();
                    if (b == 2)m.append(s.clone(true)); else {
                        s.remove();
                        b == 1 && m.append(s)
                    }
                    s = v
                }
                m && (m = A)
            }
            m = c;
            for (c = l; c < k.length; c++) {
                s = k[c];
                b > 0 && !s.equals(d) && (A = m.append(s.clone()));
                if (!f[c] || s.$.parentNode != f[c].$.parentNode)for (s = s.getPrevious(); s;) {
                    if (s.equals(f[c]) || s.equals(h))break;
                    v = s.getPrevious();
                    if (b == 2)m.$.insertBefore(s.$.cloneNode(true), m.$.firstChild); else {
                        s.remove();
                        b == 1 && m.$.insertBefore(s.$, m.$.firstChild)
                    }
                    s = v
                }
                m && (m = A)
            }
            if (b == 2) {
                i = a.startContainer;
                if (i.type == CKEDITOR.NODE_TEXT) {
                    i.$.data = i.$.data + i.$.nextSibling.data;
                    i.$.parentNode.removeChild(i.$.nextSibling)
                }
                a = a.endContainer;
                if (a.type == CKEDITOR.NODE_TEXT && a.$.nextSibling) {
                    a.$.data = a.$.data + a.$.nextSibling.data;
                    a.$.parentNode.removeChild(a.$.nextSibling)
                }
            } else {
                if (i && q && (h.$.parentNode != i.$.parentNode || d.$.parentNode != q.$.parentNode)) {
                    b = q.getIndex();
                    e && q.$.parentNode == h.$.parentNode && b--;
                    if (g && i.type == CKEDITOR.NODE_ELEMENT) {
                        g = CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>', a.document);
                        g.insertAfter(i);
                        i.mergeSiblings(false);
                        a.moveToBookmark({startNode: g})
                    } else a.setStart(q.getParent(), b)
                }
                a.collapse(true)
            }
            e && h.remove();
            j && d.$.parentNode && d.remove()
        }, d = {abbr: 1, acronym: 1, b: 1, bdo: 1, big: 1, cite: 1, code: 1, del: 1, dfn: 1, em: 1, font: 1, i: 1, ins: 1, label: 1, kbd: 1, q: 1, samp: 1, small: 1, span: 1, strike: 1, strong: 1, sub: 1, sup: 1, tt: 1, u: 1, "var": 1}, j = CKEDITOR.dom.walker.bogus(), l = new CKEDITOR.dom.walker.whitespaces, i = new CKEDITOR.dom.walker.bookmark, m = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/;
        CKEDITOR.dom.range.prototype = {clone: function () {
            var a = new CKEDITOR.dom.range(this.root);
            a.startContainer = this.startContainer;
            a.startOffset = this.startOffset;
            a.endContainer = this.endContainer;
            a.endOffset = this.endOffset;
            a.collapsed = this.collapsed;
            return a
        }, collapse: function (a) {
            if (a) {
                this.endContainer = this.startContainer;
                this.endOffset = this.startOffset
            } else {
                this.startContainer = this.endContainer;
                this.startOffset = this.endOffset
            }
            this.collapsed = true
        }, cloneContents: function () {
            var a = new CKEDITOR.dom.documentFragment(this.document);
            this.collapsed || e(this, 2, a);
            return a
        }, deleteContents: function (a) {
            this.collapsed ||
            e(this, 0, null, a)
        }, extractContents: function (a) {
            var b = new CKEDITOR.dom.documentFragment(this.document);
            this.collapsed || e(this, 1, b, a);
            return b
        }, createBookmark: function (a) {
            var b, c, g, h, d = this.collapsed;
            b = this.document.createElement("span");
            b.data("cke-bookmark", 1);
            b.setStyle("display", "none");
            b.setHtml("&nbsp;");
            if (a) {
                g = "cke_bm_" + CKEDITOR.tools.getNextNumber();
                b.setAttribute("id", g + (d ? "C" : "S"))
            }
            if (!d) {
                c = b.clone();
                c.setHtml("&nbsp;");
                a && c.setAttribute("id", g + "E");
                h = this.clone();
                h.collapse();
                h.insertNode(c)
            }
            h =
                this.clone();
            h.collapse(true);
            h.insertNode(b);
            if (c) {
                this.setStartAfter(b);
                this.setEndBefore(c)
            } else this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
            return{startNode: a ? g + (d ? "C" : "S") : b, endNode: a ? g + "E" : c, serializable: a, collapsed: d}
        }, createBookmark2: function (a) {
            var b = this.startContainer, c = this.endContainer, g = this.startOffset, h = this.endOffset, d = this.collapsed, f, k;
            if (!b || !c)return{start: 0, end: 0};
            if (a) {
                if (b.type == CKEDITOR.NODE_ELEMENT) {
                    if ((f = b.getChild(g)) && f.type == CKEDITOR.NODE_TEXT && g > 0 && f.getPrevious().type ==
                        CKEDITOR.NODE_TEXT) {
                        b = f;
                        g = 0
                    }
                    f && f.type == CKEDITOR.NODE_ELEMENT && (g = f.getIndex(1))
                }
                for (; b.type == CKEDITOR.NODE_TEXT && (k = b.getPrevious()) && k.type == CKEDITOR.NODE_TEXT;) {
                    b = k;
                    g = g + k.getLength()
                }
                if (!d) {
                    if (c.type == CKEDITOR.NODE_ELEMENT) {
                        if ((f = c.getChild(h)) && f.type == CKEDITOR.NODE_TEXT && h > 0 && f.getPrevious().type == CKEDITOR.NODE_TEXT) {
                            c = f;
                            h = 0
                        }
                        f && f.type == CKEDITOR.NODE_ELEMENT && (h = f.getIndex(1))
                    }
                    for (; c.type == CKEDITOR.NODE_TEXT && (k = c.getPrevious()) && k.type == CKEDITOR.NODE_TEXT;) {
                        c = k;
                        h = h + k.getLength()
                    }
                }
            }
            return{start: b.getAddress(a),
                end: d ? null : c.getAddress(a), startOffset: g, endOffset: h, normalized: a, collapsed: d, is2: true}
        }, moveToBookmark: function (a) {
            if (a.is2) {
                var b = this.document.getByAddress(a.start, a.normalized), c = a.startOffset, g = a.end && this.document.getByAddress(a.end, a.normalized), a = a.endOffset;
                this.setStart(b, c);
                g ? this.setEnd(g, a) : this.collapse(true)
            } else {
                b = (c = a.serializable) ? this.document.getById(a.startNode) : a.startNode;
                a = c ? this.document.getById(a.endNode) : a.endNode;
                this.setStartBefore(b);
                b.remove();
                if (a) {
                    this.setEndBefore(a);
                    a.remove()
                } else this.collapse(true)
            }
        }, getBoundaryNodes: function () {
            var a = this.startContainer, b = this.endContainer, c = this.startOffset, g = this.endOffset, h;
            if (a.type == CKEDITOR.NODE_ELEMENT) {
                h = a.getChildCount();
                if (h > c)a = a.getChild(c); else if (h < 1)a = a.getPreviousSourceNode(); else {
                    for (a = a.$; a.lastChild;)a = a.lastChild;
                    a = new CKEDITOR.dom.node(a);
                    a = a.getNextSourceNode() || a
                }
            }
            if (b.type == CKEDITOR.NODE_ELEMENT) {
                h = b.getChildCount();
                if (h > g)b = b.getChild(g).getPreviousSourceNode(true); else if (h < 1)b = b.getPreviousSourceNode();
                else {
                    for (b = b.$; b.lastChild;)b = b.lastChild;
                    b = new CKEDITOR.dom.node(b)
                }
            }
            a.getPosition(b) & CKEDITOR.POSITION_FOLLOWING && (a = b);
            return{startNode: a, endNode: b}
        }, getCommonAncestor: function (a, b) {
            var c = this.startContainer, g = this.endContainer, c = c.equals(g) ? a && c.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1 ? c.getChild(this.startOffset) : c : c.getCommonAncestor(g);
            return b && !c.is ? c.getParent() : c
        }, optimize: function () {
            var a = this.startContainer, b = this.startOffset;
            a.type != CKEDITOR.NODE_ELEMENT && (b ? b >=
                a.getLength() && this.setStartAfter(a) : this.setStartBefore(a));
            a = this.endContainer;
            b = this.endOffset;
            a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setEndAfter(a) : this.setEndBefore(a))
        }, optimizeBookmark: function () {
            var a = this.startContainer, b = this.endContainer;
            a.is && (a.is("span") && a.data("cke-bookmark")) && this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START);
            b && (b.is && b.is("span") && b.data("cke-bookmark")) && this.setEndAt(b, CKEDITOR.POSITION_AFTER_END)
        }, trim: function (a, b) {
            var c = this.startContainer,
                g = this.startOffset, h = this.collapsed;
            if ((!a || h) && c && c.type == CKEDITOR.NODE_TEXT) {
                if (g)if (g >= c.getLength()) {
                    g = c.getIndex() + 1;
                    c = c.getParent()
                } else {
                    var d = c.split(g), g = c.getIndex() + 1, c = c.getParent();
                    if (this.startContainer.equals(this.endContainer))this.setEnd(d, this.endOffset - this.startOffset); else if (c.equals(this.endContainer))this.endOffset = this.endOffset + 1
                } else {
                    g = c.getIndex();
                    c = c.getParent()
                }
                this.setStart(c, g);
                if (h) {
                    this.collapse(true);
                    return
                }
            }
            c = this.endContainer;
            g = this.endOffset;
            if (!b && !h && c && c.type ==
                CKEDITOR.NODE_TEXT) {
                if (g) {
                    g >= c.getLength() || c.split(g);
                    g = c.getIndex() + 1
                } else g = c.getIndex();
                c = c.getParent();
                this.setEnd(c, g)
            }
        }, enlarge: function (a, b) {
            switch (a) {
                case CKEDITOR.ENLARGE_INLINE:
                    var c = 1;
                case CKEDITOR.ENLARGE_ELEMENT:
                    if (this.collapsed)break;
                    var g = this.getCommonAncestor(), h = this.root, d, f, k, e, j, l = false, i, q;
                    i = this.startContainer;
                    q = this.startOffset;
                    if (i.type == CKEDITOR.NODE_TEXT) {
                        if (q) {
                            i = !CKEDITOR.tools.trim(i.substring(0, q)).length && i;
                            l = !!i
                        }
                        if (i && !(e = i.getPrevious()))k = i.getParent()
                    } else {
                        q &&
                        (e = i.getChild(q - 1) || i.getLast());
                        e || (k = i)
                    }
                    for (; k || e;) {
                        if (k && !e) {
                            !j && k.equals(g) && (j = true);
                            if (c ? k.isBlockBoundary() : !h.contains(k))break;
                            if (!l || k.getComputedStyle("display") != "inline") {
                                l = false;
                                j ? d = k : this.setStartBefore(k)
                            }
                            e = k.getPrevious()
                        }
                        for (; e;) {
                            i = false;
                            if (e.type == CKEDITOR.NODE_COMMENT)e = e.getPrevious(); else {
                                if (e.type == CKEDITOR.NODE_TEXT) {
                                    q = e.getText();
                                    /[^\s\ufeff]/.test(q) && (e = null);
                                    i = /[\s\ufeff]$/.test(q)
                                } else if ((e.$.offsetWidth > 0 || b && e.is("br")) && !e.data("cke-bookmark"))if (l && CKEDITOR.dtd.$removeEmpty[e.getName()]) {
                                    q =
                                        e.getText();
                                    if (/[^\s\ufeff]/.test(q))e = null; else for (var m = e.$.getElementsByTagName("*"), s = 0, A; A = m[s++];)if (!CKEDITOR.dtd.$removeEmpty[A.nodeName.toLowerCase()]) {
                                        e = null;
                                        break
                                    }
                                    e && (i = !!q.length)
                                } else e = null;
                                i && (l ? j ? d = k : k && this.setStartBefore(k) : l = true);
                                if (e) {
                                    i = e.getPrevious();
                                    if (!k && !i) {
                                        k = e;
                                        e = null;
                                        break
                                    }
                                    e = i
                                } else k = null
                            }
                        }
                        k && (k = k.getParent())
                    }
                    i = this.endContainer;
                    q = this.endOffset;
                    k = e = null;
                    j = l = false;
                    if (i.type == CKEDITOR.NODE_TEXT) {
                        i = !CKEDITOR.tools.trim(i.substring(q)).length && i;
                        l = !(i && i.getLength());
                        if (i && !(e = i.getNext()))k = i.getParent()
                    } else(e = i.getChild(q)) || (k = i);
                    for (; k || e;) {
                        if (k && !e) {
                            !j && k.equals(g) && (j = true);
                            if (c ? k.isBlockBoundary() : !h.contains(k))break;
                            if (!l || k.getComputedStyle("display") != "inline") {
                                l = false;
                                j ? f = k : k && this.setEndAfter(k)
                            }
                            e = k.getNext()
                        }
                        for (; e;) {
                            i = false;
                            if (e.type == CKEDITOR.NODE_TEXT) {
                                q = e.getText();
                                /[^\s\ufeff]/.test(q) && (e = null);
                                i = /^[\s\ufeff]/.test(q)
                            } else if (e.type == CKEDITOR.NODE_ELEMENT) {
                                if ((e.$.offsetWidth > 0 || b && e.is("br")) && !e.data("cke-bookmark"))if (l && CKEDITOR.dtd.$removeEmpty[e.getName()]) {
                                    q =
                                        e.getText();
                                    if (/[^\s\ufeff]/.test(q))e = null; else {
                                        m = e.$.getElementsByTagName("*");
                                        for (s = 0; A = m[s++];)if (!CKEDITOR.dtd.$removeEmpty[A.nodeName.toLowerCase()]) {
                                            e = null;
                                            break
                                        }
                                    }
                                    e && (i = !!q.length)
                                } else e = null
                            } else i = 1;
                            i && l && (j ? f = k : this.setEndAfter(k));
                            if (e) {
                                i = e.getNext();
                                if (!k && !i) {
                                    k = e;
                                    e = null;
                                    break
                                }
                                e = i
                            } else k = null
                        }
                        k && (k = k.getParent())
                    }
                    if (d && f) {
                        g = d.contains(f) ? f : d;
                        this.setStartBefore(g);
                        this.setEndAfter(g)
                    }
                    break;
                case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
                case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
                    k = new CKEDITOR.dom.range(this.root);
                    h = this.root;
                    k.setStartAt(h, CKEDITOR.POSITION_AFTER_START);
                    k.setEnd(this.startContainer, this.startOffset);
                    k = new CKEDITOR.dom.walker(k);
                    var v, o, x = CKEDITOR.dom.walker.blockBoundary(a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {br: 1} : null), I = function (a) {
                        var b = x(a);
                        b || (v = a);
                        return b
                    }, c = function (a) {
                        var b = I(a);
                        !b && (a.is && a.is("br")) && (o = a);
                        return b
                    };
                    k.guard = I;
                    k = k.lastBackward();
                    v = v || h;
                    this.setStartAt(v, !v.is("br") && (!k && this.checkStartOfBlock() || k && v.contains(k)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
                    if (a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
                        k = this.clone();
                        k = new CKEDITOR.dom.walker(k);
                        var G = CKEDITOR.dom.walker.whitespaces(), C = CKEDITOR.dom.walker.bookmark();
                        k.evaluator = function (a) {
                            return!G(a) && !C(a)
                        };
                        if ((k = k.previous()) && k.type == CKEDITOR.NODE_ELEMENT && k.is("br"))break
                    }
                    k = this.clone();
                    k.collapse();
                    k.setEndAt(h, CKEDITOR.POSITION_BEFORE_END);
                    k = new CKEDITOR.dom.walker(k);
                    k.guard = a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? c : I;
                    v = null;
                    k = k.lastForward();
                    v = v || h;
                    this.setEndAt(v, !k && this.checkEndOfBlock() || k &&
                        v.contains(k) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
                    o && this.setEndAfter(o)
            }
        }, shrink: function (a, b, c) {
            if (!this.collapsed) {
                var a = a || CKEDITOR.SHRINK_TEXT, g = this.clone(), h = this.startContainer, d = this.endContainer, e = this.startOffset, f = this.endOffset, j = 1, i = 1;
                if (h && h.type == CKEDITOR.NODE_TEXT)if (e)if (e >= h.getLength())g.setStartAfter(h); else {
                    g.setStartBefore(h);
                    j = 0
                } else g.setStartBefore(h);
                if (d && d.type == CKEDITOR.NODE_TEXT)if (f)if (f >= d.getLength())g.setEndAfter(d); else {
                    g.setEndAfter(d);
                    i = 0
                } else g.setEndBefore(d);
                var g = new CKEDITOR.dom.walker(g), l = CKEDITOR.dom.walker.bookmark();
                g.evaluator = function (b) {
                    return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT)
                };
                var m;
                g.guard = function (b, g) {
                    if (l(b))return true;
                    if (a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || g && b.equals(m) || c === false && b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary())return false;
                    !g && b.type == CKEDITOR.NODE_ELEMENT && (m = b);
                    return true
                };
                if (j)(h = g[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" :
                    "next"]()) && this.setStartAt(h, b ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
                if (i) {
                    g.reset();
                    (g = g[a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) && this.setEndAt(g, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END)
                }
                return!(!j && !i)
            }
        }, insertNode: function (a) {
            this.optimizeBookmark();
            this.trim(false, true);
            var b = this.startContainer, c = b.getChild(this.startOffset);
            c ? a.insertBefore(c) : b.append(a);
            a.getParent() && a.getParent().equals(this.endContainer) && this.endOffset++;
            this.setStartBefore(a)
        },
            moveToPosition: function (a, b) {
                this.setStartAt(a, b);
                this.collapse(true)
            }, moveToRange: function (a) {
                this.setStart(a.startContainer, a.startOffset);
                this.setEnd(a.endContainer, a.endOffset)
            }, selectNodeContents: function (a) {
                this.setStart(a, 0);
                this.setEnd(a, a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount())
            }, setStart: function (a, b) {
                if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
                    b = a.getIndex();
                    a = a.getParent()
                }
                this.startContainer = a;
                this.startOffset = b;
                if (!this.endContainer) {
                    this.endContainer =
                        a;
                    this.endOffset = b
                }
                f(this)
            }, setEnd: function (a, b) {
                if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
                    b = a.getIndex() + 1;
                    a = a.getParent()
                }
                this.endContainer = a;
                this.endOffset = b;
                if (!this.startContainer) {
                    this.startContainer = a;
                    this.startOffset = b
                }
                f(this)
            }, setStartAfter: function (a) {
                this.setStart(a.getParent(), a.getIndex() + 1)
            }, setStartBefore: function (a) {
                this.setStart(a.getParent(), a.getIndex())
            }, setEndAfter: function (a) {
                this.setEnd(a.getParent(), a.getIndex() + 1)
            }, setEndBefore: function (a) {
                this.setEnd(a.getParent(),
                    a.getIndex())
            }, setStartAt: function (a, b) {
                switch (b) {
                    case CKEDITOR.POSITION_AFTER_START:
                        this.setStart(a, 0);
                        break;
                    case CKEDITOR.POSITION_BEFORE_END:
                        a.type == CKEDITOR.NODE_TEXT ? this.setStart(a, a.getLength()) : this.setStart(a, a.getChildCount());
                        break;
                    case CKEDITOR.POSITION_BEFORE_START:
                        this.setStartBefore(a);
                        break;
                    case CKEDITOR.POSITION_AFTER_END:
                        this.setStartAfter(a)
                }
                f(this)
            }, setEndAt: function (a, b) {
                switch (b) {
                    case CKEDITOR.POSITION_AFTER_START:
                        this.setEnd(a, 0);
                        break;
                    case CKEDITOR.POSITION_BEFORE_END:
                        a.type ==
                            CKEDITOR.NODE_TEXT ? this.setEnd(a, a.getLength()) : this.setEnd(a, a.getChildCount());
                        break;
                    case CKEDITOR.POSITION_BEFORE_START:
                        this.setEndBefore(a);
                        break;
                    case CKEDITOR.POSITION_AFTER_END:
                        this.setEndAfter(a)
                }
                f(this)
            }, fixBlock: function (a, b) {
                var c = this.createBookmark(), g = this.document.createElement(b);
                this.collapse(a);
                this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                this.extractContents().appendTo(g);
                g.trim();
                CKEDITOR.env.ie || g.appendBogus();
                this.insertNode(g);
                this.moveToBookmark(c);
                return g
            }, splitBlock: function (a) {
                var b =
                    new CKEDITOR.dom.elementPath(this.startContainer, this.root), c = new CKEDITOR.dom.elementPath(this.endContainer, this.root), g = b.block, h = c.block, d = null;
                if (!b.blockLimit.equals(c.blockLimit))return null;
                if (a != "br") {
                    if (!g) {
                        g = this.fixBlock(true, a);
                        h = (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block
                    }
                    h || (h = this.fixBlock(false, a))
                }
                a = g && this.checkStartOfBlock();
                b = h && this.checkEndOfBlock();
                this.deleteContents();
                if (g && g.equals(h))if (b) {
                    d = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                    this.moveToPosition(h, CKEDITOR.POSITION_AFTER_END);
                    h = null
                } else if (a) {
                    d = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                    this.moveToPosition(g, CKEDITOR.POSITION_BEFORE_START);
                    g = null
                } else {
                    h = this.splitElement(g);
                    !CKEDITOR.env.ie && !g.is("ul", "ol") && g.appendBogus()
                }
                return{previousBlock: g, nextBlock: h, wasStartOfBlock: a, wasEndOfBlock: b, elementPath: d}
            }, splitElement: function (a) {
                if (!this.collapsed)return null;
                this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
                var b = this.extractContents(), c = a.clone(false);
                b.appendTo(c);
                c.insertAfter(a);
                this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
                return c
            }, removeEmptyBlocksAtEnd: function () {
                function a(g) {
                    return function (a) {
                        return b(a) || (c(a) || a.type == CKEDITOR.NODE_ELEMENT && a.isEmptyInlineRemoveable()) || g.is("table") && a.is("caption") ? false : true
                    }
                }

                var b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark(false);
                return function (b) {
                    for (var c = this.createBookmark(), d = this[b ? "endPath" : "startPath"](), e = d.block || d.blockLimit, f; e && !e.equals(d.root) && !e.getFirst(a(e));) {
                        f =
                            e.getParent();
                        this[b ? "setEndAt" : "setStartAt"](e, CKEDITOR.POSITION_AFTER_END);
                        e.remove(1);
                        e = f
                    }
                    this.moveToBookmark(c)
                }
            }(), startPath: function () {
                return new CKEDITOR.dom.elementPath(this.startContainer, this.root)
            }, endPath: function () {
                return new CKEDITOR.dom.elementPath(this.endContainer, this.root)
            }, checkBoundaryOfElement: function (a, b) {
                var d = b == CKEDITOR.START, g = this.clone();
                g.collapse(d);
                g[d ? "setStartAt" : "setEndAt"](a, d ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
                g = new CKEDITOR.dom.walker(g);
                g.evaluator = c(d);
                return g[d ? "checkBackward" : "checkForward"]()
            }, checkStartOfBlock: function () {
                var b = this.startContainer, c = this.startOffset;
                if (CKEDITOR.env.ie && c && b.type == CKEDITOR.NODE_TEXT) {
                    b = CKEDITOR.tools.ltrim(b.substring(0, c));
                    m.test(b) && this.trim(0, 1)
                }
                this.trim();
                b = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                c = this.clone();
                c.collapse(true);
                c.setStartAt(b.block || b.blockLimit, CKEDITOR.POSITION_AFTER_START);
                b = new CKEDITOR.dom.walker(c);
                b.evaluator = a();
                return b.checkBackward()
            }, checkEndOfBlock: function () {
                var b =
                    this.endContainer, c = this.endOffset;
                if (CKEDITOR.env.ie && b.type == CKEDITOR.NODE_TEXT) {
                    b = CKEDITOR.tools.rtrim(b.substring(c));
                    m.test(b) && this.trim(1, 0)
                }
                this.trim();
                b = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
                c = this.clone();
                c.collapse(false);
                c.setEndAt(b.block || b.blockLimit, CKEDITOR.POSITION_BEFORE_END);
                b = new CKEDITOR.dom.walker(c);
                b.evaluator = a();
                return b.checkForward()
            }, getPreviousNode: function (a, b, c) {
                var d = this.clone();
                d.collapse(1);
                d.setStartAt(c || this.root, CKEDITOR.POSITION_AFTER_START);
                c = new CKEDITOR.dom.walker(d);
                c.evaluator = a;
                c.guard = b;
                return c.previous()
            }, getNextNode: function (a, b, c) {
                var d = this.clone();
                d.collapse();
                d.setEndAt(c || this.root, CKEDITOR.POSITION_BEFORE_END);
                c = new CKEDITOR.dom.walker(d);
                c.evaluator = a;
                c.guard = b;
                return c.next()
            }, checkReadOnly: function () {
                function a(b, c) {
                    for (; b;) {
                        if (b.type == CKEDITOR.NODE_ELEMENT) {
                            if (b.getAttribute("contentEditable") == "false" && !b.data("cke-editable"))return 0;
                            if (b.is("html") || b.getAttribute("contentEditable") == "true" && (b.contains(c) || b.equals(c)))break
                        }
                        b =
                            b.getParent()
                    }
                    return 1
                }

                return function () {
                    var b = this.startContainer, c = this.endContainer;
                    return!(a(b, c) && a(c, b))
                }
            }(), moveToElementEditablePosition: function (a, c) {
                if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(false)) {
                    this.moveToPosition(a, c ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
                    return true
                }
                for (var d = 0; a;) {
                    if (a.type == CKEDITOR.NODE_TEXT) {
                        c && this.checkEndOfBlock() && m.test(a.getText()) ? this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START) : this.moveToPosition(a, c ? CKEDITOR.POSITION_AFTER_END :
                            CKEDITOR.POSITION_BEFORE_START);
                        d = 1;
                        break
                    }
                    if (a.type == CKEDITOR.NODE_ELEMENT)if (a.isEditable()) {
                        this.moveToPosition(a, c ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START);
                        d = 1
                    } else c && (a.is("br") && this.checkEndOfBlock()) && this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
                    var g = a, h = d, e = void 0;
                    g.type == CKEDITOR.NODE_ELEMENT && g.isEditable(false) && (e = g[c ? "getLast" : "getFirst"](b));
                    !h && !e && (e = g[c ? "getPrevious" : "getNext"](b));
                    a = e
                }
                return!!d
            }, moveToElementEditStart: function (a) {
                return this.moveToElementEditablePosition(a)
            },
            moveToElementEditEnd: function (a) {
                return this.moveToElementEditablePosition(a, true)
            }, getEnclosedNode: function () {
                var a = this.clone();
                a.optimize();
                if (a.startContainer.type != CKEDITOR.NODE_ELEMENT || a.endContainer.type != CKEDITOR.NODE_ELEMENT)return null;
                var a = new CKEDITOR.dom.walker(a), b = CKEDITOR.dom.walker.bookmark(false, true), c = CKEDITOR.dom.walker.whitespaces(true);
                a.evaluator = function (a) {
                    return c(a) && b(a)
                };
                var d = a.next();
                a.reset();
                return d && d.equals(a.previous()) ? d : null
            }, getTouchedStartNode: function () {
                var a =
                    this.startContainer;
                return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a
            }, getTouchedEndNode: function () {
                var a = this.endContainer;
                return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a
            }, scrollIntoView: function () {
                var a = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document), b, c, d, h = this.clone();
                h.optimize();
                if (d = h.startContainer.type == CKEDITOR.NODE_TEXT) {
                    c = h.startContainer.getText();
                    b = h.startContainer.split(h.startOffset);
                    a.insertAfter(h.startContainer)
                } else h.insertNode(a);
                a.scrollIntoView();
                if (d) {
                    h.startContainer.setText(c);
                    b.remove()
                }
                a.remove()
            }}
    })();
    CKEDITOR.POSITION_AFTER_START = 1;
    CKEDITOR.POSITION_BEFORE_END = 2;
    CKEDITOR.POSITION_BEFORE_START = 3;
    CKEDITOR.POSITION_AFTER_END = 4;
    CKEDITOR.ENLARGE_ELEMENT = 1;
    CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2;
    CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3;
    CKEDITOR.ENLARGE_INLINE = 4;
    CKEDITOR.START = 1;
    CKEDITOR.END = 2;
    CKEDITOR.SHRINK_ELEMENT = 1;
    CKEDITOR.SHRINK_TEXT = 2;
    (function () {
        function a(a) {
            if (!(arguments.length < 1)) {
                this.range = a;
                this.forceBrBreak = 0;
                this.enlargeBr = 1;
                this.enforceRealBlocks = 0;
                this._ || (this._ = {})
            }
        }

        function c(a, b, c) {
            for (a = a.getNextSourceNode(b, null, c); !f(a);)a = a.getNextSourceNode(b, null, c);
            return a
        }

        var b = /^[\r\n\t ]+$/, f = CKEDITOR.dom.walker.bookmark(false, true), e = CKEDITOR.dom.walker.whitespaces(true), d = function (a) {
            return f(a) && e(a)
        };
        a.prototype = {getNextParagraph: function (a) {
            a = a || "p";
            if (!CKEDITOR.dtd[this.range.root.getName()][a])return null;
            var e,
                i, m, n, r, p;
            if (!this._.started) {
                i = this.range.clone();
                i.shrink(CKEDITOR.NODE_ELEMENT, true);
                n = i.endContainer.hasAscendant("pre", true) || i.startContainer.hasAscendant("pre", true);
                i.enlarge(this.forceBrBreak && !n || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                if (!i.collapsed) {
                    n = new CKEDITOR.dom.walker(i.clone());
                    var g = CKEDITOR.dom.walker.bookmark(true, true);
                    n.evaluator = g;
                    this._.nextNode = n.next();
                    n = new CKEDITOR.dom.walker(i.clone());
                    n.evaluator = g;
                    n = n.previous();
                    this._.lastNode =
                        n.getNextSourceNode(true);
                    if (this._.lastNode && this._.lastNode.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary()) {
                        g = this.range.clone();
                        g.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END);
                        if (g.checkEndOfBlock()) {
                            g = new CKEDITOR.dom.elementPath(g.endContainer, g.root);
                            this._.lastNode = (g.block || g.blockLimit).getNextSourceNode(true)
                        }
                    }
                    if (!this._.lastNode) {
                        this._.lastNode = this._.docEndMarker = i.document.createText("");
                        this._.lastNode.insertAfter(n)
                    }
                    i =
                        null
                }
                this._.started = 1
            }
            g = this._.nextNode;
            n = this._.lastNode;
            for (this._.nextNode = null; g;) {
                var h = 0, u = g.hasAscendant("pre"), w = g.type != CKEDITOR.NODE_ELEMENT, k = 0;
                if (w)g.type == CKEDITOR.NODE_TEXT && b.test(g.getText()) && (w = 0); else {
                    var t = g.getName();
                    if (g.isBlockBoundary(this.forceBrBreak && !u && {br: 1})) {
                        if (t == "br")w = 1; else if (!i && !g.getChildCount() && t != "hr") {
                            e = g;
                            m = g.equals(n);
                            break
                        }
                        if (i) {
                            i.setEndAt(g, CKEDITOR.POSITION_BEFORE_START);
                            if (t != "br")this._.nextNode = g
                        }
                        h = 1
                    } else {
                        if (g.getFirst()) {
                            if (!i) {
                                i = this.range.clone();
                                i.setStartAt(g, CKEDITOR.POSITION_BEFORE_START)
                            }
                            g = g.getFirst();
                            continue
                        }
                        w = 1
                    }
                }
                if (w && !i) {
                    i = this.range.clone();
                    i.setStartAt(g, CKEDITOR.POSITION_BEFORE_START)
                }
                m = (!h || w) && g.equals(n);
                if (i && !h)for (; !g.getNext(d) && !m;) {
                    t = g.getParent();
                    if (t.isBlockBoundary(this.forceBrBreak && !u && {br: 1})) {
                        h = 1;
                        w = 0;
                        m || t.equals(n);
                        i.setEndAt(t, CKEDITOR.POSITION_BEFORE_END);
                        break
                    }
                    g = t;
                    w = 1;
                    m = g.equals(n);
                    k = 1
                }
                w && i.setEndAt(g, CKEDITOR.POSITION_AFTER_END);
                g = c(g, k, n);
                if ((m = !g) || h && i)break
            }
            if (!e) {
                if (!i) {
                    this._.docEndMarker && this._.docEndMarker.remove();
                    return this._.nextNode = null
                }
                e = new CKEDITOR.dom.elementPath(i.startContainer, i.root);
                g = e.blockLimit;
                h = {div: 1, th: 1, td: 1};
                e = e.block;
                if (!e && g && !this.enforceRealBlocks && h[g.getName()] && i.checkStartOfBlock() && i.checkEndOfBlock() && !g.equals(i.root))e = g; else if (!e || this.enforceRealBlocks && e.getName() == "li") {
                    e = this.range.document.createElement(a);
                    i.extractContents().appendTo(e);
                    e.trim();
                    i.insertNode(e);
                    r = p = true
                } else if (e.getName() != "li") {
                    if (!i.checkStartOfBlock() || !i.checkEndOfBlock()) {
                        e = e.clone(false);
                        i.extractContents().appendTo(e);
                        e.trim();
                        p = i.splitBlock();
                        r = !p.wasStartOfBlock;
                        p = !p.wasEndOfBlock;
                        i.insertNode(e)
                    }
                } else if (!m)this._.nextNode = e.equals(n) ? null : c(i.getBoundaryNodes().endNode, 1, n)
            }
            if (r)(i = e.getPrevious()) && i.type == CKEDITOR.NODE_ELEMENT && (i.getName() == "br" ? i.remove() : i.getLast() && i.getLast().$.nodeName.toLowerCase() == "br" && i.getLast().remove());
            if (p)(i = e.getLast()) && i.type == CKEDITOR.NODE_ELEMENT && i.getName() == "br" && (CKEDITOR.env.ie || i.getPrevious(f) || i.getNext(f)) && i.remove();
            if (!this._.nextNode)this._.nextNode = m ||
                e.equals(n) || !n ? null : c(e, 1, n);
            return e
        }};
        CKEDITOR.dom.range.prototype.createIterator = function () {
            return new a(this)
        }
    })();
    CKEDITOR.command = function (a, c) {
        this.uiItems = [];
        this.exec = function (b) {
            if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed())return false;
            this.editorFocus && a.focus();
            return this.fire("exec") === false ? true : c.exec.call(this, a, b) !== false
        };
        this.refresh = function (a, b) {
            if (!this.readOnly && a.readOnly)return true;
            if (this.context && !b.isContextFor(this.context)) {
                this.disable();
                return true
            }
            this.enable();
            return this.fire("refresh", {editor: a, path: b}) === false ? true : c.refresh && c.refresh.apply(this, arguments) !==
                false
        };
        var b;
        this.checkAllowed = function () {
            return typeof b == "boolean" ? b : b = a.filter.checkFeature(this)
        };
        CKEDITOR.tools.extend(this, c, {modes: {wysiwyg: 1}, editorFocus: 1, contextSensitive: !!c.context, state: CKEDITOR.TRISTATE_DISABLED});
        CKEDITOR.event.call(this)
    };
    CKEDITOR.command.prototype = {enable: function () {
        this.state == CKEDITOR.TRISTATE_DISABLED && this.checkAllowed() && this.setState(!this.preserveState || typeof this.previousState == "undefined" ? CKEDITOR.TRISTATE_OFF : this.previousState)
    }, disable: function () {
        this.setState(CKEDITOR.TRISTATE_DISABLED)
    }, setState: function (a) {
        if (this.state == a || !this.checkAllowed())return false;
        this.previousState = this.state;
        this.state = a;
        this.fire("state");
        return true
    }, toggleState: function () {
        this.state == CKEDITOR.TRISTATE_OFF ? this.setState(CKEDITOR.TRISTATE_ON) :
            this.state == CKEDITOR.TRISTATE_ON && this.setState(CKEDITOR.TRISTATE_OFF)
    }};
    CKEDITOR.event.implementOn(CKEDITOR.command.prototype);
    CKEDITOR.ENTER_P = 1;
    CKEDITOR.ENTER_BR = 2;
    CKEDITOR.ENTER_DIV = 3;
    CKEDITOR.config = {customConfig: "config.js", autoUpdateElement: !0, language: "", defaultLanguage: "en", contentsLangDirection: "", enterMode: CKEDITOR.ENTER_P, forceEnterMode: !1, shiftEnterMode: CKEDITOR.ENTER_BR, docType: "<!DOCTYPE html>", bodyId: "", bodyClass: "", fullPage: !1, height: 200, extraPlugins: "", removePlugins: "", protectedSource: [], tabIndex: 0, width: "", baseFloatZIndex: 1E4, blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]};
    (function () {
        function a(a, b, d, g, h) {
            var f = b.name;
            if ((g || typeof a.elements != "function" || a.elements(f)) && (!a.match || a.match(b))) {
                if (g = !h) {
                    a:if (a.nothingRequired)g = true; else {
                        if (h = a.requiredClasses) {
                            f = b.classes;
                            for (g = 0; g < h.length; ++g)if (CKEDITOR.tools.indexOf(f, h[g]) == -1) {
                                g = false;
                                break a
                            }
                        }
                        g = e(b.styles, a.requiredStyles) && e(b.attributes, a.requiredAttributes)
                    }
                    g = !g
                }
                if (!g) {
                    if (!a.propertiesOnly)d.valid = true;
                    if (!d.allAttributes)d.allAttributes = c(a.attributes, b.attributes, d.validAttributes);
                    if (!d.allStyles)d.allStyles =
                        c(a.styles, b.styles, d.validStyles);
                    if (!d.allClasses) {
                        a = a.classes;
                        b = b.classes;
                        g = d.validClasses;
                        if (a)if (a === true)b = true; else {
                            for (var h = 0, f = b.length, k; h < f; ++h) {
                                k = b[h];
                                g[k] || (g[k] = a(k))
                            }
                            b = false
                        } else b = false;
                        d.allClasses = b
                    }
                }
            }
        }

        function c(a, b, c) {
            if (!a)return false;
            if (a === true)return true;
            for (var d in b)c[d] || (c[d] = a(d, b[d]));
            return false
        }

        function b(a, b) {
            if (!a)return false;
            if (a === true)return a;
            if (typeof a == "string") {
                a = q(a);
                return a == "*" ? true : CKEDITOR.tools.convertArrayToObject(a.split(b))
            }
            if (CKEDITOR.tools.isArray(a))return a.length ?
                CKEDITOR.tools.convertArrayToObject(a) : false;
            var c = {}, d = 0, g;
            for (g in a) {
                c[g] = a[g];
                d++
            }
            return d ? c : false
        }

        function f(b) {
            if (b._.filterFunction)return b._.filterFunction;
            var c = /^cke:(object|embed|param)$/, d = /^(object|embed|param)$/;
            return b._.filterFunction = function (g, h, e, f, k, j, p) {
                var o = g.name, r, l = false;
                if (k)g.name = o = o.replace(c, "$1");
                if (e = e && e[o]) {
                    i(g);
                    for (o = 0; o < e.length; ++o)u(b, g, e[o]);
                    m(g)
                }
                if (h) {
                    var o = g.name, e = h.elements[o], w = h.generic, h = {valid: false, validAttributes: {}, validClasses: {}, validStyles: {},
                        allAttributes: false, allClasses: false, allStyles: false};
                    if (!e && !w) {
                        f.push(g);
                        return true
                    }
                    i(g);
                    if (e) {
                        o = 0;
                        for (r = e.length; o < r; ++o)a(e[o], g, h, true, j)
                    }
                    if (w) {
                        o = 0;
                        for (r = w.length; o < r; ++o)a(w[o], g, h, false, j)
                    }
                    if (!h.valid) {
                        f.push(g);
                        return true
                    }
                    j = h.validAttributes;
                    o = h.validStyles;
                    e = h.validClasses;
                    r = g.attributes;
                    var w = g.styles, q = r["class"], x = r.style, t, B, D = [], s = [], F = /^data-cke-/, z = false;
                    delete r.style;
                    delete r["class"];
                    if (!h.allAttributes)for (t in r)if (!j[t])if (F.test(t)) {
                        if (t != (B = t.replace(/^data-cke-saved-/, "")) && !j[B]) {
                            delete r[t];
                            z = true
                        }
                    } else {
                        delete r[t];
                        z = true
                    }
                    if (h.allStyles) {
                        if (x)r.style = x
                    } else {
                        for (t in w)o[t] ? D.push(t + ":" + w[t]) : z = true;
                        if (D.length)r.style = D.sort().join("; ")
                    }
                    if (h.allClasses)q && (r["class"] = q); else {
                        for (t in e)e[t] && s.push(t);
                        s.length && (r["class"] = s.sort().join(" "));
                        q && s.length < q.split(/\s+/).length && (z = true)
                    }
                    z && (l = true);
                    if (!p && !n(g)) {
                        f.push(g);
                        return true
                    }
                }
                if (k)g.name = g.name.replace(d, "cke:$1");
                return l
            }
        }

        function e(a, b) {
            if (!b)return true;
            for (var c = 0; c < b.length; ++c)if (!(b[c]in a))return false;
            return true
        }

        function d(a) {
            if (!a)return{};
            for (var a = a.split(/\s*,\s*/).sort(), b = {}; a.length;)b[a.shift()] = z;
            return b
        }

        function j(a) {
            for (var b, c, d, g, h = {}, e = 1, a = q(a); b = a.match(v);) {
                if (c = b[2]) {
                    d = l(c, "styles");
                    g = l(c, "attrs");
                    c = l(c, "classes")
                } else d = g = c = null;
                h["$" + e++] = {elements: b[1], classes: c, styles: d, attributes: g};
                a = a.slice(b[0].length)
            }
            return h
        }

        function l(a, b) {
            var c = a.match(o[b]);
            return c ? q(c[1]) : null
        }

        function i(a) {
            if (!a.styles)a.styles = CKEDITOR.tools.parseCssText(a.attributes.style || "", 1);
            if (!a.classes)a.classes =
                a.attributes["class"] ? a.attributes["class"].split(/\s+/) : []
        }

        function m(a) {
            var b = a.attributes, c;
            delete b.style;
            delete b["class"];
            if (c = CKEDITOR.tools.writeCssText(a.styles, true))b.style = c;
            a.classes.length && (b["class"] = a.classes.sort().join(" "))
        }

        function n(a) {
            switch (a.name) {
                case "a":
                    if (!a.children.length && !a.attributes.name)return false;
                    break;
                case "img":
                    if (!a.attributes.src)return false
            }
            return true
        }

        function r(a) {
            return!a ? false : a === true ? true : function (b) {
                return b in a
            }
        }

        function p() {
            return new CKEDITOR.htmlParser.element("br")
        }

        function g(a) {
            return a.type == CKEDITOR.NODE_ELEMENT && (a.name == "br" || D.$block[a.name])
        }

        function h(a, b, c) {
            var d = a.name;
            if (D.$empty[d] || !a.children.length)if (d == "hr" && b == "br")a.replaceWith(p()); else {
                a.parent && c.push({check: "it", el: a.parent});
                a.remove()
            } else if (D.$block[d] || d == "tr")if (b == "br") {
                if (a.previous && !g(a.previous)) {
                    b = p();
                    b.insertBefore(a)
                }
                if (a.next && !g(a.next)) {
                    b = p();
                    b.insertAfter(a)
                }
                a.replaceWithChildren()
            } else {
                var d = a.children, h;
                b:{
                    h = D[b];
                    for (var e = 0, f = d.length, k; e < f; ++e) {
                        k = d[e];
                        if (k.type ==
                            CKEDITOR.NODE_ELEMENT && !h[k.name]) {
                            h = false;
                            break b
                        }
                    }
                    h = true
                }
                if (h) {
                    a.name = b;
                    a.attributes = {};
                    c.push({check: "parent-down", el: a})
                } else {
                    h = a.parent;
                    for (var e = h.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || h.name == "body", j, f = d.length; f > 0;) {
                        k = d[--f];
                        if (e && (k.type == CKEDITOR.NODE_TEXT || k.type == CKEDITOR.NODE_ELEMENT && D.$inline[k.name])) {
                            if (!j) {
                                j = new CKEDITOR.htmlParser.element(b);
                                j.insertAfter(a);
                                c.push({check: "parent-down", el: j})
                            }
                            j.add(k, 0)
                        } else {
                            j = null;
                            k.insertAfter(a);
                            h.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && (k.type ==
                                CKEDITOR.NODE_ELEMENT && !D[h.name][k.name]) && c.push({check: "el-up", el: k})
                        }
                    }
                    a.remove()
                }
            } else if (d == "style")a.remove(); else {
                a.parent && c.push({check: "it", el: a.parent});
                a.replaceWithChildren()
            }
        }

        function u(a, b, c) {
            var d, g;
            for (d = 0; d < c.length; ++d) {
                g = c[d];
                if ((!g.check || a.check(g.check, false)) && (!g.left || g.left(b))) {
                    g.right(b, x);
                    break
                }
            }
        }

        function w(a, b) {
            var c = b.getDefinition(), d = c.attributes, g = c.styles, h, e, f, k;
            if (a.name != c.element)return false;
            for (h in d)if (h == "class") {
                c = d[h].split(/\s+/);
                for (f = a.classes.join("|"); k =
                    c.pop();)if (f.indexOf(k) == -1)return false
            } else if (a.attributes[h] != d[h])return false;
            for (e in g)if (a.styles[e] != g[e])return false;
            return true
        }

        function k(a, b) {
            var c, d;
            if (typeof a == "string")c = a; else if (a instanceof CKEDITOR.style)d = a; else {
                c = a[0];
                d = a[1]
            }
            return[
                {element: c, left: d, right: function (a, c) {
                    c.transform(a, b)
                }}
            ]
        }

        function t(a) {
            return function (b) {
                return w(b, a)
            }
        }

        function F(a) {
            return function (b, c) {
                c[a](b)
            }
        }

        var D = CKEDITOR.dtd, B = CKEDITOR.tools.copy, q = CKEDITOR.tools.trim, z = "cke-test";
        CKEDITOR.filter = function (a) {
            this.allowedContent =
                [];
            this.disabled = false;
            this.editor = null;
            this.enterMode = CKEDITOR.ENTER_P;
            this._ = {rules: {}, transformations: {}, cachedTests: {}};
            if (a instanceof CKEDITOR.editor) {
                var b = this.editor = a;
                this.customConfig = true;
                var a = b.config.allowedContent, c;
                if (a === true)this.disabled = true; else {
                    if (!a)this.customConfig = false;
                    this.enterMode = c = b.blockless ? CKEDITOR.ENTER_BR : b.config.enterMode;
                    this.allow("br " + (c == CKEDITOR.ENTER_P ? "p" : c == CKEDITOR.ENTER_DIV ? "div" : ""), "default", 1);
                    this.allow(a, "config", 1);
                    this.allow(b.config.extraAllowedContent,
                        "extra", 1);
                    this._.toHtmlListener = b.on("toHtml", function (a) {
                        this.applyTo(a.data.dataValue, true, a.data.dontFilter) && b.fire("dataFiltered")
                    }, this, null, 6);
                    this._.toDataFormatListener = b.on("toDataFormat", function (a) {
                        this.applyTo(a.data.dataValue, false, true)
                    }, this, null, 11)
                }
            } else {
                this.customConfig = false;
                this.allow(a, "default", 1)
            }
        };
        CKEDITOR.filter.prototype = {allow: function (a, c, d) {
            if (this.disabled || this.customConfig && !d || !a)return false;
            this._.cachedChecks = {};
            var g, h;
            if (typeof a == "string")a = j(a); else if (a instanceof
                CKEDITOR.style) {
                h = a.getDefinition();
                d = {};
                a = h.attributes;
                d[h.element] = h = {styles: h.styles, requiredStyles: h.styles && CKEDITOR.tools.objectKeys(h.styles)};
                if (a) {
                    a = B(a);
                    h.classes = a["class"] ? a["class"].split(/\s+/) : null;
                    h.requiredClasses = h.classes;
                    delete a["class"];
                    h.attributes = a;
                    h.requiredAttributes = a && CKEDITOR.tools.objectKeys(a)
                }
                a = d
            } else if (CKEDITOR.tools.isArray(a)) {
                for (g = 0; g < a.length; ++g)h = this.allow(a[g], c, d);
                return h
            }
            var e, d = [];
            for (e in a) {
                h = a[e];
                h = typeof h == "boolean" ? {} : typeof h == "function" ? {match: h} :
                    B(h);
                if (e.charAt(0) != "$")h.elements = e;
                if (c)h.featureName = c.toLowerCase();
                var f = h;
                f.elements = b(f.elements, /\s+/) || null;
                f.propertiesOnly = f.propertiesOnly || f.elements === true;
                var k = /\s*,\s*/, u = void 0;
                for (u in s) {
                    f[u] = b(f[u], k) || null;
                    var o = f, p = A[u], i = b(f[A[u]], k), l = f[u], w = [], m = true, q = void 0;
                    i ? m = false : i = {};
                    for (q in l)if (q.charAt(0) == "!") {
                        q = q.slice(1);
                        w.push(q);
                        i[q] = true;
                        m = false
                    }
                    for (; q = w.pop();) {
                        l[q] = l["!" + q];
                        delete l["!" + q]
                    }
                    o[p] = (m ? false : i) || null
                }
                f.match = f.match || null;
                this.allowedContent.push(h);
                d.push(h)
            }
            c =
                this._.rules;
            e = c.elements || {};
            a = c.generic || [];
            h = 0;
            for (f = d.length; h < f; ++h) {
                k = B(d[h]);
                u = k.classes === true || k.styles === true || k.attributes === true;
                o = k;
                p = void 0;
                for (p in s)o[p] = r(o[p]);
                i = true;
                for (p in A) {
                    p = A[p];
                    o[p] = CKEDITOR.tools.objectKeys(o[p]);
                    o[p] && (i = false)
                }
                o.nothingRequired = i;
                if (k.elements === true || k.elements === null) {
                    k.elements = r(k.elements);
                    a[u ? "unshift" : "push"](k)
                } else {
                    o = k.elements;
                    delete k.elements;
                    for (g in o)if (e[g])e[g][u ? "unshift" : "push"](k); else e[g] = [k]
                }
            }
            c.elements = e;
            c.generic = a.length ? a : null;
            return true
        }, applyTo: function (a, b, c) {
            var d = [], g = !c && this._.rules, e = this._.transformations, k = f(this), j = this.editor && this.editor.config.protectedSource, u = false;
            a.forEach(function (a) {
                if (a.type == CKEDITOR.NODE_ELEMENT) {
                    if (!b || !(a.name == "span" && ~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-")))k(a, g, e, d, b) && (u = true)
                } else if (a.type == CKEDITOR.NODE_COMMENT && a.value.match(/^\{cke_protected\}(?!\{C\})/)) {
                    var c;
                    a:{
                        var h = decodeURIComponent(a.value.replace(/^\{cke_protected\}/, ""));
                        c = [];
                        var f, o, p;
                        if (j)for (o = 0; o < j.length; ++o)if ((p = h.match(j[o])) && p[0].length == h.length) {
                            c = true;
                            break a
                        }
                        h = CKEDITOR.htmlParser.fragment.fromHtml(h);
                        h.children.length == 1 && (f = h.children[0]).type == CKEDITOR.NODE_ELEMENT && k(f, g, e, c, b);
                        c = !c.length
                    }
                    c || d.push(a)
                }
            }, null, true);
            d.length && (u = true);
            for (var o, p, a = [], c = ["p", "br", "div"][this.enterMode - 1]; o = d.pop();)o.type == CKEDITOR.NODE_ELEMENT ? h(o, c, a) : o.remove();
            for (; p = a.pop();) {
                o = p.el;
                if (o.parent)switch (p.check) {
                    case "it":
                        D.$removeEmpty[o.name] && !o.children.length ? h(o,
                            c, a) : n(o) || h(o, c, a);
                        break;
                    case "el-up":
                        o.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && !D[o.parent.name][o.name] && h(o, c, a);
                        break;
                    case "parent-down":
                        o.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && !D[o.parent.name][o.name] && h(o.parent, c, a)
                }
            }
            return u
        }, checkFeature: function (a) {
            if (this.disabled || !a)return true;
            a.toFeature && (a = a.toFeature(this.editor));
            return!a.requiredContent || this.check(a.requiredContent)
        }, disable: function () {
            this.disabled = true;
            this._.toHtmlListener && this._.toHtmlListener.removeListener();
            this._.toDataFormatListener && this._.toDataFormatListener.removeListener()
        }, addContentForms: function (a) {
            if (!this.disabled && a) {
                var b, c, d = [], h;
                for (b = 0; b < a.length && !h; ++b) {
                    c = a[b];
                    if ((typeof c == "string" || c instanceof CKEDITOR.style) && this.check(c))h = c
                }
                if (h) {
                    for (b = 0; b < a.length; ++b)d.push(k(a[b], h));
                    this.addTransformations(d)
                }
            }
        }, addFeature: function (a) {
            if (this.disabled || !a)return true;
            a.toFeature && (a = a.toFeature(this.editor));
            this.allow(a.allowedContent, a.name);
            this.addTransformations(a.contentTransformations);
            this.addContentForms(a.contentForms);
            return this.customConfig && a.requiredContent ? this.check(a.requiredContent) : true
        }, addTransformations: function (a) {
            var b, c;
            if (!this.disabled && a) {
                var d = this._.transformations, h;
                for (h = 0; h < a.length; ++h) {
                    b = a[h];
                    var g = void 0, e = void 0, f = void 0, k = void 0, o = void 0, j = void 0;
                    c = [];
                    for (e = 0; e < b.length; ++e) {
                        f = b[e];
                        if (typeof f == "string") {
                            f = f.split(/\s*:\s*/);
                            k = f[0];
                            o = null;
                            j = f[1]
                        } else {
                            k = f.check;
                            o = f.left;
                            j = f.right
                        }
                        if (!g) {
                            g = f;
                            g = g.element ? g.element : k ? k.match(/^([a-z0-9]+)/i)[0] : g.left.getDefinition().element
                        }
                        o instanceof
                            CKEDITOR.style && (o = t(o));
                        c.push({check: k == g ? null : k, left: o, right: typeof j == "string" ? F(j) : j})
                    }
                    b = g;
                    d[b] || (d[b] = []);
                    d[b].push(c)
                }
            }
        }, check: function (a, b, c) {
            if (this.disabled)return true;
            if (CKEDITOR.tools.isArray(a)) {
                for (var h = a.length; h--;)if (this.check(a[h], b, c))return true;
                return false
            }
            var g, e;
            if (typeof a == "string") {
                e = a + "<" + (b === false ? "0" : "1") + (c ? "1" : "0") + ">";
                if (e in this._.cachedChecks)return this._.cachedChecks[e];
                h = j(a).$1;
                g = h.styles;
                var k = h.classes;
                h.name = h.elements;
                h.classes = k = k ? k.split(/\s*,\s*/) :
                    [];
                h.styles = d(g);
                h.attributes = d(h.attributes);
                h.children = [];
                k.length && (h.attributes["class"] = k.join(" "));
                if (g)h.attributes.style = CKEDITOR.tools.writeCssText(h.styles);
                g = h
            } else {
                h = a.getDefinition();
                g = h.styles;
                k = h.attributes || {};
                if (g) {
                    g = B(g);
                    k.style = CKEDITOR.tools.writeCssText(g, true)
                } else g = {};
                g = {name: h.element, attributes: k, classes: k["class"] ? k["class"].split(/\s+/) : [], styles: g, children: []}
            }
            var k = CKEDITOR.tools.clone(g), o = [], p;
            if (b !== false && (p = this._.transformations[g.name])) {
                for (h = 0; h < p.length; ++h)u(this,
                    g, p[h]);
                m(g)
            }
            f(this)(k, this._.rules, b === false ? false : this._.transformations, o, false, !c, !c);
            b = o.length > 0 ? false : CKEDITOR.tools.objectCompare(g.attributes, k.attributes, true) ? true : false;
            typeof a == "string" && (this._.cachedChecks[e] = b);
            return b
        }};
        var s = {styles: 1, attributes: 1, classes: 1}, A = {styles: "requiredStyles", attributes: "requiredAttributes", classes: "requiredClasses"}, v = /^([a-z0-9*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i, o = {styles: /{([^}]+)}/, attrs: /\[([^\]]+)\]/,
            classes: /\(([^\)]+)\)/}, x = CKEDITOR.filter.transformationsTools = {sizeToStyle: function (a) {
            this.lengthToStyle(a, "width");
            this.lengthToStyle(a, "height")
        }, sizeToAttribute: function (a) {
            this.lengthToAttribute(a, "width");
            this.lengthToAttribute(a, "height")
        }, lengthToStyle: function (a, b, c) {
            c = c || b;
            if (!(c in a.styles)) {
                var d = a.attributes[b];
                if (d) {
                    /^\d+$/.test(d) && (d = d + "px");
                    a.styles[c] = d
                }
            }
            delete a.attributes[b]
        }, lengthToAttribute: function (a, b, c) {
            c = c || b;
            if (!(c in a.attributes)) {
                var d = a.styles[b], h = d && d.match(/^(\d+)(?:\.\d*)?px$/);
                h ? a.attributes[c] = h[1] : d == z && (a.attributes[c] = z)
            }
            delete a.styles[b]
        }, alignmentToStyle: function (a) {
            if (!("float"in a.styles)) {
                var b = a.attributes.align;
                if (b == "left" || b == "right")a.styles["float"] = b
            }
            delete a.attributes.align
        }, alignmentToAttribute: function (a) {
            if (!("align"in a.attributes)) {
                var b = a.styles["float"];
                if (b == "left" || b == "right")a.attributes.align = b
            }
            delete a.styles["float"]
        }, matchesStyle: w, transform: function (a, b) {
            if (typeof b == "string")a.name = b; else {
                var c = b.getDefinition(), d = c.styles, h = c.attributes,
                    g, e, k, f;
                a.name = c.element;
                for (g in h)if (g == "class") {
                    c = a.classes.join("|");
                    for (k = h[g].split(/\s+/); f = k.pop();)c.indexOf(f) == -1 && a.classes.push(f)
                } else a.attributes[g] = h[g];
                for (e in d)a.styles[e] = d[e]
            }
        }}
    })();
    (function () {
        CKEDITOR.focusManager = function (a) {
            if (a.focusManager)return a.focusManager;
            this.hasFocus = false;
            this.currentActive = null;
            this._ = {editor: a};
            return this
        };
        CKEDITOR.focusManager._ = {blurDelay: 200};
        CKEDITOR.focusManager.prototype = {focus: function () {
            this._.timer && clearTimeout(this._.timer);
            if (!this.hasFocus && !this._.locked) {
                var a = CKEDITOR.currentInstance;
                a && a.focusManager.blur(1);
                this.hasFocus = true;
                (a = this._.editor.container) && a.addClass("cke_focus");
                this._.editor.fire("focus")
            }
        }, lock: function () {
            this._.locked =
                1
        }, unlock: function () {
            delete this._.locked
        }, blur: function (a) {
            function c() {
                if (this.hasFocus) {
                    this.hasFocus = false;
                    var a = this._.editor.container;
                    a && a.removeClass("cke_focus");
                    this._.editor.fire("blur")
                }
            }

            if (!this._.locked) {
                this._.timer && clearTimeout(this._.timer);
                var b = CKEDITOR.focusManager._.blurDelay;
                a || !b ? c.call(this) : this._.timer = CKEDITOR.tools.setTimeout(function () {
                    delete this._.timer;
                    c.call(this)
                }, b, this)
            }
        }, add: function (a, c) {
            var b = a.getCustomData("focusmanager");
            if (!b || b != this) {
                b && b.remove(a);
                var b =
                    "focus", f = "blur";
                if (c)if (CKEDITOR.env.ie) {
                    b = "focusin";
                    f = "focusout"
                } else CKEDITOR.event.useCapture = 1;
                var e = {blur: function () {
                    a.equals(this.currentActive) && this.blur()
                }, focus: function () {
                    this.currentActive = a;
                    this.focus()
                }};
                a.on(b, e.focus, this);
                a.on(f, e.blur, this);
                if (c)CKEDITOR.event.useCapture = 0;
                a.setCustomData("focusmanager", this);
                a.setCustomData("focusmanager_handlers", e)
            }
        }, remove: function (a) {
            a.removeCustomData("focusmanager");
            var c = a.removeCustomData("focusmanager_handlers");
            a.removeListener("blur",
                c.blur);
            a.removeListener("focus", c.focus)
        }}
    })();
    CKEDITOR.keystrokeHandler = function (a) {
        if (a.keystrokeHandler)return a.keystrokeHandler;
        this.keystrokes = {};
        this.blockedKeystrokes = {};
        this._ = {editor: a};
        return this
    };
    (function () {
        var a, c = function (b) {
            var b = b.data, c = b.getKeystroke(), d = this.keystrokes[c], j = this._.editor;
            a = j.fire("key", {keyCode: c}) === false;
            if (!a) {
                d && (a = j.execCommand(d, {from: "keystrokeHandler"}) !== false);
                a || (a = !!this.blockedKeystrokes[c])
            }
            a && b.preventDefault(true);
            return!a
        }, b = function (b) {
            if (a) {
                a = false;
                b.data.preventDefault(true)
            }
        };
        CKEDITOR.keystrokeHandler.prototype = {attach: function (a) {
            a.on("keydown", c, this);
            if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac)a.on("keypress", b, this)
        }}
    })();
    (function () {
        CKEDITOR.lang = {languages: {af: 1, ar: 1, bg: 1, bn: 1, bs: 1, ca: 1, cs: 1, cy: 1, da: 1, de: 1, el: 1, "en-au": 1, "en-ca": 1, "en-gb": 1, en: 1, eo: 1, es: 1, et: 1, eu: 1, fa: 1, fi: 1, fo: 1, "fr-ca": 1, fr: 1, gl: 1, gu: 1, he: 1, hi: 1, hr: 1, hu: 1, is: 1, it: 1, ja: 1, ka: 1, km: 1, ko: 1, ku: 1, lt: 1, lv: 1, mk: 1, mn: 1, ms: 1, nb: 1, nl: 1, no: 1, pl: 1, "pt-br": 1, pt: 1, ro: 1, ru: 1, sk: 1, sl: 1, sq: 1, "sr-latn": 1, sr: 1, sv: 1, th: 1, tr: 1, ug: 1, uk: 1, vi: 1, "zh-cn": 1, zh: 1}, load: function (a, c, b) {
            if (!a || !CKEDITOR.lang.languages[a])a = this.detect(c, a);
            this[a] ? b(a, this[a]) : CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" +
                a + ".js"), function () {
                b(a, this[a])
            }, this)
        }, detect: function (a, c) {
            var b = this.languages, c = c || navigator.userLanguage || navigator.language || a, f = c.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/), e = f[1], f = f[2];
            b[e + "-" + f] ? e = e + "-" + f : b[e] || (e = null);
            CKEDITOR.lang.detect = e ? function () {
                return e
            } : function (a) {
                return a
            };
            return e || a
        }}
    })();
    CKEDITOR.scriptLoader = function () {
        var a = {}, c = {};
        return{load: function (b, f, e, d) {
            var j = typeof b == "string";
            j && (b = [b]);
            e || (e = CKEDITOR);
            var l = b.length, i = [], m = [], n = function (a) {
                f && (j ? f.call(e, a) : f.call(e, i, m))
            };
            if (l === 0)n(true); else {
                var r = function (a, b) {
                    (b ? i : m).push(a);
                    if (--l <= 0) {
                        d && CKEDITOR.document.getDocumentElement().removeStyle("cursor");
                        n(b)
                    }
                }, p = function (b, d) {
                    a[b] = 1;
                    var h = c[b];
                    delete c[b];
                    for (var g = 0; g < h.length; g++)h[g](b, d)
                }, g = function (b) {
                    if (a[b])r(b, true); else {
                        var d = c[b] || (c[b] = []);
                        d.push(r);
                        if (!(d.length >
                            1)) {
                            var h = new CKEDITOR.dom.element("script");
                            h.setAttributes({type: "text/javascript", src: b});
                            if (f)if (CKEDITOR.env.ie)h.$.onreadystatechange = function () {
                                if (h.$.readyState == "loaded" || h.$.readyState == "complete") {
                                    h.$.onreadystatechange = null;
                                    p(b, true)
                                }
                            }; else {
                                h.$.onload = function () {
                                    setTimeout(function () {
                                        p(b, true)
                                    }, 0)
                                };
                                h.$.onerror = function () {
                                    p(b, false)
                                }
                            }
                            h.appendTo(CKEDITOR.document.getHead())
                        }
                    }
                };
                d && CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
                for (var h = 0; h < l; h++)g(b[h])
            }
        }}
    }();
    CKEDITOR.resourceManager = function (a, c) {
        this.basePath = a;
        this.fileName = c;
        this.registered = {};
        this.loaded = {};
        this.externals = {};
        this._ = {waitingList: {}}
    };
    CKEDITOR.resourceManager.prototype = {add: function (a, c) {
        if (this.registered[a])throw'[CKEDITOR.resourceManager.add] The resource name "' + a + '" is already registered.';
        var b = this.registered[a] = c || {};
        b.name = a;
        b.path = this.getPath(a);
        CKEDITOR.fire(a + CKEDITOR.tools.capitalize(this.fileName) + "Ready", b);
        return this.get(a)
    }, get: function (a) {
        return this.registered[a] || null
    }, getPath: function (a) {
        var c = this.externals[a];
        return CKEDITOR.getUrl(c && c.dir || this.basePath + a + "/")
    }, getFilePath: function (a) {
        var c = this.externals[a];
        return CKEDITOR.getUrl(this.getPath(a) + (c && typeof c.file == "string" ? c.file : this.fileName + ".js"))
    }, addExternal: function (a, c, b) {
        for (var a = a.split(","), f = 0; f < a.length; f++)this.externals[a[f]] = {dir: c, file: b}
    }, load: function (a, c, b) {
        CKEDITOR.tools.isArray(a) || (a = a ? [a] : []);
        for (var f = this.loaded, e = this.registered, d = [], j = {}, l = {}, i = 0; i < a.length; i++) {
            var m = a[i];
            if (m)if (!f[m] && !e[m]) {
                var n = this.getFilePath(m);
                d.push(n);
                n in j || (j[n] = []);
                j[n].push(m)
            } else l[m] = this.get(m)
        }
        CKEDITOR.scriptLoader.load(d, function (a, d) {
            if (d.length)throw'[CKEDITOR.resourceManager.load] Resource name "' + j[d[0]].join(",") + '" was not found at "' + d[0] + '".';
            for (var g = 0; g < a.length; g++)for (var h = j[a[g]], e = 0; e < h.length; e++) {
                var i = h[e];
                l[i] = this.get(i);
                f[i] = 1
            }
            c.call(b, l)
        }, this)
    }};
    CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin");
    CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load, function (a) {
        var c = {};
        return function (b, f, e) {
            var d = {}, j = function (b) {
                a.call(this, b, function (a) {
                    CKEDITOR.tools.extend(d, a);
                    var b = [], l;
                    for (l in a) {
                        var r = a[l], p = r && r.requires;
                        if (!c[l]) {
                            if (r.icons)for (var g = r.icons.split(","), h = 0; h < g.length; h++)CKEDITOR.skin.addIcon(g[h], r.path + "icons/" + g[h] + ".png");
                            c[l] = 1
                        }
                        if (p) {
                            p.split && (p = p.split(","));
                            for (r = 0; r < p.length; r++)d[p[r]] || b.push(p[r])
                        }
                    }
                    if (b.length)j.call(this, b); else {
                        for (l in d) {
                            r = d[l];
                            if (r.onLoad && !r.onLoad._called) {
                                r.onLoad() === false && delete d[l];
                                r.onLoad._called = 1
                            }
                        }
                        f && f.call(e || window, d)
                    }
                }, this)
            };
            j.call(this, b)
        }
    });
    CKEDITOR.plugins.setLang = function (a, c, b) {
        var f = this.get(a), a = f.langEntries || (f.langEntries = {}), f = f.lang || (f.lang = []);
        f.split && (f = f.split(","));
        CKEDITOR.tools.indexOf(f, c) == -1 && f.push(c);
        a[c] = b
    };
    CKEDITOR.ui = function (a) {
        if (a.ui)return a.ui;
        this.items = {};
        this.instances = {};
        this.editor = a;
        this._ = {handlers: {}};
        return this
    };
    CKEDITOR.ui.prototype = {add: function (a, c, b) {
        b.name = a.toLowerCase();
        var f = this.items[a] = {type: c, command: b.command || null, args: Array.prototype.slice.call(arguments, 2)};
        CKEDITOR.tools.extend(f, b)
    }, get: function (a) {
        return this.instances[a]
    }, create: function (a) {
        var c = this.items[a], b = c && this._.handlers[c.type], f = c && c.command && this.editor.getCommand(c.command), b = b && b.create.apply(this, c.args);
        this.instances[a] = b;
        f && f.uiItems.push(b);
        if (b && !b.type)b.type = c.type;
        return b
    }, addHandler: function (a, c) {
        this._.handlers[a] =
            c
    }, space: function (a) {
        return CKEDITOR.document.getById(this.spaceId(a))
    }, spaceId: function (a) {
        return this.editor.id + "_" + a
    }};
    CKEDITOR.event.implementOn(CKEDITOR.ui);
    (function () {
        function a(a, d, g) {
            CKEDITOR.event.call(this);
            a = a && CKEDITOR.tools.clone(a);
            if (d !== void 0) {
                if (d instanceof CKEDITOR.dom.element) {
                    if (!g)throw Error("One of the element modes must be specified.");
                } else throw Error("Expect element of type CKEDITOR.dom.element.");
                if (CKEDITOR.env.ie && CKEDITOR.env.quirks && g == CKEDITOR.ELEMENT_MODE_INLINE)throw Error("Inline element mode is not supported on IE quirks.");
                if (g == CKEDITOR.ELEMENT_MODE_INLINE && !d.is(CKEDITOR.dtd.$editable) || g == CKEDITOR.ELEMENT_MODE_REPLACE &&
                    d.is(CKEDITOR.dtd.$nonBodyContent))throw Error('The specified element mode is not supported on element: "' + d.getName() + '".');
                this.element = d;
                this.elementMode = g;
                this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (d.getId() || d.getNameAtt())
            } else this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
            this._ = {};
            this.commands = {};
            this.templates = {};
            this.name = this.name || c();
            this.id = CKEDITOR.tools.getNextId();
            this.status = "unloaded";
            this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
            this.ui = new CKEDITOR.ui(this);
            this.focusManager = new CKEDITOR.focusManager(this);
            this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
            this.on("readOnly", b);
            this.on("selectionChange", e);
            this.on("mode", b);
            this.on("instanceReady", function () {
                this.config.startupFocus && this.focus()
            });
            CKEDITOR.fire("instanceCreated", null, this);
            CKEDITOR.add(this);
            CKEDITOR.tools.setTimeout(function () {
                j(this, a)
            }, 0, this)
        }

        function c() {
            do var a = "editor" + ++p; while (CKEDITOR.instances[a]);
            return a
        }

        function b() {
            var a = this.commands, b;
            for (b in a)f(this, a[b])
        }

        function f(a, b) {
            b[b.startDisabled ? "disable" : a.readOnly && !b.readOnly ? "disable" : b.modes[a.mode] ? "enable" : "disable"]()
        }

        function e(a) {
            var b = this.commands, c = a.editor, d = a.data.path, g;
            for (g in b) {
                a = b[g];
                a.contextSensitive && a.refresh(c, d)
            }
        }

        function d(a) {
            var b = a.config.customConfig;
            if (!b)return false;
            var b = CKEDITOR.getUrl(b), c = g[b] || (g[b] = {});
            if (c.fn) {
                c.fn.call(a, a.config);
                (CKEDITOR.getUrl(a.config.customConfig) == b || !d(a)) && a.fireOnce("customConfigLoaded")
            } else CKEDITOR.scriptLoader.load(b, function () {
                c.fn =
                    CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function () {
                    };
                d(a)
            });
            return true
        }

        function j(a, b) {
            a.on("customConfigLoaded", function () {
                if (b) {
                    if (b.on)for (var c in b.on)a.on(c, b.on[c]);
                    CKEDITOR.tools.extend(a.config, b, true);
                    delete a.config.on
                }
                a.readOnly = !(!a.config.readOnly && !(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.isReadOnly() : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && a.element.getAttribute("disabled")));
                a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && !CKEDITOR.dtd[a.element.getName()].p;
                a.tabIndex = a.config.tabIndex || a.element && a.element.getAttribute("tabindex") || 0;
                if (a.config.skin)CKEDITOR.skinName = a.config.skin;
                a.fireOnce("configLoaded");
                a.dataProcessor = new CKEDITOR.htmlDataProcessor(a);
                a.filter = new CKEDITOR.filter(a);
                l(a)
            });
            if (b && b.customConfig != void 0)a.config.customConfig = b.customConfig;
            d(a) || a.fireOnce("customConfigLoaded")
        }

        function l(a) {
            CKEDITOR.skin.loadPart("editor", function () {
                i(a)
            })
        }

        function i(a) {
            CKEDITOR.lang.load(a.config.language, a.config.defaultLanguage, function (b, c) {
                a.langCode =
                    b;
                a.lang = CKEDITOR.tools.prototypedCopy(c);
                if (CKEDITOR.env.gecko && CKEDITOR.env.version < 10900 && a.lang.dir == "rtl")a.lang.dir = "ltr";
                if (!a.config.contentsLangDirection)a.config.contentsLangDirection = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir;
                a.fire("langLoaded");
                m(a)
            })
        }

        function m(a) {
            a.getStylesSet(function (b) {
                a.once("loaded", function () {
                    a.fire("stylesSet", {styles: b})
                }, null, null, 1);
                n(a)
            })
        }

        function n(a) {
            var b = a.config, c = b.plugins, d = b.extraPlugins, g = b.removePlugins;
            if (d)var e =
                RegExp("(?:^|,)(?:" + d.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"), c = c.replace(e, ""), c = c + ("," + d);
            if (g)var f = RegExp("(?:^|,)(?:" + g.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"), c = c.replace(f, "");
            CKEDITOR.env.air && (c = c + ",adobeair");
            CKEDITOR.plugins.load(c.split(","), function (c) {
                var d = [], g = [], e = [];
                a.plugins = c;
                for (var k in c) {
                    var j = c[k], o = j.lang, p = null, i = j.requires, r;
                    CKEDITOR.tools.isArray(i) && (i = i.join(","));
                    if (i && (r = i.match(f)))for (; i = r.pop();)CKEDITOR.tools.setTimeout(function (a, b) {
                        throw Error('Plugin "' + a.replace(",",
                            "") + '" cannot be removed from the plugins list, because it\'s required by "' + b + '" plugin.');
                    }, 0, null, [i, k]);
                    if (o && !a.lang[k]) {
                        o.split && (o = o.split(","));
                        if (CKEDITOR.tools.indexOf(o, a.langCode) >= 0)p = a.langCode; else {
                            p = a.langCode.replace(/-.*/, "");
                            p = p != a.langCode && CKEDITOR.tools.indexOf(o, p) >= 0 ? p : CKEDITOR.tools.indexOf(o, "en") >= 0 ? "en" : o[0]
                        }
                        if (!j.langEntries || !j.langEntries[p])e.push(CKEDITOR.getUrl(j.path + "lang/" + p + ".js")); else {
                            a.lang[k] = j.langEntries[p];
                            p = null
                        }
                    }
                    g.push(p);
                    d.push(j)
                }
                CKEDITOR.scriptLoader.load(e,
                    function () {
                        for (var c = ["beforeInit", "init", "afterInit"], e = 0; e < c.length; e++)for (var k = 0; k < d.length; k++) {
                            var f = d[k];
                            e === 0 && (g[k] && f.lang && f.langEntries) && (a.lang[f.name] = f.langEntries[g[k]]);
                            if (f[c[e]])f[c[e]](a)
                        }
                        a.fireOnce("pluginsLoaded");
                        b.keystrokes && a.setKeystroke(a.config.keystrokes);
                        for (k = 0; k < a.config.blockedKeystrokes.length; k++)a.keystrokeHandler.blockedKeystrokes[a.config.blockedKeystrokes[k]] = 1;
                        a.status = "loaded";
                        a.fireOnce("loaded");
                        CKEDITOR.fire("instanceLoaded", null, a)
                    })
            })
        }

        function r() {
            var a =
                this.element;
            if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
                var b = this.getData();
                this.config.htmlEncodeOutput && (b = CKEDITOR.tools.htmlEncode(b));
                a.is("textarea") ? a.setValue(b) : a.setHtml(b);
                return true
            }
            return false
        }

        a.prototype = CKEDITOR.editor.prototype;
        CKEDITOR.editor = a;
        var p = 0, g = {};
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {addCommand: function (a, b) {
            b.name = a.toLowerCase();
            var c = new CKEDITOR.command(this, b);
            this.mode && f(this, c);
            return this.commands[a] = c
        }, destroy: function (a) {
            this.fire("beforeDestroy");
            !a && r.call(this);
            this.editable(null);
            this.status = "destroyed";
            this.fire("destroy");
            this.removeAllListeners();
            CKEDITOR.remove(this);
            CKEDITOR.fire("instanceDestroyed", null, this)
        }, elementPath: function (a) {
            return(a = a || this.getSelection().getStartElement()) ? new CKEDITOR.dom.elementPath(a, this.editable()) : null
        }, createRange: function () {
            var a = this.editable();
            return a ? new CKEDITOR.dom.range(a) : null
        }, execCommand: function (a, b) {
            var c = this.getCommand(a), d = {name: a, commandData: b, command: c};
            if (c && c.state != CKEDITOR.TRISTATE_DISABLED &&
                this.fire("beforeCommandExec", d) !== true) {
                d.returnValue = c.exec(d.commandData);
                if (!c.async && this.fire("afterCommandExec", d) !== true)return d.returnValue
            }
            return false
        }, getCommand: function (a) {
            return this.commands[a]
        }, getData: function (a) {
            !a && this.fire("beforeGetData");
            var b = this._.data;
            if (typeof b != "string")b = (b = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? b.is("textarea") ? b.getValue() : b.getHtml() : "";
            b = {dataValue: b};
            !a && this.fire("getData", b);
            return b.dataValue
        }, getSnapshot: function () {
            var a =
                this.fire("getSnapshot");
            if (typeof a != "string") {
                var b = this.element;
                b && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (a = b.is("textarea") ? b.getValue() : b.getHtml())
            }
            return a
        }, loadSnapshot: function (a) {
            this.fire("loadSnapshot", a)
        }, setData: function (a, b, c) {
            if (b)this.on("dataReady", function (a) {
                a.removeListener();
                b.call(a.editor)
            });
            a = {dataValue: a};
            !c && this.fire("setData", a);
            this._.data = a.dataValue;
            !c && this.fire("afterSetData", a)
        }, setReadOnly: function (a) {
            a = a == void 0 || a;
            if (this.readOnly != a) {
                this.readOnly =
                    a;
                this.editable().setReadOnly(a);
                this.fire("readOnly")
            }
        }, insertHtml: function (a, b) {
            this.fire("insertHtml", {dataValue: a, mode: b})
        }, insertText: function (a) {
            this.fire("insertText", a)
        }, insertElement: function (a) {
            this.fire("insertElement", a)
        }, focus: function () {
            this.fire("beforeFocus")
        }, checkDirty: function () {
            return this.status == "ready" && this._.previousValue !== this.getSnapshot()
        }, resetDirty: function () {
            this._.previousValue = this.getSnapshot()
        }, updateElement: function () {
            return r.call(this)
        }, setKeystroke: function () {
            for (var a =
                this.keystrokeHandler.keystrokes, b = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [[].slice.call(arguments, 0)], c, d, g = b.length; g--;) {
                c = b[g];
                d = 0;
                if (CKEDITOR.tools.isArray(c)) {
                    d = c[1];
                    c = c[0]
                }
                d ? a[c] = d : delete a[c]
            }
        }, addFeature: function (a) {
            return this.filter.addFeature(a)
        }})
    })();
    CKEDITOR.ELEMENT_MODE_NONE = 0;
    CKEDITOR.ELEMENT_MODE_REPLACE = 1;
    CKEDITOR.ELEMENT_MODE_APPENDTO = 2;
    CKEDITOR.ELEMENT_MODE_INLINE = 3;
    CKEDITOR.htmlParser = function () {
        this._ = {htmlPartsRegex: RegExp("<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)--\>)|(?:([^\\s>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'>])*)\\/?>))", "g")}
    };
    (function () {
        var a = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g, c = {checked: 1, compact: 1, declare: 1, defer: 1, disabled: 1, ismap: 1, multiple: 1, nohref: 1, noresize: 1, noshade: 1, nowrap: 1, readonly: 1, selected: 1};
        CKEDITOR.htmlParser.prototype = {onTagOpen: function () {
        }, onTagClose: function () {
        }, onText: function () {
        }, onCDATA: function () {
        }, onComment: function () {
        }, parse: function (b) {
            for (var f, e, d = 0, j; f = this._.htmlPartsRegex.exec(b);) {
                e = f.index;
                if (e > d) {
                    d = b.substring(d, e);
                    if (j)j.push(d); else this.onText(d)
                }
                d =
                    this._.htmlPartsRegex.lastIndex;
                if (e = f[1]) {
                    e = e.toLowerCase();
                    if (j && CKEDITOR.dtd.$cdata[e]) {
                        this.onCDATA(j.join(""));
                        j = null
                    }
                    if (!j) {
                        this.onTagClose(e);
                        continue
                    }
                }
                if (j)j.push(f[0]); else if (e = f[3]) {
                    e = e.toLowerCase();
                    if (!/="/.test(e)) {
                        var l = {}, i;
                        f = f[4];
                        var m = !!(f && f.charAt(f.length - 1) == "/");
                        if (f)for (; i = a.exec(f);) {
                            var n = i[1].toLowerCase();
                            i = i[2] || i[3] || i[4] || "";
                            l[n] = !i && c[n] ? n : i
                        }
                        this.onTagOpen(e, l, m);
                        !j && CKEDITOR.dtd.$cdata[e] && (j = [])
                    }
                } else if (e = f[2])this.onComment(e)
            }
            if (b.length > d)this.onText(b.substring(d,
                b.length))
        }}
    })();
    CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({$: function () {
        this._ = {output: []}
    }, proto: {openTag: function (a) {
        this._.output.push("<", a)
    }, openTagClose: function (a, c) {
        c ? this._.output.push(" />") : this._.output.push(">")
    }, attribute: function (a, c) {
        typeof c == "string" && (c = CKEDITOR.tools.htmlEncodeAttr(c));
        this._.output.push(" ", a, '="', c, '"')
    }, closeTag: function (a) {
        this._.output.push("</", a, ">")
    }, text: function (a) {
        this._.output.push(a)
    }, comment: function (a) {
        this._.output.push("<\!--", a, "--\>")
    }, write: function (a) {
        this._.output.push(a)
    },
        reset: function () {
            this._.output = [];
            this._.indent = false
        }, getHtml: function (a) {
            var c = this._.output.join("");
            a && this.reset();
            return c
        }}});
    "use strict";
    (function () {
        CKEDITOR.htmlParser.node = function () {
        };
        CKEDITOR.htmlParser.node.prototype = {remove: function () {
            var a = this.parent.children, c = CKEDITOR.tools.indexOf(a, this), b = this.previous, f = this.next;
            b && (b.next = f);
            f && (f.previous = b);
            a.splice(c, 1);
            this.parent = null
        }, replaceWith: function (a) {
            var c = this.parent.children, b = CKEDITOR.tools.indexOf(c, this), f = a.previous = this.previous, e = a.next = this.next;
            f && (f.next = a);
            e && (e.previous = a);
            c[b] = a;
            a.parent = this.parent;
            this.parent = null
        }, insertAfter: function (a) {
            var c = a.parent.children,
                b = CKEDITOR.tools.indexOf(c, a), f = a.next;
            c.splice(b + 1, 0, this);
            this.next = a.next;
            this.previous = a;
            a.next = this;
            f && (f.previous = this);
            this.parent = a.parent
        }, insertBefore: function (a) {
            var c = a.parent.children, b = CKEDITOR.tools.indexOf(c, a);
            c.splice(b, 0, this);
            this.next = a;
            (this.previous = a.previous) && (a.previous.next = this);
            a.previous = this;
            this.parent = a.parent
        }}
    })();
    "use strict";
    CKEDITOR.htmlParser.comment = function (a) {
        this.value = a;
        this._ = {isBlockLike: false}
    };
    CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {type: CKEDITOR.NODE_COMMENT, filter: function (a) {
        var c = this.value;
        if (!(c = a.onComment(c, this))) {
            this.remove();
            return false
        }
        if (typeof c != "string") {
            this.replaceWith(c);
            return false
        }
        this.value = c;
        return true
    }, writeHtml: function (a, c) {
        c && this.filter(c);
        a.comment(this.value)
    }});
    "use strict";
    (function () {
        CKEDITOR.htmlParser.text = function (a) {
            this.value = a;
            this._ = {isBlockLike: false}
        };
        CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {type: CKEDITOR.NODE_TEXT, filter: function (a) {
            if (!(this.value = a.onText(this.value, this))) {
                this.remove();
                return false
            }
        }, writeHtml: function (a, c) {
            c && this.filter(c);
            a.text(this.value)
        }})
    })();
    "use strict";
    (function () {
        CKEDITOR.htmlParser.cdata = function (a) {
            this.value = a
        };
        CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {type: CKEDITOR.NODE_TEXT, filter: function () {
        }, writeHtml: function (a) {
            a.write(this.value)
        }})
    })();
    "use strict";
    CKEDITOR.htmlParser.fragment = function () {
        this.children = [];
        this.parent = null;
        this._ = {isBlockLike: true, hasInlineStarted: false}
    };
    (function () {
        function a(a) {
            return a.name == "a" && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name]
        }

        var c = CKEDITOR.tools.extend({table: 1, ul: 1, ol: 1, dl: 1}, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl), b = {ol: 1, ul: 1}, f = CKEDITOR.tools.extend({}, {html: 1}, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {style: 1, script: 1});
        CKEDITOR.htmlParser.fragment.fromHtml = function (e, d, j) {
            function l(a) {
                var b;
                if (u.length > 0)for (var c = 0; c < u.length; c++) {
                    var d = u[c], g = d.name, e = CKEDITOR.dtd[g], h = k.name &&
                        CKEDITOR.dtd[k.name];
                    if ((!h || h[g]) && (!a || !e || e[a] || !CKEDITOR.dtd[a])) {
                        if (!b) {
                            i();
                            b = 1
                        }
                        d = d.clone();
                        d.parent = k;
                        k = d;
                        u.splice(c, 1);
                        c--
                    } else if (g == k.name) {
                        n(k, k.parent, 1);
                        c--
                    }
                }
            }

            function i() {
                for (; w.length;)n(w.shift(), k)
            }

            function m(a) {
                if (a._.isBlockLike && a.name != "pre" && a.name != "textarea") {
                    var b = a.children.length, c = a.children[b - 1], d;
                    if (c && c.type == CKEDITOR.NODE_TEXT)(d = CKEDITOR.tools.rtrim(c.value)) ? c.value = d : a.children.length = b - 1
                }
            }

            function n(b, c, d) {
                var c = c || k || h, e = k;
                if (b.previous === void 0) {
                    if (r(c, b)) {
                        k = c;
                        g.onTagOpen(j, {});
                        b.returnPoint = c = k
                    }
                    m(b);
                    (!a(b) || b.children.length) && c.add(b);
                    b.name == "pre" && (F = false);
                    b.name == "textarea" && (t = false)
                }
                if (b.returnPoint) {
                    k = b.returnPoint;
                    delete b.returnPoint
                } else k = d ? c : e
            }

            function r(a, b) {
                if ((a == h || a.name == "body") && j && (!a.name || CKEDITOR.dtd[a.name][j])) {
                    var c, d;
                    return(c = b.attributes && (d = b.attributes["data-cke-real-element-type"]) ? d : b.name) && c in CKEDITOR.dtd.$inline && !(c in CKEDITOR.dtd.head) && !b.isOrphan || b.type == CKEDITOR.NODE_TEXT
                }
            }

            function p(a, b) {
                return a in CKEDITOR.dtd.$listItem ||
                    a in CKEDITOR.dtd.$tableContent ? a == b || a == "dt" && b == "dd" || a == "dd" && b == "dt" : false
            }

            var g = new CKEDITOR.htmlParser, h = d instanceof CKEDITOR.htmlParser.element ? d : typeof d == "string" ? new CKEDITOR.htmlParser.element(d) : new CKEDITOR.htmlParser.fragment, u = [], w = [], k = h, t = h.name == "textarea", F = h.name == "pre";
            g.onTagOpen = function (d, e, h, j) {
                e = new CKEDITOR.htmlParser.element(d, e);
                if (e.isUnknown && h)e.isEmpty = true;
                e.isOptionalClose = j;
                if (a(e))u.push(e); else {
                    if (d == "pre")F = true; else {
                        if (d == "br" && F) {
                            k.add(new CKEDITOR.htmlParser.text("\n"));
                            return
                        }
                        d == "textarea" && (t = true)
                    }
                    if (d == "br")w.push(e); else {
                        for (; ;) {
                            j = (h = k.name) ? CKEDITOR.dtd[h] || (k._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : f;
                            if (!e.isUnknown && !k.isUnknown && !j[d])if (k.isOptionalClose)g.onTagClose(h); else if (d in b && h in b) {
                                h = k.children;
                                (h = h[h.length - 1]) && h.name == "li" || n(h = new CKEDITOR.htmlParser.element("li"), k);
                                !e.returnPoint && (e.returnPoint = k);
                                k = h
                            } else if (d in CKEDITOR.dtd.$listItem && !p(d, h))g.onTagOpen(d == "li" ? "ul" : "dl", {}, 0, 1); else if (h in c && !p(d, h)) {
                                !e.returnPoint &&
                                (e.returnPoint = k);
                                k = k.parent
                            } else {
                                h in CKEDITOR.dtd.$inline && u.unshift(k);
                                if (k.parent)n(k, k.parent, 1); else {
                                    e.isOrphan = 1;
                                    break
                                }
                            } else break
                        }
                        l(d);
                        i();
                        e.parent = k;
                        e.isEmpty ? n(e) : k = e
                    }
                }
            };
            g.onTagClose = function (a) {
                for (var b = u.length - 1; b >= 0; b--)if (a == u[b].name) {
                    u.splice(b, 1);
                    return
                }
                for (var c = [], d = [], g = k; g != h && g.name != a;) {
                    g._.isBlockLike || d.unshift(g);
                    c.push(g);
                    g = g.returnPoint || g.parent
                }
                if (g != h) {
                    for (b = 0; b < c.length; b++) {
                        var e = c[b];
                        n(e, e.parent)
                    }
                    k = g;
                    g._.isBlockLike && i();
                    n(g, g.parent);
                    if (g == k)k = k.parent;
                    u = u.concat(d)
                }
                a ==
                    "body" && (j = false)
            };
            g.onText = function (a) {
                if ((!k._.hasInlineStarted || w.length) && !F && !t) {
                    a = CKEDITOR.tools.ltrim(a);
                    if (a.length === 0)return
                }
                var d = k.name, e = d ? CKEDITOR.dtd[d] || (k._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : f;
                if (!t && !e["#"] && d in c) {
                    g.onTagOpen(d in b ? "li" : d == "dl" ? "dd" : d == "table" ? "tr" : d == "tr" ? "td" : "");
                    g.onText(a)
                } else {
                    i();
                    l();
                    !F && !t && (a = a.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " "));
                    a = new CKEDITOR.htmlParser.text(a);
                    if (r(k, a))this.onTagOpen(j, {}, 0, 1);
                    k.add(a)
                }
            };
            g.onCDATA = function (a) {
                k.add(new CKEDITOR.htmlParser.cdata(a))
            };
            g.onComment = function (a) {
                i();
                l();
                k.add(new CKEDITOR.htmlParser.comment(a))
            };
            g.parse(e);
            for (i(!CKEDITOR.env.ie && 1); k != h;)n(k, k.parent, 1);
            m(h);
            return h
        };
        CKEDITOR.htmlParser.fragment.prototype = {type: CKEDITOR.NODE_DOCUMENT_FRAGMENT, add: function (a, b) {
            isNaN(b) && (b = this.children.length);
            var c = b > 0 ? this.children[b - 1] : null;
            if (c) {
                if (a._.isBlockLike && c.type == CKEDITOR.NODE_TEXT) {
                    c.value = CKEDITOR.tools.rtrim(c.value);
                    if (c.value.length === 0) {
                        this.children.pop();
                        this.add(a);
                        return
                    }
                }
                c.next = a
            }
            a.previous = c;
            a.parent = this;
            this.children.splice(b, 0, a);
            if (!this._.hasInlineStarted)this._.hasInlineStarted = a.type == CKEDITOR.NODE_TEXT || a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike
        }, filter: function (a) {
            a.onRoot(this);
            this.filterChildren(a)
        }, filterChildren: function (a, b) {
            if (this.childrenFilteredBy != a.id) {
                if (b && !this.parent)a.onRoot(this);
                this.childrenFilteredBy = a.id;
                for (var c = 0; c < this.children.length; c++)this.children[c].filter(a) === false && c--
            }
        }, writeHtml: function (a, b) {
            b && this.filter(b);
            this.writeChildrenHtml(a)
        }, writeChildrenHtml: function (a, b, c) {
            if (c && !this.parent && b)b.onRoot(this);
            b && this.filterChildren(b);
            for (var b = 0, c = this.children, f = c.length; b < f; b++)c[b].writeHtml(a)
        }, forEach: function (a, b, c) {
            !c && (!b || this.type == b) && a(this);
            for (var c = this.children, f, i = 0, m = c.length; i < m; i++) {
                f = c[i];
                f.type == CKEDITOR.NODE_ELEMENT ? f.forEach(a, b) : (!b || f.type == b) && a(f)
            }
        }}
    })();
    (function () {
        function a(a, b) {
            for (var c = 0; a && c < b.length; c++)var e = b[c], a = a.replace(e[0], e[1]);
            return a
        }

        function c(a, b, c) {
            typeof b == "function" && (b = [b]);
            var e, f;
            f = a.length;
            var n = b && b.length;
            if (n) {
                for (e = 0; e < f && a[e].pri <= c; e++);
                for (f = n - 1; f >= 0; f--)if (n = b[f]) {
                    n.pri = c;
                    a.splice(e, 0, n)
                }
            }
        }

        function b(a, b, c) {
            if (b)for (var e in b) {
                var m = a[e];
                a[e] = f(m, b[e], c);
                m || a.$length++
            }
        }

        function f(a, b, f) {
            if (b) {
                b.pri = f;
                if (a) {
                    if (a.splice)c(a, b, f); else {
                        a = a.pri > f ? [b, a] : [a, b];
                        a.filter = e
                    }
                    return a
                }
                return b.filter = b
            }
        }

        function e(a) {
            for (var b =
                a.type || a instanceof CKEDITOR.htmlParser.fragment, c = 0; c < this.length; c++) {
                if (b)var e = a.type, f = a.name;
                var n = this[c].apply(window, arguments);
                if (n === false)return n;
                if (b) {
                    if (n && (n.name != f || n.type != e))return n
                } else if (typeof n != "string")return n;
                n != void 0 && (a = n)
            }
            return a
        }

        CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({$: function (a) {
            this.id = CKEDITOR.tools.getNextNumber();
            this._ = {elementNames: [], attributeNames: [], elements: {$length: 0}, attributes: {$length: 0}};
            a && this.addRules(a, 10)
        }, proto: {addRules: function (a, e) {
            typeof e != "number" && (e = 10);
            c(this._.elementNames, a.elementNames, e);
            c(this._.attributeNames, a.attributeNames, e);
            b(this._.elements, a.elements, e);
            b(this._.attributes, a.attributes, e);
            this._.text = f(this._.text, a.text, e) || this._.text;
            this._.comment = f(this._.comment, a.comment, e) || this._.comment;
            this._.root = f(this._.root, a.root, e) || this._.root
        }, applyTo: function (a) {
            a.filter(this)
        }, onElementName: function (b) {
            return a(b, this._.elementNames)
        }, onAttributeName: function (b) {
            return a(b, this._.attributeNames)
        }, onText: function (a) {
            var b =
                this._.text;
            return b ? b.filter(a) : a
        }, onComment: function (a, b) {
            var c = this._.comment;
            return c ? c.filter(a, b) : a
        }, onRoot: function (a) {
            var b = this._.root;
            return b ? b.filter(a) : a
        }, onElement: function (a) {
            for (var b = [this._.elements["^"], this._.elements[a.name], this._.elements.$], c, e = 0; e < 3; e++)if (c = b[e]) {
                c = c.filter(a, this);
                if (c === false)return null;
                if (c && c != a)return this.onNode(c);
                if (a.parent && !a.name)break
            }
            return a
        }, onNode: function (a) {
            var b = a.type;
            return b == CKEDITOR.NODE_ELEMENT ? this.onElement(a) : b == CKEDITOR.NODE_TEXT ?
                new CKEDITOR.htmlParser.text(this.onText(a.value)) : b == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(a.value)) : null
        }, onAttribute: function (a, b, c) {
            if (b = this._.attributes[b]) {
                a = b.filter(c, a, this);
                if (a === false)return false;
                if (typeof a != "undefined")return a
            }
            return c
        }}})
    })();
    (function () {
        function a(a, c) {
            function g(a) {
                return a || CKEDITOR.env.ie ? new CKEDITOR.htmlParser.text(" ") : new CKEDITOR.htmlParser.element("br", {"data-cke-bogus": 1})
            }

            function h(a, c) {
                return function (e) {
                    if (e.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var h = [], o = b(e), r, j;
                        if (o)for (k(o, 1) && h.push(o); o;) {
                            if (d(o) && (r = f(o)) && k(r))if ((j = f(r)) && !d(j))h.push(r); else {
                                var u = r, l = g(p), y = u.parent.children, m = CKEDITOR.tools.indexOf(y, u);
                                y.splice(m + 1, 0, l);
                                y = u.next;
                                u.next = l;
                                l.previous = u;
                                l.parent = u.parent;
                                l.next = y;
                                i(r)
                            }
                            o = o.previous
                        }
                        for (o =
                                 0; o < h.length; o++)i(h[o]);
                        if (h = CKEDITOR.env.opera && !a || (typeof c == "function" ? c(e) !== false : c))if (!p && CKEDITOR.env.ie && e.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)h = false; else if (!p && CKEDITOR.env.ie && (document.documentMode > 7 || e.name in CKEDITOR.dtd.tr || e.name in CKEDITOR.dtd.$listItem))h = false; else {
                            h = b(e);
                            h = !h || e.name == "form" && h.name == "input"
                        }
                        h && e.add(g(a))
                    }
                }
            }

            function k(a, b) {
                if ((!p || !CKEDITOR.env.ie) && a.type == CKEDITOR.NODE_ELEMENT && a.name == "br" && !a.attributes["data-cke-eol"])return true;
                var c;
                if (a.type ==
                    CKEDITOR.NODE_TEXT && (c = a.value.match(F))) {
                    if (c.index) {
                        j(a, new CKEDITOR.htmlParser.text(a.value.substring(0, c.index)));
                        a.value = c[0]
                    }
                    if (CKEDITOR.env.ie && p && (!b || a.parent.name in r))return true;
                    if (!p)if ((c = a.previous) && c.name == "br" || !c || d(c))return true
                }
                return false
            }

            var o = {elements: {}}, p = c == "html", r = CKEDITOR.tools.extend({}, z), u;
            for (u in r)"#"in B[u] || delete r[u];
            for (u in r)o.elements[u] = h(p, a.config.fillEmptyBlocks !== false);
            o.root = h(p);
            o.elements.br = function (a) {
                return function (b) {
                    if (b.parent.type !=
                        CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var c = b.attributes;
                        if ("data-cke-bogus"in c || "data-cke-eol"in c)delete c["data-cke-bogus"]; else {
                            for (c = b.next; c && e(c);)c = c.next;
                            var h = f(b);
                            !c && d(b.parent) ? l(b.parent, g(a)) : d(c) && (h && !d(h)) && j(c, g(a))
                        }
                    }
                }
            }(p);
            return o
        }

        function c(a) {
            return a.enterMode != CKEDITOR.ENTER_BR && a.autoParagraph !== false ? a.enterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : false
        }

        function b(a) {
            for (a = a.children[a.children.length - 1]; a && e(a);)a = a.previous;
            return a
        }

        function f(a) {
            for (a = a.previous; a && e(a);)a = a.previous;
            return a
        }

        function e(a) {
            return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT && a.attributes["data-cke-bookmark"]
        }

        function d(a) {
            return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in z || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)
        }

        function j(a, b) {
            var c = a.parent.children, g = CKEDITOR.tools.indexOf(c, a);
            c.splice(g, 0, b);
            c = a.previous;
            a.previous = b;
            b.next = a;
            b.parent = a.parent;
            if (c) {
                b.previous = c;
                c.next = b
            }
        }

        function l(a, b) {
            var c = a.children[a.children.length - 1];
            a.children.push(b);
            b.parent = a;
            if (c) {
                c.next = b;
                b.previous = c
            }
        }

        function i(a) {
            var b = a.parent.children, c = CKEDITOR.tools.indexOf(b, a), g = a.previous, a = a.next;
            g && (g.next = a);
            a && (a.previous = g);
            b.splice(c, 1)
        }

        function m(a) {
            var b = a.parent;
            return b ? CKEDITOR.tools.indexOf(b.children, a) : -1
        }

        function n(a) {
            a = a.attributes;
            a.contenteditable != "false" && (a["data-cke-editable"] = a.contenteditable ? "true" : 1);
            a.contenteditable = "false"
        }

        function r(a) {
            a = a.attributes;
            switch (a["data-cke-editable"]) {
                case "true":
                    a.contenteditable = "true";
                    break;
                case "1":
                    delete a.contenteditable
            }
        }

        function p(a) {
            return a.replace(o, function (a, b, c) {
                return"<" + b + c.replace(x, function (a, b) {
                    return!/^on/.test(b) && c.indexOf("data-cke-saved-" + b) == -1 ? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a : a
                }) + ">"
            })
        }

        function g(a, b) {
            return a.replace(b, function (a, b, c) {
                a.indexOf("<textarea") == 0 && (a = b + w(c).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</textarea>");
                return"<cke:encoded>" + encodeURIComponent(a) + "</cke:encoded>"
            })
        }

        function h(a) {
            return a.replace(C, function (a, b) {
                return decodeURIComponent(b)
            })
        }

        function u(a) {
            return a.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g,
                function (a) {
                    return"<\!--" + D + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "--\>"
                })
        }

        function w(a) {
            return a.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g, function (a, b) {
                return decodeURIComponent(b)
            })
        }

        function k(a, b) {
            var c = b._.dataStore;
            return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g,function (a, b) {
                return decodeURIComponent(b)
            }).replace(/\{cke_protected_(\d+)\}/g, function (a, b) {
                return c && c[b] || ""
            })
        }

        function t(a, b) {
            for (var c = [], g = b.config.protectedSource, d = b._.dataStore || (b._.dataStore =
            {id: 1}), e = /<\!--\{cke_temp(comment)?\}(\d*?)--\>/g, g = [/<script[\s\S]*?<\/script>/gi, /<noscript[\s\S]*?<\/noscript>/gi].concat(g), a = a.replace(/<\!--[\s\S]*?--\>/g, function (a) {
                return"<\!--{cke_tempcomment}" + (c.push(a) - 1) + "--\>"
            }), h = 0; h < g.length; h++)a = a.replace(g[h], function (a) {
                a = a.replace(e, function (a, b, g) {
                    return c[g]
                });
                return/cke_temp(comment)?/.test(a) ? a : "<\!--{cke_temp}" + (c.push(a) - 1) + "--\>"
            });
            a = a.replace(e, function (a, b, g) {
                return"<\!--" + D + (b ? "{C}" : "") + encodeURIComponent(c[g]).replace(/--/g, "%2D%2D") +
                    "--\>"
            });
            return a.replace(/(['"]).*?\1/g, function (a) {
                return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function (a, b) {
                    d[d.id] = decodeURIComponent(b);
                    return"{cke_protected_" + d.id++ + "}"
                })
            })
        }

        CKEDITOR.htmlDataProcessor = function (b) {
            var d, e, f = this;
            this.editor = b;
            this.dataFilter = d = new CKEDITOR.htmlParser.filter;
            this.htmlFilter = e = new CKEDITOR.htmlParser.filter;
            this.writer = new CKEDITOR.htmlParser.basicWriter;
            d.addRules(s);
            d.addRules(a(b, "data"));
            e.addRules(A);
            e.addRules(a(b, "html"));
            b.on("toHtml", function (a) {
                var a =
                    a.data, d = a.dataValue, d = t(d, b), d = g(d, G), d = p(d), d = g(d, I), d = d.replace(Q, "$1cke:$2"), d = d.replace(E, "<cke:$1$2></cke:$1>"), d = CKEDITOR.env.opera ? d : d.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2"), e = a.context || b.editable().getName(), f;
                if (CKEDITOR.env.ie && CKEDITOR.env.version < 9 && e == "pre") {
                    e = "div";
                    d = "<pre>" + d + "</pre>";
                    f = 1
                }
                e = b.document.createElement(e);
                e.setHtml("a" + d);
                d = e.getHtml().substr(1);
                d = d.replace(RegExp(" data-cke-" + CKEDITOR.rnd + "-", "ig"), " ");
                f && (d = d.replace(/^<pre>|<\/pre>$/gi, ""));
                d = d.replace(L, "$1$2");
                d = h(d);
                d = w(d);
                a.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(d, a.context, a.fixForBody === false ? false : c(b.config))
            }, null, null, 5);
            b.on("toHtml", function (a) {
                a.data.dataValue.filterChildren(f.dataFilter, true)
            }, null, null, 10);
            b.on("toHtml", function (a) {
                var a = a.data, b = a.dataValue, c = new CKEDITOR.htmlParser.basicWriter;
                b.writeChildrenHtml(c);
                b = c.getHtml(true);
                a.dataValue = u(b)
            }, null, null, 15);
            b.on("toDataFormat", function (a) {
                a.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(a.data.dataValue, b.editable().getName(),
                    c(b.config))
            }, null, null, 5);
            b.on("toDataFormat", function (a) {
                a.data.dataValue.filterChildren(f.htmlFilter, true)
            }, null, null, 10);
            b.on("toDataFormat", function (a) {
                var c = a.data.dataValue, g = f.writer;
                g.reset();
                c.writeChildrenHtml(g);
                c = g.getHtml(true);
                c = w(c);
                c = k(c, b);
                a.data.dataValue = c
            }, null, null, 15)
        };
        CKEDITOR.htmlDataProcessor.prototype = {toHtml: function (a, b, c, g) {
            var d = this.editor;
            !b && b !== null && (b = d.editable().getName());
            return d.fire("toHtml", {dataValue: a, context: b, fixForBody: c, dontFilter: !!g}).dataValue
        },
            toDataFormat: function (a) {
                return this.editor.fire("toDataFormat", {dataValue: a}).dataValue
            }};
        var F = /(?:&nbsp;|\xa0)$/, D = "{cke_protected}", B = CKEDITOR.dtd, q = ["caption", "colgroup", "col", "thead", "tfoot", "tbody"], z = CKEDITOR.tools.extend({}, B.$blockLimit, B.$block), s = {elements: {}, attributeNames: [
            [/^on/, "data-cke-pa-on"]
        ]}, A = {elementNames: [
            [/^cke:/, ""],
            [/^\?xml:namespace$/, ""]
        ], attributeNames: [
            [/^data-cke-(saved|pa)-/, ""],
            [/^data-cke-.*/, ""],
            ["hidefocus", ""]
        ], elements: {$: function (a) {
            var b = a.attributes;
            if (b) {
                if (b["data-cke-temp"])return false;
                for (var c = ["name", "href", "src"], g, d = 0; d < c.length; d++) {
                    g = "data-cke-saved-" + c[d];
                    g in b && delete b[c[d]]
                }
            }
            return a
        }, table: function (a) {
            a.children.slice(0).sort(function (a, b) {
                var c, g;
                if (a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type) {
                    c = CKEDITOR.tools.indexOf(q, a.name);
                    g = CKEDITOR.tools.indexOf(q, b.name)
                }
                if (!(c > -1 && g > -1 && c != g)) {
                    c = m(a);
                    g = m(b)
                }
                return c > g ? 1 : -1
            })
        }, embed: function (a) {
            var b = a.parent;
            if (b && b.name == "object") {
                var c = b.attributes.width, b = b.attributes.height;
                c && (a.attributes.width = c);
                b && (a.attributes.height =
                    b)
            }
        }, param: function (a) {
            a.children = [];
            a.isEmpty = true;
            return a
        }, a: function (a) {
            if (!a.children.length && !a.attributes.name && !a.attributes["data-cke-saved-name"])return false
        }, span: function (a) {
            a.attributes["class"] == "Apple-style-span" && delete a.name
        }, html: function (a) {
            delete a.attributes.contenteditable;
            delete a.attributes["class"]
        }, body: function (a) {
            delete a.attributes.spellcheck;
            delete a.attributes.contenteditable
        }, style: function (a) {
            var b = a.children[0];
            b && b.value && (b.value = CKEDITOR.tools.trim(b.value));
            if (!a.attributes.type)a.attributes.type = "text/css"
        }, title: function (a) {
            var b = a.children[0];
            !b && l(a, b = new CKEDITOR.htmlParser.text);
            b.value = a.attributes["data-cke-title"] || ""
        }}, attributes: {"class": function (a) {
            return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || false
        }}};
        if (CKEDITOR.env.ie)A.attributes.style = function (a) {
            return a.replace(/(^|;)([^\:]+)/g, function (a) {
                return a.toLowerCase()
            })
        };
        for (var v in{input: 1, textarea: 1}) {
            s.elements[v] = n;
            A.elements[v] = r
        }
        var o = /<(a|area|img|input|source)\b([^>]*)>/gi,
            x = /\b(on\w+|href|src|name)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi, I = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi, G = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi, C = /<cke:encoded>([^<]*)<\/cke:encoded>/gi, Q = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi, L = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi, E = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi
    })();
    "use strict";
    CKEDITOR.htmlParser.element = function (a, c) {
        this.name = a;
        this.attributes = c || {};
        this.children = [];
        var b = a || "", f = b.match(/^cke:(.*)/);
        f && (b = f[1]);
        b = !(!CKEDITOR.dtd.$nonBodyContent[b] && !CKEDITOR.dtd.$block[b] && !CKEDITOR.dtd.$listItem[b] && !CKEDITOR.dtd.$tableContent[b] && !(CKEDITOR.dtd.$nonEditable[b] || b == "br"));
        this.isEmpty = !!CKEDITOR.dtd.$empty[a];
        this.isUnknown = !CKEDITOR.dtd[a];
        this._ = {isBlockLike: b, hasInlineStarted: this.isEmpty || !b}
    };
    CKEDITOR.htmlParser.cssStyle = function (a) {
        var c = {};
        ((a instanceof CKEDITOR.htmlParser.element ? a.attributes.style : a) || "").replace(/&quot;/g, '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function (a, f, e) {
            f == "font-family" && (e = e.replace(/["']/g, ""));
            c[f.toLowerCase()] = e
        });
        return{rules: c, populate: function (a) {
            var c = this.toString();
            if (c)a instanceof CKEDITOR.dom.element ? a.setAttribute("style", c) : a instanceof CKEDITOR.htmlParser.element ? a.attributes.style = c : a.style = c
        }, toString: function () {
            var a = [], f;
            for (f in c)c[f] && a.push(f, ":", c[f], ";");
            return a.join("")
        }}
    };
    (function () {
        var a = function (a, c) {
            a = a[0];
            c = c[0];
            return a < c ? -1 : a > c ? 1 : 0
        }, c = CKEDITOR.htmlParser.fragment.prototype;
        CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {type: CKEDITOR.NODE_ELEMENT, add: c.add, clone: function () {
            return new CKEDITOR.htmlParser.element(this.name, this.attributes)
        }, filter: function (a) {
            var c = this, e, d;
            if (!c.parent)a.onRoot(c);
            for (; ;) {
                e = c.name;
                if (!(d = a.onElementName(e))) {
                    this.remove();
                    return false
                }
                c.name = d;
                if (!(c = a.onElement(c))) {
                    this.remove();
                    return false
                }
                if (c !==
                    this) {
                    this.replaceWith(c);
                    return false
                }
                if (c.name == e)break;
                if (c.type != CKEDITOR.NODE_ELEMENT) {
                    this.replaceWith(c);
                    return false
                }
                if (!c.name) {
                    this.replaceWithChildren();
                    return false
                }
            }
            e = c.attributes;
            var j, l;
            for (j in e) {
                l = j;
                for (d = e[j]; ;)if (l = a.onAttributeName(j))if (l != j) {
                    delete e[j];
                    j = l
                } else break; else {
                    delete e[j];
                    break
                }
                l && ((d = a.onAttribute(c, l, d)) === false ? delete e[l] : e[l] = d)
            }
            c.isEmpty || this.filterChildren(a);
            return true
        }, filterChildren: c.filterChildren, writeHtml: function (b, c) {
            c && this.filter(c);
            var e = this.name,
                d = [], j = this.attributes, l, i;
            b.openTag(e, j);
            for (l in j)d.push([l, j[l]]);
            b.sortAttributes && d.sort(a);
            l = 0;
            for (i = d.length; l < i; l++) {
                j = d[l];
                b.attribute(j[0], j[1])
            }
            b.openTagClose(e, this.isEmpty);
            this.writeChildrenHtml(b);
            this.isEmpty || b.closeTag(e)
        }, writeChildrenHtml: c.writeChildrenHtml, replaceWithChildren: function () {
            for (var a = this.children, c = a.length; c;)a[--c].insertAfter(this);
            this.remove()
        }, forEach: c.forEach})
    })();
    (function () {
        var a = {};
        CKEDITOR.template = function (c) {
            if (a[c])this.output = a[c]; else {
                var b = c.replace(/'/g, "\\'").replace(/{([^}]+)}/g, function (a, b) {
                    return"',data['" + b + "']==undefined?'{" + b + "}':data['" + b + "'],'"
                });
                this.output = a[c] = Function("data", "buffer", "return buffer?buffer.push('" + b + "'):['" + b + "'].join('');")
            }
        }
    })();
    delete CKEDITOR.loadFullCore;
    CKEDITOR.instances = {};
    CKEDITOR.document = new CKEDITOR.dom.document(document);
    CKEDITOR.add = function (a) {
        CKEDITOR.instances[a.name] = a;
        a.on("focus", function () {
            if (CKEDITOR.currentInstance != a) {
                CKEDITOR.currentInstance = a;
                CKEDITOR.fire("currentInstance")
            }
        });
        a.on("blur", function () {
            if (CKEDITOR.currentInstance == a) {
                CKEDITOR.currentInstance = null;
                CKEDITOR.fire("currentInstance")
            }
        });
        CKEDITOR.fire("instance", null, a)
    };
    CKEDITOR.remove = function (a) {
        delete CKEDITOR.instances[a.name]
    };
    (function () {
        var a = {};
        CKEDITOR.addTemplate = function (c, b) {
            var f = a[c];
            if (f)return f;
            f = {name: c, source: b};
            CKEDITOR.fire("template", f);
            return a[c] = new CKEDITOR.template(f.source)
        };
        CKEDITOR.getTemplate = function (c) {
            return a[c]
        }
    })();
    (function () {
        var a = [];
        CKEDITOR.addCss = function (c) {
            a.push(c)
        };
        CKEDITOR.getCss = function () {
            return a.join("\n")
        }
    })();
    CKEDITOR.on("instanceDestroyed", function () {
        CKEDITOR.tools.isEmpty(this.instances) && CKEDITOR.fire("reset")
    });
    CKEDITOR.TRISTATE_ON = 1;
    CKEDITOR.TRISTATE_OFF = 2;
    CKEDITOR.TRISTATE_DISABLED = 0;
    (function () {
        CKEDITOR.inline = function (a, c) {
            if (!CKEDITOR.env.isCompatible)return null;
            a = CKEDITOR.dom.element.get(a);
            if (a.getEditor())throw'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
            var b = new CKEDITOR.editor(c, a, CKEDITOR.ELEMENT_MODE_INLINE);
            b.setData(a.getHtml(), null, true);
            b.on("loaded", function () {
                b.fire("uiReady");
                b.editable(a);
                b.container = a;
                b.setData(b.getData(1));
                b.resetDirty();
                b.fire("contentDom");
                b.mode = "wysiwyg";
                b.fire("mode");
                b.status = "ready";
                b.fireOnce("instanceReady");
                CKEDITOR.fire("instanceReady", null, b)
            }, null, null, 1E4);
            b.on("destroy", function () {
                b.element.clearCustomData();
                delete b.element
            });
            return b
        };
        CKEDITOR.inlineAll = function () {
            var a, c, b;
            for (b in CKEDITOR.dtd.$editable)for (var f = CKEDITOR.document.getElementsByTag(b), e = 0, d = f.count(); e < d; e++) {
                a = f.getItem(e);
                if (a.getAttribute("contenteditable") == "true") {
                    c = {element: a, config: {}};
                    CKEDITOR.fire("inline", c) !== false && CKEDITOR.inline(a, c.config)
                }
            }
        };
        CKEDITOR.domReady(function () {
            !CKEDITOR.disableAutoInline &&
            CKEDITOR.inlineAll()
        })
    })();
    CKEDITOR.replaceClass = "ckeditor";
    (function () {
        function a(a, e, l, i) {
            if (!CKEDITOR.env.isCompatible)return null;
            a = CKEDITOR.dom.element.get(a);
            if (a.getEditor())throw'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
            var m = new CKEDITOR.editor(e, a, i);
            i == CKEDITOR.ELEMENT_MODE_REPLACE && a.setStyle("visibility", "hidden");
            l && m.setData(l, null, true);
            m.on("loaded", function () {
                b(m);
                i == CKEDITOR.ELEMENT_MODE_REPLACE && m.config.autoUpdateElement && f(m);
                m.setMode(m.config.startupMode, function () {
                    m.resetDirty();
                    m.status =
                        "ready";
                    m.fireOnce("instanceReady");
                    CKEDITOR.fire("instanceReady", null, m)
                })
            });
            m.on("destroy", c);
            return m
        }

        function c() {
            var a = this.container, b = this.element;
            if (a) {
                a.clearCustomData();
                a.remove()
            }
            if (b) {
                b.clearCustomData();
                this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && b.show();
                delete this.element
            }
        }

        function b(a) {
            var b = a.name, c = a.element, f = a.elementMode, m = a.fire("uiSpace", {space: "top", html: ""}).html, n = a.fire("uiSpace", {space: "bottom", html: ""}).html;
            e || (e = CKEDITOR.addTemplate("maincontainer", '<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' +
                CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" roles="application" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><{outerEl} class="cke_inner cke_reset" roles="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" roles="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>'));
            b = CKEDITOR.dom.element.createFromHtml(e.output({id: a.id, name: b, langDir: a.lang.dir, langCode: a.langCode, voiceLabel: a.lang.editor,
                topHtml: m ? '<span id="' + a.ui.spaceId("top") + '" class="cke_top cke_reset_all" roles="presentation" style="height:auto">' + m + "</span>" : "", contentId: a.ui.spaceId("contents"), bottomHtml: n ? '<span id="' + a.ui.spaceId("bottom") + '" class="cke_bottom cke_reset_all" roles="presentation">' + n + "</span>" : "", outerEl: CKEDITOR.env.ie ? "span" : "div"}));
            if (f == CKEDITOR.ELEMENT_MODE_REPLACE) {
                c.hide();
                b.insertAfter(c)
            } else c.append(b);
            a.container = b;
            m && a.ui.space("top").unselectable();
            n && a.ui.space("bottom").unselectable();
            c =
                a.config.width;
            f = a.config.height;
            c && b.setStyle("width", CKEDITOR.tools.cssLength(c));
            f && a.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(f));
            b.disableContextMenu();
            CKEDITOR.env.webkit && b.on("focus", function () {
                a.focus()
            });
            a.fireOnce("uiReady")
        }

        function f(a) {
            var b = a.element;
            if (a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && b.is("textarea")) {
                var c = b.$.form && new CKEDITOR.dom.element(b.$.form);
                if (c) {
                    var e = function () {
                        a.updateElement()
                    };
                    c.on("submit", e);
                    if (!c.$.submit.nodeName && !c.$.submit.length)c.$.submit =
                        CKEDITOR.tools.override(c.$.submit, function (b) {
                            return function () {
                                a.updateElement();
                                b.apply ? b.apply(this, arguments) : b()
                            }
                        });
                    a.on("destroy", function () {
                        c.removeListener("submit", e)
                    })
                }
            }
        }

        CKEDITOR.replace = function (b, c) {
            return a(b, c, null, CKEDITOR.ELEMENT_MODE_REPLACE)
        };
        CKEDITOR.appendTo = function (b, c, e) {
            return a(b, c, e, CKEDITOR.ELEMENT_MODE_APPENDTO)
        };
        CKEDITOR.replaceAll = function () {
            for (var a = document.getElementsByTagName("textarea"), b = 0; b < a.length; b++) {
                var c = null, e = a[b];
                if (e.name || e.id) {
                    if (typeof arguments[0] ==
                        "string") {
                        if (!RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(e.className))continue
                    } else if (typeof arguments[0] == "function") {
                        c = {};
                        if (arguments[0](e, c) === false)continue
                    }
                    this.replace(e, c)
                }
            }
        };
        CKEDITOR.editor.prototype.addMode = function (a, b) {
            (this._.modes || (this._.modes = {}))[a] = b
        };
        CKEDITOR.editor.prototype.setMode = function (a, b) {
            var c = this, e = this._.modes;
            if (!(a == c.mode || !e || !e[a])) {
                c.fire("beforeSetMode", a);
                if (c.mode) {
                    var f = c.checkDirty();
                    c._.previousMode = c.mode;
                    c.fire("beforeModeUnload");
                    c.editable(0);
                    c.ui.space("contents").setHtml("");
                    c.mode = ""
                }
                this._.modes[a](function () {
                    c.mode = a;
                    f !== void 0 && !f && c.resetDirty();
                    setTimeout(function () {
                        c.fire("mode");
                        b && b.call(c)
                    }, 0)
                })
            }
        };
        CKEDITOR.editor.prototype.resize = function (a, b, c, e) {
            var f = this.container, n = this.ui.space("contents"), r = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement, e = e ? f.getChild(1) : f;
            e.setSize("width", a, true);
            r && (r.style.width = "1%");
            n.setStyle("height", Math.max(b - (c ? 0 : (e.$.offsetHeight || 0) - (n.$.clientHeight || 0)), 0) +
                "px");
            r && (r.style.width = "100%");
            this.fire("resize")
        };
        CKEDITOR.editor.prototype.getResizable = function (a) {
            return a ? this.ui.space("contents") : this.container
        };
        var e;
        CKEDITOR.domReady(function () {
            CKEDITOR.replaceClass && CKEDITOR.replaceAll(CKEDITOR.replaceClass)
        })
    })();
    CKEDITOR.config.startupMode = "wysiwyg";
    (function () {
        function a(a) {
            var c = a.editor, g = c.editable(), d = a.data.path, e = d.blockLimit, f = a.data.selection.getRanges()[0], k = c.config.enterMode;
            if (CKEDITOR.env.gecko) {
                var i = d.block || d.blockLimit || d.root, j = i && i.getLast(b);
                i && (i.isBlockBoundary() && (!j || !(j.type == CKEDITOR.NODE_ELEMENT && j.isBlockBoundary())) && !i.is("pre") && !i.getBogus()) && i.appendBogus()
            }
            if (c.config.autoParagraph !== false && k != CKEDITOR.ENTER_BR && f.collapsed && g.equals(e) && !d.block) {
                g = f.clone();
                g.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                d = new CKEDITOR.dom.walker(g);
                d.guard = function (a) {
                    return!b(a) || a.type == CKEDITOR.NODE_COMMENT || a.isReadOnly()
                };
                if (!d.checkForward() || g.checkStartOfBlock() && g.checkEndOfBlock()) {
                    c = f.fixBlock(true, c.config.enterMode == CKEDITOR.ENTER_DIV ? "div" : "p");
                    if (CKEDITOR.env.ie)(c = c.getFirst(b)) && (c.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(c.getText()).match(/^(?:&nbsp;|\xa0)$/)) && c.remove();
                    f.select();
                    a.cancel()
                }
            }
        }

        function c(a) {
            var b = a.data.getTarget();
            if (b.is("input")) {
                b = b.getAttribute("type");
                (b == "submit" || b == "reset") && a.data.preventDefault()
            }
        }

        function b(a) {
            return i(a) && m(a)
        }

        function f(a, b) {
            return function (c) {
                var d = CKEDITOR.dom.element.get(c.data.$.toElement || c.data.$.fromElement || c.data.$.relatedTarget);
                (!d || !b.equals(d) && !b.contains(d)) && a.call(this, c)
            }
        }

        function e(a) {
            var c, g = a.getRanges()[0], a = a.root, d = g.startPath(), e = {table: 1, ul: 1, ol: 1, dl: 1}, f = CKEDITOR.dom.walker.bogus();
            if (d.contains(e)) {
                var k = g.clone();
                k.collapse(1);
                k.setStartAt(a, CKEDITOR.POSITION_AFTER_START);
                k = new CKEDITOR.dom.walker(k);
                d = function (a, g) {
                    return function (a, d) {
                        d && (a.type ==
                            CKEDITOR.NODE_ELEMENT && a.is(e)) && (c = a);
                        if (b(a) && !d && (!g || !f(a)))return false
                    }
                };
                k.guard = d(k);
                k.checkBackward();
                if (c) {
                    k = g.clone();
                    k.collapse();
                    k.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
                    k = new CKEDITOR.dom.walker(k);
                    k.guard = d(k, 1);
                    c = 0;
                    k.checkForward();
                    return c
                }
            }
            return null
        }

        function d(a) {
            a.editor.focus();
            a.editor.fire("saveSnapshot")
        }

        function j(a, b) {
            var c = a.editor;
            !b && c.getSelection().scrollIntoView();
            setTimeout(function () {
                c.fire("saveSnapshot")
            }, 0)
        }

        CKEDITOR.editable = CKEDITOR.tools.createClass({base: CKEDITOR.dom.element,
            $: function (a, b) {
                this.base(b.$ || b);
                this.editor = a;
                this.hasFocus = false;
                this.setup()
            }, proto: {focus: function () {
                this.$[CKEDITOR.env.ie && this.getDocument().equals(CKEDITOR.document) ? "setActive" : "focus"]();
                CKEDITOR.env.safari && !this.isInline() && (CKEDITOR.document.getActive().equals(this.getWindow().getFrame()) || this.getWindow().focus())
            }, on: function (a, b) {
                var c = Array.prototype.slice.call(arguments, 0);
                if (CKEDITOR.env.ie && /^focus|blur$/.exec(a)) {
                    a = a == "focus" ? "focusin" : "focusout";
                    b = f(b, this);
                    c[0] = a;
                    c[1] = b
                }
                return CKEDITOR.dom.element.prototype.on.apply(this,
                    c)
            }, attachListener: function (a, b, c, d, e, f) {
                !this._.listeners && (this._.listeners = []);
                var k = Array.prototype.slice.call(arguments, 1);
                this._.listeners.push(a.on.apply(a, k))
            }, clearListeners: function () {
                var a = this._.listeners;
                try {
                    for (; a.length;)a.pop().removeListener()
                } catch (b) {
                }
            }, restoreAttrs: function () {
                var a = this._.attrChanges, b, c;
                for (c in a)if (a.hasOwnProperty(c)) {
                    b = a[c];
                    b !== null ? this.setAttribute(c, b) : this.removeAttribute(c)
                }
            }, attachClass: function (a) {
                var b = this.getCustomData("classes");
                if (!this.hasClass(a)) {
                    !b &&
                    (b = []);
                    b.push(a);
                    this.setCustomData("classes", b);
                    this.addClass(a)
                }
            }, changeAttr: function (a, b) {
                var c = this.getAttribute(a);
                if (b !== c) {
                    !this._.attrChanges && (this._.attrChanges = {});
                    a in this._.attrChanges || (this._.attrChanges[a] = c);
                    this.setAttribute(a, b)
                }
            }, insertHtml: function (a, b) {
                d(this);
                n(this, b || "html", a)
            }, insertText: function (a) {
                d(this);
                var b = this.editor, c = b.getSelection().getStartElement().hasAscendant("pre", true) ? CKEDITOR.ENTER_BR : b.config.enterMode, b = c == CKEDITOR.ENTER_BR, e = CKEDITOR.tools, a = e.htmlEncode(a.replace(/\r\n/g,
                    "\n")), a = a.replace(/\t/g, "&nbsp;&nbsp; &nbsp;"), c = c == CKEDITOR.ENTER_P ? "p" : "div";
                if (!b) {
                    var f = /\n{2}/g;
                    if (f.test(a))var i = "<" + c + ">", k = "</" + c + ">", a = i + a.replace(f, function () {
                        return k + i
                    }) + k
                }
                a = a.replace(/\n/g, "<br>");
                b || (a = a.replace(RegExp("<br>(?=</" + c + ">)"), function (a) {
                    return e.repeat(a, 2)
                }));
                a = a.replace(/^ | $/g, "&nbsp;");
                a = a.replace(/(>|\s) /g,function (a, b) {
                    return b + "&nbsp;"
                }).replace(/ (?=<)/g, "&nbsp;");
                n(this, "text", a)
            }, insertElement: function (a) {
                d(this);
                for (var c = this.editor, g = c.config.enterMode,
                         e = c.getSelection(), f = e.getRanges(), i = a.getName(), k = CKEDITOR.dtd.$block[i], m, n, l, B = f.length - 1; B >= 0; B--) {
                    m = f[B];
                    if (!m.checkReadOnly()) {
                        m.deleteContents(1);
                        n = !B && a || a.clone(1);
                        var q, z;
                        if (k)for (; (q = m.getCommonAncestor(0, 1)) && (z = CKEDITOR.dtd[q.getName()]) && (!z || !z[i]);)if (q.getName()in CKEDITOR.dtd.span)m.splitElement(q); else if (m.checkStartOfBlock() && m.checkEndOfBlock()) {
                            m.setStartBefore(q);
                            m.collapse(true);
                            q.remove()
                        } else m.splitBlock(g == CKEDITOR.ENTER_DIV ? "div" : "p", c.editable());
                        m.insertNode(n);
                        l ||
                        (l = n)
                    }
                }
                if (l) {
                    m.moveToPosition(l, CKEDITOR.POSITION_AFTER_END);
                    if (k)if ((a = l.getNext(b)) && a.type == CKEDITOR.NODE_ELEMENT && a.is(CKEDITOR.dtd.$block))a.getDtd()["#"] ? m.moveToElementEditStart(a) : m.moveToElementEditEnd(l); else if (!a && g != CKEDITOR.ENTER_BR) {
                        a = m.fixBlock(true, g == CKEDITOR.ENTER_DIV ? "div" : "p");
                        m.moveToElementEditStart(a)
                    }
                }
                e.selectRanges([m]);
                j(this, CKEDITOR.env.opera)
            }, setData: function (a, b) {
                !b && this.editor.dataProcessor && (a = this.editor.dataProcessor.toHtml(a));
                this.setHtml(a);
                this.editor.fire("dataReady")
            },
                getData: function (a) {
                    var b = this.getHtml();
                    !a && this.editor.dataProcessor && (b = this.editor.dataProcessor.toDataFormat(b));
                    return b
                }, setReadOnly: function (a) {
                    this.setAttribute("contenteditable", !a)
                }, detach: function () {
                    this.removeClass("cke_editable");
                    var a = this.editor;
                    this._.detach();
                    delete a.document;
                    delete a.window
                }, isInline: function () {
                    return this.getDocument().equals(CKEDITOR.document)
                }, setup: function () {
                    var a = this.editor;
                    this.attachListener(a, "beforeGetData", function () {
                        var b = this.getData();
                        this.is("textarea") ||
                        a.config.ignoreEmptyParagraph !== false && (b = b.replace(l, function (a, b) {
                            return b
                        }));
                        a.setData(b, null, 1)
                    }, this);
                    this.attachListener(a, "getSnapshot", function (a) {
                        a.data = this.getData(1)
                    }, this);
                    this.attachListener(a, "afterSetData", function () {
                        this.setData(a.getData(1))
                    }, this);
                    this.attachListener(a, "loadSnapshot", function (a) {
                        this.setData(a.data, 1)
                    }, this);
                    this.attachListener(a, "beforeFocus", function () {
                        var b = a.getSelection();
                        (b = b && b.getNative()) && b.type == "Control" || this.focus()
                    }, this);
                    this.attachListener(a, "insertHtml",
                        function (a) {
                            this.insertHtml(a.data.dataValue, a.data.mode)
                        }, this);
                    this.attachListener(a, "insertElement", function (a) {
                        this.insertElement(a.data)
                    }, this);
                    this.attachListener(a, "insertText", function (a) {
                        this.insertText(a.data)
                    }, this);
                    this.setReadOnly(a.readOnly);
                    this.attachClass("cke_editable");
                    this.attachClass(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "cke_editable_inline" : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE || a.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ? "cke_editable_themed" : "");
                    this.attachClass("cke_contents_" +
                        a.config.contentsLangDirection);
                    a.keystrokeHandler.blockedKeystrokes[8] = a.readOnly;
                    a.keystrokeHandler.attach(this);
                    this.on("blur", function (a) {
                        CKEDITOR.env.opera && CKEDITOR.document.getActive().equals(this.isInline() ? this : this.getWindow().getFrame()) ? a.cancel() : this.hasFocus = false
                    }, null, null, -1);
                    this.on("focus", function () {
                        this.hasFocus = true
                    }, null, null, -1);
                    a.focusManager.add(this);
                    if (this.equals(CKEDITOR.document.getActive())) {
                        this.hasFocus = true;
                        a.once("contentDom", function () {
                            a.focusManager.focus()
                        })
                    }
                    this.isInline() &&
                    this.changeAttr("tabindex", a.tabIndex);
                    if (!this.is("textarea")) {
                        a.document = this.getDocument();
                        a.window = this.getWindow();
                        var b = a.document;
                        this.changeAttr("spellcheck", !a.config.disableNativeSpellChecker);
                        var g = a.config.contentsLangDirection;
                        this.getDirection(1) != g && this.changeAttr("dir", g);
                        var d = CKEDITOR.getCss();
                        if (d) {
                            g = b.getHead();
                            if (!g.getCustomData("stylesheet")) {
                                d = b.appendStyleText(d);
                                d = new CKEDITOR.dom.element(d.ownerNode || d.owningElement);
                                g.setCustomData("stylesheet", d);
                                d.data("cke-temp", 1)
                            }
                        }
                        g =
                            b.getCustomData("stylesheet_ref") || 0;
                        b.setCustomData("stylesheet_ref", g + 1);
                        this.setCustomData("cke_includeReadonly", !a.config.disableReadonlyStyling);
                        this.attachListener(this, "click", function (a) {
                            var a = a.data, b = a.getTarget();
                            b.is("a") && (a.$.button != 2 && b.isReadOnly()) && a.preventDefault()
                        });
                        this.attachListener(a, "key", function (b) {
                            if (a.readOnly)return true;
                            var c = b.data.keyCode, g;
                            if (c in{8: 1, 46: 1}) {
                                var d = a.getSelection(), b = d.getRanges()[0], h = b.startPath(), f, p, j, c = c == 8;
                                if (d = e(d)) {
                                    a.fire("saveSnapshot");
                                    b.moveToPosition(d, CKEDITOR.POSITION_BEFORE_START);
                                    d.remove();
                                    b.select();
                                    a.fire("saveSnapshot");
                                    g = 1
                                } else if (b.collapsed)if ((f = h.block) && b[c ? "checkStartOfBlock" : "checkEndOfBlock"]() && (j = f[c ? "getPrevious" : "getNext"](i)) && j.is("table")) {
                                    a.fire("saveSnapshot");
                                    b[c ? "checkEndOfBlock" : "checkStartOfBlock"]() && f.remove();
                                    b["moveToElementEdit" + (c ? "End" : "Start")](j);
                                    b.select();
                                    a.fire("saveSnapshot");
                                    g = 1
                                } else if (h.blockLimit && h.blockLimit.is("td") && (p = h.blockLimit.getAscendant("table")) && b.checkBoundaryOfElement(p,
                                    c ? CKEDITOR.START : CKEDITOR.END) && (j = p[c ? "getPrevious" : "getNext"](i))) {
                                    a.fire("saveSnapshot");
                                    b["moveToElementEdit" + (c ? "End" : "Start")](j);
                                    b.checkStartOfBlock() && b.checkEndOfBlock() ? j.remove() : b.select();
                                    a.fire("saveSnapshot");
                                    g = 1
                                } else if ((p = h.contains(["td", "th", "caption"])) && b.checkBoundaryOfElement(p, c ? CKEDITOR.START : CKEDITOR.END))g = 1
                            }
                            return!g
                        });
                        CKEDITOR.env.ie && this.attachListener(this, "click", c);
                        !CKEDITOR.env.ie && !CKEDITOR.env.opera && this.attachListener(this, "mousedown", function (b) {
                            var c = b.data.getTarget();
                            if (c.is("img", "hr", "input", "textarea", "select")) {
                                a.getSelection().selectElement(c);
                                c.is("input", "textarea", "select") && b.data.preventDefault()
                            }
                        });
                        CKEDITOR.env.gecko && this.attachListener(this, "mouseup", function (b) {
                            if (b.data.$.button == 2) {
                                b = b.data.getTarget();
                                if (!b.getOuterHtml().replace(l, "")) {
                                    var c = a.createRange();
                                    c.moveToElementEditStart(b);
                                    c.select(true)
                                }
                            }
                        });
                        if (CKEDITOR.env.webkit) {
                            this.attachListener(this, "click", function (a) {
                                a.data.getTarget().is("input", "select") && a.data.preventDefault()
                            });
                            this.attachListener(this,
                                "mouseup", function (a) {
                                    a.data.getTarget().is("input", "textarea") && a.data.preventDefault()
                                })
                        }
                    }
                }}, _: {detach: function () {
                this.editor.setData(this.editor.getData(), 0, 1);
                this.clearListeners();
                this.restoreAttrs();
                var a;
                if (a = this.removeCustomData("classes"))for (; a.length;)this.removeClass(a.pop());
                a = this.getDocument();
                var b = a.getHead();
                if (b.getCustomData("stylesheet")) {
                    var c = a.getCustomData("stylesheet_ref");
                    if (--c)a.setCustomData("stylesheet_ref", c); else {
                        a.removeCustomData("stylesheet_ref");
                        b.removeCustomData("stylesheet").remove()
                    }
                }
                delete this.editor
            }}});
        CKEDITOR.editor.prototype.editable = function (a) {
            var b = this._.editable;
            if (b && a)return 0;
            if (arguments.length)b = this._.editable = a ? a instanceof CKEDITOR.editable ? a : new CKEDITOR.editable(this, a) : (b && b.detach(), null);
            return b
        };
        var l = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi, i = CKEDITOR.dom.walker.whitespaces(true), m = CKEDITOR.dom.walker.bookmark(false, true);
        CKEDITOR.on("instanceLoaded", function (b) {
            var c = b.editor;
            c.on("insertElement",
                function (a) {
                    a = a.data;
                    if (a.type == CKEDITOR.NODE_ELEMENT && (a.is("input") || a.is("textarea"))) {
                        a.getAttribute("contentEditable") != "false" && a.data("cke-editable", a.hasAttribute("contenteditable") ? "true" : "1");
                        a.setAttribute("contentEditable", false)
                    }
                });
            c.on("selectionChange", function (b) {
                if (!c.readOnly) {
                    var d = c.getSelection();
                    if (d && !d.isLocked) {
                        d = c.checkDirty();
                        c.fire("lockSnapshot");
                        a(b);
                        c.fire("unlockSnapshot");
                        !d && c.resetDirty()
                    }
                }
            })
        });
        CKEDITOR.on("instanceCreated", function (a) {
            var b = a.editor;
            b.on("mode",
                function () {
                    var a = b.editable();
                    if (a && a.isInline()) {
                        var c = this.lang.editor + ", " + this.name;
                        a.changeAttr("roles", "textbox");
                        a.changeAttr("aria-label", c);
                        a.changeAttr("title", c);
                        if (c = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents")) {
                            var d = CKEDITOR.tools.getNextId(), e = CKEDITOR.dom.element.createFromHtml('<span id="' + d + '" class="cke_voice_label">' + this.lang.common.editorHelp + "</span>");
                            c.append(e);
                            a.changeAttr("aria-describedby", d)
                        }
                    }
                })
        });
        CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
        var n = function () {
            function a(b) {
                return b.type == CKEDITOR.NODE_ELEMENT
            }

            function c(b, d) {
                var g, e, h, f, o = [], i = d.range.startContainer;
                g = d.range.startPath();
                for (var i = k[i.getName()], j = 0, m = b.getChildren(), n = m.count(), l = -1, u = -1, t = 0, w = g.contains(k.$list); j < n; ++j) {
                    g = m.getItem(j);
                    if (a(g)) {
                        h = g.getName();
                        if (w && h in CKEDITOR.dtd.$list)o = o.concat(c(g, d)); else {
                            f = !!i[h];
                            if (h == "br" && g.data("cke-eol") && (!j || j == n - 1)) {
                                t = (e = j ? o[j - 1].node : m.getItem(j + 1)) && (!a(e) || !e.is("br"));
                                e = e && a(e) && k.$block[e.getName()]
                            }
                            l == -1 && !f && (l =
                                j);
                            f || (u = j);
                            o.push({isElement: 1, isLineBreak: t, isBlock: g.isBlockBoundary(), hasBlockSibling: e, node: g, name: h, allowed: f});
                            e = t = 0
                        }
                    } else o.push({isElement: 0, node: g, allowed: 1})
                }
                if (l > -1)o[l].firstNotAllowed = 1;
                if (u > -1)o[u].lastNotAllowed = 1;
                return o
            }

            function d(b, c) {
                var e = [], h = b.getChildren(), f = h.count(), i, o = 0, j = k[c], p = !b.is(k.$inline) || b.is("br");
                for (p && e.push(" "); o < f; o++) {
                    i = h.getItem(o);
                    a(i) && !i.is(j) ? e = e.concat(d(i, c)) : e.push(i)
                }
                p && e.push(" ");
                return e
            }

            function e(b) {
                return b && a(b) && (b.is(k.$removeEmpty) ||
                    b.is("a") && !b.isBlockBoundary())
            }

            function f(b, c, d, g) {
                var e = b.clone(), h, k;
                e.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
                if ((h = (new CKEDITOR.dom.walker(e)).next()) && a(h) && m[h.getName()] && (k = h.getPrevious()) && a(k) && !k.getParent().equals(b.startContainer) && d.contains(k) && g.contains(h) && h.isIdentical(k)) {
                    h.moveChildren(k);
                    h.remove();
                    f(b, c, d, g)
                }
            }

            function i(b, c) {
                function d(b, c) {
                    if (c.isBlock && c.isElement && !c.node.is("br") && a(b) && b.is("br")) {
                        b.remove();
                        return 1
                    }
                }

                var g = c.endContainer.getChild(c.endOffset), e = c.endContainer.getChild(c.endOffset -
                    1);
                g && d(g, b[b.length - 1]);
                if (e && d(e, b[0])) {
                    c.setEnd(c.endContainer, c.endOffset - 1);
                    c.collapse()
                }
            }

            var k = CKEDITOR.dtd, m = {p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, ul: 1, ol: 1, li: 1, pre: 1, dl: 1, blockquote: 1}, l = {p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1}, n = CKEDITOR.tools.extend({}, k.$inline);
            delete n.br;
            return function (m, q, t) {
                var s = m.editor;
                m.getDocument();
                var A = s.getSelection().getRanges()[0], v = false;
                if (q == "unfiltered_html") {
                    q = "html";
                    v = true
                }
                if (!A.checkReadOnly()) {
                    var o = (new CKEDITOR.dom.elementPath(A.startContainer,
                        A.root)).blockLimit || A.root, q = {type: q, dontFilter: v, editable: m, editor: s, range: A, blockLimit: o, mergeCandidates: [], zombies: []}, s = q.range, v = q.mergeCandidates, x, I, G, C;
                    if (q.type == "text" && s.shrink(CKEDITOR.SHRINK_ELEMENT, true, false)) {
                        x = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", s.document);
                        s.insertNode(x);
                        s.setStartAfter(x)
                    }
                    I = new CKEDITOR.dom.elementPath(s.startContainer);
                    q.endPath = G = new CKEDITOR.dom.elementPath(s.endContainer);
                    if (!s.collapsed) {
                        var o = G.block || G.blockLimit, Q = s.getCommonAncestor();
                        o && (!o.equals(Q) && !o.contains(Q) && s.checkEndOfBlock()) && q.zombies.push(o);
                        s.deleteContents()
                    }
                    for (; (C = a(s.startContainer) && s.startContainer.getChild(s.startOffset - 1)) && a(C) && C.isBlockBoundary() && I.contains(C);)s.moveToPosition(C, CKEDITOR.POSITION_BEFORE_END);
                    f(s, q.blockLimit, I, G);
                    if (x) {
                        s.setEndBefore(x);
                        s.collapse();
                        x.remove()
                    }
                    x = s.startPath();
                    if (o = x.contains(e, false, 1)) {
                        s.splitElement(o);
                        q.inlineStylesRoot = o;
                        q.inlineStylesPeak = x.lastElement
                    }
                    x = s.createBookmark();
                    (o = x.startNode.getPrevious(b)) && a(o) &&
                        e(o) && v.push(o);
                    (o = x.startNode.getNext(b)) && a(o) && e(o) && v.push(o);
                    for (o = x.startNode; (o = o.getParent()) && e(o);)v.push(o);
                    s.moveToBookmark(x);
                    if (t) {
                        C = t;
                        t = q.range;
                        if (q.type == "text" && q.inlineStylesRoot) {
                            x = C;
                            C = q.inlineStylesPeak;
                            s = C.getDocument().createText("{cke-peak}");
                            for (v = q.inlineStylesRoot.getParent(); !C.equals(v);) {
                                s = s.appendTo(C.clone());
                                C = C.getParent()
                            }
                            C = s.getOuterHtml().replace("{cke-peak}", x)
                        }
                        x = q.blockLimit.getName();
                        if (/^\s+|\s+$/.test(C) && "span"in CKEDITOR.dtd[x]) {
                            var L = '<span data-cke-marker="1">&nbsp;</span>';
                            C = L + C + L
                        }
                        C = q.editor.dataProcessor.toHtml(C, null, false, q.dontFilter);
                        x = t.document.createElement("body");
                        x.setHtml(C);
                        if (L) {
                            x.getFirst().remove();
                            x.getLast().remove()
                        }
                        if ((L = t.startPath().block) && !(L.getChildCount() == 1 && L.getBogus()))a:{
                            var E;
                            if (x.getChildCount() == 1 && a(E = x.getFirst()) && E.is(l)) {
                                L = E.getElementsByTag("*");
                                t = 0;
                                for (s = L.count(); t < s; t++) {
                                    C = L.getItem(t);
                                    if (!C.is(n))break a
                                }
                                E.moveChildren(E.getParent(1));
                                E.remove()
                            }
                        }
                        q.dataWrapper = x;
                        E = q.range;
                        var L = E.document, y, t = q.blockLimit;
                        x = 0;
                        var J;
                        C = [];
                        var H,
                            N, v = s = 0, K, O;
                        I = E.startContainer;
                        var o = q.endPath.elements[0], P;
                        G = o.getPosition(I);
                        Q = !!o.getCommonAncestor(I) && G != CKEDITOR.POSITION_IDENTICAL && !(G & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED);
                        I = c(q.dataWrapper, q);
                        for (i(I, E); x < I.length; x++) {
                            G = I[x];
                            if (y = G.isLineBreak) {
                                y = E;
                                K = t;
                                var M = void 0, R = void 0;
                                if (G.hasBlockSibling)y = 1; else {
                                    M = y.startContainer.getAscendant(k.$block, 1);
                                    if (!M || !M.is({div: 1, p: 1}))y = 0; else {
                                        R = M.getPosition(K);
                                        if (R == CKEDITOR.POSITION_IDENTICAL || R == CKEDITOR.POSITION_CONTAINS)y =
                                            0; else {
                                            K = y.splitElement(M);
                                            y.moveToPosition(K, CKEDITOR.POSITION_AFTER_START);
                                            y = 1
                                        }
                                    }
                                }
                            }
                            if (y)v = x > 0; else {
                                y = E.startPath();
                                if (!G.isBlock && (N = q.editor.config.enterMode != CKEDITOR.ENTER_BR && q.editor.config.autoParagraph !== false ? q.editor.config.enterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : false) && !y.block && y.blockLimit && y.blockLimit.equals(E.root)) {
                                    N = L.createElement(N);
                                    !CKEDITOR.env.ie && N.appendBogus();
                                    E.insertNode(N);
                                    !CKEDITOR.env.ie && (J = N.getBogus()) && J.remove();
                                    E.moveToPosition(N, CKEDITOR.POSITION_BEFORE_END)
                                }
                                if ((y =
                                    E.startPath().block) && !y.equals(H)) {
                                    if (J = y.getBogus()) {
                                        J.remove();
                                        C.push(y)
                                    }
                                    H = y
                                }
                                G.firstNotAllowed && (s = 1);
                                if (s && G.isElement) {
                                    y = E.startContainer;
                                    for (K = null; y && !k[y.getName()][G.name];) {
                                        if (y.equals(t)) {
                                            y = null;
                                            break
                                        }
                                        K = y;
                                        y = y.getParent()
                                    }
                                    if (y) {
                                        if (K) {
                                            O = E.splitElement(K);
                                            q.zombies.push(O);
                                            q.zombies.push(K)
                                        }
                                    } else {
                                        K = t.getName();
                                        P = !x;
                                        y = x == I.length - 1;
                                        K = d(G.node, K);
                                        for (var M = [], R = K.length, T = 0, U = void 0, V = 0, W = -1; T < R; T++) {
                                            U = K[T];
                                            if (U == " ") {
                                                if (!V && (!P || T)) {
                                                    M.push(new CKEDITOR.dom.text(" "));
                                                    W = M.length
                                                }
                                                V = 1
                                            } else {
                                                M.push(U);
                                                V = 0
                                            }
                                        }
                                        y && W == M.length && M.pop();
                                        P = M
                                    }
                                }
                                if (P) {
                                    for (; y = P.pop();)E.insertNode(y);
                                    P = 0
                                } else E.insertNode(G.node);
                                if (G.lastNotAllowed && x < I.length - 1) {
                                    (O = Q ? o : O) && E.setEndAt(O, CKEDITOR.POSITION_AFTER_START);
                                    s = 0
                                }
                                E.collapse()
                            }
                        }
                        q.dontMoveCaret = v;
                        q.bogusNeededBlocks = C
                    }
                    J = q.range;
                    var S;
                    O = q.bogusNeededBlocks;
                    for (P = J.createBookmark(); H = q.zombies.pop();)if (H.getParent()) {
                        N = J.clone();
                        N.moveToElementEditStart(H);
                        N.removeEmptyBlocksAtEnd()
                    }
                    if (O)for (; H = O.pop();)H.append(CKEDITOR.env.ie ? J.document.createText(" ") : J.document.createElement("br"));
                    for (; H = q.mergeCandidates.pop();)H.mergeSiblings();
                    J.moveToBookmark(P);
                    if (!q.dontMoveCaret) {
                        for (H = a(J.startContainer) && J.startContainer.getChild(J.startOffset - 1); H && a(H) && !H.is(k.$empty);) {
                            if (H.isBlockBoundary())J.moveToPosition(H, CKEDITOR.POSITION_BEFORE_END); else {
                                if (e(H) && H.getHtml().match(/(\s|&nbsp;)$/g)) {
                                    S = null;
                                    break
                                }
                                S = J.clone();
                                S.moveToPosition(H, CKEDITOR.POSITION_BEFORE_END)
                            }
                            H = H.getLast(b)
                        }
                        S && J.moveToRange(S)
                    }
                    A.select();
                    j(m)
                }
            }
        }()
    })();
    (function () {
        function a() {
            var a = this.getSelection(1);
            if (a.getType() != CKEDITOR.SELECTION_NONE) {
                this.fire("selectionCheck", a);
                var b = this.elementPath();
                if (!b.compare(this._.selectionPreviousPath)) {
                    this._.selectionPreviousPath = b;
                    this.fire("selectionChange", {selection: a, path: b})
                }
            }
        }

        function c() {
            i = true;
            if (!l) {
                b.call(this);
                l = CKEDITOR.tools.setTimeout(b, 200, this)
            }
        }

        function b() {
            l = null;
            if (i) {
                CKEDITOR.tools.setTimeout(a, 0, this);
                i = false
            }
        }

        function f(a) {
            function b(c, d) {
                return!c || c.type == CKEDITOR.NODE_TEXT ? false :
                    a.clone()["moveToElementEdit" + (d ? "End" : "Start")](c)
            }

            if (!(a.root instanceof CKEDITOR.editable))return false;
            var c = a.startContainer, d = a.getPreviousNode(m, null, c), e = a.getNextNode(m, null, c);
            return b(d) || b(e, 1) || !d && !e && !(c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary() && c.getBogus()) ? true : false
        }

        function e(a) {
            return a.getCustomData("cke-fillingChar")
        }

        function d(a, b) {
            var c = a && a.removeCustomData("cke-fillingChar");
            if (c) {
                if (b !== false) {
                    var d, e = a.getDocument().getSelection().getNative(), f = e && e.type != "None" &&
                        e.getRangeAt(0);
                    if (c.getLength() > 1 && f && f.intersectsNode(c.$)) {
                        d = [e.anchorOffset, e.focusOffset];
                        f = e.focusNode == c.$ && e.focusOffset > 0;
                        e.anchorNode == c.$ && e.anchorOffset > 0 && d[0]--;
                        f && d[1]--;
                        var i;
                        f = e;
                        if (!f.isCollapsed) {
                            i = f.getRangeAt(0);
                            i.setStart(f.anchorNode, f.anchorOffset);
                            i.setEnd(f.focusNode, f.focusOffset);
                            i = i.collapsed
                        }
                        i && d.unshift(d.pop())
                    }
                }
                c.setText(j(c.getText()));
                if (d) {
                    c = e.getRangeAt(0);
                    c.setStart(c.startContainer, d[0]);
                    c.setEnd(c.startContainer, d[1]);
                    e.removeAllRanges();
                    e.addRange(c)
                }
            }
        }

        function j(a) {
            return a.replace(/\u200B( )?/g,
                function (a) {
                    return a[1] ? " " : ""
                })
        }

        var l, i, m = CKEDITOR.dom.walker.invisible(1);
        CKEDITOR.on("instanceCreated", function (b) {
            function g() {
                var a = e.getSelection();
                a && a.removeAllRanges()
            }

            var e = b.editor;
            e.define("selectionChange", {errorProof: 1});
            e.on("contentDom", function () {
                var b = e.document, g = CKEDITOR.document, f = e.editable(), i = b.getBody(), j = b.getDocumentElement(), p = f.isInline(), m;
                CKEDITOR.env.gecko && f.attachListener(f, "focus", function (a) {
                    a.removeListener();
                    if (m !== 0) {
                        a = e.getSelection().getNative();
                        if (a.isCollapsed &&
                            a.anchorNode == f.$) {
                            a = e.createRange();
                            a.moveToElementEditStart(f);
                            a.select()
                        }
                    }
                }, null, null, -2);
                f.attachListener(f, "focus", function () {
                    e.unlockSelection(m);
                    m = 0
                }, null, null, -1);
                f.attachListener(f, "mousedown", function () {
                    m = 0
                });
                if (CKEDITOR.env.ie || CKEDITOR.env.opera || p) {
                    var l, r = function () {
                        l = e.getSelection(1);
                        l.lock()
                    };
                    n ? f.attachListener(f, "beforedeactivate", r, null, null, -1) : f.attachListener(e, "selectionCheck", r, null, null, -1);
                    f.attachListener(f, "blur", function () {
                        e.lockSelection(l);
                        m = 1
                    }, null, null, -1)
                }
                if (CKEDITOR.env.ie && !p) {
                    var s;
                    f.attachListener(f, "mousedown", function (a) {
                        a.data.$.button == 2 && e.document.$.selection.type == "None" && (s = e.window.getScrollPosition())
                    });
                    f.attachListener(f, "mouseup", function (a) {
                        if (a.data.$.button == 2 && s) {
                            e.document.$.documentElement.scrollLeft = s.x;
                            e.document.$.documentElement.scrollTop = s.y
                        }
                        s = null
                    });
                    if (b.$.compatMode != "BackCompat") {
                        if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat)j.on("mousedown", function (a) {
                            function b(a) {
                                a = a.data.$;
                                if (d) {
                                    var c = i.$.createTextRange();
                                    try {
                                        c.moveToPoint(a.x,
                                            a.y)
                                    } catch (e) {
                                    }
                                    d.setEndPoint(f.compareEndPoints("StartToStart", c) < 0 ? "EndToEnd" : "StartToStart", c);
                                    d.select()
                                }
                            }

                            function c() {
                                j.removeListener("mousemove", b);
                                g.removeListener("mouseup", c);
                                j.removeListener("mouseup", c);
                                d.select()
                            }

                            a = a.data;
                            if (a.getTarget().is("html") && a.$.y < j.$.clientHeight && a.$.x < j.$.clientWidth) {
                                var d = i.$.createTextRange();
                                try {
                                    d.moveToPoint(a.$.x, a.$.y)
                                } catch (e) {
                                }
                                var f = d.duplicate();
                                j.on("mousemove", b);
                                g.on("mouseup", c);
                                j.on("mouseup", c)
                            }
                        });
                        if (CKEDITOR.env.version > 7) {
                            j.on("mousedown",
                                function (a) {
                                    if (a.data.getTarget().is("html")) {
                                        g.on("mouseup", A);
                                        j.on("mouseup", A)
                                    }
                                });
                            var A = function () {
                                g.removeListener("mouseup", A);
                                j.removeListener("mouseup", A);
                                var a = CKEDITOR.document.$.selection, c = a.createRange();
                                a.type != "None" && c.parentElement().ownerDocument == b.$ && c.select()
                            }
                        }
                    }
                }
                f.attachListener(f, "selectionchange", a, e);
                f.attachListener(f, "keyup", c, e);
                f.attachListener(f, "focus", function () {
                    e.forceNextSelectionCheck();
                    e.selectionChange(1)
                });
                if (p ? CKEDITOR.env.webkit || CKEDITOR.env.gecko : CKEDITOR.env.opera) {
                    var v;
                    f.attachListener(f, "mousedown", function () {
                        v = 1
                    });
                    f.attachListener(b.getDocumentElement(), "mouseup", function () {
                        v && c.call(e);
                        v = 0
                    })
                } else f.attachListener(CKEDITOR.env.ie ? f : b.getDocumentElement(), "mouseup", c, e);
                CKEDITOR.env.webkit && f.attachListener(b, "keydown", function (a) {
                    switch (a.data.getKey()) {
                        case 13:
                        case 33:
                        case 34:
                        case 35:
                        case 36:
                        case 37:
                        case 39:
                        case 8:
                        case 45:
                        case 46:
                            d(f)
                    }
                }, null, null, -1)
            });
            e.on("contentDomUnload", e.forceNextSelectionCheck, e);
            e.on("dataReady", function () {
                e.selectionChange(1)
            });
            CKEDITOR.env.ie9Compat &&
            e.on("beforeDestroy", g, null, null, 9);
            CKEDITOR.env.webkit && e.on("setData", g);
            e.on("contentDomUnload", function () {
                e.unlockSelection()
            })
        });
        CKEDITOR.on("instanceReady", function (a) {
            var b = a.editor;
            if (CKEDITOR.env.webkit) {
                b.on("selectionChange", function () {
                    var a = b.editable(), c = e(a);
                    c && (c.getCustomData("ready") ? d(a) : c.setCustomData("ready", 1))
                }, null, null, -1);
                b.on("beforeSetMode", function () {
                    d(b.editable())
                }, null, null, -1);
                var c, f, a = function () {
                    var a = b.editable();
                    if (a)if (a = e(a)) {
                        var d = b.document.$.defaultView.getSelection();
                        d.type == "Caret" && d.anchorNode == a.$ && (f = 1);
                        c = a.getText();
                        a.setText(j(c))
                    }
                }, i = function () {
                    var a = b.editable();
                    if (a)if (a = e(a)) {
                        a.setText(c);
                        if (f) {
                            b.document.$.defaultView.getSelection().setPosition(a.$, a.getLength());
                            f = 0
                        }
                    }
                };
                b.on("beforeUndoImage", a);
                b.on("afterUndoImage", i);
                b.on("beforeGetData", a, null, null, 0);
                b.on("getData", i)
            }
        });
        CKEDITOR.editor.prototype.selectionChange = function (b) {
            (b ? a : c).call(this)
        };
        CKEDITOR.editor.prototype.getSelection = function (a) {
            if (this._.savedSelection && !a)return this._.savedSelection;
            return(a = this.editable()) ? new CKEDITOR.dom.selection(a) : null
        };
        CKEDITOR.editor.prototype.lockSelection = function (a) {
            a = a || this.getSelection(1);
            if (a.getType() != CKEDITOR.SELECTION_NONE) {
                !a.isLocked && a.lock();
                this._.savedSelection = a;
                return true
            }
            return false
        };
        CKEDITOR.editor.prototype.unlockSelection = function (a) {
            var b = this._.savedSelection;
            if (b) {
                b.unlock(a);
                delete this._.savedSelection;
                return true
            }
            return false
        };
        CKEDITOR.editor.prototype.forceNextSelectionCheck = function () {
            delete this._.selectionPreviousPath
        };
        CKEDITOR.dom.document.prototype.getSelection = function () {
            return new CKEDITOR.dom.selection(this)
        };
        CKEDITOR.dom.range.prototype.select = function () {
            var a = this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() : new CKEDITOR.dom.selection(this.root);
            a.selectRanges([this]);
            return a
        };
        CKEDITOR.SELECTION_NONE = 1;
        CKEDITOR.SELECTION_TEXT = 2;
        CKEDITOR.SELECTION_ELEMENT = 3;
        var n = typeof window.getSelection != "function";
        CKEDITOR.dom.selection = function (a) {
            var b = a instanceof CKEDITOR.dom.element;
            this.document =
                a instanceof CKEDITOR.dom.document ? a : a.getDocument();
            this.root = b ? a : this.document.getBody();
            this.isLocked = 0;
            this._ = {cache: {}};
            if (CKEDITOR.env.webkit) {
                a = this.document.getWindow().$.getSelection();
                if (a.type == "None" && this.document.getActive().equals(this.root) || a.type == "Caret" && a.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) {
                    var c = new CKEDITOR.dom.range(this.root);
                    c.moveToPosition(this.root, CKEDITOR.POSITION_AFTER_START);
                    b = this.document.$.createRange();
                    b.setStart(c.startContainer.$, c.startOffset);
                    b.collapse(1);
                    var d = this.root.on("focus", function (a) {
                        a.cancel()
                    }, null, null, -100);
                    a.addRange(b);
                    d.removeListener()
                }
            }
            var a = this.getNative(), e;
            if (a)if (a.getRangeAt)e = (c = a.rangeCount && a.getRangeAt(0)) && new CKEDITOR.dom.node(c.commonAncestorContainer); else {
                try {
                    c = a.createRange()
                } catch (f) {
                }
                e = c && CKEDITOR.dom.element.get(c.item && c.item(0) || c.parentElement())
            }
            if (!e || !this.root.equals(e) && !this.root.contains(e)) {
                this._.cache.type = CKEDITOR.SELECTION_NONE;
                this._.cache.startElement = null;
                this._.cache.selectedElement = null;
                this._.cache.selectedText =
                    "";
                this._.cache.ranges = new CKEDITOR.dom.rangeList
            }
            return this
        };
        var r = {img: 1, hr: 1, li: 1, table: 1, tr: 1, td: 1, th: 1, embed: 1, object: 1, ol: 1, ul: 1, a: 1, input: 1, form: 1, select: 1, textarea: 1, button: 1, fieldset: 1, thead: 1, tfoot: 1};
        CKEDITOR.dom.selection.prototype = {getNative: function () {
            return this._.cache.nativeSel !== void 0 ? this._.cache.nativeSel : this._.cache.nativeSel = n ? this.document.$.selection : this.document.getWindow().$.getSelection()
        }, getType: n ? function () {
            var a = this._.cache;
            if (a.type)return a.type;
            var b = CKEDITOR.SELECTION_NONE;
            try {
                var c = this.getNative(), d = c.type;
                if (d == "Text")b = CKEDITOR.SELECTION_TEXT;
                if (d == "Control")b = CKEDITOR.SELECTION_ELEMENT;
                if (c.createRange().parentElement())b = CKEDITOR.SELECTION_TEXT
            } catch (e) {
            }
            return a.type = b
        } : function () {
            var a = this._.cache;
            if (a.type)return a.type;
            var b = CKEDITOR.SELECTION_TEXT, c = this.getNative();
            if (!c || !c.rangeCount)b = CKEDITOR.SELECTION_NONE; else if (c.rangeCount == 1) {
                var c = c.getRangeAt(0), d = c.startContainer;
                if (d == c.endContainer && d.nodeType == 1 && c.endOffset - c.startOffset == 1 && r[d.childNodes[c.startOffset].nodeName.toLowerCase()])b =
                    CKEDITOR.SELECTION_ELEMENT
            }
            return a.type = b
        }, getRanges: function () {
            var a = n ? function () {
                function a(b) {
                    return(new CKEDITOR.dom.node(b)).getIndex()
                }

                var b = function (b, c) {
                    b = b.duplicate();
                    b.collapse(c);
                    var d = b.parentElement(), e = d.ownerDocument;
                    if (!d.hasChildNodes())return{container: d, offset: 0};
                    for (var f = d.children, h, i, j = b.duplicate(), m = 0, p = f.length - 1, l = -1, n, o; m <= p;) {
                        l = Math.floor((m + p) / 2);
                        h = f[l];
                        j.moveToElementText(h);
                        n = j.compareEndPoints("StartToStart", b);
                        if (n > 0)p = l - 1; else if (n < 0)m = l + 1; else {
                            if (CKEDITOR.env.ie9Compat &&
                                h.tagName == "BR") {
                                f = e.defaultView.getSelection();
                                return{container: f[c ? "anchorNode" : "focusNode"], offset: f[c ? "anchorOffset" : "focusOffset"]}
                            }
                            return{container: d, offset: a(h)}
                        }
                    }
                    if (l == -1 || l == f.length - 1 && n < 0) {
                        j.moveToElementText(d);
                        j.setEndPoint("StartToStart", b);
                        e = j.text.replace(/(\r\n|\r)/g, "\n").length;
                        f = d.childNodes;
                        if (!e) {
                            h = f[f.length - 1];
                            return h.nodeType != CKEDITOR.NODE_TEXT ? {container: d, offset: f.length} : {container: h, offset: h.nodeValue.length}
                        }
                        for (d = f.length; e > 0 && d > 0;) {
                            i = f[--d];
                            if (i.nodeType == CKEDITOR.NODE_TEXT) {
                                o =
                                    i;
                                e = e - i.nodeValue.length
                            }
                        }
                        return{container: o, offset: -e}
                    }
                    j.collapse(n > 0 ? true : false);
                    j.setEndPoint(n > 0 ? "StartToStart" : "EndToStart", b);
                    e = j.text.replace(/(\r\n|\r)/g, "\n").length;
                    if (!e)return{container: d, offset: a(h) + (n > 0 ? 0 : 1)};
                    for (; e > 0;)try {
                        i = h[n > 0 ? "previousSibling" : "nextSibling"];
                        if (i.nodeType == CKEDITOR.NODE_TEXT) {
                            e = e - i.nodeValue.length;
                            o = i
                        }
                        h = i
                    } catch (x) {
                        return{container: d, offset: a(h)}
                    }
                    return{container: o, offset: n > 0 ? -e : o.nodeValue.length + e}
                };
                return function () {
                    var a = this.getNative(), c = a && a.createRange(),
                        d = this.getType();
                    if (!a)return[];
                    if (d == CKEDITOR.SELECTION_TEXT) {
                        a = new CKEDITOR.dom.range(this.root);
                        d = b(c, true);
                        a.setStart(new CKEDITOR.dom.node(d.container), d.offset);
                        d = b(c);
                        a.setEnd(new CKEDITOR.dom.node(d.container), d.offset);
                        a.endContainer.getPosition(a.startContainer) & CKEDITOR.POSITION_PRECEDING && a.endOffset <= a.startContainer.getIndex() && a.collapse();
                        return[a]
                    }
                    if (d == CKEDITOR.SELECTION_ELEMENT) {
                        for (var d = [], e = 0; e < c.length; e++) {
                            for (var g = c.item(e), f = g.parentNode, i = 0, a = new CKEDITOR.dom.range(this.root); i <
                                f.childNodes.length && f.childNodes[i] != g; i++);
                            a.setStart(new CKEDITOR.dom.node(f), i);
                            a.setEnd(new CKEDITOR.dom.node(f), i + 1);
                            d.push(a)
                        }
                        return d
                    }
                    return[]
                }
            }() : function () {
                var a = [], b, c = this.getNative();
                if (!c)return a;
                for (var d = 0; d < c.rangeCount; d++) {
                    var e = c.getRangeAt(d);
                    b = new CKEDITOR.dom.range(this.root);
                    b.setStart(new CKEDITOR.dom.node(e.startContainer), e.startOffset);
                    b.setEnd(new CKEDITOR.dom.node(e.endContainer), e.endOffset);
                    a.push(b)
                }
                return a
            };
            return function (b) {
                var c = this._.cache;
                if (c.ranges && !b)return c.ranges;
                if (!c.ranges)c.ranges = new CKEDITOR.dom.rangeList(a.call(this));
                if (b)for (var d = c.ranges, e = 0; e < d.length; e++) {
                    var f = d[e];
                    f.getCommonAncestor().isReadOnly() && d.splice(e, 1);
                    if (!f.collapsed) {
                        if (f.startContainer.isReadOnly())for (var b = f.startContainer, i; b;) {
                            if ((i = b.type == CKEDITOR.NODE_ELEMENT) && b.is("body") || !b.isReadOnly())break;
                            i && b.getAttribute("contentEditable") == "false" && f.setStartAfter(b);
                            b = b.getParent()
                        }
                        b = f.startContainer;
                        i = f.endContainer;
                        var j = f.startOffset, m = f.endOffset, l = f.clone();
                        b && b.type == CKEDITOR.NODE_TEXT &&
                        (j >= b.getLength() ? l.setStartAfter(b) : l.setStartBefore(b));
                        i && i.type == CKEDITOR.NODE_TEXT && (m ? l.setEndAfter(i) : l.setEndBefore(i));
                        b = new CKEDITOR.dom.walker(l);
                        b.evaluator = function (a) {
                            if (a.type == CKEDITOR.NODE_ELEMENT && a.isReadOnly()) {
                                var b = f.clone();
                                f.setEndBefore(a);
                                f.collapsed && d.splice(e--, 1);
                                if (!(a.getPosition(l.endContainer) & CKEDITOR.POSITION_CONTAINS)) {
                                    b.setStartAfter(a);
                                    b.collapsed || d.splice(e + 1, 0, b)
                                }
                                return true
                            }
                            return false
                        };
                        b.next()
                    }
                }
                return c.ranges
            }
        }(), getStartElement: function () {
            var a = this._.cache;
            if (a.startElement !== void 0)return a.startElement;
            var b;
            switch (this.getType()) {
                case CKEDITOR.SELECTION_ELEMENT:
                    return this.getSelectedElement();
                case CKEDITOR.SELECTION_TEXT:
                    var c = this.getRanges()[0];
                    if (c) {
                        if (c.collapsed) {
                            b = c.startContainer;
                            b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent())
                        } else {
                            for (c.optimize(); ;) {
                                b = c.startContainer;
                                if (c.startOffset == (b.getChildCount ? b.getChildCount() : b.getLength()) && !b.isBlockBoundary())c.setStartAfter(b); else break
                            }
                            b = c.startContainer;
                            if (b.type != CKEDITOR.NODE_ELEMENT)return b.getParent();
                            b = b.getChild(c.startOffset);
                            if (!b || b.type != CKEDITOR.NODE_ELEMENT)b = c.startContainer; else for (c = b.getFirst(); c && c.type == CKEDITOR.NODE_ELEMENT;) {
                                b = c;
                                c = c.getFirst()
                            }
                        }
                        b = b.$
                    }
            }
            return a.startElement = b ? new CKEDITOR.dom.element(b) : null
        }, getSelectedElement: function () {
            var a = this._.cache;
            if (a.selectedElement !== void 0)return a.selectedElement;
            var b = this, c = CKEDITOR.tools.tryThese(function () {
                return b.getNative().createRange().item(0)
            }, function () {
                for (var a = b.getRanges()[0], c, d, e = 2; e && (!(c = a.getEnclosedNode()) || !(c.type ==
                    CKEDITOR.NODE_ELEMENT && r[c.getName()] && (d = c))); e--)a.shrink(CKEDITOR.SHRINK_ELEMENT);
                return d.$
            });
            return a.selectedElement = c ? new CKEDITOR.dom.element(c) : null
        }, getSelectedText: function () {
            var a = this._.cache;
            if (a.selectedText !== void 0)return a.selectedText;
            var b = this.getNative(), b = n ? b.type == "Control" ? "" : b.createRange().text : b.toString();
            return a.selectedText = b
        }, lock: function () {
            this.getRanges();
            this.getStartElement();
            this.getSelectedElement();
            this.getSelectedText();
            this._.cache.nativeSel = null;
            this.isLocked =
                1
        }, unlock: function (a) {
            if (this.isLocked) {
                if (a)var b = this.getSelectedElement(), c = !b && this.getRanges();
                this.isLocked = 0;
                this.reset();
                if (a)(a = b || c[0] && c[0].getCommonAncestor()) && a.getAscendant("body", 1) && (b ? this.selectElement(b) : this.selectRanges(c))
            }
        }, reset: function () {
            this._.cache = {}
        }, selectElement: function (a) {
            var b = new CKEDITOR.dom.range(this.root);
            b.setStartBefore(a);
            b.setEndAfter(a);
            this.selectRanges([b])
        }, selectRanges: function (a) {
            if (a.length)if (this.isLocked) {
                var b = CKEDITOR.document.getActive();
                this.unlock();
                this.selectRanges(a);
                this.lock();
                !b.equals(this.root) && b.focus()
            } else {
                if (n) {
                    var c = CKEDITOR.dom.walker.whitespaces(true), e = /\ufeff|\u00a0/, i = {table: 1, tbody: 1, tr: 1};
                    if (a.length > 1) {
                        b = a[a.length - 1];
                        a[0].setEnd(b.endContainer, b.endOffset)
                    }
                    var b = a[0], a = b.collapsed, k, j, m, l = b.getEnclosedNode();
                    if (l && l.type == CKEDITOR.NODE_ELEMENT && l.getName()in r && (!l.is("a") || !l.getText()))try {
                        m = l.$.createControlRange();
                        m.addElement(l.$);
                        m.select();
                        return
                    } catch (B) {
                    }
                    (b.startContainer.type == CKEDITOR.NODE_ELEMENT && b.startContainer.getName()in
                        i || b.endContainer.type == CKEDITOR.NODE_ELEMENT && b.endContainer.getName()in i) && b.shrink(CKEDITOR.NODE_ELEMENT, true);
                    m = b.createBookmark();
                    var i = m.startNode, q;
                    if (!a)q = m.endNode;
                    m = b.document.$.body.createTextRange();
                    m.moveToElementText(i.$);
                    m.moveStart("character", 1);
                    if (q) {
                        e = b.document.$.body.createTextRange();
                        e.moveToElementText(q.$);
                        m.setEndPoint("EndToEnd", e);
                        m.moveEnd("character", -1)
                    } else {
                        k = i.getNext(c);
                        j = i.hasAscendant("pre");
                        k = !(k && k.getText && k.getText().match(e)) && (j || !i.hasPrevious() || i.getPrevious().is &&
                            i.getPrevious().is("br"));
                        j = b.document.createElement("span");
                        j.setHtml("&#65279;");
                        j.insertBefore(i);
                        k && b.document.createText("﻿").insertBefore(i)
                    }
                    b.setStartBefore(i);
                    i.remove();
                    if (a) {
                        if (k) {
                            m.moveStart("character", -1);
                            m.select();
                            b.document.$.selection.clear()
                        } else m.select();
                        b.moveToPosition(j, CKEDITOR.POSITION_BEFORE_START);
                        j.remove()
                    } else {
                        b.setEndBefore(q);
                        q.remove();
                        m.select()
                    }
                } else {
                    q = this.getNative();
                    if (!q)return;
                    if (CKEDITOR.env.opera) {
                        b = this.document.$.createRange();
                        b.selectNodeContents(this.root.$);
                        q.addRange(b)
                    }
                    this.removeAllRanges();
                    for (e = 0; e < a.length; e++) {
                        if (e < a.length - 1) {
                            b = a[e];
                            m = a[e + 1];
                            j = b.clone();
                            j.setStart(b.endContainer, b.endOffset);
                            j.setEnd(m.startContainer, m.startOffset);
                            if (!j.collapsed) {
                                j.shrink(CKEDITOR.NODE_ELEMENT, true);
                                k = j.getCommonAncestor();
                                j = j.getEnclosedNode();
                                if (k.isReadOnly() || j && j.isReadOnly()) {
                                    m.setStart(b.startContainer, b.startOffset);
                                    a.splice(e--, 1);
                                    continue
                                }
                            }
                        }
                        b = a[e];
                        m = this.document.$.createRange();
                        k = b.startContainer;
                        if (CKEDITOR.env.opera && b.collapsed && k.type == CKEDITOR.NODE_ELEMENT) {
                            j =
                                k.getChild(b.startOffset - 1);
                            c = k.getChild(b.startOffset);
                            if (!j && !c && k.is(CKEDITOR.dtd.$removeEmpty) || j && j.type == CKEDITOR.NODE_ELEMENT || c && c.type == CKEDITOR.NODE_ELEMENT) {
                                b.insertNode(this.document.createText(""));
                                b.collapse(1)
                            }
                        }
                        if (b.collapsed && CKEDITOR.env.webkit && f(b)) {
                            k = this.root;
                            d(k, false);
                            j = k.getDocument().createText("​");
                            k.setCustomData("cke-fillingChar", j);
                            b.insertNode(j);
                            if ((k = j.getNext()) && !j.getPrevious() && k.type == CKEDITOR.NODE_ELEMENT && k.getName() == "br") {
                                d(this.root);
                                b.moveToPosition(k, CKEDITOR.POSITION_BEFORE_START)
                            } else b.moveToPosition(j,
                                CKEDITOR.POSITION_AFTER_END)
                        }
                        m.setStart(b.startContainer.$, b.startOffset);
                        try {
                            m.setEnd(b.endContainer.$, b.endOffset)
                        } catch (z) {
                            if (z.toString().indexOf("NS_ERROR_ILLEGAL_VALUE") >= 0) {
                                b.collapse(1);
                                m.setEnd(b.endContainer.$, b.endOffset)
                            } else throw z;
                        }
                        q.addRange(m)
                    }
                }
                this.reset();
                this.root.fire("selectionchange")
            }
        }, createBookmarks: function (a) {
            return this.getRanges().createBookmarks(a)
        }, createBookmarks2: function (a) {
            return this.getRanges().createBookmarks2(a)
        }, selectBookmarks: function (a) {
            for (var b = [], c = 0; c <
                a.length; c++) {
                var d = new CKEDITOR.dom.range(this.root);
                d.moveToBookmark(a[c]);
                b.push(d)
            }
            this.selectRanges(b);
            return this
        }, getCommonAncestor: function () {
            var a = this.getRanges();
            return a[0].startContainer.getCommonAncestor(a[a.length - 1].endContainer)
        }, scrollIntoView: function () {
            this.type != CKEDITOR.SELECTION_NONE && this.getRanges()[0].scrollIntoView()
        }, removeAllRanges: function () {
            var a = this.getNative();
            try {
                a && a[n ? "empty" : "removeAllRanges"]()
            } catch (b) {
            }
            this.reset()
        }}
    })();
    CKEDITOR.editor.prototype.attachStyleStateChange = function (a, c) {
        var b = this._.styleStateChangeCallbacks;
        if (!b) {
            b = this._.styleStateChangeCallbacks = [];
            this.on("selectionChange", function (a) {
                for (var c = 0; c < b.length; c++) {
                    var d = b[c], j = d.style.checkActive(a.data.path) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
                    d.fn.call(this, j)
                }
            })
        }
        b.push({style: a, fn: c})
    };
    CKEDITOR.STYLE_BLOCK = 1;
    CKEDITOR.STYLE_INLINE = 2;
    CKEDITOR.STYLE_OBJECT = 3;
    (function () {
        function a(a, b) {
            for (var c, d; a = a.getParent();) {
                if (a.equals(b))break;
                if (a.getAttribute("data-nostyle"))c = a; else if (!d) {
                    var e = a.getAttribute("contentEditable");
                    e == "false" ? c = a : e == "true" && (d = 1)
                }
            }
            return c
        }

        function c(b) {
            var c = b.document;
            if (b.collapsed) {
                c = u(this, c);
                b.insertNode(c);
                b.moveToPosition(c, CKEDITOR.POSITION_BEFORE_END)
            } else {
                var d = this.element, e = this._.definition, f, g = e.ignoreReadonly, h = g || e.includeReadonly;
                h == void 0 && (h = b.root.getCustomData("cke_includeReadonly"));
                var i = CKEDITOR.dtd[d] ||
                    (f = true, CKEDITOR.dtd.span);
                b.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
                b.trim();
                var j = b.createBookmark(), k = j.startNode, m = j.endNode, l = k, n;
                if (!g) {
                    var r = b.getCommonAncestor(), g = a(k, r), r = a(m, r);
                    g && (l = g.getNextSourceNode(true));
                    r && (m = r)
                }
                for (l.getPosition(m) == CKEDITOR.POSITION_FOLLOWING && (l = 0); l;) {
                    g = false;
                    if (l.equals(m)) {
                        l = null;
                        g = true
                    } else {
                        var q = l.type, s = q == CKEDITOR.NODE_ELEMENT ? l.getName() : null, r = s && l.getAttribute("contentEditable") == "false", t = s && l.getAttribute("data-nostyle");
                        if (s && l.data("cke-bookmark")) {
                            l =
                                l.getNextSourceNode(true);
                            continue
                        }
                        if (!s || i[s] && !t && (!r || h) && (l.getPosition(m) | CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED) == CKEDITOR.POSITION_PRECEDING + CKEDITOR.POSITION_IDENTICAL + CKEDITOR.POSITION_IS_CONTAINED && (!e.childRule || e.childRule(l))) {
                            var v = l.getParent();
                            if (v && ((v.getDtd() || CKEDITOR.dtd.span)[d] || f) && (!e.parentRule || e.parentRule(v))) {
                                if (!n && (!s || !CKEDITOR.dtd.$removeEmpty[s] || (l.getPosition(m) | CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL |
                                    CKEDITOR.POSITION_IS_CONTAINED) == CKEDITOR.POSITION_PRECEDING + CKEDITOR.POSITION_IDENTICAL + CKEDITOR.POSITION_IS_CONTAINED)) {
                                    n = b.clone();
                                    n.setStartBefore(l)
                                }
                                if (q == CKEDITOR.NODE_TEXT || r || q == CKEDITOR.NODE_ELEMENT && !l.getChildCount()) {
                                    for (var q = l, w; (g = !q.getNext(A)) && (w = q.getParent(), i[w.getName()]) && (w.getPosition(k) | CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED) == CKEDITOR.POSITION_FOLLOWING + CKEDITOR.POSITION_IDENTICAL + CKEDITOR.POSITION_IS_CONTAINED && (!e.childRule ||
                                        e.childRule(w));)q = w;
                                    n.setEndAfter(q)
                                }
                            } else g = true
                        } else g = true;
                        l = l.getNextSourceNode(t || r && !h)
                    }
                    if (g && n && !n.collapsed) {
                        for (var g = u(this, c), r = g.hasAttributes(), t = n.getCommonAncestor(), q = {}, s = {}, v = {}, D = {}, B, z, F; g && t;) {
                            if (t.getName() == d) {
                                for (B in e.attributes)if (!D[B] && (F = t.getAttribute(z)))g.getAttribute(B) == F ? s[B] = 1 : D[B] = 1;
                                for (z in e.styles)if (!v[z] && (F = t.getStyle(z)))g.getStyle(z) == F ? q[z] = 1 : v[z] = 1
                            }
                            t = t.getParent()
                        }
                        for (B in s)g.removeAttribute(B);
                        for (z in q)g.removeStyle(z);
                        r && !g.hasAttributes() && (g =
                            null);
                        if (g) {
                            n.extractContents().appendTo(g);
                            p.call(this, g);
                            n.insertNode(g);
                            g.mergeSiblings();
                            CKEDITOR.env.ie || g.$.normalize()
                        } else {
                            g = new CKEDITOR.dom.element("span");
                            n.extractContents().appendTo(g);
                            n.insertNode(g);
                            p.call(this, g);
                            g.remove(true)
                        }
                        n = null
                    }
                }
                b.moveToBookmark(j);
                b.shrink(CKEDITOR.SHRINK_TEXT)
            }
        }

        function b(a) {
            a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
            var b = a.createBookmark(), c = b.startNode;
            if (a.collapsed) {
                for (var d = new CKEDITOR.dom.elementPath(c.getParent(), a.root), e, f = 0, h; f < d.elements.length && (h =
                    d.elements[f]); f++) {
                    if (h == d.block || h == d.blockLimit)break;
                    if (this.checkElementRemovable(h)) {
                        var i;
                        if (a.collapsed && (a.checkBoundaryOfElement(h, CKEDITOR.END) || (i = a.checkBoundaryOfElement(h, CKEDITOR.START)))) {
                            e = h;
                            e.match = i ? "start" : "end"
                        } else {
                            h.mergeSiblings();
                            h.getName() == this.element ? r.call(this, h) : g(h, t(this)[h.getName()])
                        }
                    }
                }
                if (e) {
                    h = c;
                    for (f = 0; ; f++) {
                        i = d.elements[f];
                        if (i.equals(e))break; else if (i.match)continue; else i = i.clone();
                        i.append(h);
                        h = i
                    }
                    h[e.match == "start" ? "insertBefore" : "insertAfter"](e)
                }
            } else {
                var j =
                    b.endNode, k = this, d = function () {
                    for (var a = new CKEDITOR.dom.elementPath(c.getParent()), b = new CKEDITOR.dom.elementPath(j.getParent()), e = null, d = null, f = 0; f < a.elements.length; f++) {
                        var g = a.elements[f];
                        if (g == a.block || g == a.blockLimit)break;
                        k.checkElementRemovable(g) && (e = g)
                    }
                    for (f = 0; f < b.elements.length; f++) {
                        g = b.elements[f];
                        if (g == b.block || g == b.blockLimit)break;
                        k.checkElementRemovable(g) && (d = g)
                    }
                    d && j.breakParent(d);
                    e && c.breakParent(e)
                };
                d();
                for (e = c; !e.equals(j);) {
                    f = e.getNextSourceNode();
                    if (e.type == CKEDITOR.NODE_ELEMENT &&
                        this.checkElementRemovable(e)) {
                        e.getName() == this.element ? r.call(this, e) : g(e, t(this)[e.getName()]);
                        if (f.type == CKEDITOR.NODE_ELEMENT && f.contains(c)) {
                            d();
                            f = c.getNext()
                        }
                    }
                    e = f
                }
            }
            a.moveToBookmark(b)
        }

        function f(a) {
            var b = a.getEnclosedNode() || a.getCommonAncestor(false, true);
            (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) && !a.isReadOnly() && w(a, this)
        }

        function e(a) {
            var b = a.getCommonAncestor(true, true);
            if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
                var b = this._.definition,
                    c = b.attributes;
                if (c)for (var e in c)a.removeAttribute(e, c[e]);
                if (b.styles)for (var d in b.styles)b.styles.hasOwnProperty(d) && a.removeStyle(d)
            }
        }

        function d(a) {
            var b = a.createBookmark(true), c = a.createIterator();
            c.enforceRealBlocks = true;
            if (this._.enterMode)c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
            for (var e, d = a.document; e = c.getNextParagraph();)if (!e.isReadOnly()) {
                var f = u(this, d, e);
                l(e, f)
            }
            a.moveToBookmark(b)
        }

        function j(a) {
            var b = a.createBookmark(1), c = a.createIterator();
            c.enforceRealBlocks = true;
            c.enlargeBr =
                this._.enterMode != CKEDITOR.ENTER_BR;
            for (var e; e = c.getNextParagraph();)if (this.checkElementRemovable(e))if (e.is("pre")) {
                var d = this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div");
                d && e.copyAttributes(d);
                l(e, d)
            } else r.call(this, e);
            a.moveToBookmark(b)
        }

        function l(a, b) {
            var c = !b;
            if (c) {
                b = a.getDocument().createElement("div");
                a.copyAttributes(b)
            }
            var e = b && b.is("pre"), d = a.is("pre"), f = !e && d;
            if (e && !d) {
                d = b;
                (f = a.getBogus()) && f.remove();
                f = a.getHtml();
                f = m(f,
                    /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
                f = f.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
                f = f.replace(/([ \t\n\r]+|&nbsp;)/g, " ");
                f = f.replace(/<br\b[^>]*>/gi, "\n");
                if (CKEDITOR.env.ie) {
                    var g = a.getDocument().createElement("div");
                    g.append(d);
                    d.$.outerHTML = "<pre>" + f + "</pre>";
                    d.copyAttributes(g.getFirst());
                    d = g.getFirst().remove()
                } else d.setHtml(f);
                b = d
            } else f ? b = n(c ? [a.getHtml()] : i(a), b) : a.moveChildren(b);
            b.replace(a);
            if (e) {
                var c = b, j;
                if ((j = c.getPrevious(v)) && j.is && j.is("pre")) {
                    e = m(j.getHtml(), /\n$/, "") +
                        "\n\n" + m(c.getHtml(), /^\n/, "");
                    CKEDITOR.env.ie ? c.$.outerHTML = "<pre>" + e + "</pre>" : c.setHtml(e);
                    j.remove()
                }
            } else c && h(b)
        }

        function i(a) {
            a.getName();
            var b = [];
            m(a.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi,function (a, b, c) {
                return b + "</pre>" + c + "<pre>"
            }).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function (a, c) {
                b.push(c)
            });
            return b
        }

        function m(a, b, c) {
            var e = "", d = "", a = a.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function (a, b, c) {
                b && (e = b);
                c && (d = c);
                return""
            });
            return e + a.replace(b, c) + d
        }

        function n(a, b) {
            var c;
            a.length > 1 && (c = new CKEDITOR.dom.documentFragment(b.getDocument()));
            for (var e = 0; e < a.length; e++) {
                var d = a[e], d = d.replace(/(\r\n|\r)/g, "\n"), d = m(d, /^[ \t]*\n/, ""), d = m(d, /\n$/, ""), d = m(d, /^[ \t]+|[ \t]+$/g, function (a, b) {
                    return a.length == 1 ? "&nbsp;" : b ? " " + CKEDITOR.tools.repeat("&nbsp;", a.length - 1) : CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
                }), d = d.replace(/\n/g, "<br>"), d = d.replace(/[ \t]{2,}/g, function (a) {
                    return CKEDITOR.tools.repeat("&nbsp;",
                        a.length - 1) + " "
                });
                if (c) {
                    var f = b.clone();
                    f.setHtml(d);
                    c.append(f)
                } else b.setHtml(d)
            }
            return c || b
        }

        function r(a) {
            var b = this._.definition, c = b.attributes, b = b.styles, d = t(this)[a.getName()], e = CKEDITOR.tools.isEmpty(c) && CKEDITOR.tools.isEmpty(b), f;
            for (f in c)if (!((f == "class" || this._.definition.fullMatch) && a.getAttribute(f) != F(f, c[f]))) {
                e = a.hasAttribute(f);
                a.removeAttribute(f)
            }
            for (var i in b)if (!(this._.definition.fullMatch && a.getStyle(i) != F(i, b[i], true))) {
                e = e || !!a.getStyle(i);
                a.removeStyle(i)
            }
            g(a, d, B[a.getName()]);
            e && (this._.definition.alwaysRemoveElement ? h(a, 1) : !CKEDITOR.dtd.$block[a.getName()] || this._.enterMode == CKEDITOR.ENTER_BR && !a.hasAttributes() ? h(a) : a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"))
        }

        function p(a) {
            for (var b = t(this), c = a.getElementsByTag(this.element), d = c.count(); --d >= 0;)r.call(this, c.getItem(d));
            for (var e in b)if (e != this.element) {
                c = a.getElementsByTag(e);
                for (d = c.count() - 1; d >= 0; d--) {
                    var f = c.getItem(d);
                    g(f, b[e])
                }
            }
        }

        function g(a, b, c) {
            if (b = b && b.attributes)for (var d = 0; d < b.length; d++) {
                var e =
                    b[d][0], f;
                if (f = a.getAttribute(e)) {
                    var g = b[d][1];
                    (g === null || g.test && g.test(f) || typeof g == "string" && f == g) && a.removeAttribute(e)
                }
            }
            c || h(a)
        }

        function h(a, b) {
            if (!a.hasAttributes() || b)if (CKEDITOR.dtd.$block[a.getName()]) {
                var c = a.getPrevious(v), d = a.getNext(v);
                c && (c.type == CKEDITOR.NODE_TEXT || !c.isBlockBoundary({br: 1})) && a.append("br", 1);
                d && (d.type == CKEDITOR.NODE_TEXT || !d.isBlockBoundary({br: 1})) && a.append("br");
                a.remove(true)
            } else {
                c = a.getFirst();
                d = a.getLast();
                a.remove(true);
                if (c) {
                    c.type == CKEDITOR.NODE_ELEMENT &&
                    c.mergeSiblings();
                    d && (!c.equals(d) && d.type == CKEDITOR.NODE_ELEMENT) && d.mergeSiblings()
                }
            }
        }

        function u(a, b, c) {
            var d;
            d = a.element;
            d == "*" && (d = "span");
            d = new CKEDITOR.dom.element(d, b);
            c && c.copyAttributes(d);
            d = w(d, a);
            b.getCustomData("doc_processing_style") && d.hasAttribute("id") ? d.removeAttribute("id") : b.setCustomData("doc_processing_style", 1);
            return d
        }

        function w(a, b) {
            var c = b._.definition, d = c.attributes, c = CKEDITOR.style.getStyleText(c);
            if (d)for (var e in d)a.setAttribute(e, d[e]);
            c && a.setAttribute("style", c);
            return a
        }

        function k(a, b) {
            for (var c in a)a[c] = a[c].replace(s, function (a, c) {
                return b[c]
            })
        }

        function t(a) {
            if (a._.overrides)return a._.overrides;
            var b = a._.overrides = {}, c = a._.definition.overrides;
            if (c) {
                CKEDITOR.tools.isArray(c) || (c = [c]);
                for (var d = 0; d < c.length; d++) {
                    var e = c[d], f, g;
                    if (typeof e == "string")f = e.toLowerCase(); else {
                        f = e.element ? e.element.toLowerCase() : a.element;
                        g = e.attributes
                    }
                    e = b[f] || (b[f] = {});
                    if (g) {
                        var e = e.attributes = e.attributes || [], h;
                        for (h in g)e.push([h.toLowerCase(), g[h]])
                    }
                }
            }
            return b
        }

        function F(a, b, c) {
            var d = new CKEDITOR.dom.element("span");
            d[c ? "setStyle" : "setAttribute"](a, b);
            return d[c ? "getStyle" : "getAttribute"](a)
        }

        function D(a, b) {
            for (var c = a.document, d = a.getRanges(), e = b ? this.removeFromRange : this.applyToRange, f, g = d.createIterator(); f = g.getNextRange();)e.call(this, f);
            a.selectRanges(d);
            c.removeCustomData("doc_processing_style")
        }

        var B = {address: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1, pre: 1, section: 1, header: 1, footer: 1, nav: 1, article: 1, aside: 1, figure: 1, dialog: 1, hgroup: 1, time: 1, meter: 1, menu: 1, command: 1,
            keygen: 1, output: 1, progress: 1, details: 1, datagrid: 1, datalist: 1}, q = {a: 1, embed: 1, hr: 1, img: 1, li: 1, object: 1, ol: 1, table: 1, td: 1, tr: 1, th: 1, ul: 1, dl: 1, dt: 1, dd: 1, form: 1, audio: 1, video: 1}, z = /\s*(?:;\s*|$)/, s = /#\((.+?)\)/g, A = CKEDITOR.dom.walker.bookmark(0, 1), v = CKEDITOR.dom.walker.whitespaces(1);
        CKEDITOR.style = function (a, b) {
            var c = a.attributes;
            if (c && c.style) {
                a.styles = CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(c.style));
                delete c.style
            }
            if (b) {
                a = CKEDITOR.tools.clone(a);
                k(a.attributes, b);
                k(a.styles,
                    b)
            }
            c = this.element = a.element ? typeof a.element == "string" ? a.element.toLowerCase() : a.element : "*";
            this.type = a.type || (B[c] ? CKEDITOR.STYLE_BLOCK : q[c] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
            if (typeof this.element == "object")this.type = CKEDITOR.STYLE_OBJECT;
            this._ = {definition: a}
        };
        CKEDITOR.editor.prototype.applyStyle = function (a) {
            D.call(a, this.getSelection())
        };
        CKEDITOR.editor.prototype.removeStyle = function (a) {
            D.call(a, this.getSelection(), 1)
        };
        CKEDITOR.style.prototype = {apply: function (a) {
            D.call(this, a.getSelection())
        },
            remove: function (a) {
                D.call(this, a.getSelection(), 1)
            }, applyToRange: function (a) {
                return(this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? c : this.type == CKEDITOR.STYLE_BLOCK ? d : this.type == CKEDITOR.STYLE_OBJECT ? f : null).call(this, a)
            }, removeFromRange: function (a) {
                return(this.removeFromRange = this.type == CKEDITOR.STYLE_INLINE ? b : this.type == CKEDITOR.STYLE_BLOCK ? j : this.type == CKEDITOR.STYLE_OBJECT ? e : null).call(this, a)
            }, applyToObject: function (a) {
                w(a, this)
            }, checkActive: function (a) {
                switch (this.type) {
                    case CKEDITOR.STYLE_BLOCK:
                        return this.checkElementRemovable(a.block ||
                            a.blockLimit, true);
                    case CKEDITOR.STYLE_OBJECT:
                    case CKEDITOR.STYLE_INLINE:
                        for (var b = a.elements, c = 0, d; c < b.length; c++) {
                            d = b[c];
                            if (!(this.type == CKEDITOR.STYLE_INLINE && (d == a.block || d == a.blockLimit))) {
                                if (this.type == CKEDITOR.STYLE_OBJECT) {
                                    var e = d.getName();
                                    if (!(typeof this.element == "string" ? e == this.element : e in this.element))continue
                                }
                                if (this.checkElementRemovable(d, true))return true
                            }
                        }
                }
                return false
            }, checkApplicable: function (a) {
                switch (this.type) {
                    case CKEDITOR.STYLE_OBJECT:
                        return a.contains(this.element)
                }
                return true
            },
            checkElementMatch: function (a, b) {
                var c = this._.definition;
                if (!a || !c.ignoreReadonly && a.isReadOnly())return false;
                var d = a.getName();
                if (typeof this.element == "string" ? d == this.element : d in this.element) {
                    if (!b && !a.hasAttributes())return true;
                    if (d = c._AC)c = d; else {
                        var d = {}, e = 0, f = c.attributes;
                        if (f)for (var g in f) {
                            e++;
                            d[g] = f[g]
                        }
                        if (g = CKEDITOR.style.getStyleText(c)) {
                            d.style || e++;
                            d.style = g
                        }
                        d._length = e;
                        c = c._AC = d
                    }
                    if (c._length) {
                        for (var h in c)if (h != "_length") {
                            e = a.getAttribute(h) || "";
                            if (h == "style")a:{
                                d = c[h];
                                typeof d ==
                                    "string" && (d = CKEDITOR.tools.parseCssText(d));
                                typeof e == "string" && (e = CKEDITOR.tools.parseCssText(e, true));
                                g = void 0;
                                for (g in d)if (!(g in e && (e[g] == d[g] || d[g] == "inherit" || e[g] == "inherit"))) {
                                    d = false;
                                    break a
                                }
                                d = true
                            } else d = c[h] == e;
                            if (d) {
                                if (!b)return true
                            } else if (b)return false
                        }
                        if (b)return true
                    } else return true
                }
                return false
            }, checkElementRemovable: function (a, b) {
                if (this.checkElementMatch(a, b))return true;
                var c = t(this)[a.getName()];
                if (c) {
                    var d;
                    if (!(c = c.attributes))return true;
                    for (var e = 0; e < c.length; e++) {
                        d =
                            c[e][0];
                        if (d = a.getAttribute(d)) {
                            var f = c[e][1];
                            if (f === null || typeof f == "string" && d == f || f.test(d))return true
                        }
                    }
                }
                return false
            }, buildPreview: function (a) {
                var b = this._.definition, c = [], d = b.element;
                d == "bdo" && (d = "span");
                var c = ["<", d], e = b.attributes;
                if (e)for (var f in e)c.push(" ", f, '="', e[f], '"');
                (e = CKEDITOR.style.getStyleText(b)) && c.push(' style="', e, '"');
                c.push(">", a || b.name, "</", d, ">");
                return c.join("")
            }, getDefinition: function () {
                return this._.definition
            }};
        CKEDITOR.style.getStyleText = function (a) {
            var b = a._ST;
            if (b)return b;
            var b = a.styles, c = a.attributes && a.attributes.style || "", d = "";
            c.length && (c = c.replace(z, ";"));
            for (var e in b) {
                var f = b[e], g = (e + ":" + f).replace(z, ";");
                f == "inherit" ? d = d + g : c = c + g
            }
            c.length && (c = CKEDITOR.tools.normalizeCssText(c, true));
            return a._ST = c + d
        }
    })();
    CKEDITOR.styleCommand = function (a, c) {
        this.requiredContent = this.allowedContent = this.style = a;
        CKEDITOR.tools.extend(this, c, true)
    };
    CKEDITOR.styleCommand.prototype.exec = function (a) {
        a.focus();
        this.state == CKEDITOR.TRISTATE_OFF ? a.applyStyle(this.style) : this.state == CKEDITOR.TRISTATE_ON && a.removeStyle(this.style)
    };
    CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet");
    CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet);
    CKEDITOR.loadStylesSet = function (a, c, b) {
        CKEDITOR.stylesSet.addExternal(a, c, "");
        CKEDITOR.stylesSet.load(a, b)
    };
    CKEDITOR.editor.prototype.getStylesSet = function (a) {
        if (this._.stylesDefinitions)a(this._.stylesDefinitions); else {
            var c = this, b = c.config.stylesCombo_stylesSet || c.config.stylesSet;
            if (b === false)a(null); else if (b instanceof Array) {
                c._.stylesDefinitions = b;
                a(b)
            } else {
                b || (b = "default");
                var b = b.split(":"), f = b[0];
                CKEDITOR.stylesSet.addExternal(f, b[1] ? b.slice(1).join(":") : CKEDITOR.getUrl("styles.js"), "");
                CKEDITOR.stylesSet.load(f, function (b) {
                    c._.stylesDefinitions = b[f];
                    a(c._.stylesDefinitions)
                })
            }
        }
    };
    CKEDITOR.dom.comment = function (a, c) {
        typeof a == "string" && (a = (c ? c.$ : document).createComment(a));
        CKEDITOR.dom.domObject.call(this, a)
    };
    CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node;
    CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, {type: CKEDITOR.NODE_COMMENT, getOuterHtml: function () {
        return"<\!--" + this.$.nodeValue + "--\>"
    }});
    (function () {
        var a = {}, c;
        for (c in CKEDITOR.dtd.$blockLimit)c in CKEDITOR.dtd.$list || (a[c] = 1);
        var b = {};
        for (c in CKEDITOR.dtd.$block)c in CKEDITOR.dtd.$blockLimit || c in CKEDITOR.dtd.$empty || (b[c] = 1);
        CKEDITOR.dom.elementPath = function (c, e) {
            var d = null, j = null, l = [], e = e || c.getDocument().getBody(), i = c;
            do if (i.type == CKEDITOR.NODE_ELEMENT) {
                l.push(i);
                if (!this.lastElement) {
                    this.lastElement = i;
                    if (i.is(CKEDITOR.dtd.$object))continue
                }
                var m = i.getName();
                if (!j) {
                    !d && b[m] && (d = i);
                    if (a[m]) {
                        var n;
                        if (n = !d) {
                            if (m = m == "div") {
                                a:{
                                    m =
                                        i.getChildren();
                                    n = 0;
                                    for (var r = m.count(); n < r; n++) {
                                        var p = m.getItem(n);
                                        if (p.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[p.getName()]) {
                                            m = true;
                                            break a
                                        }
                                    }
                                    m = false
                                }
                                m = !m && !i.equals(e)
                            }
                            n = m
                        }
                        n ? d = i : j = i
                    }
                }
                if (i.equals(e))break
            } while (i = i.getParent());
            this.block = d;
            this.blockLimit = j;
            this.root = e;
            this.elements = l
        }
    })();
    CKEDITOR.dom.elementPath.prototype = {compare: function (a) {
        var c = this.elements, a = a && a.elements;
        if (!a || c.length != a.length)return false;
        for (var b = 0; b < c.length; b++)if (!c[b].equals(a[b]))return false;
        return true
    }, contains: function (a, c, b) {
        var f;
        typeof a == "string" && (f = function (b) {
            return b.getName() == a
        });
        a instanceof CKEDITOR.dom.element ? f = function (b) {
            return b.equals(a)
        } : CKEDITOR.tools.isArray(a) ? f = function (b) {
            return CKEDITOR.tools.indexOf(a, b.getName()) > -1
        } : typeof a == "function" ? f = a : typeof a == "object" && (f =
            function (b) {
                return b.getName()in a
            });
        var e = this.elements, d = e.length;
        c && d--;
        if (b) {
            e = Array.prototype.slice.call(e, 0);
            e.reverse()
        }
        for (c = 0; c < d; c++)if (f(e[c]))return e[c];
        return null
    }, isContextFor: function (a) {
        var c;
        if (a in CKEDITOR.dtd.$block) {
            c = this.contains(CKEDITOR.dtd.$intermediate) || this.root.equals(this.block) && this.block || this.blockLimit;
            return!!c.getDtd()[a]
        }
        return true
    }, direction: function () {
        return(this.block || this.blockLimit || this.root).getDirection(1)
    }};
    CKEDITOR.dom.text = function (a, c) {
        typeof a == "string" && (a = (c ? c.$ : document).createTextNode(a));
        this.$ = a
    };
    CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node;
    CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {type: CKEDITOR.NODE_TEXT, getLength: function () {
        return this.$.nodeValue.length
    }, getText: function () {
        return this.$.nodeValue
    }, setText: function (a) {
        this.$.nodeValue = a
    }, split: function (a) {
        var c = this.$.parentNode, b = c.childNodes.length, f = this.getLength(), e = this.getDocument(), d = new CKEDITOR.dom.text(this.$.splitText(a), e);
        if (c.childNodes.length == b)if (a >= f) {
            d = e.createText("");
            d.insertAfter(this)
        } else {
            a = e.createText("");
            a.insertAfter(d);
            a.remove()
        }
        return d
    }, substring: function (a, c) {
        return typeof c != "number" ? this.$.nodeValue.substr(a) : this.$.nodeValue.substring(a, c)
    }});
    (function () {
        function a(a, c, e) {
            var d = a.serializable, j = c[e ? "endContainer" : "startContainer"], l = e ? "endOffset" : "startOffset", i = d ? c.document.getById(a.startNode) : a.startNode, a = d ? c.document.getById(a.endNode) : a.endNode;
            if (j.equals(i.getPrevious())) {
                c.startOffset = c.startOffset - j.getLength() - a.getPrevious().getLength();
                j = a.getNext()
            } else if (j.equals(a.getPrevious())) {
                c.startOffset = c.startOffset - j.getLength();
                j = a.getNext()
            }
            j.equals(i.getParent()) && c[l]++;
            j.equals(a.getParent()) && c[l]++;
            c[e ? "endContainer" : "startContainer"] =
                j;
            return c
        }

        CKEDITOR.dom.rangeList = function (a) {
            if (a instanceof CKEDITOR.dom.rangeList)return a;
            a ? a instanceof CKEDITOR.dom.range && (a = [a]) : a = [];
            return CKEDITOR.tools.extend(a, c)
        };
        var c = {createIterator: function () {
            var a = this, c = CKEDITOR.dom.walker.bookmark(), e = [], d;
            return{getNextRange: function (j) {
                d = d == void 0 ? 0 : d + 1;
                var l = a[d];
                if (l && a.length > 1) {
                    if (!d)for (var i = a.length - 1; i >= 0; i--)e.unshift(a[i].createBookmark(true));
                    if (j)for (var m = 0; a[d + m + 1];) {
                        for (var n = l.document, j = 0, i = n.getById(e[m].endNode), n = n.getById(e[m +
                            1].startNode); ;) {
                            i = i.getNextSourceNode(false);
                            if (n.equals(i))j = 1; else if (c(i) || i.type == CKEDITOR.NODE_ELEMENT && i.isBlockBoundary())continue;
                            break
                        }
                        if (!j)break;
                        m++
                    }
                    for (l.moveToBookmark(e.shift()); m--;) {
                        i = a[++d];
                        i.moveToBookmark(e.shift());
                        l.setEnd(i.endContainer, i.endOffset)
                    }
                }
                return l
            }}
        }, createBookmarks: function (b) {
            for (var c = [], e, d = 0; d < this.length; d++) {
                c.push(e = this[d].createBookmark(b, true));
                for (var j = d + 1; j < this.length; j++) {
                    this[j] = a(e, this[j]);
                    this[j] = a(e, this[j], true)
                }
            }
            return c
        }, createBookmarks2: function (a) {
            for (var c =
                [], e = 0; e < this.length; e++)c.push(this[e].createBookmark2(a));
            return c
        }, moveToBookmarks: function (a) {
            for (var c = 0; c < this.length; c++)this[c].moveToBookmark(a[c])
        }}
    })();
    (function () {
        function a() {
            return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/")
        }

        function c(b) {
            var c = CKEDITOR.skin["ua_" + b], d = CKEDITOR.env;
            if (c)for (var c = c.split(",").sort(function (a, b) {
                return a > b ? -1 : 1
            }), e = 0, f; e < c.length; e++) {
                f = c[e];
                if (d.ie && (f.replace(/^ie/, "") == d.version || d.quirks && f == "iequirks"))f = "ie";
                if (d[f]) {
                    b = b + ("_" + c[e]);
                    break
                }
            }
            return CKEDITOR.getUrl(a() + b + ".css")
        }

        function b(a, b) {
            if (!d[a]) {
                CKEDITOR.document.appendStyleSheet(c(a));
                d[a] = 1
            }
            b && b()
        }

        function f(a) {
            var b = a.getById(j);
            if (!b) {
                b = a.getHead().append("style");
                b.setAttribute("id", j);
                b.setAttribute("type", "text/css")
            }
            return b
        }

        function e(a, b, c) {
            var d, e, f;
            if (CKEDITOR.env.webkit) {
                b = b.split("}").slice(0, -1);
                for (e = 0; e < b.length; e++)b[e] = b[e].split("{")
            }
            for (var i = 0; i < a.length; i++)if (CKEDITOR.env.webkit)for (e = 0; e < b.length; e++) {
                f = b[e][1];
                for (d = 0; d < c.length; d++)f = f.replace(c[d][0], c[d][1]);
                a[i].$.sheet.addRule(b[e][0], f)
            } else {
                f = b;
                for (d = 0; d < c.length; d++)f = f.replace(c[d][0], c[d][1]);
                CKEDITOR.env.ie ?
                    a[i].$.styleSheet.cssText = a[i].$.styleSheet.cssText + f : a[i].$.innerHTML = a[i].$.innerHTML + f
            }
        }

        var d = {};
        CKEDITOR.skin = {path: a, loadPart: function (c, d) {
            CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0] ? CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(a() + "skin.js"), function () {
                b(c, d)
            }) : b(c, d)
        }, getPath: function (a) {
            return CKEDITOR.getUrl(c(a))
        }, icons: {}, addIcon: function (a, b, c) {
            a = a.toLowerCase();
            this.icons[a] || (this.icons[a] = {path: b, offset: c || 0})
        }, getIconStyle: function (a, b, c, d) {
            var e;
            if (a) {
                a = a.toLowerCase();
                b &&
                (e = this.icons[a + "-rtl"]);
                e || (e = this.icons[a])
            }
            a = c || e && e.path || "";
            d = d || e && e.offset;
            return a && "background-image:url(" + CKEDITOR.getUrl(a) + ");background-position:0 " + d + "px;"
        }};
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {getUiColor: function () {
            return this.uiColor
        }, setUiColor: function (a) {
            var b = f(CKEDITOR.document);
            return(this.setUiColor = function (a) {
                var c = CKEDITOR.skin.chameleon, d = [
                    [i, a]
                ];
                this.uiColor = a;
                e([b], c(this, "editor"), d);
                e(l, c(this, "panel"), d)
            }).call(this, a)
        }});
        var j = "cke_ui_color", l = [], i = /\$color/g;
        CKEDITOR.on("instanceLoaded", function (a) {
            if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
                var b = a.editor, a = function (a) {
                    a = (a.data[0] || a.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
                    if (!a.getById("cke_ui_color")) {
                        a = f(a);
                        l.push(a);
                        var c = b.getUiColor();
                        c && e([a], CKEDITOR.skin.chameleon(b, "panel"), [
                            [i, c]
                        ])
                    }
                };
                b.on("panelShow", a);
                b.on("menuShow", a);
                b.config.uiColor && b.setUiColor(b.config.uiColor)
            }
        })
    })();
    (function () {
        if (CKEDITOR.env.webkit)CKEDITOR.env.hc = false; else {
            var a = CKEDITOR.dom.element.createFromHtml('<div style="width:0px;height:0px;position:absolute;left:-10000px;border: 1px solid;border-color: red blue;"></div>', CKEDITOR.document);
            a.appendTo(CKEDITOR.document.getHead());
            try {
                CKEDITOR.env.hc = a.getComputedStyle("border-top-color") == a.getComputedStyle("border-right-color")
            } catch (c) {
                CKEDITOR.env.hc = false
            }
            a.remove()
        }
        if (CKEDITOR.env.hc)CKEDITOR.env.cssClass = CKEDITOR.env.cssClass + " cke_hc";
        CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
        CKEDITOR.status = "loaded";
        CKEDITOR.fireOnce("loaded");
        if (a = CKEDITOR._.pending) {
            delete CKEDITOR._.pending;
            for (var b = 0; b < a.length; b++) {
                CKEDITOR.editor.prototype.constructor.apply(a[b][0], a[b][1]);
                CKEDITOR.add(a[b][0])
            }
        }
    })();
    /*
     Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
     For licensing, see LICENSE.html or http://ckeditor.com/license
     */
    CKEDITOR.skin.name = "moono";
    CKEDITOR.skin.ua_editor = "ie,iequirks,ie7,ie8,gecko";
    CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8,opera";
    CKEDITOR.skin.chameleon = function () {
        var b = function () {
            return function (b, e) {
                for (var a = b.match(/[^#]./g), c = 0; 3 > c; c++) {
                    var f = a, h = c, d;
                    d = parseInt(a[c], 16);
                    d = ("0" + (0 > e ? 0 | d * (1 + e) : 0 | d + (255 - d) * e).toString(16)).slice(-2);
                    f[h] = d
                }
                return"#" + a.join("")
            }
        }(), c = function () {
            var b = new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
            return function (c, a) {
                return b.output({from: c, to: a})
            }
        }(), f = {editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
            panel: new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")};
        return function (g, e) {
            var a = g.uiColor, a = {id: "." + g.id, defaultBorder: b(a, -0.1), defaultGradient: c(b(a, 0.9), a), lightGradient: c(b(a, 1), b(a, 0.7)), mediumGradient: c(b(a, 0.8), b(a, 0.5)), ckeButtonOn: c(b(a, 0.6), b(a, 0.7)), ckeResizer: b(a, -0.4), ckeToolbarSeparator: b(a, 0.5), ckeColorauto: b(a, 0.8), dialogBody: b(a, 0.7), dialogTabSelected: c("#FFFFFF", "#FFFFFF"), dialogTabSelectedBorder: "#FFF", elementsPathColor: b(a, -0.6), elementsPathBg: a, menubuttonIcon: b(a, 0.5), menubuttonIconHover: b(a, 0.3)};
            return f[e].output(a).replace(/\[/g,
                "{").replace(/\]/g, "}")
        }
    }();
    CKEDITOR.plugins.add("dialogui", {onLoad: function () {
        var h = function (b) {
            this._ || (this._ = {});
            this._["default"] = this._.initValue = b["default"] || "";
            this._.required = b.required || !1;
            for (var a = [this._], d = 1; d < arguments.length; d++)a.push(arguments[d]);
            a.push(!0);
            CKEDITOR.tools.extend.apply(CKEDITOR.tools, a);
            return this._
        }, r = {build: function (b, a, d) {
            return new CKEDITOR.ui.dialog.textInput(b, a, d)
        }}, l = {build: function (b, a, d) {
            return new CKEDITOR.ui.dialog[a.type](b, a, d)
        }}, n = {isChanged: function () {
            return this.getValue() !=
                this.getInitValue()
        }, reset: function (b) {
            this.setValue(this.getInitValue(), b)
        }, setInitValue: function () {
            this._.initValue = this.getValue()
        }, resetInitValue: function () {
            this._.initValue = this._["default"]
        }, getInitValue: function () {
            return this._.initValue
        }}, o = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {onChange: function (b, a) {
            this._.domOnChangeRegistered || (b.on("load", function () {
                this.getInputElement().on("change", function () {
                        b.parts.dialog.isVisible() && this.fire("change", {value: this.getValue()})
                    },
                    this)
            }, this), this._.domOnChangeRegistered = !0);
            this.on("change", a)
        }}, !0), s = /^on([A-Z]\w+)/, p = function (b) {
            for (var a in b)(s.test(a) || "title" == a || "type" == a) && delete b[a];
            return b
        };
        CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {labeledElement: function (b, a, d, e) {
            if (!(4 > arguments.length)) {
                var c = h.call(this, a);
                c.labelId = CKEDITOR.tools.getNextId() + "_label";
                this._.children = [];
                CKEDITOR.ui.dialog.uiElement.call(this, b, a, d, "div", null, {role: "presentation"}, function () {
                    var f = [], d = a.required ? " cke_required" : "";
                    "horizontal" !=
                        a.labelLayout ? f.push('<label class="cke_dialog_ui_labeled_label' + d + '" ', ' id="' + c.labelId + '"', c.inputId ? ' for="' + c.inputId + '"' : "", (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">", a.label, "</label>", '<div class="cke_dialog_ui_labeled_content"' + (a.controlStyle ? ' style="' + a.controlStyle + '"' : "") + ' roles="presentation">', e.call(this, b, a), "</div>") : (d = {type: "hbox", widths: a.widths, padding: 0, children: [
                        {type: "html", html: '<label class="cke_dialog_ui_labeled_label' + d + '" id="' + c.labelId + '" for="' + c.inputId + '"' +
                            (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">" + CKEDITOR.tools.htmlEncode(a.label) + "</span>"},
                        {type: "html", html: '<span class="cke_dialog_ui_labeled_content"' + (a.controlStyle ? ' style="' + a.controlStyle + '"' : "") + ">" + e.call(this, b, a) + "</span>"}
                    ]}, CKEDITOR.dialog._.uiElementBuilders.hbox.build(b, d, f));
                    return f.join("")
                })
            }
        }, textInput: function (b, a, d) {
            if (!(3 > arguments.length)) {
                h.call(this, a);
                var e = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput", c = {"class": "cke_dialog_ui_input_" + a.type, id: e, type: a.type};
                a.validate && (this.validate = a.validate);
                a.maxLength && (c.maxlength = a.maxLength);
                a.size && (c.size = a.size);
                a.inputStyle && (c.style = a.inputStyle);
                var f = this, i = !1;
                b.on("load", function () {
                    f.getInputElement().on("keydown", function (a) {
                        a.data.getKeystroke() == 13 && (i = true)
                    });
                    f.getInputElement().on("keyup", function (a) {
                        if (a.data.getKeystroke() == 13 && i) {
                            b.getButton("ok") && setTimeout(function () {
                                b.getButton("ok").click()
                            }, 0);
                            i = false
                        }
                    }, null, null, 1E3)
                });
                CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function () {
                    var b =
                        ['<div class="cke_dialog_ui_input_', a.type, '" roles="presentation"'];
                    a.width && b.push('style="width:' + a.width + '" ');
                    b.push("><input ");
                    c["aria-labelledby"] = this._.labelId;
                    this._.required && (c["aria-required"] = this._.required);
                    for (var f in c)b.push(f + '="' + c[f] + '" ');
                    b.push(" /></div>");
                    return b.join("")
                })
            }
        }, textarea: function (b, a, d) {
            if (!(3 > arguments.length)) {
                h.call(this, a);
                var e = this, c = this._.inputId = CKEDITOR.tools.getNextId() + "_textarea", f = {};
                a.validate && (this.validate = a.validate);
                f.rows = a.rows || 5;
                f.cols =
                    a.cols || 20;
                f["class"] = "cke_dialog_ui_input_textarea " + (a["class"] || "");
                "undefined" != typeof a.inputStyle && (f.style = a.inputStyle);
                a.dir && (f.dir = a.dir);
                CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function () {
                    f["aria-labelledby"] = this._.labelId;
                    this._.required && (f["aria-required"] = this._.required);
                    var a = ['<div class="cke_dialog_ui_input_textarea" roles="presentation"><textarea id="', c, '" '], b;
                    for (b in f)a.push(b + '="' + CKEDITOR.tools.htmlEncode(f[b]) + '" ');
                    a.push(">", CKEDITOR.tools.htmlEncode(e._["default"]),
                        "</textarea></div>");
                    return a.join("")
                })
            }
        }, checkbox: function (b, a, d) {
            if (!(3 > arguments.length)) {
                var e = h.call(this, a, {"default": !!a["default"]});
                a.validate && (this.validate = a.validate);
                CKEDITOR.ui.dialog.uiElement.call(this, b, a, d, "span", null, null, function () {
                    var c = CKEDITOR.tools.extend({}, a, {id: a.id ? a.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"}, true), f = [], d = CKEDITOR.tools.getNextId() + "_label", g = {"class": "cke_dialog_ui_checkbox_input", type: "checkbox", "aria-labelledby": d};
                    p(c);
                    if (a["default"])g.checked =
                        "checked";
                    if (typeof c.inputStyle != "undefined")c.style = c.inputStyle;
                    e.checkbox = new CKEDITOR.ui.dialog.uiElement(b, c, f, "input", null, g);
                    f.push(' <label id="', d, '" for="', g.id, '"' + (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(a.label), "</label>");
                    return f.join("")
                })
            }
        }, radio: function (b, a, d) {
            if (!(3 > arguments.length)) {
                h.call(this, a);
                this._["default"] || (this._["default"] = this._.initValue = a.items[0][1]);
                a.validate && (this.validate = a.valdiate);
                var e = [], c = this;
                CKEDITOR.ui.dialog.labeledElement.call(this,
                    b, a, d, function () {
                        for (var f = [], d = [], g = a.id ? a.id + "_radio" : CKEDITOR.tools.getNextId() + "_radio", k = 0; k < a.items.length; k++) {
                            var j = a.items[k], h = j[2] !== void 0 ? j[2] : j[0], l = j[1] !== void 0 ? j[1] : j[0], m = CKEDITOR.tools.getNextId() + "_radio_input", n = m + "_label", m = CKEDITOR.tools.extend({}, a, {id: m, title: null, type: null}, true), h = CKEDITOR.tools.extend({}, m, {title: h}, true), o = {type: "radio", "class": "cke_dialog_ui_radio_input", name: g, value: l, "aria-labelledby": n}, q = [];
                            if (c._["default"] == l)o.checked = "checked";
                            p(m);
                            p(h);
                            if (typeof m.inputStyle !=
                                "undefined")m.style = m.inputStyle;
                            e.push(new CKEDITOR.ui.dialog.uiElement(b, m, q, "input", null, o));
                            q.push(" ");
                            new CKEDITOR.ui.dialog.uiElement(b, h, q, "label", null, {id: n, "for": o.id}, j[0]);
                            f.push(q.join(""))
                        }
                        new CKEDITOR.ui.dialog.hbox(b, e, f, d);
                        return d.join("")
                    });
                this._.children = e
            }
        }, button: function (b, a, d) {
            if (arguments.length) {
                "function" == typeof a && (a = a(b.getParentEditor()));
                h.call(this, a, {disabled: a.disabled || !1});
                CKEDITOR.event.implementOn(this);
                var e = this;
                b.on("load", function () {
                    var a = this.getElement();
                    (function () {
                        a.on("click", e.click, e);
                        a.on("keydown", function (a) {
                            a.data.getKeystroke()in{32: 1} && (e.click(), a.data.preventDefault())
                        })
                    })();
                    a.unselectable()
                }, this);
                var c = CKEDITOR.tools.extend({}, a);
                delete c.style;
                var f = CKEDITOR.tools.getNextId() + "_label";
                CKEDITOR.ui.dialog.uiElement.call(this, b, c, d, "a", null, {style: a.style, href: "javascript:void(0)", title: a.label, hidefocus: "true", "class": a["class"], role: "button", "aria-labelledby": f}, '<span id="' + f + '" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(a.label) +
                    "</span>")
            }
        }, select: function (b, a, d) {
            if (!(3 > arguments.length)) {
                var e = h.call(this, a);
                a.validate && (this.validate = a.validate);
                e.inputId = CKEDITOR.tools.getNextId() + "_select";
                CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function () {
                    var c = CKEDITOR.tools.extend({}, a, {id: a.id ? a.id + "_select" : CKEDITOR.tools.getNextId() + "_select"}, true), d = [], i = [], g = {id: e.inputId, "class": "cke_dialog_ui_input_select", "aria-labelledby": this._.labelId};
                    d.push('<div class="cke_dialog_ui_input_', a.type, '" roles="presentation"');
                    a.width && d.push('style="width:' + a.width + '" ');
                    d.push(">");
                    if (a.size != void 0)g.size = a.size;
                    if (a.multiple != void 0)g.multiple = a.multiple;
                    p(c);
                    for (var k = 0, j; k < a.items.length && (j = a.items[k]); k++)i.push('<option value="', CKEDITOR.tools.htmlEncode(j[1] !== void 0 ? j[1] : j[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(j[0]));
                    if (typeof c.inputStyle != "undefined")c.style = c.inputStyle;
                    e.select = new CKEDITOR.ui.dialog.uiElement(b, c, d, "select", null, g, i.join(""));
                    d.push("</div>");
                    return d.join("")
                })
            }
        },
            file: function (b, a, d) {
                if (!(3 > arguments.length)) {
                    void 0 === a["default"] && (a["default"] = "");
                    var e = CKEDITOR.tools.extend(h.call(this, a), {definition: a, buttons: []});
                    a.validate && (this.validate = a.validate);
                    b.on("load", function () {
                        CKEDITOR.document.getById(e.frameId).getParent().addClass("cke_dialog_ui_input_file")
                    });
                    CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function () {
                        e.frameId = CKEDITOR.tools.getNextId() + "_fileInput";
                        var b = CKEDITOR.env.isCustomDomain(), d = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" roles="presentation" id="',
                            e.frameId, '" title="', a.label, '" src="javascript:void('];
                        d.push(b ? "(function(){document.open();document.domain='" + document.domain + "';document.close();})()" : "0");
                        d.push(')"></iframe>');
                        return d.join("")
                    })
                }
            }, fileButton: function (b, a, d) {
                if (!(3 > arguments.length)) {
                    h.call(this, a);
                    var e = this;
                    a.validate && (this.validate = a.validate);
                    var c = CKEDITOR.tools.extend({}, a), f = c.onClick;
                    c.className = (c.className ? c.className + " " : "") + "cke_dialog_ui_button";
                    c.onClick = function (c) {
                        var d = a["for"];
                        if (!f || f.call(this, c) !== false) {
                            b.getContentElement(d[0],
                                d[1]).submit();
                            this.disable()
                        }
                    };
                    b.on("load", function () {
                        b.getContentElement(a["for"][0], a["for"][1])._.buttons.push(e)
                    });
                    CKEDITOR.ui.dialog.button.call(this, b, c, d)
                }
            }, html: function () {
                var b = /^\s*<[\w:]+\s+([^>]*)?>/, a = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/, d = /\/$/;
                return function (e, c, f) {
                    if (!(3 > arguments.length)) {
                        var i = [], g = c.html;
                        "<" != g.charAt(0) && (g = "<span>" + g + "</span>");
                        var k = c.focus;
                        if (k) {
                            var j = this.focus;
                            this.focus = function () {
                                ("function" == typeof k ? k : j).call(this);
                                this.fire("focus")
                            };
                            c.isFocusable &&
                            (this.isFocusable = this.isFocusable);
                            this.keyboardFocusable = !0
                        }
                        CKEDITOR.ui.dialog.uiElement.call(this, e, c, i, "span", null, null, "");
                        i = i.join("").match(b);
                        g = g.match(a) || ["", "", ""];
                        d.test(g[1]) && (g[1] = g[1].slice(0, -1), g[2] = "/" + g[2]);
                        f.push([g[1], " ", i[1] || "", g[2]].join(""))
                    }
                }
            }(), fieldset: function (b, a, d, e, c) {
                var f = c.label;
                this._ = {children: a};
                CKEDITOR.ui.dialog.uiElement.call(this, b, c, e, "fieldset", null, null, function () {
                    var a = [];
                    f && a.push("<legend" + (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">" + f + "</legend>");
                    for (var b = 0; b < d.length; b++)a.push(d[b]);
                    return a.join("")
                })
            }}, !0);
        CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement;
        CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {setLabel: function (b) {
            var a = CKEDITOR.document.getById(this._.labelId);
            1 > a.getChildCount() ? (new CKEDITOR.dom.text(b, CKEDITOR.document)).appendTo(a) : a.getChild(0).$.nodeValue = b;
            return this
        }, getLabel: function () {
            var b = CKEDITOR.document.getById(this._.labelId);
            return!b || 1 > b.getChildCount() ?
                "" : b.getChild(0).getText()
        }, eventProcessors: o}, !0);
        CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {click: function () {
            return!this._.disabled ? this.fire("click", {dialog: this._.dialog}) : !1
        }, enable: function () {
            this._.disabled = !1;
            var b = this.getElement();
            b && b.removeClass("cke_disabled")
        }, disable: function () {
            this._.disabled = !0;
            this.getElement().addClass("cke_disabled")
        }, isVisible: function () {
            return this.getElement().getFirst().isVisible()
        }, isEnabled: function () {
            return!this._.disabled
        },
            eventProcessors: CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {onClick: function (b, a) {
                this.on("click", function () {
                    a.apply(this, arguments)
                })
            }}, !0), accessKeyUp: function () {
                this.click()
            }, accessKeyDown: function () {
                this.focus()
            }, keyboardFocusable: !0}, !0);
        CKEDITOR.ui.dialog.textInput.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {getInputElement: function () {
            return CKEDITOR.document.getById(this._.inputId)
        }, focus: function () {
            var b = this.selectParentTab();
            setTimeout(function () {
                var a = b.getInputElement();
                a && a.$.focus()
            }, 0)
        }, select: function () {
            var b = this.selectParentTab();
            setTimeout(function () {
                var a = b.getInputElement();
                a && (a.$.focus(), a.$.select())
            }, 0)
        }, accessKeyUp: function () {
            this.select()
        }, setValue: function (b) {
            !b && (b = "");
            return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this, arguments)
        }, keyboardFocusable: !0}, n, !0);
        CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput;
        CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement,
            {getInputElement: function () {
                return this._.select.getElement()
            }, add: function (b, a, d) {
                var e = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document), c = this.getInputElement().$;
                e.$.text = b;
                e.$.value = void 0 === a || null === a ? b : a;
                void 0 === d || null === d ? CKEDITOR.env.ie ? c.add(e.$) : c.add(e.$, null) : c.add(e.$, d);
                return this
            }, remove: function (b) {
                this.getInputElement().$.remove(b);
                return this
            }, clear: function () {
                for (var b = this.getInputElement().$; 0 < b.length;)b.remove(0);
                return this
            }, keyboardFocusable: !0},
            n, !0);
        CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {getInputElement: function () {
            return this._.checkbox.getElement()
        }, setValue: function (b, a) {
            this.getInputElement().$.checked = b;
            !a && this.fire("change", {value: b})
        }, getValue: function () {
            return this.getInputElement().$.checked
        }, accessKeyUp: function () {
            this.setValue(!this.getValue())
        }, eventProcessors: {onChange: function (b, a) {
            if (!CKEDITOR.env.ie || 8 < CKEDITOR.env.version)return o.onChange.apply(this, arguments);
            b.on("load",
                function () {
                    var a = this._.checkbox.getElement();
                    a.on("propertychange", function (b) {
                        b = b.data.$;
                        "checked" == b.propertyName && this.fire("change", {value: a.$.checked})
                    }, this)
                }, this);
            this.on("change", a);
            return null
        }}, keyboardFocusable: !0}, n, !0);
        CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {setValue: function (b, a) {
            for (var d = this._.children, e, c = 0; c < d.length && (e = d[c]); c++)e.getElement().$.checked = e.getValue() == b;
            !a && this.fire("change", {value: b})
        }, getValue: function () {
            for (var b =
                this._.children, a = 0; a < b.length; a++)if (b[a].getElement().$.checked)return b[a].getValue();
            return null
        }, accessKeyUp: function () {
            var b = this._.children, a;
            for (a = 0; a < b.length; a++)if (b[a].getElement().$.checked) {
                b[a].getElement().focus();
                return
            }
            b[0].getElement().focus()
        }, eventProcessors: {onChange: function (b, a) {
            if (CKEDITOR.env.ie)b.on("load", function () {
                for (var a = this._.children, b = this, c = 0; c < a.length; c++)a[c].getElement().on("propertychange", function (a) {
                    a = a.data.$;
                    "checked" == a.propertyName && this.$.checked &&
                    b.fire("change", {value: this.getAttribute("value")})
                })
            }, this), this.on("change", a); else return o.onChange.apply(this, arguments);
            return null
        }}, keyboardFocusable: !0}, n, !0);
        CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, n, {getInputElement: function () {
            var b = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
            return 0 < b.$.forms.length ? new CKEDITOR.dom.element(b.$.forms[0].elements[0]) : this.getElement()
        }, submit: function () {
            this.getInputElement().getParent().$.submit();
            return this
        }, getAction: function () {
            return this.getInputElement().getParent().$.action
        }, registerEvents: function (b) {
            var a = /^on([A-Z]\w+)/, d, e = function (a, b, c, d) {
                a.on("formLoaded", function () {
                    a.getInputElement().on(c, d, a)
                })
            }, c;
            for (c in b)if (d = c.match(a))this.eventProcessors[c] ? this.eventProcessors[c].call(this, this._.dialog, b[c]) : e(this, this._.dialog, d[1].toLowerCase(), b[c]);
            return this
        }, reset: function () {
            function b() {
                d.$.open();
                CKEDITOR.env.isCustomDomain() && (d.$.domain = document.domain);
                var b = "";
                e.size &&
                (b = e.size - (CKEDITOR.env.ie ? 7 : 0));
                var h = a.frameId + "_input";
                d.$.write(['<html dir="' + g + '" lang="' + k + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + g + '" lang="' + k + '" action="', CKEDITOR.tools.htmlEncode(e.action), '"><label id="', a.labelId, '" for="', h, '" style="display:none">', CKEDITOR.tools.htmlEncode(e.label), '</label><input id="', h, '" aria-labelledby="', a.labelId, '" type="file" name="', CKEDITOR.tools.htmlEncode(e.id ||
                    "cke_upload"), '" size="', CKEDITOR.tools.htmlEncode(0 < b ? b : ""), '" /></form></body></html>', "<script>window.parent.CKEDITOR.tools.callFunction(" + f + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + i + ")}<\/script>"].join(""));
                d.$.close();
                for (b = 0; b < c.length; b++)c[b].enable()
            }

            var a = this._, d = CKEDITOR.document.getById(a.frameId).getFrameDocument(), e = a.definition, c = a.buttons, f = this.formLoadedNumber, i = this.formUnloadNumber, g = a.dialog._.editor.lang.dir, k = a.dialog._.editor.langCode;
            f || (f = this.formLoadedNumber = CKEDITOR.tools.addFunction(function () {
                this.fire("formLoaded")
            }, this), i = this.formUnloadNumber = CKEDITOR.tools.addFunction(function () {
                this.getInputElement().clearCustomData()
            }, this), this.getDialog()._.editor.on("destroy", function () {
                CKEDITOR.tools.removeFunction(f);
                CKEDITOR.tools.removeFunction(i)
            }));
            CKEDITOR.env.gecko ? setTimeout(b, 500) : b()
        }, getValue: function () {
            return this.getInputElement().$.value || ""
        }, setInitValue: function () {
            this._.initValue = ""
        }, eventProcessors: {onChange: function (b, a) {
            this._.domOnChangeRegistered || (this.on("formLoaded", function () {
                this.getInputElement().on("change", function () {
                    this.fire("change", {value: this.getValue()})
                }, this)
            }, this), this._.domOnChangeRegistered = !0);
            this.on("change", a)
        }}, keyboardFocusable: !0}, !0);
        CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button;
        CKEDITOR.ui.dialog.fieldset.prototype = CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);
        CKEDITOR.dialog.addUIElement("text", r);
        CKEDITOR.dialog.addUIElement("password", r);
        CKEDITOR.dialog.addUIElement("textarea",
            l);
        CKEDITOR.dialog.addUIElement("checkbox", l);
        CKEDITOR.dialog.addUIElement("radio", l);
        CKEDITOR.dialog.addUIElement("button", l);
        CKEDITOR.dialog.addUIElement("select", l);
        CKEDITOR.dialog.addUIElement("file", l);
        CKEDITOR.dialog.addUIElement("fileButton", l);
        CKEDITOR.dialog.addUIElement("html", l);
        CKEDITOR.dialog.addUIElement("fieldset", {build: function (b, a, d) {
            for (var e = a.children, c, f = [], i = [], g = 0; g < e.length && (c = e[g]); g++) {
                var h = [];
                f.push(h);
                i.push(CKEDITOR.dialog._.uiElementBuilders[c.type].build(b, c, h))
            }
            return new CKEDITOR.ui.dialog[a.type](b,
                i, f, d, a)
        }})
    }});
    CKEDITOR.DIALOG_RESIZE_NONE = 0;
    CKEDITOR.DIALOG_RESIZE_WIDTH = 1;
    CKEDITOR.DIALOG_RESIZE_HEIGHT = 2;
    CKEDITOR.DIALOG_RESIZE_BOTH = 3;
    (function () {
        function p() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a, c = b - 1; c > b - a; c--)if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight)return this._.tabIdList[c % a];
            return null
        }

        function u() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId), c = b + 1; c < b + a; c++)if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight)return this._.tabIdList[c % a];
            return null
        }

        function q(a, b) {
            for (var c = a.$.getElementsByTagName("input"),
                     e = 0, d = c.length; e < d; e++) {
                var g = new CKEDITOR.dom.element(c[e]);
                "text" == g.getAttribute("type").toLowerCase() && (b ? (g.setAttribute("value", g.getCustomData("fake_value") || ""), g.removeCustomData("fake_value")) : (g.setCustomData("fake_value", g.getAttribute("value")), g.setAttribute("value", "")))
            }
        }

        function P(a, b) {
            var c = this.getInputElement();
            c && (a ? c.removeAttribute("aria-invalid") : c.setAttribute("aria-invalid", !0));
            a || (this.select ? this.select() : this.focus());
            b && alert(b);
            this.fire("validated", {valid: a, msg: b})
        }

        function Q() {
            var a = this.getInputElement();
            a && a.removeAttribute("aria-invalid")
        }

        function R(a) {
            var a = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog", S).output({id: CKEDITOR.tools.getNextNumber(), editorId: a.id, langDir: a.lang.dir, langCode: a.langCode, editorDialogClass: "cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog", closeTitle: a.lang.common.close})), b = a.getChild([0, 0, 0, 0, 0]), c = b.getChild(0), e = b.getChild(1);
            if (CKEDITOR.env.ie && !CKEDITOR.env.ie6Compat) {
                var d = CKEDITOR.env.isCustomDomain(),
                    d = "javascript:void(function(){" + encodeURIComponent("document.open();" + (d ? 'document.domain="' + document.domain + '";' : "") + "document.close();") + "}())";
                CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' + d + '" tabIndex="-1"></iframe>').appendTo(b.getParent())
            }
            c.unselectable();
            e.unselectable();
            return{element: a, parts: {dialog: a.getChild(0), title: c, close: e, tabs: b.getChild(2), contents: b.getChild([3, 0, 0, 0]), footer: b.getChild([3, 0, 1, 0])}}
        }

        function H(a, b, c) {
            this.element = b;
            this.focusIndex = c;
            this.tabIndex = 0;
            this.isFocusable = function () {
                return!b.getAttribute("disabled") && b.isVisible()
            };
            this.focus = function () {
                a._.currentFocusIndex = this.focusIndex;
                this.element.focus()
            };
            b.on("keydown", function (a) {
                a.data.getKeystroke()in{32: 1, 13: 1} && this.fire("click")
            });
            b.on("focus", function () {
                this.fire("mouseover")
            });
            b.on("blur", function () {
                this.fire("mouseout")
            })
        }

        function T(a) {
            function b() {
                a.layout()
            }

            var c = CKEDITOR.document.getWindow();
            c.on("resize", b);
            a.on("hide", function () {
                c.removeListener("resize",
                    b)
            })
        }

        function I(a, b) {
            this._ = {dialog: a};
            CKEDITOR.tools.extend(this, b)
        }

        function U(a) {
            function b(b) {
                var c = a.getSize(), h = CKEDITOR.document.getWindow().getViewPaneSize(), o = b.data.$.screenX, i = b.data.$.screenY, n = o - e.x, l = i - e.y;
                e = {x: o, y: i};
                d.x += n;
                d.y += l;
                a.move(d.x + k[3] < f ? -k[3] : d.x - k[1] > h.width - c.width - f ? h.width - c.width + ("rtl" == g.lang.dir ? 0 : k[1]) : d.x, d.y + k[0] < f ? -k[0] : d.y - k[2] > h.height - c.height - f ? h.height - c.height + k[2] : d.y, 1);
                b.data.preventDefault()
            }

            function c() {
                CKEDITOR.document.removeListener("mousemove",
                    b);
                CKEDITOR.document.removeListener("mouseup", c);
                if (CKEDITOR.env.ie6Compat) {
                    var a = r.getChild(0).getFrameDocument();
                    a.removeListener("mousemove", b);
                    a.removeListener("mouseup", c)
                }
            }

            var e = null, d = null;
            a.getElement().getFirst();
            var g = a.getParentEditor(), f = g.config.dialog_magnetDistance, k = CKEDITOR.skin.margins || [0, 0, 0, 0];
            "undefined" == typeof f && (f = 20);
            a.parts.title.on("mousedown", function (f) {
                e = {x: f.data.$.screenX, y: f.data.$.screenY};
                CKEDITOR.document.on("mousemove", b);
                CKEDITOR.document.on("mouseup", c);
                d =
                    a.getPosition();
                if (CKEDITOR.env.ie6Compat) {
                    var g = r.getChild(0).getFrameDocument();
                    g.on("mousemove", b);
                    g.on("mouseup", c)
                }
                f.data.preventDefault()
            }, a)
        }

        function V(a) {
            var b, c;

            function e(d) {
                var e = "rtl" == k.lang.dir, i = o.width, D = o.height, E = i + (d.data.$.screenX - b) * (e ? -1 : 1) * (a._.moved ? 1 : 2), n = D + (d.data.$.screenY - c) * (a._.moved ? 1 : 2), x = a._.element.getFirst(), x = e && x.getComputedStyle("right"), y = a.getPosition();
                y.y + n > h.height && (n = h.height - y.y);
                if ((e ? x : y.x) + E > h.width)E = h.width - (e ? x : y.x);
                if (f == CKEDITOR.DIALOG_RESIZE_WIDTH ||
                    f == CKEDITOR.DIALOG_RESIZE_BOTH)i = Math.max(g.minWidth || 0, E - m);
                if (f == CKEDITOR.DIALOG_RESIZE_HEIGHT || f == CKEDITOR.DIALOG_RESIZE_BOTH)D = Math.max(g.minHeight || 0, n - j);
                a.resize(i, D);
                a._.moved || a.layout();
                d.data.preventDefault()
            }

            function d() {
                CKEDITOR.document.removeListener("mouseup", d);
                CKEDITOR.document.removeListener("mousemove", e);
                i && (i.remove(), i = null);
                if (CKEDITOR.env.ie6Compat) {
                    var a = r.getChild(0).getFrameDocument();
                    a.removeListener("mouseup", d);
                    a.removeListener("mousemove", e)
                }
            }

            var g = a.definition, f = g.resizable;
            if (f != CKEDITOR.DIALOG_RESIZE_NONE) {
                var k = a.getParentEditor(), m, j, h, o, i, n = CKEDITOR.tools.addFunction(function (f) {
                    o = a.getSize();
                    var g = a.parts.contents;
                    g.$.getElementsByTagName("iframe").length && (i = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>'), g.append(i));
                    j = o.height - a.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.opera || CKEDITOR.env.ie && CKEDITOR.env.quirks));
                    m = o.width - a.parts.contents.getSize("width",
                        1);
                    b = f.screenX;
                    c = f.screenY;
                    h = CKEDITOR.document.getWindow().getViewPaneSize();
                    CKEDITOR.document.on("mousemove", e);
                    CKEDITOR.document.on("mouseup", d);
                    CKEDITOR.env.ie6Compat && (g = r.getChild(0).getFrameDocument(), g.on("mousemove", e), g.on("mouseup", d));
                    f.preventDefault && f.preventDefault()
                });
                a.on("load", function () {
                    var b = "";
                    f == CKEDITOR.DIALOG_RESIZE_WIDTH ? b = " cke_resizer_horizontal" : f == CKEDITOR.DIALOG_RESIZE_HEIGHT && (b = " cke_resizer_vertical");
                    b = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' +
                        b + " cke_resizer_" + k.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(k.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + n + ', event )">' + ("ltr" == k.lang.dir ? "◢" : "◣") + "</div>");
                    a.parts.footer.append(b, 1)
                });
                k.on("destroy", function () {
                    CKEDITOR.tools.removeFunction(n)
                })
            }
        }

        function F(a) {
            a.data.preventDefault(1)
        }

        function J(a) {
            var b = CKEDITOR.document.getWindow(), c = a.config, e = c.dialog_backgroundCoverColor || "white", d = c.dialog_backgroundCoverOpacity, g = c.baseFloatZIndex, c = CKEDITOR.tools.genKey(e,
                d, g), f = w[c];
            if (f)f.show(); else {
                g = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ? "absolute" : "fixed", "; z-index: ", g, "; top: 0px; left: 0px; ", !CKEDITOR.env.ie6Compat ? "background-color: " + e : "", '" class="cke_dialog_background_cover">'];
                if (CKEDITOR.env.ie6Compat) {
                    var k = CKEDITOR.env.isCustomDomain(), e = "<html><body style=\\'background-color:" + e + ";\\'></body></html>";
                    g.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:');
                    g.push("void((function(){document.open();" +
                        (k ? "document.domain='" + document.domain + "';" : "") + "document.write( '" + e + "' );document.close();})())");
                    g.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>')
                }
                g.push("</div>");
                f = CKEDITOR.dom.element.createFromHtml(g.join(""));
                f.setOpacity(void 0 != d ? d : 0.5);
                f.on("keydown", F);
                f.on("keypress", F);
                f.on("keyup", F);
                f.appendTo(CKEDITOR.document.getBody());
                w[c] = f
            }
            a.focusManager.add(f);
            r = f;
            var a = function () {
                var a = b.getViewPaneSize();
                f.setStyles({width: a.width + "px", height: a.height + "px"})
            }, m = function () {
                var a = b.getScrollPosition(), c = CKEDITOR.dialog._.currentTop;
                f.setStyles({left: a.x + "px", top: a.y + "px"});
                if (c) {
                    do a = c.getPosition(), c.move(a.x, a.y); while (c = c._.parentDialog)
                }
            };
            G = a;
            b.on("resize", a);
            a();
            (!CKEDITOR.env.mac || !CKEDITOR.env.webkit) && f.focus();
            if (CKEDITOR.env.ie6Compat) {
                var j = function () {
                    m();
                    arguments.callee.prevScrollHandler.apply(this, arguments)
                };
                b.$.setTimeout(function () {
                    j.prevScrollHandler = window.onscroll || function () {
                    };
                    window.onscroll = j
                }, 0);
                m()
            }
        }

        function K(a) {
            r && (a.focusManager.remove(r), a = CKEDITOR.document.getWindow(), r.hide(), a.removeListener("resize", G), CKEDITOR.env.ie6Compat && a.$.setTimeout(function () {
                window.onscroll = window.onscroll && window.onscroll.prevScrollHandler || null
            }, 0), G = null)
        }

        var s = CKEDITOR.tools.cssLength, S = '<div class="cke cke_reset_all {editorId} {editorDialogClass}" dir="{langDir}" lang="{langCode}" roles="application"><table class="cke_dialog ' + CKEDITOR.env.cssClass + ' cke_{langDir}" aria-labelledby="cke_dialog_title_{id}" style="position:absolute" roles="dialog"><tr><td roles="presentation"><div class="cke_dialog_body" roles="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" roles="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" roles="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" roles="tablist"></div><table class="cke_dialog_contents" roles="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" roles="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" roles="presentation"></td></tr></table></div></td></tr></table></div>';
        CKEDITOR.dialog = function (a, b) {
            function c() {
                var a = l._.focusList;
                a.sort(function (a, b) {
                    return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex
                });
                for (var b = a.length, c = 0; c < b; c++)a[c].focusIndex = c
            }

            function e(a) {
                var b = l._.focusList, a = a || 0;
                if (!(1 > b.length)) {
                    var c = l._.currentFocusIndex;
                    try {
                        b[c].getInputElement().$.blur()
                    } catch (f) {
                    }
                    for (var d = c = (c + a + b.length) % b.length; a && !b[d].isFocusable() && !(d = (d + a + b.length) % b.length, d == c););
                    b[d].focus();
                    "text" == b[d].type && b[d].select()
                }
            }

            function d(b) {
                if (l ==
                    CKEDITOR.dialog._.currentTop) {
                    var c = b.data.getKeystroke(), d = "rtl" == a.lang.dir;
                    o = i = 0;
                    if (9 == c || c == CKEDITOR.SHIFT + 9)c = c == CKEDITOR.SHIFT + 9, l._.tabBarMode ? (c = c ? p.call(l) : u.call(l), l.selectPage(c), l._.tabs[c][0].focus()) : e(c ? -1 : 1), o = 1; else if (c == CKEDITOR.ALT + 121 && !l._.tabBarMode && 1 < l.getPageCount())l._.tabBarMode = !0, l._.tabs[l._.currentTabId][0].focus(), o = 1; else if ((37 == c || 39 == c) && l._.tabBarMode)c = c == (d ? 39 : 37) ? p.call(l) : u.call(l), l.selectPage(c), l._.tabs[c][0].focus(), o = 1; else if ((13 == c || 32 == c) && l._.tabBarMode)this.selectPage(this._.currentTabId),
                        this._.tabBarMode = !1, this._.currentFocusIndex = -1, e(1), o = 1; else if (13 == c) {
                        c = b.data.getTarget();
                        if (!c.is("a", "button", "select", "textarea") && (!c.is("input") || "button" != c.$.type))(c = this.getButton("ok")) && CKEDITOR.tools.setTimeout(c.click, 0, c), o = 1;
                        i = 1
                    } else if (27 == c)(c = this.getButton("cancel")) ? CKEDITOR.tools.setTimeout(c.click, 0, c) : !1 !== this.fire("cancel", {hide: !0}).hide && this.hide(), i = 1; else return;
                    g(b)
                }
            }

            function g(a) {
                o ? a.data.preventDefault(1) : i && a.data.stopPropagation()
            }

            var f = CKEDITOR.dialog._.dialogDefinitions[b],
                k = CKEDITOR.tools.clone(W), m = a.config.dialog_buttonsOrder || "OS", j = a.lang.dir, h = {}, o, i;
            ("OS" == m && CKEDITOR.env.mac || "rtl" == m && "ltr" == j || "ltr" == m && "rtl" == j) && k.buttons.reverse();
            f = CKEDITOR.tools.extend(f(a), k);
            f = CKEDITOR.tools.clone(f);
            f = new L(this, f);
            k = R(a);
            this._ = {editor: a, element: k.element, name: b, contentSize: {width: 0, height: 0}, size: {width: 0, height: 0}, contents: {}, buttons: {}, accessKeyMap: {}, tabs: {}, tabIdList: [], currentTabId: null, currentTabIndex: null, pageCount: 0, lastTab: null, tabBarMode: !1, focusList: [],
                currentFocusIndex: 0, hasFocus: !1};
            this.parts = k.parts;
            CKEDITOR.tools.setTimeout(function () {
                a.fire("ariaWidget", this.parts.contents)
            }, 0, this);
            k = {position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed", top: 0, visibility: "hidden"};
            k["rtl" == j ? "right" : "left"] = 0;
            this.parts.dialog.setStyles(k);
            CKEDITOR.event.call(this);
            this.definition = f = CKEDITOR.fire("dialogDefinition", {name: b, definition: f}, a).definition;
            if (!("removeDialogTabs"in a._) && a.config.removeDialogTabs) {
                k = a.config.removeDialogTabs.split(";");
                for (j = 0; j <
                    k.length; j++)if (m = k[j].split(":"), 2 == m.length) {
                    var n = m[0];
                    h[n] || (h[n] = []);
                    h[n].push(m[1])
                }
                a._.removeDialogTabs = h
            }
            if (a._.removeDialogTabs && (h = a._.removeDialogTabs[b]))for (j = 0; j < h.length; j++)f.removeContents(h[j]);
            if (f.onLoad)this.on("load", f.onLoad);
            if (f.onShow)this.on("show", f.onShow);
            if (f.onHide)this.on("hide", f.onHide);
            if (f.onOk)this.on("ok", function (b) {
                a.fire("saveSnapshot");
                setTimeout(function () {
                    a.fire("saveSnapshot")
                }, 0);
                !1 === f.onOk.call(this, b) && (b.data.hide = !1)
            });
            if (f.onCancel)this.on("cancel",
                function (a) {
                    !1 === f.onCancel.call(this, a) && (a.data.hide = !1)
                });
            var l = this, C = function (a) {
                var b = l._.contents, c = !1, d;
                for (d in b)for (var f in b[d])if (c = a.call(this, b[d][f]))return
            };
            this.on("ok", function (a) {
                C(function (b) {
                    if (b.validate) {
                        var c = b.validate(this), d = "string" == typeof c || !1 === c;
                        d && (a.data.hide = !1, a.stop());
                        P.call(b, !d, "string" == typeof c ? c : void 0);
                        return d
                    }
                })
            }, this, null, 0);
            this.on("cancel", function (b) {
                    C(function (c) {
                        if (c.isChanged())return confirm(a.lang.common.confirmCancel) || (b.data.hide = !1), !0
                    })
                },
                this, null, 0);
            this.parts.close.on("click", function (a) {
                !1 !== this.fire("cancel", {hide: !0}).hide && this.hide();
                a.data.preventDefault()
            }, this);
            this.changeFocus = e;
            var v = this._.element;
            a.focusManager.add(v, 1);
            this.on("show", function () {
                v.on("keydown", d, this);
                if (CKEDITOR.env.opera || CKEDITOR.env.gecko)v.on("keypress", g, this)
            });
            this.on("hide", function () {
                v.removeListener("keydown", d);
                (CKEDITOR.env.opera || CKEDITOR.env.gecko) && v.removeListener("keypress", g);
                C(function (a) {
                    Q.apply(a)
                })
            });
            this.on("iframeAdded", function (a) {
                (new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown",
                    d, this, null, 0)
            });
            this.on("show", function () {
                c();
                if (a.config.dialog_startupFocusTab && 1 < l._.pageCount)l._.tabBarMode = !0, l._.tabs[l._.currentTabId][0].focus(); else if (!this._.hasFocus)if (this._.currentFocusIndex = -1, f.onFocus) {
                    var b = f.onFocus.call(this);
                    b && b.focus()
                } else e(1)
            }, this, null, 4294967295);
            if (CKEDITOR.env.ie6Compat)this.on("load", function () {
                var a = this.getElement(), b = a.getFirst();
                b.remove();
                b.appendTo(a)
            }, this);
            U(this);
            V(this);
            (new CKEDITOR.dom.text(f.title, CKEDITOR.document)).appendTo(this.parts.title);
            for (j = 0; j < f.contents.length; j++)(h = f.contents[j]) && this.addPage(h);
            this.parts.tabs.on("click", function (a) {
                var b = a.data.getTarget();
                b.hasClass("cke_dialog_tab") && (b = b.$.id, this.selectPage(b.substring(4, b.lastIndexOf("_"))), this._.tabBarMode && (this._.tabBarMode = !1, this._.currentFocusIndex = -1, e(1)), a.data.preventDefault())
            }, this);
            j = [];
            h = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this, {type: "hbox", className: "cke_dialog_footer_buttons", widths: [], children: f.buttons}, j).getChild();
            this.parts.footer.setHtml(j.join(""));
            for (j = 0; j < h.length; j++)this._.buttons[h[j].id] = h[j]
        };
        CKEDITOR.dialog.prototype = {destroy: function () {
            this.hide();
            this._.element.remove()
        }, resize: function () {
            return function (a, b) {
                if (!this._.contentSize || !(this._.contentSize.width == a && this._.contentSize.height == b))CKEDITOR.dialog.fire("resize", {dialog: this, width: a, height: b}, this._.editor), this.fire("resize", {width: a, height: b}, this._.editor), this.parts.contents.setStyles({width: a + "px", height: b + "px"}), "rtl" == this._.editor.lang.dir && this._.position && (this._.position.x =
                    CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"), 10)), this._.contentSize = {width: a, height: b}
            }
        }(), getSize: function () {
            var a = this._.element.getFirst();
            return{width: a.$.offsetWidth || 0, height: a.$.offsetHeight || 0}
        }, move: function (a, b, c) {
            var e = this._.element.getFirst(), d = "rtl" == this._.editor.lang.dir, g = "fixed" == e.getComputedStyle("position");
            CKEDITOR.env.ie && e.setStyle("zoom", "100%");
            if (!g || !this._.position || !(this._.position.x ==
                a && this._.position.y == b))this._.position = {x: a, y: b}, g || (g = CKEDITOR.document.getWindow().getScrollPosition(), a += g.x, b += g.y), d && (g = this.getSize(), a = CKEDITOR.document.getWindow().getViewPaneSize().width - g.width - a), b = {top: (0 < b ? b : 0) + "px"}, b[d ? "right" : "left"] = (0 < a ? a : 0) + "px", e.setStyles(b), c && (this._.moved = 1)
        }, getPosition: function () {
            return CKEDITOR.tools.extend({}, this._.position)
        }, show: function () {
            var a = this._.element, b = this.definition;
            !a.getParent() || !a.getParent().equals(CKEDITOR.document.getBody()) ? a.appendTo(CKEDITOR.document.getBody()) :
                a.setStyle("display", "block");
            if (CKEDITOR.env.gecko && 10900 > CKEDITOR.env.version) {
                var c = this.parts.dialog;
                c.setStyle("position", "absolute");
                setTimeout(function () {
                    c.setStyle("position", "fixed")
                }, 0)
            }
            this.resize(this._.contentSize && this._.contentSize.width || b.width || b.minWidth, this._.contentSize && this._.contentSize.height || b.height || b.minHeight);
            this.reset();
            this.selectPage(this.definition.contents[0].id);
            null === CKEDITOR.dialog._.currentZIndex && (CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex);
            this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex += 10);
            null === CKEDITOR.dialog._.currentTop ? (CKEDITOR.dialog._.currentTop = this, this._.parentDialog = null, J(this._.editor)) : (this._.parentDialog = CKEDITOR.dialog._.currentTop, this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex / 2), CKEDITOR.dialog._.currentTop = this);
            a.on("keydown", M);
            a.on(CKEDITOR.env.opera ? "keypress" : "keyup", N);
            this._.hasFocus = !1;
            CKEDITOR.tools.setTimeout(function () {
                this.layout();
                T(this);
                this.parts.dialog.setStyle("visibility", "");
                this.fireOnce("load", {});
                CKEDITOR.ui.fire("ready", this);
                this.fire("show", {});
                this._.editor.fire("dialogShow", this);
                this._.parentDialog || this._.editor.focusManager.lock();
                this.foreach(function (a) {
                    a.setInitValue && a.setInitValue()
                })
            }, 100, this)
        }, layout: function () {
            var a = this.parts.dialog, b = this.getSize(), c = CKEDITOR.document.getWindow().getViewPaneSize(), e = (c.width - b.width) / 2, d = (c.height - b.height) / 2;
            CKEDITOR.env.ie6Compat || (b.height + (0 < d ? d : 0) > c.height ||
                b.width + (0 < e ? e : 0) > c.width ? a.setStyle("position", "absolute") : a.setStyle("position", "fixed"));
            this.move(this._.moved ? this._.position.x : e, this._.moved ? this._.position.y : d)
        }, foreach: function (a) {
            for (var b in this._.contents)for (var c in this._.contents[b])a.call(this, this._.contents[b][c]);
            return this
        }, reset: function () {
            var a = function (a) {
                a.reset && a.reset(1)
            };
            return function () {
                this.foreach(a);
                return this
            }
        }(), setupContent: function () {
            var a = arguments;
            this.foreach(function (b) {
                b.setup && b.setup.apply(b, a)
            })
        },
            commitContent: function () {
                var a = arguments;
                this.foreach(function (b) {
                    CKEDITOR.env.ie && this._.currentFocusIndex == b.focusIndex && b.getInputElement().$.blur();
                    b.commit && b.commit.apply(b, a)
                })
            }, hide: function () {
                if (this.parts.dialog.isVisible()) {
                    this.fire("hide", {});
                    this._.editor.fire("dialogHide", this);
                    this.selectPage(this._.tabIdList[0]);
                    var a = this._.element;
                    a.setStyle("display", "none");
                    this.parts.dialog.setStyle("visibility", "hidden");
                    for (X(this); CKEDITOR.dialog._.currentTop != this;)CKEDITOR.dialog._.currentTop.hide();
                    if (this._.parentDialog) {
                        var b = this._.parentDialog.getElement().getFirst();
                        b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2))
                    } else K(this._.editor);
                    if (CKEDITOR.dialog._.currentTop = this._.parentDialog)CKEDITOR.dialog._.currentZIndex -= 10; else {
                        CKEDITOR.dialog._.currentZIndex = null;
                        a.removeListener("keydown", M);
                        a.removeListener(CKEDITOR.env.opera ? "keypress" : "keyup", N);
                        var c = this._.editor;
                        c.focus();
                        setTimeout(function () {
                            c.focusManager.unlock()
                        }, 0)
                    }
                    delete this._.parentDialog;
                    this.foreach(function (a) {
                        a.resetInitValue && a.resetInitValue()
                    })
                }
            }, addPage: function (a) {
                if (!a.requiredContent || this._.editor.filter.check(a.requiredContent)) {
                    for (var b = [], c = a.label ? ' title="' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "", e = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {type: "vbox", className: "cke_dialog_page_contents", children: a.elements, expand: !!a.expand, padding: a.padding, style: a.style || "width: 100%;"}, b), d = this._.contents[a.id] = {}, g = e.getChild(), f = 0; e = g.shift();)!e.notAllowed && ("hbox" !=
                        e.type && "vbox" != e.type) && f++, d[e.id] = e, "function" == typeof e.getChild && g.push.apply(g, e.getChild());
                    f || (a.hidden = !0);
                    b = CKEDITOR.dom.element.createFromHtml(b.join(""));
                    b.setAttribute("roles", "tabpanel");
                    e = CKEDITOR.env;
                    d = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber();
                    c = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"', 0 < this._.pageCount ? " cke_last" : "cke_first", c, a.hidden ? ' style="display:none"' : "", ' id="', d, '"', e.gecko && 10900 <= e.version && !e.hc ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" roles="tab">',
                        a.label, "</a>"].join(""));
                    b.setAttribute("aria-labelledby", d);
                    this._.tabs[a.id] = [c, b];
                    this._.tabIdList.push(a.id);
                    !a.hidden && this._.pageCount++;
                    this._.lastTab = c;
                    this.updateStyle();
                    b.setAttribute("name", a.id);
                    b.appendTo(this.parts.contents);
                    c.unselectable();
                    this.parts.tabs.append(c);
                    a.accessKey && (O(this, this, "CTRL+" + a.accessKey, Y, Z), this._.accessKeyMap["CTRL+" + a.accessKey] = a.id)
                }
            }, selectPage: function (a) {
                if (this._.currentTabId != a && !0 !== this.fire("selectPage", {page: a, currentPage: this._.currentTabId})) {
                    for (var b in this._.tabs) {
                        var c =
                            this._.tabs[b][0], e = this._.tabs[b][1];
                        b != a && (c.removeClass("cke_dialog_tab_selected"), e.hide());
                        e.setAttribute("aria-hidden", b != a)
                    }
                    var d = this._.tabs[a];
                    d[0].addClass("cke_dialog_tab_selected");
                    CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat ? (q(d[1]), d[1].show(), setTimeout(function () {
                        q(d[1], 1)
                    }, 0)) : d[1].show();
                    this._.currentTabId = a;
                    this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, a)
                }
            }, updateStyle: function () {
                this.parts.dialog[(1 === this._.pageCount ? "add" : "removeManager") + "Class"]("cke_single_page")
            },
            hidePage: function (a) {
                var b = this._.tabs[a] && this._.tabs[a][0];
                b && (1 != this._.pageCount && b.isVisible()) && (a == this._.currentTabId && this.selectPage(p.call(this)), b.hide(), this._.pageCount--, this.updateStyle())
            }, showPage: function (a) {
                if (a = this._.tabs[a] && this._.tabs[a][0])a.show(), this._.pageCount++, this.updateStyle()
            }, getElement: function () {
                return this._.element
            }, getName: function () {
                return this._.name
            }, getContentElement: function (a, b) {
                var c = this._.contents[a];
                return c && c[b]
            }, getValueOf: function (a, b) {
                return this.getContentElement(a,
                    b).getValue()
            }, setValueOf: function (a, b, c) {
                return this.getContentElement(a, b).setValue(c)
            }, getButton: function (a) {
                return this._.buttons[a]
            }, click: function (a) {
                return this._.buttons[a].click()
            }, disableButton: function (a) {
                return this._.buttons[a].disable()
            }, enableButton: function (a) {
                return this._.buttons[a].enable()
            }, getPageCount: function () {
                return this._.pageCount
            }, getParentEditor: function () {
                return this._.editor
            }, getSelectedElement: function () {
                return this.getParentEditor().getSelection().getSelectedElement()
            },
            addFocusable: function (a, b) {
                if ("undefined" == typeof b)b = this._.focusList.length, this._.focusList.push(new H(this, a, b)); else {
                    this._.focusList.splice(b, 0, new H(this, a, b));
                    for (var c = b + 1; c < this._.focusList.length; c++)this._.focusList[c].focusIndex++
                }
            }};
        CKEDITOR.tools.extend(CKEDITOR.dialog, {add: function (a, b) {
            if (!this._.dialogDefinitions[a] || "function" == typeof b)this._.dialogDefinitions[a] = b
        }, exists: function (a) {
            return!!this._.dialogDefinitions[a]
        }, getCurrent: function () {
            return CKEDITOR.dialog._.currentTop
        },
            isTabEnabled: function (a, b, c) {
                a = a.config.removeDialogTabs;
                return!(a && a.match(RegExp("(?:^|;)" + b + ":" + c + "(?:$|;)", "i")))
            }, okButton: function () {
                var a = function (a, c) {
                    c = c || {};
                    return CKEDITOR.tools.extend({id: "ok", type: "button", label: a.lang.common.ok, "class": "cke_dialog_ui_button_ok", onClick: function (a) {
                        a = a.data.dialog;
                        !1 !== a.fire("ok", {hide: !0}).hide && a.hide()
                    }}, c, !0)
                };
                a.type = "button";
                a.override = function (b) {
                    return CKEDITOR.tools.extend(function (c) {
                        return a(c, b)
                    }, {type: "button"}, !0)
                };
                return a
            }(), cancelButton: function () {
                var a =
                    function (a, c) {
                        c = c || {};
                        return CKEDITOR.tools.extend({id: "cancel", type: "button", label: a.lang.common.cancel, "class": "cke_dialog_ui_button_cancel", onClick: function (a) {
                            a = a.data.dialog;
                            !1 !== a.fire("cancel", {hide: !0}).hide && a.hide()
                        }}, c, !0)
                    };
                a.type = "button";
                a.override = function (b) {
                    return CKEDITOR.tools.extend(function (c) {
                        return a(c, b)
                    }, {type: "button"}, !0)
                };
                return a
            }(), addUIElement: function (a, b) {
                this._.uiElementBuilders[a] = b
            }});
        CKEDITOR.dialog._ = {uiElementBuilders: {}, dialogDefinitions: {}, currentTop: null, currentZIndex: null};
        CKEDITOR.event.implementOn(CKEDITOR.dialog);
        CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
        var W = {resizable: CKEDITOR.DIALOG_RESIZE_BOTH, minWidth: 600, minHeight: 400, buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]}, z = function (a, b, c) {
                for (var e = 0, d; d = a[e]; e++)if (d.id == b || c && d[c] && (d = z(d[c], b, c)))return d;
                return null
            }, A = function (a, b, c, e, d) {
                if (c) {
                    for (var g = 0, f; f = a[g]; g++) {
                        if (f.id == c)return a.splice(g, 0, b), b;
                        if (e && f[e] && (f = A(f[e], b, c, e, !0)))return f
                    }
                    if (d)return null
                }
                a.push(b);
                return b
            },
            B = function (a, b, c) {
                for (var e = 0, d; d = a[e]; e++) {
                    if (d.id == b)return a.splice(e, 1);
                    if (c && d[c] && (d = B(d[c], b, c)))return d
                }
                return null
            }, L = function (a, b) {
                this.dialog = a;
                for (var c = b.contents, e = 0, d; d = c[e]; e++)c[e] = d && new I(a, d);
                CKEDITOR.tools.extend(this, b)
            };
        L.prototype = {getContents: function (a) {
            return z(this.contents, a)
        }, getButton: function (a) {
            return z(this.buttons, a)
        }, addContents: function (a, b) {
            return A(this.contents, a, b)
        }, addButton: function (a, b) {
            return A(this.buttons, a, b)
        }, removeContents: function (a) {
            B(this.contents,
                a)
        }, removeButton: function (a) {
            B(this.buttons, a)
        }};
        I.prototype = {get: function (a) {
            return z(this.elements, a, "children")
        }, add: function (a, b) {
            return A(this.elements, a, b, "children")
        }, remove: function (a) {
            B(this.elements, a, "children")
        }};
        var G, w = {}, r, t = {}, M = function (a) {
            var b = a.data.$.ctrlKey || a.data.$.metaKey, c = a.data.$.altKey, e = a.data.$.shiftKey, d = String.fromCharCode(a.data.$.keyCode);
            if ((b = t[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (e ? "SHIFT+" : "") + d]) && b.length)b = b[b.length - 1], b.keydown && b.keydown.call(b.uiElement, b.dialog,
                b.key), a.data.preventDefault()
        }, N = function (a) {
            var b = a.data.$.ctrlKey || a.data.$.metaKey, c = a.data.$.altKey, e = a.data.$.shiftKey, d = String.fromCharCode(a.data.$.keyCode);
            if ((b = t[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (e ? "SHIFT+" : "") + d]) && b.length)b = b[b.length - 1], b.keyup && (b.keyup.call(b.uiElement, b.dialog, b.key), a.data.preventDefault())
        }, O = function (a, b, c, e, d) {
            (t[c] || (t[c] = [])).push({uiElement: a, dialog: b, key: c, keyup: d || a.accessKeyUp, keydown: e || a.accessKeyDown})
        }, X = function (a) {
            for (var b in t) {
                for (var c = t[b], e = c.length -
                    1; 0 <= e; e--)(c[e].dialog == a || c[e].uiElement == a) && c.splice(e, 1);
                0 === c.length && delete t[b]
            }
        }, Z = function (a, b) {
            a._.accessKeyMap[b] && a.selectPage(a._.accessKeyMap[b])
        }, Y = function () {
        };
        (function () {
            CKEDITOR.ui.dialog = {uiElement: function (a, b, c, e, d, g, f) {
                if (!(4 > arguments.length)) {
                    var k = (e.call ? e(b) : e) || "div", m = ["<", k, " "], j = (d && d.call ? d(b) : d) || {}, h = (g && g.call ? g(b) : g) || {}, o = (f && f.call ? f.call(this, a, b) : f) || "", i = this.domId = h.id || CKEDITOR.tools.getNextId() + "_uiElement";
                    this.id = b.id;
                    b.requiredContent && !a.getParentEditor().filter.check(b.requiredContent) &&
                    (j.display = "none", this.notAllowed = !0);
                    h.id = i;
                    var n = {};
                    b.type && (n["cke_dialog_ui_" + b.type] = 1);
                    b.className && (n[b.className] = 1);
                    b.disabled && (n.cke_disabled = 1);
                    for (var l = h["class"] && h["class"].split ? h["class"].split(" ") : [], i = 0; i < l.length; i++)l[i] && (n[l[i]] = 1);
                    l = [];
                    for (i in n)l.push(i);
                    h["class"] = l.join(" ");
                    b.title && (h.title = b.title);
                    n = (b.style || "").split(";");
                    b.align && (l = b.align, j["margin-left"] = "left" == l ? 0 : "auto", j["margin-right"] = "right" == l ? 0 : "auto");
                    for (i in j)n.push(i + ":" + j[i]);
                    b.hidden && n.push("display:none");
                    for (i = n.length - 1; 0 <= i; i--)"" === n[i] && n.splice(i, 1);
                    0 < n.length && (h.style = (h.style ? h.style + "; " : "") + n.join("; "));
                    for (i in h)m.push(i + '="' + CKEDITOR.tools.htmlEncode(h[i]) + '" ');
                    m.push(">", o, "</", k, ">");
                    c.push(m.join(""));
                    (this._ || (this._ = {})).dialog = a;
                    "boolean" == typeof b.isChanged && (this.isChanged = function () {
                        return b.isChanged
                    });
                    "function" == typeof b.isChanged && (this.isChanged = b.isChanged);
                    "function" == typeof b.setValue && (this.setValue = CKEDITOR.tools.override(this.setValue, function (a) {
                        return function (c) {
                            a.call(this,
                                b.setValue.call(this, c))
                        }
                    }));
                    "function" == typeof b.getValue && (this.getValue = CKEDITOR.tools.override(this.getValue, function (a) {
                        return function () {
                            return b.getValue.call(this, a.call(this))
                        }
                    }));
                    CKEDITOR.event.implementOn(this);
                    this.registerEvents(b);
                    this.accessKeyUp && (this.accessKeyDown && b.accessKey) && O(this, a, "CTRL+" + b.accessKey);
                    var p = this;
                    a.on("load", function () {
                        var b = p.getInputElement();
                        if (b) {
                            var c = p.type in{checkbox: 1, ratio: 1} && CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? "cke_dialog_ui_focused" : "";
                            b.on("focus",
                                function () {
                                    a._.tabBarMode = false;
                                    a._.hasFocus = true;
                                    p.fire("focus");
                                    c && this.addClass(c)
                                });
                            b.on("blur", function () {
                                p.fire("blur");
                                c && this.removeClass(c)
                            })
                        }
                    });
                    this.keyboardFocusable && (this.tabIndex = b.tabIndex || 0, this.focusIndex = a._.focusList.push(this) - 1, this.on("focus", function () {
                        a._.currentFocusIndex = p.focusIndex
                    }));
                    CKEDITOR.tools.extend(this, b)
                }
            }, hbox: function (a, b, c, e, d) {
                if (!(4 > arguments.length)) {
                    this._ || (this._ = {});
                    var g = this._.children = b, f = d && d.widths || null, k = d && d.height || null, m, j = {role: "presentation"};
                    d && d.align && (j.align = d.align);
                    CKEDITOR.ui.dialog.uiElement.call(this, a, d || {type: "hbox"}, e, "table", {}, j, function () {
                        var a = ['<tbody><tr class="cke_dialog_ui_hbox">'];
                        for (m = 0; m < c.length; m++) {
                            var b = "cke_dialog_ui_hbox_child", e = [];
                            0 === m && (b = "cke_dialog_ui_hbox_first");
                            m == c.length - 1 && (b = "cke_dialog_ui_hbox_last");
                            a.push('<td class="', b, '" roles="presentation" ');
                            f ? f[m] && e.push("width:" + s(f[m])) : e.push("width:" + Math.floor(100 / c.length) + "%");
                            k && e.push("height:" + s(k));
                            d && void 0 != d.padding && e.push("padding:" +
                                s(d.padding));
                            CKEDITOR.env.ie && (CKEDITOR.env.quirks && g[m].align) && e.push("text-align:" + g[m].align);
                            0 < e.length && a.push('style="' + e.join("; ") + '" ');
                            a.push(">", c[m], "</td>")
                        }
                        a.push("</tr></tbody>");
                        return a.join("")
                    })
                }
            }, vbox: function (a, b, c, e, d) {
                if (!(3 > arguments.length)) {
                    this._ || (this._ = {});
                    var g = this._.children = b, f = d && d.width || null, k = d && d.heights || null;
                    CKEDITOR.ui.dialog.uiElement.call(this, a, d || {type: "vbox"}, e, "div", null, {role: "presentation"}, function () {
                        var b = ['<table roles="presentation" cellspacing="0" border="0" '];
                        b.push('style="');
                        d && d.expand && b.push("height:100%;");
                        b.push("width:" + s(f || "100%"), ";");
                        CKEDITOR.env.webkit && b.push("float:none;");
                        b.push('"');
                        b.push('align="', CKEDITOR.tools.htmlEncode(d && d.align || ("ltr" == a.getParentEditor().lang.dir ? "left" : "right")), '" ');
                        b.push("><tbody>");
                        for (var e = 0; e < c.length; e++) {
                            var h = [];
                            b.push('<tr><td roles="presentation" ');
                            f && h.push("width:" + s(f || "100%"));
                            k ? h.push("height:" + s(k[e])) : d && d.expand && h.push("height:" + Math.floor(100 / c.length) + "%");
                            d && void 0 != d.padding && h.push("padding:" +
                                s(d.padding));
                            CKEDITOR.env.ie && (CKEDITOR.env.quirks && g[e].align) && h.push("text-align:" + g[e].align);
                            0 < h.length && b.push('style="', h.join("; "), '" ');
                            b.push(' class="cke_dialog_ui_vbox_child">', c[e], "</td></tr>")
                        }
                        b.push("</tbody></table>");
                        return b.join("")
                    })
                }
            }}
        })();
        CKEDITOR.ui.dialog.uiElement.prototype = {getElement: function () {
            return CKEDITOR.document.getById(this.domId)
        }, getInputElement: function () {
            return this.getElement()
        }, getDialog: function () {
            return this._.dialog
        }, setValue: function (a, b) {
            this.getInputElement().setValue(a);
            !b && this.fire("change", {value: a});
            return this
        }, getValue: function () {
            return this.getInputElement().getValue()
        }, isChanged: function () {
            return!1
        }, selectParentTab: function () {
            for (var a = this.getInputElement(); (a = a.getParent()) && -1 == a.$.className.search("cke_dialog_page_contents"););
            if (!a)return this;
            a = a.getAttribute("name");
            this._.dialog._.currentTabId != a && this._.dialog.selectPage(a);
            return this
        }, focus: function () {
            this.selectParentTab().getInputElement().focus();
            return this
        }, registerEvents: function (a) {
            var b =
                /^on([A-Z]\w+)/, c, e = function (a, b, c, d) {
                b.on("load", function () {
                    a.getInputElement().on(c, d, a)
                })
            }, d;
            for (d in a)if (c = d.match(b))this.eventProcessors[d] ? this.eventProcessors[d].call(this, this._.dialog, a[d]) : e(this, this._.dialog, c[1].toLowerCase(), a[d]);
            return this
        }, eventProcessors: {onLoad: function (a, b) {
            a.on("load", b, this)
        }, onShow: function (a, b) {
            a.on("show", b, this)
        }, onHide: function (a, b) {
            a.on("hide", b, this)
        }}, accessKeyDown: function () {
            this.focus()
        }, accessKeyUp: function () {
        }, disable: function () {
            var a = this.getElement();
            this.getInputElement().setAttribute("disabled", "true");
            a.addClass("cke_disabled")
        }, enable: function () {
            var a = this.getElement();
            this.getInputElement().removeAttribute("disabled");
            a.removeClass("cke_disabled")
        }, isEnabled: function () {
            return!this.getElement().hasClass("cke_disabled")
        }, isVisible: function () {
            return this.getInputElement().isVisible()
        }, isFocusable: function () {
            return!this.isEnabled() || !this.isVisible() ? !1 : !0
        }};
        CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement,
            {getChild: function (a) {
                if (1 > arguments.length)return this._.children.concat();
                a.splice || (a = [a]);
                return 2 > a.length ? this._.children[a[0]] : this._.children[a[0]] && this._.children[a[0]].getChild ? this._.children[a[0]].getChild(a.slice(1, a.length)) : null
            }}, !0);
        CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox;
        (function () {
            var a = {build: function (a, c, e) {
                for (var d = c.children, g, f = [], k = [], m = 0; m < d.length && (g = d[m]); m++) {
                    var j = [];
                    f.push(j);
                    k.push(CKEDITOR.dialog._.uiElementBuilders[g.type].build(a, g, j))
                }
                return new CKEDITOR.ui.dialog[c.type](a,
                    k, f, e, c)
            }};
            CKEDITOR.dialog.addUIElement("hbox", a);
            CKEDITOR.dialog.addUIElement("vbox", a)
        })();
        CKEDITOR.dialogCommand = function (a, b) {
            this.dialogName = a;
            CKEDITOR.tools.extend(this, b, !0)
        };
        CKEDITOR.dialogCommand.prototype = {exec: function (a) {
            CKEDITOR.env.opera ? CKEDITOR.tools.setTimeout(function () {
                a.openDialog(this.dialogName)
            }, 0, this) : a.openDialog(this.dialogName)
        }, canUndo: !1, editorFocus: 1};
        (function () {
            var a = /^([a]|[^a])+$/, b = /^\d*$/, c = /^\d*(?:\.\d+)?$/, e = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/, d = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i,
                g = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
            CKEDITOR.VALIDATE_OR = 1;
            CKEDITOR.VALIDATE_AND = 2;
            CKEDITOR.dialog.validate = {functions: function () {
                var a = arguments;
                return function () {
                    var b = this && this.getValue ? this.getValue() : a[0], c = void 0, d = CKEDITOR.VALIDATE_AND, e = [], g;
                    for (g = 0; g < a.length; g++)if ("function" == typeof a[g])e.push(a[g]); else break;
                    g < a.length && "string" == typeof a[g] && (c = a[g], g++);
                    g < a.length && "number" == typeof a[g] && (d = a[g]);
                    var i = d == CKEDITOR.VALIDATE_AND ? !0 : !1;
                    for (g = 0; g < e.length; g++)i = d == CKEDITOR.VALIDATE_AND ?
                        i && e[g](b) : i || e[g](b);
                    return!i ? c : !0
                }
            }, regex: function (a, b) {
                return function (c) {
                    c = this && this.getValue ? this.getValue() : c;
                    return!a.test(c) ? b : !0
                }
            }, notEmpty: function (b) {
                return this.regex(a, b)
            }, integer: function (a) {
                return this.regex(b, a)
            }, number: function (a) {
                return this.regex(c, a)
            }, cssLength: function (a) {
                return this.functions(function (a) {
                    return d.test(CKEDITOR.tools.trim(a))
                }, a)
            }, htmlLength: function (a) {
                return this.functions(function (a) {
                    return e.test(CKEDITOR.tools.trim(a))
                }, a)
            }, inlineStyle: function (a) {
                return this.functions(function (a) {
                        return g.test(CKEDITOR.tools.trim(a))
                    },
                    a)
            }, equals: function (a, b) {
                return this.functions(function (b) {
                    return b == a
                }, b)
            }, notEqual: function (a, b) {
                return this.functions(function (b) {
                    return b != a
                }, b)
            }};
            CKEDITOR.on("instanceDestroyed", function (a) {
                if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
                    for (var b; b = CKEDITOR.dialog._.currentTop;)b.hide();
                    for (var c in w)w[c].remove();
                    w = {}
                }
                var a = a.editor._.storedDialogs, d;
                for (d in a)a[d].destroy()
            })
        })();
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {openDialog: function (a, b) {
            var c = null, e = CKEDITOR.dialog._.dialogDefinitions[a];
            null === CKEDITOR.dialog._.currentTop && J(this);
            if ("function" == typeof e)c = this._.storedDialogs || (this._.storedDialogs = {}), c = c[a] || (c[a] = new CKEDITOR.dialog(this, a)), b && b.call(c, c), c.show(); else {
                if ("failed" == e)throw K(this), Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
                "string" == typeof e && CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(e), function () {
                    "function" != typeof CKEDITOR.dialog._.dialogDefinitions[a] && (CKEDITOR.dialog._.dialogDefinitions[a] = "failed");
                    this.openDialog(a,
                        b)
                }, this, 0, 1)
            }
            CKEDITOR.skin.loadPart("dialog");
            return c
        }})
    })();
    CKEDITOR.plugins.add("dialog", {requires: "dialogui", init: function (p) {
        p.on("contentDom", function () {
            var u = p.editable();
            u.attachListener(u, "dblclick", function (q) {
                if (p.readOnly)return!1;
                q = {element: q.data.getTarget()};
                p.fire("doubleclick", q);
                q.dialog && p.openDialog(q.dialog);
                return 1
            })
        })
    }});
    CKEDITOR.plugins.add("about", {requires: "dialog", init: function (a) {
        var b = a.addCommand("about", new CKEDITOR.dialogCommand("about"));
        b.modes = {wysiwyg: 1, source: 1};
        b.canUndo = !1;
        b.readOnly = 1;
        a.ui.addButton && a.ui.addButton("About", {label: a.lang.about.title, command: "about", toolbar: "about"});
        CKEDITOR.dialog.add("about", this.path + "dialogs/about.js")
    }});
    (function () {
        CKEDITOR.plugins.add("a11yhelp", {requires: "dialog", availableLangs: {en: 1, ar: 1, bg: 1, ca: 1, et: 1, cs: 1, cy: 1, da: 1, de: 1, el: 1, eo: 1, es: 1, fa: 1, fi: 1, fr: 1, "fr-ca": 1, gu: 1, he: 1, hi: 1, hr: 1, hu: 1, it: 1, ja: 1, km: 1, ku: 1, lt: 1, lv: 1, mk: 1, mn: 1, nb: 1, nl: 1, no: 1, pl: 1, pt: 1, "pt-br": 1, ro: 1, ru: 1, sk: 1, sl: 1, sq: 1, sv: 1, th: 1, tr: 1, ug: 1, uk: 1, vi: 1, "zh-cn": 1}, init: function (b) {
            var c = this;
            b.addCommand("a11yHelp", {exec: function () {
                var a = b.langCode, a = c.availableLangs[a] ? a : c.availableLangs[a.replace(/-.*/, "")] ? a.replace(/-.*/, "") : "en";
                CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path + "dialogs/lang/" + a + ".js"), function () {
                    b.lang.a11yhelp = c.langEntries[a];
                    b.openDialog("a11yHelp")
                })
            }, modes: {wysiwyg: 1, source: 1}, readOnly: 1, canUndo: !1});
            b.setKeystroke(CKEDITOR.ALT + 48, "a11yHelp");
            CKEDITOR.dialog.add("a11yHelp", this.path + "dialogs/a11yhelp.js")
        }})
    })();
    CKEDITOR.plugins.add("basicstyles", {init: function (c) {
        var e = 0, d = function (g, d, b, a) {
            if (a) {
                var a = new CKEDITOR.style(a), f = h[b];
                f.unshift(a);
                c.attachStyleStateChange(a, function (a) {
                    !c.readOnly && c.getCommand(b).setState(a)
                });
                c.addCommand(b, new CKEDITOR.styleCommand(a, {contentForms: f}));
                c.ui.addButton && c.ui.addButton(g, {label: d, command: b, toolbar: "basicstyles," + (e += 10)})
            }
        }, h = {bold: ["strong", "b", ["span", function (a) {
            a = a.styles["font-weight"];
            return"bold" == a || 700 <= +a
        }]], italic: ["em", "i", ["span", function (a) {
            return"italic" ==
                a.styles["font-style"]
        }]], underline: ["u", ["span", function (a) {
            return"underline" == a.styles["text-decoration"]
        }]], strike: ["s", "strike", ["span", function (a) {
            return"line-through" == a.styles["text-decoration"]
        }]], subscript: ["sub"], superscript: ["sup"]}, b = c.config, a = c.lang.basicstyles;
        d("Bold", a.bold, "bold", b.coreStyles_bold);
        d("Italic", a.italic, "italic", b.coreStyles_italic);
        d("Underline", a.underline, "underline", b.coreStyles_underline);
        d("Strike", a.strike, "strike", b.coreStyles_strike);
        d("Subscript", a.subscript,
            "subscript", b.coreStyles_subscript);
        d("Superscript", a.superscript, "superscript", b.coreStyles_superscript);
        c.setKeystroke([
            [CKEDITOR.CTRL + 66, "bold"],
            [CKEDITOR.CTRL + 73, "italic"],
            [CKEDITOR.CTRL + 85, "underline"]
        ])
    }});
    CKEDITOR.config.coreStyles_bold = {element: "strong", overrides: "b"};
    CKEDITOR.config.coreStyles_italic = {element: "em", overrides: "i"};
    CKEDITOR.config.coreStyles_underline = {element: "u"};
    CKEDITOR.config.coreStyles_strike = {element: "s", overrides: "strike"};
    CKEDITOR.config.coreStyles_subscript = {element: "sub"};
    CKEDITOR.config.coreStyles_superscript = {element: "sup"};
    (function () {
        var k = {exec: function (g) {
            var a = g.getCommand("blockquote").state, i = g.getSelection(), c = i && i.getRanges(!0)[0];
            if (c) {
                var h = i.createBookmarks();
                if (CKEDITOR.env.ie) {
                    var e = h[0].startNode, b = h[0].endNode, d;
                    if (e && "blockquote" == e.getParent().getName())for (d = e; d = d.getNext();)if (d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary()) {
                        e.move(d, !0);
                        break
                    }
                    if (b && "blockquote" == b.getParent().getName())for (d = b; d = d.getPrevious();)if (d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary()) {
                        b.move(d);
                        break
                    }
                }
                var f = c.createIterator();
                f.enlargeBr = g.config.enterMode != CKEDITOR.ENTER_BR;
                if (a == CKEDITOR.TRISTATE_OFF) {
                    for (e = []; a = f.getNextParagraph();)e.push(a);
                    1 > e.length && (a = g.document.createElement(g.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div"), b = h.shift(), c.insertNode(a), a.append(new CKEDITOR.dom.text("﻿", g.document)), c.moveToBookmark(b), c.selectNodeContents(a), c.collapse(!0), b = c.createBookmark(), e.push(a), h.unshift(b));
                    d = e[0].getParent();
                    c = [];
                    for (b = 0; b < e.length; b++)a = e[b], d = d.getCommonAncestor(a.getParent());
                    for (a = {table: 1, tbody: 1,
                        tr: 1, ol: 1, ul: 1}; a[d.getName()];)d = d.getParent();
                    for (b = null; 0 < e.length;) {
                        for (a = e.shift(); !a.getParent().equals(d);)a = a.getParent();
                        a.equals(b) || c.push(a);
                        b = a
                    }
                    for (; 0 < c.length;)if (a = c.shift(), "blockquote" == a.getName()) {
                        for (b = new CKEDITOR.dom.documentFragment(g.document); a.getFirst();)b.append(a.getFirst().remove()), e.push(b.getLast());
                        b.replace(a)
                    } else e.push(a);
                    c = g.document.createElement("blockquote");
                    for (c.insertBefore(e[0]); 0 < e.length;)a = e.shift(), c.append(a)
                } else if (a == CKEDITOR.TRISTATE_ON) {
                    b = [];
                    for (d = {}; a = f.getNextParagraph();) {
                        for (e = c = null; a.getParent();) {
                            if ("blockquote" == a.getParent().getName()) {
                                c = a.getParent();
                                e = a;
                                break
                            }
                            a = a.getParent()
                        }
                        c && (e && !e.getCustomData("blockquote_moveout")) && (b.push(e), CKEDITOR.dom.element.setMarker(d, e, "blockquote_moveout", !0))
                    }
                    CKEDITOR.dom.element.clearAllMarkers(d);
                    a = [];
                    e = [];
                    for (d = {}; 0 < b.length;)f = b.shift(), c = f.getParent(), f.getPrevious() ? f.getNext() ? (f.breakParent(f.getParent()), e.push(f.getNext())) : f.remove().insertAfter(c) : f.remove().insertBefore(c), c.getCustomData("blockquote_processed") ||
                        (e.push(c), CKEDITOR.dom.element.setMarker(d, c, "blockquote_processed", !0)), a.push(f);
                    CKEDITOR.dom.element.clearAllMarkers(d);
                    for (b = e.length - 1; 0 <= b; b--) {
                        c = e[b];
                        a:{
                            d = c;
                            for (var f = 0, k = d.getChildCount(), j = void 0; f < k && (j = d.getChild(f)); f++)if (j.type == CKEDITOR.NODE_ELEMENT && j.isBlockBoundary()) {
                                d = !1;
                                break a
                            }
                            d = !0
                        }
                        d && c.remove()
                    }
                    if (g.config.enterMode == CKEDITOR.ENTER_BR)for (c = !0; a.length;)if (f = a.shift(), "div" == f.getName()) {
                        b = new CKEDITOR.dom.documentFragment(g.document);
                        c && (f.getPrevious() && !(f.getPrevious().type ==
                            CKEDITOR.NODE_ELEMENT && f.getPrevious().isBlockBoundary())) && b.append(g.document.createElement("br"));
                        for (c = f.getNext() && !(f.getNext().type == CKEDITOR.NODE_ELEMENT && f.getNext().isBlockBoundary()); f.getFirst();)f.getFirst().remove().appendTo(b);
                        c && b.append(g.document.createElement("br"));
                        b.replace(f);
                        c = !1
                    }
                }
                i.selectBookmarks(h);
                g.focus()
            }
        }, refresh: function (g, a) {
            this.setState(g.elementPath(a.block || a.blockLimit).contains("blockquote", 1) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
        }, context: "blockquote",
            allowedContent: "blockquote", requiredContent: "blockquote"};
        CKEDITOR.plugins.add("blockquote", {init: function (g) {
            g.blockless || (g.addCommand("blockquote", k), g.ui.addButton && g.ui.addButton("Blockquote", {label: g.lang.blockquote.toolbar, command: "blockquote", toolbar: "blocks,10"}))
        }})
    })();
    (function () {
        function w(a) {
            function b() {
                var d = a.editable();
                d.on(q, function (a) {
                    (!CKEDITOR.env.ie || !m) && u(a)
                });
                CKEDITOR.env.ie && d.on("paste", function (d) {
                    r || (f(), d.data.preventDefault(), u(d), k("paste") || a.openDialog("paste"))
                });
                CKEDITOR.env.ie && (d.on("contextmenu", h, null, null, 0), d.on("beforepaste", function (a) {
                    a.data && !a.data.$.ctrlKey && h()
                }, null, null, 0));
                d.on("beforecut", function () {
                    !m && l(a)
                });
                var v;
                d.attachListener(CKEDITOR.env.ie ? d : a.document.getDocumentElement(), "mouseup", function () {
                    v = setTimeout(function () {
                            s()
                        },
                        0)
                });
                a.on("destroy", function () {
                    clearTimeout(v)
                });
                d.on("keyup", s)
            }

            function e(d) {
                return{type: d, canUndo: "cut" == d, startDisabled: !0, exec: function () {
                    "cut" == this.type && l();
                    var d;
                    var b = this.type;
                    if (CKEDITOR.env.ie)d = k(b); else try {
                        d = a.document.$.execCommand(b, !1, null)
                    } catch (c) {
                        d = !1
                    }
                    d || alert(a.lang.clipboard[this.type + "Error"]);
                    return d
                }}
            }

            function c() {
                return{canUndo: !1, async: !0, exec: function (a, b) {
                    var c = function (b, c) {
                            b && g(b.type, b.dataValue, !!c);
                            a.fire("afterCommandExec", {name: "paste", command: e, returnValue: !!b})
                        },
                        e = this;
                    "string" == typeof b ? c({type: "auto", dataValue: b}, 1) : a.getClipboardData(c)
                }}
            }

            function f() {
                r = 1;
                setTimeout(function () {
                    r = 0
                }, 100)
            }

            function h() {
                m = 1;
                setTimeout(function () {
                    m = 0
                }, 10)
            }

            function k(d) {
                var b = a.document, c = b.getBody(), e = !1, l = function () {
                    e = !0
                };
                c.on(d, l);
                (7 < CKEDITOR.env.version ? b.$ : b.$.selection.createRange()).execCommand(d);
                c.removeListener(d, l);
                return e
            }

            function g(d, b, c) {
                d = {type: d};
                if (c && !a.fire("beforePaste", d) || !b)return!1;
                d.dataValue = b;
                return a.fire("paste", d)
            }

            function l() {
                if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
                    var d = a.getSelection(), b, c, e;
                    if (d.getType() == CKEDITOR.SELECTION_ELEMENT && (b = d.getSelectedElement()))c = d.getRanges()[0], e = a.document.createText(""), e.insertBefore(b), c.setStartBefore(e), c.setEndAfter(b), d.selectRanges([c]), setTimeout(function () {
                        b.getParent() && (e.remove(), d.selectElement(b))
                    }, 0)
                }
            }

            function j(d, b) {
                var c = a.document, e = a.editable(), l = function (a) {
                    a.cancel()
                }, j = CKEDITOR.env.gecko && 10902 >= CKEDITOR.env.version;
                if (!c.getById("cke_pastebin")) {
                    var f = a.getSelection(), h = f.createBookmarks(),
                        i = new CKEDITOR.dom.element(e.is("body") && !CKEDITOR.env.ie && !CKEDITOR.env.opera ? "body" : "div", c);
                    i.setAttribute("id", "cke_pastebin");
                    CKEDITOR.env.opera && i.appendBogus();
                    var o = 0, c = c.getWindow();
                    j ? (i.insertAfter(h[0].startNode), i.setStyle("display", "inline")) : (CKEDITOR.env.webkit ? (e.append(i), i.addClass("cke_editable"), o = (e.is("body") ? e : CKEDITOR.dom.element.get(i.$.offsetParent)).getDocumentPosition().y) : e.getAscendant(CKEDITOR.env.ie || CKEDITOR.env.opera ? "body" : "html", 1).append(i), i.setStyles({position: "absolute",
                        top: c.getScrollPosition().y - o + 10 + "px", width: "1px", height: Math.max(1, c.getViewPaneSize().height - 20) + "px", overflow: "hidden", margin: 0, padding: 0}));
                    (j = i.getParent().isReadOnly()) ? (i.setOpacity(0), i.setAttribute("contenteditable", !0)) : i.setStyle("ltr" == a.config.contentsLangDirection ? "left" : "right", "-1000px");
                    a.on("selectionChange", l, null, null, 0);
                    j && i.focus();
                    j = new CKEDITOR.dom.range(i);
                    j.selectNodeContents(i);
                    var g = j.select();
                    if (CKEDITOR.env.ie)var k = e.once("blur", function () {
                        a.lockSelection(g)
                    });
                    var m =
                        CKEDITOR.document.getWindow().getScrollPosition().y;
                    setTimeout(function () {
                        if (CKEDITOR.env.webkit || CKEDITOR.env.opera)CKEDITOR.document[CKEDITOR.env.webkit ? "getBody" : "getDocumentElement"]().$.scrollTop = m;
                        k && k.removeListener();
                        CKEDITOR.env.ie && e.focus();
                        f.selectBookmarks(h);
                        i.remove();
                        var d;
                        if (CKEDITOR.env.webkit && (d = i.getFirst()) && d.is && d.hasClass("Apple-style-span"))i = d;
                        a.removeListener("selectionChange", l);
                        b(i.getHtml())
                    }, 0)
                }
            }

            function o() {
                if (CKEDITOR.env.ie) {
                    a.focus();
                    f();
                    var d = a.focusManager;
                    d.lock();
                    if (a.editable().fire(q) && !k("paste"))return d.unlock(), !1;
                    d.unlock()
                } else try {
                    if (a.editable().fire(q) && !a.document.$.execCommand("Paste", !1, null))throw 0;
                } catch (b) {
                    return!1
                }
                return!0
            }

            function p(d) {
                if ("wysiwyg" == a.mode)switch (d.data.keyCode) {
                    case CKEDITOR.CTRL + 86:
                    case CKEDITOR.SHIFT + 45:
                        d = a.editable();
                        f();
                        !CKEDITOR.env.ie && d.fire("beforepaste");
                        (CKEDITOR.env.opera || CKEDITOR.env.gecko && 10900 > CKEDITOR.env.version) && d.fire("paste");
                        break;
                    case CKEDITOR.CTRL + 88:
                    case CKEDITOR.SHIFT + 46:
                        a.fire("saveSnapshot"),
                            setTimeout(function () {
                                a.fire("saveSnapshot")
                            }, 0)
                }
            }

            function u(d) {
                var b = {type: "auto"}, c = a.fire("beforePaste", b);
                j(d, function (a) {
                    a = a.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
                    c && g(b.type, a, 0, 1)
                })
            }

            function s() {
                if ("wysiwyg" == a.mode) {
                    var b = n("Paste");
                    a.getCommand("cut").setState(n("Cut"));
                    a.getCommand("copy").setState(n("Copy"));
                    a.getCommand("paste").setState(b);
                    a.fire("pasteState", b)
                }
            }

            function n(b) {
                var c;
                if (t && b in{Paste: 1, Cut: 1})return CKEDITOR.TRISTATE_DISABLED;
                if ("Paste" == b) {
                    CKEDITOR.env.ie &&
                    (m = 1);
                    try {
                        c = a.document.$.queryCommandEnabled(b) || CKEDITOR.env.webkit
                    } catch (e) {
                    }
                    m = 0
                } else b = a.getSelection(), c = b.getRanges(), c = b.getType() != CKEDITOR.SELECTION_NONE && !(1 == c.length && c[0].collapsed);
                return c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
            }

            var m = 0, r = 0, t = 0, q = CKEDITOR.env.ie ? "beforepaste" : "paste";
            (function () {
                a.on("key", p);
                a.on("contentDom", b);
                a.on("selectionChange", function (a) {
                    t = a.data.selection.getRanges()[0].checkReadOnly();
                    s()
                });
                a.contextMenu && a.contextMenu.addListener(function (a, b) {
                    t =
                        b.getRanges()[0].checkReadOnly();
                    return{cut: n("Cut"), copy: n("Copy"), paste: n("Paste")}
                })
            })();
            (function () {
                function b(c, d, e, l, j) {
                    var f = a.lang.clipboard[d];
                    a.addCommand(d, e);
                    a.ui.addButton && a.ui.addButton(c, {label: f, command: d, toolbar: "clipboard," + l});
                    a.addMenuItems && a.addMenuItem(d, {label: f, command: d, group: "clipboard", order: j})
                }

                b("Cut", "cut", e("cut"), 10, 1);
                b("Copy", "copy", e("copy"), 20, 4);
                b("Paste", "paste", c(), 30, 8)
            })();
            a.getClipboardData = function (b, c) {
                function e(a) {
                    a.removeListener();
                    a.cancel();
                    c(a.data)
                }

                function l(a) {
                    a.removeListener();
                    a.cancel();
                    g = !0;
                    c({type: h, dataValue: a.data})
                }

                function j() {
                    this.customTitle = b && b.title
                }

                var f = !1, h = "auto", g = !1;
                c || (c = b, b = null);
                a.on("paste", e, null, null, 0);
                a.on("beforePaste", function (a) {
                    a.removeListener();
                    f = true;
                    h = a.data.type
                }, null, null, 1E3);
                !1 === o() && (a.removeListener("paste", e), f && a.fire("pasteDialog", j) ? (a.on("pasteDialogCommit", l), a.on("dialogHide", function (a) {
                    a.removeListener();
                    a.data.removeListener("pasteDialogCommit", l);
                    setTimeout(function () {
                        g || c(null)
                    }, 10)
                })) :
                    c(null))
            }
        }

        function x(a) {
            if (CKEDITOR.env.webkit) {
                if (!a.match(/^[^<]*$/g) && !a.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi))return"html"
            } else if (CKEDITOR.env.ie) {
                if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi) && !a.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi))return"html"
            } else if (CKEDITOR.env.gecko || CKEDITOR.env.opera) {
                if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi))return"html"
            } else return"html";
            return"htmlifiedtext"
        }

        function y(a, b) {
            function e(a) {
                return CKEDITOR.tools.repeat("</p><p>", ~~(a / 2)) + (1 ==
                    a % 2 ? "<br>" : "")
            }

            b = b.replace(/\s+/g, " ").replace(/> +</g, "><").replace(/<br ?\/>/gi, "<br>");
            b = b.replace(/<\/?[A-Z]+>/g, function (a) {
                return a.toLowerCase()
            });
            if (b.match(/^[^<]$/))return b;
            CKEDITOR.env.webkit && -1 < b.indexOf("<div>") && (b = b.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "<div></div>"), b.match(/<div>(<br>|)<\/div>/) && (b = "<p>" + b.replace(/(<div>(<br>|)<\/div>)+/g, function (a) {
                return e(a.split("</div><div>").length + 1)
            }) + "</p>"), b =
                b.replace(/<\/div><div>/g, "<br>"), b = b.replace(/<\/?div>/g, ""));
            if ((CKEDITOR.env.gecko || CKEDITOR.env.opera) && a.enterMode != CKEDITOR.ENTER_BR)CKEDITOR.env.gecko && (b = b.replace(/^<br><br>$/, "<br>")), -1 < b.indexOf("<br><br>") && (b = "<p>" + b.replace(/(<br>){2,}/g, function (a) {
                return e(a.length / 4)
            }) + "</p>");
            return p(a, b)
        }

        function z() {
            var a = new CKEDITOR.htmlParser.filter, b = {blockquote: 1, dl: 1, fieldset: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, ol: 1, p: 1, table: 1, ul: 1}, e = CKEDITOR.tools.extend({br: 0}, CKEDITOR.dtd.$inline), c = {p: 1,
                br: 1, "cke:br": 1}, f = CKEDITOR.dtd, h = CKEDITOR.tools.extend({area: 1, basefont: 1, embed: 1, iframe: 1, map: 1, object: 1, param: 1}, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata), k = function (a) {
                delete a.name;
                a.add(new CKEDITOR.htmlParser.text(" "))
            }, g = function (a) {
                for (var b = a, c; (b = b.next) && b.name && b.name.match(/^h\d$/);) {
                    c = new CKEDITOR.htmlParser.element("cke:br");
                    c.isEmpty = !0;
                    for (a.add(c); c = b.children.shift();)a.add(c)
                }
            };
            a.addRules({elements: {h1: g, h2: g, h3: g, h4: g, h5: g, h6: g, img: function (a) {
                var a = CKEDITOR.tools.trim(a.attributes.alt ||
                    ""), b = " ";
                a && !a.match(/(^http|\.(jpe?g|gif|png))/i) && (b = " [" + a + "] ");
                return new CKEDITOR.htmlParser.text(b)
            }, td: k, th: k, $: function (a) {
                var j = a.name, g;
                if (h[j])return!1;
                delete a.attributes;
                if ("br" == j)return a;
                if (b[j])a.name = "p"; else if (e[j])delete a.name; else if (f[j]) {
                    g = new CKEDITOR.htmlParser.element("cke:br");
                    g.isEmpty = !0;
                    if (CKEDITOR.dtd.$empty[j])return g;
                    a.add(g, 0);
                    g = g.clone();
                    g.isEmpty = !0;
                    a.add(g);
                    delete a.name
                }
                c[a.name] || delete a.name;
                return a
            }}});
            return a
        }

        function A(a, b, e) {
            var b = new CKEDITOR.htmlParser.fragment.fromHtml(b),
                c = new CKEDITOR.htmlParser.basicWriter;
            b.writeHtml(c, e);
            var b = c.getHtml(), b = b.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g, "$1").replace(/(<cke:br \/>){2,}/g, "<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g, "$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g, "$1").replace(/<(cke:)?br( \/)?>/g, "<br>").replace(/<p><\/p>/g, ""), f = 0, b = b.replace(/<\/?p>/g,function (a) {
                if ("<p>" == a) {
                    if (1 < ++f)return"</p><p>"
                } else if (0 < --f)return"</p><p>";
                return a
            }).replace(/<p><\/p>/g, "");
            return p(a, b)
        }

        function p(a, b) {
            a.enterMode ==
                CKEDITOR.ENTER_BR ? b = b.replace(/(<\/p><p>)+/g,function (a) {
                return CKEDITOR.tools.repeat("<br>", 2 * (a.length / 7))
            }).replace(/<\/?p>/g, "") : a.enterMode == CKEDITOR.ENTER_DIV && (b = b.replace(/<(\/)?p>/g, "<$1div>"));
            return b
        }

        CKEDITOR.plugins.add("clipboard", {requires: "dialog", init: function (a) {
            var b;
            w(a);
            CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js"));
            a.on("paste", function (a) {
                    var b = a.data.dataValue, f = CKEDITOR.dtd.$block;
                    -1 < b.indexOf("Apple-") && (b = b.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi,
                        " "), "html" != a.data.type && (b = b.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function (a, b) {
                        return b.replace(/\t/g, "&nbsp;&nbsp; &nbsp;")
                    })), -1 < b.indexOf('<br class="Apple-interchange-newline">') && (a.data.startsWithEOL = 1, a.data.preSniffing = "html", b = b.replace(/<br class="Apple-interchange-newline">/, "")), b = b.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1"));
                    if (b.match(/^<[^<]+cke_(editable|contents)/i)) {
                        var h, k, g = new CKEDITOR.dom.element("div");
                        for (g.setHtml(b); 1 == g.getChildCount() && (h =
                            g.getFirst()) && h.type == CKEDITOR.NODE_ELEMENT && (h.hasClass("cke_editable") || h.hasClass("cke_contents"));)g = k = h;
                        k && (b = k.getHtml().replace(/<br>$/i, ""))
                    }
                    CKEDITOR.env.ie ? b = b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function (b, c) {
                        if (c.toLowerCase()in f) {
                            a.data.preSniffing = "html";
                            return"<" + c
                        }
                        return b
                    }) : CKEDITOR.env.webkit ? b = b.replace(/<\/(\w+)><div><br><\/div>$/, function (b, c) {
                        if (c in f) {
                            a.data.endsWithEOL = 1;
                            return"</" + c + ">"
                        }
                        return b
                    }) : CKEDITOR.env.gecko && (b = b.replace(/(\s)<br>$/, "$1"));
                    a.data.dataValue = b
                }, null,
                null, 3);
            a.on("paste", function (e) {
                var e = e.data, c = e.type, f = e.dataValue, h, k = a.config.clipboard_defaultContentType || "html";
                h = "html" == c || "html" == e.preSniffing ? "html" : x(f);
                "htmlifiedtext" == h ? f = y(a.config, f) : "text" == c && "html" == h && (f = A(a.config, f, b || (b = z(a))));
                e.startsWithEOL && (f = '<br data-cke-eol="1">' + f);
                e.endsWithEOL && (f += '<br data-cke-eol="1">');
                "auto" == c && (c = "html" == h || "html" == k ? "html" : "text");
                e.type = c;
                e.dataValue = f;
                delete e.preSniffing;
                delete e.startsWithEOL;
                delete e.endsWithEOL
            }, null, null, 6);
            a.on("paste",
                function (b) {
                    b = b.data;
                    a.insertHtml(b.dataValue, b.type);
                    setTimeout(function () {
                        a.fire("afterPaste")
                    }, 0)
                }, null, null, 1E3);
            a.on("pasteDialog", function (b) {
                setTimeout(function () {
                    a.openDialog("paste", b.data)
                }, 0)
            })
        }})
    })();
    (function () {
        CKEDITOR.plugins.add("panel", {beforeInit: function (a) {
            a.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler)
        }});
        CKEDITOR.UI_PANEL = "panel";
        CKEDITOR.ui.panel = function (a, b) {
            b && CKEDITOR.tools.extend(this, b);
            CKEDITOR.tools.extend(this, {className: "", css: []});
            this.id = CKEDITOR.tools.getNextId();
            this.document = a;
            this.isFramed = this.forceIFrame || this.css.length;
            this._ = {blocks: {}}
        };
        CKEDITOR.ui.panel.handler = {create: function (a) {
            return new CKEDITOR.ui.panel(a)
        }};
        var e = CKEDITOR.addTemplate("panel",
            '<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" roles="presentation">{frame}</div>'), f = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" roles="application" frameborder="0" src="{src}"></iframe>'), g = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
        CKEDITOR.ui.panel.prototype = {render: function (a, b) {
            this.getHolderElement = function () {
                var a = this._.holder;
                if (!a) {
                    if (this.isFramed) {
                        var a = this.document.getById(this.id + "_frame"), b = a.getParent(), a = a.getFrameDocument();
                        CKEDITOR.env.iOS && b.setStyles({overflow: "scroll", "-webkit-overflow-scrolling": "touch"});
                        b = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function () {
                            this.isLoaded = !0;
                            if (this.onLoad)this.onLoad()
                        }, this));
                        a.write(g.output(CKEDITOR.tools.extend({css: CKEDITOR.tools.buildStyleHtml(this.css), onload: "window.parent.CKEDITOR.tools.callFunction(" +
                            b + ");"}, c)));
                        a.getWindow().$.CKEDITOR = CKEDITOR;
                        a.on("key" + (CKEDITOR.env.opera ? "press" : "down"), function (a) {
                            var b = a.data.getKeystroke(), c = this.document.getById(this.id).getAttribute("dir");
                            this._.onKeyDown && !1 === this._.onKeyDown(b) ? a.data.preventDefault() : (27 == b || b == ("rtl" == c ? 39 : 37)) && this.onEscape && !1 === this.onEscape(b) && a.data.preventDefault()
                        }, this);
                        a = a.getBody();
                        a.unselectable();
                        CKEDITOR.env.air && CKEDITOR.tools.callFunction(b)
                    } else a = this.document.getById(this.id);
                    this._.holder = a
                }
                return a
            };
            var c =
            {editorId: a.id, id: this.id, langCode: a.langCode, dir: a.lang.dir, cls: this.className, frame: "", env: CKEDITOR.env.cssClass, "z-index": a.config.baseFloatZIndex + 1};
            this.isFramed && (c.frame = f.output({id: this.id + "_frame", src: "javascript:void(document.open()," + (CKEDITOR.env.isCustomDomain() ? "document.domain='" + document.domain + "'," : "") + 'document.close())">'}));
            var d = e.output(c);
            b && b.push(d);
            return d
        }, addBlock: function (a, b) {
            b = this._.blocks[a] = b instanceof CKEDITOR.ui.panel.block ? b : new CKEDITOR.ui.panel.block(this.getHolderElement(),
                b);
            this._.currentBlock || this.showBlock(a);
            return b
        }, getBlock: function (a) {
            return this._.blocks[a]
        }, showBlock: function (a) {
            var a = this._.blocks[a], b = this._.currentBlock, c = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id + "_frame");
            b && (c.removeAttributes(b.attributes), b.hide());
            this._.currentBlock = a;
            c.setAttributes(a.attributes);
            CKEDITOR.fire("ariaWidget", c);
            a._.focusIndex = -1;
            this._.onKeyDown = a.onKeyDown && CKEDITOR.tools.bind(a.onKeyDown, a);
            a.show();
            return a
        }, destroy: function () {
            this.element &&
            this.element.remove()
        }};
        CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass({$: function (a, b) {
            this.element = a.append(a.getDocument().createElement("div", {attributes: {tabIndex: -1, "class": "cke_panel_block", role: "presentation"}, styles: {display: "none"}}));
            b && CKEDITOR.tools.extend(this, b);
            this.attributes.title || (this.attributes.title = this.attributes["aria-label"]);
            this.keys = {};
            this._.focusIndex = -1;
            this.element.disableContextMenu()
        }, _: {markItem: function (a) {
            -1 != a && (a = this.element.getElementsByTag("a").getItem(this._.focusIndex =
                a), (CKEDITOR.env.webkit || CKEDITOR.env.opera) && a.getDocument().getWindow().focus(), a.focus(), this.onMark && this.onMark(a))
        }}, proto: {show: function () {
            this.element.setStyle("display", "")
        }, hide: function () {
            (!this.onHide || !0 !== this.onHide.call(this)) && this.element.setStyle("display", "none")
        }, onKeyDown: function (a) {
            var b = this.keys[a];
            switch (b) {
                case "next":
                    for (var a = this._.focusIndex, b = this.element.getElementsByTag("a"), c; c = b.getItem(++a);)if (c.getAttribute("_cke_focus") && c.$.offsetWidth) {
                        this._.focusIndex =
                            a;
                        c.focus();
                        break
                    }
                    return!1;
                case "prev":
                    a = this._.focusIndex;
                    for (b = this.element.getElementsByTag("a"); 0 < a && (c = b.getItem(--a));)if (c.getAttribute("_cke_focus") && c.$.offsetWidth) {
                        this._.focusIndex = a;
                        c.focus();
                        break
                    }
                    return!1;
                case "click":
                case "mouseup":
                    return a = this._.focusIndex, (c = 0 <= a && this.element.getElementsByTag("a").getItem(a)) && (c.$[b] ? c.$[b]() : c.$["on" + b]()), !1
            }
            return!0
        }}})
    })();
    CKEDITOR.plugins.add("floatpanel", {requires: "panel"});
    (function () {
        function o(a, b, c, h, g) {
            var g = CKEDITOR.tools.genKey(b.getUniqueId(), c.getUniqueId(), a.lang.dir, a.uiColor || "", h.css || "", g || ""), e = i[g];
            e || (e = i[g] = new CKEDITOR.ui.panel(b, h), e.element = c.append(CKEDITOR.dom.element.createFromHtml(e.render(a), b)), e.element.setStyles({display: "none", position: "absolute"}));
            return e
        }

        var i = {};
        CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({$: function (a, b, c, h) {
            function g() {
                j.hide()
            }

            c.forceIFrame = 1;
            c.toolbarRelated && a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE &&
            (b = CKEDITOR.document.getById("cke_" + a.name));
            var e = b.getDocument(), h = o(a, e, b, c, h || 0), k = h.element, d = k.getFirst(), j = this;
            k.disableContextMenu();
            k.setAttribute("roles", "application");
            this.element = k;
            this._ = {editor: a, panel: h, parentElement: b, definition: c, document: e, iframe: d, children: [], dir: a.lang.dir};
            a.on("mode", g);
            a.on("resize", g);
            e.getWindow().on("resize", g)
        }, proto: {addBlock: function (a, b) {
            return this._.panel.addBlock(a, b)
        }, addListBlock: function (a, b) {
            return this._.panel.addListBlock(a, b)
        }, getBlock: function (a) {
            return this._.panel.getBlock(a)
        },
            showBlock: function (a, b, c, h, g) {
                var e = this._.panel, k = e.showBlock(a);
                this.allowBlur(!1);
                a = this._.editor.editable();
                this._.returnFocus = a.hasFocus ? a : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
                var d = this.element, a = this._.iframe, a = CKEDITOR.env.ie ? a : new CKEDITOR.dom.window(a.$.contentWindow), j = d.getDocument(), i = this._.parentElement.getPositionedAncestor(), n = b.getDocumentPosition(j), j = i ? i.getDocumentPosition(j) : {x: 0, y: 0}, m = "rtl" == this._.dir, f = n.x + (h || 0) - j.x, l = n.y + (g || 0) - j.y;
                if (m && (1 == c || 4 ==
                    c))f += b.$.offsetWidth; else if (!m && (2 == c || 3 == c))f += b.$.offsetWidth - 1;
                if (3 == c || 4 == c)l += b.$.offsetHeight - 1;
                this._.panel._.offsetParentId = b.getId();
                d.setStyles({top: l + "px", left: 0, display: ""});
                d.setOpacity(0);
                d.getFirst().removeStyle("width");
                this._.editor.focusManager.add(a);
                this._.blurSet || (CKEDITOR.event.useCapture = !0, a.on("blur", function (a) {
                    this.allowBlur() && a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && (this.visible && !this._.activeChild) && (delete this._.returnFocus, this.hide())
                }, this), a.on("focus",
                    function () {
                        this._.focused = !0;
                        this.hideChild();
                        this.allowBlur(!0)
                    }, this), CKEDITOR.event.useCapture = !1, this._.blurSet = 1);
                e.onEscape = CKEDITOR.tools.bind(function (a) {
                    if (this.onEscape && this.onEscape(a) === false)return false
                }, this);
                CKEDITOR.tools.setTimeout(function () {
                    var a = CKEDITOR.tools.bind(function () {
                        d.removeStyle("width");
                        if (k.autoSize) {
                            var a = k.element.getDocument(), a = (CKEDITOR.env.webkit ? k.element : a.getBody()).$.scrollWidth;
                            CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((d.$.offsetWidth || 0) - (d.$.clientWidth ||
                                0) + 3));
                            d.setStyle("width", a + 10 + "px");
                            a = k.element.$.scrollHeight;
                            CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((d.$.offsetHeight || 0) - (d.$.clientHeight || 0) + 3));
                            d.setStyle("height", a + "px");
                            e._.currentBlock.element.setStyle("display", "none").removeStyle("display")
                        } else d.removeStyle("height");
                        m && (f = f - d.$.offsetWidth);
                        d.setStyle("left", f + "px");
                        var b = e.element.getWindow(), a = d.$.getBoundingClientRect(), b = b.getViewPaneSize(), c = a.width || a.right - a.left, g = a.height || a.bottom - a.top, h = m ? a.right : b.width - a.left,
                            i = m ? b.width - a.right : a.left;
                        m ? h < c && (f = i > c ? f + c : b.width > c ? f - a.left : f - a.right + b.width) : h < c && (f = i > c ? f - c : b.width > c ? f - a.right + b.width : f - a.left);
                        c = a.top;
                        b.height - a.top < g && (l = c > g ? l - g : b.height > g ? l - a.bottom + b.height : l - a.top);
                        if (CKEDITOR.env.ie) {
                            b = a = new CKEDITOR.dom.element(d.$.offsetParent);
                            b.getName() == "html" && (b = b.getDocument().getBody());
                            b.getComputedStyle("direction") == "rtl" && (f = CKEDITOR.env.ie8Compat ? f - d.getDocument().getDocumentElement().$.scrollLeft * 2 : f - (a.$.scrollWidth - a.$.clientWidth))
                        }
                        var a = d.getFirst(),
                            j;
                        (j = a.getCustomData("activePanel")) && j.onHide && j.onHide.call(this, 1);
                        a.setCustomData("activePanel", this);
                        d.setStyles({top: l + "px", left: f + "px"});
                        d.setOpacity(1)
                    }, this);
                    e.isLoaded ? a() : e.onLoad = a;
                    CKEDITOR.tools.setTimeout(function () {
                        this.focus();
                        this.allowBlur(true);
                        this._.editor.fire("panelShow", this)
                    }, 0, this)
                }, CKEDITOR.env.air ? 200 : 0, this);
                this.visible = 1;
                this.onShow && this.onShow.call(this)
            }, focus: function () {
                if (CKEDITOR.env.webkit) {
                    var a = CKEDITOR.document.getActive();
                    !a.equals(this._.iframe) && a.$.blur()
                }
                (this._.lastFocused ||
                    this._.iframe.getFrameDocument().getWindow()).focus()
            }, blur: function () {
                var a = this._.iframe.getFrameDocument().getActive();
                a.is("a") && (this._.lastFocused = a)
            }, hide: function (a) {
                if (this.visible && (!this.onHide || !0 !== this.onHide.call(this))) {
                    this.hideChild();
                    CKEDITOR.env.gecko && this._.iframe.getFrameDocument().$.activeElement.blur();
                    this.element.setStyle("display", "none");
                    this.visible = 0;
                    this.element.getFirst().removeCustomData("activePanel");
                    if (a = a && this._.returnFocus)CKEDITOR.env.webkit && a.type && a.getWindow().$.focus(),
                        a.focus();
                    delete this._.lastFocused;
                    this._.editor.fire("panelHide", this)
                }
            }, allowBlur: function (a) {
                var b = this._.panel;
                void 0 != a && (b.allowBlur = a);
                return b.allowBlur
            }, showAsChild: function (a, b, c, h, g, e) {
                this._.activeChild == a && a._.panel._.offsetParentId == c.getId() || (this.hideChild(), a.onHide = CKEDITOR.tools.bind(function () {
                    CKEDITOR.tools.setTimeout(function () {
                        this._.focused || this.hide()
                    }, 0, this)
                }, this), this._.activeChild = a, this._.focused = !1, a.showBlock(b, c, h, g, e), this.blur(), (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) &&
                    setTimeout(function () {
                        a.element.getChild(0).$.style.cssText += ""
                    }, 100))
            }, hideChild: function (a) {
                var b = this._.activeChild;
                b && (delete b.onHide, delete this._.activeChild, b.hide(), a && this.focus())
            }}});
        CKEDITOR.on("instanceDestroyed", function () {
            var a = CKEDITOR.tools.isEmpty(CKEDITOR.instances), b;
            for (b in i) {
                var c = i[b];
                a ? c.destroy() : c.element.hide()
            }
            a && (i = {})
        })
    })();
    CKEDITOR.plugins.add("menu", {requires: "floatpanel", beforeInit: function (k) {
        for (var g = k.config.menu_groups.split(","), m = k._.menuGroups = {}, l = k._.menuItems = {}, a = 0; a < g.length; a++)m[g[a]] = a + 1;
        k.addMenuGroup = function (b, a) {
            m[b] = a || 100
        };
        k.addMenuItem = function (a, c) {
            m[c.group] && (l[a] = new CKEDITOR.menuItem(this, a, c))
        };
        k.addMenuItems = function (a) {
            for (var c in a)this.addMenuItem(c, a[c])
        };
        k.getMenuItem = function (a) {
            return l[a]
        };
        k.removeMenuItem = function (a) {
            delete l[a]
        }
    }});
    (function () {
        function k(a) {
            a.sort(function (a, c) {
                return a.group < c.group ? -1 : a.group > c.group ? 1 : a.order < c.order ? -1 : a.order > c.order ? 1 : 0
            })
        }

        var g = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" roles="menuitem" aria-haspopup="{hasPopup}" aria-disabled="{disabled}"';
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac)g += ' onkeypress="return false;"';
        CKEDITOR.env.gecko &&
        (g += ' onblur="this.style.cssText = this.style.cssText;"');
        var g = g + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">'), m = CKEDITOR.addTemplate("menuItem", g + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>'),
            l = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
        CKEDITOR.menu = CKEDITOR.tools.createClass({$: function (a, b) {
            b = this._.definition = b || {};
            this.id = CKEDITOR.tools.getNextId();
            this.editor = a;
            this.items = [];
            this._.listeners = [];
            this._.level = b.level || 1;
            var c = CKEDITOR.tools.extend({}, b.panel, {css: [CKEDITOR.skin.getPath("editor")], level: this._.level - 1, block: {}}), j = c.block.attributes = c.attributes || {};
            !j.role && (j.role = "menu");
            this._.panelDefinition = c
        }, _: {onShow: function () {
            var a =
                this.editor.getSelection(), b = a && a.getStartElement(), c = this.editor.elementPath(), j = this._.listeners;
            this.removeAll();
            for (var e = 0; e < j.length; e++) {
                var i = j[e](b, a, c);
                if (i)for (var f in i) {
                    var h = this.editor.getMenuItem(f);
                    if (h && (!h.command || this.editor.getCommand(h.command).state))h.state = i[f], this.add(h)
                }
            }
        }, onClick: function (a) {
            this.hide();
            if (a.onClick)a.onClick(); else a.command && this.editor.execCommand(a.command)
        }, onEscape: function (a) {
            var b = this.parent;
            b ? b._.panel.hideChild(1) : 27 == a && this.hide(1);
            return!1
        },
            onHide: function () {
                this.onHide && this.onHide()
            }, showSubMenu: function (a) {
                var b = this._.subMenu, c = this.items[a];
                if (c = c.getItems && c.getItems()) {
                    b ? b.removeAll() : (b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {level: this._.level + 1}, !0)), b.parent = this, b._.onClick = CKEDITOR.tools.bind(this._.onClick, this));
                    for (var j in c) {
                        var e = this.editor.getMenuItem(j);
                        e && (e.state = c[j], b.add(e))
                    }
                    var i = this._.panel.getBlock(this.id).element.getDocument().getById(this.id + ("" + a));
                    setTimeout(function () {
                        b.show(i,
                            2)
                    }, 0)
                } else this._.panel.hideChild(1)
            }}, proto: {add: function (a) {
            a.order || (a.order = this.items.length);
            this.items.push(a)
        }, removeAll: function () {
            this.items = []
        }, show: function (a, b, c, j) {
            if (!this.parent && (this._.onShow(), !this.items.length))return;
            var b = b || ("rtl" == this.editor.lang.dir ? 2 : 1), e = this.items, i = this.editor, f = this._.panel, h = this._.element;
            if (!f) {
                f = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level);
                f.onEscape = CKEDITOR.tools.bind(function (a) {
                    if (!1 ===
                        this._.onEscape(a))return!1
                }, this);
                f.onShow = function () {
                    f._.panel.getHolderElement().getParent().addClass("cke cke_reset_all")
                };
                f.onHide = CKEDITOR.tools.bind(function () {
                    this._.onHide && this._.onHide()
                }, this);
                h = f.addBlock(this.id, this._.panelDefinition.block);
                h.autoSize = !0;
                var d = h.keys;
                d[40] = "next";
                d[9] = "next";
                d[38] = "prev";
                d[CKEDITOR.SHIFT + 9] = "prev";
                d["rtl" == i.lang.dir ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
                d[32] = CKEDITOR.env.ie ? "mouseup" : "click";
                CKEDITOR.env.ie && (d[13] = "mouseup");
                h = this._.element =
                    h.element;
                d = h.getDocument();
                d.getBody().setStyle("overflow", "hidden");
                d.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
                this._.itemOverFn = CKEDITOR.tools.addFunction(function (a) {
                    clearTimeout(this._.showSubTimeout);
                    this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, i.config.menu_subMenuDelay || 400, this, [a])
                }, this);
                this._.itemOutFn = CKEDITOR.tools.addFunction(function () {
                    clearTimeout(this._.showSubTimeout)
                }, this);
                this._.itemClickFn = CKEDITOR.tools.addFunction(function (a) {
                    var b =
                        this.items[a];
                    if (b.state == CKEDITOR.TRISTATE_DISABLED)this.hide(1); else if (b.getItems)this._.showSubMenu(a); else this._.onClick(b)
                }, this)
            }
            k(e);
            for (var d = i.elementPath(), d = ['<div class="cke_menu' + (d && d.direction() != i.lang.dir ? " cke_mixed_dir_content" : "") + '" roles="presentation">'], g = e.length, m = g && e[0].group, l = 0; l < g; l++) {
                var n = e[l];
                m != n.group && (d.push('<div class="cke_menuseparator" roles="separator"></div>'), m = n.group);
                n.render(this, l, d)
            }
            d.push("</div>");
            h.setHtml(d.join(""));
            CKEDITOR.ui.fire("ready",
                this);
            this.parent ? this.parent._.panel.showAsChild(f, this.id, a, b, c, j) : f.showBlock(this.id, a, b, c, j);
            i.fire("menuShow", [f])
        }, addListener: function (a) {
            this._.listeners.push(a)
        }, hide: function (a) {
            this._.onHide && this._.onHide();
            this._.panel && this._.panel.hide(a)
        }}});
        CKEDITOR.menuItem = CKEDITOR.tools.createClass({$: function (a, b, c) {
            CKEDITOR.tools.extend(this, c, {order: 0, className: "cke_menubutton__" + b});
            this.group = a._.menuGroups[this.group];
            this.editor = a;
            this.name = b
        }, proto: {render: function (a, b, c) {
            var g = a.id + ("" +
                b), e = "undefined" == typeof this.state ? CKEDITOR.TRISTATE_OFF : this.state, i = e == CKEDITOR.TRISTATE_ON ? "on" : e == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off", f = this.getItems, h = "&#" + ("rtl" == this.editor.lang.dir ? "9668" : "9658") + ";", d = this.name;
            this.icon && !/\./.test(this.icon) && (d = this.icon);
            a = {id: g, name: this.name, iconName: d, label: this.label, cls: this.className || "", state: i, hasPopup: f ? "true" : "false", disabled: e == CKEDITOR.TRISTATE_DISABLED, title: this.label, href: "javascript:void('" + (this.label || "").replace("'") + "')",
                hoverFn: a._.itemOverFn, moveOutFn: a._.itemOutFn, clickFn: a._.itemClickFn, index: b, iconStyle: CKEDITOR.skin.getIconStyle(d, "rtl" == this.editor.lang.dir, d == this.icon ? null : this.icon, this.iconOffset), arrowHtml: f ? l.output({label: h}) : ""};
            m.output(a, c)
        }}})
    })();
    CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div";
    CKEDITOR.plugins.add("contextmenu", {requires: "menu", onLoad: function () {
        CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({base: CKEDITOR.menu, $: function (b) {
            this.base.call(this, b, {panel: {className: "cke_menu_panel", attributes: {"aria-label": b.lang.contextmenu.options}}})
        }, proto: {addTarget: function (b, d) {
            if (CKEDITOR.env.opera && !("oncontextmenu"in document.body)) {
                var c;
                b.on("mousedown", function (a) {
                    a = a.data;
                    if (2 != a.$.button)a.getKeystroke() == CKEDITOR.CTRL + 1 && b.fire("contextmenu", a); else if (!d || !(CKEDITOR.env.mac ?
                        a.$.metaKey : a.$.ctrlKey)) {
                        var g = a.getTarget();
                        c || (g = g.getDocument(), c = g.createElement("input"), c.$.type = "button", g.getBody().append(c));
                        c.setAttribute("style", "position:absolute;top:" + (a.$.clientY - 2) + "px;left:" + (a.$.clientX - 2) + "px;width:5px;height:5px;opacity:0.01")
                    }
                });
                b.on("mouseup", function (a) {
                    c && (c.remove(), c = void 0, b.fire("contextmenu", a.data))
                })
            }
            b.on("contextmenu", function (a) {
                a = a.data;
                if (!d || !(CKEDITOR.env.webkit ? e : CKEDITOR.env.mac ? a.$.metaKey : a.$.ctrlKey)) {
                    a.preventDefault();
                    var b = a.getTarget().getDocument(),
                        c = a.getTarget().getDocument().getDocumentElement(), f = !b.equals(CKEDITOR.document), b = b.getWindow().getScrollPosition(), h = f ? a.$.clientX : a.$.pageX || b.x + a.$.clientX, i = f ? a.$.clientY : a.$.pageY || b.y + a.$.clientY;
                    CKEDITOR.tools.setTimeout(function () {
                        this.open(c, null, h, i)
                    }, CKEDITOR.env.ie ? 200 : 0, this)
                }
            }, this);
            if (CKEDITOR.env.opera)b.on("keypress", function (a) {
                a = a.data;
                0 === a.$.keyCode && a.preventDefault()
            });
            if (CKEDITOR.env.webkit) {
                var e, f = function () {
                    e = 0
                };
                b.on("keydown", function (a) {
                    e = CKEDITOR.env.mac ? a.data.$.metaKey :
                        a.data.$.ctrlKey
                });
                b.on("keyup", f);
                b.on("contextmenu", f)
            }
        }, open: function (b, d, c, e) {
            this.editor.focus();
            b = b || CKEDITOR.document.getDocumentElement();
            this.editor.selectionChange(1);
            this.show(b, d, c, e)
        }}})
    }, beforeInit: function (b) {
        var d = b.contextMenu = new CKEDITOR.plugins.contextMenu(b);
        b.on("contentDom", function () {
            d.addTarget(b.editable(), !1 !== b.config.browserContextMenuOnCtrl)
        });
        b.addCommand("contextMenu", {exec: function () {
            b.contextMenu.open(b.document.getBody())
        }});
        b.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
        b.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu")
    }});
    CKEDITOR.plugins.add("resize", {init: function (b) {
        var f, g, n, o, a = b.config, q = b.ui.spaceId("resizer"), h = b.element ? b.element.getDirection(1) : "ltr";
        !a.resize_dir && (a.resize_dir = "vertical");
        void 0 == a.resize_maxWidth && (a.resize_maxWidth = 3E3);
        void 0 == a.resize_maxHeight && (a.resize_maxHeight = 3E3);
        void 0 == a.resize_minWidth && (a.resize_minWidth = 750);
        void 0 == a.resize_minHeight && (a.resize_minHeight = 250);
        if (!1 !== a.resize_enabled) {
            var c = null, i = ("both" == a.resize_dir || "horizontal" == a.resize_dir) && a.resize_minWidth != a.resize_maxWidth,
                l = ("both" == a.resize_dir || "vertical" == a.resize_dir) && a.resize_minHeight != a.resize_maxHeight, j = function (d) {
                    var e = f, m = g, c = e + (d.data.$.screenX - n) * ("rtl" == h ? -1 : 1), d = m + (d.data.$.screenY - o);
                    i && (e = Math.max(a.resize_minWidth, Math.min(c, a.resize_maxWidth)));
                    l && (m = Math.max(a.resize_minHeight, Math.min(d, a.resize_maxHeight)));
                    b.resize(i ? e : null, m)
                }, k = function () {
                    CKEDITOR.document.removeListener("mousemove", j);
                    CKEDITOR.document.removeListener("mouseup", k);
                    b.document && (b.document.removeListener("mousemove", j), b.document.removeListener("mouseup",
                        k))
                }, p = CKEDITOR.tools.addFunction(function (d) {
                    c || (c = b.getResizable());
                    f = c.$.offsetWidth || 0;
                    g = c.$.offsetHeight || 0;
                    n = d.screenX;
                    o = d.screenY;
                    a.resize_minWidth > f && (a.resize_minWidth = f);
                    a.resize_minHeight > g && (a.resize_minHeight = g);
                    CKEDITOR.document.on("mousemove", j);
                    CKEDITOR.document.on("mouseup", k);
                    b.document && (b.document.on("mousemove", j), b.document.on("mouseup", k));
                    d.preventDefault && d.preventDefault()
                });
            b.on("destroy", function () {
                CKEDITOR.tools.removeFunction(p)
            });
            b.on("uiSpace", function (a) {
                if ("bottom" ==
                    a.data.space) {
                    var e = "";
                    i && !l && (e = " cke_resizer_horizontal");
                    !i && l && (e = " cke_resizer_vertical");
                    var c = '<span id="' + q + '" class="cke_resizer' + e + " cke_resizer_" + h + '" title="' + CKEDITOR.tools.htmlEncode(b.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + p + ', event)">' + ("ltr" == h ? "◢" : "◣") + "</span>";
                    "ltr" == h && "ltr" == e ? a.data.html += c : a.data.html = c + a.data.html
                }
            }, b, null, 100);
            b.on("maximize", function (a) {
                b.ui.space("resizer")[a.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]()
            })
        }
    }});
    (function () {
        var c = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' + (CKEDITOR.env.gecko && 10900 <= CKEDITOR.env.version && !CKEDITOR.env.hc ? "" : '" href="javascript:void(\'{titleJs}\')"') + ' title="{title}" tabindex="-1" hidefocus="true" roles="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}"';
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac)c += ' onkeypress="return false;"';
        CKEDITOR.env.gecko && (c += ' onblur="this.style.cssText = this.style.cssText;"');
        var c =
                c + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);"  onmousedown="return CKEDITOR.tools.callFunction({mousedownFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"'), c = c + '>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label">{label}</span>{arrowHtml}</a>',
            m = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>"), n = CKEDITOR.addTemplate("button", c);
        CKEDITOR.plugins.add("button", {beforeInit: function (a) {
            a.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler)
        }});
        CKEDITOR.UI_BUTTON = "button";
        CKEDITOR.ui.button = function (a) {
            CKEDITOR.tools.extend(this, a, {title: a.label, click: a.click || function (b) {
                b.execCommand(a.command)
            }});
            this._ = {}
        };
        CKEDITOR.ui.button.handler = {create: function (a) {
            return new CKEDITOR.ui.button(a)
        }};
        CKEDITOR.ui.button.prototype = {render: function (a, b) {
            var c = CKEDITOR.env, i = this._.id = CKEDITOR.tools.getNextId(), f = "", e = this.command, l;
            this._.editor = a;
            var d = {id: i, button: this, editor: a, focus: function () {
                CKEDITOR.document.getById(i).focus()
            }, execute: function () {
                this.button.click(a)
            }, attach: function (a) {
                this.button.attach(a)
            }}, o = CKEDITOR.tools.addFunction(function (a) {
                if (d.onkey)return a = new CKEDITOR.dom.event(a), !1 !== d.onkey(d, a.getKeystroke())
            }), p = CKEDITOR.tools.addFunction(function (a) {
                var b;
                d.onfocus && (b =
                    !1 !== d.onfocus(d, new CKEDITOR.dom.event(a)));
                CKEDITOR.env.gecko && 10900 > CKEDITOR.env.version && a.preventBubble();
                return b
            }), j = 0, q = CKEDITOR.tools.addFunction(function () {
                if (CKEDITOR.env.opera) {
                    var b = a.editable();
                    b.isInline() && b.hasFocus && (a.lockSelection(), j = 1)
                }
            });
            d.clickFn = l = CKEDITOR.tools.addFunction(function () {
                j && (a.unlockSelection(1), j = 0);
                d.execute()
            });
            if (this.modes) {
                var k = {}, g = function () {
                    var b = a.mode;
                    b && (b = this.modes[b] ? void 0 != k[b] ? k[b] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, this.setState(a.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : b))
                };
                a.on("beforeModeUnload", function () {
                    a.mode && this._.state != CKEDITOR.TRISTATE_DISABLED && (k[a.mode] = this._.state)
                }, this);
                a.on("mode", g, this);
                !this.readOnly && a.on("readOnly", g, this)
            } else if (e && (e = a.getCommand(e)))e.on("state", function () {
                this.setState(e.state)
            }, this), f += e.state == CKEDITOR.TRISTATE_ON ? "on" : e.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
            if (this.directional)a.on("contentDirChanged", function (b) {
                var c = CKEDITOR.document.getById(this._.id), d =
                    c.getFirst(), b = b.data;
                b != a.lang.dir ? c.addClass("cke_" + b) : c.removeClass("cke_ltr").removeClass("cke_rtl");
                d.setAttribute("style", CKEDITOR.skin.getIconStyle(h, "rtl" == b, this.icon, this.iconOffset))
            }, this);
            e || (f += "off");
            var h = g = this.name || this.command;
            this.icon && !/\./.test(this.icon) && (h = this.icon, this.icon = null);
            c = {id: i, name: g, iconName: h, label: this.label, cls: this.className || "", state: f, title: this.title, titleJs: c.gecko && 10900 <= c.version && !c.hc ? "" : (this.title || "").replace("'", ""), hasArrow: this.hasArrow ?
                "true" : "false", keydownFn: o, mousedownFn: q, focusFn: p, clickFn: l, style: CKEDITOR.skin.getIconStyle(h, "rtl" == a.lang.dir, this.icon, this.iconOffset), arrowHtml: this.hasArrow ? m.output() : ""};
            n.output(c, b);
            if (this.onRender)this.onRender();
            return d
        }, setState: function (a) {
            if (this._.state == a)return!1;
            this._.state = a;
            var b = CKEDITOR.document.getById(this._.id);
            return b ? (b.setState(a, "cke_button"), a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", !0) : b.removeAttribute("aria-disabled"), a == CKEDITOR.TRISTATE_ON ?
                b.setAttribute("aria-pressed", !0) : b.removeAttribute("aria-pressed"), !0) : !1
        }, toFeature: function (a) {
            if (this._.feature)return this._.feature;
            var b = this;
            !this.allowedContent && (!this.requiredContent && this.command) && (b = a.getCommand(this.command) || b);
            return this._.feature = b
        }};
        CKEDITOR.ui.prototype.addButton = function (a, b) {
            this.add(a, CKEDITOR.UI_BUTTON, b)
        }
    })();
    (function () {
        function w(a) {
            function d() {
                for (var b = i(), e = CKEDITOR.tools.clone(a.config.toolbarGroups) || n(a), f = 0; f < e.length; f++) {
                    var k = e[f];
                    if ("/" != k) {
                        "string" == typeof k && (k = e[f] = {name: k});
                        var j, d = k.groups;
                        if (d)for (var h = 0; h < d.length; h++)j = d[h], (j = b[j]) && c(k, j);
                        (j = b[k.name]) && c(k, j)
                    }
                }
                return e
            }

            function i() {
                var b = {}, c, f, e;
                for (c in a.ui.items)f = a.ui.items[c], e = f.toolbar || "others", e = e.split(","), f = e[0], e = parseInt(e[1] || -1, 10), b[f] || (b[f] = []), b[f].push({name: c, order: e});
                for (f in b)b[f] = b[f].sort(function (b, a) {
                    return b.order == a.order ? 0 : 0 > a.order ? -1 : 0 > b.order ? 1 : b.order < a.order ? -1 : 1
                });
                return b
            }

            function c(c, e) {
                if (e.length) {
                    c.items ? c.items.push(a.ui.create("-")) : c.items = [];
                    for (var f; f = e.shift();)if (f = "string" == typeof f ? f : f.name, !b || -1 == CKEDITOR.tools.indexOf(b, f))(f = a.ui.create(f)) && a.addFeature(f) && c.items.push(f)
                }
            }

            function h(b) {
                var a = [], e, d, h;
                for (e = 0; e < b.length; ++e)d = b[e], h = {}, "/" == d ? a.push(d) : CKEDITOR.tools.isArray(d) ? (c(h, CKEDITOR.tools.clone(d)), a.push(h)) : d.items && (c(h, CKEDITOR.tools.clone(d.items)),
                    h.name = d.name, a.push(h));
                return a
            }

            var b = a.config.removeButtons, b = b && b.split(","), e = a.config.toolbar;
            "string" == typeof e && (e = a.config["toolbar_" + e]);
            return a.toolbar = e ? h(e) : d()
        }

        function n(a) {
            return a._.toolbarGroups || (a._.toolbarGroups = [
                {name: "document", groups: ["mode", "document", "doctools"]},
                {name: "clipboard", groups: ["clipboard", "undo"]},
                {name: "editing", groups: ["find", "selection", "spellchecker"]},
                {name: "forms"},
                "/",
                {name: "basicstyles", groups: ["basicstyles", "cleanup"]},
                {name: "paragraph", groups: ["list",
                    "indent", "blocks", "align"]},
                {name: "links"},
                {name: "insert"},
                "/",
                {name: "styles"},
                {name: "colors"},
                {name: "tools"},
                {name: "others"},
                {name: "about"}
            ])
        }

        var t = function () {
            this.toolbars = [];
            this.focusCommandExecuted = !1
        };
        t.prototype.focus = function () {
            for (var a = 0, d; d = this.toolbars[a++];)for (var i = 0, c; c = d.items[i++];)if (c.focus) {
                c.focus();
                return
            }
        };
        var x = {modes: {wysiwyg: 1, source: 1}, readOnly: 1, exec: function (a) {
            a.toolbox && (a.toolbox.focusCommandExecuted = !0, CKEDITOR.env.ie || CKEDITOR.env.air ? setTimeout(function () {
                    a.toolbox.focus()
                },
                100) : a.toolbox.focus())
        }};
        CKEDITOR.plugins.add("toolbar", {requires: "button", init: function (a) {
            var d, i = function (c, h) {
                var b, e = "rtl" == a.lang.dir, g = a.config.toolbarGroupCycling, g = void 0 === g || g;
                switch (h) {
                    case 9:
                    case CKEDITOR.SHIFT + 9:
                        for (; !b || !b.items.length;)if (b = 9 == h ? (b ? b.next : c.toolbar.next) || a.toolbox.toolbars[0] : (b ? b.previous : c.toolbar.previous) || a.toolbox.toolbars[a.toolbox.toolbars.length - 1], b.items.length)for (c = b.items[d ? b.items.length - 1 : 0]; c && !c.focus;)(c = d ? c.previous : c.next) || (b = 0);
                        c && c.focus();
                        return!1;
                    case e ? 37 : 39:
                    case 40:
                        b = c;
                        do b = b.next, !b && g && (b = c.toolbar.items[0]); while (b && !b.focus);
                        b ? b.focus() : i(c, 9);
                        return!1;
                    case e ? 39 : 37:
                    case 38:
                        b = c;
                        do b = b.previous, !b && g && (b = c.toolbar.items[c.toolbar.items.length - 1]); while (b && !b.focus);
                        b ? b.focus() : (d = 1, i(c, CKEDITOR.SHIFT + 9), d = 0);
                        return!1;
                    case 27:
                        return a.focus(), !1;
                    case 13:
                    case 32:
                        return c.execute(), !1
                }
                return!0
            };
            a.on("uiSpace", function (c) {
                if (c.data.space == a.config.toolbarLocation) {
                    c.removeListener();
                    a.toolbox = new t;
                    var d = CKEDITOR.tools.getNextId(),
                        b = ['<span id="', d, '" class="cke_voice_label">', a.lang.toolbar.toolbars, "</span>", '<span id="' + a.ui.spaceId("toolbox") + '" class="cke_toolbox" roles="group" aria-labelledby="', d, '" onmousedown="return false;">'], d = !1 !== a.config.toolbarStartupExpanded, e, g;
                    a.config.toolbarCanCollapse && a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && b.push('<span class="cke_toolbox_main"' + (d ? ">" : ' style="display:none">'));
                    for (var n = a.toolbox.toolbars, f = w(a), k = 0; k < f.length; k++) {
                        var j, l = 0, q, m = f[k], r;
                        if (m)if (e && (b.push("</span>"),
                            g = e = 0), "/" === m)b.push('<span class="cke_toolbar_break"></span>'); else {
                            r = m.items || m;
                            for (var s = 0; s < r.length; s++) {
                                var o = r[s], u;
                                if (o)if (o.type == CKEDITOR.UI_SEPARATOR)g = e && o; else {
                                    u = !1 !== o.canGroup;
                                    if (!l) {
                                        j = CKEDITOR.tools.getNextId();
                                        l = {id: j, items: []};
                                        q = m.name && (a.lang.toolbar.toolbarGroups[m.name] || m.name);
                                        b.push('<span id="', j, '" class="cke_toolbar"', q ? ' aria-labelledby="' + j + '_label"' : "", ' roles="toolbar">');
                                        q && b.push('<span id="', j, '_label" class="cke_voice_label">', q, "</span>");
                                        b.push('<span class="cke_toolbar_start"></span>');
                                        var p = n.push(l) - 1;
                                        0 < p && (l.previous = n[p - 1], l.previous.next = l)
                                    }
                                    u ? e || (b.push('<span class="cke_toolgroup" roles="presentation">'), e = 1) : e && (b.push("</span>"), e = 0);
                                    j = function (c) {
                                        c = c.render(a, b);
                                        p = l.items.push(c) - 1;
                                        if (p > 0) {
                                            c.previous = l.items[p - 1];
                                            c.previous.next = c
                                        }
                                        c.toolbar = l;
                                        c.onkey = i;
                                        c.onfocus = function () {
                                            a.toolbox.focusCommandExecuted || a.focus()
                                        }
                                    };
                                    g && (j(g), g = 0);
                                    j(o)
                                }
                            }
                            e && (b.push("</span>"), g = e = 0);
                            l && b.push('<span class="cke_toolbar_end"></span></span>')
                        }
                    }
                    a.config.toolbarCanCollapse && b.push("</span>");
                    if (a.config.toolbarCanCollapse &&
                        a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                        var v = CKEDITOR.tools.addFunction(function () {
                            a.execCommand("toolbarCollapse")
                        });
                        a.on("destroy", function () {
                            CKEDITOR.tools.removeFunction(v)
                        });
                        a.addCommand("toolbarCollapse", {readOnly: 1, exec: function (b) {
                            var a = b.ui.space("toolbar_collapser"), c = a.getPrevious(), e = b.ui.space("contents"), d = c.getParent(), f = parseInt(e.$.style.height, 10), h = d.$.offsetHeight, g = a.hasClass("cke_toolbox_collapser_min");
                            g ? (c.show(), a.removeClass("cke_toolbox_collapser_min"), a.setAttribute("title",
                                b.lang.toolbar.toolbarCollapse)) : (c.hide(), a.addClass("cke_toolbox_collapser_min"), a.setAttribute("title", b.lang.toolbar.toolbarExpand));
                            a.getFirst().setText(g ? "▲" : "◀");
                            e.setStyle("height", f - (d.$.offsetHeight - h) + "px");
                            b.fire("resize")
                        }, modes: {wysiwyg: 1, source: 1}});
                        a.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109), "toolbarCollapse");
                        b.push('<a title="' + (d ? a.lang.toolbar.toolbarCollapse : a.lang.toolbar.toolbarExpand) + '" id="' + a.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser');
                        d || b.push(" cke_toolbox_collapser_min");
                        b.push('" onclick="CKEDITOR.tools.callFunction(' + v + ')">', '<span class="cke_arrow">&#9650;</span>', "</a>")
                    }
                    b.push("</span>");
                    c.data.html += b.join("")
                }
            });
            a.on("destroy", function () {
                if (this.toolbox) {
                    var a, d = 0, b, e, g;
                    for (a = this.toolbox.toolbars; d < a.length; d++) {
                        e = a[d].items;
                        for (b = 0; b < e.length; b++)g = e[b], g.clickFn && CKEDITOR.tools.removeFunction(g.clickFn), g.keyDownFn && CKEDITOR.tools.removeFunction(g.keyDownFn)
                    }
                }
            });
            a.on("uiReady", function () {
                var c = a.ui.space("toolbox");
                c && a.focusManager.add(c, 1)
            });
            a.addCommand("toolbarFocus", x);
            a.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
            a.ui.add("-", CKEDITOR.UI_SEPARATOR, {});
            a.ui.addHandler(CKEDITOR.UI_SEPARATOR, {create: function () {
                return{render: function (a, d) {
                    d.push('<span class="cke_toolbar_separator" roles="separator"></span>');
                    return{}
                }}
            }})
        }});
        CKEDITOR.ui.prototype.addToolbarGroup = function (a, d, i) {
            var c = n(this.editor), h = 0 === d, b = {name: a};
            if (i) {
                if (i = CKEDITOR.tools.search(c, function (a) {
                    return a.name == i
                })) {
                    !i.groups && (i.groups =
                        []);
                    if (d && (d = CKEDITOR.tools.indexOf(i.groups, d), 0 <= d)) {
                        i.groups.splice(d + 1, 0, a);
                        return
                    }
                    h ? i.groups.splice(0, 0, a) : i.groups.push(a);
                    return
                }
                d = null
            }
            d && (d = CKEDITOR.tools.indexOf(c, function (a) {
                return a.name == d
            }));
            h ? c.splice(0, 0, a) : "number" == typeof d ? c.splice(d + 1, 0, b) : c.push(a)
        }
    })();
    CKEDITOR.UI_SEPARATOR = "separator";
    CKEDITOR.config.toolbarLocation = "top";
    (function () {
        var h;

        function m(a, d) {
            function o(b) {
                b = a._.elementsPath.list[b];
                if (b.equals(a.editable())) {
                    var e = a.createRange();
                    e.selectNodeContents(b);
                    e.select()
                } else a.getSelection().selectElement(b);
                a.focus()
            }

            function p() {
                i && i.setHtml(n);
                delete a._.elementsPath.list
            }

            var l = a.ui.spaceId("path"), i, q = "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_";
            a._.elementsPath = {idBase: q, filters: []};
            d.html += '<span id="' + l + '_label" class="cke_voice_label">' + a.lang.elementspath.eleLabel + '</span><span id="' + l + '" class="cke_path" roles="group" aria-labelledby="' +
                l + '_label">' + n + "</span>";
            a.on("uiReady", function () {
                var b = a.ui.space("path");
                b && a.focusManager.add(b, 1)
            });
            var m = CKEDITOR.tools.addFunction(o), r = CKEDITOR.tools.addFunction(function (b, e) {
                var c = a._.elementsPath.idBase, f, e = new CKEDITOR.dom.event(e);
                f = "rtl" == a.lang.dir;
                switch (e.getKeystroke()) {
                    case f ? 39 : 37:
                    case 9:
                        return(f = CKEDITOR.document.getById(c + (b + 1))) || (f = CKEDITOR.document.getById(c + "0")), f.focus(), !1;
                    case f ? 37 : 39:
                    case CKEDITOR.SHIFT + 9:
                        return(f = CKEDITOR.document.getById(c + (b - 1))) || (f = CKEDITOR.document.getById(c +
                            (a._.elementsPath.list.length - 1))), f.focus(), !1;
                    case 27:
                        return a.focus(), !1;
                    case 13:
                    case 32:
                        return o(b), !1
                }
                return!0
            });
            a.on("selectionChange", function (b) {
                for (var e = a.editable(), c = b.data.selection.getStartElement(), b = [], f = a._.elementsPath.list = [], d = a._.elementsPath.filters; c;) {
                    var j = 0, g;
                    g = c.data("cke-display-name") ? c.data("cke-display-name") : c.data("cke-real-element-type") ? c.data("cke-real-element-type") : c.getName();
                    for (var k = 0; k < d.length; k++) {
                        var h = d[k](c, g);
                        if (!1 === h) {
                            j = 1;
                            break
                        }
                        g = h || g
                    }
                    j || (j = f.push(c) -
                        1, k = a.lang.elementspath.eleTitle.replace(/%1/, g), g = s.output({id: q + j, label: k, text: g, jsTitle: "javascript:void('" + g + "')", index: j, keyDownFn: r, clickFn: m}), b.unshift(g));
                    if (c.equals(e))break;
                    c = c.getParent()
                }
                i || (i = CKEDITOR.document.getById(l));
                e = i;
                e.setHtml(b.join("") + n);
                a.fire("elementsPathUpdate", {space: e})
            });
            a.on("readOnly", p);
            a.on("contentDomUnload", p);
            a.addCommand("elementsPathFocus", h);
            a.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus")
        }

        h = {editorFocus: !1, readOnly: 1, exec: function (a) {
            (a = CKEDITOR.document.getById(a._.elementsPath.idBase +
                "0")) && a.focus(CKEDITOR.env.ie || CKEDITOR.env.air)
        }};
        var n = '<span class="cke_path_empty">&nbsp;</span>', d = "";
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac)d += ' onkeypress="return false;"';
        CKEDITOR.env.gecko && (d += ' onblur="this.style.cssText = this.style.cssText;"');
        var s = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' + (CKEDITOR.env.gecko && 10900 > CKEDITOR.env.version ? ' onfocus="event.preventBubble();"' : "") + d + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" roles="button" aria-label="{label}">{text}</a>');
        CKEDITOR.plugins.add("elementspath", {init: function (a) {
            a.on("uiSpace", function (d) {
                "bottom" == d.data.space && m(a, d.data)
            })
        }})
    })();
    (function () {
        function C(c, j, f) {
            function b(b) {
                if ((d = a[b ? "getFirst" : "getLast"]()) && (!d.is || !d.isBlockBoundary()) && (m = j.root[b ? "getPrevious" : "getNext"](CKEDITOR.dom.walker.invisible(!0))) && (!m.is || !m.isBlockBoundary({br: 1})))c.document.createElement("br")[b ? "insertBefore" : "insertAfter"](d)
            }

            for (var i = CKEDITOR.plugins.list.listToArray(j.root, f), e = [], h = 0; h < j.contents.length; h++) {
                var g = j.contents[h];
                if ((g = g.getAscendant("li", !0)) && !g.getCustomData("list_item_processed"))e.push(g), CKEDITOR.dom.element.setMarker(f,
                    g, "list_item_processed", !0)
            }
            g = null;
            for (h = 0; h < e.length; h++)g = e[h].getCustomData("listarray_index"), i[g].indent = -1;
            for (h = g + 1; h < i.length; h++)if (i[h].indent > i[h - 1].indent + 1) {
                e = i[h - 1].indent + 1 - i[h].indent;
                for (g = i[h].indent; i[h] && i[h].indent >= g;)i[h].indent += e, h++;
                h--
            }
            var a = CKEDITOR.plugins.list.arrayToList(i, f, null, c.config.enterMode, j.root.getAttribute("dir")).listNode, d, m;
            b(!0);
            b();
            a.replace(j.root)
        }

        function x(c, j) {
            this.name = c;
            this.context = this.type = j;
            this.allowedContent = j + " li";
            this.requiredContent =
                j
        }

        function y(c, j, f, b) {
            for (var i, e; i = c[b ? "getLast" : "getFirst"](D);)(e = i.getDirection(1)) !== j.getDirection(1) && i.setAttribute("dir", e), i.remove(), f ? i[b ? "insertBefore" : "insertAfter"](f) : j.append(i, b)
        }

        function A(c) {
            var j;
            (j = function (f) {
                var b = c[f ? "getPrevious" : "getNext"](q);
                b && (b.type == CKEDITOR.NODE_ELEMENT && b.is(c.getName())) && (y(c, b, null, !f), c.remove(), c = b)
            })();
            j(1)
        }

        function B(c) {
            return c.type == CKEDITOR.NODE_ELEMENT && (c.getName()in CKEDITOR.dtd.$block || c.getName()in CKEDITOR.dtd.$listItem) && CKEDITOR.dtd[c.getName()]["#"]
        }

        function v(c, j, f) {
            c.fire("saveSnapshot");
            f.enlarge(CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS);
            var b = f.extractContents();
            j.trim(!1, !0);
            var i = j.createBookmark(), e = new CKEDITOR.dom.elementPath(j.startContainer), h = e.block, e = e.lastElement.getAscendant("li", 1) || h, g = new CKEDITOR.dom.elementPath(f.startContainer), a = g.contains(CKEDITOR.dtd.$listItem), g = g.contains(CKEDITOR.dtd.$list);
            h ? (h = h.getBogus()) && h.remove() : g && (h = g.getPrevious(q)) && u(h) && h.remove();
            (h = b.getLast()) && (h.type == CKEDITOR.NODE_ELEMENT && h.is("br")) &&
            h.remove();
            (h = j.startContainer.getChild(j.startOffset)) ? b.insertBefore(h) : j.startContainer.append(b);
            if (a && (b = w(a)))e.contains(a) ? (y(b, a.getParent(), a), b.remove()) : e.append(b);
            for (; f.checkStartOfBlock() && f.checkEndOfBlock();)g = f.startPath(), b = g.block, b.is("li") && (e = b.getParent(), b.equals(e.getLast(q)) && b.equals(e.getFirst(q)) && (b = e)), f.moveToPosition(b, CKEDITOR.POSITION_BEFORE_START), b.remove();
            f = f.clone();
            b = c.editable();
            f.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
            f = new CKEDITOR.dom.walker(f);
            f.evaluator =
                function (a) {
                    return q(a) && !u(a)
                };
            (f = f.next()) && (f.type == CKEDITOR.NODE_ELEMENT && f.getName()in CKEDITOR.dtd.$list) && A(f);
            j.moveToBookmark(i);
            j.select();
            c.fire("saveSnapshot")
        }

        function w(c) {
            return(c = c.getLast(q)) && c.type == CKEDITOR.NODE_ELEMENT && c.getName()in r ? c : null
        }

        var r = {ol: 1, ul: 1}, E = CKEDITOR.dom.walker.whitespaces(), F = CKEDITOR.dom.walker.bookmark(), q = function (c) {
            return!(E(c) || F(c))
        }, u = CKEDITOR.dom.walker.bogus();
        CKEDITOR.plugins.list = {listToArray: function (c, j, f, b, i) {
            if (!r[c.getName()])return[];
            b ||
            (b = 0);
            f || (f = []);
            for (var e = 0, h = c.getChildCount(); e < h; e++) {
                var g = c.getChild(e);
                g.type == CKEDITOR.NODE_ELEMENT && g.getName()in CKEDITOR.dtd.$list && CKEDITOR.plugins.list.listToArray(g, j, f, b + 1);
                if ("li" == g.$.nodeName.toLowerCase()) {
                    var a = {parent: c, indent: b, element: g, contents: []};
                    i ? a.grandparent = i : (a.grandparent = c.getParent(), a.grandparent && "li" == a.grandparent.$.nodeName.toLowerCase() && (a.grandparent = a.grandparent.getParent()));
                    j && CKEDITOR.dom.element.setMarker(j, g, "listarray_index", f.length);
                    f.push(a);
                    for (var d =
                        0, m = g.getChildCount(), k; d < m; d++)k = g.getChild(d), k.type == CKEDITOR.NODE_ELEMENT && r[k.getName()] ? CKEDITOR.plugins.list.listToArray(k, j, f, b + 1, a.grandparent) : a.contents.push(k)
                }
            }
            return f
        }, arrayToList: function (c, j, f, b, i) {
            f || (f = 0);
            if (!c || c.length < f + 1)return null;
            for (var e, h = c[f].parent.getDocument(), g = new CKEDITOR.dom.documentFragment(h), a = null, d = f, m = Math.max(c[f].indent, 0), k = null, n, l, p = b == CKEDITOR.ENTER_P ? "p" : "div"; ;) {
                var o = c[d];
                e = o.grandparent;
                n = o.element.getDirection(1);
                if (o.indent == m) {
                    if (!a || c[d].parent.getName() !=
                        a.getName())a = c[d].parent.clone(!1, 1), i && a.setAttribute("dir", i), g.append(a);
                    k = a.append(o.element.clone(0, 1));
                    n != a.getDirection(1) && k.setAttribute("dir", n);
                    for (e = 0; e < o.contents.length; e++)k.append(o.contents[e].clone(1, 1));
                    d++
                } else if (o.indent == Math.max(m, 0) + 1)l = c[d - 1].element.getDirection(1), d = CKEDITOR.plugins.list.arrayToList(c, null, d, b, l != n ? n : null), !k.getChildCount() && (CKEDITOR.env.ie && !(7 < h.$.documentMode)) && k.append(h.createText(" ")), k.append(d.listNode), d = d.nextIndex; else if (-1 == o.indent && !f && e) {
                    r[e.getName()] ? (k = o.element.clone(!1, !0), n != e.getDirection(1) && k.setAttribute("dir", n)) : k = new CKEDITOR.dom.documentFragment(h);
                    var a = e.getDirection(1) != n, s = o.element, z = s.getAttribute("class"), u = s.getAttribute("style"), w = k.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && (b != CKEDITOR.ENTER_BR || a || u || z), t, x = o.contents.length;
                    for (e = 0; e < x; e++) {
                        t = o.contents[e];
                        if (t.type == CKEDITOR.NODE_ELEMENT && t.isBlockBoundary()) {
                            a && !t.getDirection() && t.setAttribute("dir", n);
                            var v = t, y = s.getAttribute("style");
                            y && v.setAttribute("style",
                                y.replace(/([^;])$/, "$1;") + (v.getAttribute("style") || ""));
                            z && t.addClass(z)
                        } else w && (l || (l = h.createElement(p), a && l.setAttribute("dir", n)), u && l.setAttribute("style", u), z && l.setAttribute("class", z), l.append(t.clone(1, 1)));
                        k.append(l || t.clone(1, 1))
                    }
                    k.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && d != c.length - 1 && ((n = k.getLast()) && (n.type == CKEDITOR.NODE_ELEMENT && "_moz" == n.getAttribute("type")) && n.remove(), (!k.getLast(q) || !(n.type == CKEDITOR.NODE_ELEMENT && n.getName()in CKEDITOR.dtd.$block)) && k.append(h.createElement("br")));
                    n = k.$.nodeName.toLowerCase();
                    !CKEDITOR.env.ie && ("div" == n || "p" == n) && k.appendBogus();
                    g.append(k);
                    a = null;
                    d++
                } else return null;
                l = null;
                if (c.length <= d || Math.max(c[d].indent, 0) < m)break
            }
            if (j)for (c = g.getFirst(); c;) {
                if (c.type == CKEDITOR.NODE_ELEMENT && (CKEDITOR.dom.element.clearMarkers(j, c), c.getName()in CKEDITOR.dtd.$listItem && (f = c, h = i = b = void 0, b = f.getDirection()))) {
                    for (i = f.getParent(); i && !(h = i.getDirection());)i = i.getParent();
                    b == h && f.removeAttribute("dir")
                }
                c = c.getNextSourceNode()
            }
            return{listNode: g, nextIndex: d}
        }};
        var G = /^h[1-6]$/, D = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT);
        x.prototype = {exec: function (c) {
            this.refresh(c, c.elementPath());
            var j = c.config, f = c.getSelection(), b = f && f.getRanges(!0);
            if (this.state == CKEDITOR.TRISTATE_OFF) {
                var i = c.editable();
                if (i.getFirst(q)) {
                    var e = 1 == b.length && b[0];
                    (j = e && e.getEnclosedNode()) && (j.is && this.type == j.getName()) && this.setState(CKEDITOR.TRISTATE_ON)
                } else j.enterMode == CKEDITOR.ENTER_BR ? i.appendBogus() : b[0].fixBlock(1, j.enterMode == CKEDITOR.ENTER_P ? "p" : "div"), f.selectRanges(b)
            }
            for (var j =
                f.createBookmarks(!0), i = [], h = {}, b = b.createIterator(), g = 0; (e = b.getNextRange()) && ++g;) {
                var a = e.getBoundaryNodes(), d = a.startNode, m = a.endNode;
                d.type == CKEDITOR.NODE_ELEMENT && "td" == d.getName() && e.setStartAt(a.startNode, CKEDITOR.POSITION_AFTER_START);
                m.type == CKEDITOR.NODE_ELEMENT && "td" == m.getName() && e.setEndAt(a.endNode, CKEDITOR.POSITION_BEFORE_END);
                e = e.createIterator();
                for (e.forceBrBreak = this.state == CKEDITOR.TRISTATE_OFF; a = e.getNextParagraph();)if (!a.getCustomData("list_block")) {
                    CKEDITOR.dom.element.setMarker(h,
                        a, "list_block", 1);
                    for (var k = c.elementPath(a), d = k.elements, m = 0, k = k.blockLimit, n, l = d.length - 1; 0 <= l && (n = d[l]); l--)if (r[n.getName()] && k.contains(n)) {
                        k.removeCustomData("list_group_object_" + g);
                        (d = n.getCustomData("list_group_object")) ? d.contents.push(a) : (d = {root: n, contents: [a]}, i.push(d), CKEDITOR.dom.element.setMarker(h, n, "list_group_object", d));
                        m = 1;
                        break
                    }
                    m || (m = k, m.getCustomData("list_group_object_" + g) ? m.getCustomData("list_group_object_" + g).contents.push(a) : (d = {root: m, contents: [a]}, CKEDITOR.dom.element.setMarker(h,
                        m, "list_group_object_" + g, d), i.push(d)))
                }
            }
            for (n = []; 0 < i.length;)if (d = i.shift(), this.state == CKEDITOR.TRISTATE_OFF)if (r[d.root.getName()]) {
                a = c;
                b = d;
                d = h;
                g = n;
                m = CKEDITOR.plugins.list.listToArray(b.root, d);
                k = [];
                for (e = 0; e < b.contents.length; e++)if (l = b.contents[e], (l = l.getAscendant("li", !0)) && !l.getCustomData("list_item_processed"))k.push(l), CKEDITOR.dom.element.setMarker(d, l, "list_item_processed", !0);
                for (var l = b.root.getDocument(), p = void 0, o = void 0, e = 0; e < k.length; e++) {
                    var s = k[e].getCustomData("listarray_index"),
                        p = m[s].parent;
                    p.is(this.type) || (o = l.createElement(this.type), p.copyAttributes(o, {start: 1, type: 1}), o.removeStyle("list-style-type"), m[s].parent = o)
                }
                a = CKEDITOR.plugins.list.arrayToList(m, d, null, a.config.enterMode);
                d = void 0;
                m = a.listNode.getChildCount();
                for (e = 0; e < m && (d = a.listNode.getChild(e)); e++)d.getName() == this.type && g.push(d);
                a.listNode.replace(b.root)
            } else {
                m = c;
                a = d;
                e = n;
                k = a.contents;
                b = a.root.getDocument();
                g = [];
                1 == k.length && k[0].equals(a.root) && (d = b.createElement("div"), k[0].moveChildren && k[0].moveChildren(d),
                    k[0].append(d), k[0] = d);
                a = a.contents[0].getParent();
                for (l = 0; l < k.length; l++)a = a.getCommonAncestor(k[l].getParent());
                p = m.config.useComputedState;
                m = d = void 0;
                p = void 0 === p || p;
                for (l = 0; l < k.length; l++)for (o = k[l]; s = o.getParent();) {
                    if (s.equals(a)) {
                        g.push(o);
                        !m && o.getDirection() && (m = 1);
                        o = o.getDirection(p);
                        null !== d && (d = d && d != o ? null : o);
                        break
                    }
                    o = s
                }
                if (!(1 > g.length)) {
                    k = g[g.length - 1].getNext();
                    l = b.createElement(this.type);
                    e.push(l);
                    for (p = e = void 0; g.length;)e = g.shift(), p = b.createElement("li"), e.is("pre") || G.test(e.getName()) ?
                        e.appendTo(p) : (e.copyAttributes(p), d && e.getDirection() && (p.removeStyle("direction"), p.removeAttribute("dir")), e.moveChildren(p), e.remove()), p.appendTo(l);
                    d && m && l.setAttribute("dir", d);
                    k ? l.insertBefore(k) : l.appendTo(a)
                }
            } else this.state == CKEDITOR.TRISTATE_ON && r[d.root.getName()] && C.call(this, c, d, h);
            for (l = 0; l < n.length; l++)A(n[l]);
            CKEDITOR.dom.element.clearAllMarkers(h);
            f.selectBookmarks(j);
            c.focus()
        }, refresh: function (c, j) {
            var f = j.contains(r, 1), b = j.blockLimit || j.root;
            f && b.contains(f) ? this.setState(f.is(this.type) ?
                CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_OFF)
        }};
        CKEDITOR.plugins.add("list", {requires: "indent", init: function (c) {
            c.blockless || (c.addCommand("numberedlist", new x("numberedlist", "ol")), c.addCommand("bulletedlist", new x("bulletedlist", "ul")), c.ui.addButton && (c.ui.addButton("NumberedList", {label: c.lang.list.numberedlist, command: "numberedlist", directional: !0, toolbar: "list,10"}), c.ui.addButton("BulletedList", {label: c.lang.list.bulletedlist, command: "bulletedlist", directional: !0,
                toolbar: "list,20"})), c.on("key", function (j) {
                var f = j.data.keyCode;
                if (c.mode == "wysiwyg" && f in{8: 1, 46: 1}) {
                    var b = c.getSelection().getRanges()[0], i = b.startPath();
                    if (b.collapsed) {
                        var i = new CKEDITOR.dom.elementPath(b.startContainer), e = f == 8, h = c.editable(), g = new CKEDITOR.dom.walker(b.clone());
                        g.evaluator = function (a) {
                            return q(a) && !u(a)
                        };
                        g.guard = function (a, b) {
                            return!(b && a.type == CKEDITOR.NODE_ELEMENT && a.is("table"))
                        };
                        f = b.clone();
                        if (e) {
                            var a, d;
                            if ((a = i.contains(r)) && b.checkBoundaryOfElement(a, CKEDITOR.START) &&
                                (a = a.getParent()) && a.is("li") && (a = w(a))) {
                                d = a;
                                a = a.getPrevious(q);
                                f.moveToPosition(a && u(a) ? a : d, CKEDITOR.POSITION_BEFORE_START)
                            } else {
                                g.range.setStartAt(h, CKEDITOR.POSITION_AFTER_START);
                                g.range.setEnd(b.startContainer, b.startOffset);
                                if ((a = g.previous()) && a.type == CKEDITOR.NODE_ELEMENT && (a.getName()in r || a.is("li"))) {
                                    if (!a.is("li")) {
                                        g.range.selectNodeContents(a);
                                        g.reset();
                                        g.evaluator = B;
                                        a = g.previous()
                                    }
                                    d = a;
                                    f.moveToElementEditEnd(d)
                                }
                            }
                            if (d) {
                                v(c, f, b);
                                j.cancel()
                            } else if ((f = i.contains(r)) && b.checkBoundaryOfElement(f,
                                CKEDITOR.START)) {
                                d = f.getFirst(q);
                                if (b.checkBoundaryOfElement(d, CKEDITOR.START)) {
                                    a = f.getPrevious(q);
                                    if (w(d)) {
                                        if (a) {
                                            b.moveToElementEditEnd(a);
                                            b.select()
                                        }
                                    } else c.execCommand("outdent");
                                    j.cancel()
                                }
                            }
                        } else if (d = i.contains("li")) {
                            g.range.setEndAt(h, CKEDITOR.POSITION_BEFORE_END);
                            h = (i = d.getLast(q)) && B(i) ? i : d;
                            d = 0;
                            if ((a = g.next()) && a.type == CKEDITOR.NODE_ELEMENT && a.getName()in r && a.equals(i)) {
                                d = 1;
                                a = g.next()
                            } else b.checkBoundaryOfElement(h, CKEDITOR.END) && (d = 1);
                            if (d && a) {
                                b = b.clone();
                                b.moveToElementEditStart(a);
                                v(c,
                                    f, b);
                                j.cancel()
                            }
                        } else {
                            g.range.setEndAt(h, CKEDITOR.POSITION_BEFORE_END);
                            if ((a = g.next()) && a.type == CKEDITOR.NODE_ELEMENT && a.is(r)) {
                                a = a.getFirst(q);
                                if (i.block && b.checkStartOfBlock() && b.checkEndOfBlock()) {
                                    i.block.remove();
                                    b.moveToElementEditStart(a);
                                    b.select()
                                } else if (w(a)) {
                                    b.moveToElementEditStart(a);
                                    b.select()
                                } else {
                                    b = b.clone();
                                    b.moveToElementEditStart(a);
                                    v(c, f, b)
                                }
                                j.cancel()
                            }
                        }
                        setTimeout(function () {
                            c.selectionChange(1)
                        })
                    }
                }
            }))
        }})
    })();
    (function () {
        function p(d, i) {
            this.name = i;
            var a = this.useIndentClasses = d.config.indentClasses && 0 < d.config.indentClasses.length;
            if (a) {
                this.classNameRegex = RegExp("(?:^|\\s+)(" + d.config.indentClasses.join("|") + ")(?=$|\\s)");
                this.indentClassMap = {};
                for (var f = 0; f < d.config.indentClasses.length; f++)this.indentClassMap[d.config.indentClasses[f]] = f + 1
            }
            this.startDisabled = "outdent" == i;
            this.allowedContent = {"div h1 h2 h3 h4 h5 h6 ol p pre ul": {propertiesOnly: !0, styles: !a ? "margin-left,margin-right" : null, classes: a ? d.config.indentClasses :
                null}};
            this.requiredContent = ["p" + (a ? "(" + d.config.indentClasses[0] + ")" : "{margin-left}"), "li"]
        }

        function r(d, i) {
            return"ltr" == (i || d.getComputedStyle("direction")) ? "margin-left" : "margin-right"
        }

        function q(d) {
            return d.type == CKEDITOR.NODE_ELEMENT && d.is("li")
        }

        var m = {ol: 1, ul: 1}, t = CKEDITOR.dom.walker.whitespaces(!0), u = CKEDITOR.dom.walker.bookmark(!1, !0);
        p.prototype = {context: "p", refresh: function (d, i) {
            var a = i && i.contains(m), f = i.block || i.blockLimit;
            a ? this.setState(CKEDITOR.TRISTATE_OFF) : !this.useIndentClasses &&
                "indent" == this.name ? this.setState(CKEDITOR.TRISTATE_OFF) : f ? this.useIndentClasses ? (a = f.$.className.match(this.classNameRegex), f = 0, a && (a = a[1], f = this.indentClassMap[a]), "outdent" == this.name && !f || "indent" == this.name && f == d.config.indentClasses.length ? this.setState(CKEDITOR.TRISTATE_DISABLED) : this.setState(CKEDITOR.TRISTATE_OFF)) : (a = parseInt(f.getStyle(r(f)), 10), isNaN(a) && (a = 0), 0 >= a ? this.setState(CKEDITOR.TRISTATE_DISABLED) : this.setState(CKEDITOR.TRISTATE_OFF)) : this.setState(CKEDITOR.TRISTATE_DISABLED)
        },
            exec: function (d) {
                function i(n) {
                    for (var j = l.startContainer, b = l.endContainer; j && !j.getParent().equals(n);)j = j.getParent();
                    for (; b && !b.getParent().equals(n);)b = b.getParent();
                    if (j && b) {
                        for (var c = j, j = [], a = !1; !a;)c.equals(b) && (a = !0), j.push(c), c = c.getNext();
                        if (!(1 > j.length)) {
                            c = n.getParents(!0);
                            for (b = 0; b < c.length; b++)if (c[b].getName && m[c[b].getName()]) {
                                n = c[b];
                                break
                            }
                            for (var c = "indent" == e.name ? 1 : -1, b = j[0], j = j[j.length - 1], a = CKEDITOR.plugins.list.listToArray(n, o), f = a[j.getCustomData("listarray_index")].indent,
                                     b = b.getCustomData("listarray_index"); b <= j.getCustomData("listarray_index"); b++)if (a[b].indent += c, 0 < c) {
                                var k = a[b].parent;
                                a[b].parent = new CKEDITOR.dom.element(k.getName(), k.getDocument())
                            }
                            for (b = j.getCustomData("listarray_index") + 1; b < a.length && a[b].indent > f; b++)a[b].indent += c;
                            j = CKEDITOR.plugins.list.arrayToList(a, o, null, d.config.enterMode, n.getDirection());
                            if ("outdent" == e.name) {
                                var i;
                                if ((i = n.getParent()) && i.is("li"))for (var c = j.listNode.getChildren(), h = [], g, b = c.count() - 1; 0 <= b; b--)(g = c.getItem(b)) && (g.is &&
                                    g.is("li")) && h.push(g)
                            }
                            j && j.listNode.replace(n);
                            if (h && h.length)for (b = 0; b < h.length; b++) {
                                for (g = n = h[b]; (g = g.getNext()) && g.is && g.getName()in m;)CKEDITOR.env.ie && !n.getFirst(function (b) {
                                    return t(b) && u(b)
                                }) && n.append(l.document.createText(" ")), n.append(g);
                                n.insertAfter(i)
                            }
                        }
                    }
                }

                function a() {
                    var a = l.createIterator(), e = d.config.enterMode;
                    a.enforceRealBlocks = !0;
                    a.enlargeBr = e != CKEDITOR.ENTER_BR;
                    for (var b; b = a.getNextParagraph(e == CKEDITOR.ENTER_P ? "p" : "div");)f(b)
                }

                function f(a, g) {
                    if (a.getCustomData("indent_processed"))return!1;
                    if (e.useIndentClasses) {
                        var b = a.$.className.match(e.classNameRegex), c = 0;
                        b && (b = b[1], c = e.indentClassMap[b]);
                        "outdent" == e.name ? c-- : c++;
                        if (0 > c)return!1;
                        c = Math.min(c, d.config.indentClasses.length);
                        c = Math.max(c, 0);
                        a.$.className = CKEDITOR.tools.ltrim(a.$.className.replace(e.classNameRegex, ""));
                        0 < c && a.addClass(d.config.indentClasses[c - 1])
                    } else {
                        b = r(a, g);
                        c = parseInt(a.getStyle(b), 10);
                        isNaN(c) && (c = 0);
                        var f = d.config.indentOffset || 40, c = c + ("indent" == e.name ? 1 : -1) * f;
                        if (0 > c)return!1;
                        c = Math.max(c, 0);
                        c = Math.ceil(c / f) *
                            f;
                        a.setStyle(b, c ? c + (d.config.indentUnit || "px") : "");
                        "" === a.getAttribute("style") && a.removeAttribute("style")
                    }
                    CKEDITOR.dom.element.setMarker(o, a, "indent_processed", 1);
                    return!0
                }

                for (var e = this, o = {}, g = d.getSelection(), v = g.createBookmarks(1), l, p = (g && g.getRanges(1)).createIterator(); l = p.getNextRange();) {
                    for (var h = l.getCommonAncestor(); h && !(h.type == CKEDITOR.NODE_ELEMENT && m[h.getName()]);)h = h.getParent();
                    if (!h) {
                        var k = l.getEnclosedNode();
                        k && (k.type == CKEDITOR.NODE_ELEMENT && k.getName()in m) && (l.setStartAt(k,
                            CKEDITOR.POSITION_AFTER_START), l.setEndAt(k, CKEDITOR.POSITION_BEFORE_END), h = k)
                    }
                    h && (l.startContainer.type == CKEDITOR.NODE_ELEMENT && l.startContainer.getName()in m) && (k = new CKEDITOR.dom.walker(l), k.evaluator = q, l.startContainer = k.next());
                    h && (l.endContainer.type == CKEDITOR.NODE_ELEMENT && l.endContainer.getName()in m) && (k = new CKEDITOR.dom.walker(l), k.evaluator = q, l.endContainer = k.previous());
                    if (h) {
                        var k = h.getFirst(q), w = !!k.getNext(q), s = l.startContainer;
                        (!k.equals(s) && !k.contains(s) || !("indent" == e.name || e.useIndentClasses ||
                            parseInt(h.getStyle(r(h)), 10)) || !f(h, !w && k.getDirection())) && i(h)
                    } else a()
                }
                CKEDITOR.dom.element.clearAllMarkers(o);
                d.forceNextSelectionCheck();
                g.selectBookmarks(v)
            }};
        CKEDITOR.plugins.add("indent", {requires: "list", onLoad: function () {
            (CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat) && CKEDITOR.addCss(".cke_editable ul,.cke_editable ol{\tmargin-left: 0px;\tpadding-left: 40px;}")
        }, init: function (d) {
            d.blockless || (d.addCommand("indent", new p(d, "indent")), d.addCommand("outdent", new p(d, "outdent")), d.ui.addButton &&
                (d.ui.addButton("Indent", {label: d.lang.indent.indent, command: "indent", directional: !0, toolbar: "indent,20"}), d.ui.addButton("Outdent", {label: d.lang.indent.outdent, command: "outdent", directional: !0, toolbar: "indent,10"})), d.on("dirChanged", function (i) {
                var a = d.createRange();
                a.setStartBefore(i.data.node);
                a.setEndAfter(i.data.node);
                for (var f = new CKEDITOR.dom.walker(a), e; e = f.next();)if (e.type == CKEDITOR.NODE_ELEMENT)if (!e.equals(i.data.node) && e.getDirection()) {
                    a.setStartAfter(e);
                    f = new CKEDITOR.dom.walker(a)
                } else {
                    var o =
                        d.config.indentClasses;
                    if (o)for (var g = i.data.dir == "ltr" ? ["_rtl", ""] : ["", "_rtl"], m = 0; m < o.length; m++)if (e.hasClass(o[m] + g[0])) {
                        e.removeClass(o[m] + g[0]);
                        e.addClass(o[m] + g[1])
                    }
                    o = e.getStyle("margin-right");
                    g = e.getStyle("margin-left");
                    o ? e.setStyle("margin-left", o) : e.removeStyle("margin-left");
                    g ? e.setStyle("margin-right", g) : e.removeStyle("margin-right")
                }
            }))
        }})
    })();
    (function () {
        function m(a, d, b) {
            b = a.config.forceEnterMode || b;
            if ("wysiwyg" != a.mode)return!1;
            d || (d = a.config.enterMode);
            a.elementPath().isContextFor("p") || (d = CKEDITOR.ENTER_BR, b = 1);
            a.fire("saveSnapshot");
            d == CKEDITOR.ENTER_BR ? n(a, d, null, b) : o(a, d, null, b);
            a.fire("saveSnapshot");
            return!0
        }

        function p(a) {
            for (var a = a.getSelection().getRanges(!0), d = a.length - 1; 0 < d; d--)a[d].deleteContents();
            return a[0]
        }

        CKEDITOR.plugins.add("enterkey", {requires: "indent", init: function (a) {
            a.addCommand("enter", {modes: {wysiwyg: 1}, editorFocus: !1,
                exec: function (a) {
                    m(a)
                }});
            a.addCommand("shiftEnter", {modes: {wysiwyg: 1}, editorFocus: !1, exec: function (a) {
                "wysiwyg" == a.mode && m(a, a.config.shiftEnterMode, 1)
            }});
            a.setKeystroke([
                [13, "enter"],
                [CKEDITOR.SHIFT + 13, "shiftEnter"]
            ])
        }});
        var s = CKEDITOR.dom.walker.whitespaces(), t = CKEDITOR.dom.walker.bookmark();
        CKEDITOR.plugins.enterkey = {enterBlock: function (a, d, b, i) {
            if (b = b || p(a)) {
                var f = b.document, j = b.checkStartOfBlock(), h = b.checkEndOfBlock(), c = a.elementPath(b.startContainer).block;
                if (j && h) {
                    if (c && (c.is("li") || c.getParent().is("li"))) {
                        a.execCommand("outdent");
                        return
                    }
                    if (c && c.getParent().is("blockquote")) {
                        c.breakParent(c.getParent());
                        c.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1)) || c.getPrevious().remove();
                        c.getNext().getFirst(CKEDITOR.dom.walker.invisible(1)) || c.getNext().remove();
                        b.moveToElementEditStart(c);
                        b.select();
                        return
                    }
                } else if (c && c.is("pre") && !h) {
                    n(a, d, b, i);
                    return
                }
                var c = d == CKEDITOR.ENTER_DIV ? "div" : "p", l = b.splitBlock(c);
                if (l) {
                    var d = l.previousBlock, a = l.nextBlock, j = l.wasStartOfBlock, h = l.wasEndOfBlock, g;
                    if (a)g = a.getParent(), g.is("li") && (a.breakParent(g),
                        a.move(a.getNext(), 1)); else if (d && (g = d.getParent()) && g.is("li"))d.breakParent(g), g = d.getNext(), b.moveToElementEditStart(g), d.move(d.getPrevious());
                    if (!j && !h) {
                        if (a.is("li")) {
                            var e = b.clone();
                            e.selectNodeContents(a);
                            e = new CKEDITOR.dom.walker(e);
                            e.evaluator = function (a) {
                                return!(t(a) || s(a) || a.type == CKEDITOR.NODE_ELEMENT && a.getName()in CKEDITOR.dtd.$inline && !(a.getName()in CKEDITOR.dtd.$empty))
                            };
                            (g = e.next()) && (g.type == CKEDITOR.NODE_ELEMENT && g.is("ul", "ol")) && (CKEDITOR.env.ie ? f.createText(" ") : f.createElement("br")).insertBefore(g)
                        }
                        a &&
                        b.moveToElementEditStart(a)
                    } else {
                        var k;
                        if (d) {
                            if (d.is("li") || !q.test(d.getName()) && !d.is("pre"))e = d.clone()
                        } else a && (e = a.clone());
                        e ? i && !e.is("li") && e.renameNode(c) : g && g.is("li") ? e = g : (e = f.createElement(c), d && (k = d.getDirection()) && e.setAttribute("dir", k));
                        if (f = l.elementPath) {
                            i = 0;
                            for (g = f.elements.length; i < g; i++) {
                                k = f.elements[i];
                                if (k.equals(f.block) || k.equals(f.blockLimit))break;
                                CKEDITOR.dtd.$removeEmpty[k.getName()] && (k = k.clone(), e.moveChildren(k), e.append(k))
                            }
                        }
                        CKEDITOR.env.ie || e.appendBogus();
                        e.getParent() ||
                        b.insertNode(e);
                        e.is("li") && e.removeAttribute("value");
                        if (CKEDITOR.env.ie && j && (!h || !d.getChildCount()))b.moveToElementEditStart(h ? d : e), b.select();
                        b.moveToElementEditStart(j && !h ? a : e)
                    }
                    b.select();
                    b.scrollIntoView()
                }
            }
        }, enterBr: function (a, d, b, i) {
            if (b = b || p(a)) {
                var f = b.document, j = b.checkEndOfBlock(), h = new CKEDITOR.dom.elementPath(a.getSelection().getStartElement()), c = h.block, h = c && h.block.getName();
                !i && "li" == h ? o(a, d, b, i) : (!i && j && q.test(h) ? (j = c.getDirection()) ? (f = f.createElement("div"), f.setAttribute("dir",
                    j), f.insertAfter(c), b.setStart(f, 0)) : (f.createElement("br").insertAfter(c), CKEDITOR.env.gecko && f.createText("").insertAfter(c), b.setStartAt(c.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START)) : (c = "pre" == h && CKEDITOR.env.ie && 8 > CKEDITOR.env.version ? f.createText("\r") : f.createElement("br"), b.deleteContents(), b.insertNode(c), CKEDITOR.env.ie ? b.setStartAt(c, CKEDITOR.POSITION_AFTER_END) : (f.createText("﻿").insertAfter(c), j && c.getParent().appendBogus(), c.getNext().$.nodeValue =
                    "", b.setStartAt(c.getNext(), CKEDITOR.POSITION_AFTER_START))), b.collapse(!0), b.select(), b.scrollIntoView())
            }
        }};
        var r = CKEDITOR.plugins.enterkey, n = r.enterBr, o = r.enterBlock, q = /^h[1-6]$/
    })();
    (function () {
        function j(a, b) {
            var d = {}, e = [], f = {nbsp: " ", shy: "­", gt: ">", lt: "<", amp: "&", apos: "'", quot: '"'}, a = a.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function (a, h) {
                var c = b ? "&" + h + ";" : f[h];
                d[c] = b ? f[h] : "&" + h + ";";
                e.push(c);
                return""
            });
            if (!b && a) {
                var a = a.split(","), c = document.createElement("div"), g;
                c.innerHTML = "&" + a.join(";&") + ";";
                g = c.innerHTML;
                c = null;
                for (c = 0; c < g.length; c++) {
                    var i = g.charAt(c);
                    d[i] = "&" + a[c] + ";";
                    e.push(i)
                }
            }
            d.regex = e.join(b ? "|" : "");
            return d
        }

        CKEDITOR.plugins.add("entities", {afterInit: function (a) {
            var b =
                a.config;
            if (a = (a = a.dataProcessor) && a.htmlFilter) {
                var d = [];
                !1 !== b.basicEntities && d.push("nbsp,gt,lt,amp");
                b.entities && (d.length && d.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro"),
                    b.entities_latin && d.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml"), b.entities_greek && d.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv"),
                    b.entities_additional && d.push(b.entities_additional));
                var e = j(d.join(",")), f = e.regex ? "[" + e.regex + "]" : "a^";
                delete e.regex;
                b.entities && b.entities_processNumerical && (f = "[^ -~]|" + f);
                var f = RegExp(f, "g"), c = function (a) {
                    return b.entities_processNumerical == "force" || !e[a] ? "&#" + a.charCodeAt(0) + ";" : e[a]
                }, g = j("nbsp,gt,lt,amp,shy", !0), i = RegExp(g.regex, "g"), k = function (a) {
                    return g[a]
                };
                a.addRules({text: function (a) {
                    return a.replace(i, k).replace(f, c)
                }})
            }
        }})
    })();
    CKEDITOR.config.basicEntities = !0;
    CKEDITOR.config.entities = !0;
    CKEDITOR.config.entities_latin = !0;
    CKEDITOR.config.entities_greek = !0;
    CKEDITOR.config.entities_additional = "#39";
    CKEDITOR.plugins.add("popup");
    CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {popup: function (e, a, b, d) {
        a = a || "80%";
        b = b || "70%";
        "string" == typeof a && (1 < a.length && "%" == a.substr(a.length - 1, 1)) && (a = parseInt(window.screen.width * parseInt(a, 10) / 100, 10));
        "string" == typeof b && (1 < b.length && "%" == b.substr(b.length - 1, 1)) && (b = parseInt(window.screen.height * parseInt(b, 10) / 100, 10));
        640 > a && (a = 640);
        420 > b && (b = 420);
        var f = parseInt((window.screen.height - b) / 2, 10), g = parseInt((window.screen.width - a) / 2, 10), d = (d || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") + ",width=" +
            a + ",height=" + b + ",top=" + f + ",left=" + g, c = window.open("", null, d, !0);
        if (!c)return!1;
        try {
            -1 == navigator.userAgent.toLowerCase().indexOf(" chrome/") && (c.moveTo(g, f), c.resizeTo(a, b)), c.focus(), c.location.href = e
        } catch (h) {
            window.open(e, null, d, !0)
        }
        return!0
    }});
    (function () {
        function g(a, c) {
            var d = [];
            if (c)for (var b in c)d.push(b + "=" + encodeURIComponent(c[b])); else return a;
            return a + (-1 != a.indexOf("?") ? "&" : "?") + d.join("&")
        }

        function i(a) {
            a += "";
            return a.charAt(0).toUpperCase() + a.substr(1)
        }

        function k() {
            var a = this.getDialog(), c = a.getParentEditor();
            c._.filebrowserSe = this;
            var d = c.config["filebrowser" + i(a.getName()) + "WindowWidth"] || c.config.filebrowserWindowWidth || "80%", a = c.config["filebrowser" + i(a.getName()) + "WindowHeight"] || c.config.filebrowserWindowHeight || "70%",
                b = this.filebrowser.params || {};
            b.CKEditor = c.name;
            b.CKEditorFuncNum = c._.filebrowserFn;
            b.langCode || (b.langCode = c.langCode);
            b = g(this.filebrowser.url, b);
            c.popup(b, d, a, c.config.filebrowserWindowFeatures || c.config.fileBrowserWindowFeatures)
        }

        function l() {
            var a = this.getDialog();
            a.getParentEditor()._.filebrowserSe = this;
            return!a.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value || !a.getContentElement(this["for"][0], this["for"][1]).getAction() ? !1 : !0
        }

        function m(a, c, d) {
            var b = d.params || {};
            b.CKEditor = a.name;
            b.CKEditorFuncNum = a._.filebrowserFn;
            b.langCode || (b.langCode = a.langCode);
            c.action = g(d.url, b);
            c.filebrowser = d
        }

        function j(a, c, d, b) {
            if (b && b.length)for (var e, g = b.length; g--;)if (e = b[g], ("hbox" == e.type || "vbox" == e.type || "fieldset" == e.type) && j(a, c, d, e.children), e.filebrowser)if ("string" == typeof e.filebrowser && (e.filebrowser = {action: "fileButton" == e.type ? "QuickUpload" : "Browse", target: e.filebrowser}), "Browse" == e.filebrowser.action) {
                var f = e.filebrowser.url;
                void 0 === f && (f = a.config["filebrowser" +
                    i(c) + "BrowseUrl"], void 0 === f && (f = a.config.filebrowserBrowseUrl));
                f && (e.onClick = k, e.filebrowser.url = f, e.hidden = !1)
            } else if ("QuickUpload" == e.filebrowser.action && e["for"] && (f = e.filebrowser.url, void 0 === f && (f = a.config["filebrowser" + i(c) + "UploadUrl"], void 0 === f && (f = a.config.filebrowserUploadUrl)), f)) {
                var h = e.onClick;
                e.onClick = function (a) {
                    var b = a.sender;
                    return h && h.call(b, a) === false ? false : l.call(b, a)
                };
                e.filebrowser.url = f;
                e.hidden = !1;
                m(a, d.getContents(e["for"][0]).get(e["for"][1]), e.filebrowser)
            }
        }

        function h(a, c, d) {
            if (-1 !== d.indexOf(";")) {
                for (var d = d.split(";"), b = 0; b < d.length; b++)if (h(a, c, d[b]))return!0;
                return!1
            }
            return(a = a.getContents(c).get(d).filebrowser) && a.url
        }

        function n(a, c) {
            var d = this._.filebrowserSe.getDialog(), b = this._.filebrowserSe["for"], e = this._.filebrowserSe.filebrowser.onSelect;
            b && d.getContentElement(b[0], b[1]).reset();
            if (!("function" == typeof c && !1 === c.call(this._.filebrowserSe)) && !(e && !1 === e.call(this._.filebrowserSe, a, c)) && ("string" == typeof c && c && alert(c), a && (b = this._.filebrowserSe, d = b.getDialog(),
                b = b.filebrowser.target || null)))if (b = b.split(":"), e = d.getContentElement(b[0], b[1]))e.setValue(a), d.selectPage(b[0])
        }

        CKEDITOR.plugins.add("filebrowser", {requires: "popup", init: function (a) {
            a._.filebrowserFn = CKEDITOR.tools.addFunction(n, a);
            a.on("destroy", function () {
                CKEDITOR.tools.removeFunction(this._.filebrowserFn)
            })
        }});
        CKEDITOR.on("dialogDefinition", function (a) {
            for (var c = a.data.definition, d, b = 0; b < c.contents.length; ++b)if (d = c.contents[b])j(a.editor, a.data.name, c, d.elements), d.hidden && d.filebrowser && (d.hidden = !h(c, d.id, d.filebrowser))
        })
    })();
    (function () {
        function t(a) {
            var e = "left" == a ? "pageXOffset" : "pageYOffset";
            return e in g.$ ? g.$[e] : CKEDITOR.document.$.documentElement["left" == a ? "scrollLeft" : "scrollTop"]
        }

        function p(a) {
            var e, f = a.config, p = f.floatSpaceDockedOffsetX || 0, o = f.floatSpaceDockedOffsetY || 0, u = f.floatSpacePinnedOffsetX || 0, q = f.floatSpacePinnedOffsetY || 0, i = function (c) {
                function f(a, c, b) {
                    d.setStyle(c, s(b));
                    d.setStyle("position", a)
                }

                function j(a) {
                    var c = r.getDocumentPosition();
                    switch (a) {
                        case "top":
                            f("absolute", "top", c.y - l - o);
                            break;
                        case "pin":
                            f("fixed",
                                "top", q);
                            break;
                        case "bottom":
                            f("absolute", "top", c.y + (b.height || b.bottom - b.top) + o)
                    }
                    e = a
                }

                var r = a.editable();
                if (r) {
                    "focus" == c.name && d.show();
                    d.removeStyle("left");
                    d.removeStyle("right");
                    var k = d.getClientRect(), b = r.getClientRect(), l = k.height, n = t("left");
                    if (e) {
                        "top" == e && k.top < q ? j("pin") : "pin" == e ? b.top > o + l ? j("top") : b.bottom - k.bottom < l && j("bottom") : "bottom" == e && (b.top > o + l ? j("top") : b.bottom > 2 * l + q && j("pin"));
                        var c = g.getViewPaneSize(), h = c.width / 2, h = 0 < b.left && b.right < c.width && b.width > k.width ? "rtl" == a.config.contentsLangDirection ?
                            "right" : "left" : h - b.left > b.right - h ? "left" : "right", m;
                        k.width > c.width ? (h = "left", m = 0) : (m = "left" == h ? 0 < b.left ? b.left : 0 : b.right < c.width ? c.width - b.right : 0, m + k.width > c.width && (h = "left" == h ? "right" : "left", m = 0));
                        d.setStyle(h, s(("pin" == e ? u : p) + m + ("pin" == e ? 0 : "left" == h ? n : -n)))
                    } else e = "pin", j("pin"), i(c)
                }
            }, f = CKEDITOR.document.getBody(), v = {id: a.id, name: a.name, langDir: a.lang.dir, langCode: a.langCode}, n = a.fire("uiSpace", {space: "top", html: ""}).html;
            if (n) {
                var d = f.append(CKEDITOR.dom.element.createFromHtml(w.output(CKEDITOR.tools.extend({topId: a.ui.spaceId("top"),
                    content: n, style: "display:none;z-index:" + (a.config.baseFloatZIndex - 1)}, v))));
                d.unselectable();
                d.on("mousedown", function (a) {
                    a = a.data;
                    a.getTarget().hasAscendant("a", 1) || a.preventDefault()
                });
                a.on("focus", function (a) {
                    i(a);
                    g.on("scroll", i);
                    g.on("resize", i)
                });
                a.on("blur", function () {
                    d.hide();
                    g.removeListener("scroll", i);
                    g.removeListener("resize", i)
                });
                a.on("destroy", function () {
                    g.removeListener("scroll", i);
                    g.removeListener("resize", i);
                    d.clearCustomData();
                    d.remove()
                });
                a.focusManager.hasFocus && d.show();
                a.focusManager.add(d,
                    1)
            }
        }

        var w = CKEDITOR.addTemplate("floatcontainer", '<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" roles="application" style="{style}"><div class="cke_inner"><div id="{topId}" class="cke_top" roles="presentation">{content}</div></div></div>');
        CKEDITOR.plugins.add("floatingspace", {init: function (a) {
            a.on("loaded", function () {
                p(a)
            }, null, null, 20)
        }});
        var g =
            CKEDITOR.document.getWindow(), s = CKEDITOR.tools.cssLength
    })();
    CKEDITOR.plugins.add("listblock", {requires: "panel", onLoad: function () {
        var e = CKEDITOR.addTemplate("panel-list", '<ul roles="presentation" class="cke_panel_list">{items}</ul>'), f = CKEDITOR.addTemplate("panel-list-item", '<li id="{id}" class="cke_panel_listItem" roles=presentation><a id="{id}_option" _cke_focus=1 hidefocus=true title="{title}" href="javascript:void(\'{val}\')"  {onclick}="CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;" roles="option">{text}</a></li>'), g = CKEDITOR.addTemplate("panel-list-group",
            '<h1 id="{id}" class="cke_panel_grouptitle" roles="presentation" >{label}</h1>');
        CKEDITOR.ui.panel.prototype.addListBlock = function (a, b) {
            return this.addBlock(a, new CKEDITOR.ui.listBlock(this.getHolderElement(), b))
        };
        CKEDITOR.ui.listBlock = CKEDITOR.tools.createClass({base: CKEDITOR.ui.panel.block, $: function (a, b) {
            var b = b || {}, c = b.attributes || (b.attributes = {});
            (this.multiSelect = !!b.multiSelect) && (c["aria-multiselectable"] = !0);
            !c.role && (c.role = "listbox");
            this.base.apply(this, arguments);
            c = this.keys;
            c[40] = "next";
            c[9] = "next";
            c[38] = "prev";
            c[CKEDITOR.SHIFT + 9] = "prev";
            c[32] = CKEDITOR.env.ie ? "mouseup" : "click";
            CKEDITOR.env.ie && (c[13] = "mouseup");
            this._.pendingHtml = [];
            this._.pendingList = [];
            this._.items = {};
            this._.groups = {}
        }, _: {close: function () {
            if (this._.started) {
                var a = e.output({items: this._.pendingList.join("")});
                this._.pendingList = [];
                this._.pendingHtml.push(a);
                delete this._.started
            }
        }, getClick: function () {
            this._.click || (this._.click = CKEDITOR.tools.addFunction(function (a) {
                var b = this.toggle(a);
                if (this.onClick)this.onClick(a,
                    b)
            }, this));
            return this._.click
        }}, proto: {add: function (a, b, c) {
            var d = CKEDITOR.tools.getNextId();
            this._.started || (this._.started = 1, this._.size = this._.size || 0);
            this._.items[a] = d;
            a = {id: d, val: a, onclick: CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick", clickFn: this._.getClick(), title: c || a, text: b || a};
            this._.pendingList.push(f.output(a))
        }, startGroup: function (a) {
            this._.close();
            var b = CKEDITOR.tools.getNextId();
            this._.groups[a] = b;
            this._.pendingHtml.push(g.output({id: b, label: a}))
        }, commit: function () {
            this._.close();
            this.element.appendHtml(this._.pendingHtml.join(""));
            delete this._.size;
            this._.pendingHtml = []
        }, toggle: function (a) {
            var b = this.isMarked(a);
            b ? this.unmark(a) : this.mark(a);
            return!b
        }, hideGroup: function (a) {
            var b = (a = this.element.getDocument().getById(this._.groups[a])) && a.getNext();
            a && (a.setStyle("display", "none"), b && "ul" == b.getName() && b.setStyle("display", "none"))
        }, hideItem: function (a) {
            this.element.getDocument().getById(this._.items[a]).setStyle("display", "none")
        }, showAll: function () {
            var a = this._.items, b =
                this._.groups, c = this.element.getDocument(), d;
            for (d in a)c.getById(a[d]).setStyle("display", "");
            for (var e in b)a = c.getById(b[e]), d = a.getNext(), a.setStyle("display", ""), d && "ul" == d.getName() && d.setStyle("display", "")
        }, mark: function (a) {
            this.multiSelect || this.unmarkAll();
            var a = this._.items[a], b = this.element.getDocument().getById(a);
            b.addClass("cke_selected");
            this.element.getDocument().getById(a + "_option").setAttribute("aria-selected", !0);
            this.onMark && this.onMark(b)
        }, unmark: function (a) {
            var b = this.element.getDocument(),
                a = this._.items[a], c = b.getById(a);
            c.removeClass("cke_selected");
            b.getById(a + "_option").removeAttribute("aria-selected");
            this.onUnmark && this.onUnmark(c)
        }, unmarkAll: function () {
            var a = this._.items, b = this.element.getDocument(), c;
            for (c in a) {
                var d = a[c];
                b.getById(d).removeClass("cke_selected");
                b.getById(d + "_option").removeAttribute("aria-selected")
            }
            this.onUnmark && this.onUnmark()
        }, isMarked: function (a) {
            return this.element.getDocument().getById(this._.items[a]).hasClass("cke_selected")
        }, focus: function (a) {
            this._.focusIndex = -1;
            if (a) {
                for (var b = this.element.getDocument().getById(this._.items[a]).getFirst(), a = this.element.getElementsByTag("a"), c, d = -1; c = a.getItem(++d);)if (c.equals(b)) {
                    this._.focusIndex = d;
                    break
                }
                setTimeout(function () {
                    b.focus()
                }, 0)
            }
        }}})
    }});
    CKEDITOR.plugins.add("richcombo", {requires: "floatpanel,listblock,button", beforeInit: function (c) {
        c.ui.addHandler(CKEDITOR.UI_RICHCOMBO, CKEDITOR.ui.richCombo.handler)
    }});
    (function () {
        var c = '<span id="{id}" class="cke_combo cke_combo__{name} {cls}" roles="presentation"><span id="{id}_label" class="cke_combo_label">{label}</span><a class="cke_combo_button" hidefocus=true title="{title}" tabindex="-1"' + (CKEDITOR.env.gecko && 10900 <= CKEDITOR.env.version && !CKEDITOR.env.hc ? "" : '" href="javascript:void(\'{titleJs}\')"') + ' hidefocus="true" roles="button" aria-labelledby="{id}_label" aria-haspopup="true"';
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac)c += ' onkeypress="return false;"';
        CKEDITOR.env.gecko && (c += ' onblur="this.style.cssText = this.style.cssText;"');
        var c = c + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event,this);" onmousedown="return CKEDITOR.tools.callFunction({mousedownFn},event);"  onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span id="{id}_text" class="cke_combo_text cke_combo_inlinelabel">{label}</span><span class="cke_combo_open"><span class="cke_combo_arrow">' +
            (CKEDITOR.env.hc ? "&#9660;" : CKEDITOR.env.air ? "&nbsp;" : "") + "</span></span></a></span>"), h = CKEDITOR.addTemplate("combo", c);
        CKEDITOR.UI_RICHCOMBO = "richcombo";
        CKEDITOR.ui.richCombo = CKEDITOR.tools.createClass({$: function (a) {
            CKEDITOR.tools.extend(this, a, {canGroup: !1, title: a.label, modes: {wysiwyg: 1}, editorFocus: 1});
            a = this.panel || {};
            delete this.panel;
            this.id = CKEDITOR.tools.getNextNumber();
            this.document = a.parent && a.parent.getDocument() || CKEDITOR.document;
            a.className = "cke_combopanel";
            a.block = {multiSelect: a.multiSelect,
                attributes: a.attributes};
            a.toolbarRelated = !0;
            this._ = {panelDefinition: a, items: {}}
        }, proto: {renderHtml: function (a) {
            var b = [];
            this.render(a, b);
            return b.join("")
        }, render: function (a, b) {
            function j() {
                var d = this.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
                this.setState(a.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : d);
                this.setValue("")
            }

            var c = CKEDITOR.env, g = "cke_" + this.id, e = CKEDITOR.tools.addFunction(function (b) {
                i && (a.unlockSelection(1), i = 0);
                d.execute(b)
            }, this), f = this, d = {id: g, combo: this,
                focus: function () {
                    CKEDITOR.document.getById(g).getChild(1).focus()
                }, execute: function (d) {
                    var b = f._;
                    if (b.state != CKEDITOR.TRISTATE_DISABLED)if (f.createPanel(a), b.on)b.panel.hide(); else {
                        f.commit();
                        var c = f.getValue();
                        c ? b.list.mark(c) : b.list.unmarkAll();
                        b.panel.showBlock(f.id, new CKEDITOR.dom.element(d), 4)
                    }
                }, clickFn: e};
            a.on("mode", j, this);
            !this.readOnly && a.on("readOnly", j, this);
            var k = CKEDITOR.tools.addFunction(function (a, b) {
                var a = new CKEDITOR.dom.event(a), c = a.getKeystroke();
                switch (c) {
                    case 13:
                    case 32:
                    case 40:
                        CKEDITOR.tools.callFunction(e,
                            b);
                        break;
                    default:
                        d.onkey(d, c)
                }
                a.preventDefault()
            }), l = CKEDITOR.tools.addFunction(function () {
                d.onfocus && d.onfocus()
            }), i = 0, m = CKEDITOR.tools.addFunction(function () {
                if (CKEDITOR.env.opera) {
                    var b = a.editable();
                    b.isInline() && b.hasFocus && (a.lockSelection(), i = 1)
                }
            });
            d.keyDownFn = k;
            c = {id: g, name: this.name || this.command, label: this.label, title: this.title, cls: this.className || "", titleJs: c.gecko && 10900 <= c.version && !c.hc ? "" : (this.title || "").replace("'", ""), keydownFn: k, mousedownFn: m, focusFn: l, clickFn: e};
            h.output(c, b);
            if (this.onRender)this.onRender();
            return d
        }, createPanel: function (a) {
            if (!this._.panel) {
                var b = this._.panelDefinition, c = this._.panelDefinition.block, h = b.parent || CKEDITOR.document.getBody(), g = "cke_combopanel__" + this.name, e = new CKEDITOR.ui.floatPanel(a, h, b), f = e.addListBlock(this.id, c), d = this;
                e.onShow = function () {
                    this.element.addClass(g);
                    d.setState(CKEDITOR.TRISTATE_ON);
                    f.focus(!f.multiSelect && d.getValue());
                    d._.on = 1;
                    d.editorFocus && a.focus();
                    if (d.onOpen)d.onOpen()
                };
                e.onHide = function (b) {
                    this.element.removeClass(g);
                    d.setState(d.modes && d.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                    d._.on = 0;
                    if (!b && d.onClose)d.onClose()
                };
                e.onEscape = function () {
                    e.hide(1)
                };
                f.onClick = function (a, b) {
                    d.onClick && d.onClick.call(d, a, b);
                    e.hide()
                };
                this._.panel = e;
                this._.list = f;
                e.getBlock(this.id).onHide = function () {
                    d._.on = 0;
                    d.setState(CKEDITOR.TRISTATE_OFF)
                };
                this.init && this.init()
            }
        }, setValue: function (a, b) {
            this._.value = a;
            var c = this.document.getById("cke_" + this.id + "_text");
            c && (!a && !b ? (b = this.label, c.addClass("cke_combo_inlinelabel")) :
                c.removeClass("cke_combo_inlinelabel"), c.setText("undefined" != typeof b ? b : a))
        }, getValue: function () {
            return this._.value || ""
        }, unmarkAll: function () {
            this._.list.unmarkAll()
        }, mark: function (a) {
            this._.list.mark(a)
        }, hideItem: function (a) {
            this._.list.hideItem(a)
        }, hideGroup: function (a) {
            this._.list.hideGroup(a)
        }, showAll: function () {
            this._.list.showAll()
        }, add: function (a, b, c) {
            this._.items[a] = c || a;
            this._.list.add(a, b, c)
        }, startGroup: function (a) {
            this._.list.startGroup(a)
        }, commit: function () {
            this._.committed || (this._.list.commit(),
                this._.committed = 1, CKEDITOR.ui.fire("ready", this));
            this._.committed = 1
        }, setState: function (a) {
            if (this._.state != a) {
                var b = this.document.getById("cke_" + this.id);
                b.setState(a, "cke_combo");
                a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", !0) : b.removeAttribute("aria-disabled");
                this._.state = a
            }
        }, enable: function () {
            this._.state == CKEDITOR.TRISTATE_DISABLED && this.setState(this._.lastState)
        }, disable: function () {
            this._.state != CKEDITOR.TRISTATE_DISABLED && (this._.lastState = this._.state, this.setState(CKEDITOR.TRISTATE_DISABLED))
        }},
            statics: {handler: {create: function (a) {
                return new CKEDITOR.ui.richCombo(a)
            }}}});
        CKEDITOR.ui.prototype.addRichCombo = function (a, b) {
            this.add(a, CKEDITOR.UI_RICHCOMBO, b)
        }
    })();
    CKEDITOR.plugins.add("format", {requires: "richcombo", init: function (a) {
        if (!a.blockless) {
            for (var g = a.config, c = a.lang.format, k = g.format_tags.split(";"), d = {}, l = 0, m = [], h = 0; h < k.length; h++) {
                var i = k[h], j = new CKEDITOR.style(g["format_" + i]);
                if (!a.filter.customConfig || a.filter.check(j))l++, d[i] = j, d[i]._.enterMode = a.config.enterMode, m.push(j)
            }
            0 !== l && a.ui.addRichCombo("Format", {label: c.label, title: c.panelTitle, toolbar: "styles,20", allowedContent: m, panel: {css: [CKEDITOR.skin.getPath("editor")].concat(g.contentsCss),
                multiSelect: !1, attributes: {"aria-label": c.panelTitle}}, init: function () {
                this.startGroup(c.panelTitle);
                for (var a in d) {
                    var e = c["tag_" + a];
                    this.add(a, d[a].buildPreview(e), e)
                }
            }, onClick: function (b) {
                a.focus();
                a.fire("saveSnapshot");
                var b = d[b], e = a.elementPath();
                a[b.checkActive(e) ? "removeStyle" : "applyStyle"](b);
                setTimeout(function () {
                    a.fire("saveSnapshot")
                }, 0)
            }, onRender: function () {
                a.on("selectionChange", function (b) {
                    var e = this.getValue(), b = b.data.path, c = !a.readOnly && b.isContextFor("p");
                    this[c ? "enable" : "disable"]();
                    if (c) {
                        for (var f in d)if (d[f].checkActive(b)) {
                            f != e && this.setValue(f, a.lang.format["tag_" + f]);
                            return
                        }
                        this.setValue("")
                    }
                }, this)
            }})
        }
    }});
    CKEDITOR.config.format_tags = "p;h1;h2;h3;h4;h5;h6;pre;address;div";
    CKEDITOR.config.format_p = {element: "p"};
    CKEDITOR.config.format_div = {element: "div"};
    CKEDITOR.config.format_pre = {element: "pre"};
    CKEDITOR.config.format_address = {element: "address"};
    CKEDITOR.config.format_h1 = {element: "h1"};
    CKEDITOR.config.format_h2 = {element: "h2"};
    CKEDITOR.config.format_h3 = {element: "h3"};
    CKEDITOR.config.format_h4 = {element: "h4"};
    CKEDITOR.config.format_h5 = {element: "h5"};
    CKEDITOR.config.format_h6 = {element: "h6"};
    CKEDITOR.plugins.add("htmlwriter", {init: function (b) {
        var a = new CKEDITOR.htmlWriter;
        a.forceSimpleAmpersand = b.config.forceSimpleAmpersand;
        a.indentationChars = b.config.dataIndentationChars || "\t";
        b.dataProcessor.writer = a
    }});
    CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({base: CKEDITOR.htmlParser.basicWriter, $: function () {
        this.base();
        this.indentationChars = "\t";
        this.selfClosingEnd = " />";
        this.lineBreakChars = "\n";
        this.sortAttributes = 1;
        this._.indent = 0;
        this._.indentation = "";
        this._.inPre = 0;
        this._.rules = {};
        var b = CKEDITOR.dtd, a;
        for (a in CKEDITOR.tools.extend({}, b.$nonBodyContent, b.$block, b.$listItem, b.$tableContent))this.setRules(a, {indent: !b[a]["#"], breakBeforeOpen: 1, breakBeforeClose: !b[a]["#"], breakAfterClose: 1, needsSpace: a in
            b.$block && !(a in{li: 1, dt: 1, dd: 1})});
        this.setRules("br", {breakAfterOpen: 1});
        this.setRules("title", {indent: 0, breakAfterOpen: 0});
        this.setRules("style", {indent: 0, breakBeforeClose: 1});
        this.setRules("pre", {breakAfterOpen: 1, indent: 0})
    }, proto: {openTag: function (b) {
        var a = this._.rules[b];
        this._.afterCloser && (a && a.needsSpace && this._.needsSpace) && this._.output.push("\n");
        this._.indent ? this.indentation() : a && a.breakBeforeOpen && (this.lineBreak(), this.indentation());
        this._.output.push("<", b);
        this._.afterCloser = 0
    },
        openTagClose: function (b, a) {
            var c = this._.rules[b];
            a ? (this._.output.push(this.selfClosingEnd), c && c.breakAfterClose && (this._.needsSpace = c.needsSpace)) : (this._.output.push(">"), c && c.indent && (this._.indentation += this.indentationChars));
            c && c.breakAfterOpen && this.lineBreak();
            "pre" == b && (this._.inPre = 1)
        }, attribute: function (b, a) {
            "string" == typeof a && (this.forceSimpleAmpersand && (a = a.replace(/&amp;/g, "&")), a = CKEDITOR.tools.htmlEncodeAttr(a));
            this._.output.push(" ", b, '="', a, '"')
        }, closeTag: function (b) {
            var a = this._.rules[b];
            a && a.indent && (this._.indentation = this._.indentation.substr(this.indentationChars.length));
            this._.indent ? this.indentation() : a && a.breakBeforeClose && (this.lineBreak(), this.indentation());
            this._.output.push("</", b, ">");
            "pre" == b && (this._.inPre = 0);
            a && a.breakAfterClose && (this.lineBreak(), this._.needsSpace = a.needsSpace);
            this._.afterCloser = 1
        }, text: function (b) {
            this._.indent && (this.indentation(), !this._.inPre && (b = CKEDITOR.tools.ltrim(b)));
            this._.output.push(b)
        }, comment: function (b) {
            this._.indent && this.indentation();
            this._.output.push("<\!--", b, "--\>")
        }, lineBreak: function () {
            !this._.inPre && 0 < this._.output.length && this._.output.push(this.lineBreakChars);
            this._.indent = 1
        }, indentation: function () {
            !this._.inPre && this._.indentation && this._.output.push(this._.indentation);
            this._.indent = 0
        }, reset: function () {
            this._.output = [];
            this._.indent = 0;
            this._.indentation = "";
            this._.afterCloser = 0;
            this._.inPre = 0
        }, setRules: function (b, a) {
            var c = this._.rules[b];
            c ? CKEDITOR.tools.extend(c, a, !0) : this._.rules[b] = a
        }}});
    (function () {
        var b = {canUndo: !1, exec: function (a) {
            var b = a.document.createElement("hr");
            a.insertElement(b)
        }, allowedContent: "hr", requiredContent: "hr"};
        CKEDITOR.plugins.add("horizontalrule", {init: function (a) {
            a.blockless || (a.addCommand("horizontalrule", b), a.ui.addButton && a.ui.addButton("HorizontalRule", {label: a.lang.horizontalrule.toolbar, command: "horizontalrule", toolbar: "insert,40"}))
        }})
    })();
    (function () {
        function n(a) {
            var c = this.editor, d = a.document, b = d.body;
            (a = d.getElementById("cke_actscrpt")) && a.parentNode.removeChild(a);
            (a = d.getElementById("cke_shimscrpt")) && a.parentNode.removeChild(a);
            CKEDITOR.env.gecko && (b.contentEditable = !1, 2E4 > CKEDITOR.env.version && (b.innerHTML = b.innerHTML.replace(/^.*<\!-- cke-content-start --\>/, ""), setTimeout(function () {
                var a = new CKEDITOR.dom.range(new CKEDITOR.dom.document(d));
                a.setStart(new CKEDITOR.dom.node(b), 0);
                c.getSelection().selectRanges([a])
            }, 0)));
            b.contentEditable = !0;
            CKEDITOR.env.ie && (b.hideFocus = !0, b.disabled = !0, b.removeAttribute("disabled"));
            delete this._.isLoadingData;
            this.$ = b;
            d = new CKEDITOR.dom.document(d);
            this.setup();
            CKEDITOR.env.ie && (d.getDocumentElement().addClass(d.$.compatMode), c.config.enterMode != CKEDITOR.ENTER_P && d.on("selectionchange", function () {
                var a = d.getBody(), b = c.getSelection(), e = b && b.getRanges()[0];
                e && (a.getHtml().match(/^<p>&nbsp;<\/p>$/i) && e.startContainer.equals(a)) && setTimeout(function () {
                    e = c.getSelection().getRanges()[0];
                    if (!e.startContainer.equals("body")) {
                        a.getFirst().remove(1);
                        e.moveToElementEditEnd(a);
                        e.select()
                    }
                }, 0)
            }));
            CKEDITOR.env.gecko && CKEDITOR.tools.setTimeout(o, 0, this, c);
            try {
                c.document.$.execCommand("2D-position", !1, !0)
            } catch (e) {
            }
            try {
                c.document.$.execCommand("enableInlineTableEditing", !1, !c.config.disableNativeTableHandles)
            } catch (f) {
            }
            if (c.config.disableObjectResizing)try {
                this.getDocument().$.execCommand("enableObjectResizing", !1, !1)
            } catch (g) {
                this.attachListener(this, CKEDITOR.env.ie ? "resizestart" : "resize", function (a) {
                    a.data.preventDefault()
                })
            }
            (CKEDITOR.env.gecko ||
                CKEDITOR.env.ie && "CSS1Compat" == c.document.$.compatMode) && this.attachListener(this, "keydown", function (a) {
                var b = a.data.getKeystroke();
                if (b == 33 || b == 34)if (CKEDITOR.env.ie)setTimeout(function () {
                    c.getSelection().scrollIntoView()
                }, 0); else if (c.window.$.innerHeight > this.$.offsetHeight) {
                    var d = c.createRange();
                    d[b == 33 ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
                    d.select();
                    a.data.preventDefault()
                }
            });
            CKEDITOR.env.ie && this.attachListener(d, "blur", function () {
                try {
                    d.$.selection.empty()
                } catch (a) {
                }
            });
            c.document.getElementsByTag("title").getItem(0).data("cke-title",
                c.document.$.title);
            CKEDITOR.env.ie && (c.document.$.title = this._.docTitle);
            CKEDITOR.tools.setTimeout(function () {
                c.fire("contentDom");
                if (this._.isPendingFocus) {
                    c.focus();
                    this._.isPendingFocus = false
                }
                setTimeout(function () {
                    c.fire("dataReady")
                }, 0);
                CKEDITOR.env.ie && setTimeout(function () {
                    if (c.document) {
                        var a = c.document.$.body;
                        a.runtimeStyle.marginBottom = "0px";
                        a.runtimeStyle.marginBottom = ""
                    }
                }, 1E3)
            }, 0, this)
        }

        function p(a) {
            a.checkDirty() || setTimeout(function () {
                a.resetDirty()
            }, 0)
        }

        function o(a) {
            if (!a.readOnly) {
                var c =
                    a.window, d = a.document, b = d.getBody(), e = b.getFirst(), f = b.getChildren().count();
                if (!f || 1 == f && e.type == CKEDITOR.NODE_ELEMENT && e.hasAttribute("_moz_editor_bogus_node")) {
                    p(a);
                    var e = CKEDITOR.document, g = e.getDocumentElement(), h = g.$.scrollTop, i = g.$.scrollLeft, j = d.$.createEvent("KeyEvents");
                    j.initKeyEvent("keypress", !0, !0, c.$, !1, !1, !1, !1, 0, 32);
                    d.$.dispatchEvent(j);
                    (h != g.$.scrollTop || i != g.$.scrollLeft) && e.getWindow().$.scrollTo(i, h);
                    f && b.getFirst().remove();
                    d.getBody().appendBogus();
                    a = a.createRange();
                    a.setStartAt(b,
                        CKEDITOR.POSITION_AFTER_START);
                    a.select()
                }
            }
        }

        function q() {
            var a = [];
            if (8 <= CKEDITOR.document.$.documentMode) {
                a.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
                var c = [], d;
                for (d in CKEDITOR.dtd.$removeEmpty)c.push("html.CSS1Compat " + d + "[contenteditable=false]");
                a.push(c.join(",") + "{display:inline-block}")
            } else CKEDITOR.env.gecko && (a.push("html{height:100% !important}"), a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}"));
            a.push("html{cursor:text;*cursor:auto}");
            a.push("img,input,textarea{cursor:default}");
            return a.join("\n")
        }

        CKEDITOR.plugins.add("wysiwygarea", {init: function (a) {
            a.config.fullPage && a.addFeature({allowedContent: "html head title; style [media,type]; body (*)[id]; meta link [*]", requiredContent: "body"});
            a.addMode("wysiwyg", function (c) {
                function d(d) {
                    d && d.removeListener();
                    a.editable(new k(a, b.$.contentWindow.document.body));
                    a.setData(a.getData(1), c)
                }

                var b = CKEDITOR.document.createElement("iframe");
                b.setStyles({width: "100%", height: "100%"});
                b.addClass("cke_wysiwyg_frame cke_reset");
                var e = a.ui.space("contents");
                e.append(b);
                var f = "document.open();" + (l ? 'document.domain="' + document.domain + '";' : "") + "document.close();", f = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(f) + "}())" : "", g = CKEDITOR.env.ie || CKEDITOR.env.gecko;
                if (g)b.on("load", d);
                var h = [a.lang.editor, a.name].join(), i = a.lang.common.editorHelp;
                CKEDITOR.env.ie && (h += ", " + i);
                var j = CKEDITOR.tools.getNextId(), m = CKEDITOR.dom.element.createFromHtml('<span id="' + j + '" class="cke_voice_label">' +
                    i + "</span>");
                e.append(m, 1);
                a.on("beforeModeUnload", function (a) {
                    a.removeListener();
                    m.remove()
                });
                b.setAttributes({frameBorder: 0, "aria-describedby": j, title: h, src: f, tabIndex: a.tabIndex, allowTransparency: "true"});
                !g && d();
                CKEDITOR.env.webkit && (f = function () {
                    e.setStyle("width", "100%");
                    b.hide();
                    b.setSize("width", e.getSize("width"));
                    e.removeStyle("width");
                    b.show()
                }, b.setCustomData("onResize", f), CKEDITOR.document.getWindow().on("resize", f));
                a.fire("ariaWidget", b)
            })
        }});
        var l = CKEDITOR.env.isCustomDomain(), k = CKEDITOR.tools.createClass({$: function (a) {
            this.base.apply(this,
                arguments);
            this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function (a) {
                CKEDITOR.tools.setTimeout(n, 0, this, a)
            }, this);
            this._.docTitle = this.getWindow().getFrame().getAttribute("title")
        }, base: CKEDITOR.editable, proto: {setData: function (a, c) {
            var d = this.editor;
            if (c)this.setHtml(a); else {
                this._.isLoadingData = !0;
                d._.dataStore = {id: 1};
                var b = d.config, e = b.fullPage, f = b.docType, g = CKEDITOR.tools.buildStyleHtml(q()).replace(/<style>/, '<style data-cke-temp="1">');
                e || (g += CKEDITOR.tools.buildStyleHtml(d.config.contentsCss));
                var h = b.baseHref ? '<base href="' + b.baseHref + '" data-cke-temp="1" />' : "";
                e && (a = a.replace(/<!DOCTYPE[^>]*>/i,function (a) {
                    d.docType = f = a;
                    return""
                }).replace(/<\?xml\s[^\?]*\?>/i, function (a) {
                    d.xmlDeclaration = a;
                    return""
                }));
                d.dataProcessor && (a = d.dataProcessor.toHtml(a));
                e ? (/<body[\s|>]/.test(a) || (a = "<body>" + a), /<html[\s|>]/.test(a) || (a = "<html>" + a + "</html>"), /<head[\s|>]/.test(a) ? /<title[\s|>]/.test(a) || (a = a.replace(/<head[^>]*>/, "$&<title></title>")) : a = a.replace(/<html[^>]*>/, "$&<head><title></title></head>"),
                    h && (a = a.replace(/<head>/, "$&" + h)), a = a.replace(/<\/head\s*>/, g + "$&"), a = f + a) : a = b.docType + '<html dir="' + b.contentsLangDirection + '" lang="' + (b.contentsLanguage || d.langCode) + '"><head><title>' + this._.docTitle + "</title>" + h + g + "</head><body" + (b.bodyId ? ' id="' + b.bodyId + '"' : "") + (b.bodyClass ? ' class="' + b.bodyClass + '"' : "") + ">" + a + "</body></html>";
                CKEDITOR.env.gecko && (a = a.replace(/<body/, '<body contenteditable="true" '), 2E4 > CKEDITOR.env.version && (a = a.replace(/<body[^>]*>/, "$&<\!-- cke-content-start --\>")));
                b = '<script id="cke_actscrpt" type="text/javascript"' +
                    (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">" + (l ? 'document.domain="' + document.domain + '";' : "") + "var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" + this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "<\/script>";
                CKEDITOR.env.ie && 9 > CKEDITOR.env.version && (b += '<script id="cke_shimscrpt">(function(){var e="abbr,article,aside,audio,bdi,canvas,data,datalist,details,figcaption,figure,footer,header,hgroup,mark,meter,nav,output,progress,section,summary,time,video".split(","),i=e.length;while(i--){document.createElement(e[i])}})()<\/script>');
                a = a.replace(/(?=\s*<\/(:?head)>)/, b);
                this.clearCustomData();
                this.clearListeners();
                d.fire("contentDomUnload");
                var i = this.getDocument();
                try {
                    i.write(a)
                } catch (j) {
                    setTimeout(function () {
                        i.write(a)
                    }, 0)
                }
            }
        }, getData: function (a) {
            if (a)return this.getHtml();
            var a = this.editor, c = a.config.fullPage, d = c && a.docType, b = c && a.xmlDeclaration, e = this.getDocument(), c = c ? e.getDocumentElement().getOuterHtml() : e.getBody().getHtml();
            CKEDITOR.env.gecko && (c = c.replace(/<br>(?=\s*(:?$|<\/body>))/, ""));
            a.dataProcessor && (c = a.dataProcessor.toDataFormat(c));
            b && (c = b + "\n" + c);
            d && (c = d + "\n" + c);
            return c
        }, focus: function () {
            this._.isLoadingData ? this._.isPendingFocus = !0 : k.baseProto.focus.call(this)
        }, detach: function () {
            var a = this.editor, c = a.document, d = a.window.getFrame();
            k.baseProto.detach.call(this);
            this.clearCustomData();
            c.getDocumentElement().clearCustomData();
            d.clearCustomData();
            CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
            (c = d.removeCustomData("onResize")) && c.removeListener();
            a.fire("contentDomUnload");
            d.remove()
        }}})
    })();
    CKEDITOR.config.disableObjectResizing = !1;
    CKEDITOR.config.disableNativeTableHandles = !0;
    CKEDITOR.config.disableNativeSpellChecker = !0;
    CKEDITOR.config.contentsCss = CKEDITOR.basePath + "contents.css";
    (function () {
        function e(b, a) {
            a || (a = b.getSelection().getSelectedElement());
            if (a && a.is("img") && !a.data("cke-realelement") && !a.isReadOnly())return a
        }

        function f(b) {
            var a = b.getStyle("float");
            if ("inherit" == a || "none" == a)a = 0;
            a || (a = b.getAttribute("align"));
            return a
        }

        CKEDITOR.plugins.add("image", {requires: "dialog", init: function (b) {
            CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
            var a = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
            CKEDITOR.dialog.isTabEnabled(b, "image", "advanced") && (a = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)");
            b.addCommand("image", new CKEDITOR.dialogCommand("image", {allowedContent: a, requiredContent: "img[alt,src]", contentTransformations: [
                ["img{width}: sizeToStyle", "img[width]: sizeToAttribute"],
                ["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]
            ]}));
            b.ui.addButton && b.ui.addButton("Image", {label: b.lang.common.image, command: "image", toolbar: "insert,10"});
            b.on("doubleclick", function (a) {
                var b =
                    a.data.element;
                b.is("img") && (!b.data("cke-realelement") && !b.isReadOnly()) && (a.data.dialog = "image")
            });
            b.addMenuItems && b.addMenuItems({image: {label: b.lang.image.menu, command: "image", group: "image"}});
            b.contextMenu && b.contextMenu.addListener(function (a) {
                if (e(b, a))return{image: CKEDITOR.TRISTATE_OFF}
            })
        }, afterInit: function (b) {
            function a(a) {
                var d = b.getCommand("justify" + a);
                if (d) {
                    if ("left" == a || "right" == a)d.on("exec", function (d) {
                        var c = e(b), g;
                        c && (g = f(c), g == a ? (c.removeStyle("float"), a == f(c) && c.removeAttribute("align")) :
                            c.setStyle("float", a), d.cancel())
                    });
                    d.on("refresh", function (d) {
                        var c = e(b);
                        c && (c = f(c), this.setState(c == a ? CKEDITOR.TRISTATE_ON : "right" == a || "left" == a ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED), d.cancel())
                    })
                }
            }

            a("left");
            a("right");
            a("center");
            a("block")
        }})
    })();
    CKEDITOR.config.image_removeLinkByEmptyURL = !0;
    (function () {
        function g(a, b) {
            var c = j.exec(a), d = j.exec(b);
            if (c) {
                if (!c[2] && "px" == d[2])return d[1];
                if ("px" == c[2] && !d[2])return d[1] + "px"
            }
            return b
        }

        var i = CKEDITOR.htmlParser.cssStyle, h = CKEDITOR.tools.cssLength, j = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i, l = {elements: {$: function (a) {
            var b = a.attributes;
            if ((b = (b = (b = b && b["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(b))) && b.children[0]) && a.attributes["data-cke-resizable"]) {
                var c = (new i(a)).rules, a = b.attributes, d = c.width, c =
                    c.height;
                d && (a.width = g(a.width, d));
                c && (a.height = g(a.height, c))
            }
            return b
        }}}, k = CKEDITOR.plugins.add("fakeobjects", {afterInit: function (a) {
            (a = (a = a.dataProcessor) && a.htmlFilter) && a.addRules(l)
        }});
        CKEDITOR.editor.prototype.createFakeElement = function (a, b, c, d) {
            var e = this.lang.fakeobjects, e = e[c] || e.unknown, b = {"class": b, "data-cke-realelement": encodeURIComponent(a.getOuterHtml()), "data-cke-real-node-type": a.type, alt: e, title: e, align: a.getAttribute("align") || ""};
            CKEDITOR.env.hc || (b.src = CKEDITOR.getUrl(k.path +
                "images/spacer.gif"));
            c && (b["data-cke-real-element-type"] = c);
            d && (b["data-cke-resizable"] = d, c = new i, d = a.getAttribute("width"), a = a.getAttribute("height"), d && (c.rules.width = h(d)), a && (c.rules.height = h(a)), c.populate(b));
            return this.document.createElement("img", {attributes: b})
        };
        CKEDITOR.editor.prototype.createFakeParserElement = function (a, b, c, d) {
            var e = this.lang.fakeobjects, e = e[c] || e.unknown, f;
            f = new CKEDITOR.htmlParser.basicWriter;
            a.writeHtml(f);
            f = f.getHtml();
            b = {"class": b, "data-cke-realelement": encodeURIComponent(f),
                "data-cke-real-node-type": a.type, alt: e, title: e, align: a.attributes.align || ""};
            CKEDITOR.env.hc || (b.src = CKEDITOR.getUrl(k.path + "images/spacer.gif"));
            c && (b["data-cke-real-element-type"] = c);
            d && (b["data-cke-resizable"] = d, d = a.attributes, a = new i, c = d.width, d = d.height, void 0 != c && (a.rules.width = h(c)), void 0 != d && (a.rules.height = h(d)), a.populate(b));
            return new CKEDITOR.htmlParser.element("img", b)
        };
        CKEDITOR.editor.prototype.restoreRealElement = function (a) {
            if (a.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT)return null;
            var b = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(a.data("cke-realelement")), this.document);
            if (a.data("cke-resizable")) {
                var c = a.getStyle("width"), a = a.getStyle("height");
                c && b.setAttribute("width", g(b.getAttribute("width"), c));
                a && b.setAttribute("height", g(b.getAttribute("height"), a))
            }
            return b
        }
    })();
    CKEDITOR.plugins.add("link", {requires: "dialog,fakeobjects", onLoad: function () {
        function b(b) {
            return d.replace(/%1/g, "rtl" == b ? "right" : "left").replace(/%2/g, "cke_contents_" + b)
        }

        var a = "background:url(" + CKEDITOR.getUrl(this.path + "images/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;", d = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" + a + "padding-%1:18px;cursor:auto;}" + (CKEDITOR.env.ie ? "a.cke_anchor_empty{display:inline-block;}" : "") + ".%2 img.cke_anchor{" +
            a + "width:16px;min-height:15px;height:1.15em;vertical-align:" + (CKEDITOR.env.opera ? "middle" : "text-bottom") + ";}";
        CKEDITOR.addCss(b("ltr") + b("rtl"))
    }, init: function (b) {
        var a = "a[!href]";
        CKEDITOR.dialog.isTabEnabled(b, "link", "advanced") && (a = a.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)"));
        CKEDITOR.dialog.isTabEnabled(b, "link", "target") && (a = a.replace("]", ",target,onclick]"));
        b.addCommand("link", new CKEDITOR.dialogCommand("link", {allowedContent: a, requiredContent: "a[href]"}));
        b.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", {allowedContent: "a[!name,id]", requiredContent: "a[name]"}));
        b.addCommand("unlink", new CKEDITOR.unlinkCommand);
        b.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand);
        b.setKeystroke(CKEDITOR.CTRL + 76, "link");
        b.ui.addButton && (b.ui.addButton("Link", {label: b.lang.link.toolbar, command: "link", toolbar: "links,10"}), b.ui.addButton("Unlink", {label: b.lang.link.unlink, command: "unlink", toolbar: "links,20"}), b.ui.addButton("Anchor", {label: b.lang.link.anchor.toolbar,
            command: "anchor", toolbar: "links,30"}));
        CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
        CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
        b.on("doubleclick", function (a) {
            var c = CKEDITOR.plugins.link.getSelectedLink(b) || a.data.element;
            if (!c.isReadOnly())if (c.is("a")) {
                a.data.dialog = c.getAttribute("name") && (!c.getAttribute("href") || !c.getChildCount()) ? "anchor" : "link";
                b.getSelection().selectElement(c)
            } else if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, c))a.data.dialog = "anchor"
        });
        b.addMenuItems &&
        b.addMenuItems({anchor: {label: b.lang.link.anchor.menu, command: "anchor", group: "anchor", order: 1}, removeAnchor: {label: b.lang.link.anchor.remove, command: "removeAnchor", group: "anchor", order: 5}, link: {label: b.lang.link.menu, command: "link", group: "link", order: 1}, unlink: {label: b.lang.link.unlink, command: "unlink", group: "link", order: 5}});
        b.contextMenu && b.contextMenu.addListener(function (a) {
            if (!a || a.isReadOnly())return null;
            a = CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, a);
            if (!a && !(a = CKEDITOR.plugins.link.getSelectedLink(b)))return null;
            var c = {};
            a.getAttribute("href") && a.getChildCount() && (c = {link: CKEDITOR.TRISTATE_OFF, unlink: CKEDITOR.TRISTATE_OFF});
            if (a && a.hasAttribute("name"))c.anchor = c.removeAnchor = CKEDITOR.TRISTATE_OFF;
            return c
        })
    }, afterInit: function (b) {
        var a = b.dataProcessor, d = a && a.dataFilter, a = a && a.htmlFilter, c = b._.elementsPath && b._.elementsPath.filters;
        d && d.addRules({elements: {a: function (a) {
            var c = a.attributes;
            if (!c.name)return null;
            var d = !a.children.length;
            if (CKEDITOR.plugins.link.synAnchorSelector) {
                var a = d ? "cke_anchor_empty" :
                    "cke_anchor", e = c["class"];
                if (c.name && (!e || 0 > e.indexOf(a)))c["class"] = (e || "") + " " + a;
                d && CKEDITOR.plugins.link.emptyAnchorFix && (c.contenteditable = "false", c["data-cke-editable"] = 1)
            } else if (CKEDITOR.plugins.link.fakeAnchor && d)return b.createFakeParserElement(a, "cke_anchor", "anchor");
            return null
        }}});
        CKEDITOR.plugins.link.emptyAnchorFix && a && a.addRules({elements: {a: function (a) {
            delete a.attributes.contenteditable
        }}});
        c && c.push(function (a, c) {
            if ("a" == c && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, a) || a.getAttribute("name") &&
                (!a.getAttribute("href") || !a.getChildCount())))return"anchor"
        })
    }});
    CKEDITOR.plugins.link = {getSelectedLink: function (b) {
        var a = b.getSelection(), d = a.getSelectedElement();
        return d && d.is("a") ? d : (a = a.getRanges(!0)[0]) ? (a.shrink(CKEDITOR.SHRINK_TEXT), b.elementPath(a.getCommonAncestor()).contains("a", 1)) : null
    }, fakeAnchor: CKEDITOR.env.opera || CKEDITOR.env.webkit, synAnchorSelector: CKEDITOR.env.ie, emptyAnchorFix: CKEDITOR.env.ie && 8 > CKEDITOR.env.version, tryRestoreFakeAnchor: function (b, a) {
        if (a && a.data("cke-real-element-type") && "anchor" == a.data("cke-real-element-type")) {
            var d = b.restoreRealElement(a);
            if (d.data("cke-saved-name"))return d
        }
    }};
    CKEDITOR.unlinkCommand = function () {
    };
    CKEDITOR.unlinkCommand.prototype = {exec: function (b) {
        var a = new CKEDITOR.style({element: "a", type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1});
        b.removeStyle(a)
    }, refresh: function (b, a) {
        var d = a.lastElement && a.lastElement.getAscendant("a", !0);
        d && "a" == d.getName() && d.getAttribute("href") && d.getChildCount() ? this.setState(CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_DISABLED)
    }, contextSensitive: 1, startDisabled: 1, requiredContent: "a[href]"};
    CKEDITOR.removeAnchorCommand = function () {
    };
    CKEDITOR.removeAnchorCommand.prototype = {exec: function (b) {
        var a = b.getSelection(), d = a.createBookmarks(), c;
        if (a && (c = a.getSelectedElement()) && (CKEDITOR.plugins.link.fakeAnchor && !c.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, c) : c.is("a")))c.remove(1); else if (c = CKEDITOR.plugins.link.getSelectedLink(b))c.hasAttribute("href") ? (c.removeAttributes({name: 1, "data-cke-saved-name": 1}), c.removeClass("cke_anchor")) : c.remove(1);
        a.selectBookmarks(d)
    }, requiredContent: "a[name]"};
    CKEDITOR.tools.extend(CKEDITOR.config, {linkShowAdvancedTab: !0, linkShowTargetTab: !0});
    (function () {
        function N(a, b, d) {
            return l(b) && l(d) && d.equals(b.getNext(function (a) {
                return!(y(a) || z(a) || o(a))
            }))
        }

        function t(a) {
            this.upper = a[0];
            this.lower = a[1];
            this.set.apply(this, a.slice(2))
        }

        function H(a) {
            var b = a.element, d;
            return b && l(b) ? (d = b.getAscendant(a.triggers, !0)) && !d.contains(a.editable) && !d.equals(a.editable) ? d : null : null
        }

        function ba(a, b, d) {
            m(a, b);
            m(a, d);
            a = b.size.bottom;
            d = d.size.top;
            return a && d ? 0 | (a + d) / 2 : a || d
        }

        function q(a, b, d) {
            return b = b[d ? "getPrevious" : "getNext"](function (e) {
                return e && e.type ==
                    CKEDITOR.NODE_TEXT && !y(e) || l(e) && !o(e) && !u(a, e)
            })
        }

        function ca(a) {
            var b = a.doc, d = A('<span contenteditable="false" style="' + I + "position:absolute;border-top:1px dashed " + a.boxColor + '"></span>', b);
            p(d, {attach: function () {
                this.wrap.getParent() || this.wrap.appendTo(a.editable, !0);
                return this
            }, lineChildren: [p(A('<span title="' + a.editor.lang.magicline.title + '" contenteditable="false">&#8629;</span>', b), {base: I + "height:17px;width:17px;" + (a.rtl ? "left" : "right") + ":17px;background:url(" + this.path + "images/icon.png) center no-repeat " +
                a.boxColor + ";cursor:pointer;" + (n.hc ? "font-size: 15px;line-height:14px;border:1px solid #fff;text-align:center;" : ""), looks: ["top:-8px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "2px", 1), "top:-17px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "2px 2px 0px 0px", 1), "top:-1px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "0px 0px 2px 2px", 1)]}), p(A(O, b), {base: P + "left:0px;border-left-color:" + a.boxColor + ";", looks: ["border-width:8px 0 8px 8px;top:-8px", "border-width:8px 0 0 8px;top:-8px", "border-width:0 0 8px 8px;top:0px"]}),
                p(A(O, b), {base: P + "right:0px;border-right-color:" + a.boxColor + ";", looks: ["border-width:8px 8px 8px 0;top:-8px", "border-width:8px 8px 0 0;top:-8px", "border-width:0 8px 8px 0;top:0px"]})], detach: function () {
                this.wrap.getParent() && this.wrap.remove();
                return this
            }, mouseNear: function () {
                m(a, this);
                var e = a.holdDistance, b = this.size;
                return b && a.mouse.y > b.top - e && a.mouse.y < b.bottom + e && a.mouse.x > b.left - e && a.mouse.x < b.right + e ? !0 : !1
            }, place: function () {
                var e = a.view, b = a.editable, c = a.trigger, d = c.upper, i = c.lower, h = d || i,
                    k = h.getParent(), g = {};
                this.trigger = c;
                d && m(a, d, !0);
                i && m(a, i, !0);
                m(a, k, !0);
                a.inInlineMode && B(a, !0);
                k.equals(b) ? (g.left = e.scroll.x, g.right = -e.scroll.x, g.width = "") : (g.left = h.size.left - h.size.margin.left + e.scroll.x - (a.inInlineMode ? e.editable.left + e.editable.border.left : 0), g.width = h.size.outerWidth + h.size.margin.left + h.size.margin.right + e.scroll.x, g.right = "");
                d && i ? g.top = d.size.margin.bottom === i.size.margin.top ? 0 | d.size.bottom + d.size.margin.bottom / 2 : d.size.margin.bottom < i.size.margin.top ? d.size.bottom + d.size.margin.bottom :
                    d.size.bottom + d.size.margin.bottom - i.size.margin.top : d ? i || (g.top = d.size.bottom + d.size.margin.bottom) : g.top = i.size.top - i.size.margin.top;
                c.is(w) || g.top > e.scroll.y - 15 && g.top < e.scroll.y + 5 ? (g.top = a.inInlineMode ? 0 : e.scroll.y, this.look(w)) : c.is(x) || g.top > e.pane.bottom - 5 && g.top < e.pane.bottom + 15 ? (g.top = a.inInlineMode ? e.editable.height + e.editable.padding.top + e.editable.padding.bottom : e.pane.bottom - 1, this.look(x)) : (a.inInlineMode && (g.top -= e.editable.top + e.editable.border.top), this.look(r));
                a.inInlineMode &&
                (g.top--, g.top += e.editable.scroll.top, g.left += e.editable.scroll.left);
                for (var Q in g)g[Q] = CKEDITOR.tools.cssLength(g[Q]);
                this.setStyles(g)
            }, look: function (a) {
                if (this.oldLook != a) {
                    for (var d = this.lineChildren.length, c; d--;)(c = this.lineChildren[d]).setAttribute("style", c.base + c.looks[0 | a / 2]);
                    this.oldLook = a
                }
            }, wrap: new J("span", a.doc)});
            for (b = d.lineChildren.length; b--;)d.lineChildren[b].appendTo(d);
            d.look(r);
            d.appendTo(d.wrap);
            d.unselectable();
            d.lineChildren[0].on("mouseup", function (b) {
                d.detach();
                K(a, function (d) {
                    var c =
                        a.line.trigger;
                    d[c.is(C) ? "insertBefore" : "insertAfter"](c.is(C) ? c.lower : c.upper)
                }, !0);
                a.editor.focus();
                !n.ie && a.enterMode != CKEDITOR.ENTER_BR && a.hotNode.scrollIntoView();
                b.data.preventDefault(!0)
            });
            d.on("mousedown", function (a) {
                a.data.preventDefault(!0)
            });
            a.line = d
        }

        function K(a, b, d) {
            var e = new CKEDITOR.dom.range(a.doc), f = a.editor, c;
            n.ie && a.enterMode == CKEDITOR.ENTER_BR ? c = a.doc.createText(D) : (c = new J(a.enterBehavior, a.doc), a.enterMode != CKEDITOR.ENTER_BR && a.doc.createText(D).appendTo(c));
            d && f.fire("saveSnapshot");
            b(c);
            e.moveToPosition(c, CKEDITOR.POSITION_AFTER_START);
            f.getSelection().selectRanges([e]);
            a.hotNode = c;
            d && f.fire("saveSnapshot")
        }

        function R(a, b) {
            return{canUndo: !0, modes: {wysiwyg: 1}, exec: function () {
                function d(d) {
                    var f = n.ie && 9 > n.version ? " " : D, c = a.hotNode && a.hotNode.getText() == f && a.element.equals(a.hotNode) && a.lastCmdDirection === !!b;
                    K(a, function (f) {
                        c && a.hotNode && a.hotNode.remove();
                        f[b ? "insertAfter" : "insertBefore"](d);
                        f.setAttributes({"data-cke-magicline-hot": 1, "data-cke-magicline-dir": !!b});
                        a.lastCmdDirection = !!b
                    });
                    !n.ie && a.enterMode != CKEDITOR.ENTER_BR && a.hotNode.scrollIntoView();
                    a.line.detach()
                }

                return function (e) {
                    e = e.getSelection().getStartElement();
                    if ((e = e.getAscendant(S, 1)) && !e.equals(a.editable) && !e.contains(a.editable)) {
                        a.element = e;
                        var f = q(a, e, !b), c;
                        l(f) && f.is(a.triggers) && f.is(da) && (!q(a, f, !b) || (c = q(a, f, !b)) && l(c) && c.is(a.triggers)) ? d(f) : (c = H(a, e), l(c) && (q(a, c, !b) ? (e = q(a, c, !b)) && (l(e) && e.is(a.triggers)) && d(c) : d(c)))
                    }
                }
            }()}
        }

        function u(a, b) {
            if (!b || !(b.type == CKEDITOR.NODE_ELEMENT && b.$))return!1;
            var d =
                a.line;
            return d.wrap.equals(b) || d.wrap.contains(b)
        }

        function l(a) {
            return a && a.type == CKEDITOR.NODE_ELEMENT && a.$
        }

        function o(a) {
            if (!l(a))return!1;
            var b;
            if (!(b = T(a)))l(a) ? (b = {left: 1, right: 1, center: 1}, b = !(!b[a.getComputedStyle("float")] && !b[a.getAttribute("align")])) : b = !1;
            return b
        }

        function T(a) {
            return!!{absolute: 1, fixed: 1, relative: 1}[a.getComputedStyle("position")]
        }

        function E(a, b) {
            return l(b) ? b.is(a.triggers) : null
        }

        function ea(a, b, d) {
            b = b[d ? "getLast" : "getFirst"](function (d) {
                return a.isRelevant(d) && !d.is(fa)
            });
            if (!b)return!1;
            m(a, b);
            return d ? b.size.top > a.mouse.y : b.size.bottom < a.mouse.y
        }

        function U(a) {
            var b = a.editable, d = a.mouse, e = a.view, f = a.triggerOffset;
            B(a);
            var c = d.y > (a.inInlineMode ? e.editable.top + e.editable.height / 2 : Math.min(e.editable.height, e.pane.height) / 2), b = b[c ? "getLast" : "getFirst"](function (a) {
                return!(y(a) || z(a))
            });
            if (!b)return null;
            u(a, b) && (b = a.line.wrap[c ? "getPrevious" : "getNext"](function (a) {
                return!(y(a) || z(a))
            }));
            if (!l(b) || o(b) || !E(a, b))return null;
            m(a, b);
            return!c && 0 <= b.size.top && 0 < d.y && d.y < b.size.top +
                f ? (a = a.inInlineMode || 0 === e.scroll.y ? w : r, new t([null, b, C, F, a])) : c && b.size.bottom <= e.pane.height && d.y > b.size.bottom - f && d.y < e.pane.height ? (a = a.inInlineMode || b.size.bottom > e.pane.height - f && b.size.bottom < e.pane.height ? x : r, new t([b, null, V, F, a])) : null
        }

        function W(a) {
            var b = a.mouse, d = a.view, e = a.triggerOffset, f = H(a);
            if (!f)return null;
            m(a, f);
            var e = Math.min(e, 0 | f.size.outerHeight / 2), c = [], j, i;
            if (b.y > f.size.top - 1 && b.y < f.size.top + e)i = !1; else if (b.y > f.size.bottom - e && b.y < f.size.bottom + 1)i = !0; else return null;
            if (o(f) ||
                ea(a, f, i) || f.getParent().is(X))return null;
            var h = q(a, f, !i);
            if (h) {
                if (h && h.type == CKEDITOR.NODE_TEXT)return null;
                if (l(h)) {
                    if (o(h) || !E(a, h) || h.getParent().is(X))return null;
                    c = [h, f][i ? "reverse" : "concat"]().concat([L, F])
                }
            } else f.equals(a.editable[i ? "getLast" : "getFirst"](a.isRelevant)) ? (B(a), i && b.y > f.size.bottom - e && b.y < d.pane.height && f.size.bottom > d.pane.height - e && f.size.bottom < d.pane.height ? j = x : 0 < b.y && b.y < f.size.top + e && (j = w)) : j = r, c = [null, f][i ? "reverse" : "concat"]().concat([i ? V : C, F, j, f.equals(a.editable[i ?
                "getLast" : "getFirst"](a.isRelevant)) ? i ? x : w : r]);
            return 0 in c ? new t(c) : null
        }

        function M(a, b, d, e) {
            for (var f = function () {
                var d = n.ie ? b.$.currentStyle : a.win.$.getComputedStyle(b.$, "");
                return n.ie ? function (a) {
                    return d[CKEDITOR.tools.cssStyleToDomStyle(a)]
                } : function (a) {
                    return d.getPropertyValue(a)
                }
            }(), c = b.getDocumentPosition(), j = {}, i = {}, h = {}, k = {}, g = s.length; g--;)j[s[g]] = parseInt(f("border-" + s[g] + "-width"), 10) || 0, h[s[g]] = parseInt(f("padding-" + s[g]), 10) || 0, i[s[g]] = parseInt(f("margin-" + s[g]), 10) || 0;
            (!d || e) &&
            G(a, e);
            k.top = c.y - (d ? 0 : a.view.scroll.y);
            k.left = c.x - (d ? 0 : a.view.scroll.x);
            k.outerWidth = b.$.offsetWidth;
            k.outerHeight = b.$.offsetHeight;
            k.height = k.outerHeight - (h.top + h.bottom + j.top + j.bottom);
            k.width = k.outerWidth - (h.left + h.right + j.left + j.right);
            k.bottom = k.top + k.outerHeight;
            k.right = k.left + k.outerWidth;
            a.inInlineMode && (k.scroll = {top: b.$.scrollTop, left: b.$.scrollLeft});
            return p({border: j, padding: h, margin: i, ignoreScroll: d}, k, !0)
        }

        function m(a, b, d) {
            if (!l(b))return b.size = null;
            if (b.size) {
                if (b.size.ignoreScroll ==
                    d && b.size.date > new Date - Y)return null
            } else b.size = {};
            return p(b.size, M(a, b, d), {date: +new Date}, !0)
        }

        function B(a, b) {
            a.view.editable = M(a, a.editable, b, !0)
        }

        function G(a, b) {
            a.view || (a.view = {});
            var d = a.view;
            if (b || !(d && d.date > new Date - Y)) {
                var e = a.win, d = e.getScrollPosition(), e = e.getViewPaneSize();
                p(a.view, {scroll: {x: d.x, y: d.y, width: a.doc.$.documentElement.scrollWidth - e.width, height: a.doc.$.documentElement.scrollHeight - e.height}, pane: {width: e.width, height: e.height, bottom: e.height + d.y}, date: +new Date}, !0)
            }
        }

        function ga(a, b, d, e) {
            for (var f = e, c = e, j = 0, i = !1, h = !1, k = a.view.pane.height, g = a.mouse; g.y + j < k && 0 < g.y - j;) {
                i || (i = b(f, e));
                h || (h = b(c, e));
                !i && 0 < g.y - j && (f = d(a, {x: g.x, y: g.y - j}));
                !h && g.y + j < k && (c = d(a, {x: g.x, y: g.y + j}));
                if (i && h)break;
                j += 2
            }
            return new t([f, c, null, null])
        }

        CKEDITOR.plugins.add("magicline", {init: function (a) {
            var b = {};
            b[CKEDITOR.ENTER_BR] = "br";
            b[CKEDITOR.ENTER_P] = "p";
            b[CKEDITOR.ENTER_DIV] = "div";
            var d = a.config, e = d.magicline_triggerOffset || 30, f = d.enterMode, c = {editor: a, enterBehavior: b[f], enterMode: f, triggerOffset: e,
                holdDistance: 0 | e * (d.magicline_holdDistance || 0.5), boxColor: d.magicline_color || "#ff0000", rtl: "rtl" == d.contentsLangDirection, triggers: d.magicline_everywhere ? S : {table: 1, hr: 1, div: 1, ul: 1, ol: 1, dl: 1, form: 1, blockquote: 1}}, j, i, h;
            c.isRelevant = function (a) {
                return l(a) && !u(c, a) && !o(a)
            };
            a.on("contentDom", function () {
                var b = a.editable(), e = a.document, f = a.window;
                p(c, {editable: b, inInlineMode: b.isInline(), doc: e, win: f}, !0);
                c.boundary = c.inInlineMode ? c.editable : c.doc.getDocumentElement();
                b.is(v.$inline) || (c.inInlineMode && !T(b) && b.setStyles({position: "relative", top: null, left: null}), ca.call(this, c), G(c), b.attachListener(a, "beforeUndoImage", function () {
                    c.line.detach()
                }), b.attachListener(a, "beforeGetData", function () {
                    c.line.wrap.getParent() && (c.line.detach(), a.once("getData", function () {
                        c.line.attach()
                    }, null, null, 1E3))
                }, null, null, 0), b.attachListener(c.inInlineMode ? e : e.getWindow().getFrame(), "mouseout", function (b) {
                    if ("wysiwyg" == a.mode)if (c.inInlineMode) {
                        var d = b.data.$.clientX, b = b.data.$.clientY;
                        G(c);
                        B(c, !0);
                        var e = c.view.editable,
                            f = c.view.scroll;
                        if (!(d > e.left - f.x && d < e.right - f.x) || !(b > e.top - f.y && b < e.bottom - f.y))clearTimeout(h), h = null, c.line.detach()
                    } else clearTimeout(h), h = null, c.line.detach()
                }), b.attachListener(b, "keyup", function () {
                    c.hiddenMode = 0
                }), b.attachListener(b, "keydown", function (b) {
                    if ("wysiwyg" == a.mode)switch (b = b.data.getKeystroke(), a.getSelection().getStartElement(), b) {
                        case 2228240:
                        case 16:
                            c.hiddenMode = 1, c.line.detach()
                    }
                }), b.attachListener(c.inInlineMode ? b : e, "mousemove", function (b) {
                    i = !0;
                    if (!("wysiwyg" != a.mode || a.readOnly ||
                        h)) {
                        var d = {x: b.data.$.clientX, y: b.data.$.clientY};
                        h = setTimeout(function () {
                            c.mouse = d;
                            h = c.trigger = null;
                            G(c);
                            if (i && !c.hiddenMode && a.focusManager.hasFocus && !c.line.mouseNear() && (c.element = Z(c, !0)))(c.trigger = U(c) || W(c) || $(c)) ? c.line.attach().place() : (c.trigger = null, c.line.detach()), i = !1
                        }, 30)
                    }
                }), b.attachListener(f, "scroll", function () {
                    "wysiwyg" == a.mode && (c.line.detach(), n.webkit && (c.hiddenMode = 1, clearTimeout(j), j = setTimeout(function () {
                        c.hiddenMode = 0
                    }, 50)))
                }), b.attachListener(f, "mousedown", function () {
                    "wysiwyg" ==
                        a.mode && (c.line.detach(), c.hiddenMode = 1)
                }), b.attachListener(f, "mouseup", function () {
                    c.hiddenMode = 0
                }), a.addCommand("accessPreviousSpace", R(c)), a.addCommand("accessNextSpace", R(c, !0)), a.setKeystroke([
                    [d.magicline_keystrokePrevious, "accessPreviousSpace"],
                    [d.magicline_keystrokeNext, "accessNextSpace"]
                ]), a.on("loadSnapshot", function () {
                    for (var b = a.document.getElementsByTag(c.enterBehavior), d, e = b.count(); e--;)if ((d = b.getItem(e)).hasAttribute("data-cke-magicline-hot")) {
                        c.hotNode = d;
                        c.lastCmdDirection = "true" ===
                            d.getAttribute("data-cke-magicline-dir") ? !0 : !1;
                        break
                    }
                }), this.backdoor = {accessFocusSpace: K, boxTrigger: t, isLine: u, getAscendantTrigger: H, getNonEmptyNeighbour: q, getSize: M, that: c, triggerEdge: W, triggerEditable: U, triggerExpand: $})
            }, this)
        }});
        var p = CKEDITOR.tools.extend, J = CKEDITOR.dom.element, A = J.createFromHtml, n = CKEDITOR.env, v = CKEDITOR.dtd, C = 128, V = 64, L = 32, F = 16, aa = 8, w = 4, x = 2, r = 1, D = " ", X = v.$listItem, fa = v.$tableContent, da = p({}, v.$nonEditable, v.$empty), S = v.$block, Y = 100, I = "width:0px;height:0px;padding:0px;margin:0px;display:block;z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;",
            P = I + "border-color:transparent;display:block;border-style:solid;", O = "<span>" + D + "</span>";
        t.prototype = {set: function (a, b, d) {
            this.properties = a + b + (d || r);
            return this
        }, is: function (a) {
            return(this.properties & a) == a
        }};
        var Z = function () {
            return function (a, b, d) {
                if (!a.mouse)return null;
                var e = a.doc, f = a.line.wrap, d = d || a.mouse, c = new CKEDITOR.dom.element(e.$.elementFromPoint(d.x, d.y));
                b && u(a, c) && (f.hide(), c = new CKEDITOR.dom.element(e.$.elementFromPoint(d.x, d.y)), f.show());
                return!c || !(c.type == CKEDITOR.NODE_ELEMENT && c.$) ||
                    n.ie && 9 > n.version && !a.boundary.equals(c) && !a.boundary.contains(c) ? null : c
            }
        }(), y = CKEDITOR.dom.walker.whitespaces(), z = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_COMMENT), $ = function () {
            function a(a) {
                var e = a.element, f, c, j;
                if (!l(e) || e.contains(a.editable))return null;
                j = ga(a, function (a, b) {
                    return!b.equals(a)
                }, function (a, b) {
                    return Z(a, !0, b)
                }, e);
                f = j.upper;
                c = j.lower;
                if (N(a, f, c))return j.set(L, aa);
                if (f && e.contains(f))for (; !f.getParent().equals(e);)f = f.getParent(); else f = e.getFirst(function (c) {
                    return b(a, c)
                });
                if (c && e.contains(c))for (; !c.getParent().equals(e);)c = c.getParent(); else c = e.getLast(function (c) {
                    return b(a, c)
                });
                if (!f || !c)return null;
                m(a, f);
                m(a, c);
                if (!(a.mouse.y > f.size.top && a.mouse.y < c.size.bottom))return null;
                for (var e = Number.MAX_VALUE, i, h, k, g; c && !c.equals(f) && (h = f.getNext(a.isRelevant));)i = Math.abs(ba(a, f, h) - a.mouse.y), i < e && (e = i, k = f, g = h), f = h, m(a, f);
                if (!k || !g || !(a.mouse.y > k.size.top && a.mouse.y < g.size.bottom))return null;
                j.upper = k;
                j.lower = g;
                return j.set(L, aa)
            }

            function b(a, b) {
                return!(b && b.type ==
                    CKEDITOR.NODE_TEXT || z(b) || o(b) || u(a, b) || b.type == CKEDITOR.NODE_ELEMENT && b.$ && b.is("br"))
            }

            return function (b) {
                var e = a(b), f;
                if (f = e) {
                    f = e.upper;
                    var c = e.lower;
                    f = !f || !c || o(c) || o(f) || c.equals(f) || f.equals(c) || c.contains(f) || f.contains(c) ? !1 : E(b, f) && E(b, c) && N(b, f, c) ? !0 : !1
                }
                return f ? e : null
            }
        }(), s = ["top", "left", "right", "bottom"]
    })();
    CKEDITOR.config.magicline_keystrokePrevious = CKEDITOR.CTRL + CKEDITOR.SHIFT + 219;
    CKEDITOR.config.magicline_keystrokeNext = CKEDITOR.CTRL + CKEDITOR.SHIFT + 221;
    (function () {
        function l(a) {
            if (!a || a.type != CKEDITOR.NODE_ELEMENT || "form" != a.getName())return[];
            for (var e = [], f = ["style", "className"], b = 0; b < f.length; b++) {
                var d = a.$.elements.namedItem(f[b]);
                d && (d = new CKEDITOR.dom.element(d), e.push([d, d.nextSibling]), d.remove())
            }
            return e
        }

        function o(a, e) {
            if (a && !(a.type != CKEDITOR.NODE_ELEMENT || "form" != a.getName()) && 0 < e.length)for (var f = e.length - 1; 0 <= f; f--) {
                var b = e[f][0], d = e[f][1];
                d ? b.insertBefore(d) : b.appendTo(a)
            }
        }

        function n(a, e) {
            var f = l(a), b = {}, d = a.$;
            e || (b["class"] = d.className ||
                "", d.className = "");
            b.inline = d.style.cssText || "";
            e || (d.style.cssText = "position: static; overflow: visible");
            o(f);
            return b
        }

        function p(a, e) {
            var f = l(a), b = a.$;
            "class"in e && (b.className = e["class"]);
            "inline"in e && (b.style.cssText = e.inline);
            o(f)
        }

        function q(a) {
            if (!a.editable().isInline()) {
                var e = CKEDITOR.instances, f;
                for (f in e) {
                    var b = e[f];
                    "wysiwyg" == b.mode && !b.readOnly && (b = b.document.getBody(), b.setAttribute("contentEditable", !1), b.setAttribute("contentEditable", !0))
                }
                a.editable().hasFocus && (a.toolbox.focus(),
                    a.focus())
            }
        }

        CKEDITOR.plugins.add("maximize", {init: function (a) {
            function e() {
                var b = d.getViewPaneSize();
                a.resize(b.width, b.height, null, !0)
            }

            if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                var f = a.lang, b = CKEDITOR.document, d = b.getWindow(), j, k, m, l = CKEDITOR.TRISTATE_OFF;
                a.addCommand("maximize", {modes: {wysiwyg: !CKEDITOR.env.iOS, source: !CKEDITOR.env.iOS}, readOnly: 1, editorFocus: !1, exec: function () {
                    var h = a.container.getChild(1), g = a.ui.space("contents");
                    if ("wysiwyg" == a.mode) {
                        var c = a.getSelection();
                        j = c && c.getRanges();
                        k = d.getScrollPosition()
                    } else {
                        var i = a.editable().$;
                        j = !CKEDITOR.env.ie && [i.selectionStart, i.selectionEnd];
                        k = [i.scrollLeft, i.scrollTop]
                    }
                    if (this.state == CKEDITOR.TRISTATE_OFF) {
                        d.on("resize", e);
                        m = d.getScrollPosition();
                        for (c = a.container; c = c.getParent();)c.setCustomData("maximize_saved_styles", n(c)), c.setStyle("z-index", a.config.baseFloatZIndex - 5);
                        g.setCustomData("maximize_saved_styles", n(g, !0));
                        h.setCustomData("maximize_saved_styles", n(h, !0));
                        g = {overflow: CKEDITOR.env.webkit ? "" : "hidden", width: 0, height: 0};
                        b.getDocumentElement().setStyles(g);
                        !CKEDITOR.env.gecko && b.getDocumentElement().setStyle("position", "fixed");
                        (!CKEDITOR.env.gecko || !CKEDITOR.env.quirks) && b.getBody().setStyles(g);
                        CKEDITOR.env.ie ? setTimeout(function () {
                            d.$.scrollTo(0, 0)
                        }, 0) : d.$.scrollTo(0, 0);
                        h.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute");
                        h.$.offsetLeft;
                        h.setStyles({"z-index": a.config.baseFloatZIndex - 5, left: "0px", top: "0px"});
                        h.addClass("cke_maximized");
                        e();
                        g = h.getDocumentPosition();
                        h.setStyles({left: -1 *
                            g.x + "px", top: -1 * g.y + "px"});
                        CKEDITOR.env.gecko && q(a)
                    } else if (this.state == CKEDITOR.TRISTATE_ON) {
                        d.removeListener("resize", e);
                        g = [g, h];
                        for (c = 0; c < g.length; c++)p(g[c], g[c].getCustomData("maximize_saved_styles")), g[c].removeCustomData("maximize_saved_styles");
                        for (c = a.container; c = c.getParent();)p(c, c.getCustomData("maximize_saved_styles")), c.removeCustomData("maximize_saved_styles");
                        CKEDITOR.env.ie ? setTimeout(function () {
                            d.$.scrollTo(m.x, m.y)
                        }, 0) : d.$.scrollTo(m.x, m.y);
                        h.removeClass("cke_maximized");
                        CKEDITOR.env.webkit &&
                        (h.setStyle("display", "inline"), setTimeout(function () {
                            h.setStyle("display", "block")
                        }, 0));
                        a.fire("resize")
                    }
                    this.toggleState();
                    if (c = this.uiItems[0])g = this.state == CKEDITOR.TRISTATE_OFF ? f.maximize.maximize : f.maximize.minimize, c = CKEDITOR.document.getById(c._.id), c.getChild(1).setHtml(g), c.setAttribute("title", g), c.setAttribute("href", 'javascript:void("' + g + '");');
                    "wysiwyg" == a.mode ? j ? (CKEDITOR.env.gecko && q(a), a.getSelection().selectRanges(j), (i = a.getSelection().getStartElement()) && i.scrollIntoView(!0)) :
                        d.$.scrollTo(k.x, k.y) : (j && (i.selectionStart = j[0], i.selectionEnd = j[1]), i.scrollLeft = k[0], i.scrollTop = k[1]);
                    j = k = null;
                    l = this.state;
                    a.fire("maximize", this.state)
                }, canUndo: !1});
                a.ui.addButton && a.ui.addButton("Maximize", {label: f.maximize.maximize, command: "maximize", toolbar: "tools,10"});
                a.on("mode", function () {
                    var b = a.getCommand("maximize");
                    b.setState(b.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : l)
                }, null, null, 100)
            }
        }})
    })();
    (function () {
        var c = {canUndo: !1, async: !0, exec: function (a) {
            a.getClipboardData({title: a.lang.pastetext.title}, function (b) {
                b && a.fire("paste", {type: "text", dataValue: b.dataValue});
                a.fire("afterCommandExec", {name: "pastetext", command: c, returnValue: !!b})
            })
        }};
        CKEDITOR.plugins.add("pastetext", {requires: "clipboard", init: function (a) {
            a.addCommand("pastetext", c);
            a.ui.addButton && a.ui.addButton("PasteText", {label: a.lang.pastetext.button, command: "pastetext", toolbar: "clipboard,40"});
            if (a.config.forcePasteAsPlainText)a.on("beforePaste",
                function (a) {
                    "html" != a.data.type && (a.data.type = "text")
                });
            a.on("pasteState", function (b) {
                a.getCommand("pastetext").setState(b.data)
            })
        }})
    })();
    (function () {
        function h(a, d, f) {
            var b = CKEDITOR.cleanWord;
            b ? f() : (a = CKEDITOR.getUrl(a.config.pasteFromWordCleanupFile || d + "filter/default.js"), CKEDITOR.scriptLoader.load(a, f, null, !0));
            return!b
        }

        function i(a) {
            a.data.type = "html"
        }

        CKEDITOR.plugins.add("pastefromword", {requires: "clipboard", init: function (a) {
            var d = 0, f = this.path;
            a.addCommand("pastefromword", {canUndo: !1, async: !0, exec: function (a) {
                var e = this;
                d = 1;
                a.once("beforePaste", i);
                a.getClipboardData({title: a.lang.pastefromword.title}, function (c) {
                    c && a.fire("paste",
                        {type: "html", dataValue: c.dataValue});
                    a.fire("afterCommandExec", {name: "pastefromword", command: e, returnValue: !!c})
                })
            }});
            a.ui.addButton && a.ui.addButton("PasteFromWord", {label: a.lang.pastefromword.toolbar, command: "pastefromword", toolbar: "clipboard,50"});
            a.on("pasteState", function (b) {
                a.getCommand("pastefromword").setState(b.data)
            });
            a.on("paste", function (b) {
                var e = b.data, c = e.dataValue;
                if (c && (d || /(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/.test(c))) {
                    var g = h(a, f, function () {
                        if (g)a.fire("paste", e);
                        else if (!a.config.pasteFromWordPromptCleanup || d || confirm(a.lang.pastefromword.confirmCleanup))e.dataValue = CKEDITOR.cleanWord(c, a)
                    });
                    g && b.cancel()
                }
            }, null, null, 3)
        }})
    })();
    CKEDITOR.plugins.add("removeformat", {init: function (a) {
        a.addCommand("removeFormat", CKEDITOR.plugins.removeformat.commands.removeformat);
        a.ui.addButton && a.ui.addButton("RemoveFormat", {label: a.lang.removeformat.toolbar, command: "removeFormat", toolbar: "cleanup,10"})
    }});
    CKEDITOR.plugins.removeformat = {commands: {removeformat: {exec: function (a) {
        for (var h = a._.removeFormatRegex || (a._.removeFormatRegex = RegExp("^(?:" + a.config.removeFormatTags.replace(/,/g, "|") + ")$", "i")), e = a._.removeAttributes || (a._.removeAttributes = a.config.removeFormatAttributes.split(",")), f = CKEDITOR.plugins.removeformat.filter, k = a.getSelection().getRanges(1), l = k.createIterator(), c; c = l.getNextRange();) {
            c.collapsed || c.enlarge(CKEDITOR.ENLARGE_ELEMENT);
            var i = c.createBookmark(), b = i.startNode, j = i.endNode,
                d = function (b) {
                    for (var c = a.elementPath(b), e = c.elements, d = 1, g; (g = e[d]) && !g.equals(c.block) && !g.equals(c.blockLimit); d++)h.test(g.getName()) && f(a, g) && b.breakParent(g)
                };
            d(b);
            if (j) {
                d(j);
                for (b = b.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT); b && !b.equals(j);)d = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT), !("img" == b.getName() && b.data("cke-realelement")) && f(a, b) && (h.test(b.getName()) ? b.remove(1) : (b.removeAttributes(e), a.fire("removeFormatCleanup", b))), b = d
            }
            c.moveToBookmark(i)
        }
        a.forceNextSelectionCheck();
        a.getSelection().selectRanges(k)
    }}},
        filter: function (a, h) {
            for (var e = a._.removeFormatFilters || [], f = 0; f < e.length; f++)if (!1 === e[f](h))return!1;
            return!0
        }};
    CKEDITOR.editor.prototype.addRemoveFormatFilter = function (a) {
        this._.removeFormatFilters || (this._.removeFormatFilters = []);
        this._.removeFormatFilters.push(a)
    };
    CKEDITOR.config.removeFormatTags = "b,big,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var";
    CKEDITOR.config.removeFormatAttributes = "class,style,lang,width,height,align,hspace,valign";
    (function () {
        CKEDITOR.plugins.add("sourcearea", {init: function (a) {
            function d() {
                this.hide();
                this.setStyle("height", this.getParent().$.clientHeight + "px");
                this.setStyle("width", this.getParent().$.clientWidth + "px");
                this.show()
            }

            if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                var e = CKEDITOR.plugins.sourcearea;
                a.addMode("source", function (e) {
                    var b = a.ui.space("contents").getDocument().createElement("textarea");
                    b.setStyles(CKEDITOR.tools.extend({width: CKEDITOR.env.ie7Compat ? "99%" : "100%", height: "100%", resize: "none",
                        outline: "none", "text-align": "left"}, CKEDITOR.tools.cssVendorPrefix("tab-size", a.config.sourceAreaTabSize || 4)));
                    b.setAttribute("dir", "ltr");
                    b.addClass("cke_source cke_reset cke_enable_context_menu");
                    a.ui.space("contents").append(b);
                    b = a.editable(new c(a, b));
                    b.setData(a.getData(1));
                    CKEDITOR.env.ie && (b.attachListener(a, "resize", d, b), b.attachListener(CKEDITOR.document.getWindow(), "resize", d, b), CKEDITOR.tools.setTimeout(d, 0, b));
                    a.fire("ariaWidget", this);
                    e()
                });
                a.addCommand("source", e.commands.source);
                a.ui.addButton &&
                a.ui.addButton("Source", {label: a.lang.sourcearea.toolbar, command: "source", toolbar: "mode,10"});
                a.on("mode", function () {
                    a.getCommand("source").setState("source" == a.mode ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
                })
            }
        }});
        var c = CKEDITOR.tools.createClass({base: CKEDITOR.editable, proto: {setData: function (a) {
            this.setValue(a);
            this.editor.fire("dataReady")
        }, getData: function () {
            return this.getValue()
        }, insertHtml: function () {
        }, insertElement: function () {
        }, insertText: function () {
        }, setReadOnly: function (a) {
            this[(a ? "set" :
                "removeManager") + "Attribute"]("readOnly", "readonly")
        }, detach: function () {
            c.baseProto.detach.call(this);
            this.clearCustomData();
            this.remove()
        }}})
    })();
    CKEDITOR.plugins.sourcearea = {commands: {source: {modes: {wysiwyg: 1, source: 1}, editorFocus: !1, readOnly: 1, exec: function (c) {
        "wysiwyg" == c.mode && c.fire("saveSnapshot");
        c.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
        c.setMode("source" == c.mode ? "wysiwyg" : "source")
    }, canUndo: !1}}};
    CKEDITOR.plugins.add("specialchar", {availableLangs: {ca: 1, cs: 1, cy: 1, de: 1, en: 1, eo: 1, es: 1, et: 1, fa: 1, fi: 1, fr: 1, "fr-ca": 1, he: 1, hr: 1, it: 1, ku: 1, lv: 1, nb: 1, nl: 1, no: 1, pl: 1, "pt-br": 1, sk: 1, sq: 1, sv: 1, th: 1, tr: 1, ug: 1, "zh-cn": 1}, requires: "dialog", init: function (a) {
        var c = this;
        CKEDITOR.dialog.add("specialchar", this.path + "dialogs/specialchar.js");
        a.addCommand("specialchar", {exec: function () {
            var b = a.langCode, b = c.availableLangs[b] ? b : c.availableLangs[b.replace(/-.*/, "")] ? b.replace(/-.*/, "") : "en";
            CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path +
                "dialogs/lang/" + b + ".js"), function () {
                CKEDITOR.tools.extend(a.lang.specialchar, c.langEntries[b]);
                a.openDialog("specialchar")
            })
        }, modes: {wysiwyg: 1}, canUndo: !1});
        a.ui.addButton && a.ui.addButton("SpecialChar", {label: a.lang.specialchar.toolbar, command: "specialchar", toolbar: "insert,50"})
    }});
    CKEDITOR.config.specialChars = "! &quot; # $ % &amp; ' ( ) * + - . / 0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ &euro; &lsquo; &rsquo; &ldquo; &rdquo; &ndash; &mdash; &iexcl; &cent; &pound; &curren; &yen; &brvbar; &sect; &uml; &copy; &ordf; &laquo; &not; &reg; &macr; &deg; &sup2; &sup3; &acute; &micro; &para; &middot; &cedil; &sup1; &ordm; &raquo; &frac14; &frac12; &frac34; &iquest; &Agrave; &Aacute; &Acirc; &Atilde; &Auml; &Aring; &AElig; &Ccedil; &Egrave; &Eacute; &Ecirc; &Euml; &Igrave; &Iacute; &Icirc; &Iuml; &ETH; &Ntilde; &Ograve; &Oacute; &Ocirc; &Otilde; &Ouml; &times; &Oslash; &Ugrave; &Uacute; &Ucirc; &Uuml; &Yacute; &THORN; &szlig; &agrave; &aacute; &acirc; &atilde; &auml; &aring; &aelig; &ccedil; &egrave; &eacute; &ecirc; &euml; &igrave; &iacute; &icirc; &iuml; &eth; &ntilde; &ograve; &oacute; &ocirc; &otilde; &ouml; &divide; &oslash; &ugrave; &uacute; &ucirc; &uuml; &yacute; &thorn; &yuml; &OElig; &oelig; &#372; &#374 &#373 &#375; &sbquo; &#8219; &bdquo; &hellip; &trade; &#9658; &bull; &rarr; &rArr; &hArr; &diams; &asymp;".split(" ");
    CKEDITOR.plugins.add("menubutton", {requires: "button,menu", onLoad: function () {
        var d = function (a) {
            var b = this._;
            if (b.state !== CKEDITOR.TRISTATE_DISABLED) {
                b.previousState = b.state;
                var c = b.menu;
                c || (c = b.menu = new CKEDITOR.menu(a, {panel: {className: "cke_menu_panel", attributes: {"aria-label": a.lang.common.options}}}), c.onHide = CKEDITOR.tools.bind(function () {
                    this.setState(this.modes && this.modes[a.mode] ? b.previousState : CKEDITOR.TRISTATE_DISABLED)
                }, this), this.onMenu && c.addListener(this.onMenu));
                b.on ? c.hide() : (this.setState(CKEDITOR.TRISTATE_ON),
                    setTimeout(function () {
                        c.show(CKEDITOR.document.getById(b.id), 4)
                    }, 0))
            }
        };
        CKEDITOR.ui.menuButton = CKEDITOR.tools.createClass({base: CKEDITOR.ui.button, $: function (a) {
            delete a.panel;
            this.base(a);
            this.hasArrow = !0;
            this.click = d
        }, statics: {handler: {create: function (a) {
            return new CKEDITOR.ui.menuButton(a)
        }}}})
    }, beforeInit: function (d) {
        d.ui.addHandler(CKEDITOR.UI_MENUBUTTON, CKEDITOR.ui.menuButton.handler)
    }});
    CKEDITOR.UI_MENUBUTTON = "menubutton";
    (function () {
        function k(a, c) {
            var b = 0, d;
            for (d in c)if (c[d] == a) {
                b = 1;
                break
            }
            return b
        }

        var i = "", r = function () {
            function a() {
                b.once("focus", f);
                b.once("blur", c)
            }

            function c(b) {
                var b = b.editor, c = d.getScayt(b), f = b.elementMode == CKEDITOR.ELEMENT_MODE_INLINE;
                c && (d.setPaused(b, !c.disabled), d.setControlId(b, c.id), c.destroy(!0), delete d.instances[b.name], f && a())
            }

            var b = this, f = function () {
                if (!("undefined" != typeof d.instances[b.name] || null != d.instances[b.name])) {
                    var a = b.config, c = {};
                    c.srcNodeRef = "BODY" == b.editable().$.nodeName ?
                        b.document.getWindow().$.frameElement : b.editable().$;
                    c.assocApp = "CKEDITOR." + CKEDITOR.version + "@" + CKEDITOR.revision;
                    c.customerid = a.scayt_customerid || "1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2";
                    c.customDictionaryIds = a.scayt_customDictionaryIds || "";
                    c.userDictionaryName = a.scayt_userDictionaryName || "";
                    c.sLang = a.scayt_sLang || "en_US";
                    c.onLoad = function () {
                        CKEDITOR.env.ie && 8 > CKEDITOR.env.version || this.addStyle(this.selectorCss(), "padding-bottom: 2px !important;");
                        b.editable().hasFocus && !d.isControlRestored(b) && this.focus()
                    };
                    c.onBeforeChange = function () {
                        d.getScayt(b) && !b.checkDirty() && setTimeout(function () {
                            b.resetDirty()
                        }, 0)
                    };
                    a = window.scayt_custom_params;
                    if ("object" == typeof a)for (var f in a)c[f] = a[f];
                    d.getControlId(b) && (c.id = d.getControlId(b));
                    var o = new window.scayt(c);
                    o.afterMarkupRemove.push(function (a) {
                        (new CKEDITOR.dom.element(a, o.document)).mergeSiblings()
                    });
                    if (c = d.instances[b.name])o.sLang = c.sLang, o.option(c.option()), o.paused = c.paused;
                    d.instances[b.name] = o;
                    try {
                        o.setDisabled(!1 ===
                            d.isPaused(b))
                    } catch (e) {
                    }
                    b.fire("showScaytState")
                }
            };
            b.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a() : b.on("contentDom", f);
            b.on("contentDomUnload", function () {
                for (var a = CKEDITOR.document.getElementsByTag("script"), b = /^dojoIoScript(\d+)$/i, c = /^https?:\/\/svc\.webspellchecker\.net\/spellcheck\/script\/ssrv\.cgi/i, d = 0; d < a.count(); d++) {
                    var f = a.getItem(d), e = f.getId(), h = f.getAttribute("src");
                    e && (h && e.match(b) && h.match(c)) && f.remove()
                }
            });
            b.on("beforeCommandExec", function (a) {
                "source" == a.data.name && "source" ==
                    b.mode && d.markControlRestore(b)
            });
            b.on("afterCommandExec", function (a) {
                d.isScaytEnabled(b) && "wysiwyg" == b.mode && ("undo" == a.data.name || "redo" == a.data.name) && window.setTimeout(function () {
                    d.getScayt(b).refresh()
                }, 10)
            });
            b.on("destroy", c);
            b.on("setData", c);
            b.on("insertElement", function () {
                var a = d.getScayt(b);
                d.isScaytEnabled(b) && (CKEDITOR.env.ie && b.getSelection().unlock(!0), window.setTimeout(function () {
                    a.focus();
                    a.refresh()
                }, 10))
            }, this, null, 50);
            b.on("insertHtml", function () {
                var a = d.getScayt(b);
                d.isScaytEnabled(b) &&
                (CKEDITOR.env.ie && b.getSelection().unlock(!0), window.setTimeout(function () {
                    a.focus();
                    a.refresh()
                }, 10))
            }, this, null, 50);
            b.on("scaytDialog", function (a) {
                a.data.djConfig = window.djConfig;
                a.data.scayt_control = d.getScayt(b);
                a.data.tab = i;
                a.data.scayt = window.scayt
            });
            var e = b.dataProcessor;
            (e = e && e.htmlFilter) && e.addRules({elements: {span: function (a) {
                if (a.attributes["data-scayt_word"] && a.attributes["data-scaytid"])return delete a.name, a
            }}});
            e = CKEDITOR.plugins.undo.Image.prototype;
            e.equals = CKEDITOR.tools.override(e.equals,
                function (a) {
                    return function (b) {
                        var c = this.contents, f = b.contents, e = d.getScayt(this.editor);
                        e && d.isScaytReady(this.editor) && (this.contents = e.reset(c) || "", b.contents = e.reset(f) || "");
                        e = a.apply(this, arguments);
                        this.contents = c;
                        b.contents = f;
                        return e
                    }
                });
            b.document && (b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE || b.focusManager.hasFocus) && f()
        };
        CKEDITOR.plugins.scayt = {engineLoaded: !1, instances: {}, controlInfo: {}, setControlInfo: function (a, c) {
            a && (a.name && "object" != typeof this.controlInfo[a.name]) && (this.controlInfo[a.name] =
            {});
            for (var b in c)this.controlInfo[a.name][b] = c[b]
        }, isControlRestored: function (a) {
            return a && a.name && this.controlInfo[a.name] ? this.controlInfo[a.name].restored : !1
        }, markControlRestore: function (a) {
            this.setControlInfo(a, {restored: !0})
        }, setControlId: function (a, c) {
            this.setControlInfo(a, {id: c})
        }, getControlId: function (a) {
            return a && a.name && this.controlInfo[a.name] && this.controlInfo[a.name].id ? this.controlInfo[a.name].id : null
        }, setPaused: function (a, c) {
            this.setControlInfo(a, {paused: c})
        }, isPaused: function (a) {
            if (a &&
                a.name && this.controlInfo[a.name])return this.controlInfo[a.name].paused
        }, getScayt: function (a) {
            return this.instances[a.name]
        }, isScaytReady: function (a) {
            return!0 === this.engineLoaded && "undefined" !== typeof window.scayt && this.getScayt(a)
        }, isScaytEnabled: function (a) {
            return(a = this.getScayt(a)) ? !1 === a.disabled : !1
        }, getUiTabs: function (a) {
            var c = [], b = a.config.scayt_uiTabs || "1,1,1", b = b.split(",");
            b[3] = "1";
            for (var d = 0; 4 > d; d++)c[d] = "undefined" != typeof window.scayt && "undefined" != typeof window.scayt.uiTags ? parseInt(b[d],
                10) && window.scayt.uiTags[d] : parseInt(b[d], 10);
            "object" == typeof a.plugins.wsc ? c.push(1) : c.push(0);
            return c
        }, loadEngine: function (a) {
            if (CKEDITOR.env.gecko && 10900 > CKEDITOR.env.version || CKEDITOR.env.opera || CKEDITOR.env.air)return a.fire("showScaytState");
            if (!0 === this.engineLoaded)return r.apply(a);
            if (-1 == this.engineLoaded)return CKEDITOR.on("scaytReady", function () {
                r.apply(a)
            });
            CKEDITOR.on("scaytReady", r, a);
            CKEDITOR.on("scaytReady", function () {
                this.engineLoaded = !0
            }, this, null, 0);
            this.engineLoaded = -1;
            var c =
                document.location.protocol, c = -1 != c.search(/https?:/) ? c : "http:", c = a.config.scayt_srcUrl || c + "//svc.webspellchecker.net/scayt26/loader__base.js", b = d.parseUrl(c).path + "/";
            void 0 == window.scayt ? (CKEDITOR._djScaytConfig = {baseUrl: b, addOnLoad: [function () {
                CKEDITOR.fireOnce("scaytReady")
            }], isDebug: !1}, CKEDITOR.document.getHead().append(CKEDITOR.document.createElement("script", {attributes: {type: "text/javascript", async: "true", src: c}}))) : CKEDITOR.fireOnce("scaytReady");
            return null
        }, parseUrl: function (a) {
            var c;
            return a.match &&
                (c = a.match(/(.*)[\/\\](.*?\.\w+)$/)) ? {path: c[1], file: c[2]} : a
        }};
        var d = CKEDITOR.plugins.scayt, s = function (a, c, b, d, e, k, g) {
            a.addCommand(d, e);
            a.addMenuItem(d, {label: b, command: d, group: k, order: g})
        }, v = {preserveState: !0, editorFocus: !1, canUndo: !1, exec: function (a) {
            if (d.isScaytReady(a)) {
                var c = d.isScaytEnabled(a);
                this.setState(c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_ON);
                a = d.getScayt(a);
                a.focus();
                a.setDisabled(c)
            } else!a.config.scayt_autoStartup && 0 <= d.engineLoaded && (a.focus(), this.setState(CKEDITOR.TRISTATE_DISABLED),
                d.loadEngine(a))
        }};
        CKEDITOR.plugins.add("scayt", {requires: "menubutton,dialog", beforeInit: function (a) {
            var c = a.config.scayt_contextMenuItemsOrder || "suggest|moresuggest|control", b = "";
            if ((c = c.split("|")) && c.length)for (var d = 0; d < c.length; d++)b += "scayt_" + c[d] + (c.length != parseInt(d, 10) + 1 ? "," : "");
            a.config.menu_groups = b + "," + a.config.menu_groups
        }, checkEnvironment: function () {
            return CKEDITOR.env.opera || CKEDITOR.env.air ? 0 : 1
        }, init: function (a) {
            var c = a.dataProcessor && a.dataProcessor.dataFilter, b = {elements: {span: function (a) {
                var b =
                    a.attributes;
                b && b["data-scaytid"] && delete a.name
            }}};
            c && c.addRules(b);
            var f = {}, e = {}, p = a.addCommand("scaytcheck", v);
            CKEDITOR.dialog.add("scaytcheck", CKEDITOR.getUrl(this.path + "dialogs/options.js"));
            c = d.getUiTabs(a);
            a.addMenuGroup("scaytButton");
            a.addMenuGroup("scayt_suggest", -10);
            a.addMenuGroup("scayt_moresuggest", -9);
            a.addMenuGroup("scayt_control", -8);
            var b = {}, g = a.lang.scayt;
            b.scaytToggle = {label: g.enable, command: "scaytcheck", group: "scaytButton"};
            1 == c[0] && (b.scaytOptions = {label: g.options, group: "scaytButton",
                onClick: function () {
                    i = "options";
                    a.openDialog("scaytcheck")
                }});
            1 == c[1] && (b.scaytLangs = {label: g.langs, group: "scaytButton", onClick: function () {
                i = "langs";
                a.openDialog("scaytcheck")
            }});
            1 == c[2] && (b.scaytDict = {label: g.dictionariesTab, group: "scaytButton", onClick: function () {
                i = "dictionaries";
                a.openDialog("scaytcheck")
            }});
            b.scaytAbout = {label: a.lang.scayt.about, group: "scaytButton", onClick: function () {
                i = "about";
                a.openDialog("scaytcheck")
            }};
            1 == c[4] && (b.scaytWSC = {label: a.lang.wsc.toolbar, group: "scaytButton", command: "checkspell"});
            a.addMenuItems(b);
            a.ui.add("Scayt", CKEDITOR.UI_MENUBUTTON, {label: g.title, title: CKEDITOR.env.opera ? g.opera_title : g.title, modes: {wysiwyg: this.checkEnvironment()}, toolbar: "spellchecker,20", onRender: function () {
                p.on("state", function () {
                    this.setState(p.state)
                }, this)
            }, onMenu: function () {
                var b = d.isScaytEnabled(a);
                a.getMenuItem("scaytToggle").label = g[b ? "disable" : "enable"];
                var c = d.getUiTabs(a);
                return{scaytToggle: CKEDITOR.TRISTATE_OFF, scaytOptions: b && c[0] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, scaytLangs: b &&
                    c[1] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, scaytDict: b && c[2] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, scaytAbout: b && c[3] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, scaytWSC: c[4] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED}
            }});
            a.contextMenu && a.addMenuItems && a.contextMenu.addListener(function (b, c) {
                if (!d.isScaytEnabled(a) || c.getRanges()[0].checkReadOnly())return null;
                var l = d.getScayt(a), q = l.getScaytNode();
                if (!q)return null;
                var h = l.getWord(q);
                if (!h)return null;
                var i = l.getLang(),
                    m = a.config.scayt_contextCommands || "all", h = window.scayt.getSuggestion(h, i), m = m.split("|"), n;
                for (n in f) {
                    delete a._.menuItems[n];
                    delete a.commands[n]
                }
                for (n in e) {
                    delete a._.menuItems[n];
                    delete a.commands[n]
                }
                if (!h || !h.length) {
                    s(a, "no_sugg", g.noSuggestions, "scayt_no_sugg", {exec: function () {
                    }}, "scayt_control", 1, true);
                    e.scayt_no_sugg = CKEDITOR.TRISTATE_OFF
                } else {
                    f = {};
                    e = {};
                    n = a.config.scayt_moreSuggestions || "on";
                    var i = false, u = a.config.scayt_maxSuggestions;
                    typeof u != "number" && (u = 5);
                    !u && (u = h.length);
                    for (var j =
                        0, p = h.length; j < p; j = j + 1) {
                        var t = "scayt_suggestion_" + h[j].replace(" ", "_"), r = function (a, b) {
                            return{exec: function () {
                                l.replace(a, b)
                            }}
                        }(q, h[j]);
                        if (j < u) {
                            s(a, "button_" + t, h[j], t, r, "scayt_suggest", j + 1);
                            e[t] = CKEDITOR.TRISTATE_OFF
                        } else if (n == "on") {
                            s(a, "button_" + t, h[j], t, r, "scayt_moresuggest", j + 1);
                            f[t] = CKEDITOR.TRISTATE_OFF;
                            i = true
                        }
                    }
                    if (i) {
                        a.addMenuItem("scayt_moresuggest", {label: g.moreSuggestions, group: "scayt_moresuggest", order: 10, getItems: function () {
                            return f
                        }});
                        e.scayt_moresuggest = CKEDITOR.TRISTATE_OFF
                    }
                }
                if (k("all",
                    m) || k("ignore", m)) {
                    s(a, "ignore", g.ignore, "scayt_ignore", {exec: function () {
                        l.ignore(q)
                    }}, "scayt_control", 2);
                    e.scayt_ignore = CKEDITOR.TRISTATE_OFF
                }
                if (k("all", m) || k("ignoreall", m)) {
                    s(a, "ignore_all", g.ignoreAll, "scayt_ignore_all", {exec: function () {
                        l.ignoreAll(q)
                    }}, "scayt_control", 3);
                    e.scayt_ignore_all = CKEDITOR.TRISTATE_OFF
                }
                if (k("all", m) || k("add", m)) {
                    s(a, "add_word", g.addWord, "scayt_add_word", {exec: function () {
                        window.scayt.addWordToUserDictionary(q)
                    }}, "scayt_control", 4);
                    e.scayt_add_word = CKEDITOR.TRISTATE_OFF
                }
                l.fireOnContextMenu &&
                l.fireOnContextMenu(a);
                return e
            });
            c = function (b) {
                b.removeListener();
                CKEDITOR.env.opera || CKEDITOR.env.air ? p.setState(CKEDITOR.TRISTATE_DISABLED) : p.setState(d.isScaytEnabled(a) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
            };
            a.on("showScaytState", c);
            a.on("instanceReady", c);
            if (a.config.scayt_autoStartup)a.on("instanceReady", function () {
                d.loadEngine(a)
            })
        }, afterInit: function (a) {
            var c, b = function (a) {
                if (a.hasAttribute("data-scaytid"))return!1
            };
            a._.elementsPath && (c = a._.elementsPath.filters) && c.push(b);
            a.addRemoveFormatFilter &&
            a.addRemoveFormatFilter(b)
        }})
    })();
    (function () {
        CKEDITOR.plugins.add("stylescombo", {requires: "richcombo", init: function (c) {
            var j = c.config, f = c.lang.stylescombo, g = {}, i = [], k = [];
            c.on("stylesSet", function (b) {
                if (b = b.data.styles) {
                    for (var a, h, d = 0, e = b.length; d < e; d++)if (a = b[d], !(c.blockless && a.element in CKEDITOR.dtd.$block) && (h = a.name, a = new CKEDITOR.style(a), !c.filter.customConfig || c.filter.check(a)))a._name = h, a._.enterMode = j.enterMode, a._.weight = d + 1E3 * (a.type == CKEDITOR.STYLE_OBJECT ? 1 : a.type == CKEDITOR.STYLE_BLOCK ? 2 : 3), g[h] = a, i.push(a), k.push(a);
                    i.sort(function (a, b) {
                        return a._.weight - b._.weight
                    })
                }
            });
            c.ui.addRichCombo("Styles", {label: f.label, title: f.panelTitle, toolbar: "styles,10", allowedContent: k, panel: {css: [CKEDITOR.skin.getPath("editor")].concat(j.contentsCss), multiSelect: !0, attributes: {"aria-label": f.panelTitle}}, init: function () {
                var b, a, c, d, e, g;
                e = 0;
                for (g = i.length; e < g; e++)b = i[e], a = b._name, d = b.type, d != c && (this.startGroup(f["panelTitle" + d]), c = d), this.add(a, b.type == CKEDITOR.STYLE_OBJECT ? a : b.buildPreview(), a);
                this.commit()
            }, onClick: function (b) {
                c.focus();
                c.fire("saveSnapshot");
                var b = g[b], a = c.elementPath();
                c[b.checkActive(a) ? "removeStyle" : "applyStyle"](b);
                c.fire("saveSnapshot")
            }, onRender: function () {
                c.on("selectionChange", function (b) {
                    for (var a = this.getValue(), b = b.data.path.elements, c = 0, d = b.length, e; c < d; c++) {
                        e = b[c];
                        for (var f in g)if (g[f].checkElementRemovable(e, !0)) {
                            f != a && this.setValue(f);
                            return
                        }
                    }
                    this.setValue("")
                }, this)
            }, onOpen: function () {
                var b = c.getSelection().getSelectedElement(), b = c.elementPath(b), a = [0, 0, 0, 0];
                this.showAll();
                this.unmarkAll();
                for (var h in g) {
                    var d =
                        g[h], e = d.type;
                    e == CKEDITOR.STYLE_BLOCK && !b.isContextFor(d.element) ? this.hideItem(h) : (d.checkActive(b) ? this.mark(h) : e == CKEDITOR.STYLE_OBJECT && !d.checkApplicable(b) && (this.hideItem(h), a[e]--), a[e]++)
                }
                a[CKEDITOR.STYLE_BLOCK] || this.hideGroup(f["panelTitle" + CKEDITOR.STYLE_BLOCK]);
                a[CKEDITOR.STYLE_INLINE] || this.hideGroup(f["panelTitle" + CKEDITOR.STYLE_INLINE]);
                a[CKEDITOR.STYLE_OBJECT] || this.hideGroup(f["panelTitle" + CKEDITOR.STYLE_OBJECT])
            }, reset: function () {
                g = {};
                i = []
            }})
        }})
    })();
    (function () {
        function i(c) {
            return{editorFocus: !1, canUndo: !1, modes: {wysiwyg: 1}, exec: function (d) {
                if (d.editable().hasFocus) {
                    var e = d.getSelection(), b;
                    if (b = (new CKEDITOR.dom.elementPath(e.getCommonAncestor(), e.root)).contains({td: 1, th: 1}, 1)) {
                        var e = d.createRange(), a = CKEDITOR.tools.tryThese(function () {
                            var a = b.getParent().$.cells[b.$.cellIndex + (c ? -1 : 1)];
                            a.parentNode.parentNode;
                            return a
                        }, function () {
                            var a = b.getParent(), a = a.getAscendant("table").$.rows[a.$.rowIndex + (c ? -1 : 1)];
                            return a.cells[c ? a.cells.length - 1 :
                                0]
                        });
                        if (!a && !c) {
                            for (var f = b.getAscendant("table").$, a = b.getParent().$.cells, f = new CKEDITOR.dom.element(f.insertRow(-1), d.document), g = 0, h = a.length; g < h; g++) {
                                var i = f.append((new CKEDITOR.dom.element(a[g], d.document)).clone(!1, !1));
                                !CKEDITOR.env.ie && i.appendBogus()
                            }
                            e.moveToElementEditStart(f)
                        } else if (a)a = new CKEDITOR.dom.element(a), e.moveToElementEditStart(a), (!e.checkStartOfBlock() || !e.checkEndOfBlock()) && e.selectNodeContents(a); else return!0;
                        e.select(!0);
                        return!0
                    }
                }
                return!1
            }}
        }

        var h = {editorFocus: !1, modes: {wysiwyg: 1,
            source: 1}}, g = {exec: function (c) {
            c.container.focusNext(!0, c.tabIndex)
        }}, f = {exec: function (c) {
            c.container.focusPrevious(!0, c.tabIndex)
        }};
        CKEDITOR.plugins.add("tab", {init: function (c) {
            for (var d = !1 !== c.config.enableTabKeyTools, e = c.config.tabSpaces || 0, b = ""; e--;)b += " ";
            if (b)c.on("key", function (a) {
                9 == a.data.keyCode && (c.insertHtml(b), a.cancel())
            });
            if (d)c.on("key", function (a) {
                (9 == a.data.keyCode && c.execCommand("selectNextCell") || a.data.keyCode == CKEDITOR.SHIFT + 9 && c.execCommand("selectPreviousCell")) && a.cancel()
            });
            c.addCommand("blur", CKEDITOR.tools.extend(g, h));
            c.addCommand("blurBack", CKEDITOR.tools.extend(f, h));
            c.addCommand("selectNextCell", i());
            c.addCommand("selectPreviousCell", i(!0))
        }})
    })();
    CKEDITOR.dom.element.prototype.focusNext = function (i, h) {
        var g = void 0 === h ? this.getTabIndex() : h, f, c, d, e, b, a;
        if (0 >= g)for (b = this.getNextSourceNode(i, CKEDITOR.NODE_ELEMENT); b;) {
            if (b.isVisible() && 0 === b.getTabIndex()) {
                d = b;
                break
            }
            b = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT)
        } else for (b = this.getDocument().getBody().getFirst(); b = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
            if (!f)if (!c && b.equals(this)) {
                if (c = !0, i) {
                    if (!(b = b.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT)))break;
                    f = 1
                }
            } else c && !this.contains(b) &&
            (f = 1);
            if (b.isVisible() && !(0 > (a = b.getTabIndex()))) {
                if (f && a == g) {
                    d = b;
                    break
                }
                a > g && (!d || !e || a < e) ? (d = b, e = a) : !d && 0 === a && (d = b, e = a)
            }
        }
        d && d.focus()
    };
    CKEDITOR.dom.element.prototype.focusPrevious = function (i, h) {
        for (var g = void 0 === h ? this.getTabIndex() : h, f, c, d, e = 0, b, a = this.getDocument().getBody().getLast(); a = a.getPreviousSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
            if (!f)if (!c && a.equals(this)) {
                if (c = !0, i) {
                    if (!(a = a.getPreviousSourceNode(!0, CKEDITOR.NODE_ELEMENT)))break;
                    f = 1
                }
            } else c && !this.contains(a) && (f = 1);
            if (a.isVisible() && !(0 > (b = a.getTabIndex())))if (0 >= g) {
                if (f && 0 === b) {
                    d = a;
                    break
                }
                b > e && (d = a, e = b)
            } else {
                if (f && b == g) {
                    d = a;
                    break
                }
                if (b < g && (!d || b > e))d = a, e = b
            }
        }
        d && d.focus()
    };
    CKEDITOR.plugins.add("table", {requires: "dialog", init: function (a) {
        function d(a) {
            return CKEDITOR.tools.extend(a || {}, {contextSensitive: 1, refresh: function (a, e) {
                this.setState(e.contains("table", 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
            }})
        }

        if (!a.blockless) {
            var b = a.lang.table;
            a.addCommand("table", new CKEDITOR.dialogCommand("table", {context: "table", allowedContent: "table{width,height}[align,border,cellpadding,cellspacing,summary];caption tbody thead tfoot;th td tr[scope];" + (a.plugins.dialogadvtab ?
                "table" + a.plugins.dialogadvtab.allowedContent() : ""), requiredContent: "table", contentTransformations: [
                ["table{width}: sizeToStyle", "table[width]: sizeToAttribute"]
            ]}));
            a.addCommand("tableProperties", new CKEDITOR.dialogCommand("tableProperties", d()));
            a.addCommand("tableDelete", d({exec: function (a) {
                var c = a.elementPath().contains("table", 1);
                if (c) {
                    var b = c.getParent();
                    1 == b.getChildCount() && !b.is("body", "td", "th") && (c = b);
                    a = a.createRange();
                    a.moveToPosition(c, CKEDITOR.POSITION_BEFORE_START);
                    c.remove();
                    a.select()
                }
            }}));
            a.ui.addButton && a.ui.addButton("Table", {label: b.toolbar, command: "table", toolbar: "insert,30"});
            CKEDITOR.dialog.add("table", this.path + "dialogs/table.js");
            CKEDITOR.dialog.add("tableProperties", this.path + "dialogs/table.js");
            a.addMenuItems && a.addMenuItems({table: {label: b.menu, command: "tableProperties", group: "table", order: 5}, tabledelete: {label: b.deleteTable, command: "tableDelete", group: "table", order: 1}});
            a.on("doubleclick", function (a) {
                a.data.element.is("table") && (a.data.dialog = "tableProperties")
            });
            a.contextMenu &&
            a.contextMenu.addListener(function () {
                return{tabledelete: CKEDITOR.TRISTATE_OFF, table: CKEDITOR.TRISTATE_OFF}
            })
        }
    }});
    (function () {
        function p(e) {
            function d(a) {
                !(0 < b.length) && (a.type == CKEDITOR.NODE_ELEMENT && y.test(a.getName()) && !a.getCustomData("selected_cell")) && (CKEDITOR.dom.element.setMarker(c, a, "selected_cell", !0), b.push(a))
            }

            for (var e = e.getRanges(), b = [], c = {}, a = 0; a < e.length; a++) {
                var f = e[a];
                if (f.collapsed)f = f.getCommonAncestor(), (f = f.getAscendant("td", !0) || f.getAscendant("th", !0)) && b.push(f); else {
                    var f = new CKEDITOR.dom.walker(f), g;
                    for (f.guard = d; g = f.next();)if (g.type != CKEDITOR.NODE_ELEMENT || !g.is(CKEDITOR.dtd.table))if ((g =
                        g.getAscendant("td", !0) || g.getAscendant("th", !0)) && !g.getCustomData("selected_cell"))CKEDITOR.dom.element.setMarker(c, g, "selected_cell", !0), b.push(g)
                }
            }
            CKEDITOR.dom.element.clearAllMarkers(c);
            return b
        }

        function o(e, d) {
            for (var b = p(e), c = b[0], a = c.getAscendant("table"), c = c.getDocument(), f = b[0].getParent(), g = f.$.rowIndex, b = b[b.length - 1], h = b.getParent().$.rowIndex + b.$.rowSpan - 1, b = new CKEDITOR.dom.element(a.$.rows[h]), g = d ? g : h, f = d ? f : b, b = CKEDITOR.tools.buildTableMap(a), a = b[g], g = d ? b[g - 1] : b[g + 1], b = b[0].length,
                     c = c.createElement("tr"), h = 0; a[h] && h < b; h++) {
                var i;
                1 < a[h].rowSpan && g && a[h] == g[h] ? (i = a[h], i.rowSpan += 1) : (i = (new CKEDITOR.dom.element(a[h])).clone(), i.removeAttribute("rowSpan"), !CKEDITOR.env.ie && i.appendBogus(), c.append(i), i = i.$);
                h += i.colSpan - 1
            }
            d ? c.insertBefore(f) : c.insertAfter(f)
        }

        function q(e) {
            if (e instanceof CKEDITOR.dom.selection) {
                for (var d = p(e), b = d[0].getAscendant("table"), c = CKEDITOR.tools.buildTableMap(b), e = d[0].getParent().$.rowIndex, d = d[d.length - 1], a = d.getParent().$.rowIndex + d.$.rowSpan - 1, d = [],
                         f = e; f <= a; f++) {
                    for (var g = c[f], h = new CKEDITOR.dom.element(b.$.rows[f]), i = 0; i < g.length; i++) {
                        var j = new CKEDITOR.dom.element(g[i]), l = j.getParent().$.rowIndex;
                        1 == j.$.rowSpan ? j.remove() : (j.$.rowSpan -= 1, l == f && (l = c[f + 1], l[i - 1] ? j.insertAfter(new CKEDITOR.dom.element(l[i - 1])) : (new CKEDITOR.dom.element(b.$.rows[f + 1])).append(j, 1)));
                        i += j.$.colSpan - 1
                    }
                    d.push(h)
                }
                c = b.$.rows;
                b = new CKEDITOR.dom.element(c[a + 1] || (0 < e ? c[e - 1] : null) || b.$.parentNode);
                for (f = d.length; 0 <= f; f--)q(d[f]);
                return b
            }
            e instanceof CKEDITOR.dom.element &&
            (b = e.getAscendant("table"), 1 == b.$.rows.length ? b.remove() : e.remove());
            return null
        }

        function r(e, d) {
            for (var b = d ? Infinity : 0, c = 0; c < e.length; c++) {
                var a;
                a = e[c];
                for (var f = d, g = a.getParent().$.cells, h = 0, i = 0; i < g.length; i++) {
                    var j = g[i], h = h + (f ? 1 : j.colSpan);
                    if (j == a.$)break
                }
                a = h - 1;
                if (d ? a < b : a > b)b = a
            }
            return b
        }

        function k(e, d) {
            for (var b = p(e), c = b[0].getAscendant("table"), a = r(b, 1), b = r(b), a = d ? a : b, f = CKEDITOR.tools.buildTableMap(c), c = [], b = [], g = f.length, h = 0; h < g; h++)c.push(f[h][a]), b.push(d ? f[h][a - 1] : f[h][a + 1]);
            for (h = 0; h < g; h++)c[h] &&
            (1 < c[h].colSpan && b[h] == c[h] ? (a = c[h], a.colSpan += 1) : (a = (new CKEDITOR.dom.element(c[h])).clone(), a.removeAttribute("colSpan"), !CKEDITOR.env.ie && a.appendBogus(), a[d ? "insertBefore" : "insertAfter"].call(a, new CKEDITOR.dom.element(c[h])), a = a.$), h += a.rowSpan - 1)
        }

        function u(e, d) {
            var b = e.getStartElement();
            if (b = b.getAscendant("td", 1) || b.getAscendant("th", 1)) {
                var c = b.clone();
                CKEDITOR.env.ie || c.appendBogus();
                d ? c.insertBefore(b) : c.insertAfter(b)
            }
        }

        function t(e) {
            if (e instanceof CKEDITOR.dom.selection) {
                var e = p(e), d =
                    e[0] && e[0].getAscendant("table"), b;
                a:{
                    var c = 0;
                    b = e.length - 1;
                    for (var a = {}, f, g; f = e[c++];)CKEDITOR.dom.element.setMarker(a, f, "delete_cell", !0);
                    for (c = 0; f = e[c++];)if ((g = f.getPrevious()) && !g.getCustomData("delete_cell") || (g = f.getNext()) && !g.getCustomData("delete_cell")) {
                        CKEDITOR.dom.element.clearAllMarkers(a);
                        b = g;
                        break a
                    }
                    CKEDITOR.dom.element.clearAllMarkers(a);
                    g = e[0].getParent();
                    (g = g.getPrevious()) ? b = g.getLast() : (g = e[b].getParent(), b = (g = g.getNext()) ? g.getChild(0) : null)
                }
                for (g = e.length - 1; 0 <= g; g--)t(e[g]);
                b ? m(b, !0) : d && d.remove()
            } else e instanceof CKEDITOR.dom.element && (d = e.getParent(), 1 == d.getChildCount() ? d.remove() : e.remove())
        }

        function m(e, d) {
            var b = new CKEDITOR.dom.range(e.getDocument());
            if (!b["moveToElementEdit" + (d ? "End" : "Start")](e))b.selectNodeContents(e), b.collapse(d ? !1 : !0);
            b.select(!0)
        }

        function v(e, d, b) {
            e = e[d];
            if ("undefined" == typeof b)return e;
            for (d = 0; e && d < e.length; d++) {
                if (b.is && e[d] == b.$)return d;
                if (d == b)return new CKEDITOR.dom.element(e[d])
            }
            return b.is ? -1 : null
        }

        function s(e, d, b) {
            var c = p(e),
                a;
            if ((d ? 1 != c.length : 2 > c.length) || (a = e.getCommonAncestor()) && a.type == CKEDITOR.NODE_ELEMENT && a.is("table"))return!1;
            var f, e = c[0];
            a = e.getAscendant("table");
            var g = CKEDITOR.tools.buildTableMap(a), h = g.length, i = g[0].length, j = e.getParent().$.rowIndex, l = v(g, j, e);
            if (d) {
                var n;
                try {
                    var m = parseInt(e.getAttribute("rowspan"), 10) || 1;
                    f = parseInt(e.getAttribute("colspan"), 10) || 1;
                    n = g["up" == d ? j - m : "down" == d ? j + m : j]["left" == d ? l - f : "right" == d ? l + f : l]
                } catch (z) {
                    return!1
                }
                if (!n || e.$ == n)return!1;
                c["up" == d || "left" == d ? "unshift" : "push"](new CKEDITOR.dom.element(n))
            }
            for (var d =
                e.getDocument(), o = j, m = n = 0, q = !b && new CKEDITOR.dom.documentFragment(d), s = 0, d = 0; d < c.length; d++) {
                f = c[d];
                var k = f.getParent(), t = f.getFirst(), r = f.$.colSpan, u = f.$.rowSpan, k = k.$.rowIndex, w = v(g, k, f), s = s + r * u, m = Math.max(m, w - l + r);
                n = Math.max(n, k - j + u);
                if (!b) {
                    r = f;
                    (u = r.getBogus()) && u.remove();
                    r.trim();
                    if (f.getChildren().count()) {
                        if (k != o && t && (!t.isBlockBoundary || !t.isBlockBoundary({br: 1})))(o = q.getLast(CKEDITOR.dom.walker.whitespaces(!0))) && (!o.is || !o.is("br")) && q.append("br");
                        f.moveChildren(q)
                    }
                    d ? f.remove() : f.setHtml("")
                }
                o =
                    k
            }
            if (b)return n * m == s;
            q.moveChildren(e);
            CKEDITOR.env.ie || e.appendBogus();
            m >= i ? e.removeAttribute("rowSpan") : e.$.rowSpan = n;
            n >= h ? e.removeAttribute("colSpan") : e.$.colSpan = m;
            b = new CKEDITOR.dom.nodeList(a.$.rows);
            c = b.count();
            for (d = c - 1; 0 <= d; d--)a = b.getItem(d), a.$.cells.length || (a.remove(), c++);
            return e
        }

        function w(e, d) {
            var b = p(e);
            if (1 < b.length)return!1;
            if (d)return!0;
            var b = b[0], c = b.getParent(), a = c.getAscendant("table"), f = CKEDITOR.tools.buildTableMap(a), g = c.$.rowIndex, h = v(f, g, b), i = b.$.rowSpan, j;
            if (1 < i) {
                j = Math.ceil(i /
                    2);
                for (var i = Math.floor(i / 2), c = g + j, a = new CKEDITOR.dom.element(a.$.rows[c]), f = v(f, c), l, c = b.clone(), g = 0; g < f.length; g++)if (l = f[g], l.parentNode == a.$ && g > h) {
                    c.insertBefore(new CKEDITOR.dom.element(l));
                    break
                } else l = null;
                l || a.append(c, !0)
            } else {
                i = j = 1;
                a = c.clone();
                a.insertAfter(c);
                a.append(c = b.clone());
                l = v(f, g);
                for (h = 0; h < l.length; h++)l[h].rowSpan++
            }
            CKEDITOR.env.ie || c.appendBogus();
            b.$.rowSpan = j;
            c.$.rowSpan = i;
            1 == j && b.removeAttribute("rowSpan");
            1 == i && c.removeAttribute("rowSpan");
            return c
        }

        function x(e, d) {
            var b =
                p(e);
            if (1 < b.length)return!1;
            if (d)return!0;
            var b = b[0], c = b.getParent(), a = c.getAscendant("table"), a = CKEDITOR.tools.buildTableMap(a), f = v(a, c.$.rowIndex, b), g = b.$.colSpan;
            if (1 < g)c = Math.ceil(g / 2), g = Math.floor(g / 2); else {
                for (var g = c = 1, h = [], i = 0; i < a.length; i++) {
                    var j = a[i];
                    h.push(j[f]);
                    1 < j[f].rowSpan && (i += j[f].rowSpan - 1)
                }
                for (a = 0; a < h.length; a++)h[a].colSpan++
            }
            a = b.clone();
            a.insertAfter(b);
            CKEDITOR.env.ie || a.appendBogus();
            b.$.colSpan = c;
            a.$.colSpan = g;
            1 == c && b.removeAttribute("colSpan");
            1 == g && a.removeAttribute("colSpan");
            return a
        }

        var y = /^(?:td|th)$/;
        CKEDITOR.plugins.tabletools = {requires: "table,dialog,contextmenu", init: function (e) {
            function d(a) {
                return CKEDITOR.tools.extend(a || {}, {contextSensitive: 1, refresh: function (a, b) {
                    this.setState(b.contains({td: 1, th: 1}, 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                }})
            }

            function b(a, b) {
                var c = e.addCommand(a, b);
                e.addFeature(c)
            }

            var c = e.lang.table;
            b("cellProperties", new CKEDITOR.dialogCommand("cellProperties", d({allowedContent: "td th{width,height,border-color,background-color,white-space,vertical-align,text-align}[colspan,rowspan]",
                requiredContent: "table"})));
            CKEDITOR.dialog.add("cellProperties", this.path + "dialogs/tableCell.js");
            b("rowDelete", d({requiredContent: "table", exec: function (a) {
                a = a.getSelection();
                m(q(a))
            }}));
            b("rowInsertBefore", d({requiredContent: "table", exec: function (a) {
                a = a.getSelection();
                o(a, !0)
            }}));
            b("rowInsertAfter", d({requiredContent: "table", exec: function (a) {
                a = a.getSelection();
                o(a)
            }}));
            b("columnDelete", d({requiredContent: "table", exec: function (a) {
                for (var a = a.getSelection(), a = p(a), b = a[0], c = a[a.length - 1], a = b.getAscendant("table"),
                         d = CKEDITOR.tools.buildTableMap(a), e, j, l = [], n = 0, o = d.length; n < o; n++)for (var k = 0, q = d[n].length; k < q; k++)d[n][k] == b.$ && (e = k), d[n][k] == c.$ && (j = k);
                for (n = e; n <= j; n++)for (k = 0; k < d.length; k++)c = d[k], b = new CKEDITOR.dom.element(a.$.rows[k]), c = new CKEDITOR.dom.element(c[n]), c.$ && (1 == c.$.colSpan ? c.remove() : c.$.colSpan -= 1, k += c.$.rowSpan - 1, b.$.cells.length || l.push(b));
                j = a.$.rows[0] && a.$.rows[0].cells;
                e = new CKEDITOR.dom.element(j[e] || (e ? j[e - 1] : a.$.parentNode));
                l.length == o && a.remove();
                e && m(e, !0)
            }}));
            b("columnInsertBefore",
                d({requiredContent: "table", exec: function (a) {
                    a = a.getSelection();
                    k(a, !0)
                }}));
            b("columnInsertAfter", d({requiredContent: "table", exec: function (a) {
                a = a.getSelection();
                k(a)
            }}));
            b("cellDelete", d({requiredContent: "table", exec: function (a) {
                a = a.getSelection();
                t(a)
            }}));
            b("cellMerge", d({allowedContent: "td[colspan,rowspan]", requiredContent: "td[colspan,rowspan]", exec: function (a) {
                m(s(a.getSelection()), !0)
            }}));
            b("cellMergeRight", d({allowedContent: "td[colspan]", requiredContent: "td[colspan]", exec: function (a) {
                m(s(a.getSelection(),
                    "right"), !0)
            }}));
            b("cellMergeDown", d({allowedContent: "td[rowspan]", requiredContent: "td[rowspan]", exec: function (a) {
                m(s(a.getSelection(), "down"), !0)
            }}));
            b("cellVerticalSplit", d({allowedContent: "td[rowspan]", requiredContent: "td[rowspan]", exec: function (a) {
                m(w(a.getSelection()))
            }}));
            b("cellHorizontalSplit", d({allowedContent: "td[colspan]", requiredContent: "td[colspan]", exec: function (a) {
                m(x(a.getSelection()))
            }}));
            b("cellInsertBefore", d({requiredContent: "table", exec: function (a) {
                a = a.getSelection();
                u(a, !0)
            }}));
            b("cellInsertAfter", d({requiredContent: "table", exec: function (a) {
                a = a.getSelection();
                u(a)
            }}));
            e.addMenuItems && e.addMenuItems({tablecell: {label: c.cell.menu, group: "tablecell", order: 1, getItems: function () {
                var a = e.getSelection(), b = p(a);
                return{tablecell_insertBefore: CKEDITOR.TRISTATE_OFF, tablecell_insertAfter: CKEDITOR.TRISTATE_OFF, tablecell_delete: CKEDITOR.TRISTATE_OFF, tablecell_merge: s(a, null, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, tablecell_merge_right: s(a, "right", !0) ? CKEDITOR.TRISTATE_OFF :
                    CKEDITOR.TRISTATE_DISABLED, tablecell_merge_down: s(a, "down", !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, tablecell_split_vertical: w(a, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, tablecell_split_horizontal: x(a, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, tablecell_properties: 0 < b.length ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED}
            }}, tablecell_insertBefore: {label: c.cell.insertBefore, group: "tablecell", command: "cellInsertBefore", order: 5}, tablecell_insertAfter: {label: c.cell.insertAfter,
                group: "tablecell", command: "cellInsertAfter", order: 10}, tablecell_delete: {label: c.cell.deleteCell, group: "tablecell", command: "cellDelete", order: 15}, tablecell_merge: {label: c.cell.merge, group: "tablecell", command: "cellMerge", order: 16}, tablecell_merge_right: {label: c.cell.mergeRight, group: "tablecell", command: "cellMergeRight", order: 17}, tablecell_merge_down: {label: c.cell.mergeDown, group: "tablecell", command: "cellMergeDown", order: 18}, tablecell_split_horizontal: {label: c.cell.splitHorizontal, group: "tablecell",
                command: "cellHorizontalSplit", order: 19}, tablecell_split_vertical: {label: c.cell.splitVertical, group: "tablecell", command: "cellVerticalSplit", order: 20}, tablecell_properties: {label: c.cell.title, group: "tablecellproperties", command: "cellProperties", order: 21}, tablerow: {label: c.row.menu, group: "tablerow", order: 1, getItems: function () {
                return{tablerow_insertBefore: CKEDITOR.TRISTATE_OFF, tablerow_insertAfter: CKEDITOR.TRISTATE_OFF, tablerow_delete: CKEDITOR.TRISTATE_OFF}
            }}, tablerow_insertBefore: {label: c.row.insertBefore,
                group: "tablerow", command: "rowInsertBefore", order: 5}, tablerow_insertAfter: {label: c.row.insertAfter, group: "tablerow", command: "rowInsertAfter", order: 10}, tablerow_delete: {label: c.row.deleteRow, group: "tablerow", command: "rowDelete", order: 15}, tablecolumn: {label: c.column.menu, group: "tablecolumn", order: 1, getItems: function () {
                return{tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF, tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF, tablecolumn_delete: CKEDITOR.TRISTATE_OFF}
            }}, tablecolumn_insertBefore: {label: c.column.insertBefore,
                group: "tablecolumn", command: "columnInsertBefore", order: 5}, tablecolumn_insertAfter: {label: c.column.insertAfter, group: "tablecolumn", command: "columnInsertAfter", order: 10}, tablecolumn_delete: {label: c.column.deleteColumn, group: "tablecolumn", command: "columnDelete", order: 15}});
            e.contextMenu && e.contextMenu.addListener(function (a, b, c) {
                return(a = c.contains({td: 1, th: 1}, 1)) && !a.isReadOnly() ? {tablecell: CKEDITOR.TRISTATE_OFF, tablerow: CKEDITOR.TRISTATE_OFF, tablecolumn: CKEDITOR.TRISTATE_OFF} : null
            })
        }, getSelectedCells: p};
        CKEDITOR.plugins.add("tabletools", CKEDITOR.plugins.tabletools)
    })();
    CKEDITOR.tools.buildTableMap = function (p) {
        for (var p = p.$.rows, o = -1, q = [], r = 0; r < p.length; r++) {
            o++;
            !q[o] && (q[o] = []);
            for (var k = -1, u = 0; u < p[r].cells.length; u++) {
                var t = p[r].cells[u];
                for (k++; q[o][k];)k++;
                for (var m = isNaN(t.colSpan) ? 1 : t.colSpan, t = isNaN(t.rowSpan) ? 1 : t.rowSpan, v = 0; v < t; v++) {
                    q[o + v] || (q[o + v] = []);
                    for (var s = 0; s < m; s++)q[o + v][k + s] = p[r].cells[u]
                }
                k += m - 1
            }
        }
        return q
    };
    (function () {
        function i(a) {
            this.editor = a;
            this.reset()
        }

        CKEDITOR.plugins.add("undo", {init: function (a) {
            function c(a) {
                b.enabled && !1 !== a.data.command.canUndo && b.save()
            }

            function d() {
                b.enabled = a.readOnly ? !1 : "wysiwyg" == a.mode;
                b.onChange()
            }

            var b = new i(a), e = a.addCommand("undo", {exec: function () {
                b.undo() && (a.selectionChange(), this.fire("afterUndo"))
            }, state: CKEDITOR.TRISTATE_DISABLED, canUndo: !1}), f = a.addCommand("redo", {exec: function () {
                b.redo() && (a.selectionChange(), this.fire("afterRedo"))
            }, state: CKEDITOR.TRISTATE_DISABLED,
                canUndo: !1});
            a.setKeystroke([
                [CKEDITOR.CTRL + 90, "undo"],
                [CKEDITOR.CTRL + 89, "redo"],
                [CKEDITOR.CTRL + CKEDITOR.SHIFT + 90, "redo"]
            ]);
            b.onChange = function () {
                e.setState(b.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                f.setState(b.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
            };
            a.on("beforeCommandExec", c);
            a.on("afterCommandExec", c);
            a.on("saveSnapshot", function (a) {
                b.save(a.data && a.data.contentOnly)
            });
            a.on("contentDom", function () {
                a.editable().on("keydown", function (a) {
                    !a.data.$.ctrlKey && !a.data.$.metaKey && b.type(a)
                })
            });
            a.on("beforeModeUnload", function () {
                "wysiwyg" == a.mode && b.save(!0)
            });
            a.on("mode", d);
            a.on("readOnly", d);
            a.ui.addButton && (a.ui.addButton("Undo", {label: a.lang.undo.undo, command: "undo", toolbar: "undo,10"}), a.ui.addButton("Redo", {label: a.lang.undo.redo, command: "redo", toolbar: "undo,20"}));
            a.resetUndo = function () {
                b.reset();
                a.fire("saveSnapshot")
            };
            a.on("updateSnapshot", function () {
                b.currentImage && b.update()
            });
            a.on("lockSnapshot", b.lock, b);
            a.on("unlockSnapshot", b.unlock, b)
        }});
        CKEDITOR.plugins.undo =
        {};
        var h = CKEDITOR.plugins.undo.Image = function (a) {
            this.editor = a;
            a.fire("beforeUndoImage");
            var c = a.getSnapshot(), d = c && a.getSelection();
            CKEDITOR.env.ie && c && (c = c.replace(/\s+data-cke-expando=".*?"/g, ""));
            this.contents = c;
            this.bookmarks = d && d.createBookmarks2(!0);
            a.fire("afterUndoImage")
        }, j = /\b(?:href|src|name)="[^"]*?"/gi;
        h.prototype = {equals: function (a, c) {
            var d = this.contents, b = a.contents;
            if (CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat))d = d.replace(j, ""), b = b.replace(j, "");
            if (d != b)return!1;
            if (c)return!0;
            d = this.bookmarks;
            b = a.bookmarks;
            if (d || b) {
                if (!d || !b || d.length != b.length)return!1;
                for (var e = 0; e < d.length; e++) {
                    var f = d[e], g = b[e];
                    if (f.startOffset != g.startOffset || f.endOffset != g.endOffset || !CKEDITOR.tools.arrayCompare(f.start, g.start) || !CKEDITOR.tools.arrayCompare(f.end, g.end))return!1
                }
            }
            return!0
        }};
        var k = {8: 1, 46: 1}, m = {16: 1, 17: 1, 18: 1}, l = {37: 1, 38: 1, 39: 1, 40: 1};
        i.prototype = {type: function (a) {
            var a = a && a.data.getKey(), c = a in k, d = this.lastKeystroke in k, b = c && a == this.lastKeystroke, e = a in l, f = this.lastKeystroke in
                l;
            if (!(a in m || this.typing) || !c && !e && (d || f) || c && !b) {
                var g = new h(this.editor), i = this.snapshots.length;
                CKEDITOR.tools.setTimeout(function () {
                    var a = this.editor.getSnapshot();
                    CKEDITOR.env.ie && (a = a.replace(/\s+data-cke-expando=".*?"/g, ""));
                    g.contents != a && i == this.snapshots.length && (this.typing = !0, this.save(!1, g, !1) || this.snapshots.splice(this.index + 1, this.snapshots.length - this.index - 1), this.hasUndo = !0, this.hasRedo = !1, this.modifiersCount = this.typesCount = 1, this.onChange())
                }, 0, this)
            }
            this.lastKeystroke = a;
            c ?
                (this.typesCount = 0, this.modifiersCount++, 25 < this.modifiersCount && (this.save(!1, null, !1), this.modifiersCount = 1)) : e || (this.modifiersCount = 0, this.typesCount++, 25 < this.typesCount && (this.save(!1, null, !1), this.typesCount = 1))
        }, reset: function () {
            this.lastKeystroke = 0;
            this.snapshots = [];
            this.index = -1;
            this.limit = this.editor.config.undoStackSize || 20;
            this.currentImage = null;
            this.hasRedo = this.hasUndo = !1;
            this.locked = null;
            this.resetType()
        }, resetType: function () {
            this.typing = !1;
            delete this.lastKeystroke;
            this.modifiersCount =
                this.typesCount = 0
        }, fireChange: function () {
            this.hasUndo = !!this.getNextImage(!0);
            this.hasRedo = !!this.getNextImage(!1);
            this.resetType();
            this.onChange()
        }, save: function (a, c, d) {
            if (this.locked)return!1;
            var b = this.snapshots;
            c || (c = new h(this.editor));
            if (!1 === c.contents || this.currentImage && c.equals(this.currentImage, a))return!1;
            b.splice(this.index + 1, b.length - this.index - 1);
            b.length == this.limit && b.shift();
            this.index = b.push(c) - 1;
            this.currentImage = c;
            !1 !== d && this.fireChange();
            return!0
        }, restoreImage: function (a) {
            var c =
                this.editor, d;
            a.bookmarks && (c.focus(), d = c.getSelection());
            this.locked = 1;
            this.editor.loadSnapshot(a.contents);
            a.bookmarks ? d.selectBookmarks(a.bookmarks) : CKEDITOR.env.ie && (c = this.editor.document.getBody().$.createTextRange(), c.collapse(!0), c.select());
            this.locked = 0;
            this.index = a.index;
            this.update();
            this.fireChange()
        }, getNextImage: function (a) {
            var c = this.snapshots, d = this.currentImage, b;
            if (d)if (a)for (b = this.index - 1; 0 <= b; b--) {
                if (a = c[b], !d.equals(a, !0))return a.index = b, a
            } else for (b = this.index + 1; b < c.length; b++)if (a =
                c[b], !d.equals(a, !0))return a.index = b, a;
            return null
        }, redoable: function () {
            return this.enabled && this.hasRedo
        }, undoable: function () {
            return this.enabled && this.hasUndo
        }, undo: function () {
            if (this.undoable()) {
                this.save(!0);
                var a = this.getNextImage(!0);
                if (a)return this.restoreImage(a), !0
            }
            return!1
        }, redo: function () {
            if (this.redoable() && (this.save(!0), this.redoable())) {
                var a = this.getNextImage(!1);
                if (a)return this.restoreImage(a), !0
            }
            return!1
        }, update: function () {
            this.locked || this.snapshots.splice(this.index, 1, this.currentImage =
                new h(this.editor))
        }, lock: function () {
            if (this.locked)this.locked.level++; else {
                var a = new h(this.editor);
                this.locked = {update: this.currentImage && this.currentImage.equals(a, !0) ? a : null, level: 1}
            }
        }, unlock: function () {
            if (this.locked && !--this.locked.level) {
                var a = this.locked.update;
                this.locked = null;
                a && !a.equals(new h(this.editor), !0) && this.update()
            }
        }}
    })();
    CKEDITOR.plugins.add("wsc", {requires: "dialog", init: function (a) {
        a.addCommand("checkspell", new CKEDITOR.dialogCommand("checkspell")).modes = {wysiwyg: !CKEDITOR.env.opera && !CKEDITOR.env.air && document.domain == window.location.hostname};
        "undefined" == typeof a.plugins.scayt && a.ui.addButton && a.ui.addButton("SpellChecker", {label: a.lang.wsc.toolbar, command: "checkspell", toolbar: "spellchecker,10"});
        CKEDITOR.dialog.add("checkspell", this.path + "dialogs/wsc.js")
    }});
    CKEDITOR.config.wsc_customerId = CKEDITOR.config.wsc_customerId || "1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk";
    CKEDITOR.config.wsc_customLoaderScript = CKEDITOR.config.wsc_customLoaderScript || null;
    CKEDITOR.config.plugins = 'dialogui,dialog,about,a11yhelp,basicstyles,blockquote,clipboard,panel,floatpanel,menu,contextmenu,resize,button,toolbar,elementspath,list,indent,enterkey,entities,popup,filebrowser,floatingspace,listblock,richcombo,format,htmlwriter,horizontalrule,wysiwygarea,image,fakeobjects,link,magicline,maximize,pastetext,pastefromword,removeformat,sourcearea,specialchar,menubutton,scayt,stylescombo,tab,table,tabletools,undo,wsc';
    CKEDITOR.config.skin = 'moono';
    (function () {
        var icons = ( 'about,0,bold,32,italic,64,strike,96,subscript,128,superscript,160,underline,192,blockquote,224,copy-rtl,256,copy,288,cut-rtl,320,cut,352,paste-rtl,384,paste,416,bulletedlist-rtl,448,bulletedlist,480,numberedlist-rtl,512,numberedlist,544,indent-rtl,576,indent,608,outdent-rtl,640,outdent,672,horizontalrule,704,image,736,anchor-rtl,768,anchor,800,link,832,unlink,864,maximize,896,pastetext-rtl,928,pastetext,960,pastefromword-rtl,992,pastefromword,1024,removeformat,1056,source-rtl,1088,source,1120,specialchar,1152,scayt,1184,table,1216,redo-rtl,1248,redo,1280,undo-rtl,1312,undo,1344,spellchecker,1376' ), path = CKEDITOR.getUrl('plugins/icons.png'), icons = icons.split(',');
        for (var i = 0; i < icons.length; i++)CKEDITOR.skin.icons[ icons[ i ] ] = { path: path, offset: -icons[ ++i ] };
    })();
    CKEDITOR.lang.languages = {"af": 1, "sq": 1, "ar": 1, "eu": 1, "bn": 1, "bs": 1, "bg": 1, "ca": 1, "zh-cn": 1, "zh": 1, "hr": 1, "cs": 1, "da": 1, "nl": 1, "en": 1, "en-au": 1, "en-ca": 1, "en-gb": 1, "eo": 1, "et": 1, "fo": 1, "fi": 1, "fr": 1, "fr-ca": 1, "gl": 1, "ka": 1, "de": 1, "el": 1, "gu": 1, "he": 1, "hi": 1, "hu": 1, "is": 1, "it": 1, "ja": 1, "km": 1, "ko": 1, "ku": 1, "lv": 1, "lt": 1, "mk": 1, "ms": 1, "mn": 1, "no": 1, "nb": 1, "fa": 1, "pl": 1, "pt-br": 1, "pt": 1, "ro": 1, "ru": 1, "sr": 1, "sr-latn": 1, "sk": 1, "sl": 1, "es": 1, "sv": 1, "th": 1, "tr": 1, "ug": 1, "uk": 1, "vi": 1, "cy": 1};
}());