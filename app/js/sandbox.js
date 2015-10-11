var Sandbox = function(core, module_selector){
    var CONTAINER = core.dom.query('#' moduleSelector);
    return {
        find: function(selector){
            return CONTAINER.find(selector)[0];
        },
        findAll: function(selector){
            return CONTAINER.find(selector);
        },
        addEvent: function(elem, evt, fn){
            core.dom.bind(elem, evt, fn);
        },
        removeEvent: function(elem, evt, fn){
            core.dom.unbind(elem, evt, fn);
        },
        notify: function(evt){
            core.triggerEvent(evt);
        },
        listen: function(evts){
            core.registerEvents(evts, moduleSelector);
        },
        ignore: function(evts){
            core.removeEvents(evts, moduleSelector);
        }
    }
}
