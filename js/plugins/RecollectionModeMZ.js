//=============================================================================
// RecollectionModeMZ.js
// Copyright (c) 2020 rinne_grid
// This plugin is released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//
// Version
// 1.0.0 2020/11/28 公開
//=============================================================================

/*:
ja
 * @target MZ
 * @plugindesc 添加CG回想模式功能。
 * @author rinne_grid
 *
 *
 *
 * @param recModeBgm
 * @text [回想模式BGM设定]
 * @desc
 *
 * @param recModeBgmName
 * @parent recModeBgm
 * @text BGM文件名
 * @desc 指定回想模式播放的BGM名称。不需要扩展名
 * @type file
 * @dir audio/bgm
 * @default blank_memories
 *
 * @param recModeBgmPan
 * @parent recModeBgm
 * @text BGM播放位置
 * @desc 指定要播放的背景音乐的播放位置（左右播放）。0的情况在中间播放
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param recModeBgmPitch
 * @parent recModeBgm
 * @text BGM播放速度
 * @desc 指定要播放的BGM（播放速度）。 100正常播放.最小50-最大150
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param recModeBgmVolume
 * @parent recModeBgm
 * @text BGM音量
 * @desc 指定要播放的背景音乐的音量。
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 *
 *
 * @param recModeSelectWindow
 * @text [回忆/CG选择设定]
 * @desc
 *
 * @param recModeSelectWindowX
 * @parent recModeSelectWindow
 * @text x座标
 * @desc 回忆模式·指定CG选择窗口的X坐标
 * @type number
 * @default 260
 *
 * @param recModeSelectWindowY
 * @parent recModeSelectWindow
 * @text Y坐标
 * @desc 回忆模式·指定CG选择窗口的Y坐标
 * @type number
 * @default 180
 *
 * @param recModeSelectWindowRecoTitle
 * @parent recModeSelectWindow
 * @text 回忆菜单名称
 * @desc 指定要添加到标题画面的回忆模式的字符串
 * @type string
 * @default CG回想模式
 *
 * @param recModeSelectWindowSelectReco
 * @parent recModeSelectWindow
 * @text 回忆选项名称
 * @desc 在回忆 / CG 选择窗口中，指定要在回忆侧设置的选项的字符串。
 * @type string
 * @default 回想模式
 *
 * @param recModeSelectWindowSelectCg
 * @parent recModeSelectWindow
 * @text CG选项名称
 * @desc 在回忆 / CG 选择窗口中，指定要在 CG 侧设置的选项的字符串。
 * @type string
 * @default CG模式
 *
 * @param recModeSelectWindowBackTitle
 * @parent recModeSelectWindow
 * @text 返回标题 选择名称
 * @desc 在回忆/CG选择窗口中，指定返回标题的选项字符串。
 * @type string
 * @default 返回标题
 *
 *
 *
 * @param recModeList
 * @text [回忆列表窗口设置]
 * @desc
 *
 * @param recModeListItemColumn
 * @parent recModeList
 * @text CG回想界面的列数
 * @desc 指定在回忆列表窗口中显示的列数
 * @type number
 * @default 2
 *
 * @param recModeListItemRow
 * @parent recModeList
 * @text CG回想界面的行数
 * @desc 指定在回忆列表窗口中显示的行数
 * @type number
 * @default 2
 *
 * @param recModeListIsDisplayText
 * @parent recModeList
 * @text 是否显示CG说明文字
 * @desc 选择是否在回忆列表窗口的 CG 中显示说明文字。
 * @type boolean
 * @on 是
 * @off 否
 * @default true
 *
 * @param recModeListDisplayPosition
 * @parent recModeList
 * @text CG说明文字的显示位置
 * @desc 指定CG描述文本的显示位置。
 * @type select
 * @option center
 * @option right
 * @option left
 * @default center
 *
 * @param recModeListNeverWatchPictureName
 * @parent recModeList
 * @text 未解锁时显示的图像
 * @desc 指定未解锁回忆时要显示的图像文件名（不需要扩展名）
 * @type file
 * @dir img/pictures
 * @default never_watch_picture
 *
 * @param recModeListNeverWatchTextName
 * @parent recModeList
 * @text 未解锁时显示的文本
 * @desc 指定未解锁回忆时要显示的文本
 * @type string
 * @default 未解锁
 *
 *
 *
 * @param sandboxMapId
 * @text 用于CG回想模式地图 ID
 * @desc 指定用于CG回想模式地图。 请创建一个完全空白地图。
 * @type number
 * @default 1
 *
 * @param recoCgSettingList
 * @text 回想信息档案
 * @desc 指定 自定义回想信息的文件，放在data/plugin下面。
 * @type string
 * @default RecollectionModeMZData.json
 *
 *
 * @param devParameter
 * @text [开发参数]
 * @desc
 *
 * @param devParameterDevTools
 * @parent devParameter
 * @text 是否跟游戏一起启动
 * @desc 是否跟游戏一起启动开发参数
 * @type boolean
 * @on 启动
 * @off 不启动
 * @default false
 *
 * @command backToRecoMode
 * @text 添加到CG回想模式界面
 * @desc 您应该在回想公共事件的最后使用此命令。
 *
 * @help
 *这个插件在冒险游戏中经常能看到
*添加场景回忆及CG模式
*
*[插件命令列表]
*
*[添加到CG回想模式界面]
*在公共事件添加到CG回想模式界面用的命令。
*在最后一行必须使用该命令。
*通常时（回想模式以外的游戏中）该指令
*被无视，请放心。

 */

