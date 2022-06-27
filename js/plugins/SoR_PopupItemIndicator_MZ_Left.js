//=============================================================================
// SoR_PopupItemIndicator_MZ_Left.js
// MIT License (C) 2020 蒼竜 @soryu_rpmaker
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Latest version v1.00 (2020/09/08)
//=============================================================================

/*:ja
* @plugindesc ＜ポップアップ式アイテム取得インジケータ Type-L＞
* @author 蒼竜　@soryu_rpmaker
* @help アイテムや装備品・お金の取得時にポップアップ式の
* 通知ウィンドウを画面に表示する機能を実装します。
* ゲームの流れを止めないで、取得情報を直ちにプレイヤーへ通知できます。
*
* UIデザインの方向性ごとにスクリプトファイルを分けています。
* 好みのスタイルのものを1つだけ選んで導入してください。
* (このスクリプトは、"Type-L"のものです。)
*
* 導入後、ゲーム開始時には1度プラグインコマンド「取得ポップアップ描画ON」を
* 明示的に呼び出すようにしてください。
*
* -----------------------------------------------------------
* バージョン情報
* -----------------------------------------------------------
* v1.00 (2020/09/08)    公開
*
* @target MZ
* @url http://dragonflare.dip.jp/dcave/
* @param WindowStyle
* @desc ウィンドウ形式 (default: 0)
* @type select
* @option 標準スキンによるウィンドウ
* @value 0
* @option 暗くする
* @value 1
* @option 独自画像を利用
* @value 2
* @default 0
*
* @param WindowSkinImage 
* @desc WindowStyleで設定したウィンドウ形式が 2.「独自画像を利用」 のときに参照する画像 (default: ItemPop_bg)
* @type file
* @dir img/system
* @default ItemPop_bg
* @param ItemPopWindowYpadd_originalSkin
* @desc WindowStyleで設定したウィンドウ形式が 2.「独自画像を利用」 のときの縦の間隔の補正値(default: 0)
* @default 0
* @type number
*
* @param ItemPopSoundSE
* @desc ItemPop挿入ごとに鳴らす効果音を設定します (default: 無し) 
* @type file
* @dir audio/se
*
* @param ItemPopWindowY
* @desc 描画位置Y座標(default: 560)
* @default 560
* @type number
*
* @param ItemPopWindowHeight
* @desc ウィンドウ縦幅(default: 48)
* @default 48
* @type number
* 
* @param ItemPopWindow_baseDuration
* @desc 現在のItemPopの表示時間(次のItemPopの挿入を待つ時間)(default: 1)
* @default 1
* @type number
* @param ItemPopWindow_keepDuration
* @desc ItemPopWindow_baseDuration後のItemPopを消去するまでの待機時間(default: 300)
* @default 300
* @type number
* @param Multiple_ItemPopSpaces
* @desc ItemPop同士の縦の間隔(default: 46)
* @default 46
* @type number
*
* @param ItemPopStringFont
* @desc ItemPopフォントサイズ(default: 16)
* @default 16
* @type number
*
* @param ------表示系------
* @param IconID_Money
* @desc お金取得時のお金アイコン (default: 0)
* @default 0
* @type number
* @param Prefix_NumberofItem
* @desc 個数の前に付く接頭辞、「×」など (default: x)
* @default x
* @type string
* @param Suffix_NumberofItem
* @desc 個数の後ろに付く接尾辞、「個」など (default: none)
* @default 
* @type string
* @param IsDrawNumberforOneItem
* @desc 1個入手の時に個数を表示を入れるか。trueで入れる (default: false)
* @default false
* @type boolean
* @param MessageObtained
* @desc 入手時メッセージ後半部 (default: を手に入れた！)
* @default を手に入れた！
* @type string
* @param Decoration_Text
* @desc 入手表示装飾文字、ウィンドウ上端 (default: GET!)
* @default GET!
* @type string
* @param Decoration_TextColor
* @desc 入手表示装飾文字カラー、System.png準拠の番号 (default: 0)
* @default 0
* @type number
* @param ItemObtained_TextColor
* @desc 入手表示メッセージ文字列カラー、System.png準拠の番号 (default: 0)
* @default 0
* @type number
*
* @command EnableItemPopIndicator
* @text 取得ポップアップ描画ON[ポップアップ式アイテム取得インジケータ]
* @desc アイテム類・お金取得(増)判定時に、ポップアップウィンドウを表示します。
* @command DisableItemPopIndicator
* @text 取得ポップアップ描画OFF[ポップアップ式アイテム取得インジケータ]
* @desc アイテム類・お金取得時のポップアップウィンドウを無効化します。
* @command ForceItemPopClear
* @text 全消去[ポップアップ式アイテム取得インジケータ]
* @desc ウィンドウに描画中のアイテム取得情報を直ちに全て消去します
*/									  
/*:
* @plugindesc <Obtained Item Popup Indicator Type-Left>
* @author @soryu_rpmaker
* @help This plugin implements the popup indicator on the screen
* which is displayed at the moment of obtaining any items.
* This can indicate information to the player without stopping the game play.
*
* Script files are separated by the design.
* Thus, install just ONLY ONE script for your preference. 
* (This file is for "Type-Left".)		   
*
* You must explicitly call a plugin command "" to enable the popup indicator.
*
* -----------------------------------------------------------
* Version info.
* -----------------------------------------------------------
* v1.00 (Sep. 8th, 2020)    released!
*
* @param WindowStyle
* @desc Style of ItemPop Window (default: 0)
* @type select
* @option Default window with the skin
* @value 0
* @option Dark
* @value 1
* @option Use original UI images
* @value 2
* @default 0
*
* @param WindowSkinImage 
* @desc The image used for your original ItemPop window in case of "Use original UI images". (default: ItemPop_bg)
* @type file
* @dir img/system
* @default ItemPop_bg
* @param ItemPopWindowYpadd_originalSkin
* @desc Additional vertical padding for each ItemPop window in case of "Use original UI images".(default: 0)
* @default 0
* @type number
*
* @param ItemPopSoundSE
* @desc SE for inserting every ItemPop Window (default: none) 
* @type file
* @dir audio/se
*
* @param ItemPopWindowY
* @desc Y-cooridnate(upper left corner) of ItemPop Window (default: 560)
* @default 560
* @type number
* @param ItemPopWindowHeight
* @desc Height of a window for each ItemPop (default: 48)
* @default 48
* @type number
* 
* @param ItemPopWindow_baseDuration
* @desc Interval of processing new ItemPop window (default: 1)
* @default 1
* @type number
* @param ItemPopWindow_keepDuration
* @desc After time ItemPopWindow_baseDuration elapsed, the duration to keep ItemPop Window (default: 300)
* @default 300
* @type number
* @param Multiple_ItemPopSpaces
* @desc Vertical space for each ItemPop (default: 46)
* @default 46
* @type number
*
* @param ItemPopStringFont
* @desc Font size for ItemPop text(default: 16)
* @default 16
* @type number
*
* @param ------Display info.------
* @param IconID_Money
* @desc Icon (ID) with an indicator of money (default: 0)
* @default 0
* @type number
* @param Prefix_NumberofItem
* @desc Prefix of number of item obtained (default: none)
* @default none
* @type string
* @param Suffix_NumberofItem
* @desc Suffix of number of item obtained (default: x)
* @default x
* @type string
* @param IsDrawNumberforOneItem
* @desc Is show the number of obtained when it is just one. (default: false)
* @default false
* @type boolean
* @param MessageObtained
* @desc Message follows the number of item (default: none)
* @default 
* @type string
* @param Decoration_Text
* @desc Text decoration of indicator window (default: GET!)
* @default GET!
* @type string
* @param Decoration_TextColor
* @desc Color for the text decoration, follows the number defined in System.png (default: 0)
* @default 0
* @type number
* @param ItemObtained_TextColor
* @desc  Color for the message, follows the number defined in System.png (default: 0)
* @default 0
* @type number
*
* @command EnableItemPopIndicator
* @text Enable Indicator[SoR_GetItemPopWindow]
* @desc Enable to show indicator when the player obtained any items.
* @command DisableItemPopIndicator
* @text Disable Indicator[SoR_GetItemPopWindow]
* @desc Disable to show indicator.
* @command ForceItemPopClear
* @text Queue All Clear [SoR_GetItemPopWindow]
* @desc Delete all indicators on the window.
*
* @target MZ
* @url http://dragonflare.dip.jp/dcave/index_e.php
*/


