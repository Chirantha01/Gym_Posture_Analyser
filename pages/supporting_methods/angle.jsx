export const calculateAngle = (a, b, c) => {
    const AB = {
      x: b.x - a.x,
      y: b.y - a.y,
    };
    const BC = {
      x: c.x - b.x,
      y: c.y - b.y,
    };
  
    const dotProduct = AB.x * BC.x + AB.y * BC.y;
    const magnitudeAB = Math.sqrt(AB.x ** 2 + AB.y ** 2);
    const magnitudeBC = Math.sqrt(BC.x ** 2 + BC.y ** 2);
  
    const angleRadians = Math.acos(dotProduct / (magnitudeAB * magnitudeBC));
    const angleDegrees = (angleRadians * 180) / Math.PI;
    return 180 - angleDegrees;
};

export const calculateDistance = (a, b) => {
  // Calculate the difference in x and y coordinates
  const deltaX = b.x - a.x;
  const deltaY = b.y - a.y;
  
  // Use the Euclidean distance formula
  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
};

export const averagePostureHeight = (a1, a2, b) => {
  const avgLegX = (a1.x + a2.x)/2;
  const avgLegY = (a1.y + a2.y)/2;
  const deltaX = avgLegX - b.x;
  const deltaY = avgLegY - b.y;
  
  // Use the Euclidean distance formula
  return (1-(Math.sqrt(deltaY**2)/Math.sqrt(deltaX ** 2 + deltaY ** 2)));
}

