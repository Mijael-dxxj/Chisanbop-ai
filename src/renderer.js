const CONNECTIONS = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];

export function drawHands(canvas, video, hands = []) {
  const ctx = canvas.getContext('2d'); canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 480; ctx.clearRect(0, 0, canvas.width, canvas.height);
  hands.forEach(({ landmarks, fingers, label }) => {
    ctx.lineWidth = 3; ctx.strokeStyle = '#54d8ff';
    CONNECTIONS.forEach(([a,b]) => { ctx.beginPath(); ctx.moveTo(landmarks[a].x * canvas.width, landmarks[a].y * canvas.height); ctx.lineTo(landmarks[b].x * canvas.width, landmarks[b].y * canvas.height); ctx.stroke(); });
    landmarks.forEach((point, index) => { ctx.beginPath(); ctx.fillStyle = fingers?.[[4,8,12,16,20].indexOf(index)] ? '#b36bff' : '#54d8ff'; ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, Math.PI * 2); ctx.fill(); });
    const wrist = landmarks[0]; ctx.fillStyle = '#fff'; ctx.font = 'bold 18px system-ui'; ctx.fillText(label, wrist.x * canvas.width + 12, wrist.y * canvas.height - 12);
  });
}
