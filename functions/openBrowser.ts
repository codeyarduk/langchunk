import { exec } from "child_process";

function openBrowser(url: string) {
  let command;
  switch (process.platform) {
    case "darwin":
      command = `open "${url}"`;
      break;
    case "win32":
      command = `start "${url}"`;
      break;
    default:
      command = `xdg-open "${url}"`;
  }

  exec(command, (error) => {
    if (error) {
      console.error("Failed to open browser:", error);
    }
  });
}

export default openBrowser;
