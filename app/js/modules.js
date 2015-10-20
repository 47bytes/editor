CORE.createModule('editable', function(sb){
    var thiz = this;
    var editableElementTypes = [
        'div',
        'span',
        'p',
        'h1',
        'h2',
        'h3',
        'h4'
    ];
    var editableElements = [];

    return {
        init: function(){
            var i, j;
            var editableElem;
            for(i = 0; i < editableElementTypes.length; i++){
                editable = editableElementTypes[i];
                // get all editable elements
                editableElems = sb.findAll(editable);
                for(j = 0; j < editableElems.length; j++){
                    editableElem = editableElems[j];
                    // we cache the elements for later destruction
                    editableElements.push(editableElem);
                    // attach click event for every editable element
                    sb.addEvent(editableElem, 'click', this.edit);
                }
            }

        },
        destroy: function(){
            var i;
            for(i = 0; i < editableElements.length; i++ ){
                sb.removeEvent(editableElements[i], 'click', null);
            }
        },

        edit: function(e){
            sb.notify({
                type: 'editing',
                data: e.currentTarget
            })
            sb.hide();

        },

    }
});

CORE.createModule('editor', function(sb){
    var thiz = this;
    return {
        init: function(){
            sb.listen({
                'editing': this.editContent
            });

        },
        destroy: function(){
            sb.ignore(['editing']);
        },
        editContent: function(content){
            console.dir(content);
        }

    }
});

CORE.createModule('toolbar', function(sb){
    var thiz = this;
    return {
        init: function(){
        },
        destroy: function(){

        },
    }
});


CORE.startAll();
