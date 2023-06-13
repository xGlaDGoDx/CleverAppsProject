let LetterView = cc.Node.extend({
    ctor : function(letter) {
        this._super();
        this.transcriptLetter = transcriptRus(letter);
        this.letter = letter;
        this.addLetterBg();

        this.animation = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(`rus/${this.transcriptLetter}.png`));

        this.addChild(this.animation);

        this.addActiveAnimation();

        this.active = false;

        this.onMakeInactive = function() {
        };

        this.showGameButton = function() {
        };
    },

    addLetterBg : function() {
        var size = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize();
        this.animationBg = new ccui.Button('letter_bg.png', 'letter_bg.png', 'letter_bg.png', ccui.Widget.PLIST_TEXTURE);
        this.animationBg.setScale9Enabled(true);
        this.animationBg.setCapInsets(cc.rect(size.width / 2 - 1, size.height / 2 - 1, 10, 10));
        this.addChild(this.animationBg);
    },

    addActiveAnimation: function() {
        this.activeAnimation = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('letter_bg_glow.png'));
        this.activeAnimation.setVisible(false);
        this.activeAnimation.runAction(new cc.FadeOut());
        setTimeout(() => this.activeAnimation.setVisible(true), 100);
        this.addChild(this.activeAnimation);
    },

    onclick : function(choiseFunc, removeFunc) {
        this.animationBg.addClickEventListener(function() {
            if (this.active) {
                this.makeInactive();
                this.onMakeInactive();
                removeFunc();
            }
            else {
                this.makeActive();
                choiseFunc(this);
            }
            this.showGameButton();
        }.bind(this));

    },

    makeInactive : function() {
        this.activeAnimation.runAction(
            new cc.FadeTo(0.5, 0));

        this.runAction(new cc.Spawn(
            new cc.ScaleTo(0.5, 0.7),
        ));
        this.active = false;
    },

    makeActive : function() {
        this.activeAnimation.runAction(
            new cc.FadeTo(0.5, 200));

        this.runAction(new cc.Spawn(
            new cc.ScaleTo(0.5, 0.8),
        ));
        this.active = true;
    },

    hideAction: function(speed) {
        
        this.animation.runAction(new cc.FadeTo(speed, 0));
        this.animationBg.runAction(new cc.FadeTo(speed, 0));
    }
});