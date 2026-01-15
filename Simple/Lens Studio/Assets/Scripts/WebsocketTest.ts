@component
export class WebSocketExample extends BaseScriptComponent {
  @input
  internetModule: InternetModule

  @input public ipAddress: string = "ws://192.168.1.100/ws"

  private socket!: WebSocket

  // Method called when the script is awake
  onAwake() {
    this.connect()
  }

  connect() {
    print("Attempting to connect to " + this.ipAddress + "...")
    this.socket = this.internetModule.createWebSocket(this.ipAddress)
    this.socket.binaryType = "blob"

    // Listen for the open event
    this.socket.onopen = (event: WebSocketEvent) => {
      print("WebSocket Connected!")

      // Socket has opened, send a text message
      const msg = "Message 1"
      print("Sending: " + msg)
      this.socket.send(msg)

      // Try sending a binary message
      // (the bytes below spell 'Message 2')
      const message: number[] = [77, 101, 115, 115, 97, 103, 101, 32, 50]
      const bytes = new Uint8Array(message)
      print("Sending binary message: Message 2")
      this.socket.send(bytes)
    }

    // Listen for messages
    this.socket.onmessage = async (event: WebSocketMessageEvent) => {
      if (event.data instanceof Blob) {
        // Binary frame, can be retrieved as either Uint8Array or string
        const bytes = await event.data.bytes()
        const text = await event.data.text()
        print("Received binary message, printing as text: " + text)
      } else {
        // Text frame
        const text: string = event.data
        print("Received text message: " + text)
      }
    }

    this.socket.onclose = (event: WebSocketCloseEvent) => {
      if (event.wasClean) {
        print("Socket closed cleanly")
      } else {
        print("Socket closed with error, code: " + event.code)
      }
    }

    this.socket.onerror = (event: WebSocketEvent) => {
      print("Socket error")
    }
  }
}
