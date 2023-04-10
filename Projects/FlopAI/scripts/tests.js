function testIsLegalPosition() {
  this.decoder = new Decoder(mapManager.maps[7]);

  let resp;
  let failArray = [];
  let passCount = 0;
  for (let z=0; z<3; z++) {
    for (let x=0; x<10; x++) {
      for (let y=0; y<10; y++) {
        resp = decoder.isLegalPosition(x, y, z);
        if (x == 0 && z == 1) {
          if (resp != false) {
            failArray.push({x,y,z});
          } else {
            passCount++;
          }
        }
        else if (y == 0 && z == 2) {
          if (resp != false) {
            failArray.push({x,y,z});
          } else {
            passCount++;
          }
        }
        else {
          if (resp != true) {
            failArray.push({x,y,z});
          } else {
            passCount++;
          }
        }
      }
    }
  }
  console.log("Done Tests");
  if (!failArray.length == 0) {
    console.log("STATUS: FAILED");
  } else {
    console.log("STATUS: PASS");
  }
  console.log(failArray);
  console.log("Pass Count: (Expected: 300) : (Got: "+passCount+")");
}
