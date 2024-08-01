import Spinner from "./spinner";
import startLocalServer from "./startLocalServer";
import openBrowser from "./openBrowser";

async function authenticate() {
  const port = 8000;
  const authUrl = `https://auth.heywilson.dev/api/cli?port=${port}`;
  // const authUrl = `http://localhost:8787/api/cli?port=${port}`;
  // http://localhost:8787
  // auth.codeyard.co.uk/api/cli

  const spinner = new Spinner();
  spinner.start("Waiting for authentication");

  try {
    const serverPromise = startLocalServer(port);
    openBrowser(authUrl);
    const token = await serverPromise;
    spinner.stop();

    if (token) {
      console.log(`Login successful!`);
      return token;
    } else {
      console.log("Authentication failed");
      return null;
    }
  } catch (error) {
    spinner.stop();
    console.error("Authentication error:", error);
    return null;
  }
}

export default authenticate;
