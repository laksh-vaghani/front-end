"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

function PageContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const [isRefresh, setIsRefresh] = useState<any>(Boolean);
    const [show, setShow] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleStatus = async () => {
            try {
                const response = await axios.post(`http://localhost:1257/connected-code?code=${code}`);
                console.log('Response:', response.data);
            } catch (error) {
                console.error('Error posting data:', error);
            }
        };

        if (code) {
            handleStatus();
        }
    }, [code]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            function getCookie(name: string) {
                const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
                return match ? decodeURIComponent(match[2]) : null;
            }

            function setCookie(name: string, value: string, days: number) {
                const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
                document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
            }

            const storedRefreshCount = parseInt(getCookie('refreshCount') || '0', 10);

            if (storedRefreshCount === 1) {
                setIsRefresh(true);
                handleShow();
                setCookie('refreshCount', '0', 1);
            } else {
                setIsRefresh(false);
                setCookie('refreshCount', (storedRefreshCount + 1).toString(), 1);
            }
        }
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRedirect = async () => {
        try {
            const response = await fetch(`http://localhost:1257/refreshed-page?code=${code}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete code');
            }
            router.push('https://front-end-hn5g.vercel.app/');
        } catch (error) {
            console.error('Error deleting code:', error);
        }
    };

    return (
        <center>
            <h3>Connected with {code}</h3>
            {isRefresh === true ? (
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleRedirect}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <></>
            )}
        </center>
    );
}

// Wrap the component with Suspense and provide a fallback UI
export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageContent />
        </Suspense>
    );
}
