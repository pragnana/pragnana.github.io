const poemText = document.getElementById('poemText');
const favoriteBtn = document.getElementById('favoriteBtn');
const tocMenu = document.getElementById('tocMenu');
const poemContainer = document.getElementById('poemContainer');
let touchstartX, touchendX;

// Function to fetch poem content from the text file
async function fetchPoems() {
    try {
        const response = await fetch('poems.txt');
        if (!response.ok) {
            throw new Error('Failed to fetch poems. Check the file path and permissions.');
        }
        const poemsText = await response.text();

        // Split the text by £££ to get chapters
        const chapters = poemsText.split('£££');

        // Extract poems from each chapter by $$$
        const poemsArray = chapters.map(chapter => chapter.split('$$$').map(poem => poem.trim()));

        return poemsArray;
    } catch (error) {
        console.error('Error fetching poems:', error);
        poemText.innerHTML = 'Error fetching poems. Please check the console for details.';
        return [];
    }
}

// Function to create and update the Table of Contents (ToC) menu
function updateToC(poemsArray) {
    tocMenu.innerHTML = '';
    let chapterCount = 0;

    poemsArray.forEach((chapter, index) => {
        // Create a menu item for the chapter
        const tocItem = document.createElement('div');
        tocItem.className = 'toc-item';
        tocItem.textContent = `Chapter ${chapterCount+1}`;
        tocMenu.appendChild(tocItem);

        // Add a click event to navigate to the corresponding chapter
        tocItem.addEventListener('click', () => {
            currentChapterIndex = index;
            currentPoemIndex = 0; // Reset poem index when navigating to a new chapter
            updatePoemDisplay();
        });

        chapterCount++;
    });

    // After updating ToC, reset click and swipe event listeners
    resetEventListeners();
}

function resetEventListeners() {
    // Remove existing event listeners
    poemContainer.removeEventListener('touchstart', handleTouchStart);
    poemContainer.removeEventListener('touchend', handleTouchEnd);
    poemContainer.removeEventListener('click', handleClick);

    // Add event listeners again
    poemContainer.addEventListener('touchstart', handleTouchStart);
    poemContainer.addEventListener('touchend', handleTouchEnd);
    poemContainer.addEventListener('click', handleClick);
}

// Initialize poems, current chapter index, and current poem index
let poems, currentChapterIndex, currentPoemIndex;

// Display initial message
poemText.innerHTML = 'Here is a poem';

// Fetch poems and display initial poem or show error
fetchPoems().then(poemsArray => {
    poems = poemsArray;
    if (poems.length > 0) {
        currentChapterIndex = 0;
        currentPoemIndex = 0;
        updatePoemDisplay();
        updateToC(poemsArray);
        console.log('Poems:', poems);
    } else {
        poemText.innerHTML = 'No poems available.';
    }
});

// Function to update poem display
function updatePoemDisplay() {
    // Replace new line characters with HTML line break tags for the displayed poem
    const formattedPoem = poems[currentChapterIndex][currentPoemIndex].replace(/\n/g, '<br>');
    poemText.innerHTML = formattedPoem;
}

// Update click and swipe functionality to navigate poems
function handleClick() {
    changePoem(1);
}

function handleSwipe() {
    const swipeThreshold = 50;
    const deltaX = touchendX - touchstartX;

    if (Math.abs(deltaX) > swipeThreshold) {
        changePoem(deltaX > 0 ? -1 : 1);
    }
}

function changePoem(direction) {
    const currentChapter = poems[currentChapterIndex];
    const totalPoemsInChapter = currentChapter.length;

    currentPoemIndex = (currentPoemIndex + direction + totalPoemsInChapter) % totalPoemsInChapter;
    updatePoemDisplay();
}

// Swipe and click functionality
poemContainer.addEventListener('touchstart', handleTouchStart);
poemContainer.addEventListener('touchend', handleTouchEnd);
poemContainer.addEventListener('click', handleClick);

function handleTouchStart(event) {
    touchstartX = event.changedTouches[0].screenX;
}

function handleTouchEnd(event) {
    touchendX = event.changedTouches[0].screenX;
    handleSwipe();
}

// Favorite functionality
favoriteBtn.addEventListener('click', () => {
    // Implement your favorite logic here
});