var Imported = Imported || {};
if(Imported.SoR_PopupItemIndicators) throw new Error("[SoR_GetItemPopWindows] Do NOT import more than 2 types of <SoR_GetItemPopWindow> series.");
Imported.SoR_PopupItemIndicators = true;


(function() {
const pluginName = "SoR_PopupItemIndicator_MZ_Left";
const Param = PluginManager.parameters(pluginName);

const WindowLayoutSide = Number(Param['WindowLayoutSide'] || 0);
const WindowStyle =　Number(Param['WindowStyle'] || 0);
const WindowSkinImage =　String(Param['WindowSkinImage'] || 'ItemPop_bg');
const ItemPopSoundSE = String(Param['ItemPopSoundSE'] || '');
const ItemPopWindowY = Number(Param['ItemPopWindowY'] || 560);

const ItemPopWindowHeight = Number(Param['ItemPopWindowHeight'] || 48);
const ItemPopWindow_baseDuration = Number(Param['ItemPopWindow_baseDuration'] || 160);
const ItemPopWindow_keepDuration = Number(Param['ItemPopWindow_keepDuration'] || 400);
const Multiple_ItemPopSpaces = Number(Param['Multiple_ItemPopSpaces'] || 62);
const ItemPopWindowYpadd_originalSkin = Number(Param['ItemPopWindowYpadd_originalSkin'] || 0);

const ItemPopStringFont = Number(Param['ItemPopStringFont'] || 16);
const IconID_Money = Number(Param['IconID_Money'] || 0);
const Prefix_NumberofItem =　String(Param['Prefix_NumberofItem'] || '');
const Suffix_NumberofItem =　String(Param['Suffix_NumberofItem'] || '');
const IsDrawNumberforOneItem = Boolean(Param['IsDrawNumberforOneItem'] === 'true') || false;
const MessageObtained = String(Param['MessageObtained'] || '');
const Decoration_Text = String(Param['Decoration_Text'] || '');
const Decoration_TextColor = Number(Param['Decoration_TextColor'] || 0);
const ItemObtained_TextColor = Number(Param['ItemObtained_TextColor'] || 0);
let SoR_GIP_Isopen = true;



PluginManager.registerCommand(pluginName, "ForceItemPopClear", args => {
	$gameTemp.clearItemPopCommand();
});
PluginManager.registerCommand(pluginName, "EnableItemPopIndicator", args => { 
	SoR_GIP_Isopen = true;
});
PluginManager.registerCommand(pluginName, "DisableItemPopIndicator", args => { 
	SoR_GIP_Isopen = false;
});




////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

const SoR_ItemPopW_GT_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
	SoR_ItemPopW_GT_initialize.call(this);
    this.ItemPop_ready_queue = [];
	this.ItemPop_duration = 0;
	this.isItemPopForceClear = false;
	this.ItemPopForceTransferClear = false;
};

//force clear ItemPop
Game_Temp.prototype.clearItemPopCommand = function() {
	this.ItemPop_ready_queue.length = 0;
	this.ItemPop_duration = 0;
	this.isItemPopForceClear = true;
}
Game_Temp.prototype.IsForceClearItemPop = function() {
	return this.isItemPopForceClear;
}



Game_Temp.prototype.SoR_ItemPopPush = function(obj) {
	this.ItemPop_ready_queue.push(obj);
}

Game_Temp.prototype.SoR_ItemPopPullHead = function() {
	let obj = null;
	if(this.SoR_ItemPopQueueCount() > 0){
		obj = this.ItemPop_ready_queue[0];
	}
	
	return obj;
}
Game_Temp.prototype.SoR_ItemPopPop = function() {
	this.ItemPop_ready_queue.shift();
}



Game_Temp.prototype.SoR_ItemPopQueueCount = function(){
	return this.ItemPop_ready_queue.length;
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
const SoR_ItemPopW_SB_initialize = Scene_Base.prototype.initialize;
Scene_Base.prototype.initialize = function() {
    SoR_ItemPopW_SB_initialize.call(this);
		
	this.ItemPop_duration = 0;
	this.ItemPop_shown = [];

};

const SoR_ItemPopW_SM_push = SceneManager.push;
SceneManager.push = function(next_scene) {
    if (this._scene instanceof Scene_Map) {
		for(let i=0; i<this._scene.ItemPop_shown.length; i++){
			const obj = this._scene.ItemPop_shown[i];
			obj.TempCloseItemPop();
			this._scene.SoR_ItemPopField.removeChild(obj);
			if(WindowStyle == 2) this._scene.SoR_ItemPopField.removeChild(obj.bg_img);
		}
		this._scene.ItemPop_shown.length = 0;
    }
	
    SoR_ItemPopW_SM_push.call(this, next_scene);
};

const SoR_ItemPopW_GP_reserveTransfer = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
    SoR_ItemPopW_GP_reserveTransfer.call(this, mapId, x, y, d, fadeType);
	$gameTemp.ItemPopForceTransferClear = true;
};

///////////////////////////////////////////////////////////////

Scene_Base.prototype.SoR_createItemPopWindow = function(scene) {
	this._scene = scene;
	this.SoR_ItemPopField = new Sprite();
    this.addChild(this.SoR_ItemPopField);
};

//
//update 
//
Scene_Base.prototype.ItemPopWindowManager = function() {
	//reset for transition
	if($gameTemp.ItemPopForceTransferClear || $gameTemp.IsForceClearItemPop()){
		for(let i=0; i<this.ItemPop_shown.length; i++){
			const obj = this.ItemPop_shown[i];
			this.SoR_ItemPopField.removeChild(obj);
			if(WindowStyle == 2) this.SoR_ItemPopField.removeChild(obj.bg_img);
		}
		this.ItemPop_shown.length = 0;
		if($gameTemp.ItemPopForceTransferClear) $gameTemp.ItemPopForceTransferClear = false;
		if($gameTemp.IsForceClearItemPop()) $gameTemp.isItemPopForceClear = false;
		return;
	}

	//create
	if($gameTemp.SoR_ItemPopQueueCount()>0 && this.ItemPop_duration == 0){
		const obj = $gameTemp.SoR_ItemPopPullHead();
		if(obj!=null) this.SoR_ItemPopSetup(obj, this._scene);
	}
	if(this.ItemPop_duration>0) this.ItemPop_duration--;
	
	//main update
	for(let i=0; i<this.ItemPop_shown.length; i++){
		const obj = this.ItemPop_shown[i];
		if(i==this.ItemPop_shown.length-1){
			if(this.ItemPop_duration==0){
				if($gameTemp.SoR_ItemPopPullHead() == obj)	$gameTemp.SoR_ItemPopPop();
				obj.keepDuration--;
			}
		}
		else obj.keepDuration--;
		
		this.ItemPop_shown[i].shiftY(this.ItemPop_shown.length-i-1);
	}

    //expire
	for(let i=0; i<this.ItemPop_shown.length; i++){
		const obj = this.ItemPop_shown[i];
		if(obj.keepDuration==0){
			this.SoR_ItemPopField.removeChild(obj);
			if(WindowStyle == 2) this.SoR_ItemPopField.removeChild(obj.bg_img);
			this.ItemPop_shown.splice(i, 1);
			i--;
		}
	}
	
}

Scene_Base.prototype.SoR_ItemPopSetup = function(obj, scene){
		this.ItemPop_shown.push(obj);
		this.ItemPop_duration = obj.drawDuration;
		
		obj.setupItemPop(scene);
		if(WindowStyle == 2) this.SoR_ItemPopField.addChild(obj.bg_img);
		this.SoR_ItemPopField.addChild(obj);
		if(obj.ItemPop_se)AudioManager.playSe(obj.ItemPop_se);
}

////////////////////////////////////////////////////////////
// For Scene_Map
////////////////////////////////////////////////////////////
const SoR_IPW_SM_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    SoR_IPW_SM_createAllWindows.call(this);
    this.SoR_createItemPopWindow('Scene_Map');
};

