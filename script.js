var btn = document.querySelector('#submit-button');

btn.addEventListener('click', function() {
    var input = document.querySelector('#input');
    if (input.files.length == 0) {
        alert("Upload at least one JSON file");
        return;
    }
    var no_ducks = document.querySelector('#delete-ducks').checked;
    var no_walls = document.querySelector('#delete-walls').checked;
    var no_bombs = document.querySelector('#delete-bombs').checked;
    
    var time_factor = 1;
    if (document.querySelector('#slow-time-oneone').checked)
        time_factor = 1.1;
    else if (document.querySelector('#slow-time-onetwo').checked)
        time_factor = 1.2;
    else if (document.querySelector('#slow-time-two').checked)
        time_factor = 2;

    for (var i = 0; i < input.files.length; i++) {
        (function () {
            var reader = new FileReader();
            var file = input.files[i];
            reader.onload = function(event) {
                onReaderLoad(event, file);
            };
          reader.readAsText(input.files[i]);
        }());
    }

    function onReaderLoad(event, file) {
        var notes = '--' + file.name + '--\n';

        try {
            var obj = JSON.parse(event.target.result);
        }
        catch(error) {
            notes += 'Error - Not a valid JSON file\nFAILED\n\n';
            addNote(notes);
            return;
        }

        if ((!obj._notes || !obj._obstacles) && !obj.songName) {
            notes += 'Error - Not a valid song or info file\nFAILED\n\n';
            addNote(notes);
            return;
        }

        if (obj._notes) {
            // song file
            if (no_ducks) {
                var obstacles = [];
                for (var i = 0; i < obj._obstacles.length; i++) {
                    if (obj._obstacles[i]._type != 1) {
                        obstacles.push(obj._obstacles[i]);
                    }
                }
                obj._obstacles = obstacles;
            }
            if (no_walls) {
                obj._obstacles = [];
            }
            if (no_bombs) {
                var note_blocks = [];
                for (var i = 0; i < obj._notes.length; i++) {
                    if (obj._notes[i]._type != 3) {
                        note_blocks.push(obj._notes[i]);
                    }
                }
                obj._notes = note_blocks;
            }
            if (time_factor != 1) {
                var note_blocks = [];
                for (var i = 0; i < obj._notes.length; i++) {
                    var note = obj._notes[i];
                    note._time = note._time * time_factor;
                    note_blocks.push(note);
                }
                obj._notes = note_blocks;
                var events = [];
                for (var i = 0; i < obj._events.length; i++) {
                    var event = obj._events[i];
                    event._time = event._time * time_factor;
                    events.push(event);
                }
                obj._events = events;
                var obstacles = [];
                for (var i = 0; i < obj._obstacles.length; i++) {
                    var ob = obj._obstacles[i];
                    ob._time = ob._time * time_factor;
                    obstacles.push(ob);
                }
                obj._obstacles = obstacles;
            }
        }
        else {
            // info file
            var description = " (edit";
            if (no_ducks)
                description += ", no ducks";
            if (no_walls)
                description += ", no walls";
            if (no_bombs)
                description += ", no bombs";
            if (time_factor != 1)
                description += ", slowed by " + time_factor;
            description += ')';
            obj.songName = obj.songName + description;
        }
        
        var a = document.createElement("a");
        var json = new Blob([JSON.stringify(obj)], {type: 'text/plain'});
        a.href = URL.createObjectURL(json);
        a.download = file.name;
        a.click();

        notes += 'SUCCESS - downloading file\n\n';
        addNote(notes);
    }

    function addNote(notes) {
        var div = document.createElement('div');
        div.innerText = notes;
        document.body.appendChild(div);
    }

});
