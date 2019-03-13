var btn = document.querySelector('#submit-button');

btn.addEventListener('click', function() {
	var input = document.querySelector('#input');
	if (input.files.length == 0) {
		alert("Upload at least one JSON file");
		//return;
	}
	var no_ducks = document.querySelector('#delete-ducks').checked;
	var no_walls = document.querySelector('#delete-walls').checked;
	var no_bombs = document.querySelector('#delete-bombs').checked;
	var buffer_time = document.querySelector('#buffer-time').value;
	if (buffer_time && !isNaN(parseInt(buffer_time))) {
		buffer_time = parseInt(buffer_time);
	} else {
		buffer_time = 0;
	}
	var subtract_time = document.querySelector('#subtract-time').value;
	if (subtract_time && !isNaN(parseInt(subtract_time))) {
		subtract_time = parseInt(subtract_time);
	} else {
		subtract_time = 0;
	}

	
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

        if (!obj._notes || !obj._obstacles) {
        	notes += 'Error - Not a valid song\nFAILED\n\n';
        	addNote(notes);
        	return;
        }

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
        	var notes = [];
        	for (var i = 0; i < obj._notes.length; i++) {
        		if (obj._notes[i]._type != 3) {
        			notes.push(obj._notes[i]);
        		}
        	}
        	obj._notes = notes;
        }
		
    	var _notes = [];
    	for (var i = 0; i < obj._notes.length; i++) {
			obj._notes[i]._time = obj._notes[i]._time - subtract_time;
			if (obj._notes[i]._time - buffer_time >= 0) {
    			_notes.push(obj._notes[i]);
			}
    	}
    	obj._notes = _notes;

    	var events = [];
    	for (var i = 0; i < obj._events.length; i++) {
			obj._events[i]._time = obj._events[i]._time - subtract_time;
			if (obj._events[i]._time - buffer_time >= 0) {
    			events.push(obj._events[i]);
			}
    	}
    	obj._events = events;

    	var obstacles = [];
    	for (var i = 0; i < obj._obstacles.length; i++) {
			obj._obstacles[i]._time = obj._obstacles[i]._time - subtract_time;
			if (obj._obstacles[i]._time - buffer_time >= 0) {
    			obstacles.push(obj._obstacles[i]);
			}
    	}
    	obj._obstacles = obstacles;

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