const SoR_IPW_SM_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	SoR_IPW_SM_update.call(this);
	this.ItemPopWindowManager();
}




////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
function SoR_GetItemPopWindow() {
    this.initialize.apply(this, arguments);
}

SoR_GetItemPopWindow.prototype = Object.create(Window_Base.prototype);
SoR_GetItemPopWindow.prototype.constructor = SoR_GetItemPopWindow;



SoR_GetItemPopWindow.prototype.initialize = function(item, num, type){
	Window_Base.prototype.initialize.call(this,new Rectangle( 0, 0, 800, ItemPopWindowHeight));
	switch(type){
		case 0:
		break;
		case 1:
			this.getobj = $dataItems[item];
		break;
		case 2:
			this.getobj = $dataWeapons[item];
		break;
		case 3:
			this.getobj = $dataArmors[item];
		break;
	}
	
	let nametxt = "";
	this.icon = 0;
	this._num = num;
	this._type = type;
	this.padding = -12;

	if(type!=0){
		let pre = "";
		let suf = "";
		let numbers = "";
		if(!IsDrawNumberforOneItem && num==1);
		else{
			pre = Prefix_NumberofItem;
			suf = Suffix_NumberofItem;
			numbers = pre + num + suf;
		}

		 nametxt = this.getobj.name + numbers;
		 this.icon = this.getobj.iconIndex;
	}
	else{
		nametxt = num + $dataSystem.currencyUnit;
		 this.icon = IconID_Money;
	}
 
	this._text = nametxt + MessageObtained;

	this.contents.fontSize = ItemPopStringFont;
	this.drawLength = this.CalcLength();
	this.drawDuration = ItemPopWindow_baseDuration;
	this.keepDuration = ItemPopWindow_keepDuration;
	this.enter_effect = 512;
	this.x = -this.enter_effect;
	this.Basey = ItemPopWindowY; 
	this.y = this.Basey;
	this.diffY = 0;
	this.bg_img = null;
	this.ItemPop_se = null;
	
	if(ItemPopSoundSE!='') {
		this.ItemPop_se = {
			name : ItemPopSoundSE,
			pitch : 100,
			volume : 100
		}
	}
	
	this.width = this.drawLength + 72;
	this.height = ItemPopWindowHeight;	
    this.openness = 0;
	
	if(WindowStyle == 0) this.setBackgroundType(0);	
	else this.setBackgroundType(2);	//no default window
	
	if(WindowStyle == 2){
		this.bg_img = new Sprite(ImageManager.loadSystem(WindowSkinImage));
	}
}

