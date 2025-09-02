onUpdateHook.push(function () {
  if (!window.Persistence || !Persistence.isAvailable()) {
    return;
  }

  const divArray = Persistence.getItem("_MCNT_DivArray");
  if (!divArray || divArray.length === 0) {
    return;
  }

  // This variable is defined globally in back_template.html
  if (typeof answerJsonLookUp === "undefined") {
    return;
  }
  const originalOrder = Object.keys(answerJsonLookUp);

  const elementsToScan = document.querySelectorAll(
    "#explanation, #ref, #answer-div",
  );

  elementsToScan.forEach((element) => {
    if (!element) {
      return;
    }
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
          const letter = String.fromCharCode(shuffledIndex + 65);
          return `<b>${letter}</b>`;
        }
      }
      return placeholder;
    });

    if (content !== newContent) {
      element.innerHTML = newContent;
    }
  });
});
