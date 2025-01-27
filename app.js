let lastX = 0;
let lastY = 0;
let mouseTimeout;

const titles = {
    one: {
        element: document.getElementById("SubTitleOne"),
        maxDistance: 5,
        sensitivity: 0.1
    },
    two: {
        element: document.getElementById("SubTitleTwo"), 
        maxDistance: 10,
        sensitivity: 0.15
    },
    three: {
        element: document.getElementById("SubTitleThree"),
        maxDistance: 15,
        sensitivity: 0.2
    }
};

// Initialize positions for all titles
for (const title of Object.values(titles)) {
    title.position = {
        x: parseInt(getComputedStyle(title.element).left) || 0,
        y: parseInt(getComputedStyle(title.element).top) || 0,
        originalX: parseInt(getComputedStyle(title.element).left) || 0,
        originalY: parseInt(getComputedStyle(title.element).top) || 0
    };
}

function resetPositions() {
    for (const title of Object.values(titles)) {
        title.element.classList.add('resetting');
        title.element.style.left = `${title.position.originalX}px`;
        title.element.style.top = `${title.position.originalY}px`;
        title.position.x = title.position.originalX;
        title.position.y = title.position.originalY;
    }
    
    setTimeout(() => {
        for (const title of Object.values(titles)) {
            title.element.classList.remove('resetting');
        }
    }, 600);
}

function getEaseOutFactor(currentDistance, maxDistance) {
    return Math.max(0, 1 - Math.pow(currentDistance / maxDistance, 2));
}

function moveTitle(title, deltaX, deltaY) {
    const newX = title.position.x + deltaX * title.sensitivity;
    const newY = title.position.y + deltaY * title.sensitivity;
    
    const distance = Math.sqrt(
        Math.pow(newX - title.position.originalX, 2) + 
        Math.pow(newY - title.position.originalY, 2)
    );
    
    if (distance <= title.maxDistance) {
        const easeFactor = getEaseOutFactor(distance, title.maxDistance);
        const adjustedX = title.position.x + (deltaX * title.sensitivity * easeFactor);
        const adjustedY = title.position.y + (deltaY * title.sensitivity * easeFactor);
        
        title.position.x = adjustedX;
        title.position.y = adjustedY;
        title.element.style.left = `${adjustedX}px`;
        title.element.style.top = `${adjustedY}px`;
    }
}

document.addEventListener("mousemove", (event) => {
    clearTimeout(mouseTimeout);
    
    // Remove transition classes during mouse movement
    for (const title of Object.values(titles)) {
        title.element.classList.remove('resetting');
    }
    
    const deltaX = -(event.clientX - lastX);
    const deltaY = -(event.clientY - lastY);
    
    // Move all titles
    for (const title of Object.values(titles)) {
        moveTitle(title, deltaX, deltaY);
    }
    
    lastX = event.clientX;
    lastY = event.clientY;
    
    mouseTimeout = setTimeout(resetPositions, 100);
});
