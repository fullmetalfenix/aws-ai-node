function App() {
  const [inputText, setInputText] = React.useState("");
  const [translatedText, setTranslatedText] = React.useState("");
  const languageSelectRef = React.createRef();
  const handleTranslate = async () => {
    const targetLanguage = languageSelectRef.current.value;
    AWS.config.update({
      region: config.AWS_REGION,
      credentials: new AWS.Credentials({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      }),
    });

    const translate = new AWS.Translate();

    const params = {
      Text: inputText,
      SourceLanguageCode: "auto", // you can specify here - I am leving it at auto as I think it has the most utility
      TargetLanguageCode: targetLanguage, // target language code
    };

    try {
      const result = await translate.translateText(params).promise();
      setTranslatedText(result.TranslatedText);
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const languages = {
    af: "Afrikaans",
    sq: "Albanian",
    am: "Amharic",
    ar: "Arabic",
    hy: "Armenian",
    az: "Azerbaijani",
    bn: "Bengali",
    bs: "Bosnian",
    bg: "Bulgarian",
    ca: "Catalan",
    zh: "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    "fa-AF": "Dari",
    nl: "Dutch",
    en: "English",
    et: "Estonian",
    fa: "Farsi (Persian)",
    tl: "Filipino",
    fi: "Finnish",
    fr: "French",
    "fr-CA": "French (Canada)",
    ka: "Georgian",
    de: "German",
    el: "Greek",
    gu: "Gujarati",
    ht: "Haitian Creole",
    ha: "Hausa",
    he: "Hebrew",
    hi: "Hindi",
    hu: "Hungarian",
    is: "Icelandic",
    id: "Indonesian",
    ga: "Irish",
    it: "Italian",
    ja: "Japanese",
    kn: "Kannada",
    kk: "Kazakh",
    ko: "Korean",
    lv: "Latvian",
    lt: "Lithuanian",
    mk: "Macedonian",
    ms: "Malay",
    ml: "Malayalam",
    mt: "Maltese",
    mr: "Marathi",
    mn: "Mongolian",
    no: "Norwegian",
    ps: "Pashto",
    pl: "Polish",
    pt: "Portuguese",
    "pt-PT": "Portuguese (Portugal)",
    pa: "Punjabi",
    ro: "Romanian",
    ru: "Russian",
    sr: "Serbian",
    si: "Sinhala",
    sk: "Slovak",
    sl: "Slovenian",
    so: "Somali",
    es: "Spanish",
    "es-MX": "Spanish (Mexico)",
    sw: "Swahili",
    sv: "Swedish",
    ta: "Tamil",
    te: "Telugu",
    th: "Thai",
    tr: "Turkish",
    uk: "Ukrainian",
    ur: "Urdu",
    uz: "Uzbek",
    vi: "Vietnamese",
    cy: "Welsh",
  };

  return (
    <div id="main-container">
      <div id="image-container">
        <img
          src="earth-drawing.png"
          id="main-pic"
          alt="Picture of earth drawn on notebook paper and symbols of communication doodled around it"
        />
      </div>
      <div id="form-container">
        <h1>Auto Translate</h1>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to translate, the language will be detected automatically. "
        />
        <select ref={languageSelectRef}>
          <option value="">Select target language</option>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>

        <button onClick={handleTranslate}>Translate</button>

        {translatedText == "" ? (
          ""
        ) : (
          <div>
            <h3>Translated Text:</h3>
            <p id="translated-text-area">{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
