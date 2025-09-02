// This script is injected into the back of the card by the __init__.py file.

/**
 * Converts a number to its ordinal form (e.g., 1 -> "1st") using the Intl API.
 * It uses a language code provided by the Python script to handle internationalization.
 *
 * @param {number} n The number to convert.
 * @param {string} lang The BCP 47 language tag (e.g., "en", "de").
 * @returns {string} The ordinal string.
 */
function toOrdinal(n, lang) {
  try {
    // Use the base language code (e.g., "en" from "en-US")
    const langCode = lang.split("-")[0];
    const pr = new Intl.PluralRules(langCode, { type: "ordinal" });
    const rule = pr.select(n);

    // English is one of the few languages with unique suffixes for 1, 2, 3.
    // Most other languages don't use this system, so returning the number with a dot
    // is a safe and common international fallback.
    if (langCode === "en") {
      const suffixes = new Map([
        ["one", "st"],
        ["two", "nd"],
        ["few", "rd"],
        ["other", "th"],
      ]);
      return n + suffixes.get(rule);
    }
    return n + ".";
  } catch (e) {
    // If the Intl API fails for any reason (e.g., unsupported language code),
    // fall back to a simple number.
    return n.toString();
  }
}

// These placeholders are replaced by the Python script before injection.
var isDisplayAnswerLetters = __IS_DISPLAY_ANSWER_LETTERS__;
var ttsLang = "__TTS_LANG__";

onUpdateHook.push(function () {
  if (!window.Persistence || !Persistence.isAvailable()) return;

  const divArray = Persistence.getItem("_MCNT_DivArray");
  if (!divArray || divArray.length === 0) return;

  // This variable is defined globally in back_template.html
  if (typeof answerJsonLookUp === "undefined") return;
  const originalOrder = Object.keys(answerJsonLookUp);

  const elementsToScan = document.querySelectorAll(
    "#explanation, #ref, #answer-div",
  );

  elementsToScan.forEach((element) => {
    if (!element) return;
    let content = element.innerHTML;

    const regex = /\{\{ans:(\d+)\}\}/g;

    let newContent = content.replace(regex, (placeholder, numberStr) => {
      const number = parseInt(numberStr, 10);
      if (number > 0 && number <= originalOrder.length) {
        const originalId = originalOrder[number - 1];
        const shuffledIndex = divArray.indexOf(originalId);

        if (shuffledIndex !== -1) {
          let replacementText;
          if (isDisplayAnswerLetters) {
            // If letters are shown, use the letter for the reference.
            replacementText = String.fromCharCode(shuffledIndex + 65);
          } else {
            // If letters are NOT shown, use the ordinal number to identify the answer.
            replacementText = toOrdinal(shuffledIndex + 1, ttsLang);
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
