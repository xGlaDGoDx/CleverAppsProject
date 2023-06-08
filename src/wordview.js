let NodeLetter = cc.Node.extend({
    ctor: function(letter) {
        this._super();
        this.letter = letter;
        this.animationBg = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('cell.png'));
        this.animationBg.setScale(0.6);

        this.active = new LetterView(letter);

        this.active.setScale(0.8);

        this.active.animationBg.setVisible(false);
        this.active.animation.setVisible(false);


        this.addChild(this.animationBg);
        this.addChild(this.active);
    },

    showAnimation: function(nodeElement) {
        nodeElement.runAction(new cc.Sequence(
                new cc.FadeOut(),
                new cc.ToggleVisibility(),
                new cc.FadeTo(0.3, 255),
            )
        )
    }
})

let WordView = cc.Node.extend({
    ctor: function(word) {
        this._super();
        this.word = word;
        this.arrayNodes = [];

        this.create();
    },

    create: function() {
        let i = 0;
        for(let l of this.word.split('')) {
            let nodeLetter = new NodeLetter(l)
            this.arrayNodes.push(nodeLetter);

            this.addChild(nodeLetter);
        }
        
    }
})