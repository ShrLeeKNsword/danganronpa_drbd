//=============================================================================
// 8-dir move.js
/*:
 * @plugindesc 8-dir move 
 * @author Chiba Kunase.
 *
 * @help 
 * just trace on.
 */
//=============================================================================
 
Game_Player.prototype.getInputDirection = function() {
    return Input.dir8;
};
 
Game_Player.prototype.executeMove = function(direction) {
    if (direction % 2 == 0)
    this.moveStraight(direction);
    if (direction == 1||direction ==3)
    this.moveDiagonally(direction+3 , 2);
    if (direction == 7||direction == 9)
    this.moveDiagonally(direction-3 , 8) ;
};