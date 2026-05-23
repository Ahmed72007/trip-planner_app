import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // Hides the default top bar so we can build our own
                contentStyle: { backgroundColor: '#0F1117' }, // Forces our Dark Doodle background
                animation: 'fade', // Smooth transitions between onboarding steps
            }}
        >
            <Stack.Screen name="welcome" />
            <Stack.Screen name="sign-in" />
        </Stack>
    );
}