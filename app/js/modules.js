CORE.createModule('editable', function(sb){
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
            var i = 0;
            var j = 0;
            var editableElem;
            for(; editable = editableElementTypes[i++]; ){
                console.log("editable****");
                console.log(editable)
                // get all editable elements
                editableElems = sb.findAll(editable);
                console.log('editableElems*********');
                console.log(editableElems);
                for(j = 0; j<editableElems.length; j++){
                    editableElem = editableElems[j];
                    // we cache the elements for later destruction
                    editableElements.push(editableElem);
                    // attach click event for every editable element
                    console.log('****************************'+editableElem);
                    sb.addEvent(editableElem, 'click', function(){console.log('click')});
                }
            }

        },
        destroy: function(){
            var i = 0;
            for(; editable = editableElements[i++]; ){
                sb.removeEvent(editable, 'click', null);
            }
        },
        edit: function(e){
            console.log('click');
            sb.notify({
                type: 'editing',
                data: e.currentTarget.innerHTML
            });
        }
    }
});

CORE.createModule('editor', function(sb){
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
            console.log(content);
        }

    }
});

CORE.createModule('toolbar', function(sb){
    return {
        init: function(){

        },
        destroy: function(){

        },
    }
});

CORE.startAll();
