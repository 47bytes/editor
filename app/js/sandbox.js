var Sandbox = function(){
    var CONTAINER, CORE, MODULE_SELECTOR;
    return {
        create: function(core, module){
            CORE = core;
            MODULE = module;
            MODULE_SELECTOR = '#' + module;
            CONTAINER = core.dom.query(MODULE_SELECTOR);
            return this;
        },
        find: function(selector){
            console.log('find request from: '+MODULE_SELECTOR);
            return CONTAINER.find(selector)[0];
        },
        findAll: function(selector){
            console.log('find request from: '+MODULE_SELECTOR);
            return CONTAINER.query(selector);
        },
        hide: function(){
            console.log('hide request for '+MODULE_SELECTOR);
            CORE.dom.animate.hide(MODULE_SELECTOR);
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
            CORE.registerEvents(evts, MODULE);
        },
        ignore: function(evts){
            CORE.removeEvents(evts, MODULE);
        }
    }
};
