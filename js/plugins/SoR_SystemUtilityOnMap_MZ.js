//=============================================================================
// SoR_SystemUtilityOnMap_MZ.js
// MIT License (C) 2020 蒼竜 @soryu_rpmaker
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Latest version v1.01 (2020/09/08)
//=============================================================================

/*:ja
* @plugindesc ＜マップイベント制作ユーティリティ＞
* @author 蒼竜　@soryu_rpmaker
* @help マップ上のイベントを作成する過程で必要となりそうな
* 各種関数をプラグインコマンド(及び直接スクリプトコール)で実行できる機能を追加します。
* 特に、複数スイッチの同時判断や複数アイテムの所持判定等、イベントコマンドが
* 長く複雑になってしまう傾向にある処理を１度のプラグインコマンドで呼び出せるため、
* イベントの軽量化に繋がります。
* プラグインコマンドで処理した結果は、任意のゲーム変数に格納されます。
*
* -----------------------------------------------------------
* バージョン情報
* -----------------------------------------------------------
* v1.01 (2020/09/08)      抽選機能の仕様と説明が一貫していなかった部分の修正
* v1.00 (2020/09/05)      公開
*
* @target MZ
* @url http://dragonflare.dip.jp/dcave/
*
* @command CalcL1Distance_EventAB_Var
* @text 2イベント間歩数[マップイベント制作ユーティリティ]
* @desc 指定した2つのイベント間の距離(歩数)を，指定の変数へ格納します。　特に 0:プレイヤー, -1:実行中イベントID
* @arg arg0
* @type number
* @text 対象イベント番号１
* @desc 対象イベント１つ目(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg0bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「イベント番号１」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg1
* @type number
* @text 対象イベント番号２
* @desc 対象イベント１つ目(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg1bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「イベント番号２」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg2
* @type number
* @text 結果を保持する変数の番号
* @desc ここに指定した番号の変数に、計算した２イベント間の距離を格納します
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」の変数に計算結果を格納します
* @default false
*
* @command CalcL2Distance_EventAB_Var
* @text 2イベント間直線距離[マップイベント制作ユーティリティ]
* @desc 指定した2つのイベント間の直線距離を，指定の変数へ格納します。　特に 0:プレイヤー, -1:実行中イベントID
* @arg arg0
* @type number
* @text 対象イベント番号１
* @desc 対象イベント１つ目(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg0bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「イベント番号１」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg1
* @type number
* @text 対象イベント番号２
* @desc 対象イベント１つ目(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg1bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「イベント番号２」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg2
* @type number
* @text 結果を保持する変数の番号
* @desc ここに指定した番号の変数に、計算した２イベント間の距離を格納します
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」の変数に計算結果を格納します
* @default false
*
* @command GetRangedRand_Var
* @text 指定範囲の乱数生成[マップイベント制作ユーティリティ]
* @desc 指定した[a,b]の範囲で乱数を生成し、指定番号の変数へ格納します。
* @arg arg0
* @type number
* @text 値a
* @desc 生成値の下限(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg0bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「値a」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg1
* @type number
* @text 値b
* @desc 生成値の上限(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg1bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「値b」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg2
* @type number
* @text 結果を保持する変数の番号
* @desc ここに指定した番号の変数に、計算した乱数値を格納します
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」の変数に計算結果を格納します
* @default false
*
* @command GetRangedLot_Var
* @text 乱数による抽選[マップイベント制作ユーティリティ]
* @desc 指定範囲[0,b]で乱数を生成し、それとaを比較した結果を指定番号の変数へ格納します。 (a以下:1, aより大:0)
* @arg arg0
* @type number
* @text 値a
* @desc 抽選(0,1を決定する)の閾値(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg0bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「値a」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg1
* @type number
* @text 値b
* @desc 抽選用乱数の最大値(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg1bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「値b」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg2
* @type number
* @text 結果を保持する変数の番号
* @desc ここに指定した番号の変数に、計算した結果を格納します
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」の変数に計算結果を格納します
* @default false
*
* @command CheckPlayerPos_Var
* @text プレイヤー位置判定[マップイベント制作ユーティリティ]
* @desc プレイヤーが指定した範囲内に存在するかを判断し、その結果を指定番号の変数へ格納します。 (条件を満たす:1, 満たさない:0)
* @arg arg0
* @type number
* @text x座標
* @desc 基準とするx座標(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg0bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「x座標」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg1
* @type number
* @text y座標
* @desc 基準とするy座標(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg1bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「y座標」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg2
* @type number
* @text 結果を保持する変数の番号
* @desc ここに指定した番号の変数に、計算した結果を格納します
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」の変数に計算結果を格納します
* @default false
* @arg arg0op
* @type select
* @option 無条件
* @value NoCond.
* @option xより大きい
* @value >
* @option xより小さい
* @value <
* @option x以上
* @value >=
* @option x以下
* @value <=
* @option xと等しい
* @value ==
* @option xと等しくない
* @value !=
* @default NoCond.
* @text 現在のプレイヤーx座標が...
* @desc プレイヤーのx座標に関する条件(演算子)
* @arg arg1op
* @type select
* @option 無条件
* @value NoCond.
* @option yより大きい
* @value >
* @option yより小さい
* @value <
* @option y以上
* @value >=
* @option y以下
* @value <=
* @option yと等しい
* @value ==
* @option yと等しくない
* @value !=
* @default NoCond.
* @text 現在のプレイヤーy座標が...
* @desc プレイヤーのy座標に関する条件(演算子)
*
* @command CheckEventPos_Var
* @text イベント位置判定[マップイベント制作ユーティリティ]
* @desc イベントが指定した範囲内に存在するかを判断し、その結果を指定番号の変数へ格納します。 (条件を満たす:1, 満たさない:0)
* @arg EvID
* @type number
* @text 判定するイベント
* @desc 対象イベントID(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい) (-1:呼び出したイベント自身)
* @arg EvIDbool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「判定するイベント」に格納されている変数の値のイベントを参照します (EvID=-1の時にtrueにしないで下さい)
* @default false
* @arg arg0
* @type number
* @text x座標
* @desc 基準とするx座標(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg0bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「x座標」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg1
* @type number
* @text y座標
* @desc 基準とするy座標(変数指定の場合は、変数番号を記入し変数オプションをtrueにして下さい)
* @arg arg1bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「y座標」に格納されている変数の値のイベントを参照します
* @default false
* @arg arg2
* @type number
* @text 結果を保持する変数の番号
* @desc ここに指定した番号の変数に、計算した結果を格納します
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」の変数に計算結果を格納します
* @default false
* @arg arg0op
* @type select
* @option 無条件
* @value NoCond.
* @option xより大きい
* @value >
* @option xより小さい
* @value <
* @option x以上
* @value >=
* @option x以下
* @value <=
* @option xと等しい
* @value ==
* @option xと等しくない
* @value !=
* @default NoCond.
* @text 現在の指定イベントのx座標が...
* @desc 指定イベントのx座標に関する条件(演算子)
* @arg arg1op
* @type select
* @option 無条件
* @value NoCond.
* @option yより大きい
* @value >
* @option yより小さい
* @value <
* @option y以上
* @value >=
* @option y以下
* @value <=
* @option yと等しい
* @value ==
* @option yと等しくない
* @value !=
* @default NoCond.
* @text 現在の指定イベントのy座標が...
* @desc 指定イベントのy座標に関する条件(演算子)
*
* @command CheckMultipleSwitches_Var
* @text 複合スイッチ条件判断[マップイベント制作ユーティリティ]
* @desc 指定の全スイッチの状態が満たされているかを調べた結果を変数に保存します (真:1, 偽:0)
* @arg trueS
* @type Number[]
* @text ON判定番号
* @desc 指定したX番のスイッチが全てONかどうかを調べます。(1つずつ入力)
* @default []
* @arg falseS
* @type Number[]
* @text OFF判定番号
* @desc 指定したX番のスイッチが全てOFFかどうかを調べます。(1つずつ入力)
* @default []
* @arg trueSV
* @type Number[]
* @text ON判定番号(変数で番号指定)
* @desc 指定した\V[X]番のスイッチが全てONかどうかを調べます。(1つずつ入力)
* @default []
* @arg falseSV
* @type Number[]
* @text OFF判定番号(変数で番号指定)
* @desc 指定した\V[X]番のスイッチが全てOFFかどうかを調べます。(1つずつ入力)
* @default []
* @arg arg2
* @type number
* @text 結果を保持する変数の番号
* @desc ここに指定した番号の変数に、計算した結果を格納します
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」の変数に計算結果を格納します
* @default false
*
* @command CheckMultipleVariables_Var
* @text 複合変数条件判断[マップイベント制作ユーティリティ]
* @desc 指定の全変数が与えられた条件を満たすかを調べた結果を変数に保存します。(真:1, 偽:0) 
* @arg vals
* @type struct<RangeVal>[]
* @text 変数条件
* @desc 各指定変数Xに対する条件を設定します。2<X<5や3≦X,X≧6のような条件も1度に設定できます。
* @default []
* @arg arg2
* @type number
* @text 結果を保持する変数の番号
* @desc ここに指定した番号の変数に、計算した結果を格納します
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」の変数に計算結果を格納します
* @default false
*
* @command CheckMultipleItems_Var
* @text 複合アイテム所持条件判断[マップイベント制作ユーティリティ]
* @desc 指定のアイテムの所持状態が満たされているかを調べた結果を変数に保存します (真:1, 偽:0)
* @arg posItems
* @type struct<MultiItems>[]
* @text アイテム所持判定
* @desc アイテムの所持条件を指定します。Numberを0個にすると「持っていない」になります。(未所持判定の演算子は==)
* @default []
* @arg posWeapons
* @type struct<MultiWeapons>[]
* @text 武器所持判定
* @desc 武器の所持条件を指定します。Numberを0個にすると「持っていない」になります。(未所持判定の演算子は==)
* @default []
* @arg posArmors
* @type struct<MultiArmors>[]
* @text 防具所持判定
* @desc 防具の所持条件を指定します。Numberを0個にすると「持っていない」になります。(未所持判定の演算子は==)
* @default []
* @arg arg2
* @type number
* @text 結果を保持する変数の番号
* @desc ここに指定した番号の変数に、計算した結果を格納します
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」の変数に計算結果を格納します
* @default false
*
* @command CheckActorCombinations_Var
* @text 複数アクター同行中判断[マップイベント制作ユーティリティ]
* @desc 指定のアクターたちがパーティー内にいるかを調べた結果を変数に保存します (戻り値:パーティー内に存在した人数, 0:誰もいない)
* @arg members
* @type actor[]
* @text 走査対象アクター
* @desc パーティー内にいるかどうかを調べるアクターを１人ずつ選択します
* @default []
* @arg arg2
* @type number
* @text 結果を保持する変数の番号
* @desc ここに指定した番号の変数に、検出した人数を格納します
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」の変数に計算結果を格納します
* @default false
*
* @command CheckSelfSwitchState_Var
* @text 指定イベント・セルフスイッチ条件判断[マップイベント制作ユーティリティ]
* @desc 同一マップ内にある、指定イベントのセルフスイッチ状態が条件を満たすかを調べた結果を変数に保存します (全て真:1, それ以外:0)
* @arg arg1
* @type Number
* @text 対象イベント(X)
* @desc IDがX番のイベントのセルフスイッチ状態を検査します。
* @arg arg1bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」を持つイベント\v[X]の検査に切り替えます。
* @default false
* @arg selfON
* @text セルフスイッチON
* @desc ONになっているかどうかを調べるセルフスイッチを設定します。
* @type select[]
* @option A
* @value A
* @option B
* @value B
* @option C
* @value C
* @option D
* @value D
* @default []
* @arg selfOFF
* @text セルフスイッチOFF
* @desc OFFになっているかどうかを調べるセルフスイッチを設定します。
* @type select[]
* @option A
* @value A
* @option B
* @value B
* @option C
* @value C
* @option D
* @value D
* @default []
* @arg arg2
* @type number
* @text 結果を保持する変数の番号
* @desc ここに指定した番号の変数に、計算した結果を格納します
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」の変数に計算結果を格納します
* @default false
*
* @command EraseTargetEV
* @text 指定マップイベント消去[マップイベント制作ユーティリティ]
* @desc IDを指定し、マップ上の任意のイベントを消去します。
* @arg arg2
* @type number
* @text 対象とするイベントID(X)
* @desc IDがXであるイベントをマップ上から消去します。
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照(\v[X])に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」のIDを持つイベント(\v[X])を消去します。
* @default false
*
* @command LockFocus_onTargetEV
* @text 対象指定コマンドID固定[マップイベント制作ユーティリティ]
* @desc 対象を指定するイベントコマンド類の対象設定を、指定の定数あるいは変数の持つID値で固定します。
* @arg arg2
* @type number
* @text 対象とするイベントID(X)
* @desc 一切の対象指定イベントの対象を、IDがXであるイベントとなるように強制します。
* @arg arg2bool
* @type boolean
* @text →指定した値の変数参照(\v[X])に切り替えるフラグ
* @desc trueにすると、「指定した番号の変数の値」のIDを持つイベント(\v[X])となるように強制します。
* @default false
* @command FreeFocus_onTargetEV
* @text 対象指定コマンドID固定解除[マップイベント制作ユーティリティ]
* @desc LockFocus_onTargetEventで強制している対象イベント設定を解除し、元に戻します。
*/