Object.defineProperty(SoR_GetItemPopWindow.prototype, "innerWidth", {
    get: function() {
        return Math.max(0, this._width);
    },
    configurable: true
});
Object.defineProperty(SoR_GetItemPopWindow.prototype, "innerHeight", {
    get: function() {
        return Math.max(0, this._height+10);
    },
    configurable: true
});

SoR_GetItemPopWindow.prototype.destroy = function(options) {}

SoR_GetItemPopWindow.prototype.setupItemPop = function(scene){
	this.scene_ypadd = 0;
	
	this.x = -this.enter_effect;
	this.y = this.Basey + this.scene_ypadd;
	this.contents.clear();
	if(WindowStyle != 0) this.DrawBackground(255);
	this.DrawMessages();	 
	this.openness = 255;
}

SoR_GetItemPopWindow.prototype.TempCloseItemPop = function(){
	this.openness = 0;
}


SoR_GetItemPopWindow.prototype.DrawMessages = function(){
	this.contents.fontSize = ItemPopStringFont;

	this.drawIcon(this.icon, 24, 20);

	this.contents.fontSize = 12;
	 
	this.changeTextColor(ColorManager.textColor(Decoration_TextColor));
	this.drawText(Decoration_Text, 20, 0, this.width, 'left');
	
	this.changeTextColor(ColorManager.textColor(ItemObtained_TextColor));
	this.contents.fontSize = ItemPopStringFont;
	this.drawText(this._text, 20, 24, this.width-32, 'right');
}



