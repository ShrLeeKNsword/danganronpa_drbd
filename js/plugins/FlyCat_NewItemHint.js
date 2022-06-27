//=============================================================================
// RPG Maker MZ - 新物品提示
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 新物品提示
 * @author 飞猫工作室（Fly_Cat/Fly_Roc）
 *
 * @param 物品提示图片
 * @desc 选择你的提示图片
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 * 
 * @param 闪烁速度
 * @text 提示图闪烁频率
 * @type number
 * @desc 默认5（数值越大闪烁越快）
 * @default 5
 * 
 * @param 图片偏移X
 * @text 图片X坐标偏移量
 * @type number
 * @desc 默认：12（X+ 右 X-左）
 * @default 12
 * 
 * @param 图片偏移Y
 * @text 图片Y坐标偏移量
 * @type number
 * @desc 默认：15（Y+ 下 Y-上）
 * @default 15
 * 
 *  @param 闪烁速度
 * @text 提示图闪烁频率
 * @type number
 * @desc 默认5（数值越大闪烁越快）
 * @default 5
 * 
 * @help
 * 1.新物品提示(必须配置图片)
 * 2.承接MV、MZ定制插件  QQ：903516931
 */


var Imported = Imported || {};
Imported.NewItemHint = true;

var FlyCat = FlyCat || {};
FlyCat.NewItemHint = {};
FlyCat.NewItemHint.parameters = PluginManager.parameters('FlyCat_NewItemHint');
FlyCat.NewItemHint.newImg = String(FlyCat.NewItemHint.parameters['物品提示图片']);
FlyCat.NewItemHint.speed = Number(FlyCat.NewItemHint.parameters['闪烁速度'] || 5);
FlyCat.NewItemHint.imgX = Number(FlyCat.NewItemHint.parameters['图片偏移X'] || 12);
FlyCat.NewItemHint.imgY = Number(FlyCat.NewItemHint.parameters['图片偏移Y'] || 15);
///////预加载//////
FlyCat.NewItemHint.loadSystemImages = Scene_Boot.prototype.loadSystemImages;
Scene_Boot.prototype.loadSystemImages = function () {
    FlyCat.NewItemHint.loadSystemImages.call(this);
    ImageManager.loadSystem(FlyCat.NewItemHint.newImg);
};
//////系统数据的游戏对象类////////
FlyCat.NewItemHint.initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    FlyCat.NewItemHint.initialize.call(this);
    this._lookItems = { items: [], weapons: [], armors: [] };
};
///////////////////初始化/////////////////
FlyCat.NewItemHint.Window_ItemList_initialize = Window_ItemList.prototype.initialize;
Window_ItemList.prototype.initialize = function (rect) {
    FlyCat.NewItemHint.Window_ItemList_initialize.call(this, rect);
    this._newItemSprites = [];  //用一个数组来保存
};

///////////////////绘制物品/////////////////
FlyCat.NewItemHint.Window_ItemList_drawItem = Window_ItemList.prototype.drawItem;
Window_ItemList.prototype.drawItem = function (index) {
    FlyCat.NewItemHint.Window_ItemList_drawItem.call(this, index);
    const item = this.itemAt(index);
    if (item) {
        this.drawNewItemIcon(item, index);
    }
};

Window_ItemList.prototype.drawNewItemIcon = function (item, index) {
    if (item) {
        if ($gameSystem.isNewItem(item)) {
            const rect = this.itemLineRect(index);
            const bitmap = ImageManager.loadSystem(FlyCat.NewItemHint.newImg);
            const newIconSprite = new Sprite_NewItemIcon(bitmap);
            newIconSprite.x = rect.x + FlyCat.NewItemHint.imgX;
            newIconSprite.y = rect.y + FlyCat.NewItemHint.imgY;
            this.addChild(newIconSprite);
            this._newItemSprites.push(newIconSprite);
        }
    }
};

///////////////////加入精灵/////////////////
FlyCat.NewItemHint.Window_ItemList_refresh = Window_ItemList.prototype.refresh;
Window_ItemList.prototype.refresh = function () {
    for (let i = 0; i < this._newItemSprites.length; i++) {
        var sprite = this._newItemSprites[i];
        if (sprite) {
            this.removeChild(sprite);
        }
    }
    this._newItemSprites = [];
    FlyCat.NewItemHint.Window_ItemList_refresh.call(this);
};
///////////////////写入新物品/////////////////
FlyCat.NewItemHint.Window_ItemList_select = Window_ItemList.prototype.select;
Window_ItemList.prototype.select = function (index) {
    FlyCat.NewItemHint.Window_ItemList_select.call(this, index);
    const item = this.item();
    if (item) {
        if ($gameSystem.isNewItem(item)) {
            FlyCat.NewItemHint.WriteOldItems(item);
            this.refresh();
        }
    }
};


///////////////////创建新精灵/////////////////
function Sprite_NewItemIcon() {
    this.initialize(...arguments);
}

Sprite_NewItemIcon.prototype = Object.create(Sprite.prototype);
Sprite_NewItemIcon.prototype.constructor = Sprite_NewItemIcon;
///////////////////精灵初始化/////////////////
Sprite_NewItemIcon.prototype.initialize = function (bitmap) {
    Sprite.prototype.initialize.call(this, bitmap);
    this._updateCount = 0;
    this._updateStep = 10;
}
///////////////////精灵刷新/////////////////
Sprite_NewItemIcon.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._updateCount <= 0) {
        this._updateStep = FlyCat.NewItemHint.speed;
    } else if (this._updateCount >= 255) {
        this._updateStep = -FlyCat.NewItemHint.speed;
    }
    this._updateCount += this._updateStep;
    this.alpha = this._updateCount / 255;
}

///////////////////新物品类型/////////////////
Game_System.prototype.isNewItem = function (item) {
    if (item) {
        if (item.itypeId) {
            var currentType = 'items';
        };
        if (item.wtypeId) {
            var currentType = 'weapons';
        };
        if (item.atypeId) {
            var currentType = 'armors';
        };
        return !$gameSystem._lookItems[currentType][item.id]
    }
    return false;
}

/////将看过的物品传入旧物品数组////
FlyCat.NewItemHint.WriteOldItems = function (item) {
    if (!item) return;
    if (item.itypeId) {
        var type = 'items'
    };
    if (item.wtypeId) {
        var type = 'weapons'
    };
    if (item.atypeId) {
        var type = 'armors'
    };

    if (type) {
        $gameSystem._lookItems[type][item.id] = 1;
        return true;
    }
    return false;
};