/*:
* @plugindesc <Utility for Events on the Map>
* @author @soryu_rpmaker
* @help This plugin implements plugin commands to help the map event construction.
* We can substitute a plugin command for complicated procedure in the event which usually 
* consists from several event commands, especially nested conditional branches.
* The result of plugin commands can be stored in game variables to use in event commands.
*
* -----------------------------------------------------------
* Version Info.
* -----------------------------------------------------------
* v1.01 (Sep. 8th, 2020)       Fix incoherent between the feature and description of Random Lot
* v1.00 (Sep. 5th, 2020)       released!
*
* @target MZ
* @url http://dragonflare.dip.jp/dcave/index_e.php
*
* @command CalcL1Distance_EventAB_Var
* @text Manhattan distance[Utility for Events on the Map]
* @desc The sum of difference of x and y coordinates respectively between 2 events. Note) 0:Player, -1:This event
* @arg arg0
* @type number
* @text Target Event 1
* @desc 1st target (To specify by using the variable, let true the following option.)
* @arg arg0bool
* @type boolean
* @text -> Flag to use the variable for target event decision
* @desc If true, the event whose ID is \v[Target Event 1] is targetted.
* @default false
* @arg arg1
* @type number
* @text Target Event 2
* @desc 2st target (To specify by using the variable, let true the following option.)
* @arg arg1bool
* @type boolean
* @text -> Flag to use the variable for target event decision
* @desc If true, the event whose ID is \v[Target Event 2] is targetted.
* @default false
* @arg arg2
* @type number
* @text Variable ID to store the result
* @desc Write a constant to store the distance between two events.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable for target event decision
* @desc If true, the result is stored in the variable whose ID is \v[ID].
* @default false
*
* @command CalcL2Distance_EventAB_Var
* @text Euclidean distance[Utility for Events on the Map]
* @desc Calculate direct distance between 2 events. Note) 0:Player, -1:This event
* @arg arg0
* @type number
* @text Target Event 1
* @desc 1st target (To specify by using the variable, let true the following option.)
* @arg arg0bool
* @type boolean
* @text -> Flag to use the variable for target event decision
* @desc If true, the event whose ID is \v[Target Event 1] is targetted.
* @default false
* @arg arg1
* @type number
* @text Target Event 2
* @desc 2st target (To specify by using the variable, let true the following option.)
* @arg arg1bool
* @type boolean
* @text -> Flag to use the variable for target event decision
* @desc If true, the event whose ID is \v[Target Event 2] is targetted.
* @default false
* @arg arg2
* @type number
* @text Variable ID to store the result
* @desc Write a constant to store the distance between two events.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable for target event decision
* @desc If true, the result is stored in the variable whose ID is \v[ID].
* @default false
*
* @command GetRangedRand_Var
* @text Random Number Generator[Utility for Events on the Map]
* @desc Generate a number between [a,b] and store in the variable.
* @arg arg0
* @type number
* @text Value a
* @desc Minimum value (To specify by using the variable, let true the following option.)
* @arg arg0bool
* @type boolean
* @text -> Flag to use the variable
* @desc If true, the event whose ID is \v[a] is targetted.
* @default false
* @arg arg1
* @type number
* @text Value b
* @desc Maximum value (To specify by using the variable, let true the following option.)
* @arg arg1bool
* @type boolean
* @text -> Flag to use the variable
* @desc If true, the event whose ID is \v[b] is targetted.
* @default false
* @arg arg2
* @type number
* @text Variable ID to store the result
* @desc Write a constant to store the result.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable
* @desc If true, the result is stored in the variable whose ID is \v[ID].
* @default false
*
* @command GetRangedLot_Var
* @text Lot Generator[Utility for Events on the Map]
* @desc Generate random number between [0,b], and compare it with a. Note) Less than and equal to a:1, Greater than a:0
* @arg arg0
* @type number
* @text Value a
* @desc Threshold of Lot (To specify by using the variable, let true the following option.)
* @arg arg0bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the event whose ID is \v[a] is targetted.
* @default false
* @arg arg1
* @type number
* @text Value b
* @desc Maximum value of random number (To specify by using the variable, let true the following option.)
* @arg arg1bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the event whose ID is \v[b] is targetted.
* @default false
* @arg arg2
* @type number
* @text Variable ID to store the result
* @desc Write a constant to store the result.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the result is stored in the variable whose ID is \v[ID].
* @default false
*
* @command CheckPlayerPos_Var
* @text Player Position Judgement [Utility for Events on the Map]
* @desc Check whether the player's position fulfills specified conditions. Note) Yes:1, No:0
* @arg arg0
* @type number
* @text x-coordinate
* @desc Criteria x (To specify by using the variable, let true the following option.)
* @arg arg0bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the event whose ID is \v[x] is targetted.
* @default false
* @arg arg1
* @type number
* @text y-coordinate
* @desc Criteria y (To specify by using the variable, let true the following option.)
* @arg arg1bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the event whose ID is \v[y] is targetted.
* @default false
* @arg arg2
* @type number
* @text Variable ID to store the result
* @desc Write a constant to store the result.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the result is stored in the variable whose ID is \v[ID].
* @default false
*

* @arg arg0op
* @type select
* @option no condition
* @value NoCond.
* @option greater than x
* @value >
* @option less than x
* @value <
* @option greater than or equal to x
* @value >=
* @option less than or equal to x
* @value <=
* @option equal to x
* @value ==
* @option not equal to x
* @value !=
* @default NoCond.
* @text opeartion
* @desc binary operation to compare (For x)
* @arg arg1op
* @type select
* @option no condition
* @value NoCond.
* @option greater than y
* @value >
* @option less than y
* @value <
* @option greater than or equal to y
* @value >=
* @option less than or equal to y
* @value <=
* @option equal to y
* @value ==
* @option not equal to y
* @value !=
* @default NoCond.
* @text opeartion
* @desc binary operation to compare (For y)
*
* @command CheckEventPos_Var
* @text Event Position Judgement [Utility for Events on the Map]
* @desc Check whether the specified event's position fulfills specified conditions. Note) Yes:1, No:0
* @arg EvID
* @type number
* @text Target Event
* @desc Terget Event ID (To specify by using the variable, let true the following option.))
* @default false
* @arg EvIDbool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the event whose ID is \v[ID] is targetted.
* @default false
* @arg arg0
* @type number
* @text x-coordinate
* @desc Criteria x (To specify by using the variable, let true the following option.)
* @arg arg0bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the event whose ID is \v[x] is targetted.
* @default false
* @arg arg1
* @type number
* @text y-coordinate
* @desc Criteria y (To specify by using the variable, let true the following option.)
* @arg arg1bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the event whose ID is \v[y] is targetted.
* @default false
* @arg arg2
* @type number
* @text Variable ID to store the result
* @desc Write a constant to store the result.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the result is stored in the variable whose ID is \v[ID].
* @default false

* @arg arg0op
* @type select
* @option no condition
* @value NoCond.
* @option greater than x
* @value >
* @option less than x
* @value <
* @option greater than or equal to x
* @value >=
* @option less than or equal to x
* @value <=
* @option equal to x
* @value ==
* @option not equal to x
* @value !=
* @default NoCond.
* @text opeartion
* @desc binary operation to compare (For x)
* @arg arg1op
* @type select
* @option no condition
* @value NoCond.
* @option greater than y
* @value >
* @option less than y
* @value <
* @option greater than or equal to y
* @value >=
* @option less than or equal to y
* @value <=
* @option equal to y
* @value ==
* @option not equal to y
* @value !=
* @default NoCond.
* @text opeartion
* @desc binary operation to compare (For y)
*
* @command CheckMultipleSwitches_Var
* @text Multiple conditions for Switches[Utility for Events on the Map]
* @desc Check the all conditions for switches and store the result in the variable Note) Yes:1, No:0
* @arg trueS
* @type Number[]
* @text Switches ID to check whether ON
* @desc Check each switch ON
* @default []
* @arg falseS
* @type Number[]
* @text Switches ID to check whether OFF
* @desc Check each switch OFF
* @default []
* @arg trueSV
* @type Number[]
* @text Switches \V[ID] to check whether ON
* @desc Check each switch specified by the variables ON
* @default []
* @arg falseSV
* @type Number[]
* @text Switches \V[ID] to check whether OFF
* @desc Check each switch specified by the variables OFF
* @default []
* @arg arg2
* @type number
* @text Variable ID to store the result
* @desc Write a constant to store the distance between two events.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable for target event decision
* @desc If true, the result is stored in the variable whose ID is \v[ID].
* @default false
*
* @command CheckMultipleVariables_Var
* @text Multiple conditions for Variables[Utility for Events on the Map]
* @desc Check the all conditions for variables and store the result in the variable Note) Yes:1, No:0
* @arg vals
* @type struct<RangeValE>[]
* @text Target Variables and Conditions
* @desc Make conditions for variables as needed.
* @default []
* @arg arg2
* @type number
* @text Variable ID to store the result
* @desc Write a constant to store the distance between two events.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable for target event decision
* @desc If true, the result is stored in the variable whose ID is \v[ID].
* @default false
*
* @command CheckMultipleItems_Var
* @text Multiple conditions for Items[Utility for Events on the Map]
* @desc Check the all conditions for Item (& Equips) and store the result in the variable Note) Yes:1, No:0
* @arg posItems
* @type struct<MultiItemsE>[]
* @text Target Items
* @desc Specify the condition for items. Set conditional number as 0 to check "not possessed".
* @default []
* @arg posWeapons
* @type struct<MultiWeaponsE>[]
* @text Target Weapons
* @desc Specify the condition for weapons. Set conditional number as 0 to check "not possessed".
* @default []
* @arg posArmors
* @type struct<MultiArmorsE>[]
* @text Target Armors
* @desc Specify the condition for armors. Set conditional number as 0 to check "not possessed".
* @default []
* @arg arg2
* @type number
* @text Variable ID to store the result
* @desc Write a constant to store the distance between two events.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable for target event decision
* @desc If true, the result is stored in the variable whose ID is \v[ID].
* @default false
*
* @command CheckActorCombinations_Var
* @text Multiple conditions for actors in the party  [* @text Multiple conditions for actors in the party  [Utility for Events on the Map]
* @desc Check the specified actors joined in the party. (return:number of actors in the party, 0:no one)
* @arg members
* @type actor[]
* @text Target actors
* @desc Specify actors to check in the party
* @default []
* @arg arg2
* @type number
* @text Variable ID to store the result
* @desc Write a constant to store the distance between two events.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable for target event decision
* @desc If true, the result is stored in the variable whose ID is \v[ID].
* @default false
*
* @command CheckSelfSwitchState_Var
* @text Multiple conditions for self-switches[Utility for Events on the Map]
* @desc Check the all conditions for self-switches of the target event and store the result in the variable Note) Yes:1, No:0
* @arg arg1
* @type Number
* @text Target Event (X)
* @desc Target event to check its the state of self-switches
* @arg arg1bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the event whose ID is \v[x] is targetted.
* @default false
* @arg selfON
* @text Self-switches should be ON
* @desc Check specified self-switche whether it is ON
* @type select[]
* @option A
* @value A
* @option B
* @value B
* @option C
* @value C
* @option D
* @value D
* @default []
* @arg selfOFF
* @text Self-switches should be OFF
* @desc Check specified self-switche whether it is OFF
* @type select[]
* @option A
* @value A
* @option B
* @value B
* @option C
* @value C
* @option D
* @value D
* @default []
* @arg arg2
* @type number
* @text Variable ID to store the result
* @desc Write a constant to store the distance between two events.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable for target event decision
* @desc If true, the result is stored in the variable whose ID is \v[ID].
* @default false
*
* @command EraseTargetEV
* @text Erase Target Event[Utility for Events on the Map]
* @desc Delete specified event on the map.
* @arg arg2
* @type number
* @text Target Event (X)
* @desc Specify ID of the event to be deleted.
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the event whose ID is \v[x] is targetted.
* @default false
*
* @command LockFocus_onTargetEV
* @text Lock the target of event commands[Utility for Events on the Map]
* @desc Lock the target event of all event commands to the specified event.
* @arg arg2
* @type number
* @text Target Event (X)
* @desc Lock the target event of all event commands to that whose ID is X. 
* @arg arg2bool
* @type boolean
* @text -> Flag to use the variable 
* @desc If true, the event whose ID is \v[X] is targetted.
* @default false
* @command FreeFocus_onTargetEV
* @text Release the target lock of event commands[Utility for Events on the Map]
* @desc Revert target lock settings by LockFocus_onTargetEvent.
*/


