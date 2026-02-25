"use client";

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { useEffect, useState } from 'react';
import { UserRole } from '@/types';

export function useAuth() {
    const [user, loading, error] = useAuthState(auth);
    const [role, setRole] = useState<UserRole | null>(null);

    useEffect(() => {
        if (user) {
            // In a real app, we'd fetch the custom claims or a specific user doc
            // For now, we simulate role determination
            user.getIdTokenResult().then((result) => {
                setRole({
                    role: (result.claims.role as any) || 'buyer',
                    companyId: result.claims.companyId as string
                });
            });
        } else {
            setRole(null);
        }
    }, [user]);

    return { user, loading, error, role };
}
