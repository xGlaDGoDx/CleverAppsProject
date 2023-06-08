let transcriptRus = function(letter) {
    let transcript = {
        'а' : 'a',
        'б' : 'b',
        'в' : 'v',
        'г' : 'g',
        'д' : 'd',
        'е' : 'e',
        'ё' : 'yo',
        'ж' : 'zh',
        'з' : 'z',
        'и' : 'i',
        'й' : 'j',
        'к' : 'k',
        'л' : 'l',
        'м' : 'm',
        'н' : 'n',
        'о' : 'o',
        'п' : 'p',
        'р' : 'r',
        'с' : 'c',
        'т' : 't',
        'у' : 'u',
        'ф' : 'f',
        'х' : 'x',
        'ц' : 'cz',
        'ш' : 'sh',
        'щ' : 'shh',
        'ъ' : 'tz',
        'ы' : 'y',
        'ь' : 'mz',
        'э' : 'eh',
        'ю' : 'yu',
        'я' : 'ya'
    };

    return transcript[letter];
}