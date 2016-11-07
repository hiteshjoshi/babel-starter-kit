/**
 * Created by Philippe Assis
 * assis@philippeassis.com
 * https://github.com/hiteshjoshi/jquery-rest-client
 */
;
(function(jQuery) {

    jQuery.RestClient = function(api, options) {

        if (typeof api == 'object') {
            options = {
                'api': api
            }
        } else {
            if (typeof options == 'object') {
                options.api = api;
            } else {
                options = {
                    'api': api
                }
            }
        }

        var myName = 'API',
            settings = jQuery.extend({
                waitingTime: 300,
                waitLoopLimit: 60,
                logger: 0,
                fnError: function(msg) {
                    //...
                },
                setup: {
                    cache: false,
                    dataType: 'json',
                    headers: {}
                }
            }, options || {}),
            logInfo = function(msg) {
                if (settings.logger <= 1) {
                    console.log(myName + ': ' + msg)
                }
            },
            logError = function(msg) {
                if (settings.logger <= 2) {
                    console.error(myName + ': ' + msg)
                }
            },
            fnError = function(msg) {
                logError(msg)
                settings.fnError(msg);
            },
            semaphore = {},
            waiting = null,
            restCount = 0,
            then = function(obj, callback) {

                var _waiting = (obj.parent > -1 && obj.waiting) ? obj.waiting : waiting
                if (_waiting && !semaphore[_waiting]) {
                    logInfo('Trying... ' + obj.key)
                    if (obj.waitingCount < settings.waitLoopLimit) {
                        var fnTest = function() {
                            ++obj.waitingCount;
                            then(obj, callback);
                        }

                        var t = setTimeout(fnTest, settings.waitingTime)
                    } else {
                        return fnError("Wait too long, canceled operation. [" + obj.key + ":" + obj.section + "]");
                    }
                } else {
                    //var headers = jQuery.extend(obj.current.headers, (settings.setup.headers || {}));

                    //delete settings.setup.headers;

                    var ajaxOptions = jQuery.extend(true, {
                        method: obj.current.method,
                        url: settings.api + '/' + obj.url + obj.current.path,
                        success: callback || null,
                        cache: settings.cache,
                        headers: obj.current.headers
                    }, settings.setup || {});

                    if (obj.current.method == "POST" || obj.current.method == "PUT") {
                        ajaxOptions.data = JSON.stringify(obj.current.data);
                    } else if (obj.current.method == "GET") {
                        ajaxOptions.data = jQuery.extend(obj.current.query || {}, obj.current.data || {});
                    }
                    return jQuery.ajax(ajaxOptions);
                }
            },
            restControl = function(section, url) {
                this.waitingCount = 0;
                this.section = section;
                this.url = url;
                this.parent = -1;
                this.waiting = null;
                this.key = restCount++;
                this.current = this.currentClean = {
                    method: null,
                    query: null,
                    data: null,
                    path: '',
                    headers: {}
                }

                this.childrens = [];

                this.wait = function(name) {
                    if (semaphore[name] === true) {
                        return this;
                    }

                    semaphore[name] = false;

                    if (this.parent > -1) {
                        logInfo('WAIT REGISTRY IN PARENT: ' + name + ' by ' + this.key)
                        this.waiting = name;
                    } else {
                        logInfo('WAIT REGISTRY WHIOUT PARENT: ' + name + ' by ' + this.key)
                        waiting = name;
                    }
                    return this;
                }

                this.release = function(name) {
                    semaphore[name] = true;
                    logInfo('WAIT UNREGISTRED: ' + name + ' by ' + this.key)
                    return this;
                }

                this.setApi = function(value) {
                    settings.api = url = value;
                    return this;
                }

                this.add = function(newSection, newUrl) {
                    if (typeof newSection == 'object') {
                        for (var key in newSection) {
                            this.add(key, newSection[key])
                        }
                        return;
                    }

                    this.childrens.push(newSection);
                    var url = newUrl || newSection

                    if (this.url) {
                        url = this.url + '/' + url;
                    }

                    this[newSection] = new restControl(newSection, url);
                    this[newSection].parent = this.key
                }

                this.query = function(name, value) {
                    if (typeof name == 'object') {
                        this.current.query = name;
                    } else {
                        this.current.query = {};
                        this.current.query[name] = value;
                    }

                    if (!this.current.method) {
                        this.current.method = 'GET';
                    }

                    return this;
                }

                this.data = function(name, value) {
                    if (typeof name == 'object') {
                        this.current.data = name;
                    } else {
                        this.current.data = {};
                        this.current.data[name] = value;
                    }

                    if (!this.current.method) {
                        this.current.method = 'POST';
                    }
                    return this;
                }

                this.defaultHeaders = function(values) {
                    settings.setup.headers = jQuery.extend(settings.setup.headers, values || {});
                    return this;
                }

                this.headers = function(values) {
                    this.current.headers = jQuery.extend(this.current.headers, values || {});
                    return this;
                }

                this.method = function(value) {
                    this.current.method = value;
                    return this;
                }

                this.isPost = function() {
                    this.current.method = "POST";
                    return this;
                }

                this.isGet = function() {
                    this.current.method = "GET";
                    return this;
                }

                this.isPut = function() {
                    this.current.method = "PUT";
                    return this;
                }

                this.isDelete = function() {
                    this.current.method = "DELETE";
                    return this;
                }

                this.token = function(xToken) {
                    this.defaultHeaders({
                        'Authorization': "Bearer " + xToken
                    })
                }

                this.clear = function(all) {
                    if (all) {
                        current = currentClean;
                    } else {
                        this.current.query = null;
                        this.current.data = null;
                        this.current.method = null;
                        this.current.path = '';
                    }
                }

                this.error = function(callback) {
                    settings.fnError = callback;
                }

                this.read = function(value) {
                    this.clear()
                    if (typeof value == "object") {
                        this.current.query = value;
                        this.current.path = '';
                    } else {
                        this.current.path = '/' + value;
                    }

                    this.current.method = "GET";

                    return this;
                }

                this.create = function(value) {
                    this.clear()
                    this.current.data = value;
                    this.current.method = "POST";
                    return this;
                }

                this.update = function(value) {
                    this.clear()
                    this.current.data = value;
                    this.current.method = "PUT";
                    return this;
                }

                this.delete = function(value) {
                    this.clear()
                    this.current.path = '/' + value;
                    this.current.method = "DELETE";
                    return this;
                }

                this.custom = function(value) {
                    this.current = {
                        method: value.method || null,
                        query: value.query || null,
                        data: value.query || null,
                        path: value.path || '',
                        headers: value.headers || {},
                    }
                    return this;
                }

                this.get = this.read;
                this.post = this.create;
                this.put = this.update;
                this.insert = this.create;
                this.del = this.delete;
                this.remove = this.delete;
                this.destroy = this.delete;

                this.then = function(callback) {
                    logInfo('Run the ' + this.key)
                    return then(this, callback)
                }

                this.exec = function(callback) {
                    logInfo('Run the ' + this.key)
                    return then(this)
                }

                return this;
            }

        return restControl(settings.api);
    }
})(jQuery);