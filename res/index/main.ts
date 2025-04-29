const button: HTMLButtonElement | null = document.getElementById('ts-button') as HTMLButtonElement;
const counter: HTMLSpanElement | null = document.getElementById('click-counter') as HTMLSpanElement;
const rancode: HTMLDivElement | null = document.getElementById('rancode') as HTMLDivElement;
const body: HTMLBodyElement = document.body as HTMLBodyElement;

if (!button || !counter || !rancode || !body) {
    throw new Error("wtf happened to the dom!?");
}

let clickCount: number = 0;
const existingText: HTMLDivElement[] = [];

const textFragments: string[] = ["j*b", "emp*oyment", "🥀", "💔", "ts", "icl", "jail", "prison", "pmo", "sybau"];

const padding: number = 30;

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

const buttonRect: DOMRect = button.getBoundingClientRect();
const counterRect: DOMRect = counter.getBoundingClientRect();
const rancodeRect: DOMRect = rancode.getBoundingClientRect();
let protectedAreas: Rectangle[] = [
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

function isPositionValid(x: number, y: number, width: number, height: number): boolean {
    for (const area of protectedAreas) {
        if (x + width > area.x - padding && 
            x < area.x + area.width + padding &&
            y + height > area.y - padding &&
            y < area.y + area.height + padding) {
            return false;
        }
    }
    return true;
}

function findRandomPosition(textWidth: number, textHeight: number): {x: number, y: number} {
    let attempts: number = 0;
    const maxAttempts: number = 100;
    
    while (attempts < maxAttempts) {
        const x: number = Math.random() * (window.innerWidth - textWidth);
        const y: number = Math.random() * (window.innerHeight - textHeight);
        
        if (isPositionValid(x, y, textWidth, textHeight)) {
            return { x, y };
        }
        attempts++;
    }
            
    return {
        x: Math.max(0, Math.min(
            window.innerWidth - textWidth, 
            protectedAreas[0].x + protectedAreas[0].width + padding
        )),
        y: Math.max(0, Math.min(
            window.innerHeight - textHeight, 
            protectedAreas[1].y + protectedAreas[1].height + padding
        ))
    };
}

button.addEventListener('click', function(): void {
    clickCount++;
    counter.textContent = `pmo: ${clickCount}`;
            
    const buttonRect: DOMRect = button.getBoundingClientRect();
    const counterRect: DOMRect = counter.getBoundingClientRect();
    const rancodeRect: DOMRect = rancode.getBoundingClientRect();
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
            
    const textElement: HTMLDivElement = document.createElement('div');
    textElement.className = 'random-text';
    const randomText: string = textFragments[Math.floor(Math.random() * textFragments.length)];
    textElement.textContent = randomText;
    
    textElement.style.visibility = 'hidden';
    body.appendChild(textElement);
    const baseSize: number = Math.min(window.innerWidth * 0.04, 24);
    const sizeVariation: number = 0.8 + Math.random() * 0.6;
    textElement.style.fontSize = `${baseSize * sizeVariation}px`;
    const textWidth: number = textElement.offsetWidth;
    const textHeight: number = textElement.offsetHeight;
    const position: {x: number, y: number} = findRandomPosition(textWidth, textHeight);
    textElement.style.position = 'absolute';
    textElement.style.left = `${position.x}px`;
    textElement.style.top = `${position.y}px`;
    textElement.style.transform = `rotate(${(Math.random() * 60) - 30}deg)`;
    textElement.style.color = `hsl(${Math.random() * 360}, 80%, 70%)`;
    textElement.style.visibility = 'visible';
    
    existingText.push(textElement);
});

window.addEventListener('resize', function(): void {
    const buttonRect: DOMRect = button.getBoundingClientRect();
    const counterRect: DOMRect = counter.getBoundingClientRect();
    const rancodeRect: DOMRect = rancode.getBoundingClientRect();
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