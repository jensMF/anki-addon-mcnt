# anki-addon-mcnt

This add-on provide a Multiple Choice Note Type in Anki ([Link](https://ankiweb.net/shared/info/1859136708))

#### Radio Format

<img src="https://raw.githubusercontent.com/jasonlws/anki-addon-mcnt/master/resources/radio_incorrect.gif" width="700"> 

#### Checkbox Format

<img src="https://raw.githubusercontent.com/jasonlws/anki-addon-mcnt/master/resources/checkbox.gif" width="700"> 

#### Shuffle Enabled

<img src="https://raw.githubusercontent.com/jasonlws/anki-addon-mcnt/master/resources/checkbox_shuffle.gif" width="700"> 

### Fields

- **number**: Question Number
- **question**: Question
- **a, b, c, d, e, f, g, h, i, j**: The list of answers
- **answers**: Correct answers (Delimiter: commas(,)) - More than one answers show as Checkbox format, otherwise, Radio format
- **ref**: Reference
- **explanation**: Explanation Box

#### Example - Radio Format

<img src="https://raw.githubusercontent.com/jasonlws/anki-addon-mcnt/master/resources/radio_fields.png" width="700"> 

#### Example - Checkbox Format

<img src="https://raw.githubusercontent.com/jasonlws/anki-addon-mcnt/master/resources/checkbox_fields.png" width="700">  

#### Example - Limit The Number of Choice

- You may leave the answer field empty to hide the choice.

<img src="https://raw.githubusercontent.com/jasonlws/anki-addon-mcnt/master/resources/empty_fields.png" width="700">

### Configuration

Change the order of the list of answers. ( Tools -> Add-ons -> Select "Multiple Choice Note Type" -> Config)

- **Default** - The list of choices is displayed in a fixed order. ( Chnage `isShuffle` value to `false` )
- The list of choices is displayed in a shuffle order. ( Chnage `isShuffle` value to `true` )

Change the display of letters of answers. ( Tools -> Add-ons -> Select "Multiple Choice Note Type" -> Config)

- **Default** - The list of choices is displayed with letters. ( Chnage `isDisplayAnswerLetters` value to `true` )
- The list of choices is displayed without letters. ( Chnage `isDisplayAnswerLetters` value to `false` )

<img src="https://raw.githubusercontent.com/jasonlws/anki-addon-mcnt/master/resources/config.png" width="700"> 

### Chnagelog

V1.0.0 - 2024-08-28

- First Release of **Multiple Choice Note Type**

V1.0.1 - 2024-09-11

- Bugfix - Only one radio button allow select

V1.0.2 - 2025-02-13

- Enhance - Change the display of letters of answers