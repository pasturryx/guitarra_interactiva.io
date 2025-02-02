// Definición de notas y colores
const notesEnglish = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
const notesSpanish = ['Do', 'Do#/Reb', 'Re', 'Re#/Mib', 'Mi', 'Fa', 'Fa#/Solb', 'Sol', 'Sol#/Lab', 'La', 'La#/Sib', 'Si'];
const noteColors = {
  'C': '#FF0000',
  'C#/Db': '#FF69B4',
  'D': '#00FF00',       
  'D#/Eb': '#FFA500',   
  'E': '#0000FF',
  'F': '#008000',
  'F#/Gb': '#00FF00',
  'G': '#8B008B',
  'G#/Ab': '#4169E1',
  'A': '#FFD700',
  'A#/Bb': '#FF4500',
  'B': '#00FFFF'
};
const tuningEnglish = ['E', 'A', 'D', 'G', 'B', 'E'];
const tuningSpanish = ['Mi', 'La', 'Re', 'Sol', 'Si', 'Mi'];
let isMarking = false;
let isEnglishNotation = true;
let isMultiSelect = false;
let selectedNotes = new Set();

// Función para guardar las notas seleccionadas
function saveSelectedNotes() {
  const markers = document.querySelectorAll('.fret-marker[style*="display: flex"]');
  selectedNotes.clear();
  markers.forEach(marker => {
    selectedNotes.add(marker.textContent);
  });
}

// Función para restaurar las notas seleccionadas
function restoreSelectedNotes() {
  if (selectedNotes.size > 0) {
    highlightNote([...selectedNotes][0]);
  }
}

function addDotMarkers(fretDiv, fret, stringIndex) {
  const singleDotFrets = [3, 5, 7, 9, 15, 17, 19];

  // Puntos en los trastes 3, 5, 7, 9, 15, 17, 19 entre las cuerdas 3 y 4
  if (stringIndex === 3 && singleDotFrets.includes(fret)) {
    const dot = document.createElement('div');
    dot.className = 'fret-dot dot-middle';
    fretDiv.appendChild(dot);
  }

  // Puntos en el traste 12
  if (fret === 12) {
    // Punto entre las cuerdas 5 y 6 (solo en la cuerda 5)
    if (stringIndex === 5) {
      const upperDot = document.createElement('div');
      upperDot.className = 'fret-dot dot-upper';
      fretDiv.appendChild(upperDot);
    }
    // Punto entre las cuerdas 1 y 2 (solo en la cuerda 2)
    else if (stringIndex === 0) {
      const lowerDot = document.createElement('div');
      lowerDot.className = 'fret-dot dot-lower';
      fretDiv.appendChild(lowerDot);
    }
  }
}