/*~struct~MultiItems:
* @param Item
* @type item
* @text アイテム
* @desc 対象とするアイテム
* @param Number
* @type number
* @text 個数(X)
* @desc 基準とする個数
* @default 0
* @param Operation
* @type select
* @option X個より大きい
* @value >
* @option X個より小さい
* @value <
* @option X個以上
* @value >=
* @option X個以下
* @value <=
* @option X個と等しい
* @value ==
* @option X個と等しくない
* @value !=
* @default ==
* @text アイテムの個数はXより...
* @desc 条件(演算子)
*/
/*~struct~MultiWeapons:
* @param Item
* @type weapon
* @text 武器
* @desc 対象とする武器
* @param Number
* @type number
* @text 個数(X)
* @desc 基準とする個数
* @default 0
* @param Operation
* @type select
* @option X個より大きい
* @value >
* @option X個より小さい
* @value <
* @option X個以上
* @value >=
* @option X個以下
* @value <=
* @option X個と等しい
* @value ==
* @option X個と等しくない
* @value !=
* @default ==
* @text 武器の個数はXより...
* @desc 条件(演算子)
*/
/*~struct~MultiArmors:
* @param Item
* @type armor
* @text 防具
* @desc 対象とする防具
* @param Number
* @type number
* @text 個数(X)
* @desc 基準とする個数
* @default 0
* @param Operation
* @type select
* @option X個より大きい
* @value >
* @option X個より小さい
* @value <
* @option X個以上
* @value >=
* @option X個以下
* @value <=
* @option X個と等しい
* @value ==
* @option X個と等しくない
* @value !=
* @default ==
* @text 防具の個数はXより...
* @desc 条件(演算子)
*/

