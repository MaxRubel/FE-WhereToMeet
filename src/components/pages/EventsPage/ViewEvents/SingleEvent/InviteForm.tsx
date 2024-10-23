import { useSendInvite } from "@/api/events";
import { useState } from "react";

export default function InviteForm({ eventId }: any) {
    const [email, setEmail] = useState("");
    const { mutate: sendInvite, isPending, isError, error } = useSendInvite();

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        
        sendInvite(
        {
            eventId,
            inviteeEmail: email,
        },
        {
            onSuccess: (data) => {
            setEmail("");
            console.log('Invitation sent successfully:', data.message);
            },
            onError: (err) => {
            console.error('Failed to send invitation:', err.message);
            },
        }
        );
    };

    return (
        <form onSubmit={handleInvite} className="space-y-4">
            <div>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                disabled={isPending}
                />
            </div>
            
            {isError && (
                <div className="text-red-600 text-sm">
                    {error.message}
                </div>
            )}
            
            <button
                type="submit"
                disabled={isPending || !email}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
                {isPending ? 'Sending...' : 'Send Invitation'}
            </button>
        </form>
    );
}