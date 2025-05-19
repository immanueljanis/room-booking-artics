import { toast } from 'react-hot-toast';

export function notifySuccess(message) {
    toast.success(message, {
        duration: 1500,
        position: 'top-right',
    });
}

export function notifyError(message) {
    toast.error(message, {
        duration: 2500,
        position: 'top-right',
    });
}
