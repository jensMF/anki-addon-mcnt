from aqt import Collection, mw
from aqt.gui_hooks import profile_did_open, card_will_show
from anki.consts import MODEL_STD
from anki.cards import Card
from functools import cache
from typing import Any

# --- Add-on Configuration ---
mcnt_type_name = "Dynamic MCNT Type"
mcnt_card_name = "Dynamic MCNT Card"

front_template_path = "card-templates/front_template.html"
back_template_path = "card-templates/back_template.html"
styling_template_path = "card-templates/styling.css"
script_path = "resources/script.js"

# --- Helper Functions ---
def get_addon_path() -> str:
    """Returns the full path to the add-on's folder."""
    return mw.addonManager.addonsFolder() + "/" + mw.addonManager.addonFromModule(__name__) + "/"

@cache
def load_file(path: str) -> str:
    """Loads a file from the add-on's directory."""
    with open(get_addon_path() + path, encoding="utf-8") as f:
        return f.read()

# --- JavaScript Injection ---

def on_card_will_show(html: str, card: Card, context: str) -> str:
    """
    Appends the javascript to the card's HTML when the answer is shown.
    """
    if context != "reviewAnswer" or card.note_type()["name"] != mcnt_type_name:
        return html

    injected_script = f"<script>{load_file(script_path)}</script>"
    return html + injected_script

# --- Note Type Creation and Management ---

def setup_note_type(col: Collection) -> None:
    """
    Creates or updates the MCNT note type with the correct fields, templates, and styling.
    """
    model = col.models.by_name(mcnt_type_name)
    is_new = not model

    if is_new:
        model = col.models.new(mcnt_type_name)
        model["type"] = MODEL_STD
        model["sortf"] = 0

        fields = ["number", "question", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "answers", "ref", "explanation"]
        for f in fields:
            col.models.add_field(model, col.models.new_field(f))

        template = col.models.new_template(mcnt_card_name)
        col.models.add_template(model, template)

    config = mw.addonManager.getConfig(__name__)
    isShuffle = config.get("isShuffle", False)
    isDisplayAnswerLetters = config.get("isDisplayAnswerLetters", True)
    isTTS = config.get("isTTS", False)
    TTSLang = config.get("TTSLang", "en_US")

    # --- Configure Front Template ---
    front_template = load_file(front_template_path)
    front_template = front_template.replace("isShuffle", "true" if isShuffle else "false")
    front_template = front_template.replace("isDisplayAnswerLetters", "true" if isDisplayAnswerLetters else "false")

    tts_front_html = ""
    if isTTS:
        tts_front_html = '<div id="tts">{{tts ' + TTSLang + ' speed=0.8 voices=Apple_Samantha,Microsoft_Haruka:question}}</div>'
    front_template = front_template.replace("<!-- TTS_FRONT -->", tts_front_html)
    model["tmpls"][0]["qfmt"] = front_template

    # --- Configure Back Template ---
    back_template = load_file(back_template_path)
    back_template = back_template.replace("isDisplayAnswerLetters", "true" if isDisplayAnswerLetters else "false")

    tts_back_html = "<b>Explanation: </b>"
    if isTTS:
        tts_back_html = '<b>Explanation: {{tts ' + TTSLang + ' speed=0.8 voices=Apple_Samantha,Microsoft_Haruka:explanation}}</b>'
    back_template = back_template.replace("<!-- TTS_BACK -->", tts_back_html)
    model["tmpls"][0]["afmt"] = back_template

    model["css"] = load_file(styling_template_path)

    # --- Save the model to the database ---
    if is_new:
        col.models.add(model)
    else:
        col.models.save(model)

def on_profile_did_open() -> None:
    """
    A hook that runs when a user profile is loaded.
    """
    setup_note_type(mw.col)

# --- Register Hooks ---
profile_did_open.append(on_profile_did_open)
card_will_show.append(on_card_will_show)
