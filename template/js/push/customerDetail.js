$(function() {
    $('#clickVisit').bind('click', function(e) {

        if (!navigator.geolocation) {
            Msg.alert("不支持位置定位");
        } else {
            if (HybridJS.browser().ios) {
                HybridJS.getPosition(document.getElementById('userPosition'));
            } else {
                navigator.geolocation.getCurrentPosition(function(pos) {
                    $('#userPosition').val('{"latitude":"' + pos.coords.latitude + '","longitude":"' + pos.coords.longitude + '"}');
                    $('#visitNotes').slideDown();
                });
            }

        }

    });
    //监听属性的变化。
    var positionDOM = document.getElementById('userPosition');
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var mo = new MutationObserver(function() {
        $('#visitNotes').slideDown();
    });
    mo.observe(positionDOM, {
        'attributes': true
    });


    $('#notesClose').bind('click', function(e) {
        var userPosition = $('#userPosition').val();
        if (!userPosition) {
            Msg.alert('未获取到当前位置！');
            return false;
        }
        $('#visitNotes').slideUp();
        var notes = $('#visitNotesContent textarea').val();
        $('#clickVisit').html('已拜访');
        $('form').submit();
    })
    $('#backVisitMain').bind('click', function(e) {
        e.stopPropagation()
        $('#visitNotes').slideUp();
        $('#visitNotesContent textarea').val('');
        return false;
    });
    $(".close").bind('click', function(event) {
        /* Act on the event */
        $('#visitNotes').slideDown();
    });
})
