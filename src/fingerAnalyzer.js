const TIP = [4, 8, 12, 16, 20];
const PIP = [3, 6, 10, 14, 18];
const MCP = [2, 5, 9, 13, 17];

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));
const dot = (a, b) => a.x * b.x + a.y * b.y + (a.z ?? 0) * (b.z ?? 0);
const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: (a.z ?? 0) - (b.z ?? 0) });
const magnitude = vector => Math.hypot(vector.x, vector.y, vector.z ?? 0);
const cosine = (a, b) => dot(a, b) / Math.max(magnitude(a) * magnitude(b), 0.0001);

function jointAngle(previous, joint, next) {
  return Math.acos(Math.max(-1, Math.min(1, cosine(subtract(previous, joint), subtract(next, joint))))) * 180 / Math.PI;
}

function fingerExtended(landmarks, tip, pip, mcp, wrist) {
  const palmSize = Math.max(distance(wrist, landmarks[9]), 0.001);
  const tipFromMcp = distance(landmarks[tip], landmarks[mcp]);
  const pipFromMcp = distance(landmarks[pip], landmarks[mcp]);
  const tipFromWrist = distance(landmarks[tip], wrist);
  return tipFromMcp > pipFromMcp * 1.12 && tipFromWrist > distance(landmarks[pip], wrist) * 1.04 && tipFromMcp / palmSize > 0.65;
}

function thumbExtended(landmarks, handedness) {
  // La etiqueta de handedness no se usa para imponer un signo en X: la cámara
  // puede estar espejada. Se usa la magnitud de las proyecciones, por lo que
  // el mismo cálculo funciona para ambas manos y para pulgares diagonales.
  const wrist = landmarks[0];
  const thumbBase = landmarks[1];
  const thumbMcp = landmarks[2];
  const thumbIp = landmarks[3];
  const thumbTip = landmarks[4];
  const palmSize = Math.max(distance(wrist, landmarks[9]), 0.001);
  const thumbChain = distance(thumbBase, thumbMcp) + distance(thumbMcp, thumbIp) + distance(thumbIp, thumbTip);
  const straightness = distance(thumbBase, thumbTip) / Math.max(thumbChain, 0.001);

  // Un pulgar extendido conserva sus dos articulaciones abiertas y una cadena
  // larga/recta. Esto evita confundir una punta separada del índice con un
  // pulgar levantado cuando el pulgar está doblado sobre la palma.
  const jointsOpen = jointAngle(thumbBase, thumbMcp, thumbIp) > 115 && jointAngle(thumbMcp, thumbIp, thumbTip) > 115;
  const longEnough = thumbChain / palmSize > 0.58 && straightness > 0.72;

  // Eje transversal de la palma (meñique -> índice). El pulgar lateral o
  // diagonal debe proyectarse fuera de ese eje; el valor absoluto elimina la
  // dependencia de izquierda/derecha y del espejo de la cámara.
  const palmAcross = subtract(landmarks[5], landmarks[17]);
  const thumbDirection = subtract(thumbTip, thumbBase);
  const lateralProjection = Math.abs(cosine(thumbDirection, palmAcross));
  const palmCenter = { x: (landmarks[5].x + landmarks[9].x + landmarks[17].x) / 3, y: (landmarks[5].y + landmarks[9].y + landmarks[17].y) / 3, z: ((landmarks[5].z ?? 0) + (landmarks[9].z ?? 0) + (landmarks[17].z ?? 0)) / 3 };
  const awayFromPalm = distance(thumbTip, palmCenter) / palmSize;
  const extendedAway = lateralProjection > 0.22 || awayFromPalm > 0.62;

  return jointsOpen && longEnough && extendedAway;
}

export function analyzeFingers(landmarks, handedness = 'Right') {
  if (!landmarks || landmarks.length < 21) return null;
  const wrist = landmarks[0];
  return [
    thumbExtended(landmarks, handedness),
    fingerExtended(landmarks, TIP[1], PIP[1], MCP[1], wrist),
    fingerExtended(landmarks, TIP[2], PIP[2], MCP[2], wrist),
    fingerExtended(landmarks, TIP[3], PIP[3], MCP[3], wrist),
    fingerExtended(landmarks, TIP[4], PIP[4], MCP[4], wrist)
  ];
}
