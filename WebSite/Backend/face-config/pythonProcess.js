import { fileURLToPath } from "url";
import { dirname } from "path";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function faceRecognition(uid, VerifiedName) {
  const pythonProcess = spawn("python3", [
    `${__dirname}/face-recognition/main.py`,
  ]);

  let timeoutHandle;

  // TODO 1 Check if no face visible
  // ! Set a timeout to kill the process after 7 seconds
  const timeout = 7000; 
  timeoutHandle = setTimeout(() => {
    console.log(`~[SERVER]: Process timed out after 7 seconds for user '${VerifiedName}' uid '${uid}'`);
    pythonProcess.kill("SIGTERM"); // * Terminate the process
  }, timeout);

  // * This runs when we start the verification of the user
  pythonProcess.stdout.on("data", (data) => {
    // * Clear the timeout if data is received in time
    clearTimeout(timeoutHandle); 

    const name = data.toString().trim();

    // TODO 2 Check if verified
    if (name === VerifiedName) {
      console.log(`~[SERVER]: ${name} with uid '${uid}' just got 'verified'\n`);
    } else {
      // TODO 3 Check if not verified
      console.log(`![SERVER] : Proxy done by '${name}' for '${VerifiedName}' with uid '${uid}'`);
    }
  });

  // ? This below is to check for errors
  // pythonProcess.stderr.on("data", (data) => {
  //   console.error(`stderr: ${data}`);
  // });

  // ? Clean up on process close
  // pythonProcess.on("close", (code) => {
  //   clearTimeout(timeoutHandle); // Ensure the timeout is cleared
  //   console.log(`~[SERVER]: Python process exited with code ${code}`);
  // });
}