//-----------------------------------------------------------------------------
// ◆ プラグイン設定
//-----------------------------------------------------------------------------
const rngdRecollectionModeMZSettings = {};

const rngdRecollectionGlobalContents = {
    switches: {}
};

let rngdSetReceivedSwitchObj = new Game_Switches();

(() => {
//-----------------------------------------------------------------------------
// ◆ DataManager関数
//-----------------------------------------------------------------------------

    //-------------------------------------------------------------------------
    // ● スイッチのみロードする
    //-------------------------------------------------------------------------
    DataManager.loadGameSwitch = function(savefileId, isSwitchInitialize=true) {
        const saveName = this.makeSavename(savefileId);
        return StorageManager.loadObject(saveName).then(contents => {
            if(isSwitchInitialize) {
                this.createGameObjectSwitch();
            }
            this.extractSaveContentsSwitches(contents);
            const switchObj = $gameSwitches;
            // this.correctDataErrors();
            return switchObj;
        });
    };

    DataManager.createGameObjectSwitch = function() {
        $gameSwitches      = new Game_Switches();
    };

    DataManager.createGameObjectRecoSwitch = function(recoSwitchObj) {
        $gameSwitches      = recoSwitchObj;
    };

    DataManager.extractSaveContentsSwitches = function(contents) {
        if(contents !== undefined && contents !== null) {
            $gameSwitches = contents.switches;
        }
    };

    DataManager.loadDataFileForRecollectionMode = function(name, src) {
        const xhr = new XMLHttpRequest();
        const url = "data/plugin" + src;
        window[name] = null;
        xhr.open("GET", url);
        xhr.overrideMimeType("application/json");
        xhr.onload = () => this.onXhrLoad(xhr, name, src, url);
        xhr.onerror = () => this.onXhrError(name, src, url);
        xhr.send();
    };
//-----------------------------------------------------------------------------
// ◆ プラグインの制御
//-----------------------------------------------------------------------------
    const pluginName = "RecollectionModeMZ";
    const parameters = PluginManager.parameters(pluginName);
    // BGM設定の取得
    rngdRecollectionModeMZSettings["recModeBgm"]                                            = {};
    rngdRecollectionModeMZSettings["recModeBgm"]["recModeBgmName"]                          = parameters["recModeBgmName"];
    rngdRecollectionModeMZSettings["recModeBgm"]["recModeBgmPan"]                           = Number(parameters["recModeBgmPan"]);
    rngdRecollectionModeMZSettings["recModeBgm"]["recModeBgmPitch"]                         = Number(parameters["recModeBgmPitch"]);
    rngdRecollectionModeMZSettings["recModeBgm"]["recModeBgmVolume"]                        = Number(parameters["recModeBgmVolume"]);
    rngdRecollectionModeMZSettings["recModeBgm"]["recModeBgmObj"]                           = {
        name    : rngdRecollectionModeMZSettings["recModeBgm"]["recModeBgmName"],
        pan     : rngdRecollectionModeMZSettings["recModeBgm"]["recModeBgmPan"],
        pitch   : rngdRecollectionModeMZSettings["recModeBgm"]["recModeBgmPitch"],
        volume  : rngdRecollectionModeMZSettings["recModeBgm"]["recModeBgmVolume"]
    };

    // 回想・CG選択設定の取得
    rngdRecollectionModeMZSettings["recModeSelectWindow"]                                   = {};
    rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowX"]           = Number(parameters["recModeSelectWindowX"]);
    rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowY"]           = Number(parameters["recModeSelectWindowY"]);
    rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowRecoTitle"]   = String(parameters["recModeSelectWindowRecoTitle"]);
    rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowSelectReco"]  = String(parameters["recModeSelectWindowSelectReco"]);
    rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowSelectCg"]    = String(parameters["recModeSelectWindowSelectCg"]);
    rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowBackTitle"]   = String(parameters["recModeSelectWindowBackTitle"]);

    // 回想リストウィンドウ設定の取得
    rngdRecollectionModeMZSettings["recModeList"]                                           = {};
    rngdRecollectionModeMZSettings["recModeList"]["recModeListItemColumn"]                  = Number(parameters["recModeListItemColumn"]);
    rngdRecollectionModeMZSettings["recModeList"]["recModeListItemRow"]                     = Number(parameters["recModeListItemRow"]);
    rngdRecollectionModeMZSettings["recModeList"]["recModeListIsDisplayText"]               = eval(String(parameters["recModeListIsDisplayText"] || "true"));
    rngdRecollectionModeMZSettings["recModeList"]["recModeListDisplayPosition"]             = parameters["recModeListDisplayPosition"];
    rngdRecollectionModeMZSettings["recModeList"]["recModeListNeverWatchPictureName"]       = parameters["recModeListNeverWatchPictureName"];
    rngdRecollectionModeMZSettings["recModeList"]["recModeListNeverWatchTextName"]          = parameters["recModeListNeverWatchTextName"];

    // サンドボックスマップIDの取得
    rngdRecollectionModeMZSettings["sandboxMapId"]                                          = Number(parameters["sandboxMapId"]);

    // 回想用スイッチ共有設定の取得
    rngdRecollectionModeMZSettings["shareSaveSwitches"]                                     = eval(String(parameters["shareSaveSwitches"] || "false"));

    // 回想情報ファイル情報の取得
    rngdRecollectionModeMZSettings["recoCgSettingList"]                                     = parameters["recoCgSettingList"];

    // 回想情報ファイル情報の取得
    rngdRecollectionModeMZSettings["devParameterDevTools"]                                  = eval(String(parameters["devParameterDevTools"] || "false"));

    DataManager.loadDataFileForRecollectionMode(rngdRecollectionModeMZSettings["recoCgSettingList"], rngdRecollectionModeMZSettings["recoCgSettingList"]);

    if(rngdRecollectionModeMZSettings["devParameterDevTools"] && window.hasOwnProperty("nw")) {
        const win = nw.Window.get();
        win.showDevTools();
    }

    PluginManager.registerCommand(pluginName, "backToRecoMode", args => {
        Scene_Recollection.prototype.rngd_exit_scene();
    });


})();


    function Sprite_RecoButton() {
        this.initialize(...arguments);
    }

    Sprite_RecoButton.prototype = Object.create(Sprite_Clickable.prototype);
    Sprite_RecoButton.prototype.constructor = Sprite_RecoButton;

    Sprite_RecoButton.prototype.initialize = function() {
        Sprite_Clickable.prototype.initialize.call(this);
    };

    Sprite_RecoButton.prototype.setClickHandler = function(method) {
        this._clickHandler = method;
    };

    Sprite_RecoButton.prototype.onClick = function() {
        if(this._clickHandler) {
            this._clickHandler();
        } else {
            Input.virtualClick();
        }
    };

    Sprite_RecoButton.prototype.blockWidth = function() {
        return Graphics.width;
    };

    Sprite_RecoButton.prototype.blockHeight = function() {
        return Graphics.height;
    };

