//==========================================================
// RPG Maker MZ QJ-Lighting.js
//==========================================================
/*:
 * @target MZ
 * @plugindesc Light and Shadows [V1.0] 2022-2-13
 * @author Qiu Jiu
 *
 *
 * @help
 * QJ-Lighting.js
 * ===============================================================================
 * 一.插件基础说明
 * ===============================================================================
 * 1.插件结构(逻辑结构,并非实际的图层结构)
 *
 *
 * ========================
 * 遮挡层(地图遮罩/黑色部分)
 * ========================
 *   ^
 *   |
 *   |          ============================
 *   |       -->简易灯光(用于区域灯光/定时灯光)
 * =====    /   ============================        ======================
 * 灯光层--<                                      -->实时阴影(地形或者区域)
 * =====    \   ======================          /   ======================
 *           -->完整灯光(用于事件/玩家)----------<    
 *              ======================          \   =============
 *                                               -->事件/玩家阴影
 *                                                  =============
 *
 *
 * 2.灯光总共分为两种：完整灯光和简易灯光。
 *   完整灯光：|有完整的灯光参数，可以产生实时阴影和事件阴影|消耗资源比较多，数量上限低|只能绑定在玩家或者事件身上    |
 *   简易灯光：|只有基础的灯光参数，不可以产生阴影         |消耗资源少，数量上限高    |只能绑定在指定位置(区域或地形)|
 *   ***在以后的版本中，可以使用弹幕插件(QJ-Bullet)也可以将上述两种灯光绑定在弹幕上，可以通过操控弹幕的移动来控制灯光的行为***
 * 3.要创建一个 完整灯光 ,必须首先在右方的插件参数"灯光预设数据"中设置一个灯光,然后此灯光便可(且只能)依照"灯光编号"来绑定在事件或者
 *   玩家身上.<<<仅仅能绑定在玩家或者事件上>>>
 *   (1)要绑定在玩家身上时,可以在右方插件参数"玩家初始灯光"中写上玩家最开始时所需要设置的灯光编号.游戏运行时要改变的话,就使用
 *   下方指定的脚本指令.
 *   (2)要绑定在事件身上时,需将该事件的某个事件页的第一个指令设置为"注释",且在该注释指令中写下方"二.事件注释"中的文字.
 *   不同的事件页可以设置不同的灯光,切换事件页后对应的灯光也会重新加载,故而:在游戏运行时想要修改事件的灯光,可以使用独立开关
 *   来切换事件页,从而改变灯光.
 *   (3)灯光的图片在数据库中设置后,会在游戏载入时进行预加载,可以提高系统稳定性,大幅提高效率.
 *      灯光图片放在img/lights下.设定的灯光图片名前面加上$符号时,灯光图片将被横向分为四行,每一行分别代表此
 *      事件/玩家朝向 下 左 右 上 时的灯光图片.
 *      灯光图片名后面可以加上 [总帧数,间隔时间] ,灯光图片将被纵向分为"总帧数"格,每隔"间隔时间"帧,灯光图片就
 *      会对应着动态变化.
 * 4.要创建一个 简易灯光，需在右方插件参数中"简易灯光数据"中设置灯光数据。
 *   可在“区域灯光”中将指定编号的简易灯光绑定在区域上，这样所有的该区域均会生成一个灯光.
 *   或者使用脚本指令在指定地方生成一个临时灯光，具体请查看 三.脚本指令 中的 5.定时简易灯光.
 * 5.地图中的阴影有两种:区域实时阴影和事件阴影。
 *   (1)区域实时阴影:
 *      区域实时阴影是指以某个区域的正方形块为图形进行投影，投射的点只能是这个正方形的四个角，此功能与大部分灯光插件的实时阴影功能
 *      相同。
 *      区域上方也可以显示各种形状的纯色遮罩，此功能主要是为了做"屋顶"的效果。灵活使用此效果可以制作其他灯光插件所说的"多高度阴影"
 *      (multi-height shadows)的效果。如果不想设置纯色遮罩，则将遮罩的颜色设置为白色(#ffffff).
 *      纯色遮罩的形状除了预设的那些外也可以自己写，但是此功能稍显复杂。
 *
 *      形状的基础设定方式是在数组中写各个点的对象。点的基础坐标为该块的左上角。
 *      例如 [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 *      就代表着从(0,0)点画横线到(48,0)，再画横线到(48,48)，再画横线到(0,48)，最后首位相连，然后在画成的轨迹中进行涂色。
 *      其中x和y分别代表着相对于"该块的左上角"的坐标，t代表此点到下一个点的绘制方式。
 *      t的值和对应的绘制方式:
 *          0直线
 *          1顺时针画圆弧(朝外部)
 *          2顺时针画圆弧(朝内部)
 *          3逆时针画圆弧(朝外部)
 *          4逆时针画圆弧(朝内部)
 *          5将此点与初始点相连并在生成的图形中涂色，然后另开新的起始点画下一个部分
 *
 *   (2)事件阴影:
 *      可以指定某个光源可以让事件产生投影，然后可以指定哪个事件可以产生投影。
 *      某个光源是否可以让事件产生投影，得在插件参数的"灯光预设"中设定。
 *      事件能否产生投影得在某个事件的某个事件页的注释中写对应指令，具体可查看  二.事件注释  中的  3.事件阴影设置。
 *      事件是否默认产生阴影可以在右方的插件参数中的"默认开启事件阴影"中设定。
 *
 *      队友和领队(玩家)均可以产生阴影，队友的阴影参数与玩家相同.
 *
 * 6.灯光数据后面加*的数据,均可使用如下格式的字符串来设计动态变化效果(类似于设置关键帧):[!!!!!!!!!!!!!!!!!!!!特别重要!!!!!!!!!!!!!!!!!!!!]
 *   持续时间|对应值~持续时间|对应值~持续时间|对应值
 *   例如设置灯光的不透明度(0-1,1为最明亮)时,若写(不加空格,不加引号,不加逗号) 60|0.2~60|0.6~60|1 ,
 *      那么该灯光的不透明度在0-60帧时是0.2,60-120帧时是0.6,120-180帧时是1,然后 进行循环 .
 *   分割 持续时间 和 对应值的是符号|,除了|外,也可以使用/或者%.
 *   |代表到达该时间段内时,该数据的值瞬间变成对应值.例如50|0.5~10|1,该数据在第50帧时会由0.5瞬间变成1,持续10帧后再瞬间变回0.5.
 *   /代表在此时间段内,该数据的值由上一个值线性变为该对应值.例如50|0.5~10/1~50|1~10/0.5,
 *      该数据在第50帧后,会在10帧内由0.5线性变为1,在第60到第110帧内一直是1,然后在接下来的10帧内再次由1线性渐变为0.5.然后进行循环.
 *   %与/同理,不过/代表线性渐变,%代表曲线渐变(圆).
 *   !!!注意!!!该格式的第一个 持续时间|对应值 中分割 持续时间 和 对应值的符号只能是|,不能是/或者%.因为此时没有初值供其进行变化.
 * ================================================================
 *
 *
 *
 * ===============================================================================
 * 二.事件注释(每个事件的事件页中第一个事件指令)
 * ===============================================================================
 * 1.基础注释,为事件设置光效:(Qiu Jiu Light Layer)
 *   <QJLL:id>
 *   id:在数据库中指定的灯光id.
 * ================================================================
 * 2.修改事件光效数据:(Qiu Jiu Light Layer)
 *   以<QJLL:id>设置的指定数据库中的数据为基础,设置该事件该事件页灯光的对应数据,注意,在此处不能修改光效图片。
 *   在此处没有写的数据则不能修改.
 *   <QJLL-scaleX:value>                     例如  <QJLL-scaleX:1>
 *   <QJLL-scaleY:value>                     例如  <QJLL-scaleY:1>
 *   <QJLL-tint:value>                       例如  <QJLL-tint:#ff00ff>
 *   <QJLL-offsetX:value>                    例如  <QJLL-offsetX:0>
 *   <QJLL-offsetY:value>                    例如  <QJLL-offsetY:0>
 *   <QJLL-dirOffsetX:value>                 例如  <QJLL-dirOffsetX:0~0~0~0>
 *   <QJLL-dirOffsetY:value>                 例如  <QJLL-dirOffsetY:0~0~0~0>
 *   <QJLL-opacity:value>                    例如  <QJLL-opacity:1>
 *   <QJLL-rotation:value>                   例如  <QJLL-rotation:0>
 *   <QJLL-rotationAuto:value>               例如  <QJLL-rotationAuto:0>
 *   <QJLL-dirRotation:value>                例如  <QJLL-dirRotation:0~0~0~0>
 *   <QJLL-shadowCharacter:false/true>       例如  <QJLL-shadowCharacter:false>
 *   <QJLL-shadowCharacterOffsetX:value>     例如  <QJLL-shadowCharacterOffsetX:0>
 *   <QJLL-shadowCharacterOffsetY:value>     例如  <QJLL-shadowCharacterOffsetY:0>
 *   <QJLL-shadowCharacterMaxOpacity:value>  例如  <QJLL-shadowCharacterMaxOpacity:1>
 *   <QJLL-shadowCharacterMaxDistance:value> 例如  <QJLL-shadowCharacterMaxDistance:150>
 * ================================================================
 * 3.事件阴影设置:(Qiu Jiu Character Shadow)
 *   设置事件的阴影,灯光属性shadowCharacter打开时,灯光便会投射该事件的阴影。
 *   <QJCS-status:false/true>:是否显示该事件的阴影.默认是false.需要手动设置来打开.例如<QJCS-status:true>.
 *   <QJCS-imgName:value>:阴影默认采用事件的当前行走图作为阴影,但若想重新设置对应的阴影,可以在此设置阴影图片.
 *      1.阴影图片也放在img/lights下.设定的阴影图片名前面加上$符号时,阴影图片将被横向分为四行,每一行分别代表此
 *      事件朝向 下 左 右 上 的阴影图片.
 *      2.阴影默认采用事件的当前行走图作为阴影时,影子会随事件/玩家的行走图的变化而变化,但若设置成固定的阴影图片,
 *      则阴影不会随着事件的行走图的变化而变化.
 *      3.系统会将行走图完全变成黑色.若想单独指定该事件阴影的颜色,可以使用<QJCS-tint:value>来指定颜色.
 *      4.！！！注意！！！阴影图片在这里指定后,还必须在插件参数的"阴影图片预载"中同样写上此图片名.
 *      此举的目的是使所有用到的光影图片都被预加载,提高系统稳定性,大幅提高效率.
 *   <QJCS-tint:value>:阴影颜色.例如<QJCS-tint:#000000>.
 *   <QJCS-opacity:value>:阴影不透明度.例如<QJCS-opacity:1>.
 *   <QJCS-offsetX:value>:阴影底部的x偏移.例如<QJCS-offsetX:0>.
 *   <QJCS-offsetY:value>:阴影底部的y偏移.例如<QJCS-offsetY:0>.
 *   <QJCS-offsetDirX:朝下~朝左~朝右~朝上>:朝各个方向时阴影底部的x偏移.例如<QJCS-offsetDirX:0~0~0~0>.
 *   <QJCS-offsetDirY:朝下~朝左~朝右~朝上>:朝各个方向时阴影底部的y偏移.例如<QJCS-offsetDirY:0~0~0~0>.
 *   <QJCS-model:value>:此事件投影的模式.默认为D[].不同字符对应的效果为:例如<QJCS-model:DM[48]>.
 *
 *      D[]影子只会根据光源与事件的方向进行旋转,不会有任何变形.适合行走图比较小,脚很小的人物.
 *      DM[value]同D[],且光源离事件越近,影子越影子越短.value代表影子与原图的大小比例为1:1时光源与事件的距离(像素值).一格为48.
 *          value适合写48.
 *      DW[value]同D[],且光源离事件越近,影子越影子越长.value代表影子与原图的大小比例为1:1时光源与事件的距离(像素值).一格为48.
 *          value适合写96.
 *
 *      B[]影子的底部不变化,但是影子会根据光源与事件的方向进行形变.当光源与影子在同一水平线上时,影子会变得很窄很窄.适合行走图比
 *          较大,很宽的门.
 *      BM[value]同B[],且光源离事件越近,影子越影子越短.value代表影子与原图的大小比例为1:1时光源与事件的距离(像素值).一格为48.
 *          value适合写48.
 *      BW[value]同B[],且光源离事件越近,影子越影子越长.value代表影子与原图的大小比例为1:1时光源与事件的距离(像素值).一格为48.
 *          value适合写96.
 *   <QJCS-yCut:value>:在原阴影图的基础上，将锚点上浮value个像素,然后切除锚点之下的图片。在QJCS-model的值为D[]或DM[]或DW[]时，
 *      此效果能使阴影的旋转更自然，value的默认值是0，建议写的值为24.:例如<QJCS-yCut:24>.
 * ================================================================
 *
 *
 *
 * ===============================================================================
 * 三.脚本指令
 * ===============================================================================
 * 1.打开或者关闭灯光效果.
 *   QJ.LL.open():打开光效.注意!若使用过QJ.LL.tint来将画面整体颜色调整为"#ffffff"(白色,相当于没有光效),那么使用此指令将无效!
 *      需先使用QJ.LL.tint来将画面整体颜色变为其他颜色.
 *   QJ.LL.close():关闭光效.
 * ================================================================
 * 2.调节画面整体的默认颜色.
 *   QJ.LL.tint(time,color):调节光效整体颜色.
 *      time:渐变时间,单位为帧,写0时瞬间变化.
 *      color:目标颜色.
 *   若原本光效就关闭着,那么系统会自动打开光效,且光效颜色将从"#ffffff"渐变为目标颜色(color).
 *   同样地，若目标颜色(color)为"#ffffff"，系统会在渐变完后自动关闭光效。
 * ================================================================
 * 3.重设玩家光效.(set player light -> spl)
 *   QJ.LL.splHide():暂时隐藏玩家灯光数据.
 *   QJ.LL.splShow():打开玩家灯光数据.
 *   QJ.LL.spl(lightId):完全重设（刷新）灯光数据,写null以删除玩家灯光。
 *   QJ.LL.splScaleX(value):重设当前灯光的x缩放数据。
 *   QJ.LL.splScaleY(value):重设当前灯光的y缩放数据。
 *   QJ.LL.splTint(value):重设当前灯光的色调。
 *   QJ.LL.splOffsetX(value):重设当前灯光的x偏移。
 *   QJ.LL.splOffsetY(value):重设当前灯光的y偏移。
 *   QJ.LL.splDirOffsetX(value):重设当前灯光的x朝向偏移。
 *   QJ.LL.splDirOffsetY(value):重设当前灯光的y朝向偏移。
 *   QJ.LL.splOpacity(value):重设当前灯光的不透明度。
 *   QJ.LL.splRotation(value):重设当前灯光的角度。
 *   QJ.LL.splDirRotation(value):重设当前灯光的朝向角度。
 *   （其余诸如imgName等的数据只能通过QJ.LL.spl(lightId)重设.）
 * ================================================================
 * 4.重设玩家阴影.(set player shadow -> sps)
 *   QJ.LL.spsStatus(false/true):关闭/打开玩家阴影.
 *   QJ.LL.spsImgName(value):重设玩家阴影图片,使用QJ.LL.imgName("")或者QJ.LL.imgName(null)来使用玩家行走图作为阴影.
 *   QJ.LL.spsTint(value):重设玩家阴影色调.
 *   QJ.LL.spsOpacity(value):重设玩家阴影不透明度.
 *   QJ.LL.spsOffsetX(value):重设玩家阴影x偏移.
 *   QJ.LL.spsOffsetY(value):重设玩家阴影y偏移.
 *   QJ.LL.spsOffsetDirX(朝下~朝左~朝右~朝上):重设玩家阴影x朝向偏移.
 *   QJ.LL.spsOffsetDirY(朝下~朝左~朝右~朝上):重设玩家阴影y朝向偏移.
 *   QJ.LL.spsModel(value):重设玩家阴影模式.
 *   QJ.LL.spsYCut(value):重设玩家阴影的剪切.
 * ================================================================
 * 5.定时简易灯光
 *   QJ.LL.tempLight(lightId,during,x,y)在指定位置生成一个定时消失的灯光.
 *      lightId:简易灯光编号,指插件参数的 简易灯光数据 中设置的灯光.
 *      during:存在的时间，单位为帧，写-1时代表永远存在.
 *      x/y:显示的位置，单位为像素.
 * ================================================================
 *
 *
 *
 * ===============================================================================
 * 四.图块备注(在数据库-图块-备注中写的数据，可用于使用当前图块的地图)
 * ===============================================================================
 * 1.有时候我们感觉使用区域来制作实时阴影/遮盖有点麻烦，要大范围地设置墙壁，则需要为每一个绘制了相同图块的格子
 *   都再绘制一次区域.此时我们可以使用“地形”来简化此步骤。（Qiu Jiu Terraintag Shadow）
 *   在地图图块的备注中写<QJTS-1:value>或<QJTS-2:value>或……或<QJTS-7:value>（地形最大为7）
 *   则可以使这个地图图块的某个地形拥有id为value的区域的阴影效果。
 *   例如在插件参数的“区域阴影设置”中指定了区域255的数据，若在某个地图图块的备注中写<QJTS-1:255>，则可以使当前地图图块地形为
 *   1的图块有区域255的相关阴影效果.
 *   ***当一个地方既有地形所代指的区域效果，本身又设置了区域，则以区域为主***
 * ================================================================
 * 2.有时候我们要让一大片区域的每一格都生成灯光，若感觉使用区域比较麻烦，可使用<QJL-1:value>等指令让某个地形生成和id为
 *   value一样的区域生成的灯光相同的灯光.
 *   例如在插件参数的“简易灯光预设”中指定了区域100的数据，若在某个地图图块的备注中写<QJL-2:100>，则可以使当前地图图块地形为
 *   2的图块有区域100的灯光效果.
 *   ***当一个地方既有地形所代指的区域效果，本身又设置了区域，则以区域为主***
 * ================================================================
 *
 *
 *
 *
 * ===============================================================================
 * 五.使用
 * ===============================================================================
 * 此插件可免费用于您的任何非盈利游戏。
 * 但是这个插件对以任何方式获得经济利益的游戏是不免费的。
 * 您需要为您的商业游戏付费。
 * 您可以选择在itch.io上购买。
 * https://qiujiu.itch.io/qj-lighting
 * 或者从下列网页中获取我的联系方式进行购买。
 *
 * 
 *
 *
* @param lightPreset
 * @type struct<presetData>[]
 * @text 灯光预设数据
 * @desc 灯光预设数据
 * @default []
 *
 * @param miniLights
 * @type struct<miniLightsData>[]
 * @text 简易灯光预设数据
 * @desc 简易灯光预设数据.
 * @default []
 *
 * @param region
 * @type struct<regionData>[]
 * @text 区域阴影设置
 * @desc 设置区域的阴影效果.
 * @default []
 *
 * @param regionLights
 * @type struct<regionLightsData>[]
 * @text 区域灯光设置
 * @desc 区域灯光设置，在某区域上生成指定id的简易灯光
 * @default []
 *
 * @param characterShadowList
 * @type file[]
 * @dir img/lights
 * @text 事件阴影图片列表
 * @desc 事件阴影图片列表，要设置事件的特殊阴影时，必须在此写上文件名进行预加载.
 * @default []
 *
 * @param characterShadowDefault
 * @type struct<characterShadowDefaultDetail>
 * @text 事件阴影默认值
 * @desc 事件阴影默认值
 * @default {"status":"false","tint":"#000000","opacity":"1","offsetX":"0","offsetY":"0","offsetDirX":"0~0~0~0","offsetDirY":"0~0~0~0","model":"D[]","yCut":"0"}
 *
 * @param playerShadowDefault
 * @type struct<playerShadowDefaultDetail>
 * @text 玩家阴影默认值
 * @desc 玩家阴影默认值
 * @default {"status":"false","tint":"#000000","opacity":"1","offsetX":"0","offsetY":"0","offsetDirX":"0~0~0~0","offsetDirY":"0~0~0~0","model":"D[]","yCut":"0"}
 *
 * @param playerInitLight
 * @type text
 * @text 玩家初始灯光
 * @desc 玩家初始灯光
 * @default test
 *
 * @param maskInitColor
 * @type text
 * @text 背景初始颜色
 * @desc 背景初始颜色,建议的值为：特黑#191919 较黑#202020 一般#292929 较明#393939 明#555555 特明#666666
 * @default #292929
 *
 * @param hidePrimordialShadow
 * @type boolean
 * @text 隐藏系统原生阴影
 * @desc 隐藏系统原生阴影
 * @default true
 *
 * @param defaultOpen
 * @type boolean
 * @text 默认打开灯光效果
 * @desc 默认打开灯光效果
 * @default true
 *
 *
 *
 *
 *
*/
/*~struct~presetData:
 *
 * @param ======0
 *
 * @param id
 * @type text
 * @text 灯光编号
 * @desc 灯光编号
 * @default test
 *
 * @param ======1
 *
 * @param imgName
 * @type file
 * @dir img/lights
 * @text 灯光图像
 * @desc 灯光图像
 * @default circle
 *
 * @param ======2
 *
 * @param scaleX
 * @type text
 * @text x放大率*
 * @desc x放大率,1为标准大小.
 * @default 1
 *
 * @param scaleY
 * @type text
 * @text y放大率*
 * @desc y放大率,1为标准大小.
 * @default 1
 *
 * @param ======3
 *
 * @param tint
 * @type text
 * @text 附加颜色*
 * @desc 附加颜色.
 * @default #FFFFFF
 *
 * @param ======4
 *
 * @param offsetX
 * @type text
 * @text 基础X偏移*
 * @desc 基础X偏移.
 * @default 0
 *
 * @param offsetY
 * @type text
 * @text 基础y偏移*
 * @desc 基础y偏移.
 * @default 0
 *
 * @param dirOffsetX
 * @type text
 * @text 方向附加x偏移
 * @desc 方向附加x偏移,指定当当前光效绑定事件时,光效的位置随事件的朝向变化而变化.格式为 朝下时的x偏移~朝左~朝右~朝上.
 * @default 0~0~0~0
 *
 * @param dirOffsetY
 * @type text
 * @text 方向附加y偏移
 * @desc 方向附加y偏移,指定当当前光效绑定事件时,光效的位置随事件的朝向变化而变化.格式为 朝下时的y偏移~朝左~朝右~朝上.
 * @default 0~0~0~0
 *
 * @param ======5
 *
 * @param opacity
 * @type text
 * @text 不透明度*
 * @desc 不透明度,写0-1的数字.
 * @default 1
 *
 * @param ======6
 *
 * @param rotation
 * @type text
 * @text 角度*
 * @desc 角度,写0-360的数字.
 * @default 0
 *
 * @param dirRotation
 * @type text
 * @text 方向角度
 * @desc 指定光效的角度随事件的朝向变化而变化.格式为 朝下时的转角~朝左~朝右~朝上.例如:180~270~90~0
 * @default 0~0~0~0
 *
 * @param dirRotationFrame
 * @type text
 * @text 方向角改变速度
 * @desc 度每帧.在事件的朝向改变时，若dirRotation有对应的值，则动态变化dirRotation,建议写10
 * @default 0
 *
 * @param rotationAuto
 * @type text
 * @text 旋转速度
 * @desc 度每帧.旋转速度,在角度和方向角度的前提下,每帧为其增加一定的角度.
 * @default 0
 *
 * @param ======7
 *
 * @param shadowWall
 * @type boolean
 * @text 是否显示区域投影
 * @desc 是否显示区域投影
 * @default false
 *
 * @param ======8
 *
 * @param shadowCharacter
 * @type boolean
 * @text 是否显示事件投影
 * @desc 是否显示事件投影
 * @default false
 *
 * @param shadowCharacterOffsetX
 * @type text
 * @text 投影点x偏移
 * @desc 投影点x偏移
 * @default 0
 *
 * @param shadowCharacterOffsetY
 * @type text
 * @text 投影点y偏移
 * @desc 投影点y偏移
 * @default 0
 *
 * @param shadowCharacterMaxOpacity
 * @type text
 * @text 事件投影最大不透明度
 * @desc 事件投影最大不透明度
 * @default 0.6
 *
 * @param shadowCharacterMaxDistance
 * @type text
 * @text 事件投影最大半径
 * @desc 事件投影最大半径
 * @default 150
 *
 * @param shadowCharacterShakeX
 * @type select
 * @text 事件投影抖动
 * @desc 事件投影抖动的纵向抖动(实际为纵向放大率,可同标*的数据一样自由设计)
 * @default 1
 * @option 不抖动
 * @value 1
 * @option 轻微抖动
 * @value 40|1~5/1.01~5/1~10|1~5/1.01~5/1
 * @option 一般抖动
 * @value 40|1~5/1.02~5/1~10|1~5/1.02~5/1
 * @option 较强烈抖动
 * @value 40|1~5/1.03~5/1~10|1~5/1.03~5/1
 * @option 强烈抖动
 * @value 40|1~5/1.04~5/1~10|1~5/1.04~5/1
 *
 * @param ======9
 *
 * 
 *
*/
/*~struct~regionLightsData:
 *
 * @param ======0
 *
 * @param id
 * @type number
 * @min 1
 * @max 255
 * @text 区域id
 * @desc 区域id
 * @default 1
 *
 * @param lightId
 * @type text
 * @text 简易灯光id
 * @desc 简易灯光id
 * @default 1
 *
 * @param ======1
 *
 * @param showCondition
 * @type select
 * @text 显示条件
 * @desc 显示条件
 * @default 0
 * @option 一直显示
 * @value 0
 * @option 玩家身处此区域时显示
 * @value 1
 * @option 玩家身处此格时显示
 * @value 2
 *
 * @param showConditionExtra
 * @type note
 * @text 显示条件扩展
 * @desc 显示条件扩展,在此处写js代码来返回(return)决定是否显示的布尔值，使用ifShow获取上方“显示条件”的判定结果.
 * @default ""
 *
 *
 * @param ======2
 *
*/
/*~struct~miniLightsData:
 *
 * @param ======0
 *
 * @param id
 * @type text
 * @text 简易灯光id
 * @desc 简易灯光id
 * @default 1
 *
 * @param ======1
 *
 * @param imgName
 * @type file
 * @dir img/lights
 * @text 灯光图像
 * @desc 灯光图像
 * @default circle
 *
 * @param ======2
 *
 * @param scaleX
 * @type text
 * @text x放大率*
 * @desc x放大率,1为标准大小.
 * @default 1
 *
 * @param scaleY
 * @type text
 * @text y放大率*
 * @desc y放大率,1为标准大小.
 * @default 1
 *
 * @param ======3
 *
 * @param tint
 * @type text
 * @text 附加颜色*
 * @desc 附加颜色.
 * @default #FFFFFF
 *
 * @param ======4
 *
 * @param offsetX
 * @type text
 * @text 基础X偏移*
 * @desc 基础X偏移.
 * @default 0
 *
 * @param offsetY
 * @type text
 * @text 基础y偏移*
 * @desc 基础y偏移.
 * @default 0
 *
 * @param ======5
 *
 * @param opacity
 * @type text
 * @text 不透明度*
 * @desc 不透明度,写0-1的数字.
 * @default 1
 *
 * @param ======6
 *
 * @param rotation
 * @type text
 * @text 角度*
 * @desc 角度,写0-360的数字.
 * @default 0
 *
 * @param ======7
 *
 * 
 *
*/
/*~struct~regionData:
 *
 * @param ======0
 * @default 
 *
 * @param id
 * @type number
 * @min 1
 * @max 255
 * @text 区域id
 * @desc 区域id
 * @default 1
 *
 * @param ======1
 *
 * @param rectOpacity
 * @type text
 * @text 遮挡阴影不透明度
 * @desc 上方遮挡不透明度,范围是0-1之间的小数.
 * @default 1
 *
 * @param rectTint
 * @type text
 * @text 遮挡阴影特殊颜色
 * @desc 遮挡阴影特殊颜色,#000000会让此区块有黑色遮挡,#ffffff会让此区块完全明亮
 * @default #000000
 *
 * @param rectShape
 * @type select
 * @text 遮挡阴影形状
 * @desc 遮挡阴影的颜色,除了可以选择外,也可以进行手动输入,请根据范例的格式来写.(0直线1顺圆弧正2顺圆弧逆3逆圆弧正4逆圆弧逆5新开原点)
 * @default [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option 不遮挡
 * @value []
 * @option 正方形(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option 中心正方形1/2(24*24)
 * @value [{t:0,x:12,y:12},{t:0,x:36,y:12},{t:0,x:36,y:36},{t:0,x:12,y:36}]
 * @option 圆形(48*48)
 * @value [{t:1,x:24,y:0,r:24},{t:1,x:24,y:48,r:24}]
 * @option 中心圆形1/2(48*48)
 * @value [{t:1,x:24,y:12,r:12},{t:1,x:24,y:36,r:12}]
 * @option 左上方三角(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:0,y:48}]
 * @option 右上方三角(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48}]
 * @option 右下方三角(48*48)
 * @value [{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option 左下方三角(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option 左上方1/4圆(48*48)
 * @value [{t:0,x:0,y:0},{t:1,x:48,y:0,r:48},{t:0,x:0,y:48}]
 * @option 右上方1/4圆(48*48)
 * @value [{t:0,x:48,y:0},{t:1,x:48,y:48,r:48},{t:0,x:0,y:0}]
 * @option 右下方1/4圆(48*48)
 * @value [{t:0,x:48,y:48},{t:1,x:0,y:48,r:48},{t:0,x:48,y:0}]
 * @option 左下方1/4圆(48*48)
 * @value [{t:0,x:0,y:48},{t:1,x:0,y:0,r:48},{t:0,x:48,y:48}]
 * @option 左上方三角1/2(24*24)
 * @value [{t:0,x:0,y:0},{t:0,x:24,y:0},{t:0,x:0,y:24}]
 * @option 右上方三角1/2(24*24)
 * @value [{t:0,x:24,y:0},{t:0,x:48,y:0},{t:0,x:48,y:24}]
 * @option 右下方三角1/2(24*24)
 * @value [{t:0,x:48,y:24},{t:0,x:48,y:48},{t:0,x:24,y:48}]
 * @option 左下方三角1/2(24*24)
 * @value [{t:0,x:0,y:24},{t:0,x:24,y:48},{t:0,x:0,y:48}]
 * @option 左上方1/4圆1/2(24*24)
 * @value [{t:0,x:0,y:0},{t:1,x:24,y:0,r:24},{t:0,x:0,y:24}]
 * @option 右上方1/4圆1/2(24*24)
 * @value [{t:0,x:48,y:0},{t:1,x:48,y:24,r:24},{t:0,x:24,y:0}]
 * @option 右下方1/4圆1/2(24*24)
 * @value [{t:0,x:48,y:48},{t:1,x:24,y:48,r:24},{t:0,x:48,y:24}]
 * @option 左下方1/4圆1/2(24*24)
 * @value [{t:0,x:0,y:48},{t:1,x:0,y:24,r:24},{t:0,x:24,y:48}]
 * @option 左方1/2圆(24*48)
 * @value [{t:0,x:0,y:0},{t:3,x:0,y:48,r:24},{t:0,x:0,y:0}]
 * @option 上方1/2圆(48*24)
 * @value [{t:0,x:48,y:0},{t:3,x:0,y:0,r:24},{t:0,x:48,y:0}]
 * @option 右方1/2圆(24*48)
 * @value [{t:0,x:48,y:48},{t:3,x:48,y:0,r:24},{t:0,x:48,y:48}]
 * @option 下方1/2圆(48*24)
 * @value [{t:0,x:0,y:48},{t:3,x:48,y:48,r:24},{t:0,x:0,y:48}]
 *
 * @param ======2
 *
 * @param shadowShow
 * @type boolean
 * @text 实时阴影
 * @desc 是否产生实时阴影
 * @default false
 *
 * @param shadowHeight
 * @type number
 * @min 0
 * @max 8
 * @text 实时阴影高度
 * @desc 实时阴影显示的高度
 * @default 0
 *
 * @param shadowTint
 * @type text
 * @text 实时阴影颜色
 * @desc 实时阴影颜色。虽然预留了此参数，但是并不建议修改。
 * @default #000000
 *
 * @param ======3
 *
*/
/*~struct~characterShadowDefaultDetail:
 *
 * @param status
 * @type boolean
 * @text 是否默认显示
 * @desc 是否默认显示
 * @default false
 *
 * @param tint
 * @type text
 * @text 阴影色调
 * @desc 阴影色调，#000000为黑色，#ffffff为白色.
 * @default #000000
 *
 * @param opacity
 * @type text
 * @text 阴影不透明度
 * @desc 阴影不透明度
 * @default 1
 *
 * @param offsetX
 * @type number
 * @text 阴影底部的x偏移
 * @desc 阴影底部的x偏移
 * @default 0
 *
 * @param offsetY
 * @type number
 * @text 阴影底部的y偏移
 * @desc 阴影底部的y偏移
 * @default 0
 *
 * @param offsetDirX
 * @type text
 * @text 朝各个方向时阴影底部的x偏移
 * @desc 朝各个方向时阴影底部的x偏移
 * @default 0~0~0~0
 *
 * @param offsetDirY
 * @type text
 * @text 朝各个方向时阴影底部的y偏移
 * @desc 朝各个方向时阴影底部的y偏移
 * @default 0~0~0~0
 *
 * @param model
 * @type text
 * @text 投影模式
 * @desc 投影模式
 * @default D[]
 *
 * @param yCut
 * @type text
 * @text 截取与上浮
 * @desc 截取与上浮
 * @default 0
 *
*/
/*~struct~playerShadowDefaultDetail:
 *
 * @param status
 * @type boolean
 * @text 是否默认显示
 * @desc 是否默认显示
 * @default false
 *
 * @param imgName
 * @type file
 * @dir img/lights
 * @text 影子图像
 * @desc 影子图像，留空则使用玩家的当前行走图作为影子.
 * @default 
 *
 * @param tint
 * @type text
 * @text 阴影色调
 * @desc 阴影色调，#000000为黑色，#ffffff为白色.
 * @default #000000
 *
 * @param opacity
 * @type text
 * @text 阴影不透明度
 * @desc 阴影不透明度
 * @default 1
 *
 * @param offsetX
 * @type number
 * @text 阴影底部的x偏移
 * @desc 阴影底部的x偏移
 * @default 0
 *
 * @param offsetY
 * @type number
 * @text 阴影底部的y偏移
 * @desc 阴影底部的y偏移
 * @default 0
 *
 * @param offsetDirX
 * @type text
 * @text 朝各个方向时阴影底部的x偏移
 * @desc 朝各个方向时阴影底部的x偏移
 * @default 0~0~0~0
 *
 * @param offsetDirY
 * @type text
 * @text 朝各个方向时阴影底部的y偏移
 * @desc 朝各个方向时阴影底部的y偏移
 * @default 0~0~0~0
 *
 * @param model
 * @type text
 * @text 投影模式
 * @desc 投影模式
 * @default D[]
 *
 * @param yCut
 * @type text
 * @text 截取与上浮
 * @desc 截取与上浮
 * @default 0
 *
*/
//==========================================================
//
//==========================================================
var QJ=QJ||{};QJ['LL']=QJ['LL']||{};var Imported=Imported||{};Imported['QJLayerLight']=!![];QJ['LL']['globalText']=['PIXI版本过低，请更新。','设定的灯光图像未加载成功。图像名:\x20','指定事件的阴影时，需将阴影图片名写在插件参数的\x20事件阴影列表\x20中。\x0a没有做此操作的事件的阴影名，事件id和地图id分别为:','未设置此灯光。此灯光的id为：','未设置此区域灯光。此灯光的id为：','在区域上设置了显示简易灯光，但是没有此id的简易灯光。区域和简易灯光id为：','使用QJ.LL.tempLight生成临时灯光，但是指定的要生成的简易灯光并未设置，要设置的简易灯光id为：'];QJ['LL']['error']=_0x3dd1d4=>{throw new Error(_0x3dd1d4+'.');};if(Number(PIXI['VERSION'][0x0])<0x5){throw new Error(QJ['LL']['globalText'][0x0]);}function QJFrameLight(){this['initialize']['apply'](this,arguments);}function Game_QJLightLayer(){this['initialize']['apply'](this,arguments);}function Game_QJLightLayerMini(){this['initialize']['apply'](this,arguments);}(()=>{const _0x29ba9e='QJ-Lighting';const _0x5ae21f=PluginManager['parameters'](_0x29ba9e);const _0x788ec4=eval(_0x5ae21f['hidePrimordialShadow']);const _0x47f5c6=[];const _0x3f28dd=JsonEx['parse'](_0x5ae21f['characterShadowDefault']);const _0x12e669=JsonEx['parse'](_0x5ae21f['playerShadowDefault']);const _0x215a31={};const _0x520de={};const _0x46f92c={};const _0x57a96f={};const _0x4001fd={};const _0x1b404c={};const _0x2312b4=0x30;const _0x3d546b=0x60;let _0x3d3f63=0x0,_0x203009=0x0,_0xe82237=0x0,_0x350de2=0x0,_0x323d75=0x0,_0x27a17b=0x0,_0x1ff651=0x0,_0x1897ac=0x0;ImageManager['loadLightQJLL']=function(_0x2e32cd,_0x4695ce){let _0xb9fdd8=this['loadBitmap']('img/lights/',_0x2e32cd,0x0,![]);_0xb9fdd8['_name']=_0x2e32cd;return _0xb9fdd8;};QJ['LL']['calculateAngleByTwoPoint']=function(_0x391e3f,_0x569bb3,_0x1b3263,_0x195285){let _0x2fd287;if(_0x1b3263>_0x391e3f&&_0x195285<_0x569bb3)_0x2fd287=-Math['atan']((_0x391e3f-_0x1b3263)/(_0x569bb3-_0x195285));if(_0x1b3263>_0x391e3f&&_0x195285>_0x569bb3)_0x2fd287=Math['PI']-Math['atan']((_0x391e3f-_0x1b3263)/(_0x569bb3-_0x195285));if(_0x1b3263<_0x391e3f&&_0x195285>_0x569bb3)_0x2fd287=Math['PI']-Math['atan']((_0x391e3f-_0x1b3263)/(_0x569bb3-_0x195285));if(_0x1b3263<_0x391e3f&&_0x195285<_0x569bb3)_0x2fd287=0x2*Math['PI']-Math['atan']((_0x391e3f-_0x1b3263)/(_0x569bb3-_0x195285));if(_0x1b3263==_0x391e3f&&_0x195285>_0x569bb3)_0x2fd287=Math['PI'];if(_0x1b3263==_0x391e3f&&_0x195285<_0x569bb3)_0x2fd287=0x0;if(_0x1b3263>_0x391e3f&&_0x195285==_0x569bb3)_0x2fd287=Math['PI']/0x2;if(_0x1b3263<_0x391e3f&&_0x195285==_0x569bb3)_0x2fd287=Math['PI']*0x3/0x2;if(_0x1b3263==_0x391e3f&&_0x195285==_0x569bb3)_0x2fd287=null;return _0x2fd287;};QJ['LL']['calculateShape']=function(_0x56a916){if(!_0x56a916||_0x56a916['length']==0x0)return[];for(let _0x160d90=0x0,_0x4e132f=_0x56a916['length'],_0x5b9eda,_0x41fc89,_0x4efcf9,_0x366f43,_0x264fe6,_0x1a7db1,_0x3a2d82,_0x6a825a,_0x548bf2,_0x26fe3f,_0x3c82a1,_0x4088a3,_0x210c0e,_0x4f1424=_0x56a916[0x0]['x'],_0x11ae01=_0x56a916[0x0]['y'];_0x160d90<_0x4e132f;_0x160d90++){if(_0x56a916[_0x160d90]['t']==0x0)continue;else if(_0x56a916[_0x160d90]['t']==0x5){_0x4f1424=_0x56a916[_0x160d90]['x'];_0x11ae01=_0x56a916[_0x160d90]['y'];continue;}_0x366f43=_0x56a916[_0x160d90]['x'];_0x264fe6=_0x56a916[_0x160d90]['y'];_0x1a7db1=_0x56a916[_0x160d90+0x1]?_0x56a916[_0x160d90+0x1]['x']:_0x4f1424;_0x3a2d82=_0x56a916[_0x160d90+0x1]?_0x56a916[_0x160d90+0x1]['y']:_0x11ae01;_0x6a825a=_0x366f43-_0x1a7db1;_0x548bf2=_0x264fe6-_0x3a2d82;_0x4efcf9=_0x56a916[_0x160d90]['r'];_0x5b9eda=(_0x366f43+_0x1a7db1)/0x2;_0x41fc89=(_0x264fe6+_0x3a2d82)/0x2;_0x4088a3=Math['sqrt'](_0x6a825a*_0x6a825a+_0x548bf2*_0x548bf2);_0x210c0e=Math['sqrt'](_0x4efcf9*_0x4efcf9-_0x4088a3*_0x4088a3/0x4);if(_0x56a916[_0x160d90]['t']==0x1){_0x56a916[_0x160d90]['cx']=_0x5b9eda+_0x210c0e*(_0x548bf2/_0x4088a3||0x0);_0x56a916[_0x160d90]['cy']=_0x41fc89-_0x210c0e*(_0x6a825a/_0x4088a3||0x0);_0x56a916[_0x160d90]['ccw']=![];}else if(_0x56a916[_0x160d90]['t']==0x2){_0x56a916[_0x160d90]['cx']=_0x5b9eda+_0x210c0e*(_0x548bf2/_0x4088a3||0x0);_0x56a916[_0x160d90]['cy']=_0x41fc89-_0x210c0e*(_0x6a825a/_0x4088a3||0x0);_0x56a916[_0x160d90]['ccw']=![];}else if(_0x56a916[_0x160d90]['t']==0x3){_0x56a916[_0x160d90]['cx']=_0x5b9eda-_0x210c0e*(_0x548bf2/_0x4088a3||0x0);_0x56a916[_0x160d90]['cy']=_0x41fc89+_0x210c0e*(_0x6a825a/_0x4088a3||0x0);_0x56a916[_0x160d90]['ccw']=!![];}else if(_0x56a916[_0x160d90]['t']==0x4){_0x56a916[_0x160d90]['cx']=_0x5b9eda-_0x210c0e*(_0x548bf2/_0x4088a3||0x0);_0x56a916[_0x160d90]['cy']=_0x41fc89+_0x210c0e*(_0x6a825a/_0x4088a3||0x0);_0x56a916[_0x160d90]['ccw']=!![];}_0x56a916[_0x160d90]['cx']=Math['round'](_0x56a916[_0x160d90]['cx']);_0x56a916[_0x160d90]['cy']=Math['round'](_0x56a916[_0x160d90]['cy']);_0x56a916[_0x160d90]['sa']=QJ['LL']['calculateAngleByTwoPoint'](_0x56a916[_0x160d90]['cx'],_0x56a916[_0x160d90]['cy'],_0x366f43,_0x264fe6)-Math['PI']/0x2;_0x56a916[_0x160d90]['ea']=QJ['LL']['calculateAngleByTwoPoint'](_0x56a916[_0x160d90]['cx'],_0x56a916[_0x160d90]['cy'],_0x1a7db1,_0x3a2d82)-Math['PI']/0x2;}return _0x56a916;};QJ['LL']['calculateDirAttribute']=function(_0x428299,_0x527315,_0x5de3ce){try{let _0x3434ae=_0x428299[_0x527315]['split']('~');_0x428299[_0x527315]=[0x0,0x0,Number(_0x3434ae[0x0])*(_0x5de3ce?Math['PI']/0xb4:0x1),0x0,Number(_0x3434ae[0x1])*(_0x5de3ce?Math['PI']/0xb4:0x1),0x0,Number(_0x3434ae[0x2])*(_0x5de3ce?Math['PI']/0xb4:0x1),0x0,Number(_0x3434ae[0x3])*(_0x5de3ce?Math['PI']/0xb4:0x1),0x0];}catch(_0x39de64){QJ['LL']['error'](_0x527315+'\x20can\x20not\x20be\x20'+_0x428299[_0x527315]);}};QJ['LL']['getCSModel']=function(_0x317bbb){if(_0x317bbb[0x0]=='D'){if(_0x317bbb[0x1]=='['){return[0x0,0x0];}else if(_0x317bbb[0x1]=='M'){return[0x0,0x1,Number(_0x317bbb['match'](/DM\[([^\]]+)\]/)[0x1])];}else if(_0x317bbb[0x1]=='W'){return[0x0,0x2,Number(_0x317bbb['match'](/DW\[([^\]]+)\]/)[0x1])];}}else if(_0x317bbb[0x0]=='B'){if(_0x317bbb[0x1]=='['){return[0x1,0x0];}else if(_0x317bbb[0x1]=='M'){return[0x1,0x1,Number(_0x317bbb['match'](/BM\[([^\]]+)\]/)[0x1])];}else if(_0x317bbb[0x1]=='W'){return[0x1,0x2,Number(_0x317bbb['match'](/BW\[([^\]]+)\]/)[0x1])];}}return[0x0,0x0];};(()=>{let _0x2f34fa;_0x3f28dd['status']=eval(_0x3f28dd['status']);_0x3f28dd['opacity']=Number(_0x3f28dd['opacity']);_0x3f28dd['offsetX']=Number(_0x3f28dd['offsetX']);_0x3f28dd['offsetY']=Number(_0x3f28dd['offsetY']);_0x3f28dd['yCut']=Number(_0x3f28dd['yCut']);_0x12e669['status']=eval(_0x12e669['status']);_0x12e669['opacity']=Number(_0x12e669['opacity']);_0x12e669['offsetX']=Number(_0x12e669['offsetX']);_0x12e669['offsetY']=Number(_0x12e669['offsetY']);_0x12e669['yCut']=Number(_0x12e669['yCut']);QJ['LL']['calculateDirAttribute'](_0x12e669,'offsetDirX');QJ['LL']['calculateDirAttribute'](_0x12e669,'offsetDirY');_0x12e669['model']=QJ['LL']['getCSModel'](_0x12e669['model']);let _0x53d246=eval(_0x5ae21f['region']);for(let _0xee8e50 of _0x53d246){_0x2f34fa=JsonEx['parse'](_0xee8e50);_0x2f34fa['id']=Number(_0x2f34fa['id']);_0x2f34fa['rectOpacity']=Number(_0x2f34fa['rectOpacity']);_0x2f34fa['rectTint']=_0x2f34fa['rectTint'];_0x2f34fa['rectShape']=QJ['LL']['calculateShape'](eval(_0x2f34fa['rectShape']));_0x2f34fa['shadowShow']=eval(_0x2f34fa['shadowShow']);_0x2f34fa['shadowOpacity']=0x1;_0x2f34fa['shadowTint']=Number('0x'+_0x2f34fa['shadowTint']['substr'](0x1));_0x2f34fa['shadowHeight']=Number(_0x2f34fa['shadowHeight']);_0x4001fd[_0x2f34fa['id']]=_0x2f34fa;}let _0x431b86=eval(_0x5ae21f['lightPreset']);for(let _0x3d200d of _0x431b86){_0x2f34fa=JsonEx['parse'](_0x3d200d);_0x2f34fa['character']=null;_0x2f34fa['anchorX']=0.5;_0x2f34fa['anchorY']=0.5;QJ['LL']['calculateDirAttribute'](_0x2f34fa,'dirOffsetX');QJ['LL']['calculateDirAttribute'](_0x2f34fa,'dirOffsetY');QJ['LL']['calculateDirAttribute'](_0x2f34fa,'dirRotation',!![]);_0x1b404c[_0x2f34fa['imgName']]=ImageManager['loadLightQJLL'](_0x2f34fa['imgName']);_0x2f34fa['dirRotationFrame']=Number(_0x2f34fa['dirRotationFrame']);_0x2f34fa['rotationAuto']=Number(_0x2f34fa['rotationAuto'])*Math['PI']/0xb4;_0x2f34fa['shadowCharacter']=eval(_0x2f34fa['shadowCharacter']);_0x2f34fa['shadowWall']=eval(_0x2f34fa['shadowWall']);_0x2f34fa['shadowCharacterOffsetX']=Number(_0x2f34fa['shadowCharacterOffsetX']);_0x2f34fa['shadowCharacterOffsetY']=Number(_0x2f34fa['shadowCharacterOffsetY']);_0x2f34fa['shadowCharacterMaxOpacity']=Number(_0x2f34fa['shadowCharacterMaxOpacity']);_0x2f34fa['shadowCharacterMaxDistance']=Number(_0x2f34fa['shadowCharacterMaxDistance']);_0x520de[_0x2f34fa['id']]=_0x2f34fa;}_0x431b86=eval(_0x5ae21f['miniLights']);for(let _0x1ee837 of _0x431b86){_0x2f34fa=JsonEx['parse'](_0x1ee837);_0x1b404c[_0x2f34fa['imgName']]=ImageManager['loadLightQJLL'](_0x2f34fa['imgName']);_0x2f34fa['anchorX']=0.5;_0x2f34fa['anchorY']=0.5;_0x2f34fa['during']=-0x1;_0x46f92c[_0x2f34fa['id']]=_0x2f34fa;}_0x431b86=eval(_0x5ae21f['regionLights']);for(let _0x1ff085 of _0x431b86){_0x2f34fa=JsonEx['parse'](_0x1ff085);if(_0x46f92c[_0x2f34fa['lightId']]){_0x57a96f[Number(_0x2f34fa['id'])]=JsonEx['makeDeepCopy'](_0x46f92c[_0x2f34fa['lightId']]);_0x57a96f[Number(_0x2f34fa['id'])]['showCondition']=Number(_0x2f34fa['showCondition']);_0x57a96f[Number(_0x2f34fa['id'])]['showConditionExtra']=_0x2f34fa['showConditionExtra']['length']>0x2?eval('(function(ifShow){'+eval(_0x2f34fa['showConditionExtra'])+'})'):null;}else{QJ['LL']['error'](QJ['LL']['globalText'][0x5]+id+'\x20'+_0x2f34fa['lightId']);}}for(let _0x3ac0e2 of _0x47f5c6){_0x215a31[_0x3ac0e2]=ImageManager['loadLightQJLL'](_0x3ac0e2);}})();if(_0x788ec4){Tilemap['prototype']['_addShadow']=function(_0x2532da,_0x561a1f,_0xa6897e,_0x2326e1){};}const _0x7c0c40=DataManager['isDatabaseLoaded'];DataManager['isDatabaseLoaded']=function(){if(!_0x7c0c40['call'](this))return![];for(let _0x434dd4 in _0x1b404c){if(!_0x1b404c[_0x434dd4])QJ['LL']['error'](QJ['LL']['globalText'][0x1]+_0x434dd4);if(_0x1b404c[_0x434dd4]['copyTexture'])continue;if(_0x1b404c[_0x434dd4]['isReady']())QJ['LL']['addTexture'](_0x434dd4,_0x1b404c[_0x434dd4]);else return![];}QJ['LL']['addMaskTexture']('#000000',_0x1ff651,_0x1897ac);for(let _0x36ce5b in _0x215a31){if(_0x215a31[_0x36ce5b]['copyTexture'])continue;if(_0x215a31[_0x36ce5b]['isReady']())QJ['LL']['addShadowTexture'](_0x36ce5b,_0x215a31[_0x36ce5b]);else return![];}return!![];};QJ['LL']['generateMultiTextureShader']=function(){let _0x194172='\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x20\x20\x20\x20\x20\x20\x20\x20attribute\x20vec2\x20aVertexPosition;\x0a\x20\x20\x20\x20\x20\x20\x20\x20attribute\x20vec2\x20aTextureCoord;\x0a\x20\x20\x20\x20\x20\x20\x20\x20attribute\x20vec4\x20aColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20attribute\x20float\x20aTextureId;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mat3\x20projectionMatrix;\x0a\x20\x20\x20\x20\x20\x20\x20\x20varying\x20vec2\x20vTextureCoord;\x0a\x20\x20\x20\x20\x20\x20\x20\x20varying\x20vec4\x20vColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20varying\x20float\x20vTextureId;\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(void){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position\x20=\x20vec4((projectionMatrix\x20*\x20vec3(aVertexPosition,\x201.0)).xy,\x200.0,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vTextureCoord\x20=\x20aTextureCoord;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vTextureId\x20=\x20aTextureId;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vColor\x20=\x20aColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20';let _0x14a794='\x0a\x20\x20\x20\x20\x20\x20\x20\x20varying\x20vec2\x20vTextureCoord;\x0a\x20\x20\x20\x20\x20\x20\x20\x20varying\x20vec4\x20vColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20varying\x20float\x20vTextureId;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20uSamplers[2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20sRSin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20sRCos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20sROffsetX;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20sROffsetY;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20sRScaleX;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20sRScaleY;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20sRScaleX2;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20sRScaleY2;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20frameX;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20frameY;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20frameW;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20frameH;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20startX;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20startY;\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(void){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(vTextureCoord.x<startX||vTextureCoord.y<startY||vTextureCoord.x>1.0-startX||vTextureCoord.y>1.0-startY)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_FragColor\x20=\x20vec4(0,0,0,0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20else\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20color0\x20=\x20texture2D(uSamplers[0],vec2(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20(vTextureCoord.x-startX)/(1.0-2.0*startX)/frameW+frameX,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20(vTextureCoord.y-startY)/(1.0-2.0*startY)/frameH+frameY));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20color1\x20=\x20texture2D(uSamplers[1],vec2(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20(vTextureCoord.x*sRCos*sRScaleX-vTextureCoord.y*sRSin*sRScaleY)*sRScaleX2+sROffsetX,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20(vTextureCoord.y*sRCos*sRScaleY+vTextureCoord.x*sRSin*sRScaleX)*sRScaleY2+sROffsetY));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_FragColor\x20=\x20color0\x20*\x20color1\x20*\x20vColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20';return new PIXI['Shader']['from'](_0x194172,_0x14a794,{'uSamplers':[0x0,0x1],'projectionMatrix':new PIXI['Matrix'](),'sRSin':0x0,'sRCos':0x0,'sROffsetX':0x0,'sROffsetY':0x0,'sRScaleX':0x0,'sRScaleY':0x0,'sRScaleX2':0x0,'sRScaleY2':0x0,'frameX':0x0,'frameY':0x0,'frameW':0x0,'frameH':0x0,'startX':0x0,'startY':0x0});};QJ['LL']['addShadowTexture']=function(_0x5e5270,_0x429c83){let _0x26f5b4=document['createElement']('canvas');let _0x34a9ba=_0x26f5b4['getContext']('2d');let _0x1e0346=null;let _0x4c6d34=_0x429c83['width'],_0x8a2721=_0x429c83['height'];_0x26f5b4['width']=_0x4c6d34;_0x26f5b4['height']=_0x8a2721;_0x1e0346=new PIXI['BaseTexture'](_0x26f5b4);_0x1e0346['scaleMode']=PIXI['SCALE_MODES']['LINEAR'];_0x1e0346['width']=_0x4c6d34;_0x1e0346['height']=_0x8a2721;_0x34a9ba['globalCompositeOperation']='source-over';_0x34a9ba['drawImage'](_0x429c83['_canvas']?_0x429c83['_canvas']:_0x429c83['_image'],0x0,0x0,_0x4c6d34,_0x8a2721,0x0,0x0,_0x4c6d34,_0x8a2721);_0x1e0346['update']();_0x1e0346['copyTexture']=!![];_0x215a31[_0x5e5270]=_0x1e0346;};QJ['LL']['addTexture']=function(_0x3da03b,_0x466130){let _0x35fd92=document['createElement']('canvas');let _0x4970e7=_0x35fd92['getContext']('2d');let _0x39cb40=null;let _0x40dd29=_0x466130['width'],_0x30f1c8=_0x466130['height'];_0x35fd92['width']=_0x40dd29;_0x35fd92['height']=_0x30f1c8;_0x39cb40=new PIXI['BaseTexture'](_0x35fd92);_0x39cb40['scaleMode']=PIXI['SCALE_MODES']['LINEAR'];_0x39cb40['width']=_0x40dd29;_0x39cb40['height']=_0x30f1c8;_0x4970e7['globalCompositeOperation']='source-over';_0x4970e7['drawImage'](_0x466130['_canvas']?_0x466130['_canvas']:_0x466130['_image'],0x0,0x0,_0x40dd29,_0x30f1c8,0x0,0x0,_0x40dd29,_0x30f1c8);_0x39cb40['update']();_0x39cb40['copyTexture']=!![];_0x1b404c[_0x3da03b]=_0x39cb40;};QJ['LL']['addMaskTexture']=function(_0x3b8730,_0xcf12eb,_0x2787ae){let _0x53a21e=document['createElement']('canvas');let _0x27708b=_0x53a21e['getContext']('2d');let _0x44e6be=null;_0x53a21e['width']=_0xcf12eb;_0x53a21e['height']=_0x2787ae;_0x44e6be=new PIXI['BaseTexture'](_0x53a21e);_0x44e6be['scaleMode']=PIXI['SCALE_MODES']['LINEAR'];_0x44e6be['width']=_0xcf12eb;_0x44e6be['height']=_0x2787ae;_0x27708b['fillStyle']=_0x3b8730;_0x27708b['fillRect'](0x0,0x0,_0xcf12eb,_0x2787ae);_0x44e6be['update']();_0x44e6be['copyTexture']=!![];_0x1b404c['___']=_0x44e6be;};QJ['LL']['findSprite']=function(_0xf7fcf0){if(!SceneManager['_scene'])return null;if(!SceneManager['_scene']['_spriteset'])return null;for(let _0x50314c of SceneManager['_scene']['_spriteset']['_characterSprites']){if(_0x50314c['_character']==_0xf7fcf0)return _0x50314c;}return null;};QJ['LL']['getCharacter']=function(_0x3f7b3e){if(_0x3f7b3e==-0x1)return $gamePlayer;else return $gameMap['event'](_0x3f7b3e);};QJ['LL']['calculateAnnotation']=function(_0xac52b4){let _0x59d0dd=null,_0x4c3df3='';try{_0x59d0dd=_0xac52b4['page']();}catch(_0x13873f){_0x59d0dd=null;}if(_0x59d0dd){if(_0x59d0dd['list'][0x0]['code']===0x6c){let _0x30a14d=0x0;while(_0x59d0dd['list'][_0x30a14d]['code']===0x198||_0x59d0dd['list'][_0x30a14d]['code']===0x6c){_0x4c3df3=_0x4c3df3+_0x59d0dd['list'][_0x30a14d]['parameters'][0x0];_0x30a14d++;}}}return _0x4c3df3;};QJ['LL']['getLLData']=function(_0x5aa6ae,_0x3b6427){if(_0x3b6427['length']<=0x0)return'';let _0xb7293f=_0x3b6427['match'](/<QJLL:[^>]*>/i);return _0xb7293f?_0xb7293f[0x0]['substr'](0x6,_0xb7293f[0x0]['length']-0x7):'';};QJ['LL']['getLLDataDetail']=function(_0x260a68,_0x35fe93){for(let _0x5749c5=0x0,_0x2e426c=_0x35fe93['match'](/<QJLL-[^:]*:[^>]*>/ig)||[],_0xd433a3=_0x2e426c['length'],_0x59c11b;_0x5749c5<_0xd433a3;_0x5749c5++){_0x59c11b=_0x2e426c[_0x5749c5]['match'](/<QJLL-([^:]*):([^>]*)>/i);_0x260a68[_0x59c11b[0x1]]=_0x59c11b[0x2];if(_0x59c11b[0x1]=='dirOffsetX')QJ['LL']['calculateDirAttribute'](_0x260a68,'dirOffsetX');else if(_0x59c11b[0x1]=='dirOffsetY')QJ['LL']['calculateDirAttribute'](_0x260a68,'dirOffsetY');else if(_0x59c11b[0x1]=='dirRotation')QJ['LL']['calculateDirAttribute'](_0x260a68,'dirRotation',!![]);else if(_0x59c11b[0x1]=='dirRotationFrame')_0x260a68['dirRotationFrame']=Number(_0x260a68['dirRotationFrame']);else if(_0x59c11b[0x1]=='rotationAuto')_0x260a68['rotationAuto']=Number(_0x260a68['rotationAuto'])*Math['PI']/0xb4;else if(_0x59c11b[0x1]=='shadowCharacter')_0x260a68['shadowCharacter']=eval(_0x260a68['shadowCharacter']);else if(_0x59c11b[0x1]=='shadowWall')_0x260a68['shadowWall']=eval(_0x260a68['shadowWall']);else if(_0x59c11b[0x1]=='shadowCharacterMaxOpacity')_0x260a68['shadowCharacterMaxOpacity']=Number(_0x260a68['shadowCharacterMaxOpacity']);else if(_0x59c11b[0x1]=='shadowCharacterMaxDistance')_0x260a68['shadowCharacterMaxDistance']=Number(_0x260a68['shadowCharacterMaxDistance']);}};QJ['LL']['getCSData']=function(_0x487c80,_0x22efbd){let _0x179d86=JsonEx['makeDeepCopy'](_0x3f28dd);_0x179d86['imgName']='';for(let _0x286a42=0x0,_0x418df7=_0x22efbd['match'](/<QJCS-[^:]*:[^>]*>/ig)||[],_0x1501ec=_0x418df7['length'],_0x2062e9;_0x286a42<_0x1501ec;_0x286a42++){_0x2062e9=_0x418df7[_0x286a42]['match'](/<QJCS-([^:]*):([^>]*)>/i);_0x179d86[_0x2062e9[0x1]]=_0x2062e9[0x2];}_0x179d86['model']=QJ['LL']['getCSModel'](_0x179d86['model']);QJ['LL']['calculateDirAttribute'](_0x179d86,'offsetDirX');QJ['LL']['calculateDirAttribute'](_0x179d86,'offsetDirY');_0x179d86['offsetX']=Number(_0x179d86['offsetX']);_0x179d86['offsetY']=Number(_0x179d86['offsetY']);_0x179d86['opacity']=Number(_0x179d86['opacity']);_0x179d86['status']=eval(_0x179d86['status']);_0x179d86['tint']=Number('0x'+_0x179d86['tint']['substr'](0x1));_0x179d86['yCut']=Number(_0x179d86['yCut']);return _0x179d86;};QJ['LL']['preset']=function(_0x23ab26,_0x423006){if(!_0x520de[_0x23ab26]){QJ['LL']['error'](QJ['LL']['globalText'][0x3]+_0x23ab26);}let _0x3ea02b=JsonEx['makeDeepCopy'](_0x520de[_0x23ab26]);if(_0x423006)QJ['LL']['getLLDataDetail'](_0x3ea02b,_0x423006['annotation']);_0x3ea02b['scaleX']=new QJFrameLight('scaleX',_0x3ea02b['scaleX'],0x0);_0x3ea02b['scaleY']=new QJFrameLight('scaleY',_0x3ea02b['scaleY'],0x0);_0x3ea02b['tint']=new QJFrameLight('tint',_0x3ea02b['tint'],0x1);_0x3ea02b['offsetX']=new QJFrameLight('offsetX',_0x3ea02b['offsetX'],0x0);_0x3ea02b['offsetY']=new QJFrameLight('offsetY',_0x3ea02b['offsetY'],0x0);_0x3ea02b['opacity']=new QJFrameLight('opacity',_0x3ea02b['opacity'],0x0);_0x3ea02b['shadowCharacterOffsetX']=new QJFrameLight('shadowCharacterOffsetX',_0x3ea02b['shadowCharacterOffsetX'],0x0);_0x3ea02b['shadowCharacterOffsetY']=new QJFrameLight('shadowCharacterOffsetY',_0x3ea02b['shadowCharacterOffsetY'],0x0);_0x3ea02b['rotation']=new QJFrameLight('rotation',_0x3ea02b['rotation'],0x2);_0x3ea02b['shadowCharacterShakeX']=new QJFrameLight('shadowCharacterShakeX',_0x3ea02b['shadowCharacterShakeX'],0x0);return _0x3ea02b;};QJ['LL']['hexToRgb']=function(_0x46acbe){let _0x3945e3=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i['exec'](_0x46acbe);return{'r':parseInt(_0x3945e3[0x1],0x10),'g':parseInt(_0x3945e3[0x2],0x10),'b':parseInt(_0x3945e3[0x3],0x10)};};QJ['LL']['rgbToHex']=function(_0xc631ff){let _0xe07441=_0xc631ff['r']['toString'](0x10),_0x4b8987=_0xc631ff['g']['toString'](0x10),_0x157903=_0xc631ff['b']['toString'](0x10);return'#'+(_0xe07441['length']==0x1?'0'+_0xe07441:_0xe07441)+(_0x4b8987['length']==0x1?'0'+_0x4b8987:_0x4b8987)+(_0x157903['length']==0x1?'0'+_0x157903:_0x157903);};QJ['LL']['dealRegionLights']=function(_0x5770b4){if(!_0x57a96f[_0x5770b4]){QJ['LL']['error'](QJ['LL']['globalText'][0x4]+_0x5770b4);}let _0x560323=JsonEx['makeDeepCopy'](_0x57a96f[_0x5770b4]);_0x560323['scaleX']=new QJFrameLight('scaleX',_0x560323['scaleX'],0x0);_0x560323['scaleY']=new QJFrameLight('scaleY',_0x560323['scaleY'],0x0);_0x560323['tint']=new QJFrameLight('tint',_0x560323['tint'],0x1);_0x560323['offsetX']=new QJFrameLight('offsetX',_0x560323['offsetX'],0x0);_0x560323['offsetY']=new QJFrameLight('offsetY',_0x560323['offsetY'],0x0);_0x560323['opacity']=new QJFrameLight('opacity',_0x560323['opacity'],0x0);_0x560323['rotation']=new QJFrameLight('rotation',_0x560323['rotation'],0x2);return _0x560323;};QJ['LL']['dealMiniLights']=function(_0x4afcfe){if(!_0x46f92c[_0x4afcfe]){QJ['LL']['error'](QJ['LL']['globalText'][0x6]+_0x4afcfe);}let _0x288882=JsonEx['makeDeepCopy'](_0x46f92c[_0x4afcfe]);_0x288882['scaleX']=new QJFrameLight('scaleX',_0x288882['scaleX'],0x0);_0x288882['scaleY']=new QJFrameLight('scaleY',_0x288882['scaleY'],0x0);_0x288882['tint']=new QJFrameLight('tint',_0x288882['tint'],0x1);_0x288882['offsetX']=new QJFrameLight('offsetX',_0x288882['offsetX'],0x0);_0x288882['offsetY']=new QJFrameLight('offsetY',_0x288882['offsetY'],0x0);_0x288882['opacity']=new QJFrameLight('opacity',_0x288882['opacity'],0x0);_0x288882['rotation']=new QJFrameLight('rotation',_0x288882['rotation'],0x2);return _0x288882;};QJ['LL']['open']=function(){$gameSystem['showLights']=!![];};QJ['LL']['close']=function(){$gameSystem['showLights']=![];};QJ['LL']['tint']=function(_0x3ac8d1,_0x5d6f84){if(_0x3ac8d1==0x0){$gameSystem['lightStaticChange']=[0x0,null,_0x5d6f84];}else{$gameSystem['lightStaticChange']=[_0x3ac8d1,new QJFrameLight('___','0|'+$gameSystem['lightStaticChange'][0x2]+'~'+_0x3ac8d1+'/'+_0x5d6f84,0x1),_0x5d6f84];}};QJ['LL']['splHide']=function(){if($gameSystem['playerLight'])$gameSystem['playerLight']['visible']=![];};QJ['LL']['splShow']=function(){if($gameSystem['playerLight'])$gameSystem['playerLight']['visible']=!![];};QJ['LL']['spl']=function(_0x27025b){if(!_0x27025b){$gameSystem['playerLight']=null;delete $gameSystem['eventLights'][-0x1];}else{if($gameSystem['playerLight']){if(SceneManager['_scene'])SceneManager['_scene']['_spriteset']['removeTargetLight'](-0x1);$gameSystem['playerLight']['setDead']();}$gameSystem['playerLight']=new Game_QJLightLayer(-0x1,QJ['LL']['preset'](_0x27025b));$gameSystem['eventLights'][-0x1]=$gameSystem['playerLight'];if(SceneManager['_scene'])SceneManager['_scene']['_spriteset']['addQJLight']($gameSystem['playerLight']);}};QJ['LL']['splScaleX']=function(_0x12a363){if($gameSystem['playerLight'])$gameSystem['playerLight']['initData']['scaleX']=new QJFrameLight('scaleX',_0x12a363,0x0);};QJ['LL']['splScaleY']=function(_0xe1ffd8){if($gameSystem['playerLight'])$gameSystem['playerLight']['initData']['scaleY']=new QJFrameLight('scaleY',_0xe1ffd8,0x0);};QJ['LL']['splTint']=function(_0x435f93){if($gameSystem['playerLight'])$gameSystem['playerLight']['initData']['tint']=new QJFrameLight('tint',_0x435f93,0x1);};QJ['LL']['splOffsetX']=function(_0x1500fd){if($gameSystem['playerLight'])$gameSystem['playerLight']['initData']['offsetX']=new QJFrameLight('offsetX',_0x1500fd,0x0);};QJ['LL']['splOffsetY']=function(_0x3ffa06){if($gameSystem['playerLight'])$gameSystem['playerLight']['initData']['offsetY']=new QJFrameLight('offsetY',_0x3ffa06,0x0);};QJ['LL']['splDirOffsetX']=function(_0x335c45){if($gameSystem['playerLight']){$gameSystem['playerLight']['initData']['offsetDirX']=_0x335c45;QJ['LL']['calculateDirAttribute']($gameSystem['playerLight']['initData'],'offsetDirX');}};QJ['LL']['splDirOffsetY']=function(_0x381b10){if($gameSystem['playerLight']){$gameSystem['playerLight']['initData']['offsetDirY']=_0x381b10;QJ['LL']['calculateDirAttribute']($gameSystem['playerLight']['initData'],'offsetDirY');}};QJ['LL']['splOpacity']=function(_0x37d768){if($gameSystem['playerLight'])$gameSystem['playerLight']['initData']['opacity']=new QJFrameLight('opacity',_0x37d768,0x0);};QJ['LL']['splRotation']=function(_0x159fc0){if($gameSystem['playerLight'])$gameSystem['playerLight']['initData']['opacity']=new QJFrameLight('opacity',_0x159fc0,0x2);};QJ['LL']['splDirRotation']=function(_0x5d050e){if($gameSystem['playerLight']){$gameSystem['playerLight']['initData']['dirRotation']=_0x5d050e;QJ['LL']['calculateDirAttribute']($gameSystem['playerLight']['initData'],'dirRotation',!![]);}};QJ['LL']['spsStatus']=function(_0x5ae2cd){$gamePlayer['QJSC']['status']=_0x5ae2cd;if($gameMap){$gameMap['characterShadowList'][-0x1]=_0x5ae2cd;$gamePlayer['refreshFollowersShadow']();}};QJ['LL']['spsImgName']=function(_0x545d63){$gamePlayer['QJSC']['imgName']=_0x545d63;$gamePlayer['textureForShadowNeedRefresh']=!![];};QJ['LL']['spsTint']=function(_0x4b017a){$gamePlayer['QJSC']['tint']=_0x4b017a;};QJ['LL']['spsOpacity']=function(_0x523f89){$gamePlayer['QJSC']['opacity']=_0x523f89;};QJ['LL']['spsOffsetX']=function(_0x3912d0){$gamePlayer['QJSC']['offsetX']=_0x3912d0;};QJ['LL']['spsOffsetY']=function(_0x424bcb){$gamePlayer['QJSC']['offsetY']=_0x424bcb;};QJ['LL']['spsOffsetDirX']=function(_0x1e691c){$gamePlayer['QJSC']['offsetDirX']=_0x1e691c;QJ['LL']['calculateDirAttribute']($gamePlayer['QJSC'],'offsetDirX');};QJ['LL']['spsOffsetDirY']=function(_0x28efbc){$gamePlayer['QJSC']['offsetDirY']=_0x28efbc;QJ['LL']['calculateDirAttribute']($gamePlayer['QJSC'],'offsetDirY');};QJ['LL']['spsModel']=function(_0x4e2eba){$gamePlayer['QJSC']['model']=QJ['LL']['getCSModel'](_0x4e2eba);};QJ['LL']['spsYCut']=function(_0x3c47a0){$gamePlayer['QJSC']['yCut']=_0x3c47a0;};QJ['LL']['tempLight']=function(_0x27c331,_0x1386dd,_0x50e444,_0x56d097){let _0x1a83f2=QJ['LL']['dealMiniLights'](_0x27c331);_0x1a83f2['during']=Math['max'](0x0,_0x1386dd);let _0x53fe6d=new Game_QJLightLayerMini({'type':0x0,'x':_0x50e444+_0xe82237+_0x3d546b/0x2,'y':_0x56d097+_0x350de2+_0x3d546b/0x2},_0x1a83f2,$gameSystem['miniLights']['length']);$gameSystem['miniLights']['push'](_0x53fe6d);if(SceneManager['_scene']){SceneManager['_scene']['_spriteset']['addQJMiniLight'](_0x53fe6d);}};QJ['LL']['tempLightObject']=function(_0x385f21,_0x403ba1,_0x262e07){let _0x261e1b=QJ['LL']['dealMiniLights'](_0x385f21),_0xaed0c4={'type':0x2,'object':_0x403ba1};_0x261e1b['during']=-0x1;for(let _0x5bf92a in _0x262e07)_0xaed0c4[_0x5bf92a]=_0x262e07[_0x5bf92a];let _0x1179da=new Game_QJLightLayerMini(_0xaed0c4,_0x261e1b,$gameSystem['miniLights']['length']);$gameSystem['miniLights']['push'](_0x1179da);if(SceneManager['_scene']){SceneManager['_scene']['_spriteset']['addQJMiniLight'](_0x1179da);}};const _0x819d2a=Scene_Map['prototype']['updateMain'];Scene_Map['prototype']['updateMain']=function(){_0x819d2a['call'](this);_0x3d3f63=$gameMap['displayX']();_0x203009=$gameMap['displayY']();_0xe82237=Math['floor'](_0x3d3f63*0x30-_0x3d546b/0x2);_0x350de2=Math['floor'](_0x203009*0x30-_0x3d546b/0x2);if($gameSystem['showLights']){for(let _0x23d8f4 in $gameSystem['eventLights']){$gameSystem['eventLights'][_0x23d8f4]['update']();}let _0x5073cc=$gameSystem['miniLights'];for(let _0x12fe05 of _0x5073cc){if(_0x12fe05)_0x12fe05['update']();}}};Game_System['prototype']['showLights']=eval(_0x5ae21f['defaultOpen']);Game_System['prototype']['lightStaticChange']=[0x0,null,_0x5ae21f['maskInitColor']];Game_System['prototype']['playerLight']=null;Game_System['prototype']['eventLights']={};Game_System['prototype']['miniLights']=[];const _0x31ca13=Game_Map['prototype']['setup'];Game_Map['prototype']['setup']=function(_0x312a82){_0x323d75=Graphics['width'];_0x27a17b=Graphics['height'];_0x1ff651=Math['floor'](_0x323d75+_0x3d546b);_0x1897ac=Math['floor'](_0x27a17b+_0x3d546b);$gameSystem['eventLights']={};if($gameSystem['playerLight'])$gameSystem['eventLights'][-0x1]=$gameSystem['playerLight'];$gameSystem['miniLights']=[];this['characterShadowList']={};this['characterShadowList'][-0x1]=$gamePlayer['QJSC']['status'];$gamePlayer['refreshFollowersShadow']();_0x31ca13['call'](this,_0x312a82);let _0xab2021=$dataTilesets[this['_tilesetId']]['meta'];this['terrainTagToRegion']=[0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0];for(let _0x36bda=0x1,_0x32210c;_0x36bda<0x8;_0x36bda++){if(_0xab2021['QJTS-'+_0x36bda]){_0x32210c=Number(_0xab2021['QJTS-'+_0x36bda]);if(_0x4001fd[_0x32210c]){this['terrainTagToRegion'][_0x36bda]=_0x32210c;}}}this['terrainTagToRegionLights']=[0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0];for(let _0x195aae=0x1,_0x400d4d;_0x195aae<0x8;_0x195aae++){if(_0xab2021['QJL-'+_0x195aae]){_0x400d4d=Number(_0xab2021['QJL-'+_0x195aae]);if(_0x57a96f[_0x400d4d]){this['terrainTagToRegionLights'][_0x195aae]=_0x400d4d;}}}this['shadowDataQJLL']=new Array(this['width']());for(let _0x41f266=0x0,_0x2e385e=this['width'](),_0x52f88e,_0x515753=this['height'](),_0x20cad9,_0x19f277,_0x34f700,_0x4989b4;_0x41f266<_0x2e385e;_0x41f266++){this['shadowDataQJLL'][_0x41f266]=new Array(this['height']());for(_0x52f88e=0x0;_0x52f88e<_0x515753;_0x52f88e++){_0x20cad9=this['regionIdForLight'](_0x41f266,_0x52f88e);if(_0x57a96f[_0x20cad9]){$gameSystem['miniLights']['push'](new Game_QJLightLayerMini({'type':0x1,'regionId':_0x20cad9,'x':_0x41f266*0x30+0x18,'y':_0x52f88e*0x30+0x18,'mapX':_0x41f266,'mapY':_0x52f88e},QJ['LL']['dealRegionLights'](_0x20cad9),$gameSystem['miniLights']['length']));}_0x20cad9=this['regionIdForShadow'](_0x41f266,_0x52f88e);if(_0x4001fd[_0x20cad9]){_0x4989b4=_0x4001fd[_0x20cad9]['shadowHeight'];for(_0x34f700=0x1;_0x34f700<=_0x4001fd[_0x20cad9]['shadowHeight'];_0x34f700++){_0x19f277=this['regionIdForShadow'](_0x41f266,_0x52f88e+_0x34f700);if(_0x4001fd[_0x19f277]){_0x4989b4=_0x34f700-0x1;break;}}for(_0x34f700=0x0;_0x34f700<=_0x4989b4;_0x34f700++){this['shadowDataQJLL'][_0x41f266][_0x52f88e+_0x34f700]=_0x52f88e+_0x4989b4;}_0x52f88e+=_0x4989b4;}else this['shadowDataQJLL'][_0x41f266][_0x52f88e]=-0x1;}}if($gamePlayer['playerLight'])$gamePlayer['playerLight']['update']();};Game_Map['prototype']['regionIdForShadow']=function(_0x14a03c,_0x25c59c){let _0x7d4bb7=this['regionId'](_0x14a03c,_0x25c59c),_0x28fa78;if(!_0x4001fd[_0x7d4bb7]&&this['terrainTagToRegion']){_0x28fa78=this['terrainTag'](_0x14a03c,_0x25c59c);if(this['terrainTagToRegion'][_0x28fa78]>0x0){_0x7d4bb7=this['terrainTagToRegion'][_0x28fa78];}}return _0x7d4bb7;};Game_Map['prototype']['regionIdForLight']=function(_0x495d3c,_0x1bb2d9){let _0x476915=this['regionId'](_0x495d3c,_0x1bb2d9),_0x5634c6;if(!_0x57a96f[_0x476915]&&this['terrainTagToRegionLights']){_0x5634c6=this['terrainTag'](_0x495d3c,_0x1bb2d9);if(this['terrainTagToRegionLights'][_0x5634c6]>0x0){_0x476915=this['terrainTagToRegionLights'][_0x5634c6];}}return _0x476915;};const _0x48252f=Game_Player['prototype']['initMembers'];Game_Player['prototype']['initMembers']=function(){_0x48252f['call'](this);$gameSystem['playerLight']=!_0x5ae21f['playerInitLight']?null:new Game_QJLightLayer(-0x1,QJ['LL']['preset'](_0x5ae21f['playerInitLight']));this['QJSC']=JsonEx['makeDeepCopy'](_0x12e669);for(let _0x4ef894 of this['_followers']['_data']){_0x4ef894['QJSC']=this['QJSC'];}this['textureForShadowNeedRefresh']=!![];this['reSetX']=0x0;this['reSetY']=0x0;this['remRegionId']=0x0;};Game_Player['prototype']['refreshFollowersShadow']=function(){for(let _0x3e4a60=0x0,_0x5b587c=this['_followers']['_data']['length'],_0x5796b0=this['_followers']['_visible']&&$gamePlayer['QJSC']['status'];_0x3e4a60<_0x5b587c;_0x3e4a60++){$gameMap['characterShadowList'][-(_0x3e4a60+0x2)]=_0x5796b0;}};const _0x567508=Game_Player['prototype']['showFollowers'];Game_Player['prototype']['showFollowers']=function(){_0x567508['call'](this);this['refreshFollowersShadow']();};const _0x56c42f=Game_Player['prototype']['hideFollowers'];Game_Player['prototype']['hideFollowers']=function(){_0x56c42f['call'](this);this['refreshFollowersShadow']();};const _0x4feb6e=Game_Player['prototype']['update'];Game_Player['prototype']['update']=function(_0x204b7e){_0x4feb6e['call'](this,_0x204b7e);this['reSetX']=Math['floor'](this['_realX']+0.5);this['reSetY']=Math['floor'](this['_realY']+0.5);this['remRegionId']=$gameMap['regionId'](this['reSetX'],this['reSetY']);};const _0x363f3d=Game_Event['prototype']['setupPage'];Game_Event['prototype']['setupPage']=function(){_0x363f3d['call'](this);if($gameSystem['eventLights'][this['_eventId']]){$gameSystem['eventLights'][this['_eventId']]['setDead']();if(SceneManager['_scene']){SceneManager['_scene']['_spriteset']['removeTargetLight'](this['_eventId']);}}this['annotation']=QJ['LL']['calculateAnnotation'](this);let _0x2b35c3=QJ['LL']['getLLData'](this,this['annotation']);if(_0x2b35c3){let _0x20a00c=new Game_QJLightLayer(this['_eventId'],QJ['LL']['preset'](_0x2b35c3,this));$gameSystem['eventLights'][this['_eventId']]=_0x20a00c;if(SceneManager['_scene']['_spriteset'])SceneManager['_scene']['_spriteset']['addQJLight'](_0x20a00c);}this['QJSC']=QJ['LL']['getCSData'](this,this['annotation']);$gameMap['characterShadowList'][this['_eventId']]=this['QJSC']['status'];this['textureForShadowNeedRefresh']=!![];};let _0x22aa45={};const _0x1c83a2=Spriteset_Base['prototype']['initialize'];Spriteset_Base['prototype']['initialize']=function(){_0x22aa45={};_0x1c83a2['call'](this);};const _0x4a3d5a=Spriteset_Map['prototype']['createUpperLayer'];Spriteset_Map['prototype']['createUpperLayer']=function(){_0x4a3d5a['call'](this);this['lightSystemSprite']=new _0x281e02(this);this['addChild'](this['lightSystemSprite']);this['lightCharacterShadowContainer']=new _0x14fc79(this['lightSystemSprite']);this['_tilemap']['addChildAt'](this['lightCharacterShadowContainer'],0x0);};Spriteset_Map['prototype']['addQJLight']=function(_0x1101e3){return this['lightSystemSprite']['addQJLight'](_0x1101e3);};Spriteset_Map['prototype']['addQJMiniLight']=function(_0x85bec5){return this['lightSystemSprite']['addQJMiniLight'](_0x85bec5);};Spriteset_Map['prototype']['removeTargetLight']=function(_0x2bfd12){return this['lightSystemSprite']['removeTargetLight'](_0x2bfd12);};const _0x425476=Sprite_Character['prototype']['setCharacter'];Sprite_Character['prototype']['setCharacter']=function(_0xb31dbb){_0x425476['call'](this,_0xb31dbb);this['refreshTextureForShadow']();if(_0xb31dbb['_eventId'])_0x22aa45[_0xb31dbb['_eventId']]=this;else if(_0xb31dbb==$gamePlayer)_0x22aa45[-0x1]=this;else{for(let _0x36e34b=$gamePlayer['_followers']['_data'],_0x35b968=0x0,_0x52f870=_0x36e34b['length'];_0x35b968<_0x52f870;_0x35b968++){if(_0xb31dbb==_0x36e34b[_0x35b968])_0x22aa45[-(_0x35b968+0x2)]=this;}}};const _0x4f49ea=Sprite_Character['prototype']['update'];Sprite_Character['prototype']['update']=function(){_0x4f49ea['call'](this);if(this['_character']['textureForShadowNeedRefresh']){this['refreshTextureForShadow']();}if(this['textureLLSpecial']&&this['textureLLSpecial']['dirMode']){let _0x278aa1=this['textureLLSpecial']['frame']['height']*(this['_character']['direction']()/0x2-0x1);if(this['textureLLSpecial']['frame']['y']!=_0x278aa1){this['textureLLSpecial']['frame']['y']=_0x278aa1;this['textureLLSpecial']['frame']=this['textureLLSpecial']['frame'];}}};Sprite_Character['prototype']['refreshTextureForShadow']=function(){this['_character']['textureForShadowNeedRefresh']=![];let _0x2e4c42=this['_character']['QJSC'];if(!_0x2e4c42)return;if(!_0x2e4c42['imgName']){this['textureLLSpecial']=null;}else{if(!_0x215a31[_0x2e4c42['imgName']]){QJ['LL']['error'](QJ['LL']['globalText'][0x2]+_0x2e4c42['imgName']+'\x20'+this['_eventId']+'\x20'+$gameMap['mapId']());}else{let _0x36bcba=_0x215a31[_0x2e4c42['imgName']];this['textureLLSpecial']=new PIXI['Texture'](_0x36bcba);if(_0x2e4c42['imgName'][0x0]=='$'){this['textureLLSpecial']['dirMode']=!![];this['textureLLSpecial']['frame']=new PIXI['Rectangle'](0x0,0x0,0x0,0x0);this['textureLLSpecial']['frame']['height']=_0x36bcba['height']/0x4;this['textureLLSpecial']['frame']['width']=_0x36bcba['width'];this['textureLLSpecial']['frame']['x']=0x0;this['textureLLSpecial']['frame']['y']=this['textureLLSpecial']['frame']['height']*(this['_character']['direction']()/0x2-0x1);this['textureLLSpecial']['frame']=this['textureLLSpecial']['frame'];}else{this['textureLLSpecial']['dirMode']=![];}}}};const _0x25e938=Sprite_Character['prototype']['setTileBitmap'];Sprite_Character['prototype']['setTileBitmap']=function(){_0x25e938['call'](this);if(this['bitmap'])this['bitmap']['addLoadListener'](_0x27dc56=>this['transfromTextureLL'](_0x27dc56));else this['textureLL']=null;};const _0x18296c=Sprite_Character['prototype']['setCharacterBitmap'];Sprite_Character['prototype']['setCharacterBitmap']=function(){_0x18296c['call'](this);if(this['bitmap'])this['bitmap']['addLoadListener'](_0x46cb16=>this['transfromTextureLL'](_0x46cb16));else this['textureLL']=null;};Sprite_Character['prototype']['transfromTextureLL']=function(_0x33116f){_0x33116f=_0x33116f?_0x33116f:this['bitmap'];if(_0x33116f&&_0x33116f['_image']){let _0x174717=_0x33116f['_image'];let _0x149b17=document['createElement']('canvas');let _0xc450d4=_0x174717['width'],_0x4cb623=_0x174717['height'];_0x149b17['width']=_0xc450d4;_0x149b17['height']=_0x4cb623;let _0x3a2519=_0x149b17['getContext']('2d');_0x3a2519['drawImage'](_0x174717,0x0,0x0,_0xc450d4,_0x4cb623,0x0,0x0,_0xc450d4,_0x4cb623);this['textureLL']=new PIXI['Texture'](new PIXI['BaseTexture'](_0x149b17));}else this['textureLL']=null;};function _0x14b14a(){this['initialize']['apply'](this,arguments);}_0x14b14a['prototype']=Object['create'](PIXI['Container']['prototype']);_0x14b14a['prototype']['constructor']=_0x14b14a;_0x14b14a['prototype']['initialize']=function(){PIXI['Container']['call'](this);};_0x14b14a['prototype']['update']=function(){this['children']['forEach'](function(_0xeaf216){if(_0xeaf216['update']){_0xeaf216['update']();}});};function _0x3a18d7(){this['initialize']['apply'](this,arguments);}_0x3a18d7['prototype']=Object['create'](PIXI['Filter']['prototype']);_0x3a18d7['prototype']['constructor']=_0x3a18d7;_0x3a18d7['prototype']['initialize']=function(){let _0x322db7='\x0a\x20\x20\x20\x20attribute\x20vec2\x20aVertexPosition;\x0a\x20\x20\x20\x20attribute\x20vec2\x20aTextureCoord;\x0a\x20\x20\x20\x20varying\x20vec2\x20vTextureCoord;\x0a\x20\x20\x20\x20uniform\x20mat3\x20projectionMatrix;\x0a\x20\x20\x20\x20void\x20main(void){\x0a\x20\x20\x20\x20\x20\x20\x20\x20gl_Position\x20=\x20vec4((projectionMatrix\x20*\x20vec3(aVertexPosition,\x201.0)).xy,\x200.0,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vTextureCoord\x20=\x20aTextureCoord\x20;\x0a\x20\x20\x20\x20}';let _0x59d24b='\x0a\x20\x20\x20\x20varying\x20vec2\x20vTextureCoord;\x0a\x20\x20\x20\x20uniform\x20sampler2D\x20uSampler;\x0a\x20\x20\x20\x20uniform\x20vec4\x20backgroundColor;\x0a\x20\x20\x20\x20void\x20main(void){\x0a\x20\x20\x20\x20\x20\x20\x20vec4\x20sample\x20=\x20texture2D(uSampler,\x20vTextureCoord);\x0a\x20\x20\x20\x20\x20\x20\x20gl_FragColor\x20=\x20sample\x20+\x20backgroundColor;\x0a\x20\x20\x20\x20}';PIXI['Filter']['call'](this,_0x322db7,_0x59d24b,{'backgroundColor':[0x0,0x0,0x0,0x0]});};_0x3a18d7['prototype']['setBackgroundColor']=function(_0x16d749,_0x223ae1,_0x13f2fa,_0x3cd9ce){this['uniforms']['backgroundColor'][0x0]=_0x16d749*_0x3cd9ce;this['uniforms']['backgroundColor'][0x1]=_0x223ae1*_0x3cd9ce;this['uniforms']['backgroundColor'][0x2]=_0x13f2fa*_0x3cd9ce;this['uniforms']['backgroundColor'][0x3]=_0x3cd9ce;};function _0x281e02(){this['initialize']['apply'](this,arguments);}_0x281e02['prototype']=Object['create'](PIXI['Sprite']['prototype']);_0x281e02['prototype']['constructor']=_0x281e02;_0x281e02['prototype']['initialize']=function(_0x4473e1){this['spriteset']=_0x4473e1;this['mw']=$gameMap['width']()*0x30+_0x3d546b;this['mh']=$gameMap['height']()*0x30+_0x3d546b;this['oldFilterColor']=null;this['whiteVisible']=![];PIXI['Sprite']['call'](this);this['x']=-_0x3d546b/0x2;this['y']=-_0x3d546b/0x2;this['filterMask']=new _0x3a18d7();this['filterMask']['blendMode']=0x2;this['filters']=[this['filterMask']];this['filterArea']=new Rectangle(0x0,0x0,_0x1ff651,_0x1897ac);this['updateFilterColor']();this['miniLightsContainer']=new PIXI['Container']();this['addChild'](this['miniLightsContainer']);let _0x3d444d,_0x4a0fe2,_0x119389=null;_0x3d444d=document['createElement']('canvas');_0x4a0fe2=_0x3d444d['getContext']('2d');_0x3d444d['width']=this['mw'];_0x3d444d['height']=this['mh'];_0x119389=new PIXI['BaseTexture'](_0x3d444d);_0x119389['scaleMode']=PIXI['SCALE_MODES']['LINEAR'];_0x119389['width']=this['mw'];_0x119389['height']=this['mh'];this['blockContext']=_0x4a0fe2;this['blocklsBaseTexture']=_0x119389;this['blockTexture']=new PIXI['Texture'](_0x119389);this['blockSprite']=new PIXI['Sprite'](this['blockTexture']);this['blockSprite']['blendMode']=0x2;this['setBlock'](this['blockContext'],this['blocklsBaseTexture']);this['updateBlocklsTextureFrame']();this['addChild'](this['blockSprite']);for(let _0x9fe111 in $gameSystem['eventLights']){this['addQJLight']($gameSystem['eventLights'][_0x9fe111]);}for(let _0x1e1685 of $gameSystem['miniLights']){if(_0x1e1685)this['addQJMiniLight'](_0x1e1685);}};_0x281e02['prototype']['updateBlocklsTextureFrame']=function(){let _0x42d384=(_0xe82237+0x0)['clamp'](0x0,this['mw']),_0x33959d=(_0x350de2+0x0)['clamp'](0x0,this['mh']);let _0x1c3643=(_0x1ff651-_0x42d384+_0xe82237)['clamp'](0x0,this['mw']-_0x42d384);let _0x161fee=(_0x1897ac-_0x33959d+_0x350de2)['clamp'](0x0,this['mh']-_0x33959d);this['blockTexture']['frame']['x']=_0x42d384;this['blockTexture']['frame']['y']=_0x33959d;this['blockTexture']['frame']['width']=_0x1c3643;this['blockTexture']['frame']['height']=_0x161fee;this['blockSprite']['pivot']['x']=_0xe82237-_0x42d384;this['blockSprite']['pivot']['y']=_0x350de2-_0x33959d;this['blockTexture']['frame']=this['blockTexture']['frame'];};_0x281e02['prototype']['addQJLight']=function(_0x43b307){let _0x33d6d2=new _0xf856f8(this,_0x43b307);this['addChildAt'](_0x33d6d2,0x0);return _0x33d6d2;};_0x281e02['prototype']['addQJMiniLight']=function(_0x5bbd59){let _0x29ef08=new _0x2ef350(this,_0x5bbd59);this['miniLightsContainer']['addChild'](_0x29ef08);return _0x29ef08;};_0x281e02['prototype']['removeTargetLight']=function(_0x13363d){for(let _0x35ddec of this['children']){if(_0x35ddec['character']==_0x13363d){_0x35ddec['setDead']();break;}}};_0x281e02['prototype']['refreshFilter']=function(_0x47bf89){let _0x41545c=parseInt(_0x47bf89['substr'](0x1,0x2),0x10)/0xff;let _0x97e50e=parseInt(_0x47bf89['substr'](0x3,0x2),0x10)/0xff;let _0x989de3=parseInt(_0x47bf89['substr'](0x5,0x2),0x10)/0xff;this['oldFilterColor']=_0x47bf89;if(!this['whiteVisible']){if(this['oldFilterColor']!='#ffffff'){this['whiteVisible']=!![];}}else{if(this['oldFilterColor']=='#ffffff'){this['whiteVisible']=![];}}this['filterMask']['setBackgroundColor'](_0x41545c,_0x97e50e,_0x989de3,0x1);};_0x281e02['prototype']['updateFilterColor']=function(){if($gameSystem['lightStaticChange'][0x0]>0x0){if(!$gameSystem['lightStaticChange'][0x1]){$gameSystem['lightStaticChange'][0x0]=0x0;$gameSystem['lightStaticChange'][0x1]=null;if(this['oldFilterColor']!=$gameSystem['lightStaticChange'][0x2]){this['refreshFilter']($gameSystem['lightStaticChange'][0x2]);}}else{$gameSystem['lightStaticChange'][0x0]--;let _0x112f41=$gameSystem['lightStaticChange'][0x1]['get']();if(this['oldFilterColor']!=_0x112f41){this['refreshFilter'](_0x112f41);}if($gameSystem['lightStaticChange'][0x0]==0x0)$gameSystem['lightStaticChange'][0x1]=null;}}else{if(this['oldFilterColor']!=$gameSystem['lightStaticChange'][0x2]){this['refreshFilter']($gameSystem['lightStaticChange'][0x2]);}}};_0x281e02['prototype']['update']=function(){this['updateFilterColor']();this['visible']=$gameSystem['showLights']&&this['whiteVisible'];if(this['visible']){this['children']['forEach'](_0x477efe=>{if(_0x477efe['update'])_0x477efe['update']();});this['miniLightsContainer']['children']['forEach'](_0x57351c=>{if(_0x57351c['update'])_0x57351c['update']();});this['updateBlocklsTextureFrame']();}};_0x281e02['prototype']['setBlock']=function(_0x558258,_0x287a94){let _0xc63232,_0x36b2b0,_0x138373,_0x5ce7dc,_0x3acf28,_0x1d9c7c;for(let _0x3b0fdc=0x0,_0x3287ce=$gameMap['width']();_0x3b0fdc<_0x3287ce;_0x3b0fdc++){for(let _0x235cde=0x0,_0x5ea68d=$gameMap['height']();_0x235cde<_0x5ea68d;_0x235cde++){_0xc63232=$gameMap['regionIdForShadow'](_0x3b0fdc,_0x235cde);if(_0x4001fd[_0xc63232]&&_0x4001fd[_0xc63232]['rectShape']['length']>0x0){_0x5ce7dc=_0x3b0fdc*0x30;_0x3acf28=_0x235cde*0x30;_0x36b2b0=_0x4001fd[_0xc63232]['rectShape'];_0x558258['save']();_0x558258['fillStyle']=_0x4001fd[_0xc63232]['rectTint'];_0x558258['globalAlpha']=_0x4001fd[_0xc63232]['rectOpacity'];_0x558258['translate'](_0x5ce7dc,_0x3acf28);for(let _0x319312=0x0,_0x2d92c5=0x0,_0x4e4045=_0x36b2b0['length'],_0x81f9f=_0x36b2b0[0x0]['x'],_0x45ea56=_0x36b2b0[0x0]['y'],_0x452d8e,_0x558d3d;_0x319312<_0x4e4045;_0x319312++){if(_0x2d92c5==0x0){_0x558258['beginPath']();_0x558258['moveTo'](_0x81f9f,_0x45ea56);}_0x138373=_0x36b2b0[_0x319312]['t'];_0x2d92c5++;_0x452d8e=_0x36b2b0[_0x319312+0x1]?_0x36b2b0[_0x319312+0x1]['x']:_0x81f9f;_0x558d3d=_0x36b2b0[_0x319312+0x1]?_0x36b2b0[_0x319312+0x1]['y']:_0x45ea56;if(_0x138373==0x0){_0x558258['lineTo'](_0x452d8e,_0x558d3d);}else if(_0x138373==0x5){_0x558258['closePath']();_0x558258['fill']();if(!_0x36b2b0[_0x319312+0x1])break;_0x81f9f=_0x36b2b0[_0x319312+0x1]['x'];_0x45ea56=_0x36b2b0[_0x319312+0x1]['y'];_0x2d92c5=0x0;continue;}else{_0x558258['arc'](_0x36b2b0[_0x319312]['cx'],_0x36b2b0[_0x319312]['cy'],_0x36b2b0[_0x319312]['r'],_0x36b2b0[_0x319312]['sa'],_0x36b2b0[_0x319312]['ea'],_0x36b2b0[_0x319312]['ccw']);}if(_0x319312==_0x4e4045-0x1){_0x558258['closePath']();_0x558258['fill']();}}_0x558258['restore']();}}}_0x287a94['update']();};Game_QJLightLayer['prototype']['initialize']=function(_0x10c75c,_0x43d5b8){this['character']=_0x10c75c;this['dead']=![];this['shadowWall']=_0x43d5b8['shadowWall'];this['shadowCharacter']=_0x43d5b8['shadowCharacter'];this['visible']=!![];this['x']=0x0;this['y']=0x0;this['scaleX']=0x1;this['scaleY']=0x1;this['opacity']=0x1;this['rotation']=0x0;this['rotationAuto']=0x0;this['tint']='#FFFFFF';this['initData']=_0x43d5b8;this['dirRotationFrame']=[0x0,0x0,0x0,0x0];this['shadowCharacterShakeX']=0x1;this['dialogLength']=0x0;this['needRefreshFrame']=![];this['lightSpriteFrame']=[0x0,0x0,0x1,0x1];let _0x1d0c6b=_0x1b404c[_0x43d5b8['imgName']];this['bimtapWidth']=_0x1d0c6b['width'];this['bimtapHeight']=_0x1d0c6b['height'];if(_0x43d5b8['imgName']['includes']('$')){this['lightSpriteFrame'][0x3]=0x4;this['dirImgFrame']=!![];}else this['lightSpriteFrame'][0x3]=0x1;let _0x33d4e2=_0x43d5b8['imgName']['match'](/\[([^,]+)\,([^]+)\]/i);if(_0x33d4e2){this['dramaticBitmap']=[0x0,Number(_0x33d4e2[0x2]),0x0,Number(_0x33d4e2[0x1])];this['lightSpriteFrame'][0x2]=this['dramaticBitmap'][0x3];}else this['lightSpriteFrame'][0x2]=0x1;this['dialogLength']=Math['floor'](Math['sqrt'](this['bimtapWidth']*this['bimtapWidth']/this['lightSpriteFrame'][0x2]/this['lightSpriteFrame'][0x2]+this['bimtapHeight']*this['bimtapHeight']/this['lightSpriteFrame'][0x3]/this['lightSpriteFrame'][0x3]));this['startX']=(0x1-this['bimtapWidth']/this['lightSpriteFrame'][0x2]/this['dialogLength'])/0x2;this['startY']=(0x1-this['bimtapHeight']/this['lightSpriteFrame'][0x3]/this['dialogLength'])/0x2;this['update']();};Game_QJLightLayer['prototype']['updateFrame']=function(_0x2830ad){if(!this['dirImgFrame']&&!this['dramaticBitmap'])return;let _0x2fd5f7=0x0,_0x5247e0=0x0;if(this['dirImgFrame'])_0x5247e0=(_0x2830ad['direction']()/0x2-0x1)/0x4;else _0x5247e0=0x0;if(this['dramaticBitmap']){this['dramaticBitmap'][0x0]++;if(this['dramaticBitmap'][0x0]>=this['dramaticBitmap'][0x1]){this['dramaticBitmap'][0x0]=0x0;this['dramaticBitmap'][0x2]++;if(this['dramaticBitmap'][0x2]>=this['dramaticBitmap'][0x3]){this['dramaticBitmap'][0x2]=0x0;}}_0x2fd5f7=this['dramaticBitmap'][0x2]/this['dramaticBitmap'][0x3];}else _0x2fd5f7=0x0;if(_0x2fd5f7!=this['lightSpriteFrame'][0x0]||_0x5247e0!=this['lightSpriteFrame'][0x1]){this['needRefreshFrame']=!![];this['lightSpriteFrame'][0x0]=_0x2fd5f7;this['lightSpriteFrame'][0x1]=_0x5247e0;}};Game_QJLightLayer['prototype']['update']=function(){let _0x12e9e8=QJ['LL']['getCharacter'](this['character']);if(!_0x12e9e8){this['setDead']();return;}let _0x1422a8=this['initData'];this['updateFrame'](_0x12e9e8);this['rotationAuto']+=_0x1422a8['rotationAuto'];let _0x42b5be=_0x12e9e8['direction']();this['x']=_0x12e9e8['_realX']*_0x2312b4+_0x1422a8['offsetX']['get']()+_0x1422a8['dirOffsetX'][_0x42b5be];this['y']=_0x12e9e8['_realY']*_0x2312b4+_0x1422a8['offsetY']['get']()+_0x1422a8['dirOffsetY'][_0x42b5be];this['scaleX']=_0x1422a8['scaleX']['get']();this['scaleY']=_0x1422a8['scaleY']['get']();this['opacity']=_0x1422a8['opacity']['get']();this['rotation']=_0x1422a8['rotation']['get']()+this['rotationAuto'];this['shadowCharacterOffsetX']=_0x1422a8['shadowCharacterOffsetX']['get']();this['shadowCharacterOffsetY']=_0x1422a8['shadowCharacterOffsetY']['get']();if(this['dirRotationFrame'][0x3]!=_0x1422a8['dirRotation'][_0x42b5be]){if(_0x1422a8['dirRotationFrame']>0x0){this['dirRotationFrame'][0x0]=_0x1422a8['dirRotationFrame'];let _0x1659f6=_0x1422a8['dirRotation'][_0x42b5be]-this['dirRotationFrame'][0x3];if(Math['abs'](_0x1659f6)>Math['PI']){this['dirRotationFrame'][0x1]=-Math['sign'](_0x1659f6)*(Math['abs'](_0x1659f6)-Math['PI'])/_0x1422a8['dirRotationFrame'];}else{this['dirRotationFrame'][0x1]=_0x1659f6/_0x1422a8['dirRotationFrame'];}this['dirRotationFrame'][0x2]=this['dirRotationFrame'][0x3];this['dirRotationFrame'][0x3]=_0x1422a8['dirRotation'][_0x42b5be];}else{this['dirRotationFrame'][0x0]=0x0;this['dirRotationFrame'][0x3]=_0x1422a8['dirRotation'][_0x42b5be];}}if(this['dirRotationFrame'][0x0]==0x0){this['rotation']+=this['dirRotationFrame'][0x3];}else{this['dirRotationFrame'][0x2]+=this['dirRotationFrame'][0x1];this['dirRotationFrame'][0x0]--;this['rotation']+=this['dirRotationFrame'][0x2];}this['tint']=_0x1422a8['tint']['get']();this['shadowCharacterShakeX']=_0x1422a8['shadowCharacterShakeX']['get']();};Game_QJLightLayer['prototype']['setDead']=function(){if(this['character']==-0x1){$gameSystem['playerLight']=null;}delete $gameSystem['eventLights'][this['character']];this['dead']=!![];};Game_QJLightLayerMini['prototype']['initialize']=function(_0x49ab44,_0x3bb362,_0x77f1ff){this['dead']=![];this['visible']=!![];this['index']=_0x77f1ff;this['attach']=_0x49ab44;this['existTime']=0x0;this['x']=0x0;this['y']=0x0;this['scaleX']=0x1;this['scaleY']=0x1;this['opacity']=0x1;this['rotation']=0x0;this['rotationAuto']=0x0;this['tint']='#FFFFFF';this['initData']=_0x3bb362;this['time']=this['initData']['during'];this['needRefreshFrame']=!![];let _0x39e04b=_0x1b404c[_0x3bb362['imgName']];this['lightSpriteFrame']=[0x0,0x0,_0x39e04b['width'],_0x39e04b['height']];let _0x24be78=_0x3bb362['imgName']['match'](/\[([^,]+)\,([^]+)\]/i);if(_0x24be78){this['dramaticBitmap']=[0x0,Number(_0x24be78[0x2]),0x0,Number(_0x24be78[0x1])];this['lightSpriteFrame'][0x2]/=this['dramaticBitmap'][0x3];}this['update']();};Game_QJLightLayerMini['prototype']['updateFrame']=function(){if(!this['dramaticBitmap'])return;let _0xe061e0=0x0;if(this['dramaticBitmap']){this['dramaticBitmap'][0x0]++;if(this['dramaticBitmap'][0x0]>=this['dramaticBitmap'][0x1]){this['dramaticBitmap'][0x0]=0x0;this['dramaticBitmap'][0x2]++;if(this['dramaticBitmap'][0x2]>=this['dramaticBitmap'][0x3]){this['dramaticBitmap'][0x2]=0x0;}}_0xe061e0=this['dramaticBitmap'][0x2]*this['lightSpriteFrame'][0x2];}if(_0xe061e0!=this['lightSpriteFrame'][0x0]){this['needRefreshFrame']=!![];this['lightSpriteFrame'][0x0]=_0xe061e0;}};Game_QJLightLayerMini['prototype']['update']=function(){let _0x5b10d9=this['initData'];this['updateFrame']();if(this['time']>0x0)this['time']--;else if(this['time']==0x0){this['setDead']();return;}if(this['attach']['type']==0x0||this['attach']['type']==0x1){this['x']=this['attach']['x']+_0x5b10d9['offsetX']['get']();this['y']=this['attach']['y']+_0x5b10d9['offsetY']['get']();}else if(this['attach']['type']==0x2){if(this['attach']['object']['isDeadQJ']()){this['setDead']();return;}this['x']=this['attach']['object']['mapShowXQJ']()+_0x5b10d9['offsetX']['get']();this['y']=this['attach']['object']['mapShowYQJ']()+_0x5b10d9['offsetY']['get']();}this['scaleX']=_0x5b10d9['scaleX']['get']();this['scaleY']=_0x5b10d9['scaleY']['get']();this['opacity']=_0x5b10d9['opacity']['get']();if(this['attach']['synRotation']){this['rotation']=this['attach']['object']['lightRotation']();}else this['rotation']=_0x5b10d9['rotation']['get']();this['tint']=_0x5b10d9['tint']['get']();this['existTime']++;if(this['attach']['type']==0x1){let _0x31d1e9=![],_0x4d776a=this['attach']['regionId'];if(_0x5b10d9['showCondition']==0x0){_0x31d1e9=!![];}else if(_0x5b10d9['showCondition']==0x1){_0x31d1e9=$gamePlayer['remRegionId']==_0x4d776a;}else if(_0x5b10d9['showCondition']==0x2){_0x31d1e9=$gamePlayer['reSetX']==this['attach']['mapX']&&$gamePlayer['reSetY']==this['attach']['mapY'];}if(_0x57a96f[_0x4d776a]['showConditionExtra']){_0x31d1e9=_0x57a96f[_0x4d776a]['showConditionExtra']['call'](this,_0x31d1e9);}this['visible']=_0x31d1e9;}};Game_QJLightLayerMini['prototype']['setDead']=function(){$gameSystem['miniLights'][this['index']]=null;this['dead']=!![];};function _0xf856f8(){this['initialize']['apply'](this,arguments);}_0xf856f8['prototype']=Object['create'](PIXI['Sprite']['prototype']);_0xf856f8['prototype']['constructor']=_0xf856f8;_0xf856f8['prototype']['initialize']=function(_0x48d8f7,_0x3b317b){this['parentSpriteset']=_0x48d8f7;this['odata']=_0x3b317b;this['initData']=_0x3b317b['initData'];this['character']=_0x3b317b['character'];this['oldScaleXRem']=0x0;this['oldScaleYRem']=0x0;this['onWallMode']=![];this['dead']=![];let _0x3da164=_0x1b404c[_0x3b317b['initData']['imgName']];this['dialogLength']=this['odata']['dialogLength'];PIXI['Sprite']['call'](this,new PIXI['RenderTexture']['create']({'width':this['dialogLength'],'height':this['dialogLength']}));this['pluginName']='qjlightrender';this['anchor']['set'](0.5,0.5);this['lightTexture']=new PIXI['Texture'](_0x3da164);this['shadowSprite']=new PIXI['Graphics']();this['shadowSprite']['isLightShadow']=!![];this['shadowSprite']['x']=this['dialogLength']/0x2;this['shadowSprite']['y']=this['dialogLength']/0x2;this['shadowTexture']=new PIXI['RenderTexture']['create']({'width':this['dialogLength'],'height':this['dialogLength']});this['_texture']['baseTexture']['sendTextureData']=[this['lightTexture'],this['shadowTexture']];this['_texture']['baseTexture']['sendRotationData']=[0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,this['odata']['lightSpriteFrame'],this['odata']['startX'],this['odata']['startY']];this['shadowTexture']['baseTexture']['clearColor']=[0x1,0x1,0x1,0x1];if(this['odata']['shadowCharacter']){this['characterShadowContainer']=new PIXI['Container']();this['characterShadowContainer']['csList']=[];}};_0xf856f8['prototype']['render']=function(_0x3548b4){if(!this['visible'])return;this['_render'](_0x3548b4);};_0xf856f8['prototype']['update']=function(){if($gameSystem['eventLights'][this['character']]!=this['odata']){this['setDead']();return;}let _0x30e1b5=![],_0x35354a=![],_0x1cce31=!![];this['x']=this['odata']['x']+0x18-_0xe82237;this['y']=this['odata']['y']+0x18-_0x350de2;_0x1cce31=this['odata']['visible']&&!(this['x']+this['dialogLength']/0x2<0x0||this['y']+this['dialogLength']/0x2<0x0||this['x']-this['dialogLength']/0x2>_0x1ff651||this['y']-this['dialogLength']/0x2>_0x1897ac);if(_0x1cce31!=this['visible']){this['visible']=_0x1cce31;if(this['visible']){if(this['characterShadowContainer'])this['characterShadowContainer']['visible']=!![];_0x30e1b5=!![];_0x35354a=!![];}else{if(this['characterShadowContainer'])this['characterShadowContainer']['visible']=![];}}if(!this['visible'])return;this['alpha']=this['odata']['opacity'];if(this['oldTint']!=this['odata']['tint']){this['tint']=Number('0x'+this['odata']['tint']['substr'](0x1));this['oldTint']=this['odata']['tint'];}if(this['oldScaleX']!=this['odata']['scaleX']||this['oldScaleY']!=this['odata']['scaleY']){this['oldScaleX']=this['odata']['scaleX'];this['oldScaleY']=this['odata']['scaleY'];this['scale']=new PIXI['ObservablePoint'](null,null,this['oldScaleX'],this['oldScaleY']);_0x35354a=!![];if(this['oldScaleX']>this['oldScaleXRem']||this['oldScaleY']>this['oldScaleYRem']){this['oldScaleXRem']=this['oldScaleX'];this['oldScaleYRem']=this['oldScaleY'];_0x30e1b5=!![];}}if(this['oldRotation']!=this['odata']['rotation']){this['oldRotation']=this['odata']['rotation'];this['rotation']=this['oldRotation'];_0x35354a=!![];}if(this['oldX']!=this['odata']['x']||this['oldY']!=this['odata']['y']){this['oldX']=this['odata']['x'];this['oldY']=this['odata']['y'];_0x30e1b5=!![];}if(_0x35354a)this['refreshShadowUvs']();if(_0x30e1b5)this['refreshShadowRegion']();};_0xf856f8['prototype']['refreshShadowUvs']=function(){let _0x1e135c=Math['sin'](this['rotation']),_0x1324b2=Math['cos'](this['rotation']);this['_texture']['baseTexture']['sendRotationData'][0x0]=_0x1e135c;this['_texture']['baseTexture']['sendRotationData'][0x1]=_0x1324b2;this['_texture']['baseTexture']['sendRotationData'][0x2]=0.5-(_0x1324b2*this['oldScaleX']-_0x1e135c*this['oldScaleY'])*0.5/this['oldScaleXRem'];this['_texture']['baseTexture']['sendRotationData'][0x3]=0.5-(_0x1e135c*this['oldScaleX']+_0x1324b2*this['oldScaleY'])*0.5/this['oldScaleYRem'];this['_texture']['baseTexture']['sendRotationData'][0x4]=this['oldScaleX'];this['_texture']['baseTexture']['sendRotationData'][0x5]=this['oldScaleY'];this['_texture']['baseTexture']['sendRotationData'][0x6]=0x1/this['oldScaleXRem'];this['_texture']['baseTexture']['sendRotationData'][0x7]=0x1/this['oldScaleYRem'];};_0xf856f8['prototype']['refreshShadowRegion']=function(){let _0x191a09=this['shadowSprite'],_0x3cd6ac=this['oldX'],_0x4e983c=this['oldY'],_0x4ade86=this['dialogLength']/0x2,_0x4675d4=$gameMap['shadowDataQJLL'];let _0x46a28c=Math['floor'](_0x3cd6ac/0x30)*0x30-_0x3cd6ac-0x18,_0x1bbc2f=Math['floor'](_0x4e983c/0x30)*0x30-_0x4e983c-0x18;let _0x68a2ce=this['oldScaleXRem'],_0x5cb584=this['oldScaleYRem'];let _0x2452e2=Math['max'](Math['floor']((_0x3cd6ac-_0x4ade86*_0x68a2ce)/0x30),0x0),_0x46704f=Math['min'](Math['floor']((_0x3cd6ac+_0x4ade86*_0x68a2ce)/0x30),$gameMap['width']()-0x1);let _0x9fa19b=Math['max'](Math['floor']((_0x4e983c-_0x4ade86*_0x5cb584)/0x30),0x0),_0x48b2b5=Math['min'](Math['floor']((_0x4e983c+_0x4ade86*_0x5cb584)/0x30),$gameMap['height']()-0x1);let _0x55816c,_0x5144b0,_0x475cd9,_0x1e700d,_0x1fcf80,_0x2aba5b,_0x28ed95,_0x3987c5=0xa,_0x23e21a=0x0,_0x26b3fe,_0x49247a;let _0x49b6f5,_0xe92a06=new PIXI['LineStyle']();let _0xadfd2b=Object['assign'](new PIXI['FillStyle'](),{'color':0xffffff,'alpha':0x1,'visible':!![]});_0x191a09['clear']();this['onWallMode']=_0x4675d4[Math['min'](Math['max'](Math['floor'](_0x3cd6ac/0x30),0x0),$gameMap['width']()-0x1)][Math['min'](Math['max'](Math['floor'](_0x4e983c/0x30),0x0),$gameMap['height']()-0x1)];let _0x145cb=0x0,_0x502a4b;for(let _0x331406=_0x2452e2;_0x331406<=_0x46704f;_0x331406++){for(let _0xc24035=_0x9fa19b;_0xc24035<=_0x48b2b5;_0xc24035++){if(_0x4675d4[_0x331406][_0xc24035]==-0x1)continue;_0x55816c=$gameMap['regionIdForShadow'](_0x331406,_0xc24035);if(_0x4001fd[_0x55816c]&&_0x4001fd[_0x55816c]['shadowShow']){_0x2aba5b=_0x331406*0x30-_0x3cd6ac-0x18;_0x28ed95=_0xc24035*0x30-_0x4e983c-0x18;if(_0x2aba5b<0x0&&_0x28ed95<0x0&&_0x2aba5b>-0x30&&_0x28ed95>-0x30)continue;_0x49b6f5=Object['assign'](new PIXI['FillStyle'](),{'color':_0x4001fd[_0x55816c]['shadowTint'],'alpha':_0x4001fd[_0x55816c]['shadowOpacity'],'visible':!![]});_0x23e21a=_0x4001fd[_0x55816c]['shadowHeight'];if(this['onWallMode']!=-0x1){_0x502a4b=_0x4675d4[_0x331406][_0xc24035];if(_0x502a4b!=_0xc24035&&_0x502a4b==this['onWallMode']){_0x191a09['geometry']['graphicsData']['push'](new PIXI['GraphicsData'](new PIXI['Polygon']((_0x2aba5b+0x30)/_0x68a2ce,_0x28ed95/_0x5cb584,(_0x2aba5b+0x30)/_0x68a2ce,(_0x28ed95+_0x23e21a*0x30+0x30)/_0x5cb584,_0x2aba5b/_0x68a2ce,(_0x28ed95+_0x23e21a*0x30+0x30)/_0x5cb584,_0x2aba5b/_0x68a2ce,_0x28ed95/_0x5cb584),_0xadfd2b,_0xe92a06,null));_0x191a09['geometry']['dirty']++;_0xc24035=_0x502a4b;}else{_0x28ed95+=_0x23e21a*0x30;if(_0xc24035+_0x23e21a-this['onWallMode']==0x1){if(_0x2aba5b>=0x0&&_0x28ed95>=0x0){_0x5144b0=_0x2aba5b/_0x68a2ce;_0x475cd9=(_0x28ed95+0x30)/_0x5cb584;_0x1e700d=(_0x2aba5b+0x30)/_0x68a2ce;_0x1fcf80=_0x28ed95/_0x5cb584;_0x191a09['geometry']['graphicsData']['unshift'](new PIXI['GraphicsData'](new PIXI['Polygon'](_0x5144b0*_0x3987c5,_0x475cd9*_0x3987c5,_0x5144b0,_0x475cd9,_0x5144b0,_0x1fcf80,_0x4ade86,_0x1fcf80),_0x49b6f5,_0xe92a06,null));_0x191a09['geometry']['dirty']++;}else if(_0x2aba5b<=-0x30&&_0x28ed95>=0x0){_0x5144b0=_0x2aba5b/_0x68a2ce;_0x475cd9=_0x28ed95/_0x5cb584;_0x1e700d=(_0x2aba5b+0x30)/_0x68a2ce;_0x1fcf80=(_0x28ed95+0x30)/_0x5cb584;_0x191a09['geometry']['graphicsData']['unshift'](new PIXI['GraphicsData'](new PIXI['Polygon'](-_0x4ade86,_0x475cd9,_0x1e700d,_0x475cd9,_0x1e700d,_0x1fcf80,_0x1e700d*_0x3987c5,_0x1fcf80*_0x3987c5),_0x49b6f5,_0xe92a06,null));_0x191a09['geometry']['dirty']++;}}else{if(_0x2aba5b>=0x0&&_0x28ed95>=0x0){_0x5144b0=_0x2aba5b/_0x68a2ce;_0x475cd9=(_0x28ed95+0x30)/_0x5cb584;_0x1e700d=(_0x2aba5b+0x30)/_0x68a2ce;_0x1fcf80=_0x28ed95/_0x5cb584;}else if(_0x2aba5b<=-0x30&&_0x28ed95>=0x0){_0x5144b0=_0x2aba5b/_0x68a2ce;_0x475cd9=_0x28ed95/_0x5cb584;_0x1e700d=(_0x2aba5b+0x30)/_0x68a2ce;_0x1fcf80=(_0x28ed95+0x30)/_0x5cb584;}else if(_0x28ed95>=0x0){_0x5144b0=_0x2aba5b/_0x68a2ce;_0x475cd9=_0x28ed95/_0x5cb584;_0x1e700d=(_0x2aba5b+0x30)/_0x68a2ce;_0x1fcf80=_0x28ed95/_0x5cb584;}_0x191a09['geometry']['graphicsData']['unshift'](new PIXI['GraphicsData'](new PIXI['Polygon'](_0x5144b0*_0x3987c5,_0x475cd9*_0x3987c5,_0x5144b0,_0x475cd9,_0x1e700d,_0x1fcf80,_0x1e700d*_0x3987c5,_0x1fcf80*_0x3987c5),_0x49b6f5,_0xe92a06,null));_0x191a09['geometry']['dirty']++;}_0x191a09['geometry']['graphicsData']['unshift'](new PIXI['GraphicsData'](new PIXI['Polygon']((_0x2aba5b+0x30)/_0x68a2ce,_0x28ed95/_0x5cb584,(_0x2aba5b+0x30)/_0x68a2ce,(_0x28ed95+0x30)/_0x5cb584,_0x2aba5b/_0x68a2ce,(_0x28ed95+0x30)/_0x5cb584,_0x2aba5b/_0x68a2ce,_0x28ed95/_0x5cb584),_0x49b6f5,_0xe92a06,null));_0x191a09['geometry']['dirty']++;}continue;}else{_0x28ed95+=_0x23e21a*0x30;if(_0x2aba5b>=0x0&&_0x28ed95>=0x0){_0x5144b0=_0x2aba5b/_0x68a2ce;_0x475cd9=(_0x28ed95+0x30)/_0x5cb584;_0x1e700d=(_0x2aba5b+0x30)/_0x68a2ce;_0x1fcf80=_0x28ed95/_0x5cb584;}else if(_0x2aba5b<=-0x30&&_0x28ed95>=0x0){_0x5144b0=_0x2aba5b/_0x68a2ce;_0x475cd9=_0x28ed95/_0x5cb584;_0x1e700d=(_0x2aba5b+0x30)/_0x68a2ce;_0x1fcf80=(_0x28ed95+0x30)/_0x5cb584;}else if(_0x28ed95>=0x0){_0x5144b0=_0x2aba5b/_0x68a2ce;_0x475cd9=_0x28ed95/_0x5cb584;_0x1e700d=(_0x2aba5b+0x30)/_0x68a2ce;_0x1fcf80=_0x28ed95/_0x5cb584;}else if(_0x2aba5b>=0x0&&_0x28ed95<=-0x30){_0x5144b0=(_0x2aba5b+0x30)/_0x68a2ce;_0x475cd9=(_0x28ed95+0x30)/_0x5cb584;_0x1e700d=_0x2aba5b/_0x68a2ce;_0x1fcf80=_0x28ed95/_0x5cb584;}else if(_0x2aba5b>=0x0){_0x5144b0=_0x2aba5b/_0x68a2ce;_0x475cd9=(_0x28ed95+0x30)/_0x5cb584;_0x1e700d=_0x2aba5b/_0x68a2ce;_0x1fcf80=_0x28ed95/_0x5cb584;}else if(_0x2aba5b<=-0x30&&_0x28ed95<=-0x30){_0x5144b0=(_0x2aba5b+0x30)/_0x68a2ce;_0x475cd9=_0x28ed95/_0x5cb584;_0x1e700d=_0x2aba5b/_0x68a2ce;_0x1fcf80=(_0x28ed95+0x30)/_0x5cb584;}else if(_0x2aba5b<=-0x30){_0x5144b0=(_0x2aba5b+0x30)/_0x68a2ce;_0x475cd9=_0x28ed95/_0x5cb584;_0x1e700d=(_0x2aba5b+0x30)/_0x68a2ce;_0x1fcf80=(_0x28ed95+0x30)/_0x5cb584;}else if(_0x28ed95<=-0x30){_0x5144b0=(_0x2aba5b+0x30)/_0x68a2ce;_0x475cd9=(_0x28ed95+0x30)/_0x5cb584;_0x1e700d=_0x2aba5b/_0x68a2ce;_0x1fcf80=(_0x28ed95+0x30)/_0x5cb584;}_0x191a09['geometry']['graphicsData']['unshift'](new PIXI['GraphicsData'](new PIXI['Polygon'](_0x5144b0*_0x3987c5,_0x475cd9*_0x3987c5,_0x5144b0,_0x475cd9,_0x1e700d,_0x1fcf80,_0x1e700d*_0x3987c5,_0x1fcf80*_0x3987c5),_0x49b6f5,_0xe92a06,null));_0x191a09['geometry']['dirty']++;_0x145cb++;if(_0x4e983c>_0xc24035*0x30-0x18+0x30+_0x4001fd[_0x55816c]['shadowHeight']*0x30){for(let _0x44c4a4=0x0,_0x3bc373=_0x4001fd[_0x55816c]['shadowHeight'];_0x44c4a4<_0x3bc373;_0x44c4a4++){if($gameMap['regionIdForShadow'](_0x331406,_0xc24035+_0x44c4a4+0x1)==_0x55816c){_0x23e21a=_0x44c4a4;break;}_0x28ed95=_0xc24035*0x30-_0x4e983c-0x18+0x30+_0x44c4a4*0x30;_0x191a09['geometry']['graphicsData']['push'](new PIXI['GraphicsData'](new PIXI['Polygon'](_0x2aba5b/_0x68a2ce,_0x28ed95/_0x5cb584,(_0x2aba5b+0x30)/_0x68a2ce,_0x28ed95/_0x5cb584,(_0x2aba5b+0x30)/_0x68a2ce,(_0x28ed95+0x30)/_0x5cb584,_0x2aba5b/_0x68a2ce,(_0x28ed95+0x30)/_0x5cb584),_0xadfd2b,_0xe92a06,null));_0x191a09['geometry']['dirty']++;}}else{_0x49247a=_0xc24035*0x30-0x18+0x30+_0x4001fd[_0x55816c]['shadowHeight']*0x30;_0x26b3fe=0x1-(_0x49247a-_0x4e983c<=0x18&&_0x49247a>=_0x4e983c?Math['abs'](_0x49247a-_0x4e983c)/0x18:0x1);for(let _0x2dd9df=0x0,_0x2d4f10=_0x4001fd[_0x55816c]['shadowHeight'];_0x2dd9df<_0x2d4f10;_0x2dd9df++){if($gameMap['regionIdForShadow'](_0x331406,_0xc24035+_0x2dd9df+0x1)==_0x55816c){_0x23e21a=_0x2dd9df;break;}_0x28ed95=_0xc24035*0x30-_0x4e983c-0x18+0x30+_0x2dd9df*0x30;_0x191a09['geometry']['graphicsData']['push'](new PIXI['GraphicsData'](new PIXI['Polygon'](_0x2aba5b/_0x68a2ce,_0x28ed95/_0x5cb584,(_0x2aba5b+0x30)/_0x68a2ce,_0x28ed95/_0x5cb584,(_0x2aba5b+0x30)/_0x68a2ce,(_0x28ed95+0x30)/_0x5cb584,_0x2aba5b/_0x68a2ce,(_0x28ed95+0x30)/_0x5cb584),Object['assign'](new PIXI['FillStyle'](),{'color':PIXI['utils']['rgb2hex']([_0x26b3fe,_0x26b3fe,_0x26b3fe]),'alpha':0x1,'visible':!![]}),_0xe92a06,null));_0x191a09['geometry']['dirty']++;}}_0xc24035+=_0x23e21a;}}}}if(this['onWallMode']!=-0x1){_0x28ed95=(this['onWallMode']*0x30-_0x4e983c-0x18+0x30)/_0x5cb584;_0x191a09['geometry']['graphicsData']['splice'](_0x145cb,0x0,new PIXI['GraphicsData'](new PIXI['Polygon'](_0x4ade86,-_0x4ade86,_0x4ade86,_0x28ed95,-_0x4ade86,_0x28ed95,-_0x4ade86,-_0x4ade86),Object['assign'](new PIXI['FillStyle'](),{'color':0x0,'alpha':0x1,'visible':!![]}),_0xe92a06,null));_0x191a09['geometry']['dirty']++;}Graphics['_app']['renderer']['render'](this['shadowSprite'],this['shadowTexture']);};_0xf856f8['prototype']['setDead']=function(){if(this['characterShadowContainer']){this['characterShadowContainer']['parent']['removeChild'](this['characterShadowContainer']);}this['parent']['removeChild'](this);this['destroy']();this['dead']=!![];};function _0x2ef350(){this['initialize']['apply'](this,arguments);}_0x2ef350['prototype']=Object['create'](PIXI['Sprite']['prototype']);_0x2ef350['prototype']['constructor']=_0x2ef350;_0x2ef350['prototype']['initialize']=function(_0x3de696,_0x9ffbd1){this['parentSpriteset']=_0x3de696;this['odata']=_0x9ffbd1;this['initData']=_0x9ffbd1['initData'];this['index']=_0x9ffbd1['index'];this['dead']=![];PIXI['Sprite']['call'](this,new PIXI['Texture'](_0x1b404c[_0x9ffbd1['initData']['imgName']]));this['anchor']['set'](0.5,0.5);this['update']();};_0x2ef350['prototype']['update']=function(){if($gameSystem['miniLights'][this['index']]!=this['odata']){this['setDead']();return;}this['x']=this['odata']['x']-_0xe82237;this['y']=this['odata']['y']-_0x350de2;this['alpha']=this['odata']['opacity'];this['visible']=this['odata']['visible'];if(this['oldTint']!=this['odata']['tint']){this['tint']=Number('0x'+this['odata']['tint']['substr'](0x1));this['oldTint']=this['odata']['tint'];}if(this['oldScaleX']!=this['odata']['scaleX']||this['oldScaleY']!=this['odata']['scaleY']){this['oldScaleX']=this['odata']['scaleX'];this['oldScaleY']=this['odata']['scaleY'];this['scale']=new PIXI['ObservablePoint'](null,null,this['oldScaleX'],this['oldScaleY']);}if(this['oldRotation']!=this['odata']['rotation']){this['oldRotation']=this['odata']['rotation'];this['rotation']=this['oldRotation'];}if(this['odata']['needRefreshFrame']){this['odata']['needRefreshFrame']=![];this['texture']['frame']['x']=this['odata']['lightSpriteFrame'][0x0];this['texture']['frame']['width']=this['odata']['lightSpriteFrame'][0x2];this['texture']['frame']=this['texture']['frame'];}};_0x2ef350['prototype']['setDead']=function(){this['parent']['removeChild'](this);this['destroy']();this['dead']=!![];};_0x281e02['prototype']['render']=function(_0x5f25a5){if(!this['visible'])return;_0x5f25a5['batch']['flush']();var _0x58b226=this['filters'];if(_0x58b226){if(!this['_enabledFilters'])this['_enabledFilters']=[];this['_enabledFilters']['length']=0x0;for(var _0xa75cb5=0x0;_0xa75cb5<_0x58b226['length'];_0xa75cb5++){if(_0x58b226[_0xa75cb5]['enabled'])this['_enabledFilters']['push'](_0x58b226[_0xa75cb5]);}if(this['_enabledFilters']['length'])_0x5f25a5['filter']['push'](this,this['_enabledFilters']);}this['_render'](_0x5f25a5);if(this['children']['length']>0x2){for(var _0x14e1a1=0x0,_0x51995a=this['children']['length']-0x2;_0x14e1a1<_0x51995a;_0x14e1a1++){this['children'][_0x14e1a1]['render'](_0x5f25a5);}_0x5f25a5['batch']['flush']();}this['children'][this['children']['length']-0x2]['render'](_0x5f25a5);this['children'][this['children']['length']-0x1]['render'](_0x5f25a5);_0x5f25a5['batch']['flush']();if(_0x58b226&&this['_enabledFilters']&&this['_enabledFilters']['length']){_0x5f25a5['filter']['pop']();}};QJLightRender=function(){this['initialize'](...arguments);};QJLightRender['_drawCallPool']=[];QJLightRender['_textureArrayPool']=[];QJLightRender['prototype']=Object['create'](PIXI['ObjectRenderer']['prototype']);QJLightRender['prototype']['constructor']=QJLightRender;QJLightRender['prototype']['initialize']=function(_0x226904){PIXI['ObjectRenderer']['call'](this,_0x226904);this['geometryClass']=PIXI['BatchGeometry'];this['vertexSize']=0x6;this['state']=PIXI['State']['for2d']();this['size']=PIXI['settings']['SPRITE_BATCH_SIZE']*0x4;this['_vertexCount']=0x0;this['_indexCount']=0x0;this['_bufferedElements']=[];this['_bufferedTextures']=[];this['_bufferSize']=0x0;this['_shader']=null;this['_packedGeometries']=[];this['_packedGeometryPoolSize']=0x2;this['_flushId']=0x0;this['_aBuffers']={};this['_iBuffers']={};this['MAX_TEXTURES']=0x1;this['renderer']['on']('prerender',this['onPrerender'],this);_0x226904['runners']['contextChange']['add'](this);this['_dcIndex']=0x0;this['_aIndex']=0x0;this['_iIndex']=0x0;this['_attributeBuffer']=null;this['_indexBuffer']=null;this['_tempBoundTextures']=[];this['_defaultSyncData']={'textureCount':0x0};};QJLightRender['prototype']['onPrerender']=function(){this['_flushId']=0x0;};QJLightRender['prototype']['contextChange']=function(){var _0x5f7e59=this['renderer']['gl'];this['MAX_TEXTURES']=0x1;this['_shader']=QJ['LL']['generateMultiTextureShader']();for(var _0x8a63f3=0x0;_0x8a63f3<this['_packedGeometryPoolSize'];_0x8a63f3++){this['_packedGeometries'][_0x8a63f3]=new this['geometryClass']();}this['initFlushBuffers']();};QJLightRender['prototype']['initFlushBuffers']=function(){var _0x20de61=QJLightRender['_drawCallPool'];var _0x1b48ad=QJLightRender['_textureArrayPool'];var _0x2e35cb=this['size']/0x4;var _0x4fdc2d=Math['floor'](_0x2e35cb/this['MAX_TEXTURES'])+0x1;while(_0x20de61['length']<_0x2e35cb){_0x20de61['push'](new PIXI['BatchDrawCall']());}while(_0x1b48ad['length']<_0x4fdc2d){_0x1b48ad['push'](new PIXI['BatchTextureArray']());}for(var _0x41decd=0x0;_0x41decd<this['MAX_TEXTURES'];_0x41decd++){this['_tempBoundTextures'][_0x41decd]=null;}};QJLightRender['prototype']['render']=function(_0x5426b2){if(!_0x5426b2['_texture']['valid'])return;if(this['_vertexCount']+_0x5426b2['vertexData']['length']/0x2>this['size'])this['flush']();this['_vertexCount']+=_0x5426b2['vertexData']['length']/0x2;this['_indexCount']+=_0x5426b2['indices']['length'];this['_bufferedTextures'][this['_bufferSize']]=_0x5426b2['_texture']['baseTexture'];this['_bufferedElements'][this['_bufferSize']++]=_0x5426b2;};QJLightRender['prototype']['buildTexturesAndDrawCalls']=function(){var _0x57d517=this;var _0x1c0d64=_0x57d517['_bufferedTextures'];var _0x1d789d=_0x57d517['MAX_TEXTURES'];var _0x4c371f=QJLightRender['_textureArrayPool'];var _0x16f587=this['renderer']['batch'];var _0x2ad7ab=this['_tempBoundTextures'];var _0x491191=this['renderer']['textureGC']['count'];var _0x38851e=++PIXI['BaseTexture']['_globalBatch'];var _0x34b464=0x0;var _0x5d3b72=_0x4c371f[0x0];var _0x5f38ca=0x0;_0x16f587['copyBoundTextures'](_0x2ad7ab,_0x1d789d);for(var _0x56bad2=0x0;_0x56bad2<this['_bufferSize'];++_0x56bad2){var _0x465ec4=_0x1c0d64[_0x56bad2];_0x1c0d64[_0x56bad2]=null;if(_0x465ec4['_batchEnabled']===_0x38851e)continue;if(_0x5d3b72['count']>=_0x1d789d){_0x16f587['boundArray'](_0x5d3b72,_0x2ad7ab,_0x38851e,_0x1d789d);this['buildDrawCalls'](_0x5d3b72,_0x5f38ca,_0x56bad2);_0x5f38ca=_0x56bad2;_0x5d3b72=_0x4c371f[++_0x34b464];++_0x38851e;}_0x465ec4['_batchEnabled']=_0x38851e;_0x465ec4['touched']=_0x491191;_0x5d3b72['elements'][_0x5d3b72['count']++]=_0x465ec4;}if(_0x5d3b72['count']>0x0){_0x16f587['boundArray'](_0x5d3b72,_0x2ad7ab,_0x38851e,_0x1d789d);this['buildDrawCalls'](_0x5d3b72,_0x5f38ca,this['_bufferSize']);++_0x34b464;++_0x38851e;}for(var _0x47c66b=0x0;_0x47c66b<_0x2ad7ab['length'];_0x47c66b++){_0x2ad7ab[_0x47c66b]=null;}PIXI['BaseTexture']['_globalBatch']=_0x38851e;};QJLightRender['prototype']['buildDrawCalls']=function(_0x3bf051,_0x159177,_0x2f818a){var _0x4a86af=this;var _0xce317c=_0x4a86af['_bufferedElements'];var _0x34467d=_0x4a86af['_attributeBuffer'];var _0x2a0e37=_0x4a86af['_indexBuffer'];var _0x5611a2=_0x4a86af['vertexSize'];var _0x2d89e9=QJLightRender['_drawCallPool'];var _0x2b313d=this['_dcIndex'];var _0x32eef2=this['_aIndex'];var _0x310d83=this['_iIndex'];var _0x1a339d=_0x2d89e9[_0x2b313d];_0x1a339d['start']=this['_iIndex'];_0x1a339d['texArray']=_0x3bf051;for(var _0x9a4975=_0x159177;_0x9a4975<_0x2f818a;++_0x9a4975){var _0x5c642c=_0xce317c[_0x9a4975];var _0x4d354f=_0x5c642c['_texture']['baseTexture'];var _0x5163ec=PIXI['utils']['premultiplyBlendMode'][_0x4d354f['alphaMode']?0x1:0x0][_0x5c642c['blendMode']];_0xce317c[_0x9a4975]=null;if(_0x159177<_0x9a4975&&_0x1a339d['blend']!==_0x5163ec){_0x1a339d['size']=_0x310d83-_0x1a339d['start'];_0x159177=_0x9a4975;_0x1a339d=_0x2d89e9[++_0x2b313d];_0x1a339d['texArray']=_0x3bf051;_0x1a339d['start']=_0x310d83;}this['packInterleavedGeometry'](_0x5c642c,_0x34467d,_0x2a0e37,_0x32eef2,_0x310d83);_0x32eef2+=_0x5c642c['vertexData']['length']/0x2*_0x5611a2;_0x310d83+=_0x5c642c['indices']['length'];_0x1a339d['blend']=_0x5163ec;}if(_0x159177<_0x2f818a){_0x1a339d['size']=_0x310d83-_0x1a339d['start'];++_0x2b313d;}this['_dcIndex']=_0x2b313d;this['_aIndex']=_0x32eef2;this['_iIndex']=_0x310d83;};QJLightRender['prototype']['updateGeometry']=function(){var _0x299556=this;var _0xb4680d=_0x299556['_packedGeometries'];var _0x318e8b=_0x299556['_attributeBuffer'];var _0x5d8b7f=_0x299556['_indexBuffer'];if(!PIXI['settings']['CAN_UPLOAD_SAME_BUFFER']){if(this['_packedGeometryPoolSize']<=this['_flushId']){this['_packedGeometryPoolSize']++;_0xb4680d[this['_flushId']]=new this['geometryClass']();}_0xb4680d[this['_flushId']]['_buffer']['update'](_0x318e8b['rawBinaryData']);_0xb4680d[this['_flushId']]['_indexBuffer']['update'](_0x5d8b7f);this['renderer']['geometry']['bind'](_0xb4680d[this['_flushId']]);this['renderer']['geometry']['updateBuffers']();this['_flushId']++;}else{_0xb4680d[this['_flushId']]['_buffer']['update'](_0x318e8b['rawBinaryData']);_0xb4680d[this['_flushId']]['_indexBuffer']['update'](_0x5d8b7f);this['renderer']['geometry']['updateBuffers']();}};QJLightRender['prototype']['bindUniforms']=function(_0xbd4505,_0x1ed4db,_0x4b45f1,_0xda2b0){var _0x11c605=null;var _0x5a9aba=null;var _0x1d7248=0x0;var _0x4422c3=_0x4b45f1['gl'];_0x5a9aba=_0xbd4505['uSamplers']['value'];_0x11c605=_0x1ed4db['uSamplers'];_0x4422c3['uniform1iv'](_0xbd4505['uSamplers']['location'],_0x11c605);_0x4422c3['uniformMatrix3fv'](_0xbd4505['projectionMatrix']['location'],![],_0x1ed4db['projectionMatrix']['toArray'](!![]));if(_0x1ed4db['sRSin']!==_0xbd4505['sRSin']['value']){_0xbd4505['sRSin']['value']=_0x1ed4db['sRSin'];_0x4422c3['uniform1f'](_0xbd4505['sRSin']['location'],_0x1ed4db['sRSin']);}if(_0x1ed4db['sRCos']!==_0xbd4505['sRCos']['value']){_0xbd4505['sRCos']['value']=_0x1ed4db['sRCos'];_0x4422c3['uniform1f'](_0xbd4505['sRCos']['location'],_0x1ed4db['sRCos']);}if(_0x1ed4db['sROffsetX']!==_0xbd4505['sROffsetX']['value']){_0xbd4505['sROffsetX']['value']=_0x1ed4db['sROffsetX'];_0x4422c3['uniform1f'](_0xbd4505['sROffsetX']['location'],_0x1ed4db['sROffsetX']);}if(_0x1ed4db['sROffsetY']!==_0xbd4505['sROffsetY']['value']){_0xbd4505['sROffsetY']['value']=_0x1ed4db['sROffsetY'];_0x4422c3['uniform1f'](_0xbd4505['sROffsetY']['location'],_0x1ed4db['sROffsetY']);}if(_0x1ed4db['sRScaleX']!==_0xbd4505['sRScaleX']['value']){_0xbd4505['sRScaleX']['value']=_0x1ed4db['sRScaleX'];_0x4422c3['uniform1f'](_0xbd4505['sRScaleX']['location'],_0x1ed4db['sRScaleX']);}if(_0x1ed4db['sRScaleY']!==_0xbd4505['sRScaleY']['value']){_0xbd4505['sRScaleY']['value']=_0x1ed4db['sRScaleY'];_0x4422c3['uniform1f'](_0xbd4505['sRScaleY']['location'],_0x1ed4db['sRScaleY']);}if(_0x1ed4db['sRScaleX2']!==_0xbd4505['sRScaleX2']['value']){_0xbd4505['sRScaleX2']['value']=_0x1ed4db['sRScaleX2'];_0x4422c3['uniform1f'](_0xbd4505['sRScaleX2']['location'],_0x1ed4db['sRScaleX2']);}if(_0x1ed4db['sRScaleY2']!==_0xbd4505['sRScaleY2']['value']){_0xbd4505['sRScaleY2']['value']=_0x1ed4db['sRScaleY2'];_0x4422c3['uniform1f'](_0xbd4505['sRScaleY2']['location'],_0x1ed4db['sRScaleY2']);}if(_0x1ed4db['frameX']!==_0xbd4505['frameX']['value']){_0xbd4505['frameX']['value']=_0x1ed4db['frameX'];_0x4422c3['uniform1f'](_0xbd4505['frameX']['location'],_0x1ed4db['frameX']);}if(_0x1ed4db['frameY']!==_0xbd4505['frameY']['value']){_0xbd4505['frameY']['value']=_0x1ed4db['frameY'];_0x4422c3['uniform1f'](_0xbd4505['frameY']['location'],_0x1ed4db['frameY']);}if(_0x1ed4db['frameW']!==_0xbd4505['frameW']['value']){_0xbd4505['frameW']['value']=_0x1ed4db['frameW'];_0x4422c3['uniform1f'](_0xbd4505['frameW']['location'],_0x1ed4db['frameW']);}if(_0x1ed4db['frameH']!==_0xbd4505['frameH']['value']){_0xbd4505['frameH']['value']=_0x1ed4db['frameH'];_0x4422c3['uniform1f'](_0xbd4505['frameH']['location'],_0x1ed4db['frameH']);}if(_0x1ed4db['startX']!==_0xbd4505['startX']['value']){_0xbd4505['startX']['value']=_0x1ed4db['startX'];_0x4422c3['uniform1f'](_0xbd4505['startX']['location'],_0x1ed4db['startX']);}if(_0x1ed4db['startY']!==_0xbd4505['startY']['value']){_0xbd4505['startY']['value']=_0x1ed4db['startY'];_0x4422c3['uniform1f'](_0xbd4505['startY']['location'],_0x1ed4db['startY']);}_0x4b45f1['shader']['syncUniforms'](_0x1ed4db['globals'],_0x4b45f1['shader']['getglProgram'](),_0xda2b0);};QJLightRender['prototype']['drawBatches']=function(){var _0x1f94b0=this['_dcIndex'];var _0x1d5790=this['renderer'];var _0xae4768=_0x1d5790['gl'];var _0x5ca902=_0x1d5790['state'];var _0x571a40=QJLightRender['_drawCallPool'];var _0x424aad=null;var _0x636a5a=this['_shader']['uniforms'];_0xae4768['blendFunc'](_0xae4768['SRC_ALPHA'],_0xae4768['ONE']);for(var _0x1ee52f=0x0;_0x1ee52f<_0x1f94b0;_0x1ee52f++){var _0x265e81=_0x571a40[_0x1ee52f];var _0x430941=_0x265e81['texArray'];var _0x4f4028=_0x265e81['type'];var _0x1a61ff=_0x265e81['size'];var _0x2073bc=_0x265e81['start'];var _0x5aea28=_0x265e81['blend'];_0x424aad=_0x430941;var _0xf660ec=this['renderer']['texture'];var _0x45e025=_0x430941['elements'][0x0];_0xf660ec['bind'](_0x45e025['sendTextureData'][0x0],0x0);_0xf660ec['bind'](_0x45e025['sendTextureData'][0x1],0x1);_0x430941['elements'][0x0]=null;_0x430941['count']=0x0;var _0x12fb83=_0x45e025['sendRotationData'];_0x636a5a['sRSin']=_0x12fb83[0x0];_0x636a5a['sRCos']=_0x12fb83[0x1];_0x636a5a['sROffsetX']=_0x12fb83[0x2];_0x636a5a['sROffsetY']=_0x12fb83[0x3];_0x636a5a['sRScaleX']=_0x12fb83[0x4];_0x636a5a['sRScaleY']=_0x12fb83[0x5];_0x636a5a['sRScaleX2']=_0x12fb83[0x6];_0x636a5a['sRScaleY2']=_0x12fb83[0x7];_0x636a5a['frameX']=_0x12fb83[0x8][0x0];_0x636a5a['frameY']=_0x12fb83[0x8][0x1];_0x636a5a['frameW']=_0x12fb83[0x8][0x2];_0x636a5a['frameH']=_0x12fb83[0x8][0x3];_0x636a5a['startX']=_0x12fb83[0x9];_0x636a5a['startY']=_0x12fb83[0xa];this['_defaultSyncData']['textureCount']=0x0;this['bindUniforms'](this['renderer']['shader']['getglProgram']()['uniformData'],this['_shader']['uniformGroup']['uniforms'],_0x1d5790,this['_defaultSyncData']);this['state']['blendMode']=_0x5aea28;_0x5ca902['set'](this['state']);_0xae4768['drawElements'](_0x4f4028,_0x1a61ff,_0xae4768['UNSIGNED_SHORT'],_0x2073bc*0x2);}};QJLightRender['prototype']['flush']=function(){if(this['_vertexCount']===0x0)return;this['_attributeBuffer']=this['getAttributeBuffer'](this['_vertexCount']);this['_indexBuffer']=this['getIndexBuffer'](this['_indexCount']);this['_aIndex']=0x0;this['_iIndex']=0x0;this['_dcIndex']=0x0;this['buildTexturesAndDrawCalls']();this['updateGeometry']();this['drawBatches']();this['_bufferSize']=0x0;this['_vertexCount']=0x0;this['_indexCount']=0x0;};QJLightRender['prototype']['start']=function(){this['renderer']['state']['set'](this['state']);this['renderer']['shader']['bind'](this['_shader'],!![]);if(PIXI['settings']['CAN_UPLOAD_SAME_BUFFER']){this['renderer']['geometry']['bind'](this['_packedGeometries'][this['_flushId']]);}};QJLightRender['prototype']['stop']=function(){this['flush']();};QJLightRender['prototype']['destroy']=function(){for(var _0x3abbb5=0x0;_0x3abbb5<this['_packedGeometryPoolSize'];_0x3abbb5++){if(this['_packedGeometries'][_0x3abbb5]){this['_packedGeometries'][_0x3abbb5]['destroy']();}}this['renderer']['off']('prerender',this['onPrerender'],this);this['_aBuffers']=null;this['_iBuffers']=null;this['_packedGeometries']=null;this['_attributeBuffer']=null;this['_indexBuffer']=null;if(this['_shader']){this['_shader']['destroy']();this['_shader']=null;}PIXI['ObjectRenderer']['prototype']['destroy']['call'](this);};QJLightRender['prototype']['getAttributeBuffer']=function(_0x27a68d){var _0x507467=PIXI['utils']['nextPow2'](Math['ceil'](_0x27a68d/0x8));var _0x43baa9=PIXI['utils']['log2'](_0x507467);var _0x15ecf=_0x507467*0x8;if(this['_aBuffers']['length']<=_0x43baa9){this['_iBuffers']['length']=_0x43baa9+0x1;}var _0x2c0311=this['_aBuffers'][_0x15ecf];if(!_0x2c0311){this['_aBuffers'][_0x15ecf]=_0x2c0311=new PIXI['ViewableBuffer'](_0x15ecf*this['vertexSize']*0x4);}return _0x2c0311;};QJLightRender['prototype']['getIndexBuffer']=function(_0x3bae5a){var _0x4d4ced=PIXI['utils']['nextPow2'](Math['ceil'](_0x3bae5a/0xc));var _0x38fe26=PIXI['utils']['log2'](_0x4d4ced);var _0x3eb3e7=_0x4d4ced*0xc;if(this['_iBuffers']['length']<=_0x38fe26){this['_iBuffers']['length']=_0x38fe26+0x1;}var _0xc76d68=this['_iBuffers'][_0x38fe26];if(!_0xc76d68){this['_iBuffers'][_0x38fe26]=_0xc76d68=new Uint16Array(_0x3eb3e7);}return _0xc76d68;};QJLightRender['prototype']['packInterleavedGeometry']=function(_0x49d4fd,_0x154c4d,_0x273e1f,_0x1c4cda,_0xf72661){var _0x28668e=_0x154c4d['uint32View'];var _0x39b52d=_0x154c4d['float32View'];var _0x4cb9bc=_0x1c4cda/this['vertexSize'];var _0x1ae89e=_0x49d4fd['uvs'];var _0x5a20b1=_0x49d4fd['indices'];var _0x14289d=_0x49d4fd['vertexData'];var _0x55da7c=_0x49d4fd['_texture']['baseTexture']['_batchLocation'];var _0xf7882f=Math['min'](_0x49d4fd['worldAlpha'],0x1);var _0x3dda08=_0xf7882f<0x1&&_0x49d4fd['_texture']['baseTexture']['alphaMode']?PIXI['utils']['premultiplyTint'](_0x49d4fd['_tintRGB'],_0xf7882f):_0x49d4fd['_tintRGB']+(_0xf7882f*0xff<<0x18);for(var _0x291a92=0x0;_0x291a92<_0x14289d['length'];_0x291a92+=0x2){_0x39b52d[_0x1c4cda++]=_0x14289d[_0x291a92];_0x39b52d[_0x1c4cda++]=_0x14289d[_0x291a92+0x1];_0x39b52d[_0x1c4cda++]=_0x1ae89e[_0x291a92];_0x39b52d[_0x1c4cda++]=_0x1ae89e[_0x291a92+0x1];_0x28668e[_0x1c4cda++]=_0x3dda08;_0x39b52d[_0x1c4cda++]=_0x55da7c;}for(var _0xb4c088=0x0;_0xb4c088<_0x5a20b1['length'];_0xb4c088++){_0x273e1f[_0xf72661++]=_0x4cb9bc+_0x5a20b1[_0xb4c088];}};PIXI['Renderer']['registerPlugin']('qjlightrender',QJLightRender);function _0x14fc79(){this['initialize']['apply'](this,arguments);}_0x14fc79['prototype']=Object['create'](PIXI['Container']['prototype']);_0x14fc79['prototype']['constructor']=_0x14fc79;_0x14fc79['prototype']['initialize']=function(_0x338891){PIXI['Container']['call'](this);this['mainMask']=_0x338891;this['z']=0x1;};_0x14fc79['prototype']['update']=function(){this['visible']=$gameSystem['showLights'];if(!this['visible'])return;let _0x3b02bf=this['mainMask']['children'];let _0x4cb007,_0x101d77,_0x22077f,_0x10dddd,_0x2e4636,_0x3fa972,_0x17d61b,_0x3430d9,_0x200395;let _0x2fbea9=$gameMap['characterShadowList'];let _0x4f919b,_0x16590e,_0x23eb40,_0x2183fb,_0x3cd86f,_0x205281;for(let _0x32dbec=0x0,_0x2c05fd=_0x3b02bf['length']-0x1;_0x32dbec<_0x2c05fd;_0x32dbec++){if(!_0x3b02bf[_0x32dbec]||!_0x3b02bf[_0x32dbec]['characterShadowContainer'])continue;_0x4cb007=_0x3b02bf[_0x32dbec]['characterShadowContainer'];if(!_0x4cb007['parent'])this['addChild'](_0x4cb007);_0x4f919b=_0x3b02bf[_0x32dbec]['x']-_0x3d546b/0x2;_0x16590e=_0x3b02bf[_0x32dbec]['y']-_0x3d546b/0x2;_0x101d77=_0x3b02bf[_0x32dbec]['initData'];_0x3fa972=_0x3b02bf[_0x32dbec]['odata'];for(let _0x44ccbd in _0x2fbea9){if(_0x44ccbd==_0x3b02bf[_0x32dbec]['character'])continue;if(_0x2fbea9[_0x44ccbd]==![]){if(_0x4cb007['csList'][_0x44ccbd]){_0x4cb007['removeChild'](_0x4cb007['csList'][_0x44ccbd]);delete _0x4cb007['csList'][_0x44ccbd];}continue;}if(!_0x4cb007['csList'][_0x44ccbd]){_0x10dddd=new PIXI['Sprite']();_0x10dddd['blendMode']=0x2;_0x10dddd['anchor']['set'](0.5,0x1);_0x4cb007['addChild'](_0x10dddd);_0x4cb007['csList'][_0x44ccbd]=_0x10dddd;}else _0x10dddd=_0x4cb007['csList'][_0x44ccbd];_0x2e4636=_0x22aa45[_0x44ccbd];if(!_0x2e4636)continue;_0x17d61b=_0x2e4636['_character'];_0x200395=_0x17d61b['jumpHeight']();_0x22077f=_0x17d61b['QJSC'];_0x23eb40=_0x17d61b['screenX']();_0x2183fb=_0x17d61b['screenY']()-_0x22077f['yCut']+_0x200395;_0x3430d9=QJ['LL']['calculateAngleByTwoPoint'](_0x4f919b,_0x16590e,_0x23eb40-_0x3fa972['shadowCharacterOffsetX'],_0x2183fb-_0x3fa972['shadowCharacterOffsetY']);_0x23eb40+=Math['sin'](_0x3430d9)*_0x200395;_0x2183fb+=-Math['cos'](_0x3430d9)*_0x200395;_0x3cd86f=Math['sqrt']((_0x23eb40-_0x3fa972['shadowCharacterOffsetX']-_0x4f919b)*(_0x23eb40-_0x3fa972['shadowCharacterOffsetX']-_0x4f919b)+(_0x2183fb-_0x3fa972['shadowCharacterOffsetY']-_0x16590e)*(_0x2183fb-_0x3fa972['shadowCharacterOffsetY']-_0x16590e))+_0x200395;if(_0x3cd86f>_0x3b02bf[_0x32dbec]['dialogLength']/0x2){_0x10dddd['visible']=![];continue;}else _0x10dddd['visible']=!![];if(!_0x22077f['imgName']){if(!_0x2e4636['textureLL'])continue;if(_0x10dddd['texture']!=_0x2e4636['textureLL'])_0x10dddd['texture']=_0x2e4636['textureLL'];if(_0x10dddd['texture']['frame']['x']!=_0x2e4636['_frame']['x']||_0x10dddd['texture']['frame']['y']!=_0x2e4636['_frame']['y']||_0x10dddd['texture']['frame']['width']!=_0x2e4636['_frame']['width']||_0x10dddd['texture']['frame']['height']!=_0x2e4636['_frame']['height']-_0x22077f['yCut']){_0x10dddd['texture']['frame']['x']=_0x2e4636['_frame']['x'];_0x10dddd['texture']['frame']['y']=_0x2e4636['_frame']['y'];_0x10dddd['texture']['frame']['width']=_0x2e4636['_frame']['width'];_0x10dddd['texture']['frame']['height']=_0x2e4636['_frame']['height']-_0x22077f['yCut'];_0x2e4636['textureLL']['frame']=_0x2e4636['textureLL']['frame'];}}else{if(!_0x2e4636['textureLLSpecial'])continue;if(_0x10dddd['texture']!=_0x2e4636['textureLLSpecial']){_0x10dddd['texture']=_0x2e4636['textureLLSpecial'];}}_0x205281=_0x17d61b['direction']();_0x10dddd['tint']=_0x22077f['tint'];_0x10dddd['x']=_0x23eb40+_0x22077f['offsetX']+_0x22077f['offsetDirX'][_0x205281];_0x10dddd['y']=_0x2183fb+_0x22077f['offsetY']+_0x22077f['offsetDirY'][_0x205281];_0x10dddd['alpha']=Math['floor'](_0x22077f['opacity']*_0x101d77['shadowCharacterMaxOpacity']*0x64*Math['min'](0x1,Math['max'](0x1-_0x3cd86f/_0x101d77['shadowCharacterMaxDistance'])))/0x64;if(_0x22077f['model'][0x0]==0x0){_0x10dddd['rotation']=_0x3430d9;_0x10dddd['skew']['x']=0x0;}else{_0x10dddd['rotation']=0x0;_0x10dddd['skew']['x']=-_0x3430d9;}_0x10dddd['scale']['y']=_0x3b02bf[_0x32dbec]['odata']['shadowCharacterShakeX'];if(_0x22077f['model'][0x1]==0x0){}else if(_0x22077f['model'][0x1]==0x1){_0x10dddd['scale']['y']*=_0x3cd86f/_0x22077f['model'][0x2];}else if(_0x22077f['model'][0x1]==0x2){_0x10dddd['scale']['y']*=Math['min'](Math['max'](0x2-_0x3cd86f/_0x22077f['model'][0x2],0.1),0x2);}}}};QJFrameLight['prototype']['initialize']=function(_0x413d1d,_0x1f6302,_0x2facdf,_0x440582){_0x440582=_0x440582||![];this['i']=_0x2facdf;this['n']=_0x413d1d;this['d']={};this['m']=0x0;this['t']=0x0;this['rt']=0x0;this['isMode']=!![];if(typeof _0x1f6302=='string'&&_0x1f6302['includes']('~')){let _0x473718=_0x1f6302['split']('~'),_0x47da7a=0x0,_0x5b3bd5=0x0,_0x1d395d;for(let _0x429fea=0x0,_0x486438=_0x473718['length'],_0x2e9070;_0x429fea<_0x486438;_0x429fea++){if(_0x473718[_0x429fea]['includes']('|')){_0x2e9070=_0x473718[_0x429fea]['split']('|');if(_0x2facdf==0x0)_0x47da7a=Number(_0x2e9070[0x1]);else if(_0x2facdf==0x1)_0x47da7a=_0x2e9070[0x1];else if(_0x2facdf==0x2)_0x47da7a=Number(_0x2e9070[0x1])*Math['PI']/0xb4;this['d'][this['m']]=_0x47da7a;if(_0x440582){for(let _0x102931=this['m'],_0x2c5d6f=Number(_0x2e9070[0x0]);_0x102931<_0x2c5d6f;_0x102931++){this['d'][_0x102931]=_0x47da7a;}}this['m']+=Number(_0x2e9070[0x0]);this['d'][this['m']]=_0x47da7a;}else if(_0x473718[_0x429fea]['includes']('/')){_0x2e9070=_0x473718[_0x429fea]['split']('/');_0x5b3bd5=Number(_0x2e9070[0x0]);if(_0x2facdf==0x0){_0x47da7a=Number(_0x2e9070[0x1]);_0x1d395d=this['d'][this['m']];for(let _0x24fce3=0x1;_0x24fce3<=_0x5b3bd5;_0x24fce3++){this['d'][this['m']+_0x24fce3]=_0x1d395d+(_0x47da7a-_0x1d395d)*_0x24fce3/_0x5b3bd5;}this['m']+=_0x5b3bd5;this['d'][this['m']]=_0x47da7a;}else if(_0x2facdf==0x1){_0x47da7a=QJ['LL']['hexToRgb'](_0x2e9070[0x1]);_0x1d395d=QJ['LL']['hexToRgb'](this['d'][this['m']]);for(let _0x2a6b25=0x1;_0x2a6b25<=_0x5b3bd5;_0x2a6b25++){this['d'][this['m']+_0x2a6b25]=QJ['LL']['rgbToHex']({'r':Math['floor'](_0x1d395d['r']+(_0x47da7a['r']-_0x1d395d['r'])*_0x2a6b25/_0x5b3bd5),'g':Math['floor'](_0x1d395d['g']+(_0x47da7a['g']-_0x1d395d['g'])*_0x2a6b25/_0x5b3bd5),'b':Math['floor'](_0x1d395d['b']+(_0x47da7a['b']-_0x1d395d['b'])*_0x2a6b25/_0x5b3bd5)});}this['m']+=_0x5b3bd5;this['d'][this['m']]=_0x2e9070[0x1];}else if(_0x2facdf==0x2){_0x47da7a=Number(_0x2e9070[0x1])*Math['PI']/0xb4;_0x1d395d=this['d'][this['m']];for(let _0x4b4d58=0x1;_0x4b4d58<=_0x5b3bd5;_0x4b4d58++){this['d'][this['m']+_0x4b4d58]=_0x1d395d+(_0x47da7a-_0x1d395d)*_0x4b4d58/_0x5b3bd5;}this['m']+=_0x5b3bd5;this['d'][this['m']]=_0x47da7a;}}else if(_0x473718[_0x429fea]['includes']('%')){_0x2e9070=_0x473718[_0x429fea]['split']('%');_0x5b3bd5=Number(_0x2e9070[0x0]);if(_0x2facdf==0x0){_0x47da7a=Number(_0x2e9070[0x1]);_0x1d395d=this['d'][this['m']];for(let _0x4171b8=0x1;_0x4171b8<=_0x5b3bd5;_0x4171b8++){this['d'][this['m']+_0x4171b8]=_0x47da7a-(_0x47da7a-_0x1d395d)*Math['sqrt'](0x1-Math['pow'](_0x4171b8/_0x5b3bd5,0x2));}this['m']+=_0x5b3bd5;this['d'][this['m']]=_0x47da7a;}else if(_0x2facdf==0x1){_0x47da7a=QJ['LL']['hexToRgb'](_0x2e9070[0x1]);_0x1d395d=QJ['LL']['hexToRgb'](this['d'][this['m']]);for(let _0x269a4c=0x1,_0x43301a;_0x269a4c<=_0x5b3bd5;_0x269a4c++){_0x43301a=Math['sqrt'](0x1-Math['pow'](_0x269a4c/_0x5b3bd5,0x2));this['d'][this['m']+_0x269a4c]=QJ['LL']['rgbToHex']({'r':Math['floor'](_0x47da7a['r']-(_0x47da7a['r']-_0x1d395d['r'])*_0x43301a),'g':Math['floor'](_0x47da7a['g']-(_0x47da7a['g']-_0x1d395d['g'])*_0x43301a),'b':Math['floor'](_0x47da7a['b']-(_0x47da7a['b']-_0x1d395d['b'])*_0x43301a)});}this['m']+=_0x5b3bd5;this['d'][this['m']]=_0x2e9070[0x1];}else if(_0x2facdf==0x2){_0x47da7a=Number(_0x2e9070[0x1])*Math['PI']/0xb4;_0x1d395d=this['d'][this['m']];for(let _0x1dda2a=0x1;_0x1dda2a<=_0x5b3bd5;_0x1dda2a++){this['d'][this['m']+_0x1dda2a]=_0x47da7a-(_0x47da7a-_0x1d395d)*Math['sqrt'](0x1-Math['pow'](_0x1dda2a/_0x5b3bd5,0x2));}this['m']+=_0x5b3bd5;this['d'][this['m']]=_0x47da7a;}}}}else{this['isMode']=![];let _0x54ca87;if(_0x2facdf==0x0)_0x54ca87=Number(_0x1f6302);else if(_0x2facdf==0x1)_0x54ca87=_0x1f6302;else if(_0x2facdf==0x2)_0x54ca87=Number(_0x1f6302)*Math['PI']/0xb4;this['d'][this['m']]=_0x54ca87;}};QJFrameLight['prototype']['get']=function(){if(this['t']>this['m'])this['t']=0x0;if(this['d'][this['t']]!=undefined)this['rt']=this['t'];this['t']++;return this['d'][this['rt']];};QJFrameLight['prototype']['getOnly']=function(){return this['d'][this['rt']];};QJFrameLight['prototype']['getTar']=function(_0x4c71f3){return this['d'][_0x4c71f3>this['m']?0x0:_0x4c71f3];};})();
//==========================================================
//
//==========================================================