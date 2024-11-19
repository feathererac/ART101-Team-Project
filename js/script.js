let tokens = 20;
let isScrolling = false;
const slotSymbols = ["🍒", "🍋", "🍉", "⭐", "🍇"];
const tokenCounter = document.getElementById("token-counter");
const message = document.getElementById("message");
const leverButton = document.getElementById("lever-button");
const lever = document.getElementById("lever");
const receiptElement = document.getElementById("receipt");

// Function to update the token counter on the screen
function updateTokenDisplay() {
    tokenCounter.textContent = `GamBits: ${tokens}`;
}

// Function to spin the slots and update the display
function spinSlots() {
    const slots = [
        document.getElementById("slot1"),
        document.getElementById("slot2"),
        document.getElementById("slot3"),
    ];

    // Randomize symbols in the slots
    slots.forEach(slot => {
        slot.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
    });

    // Evaluate the result
    const [slot1, slot2, slot3] = slots.map(slot => slot.textContent);
    if (slot1 === slot2 && slot2 === slot3) {
        message.textContent = "JACKPOT! You win 20 tokens!";
        tokens += 20; // Add tokens on jackpot
        generateReceiptEntry();
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
        message.textContent = "It's okay, go for it!";
        generateReceiptEntry();
    } else {
        message.textContent = "Try again!";
        generateReceiptEntry();
    }
    updateTokenDisplay();
}

// Function to animate the lever
function pullLever() {
    lever.style.transform = "rotate(45deg)";
    setTimeout(() => {
        lever.style.transform = "rotate(0deg)";
    }, 500);
}

// Button click event listener
leverButton.addEventListener("click", () => {
    if (tokens > 0) {
        tokens -= 1; // Deduct one token per spin
        updateTokenDisplay();
        pullLever();
        setTimeout(spinSlots, 500); // Spin slots after lever animation
    } else {
        message.textContent = "Out of tokens!";
    }
});




updateTokenDisplay();
