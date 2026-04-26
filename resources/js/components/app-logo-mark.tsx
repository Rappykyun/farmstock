import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type AppLogoMarkProps = HTMLAttributes<HTMLDivElement> & {
    iconClassName?: string;
};

export default function AppLogoMark({
    className,
    iconClassName,
    ...props
}: AppLogoMarkProps) {
    return (
        <div
            className={cn(
                'flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-[#1F7A4D] text-white shadow-xs',
                className,
            )}
            {...props}
        >
            <AppLogoIcon className={cn('size-5', iconClassName)} />
        </div>
    );
}