//-----------------------------------------------------------------------------
// ◆ Scene関数
//-----------------------------------------------------------------------------

    //=========================================================================
    // ■ Scene_Recollection
    //=========================================================================
    // 回想用のシーン関数です
    //=========================================================================
    function Scene_Recollection() {
        this.initialize.apply(this, arguments);
        // 既存データオブジェクトのバックアップ
        rngdRecollectionModeMZSettings["dataSystem_optTransparent"] = $dataSystem.optTransparent;
    }

    Scene_Recollection.prototype = Object.create(Scene_Base.prototype);
    Scene_Recollection.prototype.constructor = Scene_Recollection;

    Scene_Recollection.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Scene_Recollection.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.preloadPicture();
        this.createWindowLayer();
        this.createCommandWindow();
    };

    // 回想モードのカーソル
    Scene_Recollection.rec_list_index = 0;

    // 回想モードの再読み込み判定用 true: コマンドウィンドウを表示せず回想リストを表示 false:コマンドウィンドウを表示
    Scene_Recollection.reload_rec_list = false;

    Scene_Recollection.prototype.preloadPicture = function() {
        const recoCgSettingList = window[rngdRecollectionModeMZSettings["recoCgSettingList"]];
        recoCgSettingList.forEach(function(recoCGObj) {
            if(recoCGObj.hasOwnProperty("thumbnail")) {
                ImageManager.loadPicture(recoCGObj["thumbnail"]);
            }
            ImageManager.loadPicture(recoCGObj["pictures"][0]);
        });
    };

    Scene_Recollection.prototype.createRecollectionCommandRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(3, true);
        const wx = rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowX"];
        const wy = rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowY"];
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Recollection.prototype.createDummyCommandRect = function() {
        return new Rectangle(0, 0, 100, 200);
    };

    Scene_Recollection.prototype.createRecListCommandRect = function() {
        return new Rectangle(0, 0, Graphics.width, Graphics.height);
    };

    Scene_Recollection.prototype.createCommandWindow = function() {
        // 回想モード選択ウィンドウ
        const recoCommandrect = this.createRecollectionCommandRect();
        const recListRect = this.createRecListCommandRect();
        const dummyRect = this.createDummyCommandRect();
        if(Scene_Recollection.reload_rec_list) {

            this._rec_window = new Window_RecollectionCommand(recoCommandrect);
            this._rec_window.setHandler('select_recollection', this.commandShowRecollection.bind(this));
            this._rec_window.setHandler('select_cg', this.commandShowCg.bind(this));
            this._rec_window.setHandler('select_back_title', this.commandBackTitle.bind(this));

            // リロードの場合：選択ウィンドウを非表示にする
            this._rec_window.visible = false;
            this._rec_window.deactivate();
            this.addWindow(this._rec_window);

            // 回想リスト
            this._rec_list = new Window_RecList(recListRect);

            // リロードの場合：回想リストを表示にする
            this._rec_list.visible = true;
            this._rec_list.setHandler('ok', this.commandDoRecMode.bind(this));
            this._rec_list.setHandler('cancel', this.commandBackSelectMode.bind(this));
            this._mode = "recollection";
            this._rec_list.activate();
            this._rec_list.select(Scene_Recollection.rec_list_index);
            this._rec_list.refresh();

            this.addWindow(this._rec_list);

            // CG参照用ダミーコマンド

            this._dummy_window = new Window_Command(dummyRect);
            this._dummy_window.deactivate();
            this._dummy_window.visible = false;
            this._dummy_window.setHandler('ok', this.commandDummyOk.bind(this));
            this._dummy_window.setHandler('cancel', this.commandDummyCancel.bind(this));
            this._dummy_window.addCommand('next', 'ok');
            this.addWindow(this._dummy_window);

            Scene_Recollection.reload_rec_list = false;

        } else {
            // 回想モード選択ウィンドウ
            this._rec_window = new Window_RecollectionCommand(recoCommandrect);
            this._rec_window.setHandler('select_recollection', this.commandShowRecollection.bind(this));
            this._rec_window.setHandler('select_cg', this.commandShowCg.bind(this));
            this._rec_window.setHandler('select_back_title', this.commandBackTitle.bind(this));
            this.addWindow(this._rec_window);

            // 回想リスト
            this._rec_list = new Window_RecList(recListRect);
            this._rec_list.visible = false;
            this._rec_list.setHandler('ok', this.commandDoRecMode.bind(this));
            this._rec_list.setHandler('cancel', this.commandBackSelectMode.bind(this));
            this._rec_list.select(Scene_Recollection.rec_list_index);
            this._rec_list.refresh();
            this.addWindow(this._rec_list);

            // CG参照用ダミーコマンド
            this._dummy_window = new Window_Command(dummyRect);
            this._dummy_window.deactivate();
            this._dummy_window.playOkSound = function(){}; // CGﾓｰﾄﾞの場合、OK音を鳴らさない
            this._dummy_window.visible = false;
            // this._dummy_window.opacity = 0;
            // this._dummy_window.visible = true;
            this._dummy_window.setHandler('ok', this.commandDummyOk.bind(this));
            this._dummy_window.setHandler('cancel', this.commandDummyCancel.bind(this));
            this._dummy_window.addCommand('next', 'ok');
            this.addWindow(this._dummy_window);
        }

    };

    //-------------------------------------------------------------------------
    // ● 開始処理
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        this._rec_window.refresh();
        this._rec_list.refresh();
        AudioManager.playBgm(rngdRecollectionModeMZSettings["recModeBgm"]["recModeBgmObj"]);
        Scene_Recollection._rngd_recollection_doing = false;
    };

    //-------------------------------------------------------------------------
    // ● 更新処理
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.update = function() {
        Scene_Base.prototype.update.call(this);

    };

    //-------------------------------------------------------------------------
    // ● 「回想を見る」を選択した際のコマンド
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandShowRecollection = function() {
        // モードウィンドウの無効化とリストウィンドウの有効化
        this.do_exchange_status_window(this._rec_window, this._rec_list);
        this._mode = "recollection";
    };

    //-------------------------------------------------------------------------
    // ● 「CGを見る」を選択した際のコマンド
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandShowCg = function() {
        this.do_exchange_status_window(this._rec_window, this._rec_list);
        this._mode = "cg";
    };

    //-------------------------------------------------------------------------
    // ● 「タイトルに戻る」を選択した際のコマンド
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandBackTitle = function() {
        Scene_Recollection.rec_list_index = 0;
        SceneManager.goto(Scene_Title);
    };

    //-------------------------------------------------------------------------
    // ● 回想orCGモードから「キャンセル」して前の画面に戻った場合のコマンド
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandBackSelectMode = function() {
        this.do_exchange_status_window(this._rec_list, this._rec_window);
    };

    //-------------------------------------------------------------------------
    // ● 回想orCGモードにおいて、実際の回想orCGを選択した場合のコマンド
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandDoRecMode = function() {
        const target_index = this._rec_list.index();
        Scene_Recollection.rec_list_index = target_index;

        if (this._rec_list.is_valid_picture(this._rec_list.index())) {
            // 回想モードの場合
            if (this._mode === "recollection") {
                Scene_Recollection._rngd_recollection_doing = true;


                // $gamePlayer.setTransparent()
                $dataSystem.optTransparent = true;
                this.fadeOutAll();
                DataManager.setupNewGame();
                $gamePlayer.setTransparent(true);

                // TODO: パーティを透明状態にする
                $gameTemp.reserveCommonEvent(window[rngdRecollectionModeMZSettings["recoCgSettingList"]][target_index]["common_event_id"]);
                $gamePlayer.reserveTransfer(rngdRecollectionModeMZSettings["sandboxMapId"], 0, 0, 0);
                SceneManager.push(Scene_Map);

                // CGモードの場合
            } else if (this._mode === "cg") {
                this._cg_sprites = [];
                this._cg_sprites_index = 0;

                // シーン画像をロードする
                const recoCgSettingList = window[rngdRecollectionModeMZSettings["recoCgSettingList"]];
                recoCgSettingList[target_index].pictures.forEach(function (name) {
                    // CGクリックを可能とする
                    const sp = new Sprite_RecoButton();
                    sp.width = Graphics.width;
                    sp.height = Graphics.height;
                    sp.setClickHandler(this.commandDummyOk.bind(this));
                    sp.processTouch = function() {
                        Sprite_Button.prototype.processTouch.call(this);

                    };
                    sp.bitmap = ImageManager.loadPicture(name);
                    // 最初のSprite以外は見えないようにする
                    if (this._cg_sprites.length > 0) {
                        sp.visible = false;
                    }

                    // TODO: 画面サイズにあわせて、拡大・縮小すべき
                    this._cg_sprites.push(sp);
                    this.addChild(sp);

                }, this);

                // this.do_exchange_status_window(this._rec_list, this._dummy_window);
                this._dummy_window.activate();
                this._dummy_window.visible = true;
            }
        } else {
            this._rec_list.activate();
        }
    };

    Scene_Recollection.prototype.commandDummyOk = function() {
        if(this._cg_sprites_index < this._cg_sprites.length - 1) {;
            this._cg_sprites[this._cg_sprites_index].visible = false;
            this._cg_sprites_index++;
            this._cg_sprites[this._cg_sprites_index].visible = true;
            SoundManager.playOk();

            this._dummy_window.activate();
        } else {
            SoundManager.playOk();
            this.commandDummyCancel();
            this._dummy_window.visible = false;
        }
    };

    Scene_Recollection.prototype.commandDummyCancel = function() {
        this._cg_sprites.forEach(function(obj) {
            obj.visible = false;
            obj = null;
        });
        // this.do_exchange_status_window(this._dummy_window, this._rec_list);
        this._dummy_window.visible = false;
        this._rec_list.activate();
    };

    // コモンイベントから呼び出す関数
    Scene_Recollection.prototype.rngd_exit_scene = function() {
        $dataSystem.optTransparent = rngdRecollectionModeMZSettings["dataSystem_optTransparent"];
        if(Scene_Recollection._rngd_recollection_doing) {
            // Window_RecListを表示する
            Scene_Recollection.reload_rec_list = true;
            SceneManager.push(Scene_Recollection);
        }
    };

    //-------------------------------------------------------------------------
    // ● ウィンドウの無効化と有効化
    //-------------------------------------------------------------------------
    // win1: 無効化するウィンドウ
    // win2: 有効化するウィンドウ
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.do_exchange_status_window = function(win1, win2) {
        win1.deactivate();
        win1.visible = false;
        win2.activate();
        win2.visible = true;
    };
    //-------------------------------------------------------------------------
    // ● セーブ・ロード・ニューゲーム時に必要なスイッチをONにする
    //-------------------------------------------------------------------------
    Scene_Recollection.setRecollectionSwitches = function() {
        return new Promise((resolve, reject) => {
            // 各セーブデータを参照し、RecollectionMode用のスイッチを検索する
            // スイッチが一つでもONになっている場合は回想をONにする
            // const recoSwitchObj = new Game_Switches();
            for(let i = 1; i <= DataManager.maxSavefiles(); i++) {
                DataManager.loadGameSwitch(i).then((switchObj) => {
                    const recoCgSettingList = window[rngdRecollectionModeMZSettings["recoCgSettingList"]];
                    recoCgSettingList.forEach((recoObj) => {

                        if(switchObj !== undefined && switchObj !== null && switchObj._data[recoObj["switch_id"]] === true) {
                            rngdSetReceivedSwitchObj.setValue(recoObj["switch_id"], true);
                        }
                    });
                }).catch((warn) => {
                    // セーブファイルiが存在しない認知済み例外
                });
            }
            // console.log("setRecollectionSwitches",rngdSetReceivedSwitchObj);
            resolve(rngdSetReceivedSwitchObj);
        });
    };

