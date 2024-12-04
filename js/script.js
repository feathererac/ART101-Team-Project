$(document).ready(function () {
    let tokens = 20;
    const slotSymbols = ["🍒", "🍋", "🍉", "⭐", "🍇"];
    let winProbability = 1; // Base win probability
    let itemsSold = 0; // Counter for items sold

    // Update token counter
    function updateTokenDisplay() {
        $("#token-counter").text(`GamBits: ${tokens}`);
    }

    // Calculate whether the player wins
    function isWin() {
        return Math.random() < winProbability;
    }

    // Spin slots
    function spinSlots() {
        const $slots = $(".slot");
        $slots.each(function () {
            $(this).text(slotSymbols[Math.floor(Math.random() * slotSymbols.length)]);
        });

        const slotValues = $slots.map((_, el) => $(el).text()).get();
        if (slotValues[0] === slotValues[1] && slotValues[1] === slotValues[2] && isWin()) {
            $("#message").text("JACKPOT! You win 20 tokens!");
            tokens += 20;
        } else if ((slotValues[0] === slotValues[1] || slotValues[1] === slotValues[2] || slotValues[0] === slotValues[2]) && isWin()) {
            $("#message").text("Nice try!");
        } else {
            $("#message").text("Try again!");
            showCharacterMessage("You will have better luck next time!");
        }
        updateTokenDisplay();
    }

    // Animate the lever
    function pullLever() {
        $("#lever").css("transform", "rotate(45deg)");
        setTimeout(() => {
            $("#lever").css("transform", "rotate(0deg)");
        }, 500);
    }

    // Multi-spin
    function multiSpin(times) {
        if (tokens <= 0) {
            $("#message").text("Not enough tokens!");
            return;
        }

        const spinsToPerform = Math.min(tokens, times);
        tokens -= spinsToPerform;
        updateTokenDisplay();

        for (let i = 0; i < spinsToPerform; i++) {
            setTimeout(spinSlots, i * 50);
        }

        if (spinsToPerform < times) {
            $("#message").text("Performed fewer spins due to insufficient tokens.");
        } else {
            $("#message").text("");
        }
    }

    // Show or hide desperate options
    function toggleDesperateOptions(show) {
        $("#slot-machine-container, #gambo-gif, #gambo-speech").toggle(!show);
        $("#desperate-options").toggle(show);
    }

    // Sell an item
    function sellItem(itemId, itemName, tokenAmount) {
        tokens += tokenAmount;
        updateTokenDisplay();
        $("#message").text(`You sold your ${itemName} for ${tokenAmount} tokens. Keep spinning!`);
        $(`#${itemId}`).prop("disabled", true).text(`${itemName} SOLD`).css("opacity", 0.5);

        itemsSold += 1;
        winProbability = Math.max(0.1, winProbability - 0.15);

        if (itemName === "car") showWifeMessage();
        if (itemName === "house") showFatherMessage();
        toggleDesperateOptions(false);
    }

    // Character popups
    function showCharacterMessage(text) {
        const $popup = $("#character-popup");
        $popup.find(".speech-bubble").text(text);
        $popup.fadeIn(300).delay(3000).fadeOut(300);
    }

    function showWifeMessage() {
        $("#wife-popup").fadeIn(300).delay(3000).fadeOut(300);
    }

    function showFatherMessage() {
        $("#father-popup").fadeIn(300).delay(3000).fadeOut(300);
    }

    // Event listeners
    $("#lever-button").click(() => {
        if (tokens > 0) {
            tokens -= 1;
            updateTokenDisplay();
            pullLever();
            setTimeout(spinSlots, 500);
        } else {
            const allDisabled = $("#desperate-options button").toArray().every(btn => $(btn).prop("disabled"));
            if (allDisabled && tokens === 0) {
                window.location.href = "gameover.html";
            } else {
                toggleDesperateOptions(true);
            }
        }
    });

    $("#spin-10").click(() => multiSpin(10));
    $("#spin-100").click(() => multiSpin(100));

    $("#desperate-options button").click(function () {
        const id = $(this).attr("id");
        const itemMap = {
            "sell-watch": { name: "watch", tokens: 5 },
            "sell-phone": { name: "phone", tokens: 10 },
            "sell-car": { name: "car", tokens: 50 },
            "sell-house": { name: "house", tokens: 100 },
            "sell-soul": { name: "soul", tokens: 1000 },
        };
        const item = itemMap[id];
        if (item) sellItem(id, item.name, item.tokens);
    });

    $("#gambo-bubble").click(() => {
        const lines = [
            "Welcome to Gambo's Slot Machine!",
            "Keep spinning for amazing prizes!",
            "Feeling lucky today?",
            "Out of tokens? Visit the shop to recover!",
        ];
        const index = (lines.indexOf($("#gambo-bubble").text()) + 1) % lines.length;
        $("#gambo-bubble").text(lines[index]);
    });

    // Initial display update
    updateTokenDisplay();
});