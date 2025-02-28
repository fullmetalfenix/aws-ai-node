function App() {
    const [inputText, setInputText] = React.useState('');
    const [translatedText, setTranslatedText] = React.useState('');
    const languageSelectRef = React.createRef()
    const handleTranslate = async () => {
        const targetLanguage = languageSelectRef.current.value;
        AWS.config.update({
            region: config.AWS_REGION,
            credentials: new AWS.Credentials({
                accessKeyId: config.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY
            })
        });

        const translate = new AWS.Translate();

        const params = {
            Text: inputText,
            SourceLanguageCode: 'auto', // you can specify here - I am leving it at auto as I think it has the most utility
            TargetLanguageCode: targetLanguage    // target language code
        };

        try {
            const result = await translate.translateText(params).promise();
            setTranslatedText(result.TranslatedText);
        } catch (error) {
            console.error('Translation error:', error);
        }
    };



    const languages = {
        "af": "Afrikaans",
        "sq": "Albanian",
        "am": "Amharic",
        "ar": "Arabic",
        "hy": "Armenian",
        "az": "Azerbaijani",
        "bn": "Bengali",
        "bs": "Bosnian",
        "bg": "Bulgarian",
        "ca": "Catalan",
        "zh": "Chinese (Simplified)",
        "zh-TW": "Chinese (Traditional)",
        "hr": "Croatian",
        "cs": "Czech",
        "da": "Danish",
        "fa-AF": "Dari",
        "nl": "Dutch",
        "en": "English",
        "et": "Estonian",
        "fa": "Farsi (Persian)",
        "tl": "Filipino",
        "fi": "Finnish",
        "fr": "French",
        "fr-CA": "French (Canada)",
        "ka": "Georgian",
        "de": "German",
        "el": "Greek",
        "gu": "Gujarati",
        "ht": "Haitian Creole",
        "ha": "Hausa",
        "he": "Hebrew",
        "hi": "Hindi",
        "hu": "Hungarian",
        "is": "Icelandic",
        "id": "Indonesian",
        "ga": "Irish",
        "it": "Italian",
        "ja": "Japanese",
        "kn": "Kannada",
        "kk": "Kazakh",
        "ko": "Korean",
        "lv": "Latvian",
        "lt": "Lithuanian",
        "mk": "Macedonian",
        "ms": "Malay",
        "ml": "Malayalam",
        "mt": "Maltese",
        "mr": "Marathi",
        "mn": "Mongolian",
        "no": "Norwegian",
        "ps": "Pashto",
        "pl": "Polish",
        "pt": "Portuguese",
        "pt-PT": "Portuguese (Portugal)",
        "pa": "Punjabi",
        "ro": "Romanian",
        "ru": "Russian",
        "sr": "Serbian",
        "si": "Sinhala",
        "sk": "Slovak",
        "sl": "Slovenian",
        "so": "Somali",
        "es": "Spanish",
        "es-MX": "Spanish (Mexico)",
        "sw": "Swahili",
        "sv": "Swedish",
        "ta": "Tamil",
        "te": "Telugu",
        "th": "Thai",
        "tr": "Turkish",
        "uk": "Ukrainian",
        "ur": "Urdu",
        "uz": "Uzbek",
        "vi": "Vietnamese",
        "cy": "Welsh"
    };


    return (
        <div>
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate"
            />
            <select ref={languageSelectRef}>
                {Object.entries(languages).map(([code, name]) => (
                    <option key={code} value={code}>
                        {name}
                    </option>
                ))}
            </select>

            <button onClick={handleTranslate}>Translate</button>
            <div>
                <h3>Translated Text:</h3>
                <p>{translatedText}</p>
            </div>
        </div>
    );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);