//-----------------------------------------------------------------------------
// ◆ Window関数
//-----------------------------------------------------------------------------

    //=========================================================================
    // ■ Window_RecollectionCommand
    //=========================================================================
    // 回想モードかCGモードを選択するウィンドウです
    //=========================================================================
    function Window_RecollectionCommand() {
        this.initialize(...arguments);
    }

    Window_RecollectionCommand.prototype = Object.create(Window_Command.prototype);
    Window_RecollectionCommand.prototype.constructor = Window_RecollectionCommand;

    Window_RecollectionCommand.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    Window_RecollectionCommand.prototype.makeCommandList = function() {
        Window_Command.prototype.makeCommandList.call(this);
        this.addCommand(rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowSelectReco"], "select_recollection");
        this.addCommand(rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowSelectCg"], "select_cg");
        this.addCommand(rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowBackTitle"], "select_back_title");
    };

    //=========================================================================
    // ■ Window_RecollectionList
    //=========================================================================
    // 回想またはCGを選択するウィンドウです
    //=========================================================================
    function Window_RecList() {
        this.initialize(...arguments);
    }

    Window_RecList.prototype = Object.create(Window_Selectable.prototype);
    Window_RecList.prototype.constructor = Window_RecList;

    //-------------------------------------------------------------------------
    // ● 初期化処理
    //-------------------------------------------------------------------------
    Window_RecList.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        // this.windowWidth = width;
        // this.windowHeight = height;
        // this.select(0);
        this._formationMode = false;
        this.getGlobalSwitches().then( (cnt) => {
        }).catch( (cnt)  => {
            console.error("Window_RecList - initialize - getGlobalSwitches - failedCnt:", cnt);
        });
    };

    Window_RecList.prototype.maxItems = function() {

        const maxItems = window[rngdRecollectionModeMZSettings["recoCgSettingList"]].length;
        return maxItems;
    };

    Window_RecList.prototype.itemHeight = function() {
        return (this.height - this.itemPadding()+10) / rngdRecollectionModeMZSettings["recModeList"]["recModeListItemRow"];
    };

    Window_RecList.prototype.maxPageItems = function() {
        const itemsCount = rngdRecollectionModeMZSettings["recModeList"]["recModeListItemRow"] * rngdRecollectionModeMZSettings["recModeList"]["recModeListItemRow"];
        return itemsCount;
    };

    Window_RecList.prototype.maxCols = function() {
        return rngdRecollectionModeMZSettings["recModeList"]["recModeListItemColumn"];
    };

    Window_RecList.prototype.maxPageRows = function() {
        const pageHeight = this.height;// - this.padding * 2;
        return Math.floor(pageHeight / this.itemHeight());
    };

    Window_RecList.prototype.drawItem = function(index) {
        const recoCgSettingList = window[rngdRecollectionModeMZSettings["recoCgSettingList"]];
        const rec_cg = recoCgSettingList[index];
        const rect = this.itemRect(index);
        let text_height = 0;
        if(rngdRecollectionModeMZSettings["recModeList"]["recModeListIsDisplayText"]) {
            if(rngdRecollectionGlobalContents["switches"][rec_cg.switch_id]) {
                this.contents.drawText(rec_cg.title, rect.x + 4, rect.y + 4, this.itemWidth(), 32,
                    rngdRecollectionModeMZSettings["recModeList"]["recModeListDisplayPosition"]);
            } else {
                this.contents.drawText(rngdRecollectionModeMZSettings["recModeList"]["recModeListNeverWatchTextName"],
                    rect.x + 4, rect.y + 4, this.itemWidth(), 32,
                    rngdRecollectionModeMZSettings["recModeList"]["recModeListDisplayPosition"]);
            }
            text_height = 32;
        }
        // CGセットのスイッチ番号が、全てのセーブデータを走査した後にTrueであればピクチャ表示
        if(rngdRecollectionGlobalContents["switches"][rec_cg.switch_id]) {
            let thumbnail_file_name = rec_cg.pictures[0];
            if(rec_cg.thumbnail !== undefined && rec_cg.thumbnail !== null) {
                thumbnail_file_name = rec_cg.thumbnail;
            }

            this.drawRecollection(thumbnail_file_name, 0, 0,
                this.itemWidth() - 36, this.itemHeight() - 8 - text_height, rect.x + 16, rect.y + 4 +text_height);


        } else {
            this.drawRecollection(rngdRecollectionModeMZSettings["recModeList"]["recModeListNeverWatchPictureName"],
                    0, 0 , this.itemWidth() - 36,
                    this.itemHeight() - 8 - text_height, rect.x + 16, rect.y + 4 + text_height);

        }

    };

    //-------------------------------------------------------------------------
    // ● 全てのセーブデータを走査し、対象のシーンスイッチ情報を取得する
    //-------------------------------------------------------------------------
    Window_RecList.prototype.getGlobalSwitches = function() {
        return new Promise( (resolve, reject) =>
        {
            let failedCnt = 0;
            const maxSaveFiles = DataManager.maxSavefiles();
            for (let i = 1; i <= maxSaveFiles; i++) {
                DataManager.loadGameSwitch(i).then((switchesObj) => {
                    const recoCgSettingList = window[rngdRecollectionModeMZSettings["recoCgSettingList"]];
                    recoCgSettingList.forEach((recoCgObj) => {
                        if (switchesObj._data[recoCgObj.switch_id]) {
                            rngdRecollectionGlobalContents["switches"][recoCgObj.switch_id] = true;
                        }
                    });
                }).catch(err => {
                    failedCnt += 1;
                })
            }
            if(failedCnt > 0) {
                reject(failedCnt);
            } else {
                resolve(failedCnt);
            }
        });
    };
    //-------------------------------------------------------------------------
    // ● index番目に表示された回想orCGが有効かどうか判断する
    //-------------------------------------------------------------------------
    Window_RecList.prototype.is_valid_picture = function(index) {
        // CG情報の取得と対象スイッチの取得
        const recoCgSettingList = window[rngdRecollectionModeMZSettings["recoCgSettingList"]];
        const recCgObj = recoCgSettingList[index];
        return ( rngdRecollectionGlobalContents["switches"][recCgObj.switch_id]);
    };


(function(){

//-----------------------------------------------------------------------------
// ◆ 組み込み関数Fix
//-----------------------------------------------------------------------------


    Window_Base.prototype.drawRecollection = function(bmp_name, x, y, width, height, dx, dy) {
        let bmp = ImageManager.loadPicture(bmp_name);

        let _width = width;
        let _height = height;
        if(_width > bmp.width) {
            _width = bmp.width - 1;
        }

        if(_height > bmp.height) {
            _height = bmp.height - 1;
        }
        const bmpObj = {
            bmp: bmp,
            x: x,
            y: y,
            width: _width,
            height: _height,
            dx: dx,
            dy: dy
        };
        this.contents.blt(bmpObj.bmp, bmpObj.x, bmpObj.y, bmpObj.width, bmpObj.height, bmpObj.dx, bmpObj.dy);
        // bmp.addLoadListener(this.drawRecollectionLoaded.bind(this, bmpObj))

    };

    let Window_TitleCommand_makeCommandList =
        Window_TitleCommand.prototype.makeCommandList;

    Window_TitleCommand.prototype.makeCommandList = function() {
        Window_TitleCommand_makeCommandList.call(this);
        this.clearCommandList();
        this.addCommand(TextManager.newGame,   'newGame');
        this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
        this.addCommand(rngdRecollectionModeMZSettings["recModeSelectWindow"]["recModeSelectWindowRecoTitle"], 'recollection');
        this.addCommand(TextManager.options,   'options');
    };
    Scene_Title.prototype.commandRecollection = function() {
        SceneManager.push(Scene_Recollection);
    };

    let Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler('recollection', this.commandRecollection.bind(this));
    };

    // セーブデータ共有オプションが指定されている場合のみ、カスタマイズ
    if(rngdRecollectionModeMZSettings["shareSaveSwitches"]) {
        DataManager.makeSaveContents = function() {
            // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
            // セーブデータコンテンツ取得前にスイッチ情報を設定する
            Scene_Recollection.setRecollectionSwitches().then((recoSwitchObj) => {
                // DataManager.createGameObjectRecoSwitch(recoSwitchObj);
            });
            const contents = {};
            contents.system = $gameSystem;
            contents.screen = $gameScreen;
            contents.timer = $gameTimer;
            contents.switches = $gameSwitches;
            contents.variables = $gameVariables;
            contents.selfSwitches = $gameSelfSwitches;
            contents.actors = $gameActors;
            contents.party = $gameParty;
            contents.map = $gameMap;
            contents.player = $gamePlayer;
            return contents;
        };

        DataManager.extractSaveContents = function(contents) {
            $gameSystem = contents.system;
            $gameScreen = contents.screen;
            $gameTimer = contents.timer;
            $gameSwitches = contents.switches;
            $gameVariables = contents.variables;
            $gameSelfSwitches = contents.selfSwitches;
            $gameActors = contents.actors;
            $gameParty = contents.party;
            $gameMap = contents.map;
            $gamePlayer = contents.player;
            // console.log("extractSaveContents")

            // セーブデータコンテンツ取得後にスイッチ情報を設定する
            Scene_Recollection.setRecollectionSwitches().then((recoSwitchObj) => {
                const recoCgSettingList = window[rngdRecollectionModeMZSettings["recoCgSettingList"]];
                recoCgSettingList.forEach((recoCgObj) => {
                    if (recoSwitchObj._data[recoCgObj["switch_id"]]) {
                        $gameSwitches.setValue(recoCgObj["switch_id"], true);
                    }
                });
            });
        };

        DataManager.setupNewGame = function() {
            DataManager.createGameObjects();
            DataManager.selectSavefileForNewGame();
            $gameParty.setupStartingMembers();
            $gamePlayer.reserveTransfer($dataSystem.startMapId, $dataSystem.startX, $dataSystem.startY);
            Graphics.frameCount = 0;
            Scene_Recollection.setRecollectionSwitches().then(function(recoSwitchObj) {
                // FIXME: 一番下のセーブデータスイッチが有効になる問題
                // console.log("gameSwitches", rngdSetReceivedSwitchObj);
                $gameSwitches = rngdSetReceivedSwitchObj;
            });
        };
    }


})();

/*
 * comment: param fromMenuSettings
 * comment: parent difficultSettings
 * comment: text [ゲームメニューからの回想呼び出し]
 *
 * comment: param difficultSettings
 * comment: text [高度な設定]
 * comment: desc
 *
 * comment: param isFromMenuCallReco
 * comment: parent fromMenuSettings
 * comment: text メニューからの回想呼び出し有無
 * comment: desc ゲームメニューから回想モードを呼び出せるようにするかどうかを指定します。
 * comment: type boolean
 * comment: on する
 * comment: off しない
 * comment: default false
 *
 * comment: param 回想コマンド追加位置
 * comment: parent fromMenuSettings
 * comment: desc 回想コマンドを追加する位置です。1:アイテムの下 2: スキルの下 3: 装備の下 4:ステータスの下 5: 並び替えの下...
 * comment: default 5
 * comment: type select
 * comment: option アイテムの下
 * comment: value 1
 * comment: option スキルの下
 * comment: value 2
 * comment: option 装備の下
 * comment: value 3
 * comment: option ステータスの下
 * comment: value 4
 * comment: option 並び替えの下
 * comment: value 5
 * comment: option オプションの下
 * comment: value 6
 * comment: option セーブの下
 * comment: value 7
 * comment: option ゲーム終了の下
 * comment: value 8
 *
 * comment: param 「回想」コマンドの名称
 * comment: parent fromMenuSettings
 * comment: desc 回想モードに移動するためのコマンド名称として表示される文字です
 * comment: default 回想モード
 *
 * comment: param 「戻る」コマンドの名称
 * comment: parent fromMenuSettings
 * comment: desc 回想モードからメニューに戻るためのコマンド名称として表示される文字です。
 * comment: default メニューに戻る
 *
 * comment: param 回想コマンドを表示する条件スイッチID
 * comment: parent fromMenuSettings
 * comment: desc このスイッチがONの場合に回想コマンドをメニューに追加します。0の時は常に表示されます。
 * comment: type switch
 * comment: default 0
 *
 * comment: param 自作メニューのシーンクラス名（Scene_XXXX）
 * comment: parent fromMenuSettings
 * comment: desc 自作メニューのシーンクラスを指定します。
 * comment: type string
 * comment: default Scene_Menu
 *
 * comment: param 開始時にOFFにするスイッチID
 * comment: parent fromMenuSettings
 * comment: desc メニューから回想モードを呼び出す時にOFFにするスイッチIDを指定します
 * comment: type switch
 * comment: default 0
 *
 * comment: param 終了時にONにするスイッチID
 * comment: parent fromMenuSettings
 * comment: desc 回想モード終了時にONにするスイッチIDを指定します
 * comment: type switch
 * comment: default 0
 *
 * comment: param shareSaveSwitches
 * comment: text 回想用スイッチの共有有無
 * comment: desc 回想用スイッチをセーブデータ間で共有するかどうかを指定します。
 * comment: type boolean
 * comment: on する
 * comment: off しない
 * comment: default false
 *
* */
