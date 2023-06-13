let Game = function() {

    this.letters = ['в', 'д', 'о', 'х', 'ы'];
    this.words = ['ход', 'вдох', 'вход', 'выдох', 'выход'];
    this.foundWords = [];
    this.lengthWords = this.words.map(w => w.length);

    this.choiseLetters = [];
    this.viewChoiseLetters = [];

    this.coins = 2000;

    this.viewVictory = function() {
    };

    this.showChoiseLetters = function() {
    };

    this.onChangeCoins = function() {
    };

    this.updateShowChoiseLetters = function() {
    };

    

    this.run();
}

Game.prototype.haveCoins = function(price) {
    return this.coins >= price;
}

Game.prototype.run = function() {
    this.interval = setInterval(() => this.isAllWordsFound(), 100);
},

Game.prototype.stop = function() {
    clearInterval(this.interval)
},

Game.prototype.spendCoins = function(price) {
    this.coins -= price;
    this.onChangeCoins();
}

Game.prototype.isAllWordsFound = function() {
    if (this.foundWords.length == this.words.length) {
        setTimeout(() => this.viewVictory(), 500);
        this.stop();
    }
}

Game.prototype.readTextFile = function(file) {
    let fileUtil = cc.fileUtil.getInstance(file);
    var jData = JSON.parse(data);
};

Game.prototype.removeChoiseLetters = function() {
    while (this.choiseLetters.length > 0) {
        let letView = this.choiseLetters.pop();
        letView.makeInactive();
    }
};

Game.prototype.removeShowChoiseLetters = function() {
    let animationSpeed = 0.5;
    cc.audioEngine.playEffect(resources['game_' + (this.choiseLetters.length + 1) + '_letter_effect'], false)
    while (this.viewChoiseLetters.length != this.choiseLetters.length) {
        let letView = this.viewChoiseLetters.pop();

        letView.hideAction(0.5);
        letView.runAction(new cc.Sequence(
            new cc.ScaleTo(animationSpeed, 0.8),
            new cc.RemoveSelf)
        );
    }
    if (this.viewChoiseLetters.length != 0){
        console.log(this.viewChoiseLetters);
        this.updateShowChoiseLetters();
    }
};

Game.prototype.choiseLetter = function(letView) {
    if (this.choiseLetters.indexOf(letView) == -1) {
        this.choiseLetters.push(letView);
    }
    cc.audioEngine.playEffect(resources['game_' + this.choiseLetters.length + '_letter_effect'], false)
    this.showChoiseLetters(new LetterView(letView.letter));
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

