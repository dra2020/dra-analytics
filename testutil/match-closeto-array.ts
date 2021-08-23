// Thanks to: https://stackoverflow.com/questions/59495104/how-to-let-know-typescript-compiler-about-jest-custom-matchers

declare global {
    namespace jest {
        interface Matchers<R, T> {
            toBeArrayWithValuesCloseTo: (expected: Array<any>) => CustomMatcherResult;
        }
    }
}

expect.extend({
    /**
     * Notice that this implementation has 2 arguments, but the implementation inside the Matchers only has 1
     */
    toBeArrayWithValuesCloseTo(
    received: Array<any>,
    expected: Array<any>
    ) {
        if (expected.length == 0) {
            return {
                message: () => `expected arrays of same size`,
                pass: received.length == 0
            }    
        }
        if (typeof expected[0] === "number") {
            if (typeof received[0] === "number") {
                return toBeArrayWithValuesCloseTo1d(received, expected);
            }

            return {
                message: () => `expected array of number, received array of ${typeof received[0]}`,
                pass: false
            }
        }

        if (expected[0].length == 0) {
            return {
                message: () => `expected arrays of same size`,
                pass: received[0].length == 0
            }    
        }
        if (expected[0] instanceof Array && typeof expected[0][0] === "number") {
            if (received[0] instanceof Array && typeof received[0][0] === "number") {
                return toBeArrayWithValuesCloseTo2d(received, expected);
            }

            return {
                message: () => `expected arrays of same dimensionality and content`,
                pass: false
            }
        }

        return {
            message: () => `expected 1d or 2d arrays of numbers`,
            pass: false
        }
    }
});

function toBeArrayWithValuesCloseTo1d(
    received: Array<number>,
    expected: Array<number>
    ) {
        if (received.length != expected.length)
        {
            return {
                message: () => `array length ${received.length} should be the same as expected length ${expected.length}`,
                pass: false
            }
        }

        for (var index = 0; index < received.length; index++) {
            expect(received[index]).toBeCloseTo(expected[index])
        }

        return {
            message: () => `expected array values to be close to array values`,
            pass: true
        }
    }

    function toBeArrayWithValuesCloseTo2d(
        received: Array<Array<number>>,
        expected: Array<Array<number>>
        ) {
            if (received.length != expected.length)
            {
                return {
                    message: () => `array length ${received.length} should be the same as expected length ${expected.length}`,
                    pass: false
                }
            }
    
            for (var index = 0; index < received.length; index++) {

                if (received[index].length != expected[index].length)
                {
                    return {
                        message: () => `array[${index}] length ${received[index].length} should be the same as expected[${index}] length ${expected[index].length}`,
                        pass: false
                    }
                }

                for (var inner = 0; inner < received[index].length; inner++) {
                    expect(received[index][inner]).toBeCloseTo(expected[index][inner])
                }
            }
    
            return {
                message: () => `expected array values to be close to array values`,
                pass: true
            }
        }

// I am exporting nothing just so we can import this file
export default undefined;
