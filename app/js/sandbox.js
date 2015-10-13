var Sandbox = function(){
    var CONTAINER, CORE, MODULE_SELECTOR;
    return {
        create: function(core, moduleSelector){
            CONTAINER = core.dom.query('#' + moduleSelector);
            CORE = core;
            MODULE_SELECTOR = moduleSelector;
            return this;
        },
        find: function(selector){
            return CONTAINER.find(selector)[0];
        },
        findAll: function(selector){
            return CONTAINER.query(selector);
        },
        addEvent: function(elem, evt, fn){
            CORE.dom.bind(elem, evt, fn);
        },
        removeEvent: function(elem, evt, fn){
            CORE.dom.unbind(elem, evt, fn);
        },
        notify: function(evt){
            CORE.triggerEvent(evt);
        },
        listen: function(evts){
            CORE.registerEvents(evts, MODULE_SELECTOR);
        },
        ignore: function(evts){
            CORE.removeEvents(evts, MODULE_SELECTOR);
        }
    }
}();
