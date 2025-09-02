// Helper function to convert a number to its ordinal form (e.g., 1 -> "1st")
function toOrdinal(n) {
  var s = ["th", "st", "nd", "rd"];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

onUpdateHook.push(function () {
  if (!window.Persistence || !Persistence.isAvailable()) return;

  const divArray = Persistence.getItem("_MCNT_DivArray");
  if (!divArray || divArray.length === 0) return;

  // This variable is defined globally in back_template.html
  if (typeof answerJsonLookUp === "undefined") return;
  const originalOrder = Object.keys(answerJsonLookUp);

  // This variable is set globally by the template file's script
  const displayLetters =
    typeof isDisplayAnswerLetters !== "undefined"
      ? isDisplayAnswerLetters
      : false;

  const elementsToScan = document.querySelectorAll(
    "#explanation, #ref, #answer-div",
  );

  elementsToScan.forEach((element) => {
    if (!element) return;
    let content = element.innerHTML;

    // This regex finds {{ans:N}} placeholders.
    // The curly braces must be escaped for the JS regex engine.
    const regex = /\{\{ans:(\d+)\}\}/g;

    let newContent = content.replace(regex, (placeholder, numberStr) => {
      const number = parseInt(numberStr, 10);
      if (number > 0 && number <= originalOrder.length) {
        const originalId = originalOrder[number - 1];
        const shuffledIndex = divArray.indexOf(originalId);

        if (shuffledIndex !== -1) {
          let replacementText;
          if (displayLetters) {
            // If letters are already shown, use the letter for the reference.
            replacementText = String.fromCharCode(shuffledIndex + 65);
          } else {
            // If letters are NOT shown, use the ordinal number to identify the answer.
            replacementText = toOrdinal(shuffledIndex + 1);
          }
          return `<b>${replacementText}</b>`;
        }
      }
      return placeholder;
    });

    if (content !== newContent) {
      element.innerHTML = newContent;
    }
  });
});
