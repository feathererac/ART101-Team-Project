let tokens = 20;
const slotSymbols = ["🍒", "🍋", "🍉", "⭐", "🍇"];
const tokenCounter = document.getElementById("token-counter");
const message = document.getElementById("message");
const lever = document.getElementById("lever");
const slotMachineContainer = document.getElementById("slot-machine-container");
const desperateOptions = document.getElementById("desperate-options");

let winProbability = 1; // Base win probability (1 = 100%)
let itemsSold = 0; // Counter for items sold

// Function to update the token counter on the screen
function updateTokenDisplay() {
    tokenCounter.textContent = `GamBits: ${tokens}`;
}

// Function to calculate whether the player wins
function isWin() {
    return Math.random() < winProbability;
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
    if (slot1 === slot2 && slot2 === slot3 && isWin()) {
        message.textContent = "JACKPOT! You win 20 tokens!";
        tokens += 20; // Add tokens on jackpot
    } else if ((slot1 === slot2 || slot2 === slot3 || slot1 === slot3) && isWin()) {
        message.textContent = "Nice try!";
    } else {
        message.textContent = "Try again!";
        showCharacterMessage("You will have better luck next time!");
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

// Multi-spin functionality
function multiSpin(times) {
    if (tokens < times) {
        message.textContent = "Not enough tokens!";
        return;
    }

    tokens -= times; // Deduct tokens for the spins
    updateTokenDisplay();

    for (let i = 0; i < times; i++) {
        setTimeout(() => {
            spinSlots();
        }, i * 500); // Delay each spin
    }
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

    // Decrease probability of winning
    itemsSold += 1;
    winProbability = Math.max(0.1, winProbability - 0.15); // Minimum probability is 10%

    // Trigger specific character messages based on the item sold
    if (itemName === "car") {
        showWifeMessage(); // Show the disappointed wife
    } else if (itemName === "house") {
        showFatherMessage(); // Show the disappointed father
    }

    // Restore the game after selling
    restoreGameContainer();
}



// Function to restore the slot machine
function restoreGameContainer() {
    desperateOptions.style.display = "none"; // Hide desperate options
    slotMachineContainer.style.display = "block"; // Show slot machine
    message.textContent = ""; // Clear any lingering messages
}

// Add event listeners for the desperate options
document.getElementById("sell-watch").addEventListener("click", () => sellItem("sell-watch", "watch", 5));
document.getElementById("sell-phone").addEventListener("click", () => sellItem("sell-phone", "phone", 10));
document.getElementById("sell-car").addEventListener("click", () => sellItem("sell-car", "car", 50));
document.getElementById("sell-house").addEventListener("click", () => sellItem("sell-house", "house", 100));
document.getElementById("sell-soul").addEventListener("click", () => sellItem("sell-soul", "soul", 1000));

// Add event listeners for multi-spin buttons
document.getElementById("spin-10").addEventListener("click", () => multiSpin(10));
document.getElementById("spin-100").addEventListener("click", () => multiSpin(100));

// Modify the lever button logic
document.getElementById("lever-button").addEventListener("click", () => {
    if (tokens > 0) {
        tokens -= 1; // Deduct one token per spin
        updateTokenDisplay();
        pullLever();
        setTimeout(spinSlots, 500); // Spin slots after lever animation
    } else {
        // Check if all items are sold and tokens are 0
        const allButtonsDisabled = [...document.querySelectorAll("#desperate-options button")]
            .every(btn => btn.disabled);

        if (allButtonsDisabled && tokens === 0) {
            // Redirect to Game Over page
            window.location.href = "gameover.html";
        } else {
            showDesperateOptions(); // Show options if not game over
        }
    }
});

//Character
function showCharacterMessage(messageText) {
    const popup = document.getElementById("character-popup");
    const speechBubble = popup.querySelector(".speech-bubble");

    speechBubble.textContent = messageText;
    popup.style.display = "block";

    // Hide the popup after 3 seconds
    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}
function showWifeMessage() {
    const popup = document.getElementById("wife-popup");
    popup.style.display = "block";

    // Hide the popup after 3 seconds
    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}

function showFatherMessage() {
    const popup = document.getElementById("father-popup");
    popup.style.display = "block";

    // Hide the popup after 3 seconds
    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}

updateTokenDisplay();

