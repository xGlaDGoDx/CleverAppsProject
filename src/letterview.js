let LetterView = cc.Node.extend({
    ctor : function(letter) {
        this._super();
        this.transcriptLetter = transcriptRus(letter);
        this.letter = letter;
        this.addLetterBg();

        this.animation = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(`rus/${this.transcriptLetter}.png`));

        this.addChild(this.animation);

        this.active = false;
    },

    addLetterBg : function() {
        var size = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize();
        this.animationBg = new ccui.Button('letter_bg.png', 'letter_bg.png', 'letter_bg.png', ccui.Widget.PLIST_TEXTURE);
        this.animationBg.setScale9Enabled(true);
        this.animationBg.setCapInsets(cc.rect(size.width / 2 - 1, size.height / 2 - 1, 10, 10));
        this.addChild(this.animationBg);
    },

    onclick : function(choiseFunc) {
        this.animationBg.addClickEventListener(function() {
            if (this.active) {
                this.runAction(new cc.Spawn(
                    new cc.ScaleTo(0.5, 0.7),
                ));
            }
            else {
                this.runAction(new cc.Spawn(
                    new cc.ScaleTo(0.5, 0.8),
                ))
                choiseFunc(this);
            }
            this.active = !this.active;
        }.bind(this));

    },

    makeInactive : function() {
            if (this.active) {
                this.runAction(new cc.Spawn(
                    new cc.ScaleTo(0.5, 0.7),
                ));
                this.active = !this.active;
            }
    },
});