const settings = {
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
}

class Bee {
    id: number;
    type: string;
    hp: number;

    constructor(id, type, hp) {
        this.id = id;
        this.type = type;
        this.hp = hp;
    }

    render() {
        const div = document.createElement("div");
        const img = document.createElement("img");
        const typeElem = document.createElement("h4");
        const hpElem = document.createElement("p");

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
        document.getElementsByClassName(`${this.type}-area`)[0].appendChild(div);
    }

    hit() {
        // cut hp from the bee
        this.hp -= settings[this.type].damage;

        // update the style of the last hit bee (make it red)
        const prevHitElem = document.getElementsByClassName("hit");
        if (prevHitElem.length) prevHitElem[0].classList.remove("hit");
        const currentHitElem = document.getElementById(`bee${this.id}`);
        currentHitElem.classList.add("hit");
        localStorage.setItem('lastHitId', this.id.toString());

        // update the hp value
        const hpElem = document.querySelector(`#bee${this.id} p`);
        hpElem.innerHTML = this.hp.toString();
    }

    destroy() {
        document.getElementById("bee" + this.id).outerHTML = "";
    }
}

class BeeSwarm {
    swarmData: Array<Bee> = [];

    constructor(initData) {
        if (initData) {
            for (let index = 0; index < initData.length; index++) {
                const bee = new Bee(initData[index].id, initData[index].type, initData[index].hp);
                bee.render();
                this.swarmData.push(bee);
            }
        } else {
            for (let type in settings) {
                for (let index = 0; index < settings[type].amount; index++) {
                    const bee = new Bee(this.swarmData.length, type, settings[type].hp);
                    bee.render();
                    this.swarmData.push(bee);
                }
            }
            localStorage.setItem("swarmData", JSON.stringify(this.swarmData));
        }
    }

    hit() {
        const randomId = Math.ceil(Math.random() * this.swarmData.length - 1);
        const prevVal = this.swarmData[randomId].hp;
        this.swarmData[randomId].hit();
        const newVal = this.swarmData[randomId].hp;

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
    }
}

// this function initializes the game
function initGame() {
    // set player name
    let player = localStorage.getItem("player");

    if (!player) {
        player = prompt("Please enter your name", "Anonymous");
        localStorage.setItem("player", player);
    }

    // set player name in the UI
    document.getElementById("player-name").innerHTML = player;

    // initialize bee swarm
    let initSwarmData = localStorage.getItem("swarmData");
    let swarm = new BeeSwarm(initSwarmData ? JSON.parse(initSwarmData) : null);

    // highlight with red the last hit bee
    const lastHitId = localStorage.getItem("lastHitId");
    if (lastHitId) {
        const lastHitElem = document.getElementById(`bee${lastHitId}`);
        if (lastHitElem) lastHitElem.classList.add("hit");
    }

    // add click event on the Hit button
    document.getElementById("hit").addEventListener("click", () => {
        swarm.hit();
    });

    //    add click event on the Reset button
    document.getElementById("reset").addEventListener("click", () => {
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