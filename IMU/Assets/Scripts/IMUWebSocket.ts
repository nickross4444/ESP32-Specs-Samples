import { Cube } from "./Cube";

@component
export class IMUWebSocket extends BaseScriptComponent {
  @input internetModule: InternetModule;
  @input screenText: Text;
  @input cube: Cube;

  @input public ipAddress: string = "ws://192.168.1.100/ws";

  private socket!: WebSocket;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    this.connect();
  }

  private connect() {
    this.screenText.text = "Connecting...";
    this.log("Attempting to connect to " + this.ipAddress);

    this.socket = this.internetModule.createWebSocket(this.ipAddress);
    this.socket.binaryType = "blob";

    this.socket.onopen = (event: WebSocketEvent) => {
      this.log("WebSocket Connected!");
      this.screenText.text = "Connected!";

      // Send initial message to ESP32 (similar to original BLE write)
      const msg = "HI FROM Spectacles";
      this.log("Sending: " + msg);
      this.socket.send(msg);
    };

    this.socket.onmessage = async (event: WebSocketMessageEvent) => {
      let message: string;

      if (event.data instanceof Blob) {
        // Binary frame - convert to text
        message = await event.data.text();
      } else {
        // Text frame
        message = event.data;
      }

      // Message format: "angleX,angleZ,angleY"
      const numArray = message.split(",").map((x) => {
        return parseFloat(x);
      });

      if (numArray.length === 3 && !numArray.some(isNaN)) {
        this.cube.setRotationAngle(numArray);
      }
    };

    this.socket.onclose = (event: WebSocketCloseEvent) => {
      if (event.wasClean) {
        this.log("Socket closed cleanly");
        this.screenText.text = "Disconnected";
      } else {
        this.log("Socket closed with error, code: " + event.code);
        this.screenText.text = "Connection error";
      }
    };

    this.socket.onerror = (event: WebSocketEvent) => {
      this.log("Socket error");
      this.screenText.text = "Socket error";
    };
  }

  private log(message: string) {
    print("IMU WebSocket: " + message);
  }
}
