let Game = function() {

    this.letters = ['в', 'д', 'о', 'х', 'ы'];
    this.words = ['ход', 'вдох', 'вход', 'выдох', 'выход'];
    this.foundWords = [];
    this.lengthWords = this.words.map(w => w.length);

    this.choiseLetters = [];

    this.viewVictory = function() {
    }
}

Game.prototype.isAllWordsFound = function() {
    if (this.foundWords.length == this.words.length) {
        setTimeout(() => this.viewVictory(), 500);
    }
}

Game.prototype.readTextFile = function(file) {
    let fileUtil = cc.fileUtil.getInstance(file);
    var jData = JSON.parse(data);
};

Game.prototype.choiseLetter = function(letter) {
    if (this.choiseLetters.indexOf(letter) == -1)
        this.choiseLetters.push(letter);
};

Game.prototype.makeArrayWords = function(word, minLength) {

    const regex = new RegExp("[^" + `${word}` + "]");
    words.forEach(testString => {
        if(!regex.test(testString) && testString.length >= minLength && testString.length <= word.length) {
            let checkLet = true;
            testString.split('').forEach(l => {
                if (testString.split(l).length - 1 != word.split(l).length - 1) {
                    checkLet = false;
                    return;
                }
            })
            if (checkLet) this.words.push(testString);
        }
    })
};
Game.prototype.initArrayLetters = function() {
}

