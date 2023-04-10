function viewNN(player) {
  console.log("style.displaying NN");
  let home = document.getElementById("home");
  home.style.display = "none";
  let viewNN = document.getElementById("viewNN");
  viewNN.style.display= "flex";
  createNNRepresentation(player);
}

function returnToHome() {
  console.log("Returning to home");
  let home = document.getElementById("home");
  home.style.display = "flex";
  let viewNN = document.getElementById("viewNN");
  viewNN.style.display = "none";
}

function createNNRepresentation(player) {
  let rep = document.getElementById("representationOfNN");
  rep.innerHTML = "";
  let divs = [];
  let structure = player.structure;
  console.log(structure);
  console.log(player.biases[0]);
  console.log(player.weights[0]);
  for (let i=0;i<structure[1];i++) {
    console.log(i);
    divs[i] = document.createElement("div");
    divs[i].innerHTML = `Weights: ${player.weights[0].getRow(i).map(x => x.toFixed(4))}, Bias: ${player.biases[0].getVal(i,0).toFixed(4)}`;
  }
  console.log(divs);
  for (div of divs) {
    rep.appendChild(div);
  }
  console.log("Done");
}