SoR_GetItemPopWindow.prototype.shiftY = function(tmp_y){
	if(this.y != this.Basey + this.scene_ypadd - tmp_y*Multiple_ItemPopSpaces){
		this.diffY = (this.Basey + this.scene_ypadd - tmp_y*Multiple_ItemPopSpaces) - this.y;
	}
	else this.diffY = 0;
	this.changeOpacity(tmp_y);
}

SoR_GetItemPopWindow.prototype.changeOpacity = function(opaLev){
	const Eraser = this.keepDuration<=45 ? (45-this.keepDuration)*5 : 0;
	
	if(WindowStyle == 0) this.opacity = 255 - opaLev*44 - Eraser;
	if(this.opacity < 0) this.opacity = 0;
	this.contents.paintOpacity = 255 - opaLev*44 - Eraser;
	if(this.contents.paintOpacity < 0) this.contents.paintOpacity = 0;

	this.contents.clear();
	if(WindowStyle != 0) this.DrawBackground(this.contents.paintOpacity);	
	this.DrawMessages(); 
	
	const op = this.contents.paintOpacity/512.0;
	const rgba = 'rgba(0, 0, 0, ' + op.toFixed(2) + ')' ;
	this.contents.outlineColor =  rgba;
}


SoR_GetItemPopWindow.prototype.update = function(){
	Window_Base.prototype.update.call(this);
	
	if(this.enter_effect>0) this.enter_effect = Math.floor(this.enter_effect/1.25);
	else this.enter_effect = 0;

	this.x = -this.enter_effect;
	this.y += Math.floor(this.diffY/2.25);
}


