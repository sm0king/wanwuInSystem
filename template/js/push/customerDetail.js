$(function(){
    $('#clickVisit').bind('click',function(e){
        elmVist = $(this);
        $('#visitNotes').show()
    })
    $('#notesClose').bind('click',function(e){
        $('#visitNotes').hide();
        var notes = $('#visitNotesContent textarea').val();
        $('#clickVisit').html('已拜访')
    })
    $('#backVisitMain').bind('click',function(e){
        e.stopPropagation()
        $('#visitNotes').hide();
        $('#visitNotesContent textarea').value('');
        return false;
    })
})