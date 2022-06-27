//=================================================================================================
// Automatic_Speaking.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc NPC自动说话 + 指定对象说话 （MV + MZ）。
* @author 芯☆淡茹水
* @help
*
* 〓 功能 〓 
* 1，可指定地图上任意对象说话。
* 2，可预设事件的说话内容，让其自动的随机自言自语。
* 3，自动说话事件，需在屏幕内才运行刷新。
*
* 〓 说明 〓
* 1，指定对象说话需要三个参数： 
*    A ：对象ID。
*        说话对象类型为 角色 时，ID表示角色队伍序号，第一个是 0。
*        说话对象类型为 事件 时，ID表示事件ID。
*        以下该参数表示为 => id
*
*    B ：对象类型。
*        说话对象类型用 0 和 1 表示。
*        0 表示对象类型为角色； 1 表示对象类型为事件。
*        以下该参数表示为 => type
*
*    C ：说话内容。
*        说话内容的文本，包含实际内容文本和标示。
*        标示包括：
*            <AS>          =>  备注事件自动说话的一条内容标示。（仅用于事件自动说话）
*            <AS:id,type>  =>  指定某一对象说话的标示（id + type）。（仅用于指定对象说话）
*            <DR:n>        =>  指定该次说话的窗口停留帧数。(n : 帧数)
*            <WS:name>     =>  指定该次说话的窗口皮肤文件名。(name : 窗口皮肤文件名) 
*                              <未指定皮肤时，窗口皮肤将会在默认皮肤和登记的皮肤里随机>
*            <WT:n>        =>  指定该次事件自动说话的等待帧数。(n : 帧数) （仅用于事件自动说话）
*        以下该参数表示为 => text
*
*
* 2，指定对象说话， MZ 可以使用该插件的插件命令（StartSpeaking）。
*    MV，MZ 通用方法为第 1 条的 <AS:id,type> + 内容 的注释备注方法。
*    例：让 3 号事件说：今天天气真好啊！ 。窗口皮肤文件名为 Window2 =>
*        事件 - 注释: <AS:3,1><WS:Window2>今天天气真好啊！
*
* 3，事件自动说话。
*    事件自动说话需要在事件当前页备注 第 1 条的 <AS> + 内容 。
*    可备注N条，实际说话时在这N条里面随机。
*    事件的说话内容，仅为事件当前页备注的说话内容。
*    例：备注一条内容为 好无聊啊！ 的自动说话内容 =>
*        事件 - 注释: <AS>好无聊啊！
*
* 4，所有说话内容，均支持对话框控制符。
*
* @param windowskins
* @text 窗口皮肤图片文件名登记
* @desc 格式：皮肤1,皮肤2,皮肤3....。（只有写入这里的窗口皮肤，随机皮肤或更改皮肤时才生效）。
* @default
*
* @param defaultDuration
* @text 默认的说话窗口显示帧数
* @desc 默认的说话窗口显示帧数（最小修正60， 实际 ±20%）。
* @default 180
*
* @param defaultWaitCount
* @text 默认的事件自动说话间隔帧数
* @desc 默认的事件自动说话间隔帧数（最小修正60， 实际 ±20%）。
* @default 360
*
* @command StartSpeaking
* @text 开始说话
* @desc 开始说话。
* 
* @arg id
* @type number
* @default 0
* @text 说话对象ID
* @desc 当说话对象类型是 角色 时，ID表示角色队伍序号，第一个是 0。
* 
* @arg type
* @type number
* @default 1
* @text 说话对象类型
* @desc 说话对象类型。（0：角色； 1：事件）
* 
* @arg text
* @default
* @text 说话的内容
* @desc 说话的内容（支持对话框控制符，以及插件说明里的标注）。
*/
//=================================================================================================
;var XdRsData = XdRsData || {};
XdRsData.as = XdRsData.as || {};
XdRsData.as.parameters = PluginManager.parameters('XdRs_AutomaticSpeaking');
//=================================================================================================
XdRsData.as.isMz = function() {
    return Utils.RPGMAKER_NAME === 'MZ';
};
XdRsData.as.setup = function() {
    this.reserveWindowskins();
    this.isMz() ? this.addPluginCommandForMz() : this.patchUpForMv();
};
XdRsData.as.setupAllWindowskins = function() {
    var note = this.parameters['windowskins'] || '';
    this._windowskins = note.split(',');
};
XdRsData.as.isWindowskinEnabled = function(name) {
    if (!name) return false;
    if (name === 'Window') return true;
    return this._windowskins && this._windowskins.contains(name);
};
XdRsData.as.patchUpForMv = function() {
    this.Window_Base_processCharacter = Window_Base.prototype.processCharacter;
    Window_Base.prototype.processCharacter = function(textState) {
        XdRsData.as.Window_Base_processCharacter.call(this, textState);
        this._dataTextState = textState;
    };
    this.Window_Base_processNewLine = Window_Base.prototype.processNewLine;
    Window_Base.prototype.processNewLine = function(textState) {
        var lastX = textState.maxLineX || 0;
        textState.maxLineX = Math.max(textState.x, lastX);
        XdRsData.as.Window_Base_processNewLine.call(this, textState);
    };
    Window_Base.prototype.getTextExData = function(ox, oy) {
        if (!this._dataTextState) return {'width':32, 'height':32};
        var state = this._dataTextState;
        var mx = Math.max(state.maxLineX || state.x, state.x);
        var height = state.y - oy + this.lineHeight();
        return {'width':mx - ox, 'height':height};
    };
};
XdRsData.as.addPluginCommandForMz = function() {
    PluginManager.registerCommand('XdRs_AutomaticSpeaking', "StartSpeaking", args => {
        if (args.text) {
            const id = +(args.id || 0);
            const type = +(args.type || 0);
            XdRsData.as.startSpeaking(args.text, id, type);
        }
    });
};
XdRsData.as.reserveWindowskins = function() {
    this.setupAllWindowskins();
    for (var i=0;i<this._windowskins.length;++i) {
        var name = this._windowskins[i];
        ImageManager[this.isMz() ? 'loadSystem' : 'reserveSystem'](name);
    }
};
XdRsData.as.getRandomWindowskin = function() {
    var arr = ['Window'].concat(this._windowskins || []);
    return arr[Math.randomInt(arr.length)];
};
XdRsData.as.getDefaultDuration = function() {
    var n = +(this.parameters['defaultDuration'] || 180);
    var a = Math.randomInt(Math.floor(n / 5));
    return n + (Math.randomInt(2) ? a : -a);
};
XdRsData.as.getDefaultWaitCount = function() {
    var n = +(this.parameters['defaultWaitCount'] || 360);
    var a = Math.randomInt(Math.floor(n / 5));
    return n + (Math.randomInt(2) ? a : -a);
};
XdRsData.as.startSpeaking = function(text, id, type) {
    var target = this.getTarget(id, type);
    target && target.changeSpeakingText(text || '');
};
XdRsData.as.getTarget = function(id, type) {
    id = id || 0;
    if (!type) return $gamePlayer.getSpeakingObj(id);
    return $gameMap.event(id);
};
//=================================================================================================
XdRsData.as.SceneManager_initialize = SceneManager.initialize;
SceneManager.initialize = function() {
    XdRsData.as.SceneManager_initialize.call(this);
    XdRsData.as.setup();
};
//=================================================================================================
Game_Character.prototype.speakingText = function() {
    return this._speakingText || '';
};
Game_Character.prototype.changeSpeakingText = function(text) {
    this._speakingText = text;
};
Game_Character.prototype.isForbiddenSpeaking = function() {
    return this._forbiddenSpeakingSign;
};
Game_Character.prototype.setForbiddenSpeakingSign = function(state) {
    this._forbiddenSpeakingSign = state;
};
//=================================================================================================
Game_Player.prototype.getSpeakingObj = function(id) {
    if (id === 0) return this;
    return this._followers.follower(id - 1);
};
//=================================================================================================
Game_Event.prototype.isForbiddenSpeaking = function() {
    return this._pageIndex < 0 || this._locked ||
    Game_Character.prototype.isForbiddenSpeaking.call(this);
};
XdRsData.as.Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
    XdRsData.as.Game_Event_setupPage.call(this);
    this.setupAutomaticSpeakingData();
};
Game_Event.prototype.setupAutomaticSpeakingData = function() {
    this.setForbiddenSpeakingSign(true);
    this._speakingWait = XdRsData.as.getDefaultWaitCount();
    this._automaticSpeakingData = [];
    if (this._pageIndex < 0) return;
    var list = this.list();
    if (list && list.length > 1) {
        for (var i=0;i<list.length;++i) {
            if (list[i].code === 108 && /<AS>/.test(list[i].parameters[0])) {
                this._automaticSpeakingData.push(i);
            }
        }
    }
};
XdRsData.as.Game_Event_start = Game_Event.prototype.start;
Game_Event.prototype.start = function() {
    this.setForbiddenSpeakingSign(true);
    XdRsData.as.Game_Event_start.call(this);
};
XdRsData.as.Game_Event_erase = Game_Event.prototype.erase;
Game_Event.prototype.erase = function() {
    this.setForbiddenSpeakingSign(true);
    XdRsData.as.Game_Event_erase.call(this);
};
Game_Event.prototype.isOnScreen = function() {
    var ax = $gameMap.adjustX(this._x), ay = $gameMap.adjustY(this._y);
    if (ax < 0 || ay < 0) return false;
    var tx = $gameMap.screenTileX(), ty = $gameMap.screenTileY();
    return ax <= tx && ay <= ty;
};
Game_Event.prototype.canAutomaticSpeaking = function() {
    if (this.isForbiddenSpeaking() || !this._automaticSpeakingData) return false;
    if (this._automaticSpeakingData.length === 0) return false;
    return this.isOnScreen();
};
Game_Event.prototype.setupAutomaticSpeaking = function() {
    var len = this._automaticSpeakingData.length;
    var index = this._automaticSpeakingData[Math.randomInt(len)];
    var list = this.list();
    if (list[index].code === 108) {
        var text = list[index].parameters[0];
        while(list[index+1].code === 408) {
            index++;
            text += '\n' + list[index].parameters[0];
        }
        text = text.replace(/<WT:(\d+)>/g, function(tx){
            tx.match(/<WT:(\d+)>/);
            this._speakingWait = Math.max(+RegExp.$1, 60);
        }.bind(this));
        if (!this._speakingWait) {
            this._speakingWait = XdRsData.as.getDefaultWaitCount();
        }
        this.changeSpeakingText(text.replace(/<AS>/, ''));
    }
};
XdRsData.as.Game_Event_update = Game_Event.prototype.update;
Game_Event.prototype.update = function() {
    XdRsData.as.Game_Event_update.call(this);
    this.updateAutomaticSpeaking();
};
Game_Event.prototype.updateAutomaticSpeaking = function() {
    if (!this.canAutomaticSpeaking()) return;
    if (this._speakingWait) {
        this._speakingWait--;
        !this._speakingWait && this.setupAutomaticSpeaking();
    }
};
//=================================================================================================
XdRsData.as.Game_Interpreter_command108 = Game_Interpreter.prototype.command108;
Game_Interpreter.prototype.command108 = function(params) {
    var result = XdRsData.as.Game_Interpreter_command108.call(this, params);
    if (this._comments[0].match(/<AS:(\S+)>/)) {
        var arr = RegExp.$1.split(',').map(function(n){return +n;});
        var text = this._comments.join('\n').replace(/<AS:(\S+)>/, '');
        XdRsData.as.startSpeaking(text, arr[0], arr[1]);
    }
    return result;
};
//=================================================================================================
function Window_AutomaticSpeaking() {
    this.initialize.apply(this, arguments);
}
Window_AutomaticSpeaking.prototype = Object.create(Window_Base.prototype);
Window_AutomaticSpeaking.prototype.constructor = Window_AutomaticSpeaking;
Window_AutomaticSpeaking.prototype.initialize = function(text, objSprite) {
    text = this.analysisNote(text);
    this.callSuperInitialize(0, 0, 32, 32);
    this._objSprite = objSprite;
    this.resetWindow(text);
    this.drawTextEx(text, 0, 0);
    this.pause = true;
    this.z = 9;
    this.hide();
};
Window_AutomaticSpeaking.prototype.callSuperInitialize = function(x, y, w, h) {
    if (XdRsData.as.isMz()) Window_Base.prototype.initialize.call(this, new Rectangle(x,y,w,h));
    else Window_Base.prototype.initialize.call(this, x, y, w, h);
};
Window_AutomaticSpeaking.prototype.analysisNote = function(text) {
    text = text.replace(/<WT:(\d+)>/g, '');
    text = text.replace(/<WS:(\S+)>/g, function(tx){
        tx.match(/<WS:(\S+)>/);
        this._windowskinName = RegExp.$1;
        return '';
    }.bind(this));
    text = text.replace(/<DR:(\d+)>/g, function(tx){
        tx.match(/<DR:(\d+)>/);
        this._duration = Math.max(+RegExp.$1, 60);
        return '';
    }.bind(this));
    if (!this._windowskinName) {
        this._windowskinName = XdRsData.as.getRandomWindowskin();
    }
    if (!this._duration) {
        this._duration = XdRsData.as.getDefaultDuration();
    }
    return text;
};
Window_AutomaticSpeaking.prototype.resetWindow = function(text) {
    var data = this.getTextSizeExData(text);
    this.width  = data.width + this._padding * 2;
    this.height = data.height + this._padding * 2;
    this.createContents();
    var sprite = XdRsData.as.isMz() ? this._pauseSignSprite : this._windowPauseSignSprite;
    sprite && sprite.move(this._width / 2, this.height + 24);
};
Window_AutomaticSpeaking.prototype.getTextSizeExData = function(text) {
    if (XdRsData.as.isMz()) return this.textSizeEx(text);
    else {
        var test = new Window_Base(0,0,32,32);
        test.drawTextEx(text, 0, 0);
        return test.getTextExData(0,0);
    };
};
Window_AutomaticSpeaking.prototype.loadWindowskin = function() {
    var result = XdRsData.as.isWindowskinEnabled(this._windowskinName);
    var name = result ? this._windowskinName : 'Window';
    this.windowskin = ImageManager.loadSystem(name);
};
Window_AutomaticSpeaking.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this._objSprite) {
        this.updateDuration();
        this.updatePosition();
    }
};
Window_AutomaticSpeaking.prototype.updateDuration = function() {
    if (this._duration > 0) {
        this._duration--;
        !this._duration && this._objSprite.removeSpeakingWindow();
    }
};
Window_AutomaticSpeaking.prototype.updatePosition = function() {
    if (!this._duration) return;
    var sprite = this._objSprite;
    this.x = sprite.x - this.width / 2;
    this.y = sprite.y - sprite.patternHeight() - this.height - 24;
    if (!this.visible) this.show();
};
//=================================================================================================
Sprite_Character.prototype.isAutomaticSpeaking = function() {
    return !!this._speakingWindow;
};
Sprite_Character.prototype.createSpeakingWindow = function(text) {
    this.removeSpeakingWindow();
    this._speakingWindow = new Window_AutomaticSpeaking(text, this);
    this.parent.addChild(this._speakingWindow);
};
Sprite_Character.prototype.removeSpeakingWindow = function() {
    if (this.isAutomaticSpeaking()) {
        this.parent.removeChild(this._speakingWindow);
        if (XdRsData.as.isMz()) this._speakingWindow.destroy();
        this._speakingWindow = null;
    }
};
XdRsData.as.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
    XdRsData.as.Sprite_Character_update.call(this);
    this.updateAutomaticSpeaking();
};
Sprite_Character.prototype.updateAutomaticSpeaking = function() {
    if (!this._character) return;
    if (this._character.isForbiddenSpeaking()) {
        this._character.setForbiddenSpeakingSign(false);
        this.isAutomaticSpeaking() && this.removeSpeakingWindow();
    } else {
        if (this._character.speakingText()) {
            this.createSpeakingWindow(this._character.speakingText());
            this._character.changeSpeakingText('');
        }
    }
};
//=================================================================================================
// end
//=================================================================================================