SoR_GetItemPopWindow.prototype.DrawBackground = function(opa) {	
	if(WindowStyle == 1){
		const color1 = ColorManager.dimColor1();
		const color2 = ColorManager.dimColor2(); 
		const wx = Math.floor(this.width / 2);
		this.contents.fillRect(0, 8, wx, this.height, color1);
		this.contents.gradientFillRect(wx, 8, this.width-wx, this.height, color1, color2);
	}
	else{
		this.bg_img.x = this.x;
		this.bg_img.y = this.y+ItemPopWindowYpadd_originalSkin;
		this.bg_img.opacity = opa;
	}
}

SoR_GetItemPopWindow.prototype.CalcLength = function(){
	return this.textWidth(this._text);
}



///////////////////////////////////////////////////////////////////////////////



// Change Gold
const SoR_GIP_GI_command125 = Game_Interpreter.prototype.command125;
Game_Interpreter.prototype.command125 = function(params) {
	SoR_GIP_GI_command125.call(this, ...arguments);
    const value = this.operateValue(params[0], params[1], params[2]);
	if(SoR_GIP_Isopen && value>0){
		//function(item, num, type){
	    const obj = new SoR_GetItemPopWindow(params[0],value,0);
		$gameTemp.SoR_ItemPopPush(obj);
	}
    return true;
};

// Change Items
const SoR_GIP_GI_command126 = Game_Interpreter.prototype.command126;
Game_Interpreter.prototype.command126 = function(params) {
	SoR_GIP_GI_command126.call(this, ...arguments);
	const value = this.operateValue(params[1], params[2], params[3]);
	if(SoR_GIP_Isopen && value>0){
		//function(item, num, type){
	    const obj = new SoR_GetItemPopWindow(params[0],value,1);
		$gameTemp.SoR_ItemPopPush(obj);
	}
    return true;
};

// Change Weapons
const SoR_GIP_GI_command127 = Game_Interpreter.prototype.command127;
Game_Interpreter.prototype.command127 = function(params) {
	SoR_GIP_GI_command127.call(this, ...arguments);
	const value = this.operateValue(params[1], params[2], params[3]);
	if(SoR_GIP_Isopen && value>0){
		//function(item, num, type){
	    const obj = new SoR_GetItemPopWindow(params[0],value,2);
		$gameTemp.SoR_ItemPopPush(obj);
	}
    return true;
};

// Change Armors
const SoR_GIP_GI_command128 = Game_Interpreter.prototype.command128;
Game_Interpreter.prototype.command128 = function(params) {
	SoR_GIP_GI_command128.call(this, ...arguments);
	const value = this.operateValue(params[1], params[2], params[3]);
	if(SoR_GIP_Isopen && value>0){
		//function(item, num, type){
	    const obj = new SoR_GetItemPopWindow(params[0],value,3);
		$gameTemp.SoR_ItemPopPush(obj);
	}
    return true;
};





///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

const SoR_GIP_ST_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
    SoR_GIP_Isopen = false;
    SoR_GIP_ST_commandNewGame.call(this);
}
const SoR_GIP_DM_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const contents = SoR_GIP_DM_makeSaveContents.call(this);
    contents.SoRItemPop = SoR_GIP_Isopen;
    return contents;
}
const SoR_GIP_DM_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    SoR_GIP_DM_extractSaveContents.call(this, contents);
    if(!contents.SoRItemPop) SoR_GIP_Isopen = false;
    else SoR_GIP_Isopen = contents.SoRItemPop;
}

}());