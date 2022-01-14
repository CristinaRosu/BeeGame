var settings = {
    queen: {
        amount: 1,
        hp: 100,
        damage: 8,
        imagePath: "./bee.jpg"
    },
    worker: {
        amount: 5,
        hp: 75,
        damage: 10,
        imagePath: "./bee.jpg"
    },
    drone: {
        amount: 8,
        hp: 50,
        damage: 12,
        imagePath: "./bee.jpg"
    }
};
var Bee = /** @class */ (function () {
    function Bee(id, type, hp) {
        this.id = id;
        this.type = type;
        this.hp = hp;
    }
    Bee.prototype.render = function () {
        var div = document.createElement("div");
        var img = document.createElement("img");
        var typeElem = document.createElement("h4");
        var hpElem = document.createElement("p");
        // set id/class of the parent element
        div.setAttribute("id", "bee" + this.id);
        div.classList.add("bee-item");
        // set type elem
        typeElem.innerHTML = this.type;
        // set hp elem
        hpElem.innerHTML = this.hp.toString();
        // set image source
        img.src = settings[this.type].imagePath;
        // append HTML elements
        div.appendChild(typeElem);
        div.appendChild(img);
        div.appendChild(hpElem);
        // append the parent to DOM
        document.getElementsByClassName(this.type + "-area")[0].appendChild(div);
    };
    Bee.prototype.hit = function () {
        // cut hp from the bee
        this.hp -= settings[this.type].damage;
        // update the style of the last hit bee (make it red)
        var prevHitElem = document.getElementsByClassName("hit");
        if (prevHitElem.length)
            prevHitElem[0].classList.remove("hit");
        var currentHitElem = document.getElementById("bee" + this.id);
        currentHitElem.classList.add("hit");
        localStorage.setItem('lastHitId', this.id.toString());
        // update the hp value
        var hpElem = document.querySelector("#bee" + this.id + " p");
        hpElem.innerHTML = this.hp.toString();
    };
    Bee.prototype.destroy = function () {
        document.getElementById("bee" + this.id).outerHTML = "";
    };
    return Bee;
}());
var BeeSwarm = /** @class */ (function () {
    function BeeSwarm(initData) {
        this.swarmData = [];
        if (initData) {
            for (var index = 0; index < initData.length; index++) {
                var bee = new Bee(initData[index].id, initData[index].type, initData[index].hp);
                bee.render();
                this.swarmData.push(bee);
            }
        }
        else {
            for (var type in settings) {
                for (var index = 0; index < settings[type].amount; index++) {
                    var bee = new Bee(this.swarmData.length, type, settings[type].hp);
                    bee.render();
                    this.swarmData.push(bee);
                }
            }
            localStorage.setItem("swarmData", JSON.stringify(this.swarmData));
        }
    }
    BeeSwarm.prototype.hit = function () {
        var randomId = Math.ceil(Math.random() * this.swarmData.length - 1);
        var prevVal = this.swarmData[randomId].hp;
        this.swarmData[randomId].hit();
        var newVal = this.swarmData[randomId].hp;
        console.log("Hit bee with id:", randomId);
        console.log("Previous value:", prevVal);
        console.log("New value:", newVal);
        console.log("********");
        // destroy the bee with no life
        if (this.swarmData[randomId].hp <= 0) {
            this.swarmData[randomId].destroy();
            this.swarmData.splice(randomId, 1);
        }
        // save updated data to local storage
        localStorage.setItem("swarmData", JSON.stringify(this.swarmData));
        // if queen died, game over
        if (randomId === 0 && newVal <= 0) {
            alert("GAVE OVER");
            return resetGame();
        }
        // if all other bees died, game over
        if (this.swarmData.length === 1) {
            alert("GAVE OVER");
            return resetGame();
        }
    };
    return BeeSwarm;
}());
// this function initializes the game
function initGame() {
    // set player name
    var player = localStorage.getItem("player");
    if (!player) {
        player = prompt("Please enter your name", "Anonymous");
        localStorage.setItem("player", player);
    }
    // set player name in the UI
    document.getElementById("player-name").innerHTML = player;
    // initialize bee swarm
    var initSwarmData = localStorage.getItem("swarmData");
    var swarm = new BeeSwarm(initSwarmData ? JSON.parse(initSwarmData) : null);
    // highlight with red the last hit bee
    var lastHitId = localStorage.getItem("lastHitId");
    if (lastHitId) {
        var lastHitElem = document.getElementById("bee" + lastHitId);
        if (lastHitElem)
            lastHitElem.classList.add("hit");
    }
    // add click event on the Hit button
    document.getElementById("hit").addEventListener("click", function () {
        swarm.hit();
    });
    //    add click event on the Reset button
    document.getElementById("reset").addEventListener("click", function () {
        resetGame();
    });
}
function resetGame() {
    localStorage.removeItem("player");
    localStorage.removeItem("swarmData");
    localStorage.removeItem("lastHitId");
    // reload the page
    location.reload();
}
initGame();
