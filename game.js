let Game = function() {

    this.letters = ['в', 'д', 'о', 'х', 'ы'];
    this.words = ['ход', 'вдох', 'вход', 'выдох', 'выход'];
    this.foundWords = [];
    this.lengthWords = this.words.map(w => w.length);

    this.viewLetters = [];

    this.choiseLetters = [];
    this.viewChoiseLetters = [];

    this.mapViewWords = new Map();
    this.viewWords = [];

    this.coins = 2000;

    this.viewVictory = function() {
    };

    this.showChoiseLetters = function() {
    };

    this.onChangeCoins = function() {
    };

    this.updateShowChoiseLetters = function() {
    };

    this.answerAnimation = function(){
    };
}

Game.prototype.openNode = function() {
    open:
    for (let viewWord of this.viewWords) {
        if (!viewWord.allNodesIsVisible()) {
            for (let node of viewWord.arrayNodes) {
                if (!node.isOpen) {
                    node.open();

                    this.spendCoins(50);

                    if (viewWord.allNodesIsVisible()) {
                        this.foundWords.push(viewWord.word);
                    }

                    this.isAllWordsFound()

                    break open;
                }
            }
        }
    }
}

Game.prototype.haveCoins = function(price) {
    return this.coins >= price;
}

Game.prototype.spendCoins = function(price) {
    this.coins -= price;
    this.onChangeCoins();
}

Game.prototype.isAllWordsFound = function() {
    if (this.foundWords.length == this.words.length) {
        setTimeout(() => this.viewVictory(), 500);
    }
}

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

Game.prototype.wordIsFound = function(word) {
    return this.foundWords.indexOf(word) != -1; 
};

Game.prototype.checkAnswer = function() {
    let word = '';
    for(let letView of this.choiseLetters) {
        word += letView.letter;
    }

    if (this.wordIsFound(word)) {
        this.cancelChoiseLetters();
    }
    else if (this.words.indexOf(word) != -1) {
        cc.audioEngine.playEffect(resources.game_right_answer, false)
        this.answerAnimation('word_right.png');
        this.mapViewWords.get(word).showWord();
        this.foundWords.push(word);
        setTimeout(() => {
            this.cancelChoiseLetters();
        }, 500);
        this.isAllWordsFound()
    }
    else {
        cc.audioEngine.playEffect(resources.game_wrong_answer, false)
        this.answerAnimation('word_wrong.png');
        setTimeout(() => {
            this.cancelChoiseLetters();
        }, 500);
    }
};

Game.prototype.cancelChoiseLetters = function() {
    this.removeChoiseLetters();
    this.removeShowChoiseLetters();
};

Game.prototype.particleCancelChoiseLetters = function(index, viewLet) {
    while(this.choiseLetters.length > index) {
        let view = this.choiseLetters.pop();
        if (view != viewLet)
            view.makeInactive();
    }
};