/*~struct~RangeVal:
* @param TargetVal
* @text 対象変数
* @type number
* @desc 対象の変数番号(X)
* @param TVariableFlag
* @text 変数の値で参照するフラグ(X)
* @default false
* @type boolean
* @desc true: \v[X]番の変数を指定する
*
* @param val1
* @type number
* @text Y
* @desc 比較対象の値(Y) 空欄にすると、条件判定を無視できます
* @param val1vflag
* @type boolean
* @desc true: \v[Y]番の変数を指定する
* @text 変数の値で参照するフラグ(Y)
* @default false
* @param Op1
* @type select
* @option XはYより大きい
* @value >
* @option XはYより小さい
* @value <
* @option Xはy以上
* @value >=
* @option Xはy以下
* @value <=
* @option Xはyと等しい
* @value ==
* @option XはYと等しくない
* @value !=
* @default ==
* @text XはYと比べて…
* @desc 値Yに対する条件(演算子)
*
* @param val2
* @text Z
* @type number
* @desc 比較対象の値(Z) 空欄にすると、条件判定を無視できます
* @param val2vflag
* @type boolean
* @desc true: \v[Z]番の変数を指定する
* @text 変数の値で参照するフラグ(Z)
* @default false
* @param Op2
* @type select
* @option XはZより大きい
* @value >
* @option XはZより小さい
* @value <
* @option XはZ以上
* @value >=
* @option XはZ以下
* @value <=
* @option XはZと等しい
* @value ==
* @option XはZと等しくない
* @value !=
* @default ==
* @text XはZと比べて…
* @desc 値Zに対する条件(演算子)
*/



