const rancodeTable = {
    'A': "ra", 'B': "arrr", 'C': "arar", 'D': "arr", 'E': "r", 
    'F': "rrar", 'G': "aar", 'H': "rrrr", 'I': "rr", 'J': "raaa", 
    'K': "ara", 'L': "rarr", 'M': "aa", 'N': "ar", 'O': "aaa", 
    'P': "raar", 'Q': "aara", 'R': "rar", 'S': "rrr", 'T': "a", 
    'U': "rra", 'V': "aaar", 'W': "raa", 'X': "arra", 'Y': "araa", 
    'Z': "aarr",
    '0': "aaaaa", '1': "naaaa", '2': "nnaaa", '3': "nnnaa", 
    '4': "nnnna", '5': "nnnnn", '6': "annnn", '7': "aannn", 
    '8': "aaann", '9': "aaaan",
    ' ': "ts",
    '.': "rrara", ',': "rraar", ':': "aaara", '?': "rarra", 
    "'": "arrar", '-': "arraa", '(': "arara", ')': "raarra", 
    '"': "aarrr", '&': "rrraa", '!': "rrrra", ';': "raraa"
};

const reverseRancodeTable = {};
for (const [key, value] of Object.entries(rancodeTable)) {
    reverseRancodeTable[value] = key;
}

const rancodePatterns = new Set(Object.values(rancodeTable));

const inputText = document.getElementById('inputText');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');
const warningMessage = document.getElementById('warningMessage');
const translateIndicator = document.getElementById('translateIndicator');

let unsupportedChars = new Set();

function showMessage(element, message, className) {
    element.textContent = message;
    element.className = `status-box ${className}`;
}

function clearMessage(element) {
    element.textContent = '';
    element.className = 'status-box';
}

function isRancode(input) {
    if (!input.trim()) return false;
    
    const words = input.split(' ');
    let rancodeCount = 0;
    let totalWords = 0;
    
    for (const word of words) {
        if (!word) continue;
        totalWords++;
        
        const cleanWord = word.startsWith('!') ? word.substring(1) : word;
        if (rancodePatterns.has(cleanWord)) {
            rancodeCount++;
        }
    }
    
    return totalWords > 0 && (rancodeCount / totalWords) > 0.5;
}

function textToRancode(text) {
    let result = '';
    unsupportedChars.clear();
    
    for (let char of text) {
        const upperChar = char.toUpperCase();
        if (rancodeTable[upperChar]) {
            if (char === char.toUpperCase() && char !== char.toLowerCase()) {
                result += '!' + rancodeTable[upperChar] + ' ';
            } else {
                result += rancodeTable[upperChar] + ' ';
            }
        } else if (char !== '\n' && char !== '\r') {
            unsupportedChars.add(char);
        }
    }
    
    if (unsupportedChars.size > 0) {
        const charsList = Array.from(unsupportedChars).map(c => `'${c}'`).join(', ');
        showMessage(warningMessage, `unsupported: ${charsList}`, 'warning');
    } else {
        clearMessage(warningMessage);
    }
    
    showMessage(translateIndicator, "text to rancode", "translation-direction");
    return result.trim();
}

function rancodeToText(text) {
    let result = '';
    const rancodeWords = text.split(' ');
    let unknownCodes = new Set();
    
    for (const code of rancodeWords) {
        if (code === '') continue;
        
        const cleanCode = code.startsWith('!') ? code.substring(1) : code;
        const char = reverseRancodeTable[cleanCode];
        
        if (char) {
            if (code.startsWith('!')) {
                result += char.toUpperCase();
            } else {
                result += char.toLowerCase();
            }
        } else {
            unknownCodes.add(code);
        }
    }
    
    showMessage(translateIndicator, "rancode to text", "translation-direction");
    return result;
}

function translate() {
    const text = inputText.value;
    let result = '';
    
    if (isRancode(text)) {
        result = rancodeToText(text);
    } else {
        result = textToRancode(text);
    }
    
    output.textContent = result;
    copyBtn.disabled = !result;
}

inputText.addEventListener('input', function() {
    translate();
});

copyBtn.addEventListener('click', function() {
    const outputText = output.textContent;
    if (outputText) {
        navigator.clipboard.writeText(outputText).then(() => {
            showMessage(translateIndicator, "copied!", "success");
            setTimeout(() => {
                if (inputText.value) {
                    translate(); 
                } else {
                    showMessage(translateIndicator, "waiting for input", "translation-direction");
                }
            }, 2000);
        }).catch(() => {
            showMessage(translateIndicator, "failed to copy", "warning");
            setTimeout(translate, 1500);
        });
    }
});

showMessage(translateIndicator, "waiting for input", "translation-direction");