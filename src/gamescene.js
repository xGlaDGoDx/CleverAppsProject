let GameScene = cc.Scene.extend({
    ctor : function() {
        this._super();
        this.addBackground();

        this.centerViewLetters = {x : this.width/2, y : this.height/4.5};

        this.viewLetters = [];
        this.viewLettersPosition = [];

        this.addShuffleButton();

        this.game = new Game();
        this.addViewLetters();

        this.addBoard();

        this.mapViewWords = new Map();
        this.viewWords = [];
        this.addViewWords();

        this.addGameButtons();

        this.addAcceptButtonListener();
        this.addCancelButtonListener();
        this.addHelpButtonListener();

        this.game.viewVictory = this.viewVictory.bind(this);
        this.game.showChoiseLetters = this.showChoiseLetters.bind(this);
        this.game.onChangeCoins = this.onChangeCoins.bind(this);
        this.game.updateShowChoiseLetters = this.updateShowChoiseLetters.bind(this);

        cc.audioEngine.playMusic(resources.game_music, true);

        // this.addLine();

        // cc.eventManager.addListener({
        //     event: cc.EventListener.MOUSE,

        //     onMouseDown: function(event) {
        //         if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
        //             console.log('zxc');
        //             if (this.game.choiseLetters.length != 0) {
        //                 let letterPos = this.game.choiseLetters[this.game.choiseLetters.length - 1].getPosition();
        //                 this.setStretchLine(letterPos, event.getLocation());
        //             }
        //         }
        //     }.bind(this)
        // }, this);

        this.addViewCoins();



    },


    addBackground: function() {
        let background = new cc.Sprite(resources.background);
        background.setScale(Math.max(this.width / background.width, this.height / background.height));
        background.setPosition(this.width / 2, this.height / 2);
        background.setLocalZOrder(-1);
        // this.addChild(background);

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
            let wordView = new WordView(word);
            this.viewWords.push(wordView);
            let j = 0;
            for (let node of wordView.arrayNodes) {
                node.setPositionY(this.height/1.35 + 55 * (i % 3));
                size = {x : node.animationBg.width, y: node.animationBg.height};
                if (i > -3) {
                    let offset = this.makeOffsetViewWords(this.game.lengthWords.slice(0, 4), size.x/1.5);
                    node.setPositionX(this.width/2 - this.width/6 + size.x/1.5 * j - offset);
                }
                else {
                    let offset = this.makeOffsetViewWords(this.game.lengthWords.slice(3, 5), size.x/1.5)
                    node.setPositionX(this.width/2 + this.width/6 + size.x/1.5 * j - offset);
                }
                j+=1;
            }
            i -= 1;
            this.mapViewWords.set(word, wordView);
            this.addChild(wordView);
        }
        console.log(this.mapViewWords);
    },

    showWord: function(wordView) {
        let i = 1;
        for(let node of wordView.arrayNodes) {
            if (!node.isOpen) {
                setTimeout(() => {
                    node.showAnimation(node.active.animationBg);
                    node.showAnimation(node.active.animation);
                    setTimeout(() => node.active.runAction(new cc.ScaleTo(0.3, 0.6)), 300)
                    },
                70 * i)
            }
            i += 1;
        }
    },

    setShowChoiseLettersPosition(letter) {
        let moveAnimation = function(letter, point) {
            letter.runAction(new cc.MoveTo(0.2, point));
        }

        if (this.game.viewChoiseLetters.length == 0) {
            letter.setPosition(this.width/2, this.height/2)
            
        }
        else {
            let letWidth = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize().width;
            letWidth *= 0.5; //Делали Scale
            let lastLetterPosition;
            for (let letView of this.game.viewChoiseLetters) {
                lastLetterPosition = letView.getPositionX() - letWidth/2;
                moveAnimation(letView, cc.p(letView.getPositionX() - letWidth/2, letView.getPositionY()));
            }

            letter.setPosition(lastLetterPosition + letWidth, this.height/2);
        }

    },

    showChoiseLetters: function(letter) {
        console.log('game_' + this.game.choiseLetters.length + '_letter_effect');
        letter.setScale(0);
        let showAnimation = function(letter) {
            letter.runAction(new cc.ScaleTo(0.4, 0.6));
        }

        this.setShowChoiseLettersPosition(letter);

        this.game.viewChoiseLetters.push(letter);

        this.addChild(letter);
        showAnimation(letter);
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
            moveAnimation(letView, cc.p(this.width/2 + letWidth * i + offset, letView.getPositionY()));
            i += 1;
        }
    },
    

    // addLine: function() {
    //     let buttonSize = cc.spriteFrameCache.getSpriteFrame('line.png').getOriginalSize();
    //     let rect = cc.rect(buttonSize.width / 2 - 2, buttonSize.height / 2 - 2, 1, 1);
    //     this.line = new cc.Scale9Sprite('line.png');
    //     this.line.setCapInsets(rect);
    //     this.addChild(this.line);
    // },
    
    // setStretchLine: function(startPos, endPos) {
    //     let r = Math.sqrt((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2);

    //     this.line.setContentSize(r, this.line.height);

    //     let angleY = Math.asin((endPos.y - startPos.y)/r) * 180 / Math.PI;
    //     let angleX = Math.acos((endPos.x - startPos.x)/r) * 180 / Math.PI;
    //     this.line.setRotationY(-angleY);
    //     this.line.setRotationX(angleX);

    //     let offsetX = (endPos.x - startPos.x)/2;
    //     let offsetY = (endPos.y - startPos.y)/2;
    //     this.line.setPosition(startPos.x + offsetX, startPos.y + offsetY);
    // },

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
                foundHelp:
                for (let viewWord of this.viewWords) {
                    if (this.game.foundWords.indexOf(viewWord.word) == -1) {
                        for (let node of viewWord.arrayNodes) {
                            if (!node.active.animationBg.isVisible()) {
                                node.showAnimation(node.active.animationBg);
                                node.showAnimation(node.active.animation);
                                node.active.runAction(new cc.ScaleTo(0.3, 0.6));

                                this.game.spendCoins(50);

                                if (viewWord.allNodesIsVisible()) {
                                    this.game.foundWords.push(viewWord.word);
                                }
                                break foundHelp;
                            }
                        }
                    }
                }
            }
            else {
                cc.audioEngine.playEffect(resources.game_wrong_answer, false)
            }

        }.bind(this));
    },

    addAcceptButtonListener: function() {
        let button = this.acceptButton.button;
        button.addClickEventListener(function() {
            let word = '';
            for(let letView of this.game.choiseLetters) {
                word += letView.letter;
            }

            if (this.game.foundWords.indexOf(word) != -1) {
                this.cancelChoiseLetters();
            }
            else if (this.game.words.indexOf(word) != -1) {
                cc.audioEngine.playEffect(resources.game_right_answer, false)
                this.answerAnimation('word_right.png');
                this.showWord(this.mapViewWords.get(word));
                this.game.foundWords.push(word);
                setTimeout(() => {
                    this.cancelChoiseLetters();
                }, 500);
            }
            else {
                cc.audioEngine.playEffect(resources.game_wrong_answer, false)
                this.answerAnimation('word_wrong.png');
                setTimeout(() => {
                    this.cancelChoiseLetters();
                }, 500);
            }
            
            this.hideGameButtons();

        }.bind(this));
    },


    answerAnimation: function(spriteName) {
        let answer = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(spriteName));
        let width = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize().width;
        width *= 0.6;

        answer.setVisible(false);
        answer.setScale(0);
        let pos = this.game.viewChoiseLetters[this.game.viewChoiseLetters.length - 1].getPosition();

        answer.setPosition(pos.x + width, pos.y);

        this.addChild(answer);

        answer.runAction(new cc.Sequence(
            new cc.ToggleVisibility(),
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
            this.cancelChoiseLetters();
            this.hideGameButtons();
        }.bind(this));
    },

    cancelChoiseLetters: function() {
        this.game.removeChoiseLetters();
        this.game.removeShowChoiseLetters();
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
            this.setViewLetterPosition(viewLet, angle * i * Math.PI / 180);
            this.setViewLetterRotation(viewLet);
            this.addChild(viewLet);
            i += 1;

            viewLet.onMakeInactive = () => {
                let index = this.game.choiseLetters.indexOf(viewLet);
                while(this.game.choiseLetters.length > index) {
                    let view = this.game.choiseLetters.pop();
                    if (view != viewLet)
                        view.makeInactive();
                }
            }

            viewLet.showGameButton = this.showGameButtons.bind(this);

            viewLet.setScale(0.7);
            viewLet.onclick(this.game.choiseLetter.bind(this.game), this.game.removeShowChoiseLetters.bind(this.game));

            this.viewLetters.push(viewLet);
            this.viewLettersPosition.push(viewLet.getPosition());
        }
    },

    hideGameButtons: function() {
        this.acceptButton.button.setEnabled(false);

        this.acceptButton.button.setVisible(false);
        this.acceptButton.sprite.setVisible(false);

        this.cancelButton.button.setEnabled(false)

        this.cancelButton.button.setVisible(false);
        this.cancelButton.sprite.setVisible(false);
    },

    showGameButtons: function() {
        let predicate = !this.game.choiseLetters.length == 0;

        this.acceptButton.button.setEnabled(predicate);

        this.acceptButton.button.setVisible(predicate);
        this.acceptButton.sprite.setVisible(predicate);

        this.cancelButton.button.setEnabled(predicate)

        this.cancelButton.button.setVisible(predicate);
        this.cancelButton.sprite.setVisible(predicate);
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
                
                for (let j = 0; j < this.viewLetters.length; j++) {
                    this.viewLetters[j].runAction(new cc.MoveTo(0.15, this.viewLettersPosition[j]));
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

    setViewLetterPosition: function(viewLet, angle) {
        let rx = this.height/7 * Math.sin(angle);
        let ry = this.height/7 * Math.cos(angle);
        viewLet.setPosition(this.centerViewLetters.x + rx, this.centerViewLetters.y + ry);
    },

    setViewLetterRotation: function(viewLet) {
        let arrayRotation = [-5, 0, 5];
        let indexArrayRotation = Math.floor(Math.random() * 3);
        viewLet.setRotation(arrayRotation[indexArrayRotation]);
    },

    viewVictory: function() {
        let animation = sp.SkeletonAnimation.create(resources.game_victory, resources.game_atlas, 0.5);;
        animation.setAnimation(0, 'animation', false);
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