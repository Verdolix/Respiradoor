document.addEventListener("DOMContentLoaded", () => {
  const socket = io(); // Connect to server

  const playerSlots = document.querySelectorAll('.player-slot');
  let currentPlayer = null;

  // Handle clicking on a slot
  playerSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      const name = prompt("Enter your name:");
      if(name) {
        const color = prompt("Choose a color (name or hex):", "#4CAF50") || "#4CAF50";
        slot.textContent = name;
        slot.style.backgroundColor = color;
        slot.style.color = "white";

        currentPlayer = { name, color, slot: slot.dataset.player };
        socket.emit('joinLobby', currentPlayer);
      }
    });
  });

  // Update lobby when other players join
  socket.on('updatePlayers', (players) => {
    players.forEach(p => {
      const slot = document.querySelector(`.player-slot[data-player="${p.slot}"]`);
      if(slot){
        slot.textContent = p.name;
        slot.style.backgroundColor = p.color;
        slot.style.color = "white";
      }
    });
  });

  // Start Game button
  document.getElementById('start-game').addEventListener('click', () => {
    if(!currentPlayer) {
      alert("You must join a slot first!");
      return;
    }
    alert("Game starting with all joined players!");
    // TODO: Trigger game start logic
  });
});
