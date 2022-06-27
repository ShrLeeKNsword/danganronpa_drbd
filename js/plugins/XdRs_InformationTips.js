//==============================================================================================================
// Information tips.js
//==============================================================================================================
/*:
 * @target MZ
 * @plugindesc 得失物品信息提示。
 * @author 芯☆淡茹水
 * @help 
 * 
 * 〓 功能 〓
 * 1， 一般的得失物品提示。
 * 2， 提供十个游戏变量值的得失提示，可在插件设置项设置。
 * 3， 可用于自定义简短的信息提示（插件命令）。
 * 
 * 
 * 〓 插件命令 〓
 * 1， 操作提示功能的开闭 (SetInformationEnable)。
 * 2， 自定义信息提示 (AddInformation)。
 * 
 * 
 * @param displayType
 * @text 提示窗口显示的位置
 * @desc 提示窗口显示的位置（左边写 L ； 右边写 R）
 * @default L
 * 
 * @param iconTips
 * @type boolean
 * @text 是否在角色头顶显示得到物品的图标
 * @desc 是否在角色头顶显示得到物品的图标。
 * @default true
 * 
 * @param currencyIcon
 * @text 货币的图标序号。
 * @type number
 * @desc 货币的图标序号。
 * @default 314
 * 
 * @param loseSe
 * @type file
 * @dir audio/se/
 * @text 减少时播放的SE
 * @desc 所有类型减少时播放的SE。
 * @default Crossbow
 * 
 * @param variableSe
 * @type file
 * @dir audio/se/
 * @text 变量增加时的SE
 * @desc 变量值增加播放的SE。
 * @default Chime2
 * 
 * @param goldSe
 * @type file
 * @dir audio/se/
 * @text 货币增加时SE
 * @desc 货币增加时播放的SE。
 * @default Shop2
 * 
 * @param itemSe
 * @type file
 * @dir audio/se/
 * @text 物品增加时的SE
 * @desc 物品增加时播放的SE。
 * @default Equip1
 * 
 * @param color0
 * @text 数量增加时，描绘数字的颜色序号。
 * @type number
 * @desc 数量增加时，描绘数字的颜色序号。
 * @default 11
 * 
 * @param color1
 * @text 数量减少时，描绘数字的颜色序号。
 * @type number
 * @desc 数量减少时，描绘数字的颜色序号。
 * @default 18
 * 
 *
 * @param variableArr
 * @text 变量提示列表
 * @type struct<variable>[]
 * @desc 变量值改变时提示的列表设置。
 * @default []
 * 
 * 
 * 
 * @command SetInformationEnable
 * @text 打开/关闭 得失物品提示
 * @desc 打开/关闭 得失物品提示。
 * 
 * @arg state
 * @type boolean
 * @default true
 * @text 开关状态
 * @desc 开关状态。
 * 
 * 
 * @command AddInformation
 * @text 添加自定义信息提示
 * @desc 添加自定义信息提示。
 * 
 * @arg iconIndex
 * @type number
 * @min 0
 * @max 9999
 * @default 0
 * @text 图标序号
 * @desc 图标序号（写 0 不显示）。
 * 
 * @arg text
 * @type text
 * @default
 * @text 显示的信息文字
 * @desc 显示的信息文字(支持对话框控制符)。
 * 
 * @arg num
 * @type number
 * @default 0
 * @text 显示的数量
 * @desc 显示的数量（写 0 不显示）。
 * 
 * @arg se
 * @default
 * @text 播放的SE
 * @desc 播放的SE。
 * 
*/
 /*~struct~variable: 
 *
 * @param id
 * @text 变量ID
 * @type number
 * @desc 变量ID。
 * @default 0
 * 
 * @param iconIndex
 * @text 图标序号
 * @type number
 * @desc 图标序号。
 * @default 0
 *
 * @param name
 * @text 显示的名字
 * @desc 显示的名字。
 * @default 
 * 
 * @param se
 * @type file
 * @dir audio/se/
 * @text 数量增加时播放的SE
 * @desc 数量增加时播放的SE。
 * @default
 * 
*/
//==============================================================================================================
;var XdRsData = XdRsData || {};
XdRsData.it = {};
XdRsData.it.parameters = PluginManager.parameters('XdRs_InformationTips');
//==============================================================================================================
XdRsData.it.displayType = function() {
    return this.parameters['displayType'] === 'L' ? 0 : 1;
};
XdRsData.it.setupRegisteredVals = function() {
    this._registeredArr = [];
    this._registeredVals = {};
    let arr = this.parameters['variableArr'];
    arr = arr ? JSON.parse(arr) : [];
    for (const s of arr) {
        if (s) {
            const stk = JSON.parse(s);
            const id = parseInt(stk.id);
            this._registeredVals[id] = stk;
            this._registeredArr.push(id);
        }
    }
};
XdRsData.it.isValRegistered = function(valId) {
    !this._registeredVals && this.setupRegisteredVals();
    return this._registeredArr.contains(valId);
};
XdRsData.it.getValIconIndex = function(valId) {
    const data = this._registeredVals[valId];
    return data ? (parseInt(data.iconIndex) || 0) : 0;
};
XdRsData.it.getValSe = function(valId) {
    const data = this._registeredVals[valId];
    return data ? data.se : null;
};
XdRsData.it.getValNameText = function(valId) {
    const data = this._registeredVals[valId];
    return data ? data.name || '' : '';
};
XdRsData.it.getItemIconIndex = function(data) {
    if (data.iconIndex) return data.iconIndex;
    switch(data.type) {
        case 'variable' :return this.getValIconIndex(data.objData);
        case 'gold'     :return parseInt(this.parameters['currencyIcon']);
        case 'item'     :return data.objData.iconIndex;
    }
    return 0;
};
XdRsData.it.getItemNameText = function(data) {
    if (data.text) return data.text;
    switch(data.type) {
        case 'variable' :return this.getValNameText(data.objData);
        case 'gold'     :return TextManager.currencyUnit;
        case 'item'     :return data.objData.name;
    }
    return '';
};
XdRsData.it.getItemNumText = function(data) {
    if (!data.num) return '';
    const numAbs = Math.abs(data.num);
    return (data.num > 0 ? '+ ' : '- ') + numAbs;
};
XdRsData.it.getNumTextColor = function(data) {
    var n = 0;
    if (data.num) {
        const type = (data.num > 0 ? 0 : 1);
        n = +this.parameters['color'+type] || 0;
    }
    return ColorManager.textColor(n);
};
XdRsData.it.playItemSe = function(data) {
    const vol = ConfigManager.seVolume;
    if (vol === 0) return;
    let seName = data.se;
    if (data.type === 'variable') {
        seName = this.getValSe(data.objData) || seName;
    }
    if (!seName && !!data.num) {
        if (data.num < 0) seName = this.parameters['loseSe'];
        else seName = this.parameters[data.type+'Se'];
    }
    if (seName) {
        AudioManager.playSe({'name':seName,'volume':vol,'pitch':100,'pan':0});
    }
};
//==============================================================================================================
SceneManager.isCurrentScene = function(sceneClass) {
    return this._scene && this._scene.constructor === sceneClass;
};
//==============================================================================================================
PluginManager.registerCommand('XdRs_InformationTips', "SetInformationEnable", args => {
    $gameSystem.setInformationEnable(eval(args.state));
});
PluginManager.registerCommand('XdRs_InformationTips', "AddInformation", args => {
    const icon = +args.iconIndex, text = args.text, num = +args.num;
    if (icon > 0 || !!text || !!num) {
        const data = {'iconIndex':icon,'text':text,'num':num,'se':args.se};
        $gameTemp.addInformationData(data);
    }
});
//==============================================================================================================
Game_Temp.prototype.requestInformation = function(type, objData, num) {
    if (num !== 0 && $gameSystem.isInformationEnabled()) {
        this.addInformationData({'type':type,'objData':objData,'num':num});
    }
};
Game_Temp.prototype.addInformationData = function(data) {
    if ($gameSystem.isInformationEnabled()) {
        this._informationQueue = this._informationQueue || [];
        this._informationQueue.push(data);
    }
};
Game_Temp.prototype.retrieveInformation = function() {
    return this._informationQueue ? this._informationQueue.shift() : null;
};
//==============================================================================================================
Game_System.prototype.setInformationEnable = function(state) {
    this._informationEnable = state || false;
};
Game_System.prototype.isInformationEnabled = function() {
    if (!SceneManager.isCurrentScene(Scene_Map)) return false;
    if (this._informationEnable === undefined) {
        this._informationEnable = true;
    }
    return this._informationEnable;
};
//==============================================================================================================
XdRsData.it.Game_Variables_setValue = Game_Variables.prototype.setValue;
Game_Variables.prototype.setValue = function(variableId, value) {
    const lastNum = this._data[variableId] || 0;
    XdRsData.it.Game_Variables_setValue.call(this, variableId, value);
    if (XdRsData.it.isValRegistered(variableId)) {
        $gameTemp.requestInformation('variable', variableId, (this._data[variableId] || 0) - lastNum);
    }
};
//==============================================================================================================
XdRsData.it.Game_Party_gainGold = Game_Party.prototype.gainGold;
Game_Party.prototype.gainGold = function(amount) {
    const lastNum = this._gold;
    XdRsData.it.Game_Party_gainGold.call(this, amount);
    $gameTemp.requestInformation('gold', null, this._gold - lastNum);
};
XdRsData.it.Game_Party_gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    const lastNum = this.numItems(item);
    XdRsData.it.Game_Party_gainItem.call(this, item, amount, includeEquip);
    $gameTemp.requestInformation('item', item, this.numItems(item) - lastNum);
};
//==============================================================================================================
function Window_Information() {
    this.initialize(...arguments);
}
Window_Information.prototype = Object.create(Window_Base.prototype);
Window_Information.prototype.constructor = Window_Information;
Window_Information.prototype.initialize = function(index, data) {
    this.initInfoData(data);
    this._index = index;
    this._targetIndex = index;
    const type = XdRsData.it.displayType();
    const height = this.lineHeight() + $gameSystem.windowPadding() * 2;
    const y = Graphics.height - (index+1) * height;
    Window_Base.prototype.initialize.call(this, new Rectangle(0, y, Graphics.width, height));
    this.width = this.currentWindowWidth();
    this.x = type === 0 ? -this.width : Graphics.width;
    this.drawTips();
    this.setupActions();
};
Window_Information.prototype.initInfoData = function(data) {
    this._data = {};
    this._data.index = XdRsData.it.getItemIconIndex(data);
    this._data.text1 = XdRsData.it.getItemNameText(data);
    this._data.text2 = XdRsData.it.getItemNumText(data);
    this._data.color = XdRsData.it.getNumTextColor(data);
};
Window_Information.prototype.currentWindowWidth = function() {
    var width = $gameSystem.windowPadding() * 2 + 8;
    if (this._data.index > 0) width += ImageManager.iconWidth + 4;
    if (this._data.text1) width += this.textSizeEx(this._data.text1).width + 4;
    if (this._data.text2) width += this.textWidth(this._data.text2) + 32;
    return width;
};
Window_Information.prototype.drawTips = function() {
    var x = 4;
    if (this._data.index > 0) {
        this.drawIcon(this._data.index, x, 0);
        x += ImageManager.iconWidth + 4;
    }
    if (this._data.text1) {
        x += this.drawTextEx(this._data.text1, x, 0) + 28;
    }
    if (this._data.text2) {
        const tw = this.textWidth(this._data.text2);
        this.changeTextColor(this._data.color);
        this.drawText(this._data.text2, x, 0, tw);
    }
};
Window_Information.prototype.setupActions = function() {
    this._actions = [];
    const type = XdRsData.it.displayType();
    var mx1 = (this.width + 50) / 20;
    mx1 = type === 0 ? mx1 : -mx1;
    const mx2 = type === 0 ? -5 : 5;
    const mx3 = type === 0 ? -this.width/10 : this.width/10;
    this._actions.push({'count':20, 'mx':mx1});
    this._actions.push({'count':120});
    this._actions.push({'count':10,'mx':mx2});
    this._actions.push({'count':180});
    this._actions.push({'count':10,'mx':mx3});
};
Window_Information.prototype.isInPlace = function() {
    if (this._index === this._targetIndex) return true;
    if (this._currentAction && !!this._currentAction.mx) return true;
    const ty = Graphics.height - (this._targetIndex+1) * this.height;
    return this.y >= ty;
};
Window_Information.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.checkTargetIndex();
    this.updateEcptoma();
    this.updateAction();
};
Window_Information.prototype.checkTargetIndex = function() {
    this._targetIndex = this.parent.getCurrentIndex(this);
};
Window_Information.prototype.updateEcptoma = function() {
    if (this.isInPlace()) return;
    this.y += this.height / 10;
    if (this.isInPlace()) {
        this.y = Graphics.height - (this._targetIndex+1) * this.height;
        this._index = this._targetIndex;
    }
};
Window_Information.prototype.updateAction = function() {
    if (!this._currentAction) {
        this._currentAction = this._actions.shift();
        if (!this._currentAction) return this.parent.remove(this);
    }
    if (this._currentAction.mx) this.x += this._currentAction.mx;
    this._currentAction.count--;
    if (!this._currentAction.count) this._currentAction = null;
};
//==============================================================================================================
function Sprite_InfoController() {
    this.initialize(...arguments);
}
Sprite_InfoController.prototype = Object.create(Sprite.prototype);
Sprite_InfoController.prototype.constructor = Sprite_InfoController;
Sprite_InfoController.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._windows = [];
};
Sprite_InfoController.prototype.getCurrentIndex = function(window) {
    return this._windows.indexOf(window);
};
Sprite_InfoController.prototype.add = function(data) {
    XdRsData.it.playItemSe(data);
    const index = this._windows.length;
    this._windows[index] = new Window_Information(index, data);
    this.addChild(this._windows[index]);
    const result = eval(XdRsData.it.parameters['iconTips']);
    if (result && (data.num === undefined || data.num > 0)) {
        const iconIndex = XdRsData.it.getItemIconIndex(data);
        this.parent.displayInfoTips(iconIndex);
    } 
    this._waitCount = 8;
};
Sprite_InfoController.prototype.remove = function(window) {
    if (window) {
        this._windows.remove(window);
        this.removeChild(window);
        window.destroy();
    }
};
Sprite_InfoController.prototype.destroy = function() {
    this._windows.forEach(this.remove.bind(this));
    Sprite.prototype.destroy.call(this);
};
Sprite_InfoController.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateWaitCount();
    this.updateRetrieveData();
};
Sprite_InfoController.prototype.updateWaitCount = function() {
    if (this._waitCount) this._waitCount--;
};
Sprite_InfoController.prototype.updateRetrieveData = function() {
    if (this._waitCount) return;
    const data = $gameTemp.retrieveInformation();
    data && this.add(data);
};
//==============================================================================================================
function Sprite_IconStyleTips() {
    this.initialize(...arguments);
}
Sprite_IconStyleTips.prototype = Object.create(Sprite.prototype);
Sprite_IconStyleTips.prototype.constructor = Sprite_IconStyleTips;
Sprite_IconStyleTips.prototype.initialize = function(iconIndex) {
    Sprite.prototype.initialize.call(this);
    this._duration = 120;
    this.anchor = new Point (0.5, 0.5);
    this.scale = new Point (0, 0);
    this.bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};
