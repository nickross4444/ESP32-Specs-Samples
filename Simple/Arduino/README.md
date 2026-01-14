# ESP32 WebSocket Echo Server - Arduino Version

A simple Arduino example demonstrating a WebSocket Echo server on ESP32 with LED feedback.

## Features

- **Language**: Arduino C++ (simplified from ESP-IDF)
- **Protocol**: WebSocket (Echo)
- **Networking**: Station Mode (Connects to existing WiFi) with optional Static IP support
- **Feedback**: Activity-based LED toggling (LED toggles when data is processed)

## Hardware Required

- ESP32 Development Board (e.g., ESP32-DevKitC, ESP32-S3, etc.)
- A USB cable for power and programming
- Optional: External LED with resistor (if your board doesn't have a built-in LED)

## Software Requirements

- Arduino IDE 1.8.19+ or Arduino IDE 2.0+
- ESP32 Board Support Package installed via Arduino Board Manager
- WebSockets_Generic library by Khoi Hoang (install via Library Manager)

## Installation

### 1. Install ESP32 Board Support

1. Open Arduino IDE
2. Go to **File** > **Preferences**
3. Add this URL to **Additional Board Manager URLs**:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Go to **Tools** > **Board** > **Boards Manager**
5. Search for "ESP32" and install "esp32" by Espressif Systems

### 2. Install WebSockets_Generic Library

1. Go to **Tools** > **Manage Libraries**
2. Search for "WebSockets_Generic"
3. Install "WebSockets_Generic" by Khoi Hoang
   - This library is based on the WebSockets library by Markus Sattler
   - It provides enhanced support for ESP32 and other boards

### 3. Configure the Sketch

1. Open `WebsocketExample.ino` in Arduino IDE
2. Update the WiFi credentials:
   ```cpp
   const char* WIFI_SSID = "your_wifi_ssid";
   const char* WIFI_PASSWORD = "your_wifi_password";
   ```
3. Update LED pin if needed (default is GPIO 2):
   ```cpp
   const int LED_PIN = 2;  // Change if your board uses a different pin
   ```

### 4. Optional: Static IP Configuration

If you need a static IP address, configure the static IP section in the code:

```cpp
IPAddress staticIP(192, 168, 1, 100);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress dns(8, 8, 8, 8);
```

The static IP configuration is automatically applied in the `connectToWiFi()` function.

## Upload and Run

1. Connect your ESP32 to your computer via USB
2. Select your board: **Tools** > **Board** > **ESP32 Arduino** > Select your ESP32 model
3. Select the port: **Tools** > **Port** > Select your ESP32's COM port
4. Click **Upload** (or press Ctrl+U / Cmd+U)
5. Open **Serial Monitor** (Tools > Serial Monitor) at 115200 baud
6. Wait for WiFi connection and note the IP address displayed

## Testing

Once the device connects to WiFi, you will see the IP address in the Serial Monitor (e.g., `IP address: 192.168.1.100`).

### 1. Connection Test (Ping)

Open a terminal on your computer and ping the device:

```bash
ping <DEVICE_IP_ADDRESS>
```

### 2. WebSocket Test (Python)

Use a Python script to test the echo server:

1. Install websockets library:

   ```bash
   pip install websockets
   ```

2. Create a test script:

   ```python
   import asyncio
   import websockets

   async def test():
       uri = "ws://<ESP32_IP_ADDRESS>/ws"
       async with websockets.connect(uri) as websocket:
           await websocket.send("Hello ESP32!")
           response = await websocket.recv()
           print(f"Echo: {response}")

   asyncio.run(test())
   ```

### 3. WebSocket Test (Browser)

Open your browser's Developer Tools (F12) > Console and run:

```javascript
var ws = new WebSocket("ws://<ESP32_IP_ADDRESS>/ws")
ws.onopen = function () {
  ws.send("Hello ESP32")
}
ws.onmessage = function (e) {
  console.log("Echo: " + e.data)
}
```

You should see "Echo: Hello ESP32" in the console, and the LED on the ESP32 will toggle.

## Troubleshooting

- **Garbled Serial Monitor output**:

  - ESP32 sends boot messages at 74880 baud before your code starts
  - **Solution**: Wait 1-2 seconds after opening Serial Monitor, or close and reopen it after the ESP32 has finished booting
  - Make sure Serial Monitor is set to **115200** baud
  - If still garbled, try closing Serial Monitor, uploading the code, then reopening Serial Monitor

- **WiFi connection fails**: Check your SSID and password, ensure your router is 2.4GHz (ESP32 doesn't support 5GHz)
- **Can't upload**: Make sure you've selected the correct board and port in Arduino IDE
- **LED doesn't toggle**: Check if GPIO 2 is correct for your board, or update LED_PIN
- **WebSocket connection fails**: Ensure your computer is on the same network as the ESP32

## License

This example is provided as-is for educational purposes.
