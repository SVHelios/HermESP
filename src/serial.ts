import { SerialPort } from "serialport";

export async function findEsp32Port(): Promise<string> {
  const ports = await SerialPort.list();

  const esp = ports.find(p =>
    p.manufacturer?.toLowerCase().includes("silicon") ||
    p.vendorId === "10C4" || // CP210x
    p.vendorId === "1A86"    // CH340
  );

  if (!esp?.path) {
    throw new Error("ESP32 nicht gefunden");
  }

  return esp.path;
}

export async function listEsp32Ports() {
  const ports = await SerialPort.list();

  return ports
    .filter(p =>
      p.vendorId === "10C4" || // CP210x
      p.vendorId === "1A86" || // CH340
      p.vendorId === "0403"    // FTDI
    )
    .map(p => ({
      path: p.path,
      manufacturer: p.manufacturer ?? "Unknown"
    }));
}