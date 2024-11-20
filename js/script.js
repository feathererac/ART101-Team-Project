let tokens = 20;
const slotSymbols = ["🍒", "🍋", "🍉", "⭐", "🍇"];
const tokenCounter = document.getElementById("token-counter");
const message = document.getElementById("message");
const lever = document.getElementById("lever");
const slotMachineContainer = document.getElementById("slot-machine-container");
const desperateOptions = document.getElementById("desperate-options");

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
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
        message.textContent = "It's okay, go for it!";
    } else {
        message.textContent = "Try again!";
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

// Function to show the desperate options
function showDesperateOptions() {
    slotMachineContainer.style.display = "none"; // Hide slot machine
    desperateOptions.style.display = "block"; // Show desperate options
}

// Function to sell an item and gain tokens
function sellItem(itemId, itemName, tokenAmount) {
    // Add tokens
    tokens += tokenAmount;
    updateTokenDisplay();

    // Update message
    message.textContent = `You sold your ${itemName} for ${tokenAmount} tokens. Keep spinning!`;

    // Disable or hide the button
    const button = document.getElementById(itemId);
    button.disabled = true;
    button.textContent = `${itemName} SOLD`; // Update button text
    button.style.opacity = 0.5; // Make it look disabled

    // Immediately restore the game after selling
    restoreGameContainer();
}


// Function to restore the slot machine
function restoreGameContainer() {
    desperateOptions.style.display = "none"; // Hide desperate options
    slotMachineContainer.style.display = "block"; // Show slot machine
}

// Add event listeners for the desperate options
document.getElementById("sell-watch").addEventListener("click", () => sellItem("sell-watch", "watch", 5));
document.getElementById("sell-phone").addEventListener("click", () => sellItem("sell-phone", "phone", 10));
document.getElementById("sell-car").addEventListener("click", () => sellItem("sell-car", "car", 50));
document.getElementById("sell-house").addEventListener("click", () => sellItem("sell-house", "house", 100));
document.getElementById("sell-soul").addEventListener("click", () => sellItem("sell-soul", "soul", 1000));

// Modify the lever button logic
document.getElementById("lever-button").addEventListener("click", () => {
    if (tokens > 0) {
        tokens -= 1; // Deduct one token per spin
        updateTokenDisplay();
        pullLever();
        setTimeout(spinSlots, 500); // Spin slots after lever animation
    } else {
        showDesperateOptions(); // Show options when out of tokens
    }
});

updateTokenDisplay();

