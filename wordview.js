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
        
        this.isOpen = false

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
    },

    open: function() {
        this.showAnimation(this.active.animationBg);
        this.showAnimation(this.active.animation);
        this.active.runAction(new cc.ScaleTo(0.3, 0.6));

        this.isOpen = true;
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
        let j = 0;
        for(let l of this.word.split('')) {
            let node = new NodeLetter(l);
            let size = {x : node.animationBg.width, y: node.animationBg.height};
            this.arrayNodes.push(node);

            node.setPosition(this.width + size.x/1.5 * j, this.height);

            this.addChild(node);
            j += 1;
        }
    },

    addLetter : function(letter) {
        let nodeLetter = new NodeLetter(letter);
        this.arrayNodes.push(nodeLetter);

        this.addChild(nodeLetter);
    },

    allNodesIsVisible: function() {
        let flag = true;
        for (let node of this.arrayNodes) {
            if (!node.isOpen) {
                flag = false;
                break;
            }
        }
        return flag;
    },

    showWord: function() {
        let i = 1;
        for(let node of this.arrayNodes) {
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
})