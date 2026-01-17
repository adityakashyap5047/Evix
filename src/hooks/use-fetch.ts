import { useState } from "react"
import { toast } from "sonner";

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

const useFetch = <T, Args extends unknown[] = unknown[]>(cb: (...args: Args) => Promise<ApiResponse<T>>) => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fn = async(...args: Args) => {
        setLoading(true);
        setError(null);

        try {
            const response = await cb(...args);
            if(response && response.success) {
                setData(response.data);
            } else {
                setError(response.error || 'An error occurred');
                toast.error(response.error || 'An error occurred');
            }
        } catch (error) {
            setError(error instanceof Error ? String(error.message) : "An error occurred");
            toast.error(error instanceof Error ? String(error.message) : "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return {data, loading, error, fn, setData};
}

export default useFetch;