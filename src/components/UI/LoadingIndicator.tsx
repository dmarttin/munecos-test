interface LoadingIndicatorProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    className?: string;
}

export function LoadingIndicator({
    size = 'md',
    color = 'text-blue-500',
    className = ''
}: LoadingIndicatorProps) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size]} ${color} border-current border-t-transparent rounded-full animate-spin`}
                role="status"
                aria-label="Loading"
            />
        </div>
    );
}
