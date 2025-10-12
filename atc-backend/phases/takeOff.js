function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let runwayBusyUntil = Date.now();

const ROT = 2000;//runway occupancy time
const takeoffTime = 4000;

async function handleTakeoff(flight, socket) {
  while (runwayBusyUntil > Date.now() + ROT+1000) {
    await sleep(runwayBusyUntil - Date.now());
  }

  const clearedTime = new Date();
  runwayBusyUntil = clearedTime + ROT + takeoffTime;

  socket.emit("clearedForTakeoff", {
    flightId: flight.flightId,
    runway: "RW-2",
    status: "Cleared for Takeoff",
    timestamp: clearedTime.toISOString(),
  });
  await sleep(1000);
  const rollTime = new Date();
  socket.emit("takeoffroll", {
    flightId: flight.flightId,
    runway: "RW-2",
    status: "Cleared for Takeoff",
    timestamp: rollTime.toISOString(),
  });

  await sleep(ROT);
  const departureTime = new Date();
  socket.emit("flightDeparted", {
    flightId: flight.flightId,
    runway: "RW-2",
    status: "Airborne",
    timestamp: departureTime.toISOString(),
  });

  await sleep(takeoffTime);
  
   return {
    takeoffClearedTime: clearedTime.toISOString(),
    takeoffRollTime: rollTime.toISOString(),
    departureTime: departureTime.toISOString(),
  };
}
module.exports = { handleTakeoff };