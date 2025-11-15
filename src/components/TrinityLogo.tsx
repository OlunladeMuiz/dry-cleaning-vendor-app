import trinityLogoImage from "figma:asset/be4b2a3c4b7ca46c3821be293ac42c82690dc52a.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TrinityLogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showCleanU?: boolean;
}

export function TrinityLogo({ variant = 'full', size = 'md', className = '', showCleanU = true }: TrinityLogoProps) {
  // Logo height based on size with responsive scaling - ADJUSTED FOR NAV BAR
  const heightMap = {
    sm: 38,  // Increased for navbar
    md: 46,  // Increased for medium screens
    lg: 54,  // Increased for large screens
    xl: 56,  // Landing page size
  };

  const height = heightMap[size];

  if (variant === 'icon') {
    // Icon only - just the Trinity logo
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <ImageWithFallback
          src={trinityLogoImage} 
          alt="Trinity University Logo" 
          style={{ 
            height: `${height}px`,
            width: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>
    );
  }

  if (variant === 'wordmark') {
    // Logo with CleanU branding side by side
    return (
      <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
        <ImageWithFallback
          src={trinityLogoImage} 
          alt="Trinity University Logo" 
          style={{ 
            height: `${height}px`,
            width: 'auto',
            objectFit: 'contain'
          }}
        />
        {showCleanU && (
          <div className="flex flex-col">
            <span 
              style={{ 
                fontFamily: 'var(--font-brand)',
                fontSize: size === 'sm' ? '18px' : size === 'md' ? '22px' : size === 'lg' ? '28px' : '32px',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 20px rgba(37, 99, 235, 0.3)',
                textStroke: '0.5px rgba(37, 99, 235, 0.1)',
                WebkitTextStroke: '0.5px rgba(37, 99, 235, 0.1)',
              }}
            >
              CleanU
            </span>
            {size !== 'sm' && (
              <span 
                className="text-gray-600 dark:text-gray-400"
                style={{ 
                  fontSize: size === 'md' ? '8px' : size === 'lg' ? '10px' : '11px',
                  marginTop: '2px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                Marketplace
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full variant (default) - logo + CleanU branding
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <ImageWithFallback
        src={trinityLogoImage} 
        alt="Trinity University Logo" 
        style={{ 
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain'
        }}
      />
      {showCleanU && (
        <div className="flex flex-col">
          <span 
            style={{ 
              fontFamily: 'var(--font-brand)',
              fontSize: size === 'sm' ? '16px' : size === 'md' ? '20px' : size === 'lg' ? '24px' : '28px',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textStroke: '0.5px rgba(37, 99, 235, 0.1)',
              WebkitTextStroke: '0.5px rgba(37, 99, 235, 0.1)',
            }}
          >
            CleanU
          </span>
          {size !== 'sm' && (
            <span 
              className="text-gray-600 dark:text-gray-400"
              style={{ 
                fontSize: size === 'md' ? '8px' : size === 'lg' ? '9px' : '10px',
                marginTop: '2px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              Marketplace
            </span>
          )}
        </div>
      )}
    </div>
  );
}