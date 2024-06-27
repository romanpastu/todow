import { Box, Tabs, TextInput, PasswordInput, Button, rem } from '@mantine/core';
import { IconLogin, IconUserPlus } from '@tabler/icons-react';
import { useFetcher } from '@remix-run/react';
import { db } from '~/utils/db.server';

import { createUserSession, login, register } from '~/utils/session.server';

export const action = async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const actionType = formData.get('actionType');
    // Simulated backend response
    const redirectTo = '/';
    if (actionType === 'register') {
        const userExists = await db.user.findFirst({
            where: { username },
        });
        if (userExists) {
            return {
                error: 'Username is already taken',
            };

        }
        const user = await register({ username, password });
        if (!user) {
            return { error: 'Failed to register' };
        }
        return createUserSession(user.id?.toString(), redirectTo);
    } else if (actionType === 'login') {
        const user = await login({ username, password });

        if (!user) {
            return { error: 'Invalid username or password' };
        }
        return createUserSession(user.id?.toString(), redirectTo);
    }
};

export default function LoginRoute() {
    const fetcher = useFetcher();
    const iconStyle = { width: rem(12), height: rem(12) };


    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetcher.submit({
            actionType: 'login',
        });

    }

    const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetcher.submit({
            actionType: 'register',
        });
    }

    return (
        <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
            }}
        >
            <Box style={{ width: 300 }}>
                <Tabs defaultValue="login">
                    <Tabs.List>
                        <Tabs.Tab value="login" leftSection={<IconLogin style={iconStyle} />}>
                            Login
                        </Tabs.Tab>
                        <Tabs.Tab value="register" leftSection={<IconUserPlus style={iconStyle} />}>
                            Register
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="login">
                        <fetcher.Form method="post">
                            <input type="hidden" name="actionType" value="login" />
                            <Box mt="md">
                                <TextInput
                                    name="username"
                                    label="Username"
                                    placeholder="Your username"
                                    required
                                    mb="sm"
                                />
                                <PasswordInput
                                    name="password"
                                    label="Password"
                                    placeholder="Your password"
                                    required
                                    mb="sm"
                                />
                                <Button type="submit" fullWidth mt="md" onClick={() => onLogin}>
                                    Login
                                </Button>
                            </Box>
                        </fetcher.Form>
                    </Tabs.Panel>

                    <Tabs.Panel value="register">
                        <fetcher.Form method="post" >
                            <input type="hidden" name="actionType" value="register" />
                            <Box mt="md">
                                <TextInput
                                    name="username"
                                    label="Username"
                                    placeholder="Choose a username"
                                    required
                                    mb="sm"
                                />
                                <PasswordInput
                                    name="password"
                                    label="Password"
                                    placeholder="Choose a password"
                                    required
                                    mb="sm"
                                />
                                <Button type="submit" fullWidth mt="md" onClick={() => onRegister}>
                                    Register
                                </Button>
                            </Box>
                        </fetcher.Form>
                    </Tabs.Panel>
                </Tabs>
            </Box>
        </Box>
    );
}
