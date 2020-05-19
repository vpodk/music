(function() {
  var BPM = document.getElementById('bpm');
  var NOTE_LENGTH = document.getElementById('note_length');
  var WAVE_TYPE = document.getElementById('wave_type');
  var OCTAVE = document.getElementById('octave');
  var SCALE = document.getElementById('scale');
  var PRESET = document.getElementById('preset');
  var NOTES = document.getElementById('notes');
  var firstRun;
  var context;

  function stop() {
    if (context) {
      context.close();
      context = null;
    }
  }

  function play() {
    stop();
    context = new (window.AudioContext || window.webkitAudioContext);

    var time = context.currentTime;
    var playlength = 0;
    var bpm = BPM.value;
    var nl = NOTE_LENGTH.value;
    var wt = WAVE_TYPE.value.toLowerCase();
    var notes = NOTES.value.split(' ');

    var oscillator;
    var note;

    for (var i = 0; i < notes.length; i++) {
      note = notes[i];
      oscillator = context.createOscillator();
      playlength = 1 / (bpm / 60) * nl;

      oscillator.type = wt;

      oscillator.frequency.value = FREQUENCIES[note];
      oscillator.connect(context.destination);

      oscillator.start(time);
      oscillator.stop(time + playlength);
      time += playlength;
    }
  }

  function init() {
    stop();
    var scale = getScale(+OCTAVE.value, SCALES[SCALE.value]);
    var notes = 'FE' == PRESET.value ? FUR_ELISE : [];

    if (!notes.length) {
      var sequence = 'PI' == PRESET.value ? PI_50 :
          'FI' == PRESET.value ? getFibonacciSequence(64) : PRESET.value;

      for (var i = 0; i < sequence.length; i++) {
        notes.push(scale[sequence[i]]);
      }
    }

    NOTES.value = notes.join(' ');

    if (!firstRun) {
      firstRun = 1;
      PRESET.onchange =
      SCALE.onchange =
      OCTAVE.onchange = init;
    }
  }

  function getFibonacciSequence(n) {
    var sequence = '';

    for (var i = 0; i < n;) {
      sequence += fibonacci(i++);
    }

    return sequence.split('');
  }

  function fibonacci(n) {
    if (n > 1) {
      var phi = (1 + Math.sqrt(5)) / 2; // 1.6180339887...
      // `Math.pow` returns` Infinity` if the result is greater than `Number.MAX_VALUE`.
      var asymp = Math.pow(phi, n) / Math.sqrt(5);

      return Math.round(asymp);
    }
    return n;
  }

  var PI_50 = '314159265358979323846264338327950288419716939937510';

  var FUR_ELISE = [
    'E5', 'D#5', 'E5', 'D#5', 'E5', 'B4', 'D5', 'C5', 'A4',
    'C4', 'E4', 'A4', 'B4',   'E4', 'A4', 'B4', 'C5'
  ];

  // https://en.wikipedia.org/wiki/Piano_key_frequencies
  var FREQUENCIES = {
    'C0': 16.35, 'C#0': 17.32,
    'Db0': 17.32, 'D0': 18.35, 'D#0': 19.45,
    'Eb0': 19.45, 'E0': 20.60,
    'F0': 21.83, 'F#0': 23.12,
    'Gb0': 23.12, 'G0': 24.50, 'G#0': 25.96,
    'Ab0': 25.96, 'A0': 27.50, 'A#0': 29.14,
    'Bb0': 29.14, 'B0': 30.87,
    'C1': 32.70, 'C#1': 34.65,
    'Db1': 34.65, 'D1': 36.71, 'D#1': 38.89,
    'Eb1': 38.89, 'E1': 41.20,
    'F1': 43.65, 'F#1': 46.25,
    'Gb1': 46.25, 'G1': 49.00, 'G#1': 51.91,
    'Ab1': 51.91, 'A1': 55.00, 'A#1': 58.27,
    'Bb1': 58.27, 'B1': 61.74,
    'C2': 65.41, 'C#2': 69.30,
    'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78,
    'Eb2': 77.78, 'E2': 82.41,
    'F2': 87.31, 'F#2': 92.50,
    'Gb2': 92.50, 'G2': 98.00, 'G#2': 103.83,
    'Ab2': 103.83, 'A2': 110.00, 'A#2': 116.54,
    'Bb2': 116.54, 'B2': 123.47,
    'C3': 130.81, 'C#3': 138.59,
    'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56,
    'Eb3': 155.56, 'E3': 164.81,
    'F3': 174.61, 'F#3': 185.00,
    'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65,
    'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08,
    'Bb3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18,
    'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13,
    'Eb4': 311.13, 'E4': 329.63,
    'F4': 349.23, 'F#4': 369.99,
    'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30,
    'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16,
    'Bb4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'C#5': 554.37,
    'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25,
    'Eb5': 622.25, 'E5': 659.26,
    'F5': 698.46, 'F#5': 739.99,
    'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61,
    'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33,
    'Bb5': 932.33, 'B5': 987.77,
    'C6': 1046.50, 'C#6': 1108.73,
    'Db6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51,
    'Eb6': 1244.51, 'E6': 1318.51,
    'F6': 1396.91, 'F#6': 1479.98,
    'Gb6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22,
    'Ab6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66,
    'Bb6': 1864.66, 'B6': 1975.53,
    'C7': 2093.00, 'C#7': 2217.46,
    'Db7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02,
    'Eb7': 2489.02, 'E7': 2637.02,
    'F7': 2793.83, 'F#7': 2959.96,
    'Gb7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44,
    'Ab7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31,
    'Bb7': 3729.31, 'B7': 3951.07,
    'C8': 4186.01
  };

  var SCALES = {
    // https://en.wikipedia.org/wiki/A_major
    'A_MAJOR': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    // https://en.wikipedia.org/wiki/C-sharp_minor
    'C_SHARP_MINOR': ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
    // https://en.wikipedia.org/wiki/E_major
    'E_MAJOR': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    // https://en.wikipedia.org/wiki/E_minor
    'E_MINOR': ['E', 'F#', 'G', 'A', 'B', 'C', 'D']
  };

  var RESULT3 = {
    'A_MAJOR': ['G#3', 'A3', 'B3', 'C#4', 'D4', 'E4', 'F#4', 'G#4', 'A4', 'B4'],
    'C_SHARP_MINOR': ['B2', 'C#3', 'D#3', 'E3', 'F#3', 'G#3', 'A3', 'B3', 'C#4', 'D#4'],
    'E_MAJOR': ['D#3', 'E3', 'F#3', 'G#3', 'A3', 'B3', 'C#4', 'D#4', 'E4', 'F#4'],
    'E_MINOR': ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4']
  }

  // https://en.wikipedia.org/wiki/Octave
  function getScale(octave, scale) {
    var length = 10;
    var result = [];

    for (var i = 0; i < length; ++i) {
      if (i == 0) {
        var o = 'C' == scale[i].charAt(0) ? -1 : 0;
        result.push(scale[scale.length -1] + (octave + o));
      } else if (i >= 8) {
        if ('C' == scale[i - scale.length - 1].charAt(0)) octave++;
        result.push(scale[i - scale.length - 1] + octave);
      } else {
        if ('C' == scale[i - 1].charAt(0) && i != 1) octave++;
        result.push(scale[i - 1] + octave);
      }
    }

    return result;
  }

  function test() {
    var octave = 3;
    for (var scale in SCALES) {
      var notes = getScale(octave, SCALES[scale]);
      console.log(scale, notes.join() == RESULT3[scale].join());
      console.log(RESULT3[scale]);
      console.log(notes);
    }
  }

  init();
  // test();

  window.play = play;
  window.stop = stop;
})();
