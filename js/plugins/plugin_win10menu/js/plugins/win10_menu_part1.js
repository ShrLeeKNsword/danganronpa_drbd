(function(){

 /*:
@plugindesc 菜单美化插件编写实例
@author B站：Qcampus  微信公众号：河上一周
@help
仿win10菜单。
@param height
@desc 选择高亮框的高度
@default 180
 */
　　var parameters = PluginManager.parameters('win10_menu_part1');
　  var selectHeight = Number(parameters['height'] || 180);
    //加载图片
    ImageManager.loadWPMenus = function(filename) {
        return this.loadBitmap('img/wpmenu/', filename, 0, true);//从img/wpmenu/文件夹中加载指定图片文件，本例中所有的图片都放在这个文件夹
    };

    //跳过标题
    Scene_Boot.prototype.start = function() {
        Scene_Base.prototype.start.call(this);//让Scene_Boot继承Scene_Base的属性和方法
        SoundManager.preloadImportantSounds();
        this.checkPlayerLocation();//检查角色位置
        DataManager.setupNewGame();//开始新游戏
        SceneManager.goto(Scene_Map);//进入地图场景
        this.updateDocumentTitle();
    };

    //载入图片元素
    var _wpMenu_createBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function(){
        _wpMenu_createBackground.call(this);
        this._field = new Sprite();//可以把这个_field理解成一块黑板，接下来我们所有的图片元素都得贴到这块黑板上
        this.addChild(this._field);
    };
    
    var _wpMenu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _wpMenu_create.call(this);
        this.createSprites();//增加图片元素
        this.createMissionWindow();
        this.createGotoMapWindow();
        this.resetPosition();
        this.createOptionWindow();//新增一个设置命令窗口
        
    };

    //各种图片都放在这里
    Scene_Menu.prototype.createSprites = function(){
        //主背景图
        this.createLayout();
        //角色状态背景图
        this.createLayoutStatus();
        //定义命令窗口坐标、宽、高信息
        this._commandWindow.x = 50;
        this._commandWindow.y = 90;
        this._commandWindowOrg = [this._commandWindow.x,this._commandWindow.y];
        this._commandWindow.width = 130;
        this._commandWindow.height = 550;
        //定义角色状态窗口坐标、宽、高信息
        this._statusWindow.x = 190;
        this._statusWindow.y = 100;
        this._statusWindowOrg = [this._statusWindow.x,this._statusWindow.y]
        this._statusWindow.width = 474;
        this._statusWindow.height = 450; 
    }

    //加载主背景图的方法的执行
    Scene_Menu.prototype.createLayout = function() {
        this._layout = new Sprite(ImageManager.loadWPMenus("layout"));//会自动从img/wpmenu/文件夹中找到对应名字的图片加载进来
        this._field.addChild(this._layout);	
    };
    Scene_Menu.prototype.createLayoutStatus = function() {
        this._layoutStatus = new Sprite(ImageManager.loadWPMenus("LayoutStatus"));
        this._field.addChild(this._layoutStatus);	
    };

    var _wpMenu_update = Scene_Menu.prototype.update;
    Scene_Menu.prototype.update = function() {
    _wpMenu_update.call(this);
    //检测到有_layout存在，则调用updateSprites()方法
    if (this._layout) {this.updateSprites()};
};
    Scene_Menu.prototype.updateSprites = function() {
        this.updateLayout();
        this.updateSlide();	
   };

   Scene_Menu.prototype.resetPosition = function() {
    var slide = 100 //元素滑动的距离
    this._statusWindow.y = this._statusWindowOrg[1] + slide;
    this._statusWindow.contentsOpacity = 0;
};
Scene_Menu.prototype.updateSlide = function() {
    var slideSpeed = 7; //移动的速度
    var opcSpeed = 12;	//窗口文本不透明度渐变速度
    this._statusWindow.contentsOpacity += opcSpeed;
    
    if (this._statusWindow.y > this._statusWindowOrg[1]) {
        this._statusWindow.y -= slideSpeed;
        if (this._statusWindow.y < this._statusWindowOrg[1]) {this._statusWindow.y = this._statusWindowOrg[1]};
    };
};
    Scene_Menu.prototype.updateLayout = function() {
        this._layoutStatus.x = this._statusWindow.x;
        this._layoutStatus.y = this._statusWindow.y;
        this._layoutStatus.opacity = this._statusWindow.contentsOpacity;
        this._statusWindow.opacity = 0;	
    };

    Window_Command.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        var scenesToDraw = [Scene_Menu]//这里只在主菜单也就是Scene_Menu中绘制图标
        var commandIcon = {};
        if(scenesToDraw.indexOf(SceneManager._scene.constructor) >= 0){ 
        var prep = {};
        var commandName = this.commandName(index);
        prep[0] = "物品";
        prep[1] = "12";
        commandIcon[prep[0]] = Number(prep[1]);
        /*这里将物品的图标设置为第七个icon，
        commandIcon[commandName]会遍历所有的命令找到对应物品的之后将其图标设置为第七
        个icon，其他的因为还没绘制故不显示*/
        this.drawIcon(commandIcon[commandName], rect.x-4, rect.y+2);
        rect.x += 30;
        rect.width -= 30;}
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    };
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
            rect.height += selectHeight;//设置高度为180
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
    //命令的名字，以及是否开启命令，enabled
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
    //通过这个方法返回地图界面
    Scene_Menu.prototype.commandWin = function() {
        SceneManager.push(SceneManager.goto(Scene_Map)); //回到地图界面
    };

    Scene_Menu.prototype.createGotoMapWindow = function() {
        this._gotoMapWindow = new Window_gotoMapCommand(0, 0);
        this._gotoMapWindow.y = 640;
        this._gotoMapWindow.x = 0;
        this._gotoMapWindow.setHandler('gotoMap',   this.commandWin.bind(this));//将commandWin方法通过’gotoMap‘这个标识和之前的addOptionsCommand添加的命令联系起来
        this.addWindow(this._gotoMapWindow);
    };

    
})();