function createNotesReference() {
  const reference = document.getElementById('notesReference');
  reference.innerHTML = ''; // Limpiar referencias existentes
  const notes = isEnglishNotation ? notesEnglish : notesSpanish;
  notes.forEach(note => {
    const noteBox = document.createElement('div');
    noteBox.className = 'note-box';
    noteBox.textContent = note;
    const englishNote = isEnglishNotation ? note : notesEnglish[notesSpanish.indexOf(note)];
    noteBox.style.backgroundColor = noteColors[englishNote.replace(/#\/.+/, '')];
    noteBox.addEventListener('click', () => highlightNote(note));
    reference.appendChild(noteBox);
  });

  // Restaurar las notas seleccionadas
  restoreSelectedNotes();
}

function getNoteAtFret(startNote, fret) {
  const notes = isEnglishNotation ? notesEnglish : notesSpanish;
  const startIndex = notes.indexOf(startNote.replace(/[0-9]/g, ''));
  const noteIndex = (startIndex + fret) % 12;
  return notes[noteIndex];
}

function createFretboard() {
  const fretboard = document.getElementById('fretboard');
  fretboard.innerHTML = ''; // Limpiar el mástil existente
  const tuning = isEnglishNotation ? tuningEnglish : tuningSpanish;

  for (let string = 5; string >= 0; string--) {
    const stringDiv = document.createElement('div');
    stringDiv.className = 'string';

    for (let fret = 0; fret <= 24; fret++) {
      const fretDiv = document.createElement('div');
      fretDiv.className = 'fret';

      if (string === 5 && fret > 0) {
        const fretNumber = document.createElement('div');
        fretNumber.className = 'fret-number';
        fretNumber.textContent = fret;
        fretDiv.appendChild(fretNumber);
      }

      addDotMarkers(fretDiv, fret, string);

      const note = getNoteAtFret(tuning[string], fret);
      const noteDiv = document.createElement('div');
      noteDiv.className = 'note';
      noteDiv.textContent = fret === 0 ? tuning[string] : '';

      const marker = document.createElement('div');
      marker.className = 'fret-marker';

      fretDiv.appendChild(marker);
      fretDiv.appendChild(noteDiv);

      const handleInteraction = (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto
        if (isMarking) {
          if (marker.style.display === 'flex') {
            marker.style.display = 'none';
          } else {
            const note = getNoteAtFret(tuning[string], fret);
            marker.textContent = note;
            const englishNote = isEnglishNotation ? note : notesEnglish[notesSpanish.indexOf(note)];
            marker.style.backgroundColor = noteColors[englishNote.replace(/#\/.+/, '')];
            marker.style.display = 'flex';
          }
        }
      };

      fretDiv.addEventListener('click', handleInteraction);
      fretDiv.addEventListener('touchstart', handleInteraction);
      stringDiv.appendChild(fretDiv);
    }
    fretboard.appendChild(stringDiv);
  }

  // Restaurar las notas seleccionadas
  restoreSelectedNotes();
}

function highlightNote(selectedNote) {
  if (!isMultiSelect) {
    selectedNotes.clear();
  }
  selectedNotes.add(selectedNote);

  const markers = document.querySelectorAll('.fret-marker');
  markers.forEach(marker => {
    marker.style.display = 'none';
  });

  const tuning = isEnglishNotation ? tuningEnglish : tuningSpanish;
  for (let string = 5; string >= 0; string--) {
    for (let fret = 0; fret <= 24; fret++) {
      const note = getNoteAtFret(tuning[string], fret);
      if (selectedNotes.has(note)) {
        const fretDiv = document.querySelector(`.string:nth-child(${6 - string}) .fret:nth-child(${fret + 1})`);
        const marker = fretDiv.querySelector('.fret-marker');
        marker.textContent = note;
        const englishNote = isEnglishNotation ? note : notesEnglish[notesSpanish.indexOf(note)];
        marker.style.backgroundColor = noteColors[englishNote.replace(/#\/.+/, '')];
        marker.style.display = 'flex';
      }
    }
  }
}

function clearMarkers() {
  const markers = document.querySelectorAll('.fret-marker');
  markers.forEach(marker => {
    marker.style.display = 'none';
  });
  selectedNotes.clear();
}

function adjustResponsiveLayout() {
  const fretboardContainer = document.querySelector('.fretboard-container');
  const windowWidth = window.innerWidth;

  if (windowWidth <= 480) {
    fretboardContainer.style.transform = 'scale(0.8)';
  } else if (windowWidth <= 768) {
    fretboardContainer.style.transform = 'scale(0.9)';
  } else {
    fretboardContainer.style.transform = 'scale(1)';
  }
}

// Inicialización y event listeners
document.addEventListener('DOMContentLoaded', () => {
  createNotesReference();
  createFretboard();
  adjustResponsiveLayout();

  const toggleButton = document.getElementById('toggleMarking');
  const clearButton = document.getElementById('clearMarkers');
  const englishNotationCheckbox = document.getElementById('englishNotation');
  const spanishNotationCheckbox = document.getElementById('spanishNotation');
  const multiSelectCheckbox = document.getElementById('multiSelect');

  toggleButton.addEventListener('click', () => {
    isMarking = !isMarking;
    toggleButton.textContent = isMarking ? 'Dejar de Marcar' : 'Marcar Notas';
  });

  clearButton.addEventListener('click', clearMarkers);

  englishNotationCheckbox.addEventListener('change', () => {
    if (englishNotationCheckbox.checked) {
      saveSelectedNotes(); // Guardar las notas seleccionadas
      spanishNotationCheckbox.checked = false;
      isEnglishNotation = true;
      createNotesReference();
      createFretboard();
    }
  });

  spanishNotationCheckbox.addEventListener('change', () => {
    if (spanishNotationCheckbox.checked) {
      saveSelectedNotes(); // Guardar las notas seleccionadas
      englishNotationCheckbox.checked = false;
      isEnglishNotation = false;
      createNotesReference();
      createFretboard();
    }
  });

  multiSelectCheckbox.addEventListener('change', () => {
    isMultiSelect = multiSelectCheckbox.checked;
    if (!isMultiSelect) {
      clearMarkers();
    }
  });

  // Manejar cambios de orientación y tamaño sin recargar la página
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      adjustResponsiveLayout();
    }, 250);
  });

  window.addEventListener('orientationchange', () => {
    setTimeout(adjustResponsiveLayout, 100);
  });
});
