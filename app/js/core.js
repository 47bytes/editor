var CORE = function(){
    var moduleData = {};
    return {
        /**
         * logging module
         * @return {[object]} [provides logging functionality for different log levels.]
         */
        logger: function(){
            var DEBUG = 0,
                INFO =  1,
                WARNING = 2,
                ERROR = 3,
                CRITICAL = 4;

            function debug(msg){
                console.log('DEBUG: '+msg);
            }

            function info(msg){
                console.log('INFO: '+msg);
            }

            function warning(msg){
                console.log('WARNING: '+msg);
            }

            function error(msg){
                console.log('ERROR: '+msg);
            }

            function critical(msg){
                console.log('CRITICAL: '+msg);
            }
            return {
                DEBUG: DEBUG,
                INFO: INFO,
                WARNING: WARNING,
                ERROR: ERROR,
                CRITICAL: CRITICAL,
                debug: debug,
                info: info,
                warning: warning,
                error: error,
                critical: critical,
                log: function(severity, msg){
                    // case severity is a string msg
                    if(typeof severity === 'string'){
                        severityString = severity.toLowerCase();
                        if(severityString == 'debug'){
                            debug(msg);
                        }else if(severityString == 'info'){
                            info(msg);
                        }else if(severityString == 'warning'){
                            warning(msg);
                        }else if(severityString == 'error'){
                            error(msg);
                        }else if(severityString == 'critical'){
                            critical(msg);
                        }else {
                            critical(msg);
                        }
                    // otherwise it's a flag
                    }else{
                        if(severity == DEBUG){
                            debug(msg);
                        }else if(severity == INFO){
                            info(msg);
                        }else if(severity == WARNING){
                            warning(msg);
                        }else if(severity == ERROR){
                            error(msg);
                        }else if(severity == CRITICAL){
                            critical(msg);
                        }else {
                            critical(msg);
                        }
                    }
                }
            }
        }(),
        /**
         * registers a new `Module` at the core
         * @param  {string} moduleID the `Modules` ID
         * @param  {[function]} creator  creation function
         */
        createModule: function(moduleID, creator){
            var temp;
            if(typeof moduleID === 'string' && typeof creator === 'function'){
                // we're going to call the creator so we can check
                // if it got init and destroy methods
                temp = creator(null);
                if(temp.init && temp.destroy && typeof temp.init === 'function' && typeof temp.destroy === 'function'){
                    moduleData[moduleID] = {
                        creator: creator,
                        instance: null
                    };
                    temp = null;
                }else{
                    this.logger.warning('Module '+ moduleID + 'registration failed: Module has no init or destroy method.');
                }
            }else{
                this.logger.warning('Module '+ moduleID + 'registration failed: argument moduleID has to be of type string, argument creator has to be of type function');
            }
        },
        start: function(moduleID){
            var module = moduleData[moduleID];
            var sn = Sandbox();
            if(module){
                //sn = Sandbox.create(this, moduleID);
                module.instance = module.creator(sn.create(this, moduleID));
                module.instance.init();

                this.logger.debug('Module `'+moduleID+'` started');
            }
        },
        startAll: function(){
            var moduleID,
                i = 0;
            for(moduleID in moduleData){
                this.start(moduleID);
            }
        },
        stop: function(moduleID){
            var module = moduleData[moduleID];
            if(module.instance){
                module.instance.destroy();
                module.instance = null;
            }else{
                // logging
            }
        },
        stopAll: function(){
            var moduleID;
            for (moduleID in moduleData) {
        		if (moduleData.hasOwnProperty(moduleID)) {
        			this.stop(moduleID);
        		}
        	}
        },
        dom: {
            query: function(selector, context){
                var result = {}, that = this, jqEls, i = 0;

                if(context && context.find){
                    jqEls = context.find(selector);
                }else{
                    jqEls = jQuery(selector);
                }

                result = jqEls.get();
                result.length = jqEls.length;
                result.query = function(selectr){
                    return that.query(selectr, jqEls);
                }
                return result;
            },
            bind: function(elem, evt, fn){
                if (elem && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    jQuery(elem).bind(evt, fn);
                } else {
                    // log wrong arguments
                }
            },
            unbind: function(elem, evt, fn){
                if (elem && evt) {
            		if (typeof evt === 'function') {
            			fn = evt;
            			evt = 'click';
            		}
            		jQuery(elem).unbind(evt, fn);
            	} else {
            		// log wrong arguments
            	}
            },
            animate: {
                hide: function(elem){
                    jQuery(elem).hide();
                }
            }
        },
        registerEvents: function(evts, module){
            if(this.is_obj(evts) && module){
                if(moduleData[module]){
                    moduleData[module].events = evts;
                }else{
                    this.logger.warning('Event registration failed: Module Unknown: There is no module '+module+' registered');
                }
            }else{
                this.logger.warning('Event registration failed: Parameter `evts` has to be of type object, `module` has to be of type string');
            }
        },
        removeEvents: function(evts, module){
            var i, evt;
        	if (this.is_arr(evts) && module && (mod = moduleData[module]) && mod.events) {
        		for (i = 0; i < evts.length; i++) {
        				delete mod.events[evts[i]];
        			}
        	}
        },
        triggerEvent: function(evt){
            var module;
        	for (var moduleID in moduleData) {
        		if (moduleData.hasOwnProperty(moduleID)){
        			module = moduleData[moduleID];
        			if (module.events && module.events[evt.type]) {
        				module.events[evt.type](evt.data);
        			}
        		}
        	}
        },
        is_arr : function (arr) {
            return jQuery.isArray(arr);
        },
        is_obj : function (obj) {
            return jQuery.isPlainObject(obj);
        }
    }
}();
