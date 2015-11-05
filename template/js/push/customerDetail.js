$(function(){
    $('#clickVisit').bind('click',function(e){
        elmVist = $(this);
        $('#visitNotes').slideDown()
    })
    $('#notesClose').bind('click',function(e){
        $('#visitNotes').slideUp();
        var notes = $('#visitNotesContent textarea').val();
        $('#clickVisit').html('已拜访')
    })
    $('#backVisitMain').bind('click',function(e){
        e.stopPropagation()
        $('#visitNotes').slideUp();
        $('#visitNotesContent textarea').val('');
        return false;
    })
})