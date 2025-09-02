onUpdateHook.push(function () {
  console.log("MCNT DEBUG (from file): Script starting.");

  if (!window.Persistence || !Persistence.isAvailable()) {
    console.log(
      "MCNT DEBUG (from file): Persistence is not available. Exiting.",
    );
    return;
  }

  const divArray = Persistence.getItem("_MCNT_DivArray");
  console.log("MCNT DEBUG (from file): Retrieved divArray:", divArray);
  if (!divArray || divArray.length === 0) {
    console.log(
      "MCNT DEBUG (from file): divArray is missing or empty. Exiting.",
    );
    return;
  }

  if (typeof answerJsonLookUp === "undefined") {
    console.log(
      "MCNT DEBUG (from file): answerJsonLookUp is not defined. Exiting.",
    );
    return;
  }
  const originalOrder = Object.keys(answerJsonLookUp);
  console.log("MCNT DEBUG (from file): Original answer order:", originalOrder);

  const elementsToScan = document.querySelectorAll(
    "#explanation, #ref, #answer-div",
  );
  console.log(
    "MCNT DEBUG (from file): Found elements to scan:",
    elementsToScan.length,
  );

  elementsToScan.forEach((element, index) => {
    if (!element) {
      console.log(`MCNT DEBUG (from file): Element ${index} is null.`);
      return;
    }
    let content = element.innerHTML;

    // In a regex literal, curly braces are special characters for quantifiers
    // and must be escaped to be treated as literal characters.
    const regex = /\{\{ans:(\d+)\}\}/g;
    let matchFound = false;

    let newContent = content.replace(regex, (placeholder, numberStr) => {
      matchFound = true;
      console.log(`MCNT DEBUG (from file): Found placeholder: ${placeholder}`);
      const number = parseInt(numberStr, 10);
      if (number > 0 && number <= originalOrder.length) {
        const originalId = originalOrder[number - 1];
        const shuffledIndex = divArray.indexOf(originalId);

        if (shuffledIndex !== -1) {
          const letter = String.fromCharCode(shuffledIndex + 65);
          console.log(
            `MCNT DEBUG (from file): Replacing with letter: ${letter}`,
          );
          return `<b>${letter}</b>`;
        } else {
          console.log(
            `MCNT DEBUG (from file): originalId '${originalId}' not found in shuffled divArray.`,
          );
        }
      } else {
        console.log(
          `MCNT DEBUG (from file): Invalid number '${numberStr}' in placeholder.`,
        );
      }
      return placeholder;
    });

    if (!matchFound) {
      console.log(
        `MCNT DEBUG (from file): No placeholders found in element ${index}.`,
      );
    }

    if (content !== newContent) {
      console.log(
        `MCNT DEBUG (from file): Content was updated for element ${index}.`,
      );
      element.innerHTML = newContent;
    }
  });
  console.log("MCNT DEBUG (from file): Script finished.");
});
