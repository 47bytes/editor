CORE.registerModule('editable', function(sb){
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

            sb.listen({
                'editor-commit': this.commit
            });

            for(i = 0; i < editableElementTypes.length; i++){
                editable = editableElementTypes[i];
                // get all editable elements
                editableElems = sb.dom.findAll(editable);
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
            console.log(e.current);
            sb.notify({
                type: 'editable-editing',
                data: e.currentTarget
            })
            sb.dom.animate.hide();

        },

        commit: function(e){
            var changedElem = sb.dom.find(e.selector);
            changedElem.innerHTML = e.content.innerHTML;
            sb.dom.animate.show();
        },

    }
});

CORE.registerModule('editor', function(sb){
    var thiz = this;
    var editedID;
    return {
        init: function(){
            sb.listen({
                'editable-editing': this.editContent
            });
            sb.addEvent('#editor', 'blur', this.leaveEditor);
        },
        destroy: function(){
            sb.ignore(['editable-editing']);
        },
        editContent: function(content){
            sb.notify({
                type: 'editor-toolbar-show'
            })
            thiz.editedID = content.id;
            sb.dom.content(content.innerHTML, {
                escapeHTML: false
            });
            sb.dom.edit();
            //console.log(content);
        },

        leaveEditor: function(e){
            sb.notify({
                type: 'editor-commit',
                data: {
                    content: e.currentTarget,
                    selector: '#'+thiz.editedID
                },
            });
            sb.notify({
                type: 'editor-toolbar-hide'
            });
            sb.dom.content("");
        }

    }
});

CORE.registerModule('toolbar', function(sb){
    var thiz = this;
    return {
        init: function(){
            sb.dom.animate.hide();
            sb.listen({
                'editor-toolbar-show': this.show,
                'editor-toolbar-hide': this.hide
            })
        },
        destroy: function(){

        },
        render: function(){

        },
        show: function(){
            console.log('yaa');
            sb.dom.animate.show();
        },
        hide: function(){
            sb.dom.animate.hide();
        }
    }
});


CORE.startAll();