/*~struct~MultiItemsE:
* @param Item
* @type item
* @param Number
* @type number
* @default 0
* @param Operation
* @type select
* @option greater than Number
* @value >
* @option less than Number
* @value <
* @option greater than or equal to Number
* @value >=
* @option less than or equal to Number
* @value <=
* @option equal to Number
* @value ==
* @option not equal to Number
* @value !=
* @default ==
* @text opeartion
* @desc binary operation to compare
*/
/*~struct~MultiWeaponsE:
* @param Item
* @type weapon
* @param Number
* @type number
* @default 0
* @param Operation
* @type select
* @option greater than Number
* @value >
* @option less than Number
* @value <
* @option greater than or equal to Number
* @value >=
* @option less than or equal to Number
* @value <=
* @option equal to Number
* @value ==
* @option not equal to Number
* @value !=
* @default ==
* @text opeartion
* @desc binary operation to compare
*/
/*~struct~MultiArmorsE:
* @param Item
* @type armor
* @param Number
* @type number
* @default 0
* @param Operation
* @type select
* @option greater than Number
* @value >
* @option less than Number
* @value <
* @option greater than or equal to Number
* @value >=
* @option less than or equal to Number
* @value <=
* @option equal to Number
* @value ==
* @option not equal to Number
* @value !=
* @default ==
* @text opeartion
* @desc binary operation to compare
*/

/*~struct~RangeValE:
* @param TargetVal
* @text X
* @type number
* @desc Target Variable ID(X)
* @param TVariableFlag
* @text X_VariableFlag
* @default false
* @type boolean
* @desc true: Specify \v[X] (value of the variable whose ID is X)
*
* @param val1
* @type number
* @text Y
* @desc Target Variable ID(Y). Leave it brank to ignore.
* @param val1vflag
* @type boolean
* @desc true: Specify \v[Y] 
* @text Y_VariableFlag
* @default false
* @param Op1
* @type select
* @option X is greater than Y.
* @value >
* @option X is less than Y.
* @value <
* @option X is greater than or equal to Y.
* @value >=
* @option X is less than or equal to Y.
* @value <=
* @option X is equal to Y.
* @value ==
* @option X is not equal to Y.
* @value !=
* @default ==
* @text Y_operation
* @desc binary operation to compare for Y
*
* @param val2
* @text Z
* @type number
* @desc Target Variable ID(Z). Leave it brank to ignore.
* @param val2vflag
* @type boolean
* @desc true: Specify \v[Z] 
* @text Z_VariableFlag
* @default false
* @param Op2
* @type select
* @option X is greater than Z.
* @value >
* @option X is less than Z.
* @value <
* @option X is greater than or equal to Z.
* @value >=
* @option X is less than or equal to Z.
* @value <=
* @option X is equal to Z.
* @value ==
* @option X is not equal to Z.
* @value !=
* @default ==
* @text Z_operation
* @desc binary operation to compare for Z
*/


