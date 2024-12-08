
//Gambo's machine main functions---->
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

     $("#message").text(spinsToPerform < times ? "Performed fewer spins due to insufficient tokens." : "");
 }

 // Calculate whether the player wins
 function isWin() {
     return Math.random() < winProbability;
 }

 // Animate the lever
 function pullLever() {
     $("#lever").css("transform", "rotate(45deg)");
     setTimeout(() => $("#lever").css("transform", "rotate(0deg)"), 500);
 }

 // Shop---->
 $("#lever-button").click(() => {
     if (tokens > 0) {
         tokens -= 1;
         updateTokenDisplay();
         pullLever();
         setTimeout(spinSlots, 500);
     } else {
         toggleDesperateOptions(true);
     }
 });

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
         showGamboMessage(hoverMessages[id] || "Money! Money! Money!");
     },
     () => $("#gambo-bubble").text("Money! Money! Money!")
 );

 $("#desperate-options button").click(function () {
     const itemMap = {
         "sell-phone": { name: "phone", tokens: 10 },
         "sell-car": { name: "car", tokens: 50 },
         "sell-wife": { name: "wife", tokens: 100 },
         "sell-house": { name: "house", tokens: 200 },
         "sell-soul": { name: "soul", tokens: 1000 }
     };
     const item = itemMap[$(this).attr("id")];
     if (item) sellItem(item.name, item.tokens, $(this));
 });

 function toggleDesperateOptions(show) {
     $("#slot-machine-container").toggle(!show);
     $("#gambo-gif, #gambo-speech").show();
     $("#desperate-options").toggle(show);

     if (show) {
         gamboShopTimeout = setTimeout(() => showGamboMessage("Tick-tock! Time is money!"), 5000);

         if ($("#desperate-options button:not(:disabled)").length === 1) {
             showGamboMessage("99% of Gamblers Quit Before They Make It Big!");
         }
     } else {
         clearTimeout(gamboShopTimeout);
     }
 }

 function sellItem(name, tokenAmount, button) {
     tokens += tokenAmount;
     updateTokenDisplay();
     $("#message").text(`You sold your ${name} for ${tokenAmount} tokens. Keep spinning!`);
     button.prop("disabled", true).text(`${name.toUpperCase()} SOLD`).css("opacity", 0.5);

     itemsSold += 1;
     winProbability = Math.max(0.1, winProbability - 0.18);

     if (name === "wife") showWifeMessage();
     if (name === "house") showFatherMessage();
     if (name === "soul") window.location.href = "gameover.html";

     toggleDesperateOptions(false);
 }

 // Messages section---->
 const wifeDialogues = ["Wife: What are you doing? Does this marriage mean anything to you? I want a divorce!"];
 const fatherDialogues = ["Father ghost: This isn't worth it. Think about what you're doing. Think of me, and your mother!"];
 let wifeDialogueIndex = 0;
 let fatherDialogueIndex = 0;

 function showWifeMessage() {
     if (wifeDialogueIndex < wifeDialogues.length) {
         $("#wife-popup .speech-bubble").text(wifeDialogues[wifeDialogueIndex++]);
         $("#wife-popup").fadeIn(300);
     }
 }

 function showFatherMessage() {
     if (fatherDialogueIndex < fatherDialogues.length) {
         $("#father-popup .speech-bubble").text(fatherDialogues[fatherDialogueIndex++]);
         $("#father-popup").fadeIn(300);
     }
 }

 $("#wife-popup, #father-popup").click(function () {
     $(this).fadeOut(300);
 });

 function showGamboMessage(text) {
     $("#gambo-bubble").stop(true, true).text(text);
     $("#gambo-speech").fadeIn(300);
 }

 updateTokenDisplay();
});