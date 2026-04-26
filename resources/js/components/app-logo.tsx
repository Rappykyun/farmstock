import AppLogoMark from '@/components/app-logo-mark';

export default function AppLogo() {
    return (
        <>
            <AppLogoMark />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    FarmStock
                </span>
            </div>
        </>
    );
}