(function() {
	const pluginName = "SoR_SystemUtilityOnMap_MZ";


////////////////////////////////////////////////////////////////////
PluginManager.registerCommand(pluginName, "CalcL1Distance_EventAB_Var", args => { 
	$gameTemp.CalcL1Distance_EventAB_V(args.arg0,args.arg1,args.arg2,args.arg0bool,args.arg1bool,args.arg2bool);
});
PluginManager.registerCommand(pluginName, "CalcL2Distance_EventAB_Var", args => { 
	$gameTemp.CalcL2Distance_EventAB_V(args.arg0,args.arg1,args.arg2,args.arg0bool,args.arg1bool,args.arg2bool);
});
PluginManager.registerCommand(pluginName, "GetRangedRand_Var", args => { 
	$gameTemp.GetRangedRand_V(args.arg0,args.arg1,args.arg2,args.arg0bool,args.arg1bool,args.arg2bool);
});
PluginManager.registerCommand(pluginName, "GetRangedLot_Var", args => { 
	$gameTemp.GetRandLot_V(args.arg0,args.arg1,args.arg2,args.arg0bool,args.arg1bool,args.arg2bool);
});
PluginManager.registerCommand(pluginName, "CheckPlayerPos_Var", args => { 
	$gameTemp.CheckPlayerPos_V(args.arg0,args.arg1,args.arg2,args.arg0bool,args.arg1bool,args.arg2bool,args.arg0op,args.arg1op);
});
PluginManager.registerCommand(pluginName, "CheckEventPos_Var", args => { 
	$gameTemp.CheckEventPos_V(args.EvID,args.EvIDbool,args.arg0,args.arg1,args.arg2,args.arg0bool,args.arg1bool,args.arg2bool,args.arg0op,args.arg1op);
});
PluginManager.registerCommand(pluginName, "CheckMultipleSwitches_Var", args => { 
	$gameTemp.CheckMultipleSwitches_V(args.trueS,args.falseS,args.trueSV,args.falseSV,args.arg2,args.arg2bool);
});
PluginManager.registerCommand(pluginName, "CheckMultipleVariables_Var", args => { 
	$gameTemp.CheckMultipleVariables_V(args.vals,args.arg2,args.arg2bool);
});
PluginManager.registerCommand(pluginName, "CheckMultipleItems_Var", args => { 
	$gameTemp.CheckMultipleItems_V(args.posItems,args.posWeapons,args.posArmors,args.arg2,args.arg2bool);
});
PluginManager.registerCommand(pluginName, "CheckActorCombinations_Var", args => { 
	$gameTemp.CheckActorCombinations_V(args.members,args.arg2,args.arg2bool);
});
PluginManager.registerCommand(pluginName, "CheckSelfSwitchState_Var", args => { 
	$gameTemp.CheckSelfSwitchState_V(args.arg1,args.arg1bool,args.selfON,args.selfOFF,args.arg2,args.arg2bool);
});
PluginManager.registerCommand(pluginName, "EraseTargetEV", args => { 
	$gameTemp.EraseTargetEvent(args.arg2,args.arg2bool);
});
PluginManager.registerCommand(pluginName, "LockFocus_onTargetEV", args => { 
	$gameTemp.LockFocus_onTargetEvent(args.arg2,args.arg2bool);
});
PluginManager.registerCommand(pluginName, "FreeFocus_onTargetEV", args => { 
	$gameTemp.FreeFocus_onTargetEvent();
});





/////////////////////////////////////////////////////////////////////
Game_Temp.prototype.EraseTargetEvent = function(vid,vid_vf){
	vid = ConvertInt2Val(vid,vid_vf);
	if(isNaN(vid)) return undefined;
	$gameMap.eraseEvent(vid);
}

/////////////////////////////////////////////////////////////////////
Game_Temp.prototype.CheckSelfSwitchState_V = function(tar,tar_vf,ons,offs,vid,vid_vf){
	if(isNaN(tar) || isNaN(vid)) return undefined;
	vid = ConvertInt2Val(vid,vid_vf);
	const tarEV = ConvertInt2Val(tar,tar_vf);
	
	let ONs = [];
	let OFFs = [];
	for(let i=0; i<ons.length;i++) if(ons.charCodeAt(i)>=65 && ons.charCodeAt(i)<=68) ONs.push(ons[i]);
	for(let i=0; i<offs.length;i++) if(offs.charCodeAt(i)>=65 && offs.charCodeAt(i)<=68) OFFs.push(offs[i]);

	const ONL = ONs.length;
	const OFFL = OFFs.length;

	for(let i=0; i<ONL; i++){
		if(tar <= 0) continue;
		const key = [$gameMap._mapId, tar, ONs[i]];
		console.log($gameSelfSwitches.value(key))
		if(!$gameSelfSwitches.value(key)){$gameVariables.setValue(vid,0); return;}
	}
	for(let i=0; i<OFFL; i++){
		if(tar <= 0) continue;
		const key = [$gameMap._mapId, tar, OFFs[i]];
		if($gameSelfSwitches.value(key)){$gameVariables.setValue(vid,0); return;}
	}

	$gameVariables.setValue(vid,1);//true
}




/////////////////////////////////////////////////////////////////////
Game_Temp.prototype.CheckActorCombinations_V = function(members,vid,vid_vf){
	if(isNaN(vid)) return undefined;
	vid = ConvertInt2Val(vid,vid_vf);

	const actors = convertItemsParam(members);
	const AL = actors.length;

	let num = 0;
	for(let i=0; i<AL; i++){
		if($gameParty._actors.includes(actors[i])) num++;
	}

	$gameVariables.setValue(vid,num);//true
}

/////////////////////////////////////////////////////////////////////
Game_Temp.prototype.CheckMultipleItems_V = function(it,we,ar,vid,vid_vf){
	if(isNaN(vid)) return undefined;
	vid = ConvertInt2Val(vid,vid_vf);

	const items = convertItemsParam(it);
	const weapons =	convertItemsParam(we);
	const armors = convertItemsParam(ar);

	const IL = items.length;
	const WL = weapons.length;
	const AL = armors.length;

	for(let i=0; i<IL; i++){
		const id = items[i].Item	
		const n = items[i].Number	
		const op = items[i].Operation
		const posses = $gameParty.numItems($dataItems[id]);

		if(op){
			 if(!CompareNumbers(posses,n,op)) {$gameVariables.setValue(vid,0); return;}
			 console.log("ddd")
			 if((op == "<" || op == "<=") && posses <= 0) {$gameVariables.setValue(vid,0); return;}
		}
	}

	for(let i=0; i<WL; i++){
		const id = weapons[i].Item	
		const n = weapons[i].Number	
		const op = weapons[i].Operation
		const posses = $gameParty.numItems($dataWeapons[id]);
		if(op){
			 if(!CompareNumbers(posses,n,op)) {$gameVariables.setValue(vid,0); return;}
			 if((op == "<" || op == "<=") && posses <= 0) {$gameVariables.setValue(vid,0); return;}
		}
	}

	for(let i=0; i<AL; i++){
		const id = armors[i].Item	
		const n = armors[i].Number	
		const op = armors[i].Operation
		const posses = $gameParty.numItems($dataArmors[id]);
		if(op){
			 if(!CompareNumbers(posses,n,op)) {$gameVariables.setValue(vid,0); return;}
			 if((op == "<" || op == "<=") && posses <= 0) {$gameVariables.setValue(vid,0); return;}
		}
	}
	
	$gameVariables.setValue(vid,1);//true
}


////////////////////////////////////////////////////////////////////////////

Game_Temp.prototype.CheckMultipleVariables_V = function(a,vid,vid_vf){
	if(isNaN(vid)) return undefined;
	vid = ConvertInt2Val(vid,vid_vf);

	const List = convertItemsParam(a);　
	const AL = List.length;

	for(let i=0; i<AL; i++){
		if(List[i].TargetVal === "") continue;
		const tv = $gameVariables.value(ConvertInt2Val(List[i].TargetVal,List[i].TVariableFlag));
		const v1 = ConvertInt2Val(List[i].val1,List[i].val1vflag);
		const v2 = ConvertInt2Val(List[i].val2,List[i].val2vflag);
		const op1 = CheckOpCode(List[i].Op1);
		const op2 = CheckOpCode(List[i].Op2);

		let cond1 = v1!=""? CompareNumbers(tv,v1,op1) : true;
		let cond2 = v2!=""? CompareNumbers(tv,v2,op2) : true;
		if(!cond1||!cond2){$gameVariables.setValue(vid,0); return;}
	}

	$gameVariables.setValue(vid,1);//true
}


////////////////////////////////////////////////////////////////////////////


Game_Temp.prototype.CheckMultipleSwitches_V = function(a,b,c,d,vid,vid_vf){
	if(isNaN(vid)) return undefined;	
	vid = ConvertInt2Val(vid,vid_vf);

	const AL = a.length;
	const BL = b.length;
	const CL = c.length;
	const DL = d.length;

	for(let i=0; i<AL; i++){
		if(isNaN(a[i])) continue;
		if(!CheckSwitchState(a[i])){$gameVariables.setValue(vid,0); return;}
	}
	for(let i=0; i<BL; i++){
		if(isNaN(b[i])) continue;
		if(CheckSwitchState(b[i])) {$gameVariables.setValue(vid,0); return;}
	}
	for(let i=0; i<CL; i++){
		if(isNaN(c[i])) continue;
		if(!CheckSwitchState($gameVariables.value(c[i]))) {$gameVariables.setValue(vid,0); return;}
	}
	for(let i=0; i<DL; i++){
		if(isNaN(d[i])) continue;
		if(CheckSwitchState($gameVariables.value(d[i]))){$gameVariables.setValue(vid,0); return;}
	}

	$gameVariables.setValue(vid,1);//true
}



////////////////////////////////////////////////////////////////////////////


Game_Temp.prototype.GetRangedRand = function(a,b,a_vf,b_vf){
	if(isNaN(a) || isNaN(b)) return undefined;

	if(a_vf==true) a = $gameVariables.value(a);
	if(b_vf==true) b = $gameVariables.value(b);
	a = Math.ceil(a);
	b = Math.floor(b);
	if(b<a){const tmp = a; a=b; b=tmp;}

	return Math.round((Math.random() * (b - a + 0.9998)) - 0.4999 + a);
}
Game_Temp.prototype.GetRangedRand_V = function(a,b,vid,a_vf,b_vf,vid_vf){
	if(isNaN(a) || isNaN(b) || isNaN(vid)) return undefined;

	a = ConvertInt2Val(a,a_vf);
	b = ConvertInt2Val(b,b_vf);
	vid = ConvertInt2Val(vid,vid_vf);

	a = Math.ceil(a);
	b = Math.floor(b);
	if(b<a){const tmp = a; a=b; b=tmp;}

	$gameVariables.setValue(vid,Math.round((Math.random() * (b - a + 0.9998)) - 0.4999 + a));
}



////////////////////////////////////////////////////////////////////

Game_Temp.prototype.GetRandLot = function(a,b,a_vf,b_vf){
	if(isNaN(a) || isNaN(b)) return undefined;

	a = ConvertInt2Val(a,a_vf);
	b = ConvertInt2Val(b,b_vf);

	const lot = Math.floor(this.GetRangedRand(0,b));
	if(a>=lot) return true;
	else return false;
}
Game_Temp.prototype.GetRandLot_V = function(a,b,vid,a_vf,b_vf,vid_vf){
	if(isNaN(a) || isNaN(b)) return undefined;

	a = ConvertInt2Val(a,a_vf);
	b = ConvertInt2Val(b,b_vf);
	vid = ConvertInt2Val(vid,vid_vf);

	const lot = Math.floor(this.GetRangedRand(0,b));
	let res;
	if(a>=lot) res = 1;
	else res = 0;

	$gameVariables.setValue(vid,res);
}



////////////////////////////////////////////////////////////////////

Game_Temp.prototype.CalcL2Distance_EventAB = function(a,b,a_vf,b_vf){
	if(isNaN(a) || isNaN(b)) return -1;

	a = ConvertInt2Val(a,a_vf);
	b = ConvertInt2Val(b,b_vf);

	const symbol_a = ExtractGameSymbol(a);
	const symbol_b = ExtractGameSymbol(b);
	if(symbol_a == null || symbol_b == null) return -1;
	
	return L2Norm(symbol_a,symbol_b);
}
Game_Temp.prototype.CalcL2Distance_EventAB_V = function(a,b,vid,a_vf,b_vf,vid_vf){
	if(isNaN(a) || isNaN(b) || isNaN(vid)) return -1;

	a = ConvertInt2Val(a,a_vf);
	b = ConvertInt2Val(b,b_vf);
	vid = ConvertInt2Val(vid,vid_vf);

	const symbol_a = ExtractGameSymbol(a);
	const symbol_b = ExtractGameSymbol(b);
	if(symbol_a == null || symbol_b == null) return -1;

	$gameVariables.setValue(vid,L2Norm(symbol_a,symbol_b));
}

////////////////////////////////////////////////////////////////////

Game_Temp.prototype.CalcL1Distance_EventAB = function(a,b,a_vf,b_vf){
	if(isNaN(a) || isNaN(b)) return -1;

	a = ConvertInt2Val(a,a_vf);
	b = ConvertInt2Val(b,b_vf);

	const symbol_a = ExtractGameSymbol(a);
	const symbol_b = ExtractGameSymbol(b);
	if(symbol_a == null || symbol_b == null) return -1;
	
	return L1Norm(symbol_a,symbol_b);
}
Game_Temp.prototype.CalcL1Distance_EventAB_V = function(a,b,vid,a_vf,b_vf,vid_vf){
	if(isNaN(a) || isNaN(b) || isNaN(vid)) return -1;

	a = ConvertInt2Val(a,a_vf);
	b = ConvertInt2Val(b,b_vf);
	vid = ConvertInt2Val(vid,vid_vf);

	const symbol_a = ExtractGameSymbol(a);
	const symbol_b = ExtractGameSymbol(b);
	if(symbol_a == null || symbol_b == null) return -1;

	$gameVariables.setValue(vid,L1Norm(symbol_a,symbol_b));
}



////////////////////////////////////////////////////////////////////////////////

Game_Temp.prototype.CheckPlayerPos = function(x,y,x_vf,y_vf,opX,opY){
	if(isNaN(x) || isNaN(y)) return undefined;

	const op1 = CheckOpCode(opX);
	const op2 = CheckOpCode(opY);
	if(x_vf==true) x = $gameVariables.value(x);
	if(y_vf==true) y = $gameVariables.value(y);
	
	const P = $gamePlayer;
	let ret1 = true, ret2 = true;
	if(op1) ret1 = CompareNumbers(x,P.x,op1);
	if(op2) ret2 = CompareNumbers(y,P.y,op2);

	return ret1 && ret2;
}

Game_Temp.prototype.CheckPlayerPos_V = function(x,y,vid,x_vf,y_vf,vid_vf,opX,opY){
	if(isNaN(x) || isNaN(y) || isNaN(vid)) return -1;

	const op1 = CheckOpCode(opX);
	const op2 = CheckOpCode(opY);
	if(x_vf==true) x = $gameVariables.value(x);
	if(y_vf==true) y = $gameVariables.value(y);
	vid = ConvertInt2Val(vid,vid_vf);
	
	const P = $gamePlayer;
	let ret1 = true, ret2 = true;
	if(op1) ret1 = CompareNumbers(P.x,x,op1);
	if(op2) ret2 = CompareNumbers(P.y,y,op2);

 
	if(ret1 && ret2) $gameVariables.setValue(vid,1);
	else $gameVariables.setValue(vid,0);
}


////////////////////////////////////////////////////////////////////////////////

Game_Temp.prototype.CheckEventPos = function(EID,E_vf,x,y,x_vf,y_vf,opX,opY){
	if(isNaN(EID) || isNaN(x) || isNaN(y)) return undefined;

	const op1 = CheckOpCode(opX);
	const op2 = CheckOpCode(opY);
	if(x_vf==true) x = $gameVariables.value(x);
	if(y_vf==true) y = $gameVariables.value(y);
	if(E_vf==true) EID = $gameVariables.value(EID);
	
	const P = ExtractGameSymbol(EID);
	if(P==null)  return undefined;

	let ret1 = true, ret2 = true;
	if(op1) ret1 = CompareNumbers(x,P.x,op1);
	if(op2) ret2 = CompareNumbers(y,P.y,op2);

	return ret1 && ret2;
}

Game_Temp.prototype.CheckEventPos_V = function(EID,E_vf,x,y,vid,x_vf,y_vf,vid_vf,opX,opY){
	if(isNaN(EID) || isNaN(x) || isNaN(y) || isNaN(vid)) return -1;

	const op1 = CheckOpCode(opX);
	const op2 = CheckOpCode(opY);
	if(x_vf==true) x = $gameVariables.value(x);
	if(y_vf==true) y = $gameVariables.value(y);
	if(E_vf==true) EID = $gameVariables.value(EID);

	vid = ConvertInt2Val(vid,vid_vf);
	
	const P = ExtractGameSymbol(EID);
	if(P==null)  return -1;

	let ret1 = true, ret2 = true;
	if(op1) ret1 = CompareNumbers(P.x,x,op1);
	if(op2) ret2 = CompareNumbers(P.y,y,op2);
 
	if(ret1 && ret2) $gameVariables.setValue(vid,1);
	else $gameVariables.setValue(vid,0);
}


////////////////////////////////////////////////////////////////////////////////

Game_Temp.prototype.LockFocus_onTargetEvent = function(T,T_vf){
	const targetID = ConvertInt2Val(T,T_vf);
	$gameMap._interpreter.SoR_LockFocusEvent = targetID;
}

Game_Temp.prototype.FreeFocus_onTargetEvent = function(){
	$gameMap._interpreter.SoR_LockFocusEvent = undefined;
}

const SoR_SUM_GI_character = Game_Interpreter.prototype.character;
Game_Interpreter.prototype.character = function(param) {
	if(this.SoR_LockFocusEvent !== undefined) param = this.SoR_LockFocusEvent;
	return SoR_SUM_GI_character.call(this, param);
};




////////////////////////////////////////////////////////////////////////////////

function convertItemsParam(param) {
	if (param == undefined) return [];
    let arr = [];
        JSON.parse(param).map(function(param) {
			const obj = JSON.parse(param);
            arr.push(obj);
        });
	return arr; 
};


function CheckSwitchState(id){
	return $gameSwitches.value(id);
}


function CheckOpCode(op){
	if(op==">" || op=="<" || op==">=" || op=="<=" || op=="==" || op=="!=") return op;
	else return false;
}
function CompareNumbers(x,y,op){
	let ret = false;
	switch(op){
		case ">":
			if(x>y) ret=true;
			break;
		case "<":
			if(x<y) ret=true;
			break;
		case ">=":
			if(x>=y) ret=true;
			break;
		case "<=":
			if(x<=y) ret=true;
			break;
		case "!=":
			if(x!=y) ret=true;
			break;
		case "==":
			if(x==y) ret=true;
			break;
	}
	return ret;
}


function ConvertInt2Val(v,vflag){
	if(vflag === true || vflag == "true") return $gameVariables.value(v);
	else return v;
}
function ExtractGameSymbol(x){
   let symbol = null;

   if(x==0) symbol = $gamePlayer; 
   else if(x==-1) symbol = $gameMap._events[$gameMap._interpreter._eventId]; //this event
   else{
	if(x>=1 && x <= $gameMap._events.length) symbol = $gameMap._events[x];
   }
   return symbol;
}

function L1Norm(a, b){
	return Math.abs((a.x-b.x))+Math.abs((a.y-b.y));
}
function L2Norm(a, b){
	return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}

}());

