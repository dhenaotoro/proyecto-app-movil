import {by, element, waitFor} from 'detox';
// check to see if the screen with screenId is visible at least 75% of the emulator screen
export const isScreenShown = async (screenId: string) => {
    await waitFor(element(by.id(screenId))).toBeVisible().withTimeout(4000);
};