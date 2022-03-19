(
    //参考Scene_MenuBase.prototype.createBackground
    function(){
    ImageManager.loadWPMenus = function(filename) {
        return this.loadBitmap('img/wpmenu/', filename, 0, true);//loadBitmap从模块的可执行文件中加载指定的位图资源的函数。
    };
    //跳过标题
    Scene_Boot.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        SoundManager.preloadImportantSounds();
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
        this.updateDocumentTitle();
    };
    //容纳其他元素的容器
    var _wpMenu_createBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function(){
        _wpMenu_createBackground.call(this);
        this._field = new Sprite();
        this.addChild(this._field);
    };
    //参考Scene_MenuBase.prototype.create
    var _wpMenu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _wpMenu_create.call(this);
        this.createSprites();//增加图片元素
        this.createMissionWindow();//新增一个物品窗口
        this.createOptionWindow();//新增一个设置命令窗口
        this.createGotoMapWindow();//win按钮，点击返回地图
        this.resetPosition();//增加动画效果，将各个元素先摆在指定位置
    };
    //各种不同的图片元素
    Scene_Menu.prototype.createSprites = function(){
        this.createLayout();
        this.createLayoutGold();
        this.createLayoutStatus();
        this.createLayoutMyMission();
        this.createLayoutOption();

        this._commandWindow.x = 50;
        this._commandWindow.y = 90;
        this._commandWindowOrg = [this._commandWindow.x,this._commandWindow.y];
        this._commandWindow.width = 130;
        this._commandWindow.height = 550;
        
        this._statusWindow.x = 190;
        this._statusWindow.y = 100;
        this._statusWindowOrg = [this._statusWindow.x,this._statusWindow.y]
        this._statusWindow.width = 474;
        this._statusWindow.height = 450; 

        this._goldWindow.x = 664;
        this._goldWindow.y = 270;
        this._goldWindowOrg = [this._goldWindow.x, this._goldWindow.y]
        this._goldWindow.width = 180;
        this._goldWindow.height = 180;
    };
    //修改显示金币窗口的大小和位置
    Window_Gold.prototype.windowHeight = function() {
        return 180;
    };
    Window_Gold.prototype.refresh = function() {
        var x = this.textPadding();
        var width = this.contents.width - this.textPadding() * 2;
        this.contents.clear();
        this.drawCurrencyValue(this.value(), this.currencyUnit(), -100, 80, width);
    };
    //创建新的菜单命令窗口
    function Window_optionCommand() {
        this.initialize.apply(this, arguments);
    }
    
    Window_optionCommand.prototype = Object.create(Window_Command.prototype);
    Window_optionCommand.prototype.constructor = Window_optionCommand;
    
    Window_optionCommand.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);

    };
    
    Window_optionCommand.prototype.windowWidth = function() {
        return 100;
    };
    Window_optionCommand.prototype.windowHeight = function() {
        return 100;
    };
    
    Window_optionCommand.prototype.numVisibleRows = function() {
        //return this.maxItems();
    };
    
    Window_optionCommand.prototype.makeCommandList = function() {
        this.addOptionsCommand();
    };
    
    Window_optionCommand.prototype.addOptionsCommand = function() {
            var enabled = this.isOptionsEnabled();
            this.addCommand("", 'options', enabled);
    };
 
    Window_optionCommand.prototype.isOptionsEnabled = function() {
        return true;
    };
    Window_optionCommand.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    };
    //修改高亮选择的大小
    Window_optionCommand.prototype.updateCursor = function() {
        if (this._cursorAll) {
            var allRowsHeight = this.maxRows() * this.itemHeight();
            this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
            this.setTopRow(0);
        } else if (this.isCursorVisible()) {
            var rect = this.itemRect(this.index());
            rect.x += 0; 
            rect.y += 0; 
            rect.width += 0;
            rect.height += 180;
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    };
    
    Scene_Menu.prototype.commandGameEnd = function() {
        SceneManager.push(Scene_Options);
        //SceneManager.push(SceneManager.goto(Scene_Map)); 回到地图界面
        //window.open("http://www.baidu.com"); 打开一个网页
    };
    Scene_Menu.prototype.createOptionWindow = function() {
        this._optionWindow = new Window_optionCommand(0, 0);
        this._optionWindow.y = 430;
        this._optionWindow.x = 654;
        this._optionWindowOrg = [this._optionWindow.x,this._optionWindow.y]
        this._optionWindow.setHandler('options',   this.commandGameEnd.bind(this));
        this.addWindow(this._optionWindow);
    };
    //创建关闭菜单的菜单命令
    function Window_gotoMapCommand() {
        this.initialize.apply(this, arguments);
    }
    
    Window_gotoMapCommand.prototype = Object.create(Window_Command.prototype);
    Window_gotoMapCommand.prototype.constructor = Window_gotoMapCommand;
    
    Window_gotoMapCommand.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);

    };
    
    Window_gotoMapCommand.prototype.windowWidth = function() {
        return 80;
    };
    Window_gotoMapCommand.prototype.windowHeight = function() {
        return 80;
    };
    
    Window_gotoMapCommand.prototype.numVisibleRows = function() {
        //return this.maxItems();
    };
    
    Window_gotoMapCommand.prototype.makeCommandList = function() {
        this.addOptionsCommand();
    };
    
    Window_gotoMapCommand.prototype.addOptionsCommand = function() {
            var enabled = this.isOptionsEnabled();
            this.addCommand("", 'gotoMap', enabled);
    };
 
    Window_gotoMapCommand.prototype.isOptionsEnabled = function() {
        return true;
    };
    Window_gotoMapCommand.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    };
    
    Scene_Menu.prototype.commandWin = function() {
        //SceneManager.push(Scene_GameEnd);
        SceneManager.push(SceneManager.goto(Scene_Map)); //回到地图界面
        //window.open("http://www.baidu.com"); 打开一个网页
    };
    Scene_Menu.prototype.createGotoMapWindow = function() {
        this._gotoMapWindow = new Window_gotoMapCommand(0, 0);
        this._gotoMapWindow.y = 640;
        this._gotoMapWindow.x = 0;
        this._gotoMapWindow.setHandler('gotoMap',   this.commandWin.bind(this));
        this.addWindow(this._gotoMapWindow);
    };

    //创建一个文本展示窗口
    function Window_Mission() {
        this.initialize.apply(this, arguments);
    }
    
    Window_Mission.prototype = Object.create(Window_Base.prototype);
    Window_Mission.prototype.constructor = Window_Mission;
    
    Window_Mission.prototype.initialize = function(x, y) {
        var width = this.windowWidth();
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };
    
    Window_Mission.prototype.windowWidth = function() {
        return 180;
    };
    
    Window_Mission.prototype.windowHeight = function() {
        //return this.fittingHeight(1);
        return 180;
    };
    
    Window_Mission.prototype.refresh = function() {
        var x = this.textPadding();
        var width = this.contents.width - this.textPadding() * 2;
        this.contents.clear();
        this.drawTextEx("新的任务", 20, 100);
    };

    Window_Mission.prototype.open = function() {
        this.refresh();
        Window_Base.prototype.open.call(this);
    };

    Scene_Menu.prototype.createMissionWindow = function() {
        this._missionWindow = new Window_Mission(0, 0);
        this._missionWindow.y = 100;
        this._missionWindow.x = 664;
        this._missionWindowOrg = [this._missionWindow.x,this._missionWindow.y]
        this.addWindow(this._missionWindow);
    };
    //主背景图
    Scene_Menu.prototype.createLayout = function() {
        this._layout = new Sprite(ImageManager.loadWPMenus("layout"));
        this._field.addChild(this._layout);	
    };
    //载入金币窗口图片并绑定默认进比Windows窗口
    Scene_Menu.prototype.createLayoutGold = function() {
        this._layoutGold = new Sprite(ImageManager.loadWPMenus("LayoutCommand"));
        this._field.addChild(this._layoutGold);	
    };
    //为角色状态窗口增加磁贴背景
    Scene_Menu.prototype.createLayoutStatus = function() {
        this._layoutStatus = new Sprite(ImageManager.loadWPMenus("LayoutStatus"));
        this._field.addChild(this._layoutStatus);	
    };
    //为我的任务窗口增加磁贴背景
    Scene_Menu.prototype.createLayoutMyMission = function() {
        this._layoutMyMission = new Sprite(ImageManager.loadWPMenus("LayoutMission"));
        this._field.addChild(this._layoutMyMission);	
    };
    //为设置窗口增加磁贴背景
    Scene_Menu.prototype.createLayoutOption = function() {
        this._layoutOption = new Sprite(ImageManager.loadWPMenus("LayoutOption"));
        this._field.addChild(this._layoutOption);	
    };
    //增加磁贴滑动的动态效果 刷新菜单的各个元素
    Scene_Menu.prototype.updateSprites = function() {
        this.updateSlide();
        this.updateLayout();	
   };
    Scene_Menu.prototype.resetPosition = function() {
        var slide = 100 //元素滑动的距离
        this._goldWindow.y = this._goldWindowOrg[1] + slide;
        this._goldWindow.contentsOpacity = 0;

        this._statusWindow.y = this._statusWindowOrg[1] + slide;
        this._statusWindow.contentsOpacity = 0;

        this._missionWindow.y = this._missionWindowOrg[1] + slide;
        this._missionWindow.contentsOpacity = 0;

        this._optionWindow.y = this._optionWindowOrg[1] + slide;
        this._optionWindow.contentsOpacity = 0;

        this._commandWindow.y = this._commandWindowOrg[1] + slide;
        this._commandWindow.contentsOpacity = 0;
    };

    Scene_Menu.prototype.updateSlide = function() {
        var slideSpeed = 7; //移动的速度
        var opcSpeed = 12;	//窗口文本不透明度渐变速度

        this._goldWindow.contentsOpacity += opcSpeed;
        this._statusWindow.contentsOpacity += opcSpeed;
        this._missionWindow.contentsOpacity += opcSpeed;
        this._optionWindow.contentsOpacity += opcSpeed;
        this._commandWindow.contentsOpacity += opcSpeed;
        
        if (this._goldWindow.y > this._goldWindowOrg[1]) {
            this._goldWindow.y -= 6.5;
            if (this._goldWindow.y < this._goldWindowOrg[1]) {this._goldWindow.y = this._goldWindowOrg[1]};
        };	
        
        if (this._statusWindow.y > this._statusWindowOrg[1]) {
            this._statusWindow.y -= slideSpeed;
            if (this._statusWindow.y < this._statusWindowOrg[1]) {this._statusWindow.y = this._statusWindowOrg[1]};
        };

        if (this._missionWindow.y > this._missionWindowOrg[1]) {
            this._missionWindow.y -= slideSpeed;
            if (this._missionWindow.y < this._missionWindowOrg[1]) {this._missionWindow.y = this._missionWindowOrg[1]};
        };

        if (this._optionWindow.y > this._optionWindowOrg[1]) {
            this._optionWindow.y -= 5.8;
            if (this._optionWindow.y < this._optionWindowOrg[1]) {this._optionWindow.y = this._optionWindowOrg[1]};
        };

        if (this._commandWindow.y > this._commandWindowOrg[1]) {
            this._commandWindow.y -= slideSpeed;
            if (this._commandWindow.y < this._commandWindowOrg[1]) {this._commandWindow.y = this._commandWindowOrg[1]};
        };
    };

    Scene_Menu.prototype.updateLayout = function() {
        this._layoutStatus.x = this._statusWindow.x;
        this._layoutStatus.y = this._statusWindow.y;
        this._layoutStatus.opacity = this._statusWindow.contentsOpacity;
        this._statusWindow.opacity = 0;	

        this._layoutGold.x = this._goldWindow.x;
        this._layoutGold.y = this._goldWindow.y;
        this._layoutGold.opacity = this._goldWindow.contentsOpacity;
        this._goldWindow.opacity = 0;
        
        this._commandWindow.opacity = 0;

        this._gotoMapWindow.opacity = 0;

        this._layoutMyMission.x = this._missionWindow.x;
        this._layoutMyMission.y = this._missionWindow.y;
        this._layoutMyMission.opacity = this._missionWindow.contentsOpacity;
        this._missionWindow.opacity = 0;

        this._layoutOption.x = this._optionWindow.x+10;
        this._layoutOption.y = this._optionWindow.y+10;
        this._optionWindow.opacity = 0;
    };

    var _wpMenu_update = Scene_Menu.prototype.update;
    Scene_Menu.prototype.update = function() {
    _wpMenu_update.call(this);
    if (this._layout) {this.updateSprites()};
};

    //在命令旁边绘制一个icon
    Window_Command.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        var scenesToDraw    = [Scene_Menu]//解决多个场景被同时绘制上了一样图标得问题
        var commandIcon = {};//与new Object()相同
        if(scenesToDraw.indexOf(SceneManager._scene.constructor) >= 0){ 
        var prep = {};
        var commandName = this.commandName(index);
        prep[0] = "物品";
        prep[1] = "12";
        commandIcon[prep[0]] = Number(prep[1]);
        prep[2] = "技能";
        prep[3] = "13";
        commandIcon[prep[2]] = Number(prep[3]);
        prep[3] = "装备";
        prep[4] = "14";
        commandIcon[prep[3]] = Number(prep[4]);
        prep[4] = "状态";
        prep[5] = "15";
        commandIcon[prep[4]] = Number(prep[5]);
        prep[6] = "整队";
        prep[7] = "28";
        commandIcon[prep[6]] = Number(prep[7]);
        prep[8] = "设置";
        prep[9] = "29";
        commandIcon[prep[8]] = Number(prep[9]);
        prep[10] = "保存";
        prep[11] = "30";
        commandIcon[prep[10]] = Number(prep[11]);
        prep[12] = "结束";
        prep[13] = "31";
        commandIcon[prep[12]] = Number(prep[13]);
        this.drawIcon(commandIcon[commandName], rect.x-4, rect.y+2);
        rect.x += 30;
        rect.width -= 30;}
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    };    
})();