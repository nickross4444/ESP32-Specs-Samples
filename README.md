# ESP32 + Spectacles WebSocket Connection Samples

This repository demonstrates how to connect Spectacles (via Lens Studio) to an ESP32 microcontroller using WebSockets. When working correctly, messages sent from Spectacles or Lens Studio will trigger the ESP32's LED to turn on, and the message will be echoed back and displayed in the Lens Studio console.

## Overview

The repository contains two implementation approaches (Arduino and ESP-IDF) and a Lens Studio project that connects to the ESP32 over WebSocket. Both implementations create a WebSocket echo server that:

1. Listens for incoming WebSocket connections on port 80
2. Receives messages from connected clients (Spectacles/Lens Studio)
3. Toggles the ESP32's onboard LED when a message is received
4. Echoes the message back to the sender
5. Displays the echoed message in the Lens Studio console

## Network Architecture

The system operates on a local WiFi network:

```
┌─────────────────┐         WiFi Network          ┌──────────────┐
│                 │◄─────────────────────────────►│              │
│  Spectacles /   │         WebSocket             │    ESP32     │
│  Lens Studio    │         (ws://IP/ws)          │              │
│                 │                               │              │
└─────────────────┘                               └──────────────┘
```

**Key Requirements:**

- All devices (ESP32, Spectacles, and computer running Lens Studio) must be on the same WiFi network
- WebSocket communication occurs over standard HTTP port 80
- The ESP32's IP address must be known and configured in the Lens Studio script

**How it works:**

1. ESP32 boots and connects to your WiFi network (either via DHCP or static IP)
2. ESP32 starts a WebSocket server listening on `ws://<ESP32_IP>/ws`
3. Lens Studio script connects to the ESP32's WebSocket endpoint
4. When Lens Studio sends a message, the ESP32 receives it, toggles its LED, and echoes it back
5. The echoed message appears in Lens Studio's console output

## Arduino vs ESP-IDF: Which Should You Use?

### Arduino

**Best for:**

- Quick prototyping and rapid iteration
- Developers familiar with Arduino ecosystem
- Simple projects that don't require low-level hardware control
- Projects where ease of use is prioritized over performance

**Advantages:**

- Simpler syntax and easier to learn
- Large library ecosystem
- Faster initial setup
- Good for beginners

**Limitations:**

- Less control over hardware resources
- Higher memory overhead
- Less suitable for complex, production applications

### ESP-IDF

**Best for:**

- Production applications requiring fine-grained control
- Developers comfortable with C/C++ and embedded systems
- Projects needing advanced features (BLE, deep sleep, custom protocols)
- **Development in Cursor IDE** - The ESP-IDF extension can be installed directly in Cursor, providing excellent IDE integration with code completion, debugging, and configuration tools

**Advantages:**

- Full access to ESP32 hardware features
- Lower memory footprint
- Better performance and power management
- Professional-grade development tools
- Native C/C++ development environment
- Excellent IDE integration (especially in Cursor with ESP-IDF extension)

**Considerations:**

- Steeper learning curve
- More complex build system
- Requires understanding of ESP-IDF framework

**Recommendation for Cursor Users:** ESP-IDF is the recommended choice when developing in Cursor, as the ESP-IDF extension provides seamless integration with the IDE, including project configuration, build tools, serial monitor, and debugging capabilities.

## Project Structure

```
Simple/
├── Arduino/              # Arduino implementation
│   ├── README.md         # Detailed Arduino setup instructions
│   └── WebsocketExample.ino
│
├── ESP-IDF/              # ESP-IDF implementation
│   ├── README.md         # Detailed ESP-IDF setup instructions
│   ├── main/
│   │   ├── main.cpp
│   │   └── wifi_connect.cpp
│   └── CMakeLists.txt
│
└── Lens Studio/          # Lens Studio project
    ├── Assets/
    │   └── Scripts/
    │       └── WebsocketTest.ts
    └── esp32-example.esproj
```

## Setup Instructions

### ESP32 Setup

Choose one of the following approaches:

1. **Arduino Setup**: See [`Simple/Arduino/README.md`](Simple/Arduino/README.md)

   - Install Arduino IDE and ESP32 board support
   - Install WebSockets_Generic library
   - Configure WiFi credentials in the sketch
   - Upload and monitor serial output

2. **ESP-IDF Setup**: See [`Simple/ESP-IDF/README.md`](Simple/ESP-IDF/README.md)
   - Install ESP-IDF development framework
   - Configure WiFi and LED settings via `idf.py menuconfig`
   - Build and flash using `idf.py build flash monitor`
   - **Recommended for Cursor IDE users** - Install the ESP-IDF extension for integrated development

### Lens Studio Setup

1. Open the Lens Studio project: `Simple/Lens Studio/esp32-example.esproj`
2. Update the WebSocket URL in `Assets/Scripts/WebsocketTest.ts`:
   - Change the IP address (`10.28.65.123`) to match your ESP32's IP address
   - The IP address will be displayed in the serial monitor when the ESP32 connects to WiFi
3. Ensure the Internet Module is properly configured in the scene
4. Run the project in Lens Studio Preview
5. Check the console output for connection status and echoed messages

## Testing

Once everything is set up:

1. **Verify ESP32 Connection:**

   - Check serial monitor output to confirm WiFi connection
   - Note the ESP32's IP address
   - Verify LED is configured correctly

2. **Test WebSocket Connection:**

   - Run the Lens Studio project
   - Check console for "WebSocket Connected!" message
   - Send a test message
   - Verify the ESP32 LED toggles
   - Verify the echoed message appears in Lens Studio console

3. **Troubleshooting:**
   - Ensure all devices are on the same WiFi network
   - Verify the IP address in Lens Studio script matches ESP32's IP
   - Check firewall settings if connection fails
   - Review serial monitor output for ESP32-side errors

## Additional Resources

- [ESP-IDF Programming Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [Arduino ESP32 Documentation](https://docs.espressif.com/projects/arduino-esp32/en/latest/)
- [Lens Studio Documentation](https://docs.snap.com/lens-studio/)
