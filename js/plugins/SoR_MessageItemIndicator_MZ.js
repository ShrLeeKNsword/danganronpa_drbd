//=============================================================================
// SoR_MessageItemIndicator_MZ.js
// MIT License (C) 2020 蒼竜 @soryu_rpmaker
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Latest version v1.00 (2020/09/09)
//=============================================================================

/*:ja
* @plugindesc ＜メッセージ式アイテム取得インジケータ＞
* @author 蒼竜 @soryu_rpmaker
* @help アイテムや装備品・お金の取得時に拾得情報を通知する
* メッセージウィンドウを挿入する機能を実装します。ヘルプウィンドウを別添えして，
* 拾得アイテムの説明文も表示することができます。
*
* 導入後、ゲーム開始時には1度プラグインコマンド「取得ポップアップ描画ON」を
* 明示的に呼び出すようにしてください。

* -----------------------------------------------------------
* バージョン情報
* -----------------------------------------------------------
* v1.00 (2020/09/09)       公開
*
* @target MZ
* @url http://dragonflare.dip.jp/dcave/
*
*
* @param ---レイアウト関係---
* @param ItemWindow_Ypadd
* @desc アイテム入手メッセージウィンドウ位置。画面中央からの差分、正の数で上寄り (default: 32)
* @default 32
* @type number
* @param HelpWindow_Ypadd
* @desc ヘルプウィンドウ位置。画面下からの差分、正の数で上寄り (default: 0)
* @default 0
* @type number
* @param HelpWindow_Width
* @desc ヘルプウィンドウの横幅。画面サイズ以上にはなりません (default: 600)
* @default 600
* @type number
* @param HelpWindow_YLength
* @desc ヘルプウィンドウ描画行数。標準ヘルプなら2で十分 (default: 4)
* @default 4
* @type number
* @param ---描画メッセージ関係---
* @param ItemMesSoundSE
* @desc 入手ウィンドウ挿入ごとに鳴らす効果音を設定します (default: 無し) 
* @type file
* @dir audio/se
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
*
* @command EnableItemMessageIndicator
* @text 取得メッセージ表示ON[メッセージ式アイテム取得インジケータ]
* @desc アイテム類・お金取得(増)判定時に、メッセージウィンドウを表示します。
* @command DisableItemMessageIndicator
* @text 取得メッセージ表示OFF[メッセージ式アイテム取得インジケータ]
* @desc アイテム類・お金取得時のメッセージウィンドウを無効化します。
* @command EnableItemMessageIndicatorHelp
* @text ヘルプウィンドウ表示ON[メッセージ式アイテム取得インジケータ]
* @desc アイテム取得メッセージ描画時、アイテムのヘルプもウィンドウで描画します。
* @command DisableItemMessageIndicatorHelp
* @text ヘルプウィンドウ表示OFF[メッセージ式アイテム取得インジケータ]
* @desc アイテム取得メッセージ描画時、アイテムのヘルプを描画しません。
*/
/*:
* @plugindesc <Obtained Item Window Indicator>
* @author @soryu_rpmaker
* @help This plugin implements a function to indicate the player obtained 
* any items by inserting a message window on the screen.
* Additionaly, description of the item can be shown with a help window.
* 
* You must explicitly call a plugin command "Enable Indicator" to enable the popup indicator.
*
* -----------------------------------------------------------
* Version info.
* -----------------------------------------------------------
* v1.00 (Sep. 9th, 2020)      released!
*
* @target MZ
* @url http://dragonflare.dip.jp/dcave/index_e.php
*
* @param ---Layout---
* @param ItemWindow_Ypadd
* @descY-cooridnate(upper left corner) of Item Obtained Window Indicator (default: 32)
* @default 32
* @type number
* @param HelpWindow_Ypadd
* @desc Height of a window for each indication window (default: 0)
* @default 0
* @type number
* @param HelpWindow_Width
* @desc Width of a help window with an indicator. No larger than Game screen width (default: 600)
* @default 600
* @type number
* @param HelpWindow_YLength
* @desc Number of lines of help window. In default, 2 seems to be enough. (default: 4)
* @default 4
* @type number
* @param ------Display info.------
* @param ItemMesSoundSE
* @desc SE for inserting every Obtained Window (default: none) 
* @type file
* @dir audio/se
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
*
*
* @command EnableItemMessageIndicator
* @text Enable Indicator[SoR_MessageItemIndicator]
* @desc Enable to show indicator when the player obtained any items.
* @command DisableItemMessageIndicator
* @text Disable Indicator[SoR_MessageItemIndicator]
* @desc Disable to show indicator.
* @command EnableItemMessageIndicatorHelp
* @text Enable Help Window[SoR_MessageItemIndicator]
* @desc Enable to show help window with an indicator message
* @command DisableItemMessageIndicatorHelp
* @text Disable Help Window[SoR_MessageItemIndicator]
* @desc Disable to show help window with an indicator message (Just show a message)
*/