Sprite_IconStyleTips.prototype.setup = function() {
    this._actionSx = 1;
    this._actionType = 0;
    this.y = -this.parent.patternHeight() / 2;
};
Sprite_IconStyleTips.prototype.isPlaying = function() {
    return this._duration > 0;
};
Sprite_IconStyleTips.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateMain();
};
Sprite_IconStyleTips.prototype.updateMain = function() {
    if (!this.isPlaying()) return this.parent.removeInfoTips(this);
    if (this._duration >= 80) {
        this.y -= 1.2;
        this.scale.y += 0.02;
        if (this._actionSx >= 1)  this._actionType = 0;
        if (this._actionSx <= -1) this._actionType = 1;
        this._actionSx += (this._actionType === 0 ? -0.2 : 0.2);
        this.scale.x = this._actionSx * this.scale.y;
        if (this._duration === 80) this.scale.x = this.scale.y;
    }
    if (this._duration < 10) this.opacity = this._duration * 25;
    this._duration--;
};
//==============================================================================================================
Sprite_Character.prototype.displayInfoTips = function(iconIndex) {
    this._tipsIcons = this._tipsIcons || [];
    const sprite = new Sprite_IconStyleTips(iconIndex);
    this._tipsIcons.push(sprite);
    this.addChild(sprite);
    sprite.setup();
};
Sprite_Character.prototype.removeInfoTips = function(sprite) {
    if (this._tipsIcons && sprite) {
        this._tipsIcons.remove(sprite);
        this.removeChild(sprite);
        sprite.destroy();
    }
};
//==============================================================================================================
XdRsData.it.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    this.createInfoController();
    XdRsData.it.Scene_Map_createAllWindows.call(this);
};
Scene_Map.prototype.createInfoController = function() {
    this._infoController = new Sprite_InfoController();
    this.addChild(this._infoController);
};
Scene_Map.prototype.displayInfoTips = function(iconIndex) {
    if (this._spriteset) {
        const sprite = this._spriteset.findTargetSprite($gamePlayer);
        sprite && sprite.displayInfoTips(iconIndex);
    }
};
//==============================================================================================================
// end
//==============================================================================================================