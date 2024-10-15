// utils.test.js
import { 
    calculateAngle, 
    calculateDistance, 
    calculateDistance_2, 
    averagePostureHeight 
} from './../pages/supporting_methods/angle'; // Adjust the import path as necessary

describe('Utility Functions', () => {
    
    describe('calculateAngle', () => {
        it('should return the correct angle between three points', () => {
            const a = { x: 0, y: 0 };
            const b = { x: 1, y: 1 };
            const c = { x: 2, y: 0 };
            const angle = calculateAngle(a, b, c);
            expect(angle).toBeCloseTo(90);
        });

        it('should handle a straight line (180 degrees)', () => {
            const a = { x: 0, y: 0 };
            const b = { x: 1, y: 1 };
            const c = { x: 2, y: 2 };
            const angle = calculateAngle(a, b, c);
            expect(angle).toBeCloseTo(180); // Straight line
        });
    });

    describe('calculateDistance', () => {
        it('should return the correct distance between two points', () => {
            const a = { x: 0, y: 0 };
            const b = { x: 3, y: 4 };
            const distance = calculateDistance(a, b);
            expect(distance).toBe(5); // Distance should be 5 (3-4-5 triangle)
        });
    });

    describe('calculateDistance_2', () => {
        it('should return the correct distance between two coordinates', () => {
            const distance = calculateDistance_2(0, 0, 3, 4);
            expect(distance).toBe(5); // Distance should be 5 (3-4-5 triangle)
        });
    });

    describe('averagePostureHeight', () => {
        it('should return the correct average posture height', () => {
            const a1 = { x: 1, y: 1 };
            const a2 = { x: 3, y: 1 };
            const b = { x: 2, y: 3 };
            const height = averagePostureHeight(a1, a2, b);
            expect(height).toBeCloseTo(0); // Example expected value
        });

        it('should handle points that are vertically aligned', () => {
            const a1 = { x: 0, y: 0 };
            const a2 = { x: 0, y: 4 };
            const b = { x: 0, y: 0 };
            const height = averagePostureHeight(a1, a2, b);
            expect(height).toBeCloseTo(0); // Example expected value
        });
    });
});