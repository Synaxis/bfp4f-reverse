(function(x) {
    if (typeof require !== "undefined") {
        if (!x.EASY) {
            x.EASY = require("./../../../../common/js/components/easy/easy")
        }
    }
    var n, r = x.EASY,
        g = r.win,
        E = r.doc,
        h = r.$,
        b = r.Backbone,
        D = r._,
        v = x.Cufon || {},
        s = {},
        u = false,
        q = false,
        l = false,
        z = "waiting",
        a = "defered",
        m = "running",
        p = "done";

    function f() {
        if (f.halt === true) {
            return false
        }
        D.forEach(s, function F(I, H) {
            if (I.status === z) {
                s[H].status = a;
                D.defer(function G() {
                    s[H].status = m;
                    I(function J(L) {
                        if (L instanceof Error) {
                            f.halt = true;
                            n.error(L);
                            n.trigger("error", L.message);
                            return
                        }
                        s[H].status = p;
                        var K = D.unique(D.pluck(s, "status"));
                        n.trigger("task", n, H);
                        n.trigger("task:" + H, n);
                        if (K.length === 1 && K[0] === p) {
                            u = this.isReady = true;
                            setTimeout(function M() {
                                n.trigger("ready")
                            }, 1000)
                        }
                    })
                })
            }
        })
    }
    n = x.APP = new(r.extend({
        win: g,
        doc: E,
        $: h,
        Backbone: b,
        _: D,
        Cufon: v,
        warn: function() {
            if (this.debug) {
                r.prototype.warn.apply(this, arguments)
            }
            return this
        },
        dir: function() {
            if (this.debug) {
                r.prototype.dir.apply(this, arguments)
            }
            return this
        },
        log: function() {
            if (this.debug) {
                r.prototype.log.apply(this, arguments)
            }
            return this
        },
        error: function() {
            if (this.debug) {
                r.prototype.error.apply(this, arguments)
            }
            return this
        },
        time: function() {
            if (this.debug) {
                r.prototype.time.apply(this, arguments)
            }
        },
        timeEnd: function() {
            if (this.debug) {
                r.prototype.timeEnd.apply(this, arguments)
            }
        },
        group: function() {
            if (this.debug) {
                r.prototype.group.apply(this, arguments)
            }
        },
        groupEnd: function() {
            if (this.debug) {
                r.prototype.groupEnd.apply(this, arguments)
            }
        },
        sidis: {
            trans: function(F) {
                return F
            }
        },
        task: function e() {
            var G = D.toArray(arguments),
                F = G.shift(),
                H = G.pop(),
                I = G.shift() || [];
            if (!D.isArray(I)) {
                I = [I]
            }
            if (s.hasOwnProperty(F)) {
                throw new Error('Task with name "' + F + '" already defined')
            }
            if (H === "function") {
                throw new Error('Task with name "' + F + '" must to be a function!')
            }
            u = this.isReady = false;
            if (I.length === 0) {
                s[F] = H
            } else {
                s[F] = function(J) {
                    n.onTask(I, function() {
                        H(J)
                    })
                }
            }
            s[F].status = z;
            s[F].dependsOn = I;
            if (q) {
                f()
            }
            return this
        },
        domTask: function C() {
            var G = D.toArray(arguments),
                F = G.shift(),
                H = G.pop(),
                I = G.shift() || [];
            if (!D.isArray(I)) {
                I = [I]
            }
            I.unshift("dom");
            n.task(F, I, H);
            return this
        },
        onTask: function B() {
            var J = D.toArray(arguments),
                L = J.pop(),
                F, I, K, H = true,
                G = function G() {
                    var M = J.length,
                        O, P;
                    for (P = 0; P < M; P += 1) {
                        O = J[P];
                        if (!s.hasOwnProperty(O) || s[O].status !== p) {
                            return
                        }
                    }
                    setTimeout(function N() {
                        if (f.halt !== true && H) {
                            L();
                            H = false
                        }
                    }, 0)
                };
            if (J.length === 1 && D.isArray(J[0])) {
                J = J[0]
            }
            for (K = 0, F = J.length; K < F; K += 1) {
                I = J[K];
                if (!s.hasOwnProperty(I) || s[I].status !== p) {
                    n.once("task:" + I, G)
                }
            }
            G();
            return this
        },
        ready: function y(F) {
            if (u) {
                D.defer(F)
            } else {
                this.once("ready", F)
            }
            return this
        },
        start: function d() {
            if (q) {
                return this
            }
            this.time("APPLICATION :: START");
            q = true;
            var H = 2 * 60 * 1000,
                J = setTimeout(function L() {
                    f.halt = true;
                    var Q = [],
                        S = "Failed to get the ready event in time";
                    D.forEach(s, function R(T, U) {
                        if (T.status !== p) {
                            Q.push(JSON.stringify({
                                task: U,
                                status: T.status,
                                dependsOn: D.map(T.dependsOn, function(V) {
                                    return V + "=" + s[V].status
                                }).join(", ")
                            }))
                        }
                    });
                    h.magma.debugLog("warn", "Remaining Tasks:\n" + Q.join("\n"));
                    n.trigger("error", {
                        body: S,
                        close: false
                    })
                }, H),
                I, K, P, M = this.$preloader.find("div.progress-meter"),
                O = D.keys(s).length + 1,
                G = 0;
            I = D.bind(function N() {
                if (J) {
                    clearTimeout(J)
                }
                f.halt = true;
                this.unbind("error", I);
                this.unbind("ready", K);
                this.unbind("task", P);
                this.$preloader.addClass("error")
            }, this);
            K = D.bind(function F() {
                var R = h(n.win);
                if (J) {
                    clearTimeout(J)
                }
                n.win.playSound("LoadedSoldier", "Login is complete");
                this.$frontend.addClass("loaded");
                this.unbind("error", I);
                this.unbind("ready", K);
                this.unbind("task", P);
                if (n.win.game && n.ns("config").debug) {
                    R.bind("keydown", function Q(S) {
                        if (S.keyCode === 116) {
                            n.reload()
                        }
                    })
                }
                R.one("beforeunload", D.bind(function() {
                    this.showSplash()
                }, this));
                g.location.hash = "home";
                b.history.start();
                M.css("width", "100%");
                D.delay(D.bind(function() {
                    this.hideSplash();
                    this.$preloader.find("div.progress-bar").remove();
                    this.timeEnd("APPLICATION :: START")
                }, this), 200)
            }, this);
            P = function() {
                G += 1;
                var Q = (G / O) * 100;
                M.css("width", Q + "%")
            };
            this.bind("error", I);
            this.bind("ready", K);
            this.bind("task", P);
            this.$frontend.find("div.main").addClass("hidden");
            f();
            return this
        },
        page: function k(I, H) {
            H = H || {};
            var F = this.$frontend.find("div.main"),
                J = ((F.not(".hidden").attr("class") || "").match(/main_([^\s]+)/) || []).pop(),
                G = false;
            if (I === true) {
                J = I
            }
            if (I === J) {
                G = true
            } else {
                F.each(function() {
                    var K = h(this);
                    if (K.hasClass("main_" + I)) {
                        G = true;
                        if (!K.is(":visible")) {
                            K.hide().removeClass("hidden").fadeIn("slow")
                        }
                    } else {
                        K.addClass("hidden")
                    }
                })
            }
            if (G) {
                this.trigger("page", I, J, H);
                this.trigger("page:" + I, J, H)
            } else {
                throw new Error('Unable to show page "' + I + '"')
            }
            return this
        },
        currentPage: function() {
            var F = this.$frontend.find("div.main"),
                G = ((F.not(".hidden").attr("class") || "").match(/main_([^\s]+)/) || []).pop();
            return G
        },
        showSplash: function i() {
            this.$preloader.show();
            this.$frontend.hide();
            n.win.hideDoll();
            return this
        },
        hideSplash: function o() {
            this.$preloader.hide();
            this.$frontend.show();
            return this
        },
        reload: function w(F) {
            F = F || 0;
            D.delay(function() {
                n.win.location.reload()
            }, F);
            return this
        }
    }))();
    n.route(/.*/, "catch-all", function c() {
        n.warn("Unhandled route", n.win.location.hash)
    });
    n.route("page/:page", "page", n.page);
    n.task("dom", function j(F) {
        h(function G() {
            l = true;
            F()
        })
    });
    n.randomInt = function A(G, F) {
        G = G || 0;
        F = F || (new Date()).getTime();
        return Math.floor(Math.random() * (F - G + 1)) + G
    };
    n.api = {
        general: x.general || {
            autoReload: true,
            cameraShake: false,
            getWindowSize: function() {
                if (g.innerWidth < 1024 || g.innerHeight < 768) {
                    return '{ "width": 800, "height": 600 }'
                }
                return '{ "width": 1024, "height": 768 }'
            },
            reset: function() {
                n.api.general.autoReload = true;
                n.api.general.cameraShake = false
            },
            cancel: function() {},
            apply: function() {}
        },
        video: x.video || {
            selectedResolution: "1280x1024@60Hz",
            getScreenResolutions: function() {
                return '[ { "resolution" : "640x480@60Hz", "recommended" : "false" }, { "resolution" : "720x480@60Hz", "recommended" : "false" },{ "resolution" : "720x576@60Hz", "recommended" : "false" },{ "resolution" : "800x600@60Hz", "recommended" : "true"  },{ "resolution" : "1024x768@60Hz", "recommended" : "true" },{ "resolution" : "1152x864@60Hz", "recommended" : "false" },{ "resolution" : "1280x720@60Hz", "recommended" : "false" },{ "resolution" : "1280x768@60Hz", "recommended" : "false" },{ "resolution" : "1280x800@60Hz", "recommended" : "false" },{ "resolution" : "1280x960@60Hz", "recommended" : "false" },{ "resolution" : "1280x1024@60Hz", "recommended" : "true" },{ "resolution" : "1360x768@60Hz", "recommended" : "false" },{ "resolution" : "1366x768@60Hz", "recommended" : "false" },{ "resolution" : "1600x900@60Hz", "recommended" : "false" },{ "resolution" : "1600x1024@60Hz", "recommended" : "false" },{ "resolution" : "1600x1200@60Hz", "recommended" : "true" }]'
            },
            scheme: 2,
            detectScheme: function() {
                return 2
            },
            getAvailableAntialiasing: function() {
                return '[ { "value" : "Off", "text" : "VIDEOSETTINGS_Off" }, { "value" : "2Samples", "text" : "VIDEOSETTINGS_2Samples" }, { "value" : "4Samples", "text" : "VIDEOSETTINGS_4Samples" }, { "value" : "8Samples", "text" : "VIDEOSETTINGS_8Samples" } ]'
            },
            reset: function() {
                n.api.video.selectedResolution = "1280x1024@60Hz";
                n.api.video.scheme = 2
            },
            save: function() {},
            cancel: function() {},
            apply: function() {}
        },
        audio: x.audio || {
            effectsVolume: 0.7,
            musicVolume: 0.7,
            hasEAX: false,
            eax: false,
            hasZenithBoard: false,
            provider: "hardware",
            quality: "High",
            needRestart: false,
            inCriticalState: false,
            save: function() {},
            cancel: function() {},
            canApply: function() {
                return true
            },
            reset: function() {
                n.api.audio.effectsVolume = 0.7;
                n.api.audio.musicVolume = 0.7;
                n.api.audio.quality = "High";
                n.api.audio.provider = "hardware"
            },
            apply: function() {}
        },
        controls: x.controls || {
            mouseSensitivity: 3,
            mouseSensitivityMultiplier: 1,
            mouseSmoothing: 0,
            mouseYawFactor: 1,
            mousePitchFactor: 1,
            invertMouse: false,
            keyboardSensitivity: 0.1,
            getMappedString: function(H, G, F, I) {
                return H.replace("PlayerInputControlMap", "")
            },
            getKeyMapping: function(F) {},
            mapInput: function() {
                return n.randomInt(0, 3)
            },
            reset: function() {},
            save: function() {},
            cancel: function() {},
            apply: function() {},
            lastDuplicateInput: "WEST_FE_COM_Controls_Weapon_WeaponKey0"
        },
        localization: x.localization || {
            get: function(F) {
                return F
            },
            lang: "en"
        }
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = n
    } else {
        n.$(g).bind("keydown", function(F) {
            if (F.keyCode === 9) {
                F.preventDefault()
            }
        });
        h(function() {
            n.$preloader = h("#preloader");
            n.$frontend = h("#frontend");
            if (n.ns("config").persona) {
                if (n.debug) {
                    h(g).error(function(F) {
                        n.error(F.originalEvent);
                        n.trigger("error", F.originalEvent.message)
                    })
                }
                n.start()
            } else {
                n.$preloader.hide();
                n.$frontend.show()
            }
        })
    }
}(this));
(function(a) {
    if (typeof require !== "undefined") {
        if (!a.EASY) {
            a.EASY = require("./../../../../common/js/components/easy/easy")
        }
        if (!a.EASY.Model) {
            a.EASY.Model = require("./../../../../common/js/components/easy/easy.model")
        }
        if (!a.APP) {
            a.APP = require("./../common/app")
        }
    }
    var c = a.APP,
        b = a.EASY;
    c.Model = b.Model.extend({});
    if (typeof module !== "undefined" && module.exports) {
        module.exports = c.Model
    }
}(this));
(function(a) {
    if (typeof require !== "undefined") {
        if (!a.EASY) {
            a.EASY = require("./../../../../common/js/components/easy/easy")
        }
        if (!a.EASY.Collection) {
            a.EASY.Collection = require("./../../../../common/js/components/easy/easy.collection")
        }
        if (!a.APP) {
            a.APP = require("./app")
        }
        if (!a.APP.Model) {
            a.APP.Model = require("./model")
        }
    }
    var c = a.APP,
        b = a.EASY;
    c.Collection = b.Collection.extend({
        model: c.Model
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = c.Collection
    }
}(this));
(function(g) {
    var c = g.EASY,
        h = g.APP,
        f = h.win,
        d = h.$,
        j = h._,
        i = h.Backbone.View.prototype,
        b = f.HTMLElement;
    h.View = c.View.extend({
        $: function(l) {
            return d(l, this.el)
        },
        sound: function e(l) {
            h.ns("game").sound(l);
            return this
        },
        trans: function a() {
            return h.sidis.trans.apply(h.sidis, arguments)
        },
        transChoice: function k() {
            return h.sidis.transChoice.apply(h.sidis, arguments)
        }
    })
}(this));
(function(e) {
    if (!e.APP && (typeof require !== "undefined")) {
        e.APP = require("../common/app")
    }
    var b = e.APP;
    b.View.Button = b.View.extend({
        name: "button-view",
        tagName: "a",
        events: {
            click: function(g) {
                if (!this.el.target) {
                    g.preventDefault()
                }
                if (this.options.sound) {
                    if (this.$el.hasClass("disabled")) {
                        this.sound("click:disabled")
                    } else {
                        this.sound("click:button")
                    }
                }
                this.trigger("click", this, g)
            },
            mouseenter: function() {
                this.sound("hover")
            }
        },
        destroy: function a() {},
        disable: function c() {
            this.$el.addClass("disabled");
            return this
        },
        enable: function d() {
            this.$el.removeClass("disabled");
            return this
        },
        render: function f() {
            if (this.options.attrs) {
                this.$el.attr(this.options.attrs)
            }
            if (this.options.className) {
                this.$el.addClass(this.options.className)
            }
            this.$el.html("<span>" + this.options.text + "</span>")
        }
    })
}(this));
(function(g) {
    if (!g.APP && (typeof require !== "undefined")) {
        g.APP = require("../common/app")
    }
    var e = g.APP,
        f = e.$,
        b = e._,
        d = e.View.prototype;
    e.View.Choose = e.View.extend({
        name: "choose-view",
        tagName: "span",
        events: {
            click: function(i) {
                i.preventDefault();
                clearTimeout(this._timer);
                this.toggle()
            },
            mouseenter: function() {
                this.sound("hover");
                clearTimeout(this._timer)
            },
            mouseleave: function() {
                this._timer = setTimeout(b.bind(function() {
                    this.close()
                }, this), 500)
            },
            "click a": function(l) {
                l.preventDefault();
                this.sound("click");
                var k = l.currentTarget,
                    j = this.$values.index(k);
                this.choose(j)
            },
            "mouseenter a": function() {
                this.sound("hover")
            },
            "focus a": function() {
                this.open()
            },
            "blur a": function() {
                this.close()
            }
        },
        destroy: function h() {},
        open: function() {
            this.sound("select:open");
            this.$el.addClass("open");
            return this
        },
        close: function() {
            this.sound("select:close");
            this.$el.removeClass("open");
            return this
        },
        toggle: function() {
            if (this.$el.hasClass("open")) {
                this.close()
            } else {
                this.open()
            }
            return this
        },
        choose: function c(j, i) {
            j = j || 0;
            i = i || {};
            var k = this.options.values[j] || "- choose -";
            this.$values.removeClass("choosen");
            if (j >= 0) {
                this.$values.eq(j).addClass("choosen")
            }
            this.$choosen.text(k);
            if (!i.silent) {
                this.trigger("choose", j, k)
            }
            return this
        },
        render: function a() {
            var i = this.make("span", {
                "class": "values"
            });
            this.$choosen = this.$(this.make("span", {
                "class": "choosen"
            })).appendTo(this.el);
            this.$values = this.$(b.map(this.options.values, function(l, k) {
                var j = this.make("a", {
                    href: "#choose-" + k
                }, l);
                i.appendChild(j);
                return j
            }, this));
            this.el.appendChild(i);
            this.choose(this.options.value, {
                silent: true
            })
        }
    })
}(this));
(function(f) {
    var j = f.APP,
        d = j.$,
        m = j._,
        k = j.View.prototype;
    j.View.DnD = j.View.extend({
        options: m.extend({}, k.options, {
            drag: false,
            drop: false
        }),
        dragOptions: {
            appendTo: j.doc.body,
            containment: [0, 0, 945, 690],
            cursorAt: {
                left: 40,
                top: 35
            },
            revertDuration: 200
        },
        dropOptions: {
            tolerance: "pointer",
            activeClass: "active",
            hoverClass: "drop-hover"
        },
        constructor: function i() {
            j.View.apply(this, arguments);
            this.bind("render", this.initializeDragAndDrop, this)
        },
        _configure: function a(n) {
            this.dragOptions = m.extend({}, this.dragOptions, n.dragOptions);
            delete n.dragOptions;
            this.dropOptions = m.extend({}, this.dropOptions, n.dropOptions);
            delete n.dropOptions;
            return k._configure.call(this, n)
        },
        initializeDragAndDrop: function b() {
            if (this.options.drag) {
                this.initializeDrag()
            }
            if (this.options.drop) {
                this.initializeDrop()
            }
        },
        initializeDrag: function e() {
            var r = this,
                q = j.doc.body,
                u = j.ns("config"),
                w = m.extend({}, this.dragOptions, {
                    helper: m.bind(this.dragHelper, this),
                    revert: function p(x) {
                        r.trigger("drag:revert", x, this);
                        if (r.dragOptions.hasOwnProperty("revert")) {
                            if (m.isFunction(r.dragOptions.revert)) {
                                return r.dragOptions.revert.call(this, x, this)
                            }
                            if (r.dragOptions.revert === "invalid") {
                                return !x
                            }
                            if (r.dragOptions.revert === "valid") {
                                return !!x
                            }
                            return r.dragOptions.revert
                        }
                        return !x
                    },
                    start: function v(y, x) {
                        r.trigger("drag:start", r.collection.get(x.helper.data("id")), x, this)
                    },
                    drag: function s(y, x) {
                        q.scrollTop = 0;
                        q.scrollLeft = 0;
                        r.trigger("drag", r.collection.get(x.helper.data("id")), x, this)
                    },
                    stop: function n(y, x) {
                        r.trigger("drag:stop", r.collection.get(x.helper.data("id")), x, this)
                    }
                }),
                o = this.$(this.options.drag);
            if (u.isScaled && w.cursorAt) {
                w.cursorAt.left = w.cursorAt.left * u.scale;
                w.cursorAt.top = w.cursorAt.top * u.scale
            }
            o.draggable("destroy").draggable(w);
            return this
        },
        getModelFromDOM: function c(n) {
            throw new Error("This needs to be implemented in any subclassses")
        },
        dragHelper: function l(o) {
            var n = d(o.currentTarget).clone();
            n.appendTo(j.doc.body);
            return n
        },
        initializeDrop: function h() {
            var v = this,
                s = this.collection,
                w = j.ns("config"),
                y = m.extend({}, this.dropOptions, {
                    accept: function n(z) {
                        return v.accept(z, this)
                    },
                    activate: function u(A, z) {
                        v.trigger("drop:activate", s.get(z.helper.data("id")), z, this)
                    },
                    deactivate: function x(A, z) {
                        v.trigger("drop:deactivate", s.get(z.helper.data("id")), z, this)
                    },
                    over: function o(A, z) {
                        v.trigger("drop:over", s.get(z.helper.data("id")), z, this)
                    },
                    out: function q(A, z) {
                        v.trigger("drop:out", s.get(z.helper.data("id")), z, this)
                    },
                    drop: function p(A, z) {
                        v.trigger("drop", s.get(z.helper.data("id")), z, this)
                    }
                }),
                r = this.$(this.options.drop);
            if (w.isScaled && y.cursorAt) {
                y.cursorAt.left = y.cursorAt.left * w.scale;
                y.cursorAt.top = y.cursorAt.top * w.scale
            }
            r.droppable("destroy").droppable(y);
            return this
        },
        accept: function g(o) {
            var p, n;
            if (!p) {
                p = o.find("[item-id]").attr("item-id")
            }
            n = this.collection.get(p);
            return (n instanceof this.collection.model)
        }
    })
}(this));
(function(j) {
    if (!j.APP && (typeof require !== "undefined")) {
        j.APP = require("../common/app")
    }
    var l = j.APP,
        h = l.$,
        o = l._,
        m = l.View.prototype;
    l.View.Overlay = l.View.extend({
        name: "overlay-view",
        initialize: function f() {
            this.bind("show", this._onShow, this);
            this.bind("hide", this._onHide, this)
        },
        destroy: function n() {},
        _onShow: function d() {
            this.dim();
            this.align()
        },
        _onHide: function c() {
            this.undim()
        },
        detach: function b() {
            this.undim();
            return m.detach.apply(this, arguments)
        },
        dim: function a() {
            if (!this.el.parentNode) {
                return this
            }
            var s = this.$(this.getContainer()),
                r = s.offset(),
                q = {
                    width: s.width() || 1024,
                    height: s.height() || 768,
                    top: r.top,
                    left: r.left
                };
            if (s[0] === l.doc.body) {
                q.width = 1024;
                q.height = 768
            }
            if (!this.$cover) {
                this.$cover = h("<div />").css({
                    opacity: 0
                }).addClass("overlay-view-dimmer " + this.className);
                this.$cover.appendTo(s)
            }
            this.$cover.css(q).show().animate({
                opacity: 1
            }, 200);
            return this
        },
        undim: function e() {
            var q = this.$cover;
            if (q) {
                q.animate({
                    opacity: 0
                }, 200, function() {
                    q.remove()
                })
            }
            this.$cover = null;
            return this
        },
        align: function p() {
            var q = {
                left: (1024 / 2) - (this.$el.width() / 2),
                top: (768 / 2) - (this.$el.height() / 2)
            };
            this.$el.css(q);
            return this
        },
        show: function g() {
            this.$el.show();
            this.trigger("show", this);
            return this
        },
        hide: function i() {
            this.$el.hide();
            this.trigger("hide", this);
            return this
        },
        render: function k() {
            return this
        }
    })
}(this));
(function(f) {
    if (!f.APP && (typeof require !== "undefined")) {
        f.APP = require("../common/app")
    }
    var h = f.APP,
        b = h.$,
        j = h._,
        i = h.View.Overlay.prototype;
    h.View.Dialog = h.View.Overlay.extend({
        name: "dialog-view",
        events: {
            "click a.close": function(l) {
                l.preventDefault();
                this.sound("close");
                this.trigger("close", this, l)
            }
        },
        initialize: function k() {
            j.bindAll(this, "_onEscapeClose");
            i.initialize.apply(this, arguments);
            this.bind("button-left:click", function(l, m) {
                this.sound("click:button");
                this.trigger("button", this, m);
                this.trigger("button:left", this, m)
            }, this);
            this.bind("button-right:click", function(l, m) {
                this.sound("click:button");
                this.trigger("button", this, m);
                this.trigger("button:right", this, m)
            }, this)
        },
        destroy: function e() {
            i.destroy.apply(this, arguments);
            b(f).unbind("keyup", this._onEscapeClose);
            return this
        },
        _onEscapeClose: function c(l) {
            if (l.keyCode === 27 && this.$el.is(":visible")) {
                this.sound("close");
                this.trigger("close")
            }
        },
        align: function a() {
            var l = this.$el.outerHeight(),
                m = {
                    left: Math.round((1024 - this.$el.outerWidth()) / 2),
                    top: 100
                };
            if (l > 568) {
                m.top = Math.round((768 - l) / 2);
                if (m.top < 0) {
                    m.top = 0
                }
            }
            this.$el.css(m);
            return this
        },
        setRenderData: function d(l) {
            this.options.renderData = l;
            return this
        },
        render: function g() {
            var q = this.options.renderData || {},
                p = this.$("<div />").addClass("body"),
                n = this.$("<div />").addClass("body-inner").appendTo(p),
                m = this.$("<div />").addClass("buttons"),
                o = this.$("<h2 />").addClass("title"),
                l;
            if (typeof q === "string") {
                n.html(q).appendTo(this.el);
                p.appendTo(this.el)
            } else {
                if (typeof q === "object") {
                    if (q.close) {
                        this.el.appendChild(this.make("a", {
                            "class": "close",
                            href: "#close"
                        }));
                        b(f).unbind("keyup", this._onEscapeClose);
                        b(f).bind("keyup", this._onEscapeClose)
                    }
                    if (q.title) {
                        o.html(q.title).appendTo(this.el)
                    }
                    if (q.body) {
                        if (j.isArray(q.body)) {
                            j.forEach(q.body, function(r) {
                                if (r instanceof h.View) {
                                    n.append(r.el)
                                } else {
                                    n.append("<p>" + r + "</p>")
                                }
                            })
                        } else {
                            if (q.body instanceof h.View) {
                                n.append(q.body.el)
                            } else {
                                n.append(q.body)
                            }
                        }
                        p.appendTo(this.el)
                    }
                    if (q.buttonLeft || q.buttonRight) {
                        if (q.buttonLeft) {
                            if (typeof q.buttonLeft === "string") {
                                l = {
                                    attrs: {},
                                    text: q.buttonLeft
                                }
                            } else {
                                l = q.buttonLeft
                            }
                            l.container = m;
                            l.className = "left";
                            this.createView(h.View.Button, l, "button-left").render().attach();
                            l.attrs = j.extend({
                                "class": "button left",
                                href: "#button-left"
                            }, l.attrs)
                        }
                        if (q.buttonRight) {
                            if (typeof q.buttonRight === "string") {
                                l = {
                                    attrs: {},
                                    text: q.buttonRight
                                }
                            } else {
                                l = q.buttonRight
                            }
                            l.container = m;
                            l.className = "right";
                            this.createView(h.View.Button, l, "button-right").render().attach();
                            l.attrs = j.extend({
                                "class": "button right",
                                href: "#button-right"
                            }, l.attrs)
                        }
                        m.appendTo(this.el)
                    }
                }
            }
        }
    })
}(this));
(function(h) {
    if (!h.APP && (typeof require !== "undefined")) {
        h.APP = require("../common/app")
    }
    var e = h.APP,
        g = e.$,
        a = e._,
        c = e.View.prototype;
    e.View.LabelBox = e.View.extend({
        name: "labelbox-view",
        tagName: "div",
        destroy: function b() {},
        renderContent: function f(i) {
            if (a.isArray(i)) {
                a.forEach(i, this.renderContent, this);
                return this
            }
            var j = this.$("<div />");
            if (i instanceof e.View) {
                i.options.container = j;
                i.render().attach()
            } else {
                if (i instanceof g) {
                    i.appendTo(j)
                } else {
                    if (i) {
                        j.html(i)
                    }
                }
            }
            j.appendTo(this.el);
            return this
        },
        render: function d() {
            if (this.options.label) {
                this.el.appendChild(this.make("h3", null, this.options.label))
            }
            if (this.options.content) {
                this.renderContent(this.options.content)
            }
            return this
        }
    })
}(this));
(function(a) {
    a.View.Page = a.View.extend({
        _internalInitialize: function() {
            a.View.prototype._internalInitialize.apply(this, arguments);
            this.$el.addClass("page")
        }
    })
}(this.APP));
(function(b) {
    var a = b.View.prototype;
    b.View.Pane = b.View.extend({
        _internalInitialize: function() {
            a._internalInitialize.apply(this, arguments);
            this.$el.addClass("pane")
        }
    })
}(this.APP));
(function(i) {
    var e = i.$,
        j = i._;
    i.View.Tooltip = i.View.extend({
        name: "tooltip-view",
        tagName: "div",
        options: {
            pointer: true
        },
        initialize: function k() {
            j.bindAll(this);
            if (j.has(this.options, "html")) {
                this.setHtml(this.options.html)
            }
        },
        destroy: function f() {
            return this
        },
        align: function g(B) {
            B = e(B);
            var w = i.ns("config").scaleMod,
                n = (this.options.pointer ? 8 : 0),
                u = 20,
                p = B.offset(),
                m = B.outerWidth(),
                z = B.outerHeight(),
                o = (p.left * w) + (m / 2),
                v = (p.top * w) + z + n,
                A = this.$el.outerWidth(),
                y = A / 2,
                x = this.$el.outerHeight(),
                l = o + y,
                q = v + x,
                r = o + (A / 2),
                s = "top";
            if (o < (y + u)) {
                o = y + u
            } else {
                if (l > 1024) {
                    o = 1024 - y - u
                }
            }
            if (q > 663) {
                v = (p.top * w) - x - n;
                s = "bottom"
            }
            if (this.options.pointer) {
                e("<span />").addClass("tooltip-pointer").css({
                    left: r - o
                }).appendTo(this.el);
                this.$el.removeClass("pointer-top pointer-bottom").addClass("pointer-" + s)
            }
            this.$el.css({
                left: Math.round(o),
                top: Math.round(v)
            });
            return this
        },
        show: function b(l) {
            this.align(l);
            this.$el.show();
            this.trigger("show", this);
            return this
        },
        hide: function a() {
            this.$el.hide();
            this.trigger("hide", this);
            return this
        },
        setHtml: function(l) {
            this.html = l;
            return this
        },
        renderHTMLAndShow: function h(l, m) {
            this.setHtml(l);
            return this.renderAndShow(m)
        },
        renderAndShow: function d(l) {
            return this.render().show(l)
        },
        render: function c() {
            if (this.html) {
                this.$el.html(this.html)
            }
        }
    })
}(this.APP));
(function(k) {
    var n = k.APP,
        o = n.View.prototype,
        p = n._,
        g = n.$;
    n.View.Table = n.View.extend({
        name: "table-view",
        tagName: "table",
        options: {
            orderByKey: null,
            orderByDirection: null,
            headers: [],
            view: n.View.TableRow
        },
        events: {
            "click th.headerSort": function(y) {
                y.preventDefault();
                var v = n.$(y.currentTarget),
                    u, w = p.pluck(this.options.headers, "key"),
                    s, r = w.length,
                    x;
                for (s = 0; s < r; s += 1) {
                    if (v.hasClass(w[s])) {
                        u = w[s];
                        break
                    }
                }
                if (u) {
                    if (v.hasClass("headerSortDesc")) {
                        x = "asc"
                    } else {
                        if (v.hasClass("headerSortAsc")) {
                            x = "desc"
                        }
                    }
                    this.orderBy(u, x)
                }
            }
        },
        initialize: function j() {
            this.selected = null;
            this.resetCollection()
        },
        destroy: function d() {},
        resetCollection: function m() {
            this.currentCollection = this.collection;
            return this
        },
        orderBy: function q(r, s) {
            s = (s || "").toLowerCase();
            if (r) {
                this.options.orderByKey = r
            }
            if (s) {
                this.options.orderByDirection = s
            }
            this.$ths.removeClass("headerSortAsc headerSortDesc");
            if (this.options.orderByKey) {
                this.$ths.filter("." + this.options.orderByKey).addClass(this.options.orderByDirection === "asc" ? "headerSortAsc" : "headerSortDesc")
            }
            this.renderBody();
            return this
        },
        sortByIterator: function f(r) {
            var s = r.get(this.options.orderByKey);
            if (typeof s === "string") {
                return s.toLowerCase()
            }
            return s
        },
        filterBy: function c(r) {
            r = r || {};
            var s = this.collection.filterBy(r);
            this.renderBody(s);
            return this
        },
        renderHead: function e() {
            var u = this.make("thead"),
                s = this.make("tr"),
                r = p.map(this.options.headers, function(z) {
                    var w = z.label,
                        v = z.attrs || {},
                        x = z.key,
                        y;
                    if (w) {
                        w = n.sidis.trans(w)
                    }
                    if (x) {
                        if (!v.hasOwnProperty("class")) {
                            v["class"] = ""
                        }
                        v["class"] += " " + x
                    }
                    y = this.make("th", v, w);
                    s.appendChild(y);
                    return y
                }, this);
            u.appendChild(s);
            this.el.appendChild(u);
            this.$ths = n.$(r);
            return this
        },
        select: function b(r) {
            r = this.currentCollection.get(r);
            if (r && this.selected !== r.id) {
                this.selected = r.id;
                this.trigger("select", r)
            }
            if (this.selected) {
                r = this.currentCollection.get(this.selected);
                var s = this.currentCollection.indexOf(r);
                this.$trs.removeClass("selected");
                if (s !== -1) {
                    this.$trs.eq(s).addClass("selected")
                }
            }
            return this
        },
        renderLimitIterator: function i() {
            return false
        },
        renderPendingRow: function a(w, r) {
            this.trigger("renderpending:before");
            var s = this.make("tr", {
                    "class": "pending-indicator"
                }),
                u = (r - w),
                v = u + " / " + r;
            if (this.options.pendingText) {
                v = this.trans(this.options.pendingText, {
                    "%current%": u,
                    "%total%": r
                })
            }
            s.appendChild(this.make("td", {
                colspan: this.options.headers.length
            }, v));
            this.$tbody.append(s);
            this.trigger("renderpending");
            this.trigger("renderpending:after");
            return this
        },
        renderBody: function h(x) {
            this.destroyViews();
            this.$tbody.empty();
            if (x) {
                this.currentCollection = x
            }
            var v = p.isString(this.options.view) ? n.View[this.options.view] : this.options.view,
                r = this.options.orderByKey ? this.currentCollection.sortBy(this.sortByIterator, this) : this.currentCollection.toJSON(),
                w = 0,
                s = r.length,
                u;
            if (this.options.orderByDirection === "desc") {
                r.reverse()
            }
            this.currentCollection.reset(r, {
                silent: true
            });
            if (this.options.pending) {
                w = this.currentCollection.filter(this.renderLimitIterator, true).length
            }
            this.currentCollection.any(function(z, A) {
                var y = this.createView(v, {
                    index: A,
                    container: this.$tbody,
                    model: z,
                    keys: p.pluck(this.options.headers, "key")
                });
                y.render();
                if (this.selected && this.selected === z.id) {
                    y.$el.addClass("selected")
                }
                if (w !== 0) {
                    return this.options.limit && this.options.limit <= (A + 1)
                }
                return false
            }, this);
            this.$trs = g(p.pluck(this._views, "el")).appendTo(this.$tbody);
            if (w !== 0 && s > this.options.limit) {
                this.renderPendingRow(w, s)
            }
            return this
        },
        render: function l() {
            this.renderHead();
            this.$tbody = g("<tbody>");
            this.$tbody.appendTo(this.el);
            this.orderBy()
        }
    })
}(this));
(function(e) {
    var d = e.View.prototype,
        a = e._;
    e.View.TableRow = e.View.extend({
        name: "table-row-view",
        tagName: "tr",
        initialize: function c() {
            this.model.bind("change", this.render, this)
        },
        destroy: function g() {
            this.model.unbind("change", this.render, this);
            return this
        },
        renderCell: function b(h, i) {
            if (arguments.length === 1) {
                i = this.model.get(h)
            }
            var j = this.make("td", {
                "class": h
            }, i);
            this.el.appendChild(j);
            return j
        },
        render: function f() {
            this.$el.empty();
            var j, h = this.options.keys.length;
            for (j = 0; j < h; j += 1) {
                this.renderCell(this.options.keys[j])
            }
            return this
        }
    })
}(this.APP));
(function(e) {
    if (!e.APP && (typeof require !== "undefined")) {
        e.APP = require("../common/app")
    }
    var g = e.APP,
        b = g.$,
        i = g._,
        h = g.View.prototype;
    g.View.Tabs = g.View.extend({
        name: "tabs-view",
        tagName: "div",
        events: {
            "click a": function(k) {
                k.preventDefault();
                var j = this.$items.index(k.currentTarget);
                this.sound("click");
                this.select(j)
            },
            "mouseenter a": function(l) {
                var j = this.$items.index(l.currentTarget),
                    k = this.options.tabs[j];
                this.sound("hover");
                this.trigger("enter", this, k, l)
            },
            "mouseleave a": function(l) {
                var j = this.$items.index(l.currentTarget),
                    k = this.options.tabs[j];
                this.trigger("leave", this, k, l)
            }
        },
        destroy: function f() {},
        select: function c(m, j) {
            j = j || {};
            var l = parseInt(m, 10),
                k;
            if (i.isNaN(l) && typeof m === "string") {
                l = i.indexOf(i.map(this.options.tabs, function n(o) {
                    if (typeof o === "string") {
                        return o.toLowerCase()
                    }
                    return o.text.toLowerCase()
                }), m.toLowerCase())
            } else {
                if (typeof m === "function") {
                    l = i.indexOf(i.values(this.options.tabs), i.find(this.options.tabs, m))
                }
            }
            if (!l || l === -1) {
                l = 0
            }
            k = this.$items.eq(l);
            this.$items.removeClass("active");
            k.addClass("active");
            if (!j.silent) {
                this.trigger("select", l, this.options.tabs[l], k)
            }
            return this
        },
        getSelected: function a() {
            var k = this.$items.filter(".active"),
                j = this.$items.index(k);
            return this.options.tabs[j]
        },
        render: function d() {
            var j = i.map(this.options.tabs || [], function k(n) {
                if (typeof n === "string") {
                    n = {
                        attrs: {},
                        text: n
                    }
                }
                if (!n.hasOwnProperty("attrs")) {
                    n.attrs = {}
                }
                if (!n.attrs.hasOwnProperty("href")) {
                    n.attrs.href = "#" + n.text
                }
                var l = this.make("a", n.attrs),
                    m = this.make("span", null, n.text);
                l.appendChild(m);
                return l
            }, this);
            this.$items = b(j).appendTo(this.el);
            this.$el.disableTextSelect();
            return this
        }
    })
}(this));
(function(a) {
    var g = a.APP,
        e = g.doc,
        b = function b(n, o, m) {
            if (n.addEventListener) {
                n.addEventListener("load", o, false);
                n.addEventListener("error", m, false)
            } else {
                if (n.attachEvent) {
                    n.attachEvent("onload", o);
                    n.attachEvent("onerror", m)
                } else {
                    n.onreadystatechange = function() {
                        var p = n.readyState;
                        if (p === "loaded" || p === "complete") {
                            o()
                        }
                    }
                }
            }
        },
        k = function k(n, o, m) {
            if (n.removeEventListener) {
                n.removeEventListener("load", o, false);
                n.removeEventListener("error", m, false)
            } else {
                if (n.detachEvent) {
                    n.detachEvent("onload", o);
                    n.detachEvent("onerror", m)
                } else {
                    n.onreadystatechange = null
                }
            }
        },
        f = function f(o, n) {
            return function m() {
                if (o) {
                    o.apply(this, arguments)
                }
            }
        },
        l = function l(n, m) {
            return function o() {
                if (n) {
                    n.apply(this, arguments)
                }
            }
        },
        j = function j(n, r, q) {
            var m = r.length,
                p, s = [],
                o = function o(v, u) {
                    o.i += 1;
                    if (v) {
                        o.i = m + 1;
                        q(v, r)
                    } else {
                        if (o.i === m) {
                            q(null, r)
                        }
                    }
                };
            o.i = 0;
            for (p = 0; p < m; p += 1) {
                n(r[p], o)
            }
        },
        d = 10 * 60 * 1000;
    g.createLoadable = function i(o, q, n) {
        var p = e.createElement(o),
            r, m;
        r = f(function r() {
            k(p, r, m);
            p.parentNode.removeChild(p);
            p = null;
            q(null, n)
        }, "onload");
        m = l(function m() {
            k(p, r, m);
            if (p.parentNode) {
                p.parentNode.removeChild(p);
                p = null
            }
            q(new Error("Error loading: " + n), n)
        }, "onerror");
        b(p, r, m);
        return p
    };
    g.preload = function c(n, p, m) {
        if (n instanceof Array) {
            return j(g.preload, n, p, m)
        }
        var r, o = g.createLoadable("object", function(s) {
            clearTimeout(r);
            p(s, n)
        }, n);
        m = m || d;
        o.data = n;
        o.type = "text/plain";
        o.width = 1;
        o.height = 1;
        o.style.visibility = "hidden";
        o.style.position = "absolute";
        o.style.top = "-1000px";
        o.style.left = "-1000px";
        r = setTimeout(l(function q() {
            clearTimeout(r);
            if (o.parentNode) {
                o.parentNode.removeChild(o);
                o = null
            }
            p(new Error("Timeout (" + d + "ms) loading object: " + n), n)
        }, "timeout"), m);
        e.body.appendChild(o)
    };
    g.preload.image = function h(s, p, n) {
        if (s instanceof Array) {
            return j(g.preload.image, s, p, n)
        }
        var m = new Image(),
            u;
        n = n || d;
        m.src = s;
        if (m.complete) {
            setTimeout(f(function r() {
                p(null, s, {
                    width: m.width,
                    height: m.height
                });
                m = null
            }, "complete"), 0)
        } else {
            m.onload = f(function o() {
                clearTimeout(u);
                if (m.parentNode) {
                    m.parentNode.removeChild(m)
                }
                p(null, s, {
                    width: m.width,
                    height: m.height
                });
                m = null
            }, "onload");
            m.onerror = l(l(function q() {
                clearTimeout(u);
                if (m.parentNode) {
                    m.parentNode.removeChild(m)
                }
                p(new Error("Error loading image: " + s), s);
                m = null
            }, "onerror"));
            u = setTimeout(l(function r() {
                clearTimeout(u);
                if (m.parentNode) {
                    m.parentNode.removeChild(m)
                }
                p(new Error("Timeout (" + d + "ms) image: " + s), s);
                m = null
            }, "timeout"), n)
        }
    }
}(this));
(function(a) {
    a.progressCircle = function b(j, i, e) {
        e = e || {};
        if (typeof e === "number") {
            e = {
                lineWidth: e,
                ms: 0
            }
        }
        i = parseFloat(i);
        i = Math.round(i * 100) || 1;
        var d = document.createElement("canvas"),
            r = d.getContext("2d"),
            l, k, f, n, s, v = new Image(),
            h = 0,
            o, p = 1,
            u = 0,
            c = 30,
            m = function(E) {
                var z = document.createElement("canvas"),
                    F = z.getContext("2d"),
                    C, w, D, x, y, B, A;
                z.width = d.width;
                z.height = d.height;
                F.clearRect(0, 0, z.width, z.height);
                C = (s * (E / 100)) + n;
                F.arc(l, k, f, n, C, false);
                F.lineWidth = e.lineWidth || 10;
                F.strokeStyle = "black";
                F.stroke();
                D = F.getImageData(0, 0, z.width, z.height).data;
                r.clearRect(0, 0, d.width, d.height);
                r.drawImage(v, Math.floor((d.width - v.width) / 2), Math.floor((d.height - v.height) / 2));
                w = r.getImageData(0, 0, d.width, d.height);
                x = w.data;
                for (A = 0, B = x.length; A < B; A += 4) {
                    x[A + 3] = D[A + 3]
                }
                r.putImageData(w, 0, 0)
            },
            q = function() {
                h = Math.floor(h + p);
                if (h < i) {
                    m(h);
                    setTimeout(q, u)
                } else {
                    m(i);
                    if (e.fn) {
                        e.fn(null, d)
                    }
                }
            },
            g = function() {
                d.width = (e.width || v.width);
                d.height = (e.height || v.height);
                l = e.centerX || e.center || (d.width / 2);
                k = e.centerY || e.center || (d.height / 2);
                f = e.radius || (l - (e.lineWidth / 2));
                n = e.rewind || -(Math.PI / 2);
                s = (Math.PI * 2);
                q()
            };
        v.src = j;
        if (e.duration === 0) {
            p = i
        } else {
            o = c / (1000 / e.duration);
            p = i / o;
            if (p < 1) {
                p = 1
            }
            u = Math.round(e.duration / o)
        }
        v.onload = g;
        v.onerror = function() {
            if (e.fn) {
                e.fn(new Error("Unable to load image: " + j), d)
            }
        };
        return d
    }
}(this));
(function(f) {
    var i = f.APP,
        h = i.doc,
        a = function a() {
            var j = Array.prototype.slice.call(arguments, 0),
                k = j.shift();
            setTimeout(function l() {
                k.apply(this, j)
            }, 0)
        },
        g = 2000;
    i.imageCompose = function c(r, k, u, s) {
        var m = h.createElement("canvas"),
            l = m.getContext("2d"),
            p = 0,
            q = r.length,
            n = function n() {
                var z, v, A, w;
                p += 1;
                if (p === q) {
                    r.reverse();
                    for (z = 0; z < q; z += 1) {
                        v = r[z][1];
                        A = r[z][2];
                        w = r[z][3];
                        l.drawImage(w, r[z][1], r[z][2], w.width, w.height)
                    }
                    s(null, m, l)
                }
            },
            j = function j(C, v, E) {
                var z = new Image(),
                    D;
                z.src = C;
                if (z.complete) {
                    a(n)
                } else {
                    z.onload = function w() {
                        clearTimeout(D);
                        z.onload = z.onerror = null;
                        n()
                    };
                    z.onerror = function B() {
                        clearTimeout(D);
                        z.onload = z.onerror = null;
                        s(new Error("Error loading image: " + C))
                    };
                    D = setTimeout(function A() {
                        z.onload = z.onerror = null;
                        s(new Error("Timeout loading image: " + C))
                    }, g)
                }
                return z
            },
            o;
        m.width = k;
        m.height = u;
        if (q === 0) {
            s(null, m, l)
        } else {
            for (o = 0; o < q; o += 1) {
                r[o].push(j(r[o][0]))
            }
        }
    };

    function e(l, k, j) {
        setTimeout(function() {
            var m = l.length,
                n;
            for (n = 0; n < m; n += 4) {
                if (l[n + 3] > 220 || (l[n] !== l[n + 1] && l[n + 1] !== l[n + 2])) {
                    l[n] = l[n + 1] = l[n + 2] = k
                } else {
                    l[n + 3] = 0
                }
            }
            j()
        }, 0)
    }

    function d(n, l, j, m, k) {
        setTimeout(function() {
            var q = function q(A) {
                    var B = l[A + 3];
                    if (B < 220) {
                        n[A] = n[A + 1] = n[A + 2] = m;
                        n[A + 3] = Math.round(B * 0.65)
                    }
                },
                z = n.length,
                p, u, w, r, y, o, s, x, v;
            for (v = 0, x = n.length; v < x; v += 4) {
                p = Math.floor(v / j) * j;
                u = p + j;
                w = v + 4;
                r = v - 4;
                y = v - j;
                o = v + j;
                s = l[v + 3];
                if (s > 220) {
                    if (w <= u) {
                        q(w)
                    }
                    if (r >= p) {
                        q(r)
                    }
                    if (y >= 0) {
                        q(y)
                    }
                    if (o < z) {
                        q(o)
                    }
                }
            }
            k()
        }, 0)
    }
    i.imageCompose.silhouette = function b(k, o, n) {
        o = o || 25;
        var m = k.getContext("2d"),
            q = m.getImageData(0, 0, k.width, k.height),
            p = q.data,
            l = Array.prototype.slice.call(p, 0);
        a(e, p, o, function j() {
            a(d, p, l, (k.width * 4), o, function r() {
                m.putImageData(q, 0, 0);
                n(k)
            })
        })
    }
}(this));
(function createAbilityModel(e) {
    if (!e.APP && (typeof require !== "undefined")) {
        e.APP = require("../common/app")
    }
    var d = e.APP,
        c = d.Model.prototype,
        b = d._;
    d.Model.Ability = d.Model.extend({
        defaults: {
            kit: null,
            level: 0,
            maxlevel: 0,
            name: null,
            state: null,
            tier: 0,
            dependency: null,
            available: null,
            progress: 0,
            passive: true
        },
        schema: {
            passive: "boolean",
            level: "number",
            maxlevel: "number",
            tier: "number"
        },
        initialize: function f() {
            if (this.has("dependency")) {
                setTimeout(b.bind(function() {
                    if (this.collection) {
                        var g = this.get("dependency"),
                            h = this.collection.by("name", g);
                        if (h.length === 1) {
                            this.set({
                                dependencyId: h.at(0).id
                            }, {
                                silent: true
                            })
                        }
                    }
                }, this), 0)
            }
            this._setProgress();
            this.bind("change:level", this._setProgress, this)
        },
        _setProgress: function a() {
            this.set({
                progress: this.get("level") / this.get("maxlevel")
            })
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = d.Model.Ability
    }
}(this));
(function(g) {
    if (!g.APP && (typeof require !== "undefined")) {
        g.APP = require("../common/app")
    }
    if (!g.APP.Model && (typeof require !== "undefined")) {
        g.APP.Collection = require("../common/collection")
    }
    if (!g.APP.Model.Ability && (typeof require !== "undefined")) {
        g.APP.Model.Ability = require("./model.ability")
    }
    var e = g.APP,
        d = e._,
        f = e.$;
    e.Collection.Abilities = e.Collection.extend({
        model: e.Model.Ability,
        comparator: function c(h) {
            var i = h.get("tier");
            if (h.get("type") === "combat") {
                i += 10
            }
            return i
        },
        getByName: function a(h) {
            h = h.toLowerCase();
            return this.get(function(i) {
                return i.get("name").toLowerCase() === h
            })
        },
        getByType: function b(j, h) {
            h = h || {};
            var i = {
                    type: j
                },
                k;
            if (h.level) {
                i.level = function(l) {
                    return l >= h.level
                }
            }
            return this.filterBy(i).orderBy("tier")
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = e.Collection.Abilities
    }
}(this));
APP.domTask("abilities", function initAbilities(b) {
    var e = APP.$,
        c = APP._,
        a = APP.namespace("abilities"),
        d = a.$el = e("div.main.main_abilities"),
        f = a.collection = new APP.Collection.Abilities(),
        g = function g() {
            var k = [],
                l = ["equipment", "combat"],
                h = d.find("div.content"),
                j = e("div.passive_abilities div"),
                m = [],
                i = function i() {
                    var s = e(this),
                        r = s.parents("div.tier"),
                        p = l[h.index(s.parents("div.content"))],
                        u = s.attr("abilityid"),
                        q = {
                            id: u,
                            type: p,
                            name: s.attr("name"),
                            level: s.attr("level"),
                            maxlevel: s.attr("maxlevel"),
                            tier: (r.attr("class").match(/tier([0-9])/) || []).pop(),
                            description: s.attr("description"),
                            available: s.attr("available"),
                            dependency: s.attr("dependency"),
                            passive: false,
                            usecount: 0
                        },
                        o = f.get(q.id);
                    if (a.passiveAbilities[u]) {
                        q.passive = true;
                        q.usecount = a.passiveAbilities[u]
                    }
                    if (o) {
                        o.set(q)
                    } else {
                        m.push(q)
                    }
                },
                n = d.find("span.item-ability");
            n.each(i);
            if (m.length !== 0) {
                f.add(m)
            }
        };
    f.bind("refresh", g);
    g();
    b()
});
APP.task("abilities.routes", ["abilities"], function taskAbilitiesRoutes(a) {
    var g = APP.win,
        e = APP.$,
        c = APP._;
    APP.bind("page:abilities", function b(i, h) {
        if (i !== "abilities") {
            g.dontUpdateDoll = true;
            g.hideDoll()
        }
        if (h && h.id) {
            c.defer(function() {
                var j = e("div.main_abilities a.ability.abilityid_" + h.id);
                j.one("webkitAnimationEnd", function() {
                    j.removeClass("focus")
                });
                j.addClass("focus")
            })
        }
    });
    APP.route("abilities", "abilities", function f() {
        APP.page("abilities")
    });
    APP.route(/^abilities\/([\d]+)$/, "abilities-id", function d(h) {
        APP.page("abilities", {
            id: h
        })
    });
    a()
});
(function(a) {
    var d = a.APP,
        b = d._,
        e = d.$,
        g = d.ns("appearance"),
        f = d.ns("config"),
        c = d.View.DnD.prototype;
    d.View.Appearance = d.View.DnD.extend({
        name: "appearance-view filter-all",
        events: {
            "click a.reset-position": function(h) {
                h.preventDefault();
                h.stopImmediatePropagation();
                this.sound("click");
                this.$el.removeClass("store inventory")
            },
            "click div.separator": function(h) {
                h.preventDefault();
                this.sound("click");
                if (this.$el.hasClass("inventory")) {
                    this.openStore()
                } else {
                    this.openInventory()
                }
            }
        },
        initialize: function() {
            this.options.viewOptions = this.options.viewOptions || {
                size: "med",
                equipped: this.options.equipped
            };
            this._storeFilter = b.extend({
                buyable: true
            }, this.options.filter || {});
            this._inventoryFilter = b.extend({
                owned: true
            }, this.options.filter || {});
            this._categories = b.compact(b.unique(this.collection.filterBy(this.options.filter).pluck("category").concat(["all"])));
            this.bind("store:item:buy inventory:item:buy", this._onItemBuy, this);
            this.bind("store:item:click inventory:item:click", this._onItemClick, this);
            this.bind("store:item:render inventory:item:render", this._onItemRender, this);
            this.bind("store:item:buy:enter inventory:item:buy:enter", this._onItemBuyEnter, this);
            this.bind("store:item:buy:leave inventory:item:buy:leave", this._onItemBuyLeave, this);
            this.bind("store:item:exclaim:enter inventory:item:exclaim:enter", this._onItemExclaimEnter, this);
            this.bind("store:item:exclaim:leave inventory:item:exclaim:leave", this._onItemExclaimLeave, this);
            this.bind("store:item:enter inventory:item:enter", this._onItemEnter, this);
            this.bind("store:item:leave inventory:item:leave", this._onItemLeave, this);
            this.bind("store:drag:start inventory:drag:start", this._onItemDragStart, this);
            this.bind("store:drag:stop inventory:drag:stop", this._onItemDragStop, this);
            this.bind("store:drag:revert inventory:drag:revert", this._onItemDragRevert, this);
            this.bind("store:render inventory:render", this._onListRender, this);
            this.bind("store:remove inventory:remove store:append inventory:append", this._checkEmpty, this);
            this.bind("store:item:click:req inventory:item:click:req", this._onReqClick, this)
        },
        _onItemBuy: function(h, i) {
            this.trigger("buy", this, i)
        },
        _onItemClick: function(h, i, j) {
            this.trigger("item:click", this, i, j.currentTarget)
        },
        _onReqClick: function(h, i, j) {
            this.trigger("item:click:req", this, i, j.currentTarget)
        },
        _onItemDragStart: function(h, i) {
            this._$dragHelper = i.helper;
            this._$dragHelper.addClass("start");
            this._currentHighlight = h;
            this.trigger("list:drag:start", this, h, i)
        },
        _onItemDragStop: function(h, i) {
            this._$dragHelper = null;
            this.trigger("list:drag:stop", this, h, i)
        },
        _onItemDragRevert: function(h, i) {
            if (this._$dragHelper) {
                this._$dragHelper.removeClass("start")
            }
            this.trigger("list:drag:revert", this)
        },
        _onItemRender: function(h) {
            this.trigger("item:render", this, h)
        },
        _onItemEnter: function(h, i, j) {
            this.trigger("item:enter", this, i, j)
        },
        _onItemLeave: function(h, i, j) {
            this.trigger("item:leave", this, i, j)
        },
        _onItemBuyEnter: function(h, i, j) {
            this.trigger("item:buy:enter", this, i, j)
        },
        _onItemBuyLeave: function(h, i, j) {
            this.trigger("item:buy:leave", this, i, j)
        },
        _onItemExclaimEnter: function(h, i, j) {
            this.trigger("item:exclaim:enter", this, i, j)
        },
        _onItemExclaimLeave: function(h, i, j) {
            this.trigger("item:exclaim:leave", this, i, j)
        },
        _onListRender: function(h) {
            this.trigger("list:render", this, h)
        },
        _checkEmpty: function() {
            var i = b.clone(this._storeFilter),
                h = b.clone(this._inventoryFilter);
            if (this._currentFilter && this._currentFilter.category) {
                i.category = h.category = this._currentFilter.category
            }
            if (this._store && this.collection.filterBy(i).length === 0) {
                this._store.$el.addClass("empty")
            } else {
                if (this._store) {
                    this._store.$el.removeClass("empty")
                }
            }
            if (this._inventory && this.collection.filterBy(h).length === 0) {
                this._inventory.$el.addClass("empty")
            } else {
                if (this._inventory) {
                    this._inventory.$el.removeClass("empty")
                }
            }
        },
        openStore: function() {
            this._currentState = "store";
            this.$el.addClass("store");
            this.$el.removeClass("inventory");
            return this
        },
        openInventory: function() {
            this._currentState = "inventory";
            this.$el.addClass("inventory");
            this.$el.removeClass("store");
            return this
        },
        highlight: function(i, h) {
            if (this._currentHighlight !== i) {
                if (this._currentHighlight) {
                    this.$el.removeClass(this._currentHighlight.get("category"))
                }
                if (i) {
                    this.$el.addClass(i.get("category"))
                }
            }
            this._currentHighlight = i;
            if (!h || !h.silent) {
                this.trigger("highlight", this, this._currentHighlight)
            }
            return this
        },
        filter: function(j, i) {
            if (b.isEqual(this._currentFilter, j) && (!i || !i.force)) {
                return this
            }
            this._currentFilter = j;
            var k, h;
            if (this._currentFilter && this._currentFilter.category) {
                h = "filter-" + this._currentFilter.category;
                k = this.trans("WEB_GAME_APPAREL_SEPARATOR_MY_" + this._currentFilter.category.toUpperCase())
            } else {
                h = "filter-all";
                k = this.trans("WEB_GAME_APPAREL_SEPARATOR_MY_ALL")
            }
            this.el.className = this.el.className.replace(/filter\-[^\s]+/, h);
            this._separatorText.innerHTML = k;
            this._checkEmpty();
            if (!i || !i.silent) {
                this.trigger("filter", this, this._currentFilter)
            }
            return this
        },
        getGridSize: function(h) {
            return this.options.viewOptions.size
        },
        setGridSize: function(h) {
            this.options.viewOptions.size = h;
            return this
        },
        scrollTo: function(h) {
            if (this._currentState === "store") {
                this._store.scrollTo(h)
            } else {
                if (this._currentState === "inventory") {
                    this._inventory.scrollTo(h)
                }
            }
        },
        getItems: function() {
            var h = e([]).add(this._store.$items).add(this._inventory.$items);
            return h
        },
        getViewsByModel: function(i) {
            var h = [];
            b.forEach(this._store._views, function(j) {
                if (j.model === i) {
                    h.push(j)
                }
            });
            b.forEach(this._inventory._views, function(j) {
                if (j.model === i) {
                    h.push(j)
                }
            });
            return h
        },
        getItemsByModel: function(h) {
            var k = e([]),
                i = this._store.getElementByModel(h),
                j = this._inventory.getElementByModel(h);
            if (i) {
                k = k.add(i)
            }
            if (j) {
                k = k.add(j)
            }
            return k
        },
        render: function() {
            var l = this.make("div", {
                    "class": "text"
                }),
                i = this._separatorText = this.make("span", {
                    "class": "text-inventory"
                }),
                m = this.make("span", {
                    "class": "text-store"
                }, this.trans("WEB_GAME_APPAREL_SEPARATOR_STORE")),
                j = this.make("span", {
                    "class": "drag"
                }),
                h = this.getGridSize(),
                k;
            this.$bar = e(this.make("div", {
                "class": "separator"
            }));
            l.appendChild(m);
            l.appendChild(i);
            this.$bar.append(l);
            this.$bar.append(this.make("a", {
                href: "#reset-position",
                "class": "reset-position"
            }));
            this.filter(this._currentFilter, {
                force: true
            });
            this.$el.addClass("grid-" + h);
            k = this.make("div", {
                "class": "feature-help"
            });
            k.appendChild(this.make("span", {
                "class": "label"
            }, this.trans("WEB_STORE_COMMON_NEW")));
            k.appendChild(this.make("span", {
                "class": "text"
            }, this.trans("WEB_GAME_FEATURE_HELP_INSERTS")));
            k.appendChild(this.make("a", {
                target: "_blank",
                href: f.insertsForumUrl
            }, this.trans("WEB_GAME_FEATURE_HELP_INSERTS_LINK")));
            this.el.appendChild(k);
            this._store = this.createView(d.View.ItemList, {
                collection: this.collection,
                viewClass: this.options.viewClass,
                className: "selectable-list store",
                viewOptions: this.options.viewOptions,
                dragOptions: {
                    cursorAt: this.options.cursorAt[h],
                    containment: this.options.containment[h],
                    cancel: "li.locked"
                },
                filter: this._storeFilter,
                drag: "li." + d.View.ItemList.ITEM_CLASS_NAME + ":not(.empty-msg)"
            }, "store").render().attach();
            this.$el.append(this.$bar);
            this._inventory = this.createView(d.View.ItemList, {
                collection: this.collection,
                viewClass: this.options.viewClass,
                className: "selectable-list inventory",
                viewOptions: this.options.viewOptions,
                dragOptions: {
                    cursorAt: this.options.cursorAt[h],
                    containment: this.options.containment[h]
                },
                filter: this._inventoryFilter,
                drag: "li." + d.View.ItemList.ITEM_CLASS_NAME + ":not(.empty-msg)"
            }, "inventory").render().attach();
            b.forEach(this._categories, function(n) {
                if (!n) {
                    n = "other"
                }
                this._store.el.appendChild(this.make("li", {
                    "class": "empty-msg " + n
                }, this.trans("WEB_GAME_EMPTY_MESSAGE_STORE_" + n.toUpperCase())));
                this._inventory.el.appendChild(this.make("li", {
                    "class": "empty-msg " + n
                }, this.trans("WEB_GAME_EMPTY_MESSAGE_INVENTORY_" + n.toUpperCase())))
            }, this)
        }
    })
}(this));
(function(h) {
    var j = h.APP,
        c = j.$,
        l = j._,
        e = j.win,
        o = j.namespace("config"),
        i = j.namespace("appearance"),
        k = j.View.prototype;
    j.View.AppearanceItem = j.View.extend({
        name: "appearance-item-view",
        options: {
            size: "med",
            showName: true,
            showIcons: true,
            showAdditional: true,
            showLock: true,
            live: true
        },
        events: {
            "mouseenter span.exclaim": function(p) {
                this.sound("hover");
                this.trigger("exclaim:enter", this, this.model, p)
            },
            "mouseleave span.exclaim": function(p) {
                this.trigger("exclaim:leave", this, this.model, p)
            },
            "mouseenter a.buy, a.lock, a.unlock": function(p) {
                this.sound("hover");
                this.trigger("buy:enter", this, this.model, p)
            },
            "mouseleave a.buy, a.lock, a.unlock": function(p) {
                this.trigger("buy:leave", this, this.model, p)
            },
            mouseenter: function(p) {
                this.sound("hover");
                this.trigger("enter", this, this.model, p)
            },
            mouseleave: function(p) {
                this.trigger("leave", this, this.model, p)
            },
            "click a.buy, a.unlock": function(p) {
                p.preventDefault();
                p.stopImmediatePropagation();
                this.trigger("buy", this, this.model, p)
            },
            "mousedown a.buy, a.unlock": function(p) {
                p.stopImmediatePropagation()
            },
            click: function(p) {
                p.preventDefault();
                this.sound("click");
                this.trigger("click", this, this.model, p)
            }
        },
        initialize: function() {
            this.model.bind("change", this._onChange, this);
            this.model.bind("change:upgrades", this._onChangeUpgrades, this);
            var p = this.model.get("category");
            this.collection = this.model.collection;
            this.pocketModel = this.collection.get(function(q) {
                return (q.isItemType("pocket") && q.get("category") === p)
            });
            this.collection.bind("purchase:start", this._onPurchaseStart, this);
            this.collection.bind("purchase:end", this._onPurchaseEnd, this);
            this._bindInvalidDependency(this.model.get("upgrades"))
        },
        destroy: function() {
            this.model.unbind("change", this.render, this);
            this.model.unbind("change:upgrades", this._onChangeUpgrades, this);
            this.collection.unbind("purchase:start", this._onPurchaseStart, this);
            this.collection.unbind("purchase:end", this._onPurchaseEnd, this);
            this._unbindInvalidDependency(this.model.get("upgrades"))
        },
        _onPurchaseStart: function b(p) {
            p = this.collection.get(p);
            if (p && (p.id === this.model.id || l.indexOf(l.values(this.model.get("upgrades") || {}), p.id) !== -1)) {
                this.$el.addClass("loading")
            }
        },
        _onPurchaseEnd: function d(p) {
            p = this.collection.get(p);
            if (p && (p.id === this.model.id || l.indexOf(l.values(this.model.get("upgrades") || {}), p.id) !== -1)) {
                this.render()
            }
        },
        _onChange: function a() {
            var p = ["upgrades", "expired", "owned"],
                q = l.some(p, function(s) {
                    return this.model.hasChanged(s)
                }, this),
                r = this.model.hasChanged("equippedSlot");
            if (this.model.hasChanged("equippedSlot")) {
                r = (!l.isNumber(this.model.previous("equippedSlot")) || !this.model.isEquipped())
            }
            if (q || r) {
                this.render()
            }
        },
        _unbindInvalidDependency: function g(p) {
            l.forEach(p || {}, function(q) {
                q = this.collection.get(q);
                if (q) {
                    q.unbind("change:invalidDependency", this.render, this)
                }
            }, this)
        },
        _bindInvalidDependency: function n(p) {
            l.forEach(p || {}, function(q) {
                q = this.collection.get(q);
                if (q) {
                    q.bind("change:invalidDependency", this.render, this)
                }
            }, this)
        },
        _onChangeUpgrades: function() {
            this._unbindInvalidDependency(this.model.previous("upgrades"));
            this._bindInvalidDependency(this.model.get("upgrades"))
        },
        dragHelper: function(s) {
            if ((!this.model.isOwned() && this.model.isLocked()) || this.model.hasInvalidDependencies()) {
                return c(this.make("span"))
            }
            var r, p = this.options.size,
                q = this.make("div", {
                    "class": "appearance-draghelper size-" + p
                });
            r = this.make("span", {
                "class": "item item-drag game-item item-min item-min-" + this.model.id
            });
            q.appendChild(r);
            return c(q)
        },
        renderLock: function f() {
            var v = j.ns("config"),
                u = this.model.get("lockType"),
                w = this.model.get("lockCriteria"),
                r = this.make("div", {
                    "class": "lock " + u
                }),
                s = v.imageFolder + "game/item-lock-progress.png",
                q = this.model.get("lockProgress"),
                p;
            r.appendChild(this.make("span", {
                "class": "key"
            }, w));
            if (this.options.size === "med") {
                p = e.progressCircle(s, q, {
                    width: 56,
                    height: 56,
                    lineWidth: 8,
                    duration: 500
                })
            } else {
                if (this.options.size === "min") {
                    p = e.progressCircle(s, q, {
                        width: 32,
                        height: 32,
                        lineWidth: 5,
                        duration: 500
                    })
                }
            }
            r.appendChild(p);
            this.el.appendChild(r);
            return this
        },
        render: function m() {
            var q = this.$('<div class="bar" />'),
                p = this.model.get("usecount");
            this.$el.attr("item-id", this.model.id);
            this.$el.addClass(this.model.get("category") + " " + this.model.get("validationGroup"));
            if (this.model.isEquipped()) {
                this.$el.addClass("equipped")
            }
            if (this.options.showIcons) {
                if (this.model.isRented()) {
                    this.$el.addClass("rented");
                    q.append('<span class="exclaim timer">?</span>')
                } else {
                    if (this.model.isExpired()) {
                        this.$el.addClass("expired");
                        q.append('<span class="exclaim">!</span>')
                    } else {
                        if (this.model.hasInvalidCustomizations()) {
                            this.$el.addClass("invalid");
                            q.append('<span class="exclaim">!</span>')
                        }
                    }
                }
                if (this.model.isLocked()) {
                    if (!this.model.isOwned()) {
                        this.$el.addClass("locked");
                        if (this.options.showLock) {
                            this.renderLock()
                        }
                    }
                    if (this.model.get("offers").hasUnlockOffers()) {
                        this.$el.append('<a href="#unlock" class="icon unlock" />')
                    } else {
                        this.$el.append('<a href="#lock" class="icon lock" />')
                    }
                } else {
                    if (this.model.isBuyable()) {
                        this.$el.append('<a href="#buy" class="icon buy" />')
                    } else {
                        if (this.model.isTrainable()) {
                            this.$el.append('<a href="#train" class="icon train" />')
                        }
                    }
                }
            }
            if (this.options.showName) {
                if (this.options.size !== "min") {
                    q.append('<span class="name">' + this.model.get("name") + "</span>");
                    q.append('<span class="category">' + this.model.get("categoryname") + "</span>")
                }
                q.appendTo(this.el)
            }
            if (this.options.size === "med") {
                this.image = this.el.appendChild(this.make("img", {
                    src: this.model.getImage("med"),
                    width: 285,
                    height: 128,
                    "class": "item-med item-med-" + this.model.id,
                    "item-id": this.model.id
                }));
                if (this.model.isLocked()) {
                    this.image.ondragstart = function() {
                        return false
                    }
                }
            } else {
                if (this.options.size === "min") {
                    this.el.appendChild(this.make("span", {
                        "class": "item-min item-min-" + this.model.id,
                        "item-id": this.model.id
                    }))
                }
            }
            this.createView(j.View.AppearanceSlots, {
                model: this.model
            }).render().attach()
        }
    })
}(this));
(function(b) {
    var d = b.APP,
        a = d.$,
        f = d._,
        g = d.namespace("config"),
        e = d.View.prototype;
    d.View.AppearanceSlots = d.View.extend({
        name: "appearance-slots-view",
        initialize: function i() {
            if (!this.collection && this.model.collection) {
                this.collection = this.model.collection
            }
            var j = this.model.get("category");
            this.pocketModel = this.collection.get(function(k) {
                return (k.isItemType("pocket") && k.get("category") === j)
            })
        },
        destroy: function h() {},
        render: function c() {
            return this
        }
    })
}(this));
(function(j) {
    var m = j.APP,
        g = m.$,
        n = m._,
        i = m.win,
        l = m.doc,
        h = m.namespace("boosters"),
        o = m.namespace("config"),
        k = m.namespace("appearance");
    m.View.UpgradeItem = m.View.extend({
        name: "upgrade-item-view",
        options: {
            size: "med",
            showName: true,
            showIcons: true,
            showAdditional: true,
            showLock: true,
            live: true
        },
        events: {
            "mouseenter span.exclaim": function(p) {
                this.sound("hover");
                this.trigger("exclaim:enter", this, this.model, p)
            },
            "mouseleave span.exclaim": function(p) {
                this.trigger("exclaim:leave", this, this.model, p)
            },
            "mouseenter a.buy, a.lock, a.unlock": function(p) {
                this.sound("hover");
                this.trigger("buy:enter", this, this.model, p)
            },
            "mouseleave a.buy, a.lock, a.unlock": function(p) {
                this.trigger("buy:leave", this, this.model, p)
            },
            mouseenter: function(p) {
                this.sound("hover");
                this.trigger("enter", this, this.model, p)
            },
            mouseleave: function(p) {
                this.trigger("leave", this, this.model, p)
            },
            "click a.buy, a.unlock": function(p) {
                p.preventDefault();
                p.stopImmediatePropagation();
                if (!this._disabled) {
                    this.sound("click");
                    this.trigger("buy", this, this.model, p)
                }
            },
            "click div.req > div, div.req p": function(p) {
                p.preventDefault();
                this.trigger("click:req", this, this.model, p)
            },
            "mousedown a.buy, a.unlock": function(p) {
                p.stopImmediatePropagation()
            },
            "click div.item-info": function() {
                this.toggleStatsDescription()
            }
        },
        initialize: function() {
            this.model.bind("change", this._onChange, this);
            this.equipped = this.options.equipped;
            this.equipped.bind("add", this._onEquippedAddRemove, this);
            this.equipped.bind("remove", this._onEquippedAddRemove, this);
            this.collection = this.model.collection;
            this.collection.bind("purchase:start", this._onPurchaseStart, this);
            this.collection.bind("purchase:end", this._onPurchaseEnd, this)
        },
        destroy: function() {
            this.model.unbind("change", this.render, this);
            this.equipped.unbind("add", this._onEquippedAddRemove, this);
            this.equipped.unbind("remove", this._onEquippedAddRemove, this);
            this.collection.unbind("purchase:start", this._onPurchaseStart, this);
            this.collection.unbind("purchase:end", this._onPurchaseEnd, this)
        },
        _onPurchaseStart: function b(p) {
            p = this.collection.get(p);
            if (p && (p.id === this.model.id || n.indexOf(n.values(this.model.get("upgrades") || {}), p.id) !== -1)) {
                this.$el.addClass("loading")
            }
        },
        _onPurchaseEnd: function d(p) {
            p = this.collection.get(p);
            if (p && (p.id === this.model.id || n.indexOf(n.values(this.model.get("upgrades") || {}), p.id) !== -1)) {
                k.currentList._inventory.$el.removeClass("empty");
                this.render()
            }
        },
        _onChange: function f() {
            var p = ["expired", "owned", "equippedSlot"],
                q = n.some(p, function(s) {
                    return this.model.hasChanged(s)
                }, this),
                r = this.model.hasChanged("equippedSlot");
            if (this.model.hasChanged("equippedSlot")) {
                r = (!n.isNumber(this.model.previous("equippedSlot")) || !this.model.isEquipped())
            }
            if (q || r) {
                this.render()
            }
        },
        _onEquippedAddRemove: function c(p) {
            if (p.get("category") === this.model.get("category")) {
                this.render()
            }
        },
        toggleStatsDescription: function() {
            if (this.$info.hasClass("description")) {
                this.showStats()
            } else {
                this.showDescription()
            }
            return this
        },
        showStats: function() {
            this._statsDescription = "stats";
            this.$info.removeClass("description");
            return this
        },
        showDescription: function() {
            this._statsDescription = "desc";
            this.$info.addClass("description");
            return this
        },
        dragHelper: function(r) {
            if ((!this.model.isOwned() && this.model.isLocked()) || this.model.hasInvalidDependencies()) {
                return g(this.make("span"))
            }
            var q = this.make("span", {
                    "class": "item item-drag game-item item-upgrade-min item-upgrade-min-" + this.model.id
                }),
                p = this.make("div", {
                    "class": "upgrade-draghelper size-" + this.options.size
                });
            p.appendChild(q);
            return g(p)
        },
        renderLock: function a(p) {
            var v = this.model.get("lockType"),
                w = this.model.get("lockCriteria"),
                s = this.make("div", {
                    "class": "lock " + v
                }),
                u = o.imageFolder + "game/item-lock-progress.png",
                r = this.model.get("lockProgress"),
                q = i.progressCircle(u, r, {
                    width: 32,
                    height: 32,
                    lineWidth: 5,
                    duration: 500
                });
            s.appendChild(this.make("span", {
                "class": "key"
            }, w));
            s.appendChild(q);
            if (p) {
                p.appendChild(s);
                return this
            } else {
                this.el.appendChild(s)
            }
            return this
        },
        render: function e() {
            var s = this.$('<div class="bar" />'),
                v = this.make("div", {
                    "class": "upgrade-container"
                }),
                u = this.make("div", {
                    "class": "item-info"
                }),
                w = l.createDocumentFragment(),
                B = this.model.get("offers").getLowestOffers(),
                y = this.make("div", {
                    "class": "prices"
                }),
                r = this.model.hasInvalidDependencies(),
                E, C, A, z, p = this.model.get("offers").hasUnlockOffers(),
                x, q = this.model.get("category"),
                D = n.indexOf(this.equipped.filterBy({
                    isOwnedPermanent: true
                }).pluck("category"), q) !== -1;
            this.$el.attr("item-id", this.model.id);
            this.$el.addClass(this.model.get("category") + " " + this.model.get("validationGroup"));
            if (this.model.isEquipped()) {
                this.$el.addClass("equipped")
            }
            if (this.options.showIcons) {
                if (this.model.isRented()) {
                    this.$el.addClass("rented");
                    s.append('<span class="exclaim timer">?</span>')
                } else {
                    if (this.model.isExpired()) {
                        this.$el.addClass("expired");
                        s.append('<span class="exclaim">!</span>')
                    }
                }
                if (this.model.isOwnedPermanent()) {
                    this.$el.addClass("owned")
                }
                if (!r || this.options.size === "med") {
                    if (this.model.isLocked()) {
                        if (!this.model.isOwned()) {
                            this.$el.addClass("locked");
                            if (this.options.showLock) {
                                this.renderLock(v)
                            }
                        }
                        if (this.options.size === "med") {
                            if (p) {
                                this.$el.append('<a href="#unlock" class="icon unlock' + (r ? " disabled" : "") + '" />')
                            } else {
                                this.$el.append('<a href="#lock" class="icon lock' + (r ? " disabled" : "") + '" />')
                            }
                        }
                    } else {
                        if (this.model.isBuyable()) {
                            this.$el.append('<a href="#buy" class="icon buy' + (r ? " disabled" : "") + '" />')
                        } else {
                            if (this.model.isTrainable()) {
                                this.$el.append('<a href="#train" class="icon train" />')
                            }
                        }
                    }
                }
            }
            if (this.options.showName) {
                if (this.options.size !== "min") {
                    s.append('<span class="name">' + this.model.get("name") + "</span>");
                    s.append('<span class="category">' + this.model.get("categoryname") + "</span>")
                }
                s.appendTo(this.el)
            }
            if (this.options.size !== "min") {
                this.createView(m.View.StatsList, {
                    container: u,
                    model: this.model
                }).render().attach();
                u.appendChild(this.make("p", {
                    "class": "description"
                }, this.model.get("description")));
                this.$info = this.$(u);
                this.el.appendChild(u);
                if ((!this.model.isLocked() || p) && !this.model.isOwnedPermanent()) {
                    if (B.credits) {
                        y.appendChild(this.make("span", {
                            "class": "currency credits"
                        }, B.credits.get("price")))
                    }
                    if (B.funds) {
                        y.appendChild(this.make("span", {
                            "class": "currency funds"
                        }, B.funds.get("price")))
                    }
                    w.appendChild(y);
                    this.createView(m.View.LabelBox, {
                        label: this.trans("WEB_GAME_WEAPONS_INFO_PRICE_FROM"),
                        content: w,
                        className: "purchase",
                        container: this.el
                    }).render().attach()
                }
            }
            if (r || !D) {
                E = this.make("div", {
                    "class": "req"
                });
                x = this.model.getDependencies();
                if (x.gear && x.gear.isOwned()) {
                    C = this.make("div", {
                        "class": "gear"
                    });
                    C.appendChild(this.make("img", {
                        src: h.list.collection.get(x.gear.id).getImage("min"),
                        width: 80,
                        height: 60,
                        "class": "game-item item-min item-min-" + x.gear.id,
                        "item-id": x.gear.id
                    }));
                    if (this.options.size !== "min") {
                        C.appendChild(this.make("h3", null, this.trans("WEB_GAME_UPGRADES_REQ_BOOSTER_INTERFERENCE")));
                        C.appendChild(this.make("span", {
                            "class": "name"
                        }, x.gear.get("name")));
                        C.appendChild(this.make("span", {
                            "class": "expires"
                        }, x.gear.get("expiredate")))
                    }
                    C.getElementsByTagName("img")[0].ondragstart = function() {
                        return false
                    };
                    E.appendChild(C)
                } else {
                    if (x.ability && x.ability.get("level") === 0) {
                        A = this.make("div", {
                            "class": "ability"
                        });
                        z = this.make("a", {
                            "class": "ability"
                        });
                        z.appendChild(this.make("span", {
                            "class": "item-ability item-ability-" + x.ability.id
                        }));
                        A.appendChild(z);
                        if (this.options.size !== "min") {
                            A.appendChild(this.make("h3", null, this.trans("WEB_GAME_UPGRADES_REQ_TRAINING_REQUIRED")));
                            A.appendChild(this.make("span", {
                                "class": "name"
                            }, x.ability.get("name")))
                        }
                        E.appendChild(A)
                    } else {
                        if (!D) {
                            E.appendChild(this.make("div", {
                                "class": "equipped-category"
                            }, "Equip an <span>" + q + "</span> apparel item to use"))
                        }
                    }
                }
                this.el.className += " disabled";
                this.el.appendChild(E)
            }
            v.appendChild(this.el.appendChild(this.make("span", {
                "class": "item-upgrade-med item-upgrade-med-" + this.model.id,
                "item-id": this.model.id
            })));
            this.el.appendChild(v)
        }
    })
}(this));
(function(q) {
    var j = q.APP,
        v = j._,
        c = j.$,
        h = j.View.DnD.prototype;
    j.View.Pockets = j.View.DnD.extend({
        name: "pockets-view",
        options: v.extend({}, h.options, {
            drag: "li",
            drop: "li"
        }),
        dragOptions: {
            revert: false,
            cursorAt: {
                left: 20,
                top: 20
            }
        },
        dropOptions: v.extend({}, h.dropOptions, {
            greedy: true
        }),
        events: {
            "mouseenter ul": function(w) {
                this.trigger("enter", this, this.model, w)
            },
            "mouseleave ul": function(w) {
                this.trigger("leave", this, this.model, w)
            },
            "mouseenter li": function(z) {
                var x = this.$pockets.index(z.currentTarget),
                    y = this.model.getCustomizations(),
                    w = y[x];
                this.sound("hover");
                this.trigger("pocket:enter", this, w, z, x)
            },
            "mouseleave li": function(z) {
                var x = this.$pockets.index(z.currentTarget),
                    y = this.model.getCustomizations(),
                    w = y[x];
                this.trigger("pocket:leave", this, w, z, x)
            },
            "mouseenter a.icon": function(w) {
                if (this.model.isOwnedPermanent()) {
                    this.sound("hover")
                }
            },
            "click a.icon.buy": function(y) {
                y.preventDefault();
                y.stopImmediatePropagation();
                if (this.model.isOwnedPermanent()) {
                    var x = this.$pockets.index(y.currentTarget.parentNode),
                        w = this.pocketModel.get("offers").filterBy({
                            pocket: x
                        });
                    this.sound("click");
                    this.trigger("pocket:buy", this, x, w)
                }
            },
            "click a.icon.unlock": function(y) {
                y.preventDefault();
                y.stopImmediatePropagation();
                if (this.model.isOwnedPermanent()) {
                    var x = this.$pockets.index(y.currentTarget.parentNode),
                        w = this.pocketModel.get("offers").filterBy({
                            pocket: x
                        });
                    this.sound("click");
                    this.trigger("pocket:unlock", this, x, w)
                }
            },
            "click a.icon.redeem": function(x) {
                x.preventDefault();
                x.stopImmediatePropagation();
                if (this.model.isOwnedPermanent()) {
                    var w = this.$pockets.index(x.currentTarget.parentNode);
                    this.sound("click");
                    this.trigger("pocket:redeem", this, w)
                }
            },
            mousedown: function(w) {
                w.stopImmediatePropagation()
            },
            "click li": function(w) {
                this.trigger("pocket:click", this, this.model, w)
            },
            "click li, h3": function(w) {
                w.stopImmediatePropagation()
            }
        },
        initialize: function p() {
            var w = this.model.get("category");
            this.collection = this.model.collection;
            this.pocketModel = this.options.pocketModel;
            this.bind("drag:start", this._onDragStart, this);
            this.bind("drag:stop", this._onDragStop, this);
            this.bind("drop", this._onDrop, this);
            this.model.bind("change", this._onChange, this);
            this.model.bind("change:upgrades", this._onChangeUpgrades, this);
            this.model.bind("attach:start", this._onAttachStart, this);
            this.model.bind("attach:end", this._onAttachEnd, this);
            this.collection.bind("purchase:start", this._onPurchaseStart, this);
            this.collection.bind("purchase:end", this._onPurchaseEnd, this);
            this._bindInvalidDependency(this.model.get("upgrades"))
        },
        destroy: function n() {
            this.model.unbind("change", this._onChange, this);
            this.model.unbind("change:upgrades", this._onChangeUpgrades, this);
            this.model.unbind("attach:start", this._onAttachStart, this);
            this.model.unbind("attach:end", this._onAttachEnd, this);
            this.collection.unbind("purchase:start", this._onPurchaseStart, this);
            this.collection.unbind("purchase:end", this._onPurchaseEnd, this);
            this._unbindInvalidDependency(this.model.get("upgrades"))
        },
        _onDragStart: function u(w, y, x) {
            if (w) {
                c(x).addClass("dragging");
                this.sound("equip")
            }
        },
        _onDragStop: function i(A, E, F) {
            if (A) {
                c(F).removeClass("dragging");
                var B = this.$(F),
                    x = B.offset(),
                    y = E.helper.offset(),
                    D = y.top + (E.helper.height() / 2),
                    w = y.left + (E.helper.width() / 2),
                    z = D < x.top || D > (x.top + B.height()) || w < x.left || w > (x.left + B.width()),
                    C;
                if (z) {
                    C = v.clone(this.model.get("upgrades"));
                    v.forEach(C, function(H, G) {
                        if (A.id === H) {
                            C[G] = null
                        }
                    });
                    this.model.set("upgrades", C)
                }
                this.sound("unequip")
            }
        },
        _onDrop: function k(w, A, x) {
            var z = this.$("li").index(x),
                B = v.clone(this.model.get("upgrades")),
                y;
            if (v.has(B, z)) {
                y = v.indexOf(v.values(B), w.id);
                if (y !== -1) {
                    B[y] = B[z] || null
                }
                B[z] = w.id;
                v.defer(function(C) {
                    C.model.set("upgrades", B);
                    C.trigger("pocket:enter", C, w, {
                        currentTarget: C.$("li").get(z)
                    }, z)
                }, this);
                this.sound("unequip")
            }
        },
        _onChange: function l() {
            this.render()
        },
        _unbindInvalidDependency: function b(w) {
            v.forEach(w || {}, function(x) {
                x = this.collection.get(x);
                if (x) {
                    x.unbind("change:invalidDependency", this.render, this)
                }
            }, this)
        },
        _bindInvalidDependency: function g(w) {
            v.forEach(w || {}, function(x) {
                x = this.collection.get(x);
                if (x) {
                    x.bind("change:invalidDependency", this.render, this)
                }
            }, this)
        },
        _onChangeUpgrades: function() {
            this._unbindInvalidDependency(this.model.previous("upgrades"));
            this._bindInvalidDependency(this.model.get("upgrades"))
        },
        _onAttachStart: function e() {
            this.$el.addClass("loading")
        },
        _onAttachEnd: function a() {
            this.$el.removeClass("loading")
        },
        _onPurchaseStart: function f(w) {
            w = this.collection.get(w);
            if (w && (w.id === this.model.id || v.indexOf(v.values(this.model.get("upgrades") || []), w.id) !== -1)) {
                this.$el.addClass("loading")
            }
        },
        _onPurchaseEnd: function m(w) {
            w = this.collection.get(w);
            if (w && (w.id === this.model.id || v.indexOf(v.values(this.model.get("upgrades") || []), w.id) !== -1)) {
                this.render()
            }
        },
        _renderPockets: function s() {
            var A = this.make("ul", {
                    "class": "pockets"
                }),
                z = this.model.get("numberOfPockets"),
                y = this.model.get("maxNumPockets"),
                C = this.model.getCustomizations(),
                D = (this.pocketModel && this.pocketModel.get("unlockLevels")) || {},
                B = (this.pocketModel && this.pocketModel.get("pocketOffers")) || 0,
                x = (this.pocketModel && this.pocketModel.get("personaLevel")) || {},
                w = (this.pocketModel && this.pocketModel.get("usecount")) || 0;
            v.forEach(C, function(K, G) {
                G = parseInt(G, 10);
                var E = this.make("li"),
                    I, H = z > G,
                    L = x < D[G],
                    F = B[G],
                    J;
                if (H) {
                    if (K) {
                        E.appendChild(this.make("span", {
                            "class": "item-upgrade-min item-upgrade-min-" + K.id,
                            "item-id": K.id
                        }));
                        if (!K.isAllowedInGame()) {
                            I = "invalid"
                        } else {
                            I = "full"
                        }
                    } else {
                        I = "empty"
                    }
                } else {
                    if (w > 0 && G === z) {
                        I = "redeemable";
                        E.appendChild(this.make("a", {
                            "class": "icon redeem"
                        }))
                    } else {
                        if (L) {
                            if (F && F.hasUnlockOffers()) {
                                I = "unlockable";
                                E.appendChild(this.make("a", {
                                    "class": "icon unlock"
                                }))
                            } else {
                                I = "locked"
                            }
                        } else {
                            if (F && F.length !== 0) {
                                I = "buyable";
                                E.appendChild(this.make("a", {
                                    "class": "icon buy"
                                }))
                            }
                        }
                    }
                }
                E.appendChild(this.make("span", {
                    "class": "inner"
                }));
                if (I) {
                    E.className = I
                }
                A.appendChild(E)
            }, this);
            this.el.appendChild(A)
        },
        dragHelper: function o(y) {
            var x = this.$(y.currentTarget).find("span.item-upgrade-min"),
                w;
            if (x.size() === 0) {
                return this.make("span")
            }
            w = x.clone();
            w.addClass("item-drag");
            w.data("id", x.attr("item-id"));
            w.appendTo(j.doc.body);
            return w
        },
        accept: function r(A, w) {
            if (!this.model.isOwnedPermanent()) {
                return false
            }
            var B = A.attr("item-id") || A.find("span.item-upgrade-min").attr("item-id") || A.data("id"),
                y = this.$("li").index(w),
                x = this.model.get("numberOfPockets") > y,
                z = this.collection.get(B);
            return x && z && z.isItemType("upgrade") && z.get("category") === this.model.get("category")
        },
        render: function d() {
            var w = this.model.get("maxNumPockets"),
                x;
            this.$el.attr("item-id", this.model.id);
            if (this.model.isOwnedPermanent()) {
                this.$el.addClass("permanent")
            } else {
                if (!this.model.isOwned()) {
                    this.$el.addClass("invalid")
                } else {
                    if (this.model.isRented()) {
                        this.$el.addClass("rented")
                    }
                }
            }
            this.el.appendChild(this.make("h3", null, this.model.get("categoryname") + "<br />" + this.trans("WEB_GAME_HEADING_POCKETS")));
            this._renderPockets();
            this.$pockets = this.$("li");
            this.el.appendChild(this.make("span", {
                className: "line line-connect"
            }));
            for (x = 0; x < w; x += 1) {
                this.el.appendChild(this.make("span", {
                    className: "line line-" + x
                }))
            }
        }
    })
}(this));
(function(e) {
    var f = e.APP,
        d = f.$,
        h = f._,
        i = f.namespace("config"),
        g = f.View.Tooltip.prototype;
    f.View.PocketTooltip = f.View.Tooltip.extend({
        className: "pocket-tooltip",
        renderModelAndShow: function c(k, l, j) {
            return this.renderModel(k, j).show(l)
        },
        renderModel: function b(k, j) {
            this.model = k;
            return this.render(j)
        },
        render: function a(z) {
            var k = this.model.get("category"),
                n = this.model.collection.get(function(A) {
                    return (A.isItemType("pocket") && A.get("category") === k)
                }),
                o = this.model.get("numberOfPockets"),
                l = this.model.get("maxNumPockets"),
                y = z.pocket,
                s = ((n && n.get("unlockLevels")) || {})[y],
                q = (n && n.get("personaLevel")) || 0,
                w = (n && n.get("pocketOffers")) || {},
                v = (n && n.get("usecount")) || 0,
                r = o > y,
                j = q < s,
                x = w[y],
                u = v > 0 && y === o,
                m, p = [];
            if (!this.model.isOwnedPermanent()) {
                p.push("<p>" + this.trans("WEB_GAME_TOOLTIPS_POCKET_NOT_PERMANENT") + "</p>")
            } else {
                if (r) {
                    p.push("<p>" + this.trans("WEB_GAME_TOOLTIPS_DROP_UPGRADE") + "</p>")
                } else {
                    if (u) {
                        p.push("<p>" + this.trans("WEB_GAME_TOOLTIPS_ATTACH_POCKET") + "</p>")
                    } else {
                        if (!n) {
                            p.push("<p>" + this.trans("WEB_GAME_POCKET_LOCKED") + "</p>")
                        } else {
                            if (j) {
                                m = q / s;
                                p.push("<h3>" + this.trans("WEB_GAME_POCKET_LOCKED") + "</h3>");
                                p.push('<div class="lock-progress">');
                                p.push('<span class="bar" style="width: ' + Math.round(100 - (100 * m)) + '%;"></span>');
                                p.push('<span class="text">Level ' + s + "</span>");
                                p.push("</div>");
                                if (x && x.hasUnlockOffers()) {
                                    if (this.model.isOwnedPermanent()) {
                                        p.push("<h3>" + this.trans("WEB_GAME_PURCHASE_UNLOCK_OPTIONS") + "</h3>")
                                    }
                                    p.push('<dl class="prices">');
                                    x.filterBy({
                                        isUnlockOffer: true
                                    }).forEach(function(A) {
                                        p.push("<dt>" + A.get("limit") + "</dt>");
                                        p.push('<dd class="' + A.get("currency") + '">' + A.get("price") + "</dd>")
                                    });
                                    p.push("</dl>")
                                }
                            } else {
                                if (x && x.length !== 0) {
                                    p.push("<h3>" + this.trans("WEB_GAME_PURCHASE_OPTIONS") + "</h3>");
                                    p.push('<dl class="prices">');
                                    x.filterBy({
                                        isUnlockOffer: false
                                    }).forEach(function(A) {
                                        p.push("<dt>" + A.get("limit") + "</dt>");
                                        p.push('<dd class="' + A.get("currency") + '">' + A.get("price") + "</dd>")
                                    });
                                    p.push("</dl>")
                                }
                            }
                        }
                    }
                }
            }
            this.el.innerHTML = p.join("")
        }
    })
}(this));
APP.task("appearance", ["items", "store"], function taskAppearance(s) {
    var E = APP._,
        f = APP.$,
        e = APP.win,
        g = APP.namespace("appearance"),
        A = APP.namespace("items"),
        q = APP.namespace("store"),
        u = APP.namespace("game"),
        p = g.$el = f("<div>").addClass("main main_appearance page hidden loading").appendTo("#frontend"),
        h = g.$panelLeft = f("<div>").addClass("page-panel left").appendTo(p),
        B = g.$panelRight = f("<div>").addClass("page-panel right").appendTo(p),
        F = {},
        j = {},
        y, n = A.collection.hasItemType("upgrade"),
        o = g.mainTabs = [{
            text: APP.sidis.trans("WEB_GAME_APPEARANCE_TAB"),
            filter: "appearance"
        }],
        x = g.$menuBar = f("<div>").addClass("menu-bar"),
        D = g.categoriesSortOrder = ["all", "head", "face", "uniform", "accessory1", "accessory2"],
        b = E.sortBy(E.compact(E.unique(["all"].concat(A.collection.byType("appearance").pluck("category")))), function(G) {
            return E.indexOf(D, G)
        }),
        r = g.appearanceTabs = new APP.View.Tabs({
            container: x,
            className: "category-tabs",
            tabs: E.map(b, function(G) {
                return {
                    text: APP.sidis.trans("WEB_GAME_APPEARANCE_MENU_" + G.toUpperCase()),
                    filter: G
                }
            })
        }).render().select(0).attach(),
        d = E.sortBy(E.compact(E.unique(["all"].concat(A.collection.byType("upgrade").pluck("category")))), function(G) {
            return E.indexOf(D, G)
        }),
        a = g.upgradeTabs = new APP.View.Tabs({
            container: x,
            className: "category-tabs",
            tabs: E.map(d, function(G) {
                return {
                    text: APP.sidis.trans("WEB_GAME_APPEARANCE_MENU_" + G.toUpperCase()),
                    filter: G
                }
            })
        }).render().select(0),
        w = g.gridTabs = new APP.View.Tabs({
            container: x,
            className: "grid-toggle",
            tabs: [{
                text: "Min",
                size: "min"
            }, {
                text: "Med",
                size: "med"
            }]
        }).attach().render(),
        m = g.equipModel = function m(G) {
            if (!G || G.get("itemType") !== "appearance") {
                return
            }
            var H = G.get("category"),
                I = E.indexOf(["head", "face", "uniform", "accessory1", "accessory2"], H);
            G.set({
                equippedSlot: I
            })
        },
        v = ["head", "face", "uniform", "accessory1", "accessory1"],
        l = A.collection.getDefaults("appearance");
    if (n) {
        o.push({
            text: APP.sidis.trans("WEB_GAME_UPGRADES_TAB"),
            filter: "upgrades"
        })
    }
    o = g.mainTabs = new APP.View.Tabs({
        container: B,
        className: "main-tabs",
        tabs: o
    }).attach().render();
    x.appendTo(B);
    A.collection.bind("change:upgrades", function i(G) {
        u.giveItems();
        u.saveCustomizations(G)
    });
    g.doll = f("#soldierModel").droppable({
        accept: function(H) {
            var I = H.attr("item-id") || H.data("id") || H.find("div.icon").data("id"),
                G = A.collection.get(I);
            return G && G.isItemType("appearance")
        },
        drop: function k(I, H) {
            var G = A.collection.get(H.helper.data("id"));
            if (G && G.isItemType("appearance")) {
                m(G)
            }
        }
    });
    o.bind("select", function(G) {
        APP.navigate("appearance/" + ((G === 0) ? "apparel" : "upgrades"));
        y = G;
        var H = j.hasOwnProperty(y) ? j[y] : 1;
        if (y === 0) {
            a.detach();
            r.attach()
        } else {
            if (y === 1) {
                r.detach();
                a.attach()
            }
        }
        E.defer(function() {
            w.select(H)
        });
        o.$("a").renderText({
            hover: true
        })
    });
    r.bind("select", function(G) {
        APP.navigate("appearance/apparel/" + D[G]);
        r.$("a").renderText({
            hover: true
        })
    }).$("a").renderText({
        hover: true
    });
    a.bind("select", function(G) {
        APP.navigate("appearance/upgrades/" + D[G]);
        a.$("a").renderText({
            hover: true
        })
    }).$("a").renderText({
        hover: true
    });
    w.bind("select", function(G) {
        j[y] = G
    });
    A.bind("unequip:appearance", function z(G, H) {
        var I = G.get("category");
        if (E.has(l, I)) {
            E.defer(function() {
                var J = A.collection.bySlot("appearance", H);
                if (!J) {
                    m(l[I])
                }
            })
        } else {
            E.defer(dressDoll)
        }
    });
    E.forEach(l, function(J, I) {
        var H = E.indexOf(v, I),
            G;
        if (!J.isEquipped()) {
            G = A.collection.bySlot("appearance", H);
            if (!G) {
                m(l[I])
            }
        }
    });
    A.bind("equip:appearance", function z(G, H) {
        E.defer(dressDoll)
    });
    g.initialize(function C(G) {
        G()
    });
    g.once("initialized", function c() {
        g.$el.removeClass("loading")
    });
    o.select(0);
    return s()
});
APP.task("appearance.list", ["appearance", "abilities"], function taskAppearanceList(e) {
    var f = APP.$,
        m = APP._,
        l = APP.ns("appearance"),
        h = APP.ns("abilities"),
        i = APP.ns("items"),
        k = APP.ns("store"),
        n = {
            appearance: {
                min: {
                    left: 50,
                    top: 40
                },
                med: {
                    left: 103,
                    top: 84
                }
            },
            upgrade: {
                min: {
                    left: 68,
                    top: 65
                },
                med: {
                    left: 70,
                    top: 110
                }
            }
        },
        a = {
            appearance: {
                min: [-5, -10, 937, 695],
                med: [-60, -50, 882, 650]
            },
            upgrade: {
                min: [-46, -43, 935, 681],
                med: [-51, -87, 930, 637]
            }
        },
        j = l.equipped = i.collection.getEquipped("appearance"),
        d = function(u, s) {
            var o = new APP.View.Appearance({
                    container: l.$panelRight,
                    collection: i.collection,
                    equipped: j,
                    viewClass: s,
                    cursorAt: n[u],
                    containment: a[u],
                    filter: {
                        itemType: u
                    }
                }),
                q = function() {
                    i.tooltip.hide()
                };
            o.once("attach", function() {
                o.$("div.bar, span.key, div.labelbox-view h3, span.currency, div.req h3, li.empty-msg, .stats, div.equipped-category").renderText();
                o.$("span.text, div.text span, span.label").renderText(true);
                o.$("div.feature-help a").renderText({
                    hover: true
                })
            });
            o.bind("filter", function() {
                o.$("div.text span").renderText(true)
            });
            o.bind("render", function() {
                o.$("div.bar, span.key, div.labelbox-view h3, span.currency, div.req h3, li.empty-msg, .stats, div.equipped-category").renderText();
                o.$("span.text, div.text span, span.label").renderText(true);
                o.$("div.feature-help a").renderText({
                    hover: true
                })
            });
            o.bind("item:render", function(w, v) {
                v.$("div.bar, span.key, div.labelbox-view h3, span.currency, div.req h3, .stats, div.equipped-category").renderText()
            });
            if (u === "appearance") {
                o.bind("item:click", function(v, w) {
                    if ((w.isOwned() || !w.isLocked())) {
                        l.equipModel(w)
                    }
                })
            } else {
                if (u === "upgrade") {
                    o.bind("item:click:req", function r(v, w) {
                        var x = w.getDependencies();
                        if (x.gear && x.gear.isOwned()) {
                            APP.navigate("boosters/" + x.gear.id, true)
                        } else {
                            if (x.ability && x.ability.get("level") === 0) {
                                APP.navigate("abilities/" + x.ability.id, true)
                            } else {
                                APP.navigate("appearance/apparel/" + m.indexOf(l.categoriesSortOrder, w.get("category")), true)
                            }
                        }
                    })
                }
            }
            o.bind("buy", function p(v, w) {
                k.trigger("buy", w)
            });
            o.bind("list:drag:start", function(v, w) {
                i.tooltip.hide();
                v.unbind("item:leave", q)
            });
            o.bind("list:drag:stop", function() {
                o.bind("item:leave", q)
            });
            o.bind("item:buy:enter", function(v, w, x) {
                if (w && v.options.viewOptions.size === "med") {
                    i.tooltip.renderModelAndShow(w, x.currentTarget, {
                        offers: true
                    })
                }
            });
            o.bind("item:buy:leave", function(v) {
                if (v.options.viewOptions.size === "med") {
                    i.tooltip.hide()
                }
            });
            o.bind("item:exclaim:enter", function(v, w, x) {
                if (w && v.options.viewOptions.size === "med") {
                    i.tooltip.renderModelAndShow(w, x.currentTarget, {
                        time: true,
                        invalid: true
                    })
                }
            });
            o.bind("item:exclaim:leave", function(v) {
                if (v.options.viewOptions.size === "med") {
                    i.tooltip.hide()
                }
            });
            o.bind("item:enter", function(v, x, y) {
                var w = {
                    name: true,
                    stats: true,
                    offers: true,
                    time: true,
                    invalid: true
                };
                if (x && v.options.viewOptions.size === "min") {
                    if (u === "upgrade") {
                        w = {
                            name: true,
                            description: true,
                            dependencies: true,
                            stats: true
                        }
                    }
                    i.tooltip.renderModelAndShow(x, y.currentTarget, w)
                }
            });
            o.bind("item:leave", q);
            return o
        },
        c = l.apparelView = d("appearance", APP.View.AppearanceItem).render(),
        b = l.upgradeView = d("upgrade", APP.View.UpgradeItem).render(),
        g = l.currentList = c.attach();
    i.bind("unequip:appearance", function(o) {
        j.remove(o)
    });
    i.bind("equip:appearance", function(o) {
        j.add(o)
    });
    l.mainTabs.bind("select", function(o) {
        if (o === 1) {
            c.$el.hide();
            g = l.currentList = b
        } else {
            if (o === 0) {
                b.$el.hide();
                g = l.currentList = c
            }
        }
        g.attach().$el.show()
    });
    l.appearanceTabs.bind("select", function(o, q) {
        var p = {};
        if (q && q.filter !== "all") {
            p.category = q.filter
        }
        c.filter(p)
    });
    l.upgradeTabs.bind("select", function(o, q) {
        var p = {};
        if (q && q.filter !== "all") {
            p.category = q.filter
        }
        b.filter(p)
    });
    l.gridTabs.bind("select", function(o, p) {
        if (g.getGridSize() !== p.size) {
            g.setGridSize(p.size).render()
        }
    });
    return e()
});
APP.task("appearance.pockets", ["appearance", "appearance.list"], function taskAppearancePockets(k) {
    var r = APP._,
        d = APP.$,
        o = APP.ns("items"),
        e = APP.ns("appearance"),
        i = APP.ns("store"),
        g = APP.ns("config"),
        h = function(s, v, u) {
            s.trigger("attach:start");
            d.ajax({
                url: g.pockets.attachUrl.replace("ITEM_ID", s.id).replace("POCKET", v),
                type: "post",
                cache: false,
                dataType: "json",
                success: function(w) {
                    if (w && w.status === "success") {
                        s.trigger("attach:success")
                    } else {
                        s.trigger("attach:error")
                    }
                },
                error: function() {
                    s.trigger("attach:error")
                },
                complete: function() {
                    s.trigger("attach:end")
                }
            })
        },
        j = e.pocketTooltip = new APP.View.PocketTooltip().attach(),
        m = e.pocketViews = {},
        l = d("#soldierModel"),
        b = r.unique(o.collection.byType("upgrade").pluck("category")),
        a = function a(s) {
            return
        },
        f = "all",
        p = function(u) {
            var s = l.get(0);
            s.className = s.className.replace(/(highlight-[a-z0-9]+)/, "highlight-" + u)
        };
    j.bind("render", function n() {
        j.$("h3, dd, dt, span.text").renderText()
    });
    o.collection.bind("change:equippedSlot", a);
    e.upgradeView.bind("list:drag:start", function(s, u) {
        if (f === "all") {
            p(u.get("category"))
        }
    });
    e.upgradeView.bind("list:drag:stop", function(s, u) {
        if (f === "all") {
            p(f)
        }
    });
    e.upgradeTabs.bind("select", function(s, u) {
        f = u && u.filter;
        p(f)
    });
    l.addClass("highlight-" + f);
    APP.once("page:appearance", function c(u, s) {
        o.collection.getEquipped("appearance").forEach(a)
    });
    APP.bind("page", function q(u, s) {
        if (u === "appearance") {
            if (u !== s) {
                r.forEach(m, function(v) {
                    if (v) {
                        v.attach()
                    }
                })
            }
        } else {
            r.forEach(m, function(v) {
                if (v) {
                    v.detach()
                }
            })
        }
    });
    k()
});
APP.task("appearance.routes", ["appearance"], function taskAppearanceRoutes(d) {
    var h = APP.win,
        e = APP.$,
        k = APP._,
        g = APP.namespace("items"),
        j = APP.ns("appearance");
    APP.bind("page:appearance", function i(m, l) {
        if (m !== "appearance") {
            APP.ns("dock").change("appearance");
            h.dontUpdateDoll = false;
            h.showDoll();
            if (h.bundleOnDoll) {
                h.dressDoll()
            }
        }
        j.run(function() {
            var n;
            if (l.id) {
                n = g.collection.get(l.id);
                if (n.isItemType("appearance")) {
                    j.mainTabs.select(0);
                    j.appearanceTabs.select(0)
                } else {
                    j.mainTabs.select(1);
                    j.upgradeTabs.select(0)
                }
                k.defer(function() {
                    if (n.isOwned()) {
                        j.currentList.openInventory()
                    } else {
                        j.currentList.openStore()
                    }
                    j.currentList.scrollTo(n)
                })
            } else {
                if (l.tab) {
                    j.mainTabs.select(l.tab);
                    if (l.state) {
                        k.defer(function() {
                            if (l.state === "inventory") {
                                j.currentList.openInventory()
                            } else {
                                if (l.state === "store") {
                                    j.currentList.openStore()
                                } else {
                                    if (j.currentList === j.apparelView) {
                                        j.appearanceTabs.select(l.state)
                                    } else {
                                        if (j.currentList === j.upgradeView) {
                                            j.upgradeTabs.select(l.state)
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
            }
        })
    });
    APP.route("appearance", "appearance", function c() {
        APP.page("appearance")
    });
    APP.route("appearance/:tab", "appearance-tab", function a(l) {
        APP.page("appearance", {
            tab: l
        })
    });
    APP.route("appearance/:tab/:state", "appearance-tab", function f(l, m) {
        APP.page("appearance", {
            tab: l,
            state: m
        })
    });
    APP.route(/^appearance\/([\d]+)$/, "appearance-item", function b(n) {
        var m = g.collection.get(n),
            l;
        if (m) {
            l = "/appearance/" + m.id + "/" + m.get("name").toLowerCase().replace(/([\s])+/g, "-");
            APP.navigate(l);
            if (m.isType("appearance") || m.isType("upgrade")) {
                APP.page("appearance", {
                    id: n
                })
            }
        }
    });
    d()
});
(function(a) {
    var h = a.APP,
        c = h.$,
        l = h._,
        i = h.View.prototype;
    h.View.Booster = h.View.extend({
        name: "booster-view booster item",
        initialize: function g() {
            this.model.bind("change", this.render, this);
            this.model.bind("purchase:start", this._onPurchaseStart, this);
            this.model.bind("purchase:end", this._onPurchaseEnd, this);
            this.abilityModel = this.options.abilities.get(this.model.get("dependency"));
            if (this.abilityModel) {
                this.abilityModel.bind("change", this.render, this)
            }
            this.bind("buy:click", this._onBuyClick, this)
        },
        destroy: function f() {
            this.model.unbind("change", this.render, this);
            this.model.unbind("purchase:start", this._onPurchaseStart, this);
            this.model.unbind("purchase:end", this._onPurchaseEnd, this);
            if (this.abilityModel) {
                this.abilityModel.unbind("change", this.render, this)
            }
        },
        _onPurchaseStart: function b() {
            this.$el.addClass("loading")
        },
        _onPurchaseEnd: function k() {
            this.$el.removeClass("loading")
        },
        _onBuyClick: function e(m, n) {
            var o = this.model.get("dependency");
            if (!o || this.hasTrainedAbility(o)) {
                this.trigger("click:buy", this, this.model, n)
            }
        },
        hasTrainedAbility: function j() {
            var m = this.abilityModel.get("level");
            return m !== 0
        },
        render: function d() {
            this.$el.addClass(this.name + " " + this.className);
            this.$el.attr({
                "item-id": this.model.id
            });
            var v = this.make("a", {
                    "class": "ability"
                }),
                y = true,
                q = this.model.isAllowedInGame(),
                x = this.make("div", {
                    "class": "icon"
                }),
                p = this.make("div", {
                    "class": "item-info"
                }),
                r = this.make("div", {
                    "class": "prereq-info"
                }),
                m = this.make("div"),
                s = this.make("p", {
                    "class": "status"
                }),
                o, n, z = this.model.get("offers"),
                w, u = this.make("div", {
                    "class": "prices"
                });
            if (this.abilityModel && !this.hasTrainedAbility()) {
                y = false;
                v.appendChild(this.make("span", {
                    "class": "item-ability item-ability-" + this.abilityModel.id
                }));
                r.appendChild(v);
                m.appendChild(this.make("p", {
                    "class": "prereq"
                }, "Requirement:"));
                m.appendChild(this.make("h4", null, this.abilityModel.get("name")));
                r.appendChild(m);
                r.appendChild(this.make("span", {
                    "class": "mini-link"
                }, this.trans("WEB_GAME_BOOSTERS_GO_TO_TRAINING")));
                this.el.appendChild(r);
                this.$el.addClass("dependency")
            }
            if (q) {
                this.$el.addClass("active")
            }
            o = q ? this.trans("WEB_GAME_BOOSTERS_ACTIVE") : this.trans("WEB_GAME_BOOSTERS_INACTIVE");
            x.appendChild(this.make("img", {
                "class": "game-item",
                src: this.model.getImage("med"),
                "item-id": this.model.id
            }));
            this.el.appendChild(x);
            s.appendChild(this.make("span", {
                "class": "booster_status"
            }, o));
            if (this.model.get("expiredate") !== -1) {
                s.appendChild(this.make("span", {
                    "class": "expires"
                }, this.model.get("expiredate")))
            }
            p.appendChild(this.make("h2", null, this.model.get("name")));
            p.appendChild(s);
            p.appendChild(this.make("p", {
                "class": "booster_description"
            }, this.model.get("description")));
            if (z && z.length !== 0) {
                w = z.getLowestOffers();
                n = document.createDocumentFragment();
                if (w.credits) {
                    u.appendChild(this.make("span", {
                        "class": "currency credits"
                    }, w.credits.get("price")))
                }
                if (w.funds) {
                    u.appendChild(this.make("span", {
                        "class": "currency funds"
                    }, w.funds.get("price")))
                }
                n.appendChild(u);
                this.createView(h.View.Button, {
                    container: n,
                    className: "buy" + (y ? "" : " disabled"),
                    text: this.trans("WEB_STORE_COMMON_BUY_BTN"),
                    sound: true
                }, "buy").render().attach();
                this.createView(h.View.LabelBox, {
                    label: this.trans("WEB_GAME_WEAPONS_INFO_PRICE_FROM"),
                    content: n,
                    className: "purchase",
                    container: p
                }).render().attach()
            }
            this.$("img").disableTextSelect();
            this.$el.disableTextSelect();
            this.el.appendChild(p)
        }
    })
}(this));
APP.task("boosters", ["items", "abilities", "store"], function initBoosters(c) {
    var d = APP.$,
        n = APP._,
        h = APP.namespace("boosters"),
        e = APP.namespace("abilities"),
        g = APP.namespace("items"),
        k = APP.namespace("store"),
        a = h.$el = d("<div>").addClass("main main_boosters page hidden loading"),
        o = h.store = h.list = new APP.View.ItemList({
            container: a,
            className: "buy_list items boosters",
            collection: g.collection,
            filter: {
                itemType: "booster"
            },
            viewClass: "Booster",
            viewOptions: {
                abilities: e.collection
            },
            drag: null
        }).attach(),
        b = function b() {
            this.$("span.booster_status, h2, div.button-content, div.prices").renderText();
            this.$("a.info-button, a.button-view").renderText({
                hover: true,
                separate: "none"
            })
        },
        j = g.collection.filterBy({
            itemType: "booster"
        }).invoke("getImage", "max");
    o.bind("item:click:buy", function m(p, q) {
        k.trigger("buy", q)
    });
    o.bind("render", b);
    o.bind("item:render", b);
    e.collection.bind("reset", function l() {
        o.render()
    });
    a.appendTo("#frontend");
    a.delegate("div.prereq-info", "click", function(p) {
        p.preventDefault();
        APP.navigate("/abilities", true)
    });
    APP.preload.image(j, function() {});
    h.initialize(function i(p) {
        o.once("render", p);
        o.render()
    });
    h.once("initialized", function f() {
        h.$el.removeClass("loading")
    });
    c()
});
APP.task("boosters.routes", ["boosters"], function taskBoostersRoutes(a) {
    var e = APP.win,
        b = APP.$,
        i = APP._,
        d = APP.namespace("boosters"),
        g;
    APP.bind("page:boosters", function h(k, j) {
        if (k !== "boosters") {
            e.dontUpdateDoll = true;
            e.hideDoll()
        }
        d.run(function() {
            if (j.id) {
                d.list.scrollTo(d.list.getElementByModel(j.id))
            }
        })
    });
    APP.route("boosters", "boosters", function c() {
        APP.page("boosters")
    });
    APP.route(/^boosters\/([\d]+)$/, "boosters-id", function f(j) {
        APP.page("boosters", {
            id: j
        })
    });
    a()
});
(function(i) {
    var j = i.APP,
        g = j.win,
        d = j.$,
        l = j._,
        k = j.View.prototype,
        p = j.namespace("config");
    j.View.BundleItem = j.View.extend({
        name: "bundle-item-view",
        events: {
            "click a.buy": "_onClickBuy",
            "click a.tryon": "_onClickTryOn",
            click: "_onClick",
            mouseenter: function() {
                this.sound("hover");
                this.trigger("enter", this, this.model)
            },
            mouseleave: function() {
                this.trigger("leave", this, this.model)
            },
            "mouseenter a.tryon": function(q) {
                this.sound("hover");
                this.trigger("tryon:enter", this, this.model, q)
            },
            "mouseleave a.tryon": function(q) {
                this.trigger("tryon:leave", this, this.model, q)
            },
            "mouseenter a.icon.buy, a.icon.lock, a.icon.unlock": function(q) {
                this.sound("hover");
                this.trigger("buy:enter", this, this.model, q)
            },
            "mouseleave a.icon.buy, a.icon.lock, a.icon.unlock": function(q) {
                this.trigger("buy:leave", this, this.model, q)
            }
        },
        initialize: function c() {
            l.bindAll(this);
            this.model.bind("change", this.render);
            this.model.bind("purchase:start", this._onPurchaseStart);
            this.model.bind("purchase:end", this._onPurchaseEnd)
        },
        destroy: function b() {
            this.model.unbind("purchase:start", this._onPurchaseStart);
            this.model.unbind("purchase:end", this._onPurchaseEnd)
        },
        _onPurchaseStart: function o() {
            this.$el.addClass("loading")
        },
        _onPurchaseEnd: function f() {
            this.$el.removeClass("loading")
        },
        _onClickBuy: function h(q) {
            q.preventDefault();
            q.stopImmediatePropagation();
            this.sound("click");
            this.trigger("buy", this.model, q.currentTarget)
        },
        _onClickTryOn: function n(q) {
            q.preventDefault();
            q.stopImmediatePropagation();
            this.sound("click");
            this.trigger("try", this.model, q.currentTarget)
        },
        _onClick: function a(q) {
            q.preventDefault();
            this.sound("click");
            this.trigger("click", this.model)
        },
        renderLock: function m() {
            var w = j.ns("config"),
                v = this.model.get("lockType"),
                x = this.model.get("lockCriteria"),
                s = this.make("div", {
                    "class": "lock " + v
                }),
                u = w.imageFolder + "game/item-lock-progress.png",
                r = this.model.get("lockProgress"),
                q = g.progressCircle(u, r, {
                    width: 56,
                    height: 56,
                    lineWidth: 8,
                    duration: 500
                });
            s.appendChild(this.make("span", {
                "class": "type"
            }, v));
            s.appendChild(this.make("span", {
                "class": "key"
            }, x));
            s.appendChild(q);
            this.el.appendChild(s);
            return this
        },
        render: function e() {
            this.$el.addClass("loading");
            this.$el.attr("item-id", this.model.id);
            var s = this.model.get("offers").at(0),
                r = this.make("div", {
                    "class": "bar"
                }),
                q = this.make("img", {
                    "class": "item",
                    width: 290,
                    height: 156,
                    src: p.imageFolder + "/game/1x1-transparent.png"
                });
            if (s.isDiscounted()) {
                r.appendChild(this.make("span", {
                    "class": "original"
                }, s.get("originalPrice")))
            }
            r.appendChild(this.make("span", null, "Now"));
            r.appendChild(this.make("span", {
                "class": s.get("currency")
            }, s.get("price")));
            this.el.appendChild(r);
            this.el.appendChild(q);
            j.preload.image(this.model.getImage(), l.bind(function(u, v) {
                if (u) {
                    j.warn(u);
                    v = p.imageFolder + "game/tmp_bundle.jpg"
                }
                q.src = v;
                this.$el.removeClass("loading")
            }, this));
            q.ondragstart = function() {
                return false
            };
            if (this.model.isLocked()) {
                this.$el.addClass("locked");
                this.renderLock();
                if (s && s.isUnlock()) {
                    this.$el.append('<a href="#unlock" class="icon unlock" />')
                } else {
                    this.$el.append('<a href="#lock" class="icon lock" />')
                }
            } else {
                if (this.model.isBuyable()) {
                    this.el.appendChild(this.make("a", {
                        "class": "icon buy",
                        href: "#buy"
                    }))
                }
            }
            if (this.model.get("containsAppearanceItems") && !this.model.get("isRandomContent")) {
                this.el.appendChild(this.make("a", {
                    "class": "icon tryon",
                    href: "#tryon"
                }))
            }
            if (this.model.isPromoted()) {
                this.el.appendChild(this.make("span", {
                    "class": "promotion " + this.model.get("promotionType")
                }, this.model.get("promotionLabel")))
            }
            this.$el.disableTextSelect()
        }
    })
}(this));
(function(j) {
    var n = j.APP,
        h = n.win,
        e = n.$,
        p = n._,
        m = n.doc,
        o = n.View.prototype;
    n.View.BundleInfo = n.View.extend({
        name: "bundle-info-view",
        className: "info-view",
        events: {
            "click a.close": function(r) {
                r.preventDefault();
                this.sound("close");
                this.trigger("close", this, this.model, r)
            },
            "click a.try": function(r) {
                r.preventDefault();
                this.sound("click:button");
                this.trigger("try", this, this.model, r)
            },
            "mouseenter a.close, a.try, a.buy-button": function() {
                this.sound("hover")
            }
        },
        initialize: function a() {
            p.bindAll(this);
            this.model.bind("change", this.render);
            this.model.bind("purchase:start", this._onPurchaseStart);
            this.model.bind("purchase:end", this._onPurchaseEnd);
            this.bind("buy:click", this._onClickBuy, this)
        },
        destroy: function l() {
            this.model.unbind("change", this.render);
            this.model.unbind("purchase:start", this._onPurchaseStart);
            this.model.unbind("purchase:end", this._onPurchaseEnd)
        },
        _onPurchaseStart: function q(r) {
            this.$el.addClass("loading")
        },
        _onPurchaseEnd: function b(r) {
            this.$el.removeClass("loading")
        },
        _onClickBuy: function i(r, s) {
            this.trigger("buy", this, this.model, s)
        },
        show: function g() {
            if (!this.isVisible()) {
                this.$el.css({
                    opacity: 0
                }).show();
                this.$el.animate({
                    opacity: 1
                }, 200)
            }
            return this
        },
        hide: function d() {
            if (this.isVisible()) {
                this.$el.animate({
                    opacity: 1
                }, 200, p.bind(this.$el.hide, this.$el))
            }
            return this
        },
        isVisible: function c() {
            if (!this.el.parentNode) {
                return false
            }
            if (this.el.style.display === "none") {
                return false
            }
            if (parseInt(this.$el.css("opacity"), 10) === 0) {
                return false
            }
            return true
        },
        renderLock: function k() {
            var x = n.ns("config"),
                w = this.model.get("lockType"),
                y = this.model.get("lockCriteria"),
                u = this.make("div", {
                    "class": "lock " + w
                }),
                v = x.imageFolder + "game/item-lock-progress.png",
                s = this.model.get("lockProgress"),
                r = h.progressCircle(v, s, {
                    width: 116,
                    height: 116,
                    lineWidth: 20,
                    duration: 500
                });
            u.appendChild(this.make("span", {
                "class": "type"
            }, w));
            u.appendChild(this.make("span", {
                "class": "key"
            }, y));
            u.appendChild(r);
            this.el.appendChild(u);
            return this
        },
        render: function f() {
            var u = this.model.get("offers").at(0),
                w = m.createDocumentFragment(),
                v, s, r;
            this.el.appendChild(this.make("a", {
                "class": "close"
            }));
            v = this.make("h2");
            v.appendChild(this.make("span", null, this.model.get("name")));
            this.el.appendChild(v);
            this.el.appendChild(this.make("div", {
                "class": "description"
            }, this.model.get("description")));
            if (this.model.get("isRandomContent")) {
                r = [{
                    name: this.trans("WEB_GAME_SUPPLYDROPS_UNKNOWN_ITEM"),
                    buyable: false,
                    id: "mystery-item"
                }]
            } else {
                r = this.model.get("items")
            }
            this.createView(n.View.LabelBox, {
                label: "Items",
                className: "bundled-items",
                content: this.createView(n.View.ItemList, {
                    collection: new n.Collection.Items(r),
                    drag: false,
                    drop: false,
                    viewOptions: {
                        showName: false,
                        live: false,
                        showIcons: false
                    }
                }, "list")
            }).render().attach();
            if (this.model.isLocked()) {
                this.$el.addClass("locked");
                this.renderLock()
            } else {
                if (this.model.get("containsAppearanceItems") && !this.model.get("isRandomContent")) {
                    this.createView(n.View.LabelBox, {
                        content: this.make("a", {
                            "class": "info-button try"
                        }, "Try on")
                    }).render().attach()
                }
                s = this.make("div", {
                    "class": "prices"
                });
                if (u.isDiscounted()) {
                    s.appendChild(this.make("span", {
                        "class": "original"
                    }, u.get("originalPrice")))
                }
                s.appendChild(this.make("span", {
                    "class": "currency " + u.get("currency")
                }, u.get("price")));
                w.appendChild(s);
                this.createView(n.View.Button, {
                    container: w,
                    className: "buy",
                    text: this.trans("WEB_STORE_COMMON_BUY_BTN"),
                    sound: true
                }, "buy").render().attach();
                this.createView(n.View.LabelBox, {
                    className: "purchase",
                    label: "Price",
                    content: w
                }).render().attach()
            }
            this.$el.disableTextSelect()
        }
    })
}(this));
APP.task("bundles", ["items", "store"], function initBundles(f) {
    var j = APP.win,
        g = APP.$,
        o = APP._,
        q = j.dressDoll,
        n = j.showTooltip,
        i = APP.namespace("items"),
        d = APP.namespace("bundles"),
        p = APP.namespace("config"),
        k = APP.namespace("store"),
        h = d.collection = i.collection.byType("bundle"),
        c = d.$el = g("<div>").addClass("main main_bundles page hidden loading").appendTo("#frontend"),
        m = d.$panelLeft = g("<div>").addClass("page-panel left").appendTo(c),
        e = d.$panelRight = g("<div>").addClass("page-panel right").appendTo(c),
        l = function l(B, v) {
            var s = i.collection.getBundledItems(B),
                r = s.byType("appearance"),
                y = s.byType("weapon"),
                u, x, A, w = function w(D, E) {
                    var C = y.by("validationGroup", D),
                        G;
                    if (C.length !== 0) {
                        G = u.by("validationGroup", D).pluck("equippedSlot");
                        C.forEach(function F(H, I) {
                            var J;
                            if (E) {
                                J = A.shift();
                                if (!o.isNumber(J) && G.length !== 0) {
                                    J = (I < G.length) ? G[I] : G[0]
                                }
                            } else {
                                if (G.length !== 0) {
                                    J = (I < G.length) ? G[I] : G[0]
                                } else {
                                    J = A.shift()
                                }
                            }
                            if (o.isNumber(J) && !H.isEquipped()) {
                                H.set({
                                    equippedSlot: J
                                })
                            }
                        })
                    }
                };
            if (r.length !== 0) {
                x = ["head", "face", "uniform", "accessory1", "accessory2"];
                r.forEach(function z(C) {
                    var D = o.indexOf(x, C.get("validationGroup"));
                    if (D !== -1 && !C.isEquipped()) {
                        C.set({
                            equippedSlot: D
                        })
                    }
                })
            }
            if (y.length !== 0 && !v) {
                u = i.collection.getEquipped("weapon");
                A = o.without.apply(o, [o.range(10)].concat(u.pluck("equippedSlot")));
                w("primary");
                w("secondary");
                w("melee");
                w("gadget", true)
            }
        };
    h.bind("purchase:success", function a(u, x, s, B) {
        var y = {
                title: APP.sidis.trans("WEB_GAME_TOOLTIPS_HEADER_EQUIPMENT_REMINDER"),
                body: APP.sidis.trans("WEB_GAME_TOOLTIPS_MESSAGE_EQUIPMENT_REMINDER"),
                close: true,
                buttonRight: APP.sidis.trans("WEB_GAME_TOOLTIPS_EQUIP_BTN")
            },
            z = new APP.View.Dialog({
                renderData: y
            }),
            A = function() {
                z.sound("close");
                z.destroy();
                z = null
            },
            r, w, v;
        z.bind("close", A);
        if (u.get("isRandomContent")) {
            v = B.data || {};
            v.items = v.items ? o.keys(v.items) : [];
            v.offers = v.offers || {};
            v.offerObjects = v.offerObjects || {};
            w = g("<ul>").addClass("item-list");
            o.forEach(v.items, function(I) {
                var F = i.get(I),
                    E = v.offerObjects[F.id] ? new APP.Model.Offer(v.offerObjects[F.id]) : null,
                    D = g("<li>"),
                    J = g("<span>"),
                    H = g("<h3>").text(F.get("name")).append(J),
                    G = g("<img>").attr({
                        src: F.getImage("med"),
                        width: p.imageSize.med.width,
                        height: p.imageSize.med.height
                    }),
                    C = g("<p>").text(E ? E.get("limit") : "");
                if (F.get("itemType") === "appearance" || F.get("itemType") === "weapon") {
                    J.text(F.get("categoryname"))
                } else {
                    J.text(F.get("itemType"))
                }
                H.appendTo(D);
                G.appendTo(D);
                C.appendTo(D);
                D.appendTo(w);
                D.bind("click", function() {
                    var M = F.get("itemType"),
                        L = {
                            weapon: "/weapons/" + F.id,
                            appearance: "/appearance/" + F.id,
                            booster: "/boosters/" + F.id
                        },
                        K = L[M];
                    if (K) {
                        z.sound("click");
                        APP.navigate(K, true)
                    }
                    A()
                })
            });
            z.className = "supplydrop-dialog";
            y.body = w;
            y.buttonRight = APP.sidis.trans("WEB_GAME_TOOLTIPS_BUY_AGAIN_BTN");
            z.bind("button:right", function() {
                A();
                k.trigger("buy", u)
            })
        } else {
            z.bind("button:right", function() {
                l(u);
                A()
            })
        }
        z.render();
        z.attach();
        z.$("h2.title, h3, div.body").renderText();
        z.$("a.button, a.button-view").renderText({
            hover: true
        });
        z.show()
    });
    d.once("initialized", function b() {
        d.$el.removeClass("loading")
    });
    f()
});
APP.task("bundles.list", ["bundles"], function initBundlesList(l) {
    var d = APP.win,
        e = APP.$,
        w = APP._,
        i = APP.ns("bundles"),
        s = APP.ns("items"),
        k = APP.ns("store"),
        p = e("<div>").addClass("menu-bar").appendTo(i.$panelRight),
        g = i.categoryTabs = new APP.View.Tabs({
            container: p,
            className: "category-tabs",
            tabs: [{
                text: APP.sidis.trans("WEB_GAME_ITEM_CATEGORY_SUPPLY_DROPS"),
                filter: "drops"
            }, {
                text: APP.sidis.trans("WEB_GAME_ITEM_CATEGORY_HOT_DEALS"),
                filter: "hot"
            }, {
                text: APP.sidis.trans("WEB_GAME_ITEM_CATEGORY_LATEST"),
                filter: "latest"
            }]
        }).attach().render(),
        r = i.list = new APP.View.ItemList({
            container: i.$panelRight,
            className: "selectable-list",
            collection: s.collection,
            viewClass: "BundleItem",
            selectedClassName: "selected",
            drag: false,
            drop: false
        }).attach(),
        h = new APP.View.Tooltip({
            className: "tryon-tooltip",
            html: "<p>" + APP.sidis.trans("WEB_GAME_CLICK_TO_TRYON") + "</p>"
        }).render().attach();
    g.bind("select", function(x, z) {
        var y = {
            itemType: "bundle"
        };
        if (z.filter === "drops") {
            y.isRandomContent = true
        } else {
            if (z.filter === "hot") {
                y.special = true;
                r.options.orderBy = "sortOrder";
                r.options.orderDesc = false
            } else {
                r.options.orderBy = "lastModifiedTimestamp";
                r.options.orderDesc = true
            }
        }
        g.$("a").renderText({
            hover: true
        });
        r.filterCollection(y).render()
    });
    r.bind("render", function f() {
        r.$("div.bar span, span.promotion, div.lock span").renderText(true);
        r.bind("item:render", function x() {
            r.$("div.bar span, span.promotion, div.lock span").renderText(true)
        })
    });
    r.bind("select", function j(x, y) {
        r.scrollTo(y)
    });
    r.bind("item:click", function b(x) {
        i.trigger("select", x)
    });
    r.bind("item:buy", function o(x) {
        k.trigger("buy", x)
    });
    r.bind("item:try", function m(x) {
        i.trigger("try", x)
    });
    r.bind("item:buy:enter", function c(x, y, z) {
        s.tooltip.renderModelAndShow(y, z.currentTarget, {
            offers: true
        })
    });
    r.bind("item:buy:leave", function q() {
        s.tooltip.hide()
    });
    r.bind("item:tryon:enter", function n(x, y, z) {
        h.show(z.currentTarget)
    });
    r.bind("item:tryon:leave", function a() {
        h.hide()
    });
    i.bind("select", function v(x) {
        r.select(x)
    });
    i.initialize(function u(x) {
        r.once("render", x);
        g.select(0)
    });
    l()
});
APP.task("bundles.info", ["bundles"], function initBundlesList(d) {
    var h = APP.win,
        l = APP.doc,
        f = APP.$,
        m = APP._,
        b = APP.ns("bundles"),
        g = APP.ns("items"),
        k = APP.ns("store"),
        a, e, c = function c(o) {
            o = b.collection.get(o);
            h.dressDoll(o);
            if (a) {
                a.hide();
                m.delay(h.showDoll, 200)
            } else {
                h.showDoll()
            }
        };
    APP.bind("doll:undress", function n(o) {
        if (o instanceof APP.Model.Item && a && a.model.id === o.id) {
            h.hideDoll();
            a.show()
        }
    });
    b.bind("try", function j(o) {
        c(o)
    });
    b.bind("select", function i(q) {
        q = g.collection.get(q);
        if (a && a.model.id !== q.id) {
            a.destroy();
            a = b.info = null
        }
        h.dontUpdateDoll = true;
        h.hideDoll();
        if (a) {
            a.show()
        } else {
            a = b.info = new APP.View.BundleInfo({
                model: q,
                container: b.$panelLeft
            }).attach();
            a.bind("render", function p() {
                a.$("h2 span").renderText();
                a.$("div.prices, div.lock span").renderText(true);
                a.$("div.labelbox-view a").renderText({
                    hover: true,
                    separate: "none"
                })
            });
            a.bind("close", function o() {
                a.hide();
                b.list.deselect();
                m.delay(function() {
                    h.dressDoll();
                    h.showDoll();
                    h.dontUpdateDoll = false
                }, 200)
            });
            a.bind("list:item:enter", function u(v, x, z) {
                if (x) {
                    var w = {
                            name: true,
                            stats: true,
                            slots: true
                        },
                        y = x.get("offers");
                    if (y.length !== 0) {
                        w.customText = x.get("offers").at(0).get("limit")
                    }
                    g.tooltip.renderModelAndShow(x, z.currentTarget, w)
                }
            });
            a.bind("list:item:leave", function() {
                g.tooltip.hide()
            });
            a.bind("buy", function s(v, w) {
                k.trigger("buy", w)
            });
            a.bind("try", function r(v, w) {
                b.trigger("try", w)
            });
            a.render();
            a.show()
        }
    });
    d()
});
APP.task("bundles.routes", ["items", "bundles", "bundles.list"], function taskAppearanceRoutes(d) {
    var h = APP.win,
        e = APP.$,
        j = APP._,
        c = APP.ns("bundles"),
        g = APP.ns("items");
    APP.bind("page:bundles", function i(l, k) {
        if (l !== "bundles") {
            if (c.info && c.info.isVisible()) {
                h.dontUpdateDoll = true;
                h.hideDoll()
            } else {
                h.dontUpdateDoll = false;
                h.showDoll()
            }
        }
        c.run(function() {
            var m;
            if (k.tab) {
                if (k.tab === "drops") {
                    c.categoryTabs.select(0)
                } else {
                    c.categoryTabs.select(k.tab)
                }
            } else {
                if (k.id) {
                    m = g.collection.get(k.id);
                    c.categoryTabs.select(2);
                    c.trigger("select", m)
                }
            }
        })
    });
    APP.route("bundles", "bundles", function b() {
        APP.page("bundles")
    });
    APP.route("bundles/:tab", "bundles-tab", function a(k) {
        APP.page("bundles", {
            tab: k
        })
    });
    APP.route(/^bundles\/([\d]+)$/, "bundles-id", function f(m) {
        var l = g.collection.get(m),
            k;
        if (l && l.isType("bundle")) {
            k = "/bundles/" + l.id + "/" + l.get("name").toLowerCase().replace(/([\s])+/g, "-");
            APP.navigate(k);
            APP.page("bundles", {
                id: m
            })
        }
    });
    d()
});
APP.task("config", function taskConfig(b) {
    var e = APP.win,
        h = APP.doc,
        c = APP.$,
        i = APP._,
        j = APP.ns("config"),
        f = e.sessionStorage,
        d = j.model = new APP.Model({
            id: "config:" + j.uid
        }),
        a = function a() {
            if (e.sessionStorage) {
                f.setItem(d.id, JSON.stringify(d.toJSON()))
            }
        },
        k = false,
        g = c.ui.draggable.prototype._generatePosition;
    j.imageSize = {
        min: {
            width: 80,
            height: 60
        },
        med: {
            width: 285,
            height: 128
        },
        max: {
            width: 927,
            height: 416
        }
    };
    j.attachmentSize = {
        min: {
            width: 40,
            height: 18
        },
        med: {
            width: 125,
            height: 56
        },
        max: {
            width: 400,
            height: 180
        }
    };
    if (e.sessionStorage && f.hasOwnProperty(d.id)) {
        d.set(JSON.parse(f.getItem(d.id)))
    } else {
        a()
    }
    i.forEach(j.defaultCustomization, function(l, m) {
        if (typeof l === "object") {
            i.forEach(l, function(n, o) {
                i.forEach(n, function(p, q) {
                    n[q] = i.values(p)
                })
            })
        }
    });
    d.bind("change", i.throttle(a, 1000));
    k = parseInt(JSON.parse(APP.api.general.getWindowSize()).width, 10) === 800;
    j.isScaled = k;
    j.maxWidth = APP.$frontend.width();
    j.maxHeight = APP.$frontend.height();
    if (k) {
        j.scale = 0.78125;
        j.scaleMod = 1.28;
        c.ui.draggable.prototype._generatePosition = function() {
            var l = g.apply(this, arguments);
            l.top = l.top * j.scaleMod;
            l.left = l.left * j.scaleMod;
            return l
        };
        c.ui.intersect = function(B, v, z) {
            if (!v.offset) {
                return false
            }
            var o = (B.positionAbs || B.position.absolute).left,
                n = o + B.helperProportions.width,
                y = (B.positionAbs || B.position.absolute).top,
                x = y + B.helperProportions.height,
                q = (v.offset.left * j.scaleMod) - (v.proportions.height / 2),
                m = q + v.proportions.width,
                A = (v.offset.top * j.scaleMod) - (v.proportions.height / 2),
                w = A + v.proportions.height,
                s = ((B.positionAbs || B.position.absolute).left + ((B.clickOffset || B.offset.click).left)),
                u = ((B.positionAbs || B.position.absolute).top + ((B.clickOffset || B.offset.click).top)),
                p = c.ui.isOver(u, s, A, q, v.proportions.height, v.proportions.width);
            return p
        }
    } else {
        j.scale = 1;
        j.scaleMod = 1
    }
    b()
});
(function(r) {
    var o = r.APP,
        b = o.$,
        z = o._,
        A = o.doc,
        m = o.View.DnD.prototype,
        j = o.namespace("config");
    o.View.Dock = o.View.DnD.extend({
        name: "dock-view",
        tagName: "div",
        options: z.extend(z.clone(m.options), {
            type: null,
            drag: "div.dock_item",
            drop: "div.dock_item",
            limit: {},
            showKey: false,
            viewClass: "Item",
            foo: "dock"
        }),
        dragOptions: z.extend({}, m.dragOptions, {
            revert: false
        }),
        events: {
            "mouseenter div.dock_item": function(C) {
                var B = this.$slots.index(C.currentTarget);
                this.trigger("enter", this, this.getModelFromDOM(B), C, B)
            },
            "mouseleave div.dock_item": function(C) {
                var B = this.$slots.index(C.currentTarget);
                this.trigger("leave", this, this.getModelFromDOM(B), C, B)
            }
        },
        initialize: function h() {
            z.bindAll(this);
            this._highlighted = [];
            this.bind("drag:start", this.onDragStart, this);
            this.bind("drag:stop", this.onDragStop, this);
            this.bind("drop", this.onDrop, this);
            this.collection.bind("change:equippedSlot", this.onEquippedSlot, this);
            this.collection.bind("reset", this.onCollectionReset, this);
            this.collection.bind("remove", this.onCollectionRemove, this)
        },
        destroy: function n() {
            this.collection.unbind("change:equippedSlot", this.onEquippedSlot, this);
            this.collection.unbind("reset", this.onCollectionReset, this);
            this.collection.unbind("remove", this.onCollectionRemove, this)
        },
        onCollectionReset: function w() {
            this.render()
        },
        onCollectionRemove: function e(B) {
            if (B && B.isType(this.options.type) && B.isEquipped()) {
                this.unequip(B)
            }
        },
        onClickItem: function x(C) {
            C.preventDefault();
            var B = this.getModelFromDOM(C.currentTarget);
            this.trigger("click:item", B, C)
        },
        onClickBuy: function y(D) {
            D.preventDefault();
            var B = this.$(D.currentTarget).parents("div.dock_item"),
                C = this.getModelFromDOM(B);
            this.trigger("click:buy", C, D)
        },
        onDragStart: function c() {
            this.sound("equip")
        },
        onDragStop: function u(D, F) {
            var H = this.$(this.getContainer()),
                G = H.offset().top,
                C = G + H.height(),
                B = F.helper.offset().top,
                E = B + (F.helper.height() / 2);
            if (E < G || E > C) {
                this.unequip(D)
            }
            this.sound("unequip");
            this.highlight();
            return this
        },
        onEquippedSlot: function g(C) {
            if (C.get("itemType") !== this.options.type) {
                return this
            }
            var G, H = C.previous("equippedSlot"),
                D = C.get("equippedSlot"),
                E = z.isString(this.options.viewClass) ? o.View[this.options.viewClass] : this.options.viewClass,
                F, B = {
                    itemType: this.options.type,
                    equippedSlot: H
                },
                K = z.isNumber(H),
                J = K ? this.collection.filterBy(B) : [];
            if (C.isEquipped()) {
                this.emptySlot(D);
                G = this.$slots.eq(D);
                F = this.createView(E, {
                    model: C,
                    container: G,
                    showName: false,
                    className: "icon",
                    showAdditional: false,
                    showLock: false,
                    size: "min"
                }, "item");
                F.bind("render", function I() {
                    if (!C.isOwned() || C.get("expired")) {
                        F.$el.addClass("invalid")
                    }
                });
                F.render();
                G.find("div.item-view").remove();
                F.attach();
                G.find("span.description").html(C.get("categoryname"));
                if (K && J.length === 0) {
                    this.emptySlot(H)
                }
                this.trigger("equip", C)
            } else {
                if (K) {
                    this.emptySlot(H)
                }
                this.trigger("unequip", C)
            }
            return this
        },
        dragHelper: function a(D) {
            var B = this.getViewByElement(D.currentTarget.getElementsByTagName("div")[0]),
                C;
            if (B && B.dragHelper) {
                C = B.dragHelper(D);
                C.data("id", B.model.id);
                C.appendTo(A.body);
                return C
            }
            return this.make("span")
        },
        emptySlot: function v(F) {
            var E = this.$slots.eq(F),
                C = E.find("div.icon"),
                D = this.getView(C),
                B = z.bind(function B() {
                    if (D) {
                        this.destroyView(D)
                    } else {
                        C.remove()
                    }
                }, this);
            C.css({
                position: "absolute",
                top: 0
            }).animate({
                top: "-100",
                opacity: 0
            }, 200, B);
            E.find("span.description").empty();
            return this
        },
        highlight: function l(D) {
            if (arguments.length !== 0) {
                if (!z.isArray(D)) {
                    D = [D]
                }
                this._highlighted = D
            }
            var B = this._highlighted.length,
                C;
            this.$slots.removeClass("active drop-hover");
            for (C = 0; C < B; C += 1) {
                this.$slots.eq(this._highlighted[C]).addClass("active")
            }
            return this
        },
        onKeyChange: function k(B) {},
        unequip: function s(B) {
            if (B instanceof o.Model) {
                B.unset("equippedSlot")
            }
            return this
        },
        onDrop: function f(B, D, C) {
            var E = this.$slots.index(C);
            B.set({
                equippedSlot: E
            });
            this.highlight()
        },
        getModelFromDOM: function i(D) {
            var C = z.isNumber(D) ? D : this.$slots.index(D),
                B = this.collection.getBy({
                    itemType: this.options.type,
                    equippedSlot: C
                });
            return B
        },
        getMappedKeyBySlot: function d(C) {
            var B = C + 1;
            if (B === 10) {
                B = 0
            }
            return B + String()
        },
        renderSlot: function q(B) {
            var C = this.make("div", {
                "class": "dock_item"
            });
            if (this.options.showKey) {
                C.appendChild(this.make("span", {
                    "class": "key"
                }, this.getMappedKeyBySlot(B)))
            }
            C.appendChild(this.make("span", {
                "class": "description"
            }));
            return C
        },
        render: function p() {
            this.destroyViews();
            this.$el.empty();
            var C, B = this.options.slotCount,
                D = [],
                E;
            for (C = 0; C < B; C += 1) {
                E = this.renderSlot(C);
                D.push(E);
                this.el.appendChild(E)
            }
            this.$slots = this.$(D);
            this.collection.getEquipped(this.options.type).forEach(this.onEquippedSlot, this);
            return this
        }
    })
}(this));
(function(a) {
    var h = a.APP,
        e = h.$,
        j = h._,
        c = {
            0: "Head",
            1: "Face",
            2: "Uniform",
            3: "Accessory 1",
            4: "Accessory 2"
        },
        i = h.View.Dock.prototype;
    h.View.DockAppearance = h.View.Dock.extend({
        name: "dock-view",
        tagName: "div",
        className: "appearance",
        options: j.extend(j.clone(i.options), {
            type: "appearance",
            slotCount: 5,
            limit: {
                head: 1,
                face: 1,
                uniform: 1,
                accessory1: 1,
                accessory2: 1
            },
            viewClass: "AppearanceItem"
        }),
        _highlighted: [0, 1, 2, 3, 4],
        initialize: function f() {
            i.initialize.apply(this, arguments);
            this.bind("drop:activate", function k(p) {
                this.$slots.removeClass("active");
                this.$slots.filter("." + p.get("validationGroup")).addClass("active")
            }, this);
            this.bind("drop:deactivate", function l(p) {
                this.highlight()
            }, this);
            this.bind("drag:start", function m(p) {
                if (p) {
                    this.$slots.removeClass("active");
                    this.$slots.filter("." + p.get("validationGroup")).addClass("active")
                }
            }, this);
            this.bind("drag:stop", function o() {
                this.highlight()
            }, this);
            this.bind("empty", function n(p, q) {
                p.find("span.description").text(c[q])
            }, this)
        },
        accept: function b(l, n) {
            var m = l.attr("item-id") || l.data("id") || l.find("div.icon").data("id"),
                k = this.collection.get(m);
            return k && k.get("itemType") === "appearance" && e(n).hasClass(k.get("category"))
        },
        emptySlot: function g(m) {
            i.emptySlot.apply(this, arguments);
            var l = this.$slots.eq(m),
                k = c[m];
            l.find("span.description").text(k);
            return this
        },
        renderSlot: function d(m) {
            var p = i.renderSlot.call(this, m),
                o = e(p),
                l = {
                    0: "head",
                    1: "face",
                    2: "uniform",
                    3: "accessory1",
                    4: "accessory2"
                },
                n = c[m],
                k = o.find("span.description");
            o.addClass(l[m]);
            k.text(n);
            return p
        }
    })
}(this));
(function(a) {
    var f = a.APP,
        d = f.win,
        b = f.$,
        h = f._,
        g = f.View.Dock.prototype;
    f.View.DockWeapons = f.View.Dock.extend({
        name: "dock-view",
        tagName: "div",
        className: "weapons",
        options: h.extend(h.clone(g.options), {
            type: "weapon",
            slotCount: 10,
            showKey: true,
            foo: "weapons",
            viewClass: "WeaponItem"
        }),
        dragOptions: h.extend({}, g.dragOptions, {
            containment: [-158, 0, 882, 704],
            cursorAt: {
                left: 158,
                top: 67
            }
        }),
        initialize: function i() {
            g.initialize.apply(this, arguments);
            this.bind("drag:start", function k(l) {
                this.collection.setSelected("weapon", l)
            }, this);
            this.options.keys.bind("change", this.render, this)
        },
        destroy: function e() {
            g.destroy.apply(this, arguments);
            this.options.keys.unbind("change", this.render, this)
        },
        getMappedKeyBySlot: function j(k) {
            return this.options.keys.at(k).get("keyName")
        },
        accept: function c(l, n) {
            var m = l.attr("item-id") || l.find("div").attr("item-id") || l.data("id"),
                k = this.collection.get(m);
            return (k && k.get("itemType") === "weapon")
        }
    })
}(this));
APP.task("dock", ["items", "sidis", "appearance", "store", "options.data"], function taskDock(d) {
    var v = APP.$,
        L = APP._,
        I = APP.namespace("dock"),
        D = APP.namespace("items"),
        m = APP.namespace("store"),
        s = APP.namespace("game"),
        e = APP.namespace("options"),
        g = APP.namespace("appearance"),
        i = I.$el = v("<div>").addClass("footer weapons").append('<a href="#toggle-dock" class="toggle"><span></span></a>').appendTo("#frontend"),
        z = I.$weapons = v("<div>").addClass("dock weapons_dock").append('<div class="dock_title"><a href="#weapons">' + APP.sidis.trans("WEB_GAME_DOCK_WEAPONS") + "</a></div>").appendTo(i),
        l = I.weapons = new APP.View.DockWeapons({
            collection: D.collection,
            container: z,
            keys: e.collection.filterBy({
                group: "equipment"
            })
        }).render(),
        b = I.$appearance = v("<div>").addClass("dock appearance_dock").append('<div class="dock_title"><a href="#appearance">' + APP.sidis.trans("WEB_GAME_DOCK_APPERANCE") + "</a></div>").appendTo(i),
        j = I.appearance = new APP.View.DockAppearance({
            collection: D.collection,
            container: b
        }).render(),
        G = function G(M) {
            M.$slots.find("span.description").renderText(true)
        },
        a = I.change = function r(M) {
            i[0].className = "footer " + M || "";
            return I
        },
        o = I.open = function f(M) {
            if (!i.hasClass("open")) {
                i.css("height", "");
                if (L.isFunction(M)) {
                    i.one("webkitTransitionEnd", M)
                }
                i.addClass("open")
            } else {
                if (L.isFunction(M)) {
                    L.defer(M)
                }
            }
            return I
        },
        C = I.close = function h(M) {
            if (i.hasClass("open")) {
                if (L.isFunction(M)) {
                    i.one("webkitTransitionEnd", M)
                }
                i.removeClass("open")
            } else {
                if (L.isFunction(M)) {
                    L.defer(M)
                }
            }
            return I
        },
        F = I.hide = function w(N) {
            var M = i.height();
            if (M > 0) {
                i.css("height", 0);
                if (L.isFunction(N)) {
                    i.one("webkitTransitionEnd", N)
                }
                i.removeClass("open")
            } else {
                if (L.isFunction(N)) {
                    L.defer(N)
                }
            }
            return I
        },
        y = I.show = function n(N) {
            var M = i.height();
            if (M === 0) {
                if (L.isFunction(N)) {
                    i.one("webkitTransitionEnd", N)
                }
                i.css("height", "")
            } else {
                if (L.isFunction(N)) {
                    L.defer(N)
                }
            }
            return I
        },
        c = function q(N, Q) {
            var R;
            Q.remove();
            N.attach();
            N.bind("item:click", function P(T, U) {
                if (U && U.isItemType("weapon")) {
                    APP.navigate("/weapons/" + U.id, true)
                } else {
                    if (U && U.isItemType("appearance")) {
                        APP.navigate("/appearance", true)
                    }
                }
            });
            N.bind("item:buy", function S(T, U) {
                m.trigger("buy", U)
            });
            N.bind("enter", function M(T, U, V) {
                if (U) {
                    D.tooltip.renderModelAndShow(U, V.currentTarget, {
                        name: true,
                        slots: true,
                        offers: true,
                        uses: true,
                        time: true,
                        invalid: true
                    })
                }
            });
            N.bind("leave", function() {
                D.tooltip.hide()
            });
            N.bind("render", function O() {
                G(N)
            });
            G(N)
        },
        K = D.get(7000),
        k = D.get(7109),
        B = v("<div>").addClass("dock_errors").css("display", "none").appendTo("#frontend"),
        A = L.debounce(function A() {
            var O = {
                    5017: APP.sidis.trans("WEB_GAME_DOCK_ERROR_5017"),
                    5018: APP.sidis.trans("WEB_GAME_DOCK_ERROR_5018"),
                    5019: APP.sidis.trans("WEB_GAME_DOCK_ERROR_5019"),
                    5020: APP.sidis.trans("WEB_GAME_DOCK_ERROR_5020")
                },
                N = D.collection.getEquipped("weapon").by("validationGroup", "primary"),
                M = K && K.isOwned() ? 2 : 1;
            if (M === 1 && k && k.isEquipped() && k.isOwned()) {
                M = 2
            }
            l.$slots.removeClass("invalid");
            if (N.length === 0) {
                B.html(O[5017]).show().animate({
                    bottom: v("#frontend .footer").height()
                }, 200)
            } else {
                if (N.length > M) {
                    B.html(O[5018]).show().animate({
                        bottom: v("#frontend .footer").height()
                    }, 200);
                    N.forEach(function(P) {
                        var Q = P.get("equippedSlot");
                        l.$slots.eq(Q).addClass("invalid")
                    })
                } else {
                    B.hide()
                }
            }
            G(l)
        }, 100),
        x = function x() {
            s.saveWeapons();
            A()
        },
        u = function u() {
            s.saveAppearance();
            j.highlight();
            A();
            L.defer(G, j)
        };
    D.bind("equip:weapon", x);
    D.bind("unequip:weapon", x);
    D.bind("equip:appearance", u);
    D.bind("unequip:appearance", u);
    i.find("a.toggle").bind("click", function p(M) {
        M.preventDefault();
        i.toggleClass("open")
    });
    APP.bind("page", function J() {
        C()
    });
    c(l, z.find("div.weapons"));
    c(j, b.find("div.appearance"));
    j.bind("empty", function E() {
        G(j)
    });
    A();
    APP.bind("filter:appearance", function H(N) {
        var M = [],
            O = L.keys(j.options.limit);
        if (L.isEmpty(N)) {
            M = [0, 1, 2, 3, 4]
        } else {
            M = L.indexOf(O, N.category)
        }
        j.highlight(M)
    });
    APP.bind("bindkey", function() {
        l.render()
    });
    if (K) {
        K.bind("change:owned", A)
    }
    if (k) {
        k.bind("change:owned change:equippedSlot", A)
    }
    d()
});
(function(g) {
    if (!g.APP && (typeof require !== "undefined")) {
        g.APP = require("../common/app")
    }
    var e = g.APP,
        d = e.Model.prototype,
        c = e._,
        a = ["recon", "assault", "medic", "engineer"];
    e.Model.EORPlayer = e.Model.extend({
        defaults: {
            kit: null,
            kitName: null,
            team: null,
            teamName: null,
            name: null,
            score: 0,
            kills: 0,
            deaths: 0,
            realKD: 0,
            scorePerKill: 0,
            level: 0,
            xp: 0,
            xpToNextLevel: 0,
            kd: null
        },
        schema: {
            kit: "number",
            team: "number",
            level: "number",
            score: "number",
            kills: "number",
            deaths: "number",
            xp: "number",
            xpToNextLevel: "number"
        },
        idAttribute: "name",
        initialize: function f() {
            this._setKitName();
            this.bind("change:kit", this._setKitName, this);
            this._setTeamName();
            this.bind("change:team", this._setTeamName, this);
            this._setKD();
            this.bind("change:kills", this._setKD, this);
            this.bind("change:deaths", this._setKD, this)
        },
        _setKitName: function b() {
            this.set({
                kitName: a[this.get("kit")]
            });
            return this
        },
        _setTeamName: function b() {
            this.set({
                teamName: this.get("team") === 1 ? "RU" : "US"
            });
            return this
        },
        _setKD: function b() {
            var h = this.get("kills"),
                j = this.get("deaths"),
                i = this.get("score");
            this.set({
                kd: h + "/" + j,
                realKD: j ? (h / j) || 0 : h,
                scorePerKill: (i / h) || 0,
                scorePerDeath: j ? (i / j) || 0 : i
            });
            return this
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = e.Model.EORPlayer
    }
}(this));
(function(e) {
    if (!e.APP && (typeof require !== "undefined")) {
        e.APP = require("../common/app")
    }
    if (!e.APP.Model && (typeof require !== "undefined")) {
        e.APP.Collection = require("../common/collection")
    }
    if (!e.APP.Model.Player && (typeof require !== "undefined")) {
        e.APP.Model.Player = require("./model.eorplayer")
    }
    var h = e.APP,
        i = h._,
        d = h.$;
    h.Collection.EORPlayers = h.Collection.extend({
        model: h.Model.EORPlayer,
        comparator: function g(l) {
            return -((l.get("team") || 0) * 100000) - l.get("score")
        },
        getModelKitRank: function c(m) {
            m = this.get(m);
            if (!(m instanceof h.Model.EORPlayer)) {
                throw new Error("Model in is not a APP.Model.EORPlayer")
            }
            var n = {},
                l = this.filterBy({
                    kit: m.get("kit")
                }).orderBy("score").reverse();
            n.global = l.indexOf(m);
            n.team = l.filterBy({
                team: m.get("team")
            }).orderBy("score").reverse().indexOf(m);
            return n
        },
        getModelKDRank: function f(n) {
            n = this.get(n);
            if (!(n instanceof h.Model.EORPlayer)) {
                throw new Error("Model in is not a APP.Model.EORPlayer")
            }
            var o = {},
                m = n.get("team"),
                l = this.orderBy("realKD").reverse();
            o.global = l.indexOf(n);
            o.team = i.filter(l, function(p) {
                return p.get("team") === m
            }).indexOf(n);
            return o
        },
        getModelKillRank: function j(n) {
            n = this.get(n);
            if (!(n instanceof h.Model.EORPlayer)) {
                throw new Error("Model in is not a APP.Model.EORPlayer")
            }
            var o = {},
                m = n.get("team"),
                l = this.orderBy("kills").reverse();
            o.global = l.indexOf(n);
            o.team = i.filter(l, function(p) {
                return p.get("team") === m
            }).indexOf(n);
            return o
        },
        getModelScorePerKillRank: function k(n) {
            n = this.get(n);
            if (!(n instanceof h.Model.EORPlayer)) {
                throw new Error("Model in is not a APP.Model.EORPlayer")
            }
            var o = {},
                m = n.get("team"),
                l = this.orderBy("scorePerKill").reverse();
            o.global = i.indexOf(l, n);
            o.team = i.filter(l, function(p) {
                return p.get("team") === m
            }).indexOf(n);
            return o
        },
        getModelScorePerDeathRank: function a(n) {
            n = this.get(n);
            if (!(n instanceof h.Model.EORPlayer)) {
                throw new Error("Model in is not a APP.Model.EORPlayer")
            }
            var o = {},
                m = n.get("team"),
                l = this.orderBy("scorePerDeath").reverse();
            o.global = i.indexOf(l, n);
            o.team = i.filter(l, function(p) {
                return p.get("team") === m
            }).indexOf(n);
            return o
        },
        getModelAchievements: function b(n) {
            n = this.get(n);
            if (!(n instanceof h.Model.EORPlayer)) {
                throw new Error("Model in is not a APP.Model.EORPlayer")
            }
            var r = ["platinum", "gold", "silver", "bronze"],
                q = this.getModelKitRank(n),
                m = this.getModelKDRank(n),
                p = this.getModelKillRank(n),
                o = this.getModelScorePerKillRank(n),
                l = this.getModelScorePerDeathRank(n),
                s = {};
            if (q.global === 0) {
                s.kit = r[0]
            } else {
                if (q.team >= 0 && q.team < 3) {
                    s.kit = r[q.team + 1]
                }
            }
            if (m.global === 0) {
                s.kd = r[0]
            } else {
                if (m.team >= 0 && m.team < 3) {
                    s.kd = r[m.team + 1]
                }
            }
            if (p.global === 0) {
                s.kills = r[0]
            } else {
                if (p.team >= 0 && p.team < 3) {
                    s.kills = r[p.team + 1]
                }
            }
            if (o.global === 0) {
                s.scorePerKill = r[0]
            } else {
                if (o.team >= 0 && o.team < 3) {
                    s.scorePerKill = r[o.team + 1]
                }
            }
            if (l.global === 0) {
                s.scorePerDeath = r[0]
            } else {
                if (l.team >= 0 && l.team < 3) {
                    s.scorePerDeath = r[l.team + 1]
                }
            }
            if (n.get("kills") > 5 && n.get("deaths") === 0) {
                s.unstoppable = "unstoppable"
            }
            return s
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = h.Collection.EORPlayers
    }
}(this));
(function(e) {
    var c = e.APP,
        a = c._,
        d = c.$,
        b = c.View.TableRow.prototype;
    c.View.EORTableRow = c.View.TableRow.extend({
        name: "eor-table-row-view",
        tagName: "tr",
        render: function f() {
            var i = this.options.index + 1,
                l = this.renderCell("position", i < 10 ? "0" + i : i),
                h = this.renderCell("name", ""),
                j = this.make("span", {
                    "class": "kit-" + this.model.get("kit")
                }, this.model.get("name")),
                g = this.renderCell("kd"),
                k = this.renderCell("score", this.model.get("score") + String());
            if (this.model.isNew()) {
                this.$el.addClass("empty");
                l.innerHTML = j.innerHTML = g.innerHTML = k.innerHTML = "&nbsp;"
            }
            h.appendChild(j)
        }
    })
}(this));
(function(k) {
    var l = k.APP,
        n = l._,
        f = l.$,
        h = l.win,
        m = l.View.prototype;
    l.View.EOR = l.View.extend({
        name: "eor-view",
        tagName: "div",
        initialize: function j() {
            this.bind("ready:click", this._onReadyClick, this)
        },
        destroy: function p() {
            f(h).unbind("keyup", this.onEscapeClose)
        },
        _onReadyClick: function g() {
            this.hideReadyButton();
            this.$el.addClass("hide");
            this.trigger("ready")
        },
        createTeamTable: function e(q) {
            var u = this.collection.filterBy({
                    team: q
                }),
                r = this.createView(l.View.Table, {
                    view: l.View.EORTableRow,
                    collection: u,
                    headers: [{
                        label: (q === 1 ? "RU" : "US") + " Team",
                        key: "name",
                        attrs: {
                            colspan: 2
                        }
                    }, {
                        label: "K/D",
                        key: "kd"
                    }, {
                        label: "Score",
                        key: "score"
                    }]
                }),
                s = [];
            if (u.length < 16) {
                n.times(16 - u.length, function() {
                    s.push(null)
                });
                u.add(s)
            }
            return r
        },
        showReadyButton: function b() {
            this.readyButton.$el.css({
                opacity: 1,
                right: ""
            });
            return this
        },
        hideReadyButton: function b() {
            this.readyButton.$el.css({
                opacity: 0,
                right: -1000
            });
            return this
        },
        renderPlayer: function d() {
            var q = this.make("div", {
                    "class": "player"
                }),
                y = this.make("h2", null, this.trans("WEB_GAME_EOR_PERSONAL_STATS")),
                v = this.make("div", {
                    "class": "experience"
                }),
                w = this.make("div", {
                    "class": "class kit-" + this.model.get("kit")
                }),
                u = this.make("div", {
                    "class": "kd"
                }),
                x = this.make("span", {
                    "class": "progress"
                }),
                s = this.make("span"),
                r;
            y.appendChild(this.make("span", null, this.model.get("name")));
            q.appendChild(y);
            r = this.make("div");
            if (this.model.get("xpToNextLevel") > 0) {
                v.appendChild(this.make("span", null, (this.model.get("xpToNextLevel") - this.model.get("xp")) + " XP"));
                v.innerHTML += this.trans("WEB_GAME_EOR_XP_TO_NEXT_LEVEL");
                r.appendChild(this.make("span", {
                    "class": "current"
                }, this.model.get("level")));
                r.appendChild(this.make("span", {
                    "class": "next"
                }, this.model.get("level") + 1));
                s.style.width = ((this.model.get("xp") / this.model.get("xpToNextLevel")) * 100) + "%";
                x.appendChild(s)
            } else {
                v.appendChild(this.make("span", null, this.trans("WEB_GAME_EOR_LEVEL") + " " + this.model.get("level")));
                v.innerHTML += this.trans("WEB_GAME_EOR_MAX") + " " + this.trans("WEB_GAME_EOR_LEVEL_REACHED");
                x.className += " full"
            }
            r.appendChild(x);
            v.appendChild(r);
            q.appendChild(v);
            w.appendChild(this.make("div", null, this.trans("WEB_GAME_EOR_CLASS")));
            q.appendChild(w);
            u.appendChild(this.make("span", null, this.model.get("kd")));
            u.appendChild(this.make("div", null, this.trans("WEB_GAME_EOR_KILL_DEATH_RATE")));
            q.appendChild(u);
            this.el.appendChild(q);
            return this
        },
        renderStats: function a() {
            var r = this.make("div", {
                    "class": "stats"
                }),
                y = this.make("h2", null, this.trans("WEB_GAME_EOR_SCORE")),
                w = this.make("div", {
                    "class": "xp"
                }),
                v = this.make("div", {
                    "class": "credits"
                }),
                u = parseInt(this.options.stats.roundXP, 10),
                x = parseInt(this.options.stats.roundBonusXP, 10),
                q = parseInt(this.options.stats.roundVP, 10),
                s = parseInt(this.options.stats.roundBonusVP, 10);
            r.appendChild(y);
            w.appendChild(this.make("span", null, (u - x) + String()));
            w.appendChild(this.make("span", {
                "class": "bonus"
            }, "+" + x));
            w.appendChild(this.make("span", {
                "class": "total"
            }, u + String()));
            w.appendChild(this.make("div", null, this.trans("WEB_GAME_EOR_XP")));
            r.appendChild(w);
            v.appendChild(this.make("span", null, (q - s) + String()));
            v.appendChild(this.make("span", {
                "class": "bonus"
            }, "+" + s));
            v.appendChild(this.make("span", {
                "class": "total"
            }, q + String()));
            v.appendChild(this.make("div", null, this.trans("WEB_GAME_EOR_CREDITS")));
            r.appendChild(v);
            this.el.appendChild(r);
            return this
        },
        renderScoreboard: function i() {
            var s = this.make("div", {
                    "class": "scoreboard"
                }),
                r = this.model.get("team"),
                q = this.createTeamTable(r),
                u = this.createTeamTable(r === 1 ? 2 : 1);
            q.className += " my-team";
            q.options.container = this.make("div");
            q.render().attach();
            q.select(this.model);
            u.className += " thier-team";
            u.options.container = this.make("div");
            u.render().attach();
            s.appendChild(q.options.container);
            s.appendChild(u.options.container);
            this.el.appendChild(s);
            return this
        },
        renderAchievements: function c() {
            var q = this.make("div", {
                    "class": "achievements"
                }),
                s = this.make("h2", {
                    "class": "heading"
                }, this.trans("WEB_GAME_EOR_ACHIEVEMENTS_COMPLETED")),
                u = this.collection.getModelAchievements(this.model),
                r = this.make("div");
            if (u.kit === "platinum") {
                s.appendChild(this.make("span", null, this.trans("WEB_GAME_ACHIEVEMENT_BEST_IN_CLASS_DESCRIPTION_" + this.model.get("kitName").toUpperCase())));
                r.appendChild(this.make("span", {
                    "class": "kit-" + this.model.get("kit") + " " + u.kit
                }))
            }
            q.appendChild(s);
            q.appendChild(r);
            this.el.appendChild(q);
            return this
        },
        render: function o() {
            this.$el.addClass("hide");
            var r = this.model.get("team"),
                q = this.make("div", {
                    "class": "flag big"
                });
            this.$el.addClass(r === this.options.winner ? "won" : "lost");
            this.$el.addClass(this.model.get("teamName").toLowerCase());
            this.el.appendChild(q);
            if (this.isAttached) {
                this.once("attach", function() {
                    q.className = "flag"
                })
            } else {
                this.once("render", function() {
                    q.className = "flag"
                })
            }
            this.renderPlayer();
            this.renderStats();
            this.renderScoreboard();
            this.renderAchievements();
            this.readyButton = this.createView(l.View.Button, {
                className: "play",
                text: this.trans("WEB_GAME_EOR_READY_BTN")
            }, "ready").render().attach();
            this.hideReadyButton();
            setTimeout(n.bind(function() {
                this.$el.removeClass("hide")
            }, this), 100)
        }
    })
}(this));
(function(b) {
    var f = b.APP,
        c = f._,
        g = f.$,
        e = f.View.Overlay.prototype;
    f.View.EORAD = f.View.Overlay.extend({
        name: "eorad-view",
        tagName: "div",
        events: {
            "click a.close": "_onClickClose"
        },
        initialize: function a() {
            e.initialize.apply(this, arguments);
            this.offer = this.options.offer
        },
        _onClickClose: function h() {
            this.trigger("close")
        },
        render: function d() {
            var q = f.ns("config"),
                p = this.make("h1", null, this.trans("WEB_GAME_EORAD_HEAD_KIT_" + this.options.persona.kit) + ":"),
                l = this.make("img", {
                    src: q.imageFolder + "/game/1x1-transparent.png",
                    width: q.imageSize.max.width,
                    height: q.imageSize.max.height,
                    "class": "loading"
                }),
                j = this.make("div", {
                    "class": "bottom"
                }),
                o, n, m, k, i;
            this.el.appendChild(this.make("a", {
                "class": "close"
            }));
            p.appendChild(this.make("span", null, this.model.get("name")));
            this.el.appendChild(p);
            if (this.model.isCustomizable()) {
                k = this.collection.getModelAttachedItems(this.model);
                if (k.texture) {
                    i = k.texture.getAttachmentImage("max")
                } else {
                    i = q.imageFolder + "attachment-icons/max/weapon_texture.png"
                }
            } else {
                i = this.model.getImage("max")
            }
            this.el.appendChild(l);
            this.$(l).disableTextSelect();
            f.preload.image(i, function(r) {
                if (r) {
                    i = q.imageFolder + "attachment-icons/max/weapon_texture.png"
                }
                l.src = i;
                l.className = ""
            });
            if (this.offer.isDiscounted()) {
                this.el.appendChild(this.make("span", {
                    "class": "discount-stamp"
                }, Math.floor(100 - (100 * (this.offer.get("price") / this.offer.get("originalPrice")))) + "%"));
                o = this.make("div", {
                    "class": "discount"
                }, this.trans("WEB_GAME_EORAD_OLD_PRICE_LABEL"));
                o.appendChild(this.make("span", {
                    "class": this.offer.get("currency")
                }, this.offer.get("originalPrice")));
                j.appendChild(o)
            } else {
                j.appendChild(this.make("div"))
            }
            n = this.make("div", {
                "class": "price"
            }, this.trans("WEB_GAME_EORAD_PRICE_LABEL"));
            n.appendChild(this.make("span", {
                "class": this.offer.get("currency")
            }, this.offer.get("price")));
            j.appendChild(n);
            m = this.make("div");
            this.createView(f.View.Button, {
                container: m,
                className: "buy",
                text: this.trans("WEB_GAME_EORAD_BUY_BUTTON"),
                attrs: {
                    href: "#/eor-offer/" + this.offer.id
                }
            }, "button").render().attach();
            j.appendChild(m);
            this.el.appendChild(j)
        }
    })
}(this));
APP.task("eor", ["game", "items", "config"], function taskEOR(k) {
    var b = APP.$,
        r = APP._,
        a = APP.win,
        e = APP.ns("eor"),
        l = APP.ns("game"),
        n = APP.ns("items"),
        f = APP.ns("config"),
        o = function o(s) {
            if (a.hasOwnProperty("eor")) {
                setTimeout(function() {
                    var x;
                    try {
                        x = JSON.parse(a.eor.data)
                    } catch (w) {
                        s(w)
                    }
                    s(null, x)
                }, 0)
            } else {
                b.ajax({
                    url: "/static/eor-data.json",
                    dataType: "json",
                    cache: false,
                    error: function u(y, w, x) {
                        s(x)
                    },
                    success: function v(w) {
                        s(null, w)
                    }
                })
            }
        },
        i, g = function g() {
            if (i) {
                i.destroy();
                i = e.view = null
            }
            i = e.view = new APP.View.EOR();
            i.attach();
            l.asyncPaint()
        },
        q = e.show = function q() {
            if (!i) {
                g()
            }
            o(function s(v, w) {
                if (v) {
                    APP.error(v);
                    return l.quit()
                }
                var u = w.teams[0].players.concat(w.teams[1].players);
                e.players = new APP.Collection.EORPlayers(u);
                e.player = e.players.get(w.localPlayer.name);
                if (a.soldier) {
                    e.player.set({
                        xp: a.soldier.xp,
                        level: a.soldier.level,
                        xpToNextLevel: a.soldier.xpToNextLevel
                    })
                } else {
                    e.player.set({
                        xp: 56018,
                        level: 25,
                        xpToNextLevel: 0
                    })
                }
                i.model = i.options.model = e.player;
                i.collection = i.options.collection = e.players;
                i.options.winner = parseInt(w.winner, 10);
                i.options.stats = w.stats;
                i.render();
                i.bind("ready", function() {
                    a.playSound("Ready", "Click EOR ready button");
                    if (l.model.get("state") === 3) {
                        r.delay(l.startNewRound, 500)
                    }
                });
                i.bind("close", function x() {
                    var y = new APP.View.Dialog(),
                        z = function z() {
                            y.destroy();
                            y = null
                        };
                    y.setRenderData({
                        title: "Confirm <span>Quit game</span>",
                        body: "Are you sure you wish quit the current game?",
                        close: true,
                        buttonLeft: "No, stay and play",
                        buttonRight: "Yes, quit now"
                    });
                    y.bind("close", z);
                    y.bind("button:left", z);
                    y.bind("button:right", function() {
                        z();
                        l.quit()
                    });
                    y.render();
                    y.attach();
                    y.$el.find("h2.title, div.body").renderText();
                    y.$el.find("a.button, a.button-view").renderText({
                        hover: true
                    });
                    y.show()
                });
                i.$("h2").renderText(true);
                i.$("div.player div.experience span, div.player div.class, div.player div.kd").renderText(true);
                i.$("div.stats div.xp, div.stats div.credits").renderText(true);
                i.$("div.scoreboard th, div.scoreboard tr:not(.empty) td").renderText(true);
                i.$("div.achievements div span").renderText(true);
                i.$("a.button, a.button-view").renderText(true)
            })
        },
        h = e.hide = function h() {
            if (i) {
                i.$el.empty()
            }
        },
        p = function p(v) {
            if (!f.model.get("forceEORAD")) {
                if (!f.showEorAds) {
                    return r.delay(v, 0, new Error("EORAD's is disabled!"))
                }
                if (f.model.get("hasSeenEORAD")) {
                    return r.delay(v, 0, new Error("EORAD's has already been seen!"))
                }
                var u = APP.randomInt(0, f.adFrequency),
                    s = APP.randomInt(0, f.adFrequency);
                if (u !== s) {
                    return r.delay(v, 0, new Error("Not in adFrequency"))
                }
            }
            b.ajax({
                url: "/en/ads/getEORAd",
                dataType: "json",
                cache: false,
                data: {
                    kit: l.persona.get("kit"),
                    personaId: l.persona.id
                },
                error: function w(A, x, z) {
                    v(z)
                },
                success: function y(x) {
                    if (x && x.status === "success" && !r.isEmpty(x.data)) {
                        v(null, x.data)
                    } else {
                        v(new Error("No ads for you"))
                    }
                }
            })
        },
        j = function j(u, s) {
            b.ajax({
                url: "/en/dc/submitData",
                type: "post",
                data: JSON.stringify([{
                    table: "adclicks",
                    data: u
                }]),
                dataType: "json",
                cache: false,
                complete: s
            })
        },
        d = function d() {
            p(function s(x, y) {
                if (!x) {
                    var v = n.collection.get(y.itemId),
                        w = new APP.Model.Offer(y),
                        A = e.eorad = new APP.View.EORAD({
                            collection: n.collection,
                            model: v,
                            offer: w,
                            persona: f.persona
                        }),
                        u = {
                            pid: f.persona.id,
                            itemid: v.id,
                            offerid: w.id,
                            viewstate: "viewed",
                            spot: "eor"
                        };
                    j(u, function z() {
                        A.bind("close", function B() {
                            u.viewstate = "dismissed";
                            j(u, function D() {
                                A.destroy();
                                A = null
                            })
                        });
                        A.bind("button:click", function C() {
                            u.viewstate = "clicked";
                            j(u, function D() {
                                APP.navigate("/eor-offer/" + w.id);
                                A.destroy();
                                A = null;
                                l.quit()
                            })
                        });
                        A.render().attach().show();
                        A.$("h1, div.discount, div.price, span.discount-stamp").renderText(true);
                        A.$("a.button-view").renderText({
                            hover: true,
                            separate: "none"
                        });
                        f.model.set({
                            hasSeenEORAD: true
                        });
                        if (i) {
                            i.showReadyButton()
                        }
                    })
                } else {
                    if (i) {
                        i.showReadyButton()
                    }
                }
            })
        };
    l.bind("round:new", g);
    l.bind("load:start", function m() {
        var s = b("#menu-tooltip");
        s.overlay().close();
        s.hide();
        g()
    });
    l.bind("state", function c(s) {
        if (i) {
            if (s.get("state") === 3) {
                d()
            } else {
                i.hideReadyButton()
            }
        }
    });
    l.bind("screen:eor", q);
    APP.route("eorad/:offer", "eorad", function(s) {
        n.getItemByOfferId(s, function(z, v, x) {
            APP.navigate("");
            if (z) {
                return APP.warn(z)
            }
            var y = x.at(0),
                A = e.eorad = new APP.View.EORAD({
                    collection: n.collection,
                    model: v,
                    offer: y,
                    persona: f.persona
                });
            A.bind("close", function u() {
                A.destroy();
                A = null
            });
            A.bind("button:click", function w() {
                A.destroy();
                A = null;
                if (l.isPlaying()) {
                    APP.navigate("/offer/" + y.id);
                    l.quit()
                } else {
                    APP.navigate("/offer/" + y.id, true)
                }
            });
            A.render().attach().show();
            A.$("h1, div.discount, div.price, span.discount-stamp").renderText(true);
            A.$("a.button-view").renderText({
                hover: true,
                separate: "none"
            })
        })
    });
    k()
});
APP.task("preload", ["config", "weapons"], function taskPreload(a) {
    var c = APP.win,
        b = APP.$,
        g = APP._,
        h = b.magma.jsVariables.imageFolder,
        d = [],
        f = g.after(2, a),
        e = APP.ns("items").collection.filterBy({
            itemType: "weapon"
        }),
        i = g.after(e.length * 2, function() {
            APP.timeEnd("pre-compose weapon images");
            f()
        });
    APP.time("pre-compose weapon images");
    e.invoke("composeImage", "med", i);
    e.invoke("composeImage", "min", i);
    d.push(h + "game/bg.jpg");
    d.push(h + "game/containers/column_box.jpg");
    d.push(h + "game/containers/column_box_large.jpg");
    d.push(h + "game/progress_bar-dark.png");
    d.push(h + "game/progress_bar-empty.png");
    d.push(h + "game/soldierlist-bg.jpg");
    d.push(h + "game/checkbox-icon.png");
    d.push(h + "game/maps/karkand.jpg");
    d.push(h + "game/maps/oman.jpg");
    d.push(h + "game/maps/sharqi.jpg");
    d.push(h + "game/maps/basra.jpg");
    d.push(h + "game/maps/dragonvalley.jpg");
    d.push(h + "game/maps/dalianplant.jpg");
    d.push(h + "game/table-header.gif");
    d.push(h + "game/sort-arrows.png");
    d.push(h + "game/headers-selected.jpg");
    d.push(h + "game/headers-selected_grey.png");
    d.push(h + "game/serverbrowser-icons.png");
    d.push(h + "game/bg-noise-620px.jpg");
    d.push(h + "game/bg-noise-darker-620px.jpg");
    d.push(h + "game/bg-noise-dark2-620px.jpg");
    d.push(h + "game/attachment-label-sprite.png");
    d.push(h + "item-icons/items-ability.png");
    d.push(h + "item-icons/items-min.png");
    d.push(h + "item-icons/items-upgrade-min.png");
    d.push(h + "item-icons/items-upgrade-med.png");
    d.push(h + "game/credits-25.png");
    d.push(h + "game/funds-25.png");
    d.push(h + "class-icons/engineer.png");
    d.push(h + "class-icons/medic.png");
    d.push(h + "class-icons/assault.png");
    d.push(h + "class-icons/recon.png");
    d.push(h + "game/abilities-bg.jpg");
    d.push(h + "game/buy-mock.png");
    d.push(h + "game/game-menu.jpg");
    d.push(h + "game/menu-arrow.png");
    d.push(h + "game/play-arrow.png");
    d.push(h + "game/header-arrow.png");
    d.push(h + "game/icon-bg.png");
    d.push(h + "game/item-hover.jpg");
    d.push(h + "game/headers.jpg");
    d.push(h + "game/headers-selected.jpg");
    d.push(h + "game/tiled-background-large.jpg");
    d.push(h + "game/map-default.jpg");
    d.push(h + "game/store_sprites.png");
    d.push(h + "game/store_warnings.png");
    d.push(h + "game/customization-case.png");
    d.push(h + "game/customization-icon-sprite.png");
    d.push(h + "game/dialog-icons/apparel-exclaim.png");
    d.push(h + "game/dialog-icons/battlefunds.png");
    d.push(h + "game/dialog-icons/default.png");
    d.push(h + "game/dialog-icons/error.png");
    d.push(h + "game/dialog-icons/keys-exclaim.png");
    d.push(h + "game/dialog-icons/keys-questionmark.png");
    d.push(h + "game/dialog-icons/reset.jpg");
    d.push(h + "game/pockets-sprite.png");
    if (!c.doll) {
        d.push(h + "game/bf-doll.png")
    }
    APP.time("Preload images");
    APP.preload.image(d, function() {
        APP.timeEnd("Preload images");
        f()
    })
});
APP.domTask("error", function initializeErrors(b) {
    var f = APP.$,
        c = APP._,
        g = APP.win,
        h = {
            title: "Error!",
            buttonRight: "OK"
        },
        a, e = function() {
            if (a) {
                a.destroy()
            }
            APP.log("APP.View.Dialog:reload");
            APP.reload()
        },
        d = function d(j) {
            if (typeof j === "string") {
                j = {
                    body: j
                }
            } else {
                if (j instanceof Error) {
                    j = {
                        body: j.message
                    }
                } else {
                    if (c.isArray(j)) {
                        j = {
                            body: "<p>" + j.join("</p><p>") + "</p>"
                        }
                    }
                }
            }
            if (a) {
                a.destroy();
                a = null
            }
            var k = c.extend({}, h, j);
            a = new APP.View.Dialog({
                className: "error-dialog",
                renderData: k
            });
            a.bind("close", e);
            a.bind("button:right", e);
            a.bind("render", function i() {
                a.$el.find("h2.title, div.body").renderText();
                a.$el.find("a.button, a.button-view").renderText({
                    hover: true
                })
            });
            a.attach();
            a.render();
            a.show()
        };
    APP.once("error", d);
    b()
});
(function(d) {
    if (!d.APP && (typeof require !== "undefined")) {
        d.APP = require("../common/app")
    }
    var c = d.APP,
        b = c.Model.prototype,
        a = c._;
    c.Model.Game = c.Model.extend({
        defaults: {
            version: 0,
            state: 0
        },
        schema: {
            state: "number"
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = c.Model.Game
    }
}(this));
(function(c) {
    if (!c.APP && (typeof require !== "undefined")) {
        c.APP = require("../common/app")
    }
    var f = c.APP,
        e = f.Model.prototype,
        d = f._;
    f.Model.Persona = f.Model.extend({
        defaults: {
            name: "",
            isMaxLevel: false,
            level: 0,
            nextLevel: 0,
            xp: 0,
            xpForNextLevel: 0,
            xpToNextLevel: 0,
            levelUpProgression: 0,
            levelDescription: ""
        },
        schema: {
            level: "number",
            nextLevel: "number",
            xp: "number",
            xpForNextLevel: "number",
            xpToNextLevel: "number",
            levelUpProgression: "number",
            isMaxLevel: "boolean"
        },
        initialize: function b() {
            this._setNextLevel();
            this.bind("change:level", this._setNextLevel, this);
            this._setXpToNextLevel();
            this.bind("change:xpForNextLevel", this._setXpToNextLevel, this);
            this.bind("change:xp", this._setXpToNextLevel, this)
        },
        _setNextLevel: function g() {
            this.set({
                nextLevel: this.get("level") + 1
            })
        },
        _setXpToNextLevel: function a() {
            this.set({
                xpToNextLevel: this.get("xpForNextLevel") - this.get("xp")
            })
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = f.Model.Persona
    }
}(this));
(function(a) {
    if (!a.APP && (typeof require !== "undefined")) {
        a.APP = require("../common/app")
    }
    if (!a.APP.Model && (typeof require !== "undefined")) {
        a.APP.Collection = require("../common/collection")
    }
    if (!a.APP.Model.Persona && (typeof require !== "undefined")) {
        a.APP.Model.Persona = require("./model.persona")
    }
    var c = a.APP,
        b = c._,
        d = c.$;
    c.Collection.Personas = c.Collection.extend({
        model: c.Model.Persona
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = c.Collection.Personas
    }
}(this));
APP.task("game", ["config"], function taskGame(p) {
    var d = APP.win,
        f = APP.$,
        v = APP._,
        q = APP.ns("game"),
        m = APP.ns("config"),
        e = q.model = new APP.Model.Game(),
        g = q.persona = new APP.Model(m.persona),
        u = null,
        j = d._gameEventListeners = {};
    if (d.hasOwnProperty("game")) {
        u = d.game
    }
    f("#game-version span.game").html(m.gameVersion);
    d.frontend_setScreen = function k(z) {
        var x = {
                0: "NullScreen",
                1: "MainScreen",
                2: "LoadingScreen",
                3: "EndOfRoundScreen"
            },
            y = x[z];
        q.gotoScreen(z)
    };
    q.isPlaying = function b() {
        return (u && u.mapName !== "$noCurrentGame")
    };
    q.quit = function w() {
        if (q.isPlaying()) {
            u.quitGame()
        } else {
            q.gotoScreen(1)
        }
        return q
    };
    q.startNewRound = function a() {
        if (u) {
            u.startNewRound()
        }
        q.trigger("round:new");
        return q
    };
    q.gotoScreen = function i(z) {
        var x = ["empty", "main", "load", "eor"],
            y = x[z];
        q.trigger("screen", z, y);
        q.trigger("screen:" + y, z, y);
        q.asyncPaint();
        return q
    };
    q.asyncPaint = function h() {
        if (d.frontendCoreLoop && d.frontendCoreLoop.asyncPaint) {
            d.frontendCoreLoop.asyncPaint()
        }
        return q
    };
    if (q.isPlaying()) {
        f.magma.debugLog("debug", "Reloading frontend while in game!: " + u.mapName);
        q.quit()
    } else {
        j.onLoadingStart = function n() {
            APP.log("load:start");
            q.trigger("load:start")
        };
        j.onLoadingProgressUpdated = function r(x) {
            APP.log("load:update", x);
            q.trigger("load:update", x)
        };
        j.onLoadingAborted = function s(x) {
            APP.log("load:abort");
            q.trigger("load:abort")
        };
        j.onLoadingComplete = function o(x) {
            APP.log("load:complete");
            q.trigger("load:complete")
        };
        j.onBeginRoundStateChanged = function l(x) {
            APP.log("changed:state", x);
            e.set({
                state: x
            })
        };
        e.bind("change:state", function() {
            q.trigger("state", e)
        });
        j.onGameStarted = function c(x) {
            m.model.set({
                "check-eor-reported": x
            })
        };
        if (u) {
            u.addEventHandler("onLoadingStart", "_gameEventListeners.onLoadingStart");
            u.addEventHandler("onLoadingProgressUpdated", "_gameEventListeners.onLoadingProgressUpdated");
            u.addEventHandler("onLoadingAborted", "_gameEventListeners.onLoadingAborted");
            u.addEventHandler("onLoadingComplete", "_gameEventListeners.onLoadingComplete");
            u.addEventHandler("onBeginRoundStateChanged", "_gameEventListeners.onBeginRoundStateChanged");
            d.matchmaking.addEventHandler("onGameStarted", "_gameEventListeners.onGameStarted");
            e.set({
                version: u.version,
                loadingProgress: u.loadingProgress,
                mapName: u.mapName,
                firstTimePlaying: u.firstTimePlaying,
                timeToNextStateChange: u.timeToNextStateChange
            })
        }
    }
    p()
});
APP.task("game.frontend", ["game"], function taskGame(c) {
    var f = APP.win,
        e = APP.$,
        h = APP._,
        k = APP.ns("game"),
        i = APP.ns("config"),
        g = {
            "0": "Undefined",
            "1": "You have been kicked from the server.",
            "2": "You are banned from this server.",
            "3": "Connection to server lost.",
            "4": "KeyInUse",
            "5": "KeyNotValid",
            "6": "Invalid Game Data",
            "7": "InvalidExe",
            "8": "You are running an older version of the game.",
            "9": "You are running an newer version of the game.",
            "10": "Reset",
            "11": "InvalidPassword",
            "12": "InvalidReserverPassword",
            "13": "Server is full.",
            "14": "PunkBusterNotEnabled",
            "15": "Failed to connect.",
            "16": "Deleted1",
            "17": "Deleted2",
            "18": "Deleted3",
            "19": "Deleted4",
            "20": "RestartMenu",
            "21": "Map not found",
            "22": "Kicked by PunkBuster.",
            "23": "Corrupt Data Critical.",
            "24": "KickedReservedSlots",
            "25": "KeyDisabled",
            "26": "KeyXPack1NotInstalled",
            "27": "KeyXPack2NotInstalled",
            "28": "KeyXPack1NotAuthorized",
            "29": "KeyXPack2NotAuthorized",
            "30": "ModNotFound",
            "31": "AboveMaxRank",
            "32": "PlayerLeft"
        },
        a = f.frontend || {},
        j = function j(m, n) {
            var l = function l(o) {
                if (o && (o.data === "END_OF_ROUND_REPORTED" || o.message === "END_OF_ROUND_REPORTED")) {
                    j.count = 0;
                    n()
                } else {
                    j.count += 1;
                    h.delay(j, 2000, m, n)
                }
            };
            if (j.count === 5) {
                j.count = 0;
                n(new Error("Nothing found"))
            } else {
                if (!j.hasOwnProperty("count")) {
                    j.count = 0
                }
                e.ajax({
                    url: i.eorUrl + m,
                    dataType: "json",
                    cache: false,
                    success: l,
                    error: l
                })
            }
        },
        b = function b(n) {
            if (n) {
                var l = new APP.View.Dialog({
                    className: "stats-refresh-failed-dialog",
                    renderData: {
                        title: APP.sidis.trans("WEB_GAME_TOOLTIPS_HEADER_STATS_FAILED"),
                        body: APP.sidis.trans("WEB_GAME_TOOLTIPS_MESSAGE_STATS_FAILED"),
                        buttonRight: "Ok"
                    }
                });
                l.bind("button:right", function m() {
                    l.destroy();
                    l = null;
                    c()
                });
                l.render();
                l.attach();
                l.$("h2.title, div.body").renderText();
                l.$("a.button, a.button-view").renderText({
                    hover: true
                });
                l.show()
            } else {
                APP.reload()
            }
        },
        d = function d() {
            var n = a.activationReason || 32,
                l, o = (f.location.hash.indexOf("eor-offer") !== -1);
            if (o) {
                n = 32
            }
            if (n !== 0) {
                if (n === 32) {
                    l = new APP.View.Dialog({
                        className: "frontend-activation-dialog",
                        renderData: {
                            title: APP.sidis.trans("WEB_GAME_TOOLTIPS_HEADER_LEAVING"),
                            body: APP.sidis.trans("WEB_GAME_TOOLTIPS_MESSAGE_LEAVING")
                        }
                    });
                    APP.reload(1000)
                } else {
                    l = new APP.View.Dialog({
                        className: "frontend-activation-dialog",
                        renderData: {
                            title: APP.sidis.trans("WEB_GAME_TOOLTIPS_HEADER_DISCONNECTED"),
                            body: APP.sidis.trans("WEB_GAME_TOOLTIPS_MESSAGE_DISCONNECTED_" + n),
                            buttonRight: "Ok"
                        }
                    });
                    l.bind("button:right", function m() {
                        l.$el.hide();
                        APP.reload()
                    })
                }
                l.render();
                l.attach();
                l.$("h2.title, div.body").renderText();
                l.$("a.button, a.button-view").renderText({
                    hover: true
                });
                l.show();
                k.asyncPaint()
            }
        };
    k.bind("screen:main", d);
    if (i.model.has("check-eor-reported")) {
        j(i.model.get("check-eor-reported"), b);
        i.model.unset("check-eor-reported")
    } else {
        c()
    }
});
APP.task("game-items", ["items", "abilities"], function taskGameItems(l) {
    var f = APP.$,
        s = APP._,
        e = APP.win,
        m = APP.namespace("game"),
        r = APP.namespace("items"),
        j = APP.namespace("config"),
        i = APP.namespace("abilities"),
        n = null,
        d = {
            0: "Unknown bar",
            1: "Clothing Bar",
            2: "Equipment Bar",
            3: "Emote Bar",
            4: "Mission Bar",
            5: "Passive Inventory"
        },
        g = {
            0: "ErrNone",
            5003: "ErrAssetInvalid",
            5009: "ErrAssetLevel",
            5013: "ErrAssetMissingDependencies",
            5017: "ErrTooFewPrimaryWeapons",
            5018: "ErrTooManyPrimaryWeapons",
            5019: "ErrTooFewSecondaryWeapons",
            5020: "ErrTooManySecondaryWeapons",
            5021: "ErrInvalidAssetForTeam",
            5022: "ErrInvalidAssetForKit",
            5023: "ErrInvalidAttachmentParent"
        },
        a = m.giveItems = function a(z, A) {
            var x = {
                    EquipmentBar: [],
                    MissionBar: [],
                    VisualItems: [],
                    PassiveItems: [],
                    AttachmentItems: []
                },
                y;
            r.collection.getEquipped("weapon").forEach(function w(C) {
                x.EquipmentBar.push({
                    id: C.id,
                    count: C.get("usecount"),
                    position: C.get("equippedSlot")
                });
                if (C.isCustomizable()) {
                    s.forEach(C.collection.getModelAttachedItems(C, true), function(D) {
                        x.AttachmentItems.push({
                            id: D.id,
                            parentid: C.id
                        })
                    })
                }
            });
            r.collection.getEquipped("appearance").forEach(function w(C) {
                if (!C.isDefault()) {
                    x.VisualItems.push({
                        id: C.id,
                        position: C.get("equippedSlot")
                    })
                }
                if (C.isCustomized()) {
                    s.forEach(C.get("upgrades"), function(D) {
                        if (D) {
                            x.PassiveItems.push({
                                id: D
                            })
                        }
                    })
                }
            });
            i.collection.filterBy({
                passive: true
            }).forEach(function(C) {
                x.PassiveItems.push({
                    id: C.id,
                    count: C.get("usecount")
                })
            });
            r.collection.byType("booster").forEach(function v(C) {
                if (C.isAllowedInGame()) {
                    x.PassiveItems.push({
                        id: C.id
                    })
                }
            });
            y = JSON.stringify(x);
            if (A && (e.soldier && y !== n)) {
                f.magma.debugLog("debug", "    EquipmentBar: " + JSON.stringify(x.EquipmentBar));
                f.magma.debugLog("debug", " AttachmentItems: " + JSON.stringify(x.AttachmentItems));
                f.magma.debugLog("debug", "     VisualItems: " + JSON.stringify(x.VisualItems));
                f.magma.debugLog("debug", "    PassiveItems: " + JSON.stringify(x.PassiveItems));
                f.magma.debugLog("debug", "    Send to game? " + (y !== n));
                n = y;
                setTimeout(function B() {
                    var C = e.soldier.giveItems(y),
                        D = JSON.parse(C),
                        E = s.map(D, function(G) {
                            var H = "Item: " + G.ItemId,
                                F = r.collection.get(G.ItemId);
                            H += " (" + (F ? F.get("name") : "No Item") + ")";
                            H += " Error: " + G.ErrCode;
                            H += " (" + (g[G.ErrCode] || "Unknown :S") + ")";
                            H += " Error: " + G.CustBar;
                            H += " (" + (d[G.CustBar] || "Unknown :S") + ")";
                            return H
                        });
                    if (E.length !== 0) {
                        n = null;
                        f.magma.debugLog("debug", "ERROR::giveItems: " + E.join(", "));
                        if (z) {
                            z(E)
                        }
                    } else {
                        if (z) {
                            z()
                        }
                    }
                }, 0)
            } else {
                if (z) {
                    z()
                }
            }
            return m
        },
        o = {},
        p = s.debounce(function p(w, A, y, z) {
            var B = JSON.stringify(A);
            if (z || o[w] !== B) {
                o[w] = B;
                f.ajax({
                    type: "POST",
                    url: w,
                    data: A,
                    success: function v(C) {
                        if (C && C.status === "success") {
                            y()
                        } else {
                            o[w] = null;
                            y(new Error("Save request failed to return a success response!"))
                        }
                    },
                    error: function x() {
                        o[w] = null;
                        y(new Error("Save request return an error!"))
                    }
                })
            } else {
                setTimeout(y, 0)
            }
        }, 100),
        b = m.saveWeapons = function b(x) {
            var v = j.saveEquipmentUrl,
                y = {
                    equipment: JSON.stringify(r.collection.getLoadout("weapon"))
                };
            p(v, y, function w(z) {
                a();
                if (x) {
                    x(z)
                } else {
                    if (z) {
                        throw z
                    }
                }
            });
            return m
        },
        u = m.saveAppearance = function u(x) {
            var v = j.saveAppearanceUrl,
                y = {
                    appearance: JSON.stringify(r.collection.getLoadout("appearance"))
                };
            p(v, y, function w(z) {
                a();
                if (x) {
                    x(z)
                } else {
                    if (z) {
                        throw z
                    }
                }
            });
            return m
        },
        h = m.saveCustomizations = function q(w, x) {
            w = r.collection.get(w);
            if (!(w instanceof APP.Model.Item)) {
                if (x) {
                    return x(new Error('Invalid Model "' + w + '"'))
                } else {
                    throw new Error('Invalid Model "' + w + '"')
                }
            }
            var v = j.saveCustomizationUrl + "#" + w.id,
                A = {},
                z = {
                    itemId: w.id
                };
            s.forEach(w.getCustomizations(), function(B, C) {
                A[C] = (B && B.id) || null
            });
            z.customization = JSON.stringify(A);
            p(v, z, function y(B) {
                a();
                if (x) {
                    x(B)
                } else {
                    if (B) {
                        throw B
                    }
                }
            });
            return m
        },
        c = m.saveAll = function c() {
            b();
            u();
            r.collection.filterBy({
                isCustomizable: true,
                owned: true
            }).forEach(h);
            return m
        };
    m.bind("save:weapons", b);
    m.bind("save:weapon", b);
    m.bind("save:appearance", u);
    m.bind("save:appearances", u);
    m.bind("save:customization", h);
    m.bind("save:customizations", h);
    m.bind("save", c);
    m.bind("giveitems", a);
    o[j.saveEquipmentUrl] = JSON.stringify({
        equipment: JSON.stringify(r.collection.getLoadout("weapon"))
    });
    o[j.saveAppearanceUrl] = JSON.stringify({
        appearance: JSON.stringify(r.collection.getLoadout("appearance"))
    });
    r.collection.filterBy({
        owned: true,
        isCustomizable: true
    }).forEach(function(v) {
        o[j.saveCustomizationUrl + "#" + v.id] = JSON.stringify({
            itemId: v.id,
            customization: JSON.stringify(v.get("attachments"))
        })
    });
    APP.ready(function() {
        n = null;
        a()
    });
    m.validate = function k() {
        var x = r.collection.filterBy({
                itemType: function(C) {
                    return C === "weapon" || C === "appearance"
                },
                isEquipped: true
            }),
            v = x.filterBy({
                isAllowedInGame: false
            }),
            w, B = 1,
            A, y, z = new Error();
        if (v.length === 0) {
            A = r.collection.get(7000);
            if (A && A.isOwned()) {
                B = 2
            } else {
                y = r.collection.getEquippedCustomizations().get(7109);
                if (y && y.isEquipped() && y.isOwned()) {
                    B = 2
                }
            }
            w = x.filterBy({
                itemType: "weapon",
                isEquipped: true,
                validationGroup: "primary"
            });
            if (w.length > B && w === 0) {
                z.type = "NumPrimaryWeapons";
                z.items = w;
                return z
            }
        } else {
            z.type = "Invalid";
            z.items = v;
            return z
        }
        return true
    };
    l()
});
APP.domTask("game-vip", ["servers"], function taskGameVIP(b) {
    var c = APP.$,
        f = APP._,
        e = APP.win,
        j = APP.namespace("game"),
        h = APP.namespace("config"),
        g = j.vipStatusChanged,
        a = function a(l) {
            var k = [];
            k.push('<li server-id="' + l.id + '">');
            k.push('<span class="' + (l.bookmarked ? "is" : "not") + '-bookmarked"></span>');
            k.push('<span class="name">' + l.name + "</span>");
            k.push("</li>");
            return k.join("")
        },
        i = f.map(g.added || [], a),
        d = f.map(g.removed || [], a);
    if (i.length !== 0 || d.length !== 0) {
        APP.ready(function() {
            var m = new APP.View.Dialog({
                    className: "vip-status-changed-dialog"
                }),
                n = {
                    close: true,
                    title: "VIP <span>Change Notification</span>",
                    buttonRight: "Ok",
                    body: ""
                },
                l = function l() {
                    m.$el.addClass("loading");
                    c.ajax({
                        type: "POST",
                        url: h.vipUpdatedURL,
                        cache: false,
                        complete: function o() {
                            m.destroy();
                            m = null
                        }
                    })
                };
            if (i.length) {
                n.body += "<h3>You have been added as a VIP on the following servers</h3>";
                n.body += "<ul>" + i.join("") + "</ul>"
            }
            if (d.length) {
                n.body += "<h3>You have been removed as a VIP on the following servers</h3>";
                n.body += "<ul>" + d.join("") + "</ul>"
            }
            m.$el.delegate("span.is-bookmarked, span.not-bookmarked", "click", function k(r) {
                r.preventDefault();
                var q = c(r.currentTarget),
                    p = q.parent().attr("server-id"),
                    o = new APP.Model.Server({
                        persistentId: p,
                        bookmarked: q.hasClass("is-bookmarked")
                    });
                q.addClass("loading");
                o.bind("change:bookmarked", function() {
                    q.removeClass("is-bookmarked not-bookmarked loading");
                    if (o.get("bookmarked")) {
                        q.addClass("is-bookmarked")
                    } else {
                        q.addClass("not-bookmarked")
                    }
                });
                if (o.get("bookmarked")) {
                    o.removeBookmark()
                } else {
                    o.addBookmark()
                }
            });
            m.bind("close", l);
            m.bind("button:right", l);
            m.setRenderData(n);
            m.attach();
            m.render();
            m.$("h2.title, span.name").renderText();
            m.$(".button").renderText({
                hover: true
            });
            m.show()
        })
    }
    b()
});
APP.task("game.events", ["config"], function taskGameEvents(m) {
    var f = APP.win,
        u = APP._,
        e = f.JSON,
        p = APP.ns("game"),
        h = APP.ns("config"),
        k = APP.ns("store"),
        r = APP.ns("items"),
        g = APP.$,
        b = {
            LevelUpEvent: "level",
            level: "level"
        },
        j = h.gameEventsUrl,
        a = p.getGameEvents = function a(v) {
            g.ajax({
                url: j,
                data: {
                    personaId: h.persona.id
                },
                dataType: "json",
                cache: false,
                success: function(w) {
                    if (w && w.status === "success") {
                        v(null, w.data.unlockInfo)
                    } else {
                        v(new Error("Unable to get game events!"))
                    }
                },
                error: function() {
                    v(new Error("Unable to get game events!"))
                }
            })
        },
        l = p.getGameEvents = function a(v, w) {
            g.ajax({
                url: h.deleteEventsUrl,
                data: {
                    gameEvents: e.stringify(u.pluck(v, "eventId"))
                },
                type: "post",
                dataType: "json",
                cache: false,
                success: function(x) {
                    if (!x || x.status !== "success") {
                        APP.warn(new Error("Unable to delete game events!"))
                    }
                },
                error: function() {
                    APP.warn(new Error("Unable to delete game events!"))
                }
            })
        },
        n, q, s = function i(v) {
            if (n) {
                n.destroy();
                n = null
            }
            if (q) {
                q.destroy();
                q = null
            }
            if (v) {
                l(v)
            }
        },
        o = function o(v, z) {
            z = z || 0;
            var y = v[z],
                B = (b[y.lockType] || y.lockType).toLowerCase(),
                C = r.collection.filterBy({
                    lockType: B,
                    lockCriteria: y.lockCriteria,
                    buyable: true
                }),
                A = function A() {
                    z += 1;
                    if (z >= v.length) {
                        s(v)
                    } else {
                        o(v, z)
                    }
                },
                x;
            C.comparator = null;
            if (B === "level") {
                x = parseInt(y.lockCriteria, 10);
                u.forEach(h.pockets.unlockLevels, function(G, F) {
                    var E = u.indexOf(G, x),
                        D;
                    if (E !== -1) {
                        D = r.collection.getBy({
                            category: F,
                            itemType: "pocket"
                        });
                        if (D) {
                            C.unshift(D)
                        }
                    }
                });
                C.unshift({
                    name: "1 Training point",
                    itemType: "tp",
                    id: "tp",
                    buyable: false
                })
            }
            if (C.length === 0) {
                return A()
            }
            n = new APP.View.GameEvent({
                collection: C,
                lockType: B,
                lockCriteria: y.lockCriteria
            });
            n.bind("show", function() {
                n.$("h1, h2, div.prices, a.button-view, span.more-info, div.lock span.key, div.lock span.type, div.lock-text").renderText(true);
                n.bind("item:render", function() {
                    n.$("h2, div.prices, a.button-view, span.more-info").renderText()
                })
            });
            n.bind("item:enter:info", function(D, E, F) {
                if (E.isItemType("weapon")) {
                    q.renderModelAndShow(E, F.currentTarget)
                } else {
                    r.tooltip.renderModelAndShow(E, F.currentTarget, {
                        stats: true,
                        description: true,
                        dependency: true
                    })
                }
            });
            n.bind("item:leave:info", function() {
                q.hide();
                r.tooltip.hide()
            });
            n.bind("close", function() {
                n.destroy();
                n = null;
                A()
            });
            n.bind("buy", function w(D, E) {
                k.trigger("buy", E)
            });
            n.render().attach().show()
        },
        c = function d(v) {
            s();
            q = new APP.View.StatsTooltip().attach();
            q.bind("render", function() {
                q.$("div.stat-title, span.best-in-class").renderText()
            });
            o(v)
        };
    a(function(w, v) {
        if (!w && !u.isEmpty(v)) {
            APP.ready(function() {
                u.defer(c, v)
            })
        }
        m()
    })
});
APP.task("game-sound", "config", function taskGame(d) {
    var f = APP.win,
        i = APP._,
        g = APP.doc,
        l = APP.ns("game"),
        j = APP.ns("config"),
        k = f.game,
        a = {
            next: "beep_click02.wav",
            prev: "beep_click01.wav",
            revert: "general_movement02.wav",
            click: "general_click.wav",
            "click:button": "general_stat04.wav",
            "click:buybutton": "buy.wav",
            "click:open": "menu_click.wav",
            "click:disabled": "general_movement05.wav",
            hover: "general_mouseover.wav",
            "select:open": "menu_slide_up.wav",
            "select:close": "menu_slide_down.wav",
            equip: "menu_drop.wav",
            unequip: "general_movement04.wav",
            error: "general_stat03.wav",
            close: "menu_quit.wav"
        },
        b = {
            next: "Select",
            prev: "Select",
            revert: "Reset",
            click: "Click",
            "click:button": "Click",
            "click:buybutton": "ClickBuy",
            "click:open": "Click",
            hover: "Select",
            "select:open": "BarSlideUp",
            "select:close": "BarSlideDown",
            equip: "Pickup",
            unequip: "Drop",
            error: "Error",
            close: "Click"
        },
        h = l.sound = function h(m) {
            if (k) {
                if (b.hasOwnProperty(m)) {
                    k.playSound(b[m])
                } else {
                    k.playSound(m)
                }
            } else {
                if (!a.hasOwnProperty(m)) {
                    APP.warn(new Error('Unable to play sound, no sound named "' + m + '"'))
                } else {
                    if (h.audio[m]) {
                        h.audio[m].play()
                    }
                }
            }
        },
        c;
    h.audio = {};
    h.test = function e() {
        var m = new APP.View.Dialog({
            className: "sound-test-dialog"
        });
        m.once("close", function() {
            m.destroy();
            m = null
        });
        m.setRenderData({
            close: true,
            title: "Test <span>Sounds</span>",
            body: i.map(a, function(o, n) {
                return '<a href="#sound-' + n + '"><strong>' + n + "</strong> (" + o + ")</a>"
            })
        });
        m.$el.delegate("div.body a", "click", function(o) {
            o.preventDefault();
            var n = o.currentTarget.href.split("-").pop();
            h(n)
        });
        m.render();
        m.attach();
        m.$("h2").renderText();
        m.$("div.body a").renderText({
            hover: true
        });
        m.show()
    };
    if (!k) {
        i.forEach(a, function(n, m) {
            var o = h.audio[m] = new f.Audio("audio");
            o.src = j.soundFolder + "game/" + n;
            o.load()
        })
    }
    d()
});
APP.task("game-persona", ["game"], function taskGamePersona(b) {
    var e = APP.win,
        c = APP.$,
        g = APP._,
        j = APP.ns("game"),
        h = APP.ns("config"),
        i = j.personas = new APP.Collection.Personas(h.personas),
        f = j.switchPersona = function f(l) {
            l = i.get(l);
            if (l instanceof APP.Model.Persona) {
                var k = h.personaUrl + l.id;
                if (e.login) {
                    g.defer(function() {
                        var m = e.login.pickSoldier(l.get("name"));
                        if (m) {
                            e.location.href = k
                        } else {
                            APP.error("Unable to switch persona")
                        }
                    })
                } else {
                    e.location.href = k
                }
            }
        },
        a, d = function d() {
            if (a) {
                a.destroy();
                a = null
            }
            a = new APP.View.RosterDialog({
                collection: i
            });
            a.bind("show", function l() {
                a.$("h2.title, h3, p, a.button, a.button-view, div.level div, div.level span, div.progress span").renderText(true)
            });
            a.bind("close", function k() {
                a.destroy();
                a = null
            });
            a.bind("choose", function(m, n) {
                j.trigger("switch:persona", n)
            });
            a.render().attach().show()
        };
    i.get(j.persona.id).set({
        isCurrent: true
    });
    j.bind("roster", function() {
        d()
    });
    j.bind("switch:persona", f);
    b()
});
APP.task("game-routes", ["game-persona"], function taskGameRoutes(b) {
    var e = APP.$,
        d = APP.$,
        c = APP._,
        f = APP.ns("game");
    APP.route("roster", "roster", function a() {
        APP.navigate("");
        f.trigger("roster")
    });
    b()
});
(function(h) {
    var i = h.APP,
        k = i._,
        c = i.$,
        f = i.win,
        j = i.View.Overlay.prototype;
    i.View.GameEvent = i.View.Overlay.extend({
        name: "game-event-view",
        className: "game-event-overlay",
        tagName: "div",
        events: {
            "click a.close": function(l) {
                l.preventDefault();
                this.sound("close");
                this.trigger("close", this, l)
            },
            "webkitAnimationEnd div.lock": function(l) {
                if (l.srcElement === this.lockText) {
                    this.$(this.lock).addClass("hide")
                } else {
                    if (l.srcElement === this.lock) {
                        this.$(this.lock).remove()
                    }
                }
            }
        },
        initialize: function b() {
            j.initialize.apply(this, arguments);
            this.bind("item:buy", k.bind(this.trigger, this, "buy"));
            this.bind("show", this.renderLock, this)
        },
        renderLock: function g() {
            var w = i.ns("config"),
                r = this.options.lockType,
                u = this.options.lockCriteria,
                v = this.lock = this.make("div", {
                    "class": "lock " + r
                }),
                o = this.make("div", {
                    "class": "lock-base"
                }),
                q = this.make("div", {
                    "class": "lock-loop"
                }),
                p = this.make("div", {
                    "class": "lock-gold"
                }),
                x = this.make("div", {
                    "class": "lock-glow"
                }),
                m = this.lockText = this.make("div", {
                    "class": "lock-text"
                }, this.trans("WEB_GAME_GAMEEVENT_UNLOCKED")),
                s = w.imageFolder + "game/item-lock-progress.png",
                l = 1,
                n = f.progressCircle(s, l, {
                    width: 157,
                    height: 157,
                    lineWidth: 29,
                    duration: 500,
                    fn: k.bind(function() {
                        this.sound("LevelUp");
                        v.className += " done"
                    }, this)
                });
            v.appendChild(x);
            v.appendChild(q);
            v.appendChild(o);
            v.appendChild(p);
            v.appendChild(m);
            v.appendChild(this.make("span", {
                "class": "type"
            }, r));
            v.appendChild(this.make("span", {
                "class": "key"
            }, u));
            v.appendChild(n);
            this.el.appendChild(v);
            return this
        },
        renderItem: function e(l) {
            var m = "sixth";
            if (this.collection.length === 1) {
                m = "one"
            } else {
                if (this.collection.length === 2) {
                    m = "half"
                } else {
                    if (this.collection.length === 3) {
                        m = "third"
                    } else {
                        if (this.collection.length > 6) {
                            m += " tight"
                        }
                    }
                }
            }
            this.createView(i.View.GameEventItem, {
                model: l,
                className: "size-" + m,
                container: this.list
            }, "item").render().attach()
        },
        renderTitle: function a() {
            var n = (this.options.lockType === "level") ? this.trans("WEB_GAME_GAMEEVENT_LEVEL") + " " + this.options.lockCriteria : "",
                l = this.make("span", null, (this.collection.length > 1) ? this.trans("WEB_GAME_GAMEEVENT_NEW_ITEMS_UNLOCKED") : this.trans("WEB_GAME_GAMEEVENT_NEW_ITEM_UNLOCKED")),
                m = this.make("h1", {
                    "class": "game-event-title"
                }, n);
            m.appendChild(l);
            this.$el.append(m);
            return this
        },
        render: function d() {
            this.el.appendChild(this.make("a", {
                "class": "close"
            }));
            this.renderTitle();
            this.list = this.make("div", {
                "class": "game-event-item-container"
            });
            if (this.collection.length > 6) {
                this.list.className += " overflow"
            }
            this.collection.forEach(this.renderItem, this);
            this.el.appendChild(this.list)
        }
    })
}(this));
(function(g) {
    var h = g.APP,
        k = h._,
        c = h.$,
        f = h.doc,
        i = h.View.Overlay.prototype;
    h.View.GameEventItem = h.View.extend({
        name: "game-event-item",
        tagName: "div",
        events: {
            "mouseenter span.more-info": function(m) {
                this.sound("hover");
                this.trigger("enter:info", this, this.model, m)
            },
            "mouseleave span.more-info": function(m) {
                this.trigger("leave:info", this, this.model, m)
            }
        },
        initialize: function e() {
            this.model.bind("change", this.render, this);
            this.model.bind("purchase:start", this._onPurchaseStart, this);
            this.model.bind("purchase:end", this._onPurchaseEnd, this);
            this.bind("buy:click", this._onBuyClick, this)
        },
        destroy: function b() {
            this.model.unbind("change", this.render, this);
            this.model.unbind("purchase:start", this._onPurchaseStart, this);
            this.model.unbind("purchase:end", this._onPurchaseEnd, this)
        },
        _onPurchaseStart: function a() {
            this.$el.addClass("loading")
        },
        _onPurchaseEnd: function d() {
            this.$el.removeClass("loading")
        },
        _onBuyClick: function l(m, n) {
            this.trigger("buy", this, this.model, n)
        },
        _renderPockets: function() {
            var p = this.model.get("maxNumPockets"),
                o = this.model.get("numberOfPockets"),
                r = this.model.getCustomizations(),
                n = this.make("div", {
                    "class": "pocket-wrapper"
                }),
                s = (this.pocketModel && this.pocketModel.get("unlockLevels")) || {},
                q = (this.pocketModel && this.pocketModel.get("pocketOffers")) || {},
                m = (this.pocketModel && this.pocketModel.get("personaLevel")) || 0;
            k.forEach(r, function(x, u) {
                var w = o > u,
                    y, z = m < s[u],
                    v = q[u];
                if (w) {
                    if (x) {
                        if (x.isOwned()) {
                            y = "filled"
                        } else {
                            y = "invalid"
                        }
                    } else {
                        y = "empty"
                    }
                } else {
                    if (z) {
                        if (v && v.hasUnlockOffers()) {
                            y = "unlockable"
                        } else {
                            y = "locked"
                        }
                    } else {
                        if (v && v.length !== 0) {
                            y = "buyable"
                        }
                    }
                }
                n.appendChild(this.make("span", {
                    "class": y
                }))
            }, this);
            return n
        },
        render: function j() {
            var z = h.namespace("config"),
                C = this.make("h2", null),
                p = this.make("div", {
                    "class": "img-container"
                }),
                u = this.make("img", {
                    src: this.model.getImage("med"),
                    width: z.imageSize.med.width,
                    height: z.imageSize.med.height
                }),
                n = f.createDocumentFragment(),
                r, s, q = this.make("span", {
                    "class": "more-info"
                }, this.trans("WEB_GAME_GAMEEVENT_INFO")),
                y, B, v, m, o = this.model.getDependencies(),
                x = o.gear && o.gear.isOwned(),
                w = o.ability && o.ability.get("level") === 0,
                A = x || w;
            if (this.model.isItemType("pocket")) {
                B = k.indexOf(this.model.get("unLockLevels"), this.model.get("personaLevel"));
                y = this.model.get("pocketOffers")[B];
                v = this.trans("WEB_GAME_WEAPONS_INFO_PRICE")
            } else {
                y = this.model.get("offers");
                v = this.trans("WEB_GAME_WEAPONS_INFO_PRICE_FROM");
                if (!A) {
                    this.createView(h.View.Button, {
                        container: n,
                        className: "buy",
                        text: this.trans("WEB_GAME_TOOLTIPS_BUY_BTN"),
                        sound: true
                    }, "buy").render().attach()
                }
            }
            if (y && y.length !== 0) {
                r = y.getLowestOffers();
                s = this.make("div", {
                    "class": "prices"
                });
                if (r.credits) {
                    s.appendChild(this.make("span", {
                        "class": "currency credits"
                    }, r.credits.get("price")))
                }
                if (r.funds) {
                    s.appendChild(this.make("span", {
                        "class": "currency funds"
                    }, r.funds.get("price")))
                }
                n.appendChild(s);
                this.createView(h.View.LabelBox, {
                    label: v,
                    content: n,
                    className: "bottom purchase"
                }).render().attach()
            } else {
                p.className += " solo"
            }
            if (this.model.hasStats()) {
                this.el.appendChild(q);
                C.className = "with-info"
            }
            C.appendChild(this.make("span", {
                "class": "name"
            }, this.model.get("name")));
            C.appendChild(this.make("span", {
                "class": "category"
            }, (this.model.get("categoryname"))));
            p.appendChild(u);
            this.el.appendChild(C);
            this.el.appendChild(p);
            this.$el.attr({
                "item-id": this.model.id
            })
        }
    })
}(this));
(function(e) {
    var g = e.APP,
        d = g.win,
        f = g.doc,
        b = g.$,
        i = g._,
        h = g.View.Dialog.prototype;
    g.View.RosterDialog = g.View.Dialog.extend({
        className: "roster-dialog",
        events: i.extend({}, h.events, {
            "mouseenter li:not(.current)": function() {
                this.sound("hover")
            },
            "click li:not(.current)": function(l) {
                l.preventDefault();
                this.sound("click:button");
                var m = l.currentTarget,
                    k = this.$rows.index(m),
                    j;
                if (k !== -1) {
                    this.$rows.removeClass("current");
                    this.$rows.eq(k).addClass("current");
                    j = this.collection.at(k);
                    this.trigger("choose", this, j, l)
                }
            }
        }),
        renderBody: function a() {
            var l = this.make("ul", {
                    "class": "persona-list"
                }),
                k = [];
            this.rows = [];
            this.collection.forEach(function j(o) {
                var m = this.make("li"),
                    q = this.make("div", {
                        "class": "level"
                    }),
                    n, p;
                m.appendChild(this.make("h3", null, o.get("name")));
                m.appendChild(this.make("span", {
                    "class": "kit-" + o.get("kit")
                }));
                m.appendChild(q);
                if (o.get("isMaxLevel")) {
                    q.appendChild(this.make("div", null, "LEVEL " + o.get("level")));
                    q.appendChild(this.make("span", null, "max level reached"))
                } else {
                    q.appendChild(this.make("div", null, o.get("xpToNextLevel") + "XP"));
                    q.appendChild(this.make("span", null, "left to next rank"));
                    n = this.make("div", {
                        "class": "progress"
                    });
                    p = this.make("div", {
                        "class": "bar"
                    });
                    p.appendChild(this.make("div", {
                        style: "width: " + o.get("levelUpProgression") + "%;"
                    }));
                    n.appendChild(p);
                    n.appendChild(this.make("span", {
                        "class": "current"
                    }, o.get("level")));
                    n.appendChild(this.make("span", {
                        "class": "next"
                    }, o.get("nextLevel")));
                    m.appendChild(n)
                }
                m.appendChild(this.make("p", null, o.get("levelDescription")));
                if (o.get("isCurrent")) {
                    m.className = "current"
                }
                k.push(m);
                l.appendChild(m)
            }, this);
            this.$rows = this.$(k);
            return l
        },
        render: function c() {
            this.options.renderData = {
                close: true,
                title: "Choose <span>your soldier</span>",
                body: this.renderBody()
            };
            h.render.apply(this, arguments)
        }
    })
}(this));
(function(r) {
    var c = "({\\s*(\\-?\\d+[\\s*,\\s*\\-?\\d+]*)\\s*})",
        b = "([\\[\\]])\\s*(\\-Inf|\\-?\\d+)\\s*,\\s*(\\+?Inf|\\-?\\d+)\\s*([\\[\\]])",
        k = c + "|" + b,
        u = new RegExp("^(" + k + ")\\s+(.+?)$"),
        d = new RegExp("^\\w+\\: +(.+)$"),
        p = new RegExp("^" + k + "$"),
        n = {};
    n.af = n.az = n.bn = n.bg = n.ca = n.da = n.de = n.el = n.en = n.eo = n.es = n.et = n.eu = n.fa = n.fi = n.fo = n.fur = n.fy = n.gl = n.gu = n.ha = n.he = n.hu = n.is = n.it = n.ku = n.lb = n.ml = n.mn = n.mrv = n.nah = n.nb = n.ne = n.nl = n.nn = n.no = n.om = n.or = n.pa = n.pap = n.ps = n.pt = n.so = n.sq = n.sv = n.sw = n.ta = n.te = n.tk = n.ur = n.zu = function(v) {
        return (v === 1) ? 0 : 1
    };
    n.am = n.bh = n.fil = n.fr = n.gun = n.hi = n.ln = n.mg = n.nso = n.xbr = n.ti = n.wa = function(v) {
        return ((v === 0) || (v === 1)) ? 0 : 1
    };
    n.be = n.bs = n.hr = n.ru = n.sr = n.uk = function(v) {
        return ((v % 10 === 1) && (v % 100 !== 11)) ? 0 : (((v % 10 >= 2) && (v % 10 <= 4) && ((v % 100 < 10) || (v % 100 >= 20))) ? 1 : 2)
    };
    n.cs = n.sk = function(v) {
        return ((v % 10 === 1) && (v % 100 !== 11)) ? 0 : (((v % 10 >= 2) && (v % 10 <= 4) && ((v % 100 < 10) || (v % 100 >= 20))) ? 1 : 2)
    };
    n.ga = function(v) {
        return (v === 1) ? 0 : ((v === 2) ? 1 : 2)
    };
    n.lt = function(v) {
        return ((v % 10 === 1) && (v % 100 !== 11)) ? 0 : (((v % 10 >= 2) && ((v % 100 < 10) || (v % 100 >= 20))) ? 1 : 2)
    };
    n.sl = function(v) {
        return (v % 100 === 1) ? 0 : ((v % 100 === 2) ? 1 : (((v % 100 === 3) || (v % 100 === 4)) ? 2 : 3))
    };
    n.mk = function(v) {
        return (v % 10 === 1) ? 0 : 1
    };
    n.mt = function(v) {
        return (v === 1) ? 0 : (((v === 0) || ((v % 100 > 1) && (v % 100 < 11))) ? 1 : (((v % 100 > 10) && (v % 100 < 20)) ? 2 : 3))
    };
    n.lv = function(v) {
        return (v === 0) ? 0 : (((v % 10 === 1) && (v % 100 !== 11)) ? 1 : 2)
    };
    n.pl = function(v) {
        return (v === 1) ? 0 : (((v % 10 >= 2) && (v % 10 <= 4) && ((v % 100 < 12) || (v % 100 > 14))) ? 1 : 2)
    };
    n.cy = function(v) {
        return (v === 1) ? 0 : ((v === 2) ? 1 : (((v === 8) || (v === 11)) ? 2 : 3))
    };
    n.ro = function(v) {
        return (v === 1) ? 0 : (((v === 0) || ((v % 100 > 0) && (v % 100 < 20))) ? 1 : 2)
    };
    n.ar = function(v) {
        return (v === 0) ? 0 : ((v === 1) ? 1 : ((v === 2) ? 2 : (((v >= 3) && (v <= 10)) ? 3 : (((v >= 11) && (v <= 99)) ? 4 : 5))))
    };

    function l(w, v) {
        if (n.hasOwnProperty(v)) {
            return n[v](w)
        }
        return 0
    }

    function o(v) {
        if ("-Inf" === v) {
            return Number.NEGATIVE_INFINITY
        } else {
            if ("+Inf" === v || "Inf" === v) {
                return Number.POSITIVE_INFINITY
            }
        }
        return parseInt(v, 10)
    }

    function e(B, x) {
        x = x.trim();
        var C = p.exec(x),
            z, A, w, v, y;
        if (!C) {
            throw new Error('"' + x + '" is not a valid interval.')
        }
        if (C[2]) {
            w = C[2].split(",");
            for (y = 0, v = w.length; y < v; y += 1) {
                if (B === parseInt(w[y], 10)) {
                    return true
                }
            }
        } else {
            z = o(C[4]);
            A = o(C[5]);
            return (("[" === C[3] ? B >= z : B > z) && ("]" === C[6] ? B <= A : B < A))
        }
        return false
    }

    function f(G, x, F) {
        F = F || "en";
        var y = G.split("|"),
            v, E = [],
            D = [],
            w, C, z, B, A;
        for (z = 0, C = y.length; z < C; z += 1) {
            v = y[z];
            B = u.exec(v);
            if (B) {
                E.push([B[1], B[8]]);
                continue
            }
            B = d.exec(v);
            if (B) {
                D.push(B[1]);
                continue
            }
            D.push(v)
        }
        for (z = 0, C = E.length; z < C; z += 1) {
            w = E[z];
            if (e(x, w[0])) {
                return w[1]
            }
        }
        A = l(x, F);
        if (D[A]) {
            return D[A]
        } else {
            throw new Error("Unable to choose a translation.")
        }
    }

    function j(y, x) {
        x = x || {};
        var v, w;
        for (v in x) {
            if (x.hasOwnProperty(v)) {
                w = x[v];
                y = y.replace(v, w)
            }
        }
        return y
    }

    function m(v, w) {
        this._locale = v;
        this._messages = w
    }
    m.prototype = {
        _locale: null,
        _data: {},
        _all: function h(v) {
            v = v || "messages";
            return this._messages
        },
        _has: function a(w, v) {
            v = v || "messages";
            return this._messages.hasOwnProperty(w)
        },
        _get: function a(w, v) {
            v = v || "messages";
            return this._messages[w]
        },
        _set: function q(x, w, v) {
            v = v || "messages";
            this._messages[x] = w;
            return this
        },
        _replace: function s(v, w) {
            w = w || "messages";
            this._messages = v;
            return this
        },
        _add: function s(v, w) {
            w = w || "messages";
            return this
        },
        trans: function g(y, x, w) {
            if (!this._messages.hasOwnProperty(y)) {
                return y
            }
            var v = this._messages[y];
            return j(v, x)
        },
        transChoice: function i(A, w, y, x) {
            if (!this._messages.hasOwnProperty(A)) {
                return A
            }
            var v = this._messages[A],
                z = f(v, w, this._locale);
            return j(z, y)
        }
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            Sidis: m,
            convertNumber: o,
            isInterval: e,
            choose: f
        }
    } else {
        r.Sidis = m
    }
}(this));
APP.domTask("sidis", function initializeSidis(a) {
    var b = APP.ns("lang");
    APP.sidis = new Sidis(b.locale, b.messages);
    a()
});
(function(j) {
    if (typeof require !== "undefined") {
        if (!j.APP) {
            j.APP = require("./../common/app")
        }
        if (!j.APP.Model) {
            j.APP.Model = require("./../common/model")
        }
    }
    var k = j.APP,
        m = k._,
        l = k.Model.prototype;
    k.Model.Offer = k.Model.extend({
        normalizeKeys: {
            offer: "id",
            offerId: "id",
            cost: "price",
            costSave: "discount"
        },
        defaults: {
            currency: null,
            limit: null,
            price: 0,
            formatedPrice: 0,
            discount: 0,
            isPermanent: false,
            isUnlimited: false,
            isUnlockOffer: false,
            label: null
        },
        schema: {
            isPermanent: "bool",
            isUnlimited: "bool",
            isUnlockOffer: "bool",
            price: "number",
            originalPrice: "number",
            discount: "number",
            currency: function h(o) {
                o = (o || "").toLowerCase();
                if (o === "_ac" || o === "credits") {
                    return "credits"
                } else {
                    if (o === "_db" || o === "_pf" || o === "funds") {
                        return "funds"
                    }
                }
                return new Error("Invalid currency")
            }
        },
        initialize: function i() {
            var o;
            if (!this.has("price")) {
                o = new Error('Offer.Model requires a "price" attribute');
                this.trigger("error", this, o)
            }
            if (!this.has("currency")) {
                o = new Error('Offer.Model requires a "currency" attribute')
            }
            if (!this.isDiscounted() && this.get("originalPrice")) {
                this._setDiscount()
            }
            if (this.isDiscounted() && !this.has("originalPrice")) {
                this._setOriginalPrice()
            }
            this._setFormatPrice();
            this._setLabel()
        },
        _setLabel: function d() {
            var o = this.get("limit"),
                p;
            if (o) {
                p = o
            } else {
                if (this.isDiscounted()) {
                    p = k.sidis.trans("WEB_GAME_DEALS_SAVE_LABEL") + " " + Math.abs(this.get("discount"))
                } else {
                    p = "Offer"
                }
            }
            this.set({
                label: p
            })
        },
        _setDiscount: function f() {
            var o = this.get("originalPrice");
            if (o) {
                this.set({
                    discount: o - this.get("price")
                })
            }
        },
        _setFormatPrice: function c() {
            this.set({
                formatedPrice: this.format(this.get("price"))
            })
        },
        _setOriginalPrice: function b() {
            var o = this.get("discount");
            if (o) {
                this.set({
                    originalPrice: this.get("price") + o
                })
            }
        },
        format: function(o) {
            if (o > 999) {
                return o.toString().split("").reverse().join("").split(/^[0-9]{3}/).reverse().join(" 000")
            }
            return o.toString()
        },
        isDiscounted: function n() {
            return (this.get("discount") > 0)
        },
        isPermanent: function a() {
            return !!this.get("isPermanent")
        },
        isUnlimited: function g() {
            return !!this.get("isUnlimited")
        },
        isUnlock: function e() {
            return !!this.get("isUnlockOffer")
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = k.Model.Offer
    }
}(this));
(function createPlayerModel(d) {
    if (!d.APP && (typeof require !== "undefined")) {
        d.APP = require("./../common/app")
    }
    var c = d.APP,
        b = c.Model.prototype,
        a = c._;
    c.Model.Wallet = c.Model.extend({
        defaults: {
            credits: 0,
            funds: 0
        },
        schema: {
            credits: "number",
            funds: "number"
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = c.Model.Wallet
    }
}(this));
(function(g) {
    if (typeof require !== "undefined") {
        if (!g.APP) {
            g.APP = require("./../common/app")
        }
        if (!g.APP.Collection) {
            g.APP.Collection = require("./../common/collection")
        }
        if (!g.APP.Model.Offer) {
            g.APP.Model.Offer = require("./model.offer")
        }
    }
    var i = g.APP,
        k = i._,
        d = i.$,
        j = i.Collection.prototype;
    i.Collection.Offers = i.Collection.extend({
        model: i.Model.Offer,
        comparator: function m(n) {
            if (n.hasOwnProperty("sortWeight")) {
                return n.sortWeight
            }
            var o = n.get("currency") === "credits" ? 1000000 : 2000000;
            return (n.sortWeight = o + n.get("price"))
        },
        getLimitedOffers: function h() {
            return this.filterBy({
                isUnlimited: false
            })
        },
        getUnlimitedOffers: function f() {
            return this.filterBy({
                isUnlimited: true
            })
        },
        getCreditOffers: function e() {
            return this.filterBy({
                currency: "credits"
            })
        },
        getFundOffers: function b() {
            return this.filterBy({
                currency: "funds"
            })
        },
        getLowestOffers: function l() {
            var p = this.getCreditOffers(),
                o = this.getFundOffers(),
                q = function(r) {
                    return r.get("price")
                },
                n = {
                    credits: p.min(q) || null,
                    funds: o.min(q) || null
                };
            return n
        },
        getUnlockOffers: function a() {
            return this.filterBy({
                isUnlock: true
            })
        },
        hasUnlockOffers: function c() {
            return this.some(function n(o) {
                return o.isUnlock()
            })
        },
        getLowest: function l() {
            i.warn("Use OffersCollection::getLowestOffers instead of OffersCollection::getLowest");
            return this.getLowestOffers.apply(this, arguments)
        },
        getUnlocks: function a() {
            i.warn("Use OffersCollection::getUnlockOffers instead of OffersCollection::getUnlocks");
            return this.getUnlockOffers.apply(this, arguments)
        },
        hasUnlock: function c() {
            i.warn("Use OffersCollection::hasUnlockOffers instead of OffersCollection::hasUnlock");
            return this.hasUnlockOffers.apply(this, arguments)
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = i.Collection.Offers
    }
}(this));
(function(e) {
    var d = e.APP,
        b = d.View.prototype,
        a = d._;
    d.View.Wallet = d.View.extend({
        name: "wallet-view",
        initialize: function f() {
            this.model.bind("change", this.render, this)
        },
        destroy: function c() {
            this.model.unbind("change", this.render, this)
        },
        render: function g() {
            this.el.appendChild(this.make("span", {
                "class": "funds"
            }, this.model.get("funds").toString()));
            this.el.appendChild(this.make("span", {
                "class": "credits"
            }, this.model.get("credits").toString()));
            this.$("span").disableTextSelect()
        }
    })
}(this));
(function(p) {
    var k = p.APP,
        h = k.View.Dialog.prototype,
        c = k.win,
        v = k.doc,
        d = k.$,
        u = k._,
        f = k.namespace("config");
    k.View.PurchaseDialog = k.View.Dialog.extend({
        className: "purchase-dialog",
        events: u.extend({}, h.events, {
            "change input[type=radio]": function(w) {
                this.select(w.currentTarget.value)
            },
            "click a.get-more-funds": function(w) {
                if (w.currentTarget.className.indexOf("loading") === -1) {
                    this.trigger("getfunds", this, this.lockboxUrl, w)
                } else {
                    w.preventDefault()
                }
            }
        }),
        lockboxUrl: "#get-more-funds",
        initialize: function l() {
            h.initialize.apply(this, arguments);
            if (!this.options.groupPrices && this.model.isCustomizable()) {
                this.options.groupPrices = "both"
            }
            if (this.options.wallet) {
                this.options.wallet.bind("change", this.render, this)
            }
            this.offers = this.options.offers || this.model.get("offers");
            this.bind("insufficientfunds", this._onInsufficientFunds, this);
            this.bind("buy:click", this._onClickBuy, this)
        },
        destroy: function g() {
            if (this.options.wallet) {
                this.options.wallet.unbind("change", this.render, this)
            }
            h.destroy.apply(this, arguments)
        },
        _onClickBuy: function a(x, A) {
            if (this._canClickBuy && this.selectedOffer) {
                this._canClickBuy = false;
                var w = this.selectedOffer.get("currency"),
                    y = this.selectedOffer.get("price"),
                    z = this.options.wallet.get(w) - y;
                if (z < 0) {
                    this.trigger("insufficientfunds")
                } else {
                    this.trigger("buy", this, this.model, A, this.selectedOffer, this.options.purchaseOptions)
                }
            }
        },
        _onInsufficientFunds: function j() {
            this._showInsufficientDialog()
        },
        _showInsufficientDialog: function() {
            this._hideInsufficientDialog();
            this.insufficientFundsDialog = this.createView(k.View.Dialog, {
                container: v.body,
                className: "insufficient-funds-dialog",
                renderData: {
                    close: true,
                    title: this.trans("WEB_GAME_INSUFFICIENT_FUNDS_DIALOG_TITLE"),
                    body: this.trans("WEB_GAME_INSUFFICIENT_FUNDS_DIALOG_BODY"),
                    buttonRight: {
                        attrs: {
                            href: this.lockboxUrl,
                            target: "_blank"
                        },
                        text: this.trans("WEB_GAME_INSUFFICIENT_FUNDS_DIALOG_BUTTON")
                    }
                }
            }, "insufficientfunds");
            this.insufficientFundsDialog.bind("close", this._hideInsufficientDialog, this);
            this.insufficientFundsDialog.bind("button:right", function() {
                this._hideInsufficientDialog();
                this.trigger("getfunds")
            }, this);
            this.insufficientFundsDialog.attach();
            this.insufficientFundsDialog.render();
            this.insufficientFundsDialog.show()
        },
        _hideInsufficientDialog: function() {
            if (this.insufficientFundsDialog) {
                this.destroyView(this.insufficientFundsDialog)
            }
            this.insufficientFundsDialog = null;
            this._canClickBuy = true
        },
        select: function s(z) {
            if (z) {
                this.selectedOffer = this.offers.get(z)
            }
            if (!this.selectedOffer) {
                if (this.options.offer) {
                    this.selectedOffer = this.options.offer
                } else {
                    this.selectedOffer = this.offers.at(0)
                }
            }
            z = this.selectedOffer;
            var w = this.selectedOffer.get("currency"),
                y = this.selectedOffer.get("price"),
                A = this.options.wallet.get(w) - y,
                x;
            this.viewWallet.$("span.error").removeClass("error");
            this._canClickBuy = true;
            if (A < 0) {
                this.$checkoutMessage.text(this.trans("WEB_GAME_TOOLTIPS_INSUFFICIENT_" + w.toUpperCase()));
                if (w === "funds") {
                    this.$checkoutContainer.removeClass("error");
                    this.$checkoutMessage.append(this.make("a", {
                        href: this.lockboxUrl,
                        target: "_blank",
                        "class": "get-more-funds"
                    }, this.trans("WEB_GAME_TOOLTIPS_GET_MORE_BATTLEFUNDS")))
                } else {
                    this._canClickBuy = false;
                    this.$checkoutContainer.addClass("error");
                    this.viewWallet.$("span." + w).addClass("error")
                }
                this.$checkoutMessage.show()
            } else {
                this.$checkoutContainer.removeClass("error");
                this.$checkoutMessage.empty().hide()
            }
            if (this._canClickBuy) {
                this.buyButton.enable()
            } else {
                this.buyButton.disable()
            }
            this.$cost.removeClass("credits funds");
            this.$cost.text(y);
            this.$cost.addClass(w);
            this.$prices.removeClass("checked");
            this.$prices.find("input").filter(function() {
                return (this.value === z.id)
            }).parent().addClass("checked");
            this.trigger("select", this.selectedOffer);
            return this
        },
        getLookboxUrl: function r(y) {
            var w = f.lockboxUrl,
                z = function z() {
                    k.error("Couldn't connect to the store, please try again later.")
                },
                x = this.$("a.get-more-funds");
            x.addClass("loading");
            d.ajax({
                url: w,
                context: this,
                success: function A(B) {
                    if (B && B.status === "success") {
                        this.lockboxUrl = B.message;
                        x.attr("href", this.lockboxUrl);
                        x.removeClass("loading")
                    } else {
                        z()
                    }
                },
                error: z
            });
            return this
        },
        renderGroup: function q(x, w) {
            if (x instanceof k.Collection) {
                x = x.models
            } else {
                if (!u.isArray(x)) {
                    x = [x]
                }
            }
            w = w || {};
            var y = u.map(x, this.renderOffer, this);
            if (w.content && !u.isArray(w.content)) {
                w.content = [w.content]
            }
            w.content = (w.content || []).concat(y);
            return this.createView(k.View.LabelBox, w)
        },
        renderOffer: function m(A) {
            var B = A.get("label"),
                y = this.make("label", null, B),
                w = A.get("currency"),
                z = A.get("price"),
                x = {
                    type: "radio",
                    name: "price",
                    value: A.id
                },
                C;
            if (this.model.isItemType("pocket")) {
                C = this.model.isLocked(this.options.pocket)
            } else {
                C = this.model.isLocked()
            }
            if (w !== "funds" && z > this.options.wallet.get(w)) {
                y.className = "error"
            }
            if (C && !A.isUnlock()) {
                x.disabled = "disabled"
            }
            y.appendChild(this.make("input", x));
            y.appendChild(this.make("span", {
                "class": w
            }, z));
            return y
        },
        renderOffers: function o() {
            var x = v.createElement("div"),
                H = this.offers,
                E, D, C = "offers",
                z, G, B = this.model.get("itemType"),
                I, A, w, F, y;
            if (this.model.isItemType("pocket")) {
                A = this.model.get("unlockLevels");
                F = "level";
                y = A[H.at(0).get("pocket")];
                w = this.model.isLocked(this.options.pocket)
            } else {
                F = this.model.get("lockType");
                y = this.model.get("lockCriteria");
                w = this.model.isLocked()
            }
            if (w && !this.options.offer) {
                z = F + " " + y;
                G = "WEB_GAME_TOOLTIPS_DESCRIPTION_UNLOCK_" + F.toUpperCase();
                this.renderGroup(H.getUnlockOffers(), {
                    container: x,
                    className: C,
                    label: this.trans("WEB_GAME_TOOLTIPS_PRICE_GROUP_UNLOCK") + ":",
                    content: "<p>" + this.trans(G, {
                        "%condition%": z
                    }) + "</p>"
                }).render().attach();
                H = H.filterBy({
                    isUnlockOffer: false
                });
                C += " locked"
            }
            if (this.options.offer) {
                this.renderGroup(this.options.offer, {
                    container: x,
                    className: "offers" + (w && !this.options.offer.isUnlock() ? " locked" : "")
                }).render().attach()
            } else {
                if (this.options.groupPrices) {
                    if (this.options.groupPrices === "unlimited" || this.options.groupPrices === "both") {
                        E = H.getUnlimitedOffers();
                        if (E.length !== 0) {
                            if (B === "weapon") {
                                I = "WEB_GAME_TOOLTIPS_CUSTOMIZE_WEAPON_UNLIMITED"
                            }
                            this.renderGroup(E, {
                                container: x,
                                className: C,
                                label: this.trans("WEB_GAME_TOOLTIPS_PRICE_GROUP_UNLIMITED") + ":",
                                content: I ? "<p>" + this.trans(I) + "</p>" : null
                            }).render().attach()
                        }
                    }
                    if (this.options.groupPrices === "limited" || this.options.groupPrices === "both") {
                        D = H.getLimitedOffers();
                        if (D.length !== 0) {
                            this.renderGroup(D, {
                                container: x,
                                className: C,
                                label: this.trans("WEB_GAME_TOOLTIPS_PRICE_GROUP_LIMITED") + ":"
                            }).render().attach()
                        }
                    }
                } else {
                    if (H.length !== 0) {
                        this.renderGroup(H, {
                            container: x,
                            className: C,
                            label: this.trans("WEB_GAME_TOOLTIPS_PRICE_GROUP_BOTH") + ":"
                        }).render().attach()
                    }
                }
            }
            return x
        },
        renderCheckout: function b() {
            var w = k.doc.createDocumentFragment(),
                x = this.make("div", {
                    "class": "checkout-container"
                }),
                y = this.make("div");
            this.$cost = this.$("<span />").addClass("cost").appendTo(y);
            this.$checkoutMessage = this.$("<span />").addClass("checkout-message").appendTo(y);
            x.appendChild(y);
            this.buyButton = this.createView(k.View.Button, {
                container: x,
                className: "buy",
                text: this.trans("WEB_GAME_TOOLTIPS_BUY_BTN"),
                sound: true
            }, "buy").render().attach();
            this.createView(k.View.LabelBox, {
                className: "purchase",
                container: w,
                label: this.trans("WEB_GAME_TOOLTIPS_CREDITS_TOTAL"),
                content: x
            }).render().attach();
            this.$checkoutContainer = this.$(x);
            return w
        },
        renderAccount: function n() {
            var w = this.make("div", {
                "class": "account-container"
            });
            w.appendChild(this.make("h4", null, this.trans("WEB_GAME_TOOLTIPS_ACCOUNT_BALANCE")));
            this.viewWallet = this.createView(k.View.Wallet, {
                container: w,
                model: this.options.wallet
            }, "wallet");
            this.viewWallet.render();
            this.viewWallet.attach();
            w.appendChild(this.make("a", {
                href: this.lockboxUrl,
                target: "_blank",
                "class": "get-more-funds loading"
            }, this.trans("WEB_GAME_TOOLTIPS_GET_MORE_BATTLEFUNDS")));
            return w
        },
        renderBody: function e() {
            var E = k.doc.createDocumentFragment(),
                z = this.make("img", {
                    src: f.imageFolder + "game/1x1-transparent.png",
                    "class": "item loading",
                    width: f.imageSize.med.width,
                    height: f.imageSize.med.height
                }),
                C = this.model.get("description"),
                x = this.model.get("shortDescription"),
                w = this.make("div", {
                    "class": "main-container"
                }),
                D = this.renderOffers(),
                y = this.renderCheckout(),
                B = this.renderAccount(),
                A;
            k.preload.image(this.model.getImage("med"), u.bind(function(G, H, F) {
                if (G) {
                    k.warn(G);
                    H = f.imageFolder + "game/tmp_bundle.jpg";
                    F = {
                        width: z.width,
                        height: z.height
                    }
                }
                z.src = H;
                z.width = F.width;
                z.height = F.height;
                z.className = "item " + this.model.get("itemType")
            }, this));
            if ((this.model.isType("weapon") || this.model.isType("attachment")) && C && C.length < 60) {
                w.appendChild(this.make("p", {
                    "class": "description"
                }, C))
            } else {
                if (this.model.isType("trainingpoint")) {
                    A = this.model.get("extraPointsMax") - this.model.get("extraPointsPurchased");
                    w.appendChild(this.make("p", {
                        "class": "description"
                    }, this.transChoice("WEB_STORE_ABILITIES_BUY_POINTS_TEXT", A, {
                        "%count%": A
                    })))
                } else {
                    if (this.model.isType("bundle") && this.model.get("isRandomContent")) {
                        w.appendChild(this.make("p", {
                            "class": "description"
                        }, x))
                    }
                }
            }
            w.appendChild(D);
            w.appendChild(y);
            E.appendChild(z);
            E.appendChild(w);
            E.appendChild(B);
            return E
        },
        render: function i() {
            this.options.renderData = {
                close: true,
                title: this.trans("WEB_GAME_TOOLTIPS_CONFIRM_PURCHASE") + " <span>" + this.model.get("name") + "</span>",
                body: this.renderBody()
            };
            h.render.apply(this, arguments);
            this.$el.addClass(this.model.get("itemType"));
            if (this.model.isType("bundle") && this.model.get("isRandomContent")) {
                this.$el.addClass("supply-drop")
            }
            this.$prices = this.$("label");
            var w = this.$prices.find("input:not([disabled])");
            if (this.selectedOffer) {
                this.select()
            } else {
                if (w.size() !== 0) {
                    this.select(w.val())
                }
            }
            this.getLookboxUrl();
            this.$("img, h3, p, a.get-more-funds, div.checkout-container").disableTextSelect()
        }
    })
}(this));
(function(d) {
    var f = d.APP,
        c = f.$,
        h = f._,
        i = f.namespace("config"),
        g = f.View.Tooltip.prototype;
    f.View.PurchaseTooltip = f.View.Tooltip.extend({
        className: "purchase-tooltip",
        renderModelAndShow: function a(j, k) {
            return this.renderModel(j).show(k)
        },
        renderModel: function e(j) {
            this.model = j;
            return this.render()
        },
        render: function b() {
            var j = [];
            if (this.model.isLocked()) {
                this.$el.addClass("locked");
                j.push("<h3>" + this.trans("WEB_GAME_PURCHASE_ITEM_LOCKED") + "</h3>");
                j.push('<div class="lock-progress">');
                j.push('<span class="bar" style="width: ' + Math.round(100 - (100 * this.model.get("lockProgress"))) + '%;"></span>');
                j.push('<span class="text">' + this.model.get("lockType") + " " + this.model.get("lockCriteria") + "</span>");
                j.push("</div>");
                if (this.model.get("offers").hasUnlockOffers()) {
                    j.push("<h3>" + this.trans("WEB_GAME_PURCHASE_UNLOCK_OPTIONS") + "</h3>");
                    j.push('<dl class="prices">');
                    this.model.get("offers").filterBy({
                        isUnlockOffer: true
                    }).forEach(function(k) {
                        j.push("<dt>" + k.get("limit") + "</dt>");
                        j.push('<dd class="' + k.get("currency") + '">' + k.get("price") + "</dd>")
                    });
                    j.push("</dl>")
                }
            } else {
                if (this.model.isBuyable()) {
                    j.push("<h3>" + this.trans("WEB_GAME_PURCHASE_OPTIONS") + "</h3>");
                    j.push('<dl class="prices">');
                    this.model.get("offers").filterBy({
                        isUnlockOffer: false
                    }).forEach(function(k) {
                        j.push("<dt>" + k.get("limit") + "</dt>");
                        j.push('<dd class="' + k.get("currency") + '">' + k.get("price") + "</dd>")
                    });
                    j.push("</dl>")
                }
            }
            this.$el.html(j.join(""))
        }
    })
}(this));
APP.task("store.purchase", ["store.wallet", "items"], function taskStoreBuy(d) {
    var e = APP.$,
        h = APP._,
        i = APP.namespace("config"),
        g = APP.namespace("store"),
        f = APP.namespace("items"),
        c = APP.namespace("bundles"),
        a = g.wallet,
        b = g.purchase = function b(m, o, l) {
            l = l || {};
            m = f.collection.get(m);
            if (!(m instanceof APP.Model.Item)) {
                g.trigger("purchase:error", m, o, new Error("Invalid model!"));
                return g
            }
            var k = {
                type: "POST",
                cache: false,
                success: function j(r) {
                    if (r && r.status === "success") {
                        var u = r.data || {},
                            s = {};
                        if (u.hasOwnProperty("credits")) {
                            s.credits = u.credits
                        }
                        if (u.hasOwnProperty("battlefunds")) {
                            s.funds = u.battlefunds
                        }
                        if (u.hasOwnProperty("funds")) {
                            s.funds = u.funds
                        }
                        if (!h.isEmpty(s)) {
                            a.set(s)
                        }
                        h.forEach(u.items || [], function q(w, x) {
                            var v = f.collection.get(x);
                            if (v) {
                                delete w.equippedSlot;
                                v.set(w)
                            } else {
                                f.collection.add([w])
                            }
                        });
                        if (m.isType("trainingpoint") && u.hasOwnProperty("purchasedPoints") && u.hasOwnProperty("trainingPoints")) {
                            m.set({
                                extraPointsPurchased: (f.extraPointsPurchased = parseInt(u.purchasedPoints, 10)),
                                trainingPointsCurrent: (f.trainingPointsCurrent = parseInt(u.trainingPoints, 10)),
                                prices: (f.trainingPointOffers = u.offers || [])
                            })
                        }
                        m.trigger("purchase:success", m, o, r.status, r);
                        g.trigger("purchase:success", m, o, r.status, r)
                    } else {
                        APP.warn("purchase:error", {
                            model: m,
                            offer: o,
                            response: r
                        });
                        m.trigger("purchase:error", m, o, new Error("Invalid status!"), r);
                        g.trigger("purchase:error", m, o, new Error("Invalid status!"), r)
                    }
                },
                error: function p(s, q, r) {
                    APP.warn("purchase:error", {
                        model: m,
                        offer: o
                    });
                    m.trigger("purchase:error", m, o, r);
                    g.trigger("purchase:error", m, o, r)
                },
                complete: function n() {
                    m.trigger("purchase:end", m, o);
                    g.trigger("purchase:end", m, o)
                }
            };
            if (m.isItemType("trainingpoint")) {
                k.url = i.purchaseTrainingPointUrl.replace("OFFERID", o.id)
            } else {
                if (m.isItemType("pocket")) {
                    k.url = i.pockets.purchaseAndAttachUrl.replace("ITEM_ID", l.model.id);
                    k.url = k.url.replace("POCKET", o.get("pocket"));
                    k.url = k.url.replace("OFFER_ID", o.id);
                    m = l.model
                } else {
                    k.url = i.purchaseUrl.replace("OFFERID", o.id)
                }
            }
            if (!(o instanceof APP.Model.Offer)) {
                m.trigger("purchase:error", m, o, new Error("Invalid Offer!"));
                g.trigger("purchase:error", m, o, new Error("Invalid Offer!"));
                return g
            }
            m.trigger("purchase:start", m, o);
            g.trigger("purchase:start", m, o);
            e.ajax(k);
            return g
        };
    d()
});
APP.task("store.getfunds", ["store.wallet"], function taskStoreBuy(c) {
    var e = APP.$,
        l = APP._,
        f = APP.win,
        m = APP.namespace("config"),
        h = APP.namespace("store"),
        a = h.wallet,
        j, k = {
            body: [APP.sidis.trans("WEB_GAME_TOOLTIPS_GET_MORE_BATTLEFUNDS_OPEN_WINDOW"), APP.sidis.trans("WEB_GAME_TOOLTIPS_GET_MORE_BATTLEFUNDS_WAITING")]
        },
        i = function i() {
            if (j) {
                j.destroy();
                j = null
            }
        },
        b = function b() {
            APP.reload()
        },
        g = function g() {
            if (!g.count) {
                g.count = 0
            }
            clearTimeout(g.timer);
            var n = function n() {
                g.count += 1;
                if (g.count >= 10 && j) {
                    j.setRenderData(l.extend({}, k, {
                        buttonRight: APP.sidis.trans("WEB_GAME_TOOLTIPS_GET_MORE_BATTLEFUNDS_TIMEOUT")
                    })).render()
                }
                g.timer = setTimeout(g, 1000)
            };
            e.ajax({
                type: "GET",
                dataType: "json",
                url: m.walletUrl,
                cache: false,
                success: function o(p) {
                    var q;
                    if (p && p.status === "success") {
                        q = parseInt(p.message || 0, 10);
                        if (q !== a.get("funds")) {
                            g.count = null;
                            a.set({
                                funds: q
                            });
                            i()
                        } else {
                            n()
                        }
                    } else {
                        n()
                    }
                },
                error: n
            })
        },
        d = function d() {
            if (j) {
                j.destroy()
            }
            j = new APP.View.Dialog({
                className: "getfunds-dialog"
            });
            j.bind("close", i);
            j.bind("button", b);
            j.bind("render", function n() {
                j.$("h2.title").renderText(true);
                j.$("a.button, a.button-view").renderText({
                    separate: "none",
                    hover: true
                });
                j.$("div.body p").renderText()
            });
            j.attach().setRenderData(k).render();
            j.show();
            g()
        };
    h.bind("getfunds", d);
    c()
});
APP.domTask("store", ["store.purchase", "store.wallet", "store.getfunds"], function taskStore(b) {
    var f = APP.$,
        d = APP._,
        h = APP.namespace("store"),
        g = APP.namespace("items"),
        c, e = function e(k, j) {
            k = g.collection.get(k);
            if (!(k instanceof g.collection.model)) {
                throw new Error("Buy: Invalid model!")
            }
            if (c) {
                c.destroy();
                c = null
            }
            j = d.extend(j || {}, {
                model: k,
                wallet: h.wallet
            });
            c = new APP.View.PurchaseDialog(j);
            c.bind("render", function() {
                c.$("h2.title, label, span.cost, a.button, a.button-view, div.account-container h4, span.checkout-message, div.wallet-view span").renderText(true);
                c.$("div.account-container a, p.description").renderText()
            }).bind("attach", function() {
                c.$("h2.title, label, span.cost, a.button, a.button-view, div.account-container h4, span.checkout-message, div.wallet-view span").renderText(true);
                c.$("div.account-container a, p.description").renderText()
            });
            c.bind("select", function i() {
                c.$("label, span.cost, span.checkout-message, div.wallet-view span").renderText(true)
            });
            c.bind("close", function l() {
                c.destroy();
                c = null
            });
            c.bind("getfunds", function o() {
                h.trigger("getfunds")
            });
            c.bind("buy", function n(p, r, u, s, q) {
                c.destroy();
                c = null;
                h.purchase(r, s, q)
            });
            c.bind("insufficientfunds:render", function m() {
                c.insufficientFundsDialog.$el.find("h2.title, div.body").renderText();
                c.insufficientFundsDialog.$el.find("a.button, a.button-view").renderText({
                    hover: true
                })
            });
            c.render().attach();
            c.show()
        },
        a = function a(i) {
            var j = new APP.View.Overlay();
            j.render().attach().show();
            g.getItemByOfferId(i, function(m, k, l) {
                if (m) {
                    APP.warn(m)
                } else {
                    h.trigger("buy", k, {
                        offer: l.at(0)
                    })
                }
                j.destroy()
            })
        };
    h.bind("buy", e);
    h.bind("buy:offer", a);
    b()
});
APP.domTask("store.wallet", function taskStoreWallet(c) {
    var d = APP.$,
        g = APP._,
        h = APP.namespace("config"),
        f = APP.namespace("store"),
        b = f.wallet = new APP.Model.Wallet({
            credits: h.credits,
            funds: h.funds
        }),
        i = d("div.main.main_home div.wallet"),
        a = f.walletView = new APP.View.Wallet({
            container: i,
            model: b
        });
    i.empty();
    a.bind("render", function e() {
        a.$el.find("span").renderText(true)
    });
    a.attach().render();
    c()
});
APP.task("store.routes", ["store"], function taskStoreRoutes(a) {
    var d = APP.$,
        c = APP.$,
        b = APP._,
        e = APP.ns("store");
    APP.route("eor-offer/:offer", "eor-offer", function(f) {
        e.trigger("buy:offer", f);
        APP.navigate("/weapons", true)
    });
    APP.route("offer/:offer", "buy-offer", function(f) {
        e.trigger("buy:offer", f);
        APP.navigate("/")
    });
    APP.route("buy/:model", "buy-model", function(f) {
        e.trigger("buy", f);
        APP.navigate("/")
    });
    a()
});
APP.task("login", ["items", "preload"], function initLogin(b) {
    var f = APP.win,
        e = APP.$;
    APP.once("login:success", function d() {
        f.initDoll();
        b()
    });
    APP.once("login:error", function a(g) {
        b(new Error(g.message))
    });
    f.onLoginError = function a() {
        var i = {
                1000: "ErrConnectionFailed",
                1001: "ErrConnectionLost",
                1002: "ErrAccountLogin",
                1003: "ErrSoldierLogin",
                1004: "ErrInvalidAccount",
                1005: "ErrInvalidPassword",
                1006: "ErrInvalidSoldier",
                1007: "ErrNotEntitled",
                1008: "ErrPortInUse",
                1009: "ErrSoldierLoginDataFailed",
                1010: "ErrNoEncryptedLogin",
                1011: "ErrNoAccountName",
                1012: "ErrNoAccountPassword",
                1013: "ErrInvalidConnectionState",
                1014: "ErrInvalidService",
                1015: "ErrSoldiersListDataFailed",
                1017: "ErrNotEntitledToPlay"
            },
            h = f.login ? f.login.error : 1003,
            g;
        if (i.hasOwnProperty(h)) {
            g = h + ": " + i[h]
        } else {
            g = h + ": Unknown error"
        }
        APP.trigger("login:error", {
            code: h,
            message: g
        })
    };
    f.onLoginStateChange = function c(g, i) {
        var j = "",
            h = {
                state: i,
                prevState: g,
                message: j
            };
        if (i === 1) {
            j = "Initializing..."
        } else {
            if (i === 2) {
                j = "Connecting..."
            } else {
                if (i === 3) {
                    j = "Logging in account..."
                } else {
                    if (i === 4) {
                        j = "Retrieving soldiers list..."
                    } else {
                        if (i === 5) {
                            j = "Downloading soldiers data..."
                        } else {
                            if (i === 6) {
                                j = "Waiting for soldiers data..."
                            } else {
                                if (i === 7) {
                                    j = "Logging in soldier..."
                                } else {
                                    if (i === 8) {
                                        e.magma.debugLog("debug", "Login state  8: Picked soldier " + persona_name);
                                        f.login.pickSoldier(persona_name);
                                        j = "Picking soldier..."
                                    } else {
                                        if (i === 9) {
                                            j = "Logging out..."
                                        } else {
                                            if (i === 100) {
                                                j = "Login complete!";
                                                APP.trigger("login:success", h)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        e.magma.debugLog("debug", "Login state " + i + ": " + j)
    };
    if (f.login) {
        f.login.addEventHandler("onError", "onLoginError");
        f.login.addEventHandler("onStateChanged", "onLoginStateChange");
        if (f.login.state === 0) {
            f.login.start()
        } else {
            if (f.login.state === 100) {
                APP.trigger("login:success")
            } else {
                if (f.login.state === 2) {
                    APP.log("THIS IS BAD")
                } else {
                    if (f.login.error !== 0) {
                        f.onLoginError()
                    }
                }
            }
        }
    } else {
        APP.trigger("login:success")
    }
});
APP.task("menu", function taskMenu(a) {
    var f = APP.win,
        e = APP.$,
        c = APP._,
        d = e("div.header ul.menu a"),
        b = d.filter(function() {
            return e(this).parents("ul").hasClass("personas")
        });
    APP.bind("page", function g(h, i) {
        d.removeClass("active");
        d.filter(function() {
            return e(this).closest("li").hasClass(h)
        }).addClass("active")
    });
    b.bind("click", function(k) {
        k.preventDefault();
        var j = e(this),
            l = APP.ns("game"),
            h = j.attr("id").replace("pid_", ""),
            i = l.personas.get(h);
        if (i && i.get("isCurrent")) {
            APP.page("home")
        } else {
            l.switchPersona(i)
        }
    });
    a()
});
(function createControlModel(f) {
    if (!f.APP && (typeof require !== "undefined")) {
        f.APP = require("../common/app")
    }
    var g = f.APP,
        h = g.Model.prototype,
        j = g._,
        a = g.api.controls,
        e = g.api.localization;
    g.Model.Control = g.Model.extend({
        defaults: {
            name: null,
            map: null,
            key: null,
            keyName: null,
            index: null,
            secondary: false,
            invert: false,
            commonMap: false
        },
        schema: {
            name: "string",
            map: "string",
            key: "string",
            keyName: "string",
            index: "number",
            secondary: "bool",
            invert: "bool",
            commonMap: "bool"
        },
        initialize: function c() {
            this.bind("change:map", this._checkMap, this);
            this._checkMap();
            this._setKey()
        },
        _checkMap: function i() {
            var l = this.get("map") || "";
            if (l[0] !== "_") {
                throw new Error('"map" ("' + l + '") property needs to start with an "_" (underscore)')
            }
        },
        _setKey: function b() {
            var l = a.getMappedString(this.get("map"), this.get("index"), this.get("secondary"), this.get("invert")),
                m;
            if (l.match(/^-/)) {
                m = "-" + e.get(l.replace(/^-/, ""))
            } else {
                m = e.get(l)
            }
            m = m.replace("CONTROLLER_None", "");
            if (m === "?" || m === "null") {
                m = null
            }
            this.set({
                key: l,
                keyName: m || null
            })
        },
        reload: function d() {
            this._setKey();
            return this
        },
        mapInput: function k(l) {
            j.delay(j.bind(function() {
                var o = {
                        0: "success",
                        1: "duplicate",
                        2: "timeout",
                        3: "reserved"
                    },
                    n, m, p = null,
                    q = null;
                a.activeMap = this.get("map");
                m = a.mapInput(this.get("index"), this.get("secondary"), this.get("invert"), this.get("commonMap"));
                n = o[m] || "unknown";
                if (n === "success") {
                    a.apply();
                    this._setKey()
                } else {
                    if (n === "duplicate") {
                        p = new Error("Duplicate Keybinding!");
                        q = a.lastDuplicateInput
                    } else {
                        if (n === "timeout") {
                            p = new Error("Keybinding timed out...")
                        } else {
                            if (n === "reserved") {
                                p = new Error("Reserved Key, sorry")
                            } else {
                                p = new Error("An unknown error occured while trying to map input!")
                            }
                        }
                    }
                }
                if (l) {
                    l(p, n, q)
                } else {
                    this.trigger("error", this, p, n, q)
                }
            }, this), 50);
            return this
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = g.Model.Control
    }
}(this));
(function createMouseModel(f) {
    if (!f.APP && (typeof require !== "undefined")) {
        f.APP = require("../common/app")
    }
    var h = f.APP,
        i = h.Model.prototype,
        j = h._,
        a = h.api.controls;
    h.Model.Mouse = h.Model.extend({
        defaults: {
            map: null,
            mouseSensitivity: 3,
            mouseYawFactor: 2,
            mousePitchFactor: 1,
            invertMouse: false
        },
        schema: {
            map: "string",
            mouseSensitivity: "number",
            mouseYawFactor: "number",
            mousePitchFactor: "number",
            invert: "boolean"
        },
        initialize: function e() {
            this.bind("change:map", this._checkMap, this);
            this._checkMap();
            this._setValues()
        },
        _checkMap: function b() {
            var k = this.get("map") || "";
            if (k[0] !== "_") {
                throw new Error('"map" ("' + k + '") property needs to start with an "_" (underscore)')
            }
        },
        _setValues: function g() {
            a.activeMap = this.get("map");
            this.set({
                mouseSensitivity: a.mouseSensitivity,
                mouseYawFactor: a.mouseYawFactor,
                mousePitchFactor: a.mousePitchFactor,
                invertMouse: !!a.invertMouse
            })
        },
        reload: function d() {
            this._setValues()
        },
        mapInput: function c(k) {
            j.delay(j.bind(function() {
                var n = ["mouseSensitivity", "mouseYawFactor", "mousePitchFactor", "invertMouse"],
                    m, o = null,
                    l;
                a.activeMap = this.get("map");
                j.forEach(n, function(p) {
                    a[p] = this.get(p)
                }, this);
                m = a.apply();
                if (m) {
                    l = "success"
                } else {
                    l = "unknown";
                    o = new Error("An unknown error occured while trying to map input!")
                }
                if (k) {
                    k(o, l)
                } else {
                    this.trigger("error", this, o, l)
                }
            }, this), 50);
            return this
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = h.Model.Control
    }
}(this));
(function(f) {
    var j = f.APP,
        d = j.win,
        c = j.$,
        l = j._,
        i = j.doc,
        k = j.View.prototype;
    j.View.Settings = j.View.extend({
        name: "settings-view",
        className: "info-view",
        initialize: function e() {
            this.bind("reset:click", function() {
                this.sound("revert")
            }, this)
        },
        destroy: function h() {},
        _makeRow: function n(q, w) {
            var r = j.doc.createDocumentFragment(),
                v, o, s, u, p;
            r.appendChild(this.make("span", {
                "class": "label"
            }, q.label));
            if (q.type === "select") {
                this.createView(j.View.Choose, {
                    container: r,
                    values: q.values,
                    value: q.value
                }).render().attach().bind("choose", w)
            } else {
                if (q.type === "slider") {
                    v = this.make("div", {
                        "class": "slider"
                    });
                    this.$(v).slider({
                        range: "min",
                        orientation: "horizontal",
                        min: 0,
                        max: 100,
                        value: q.value,
                        start: l.bind(function(y, x) {
                            this.sound("select:open");
                            w(x.value)
                        }, this),
                        stop: l.bind(function(y, x) {
                            this.sound("select:close");
                            w(x.value)
                        }, this)
                    }).bind("mouseenter", l.bind(function() {
                        this.sound("hover")
                    }, this));
                    r.appendChild(v)
                } else {
                    if (q.type === "radio") {
                        v = this.make("div", {
                            "class": "switch"
                        });
                        p = l.uniqueId(this.name + "-radio-");
                        v.appendChild(this.make("label", {
                            "for": p + "-yes"
                        }, q.values[0]));
                        v.appendChild(this.make("input", {
                            type: "radio",
                            id: p + "-yes",
                            name: p,
                            value: 1
                        }));
                        v.appendChild(this.make("label", {
                            "for": p + "-no"
                        }, q.values[1]));
                        v.appendChild(this.make("input", {
                            type: "radio",
                            id: p + "-no",
                            name: p,
                            value: 0
                        }));
                        s = c("input", v);
                        if (q.value) {
                            s.first().attr("checked", "checked")
                        } else {
                            s.last().attr("checked", "checked")
                        }
                        s.bind("change", l.bind(function() {
                            var x = !!s.get(0).checked;
                            if (x) {
                                this.sound("select:open")
                            } else {
                                this.sound("select:close")
                            }
                            w(x)
                        }, this)).customInput();
                        c("label", v).bind("mouseenter", l.bind(function() {
                            this.sound("hover")
                        }, this));
                        r.appendChild(v)
                    }
                }
            }
            return r
        },
        _renderVideo: function m() {
            var r = [],
                w = j.api.video,
                s = w.selectedResolution,
                p = null,
                y = l.map(JSON.parse(w.getScreenResolutions()), function(B, A) {
                    var z = B.resolution;
                    if (z === s) {
                        p = A
                    }
                    if (B.recommended === "true") {
                        z += "*"
                    }
                    return z
                }),
                x = [this.trans("WEB_GAME_OPTIONS_QUALITY_SUPER_LOW"), this.trans("WEB_GAME_OPTIONS_QUALITY_LOW"), this.trans("WEB_GAME_OPTIONS_QUALITY_MEDIUM"), this.trans("WEB_GAME_OPTIONS_QUALITY_HIGH")],
                o = w.scheme || 0;
            r.push(this._makeRow({
                type: "select",
                label: this.trans("WEB_GAME_OPTIONS_FULLSCREEN_RESOLUTION") + "<span>* = " + this.trans("WEB_GAME_OPTIONS_RECOMMENDED") + "</span>",
                values: y,
                value: p
            }, function q(A) {
                var z = y[A].split("*").shift();
                w.resolution = z;
                w.save()
            }));
            r.push(this._makeRow({
                type: "select",
                label: this.trans("WEB_GAME_OPTIONS_VIDEO_QUALITY"),
                values: x,
                value: o
            }, function v(z) {
                w.scheme = z;
                w.save()
            }));
            r.push(this._makeRow({
                type: "radio",
                label: this.trans("WEB_GAME_OPTIONS_START_IN_FULLSCREEN"),
                values: [this.trans("WEB_COMMON_YES"), this.trans("WEB_COMMON_NO")],
                value: !!w.startInFullscreen
            }, function u(z) {
                w.startInFullscreen = !!z;
                w.save()
            }));
            return r
        },
        _renderAudio: function a() {
            var p = [],
                o = j.api.audio,
                u = [this.trans("WEB_GAME_OPTIONS_QUALITY_LOW"), this.trans("WEB_GAME_OPTIONS_QUALITY_MEDIUM"), this.trans("WEB_GAME_OPTIONS_QUALITY_HIGH")];
            p.push(this._makeRow({
                type: "slider",
                label: this.trans("WEB_GAME_OPTIONS_EFFECTS_VOL"),
                value: o.effectsVolume * 100
            }, function q(v) {
                o.effectsVolume = v / 100;
                o.apply()
            }));
            p.push(this._makeRow({
                type: "slider",
                label: this.trans("WEB_GAME_OPTIONS_MUSIC_VOL"),
                value: o.musicVolume * 100
            }, function s(v) {
                o.musicVolume = v / 100;
                o.apply()
            }));
            p.push(this._makeRow({
                type: "select",
                label: this.trans("WEB_GAME_OPTIONS_AUDIO_QUALITY"),
                values: u,
                value: l.indexOf(u, o.quality)
            }, function r(v) {
                o.quality = u[v];
                o.apply()
            }));
            p.push(this._makeRow({
                type: "radio",
                label: this.trans("WEB_GAME_OPTIONS_AUDIO_RENDERER"),
                values: [this.trans("WEB_GAME_OPTIONS_AUDIO_RENDERER_SOFTWARE"), this.trans("WEB_GAME_OPTIONS_AUDIO_RENDERER_HARDWARE")],
                value: o.provider === "software" ? 1 : 0
            }, function r(v) {
                o.provider = v ? "software" : "hardware";
                o.apply()
            }));
            return p
        },
        _renderGame: function g() {
            var r = [],
                o = j.api.general;
            r.push(this._makeRow({
                type: "radio",
                label: this.trans("WEB_GAME_OPTIONS_AUTO_RELOAD"),
                values: [this.trans("WEB_COMMON_YES"), this.trans("WEB_COMMON_NO")],
                value: !!o.autoReload
            }, function p(s) {
                o.autoReload = s;
                o.apply()
            }));
            r.push(this._makeRow({
                type: "radio",
                label: this.trans("WEB_GAME_OPTIONS_CAMERA_SHAKE"),
                values: [this.trans("WEB_COMMON_YES"), this.trans("WEB_COMMON_NO")],
                value: !!o.cameraShake
            }, function q(s) {
                o.cameraShake = !!s;
                o.apply()
            }));
            return r
        },
        render: function b() {
            this.el.appendChild(this.make("h2", null, "Settings"));
            var q = this._renderVideo(),
                o = this._renderAudio(),
                p = this._renderGame();
            this.video = this.createView(j.View.LabelBox, {
                className: "video",
                label: this.trans("WEB_GAME_OPTIONS_VIDEO"),
                content: q
            }).render().attach();
            this.audio = this.createView(j.View.LabelBox, {
                className: "audio",
                label: this.trans("WEB_GAME_OPTIONS_AUDIO"),
                content: o
            }).render().attach();
            this.game = this.createView(j.View.LabelBox, {
                className: "game",
                label: this.trans("WEB_GAME_OPTIONS_GAME"),
                content: p
            }).render().attach();
            this.createView(j.View.Button, {
                text: "Reset",
                className: "small"
            }, "reset").render().attach();
            this.$el.disableTextSelect()
        }
    })
}(this));
(function(k) {
    var n = k.APP,
        h = n.win,
        e = n.$,
        p = n._,
        m = n.doc,
        o = n.View.prototype;
    n.View.Controls = n.View.extend({
        name: "controls-view",
        events: {
            "click a.key": "_onClickKey",
            "mouseenter a.key": "_onMouseEnterKey"
        },
        categoryGroupMapping: {
            foot: {
                left: ["movement", "mouse"],
                right: ["weapons", "equipment"]
            },
            vehicle: {
                left: ["land", "land-mouse"],
                right: ["sea", "sea-mouse"]
            },
            aircraft: {
                left: ["air", "air-mouse"],
                right: ["helicopter", "helicopter-mouse"]
            },
            general: {
                left: ["general"],
                right: ["positions"]
            }
        },
        labelMapping: {
            movement: "WEB_GAME_OPTIONS_MOVEMENT",
            mouse: "WEB_GAME_OPTIONS_MOUSE_INFANTRY",
            weapons: "WEB_GAME_OPTIONS_WEAPONS",
            equipment: "WEB_GAME_OPTIONS_EQUIPMENT_BAR",
            land: "WEB_GAME_OPTIONS_LAND_VEHICLE_CONTROLS",
            "land-mouse": "WEB_GAME_OPTIONS_LAND_VEHICLE_MOUSE",
            sea: "WEB_GAME_OPTIONS_SEA_VEHICLE_CONTROLS",
            "sea-mouse": "WEB_GAME_OPTIONS_SEA_VEHICLE_MOUSE",
            air: "WEB_GAME_OPTIONS_PLANE_CONTROLS",
            "air-mouse": "WEB_GAME_OPTIONS_PLANE_MOUSE",
            helicopter: "WEB_GAME_OPTIONS_HELICOPTER_CONTROLS",
            "helicopter-mouse": "WEB_GAME_OPTIONS_HELICOPTER_MOUSE",
            general: "WEB_GAME_OPTIONS_GENERAL_CONTROLS",
            positions: "WEB_GAME_OPTIONS_VEHICLE/AIRCRAFT_POSITIONS"
        },
        initialize: function d() {
            p.bindAll(this);
            this.bind("tab:select", this._onTabSelect, this);
            this.collection.bind("change", this._onChange, this);
            this.bind("reset:click", function() {
                this.sound("revert")
            }, this)
        },
        destroy: function l() {
            this.collection.unbind("change", this._onChange, this)
        },
        _onClickKey: function f(s) {
            s.preventDefault();
            var u = this.$(s.currentTarget).attr("cid"),
                r = this.collection.getByCid(u);
            if (r) {
                this.sound("click");
                this.trigger("click:key", r)
            }
        },
        _onMouseEnterKey: function b() {
            this.sound("hover")
        },
        _onTabSelect: function a(s, r) {
            this.category = r.toLowerCase();
            this._renderBody()
        },
        _onChange: function j(r) {
            this._renderBody()
        },
        _renderControl: function g(r) {
            var u = n.doc.createDocumentFragment(),
                v = r.get("keyName"),
                s;
            u.appendChild(this.make("span", {
                "class": "label"
            }, this.trans(r.get("name"))));
            if (!v || v === "null") {
                v = "?"
            }
            u.appendChild(this.make("a", {
                href: "#key",
                "class": "key" + (v === "?" ? " empty" : ""),
                cid: r.cid
            }, v));
            return u
        },
        _renderMouse: function c(v) {
            var A = ["mouseSensitivity", "mouseYawFactor", "mousePitchFactor"],
                w = {
                    mouseSensitivity: "WEB_GAME_OPTIONS_MOUSE_SENSITIVITY",
                    mouseYawFactor: "WEB_GAME_OPTIONS_MOUSE_YAW",
                    mousePitchFactor: "WEB_GAME_OPTIONS_MOUSE_PITCH",
                    invertMouse: "WEB_GAME_OPTIONS_MOUSE_INVERTED"
                },
                B = n.doc.createDocumentFragment(),
                r = this.make("div", {
                    "class": "switch"
                }),
                s = "invert-mouse-group-" + v.get("group") + "-" + v.cid,
                z, y, x;
            x = p.map(A, function(F) {
                var D = n.doc.createDocumentFragment(),
                    E = this.make("div", {
                        "class": "slider"
                    });
                D.appendChild(this.make("span", {
                    "class": "label"
                }, this.trans(w[F])));
                e(E).slider({
                    range: "min",
                    orientation: "horizontal",
                    min: 0,
                    max: 500,
                    value: v.get(F) * 100,
                    start: p.bind(function() {
                        this.sound("select:open")
                    }, this),
                    stop: p.bind(function C(H, J) {
                        this.sound("select:close");
                        var G = {},
                            I = J.value / 100;
                        G[F] = I;
                        v.set(G, {
                            silent: true
                        }).mapInput()
                    }, this)
                }).bind("mouseenter", p.bind(function() {
                    this.sound("hover")
                }, this));
                D.appendChild(E);
                return D
            }, this);
            B.appendChild(this.make("span", {
                "class": "label"
            }, this.trans(w.invertMouse)));
            r.appendChild(this.make("label", {
                "for": s + "-yes"
            }, this.trans("WEB_COMMON_YES")));
            z = this.make("input", {
                type: "radio",
                id: s + "-yes",
                name: s,
                value: 1
            });
            r.appendChild(z);
            r.appendChild(this.make("label", {
                "for": s + "-no"
            }, this.trans("WEB_COMMON_NO")));
            y = this.make("input", {
                type: "radio",
                id: s + "-no",
                name: s,
                value: 0
            });
            r.appendChild(y);
            if (v.get("invertMouse")) {
                z.checked = true
            } else {
                y.checked = true
            }
            e("input", r).bind("change", p.bind(function u() {
                if (z.checked) {
                    this.sound("select:open")
                } else {
                    this.sound("select:close")
                }
                v.set({
                    invertMouse: !!z.checked
                }, {
                    silent: true
                }).mapInput()
            }, this)).customInput();
            e("label", r).bind("mouseenter", p.bind(function() {
                this.sound("hover")
            }, this));
            B.appendChild(r);
            x.push(B);
            return x
        },
        _renderBody: function q() {
            if (!this.body || !this.body.parentNode) {
                this.body = this.make("div", {
                    "class": "body"
                });
                this.el.appendChild(this.body)
            }
            this.$(this.body).empty();
            var r = this.categoryGroupMapping[this.category],
                s = {
                    left: this.make("div", {
                        "class": "col-left"
                    }),
                    right: this.make("div", {
                        "class": "col-right"
                    })
                };
            p.forEach(r, function(u, w) {
                var v = s[w];
                p.forEach(u, function(y) {
                    var x = this.collection.filterBy({
                        category: this.category,
                        group: y
                    }).map(function(z) {
                        if (z.has("invertMouse")) {
                            return this._renderMouse(z)
                        }
                        return this._renderControl(z)
                    }, this);
                    if (x.length === 1) {
                        x = x.pop()
                    }
                    this.createView(n.View.LabelBox, {
                        container: v,
                        label: this.trans(this.labelMapping[y]),
                        content: x
                    }).render().attach()
                }, this)
            }, this);
            this.body.appendChild(s.left);
            this.body.appendChild(s.right);
            this.trigger("render:body")
        },
        render: function i() {
            this.$menuBar = e("<div>").addClass("menu-bar").appendTo(this.$el);
            this.tabs = this.createView(n.View.Tabs, {
                container: this.$menuBar,
                className: "category-tabs",
                tabs: ["Foot", "Vehicle", "Aircraft", "General"]
            }, "tab").render().attach().select(this.category || 0);
            this.createView(n.View.Button, {
                text: "Reset all controls",
                className: "small"
            }, "reset").render().attach();
            this.$el.disableTextSelect()
        }
    })
}(this));
APP.task("options", function taskOptions(d) {
    var g = APP.win,
        e = APP.$,
        i = APP._,
        f = APP.ns("options"),
        a = f.$el = e("<div>").addClass("main main_options page hidden loading").appendTo("#frontend"),
        h = f.$panelLeft = e("<div>").addClass("page-panel left").appendTo(a),
        c = f.$panelRight = e("<div>").addClass("page-panel right").appendTo(a);
    f.once("initialized", function b() {
        f.$el.removeClass("loading")
    });
    d()
});
APP.task("options.data", ["options"], function taskOptionsData(a) {
    var f = APP.win,
        e = APP.$,
        d = APP._,
        c = APP.ns("options"),
        b = {
            foot: {
                movement: [{
                    name: "WEB_GAME_OPTIONS_FORWARD",
                    map: "_InfantryPlayerInputControlMap",
                    index: "3",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_BACKWARD",
                    map: "_InfantryPlayerInputControlMap",
                    index: "3",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_STRAFE_LEFT",
                    map: "_InfantryPlayerInputControlMap",
                    index: "0",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_STRAFE_RIGHT",
                    map: "_InfantryPlayerInputControlMap",
                    index: "0",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_LOOK_UP",
                    map: "_defaultPlayerInputControlMap",
                    index: "5",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_LOOK_DOWN",
                    map: "_defaultPlayerInputControlMap",
                    index: "5",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_TURN_LEFT",
                    map: "_defaultPlayerInputControlMap",
                    index: "4",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_TURN_RIGHT",
                    map: "_defaultPlayerInputControlMap",
                    index: "4",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_JUMP_PARA",
                    map: "_InfantryPlayerInputControlMap",
                    index: "9",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SPRINT",
                    map: "_InfantryPlayerInputControlMap",
                    index: "13",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_CROUCH",
                    map: "_InfantryPlayerInputControlMap",
                    index: "40",
                    secondary: false,
                    invert: false
                }],
                mouse: [{
                    map: "_InfantryPlayerInputControlMap",
                    mouseSensitivity: 0,
                    mouseYawFactor: 0,
                    mousePitchFactor: 0,
                    invertMouse: false
                }],
                weapons: [{
                    name: "WEB_GAME_OPTIONS_FIRE",
                    map: "_InfantryPlayerInputControlMap",
                    index: "8",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_ZOOM",
                    map: "_InfantryPlayerInputControlMap",
                    index: "33",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_RELOAD",
                    map: "_defaultPlayerInputControlMap",
                    index: "34",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_NEXT_SLOT",
                    map: "_defaultPlayerInputControlMap",
                    index: "50",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_PREVIOUS_SLOT",
                    map: "_defaultPlayerInputControlMap",
                    index: "51",
                    secondary: false,
                    invert: false
                }],
                equipment: [{
                    name: "WEB_GAME_OPTIONS_SLOT_1",
                    map: "_defaultPlayerInputControlMap",
                    index: "15",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SLOT_2",
                    map: "_defaultPlayerInputControlMap",
                    index: "16",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SLOT_3",
                    map: "_defaultPlayerInputControlMap",
                    index: "17",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SLOT_4",
                    map: "_defaultPlayerInputControlMap",
                    index: "18",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SLOT_5",
                    map: "_defaultPlayerInputControlMap",
                    index: "19",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SLOT_6",
                    map: "_defaultPlayerInputControlMap",
                    index: "20",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SLOT_7",
                    map: "_defaultPlayerInputControlMap",
                    index: "21",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SLOT_8",
                    map: "_defaultPlayerInputControlMap",
                    index: "22",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SLOT_9",
                    map: "_defaultPlayerInputControlMap",
                    index: "23",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SLOT_10",
                    map: "_defaultPlayerInputControlMap",
                    index: "24",
                    secondary: false,
                    invert: false
                }]
            },
            vehicle: {
                land: [{
                    name: "WEB_GAME_OPTIONS_FIRE",
                    map: "_LandPlayerInputControlMap",
                    index: "8",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_ALT-FIRE",
                    map: "_LandPlayerInputControlMap",
                    index: "33",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SMOKE",
                    map: "_LandPlayerInputControlMap",
                    index: "49",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_REPAIR",
                    map: "_LandPlayerInputControlMap",
                    index: "35",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_ACCELERATE",
                    map: "_LandPlayerInputControlMap",
                    index: "3",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_DECELERATE",
                    map: "_LandPlayerInputControlMap",
                    index: "3",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_STEER_LEFT",
                    map: "_LandPlayerInputControlMap",
                    index: "0",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_STEER_RIGHT",
                    map: "_LandPlayerInputControlMap",
                    index: "0",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_CROUCH",
                    map: "_LandPlayerInputControlMap",
                    index: "40",
                    secondary: false,
                    invert: false
                }],
                "land-mouse": [{
                    map: "_LandPlayerInputControlMap",
                    mouseSensitivity: 0,
                    mouseYawFactor: 0,
                    mousePitchFactor: 0,
                    invertMouse: false
                }],
                sea: [{
                    name: "WEB_GAME_OPTIONS_FIRE",
                    map: "_SeaPlayerInputControlMap",
                    index: "8",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_ALT-FIRE",
                    map: "_SeaPlayerInputControlMap",
                    index: "33",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_REPAIR",
                    map: "_SeaPlayerInputControlMap",
                    index: "35",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_ACCELERATE",
                    map: "_SeaPlayerInputControlMap",
                    index: "3",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_DECELERATE",
                    map: "_SeaPlayerInputControlMap",
                    index: "3",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_STEER_LEFT",
                    map: "_SeaPlayerInputControlMap",
                    index: "0",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_STEER_RIGHT",
                    map: "_SeaPlayerInputControlMap",
                    index: "0",
                    secondary: false,
                    invert: false
                }],
                "sea-mouse": [{
                    map: "_SeaPlayerInputControlMap",
                    mouseSensitivity: 0,
                    mouseYawFactor: 0,
                    mousePitchFactor: 0,
                    invertMouse: false
                }]
            },
            aircraft: {
                air: [{
                    name: "WEB_GAME_OPTIONS_MISSILES",
                    map: "_AirPlayerInputControlMap",
                    index: "8",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_GUN",
                    map: "_AirPlayerInputControlMap",
                    index: "33",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_BOMBS",
                    map: "_AirPlayerInputControlMap",
                    index: "47",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_COUNTERMEASURE",
                    map: "_AirPlayerInputControlMap",
                    index: "49",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_REPAIR",
                    map: "_AirPlayerInputControlMap",
                    index: "35",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_MOUSE_LOOK",
                    map: "_AirPlayerInputControlMap",
                    index: "11",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_ACCELERATE",
                    map: "_AirPlayerInputControlMap",
                    index: "3",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_DECELERATE",
                    map: "_AirPlayerInputControlMap",
                    index: "3",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_STEER_LEFT",
                    map: "_AirPlayerInputControlMap",
                    index: "0",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_STEER_RIGHT",
                    map: "_AirPlayerInputControlMap",
                    index: "0",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_PITCH_FORWARD",
                    map: "_AirPlayerInputControlMap",
                    index: "1",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_PITCH_BACKWARD",
                    map: "_AirPlayerInputControlMap",
                    index: "1",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_ROLL_LEFT",
                    map: "_AirPlayerInputControlMap",
                    index: "2",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_ROLL_RIGHT",
                    map: "_AirPlayerInputControlMap",
                    index: "2",
                    secondary: false,
                    invert: false
                }],
                "air-mouse": [{
                    map: "_AirPlayerInputControlMap",
                    mouseSensitivity: 0,
                    mouseYawFactor: 0,
                    mousePitchFactor: 0,
                    invertMouse: false
                }],
                helicopter: [{
                    name: "WEB_GAME_OPTIONS_FIRE",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "8",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_ALT-FIRE",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "33",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_COUNTERMEASURE",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "49",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_REPAIR",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "35",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_MOUSE_LOOK",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "11",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_ACCELERATE",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "3",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_DECELERATE",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "3",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_STEER_LEFT",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "0",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_STEER_RIGHT",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "0",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_PITCH_FORWARD",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "1",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_PITCH_BACKWARD",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "1",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_ROLL_LEFT",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "2",
                    secondary: false,
                    invert: true
                }, {
                    name: "WEB_GAME_OPTIONS_ROLL_RIGHT",
                    map: "_HelicopterPlayerInputControlMap",
                    index: "2",
                    secondary: false,
                    invert: false
                }],
                "helicopter-mouse": [{
                    map: "_HelicopterPlayerInputControlMap",
                    mouseSensitivity: 0,
                    mouseYawFactor: 0,
                    mousePitchFactor: 0,
                    invertMouse: false
                }]
            },
            general: {
                general: [{
                    name: "WEB_GAME_OPTIONS_ENTER/EXIT",
                    map: "_defaultPlayerInputControlMap",
                    index: "10",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_TOGGLE_CAMERA",
                    map: "_defaultPlayerInputControlMap",
                    index: "37",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_ZOOM_MAP",
                    map: "_defaultGameControlMap",
                    index: "36",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SHOW_MAP",
                    map: "_defaultGameControlMap",
                    index: "35",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SCOREBOARD",
                    map: "_defaultGameControlMap",
                    index: "55",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SCREEN_SHOT",
                    map: "_defaultGameControlMap",
                    index: "18",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_CHAT",
                    map: "_defaultGameControlMap",
                    index: "29",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SAY_ALL",
                    map: "_defaultGameControlMap",
                    index: "22",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_SAY_TEAM",
                    map: "_defaultGameControlMap",
                    index: "23",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_FACE_CAMERA",
                    map: "_defaultGameControlMap",
                    index: "56",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_EMOTES",
                    map: "_defaultGameControlMap",
                    index: "34",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_BOOKMARK_SERVER",
                    map: "_defaultGameControlMap",
                    index: "57",
                    secondary: false,
                    invert: false
                }],
                positions: [{
                    name: "WEB_GAME_OPTIONS_POSITION_1",
                    map: "_defaultPlayerInputControlMap",
                    index: "25",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_POSITION_2",
                    map: "_defaultPlayerInputControlMap",
                    index: "26",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_POSITION_3",
                    map: "_defaultPlayerInputControlMap",
                    index: "27",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_POSITION_4",
                    map: "_defaultPlayerInputControlMap",
                    index: "28",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_POSITION_5",
                    map: "_defaultPlayerInputControlMap",
                    index: "29",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_POSITION_6",
                    map: "_defaultPlayerInputControlMap",
                    index: "30",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_POSITION_7",
                    map: "_defaultPlayerInputControlMap",
                    index: "31",
                    secondary: false,
                    invert: false
                }, {
                    name: "WEB_GAME_OPTIONS_POSITION_8",
                    map: "_defaultPlayerInputControlMap",
                    index: "32",
                    secondary: false,
                    invert: false
                }]
            }
        },
        g = [];
    d.forEach(b, function(h, i) {
        d.forEach(h, function(j, k) {
            var l;
            if (k.indexOf("mouse") === -1) {
                l = APP.Model.Control
            } else {
                l = APP.Model.Mouse
            }
            d.forEach(j, function(m) {
                m.category = i;
                m.group = k;
                g.push(new l(m))
            })
        })
    });
    c.collection = new APP.Collection(g);
    b = g = null;
    a()
});
APP.task("options.settings", ["options.data"], function taskOptionsSettings(c) {
    var h = APP.win,
        g = APP.$,
        f = APP._,
        d = APP.ns("options"),
        b = d.settings = new APP.View.Settings({
            container: d.$panelLeft
        });
    b.bind("attach", function a() {
        var j = "h2, a.button-view, span.label";
        b.$(j).renderText();
        b.bind("render", function i() {
            b.$(j).renderText()
        })
    });
    b.bind("reset:click", function() {
        var j = APP.api.video,
            i = APP.api.audio,
            k = APP.api.general;
        j.startInFullscreen = false;
        j.reset();
        j.save();
        i.reset();
        i.quality = "High";
        i.apply();
        k.reset();
        k.apply();
        b.render()
    });
    d.initialize(function e(i) {
        b.once("render", i);
        b.render();
        b.attach()
    });
    c()
});
APP.task("options.controls", ["options.data"], function taskOptionsControls(b) {
    var e = APP.win,
        c = APP.$,
        i = APP._,
        d = APP.ns("options"),
        g = d.controls = new APP.View.Controls({
            container: d.$panelRight,
            collection: d.collection
        });
    g.bind("attach", function f() {
        var j = function j() {
            g.$("h2, a.button-view, a.button-view").renderText(true);
            g.$("div.tabs-view a").renderText({
                hover: true
            });
            g.$("span.label").renderText()
        };
        j();
        g.bind("render", j);
        g.bind("render:body", j);
        g.bind("tab:select", j)
    });
    g.bind("click:key", function a(l) {
        var p = {
                title: APP.sidis.trans("WEB_GAME_TOOLTIPS_HEADER_CONTROLS_PRESSKEY"),
                body: APP.sidis.trans("WEB_GAME_TOOLTIPS_MESSAGE_CONTROLS_PRESSKEY")
            },
            n = new APP.View.Dialog({
                className: "map-input-dialog",
                renderData: p
            }),
            o = null,
            m = function m(u, r, w) {
                o = r;
                var v = {
                        close: true
                    },
                    s = APP.api.localization;
                if (u) {
                    if (r === "duplicate") {
                        v.title = APP.sidis.trans("WEB_GAME_TOOLTIPS_HEADER_CONTROLS_ERROR_1");
                        v.body = APP.sidis.trans("WEB_GAME_TOOLTIPS_MESSAGE_CONTROLS_ERROR_1");
                        v.body += "<ul>";
                        v.body += i.map(w.split(";"), function(x) {
                            return "<li>" + s.get(x) + "</li>"
                        }).join("");
                        v.body += "</ul>";
                        v.buttonRight = APP.sidis.trans("WEB_GAME_TOOLTIPS_FORCE_BTN")
                    } else {
                        if (r === "timeout") {
                            v.title = APP.sidis.trans("WEB_GAME_TOOLTIPS_HEADER_CONTROLS_ERROR_2");
                            v.body = APP.sidis.trans("WEB_GAME_TOOLTIPS_MESSAGE_CONTROLS_ERROR_2");
                            v.buttonRight = "Retry"
                        } else {
                            if (r === "reserved") {
                                v.title = APP.sidis.trans("WEB_GAME_TOOLTIPS_HEADER_CONTROLS_ERROR_3");
                                v.body = APP.sidis.trans("WEB_GAME_TOOLTIPS_MESSAGE_CONTROLS_ERROR_3");
                                v.buttonRight = "Retry"
                            } else {
                                v.title = "Error";
                                v.body = u.message
                            }
                        }
                    }
                    n.setRenderData(v).render();
                    n.$el.addClass(r)
                } else {
                    n.destroy();
                    n = null
                }
            };
        n.bind("close", function j() {
            n.destroy();
            n = null
        });
        n.bind("button:right", function k() {
            var r = APP.api.controls;
            if (o === "duplicate") {
                r.forceSetLastInput();
                r.apply();
                d.collection.invoke("reload");
                n.destroy();
                n = null
            } else {
                n.setRenderData(p).render();
                i.delay(i.bind(l.mapInput, l), 400, m)
            }
        });
        n.bind("render", function q() {
            n.$("h2.title, h3").renderText();
            n.$("a.button, a.button-view").renderText({
                hover: true
            })
        });
        n.attach();
        n.render();
        n.show();
        i.delay(i.bind(l.mapInput, l), 400, m)
    });
    g.bind("reset:click", function() {
        var j = APP.api.controls;
        j.reset();
        j.apply();
        d.collection.invoke("reload")
    });
    d.initialize(function h(j) {
        g.once("render", j);
        g.render();
        g.attach()
    });
    b()
});
APP.task("options.routes", ["options.controls"], function taskOptionsRoutes(b) {
    var g = APP.win,
        e = APP.$,
        d = APP._,
        c = APP.ns("options");
    APP.bind("page:options", function f(j, i) {
        if (j !== "options") {
            g.dontUpdateDoll = true;
            g.hideDoll()
        }
        c.run(function() {
            if (i.tab) {
                c.controls.tabs.select(i.tab)
            }
        })
    });
    APP.route("options", "options", function h() {
        APP.page("options")
    });
    APP.route("options/:tab", "options", function a(i) {
        APP.page("options", {
            tab: d.indexOf(["general", "vehicle", "air", "foot"], i)
        })
    });
    b()
});
APP.task("home", ["abilities"], function taskHome(b) {
    var g = APP.win,
        f = APP.$,
        c = APP._,
        d = APP.ns("home"),
        a = APP.ns("abilities"),
        e = d.$el = f("div.main.main_home");
    f("#show-soldier-list, #show-more-soldiers").bind("click", function(h) {
        h.preventDefault();
        APP.navigate("/roster", true)
    });
    f.highlights.startSlideshow();
    b()
});
APP.task("home.routes", function taskHomeRoutes(c) {
    var f = APP.win,
        e = APP.$,
        d = APP._;
    APP.bind("page:home", function a(g) {
        if (g !== "home") {
            f.dontUpdateDoll = false;
            f.showDoll();
            if (f.bundleOnDoll) {
                f.dressDoll()
            }
        }
    });
    APP.route("home", "home", function b() {
        APP.page("home")
    });
    c()
});
(function(at) {
    if (typeof require !== "undefined") {
        if (!at.APP) {
            at.APP = require("./../common/app")
        }
        if (!at.APP.Model) {
            at.APP.Model = require("./../common/model")
        }
        if (!at.APP.Collection) {
            at.APP.Collection = require("./../common/collection")
        }
        if (!at.APP.Collection.Offers) {
            at.APP.Collection.Offers = require("./../store/collection.offers")
        }
    }
    var X = at.APP,
        S = X._,
        am = X.$,
        af = X.win,
        ax = {
            weapons: "weapon",
            gadgets: "weapon",
            abilities: "weapon",
            appearances: "appearance",
            head: "appearance",
            face: "appearance",
            uniform: "appearance",
            accessory1: "appearance",
            accessory2: "appearance",
            boosters: "booster",
            gear: "booster",
            bundles: "bundle",
            attachment: "attachment",
            attachments: "attachment",
            item_upgrades: "upgrade",
            upgrades: "upgrade",
            item_pockets: "pocket",
            pockets: "pocket"
        },
        A = ["MUZZLE", "SCOPE", "BARREL", "AMMO", "STOCK", "TEXTURE"],
        b = ["weapon", "appearance", "booster", "bundle", "attachment", "trainingpoint", "upgrade", "pocket"],
        W = X.Model.prototype,
        g = {
            primary: 1,
            secondary: 1,
            head: 1,
            face: 1,
            uniform: 1,
            accessory1: 1,
            accessory2: 1
        },
        N = X.namespace("abilities"),
        O = X.namespace("config"),
        D = {},
        c = {},
        ai = function ai(aE, aD) {
            return Math.floor(Math.random() * (aD - aE + 1)) + aE
        },
        F = {
            Action: "action",
            Accuracy: "accuracy",
            AccuracyLvL: "accuracy",
            Zoom: "zoom",
            Damage: "damage",
            DamageLvL: "damage",
            Rof: "rof",
            ROF: "rof",
            ROFLvL: "rof",
            Range: "range",
            RangeLvL: "range",
            Ammo: "ammo",
            MagSizeIncrease: "ammo",
            Mags: "mags",
            nrOfMAgs: "mags",
            MagIncrease: "mags",
            DamageTaken: "damageTaken",
            SprintSpeed: "sprintSpeed",
            NrRPGRound: "numRPGRound",
            NrHandGrenade: "numHandGrenade",
            NrClaymore: "numClaymore",
            NrC4: "numC4",
            NrMedBox: "numMedBox",
            NrPrimaryMag: "nrPrimaryMag"
        },
        ay = false,
        an = "ITEM_IMAGE_DATA:";
    X.Model.Item = X.Model.extend({
        normalizeKeys: F,
        defaults: {
            id: null,
            type: null,
            name: null,
            expired: false,
            expiredate: false,
            buyable: true,
            owned: false,
            equippedSlot: null,
            promotionType: null,
            bundles: [],
            prices: []
        },
        schema: {
            accuracy: "number",
            action: "number",
            damage: "number",
            ammo: "number",
            mags: "number",
            range: "number",
            rof: "number",
            zoom: "number",
            fitsSlot: "number",
            tier: "number",
            usecount: "number",
            minNumPockets: "number",
            maxNumPockets: "number",
            numberOfPockets: "number",
            buyable: "bool",
            expired: "bool",
            isnew: "bool",
            owned: "bool",
            ownedPermanent: "bool",
            isDefault: "bool",
            locked: "bool",
            promotionLabel: "string",
            promotionType: function ap(aD) {
                if ((aD || "").toLowerCase() === "default") {
                    return null
                }
                return aD
            },
            equippedSlot: function al(aD) {
                aD = X.Model.Schema.number(aD);
                if (aD instanceof Error) {
                    return null
                }
                return aD
            },
            bestInClass: function u(aD) {
                return S.map(aD || [], function(aE) {
                    if (F.hasOwnProperty(aE)) {
                        return F[aE]
                    }
                    return aE
                }, this)
            },
            attachments: function C(aD) {
                if (S.isEmpty(aD)) {
                    return null
                }
                return aD
            },
            upgrades: function ao(aE) {
                if (S.isEmpty(aE)) {
                    return {}
                } else {
                    if (S.isArray(aE)) {
                        var aD = {};
                        S.forEach(aE, function(aG, aF) {
                            aD[aF] = aG
                        });
                        return aD
                    }
                }
                return aE
            },
            type: function U(aE, aD) {
                aD.itemType = ax.hasOwnProperty(aE) ? ax[aE] : aE;
                return aE
            },
            itemType: function V(aE, aD) {
                if (aE) {
                    return aE
                } else {
                    if (aD.type) {
                        return ax.hasOwnProperty(aD.type) ? ax[aD.type] : aD.type
                    }
                }
                return new Error('Unable to set "itemType"')
            },
            prices: function m(aF, aD, aE) {
                aD.offers = aE.cast("offers", aF);
                return null
            },
            offers: function i(aD) {
                return new X.Collection.Offers(aD || [])
            }
        },
        initialize: function I() {
            var aD = this.get("itemsType");
            this._imageData = {};
            this._attachmentImages = {};
            if (this.isEquippable()) {
                this.bind("change:equippedSlot", this._onEquippedSlotChange, this)
            }
            if (this.isCustomizable()) {
                if (this.isItemType("weapon")) {
                    this.bind("change:attachments", this._onChangeAttachments, this)
                } else {
                    if (this.isItemType("appearance")) {
                        this.bind("change:upgrades", this._setEquippedUpgrades, this)
                    }
                }
            }
            if (this.isItemType("upgrade")) {
                this.set("categoryname", X.sidis.trans("WEB_GAME_ITEM_CATEGORY_" + this.get("category").toUpperCase() + "_UPGRADE"))
            }
            if (this.isLocked()) {
                this._lockProgress()
            }
            if (this.isPromoted()) {
                this._setPromotion()
            }
            this.bind("change:promotionType", this._setPromotion, this);
            this._onChangeOffers();
            this.bind("change:offers", this._onChangeOffers, this);
            if (this.has("dependency")) {
                S.defer(S.bind(this._handleDependency, this))
            }
            if (this.has("correspondingGearId")) {
                S.defer(S.bind(this._handleCorrespondingGearId, this))
            }
        },
        _onChangeAttachments: function() {
            this._imageData = {};
            this._processCustomizations();
            if (ay) {
                af.sessionStorage.removeItem(an + this.id + ":min");
                af.sessionStorage.removeItem(an + this.id + ":med")
            }
        },
        _onChangeOffers: function M() {
            var aE = this.get("offers"),
                aD = this.previous("offers");
            if (aD instanceof X.Collection.Offers && aD !== aE) {
                aD.unbind()
            }
            if (aE instanceof X.Collection.Offers) {
                this.proxyEvents(aE, "offer")
            }
        },
        _handleDependency: function ad() {
            var aD = N.collection && N.collection.get(this.get("dependency")),
                aE = 0;
            if (aD) {
                aE = aD.get("level");
                aD.bind("change:level", function() {
                    this.set("invalidDependency", (aD.get("level") === 0))
                }, this)
            } else {
                X.warn('Unable to find "dependency", defaulting to invalid!')
            }
            this.set("invalidDependency", (aE === 0))
        },
        _handleCorrespondingGearId: function aa() {
            var aE = this.collection.get(this.get("correspondingGearId")),
                aD = true;
            if (aE) {
                aD = aE.isOwned();
                aE.bind("change:owned", function() {
                    this.set("invalidCorrespondingGearId", aE.isOwned())
                }, this)
            } else {
                X.warn('Unable to find "correspondingGearId", defaulting to invalid!')
            }
            this.set("invalidCorrespondingGearId", aD)
        },
        _processAttachments: function ac() {
            if (this.isCustomizable()) {
                var aE = this.collection.getModelAttachedItems(this),
                    aD = {};
                S.forEach(aE, function(aF, aG) {
                    var aH = S.indexOf(A, aG.toUpperCase()) + 1;
                    aD[aH] = aF ? aF.id : null
                });
                this.set({
                    attachments: aD
                }, {
                    silent: true
                })
            }
        },
        _processUpgrades: function r() {},
        _processCustomizations: function aB() {
            if (this.has("attachments")) {
                return this._processAttachments()
            } else {
                if (this.has("upgrades")) {
                    return this._processUpgrades()
                }
            }
            return this
        },
        _setPromotion: function aw() {
            var aF = this.get("promotionType"),
                aG = (aF || "").toLowerCase(),
                aH = parseInt(aG, 10),
                aE, aD;
            if (aH) {
                aG = "off";
                aE = X.sidis.trans("WEB_GAME_PROMOTION_OFF", {
                    "%off%": aH
                })
            } else {
                if (aG === "new") {
                    aE = X.sidis.trans("WEB_GAME_PROMOTION_NEW")
                } else {
                    if (aG === "popular") {
                        aE = X.sidis.trans("WEB_GAME_PROMOTION_POPULAR")
                    } else {
                        if (aG) {
                            aG = "other";
                            aD = "WEB_GAME_PROMOTION_" + aG.toUpperCase();
                            aE = X.sidis.trans(aD);
                            if (aE === aD) {
                                aE = aF
                            }
                        } else {
                            aG = null
                        }
                    }
                }
            }
            this.set({
                promotionType: aG,
                promotionLabel: aE
            }, {
                silent: true
            })
        },
        _lockProgress: function l() {
            var aD = -1,
                aG = this.get("lockType"),
                aF, aE = (typeof require !== "undefined") ? {
                    level: 10
                } : X.ns("config").persona;
            if (aG === "level") {
                aF = parseInt(this.get("lockCriteria"), 10);
                aD = Math.round(100 * (aE.level / aF)) / 100
            }
            this.set({
                lockProgress: aD
            }, {
                silent: true
            });
            return this
        },
        _onEquippedSlotChange: function E() {
            var aH = this.collection,
                aJ = this.get("itemType"),
                aI = this.get("equippedSlot"),
                aK = this.previous("equippedSlot"),
                aE, aF = this.get("validationGroup"),
                aG, aM, aL, aD;
            if (S.isNumber(aI)) {
                aE = aH.filterBy({
                    itemType: aJ,
                    equippedSlot: aI
                }).without(this);
                if (aE.length !== 0) {
                    if (S.isNumber(aK)) {
                        S.invoke(aE, "set", {
                            equippedSlot: aK
                        })
                    } else {
                        S.invoke(aE, "unset", "equippedSlot")
                    }
                }
                if (g.hasOwnProperty(aF)) {
                    if (aF === "primary") {
                        aL = aH.get(7000);
                        aG = aL && aL.get("owned") ? 2 : 1;
                        if (aG === 1) {
                            aD = aH.getEquippedCustomizations().get(7109);
                            if (aD && aD.isOwned()) {
                                aG = 2
                            }
                        }
                    } else {
                        aG = g[aF]
                    }
                    aM = aH.filterBy({
                        itemType: aJ,
                        isEquipped: true,
                        validationGroup: aF
                    });
                    if (aM.length > aG) {
                        aM = aM.sortBy(function(aN) {
                            return aN.get("equippedSlot")
                        });
                        aM.reverse();
                        S.forEach(S.without(aM, this).slice(aG - 1), function(aN) {
                            aN.unset("equippedSlot")
                        })
                    }
                }
            }
            if (aJ === "appearance") {
                this._setEquippedUpgrades()
            }
        },
        _setEquippedUpgrades: function y() {
            var aI = this.collection,
                aE = this.get("equippedSlot"),
                aD = this.isEquipped(),
                aH = S.values(this.get("upgrades")),
                aF = S.values(this.previous("upgrades")),
                aG = S.difference(aF, aH);
            S.forEach(aG, function(aJ) {
                aJ = aI.get(aJ);
                if (aJ) {
                    aJ.unset("equippedSlot")
                }
            });
            S.forEach(aH, function(aJ, aK) {
                aJ = aI.get(aJ);
                if (aJ) {
                    if (aD) {
                        aJ.set("equippedSlot", parseInt(aK.toString() + aE.toString(), 10))
                    } else {
                        aJ.unset("equippedSlot")
                    }
                }
            })
        },
        url: function ak() {
            return O.getItemUrl + this.id
        },
        getImage: function J(aD) {
            if (this.has("image")) {
                return this.get("image")
            }
            var aE = this.get("category"),
                aF = ["barrel", "ammo", "stock"];
            if (S.indexOf(aF, aE) !== -1) {
                return O.imageFolder + "item-icons/" + aD + "/" + aE + ".png"
            }
            aD = aD || "max";
            return O.imageFolder + "item-icons/" + aD + "/" + this.id + ".png"
        },
        getAttachmentImage: function L(aD) {
            aD = aD || "max";
            if (this._attachmentImages.hasOwnProperty(aD)) {
                return this._attachmentImages[aD]
            }
            return O.imageFolder + "attachment-icons/" + aD + "/" + this.id + ".png"
        },
        setAttachmentImage: function H(aE, aD) {
            this._attachmentImages[aE] = aD;
            return this
        },
        hasComposedImage: function ab(aE) {
            var aD = !!(this._imageData[aE] && this._imageData[aE].image && this._imageData[aE].silhouette),
                aF = an + this.id + ":" + aE;
            if (aD) {
                return true
            }
            if (ay && af.sessionStorage.hasOwnProperty(aF)) {
                this._imageData[aE] = JSON.parse(af.sessionStorage.getItem(aF));
                return true
            }
            return false
        },
        composeImage: function aA(aQ, aM) {
            var aD, aE, aL = X.ns("weapons").getSlotPositions(this),
                aK = [],
                aJ = [0, 0],
                aP = aL.muzzle.box.slice(0),
                aO = aL.scope.box.slice(0),
                aG = O.imageSize[aQ].width,
                aN = O.imageSize[aQ].height,
                aI = S.bind(function aI(aT, aR) {
                    if (aT) {
                        X.warn(aT);
                        return this.composeImage(aQ, aM)
                    }
                    var aU = an + this.id + ":" + aQ;
                    aD.image = aR.toDataURL();
                    if (aQ === "med") {
                        X.imageCompose.silhouette(aR, 25, function aS(aV) {
                            aD.silhouette = aV.toDataURL();
                            if (ay) {
                                af.sessionStorage.setItem(aU, JSON.stringify(aD))
                            }
                            aM(aD.image, aD.silhouette)
                        })
                    } else {
                        aD.silhouette = "";
                        if (ay) {
                            af.sessionStorage.setItem(aU, JSON.stringify(aD))
                        }
                        aM(aD.image, aD.silhouette)
                    }
                }, this),
                aH;
            if (aQ === "min" && this.get("validationGroup") === "primary" && this.get("category") !== "shotgun") {
                aG = 90;
                aN = 40
            }
            if (aD) {
                at.setTimeout(S.bind(function aF() {
                    aM(aD.image, aD.silhouette)
                }, this), 0);
                return this
            } else {
                if (this.hasComposedImage(aQ)) {
                    at.setTimeout(S.bind(function aF() {
                        aM(this._imageData[aQ].image, this._imageData[aQ].silhouette)
                    }, this), 0);
                    return this
                }
            }
            this._imageData[aQ] = aD = {};
            if (this.isCustomizable()) {
                aE = this.collection.getModelAttachedItems(this);
                if (aQ !== "max") {
                    aP[0] = aP[0] / 3.2;
                    aP[1] = aP[1] / 3.2;
                    aO[0] = aO[0] / 3.2;
                    aO[1] = aO[1] / 3.2
                }
                if (aQ === "min") {
                    aP[0] = aP[0] / 3.2;
                    aP[1] = aP[1] / 3.2;
                    aO[0] = aO[0] / 3.2;
                    aO[1] = aO[1] / 3.2
                }
                if (aE.muzzle) {
                    aP.unshift(aE.muzzle.getAttachmentImage(aQ));
                    aK.push(aP)
                }
                if (aE.scope) {
                    aO.unshift(aE.scope.getAttachmentImage(aQ));
                    aK.push(aO)
                }
                if (aE.texture) {
                    aJ.unshift(aE.texture.getAttachmentImage(aQ));
                    aK.push(aJ)
                }
            } else {
                aK.push([this.getImage(aQ), 0, 0])
            }
            aH = S.after(aK.length, function() {
                X.imageCompose(aK, aG, aN, aI)
            });
            S.forEach(aK, function(aR) {
                X.preload.image(aR[0], S.bind(function(aT, aU) {
                    if (aT) {
                        var aS = this.collection.get(aU.match(/[0-9]+/g).pop());
                        if (aS) {
                            if (aS.isItemType("attachment")) {
                                aR[0] = aU = O.imageFolder + "attachment-icons/" + aQ + "/" + aS.get("category") + ".png";
                                aS.setAttachmentImage(aQ, aU)
                            } else {
                                aR[0] = aU = O.imageFolder + "attachment-icons/" + aQ + "/weapon_texture.png"
                            }
                        }
                    }
                    aH()
                }, this), 15000)
            }, this);
            return this
        },
        isItemType: function a(aD) {
            this.constructor.validateType(aD);
            return (this.get("itemType") === aD)
        },
        isType: function v(aD) {
            return this.isItemType(ax[aD] || aD)
        },
        isOwned: function z() {
            return !!this.get("owned")
        },
        isEquipped: function P() {
            return S.isNumber(this.get("equippedSlot"))
        },
        isEquippable: function G() {
            return S.indexOf(["weapon", "appearance"], this.get("itemType")) !== -1
        },
        isBoostable: function ae() {
            return false
        },
        isTrainable: function Y() {
            return false
        },
        isConsumable: function o() {
            return this.isBuyable() && this.get("type") === "gadgets"
        },
        isBuyable: function ag() {
            return !!this.get("buyable")
        },
        isRented: function n() {
            return !!(this.get("owned") && this.get("expiredate"))
        },
        isDefault: function az() {
            return !!this.get("isDefault")
        },
        isCustomizable: function aj() {
            return this.has("attachments") || this.get("maxNumPockets") > 0
        },
        isCustomized: function ah() {
            if (this.isCustomizable()) {
                if (this.isItemType("weapon")) {
                    return S.filter(this.collection.getModelAttachedItems(this, true), function(aD) {
                        return !aD.isDefault()
                    }).length !== 0
                } else {
                    if (this.has("upgrades")) {
                        return S.filter(this.get("upgrades") || [], function(aD) {
                            return !!aD
                        }).length !== 0
                    }
                }
            }
            return false
        },
        isLocked: function T(aE) {
            if (this.isItemType("pocket") && this.has("unlockLevels")) {
                var aD = this.get("unlockLevels")[aE] || 9999;
                return (aD > this.get("personaLevel"))
            }
            return !!this.get("isLocked")
        },
        isValid: function aC() {
            if (this.isExpired()) {
                return false
            }
            if (this.isCustomizable()) {
                return false
            }
            return true
        },
        isExpired: function w() {
            return !!this.get("expired")
        },
        isPromoted: function R() {
            return !!this.get("promotionType")
        },
        hasExpired: function j() {
            return this.isExpired()
        },
        isOwnedPermanent: function x() {
            return !!this.get("ownedPermanent")
        },
        getAttachments: function f() {
            var aD = S.clone(this.get("attachments") || {});
            S.forEach(aD, function(aE, aF) {
                aD[aF] = this.collection.get(aE)
            }, this);
            return aD
        },
        getUpgrades: function Z() {
            var aD = S.clone(this.get("upgrades") || {});
            S.forEach(aD, function(aE, aF) {
                aD[aF] = this.collection.get(aE)
            }, this);
            return aD
        },
        getCustomizations: function au() {
            if (this.has("attachments")) {
                return this.getAttachments()
            } else {
                if (this.has("upgrades")) {
                    return this.getUpgrades()
                }
            }
            return {}
        },
        hasInvalidAttachments: function s() {
            return S.some(this.get("attachments") || [], function(aE, aF) {
                var aD = this.collection.get(aE);
                if (aD) {
                    return !aD.get("owned")
                }
                return false
            }, this)
        },
        hasInvalidUpgrades: function s() {
            return S.some(this.get("upgrades") || [], function(aE) {
                var aD = this.collection.get(aE);
                if (aD) {
                    return !aD.get("owned")
                }
                return false
            }, this)
        },
        hasInvalidCustomizations: function h() {
            if (this.has("attachments")) {
                return this.hasInvalidAttachments()
            } else {
                if (this.has("upgrades")) {
                    return this.hasInvalidUpgrades()
                }
            }
            return false
        },
        hasStats: function p() {
            return !S.isEmpty(this.get("stats"))
        },
        getStats: function d() {
            return this.get("stats") || {}
        },
        getCustomStats: function ar() {
            return this.collection.getModelStats(this)
        },
        getDependencies: function() {
            var aD = {};
            if (this.has("dependency")) {
                aD.ability = N.collection.get(this.get("dependency"))
            }
            if (this.has("correspondingGearId")) {
                aD.gear = this.collection.get(this.get("correspondingGearId"))
            }
            return aD
        },
        hasInvalidDependencies: function() {
            return !!(this.get("invalidDependency") || this.get("invalidCorrespondingGearId"))
        },
        hasAttachments: function B() {
            return this.isItemType("weapon") && this.isCustomizable()
        },
        hasUpgrades: function K() {
            return this.isItemType("appearance") && this.isCustomizable()
        },
        hasCustomizations: function h() {
            if (this.isItemType("weapon")) {
                return this.hasAttachments()
            } else {
                if (this.isItemType("appearance")) {
                    return this.hasUpgrades()
                }
            }
            return false
        },
        resetAttachments: function q() {
            var aD = S.clone(this.get("attachments"));
            S.forEach(aD, function aE(aG, aF) {
                aD[aF] = null
            });
            this.set({
                attachments: aD
            });
            return this
        },
        resetUpgrades: function Q() {
            var aE = S.clone(this.get("upgrades"));
            S.forEach(aE, function aD(aG, aF) {
                aE[aF] = null
            });
            this.set({
                upgrades: aE
            });
            return this
        },
        resetCustomizations: function h() {
            if (this.has("attachments")) {
                return this.resetAttachments()
            } else {
                if (this.has("upgrades")) {
                    return this.resetUpgrades()
                }
            }
            return this
        },
        isAllowedInGame: function aq() {
            if (this.isExpired()) {
                return false
            }
            if (!this.isOwned()) {
                return false
            }
            if (this.hasInvalidDependencies()) {
                return false
            }
            if (this.hasInvalidCustomizations()) {
                return false
            }
            if (this.isConsumable() && !this.get("usecount")) {
                return false
            }
            return true
        },
        sync: function av(aI, aG, aF) {
            var aH = aF.success,
                aD;
            if (aI === "read") {
                if (aG.isType("bundle")) {
                    aD = aG.collection.getBundledItems(aG);
                    aH = S.after(aD.length + 1, aH);
                    if (aF.error) {
                        aF.error = S.once(aF.error)
                    }
                    aD.forEach(function(aJ) {
                        aJ.fetch({
                            success: aH,
                            error: aF.error
                        })
                    })
                }
                aF.success = function aE(aO, aL, aQ) {
                    var aK = X.Model.Item.backend[aG.get("itemType")],
                        aM, aP, aJ, aN;
                    if (aO && aO.status === "success" && aO.data.item) {
                        aH(aO.data.item, aL, aQ)
                    } else {
                        aF.error(aG, aO, aF, 1)
                    }
                }
            }
            return X.Backbone.sync.call(this, aI, aG, aF)
        },
        toJSON: function() {
            var aD = W.toJSON.apply(this, arguments);
            delete aD.prices;
            return aD
        }
    }, {
        validateType: function e(aD) {
            if (S.indexOf(b, aD) === -1) {
                throw new Error('Invalid item type "' + aD + '"')
            }
        },
        getAttachmentCategoryMap: function k(aE) {
            var aD = {
                "1": "MUZZLE",
                "2": "SCOPE",
                "3": "BARREL",
                "4": "AMMO",
                "5": "STOCK",
                "6": "TEXTURE"
            };
            if (aD.hasOwnProperty(aE)) {
                return aD[aE]
            }
            throw new Error('Unable to get attachment category name for slot "' + aE + '"')
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = X.Model.Item
    }
}(this));
(function(s) {
    if (typeof require !== "undefined") {
        if (!s.APP) {
            s.APP = require("./../common/app")
        }
        if (!s.APP.Collection) {
            s.APP.Collection = require("./../common/collection")
        }
        if (!s.APP.Model.Item) {
            s.APP.Model.Item = require("./model.item")
        }
    }
    var v = s.APP,
        N = v._,
        B = v.$,
        r = {
            weapon: 10,
            appearance: 5
        },
        h = v.Collection.prototype;
    v.Collection.Items = v.Collection.extend({
        _selected: {},
        model: v.Model.Item,
        itemType: null,
        initialize: function i(P, O) {
            O = O || {};
            if (O.type) {
                this.model.validateType(O.type);
                this.type = O.type
            }
        },
        reset: function d(Q, O) {
            O = O || {};
            if (!O.silent) {
                this.trigger("reset:before", this)
            }
            var P = h.reset.call(this, Q, O);
            if (!O.silent) {
                this.trigger("reset:after", this)
            }
            return P
        },
        comparator: function n(Q) {
            if (Q.hasOwnProperty("sortWeight")) {
                return Q.sortWeight
            }
            var P = 10000,
                O = ["primary", "secondary", "gadget", "melee", "head", "face", "uniform", "accessory1", "accessory2"].reverse(),
                T = Q.get("validationGroup"),
                R = N.indexOf(O, T),
                S = Q.get("offers").getLowestOffers();
            if (Q.isLocked() && !Q.isRented()) {
                P += 1000;
                P -= (100 * Q.get("lockProgress"))
            } else {
                if (Q.isCustomizable()) {
                    P -= 1000
                }
                if (R !== -1) {
                    P -= (R * 100)
                }
                if (S && S.funds) {
                    P -= S.funds.get("price") / 10
                }
            }
            return (Q.sortWeight = P)
        },
        types: function J() {
            return N.unique(this.pluck("itemType"))
        },
        by: function G(Q, R) {
            var P = this.filter(function O(T) {
                    return (T.get(Q) === R)
                }),
                S = new v.Collection.Items(P);
            return S
        },
        byType: function A(P) {
            P = P || this.itemType;
            this.model.validateType(P);
            var O = this.by("itemType", P);
            O.itemType = P;
            return O
        },
        hasItemType: function(O) {
            return this.some(function(P) {
                return P.isItemType(O)
            })
        },
        byBundle: function z(O) {
            O = this.get(O);
            var S = O.id,
                P = this.filter(function Q(T) {
                    return (N.indexOf(T.get("bundles"), S) !== -1)
                }),
                R = new this.constructor(P);
            return R
        },
        getBundled: function p() {
            var O = [];
            this.pluck("items").forEach(function P(R) {
                var U, S, Q = (R || []).length,
                    T;
                for (T = 0; T < Q; T += 1) {
                    U = R[T];
                    S = this.get(U.id);
                    if (S && N.indexOf(O, U.id) === -1) {
                        O.push(this.get(U.id))
                    }
                }
            }, this);
            return new this.constructor(O)
        },
        getBundledItems: function x(P) {
            P = this.get(P);
            if (!(P instanceof v.Model.Item)) {
                throw new Error('Invalid Model "' + P + '"')
            }
            var O = N.map(P.get("items") || [], function Q(R) {
                return this.get(R.id)
            }, this);
            return new this.constructor(O)
        },
        getBundles: function j(O) {
            return this.filter(function(T) {
                var Q = T.get("items") || [],
                    S, P, R;
                for (R = 0, P = Q.length; R < P; R += 1) {
                    S = Q[R];
                    if (S.id === O.id) {
                        return true
                    }
                }
            })
        },
        inBundle: function K(O) {
            return (this.getBundles(O).length !== 0)
        },
        getSelected: function m(P) {
            P = P || this.itemType;
            this.model.validateType(P);
            var O;
            if (!(this._selected[P] instanceof v.Model.Item)) {
                O = this.byType(P).at(0);
                if (!O) {
                    throw new Error('No model of item type "' + P + '" exists!')
                }
                this.setSelected(P, O, {
                    silent: true
                }).getSelected(P)
            }
            return this._selected[P]
        },
        setSelected: function D(R, Q, P) {
            R = R || this.itemType;
            this.model.validateType(R);
            P = P || {};
            var O, S = this._selected[R];
            if (Q instanceof v.Model.Item) {
                O = Q
            } else {
                if (!((O = this.get(Q)) instanceof v.Model.Item)) {
                    O = this.getSelected(R)
                }
            }
            if (O.get("itemType") !== R) {
                O = this.getSelected(R)
            }
            if (!S || S.id !== O.id || P.force) {
                this._selected[R] = O;
                if (!P.silent) {
                    this.trigger("select:" + R, O);
                    this.trigger("select", O)
                }
            }
            return this
        },
        getStore: function M(R) {
            R = R || this.itemType;
            this.model.validateType(R);
            var O = this.filter(function P(S) {
                    return (S.get("itemType") === R && S.isBuyable())
                }),
                Q = new this.constructor(O, {
                    itemType: R
                });
            return Q
        },
        getEquipped: function F(P) {
            P = P || this.itemType;
            this.model.validateType(P);
            var Q = [],
                O;
            N.times(r[P] || 0, function(S) {
                var R = this.bySlot(P, S);
                if (R) {
                    Q.push(R)
                }
            }, this);
            O = new this.constructor(Q, {
                itemType: P
            });
            return O
        },
        bySlot: function y(Q, R, P) {
            Q = Q || this.itemType;
            this.model.validateType(Q);
            return this.find(function O(S) {
                return (S.get("itemType") === Q && S.get("equippedSlot") === R)
            })
        },
        getDefaults: function u(P) {
            var O = {};
            this.filter(function(Q) {
                if (Q.isItemType(P) && Q.isDefault()) {
                    O[Q.get("category")] = Q
                }
            });
            return O
        },
        getOwned: function C(S) {
            S = S || this.itemType;
            var O = this,
                P, R;
            if (S) {
                O = this.byType(S)
            }
            P = O.filter(function Q(T) {
                return T.get("owned")
            });
            R = new this.constructor(P, {
                itemType: S
            });
            return R
        },
        getModelAttachments: function e(P) {
            P = this.get(P);
            if (!(P instanceof v.Model.Item)) {
                throw new Error('Invalid Model "' + P + '"')
            }
            var R = P.id,
                O = this.filter(function(S) {
                    return (S.get("itemType") === "attachment" && N.indexOf(S.get("parentItems"), R) !== -1)
                }),
                Q = new this.constructor(O);
            return Q
        },
        getModelCustomizableSlots: function E(O) {
            O = this.get(O);
            if (!(O instanceof v.Model.Item)) {
                throw new Error('Invalid Model "' + O + '"')
            }
            var Q = O.id,
                P = [];
            this.forEach(function(S) {
                var R = S.get("parentItems"),
                    T = S.get("fitsSlot");
                if (S.isItemType("attachment") && N.indexOf(R, Q) !== -1 && N.indexOf(P, T) === -1 && !S.isDefault()) {
                    P.push(T)
                }
            });
            return P.sort()
        },
        getModelAttachedItems: function q(Q, T) {
            Q = this.get(Q);
            if (!(Q instanceof v.Model.Item)) {
                throw new Error('Invalid Model "' + Q + '"')
            }
            var S = Q.get("attachments"),
                O = this.getModelAttachments(Q),
                U = Q.isRented(),
                R = Q.isExpired(),
                P = {};
            N.forEach(S, function(X, Y) {
                var W = this.model.getAttachmentCategoryMap(Y).toLowerCase(),
                    V = this.get(X);
                if (!V || (R && !V.isDefault()) || (U && !V.isOwned())) {
                    V = O.filterBy({
                        fitsSlot: parseInt(Y, 10),
                        isDefault: true
                    }).at(0)
                }
                if (V || !T) {
                    P[W] = V
                }
            }, this);
            return P
        },
        getAttachedItems: function w() {
            v.warn("Use APP.Collection.Items::getModelAttachedItems instead of APP.Collection.Items::getAttachedItems");
            return this.getModelAttachedItems.apply(this, arguments)
        },
        validateModelAttachments: function k(P) {
            P = this.get(P);
            if (!(P instanceof v.Model.Item)) {
                throw new Error('Invalid Model "' + P + '"')
            }
            var R = P.get("attachments"),
                Q, S, O;
            for (Q in R) {
                if (R.hasOwnProperty(Q)) {
                    S = R[Q];
                    O = this.get(S);
                    if (S && O && !O.get("owned")) {
                        return false
                    }
                }
            }
            return true
        },
        hasAttachments: function b() {
            var O = this.filter(function(Q) {
                    return N.values(Q.get("attachments") || {}).length !== 0
                }),
                P = new this.constructor(O);
            return P
        },
        getModelAttachedStats: function L(P) {
            P = this.get(P);
            if (!(P instanceof v.Model.Item)) {
                throw new Error('Invalid Model "' + P + '"')
            }
            var Q = this.getModelAttachments(P, true),
                O = {};
            N.forEach(Q, function(R) {
                if (R) {
                    var S = R.getStats();
                    N.forEach(S, function(U, T) {
                        if (!O.hasOwnProperty(T)) {
                            O[T] = []
                        }
                        O[T].push(U)
                    })
                }
            }, this);
            return O
        },
        getAttachedStats: function a() {
            v.warn("Use APP.Collection.Items::getModelAttachedStats instead of APP.Collection.Items::getAttachedStats");
            return this.getModelAttachedStats.apply(this, arguments)
        },
        getModelUpgrades: function H(O) {
            O = this.get(O);
            if (!(O instanceof v.Model.Item)) {
                throw new Error('Invalid Model "' + O + '"')
            }
            var P = this.filterBy({
                itemType: "upgrade",
                category: O.get("category")
            });
            return P
        },
        getModelUpgradeItems: function l(O, Q) {
            O = this.get(O);
            if (!(O instanceof v.Model.Item)) {
                throw new Error('Invalid Model "' + O + '"')
            }
            var R = O.get("upgrades") || {},
                P = {};
            N.forEach(R, function(U, T) {
                var S = this.get(U);
                if (S || !Q) {
                    P[T] = this.get(U)
                }
            }, this);
            return P
        },
        getModelUpgradesStats: function f(O) {
            O = this.get(O);
            if (!(O instanceof v.Model.Item)) {
                throw new Error('Invalid Model "' + O + '"')
            }
            var P = this.getModelUpgradeItems(O, true),
                Q = {};
            N.forEach(P, function(R) {
                if (R) {
                    var S = R.getStats();
                    N.forEach(S, function(U, T) {
                        if (!Q.hasOwnProperty(T)) {
                            Q[T] = []
                        }
                        Q[T].push(U)
                    })
                }
            }, this);
            return Q
        },
        getModelStats: function c(P) {
            P = this.get(P);
            if (!(P instanceof v.Model.Item)) {
                throw new Error('Invalid Model "' + P + '"')
            }
            var O = P.getStats(),
                R = ["damage", "accuracy", "range"],
                Q = {};
            if (O.hasOwnProperty("damage")) {
                Q.damage = {
                    base: v.sidis.trans("WEB_GAME_STAT_DAMAGE_LEVEL_" + O.damage)
                }
            }
            if (O.hasOwnProperty("accuracy")) {
                Q.accuracy = {
                    base: v.sidis.trans("WEB_GAME_STAT_ACCURACY_LEVEL_" + O.accuracy)
                }
            }
            if (O.hasOwnProperty("ammo") || O.hasOwnProperty("mags")) {
                Q.ammo = {
                    base: []
                };
                if (O.hasOwnProperty("ammo")) {
                    Q.ammo.base.push(O.ammo)
                }
                if (O.hasOwnProperty("mags")) {
                    Q.ammo.base.push(O.mags)
                }
                Q.ammo.base = Q.ammo.base.join("/")
            }
            if (O.hasOwnProperty("range")) {
                Q.range = {
                    base: v.sidis.trans("WEB_GAME_STAT_ACCURACY_LEVEL_" + O.range)
                }
            }
            if (O.hasOwnProperty("rof") || O.hasOwnProperty("action")) {
                Q.rof = {
                    base: []
                };
                if (O.hasOwnProperty("rof")) {
                    Q.rof.base.push(v.sidis.trans("WEB_GAME_STAT_ROF_LEVEL_" + O.rof))
                }
                if (O.hasOwnProperty("action")) {
                    Q.rof.base.push(v.sidis.trans("WEB_GAME_STAT_ACTION_LEVEL_" + O.action))
                }
                Q.rof.base = Q.rof.base.join(" ")
            }
            if (O.hasOwnProperty("zoom")) {
                Q.zoom = {
                    base: v.sidis.trans("WEB_GAME_STAT_ZOOM_LEVEL_" + O.zoom)
                }
            }
            if (P.hasAttachments()) {
                N.forEach(this.getModelAttachedItems(P, true), function(T, U) {
                    var S = T ? T.getStats() : [];
                    N.forEach(S, function(X, V) {
                        var W, Y;
                        if (N.indexOf(R, V) !== -1) {
                            W = V;
                            Y = X
                        } else {
                            if (V === "ammo") {
                                W = "ammo";
                                Y = v.sidis.transChoice("WEB_GAME_STAT_AMMO_MODS", X, {
                                    "%count%": X
                                })
                            } else {
                                if (V === "mags") {
                                    W = "ammo";
                                    Y = v.sidis.transChoice("WEB_GAME_STAT_MAGS_MODS", X, {
                                        "%count%": X
                                    })
                                } else {
                                    if (V === "rof") {
                                        W = "rof";
                                        Y = v.sidis.trans("WEB_GAME_STAT_ROF_LEVEL_" + X)
                                    } else {
                                        if (V === "action") {
                                            W = "rof";
                                            Y = v.sidis.trans("WEB_GAME_STAT_ACTION_LEVEL_" + X)
                                        } else {
                                            if (V === "zoom") {
                                                W = "zoom";
                                                Y = v.sidis.trans("WEB_GAME_STAT_ZOOM_LEVEL_" + X);
                                                Q[W] = {
                                                    base: Y
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (W && Y && !T.isDefault()) {
                            if (!Q.hasOwnProperty(W)) {
                                Q[W] = {
                                    mods: []
                                }
                            } else {
                                if (!Q[W].hasOwnProperty("mods")) {
                                    Q[W].mods = []
                                }
                            }
                            Q[W].mods.push(Y)
                        }
                    })
                })
            }
            return Q
        },
        getStats: function I() {
            v.warn("Use APP.Collection.Items::getModelStats instead of APP.Collection.Items::getStats");
            return this.getModelStats.apply(this, arguments)
        },
        getLoadout: function o(T) {
            T = T || this.itemType;
            var S = [],
                Q, R;
            if (T === "attachment") {
                S = {};
                this.getEquipped("weapon").forEach(function O(U) {
                    if (U.isCustomizable()) {
                        S[U.id] = U.get("attachments")
                    }
                }, this);
                return S
            } else {
                if (T === "upgrade") {
                    S = {};
                    this.getEquipped("appearance").forEach(function P(U) {
                        if (U.isCustomizable()) {
                            S[U.id] = U.get("upgrades")
                        }
                    }, this);
                    return S
                } else {
                    if (T === "weapon") {
                        for (R = 0; R < 10; R += 1) {
                            Q = this.bySlot(T, R);
                            S.push(Q ? Q.id : 0)
                        }
                        return S
                    } else {
                        if (T === "appearance") {
                            for (R = 0; R < 5; R += 1) {
                                Q = this.bySlot(T, R);
                                S.push(Q ? Q.id : 0)
                            }
                            return S
                        } else {
                            if (T === "booster") {
                                return this.filter(function(U) {
                                    return U.isItemType("booster") && U.isOwned()
                                })
                            }
                        }
                    }
                }
            }
            return []
        },
        getEquippedCustomizations: function(O) {
            var P = N.unique(N.compact(N.flatten(this.filterBy({
                isEquipped: true,
                hasCustomizations: true
            }).map(function(Q) {
                return N.values(Q.getCustomizations())
            }))));
            return new this.constructor(P, O)
        },
        validateLoadout: function g() {
            var S = this,
                W = new this.constructor(this.filter(function U(Y) {
                    return Y.isEquipped() && Y.get("itemType") !== "booster"
                })),
                O = 7000,
                X = this.get(O),
                T = 1,
                P;
            if (X && X.get("owned")) {
                T = 2
            }
            if (W.some(function Q(Y) {
                    if (!Y.get("owned")) {
                        return true
                    }
                    if (Y.hasInvalidCustomizations()) {
                        return true
                    }
                    return false
                })) {
                P = new Error("Unbought items");
                P.name = "UnboughtError";
                return P
            }
            if (W.some(function V(Y) {
                    if (Y.get("expired")) {
                        return true
                    }
                    if (Y.isCustomizable() && N.some(Y.get("attachments"), function Z(ab) {
                            var aa = S.get(ab);
                            return (aa && aa.get("expired"))
                        })) {
                        return true
                    }
                    return false
                })) {
                P = new Error("Expired items");
                P.name = "ExpiredError";
                return P
            }
            if (W.some(function R(Y) {
                    return (Y.isConsumable() && !Y.get("usecount"))
                })) {
                P = new Error("Empty usecount");
                P.name = "UsecountError";
                return P
            }
            if (W.by("validationGroup", "primary").length === 0) {
                P = new Error("WEB_GAME_DOCK_ERROR_5017");
                P.name = "PrimaryError";
                return P
            } else {
                if (W.by("validationGroup", "primary").length > T) {
                    P = new Error("WEB_GAME_DOCK_ERROR_5018");
                    P.name = "PrimaryError";
                    return P
                }
            }
            return true
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = v.Collection.Items
    }
}(this));
(function(j) {
    var k = j.APP,
        f = k.win,
        d = k.$,
        l = k._;
    k.View.Item = k.View.extend({
        name: "item-view",
        tagName: "div",
        options: {
            showName: true,
            showIcons: true,
            showAdditional: true,
            showLock: true,
            live: true
        },
        events: {
            "mouseenter a.buy": function(m) {
                this.sound("hover");
                this.trigger("buy:enter", this, this.model, m)
            },
            "mouseleave a.buy": function(m) {
                this.trigger("buy:leave", this, this.model, m)
            },
            "click a.buy, a.unlock": function(m) {
                m.preventDefault();
                m.stopImmediatePropagation();
                this.sound("click");
                this.trigger("buy", this, this.model, m)
            },
            click: function(m) {
                m.preventDefault();
                this.sound("click");
                this.trigger("click", this, this.model, m)
            },
            mouseenter: function(m) {
                this.sound("hover");
                this.trigger("enter", this, this.model, m)
            },
            mouseleave: function(m) {
                this.trigger("leave", this, this.model, m)
            }
        },
        initialize: function h() {
            l.bindAll(this);
            if (this.options.live) {
                this.model.bind("change", this._onChange, this)
            }
            this.$el.data("id", this.model.id);
            this.model.bind("heartbeat", this.render, this);
            this.model.bind("purchase:start", this._onPurchaseStart, this);
            this.model.bind("purchase:end", this._onPurchaseEnd, this)
        },
        destroy: function g() {
            this.model.unbind("change", this.render, this);
            this.model.unbind("purchase:start", this._onPurchaseStart, this);
            this.model.unbind("purchase:end", this._onPurchaseEnd, this);
            return this
        },
        _onChange: function a() {
            var m = ["expired", "owned", "buyable", "usecount"],
                n = l.some(m, function(o) {
                    return this.model.hasChanged(o)
                }, this);
            if (n) {
                this.render()
            }
        },
        _onPurchaseStart: function e() {
            this.$el.addClass("loading")
        },
        _onPurchaseEnd: function c() {
            this.$el.removeClass("loading")
        },
        dragHelper: function(n) {
            var m = d("<span />").attr({
                "class": "item item-drag game-item item-min item-min-" + this.model.id
            });
            return m
        },
        renderLock: function i() {
            var r = k.ns("config"),
                q = this.model.get("lockType"),
                s = this.model.get("lockCriteria"),
                o = this.make("div", {
                    "class": "lock " + q
                }),
                p = r.imageFolder + "game/item-lock-progress.png",
                n = this.model.get("lockProgress"),
                m = f.progressCircle(p, n, {
                    width: 32,
                    height: 32,
                    lineWidth: 5,
                    duration: 500
                });
            o.appendChild(this.make("span", {
                "class": "key"
            }, s));
            o.appendChild(m);
            this.el.appendChild(o);
            return this
        },
        render: function b() {
            this.$el.addClass("item tier" + (this.model.get("tier") || 0) + " " + this.model.get("validationGroup"));
            if (this.model.isItemType("appearance")) {
                this.el.appendChild(this.make("span", {
                    "class": "game-item item-min item-min-" + this.model.id,
                    "item-id": this.model.id
                }))
            } else {
                this.el.appendChild(this.make("img", {
                    src: this.model.getImage("min"),
                    width: 80,
                    height: 60,
                    "class": "game-item item-min item-min-" + this.model.id,
                    "item-id": this.model.id
                }))
            }
            if (this.options.showName) {
                this.el.appendChild(this.make("span", {
                    "class": "name"
                }, this.model.get("name")))
            }
            if (this.model.isLocked()) {
                if (!this.model.isOwned()) {
                    this.$el.addClass("locked")
                }
                if (this.options.showLock) {
                    this.renderLock();
                    this.$el.disableTextSelect()
                }
            }
            if (this.options.showIcons) {
                if (this.model.isRented()) {
                    this.$el.addClass("rented")
                } else {
                    if (this.model.isExpired()) {
                        this.$el.addClass("expired")
                    }
                }
                if (this.model.get("isnew")) {
                    this.$el.addClass("new");
                    this.$el.append('<span class="new_item_icon">' + k.sidis.trans("WEB_STORE_COMMON_NEW") + "</span>")
                }
                if (this.model.get("owned") && this.model.get("type") === "gadgets" && this.model.get("usecount") < 10) {
                    if (!this.model.get("usecount")) {
                        this.$el.addClass("no-usecount")
                    } else {
                        this.$el.addClass("low-usecount")
                    }
                }
                if (this.model.isLocked()) {
                    if (this.model.get("offers").hasUnlockOffers()) {
                        this.$el.append('<a href="#unlock" class="icon unlock" />')
                    } else {
                        this.$el.append('<a href="#lock" class="icon lock" />')
                    }
                } else {
                    if (this.model.isBuyable()) {
                        this.$el.addClass("buyable");
                        this.$el.append('<a href="#buy" class="icon buy"></a>')
                    }
                }
            }
            return this
        }
    })
}(this));
(function(f) {
    var c = f.APP,
        e = c.$,
        a = c._,
        g = c.namespace("config"),
        b = c.View.Tooltip.prototype;
    c.View.ItemErrorTooltip = c.View.Tooltip.extend({
        className: "item-error-tooltip",
        render: function d(h) {
            var i = [];
            this.$el.html(i.join(""))
        }
    })
}(this));
(function(d) {
    var r = d.APP,
        e = r.$,
        A = r._,
        C = r.doc,
        l = r.View.DnD.prototype,
        i = r.namespace("config"),
        p = "item-list-view-item";
    r.View.ItemList = r.View.DnD.extend({
        name: "item-list-view",
        tagName: "ul",
        options: A.extend({}, l.options, {
            selectedClassName: "showing",
            drag: "li.item-list-view-item:not(.locked)",
            viewClass: "Item"
        }),
        dragOptions: A.extend({}, l.dragOptions, {
            revert: "invalid"
        }),
        events: {},
        initialize: function f() {
            this.filterCollection();
            this.bind("drag:start", this._onDragStart, this);
            this.bind("drag:stop", this._onDragStop, this);
            this.bind("item:render", this._onItemRender, this);
            this.collection.bind("reset", this._onCollectionReset, this);
            this.collection.bind("add", this._onCollectionAdd, this);
            this.collection.bind("remove", this._onCollectionRemove, this);
            this.collection.bind("change", this._onCollectionChange, this)
        },
        destroy: function y() {
            this.collection.unbind("reset", this.onCollectionReset, this);
            this.collection.unbind("add", this.onCollectionAdd, this);
            this.collection.unbind("remove", this.onCollectionRemove, this);
            this.collection.unbind("change", this.onCollectionChange, this);
            return this
        },
        _onDragStart: function o(D, F, E) {
            if (F.helper.get(0).className !== "") {
                e(E).addClass("dragging");
                this.sound("equip")
            }
        },
        _onDragStop: function m(D, F, E) {
            e(E).removeClass("dragging").addClass("drag-delay").delay(200).removeClass("drag-delay");
            this.sound("unequip")
        },
        _onItemRender: function x(D) {
            if (D && D.model === this._selected) {
                D.$el.addClass(this.options.selectedClassName)
            }
        },
        _onCollectionReset: function u() {
            this.filterCollection();
            this.render()
        },
        _onCollectionAdd: function k(D) {
            if (this.collection.filterBy(this._currentFilter).indexOf(D) !== -1) {
                this.appendViewByModel(D).select()
            }
        },
        _onCollectionRemove: function v(D) {
            if (this._currentCollection.indexOf(D) !== -1) {
                this.removeViewByModel(D)
            }
        },
        _onCollectionChange: function q(D) {
            var G = this._currentCollection.indexOf(D),
                E = this.collection.filterBy(this._currentFilter).indexOf(D),
                F;
            if (G !== -1 && E === -1) {
                this.removeViewByModel(D)
            } else {
                if (G === -1 && E !== -1) {
                    this.appendViewByModel(D).select()
                }
            }
        },
        removeViewByModel: function c(F, E) {
            if (!this.$items) {
                return this
            }
            var G = this.$items.eq(this._currentCollection.indexOf(F)),
                D = this.getView(G);
            if (!D) {
                r.warn("Unable to get view for", G)
            }
            G.remove();
            this.$items = this.$items.not(G);
            this._currentCollection.remove(F);
            this.destroyView(D);
            if (!E || !E.silent) {
                this.trigger("remove", this, F)
            }
            return this
        },
        appendViewByModel: function j(E, D) {
            if (!this.$items) {
                return this
            }
            var F = this.renderItem(E);
            this.$items = this.$items.add(F);
            this.initializeDragAndDrop();
            this._currentCollection.add(E, {
                at: this._currentCollection.length
            });
            if (!D || !D.silent) {
                this.trigger("append", this, E)
            }
            return this
        },
        getModelFromDOM: function n(F) {
            var E = this.$(F),
                G = E.attr("item-id") || E.data("id"),
                D = this.collection.get(G);
            return D
        },
        getElementByModel: function B(G) {
            if (!this.$items) {
                return this
            }
            var E = this._currentCollection.get(G),
                D = this._currentCollection.indexOf(E),
                F;
            if (E && D !== -1) {
                F = this.$items.eq(D)
            }
            return F
        },
        filterCollection: function h(D) {
            this._currentFilter = A.extend({}, D || this._currentFilter || {}, this.options.filter || {});
            this._currentCollection = this.collection.filterBy(this._currentFilter);
            if (this.options.orderBy) {
                this._currentCollection = this._currentCollection.orderBy(this.options.orderBy)
            }
            if (this.options.orderDesc) {
                this._currentCollection.comparator = null;
                this._currentCollection.models.reverse()
            }
            return this
        },
        select: function s(E, D) {
            D = D || {};
            if (E) {
                this._selected = E
            }
            if (!this.$items) {
                return this
            }
            var F = this._currentCollection.indexOf(this._selected);
            this.$items.removeClass(this.options.selectedClassName);
            if (F !== -1) {
                this.$items.eq(F).addClass(this.options.selectedClassName);
                if (!D.silent) {
                    this.trigger("select", this._selected, this.$items.eq(F))
                }
            }
            return this
        },
        deselect: function b(D) {
            D = D || {};
            this.select(-1);
            if (!D.silent) {
                this.trigger("deselect")
            }
            return this
        },
        scrollTo: function w(G) {
            if (G instanceof r.Model) {
                G = this.getElementByModel(G)
            }
            var D = G.position().top,
                E = G.outerHeight(true),
                I = this.$el.position().top,
                F = this.$el.outerHeight(),
                H = D - I;
            if (H < 0) {
                this.$el.animate({
                    scrollTop: this.el.scrollTop - Math.abs(H) - 5
                }, 200, "easeOutCirc")
            } else {
                if (H > (F - E)) {
                    this.$el.animate({
                        scrollTop: this.el.scrollTop + E - (F - H)
                    }, 200, "easeOutCirc")
                }
            }
            return this
        },
        dragHelper: function a(F) {
            var D = this.getViewByElement(F.currentTarget),
                E;
            if (D && D.dragHelper) {
                E = D.dragHelper(F);
                E.data("id", D.model.id);
                E.appendTo(C.body)
            }
            return E
        },
        renderItem: function z(E) {
            var G = A.isString(this.options.viewClass) ? r.View[this.options.viewClass] : this.options.viewClass,
                D = A.extend({}, {
                    tagName: "li",
                    className: p,
                    container: this.el,
                    model: E
                }, this.options.viewOptions || {}),
                F = this.createView(G, D, "item");
            F.attach();
            F.render({
                silent: !this.$items
            });
            return F.el
        },
        render: function g() {
            this.$items = null;
            var D = this._currentCollection.map(this.renderItem, this);
            if (D.length === 0) {
                this.$el.addClass("empty");
                if (this.options.emptyMessage) {
                    this.$el.html(this.options.emptyMessage)
                }
            }
            this.$items = this.$(D);
            this.select(null, {
                silent: true
            });
            this.$("img").enableTextSelect()
        }
    }, {
        ITEM_CLASS_NAME: p
    })
}(this));
(function(f) {
    var i = f.APP,
        j = i._,
        a = ["DamageLvL", "AccuracyLvL", "RangeLvL", "Zoom"],
        d = ["ROFLvL", "ammo"],
        h = ["nrOfMAgs", "NrPrimaryWeapon", "NrHandGrenade", "NrClaymore", "MagIncrease", "MagSizeIncrease"],
        e = {
            DamageLvL: "DamageLvL",
            Damage: "DamageLvL",
            AccuracyLvL: "AccuracyLvL",
            Accuracy: "AccuracyLvL",
            AccControl: "AccuracyLvL",
            AccPrecision: "AccuracyLvL",
            AccVelocity: "AccuracyLvL",
            ammo: "ammo",
            nrOfMAgs: "ammo",
            MagIncrease: "ammo",
            MagSizeIncrease: "ammo",
            RangeLvL: "RangeLvL",
            Range: "RangeLvL",
            ROFLvL: "ROFLvL",
            Action: "ROFLvL",
            Zoom: "Zoom"
        };
    i.View.Stats = i.View.extend({
        name: "stats-view",
        initialize: function c() {
            this.model.bind("change", this.render, this)
        },
        destroy: function b() {
            this.model.unbind("change", this.render, this)
        },
        _renderStats: function k(o, s) {
            var u = this.make("div"),
                n = this.make("div", {
                    "class": "stat-title"
                }),
                q = this.make("div", {
                    "class": "label stat-" + s
                }, s),
                r = this.make("div", {
                    "class": "attachment-label"
                }, o.base),
                p = this.make("div", {
                    "class": "base"
                }),
                l = this.make("div", {
                    "class": "stat-details"
                }),
                m = (this.model.get("bestInClass") || []).indexOf(s) !== -1;
            if (m) {
                q.className += " bic";
                q.appendChild(this.make("span", {
                    "class": "best-in-class"
                }, this.trans("WEB_GAME_STAT_BEST_IN_CLASS")))
            }
            n.appendChild(q);
            u.appendChild(n);
            p.appendChild(r);
            l.appendChild(p);
            u.appendChild(l);
            if (o.hasOwnProperty("mods")) {
                n.className += " active";
                if (s !== "zoom" && o.mods.length !== 0) {
                    l.appendChild(this.make("div", {
                        "class": "mods"
                    }, j.map(o.mods, function(v) {
                        var w = "value";
                        if (v.value < 0) {
                            w += " negative"
                        }
                        return '<span class="' + w + '">' + v.text + "</span>"
                    }).join(" ")))
                }
            } else {
                r.className += " empty"
            }
            this.el.appendChild(u)
        },
        render: function g() {
            var n = this.model.getStats(),
                o = this.model.getCustomizations(),
                l = {},
                m = [];
            j.forEach(this.model.getCustomizations(), function(p) {
                j.forEach((p && p.getStats()) || {}, function(r, q) {
                    var s = e[q];
                    if (!j.has(l, s)) {
                        l[s] = []
                    }
                    r = j.clone(r);
                    r.type = q;
                    l[s].push(r)
                })
            });
            if (this.model.isItemType("weapon")) {
                if (n.ROFLvL && n.Action) {
                    n.ROFLvL = {
                        value: [this.trans("WEB_GAME_STAT_ROFLVL_" + n.ROFLvL.value), this.trans("WEB_GAME_STAT_ACTION_" + n.Action.value)].join(" ")
                    };
                    delete n.Action
                }
                if (n.ammo && n.nrOfMAgs) {
                    n.ammo = {
                        value: n.ammo.value + "/" + n.nrOfMAgs.value
                    };
                    delete n.nrOfMAgs
                }
            }
            m = j.map(n, function(u, r) {
                var w = e[r],
                    x = l[w] || {},
                    s = !j.isEmpty(x),
                    p = this.trans("WEB_GAME_STAT_LABEL_" + r.toUpperCase()),
                    v = u.value,
                    q = "";
                if (j.indexOf(a, r) !== -1) {
                    v = this.trans("WEB_GAME_STAT_" + r.toUpperCase() + "_" + v)
                }
                q += '<div class="stat-title' + (s ? " active" : "") + '">';
                q += '<div class="label stats stat-' + r + '">' + p + "</div>";
                q += "</div>";
                q += '<div class="stat-details">';
                q += '<div class="base"><div class="attachment-label">' + v + "</div></div>";
                if (s) {
                    q += '<div class="mods">';
                    q += j.map(x, function(z) {
                        var A = z.value,
                            y;
                        if (j.indexOf(h, z.type) !== -1) {
                            y = this.transChoice("WEB_GAME_STAT_LABEL_" + z.type.toUpperCase(), A)
                        } else {
                            y = this.trans("WEB_GAME_STAT_LABEL_" + z.type.toUpperCase())
                        }
                        if (A > 0) {
                            A = "+" + A
                        }
                        if (z.isPercent) {
                            A += "%"
                        }
                        return '<span class="value' + (z.isPenalty ? " penalty" : "") + '">' + y + " " + A + "</span>"
                    }, this).join("");
                    q += "</div>"
                }
                q += "</div>";
                return "<div>" + q + "</div>"
            }, this).join("");
            this.el.innerHTML = m
        }
    })
}(this));
(function(f) {
    var g = f.APP,
        i = g._,
        e = ["DamageLvL", "AccuracyLvL", "RangeLvL", "Zoom"],
        c = ["ROFLvL", "ammo"],
        d = ["nrOfMAgs", "MagIncrease", "MagSizeIncrease"];
    g.View.StatsList = g.View.extend({
        name: "stats-list-view",
        tagName: "ul",
        initialize: function b() {},
        destroy: function h() {},
        render: function a() {
            if (this.model.hasStats()) {
                var l = i.clone(this.model.get("stats") || {}),
                    j = this.model.isItemType("weapon"),
                    k;
                if (j) {
                    l.ROFLvL = {
                        value: [this.trans("WEB_GAME_STAT_ROFLVL_" + l.ROFLvL.value), this.trans("WEB_GAME_STAT_ACTION_" + l.Action.value)].join(" ")
                    };
                    delete l.Action;
                    l.ammo = {
                        value: l.ammo.value + "/" + l.nrOfMAgs.value
                    };
                    delete l.nrOfMAgs
                }
                k = i.map(l, function(q, o) {
                    var r = q.value,
                        m, p = "stats stat-" + o,
                        n;
                    if (i.indexOf(d, o) !== -1) {
                        m = this.transChoice("WEB_GAME_STAT_LABEL_" + o.toUpperCase(), r)
                    } else {
                        m = this.trans("WEB_GAME_STAT_LABEL_" + o.toUpperCase())
                    }
                    if (i.indexOf(e, o) !== -1) {
                        m = this.trans("WEB_GAME_STAT_" + o.toUpperCase() + "_" + r);
                        r = null
                    } else {
                        if (i.indexOf(c, o) !== -1) {
                            m = r;
                            r = null
                        } else {
                            if (!j && r > 0) {
                                r = "+" + r
                            }
                        }
                    }
                    if (q.isPercent) {
                        r += "%"
                    }
                    if (q.isPenalty) {
                        p += " penalty"
                    }
                    if (q.bestInClass) {
                        p += " best-in-class"
                    }
                    n = '<li class="' + p + '">';
                    if (m) {
                        n += m
                    }
                    if (r) {
                        n += '<span class="value">' + r + "</span>"
                    }
                    n += "</li>";
                    return n
                }, this).join("");
                this.el.innerHTML = k
            }
        }
    })
}(this));
(function(c) {
    var f = c.APP,
        b = f.$,
        h = f._,
        i = f.namespace("config"),
        g = f.View.Tooltip.prototype;
    f.View.StatsTooltip = f.View.Tooltip.extend({
        className: "stats-tooltip",
        renderModelAndShow: function a(j, k) {
            return this.renderModel(j).show(k)
        },
        renderModel: function d(j) {
            this.model = j;
            return this.render()
        },
        render: function e() {
            this.createView(f.View.Stats, {
                model: this.model
            }).render().attach()
        }
    })
}(this));
(function(d) {
    var f = d.APP,
        b = f.$,
        h = f._,
        i = f.namespace("config"),
        g = f.View.Tooltip.prototype;
    f.View.ItemTooltip = f.View.Tooltip.extend({
        className: "item-tooltip",
        renderModelAndShow: function a(k, l, j) {
            return this.renderModel(k, j).show(l)
        },
        renderModel: function e(k, j) {
            this.model = k;
            return this.render(j)
        },
        render: function c(l) {
            l = h.defaults(l || {}, {
                name: false,
                description: false,
                dependencies: false,
                stats: false,
                slots: false,
                offers: false,
                uses: false,
                time: false,
                invalid: false
            });
            var m = [],
                k, q, o, p, j, n;
            if (l.name) {
                m.push("<h1>");
                m.push(this.model.get("name"));
                q = this.model.get("categoryname");
                if (q) {
                    m.push("<span>" + q + "</span>")
                }
                m.push("</h1>")
            }
            if (l.description) {
                o = this.model.get("description");
                if (o) {
                    m.push('<p class="description">' + this.model.get("description") + "</p>")
                }
            }
            if (l.stats) {
                m.push(this.createView(f.View.StatsList, {
                    model: this.model
                }).render().el.outerHTML)
            }
            if (l.dependencies) {
                p = this.model.getDependencies();
                if (p.gear && p.gear.isOwned()) {
                    m.push('<div class="dependency booster">');
                    m.push("<h3>" + this.trans("Booster interference") + "</h3>");
                    m.push(p.gear.get("name"));
                    m.push("<span>" + p.gear.get("expiredate") + "</span>");
                    m.push("</div>")
                } else {
                    if (p.ability && p.ability.get("level") === 0) {
                        m.push('<div class="dependency ability">');
                        m.push("<h3>" + this.trans("Training requirement") + "</h3>");
                        m.push(p.ability.get("name"));
                        m.push("</div>")
                    }
                }
            }
            if (l.slots && this.model.isCustomizable()) {
                if (this.model.isItemType("weapon")) {
                    m.push(this.createView(f.View.WeaponSlots, {
                        model: this.model
                    }).render().el.outerHTML)
                } else {
                    if (this.model.isItemType("appearance")) {
                        m.push(this.createView(f.View.AppearanceSlots, {
                            model: this.model
                        }).render().el.outerHTML)
                    }
                }
            }
            if (l.time) {
                if (this.model.isRented()) {
                    m.push('<p class="rented">' + this.model.get("expiredate") + "</p>")
                } else {
                    if (this.model.isExpired()) {
                        m.push('<p class="expired">' + this.model.get("expiredate") + "</p>")
                    }
                }
            }
            if (l.invalid && this.model.hasInvalidCustomizations()) {
                m.push('<p class="invalid">' + this.trans("WEB_GAME_ITEM_INVALID_CUSTOMIZATIONS") + "</p>")
            }
            if (l.offers) {
                if (this.model.isLocked()) {
                    this.$el.addClass("locked");
                    m.push("<h3>" + this.trans("WEB_GAME_PURCHASE_ITEM_LOCKED") + "</h3>");
                    m.push('<div class="lock-progress">');
                    m.push('<span class="bar" style="width: ' + Math.round(100 - (100 * this.model.get("lockProgress"))) + '%;"></span>');
                    m.push('<span class="text">' + this.model.get("lockType") + " " + this.model.get("lockCriteria") + "</span>");
                    m.push("</div>");
                    if (this.model.get("offers").hasUnlockOffers()) {
                        m.push("<h3>" + this.trans("WEB_GAME_PURCHASE_UNLOCK_OPTIONS") + "</h3>");
                        m.push('<dl class="prices">');
                        this.model.get("offers").filterBy({
                            isUnlockOffer: true
                        }).forEach(function(s) {
                            var r = s.get("limit") || "";
                            m.push("<dt>" + r + "</dt>");
                            m.push('<dd class="' + s.get("currency") + '">' + s.get("price") + "</dd>")
                        });
                        m.push("</dl>")
                    }
                } else {
                    if (this.model.isBuyable()) {
                        m.push("<h3>" + this.trans("WEB_GAME_PURCHASE_OPTIONS") + "</h3>");
                        m.push('<dl class="prices">');
                        this.model.get("offers").filterBy({
                            isUnlockOffer: false
                        }).forEach(function(s) {
                            var r = s.get("limit") || "";
                            m.push("<dt>" + r + "</dt>");
                            m.push('<dd class="' + s.get("currency") + '">' + s.get("price") + "</dd>")
                        });
                        m.push("</dl>")
                    }
                }
            }
            if (l.uses && this.model.isConsumable()) {
                j = this.model.get("usecount");
                n = "usecount";
                if (j === 0) {
                    n += " empty"
                } else {
                    if (j < 10) {
                        n += " low"
                    }
                }
                m.push('<p class="' + n + '">' + this.trans("WEB_GAME_ITEM_USES_LEFT") + " " + j + "</p>")
            }
            if (l.customText) {
                m.push('<p class="custom">' + l.customText + "</p>")
            }
            this.el.innerHTML = m.join("")
        }
    })
}(this));
APP.domTask("items", ["abilities"], function initializeItems(n) {
    var y = APP._,
        d = APP.$,
        j = "/" + APP.win.location.pathname.split("/")[1],
        r = {
            weapon: {
                url: j + "/game/getWeaponsJson",
                key: "weapons"
            },
            appearance: {
                url: j + "/game/getApparelJson",
                key: "apparel"
            },
            bundle: {
                url: j + "/game/getBundlesJson",
                key: "bundles"
            },
            booster: {
                url: j + "/game/getBoostersJson",
                key: "boosters"
            },
            attachment: {
                url: j + "/game/getAttachmentsJson",
                key: "attachments"
            }
        },
        w = APP.ns("items"),
        f = APP.ns("config"),
        l = w.collection = new APP.Collection.Items(),
        v = w.getOfferByOfferId = function(z, A) {
            y.defer(function() {
                var B;
                l.some(function(C) {
                    var D = C.get("offers");
                    return (B = B.get(z))
                });
                if (B) {
                    A(null, B)
                } else {
                    A(new Error("Unable to get offer for offerId: " + z))
                }
            })
        },
        u = w.getItemByOfferId = function(z, A) {
            if (z.match(/^[0-9]+$/)) {
                z = "OFB-BP4F:" + z
            }
            d.ajax({
                url: "/en/game/GetItemByOfferId",
                data: {
                    offerId: z
                },
                cache: false,
                success: function C(D) {
                    if (D && D.status === "success" && D.data.item) {
                        var G = D.data.item,
                            H = G.id,
                            E = l.get(H),
                            F = new APP.Collection.Offers(G.prices);
                        if (E) {
                            A(null, E, F)
                        } else {
                            A(new Error("Unable to get item for offerId: " + z))
                        }
                    } else {
                        A(new Error("Unable to get item for offerId: " + z))
                    }
                },
                error: function B() {
                    A(new Error("Unable to get item for offerId: " + z))
                }
            })
        },
        b = function b(z, A) {
            d.ajax({
                url: z,
                dataType: "json",
                cache: false,
                error: function B(F, D, E) {
                    A(E)
                },
                success: function C(D) {
                    if (D && D.status === "success") {
                        A(null, D.data)
                    } else {
                        A(new Error("Request failed!"))
                    }
                }
            })
        },
        a = function a(B) {
            B = y.once(B);
            var z = 0,
                C = 0,
                A = [],
                E = function E(G) {
                    C += 1;
                    return function F(I, H) {
                        z += 1;
                        if (I) {
                            z = C * C;
                            return B(I)
                        }
                        var J = H[G];
                        A = y.union(A, J);
                        if (z === C) {
                            A.push({
                                id: "tp",
                                name: "Training Points",
                                prices: w.trainingPointOffers,
                                extraPointsPurchased: w.extraPointsPurchased,
                                extraPointsMax: w.extraPointsMax,
                                trainingPointsEarned: f.soldierLevel - 1,
                                trainingPointsCurrent: w.trainingPointsCurrent,
                                type: "trainingpoint"
                            });
                            B(null, A)
                        }
                    }
                };
            y.forEach(r, function D(F) {
                b(F.url, E(F.key))
            })
        },
        m = function m(z) {
            return function A(C) {
                var B = r[z];
                b(B.url, function D(H, F) {
                    if (H) {
                        if (C) {
                            C(H)
                        } else {
                            APP.warn(H)
                        }
                        return false
                    }
                    var G = B.key,
                        E = F[G] || [],
                        I = new APP.Collection.Items(E);
                    I.unsetAll("equippedSlot");
                    w.collection.updateOrRemove(I, {
                        itemType: z
                    });
                    w.collection.invoke("_processCustomizations");
                    if (C) {
                        C()
                    } else {
                        w.trigger("refreshed:" + G)
                    }
                })
            }
        },
        s = w.refreshWeapons = m("weapon"),
        i = w.refreshAppearance = m("appearance"),
        q = w.refreshBundles = m("bundle"),
        g = w.refreshBoosters = m("booster"),
        p = w.refreshAttachments = m("attachment"),
        x = w.refreshUpgrades = m("upgrade"),
        c = function c(A) {
            APP.log("onChangeIsLockedItemsTask");
            if (!A.isItemType("bundle")) {
                var z = l.filterBy({
                        itemType: "bundle"
                    }),
                    C = A.get("isLocked"),
                    B = z.some(function(D) {
                        var E = D.get("items");
                        return y.some(E, function(G, F) {
                            return (G.id === A.id && G.isLocked !== C)
                        })
                    });
                if (B) {
                    w.refreshBundles()
                }
            }
        };
    w.get = function e(z) {
        return w.collection.get(z)
    };
    a(function h(A, z) {
        if (A) {
            APP.warn(A);
            return n(new Error("Unable to load items"))
        }
        w.collection.add(z);
        w.collection.invoke("_processCustomizations");
        w.collection.filter(function(B) {
            if (B.isItemType("pocket")) {
                var D = {},
                    C;
                if (B.has("offers")) {
                    C = B.get("offers");
                    y.forEach(C.pluck("pocket"), function(E) {
                        D[E] = C.filterBy({
                            pocket: E
                        })
                    })
                }
                B.set({
                    pocketOffers: D,
                    personaLevel: f.persona.level,
                    unlockLevels: f.pockets.unlockLevels[B.get("category")] || []
                }, {
                    silent: true
                })
            }
        });
        w.collection.bind("change:isLocked", c);
        w.collection.bind("reset", function() {
            w.collection.reset(z)
        });
        n()
    });
    w.collection.bind("change:equippedSlot", function o(z, A, D) {
        A = y.isNumber(A) ? A : z.previous("equippedSlot");
        var C = z.get("itemType"),
            B = z.isEquipped() ? "equip" : "unequip";
        w.trigger(B + ":" + C, z, A)
    });
    w.bind("refresh:weapons", s);
    w.bind("refresh:appearance", i);
    w.bind("refresh:bundles", q);
    w.bind("refresh:boosters", g);
    w.bind("refresh:attachments", p);
    w.bind("refresh:upgrades", x);
    w.collection.bind("refresh", function k() {
        w.trigger("refresh:weapons");
        w.trigger("refresh:appearance");
        w.trigger("refresh:bundles");
        w.trigger("refresh:boosters");
        w.trigger("refresh:attachments");
        w.trigger("refresh:upgrades")
    });
    w.tooltip = new APP.View.ItemTooltip();
    w.tooltip.attach();
    w.tooltip.bind("render", function() {
        w.tooltip.$("h1, h3, dd, dt, .stats, p.usecount, p.invalid, p.expired, p.rented, span.text, p.custom").renderText()
    })
});
(function(e) {
    var c = e.APP,
        d = c.$,
        a = c._,
        f = c.namespace("config"),
        b = c.View.PurchaseTooltip.prototype;
    c.View.AttachmentTooltip = c.View.PurchaseTooltip.extend({
        className: "attachment-tooltip purchase-tooltip",
        render: function g() {
            var h = this.model.get("expiredate"),
                i = [];
            if (this.model.isBuyable()) {
                b.render.call(this)
            }
            if (this.model.isRented()) {
                this.$el.addClass("rented")
            } else {
                if (this.model.isExpired()) {
                    this.$el.addClass("expired")
                }
            }
            i.push("<h1>" + this.model.get("categoryname") + "</h1>");
            if (this.model.has("reticleImage")) {
                i.push('<span class="item-reticle item-reticle-' + this.model.get("reticleImage") + '"></span>')
            }
            a.forEach(this.model.getStats(), function(m, k) {
                var l = k,
                    j = this.trans("WEB_GAME_STAT_" + k.toUpperCase());
                if (m) {
                    if (k === "zoom") {
                        m = this.trans("WEB_GAME_STAT_ZOOM_LEVEL_" + m)
                    } else {
                        if (m > 0) {
                            m = "+" + m
                        } else {
                            l += " negative"
                        }
                    }
                    i.push('<div class="stats stat-' + l + '">' + j + '<span class="value">' + m + "</span></div>")
                }
            }, this);
            if (h) {
                i.push('<p class="expiredate">' + h + "</p>")
            }
            this.$el.prepend(i.join(""))
        }
    })
}(this));
(function(e) {
    if (!e.APP && (typeof require !== "undefined")) {
        e.APP = require("../common/app")
    }
    var h = e.APP,
        d = h.$,
        j = h._,
        i = h.View.prototype;
    h.View.AttachedList = h.View.extend({
        name: "attached-list-view",
        tagName: "ul",
        events: {
            "click a.attachment-label.buyable, a.attachment-label.expired, a.attachment-label.rented, a.attachment-label.unlockable": function(m) {
                m.preventDefault();
                this.sound("click:open");
                this.trigger("buy", this, this.getModelFromDOM(m.currentTarget), m)
            },
            "mouseenter li span, li a": function(m) {
                this.sound("hover");
                this.trigger("mouse:enter", this, this.getModelFromDOM(m.currentTarget), m)
            },
            "mouseleave li span, li a": function(m) {
                this.trigger("mouse:leave", this, this.getModelFromDOM(m.currentTarget), m)
            },
            "click li": function(m) {
                m.preventDefault();
                this.trigger("click", this, this.getModelFromDOM(m.currentTarget), m)
            }
        },
        initialize: function l() {
            if (this.options.attachedItems) {
                this.setAttachedItems(this.options.attachedItems)
            } else {
                this.model.bind("change:attachments", this._onChangeAttachments, this);
                this.setAttachedItems(this.model.collection.getModelAttachedItems(this.model, true))
            }
            this.collection = this.model.collection;
            this.collection.bind("purchase:end", this._onPurchaseEnd, this)
        },
        destroy: function k() {
            this.model.unbind("change:attachments", this.render, this);
            this.collection.unbind("purchase:end", this._onPurchaseEnd, this)
        },
        _onPurchaseEnd: function a(m) {
            m = this.collection.get(m);
            if (m && m.isItemType("attachment") && j.indexOf(j.values(this.attachedItems), m.id) !== -1) {
                this.render()
            }
        },
        _onChangeAttachments: function g() {
            this.setAttachedItems(this.model.collection.getModelAttachedItems(this.model, true));
            this.render()
        },
        setAttachedItems: function c(m) {
            this.attachedItems = m;
            return this
        },
        getModelFromDOM: function f(m) {
            return this.model.collection.get(d(m).attr("item-id"))
        },
        render: function b() {
            var n = [];
            j.forEach(this.attachedItems, function m(s, v) {
                s = this.model.collection.get(s);
                if (s && !s.isDefault()) {
                    var o = this.make("li"),
                        u = "span",
                        r = s.get("name"),
                        p = "#" + r.toLowerCase().replace(/\s/g, "-"),
                        q = {
                            "class": "attachment-label " + v,
                            "item-id": s.id
                        },
                        w = false;
                    if (s.isLocked()) {
                        if (s.get("offers").hasUnlockOffers()) {
                            u = "a";
                            q.href = p;
                            q["class"] += " unlockable"
                        } else {
                            q["class"] += " locked"
                        }
                        if (s.isExpired()) {
                            q["class"] += " expired"
                        } else {
                            if (s.isRented()) {
                                q["class"] += " rented"
                            }
                        }
                    } else {
                        if (s.isBuyable()) {
                            u = "a";
                            q.href = p;
                            if (s.isExpired()) {
                                q["class"] += " expired"
                            } else {
                                if (s.isRented()) {
                                    q["class"] += " rented"
                                } else {
                                    q["class"] += " buyable"
                                }
                            }
                        } else {
                            if (s.isExpired()) {
                                q["class"] += " expired"
                            } else {
                                if (s.isRented()) {
                                    q["class"] += " rented"
                                } else {
                                    if (s.isDefault()) {
                                        q["class"] += " default"
                                    }
                                }
                            }
                        }
                    }
                    if (this.options.showInvalid) {
                        if (this.options.hasOwnProperty("invalids")) {
                            if (j.indexOf(this.options.invalids || [], s.id) !== -1) {
                                w = true;
                                q["class"] += " invalid"
                            }
                        } else {
                            if (!s.get("owned")) {
                                w = true;
                                q["class"] += " invalid"
                            }
                        }
                    }
                    o.appendChild(this.make(u, q, r));
                    if (this.options.onlyInvalid) {
                        if (w) {
                            n.push(o)
                        }
                    } else {
                        n.push(o)
                    }
                }
            }, this);
            this.$items = d(n);
            this.$items.appendTo(this.el);
            this.$items.disableTextSelect()
        }
    })
}(this));
(function(h) {
    var s = h.APP,
        p = s.Backbone.View.prototype,
        i = s.$,
        B = s._,
        u = "EMPTY_ATTACHMENT",
        n = s.ns("config");
    s.View.WeaponCustomizeSlot = s.View.extend({
        name: "weapon-customize-slot-view",
        events: {
            "click a.attachment-label": function l(D) {
                D.preventDefault();
                var C = this.getSelected();
                if (C) {
                    this.sound("click:open");
                    this.trigger("buy", this, C, D, this.options.category)
                }
            },
            "click a.prev": function(C) {
                C.preventDefault();
                this.selectPrev()
            },
            "click a.next": function(C) {
                C.preventDefault();
                this.selectNext()
            },
            "click a.buy, a.unlock": function(D) {
                D.preventDefault();
                var C = this.getSelected();
                if (C) {
                    this.sound("click:open");
                    this.trigger("buy", this, C, D, this.options.category)
                }
            },
            mouseleave: function z(C) {
                this.sound("select:open");
                this.trigger("leave", this, C)
            },
            mouseenter: function o(C) {
                this.sound("select:close");
                this.trigger("enter", this, C)
            },
            "mouseenter a.buy, a.unlock, a.prev, a.next, a.attachment-label": function() {
                this.sound("hover")
            }
        },
        initialize: function e() {
            var C = this.collection.by("isDefault", true);
            if (C.length === 0) {
                this.collection.add([new s.Model.Item({
                    id: u,
                    name: "No " + this.options.category + "  addon",
                    slot: this.options.slot,
                    category: this.options.category,
                    buyable: false,
                    isDefault: true
                })], {
                    at: 0
                })
            }
            if (!this.options.selected) {
                this.options.selected = (C.length !== 0 ? C : this.collection).at(0).id
            }
            this.collection.bind("purchase:start", this._onPurchaseStart, this);
            this.collection.bind("purchase:end", this._onPurchaseEnd, this);
            this.collection.bind("purchase:success", this._onPurchaseSuccess, this);
            this.collection.bind("change", this.render, this)
        },
        destroy: function c() {
            this.collection.unbind("purchase:start", this._onPurchaseStart, this);
            this.collection.unbind("purchase:end", this._onPurchaseEnd, this);
            this.collection.unbind("purchase:success", this._onPurchaseSuccess, this);
            this.collection.unbind("change", this.render, this)
        },
        _onMouseEnter: function k(C) {
            this.$list.slideDown(200)
        },
        _onMouseLeave: function y(C) {
            if (!this.$el.hasClass("loading")) {
                this.$list.slideUp(200)
            }
        },
        _onPurchaseStart: function A() {
            this.$el.addClass("loading")
        },
        _onPurchaseEnd: function a() {
            this.$el.removeClass("loading");
            this.render()
        },
        _onPurchaseSuccess: function b(C) {
            var D = B.indexOf(this.options.invalids || [], C ? C.id : null);
            if (D !== -1) {
                this.options.invalids.splice(D, 1);
                if (this.options.selected === C.id) {
                    this.$name.removeClass("invalid")
                }
            }
        },
        getCurrentIndex: function w() {
            var C = this.getSelected();
            return this.collection.indexOf(C)
        },
        selectPrev: function g() {
            var C = this.collection.length - 1,
                D = this.getCurrentIndex(),
                E = (D === -1) ? C : D - 1;
            if (E > C) {
                E = 0
            } else {
                if (E < 0) {
                    E = C
                }
            }
            this.sound("prev");
            return this.selectNum(E, "prev")
        },
        selectNext: function q() {
            var C = this.collection.length - 1,
                D = this.getCurrentIndex(),
                E = (D === -1) ? 0 : D + 1;
            if (E > C) {
                E = 0
            } else {
                if (E < 0) {
                    E = C
                }
            }
            this.sound("next");
            return this.selectNum(E, "next")
        },
        selectNum: function v(E, D) {
            var C = this.collection.at(E);
            this.select(C, D);
            return this
        },
        select: function r(D, C) {
            D = this.collection.get(D);
            if (D) {
                this.options.selected = D.id
            } else {
                this.options.selected = null
            }
            this.renderSelected(C);
            this.trigger("select", this.options.selected)
        },
        getSelected: function d() {
            return this.collection.get(this.options.selected)
        },
        renderSelected: function m(G) {
            var F = this.getSelected(),
                E = F.get("name"),
                I = this.getCurrentIndex(),
                C = "#" + E.toLowerCase().replace(/\s/g, "-"),
                H = "span",
                D = {
                    "class": "attachment-label"
                },
                J;
            this.$pages.hide();
            this.$el.removeClass("empty rented buyable expired default locked unlockable");
            if (I !== -1) {
                if (F.id === u) {
                    this.$el.addClass("empty");
                    D["class"] += " empty"
                } else {
                    if (F.isLocked()) {
                        if (F.get("offers").hasUnlockOffers()) {
                            H = "a";
                            D.href = C;
                            D["class"] += " unlockable"
                        } else {
                            D["class"] += " locked"
                        }
                        if (F.isExpired()) {
                            D["class"] += " expired"
                        } else {
                            if (F.isRented()) {
                                D["class"] += " rented"
                            }
                        }
                    } else {
                        if (F.isBuyable()) {
                            H = "a";
                            D.href = C;
                            if (F.isExpired()) {
                                D["class"] += " expired"
                            } else {
                                if (F.isRented()) {
                                    D["class"] += " rented"
                                } else {
                                    D["class"] += " buyable"
                                }
                            }
                        } else {
                            if (F.isExpired()) {
                                D["class"] += " expired"
                            } else {
                                if (F.isRented()) {
                                    D["class"] += " rented"
                                } else {
                                    if (F.isDefault()) {
                                        D["class"] += " default"
                                    }
                                }
                            }
                        }
                    }
                }
                if (B.indexOf(this.options.invalids || [], F.id) !== -1) {
                    D["class"] += " invalid"
                }
                J = this.$(this.make(H, D, E));
                this.$name.replaceWith(J);
                this.$name = J;
                this.$name.disableTextSelect();
                this.$pages.eq(I).show();
                if (this.collection.length > 1) {
                    this.renderNavButtons()
                }
            }
            return this
        },
        renderItem: function j(G) {
            var C = this.make("li", {
                    "item-id": G.id
                }),
                F = this.make("div", {
                    "class": "stats-bar"
                }),
                I = this.make("div", {
                    "class": "bottom-bar"
                }),
                E = this.make("div"),
                H = G.get("offers"),
                J, D;
            this.createView(s.View.StatsList, {
                container: F,
                model: G
            }).render().attach();
            if (G.has("reticleImage")) {
                C.appendChild(this.make("span", {
                    "class": "item-reticle item-reticle-" + G.get("reticleImage")
                }))
            }
            if (G.isLocked()) {
                C.className = "locked";
                H = H.getUnlockOffers();
                D = this.make("div", {
                    "class": "lock-progress"
                });
                D.appendChild(this.make("span", {
                    "class": "bar",
                    style: "width: " + Math.round(100 - (100 * G.get("lockProgress"))) + "%;"
                }));
                D.appendChild(this.make("span", {
                    "class": "text"
                }, G.get("lockType") + " " + G.get("lockCriteria")));
                C.appendChild(D)
            }
            if (G.get("description")) {
                C.appendChild(this.make("p", null, G.get("description")))
            }
            if (G.isBuyable() && H.length !== 0) {
                J = H.getLowestOffers();
                if (J.credits) {
                    E.appendChild(this.make("span", {
                        "class": "currency credits"
                    }, J.credits.get("price")))
                }
                if (J.funds) {
                    E.appendChild(this.make("span", {
                        "class": "currency funds"
                    }, J.funds.get("price")))
                }
                I.appendChild(this.make("a", {
                    "class": "buy" + (G.isLocked() ? " unlock" : ""),
                    href: "#buy"
                }))
            }
            if (F.childNodes.length !== 0) {
                C.appendChild(F)
            }
            if (E.childNodes.length !== 0) {
                I.appendChild(E);
                C.appendChild(I)
            }
            return C
        },
        renderNavButtons: function f() {
            var C = this.getCurrentIndex() + 1,
                F = this.collection.length,
                E = C - 1,
                D = C + 1;
            if (E < 1) {
                E = F
            }
            this.$prev.html("<span>" + E + "/" + F + "</span>");
            if (D > F) {
                D = 1
            }
            this.$next.html("<span>" + D + "/" + F + "</span>");
            this.$prev.disableTextSelect();
            this.$next.disableTextSelect();
            return this
        },
        render: function x() {
            this.$el.addClass(this.options.category);
            var D = this.make("div", {
                    "class": "bar"
                }),
                C;
            this.$name = i("<span />").addClass("attachment-label").appendTo(D);
            if (this.collection.length > 1) {
                this.$prev = i("<a />").addClass("prev").appendTo(D);
                this.$next = i("<a />").addClass("next").appendTo(D)
            }
            this.el.appendChild(D);
            if (this.collection.length !== 0) {
                C = this.collection.map(this.renderItem, this);
                this.$pages = i(C);
                this.$list = this.$("<ul>").addClass("list");
                this.$pages.appendTo(this.$list);
                this.$list.appendTo(this.el)
            }
            this.$("li p").disableTextSelect();
            this.renderSelected()
        }
    })
}(this));
(function(j) {
    var s = j.APP,
        q = s.Backbone.View.prototype,
        k = s.$,
        C = s._,
        p = s.namespace("config"),
        u = "EMPTY_ATTACHMENT";
    s.View.WeaponCustomize = s.View.extend({
        name: "weapon-customize-view",
        events: {
            "click a.button-view.close, a.button-view.done, a.close-view": function(E) {
                E.preventDefault();
                this.sound("close");
                this.trigger("close", this, this.model, E)
            },
            "mouseenter a.button, a.close-view": function() {
                this.sound("hover")
            }
        },
        options: {
            animDelay: 500
        },
        initialize: function b() {
            this.slots = {};
            this.attached = C.clone(this.model.get("attachments"));
            this.attachments = this.model.collection.getModelAttachments(this.model);
            if (!this.collection && this.model.collection) {
                this.collection = this.model.collection
            }
            this.invalids = C.filter(this.attached, function E(G) {
                var F = this.model.collection.get(G);
                return (F && !F.get("owned"))
            }, this);
            this.bind("slot:select", this._onSlotSelect, this);
            this.bind("slot:buy", this._onSlotBuy, this);
            this.bind("slot:leave", this._onSlotLeave, this);
            this.bind("slot:enter", this._onSlotEnter, this);
            this.bind("select", this.onSelect, this);
            this.bind("select:texture", this.renderTexture, this);
            this.bind("select:scope", this.renderScope, this);
            this.bind("select:muzzle", this.renderMuzzle, this);
            this.model.bind("change", this.render, this);
            this.model.bind("purchase:start", this._onPurchaseStart, this);
            this.model.bind("purchase:end", this._onPurchaseEnd, this);
            this.onEscapeClose = C.bind(this.onEscapeClose, this);
            k(j).bind("keyup", this.onEscapeClose);
            this.bind("buy:click", this._onBuyClick, this)
        },
        destroy: function c() {
            this.model.unbind("change", this.render, this);
            this.model.unbind("purchase:start", this._onPurchaseStart, this);
            this.model.unbind("purchase:end", this._onPurchaseEnd, this);
            k(j).unbind("keyup", this.onEscapeClose)
        },
        _onBuyClick: function f(E) {
            this.buy()
        },
        _onPurchaseStart: function e() {
            this.$el.addClass("loading")
        },
        _onPurchaseEnd: function h() {
            this.$el.removeClass("loading")
        },
        _swapImage: function z(G, F) {
            var E = G,
                H = k("<img />").attr(F).css("opacity", 0);
            E.animate({
                opacity: 0
            }, this.options.animDelay, function() {
                E.remove()
            });
            H.appendTo(E.parent());
            H.animate({
                opacity: 1
            }, this.options.animDelay);
            H.disableTextSelect();
            return H
        },
        _onSlotLeave: function g(E) {
            this.$el.removeClass("muzzle scope stock ammo texture barrel")
        },
        _onSlotEnter: function y(E) {
            this.$el.removeClass("muzzle scope stock ammo texture barrel");
            this.$el.addClass(E.options.category)
        },
        _onSlotSelect: function v(F, E) {
            F = this.model.collection.get(F);
            var H = E.options.slot,
                G = E.options.category;
            this.trigger("select", F, H, G);
            this.trigger("select:" + G, F, H, G)
        },
        _onSlotBuy: function w(E, G) {
            if (this.model.isBuyable()) {
                var H, F = {
                    className: "buy-for-non-permanent-dialog",
                    renderData: {
                        title: this.trans("WEB_GAME_BUY_FOR_NON_PERMANENT_DIALOG_TITLE"),
                        buttonRight: this.trans("WEB_GAME_BUY_FOR_NON_PERMANENT_DIALOG_CLOSE"),
                        close: true
                    },
                    container: s.doc.body
                };
                if (this.model.isLocked()) {
                    F.renderData.body = this.trans("WEB_GAME_BUY_FOR_LOCKED_DIALOG_TEXT");
                    if (this.model.get("offers").hasUnlockOffers()) {
                        F.renderData.buttonLeft = this.trans("WEB_GAME_BUY_FOR_LOCKED_DIALOG_BUY")
                    }
                } else {
                    F.renderData.body = this.trans("WEB_GAME_BUY_FOR_NON_PERMANENT_DIALOG_TEXT");
                    F.renderData.buttonLeft = this.trans("WEB_GAME_BUY_FOR_NON_PERMANENT_DIALOG_BUY")
                }
                H = this.createView(s.View.Dialog, F);
                H.bind("button:left", function() {
                    H.destroy();
                    this.buy()
                }, this);
                H.bind("close", H.destroy, H);
                H.bind("button:right", H.destroy, H);
                H.bind("render", function I() {
                    H.$el.find("h2.title, div.body").renderText();
                    H.$el.find("a.button, a.button-view").renderText({
                        hover: true
                    })
                });
                H.attach();
                H.render();
                H.show()
            } else {
                this.trigger("buy", this, G)
            }
        },
        onEscapeClose: function o(E) {
            if (E.keyCode === 27 && this.$el.is(":visible")) {
                this.sound("close");
                this.trigger("close", this, this.model)
            }
        },
        buy: function d() {
            this.trigger("buy", this, this.model, {
                groupPrices: "unlimited"
            });
            return this
        },
        onSelect: function x(E, F) {
            if (this.attached.hasOwnProperty(F)) {
                this.attached[F] = (E && E.id !== u) ? E.id : null;
                if (this.attachedList) {
                    this.attachedList.setAttachedItems(this.attached).render()
                } else {
                    this.checkForAttachmentsOnNonPermanent()
                }
            }
        },
        checkForAttachmentsOnNonPermanent: function A() {
            var E = this.$("div.warning");
            if (this.model.isBuyable() && !this.model.isLocked() && !C.isEqual(this.attached, this.model.get("attachments"))) {
                if (E.hasClass("hide")) {
                    this.sound("error");
                    E.removeClass("hide")
                }
            } else {
                E.addClass("hide")
            }
            return this
        },
        preloadImages: function B() {
            var I = [1, 2, 6],
                F = this.attachments.filter(function J(K) {
                    return (C.indexOf(I, K.get("fitsSlot")) !== -1)
                }),
                E = C.invoke(F, "getAttachmentImage", "max"),
                H = C.afterWithoutErrors(E.length, C.bind(function() {
                    if (this.model.isLocked()) {
                        this.renderLock()
                    }
                    this.$el.removeClass("loading");
                    this.trigger("ready")
                }, this), function G(K) {
                    s.warn(K)
                });
            if (E.length === 0 && this.model.isCustomizable()) {
                E.push(this.model.getImage("max"))
            }
            if (E.length === 0) {
                this.$el.removeClass("loading")
            } else {
                C.forEach(E, function(K) {
                    s.preload.image(K, C.bind(function(M, N) {
                        var L, O;
                        if (M) {
                            L = this.collection.get(N.match(/[0-9]+/g).pop());
                            if (L) {
                                O = p.imageFolder + "attachment-icons/max/" + L.get("category") + ".png";
                                L.setAttachmentImage("max", O);
                                if (this.$muzzle && this.$muzzle.attr("src") === N) {
                                    this.$muzzle.attr("src", O)
                                } else {
                                    if (this.$scope && this.$scope.attr("src") === N) {
                                        this.$scope.attr("src", O)
                                    } else {
                                        if (this.$img && this.$img.attr("src") === N) {
                                            this.$img.attr("src", O)
                                        }
                                    }
                                }
                            }
                        }
                        H()
                    }, this), 15000)
                }, this)
            }
            return this
        },
        renderMuzzle: function n(F) {
            var E = C.clone(p.attachmentSize.max);
            if (F && F.id !== u) {
                E.src = F.getAttachmentImage("max")
            } else {
                E.src = p.imageFolder + "game/1x1-transparent.png"
            }
            this.$muzzle = this._swapImage(this.$muzzle, E);
            return this
        },
        renderScope: function l(F) {
            var E = C.clone(p.attachmentSize.max);
            if (F && F.id !== u) {
                E.src = F.getAttachmentImage("max")
            } else {
                E.src = p.imageFolder + "game/1x1-transparent.png"
            }
            this.$scope = this._swapImage(this.$scope, E);
            return this
        },
        renderTexture: function r(F) {
            var E = C.clone(p.imageSize.max);
            if (F && F.id !== u) {
                E.src = F.getAttachmentImage("max")
            } else {
                E.src = p.imageFolder + "game/1x1-transparent.png"
            }
            E["class"] = "main-item";
            this.$img = this._swapImage(this.$img, E);
            return this
        },
        renderConnector: function i(J, Q) {
            var S = this.$(Q.getContainer()),
                P = this.slotPositions[J],
                O = k("<span />").addClass("connector-dot " + J).appendTo(S),
                N = 200,
                M = P.start[0],
                K = P.start[1],
                G = P.stop[0] + (P.start[0] > (P.stop[0] + (N / 2)) ? N : 0),
                E = P.stop[1],
                I = Math.abs(M - G),
                R = Math.abs(K - E),
                F = Math.sqrt(I * I + R * R),
                H = Math.round((180 / Math.PI) * Math.acos((R * R - (-F * F) - I * I) / (2 * R * F))),
                L = s.doc.createElementNS("https://web.archive.org/web/20120615231742/http://www.w3.org/2000/svg", "svg"),
                T = s.doc.createElementNS("https://web.archive.org/web/20120615231742/http://www.w3.org/2000/svg", "line");
            L.style.left = (M > G ? G : M) + "px";
            L.style.top = (K > E ? E : K) + "px";
            L.setAttribute("class", "connector-line " + J);
            L.setAttribute("width", I + "px");
            L.setAttribute("height", R + "px");
            L.setAttribute("viewBox", "0 0 " + I + " " + R);
            if (M > G && K > E) {
                T.setAttribute("x1", 0);
                T.setAttribute("x2", "100%");
                T.setAttribute("y1", 0);
                T.setAttribute("y2", "100%");
                H = 270 + (90 - H)
            } else {
                if (M < G && K > E) {
                    T.setAttribute("x1", "100%");
                    T.setAttribute("x2", 0);
                    T.setAttribute("y1", 0);
                    T.setAttribute("y2", "100%")
                } else {
                    if (M < G && K < E) {
                        T.setAttribute("x1", "100%");
                        T.setAttribute("x2", 0);
                        T.setAttribute("y1", "100%");
                        T.setAttribute("y2", 0);
                        H = 90 + (90 - H)
                    } else {
                        T.setAttribute("x1", 0);
                        T.setAttribute("x2", "100%");
                        T.setAttribute("y1", "100%");
                        T.setAttribute("y2", 0);
                        H = 180 + H
                    }
                }
            }
            L.appendChild(T);
            S.append(L);
            O.css({
                left: P.start[0],
                top: P.start[1],
                "-webkit-transform": "rotate(" + H + "deg)"
            });
            Q.$el.css({
                left: P.stop[0],
                top: P.stop[1]
            }).addClass((P.start[0] > (P.stop[0] + (N / 2))) ? "right" : "left");
            return this
        },
        renderSlot: function m(I, M) {
            M = parseInt(M, 10);
            var F = this.el,
                G = s.Model.Item.getAttachmentCategoryMap(M).toLowerCase(),
                L, H, K = this.attachments.by("fitsSlot", M),
                J;
            if (K.length === 0) {
                return this
            }
            if (!K.get(I)) {
                s.warn("Selected attachment does not exist, reverting to default");
                I = null
            }
            K.comparator = function E(N) {
                return N.get("isDefault") ? 0 : 1
            };
            K.sort();
            if (G === "scope" || G === "muzzle") {
                F = this.make("div", {
                    "class": "slot-" + G
                });
                F.style.left = this.slotPositions[G].box[0] + "px";
                F.style.top = this.slotPositions[G].box[1] + "px";
                J = C.clone(p.attachmentSize.max);
                J.src = p.imageFolder + "game/1x1-transparent.png";
                this["$" + G] = k(this.make("img", J));
                this["$" + G].appendTo(F);
                this.el.appendChild(F)
            }
            H = {
                collection: K,
                container: F,
                selected: I,
                slot: M,
                category: G,
                invalids: this.invalids
            };
            L = this.slots[G] = this.createView(s.View.WeaponCustomizeSlot, H, "slot");
            if (G === "scope" || G === "muzzle" || G === "texture") {
                this.trigger("select:" + G, L.getSelected(), G)
            }
            L.render();
            if (G === "texture") {
                L.$el.css({
                    left: this.slotPositions[G].stop[0],
                    top: this.slotPositions[G].stop[1]
                })
            } else {
                this.renderConnector(G, L)
            }
            L.attach();
            return this
        },
        renderLock: function D() {
            var J = s.ns("config"),
                I = this.model.get("lockType"),
                K = this.model.get("lockCriteria"),
                G = this.make("div", {
                    "class": "lock " + I
                }),
                H = J.imageFolder + "game/item-lock-progress.png",
                F = this.model.get("lockProgress"),
                E = j.progressCircle(H, F, {
                    width: 116,
                    height: 116,
                    lineWidth: 20,
                    duration: 500
                });
            G.appendChild(this.make("span", {
                "class": "type"
            }, I));
            G.appendChild(this.make("span", {
                "class": "key"
            }, K));
            G.appendChild(E);
            this.el.appendChild(G);
            return this
        },
        render: function a() {
            this.$el.addClass("loading " + this.model.get("category").toLowerCase().replace(/[\s_]/, "-") + " item-" + this.model.id);
            var K = this.make("div", {
                    "class": "main-bar"
                }),
                G = this.make("h1", null, this.model.get("name")),
                I = this.model.get("offers"),
                L, E, H, F, J;
            G.appendChild(this.make("span", {
                "class": "category"
            }, this.model.get("categoryname")));
            K.appendChild(G);
            this.el.appendChild(K);
            if (this.model.isLocked()) {
                this.$el.addClass("locked");
                I = I.getUnlockOffers()
            }
            if (this.model.isBuyable()) {
                L = this.make("div");
                E = I.getUnlimitedOffers();
                if (E.length !== 0) {
                    this.createView(s.View.Button, {
                        container: L,
                        className: "buy",
                        text: this.trans("WEB_STORE_COMMON_BUY_BTN"),
                        sound: true
                    }, "buy").render().attach();
                    H = this.make("div", {
                        "class": "unlimitied-prices"
                    });
                    if (this.model.isLocked()) {
                        H.appendChild(this.make("span", null, this.trans("WEB_GAME_WEAPONS_INFO_PRICE_UNLOCK")))
                    } else {
                        H.appendChild(this.make("span", null, this.trans("WEB_GAME_CUSTOMIZE_PRICE_UNLIMITED")))
                    }
                    E.forEach(function(M) {
                        H.appendChild(this.make("span", {
                            "class": "currency-" + M.get("currency")
                        }, M.get("price")))
                    }, this);
                    L.appendChild(H)
                }
                J = this.make("div", {
                    "class": "warning"
                });
                J.appendChild(this.make("span", null, this.trans("WEB_GAME_CUSTOMIZE_WARNING_TEXT")));
                L.appendChild(J);
                K.appendChild(L);
                this.createView(s.View.Button, {
                    className: "close",
                    text: this.trans("WEB_GAME_CUSTOMIZE_BTN_CLOSE")
                }).render().attach()
            } else {
                this.createView(s.View.Button, {
                    className: "done",
                    text: this.trans("WEB_GAME_CUSTOMIZE_BTN_DONE")
                }).render().attach();
                this.attachedList = this.createView(s.View.AttachedList, {
                    container: K,
                    model: this.model,
                    invalids: this.invalids,
                    showInvalid: true,
                    attachedItems: this.attached
                }, "list");
                this.attachedList.render();
                this.attachedList.attach()
            }
            this.$img = k("<img />").attr({
                "class": "main-item",
                width: 900,
                height: 450,
                src: p.imageFolder + "game/1x1-transparent.png"
            });
            this.$img.appendTo(this.el);
            this.slotPositions = this.options.getSlotPositions(this.model);
            this.slots = {};
            C.forEach(this.attached, this.renderSlot, this);
            this.preloadImages();
            this.checkForAttachmentsOnNonPermanent();
            this.el.appendChild(this.make("a", {
                "class": "close-view"
            }));
            this.$("div.warning span, div.unlimitied-prices span").disableTextSelect()
        }
    })
}(this));
(function(d) {
    var i = d.APP,
        m = i._;
    i.View.WeaponInfo = i.View.extend({
        name: "weapon-info-view",
        className: "info-view",
        events: {
            "click a.config-button": function(n) {
                n.preventDefault();
                this.sound("click:button");
                this.trigger("customize", this, this.model, n)
            },
            "mouseenter a.config-button": function() {
                this.sound("hover")
            }
        },
        initialize: function g() {
            this.collection = this.model.collection;
            this.collection.bind("purchase:start", this._onPurchaseStart, this);
            this.collection.bind("purchase:end", this._onPurchaseEnd, this);
            this.model.bind("remove", this._onModelRemove, this);
            this.model.bind("change", this._onModelChange, this);
            this.model.bind("heartbeat", this.render, this);
            this.bind("buy:click", this._onClickBuy, this)
        },
        destroy: function b() {
            this.collection.unbind("purchase:start", this._onPurchaseStart, this);
            this.collection.unbind("purchase:end", this._onPurchaseEnd, this);
            this.model.unbind("remove", this._onModelRemove, this);
            this.model.unbind("change", this._onModelChange, this)
        },
        _onPurchaseStart: function c(n) {
            n = this.collection.get(n);
            if (n && (n.id === this.model.id || m.indexOf(m.values(this.model.get("attachments") || {}), n.id) !== -1)) {
                this.$el.addClass("loading")
            }
        },
        _onPurchaseEnd: function l(n) {
            n = this.collection.get(n);
            if (n && (n.id === this.model.id || m.indexOf(m.values(this.model.get("attachments") || {}), n.id) !== -1)) {
                this.render()
            }
        },
        _onModelRemove: function j() {
            if (this.collection.indexOf(this.model) === -1) {
                this.destroy()
            }
        },
        _onModelChange: function f() {
            this.render()
        },
        _onClickBuy: function a() {
            this.trigger("buy", this, this.model)
        },
        renderStats: function e(q, v) {
            var w = document.createDocumentFragment(),
                p = this.make("div", {
                    "class": "stat-title"
                }),
                s = this.make("div", {
                    "class": "label stat-" + v
                }, v),
                u = this.make("div", {
                    "class": "attachment-label"
                }, q.base),
                r = this.make("div", {
                    "class": "base"
                }),
                n = this.make("div", {
                    "class": "stat-details"
                }),
                o = (this.model.get("bestInClass") || []).indexOf(v) !== -1;
            if (o) {
                s.className += " bic";
                s.appendChild(this.make("span", {
                    "class": "best-in-class"
                }, this.trans("WEB_GAME_STAT_BEST_IN_CLASS")))
            }
            p.appendChild(s);
            w.appendChild(p);
            r.appendChild(u);
            n.appendChild(r);
            w.appendChild(n);
            if (q.hasOwnProperty("mods")) {
                p.className += " active";
                if (v !== "zoom" && q.mods.length !== 0) {
                    n.appendChild(this.make("div", {
                        "class": "mods"
                    }, m.map(q.mods, function(y) {
                        var x = "value";
                        if (y > 0) {
                            y = "+" + y
                        } else {
                            x += " negative"
                        }
                        return '<span class="' + x + '">' + y + "</span>"
                    }).join(" ")))
                }
            } else {
                u.className += " empty"
            }
            return w
        },
        renderLock: function h() {
            var s = i.ns("config"),
                r = this.model.get("lockType"),
                u = this.model.get("lockCriteria"),
                p = this.make("div", {
                    "class": "lock " + r
                }),
                q = s.imageFolder + "game/item-lock-progress.png",
                o = this.model.get("lockProgress"),
                n = d.progressCircle(q, o, {
                    width: 116,
                    height: 116,
                    lineWidth: 20,
                    duration: 500
                });
            p.appendChild(this.make("span", {
                "class": "type"
            }, r));
            p.appendChild(this.make("span", {
                "class": "key"
            }, u));
            p.appendChild(n);
            this.el.appendChild(p);
            return this
        },
        render: function k() {
            var w = this.make("h2"),
                A = this.make("p", {
                    "class": "description"
                }),
                y = this.make("span", null, this.model.get("description")),
                u, r = this.make("a", {
                    "class": "info-button config-button"
                }, this.trans("WEB_GAME_WEAPONS_INFO_VIEW_CUSTOMIZATION_OPTIONS")),
                o = document.createDocumentFragment(),
                q, s, n = this.make("div", {
                    "class": "label-box bottom"
                }),
                v = this.make("div", {
                    "class": "box-content"
                }),
                z = this.make("a", {
                    "class": "info-button config-button customize-button"
                }, this.trans("WEB_GAME_WEAPONS_INFO_CUSTOMIZE_WEAPON")),
                p, x = this.model.get("offers");
            w.appendChild(this.make("span", {
                "class": "name"
            }, this.model.get("name")));
            w.appendChild(this.make("span", {
                "class": "category"
            }, this.model.get("categoryname")));
            this.el.appendChild(w);
            A.appendChild(y);
            this.el.appendChild(A);
            if (this.model.hasStats()) {
                u = this.createView(i.View.Stats, {
                    model: this.model
                });
                this.createView(i.View.LabelBox, {
                    label: this.trans("WEB_GAME_WEAPONS_INFO_WEAPON_STATS"),
                    content: u,
                    className: "stats-wrapper",
                    container: this.el
                }).render().attach()
            }
            if (this.model.isLocked()) {
                this.$el.addClass("locked");
                this.renderLock();
                if (x.hasUnlockOffers()) {
                    q = x.getUnlockOffers().getLowestOffers();
                    s = this.make("div", {
                        "class": "prices"
                    });
                    if (q.credits) {
                        s.appendChild(this.make("span", {
                            "class": "currency credits"
                        }, q.credits.get("price")))
                    }
                    if (q.funds) {
                        s.appendChild(this.make("span", {
                            "class": "currency funds"
                        }, q.funds.get("price")))
                    }
                    o.appendChild(s);
                    this.createView(i.View.Button, {
                        container: o,
                        className: "buy",
                        text: this.trans("WEB_STORE_COMMON_BUY_BTN"),
                        sound: true
                    }, "buy").render().attach();
                    this.createView(i.View.LabelBox, {
                        label: this.trans("WEB_GAME_WEAPONS_INFO_PRICE_UNLOCK"),
                        content: o,
                        className: "bottom purchase",
                        container: this.$("div.lock")
                    }).render().attach()
                }
            } else {
                if (this.model.isCustomizable()) {
                    if (this.model.isCustomized()) {
                        this.createView(i.View.LabelBox, {
                            label: this.trans("WEB_GAME_WEAPONS_INFO_WEAPON_CONFIG"),
                            content: this.createView(i.View.AttachedList, {
                                model: this.model,
                                showInvalid: true
                            }, "list"),
                            className: "config-wrapper",
                            container: this.el
                        }).render().attach()
                    } else {
                        if (this.model.isBuyable()) {
                            r.appendChild(this.make("span", {
                                "class": "icon customize"
                            }));
                            this.createView(i.View.LabelBox, {
                                label: this.trans("WEB_GAME_WEAPONS_INFO_WEAPON_CONFIG"),
                                content: r,
                                container: this.el
                            }).render().attach()
                        }
                    }
                }
                if (this.model.isBuyable() && x) {
                    q = x.getLowestOffers();
                    s = this.make("div", {
                        "class": "prices"
                    });
                    if (q.credits) {
                        s.appendChild(this.make("span", {
                            "class": "currency credits"
                        }, q.credits.get("price")))
                    }
                    if (q.funds) {
                        s.appendChild(this.make("span", {
                            "class": "currency funds"
                        }, q.funds.get("price")))
                    }
                    o.appendChild(s);
                    this.createView(i.View.Button, {
                        container: o,
                        className: "buy",
                        text: this.trans("WEB_STORE_COMMON_BUY_BTN"),
                        sound: true
                    }, "buy").render().attach();
                    this.createView(i.View.LabelBox, {
                        label: this.trans("WEB_GAME_WEAPONS_INFO_PRICE_FROM"),
                        content: o,
                        className: "bottom purchase",
                        container: this.el
                    }).render().attach()
                } else {
                    if (this.model.isCustomizable()) {
                        z.appendChild(this.make("span", {
                            "class": "icon customize"
                        }));
                        this.createView(i.View.LabelBox, {
                            content: z,
                            container: this.el,
                            className: "bottom"
                        }).render().attach()
                    }
                }
            }
        }
    })
}(this));
(function(c) {
    var d = c.APP,
        b = d.$,
        g = d._,
        h = d.namespace("config"),
        e = d.View.prototype;
    d.View.WeaponSlots = d.View.extend({
        name: "weapon-slots-view",
        initialize: function i() {
            if (!this.collection && this.model.collection) {
                this.collection = this.model.collection
            }
        },
        destroy: function f() {},
        render: function a() {
            var j = this.collection.getModelAttachedItems(this.model, true),
                k = {
                    1: "muzzle",
                    2: "scope",
                    3: "barrel",
                    4: "ammo",
                    5: "stock",
                    6: "texture"
                };
            g.forEach(this.collection.getModelCustomizableSlots(this.model), function(o) {
                var n = k[o],
                    m = j[n],
                    l = this.make("span", {
                        "class": n
                    });
                if (n !== "muzzle") {
                    if (m && !m.isDefault()) {
                        l.className += " modded";
                        if (!m.get("owned")) {
                            l.className += " invalid"
                        }
                    }
                    this.el.appendChild(l)
                }
            }, this)
        }
    })
}(this));
(function(i) {
    var k = i.APP,
        d = k.$,
        n = k._,
        f = k.win,
        o = k.namespace("config"),
        l = k.View.prototype;
    k.View.WeaponItem = k.View.extend({
        name: "weapon-item-view",
        tagName: "div",
        events: {
            "mouseenter span.exclaim": function(p) {
                this.sound("hover");
                this.trigger("exclaim:enter", this, this.model, p)
            },
            "mouseleave span.exclaim": function(p) {
                this.trigger("exclaim:leave", this, this.model, p)
            },
            "mouseenter a.buy, a.lock, a.unlock": function(p) {
                this.sound("hover");
                this.trigger("buy:enter", this, this.model, p)
            },
            "mouseleave a.buy, a.lock, a.unlock": function(p) {
                this.trigger("buy:leave", this, this.model, p)
            },
            "click a.buy, a.unlock": function(p) {
                p.preventDefault();
                p.stopImmediatePropagation();
                this.sound("click");
                this.trigger("buy", this, this.model, p)
            },
            "click a.customize": function(p) {
                p.preventDefault();
                p.stopImmediatePropagation();
                this.sound("click");
                this.trigger("customize", this, this.model, p)
            },
            click: function(p) {
                p.preventDefault();
                this.sound("click");
                this.trigger("click", this, this.model, p)
            },
            mouseenter: function(p) {
                this.sound("hover");
                this.trigger("enter", this, this.model, p)
            },
            mouseleave: function(p) {
                this.trigger("leave", this, this.model, p)
            },
            "mouseenter a.customize": function(p) {
                this.sound("hover");
                this.trigger("customize:enter", this, this.model, p)
            },
            "mouseleave a.customize": function(p) {
                this.trigger("customize:leave", this, this.model, p)
            }
        },
        options: {
            showName: true,
            showIcons: true,
            showAdditional: true,
            showLock: true,
            itemSize: "min",
            live: true
        },
        initialize: function h() {
            n.bindAll(this);
            if (this.options.live) {
                this.model.bind("change", this._onChange)
            }
            this.collection = this.model.collection;
            this.collection.bind("purchase:start", this._onPurchaseStart);
            this.collection.bind("purchase:end", this._onPurchaseEnd)
        },
        destroy: function c() {
            this.model.unbind("change", this.render, this);
            this.collection.unbind("purchase:start", this._onPurchaseStart, this);
            this.collection.unbind("purchase:end", this._onPurchaseEnd, this);
            return this
        },
        _onPurchaseStart: function e(p) {
            p = this.collection.get(p);
            if (p && (p.id === this.model.id || n.indexOf(n.values(this.model.get("attachments") || {}), p.id) !== -1)) {
                this.$el.addClass("loading")
            }
        },
        _onPurchaseEnd: function m(p) {
            p = this.collection.get(p);
            if (p && (p.id === this.model.id || n.indexOf(n.values(this.model.get("attachments") || {}), p.id) !== -1)) {
                this.render()
            }
        },
        _onChange: function b() {
            var p = ["attachments", "expired", "owned", "usecount", "invalidDependency"],
                q = n.some(p, function(s) {
                    return this.model.hasChanged(s)
                }, this),
                r = this.model.hasChanged("equippedSlot");
            if (this.model.hasChanged("equippedSlot")) {
                r = (!n.isNumber(this.model.previous("equippedSlot")) || !this.model.isEquipped())
            }
            if (q || r) {
                this.render()
            }
        },
        dragHelper: function(p) {
            var q = this.make("div", {
                "class": "weapon-draghelper"
            });
            this.model.composeImage("med", function(s, v) {
                var u = new Image(),
                    r = new Image();
                u.width = r.width = o.imageSize.med.width;
                u.height = r.height = o.imageSize.med.height;
                u.ondragstart = r.ondragstart = function() {
                    return false
                };
                u.src = s;
                r.src = v;
                r.className = "mask";
                q.appendChild(u);
                q.appendChild(r)
            });
            return d(q)
        },
        renderImage: function g() {
            var r = o.imageSize[this.options.itemSize].width,
                p = o.imageSize[this.options.itemSize].height;
            if (this.options.itemSize === "min" && this.model.get("validationGroup") === "primary" && this.model.get("category") !== "shotgun") {
                r = 90;
                p = 40
            }
            if (!this.model.hasComposedImage(this.options.itemSize)) {
                this.$el.addClass("loading")
            }
            this.model.composeImage(this.options.itemSize, n.bind(function q(s, u) {
                this.image.src = s;
                this.image.width = r;
                this.image.height = p;
                if (this.silhouette && u) {
                    this.silhouette.src = u;
                    this.silhouette.width = r;
                    this.silhouette.height = p
                }
                this.$el.removeClass("loading")
            }, this));
            return this
        },
        renderLock: function j() {
            var u = this.model.get("lockType"),
                v = this.model.get("lockCriteria"),
                r = this.make("div", {
                    "class": "lock " + u
                }),
                s = o.imageFolder + "game/item-lock-progress.png",
                q = this.model.get("lockProgress"),
                p = f.progressCircle(s, q, {
                    width: 56,
                    height: 56,
                    lineWidth: 8,
                    duration: 500
                });
            r.appendChild(this.make("span", {
                "class": "type"
            }, u));
            r.appendChild(this.make("span", {
                "class": "key"
            }, v));
            r.appendChild(p);
            this.el.appendChild(r);
            return this
        },
        render: function a() {
            var q = this.$('<div class="bar" />'),
                p = this.model.get("usecount");
            this.$el.attr("item-id", this.model.id);
            this.$el.addClass(this.model.get("category") + " " + this.model.get("validationGroup"));
            if (this.model.isEquipped()) {
                this.$el.addClass("equipped")
            }
            if (this.options.showIcons) {
                if (this.model.isRented()) {
                    this.$el.addClass("rented");
                    q.append('<span class="exclaim timer">?</span>')
                } else {
                    if (this.model.isExpired()) {
                        this.$el.addClass("expired");
                        q.append('<span class="exclaim">!</span>')
                    } else {
                        if (this.model.isConsumable() && this.model.has("usecount")) {
                            if (p === 0) {
                                this.$el.addClass("uses-empty");
                                q.append('<span class="exclaim">!</span>')
                            } else {
                                if (p < 10) {
                                    this.$el.addClass("uses-low");
                                    q.append('<span class="warn">' + p + "</span>")
                                } else {
                                    q.append('<span class="normal">' + p + "</span>")
                                }
                            }
                        } else {
                            if (this.model.hasInvalidAttachments()) {
                                this.$el.addClass("invalid");
                                q.append('<span class="exclaim">!</span>')
                            }
                        }
                    }
                }
                if (this.model.isCustomizable()) {
                    this.$el.addClass("customizable");
                    this.$el.append('<a href="#customize" class="icon customize" />')
                } else {
                    if (this.model.isBoostable()) {
                        this.$el.addClass("boostable");
                        this.$el.append('<a href="#boost" class="icon boost" />')
                    }
                }
                if (this.model.isLocked()) {
                    if (!this.model.isOwned()) {
                        this.$el.addClass("locked");
                        if (this.options.showLock) {
                            this.renderLock()
                        }
                    }
                    if (this.model.get("offers").hasUnlockOffers()) {
                        this.$el.append('<a href="#unlock" class="icon unlock" />')
                    } else {
                        this.$el.append('<a href="#lock" class="icon lock" />')
                    }
                } else {
                    if (this.model.isBuyable()) {
                        this.$el.append('<a href="#buy" class="icon buy" />')
                    } else {
                        if (this.model.isTrainable()) {
                            this.$el.append('<a href="#train" class="icon train" />')
                        }
                    }
                }
            }
            if (this.options.showAdditional) {
                if (this.model.isCustomizable()) {
                    this.createView(k.View.WeaponSlots, {
                        container: this.el,
                        model: this.model
                    }).render().attach()
                }
                if (this.model.isPromoted()) {
                    this.el.appendChild(this.make("span", {
                        "class": "promotion " + this.model.get("promotionType")
                    }, this.model.get("promotionLabel")))
                }
            }
            if (this.options.showName) {
                q.append('<span class="name">' + this.model.get("name") + "</span>");
                q.append('<span class="category">' + this.model.get("categoryname") + "</span>");
                q.appendTo(this.el)
            }
            if (this.options.itemSize === "med" && (!this.model.isLocked() || this.model.isOwned() || this.model.isExpired())) {
                this.silhouette = this.make("img", {
                    "class": "silhouette",
                    width: 1,
                    height: 1,
                    src: o.imageFolder + "game/1x1-transparent.png"
                });
                this.el.appendChild(this.silhouette);
                this.silhouette.ondragstart = function() {
                    return false
                }
            }
            this.image = this.make("img", {
                "class": "item",
                width: 1,
                height: 1,
                src: o.imageFolder + "game/1x1-transparent.png"
            });
            this.el.appendChild(this.image);
            if (this.model.isLocked()) {
                this.image.ondragstart = function() {
                    return false
                }
            }
            this.renderImage()
        }
    })
}(this));
APP.task("weapons", ["items"], function taskWeapons(g) {
    var m = APP.win,
        i = APP.$,
        p = APP._,
        j = APP.ns("weapons"),
        l = APP.ns("items"),
        c = j.$el = i("<div>").addClass("main main_weapons page hidden loading").appendTo("#frontend"),
        n = j.$panelLeft = i("<div>").addClass("page-panel left").appendTo(c),
        f = j.$panelRight = i("<div>").addClass("page-panel right").appendTo(c),
        k = j.collection = l.collection.by("itemType", "weapon"),
        e = k.at(0).id,
        o = j.getSelected = function o() {
            return e
        },
        d = j.attachmentTooltip = new APP.View.AttachmentTooltip().attach();
    d.bind("render", function h() {
        d.$("dl dt, dl dd").renderText(true);
        d.$("h1, h2, h3, p, div.stats, span.currency, span.text").renderText()
    });
    j.bind("select", function(q) {
        e = j.collection.get(q);
        l.collection.setSelected("weapon", e)
    });
    l.collection.bind("select:weapon", function b(q) {
        if (q !== e) {
            j.trigger("select", q)
        }
    });
    k.bind("purchase:end", function(q) {
        APP.navigate("/weapons/" + q.id, true)
    });
    if (!k.filterBy({
            validationGroup: "primary"
        }).some(function(q) {
            if (q.isEquipped()) {
                e = q;
                return true
            }
        })) {
        e = k.filterBy({
            validationGroup: "primary"
        }).at(0)
    }
    j.once("initialized", function a() {
        j.$el.removeClass("loading")
    });
    g()
});
APP.task("weapons.list", ["weapons", "sidis", "store"], function taskWeaponsList(q) {
    var F = APP.doc,
        i = APP.$,
        C = APP._,
        D = APP.namespace("weapons"),
        p = APP.namespace("store"),
        z = APP.namespace("items"),
        u = D.$panelRight,
        m = D.mainTabs = new APP.View.Tabs({
            container: u,
            className: "main-tabs",
            tabs: [{
                text: APP.sidis.trans("WEB_GAME_WEAPONS_TAB_STORE"),
                filter: "buyable"
            }, {
                text: APP.sidis.trans("WEB_GAME_WEAPONS_TAB_INVENTORY"),
                filter: "owned"
            }]
        }).attach().render(),
        s = i("<div>").addClass("menu-bar").appendTo(u),
        j = D.categoryTabs = new APP.View.Tabs({
            container: s,
            className: "category-tabs"
        }).attach(),
        b = {},
        a = 0,
        c = [0, 0, 0],
        y = D.list = new APP.View.ItemList({
            container: u,
            className: "selectable-list",
            collection: z.collection,
            viewClass: APP.View.WeaponItem,
            viewOptions: {
                itemSize: "med"
            },
            filter: {
                itemType: "weapon"
            },
            selectedClassName: "selected"
        }).attach(),
        e = new APP.View.Tooltip({
            className: "customize-tooltip",
            html: "<p>" + APP.sidis.trans("WEB_GAME_CLICK_TO_CUSTOMIZE") + "</p>"
        }).render().attach();
    m.bind("select", function k(L, M) {
        b = {
            itemType: "weapon"
        };
        b[M.filter] = true;
        var J = C.unique(z.collection.filterBy(b).pluck("category")),
            I = ["assault_rifle", "sniper_rifle", "lmg", "smg", "shotgun", "pistol", "gadget", "melee"],
            K = [{
                text: APP.sidis.trans("WEB_GAME_ITEM_CATEGORY_ALL"),
                category: "all"
            }],
            H = I.length,
            G;
        for (G = 0; G < H; G += 1) {
            if (C.indexOf(J, I[G]) !== -1) {
                K.push({
                    text: APP.sidis.trans("WEB_GAME_ITEM_CATEGORY_" + I[G].toUpperCase()),
                    category: I[G]
                })
            }
        }
        a = L;
        j.options.tabs = K;
        j.render().select(c[a])
    });
    j.bind("select", function B(G, H) {
        if (H) {
            if (H.category === "all") {
                delete b.category
            } else {
                b.category = H.category
            }
            c[a] = G;
            y.filterCollection(b).render()
        }
    });
    y.dragOptions.containment = [-158, 0, 882, 704];
    y.dragOptions.cursorAt = {
        left: 158,
        top: 77
    };
    y.$("div.bar span").renderText(true);
    y.bind("render", function d() {
        y.$("div.bar span, span.usecount, div.lock span, span.promotion").renderText(true)
    });
    y.bind("item:render", function d(G) {
        G.$("div.bar span, span.usecount, div.lock span, span.promotion").renderText(true)
    });
    m.$("a").renderText({
        hover: true
    });
    m.bind("select", function(H, I, G) {
        m.$("a").renderText({
            hover: true
        })
    });
    j.bind("select", function(H, I, G) {
        j.$("a").renderText({
            hover: true
        })
    });
    y.bind("select", function o(G, H) {
        y.scrollTo(H)
    });
    y.bind("item:click", function x(G, H) {
        D.trigger("select", H)
    });
    y.bind("item:buy", function r(G, H) {
        p.trigger("buy", H)
    });
    y.bind("item:customize", function h(G, H) {
        D.trigger("customize", H)
    });
    D.bind("select", function A(G) {
        y.select(G)
    });
    y.bind("item:buy:enter", function f(G, H, I) {
        z.tooltip.renderModelAndShow(H, I.currentTarget, {
            offers: true
        })
    });
    y.bind("item:buy:leave", function v() {
        z.tooltip.hide()
    });
    y.bind("item:exclaim:enter", function g(G, H, I) {
        z.tooltip.renderModelAndShow(H, I.currentTarget, {
            time: true,
            invalid: true
        })
    });
    y.bind("item:exclaim:leave", function w() {
        z.tooltip.hide()
    });
    y.bind("item:customize:enter", function E(G, H, I) {
        e.show(I.currentTarget)
    });
    y.bind("item:customize:leave", function n() {
        e.hide()
    });
    D.initialize(function l(G) {
        y.once("render", G);
        m.select(0)
    });
    q()
});
APP.task("weapons.routes", ["weapons.list", "weapons.info", "weapons.customize"], function taskWeaponsRoutes(d) {
    var h = APP.win,
        e = APP.$,
        j = APP._,
        f = APP.ns("weapons"),
        g = APP.ns("items");
    APP.bind("page:weapons", function c(m, l) {
        if (m !== "weapons") {
            APP.ns("dock").change("weapons");
            h.dontUpdateDoll = true;
            h.hideDoll()
        }
        f.run(function() {
            var n;
            if (l.tab) {
                f.mainTabs.select(l.tab);
                if (l.categoryTab) {
                    f.categoryTabs.select(l.categoryTab)
                }
            } else {
                if (l.id) {
                    n = g.collection.get(l.id);
                    if (n.isOwned()) {
                        f.mainTabs.select(1)
                    } else {
                        f.mainTabs.select(0)
                    }
                    f.categoryTabs.select(0);
                    f.trigger("select", n);
                    if (l.customize) {
                        f.trigger("customize", n)
                    }
                }
            }
        })
    });
    APP.route("weapons", "weapons", function i() {
        APP.page("weapons")
    });
    APP.route("weapons/:tab", "weapons-tab", function k(l) {
        APP.page("weapons", {
            tab: l
        })
    });
    APP.route("weapons/:tab/:categorytab", "weapons-categorytab", function k(m, l) {
        APP.page("weapons", {
            tab: m,
            categoryTab: l
        })
    });
    APP.route(/^weapons\/([\d]+)$/, "weapons-id", function a(n) {
        var m = g.collection.get(n),
            l;
        if (m && m.isType("weapon")) {
            l = "/weapons/" + m.id + "/" + m.get("name").toLowerCase().replace(/([\s])+/g, "-");
            APP.navigate(l);
            APP.page("weapons", {
                id: n
            })
        }
    });
    APP.route("/weapons/customize/:id", "weapons-id", function b(n) {
        var m = g.collection.get(n),
            l;
        if (m && m.isType("weapon")) {
            APP.page("weapons", {
                id: n,
                customize: m.isCustomizable()
            })
        }
    });
    d()
});
APP.task("weapons.info", ["weapons.list"], function taskWeaponsInfo(c) {
    var e = APP.$,
        j = APP._,
        f = APP.namespace("weapons"),
        i = APP.namespace("store"),
        g = APP.namespace("items"),
        h;
    g.collection.bind("remove", function b(k) {
        if (f.getSelected() === k.id) {
            f.trigger("select", f.list._currentCollection.at(0))
        }
    });
    f.bind("select", function d(m) {
        m = g.collection.get(m);
        if (h && h.model.id !== m.id) {
            h.destroy();
            h = f.info = null
        }
        if (!h) {
            h = f.info = new APP.View.WeaponInfo({
                model: m,
                container: f.$panelLeft
            }).attach();
            h.bind("render", function l() {
                h.$("div.stat-title, div.prices, div.mods span, div.lock span").renderText(true);
                h.$("h2 span").renderText();
                h.$("a.info-button, a.button-view").renderText({
                    hover: true,
                    separate: "none"
                })
            });
            h.bind("list:mouse:enter", function(n, o, p) {
                g.tooltip.renderModelAndShow(o, p.currentTarget, {
                    name: true,
                    stats: true,
                    offers: true,
                    time: true,
                    invalid: true
                })
            });
            h.bind("list:mouse:leave", function() {
                g.tooltip.hide()
            });
            h.bind("buy", function k(n, o) {
                i.trigger("buy", o)
            });
            h.bind("list:buy", function k(n, o) {
                i.trigger("buy", o)
            });
            h.bind("customize", function k(n, o) {
                f.trigger("customize", o)
            })
        }
        h.render()
    });
    f.once("initialized", function a() {
        f.trigger("select", f.getSelected())
    });
    c()
});
APP.task("weapons.customize", ["weapons.customize.positions", "weapons", "store"], function taskWeaponsCustomize(b) {
    var c = APP.$,
        k = APP._,
        i = APP.namespace("store"),
        f = APP.namespace("items"),
        d = APP.namespace("weapons"),
        h = new APP.View.Dialog({
            className: "invalid-attachment-dialog"
        }).attach(),
        g;
    h.bind("button:left", function e() {
        h.hide();
        d.trigger("customize", g.model)
    });
    h.bind("button:right", function j() {
        h.hide()
    });
    h.bind("render", function a() {
        h.$("h2.title, div.body p").renderText();
        h.$("a.button, a.button-view").renderText({
            hover: true,
            hoverables: {
                a: true
            }
        })
    });
    d.bind("customize", function(n) {
        n = f.collection.get(n);
        if (g) {
            g.destroy()
        }
        g = d.customizationView = new APP.View.WeaponCustomize({
            model: n,
            getSlotPositions: d.getSlotPositions
        });
        g.bind("list:mouse:enter", function(r, s, u) {
            f.tooltip.renderModelAndShow(s, u.currentTarget, {
                name: true,
                stats: true,
                offers: true,
                time: true,
                invalid: true
            })
        });
        g.bind("list:mouse:leave", function() {
            f.tooltip.hide()
        });
        g.bind("list:buy", function p(r, s) {
            i.trigger("buy", s)
        });
        g.once("attach", function m() {
            var r = "h1, span.currency-credits, span.currency-funds, span.currency, .stats, span.text";
            g.$(r).renderText(true);
            g.$("a.button, a.button-view").renderText({
                hover: true
            });
            g.bind("render", function s() {
                g.$(r).renderText(true);
                g.$("a.button, a.button-view").renderText({
                    hover: true
                })
            });
            g.bind("slot:render", function u() {
                g.$("span.currency, .stats, span.text").renderText(true)
            });
            if (n.isLocked()) {
                g.once("ready", function u() {
                    g.$("div.lock span").renderText(true)
                })
            }
        });
        g.bind("buy", function o(r, u, s) {
            i.trigger("buy", u, s)
        });
        g.bind("detach", function l() {
            var r = APP.ns("game");
            r.giveItems();
            r.saveCustomizations(n)
        });
        g.bind("close", function q(r, s, w) {
            var v, u = w.currentTarget;
            if (!s.isBuyable() && u && u.className.indexOf("close") === -1) {
                s.set({
                    attachments: g.attached
                });
                if (f.collection.validateModelAttachments(s)) {
                    g.detach()
                } else {
                    v = new APP.View.AttachedList({
                        model: s,
                        onlyInvalid: true,
                        showInvalid: true
                    }).render();
                    h.setRenderData({
                        title: APP.sidis.trans("WEB_GAME_INVALID_ATTACHMENT_DIALOG_TITLE"),
                        body: [APP.sidis.trans("WEB_GAME_INVALID_ATTACHMENT_DIALOG_TEXT"), v],
                        buttonLeft: APP.sidis.trans("WEB_GAME_INVALID_ATTACHMENT_DIALOG_FIX_NOW"),
                        buttonRight: APP.sidis.trans("WEB_GAME_INVALID_ATTACHMENT_DIALOG_FIX_LATER")
                    }).render().show()
                }
            }
            g.detach()
        });
        g.render();
        g.attach()
    });
    b()
});
APP.task("weapons.customize.positions", ["items"], function taskWeaponsPositions(d) {
    var e = APP.$,
        j = APP._,
        h = APP.namespace("items"),
        f = APP.namespace("weapons"),
        b = {
            muzzle: 1,
            scope: 2,
            barrel: 3,
            ammo: 4,
            stock: 5,
            texture: 6
        },
        i = {
            1: "muzzle",
            2: "scope",
            3: "barrel",
            4: "ammo",
            5: "stock",
            6: "texture"
        },
        g = f.pos = {
            base: {
                muzzle: {
                    box: [0, 0],
                    start: [200, 100],
                    stop: [300, 25]
                },
                scope: {
                    box: [400, 0],
                    start: [180, 82],
                    stop: [300, 25]
                },
                barrel: {
                    start: [230, 370],
                    stop: [80, 410]
                },
                ammo: {
                    start: [500, 420],
                    stop: [245, 475]
                },
                stock: {
                    start: [800, 380],
                    stop: [755, 455]
                },
                texture: {
                    start: [600, 360],
                    stop: [412, 540]
                }
            }
        },
        a = f.getSlotPositions = function c(n) {
            var m, o;
            if (g.hasOwnProperty(n)) {
                return g[n]
            }
            m = h.collection.get(n);
            if (m) {
                if (g.hasOwnProperty(m.id)) {
                    return g[m.id]
                }
                o = m.get("category");
                if (g.hasOwnProperty(o)) {
                    return g[o]
                }
            }
            return g.base
        },
        l = f.addSlotPosition = function k(m, o, n) {
            if (g.hasOwnProperty(m)) {
                throw new Error('Position for key "' + m + '" already exists!')
            }
            var p = j.extend({}, a(o));
            j.forEach(n || {}, function(q, r) {
                p[r] = j.extend({}, p[r], q)
            });
            g[m] = p;
            return g[m]
        };
    l("assault_rifle", "base", {});
    l(3005, "assault_rifle", {
        scope: {
            box: [380, 0]
        },
        stock: {
            start: [810, 351]
        },
        ammo: {
            start: [513, 405]
        },
        barrel: {
            start: [182, 331]
        }
    });
    l(3001, "assault_rifle", {
        scope: {
            box: [360, 0]
        },
        stock: {
            start: [800, 350]
        },
        ammo: {
            start: [540, 420]
        },
        barrel: {
            start: [230, 325]
        }
    });
    l(3095, 3001, {});
    l(3007, "assault_rifle", {
        scope: {
            box: [380, 0]
        },
        stock: {
            start: [800, 360]
        },
        ammo: {
            start: [550, 406]
        },
        barrel: {
            start: [260, 331]
        }
    });
    l(3096, 3007, {});
    l(3011, "assault_rifle", {
        scope: {
            box: [310, 0]
        },
        stock: {
            start: [800, 360]
        },
        ammo: {
            start: [484, 450]
        },
        barrel: {
            start: [230, 340]
        }
    });
    l(3093, 3011, {});
    l(3046, "assault_rifle", {
        scope: {
            box: [250, 0]
        },
        stock: {
            start: [790, 370]
        },
        ammo: {
            start: [666, 440]
        },
        barrel: {
            start: [285, 338]
        }
    });
    l(3094, 3046, {});
    l(3062, "assault_rifle", {
        scope: {
            box: [340, 0]
        },
        stock: {
            start: [830, 345]
        },
        ammo: {
            start: [530, 440]
        },
        barrel: {
            start: [250, 325]
        }
    });
    l(3097, 3062, {});
    l(3067, "assault_rifle", {
        scope: {
            box: [360, 0]
        },
        stock: {
            start: [820, 360]
        },
        ammo: {
            start: [570, 420]
        },
        barrel: {
            start: [260, 326]
        }
    });
    l(3098, 3067, {});
    l(3071, "assault_rifle", {
        scope: {
            box: [174, 0]
        },
        stock: {
            start: [780, 340]
        },
        ammo: {
            start: [488, 450]
        },
        barrel: {
            start: [216, 333]
        }
    });
    l(3099, 3071, {});
    l(3075, "assault_rifle", {
        scope: {
            box: [330, 0]
        },
        stock: {
            start: [760, 360]
        },
        ammo: {
            start: [512, 452]
        },
        barrel: {
            start: [262, 355]
        }
    });
    l(3100, 3075, {});
    l(3110, "assault_rifle", {
        scope: {
            box: [380, 0]
        },
        stock: {
            start: [790, 369]
        },
        ammo: {
            stop: [225, 475]
        },
        barrel: {
            start: [203, 329]
        }
    });
    l(3114, "assault_rifle", {
        scope: {
            box: [225, 0]
        },
        stock: {
            start: [730, 388]
        },
        ammo: {
            start: [629, 468]
        },
        barrel: {
            start: [230, 341]
        }
    });
    l("lmg", "base", {});
    l(3003, "lmg", {
        scope: {
            box: [345, 0]
        },
        stock: {
            start: [820, 370]
        },
        ammo: {
            start: [516, 420]
        },
        barrel: {
            start: [248, 343]
        }
    });
    l(3074, 3003, {});
    l(3013, "lmg", {
        scope: {
            box: [365, 0]
        },
        stock: {
            start: [800, 350]
        },
        ammo: {
            start: [586, 413]
        },
        barrel: {
            start: [310, 350]
        }
    });
    l(3014, "lmg", {
        stock: {
            start: [836, 366]
        },
        ammo: {
            start: [553, 445]
        },
        barrel: {
            start: [310, 344]
        }
    });
    l(3080, 3014, {});
    l(3015, "lmg", {
        scope: {
            box: [435, 0],
            stop: [-100, 25]
        },
        stock: {
            start: [830, 360]
        },
        ammo: {
            start: [598, 402]
        },
        barrel: {
            start: [270, 352]
        }
    });
    l(3079, 3015, {});
    l(3048, "lmg", {
        stock: {
            start: [840, 357]
        },
        ammo: {
            start: [569, 411]
        },
        barrel: {
            start: [240, 350]
        }
    });
    l(3101, 3048, {});
    l(3063, "lmg", {
        stock: {
            start: [850, 347]
        },
        ammo: {
            start: [562, 387]
        },
        barrel: {
            start: [230, 332]
        }
    });
    l(3081, 3063, {});
    l(3068, "lmg", {
        scope: {
            box: [475, 0],
            stop: [-100, 25]
        },
        stock: {
            start: [871, 364]
        },
        ammo: {
            start: [614, 437]
        },
        barrel: {
            start: [279, 331]
        }
    });
    l(3082, 3068, {});
    l(3072, "lmg", {
        scope: {
            box: [350, 0]
        },
        stock: {
            start: [840, 357]
        },
        ammo: {
            start: [530, 435]
        },
        barrel: {
            start: [240, 334]
        }
    });
    l(3083, 3072, {});
    l(3076, "lmg", {
        scope: {
            box: [440, 0],
            stop: [-140, 25]
        },
        stock: {
            start: [820, 360]
        },
        ammo: {
            start: [582, 414]
        },
        barrel: {
            start: [217, 358]
        }
    });
    l(3084, 3076, {});
    l(3113, "lmg", {
        scope: {
            box: [430, 0],
            stop: [-170, 25]
        },
        stock: {
            start: [870, 395]
        },
        ammo: {
            start: [584, 442]
        },
        barrel: {
            start: [250, 341]
        }
    });
    l(3116, "lmg", {
        scope: {
            box: [216, 0]
        },
        stock: {
            start: [817, 342]
        },
        ammo: {
            start: [530, 470]
        },
        barrel: {
            start: [190, 332]
        }
    });
    l("smg", "base", {
        scope: {
            box: [325, 0]
        }
    });
    l(3018, "smg", {
        scope: {
            box: [353, 0]
        },
        ammo: {
            start: [533, 410]
        },
        barrel: {
            start: [329, 331]
        },
        stock: {
            start: [776, 375]
        }
    });
    l(3064, "smg", {
        ammo: {
            start: [560, 400]
        },
        barrel: {
            start: [310, 334]
        },
        stock: {
            start: [711, 380]
        }
    });
    l(3089, 3064, {});
    l(3078, "smg", {
        scope: {
            box: [395, 0]
        },
        ammo: {
            start: [525, 460]
        },
        barrel: {
            start: [295, 358]
        },
        stock: {
            start: [695, 335]
        }
    });
    l(3092, 3078, {});
    l(3016, "smg", {
        scope: {
            box: [245, 0]
        },
        ammo: {
            start: [536, 430]
        },
        barrel: {
            start: [317, 344]
        },
        stock: {
            start: [750, 334]
        }
    });
    l(3086, 3016, {});
    l(3047, "smg", {
        scope: {
            box: [295, 0]
        },
        ammo: {
            start: [461, 456]
        },
        barrel: {
            start: [240, 348]
        }
    });
    l(3088, 3047, {});
    l(3069, "smg", {
        scope: {
            box: [365, 0]
        },
        ammo: {
            start: [478, 435]
        },
        barrel: {
            start: [242, 333]
        },
        stock: {
            start: [800, 367]
        }
    });
    l(3090, 3069, {});
    l(3073, "smg", {
        scope: {
            box: [305, 0]
        },
        ammo: {
            start: [482, 420]
        },
        barrel: {
            start: [350, 326]
        },
        stock: {
            start: [770, 363]
        }
    });
    l(3091, 3073, {});
    l(3017, "smg", {
        scope: {
            box: [118, 0]
        },
        ammo: {
            start: [544, 357]
        },
        barrel: {
            start: [230, 388]
        },
        stock: {
            start: [730, 407]
        }
    });
    l(3087, 3017, {});
    l(3012, "smg", {
        scope: {
            box: [295, 0]
        },
        ammo: {
            start: [460, 450],
            stop: [185, 475]
        },
        barrel: {
            start: [303, 343]
        },
        stock: {
            start: [790, 368]
        },
        texture: {
            stop: [490, 540]
        }
    });
    l(3085, 3012, {});
    l(3112, "smg", {
        scope: {
            box: [355, 0]
        },
        ammo: {
            start: [390, 393]
        },
        barrel: {
            start: [217, 349]
        }
    });
    l(3117, "smg", {
        scope: {
            box: [134, 0],
            stop: [420, 25]
        },
        stock: {
            start: [810, 391]
        },
        ammo: {
            start: [660, 476],
            stop: [235, 485]
        },
        barrel: {
            start: [210, 356],
            stop: [60, 430]
        }
    });
    l("sniper", "base", {});
    l(3004, "sniper", {
        scope: {
            box: [440, 0],
            stop: [-195, 25]
        },
        ammo: {
            start: [637, 407]
        },
        barrel: {
            start: [270, 339]
        },
        stock: {
            start: [840, 405]
        }
    });
    l(3066, "sniper", {
        scope: {
            box: [320, 0]
        },
        ammo: {
            start: [538, 430]
        },
        barrel: {
            start: [350, 342]
        },
        stock: {
            start: [780, 370]
        }
    });
    l(3107, 3066, {});
    l(3070, "sniper", {
        scope: {
            box: [353, 0]
        },
        ammo: {
            start: [526, 414]
        },
        barrel: {
            start: [290, 358]
        },
        stock: {
            start: [750, 407]
        }
    });
    l(3108, 3070, {});
    l(3077, "sniper", {
        scope: {
            box: [344, 0]
        },
        ammo: {
            start: [609, 353]
        },
        barrel: {
            start: [230, 334]
        }
    });
    l(3109, 3077, {});
    l(3023, "sniper", {
        ammo: {
            start: [616, 413]
        },
        barrel: {
            start: [230, 365]
        },
        stock: {
            start: [820, 397]
        }
    });
    l(3104, 3023, {});
    l(3022, "sniper", {
        scope: {
            box: [290, 0]
        },
        ammo: {
            start: [792, 425]
        },
        barrel: {
            start: [285, 354]
        },
        stock: {
            start: [888, 352],
            stop: [700, 500]
        }
    });
    l(3102, 3022, {});
    l(3024, "sniper", {
        scope: {
            box: [384, 0]
        },
        ammo: {
            start: [640, 352]
        },
        barrel: {
            start: [230, 355]
        },
        stock: {
            start: [868, 402]
        }
    });
    l(3103, 3024, {});
    l(3065, "sniper", {
        ammo: {
            start: [620, 430]
        },
        barrel: {
            start: [309, 358]
        },
        stock: {
            start: [913, 396]
        }
    });
    l(3106, 3065, {});
    l(3045, "sniper", {
        scope: {
            box: [330, 0]
        },
        ammo: {
            start: [679, 403]
        },
        barrel: {
            start: [213, 358]
        },
        stock: {
            start: [820, 370]
        }
    });
    l(3105, 3045, {});
    l(3111, "sniper", {
        scope: {
            box: [390, 0]
        },
        ammo: {
            start: [628, 406]
        },
        barrel: {
            start: [270, 342]
        },
        stock: {
            start: [860, 380],
            stop: [755, 475]
        }
    });
    d()
});
(function createServerModel(u) {
    if (typeof require !== "undefined") {
        if (!u.APP) {
            u.APP = require("./../common/app")
        }
        if (!u.APP.Model) {
            u.APP.Model = require("./../common/model")
        }
    }
    var n = u.APP,
        e = n.win,
        l = n.Model.prototype,
        v = n._,
        h = n.namespace("config"),
        m = n.namespace("servers"),
        g = v.extend({}, n.Backbone.Events);
    if (e.matchmaking) {
        e.onPingResponse = function(x, w) {
            n.trigger("ping", x, w);
            n.trigger("ping:" + x, x, w)
        };
        e.matchmaking.addEventHandler("onPingResponse", "onPingResponse")
    }
    if (e.bookmarks) {
        e.onServerAdded = function(w, x) {
            g.trigger("added:" + x, w)
        };
        e.bookmarks.addEventHandler("onServerAdded", "onServerAdded");
        e.onServerRemoved = function(w, x) {
            g.trigger("removed:" + x, w)
        };
        e.bookmarks.addEventHandler("onServerRemoved", "onServerRemoved")
    }
    n.Model.Server = n.Model.extend({
        normalizeKeys: {
            persistentId: "id"
        },
        defaults: {
            gameId: null,
            name: "",
            mapList: [],
            mapIndex: null,
            roundsPerMap: null,
            currentRound: null,
            gameMode: null,
            ranked: false,
            hasPassword: false,
            players: null,
            capacity: null,
            pingSite: null,
            ip: null,
            online: false,
            isVIP: false,
            bookmarked: false,
            currentMap: null,
            currentMapName: null,
            currentGameMode: null,
            nextMap: null,
            nextGameMode: null,
            ping: null,
            pingState: -1,
            gameRoster: []
        },
        schema: {
            name: "string",
            mapIndex: "number",
            roundsPerMap: "number",
            currentRound: "number",
            gameMode: "number",
            players: "number",
            capacity: "number",
            currentMap: "number",
            currentGameMode: "number",
            nextMap: "number",
            nextGameMode: "number",
            ping: "number",
            pingState: "number",
            ranked: "bool",
            hasPassword: "bool",
            online: "bool",
            isVIP: "bool",
            bookmarked: "bool"
        },
        initialize: function f() {
            this.bind("change:currentMap", this._setCurrentMapName, this);
            this.bind("change:mapList", this._formatMapList, this);
            this.bind("change:online", this._checkOffline, this);
            this.bind("change:mapIndex", this._formatMapList, this);
            this.bind("change:ping", this._onChangePing, this);
            this.bind("remove", this._onRemove, this);
            this._maps = this.constructor.maps;
            this._gameModes = this.constructor.gameModes;
            g.bind("added:" + this.id, this._onBookmarkAdded, this);
            g.bind("removed:" + this.id, this._onBookmarkRemoved, this);
            this._setCurrentMapName();
            this._formatMapList();
            this._checkOffline()
        },
        _onChangePing: function i() {
            if (this.get("ping") < 0) {
                this.set({
                    ping: 9999
                }, {
                    silent: true
                })
            }
        },
        _onRemove: function d() {
            if (!(this.collection instanceof n.Collection)) {
                g.unbind("added:" + this.id, this._onBookmarkAdded);
                g.unbind("removed:" + this.id, this._onBookmarkRemoved)
            }
        },
        _onBookmarkAdded: function o(w) {
            this.set({
                bookmarked: true
            })
        },
        _onBookmarkRemoved: function k(w) {
            this.set({
                bookmarked: false
            })
        },
        _setCurrentMapName: function a() {
            var w = this.get("currentMap");
            if (w) {
                this.set("currentMapName", n.sidis.trans(this._maps[w]), {
                    silent: true
                })
            }
        },
        _formatMapList: function j() {
            var y = this.get("mapList"),
                w = this.get("mapIndex"),
                x = v.map(y, function(D, B) {
                    var z, A, C;
                    if (v.isString(D)) {
                        D = D.split(":");
                        A = D[0];
                        C = D[1];
                        z = {
                            id: "round-" + B,
                            map_id: A,
                            name: n.sidis.trans(this._maps[A]),
                            gameModeId: C,
                            gameModeName: n.sidis.trans(this._gameModes[C]),
                            order: B
                        }
                    } else {
                        z = D
                    }
                    z.current = (w === B);
                    return z
                }, this);
            this.set("mapList", x, {
                silent: true
            })
        },
        _checkOffline: function r() {
            if (!this.get("online")) {
                this.set("pingState", -1, {
                    silent: true
                })
            }
        },
        url: function s() {
            if (e.game) {
                return h.serverInfoUrl + "?persistentId=" + this.id
            }
            return "/static/server-info.json"
        },
        addBookmark: function p() {
            if (e.bookmarks) {
                e.bookmarks.add(this.id)
            }
        },
        removeBookmark: function c() {
            if (e.bookmarks) {
                e.bookmarks.remove(this.id)
            }
        },
        ping: function q() {
            var w = this.get("ip");
            n.once("ping:" + w, function(y, x) {
                this.set("ping", x)
            }, this);
            this.set({
                ping: 9999
            });
            if (e.matchmaking) {
                e.matchmaking.pingGameServers(JSON.stringify([w]))
            } else {
                v.delay(function() {
                    var x = Math.floor(Math.random() * 300);
                    n.trigger("ping", w, x);
                    n.trigger("ping:" + w, w, x)
                }, n.randomInt(500, 1000))
            }
        },
        parse: function b(w) {
            if (w && w.data && w.data.hasOwnProperty("gameRoster")) {
                w.data.gameRoster = v.values(w.data.gameRoster);
                return w.data
            }
            return w
        }
    }, {
        maps: {
            1: "WEB_GAME_SERVERBROWSER_MAPS_1",
            2: "WEB_GAME_SERVERBROWSER_MAPS_2",
            3: "WEB_GAME_SERVERBROWSER_MAPS_3",
            4: "WEB_GAME_SERVERBROWSER_MAPS_4",
            5: "WEB_GAME_SERVERBROWSER_MAPS_5",
            6: "WEB_GAME_SERVERBROWSER_MAPS_6",
            7: "WEB_GAME_SERVERBROWSER_MAPS_7",
            8: "WEB_GAME_SERVERBROWSER_MAPS_8"
        },
        gameModes: {
            1: "WEB_GAME_SERVERBROWSER_MODE_ASSAULT"
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = n.Model.Server
    }
}(this));
(function createPlayerModel(d) {
    if (!d.APP && (typeof require !== "undefined")) {
        d.APP = require("./../common/app")
    }
    var c = d.APP,
        b = c.Model.prototype,
        a = c._;
    c.Model.Player = c.Model.extend({
        defaults: {
            kit: null,
            level: null,
            name: null,
            state: null
        },
        schema: {
            kit: "number",
            level: "number"
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = c.Model.Item
    }
}(this));
(function createFilterModel(f) {
    if (!f.APP && (typeof require !== "undefined")) {
        f.APP = require("./../common/app")
    }
    var d = f.APP,
        c = d.Model.prototype,
        b = d._,
        e = {
            name: "",
            tab: "browser",
            hideEmpty: true,
            hideFull: true,
            showUnranked: false,
            hidePwd: false,
            onlyVip: false,
            geo: "gva",
            maps: [],
            gamemodes: [],
            onlyVipBookmarked: false,
            showOffline: false
        };
    d.Model.ServerFilter = d.Model.extend({
        schema: {
            hideEmpty: "bool",
            hideFull: "bool",
            showUnranked: "bool",
            hidePwd: "bool",
            onlyVip: "bool",
            onlyVipBookmarked: "bool",
            showOffline: "bool"
        },
        initialize: function a(g, h) {
            var i, j = d.ns("config");
            if (h.storageKey) {
                i = d.win.sessionStorage.getItem(h.storageKey);
                if (i) {
                    this.set(JSON.parse(i), {
                        silent: true
                    })
                }
                this.bind("change", function(k) {
                    d.win.sessionStorage.setItem(h.storageKey, JSON.stringify(k.toJSON()))
                })
            }
            this.bind("change:showUnranked", function(k) {
                if (!k.get("showUnranked")) {
                    k.set({
                        hidePwd: false
                    }, {
                        silent: true
                    })
                }
            })
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = d.Model.Item
    }
}(this));
(function(i) {
    if (!i.APP && (typeof require !== "undefined")) {
        i.APP = require("./../common/app")
    }
    if (!i.APP.Model && (typeof require !== "undefined")) {
        i.APP.Collection = require("./../common/collection")
    }
    if (!i.APP.Model.Server && (typeof require !== "undefined")) {
        i.APP.Model.Server = require("./model.server")
    }
    var k = i.APP,
        g = k.win,
        m = k._,
        f = k.$,
        o = k.namespace("config");
    k.Collection.Servers = k.Collection.extend({
        _selected: null,
        model: k.Model.Server,
        initialize: function n(s, q) {
            q = q || {};
            if (q.handlePing) {
                k.bind("ping", function r(y, w) {
                    var v = {
                            ping: w,
                            pingState: 1
                        },
                        x = this,
                        u = this.filterBy({
                            ip: y
                        });
                    if (u.length !== 0) {
                        u.forEach(function(z) {
                            z.set(v)
                        });
                        x.trigger("ping", x)
                    }
                }, this)
            }
            this.bind("ping", this._onPing, this)
        },
        _onPing: function() {
            var q = this.some(function(u) {
                    return u.get("pingState") === 0
                }),
                s, r;
            if (!q && g.sessionStorage) {
                s = this.url();
                r = this.at(0).collection.toJSON();
                g.sessionStorage.setItem(s, JSON.stringify(r))
            }
        },
        url: function c() {
            if (g.game) {
                return o.serverListUrl + "?gameVersion=" + o.gameVersion
            }
            return "/static/servers.json"
        },
        parse: function d(r, q) {
            if (r && r.hasOwnProperty("data")) {
                return m.values(r.data)
            }
            return r
        },
        ping: function l() {
            var q = this.filterBy({
                    pingState: -1
                }),
                r = q.getIPs();
            q.setAll({
                ping: 9999,
                pingState: 0
            }, {
                silent: true
            });
            if (g.matchmaking) {
                g.matchmaking.pingGameServers(JSON.stringify(r))
            } else {
                m.forEach(r, function(s) {
                    if (s && s.length > 6) {
                        m.delay(function() {
                            var u = Math.floor(Math.random() * 300);
                            k.trigger("ping", s, u)
                        }, k.randomInt(200, 1000))
                    }
                })
            }
            return this
        },
        getIPs: function j() {
            return m.unique(this.pluck("ip"))
        },
        setSelected: function e(q) {
            q = this.get(q);
            this._selected = q;
            this.trigger("select", q);
            return this
        },
        getSelected: function b() {
            return this._selected
        },
        filterByValidator: function a(w, v, s) {
            var u, q, r;
            if (v === "tab") {
                if (w === "bookmarks") {
                    return s.get("bookmarked")
                }
                return true
            }
            if (v === "hidePwd") {
                if (w) {
                    return !s.get("hasPassword")
                }
                return true
            }
            if (v === "hideEmpty") {
                if (w) {
                    return s.get("players") !== 0
                }
                return true
            }
            if (v === "hideFull") {
                if (w) {
                    return s.get("players") !== s.get("capacity")
                }
                return true
            }
            if (v === "showOffline") {
                if (w) {
                    return true
                }
                return s.get("online")
            }
            if (v === "onlyVip") {
                if (w) {
                    return s.get("isVIP")
                }
                return true
            }
            if (v === "showUnranked") {
                if (w) {
                    return true
                }
                return s.get("ranked")
            }
            if (v === "geo") {
                return (w === s.get("pingSite"))
            }
            if (v === "maps") {
                return m.indexOf(w, s.get("currentMap")) !== -1
            }
            if (v === "gamemodes") {
                return m.indexOf(w, s.get("currentGameMode")) !== -1
            }
            if (v === "name") {
                w = (w || "").toLowerCase().trim().split(/[\s]+/);
                r = (s.get("name") || "").toLowerCase();
                for (u = 0, q = w.length; u < q; u += 1) {
                    if (r.indexOf(w[u]) === -1) {
                        return false
                    }
                }
                return true
            }
            if (s.get(v) !== w) {
                return false
            }
            return true
        },
        sync: function h(v, r, q) {
            var u = this.url(),
                s;
            if (v === "read" && this.length === 0 && g.sessionStorage && g.sessionStorage[u]) {
                s = g.sessionStorage.getItem(u);
                if (s) {
                    m.defer(function() {
                        s = JSON.parse(s);
                        q.success(s)
                    });
                    return this
                }
            }
            return k.Backbone.sync.apply(this, arguments)
        },
        reload: function p(q) {
            q = q || {};
            if (!q.silent) {
                this.trigger("reload:before", this)
            }
            var v = this,
                u = this.model;
            f.ajax({
                url: typeof this.url === "function" ? this.url() : this.url,
                dataType: "json",
                cache: false,
                success: function s(y, w, x) {
                    var z = m.map(v.parse(y, x), function(A) {
                        A.ping = null;
                        A.pingState = -1;
                        return A
                    });
                    v.updateOrRemove(z);
                    if (!q.silent) {
                        v.trigger("reload", v);
                        v.trigger("reload:after", v)
                    }
                    if (q.success) {
                        q.success(v)
                    }
                },
                error: function r(y, w, x) {
                    if (q.error) {
                        q.error(v)
                    }
                }
            });
            return this
        }
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = k.Collection.Servers
    }
}(this));
(function(d) {
    if (!d.APP && (typeof require !== "undefined")) {
        d.APP = require("./../common/app")
    }
    if (!d.APP.Model && (typeof require !== "undefined")) {
        d.APP.Collection = require("./../common/collection")
    }
    if (!d.APP.Model.Player && (typeof require !== "undefined")) {
        d.APP.Model.Player = require("./model.player")
    }
    var b = d.APP,
        a = b._,
        c = b.$;
    b.Collection.Players = b.Collection.extend({
        model: b.Model.Player
    });
    if (typeof module !== "undefined" && module.exports) {
        module.exports = b.Collection.Items
    }
}(this));
(function(g) {
    var e = g.APP,
        c = e.View.prototype,
        b = e._;
    e.View.Server = e.View.extend({
        name: "server-view",
        tagName: "tr",
        initialize: function d() {
            this.model.bind("change", this.render, this)
        },
        destroy: function a() {
            this.model.unbind("change", this.render, this);
            return this
        },
        render: function f() {
            this.$el.empty();
            this.$el.attr("class", [this.name, this.className].join(" "));
            if (this.model.get("hasPassword")) {
                this.$el.addClass("pwd")
            }
            if (this.model.get("isVIP")) {
                this.$el.addClass("vip")
            }
            if (this.model.get("ranked")) {
                this.$el.addClass("ranked")
            }
            if (this.model.get("bookmarked")) {
                this.$el.addClass("bookmarked")
            }
            if (this.model.get("online")) {
                this.$el.addClass("online")
            } else {
                this.$el.addClass("offline")
            }
            var h = this.make("td", {
                    "class": "status"
                }),
                j = this.make("td", {
                    "class": "name"
                }),
                m = this.make("td", {
                    "class": "map"
                }, this.model.get("currentMapName")),
                k = this.make("td", {
                    "class": "players"
                }, this.model.get("players") + "/" + this.model.get("capacity")),
                i = this.model.get("ping") || 0,
                n = this.make("td", {
                    "class": "ping"
                }, i + String()),
                l = this.make("td", {
                    "class": "join"
                });
            h.appendChild(this.make("span", {
                "title-tooltip": "Password protected"
            }));
            h.appendChild(this.make("span", {
                "title-tooltip": "VIP"
            }));
            h.appendChild(this.make("span", {
                "title-tooltip": "Ranked"
            }));
            h.appendChild(this.make("span", {
                "title-tooltip": "Bookmarked"
            }));
            j.appendChild(this.make("span", null, this.model.get("name")));
            if (i < 0) {
                n.innerHTML = "999+"
            } else {
                if (i < 50) {
                    n.className += " great"
                } else {
                    if (i < 200) {
                        n.className += " good"
                    } else {
                        if (i < 350) {
                            n.className += " ok"
                        } else {
                            if (i < 999) {
                                n.className += " bad"
                            } else {
                                n.innerHTML = "999+"
                            }
                        }
                    }
                }
            }
            if (this.model.get("online")) {
                l.appendChild(this.make("a", {
                    "class": "join_this_row",
                    "title-tooltip": "Join this server",
                    href: "#connect"
                }, "Join this server"))
            }
            this.el.appendChild(h);
            this.el.appendChild(j);
            this.el.appendChild(m);
            this.el.appendChild(k);
            this.el.appendChild(n);
            this.el.appendChild(l);
            return this
        }
    })
}(this));
(function(d) {
    var b = d.View.prototype,
        a = d._;
    d.View.Player = d.View.TableRow.extend({
        name: "player-view",
        renderCell: function c(e) {
            var f;
            if (e === "kit") {
                f = this.make("td", {
                    "class": e + " kit" + this.model.get(e)
                })
            } else {
                f = this.make("td", {
                    "class": e
                }, this.model.get(e))
            }
            this.el.appendChild(f);
            return f
        }
    })
}(this.APP));
(function(l) {
    var h = l.View.prototype,
        v = l._,
        j = l.ns("servers");
    l.View.ServerFilter = l.View.extend({
        name: "server-filter-view",
        tagName: "div",
        tabName: "browser",
        numberOfServers: 0,
        modelBrowser: null,
        modelBookmarks: null,
        events: {
            "click div.reload_icon:not(.active)": "onClickReload",
            "change input": "onChange",
            "keydown input[type=text]": "onKeyDown",
            "click span.filter-free-reset": "onClickReset",
            "mouseenter .dropdown-filter": "onMouseEnter",
            "mouseleave .dropdown-filter": "onMouseLeave"
        },
        geoValues: ["nrt", "gva", "iad", "sjc"],
        initialize: function p(x) {
            this.modelBrowser = x.modelBrowser;
            this.modelBookmarks = x.modelBookmarks;
            this.numberOfServers = this.collection.filterBy(this.modelBrowser.toJSON()).length;
            this.collection.bind("reload", this._onReloadCollection, this);
            this.modelBrowser.bind("change", this._onChangeBrowser, this);
            this.modelBookmarks.bind("change", this._onChangeBookmarks, this);
            this.bind("tabs:select", this._onTabsSelect, this);
            this.bind("geo:choose", this._onGeoChoose, this)
        },
        destroy: function u() {
            this.collection.unbind("reload", this._onReloadCollection, this);
            this.modelBrowser.unbind("change", this._onChangeBrowser, this);
            this.modelBookmarks.unbind("change", this._onChangeBookmarks, this)
        },
        _onReloadCollection: function n() {
            if (this.tabName === "browser") {
                this.numberOfServers = this.collection.filterBy(this.modelBrowser.toJSON()).length
            } else {
                if (this.tabName === "bookmarks") {
                    this.numberOfServers = this.collection.filterBy(this.modelBookmarks.toJSON()).length
                }
            }
        },
        _onChangeBrowser: function b() {
            var x = this.modelBrowser.toJSON();
            this.numberOfServers = this.collection.filterBy(x).length;
            if (this.modelBrowser.hasChanged("name") || this.modelBrowser.hasChanged("geo")) {
                this.$("p.visible-servers").text(this.numberOfServers + " " + this.trans("WEB_GAME_SERVERBROWSER_FILTER_SERVERS"))
            } else {
                if (!this.modelBrowser.hasChanged("geo")) {
                    this.renderFilterBrowser();
                    this.trigger("render")
                }
            }
            this.trigger("filter", x)
        },
        _onChangeBookmarks: function b() {
            var x = this.modelBookmarks.toJSON();
            this.numberOfServers = this.collection.filterBy(x).length;
            this.renderFilterBookmarks();
            this.trigger("render");
            this.trigger("filter", x)
        },
        _onTabsSelect: function o(x) {
            var y;
            if (x === 0) {
                y = this.modelBrowser.toJSON();
                this.tabName = "browser"
            } else {
                if (x === 1) {
                    y = this.modelBookmarks.toJSON();
                    this.tabName = "bookmarks"
                }
            }
            this.numberOfServers = this.collection.filterBy(y).length;
            this.render();
            this.trigger("filter", y)
        },
        _onGeoChoose: function e(x) {
            var y = this.geoValues[x];
            if (y) {
                this.modelBrowser.set("geo", y)
            }
        },
        onClickReload: function d(y) {
            y.preventDefault();
            this.sound("click", "Clicked reload");
            var x = this.$(y.currentTarget);
            x.addClass("active");
            this.collection.reload({
                success: function(z) {
                    x.removeClass("active")
                },
                error: function() {
                    x.removeClass("active")
                }
            })
        },
        onChange: function q(C) {
            var A = C.currentTarget,
                z = A.name,
                B = A.checked,
                y = {},
                x;
            if (A.disabled) {
                return
            }
            if (this.tabName === "browser") {
                x = this.modelBrowser
            } else {
                if (this.tabName === "bookmarks") {
                    x = this.modelBookmarks
                }
            }
            if (z.substr(0, 4) === "maps") {
                if (B) {
                    B = v.values(x.get("maps"));
                    B.push(parseInt(z.substr(4), 10));
                    y.maps = v.uniq(B)
                } else {
                    y.maps = v.without(x.get("maps"), parseInt(z.substr(4), 10))
                }
            } else {
                if (z === "name" || z === "geo") {
                    y[z] = A.value
                } else {
                    y[z] = B
                }
            }
            x.set(y)
        },
        onMouseEnter: function i(x) {
            this.$(x.currentTarget).addClass("active")
        },
        onMouseLeave: function w(x) {
            this.$(x.currentTarget).removeClass("active")
        },
        onKeyDown: function c(x) {
            var y = this.modelBrowser;
            if (x.keyCode === 13) {
                this.$(".dropdown-filter").removeClass("active");
                return false
            }
            setTimeout(function() {
                var z = x.currentTarget.value;
                y.set({
                    name: z
                })
            }, 0)
        },
        onClickReset: function r(x) {
            x.preventDefault();
            this.modelBrowser.unset("name");
            this.renderFilterBrowser();
            this.trigger("render")
        },
        renderTabs: function k() {
            this.categoryTabs = this.createView(l.View.Tabs, {
                className: "category-tabs menu servers_menu",
                tabs: [{
                    text: this.trans("WEB_GAME_ITEM_CATEGORY_BROWSER"),
                    filter: "browser"
                }, {
                    text: this.trans("WEB_GAME_ITEM_CATEGORY_BOOKMARKS"),
                    filter: "bookmarks"
                }]
            }, "tabs").render().attach();
            return this
        },
        renderFieldset: function a(B, A, C) {
            var x = this.make("fieldset"),
                z = this.make("label", {
                    "class": "checkbox"
                }, C),
                y = this.make("input", {
                    "class": "invisible",
                    name: A,
                    type: "checkbox"
                });
            if (B) {
                y.checked = true;
                z.className += " checked"
            }
            z.appendChild(y);
            x.appendChild(z);
            return x
        },
        renderFilterBrowser: function m() {
            var C = this.make("div", {
                    "class": "server-filter dropdown-filter server-filter-browser"
                }),
                y = this.make("div", {
                    "class": "dropdown-nav"
                }),
                N = this.make("div", {
                    "class": "filter-list"
                }),
                Q = this.make("div", {
                    "class": "filter-container"
                }),
                R = this.make("div", {
                    "class": "filter-container"
                }),
                F = this.make("div", {
                    "class": "filter-container thin"
                }),
                K = this.make("form"),
                B = this.make("fieldset", {
                    "class": "filter-free"
                }),
                G = this.make("label", null, this.trans("WEB_GAME_SERVERBROWSER_FILTER_SEARCH_SERVER_NAME") + ":"),
                L = this.make("input", {
                    "class": "filter-free-text",
                    name: "name",
                    type: "text",
                    value: this.modelBrowser.get("name") || ""
                }),
                z = this.make("span", {
                    "class": "filter-free-reset"
                }, "X"),
                O = this.make("fieldset"),
                x = this.make("label", null, this.trans("WEB_GAME_SERVERBROWSER_FILTER_LOCATION") + ":"),
                T = this.make("div", {
                    "class": "selectbox"
                }),
                E = [this.trans("WEB_GAME_SERVERBROWSER_FILTER_LOCATION_ASIA"), this.trans("WEB_GAME_SERVERBROWSER_FILTER_LOCATION_EUROPE"), this.trans("WEB_GAME_SERVERBROWSER_FILTER_LOCATION_NORTH_AMERICA_EAST"), this.trans("WEB_GAME_SERVERBROWSER_FILTER_LOCATION_NORTH_AMERICA_WEST")],
                H = v.indexOf(this.geoValues, this.modelBrowser.get("geo")),
                P = this.make("div", {
                    "class": "selected"
                }),
                D = this.make("div", {
                    "class": "options"
                }),
                J = this.make("div", {
                    "class": "filter-current"
                }),
                S = this.make("ul", {
                    "class": "server-filters"
                }),
                I, A, M = this.options.maps.length;
            y.appendChild(this.make("span", {
                "class": "title"
            }, this.trans("WEB_GAME_TIER_FILTER_LABEL")));
            B.appendChild(G);
            B.appendChild(L);
            B.appendChild(z);
            K.appendChild(B);
            Q.appendChild(K);
            O.appendChild(x);
            this.createView(l.View.Choose, {
                container: O,
                values: E,
                value: H === -1 ? 0 : H
            }, "geo").render().attach();
            Q.appendChild(O);
            R.appendChild(this.make("label", null, this.trans("WEB_GAME_SERVERBROWSER_FILTER_MISC") + ":"));
            R.appendChild(this.renderFieldset(this.modelBrowser.get("hideFull"), "hideFull", this.trans("WEB_GAME_SERVERBROWSER_FILTER_HIDE_FULL")));
            R.appendChild(this.renderFieldset(this.modelBrowser.get("hideEmpty"), "hideEmpty", this.trans("WEB_GAME_SERVERBROWSER_FILTER_HIDE_EMPTY")));
            I = this.renderFieldset(this.modelBrowser.get("showUnranked"), "showUnranked", this.trans("WEB_GAME_SERVERBROWSER_FILTER_SHOW_UNRANKED"));
            A = this.renderFieldset(this.modelBrowser.get("hidePwd"), "hidePwd", this.trans("WEB_GAME_SERVERBROWSER_FILTER_HIDE_PASSWORD_PROTECTED")).getElementsByTagName("label")[0];
            A.className += " dependency";
            if (!this.modelBrowser.get("showUnranked")) {
                A.className += " disabled";
                A.getElementsByTagName("input")[0].disabled = true
            }
            I.appendChild(A);
            R.appendChild(I);
            R.appendChild(this.renderFieldset(this.modelBrowser.get("onlyVip"), "onlyVip", this.trans("WEB_GAME_SERVERBROWSER_FILTER_SHOW_ONLY_VIP")));
            F.appendChild(this.make("label", null, this.trans("WEB_GAME_SERVERBROWSER_FILTER_MAPS") + ":"));
            v.forEach(this.options.maps, function(U) {
                F.appendChild(this.renderFieldset(v.indexOf(this.modelBrowser.get("maps"), U) !== -1, "maps" + U, this.trans("WEB_GAME_SERVERBROWSER_MAPS_" + U)))
            }, this);
            S.appendChild(this.make("li", {
                "class": "hide"
            }, this.trans("WEB_GAME_SERVERBROWSER_FILTER_HIDES") + ":"));
            if (this.modelBrowser.get("hideFull")) {
                S.appendChild(this.make("li", null, this.trans("WEB_GAME_SERVERBROWSER_FILTER_HIDES_FULL")))
            }
            if (this.modelBrowser.get("hideEmpty")) {
                S.appendChild(this.make("li", null, this.trans("WEB_GAME_SERVERBROWSER_FILTER_HIDES_EMPTY")))
            }
            if (!this.modelBrowser.get("showUnranked")) {
                S.appendChild(this.make("li", null, this.trans("WEB_GAME_SERVERBROWSER_FILTER_HIDES_UNRANKED")))
            }
            if (this.modelBrowser.get("hidePwd")) {
                S.appendChild(this.make("li", null, this.trans("WEB_GAME_SERVERBROWSER_FILTER_HIDES_PASSWORD_PROTECTED")))
            }
            if (this.modelBrowser.get("onlyVip")) {
                S.appendChild(this.make("li", null, this.trans("WEB_GAME_SERVERBROWSER_FILTER_HIDES_NON_VIP")))
            }
            if (this.modelBrowser.get("maps").length !== M) {
                if (this.modelBrowser.get("maps").length === (M - 1)) {
                    S.appendChild(this.make("li", null, 1 + " " + this.trans("WEB_GAME_SERVERBROWSER_FILTER_HIDES_MAP")))
                } else {
                    S.appendChild(this.make("li", null, (M - this.modelBrowser.get("maps").length) + " " + this.trans("WEB_GAME_SERVERBROWSER_FILTER_HIDES_MAPS")))
                }
            }
            J.appendChild(S);
            J.appendChild(this.make("p", {
                "class": "visible-servers"
            }, this.numberOfServers + " " + this.trans("WEB_GAME_SERVERBROWSER_FILTER_SERVERS")));
            N.appendChild(Q);
            N.appendChild(R);
            N.appendChild(F);
            N.appendChild(J);
            this.$filterBrowser.empty();
            this.$filterBrowser.append(y);
            this.$filterBrowser.append(N);
            return this
        },
        renderFilterBookmarks: function g() {
            var y = this.make("div", {
                    "class": "server-filter dropdown-filter server-filter-bookmarks"
                }),
                B = this.make("div", {
                    "class": "dropdown-nav"
                }),
                x = this.make("div", {
                    "class": "filter-list"
                }),
                A = this.make("div", {
                    "class": "filter-container"
                }),
                z = this.make("div", {
                    "class": "filter-current"
                });
            B.appendChild(this.make("span", {
                "class": "title"
            }, this.trans("WEB_GAME_TIER_FILTER_LABEL")));
            A.appendChild(this.renderFieldset(this.modelBookmarks.get("onlyVip"), "onlyVip", this.trans("WEB_GAME_SERVERBROWSER_FILTER_SHOW_ONLY_VIP")));
            A.appendChild(this.renderFieldset(this.modelBookmarks.get("showOffline"), "showOffline", this.trans("WEB_GAME_SERVERBROWSER_FILTER_SHOW_OFFLINE")));
            z.appendChild(this.make("p", {
                "class": "visible-servers"
            }, this.numberOfServers + " " + this.trans("WEB_GAME_SERVERBROWSER_FILTER_SERVERS")));
            x.appendChild(A);
            x.appendChild(z);
            this.$filterBookmarks.empty();
            this.$filterBookmarks.append(B);
            this.$filterBookmarks.append(x);
            return this
        },
        renderReloadButton: function s() {
            var x = this.make("div", {
                "class": "icon_bg_wrapper reload"
            });
            x.appendChild(this.make("div", {
                "class": "reload_icon"
            }));
            this.el.appendChild(x);
            return this
        },
        render: function f() {
            this.renderTabs();
            this.$filterBrowser = this.$("<div>").attr({
                "class": "server-filter dropdown-filter server-filter-browser"
            }).appendTo(this.el);
            this.$filterBookmarks = this.$("<div>").attr({
                "class": "server-filter dropdown-filter server-filter-bookmarks"
            }).appendTo(this.el);
            if (this.tabName === "browser") {
                this.renderFilterBrowser();
                this.categoryTabs.select(0, {
                    silent: true
                })
            } else {
                if (this.tabName === "bookmarks") {
                    this.renderFilterBookmarks();
                    this.categoryTabs.select(1, {
                        silent: true
                    })
                }
            }
            this.renderReloadButton()
        }
    })
}(this.APP));
(function(o) {
    var j = o.APP,
        g = j.View.prototype,
        s = j._,
        f = j.$,
        e = j.win;
    j.View.ServerInfo = j.View.extend({
        name: "server-info-view",
        tagName: "div",
        canIBookmark: true,
        rosterFetched: false,
        currentTabName: "map-rotation",
        events: {
            "click div.bookmark_icon": function b(u) {
                u.preventDefault();
                if (this.canIBookmark) {
                    this.canIBookmark = false;
                    u.currentTarget.className += " loading";
                    this.sound("click", "Clicked bookmark");
                    if (this.model.get("bookmarked")) {
                        this.model.removeBookmark()
                    } else {
                        this.model.addBookmark()
                    }
                }
            },
            "click div.reload_icon:not(.active)": function a(w) {
                w.preventDefault();
                this.sound("click", "Clicked reload");
                var v = this.$(w.currentTarget),
                    u = this;
                v.addClass("active");
                this.model.fetch({
                    lookAtMe: true,
                    success: function(x) {
                        x.ping()
                    },
                    error: function() {
                        u.render()
                    }
                })
            },
            "click .serverinfo_menu a": function m(v) {
                v.preventDefault();
                this.sound("click");
                var u = v.currentTarget.parentNode.className;
                this.switchInfoTab(u)
            }
        },
        initialize: function l() {
            this.model.bind("change", this._onChange, this);
            this.bind("join:click", this._onJoinClick, this)
        },
        destroy: function d() {
            this.model.unbind("change", this._onChange, this)
        },
        _onChange: function k() {
            if (this.model.hasChanged("bookmarked")) {
                this.canIBookmark = true
            }
            if (this.model.get("players") !== this.model.get("gameRoster").length) {
                this.rosterFetched = false;
                this.currentTabName = "map-rotation"
            }
            this.render()
        },
        _onJoinClick: function r() {
            this.trigger("join", this, this.model)
        },
        switchInfoTab: function c(u) {
            if (u) {
                this.currentTabName = u
            }
            this.$(".serverinfo_menu a").removeClass("active");
            this.$(".serverinfo_menu li." + this.currentTabName + " a").addClass("active");
            if (this.currentTabName === "map-rotation") {
                this.$players.hide();
                this.$mapRotation.show()
            } else {
                this.$mapRotation.hide();
                this.$players.show();
                if (!this.rosterFetched) {
                    this.model.fetch({
                        success: s.bind(function() {
                            this.rosterFetched = true;
                            this.$players.find("div.update-overlay").remove()
                        }, this),
                        error: s.bind(function() {
                            this.$players.find("div.update-overlay").remove()
                        }, this)
                    })
                }
            }
            this.trigger("render");
            return this
        },
        renderTitle: function p() {
            var v = this.make("h2", {
                    "class": "title"
                }),
                u = this.make("span", {
                    "class": "title-wrapper"
                }),
                w = this.make("span", {
                    "class": "title"
                }, this.model.get("name"));
            u.appendChild(w);
            v.appendChild(u);
            this.el.appendChild(v);
            return this
        },
        renderIcons: function n() {
            var w = this.make("div", {
                    "class": "icon_bg_wrapper bookmark"
                }),
                x = this.make("div", {
                    "class": "bookmark_icon"
                }),
                u = this.make("div", {
                    "class": "icon_bg_wrapper reload"
                }),
                v = this.make("div", {
                    "class": "reload_icon"
                });
            if (this.model.get("bookmarked")) {
                x.className += " active"
            }
            w.appendChild(x);
            this.el.appendChild(w);
            u.appendChild(v);
            this.el.appendChild(u);
            return this
        },
        renderDetails: function h() {
            var y = this.make("div", {
                    "class": "game map" + this.model.get("currentMap")
                }),
                x = this.make("h3"),
                v = this.make("span", {
                    "class": "game-map"
                }, this.model.get("currentMapName")),
                u = this.make("span", {
                    "class": "game-round"
                }, "(" + this.model.get("currentRound") + "/" + this.model.get("roundsPerMap") + ")"),
                w = this.make("dl");
            x.appendChild(v);
            x.appendChild(u);
            y.appendChild(x);
            w.appendChild(this.make("dt", null, this.trans("WEB_GAME_SERVERBROWSER_DETAILS_PLAYERS") + ":"));
            w.appendChild(this.make("dd", {
                "class": "game-players"
            }, this.model.get("players") + "/" + this.model.get("capacity")));
            w.appendChild(this.make("dt", null, this.trans("WEB_GAME_SERVERBROWSER_DETAILS_PING") + ":"));
            w.appendChild(this.make("dd", {
                "class": "game-ping"
            }, (this.model.get("ping") || 0) + String()));
            y.appendChild(w);
            this.el.appendChild(y);
            return this
        },
        renderTable: function i() {
            var z = this.make("div", {
                    "class": "tabbed-box"
                }),
                x = this.make("ul", {
                    "class": "menu serverinfo_menu"
                }),
                y = this.make("li", {
                    "class": "map-rotation"
                }),
                u = this.make("li", {
                    "class": "players"
                }),
                w = new j.Collection(this.model.get("mapList")),
                v = new j.Collection.Players(this.model.get("gameRoster"));
            y.appendChild(this.make("a", {
                href: "#map-rotation"
            }, this.trans("WEB_GAME_ITEM_CATEGORY_MAP-ROTATION")));
            u.appendChild(this.make("a", {
                href: "#players"
            }, this.trans("WEB_GAME_ITEM_CATEGORY_PLAYERS")));
            x.appendChild(y);
            x.appendChild(u);
            z.appendChild(x);
            this.$mapRotation = f("<div>").addClass("serverinfo_tab map-rotation tableContainer").appendTo(z);
            this.mapRotation = this.createView(j.View.Table, {
                headers: [{
                    label: "WEB_GAME_SERVERBROWSER_COL_MAP",
                    key: "name"
                }, {
                    label: "WEB_GAME_SERVERBROWSER_COL_MODE",
                    key: "gameModeName"
                }],
                view: j.View.TableRow,
                collection: w,
                container: this.$mapRotation,
                orderByDirection: false,
                orderByKey: "order"
            }).render().select(w.at(this.model.get("mapIndex"))).attach();
            this.$players = f("<div>").addClass("serverinfo_tab players tableContainer").appendTo(z);
            this.players = this.createView(j.View.Table, {
                orderByKey: "name",
                orderByDirection: "asc",
                headers: [{
                    label: "WEB_GAME_SERVERBROWSER_COL_LEVEL",
                    key: "level",
                    attrs: {
                        "class": "headerSort"
                    }
                }, {
                    label: "WEB_GAME_SERVERBROWSER_COL_CLASS",
                    key: "kit",
                    attrs: {
                        "class": "headerSort"
                    }
                }, {
                    label: "WEB_GAME_SERVERBROWSER_COL_SOLDIER_NAME",
                    key: "name",
                    attrs: {
                        "class": "headerSort"
                    }
                }],
                view: j.View.Player,
                collection: v,
                container: this.$players
            }).render().attach();
            if (!this.rosterFetched) {
                this.$players.append(this.make("div", {
                    "class": "update-overlay",
                    style: "opacity:1; display:block;"
                }, this.trans("WEB_GAME_SERVERBROWSER_RETRIEVING_PLAYERS")))
            }
            this.el.appendChild(z);
            this.switchInfoTab();
            return this
        },
        render: function q() {
            this.renderTitle().renderIcons();
            if (this.model.get("online")) {
                this.renderDetails();
                this.renderTable();
                this.createView(j.View.Button, {
                    className: "join",
                    text: this.trans("WEB_GAME_JOIN_JOIN_GAME")
                }, "join").render().attach()
            } else {
                this.el.appendChild(this.make("div", {
                    "class": "game-offline"
                }, this.trans("WEB_GAME_SERVERBROWSER_SERVER_OFFLINE")))
            }
            return this
        }
    })
}(this));
(function(i) {
    var b = i.$,
        l = i._,
        j = i.View.Table.prototype;
    i.View.ServerList = i.View.Table.extend({
        name: "server-list-view",
        options: {
            orderByKey: "ping",
            orderByDirection: "asc",
            headers: [{
                label: "WEB_GAME_SERVERBROWSER_COL_STATUS"
            }, {
                label: "WEB_GAME_SERVERBROWSER_COL_SERVER_NAME",
                attrs: {
                    "class": "headerSort"
                },
                key: "name"
            }, {
                label: "WEB_GAME_SERVERBROWSER_COL_MAP",
                attrs: {
                    "class": "headerSort"
                },
                key: "currentMapName"
            }, {
                label: "WEB_GAME_SERVERBROWSER_COL_PLAYERS",
                attrs: {
                    "class": "headerSort"
                },
                key: "players"
            }, {
                label: "WEB_GAME_SERVERBROWSER_COL_PING",
                attrs: {
                    "class": "headerSort"
                },
                key: "ping"
            }, {
                label: null
            }],
            view: i.View.Server,
            limit: 25,
            pending: true,
            pendingText: "WEB_GAME_SERVERBROWSER_PENDING_TEXT"
        },
        events: l.extend({
            "click .join_this_row": function(q) {
                q.preventDefault();
                this.sound("click");
                var p = this.$(q.currentTarget).closest("tr.server-view"),
                    o = this.$trs.index(p),
                    n = this.currentCollection.at(o);
                this.joinServer(n)
            },
            "click tr.server-view": function(q) {
                q.preventDefault();
                this.sound("click");
                var p = this.$(q.currentTarget),
                    o = this.$trs.index(p),
                    n = this.currentCollection.at(o);
                this.select(n)
            }
        }, j.events),
        initialize: function a() {
            j.initialize.apply(this, arguments);
            this.collection.bind("ping", this._onPing, this);
            this.collection.bind("change", this._onChange, this)
        },
        destroy: function m() {
            this.collection.unbind("ping", this._onPing, this);
            this.collection.unbind("change", this._onChange, this)
        },
        _onPing: function c() {
            this.renderBody()
        },
        _onChange: function k() {
            this.select()
        },
        sortByIterator: function h(n) {
            if (this.options.orderByKey === "ping") {
                return (n.get("ping") * 1000) + parseInt(n.cid.substr(1), 10)
            }
            if (this.options.orderByKey === "name") {
                return n.get("name").toLowerCase()
            }
            return n.get(this.options.orderByKey)
        },
        joinServer: function g(n) {
            n = this.currentCollection.get(n);
            i.trigger("join", n);
            return this
        },
        renderPendingRow: function d(p, n) {
            var o = this.make("tr", {
                "class": "pending-indicator"
            });
            o.appendChild(this.make("td", {
                colspan: this.options.headers.length
            }, (n - p) + " / " + n + " Pinged"));
            this.$tbody.append(o);
            this.trigger("renderpending");
            return this
        },
        renderLimitIterator: function e(n) {
            return n.get("pingState") !== 1
        },
        renderBody: function f() {
            j.renderBody.apply(this, arguments);
            if (this.currentCollection.length !== this.collection.length) {
                this.currentCollection.ping()
            }
            return this
        }
    })
}(this.APP));
APP.domTask("servers", ["sidis"], function initServers(m) {
    var b = APP.$,
        a = APP.win,
        r = APP._,
        f = APP.namespace("servers"),
        e = APP.namespace("config"),
        h = f.$el = b("<div>").addClass("main main_serverbrowser page hidden").appendTo("#frontend"),
        k = f.collection = new APP.Collection.Servers([], {
            handlePing: true
        }),
        c = f.$panelLeft = b("<div>").addClass("page-panel left").appendTo(h),
        g = b("<div>").attr("id", "browser-list").addClass("tableContainer scroll-pane server-list-browser").appendTo(c),
        o = b("<div>").addClass("update-overlay").text(APP.sidis.trans("WEB_GAME_SERVERBROWSER_RETRIEVING_SERVERS")).appendTo(g),
        d = function d(s) {
            if (s && (!f.infoView || s.id !== f.infoView.model.id)) {
                if (f.infoView) {
                    f.infoView.destroy()
                }
                f.infoView = new APP.View.ServerInfo({
                    model: s,
                    container: h,
                    className: "server_info has_buttons page-panel right"
                });
                f.infoView.bind("render", function() {
                    f.infoView.$("h2.title span.title").renderText();
                    f.infoView.$("div.game h3 span, div.game-offline, div.game dt, div.game dd, .serverinfo_menu a, div.update-overlay").renderText(true);
                    f.infoView.$("a.button-view").renderText({
                        hover: true,
                        separate: "none"
                    })
                });
                f.infoView.bind("join", function(u, v) {
                    APP.trigger("join", v)
                });
                f.infoView.attach().render()
            }
        },
        q = r.keys(APP.Model.Server.maps).map(function(s) {
            return parseInt(s, 10)
        });
    APP.bind("join", function(s) {
        if (s.get("online")) {
            if (!s.get("ranked")) {
                a.showTooltip("UnrankedServer", "browser_unranked_ok")
            } else {
                if (s.get("hasPassword")) {
                    a.showTooltip("PasswordProtectedServer", "browser_password");
                    b("#server_password").focus()
                } else {
                    a.playSound("play_now");
                    a.joinServer(s.id, "")
                }
            }
        } else {
            a.playSound("error");
            a.showTooltip("ServersError_1", "close")
        }
    });
    APP.bind("bookmark:add", function l(s) {
        s = k.get(s);
        if (!s) {
            return
        }
        b.ajax({
            type: "POST",
            url: e.serverAddUrl,
            data: {
                serverId: s.id
            },
            cache: false,
            success: function(u) {
                if (u && u.result === "success") {
                    s.set({
                        bookmarked: true
                    })
                } else {
                    b.magma.debugLog("warning", "add server bookmark error!")
                }
            },
            error: function(u, w, v) {
                b.magma.debugLog("warning", "add server bookmark error!")
            }
        })
    });
    APP.bind("bookmark:remove", function p(s) {
        s = k.get(s);
        if (!s) {
            return
        }
        b.ajax({
            type: "POST",
            url: e.serverRemoveUrl,
            data: {
                serverId: s.id
            },
            cache: false,
            success: function(u) {
                if (u && u.result === "success") {
                    s.set({
                        bookmarked: false
                    })
                } else {
                    b.magma.debugLog("warning", "remove server bookmark error!")
                }
            },
            error: function(u, w, v) {
                b.magma.debugLog("warning", "remove server bookmark error!")
            }
        })
    });
    k.once("reset", function n() {
        f.filterView = new APP.View.ServerFilter({
            maps: q,
            modelBrowser: new APP.Model.ServerFilter({
                tab: "browser",
                hideEmpty: true,
                hideFull: true,
                geo: a.matchmaking ? a.matchmaking.getPingSite() : "gva",
                maps: q,
                showUnranked: false
            }, {
                storageKey: "filterBrowser"
            }),
            modelBookmarks: new APP.Model.ServerFilter({
                tab: "bookmarks",
                showOffline: false
            }, {
                storageKey: "filterBookmarks"
            }),
            container: c,
            collection: k
        });
        f.filterView.bind("render", function() {
            f.filterView.$(".servers_menu a, div.server-filter span.title").renderText()
        });
        f.filterView.attach({
            prepend: true
        });
        f.filterView.render();
        f.tableView = new APP.View.ServerList({
            collection: k,
            container: g
        });
        f.tableView.once("render", function() {
            o.hide()
        });
        f.tableView.render();
        f.tableView.filterBy(f.filterView.modelBrowser.toJSON());
        f.tableView.attach();
        f.tableView.bind("select", function(s) {
            k.setSelected(s)
        });
        f.tableView.bind("renderpending", function() {
            f.tableView.$("tr.pending-indicator td").renderText()
        });
        f.filterView.bind("filter", function(s) {
            f.tableView.filterBy(s)
        })
    });
    k.bind("reload:before", function() {
        o.show()
    });
    k.bind("reload", function() {
        o.hide();
        if (f.filterView.tabName === "browser") {
            f.tableView.filterBy(f.filterView.modelBrowser.toJSON())
        } else {
            if (f.filterView.tabName === "bookmarks") {
                f.tableView.filterBy(f.filterView.modelBookmarks.toJSON())
            }
        }
    });
    k.bind("select", function(s) {
        f.trigger("select", s)
    });
    f.bind("select", d);
    f.initialize(function j(s) {
        o.renderText().show();
        k.fetch();
        s()
    });
    f.once("initialized", function i() {
        f.$el.removeClass("loading")
    });
    m()
});
APP.domTask("server-friends", function taskServerFriends(c) {
    var e = APP.$,
        g = APP.win,
        j = APP._,
        i = e("ul.list.friends_list"),
        d, a = function() {
            if (d) {
                d.destroy();
                d = null
            }
        };
    i.delegate("li.friend.status-ingame a", "click", function f(k) {
        k.preventDefault()
    });
    i.delegate("li.friend.status-ingame span.joinNow", "mouseenter", function b(o) {
        a();
        var m = e(this),
            p = m.prev("span.gameinfo"),
            n = p.find("span.locked"),
            k = p.find("span.unranked"),
            l = [];
        l.push("<h2>" + p.find("span.name").text() + "</h2>");
        l.push("<p>" + p.find("span.map").text() + "<span>" + p.find("span.players").text() + "</span></p>");
        if (n.size() > 0) {
            l.push('<span class="password">' + n.text() + "</span>")
        }
        if (k.size() > 0) {
            l.push('<span class="unranked">' + k.text() + "</span>")
        }
        d = new APP.View.Tooltip({
            className: "server-tooltip"
        });
        d.attach();
        d.renderHTMLAndShow(l.join(""), m);
        d.$("h2").renderText()
    });
    i.delegate("li.friend.status-ingame span.joinNow", "mouseleave", function h(k) {
        a()
    });
    c()
});
APP.task("servers.routes", ["servers"], function taskOptionsRoutes(d) {
    var f = APP.win,
        e = APP.$,
        j = APP._,
        g = APP.namespace("servers");
    APP.bind("page:serverbrowser", function a(m, l) {
        if (m !== "serverbrowser") {
            f.dontUpdateDoll = true;
            f.hideDoll()
        }
        g.run(function k() {
            var n;
            if (l.id) {
                n = g.collection.get(l.id);
                if (n) {
                    g.trigger("select", n)
                } else {
                    new APP.Model.Server({
                        persistentId: l.id
                    }).fetch({
                        success: function o(q) {
                            g.trigger("select", q)
                        },
                        error: function p() {
                            APP.warn("Unable to fetch server")
                        }
                    })
                }
            }
        })
    });
    APP.route("serverbrowser", "serverbrowser", function i() {
        APP.page("serverbrowser")
    });
    APP.route("/serverbrowser/:id", "server-info", function h(k) {
        APP.page("serverbrowser", {
            id: k
        })
    });
    APP.bind("page:joinfriends", function c(k) {
        if (k !== "joinfriends") {
            f.dontUpdateDoll = true;
            f.hideDoll()
        }
    });
    APP.route("joinfriends", "joinfriends", function b() {
        APP.page("joinfriends")
    });
    d()
});
$.magma = (function(f) {
    function e(l, u) {
        var m = new Date(),
            r = m.getHours(),
            p = m.getMinutes(),
            n = m.getSeconds(),
            o = m.getMilliseconds(),
            q, s;
        p = (p < 10 ? "0" : "") + p;
        n = (n < 10 ? "0" : "") + n;
        q = r + ":" + p + ":" + n + ":" + o;
        if (window.console !== undefined && console.log !== undefined) {
            s = q + " - " + u;
            if (console.debug !== undefined) {
                if (l === "debug") {
                    console.debug(s)
                } else {
                    if (l === "warning" || l === "warn") {
                        console.warn(s)
                    } else {
                        if (l === "info") {
                            console.info(s)
                        } else {
                            if (l === "error") {
                                console.error(s)
                            } else {
                                console.log(s)
                            }
                        }
                    }
                }
            } else {
                console.log(s)
            }
        }
        if (window.log && window.log.debug) {
            window.log.debug(q + " - " + u)
        }
    }

    function h() {
        if (window.doll && window.doll.visible === true) {
            hideDoll()
        }
        f("#preloader").show()
    }

    function b() {
        h();
        e("debug", "reload::Reloading page");
        setTimeout(function l() {
            window.location.reload()
        }, 1000)
    }

    function g(l) {
        h();
        e("debug", "gotoURL::Reloading page");
        setTimeout(function m() {
            window.location = l
        }, 200)
    }

    function j(m, l) {
        return m.replace(/item\-(min|med|max)/g, "item-" + l)
    }
    f.fn.changeItemClassSize = function(n) {
        var l = f(this),
            m = l.attr("class");
        if (m) {
            l.attr("class", j(m, n))
        }
        return this
    };

    function k(n, m) {
        var l = (n.match(/item\-(min|med|max)/) || ["min"]).pop();
        return f.trim(n.replace(/item\-(min|med|max)(\-[0-9]+)?/g, "")) + " item-" + l + " item-" + l + "-" + m
    }
    f.fn.changeItemClassId = function(n) {
        var l = f(this),
            m = l.attr("class");
        if (m) {
            l.attr("class", k(m, n))
        }
        return this
    };
    f.fn.gameItem = function c(l) {
        l = ".game-item" + (l || "");
        var m = f(this);
        if (m.is(l)) {
            return m
        }
        return m.find(l)
    };
    f.fn.changeItemId = function(m) {
        var l = f(this);
        l.attr("item-id", m);
        l.data("id", m);
        l.changeItemClassId(m);
        return this
    };

    function a(m) {
        var l = f("<span>");
        l.addClass("game-item item-min item-min-" + m);
        l.attr("item-id", m);
        l.data("id", m);
        return l
    }
    f.createGameItem = a;
    f.fn.itemId = function i(n) {
        var l = f(this),
            m = l.data("id");
        if (!m) {
            m = l.attr("item-id");
            l.data("id", m)
        }
        return m + String()
    };
    f.fn.webkitHighlight = function(s, m) {
        s = s || "highlight";
        m = m || 500;
        var o = f(this).toArray(),
            l = o.length,
            n = 0,
            r = 0,
            p = function() {
                n += 1;
                if (l > n) {
                    setTimeout(q, Math.round(m / 3))
                }
            },
            q = function() {
                var v = o[n],
                    u = function() {
                        r += 1;
                        this.removeEventListener("webkitAnimationEnd", u, false);
                        this.style.webkitAnimationName = "";
                        this.style.webkitAnimationDuration = "";
                        if (l > 1 && r === l) {
                            setTimeout(function() {
                                o.forEach(function(x) {
                                    var w = function() {
                                        this.removeEventListener("webkitAnimationEnd", w, false);
                                        this.style.webkitAnimationName = "";
                                        this.style.webkitAnimationDuration = ""
                                    };
                                    x.addEventListener("webkitAnimationEnd", w, false);
                                    x.style.webkitAnimationName = s;
                                    x.style.webkitAnimationDuration = m + "ms"
                                })
                            }, 0)
                        }
                    };
                v.addEventListener("webkitAnimationEnd", u, false);
                v.style.webkitAnimationName = s;
                v.style.webkitAnimationDuration = m + "ms";
                p()
            };
        if (l > n) {
            q()
        }
        return this
    };
    return {
        debugLog: e,
        reload: b,
        gotoURL: g,
        changeItemClassSize: j,
        createGameItem: a,
        getImageUrl: function d(m, l) {
            l = l || "max";
            return f.magma.jsVariables.imageFolder + "item-icons/" + l + "/" + m + ".png"
        }
    }
}(jQuery));
$.highlights = (function() {
    function a() {
        $.highlights.auto_rotate = setTimeout(h, e)
    }

    function g(m) {
        $.highlights.$nav_elements.removeClass("selected");
        el = '#highlights a[href$="' + m.id + '"]';
        $(el).parent().addClass("selected");
        $("#hl_lights li.selected span").fadeOut().parent().removeClass("selected");
        el2 = '#hl_lights li[id$="' + m.id + '"]';
        $(el2).addClass("selected").find("span").fadeIn()
    }

    function h() {
        $($.highlights.scroll).delay(500).trigger("next.serialScroll");
        $.highlights.auto_rotate = setTimeout(h, e)
    }
    var k;
    var d = true;
    var e = 8000;
    var l;
    var f;
    var j;
    var i;
    var c;
    var b;
    return {
        afterRotation: g,
        rotateHighlights: h,
        startSlideshow: a,
        scroll: j,
        scrollOptions: b,
        auto_rotate: k,
        offset: f,
        $container: l
    }
}());
jQuery(document).ready(function() {
    if ($("#hl_navigation li").length > 1) {
        $.highlights.auto_rotate;
        $.highlights.do_auto_rotate = true;
        $.highlights.auto_rotate_timeout = 8000;
        $.highlights.$container = $("h1_scroll_container");
        $.highlights.offset = parseInt($("h1_scroll_container").css("paddingLeft") || 0) * -1;
        $.highlights.scroll = $("#highlights .hl_scroll");
        $.highlights.$nav_elements = $("#hl_navigation li");
        $.highlights.$light_elements = $("#hl_lights li");
        $.highlights.scrollOptions = {
            target: $("#highlights .hl_scroll"),
            items: "div.panel",
            navigation: "#hl_navigation li",
            offset: parseInt($("h1_scroll_container").css("paddingLeft") || 0) * -1,
            duration: 800,
            axis: "xy",
            easing: "easeInOutCubic",
            step: 1,
            cycle: true,
            hash: false,
            constant: false,
            onAfter: function(a) {
                $.highlights.afterRotation(a)
            }
        };
        $("#highlights .hl_scroll").serialScroll($.highlights.scrollOptions);
        $.highlights.scroll.bind("mouseenter", function() {});
        $.highlights.scroll.bind("mouseleave", function() {
            if (do_auto_rotate) {
                $.highlights.auto_rotate = setTimeout(rotateHighlights, auto_rotate_timeout)
            }
        });
        $.localScroll($.highlights.scrollOptions);
        if (window.location.hash) {
            $.highlights.afterRotation({
                id: window.location.hash.substr(1)
            })
        }
        $("#highlights").click(function() {
            $(this).parents("ul:first").find("li").removeClass("selected").end().end().addClass("selected");
            clearTimeout($.highlights.auto_rotate);
            do_auto_rotate = false
        });
        $("#highlights").hover(function() {
            $(this).find("ul#hl_navigation").stop(true, true).animate({
                bottom: "0px"
            }, {
                duration: 200,
                easing: "easeOutCirc"
            })
        }, function() {
            $(this).find("ul#hl_navigation").stop(true, true).animate({
                bottom: "-60px"
            }, {
                duration: 200,
                easing: "easeInCirc"
            })
        });
        $("ul#hl_navigation").delay(4000).animate({
            bottom: "-60px"
        }, {
            duration: 600,
            easing: "easeInCirc"
        });
        $("#hl_lights li:not(.selected) span").hide()
    } else {
        $("#hl_navigation").hide();
        $("#hl_lights").hide()
    }
});
(function(r) {
    function d() {
        if (r.browser.msie) {
            var b = r(document).height(),
                c = r(window).height();
            return [window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, b - c < 20 ? c : b]
        }
        return [r(document).width(), r(document).height()]
    }

    function n(b) {
        if (b) {
            return b.call(r.mask)
        }
    }
    r.tools = r.tools || {
        version: "1.2.5"
    };
    var a;
    a = r.tools.expose = {
        conf: {
            maskId: "exposeMask",
            loadSpeed: "slow",
            closeSpeed: "fast",
            closeOnClick: true,
            closeOnEsc: true,
            zIndex: 9998,
            opacity: 0.8,
            startOpacity: 0,
            color: "#fff",
            onLoad: null,
            onClose: null
        }
    };
    var q, m, p, o, f;
    r.mask = {
        load: function(c, e) {
            if (p) {
                return this
            }
            if (typeof c == "string") {
                c = {
                    color: c
                }
            }
            c = c || o;
            o = c = r.extend(r.extend({}, a.conf), c);
            q = r("#" + c.maskId);
            if (!q.length) {
                q = r("<div/>").attr("id", c.maskId);
                r("body").append(q)
            }
            var b = d();
            q.css({
                position: "absolute",
                top: 0,
                left: 0,
                width: b[0],
                height: b[1],
                display: "none",
                opacity: c.startOpacity,
                zIndex: c.zIndex
            });
            c.color && q.css("backgroundColor", c.color);
            if (n(c.onBeforeLoad) === false) {
                return this
            }
            c.closeOnEsc && r(document).bind("keydown.mask", function(g) {
                g.keyCode == 27 && r.mask.close(g)
            });
            c.closeOnClick && q.bind("click.mask", function(g) {
                r.mask.close(g)
            });
            r(window).bind("resize.mask", function() {
                r.mask.fit()
            });
            if (e && e.length) {
                f = e.eq(0).css("zIndex");
                r.each(e, function() {
                    var g = r(this);
                    /relative|absolute|fixed/i.test(g.css("position")) || g.css("position", "relative")
                });
                m = e.css({
                    zIndex: Math.max(c.zIndex + 1, f == "auto" ? 0 : f)
                })
            }
            q.css({
                display: "block"
            }).fadeTo(c.loadSpeed, c.opacity, function() {
                r.mask.fit();
                n(c.onLoad);
                p = "full"
            });
            p = true;
            return this
        },
        close: function() {
            if (p) {
                if (n(o.onBeforeClose) === false) {
                    return this
                }
                q.fadeOut(o.closeSpeed, function() {
                    n(o.onClose);
                    m && m.css({
                        zIndex: f
                    });
                    p = false
                });
                r(document).unbind("keydown.mask");
                q.unbind("click.mask");
                r(window).unbind("resize.mask")
            }
            return this
        },
        fit: function() {
            if (p) {
                var b = d();
                q.css({
                    width: b[0],
                    height: b[1]
                })
            }
        },
        getMask: function() {
            return q
        },
        isLoaded: function(b) {
            return b ? p == "full" : p
        },
        getConf: function() {
            return o
        },
        getExposed: function() {
            return m
        }
    };
    r.fn.mask = function(b) {
        r.mask.load(b);
        return this
    };
    r.fn.expose = function(b) {
        r.mask.load(b, this);
        return this
    }
})(jQuery);
(function(b) {
    function c(v, x) {
        var w = this,
            r = v.add(w),
            h = b(window),
            q, u, l, s = b.tools.expose && (x.mask || x.expose),
            i = Math.random().toString().slice(10);
        if (s) {
            if (typeof s == "string") {
                s = {
                    color: s
                }
            }
            s.closeOnClick = s.closeOnEsc = false
        }
        var a = x.target || v.attr("rel");
        u = a ? b(a) : v;
        if (!u.length) {
            throw "Could not find Overlay: " + a
        }
        v && v.index(u) == -1 && v.click(function(f) {
            w.load(f);
            return f.preventDefault()
        });
        b.extend(w, {
            load: function(n) {
                if (w.isOpened()) {
                    return w
                }
                var k = e[x.effect];
                if (!k) {
                    throw 'Overlay: cannot find effect : "' + x.effect + '"'
                }
                x.oneInstance && b.each(d, function() {
                    this.close(n)
                });
                n = n || b.Event();
                n.type = "onBeforeLoad";
                r.trigger(n);
                if (n.isDefaultPrevented()) {
                    return w
                }
                l = true;
                s && b(u).expose(s);
                var j = x.top,
                    m = x.left,
                    g = u.outerWidth({
                        margin: true
                    }),
                    f = u.outerHeight({
                        margin: true
                    });
                if (typeof j == "string") {
                    j = j == "center" ? Math.max((h.height() - f) / 2, 0) : parseInt(j, 10) / 100 * h.height()
                }
                if (m == "center") {
                    m = Math.max((h.width() - g) / 2, 0)
                }
                k[0].call(w, {
                    top: j,
                    left: m
                }, function() {
                    if (l) {
                        n.type = "onLoad";
                        r.trigger(n)
                    }
                });
                s && x.closeOnClick && b.mask.getMask().one("click", w.close);
                x.closeOnClick && b(document).bind("click." + i, function(o) {
                    b(o.target).parents(u).length || w.close(o)
                });
                x.closeOnEsc && b(document).bind("keydown." + i, function(o) {
                    o.keyCode == 27 && w.close(o)
                });
                return w
            },
            close: function(f) {
                if (!w.isOpened()) {
                    return w
                }
                f = f || b.Event();
                f.type = "onBeforeClose";
                r.trigger(f);
                if (!f.isDefaultPrevented()) {
                    l = false;
                    e[x.effect][1].call(w, function() {
                        f.type = "onClose";
                        r.trigger(f)
                    });
                    b(document).unbind("click." + i).unbind("keydown." + i);
                    s && b.mask.close();
                    return w
                }
            },
            getOverlay: function() {
                return u
            },
            getTrigger: function() {
                return v
            },
            getClosers: function() {
                return q
            },
            isOpened: function() {
                return l
            },
            getConf: function() {
                return x
            }
        });
        b.each("onBeforeLoad,onStart,onLoad,onBeforeClose,onClose".split(","), function(g, f) {
            b.isFunction(x[f]) && b(w).bind(f, x[f]);
            w[f] = function(j) {
                j && b(w).bind(f, j);
                return w
            }
        });
        q = u.find(x.close || ".close");
        if (!q.length && !x.close) {
            q = b('<a class="close"></a>');
            u.prepend(q)
        }
        q.click(function(f) {
            w.close(f)
        });
        x.load && w.load()
    }
    b.tools = b.tools || {
        version: "1.2.5"
    };
    b.tools.overlay = {
        addEffect: function(f, a, g) {
            e[f] = [a, g]
        },
        conf: {
            close: null,
            closeOnClick: true,
            closeOnEsc: true,
            closeSpeed: "fast",
            effect: "default",
            fixed: !b.browser.msie || b.browser.version > 6,
            left: "center",
            load: false,
            mask: null,
            oneInstance: true,
            speed: "normal",
            target: null,
            top: "10%"
        }
    };
    var d = [],
        e = {};
    b.tools.overlay.addEffect("default", function(g, a) {
        var h = this.getConf(),
            f = b(window);
        if (!h.fixed) {
            g.top += f.scrollTop();
            g.left += f.scrollLeft()
        }
        g.position = h.fixed ? "fixed" : "absolute";
        this.getOverlay().css(g).fadeIn(h.speed, a)
    }, function(a) {
        this.getOverlay().fadeOut(this.getConf().closeSpeed, a)
    });
    b.fn.overlay = function(f) {
        var a = this.data("overlay");
        if (a) {
            return a
        }
        if (b.isFunction(f)) {
            f = {
                onBeforeLoad: f
            }
        }
        f = b.extend(true, {}, b.tools.overlay.conf, f);
        this.each(function() {
            a = new c(b(this), f);
            d.push(a);
            b(this).data("overlay", a)
        });
        return f.api ? a : this
    }
})(jQuery);
(function(a) {
    function e(j, g) {
        g = g || [];
        var f, h;
        if (j.nodeType === 3 && j.parentNode.tagName.indexOf("CUFON") === -1) {
            g.push(j.parentNode)
        } else {
            for (h = 0, f = j.childNodes.length; h < f; h += 1) {
                getTextNodes(j.childNodes[h], g)
            }
        }
        return g
    }
    a.fn.disableTextSelect = function d() {
        return this.each(function f() {
            a(this).bind("mousedown.disableTextSelect", function g() {
                return false
            })
        })
    };
    a.fn.enableTextSelect = function c() {
        return this.each(function f() {
            a(this).unbind("mousedown.disableTextSelect")
        })
    };
    a.fn.disableAllTextSelect = function b() {
        return this.each(function f() {
            a(this).bind("mousedown.disableTextSelect", function g() {
                return false
            })
        });
        return a(e)
    }
}(jQuery));

function initDisableSelect() {
    $("#frontend a, #frontend img").not($(".dock_item img, .my_list img, .buy_list img, .ui-slider-handle, #weapon-hover img, .weapon-item-view img")).disableTextSelect();
    $("#weapon-hover .item.bundle_item img, #weapon-hover .item.booster img, .buy_list.bundles_list img, .buy_list.boosters img").disableTextSelect()
}
APP.domTask("disable-select", function taskDisableSelect(a) {
    APP.doc.onselectstart = function() {
        return false
    };
    initDisableSelect();
    a()
});
var screen_scale = 1;

function fixTooltipBackgroundIn800() {
    if ($("html").width() === 1600) {
        $("#exposeMask").detach().appendTo("#frontend");
        $("#menu-tooltip").css("left", "380px");
        $("#buy-tooltip").css("left", "200px")
    }
}

function isGameRunningIn800() {
    var a = JSON.parse(APP.api.general.getWindowSize());
    if (parseInt(a.width, 10) === 800) {
        return true
    } else {
        return false
    }
}

function scaleScreenSize() {
    if (isGameRunningIn800() === true) {
        screen_scale = 0.78125;
        if ((document.body.className || "").indexOf("scale800") === -1) {
            document.body.className += " scale800"
        }
    }
}
jQuery(scaleScreenSize);

function showAlert(d) {
    $(d).hide().removeClass("hidden");
    var a = parseInt($(d).height(), 10) + parseInt($(d).css("padding-top"), 10) + 4,
        b = "-" + a + "px",
        c;
    $(d).css("margin-top", b).show().animate({
        marginTop: 0
    }, 500, "swing").delay(5000).animate({
        marginTop: b
    }, 500, "swing");
    c = $('.my_list img[item-id="' + SWFAddress.getParameter("item") + '"]');
    $(c).css("background-color", "rgba(0, 0, 0, 0)").animate({
        backgroundColor: "rgba(167, 158, 141, 0)"
    }, 0).delay(500).animate({
        backgroundColor: "rgba(167, 158, 141, 0.3)"
    }, 500).animate({
        backgroundColor: "rgba(167, 158, 141, 0.2)"
    }, 1000).animate({
        backgroundColor: "rgba(167, 158, 141, 0.3)"
    }, 1000).animate({
        backgroundColor: "rgba(167, 158, 141, 0.2)"
    }, 1000).animate({
        backgroundColor: "rgba(167, 158, 141, 0.3)"
    }, 1000).animate({
        backgroundColor: "rgba(167, 158, 141, 0)"
    }, 500);
    saveWeaponLoadout();
    saveAppearanceLoadout()
}

function roundDec(b) {
    var a = Math.round(b * 100) / 100;
    return a
}

function switchPersona(a, c) {
    var b;
    personaUrl = personaUrl + a;
    $.magma.debugLog("debug", "Switching persona to " + c);
    $("#loading .holder p").html("Switching soldier...");
    if (window.login) {
        $("#preloader").show();
        setTimeout(function() {
            window.doll.visible = false;
            b = window.login.pickSoldier(c);
            if (b === true) {
                $.magma.debugLog("debug", "Switched! pickSoldier returned " + b);
                window.location.href = personaUrl;
                return false
            } else {
                $("#loading .holder p").html("Switch soldier failed...");
                $.magma.debugLog("warning", "Switch soldier failed!")
            }
        }, 0)
    } else {
        $.magma.gotoURL(personaUrl)
    }
}

function radomBackgroundPosition(a, d, b, g, c) {
    var f = d + Math.floor(Math.random() * g),
        e = b + Math.floor(Math.random() * c);
    $(a).css("background-position", "-" + f + "px -" + e + "px")
}
var playNowDeparturePage;
APP.domTask("old-script-task", ["dock", "weapons", "appearance"], function(a) {
    var b = $(".menu .captain-shop a").text();
    $(".menu .captain-shop a").html(b.replace(/([A-Z])/g, '<span class="caps">$1</span>'));
    $.renderText("#frontend .header a, .menu li a, .tooltip .title, .tooltip .category, #frontend .dock .dock_title a, html #frontend .dock span.description, #frontend .main_weapons .item_info .title, #frontend .main_weapons .item_info .category,#eor #score table, #frontend .system-2101, #frontnd .main_weapons .stats_item h3, #eq_tooltip .price, #eq_tooltip .expired, #frontend .heading", {
        hover: true,
        hoverables: {
            span: true,
            div: true,
            a: true
        },
        ignoreClass: "nocufon"
    });
    $("form input").customInput();
    a()
});

function setEquipmentWarningPosition() {
    if ($(".dock_errors:visible").length > 0) {
        var a = $("#frontend .footer").height();
        if (a > 80) {
            $(".dock_errors").animate({
                bottom: a
            }, 200)
        }
    }
}
var showingErrorPopup = false;

function gotoUnboughtItem() {
    var a;
    if ($(".dock .primary").hasClass("unbought_item")) {
        a = $(".dock .unbought_item.primary").find("img").attr("id");
        $("ul.menu li.weapons a").click();
        $("#" + a).click();
        $("ul.menu li.weapons a").click()
    } else {
        if ($(".dock .secondary").hasClass("unbought_item")) {
            a = $(".dock .unbought_item.secondary").find("img").attr("id");
            $("ul.menu li.weapons a").click();
            $("#" + a).click();
            $("ul.menu li.weapons a").click()
        } else {
            if ($(".dock .unbought_item").length > 0) {
                if ($(".dock .unbought_item:last").parents(".dock").hasClass("weapons_dock")) {
                    $("ul.menu li.weapons a").click()
                } else {
                    if ($(".dock .unbought_item:last").parents(".dock").hasClass("appearance_dock")) {
                        $("ul.menu li.appearance a").click()
                    }
                }
            }
        }
    }
}

function showTooltip(c, a) {
    var b = "default";
    $.magma.debugLog("debug", "showTooltip with button " + a);
    $("#eq_tooltip").hide();
    $("#menu-tooltip h2").html($("#matchmaking-tooltips ." + c + " h2").html());
    $.magma.debugLog("debug", c);
    $("#menu-tooltip p").html($("#matchmaking-tooltips ." + c + " p").html());
    showingErrorPopup = true;
    $("#menu-tooltip ul").hide();
    $("#menu-tooltip").removeClass("long-tooltip");
    $("#menu-tooltip .dialog-icons div").hide();
    if ($("#matchmaking-tooltips ." + c + " div").data("icon")) {
        b = $("#matchmaking-tooltips ." + c + " div").data("icon")
    }
    $("#menu-tooltip .dialog-icons ." + b).show();
    $("#menu-tooltip .buttons a").hide();
    $("#menu-tooltip .close_btn").hide();
    if (a === "cancel_search") {
        $("#menu-tooltip .buttons .cancel_search").show()
    } else {
        if (a === "cancel_join") {
            $("#menu-tooltip .buttons .cancel_join").show()
        } else {
            if (a === "training") {
                $("#menu-tooltip .buttons .training_button").show()
            } else {
                if (a === "cancel_queue") {
                    $("#menu-tooltip .buttons .cancel_queue").show()
                } else {
                    if (a === "close") {
                        $("#menu-tooltip .close_btn").show()
                    } else {
                        if (a === "close_reload") {
                            $("#menu-tooltip .buttons .close_reload").show()
                        } else {
                            if (a === "close_cancel_search") {
                                $("#menu-tooltip .buttons .close_cancel_search").show()
                            } else {
                                if (a === "remove-server") {
                                    $("#menu-tooltip .buttons .remove-server").show();
                                    $("#menu-tooltip .close_btn").show();
                                    $("#menu-tooltip .buttons .cancel").show()
                                } else {
                                    if (a === "switchSoldier") {
                                        $("#menu-tooltip .buttons .switch").show();
                                        $("#menu-tooltip .close_btn").show();
                                        $("#menu-tooltip .buttons .cancel").show()
                                    } else {
                                        if (a === "unranked_ok") {
                                            $("#menu-tooltip .buttons .unranked_ok").show()
                                        } else {
                                            if (a === "browser_unranked_ok") {
                                                $("#menu-tooltip .buttons .browser_unranked_ok").show();
                                                $("#menu-tooltip .close_btn").show();
                                                $("#menu-tooltip .buttons .cancel").show()
                                            } else {
                                                if (a === "cancel") {
                                                    $("#menu-tooltip .close_btn").show()
                                                } else {
                                                    if (a === "cancel_wait_stats") {
                                                        $("#menu-tooltip .buttons .cancel_wait_stats").show()
                                                    } else {
                                                        if (a === "play") {
                                                            $("#menu-tooltip .buttons .play").show();
                                                            $("#menu-tooltip .close_btn").show();
                                                            $("#menu-tooltip .buttons .cancel").show()
                                                        } else {
                                                            if (a === "password") {
                                                                $("#menu-tooltip .buttons .join_password").show();
                                                                $("#menu-tooltip .close_btn").show();
                                                                $("#menu-tooltip .buttons .cancel").show()
                                                            } else {
                                                                if (a === "browser_password") {
                                                                    $("#menu-tooltip .buttons .browser_join_password").show();
                                                                    $("#menu-tooltip .buttons .cancel").show()
                                                                } else {
                                                                    if (a === "passwordfail") {
                                                                        $("#menu-tooltip .buttons .join_password").show();
                                                                        $("#menu-tooltip .buttons .cancel").show();
                                                                        $("#menu-tooltip").addClass("long-tooltip")
                                                                    } else {
                                                                        if (a === "equip") {
                                                                            $("#menu-tooltip .buttons .equip").show();
                                                                            $("#menu-tooltip .close_btn").show();
                                                                            $("#menu-tooltip .buttons .cancel").show()
                                                                        } else {
                                                                            if (a === "reload") {
                                                                                $("#menu-tooltip .buttons .reload").show()
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    $("#menu-tooltip").overlay().load();
    $.renderText(" #menu-tooltip h2, #menu-tooltip p")
}

function validatePlayNow() {
    $("#eq_tooltip").hide();
    $("#friend_tooltip").hide();
    var a = APP.ns("game").validate();
    if (!(a instanceof Error)) {
        return true
    }
    if (a.type === "NumPrimaryWeapons") {
        if (a.items.length) {
            $(".EquipmentError p").html(APP.sidis.trans("WEB_GAME_DOCK_ERROR_5017"))
        } else {
            $(".EquipmentError p").html(APP.sidis.trans("WEB_GAME_DOCK_ERROR_5018"))
        }
        $("#menu-tooltip .close_btn").one("click", APP.ns("dock").open);
        showTooltip("EquipmentError", "close");
        return false
    }
    if (a.type === "Invalid") {
        $("#menu-tooltip .close_btn").one("click", APP.ns("dock").open);
        showTooltip("UnBoughtItems", "close");
        return false
    }
    if (a.name === "ExpiredError") {
        playSound("error");
        $("#menu-tooltip .close_btn").one("click", APP.ns("dock").open);
        showTooltip("ExpiredItems", "close");
        return false
    }
    if (a.name === "UnboughtError") {
        $("#menu-tooltip .close_btn").one("click", APP.ns("dock").open);
        showTooltip("UnBoughtItems", "close");
        return false
    }
    if (a.name === "UsecountError") {
        showTooltip("NoUseCount", "play");
        APP.ns("dock").open();
        return false
    }
    loaded_usecount_tooltip = false;
    return true
}

function playNow() {
    $.magma.debugLog("debug", "Play Now");
    APP.ns("game").giveItems(function a() {
        var c = validatePlayNow(),
            d = window.matchmaking || {},
            b = window.game || {};
        if (!c) {
            playSound("error");
            return false
        } else {
            $.magma.debugLog("debug", "Triggering matchmaking");
            if (d.isEnabled === true) {
                $.magma.debugLog("debug", "Matchmaking module enabled, starting Matchmaking");
                $("#menu-tooltip").overlay().close();
                setTimeout(function() {
                    d.joinByMatchmaking()
                }, 250)
            } else {
                if (d.isEnabled === null || d.isEnabled === false) {
                    $.magma.debugLog("debug", "Matchmaking module disabled, starting game directly");
                    setTimeout(function() {
                        b.playNow()
                    }, 250)
                } else {
                    $("#menu-tooltip").overlay().close()
                }
            }
        }
    }, true)
}

function joinPlayer(c, b) {
    $.magma.debugLog("debug", 'Joining player "' + c + '" with password "' + b + '"');
    APP.ns("game").giveItems(function a() {
        var d = validatePlayNow();
        if (d) {
            window.matchmaking.joinByPlayerName(c, b || "")
        } else {
            playSound("error")
        }
    }, true)
}

function joinServer(c, b) {
    $.magma.debugLog("debug", 'Joining server id "' + c + '" with password "' + b + '"');
    APP.ns("game").giveItems(function a() {
        var d = validatePlayNow();
        if (d) {
            window.matchmaking.joinByBookmark(c, b || "")
        } else {
            playSound("error")
        }
    }, true)
}

function removePlayer(b) {
    var a = b.find(".name").attr("href").replace("#", "");
    $.magma.debugLog("debug", "Removing player " + a)
}

function resetServerLoading() {
    $(".reload_servers").removeClass("active")
}

function removeServer(b) {
    var a = b.find(".name").attr("href").replace("#", "");
    $.magma.debugLog("debug", "Removing server id " + a);
    $.ajax({
        type: "POST",
        url: remove_server_url,
        data: {
            serverId: a
        },
        cache: false,
        success: function(c) {
            $.magma.debugLog("debug", "remove success!");
            if (c.result === "success") {
                b.slideUp()
            } else {
                playSound("error");
                showTooltip("ServersRemoveError_1", "close")
            }
            setTimeout(function() {
                resetServerLoading()
            }, 1000)
        },
        error: function(c, e, d) {
            if (e !== null) {
                $.magma.debugLog("warning", "remove server error!")
            }
            setTimeout(function() {
                resetServerLoading()
            }, 1000)
        }
    })
}

function resetPlayerLoading() {
    $(".reload_friends").removeClass("active")
}

function changePlayerPage(c, b) {
    b = arguments.length < 2 ? true : b;
    $.magma.debugLog("debug", "Changing friends page id " + c + " useCache:" + b);
    var a = $("#sof1").is(":checked") ? "offline,online" : "ingame";
    $.ajax({
        type: "GET",
        url: change_friend_page_url,
        data: {
            page: c,
            status: a,
            cached: b
        },
        cache: false,
        success: function(d) {
            $(".main_joinfriends .friends_list").html(d);
            if (a === "ingame") {
                $(".main_home .friends_list").html(d)
            }
            initDisableSelect();
            $("#frontend .header .menu .friends a").html($("#friends-menu-template a").html());
            $.renderText("#frontend .header .menu .friends a, li.nofriends");
            setTimeout(resetPlayerLoading, 200)
        },
        error: function(d, f, e) {
            if (f !== null) {
                $.magma.debugLog("warning", "change page error!")
            }
            setTimeout(resetPlayerLoading, 200)
        }
    })
}

function changeServerPage(c, b) {
    $.magma.debugLog("debug", "Changing server page id " + c);
    var a;
    if ($("#sos1").is(":checked")) {
        a = "online,offline"
    } else {
        a = "online"
    }
    if (b !== "false") {
        b = "true"
    }
    $.ajax({
        type: "GET",
        url: change_server_page_url + "?page=" + c + "&status=" + a + "&cached=" + b,
        cache: false,
        success: function(d) {
            $(".server_list").html(d);
            $("#frontend .server_list .server.status-online").each(function e() {
                if (!$(".gameinfo", this).hasClass("nogameinfo")) {
                    friendTooltip($(this), "bottom center", "5")
                }
            });
            initDisableSelect();
            $.renderText("li.noservers");
            setTimeout(function f() {
                resetServerLoading()
            }, 1000)
        },
        error: function(d, g, e) {
            if (g !== null) {
                $.magma.debugLog("warning", "change page error!")
            }
            setTimeout(function f() {
                resetServerLoading()
            }, 1000)
        }
    })
}

function hideMenuScreen() {
    $.magma.debugLog("debug", "hiding menu screen");
    $("#frontend .main").hide();
    $("#frontend .header").hide();
    $("#frontend .footer").hide()
}

function showMenuScreen() {
    $.magma.debugLog("debug", "showing menu screen");
    $("#frontend .main").show();
    $("#frontend .header").show();
    $("#frontend .footer").show();
    if (window.frontendCoreLoop) {
        window.frontendCoreLoop.asyncPaint()
    }
}

function hideEORScreen() {
    $.magma.debugLog("debug", "hiding EOR screen");
    $("#eor").hide()
}

function showEORScreen() {
    $.magma.debugLog("debug", "showing EOR screen");
    $("#eor").show();
    if (window.frontendCoreLoop) {
        window.frontendCoreLoop.asyncPaint()
    }
}

function hideLoadingScreen() {
    $.magma.debugLog("debug", "hiding loading screen");
    $("#loading_screen").hide()
}

function showLoadingScreen() {
    $.magma.debugLog("debug", "Showing loading screen");
    $("#loading_screen h1").show();
    $("#loading_screen").show();
    $("#loading_screen").removeClass();
    var a = window.game.mapName;
    $.magma.debugLog("debug", "map: " + a);
    if (a.toLowerCase() !== "$nocurrentgame") {
        $("#loading_screen").addClass(a.toLowerCase().replace("gulf_of_", "").replace("strike_at_", ""));
        $("#loading_screen h1 span").text(a.replace("gulf_of_", "").replace("strike_at_", "").replace("Gulf_Of_", "").replace("Strike_At_", ""));
        $.renderText("#loading_screen span")
    } else {
        $("#loading_screen h1 span").text("...")
    }
    if (window.frontendCoreLoop) {
        window.frontendCoreLoop.asyncPaint()
    }
}

function onLoadingStart() {
    $("#menu-tooltip").overlay().close();
    $("#menu-tooltip").hide();
    hideMenuScreen();
    if (window.frontendCoreLoop) {
        window.frontendCoreLoop.asyncPaint()
    } else {
        hideEORScreen();
        showLoadingScreen()
    }
}
var fadeLoadingStarted = false;

function onLoadingProgressUpdated(a) {
    $.magma.debugLog("debug", "onLoadingProgressUpdated: " + a)
}

function onLoadingComplete() {}

function onLoadingAborted() {
    $.magma.debugLog("debug", "Aborted loading of map")
}

function onMatchmakingStateChanged(c, f, e) {
    var b = ["StateReady", "StateSearching", "StateCancelingSearch", "StateCanceledSearch", "StateInQueue", "StateJoining", "StateJoined", "StateLeaving", "StateLeft", "StateError"],
        a, d;
    $.magma.debugLog("debug", "onMatchmakingStateChanged: " + f + ", code: " + e);
    if (b[f] === "StateSearching") {
        showTooltip(b[f], "cancel_search")
    } else {
        if (b[f] === "StateCancelingSearch") {
            showTooltip(b[f], null)
        } else {
            if (b[f] === "StateCanceledSearch") {
                if (window.matchmaking.state === 3) {
                    window.matchmaking.finalizeCancelSearch()
                } else {
                    $.magma.debugLog("warning", "Trying to Finalize Cancel matchmaking search when in wrong state")
                }
                $("#menu-tooltip").overlay().close()
            } else {
                if (b[f] === "StateInQueue") {
                    showTooltip(b[f], "cancel_queue")
                } else {
                    if (b[f] === "StateJoining") {
                        showTooltip(b[f], "cancel_join")
                    } else {
                        if (b[f] === "StateJoined") {
                            return
                        } else {
                            if (b[f] === "StateLeaving") {
                                if (e === 11 || e === 12) {
                                    $.magma.jsVariables.invalidPassword = true;
                                    showTooltip("InvalidPassword", "passwordfail");
                                    $("#server_password").focus();
                                    showingErrorPopup = true
                                } else {
                                    $.magma.debugLog("debug", "Player left with reason " + reason);
                                    showTooltip(b[f], null);
                                    showingErrorPopup = true
                                }
                            } else {
                                if (b[f] === "StateLeft") {
                                    showTooltip(b[f], "close")
                                } else {
                                    if (b[f] === "StateError") {
                                        playSound("error");
                                        a = parseInt(window.matchmaking.lastError, 10);
                                        if (a === 1) {
                                            d = 1
                                        } else {
                                            if (a === 2) {
                                                d = 2
                                            }
                                        }
                                        showTooltip("StateError_" + d, "close")
                                    } else {
                                        if (b[f] === "StateReady") {
                                            if (showingErrorPopup === false) {
                                                $("#menu-tooltip").overlay().close()
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function onStateChanged(a, c, b) {
    $.magma.debugLog("debug", "Called onStateChanged");
    onMatchmakingStateChanged(a, c, b)
}

function onMatchmakingQueueUpdated() {
    $.magma.debugLog("debug", "Aborted matchmaking")
}

function onGameStarted(a) {
    APP.ns("config").model({
        "check-end-round-reported": a
    });
    SWFAddress.setValue("?gameId=" + a);
    $.magma.debugLog("info", "onGameStarted: " + a)
}

function gotoPreviousPageAfterPlayNow() {
    $.magma.debugLog("info", window.frontend ? window.frontend.activationReason : "NOT IN GAME");
    if (window.frontend && window.frontend.activationReason !== 0) {
        if (playNowDeparturePage !== undefined && playNowDeparturePage && (playNowDeparturePage.indexOf("personaId") === -1) && playNowDeparturePage !== "playnow") {
            $.magma.debugLog("debug", "Going to previous page: " + playNowDeparturePage);
            $.magma.debugLog("debug", "playNowDeparturePage.length: " + $(".header .menu li." + playNowDeparturePage + " a:first").length);
            if ($(".dock .unbought_item").length === 0 && $(".main_joinfriends").hasClass("hidden") && $(".main_joinservers").hasClass("hidden")) {
                $(".header .menu li." + playNowDeparturePage + " a:first").click();
                return true
            } else {
                if ($(".dock .unbought_item").length !== 0) {
                    gotoUnboughtItem();
                    return true
                }
            }
        } else {
            if ($(".dock .unbought_item").length === 0 && $(".main_joinfriends").hasClass("hidden") && $(".main_joinservers").hasClass("hidden")) {
                $(".header .menu li.home a.home").click();
                return true
            } else {
                if ($(".dock .unbought_item").length !== 0) {
                    gotoUnboughtItem();
                    return true
                } else {
                    $.magma.reload()
                }
            }
        }
    }
}
var isMenuTooltipOpen = false;
jQuery(function() {
    $("#menu-tooltip .unranked_ok").live("click", function() {
        playSound("click");
        var c = $("ul.server_list li.active"),
            b;
        if ($(c).find(".locked").length > 0) {
            showTooltip("PasswordProtectedServer", "password");
            $("#server_password").focus()
        } else {
            b = $(c).find(".name").attr("href").replace("#", "");
            joinServer(b, "")
        }
    });
    $("#menu-tooltip .browser_unranked_ok").live("click", function() {
        playSound("click");
        var b = APP.namespace("servers").collection.getSelected();
        if (b) {
            if (b.get("hasPassword")) {
                showTooltip("PasswordProtectedServer", "password");
                $("#server_password").focus()
            } else {
                joinServer(b.id, "")
            }
        } else {
            throw new Error("Unable to get selected server")
        }
    });
    $(".friends_list li.friend").live("click", function() {
        playSound("click", "Select friend");
        $(".friends_list .active").removeClass("active");
        $(this).addClass("active")
    });
    $(".join_friend").click(function() {
        $(".friends_list .active .name").dblclick()
    });
    $("#server_password").live("keypress", function(b) {
        if (b.which === 13) {
            $(".join_password_button:visible").click()
        }
    });
    $(".join_password_button").bind("click", function a(f) {
        f.preventDefault();
        var b = $(".friends_list"),
            d = $("#server_password").val(),
            c;
        if (b.is(":visible")) {
            c = b.find("li.active a.name").attr("href").replace("#", "");
            if (c) {
                joinPlayer(c, d)
            } else {
                throw new Error("Unable to get selected player")
            }
        } else {
            c = (APP.namespace("servers").collection.getSelected() || {}).id;
            if (c) {
                joinServer(c, d)
            } else {
                throw new Error("Unable to get selected server")
            }
        }
    });
    $(".friends_list li.friend .joinNow").live("click", function(b) {
        b.preventDefault();
        $(this).closest("a").dblclick()
    });
    $(".friends_list li.friend").live("dblclick", function(d) {
        d.preventDefault();
        var c = $(this);
        if (c.hasClass("status-ingame")) {
            if (c.find(".locked").length > 0) {
                showTooltip("PasswordProtectedServer", "password");
                $("#server_password").focus()
            } else {
                playSound("play_now");
                var b = c.find(".name").attr("href").replace("#", "");
                joinPlayer(b, "")
            }
        } else {
            playSound("error");
            showTooltip("FriendsError_1", "close")
        }
    });
    $(".friends_list .remove").live("click", function() {
        playSound("click", "Remove friend button");
        var b = $(this).parent();
        removePlayer(b)
    });
    $(".friends_list .more p a").live("click", function() {
        playSound("click", "Next friends page");
        var b = $(this).text();
        $(this).parents(".more").find(".reload_icon").addClass("active");
        changePlayerPage(b)
    });
    $(".reload_friends").not(".active").click(function(c) {
        c.preventDefault();
        $(this).addClass("active");
        playSound("click", "Reload friends");
        var b = $(".friends_list .more p span").text();
        if (b.length > 0) {
            changePlayerPage(b, false)
        } else {
            changePlayerPage(1, false)
        }
    });
    $("#frontend .show_offline_friends").click(function() {
        $(".reload_friends").click()
    });
    if (window.game) {
        window.matchmaking.addEventHandler("onStateChanged", "onMatchmakingStateChanged");
        window.matchmaking.addEventHandler("onQueueUpdated", "onMatchmakingQueueUpdated")
    }
    $("#frontend .header .menu .playnow .start_game").click(function(b) {
        b.preventDefault();
        $.magma.debugLog("debug", "User clicked play now!");
        playNow()
    });
    $("#frontend .header .menu .playnow .start_tutorial").click(function(b) {
        $.magma.debugLog("debug", "User clicked Tutorial");
        window.game.startTutorial();
        b.preventDefault()
    });
    $("#menu-tooltip").overlay({
        left: 387,
        top: 200,
        close: "a.close",
        mask: {
            color: "#000",
            loadSpeed: 0,
            closeSpeed: 0,
            opacity: 0.7
        },
        speed: "fast",
        closeOnClick: false,
        closeOnEsc: false,
        load: false,
        onLoad: function() {
            hideDoll();
            $("#exposeMask").detach().appendTo("#frontend");
            isMenuTooltipOpen = true
        },
        onClose: function() {
            isMenuTooltipOpen = false;
            showingErrorPopup = false;
            updateDoll()
        }
    });
    $("#menu-tooltip .buttons .close_cancel_search").click(function(b) {
        playSound("click", "Close/cancel search");
        if (window.matchmaking.state === 3) {
            $.magma.debugLog("warning", "Finalizing Cancel matchmaking search.");
            window.matchmaking.finalizeCancelSearch();
            $("#menu-tooltip").overlay().close()
        } else {
            $.magma.debugLog("warning", "Trying to Finalize Cancel matchmaking search when in wrong state")
        }
    });
    $("#menu-tooltip .buttons .cancel").live("click", function(b) {
        $("#menu-tooltip").overlay().close()
    });
    $("#menu-tooltip .buttons .cancel_search").click(function(b) {
        playSound("click", "Cancel matchmaking");
        if (window.matchmaking.state === 1) {
            $.magma.debugLog("warning", "Canceling matchmaking search.");
            window.matchmaking.cancelSearch()
        } else {
            $.magma.debugLog("warning", "Trying to cancel matchmaking search when not searching for game.")
        }
    });
    $("#menu-tooltip .buttons .cancel_queue").click(function(b) {
        window.matchmaking.leaveQueue();
        $("#menu-tooltip").overlay().close()
    });
    $("#menu-tooltip .buttons .close_reload").click(function(b) {
        $("#menu-tooltip").overlay().close()
    });
    $("#menu-tooltip .buttons .cancel_wait_stats").click(function(b) {
        countEORChecked = 9999;
        $("#menu-tooltip").overlay().close()
    });
    $("#menu-tooltip .buttons .play").click(function(b) {
        loaded_usecount_tooltip = true;
        playNow();
        b.preventDefault()
    });
    $("#menu-tooltip .buttons .equip").click(function(b) {
        b.preventDefault();
        equipBundle(bundle_items);
        bundle_items = [];
        $("#menu-tooltip").overlay().close()
    });
    $("#menu-tooltip .buttons .reload").click(function(b) {
        $.magma.reload();
        b.preventDefault()
    })
});
var defaultCameraTransitionTime = 0.5;

function updateDollIcons() {
    if (!updateDollIcons.$model) {
        updateDollIcons.$model = $("#soldierModel");
        updateDollIcons.$revert = updateDollIcons.$model.find("a.revert-try");
        updateDollIcons.$switch = updateDollIcons.$model.find("a.switch-team")
    }
    var a = updateDollIcons.$switch.hasClass("team-ru"),
        b = parseInt(default_appearance_team, 10);
    if (bundleOnDoll) {
        updateDollIcons.$revert.show();
        updateDollIcons.$switch.hide()
    } else {
        updateDollIcons.$revert.hide();
        updateDollIcons.$switch.show();
        if (b === 1) {
            if (!a) {
                updateDollIcons.$switch.addClass("team-ru")
            }
        } else {
            if (a) {
                updateDollIcons.$switch.removeClass("team-ru")
            }
        }
    }
}
window.showDoll = function() {
    APP._.defer(function() {
        if (window.doll) {
            window.doll.visible = true
        }
        if (!showDoll.$model) {
            showDoll.$model = $("#soldierModel")
        }
        showDoll.$model.show();
        updateDollIcons()
    })
};
window.hideDoll = function() {
    APP._.defer(function() {
        if (window.doll) {
            window.doll.visible = false
        }
        if (!hideDoll.$model) {
            hideDoll.$model = $("#soldierModel")
        }
        hideDoll.$model.hide();
        updateDollIcons()
    })
};
var dressDoll = (function() {
    var c = APP._,
        e = APP.ns("items"),
        f = null,
        d = APP.ns("config"),
        b = APP._.debounce(function(n, j) {
            j = j || [];
            var h = window.doll,
                l = n + "|" + j.join(":"),
                g, k, m = d.defaultCustomization,
                o = m[n][d.persona.kit].appearance.slice(0);
            o.push(m.head);
            o.push(m.hair);
            o.push(m.facialFeature);
            j = o.concat(j);
            if (h && f !== l) {
                h.updateItems = false;
                h.clearItems();
                h.setTeam(n);
                for (k = 0, g = j.length; k < g; k += 1) {
                    h.addItemEx(j[k])
                }
                f = l;
                h.updateItems = true
            }
            updateDollIcons();
            APP.trigger("doll:dress", j, bundleOnDoll)
        }, 100);
    return function a(h) {
        var i = parseInt(default_appearance_team, 10),
            g = [];
        if (h) {
            if (h instanceof APP.Model.Item) {
                if (h.isItemType("bundle")) {
                    g = APP._.pluck(h.get("items"), "id")
                } else {
                    g = [h.id]
                }
                bundleOnDoll = h
            } else {
                g = h;
                bundleOnDoll = true
            }
        } else {
            g = c.pluck(e.collection.getEquipped("appearance").filter(function(j) {
                return !j.isDefault()
            }), "id");
            bundleOnDoll = false
        }
        b(i, g)
    }
}());

function getCurrentPage() {
    var a;
    if ($("ul.menu .submenu a.active").length > 0) {
        a = $("ul.menu .submenu a.active").attr("href").replace("#", "")
    } else {
        a = $("ul.menu a.active").attr("href").replace("#", "")
    }
    return a
}
var dollState;

function updateDoll(a) {
    a = a || {};
    if (a.hasOwnProperty("timeout")) {
        return setTimeout(function c() {
            delete(a.timeout);
            updateDoll(a)
        }, a.timeout)
    }
    var b = ((APP.$frontend.find("div.main").not(".hidden").attr("class") || "").match(/main_([^\s]+)/) || []).pop();
    if (dontUpdateDoll) {
        return false
    }
    if (window.doll) {
        dollState = window.doll.visible
    }
    if (b === "home" || b === "appearance" || b === "bundles" || b === "emotes") {
        if (!dollState) {
            showDoll()
        }
    } else {
        if (dollState) {
            hideDoll()
        }
    }
}

function switchDollTeam() {
    default_appearance_team = parseInt(default_appearance_team, 10);
    if (default_appearance_team === 2) {
        default_appearance_team = 1
    } else {
        default_appearance_team = 2
    }
    dressDoll()
}
var lastMousePosition = [];

function rotateDoll(c) {
    if (window.doll) {
        var d = 25,
            a = Math.round(window.doll.camAzimuth),
            b = c.pageX - lastMousePosition[0];
        if (b > d) {
            b = d
        } else {
            if (b < 0 - d) {
                b = 0 - d
            }
        }
        if (window.doll) {
            window.doll.camAzimuth = (a - b)
        }
    }
    lastMousePosition = [c.pageX, c.pageY]
}

function initDoll() {
    var c = window.doll,
        d = -35,
        b = 61,
        f = 399,
        a = 640,
        e;
    if (isGameRunningIn800()) {
        e = $("html").width() / 2048;
        d = 50;
        b = b * e + 1;
        f = f * e;
        a = a * e
    }
    hideDoll();
    if (c) {
        c.init(f, a);
        c.setTeam(2);
        c.setDestRect(d - 230, b, f * 2.2, a);
        c.camAzimuth = 205;
        c.camZenith = 80;
        c.camDistance = 2.5;
        c.setCameraLookAt(0.05, 0.85, 0);
        c.camTransitionTime = 0
    }
    dressDoll();
    updateDoll()
}
APP.domTask("old-doll", function taskDoll(d) {
    var k = APP.ns("appearance"),
        j = new APP.Model.Item(),
        g = $('<div id="soldierModel"></div>'),
        c = $(APP.doc.body),
        i = $('<a href="#revert-try" class="revert-try"></a>').appendTo(g),
        b = $('<a href="#switch-team" class="switch-team"></a>').appendTo(g),
        a, f = false;
    i.bind("click", function h(l) {
        l.preventDefault();
        l.stopImmediatePropagation();
        APP.trigger("doll:undress", bundleOnDoll);
        dressDoll()
    });
    g.bind("click", function e(l) {
        l.preventDefault();
        if (!bundleOnDoll && a[0] === l.pageX && a[1] === l.pageY) {
            switchDollTeam()
        }
    });
    g.mousedown(function(l) {
        lastMousePosition = a = [event.pageX, event.pageY];
        if (window.doll) {
            window.doll.camTransitionTime = 0
        }
        k.trigger("highlight", j, "doll");
        c.bind("mousemove", rotateDoll);
        f = true
    });
    $(APP.win).mouseup(function(l) {
        if (f) {
            k.trigger("highlight", null, "doll");
            c.unbind("mousemove", rotateDoll);
            lastMousePosition = [0, 0]
        }
        f = false
    });
    g.appendTo("#frontend");
    d()
});
var channel_max = 10,
    audiochannels = [],
    soundMapping = {};
(function() {
    for (var a = 0; a < channel_max; a += 1) {
        audiochannels[a] = {
            channel: new Audio(),
            finished: -1
        }
    }
    soundMapping.loading_splash = "Loading";
    soundMapping.click = "Click";
    soundMapping.select_item = "Cash";
    soundMapping.open_menu = "Select";
    soundMapping.pickup_item = "Pickup";
    soundMapping.drop_item = "Drop";
    soundMapping.error = "Error";
    soundMapping.bottom_bar_open = "BarSlideUp";
    soundMapping.bottom_bar_close = "BarSlideDown";
    soundMapping.click_buy = "ClickBuy";
    soundMapping.play_now = "PlayNow";
    soundMapping.eor_splash = "Loading";
    soundMapping.LoadedSoldier = "LoadedSoldier";
    soundMapping.Loaded = "Loaded";
    soundMapping.ClickBuy = "ClickBuy";
    soundMapping.Reset = "Reset";
    soundMapping.TrainingPoint = "TrainingPoint";
    soundMapping.BonusSplash = "BonusSplash";
    soundMapping.Counter = "Counter";
    soundMapping.Ready = "Ready";
    soundMapping.level_up = "LevelUp"
}());

function playsoundInBrowser(d) {
    var a = audiochannels.length,
        c = 0,
        e, b, f;
    for (; c < a; c += 1) {
        f = new Date();
        e = audiochannels[c];
        if (e.finished < f.getTime()) {
            b = document.getElementById(d);
            if (b) {
                e.finished = f.getTime() + b.duration * 1000;
                e.channel.src = b.src;
                e.channel.load();
                e.channel.play();
                break
            }
        }
    }
}

function playSound(b, a) {
    if (a) {
        $.magma.debugLog("debug", "Playing sound " + soundMapping[b] + ": " + a)
    } else {
        $.magma.debugLog("debug", "Playing sound " + soundMapping[b])
    }
    if (window.game) {
        window.game.playSound(soundMapping[b])
    } else {
        playsoundInBrowser("sound_" + soundMapping[b])
    }
}
APP.task("old-sound", "game-sound", function taskOldSound(a) {
    var b = APP.ns("game");
    $("ul.menu a").mouseenter(function() {
        b.sound("hover")
    });
    $(".button").click(function() {
        b.sound("click")
    });
    a()
});

function updateMenuPoints() {
    var b = APP.ns("items").collection.get("tp"),
        c = b.get("trainingPointsCurrent"),
        g = b.get("extraPointsMax"),
        e = b.get("extraPointsPurchased"),
        a = $("#frontend div.header ul.menu li.abilities a span"),
        f = $("#available_points"),
        d = $("div.main.main_abilities");
    if (c === 0) {
        a.addClass("hidden");
        f.removeClass("active")
    } else {
        a.html(c).removeClass("hidden").renderText();
        f.addClass("active")
    }
    f.html(c).renderText();
    if (e === g) {
        $("#buy_training_points").addClass("hidden")
    }
    d.find(".abilities_bar .button-content").renderText();
    d.removeClass("loading")
}

function newTrainingPoints() {
    if (false) {
        showTooltip("NewTrainingPoints", "training")
    }
}

function updateAbilities(c) {
    var d = $("div.main.main_abilities"),
        b = $(c),
        a = b.eq(0),
        f = APP.namespace("items");
    if (a.attr("id") === "ability_error") {
        APP.trigger("error", a.text());
        a.addClass("hidden").remove()
    }
    playSound("TrainingPoint", "Bought ability");
    f.refreshWeapons(function e() {
        d.empty().append(b);
        f.collection.get("tp").set({
            prices: f.trainingPointOffers,
            extraPointsPurchased: f.extraPointsPurchased,
            extraPointsMax: f.extraPointsMax,
            trainingPointsCurrent: f.trainingPointsCurrent
        });
        d.disableTextSelect();
        d.find("a, span").disableTextSelect();
        d.find("h2, h3, .use_cufon").renderText({
            hover: true,
            hoverables: {
                span: true,
                div: true,
                a: true
            },
            ignoreClass: "nocufon"
        });
        APP.ns("abilities").collection.trigger("refresh");
        APP.ns("game").trigger("giveitems");
        updateMenuPoints();
        buyAbility.busy = false
    })
}

function buyAbility(c) {
    buyAbility.busy = true;
    var b = $(c),
        f = b.find("span.item-ability").attr("abilityid"),
        a = purchase_ability_url.replace("ABILITYID", f);
    b.addClass("loading");
    $.ajax({
        type: "POST",
        url: a,
        cache: false,
        success: function e(g) {
            updateAbilities(g)
        },
        error: function d(g, i, h) {
            playSound("error", "Buy ability error");
            $.magma.debugLog("warning", "Buy ability failed!");
            buyAbility.busy = false
        }
    })
}
buyAbility.busy = false;
APP.domTask("old-abilities", ["items"], function initOldAbilities(n) {
    var a = $(".main.main_abilities"),
        c = new APP.View.Tooltip({
            className: "abilities-tooltip"
        }).attach(),
        g, p = 500,
        k = APP.namespace("store"),
        q = APP.namespace("items"),
        e = APP.namespace("abilities"),
        m = q.collection.get("tp"),
        l = a.find(".abilities_bar .reset_abilities");
    APP.bind("crash!", function() {
        var s = 0,
            u = function u() {
                if (!buyAbility.busy) {
                    APP.log("CRASH", s++, $.renderText.count);
                    if (parseInt(a.find(".abilities_bar .points").text(), 10) > 0) {
                        a.find("a.unlocked").click()
                    } else {
                        a.find("a.reset_abilities").click()
                    }
                }
                setTimeout(u, 200)
            };
        u()
    });
    a.delegate("a.locked", "click", function f(s) {
        s.preventDefault()
    });
    a.delegate("a.unlocked", "click", function j(y) {
        y.preventDefault();
        if (buyAbility.busy) {
            return
        }
        var u = a.find(".abilities_bar .points"),
            w = this,
            s = m.get("extraPointsMax"),
            x = m.get("extraPointsPurchased"),
            v = m.get("trainingPointsCurrent");
        if (v === 0 && x < s && !l.hasClass("trying")) {
            k.trigger("buy", m);
            c.hide()
        } else {
            if (parseInt(u.text(), 10) > 0 && !l.hasClass("trying")) {
                a.find("a.ability").removeClass("started full unlocked").addClass("empty locked");
                clearTimeout(g);
                c.hide();
                setTimeout(function() {
                    buyAbility.busy = true;
                    buyAbility(w)
                }, 0)
            }
        }
    });
    a.delegate("#buy_training_points", "click", function o(w) {
        w.preventDefault();
        if (buyAbility.busy) {
            return
        }
        var s = m.get("extraPointsMax"),
            v = m.get("extraPointsPurchased"),
            u = m.get("trainingPointsCurrent");
        if (v < s && !l.hasClass("trying")) {
            k.trigger("buy", m)
        }
    });
    a.delegate("a.reset_abilities", "click", function i(w) {
        w.preventDefault();
        if (buyAbility.busy) {
            return
        }
        var u = a.find(".abilities_bar .reset_abilities");
        if (!u.hasClass("trying")) {
            a.addClass("loading");
            a.find("a.ability").removeClass("started full unlocked").addClass("empty locked");
            clearTimeout(g);
            c.hide();
            u.addClass("trying");
            buyAbility.busy = true;
            $.ajax({
                type: "POST",
                url: reset_abilities_url,
                cache: false,
                success: function x(y) {
                    updateAbilities(y)
                },
                error: function s(y, A, z) {
                    $.magma.debugLog("warning", "Abilities reset failed! " + A);
                    buyAbility.busy = false
                },
                complete: function v() {
                    u.removeClass("trying")
                }
            })
        }
    });
    $("#menu-tooltip .buttons .training_button").click(function() {
        $("#menu-tooltip").overlay().close();
        $("#frontend .header .menu .abilities a").click()
    });
    a.delegate("a.ability", "mouseenter", function b() {
        var s = $(this),
            u = s.find("span.item-ability");
        clearTimeout(g);
        g = setTimeout(function v() {
            var w = parseInt(u.attr("level"), 0),
                z = u.attr("available") === "true",
                x = u.attr("name"),
                I = u.attr("description"),
                A = u.attr("dependency"),
                G = (A ? e.collection.getByName(A).get("maxlevel") : false),
                B = (A ? e.collection.getByName(A).get("level") : false),
                C = ["<h1>" + x + "</h1>", "<p>" + I + "</p>"],
                E = APP.ns("items").collection.get("tp"),
                H = E.get("extraPointsMax"),
                D = E.get("extraPointsPurchased"),
                y = E.get("trainingPointsCurrent"),
                F = u.closest(".tier").find(".neededpoints").text();
            if (w && w < parseInt(u.attr("maxlevel"), 10)) {
                C.push("<h2>Next Level</h2>");
                C.push("<p>" + u.attr("upgrade" + w) + "</p>")
            }
            if (y === 0 && D < H && z) {
                C.push('<p class="notice">' + APP.sidis.trans("WEB_GAME_ABILITIES_BUY_POINTS_TIP") + "</p>")
            }
            if (A && B < G) {
                C.push("<h2>Requirement</h2>");
                C.push("<p>" + A + " " + G + "/" + G + "</p>")
            }
            if (u.closest(".tier").hasClass("locked")) {
                C.push('<p class="notice">You need to spend ' + F + (F > 1 ? " more training points" : " more training point") + " in this tree to unlock this tier</p>")
            }
            c.renderHTMLAndShow(C.join(""), s);
            c.$el.find("h1, h2, h3").renderText()
        }, p)
    });
    a.delegate("a.ability", "mouseleave", function h() {
        clearTimeout(g);
        c.hide()
    });
    a.disableTextSelect();
    a.find("a, span").disableTextSelect();
    m.bind("purchase:start", function d() {
        a.addClass("loading");
        buyAbility.busy = true
    });
    m.bind("purchase:end", function r() {
        updateMenuPoints();
        buyAbility.busy = false
    });
    updateMenuPoints();
    n()
});