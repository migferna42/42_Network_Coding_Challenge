/**
 * Grab Snaffles and try to throw them through the opponent's goal!
 * Move towards a Snaffle to grab it and use your team id to determine towards where you need to throw it.
 * Use the Wingardium spell to move things around at your leisure, the more magic you put it, the further they'll move.
 **/
 
GOAL_WIDTH = 4000;
POLE_RADIUS = 300;

function squareDist(a, b)
{
    return (a.x-b.x)**2 +(a.y-b.y)**2;
}
 
function findClosest(point, entities)
{
    var closestEntity = null;
    var minDist2 = 0;
    for (var j = 0; j < entities.length; j++){
        var entity = entities[j];
        var dist2 = squareDist(entity, point)
        if ((closestEntity === null || dist2 < minDist2) && (!entity.closestUsed || entities.length === 1))
        {
            closestEntity = entity;
            minDist2 = dist2;
        }
    }
    
    return closestEntity;
}

function findFurther(point, entities)
{
    var furthertEntity = null;
    var minDist2 = 0;
    for (var j = 0; j < entities.length; j++){
        var entity = entities[j];
        var dist2 = squareDist(entity, point)
        if ((furthertEntity === null || dist2 > minDist2) && (!entity.closestUsed || entities.length === 1))
        {
            furthertEntity = entity;
            minDist2 = dist2;
        }
    }
    
    return furthertEntity;
}

const myTeamId = parseInt(readline()); // if 0 you need to score on the right of the map, if 1 you need to score on the left

const goals = [
    {x: 16000, y: 3750},
    {x: 0, y: 3750}
];

let magic = 10;
let usedOblivate = false;

// game loop
while (true) {
    var inputs = readline().split(' ');
    const myScore = parseInt(inputs[0]);
    const myMagic = parseInt(inputs[1]);
    var inputs = readline().split(' ');
    const opponentScore = parseInt(inputs[0]);
    const opponentMagic = parseInt(inputs[1]);
    const entities = parseInt(readline()); // number of entities still in game
    var snaffles = []
    let myWizards = []
    let opponentWizards = []
    let bludgers = []
    for (let i = 0; i < entities; i++) {
        var inputs = readline().split(' ');
        const entityId = parseInt(inputs[0]); // entity identifier
        const entityType = inputs[1]; // "WIZARD", "OPPONENT_WIZARD" or "SNAFFLE" or "BLUDGER"
        const x = parseInt(inputs[2]); // position
        const y = parseInt(inputs[3]); // position
        const vx = parseInt(inputs[4]); // velocity
        const vy = parseInt(inputs[5]); // velocity
        const state = parseInt(inputs[6]);// 1 if the wizard is holding a Snaffle, 0 otherwise. 1 if the Snaffle is being held, 0 otherwise. id of the last victim of the bludger.
        
        let entity = {
            id: entityId,
            entityType: entityType,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            state: state,
            closestUsed: false,
            furtherUsed: false,
        };
        
        if (entityType == "SNAFFLE"){
            snaffles.push(entity);
        } else if (entityType == "WIZARD") {
            myWizards.push(entity)
        } else if (entityType == "OPPONENT_WIZARD") {
            opponentWizards.push(entity)
        } else if (entityType == "BLUGGER") {
            blugdgers.push(entity)
        }
    
    }
    for (let i = 0; i < 2; i++) {
        console.error("Mago " + i + ": ");
        console.error(snaffles);
        var harry = myWizards[i];
        var target = goals[myTeamId];
        var closestSnaffle = findClosest(harry, snaffles);
        var furtherSnaffle = findFurther(harry, snaffles);
        var distance = squareDist(harry, furtherSnaffle);
        closestSnaffle.closestUsed = true;
        furtherSnaffle.furtherUsed = true;
        
        
        
        var dx = furtherSnaffle.x - harry.x;
        var dy = furtherSnaffle.y - harry.y;
        var targetAligned = false;
        
        
        if (dx !== 0)
        {
            var slope = dy / dx;
            var destinationY = furtherSnaffle.y + (target.x - furtherSnaffle.x) * slope;
            var targetAligned = Math.abs(destinationY - target.y) < GOAL_WIDTH / 2 + POLE_RADIUS;
        }
        
        
        if (harry.state == 1) {
            console.log('THROW ' + target.x + ' ' + target.y + ' 500');
        } else if (magic >= 20 && (myTeamId === 0 ? dx < 0 : dx >0)) {
            magic -= 20;
            console.log('WINGARDIUM ' + furtherSnaffle.id + ' ' + target.x + ' ' + target.y + ' 20');
        } else {
            console.log('MOVE ' + Math.floor(closestSnaffle.x + closestSnaffle.vx - harry.vx) + ' ' + Math.floor(closestSnaffle.y + closestSnaffle.vy - harry.vy) + ' 150');
        }
        //console.log('MOVE ' + closestSnaffle.x + ' ' + closestSnaffle.y + ' 150');
        // Edit this line to indicate the action for each wizard (0 ≤ thrust ≤ 150, 0 ≤ power ≤ 500, 0 ≤ magic ≤ 1500)
        // i.e.: "MOVE x y thrust" or "THROW x y power" or "WINGARDIUM id x y magic"
    }
    magic++;
}
