"use strict";
const rancodeTable = {
    'A': "ra",
    'B': "arrr",
    'C': "arar",
    'D': "arr",
    'E': "r",
    'F': "rrar",
    'G': "aar",
    'H': "rrrr",
    'I': "rr",
    'J': "raaa",
    'K': "ara",
    'L': "rarr",
    'M': "aa",
    'N': "ar",
    'O': "aaa",
    'P': "raar",
    'Q': "aara",
    'R': "rar",
    'S': "rrr",
    'T': "a",
    'U': "rra",
    'V': "aaar",
    'W': "raa",
    'X': "arra",
    'Y': "araa",
    'Z': "aarr",
    '0': "aaaaa",
    '1': "naaaa",
    '2': "nnaaa",
    '3': "nnnaa",
    '4': "nnnna",
    '5': "nnnnn",
    '6': "annnn",
    '7': "aannn",
    '8': "aaann",
    '9': "aaaan",
    ' ': "ts",
    '.': "rrara",
    ',': "rraar",
    ':': "aaara",
    '?': "rarra",
    "'": "arrar",
    '-': "arraa",
    '(': "arara",
    ')': "raarra",
    '"': "aarrr",
    '&': "rrraa",
    '!': "rrrra",
    ';': "raraa"
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
const errorMessage = document.getElementById('errorMessage');
const translateIndicator = document.getElementById('translateIndicator');
if (!inputText || !output || !copyBtn || !warningMessage || !errorMessage || !translateIndicator) {
    throw new Error("Required DOM elements not found");
}
let unsupportedChars = new Set();
let unknownCodes = new Set();
function showMessage(element, message, className) {
    element.textContent = message;
    element.className = `status-box ${className}`;
    element.style.display = 'block';
}
function clearMessage(element) {
    element.textContent = '';
    element.className = 'status-box';
    element.style.display = 'none';
}
function isRancode(input) {
    if (!input.trim())
        return false;
    const words = input.split(' ');
    let rancodeCount = 0;
    let totalWords = 0;
    for (const word of words) {
        if (!word)
            continue;
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
    if (errorMessage)
        clearMessage(errorMessage);
    for (let char of text) {
        const upperChar = char.toUpperCase();
        if (rancodeTable[upperChar]) {
            if (char === char.toUpperCase() && char !== char.toLowerCase()) {
                result += '!' + rancodeTable[upperChar] + ' ';
            }
            else {
                result += rancodeTable[upperChar] + ' ';
            }
        }
        else if (char !== '\n' && char !== '\r') {
            unsupportedChars.add(char);
        }
    }
    if (warningMessage && unsupportedChars.size > 0) {
        const charsList = Array.from(unsupportedChars).map(c => `'${c}'`).join(', ');
        showMessage(warningMessage, `unsupported: ${charsList}`, 'warning');
    }
    else if (warningMessage) {
        clearMessage(warningMessage);
    }
    if (translateIndicator)
        showMessage(translateIndicator, "text to rancode", "translation-direction");
    return result.trim();
}
function rancodeToText(text) {
    let result = '';
    unknownCodes.clear();
    if (warningMessage)
        clearMessage(warningMessage);
    const rancodeWords = text.split(' ');
    for (const code of rancodeWords) {
        if (code === '')
            continue;
        const cleanCode = code.startsWith('!') ? code.substring(1) : code;
        const char = reverseRancodeTable[cleanCode];
        if (char) {
            if (code.startsWith('!')) {
                result += char.toUpperCase();
            }
            else {
                result += char.toLowerCase();
            }
        }
        else {
            unknownCodes.add(code);
        }
    }
    if (errorMessage && unknownCodes.size > 0) {
        const codesList = Array.from(unknownCodes).map(c => `'${c}'`).join(', ');
        showMessage(errorMessage, `unknown rancode: ${codesList}`, 'error');
    }
    else if (errorMessage) {
        clearMessage(errorMessage);
    }
    if (translateIndicator)
        showMessage(translateIndicator, "rancode to text", "translation-direction");
    return result;
}
function translate() {
    if (!inputText || !output)
        return;
    const text = inputText.value;
    let result = '';
    if (isRancode(text)) {
        result = rancodeToText(text);
    }
    else {
        result = textToRancode(text);
    }
    output.textContent = result;
    if (copyBtn)
        copyBtn.disabled = !result;
}
if (inputText) {
    inputText.addEventListener('input', function () {
        translate();
    });
}
if (copyBtn) {
    copyBtn.addEventListener('click', function () {
        if (!output || !translateIndicator)
            return;
        const outputText = output.textContent;
        if (outputText) {
            navigator.clipboard.writeText(outputText).then(() => {
                if (translateIndicator)
                    showMessage(translateIndicator, "copied!", "success");
                setTimeout(() => {
                    if (inputText && inputText.value) {
                        translate();
                    }
                    else if (translateIndicator) {
                        showMessage(translateIndicator, "waiting for input", "translation-direction");
                    }
                }, 2000);
            }).catch(() => {
                if (translateIndicator)
                    showMessage(translateIndicator, "failed to copy", "error");
                setTimeout(translate, 1500);
            });
        }
    });
}
if (warningMessage)
    warningMessage.style.display = 'none';
if (errorMessage)
    errorMessage.style.display = 'none';
if (translateIndicator)
    showMessage(translateIndicator, "waiting for input", "translation-direction");
