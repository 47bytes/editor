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
    var editedContent;
    thiz.content = null;
    return {
        init: function(){
            sb.listen({
                'editable-editing': this.startEditor,
                'toolbar-editor-action-bold': this.handler,
                'toolbar-editor-action-italic': this.handler,
                'toolbar-editor-action-strikethrough': this.handler,
                'toolbar-editor-action-link': this.handler,
                'toolbar-editor-action-quote': this.handler,
                'toolbar-editor-action-ul': this.handler,
                'toolbar-editor-action-ol': this.handler
            });
            sb.addEvent('#leave-editor', 'click', this.leaveEditor);
            sb.addEvent('#editor', 'input', this.handler);
        },
        destroy: function(){
            sb.ignore(['editable-editing']);
        },

        handler: function(evnt){
            var content, tmpContent, selection;
            var edit = {
                bold: function(content){
                    return '<b>'+content+'</b>';
                },
                italic: function(content){
                    return '<em>'+content+'</em>';
                },
                strikethrough: function(content){
                    return '<strike>'+content+'</strike>';
                },
                link: function(content){
                    return '<a href="#">'+content+'</a>';
                },
                quote: function(content){
                    return '<b>'+content+'</b>';
                },
                ul: function(content){
                    return '<b>'+content+'</b>';
                },
                ol: function(content){
                    return '<b>'+content+'</b>';
                }
            };
            // 1. find out who triggered this function
            if(evnt.action){
                // toolbar action event

                // BUG: if an action is selected the selected area needs
                // to be recalculated because of the tags inserted
                content = thiz.content.slice(
                    evnt.selection.anchorOffset, // beginning of selection
                    evnt.selection.focusOffset // end of selection
                );
                // everything leading up to the selection
                preSelection = thiz.content.slice(0, evnt.selection.anchorOffset);
                // everything after the selection
                postSelection = thiz.content.slice(evnt.selection.focusOffset);
                tmpContent = edit[evnt.action](content);
                content = preSelection + tmpContent + postSelection;

            }else{
                content = evnt.currentTarget.innerHTML;
            }
            // 2. find out what action to call
            // 3. put result into thiz.content

            thiz.content = content;
            console.log(thiz.content);
        },

        startEditor: function(content){
            console.log('****');
            console.log(content);
            sb.notify({
                type: 'editor-toolbar-show'
            })
            thiz.editedID = content.id;
            thiz.content = content.innerHTML;
            sb.dom.content(thiz.content, {
                escapeHTML: false
            });
            sb.dom.edit();
            //console.log(content);
        },

        leaveEditor: function(evnt){
            sb.notify({
                type: 'editor-commit',
                data: {
                    content: thiz.content,
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
                sb.addEvent(buttons[i], 'click', function(evnt){
                    var button = evnt.currentTarget;
                    for(var j = 0; j < button.attributes.length; j++){
                        if(button.attributes[j].nodeName == 'data-cm-toolbar-button'){
                            sb.notify({
                                type: 'toolbar-editor-action-'+button.attributes[j].nodeValue,
                                data: {
                                    evnt: evnt,
                                    selection: window.getSelection(),
                                    action: button.attributes[j].nodeValue
                                }
                            });
                        }
                    }
                });
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
