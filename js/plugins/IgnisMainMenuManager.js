  
//==========================================================================
// Ignis主菜单管理器
//----------------------------------------------------------------------------
// 09/15/20 |版本：1.0.0
// 此软件是在zlib许可下发布的。
//============================================================================

/*:
 * @target MZ
 * @plugindesc Ignis主菜单管理器版本：1.0.0
 * @author 翻译 Moran_zyb Reisen (Mauricio Pastana)
 * @url https://www.patreon.com/raizen884
 * 
 * @help Ignis主菜单管理器-这个插件在zlib许可下
 * 支持和新的插件加入我们的discord服务器！https://discord.gg/Kh9XXZ2
 * 想要支持新的创作?做个守护神！
 * 对于这个插件，你只需要配置它的参数和它的要求，
 * 每一个项目。一定要记住配置所有的配置！
 * 
 * @param menuOptions
 * @type struct<Menu>[]
 * @text 新菜单选项
 * @desc 在菜单中添加新选项！
 * 
 */

/*~struct~Menu:
* @param name
* @type text
* @text 菜单中的名称
* @desc 将显示在菜单上的名称
* @param switch
* @type number
* @text 开关
* @desc 将激活此选项的开关号，为始终激活的选项留空
* @param scriptCall
* @type note
* @text 脚本调用
* @desc 脚本调用当选择此选项时，为“无脚本调用”留空。
* @param commonEvent
* @type number
* @text 公共事件
* @desc 将调用的公共事件的id，为无公用事件调用留空。
* @param menuClose
* @type boolean
* @text 关闭菜单
* @desc 选择该选项时是否应关闭菜单。
*/
// 不要修改此部分！！！
var Ignis = Ignis || {};
Ignis.MainMenuManager = Ignis.MainMenuManager || {};
Ignis.MainMenuManager.VERSION = [1, 0, 0];

//////////////////////////////////////////////////////////////////////////////////////////////////
//                      Ignis Main Menu Manager
//////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------------------------------------------------------------

(() => {
    const pluginName = "IgnisMainMenuManager";
    const parameters = PluginManager.parameters(pluginName);
    Ignis.MainMenuManager.jsonOpt = JSON.parse(parameters.menuOptions);
    Ignis.MainMenuManager.menuOptions = [];
    for (const menuOption of Ignis.MainMenuManager.jsonOpt) {
        Ignis.MainMenuManager.menuOptions.push(JSON.parse(menuOption));
        let len = Ignis.MainMenuManager.menuOptions.length - 1;
        Ignis.MainMenuManager.menuOptions[len].switch = Ignis.MainMenuManager.menuOptions[len].switch == "" ? false : parseInt(Ignis.MainMenuManager.menuOptions[len].switch);
        Ignis.MainMenuManager.menuOptions[len].commonEvent = Ignis.MainMenuManager.menuOptions[len].commonEvent == "" ? false : parseInt(Ignis.MainMenuManager.menuOptions[len].commonEvent);
        Ignis.MainMenuManager.menuOptions[len].menuClose = Ignis.MainMenuManager.menuOptions[len].menuClose == "true" ? true : false;
    }
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        _Window_MenuCommand_addOriginalCommands.call(this, ...arguments);
        for (const options of Ignis.MainMenuManager.menuOptions) {
            if (!options.switch || $gameSwitches.value(options.switch)) {
                this.addCommand(options.name, options.name, true);
            }
        };
    };
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_createCommandWindow.call(this, ...arguments);
        for (const options of Ignis.MainMenuManager.menuOptions) {
            this._commandWindow.setHandler(options.name, this.commandIgnisMainMenu.bind(this, options));
        };
    };
    Scene_Menu.prototype.commandIgnisMainMenu = function (options) {
        if (options.scriptCall){
            eval(JSON.parse(options.scriptCall))
        }  
        if (options.commonEvent)
            $gameMap._interpreter.setup($dataCommonEvents[options.commonEvent].list)
        if (options.menuClose)
            this.popScene();
    };
})();