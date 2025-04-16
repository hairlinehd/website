const button = document.getElementById('ts-button');
const counter = document.getElementById('click-counter');
const rancode = document.getElementById('rancode');
const body = document.body;
let clickCount = 0;
const existingText = [];

const textFragments = ["j*b", "emp*oyment", "🥀", "💔", "ts", "icl", "jail", "prison", "pmo", "sybau"];

const MIN_PADDING = 30;

const buttonRect = button.getBoundingClientRect();
const counterRect = counter.getBoundingClientRect();
const rancodeRect = rancode.getBoundingClientRect()
let protectedAreas = [
    { 
        x: buttonRect.left,
        y: buttonRect.top,
        width: buttonRect.width,
        height: buttonRect.height
    },
    { 
        x: counterRect.left,
        y: counterRect.top,
        width: counterRect.width,
        height: counterRect.height
    },
    { 
        x: rancodeRect.left,
        y: rancodeRect.top,
        width: rancodeRect.width,
        height: rancodeRect.height
    }

];

function isPositionValid(x, y, width, height) {
    for (const area of protectedAreas) {
        if (x + width > area.x - MIN_PADDING && 
            x < area.x + area.width + MIN_PADDING &&
            y + height > area.y - MIN_PADDING &&
            y < area.y + area.height + MIN_PADDING) {
            return false;
        }
    }
    return true;
}

function findRandomPosition(textWidth, textHeight) {
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
        const x = Math.random() * (window.innerWidth - textWidth);
        const y = Math.random() * (window.innerHeight - textHeight);
        
        if (isPositionValid(x, y, textWidth, textHeight)) {
            return { x, y };
        }
             attempts++;
    }
            
    return {
        x: rancodeRect.left,
                    x: Math.max(0, Math.min(
        window.innerWidth - textWidth, 
        protectedAreas[0].x + protectedAreas[0].width + MIN_PADDING
        )),
        y: Math.max(0, Math.min(
        window.innerHeight - textHeight, 
        protectedAreas[1].y + protectedAreas[1].height + MIN_PADDING
        ))
    };
}

button.addEventListener('click', function() {
    clickCount++;
    counter.textContent = `pmo: ${clickCount}`;
            
    const buttonRect = button.getBoundingClientRect();
    const counterRect = counter.getBoundingClientRect();
    const rancodeRect = rancode.getBoundingClientRect();
    protectedAreas = [
        { 
            x: buttonRect.left,
            y: buttonRect.top,
            width: buttonRect.width,
            height: buttonRect.height
        },
        { 
            x: counterRect.left,
            y: counterRect.top,
            width: counterRect.width,
            height: counterRect.height
        },
        { 
            x: rancodeRect.left,
            y: rancodeRect.top,
            width: rancodeRect.width,
            height: rancodeRect.height
        }
    ];
            
    const textElement = document.createElement('div');
    textElement.className = 'random-text';
    textElement.textContent = textFragments[Math.floor(Math.random() * textFragments.length)];
    
    textElement.style.visibility = 'hidden';
    body.appendChild(textElement);
    const baseSize = Math.min(window.innerWidth * 0.04, 24);
    const sizeVariation = 0.8 + Math.random() * 0.6;
    textElement.style.fontSize = `${baseSize * sizeVariation}px`;
    const textWidth = textElement.offsetWidth;
    const textHeight = textElement.offsetHeight;
    const position = findRandomPosition(textWidth, textHeight);
    textElement.style.left = `${position.x}px`;
    textElement.style.top = `${position.y}px`;
    textElement.style.transform = `rotate(${(Math.random() * 60) - 30}deg)`;
    textElement.style.color = `hsl(${Math.random() * 360}, 80%, 70%)`;
    textElement.style.visibility = 'visible';
    
    existingText.push(textElement);
});

window.addEventListener('resize', function() {
    const buttonRect = button.getBoundingClientRect();
    const counterRect = counter.getBoundingClientRect();
    const rancodeRect = rancode.getBoundingClientRect();
    protectedAreas = [
        {
            x: buttonRect.left,
            y: buttonRect.top,
            width: buttonRect.width,
            height: buttonRect.height
        },
        {
            x: counterRect.left,
            y: counterRect.top,
            width: counterRect.width,
            height: counterRect.height
        },
        {
            x: rancodeRect.left,
            y: rancodeRect.top,
            width: rancodeRect.width,
            height: rancodeRect.height
        }
    ];
});