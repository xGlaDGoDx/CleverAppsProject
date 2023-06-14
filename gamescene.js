let GameScene = cc.Scene.extend({
    ctor : function() {
        this._super();
        this.addBackground();

        this.centerViewLetters = {x : this.width/2, y : this.height/4.5};

        this.viewLettersPosition = [];

        this.game = new Game();

        this.addShuffleButton();
        this.addViewLetters();

        this.addBoard();

        this.addViewWords();

        this.addGameButtons();

        this.addAcceptButtonListener();
        this.addCancelButtonListener();
        this.addHelpButtonListener();

        this.addViewCoins();

        this.game.viewVictory = this.viewVictory.bind(this);
        this.game.showChoiseLetters = this.showChoiseLetters.bind(this);
        this.game.onChangeCoins = this.onChangeCoins.bind(this);
        this.game.updateShowChoiseLetters = this.updateShowChoiseLetters.bind(this);
        this.game.answerAnimation = this.answerAnimation.bind(this);

        cc.audioEngine.playMusic(resources.game_music, true);

    },

    addBackground: function() {
        this.gameBackground = new cc.Sprite(resources.game_background);
        this.gameBackground.setScale(Math.max(this.width / this.gameBackground.width, this.height / this.gameBackground.height));
        this.gameBackground.setPosition(this.width / 2, this.height / 2);
        this.addChild(this.gameBackground);
    },

    makeOffsetViewWords(lengthWords, distance) {
        let maxWord = Math.max(...lengthWords);
        let offset = maxWord/2 * distance + distance/2;
        return offset/2;
    },

    addViewWords: function() {
        let i = 0
        for (let word of this.game.words) {
            let size = cc.spriteFrameCache.getSpriteFrame('cell.png').getOriginalSize();
            let wordView = new WordView(word);
            this.game.viewWords.push(wordView);
            wordView.setPositionY(this.height/1.35 + 55 * (i % 3))
            if (i > -3) {
                let offset = this.makeOffsetViewWords(this.game.lengthWords.slice(0, 4), size.width/1.5);
                wordView.setPositionX(this.width/2 - this.width/6 - offset);
            }
            else {
                let offset = this.makeOffsetViewWords(this.game.lengthWords.slice(3, 5), size.width/1.5)
                wordView.setPositionX(this.width/2 + this.width/6 - offset);
            }
            i -= 1;
            this.game.mapViewWords.set(word, wordView);
            this.addChild(wordView);
        }
    },

    setShowChoiseLettersPosition(letter) {
        let letWidth = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize().width;
        letWidth *= 0.5;

        let x = this.width/2 + (this.game.viewChoiseLetters.length) * letWidth/2;

        letter.setPosition(x, this.height/2);

        this.updateShowChoiseLetters();
    },

    showChoiseLetters: function(letter) {
        letter.setScale(0);

        this.game.viewChoiseLetters.push(letter);

        this.setShowChoiseLettersPosition(letter);

        this.addChild(letter);

        letter.showAction(letter);
    },

    updateShowChoiseLetters: function() {
        let letWidth = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize().width;
        letWidth *= 0.5;

        let moveAnimation = function(letter, point) {
            letter.runAction(new cc.MoveTo(0.2, point));
        };

        let length = this.game.viewChoiseLetters.length;
        let i = Math.floor(length / 2) * -1;

        let offset = 0;
        if (length%2 == 0)
            offset = letWidth/2;
            
        for (let letView of this.game.viewChoiseLetters) {
            moveAnimation(letView, cc.p(this.width/2 + letWidth * i + offset, this.height/2));
            i += 1;
        }
    },

    addGameButtons: function() {
        let size = cc.spriteFrameCache.getSpriteFrame('button.png').getOriginalSize();
        let createButton = function(pos, spriteName) {
            let button = new ccui.Button('button.png', 'button_on.png', 'button_off.png', ccui.Widget.PLIST_TEXTURE);
            button.setScale(0.6);
            button.setScale9Enabled(true);
            button.setCapInsets(cc.rect(size.width / 2 - 1, size.height / 2 - 1, 1, 1));
            button.setContentSize(180, 108);
            button.setPosition(pos);

            this.addChild(button);

            let sprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(spriteName));
            sprite.setPosition(pos);
            sprite.setScale(0.6);
            this.addChild(sprite);
            return {button : button, sprite: sprite};
        }.bind(this);

        this.acceptButton = createButton(cc.p(this.width/2 + this.width/6, this.height/10), 'submit_icon.png');

        this.cancelButton = createButton(cc.p(this.width/2 - this.width/6, this.height/10), 'cancel_icon.png');

        this.showGameButtons();

        this.helpButton = createButton(cc.p(this.width - this.width/25, this.height/2.35)).button;
        this.helpButton.setTitleText('Help!');
        this.helpButton.setTitleFontName(resources.marvin_round.name);
        this.helpButton.setTitleFontSize(50);
        
    },

    addHelpButtonListener: function() {
        let button = this.helpButton;
        button.addClickEventListener(function() {
            if(this.game.haveCoins(50)) {
                cc.audioEngine.playEffect(resources.game_help, false)
                node = this.game.openNode();
            }
            else {
                cc.audioEngine.playEffect(resources.game_wrong_answer, false)
            }

        }.bind(this));
    },

    addAcceptButtonListener: function() {
        let button = this.acceptButton.button;
        button.addClickEventListener(function() {
            this.game.checkAnswer(); 
            this.hideGameButtons();

        }.bind(this));
    },

    answerAnimation: function(spriteName) {
        let answer = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(spriteName));
        let width = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize().width;
        width *= 0.6;

        answer.setScale(0);
        let pos = this.game.viewChoiseLetters[this.game.viewChoiseLetters.length - 1].getPosition();

        answer.setPosition(pos.x + width, pos.y);

        this.addChild(answer);

        answer.runAction(new cc.Sequence(
            new cc.ScaleTo(0.3, 0.6),
            new cc.DelayTime.create(0.2),
            new cc.Spawn(
                new cc.ScaleTo(0.4, 1),
                new cc.FadeOut(0.4)
            ),
            new cc.RemoveSelf()
        ))
    },

    addCancelButtonListener: function() {
        let button = this.cancelButton.button;
        button.addClickEventListener(function() {
            this.game.cancelChoiseLetters();
            this.hideGameButtons();
        }.bind(this));
    },

    addBoard : function() {
        let board = new cc.Scale9Sprite('board_bg.png');
        board.setScale(1.013);
        board.setContentSize(this.width, this.gameBackground.height / 3);
        board.setPosition(this.width / 2, this.height / 1.5);
        this.addChild(board);
    },

    addViewLetters: function() {
        let i = 0;
        let angle = 360/this.game.letters.length;
        for (let letter of this.game.letters) {
            let viewLet = new LetterView(letter);

            let rx = this.height/7 * Math.sin(angle * i * Math.PI / 180);
            let ry = this.height/7 * Math.cos(angle * i * Math.PI / 180);
            viewLet.setPosition(this.centerViewLetters.x + rx, this.centerViewLetters.y + ry);

            viewLet.setViewLetterRotation();
            this.addChild(viewLet);

            viewLet.onMakeInactive = () => {
                let index = this.game.choiseLetters.indexOf(viewLet);
                this.game.particleCancelChoiseLetters(index, viewLet);
            }

            viewLet.showGameButton = this.showGameButtons.bind(this);

            viewLet.setScale(0.7);
            viewLet.onclick(this.game.choiseLetter.bind(this.game), this.game.removeShowChoiseLetters.bind(this.game));

            this.game.viewLetters.push(viewLet);
            this.viewLettersPosition.push(viewLet.getPosition());

            i += 1;
        }
    },

    setVisibleGameButtons: function(bool) {
        this.acceptButton.button.setEnabled(bool);

        this.acceptButton.button.setVisible(bool);
        this.acceptButton.sprite.setVisible(bool);

        this.cancelButton.button.setEnabled(bool)

        this.cancelButton.button.setVisible(bool);
        this.cancelButton.sprite.setVisible(bool);
    },

    hideGameButtons: function() {
        this.setVisibleGameButtons(false);
    },

    showGameButtons: function() {
        let predicate = !this.game.choiseLetters.length == 0;
        this.setVisibleGameButtons(predicate);
    },


    shuffleViewLetters: function() {
        function shuffle(array) { // Тасование Фишера — Йетса.
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1)); 
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        for (let i = 0; i < 5; i ++) {
            setTimeout(() => {
                shuffle(this.viewLettersPosition);
                
                for (let j = 0; j < this.game.viewLetters.length; j++) {
                    this.game.viewLetters[j].runAction(new cc.MoveTo(0.15, this.viewLettersPosition[j]));
                }
            }, 180 * i);
        }
    },

    addShuffleButton: function() {
        let button = new ccui.Button('shuffle_on.png', 'shuffle.png', 'shuffle.png', ccui.Widget.PLIST_TEXTURE);
        button.setScale(0.6);
        button.setPosition(this.centerViewLetters.x, this.centerViewLetters.y);

        button.addClickEventListener(() => {
            button.setEnabled(false);
            button.runAction(new cc.FadeTo(0.2, 0));
            this.shuffleViewLetters();
            setTimeout(() => {
                button.runAction(new cc.FadeTo(0.2, 255),
                button.setEnabled(true))}, 1000);
        })

        this.addChild(button);
    },

    viewVictory: function() {
        let animation = sp.SkeletonAnimation.create(resources.game_victory, resources.game_atlas, 0.5);;
        animation.setAnimation(0, 'idle', true);
        animation.setPosition(this.width/2, this.height/2);
        this.addChild(animation);
        cc.audioEngine.playEffect(resources.game_victory_effect, false)
    },

    addViewCoins: function() {
        let size = cc.spriteFrameCache.getSpriteFrame('bar_bg.png').getOriginalSize()
        let coinsBg = new cc.Scale9Sprite('bar_bg.png');

        coinsBg.setCapInsets(new cc.rect(size.width/2 - 1, size.height/2 - 1, 2, 2))
        coinsBg.setContentSize(200, 80);
        coinsBg.setPosition(this.width/9, this.height - this.height/15);

        let coins = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('coin.png'));
        coins.setPosition(coinsBg.getPositionX() - 80, this.height - this.height/15);

        this.coinsText = new ccui.Text(this.game.coins, resources.marvin_round.name, 35)
        this.coinsText.setPosition(coinsBg.getPositionX() + 15, coinsBg.getPositionY());

        this.addChild(coinsBg);
        this.addChild(coins);
        this.addChild(this.coinsText);
    },

    onChangeCoins: function() {
        this.coinsText.setString(this.game.coins);
    }
})