let GameScene = cc.Scene.extend({
    ctor : function() {
        this._super();
        this.addBackground();

        this.centerViewLetters = {x : this.width/2, y : this.height/4.5};

        this.game = new Game();
        this.addViewLetters();

        this.addBoard();

        this.mapViewWords = new Map();
        this.viewWords = [];
        this.addViewWords();

        this.addGameButtons();

        this.addAcceptButtonListener();
        this.addCancelButtonListener();

        this.game.viewVictory = this.viewVictory.bind(this);

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
    },


    addBackground: function() {
        let background = new cc.Sprite(resources.background);
        background.setScale(Math.max(this.width / background.width, this.height / background.height));
        background.setPosition(this.width / 2, this.height / 2);
        background.setLocalZOrder(-1);
        this.addChild(background);

        this.gameBackground = new cc.Sprite(resources.game_background);
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
            setTimeout(() => {
                node.showAnimation(node.active.animationBg);
                node.showAnimation(node.active.animation);
                setTimeout(() => node.active.runAction(new cc.ScaleTo(0.3, 0.6)), 300)
                },
            70 * i),
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
        
    },

    addAcceptButtonListener: function() {
        let button = this.acceptButton.button;
        button.addClickEventListener(function() {
            let word = '';
            for(let letView of this.game.choiseLetters) {
                word += letView.letter;
            }
            if (this.game.foundWords.indexOf(word) != -1) {

            }
            else if (this.game.words.indexOf(word) != -1) {
                this.showWord(this.mapViewWords.get(word));
                this.game.foundWords.push(word);
                this.game.isAllWordsFound();
            }
            this.cancelChoiseLetters();

        }.bind(this));
    },

    addCancelButtonListener: function() {
        let button = this.cancelButton.button;
        button.addClickEventListener(function() {
            this.cancelChoiseLetters();
        }.bind(this));
    },

    cancelChoiseLetters: function() {
        while (this.game.choiseLetters.length > 0) {
            let letView = this.game.choiseLetters.pop();
            letView.makeInactive();
        }
    },

    addBoard : function() {
        let board = new cc.Scale9Sprite('board_bg.png');
        board.setScale(1.013);
        board.setContentSize(this.gameBackground.width, this.gameBackground.height / 3);
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

            viewLet.setScale(0.7);
            viewLet.onclick(this.game.choiseLetter.bind(this.game));
        }
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
    }

})