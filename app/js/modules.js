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
                editableElems = sb.dom.find(editable);
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

        edit: function(evnt){
            console.log(evnt.current);
            sb.notify({
                type: 'editable-editing',
                data: evnt.currentTarget
            })
            sb.dom.animate.hide();

        },

        commit: function(data){
            var changedElem = sb.dom.findOne(data.selector);
            changedElem.innerHTML = data.content;
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
                'editable-editing': this.editContent,
                'toolbar-editor-action-bold': this.edit.bold,
                'toolbar-editor-action-italic': this.edit.italic,
                'toolbar-editor-action-strikethrough': this.edit.strikethrough,
                'toolbar-editor-action-link': this.edit.link,
                'toolbar-editor-action-quote': this.edit.quote,
                'toolbar-editor-action-ul': this.edit.ul,
                'toolbar-editor-action-ol': this.edit.ol
            });
            sb.addEvent('#leave-editor', 'click', this.leaveEditor);
        },
        destroy: function(){
            sb.ignore(['editable-editing']);
        },
        edit: {
            bold: function(content){
                console.log('bold');
            },
            italic: function(content){
                console.log('italic');
            },
            strikethrough: function(content){
                console.log('strikethrough');
            },
            link: function(content){
                console.log('link');
            },
            quote: function(content){
                console.log('quote');
            },
            ul: function(content){
                console.log('ul');
            },
            ol: function(content){
                console.log('ol');
            }
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

        leaveEditor: function(evnt){
            var content = sb.dom.self();
            sb.notify({
                type: 'editor-commit',
                data: {
                    content: content,
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

            var buttons = sb.dom.find('button');
            for(var i = 0; i < buttons.length; i++){
                for(var j = 0; j < buttons[i].attributes.length; j++){
                    if(buttons[i].attributes[j].nodeName == 'data-cm-toolbar-button'){
                        sb.addEvent(buttons[i], 'click', function(evnt){
                            console.log('registered');
                            sb.notify({
                                type: 'toolbar-editor-action-'+buttons[i].attributes[j].nodeValue,
                                data: evnt
                            });
                        })
                    }
                }
            }
        },
        destroy: function(){

        },
        render: function(){

        },
        show: function(){
            sb.dom.animate.show();
        },
        hide: function(){
            sb.dom.animate.hide();
        }
    }
});


CORE.startAll();
