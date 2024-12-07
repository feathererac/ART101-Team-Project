//Gambo's mechine main functions---->
$(document).ready(function () {
    let tokens = 20;
    const slotSymbols = ["🍒", "🍋", "🍉", "⭐", "🍇"];
    let winProbability = 1; // Base win probability
    let itemsSold = 0; // Counter for items sold
    // Update token counter
    function updateTokenDisplay() {
        $("#token-counter").text(`GamBits: ${tokens}`);
    }

    // Spin slots
    function spinSlots() {
        // Clear Gambo's current message if it exists
        $("#gambo-speech").stop(true, true).hide();
    
        const $slots = $(".slot");
        let slotValues = [];
    
        // Randomly assign symbols to slots
        $slots.each(function () {
            $(this).text(slotSymbols[Math.floor(Math.random() * slotSymbols.length)]);
        });
    
        // Get the values of the slots
        slotValues = $slots.map((_, el) => $(el).text()).get();
    
        // Check if all symbols match and isWin = True
        if (slotValues[0] === slotValues[1] && slotValues[1] === slotValues[2]) {
            if (isWin()) {
                tokens += 20; // Jackpot
                showGamboMessage("JACKPOT! Congratulations! Drinks on me?");
            } else {
                // If isWin is false, adjust the slots to not show three matching symbols
                let newSymbol;
                do {
                    newSymbol = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                } while (newSymbol === slotValues[0]); // Ensure the new symbol is different
                slotValues[2] = newSymbol;
                $slots.eq(2).text(newSymbol); // Update the third slot
                showGamboMessage("Keep going!");
            }
        } 
        else if (slotValues[0] === slotValues[1] || slotValues[1] === slotValues[2] || slotValues[0] === slotValues[2]){
            showGamboMessage("Ooh! So close!");
        } 
        else {
            showGamboMessage("Keep going!");
        }
        updateTokenDisplay();
    }

    // Multi-spin
    $("#spin-10").click(() => multiSpin(10));
    $("#spin-100").click(() => multiSpin(100));
    function multiSpin(times) {
        if (tokens <= 0) {
            showGamboMessage("Well, ain't that a shame.");
            $("#message").text("Not enough tokens!");
            return;
        }

        const spinsToPerform = Math.min(tokens, times);
        tokens -= spinsToPerform;
        updateTokenDisplay();

        showGamboMessage("Tick-tock! Time is money!");

        for (let i = 0; i < spinsToPerform; i++) {
            setTimeout(spinSlots, i * 50);
        }

        if (spinsToPerform < times) {
            $("#message").text("Performed fewer spins due to insufficient tokens.");
        } else {
            $("#message").text("");
        }
    }

    // Calculate whether the player wins
    function isWin() {
        return Math.random() < winProbability;
    }

    // Animate the lever
    function pullLever() {
        $("#lever").css("transform", "rotate(45deg)");
        setTimeout(() => {
            $("#lever").css("transform", "rotate(0deg)");
        }, 500);
    }


//Shop---->
    // DesperateOptions Event listeners
    $("#lever-button").click(() => {
        if (tokens > 0) {
            tokens -= 1;
            updateTokenDisplay();
            pullLever();
            setTimeout(spinSlots, 500);
        } else {
            // Only show desperate options if tokens are 0
            toggleDesperateOptions(true);
        }
    });
    
    // Event listeners for shop item hover
    $("#desperate-options button").hover(
        function () {
            const id = $(this).attr("id");
            const hoverMessages = {
                "sell-phone": "It's the new Pear Phone Pro Deluxe Max!",
                "sell-car": "Your good ol' 2014 Hondunny Civil.",
                "sell-wife": "Selling your wife might be just what you need to keep playing!",
                "sell-house": "Sell your house? In this economy? Brilliant move to keep playing!",
                "sell-soul": "..."
            };
            const message = hoverMessages[id];
            if (message) {
                showGamboMessage(message);
            }
        },
        function () {
            // Optionally clear the message after hover
            $("#gambo-bubble").text("Money! Money! Money!");
        }
    );

    $("#desperate-options button").click(function () {
        const id = $(this).attr("id");
        const itemMap = {
            "sell-phone": { name: "phone", tokens: 10 },
            "sell-car": { name: "car", tokens: 50 },
            "sell-wife": { name: "wife", tokens: 100 },
            "sell-house": { name: "house", tokens: 200 },
            "sell-soul": { name: "soul", tokens: 1000 },
        };
        const item = itemMap[id];
        if (item) sellItem(id, item.name, item.tokens);
    });

    // Show or hide desperate options and shop items
    function toggleDesperateOptions(show) {
        $("#slot-machine-container").toggle(!show);
        $("#gambo-gif, #gambo-speech").show(); // Gambo remains visible in shop
        $("#desperate-options").toggle(show);

        if (show) {
            // Set timeout for Gambo's message if player waits too long in the shop
            gamboShopTimeout = setTimeout(() => {
                showGamboMessage("Tick-tock! Time is money!");
            }, 5000);

            // Check if only the soul is left and display Gambo's special message
            const allDisabledExceptSoul = $("#desperate-options button")
                .toArray()
                .filter(btn => !$(btn).prop("disabled"))
                .map(btn => $(btn).attr("id"))
                .includes("sell-soul");

            if (allDisabledExceptSoul) {
                showGamboMessage("99% of Gamblers Quit Before They Make It Big!");
            }
        } else {
            clearTimeout(gamboShopTimeout);
        }
    }

    // Sell an item
    function sellItem(itemId, itemName, tokenAmount) {
        tokens += tokenAmount;
        updateTokenDisplay();
        $("#message").text(`You sold your ${itemName} for ${tokenAmount} tokens. Keep spinning!`);
        $(`#${itemId}`).prop("disabled", true).text(`${itemName} SOLD`).css("opacity", 0.5);

        itemsSold += 1;
        winProbability = Math.max(0.1, winProbability - 0.15);

        if (itemName === "wife") showWifeMessage();
        if (itemName === "house") showFatherMessage();
        if (itemName === "soul") {
            // Trigger game over scenario
            window.location.href = "gameover.html";
        }
        toggleDesperateOptions(false);
    }

//Messages section---->
    // Wife and Father dialogues
    const wifeDialogues = ["Wife: What are you doing? Does this marriage mean anything to you? I want a divorce!"];
    let wifeDialogueIndex = 0;

    const fatherDialogues = ["Father ghost: This isn't worth it. Think about what you're doing. Think of me, and your mother!"];
    let fatherDialogueIndex = 0;
    let gamboShopTimeout;

    // Function to display character messages sequentially and persist until clicked
    function showWifeMessage() {
        if (wifeDialogueIndex < wifeDialogues.length) {
            $("#wife-popup .speech-bubble").text(wifeDialogues[wifeDialogueIndex]);
            $("#wife-popup").fadeIn(300);
            wifeDialogueIndex++;
        }
    }

    function showFatherMessage() {
        if (fatherDialogueIndex < fatherDialogues.length) {
            $("#father-popup .speech-bubble").text(fatherDialogues[fatherDialogueIndex]);
            $("#father-popup").fadeIn(300);
            fatherDialogueIndex++;
        }
    }
    // Make wife and father popups hide when clicked
    $("#wife-popup").click(function () {
        $(this).fadeOut(300);
    });

    $("#father-popup").click(function () {
        $(this).fadeOut(300);
    });

    // Function to display Gambo's message and hide previous messages if interrupted
    function showGamboMessage(text) {
        // Clear current message and animations
        $("#gambo-bubble").stop(true, true).text(text);
        $("#gambo-speech").fadeIn(300);
    }

    // Initial display update
    updateTokenDisplay();
});