(function() {

const pluginName = "SoR_MessageItemIndicator_MZ";
const Param = PluginManager.parameters(pluginName);

const ItemMesSoundSE = String(Param['ItemMesSoundSE'] || '');
const IconID_Money = Number(Param['IconID_Money'] || 0);
const Prefix_NumberofItem =　String(Param['Prefix_NumberofItem'] || '');
const Suffix_NumberofItem =　String(Param['Suffix_NumberofItem'] || '');
const IsDrawNumberforOneItem = Boolean(Param['IsDrawNumberforOneItem'] === 'true') || false;
const MessageObtained = String(Param['MessageObtained'] || '');

const ItemWindow_Ypadd = Number(Param['ItemWindow_Ypadd'] || 0);
const HelpWindow_Ypadd = Number(Param['HelpWindow_Ypadd'] || 0);
const HelpWindow_Width = Number(Param['HelpWindow_Width'] || 0);
const HelpWindow_YLength = Number(Param['HelpWindow_YLength'] || 0);

let SoR_MII_Isopen = true;
let SoR_MII_helpw_IsUsing = true;




PluginManager.registerCommand(pluginName, "EnableItemMessageIndicator", args => { 
	SoR_MII_Isopen = true;
});
PluginManager.registerCommand(pluginName, "DisableItemMessageIndicator", args => { 
	SoR_MII_Isopen = false;
});
PluginManager.registerCommand(pluginName, "EnableItemMessageIndicatorHelp", args => { 
	SoR_MII_helpw_IsUsing = true;
});
PluginManager.registerCommand(pluginName, "DisableItemMessageIndicatorHelp", args => { 
	SoR_MII_helpw_IsUsing = false;
});

///////////////////////////////////////////////////////////////////////////////


const SoR_MII_WM_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function() {
    SoR_MII_WM_startMessage.call(this);
    if($gameTemp.SetMessageItemIndicator == true) this.SetItemObtainedMessageIndicator();
}

const SoR_MII_WM_newPage = Window_Message.prototype.newPage;
Window_Message.prototype.newPage = function(textState) {
    if($gameTemp.ChangedMessageItemIndicator == true) this.ResetDefaultMsgWindowSetting();
    SoR_MII_WM_newPage.call(this, ...arguments);
    
}

const SoR_MII_SM_createMessageWindow = Scene_Message.prototype.createMessageWindow;
Scene_Message.prototype.createMessageWindow = function() {
    $gameTemp.originalMSGWindow = this.messageWindowRect();
    SoR_MII_SM_createMessageWindow.call(this);
}

Window_Message.prototype.SetItemObtainedMessageIndicator = function() {
    let x, y;
    const tx = $gameMessage.allText();
    const textState = this.createTextState(tx, 0, 0, 0);
    
    const tt = textState.text.replace(/\x1bI\[(\d+)\]/gi,"");
    this.width = this.textWidth(tt)+74;
    this.height = Window_Base.prototype.fittingHeight(1)+2;

    this.x = (Graphics.width - this.width)*0.5;
    this.y = (Graphics.height - this.height)*0.5-ItemWindow_Ypadd;


 


    $gameTemp.ChangedMessageItemIndicator = true;
    $gameTemp.SetMessageItemIndicator = false;

    if($gameMessage._Description != "" && SoR_MII_helpw_IsUsing == true){
        this._ItemIndicator_helpWindow.setText($gameMessage._Description);
        this._ItemIndicator_helpWindow.show();
        this._ItemIndicator_helpWindow.open();
    }
}

Window_Message.prototype.ResetDefaultMsgWindowSetting = function() {
    const rect = $gameTemp.originalMSGWindow;

    if(this.x !== rect.x) this.x = rect.x;
    if(this.y !== rect.y) this.y = rect.y;
    if(this.width !== rect.width) this.width = rect.width;
    if(this.height !== rect.height) this.height = rect.height;
    $gameTemp.ChangedMessageItemIndicator = false;
    this._ItemIndicator_helpWindow.close();
}

const SoR_MII_WM_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function() {
    SoR_MII_WM_terminateMessage.call(this);
    this._ItemIndicator_helpWindow.close();
};



///////////////////////////////////////////////////////////////////////////////
Game_Message.prototype.setDescription = function(text) {
    this._Description = text;
}

const SoR_MII_SM_createAllWindows = Scene_Message.prototype.createAllWindows;
Scene_Message.prototype.createAllWindows = function() {
    this.createItemGetIndicatorHelpWindow();
    SoR_MII_SM_createAllWindows.call(this);
}
Scene_Message.prototype.createItemGetIndicatorHelpWindow = function() {
    const rect = this.ItemGetIndicator_helpWindowRect();
    this._ItemIndicator_helpWindow = new Window_Help(rect);
    this._ItemIndicator_helpWindow.hide();
    this._ItemIndicator_helpWindow.close();
    this.addWindow(this._ItemIndicator_helpWindow);
}
Scene_Message.prototype.ItemGetIndicator_helpWindowRect = function() {
    
    const ww = Graphics.width<HelpWindow_Width? Graphics.width : HelpWindow_Width;
    const wh = Window_Base.prototype.fittingHeight(HelpWindow_YLength);
    const wx = (Graphics.width - ww)/2;
    const wy = Graphics.height - wh - HelpWindow_Ypadd;
    return new Rectangle(wx, wy, ww, wh);
}

const SoR_MII_SM_associateWindows = Scene_Message.prototype.associateWindows;
Scene_Message.prototype.associateWindows = function() {
    SoR_MII_SM_associateWindows.call(this);
    const messageWindow = this._messageWindow;
    messageWindow.setItemIndicator_helpWindow(this._ItemIndicator_helpWindow);
    this._ItemIndicator_helpWindow.setMessageWindow(messageWindow);
}
Window_Help.prototype.setMessageWindow = function(messageWindow) {
    this._messageWindow = messageWindow;
}
Window_Message.prototype.setItemIndicator_helpWindow = function(helpWindow) {
    this._ItemIndicator_helpWindow = helpWindow;
}


///////////////////////////////////////////////////////////////////////////////



// Change Gold
const SoR_MII_GI_command125 = Game_Interpreter.prototype.command125;
Game_Interpreter.prototype.command125 = function(params) {
	SoR_MII_GI_command125.call(this, ...arguments);
    const value = this.operateValue(params[0], params[1], params[2]);
	if(SoR_MII_Isopen && value>0){
		$gameTemp.displayItemObtainedMessages(params[0],value,0);
	}
    return true;
};


// Change Items
const SoR_MII_GI_command126 = Game_Interpreter.prototype.command126;
Game_Interpreter.prototype.command126 = function(params) {
	SoR_MII_GI_command126.call(this, ...arguments);
	const value = this.operateValue(params[1], params[2], params[3]);
	if(SoR_MII_Isopen && value>0){
        $gameTemp.displayItemObtainedMessages(params[0],value,1);
	}
    return true;
};

// Change Weapons
const SoR_MII_GI_command127 = Game_Interpreter.prototype.command127;
Game_Interpreter.prototype.command127 = function(params) {
	SoR_MII_GI_command127.call(this, ...arguments);
	const value = this.operateValue(params[1], params[2], params[3]);
	if(SoR_MII_Isopen && value>0){
		$gameTemp.displayItemObtainedMessages(params[0],value,2);
	}
    return true;
};

// Change Armors
const SoR_MII_GI_command128 = Game_Interpreter.prototype.command128;
Game_Interpreter.prototype.command128 = function(params) {
	SoR_MII_GI_command128.call(this, ...arguments);
	const value = this.operateValue(params[1], params[2], params[3]);
	if(SoR_MII_Isopen && value>0){
		$gameTemp.displayItemObtainedMessages(params[0],value,3);
	}
    return true;
};

 

Game_Temp.prototype.displayItemObtainedMessages = function(item, num, type){
    let getobj;
    let ItemMes_se;

    switch(type){
		case 0:
		break;
		case 1:
			getobj = $dataItems[item];
		break;
		case 2:
			getobj = $dataWeapons[item];
		break;
		case 3:
			getobj = $dataArmors[item];
		break;
    }

    if(ItemMesSoundSE!='') {
		ItemMes_se = {
			name : ItemMesSoundSE,
			pitch : 100,
			volume : 100
		}
    }
    
    let nametxt = "";
	let icon = 0;
	let _num = num;
	let _type = type; 

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

		 nametxt = getobj.name + numbers;
         icon = getobj.iconIndex;
	}
	else{
		nametxt = num + $dataSystem.currencyUnit;
		icon = IconID_Money;
    }


    const text = "\\I["+icon+"]" + nametxt + MessageObtained;
    if(ItemMes_se) AudioManager.playSe(ItemMes_se);
    
    $gameTemp.SetMessageItemIndicator = true;
    $gameMessage.newPage();
    if(type!=0){ //not money
         $gameMessage.setDescription(getobj.description);
    }
    else $gameMessage.setDescription("");
    $gameMessage.add(text);
};


///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

const SoR_MII_ST_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
    SoR_MII_Isopen = false;
    SoR_MII_helpw_IsUsing = true;
    SoR_MII_ST_commandNewGame.call(this);
}
const SoR_MII_DM_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const contents = SoR_MII_DM_makeSaveContents.call(this);
    contents.SoRItemMesW = SoR_MII_Isopen;
    contents.SoR_MII_helpw_IsUsing = SoR_MII_helpw_IsUsing;
    return contents;
}
const SoR_MII_DM_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    SoR_MII_DM_extractSaveContents.call(this, contents);
    if(!contents.SoRItemMesW){
         SoR_MII_Isopen = false;
         SoR_MII_helpw_IsUsing = true;
    }
    else{
         SoR_MII_Isopen = contents.SoRItemMesW;
         SoR_MII_helpw_IsUsing = contents.SoR_MII_helpw_IsUsing;
    }
}


}());